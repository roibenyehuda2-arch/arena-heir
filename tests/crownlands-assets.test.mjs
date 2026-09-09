import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {keyBackground} from '../dist/sprite-texture.mjs';
const pixels=new Uint8ClampedArray(5*5*4).fill(255);
for(let y=1;y<4;y++)for(let x=1;x<4;x++)if(x!==2||y!==2){const i=(y*5+x)*4;pixels[i]=20;pixels[i+1]=30;pixels[i+2]=40;}
keyBackground(pixels,5,5,1,1);
assert.equal(pixels[3],0);assert.equal(pixels[(2*5+2)*4+3],255);assert.equal(pixels[(1*5+1)*4+3],255);
for(const name of ['heroes','enemies','cover','forest','fire','magic']){const b=readFileSync(new URL(`../dist/assets/crownlands/${name}.webp`,import.meta.url));assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert.ok(b.length>10000);}
const html=readFileSync(new URL('../dist/crownlands.html',import.meta.url),'utf8');assert.match(html,/adventure.js/);assert.match(html,/adventure.css/);
assert.equal(existsSync(new URL('../dist/_qa.html',import.meta.url)),false);
console.log('Crownlands assets, production entry and edge-connected transparency preservation pass.');
