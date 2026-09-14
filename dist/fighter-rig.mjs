// Articulated fighter rig.
//
// Every part is drawn at the aspect ratio of its own sprite and hung from a named joint, so the
// figure reads as one character. The previous rig forced each part into a fixed rectangle — a
// 99x292 arm squeezed into 40x80 — which is what made the fighters look assembled from spares.
//
// Worn equipment is painted here as fitted layers anchored to those joints. The illustrated
// inventory art stays in the shop, where its own framing and detail belong; pasting a shop icon
// onto a moving body is what produced masks stuck to foreheads and boots floating up the shin.

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Sprites carry their own proportions; the fallbacks only serve headless tests with stub images.
const FALLBACK={head:.86,torso:.85,arm:.34,leg:.53};
const ratio=(im,fb)=>im&&im.width>0&&im.height>0?im.width/im.height:fb;

// Ground sits at y=0 and the crown at -height, so every call site keeps its existing scale.
export const RIGS={
 dwarf:{height:248,head:{h:134,y:-248,x:0},torso:{h:108,y:-154,x:0},
  arm:{h:96,front:{x:44,y:-150},back:{x:-44,y:-148},grip:.82},
  leg:{h:94,front:{x:21,y:-94},back:{x:-21,y:-92}},
  cap:{x:0,y:.03,w:.60,h:.34},build:'heavy',hat:'helm'},
 mage:{height:248,head:{h:118,y:-248,x:0},torso:{h:108,y:-152,x:0},
  arm:{h:94,front:{x:36,y:-146},back:{x:-36,y:-144},grip:.84},
  leg:{h:92,front:{x:17,y:-92},back:{x:-17,y:-90}},
  cap:{x:0,y:.02,w:.56,h:.36},build:'slim',hat:'wizard'},
 ranger:{height:248,head:{h:120,y:-248,x:0},torso:{h:104,y:-150,x:0},
  arm:{h:92,front:{x:35,y:-144},back:{x:-35,y:-142},grip:.84},
  leg:{h:94,front:{x:17,y:-94},back:{x:-17,y:-92}},
  cap:{x:0,y:.01,w:.66,h:.40},build:'light',hat:'hood'}
};
RIGS.thorn={...RIGS.dwarf};

// Tier palettes. Worn gear has no layer at all; every later tier reads darker, brighter or hotter.
const TIER=[null,
 {base:'#8a5b33',dark:'#4f3018',light:'#c79256',trim:'#e0b877'},
 {base:'#9fb4c2',dark:'#576c7b',light:'#e8f2f8',trim:'#cfe1ec'},
 {base:'#c9a227',dark:'#7d5c0f',light:'#ffe9a8',trim:'#fff3c9'},
 {base:'#c8502a',dark:'#6d2410',light:'#ffab5e',trim:'#ffd08a',glow:'#ff7a33'},
 {base:'#2f9aa6',dark:'#13555e',light:'#a9eff5',trim:'#d7fbff',glow:'#5fd8e4'},
 {base:'#6f5fd0',dark:'#332a72',light:'#cfc6ff',trim:'#e8e3ff',glow:'#9d8dff'},
 {base:'#b4302c',dark:'#5f110f',light:'#ffc96b',trim:'#ffe6a8',glow:'#ff6a3c'}];

function shade(ctx,box,t,vertical=true){
 const g=vertical?ctx.createLinearGradient(0,box.top,0,box.bottom):ctx.createLinearGradient(box.left,0,box.right,0);
 g.addColorStop(0,t.light);g.addColorStop(.45,t.base);g.addColorStop(1,t.dark);return g;
}
const outline=(ctx,w=3)=>{ctx.strokeStyle='#2b1d12';ctx.lineWidth=w;ctx.lineJoin='round';ctx.stroke();};

// A helmet fitted to the actual head box, covering hair from the brow up and never the face.
function drawHelmet(ctx,rig,head,tier){
 const t=TIER[tier];if(!t)return;
 const cap=rig.cap||{x:0,y:.03,w:.62,h:.36},cx=head.cx+head.w*cap.x,w=head.w*cap.w,h=head.h*cap.h,top=head.top+head.h*cap.y,brow=top+h*.74,style=rig.hat;
 ctx.save();
 if(style==='wizard'){
  const tipY=top-h*.44,brim=w*.72;
  ctx.beginPath();ctx.moveTo(cx-brim,brow-h*.04);ctx.quadraticCurveTo(cx-w*.20,brow-h*.30,cx-w*.06,tipY);
  ctx.quadraticCurveTo(cx+w*.16,brow-h*.34,cx+brim*.62,brow-h*.06);
  ctx.quadraticCurveTo(cx,brow+h*.10,cx-brim,brow-h*.04);ctx.closePath();
  ctx.fillStyle=shade(ctx,{top:tipY,bottom:brow},t);ctx.fill();outline(ctx,3.2);
  ctx.beginPath();ctx.ellipse(cx-w*.02,brow-h*.02,brim*.92,h*.10,0,0,Math.PI*2);
  ctx.fillStyle=t.dark;ctx.fill();outline(ctx,2.6);
  if(tier>=4){ctx.beginPath();ctx.arc(cx+w*.20,brow-h*.16,w*.075,0,Math.PI*2);ctx.fillStyle=t.glow||t.trim;ctx.fill();outline(ctx,2);}
 }else if(style==='hood'){
  ctx.beginPath();ctx.moveTo(cx-w*.50,brow+h*.16);
  ctx.quadraticCurveTo(cx-w*.56,top-h*.06,cx,top-h*.08);
  ctx.quadraticCurveTo(cx+w*.56,top-h*.06,cx+w*.50,brow+h*.16);
  ctx.quadraticCurveTo(cx+w*.30,brow-h*.06,cx+w*.22,brow-h*.02);
  ctx.quadraticCurveTo(cx,brow-h*.20,cx-w*.22,brow-h*.02);
  ctx.quadraticCurveTo(cx-w*.30,brow-h*.06,cx-w*.50,brow+h*.16);ctx.closePath();
  ctx.fillStyle=shade(ctx,{top:top-h*.08,bottom:brow+h*.16},t);ctx.fill();outline(ctx,3);
  ctx.beginPath();ctx.moveTo(cx-w*.50,brow+h*.10);ctx.quadraticCurveTo(cx-w*.66,brow+h*.34,cx-w*.40,brow+h*.42);
  ctx.quadraticCurveTo(cx-w*.34,brow+h*.22,cx-w*.50,brow+h*.10);ctx.closePath();
  ctx.fillStyle=t.dark;ctx.fill();outline(ctx,2.4);
 }else{
  ctx.beginPath();ctx.moveTo(cx-w*.46,brow);
  ctx.quadraticCurveTo(cx-w*.50,top+h*.02,cx,top);
  ctx.quadraticCurveTo(cx+w*.50,top+h*.02,cx+w*.46,brow);ctx.closePath();
  ctx.fillStyle=shade(ctx,{top,bottom:brow},t);ctx.fill();outline(ctx,3.2);
  ctx.beginPath();ctx.rect(cx-w*.46,brow-h*.06,w*.92,h*.10);
  ctx.fillStyle=t.trim;ctx.fill();outline(ctx,2.4);
  ctx.beginPath();ctx.moveTo(cx-w*.07,brow-h*.02);ctx.lineTo(cx+w*.07,brow-h*.02);
  ctx.lineTo(cx+w*.05,brow+h*.20);ctx.lineTo(cx-w*.05,brow+h*.20);ctx.closePath();
  ctx.fillStyle=t.base;ctx.fill();outline(ctx,2.4);
  if(tier>=4){for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(cx+s*w*.40,brow-h*.10);
   ctx.quadraticCurveTo(cx+s*w*.80,top-h*.10,cx+s*w*.54,top-h*.30);
   ctx.quadraticCurveTo(cx+s*w*.58,top+h*.04,cx+s*w*.34,brow-h*.12);ctx.closePath();
   ctx.fillStyle=t.glow||t.light;ctx.fill();outline(ctx,2.4);}}
 }
 ctx.restore();
}

// Body armor sits on the torso box as a fitted plate, jerkin or robe rather than a shop picture.
// It spans the real shoulder joints so the chest reads as worn rather than as a plank taped on.
function drawBodyArmor(ctx,rig,torso,tier,span){
 const t=TIER[tier];if(!t)return;
 const {cx,top,bottom}=torso,h=bottom-top,build=rig.build;
 const w=Math.min(Math.max(torso.w,span*.72),torso.w*1.18),hem=build==='slim'?bottom+h*.22:bottom-h*.04;
 const neck=w*.15;
 ctx.save();
 ctx.beginPath();
 ctx.moveTo(cx-neck,top+h*.05);
 ctx.quadraticCurveTo(cx-w*.44,top+h*.00,cx-w*.50,top+h*.20);   // left shoulder cap
 ctx.lineTo(cx-w*(build==='heavy'?.44:.38),hem);
 ctx.quadraticCurveTo(cx,hem+h*.10,cx+w*(build==='heavy'?.44:.38),hem);
 ctx.lineTo(cx+w*.50,top+h*.20);                                  // right shoulder cap
 ctx.quadraticCurveTo(cx+w*.44,top+h*.00,cx+neck,top+h*.05);
 ctx.quadraticCurveTo(cx,top+h*.16,cx-neck,top+h*.05);ctx.closePath();
 ctx.fillStyle=shade(ctx,{top,bottom:hem},t);ctx.fill();outline(ctx,3.2);
 if(build==='heavy'){
  ctx.beginPath();ctx.moveTo(cx,top+h*.22);ctx.lineTo(cx,hem-h*.08);ctx.strokeStyle=t.dark;ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,top+h*.46,w*.15,h*.14,0,0,Math.PI*2);ctx.fillStyle=t.trim;ctx.fill();outline(ctx,2.4);
 }else if(build==='light'){
  for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(cx+s*w*.26,top+h*.18);ctx.lineTo(cx-s*w*.14,hem-h*.12);
   ctx.strokeStyle=t.dark;ctx.lineWidth=w*.08;ctx.lineCap='round';ctx.stroke();}
  ctx.beginPath();ctx.rect(cx-w*.36,hem-h*.22,w*.72,h*.13);ctx.fillStyle=t.trim;ctx.fill();outline(ctx,2.2);
 }else{
  ctx.beginPath();ctx.moveTo(cx-w*.14,top+h*.14);ctx.lineTo(cx,hem-h*.06);ctx.lineTo(cx+w*.14,top+h*.14);
  ctx.strokeStyle=t.trim;ctx.lineWidth=3.5;ctx.stroke();
 }
 if(tier>=4&&t.glow){ctx.beginPath();ctx.arc(cx,top+h*.38,w*.08,0,Math.PI*2);ctx.fillStyle=t.glow;ctx.globalAlpha=.85;ctx.fill();ctx.globalAlpha=1;outline(ctx,2);}
 ctx.restore();
}

// A pauldron capping one shoulder joint, drawn per side so nothing is duplicated or left floating.
function drawPauldron(ctx,rig,joint,armW,tier,side){
 const t=TIER[tier];if(!t)return;
 const w=armW*(rig.build==='heavy'?1.16:1.02),h=w*.72;
 ctx.save();ctx.translate(joint.x,joint.y);
 ctx.beginPath();ctx.moveTo(-w*.5,h*.30);
 ctx.quadraticCurveTo(-w*.52,-h*.42,0,-h*.46);
 ctx.quadraticCurveTo(w*.52,-h*.42,w*.5,h*.30);
 ctx.quadraticCurveTo(0,h*.56,-w*.5,h*.30);ctx.closePath();
 ctx.fillStyle=shade(ctx,{top:-h*.46,bottom:h*.36},t);ctx.fill();outline(ctx,3);
 ctx.beginPath();ctx.moveTo(-w*.38,h*.06);ctx.quadraticCurveTo(0,-h*.12,w*.38,h*.06);
 ctx.strokeStyle=t.trim;ctx.lineWidth=2.6;ctx.stroke();
 if(tier>=5){ctx.beginPath();ctx.moveTo(side*w*.30,-h*.30);ctx.lineTo(side*w*.62,-h*.74);ctx.lineTo(side*w*.44,-h*.22);ctx.closePath();
  ctx.fillStyle=t.glow||t.light;ctx.fill();outline(ctx,2.2);}
 ctx.restore();
}

// A sleeve and bracer so an armored fighter never shows a bare animated arm over a plated chest.
function drawSleeve(ctx,rig,armW,armH,tier){
 const t=TIER[tier];if(!t)return;
 ctx.save();
 ctx.beginPath();ctx.moveTo(-armW*.54,armH*.02);ctx.lineTo(armW*.54,armH*.02);
 ctx.lineTo(armW*.46,armH*.40);ctx.lineTo(-armW*.46,armH*.40);ctx.closePath();
 ctx.fillStyle=shade(ctx,{top:0,bottom:armH*.40},t);ctx.fill();outline(ctx,2.6);
 ctx.beginPath();ctx.rect(-armW*.44,armH*.60,armW*.88,armH*.16);
 ctx.fillStyle=t.dark;ctx.fill();outline(ctx,2.2);
 ctx.restore();
}

// A boot fitted to the end of one leg, hiding the bare foot it replaces.
function drawBoot(ctx,rig,legW,legH,tier){
 const t=TIER[tier];if(!t)return;
 const top=legH*(rig.build==='heavy'?.52:.58),w=legW*1.04,sole=legH*1.005,toe=legW*(rig.build==='heavy'?1.08:.94);
 ctx.save();
 // Shaft: follows the calf and flares slightly at the cuff.
 ctx.beginPath();
 ctx.moveTo(-w*.46,top+legH*.02);
 ctx.quadraticCurveTo(0,top-legH*.03,w*.46,top+legH*.02);
 ctx.quadraticCurveTo(w*.40,legH*.80,w*.36,legH*.90);
 ctx.lineTo(-w*.40,legH*.90);
 ctx.quadraticCurveTo(-w*.44,legH*.80,-w*.46,top+legH*.02);ctx.closePath();
 ctx.fillStyle=shade(ctx,{top,bottom:legH},t);ctx.fill();outline(ctx,3);
 // Foot: a rounded toe box reaching past the ankle so no bare toes peek out below.
 ctx.beginPath();
 ctx.moveTo(-w*.42,legH*.84);
 ctx.lineTo(toe*.62,legH*.84);
 ctx.quadraticCurveTo(toe*.96,legH*.90,toe*.86,sole);
 ctx.lineTo(-w*.34,sole);
 ctx.quadraticCurveTo(-w*.54,sole,-w*.42,legH*.84);ctx.closePath();
 ctx.fillStyle=t.dark;ctx.fill();outline(ctx,2.8);
 ctx.beginPath();ctx.rect(-w*.46,top+legH*.02,w*.92,legH*.08);
 ctx.fillStyle=t.trim;ctx.fill();outline(ctx,2.2);
 ctx.restore();
}

// A shield carried on the off hand, sized by tier and kept clear of the face.
function drawShield(ctx,rig,tier,scaleRef){
 const t=TIER[tier];if(!t)return;
 const h=scaleRef*(.60+tier*.032),w=h*.84;
 ctx.save();ctx.translate(-w*.32,-h*.06);
 ctx.beginPath();ctx.moveTo(-w*.5,-h*.42);ctx.lineTo(w*.5,-h*.42);
 ctx.lineTo(w*.5,h*.12);ctx.quadraticCurveTo(0,h*.58,-w*.5,h*.12);ctx.closePath();
 ctx.fillStyle=shade(ctx,{top:-h*.42,bottom:h*.5},t);ctx.fill();outline(ctx,3.2);
 ctx.beginPath();ctx.arc(0,-h*.10,w*.17,0,Math.PI*2);ctx.fillStyle=t.trim;ctx.fill();outline(ctx,2.4);
 if(tier>=4&&t.glow){ctx.beginPath();ctx.arc(0,-h*.10,w*.09,0,Math.PI*2);ctx.fillStyle=t.glow;ctx.fill();}
 ctx.restore();
}

// Held weapons keep their illustration but gain a real grip anchor and an uncapped size ladder.
const WEAPON_HEIGHT=[84,100,118,134,148,160,172,184];
export function drawHeldWeapon(ctx,im,tier,fitting=false,upright=false){
 if(!im)return;
 const target=WEAPON_HEIGHT[clamp(tier,0,7)],ar=ratio(im,.7);
 // Scale by height so every tier grows; only clamp width enough to keep the blade off the face.
 let h=target,w=h*ar;
 const maxW=fitting?150:190;
 if(w>maxW){w=maxW;h=w/ar;}
 // A bow is drawn lying on its side in the shop; a ranger carries it standing.
 if(upright&&ar>1.1){ctx.save();ctx.rotate(-Math.PI/2);ctx.drawImage(im,-w*.44,-h*.34,w,h);ctx.restore();return;}
 // Wide weapons balance near their middle; tall hafts are gripped low on the shaft.
 const gripY=clamp(.84-(ar-.7)*.30,.52,.86);
 ctx.drawImage(im,-w*.26,-h*gripY,w,h);
}

export function drawFighter(ctx,art,kind,x,y,gear={},opts={}){
 const rig=RIGS[kind]||RIGS.dwarf;
 const {scale=1,time=0,face=1,moving=false,walk=0,attack=null,fitting=false,hurt=0,dodge=0}=opts;
 const mg=opts.marketGear||null;
 const g={melee:0,ranged:0,defense:0,boots:0,shoulders:0,helmet:0,shield:0,...gear};
 const parts=mg?.starterParts,heads=kind==='dwarf'||kind==='thorn'?art?.parts:art?.classes;
 const headIm=heads&&(kind==='mage'?heads[0]:kind==='ranger'?heads[4]:heads[0]);
 const torsoIm=parts?.[0],armIm=parts?.[1],legIm=parts?.[2];

 ctx.save();ctx.translate(x,y);ctx.scale(face*scale,scale);
 if(kind==='thorn')ctx.filter='hue-rotate(38deg)';
 if(dodge){ctx.rotate(-.2);ctx.translate(0,12);}
 if(hurt>0)ctx.globalAlpha=.62;

 // Headless recorders used by the geometry tests only implement the transform and drawImage calls.
 const paintable=typeof ctx.beginPath==='function'&&typeof ctx.createLinearGradient==='function';
 const gait=moving?Math.sin(walk)*.42:0,bob=moving?Math.abs(Math.sin(walk))*3:Math.sin(time*2)*1.8;
 const armH=rig.arm.h,armW=armH*ratio(armIm,FALLBACK.arm);
 const legH=rig.leg.h,legW=legH*ratio(legIm,FALLBACK.leg);
 const torsoH=rig.torso.h,torsoW=torsoH*ratio(torsoIm,FALLBACK.torso);
 const headH=rig.head.h,headW=headH*ratio(headIm,FALLBACK.head);
 const headBox={cx:rig.head.x,top:rig.head.y,w:headW,h:headH};
 const torsoBox={cx:rig.torso.x,top:rig.torso.y,bottom:rig.torso.y+torsoH,w:torsoW};

 // One leg, hung from its hip and mirrored for the far side so the feet do not point the same way.
 const drawLeg=(joint,angle,mirror)=>{
  ctx.save();ctx.translate(joint.x,joint.y);ctx.rotate(angle);if(mirror)ctx.scale(-1,1);
  if(legIm)ctx.drawImage(legIm,-legW*.5,0,legW,legH);
  if(g.boots>0&&paintable)drawBoot(ctx,rig,legW,legH,g.boots);
  ctx.restore();
 };
 // One arm, hung from its shoulder, carrying whatever that hand holds.
 const drawArm=(joint,angle,mirror,hand)=>{
  ctx.save();ctx.translate(joint.x,joint.y);ctx.rotate(angle);if(mirror)ctx.scale(-1,1);
  if(armIm)ctx.drawImage(armIm,-armW*.5,0,armW,armH);
  if(g.defense>0&&paintable)drawSleeve(ctx,rig,armW,armH,g.defense);
  if(hand){ctx.save();ctx.translate(0,armH*rig.arm.grip);if(mirror)ctx.scale(-1,1);hand(ctx);ctx.restore();}
  ctx.restore();
 };

 // Far side first, then the body, then the near side: nothing is drawn over its own sleeve.
 drawLeg(rig.leg.back,-gait,true);
 drawArm(rig.arm.back,.16+gait*.5,true,g.shield>0&&paintable?c=>drawShield(c,rig,g.shield,armH):null);
 if(g.shoulders>0&&paintable)drawPauldron(ctx,rig,rig.arm.back,armW,g.shoulders,-1);

 ctx.translate(0,-bob);
 drawLeg(rig.leg.front,gait,false);
 if(torsoIm)ctx.drawImage(torsoIm,torsoBox.cx-torsoW*.5,torsoBox.top,torsoW,torsoH);
 if(g.defense>0&&paintable)drawBodyArmor(ctx,rig,torsoBox,g.defense,Math.abs(rig.arm.front.x)+Math.abs(rig.arm.back.x)+armW*.5);
 if(headIm)ctx.drawImage(headIm,headBox.cx-headW*.5,headBox.top,headW,headH);
 if(g.helmet>0&&paintable)drawHelmet(ctx,rig,headBox,g.helmet);

 let angle=opts.armAngle;
 if(angle===undefined||angle===null){
  angle=fitting?-.9:.12;
  if(attack){const q=attack.t/attack.duration;angle=q<.44?-.3-q*4:-2.06+(q-.44)*6;}
  else if(moving)angle=.12+gait*.5;
 }
 drawArm(rig.arm.front,angle,false,c=>{
  c.rotate(fitting?.10-angle:.34);
  if(mg?.weapon)drawHeldWeapon(c,mg.weapon,mg.weaponTier??g.melee,fitting,mg.weaponSlot==='ranged');
 });
 if(g.shoulders>0&&paintable)drawPauldron(ctx,rig,rig.arm.front,armW,g.shoulders,1);
 ctx.restore();
}
