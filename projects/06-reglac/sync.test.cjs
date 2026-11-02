const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../../shared/sync.js'),'utf8');
test('RegLAC on public hosting shares station 6 and corrects clock skew without Firebase Date CORS access',async()=>{
 const serverTime=Date.UTC(2026,10,2,23,30,0),stores=new Map(),requests=[];
 const fetch=async(url,options={})=>{
  requests.push({url,method:options.method});
  if(options.method==='HEAD')return {ok:true,headers:{get:()=>new Date(serverTime).toUTCString()}};
  if(options.method==='PUT'){const body=JSON.parse(options.body);body.updatedAt=serverTime;stores.set(url,body);}
  return {ok:true,headers:{get:()=>null},json:async()=>stores.get(url)||null};
 };
 function client(skew){const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},window={dispatchEvent:()=>{}};
  vm.runInNewContext(source,{window,location:{hostname:'bidaiinaction.netlify.app',search:'?station=6'},sessionStorage:storage,localStorage:storage,URLSearchParams,fetch,AbortSignal,Date:{now:()=>serverTime+skew,parse:Date.parse},JSON,Promise,setTimeout,CustomEvent:class {}});return window.AI_SYNC;
 }
 const tablet=client(0),tv=client(300000);await tablet.read();await tv.read();
 assert.equal(tablet.station,6);assert.equal(tv.station,6);assert.equal(tablet.now(),tv.now());assert.ok(Math.abs(tablet.now()-serverTime)<=1000);
 await tablet.send({view:'game',projectId:'06',mode:'game',language:'en',game:{phase:'confirm',selected:['B','D'],startedAt:tablet.now()}});
 const received=await tv.read();assert.equal(received.projectId,'06');assert.equal(received.language,'en');assert.deepEqual(Array.from(received.game.selected),['B','D']);assert.equal(received.game.startedAt,tablet.now());
 assert.ok(requests.filter(r=>r.method==='PUT').every(r=>r.url.endsWith('/stations/6.json')));
 assert.equal(requests.filter(r=>r.method==='HEAD').length,2,'hosting clock calibration is cached per client');
});
