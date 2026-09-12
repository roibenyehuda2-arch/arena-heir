import {heldItem} from './market-art.mjs?v=nameless-trial-2';
import {keyBackground} from './sprite-texture.mjs';
import {WEAPONS,ARMORS} from './woods-engine.mjs';
export async function loadArt(){
 const load=async url=>{const im=new Image();im.src=url;await im.decode();return im;};
 const [parts,foes,forest]=await Promise.all(['dwarf-parts','enemies','forest'].map(n=>load(`assets/crownlands/${n}.webp`)));
 function slice(im,cols,rows){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);const p=ctx.getImageData(0,0,c.width,c.height);keyBackground(p.data,c.width,c.height,cols,rows);ctx.putImageData(p,0,0);return Array.from({length:cols*rows},(_,i)=>{const w=Math.floor(c.width/cols),h=Math.floor(c.height/rows),x=i%cols*w,y=Math.floor(i/cols)*h;let l=w,t=h,r=0,b=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(p.data[((y+yy)*c.width+x+xx)*4+3]>100){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);}const out=document.createElement('canvas');out.width=Math.max(1,r-l+1);out.height=Math.max(1,b-t+1);out.getContext('2d').drawImage(c,x+l,y+t,out.width,out.height,0,0,out.width,out.height);return out;});}
 return {parts:slice(parts,4,3),foes:slice(foes,3,2),forest};
}
export function drawDwarf(ctx,art,x,y,{time=0,walk=0,moving=false,face=1,weapon=0,armor=0,boots=0,attack=null,dodge=0,hurt=0,scale=1,marketGear=null,fitting=false}={}){
 ctx.save();ctx.translate(x,y);ctx.scale(face*scale,scale);
 const bob=moving?Math.abs(Math.sin(walk))*4:Math.sin(time*2.4)*2;
 const gait=moving?Math.sin(walk)*.42:0;
 if(dodge){ctx.rotate(-.24);ctx.translate(0,15);}
 ctx.globalAlpha=hurt>0&&Math.floor(time*24)%2?.55:1;
 const part=(n,x,y,w,h)=>ctx.drawImage(art.parts[n],x,y,w,h);
 function leg(x,a){ctx.save();ctx.translate(x,-61);ctx.rotate(a);if(boots&&!marketGear?.boots)ctx.filter=`hue-rotate(${boots*18}deg) brightness(${1+boots*.1})`;part(3,-19,0,40,65);if(marketGear?.boots){const im=marketGear.boots;ctx.drawImage(im,x<0?0:im.width/2,0,im.width/2,im.height,-23,20,46,48+boots*3);}ctx.restore();}
 leg(-21,-gait);ctx.translate(0,-bob);
 ctx.save();ctx.translate(-36,-142);ctx.rotate(.15+gait*.45);part(2,-18,0,38,80);ctx.restore();
 leg(17,gait);part(ARMORS[marketGear?.armor?0:armor].part,-51,-152,102,106);if(marketGear?.armor){const im=marketGear.armor,w=112+armor*10;ctx.drawImage(im,-w/2,-158,w,112);}
 let armAngle=fitting?-.85:-.12+gait*.5;
 if(attack){const q=attack.t/attack.duration;armAngle=q<.44?-.3-q*4:-2.06+(q-.44)*6;}
 ctx.save();ctx.translate(34,-139);ctx.rotate(armAngle);part(2,-19,-2,38,81);
 ctx.restore();
 part(0,-65,-244,130,141);
 if(armor&&!marketGear?.armor)part(armor===1?9:10,19,-158,55,48);
 if(armor===2&&!marketGear?.armor)part(11,-62,-254,122,94);
 ctx.save();ctx.translate(34,-139);ctx.rotate(armAngle);ctx.translate(4,fitting?65:60);ctx.rotate(fitting?.12-armAngle:.40);if(marketGear?.weapon)heldItem(ctx,marketGear.weapon,marketGear.weaponTier,fitting);else part(WEAPONS[weapon].part,-36,-124,80,155);ctx.restore();
 ctx.restore();
}
export function drawItem(ctx,art,slot,tier,w,h){ctx.clearRect(0,0,w,h);const im=art.parts[(slot==='weapon'?WEAPONS:ARMORS)[tier].part];const s=Math.min((w-12)/im.width,(h-12)/im.height);ctx.drawImage(im,(w-im.width*s)/2,(h-im.height*s)/2,im.width*s,im.height*s);}
