/* Uses the existing controller contract and station HTTP sync. No chat API. */
window.ProjectModule={
 id:'05',
 async mountController({sync,mount,home}){
  const api=window.PROFE_GABI,schema=window.PROFE_GABI_STATE;
  let state={view:'project',projectId:'05',section:'menu',language:'en',mode:'landing',screenIndex:null,game:schema.fresh()};
  let timer=null,heartbeat=null,leaving=false,dirty=false,publishing=0,polling=false;
  function stopTimer(){clearTimeout(timer);timer=null;}
  function publish(){
   dirty=true;const snapshot=JSON.stringify(state);publishing++;
   return sync.send(state).then(response=>{if(response?.ok&&snapshot===JSON.stringify(state))dirty=false;return response;}).finally(()=>publishing--);
  }
  function render(){api.renderInto(mount,state);}
  function finishAnimation(){
   if(state.game.phase!=='animating')return;
   const phase={situation:'follow',follow:'complete'}[state.game.turn];
   setGame({phase,turn:null,startedAt:0});
  }
  function armTimer(){
   stopTimer();if(leaving)return;
   const g=state.game;
   if(state.mode==='info'&&!g.ready&&g.unlockAt){
    timer=setTimeout(()=>update({mode:'cta',game:{...state.game,ready:true,unlockAt:0}}),Math.max(0,g.unlockAt-api.now()));
   }else if(state.mode==='game'&&g.phase==='animating'){
    const animation=api.animation(state);
    timer=setTimeout(finishAnimation,Math.max(0,animation.total-animation.elapsed)+15);
   }
  }
  function update(next){
   if(leaving)return;
   state={...state,...next};state.section=state.mode==='game'?state.game.phase:state.mode;
   render();void publish();armTimer();
  }
  function setGame(next){update({game:{...state.game,...next}});}
  function menu(){update({view:'project',mode:'landing',game:schema.fresh(state.game.ready)});}
  function restart(){update({view:'game',mode:'game',game:schema.fresh(true)});}
  function back(){
   const g=state.game;
   if(state.mode!=='game')return menu();
   if(g.phase==='topics')return menu();
   if(g.phase==='animating'){
    if(g.turn==='situation')return restart();
    return setGame({phase:'follow',follow:null,turn:null,startedAt:0});
   }
   if(g.phase==='follow')return restart();
   return setGame({phase:'follow',follow:null});
  }
  async function goHome(){
   if(leaving)return;leaving=true;stopTimer();clearInterval(heartbeat);
   await sync.send({view:'home',projectId:null,section:null,language:state.language,mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  mount.addEventListener('click',async event=>{
   const button=event.target.closest('button');if(!button||button.disabled||leaving)return;
   const g=state.game,action=button.dataset.action;
   if(button.dataset.language){
    const language=button.dataset.language;if(language===state.language)return;
    // Rebuild the entire conversation in one language. Active typing restarts safely.
    update({language,game:g.phase==='animating'?{...g,startedAt:api.now()}:g});return;
   }
   if(action==='home')return goHome();
   if(action==='fullscreen'){
    try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
    catch{mount.querySelector('[data-status]').textContent=api.words[state.language].noFullscreen;}
    return;
   }
   if(action==='retry')return publish();
   if(action==='menu')return menu();
   if(action==='back')return back();
   if(action==='information'){
    if(state.mode==='info'||state.mode==='cta')return;
    return update({view:'project',mode:g.ready?'cta':'info',game:{...schema.fresh(g.ready),unlockAt:g.ready?0:api.now()+10000}});
   }
   if(action==='game'&&g.ready)return restart();
   if(state.mode!=='game')return;
   if(action==='restart'||action==='topics')return restart();
   if(action==='skip'&&g.phase==='animating')return finishAnimation();
   if(g.phase==='animating')return;
   const choose=(kind,expected,max)=>{
    if(button.dataset[kind]===undefined||g.phase!==expected)return false;
    const choice=Number(button.dataset[kind]);
    if(!Number.isInteger(choice)||choice<0||choice>max)return false;
    setGame({[kind]:choice,phase:'animating',turn:kind,startedAt:api.now()});return true;
   };
   if(button.dataset.topic!==undefined&&g.phase==='topics'){
    const topic=Number(button.dataset.topic);
    if(Number.isInteger(topic)&&topic>=0&&topic<window.PROFE_GABI_CONVERSATIONS[state.language].length)
     setGame({topic,situation:0,follow:null,phase:'animating',turn:'situation',startedAt:api.now()});
    return;
   }
   choose('follow','follow',1);
  });
  try{
   let remote=await sync.read();
   // After a station server restart, recover the last local controller state.
   if(remote?.view==='home'&&!remote.updatedAt){
    let saved=null;try{saved=JSON.parse(localStorage.getItem(sync.KEY)||'null');}catch{}
    if(saved?.projectId==='05')remote=saved;
   }
   const restored=schema.sanitize(remote?.game);
   if(remote?.projectId==='05'&&restored&&['landing','info','cta','game'].includes(remote.mode)){
    state={...state,language:remote.language==='es'?'es':'en',mode:remote.mode,view:remote.mode==='game'?'game':'project',game:restored};
    if(state.mode==='info'&&restored.unlockAt<=api.now())state={...state,mode:'cta',game:{...restored,ready:true,unlockAt:0}};
   }else if(remote?.language==='es')state.language='es';
  }catch{}
  render();void publish();armTimer();
  // Re-send only the newest local command after a lost connection, including
  // when the visitor has not touched the tablet since the failure.
  heartbeat=setInterval(async()=>{
   if(leaving||publishing||polling)return;polling=true;
   try{if(dirty)await publish();else await sync.read();}finally{polling=false;}
  },1500);
  window.addEventListener('pagehide',()=>{stopTimer();clearInterval(heartbeat);},{once:true});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
 }
};
