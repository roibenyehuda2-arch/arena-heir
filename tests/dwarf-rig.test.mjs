import assert from 'node:assert/strict';
import {dwarfArmPose,drawDwarfArm} from '../dist/dwarf-rig.mjs';
const parts=[{width:100,height:200},{width:100,height:180},{width:100,height:130}];
function recorder(face){let m=[face,0,0,1,0,0],stack=[];const calls=[];return {calls,point(x=0,y=0){return [m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];},save(){stack.push([...m]);},restore(){m=stack.pop();},translate(x,y){m[4]+=m[0]*x+m[2]*y;m[5]+=m[1]*x+m[3]*y;},rotate(a){const [A,B,C,D]=m,c=Math.cos(a),s=Math.sin(a);m[0]=A*c+C*s;m[1]=B*c+D*s;m[2]=C*c-A*s;m[3]=D*c-B*s;},drawImage(im){calls.push({im,grip:this.point(0,12)});}};}
for(const face of [-1,1])for(const angle of [null,-2.35,-1.5,-.15,.6,1.45]){
 const pose=dwarfArmPose({armAngle:angle}),ctx=recorder(face);let weapon;
 drawDwarfArm(ctx,parts,pose,c=>weapon=c.point());
 const hand=ctx.calls.find(c=>c.im===parts[2]);assert(hand);
 assert(Math.hypot(hand.grip[0]-weapon[0],hand.grip[1]-weapon[1])<1e-8,'shaft and fingers must share grip throughout swing');
 assert.equal(ctx.calls.length,3,'one upper arm, forearm and hand');
 const limb=recorder(face);let weapons=0;drawDwarfArm(limb,parts,pose,()=>weapons++,'limb');assert.equal(weapons,0);assert.equal(limb.calls.length,2);
 const grip=recorder(face);drawDwarfArm(grip,parts,pose,()=>weapons++,'grip');assert.equal(weapons,1);assert.equal(grip.calls.length,1);
}
console.log('Dwarf wrist/weapon attachment and split layering pass in both directions through swing extremes.');
