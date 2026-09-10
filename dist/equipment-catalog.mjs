// Stable tier IDs preserve old saves and unlock the extended market gradually.
export const TIERS=[
 {name:'Worn',price:0,level:1,crown:false,bonus:null},
 {name:'Ironbark',price:45,level:1,crown:false,bonus:null},
 {name:'Moonsteel',price:110,level:1,crown:true,bonus:null},
 {name:'Royal',price:220,level:1,crown:true,bonus:null},
 {name:'Ember',price:360,level:6,crown:true,bonus:'magic',amount:3,trait:'+3 spell power'},
 {name:'Tide',price:520,level:9,crown:true,bonus:'hp',amount:12,trait:'+12 health'},
 {name:'Storm',price:800,level:12,crown:true,bonus:'energy',amount:12,trait:'+12 energy'},
 {name:'Dragon',price:1200,level:15,crown:true,bonus:'armor',amount:2,trait:'+2 armor'}
];
const NAMES={
 axe:['Cinder Cleaver','Coral Reaver','Thunderfang','Dragonjaw'],
 blade:['Ashbrand','Reef Saber','Sky Splitter','Wyrmfang'],
 staff:['Phoenix Branch','Pearlcaller','Tempest Spire','Dragonheart'],
 bow:['Emberstring','Coral Crescent','Stormstring','Wyrmwing'],
 wand:['Cinder Spark','Tidecaller','Lightning Rod','Drakespire'],
 throwing:['Cinder Talon','Reef Hook','Thunderwing','Dragonclaw'],
 armor:['Furnace Plate','Leviathan Shell','Tempest Plate','Dragonhide'],
 leather:['Ashstalker','Reefwalker','Stormrunner','Wyrmscale'],
 robe:['Phoenix Mantle','Deepsea Veil','Tempest Vestments','Dragon Oracle'],
 boots:['Coalwalkers','Tide Treaders','Cloudsteppers','Dragon Striders']
};
export function equipmentName(hero,slot,tier){const type=slot==='melee'?hero==='mage'?'staff':hero==='ranger'?'blade':'axe':slot==='ranged'?hero==='mage'?'wand':hero==='ranger'?'bow':'throwing':slot==='defense'?hero==='mage'?'robe':hero==='ranger'?'leather':'armor':'boots';if(tier>=4)return NAMES[type][tier-4];const stem=type==='throwing'?'throwing axe':type;if(!tier)return slot==='ranged'?'Not owned':slot==='defense'?'Travel clothes':slot==='boots'?'Old boots':`Worn ${stem}`;return `${TIERS[tier].name} ${stem}`;}
export function unlockReason(run,tier){const t=TIERS[tier];if(t.crown&&!run.crown)return t.level>1?`First Crown + level ${t.level}`:'First Crown';return run.level<t.level?`Level ${t.level}`:'';}
export function equipmentBonuses(gear){const out={};for(const tier of Object.values(gear)){const t=TIERS[tier];if(t?.bonus)out[t.bonus]=(out[t.bonus]||0)+t.amount;}return out;}
