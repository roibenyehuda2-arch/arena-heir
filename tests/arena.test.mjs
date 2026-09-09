import assert from 'node:assert/strict';
import {newRun,emptyGear,reroll,master,stats,purchase,loadRun,serialize,fight,tick,settle} from '../dist/arena-engine.mjs';
const advance=(f,input,n)=>{for(let i=0;i<n;i++)tick(f,input,1/60);};
for(const key of ['dwarf','ranger','mage']){const r=newRun(key);assert.equal(r.gold,0);assert.deepEqual(r.gear,emptyGear());const a=reroll(r);assert.notEqual(a[0].hero,a[1].hero);const id=a[0].id;reroll(r);assert.notEqual(r.offers[0].id,id);assert.equal(r.gold,0);assert.equal(loadRun(serialize(r)).hero,key);}
for(const key of ['constructor','__proto__','thorn']){assert.throws(()=>newRun(key));assert.equal(loadRun(JSON.stringify({...newRun('dwarf'),hero:key})),null);}
let r=newRun('dwarf'),m={thorn:false};assert.equal(purchase(r,'melee',1),false);r.gold=100;assert.equal(purchase(r,'melee',2),true);assert.equal(r.gold,40);assert.equal(purchase(r,'melee',1),false);assert.equal(purchase(r,'bogus',1),false);assert.equal(loadRun(serialize(r)).gear.melee,2);
for(const patch of [{gold:-1},{wins:6},{finished:true},{gear:{...emptyGear(),boots:5}}])assert.equal(loadRun(JSON.stringify({...newRun('mage'),...patch})),null);
let f=fight(newRun('dwarf'),reroll(r)[0]);advance(f,{right:true},120);assert.equal(f.p.x,220);advance(f,{right:true},90);assert.ok(f.p.x>220);
// Actual timed melee damage, range and jump avoidance, parry immunity.
f=fight(newRun('dwarf'),master(),true);f.e.x=300;const hp=f.e.hp;advance(f,{attack:true},12);assert.equal(f.e.hp,hp);advance(f,{},8);assert.ok(f.e.hp<hp);
f=fight(newRun('dwarf'),master(),true);f.e.x=500;tick(f,{jump:true},1/60);advance(f,{},8);f.projectiles.push({owner:'e',x:f.p.x+3,y:65,v:-440,damage:25,kind:'ranged',life:1});tick(f,{},1/60);assert.equal(f.p.hp,f.p.stats.hp);assert.ok(f.lastEvade>0);
f=fight(newRun('dwarf'),master(),true);f.projectiles.push({owner:'e',x:f.p.x+3,y:65,v:-350,damage:25,kind:'magic',life:1});tick(f,{guard:true},1/60);assert.equal(f.p.hp,f.p.stats.hp);assert.equal(f.p.slow,0);assert.equal(f.parries,1);
f=fight(newRun('mage'),master(),true);tick(f,{magic:true},1/60);assert.ok(f.p.energy<70);const count=f.projectiles.length;tick(f,{magic:true},1/60);assert.equal(f.projectiles.length,count);
// Settlement is idempotent; early master and training cannot unlock or grant rewards.
r=newRun('ranger');f=fight(r,master());f.outcome='win';assert.equal(settle(r,f,m),false);assert.equal(m.thorn,false);
f=fight(r,master(),true);f.outcome='win';assert.equal(settle(r,f,m),false);
for(let i=0;i<5;i++){f=fight(r,reroll(r)[0]);f.outcome='win';const before=r.gold;assert.equal(settle(r,f,m),true);assert.equal(r.gold,before+f.offer.prize);assert.equal(settle(r,f,m),false);}
f=fight(r,master());f.outcome='win';settle(r,f,m);assert.equal(m.thorn,true);assert.equal(r.finished,true);assert.equal(loadRun(serialize(r),m).finished,true);assert.deepEqual(newRun('thorn',m).gear,emptyGear());assert.equal(newRun('thorn',m).gold,0);
// Timing-aware play can complete a complete journey for all starter classes.
for(const key of ['dwarf','ranger','mage']){r=newRun(key);m={thorn:false};for(let round=0;round<6;round++){f=fight(r,round===5?master():reroll(r)[0]);for(let n=0;n<18000&&!f.outcome;n++){const d=f.e.x-f.p.x,near=Math.abs(d)<110,bullet=f.projectiles.some(b=>b.owner==='e'&&Math.abs(b.x-f.p.x)<115),danger=f.e.windup?.kind==='attack'&&f.e.windup.t<.18;tick(f,{right:d>100,left:d<-100,attack:near&&!danger,magic:!near,ranged:!near,jump:bullet,guard:danger},1/60);}assert.equal(f.outcome,'win',`${key} round ${round} hp ${f.p.hp} foe ${f.e.hp}`);settle(r,f,m);for(const slot of ['melee','defense','magic','boots'])purchase(r,slot,Math.min(4,r.gear[slot]+1));}assert.equal(m.thorn,true);}
console.log('Arena: all classes complete six fights; timing, purchases, saves, unique rewards, master unlock and fresh runs pass.');
// A frontal projectile is parried even if its shooter has crossed behind.
f=fight(newRun('dwarf'),master(),true);f.e.x=100;f.projectiles.push({owner:'e',x:f.p.x+3,y:65,v:-350,damage:25,kind:'magic',life:1});tick(f,{guard:true},1/60);assert.equal(f.p.hp,f.p.stats.hp);assert.equal(f.p.slow,0);
