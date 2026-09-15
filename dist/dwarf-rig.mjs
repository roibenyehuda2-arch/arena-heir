// Joint-local anatomy. The weapon and fingers share the same grip transform.
export function dwarfArmPose({armAngle=null,walk=0,moving=false,fitting=false}={}){
 const swing=moving?Math.sin(walk)*.12:0;
 const upper=armAngle===null?-.12+swing:armAngle;
 const elbow=armAngle===null?-.82:(-.82+Math.max(-.18,Math.min(.28,armAngle*.12)));
 return {shoulder:[43,-143],upper,elbow,upperLength:34,foreLength:28,handGrip:[0,12],weaponAngle:fitting?.25:.30};
}
export function drawDwarfArm(ctx,parts,pose,drawWeapon,phase='all'){
 const [upper,fore,hand]=parts;
 ctx.save();ctx.translate(...pose.shoulder);ctx.rotate(pose.upper);
 if(phase!=='grip')ctx.drawImage(upper,0,0,upper.width,upper.height*.84,-12,-9,24,41);
 ctx.translate(0,pose.upperLength);ctx.rotate(pose.elbow);
 if(phase!=='grip')ctx.drawImage(fore,-11,-9,22,42);
 ctx.translate(0,pose.foreLength);
 if(phase!=='limb'){
 ctx.save();ctx.translate(...pose.handGrip);
 // Keep the head of the axe outward; it pivots with the shoulder during attacks.
 ctx.rotate(pose.weaponAngle-pose.elbow);
 drawWeapon(ctx);ctx.restore();
 // Fingers and thumb occlude the shaft, with the cuff overlapping the wrist.
 ctx.drawImage(hand,-10,-6,20,28);
 }
 ctx.restore();
}
