/* v36 source state plus station clock marks. Previous versions are not restored. */
(function(root){
 const stages=['intro','problem','ficha','deal','read','decide','time','sup','loop'];
 const sourceKeys=['sc','deal','p','run','why','dec','t','act','ip','tp','sr'];
 const fresh=()=>({version:36,sc:'intro',deal:null,p:0,run:0,why:false,dec:null,t:0,act:null,ip:0,tp:0,sr:0,sceneStartedAt:0,introStartedAt:0,readStartedAt:0,timeStartedAt:0,supStartedAt:0});
 function sanitize(v){
  if(!v||typeof v!=='object'||v.version!==36||!stages.includes(v.sc))return null;
  if(v.deal!==null&&(!Number.isInteger(v.deal)||v.deal<0||v.deal>2))return null;
  if(v.act!==null&&(!Number.isInteger(v.act)||v.act<0||v.act>2))return null;
  if(![null,'accept','adjust'].includes(v.dec)||typeof v.why!=='boolean')return null;
  if(![0,1,2].includes(v.run)||![0,1,2].includes(v.ip)||![0,1].includes(v.tp)||![0,1].includes(v.sr))return null;
  if(![v.p,v.t].every(n=>Number.isFinite(n)&&n>=0&&n<=1))return null;
  if(!['sceneStartedAt','introStartedAt','readStartedAt','timeStartedAt','supStartedAt'].every(k=>Number.isSafeInteger(v[k])&&v[k]>=0))return null;
  if(['read','decide','time','sup','loop'].includes(v.sc)&&v.deal===null)return null;
  return Object.fromEntries(Object.keys(fresh()).map(k=>[k,v[k]]));
 }
 function snapshot(v,now){
  const g=sanitize(v)||fresh();
  if(g.sc==='intro'&&g.ip===1&&g.introStartedAt&&now-g.introStartedAt>=8000)g.ip=2;
  if(g.sc==='read'&&g.run===1&&g.readStartedAt){g.p=Math.min(1,Math.floor(Math.max(0,now-g.readStartedAt)/120)*.025);if(g.p>=1)g.run=2;}
  if(g.sc==='sup'&&g.sr&&g.supStartedAt)g.t=Math.min(1,Math.floor(Math.max(0,now-g.supStartedAt)/120)*.03);
  return g;
 }
 const api={fresh,sanitize,snapshot,stages,sourceKeys};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.RISE_STATE=api;
})(typeof window==='undefined'?globalThis:window);
