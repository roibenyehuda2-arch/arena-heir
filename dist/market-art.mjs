import {keyBackground} from './sprite-texture.mjs';
const ROOT='assets/crownlands/';
async function sheet(name,cols,rows,bounds=null,rowBands=null){const im=new Image();im.src=ROOT+name+'.webp';await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);const p=x.getImageData(0,0,c.width,c.height);keyBackground(p.data,c.width,c.height,bounds?1:cols,rowBands?1:rows);x.putImageData(p,0,0);return Array.from({length:cols*rows},(_,i)=>{const cw=bounds?bounds[i][1]-bounds[i][0]:Math.floor(c.width/cols),ch=rowBands?rowBands[Math.floor(i/cols)+1]-rowBands[Math.floor(i/cols)]:Math.floor(c.height/rows),sx=bounds?bounds[i][0]:i%cols*cw,sy=rowBands?rowBands[Math.floor(i/cols)]:Math.floor(i/cols)*ch;let l=cw,t=ch,r=0,b=0;for(let y=0;y<ch;y++)for(let z=0;z<cw;z++)if(p.data[((sy+y)*c.width+sx+z)*4+3]>80){l=Math.min(l,z);t=Math.min(t,y);r=Math.max(r,z);b=Math.max(b,y);}const out=document.createElement('canvas');out.width=Math.max(1,r-l+1);out.height=Math.max(1,b-t+1);out.getContext('2d').drawImage(c,sx+l,sy+t,out.width,out.height,0,0,out.width,out.height);return out;});}
// This illustrated atlas has overlapping row bounds and irregular columns.
// Isolate its connected silhouettes instead of slicing through neighboring gear.
async function accessorySheet(){
  const im=new Image();im.src=ROOT+'armor-accessories.webp';await im.decode();
  const source=document.createElement('canvas');source.width=im.width;source.height=im.height;
  const ctx=source.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);
  const {data}=ctx.getImageData(0,0,im.width,im.height),w=im.width,h=im.height;
  const visited=new Uint8Array(w*h),queue=new Int32Array(w*h),groups=Array.from({length:32},()=>[]);
  const centers=[100,290,490,690,890,1090,1280,1485];
  for(let seed=0;seed<w*h;seed++){
    if(visited[seed]||data[seed*4+3]<=80)continue;
    let head=0,tail=1,l=w,r=0,t=h,b=0;queue[0]=seed;visited[seed]=1;
    while(head<tail){
      const p=queue[head++],x=p%w,y=Math.floor(p/w);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);
      const add=q=>{if(q>=0&&q<w*h&&!visited[q]&&data[q*4+3]>80){visited[q]=1;queue[tail++]=q;}};
      if(x)add(p-1);if(x<w-1)add(p+1);add(p-w);add(p+w);
    }
    if(tail<800)continue;
    const cy=(t+b)/2,cx=(l+r)/2,row=cy<270?0:cy<410?1:cy<608?2:3;
    let col=0;for(let n=1;n<8;n++)if(Math.abs(cx-centers[n])<Math.abs(cx-centers[col]))col=n;
    groups[row*8+col].push({pixels:queue.slice(0,tail),l,r,t,b});
  }
  return groups.map(parts=>{
    if(!parts.length)throw new Error('Missing accessory atlas silhouette');
    const l=Math.max(0,Math.min(...parts.map(p=>p.l))-1),r=Math.min(w-1,Math.max(...parts.map(p=>p.r))+1);
    const t=Math.max(0,Math.min(...parts.map(p=>p.t))-1),b=Math.min(h-1,Math.max(...parts.map(p=>p.b))+1);
    const out=document.createElement('canvas');out.width=r-l+1;out.height=b-t+1;
    const ox=out.getContext('2d'),pixels=ox.createImageData(out.width,out.height);
    // Include the one-pixel antialiased rim without admitting adjacent items.
    for(const part of parts)for(const p of part.pixels){
      const x=p%w,y=Math.floor(p/w);
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        const xx=x+dx,yy=y+dy;if(xx<l||xx>r||yy<t||yy>b)continue;
        const from=(yy*w+xx)*4,to=((yy-t)*out.width+xx-l)*4;
        pixels.data.set(data.subarray(from,from+4),to);
      }
    }
    ox.putImageData(pixels,0,0);return out;
  });
}
export async function loadMarket(){const [keepers,gear,spells,interiors,expanded,accessories,bodies,starterParts,dwarfMoon]=await Promise.all([sheet('shopkeepers',3,1,[[0,535],[540,1015],[1018,1536]]),sheet('equipment',4,8),sheet('spell-icons',5,1),(async()=>{const im=new Image();im.src=ROOT+'shop-interiors.webp';await im.decode();return im;})(),sheet('equipment-legends',4,8,null,[0,147,304,485,578,724,859,1002,1254]),accessorySheet(),sheet('starter-bodies',3,1),sheet('starter-parts',3,3,null,[0,340,668,1024]),sheet('dwarf-moon-helmet',1,1)]);return {keepers,gear,spells,interiors,expanded,accessories,bodies,starterParts,dwarfMoon:dwarfMoon[0],urls:new Map()};}
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
// Dwarf fitting uses an open-face version of each helmet. The inventory and
// other classes retain the original full-face illustration. A curved brow and
// short nasal leave the actual brows, eyes, moustache and beard unobstructed.
function dwarfHelmet(market,tier){
  market.dwarfHelmets??=new Map();
  if(tier===2&&market.dwarfMoon)return market.dwarfMoon;
  if(market.dwarfHelmets.has(tier))return market.dwarfHelmets.get(tier);
  const source=wornHelmet(market,'dwarf',tier),out=document.createElement('canvas');
  out.width=source.width;out.height=source.height;
  const ctx=out.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);
  const pixels=ctx.getImageData(0,0,out.width,out.height),data=pixels.data;
  const eye=HELMET_EYES[tier],nose=tier===1?.33:tier===2?.40:.50;
  for(let y=0;y<out.height;y++)for(let x=0;x<out.width;x++){
    const u=(x+.5)/out.width,v=(y+.5)/out.height;
    // Gentle brow curve rises over both eyes. Outside it the small temple
    // guards end at eye level, rather than hanging over the dwarf's beard.
    const edge=Math.min(1,Math.abs(u-.5)/.40);
    const brow=eye-.12+.065*edge*edge;
    const noseLength=.105,noseDepth=v-brow;
    const nasal=noseDepth>=0&&noseDepth<noseLength&&Math.abs(u-nose)<.027*(1-noseDepth/noseLength);
    const temple=(u<.25||u>.77)&&v<eye+.22;
    if(v>brow&&!nasal&&!temple)data[(y*out.width+x)*4+3]=0;
  }
  ctx.putImageData(pixels,0,0);market.dwarfHelmets.set(tier,out);return out;
}
// Fitting metadata is separate from the inventory art: stock icons retain their
// original silhouettes, while worn items share anatomical anchors with the rig.
function bootParts(market,kind,tier){
  market.fittedBoots??=new Map();
  if(market.fittedBoots.has(tier))return market.fittedBoots.get(tier);
  const source=itemSprite(market,kind,'boots',tier),ctx=source.getContext('2d',{willReadFrequently:true}),data=ctx.getImageData(0,0,source.width,source.height).data;
  // The stock pair is drawn in three-quarter view: its boots overlap along
  // a sloping seam. A straight half cut leaves a dangling strip of the other
  // boot. Follow that overlap and trim the two independent silhouettes.
  const result=[0,1].map(side=>{
    const masked=document.createElement('canvas');masked.width=source.width;masked.height=source.height;
    const mx=masked.getContext('2d'),pixels=mx.createImageData(source.width,source.height);
    let l=source.width,t=source.height,r=0,b=0;
    for(let y=0;y<source.height;y++){
      const v=y/source.height;
      const seam=source.width*(v<.48?.56:.56-.15*Math.min(1,(v-.48)/.38));
      for(let x=0;x<source.width;x++){
        if(side===0?x>=seam:x<seam)continue;
        const i=(y*source.width+x)*4;
        pixels.data.set(data.subarray(i,i+4),i);
        if(data[i+3]>80){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
      }
    }
    mx.putImageData(pixels,0,0);
    const out=document.createElement('canvas');out.width=Math.max(1,r-l+1);out.height=Math.max(1,b-t+1);
    out.getContext('2d').drawImage(masked,l,t,out.width,out.height,0,0,out.width,out.height);return out;
  });
  market.fittedBoots.set(tier,result);return result;
}
const AXE_GRIPS=[[.19,.78],[.19,.79],[.22,.79],[.25,.77],[.24,.78],[.26,.79],[.25,.79],[.23,.79]];
const HELMET_EYES=[.62,.59,.63,.64,.67,.68,.65,.76];
export function costume(market,kind,gear,slot='melee'){
  if(!market)return null;
  const bodyIndex=kind==='ranger'?1:kind==='mage'?2:0,tier=gear[slot]||0,helmetTier=gear.helmet||0;
  const weaponKind=kind==='mage'?'staff':kind==='ranger'?(slot==='ranged'?'bow':'sword'):'axe';
  const weaponGrip=weaponKind==='axe'?AXE_GRIPS[tier]:weaponKind==='sword'?[.5,.86]:weaponKind==='bow'?[.5,.64]:[.5,.77];
  return {
    weapon:itemSprite(market,kind,slot,tier),weaponTier:tier,weaponKind,weaponGrip,
    baseBody:market.bodies[bodyIndex],starterParts:market.starterParts?.slice((kind==='mage'?1:kind==='ranger'?2:0)*3,(kind==='mage'?1:kind==='ranger'?2:0)*3+3),
    armor:gear.defense?itemSprite(market,kind,'defense',gear.defense):null,
    boots:gear.boots?itemSprite(market,kind,'boots',gear.boots):null,
    bootsParts:gear.boots?bootParts(market,kind,gear.boots):null,
    shoulders:gear.shoulders?itemSprite(market,kind,'shoulders',gear.shoulders):null,
    helmetTier,helmet:helmetTier?(kind==='dwarf'||kind==='thorn'?dwarfHelmet(market,helmetTier):wornHelmet(market,kind,helmetTier)):null,
    helmetFit:(kind==='dwarf'||kind==='thorn')&&helmetTier===2&&market.dwarfMoon?{width:126,heightScale:.66,mirror:true,eyeX:.5,eyeY:.68}:{width:kind==='dwarf'||kind==='thorn'?122:102,heightScale:kind==='dwarf'||kind==='thorn'?.64:.76,mirror:helmetTier===1,eyeX:helmetTier===1?.51:.49,eyeY:HELMET_EYES[helmetTier]},
    shield:gear.shield?itemSprite(market,kind,'shield',gear.shield):null
  };
}
export function drawKeeper(ctx,market,category,x,y,height,time){const im=market.keepers[KEEPERS[category].index],bob=Math.sin(time*1.8+KEEPERS[category].index)*2;ctx.save();ctx.translate(x,y+bob);ctx.rotate(Math.sin(time*.9)*.012);ctx.drawImage(im,-height*im.width/im.height/2,-height,height*im.width/im.height,height);ctx.restore();}
export function heldItem(ctx,im,tier,fitting=false,grip=[.25,.79]){
  const target=[74,100,116,130,140,146,152,160][tier]||160;
  const s=Math.min(target/im.height,110/im.width),h=im.height*s,w=im.width*s;
  // (0,0) is always the fist. Preview and combat use the same physical grip.
  ctx.drawImage(im,-w*grip[0],-h*grip[1],w,h);
}
