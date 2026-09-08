import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';

function glbJson(path){
  const bytes=readFileSync(new URL(path,import.meta.url));
  assert.equal(bytes.toString('ascii',0,4),'glTF');
  const jsonLength=bytes.readUInt32LE(12);
  return JSON.parse(bytes.subarray(20,20+jsonLength).toString());
}

for(const name of ['knight','barbarian']){
  const data=glbJson(`../dist/assets/models/${name}.glb`),clips=new Set(data.animations.map(clip=>clip.name));
  assert.ok(data.skins?.length,'fighter has a rig');
  for(const clip of ['Idle','Walking_A','1H_Melee_Attack_Slice_Horizontal','1H_Melee_Attack_Chop','Blocking','Block_Hit','Dodge_Backward','Hit_A','Death_A'])assert.ok(clips.has(clip),`${name} has ${clip}`);
}
for(const file of ['sword_swing.ogg','shield_clang.ogg','body_hit.ogg','crowd_shouting.ogg','victory_jingle.ogg'])assert.ok(statSync(new URL(`../dist/assets/audio/${file}`,import.meta.url)).size>1000,`${file} is present`);
for(const file of ['world-map.webp','ember-arena.webp','miri-sheet.webp','tovin-sheet.webp','suri-sheet.webp','boar-rival-sheet.webp','equipment-sheet.webp']){
  const bytes=readFileSync(new URL(`../dist/assets/art/${file}`,import.meta.url));
  assert.ok(bytes.length>100_000,`${file} is a production-resolution illustration`);
  assert.equal(bytes.toString('ascii',0,4),'RIFF',`${file} is WebP`);
  assert.equal(bytes.toString('ascii',8,12),'WEBP',`${file} is WebP`);
}
const game=readFileSync(new URL('../dist/game2d.js',import.meta.url),'utf8'),storybook=readFileSync(new URL('../dist/storybook.css',import.meta.url),'utf8');
assert.doesNotMatch(game,/combat3d/,'production game uses the illustrated combat director');
for(const file of ['world-map.webp','ember-arena.webp','miri-sheet.webp','tovin-sheet.webp','suri-sheet.webp','boar-rival-sheet.webp','equipment-sheet.webp'])assert.match(storybook,new RegExp(file.replace('.','\\.')),`${file} is wired into the illustrated experience`);
console.log('Illustrated WebP world, arena, hero, rival and equipment assets pass. Legacy 3D rollback assets remain valid.');
