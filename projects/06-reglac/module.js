/* Project 06 controller, using the existing shared project and HTTP sync contracts. */
window.ProjectModule={id:'06',async mountController({sync,mount,home}){
 const S=window.REGLAC_STATE,api=window.REGLAC;
 home='/index.html'+sync.stationQuery+'&projects=1';
 let state={view:'project',projectId:'06',section:'landing',language:'es',mode:'landing',screenIndex:null,game:S.fresh()};
 let timer=null,heartbeat=null,leaving=false,dirty=false,publishing=0,reading=false;
 function connection(ok){const el=mount.querySelector('.rl-network');if(el)el.hidden=ok;}
 function publish(){
  dirty=true;const snapshot=JSON.stringify(state);publishing++;
  return sync.send(state).then(response=>{connection(!!response?.ok);if(response?.ok&&snapshot===JSON.stringify(state))dirty=false;return response;}).finally(()=>publishing--);
 }
 function render(){
  const focus=mount.contains(document.activeElement)?document.activeElement:null;
  const selector=focus?.dataset.doc?`[data-doc="${focus.dataset.doc}"]`:focus?.dataset.language?`[data-language="${focus.dataset.language}"]`:focus?.dataset.action?`[data-action="${focus.dataset.action}"]`:null;
  api.renderInto(mount,state);connection(!dirty);
  if(selector)mount.querySelector(selector)?.focus({preventScroll:true});
 }
 function arm(){
  clearTimeout(timer);if(leaving)return;const g=state.game;
  if(state.mode==='info'&&!g.ready)timer=setTimeout(()=>update({mode:'cta',game:{...state.game,ready:true,unlockAt:0}}),Math.max(0,g.unlockAt-api.now()));
  const step={organize:2000,scan:4000,identify:6000}[g.phase];
  if(state.mode==='game'&&step)timer=setTimeout(()=>setGame(S.reduce(state.game,'advance',api.now())),Math.max(0,g.animationAt+step-api.now()));
 }
 function update(next){if(leaving)return;state={...state,...next};state.section=state.mode==='game'?state.game.phase:state.mode;render();void publish();arm();}
 function setGame(game){if(game!==state.game)update({game});}
 function menu(){update({view:'project',mode:'landing',game:S.fresh(state.game.ready)});}
 function back(){
  const p=state.game.phase;
  if(state.mode!=='game'||p==='intro')return menu();
  if(['assist','organize','scan','identify','confirm'].includes(p))return update({game:{...state.game,phase:'transition',selected:[],startedAt:0,animationAt:0}});
  if(p==='results')return setGame({...state.game,phase:'assistReveal'});
  if(p==='assistReveal')return update({game:{...state.game,phase:'assist',selected:[],startedAt:0,animationAt:0,elapsed:[state.game.elapsed[0],null],outcomes:[state.game.outcomes[0],null]}});
  update({game:S.fresh(true)});
 }
 async function goHome(){
  leaving=true;clearTimeout(timer);clearInterval(heartbeat);
  await sync.send({view:'home',projectId:null,section:null,language:state.language,mode:null,screenIndex:null,game:null});
  location.assign(home);
 }
 mount.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b||b.disabled||leaving)return;
  if(b.dataset.language)return update({language:b.dataset.language});
  if(b.dataset.doc)return setGame(S.reduce(state.game,'select',api.now(),b.dataset.doc));
  const action=b.dataset.action;
  if(action==='home')return goHome();
  if(action==='menu')return menu();
  if(action==='back')return back();
  if(action==='retry')return publish();
  if(action==='fullscreen'){
   try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
   catch{mount.querySelector('[data-status]').textContent=api.words[state.language].noFullscreen;}
   return;
  }
  if(action==='information'){
   if(['info','cta'].includes(state.mode))return;
   return update({view:'project',mode:state.game.ready?'cta':'info',game:{...S.fresh(state.game.ready),unlockAt:state.game.ready?0:api.now()+10000}});
  }
  if(action==='game'&&state.game.ready)return update({view:'game',mode:'game',game:S.fresh(true)});
  if(state.mode==='game')setGame(S.reduce(state.game,action,api.now()));
 });
 const remote=await sync.read();
 const restored=remote?.projectId==='06'?S.sanitize(remote.game):null;
 if(restored&&['landing','info','cta','game'].includes(remote.mode))state={...state,view:remote.mode==='game'?'game':'project',mode:remote.mode,game:restored,language:remote.language==='en'?'en':'es'};
 else if(remote?.language==='en')state.language='en';
 render();void publish();arm();
 heartbeat=setInterval(async()=>{
  if(leaving||publishing||reading)return;reading=true;
  try{
   if(dirty)await publish();else{const latest=await sync.read();if(latest?.projectId!==state.projectId||JSON.stringify(latest.game)!==JSON.stringify(state.game))void publish();}
  }finally{reading=false;}
 },1500);
 window.addEventListener('ai-sync-connection',event=>connection(event.detail.connected));
 window.addEventListener('pagehide',()=>{leaving=true;clearTimeout(timer);clearInterval(heartbeat);},{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}};
