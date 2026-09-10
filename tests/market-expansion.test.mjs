import assert from 'node:assert/strict';
import * as E from '../dist/duel-engine.mjs';
import {hero} from '../dist/arena-art.mjs';
for(const kind of ['dwarf','ranger','mage']){
 const r=E.newRun(kind),before=E.stats(r);assert.equal(E.shop(r,'weapons').length+E.shop(r,'armor').length,28);r.gold=9999;assert.equal(E.buy(r,'weapons','melee:4'),false);r.crown=true;r.level=6;assert(E.buy(r,'weapons','melee:4'));assert.equal(E.stats(r).magic,before.magic+3);assert.equal(E.buy(r,'armor','defense:7'),false);r.level=15;assert(E.buy(r,'armor','defense:7'));assert(E.buy(r,'armor','boots:5'));assert.equal(E.stats(r).hp,before.hp+12);const loaded=E.load(JSON.stringify(r));assert(loaded);assert.deepEqual(loaded.gear,r.gear);assert.equal(E.stats(loaded).armor,E.stats(r).armor);r.gear.melee=8;assert.equal(E.load(JSON.stringify(r)),null);
}
// Exercise the actual articulated renderer with an affine canvas recorder.
function recorder(){let m=[1,0,0,1,0,0],stack=[];const boxes=[];const point=(x,y)=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];return {boxes,save(){stack.push([...m]);},restore(){m=stack.pop();},translate(x,y){m[4]+=m[0]*x+m[2]*y;m[5]+=m[1]*x+m[3]*y;},scale(x,y){m[0]*=x;m[1]*=x;m[2]*=y;m[3]*=y;},rotate(a){const c=Math.cos(a),s=Math.sin(a),[aa,b,cc,d]=m;m[0]=aa*c+cc*s;m[1]=b*c+d*s;m[2]=cc*c-aa*s;m[3]=d*c-b*s;},drawImage(im,...args){const [x,y,w,h]=args.slice(-4),pts=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(p=>point(...p));boxes.push({im,left:Math.min(...pts.map(p=>p[0])),right:Math.max(...pts.map(p=>p[0])),top:Math.min(...pts.map(p=>p[1])),bottom:Math.max(...pts.map(p=>p[1]))});}};}
let cases=0;for(const kind of ['dwarf','ranger','mage'])for(let tier=0;tier<8;tier++)for(const width of [320,360,390,430]){
 const weapon={width:tier%2?300:110,height:180},armor={width:180,height:160},ctx=recorder(),stageWidth=width-20,stageHeight=667*.29,scale=Math.min((stageHeight-65)/260,stageWidth/430,.93),x=stageWidth*.53;
 hero(ctx,{parts:Array.from({length:12},()=>({})),classes:Array.from({length:12},()=>({}))},kind,x,stageHeight-28,{melee:tier,ranged:0,defense:tier,boots:0,magic:0},{fitting:true,scale,time:0,marketGear:{weapon,weaponTier:tier,armor:tier?armor:null}});
 const box=ctx.boxes.find(b=>b.im===weapon);assert(box);assert(box.left>x+65*scale,kind+' weapon must stay outside face and torso');assert(box.right<stageWidth,kind+' weapon fits phone stage');assert(box.top>=0,kind+' weapon stays within preview');cases++;
}
console.log('Expanded catalog purchases, bonuses, unlocks and save round trips pass; fitting bounds pass',cases,'class/tier/phone cases.');
