import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as engine from '../dist/engine.mjs';
import {positions} from '../dist/arena-layout.mjs';
const state=engine.newRun('QA');state.bonus=3;
let click;
const app={innerHTML:'',addEventListener:(name,fn)=>{if(name==='click')click=fn;}};
const context=vm.createContext({...engine,structuredClone,console,
  CombatDirector:class{mount(){}dispose(){}},
  localStorage:{getItem:()=>JSON.stringify(state),setItem(){}},
  document:{querySelector:()=>app,addEventListener(){}}
});
const source=readFileSync(new URL('../dist/game2d.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
vm.runInContext(source,context);
await click({target:{closest:()=>({dataset:{do:'resume'}})}});
for(const side of ['player','enemy'])assert.ok(app.innerHTML.includes(`data-side="${side}"`),`${side} must have a visible combat actor`);
assert.match(app.innerHTML,/aria-label="Rival health"/);
assert.match(app.innerHTML,/Odo Copperpot/);
assert.match(app.innerHTML,/NEXT HIT \+3/);
assert.match(app.innerHTML,/painted-arena/);
for(const width of [302,320,374,390,680,900,1460])for(let p=0;p<8;p++)for(let e=p+1;e<9;e++){
  const xy=positions(width,p,e);
  assert.ok(xy.player>=60&&xy.enemy<=width-60,'actors stay on the floor');
  assert.ok(xy.enemy-xy.player>=Math.min(152,width-130)-.001,'silhouettes stay apart');
}
console.log('Saved battle renders both fighters, rival health, live arena and accurate bonus. Floor projection passes 252 position/width cases.');
