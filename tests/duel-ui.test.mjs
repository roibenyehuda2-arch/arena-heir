import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as E from '../dist/duel-engine.mjs';
import {arenaLayout,healthView,actionTiming,actionPose} from '../dist/duel-presentation.mjs';
import {KEEPERS} from '../dist/market-art.mjs';
const combatCSS=fs.readFileSync(new URL('../dist/duel.css',import.meta.url),'utf8');
assert.match(combatCSS,/technique-cluster[^}]*flex-wrap:nowrap/,'late-game techniques stay in one mobile row instead of covering the HUD');
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',hidden:false,getContext:()=>({}),querySelectorAll:()=>[],showModal(){this.open=true;},close(){this.open=false;}});return elements.get(id);}
// A stand-in for the optional CC0 arena audio, so the sound path is exercised rather than skipped.
const played=[];
class FakeAudio{constructor(src){this.src=src;this.volume=1;this.playbackRate=1;this.loop=false;played.push(src);}play(){this.playing=true;return Promise.resolve();}pause(){this.playing=false;}}
const saved=new Map(),context={E,arenaLayout,healthView,actionTiming,actionPose,KEEPERS,itemURL:()=>'',document:{getElementById:element},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},structuredClone,performance:{now:()=>0},matchMedia:()=>({matches:true}),setTimeout:fn=>{queueMicrotask(fn);},console,Audio:FakeAudio};
let source=fs.readFileSync(new URL('../dist/duel.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');source=source.slice(0,source.indexOf('try{[art,town,'))+'\nglobalThis.ui={get run(){return run},get view(){return view},get training(){return training},get category(){return category},get shopSlot(){return shopSlot},get preview(){return preview},arrive(){const done=townTravel?.done;townTravel=null;locked=false;done?.();},previewRun,render,go};render();';
vm.runInNewContext(source,context);
const click=async action=>{element('screen').onclick({target:{closest:()=>({dataset:{do:action},disabled:false})}});for(let i=0;i<40;i++)await Promise.resolve();};
assert.match(element('screen').innerHTML,/Who will claim/);await click('choose:dwarf');assert.equal(context.ui.view,'intro');assert.match(element('screen').innerHTML,/NAMELESS TRIAL/);await click('skip-intro');assert.equal(context.ui.run.gold,150);assert.equal(context.ui.run.points,3);assert.equal(context.ui.run.level,1);assert.equal(E.finishTrial(context.ui.run),false);context.ui.run.gold=0;context.ui.run.points=0;context.ui.run.result=null;context.ui.go('town');assert.equal(context.ui.view,'town');assert.match(element('screen').innerHTML,/Weaponsmith/);await click('offer');assert.equal(context.ui.view,'offer');await click('fight');assert.equal(context.ui.view,'fight');const b=context.ui.run.battle;await click('act:jump');assert.equal(b.turn,'p');assert.equal(b.count,3);assert(E.load(saved.get(E.SAVE)));
E.surrender(context.ui.run,{});context.ui.go('town');context.ui.run.gold=200;await click('shop:magic');context.ui.arrive();await click('preview:sleep');await click('buy');assert(context.ui.run.spells.includes('sleep'));await click('preview:lightning');await click('train');assert(context.ui.training);assert(context.ui.training.spells.includes('lightning'));await click('leave-training');assert.equal(context.ui.training,null);assert(!context.ui.run.spells.includes('lightning'));
context.ui.go('town');assert.match(element('screen').innerHTML,/NEXT PRIZE/);assert.match(element('screen').innerHTML,/Ironbark axe/);
assert.match(element('screen').innerHTML,/warming up in the arena/,'the town names who waits in the arena');
assert(E.RIVALS.some(c=>element('screen').innerHTML.includes(c.name)),'the waiting rival is named from the ladder');
await click('shop:weapons');context.ui.arrive();assert.equal((element('screen').innerHTML.match(/class="stock-item /g)||[]).length,8);context.ui.run.gold=500;await click('preview:melee:3');assert.equal(context.ui.previewRun().gear.melee,3);assert.equal(context.ui.run.gear.melee,0);
assert.match(element('screen').innerHTML,/rival-verdict/,'the shop judges the item against the waiting rival');
assert.match(element('screen').innerHTML,/clean blows? to win/,'the verdict is given in blows');await click('goal');assert.deepEqual(context.ui.run.goal,{category:'weapons',id:'melee:3'});assert(E.load(saved.get(E.SAVE)).goal);context.ui.go('town');assert.match(element('screen').innerHTML,/YOUR GOAL/);assert.match(element('screen').innerHTML,/claim the First Crown/);await click('goal-shop');context.ui.arrive();assert.equal(context.ui.category,'weapons');assert.equal(context.ui.shopSlot,'melee');assert.equal(context.ui.preview,'melee:3');await click('preview:melee:1');await click('goal');await click('buy');assert.equal(context.ui.run.gear.melee,1);assert.equal(context.ui.run.goal,null);assert.equal(context.ui.preview,'melee:2');await click('preview:melee:0');assert.equal(context.ui.previewRun().gear.melee,0);await click('equipped');assert.equal(context.ui.previewRun().gear.melee,1);await click('slot:ranged');assert.match(element('screen').innerHTML,/throwing axe/);
E.setGoal(context.ui.run,'weapons','melee:3');context.ui.run.result={won:true,gold:47,master:false,dead:false,name:'Test'};context.ui.go('result');assert.match(element('screen').innerHTML,/YOUR GOAL/);assert.match(element('screen').innerHTML,/claim the First Crown/);context.ui.run.result=null;context.ui.run.level=3;context.ui.run.points=1;await click('tournament');assert.equal(context.ui.view,'attributes');await click('stat:strength');await click('tournament');assert(element('confirm').open);element('confirm-yes').onclick();assert.equal(context.ui.view,'tournament');assert(context.ui.run.tournament);
// The rival screen gives the opponent a character, and the fight gives the arena a crowd.
assert.match(element('screen').innerHTML,/rival-taunt/,'a tournament rival speaks');
assert.match(element('screen').innerHTML,/clean blows?<\/b> to drop/,'the rival screen reads the matchup');
assert.match(element('screen').innerHTML,/from the crowd/,'the rival screen advertises the crowd purse');
await click('fight');assert.equal(context.ui.view,'fight');
assert.match(element('screen').innerHTML,/health/,'the fight exposes health meters');
assert.match(element('screen').innerHTML,/0 HP/,'the finish condition is explicit');
assert.match(element('screen').innerHTML,/data-do="act:taunt"/,'a taunt is offered');
assert.match(element('screen').innerHTML,/simple-controls/,'the four-category controls are present');
assert.match(element('screen').innerHTML,/combat-recap/,'the last two combat beats remain visible');
for(const group of ['move','attack','defend','skill'])assert.match(element('screen').innerHTML,new RegExp('data-do="group:'+group+'"'));
await click('group:attack');assert.match(element('screen').innerHTML,/data-do="act:charge"/,'the far-range cluster offers a charge');
await click('group:move');played.length=0;await click('act:taunt');
assert(played.some(s=>s.includes('crowd_shouting')),'the crowd is heard once the fight is under way');
assert(context.ui.run.battle.crowd>E.CROWD_START,'the taunt moved the meter');
assert.equal(context.ui.run.battle.turn,'p','the rival replies before another player action');
context.ui.run.battle.e.rattled=1;context.ui.render();assert.match(element('screen').innerHTML,/Rattled/,'a rattled rival is reported in the HUD');context.ui.run.battle.e.rattled=0;
// Muting stops the arena without touching the run.
played.length=0;element('sound').onclick();assert.equal(JSON.parse(saved.get(E.META)).sound,false);assert.match(element('sound').textContent,/off/);
await click('act:rest');assert.equal(played.length,0,'a muted arena creates no audio');
element('sound').onclick();assert.match(element('sound').textContent,/on/);
console.log('Turn-based UI handlers: town, opponent, action/AI reply, save, shop goals, practice and tournament passed (mock DOM).');
console.log('Crowd meter, taunt button, rival character, shop verdict and optional audio passed (mock DOM).');
// The last hit stays in the arena. Reward settlement requires Continue and occurs once.
await click('choose:dwarf');await click('trial');
let terminal=context.ui.run.battle;terminal.p.x=10;terminal.e.x=11;terminal.e.hp=1;terminal.seed=1;
await click('act:quick');assert.equal(context.ui.view,'fight');assert.equal(terminal.e.hp,0);
assert.match(element('screen').innerHTML,/VICTORY!/);assert.match(element('screen').innerHTML,/finish-bout/);
assert.equal(context.ui.run.gold,0);assert.equal(E.load(saved.get(E.SAVE)).battle.outcome,'win');
await click('finish-bout');assert.equal(context.ui.run.gold,150);assert.equal(context.ui.view,'result');
await click('finish-bout');assert.equal(context.ui.run.gold,150);
await click('choose:dwarf');await click('trial');
terminal=context.ui.run.battle;terminal.p.x=10;terminal.e.x=11;terminal.p.hp=1;terminal.seed=1;
await click('act:rest');assert.equal(terminal.p.hp,0);assert.equal(context.ui.view,'fight');
assert.match(element('screen').innerHTML,/DEFEATED/);await click('finish-bout');
assert.equal(context.ui.run.gold,0);assert.equal(context.ui.run.dead,false);assert.match(element('screen').innerHTML,/Retry trial/);
console.log('Victory/defeat remain in the arena, zero health is visible, and rewards settle once after Continue.');
