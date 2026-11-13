/* Station 04: the supplied main-menu PNG (13 Nov 2026) with functional touch controls.
   "About the project" shows the animated infographic on the TV and "Video" the institutional
   video; the tablet keeps its artwork and only adds a Back pill while the TV shows one of them.
   English only: no ES/EN switch. */
window.ProjectModule={
 id:'04',
 async mountController({sync,mount,home}){
  const api=window.GUATIGUARA;
  let state={mode:'landing'},failed=false,leaving=false,retry=null;
  const t={
   info:'About the project: show the infographic on the TV',
   video:'Video: play the project video on the TV',
   home:'Home: back to all projects',
   back:'Back: show the main menu on the TV'
  };
  function publish(){
   const mode=state.mode;
   return sync.send({view:'project',projectId:'04',section:mode==='landing'?null:mode,language:'en',mode,screenIndex:null,game:null})
    .then(response=>{failed=!response?.ok;return response;},()=>{failed=true;});
  }
  async function goHome(){
   leaving=true;clearInterval(retry);
   await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  /* Only the Back pill and the pressed state change; the artwork is never re-rendered. */
  function update(){
   const back=mount.querySelector('.gtg-back');
   if(back)back.hidden=state.mode==='landing';
   mount.querySelector('.gtg-hit--information')?.setAttribute('aria-pressed',String(state.mode==='info'));
   mount.querySelector('.gtg-hit--video')?.setAttribute('aria-pressed',String(state.mode==='video'));
  }
  function show(mode){
   if(leaving)return;
   state.mode=mode;update();void publish();
  }
  mount.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button||leaving)return;
   const action=button.dataset.action;
   if(action==='information')return show('info');
   if(action==='video')return show('video');
   if(action==='back'){
    show('landing');
    mount.querySelector('.gtg-hit--information')?.focus({preventScroll:true});
    return;
   }
   if(action==='home')return void goHome();
  });
  try{
   const remote=await sync.read();
   if(remote?.projectId==='04'&&remote.view!=='home')state.mode=api.normalizeMode(remote.mode);
  }catch{}
  document.documentElement.lang='en';
  mount.innerHTML=api.tabletMenu(t);
  update();void publish();
  // If the TV could not be reached, keep resending the current screen until it is.
  retry=setInterval(()=>{if(failed&&!leaving)void publish();},2000);
  window.addEventListener('pagehide',()=>{leaving=true;clearInterval(retry);},{once:true});
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
 }
};
