import * as T from './vendor/three.module.min.js';

const material=(color,metalness=0,roughness=.65)=>new T.MeshStandardMaterial({color,metalness,roughness,flatShading:false});
export function gladiator(enemy=false){
  const root=new T.Group(),body=new T.Group();root.add(body);body.position.y=1.02;
  const skin=material(enemy?0xb77b55:0xd69c6c),steel=material(enemy?0x739799:0xbc913e,.7,.35),edge=material(0xe6c884,.72,.3),cloth=material(enemy?0x204e57:0x851f23),leather=material(0x35241d),blade=material(0xd9e0de,.85,.22),dark=material(0x201c19);
  function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const sphere=(p,r,m,x,y,z,sx=1,sy=1,sz=1)=>{const a=mesh(p,new T.SphereGeometry(r,16,12),m,x,y,z);a.scale.set(sx,sy,sz);return a;};
  const box=(p,w,h,d,m,x=0,y=0,z=0)=>mesh(p,new T.BoxGeometry(w,h,d),m,x,y,z);
  mesh(body,new T.CylinderGeometry(.38,.27,.64,8),steel,0,.34,0);
  sphere(body,.24,steel,-.17,.52,.12,1,.7,.7);sphere(body,.24,steel,.17,.52,.12,1,.7,.7);
  for(let row=0;row<3;row++)for(const side of [-1,1])sphere(body,.12,steel,side*.12,.32-row*.13,.23,1,.7,.45);
  mesh(body,new T.CylinderGeometry(.30,.30,.11,12),leather,0,.03,0);
  sphere(body,.105,edge,0,.03,.3,1,1,.35);
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2,strip=box(body,.16,.40,.045,cloth,Math.sin(a)*.29,-.18,Math.cos(a)*.29);strip.rotation.y=a;strip.rotation.x=-Math.cos(a)*.12;box(strip,.12,.035,.055,edge,0,-.15,0);}
  const head=new T.Group();head.position.y=.89;head.scale.setScalar(1.22);body.add(head);
  sphere(head,.245,skin,0,.12,0,.94,1.2,.96);
  sphere(head,.045,skin,0,.10,.238,.75,1.5,1.25);box(head,.10,.021,.022,dark,0,-.035,.208);sphere(head,.07,skin,0,-.082,.13,1.4,.55,1.1);
  for(const side of [-1,1]){sphere(head,.051,material(0xf7ede0),side*.09,.20,.202,1,.65,.45);sphere(head,.027,dark,side*.09,.20,.229,.65,1,.5);const brow=box(head,.105,.026,.025,dark,side*.09,.257,.214);brow.rotation.z=side*.13;box(head,.055,.28,.11,steel,side*.205,.08,.01);}
  const helmet=mesh(head,new T.SphereGeometry(.264,16,10,0,Math.PI*2,0,Math.PI*.5),steel,0,.31,0);helmet.scale.z=.97;
  mesh(head,new T.TorusGeometry(.263,.023,6,20),edge,0,.31,0).rotation.x=Math.PI/2;
  box(head,.036,.16,.04,edge,0,.29,.235);
  for(let i=0;i<13;i++){const a=(i/12-.5)*Math.PI*.85,piece=box(head,.075,.23,.07,cloth,0,.36+Math.cos(a)*.35,Math.sin(a)*.35);piece.rotation.x=-a;}
  const arms=[],elbows=[],hips=[],knees=[];
  for(const side of [-1,1]){
    const shoulder=new T.Group();shoulder.position.set(side*.41,.61,0);body.add(shoulder);arms.push(shoulder);
    sphere(shoulder,.17,skin,0,-.055,0,1,1.05,1);
    mesh(shoulder,new T.CapsuleGeometry(.105,.22,3,8),skin,0,-.22,0);
    if(side===1)sphere(shoulder,.18,steel,0,.01,0,1.05,.68,1.1);
    const elbow=new T.Group();elbow.position.y=-.40;shoulder.add(elbow);elbows.push(elbow);
    mesh(elbow,new T.CapsuleGeometry(.085,.23,3,8),skin,0,-.18,0);
    mesh(elbow,new T.CylinderGeometry(.098,.083,.19,8),leather,0,-.27,0);
    sphere(elbow,.095,skin,0,-.39,0,1,.95,.7);for(let finger=0;finger<4;finger++){const knuckle=sphere(elbow,.032,skin,-.062+finger*.04,-.43,.045,.65,1.3,1);};sphere(elbow,.042,skin,side*.085,-.37,.02,.8,1.3,.8);
    const hip=new T.Group();hip.position.set(side*.17,-.02,0);body.add(hip);hips.push(hip);
    mesh(hip,new T.CapsuleGeometry(.135,.23,3,8),skin,0,-.22,0);
    const knee=new T.Group();knee.position.y=-.43;hip.add(knee);knees.push(knee);
    sphere(knee,.12,steel,0,0,.035);
    mesh(knee,new T.CylinderGeometry(.105,.08,.48,8),steel,0,-.27,0);
    box(knee,.19,.10,.32,leather,0,-.51,.065);
    for(let j=0;j<2;j++)box(knee,.21,.034,.26,edge,0,-.40-j*.08,.015);
  }
  const sword=new T.Group();sword.position.y=-.40;elbows[1].add(sword);
  mesh(sword,new T.CylinderGeometry(.045,.045,.22,8),leather,0,-.06,0);
  box(sword,.32,.055,.085,edge,0,-.18,0);
  const metalBlade=mesh(sword,new T.CylinderGeometry(.070,.055,.82,4),blade,0,-.62,0);metalBlade.rotation.y=Math.PI/4;
  mesh(sword,new T.ConeGeometry(.075,.26,4),blade,0,-1.16,0).rotation.z=Math.PI;
  const shield=new T.Group();shield.position.set(-.035,-.32,.11);shield.rotation.x=1;elbows[0].add(shield);
  mesh(shield,new T.CylinderGeometry(.40,.40,.08,32),steel).rotation.x=Math.PI/2;
  mesh(shield,new T.TorusGeometry(.395,.025,6,32),edge,0,0,.045);
  sphere(shield,.13,edge,0,0,.055,1,1,.65);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;sphere(shield,.021,edge,Math.cos(a)*.33,Math.sin(a)*.33,.05);}
  root.rotation.y=enemy?-1.12:1.12;
  return {root,body,head,arms,elbows,hips,knees,sword,shield,steel,cloth,enemy,pose:'idle',walk:false,dead:false,phase:enemy?2:0};
}

const poses={
  idle:[-.45,-.7,-.55,-.85,0,0,0,0,0],
  windup:[-.6,-2.6,-.65,-.4,-.15,.28,-.1,.12,-.12],
  strike:[-.4,-1.5,-.65,-.02,.45,-.35,.1,.3,.16],
  block:[-1.25,-.8,-.6,-.8,-.18,.2,.16,.12,-.12],
  hit:[.15,.25,-.3,-.6,-.24,.18,.12,.25,-.26],
  jump:[-1,-1.7,-.8,-.7,1.2,-.7,-1.4,-.8,.16],
  duck:[-1.2,-1.4,-.6,-.9,.9,.85,-1.3,-1.2,.45],
  down:[.2,.6,-.1,-.1,.6,-.2,-.6,-.3,-1.5]
};
export function updateGladiator(f,time,dt,reduced){
  const p=poses[f.pose]||poses.idle,s=Math.min(1,dt*16),phase=time*10+f.phase;
  const values=[f.arms[0].rotation,f.arms[1].rotation,f.elbows[0].rotation,f.elbows[1].rotation,f.hips[0].rotation,f.hips[1].rotation,f.knees[0].rotation,f.knees[1].rotation,f.body.rotation];
  values.forEach((v,i)=>{let target=p[i];if(f.walk&&!reduced){if(i===4)target+=Math.sin(phase)*.65;if(i===5)target-=Math.sin(phase)*.65;if(i===6)target-=Math.max(0,Math.sin(phase))*.55;if(i===7)target-=Math.max(0,-Math.sin(phase))*.55;if(i===1)target-=Math.sin(phase)*.2;}v.x+=(target-v.x)*s;});
  f.head.rotation.y=Math.sin(time*1.7+f.phase)*.045;f.head.rotation.z=f.pose==='hit'?.13:Math.sin(time*2+f.phase)*.02;f.body.position.y=1.02+(f.pose==='duck'?-.30:0)+(f.pose==='down'?-.6:0)+(reduced?0:f.walk?Math.abs(Math.sin(phase))*.045:Math.sin(time*2.4+f.phase)*.018);
}
