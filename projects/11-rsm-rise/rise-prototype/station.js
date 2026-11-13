/* Integration hooks. app.js, i18n.js and styles.css remain source-exact. */
(function(){
 const controller=document.documentElement.dataset.device==='tablet';
 let ready=false,applying=false,envelope=RISE_STATE.fresh(),lastSignature='',liveTimer=0,offset=0;
 const originalRender=render,originalSetLang=setLang,originalPoke=poke;
 const now=()=>Date.now()+offset;
 RISE_INTRO.now=now;
 function signature(){return JSON.stringify([S.sc,S.deal,S.run,S.why,S.dec,S.act,I18N_LANG,S.sc==='intro'?RISE_INTRO.startedAt:0]);}
 function publish(){
  if(!controller||!ready||applying)return;
  const sig=signature();if(sig===lastSignature)return;
  const time=Math.round(now());
  if(S.sc!==envelope.sc){clearInterval(liveTimer);envelope.sceneStartedAt=time;}
  if(S.sc==='read'&&S.run===1&&envelope.run!==1)envelope.readStartedAt=time;
  if(S.sc==='sup'&&envelope.sc!=='sup'&&S.t<1)envelope.supStartedAt=time;
  if(S.sc==='intro')envelope={...RISE_STATE.fresh(),unlocked:true,sceneStartedAt:RISE_INTRO.startedAt,infoStartedAt:RISE_INTRO.startedAt};
  envelope={...envelope,...S};lastSignature=sig;
  parent.postMessage({type:'rise:change',game:envelope,language:I18N_LANG},location.origin);
 }
 render=function(){originalRender();i18nApply();publish();};
 setLang=function(language){originalSetLang(language);document.documentElement.lang=language;publish();};
 poke=function(){clearTimeout(idle);if(controller)originalPoke();};
 if(!controller){
  clearTimeout(idle);go=function(){};
  document.addEventListener('keydown',event=>event.preventDefault(),true);
 }
 if(controller)tab.addEventListener('click',event=>{
  if(event.target.closest('[data-home]')){
   event.preventDefault();event.stopImmediatePropagation();
   parent.postMessage({type:'rise:home'},location.origin);
  }
 },true);
 function resume(){
  clearInterval(liveTimer);clearInterval(tm);clearTimeout(tm);
  if(S.sc==='time'&&controller){
   tm=setTimeout(()=>go('sup'),Math.max(0,envelope.sceneStartedAt+7600-now()));return;
  }
  if(!((S.sc==='read'&&S.run===1)||(S.sc==='sup'&&S.t<1)))return;
  liveTimer=setInterval(()=>{
   const next=RISE_STATE.snapshot({...envelope,...S},now());
   S.p=next.p;S.t=next.t;S.run=next.run;render();
   if(S.sc==='read'?S.run===2:S.t>=1)clearInterval(liveTimer);
  },120);
 }
 window.addEventListener('message',event=>{
  if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='rise:state')return;
  const clean=RISE_STATE.sanitize(event.data.game);if(!clean)return;
  const language=event.data.language==='es'?'es':'en';
  offset=Number.isFinite(event.data.now)?event.data.now-Date.now():0;
  const next=RISE_STATE.snapshot(clean,now());
  const openingChanged=next.sc==='intro'&&RISE_INTRO.startedAt!==next.infoStartedAt;
  const unchanged=ready&&!openingChanged&&JSON.stringify([S.sc,S.deal,S.run,S.why,S.dec,S.act])===JSON.stringify([next.sc,next.deal,next.run,next.why,next.dec,next.act]);
  const first=!ready;
  applying=true;ready=true;envelope=clean;
  if(next.sc==='intro')RISE_INTRO.startedAt=next.infoStartedAt;
  if(!unchanged){
   clearInterval(tm);clearTimeout(tm);clearInterval(liveTimer);stopIntro();
   S={sc:next.sc,deal:next.deal,p:next.p,run:next.run,why:next.why,dec:next.dec,t:next.t,act:next.act};
   // Restore a chosen proposal as a selection, preserving .dim opacity. Other
   // scene entries keep the original entrance classes and text rendering.
   // Same-scene updates retain `last`, exactly as the source render does.
   if(first&&next.sc==='deal'&&next.deal!==null)last=next.sc;
   render();resume();
  }
  setLang(language);lastSignature=signature();applying=false;
 });
 window.addEventListener('pagehide',()=>{clearInterval(liveTimer);clearTimeout(idle);clearInterval(tm);stopIntro();});
 parent.postMessage({type:'rise:ready'},location.origin);
})();
