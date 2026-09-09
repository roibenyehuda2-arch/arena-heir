// Fixed-step, DOM-independent action combat. Distances are world pixels.
export const SAVE_KEY='arena-heir-wildwoods-v1';
export const WEAPONS=[{name:'Worn axe',price:0,damage:12,part:4},{name:'Ironheart',price:60,damage:20,part:5},{name:'Emberfang',price:160,damage:31,part:6}];
export const ARMORS=[{name:'Work clothes',price:0,armor:0,part:1},{name:'Trail leather',price:40,armor:3,part:7},{name:'Mountain steel',price:110,armor:7,part:8}];
export const WORLD=3400,FORGE=300;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createGame(){return {v:1,x:430,hp:100,gold:0,weapon:0,armor:0,clears:0,kills:[],time:0,face:1,walk:0,attack:null,combo:0,comboUntil:0,dodge:0,dodgeCD:0,power:0,hurt:0,enemies:spawn(),drops:[],events:[],finished:false};}
function spawn(){return [980,1300,1660,2050,2450,2920].map((x,i)=>({id:i,x,home:x,kind:i===5?'master':i%2?'wisp':'guard',hp:i===5?150:i%2?48:60,maxHp:i===5?150:i%2?48:60,state:'idle',timer:0,face:-1,hurt:0,hit:false}));}
export function saveGame(s){return JSON.stringify({v:1,x:s.hp<=0?430:Math.round(s.x),hp:s.hp<=0?100:Math.ceil(s.hp),gold:s.gold,weapon:s.weapon,armor:s.armor,clears:s.clears,kills:s.enemies.filter(e=>e.hp<=0).map(e=>e.id),power:Math.round(s.power)});}
export function loadGame(raw){try{const p=JSON.parse(raw);if(p.v!==1||!Number.isInteger(p.gold)||p.gold<0||p.gold>1e7||!Number.isInteger(p.clears)||p.clears<0||p.clears>1e6||![0,1,2].includes(p.weapon)||![0,1,2].includes(p.armor)||!Number.isFinite(p.x)||p.x<80||p.x>WORLD-80||!Number.isFinite(p.hp)||p.hp<=0||p.hp>100||!Number.isFinite(p.power)||p.power<0||p.power>100||!Array.isArray(p.kills)||new Set(p.kills).size!==p.kills.length||p.kills.some(k=>!Number.isInteger(k)||k<0||k>5))return null;const s=createGame();Object.assign(s,{x:p.x,hp:p.hp,gold:p.gold,weapon:p.weapon,armor:p.armor,clears:p.clears,power:p.power});for(const e of s.enemies)if(p.kills.includes(e.id))e.hp=0;s.finished=s.enemies.every(e=>e.hp<=0);return s;}catch{return null;}}
export function buy(s,slot,tier){const list=slot==='weapon'?WEAPONS:slot==='armor'?ARMORS:null;if(!list||![1,2].includes(tier)||tier<=s[slot]||s.gold<list[tier].price)return false;s.gold-=list[tier].price;s[slot]=tier;return true;}
export function returnHome(s){s.x=430;s.hp=100;s.attack=null;s.dodge=0;s.hurt=0;for(const e of s.enemies)if(e.hp>0){e.x=e.home;e.hp=e.maxHp;e.state='idle';e.timer=0;}s.events.push({type:'home'});}
export function replay(s){s.enemies=spawn();s.kills=[];s.finished=false;s.x=780;s.hp=100;s.attack=null;s.drops=[];s.events.push({type:'replay'});}
function hitEnemy(s,e,damage,knock=26){e.hp=Math.max(0,e.hp-damage);e.hurt=.18;e.x=clamp(e.x+s.face*knock,820,WORLD-120);if(knock>=40){e.state='stagger';e.timer=.38;}s.power=clamp(s.power+12,0,100);s.events.push({type:'hit',x:e.x,amount:damage});if(!e.hp){const coins=e.kind==='master'?65:25;s.gold+=coins;s.hp=Math.min(100,s.hp+7);s.events.push({type:'kill',x:e.x,amount:coins});if(s.enemies.every(q=>q.hp<=0)){s.finished=true;s.clears++;s.events.push({type:'clear'});}}}
export function step(s,input,dt){
 dt=clamp(dt,0,1/30);s.events=[];if(s.hp<=0)return;s.time+=dt;
 for(const k of ['dodge','dodgeCD','hurt'])s[k]=Math.max(0,s[k]-dt);
 let move=(input.right?1:0)-(input.left?1:0);
 if(move&&!s.attack&&!s.dodge)s.face=move;
 if(input.dodge&&s.dodgeCD<=0&&!s.attack){s.dodge=.34;s.dodgeCD=1.15;s.events.push({type:'dodge',x:s.x});}
 if(input.special&&s.power>=60&&!s.attack&&!s.dodge){s.power-=60;s.attack={t:0,duration:.72,strike:.36,hit:false,special:true,combo:3};s.events.push({type:'swing'});}
 if(input.attack&&!s.attack&&!s.dodge){s.combo=s.time<s.comboUntil?s.combo%3+1:1;s.comboUntil=s.time+1.05;s.attack={t:0,duration:s.combo===3?.52:.36,strike:s.combo===3?.26:.15,hit:false,special:false,combo:s.combo};s.events.push({type:'swing'});}
 const speed=s.dodge?520:s.attack?move*45:move*220;s.x=clamp(s.x+(s.dodge?s.face*speed:speed)*dt,80,WORLD-80);if(move||s.dodge)s.walk+=dt*(s.dodge?18:10);
 if(s.attack){const a=s.attack;a.t+=dt;if(a.t>=a.strike&&!a.hit){a.hit=true;const reach=a.special?210:a.combo===3?148:116;for(const e of s.enemies){const d=e.x-s.x;if(e.hp>0&&Math.abs(d)<reach&&(a.special||d*s.face>-20))hitEnemy(s,e,Math.round(WEAPONS[s.weapon].damage*(a.special?2.3:a.combo===3?1.65:1)),a.special?64:a.combo===3?45:18);}s.events.push({type:a.special?'slam':'slash',x:s.x,face:s.face});}if(a.t>=a.duration)s.attack=null;}
 for(const e of s.enemies){if(e.hp<=0)continue;e.hurt=Math.max(0,e.hurt-dt);e.timer-=dt;const d=s.x-e.x,dist=Math.abs(d);if(e.state==='stagger'){if(e.timer<=0)e.state='idle';continue;}if(s.x<760){e.state='idle';e.x+=(e.home-e.x)*Math.min(1,dt*2);continue;}
 if(e.state==='windup'){if(e.timer<=0){e.state='strike';e.timer=.2;const reach=e.kind==='wisp'?190:e.kind==='master'?155:105;if(dist<reach&&d*e.face>-20){if(s.dodge>0){s.power=clamp(s.power+20,0,100);s.events.push({type:'evaded',x:s.x});}else if(s.hurt<=0){const damage=Math.max(1,(e.kind==='master'?27:e.kind==='wisp'?12:17)-ARMORS[s.armor].armor);s.hp=Math.max(0,s.hp-damage);s.hurt=.6;s.x=clamp(s.x+e.face*28,80,WORLD-80);s.events.push({type:'hurt',x:s.x,amount:damage});}}}continue;}
 if(e.state==='strike'){if(e.timer<=0){e.state='recover';e.timer=e.kind==='master'?.75:.85;}continue;}
 if(e.state==='recover'){if(e.timer<=0)e.state='idle';continue;}
 if(dist<480){e.face=d<0?-1:1;const range=e.kind==='wisp'?155:e.kind==='master'?122:80;if(dist>range)e.x+=e.face*(e.kind==='wisp'?85:75)*dt;else{e.state='windup';e.timer=e.kind==='master'?1:e.kind==='wisp'?.85:.7;}}}
 if(s.hp<=0)s.events.push({type:'defeat'});
}
