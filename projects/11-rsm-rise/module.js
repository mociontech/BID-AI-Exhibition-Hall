/* Station 11: the supplied main-menu PNG (14 Nov 2026) with touch controls.
   "About the project" shows the animated infographic on the TV; "Interactive experience" opens the
   supplied v36 on both devices. The first Back of the experience returns to this menu. */
window.ProjectModule={id:'11',async mountController({sync,mount}){
 const api=window.RSM_RISE;
 let mode='landing',language='en',game=null,disconnect=null,leaving=false,failed=false,retry=null;
 const t={
  info:'About the project: show the infographic on the TV',
  interactive:'Interactive experience: start RISE on the tablet and the TV',
  home:'Home: back to all projects',
  back:'Back: show the main menu on the TV'
 };
 function publish(){
  const packet=mode==='game'
   ?{view:'game',projectId:'11',section:game.sc,language,mode:game.sc==='loop'?'results':'game',screenIndex:RISE_STATE.stages.indexOf(game.sc)+1,game}
   :{view:'project',projectId:'11',section:mode==='info'?'info':null,language:'en',mode,screenIndex:null,game:null};
  return Promise.resolve(sync.send(packet)).then(response=>{failed=!response?.ok;return response;},()=>{failed=true;});
 }
 async function home(){
  if(leaving)return;leaving=true;clearInterval(retry);disconnect?.();
  await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});
  location.assign('../../index.html'+sync.stationQuery+'&projects=1');
 }
 /* Menu: only the Back pill and the pressed state change; the artwork is never re-rendered. */
 function update(){
  const back=mount.querySelector('.rsm-back');
  if(back)back.hidden=mode!=='info';
  mount.querySelector('.rsm-hit--information')?.setAttribute('aria-pressed',String(mode==='info'));
 }
 function openMenu(next){
  if(leaving)return;
  disconnect?.();disconnect=null;game=null;language='en';mode=next;
  document.documentElement.lang='en';
  mount.innerHTML=api.tabletMenu(t);
  update();void publish();
 }
 function openGame(restored,restoredLanguage){
  if(leaving)return;
  mode='game';game=restored||{...RISE_STATE.fresh(),sceneStartedAt:sync.now()};language=restoredLanguage||'en';
  document.documentElement.lang=language;
  mount.innerHTML=`<main class="rise-v34-controller">${RISE_GAME.tabletHTML()}</main>`;
  disconnect=RISE_GAME.connectController(mount,{game,language,onHome:home,onMenu:()=>openMenu('landing'),onChange:(next,nextLanguage)=>{
   if(leaving||mode!=='game')return;
   game=next;language=nextLanguage;document.documentElement.lang=language;void publish();
  }});
  void publish();
 }
 mount.addEventListener('click',event=>{
  const button=event.target.closest('button[data-action]');if(!button||leaving||mode==='game')return;
  const action=button.dataset.action;
  if(action==='information'){mode='info';update();void publish();return;}
  if(action==='back'){
   mode='landing';update();void publish();
   mount.querySelector('.rsm-hit--information')?.focus({preventScroll:true});
   return;
  }
  if(action==='interactive')return openGame();
  if(action==='home')return void home();
 });
 let remote=null;
 try{remote=await sync.read();}catch{}
 const current=remote?.projectId==='11'&&remote.view!=='home';
 const restored=current&&['game','results'].includes(remote.mode)?RISE_STATE.sanitize(remote.game):null;
 if(restored)openGame(restored,remote.language==='es'?'es':'en');
 else openMenu(current&&api.normalizeMode(remote)==='info'?'info':'landing');
 // If the TV could not be reached, keep resending the current screen until it is.
 retry=setInterval(()=>{if(failed&&!leaving)void publish();},2000);
 window.addEventListener('pagehide',()=>{leaving=true;clearInterval(retry);disconnect?.();},{once:true});
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}};
