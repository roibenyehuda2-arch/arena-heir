// Crownlands campaign. Pure deterministic rules; presentation never changes results.
export const CLASSES = {
  miri: {name:'Aster',role:'White-haired mage',color:'#b38aff',hp:100,armor:0,attack:13,skill:23,guard:15,ultimate:46,icon:'✦',basic:'Star bolt',special:'Arcane fracture',ult:'Astral storm',desc:'Pierce armor with star magic. Break their stance, then unleash a storm.',passive:'Spells pierce armor'},
  suri: {name:'Rowan',role:'Forest ranger',color:'#70dfa5',hp:94,armor:0,attack:12,skill:22,guard:14,ultimate:45,icon:'➶',basic:'Quick shot',special:'Twin arrows',ult:'Arrow tempest',desc:'A relentless volley. Evade a heavy hit to empower your next shot.',passive:'Dodge primes +8 damage'},
  tovin: {name:'Borin',role:'Dwarven axebearer',color:'#ffbe64',hp:120,armor:2,attack:15,skill:24,guard:21,ultimate:49,icon:'⚒',basic:'Axe cleave',special:'Earthsplitter',ult:'Mountain breaker',desc:'Stand your ground. Heavy axe blows shatter even a master’s defenses.',passive:'Skills grant 8 shield'}
};
export const REALMS = [
  {id:'forest',name:'Mosswhisper',label:'Forest realm',color:'#88dfa4',subtitle:'Under the ancient canopy',rule:'Forest guardians alternate strikes and shields. Skills crack their guard.',master:'Thorncrown',echo:'roots'},
  {id:'fire',name:'Cinderpeak',label:'Fire realm',color:'#ffab63',subtitle:'Beyond the river of embers',rule:'Watch for a windup. Evade its heavy blow, or break the attacker first.',master:'King Cinderhorn',echo:'flame'},
  {id:'magic',name:'Astral Isles',label:'Magic realm',color:'#c4a0ff',subtitle:'Where the stars touch the earth',rule:'Arcane foes drain life and strike twice. A shield protects against both hits.',master:'The Hollow Magister',echo:'star'}
];
export const ENCOUNTERS = [
  ['Acorn Sentry',50,0,[['strike',9],['ward',10],['strike',13]]],
  ['Briar Duelist',60,1,[['double',7],['ward',12],['strike',14]]],
  ['Mossbound Warden',72,2,[['ward',15],['strike',17],['windup',0],['heavy',24]]],
  ['Thorncrown',108,2,[['double',9],['ward',14],['windup',0],['heavy',26]]],
  ['Ember Scout',82,2,[['strike',15],['windup',0],['heavy',28]]],
  ['Ashblade',94,2,[['double',10],['windup',0],['heavy',30]]],
  ['Furnace Keeper',110,3,[['ward',16],['windup',0],['heavy',34],['strike',16]]],
  ['King Cinderhorn',155,3,[['windup',0],['heavy',38],['double',12],['ward',16]]],
  ['Rune Watcher',116,3,[['drain',18],['ward',16],['double',11]]],
  ['Spellweaver',132,3,[['double',13],['drain',20],['windup',0],['heavy',32]]],
  ['Eclipse Sentinel',148,4,[['ward',20],['drain',23],['double',14]]],
  ['The Hollow Magister',210,4,[['double',15],['drain',25],['windup',0],['heavy',42],['ward',22]]]
].map(([name,hp,armor,pattern],index)=>({name,hp,armor,pattern,index,realm:Math.floor(index/4),master:index%4===3,art:Math.floor(index/4)+(index%4===3?3:0)}));
export const ECHOES = {
  roots:{name:'Ironroot',icon:'❧',desc:'Block 25 damage and heal 12 HP.',cost:2,cd:3},
  flame:{name:'Cinder burst',icon:'♨',desc:'30 damage. Ignores half the enemy shield.',cost:3,cd:3},
  star:{name:'Astral siphon',icon:'✧',desc:'24 piercing damage. Heal 16 HP.',cost:3,cd:3}
};
export const ACTIONS = ['attack','skill','guard','dodge','rest','ultimate'];
const cap=(n,min,max)=>Math.max(min,Math.min(max,n));
export const realmOf=s=>REALMS[Math.floor(s.round/4)];
export const foeOf=s=>ENCOUNTERS[s.round];
export const stats=s=>({damage:s.legacyDamage+[0,4,9,15][s.equipment.weapon],armor:CLASSES[s.hero].armor+s.legacyArmor+[0,2,4,7][s.equipment.armor]});
export const maxHealth=s=>CLASSES[s.hero].hp+s.vitality+[0,12,26,42][s.equipment.charm];
export function createRun(hero='miri',name='') {
  if(!CLASSES[hero])hero='miri';
  return {version:3,hero,name:(name.trim()||CLASSES[hero].name).slice(0,18),round:0,stage:'map',hp:CLASSES[hero].hp,gold:30,equipment:{weapon:0,armor:0,charm:0},legacyDamage:0,legacyArmor:0,vitality:0,energy:6,focus:0,bonus:0,turn:0,foeHp:50,break:0,cool:{},echoes:[],claimed:false,log:['Your journey begins in Mosswhisper.'],victoryGold:0,legacy:false};
}
export function loadRun(value) {
  try {
    const raw=typeof value==='string'?JSON.parse(value):structuredClone(value);
    if(!raw||typeof raw!=='object')return null;
    if(raw.version!==3) {
      // Explicitly migrate old journeys without overwriting their stored backup.
      if(!Number.isInteger(raw.round)||raw.round<0||raw.round>6||!Number.isFinite(raw.hp)||!Array.isArray(raw.moves)||!['battle','map','reward','camp','won','lost'].includes(raw.stage))return null;
      const s=createRun(raw.hero,typeof raw.name==='string'?raw.name:'');
      s.round=raw.round<4?raw.round:raw.round+1;
      s.gold=cap(Number(raw.gold)||0,0,100000);s.legacyDamage=cap(Number(raw.weapon)||0,0,100);s.legacyArmor=cap(Number(raw.armor)||0,0,30);
      s.vitality=Math.max(0,(Number(raw.maxHp)||0)-CLASSES[s.hero].hp);s.hp=cap(raw.hp,0,maxHealth(s));s.legacy=true;
      s.stage=s.hp===0?'lost':['won','lost'].includes(raw.stage)?raw.stage:raw.stage==='camp'?'camp':'map';s.claimed=['camp','won'].includes(s.stage);
      s.echoes=raw.moves.length?['roots']:[];s.foeHp=['camp','won'].includes(s.stage)?0:foeOf(s).hp;
      s.log=['Your earlier journey was carried into the Crownlands. Active duels restart from the map; your coins and upgrades are preserved.'];
      return s;
    }
    const s=raw;
    if(!CLASSES[s.hero]||typeof s.name!=='string'||s.name.length>18||!Number.isInteger(s.round)||s.round<0||s.round>=ENCOUNTERS.length||!['map','battle','reward','camp','won','lost'].includes(s.stage))return null;
    for(const k of ['hp','gold','energy','focus','bonus','turn','foeHp','break','vitality','legacyDamage','legacyArmor','victoryGold'])if(!Number.isFinite(s[k])||s[k]<0||s[k]>100000)return null;
    if(!s.equipment||!['weapon','armor','charm'].every(k=>Number.isInteger(s.equipment[k])&&s.equipment[k]>=0&&s.equipment[k]<=3))return null;
    if(!Array.isArray(s.echoes)||s.echoes.length>3||new Set(s.echoes).size!==s.echoes.length||s.echoes.some(id=>!Object.hasOwn(ECHOES,id)))return null;
    if(!Number.isInteger(s.turn)||typeof s.legacy!=='boolean'||!s.cool||Array.isArray(s.cool)||typeof s.cool!=='object'||Object.entries(s.cool).some(([k,v])=>!['skill','dodge',...Object.keys(ECHOES)].includes(k)||!Number.isInteger(v)||v<0||v>3))return null;
    if(!Array.isArray(s.log)||s.log.some(t=>typeof t!=='string')||typeof s.claimed!=='boolean'||s.hp>maxHealth(s)||s.foeHp>foeOf(s).hp||s.energy>6||s.focus>100||s.break>2)return null;
    if(!['lost','won'].includes(s.stage)&&s.hp===0||s.stage==='battle'&&s.foeHp===0||s.stage==='reward'&&(s.foeHp!==0||s.claimed)||s.stage==='camp'&&(!s.claimed||s.foeHp!==0||s.round===11)||s.stage==='won'&&(!s.claimed||s.foeHp!==0||s.round!==11&&!s.legacy))return null;
    return s;
  }catch{return null;}
}
export function enter(s){if(s.stage!=='map'||s.hp<=0)return false;s.stage='battle';s.foeHp=foeOf(s).hp;s.turn=0;s.energy=6;s.cool={};s.break=0;s.bonus=0;s.claimed=false;s.log=[`${foeOf(s).name} steps forward. Read the next move.`];return true;}
export function intent(s){const foe=foeOf(s),[type,base]=foe.pattern[s.turn%foe.pattern.length],enraged=foe.master&&s.foeHp<=foe.hp/2,pressure=Math.min(8,Math.floor(s.turn/5)*2);return {type,amount:Math.round(base*(enraged&&type!=='ward'?1.2:1))+(type!=='ward'&&type!=='windup'?pressure:0),enraged,pressure};}
export function actionMeta(s,id){const h=CLASSES[s.hero];return ({attack:{name:h.basic,icon:h.icon,cost:0,desc:`${h.attack+stats(s).damage} damage. +1 energy and +20 focus.`},skill:{name:h.special,icon:'✹',cost:2,desc:`${h.skill+stats(s).damage} damage. +1 fracture; 3 fractures interrupt the foe. 2-turn cooldown.${s.hero==='tovin'?' Also blocks 8.':''}`},guard:{name:'Hold guard',icon:'⬡',cost:0,desc:`Block ${h.guard} damage. +1 energy. Perfect guard: +8 next damage and +30 focus.`},dodge:{name:'Evade',icon:'↶',cost:2,desc:`Avoid the first hit. Next attack +${s.hero==='suri'?8:5} damage. 2-turn cooldown.`},rest:{name:'Catch breath',icon:'◉',cost:0,desc:'Recover 3 energy. The enemy still acts.'},ultimate:{name:h.ult,icon:'♛',cost:0,desc:`${h.ultimate+stats(s).damage} piercing damage. Interrupt the enemy. Costs 100 focus.`}})[id]||ECHOES[id];}
export function blocked(s,id){if(s.stage!=='battle')return 'Battle ended';if(!ACTIONS.includes(id)&&!s.echoes.includes(id))return 'Not learned';const m=actionMeta(s,id);if(!m)return 'Unknown action';if(s.cool[id]>0)return `${s.cool[id]} turns`;if(m.cost>s.energy)return 'Need energy';if(id==='ultimate'&&s.focus<100)return `${s.focus}/100 focus`;if(id==='rest'&&s.energy===6)return 'Energy full';return '';}
export function act(s,id,events=[]) {
  if(blocked(s,id))return false;
  const h=CLASSES[s.hero],foe=foeOf(s),plan=intent(s),log=[],m=actionMeta(s,id),power=stats(s);
  let shield=0,evade=id==='dodge',interrupted=id==='ultimate',dealt=0,taken=0;
  const emit=(type,data={})=>events.push({type,...data,hp:s.hp,foeHp:s.foeHp});
  Object.keys(s.cool).forEach(k=>s.cool[k]=Math.max(0,s.cool[k]-1));
  s.energy-=m.cost;
  const damage=(amount,pierce=false,fracture=false,weaponScale=1)=>{
    const ward=plan.type==='ward'?plan.amount:0;
    const defense=pierce?0:foe.armor+(id==='skill'||id==='flame'?Math.floor(ward/2):ward);
    const d=Math.min(s.foeHp,Math.max(1,Math.round(amount+power.damage*weaponScale+s.bonus-defense)));s.bonus=0;s.foeHp-=d;dealt+=d;emit('hit',{side:'enemy',amount:d,kind:s.hero,action:id});
    if(fracture){s.break++;if(s.break>=3){s.break=0;interrupted=true;emit('break');log.push('STANCE BROKEN · The enemy loses this turn.');}}
  };
  const heal=n=>{const before=s.hp;s.hp=Math.min(maxHealth(s),s.hp+n);emit('heal',{side:'player',amount:s.hp-before});};
  if(id==='attack'){damage(h.attack,s.hero==='miri');s.energy=cap(s.energy+1,0,6);}
  if(id==='skill'){if(s.hero==='suri'){damage(h.skill/2,false,true,.5);if(s.foeHp>0)damage(h.skill/2,false,false,.5);}else damage(h.skill,s.hero==='miri',true);s.cool.skill=2;if(s.hero==='tovin')shield=8;}
  if(id==='ultimate'){s.focus=0;emit('ultimate',{hero:s.hero});if(s.hero==='suri'){for(let n=0;n<3&&s.foeHp>0;n++)damage(h.ultimate/3,true,false,1/3);}else damage(h.ultimate,true);s.break=0;log.push('CROWN AWAKENING · Enemy interrupted.');}
  if(id==='guard'){shield=h.guard;s.energy=cap(s.energy+1,0,6);emit('guard');}
  if(id==='dodge'){s.bonus=Math.max(s.bonus,s.hero==='suri'?8:5);s.cool.dodge=2;emit('dodge');}
  if(id==='rest'){s.energy=cap(s.energy+3,0,6);emit('rest');}
  if(id==='roots'){shield=25;heal(12);}
  if(id==='flame')damage(30,false,true);
  if(id==='star'){damage(24,true);heal(16);}
  if(ECHOES[id])s.cool[id]=ECHOES[id].cd;
  if(dealt)log.push(`${m.name}: ${dealt} damage.`);
  if(s.foeHp>0&&!interrupted){
    const take=n=>{if(evade){evade=false;emit('evade');log.push('EVADED · Their first hit misses.');return;}
      const afterArmor=Math.max(0,n-power.armor),d=Math.min(s.hp,Math.max(0,afterArmor-shield));shield=Math.max(0,shield-afterArmor);s.hp-=d;taken+=d;emit('hit',{side:'player',amount:d,kind:realmOf(s).id});};
    if(['strike','heavy','drain'].includes(plan.type))take(plan.amount);
    if(plan.type==='double'){take(plan.amount);if(s.hp>0)take(plan.amount);}
    if(plan.type==='drain'&&taken){const gain=Math.min(8,taken,foe.hp-s.foeHp);s.foeHp+=gain;emit('heal',{side:'enemy',amount:gain});log.push(`Life drain restores ${gain} enemy HP.`);}
    if(plan.type==='windup'){emit('windup');log.push('A heavy blow is coming. Evade, guard, or break their stance.');}
    if(plan.type==='ward')log.push('The enemy holds a shield. Skills crack it; magic pierces it.');
    if(id==='guard'&&['strike','heavy','double','drain'].includes(plan.type)&&!taken){s.bonus=Math.max(s.bonus,8);s.focus=cap(s.focus+20,0,100);emit('perfect');log.push('PERFECT GUARD · Next attack +8.');}
    if(taken)log.push(`You take ${taken} damage.`);
  }
  if(id!=='ultimate'){const gain=id==='skill'?25:id==='guard'?(['strike','heavy','double','drain'].includes(plan.type)?10:0):id==='rest'?0:20;s.focus=cap(s.focus+gain,0,100);}
  s.turn++;
  if(s.foeHp===0){s.stage='reward';s.victoryGold=foe.master?65+s.round*3:25+s.round*3;s.gold+=s.victoryGold;s.claimed=false;emit('victory');log.push(`Victory! +${s.victoryGold} coins. Choose an extra reward.`);}
  else if(s.hp===0){s.stage='lost';emit('defeat');log.push('The road remembers. Try another approach.');}
  s.log=log;return true;
}
export function forecast(s,id){const copy=structuredClone(s),events=[];if(!act(copy,id,events))return null;return {dealt:events.filter(e=>e.type==='hit'&&e.side==='enemy').reduce((n,e)=>n+e.amount,0),taken:events.filter(e=>e.type==='hit'&&e.side==='player').reduce((n,e)=>n+e.amount,0),heal:events.filter(e=>e.type==='heal'&&e.side==='player').reduce((n,e)=>n+e.amount,0),interrupt:events.some(e=>e.type==='break'||e.type==='ultimate'),won:copy.stage==='reward'};}
export function claim(s,choice){if(s.stage!=='reward'||s.claimed)return false;const echo=realmOf(s).echo;
  if(choice==='gold')s.gold+=35+Math.floor(s.round/4)*15;
  else if(choice==='vitality'){s.vitality+=8;s.hp=Math.min(maxHealth(s),s.hp+18);}
  else if(choice==='echo'&&!s.echoes.includes(echo))s.echoes.push(echo);
  else return false;
  s.claimed=true;s.stage=s.round===11?'won':'camp';return true;
}
const weaponNames={miri:['Starlit staff','Cinder prism','Astral scepter'],suri:['Briar longbow','Phoenix bow','Moonstring'],tovin:['Ironbark axe','Magma cleaver','Crown splitter']};
export function shop(s){const tier=Math.floor(s.round/4)+1,catalog=[];for(const slot of ['weapon','armor','charm']){const current=s.equipment[slot],level=current+1;const names=slot==='weapon'?weaponNames[s.hero]:slot==='armor'?['Trailguard coat','Emberplate','Astral aegis']:['Laurel charm','Phoenix charm','Crownheart'];
  catalog.push({id:slot,level,name:names[Math.min(current,2)],cost:[0,45,85,135][level]||0,locked:level>tier,owned:current===3,desc:slot==='weapon'?`Damage +${[0,4,9,15][Math.min(level,3)]} (currently +${[0,4,9,15][current]})`:slot==='armor'?`Armor +${[0,2,4,7][Math.min(level,3)]} (currently +${[0,2,4,7][current]})`:`Max HP +${[0,12,26,42][Math.min(level,3)]} (currently +${[0,12,26,42][current]})`,icon:slot==='weapon'?CLASSES[s.hero].icon:slot==='armor'?'⬡':'❖'});
  }catalog.push({id:'heal',level:0,name:'Moonleaf tonic',desc:'Restore 35 HP now.',cost:18,icon:'♥',owned:false,locked:false});return catalog;
}
export function purchase(s,id){if(!['map','camp'].includes(s.stage))return false;const item=shop(s).find(x=>x.id===id);if(!item||item.locked||item.owned||s.gold<item.cost||id==='heal'&&s.hp===maxHealth(s))return false;
  s.gold-=item.cost;if(id==='heal')s.hp=Math.min(maxHealth(s),s.hp+35);else{const old=maxHealth(s);s.equipment[id]++;if(id==='charm')s.hp+=maxHealth(s)-old;}return true;
}
export function travel(s){if(s.stage!=='camp'||s.round>=11)return false;const master=foeOf(s).master;s.round++;s.stage='map';s.hp=master?maxHealth(s):Math.min(maxHealth(s),s.hp+20);s.energy=6;s.cool={};s.break=0;s.bonus=0;s.foeHp=foeOf(s).hp;s.claimed=false;s.log=[master?'A new realm opens. Your health is fully restored.':'You recover 20 HP on the road.'];return true;}
