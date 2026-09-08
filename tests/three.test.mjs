import assert from 'node:assert/strict';
import {ArenaWorld} from '../dist/world3d.js';
import {Software3D} from '../dist/software3d.js';
import {updateGladiator} from '../dist/gladiator3d.js';
import {Combat3D} from '../dist/combat3d.js';
import {newRun,act} from '../dist/engine.mjs';

let drawn=0,invalid=false;
const context={fillRect(){},beginPath(){},closePath(){},fill(){drawn++;},moveTo(x,y){invalid||=!Number.isFinite(x+y);},lineTo(x,y){invalid||=!Number.isFinite(x+y);}};
globalThis.document={createElement:()=>({getContext:()=>context,addEventListener(){}}),addEventListener(){},removeEventListener(){},querySelector:()=>null};
globalThis.devicePixelRatio=1;
globalThis.cancelAnimationFrame=()=>{};
globalThis.matchMedia=()=>({matches:true});
const renderer=new Software3D(),world=new ArenaWorld(true,renderer);renderer.setSize(900,450);world.camera.aspect=2;world.camera.updateProjectionMatrix();
world.fighters.player.root.position.x=-4.2;world.fighters.enemy.root.position.x=2.1;world.cameraFollow(true);
world.scene.updateMatrixWorld();renderer.render(world.scene,world.camera);
assert.ok(drawn>1000,'real 3D mesh triangles are projected');assert.equal(invalid,false);
const f=world.fighters.player;
f.pose='windup';updateGladiator(f,1,1,true);const windup=f.arms[1].rotation.x;
f.pose='strike';updateGladiator(f,2,1,true);assert.notEqual(f.arms[1].rotation.x,windup);
f.walk=true;updateGladiator(f,2,.1,false);assert.notEqual(f.hips[0].rotation.x,f.hips[1].rotation.x);
assert.equal(world.people.count,360);assert.equal(world.arms.count,720);
const director=new Combat3D(()=>false);director.world=world;director.fallback=false;director.wait=async()=>{};director.tween=async(_,fn)=>fn(1);director.float=()=>{};director.caption=()=>{};director.noise=()=>{};
director.sync=e=>{assert.ok(Number.isFinite(e.hp)&&Number.isFinite(e.foeHp));};
const state=newRun('QA');
for(const move of ['forward','power','guard','attack']){const before=structuredClone(state),events=[];assert.ok(act(state,move,events));await director.play(events,before);assert.equal(world.fighters.player.root.position.y,0);assert.equal(world.fighters.player.root.position.x,(state.playerPos-4)*2.1);assert.equal(world.fighters.enemy.root.position.x,(state.enemyPos-4)*2.1);}
assert.ok(state.hp<state.maxHp&&state.foeHp<44,'both sides actually fight');
for(const width of [320,390,900]){world.camera.aspect=width/360;world.camera.updateProjectionMatrix();world.cameraFollow(true);assert.ok(Number.isFinite(world.camera.position.z));}
state.foeHp=1;const finalEvents=[];assert.ok(act(state,'attack',finalEvents));await director.play(finalEvents,{});assert.equal(state.stage,'reward');assert.ok(Math.abs(world.fighters.enemy.root.rotation.z)>1);
world.destroy();
console.log('3D scene, 360 spectators, skeletal swing/walk, triangle projection, event playback, HP exchange and return positions pass.');
