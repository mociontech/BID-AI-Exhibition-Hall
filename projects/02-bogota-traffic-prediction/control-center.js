/* PredictToDo control desk and TV map wall. Street geometry is OSM; traffic is simulated. */
(function(){
 const root='/projects/02-bogota-traffic-prediction/';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const colors=['#28c98b','#f6cb42','#ff8b38','#ff304f'];
 const words={
  "es": {
    "title": "Tu panel de control",
    "wall": "Bogotá · Simulación de movilidad",
    "menu": "Menú",
    "back": "Volver",
    "now": "Hora de la simulación",
    "map": "Mapa de Bogotá",
    "roads": "Vías reales · Tráfico simulado",
    "normal": "Fluido",
    "busy": "Moderado",
    "dense": "Denso",
    "critical": "Alta congestión",
    "hotspots": "puntos críticos",
    "zero": "Sin atascos críticos en este caso.",
    "help": "Toca un punto rojo o un corredor principal para ver su detalle.",
    "traffic": "Congestión",
    "speed": "Velocidad",
    "before": "Antes",
    "after": "Después",
    "preview": "Prueba de tu acción",
    "applied": "Tu acción, aplicada",
    "events": "1. Elige un caso",
    "eventHint": "Elige el caso en el que quieres tomar una decisión.",
    "actionHint": "Elige una acción y compara los indicadores.",
    "review": "Tomar una decisión",
    "nextStep": "Pulsa «Tomar una decisión» para elegir qué hacer en este caso.",
    "apply": "Confirmar acción",
    "retry": "Probar otra acción",
    "other": "Cambiar de caso",
    "finish": "Ver resultados",
    "score": "Puntaje",
    "play": "Reproducir el día",
    "pause": "Pausar",
    "error": "No se pudieron cargar las calles. Recarga para intentarlo de nuevo.",
    "hour": "Hora de la simulación",
    "timeTitle": "Explora el tráfico a lo largo del día",
    "timeHint": "Desliza la barra para comparar el tráfico entre horas.",
    "hint": "Arrastra o amplía el mapa.",
    "current": "Seleccionado",
    "available": "Disponible",
    "done": "Jugado · repetir",
    "loading": "Cargando calles de Bogotá…",
    "tablet": "EN LA TABLETA",
    "ctaExplore": "Elige un caso en la tableta.",
    "ctaDecision": "Toca una acción para ver su efecto aquí.",
    "ctaResult": "Prueba otra acción, cambia de caso o termina en la tableta.",
    "simulation": "Vías reales · Tráfico y resultados simulados para aprender.",
    "route": "Acercar al evento",
    "selectedHint": "Compara los colores del mapa y confirma tu acción.",
    "chooseFirst": "Primero elige una acción",
    "actionTitle": "2. Prueba una acción",
    "resultTitle": "3. Tu decisión",
    "resultHint": "Consulta tu puntaje o prueba otra acción.",
    "ctaConfirm": "¿Te convence el cambio? Confirma en la tableta.",
    "stepCase": "Explorar",
    "stepAction": "Decidir",
    "stepResult": "Resultado",
    "caseLabel": "Caso",
    "onTV": "La TV explica qué aporta la IA.",
    "lesson": "Qué puedes aprender"
  },
  "en": {
    "title": "Your control panel",
    "wall": "Bogotá · Mobility simulation",
    "menu": "Menu",
    "back": "Back",
    "now": "Simulation time",
    "map": "Bogotá street map",
    "roads": "Real streets · Simulated traffic",
    "normal": "Free flow",
    "busy": "Moderate",
    "dense": "Heavy",
    "critical": "Severe",
    "hotspots": "congestion hotspots",
    "zero": "No severe backups in this case.",
    "help": "Tap a red hotspot or a main corridor to see its details.",
    "traffic": "Congestion",
    "speed": "Speed",
    "before": "Before",
    "after": "After",
    "preview": "Testing your action",
    "applied": "Your action, applied",
    "events": "1. Choose a case",
    "eventHint": "Choose the case you want to make a decision about.",
    "actionHint": "Choose an action and compare the indicators.",
    "review": "Make a decision",
    "nextStep": "Press “Make a decision” to choose what to do in this case.",
    "apply": "Confirm action",
    "retry": "Try another action",
    "other": "Change case",
    "finish": "View results",
    "score": "Score",
    "play": "Play the day",
    "pause": "Pause",
    "error": "The streets could not be loaded. Reload to try again.",
    "hour": "Simulation time",
    "timeTitle": "Explore traffic throughout the day",
    "timeHint": "Drag the slider to compare traffic at different times.",
    "hint": "Drag or zoom the map.",
    "current": "Selected",
    "available": "Available",
    "done": "Played · replay",
    "loading": "Loading Bogotá streets…",
    "tablet": "ON THE TABLET",
    "ctaExplore": "Choose a case on the tablet.",
    "ctaDecision": "Tap an action to see its effect here.",
    "ctaResult": "Try another action, change case or finish on the tablet.",
    "simulation": "Real streets · Simulated traffic and results for learning.",
    "route": "Focus on the event",
    "selectedHint": "Compare the map colors, then confirm your action.",
    "chooseFirst": "Choose an action first",
    "actionTitle": "2. Try an action",
    "resultTitle": "3. Your decision",
    "resultHint": "Check your score or try another action.",
    "ctaConfirm": "Happy with the change? Confirm on the tablet.",
    "stepCase": "Explore",
    "stepAction": "Decide",
    "stepResult": "Result",
    "caseLabel": "Case",
    "onTV": "The TV explains what AI contributes.",
    "lesson": "What you can learn"
  }
};
 const languageOf=value=>value==='es'?'es':'en';
 const caseCopy={
  es:[['Hora pico','Av. Ciudad de Cali','Muchos vehículos van en el mismo sentido y la avenida se está llenando.'],['Llegada al estadio','El Campín','Los hinchas llegan al estadio: vehículos y peatones se acumulan en los accesos.'],['Salida del estadio','El Campín','El partido termina y muchas personas salen al mismo tiempo.'],['Noche tranquila','Calle 100','Hay poco tráfico. ¿Hace falta intervenir o conviene seguir observando?']],
  en:[['Rush hour','Av. Ciudad de Cali','Many vehicles are heading in the same direction and the avenue is filling up.'],['Stadium arrivals','El Campín','Fans are arriving: cars and pedestrians are gathering at the stadium entrances.'],['Stadium departure','El Campín','The match ends and many people leave at the same time.'],['A quiet night','Calle 100','Traffic is light. Should you intervene or keep watching?']]
 };
 const actionCopy={
  es:{signals:['Ajustar semáforos','Cambiar los tiempos de los cruces.'],reversible:['Abrir carril reversible','Dar más espacio al sentido con más tráfico.'],agents:['Enviar agentes','Organizar los cruces y los peatones.'],monitor:['Seguir observando','Observar antes de usar recursos.']},
  en:{signals:['Adjust traffic lights','Change the timing at junctions.'],reversible:['Open a reversible lane','Give the busier direction more space.'],agents:['Send traffic officers','Organize junctions and pedestrians.'],monitor:['Keep watching','Observe before using resources.']}
 };
 const sceneFor=(network,id)=>network.scenes[id]||network.scenes.cali_peak;
 const level=value=>value>=82?3:value>=65?2:value>=42?1:0;
 function state(data,game,actionId=game.actionId){
  const item=data.scenarios[game.scenarioIndex]||data.scenarios[0];
  const curve=hour=>hour>=16&&hour<=20?14:hour>=7&&hour<=9?10:hour>=21?0:-13;
  const detail=hour=>(hour%3)*2;
  const hour=Number.isFinite(game.hour)?game.hour:item.hour;
  const shift=curve(hour)+detail(hour)-curve(item.hour)-detail(item.hour);
  const effect=item.effects[actionId]||{congestion:0,speed:0,critical:0};
  return {congestion:Math.max(10,Math.min(96,item.baseline.congestion+shift+effect.congestion)),speed:Math.max(0,item.baseline.speed+effect.speed),critical:Math.max(0,item.baseline.critical+effect.critical)};
 }
 function model(options,network){
  const {data,game}=options,item=data.scenarios[game.scenarioIndex]||data.scenarios[0],saved=sceneFor(network,item.id);
  const scene={...saved,corridors:window.PREDICTTODO_EXPLORATION?.ids(item)||saved.corridors};
  const before=state(data,game,null),after=state(data,game,game.actionId);
  const features=network.features.filter(f=>f.properties.area===scene.area);
  const active=features.filter(f=>scene.corridors.includes(f.properties.corridor));
  return {item,scene,before,after,features,active,data,game,language:languageOf(options.language)};
 }
 function streetValue(feature,m){
  const road=feature.properties.highway;
  const shift=['motorway','trunk','primary'].includes(road)?0:['secondary','tertiary'].includes(road)?10:20;
  return Math.max(12,Math.min(96,m.after.congestion-shift));
 }
 function hotspotPositions(features,count,event=null){
  if(!count)return [];
  let candidates=[];
  for(const feature of features){const points=feature.geometry.coordinates;for(let i=1;i<points.length;i++)candidates.push([(points[i-1][0]+points[i][0])/2,(points[i-1][1]+points[i][1])/2]);}
  if(!candidates.length)return [];
  if(event){const separated=candidates.filter(p=>Math.hypot(p[0]-event[0],p[1]-event[1])>.0025);if(separated.length>=count)candidates=separated;}
  const center=[candidates.reduce((sum,p)=>sum+p[0],0)/candidates.length,candidates.reduce((sum,p)=>sum+p[1],0)/candidates.length];
  const distance=(a,b)=>(a[0]-b[0])**2*Math.cos(center[1]*Math.PI/180)**2+(a[1]-b[1])**2;
  const selected=[candidates.reduce((best,p)=>distance(p,center)<distance(best,center)?p:best)];
  while(selected.length<count){const next=candidates.reduce((best,p)=>Math.min(...selected.map(a=>distance(p,a)))>Math.min(...selected.map(a=>distance(best,a)))?p:best);selected.push(next);}
  return selected;
 }
 function header(options){
  const {game,data,readonly}=options,lang=languageOf(options.language),c=words[lang];
  const person=data.characters.find(p=>p.id===game.playerId)||data.characters[0];
  const back=game.phase==='explore'?'back-player':game.phase==='decision'?'to-explore':'retry';
  const controls=readonly?`<span class="cc-station">${lang==='es'?'ESTACIÓN':'STATION'} ${String(options.station||1).padStart(2,'0')} · ${lang.toUpperCase()}</span>`:`<div class="cc-operator"><strong>${esc(game.playerName||person.name)}</strong><small>${esc(person['role_'+lang])}</small></div><nav class="cc-language" aria-label="Language"><button type="button" data-language="es" aria-pressed="${lang==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${lang==='en'}">EN</button></nav><button type="button" class="cc-header-button" data-action="${back}">← ${c.back}</button><button type="button" class="cc-header-button" data-action="exit-game">← ${c.menu}</button>`;
  return `<header class="cc-header"><div class="cc-brand"><img src="${root}predicttodoImages/idb-group-white.svg" alt="IDB Group"><span></span><div><strong>AI in Action</strong><small>IDB Group Projects Across the Region</small></div></div>${controls}</header>`;
 }
 function metrics(m,language,compare=false){
  const c=words[language],rows=[['congestion',c.traffic,'%'],['speed',c.speed,' km/h'],['critical',c.hotspots,'']];
  return `<div class="cc-metrics">${rows.map(([key,label,unit])=>`<div data-cc-metric="${key}"><span>${label}</span><strong>${compare?`<del>${m.before[key]}${unit}</del><i aria-hidden="true">→</i>`:''}<b>${m.after[key]}<small>${unit}</small></b></strong></div>`).join('')}</div>`;
 }
 function mapView(options,m){
  const lang=languageOf(options.language),c=words[lang],game=options.game;
  const zoom=options.readonly?'':`<nav class="cc-map-tools" aria-label="${c.map}"><button type="button" data-cc-zoom="1" disabled aria-label="${lang==='es'?'Acercar':'Zoom in'}">+</button><button type="button" data-cc-zoom="-1" disabled aria-label="${lang==='es'?'Alejar':'Zoom out'}">−</button><button type="button" data-cc-home disabled aria-label="${c.route}">⌖</button></nav>`;
  const clock=game.hour===m.item.hour?m.item.time:String(game.hour).padStart(2,'0')+':00';
  const explore=window.PREDICTTODO_EXPLORATION;
  const timebar=options.readonly||game.phase!=='explore'?'':`<section class="cc-time-options cc-time-options--visible cc-time-options--chart" aria-label="${c.hour}"><div class="cc-timebar"><div class="cc-time-heading"><div class="cc-time-copy"><h3>${c.timeTitle}</h3><p id="cc-time-hint">${c.timeHint}</p></div><strong aria-label="${c.hour}">${clock}</strong></div><div class="cc-playback"><button type="button" data-action="toggle-day" data-cc-play>▶ ${c.play}</button><nav aria-label="${lang==='es'?'Velocidad de reproducción':'Playback speed'}">${(lang==='es'?['Lento','Normal','Rápido']:['Slow','Normal','Fast']).map((label,i)=>`<button type="button" data-play-rate="${[1800,1000,500][i]}" aria-pressed="${i===1}">${label}</button>`).join('')}</nav></div><div class="cc-timeline-chart">${explore?explore.chart(options.data,{...game,language:lang},explore.selected(m.item,game.selectedCorridor),true):''}</div><input id="cc-hour" type="range" min="6" max="23" step="1" value="${game.hour}" style="--cc-progress:${(game.hour-6)/17*100}%" data-hour aria-label="${c.hour}" aria-describedby="cc-time-hint"><div class="cc-time-ticks"><span>06:00</span><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span><span>23:00</span></div></div></section>`;
  const indicators=`<section class="cc-map-dashboard" aria-label="${lang==='es'?'Indicadores de tráfico simulado':'Simulated traffic indicators'}"><div class="cc-dashboard-caption"><b>${lang==='es'?'Indicadores del caso':'Case indicators'}</b><span>${game.actionId?c.before+' → '+c.after:lang==='es'?'Sin tu acción':'Without your action'}</span></div>${metrics(m,lang,Boolean(game.actionId))}</section>`;
  return `<section class="cc-map-panel" aria-label="${c.map}">${indicators}<div class="cc-map-frame" data-cc-preview="${Boolean(game.actionId)}"><div class="cc-map-readout"><div><small>${c.now}</small><strong>${clock}</strong></div><span>${game.phase==='result'?c.applied:game.actionId?c.preview:c.roads}</span></div><div class="cc-geography" data-cc-geography><svg class="cc-map-fallback" viewBox="0 0 1000 650" role="img" aria-label="${c.map}"></svg><div class="cc-map-live" aria-label="${c.map}"></div><p class="cc-map-status">${c.loading}</p></div>${zoom}</div><div class="cc-map-legend">${[c.normal,c.busy,c.dense,c.critical].map((text,i)=>`<span><i style="background:${colors[i]}"></i>${text}</span>`).join('')}</div><p class="cc-map-explanation">${m.after.critical?c.help:c.zero}</p>${timebar}</section>`;
 }
 function events(options,m){
  const {data,game}=options,lang=m.language,c=words[lang];
  return `<h2>${c.events}</h2><p class="cc-instruction">${c.eventHint}</p><div class="cc-events">${data.scenarios.map((item,i)=>`<button type="button" data-scenario="${i}" aria-pressed="${game.scenarioIndex===i}" class="${game.scenarioIndex===i?'is-active':''}"><span aria-hidden="true">${esc(item.icon)}</span><div><b>${esc(caseCopy[lang][i][0])}</b><small>${esc(caseCopy[lang][i][1])} · ${item.time}</small><em>${Object.hasOwn(game.results||{},i)?c.done:game.scenarioIndex===i?c.current:c.available}</em></div><i aria-hidden="true">${game.scenarioIndex===i?'✓':'→'}</i></button>`).join('')}</div><div data-cc-exploration>${window.PREDICTTODO_EXPLORATION?.panel(options)||''}</div><footer class="cc-panel-actions cc-explore-next"><div class="cc-next-step"><strong>${lang==='es'?'Caso elegido':'Selected case'}: ${esc(caseCopy[lang][game.scenarioIndex][0])}</strong><p>${c.nextStep}</p></div>${Object.keys(game.results||{}).length?`<button type="button" class="cc-secondary cc-results-button" data-action="finish-session">${c.finish}</button>`:''}<button type="button" class="cc-primary" data-action="to-decision">${c.review} →</button></footer>`;
 }
 function actions(options,m){
  const {data,game}=options,lang=m.language,c=words[lang];
  return `<p class="cc-case-tag">${esc(caseCopy[lang][game.scenarioIndex][0])} · ${m.item.time}</p><h2>${c.actionTitle}</h2><p class="cc-instruction" role="status">${game.actionId?c.selectedHint:c.actionHint}</p><div class="cc-actions">${data.actions.map(action=>`<button type="button" data-action-choice="${action.id}" aria-pressed="${game.actionId===action.id}" class="${game.actionId===action.id?'is-selected':''}"><span aria-hidden="true">${esc(action.icon)}</span><b>${esc(actionCopy[lang][action.id][0])}</b><small>${esc(actionCopy[lang][action.id][1])}</small></button>`).join('')}</div><footer class="cc-panel-actions"><button type="button" class="cc-primary" data-action="confirm-decision" ${game.actionId?'':'disabled'}>${game.actionId?c.apply:c.chooseFirst} →</button></footer>`;
 }
 function result(options,m){
  const {game,data}=options,lang=m.language,c=words[lang];
  const score=game.results?.[game.scenarioIndex]??window.PULSE_VIAL.roleScore(data,game,m.item,game.actionId);
  const action=data.actions.find(a=>a.id===game.actionId);
  return `<p class="cc-case-tag">${esc(caseCopy[lang][game.scenarioIndex][0])} · ${m.item.time}</p><h2>${c.resultTitle}</h2><p class="cc-instruction">${c.resultHint}</p><div class="cc-result-score"><strong>${score}<small>/100</small></strong><span>${c.score}</span></div><div class="cc-selected-action">${esc(action?.icon)} ${esc(actionCopy[lang][action.id][0])}</div><footer class="cc-panel-actions cc-result-actions"><button type="button" class="cc-primary cc-results-button" data-action="finish-session">${c.finish} &#8594;</button><button type="button" class="cc-secondary" data-action="retry">${c.retry}</button><button type="button" class="cc-secondary" data-action="choose-event">${c.other}</button></footer>`;
 }
 const teachingCopy={
  es:{title:'La IA anticipa. Tú decides.',label:'CÓMO FUNCIONA PREDICTTODO',ai:'QUÉ HACE LA IA',role:'IDEA CLAVE',case:'TU CASO',test:'Tu acción en este ensayo',lesson:'Lo que puedes aprender',steps:['Entender','Decidir','Comprobar'],
   flow:[['Datos','Tráfico · clima · eventos'],['Pronóstico','Congestión y velocidad'],['Decisión humana','Dónde y cómo actuar']],
   explore:['Primero, entiende la alerta.','Combina tráfico, clima y eventos para anticipar problemas entre calles conectadas.','Un atasco puede afectar a las vías vecinas. Por eso, la IA analiza la red.'],
   decision:['Usa el pronóstico para actuar.','Pronostica congestión y velocidad hasta 12 horas antes, cada 15 minutos.','El tiempo importa: compara el tráfico reciente con las condiciones futuras conocidas.'],
   preview:['Prueba tu idea antes de confirmarla.','La IA anticipa el riesgo; el equipo elige cómo responder.','El pronóstico ayuda a preparar una medida antes de que el problema se extienda.'],
   result:['Comprueba qué cambió.','La IA aporta un pronóstico. Las personas deciden cómo actuar.','Los cambios de este juego son simulados.'],
   ctaExplore:'Elige un caso en la tableta y pulsa «Usar este caso».',ctaDecision:'Toca una acción en la tableta para probarla.',ctaPreview:'Compara el mapa y pulsa «Confirmar acción» en la tableta.',ctaResult:'En la tableta, pulsa «Ver resultados» o prueba otra acción.'},
  en:{title:'AI forecasts. You decide.',label:'HOW PREDICTTODO WORKS',ai:'WHAT AI DOES',role:'KEY INSIGHT',case:'YOUR CASE',test:'Your action in this trial',lesson:'What you can learn',steps:['Understand','Decide','Check'],
   flow:[['Data','Traffic · weather · events'],['Forecast','Congestion and speed'],['Human decision','Where and how to act']],
   explore:['First, understand the alert.','Combines traffic, weather and events to anticipate problems across connected streets.','A backup can affect neighboring roads. That is why AI analyzes the network.'],
   decision:['Turn the forecast into action.','Forecasts congestion and speed up to 12 hours ahead, every 15 minutes.','Time matters: it compares recent traffic with known future conditions.'],
   preview:['Try your idea before confirming.','AI anticipates risk; people choose the response.','A forecast helps people prepare before the problem spreads.'],
   result:['Check what changed.','AI provides a forecast. People decide how to act.','Changes in this game are simulated.'],
   ctaExplore:'Choose a case on the tablet and press “Use this case”.',ctaDecision:'Tap an action on the tablet to try it.',ctaPreview:'Compare the map, then press “Confirm action” on the tablet.',ctaResult:'On the tablet, press “View results” or try another action.'}
 };
 // Illustrative explanations only: these do not add weather or model outputs to game state.
 const forecastExamples={
  es:[
   ['Si llueve en hora pico…',[
    'La hora de salida del trabajo, el clima y las velocidades recientes se analizan juntos.',
    'Si esas señales apuntan a viajes más lentos, el modelo puede anticipar mayor congestión en la zona.',
    'La autoridad usa esa señal para preparar medidas antes del atasco. Decide según las condiciones de la vía.'
   ]],
   ['Antes de un partido en El Campín',[
    'El horario del partido se combina con el tráfico reciente y las vías que conectan con el estadio.',
    'La IA estima en qué accesos podría concentrarse el tráfico antes de la llegada de los hinchas.',
    'El equipo puede preparar agentes y organizar accesos. Las personas deciden dónde hace falta apoyo.'
   ]],
   ['Cuando termina el partido',[
    'La salida prevista del evento se cruza con las velocidades y las conexiones de las calles vecinas.',
    'El modelo estima cómo podría extenderse la congestión desde los accesos hasta los cruces cercanos.',
    'El equipo puede coordinar semáforos y apoyo en vía antes de que se bloqueen varios cruces.'
   ]],
   ['Una noche con poco tráfico',[
    'La hora, las velocidades recientes y los eventos previstos dan contexto al modelo.',
    'Si las señales apuntan a tráfico fluido, el pronóstico puede indicar que la zona seguirá despejada.',
    'La autoridad puede seguir observando y reservar recursos para otra zona que sí necesite atención.'
   ]]
  ],
  en:[
   ['If rain coincides with rush hour…',[
    'The evening commute, weather and recent road speeds are analyzed together.',
    'If those signals suggest slower journeys, the model may forecast heavier congestion in the area.',
    'The authority uses that signal to prepare before traffic builds up. People choose a response suited to the road.'
   ]],
   ['Before a match at El Campín',[
    'The match schedule is combined with recent traffic and the roads connecting to the stadium.',
    'AI estimates which access roads could get busy before the fans arrive.',
    'The team can prepare officers and organize access. People decide where support is needed.'
   ]],
   ['When the match ends',[
    'The expected end of the event is combined with speeds and connections on nearby streets.',
    'The model estimates how congestion could spread from the exits to nearby junctions.',
    'The team can coordinate signals and field support before several junctions become blocked.'
   ]],
   ['A night with light traffic',[
    'The time, recent speeds and scheduled events give the model context.',
    'If the signals point to free-flowing traffic, the forecast may suggest that the area will stay clear.',
    'The authority can keep watching and save resources for another area that needs attention.'
   ]]
  ]
 };
 function insight(options){
  const {data,game}=options,lang=languageOf(options.language),es=lang==='es';
  const item=data.scenarios[game.scenarioIndex]||data.scenarios[0],person=data.characters.find(p=>p.id===game.playerId)||data.characters[0];
  const actionInsights=es?{
   signals:['El tiempo de cruce importa','Ajustar los semáforos cambia cómo se reparte el tiempo de paso entre los cruces. Compara el efecto antes de confirmar.'],
   reversible:['Más espacio en el sentido cargado','Un reversible puede ayudar cuando muchos vehículos van en la misma dirección. La autoridad debe evaluar las condiciones de la vía.'],
   agents:['Apoyo humano en los cruces','Los agentes pueden organizar vehículos y peatones en puntos críticos. El contexto ayuda a decidir dónde hacen falta.'],
   monitor:['Observar también es decidir','Si el tráfico se está recuperando, seguir observando permite reservar recursos para otro lugar.']
  }:{
   signals:['Junction timing matters','Adjusting signals changes how crossing time is shared. Compare the effect before confirming.'],
   reversible:['More space in the busy direction','A reversible lane may help when many vehicles travel in one direction. The authority must assess road conditions.'],
   agents:['People help at critical junctions','Traffic officers can organize vehicles and pedestrians. Context helps identify where support is needed.'],
   monitor:['Watching is also a decision','When traffic is recovering, continued observation can save resources for another location.']
  };
  let pair;
  if(game.phase==='intro')pair=es?['La IA informa. Tú decides.','Explora una hora, elige un caso y prueba una acción. PredictToDo muestra cómo un pronóstico puede ayudar a prepararse antes del atasco.']:['AI informs. You decide.','Explore a time, choose a case and try an action. PredictToDo shows how a forecast can help people prepare before traffic builds up.'];
  else if(game.phase==='player')pair=[es?'Cada rol aporta una mirada':'Every role brings a perspective',person['focus_'+lang]];
  else if(game.phase==='explore')pair=[es?'El contexto cambia el pronóstico':'Context changes the forecast',forecastExamples[lang][game.scenarioIndex][1][0]];
  else if(game.phase==='decision')pair=game.actionId?actionInsights[game.actionId]:[es?'Anticipar da tiempo para actuar':'Forecasts give people time to act',item['clue_'+lang]];
  else if(game.phase==='result')pair=[es?'Lo que enseña este caso':'What this case teaches',item['lesson_'+lang]];
  else pair=es?['El pronóstico ayuda a prepararse','La IA analiza calles conectadas para anticipar dónde podría extenderse la congestión. Las personas deciden cómo responder.']:['A forecast helps people prepare','AI analyzes connected streets to anticipate where congestion could spread. People decide how to respond.'];
  return `<article class="cc-insight" data-insight="${esc(game.phase+'-'+(game.actionId||game.scenarioIndex))}"><span class="cc-insight-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 8L24 13L11 25L8 8M8 8L11 25"/><circle cx="8" cy="8" r="4"/><circle cx="24" cy="13" r="4"/><circle cx="11" cy="25" r="4"/></svg></span><div><p>PREDICTTODO · ${es?'IDEA CLAVE':'KEY INSIGHT'}</p><h3>${esc(pair[0])}</h3><span>${esc(pair[1])}</span></div></article>`;
 }
 function displayOnly(html){
  return html.replace(/<(button|input)\b([^>]*)>/g,(_,tag,attributes)=>`<${tag}${attributes.replace(/\sdisabled\b/g,'')} disabled tabindex="-1" aria-disabled="true">`);
 }
 function displayContext(options,m){
  const {game,data}=options,lang=m.language,es=lang==='es',copy=caseCopy[lang][game.scenarioIndex];
  const chosen=data.actions.find(a=>a.id===game.actionId),road=window.PREDICTTODO_EXPLORATION.selection(options);
  const stage=game.phase==='explore'?(es?'CASO EN EXPLORACIÓN':'CASE BEING EXPLORED'):game.phase==='decision'?(es?'PROBANDO UNA MEDIDA':'TESTING A RESPONSE'):(es?'RESULTADO DEL ENSAYO':'TRIAL RESULT');
  const score=game.results?.[game.scenarioIndex]??(game.phase==='result'?window.PULSE_VIAL.roleScore(data,game,m.item,game.actionId):null);
  return `<section class="cc-tv-context" data-observed-case="${game.scenarioIndex}" data-observed-action="${esc(chosen?.id||'')}"><p class="cc-kicker">${stage}</p><div class="cc-tv-case-heading"><span aria-hidden="true">${esc(m.item.icon)}</span><div><h2>${esc(m.item['title_'+lang])}</h2><p>${esc(copy[1])} · ${m.item.time}</p></div></div><p class="cc-tv-context-brief">${esc(m.item['brief_'+lang])}</p>${chosen?`<div class="cc-tv-response"><small>${es?'MEDIDA SELECCIONADA EN LA TABLETA':'RESPONSE SELECTED ON THE TABLET'}</small><strong>${esc(chosen.icon+' '+actionCopy[lang][chosen.id][0])}</strong>${game.phase==='result'?`<b>${score}<small>/100 ${es?'puntos':'points'}</small></b>`:''}</div>`:''}<section class="cc-tv-corridor" style="--road-color:${road.color}"><p>${es?'VÍA QUE ESTÁS EXPLORANDO':'ROAD BEING EXPLORED'}</p><h3>${esc(road.name)}</h3><div><span>${es?'Congestión':'Congestion'}<b>${road.now.congestion}%</b></span><span>${es?'Velocidad':'Speed'}<b>${road.now.speed}<small> km/h</small></b></span><span>${es?'En 30 min':'In 30 min'}<b>${road.future.congestion}%</b></span></div><div class="cc-tv-road-profile">${window.PREDICTTODO_EXPLORATION.chart(data,game,road.id)}</div><small>${es?'Comparación educativa · tráfico simulado':'Educational comparison · simulated traffic'}</small></section></section>`;
 }
 function notice(options){
  const {game}=options,lang=languageOf(options.language),es=lang==='es',t=teachingCopy[lang];
  const prompt=game.phase==='intro'?(es?'Pulsa «Elegir mi rol» para empezar.':'Press “Choose my role” to begin.'):
   game.phase==='player'?(es?'Elige tu rol y pulsa «Empezar turno».':'Choose your role and press “Start shift”.'):
   game.phase==='final'?(es?'Pulsa «Continuar» en la tableta para ver el ranking y los QR.':'Press “Continue” on the tablet to see the leaderboard and QR codes.'):
   game.phase==='explore'?(es?'Mueve la hora o toca una vía en la tableta para explorar.':'Move the clock or tap a road on the tablet to explore.'):game.phase==='result'?t.ctaResult:game.actionId?t.ctaPreview:t.ctaDecision;
  return `<footer class="cc-notice" role="status"><span class="cc-notice-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/></svg></span><div><small>${es?'CONTROLA DESDE LA TABLETA':'CONTROL FROM THE TABLET'}</small><strong>${esc(prompt)}</strong></div><span class="cc-notice-arrow" aria-hidden="true">→</span></footer>`;
 }
 function render(options){
  const fallbackItem=options.data.scenarios[options.game.scenarioIndex]||options.data.scenarios[0];
  options={...options,game:{playerId:'valentina',hour:fallbackItem.hour,results:{},...options.game}};
  const {game,data,readonly=false}=options,lang=languageOf(options.language),c=words[lang];
  const item=data.scenarios[game.scenarioIndex]||data.scenarios[0];
  const m={item,language:lang,before:state(data,game,null),after:state(data,game,game.actionId)};
  const current=['explore','decision','result'].indexOf(game.phase);
  const tabs=`<ol class="cc-steps" aria-label="${c.title}">${[c.stepCase,c.stepAction,c.stepResult].map((label,i)=>`<li ${i===current?'aria-current="step"':''}><span>${i<current?'✓':i+1}</span>${label}</li>`).join('')}</ol>`;
  const panel=game.phase==='explore'?events(options,m):game.phase==='decision'?actions(options,m):result(options,m);
  const footerAt=panel.lastIndexOf('<footer class="cc-panel-actions');
  const content=footerAt<0?panel:panel.slice(0,footerAt),footer=footerAt<0?'':panel.slice(footerAt);
  const map=mapView({...options,readonly},m);
  return `<main class="ptd-game cc-app ${readonly?'cc-app--tv cc-app--mirror cc-observer':''}" data-phase="${game.phase}" lang="${lang}">${header(options)}<div class="cc-title"><p>PREDICTTODO · ${lang==='es'?'EXPERIENCIA INTERACTIVA':'INTERACTIVE EXPERIENCE'}</p><h1>${readonly?(lang==='es'?'Pulso vial Bogotá':'Bogotá Traffic Pulse'):c.title}</h1></div><div class="cc-layout">${map}<aside class="cc-side">${tabs}<div class="cc-side-content">${readonly?displayContext(options,m):content}${readonly?insight(options):''}</div>${readonly?'':footer}</aside></div>${readonly?notice(options):''}<p class="cc-simulation">${c.simulation}${readonly?'':' · '+c.hint}</p></main>`;
 }
 let networkPromise;
 function loadNetwork(){return networkPromise ||= fetch(root+'streets.geojson').then(r=>{if(!r.ok)throw Error('Streets unavailable');return r.json();});}
 function viewBounds(m){
  const points=m.active.flatMap(f=>f.geometry.coordinates);points.push([m.scene.event[1],m.scene.event[0]]);
  return [[Math.min(...points.map(p=>p[1])),Math.min(...points.map(p=>p[0]))],[Math.max(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0]))]];
 }
 function fallback(record,m){
  if(record.live)return;
  const svg=record.node.querySelector('svg'),bounds=viewBounds(m),lat=(bounds[0][0]+bounds[1][0])/2;
  const lngScale=Math.cos(lat*Math.PI/180),width=(bounds[1][1]-bounds[0][1])*lngScale,height=bounds[1][0]-bounds[0][0];
  const scale=Math.min(860/(width||1),440/(height||1)),ox=(1000-width*scale)/2,oy=(650-height*scale)/2;
  const project=([x,y])=>[ox+(x-bounds[0][1])*lngScale*scale,650-oy-(y-bounds[0][0])*scale];
  const path=f=>f.geometry.coordinates.map((p,i)=>(i?'L':'M')+project(p).map(v=>v.toFixed(2)).join(',')).join('');
  const explore=window.PREDICTTODO_EXPLORATION;
  const streets=m.features.map(f=>{
   const id=f.properties.corridor,active=m.scene.corridors.includes(id);
   const color=active?colors[level(explore?explore.values(m.data,m.game,id).congestion:streetValue(f,m))]:colors[level(streetValue(f,m))];
   return `<path d="${path(f)}" fill="none" stroke="${color}" stroke-width="${active?1.1:.7}" stroke-linejoin="round" stroke-linecap="round"/>`;
  }).join('');
  const hotspots=hotspotPositions(m.active,m.after.critical,[m.scene.event[1],m.scene.event[0]]).map(p=>{const [x,y]=project(p);return `<g class="cc-fallback-hotspot" transform="translate(${x} ${y})"><title>${m.language==='es'?'Atasco simulado':'Simulated backup'}</title><circle r="7" fill="#ff304f" stroke="#fff" stroke-width="2"/></g>`;}).join('');
  const labels=m.scene.corridors.map(id=>{const roads=m.active.filter(f=>f.properties.corridor===id),point=hotspotPositions(roads,1)[0];if(!point)return '';const [x,y]=project(point);return `<text x="${x}" y="${y-23}" fill="#dbe9ff" stroke="#0c1421" stroke-width="4" paint-order="stroke" text-anchor="middle" font-size="15" font-weight="700">${esc(roads[0].properties.name)}</text>`;}).join('');
  svg.innerHTML=`<rect width="1000" height="650" fill="#202b3b"/>${streets}${labels}${hotspots}<text x="18" y="632" fill="#8191a8" font-size="13">© OpenStreetMap contributors · ${words[m.language].roads}</text>`;
  record.node.querySelector('.cc-map-status').hidden=true;record.node.dataset.criticalCount=String(m.after.critical);
 }
 function fit(record,m){window.PREDICTTODO_STREET_MAP.fit(record,m);}
 function focusCorridor(rootElement,id){
  const record=rootElement.querySelector('[data-cc-geography]')?._ccRecord;
  if(!record)return;
  if(!window.PREDICTTODO_STREET_MAP.focusCorridor(record,id))record.pendingCorridor=id;
 }
 function paint(record,m){window.PREDICTTODO_STREET_MAP.paint(record,m);}
 function release(rootElement){
  const record=rootElement.querySelector('[data-cc-geography]')?._ccRecord;
  if(record){record.observer?.disconnect();record.cleanup?.();record.map?.remove();delete record.node._ccRecord;}
 }
 function renderInto(rootElement,options){
  let current=rootElement.querySelector('[data-cc-geography]');
  const previous=current?._ccRecord;
  const semantic=game=>JSON.stringify({...game,mapView:null,mapPopup:null});
  // Camera packets must not detach the WebGL canvas while the tablet is being dragged.
  if(options.readonly&&previous?.ready&&previous.options.readonly&&previous.options.language===options.language&&semantic(previous.options.game)===semantic(options.game)){
   previous.options=options;
   window.PREDICTTODO_STREET_MAP.syncPresentation(previous,model(options,previous.network));return;
  }
  if(current?._ccRecord&&Boolean(current._ccRecord.options.readonly)!==Boolean(options.readonly)){release(rootElement);current=null;}
  const oldPhase=rootElement.querySelector('[data-phase]')?.dataset.phase;
  const scrollTop=oldPhase===options.game.phase&&current?._ccRecord?.options.game.scenarioIndex===options.game.scenarioIndex?rootElement.querySelector('.cc-side-content')?.scrollTop||0:0;
  rootElement.innerHTML=render(options);
  const sidebar=rootElement.querySelector('.cc-side-content');if(sidebar)sidebar.scrollTop=scrollTop;
  let node=rootElement.querySelector('[data-cc-geography]');
  if(current){node.replaceWith(current);node=current;}
  const record=node._ccRecord||{node,options,scene:null};node._ccRecord=record;record.options=options;
  loadNetwork().then(network=>{
   if(!node.isConnected)return;
   record.network=network;
   const m=model(record.options,network);
   // Show the local street grid during a case change instead of an empty tile background.
   if(record.scene!==m.item.id){record.live=false;node.classList.remove('is-live');}
   fallback(record,m);
   if(record.map)paint(record,m);
   else if(!record.starting){record.starting=true;window.PREDICTTODO_STREET_MAP.start(record,network).catch(()=>{});}
   if(record.pendingCorridor&&record.ready){const id=record.pendingCorridor;delete record.pendingCorridor;window.PREDICTTODO_STREET_MAP.focusCorridor(record,id);}
   rootElement.querySelectorAll('[data-cc-zoom]').forEach(button=>{button.disabled=Boolean(options.readonly)||!record.map;button.onclick=()=>{if(record.map)record.map.setZoom(record.map.getZoom()+Number(button.dataset.ccZoom));};});
   const home=rootElement.querySelector('[data-cc-home]');if(home){home.disabled=Boolean(options.readonly)||!record.map;home.onclick=()=>fit(record,model(record.options,network));}
  }).catch(()=>{if(node.isConnected){node.querySelector('.cc-map-status').textContent=words[languageOf(options.language)].error;networkPromise=null;}});
 }
 function update(rootElement,options){
  const record=rootElement.querySelector('[data-cc-geography]')?._ccRecord;if(!record)return;
  record.options={...record.options,...options};
  const item=options.data.scenarios[options.game.scenarioIndex],hour=String(options.game.hour).padStart(2,'0')+':00';
  const timeline=rootElement.querySelector('.cc-timebar>div>strong');if(timeline)timeline.textContent=options.game.hour===item.hour?item.time:hour;
  const slider=rootElement.querySelector('[data-hour]');if(slider)slider.style.setProperty('--cc-progress',((options.game.hour-6)/17*100)+'%');
  const exploration=window.PREDICTTODO_EXPLORATION;
  const graph=rootElement.querySelector('.cc-timeline-chart');if(graph&&exploration)graph.innerHTML=exploration.chart(options.data,{...options.game,language:options.language},exploration.selected(item,options.game.selectedCorridor),true);
  const detail=rootElement.querySelector('[data-cc-exploration]');if(detail&&exploration)detail.innerHTML=exploration.panel(options);
  const clock=rootElement.querySelector('.cc-map-readout>div>strong');if(clock)clock.textContent=options.game.hour===item.hour?item.time:hour;
  if(!record.network)return;
  const m=model(record.options,record.network);fallback(record,m);if(record.map)paint(record,m);
  const indicators=rootElement.querySelector('.cc-map-dashboard .cc-metrics');if(indicators)indicators.outerHTML=metrics(m,m.language,Boolean(options.game.actionId));
  const explanation=rootElement.querySelector('.cc-map-explanation');if(explanation)explanation.textContent=m.after.critical?words[m.language].help:words[m.language].zero;
 }
 window.PREDICTTODO_CONTROL=Object.freeze({render,renderInto,release,update,state,model,hotspotPositions,streetValue,words,insight,notice,displayOnly,focusCorridor});
})();
