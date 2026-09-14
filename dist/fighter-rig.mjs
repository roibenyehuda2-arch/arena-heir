// Articulated fighter rig.
//
// Every part is drawn at the aspect ratio of its own sprite and hung from a named joint, so the
// figure reads as one character. The previous rig forced each part into a fixed rectangle — a
// 99x292 arm squeezed into 40x80 — which is what made the fighters look assembled from spares.
//
// Worn equipment uses the shop's own painted illustrations, fitted to those joints. The old defect
// was the placement, not the artwork: a 76px helmet icon centred on a 130px head became a mask
// stuck to a forehead, and a boots picture cut at its midpoint hovered up a fully drawn bare shin.

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

// Worn illustrations, fitted to the rig instead of redrawn.
//
// The shop's painted helms, pauldrons, boots and shields are the good art in this project; the old
// defect was placing them, not drawing them. Each one is scaled from a joint measurement the rig
// already knows and anchored where that piece actually sits on a body.

// A helmet is sized from the skull box, not the head sprite, whose bounds include beard and hair.
// The atlas ships one painted helm set for all three classes — there are no wizard hats or hoods in
// it yet — so each class only varies the fit. The helms frame a face opening in their lower half,
// and a larger brow value lifts that opening clear of the eyes.
const HELMET_FIT={helm:{width:1.40,brow:.50},wizard:{width:1.30,brow:.54},hood:{width:1.34,brow:.52}};
function drawHelmetArt(ctx,rig,head,im){
 if(!im||!im.width)return;
 const cap=rig.cap||{x:0,y:.03,w:.62,h:.36},fit=HELMET_FIT[rig.hat]||HELMET_FIT.helm;
 const skullW=head.w*cap.w,skullTop=head.top+head.h*cap.y,skullH=head.h*cap.h;
 const w=skullW*fit.width,h=w*im.height/im.width;
 // Anchor by the face opening: the helm's brow line sits a little above the character's eyes.
 ctx.drawImage(im,head.cx+head.w*cap.x-w*.5,skullTop+skullH*fit.brow-h*fit.brow-h*.06,w,h);
}

// Shoulders and boots ship as left/right pairs in one cell, so each half goes on its own joint.
function drawPairHalf(ctx,im,side,w,x,y,h){
 const half=Math.floor(im.width/2);
 ctx.drawImage(im,side<0?0:im.width-half,0,half,im.height,x-w*.5,y,w,h??w*im.height/half);
}
function drawPauldronArt(ctx,rig,joint,armW,im,side){
 if(!im||!im.width)return;
 const half=Math.floor(im.width/2),w=armW*(rig.build==='heavy'?1.34:1.22),h=w*im.height/half;
 ctx.save();ctx.translate(joint.x,joint.y);
 // Centre the cap on the joint: a pauldron caps the shoulder, it does not hang down the chest.
 drawPairHalf(ctx,im,side,w,0,-h*.66,h);
 ctx.restore();
}
function drawBootArt(ctx,rig,legW,legH,im,side){
 if(!im||!im.width)return;
 const half=Math.floor(im.width/2);
 // Fit the shaft to the lower leg, then widen just enough to enclose the calf; a boot may take a
 // little distortion where a body may not.
 const h=legH*(rig.build==='heavy'?.78:.74),natural=h*half/im.height,w=clamp(legW*1.12,natural,natural*1.3);
 // The sole sits on the foot so the painted boot encloses it instead of hovering up the shin.
 drawPairHalf(ctx,im,side,w,0,legH*1.01-h,h);
}
function drawShieldArt(ctx,im,armH){
 if(!im||!im.width)return;
 const h=armH*1.02,w=h*im.width/im.height;
 ctx.drawImage(im,-w*.62,-h*.52,w,h);
}
// Body armor is a full painted torso piece, scaled to the torso and drawn under the arms.
function drawArmorArt(ctx,rig,torso,im){
 if(!im||!im.width)return;
 const w=torso.w*(rig.build==='heavy'?1.30:1.22),h=w*im.height/im.width;
 ctx.drawImage(im,torso.cx-w*.5,torso.top-h*.06,w,h);
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

 const gait=moving?Math.sin(walk)*.42:0,bob=moving?Math.abs(Math.sin(walk))*3:Math.sin(time*2)*1.8;
 const armH=rig.arm.h,armW=armH*ratio(armIm,FALLBACK.arm);
 const legH=rig.leg.h,legW=legH*ratio(legIm,FALLBACK.leg);
 const torsoH=rig.torso.h,torsoW=torsoH*ratio(torsoIm,FALLBACK.torso);
 const headH=rig.head.h,headW=headH*ratio(headIm,FALLBACK.head);
 const headBox={cx:rig.head.x,top:rig.head.y,w:headW,h:headH};
 const torsoBox={cx:rig.torso.x,top:rig.torso.y,bottom:rig.torso.y+torsoH,w:torsoW};

 // Limbs share one sprite, so the far side reads by depth instead: its own joint, its own swing,
 // and a shadow pass over it. Mirroring was tried and turned the trailing foot backwards mid-stride.
 const tint=kind==='thorn'?'hue-rotate(38deg) ':'';
 const farFilter=tint+'brightness(.72) saturate(.9)';
 const drawLeg=(joint,angle,back)=>{
  ctx.save();ctx.translate(joint.x,joint.y);ctx.rotate(angle);
  if(back)ctx.filter=farFilter;
  if(legIm)ctx.drawImage(legIm,-legW*.5,0,legW,legH);
  if(mg?.boots)drawBootArt(ctx,rig,legW,legH,mg.boots,back?-1:1);
  ctx.restore();
 };
 // One arm, hung from its shoulder. What the hand holds is drawn first so the fist closes over it.
 const drawArm=(joint,angle,back,hand)=>{
  ctx.save();ctx.translate(joint.x,joint.y);ctx.rotate(angle);
  if(back)ctx.filter=farFilter;
  if(hand){ctx.save();ctx.translate(0,armH*rig.arm.grip);hand(ctx);ctx.restore();}
  if(armIm)ctx.drawImage(armIm,-armW*.5,0,armW,armH);
  ctx.restore();
 };

 // Far side first, then the body, then the near side: nothing is drawn over its own sleeve.
 drawLeg(rig.leg.back,-gait,true);
 const backSwing=.16+gait*.5;
 drawArm(rig.arm.back,backSwing,true,null);
 if(mg?.shoulders)drawPauldronArt(ctx,rig,rig.arm.back,armW,mg.shoulders,-1);

 ctx.translate(0,-bob);
 drawLeg(rig.leg.front,gait,false);
 if(torsoIm)ctx.drawImage(torsoIm,torsoBox.cx-torsoW*.5,torsoBox.top,torsoW,torsoH);
 if(mg?.armor)drawArmorArt(ctx,rig,torsoBox,mg.armor);
 if(headIm)ctx.drawImage(headIm,headBox.cx-headW*.5,headBox.top,headW,headH);
 if(mg?.helmet)drawHelmetArt(ctx,rig,headBox,mg.helmet);
 if(mg?.shield){ctx.save();ctx.translate(rig.arm.back.x,rig.arm.back.y);ctx.rotate(backSwing);ctx.translate(0,armH*rig.arm.grip);drawShieldArt(ctx,mg.shield,armH);ctx.restore();}

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
 if(mg?.shoulders)drawPauldronArt(ctx,rig,rig.arm.front,armW,mg.shoulders,1);
 ctx.restore();
}
