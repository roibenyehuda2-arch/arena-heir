const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// The camera breathes with the duel: melee comes closer, separation reveals more arena.
export function arenaLayout(w,h,b){
 const distance=Math.abs(b.p.x-b.e.x),phone=w<700;
 const span=clamp(distance+(phone?9:7),phone?16:14,30),mid=(b.p.x+b.e.x)/2,center=clamp(mid,span/2,30-span/2);
 const gutter=clamp(w*.075,22,64),scale=clamp((w-gutter*2)/(span*(phone?46:60)),.3,Math.min(.82,h/760));
 const floor=Math.min(h*.7,h-82),left=center-span/2,pixels=w-gutter*2;
 const raw=x=>gutter+(x-left)/span*pixels,visualDistance=distance/span*pixels;
 // Keep the painted fighters readable at grappling range instead of letting their bodies merge.
 const breathingRoom=Math.max(0,(150*scale+12-visualDistance)/2),direction=b.p.x<=b.e.x?1:-1;
 const map=(x,who)=>raw(x)+(who==='p'?-direction*breathingRoom:who==='e'?direction*breathingRoom:0);
 return {floor,scale,map,span,center,left,top:Math.max(116,floor-h*.52),bottom:floor+46};
}
export function healthView(b,who){
 const a=b[who],lost=b.outcome===(who==='p'?'loss':'win');
 // A pre-update first-blood save keeps its rules, with one honest finish meter.
 if(b.rule==='first-blood')return {value:lost?0:a.protection+1,max:a.protectionMax+1};
 return {value:a.hp,max:a.stats.hp};
}
export function actionTiming(id,reduced=false){
 return reduced?{duration:100,impact:.5}:{duration:id==='heavy'?640:id==='quick'?380:520,impact:.48};
}
export function actionPose(id,t){
 const heavy=id==='heavy',wind=.32,contact=.48;
 const prep=Math.min(1,t/wind),strike=Math.max(0,Math.min(1,(t-wind)/(contact-wind)));
 const recover=Math.max(0,Math.min(1,(t-.58)/.42));
 const reach=(t<wind?-prep*.16:t<contact?-.16+strike*1.16:1-recover);
 return {reach,lean:reach*(heavy?.16:.09),arm:t<wind?-.15-prep*(heavy?2.2:1.35):t<contact?-(heavy?2.35:1.5)+strike*(heavy?3.8:2.9):1.45-recover*1.6};
}
