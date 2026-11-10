import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base='https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/ordenamientoterritorial/';
async function query(layer,where,outFields){
 const params=new URLSearchParams({where,outFields,outSR:'4326',f:'geojson',maxAllowableOffset:'0.00005'});
 const response=await fetch(base+layer+'/MapServer/0/query?'+params,{signal:AbortSignal.timeout(30000)});
 const json=await response.json();if(!response.ok||!json.features?.length)throw Error('Official Bogotá geometry unavailable: '+layer);
 return json;
}
const [localities,urban]=await Promise.all([query('localidad','1=1','LOCCODIGO,LOCNOMBRE'),query('suelo','SUECSUELO=1','SUECODIGO,SUECSUELO')]);
if(localities.features.length!==20)throw Error('Expected the 20 official Bogotá localities');
const points=urban.features.flatMap(f=>f.geometry.coordinates.flat(f.geometry.type==='MultiPolygon'?2:1));
const bounds=[[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1]))],[Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))]];
const data={type:'FeatureCollection',title:'Bogotá D.C., Colombia',coordinateSystem:'EPSG:4326',urbanBounds:bounds,
 sources:[base+'localidad/MapServer/0',base+'suelo/MapServer/0'],attribution:'Secretaría Distrital de Planeación · Catastro Bogotá / IDECA',
 license:'CC-BY-4.0',licenseURL:'https://creativecommons.org/licenses/by/4.0/',retrieved:new Date().toISOString().slice(0,10),
 features:[...localities.features.map(f=>({...f,properties:{...f.properties,kind:'locality'}})),...urban.features.map(f=>({...f,properties:{...f.properties,kind:'urban'}}))]};
const target=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../assets/bogota-map/geography.geojson');
await fs.writeFile(target,JSON.stringify(data)+'\n');
console.log(JSON.stringify({localities:20,urbanFeatures:urban.features.length,bounds,bytes:(await fs.stat(target)).size}));
