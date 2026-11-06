/* Real bilingual components for the tablet controller and non-interactive TV. */
(function(){
 const base=new URL('.',document.currentScript.src);
 const assets=name=>new URL('assets/'+name,base).href;
 const scripts=window.PROFE_GABI_CONVERSATIONS;
 const words={
 es:{station:'ESTACIÓN',home:'Inicio',menu:'Menú principal',fullscreen:'Pantalla completa',back:'Volver',info:'Información',game:'Minijuego',subtitle:'IA de apoyo para docentes',description:'Asistente que apoya a docentes principiantes en sus retos cotidianos.',infoHelp:'Descubre el desafío, cómo funciona Profe Gabi y la evidencia del piloto.',gameHelp:'Vive un caso basado en conversaciones reales, con una decisión de seguimiento.',enrolled:'docentes inscritos',pilot:'Piloto en Chile · 2024',locked:'Información y Minijuego están disponibles desde el inicio.',watch:'La infografía está en la pantalla principal. Puedes comenzar el minijuego cuando quieras.',ready:'Todo listo para conversar con Profe Gabi.',start:'Comenzar minijuego',invite:'Descubre una nueva forma de acompañar a quienes enseñan.',inviteAction:'Elige Información o Minijuego en la tableta para comenzar.',tag:'Casos reales · Adaptación para exhibición',topicTitle:'¿Qué necesitas hoy, profe?',topicBody:'Elige una situación de los tres ámbitos de apoyo: práctica pedagógica, desarrollo profesional y bienestar.',situationTitle:'¿Qué situación quieres resolver?',followTitle:'¿En qué te gustaría enfocarte ahora?',followBody:'Elige cómo continuar. Tu elección se convertirá en un mensaje en la pantalla principal.',busyTitle:'Tu conversación está en marcha',busyBody:'Observa la pantalla principal. Las opciones se habilitarán cuando termine la respuesta.',writing:'Escribiendo tu mensaje…',thinking:'Profe Gabi está pensando…',wait:'Preparando la siguiente elección…',skip:'Omitir animación',restart:'Reiniciar',again:'Volver a jugar',other:'Elegir otra situación',complete:'¡Conversación completada!',learned:'Lo que aprendiste con Profe Gabi',lessons:['Dar contexto mejora la orientación recibida.','La IA propone ideas, pero el docente decide.','Profe Gabi complementa el acompañamiento humano.'],you:'TÚ',greeting:'¡Hola! Soy Profe Gabi. ¿En qué te gustaría recibir orientación hoy?',topicPrefix:'Quisiera orientación sobre ',reminder:'Recuerda: estas ideas son puntos de partida. Tu criterio profesional y el acompañamiento de mentores y colegas siguen siendo esenciales.',chatPlaceholder:'Tus elecciones se convierten en mensajes…',simulated:'Asistente virtual · Conversación simulada',disclaimer:'Adaptación de casos reales anonimizados. Profe Gabi puede equivocarse; el docente decide.',controlHint:'Tú eliges en la tableta. La conversación cobra vida en la pantalla principal.',connected:'Conectado',connecting:'Conectando…',offline:'Sin conexión · Reintentando…',reconnected:'Conexión recuperada',retry:'Reintentar',what:'¿Qué es?',why:'¿Por qué importa?',how:'Cómo funciona',areas:'Áreas de apoyo',whatBody:'Un asistente de IA por WhatsApp que proporciona orientación práctica a docentes principiantes en Chile.',whyBody:'Al comenzar, los docentes enfrentan retos de planificación, aprendizaje, participación del alumnado, manejo del aula, organización del tiempo y bienestar.',flow:['Docente hace una pregunta','IA consulta recursos educativos','Profe Gabi entrega orientación por chat'],rag:'La recuperación de información (RAG) permite consultar una base de más de 200 documentos educativos del Ministerio de Educación de Chile para orientar la respuesta.',areaNames:['Práctica pedagógica','Desarrollo profesional','Bienestar docente'],metrics:['docentes inscritos voluntariamente','semanas de piloto','documentos educativos','satisfechos o muy satisfechos'],qualifier:'85,3 % entre las 136 personas que respondieron la encuesta; no representa a todos los inscritos ni demuestra impacto causal.',note:'Profe Gabi complementa el acompañamiento de mentores y colegas. No reemplaza el criterio profesional docente.',infoTitle:'Cómo una IA acompaña a docentes principiantes',selectedTopic:'Situación elegida',noFullscreen:'Pantalla completa no disponible en este navegador.'},
 en:{station:'STATION',home:'Home',menu:'Main menu',fullscreen:'Fullscreen',back:'Back',info:'Information',game:'Mini-game',subtitle:'AI support for teachers',description:'An AI assistant that supports beginning teachers in their day-to-day challenges.',infoHelp:'Discover the challenge, how Profe Gabi works, and the project’s pilot evidence.',gameHelp:'Experience a case based on real conversations, with one follow-up decision.',enrolled:'teachers enrolled',pilot:'Pilot in Chile · 2024',locked:'Information and Mini-game are available from the start.',watch:'The infographic is on the main display. You can start the mini-game whenever you like.',ready:'Ready to talk with Profe Gabi.',start:'Start mini-game',invite:'Discover a new way to support those who teach.',inviteAction:'Select Information or Mini-game on the tablet to begin.',tag:'Real cases · Exhibition adaptation',topicTitle:'What do you need today, teacher?',topicBody:'Choose a situation across three support areas: teaching practice, professional development and wellbeing.',situationTitle:'Which situation would you like to address?',followTitle:'What would you like to focus on now?',followBody:'Choose how to continue. Your choice will become a message on the main display.',busyTitle:'Your conversation is underway',busyBody:'Watch the main display. Choices will become available when the response is complete.',writing:'Writing your message…',thinking:'Profe Gabi is thinking…',wait:'Preparing the next choice…',skip:'Skip animation',restart:'Restart',again:'Play again',other:'Choose another situation',complete:'Conversation completed!',learned:'What you learned with Profe Gabi',lessons:['Giving context improves the guidance you receive.','AI proposes ideas; the teacher decides.','Profe Gabi complements human support.'],you:'YOU',greeting:'Hi! I’m Profe Gabi. What would you like guidance on today?',topicPrefix:'I would like guidance on ',reminder:'Remember: these ideas are starting points. Your professional judgment and support from mentors and colleagues remain essential.',chatPlaceholder:'Your choices become messages…',simulated:'Virtual assistant · Simulated conversation',disclaimer:'English translation of adapted, anonymised real cases. Profe Gabi can make mistakes; the teacher decides.',controlHint:'You choose on the tablet. The conversation comes to life on the main display.',connected:'Connected',connecting:'Connecting…',offline:'Offline · Reconnecting…',reconnected:'Connection restored',retry:'Retry',what:'What is it?',why:'Why does it matter?',how:'How it works',areas:'Support areas',whatBody:'A WhatsApp-based AI assistant providing practical guidance to beginning teachers in Chile.',whyBody:'Beginning teachers face challenges with planning, learning, student participation, classroom management, time organisation and wellbeing.',flow:['Teacher asks a question','AI consults education resources','Profe Gabi offers guidance by chat'],rag:'Information retrieval (RAG) allows the tool to consult a knowledge base of more than 200 education documents from Chile’s Ministry of Education to guide its response.',areaNames:['Teaching practice','Professional development','Teacher wellbeing'],metrics:['teachers enrolled voluntarily','weeks in the pilot','education documents','satisfied or very satisfied'],qualifier:'85.3% among the 136 survey respondents; this does not represent all enrolled teachers or demonstrate causal impact.',note:'Profe Gabi complements support from mentors and colleagues. It does not replace teachers’ professional judgment.',infoTitle:'How an AI assistant supports beginning teachers',selectedTopic:'Selected situation',noFullscreen:'Fullscreen is unavailable in this browser.'}
 };
 const icons={arrow:'<path d="M4 12h16m-7-7 7 7-7 7"/>',back:'<path d="M20 12H4m7-7-7 7 7 7"/>',home:'<path d="m3 11 9-8 9 8M6 9v12h5v-7h3v7h4V9"/>',book:'<path d="M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3zM12 6v15"/>',people:'<circle cx="8" cy="7" r="3"/><circle cx="18" cy="8" r="2"/><path d="M2 21v-4a6 6 0 0 1 12 0v4m2-8a5 5 0 0 1 6 5v3"/>',heart:'<path d="M12 21 3 12C-3 4 8-1 12 6c4-7 15-2 9 6z"/>',bot:'<rect x="3" y="5" width="18" height="14" rx="5"/><path d="m12 2 1 3M7 11h1m8 0h1m-9 3q4 4 8 0"/>',question:'<path d="M8 8a4 4 0 0 1 8 0c0 3-4 3-4 6m0 3v1"/><path d="M4 3h16v16H9l-5 3z"/>',check:'<path d="m5 12 5 5 9-11"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v7l4 2"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6m10-6v6M3 11h18"/>',shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6zM8 12l3 3 5-6"/>',expand:'<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>',reset:'<path d="M4 6v6h6M4 12a8 8 0 1 0 2-6"/>',send:'<path d="m3 3 19 9-19 9 4-9-4-9zm4 9h15"/>',document:'<path d="M6 2h9l4 4v16H6zM14 2v5h5M9 11h7m-7 4h7m-7 4h5"/>'};
 const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.bot}</svg>`;
 const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const avatar=()=>`<img class="gabi-official-avatar" src="${assets('avatar-profegabi.png')}" alt="Profe Gabi">`;
 const now=()=>window.AI_SYNC?.now?.()||Date.now();
 function exchange(game,language,turn=game.turn){
  const t=words[language],topic=scripts[language][game.topic],branch=topic?.options[game.situation],follow=branch?.follow[game.follow];
  if(turn==='situation')return {user:branch.user,gabi:branch.gabi};
  return {user:follow.user,gabi:follow.gabi};
 }
 function timing(text,response){
  let elapsed=0;const marks=[];
  for(const char of text){elapsed+=/[.!?]/.test(char)?220:/[,;:]/.test(char)?145:55;marks.push(elapsed);}
  const sendAt=elapsed+480,thinking=Math.min(3000,Math.max(1700,900+response.length*8));
  return {marks,sendAt,total:sendAt+thinking};
 }
 function animation(state){
  const g=state.game,language=state.language==='es'?'es':'en';
  if(g?.phase!=='animating')return null;
  const pair=exchange(g,language),times=timing(pair.user,pair.gabi),elapsed=Math.max(0,now()-g.startedAt);
  const count=times.marks.filter(mark=>mark<=elapsed).length;
  return {...pair,...times,elapsed,draft:pair.user.slice(0,count),sent:elapsed>=times.sendAt,done:elapsed>=times.total};
 }
 function transcript(game,language){
  const result=[];
  const rank=game.phase==='topics'?0:game.phase==='follow'?1:game.phase==='complete'?2:['situation','follow'].indexOf(game.turn);
  for(const turn of ['situation','follow'].slice(0,rank)){
   const pair=exchange(game,language,turn);result.push({role:'user',text:pair.user},{role:'gabi',text:pair.gabi});
  }
  return result;
 }
 const pending=new WeakMap();let connection='connecting';
 function connectionLabel(language){return words[language][connection==='offline'?'offline':connection==='connected'?'connected':'connecting'];}
 function paintConnection(){document.querySelectorAll('[data-gabi-connection]').forEach(el=>{el.dataset.status=connection;el.textContent=connectionLabel(document.documentElement.lang==='en'?'en':'es');});}
 window.addEventListener('ai-sync-connection',event=>{if(event.detail.station!==window.AI_SYNC?.station)return;connection=event.detail.connected?'connected':'offline';paintConnection();});
 // Only the photographic portions of the supplied artwork are framed here.
 function photo(kind='hero'){
  const view=kind==='card'?'430 520 260 210':'660 100 555 410';
  return `<svg class="gabi-photo" viewBox="${view}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="${assets('references/reference-01.jpg')}" width="1600" height="900"/></svg>`;
 }
 function renderInto(mount,state,{readonly=false}={}){
  if(pending.has(mount))cancelAnimationFrame(pending.get(mount));
  window.PROFE_GABI_ARTWORK?.dispose(mount);
  const language=state.language==='es'?'es':'en',t=words[language];
  const g=window.PROFE_GABI_STATE.sanitize(state.game)||window.PROFE_GABI_STATE.fresh();
  state={...state,game:g};document.documentElement.lang=language;
  const isGame=state.mode==='game'||state.mode==='results',isInfo=['info','cta'].includes(state.mode),busy=isGame&&g.phase==='animating';
  const topic=scripts[language][g.topic],branch=topic?.options[g.situation];
  const btn=(action,label,cls='',extra='')=>`<button type="button" class="gabi-button ${cls}" data-action="${action}" ${extra}>${label}</button>`;
  const langControl=`<div class="gabi-language" aria-label="${language==='es'?'Idioma':'Language'}">${['es','en'].map(l=>readonly?`<span class="${l===language?'is-active':''}">${l.toUpperCase()}</span>`:`<button type="button" data-language="${l}" aria-label="${l==='es'?'Español':'English'}" aria-pressed="${language===l}">${l.toUpperCase()}</button>`).join('')}</div>`;
  const header=`<header class="gabi-header"><div class="gabi-brand"><img src="${new URL('../../assets/brand/idb-group.jpg',base).href}" alt="IDB Group"><span></span><div><strong>AI in Action</strong><small>IDB Group Projects Across The Region</small></div></div><div class="gabi-header-tools"><span class="gabi-station">${t.station} ${String(window.AI_SYNC?.station||5).padStart(2,'0')} · PROFE GABI</span>${langControl}${readonly?'':btn('fullscreen',icon('expand'),'gabi-icon',`aria-label="${t.fullscreen}" title="${t.fullscreen}"`)}</div></header>`;
  const kicker=`<p class="gabi-eyebrow">05 / AI in Action</p>`;
  let content='';
  function info(){return `<section class="gabi-info-heading"><div class="gabi-info-photo">${photo()}</div>${kicker}<h1>Profe <em>Gabi</em></h1><p>${t.infoTitle}</p></section><section class="gabi-infographic" aria-label="${t.info}"><div class="gabi-info-intro"><article class="gabi-sheet"><div class="gabi-sheet-icon">${icon('bot')}</div><div><h2>${t.what}</h2><p>${t.whatBody}</p></div></article><article class="gabi-sheet"><div class="gabi-sheet-icon">${icon('people')}</div><div><h2>${t.why}</h2><p>${t.whyBody}</p></div></article></div><article class="gabi-sheet gabi-how"><h2>${icon('bot')}${t.how}</h2><div class="gabi-flow">${t.flow.map((step,i)=>`<div>${icon(['question','book','bot'][i])}<span>${step}</span></div>${i<2?`<span class="gabi-flow-arrow">${icon('arrow')}</span>`:''}`).join('')}</div><p class="gabi-rag">${t.rag}</p></article><article class="gabi-sheet gabi-areas"><h2>${t.areas}</h2>${t.areaNames.map((area,i)=>`<div>${icon(['book','people','heart'][i])}<strong>${area}</strong></div>`).join('')}</article><article class="gabi-sheet gabi-pilot"><h2>${icon('calendar')}${t.pilot}</h2><div class="gabi-metrics">${['550','8','200+',language==='es'?'85,3 %':'85.3%'].map((value,i)=>`<div>${icon(['people','calendar','document','check'][i])}<strong>${value}</strong><span>${t.metrics[i]}</span></div>`).join('')}</div><p class="gabi-qualifier">${t.qualifier}</p></article><article class="gabi-sheet gabi-note">${icon('shield')}<p>${t.note}</p></article></section>`;}
  function landing(){
   if(readonly)return `<section class="gabi-tv-invite"><div>${kicker}<h1>Profe <em>Gabi</em></h1><h2>${t.subtitle}</h2><p>${t.invite}</p><div class="gabi-invite-cta">${icon('question')}<span>${t.inviteAction}</span></div></div><div class="gabi-invite-photo">${photo()}<div class="gabi-photo-stat"><strong>550</strong><span>${t.enrolled}<small>${t.pilot}</small></span></div></div></section>`;
   return `<section class="gabi-hero"><div class="gabi-hero-copy">${kicker}<h1>Profe <em>Gabi</em></h1><h2>${t.subtitle}</h2><p>${t.description}</p></div><div class="gabi-hero-photo">${photo()}<div class="gabi-photo-stat"><strong>550</strong><span>${t.enrolled}<small>${t.pilot}</small></span></div></div></section><section class="gabi-options">${btn('information',`<div class="gabi-option-copy"><span>01</span><h2>${t.info}</h2><p>${t.infoHelp}</p></div><div class="gabi-option-image">${photo('card')}</div><span class="gabi-round-arrow">${icon('arrow')}</span>`,'gabi-option '+(isInfo?'is-selected':''))}${btn('game',`<div class="gabi-option-copy"><span>02</span><h2>${t.game}</h2><p>${t.gameHelp}</p></div><div class="gabi-mini-phone" aria-hidden="true"><div>${avatar()}<b>Profe Gabi</b></div><span>${avatar()}</span><i></i><i></i></div><span class="gabi-round-arrow">${icon('arrow')}</span>`,'gabi-option gabi-option-game',g.ready?'':'disabled aria-disabled="true"')}</section><section class="gabi-info-controls" aria-live="polite"><p>${isInfo?(g.ready?t.ready:t.watch):g.ready?'':t.locked}</p><div>${isInfo?btn('menu',t.menu,'gabi-quiet'):''}${isInfo&&g.ready?btn('game',t.start+icon('arrow'),'gabi-primary'):''}</div></section>`;
  }
  function choices(){
   const choosing=g.phase==='topics',selected=busy&&g.turn==='situation';
   const cases=choosing||selected;
   const title=busy?t.busyTitle:choosing?t.topicTitle:t.followTitle;
   const description=busy?t.busyBody:choosing?t.topicBody:t.followBody;
   const kind=cases?'topic':'follow';
   const options=cases?scripts[language].map(c=>({title:c.title,description:c.sub,icon:c.icon})):branch.follow.map(f=>({title:f.label}));
   return `<section class="gabi-controller-panel"><div class="gabi-step-label">${icon(busy?'clock':'question')}<span>${busy?t.wait:t.controlHint}</span></div><h1>${title}</h1><p class="gabi-panel-description">${description}</p><div class="gabi-choices ${cases?'is-cases':''}">${options.map((o,i)=>`<button type="button" class="gabi-choice ${busy&&g[kind]===i?'is-selected':''}" data-${kind}="${i}" ${busy?'disabled':''}><span class="gabi-choice-icon">${o.icon?icon(o.icon):'0'+(i+1)}</span><span><strong>${escape(o.title)}</strong>${o.description?`<small>${escape(o.description)}</small>`:''}</span>${icon('arrow')}</button>`).join('')}</div>${busy?`<div class="gabi-busy-status" data-animation-status>${t.writing}</div>${btn('skip',t.skip,'gabi-primary')}`:''}<div class="gabi-game-tools">${btn('back',icon('back')+t.back,'gabi-quiet')}${btn('menu',t.menu,'gabi-quiet')}</div></section>`;
  }
  function summary(){
   const selected=branch?.follow[g.follow];
   return `<section class="gabi-summary"><div class="gabi-completed-icon">${icon('check')}</div><p class="gabi-eyebrow">${t.learned}</p><h1>${t.complete}</h1>${selected?`<p class="gabi-takeaway">${escape(selected.take)}</p>`:''}<p class="gabi-summary-note">${t.note}</p>${readonly?'':`<div class="gabi-end-actions">${btn('restart',icon('reset')+t.again,'gabi-primary')}${btn('menu',t.menu,'gabi-quiet')}</div>`}</section>`;
  }
  function chat(){
   const bubble=(role,text,extra='')=>`<article class="gabi-message gabi-message-${role}" ${extra}><small>${role==='user'?t.you:'PROFE GABI'}</small><p>${escape(text)}</p>${role==='user'?'<span class="gabi-read" aria-hidden="true">✓✓</span>':''}</article>`;
   const a=animation(state);
   return `<section class="gabi-chat" aria-label="${t.simulated}"><header class="gabi-chat-header"><div class="gabi-avatar">${avatar()}</div><div><strong>Profe Gabi</strong><span>${t.simulated}</span></div><span class="gabi-chat-script">${t.tag}</span></header><div class="gabi-messages" role="log" aria-live="polite" aria-relevant="additions">${transcript(g,language).map(m=>bubble(m.role,m.text)).join('')}${a?bubble('user',a.user,'data-live-user hidden')+`<div class="gabi-thinking" data-thinking hidden><span>${t.thinking}</span><i></i><i></i><i></i></div>`+bubble('gabi',a.gabi,'data-live-gabi hidden'):''}</div><div class="gabi-compose" ${a?'data-animate':''}><span class="gabi-compose-plus" aria-hidden="true">＋</span><div class="gabi-compose-input"><span data-draft>${a?'':t.chatPlaceholder}</span><i class="gabi-cursor" hidden></i></div><span class="gabi-compose-send">${icon('send')}</span></div><p class="gabi-chat-disclaimer">${t.disclaimer}${topic?`<span class="gabi-source">${escape(topic.source)}</span>`:''}</p></section>`;
  }
  if(isGame){
   if(readonly&&g.phase==='topics')content=`<section class="gabi-game-welcome"><div class="gabi-welcome-bot">${avatar()}</div>${kicker}<h1>${t.topicTitle}</h1><p>${t.topicBody}</p><div class="gabi-topic-preview">${scripts[language].map(topic=>`<div>${icon(topic.icon)}<span><strong>${escape(topic.title)}</strong><small>${escape(topic.sub)}</small></span></div>`).join('')}</div><p class="gabi-tv-guidance">${t.controlHint}</p></section>`;
   else if(readonly)content=`<section class="gabi-display-conversation ${g.phase==='complete'?'is-complete':''}">${g.phase==='complete'?summary():`<div class="gabi-chat-intro">${kicker}<h1>${t.game}<em> · Profe Gabi</em></h1><p>${t.selectedTopic}: <strong>${escape(topic.title)}</strong></p></div>`}${chat()}</section>`;
   else content=`<section class="gabi-tablet-game">${g.phase==='complete'?summary():choices()}<aside class="gabi-tablet-context"><div class="gabi-context-symbol">${g.phase==='complete'?icon('check'):avatar()}</div><p class="gabi-eyebrow">${topic?t.selectedTopic:'PROFE GABI'}</p><h2>${topic?escape(topic.title):t.subtitle}</h2><p>${g.phase==='complete'?t.note:t.controlHint}</p><div class="gabi-journey"><span class="is-done">01</span><i></i><span class="${['follow','complete'].includes(g.phase)||g.turn==='follow'?'is-done':''}">02</span><i></i><span class="${g.phase==='complete'?'is-done':''}">03</span></div><p class="gabi-script-note">${t.tag}</p></aside></section>`;
  }else content=readonly&&isInfo?info():landing();
  const phaseLabel=isGame?(g.phase==='complete'?t.complete:topic?.title||t.game):isInfo?t.info:t.menu;
  const footer=`<footer class="gabi-footer"><div class="gabi-breadcrumb">${readonly?`<span>AI in Action</span>`:btn('home',icon('home')+t.home,'gabi-footer-home')}<span>/</span><span>Profe Gabi</span><span>/</span><span>${escape(phaseLabel)}</span></div><div class="gabi-footer-right"><span class="gabi-connection" data-gabi-connection data-status="${connection}" role="status">${connectionLabel(language)}</span>${readonly?'':btn('back',icon('back'),'gabi-icon',`aria-label="${t.back}" title="${t.back}"`)}</div></footer>`;
  const branded=window.PROFE_GABI_ARTWORK?.render({mount,state,readonly,api:{assets,escape,icon,avatar,chat,header,footer,content,words:t,scripts,connectionLabel,animation}});
  if(!branded)mount.innerHTML=`<main class="gabi-app ${readonly?'gabi-display':'gabi-tablet'} ${isGame?'gabi-game-view':''} ${readonly&&isInfo?'gabi-info-view':''}">${header}<div class="gabi-content">${content}</div>${footer}<p class="gabi-announcement" data-status role="status"></p></main>`;
  if(isGame){const messages=mount.querySelector('.gabi-messages');if(messages)messages.scrollTop=messages.scrollHeight;}
  if(busy){
   let previousStage='';
   const frame=()=>{
    const compose=mount.querySelector('[data-animate]');if(!compose?.isConnected)return;
    window.PROFE_GABI_ARTWORK?.paint(mount,state,{animation,assets});
    const a=animation(state),draft=compose.querySelector('[data-draft]');
    draft.textContent=a.sent?t.chatPlaceholder:a.draft;
    compose.querySelector('.gabi-cursor').hidden=a.sent;
    const input=compose.querySelector('.gabi-compose-input');input.scrollLeft=input.scrollWidth;
    mount.querySelector('[data-live-user]').hidden=!a.sent;
    mount.querySelector('[data-thinking]').hidden=!a.sent||a.done;
    mount.querySelector('[data-live-gabi]').hidden=!a.done;
    const status=mount.querySelector('[data-animation-status]');
    if(status)status.textContent=a.done?t.wait:a.sent?t.thinking:t.writing;
    const stage=a.done?'done':a.sent?'thinking':'writing';
    if(stage!==previousStage){const messages=mount.querySelector('.gabi-messages');if(messages)messages.scrollTop=messages.scrollHeight;previousStage=stage;}
    if(!a.done)pending.set(mount,requestAnimationFrame(frame));
   };
   // Tablet has no chat; update its progress text from the same timeline.
   if(readonly)frame();
   else{
    const tick=()=>{window.PROFE_GABI_ARTWORK?.paint(mount,state,{animation,assets});const status=mount.querySelector('[data-animation-status]');if(!status)return;const a=animation(state);status.textContent=a.done?t.wait:a.sent?t.thinking:t.writing;if(!a.done)pending.set(mount,requestAnimationFrame(tick));};tick();
   }
  }
 }
 window.PROFE_GABI={renderInto,animation,timing,transcript,exchange,words,icon,now};
})();
