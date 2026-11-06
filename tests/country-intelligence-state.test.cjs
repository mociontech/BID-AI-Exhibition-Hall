const test=require('node:test'),assert=require('node:assert/strict');
const state=require('../projects/10-vpc-country-intelligence/state.js');
test('comparison progress is recovered from its original timestamp',()=>{
 const value={...state.fresh(10000),screen:'game',sc:'m0',ph:{0:'run'},runs:{0:10000}};
 const restored=state.sanitize(JSON.parse(JSON.stringify(value)));
 assert.equal(state.visual(restored,12600).p[0],.5);
 assert.equal(state.visual(restored,15200).ph[0],'done');
 assert.equal(restored.ph[0],'run');
});
test('all three human decisions survive transport, including option zero',()=>{
 const original={...state.fresh(10000,'es'),con:[0,1,2,3,4,5,6,7],pk:{0:0,1:1,2:2}};
 assert.deepEqual(state.sanitize(original).pk,original.pk);
 assert.equal(state.sanitize({...original,con:[0,0]}),null);
 assert.equal(state.sanitize({...original,con:[8]}),null);
 assert.equal(state.sanitize({...original,pk:{0:3}}),null);
 assert.equal(state.sanitize({...original,ph:{0:'run'}}),null);
 assert.equal(state.sanitize({...original,lastActive:NaN}),null);
});

test('Country Intelligence uses the hosting clock and preserves private room links on Netlify',async()=>{
 const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
 const realNow=Date.now(),requests=[],room='c'.repeat(32),values=new Map();
 class SkewedDate extends Date{static now(){return Date.now()+300000;}}
 const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const window={dispatchEvent:()=>{}};
 const fetch=async(url,options={})=>{
  requests.push({url,method:options.method});
  if(options.method==='HEAD')return {ok:true,headers:{get:()=>new Date(realNow).toUTCString()}};
  return {ok:true,headers:{get:()=>null},json:async()=>({stationId:10,updatedAt:realNow,payload:JSON.stringify({projectId:'10',view:'game',language:'es',game:{...state.fresh(realNow,'es'),screen:'game',sc:'m0'}})})};
 };
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../shared/sync.js'),'utf8'),{window,location:{hostname:'bidaiinaction.netlify.app',search:'?station=10&room='+room},sessionStorage:storage,localStorage:storage,URLSearchParams,fetch,AbortSignal,Date:SkewedDate,JSON,Promise,setTimeout,CustomEvent:class {}});
 const received=await window.AI_SYNC.read();
 assert.equal(received.projectId,'10');
 assert.ok(Math.abs(window.AI_SYNC.now()-realNow)<1500);
 assert.equal(window.AI_SYNC.stationQuery,'?station=10&room='+room);
 assert.equal(requests.filter(r=>r.method==='HEAD').length,1);
 assert.ok(requests.filter(r=>r.method!=='HEAD').every(r=>r.url.endsWith('/rooms/'+room+'.json')));
});
