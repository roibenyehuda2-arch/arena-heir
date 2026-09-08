import assert from 'node:assert/strict';
import {newRun,act,unavailable} from '../dist/engine.mjs';
import {actionDescription,actionForecast,guardAmount,rangeHint} from '../dist/action-info.mjs';

for (const [hero, strike, crush, block, counter, dodge] of [['miri',10,17,12,3,4],['tovin',10,20,14,2,4],['suri',8,17,12,2,5]]) {
  const s=newRun('QA',hero);s.enemyPos=3;s.energy=4;
  assert.match(actionDescription(s,'attack'),new RegExp(`^${strike} base damage`));
  assert.match(actionDescription(s,'power'),new RegExp(`^${crush} base damage`));
  assert.equal(guardAmount(s),block);
  assert.match(actionDescription(s,'guard'),new RegExp(`Block ${block}.*\\+${counter}`));
  assert.match(actionDescription(s,'dodge'),new RegExp(`\\+${dodge}`));
  for (const [id,damage] of [['attack',strike],['power',crush]]) {
    const before=structuredClone(s),copy=structuredClone(s),events=[];
    const forecast=actionForecast(s,id);act(copy,id,events);
    assert.match(forecast,new RegExp(`^${damage+s.weapon-1} damage`));
    assert.deepEqual(s,before,'forecast must not mutate the live run');
  }
  const guarded=structuredClone(s);act(guarded,'guard');assert.equal(guarded.bonus,counter);assert.equal(guarded.energy,5);
  const dodged=structuredClone(s);act(dodged,'dodge');assert.equal(dodged.bonus,dodge);
  s.enemyPos=4;
  assert.equal(unavailable(s,'attack'),hero==='suri'?'':'Need range 1');
  assert.equal(rangeHint(s).includes('in reach'),hero==='suri');
}
const poisoned=newRun();poisoned.enemyPos=3;poisoned.poison=2;
assert.match(actionForecast(poisoned,'guard'),/No hit taken.*Poison costs 3 health/);
const recoil=newRun();recoil.enemyPos=3;recoil.moves=['heavy'];
assert.match(actionForecast(recoil,'heavy'),/Recoil costs 4 health/);
const charged=newRun();charged.enemyPos=3;charged.bonus=7;
assert.match(actionForecast(charged,'guard'),/Next \+7/);
console.log('Hero-specific copy, range, hit forecasts, guard/dodge bonuses, poison and recoil pass.');
