import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as E from '../dist/adventure-engine.mjs';
const source=readFileSync(new URL('../dist/adventure.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
function boot(s){let click;const storage=new Map([['arena-heir-crownlands-v3',JSON.stringify(s)]]);const element=()=>({textContent:'',style:{},classList:{add(){}},append(){},remove(){},getBoundingClientRect:()=>({left:0,width:150}),animate(){return{finished:Promise.resolve()}}});
 const app={innerHTML:'',addEventListener:(type,fn)=>{if(type==='click')click=fn;},querySelectorAll:()=>[],querySelector:selector=>selector.includes('health')?null:selector==='#hero-name'?{value:'Tester'}:element()};
 const context=vm.createContext({...E,prepareEnemyTexture:async()=>{},structuredClone,console,setTimeout:r=>r(),matchMedia:()=>({matches:true}),window:{scrollTo(){}},document:{querySelector:s=>s==='#app'?app:null,addEventListener(){},createElement:element},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
 vm.runInContext(source,context);return{app,read:()=>JSON.parse(storage.get('arena-heir-crownlands-v3')),click:dataset=>click({target:{closest:()=>({dataset})}})};}
for(const hero of Object.keys(E.CLASSES)){
 const s=E.createRun(hero);const ui=boot(s);await ui.click({do:'resume'});assert.match(ui.app.innerHTML,/Visit equipment shop/);
 await ui.click({do:'fight'});assert.match(ui.app.innerHTML,/ENEMY’S NEXT MOVE/);assert.match(ui.app.innerHTML,new RegExp(`hero-${hero}`));
 await ui.click({action:'skill'});assert.equal(ui.read().turn,1);await ui.click({do:'exit'});assert.match(ui.app.innerHTML,/Continue journey/);
 const reload=boot(ui.read());await reload.click({do:'resume'});assert.match(reload.app.innerHTML,/TURN 2/);
 for(const round of [0,3,4,7,8,11]){const reward=E.createRun(hero);reward.round=round;E.enter(reward);reward.foeHp=1;E.act(reward,'attack');const r=boot(reward);await r.click({do:'resume'});assert.match(r.app.innerHTML,/Choose an extra reward/);await r.click({reward:'gold'});assert.equal(r.read().stage,round===11?'won':'camp');if(round<11){await r.click({do:'shop'});assert.match(r.app.innerHTML,/THE WANDERING FORGE/);const g=r.read().gold;await r.click({buy:'weapon'});assert.equal(r.read().gold,g-45);await r.click({do:'back'});await r.click({do:'travel'});assert.equal(r.read().round,round+1);}}
}
console.log('Crownlands production UI handlers: class selection state, combat playback, save/reload, all realm rewards, named purchases and travel pass (mock DOM).');
