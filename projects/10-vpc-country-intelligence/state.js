(function(root){
 const scenes=['problem','ficha','sig','m0','m1','m2','loop'];
 function fresh(now=Date.now(),language='en'){return {screen:'menu',language,sc:'problem',con:[],ph:{},pk:{},p:{},runs:{},infoStarted:0,unlocked:true,lastActive:now};}
 function sanitize(v){
  if(!v||typeof v!=='object'||!['menu','info','game'].includes(v.screen)||!scenes.includes(v.sc)||!['es','en'].includes(v.language))return null;
  if(!Array.isArray(v.con)||v.con.length>8||v.con.some(i=>!Number.isInteger(i)||i<0||i>7)||new Set(v.con).size!==v.con.length)return null;
  if(!Number.isFinite(v.lastActive)||v.lastActive<0||!Number.isFinite(v.infoStarted)||v.infoStarted<0||typeof v.unlocked!=='boolean')return null;
  // Accept legacy packets while making both menu options immediately available.
  const clean={...fresh(v.lastActive,v.language),screen:v.screen,sc:v.sc,con:[...v.con],infoStarted:0,unlocked:true};
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
 const api={fresh,sanitize,visual};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.COUNTRY_STATE=api;
})(typeof window!=='undefined'?window:globalThis);
