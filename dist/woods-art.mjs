import {dwarfArmPose,drawDwarfArm} from './dwarf-rig.mjs?v=dwarf-joints-1';
import {heldItem} from './market-art.mjs?v=dwarf-joints-1';
import {keyBackground} from './sprite-texture.mjs';
import {WEAPONS,ARMORS} from './woods-engine.mjs';
export async function loadArt(){
 const load=async url=>{const im=new Image();im.src=url;await im.decode();return im;};
 const [parts,foes,forest,joints]=await Promise.all(['dwarf-parts','enemies','forest','dwarf-arm-joints'].map(n=>load(`assets/crownlands/${n}.webp`)));
 function slice(im,cols,rows){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);const p=ctx.getImageData(0,0,c.width,c.height);keyBackground(p.data,c.width,c.height,cols,rows);ctx.putImageData(p,0,0);return Array.from({length:cols*rows},(_,i)=>{const w=Math.floor(c.width/cols),h=Math.floor(c.height/rows),x=i%cols*w,y=Math.floor(i/cols)*h;let l=w,t=h,r=0,b=0;for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(p.data[((y+yy)*c.width+x+xx)*4+3]>100){l=Math.min(l,xx);r=Math.max(r,xx);t=Math.min(t,yy);b=Math.max(b,yy);}const out=document.createElement('canvas');out.width=Math.max(1,r-l+1);out.height=Math.max(1,b-t+1);out.getContext('2d').drawImage(c,x+l,y+t,out.width,out.height,0,0,out.width,out.height);return out;});}
 return {parts:slice(parts,4,3),foes:slice(foes,3,2),forest,dwarfArm:slice(joints,3,1)};
}
export function drawDwarf(ctx,art,x,y,{time=0,walk=0,moving=false,face=1,weapon=0,armor=0,boots=0,attack=null,dodge=0,hurt=0,scale=1,marketGear=null,fitting=false,armAngle:poseArm=null}={}){
 ctx.save();ctx.translate(x,y);ctx.scale(face*scale,scale);
 const bob=moving?Math.abs(Math.sin(walk))*4:Math.sin(time*2.4)*2;
 const gait=moving?Math.sin(walk)*.42:0;
 if(dodge){ctx.rotate(-.24);ctx.translate(0,15);}
 ctx.globalAlpha=hurt>0&&Math.floor(time*24)%2?.55:1;
 const part=(n,x,y,w,h)=>ctx.drawImage(marketGear?.starterParts&&n>=1&&n<=3?marketGear.starterParts[n-1]:art.parts[n],x,y,w,h);
 function leg(x,a,rear=false){
  ctx.save();ctx.translate(x,rear?-66:-65);ctx.rotate(a);
  const im=marketGear?.starterParts?.[2]||art.parts[3],h=rear?62:65,w=marketGear?.starterParts?h*im.width/im.height:40;
  if(rear)ctx.filter='brightness(.88)';
  if(boots&&!marketGear?.boots)ctx.filter=`hue-rotate(${boots*18}deg) brightness(${1+boots*.1})`;
  ctx.save();if(marketGear?.boots){ctx.beginPath();ctx.rect(-50,-10,100,32);ctx.clip();}
  // Both toes follow the body's three-quarter facing; the far leg is shorter.
  ctx.drawImage(im,-w*.36,0,w,h);ctx.restore();
  if(marketGear?.boots){const boot=marketGear.bootsParts?.[rear?0:1];const bh=h-17;
  if(boot){const bw=bh*boot.width/boot.height;ctx.save();ctx.scale(-1,1);ctx.drawImage(boot,-bw*.60,h-bh,bw,bh);ctx.restore();}
  else{const im=marketGear.boots,half=im.width/2;ctx.drawImage(im,rear?0:half,0,half,im.height,-18,h-bh,38,bh);}
 }
  ctx.restore();
 }
 const armImage=marketGear?.starterParts?.[1]||art.parts[2];
 const armH=79,armW=marketGear?.starterParts?armH*armImage.width/armImage.height:38;
 const drawArm=()=>ctx.drawImage(armImage,-armW*.5,0,armW,armH);
 leg(-20,-gait,true);ctx.translate(0,-bob);

 // The atlas supplies one arm; mirror its opposite at the shoulder, not the whole rig.
 ctx.save();ctx.translate(-36,-142);ctx.rotate(.15+gait*.45);ctx.scale(-1,1);drawArm();ctx.restore();
 leg(16,gait);if(marketGear?.starterParts&&!marketGear?.armor){part(1,-51,-152,102,106);}else if(marketGear?.baseBody&&!marketGear?.armor){const im=marketGear.baseBody,sx=im.width*.24,sw=im.width*.52;ctx.drawImage(im,sx,0,sw,im.height,-55,-165,110,128);}else part(ARMORS[marketGear?.armor?0:armor].part,-51,-152,102,106);if(marketGear?.armor){const im=marketGear.armor,w=112+armor*10;ctx.drawImage(im,-w/2,-158,w,112);}if(marketGear?.shoulders){const im=marketGear.shoulders,half=im.width/2;ctx.drawImage(im,0,0,half,im.height,-83,-174,60,58);if(!art.dwarfArm||!marketGear)ctx.drawImage(im,half,0,half,im.height,23,-174,60,58);}
 if(marketGear?.shield){const im=marketGear.shield,h=78,w=h*im.width/im.height;ctx.save();ctx.translate(-36,-142);ctx.rotate(.15+gait*.45);ctx.drawImage(im,-w/2,56-h/2,w,h);ctx.restore();}
 let armAngle=fitting?-.60:-.12+gait*.5;
 if(attack){const q=attack.t/attack.duration;armAngle=q<.44?-.3-q*4:-2.06+(q-.44)*6;}
 if(poseArm!==null)armAngle=poseArm;
 if(!art.dwarfArm||!marketGear){ctx.save();ctx.translate(34,-139);ctx.rotate(armAngle);drawArm();ctx.restore();}
const jointPose=dwarfArmPose({armAngle:attack||poseArm!==null?armAngle:null,walk,moving,fitting});
if(art.dwarfArm&&marketGear)drawDwarfArm(ctx,art.dwarfArm,jointPose,()=>{},'limb');
part(0,-65,-244,130,141);if(marketGear?.helmet){const im=marketGear.helmet,fit=marketGear.helmetFit||{width:112,heightScale:.76,eyeX:.5,eyeY:.62},w=fit.width,h=w*im.height/im.width*fit.heightScale;ctx.save();ctx.translate(9,-199);if(fit.mirror)ctx.scale(-1,1);ctx.drawImage(im,-w*fit.eyeX,-h*fit.eyeY,w,h);ctx.restore();}
 if(armor&&!marketGear?.armor)part(armor===1?9:10,19,-158,55,48);
 if(armor===2&&!marketGear?.armor)part(11,-62,-254,122,94);
 if(art.dwarfArm&&marketGear){
  drawDwarfArm(ctx,art.dwarfArm,jointPose,c=>heldItem(c,marketGear.weapon,marketGear.weaponTier,fitting,marketGear.weaponGrip),'grip');
  // Shoulder armor covers the limb root, rather than sitting behind bare skin.
  if(marketGear.shoulders){const im=marketGear.shoulders;ctx.save();ctx.translate(...jointPose.shoulder);ctx.rotate(jointPose.upper);ctx.drawImage(im,im.width/2,0,im.width/2,im.height,-14,-14,40,39);ctx.restore();}
 }else{
 ctx.save();ctx.translate(34,-139);ctx.rotate(armAngle);ctx.translate(0,68);ctx.rotate(fitting?.12-armAngle:.40);if(marketGear?.weapon)heldItem(ctx,marketGear.weapon,marketGear.weaponTier,fitting,marketGear.weaponGrip);else part(WEAPONS[weapon].part,-36,-124,80,155);ctx.restore();
 // The closed fingers sit in front of the shaft, so the item is visibly held.
 if(marketGear?.weapon&&marketGear?.starterParts){ctx.save();ctx.translate(34,-139);ctx.rotate(armAngle);ctx.beginPath();ctx.rect(-armW*.5,armH*.81,armW,armH*.19);ctx.clip();drawArm();ctx.restore();}
 }

 ctx.restore();
}
export function drawItem(ctx,art,slot,tier,w,h){ctx.clearRect(0,0,w,h);const im=art.parts[(slot==='weapon'?WEAPONS:ARMORS)[tier].part];const s=Math.min((w-12)/im.width,(h-12)/im.height);ctx.drawImage(im,(w-im.width*s)/2,(h-im.height*s)/2,im.width*s,im.height*s);}
