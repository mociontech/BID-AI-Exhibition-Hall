/* Project 02: bilingual exhibit guidance. Does not write game or station state. */
(function(){
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tabletIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/></svg>';
 const facts={
  es:[
   ['12 h','Anticiparse cambia la movilidad','PredictToDo predice la congestión de cada tramo vial de Bogotá con hasta 12 horas de anticipación, en intervalos de 15 minutos.'],
   ['20 TB','Muchas señales, una mirada de ciudad','Analiza más de 20 terabytes de datos de tráfico, clima y eventos, junto con las características de más de 139.000 tramos viales.'],
   ['153 h','El tiempo que cuesta la congestión','Un conductor en Bogotá pierde en promedio 153 horas al año en el tráfico: cerca de seis días completos.'],
   ['3 de cada 4','Una ayuda para prever el tráfico','En 3 de cada 4 casos, la predicción coincide con el tráfico observado o se desvía solo un nivel: por ejemplo, prevé tráfico moderado cuando resulta intenso. Es más precisa para los próximos 30 minutos.'],
   ['Decisiones','La IA informa. Las personas deciden.','PredictToDo ayuda a ver dónde podría formarse un trancón. Con esa información, el equipo de movilidad decide si envía agentes, ajusta los tiempos de los semáforos o prepara un plan de tránsito.'],
   ['Región','Del conocimiento a la acción','El equipo de la Secretaría recibió transferencia de conocimiento para operar la herramienta. El modelo se reentrena con datos recientes y el BID trabaja para publicarlo como código abierto.']
  ],
  en:[
   ['12 h','Anticipation changes mobility','PredictToDo forecasts congestion on every road segment in Bogotá up to 12 hours ahead, in 15-minute intervals.'],
   ['20 TB','Many signals, one citywide view','It analyzes more than 20 terabytes of traffic, weather and event data, together with the characteristics of more than 139,000 road segments.'],
   ['153 h','The time congestion takes away','The average driver in Bogotá loses 153 hours a year in traffic: almost six full days.'],
   ['3 out of 4','A clearer picture of traffic ahead','In 3 out of 4 cases, the forecast matches the actual traffic level or is only one level off: for example, moderate instead of heavy traffic. It is more accurate for the next 30 minutes.'],
   ['Decisions','AI informs. People decide.','PredictToDo shows where traffic could build up. The city’s mobility team uses that information to decide whether to send traffic officers, adjust traffic lights or put a traffic plan in place.'],
   ['Region','From knowledge to action','The Mobility Department’s team received knowledge transfer to operate the tool. The model is retrained with recent data, and the IDB is working to publish it as open source.']
  ]
 };
 const copy={
  es:{about:'Sobre PredictToDo',didYouKnow:'¿Sabías que?',close:'Cerrar',nextFact:'Otro dato',source:'Información del proyecto · BID y Secretaría Distrital de Movilidad de Bogotá',simulation:'Simulación educativa · Los puntajes y efectos del juego son simulados.',infoCta:'Cuando estés listo, pulsa “Experiencia interactiva” en la tableta',station:'ESTACIÓN',onTablet:'EN LA TABLETA',selected:'Tu selección',event:'Evento seleccionado',action:'Acción seleccionada',noAction:'Aún no has elegido una acción',completed:'eventos jugados',score:'Puntaje de esta decisión',total:'Tu puntaje acumulado',free:'Puedes jugar otro evento, repetir o volver al menú cuando quieras.',
   phases:{
    intro:['Tú decides cómo se mueve Bogotá','Explora una situación de tráfico, toma una decisión y descubre por qué puede ayudar a la ciudad.',['Elige un rol para tu turno','Explora el mapa y selecciona un evento','Compara el impacto de tu decisión'],'Pulsa “Siguiente” en la tableta para comenzar'],
    player:['Tu rol, tu mirada de la ciudad','Cada perfil aporta una perspectiva distinta al centro de control. Elige con quién quieres jugar.',['Selecciona uno de los cuatro roles','Escribe tu nombre si quieres','Pulsa “Empezar turno”'],'Elige tu rol y pulsa “Empezar turno” en la tableta'],
    explore:['Explora antes de decidir','Mueve el reloj y observa el mapa. Puedes empezar por cualquiera de los cuatro eventos.',['Mueve la barra “Hora del día”','Toca el evento que quieres explorar','Pulsa “Revisar decisión”'],'Elige un evento y pulsa “Revisar decisión” en la tableta'],
    decision:['¿Cómo responderías a esta situación?','Revisa la pista del evento. Al seleccionar una acción verás una vista previa de su impacto simulado.',['Lee la situación y su pista','Toca una acción y observa los cambios','Confirma con “Aplicar decisión”'],'Elige una acción y pulsa “Aplicar decisión” en la tableta'],
    result:['Una decisión, un aprendizaje','Compara el resultado y descubre qué cambia cuando anticipas la congestión.',['Revisa el puntaje y la explicación','Prueba otra decisión si quieres','Elige otro evento o termina tu turno'],'En la tableta: cambia tu decisión, elige otro evento o termina'],
    final:['Tu turno deja una lección','La información ayuda a anticipar problemas. Las personas deciden cómo responder.',['Revisa tus decisiones','Vuelve a los eventos para seguir explorando','O regresa al menú de PredictToDo'],'Pulsa “Jugar otro evento” o “Menú” en la tableta']
   }},
  en:{about:'About PredictToDo',didYouKnow:'Did you know?',close:'Close',nextFact:'Another fact',source:'Project information · IDB and Bogotá’s Mobility Department',simulation:'Educational simulation · Game scores and effects are simulated.',infoCta:'When you are ready, press “Interactive experience” on the tablet',station:'STATION',onTablet:'ON THE TABLET',selected:'Your selection',event:'Selected event',action:'Selected action',noAction:'You have not selected an action yet',completed:'events played',score:'Score for this decision',total:'Your total score',free:'Play another event, try again or return to the menu whenever you like.',
   phases:{
    intro:['You decide how Bogotá moves','Explore a traffic situation, make a decision and discover how it can help the city.',['Choose a role for your shift','Explore the map and select an event','Compare the impact of your decision'],'Press “Next” on the tablet to begin'],
    player:['Your role, your view of the city','Each profile brings a different perspective to the control center. Choose who you want to play as.',['Select one of the four roles','Enter your name if you like','Press “Start shift”'],'Choose your role and press “Start shift” on the tablet'],
    explore:['Explore before you decide','Move the clock and observe the map. Start with any of the four events.',['Move the “Time of day” slider','Tap the event you want to explore','Press “Review decision”'],'Select an event and press “Review decision” on the tablet'],
    decision:['How would you respond?','Read the event clue. Select an action to preview its simulated impact.',['Read the situation and its clue','Tap an action and observe the changes','Confirm with “Apply decision”'],'Choose an action and press “Apply decision” on the tablet'],
    result:['One decision, one lesson','Compare the result and discover what changes when you anticipate congestion.',['Review the score and explanation','Try another decision if you like','Choose another event or finish your shift'],'On the tablet: change your decision, choose an event or finish'],
    final:['A lesson from your shift','Information helps anticipate problems. People decide how to respond.',['Review your decisions','Return to the events to keep exploring','Or go back to the PredictToDo menu'],'Press “Play another event” or “Menu” on the tablet']
   }}
 };
 const langOf=language=>language==='es'?'es':'en';
 function cta(text){return `<footer class="ptd-tv-cta"><div role="status"><span>${tabletIcon}</span><strong>${esc(text)}</strong><b aria-hidden="true">→</b></div></footer>`;}
 function factCard(language,index=0){const lang=langOf(language),c=copy[lang],f=facts[lang][index%facts[lang].length];return `<article class="ptd-fact"><p class="ptd-guide-kicker">${c.didYouKnow}</p><b class="ptd-fact-number">${esc(f[0])}</b><h2>${esc(f[1])}</h2><p>${esc(f[2])}</p><small>${c.source}</small></article>`;}
 function information({language,image,label}){const lang=langOf(language);return `<main class="ptd-tv-information" lang="${lang}"><div class="ptd-tv-art">${window.AI_ARTWORK(image,`class="ptd-tv-infographic" alt="${esc(label)}"`)}</div>${cta(copy[lang].infoCta)}</main>`;}
 function gameView(options){
  const phase=options.game?.phase||'intro';
  if(window.PREDICTTODO_CONTROL&&['explore','decision','result'].includes(phase))return window.PREDICTTODO_CONTROL.render({...options,readonly:true});
  const html=window.PULSE_VIAL.render({...options,readonly:true});
  return window.PREDICTTODO_CONTROL?window.PREDICTTODO_CONTROL.displayOnly(html):html;
 }
 function attachFacts(root,language){
  const lang=langOf(language),c=copy[lang],page=root.querySelector('.ptd-game');if(!page)return;
  const button=document.createElement('button');button.type='button';button.className='ptd-facts-button';button.title=c.about;button.setAttribute('aria-label',c.about);button.innerHTML=`<span aria-hidden="true">ⓘ</span> <span class="ptd-facts-button-label">${c.about}</span>`;
  const dialog=document.createElement('dialog');dialog.className='ptd-facts-dialog';dialog.setAttribute('aria-label',c.about);
  let index=0;
  function draw(){dialog.innerHTML=`<div class="ptd-facts-dialog-head"><strong>PredictToDo</strong><button type="button" data-fact-close aria-label="${c.close}">×</button></div>${factCard(lang,index)}<footer><span>${index+1} / ${facts[lang].length}</span><button type="button" data-fact-next>${c.nextFact} →</button></footer>`;dialog.querySelector('[data-fact-close]').onclick=()=>dialog.close();dialog.querySelector('[data-fact-next]').onclick=()=>{index=(index+1)%facts[lang].length;draw();dialog.querySelector('[data-fact-next]').focus();};}
  button.onclick=()=>{draw();dialog.showModal();};
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  page.append(button,dialog);
 }
 function renderGameInto(root,options){
  window.PULSE_VIAL.renderInto(root,{...options,readonly:true});
 }
 window.PREDICTTODO_INSIGHTS=Object.freeze({information,gameView,renderGameInto,attachFacts,facts});
})();
