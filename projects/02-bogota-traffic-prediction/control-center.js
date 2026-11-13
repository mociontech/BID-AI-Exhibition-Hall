/* PredictToDo control desk and TV map wall. Street geometry is OSM; traffic is simulated. */
(function(){
 const root='/projects/02-bogota-traffic-prediction/';
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Outline icons replace the GAME_DATA emojis on screen; the emoji stays as a fallback.
 const icon=(kind,id,fallback,className)=>window.PREDICTTODO_ICONS?.[kind]?.(id,className)??esc(fallback);
 const colors=['#28c98b','#f6cb42','#ff8b38','#ff304f'];
 const words={
  "es": {
    "title": "Tu panel de control",
    "wall": "Bogotá · Simulación de movilidad",
    "home": "Inicio",
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
    "actionHint": "Selecciona una opción y mira su efecto en el mapa.",
    "review": "Tomar una decisión",
    "nextStep": "Pulsa «Tomar una decisión» para elegir qué hacer en este caso.",
    "apply": "Confirmar acción",
    "retry": "Probar otra opción",
    "other": "Cambiar de caso",
    "finish": "Ver resultados",
    "score": "Puntaje",
    "play": "Reproducir el día",
    "pause": "Pausar",
    "error": "No se pudieron cargar las calles. Recarga para intentarlo de nuevo.",
    "hour": "Hora de la simulación",
    "timeTitle": "3. Explora el tráfico a lo largo del día",
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
    "selectedHint": "Compara el mapa y confirma.",
    "chooseFirst": "Primero elige una acción",
    "actionTitle": "¿Qué medida considerarías?",
    "resultTitle": "Puntaje",
    "good": "¡Buena elección!",
    "partial": "Decisión con oportunidades",
    "bars": "Comparación de alternativas",
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
    "home": "Home",
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
    "actionHint": "Choose an option and watch its effect on the map.",
    "review": "Make a decision",
    "nextStep": "Press “Make a decision” to choose what to do in this case.",
    "apply": "Confirm action",
    "retry": "Try another option",
    "other": "Change case",
    "finish": "View results",
    "score": "Score",
    "play": "Play the day",
    "pause": "Pause",
    "error": "The streets could not be loaded. Reload to try again.",
    "hour": "Simulation time",
    "timeTitle": "3. Explore traffic throughout the day",
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
    "selectedHint": "Compare the map, then confirm.",
    "chooseFirst": "Choose an action first",
    "actionTitle": "Which action would you consider?",
    "resultTitle": "Score",
    "good": "Good choice!",
    "partial": "Room for improvement",
    "bars": "Comparison of alternatives",
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

 const sceneFor=(network,id)=>network.scenes[id]||network.scenes.cali_peak;
 const level=value=>value>=82?3:value>=65?2:value>=42?1:0;
 function state(data,game,actionId=game.actionId){
  const item=data.scenarios[game.scenarioIndex]||data.scenarios[0];
  const curve=hour=>hour>=16&&hour<=20?14:hour>=7&&hour<=9?10:hour>=21?0:-13;
  const detail=hour=>(hour%3)*2;
  const hour=Number.isFinite(game.hour)?game.hour:item.hour;
  // Whole hours keep their values; in-between times interpolate so the clock can run continuously.
  const at=h=>curve(h)+detail(h),h0=Math.floor(hour),frac=hour-h0;
  const now=frac?at(h0)*(1-frac)+at(Math.min(23,h0+1))*frac:at(h0);
  const shift=Math.round(now-at(item.hour));
  const effect=item.effects[actionId]||{congestion:0,speed:0,critical:0};
  return {congestion:Math.max(10,Math.min(96,item.baseline.congestion+shift+effect.congestion)),speed:Math.max(0,item.baseline.speed+effect.speed),critical:Math.max(0,item.baseline.critical+effect.critical)};
 }
 // 15.25 → "15:15". A case's own hour keeps its published time ("16:40").
 function clock(hour,item){
  if(item&&hour===item.hour)return item.time;
  const h=Math.floor(hour),m=Math.round((hour-h)*60);
  return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');
 }
 // Night tint for the map: 0 at midday, strongest after dusk. Presentation only; traffic colors stay.
 function night(hour){
  if(hour<=6)return .45;if(hour<9)return .45*(9-hour)/3;if(hour<=16)return 0;if(hour<=20)return .4*(hour-16)/4;return Math.min(.55,.4+(hour-20)*.05);
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
 // House outline of the Home pill in the November 2026 main menu (18 x 16 at 1920 x 1080).
 const homeMark='<svg viewBox="0 0 18 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M.6 6.8 9 .6l8.4 6.2M2.6 5.4v10h12.8v-10M7.2 15.4v-4.8h3.6v4.8"/></svg>';
 function header(options){
  const {readonly}=options,lang=languageOf(options.language),c=words[lang];
  // November 2026: the TV bar carries the brand only; the tablet bar adds just the Home pill (English only, no ES/EN).
  // Home leaves the station like the Home pill of the main menu. Back lives in each panel.
  const controls=readonly?'':`<button type="button" class="cc-header-button" data-action="home">${homeMark}<span>${c.home}</span></button>`;
  return `<header class="cc-header"><div class="cc-brand"><img src="${root}predicttodoImages/idb-group-white.svg" alt="IDB Group"><span></span><div><strong>AI in Action</strong><small>IDB Group Projects Across the Region</small></div></div>${controls}</header>`;
 }
 // Lower congestion and fewer hotspots are better; higher speed is better. Equal values stay neutral.
 // Arrow drawn in Figma (Group 2147213176); falls back to text when the icon set is missing.
 const arrow=()=>window.PREDICTTODO_ICONS?.glyph?.('arrow')||'→';
 function trend(key,before,after){
  if(before===after)return '';
  return (key==='speed'?after>before:after<before)?'is-better':'is-worse';
 }
 function metrics(m,language,compare=false){
  const c=words[language],rows=[['congestion',c.traffic,'%'],['speed',c.speed,' km/h'],['critical',c.hotspots,'']];
  // Before and after share one size and unit scale; only the after value takes the brand green/red.
  return `<div class="cc-metrics">${rows.map(([key,label,unit])=>{const shift=compare?trend(key,m.before[key],m.after[key]):'';return `<div data-cc-metric="${key}"><span>${label}</span><strong>${compare?`<del>${m.before[key]}<small>${unit}</small></del><i aria-hidden="true">${arrow()}</i>`:''}<b${shift?` class="${shift}"`:''}>${m.after[key]}<small>${unit}</small></b></strong></div>`;}).join('')}</div>`;
 }
 // Sun by day, moon by night, next to every clock.
 function skyMark(hour){const icons=window.PREDICTTODO_ICONS;return icons?`<span class="cc-sky-mark" aria-hidden="true">${icons.svg(hour>=18.5||hour<6?'moon':'sun')}</span>`:'';}
 function mapView(options,m){
  const lang=languageOf(options.language),c=words[lang],game=options.game;
  const zoom=options.readonly?'':`<nav class="cc-map-tools" aria-label="${c.map}"><button type="button" data-cc-zoom="1" disabled aria-label="${lang==='es'?'Acercar':'Zoom in'}">+</button><button type="button" data-cc-zoom="-1" disabled aria-label="${lang==='es'?'Alejar':'Zoom out'}">−</button><button type="button" data-cc-home disabled aria-label="${c.route}">⌖</button></nav>`;
  const time=clock(game.hour,m.item);
  const explore=window.PREDICTTODO_EXPLORATION;
  // Time bar: title, big clock, play + speed, case markers over a dawn-to-night band, quarter-hour slider.
  const timebar=options.readonly||game.phase!=='explore'?'':`<section class="cc-time-options cc-time-options--visible cc-time-options--chart" aria-label="${c.hour}"><div class="cc-timebar"><div class="cc-time-copy"><h3 id="cc-time-hint">${c.timeTitle}</h3></div><nav class="cc-play-rates" aria-label="${lang==='es'?'Velocidad de reproducción':'Playback speed'}">${(lang==='es'?['Lento','Normal','Rápido']:['Slow','Normal','Fast']).map((label,i)=>`<button type="button" data-play-rate="${[1800,1000,500][i]}" aria-pressed="${i===1}">${label}</button>`).join('')}</nav><button type="button" class="cc-play-button" data-action="toggle-day" data-cc-play>▶ ${c.play}</button><strong class="cc-time-clock" aria-label="${c.hour}">${skyMark(game.hour)}<span data-cc-clock>${time}</span></strong><div class="cc-timeline-chart">${explore?explore.chart(options.data,{...game,language:lang},explore.selected(m.item,game.selectedCorridor),true):''}</div><div class="cc-time-track"><i class="cc-time-sky" aria-hidden="true"></i><input id="cc-hour" type="range" min="6" max="23" step="0.25" value="${game.hour}" style="--cc-progress:${(game.hour-6)/17*100}%" data-hour aria-label="${c.hour}" aria-describedby="cc-time-hint"></div><div class="cc-time-ticks"><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div></div></section>`;
  // Indicators are tablet controls; the TV gives that height to the map.
  const indicators=options.readonly?'':`<section class="cc-map-dashboard" aria-label="${lang==='es'?'Indicadores de tráfico simulado':'Simulated traffic indicators'}"><div class="cc-dashboard-caption"><b>${lang==='es'?'Indicadores <span>del caso</span>':'Case <span>indicators</span>'}</b><span>${game.actionId?c.before+' → '+c.after:lang==='es'?'Sin tu acción':'Without your action'}</span></div>${metrics(m,lang,Boolean(game.actionId))}</section>`;
  const city=options.readonly?'':`<button type="button" class="cc-map-city-button" data-cc-city disabled><span aria-hidden="true">⌖</span> ${lang==='es'?'Ver Bogotá':'View Bogotá'}</button>`;
  // Tablet: the indicators header and the map share one bordered card (Figma 177:22821).
  return `<section class="cc-map-panel" aria-label="${c.map}">${options.readonly?'':'<div class="cc-map-card">'}${indicators}<div class="cc-map-frame" data-cc-preview="${Boolean(game.actionId)}" style="--cc-night:${night(game.hour).toFixed(3)}"><div class="cc-map-readout"><div><small>${c.now}</small><strong>${skyMark(game.hour)}<span data-cc-clock>${time}</span></strong></div>${options.readonly?`<span><b class="cc-city-label">Bogotá, Colombia</b>${game.phase==='result'?c.applied:game.actionId?c.preview:c.roads}</span>`:`<span class="cc-map-mode">${game.phase==='result'?c.applied:game.actionId?c.preview:''}</span>`}</div><div class="cc-geography" data-cc-geography><svg class="cc-map-fallback" viewBox="0 0 1000 650" role="img" aria-label="${c.map}"></svg><div class="cc-map-live" aria-label="${c.map}"></div><p class="cc-map-status">${c.loading}</p></div><div class="cc-map-sky" aria-hidden="true"></div>${zoom}${city}</div>${options.readonly?'':'</div>'}<div class="cc-map-legend">${[c.normal,c.busy,c.dense,c.critical].map((text,i)=>`<span><i style="background:${colors[i]}"></i>${text}</span>`).join('')}<small class="cc-map-note">${c.simulation}${options.readonly?'':' · '+c.hint}</small></div>${timebar}</section>`;
 }
 function events(options,m){
  const {data,game}=options,lang=m.language,c=words[lang];
  // Short and indicative: a title, four cards, the comparison, one primary button.
  const label=i=>Object.hasOwn(game.results||{},i)?c.done:'';
  return `<h2>${c.events}</h2><div class="cc-events">${data.scenarios.map((item,i)=>`<button type="button" data-scenario="${i}" aria-pressed="${game.scenarioIndex===i}" class="${game.scenarioIndex===i?'is-active':''}"><span aria-hidden="true">${icon('scenario',item.id,item.icon)}</span><div><b>${esc(caseCopy[lang][i][0])}</b><small>${esc(caseCopy[lang][i][1])} · ${item.time}</small>${label(i)?`<em>${label(i)}</em>`:''}</div></button>`).join('')}</div><div data-cc-exploration>${window.PREDICTTODO_EXPLORATION?.panel(options)||''}</div><footer class="cc-panel-actions cc-explore-next">${Object.keys(game.results||{}).length?`<button type="button" class="cc-secondary cc-results-button" data-action="finish-session">${c.finish}</button>`:''}<button type="button" class="cc-secondary" data-action="back-player">${c.back}</button><button type="button" class="cc-primary" data-action="to-decision">${c.review} →</button></footer>`;
 }
 function actions(options,m){
  const {data,game}=options,lang=m.language,c=words[lang];
  return `<p class="cc-case-tag">${esc(caseCopy[lang][game.scenarioIndex][0])} · ${m.item.time}</p><h2>${c.actionTitle}</h2><p class="cc-instruction" role="status">${game.actionId?c.selectedHint:c.actionHint}</p><div class="cc-actions">${data.actions.map(action=>`<button type="button" data-action-choice="${action.id}" aria-pressed="${game.actionId===action.id}" class="${game.actionId===action.id?'is-selected':''}"><span aria-hidden="true">${icon('action',action.id,action.icon)}</span><b>${esc(action[lang])}</b><small>${esc(action['description_'+lang])}</small></button>`).join('')}</div><footer class="cc-panel-actions"><button type="button" class="cc-secondary" data-action="to-explore">${c.back}</button><button type="button" class="cc-primary" data-action="confirm-decision" ${game.actionId?'':'disabled'}>${game.actionId?c.apply:c.chooseFirst} →</button></footer>`;
 }
 function result(options,m){
  const {game,data}=options,lang=m.language,c=words[lang];
  const score=game.results?.[game.scenarioIndex]??window.PULSE_VIAL.roleScore(data,game,m.item,game.actionId);
  const action=data.actions.find(a=>a.id===game.actionId);
  return `<p class="cc-case-tag">${esc(caseCopy[lang][game.scenarioIndex][0])} · ${m.item.time}</p><h2>${score>=85?c.good:c.partial}</h2><div class="cc-result-score"><strong>${score}<small>/100</small></strong><span>${c.score}</span></div><footer class="cc-panel-actions cc-result-actions"><button type="button" class="cc-secondary" data-action="retry">${c.retry}</button><button type="button" class="cc-secondary" data-action="choose-event">${c.other}</button><button type="button" class="cc-primary cc-results-button" data-action="finish-session">${c.finish} &#8594;</button></footer>`;
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
 function insight(options){
  const {data,game}=options,lang=languageOf(options.language),es=lang==='es';
  const item=data.scenarios[game.scenarioIndex]||data.scenarios[0],person=data.characters.find(p=>p.id===game.playerId)||data.characters[0];
  // One idea, one short line: the TV is read from a distance.
  // One idea per card, written to be read from a distance: a short title and one plain line.
  const actionInsights=es?{
   signals:['Semáforos a tiempo','Más luz verde donde hace falta.'],
   reversible:['Carril reversible','Más carriles hacia donde va el tráfico.'],
   agents:['Agentes en vía','Personas ordenando los cruces.'],
   monitor:['Seguir observando','A veces lo mejor es esperar.']
  }:{
   signals:['Lights on time','More green light where it is needed.'],
   reversible:['Reversible lane','More lanes where the traffic goes.'],
   agents:['Officers on site','People managing the junctions.'],
   monitor:['Keep watching','Sometimes the best move is to wait.']
  };
  const caseInsights=es?[['Mucho tráfico, un solo sentido','La IA anticipa dónde se congestionará la avenida.'],['Hay partido','Antes del pitazo, la IA ya ve los accesos llenos.'],['Todos salen a la vez','El pronóstico avisa qué cruces se bloquearán.'],['Noche tranquila','A veces el mejor dato es que no pasa nada.']]:[['Heavy traffic, one direction','AI predicts where the avenue will get congested.'],['Match day','Before kickoff, AI already sees the access roads filling.'],['Everyone leaves at once','The forecast shows which junctions will lock up.'],['Quiet night','Sometimes the best data says nothing is wrong.']];
  let pair;
  if(game.phase==='intro')pair=es?['La IA informa. Tú decides.','Explora, elige un caso y prueba una medida.']:['AI informs. You decide.','Explore, pick a case and try a response.'];
  else if(game.phase==='player')pair=[es?'Cada rol aporta una mirada':'Every role brings a perspective',person['focus_'+lang]];
  else if(game.phase==='explore')pair=caseInsights[game.scenarioIndex]||caseInsights[0];
  else if(game.phase==='decision')pair=game.actionId?actionInsights[game.actionId]:[es?'Tú decides':'You decide',es?'La IA avisa antes; la medida la eliges tú.':'AI warns early; you choose the response.'];
  else if(game.phase==='result')pair=[es?'Lo que enseña este caso':'What this case teaches',(es?['Si todo va en un sentido, dar más espacio funciona mejor.','Los eventos localizados piden gente en la calle.','Si varias vías sufren a la vez, sincronizar cruces protege la red.','Anticipar también es saber cuándo no intervenir.']:['When traffic flows one way, more space works best.','Local events call for people on the street.','When several roads suffer at once, synced lights protect the network.','Forecasting also tells you when not to act.'])[game.scenarioIndex]||item['lesson_'+lang]];
  else pair=es?['La IA anticipa. Las personas deciden.','Un pronóstico da tiempo para prepararse.']:['AI anticipates. People decide.','A forecast buys time to prepare.'];
  const mark=window.PREDICTTODO_ICONS?.svg('bulb')||'';
  return `<article class="cc-insight" data-insight="${esc(game.phase+'-'+(game.actionId||game.scenarioIndex))}">${mark?`<span class="cc-insight-icon" aria-hidden="true">${mark}</span>`:''}<div><p>${es?'DATO CLAVE':'KEY FACT'}</p><h3>${esc(pair[0])}</h3><span>${esc(pair[1])}</span></div></article>`;
 }
 // Tablet-only guide shown once on entering the panel: three steps, one line each.
 const guideCopy={
  es:{kicker:'PREDICTTODO · PANEL DE CONTROL',title:'Cómo <span>usar el panel</span>',steps:[['Elige un caso','Toca una de las cuatro tarjetas'],['Explora','Mueve la hora y toca una vía'],['Decide','Prueba una medida y confirma']],foot:'Lo que hagas aquí se ve en la pantalla grande.',cta:'Empezar',close:'Cerrar'},
  en:{kicker:'PREDICTTODO · CONTROL PANEL',title:'How to <span>use the panel</span>',steps:[['Pick a case','Tap one of the four cards'],['Explore','Move the clock, tap a road'],['Decide','Try a response and confirm']],foot:'What you do here shows on the big screen.',cta:'Start',close:'Close'}
 };
 function guide(language){
  const g=guideCopy[languageOf(language)],marks=['pin','sliders','badge'];
  const svg=name=>window.PREDICTTODO_ICONS?.svg(name)||'';
  return `<div class="cc-guide" data-cc-guide role="dialog" aria-modal="true" aria-labelledby="cc-guide-title"><div class="cc-guide-card"><button type="button" class="cc-guide-x" data-action="close-guide" aria-label="${g.close}">✕</button><p class="ptd-story-kicker">${g.kicker}</p><h2 id="cc-guide-title">${g.title}</h2><ol class="cc-guide-list">${g.steps.map(([title,hint],i)=>`<li><span aria-hidden="true">${svg(marks[i])}</span><b>${esc(title)}</b><small>${esc(hint)}</small></li>`).join('')}</ol><p class="cc-guide-foot">${svg('monitor')}${esc(g.foot)}</p><div class="cc-guide-actions"><button type="button" class="cc-primary" data-action="close-guide">${g.cta} →</button></div></div></div>`;
 }
 function displayOnly(html){
  return html.replace(/<(button|input)\b([^>]*)>/g,(_,tag,attributes)=>`<${tag}${attributes.replace(/\sdisabled\b/g,'')} disabled tabindex="-1" aria-disabled="true">`);
 }
 function displayContext(options,m){
  // TV panel kept to the minimum: which case, what the tablet is doing, one forecast figure, one idea.
  const {game,data}=options,lang=m.language,es=lang==='es',copy=caseCopy[lang][game.scenarioIndex];
  const chosen=data.actions.find(a=>a.id===game.actionId),road=window.PREDICTTODO_EXPLORATION.selection(options);
  const stage=game.phase==='explore'?(es?'EXPLORANDO':'EXPLORING'):game.phase==='decision'?(es?'PROBANDO UNA MEDIDA':'TESTING A RESPONSE'):(es?'RESULTADO':'RESULT');
  const score=game.results?.[game.scenarioIndex]??(game.phase==='result'?window.PULSE_VIAL.roleScore(data,game,m.item,game.actionId):null);
  // Explore: the road being explored, now and in 30 minutes, with its day profile.
  // The chart fills the card: the current hour is marked with a dot placed on the curve (same scale as the SVG: y = 92 - v·0.75 of 108).
  const dot={x:(game.hour-6)/17*100,y:(92-road.now.congestion*.75)/108*100};
  const corridor=game.phase==='explore'?`<section class="cc-tv-corridor" style="--road-color:${road.color}"><p>${es?'VÍA':'ROAD'}</p><h3>${esc(road.name)}</h3><div><span>${es?'Ahora':'Now'}<b>${road.now.congestion}%</b></span><span>${es?'En 30 min':'In 30 min'}<b>${road.future.congestion}%</b></span></div><div class="cc-tv-road-profile">${window.PREDICTTODO_EXPLORATION.chart(data,game,road.id)}<i class="cc-chart-dot" style="left:${dot.x.toFixed(2)}%;top:${dot.y.toFixed(2)}%" aria-hidden="true"></i></div><div class="cc-chart-hours" aria-hidden="true"><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div></section>`:'';
  // Decision/result: the chosen response and its effect on congestion and hotspots.
  const delta=chosen&&game.phase!=='result'?`<div class="cc-tv-delta">${[['congestion',words[lang].traffic,'%'],['critical',words[lang].hotspots,'']].map(([key,label,unit])=>{const shift=trend(key,m.before[key],m.after[key]),u=unit?`<em>${unit}</em>`:'';return `<span><small>${label}</small><b>${m.before[key]}${u}<i aria-hidden="true">${arrow()}</i><span class="cc-after${shift?' '+shift:''}">${m.after[key]}${u}</span></b></span>`;}).join('')}</div>`:'';
  const response=chosen&&game.phase!=='result'?`<div class="cc-tv-response"><small>${es?'MEDIDA ELEGIDA':'CHOSEN RESPONSE'}</small><strong>${icon('action',chosen.id,chosen.icon,'ptd-icon--inline')} ${esc(chosen[lang])}</strong>${game.phase==='result'?`<b>${score}<small>/100</small></b>`:''}${delta}</div>`:'';
  // Result: how every response would have scored.
  const compare=game.phase==='result'&&chosen?`<section class="cc-tv-compare cc-tv-compare--result"><div class="cc-tv-score"><small>${es?'TU MEDIDA':'YOUR RESPONSE'}</small><b>${score}<small>/100</small></b></div><div>${data.actions.map(action=>{const points=window.PULSE_VIAL.roleScore(data,game,m.item,action.id);return `<div class="${action.id===chosen.id?'is-choice':''}"><span>${icon('action',action.id,action.icon,'ptd-icon--inline')} ${esc(action[lang])}</span><b>${points}</b><i><em style="width:${points}%"></em></i></div>`;}).join('')}</div></section>`:'';
  // Kicker over the title, icon beside it (Figma 774:52199); the place name never breaks across lines.
  const title=esc(m.item['title_'+lang]),place=esc(copy[1]);
  // Result: the TV invites to compare the four responses (Figma 774:52702) instead of repeating the case name.
  const heading=game.phase==='result'?(es?'Compara qué lograría <span class="cc-accent">cada medida</span>':'Compare what the <span class="cc-accent">different actions could do</span>'):title.replace(place,`<span class="cc-nowrap">${place}</span>`);
  return `<section class="cc-tv-context" data-observed-case="${game.scenarioIndex}" data-observed-action="${esc(chosen?.id||'')}"><div class="cc-tv-case-heading"><span aria-hidden="true">${icon('scenario',m.item.id,m.item.icon)}</span><div><p class="cc-kicker">${stage}</p><h2>${heading}</h2></div></div>${response}${corridor}${compare}</section>`;
 }
 function notice(options){
  const {game}=options,lang=languageOf(options.language),es=lang==='es',t=teachingCopy[lang];
  const prompt=game.phase==='intro'?(es?'Pulsa «Elegir mi rol» para empezar.':'Press “Choose my role” to begin.'):
   game.phase==='player'?(es?'Elige tu rol y pulsa «Empezar turno».':'Choose your role and press “Start shift”.'):
   game.phase==='final'?(es?'Pulsa «Continuar» en la tableta para ver el ranking y los QR.':'Press “Continue” on the tablet to see the leaderboard and QR codes.'):
   game.phase==='explore'?(es?'Mueve la hora o toca una vía en la tableta para explorar.':'Move the clock or tap a road on the tablet to explore.'):game.phase==='result'?t.ctaResult:game.actionId?t.ctaPreview:t.ctaDecision;
  // One-line pill (Figma 177:22367): a small screen icon and the instruction, no kicker or arrow.
  return `<footer class="cc-notice" role="status"><span class="cc-notice-icon" aria-hidden="true">${window.PREDICTTODO_ICONS?.glyph?.('screen')||''}</span><strong>${esc(prompt)}</strong></footer>`;
 }
 function render(options){
  const fallbackItem=options.data.scenarios[options.game.scenarioIndex]||options.data.scenarios[0];
  options={...options,game:{playerId:'valentina',hour:fallbackItem.hour,results:{},...options.game}};
  const {game,data,readonly=false}=options,lang=languageOf(options.language),c=words[lang];
  const item=data.scenarios[game.scenarioIndex]||data.scenarios[0];
  const m={item,language:lang,before:state(data,game,null),after:state(data,game,game.actionId)};
  const current=['explore','decision','result'].indexOf(game.phase);
  const tabs=`<ol class="cc-steps" aria-label="${c.title}">${[c.stepCase,c.stepAction,c.stepResult].map((label,i)=>`<li ${i===current?'aria-current="step"':i<current?'class="is-done"':''}><span>${i+1}</span>${label}</li>`).join('')}</ol>`;
  const panel=game.phase==='explore'?events(options,m):game.phase==='decision'?actions(options,m):result(options,m);
  const footerAt=panel.lastIndexOf('<footer class="cc-panel-actions');
  const content=footerAt<0?panel:panel.slice(0,footerAt),footer=footerAt<0?'':panel.slice(footerAt);
  const map=mapView({...options,readonly},m);
  return `<main class="ptd-game cc-app ${readonly?'cc-app--tv cc-app--mirror cc-observer':''}" data-phase="${game.phase}" lang="${lang}">${header(options)}<div class="cc-layout"><aside class="cc-side">${tabs}<div class="cc-side-content">${readonly?displayContext(options,m):content}${readonly&&game.phase!=='result'?insight(options):''}</div>${readonly?'':footer}</aside>${map}</div>${readonly?notice(options):''}</main>`;
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
  // Only the clock moved (day playback): refresh clock, tint, panel figures and road paint; keep the map alive.
  const hourless=game=>JSON.stringify({...game,mapView:null,mapPopup:null,hour:null});
  if(options.readonly&&previous?.ready&&previous.options.readonly&&previous.options.language===options.language&&hourless(previous.options.game)===hourless(options.game)){
   update(rootElement,options);
   const side=rootElement.querySelector('.cc-side-content');
   if(side){const item=options.data.scenarios[options.game.scenarioIndex]||options.data.scenarios[0];side.innerHTML=displayContext(options,{item,language:languageOf(options.language),before:state(options.data,options.game,null),after:state(options.data,options.game,options.game.actionId)})+(options.game.phase==='result'?'':insight(options));}
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
   const city=rootElement.querySelector('[data-cc-city]');if(city){city.disabled=Boolean(options.readonly)||!record.map;city.onclick=()=>window.PREDICTTODO_STREET_MAP.fitCity(record,model(record.options,network));}
  }).catch(()=>{if(node.isConnected){node.querySelector('.cc-map-status').textContent=words[languageOf(options.language)].error;networkPromise=null;}});
 }
 function update(rootElement,options){
  const record=rootElement.querySelector('[data-cc-geography]')?._ccRecord;if(!record)return;
  record.options={...record.options,...options};
  const item=options.data.scenarios[options.game.scenarioIndex],time=clock(options.game.hour,item);
  rootElement.querySelectorAll('[data-cc-clock]').forEach(node=>{node.textContent=time;});
  rootElement.querySelectorAll('.cc-sky-mark').forEach(node=>{node.outerHTML=skyMark(options.game.hour);});
  const frame=rootElement.querySelector('.cc-map-frame');if(frame)frame.style.setProperty('--cc-night',night(options.game.hour).toFixed(3));
  const slider=rootElement.querySelector('[data-hour]');if(slider){slider.style.setProperty('--cc-progress',((options.game.hour-6)/17*100)+'%');if(Number(slider.value)!==options.game.hour)slider.value=options.game.hour;}
  const exploration=window.PREDICTTODO_EXPLORATION;
  const graph=rootElement.querySelector('.cc-timeline-chart');if(graph&&exploration)graph.innerHTML=exploration.chart(options.data,{...options.game,language:options.language},exploration.selected(item,options.game.selectedCorridor),true);
  const detail=rootElement.querySelector('[data-cc-exploration]');if(detail&&exploration)detail.innerHTML=exploration.panel(options);
  if(!record.network)return;
  const m=model(record.options,record.network);fallback(record,m);if(record.map)paint(record,m);
  const indicators=rootElement.querySelector('.cc-map-dashboard .cc-metrics');if(indicators)indicators.outerHTML=metrics(m,m.language,Boolean(options.game.actionId));
 }
 window.PREDICTTODO_CONTROL=Object.freeze({render,renderInto,release,update,state,model,clock,night,hotspotPositions,streetValue,words,insight,notice,guide,displayOnly,focusCorridor});
})();
