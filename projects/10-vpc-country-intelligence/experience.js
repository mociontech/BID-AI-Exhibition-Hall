(function(){
 const model=window.COUNTRY_STATE;
 let displayTimer=null;
 const text=(en,es,language)=>language==='es'?es:en;
 function device(app,role,snapshot){
  let frame=app.querySelector('iframe[data-ci-device]');
  if(!frame||frame.dataset.ciDevice!==role){
   app.innerHTML=`<main class="ci-v51-host"><iframe data-ci-device="${role}" title="Country Strategies v51 — ${role==='tablet'?'Tablet controller':'Main display'}" src="/projects/10-vpc-country-intelligence/v51/device.html?role=${role}" ${role==='display'?'tabindex="-1"':''}></iframe></main>`;
   frame=app.querySelector('iframe');
   frame.addEventListener('load',()=>{frame.ciLoaded=true;frame.ciSend();});
  }
  const signature=JSON.stringify(snapshot);if(frame.ciSignature===signature)return;
  frame.ciSignature=signature;frame.ciSnapshot=snapshot;
  frame.ciSend=()=>frame.contentWindow.postMessage({type:'country-v51-init',snapshot:frame.ciSnapshot,now:window.AI_SYNC.now()},location.origin);
  if(frame.ciLoaded&&role==='display')frame.ciSend();
 }
 function view(state,role,now){
  const visual=model.visual(state,now);
  if(state.screen==='info')return infographic(state.language,now-state.lastActive);
  if(state.screen==='menu')return cover(state.language,true);

  const result=window.COUNTRY_PROTOTYPE(visual,role);
  return `<div class="${result.className}">${window.COUNTRY_TRANSLATE(result.html,state.language)}</div>`;
 }
 function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${{home:'<path d="m3 10 9-7 9 7v10H6V10m4 10v-7h4v7"/>',back:'<path d="M20 12H4m7-7-7 7 7 7"/>',expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/>'}[name]}</svg>`;}
 function header(state,display=false){const lang=state.language;if(!display&&state.screen!=='game')return `<header class="ci-shell"><div class="ci-brandline"><img src="/projects/10-vpc-country-intelligence/assets/idb-group.png" alt="IDB Group"><span><b>${text('AI in Action','IA en acción',lang)}</b><small>${text('IDB Group Projects Across the Region','Proyectos del Grupo BID en la región',lang)}</small></span></div><button class="ci-home" data-home>${icon('home')}<span>${text('Home','Inicio',lang)}</span></button></header>`;return `<header class="ci-shell"><div class="ci-brandline"><img src="/projects/10-vpc-country-intelligence/assets/idb-group.png" alt="IDB Group"><span><b>${text('AI in Action','IA en acción',lang)}</b><small>${text('IDB Group Projects Across the Region','Proyectos del Grupo BID en la región',lang)}</small></span></div>${display?`<span class="ci-display-label">${text('Controlled from the tablet','Control desde la tableta',lang)}</span>`:`<div class="ci-header-tools"><div class="ci-languages" role="group" aria-label="${text('Language','Idioma',lang)}"><button data-language="es" aria-pressed="${lang==='es'}">ES</button><button data-language="en" aria-pressed="${lang==='en'}">EN</button></div><button class="ci-expand" data-fullscreen aria-label="${text('Fullscreen','Pantalla completa',lang)}" title="${text('Fullscreen','Pantalla completa',lang)}">${icon('expand')}</button></div>`}</header>`;}
 function navigation(state){if(state.screen!=='game')return '';const lang=state.language,playing=true;return `<footer class="ci-navigation"><button data-home>${icon('home')}<span>${text('Home','Inicio',lang)}</span></button><span class="ci-breadcrumb">AI in Action <span>/</span> Country Intelligence</span><button ${playing?'data-menu':'data-projects'}>${icon('back')}<span>${playing?text('Back to project','Volver al proyecto',lang):text('Back to Projects','Volver a proyectos',lang)}</span></button></footer>`;}
 function finalMessage(lang){return text('AI connects the information. You decide how to transform the country.','La IA conecta la información. Tú decides cómo transformar el país.',lang);}
 const assets='/projects/10-vpc-country-intelligence/assets/';
 function cover(lang,display=false,selected=false){
  return `<section class="ci-cover"><div class="ci-cover-heading"><p class="ci-kicker">VPC · TTD</p><h1>${text('AI-Powered <span>Country Strategies</span>','Estrategias País <span>con IA</span>',lang)}</h1><p>${text('From Country Dialogue to Results','Del diálogo país a los resultados',lang)}</p></div><div class="ci-cover-options">${[
   ['info',text('About<br>the project','Sobre<br>el proyecto',lang),text('Explore the challenge, the solution and its impact.','Explora el desafío, la solución y su impacto.',lang),'country-map.png'],
   ['start',text('Interactive<br>experience','Experiencia<br>interactiva',lang),text('Discover how agentic AI organizes scattered evidence to support informed country decisions','Descubre cómo la IA agéntica organiza evidencia dispersa para apoyar decisiones informadas sobre los países',lang),'network.png']
  ].map(([action,title,copy,img])=>`<${display?'div':'button'} class="ci-cover-card" ${display?'':`data-${action} aria-pressed="${action==='info'&&selected}"`}><span><b>${title}</b><small>${copy}</small></span><img src="${assets+img}" alt=""></${display?'div':'button'}>`).join('')}</div>${display?`<p class="ci-cover-hint">${text('Choose an option on the tablet','Elige una opción en la tableta',lang)}</p>`:''}</section>`;
 }
 function infographic(lang,elapsed=0){
  const metrics=[
   ['8+',text('AI experiments developed<br>in all regions','experimentos de IA desarrollados<br>en todas las regiones',lang)],
   [text('5 weeks to 3 days','De 5 semanas a 3 días',lang),text('to prepare and review<br>portfolio alignment','para preparar y revisar<br>la alineación de la cartera',lang)],
   [text('Weeks to Hours','De semanas a horas',lang),text('to prepare programmatic opportunity areas','para preparar áreas de oportunidad programática',lang)],
   [text('4 days to 6 hours','De 4 días a 6 horas',lang),text('to prepare portfolio<br>review presentation','para preparar la presentación<br>de revisión de cartera',lang)]
  ];
  return `<article class="ci-infographic ci-motion" style="--ci-elapsed:-${Math.max(0,elapsed)}ms" aria-label="${text('AI-Powered Country Strategies infographic','Infografía de Estrategias País con IA',lang)}"><aside class="ci-info-brand"><img src="${assets}idb-group.png" alt="IDB Group"><div><h1>${text('AI-Powered<br>Country<br>Strategies','Estrategias<br>País<br>con IA',lang)}</h1><p>${text('From Country Dialogue<br>to Results','Del diálogo país<br>a los resultados',lang)}</p><small>VPC · TTD</small></div></aside><div class="ci-info-content"><div class="ci-info-panels"><section class="ci-info-challenge"><h2>${text('<em>THE</em> CHALLENGE','<em>EL</em> DESAFÍO',lang)}</h2><img src="${assets}challenge.png" alt=""><p><strong>${text('Fragmented Country Insights','Información país fragmentada',lang)}</strong><br>${text('Country teams must piece together scattered information manually, making it harder to keep strategies current and incorporate portfolio lessons and emerging risks.','Los equipos país deben reunir manualmente información dispersa, lo que dificulta mantener las estrategias actualizadas e incorporar lecciones de la cartera y riesgos emergentes.',lang)}</p></section><section class="ci-info-solution"><h2>${text('<em>THE</em> SOLUTION','<em>LA</em> SOLUCIÓN',lang)}</h2><img src="${assets}solution.png" alt=""><p><strong>${text('AI-powered Country Strategies','Estrategias País con IA',lang)}</strong><br>${text('Uses agentic AI to gather and organize evidence throughout the operational cycle, helping teams make informed decisions and continuously build country knowledge.','Utiliza IA agéntica para reunir y organizar evidencia a lo largo del ciclo operativo, ayudando a los equipos a tomar decisiones informadas y construir continuamente conocimiento país.',lang)}</p></section></div><section class="ci-impact"><h2>${text('IMPACT TO DATE','IMPACTO A LA FECHA',lang)}</h2><div class="ci-impact-grid">${metrics.map(([value,copy],i)=>`<div class="ci-metric ci-metric-${i}"><h3>${value}</h3><p>${copy}</p></div>`).join('')}</div></section></div><div class="ci-blue-wipe" aria-hidden="true"></div></article>`;
 }
 function footer(state){return state.screen==='game'?`<p class="ci-notice">${text('Educational simulation · All figures and choices are illustrative.','Simulación educativa · Todas las cifras y decisiones son ilustrativas.',state.language)}</p>`:'';}
 function display(app,data){
  clearInterval(displayTimer);const state=model.sanitize(data.game);if(!state)return;
  state.language='en';
  if(state.screen==='game'&&state.v51){device(app,'display',state.v51);return;}
  const now=()=>window.AI_SYNC.now();let previous='';
  function paint(){
   const signature=JSON.stringify(model.visual(state,now()).p);
   if(signature===previous)return;previous=signature;document.documentElement.lang=state.language;
   app.innerHTML=`<main class="ci ci-display">${header(state,true)}<section class="ci-screen">${view(state,'display',now())}</section>${state.screen==='game'&&state.sc==='loop'?`<p class="ci-message">${finalMessage(state.language)}</p>`:footer(state)}</main>`;
  }paint();if(state.screen==='game'&&Object.values(state.ph).includes('run'))displayTimer=setInterval(paint,140);
 }
 async function mount({sync,mount,home}){
  const now=()=>sync.now();let state=model.fresh(now()),closed=false;
  const remote=await sync.read(),saved=remote?.projectId==='10'&&model.sanitize(remote.game);if(saved)state=saved;
  state.language='en';if(state.v51)state.v51.language='en';
  if(now()-state.lastActive>=(state.v51&&state.screen==='game'?60000:45000))state=model.fresh(now(),state.language);
  if(state.screen==='game'&&!state.v51)state={...model.fresh(now(),state.language),screen:'game',v51:model.freshV51(now())};
  const homeUrl=home+(home.includes('?')?'&':'?')+'projects=1';
  function send(){return sync.send({view:state.screen==='game'?'game':'project',projectId:'10',section:state.sc,language:state.language,mode:state.screen==='game'?'game':state.screen==='info'?'info':'landing',game:model.sanitize(state)});}
  function menu(){return cover(state.language,false,state.screen==='info');}
  function paint(){
   if(state.screen==='game'&&state.v51){device(mount,'tablet',state.v51);return;}
   const focused=mount.contains(document.activeElement)?document.activeElement:null,identity=focused&&[...focused.attributes].find(a=>a.name.startsWith('data-'));
   document.documentElement.lang=state.language;
   mount.innerHTML=`<main class="ci ci-controller">${header(state)}${state.screen==='game'?`<section class="ci-game">${view(state,'tablet',now())}</section>${state.sc==='loop'?`<div class="ci-end"><p>${finalMessage(state.language)}</p><button data-menu>${text('Return to project menu','Volver al menú del proyecto',state.language)}</button></div>`:''}`:menu()}${footer(state)}${navigation(state)}</main>`;
   if(identity)mount.querySelector(identity.value?`[${identity.name}="${identity.value}"]`:`[${identity.name}]`)?.focus({preventScroll:true});
  }
  function commit(){state.lastActive=now();paint();void send();}
  function start(){state={...model.fresh(now(),state.language),screen:'game',v51:{...model.freshV51(now()),language:state.language}};}
  async function onDevice(event){
   const frame=mount.querySelector('iframe[data-ci-device="tablet"]');
   if(closed||!frame||event.source!==frame.contentWindow||event.origin!==location.origin||event.data?.type!=='country-v51')return;
   const {action,snapshot}=event.data;
   if(action==='home'){closed=true;clearInterval(timer);await sync.send({view:'home',projectId:null,game:null});location.assign(homeUrl);return;}
   if(action==='back'){state=model.fresh(now(),state.language);paint();void send();return;}
   if(action==='state'){
    const clean=model.sanitizeV51(snapshot);if(!clean)return;
    state.v51=clean;state.language=clean.language;state.lastActive=now();void send();
   }else if(action==='activity'){state.lastActive=now();void send();}
  }
  window.addEventListener('message',onDevice);
  mount.addEventListener('click',async event=>{
   const b=event.target.closest('button');if(!b||b.disabled||closed)return;
   if(b.hasAttribute('data-home')||b.hasAttribute('data-projects')){closed=true;clearInterval(timer);await sync.send({view:'home',projectId:null,game:null});location.assign(homeUrl);return;}
   if(b.hasAttribute('data-fullscreen')){if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen().catch(()=>{});state.lastActive=now();void send();return;}
   if(b.dataset.language)state.language=b.dataset.language;
   else if(b.hasAttribute('data-menu'))state.screen='menu';
   else if(b.hasAttribute('data-info')){state.screen='info';state.infoStarted=0;}
   else if(b.hasAttribute('data-start'))start();
   else if(state.screen==='game'){
    const k=Number(state.sc.slice(1));
    if(b.dataset.go){if(state.ph[k]==='run')state.ph[k]='done';state.sc=b.dataset.go;}
    else if(b.dataset.sig!==undefined){const i=Number(b.dataset.sig);if(!state.con.includes(i))state.con.push(i);}
    else if(b.dataset.all)state.con=[0,1,2,3,4,5,6,7];
    else if(b.dataset.run){state.ph[k]='run';state.runs[k]=now();}
    else if(b.dataset.pick!==undefined)state.pk[k]=Number(b.dataset.pick);
    else if(b.dataset.reset)start();
   }commit();
  });
  mount.addEventListener('pointerdown',()=>{state.lastActive=now();});
  let frame='';const timer=setInterval(()=>{
   if(closed||state.screen==='game'&&state.v51)return;let changed=false;
   if(now()-state.lastActive>=45000&&(state.screen!=='menu'||state.infoStarted||state.con.length||state.sc!=='problem')){state=model.fresh(now(),state.language);changed=true;}
   for(let k=0;k<3;k++)if(state.ph[k]==='run'&&now()-state.runs[k]>=5200){state.ph[k]='done';changed=true;}
   const signature=JSON.stringify(model.visual(state,now()).p);
   if(changed){paint();void send();}else if(signature!==frame)paint();frame=signature;
  },140);
  window.addEventListener('pagehide',()=>{closed=true;clearInterval(timer);window.removeEventListener('message',onDevice);},{once:true});paint();await send();
 }
 window.COUNTRY_INTELLIGENCE={mount,renderDisplay:display,stopDisplay(){clearInterval(displayTimer);displayTimer=null;}};
})();
