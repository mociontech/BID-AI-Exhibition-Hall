(function(root){
 const scenes=['problem','ficha','sig','m0','m1','m2','loop'];
 const v51Scenes=['intro','problem','cty','ficha','dsg','sig','m0','ptr','m1','m2','loop'];
 const countries=['AR','BS','BB','BZ','BO','BR','CL','CO','CR','DO','EC','SV','GT','GY','HT','HN','JM','MX','NI','PA','PY','PE','SR','TT','UY','VE'];
 function freshV51(now=Date.now()){return {sc:'intro',cc:null,con:[],last:null,ph:{},pk:{},p:{},phaseAt:{},sceneAt:now,at:now,language:'en'};}
 function sanitizeV51(v){
  if(!v||!v51Scenes.includes(v.sc)||v.cc!==null&&!countries.includes(v.cc)||!['en','es'].includes(v.language))return null;
  if(!Array.isArray(v.con)||v.con.length>8||v.con.some(i=>!Number.isInteger(i)||i<0||i>7)||new Set(v.con).size!==v.con.length)return null;
  if(v.last!==null&&(!Number.isInteger(v.last)||v.last<0||v.last>7))return null;
  if(!Number.isFinite(v.at)||v.at<0||!Number.isFinite(v.sceneAt)||v.sceneAt<0)return null;
  const clean={...freshV51(v.at),sc:v.sc,cc:v.cc,language:v.language,con:[...v.con],last:v.last,sceneAt:v.sceneAt};
  for(let k=0;k<3;k++){
   const ph=v.ph?.[k],pick=v.pk?.[k],p=v.p?.[k],at=v.phaseAt?.[k];
   if(ph!==undefined&&!['ready','run','read','done'].includes(ph))return null;
   if(pick!==undefined&&pick!==null&&(!Number.isInteger(pick)||pick<0||pick>(k===1?4:2)||k===0&&pick!==0))return null;
   if(p!==undefined&&(!Number.isFinite(p)||p<0||p>1))return null;
   if(at!==undefined&&(!Number.isFinite(at)||at<0))return null;
   if(ph)clean.ph[k]=ph;if(pick!==undefined&&pick!==null)clean.pk[k]=pick;
   if(p!==undefined)clean.p[k]=p;if(at!==undefined)clean.phaseAt[k]=at;
  }
  return clean;
 }
 function fresh(now=Date.now(),language='en'){return {screen:'menu',language,sc:'problem',con:[],ph:{},pk:{},p:{},runs:{},infoStarted:0,unlocked:true,lastActive:now};}
 function sanitize(v){
  if(!v||typeof v!=='object'||!['menu','info','game'].includes(v.screen)||!scenes.includes(v.sc)||!['es','en'].includes(v.language))return null;
  if(!Array.isArray(v.con)||v.con.length>8||v.con.some(i=>!Number.isInteger(i)||i<0||i>7)||new Set(v.con).size!==v.con.length)return null;
  if(!Number.isFinite(v.lastActive)||v.lastActive<0||!Number.isFinite(v.infoStarted)||v.infoStarted<0||typeof v.unlocked!=='boolean')return null;
  // Accept legacy packets while making both menu options immediately available.
  const clean={...fresh(v.lastActive,v.language),screen:v.screen,sc:v.sc,con:[...v.con],infoStarted:0,unlocked:true};
  if(v.v51!==undefined){clean.v51=sanitizeV51(v.v51);if(!clean.v51)return null;}
  for(let k=0;k<3;k++){
   const phase=v.ph?.[k],pick=v.pk?.[k],run=v.runs?.[k];
   if(phase!==undefined&&!['ready','run','done'].includes(phase))return null;
   if(pick!==undefined&&pick!==null&&(!Number.isInteger(pick)||pick<0||pick>2))return null;
   if(run!==undefined&&(!Number.isFinite(run)||run<0))return null;
   if(phase==='run'&&!run)return null;
   if(phase)clean.ph[k]=phase;
   if(pick!==undefined&&pick!==null)clean.pk[k]=pick;
   if(run!==undefined)clean.runs[k]=run;
  }return clean;
 }
 function visual(state,now){const next={...state,p:{},ph:{...state.ph}};for(let k=0;k<3;k++){next.p[k]=state.ph[k]==='done'?1:state.ph[k]==='run'?Math.min(1,Math.max(0,(now-state.runs[k])/5200)):0;if(next.p[k]===1)next.ph[k]='done';}return next;}
 const api={fresh,sanitize,visual,freshV51,sanitizeV51};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.COUNTRY_STATE=api;
})(typeof window!=='undefined'?window:globalThis);
