import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as E from '../dist/duel-engine.mjs';
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',hidden:false,getContext:()=>({}),querySelectorAll:()=>[],showModal(){this.open=true;},close(){this.open=false;}});return elements.get(id);}
const saved=new Map(),context={E,document:{getElementById:element},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)},structuredClone,performance:{now:()=>0},matchMedia:()=>({matches:true}),setTimeout:fn=>{queueMicrotask(fn);},console};
let source=fs.readFileSync(new URL('../dist/duel.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');source=source.slice(0,source.indexOf('try{[art,town]'))+'\nglobalThis.ui={get run(){return run},get view(){return view},get training(){return training},render,go};render();';
vm.runInNewContext(source,context);
const click=async action=>{element('screen').onclick({target:{closest:()=>({dataset:{do:action},disabled:false})}});for(let i=0;i<10;i++)await Promise.resolve();};
assert.match(element('screen').innerHTML,/Who will claim/);await click('choose:dwarf');assert.equal(context.ui.view,'town');assert.match(element('screen').innerHTML,/Weaponsmith/);await click('offer');assert.equal(context.ui.view,'offer');await click('fight');assert.equal(context.ui.view,'fight');const b=context.ui.run.battle;await click('act:jump');assert.equal(b.turn,'p');assert.equal(b.count,3);assert(E.load(saved.get(E.SAVE)));
E.surrender(context.ui.run,{});context.ui.go('town');context.ui.run.gold=200;await click('shop:magic');await click('preview:sleep');await click('buy');assert(context.ui.run.spells.includes('sleep'));await click('preview:lightning');await click('train');assert(context.ui.training);assert(context.ui.training.spells.includes('lightning'));await click('leave-training');assert.equal(context.ui.training,null);assert(!context.ui.run.spells.includes('lightning'));
context.ui.run.level=3;context.ui.run.points=1;await click('tournament');assert.equal(context.ui.view,'attributes');await click('stat:strength');await click('tournament');assert(element('confirm').open);element('confirm-yes').onclick();assert.equal(context.ui.view,'tournament');assert(context.ui.run.tournament);console.log('Turn-based UI handlers: town, opponent, action/AI reply, save, shops, practice and tournament passed (mock DOM).');
