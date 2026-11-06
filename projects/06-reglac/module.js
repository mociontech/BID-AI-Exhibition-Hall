/* RegLAC controller: information and an institutional video placeholder. */
window.ProjectModule={id:'06',async mountController({sync,mount}){
 const api=window.REGLAC,home='/index.html'+sync.stationQuery+'&projects=1';
 let state={view:'project',projectId:'06',section:'landing',language:'en',mode:'landing',screenIndex:null,game:null};
 let heartbeat=null,leaving=false,dirty=false,publishing=0,reading=false;
 function connection(ok){const el=mount.querySelector('.rl-network');if(el)el.hidden=ok;}
 function publish(){
  dirty=true;const snapshot=JSON.stringify(state);publishing++;
  return sync.send(state).then(response=>{connection(!!response?.ok);if(response?.ok&&snapshot===JSON.stringify(state))dirty=false;return response;}).finally(()=>publishing--);
 }
 function render(){
  const focus=mount.contains(document.activeElement)?document.activeElement:null;
  const selector=focus?.dataset.language?`[data-language="${focus.dataset.language}"]`:focus?.dataset.action?`[data-action="${focus.dataset.action}"]`:null;
  api.renderInto(mount,state);connection(!dirty);
  if(selector)mount.querySelector(selector)?.focus({preventScroll:true});
 }
 function update(next){if(leaving)return;state={...state,...next};state.section=state.mode;render();void publish();}
 async function goHome(){
  leaving=true;clearInterval(heartbeat);
  await sync.send({view:'home',projectId:null,section:null,language:state.language,mode:null,screenIndex:null,game:null});
  location.assign(home);
 }
 mount.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b||b.disabled||leaving)return;
  if(b.dataset.language)return update({language:b.dataset.language});
  const action=b.dataset.action;
  if(action==='home')return goHome();
  if(action==='menu')return update({mode:'landing'});
  if(action==='back')return state.mode==='landing'?goHome():update({mode:'landing'});
  if(action==='information')return update({mode:'info'});
  if(action==='video')return update({mode:'video'});
  if(action==='retry')return publish();
  if(action==='fullscreen'){
   try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
   catch{mount.querySelector('[data-status]').textContent=api.words[state.language].noFullscreen;}
  }
 });
 const remote=await sync.read();
 if(remote?.projectId==='06'){
  // Existing game/results packets open the replacement, never the retired game.
  state.mode=api.normalizeMode(remote.mode);state.section=state.mode;
 }
 if(remote?.language==='es')state.language='es';
 render();void publish();
 heartbeat=setInterval(async()=>{
  if(leaving||publishing||reading)return;reading=true;
  try{
   if(dirty)await publish();else{
    const latest=await sync.read();
    if(['view','projectId','mode','language','game'].some(key=>latest?.[key]!==state[key]))void publish();
   }
  }finally{reading=false;}
 },1500);
 window.addEventListener('ai-sync-connection',event=>connection(event.detail.connected));
 window.addEventListener('pagehide',()=>{leaving=true;clearInterval(heartbeat);},{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}};
