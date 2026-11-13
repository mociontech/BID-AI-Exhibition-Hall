/* Approved client copy and insight revision. The archived v34 stays unchanged. */
(function(){
 Object.assign(ES,{
  'You are entering a simplified':'Estás por entrar a una experiencia',
  'simulated experience.':'simplificada y simulada.',
  'Illustrative workflows':'Flujos ilustrativos',
  'They do not reflect actual operational processes.':'No reflejan procesos operativos reales.',
  'Clients, deals and data are fictional.':'Los clientes, las operaciones y los datos son ficticios.',
  'Simplified simulation':'Simulación simplificada',
  'Illustrative workflows, not actual operational processes.':'Flujos ilustrativos, no procesos operativos reales.',
  'Historical insight':'Insight histórico',
  'Historical':'Insight',
  'insight':'histórico',
  'Use historical information to inform your analysis.':'Considera la información histórica en tu análisis.',
  'Based on historical information, RISE highlights points to consider in your analysis.':'Con base en la información histórica, RISE destaca puntos para considerar en tu análisis.',
  'No decision is required.':'No es necesario tomar una decisión.',
  'For consideration in your analysis.':'Para considerar en tu análisis.',
  'Review the historical insight on the tablet':'Consulta el insight histórico en la tableta',
  'Your simulated review':'Tu revisión simulada',
  'Your analysis and historical insight are on the screen.':'Tu análisis y el insight histórico están en la pantalla.'
 });
 const title='You are entering a simplified <em>simulated experience.</em>';
 const baseTabView=tabView,baseRender=render,basePill=pillTxt,baseNotify=notify;
 foot=function(){return '<div class="foot rise-client-foot"><span><b>Simplified simulation</b><span aria-hidden="true"> · </span><span>Illustrative workflows, not actual operational processes.</span> <span>Clients, deals and data are fictional.</span></span></div>';};
 pillTxt=function(){return S.sc==='sup'?(S.t<1?'':'Review the historical insight on the tablet'):basePill();};
 tabView=function(){
  if(S.sc==='intro'&&RISE_INTRO.startedAt)return baseTabView();
  if(S.sc==='intro')return shell('Welcome',title,'',null,
   '<div class="grow rise-entry-note"><div class="rise-entry-copy"><b>Illustrative workflows</b><p>They do not reflect actual operational processes.</p><p>Clients, deals and data are fictional.</p></div><span class="spill">'+TVS+'Look at the screen</span></div>',
   RISE_INTRO.startedAt?'<button class="tb pri" type="button" data-go="problem">Skip intro '+IC.next+'</button>':'<button class="tb pri rise-start" type="button" data-intro-start="1">Start experience '+IC.next+'</button>');
  if(S.sc==='sup'){
   const ready=S.t>=1,d=D[S.deal];
   return shell('Stage 5 · Supervise','Historical <em>insight</em>','Use historical information to inform your analysis.',['Stage','5/6'],
    ready?'<div class="thint grow rise-insight-card"><div class="ill"><span class="wi">'+IC.mem+'</span><b>Historical insight</b><span>Based on historical information, RISE highlights points to consider in your analysis.</span><p class="rise-lesson">'+d.lesson+'</p><span class="rise-no-decision">No decision is required.</span></div><span class="spill">'+TVS+'Look at the screen</span></div>':
     '<div class="runn grow"><i></i>Reading Year '+Math.min(4,Math.floor(S.t*4))+' report</div>',
    bk('decide')+'<button class="tb pri" type="button" data-go="loop" '+(ready?'':'disabled')+'>See your review '+IC.next+'</button>');
  }
  if(S.sc==='loop')return shell('Stage 6 · Remember','Review <em>complete</em>','Document #8,201 feeds IDB Invest’s institutional memory.',['Stage','6/6'],
   watch('AI reads. Experts decide. Institutional memory created.','Your analysis and historical insight are on the screen.'),
   '<button class="tb pri" type="button" data-reset="1">Start again '+REDO+'</button>');
  return baseTabView();
 };
 notify=function(){
  if(S.sc!=='sup'||S.t<1)return baseNotify();
  const key='history-'+S.deal;if(tkey===key)return;
  tsc='sup';tkey=key;tv.querySelectorAll('.ptoast').forEach(el=>el.remove());
  const el=document.createElement('div');el.className='ptoast sw';el.setAttribute('role','status');
  el.innerHTML='<span class="pi">'+BELL+'</span><div><div class="pl"><span>Historical insight</span><i>now</i></div><div class="pt"><b>'+D[S.deal].lesson+'</b> No decision is required.</div></div>';
  tv.append(el);setTimeout(()=>el.remove(),8300);
 };
 render=function(){
  baseRender();
  tv.classList.toggle('rise-client-intro',S.sc==='intro');
  tv.classList.toggle('rise-intro-running',S.sc==='intro'&&RISE_INTRO.startedAt>0);
  tv.classList.toggle('rise-client-loop',S.sc==='loop');
  tab.classList.toggle('rise-client-intro',S.sc==='intro'&&!RISE_INTRO.startedAt);
  tab.dataset.scene=S.sc;
  if(S.sc==='intro'&&!RISE_INTRO.startedAt){
   const notice=document.createElement('section');notice.className='rise-entry-notice';
   notice.innerHTML='<span class="k">RISE</span><h1>'+title+'</h1><p><b>Illustrative workflows</b><span>They do not reflect actual operational processes.</span><span>Clients, deals and data are fictional.</span></p>';
   tvin.append(notice);
   tv.querySelector('#opnt')?.classList.add('on');const count=tv.querySelector('#opnn');if(count)count.textContent='8,200';
  }
  if(S.sc==='sup'){
   const card=tv.querySelector('.dbig.dsup');
   if(card)card.innerHTML='<div class="dq"><small>Historical insight</small><b>'+D[S.deal].lesson+'</b><p>Based on historical information, RISE highlights points to consider in your analysis.</p></div><p class="dn">No decision is required.</p>';
  }
  if(S.sc==='loop'){
   const label=tv.querySelector('.close2 .k');if(label)label.textContent='Your simulated review';
   const row=tv.querySelector('.sum .srow:last-child');
   if(row)row.innerHTML='<span>Historical insight</span><b>'+D[S.deal].lesson+'<small>For consideration in your analysis.</small></b>';
  }
  i18nApply();
 };
 tab.addEventListener('click',event=>{
  if(!event.target.closest('[data-intro-start]'))return;
  event.preventDefault();event.stopImmediatePropagation();RISE_INTRO.start();
 },true);
 render();
})();
