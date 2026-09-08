// Runtime texture compositing for the supplied solid-white enemy atlas.
// Only edge-connected neutral background is keyed out. Enclosed white eyes,
// teeth, metal highlights and costume details remain opaque.
export function keyBackground(data,width,height,columns=3,rows=2){
  const seen=new Uint8Array(width*height),queue=new Int32Array(width*height);let head=0,tail=0;
  const add=p=>{if(p<0||p>=seen.length||seen[p])return;seen[p]=1;const i=p*4,r=data[i],g=data[i+1],b=data[i+2];if(Math.min(r,g,b)>235&&Math.max(r,g,b)-Math.min(r,g,b)<18)queue[tail++]=p;};
  for(let c=0;c<columns;c++){const l=Math.floor(c*width/columns),r=Math.floor((c+1)*width/columns)-1;for(let y=0;y<height;y++){add(y*width+l);add(y*width+r);}}
  for(let row=0;row<rows;row++){const top=Math.floor(row*height/rows),bottom=Math.floor((row+1)*height/rows)-1;for(let x=0;x<width;x++){add(top*width+x);add(bottom*width+x);}}
  while(head<tail){const p=queue[head++];data[p*4+3]=0;if(p%width>0)add(p-1);if(p%width<width-1)add(p+1);add(p-width);add(p+width);}
  return data;
}
export async function prepareEnemyTexture(){
  const image=new Image();image.src=new URL('./assets/crownlands/enemies.webp',import.meta.url).href;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height);
  keyBackground(pixels.data,canvas.width,canvas.height);context.putImageData(pixels,0,0);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Unable to prepare sprite texture');
  const textureURL=URL.createObjectURL(blob);
  document.documentElement.style.setProperty('--enemy-texture',`url("${textureURL}")`);
  document.documentElement.classList.add('enemy-texture-ready');
}
