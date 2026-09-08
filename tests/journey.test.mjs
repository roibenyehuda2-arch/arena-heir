import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as engine from '../dist/engine.mjs';
import * as actionInfo from '../dist/action-info.mjs';

// Exercise the actual UI event handler and persistence, with a minimal DOM stub.
const source=readFileSync(new URL('../dist/game2d.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
function boot(value) {
  let stored=typeof value==='string'?value:JSON.stringify(value),click;
  const app={innerHTML:'',addEventListener:(type,fn)=>{if(type==='click')click=fn;}};
  const context=vm.createContext({...engine,...actionInfo,structuredClone,console,
    CombatDirector:class{mount(){}dispose(){}},
    localStorage:{getItem:()=>stored,setItem:(_,value)=>{stored=value;}},
    document:{querySelector:()=>app,addEventListener(){}}
  });
  vm.runInContext(source,context);
  return {app,read:()=>JSON.parse(stored),raw:()=>stored,click:dataset=>click({target:{closest:()=>({dataset})}})};
}

for (const hero of Object.keys(engine.HEROES)) {
  for(let round=0;round<7;round++)for(const choice of ['gold','gear','move']) {
    const s=engine.newRun('QA',hero);s.round=round;s.stage='reward';s.foeHp=0;s.laurels=round>=4?1:0;
    const ui=boot(s);await ui.click({do:'resume'});
    assert.match(ui.app.innerHTML,/Take the Tribute/);
    await ui.click({reward:choice});const result=ui.read();
    assert.equal(result.stage,round===6?'won':'camp');
    assert.equal(result.gold,choice==='gold'?30+round*4:0);
    assert.equal(result.moves.length,choice==='move'?1:0);
    assert.equal(result.gear.length,choice==='gear'?1:0);
    assert.equal(result.laurels,s.laurels+([3,6].includes(round)?1:0));
    const snapshot=ui.raw();await ui.click({reward:choice});assert.equal(ui.raw(),snapshot,'reward cannot be claimed twice');
    const reload=boot(ui.raw());await reload.click({do:'resume'});assert.equal(reload.app.innerHTML,ui.app.innerHTML,'reward progress survives reload');
  }
  const s=engine.newRun('QA',hero);s.stage='camp';s.gold=100;s.hp=10;
  const ui=boot(s);await ui.click({do:'resume'});
  for (const item of ['weapon','armor','heal'])await ui.click({buy:item});
  assert.equal(ui.read().gold,20);assert.equal(ui.read().hp,35);assert.equal(ui.read().weapon,s.weapon+2);assert.equal(ui.read().armor,s.armor+1);
  const snapshot=ui.raw();await ui.click({buy:'weapon'});assert.equal(ui.raw(),snapshot,'unaffordable purchase has no effect');
  await ui.click({do:'next'});assert.equal(ui.read().stage,'map');assert.equal(ui.read().round,1);assert.equal(ui.read().hp,45);
  await ui.click({do:'fight'});await ui.click({do:'exit'});
  assert.match(ui.app.innerHTML,/Continue journey/);
  const reloaded=boot(ui.raw());await reloaded.click({do:'resume'});assert.match(reloaded.app.innerHTML,/Bramble Jack/);assert.match(reloaded.app.innerHTML,new RegExp(`hero-${hero}`));
}
const full=engine.newRun();full.stage='reward';full.round=6;full.moves=['heavy','drain','brace'];
const replace=boot(full);await replace.click({do:'resume'});await replace.click({reward:'move'});
assert.match(replace.app.innerHTML,/Replace one Echo with Fairy Ring/);assert.equal(replace.read().stage,'reward');
await replace.click({do:'cancel-replace'});assert.match(replace.app.innerHTML,/Take the Tribute/);
await replace.click({reward:'move'});await replace.click({replace:'drain'});
assert.deepEqual(replace.read().moves,['heavy','crown','brace']);assert.equal(replace.read().stage,'won');
for (const bad of ['not json','null',JSON.stringify({round:0,moves:[],stage:'unknown',hp:72})])assert.doesNotMatch(boot(bad).app.innerHTML,/Continue journey/);
const legacy=engine.newRun();delete legacy.version;delete legacy.hero;delete legacy.energy;delete legacy.playerPos;delete legacy.enemyPos;delete legacy.gear;delete legacy.equipped;delete legacy.laurels;
const migrated=boot(legacy);await migrated.click({do:'resume'});await migrated.click({do:'exit'});assert.equal(migrated.read().version,2);assert.equal(migrated.read().hero,'miri');assert.equal(migrated.read().energy,6);
console.log('63 hero/round/reward cases, final Echo replacement, shop purchases, travel, save/reload and legacy migration pass through UI handlers (mock DOM; not browser QA).');
