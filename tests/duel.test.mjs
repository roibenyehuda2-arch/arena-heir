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
// The crowd arrives bored and is woken by spectacle.
{
 const r=setup(),b=r.battle;assert.equal(b.crowd,E.CROWD_START);
 const taunt=E.actions(b,'p').find(a=>a.id==='taunt');assert(taunt&&!taunt.disabled,'a taunt is available at range');
 b.p.energy=40;assert(E.act(b,'taunt','p'));
 assert(b.crowd>E.CROWD_START,'a taunt wakes the crowd');
 assert.equal(b.p.energy,50,'a taunt costs nothing and recovers energy');
 assert.equal(b.e.rattled,1,'a taunt rattles the rival');
 assert.equal(b.turn,'e','a taunt still costs the turn');
 assert(E.act(b,E.ai(b),'e'));assert.equal(b.e.rattled,0,'rattle clears once the rival acts');
 assert(E.actions(b,'p').find(a=>a.id==='taunt').disabled,'a taunt holds a cooldown');
}
{
 const r=setup(),b=r.battle;b.p.x=13;b.e.x=14;
 assert(E.actions(b,'p').find(a=>a.id==='taunt').disabled,'there is no taunting nose to nose');
 assert.equal(E.actions(b,'p').find(a=>a.id==='taunt').reason,'Too close');
 const clean=E.actions(b,'p').find(a=>a.id==='normal').chance;b.p.rattled=1;
 assert(E.actions(b,'p').find(a=>a.id==='normal').chance<clean,'a rattled fighter aims worse');
}
{
 const r=setup(),b=r.battle;b.crowd=60;assert(E.act(b,'rest','p'));assert(b.crowd<60,'resting bores the crowd');
}
// A bored crowd pays nothing; a full house pays half again.
{
 assert.equal(E.crowdBonus(100,0),0);
 assert.equal(E.crowdBonus(100,E.CROWD_PAYS),0,'the crowd only pays once it is awake');
 assert.equal(E.crowdBonus(100,100),50,'a full crowd pays half the purse again');
 const middle=E.crowdBonus(100,60);assert(middle>0&&middle<50,'the bonus scales between');
}
// Critical blows exist and ordinary blows still happen.
{
 let crit=false,plain=false;
 for(let seed=1;seed<600&&!(crit&&plain);seed++){const r=setup(),b=r.battle;b.seed=seed;b.p.x=13;b.e.x=14;E.act(b,'normal','p');const hit=b.events.find(e=>e.type==='hit');if(hit)hit.crit?crit=true:plain=true;}
 assert(crit,'a critical blow is possible');assert(plain,'an ordinary blow is possible');
}
// The rival ladder is a named gallery, deterministic per serial.
{
 assert(E.RIVALS.length>=12,'the ladder carries a gallery of rivals');
 assert.equal(new Set(E.RIVALS.map(c=>c.name)).size,E.RIVALS.length,'every rival is a distinct fighter');
 for(const c of E.RIVALS){assert(c.name&&c.epithet&&c.taunt,'rivals carry a name, an epithet and a line');assert(['brute','bulwark','archer','caster','showman','duelist'].includes(c.style),'known fighting style');assert(Object.hasOwn(E.CLASSES,c.hero));}
 const r=E.newRun('dwarf'),first=E.offer(r);assert.equal(first.name,E.RIVALS[0].name);assert.equal(first.style,E.RIVALS[0].style);assert(first.taunt);
 const second=E.offer(r);assert.notEqual(second.name,first.name,'the ladder moves on');
 const serial=r.serial,waiting=E.nextRival(r);assert.equal(r.serial,serial,'naming who waits consumes no rival');
 assert.equal(E.offer(r).name,waiting.name,'the town and the arena name the same rival');
}
// Rivalry history is remembered and survives a save.
{
 const r=E.newRun('dwarf'),m={};E.offer(r);E.startFight(r);const name=r.battle.opponent.name;r.battle.outcome='win';
 const result=E.settle(r,m);assert.equal(r.beaten[name],1);assert.equal(result.beaten,1);
 assert.equal(E.load(JSON.stringify(r)).beaten[name],1,'rivalry history survives a save');
 assert.equal(E.nextRival(r,r.serial).beatenBefore,1,'a returning rival remembers the loss');
 assert.deepEqual(E.load(JSON.stringify({...E.newRun('dwarf'),beaten:[1,2]})).beaten,{},'a malformed record normalizes away');
 assert.deepEqual(E.load(JSON.stringify({...E.newRun('dwarf'),beaten:{Good:2,Bad:-1,Worse:'x'}})).beaten,{Good:2},'only sane counts are kept');
}
// Saves written before this release carry no crowd, rattle or rivalry fields.
{
 const legacy=E.newRun('mage');E.offer(legacy);E.startFight(legacy);
 const raw=JSON.parse(JSON.stringify(legacy));delete raw.beaten;delete raw.battle.crowd;delete raw.battle.p.rattled;delete raw.battle.e.rattled;
 const loaded=E.load(JSON.stringify(raw));
 assert(loaded,'a pre-crowd save still loads');
 assert.equal(loaded.v,1,'the save key and version are unchanged');
 assert.equal(loaded.battle.crowd,E.CROWD_START);assert.equal(loaded.battle.p.rattled,0);assert.deepEqual(loaded.beaten,{});
 assert(E.act(loaded.battle,'taunt','p'),'a resumed legacy fight accepts the new action');
}
// Each fighting style plays its own way.
{
 const r=E.newRun('dwarf');E.offer(r);E.startFight(r);const b=r.battle;
 b.opponent.style='archer';b.p.x=4;b.e.x=5;assert.equal(E.ai(b),'retreat','an archer makes room');
 b.opponent.style='brute';assert.equal(E.ai(b),'heavy','a brute swings hard up close');
 b.opponent.style='showman';b.e.x=14;b.e.cd={};assert.equal(E.ai(b),'taunt','a showman works the crowd');
 b.opponent.style='bulwark';b.e.hp=Math.round(b.e.stats.hp*.4);assert.equal(E.ai(b),'guard','a bulwark turtles when hurt');
}
// A shop can answer "does this win the fight I am about to have?".
{
 const weak=E.newRun('dwarf'),strong=E.newRun('dwarf');strong.gear.melee=7;const o=E.nextRival(weak,1);
 assert(E.hitsToDefeat(weak,o)>=1);
 assert(E.hitsToDefeat(strong,o)<E.hitsToDefeat(weak,o),'a better weapon needs fewer clean blows');
}
console.log('Crowd, taunts, criticals, named rivals, styles and legacy saves: passed');
console.log('Turn-based rules: passed');
