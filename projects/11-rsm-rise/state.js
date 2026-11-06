/* Shared, versioned state for the restored prototype game. No real deal data. */
(function(root){
 const stages=['deal','read','decide','sup','loop'];
 const fresh=()=>({version:2,sc:'deal',deal:null,unlocked:false,infoStartedAt:0,readStartedAt:0,supStartedAt:0,why:false,dec:null,act:null,decisionAt:0,actionAt:0,simulation:true});
 function sanitize(v){
  if(!v||typeof v!=='object'||v.version!==2||!stages.includes(v.sc))return null;
  if(v.deal!==null&&(!Number.isInteger(v.deal)||v.deal<0||v.deal>2))return null;
  if(v.act!==null&&(!Number.isInteger(v.act)||v.act<0||v.act>2))return null;
  if(![null,'accept','adjust'].includes(v.dec)||typeof v.why!=='boolean'||typeof v.unlocked!=='boolean')return null;
  if(!['infoStartedAt','readStartedAt','supStartedAt','decisionAt','actionAt'].every(k=>Number.isSafeInteger(v[k])&&v[k]>=0))return null;
  if(v.sc!=='deal'&&v.deal===null)return null;
  if(['decide','sup','loop'].includes(v.sc)&&!v.readStartedAt)return null;
  if(['sup','loop'].includes(v.sc)&&!v.dec)return null;
  if(v.sc==='loop'&&(v.act===null||!v.supStartedAt))return null;
  return Object.fromEntries(Object.keys(fresh()).map(k=>[k,k==='simulation'?true:v[k]]));
 }
 function snapshot(v,now){
  const g=sanitize(v)||fresh();
  return {...g,p:g.readStartedAt?Math.max(0,Math.min(1,(now-g.readStartedAt)/4800)):0,t:g.supStartedAt?Math.max(0,Math.min(1,(now-g.supStartedAt)/4080)):0};
 }
 const api={fresh,sanitize,snapshot,stages};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.RISE_STATE=api;
})(typeof window==='undefined'?globalThis:window);
