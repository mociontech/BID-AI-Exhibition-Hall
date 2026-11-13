/* Station 08: the supplied main-menu PNG (November 2026) with functional touch controls.
   "About project" shows the animated infographic on the TV and "Video" plays the Teachy video;
   the tablet keeps its artwork and only adds a Back pill while the TV shows one of them. */
window.ProjectModule={
 id:'08',
 async mountController({sync,mount,home}){
  let state={mode:'landing'};
  const t={
   screen:'Teachy: AI for a more personalized and efficient school',
   info:'About project: show the infographic on the TV',
   video:'Video: play the Teachy video on the TV',
   home:'Start: back to all projects',
   back:'Back: show the Teachy main screen on the TV',
   fullscreen:'Enter or exit fullscreen'
  };
  const ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg>';
  function publish(){
   return sync.send({view:'project',projectId:'08',section:state.mode==='info'||state.mode==='video'?state.mode:null,language:'en',mode:state.mode,screenIndex:null,game:null});
  }
  async function goHome(){
   await sync.send({view:'home',projectId:null,section:null,language:'en',mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  function render(){
   document.documentElement.lang='en';
   mount.innerHTML=`<main class="teachy-tablet" aria-label="Teachy">
    <div class="teachy-artboard">
     <img class="teachy-tablet-image" src="${TEACHY.art.tablet}" width="1672" height="941" alt="${t.screen}" draggable="false">
     <nav class="teachy-controls" aria-label="Teachy">
      <button class="teachy-hit teachy-hit--fullscreen" type="button" data-action="fullscreen" aria-label="${t.fullscreen}" title="${t.fullscreen}"></button>
      <button class="teachy-back" type="button" data-action="back" aria-label="${t.back}" hidden>${ARROW}<span>Back</span></button>
      <button class="teachy-hit teachy-hit--home" type="button" data-action="home" aria-label="${t.home}"></button>
      <button class="teachy-hit teachy-hit--info" type="button" data-action="information" aria-label="${t.info}" aria-pressed="false"></button>
      <button class="teachy-hit teachy-hit--video" type="button" data-action="video" aria-label="${t.video}" aria-pressed="false"></button>
     </nav>
    </div>
   </main>`;
   update();
  }
  /* Only the Back pill and the pressed state change; the artwork is never re-rendered. */
  function update(){
   const back=mount.querySelector('.teachy-back');
   if(back)back.hidden=state.mode==='landing';
   mount.querySelector('.teachy-hit--info')?.setAttribute('aria-pressed',String(state.mode==='info'));
   mount.querySelector('.teachy-hit--video')?.setAttribute('aria-pressed',String(state.mode==='video'));
  }
  function show(mode){
   state.mode=mode;update();void publish();
  }
  mount.addEventListener('click',async event=>{
   const button=event.target.closest('button');if(!button||button.disabled)return;
   const action=button.dataset.action;
   if(action==='information')return show('info');
   if(action==='video')return show('video');
   if(action==='back'){
    show('landing');
    mount.querySelector('.teachy-hit--info')?.focus({preventScroll:true});
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
   if(remote?.projectId==='08'&&remote.view!=='home'&&['info','video'].includes(remote.mode))state.mode=remote.mode;
  }catch{}
  render();void publish();
 }
};
