/* Firestore ranking is separate from the existing station synchronization. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PREDICTTODO_RANKING=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const config=Object.freeze({apiKey:'AIzaSyAd32fjHVssRxIzHijkeWd37MamHWzCajM',projectId:'f1-sap',collection:'bidPredictToDoRanking'});
 const links=Object.freeze({github:'https://github.com/EL-BID/PredictToDo',project:'https://knowledge.iadb.org/en/open-knowledge/code-development/open-source-solution/predicttodo'});
 const maxDuration=86400000,base=`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;
 function snapshot(game){
  if(!/^[a-f0-9-]{36}$/.test(game.sessionId||''))throw Error('Invalid session');
  const entries=Object.entries(game.results||{});
  if(!entries.length||entries.length>4||entries.some(([k,v])=>!/^[0-3]$/.test(k)||!Number.isInteger(v)||v<0||v>100))throw Error('Invalid results');
  const durationMs=Math.round(game.durationMs);
  if(!Number.isFinite(durationMs)||durationMs<1||durationMs>maxDuration)throw Error('Invalid duration');
  const score=entries.reduce((sum,[,v])=>sum+v,0);
  return {sessionId:game.sessionId,projectId:'02',displayName:String(game.playerName||'').trim().slice(0,40)||'Visitor',roleId:game.playerId,score,casesPlayed:entries.length,durationMs,rankKey:(400-score)*(maxDuration+1)+durationMs};
 }
 function encode(record){return Object.fromEntries(Object.entries(record).map(([k,v])=>[k,typeof v==='number'?{integerValue:String(v)}:{stringValue:String(v)}]));}
 function decode(doc){const row=Object.fromEntries(Object.entries(doc.fields||{}).map(([k,v])=>[k,v.integerValue!==undefined?Number(v.integerValue):v.stringValue]));return {...row,id:doc.name?.split('/').pop()};}
 async function request(url,body,method='POST'){
  const response=await fetch(`${url}${url.includes('?')?'&':'?'}key=${config.apiKey}`,{method,headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(12000)});
  if(!response.ok){const detail=await response.json().catch(()=>({}));throw Error(detail.error?.status||`Firebase ${response.status}`);}
  return response.json();
 }
 async function save(game){
  const record=snapshot(game);
  // Same session ID is updated on retry, never appended as a second player.
  await request(base+':commit',{writes:[{update:{name:`projects/${config.projectId}/databases/(default)/documents/${config.collection}/${record.sessionId}`,fields:encode(record)},updateTransforms:[{fieldPath:'updatedAt',setToServerValue:'REQUEST_TIME'}]}]});
  return record;
 }
 async function list(){
  const rows=await request(base+':runQuery',{structuredQuery:{from:[{collectionId:config.collection}],orderBy:[{field:{fieldPath:'rankKey'},direction:'ASCENDING'}],limit:5}});
  return rows.filter(item=>item.document).map(item=>decode(item.document)).filter(row=>Number.isInteger(row.score)&&row.score>=0&&row.score<=400&&row.durationMs>0);
 }
 function time(ms){const seconds=Math.floor(Math.max(0,ms||0)/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}.${String(Math.floor((ms||0)%1000/100))}`;}
 function clock(){let elapsed=0,started=null;return {start(now){if(started===null)started=now;},pause(now){if(started!==null){elapsed+=Math.max(0,now-started);started=null;}return Math.min(maxDuration,Math.max(1,Math.round(elapsed)));},reset(){elapsed=0;started=null;}};}
 return Object.freeze({config,links,maxDuration,snapshot,encode,decode,save,list,time,clock});
});
