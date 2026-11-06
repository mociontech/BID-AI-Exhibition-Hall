/* Shared schema, used by the browser and the existing station server. */
(function(root){
 const phases=['topics','follow','complete','animating'];
 const turns=['situation','follow'];
 function fresh(ready=true,unlockAt=0){return {version:3,phase:'topics',topic:null,situation:null,follow:null,turn:null,startedAt:0,ready,unlockAt};}
 function sanitize(value){
  if(!value||typeof value!=='object'||value.version!==3||!phases.includes(value.phase)||typeof value.ready!=='boolean')return null;
  const index=(v,max)=>v===null||Number.isInteger(v)&&v>=0&&v<=max;
  if(!index(value.topic,3)||!index(value.situation,0)||!index(value.follow,1))return null;
  if(!Number.isSafeInteger(value.unlockAt)||value.unlockAt<0||!Number.isSafeInteger(value.startedAt)||value.startedAt<0)return null;
  if(value.turn!==null&&!turns.includes(value.turn))return null;
  if(value.phase==='topics'&&(value.topic!==null||value.situation!==null||value.follow!==null))return null;
  if(value.phase!=='topics'&&(value.topic===null||value.situation===null||!value.ready))return null;
  if(['follow','complete'].includes(value.phase)&&value.situation===null)return null;
  if(value.phase==='complete'&&value.follow===null)return null;
  if(value.phase==='follow'&&value.follow!==null)return null;
  if(value.phase==='animating'){
   if(!turns.includes(value.turn)||value.startedAt<=0)return null;
   if(value.turn==='situation'&&(value.situation===null||value.follow!==null))return null;
   if(value.turn==='follow'&&(value.situation===null||value.follow===null))return null;
  }else if(value.turn!==null||value.startedAt!==0)return null;
  return {version:3,phase:value.phase,topic:value.topic,situation:value.situation,follow:value.follow,turn:value.turn,startedAt:value.startedAt,ready:value.ready,unlockAt:value.unlockAt};
 }
 const api={fresh,sanitize};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else root.PROFE_GABI_STATE=api;
})(typeof window!=='undefined'?window:globalThis);
