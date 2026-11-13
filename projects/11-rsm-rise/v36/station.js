/* Transport and clock recovery only. Rendering and controls are the v36 source. */
(function(){
 const controller=document.documentElement.dataset.device==='tablet';
 let ready=false,applying=false,envelope=RISE_STATE.fresh(),lastSignature='',recoveryTimer=0,offset=0;
 const baseRender=render,baseUpdIntro=updIntro,baseSetLang=setLang,basePoke=poke;
 const baseTabView=tabView;
 tabView=function(){
  const html=baseTabView(),holder=document.createElement('div');holder.innerHTML=html;
  const footer=holder.querySelector('.tfoot');if(!footer)return html;
  if([...footer.querySelectorAll('button[data-go]')].some(b=>b.textContent.trim()==='Back'))return html;
  const back=document.createElement('button');back.type='button';back.className='tb';
  back.dataset.riseBack=S.sc==='intro'?(S.ip?'notice':'projects'):S.sc==='problem'?'opening':S.sc==='loop'?'sup':'opening';
  back.innerHTML=IC.back+'Back';footer.prepend(back);return holder.innerHTML;
 };
 const now=()=>Date.now()+offset;
 RISE_V36_CLOCK.now=now;
 function fit(){const scale=Math.min(innerWidth/736,innerHeight/552);document.documentElement.style.setProperty('--device-scale',scale===1?'none':`scale(${scale})`);}
 fit();window.addEventListener('resize',fit);
 function signature(){return JSON.stringify([S.sc,S.deal,S.run,S.why,S.dec,S.act,S.ip,S.tp,S.sr,S.t>=1,I18N_LANG]);}
 function publish(){
  if(!controller||!ready||applying)return;
  const sig=signature();if(sig===lastSignature)return;
  const time=Math.round(now()),previous=envelope;
  if(S.sc!==previous.sc)clearInterval(recoveryTimer);
  if(S.sc==='intro'&&S.ip===0)envelope=RISE_STATE.fresh();
  if(S.deal!==previous.deal)envelope={...envelope,readStartedAt:0,timeStartedAt:0,supStartedAt:0};
  if(S.sc!==previous.sc)envelope.sceneStartedAt=time;
  if(S.sc==='intro'&&S.ip===1&&previous.ip!==1)envelope.introStartedAt=time;
  if(S.sc==='read'&&S.run===1&&previous.run!==1)envelope.readStartedAt=time;
  if(S.sc==='time'&&S.tp===1&&previous.tp!==1)envelope.timeStartedAt=time;
  if(S.sc==='sup'&&S.sr===1&&previous.sr!==1)envelope.supStartedAt=time;
  envelope={...envelope,...S};RISE_V36_CLOCK.introStartedAt=envelope.introStartedAt;
  lastSignature=sig;
  parent.postMessage({type:'rise:change',game:envelope,language:I18N_LANG},location.origin);
 }
 render=function(){baseRender();i18nApply();publish();};
 updIntro=function(){baseUpdIntro();i18nApply();publish();};
 setLang=function(language){baseSetLang(language);document.documentElement.lang=language;publish();};
 poke=function(){clearTimeout(idle);if(controller)basePoke();};
 if(!controller){clearTimeout(idle);go=function(){};document.addEventListener('keydown',e=>e.preventDefault(),true);}
 if(controller)tab.addEventListener('click',event=>{
  const back=event.target.closest('[data-rise-back]');
  if(back){
   event.preventDefault();event.stopImmediatePropagation();
   if(back.dataset.riseBack==='projects'){parent.postMessage({type:'rise:home'},location.origin);return;}
   clearInterval(tm);clearInterval(recoveryTimer);stopIntro();
   if(back.dataset.riseBack==='notice'){S.ip=0;envelope.introStartedAt=0;RISE_V36_CLOCK.introStartedAt=0;render();return;}
   if(back.dataset.riseBack==='opening'){S.sc='intro';S.ip=2;render();return;}
   go(back.dataset.riseBack);return;
  }
  if(!event.target.closest('[data-home]'))return;
  event.preventDefault();event.stopImmediatePropagation();parent.postMessage({type:'rise:home'},location.origin);
 },true);
 function recover(){
  clearInterval(recoveryTimer);clearInterval(tm);
  if(S.sc==='time'&&S.tp&&envelope.timeStartedAt){
   const node=tv.querySelector('.tsc');if(node){void node.offsetHeight;const elapsed=Math.max(0,now()-envelope.timeStartedAt);node.getAnimations({subtree:true}).forEach(animation=>{animation.currentTime=elapsed;});}
  }
  if(!((S.sc==='read'&&S.run===1)||(S.sc==='sup'&&S.sr&&S.t<1)))return;
  recoveryTimer=setInterval(()=>{
   const next=RISE_STATE.snapshot({...envelope,...S},now());S.p=next.p;S.run=next.run;S.t=next.t;render();
   if(S.sc==='read'?S.run===2:S.t>=1)clearInterval(recoveryTimer);
  },120);
 }
 window.addEventListener('message',event=>{
  if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='rise:state')return;
  const clean=RISE_STATE.sanitize(event.data.game);if(!clean)return;
  offset=Number.isFinite(event.data.now)?event.data.now-Date.now():0;
  const next=RISE_STATE.snapshot(clean,now()),language=event.data.language==='es'?'es':'en';
  const before=ready?signature():null;
  const stateSig=JSON.stringify([next.sc,next.deal,next.run,next.why,next.dec,next.act,next.ip,next.tp,next.sr,next.t>=1,I18N_LANG]);
  const first=!ready;ready=true;applying=true;envelope=clean;RISE_V36_CLOCK.introStartedAt=clean.introStartedAt;
  if(first||before!==stateSig){
   clearInterval(tm);clearInterval(recoveryTimer);stopIntro();
   S=Object.fromEntries(RISE_STATE.sourceKeys.map(k=>[k,next[k]]));
   if(first&&S.sc==='deal'&&S.deal!==null)last=S.sc;
   render();recover();
  }
  setLang(language);lastSignature=signature();applying=false;
 });
 window.addEventListener('pagehide',()=>{clearInterval(recoveryTimer);clearInterval(tm);clearTimeout(idle);stopIntro();});
 parent.postMessage({type:'rise:ready'},location.origin);
})();
