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
  es:{simulation:'Simulación educativa · Los puntajes y efectos del juego son simulados.',infoCta:'Cuando estés listo, pulsa “Experiencia interactiva” en la tableta',station:'ESTACIÓN',onTablet:'EN LA TABLETA',selected:'Tu selección',event:'Evento seleccionado',action:'Acción seleccionada',noAction:'Aún no has elegido una acción',completed:'eventos jugados',score:'Puntaje de esta decisión',total:'Tu puntaje acumulado',free:'Puedes jugar otro evento, repetir o volver al menú cuando quieras.',
   phases:{
    intro:['Tú decides cómo se mueve Bogotá','Explora una situación de tráfico, toma una decisión y descubre por qué puede ayudar a la ciudad.',['Elige un rol para tu turno','Explora el mapa y selecciona un evento','Compara el impacto de tu decisión'],'Pulsa “Siguiente” en la tableta para comenzar'],
    player:['Tu rol, tu mirada de la ciudad','Cada perfil aporta una perspectiva distinta al centro de control. Elige con quién quieres jugar.',['Selecciona uno de los cuatro roles','Escribe tu nombre si quieres','Pulsa “Empezar turno”'],'Elige tu rol y pulsa “Empezar turno” en la tableta'],
    explore:['Explora antes de decidir','Mueve el reloj y observa el mapa. Puedes empezar por cualquiera de los cuatro eventos.',['Mueve la barra “Hora del día”','Toca el evento que quieres explorar','Pulsa “Revisar decisión”'],'Elige un evento y pulsa “Revisar decisión” en la tableta'],
    decision:['¿Cómo responderías a esta situación?','Revisa la pista del evento. Al seleccionar una acción verás una vista previa de su impacto simulado.',['Lee la situación y su pista','Toca una acción y observa los cambios','Confirma con “Aplicar decisión”'],'Elige una acción y pulsa “Aplicar decisión” en la tableta'],
    result:['Una decisión, un aprendizaje','Compara el resultado y descubre qué cambia cuando anticipas la congestión.',['Revisa el puntaje y la explicación','Prueba otra decisión si quieres','Elige otro evento o termina tu turno'],'En la tableta: cambia tu decisión, elige otro evento o termina'],
    final:['Tu turno deja una lección','La información ayuda a anticipar problemas. Las personas deciden cómo responder.',['Revisa tus decisiones','Vuelve a los eventos para seguir explorando','O regresa al menú de PredictToDo'],'Pulsa “Jugar otro evento” o “Menú” en la tableta']
   }},
  en:{simulation:'Educational simulation · Game scores and effects are simulated.',infoCta:'When you are ready, press “Interactive experience” on the tablet',station:'STATION',onTablet:'ON THE TABLET',selected:'Your selection',event:'Selected event',action:'Selected action',noAction:'You have not selected an action yet',completed:'events played',score:'Score for this decision',total:'Your total score',free:'Play another event, try again or return to the menu whenever you like.',
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
 function cta(text){return `<footer class="ptd-tv-cta"><div role="status"><span>${tabletIcon}</span><strong>${esc(text)}</strong><b aria-hidden="true">↓</b></div></footer>`;}
 /* «About the project» (13 Nov 2026 infographic) assembled element by element, like the IDB reference
    «Iniciativa 2.2_animada_PRO» (same choreography as stations 03 and 08): the blue panel sweeps in,
    the title rises, then the challenge, the solution, each impact figure and the GitHub QR.
    Every piece is a crop of the supplied PNG laid over the same sheet with its content erased,
    so the finished frame is the PNG itself; at the end the full PNG fades in on top to remove any seam.
    Boxes are in the 1920 × 1080 pixels of the PNG. */
 const box=(x,y,w,h)=>({x,y,w,h});
 const SHEET={
  panel:box(0,0,764,1080),
  logo:box(60,64,300,76),title:box(62,464,630,96),sub:box(62,570,512,54),unit:box(62,630,200,50),
  cards:[
   {frame:box(838,98,485,395),head:box(866,124,300,42),icon:box(868,187,122,122),text:box(868,326,380,140)},
   {frame:box(1366,97,485,396),head:box(1394,123,272,42),icon:box(1396,186,122,122),text:box(1396,325,426,140)}
  ],
  impactTitle:box(866,534,300,42),
  bar:box(838,592,1007,184),
  facts:[
   {value:box(874,614,244,67),label:box(874,681,170,57)},
   {value:box(1212,614,230,62),label:box(1212,678,180,34),divider:box(1176,620,10,128)},
   {value:box(1532,612,270,60),label:box(1532,676,200,58),divider:box(1500,620,10,128)}
  ],
  qr:box(854,837,131,130),
  repo:[box(992,860,70,22),box(992,882,190,34),box(992,917,266,28)]
 };
 const sheetAlt={
  es:'Infografía de PredictToDo: el reto, la solución, el impacto a la fecha y el código en GitHub',
  en:'PredictToDo infographic: the challenge, the solution, the impact to date and the code on GitHub'
 };
 /* One cropped piece: --x/--y are relative to its parent piece, --sx/--sy pick the crop. */
 function piece(cls,b,source,parent,inner='',style=''){
  const px=parent?parent.x:0,py=parent?parent.y:0;
  return `<span class="ptd-sh-el ${cls}" style="--x:${b.x-px};--y:${b.y-py};--w:${b.w};--h:${b.h};${style}"><i class="ptd-sh-crop ptd-sh-crop--${source}" style="--sx:${b.x};--sy:${b.y}"></i>${inner}</span>`;
 }
 function sheet(lang,image,base){
  const s=SHEET;
  const panel=piece('ptd-sh-panel',s.panel,'base',null,
   piece('ptd-sh-logo',s.logo,'full',s.panel)+
   piece('ptd-sh-rise',s.title,'full',s.panel,'','--t:1.2s')+
   piece('ptd-sh-rise',s.sub,'full',s.panel,'','--t:1.5s')+
   piece('ptd-sh-rise',s.unit,'full',s.panel,'','--t:1.8s'));
  const cards=s.cards.map((c,i)=>piece(`ptd-sh-card ptd-sh-card--${i?'solution':'challenge'}`,c.frame,'base',null,
   piece('ptd-sh-head',c.head,'full',c.frame)+
   piece('ptd-sh-icon',c.icon,'full',c.frame)+
   piece('ptd-sh-text',c.text,'full',c.frame),
   `--d:${(1.8+i*.7).toFixed(1)}s`)).join('');
  const facts=s.facts.map((f,i)=>
   (f.divider?piece('ptd-sh-divider',f.divider,'full',s.bar,'',`--i:${i}`):'')+
   piece('ptd-sh-value',f.value,'full',s.bar,'',`--i:${i}`)+
   piece('ptd-sh-label',f.label,'full',s.bar,'',`--i:${i}`)).join('');
  const repo=s.repo.map((b,i)=>piece('ptd-sh-repo',b,'full',null,'',`--i:${i}`)).join('');
  // Absolute URLs: a relative url() inside a custom property may resolve against the stylesheet.
  const abs=src=>{try{return new URL(src,document.baseURI).href;}catch{return src;}};
  return `<section class="ptd-sh is-animated" style="--full:url('${esc(abs(image))}');--base:url('${esc(abs(base))}')" aria-label="${esc(sheetAlt[lang])}">
   <i class="ptd-sh-veil" aria-hidden="true"></i><i class="ptd-sh-bleed" aria-hidden="true"></i>
   <div class="ptd-sh-stage">
    ${panel}${cards}
    ${piece('ptd-sh-impact-title',s.impactTitle,'full',null)}
    ${piece('ptd-sh-bar',s.bar,'base',null,facts)}
    ${piece('ptd-sh-qr',s.qr,'full',null)}${repo}
    <img class="ptd-sh-final" src="${esc(image)}" width="1920" height="1080" alt="${esc(sheetAlt[lang])}">
    ${cta(copy[lang].infoCta)}
   </div>
  </section>`;
 }
 if(typeof Image!=='undefined'&&window.BOGOTA_TRAFFIC?.INFO_SHEET&&!/\/projects\//.test(location.pathname))new Image().src=window.BOGOTA_TRAFFIC.INFO_SHEET.base;
 function information({language,image,label}){
  const lang=langOf(language);
  const art=window.BOGOTA_TRAFFIC?.INFO_SHEET;
  // The crop boxes belong to that exact PNG; any other artwork falls back to the plain image.
  if(art&&image===art.image)return `<main class="ptd-tv-information ptd-tv-information--sheet" lang="${lang}">${sheet(lang,image,art.base)}</main>`;
  return `<main class="ptd-tv-information" lang="${lang}"><div class="ptd-tv-art">${window.AI_ARTWORK(image,`class="ptd-tv-infographic" alt="${esc(label)}"`)}</div>${cta(copy[lang].infoCta)}</main>`;
 }
 function gameView(options){
  const phase=options.game?.phase||'intro';
  if(window.PREDICTTODO_CONTROL&&['explore','decision','result'].includes(phase))return window.PREDICTTODO_CONTROL.render({...options,readonly:true});
  const html=window.PULSE_VIAL.render({...options,readonly:true});
  return window.PREDICTTODO_CONTROL?window.PREDICTTODO_CONTROL.displayOnly(html):html;
 }
 // TV storytelling. The project facts above are the only source; the tablet keeps controls only.
 // The strongest figures close the experience; the opening stays a short visual guide.
 const storyCopy={
  es:{impact:'PREDICTTODO EN BOGOTÁ',selectedRole:'ROL SELECCIONADO EN LA TABLETA',stats:['de anticipación','por intervalo','tramos viales','de datos analizados']},
  en:{impact:'PREDICTTODO IN BOGOTÁ',selectedRole:'ROLE SELECTED ON THE TABLET',stats:['ahead','per interval','road segments','of data analyzed']}
 };
 const storyStats=[['12 h',0],['15 min',1],['139.000+',2],['20 TB',3]];
 function story(block,language){
  const lang=langOf(language),s=storyCopy[lang];
  if(block==='stats')return `<div class="ptd-story-stats" role="list">${storyStats.map(([value,i])=>`<span role="listitem"><b>${lang==='en'&&value==='139.000+'?'139,000+':value}</b><small>${s.stats[i]}</small></span>`).join('')}</div>`;
  if(block==='impact')return `<section class="ptd-story-impact"><p class="ptd-story-kicker">${s.impact}</p><h3>${esc(facts[lang][0][1])}</h3>${story('stats',language)}</section>`;
  return '';
 }
 function renderGameInto(root,options){
  window.PULSE_VIAL.renderInto(root,{...options,readonly:true});
 }
 window.PREDICTTODO_INSIGHTS=Object.freeze({information,gameView,renderGameInto,story,storyCopy,facts});
})();
