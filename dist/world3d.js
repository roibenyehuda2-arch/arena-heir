import {Software3D} from './software3d.js';
import * as T from './vendor/three.module.min.js';
import {gladiator,updateGladiator} from './gladiator3d.js';
import {animatedFighter} from './fighter3d.js';

export class ArenaWorld {
  constructor(reduced,renderer=null){
    this.reduced=reduced;this.running=false;this.cheer=0;this.time=0;this.effects=[];this.materials=[];
    try{this.renderer=renderer||new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{this.renderer=new Software3D();}
    this.renderer.domElement.className='arena-life arena-three';
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
    this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.18;
    this.scene=new T.Scene();this.scene.background=new T.Color(0x252d3c);this.scene.fog=new T.Fog(0x252d3c,25,66);
    this.camera=new T.PerspectiveCamera(38,1,.1,100);this.camera.position.set(0,5,12);
    this.scene.add(new T.HemisphereLight(0xd3e3f5,0x665039,2.2));
    const sun=new T.DirectionalLight(0xffd6a0,3.4);sun.position.set(-9,17,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-17,right:17,top:17,bottom:-17,near:1,far:65});sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;this.scene.add(sun);
    const rim=new T.DirectionalLight(0xa6c8e8,1.5);rim.position.set(8,7,-7);this.scene.add(rim);
    this.buildArena();this.fighters={player:gladiator(),enemy:gladiator(true)};this.swapToken=0;this.busy=false;
    for(const f of Object.values(this.fighters)){this.scene.add(f.root);f.shadow=new T.Mesh(new T.CircleGeometry(.55,24),new T.MeshBasicMaterial({color:0x34291f,transparent:true,opacity:.16,depthWrite:false}));f.shadow.rotation.x=-Math.PI/2;f.shadow.position.y=.014;f.shadow.scale.y=.5;this.scene.add(f.shadow);}
    this.cameraTarget=new T.Vector3(0,1,0);this.cameraPosition=new T.Vector3(0,5,12);
    this.onVisibility=()=>{if(document.hidden)this.pause();else if(this.host?.isConnected){this.observer?.observe(this.host);this.resize();this.start();}};document.addEventListener('visibilitychange',this.onVisibility);
    this.lost=e=>{e.preventDefault();this.pause();this.host?.classList.add('graphics-lost');};this.restored=()=>{this.host?.classList.remove('graphics-lost');this.start();};
    this.renderer.domElement.addEventListener('webglcontextlost',this.lost);this.renderer.domElement.addEventListener('webglcontextrestored',this.restored);
    if(!this.renderer.isSoftware)this.loadProfessionalFighters();
  }
  async loadProfessionalFighters(){
    const token=++this.swapToken;
    try{
      const [player,enemy]=await Promise.all([animatedFighter('knight','player'),animatedFighter('barbarian','enemy')]);
      if(token!==this.swapToken){player.root.clear();enemy.root.clear();return;}
      this.loadedFighters={player,enemy};this.swapFighters();
    }catch(error){console.warn('Animated fighter assets could not load; keeping the arena fallback.',error);}
  }
  swapFighters(){
    if(!this.loadedFighters||this.busy)return;
    const old=this.fighters,next=this.loadedFighters;this.loadedFighters=null;
    for(const side of ['player','enemy']){
      next[side].root.position.copy(old[side].root.position);next[side].root.scale.copy(old[side].root.scale);next[side].shadow=old[side].shadow;
      this.scene.remove(old[side].root);this.scene.add(next[side].root);
    }
    this.fighters=next;this.attachState?.();
  }
  mat(color,metalness=0,roughness=.85){const m=new T.MeshStandardMaterial({color,metalness,roughness,flatShading:true});this.materials.push(m);return m;}
  mesh(geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.receiveShadow=true;this.scene.add(m);return m;}
  buildArena(){
    const sand=this.mat(0x987651),stone=this.mat(0x4a515d),trim=this.mat(0x8e8c83),dark=this.mat(0x242b35),red=this.mat(0x782b29),gold=this.mat(0xc5a45d,.4);
    this.mesh(new T.CylinderGeometry(17,17,.4,96,1,true),sand,0,-.2,0);const ground=this.mesh(new T.RingGeometry(0,17,96,16),sand,0,.001,0);ground.rotation.x=-Math.PI/2;
    // Thin geometric scuffs and floor rings provide scale and receive real shadows.
    const mark=this.mat(0xac8a5b);
    for(let i=0;i<110;i++){const angle=i*2.399963,r=1+Math.sqrt(i/110)*14;const m=this.mesh(new T.PlaneGeometry(.12+(i%7)*.09,.012),mark,Math.sin(angle)*r,.005,Math.cos(angle)*r);m.rotation.set(-Math.PI/2,0,angle);}
    const ring=this.mesh(new T.RingGeometry(10.5,10.54,96),mark,0,.008,0);ring.rotation.x=-Math.PI/2;
    for(let row=0;row<7;row++){
      const radius=16+row*.85,y=.9+row*.63;
      const floor=this.mesh(new T.RingGeometry(radius,radius+.86,96,1,0,Math.PI),row%2?stone:trim,0,y,0);floor.rotation.x=-Math.PI/2;
      this.mesh(new T.CylinderGeometry(radius,radius,.63,96,1,true,Math.PI/2,Math.PI),stone,0,y-.315,0).material.side=T.DoubleSide;
    }
    // Repeated stone arch bays around the fighting floor.
    for(let i=0;i<24;i++){
      const a=i/24*Math.PI*2;if(Math.cos(a)>.05)continue;const r=15.7,x=Math.sin(a)*r,z=Math.cos(a)*r;
      const bay=new T.Group();bay.position.set(x,0,z);bay.rotation.y=a;this.scene.add(bay);
      const add=(g,m,px,py,pz)=>{const o=new T.Mesh(g,m);o.position.set(px,py,pz);o.castShadow=true;o.receiveShadow=true;bay.add(o);return o;};
      for(const side of [-1,1]){add(new T.BoxGeometry(.36,2.15,.55),stone,side*1.42,1.06,0);add(new T.BoxGeometry(.53,.18,.72),trim,side*1.42,2.1,0);}
      const arch=add(new T.TorusGeometry(1.40,.18,6,18,Math.PI),trim,0,2.05,0);arch.rotation.z=0;
      add(new T.BoxGeometry(2.65,2.3,.08),dark,0,1.1,.35);
      for(let bar=-1;bar<=1;bar+=.25)add(new T.BoxGeometry(.045,2.2,.06),stone,bar,1.10,.27);
      if(i%3===0){add(new T.BoxGeometry(.70,1.7,.07),red,0,4.48,-.1);add(new T.BoxGeometry(.8,.09,.11),gold,0,5.3,-.1);add(new T.BoxGeometry(.08,.8,.08),gold,0,4.52,-.16);}
    }
    this.mesh(new T.CylinderGeometry(22,22,.3,96,1,true,Math.PI/2,Math.PI),trim,0,5.42,0).material.side=T.DoubleSide;
    this.torches=[];
    for(let i=0;i<10;i++){
      const a=(i/10)*Math.PI*2,r=14.7,x=Math.sin(a)*r,z=Math.cos(a)*r;
      this.mesh(new T.CylinderGeometry(.09,.14,1.15,8),dark,x,.6,z);
      this.mesh(new T.CylinderGeometry(.28,.13,.18,12),gold,x,1.22,z);
      const fire=new T.Mesh(new T.OctahedronGeometry(.23,0),new T.MeshBasicMaterial({color:0xffad43}));fire.position.set(x,1.53,z);fire.scale.y=1.7;this.scene.add(fire);this.torches.push(fire);
    }
    this.makeCrowd();
    // A handful of distant masonry pillars completes the stadium silhouette.
    for(let i=0;i<28;i++){const a=i/28*Math.PI*2;if(Math.cos(a)>.05)continue;const p=this.mesh(new T.CylinderGeometry(.22,.29,3.3,8),trim,Math.sin(a)*22,7,Math.cos(a)*22);p.castShadow=true;}
  }
  makeCrowd(){
    const count=360;this.crowd=[];this.dummy=new T.Object3D();
    this.people=new T.InstancedMesh(new T.CapsuleGeometry(.16,.22,2,6),this.mat(0xffffff),count);
    this.heads=new T.InstancedMesh(new T.SphereGeometry(.12,6,5),this.mat(0xffffff),count);
    this.arms=new T.InstancedMesh(new T.CapsuleGeometry(.047,.32,2,5),this.mat(0xaa8060),count*2);
    this.arms.instanceMatrix.setUsage(T.DynamicDrawUsage);this.heads.instanceMatrix.setUsage(T.DynamicDrawUsage);this.people.instanceMatrix.setUsage(T.DynamicDrawUsage);
    const palette=[0x794e3c,0x455c62,0xc5ad80,0x9d814f,0x603b34,0x657359];
    for(let i=0;i<count;i++){
      const row=Math.floor(i/60),a=Math.PI/2+(i%60)/59*Math.PI+(row%2)*.015,r=16.5+row*.85;
      this.crowd.push({x:Math.sin(a)*r,z:Math.cos(a)*r,y:1.22+row*.63,a,phase:i*1.731});
      this.people.setColorAt(i,new T.Color(palette[i%palette.length]));this.heads.setColorAt(i,new T.Color([0xc29773,0x94694d,0xe0b98d][i%3]));
    }
    this.scene.add(this.people,this.heads,this.arms);this.updateCrowd(0);
  }
  updateCrowd(time){
    const d=this.dummy;
    this.crowd.forEach((p,i)=>{
      const wave=this.reduced?0:Math.sin(time*2.1+p.phase),lift=this.reduced?0:Math.max(0,Math.sin(time*5+p.phase))*(.045+this.cheer*.09);
      d.position.set(p.x,p.y+lift,p.z);d.rotation.set(0,p.a,0);d.scale.set(1,1,1);d.updateMatrix();this.people.setMatrixAt(i,d.matrix);
      d.position.y+=.39;d.updateMatrix();this.heads.setMatrixAt(i,d.matrix);
      for(let side=0;side<2;side++){const sign=side?1:-1,raise=.2+Math.max(0,wave)*(.45+this.cheer*.4);d.position.set(p.x+Math.cos(p.a)*sign*.22,p.y+.02+lift+raise*.12,p.z-Math.sin(p.a)*sign*.22);d.rotation.set(0,p.a,sign*raise);d.updateMatrix();this.arms.setMatrixAt(i*2+side,d.matrix);}
    });
    this.people.instanceMatrix.needsUpdate=true;this.heads.instanceMatrix.needsUpdate=true;this.arms.instanceMatrix.needsUpdate=true;
  }
  attach(host,playerPos,enemyPos,round=0){
    this.framing={player:(playerPos-4)*2.1,enemy:(enemyPos-4)*2.1};this.host=host;host.querySelector('canvas')?.replaceWith(this.renderer.domElement);host.classList.add('is-3d');if(this.renderer.isSoftware){const label=document.createElement('span');label.className='graphics-mode';label.textContent='3D · Compatibility mode';host.append(label);}
    this.fighters.player.root.position.set((playerPos-4)*2.1,0,0);this.fighters.enemy.root.position.set((enemyPos-4)*2.1,0,0);
    this.fighters.player.root.scale.setScalar(1.1);this.fighters.enemy.root.scale.setScalar(round===6?1.23:1.1);
    this.attachState=()=>{for(const f of Object.values(this.fighters)){if(f.professional){f.dead=false;f.guardHeld=false;f.play('idle',0,0);}else{f.pose='idle';f.walk=false;}f.root.rotation.z=0;f.root.visible=true;}};
    if(this.fighters.enemy.steel)this.fighters.enemy.steel.color.setHex([0x739799,0x89715d,0x776b94,0x75916c,0x80868e,0x546b55,0xcfaa46][round]);
    this.attachState();
    this.observer?.disconnect();this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(host);this.resize();this.cameraFollow(true);this.start();
  }
  resize(){if(!this.host)return;const w=this.host.clientWidth,h=this.host.clientHeight;this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
  cameraFollow(snap=false){
    const p=this.framing?.player??this.fighters.player.root.position.x,e=this.framing?.enemy??this.fighters.enemy.root.position.x,mid=(p+e)/2,gap=Math.abs(e-p),aspect=this.camera.aspect;
    const span=Math.max(4.7,gap+3.0),distance=Math.max(7.2,span/(2*Math.tan(19*Math.PI/180)*aspect));
    this.cameraTarget.set(mid,aspect<1.2?1.6:1.35,0);this.cameraPosition.set(mid+.8,3.6+Math.max(0,distance-9)*.15,distance);
    this.camera.position.lerp(this.cameraPosition,snap?1:.065);this.camera.position.x+=(this.shake||0)*Math.sin(this.time*80);this.shake=(this.shake||0)*.8;this.camera.lookAt(this.cameraTarget);
  }
  project(side){const p=this.fighters[side].root.position.clone();p.y+=1.9;p.project(this.camera);return{x:(p.x*.5+.5)*this.host.clientWidth,y:(-.5*p.y+.5)*this.host.clientHeight};}
  burst(side,color=0xffd494,strength=1,dust=false){
    if(this.reduced)return;const origin=this.fighters[side].root.position;
    const geo=new T.OctahedronGeometry(dust?.06:.035,0),mat=new T.MeshBasicMaterial({color,transparent:true,opacity:.9});
    for(let i=0;i<12*strength;i++){const m=new T.Mesh(geo,mat);m.position.set(origin.x,origin.y+(dust?.05:1.3),0);this.scene.add(m);this.effects.push({mesh:m,life:1,velocity:new T.Vector3((Math.random()-.5)*3,Math.random()*2+.5,(Math.random()-.5)*2),dust});}
  }
  contact(side,{heavy=false,blocked=false}={}){
    if(this.reduced)return;const f=this.fighters[side],x=f.root.position.x,flash=new T.PointLight(blocked?0x9edfff:0xffbd72,heavy?8:5,5,2);flash.position.set(x,1.4,.5);this.scene.add(flash);this.effects.push({mesh:flash,life:.22,velocity:new T.Vector3(),light:true});
    this.shake=Math.max(this.shake||0,blocked?.045:heavy?.105:.065);const stop=performance.now()+(blocked?45:heavy?105:70);for(const actor of Object.values(this.fighters))actor.holdUntil=stop;
  }
  slash(targetSide,actorSide,{heavy=false,blocked=false}={}){
    if(this.reduced)return;const target=this.fighters[targetSide].root.position,sign=actorSide==='player'?1:-1;
    const path=new T.QuadraticBezierCurve3(new T.Vector3(target.x-sign*1.35,2.05,.25),new T.Vector3(target.x-sign*.7,1.75,.5),new T.Vector3(target.x-sign*.16,1.15,.2));
    const mesh=new T.Mesh(new T.TubeGeometry(path,10,heavy?.045:.028,5,false),new T.MeshBasicMaterial({color:blocked?0xaeeaff:0xffe0a1,transparent:true,opacity:.92,depthWrite:false}));this.scene.add(mesh);this.effects.push({mesh,life:.28,velocity:new T.Vector3(),trail:true});
  }
  start(){if(this.running||document.hidden)return;this.running=true;this.last=performance.now();this.frame(this.last);}
  frame(now){if(!this.running)return;if(this.renderer.isSoftware&&now-this.last<65){this.raf=requestAnimationFrame(t=>this.frame(t));return;}const dt=Math.min(.05,(now-this.last)/1000);this.last=now;this.time+=dt;this.cheer=Math.max(0,this.cheer-dt*.7);
    for(const f of Object.values(this.fighters)){if(f.professional)f.update(dt);else updateGladiator(f,this.time,dt,this.reduced);f.shadow.position.x=f.root.position.x;f.shadow.material.opacity=.18/(1+f.root.position.y);}
    if(!this.reduced||this.time<.1)this.updateCrowd(this.time);
    if(!this.reduced)for(let i=0;i<this.torches.length;i++){const fire=this.torches[i];fire.scale.y=1.55+Math.sin(this.time*13+i)*.3;fire.rotation.y=this.time*2+i;}
    for(const e of this.effects){e.life-=dt*1.3;e.mesh.position.addScaledVector(e.velocity,dt);if(e.light)e.mesh.intensity=Math.max(0,e.life)*24;else if(e.trail){e.mesh.material.opacity=Math.max(0,e.life)*3.2;e.mesh.scale.y=Math.max(.25,e.life*3.5);}else{e.velocity.y-=dt*4;e.mesh.scale.setScalar(Math.max(.01,e.life)*(e.dust?2:1));}if(e.life<=0)this.scene.remove(e.mesh);}
    const expired=this.effects.filter(e=>e.life<=0);this.effects=this.effects.filter(e=>e.life>0);for(const e of expired){if(e.light)continue;if(!this.effects.some(a=>a.mesh.geometry===e.mesh.geometry)){e.mesh.geometry.dispose();e.mesh.material.dispose();}}
    this.cameraFollow();this.renderer.render(this.scene,this.camera);this.raf=requestAnimationFrame(t=>this.frame(t));
  }
  pause(){this.running=false;cancelAnimationFrame(this.raf);this.observer?.disconnect();}
  destroy(){this.pause();document.removeEventListener('visibilitychange',this.onVisibility);const geos=new Set(),mats=new Set();this.scene.traverse(o=>{if(o.geometry)geos.add(o.geometry);if(o.material)for(const m of [].concat(o.material))mats.add(m);});for(const g of geos)g.dispose();for(const m of mats)m.dispose();this.renderer.dispose();}
}
