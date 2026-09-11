import assert from 'node:assert/strict';
import * as E from '../dist/duel-engine.mjs';
const setup=()=>{const r=E.newRun('dwarf');E.offer(r);E.startFight(r);return r;};
{
 const r=setup(),b=r.battle;assert.equal(b.p.stats.ranged,0);assert.deepEqual(b.p.spells,[]);assert.equal(E.act(b,'normal','p'),false);assert.equal(b.turn,'p');assert(E.act(b,'jump','p'));assert.equal(b.turn,'e');const x=b.p.x;assert.equal(E.act(b,'jump','p'),false);assert.equal(b.p.x,x);assert(E.act(b,E.ai(b),'e'));assert.equal(b.turn,'p');
 const copy=E.load(JSON.stringify(r));assert(copy);assert.deepEqual(copy.battle.p,b.p);E.act(b,'jump');E.act(copy.battle,'jump');assert.equal(copy.battle.seed,b.seed);
}
{
 const r=setup(),b=r.battle;b.p.spells=['sleep','lightning','frost','shield'];b.seed=1;const x=b.e.x;assert(E.act(b,'sleep'));assert.equal(b.turn,'p');assert.equal(b.e.x,x);assert(E.actions(b).find(a=>a.id==='sleep').disabled);assert(E.act(b,'lightning'));assert(b.e.hp<b.e.stats.hp);assert.equal(b.turn,'e');
}
{
 const r=setup();r.gold=10;E.surrender(r,{});assert.equal(r.gold,0);assert.equal(r.dead,false);assert.equal(r.level,1);assert.equal(E.settle(r,{}),false);
}
{
 const r=E.newRun('dwarf'),m={};assert.equal(E.enterTournament(r),false);r.level=3;r.points=3;assert.equal(E.enterTournament(r),false);for(let i=0;i<3;i++)assert(E.allocate(r,'strength'));assert(E.enterTournament(r));assert.equal(E.buy(r,'magic','sleep'),false);for(let i=0;i<3;i++){assert(E.startFight(r));r.battle.outcome='win';E.settle(r,m);while(r.points)E.allocate(r,'vitality');}assert(r.crown);assert(m.thorn);assert.equal(r.gold,430);const fresh=E.newRun('thorn',m);assert.equal(fresh.level,1);assert.equal(fresh.gear.melee,0);assert.equal(fresh.gold,0);assert(E.buy(r,'magic','meteor'));assert.equal(E.shop(r,'weapons').find(i=>i.tier===2).locked,false);assert.equal(E.shop(r,'weapons').find(i=>i.tier===3).locked,true);
 const doomed=E.newRun('ranger');doomed.level=3;E.enterTournament(doomed);E.startFight(doomed);E.surrender(doomed,m);assert(doomed.dead);assert.equal(E.startFight(doomed),false);
}
{
 const r=E.newRun('dwarf');r.gold=200;assert(E.buy(r,'weapons','ranged:1'));assert(E.stats(r).ranged>0);assert(E.buy(r,'magic','sleep'));assert.equal(E.buy(r,'weapons','melee:2'),false);assert.equal(E.load('{}'),null);
}
{
 const r=E.newRun('dwarf');assert.equal(E.offer(r).gear.melee,0);r.offer=null;r.crown=true;r.level=15;assert(E.offer(r).gear.melee>2,'high-level rivals should showcase advanced market gear');
}
// Complete actual ordinary fights and all three tournament fights with each class.
for(const kind of ['dwarf','ranger','mage']){
 const r=E.newRun(kind),m={};
 function fight(){assert(E.startFight(r));const b=r.battle;let turns=0;while(!b.outcome&&turns++<600){if(b.turn==='e'){assert(E.act(b,E.ai(b),'e'));continue;}const available=E.actions(b).filter(a=>!a.disabled);const pick=b.p.energy<18?'rest':available.filter(a=>a.damage).sort((a,c)=>c.damage*c.chance-a.damage*a.chance)[0]?.id||'jump';assert(E.act(b,pick,'p'));}assert(b.outcome,'fight must end');const result=E.settle(r,m);while(r.points)E.allocate(r,r.attrs.vitality<8?'vitality':'strength');return result.won;}
 let wins=0;for(let i=0;i<12&&wins<5;i++){E.offer(r);if(fight())wins++;if(r.gold>=45)E.buy(r,'weapons','melee:1');if(r.gold>=45)E.buy(r,'armor','defense:1');if(r.gold>=65)E.buy(r,'magic','lightning');}assert(wins>=2,kind+' can progress in ordinary duels');assert(E.enterTournament(r));for(let i=0;i<3;i++)assert(fight(),kind+' wins tournament round '+i);assert(m.thorn);console.log(kind,'completed crown at level',r.level);
}
console.log('Turn-based rules: passed');
