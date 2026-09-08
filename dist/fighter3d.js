import * as T from './vendor/three.module.min.js';
import {GLTFLoader} from './vendor/loaders/GLTFLoader.js';

const CLIPS={
  idle:'Idle',walk:'Walking_A',attack:'1H_Melee_Attack_Slice_Horizontal',
  attackHeavy:'1H_Melee_Attack_Chop',block:'Blocking',blockHit:'Block_Hit',
  dodge:'Dodge_Backward',hit:'Hit_A',jump:'Jump_Full_Long',death:'Death_A',cheer:'Cheer'
};

function inPlace(clip){
  const copy=clip.clone();
  for(const track of copy.tracks){
    const [node,property]=track.name.split('.');
    if(property!=='position'||!['root','hips','armature','mixamorighips'].includes(node.toLowerCase()))continue;
    const stride=track.getValueSize(),values=track.values;
    for(let i=stride;i<values.length;i+=stride){values[i]=values[0];if(stride>2)values[i+2]=values[2];}
  }
  return copy;
}

function equipment(scene,kind){
  const keep=kind==='knight'?new Set(['1H_Sword','Round_Shield']):new Set(['1H_Axe','Barbarian_Round_Shield']);
  const gear=/Sword|Shield|Axe|Mug/;
  scene.traverse(o=>{if(o.isMesh&&gear.test(o.name)&&!keep.has(o.name))o.visible=false;});
}

export async function animatedFighter(kind,side){
  const gltf=await new GLTFLoader().loadAsync(`./assets/models/${kind}.glb`);
  const root=new T.Group(),facing=new T.Group(),visual=gltf.scene;
  root.add(facing);facing.add(visual);equipment(visual,kind);
  visual.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
  visual.rotation.y=side==='player'?Math.PI/2:-Math.PI/2;
  visual.updateMatrixWorld(true);
  const box=new T.Box3().setFromObject(visual),size=new T.Vector3(),center=new T.Vector3();box.getSize(size);box.getCenter(center);
  const scale=2.5/Math.max(.01,size.y);visual.scale.setScalar(scale);visual.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);
  const mixer=new T.AnimationMixer(visual),clips={};
  for(const [semantic,name] of Object.entries(CLIPS)){
    const clip=gltf.animations.find(c=>c.name===name);if(clip)clips[semantic]=inPlace(clip);
  }
  const fighter={root,facing,visual,mixer,clips,current:null,action:null,holdUntil:0,professional:true,dead:false,guardHeld:false};
  fighter.play=(name,durationMs=0,fade=.09)=>{
    if(fighter.dead&&name!=='death')return;
    const clip=clips[name]||clips.idle;if(!clip)return;
    const next=mixer.clipAction(clip);if(fighter.action&&fighter.current===name&&['idle','walk','block'].includes(name))return;
    const previous=fighter.action;next.reset().enabled=true;next.clampWhenFinished=!['idle','walk','block'].includes(name);next.setLoop(next.clampWhenFinished?T.LoopOnce:T.LoopRepeat,Infinity);
    next.timeScale=durationMs?clip.duration/(durationMs/1000):1;next.play();if(previous&&previous!==next)next.crossFadeFrom(previous,fade,true);
    fighter.action=next;fighter.current=name;if(name==='death')fighter.dead=true;
  };
  fighter.update=dt=>{if(performance.now()>=fighter.holdUntil)mixer.update(dt);};
  fighter.play('idle',0,0);
  return fighter;
}
