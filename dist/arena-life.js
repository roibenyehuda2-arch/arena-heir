// Animated compositing of the original painted arena. No gameplay state lives here.
export class ArenaLife {
  constructor(canvas,reduced=false){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.reduced=reduced;
    this.image=new Image();this.image.src=new URL('./arena.png',import.meta.url).href;
    this.particles=[];this.cheer=0;this.last=0;this.stopped=false;
    // Small spectator groups sampled inside seating areas, excluding stonework.
    this.groups=[];
    for(let x=45;x<825;x+=27){
      const upper=225+130*Math.sin(x/850*Math.PI/2);
      const lower=335+135*Math.sin(x/850*Math.PI/2);
      for(const y of [upper,upper+17,lower,lower+19]){
        if([195,365,480,633,775].some(t=>Math.abs(t-x)<20))continue;
        this.groups.push({x,y,phase:x*.19+y*.31});
      }
    }
    for(let x=1210;x<1510;x+=26)for(const y of [355-(x-1210)*.31,432-(x-1210)*.30])this.groups.push({x,y,phase:x*.23+y});
    this.resize=new ResizeObserver(()=>this.size());this.resize.observe(canvas);
    this.image.onload=()=>{if(!this.stopped){this.size();this.frame(0);}};
    this.visibility=()=>{cancelAnimationFrame(this.raf);if(!document.hidden&&!this.stopped)this.frame(performance.now());};
    document.addEventListener('visibilitychange',this.visibility);
  }
  size(){const r=this.canvas.getBoundingClientRect();this.w=r.width;this.h=r.height;const d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.w*d);this.canvas.height=Math.round(this.h*d);this.ctx.setTransform(d,0,0,d,0,0);if(this.reduced&&this.image.complete)this.draw(0,0);}
  react(strength=1){this.cheer=Math.min(3,this.cheer+strength);}
  dust(x,y,strength=1){if(this.reduced)return;for(let i=0;i<12*strength;i++)this.particles.push({x,y,vx:(Math.random()-.5)*80*strength,vy:-15-Math.random()*45,life:1,r:2+Math.random()*7});this.particles=this.particles.slice(-150);}
  draw(t,dt){
    const c=this.ctx,w=this.w,h=this.h;if(!w||!h||!this.image.naturalWidth)return;
    const scale=Math.max(w/1536,h/1024),ox=(w-1536*scale)/2,oy=(h-1024*scale)*.62;
    c.clearRect(0,0,w,h);c.save();c.translate(ox,oy);c.scale(scale,scale);c.drawImage(this.image,0,0,1536,1024);
    if(!this.reduced){
      for(const g of this.groups){
        const bounce=Math.sin(t*3.3+g.phase)*(1.8+this.cheer*2.8),sway=Math.sin(t*1.5+g.phase)*.9;
        c.save();c.beginPath();c.ellipse(g.x,g.y,13,17,0,0,Math.PI*2);c.clip();
        c.drawImage(this.image,g.x-16,g.y-22,32,44,g.x-16+sway,g.y-22+bounce,32,44);c.restore();
      }
      for(const [x,y]of [[31,174],[198,375],[363,275],[477,300],[490,435],[632,312],[774,319],[864,215],[1256,167],[1345,260],[1387,445],[1476,225],[920,573],[1124,576]]){
        const flicker=.7+Math.sin(t*12+x)*.15+Math.sin(t*19+y)*.1;
        c.globalCompositeOperation='screen';const glow=c.createRadialGradient(x,y,1,x,y,38);
        glow.addColorStop(0,`rgba(255,185,66,${.42*flicker})`);glow.addColorStop(1,'rgba(255,110,20,0)');c.fillStyle=glow;c.fillRect(x-38,y-38,76,76);
        for(let i=0;i<3;i++){const age=(t*.4+i/3+x)%1;c.globalAlpha=(1-age)*.7;c.fillStyle='#ffbd63';c.fillRect(x+Math.sin(t+i)*6,y-age*65,1.7,2.8);}c.globalAlpha=1;c.globalCompositeOperation='source-over';
      }
    }
    c.restore();
    const shade=c.createLinearGradient(0,0,0,h);shade.addColorStop(0,'rgba(10,10,15,.10)');shade.addColorStop(.55,'rgba(10,10,15,0)');shade.addColorStop(1,'rgba(10,10,15,.50)');c.fillStyle=shade;c.fillRect(0,0,w,h);
    for(const p of this.particles){p.life-=dt*.9;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=35*dt;c.globalAlpha=Math.max(0,p.life)*.45;c.fillStyle='#d5b48a';c.beginPath();c.ellipse(p.x,p.y,p.r*(2-p.life),p.r*.6,0,0,Math.PI*2);c.fill();}c.globalAlpha=1;this.particles=this.particles.filter(p=>p.life>0);this.cheer=Math.max(0,this.cheer-dt*.75);
  }
  frame(now){if(this.stopped||document.hidden)return;if(now-this.last>=32||!this.last){this.draw(now/1000,Math.min((now-this.last)/1000,.05));this.last=now;}if(!this.reduced)this.raf=requestAnimationFrame(t=>this.frame(t));}
  destroy(){this.stopped=true;cancelAnimationFrame(this.raf);this.resize.disconnect();document.removeEventListener('visibilitychange',this.visibility);this.image.onload=null;}
}
