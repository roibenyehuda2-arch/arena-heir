import {CombatDirector} from './combat.js';
import {ArenaWorld} from './world3d.js';
import * as T from './vendor/three.module.min.js';

export class Combat3D extends CombatDirector {
  mount(){
    const arena=document.querySelector('.arena');if(!arena)return;
    try{
      this.world??=new ArenaWorld(this.reduced);
      const tile=side=>Number(document.querySelector(`.fighter.${side}`).style.getPropertyValue('--tile'));
      this.world.attach(arena,tile('player'),tile('enemy'),Number(arena.dataset.round||0));this.fallback=false;
    }catch(error){
      console.warn('3D graphics unavailable; using the 2D combat view.',error);this.fallback=true;
      const canvas=arena.querySelector('canvas');canvas?.replaceWith(canvas.cloneNode());
      const notice=document.createElement('p');notice.className='graphics-notice';notice.textContent='3D graphics are unavailable on this browser. You can still play in 2D.';arena.before(notice);super.mount();
    }
  }
  dispose(){this.world?.pause();super.dispose();}
  point(side){return !this.fallback&&this.world?this.world.project(side):super.point(side);}
  async tween(ms,update){
    if(this.reduced){update(1);await this.wait(65);return;}
    const start=performance.now();await new Promise(resolve=>{const tick=now=>{const p=Math.min(1,(now-start)/ms);update(p);if(p===1)resolve();else requestAnimationFrame(tick);};requestAnimationFrame(tick);});
  }
  pose3(side,pose){this.world.fighters[side].pose=pose;}
  state3(side,name,duration=0){const f=this.world.fighters[side];if(f.professional)f.play(name,duration);else{f.pose={idle:'idle',walk:'idle',block:'block',blockHit:'block',dodge:'duck',hit:'hit',jump:'jump',death:'down',attack:'strike',attackHeavy:'strike'}[name]||'idle';f.walk=name==='walk';}}
  async move3(e){
    const f=this.world.fighters[e.actor],from=f.root.position.x,to=(e.to-4)*2.1;
    this.caption(e.actor==='enemy'?'Rival advances':e.to>e.from?'Leap forward':'Leap back');
    if(e.jump){this.state3(e.actor,'jump',650);await this.wait(80);this.noise('swing');}else{this.state3(e.actor,'walk');this.noise('step');}
    await this.tween(e.jump?650:600,p=>{f.root.position.x=from+(to-from)*(p*p*(3-2*p));f.root.position.y=e.jump?Math.sin(p*Math.PI)*1.65:0;});
    f.root.position.set(to,0,0);if(this.world.framing)this.world.framing[e.actor]=to;this.state3(e.actor,'idle');this.world.burst(e.actor,0xc5a172,e.jump?1.5:.7,true);this.sync(e);await this.wait(100);
  }
  async spell3(e){
    const from=this.world.fighters[e.actor].root.position.clone(),to=this.world.fighters[e.target].root.position.clone();from.y=to.y=1.5;
    const orb=new T.Mesh(new T.IcosahedronGeometry(.15,1),new T.MeshBasicMaterial({color:e.move==='drain'?0xe973aa:0x92d86a}));this.world.scene.add(orb);this.noise('spell');
    await this.tween(460,p=>{orb.position.lerpVectors(from,to,p);orb.position.y+=Math.sin(p*Math.PI)*.3;orb.rotation.y=p*8;});this.world.scene.remove(orb);orb.geometry.dispose();orb.material.dispose();
  }
  async strike3(e){
    const f=this.world.fighters[e.actor],target=this.world.fighters[e.target],heavy=['power','heavy'].includes(e.move),magic=['venom','poison','drain'].includes(e.move),evaded=e.type==='evade',sign=e.actor==='player'?1:-1;
    const from=f.root.position.x,to=target.root.position.x-sign*2.05;
    this.caption(e.actor==='enemy'?'Rival attacks':heavy?'Heavy strike':'Your attack');
    if(e.guarded){target.guardHeld=true;this.state3(e.target,'block');}
    if(!magic){this.state3(e.actor,'walk');this.noise('step');await this.tween(230,p=>f.root.position.x=from+(to-from)*(p*p*(3-2*p)));}
    const total=heavy?900:620,contact=heavy?540:340,swing=heavy?360:220;
    if(magic){this.state3(e.actor,'attack',620);await this.wait(150);await this.spell3(e);}else{
      this.state3(e.actor,heavy?'attackHeavy':'attack',total);await this.wait(swing);this.noise('swing');
      if(evaded)this.state3(e.target,'dodge',430);await this.wait(contact-swing);
    }
    this.sync(e);
    if(evaded){this.float(e.target,'EVADED','blocked');}
    else{
      this.state3(e.target,e.guarded?'blockHit':'hit',e.guarded?320:heavy?520:380);this.noise(e.guarded?'block':'impact');this.float(e.target,e.damage?`−${e.damage}`:'BLOCK',e.guarded?'blocked':'damage');
      this.world.burst(e.target,e.guarded?0x9cdaee:magic?0x9fd977:0xffd293,heavy?2:1);this.world.slash(e.target,e.actor,{heavy,blocked:e.guarded});this.world.contact(e.target,{heavy,blocked:e.guarded});this.world.cheer=Math.min(3,this.world.cheer+(heavy?1.8:.9));
      const x=target.root.position.x;await this.tween(200,p=>target.root.position.x=x+Math.sin(p*Math.PI)*sign*(e.guarded?.07:.18));target.root.position.x=x;
    }
    await this.wait(Math.max(45,total-contact-200));target.guardHeld=false;this.state3(e.target,'idle');
    if(!magic){this.state3(e.actor,'walk');await this.tween(190,p=>f.root.position.x=to+(from-to)*(p*p*(3-2*p)));}
    this.state3(e.actor,'idle');await this.wait(40);
  }
  async play(events,before){
    if(this.fallback)return super.play(events,before);
    const actions=document.querySelector('.actions');actions?.setAttribute('aria-busy','true');this.world.busy=true;
    try{for(const e of events){
      if(e.type==='move')await this.move3(e);
      else if(e.type==='hit'||e.type==='evade')await this.strike3(e);
      else if(e.type==='stance'&&['guard','brace'].includes(e.move)){this.world.fighters.player.guardHeld=true;this.state3('player','block');this.caption('Guard raised');this.noise('block');await this.wait(280);}
      else if(e.type==='dodge'){this.state3('player','dodge',420);this.caption('Ready to dodge');await this.wait(160);}
      else if(e.type==='counter'){this.caption('PERFECT BLOCK');this.float('player','COUNTER +2','healing');this.world.cheer=2;await this.wait(180);}
      else if(e.type==='recover'){this.caption('Catching your breath');this.float('player','+3 ENERGY','healing');await this.wait(300);}
      else if(e.type==='guard'){this.world.fighters.enemy.guardHeld=true;this.state3('enemy','block');this.caption('Rival holds their guard');await this.wait(330);}
      else if(e.type==='charge'){this.state3('enemy','attackHeavy',900);this.caption('A heavy strike is coming…');await this.wait(400);}
      else if(e.type==='heal'){if(e.amount){this.float(e.target,`+${e.amount}`,'healing');this.noise('heal');await this.wait(200);}}
      else if(['poison','recoil'].includes(e.type)){this.float(e.target,`−${e.damage}`,e.type);this.world.burst(e.target,e.type==='poison'?0x9cd866:0xd89375);await this.wait(280);}
      else if(e.type==='defeat'){
        const f=this.world.fighters[e.target];this.caption(e.target==='enemy'?'VICTORY':'DEFEATED');this.state3(e.target,'death',900);this.world.cheer=3;if(e.target==='enemy')this.noise('victory');
        if(f.professional)await this.wait(900);else await this.tween(550,p=>{f.root.rotation.z=(e.target==='enemy'?-1:1)*p*Math.PI*.48;f.root.position.y=p*.25;});this.world.burst(e.target,0xc5a172,2,true);await this.wait(700);
      }
      this.sync(e);
    }}finally{actions?.removeAttribute('aria-busy');this.world.busy=false;this.world.swapFighters();}
  }
}
