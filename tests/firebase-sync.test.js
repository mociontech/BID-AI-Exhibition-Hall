const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const code=fs.readFileSync(path.join(__dirname,'..','shared','sync.js'),'utf8');

test('MAIIA uses the hosting clock on Netlify even when the TV clock is wrong',async()=>{
 const realNow=Date.now(),requests=[],window={dispatchEvent:()=>{}},values=new Map();
 class SkewedDate extends Date{static now(){return Date.now()+300000;}}
 const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
 const fetch=async(url,options={})=>{
  requests.push({url,method:options.method});
  if(options.method==='HEAD')return {ok:true,headers:{get:()=>new Date(realNow).toUTCString()}};
  return {ok:true,headers:{get:()=>null},json:async()=>({stationId:7,updatedAt:realNow,payload:JSON.stringify({projectId:'07',view:'game',language:'es',game:{phase:'analysis',analysisAt:realNow}})})};
 };
 vm.runInNewContext(code,{window,location:{hostname:'bidaiinaction.netlify.app',search:'?station=7'},sessionStorage:storage,localStorage:storage,URLSearchParams,fetch,AbortSignal,Date:SkewedDate,JSON,Promise,setTimeout,CustomEvent:class {}});
 const state=await window.AI_SYNC.read();await window.AI_SYNC.read();
 assert.equal(state.projectId,'07');assert.ok(Math.abs(window.AI_SYNC.now()-realNow)<1500);
 assert.equal(requests.filter(r=>r.method==='HEAD').length,1);
 assert.ok(requests.filter(r=>r.method!=='HEAD').every(r=>r.url.endsWith('/stations/7.json')));
});

test('two public links on one station exchange state through Firebase',async()=>{
 let stored=null;
 const requests=[];
 const fetch=async(url,options)=>{
  requests.push({url,options});
  if(options.method==='PUT'){
   stored=JSON.parse(options.body);
   stored.updatedAt=Date.now();
  }
  return {ok:true,headers:{get:()=>new Date().toUTCString()},json:async()=>stored};
 };
 function client(hostname){
  const values=new Map();
  const storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};
  const window={dispatchEvent:()=>{}};
  const context={window,location:{hostname,search:'?station=3'},sessionStorage:storage,localStorage:storage,URLSearchParams,fetch,AbortSignal,Date,JSON,Promise,setTimeout,CustomEvent:class {}};
  vm.runInNewContext(code,context);
  return window.AI_SYNC;
 }
 const tablet=client('preview--exhibition.netlify.app');
 const tv=client('preview--exhibition.netlify.app');
 const packet={view:'project',projectId:'04',language:'es',mode:'info',game:null};
 assert.equal((await tablet.send(packet)).ok,true);
 const received=await tv.read();
 assert.equal(received.projectId,'04');
 assert.equal(received.mode,'info');
 assert.equal(received.stationId,3);
 assert.ok(requests.every(item=>item.url.endsWith('/aiExhibitionHall/stations/3.json')));
 assert.equal(requests[0].options.method,'PUT');
});

test('localhost retains the local station API',async()=>{
 const requests=[];
 const fetch=async(url,options)=>{requests.push({url,options});return {ok:true,json:async()=>({view:'home',stationId:1})};};
 const storage={getItem:()=>null,setItem:()=>{}};
 const window={dispatchEvent:()=>{}};
 vm.runInNewContext(code,{window,location:{hostname:'localhost',search:'?station=1'},sessionStorage:storage,localStorage:storage,URLSearchParams,fetch,AbortSignal,Date,JSON,Promise,setTimeout,CustomEvent:class {}});
 await window.AI_SYNC.send({view:'home',projectId:null});
 await window.AI_SYNC.read();
 assert.equal(requests[0].url,'/api/state?station=1');
 assert.equal(requests[0].options.method,'POST');
 assert.equal(requests[1].url,'/api/state?station=1');
});

test('all ten station IDs retain independent public and local state',async()=>{
 const ids=[1,2,3,4,5,6,7,9,10,11],remote=new Map();
 const fetch=async(url,options={})=>{
  if(options.method==='PUT'){const value=JSON.parse(options.body);value.updatedAt=Date.now();remote.set(url,value);}
  if(options.method==='POST')remote.set(url,JSON.parse(options.body));
  return {ok:true,headers:{get:()=>new Date().toUTCString()},json:async()=>remote.get(url)||null};
 };
 function client(station,hostname){
  const values=new Map(),storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)},window={dispatchEvent:()=>{}};
  vm.runInNewContext(code,{window,location:{hostname,search:'?station='+station},sessionStorage:storage,localStorage:storage,URLSearchParams,fetch,AbortSignal,Date,JSON,Promise,setTimeout,CustomEvent:class {}});
  return window.AI_SYNC;
 }
 for(const hostname of ['localhost','bidaiinaction.netlify.app']){
  for(const id of ids){const tablet=client(id,hostname);assert.equal(tablet.station,id);assert.equal(tablet.stationQuery,'?station='+id);await tablet.send({view:'project',projectId:String(id).padStart(2,'0'),section:'isolated-'+id,language:'en',game:null});}
  for(const id of ids){const state=await client(id,hostname).read();assert.equal(state.projectId,String(id).padStart(2,'0'));assert.equal(state.section,'isolated-'+id);}
 }
 assert.equal(remote.size,20);
});
