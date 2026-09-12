// Fixed wide camera: combat distance never changes the size of a fighter.
export function arenaLayout(w,h,b){
 const scale=Math.min(.68,w/940,h/1100),floor=Math.min(h*.64,h-210);
 const distance=Math.abs(b.p.x-b.e.x),mid=(b.p.x+b.e.x)/2;
 const gap=Math.max(0,(185*scale-distance/30*w*.86)/2);
 const map=(x,who)=>w*.07+x/30*w*.86+(who?(who==='p'?-1:1):Math.sign(x-mid))*gap;
 return {floor,scale,map,top:Math.max(145,floor-w*.49),bottom:floor+42};
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
