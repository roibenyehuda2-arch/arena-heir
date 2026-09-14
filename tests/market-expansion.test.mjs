import assert from 'node:assert/strict';
import * as E from '../dist/duel-engine.mjs';
import {hero} from '../dist/arena-art.mjs';
for(const kind of ['dwarf','ranger','mage']){
 const r=E.newRun(kind);for(const a of E.ATTRS)r.attrs[a]=20;const before=E.stats(r);assert.equal(E.shop(r,'weapons').length+E.shop(r,'armor').length,49);r.gold=9999;assert.equal(E.buy(r,'weapons','melee:4'),false);r.crown=true;r.level=9;assert(E.buy(r,'weapons','melee:4'));assert.equal(E.stats(r).magic,before.magic+3);assert.equal(E.buy(r,'armor','defense:7'),false);r.level=15;assert(E.buy(r,'armor','defense:7'));assert(E.buy(r,'armor','boots:5'));assert(E.buy(r,'armor','shield:3'));assert(E.buy(r,'armor','helmet:2'));assert(E.buy(r,'armor','shoulders:2'));assert(E.stats(r).armor>before.armor);assert.equal(E.stats(r).hp,before.hp+24);const loaded=E.load(JSON.stringify(r));assert(loaded);assert.deepEqual(loaded.gear,r.gear);assert.equal(E.stats(loaded).armor,E.stats(r).armor);r.gear.melee=8;assert.equal(E.load(JSON.stringify(r)),null);
}
{
 const r=E.newRun('dwarf');assert.deepEqual(E.suggestGoal(r),{category:'weapons',id:'melee:1'});assert(E.setGoal(r,'weapons','melee:7'));let g=E.goalStatus(r);assert.equal(g.goldGap,1200);assert.equal(g.levelGap,14);assert.equal(g.crownGap,true);assert.equal(g.attributeGap,9);const loaded=E.load(JSON.stringify(r));assert.deepEqual(loaded.goal,r.goal);r.goal={category:'weapons',id:'made-up'};assert.equal(E.load(JSON.stringify(r)).goal,null);
}
{
 const r=E.newRun('dwarf');r.gold=110;assert(E.buy(r,'weapons','melee:1'));assert.equal(r.gold,65);r.crown=true;r.level=6;const moon=E.shop(r,'weapons').find(i=>i.id==='melee:2');assert.equal(moon.price,65);assert(E.buy(r,'weapons','melee:2'));assert.equal(r.gold,0);assert.equal(E.shop(r,'weapons').find(i=>i.id==='melee:3').locked,true);r.level=7;assert.equal(E.shop(r,'weapons').find(i=>i.id==='melee:3').locked,false);
}
{
 const r=E.newRun('mage');r.level=15;r.attrs.magic=14;const dragon=E.shop(r,'weapons').find(i=>i.id==='melee:7');assert.equal(dragon.requirement,'First Crown');r.crown=true;r.gear.melee=5;assert.equal(E.stats(r).magic,8+r.attrs.magic*3+4+3);assert.equal(E.stats(r).hp,55+r.attrs.vitality*9+12);
}
{
 const legacy=E.newRun('dwarf');delete legacy.gear.shoulders;delete legacy.gear.helmet;delete legacy.gear.shield;const loaded=E.load(JSON.stringify(legacy));assert(loaded);assert.equal(loaded.gear.shoulders,0);assert.equal(loaded.gear.helmet,0);assert.equal(loaded.gear.shield,0);
}
// Exercise the actual articulated renderer with an affine canvas recorder.
// Sprites carry the real measured dimensions of the shipped atlases, because the defect being
// guarded against was parts drawn at an aspect ratio that had nothing to do with their artwork.
function recorder(){let m=[1,0,0,1,0,0],stack=[];const boxes=[];const point=(x,y)=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];return {boxes,save(){stack.push([...m]);},restore(){m=stack.pop();},translate(x,y){m[4]+=m[0]*x+m[2]*y;m[5]+=m[1]*x+m[3]*y;},scale(x,y){m[0]*=x;m[1]*=x;m[2]*=y;m[3]*=y;},rotate(a){const c=Math.cos(a),s=Math.sin(a),[aa,b,cc,d]=m;m[0]=aa*c+cc*s;m[1]=b*c+d*s;m[2]=cc*c-aa*s;m[3]=d*c-b*s;},drawImage(im,...args){const [x,y,w,h]=args.slice(-4),pts=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(p=>point(...p));boxes.push({im,flipped:m[0]*m[3]-m[1]*m[2]<0,drawnW:w*Math.hypot(m[0],m[1]),drawnH:h*Math.hypot(m[2],m[3]),left:Math.min(...pts.map(p=>p[0])),right:Math.max(...pts.map(p=>p[0])),top:Math.min(...pts.map(p=>p[1])),bottom:Math.max(...pts.map(p=>p[1]))});}};}
// Measured from the shipped WebP atlases.
const REAL={dwarf:{head:[281,336],torso:[259,289],arm:[112,306],leg:[175,322]},
 mage:{head:[346,340],torso:[255,293],arm:[99,292],leg:[173,314]},
 ranger:{head:[352,362],torso:[256,300],arm:[96,296],leg:[170,323]}};
function stubArt(kind){
 const m=REAL[kind],im=([width,height])=>({width,height});
 const parts=Array.from({length:12},()=>({width:200,height:300})),classes=Array.from({length:12},()=>({width:200,height:300}));
 parts[0]=im(m.head);classes[0]=im(REAL.mage.head);classes[4]=im(REAL.ranger.head);
 return {art:{parts,classes},starterParts:[im(m.torso),im(m.arm),im(m.leg)]};
}
const aspect=b=>b.drawnW/b.drawnH;
let cases=0,widest=new Map();
for(const kind of ['dwarf','ranger','mage'])for(let tier=0;tier<8;tier++)for(const width of [320,360,390,430]){
 const {art,starterParts}=stubArt(kind);
 const weapon={width:110,height:180},ctx=recorder();
 const stageWidth=width-20,stageHeight=667*.29,scale=Math.min((stageHeight-65)/260,stageWidth/430,.93),x=stageWidth*.53,ground=stageHeight-28;
 const gear={melee:tier,ranged:0,defense:tier,boots:tier,shoulders:tier,helmet:tier,shield:tier,magic:0};
 hero(ctx,art,kind,x,ground,gear,{fitting:true,scale,time:0,marketGear:{weapon,weaponTier:tier,weaponSlot:'melee',starterParts}});
 const head=ctx.boxes.find(b=>b.im===art[kind==='dwarf'?'parts':'classes'][kind==='ranger'?4:0]);
 const torsoDraws=ctx.boxes.filter(b=>b.im===starterParts[0]);
 const armDraws=ctx.boxes.filter(b=>b.im===starterParts[1]);
 const legDraws=ctx.boxes.filter(b=>b.im===starterParts[2]);
 const box=ctx.boxes.find(b=>b.im===weapon);
 // Anatomy: one head, one torso, and a pair of each limb.
 assert(head,kind+' draws a head');
 assert.equal(torsoDraws.length,1,kind+' draws one torso');
 assert.equal(armDraws.length,2,kind+' draws both arms');
 assert.equal(legDraws.length,2,kind+' draws both legs');
 // Separation: the pair hangs from two distinct joints instead of stacking on one.
 assert(Math.abs(legDraws[0].left-legDraws[1].left)>6*scale,kind+' legs hang from separate hips');
 assert(Math.abs(armDraws[0].left-armDraws[1].left)>6*scale,kind+' arms hang from separate shoulders');
 // Proportion: every body part keeps the aspect ratio of its own artwork.
 for(const [name,draws,dims] of [['torso',torsoDraws,REAL[kind].torso],['arm',armDraws,REAL[kind].arm],['leg',legDraws,REAL[kind].leg]])
  for(const d of draws)assert(Math.abs(aspect(d)-dims[0]/dims[1])<.02,`${kind} ${name} keeps its natural aspect ratio`);
 assert(Math.abs(aspect(head)-REAL[kind].head[0]/REAL[kind].head[1])<.02,kind+' head keeps its natural aspect ratio');
 // Footing: the fighter stands on the ground line rather than floating or sinking.
 const feet=Math.max(...legDraws.map(b=>b.bottom));
 assert(Math.abs(feet-ground)<6*scale+2,kind+' stands on the ground line');
 assert(head.top>ground-260*scale,kind+' crown stays inside the stage');
 // Weapon: gripped clear of the face, inside the stage, and growing with tier.
 assert(box,kind+' draws the held weapon');
 assert(box.left>x+40*scale,kind+' weapon must stay outside face and torso');
 assert(box.right<stageWidth,kind+' weapon fits phone stage');
 assert(box.top>=0,kind+' weapon stays within preview');
 assert(box.bottom<=ground+4,kind+' weapon does not sink through the sand');
 if(width===390)widest.set(kind+':'+tier,box.right-box.left);
 cases++;
}
// Money buys presence: a top-tier weapon reads visibly larger than a starter one.
for(const kind of ['dwarf','ranger','mage'])
 assert(widest.get(kind+':7')>widest.get(kind+':1')*1.25,kind+' shows a clear weapon size progression');
// A broad weapon still has to stay on the stage and off the fighter's face.
for(const kind of ['dwarf','ranger','mage'])for(const shape of [{width:300,height:180},{width:120,height:320}]){
 const {art,starterParts}=stubArt(kind),ctx=recorder();
 const stageWidth=370,stageHeight=667*.29,scale=Math.min((stageHeight-65)/260,stageWidth/430,.93),x=stageWidth*.53,ground=stageHeight-28;
 hero(ctx,art,kind,x,ground,{melee:7,ranged:0,defense:0,boots:0,shoulders:0,helmet:0,shield:0,magic:0},
  {fitting:true,scale,time:0,marketGear:{weapon:shape,weaponTier:7,weaponSlot:'melee',starterParts}});
 const box=ctx.boxes.find(b=>b.im===shape);
 assert(box.right<stageWidth,kind+' broad weapon fits the phone stage');
 assert(box.left>x+40*scale,kind+' broad weapon stays off the face');
 assert(box.top>=0&&box.bottom<=ground+4,kind+' broad weapon stays within the preview');
}
console.log('Expanded catalog purchases, bonuses, unlocks and save round trips pass; rig anatomy, limb separation, natural aspect ratios, footing and weapon fit pass',cases,'class/tier/phone cases.');
