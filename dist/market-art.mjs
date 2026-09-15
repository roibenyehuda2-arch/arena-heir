import {keyBackground} from './sprite-texture.mjs';
const ROOT='assets/crownlands/';
async function sheet(name,cols,rows,bounds=null,rowBands=null){const im=new Image();im.src=ROOT+name+'.webp';await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);const p=x.getImageData(0,0,c.width,c.height);keyBackground(p.data,c.width,c.height,bounds?1:cols,rowBands?1:rows);x.putImageData(p,0,0);return Array.from({length:cols*rows},(_,i)=>{const cw=bounds?bounds[i][1]-bounds[i][0]:Math.floor(c.width/cols),ch=rowBands?rowBands[Math.floor(i/cols)+1]-rowBands[Math.floor(i/cols)]:Math.floor(c.height/rows),sx=bounds?bounds[i][0]:i%cols*cw,sy=rowBands?rowBands[Math.floor(i/cols)]:Math.floor(i/cols)*ch;let l=cw,t=ch,r=0,b=0;for(let y=0;y<ch;y++)for(let z=0;z<cw;z++)if(p.data[((sy+y)*c.width+sx+z)*4+3]>80){l=Math.min(l,z);t=Math.min(t,y);r=Math.max(r,z);b=Math.max(b,y);}const out=document.createElement('canvas');out.width=Math.max(1,r-l+1);out.height=Math.max(1,b-t+1);out.getContext('2d').drawImage(c,sx+l,sy+t,out.width,out.height,0,0,out.width,out.height);return out;});}
export async function loadMarket(){const [keepers,gear,spells,interiors,expanded,accessories,bodies,starterParts]=await Promise.all([sheet('shopkeepers',3,1,[[0,535],[540,1015],[1018,1536]]),sheet('equipment',4,8),sheet('spell-icons',5,1),(async()=>{const im=new Image();im.src=ROOT+'shop-interiors.webp';await im.decode();return im;})(),sheet('equipment-legends',4,8,null,[0,147,304,485,578,724,859,1002,1254]),sheet('armor-accessories',8,4),sheet('starter-bodies',3,1),sheet('starter-parts',3,3)]);return {keepers,gear,spells,interiors,expanded,accessories,bodies,starterParts,urls:new Map()};}
export const KEEPERS={weapons:{index:0,name:'Bram',role:'Weaponsmith',hello:'A small axe starts the story. A great one finishes it.',bought:'A fine choice. Make it count!'},magic:{index:1,name:'Mira',role:'Arcane merchant',hello:'A little magic can change everything.',bought:'Yours now. Use it wisely!'},armor:{index:2,name:'Tilda',role:'Armorer',hello:'Go on. Try it on. A good fit saves lives.',bought:'Now that looks like a champion!'}};
function emptyArmorSprite(market,slot){market.emptyArmor??=new Map();if(!market.emptyArmor.has(slot)){const c=document.createElement('canvas');c.width=c.height=120;const x=c.getContext('2d');x.strokeStyle='#e6c77a';x.lineWidth=7;x.lineCap='round';x.globalAlpha=.9;x.beginPath();x.arc(60,60,42,0,Math.PI*2);x.stroke();x.globalAlpha=.48;x.beginPath();x.moveTo(32,88);x.lineTo(88,32);x.stroke();market.emptyArmor.set(slot,c);}return market.emptyArmor.get(slot);}
export function itemSprite(market,kind,slot,tier=0){if(slot==='magic')return market.spells[['lightning','sleep','frost','shield','meteor'].indexOf(tier)];if(!tier&&['defense','shoulders','helmet','shield'].includes(slot))return emptyArmorSprite(market,slot);const accessoryRow={shield:0,shoulders:1,helmet:2,boots:3}[slot];if(accessoryRow!==undefined)return market.accessories[accessoryRow*8+tier];const row=slot==='defense'?kind==='mage'?7:kind==='ranger'?6:4:slot==='ranged'?kind==='mage'?2:kind==='ranger'?3:0:kind==='mage'?2:kind==='ranger'?1:0;return tier>3?market.expanded[row*4+tier-4]:market.gear[row*4+tier];}
export function itemURL(market,kind,item){const key=kind+':'+item.id;if(!market.urls.has(key)){const im=itemSprite(market,kind,item.slot||'magic',item.slot?item.tier:item.id);market.urls.set(key,im.toDataURL());}return market.urls.get(key);}
// The inventory illustration includes a painted black face cavity. Worn copies
// need an opening for the actual head underneath; keep the shop icon untouched.
// Each outline follows that cavity, avoiding the shell, horns and cheek plates.
const HELMET_OPENINGS=[
  [[.18,.50],[.77,.50],[.80,.98],[.17,.98]],
  [[.17,.48],[.42,.52],[.55,.48],[.75,.47],[.72,.77],[.55,.86],[.52,1],[.30,1],[.30,.82],[.19,.72]],
  [[.18,.51],[.43,.62],[.56,.57],[.79,.49],[.72,.70],[.59,.79],[.58,1],[.35,1],[.35,.78],[.24,.70]],
  [[.21,.52],[.45,.60],[.57,.60],[.79,.51],[.73,.72],[.62,.80],[.59,1],[.36,1],[.35,.80],[.26,.71]],
  [[.22,.54],[.48,.64],[.55,.64],[.79,.53],[.72,.73],[.60,.81],[.60,1],[.38,1],[.36,.81],[.28,.74]],
  [[.23,.55],[.46,.65],[.55,.64],[.76,.55],[.69,.76],[.60,.84],[.58,1],[.38,1],[.37,.84],[.29,.75]],
  [[.24,.52],[.47,.62],[.56,.62],[.78,.51],[.72,.74],[.62,.82],[.59,1],[.39,1],[.36,.81],[.28,.74]],
  [[.28,.64],[.48,.72],[.55,.72],[.76,.63],[.70,.82],[.62,.87],[.60,1],[.40,1],[.39,.87],[.31,.81]]
];
function wornHelmet(market,kind,tier){
  market.wornHelmets??=new Map();
  if(market.wornHelmets.has(tier))return market.wornHelmets.get(tier);
  const source=itemSprite(market,kind,'helmet',tier),out=document.createElement('canvas');
  out.width=source.width;out.height=source.height;
  const ctx=out.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);
  const pixels=ctx.getImageData(0,0,out.width,out.height),outline=HELMET_OPENINGS[tier];
  if(outline){
    ctx.beginPath();outline.forEach(([x,y],i)=>i?ctx.lineTo(x*out.width,y*out.height):ctx.moveTo(x*out.width,y*out.height));ctx.closePath();
    for(let y=0;y<out.height;y++)for(let x=0;x<out.width;x++){
      const i=(y*out.width+x)*4,d=pixels.data;
      if(!d[i+3]||!ctx.isPointInPath(x+.5,y+.5))continue;
      // Only the near-black paint is keyed. Metal, gems, nose guards and
      // luminous eyes retain their original color and alpha.
      const brightness=Math.max(d[i],d[i+1],d[i+2]);
      if(brightness<72)d[i+3]=Math.round(d[i+3]*Math.max(0,(brightness-40)/32));
    }
    ctx.putImageData(pixels,0,0);
  }
  market.wornHelmets.set(tier,out);return out;
}
export function costume(market,kind,gear,slot='melee'){if(!market)return null;const bodyIndex=kind==='ranger'?1:kind==='mage'?2:0;return {weapon:itemSprite(market,kind,slot,gear[slot]),weaponTier:gear[slot],baseBody:market.bodies[bodyIndex],starterParts:market.starterParts?.slice((kind==='mage'?1:kind==='ranger'?2:0)*3,(kind==='mage'?1:kind==='ranger'?2:0)*3+3),armor:gear.defense?itemSprite(market,kind,'defense',gear.defense):null,boots:gear.boots?itemSprite(market,kind,'boots',gear.boots):null,shoulders:gear.shoulders?itemSprite(market,kind,'shoulders',gear.shoulders):null,helmetTier:gear.helmet||0,helmet:gear.helmet?wornHelmet(market,kind,gear.helmet):null,shield:gear.shield?itemSprite(market,kind,'shield',gear.shield):null};}
export function drawKeeper(ctx,market,category,x,y,height,time){const im=market.keepers[KEEPERS[category].index],bob=Math.sin(time*1.8+KEEPERS[category].index)*2;ctx.save();ctx.translate(x,y+bob);ctx.rotate(Math.sin(time*.9)*.012);ctx.drawImage(im,-height*im.width/im.height/2,-height,height*im.width/im.height,height);ctx.restore();}
export function heldItem(ctx,im,tier,fitting=false){const target=[74,110,140,164,172,180,188,198][tier]||198,s=Math.min(target/im.height,(fitting?105:160)/im.width),h=im.height*s,w=im.width*s;ctx.drawImage(im,fitting?-w*.1:-w*.3,-h*.78,w,h);}
