import assert from 'node:assert/strict';
import * as E from '../dist/adventure-engine.mjs';
const fresh=(hero='miri')=>{const s=E.createRun(hero);E.enter(s);return s;};
assert.equal(E.ENCOUNTERS.length,12);
assert.deepEqual(E.ENCOUNTERS.filter(f=>f.master).map(f=>f.index),[3,7,11]);
for(const hero of Object.keys(E.CLASSES)){
  const s=fresh(hero),before=structuredClone(s);
  assert.equal(E.act(s,'ultimate'),false);assert.deepEqual(s,before,'disabled moves cannot mutate state');
  const f=E.forecast(s,'skill');assert.deepEqual(s,before,'forecast is read-only');const ev=[];E.act(s,'skill',ev);
  assert.equal(ev.filter(e=>e.type==='hit'&&e.side==='enemy').reduce((n,e)=>n+e.amount,0),f.dealt);
  assert.equal(s.hp,before.hp-f.taken);assert.equal(s.cool.skill,2);
  assert.equal(E.act(s,'skill'),false);E.act(s,'guard');assert.equal(s.cool.skill,1);E.act(s,'attack');assert.equal(s.cool.skill,0);
  const u=fresh(hero);u.round=11;u.foeHp=210;u.focus=100;const ult=[];E.act(u,'ultimate',ult);assert.equal(u.focus,0);assert(!ult.some(e=>e.type==='hit'&&e.side==='player'));
  if(hero==='suri'){assert.equal(ev.filter(e=>e.type==='hit'&&e.side==='enemy').length,2);assert.equal(ult.filter(e=>e.type==='hit'&&e.side==='enemy').length,3);}
}
const broken=fresh();broken.break=2;const be=[];E.act(broken,'skill',be);assert(be.some(e=>e.type==='break'));assert.equal(broken.hp,100);assert.equal(broken.break,0);
const guard=fresh('tovin');E.act(guard,'guard');assert.equal(guard.focus,30);assert.equal(guard.bonus,8);
const stalled=fresh('tovin');stalled.turn=1;E.act(stalled,'guard');assert.equal(stalled.focus,0,'guarding an enemy shield does not farm ultimate focus');
const late=fresh();late.turn=15;assert.equal(E.intent(late).pressure,6,'long fights apply visible pressure');
for(let round=0;round<12;round++)for(const hero of Object.keys(E.CLASSES))for(const choice of ['gold','vitality','echo']){
  const s=fresh(hero);s.round=round;s.foeHp=1;const g=s.gold;assert(E.act(s,'attack'));assert.equal(s.stage,'reward');assert(s.gold>g);
  const won=structuredClone(s);assert.equal(E.act(s,'attack'),false);assert.deepEqual(s,won,'no duplicate victory payout');
  assert(E.claim(s,choice));assert.equal(s.stage,round===11?'won':'camp');assert(E.loadRun(s));
  const claimed=structuredClone(s);assert.equal(E.claim(s,choice),false);assert.deepEqual(s,claimed,'no duplicate optional reward');
  if(round<11){s.hp=1;assert(E.travel(s));assert.equal(s.round,round+1);assert.equal(s.hp,round%4===3?E.maxHealth(s):21);assert(E.loadRun(s));}
}
const shopper=E.createRun();shopper.gold=1000;assert(E.purchase(shopper,'weapon'));assert.equal(E.stats(shopper).damage,4);assert.equal(E.purchase(shopper,'weapon'),false);
shopper.round=4;assert(E.purchase(shopper,'weapon'));assert.equal(E.stats(shopper).damage,9,'slot replacement does not stack prior tiers');
shopper.round=8;assert(E.purchase(shopper,'weapon'));assert.equal(E.stats(shopper).damage,15);assert.equal(E.purchase(shopper,'weapon'),false);
assert(E.purchase(shopper,'charm'));assert.equal(shopper.hp,E.maxHealth(shopper));assert.equal(E.purchase(shopper,'heal'),false);
shopper.hp-=50;const gold=shopper.gold;assert(E.purchase(shopper,'heal'));assert.equal(shopper.gold,gold-18);assert.equal(shopper.hp,E.maxHealth(shopper)-15);
const poor=E.createRun();poor.gold=0;const poorCopy=structuredClone(poor);assert.equal(E.purchase(poor,'armor'),false);assert.deepEqual(poor,poorCopy);
for(const mutation of [{turn:.5},{hp:0},{legacy:'yes'},{cool:[]},{stage:'camp',claimed:true},{round:12},{equipment:{weapon:9,armor:0,charm:0}},{echoes:['constructor']}])assert.equal(E.loadRun({...E.createRun(),...mutation}),null,JSON.stringify(mutation));
const dead=E.createRun();dead.hp=0;assert.equal(E.enter(dead),false);
const migrated=E.loadRun({version:2,hero:'tovin',name:'Old hero',round:5,stage:'camp',hp:35,maxHp:84,gold:72,weapon:8,armor:3,moves:['heavy']});
assert.equal(migrated.round,6);assert.equal(migrated.gold,72);assert.equal(migrated.legacyDamage,8);assert.equal(migrated.foeHp,0);assert(E.loadRun(migrated));
let completed=0;
for(const hero of Object.keys(E.CLASSES)){
  const s=E.createRun(hero);let turns=0;
  while(s.stage!=='won'&&s.stage!=='lost'&&turns<240){
    if(['map','camp'].includes(s.stage)){
      for(const slot of ['weapon','armor'])E.purchase(s,slot);
      while(s.hp<E.maxHealth(s)-25&&E.purchase(s,'heal')){}
      if(s.stage==='camp')E.travel(s);E.enter(s);
    }
    if(s.stage==='battle'){
      const options=[...E.ACTIONS,...s.echoes].filter(id=>!E.blocked(s,id)).map(id=>{const copy=structuredClone(s),f=E.forecast(s,id);E.act(copy,id);return {id,score:(f.won?1000:0)+f.dealt-f.taken*1.35+f.heal+copy.energy*.7+copy.focus*.13+copy.bonus*.5};});
      options.sort((a,b)=>b.score-a.score);assert(E.act(s,options[0].id));turns++;
    }
    if(s.stage==='reward')E.claim(s,s.echoes.includes(E.realmOf(s).echo)?'gold':'echo');
    assert(E.loadRun(s),'all naturally generated states reload');
  }
  assert.equal(s.stage,'won',`${hero} campaign must be reachable`);completed++;
}
console.log(`Crownlands: 108 reward journeys, 3 complete class campaigns, class volleys, forecasts, stance breaks, focus, equipment tiers, migration and malformed-save checks pass (${completed} completions).`);
