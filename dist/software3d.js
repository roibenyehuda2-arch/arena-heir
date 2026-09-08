import * as T from './vendor/three.module.min.js';

// Compatibility renderer: projects the same real 3D meshes and camera onto Canvas.
// It deliberately omits GPU shadows and uses low-detail crowd geometry.
export class Software3D {
  constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');if(!this.ctx)throw new Error('Canvas is unavailable');this.shadowMap={};this.cache=new WeakMap();this.textureCache=new WeakMap();this.pixelRatio=1;this.isSoftware=true;this.box=new T.BoxGeometry(1,1,1);this.octa=new T.OctahedronGeometry(1);this.light=new T.Vector3(-.5,1,.5).normalize();}
  setPixelRatio(r){this.pixelRatio=Math.min(r,1);}
  setSize(w,h){this.w=w;this.h=h;this.domElement.width=w*this.pixelRatio;this.domElement.height=h*this.pixelRatio;}
  dispose(){this.box.dispose();this.octa.dispose();}
  geometry(geo){
    let data=this.cache.get(geo);if(data)return data;
    const pos=geo.attributes.position.array,indices=geo.index?.array||Array.from({length:pos.length/3},(_,i)=>i),normals=[];
    for(let i=0;i<indices.length;i+=3){const a=new T.Vector3().fromArray(pos,indices[i]*3),b=new T.Vector3().fromArray(pos,indices[i+1]*3),c=new T.Vector3().fromArray(pos,indices[i+2]*3);normals.push(b.sub(a).cross(c.sub(a)).normalize());}
    data={pos,indices,normals};this.cache.set(geo,data);return data;
  }
  texture(map){
    const image=map?.image;if(!image)return null;let data=this.textureCache.get(image);if(data)return data;
    try{const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);data={pixels:c.getImageData(0,0,canvas.width,canvas.height).data,width:canvas.width,height:canvas.height};this.textureCache.set(image,data);return data;}catch{return null;}
  }
  render(scene,camera){
    const c=this.ctx,w=this.w,h=this.h;if(!w||!h)return;
    scene.updateMatrixWorld();camera.updateMatrixWorld();camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const view=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),triangles=[];
    const emit=(object,geo,mat,world,color)=>{
      const {pos,indices,normals}=this.geometry(geo),matrix=new T.Matrix4().multiplyMatrices(view,world),m=matrix.elements,normalMatrix=new T.Matrix3().getNormalMatrix(world),v=[],vertex=new T.Vector3(),texture=this.texture(mat.map),uv=geo.attributes.uv?.array;
      for(let i=0;i<pos.length;i+=3){if(object?.isSkinnedMesh)object.getVertexPosition(i/3,vertex);else vertex.fromArray(pos,i);const {x,y,z}=vertex,d=m[3]*x+m[7]*y+m[11]*z+m[15];v.push([(m[0]*x+m[4]*y+m[8]*z+m[12])/d*w/2+w/2,-(m[1]*x+m[5]*y+m[9]*z+m[13])/d*h/2+h/2,d]);}
      for(let i=0;i<indices.length;i+=3){const a=v[indices[i]],b=v[indices[i+1]],d=v[indices[i+2]];if(a[2]<.15||b[2]<.15||d[2]<.15)continue;
        if((a[0]<0&&b[0]<0&&d[0]<0)||(a[0]>w&&b[0]>w&&d[0]>w)||(a[1]<0&&b[1]<0&&d[1]<0)||(a[1]>h&&b[1]>h&&d[1]>h))continue;
        const area=(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0]);if(mat.side!==T.DoubleSide&&area>=0)continue;if(Math.abs(area)<.3)continue;
        const n=normals[i/3].clone().applyMatrix3(normalMatrix).normalize(),brightness=mat.isMeshBasicMaterial?1:.37+Math.max(0,n.dot(this.light))*.68,rgb=color.clone();
        if(texture&&uv){const ia=indices[i],ib=indices[i+1],ic=indices[i+2],u=(uv[ia*2]+uv[ib*2]+uv[ic*2])/3,vv=(uv[ia*2+1]+uv[ib*2+1]+uv[ic*2+1])/3,tx=Math.max(0,Math.min(texture.width-1,Math.floor(u*texture.width))),ty=Math.max(0,Math.min(texture.height-1,Math.floor((1-vv)*texture.height))),ti=(ty*texture.width+tx)*4;rgb.multiply(new T.Color(texture.pixels[ti]/255,texture.pixels[ti+1]/255,texture.pixels[ti+2]/255));}
        rgb.multiplyScalar(brightness).convertLinearToSRGB();const style=`rgb(${Math.min(255,rgb.r*255)|0},${Math.min(255,rgb.g*255)|0},${Math.min(255,rgb.b*255)|0})`;
        triangles.push({a,b,d,z:(a[2]+b[2]+d[2])/3,color:style,opacity:mat.opacity??1,seal:geo.type==='RingGeometry'?1.35:.45});
      }
    };
    scene.traverseVisible(o=>{
      if(!o.isMesh||!o.geometry)return;const mat=Array.isArray(o.material)?o.material[0]:o.material;if(!mat?.visible)return;
      if(o.isInstancedMesh){
        o.geometry.computeBoundingBox();const size=new T.Vector3();o.geometry.boundingBox.getSize(size);const matrix=new T.Matrix4(),color=new T.Color(),scale=new T.Matrix4().makeScale(size.x,size.y,size.z);
        for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);matrix.premultiply(o.matrixWorld).multiply(scale);if(o.instanceColor)o.getColorAt(i,color);else color.copy(mat.color);emit(null,this.box,mat,matrix,color);}
      }else emit(o,o.geometry,mat,o.matrixWorld,mat.color||new T.Color(0xffffff));
    });
    c.fillStyle='#252d3c';c.fillRect(0,0,w,h);triangles.sort((a,b)=>b.z-a.z);
    for(const t of triangles){c.globalAlpha=t.opacity;c.fillStyle=t.color;c.beginPath();c.moveTo(t.a[0],t.a[1]);c.lineTo(t.b[0],t.b[1]);c.lineTo(t.d[0],t.d[1]);c.closePath();c.fill();if(t.opacity===1){c.strokeStyle=t.color;c.lineWidth=t.seal;c.stroke?.();}}
    c.globalAlpha=1;
  }
}
