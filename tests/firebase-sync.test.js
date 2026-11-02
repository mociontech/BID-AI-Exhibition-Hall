const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const code=fs.readFileSync(path.join(__dirname,'..','shared','sync.js'),'utf8');

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
