/* Station 08: the supplied main-menu PNG (13 Nov 2026) with functional touch controls.
   "About the project" shows the animated infographic on the TV and "Video" plays the Teachy video;
   the tablet keeps its artwork and only adds a Back pill while the TV shows one of them. */
window.ProjectModule={
 id:'08',
 async mountController({sync,mount,home}){
  let state={mode:'landing'};
  const t={
   info:'About the project: show the infographic on the TV',
   video:'Video: play the Teachy video on the TV',
   home:'Home: back to all projects',
   back:'Back: show the main menu on the TV'
  };
  function publish(){
   return sync.send({view:'project',projectId:'08',section:state.mode==='info'||state.mode==='video'?state.mode:null,language:'en',mode:state.mode,screenIndex:null,game:null});
  }
  async function goHome(){
   await sync.send({view:'home',projectId:null,section:null,language:'en',mode:null,screenIndex:null,game:null});
   location.assign(home);
  }
  function render(){
   document.documentElement.lang='en';
   mount.innerHTML=TEACHY.tabletMenu(t);
   update();
  }
  /* Only the Back pill and the pressed state change; the artwork is never re-rendered. */
  function update(){
   const back=mount.querySelector('.tcm-back');
   if(back)back.hidden=state.mode==='landing';
   mount.querySelector('.tcm-hit--information')?.setAttribute('aria-pressed',String(state.mode==='info'));
   mount.querySelector('.tcm-hit--video')?.setAttribute('aria-pressed',String(state.mode==='video'));
  }
  function show(mode){
   state.mode=mode;update();void publish();
  }
  mount.addEventListener('click',event=>{
   const button=event.target.closest('button');if(!button||button.disabled)return;
   const action=button.dataset.action;
   if(action==='information')return show('info');
   if(action==='video')return show('video');
   if(action==='back'){
    show('landing');
    mount.querySelector('.tcm-hit--information')?.focus({preventScroll:true});
    return;
   }
   if(action==='home')return void goHome();
  });
  try{
   const remote=await sync.read();
   if(remote?.projectId==='08'&&remote.view!=='home'&&['info','video'].includes(remote.mode))state.mode=remote.mode;
  }catch{}
  render();void publish();
 }
};
