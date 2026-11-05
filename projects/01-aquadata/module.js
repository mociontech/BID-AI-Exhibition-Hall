/* AquaData tablet controller (project 01).
   Screens come from ./visual.js (shared with the TV mirror). This file owns the
   tablet state, the timers and what gets sent to the station. */
window.ProjectModule={
 id:'01',
 async mountController({project,sync,mount,home}){
  const V=window.AQUADATA_VISUAL;
  const ANALYSIS_MS=3200, MAX_PICKS=V.MAX_PICKS;
  let data=null,analysisTimer=null;
  let state={language:'en',mode:'landing',step:1,p1:[],p2:[],analysisReady:false};
  const pickKey=()=>state.step===2?'p1':'p2';
  const chosen=()=>state[pickKey()];
  const found=list=>list.filter(id=>data.outcomes.get(id)===true).length;
  const payload=()=>({step:state.step,p1:state.p1,p2:state.p2,p1Result:found(state.p1),p2Result:found(state.p2)});
  function send(){
   const game=state.mode==='game';
   return sync.send({view:game?'game':'project',projectId:project.id,section:game?`game-${state.step}`:state.mode==='info'?'technical-sheet':null,language:state.language,mode:state.mode,screenIndex:game?state.step:1,game:game?payload():null});
  }
  function set(next){state={...state,...next};document.documentElement.lang=state.language;schedule();render();void send();}
  /* The analysis bar only completes while the tablet is still on step 3. */
  function schedule(){
   const analysing=state.mode==='game'&&state.step===3&&!state.analysisReady;
   if(!analysing&&analysisTimer){clearTimeout(analysisTimer);analysisTimer=null;}
   if(analysing&&!analysisTimer)analysisTimer=setTimeout(()=>{analysisTimer=null;if(state.mode==='game'&&state.step===3)set({analysisReady:true});},ANALYSIS_MS);
  }
  function render(){
   if(!data){mount.innerHTML='<main class="aqd-loading">Cargando recursos de AquaData…</main>';return;}
   mount.innerHTML=V.render(state,{data,station:sync.station});
   bind();
  }
  function toggle(id){
   const key=pickKey(),list=state[key];
   const next=list.includes(id)?list.filter(value=>value!==id):list.length<MAX_PICKS?[...list,id]:list;
   if(next!==list)set({[key]:next});
  }
  function act(action){
   if(action==='information')set({mode:'info'});
   else if(action==='game')set({mode:'game',step:1,p1:[],p2:[],analysisReady:false});
   else if(action==='next')set({step:Math.min(6,state.step+1)});
   else if(action==='back'){if(state.step<=1)set({mode:'landing'});else set({step:state.step-1,analysisReady:state.step-1===3});}
   else if(action==='confirm'&&chosen().length===MAX_PICKS)set({step:state.step===2?3:5,analysisReady:false});
   else if(action==='restart')set({step:1,p1:[],p2:[],analysisReady:false});
   else if(action==='cover')set({mode:'landing'});
   else if(action==='home'){
    if(analysisTimer)clearTimeout(analysisTimer);
    sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null}).then(()=>location.assign(home));
   }
  }
  function bind(){
   mount.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>{if(button.dataset.language!==state.language)set({language:button.dataset.language});});
   mount.querySelectorAll('[data-contract]').forEach(button=>button.onclick=()=>toggle(button.dataset.contract));
   mount.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>act(button.dataset.action));
  }
  try{
   data=await V.load();
   document.documentElement.lang=state.language;
   render();void send();
  }catch(error){
   mount.innerHTML='<main class="aqd-loading">No se pudieron cargar los recursos del minijuego.</main>';
  }
 }
};
