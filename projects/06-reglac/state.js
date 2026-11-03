/* Shared, serializable state: controller owns progression; display only renders. */
(function(root){
 const phases=['intro','manual','manualReveal','transition','assist','organize','scan','identify','confirm','assistReveal','results'];
 const keys=[['A','C'],['B','D']];
 const fresh=(ready=false)=>({phase:'intro',ready,unlockAt:0,selected:[],startedAt:0,animationAt:0,elapsed:[null,null],outcomes:[null,null]});
 function sanitize(value){
  if(!value||typeof value!=='object'||!phases.includes(value.phase)||typeof value.ready!=='boolean')return null;
  if(!['unlockAt','startedAt','animationAt'].every(k=>Number.isSafeInteger(value[k])&&value[k]>=0))return null;
  if(!Array.isArray(value.selected)||value.selected.length>2||value.selected.some(id=>!['A','B','C','D','E','F'].includes(id))||new Set(value.selected).size!==value.selected.length)return null;
  if(!Array.isArray(value.elapsed)||value.elapsed.length!==2||!value.elapsed.every(t=>t===null||Number.isSafeInteger(t)&&t>=0))return null;
  if(!Array.isArray(value.outcomes)||value.outcomes.length!==2||!value.outcomes.every(t=>t===null||typeof t==='boolean'))return null;
  return {...fresh(value.ready),phase:value.phase,unlockAt:value.unlockAt,selected:[...value.selected],startedAt:value.startedAt,animationAt:value.animationAt,elapsed:[...value.elapsed],outcomes:[...value.outcomes]};
 }
 function reduce(g,action,now,id){
  if(action==='restart')return fresh(true);
  if(action==='start'&&g.phase==='intro')return {...g,phase:'manual',startedAt:now,selected:[]};
  if(action==='next'){
   const phase={manualReveal:'transition',transition:'assist',assistReveal:'results'}[g.phase];
   return phase?{...g,phase,selected:[]}:g;
  }
  if(action==='activate'&&g.phase==='assist')return {...g,phase:'organize',startedAt:now,animationAt:now,selected:[]};
  if(action==='advance'){
   const phase={organize:'scan',scan:'identify',identify:'confirm'}[g.phase];
   return phase?{...g,phase}:g;
  }
  if(!['manual','confirm'].includes(g.phase))return g;
  if(action==='select'&&['A','B','C','D','E','F'].includes(id))return {...g,selected:g.selected.includes(id)?g.selected.filter(x=>x!==id):g.selected.length<2?[...g.selected,id]:g.selected};
  if(action==='check'&&g.selected.length===2){
   const round=g.phase==='manual'?0:1,elapsed=[...g.elapsed],outcomes=[...g.outcomes];
   elapsed[round]=Math.max(0,now-g.startedAt);outcomes[round]=keys[round].every(x=>g.selected.includes(x));
   return {...g,phase:round===0?'manualReveal':'assistReveal',elapsed,outcomes,startedAt:0};
  }
  return g;
 }
 const api={fresh,sanitize,reduce,keys,phases};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.REGLAC_STATE=api;
})(typeof window!=='undefined'?window:globalThis);
