// Cut-out artwork on a nested skeleton. Rotation pivots are anatomical joints.
export const POSES={
 idle:{body:-3,head:5,backArm:22,backElbow:-18,arm:-25,elbow:-65,wrist:12,backLeg:16,backKnee:-12,leg:-13,knee:15},
 windup:{body:-12,head:12,backArm:-26,backElbow:-48,arm:155,elbow:55,wrist:-15,backLeg:25,backKnee:-20,leg:-24,knee:20},
 strike:{body:15,head:-10,backArm:28,backElbow:-65,arm:-80,elbow:-8,wrist:-5,backLeg:37,backKnee:-20,leg:-40,knee:38},
 block:{body:-8,head:8,backArm:-68,backElbow:-55,arm:-10,elbow:-95,wrist:15,backLeg:25,backKnee:8,leg:-25,knee:26},
 hit:{body:-20,head:-12,backArm:30,backElbow:-8,arm:20,elbow:-35,wrist:15,backLeg:22,backKnee:15,leg:-12,knee:30},
 jump:{body:12,head:-8,backArm:-35,backElbow:-40,arm:-90,elbow:-50,wrist:10,backLeg:65,backKnee:80,leg:-65,knee:80},
 duck:{body:24,head:-15,backArm:-30,backElbow:-65,arm:-55,elbow:-65,wrist:0,backLeg:50,backKnee:-50,leg:-65,knee:95},
 down:{body:30,head:22,backArm:-20,backElbow:-35,arm:-25,elbow:-15,wrist:0,backLeg:75,backKnee:-70,leg:-65,knee:105}
};
const art=(part,extra='')=>`<div class="rig-art part-${part} ${extra}"></div>`;
function arm(back){return `<div class="bone ${back?'back-arm':'arm'}" data-joint="${back?'backArm':'arm'}">${art('upperarm')}<div class="bone forearm" data-joint="${back?'backElbow':'elbow'}">${art('forearm')}<div class="bone hand" ${back?'':'data-joint="wrist"'}>${art(back?'shield':'sword')}</div></div></div>`;}
function leg(back){return `<div class="bone ${back?'back-leg':'leg'}" data-joint="${back?'backLeg':'leg'}">${art('thigh')}<div class="bone shin" data-joint="${back?'backKnee':'knee'}">${art('shin')}</div></div>`;}
export function rigMarkup(){return `<div class="rig-scale"><div class="rig-root"><div class="bone body" data-joint="body">${leg(true)}${arm(true)}${art('torso')}<div class="bone head" data-joint="head">${art('head')}</div>${leg(false)}${arm(false)}</div></div></div>`;}
export class Skeleton {
 constructor(root,reduced=false){this.root=root;this.reduced=reduced;this.joints=Object.fromEntries([...root.querySelectorAll('[data-joint]')].map(el=>[el.dataset.joint,el]));this.current={...POSES.idle};this.from={...this.current};this.target={...this.current};this.started=performance.now();this.duration=1;this.walking=false;this.poseName='idle';this.alive=true;this.tick=this.tick.bind(this);this.raf=requestAnimationFrame(this.tick);}
 pose(name,duration=180){this.poseName=name;this.from={...this.current};this.target={...(POSES[name]||POSES.idle)};this.started=performance.now();this.duration=this.reduced?1:duration;}
 walk(on){this.walking=on;if(on)this.pose('idle',120);}
 tick(time){if(!this.alive)return;let t=Math.min(1,(time-this.started)/this.duration);t=t*t*(3-2*t);const phase=time/85,walk=this.walking&&!this.reduced?Math.sin(phase):0;for(const [k,el]of Object.entries(this.joints)){this.current[k]=this.from[k]+(this.target[k]-this.from[k])*t;let extra=0;if(this.walking){if(k==='leg')extra=walk*30;if(k==='backLeg')extra=-walk*30;if(k==='knee')extra=Math.max(0,-walk)*38;if(k==='backKnee')extra=Math.max(0,walk)*38;if(k==='arm')extra=-walk*12;if(k==='backArm')extra=walk*10;}el.style.transform=`rotate(${this.current[k]+extra}deg)`;}const bob=this.reduced?0:this.walking?-Math.abs(Math.cos(phase))*4:this.poseName==='idle'?Math.sin(time/420)*1.6:0;this.root.querySelector('.rig-root').style.transform=`translateY(${bob+(this.poseName==='down'?26:this.poseName==='duck'?24:0)}px)`;this.raf=requestAnimationFrame(this.tick);}
 destroy(){this.alive=false;cancelAnimationFrame(this.raf);}
}
