import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// A pixel-backed canvas double evaluates the actual cavity mask. Its polygon
// hit test is independent of the renderer and preserves drawImage source data.
function canvas(){
  const out={width:0,height:0,data:null};let path=[];
  const ctx={
    drawImage(source){out.data=new Uint8ClampedArray(source.data);},
    getImageData(){return {data:new Uint8ClampedArray(out.data)};},
    putImageData(p){out.data=new Uint8ClampedArray(p.data);},
    beginPath(){path=[];},moveTo(x,y){path.push([x,y]);},lineTo(x,y){path.push([x,y]);},closePath(){},
    isPointInPath(x,y){let inside=false;for(let i=0,j=path.length-1;i<path.length;j=i++){
      const [xi,yi]=path[i],[xj,yj]=path[j];
      if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
    }return inside;}
  };
  out.getContext=()=>ctx;return out;
}
const context=vm.createContext({document:{createElement:canvas},Uint8ClampedArray,Map,Math});
const source=readFileSync(new URL('../dist/market-art.mjs',import.meta.url),'utf8')
  .replace(/^import .*;\n/,'').replaceAll('export ','');
vm.runInContext(source+'\nglobalThis.makeCostume=costume;globalThis.stockSprite=itemSprite;',context);
for(let tier=1;tier<=7;tier++){
  const stock={width:100,height:100,data:new Uint8ClampedArray(100*100*4)};
  for(let i=0;i<stock.data.length;i+=4)stock.data.set([20,18,16,255],i);
  const offset=(x,y)=>(y*100+x)*4;
  // Central lower cavity is open on every tier; adjacent trim stays solid.
  stock.data.set([210,175,100,255],offset(49,90));
  stock.data.set([56,42,35,255],offset(48,90));
  const original=new Uint8ClampedArray(stock.data);
  const market={accessories:Array(32).fill(stock),gear:Array(32).fill(stock),bodies:[stock,stock,stock]};
  const gear={melee:0,helmet:tier};
  const fitted=context.makeCostume(market,'mage',gear);
  assert.equal(fitted.helmetTier,tier);
  assert.equal(fitted.helmet.data[offset(50,90)+3],0,'dark face cavity is transparent at tier '+tier);
  assert.equal(fitted.helmet.data[offset(5,5)+3],255,'dark shell outside opening survives');
  assert.equal(fitted.helmet.data[offset(49,90)+3],255,'bright metal inside outline survives');
  assert(fitted.helmet.data[offset(48,90)+3]>0&&fitted.helmet.data[offset(48,90)+3]<255,'edge paint fades smoothly');
  assert.deepEqual(stock.data,original,'source inventory sprite remains unchanged');
  assert.equal(context.stockSprite(market,'dwarf','helmet',tier),stock);
  assert.equal(context.makeCostume(market,'mage',gear).helmet,fitted.helmet,'full-face result is cached');
  const dwarf=context.makeCostume(market,'dwarf',gear);
  assert.notEqual(dwarf.helmet,fitted.helmet,'dwarf open-face derivative is independent');
  assert.equal(context.makeCostume(market,'dwarf',gear).helmet,dwarf.helmet,'dwarf result is cached');
  assert.equal(dwarf.helmet.data[offset(49,90)+3],0,'lower metal is removed above the beard');
  assert.equal(dwarf.helmet.data[offset(5,5)+3],255,'dwarf crown remains opaque');
  const eyeY=[.62,.59,.63,.64,.67,.68,.65,.76][tier];
  for(const eyeX of [30,65])assert.equal(dwarf.helmet.data[offset(eyeX,Math.floor(eyeY*100))+3],0,'both actual eyes remain visible');
  assert.deepEqual(stock.data,original,'dwarf fitting leaves stock art unchanged');
}
console.log('All 7 helmet tiers: full-face alpha, separate dwarf open-face fitting, visible eyes, intact crowns and unchanged stock icons pass.');
