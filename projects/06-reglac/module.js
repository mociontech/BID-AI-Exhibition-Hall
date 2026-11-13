/* Station 06: the supplied main-menu PNG (November 2026) with functional touch controls.
   "About project" shows the animated infographic on the TV and the second card plays the RegLAC
   video; the tablet keeps its artwork and only adds a Back pill while the TV shows one of them. */
window.ProjectModule={
 id:'06',
 async mountController({sync,mount}){
  const api=window.REGLAC,home='/index.html'+sync.stationQuery+'&projects=1';
  let state={mode:'landing'},failed=false,leaving=false,retry=null;
  const t={
   screen:api.words.screen,
   info:'About project: show the infographic on the TV',
   video:'Interactive experience: play the RegLAC video on the TV',
   home:'Start: back to all projects',
   back:'Back: show the RegLAC main screen on the TV',
   fullscreen:'Enter or exit fullscreen'
  };
  const ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg>';
  function publish(){
   const mode=state.mode;
   return sync.send({view:'project',projectId:'06',section:mode==='landing'?null:mode,language:'en',mode,screenIndex:null,game:null})
    .then(response=>{failed=!response?.ok;return response;},()=>{failed=true;});
  }
  async function goHome(){
   leaving=true;clearInterval(retry);
   await sync.send({view:'home',projectId:null,section:null,language:'en',mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  function render(){
   document.documentElement.lang='en';
   mount.innerHTML=`<main class="reglac-tablet" aria-label="RegLAC">
    <div class="reglac-artboard">
     <img class="reglac-tablet-image" src="${api.art.tablet}" width="1672" height="941" alt="${t.screen}" draggable="false">
     <nav class="reglac-controls" aria-label="RegLAC">
      <button class="reglac-hit reglac-hit--fullscreen" type="button" data-action="fullscreen" aria-label="${t.fullscreen}" title="${t.fullscreen}"></button>
      <button class="reglac-back" type="button" data-action="back" aria-label="${t.back}" hidden>${ARROW}<span>Back</span></button>
      <button class="reglac-hit reglac-hit--home" type="button" data-action="home" aria-label="${t.home}"></button>
      <button class="reglac-hit reglac-hit--info" type="button" data-action="information" aria-label="${t.info}" aria-pressed="false"></button>
      <button class="reglac-hit reglac-hit--video" type="button" data-action="video" aria-label="${t.video}" aria-pressed="false"></button>
     </nav>
    </div>
   </main>`;
   update();
  }
  /* Only the Back pill and the pressed state change; the artwork is never re-rendered. */
  function update(){
   const back=mount.querySelector('.reglac-back');
   if(back)back.hidden=state.mode==='landing';
   mount.querySelector('.reglac-hit--info')?.setAttribute('aria-pressed',String(state.mode==='info'));
   mount.querySelector('.reglac-hit--video')?.setAttribute('aria-pressed',String(state.mode==='video'));
  }
  function show(mode){
   if(leaving)return;
   state.mode=mode;update();void publish();
  }
  mount.addEventListener('click',async event=>{
   const button=event.target.closest('button');if(!button||button.disabled||leaving)return;
   const action=button.dataset.action;
   if(action==='information')return show('info');
   if(action==='video')return show('video');
   if(action==='back'){
    show('landing');
    mount.querySelector('.reglac-hit--info')?.focus({preventScroll:true});
    return;
   }
   if(action==='home')return void goHome();
   if(action==='fullscreen'){
    try{
     if(document.fullscreenElement)await document.exitFullscreen();
     else await document.documentElement.requestFullscreen();
    }catch{}
   }
  });
  try{
   const remote=await sync.read();
   if(remote?.projectId==='06'&&remote.view!=='home')state.mode=api.normalizeMode(remote.mode);
  }catch{}
  render();void publish();
  // If the TV could not be reached, keep resending the current screen until it is.
  retry=setInterval(()=>{if(failed&&!leaving)void publish();},2000);
  window.addEventListener('pagehide',()=>{leaving=true;clearInterval(retry);},{once:true});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
 }
};
