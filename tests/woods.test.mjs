import assert from 'node:assert/strict';
import {createGame,step,buy,saveGame,loadGame,returnHome,replay,WEAPONS} from '../dist/woods-engine.mjs';
const advance=(s,input,n=60)=>{for(let i=0;i<n;i++)step(s,input,1/60);};
let s=createGame();advance(s,{right:true});assert.ok(s.x>640&&s.x<660);s.x=900;s.enemies[0].x=985;const hp=s.enemies[0].hp;advance(s,{attack:true},13);assert.ok(s.enemies[0].hp<hp);const once=s.enemies[0].hp;advance(s,{},5);assert.equal(s.enemies[0].hp,once);
s=createGame();s.x=950;s.enemies[0].x=1020;s.enemies[0].state='windup';s.enemies[0].timer=.05;advance(s,{dodge:true},5);assert.equal(s.hp,100);assert.ok(s.dodgeCD>0);
s=createGame();s.x=950;s.enemies[0].x=1020;s.enemies[0].state='windup';s.enemies[0].timer=.01;step(s,{},1/60);assert.equal(s.hp,83);
s=createGame();s.gold=250;assert.equal(buy(s,'weapon',1),true);assert.equal(s.gold,190);assert.equal(buy(s,'weapon',1),false);assert.equal(buy(s,'armor',2),true);assert.equal(s.armor,2);assert.equal(buy(s,'weapon',2),false);assert.equal(buy(s,'arbitrary',2),false);assert.equal(loadGame(saveGame(s)).weapon,1);assert.equal(loadGame(saveGame(s)).armor,2);
assert.equal(loadGame('{bad'),null);for(const patch of [{gold:-2},{weapon:4},{kills:[1,1]},{x:Infinity},{hp:0}])assert.equal(loadGame(JSON.stringify({...JSON.parse(saveGame(s)),...patch})),null);
s.hp=15;returnHome(s);assert.equal(s.hp,100);assert.equal(s.gold,80);replay(s);assert.equal(s.weapon,1);assert.equal(s.enemies.length,6);
// Defeating an enemy grants coins once, even while an attack overlaps its corpse.
s=createGame();s.x=940;s.enemies[0].x=990;s.enemies[0].hp=1;advance(s,{attack:true},60);assert.equal(s.gold,25);const restored=loadGame(saveGame(s));assert.equal(restored.enemies[0].hp,0);
s=createGame();s.x=900;advance(s,{special:true},30);assert.equal(s.power,0);assert.equal(s.attack,null);
assert.ok(WEAPONS[2].damage>WEAPONS[1].damage);
console.log('Wildwoods: movement, timed hits, dodge protection, enemy damage, unique rewards, gear purchase, replay and save validation pass.');

// A timing-aware player can finish the first trail with starter gear.
s=createGame();for(let i=0;i<10800&&s.hp>0&&!s.finished;i++){const e=s.enemies.find(e=>e.hp>0),d=e.x-s.x,danger=s.enemies.some(e=>e.hp>0&&Math.abs(e.x-s.x)<160&&e.state==='windup'&&e.timer<.2);step(s,{right:d>85,left:d<-85,attack:Math.abs(d)<120&&!danger,dodge:danger,special:s.power>=60&&Math.abs(d)<160},1/60);}assert.equal(s.finished,true);assert.equal(s.gold,190);assert.equal(s.clears,1);console.log('Starter-gear full trail completed with timed dodges and six unique rewards.');

s.hp=0;s.weapon=2;const afterDefeat=loadGame(saveGame(s));assert.equal(afterDefeat.hp,100);assert.equal(afterDefeat.x,430);assert.equal(afterDefeat.weapon,2);assert.equal(afterDefeat.gold,190);

import {readFileSync,existsSync} from 'node:fs';
const entry=readFileSync(new URL('../dist/wildwoods.html',import.meta.url),'utf8');assert.match(entry,/woods.js/);assert.match(entry,/woods.css/);assert.equal(existsSync(new URL('../dist/_woods-qa.html',import.meta.url)),false);const parts=readFileSync(new URL('../dist/assets/crownlands/dwarf-parts.webp',import.meta.url));assert.equal(parts.toString('ascii',8,12),'WEBP');
