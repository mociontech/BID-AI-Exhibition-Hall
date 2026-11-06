/* Tablet controller using the shared station lifecycle. */
window.ProjectModule={id:'11',async mountController({sync,mount,brand}){
 const api=window.RSM_RISE;
 let state={language:'en',mode:'landing',game:RISE_STATE.fresh()},timer=null,leaving=false;
 const now=()=>sync.now(),words=()=>api.copy[state.language];
 const packet=()=>({view:['game','results'].includes(state.mode)?'game':'project',projectId:'11',section:state.mode,language:state.language,mode:state.mode,screenIndex:RISE_STATE.stages.indexOf(state.game.sc)+1,game:state.game});
 function publish(){return sync.send(packet());}
 function stop(){clearInterval(timer);timer=null;}
 function update(next){state={...state,...next};render();void publish();arm();}
 function remaining(){return Math.max(0,Math.ceil((state.game.infoStartedAt+10000-now())/1000));}
 function arm(){
  stop();if(state.mode==='info'){tick();if(state.mode==='info')timer=setInterval(tick,200);return;}
  const live=RISE_STATE.snapshot(state.game,now());
  if(['game','results'].includes(state.mode)&&((live.sc==='read'&&live.readStartedAt&&live.p<1)||(live.sc==='sup'&&live.t<1)))timer=setInterval(tick,120);
 }
 function tick(){
  if(leaving)return;
  if(state.mode==='info'){
   if(!remaining()){stop();update({mode:'cta',game:{...state.game,unlocked:true}});return;}
   const counter=mount.querySelector('[data-countdown]');if(counter)counter.textContent=remaining()+' s';
   const progress=mount.querySelector('progress');if(progress)progress.value=10-remaining();return;
  }
  if(!['game','results'].includes(state.mode))return stop();
  const live=RISE_STATE.snapshot(state.game,now());
  mount.querySelector('.rise-body').innerHTML=RISE_GAME.tabletHTML(state.game,state.language,now());
  if(live.sc==='read'?live.p===1:live.t===1)stop();
 }
 function button(action,label,cls='rise-primary',disabled=false){return `<button type="button" class="${cls}" data-action="${action}" ${disabled?'disabled aria-disabled="true"':''}>${label}</button>`;}
 function render(){
  const c=words(),g=state.game,isGame=['game','results'].includes(state.mode);document.documentElement.lang=state.language;
  const header=`<header class="rise-header">${brand.header()}<nav aria-label="Language"><button type="button" data-language="es" aria-pressed="${state.language==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${state.language==='en'}">EN</button>${button('fullscreen','⛶','rise-fullscreen')}</nav></header>`;
  let body='';
  if(!isGame){
   body=`<div class="rise-landing"><section><p class="rise-kicker">11 / RSM RISE</p><h1>RSM <span>RISE</span></h1><p class="rise-subtitle">Risk Intelligence & Strategy Engine</p><h2>${c.headline}</h2><p class="rise-lead">${c.intro}</p></section><div class="rise-keyvisual" aria-hidden="true">${api.network(c)}</div></div><div class="rise-options"><button class="rise-option" type="button" data-action="information"><span>01</span><div><h2>${c.info}</h2><p>${c.infoDesc}</p></div><b>↗</b></button><button class="rise-option" type="button" data-action="game" ${g.unlocked?'':'disabled aria-disabled="true"'}><span>02</span><div><h2>${c.game}</h2><p>${g.unlocked?c.gameDesc:c.locked}</p></div><b>${g.unlocked?'→':'⌁'}</b></button></div><div class="rise-status" role="status">${state.mode==='info'?`<span class="rise-live"></span>${c.playing} · <b data-countdown>${remaining()} s</b><progress max="10" value="${10-remaining()}"></progress>`:g.unlocked?`<span>${c.ready}</span>${button('game',c.explore)}`:`<span>${c.watch}</span>`}</div>`;
  }else body=RISE_GAME.tabletHTML(g,state.language,now());
  mount.innerHTML=`<div class="rise rise-tablet ${isGame?'rise-tablet--game':''}">${header}<div class="rise-body">${body}</div><footer><div class="rise-actions">${button('home',brand.home+c.home,'rise-home')}${isGame?button('menu',c.menu,'rise-secondary'):button('home',c.back,'rise-secondary')}</div><span>${isGame?c.sim:c.tag}</span></footer></div>`;
  mount.querySelector('[data-action="fullscreen"]').setAttribute('aria-label',c.fullscreen);
  mount.querySelectorAll('[data-language]').forEach(b=>b.onclick=()=>update({language:b.dataset.language}));
  mount.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>act(b.dataset.action));
 }
 async function act(action){
  if(leaving)return;
  if(action==='fullscreen'){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}return;}
  if(action==='home'){leaving=true;stop();await sync.send({view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null});location.assign('../../index.html'+sync.stationQuery+'&projects=1');return;}
  if(action==='information'){if(state.mode==='info')return;update({mode:'info',game:{...RISE_STATE.fresh(),infoStartedAt:now()}});}
  if((action==='game'&&state.game.unlocked)||action==='replay'){stop();update({mode:'game',game:{...RISE_STATE.fresh(),unlocked:true}});}
  if(action==='menu'){stop();update({mode:'landing',game:{...RISE_STATE.fresh(),unlocked:state.game.unlocked}});}
 }
 mount.addEventListener('click',event=>{
  const control=event.target.closest('[data-game]');
  if(!control||control.disabled||leaving||!['game','results'].includes(state.mode))return;
  let value=control.dataset.value;
  if(['select','action'].includes(control.dataset.game))value=Number(value);
  const next=RISE_GAME.transition(state.game,control.dataset.game,value,now());
  update({mode:next.sc==='loop'?'results':'game',game:next});
 });

 const remote=await sync.read();
 const restored=remote?.projectId==='11'&&remote.view!=='home'?RISE_STATE.sanitize(remote.game):null;
 if(restored)state={language:remote.language==='es'?'es':'en',mode:['landing','info','cta','game','results'].includes(remote.mode)?remote.mode:'landing',game:restored};
 render();void publish();arm();
 window.addEventListener('pagehide',()=>{leaving=true;stop();},{once:true});
}};
