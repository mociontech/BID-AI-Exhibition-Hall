// Refresh the real Bogotá basemap used by the local prototype.
// OpenFreeMap permits <=3,000 tiles / 50 MB, <=4 simultaneous requests.
// https://openfreemap.org/quick_start/
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets/bogota-map');
const bounds=[-74.24,4.45,-73.98,4.84]; // Bogotá's urban area, including every game scenario.
const headers={'User-Agent':'PredictToDo-exhibition-local-map/1.0'};
const get=async url=>{const r=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${r.status}: ${url}`);return r;};
const tileJSON=await(await get('https://tiles.openfreemap.org/planet')).json();
const template=tileJSON.tiles[0];
let previous;try{previous=JSON.parse(await fs.readFile(path.join(root,'manifest.json'),'utf8'));}catch{}
const reuse=previous?.tileTemplate===template;
const tileX=(lng,z)=>Math.floor((lng+180)/360*2**z);
const tileY=(lat,z)=>Math.floor((1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*2**z);
const jobs=[],tiles=[];
for(let z=8;z<=14;z++){
 // Landscape city overviews include context beyond the urban perimeter.
 const padding=z<=10?1:0;
 for(let x=tileX(bounds[0],z)-padding;x<=tileX(bounds[2],z)+padding;x++)for(let y=tileY(bounds[3],z)-padding;y<=tileY(bounds[1],z)+padding;y++){
  const key=`${z}/${x}/${y}`;tiles.push(key);
  jobs.push({file:`tiles/${key}.pbf`,url:template.replace('{z}',z).replace('{x}',x).replace('{y}',y)});
 }
}
if(tiles.length>3000)throw Error('Tile limit exceeded');
const glyphs=['0-255','256-511','8192-8447'];
for(const range of glyphs)jobs.push({file:`fonts/Noto Sans Regular/${range}.pbf`,url:`https://tiles.openfreemap.org/fonts/Noto%20Sans%20Regular/${range}.pbf`});
for(const suffix of ['.json','.png','@2x.json','@2x.png'])jobs.push({file:`sprite${suffix}`,url:`https://tiles.openfreemap.org/sprites/ofm_f384/ofm${suffix}`});
let cursor=0,bytes=0;
await Promise.all(Array.from({length:4},async()=>{
 while(cursor<jobs.length){
  const job=jobs[cursor++],file=path.join(root,job.file);
  let data;if(reuse)try{data=await fs.readFile(file);}catch{}
  data ||= Buffer.from(await(await get(job.url)).arrayBuffer());
  bytes+=data.length;if(bytes>50*1024*1024)throw Error('50 MB download limit exceeded');
  await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,data);
 }
}));
const manifest={version:1,retrieved:new Date().toISOString().slice(0,10),bounds,minzoom:8,maxzoom:14,tiles,tileTemplate:template,glyphs,
 attribution:tileJSON.attribution,source:'https://tiles.openfreemap.org/planet',license:'ODbL-1.0',bytes};
await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Saved ${tiles.length} real vector tiles, fonts and sprites (${(bytes/1024/1024).toFixed(2)} MB).`);
