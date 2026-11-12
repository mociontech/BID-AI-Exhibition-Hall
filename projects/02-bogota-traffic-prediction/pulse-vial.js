/* Shared visual language for the PredictToDo educational simulation.
   The tablet enables the controls; the main display renders the same state read-only. */
(function(){
 const words={
  es:{center:'Centro de control de movilidad',intro:'Por un día, tú decides cómo se mueve la ciudad.',play:'Jugar',next:'Siguiente',back:'Atrás',start:'Empezar turno',name:'Tu nombre',nameHint:'Ej.: Daniela',chooseRole:'Elige tu rol',roleHint:'Cada rol aporta una mirada distinta a la decisión.',explore:'Explora',decide:'Decide',map:'Mapa predictivo',timeline:'Hora del día',missions:'Centro de control',missionHint:'Selecciona un evento para revisar la predicción y decidir.',resolved:'Resuelto',active:'En revisión',available:'Disponible',goDecision:'Revisar decisión',returnMap:'Volver al centro de control',scenario:'Situación detectada',apply:'Aplicar decisión',chooseAction:'Elige una acción para previsualizar su impacto.',impact:'Impacto simulado',congestion:'Congestión',speed:'Velocidad estimada',critical:'Puntos críticos',resources:'Recursos disponibles',agents:'Agentes',lanes:'Reversibles',score:'Puntaje',bonus:'Conocimiento del rol',lesson:'Lo que aprendemos',retry:'Cambiar decisión',nextScenario:'Siguiente escenario',finish:'Ver resultado final',final:'Turno completado',restart:'Jugar de nuevo',of:'de',simulation:'Simulación educativa',live:'Datos simulados · No son recomendaciones operativas',traffic:'Tráfico',normal:'Normal',busy:'Cargado',dense:'Denso',criticalState:'Crítico',profile:'Operador/a',role:'Rol',choose:'Seleccionar',confirm:'Confirmar',day:'Un día de decisiones',items:['Explora el mapa. Mueve el reloj y mira cómo cambia el tráfico durante el día.','Entra al centro de control. Analiza cuatro momentos y decide qué hacer.','Observa el impacto. Cada decisión compara congestión, velocidad y puntos críticos.','Aprende del resultado. El puntaje es una conversación sobre el porqué de la decisión.']},
  en:{center:'Mobility control center',intro:'For one day, you decide how the city moves.',play:'Play',next:'Next',back:'Back',start:'Start shift',name:'Your name',nameHint:'E.g. Daniela',chooseRole:'Choose your role',roleHint:'Each role brings a different lens to the decision.',explore:'Explore',decide:'Decide',map:'Predictive map',timeline:'Time of day',missions:'Control center',missionHint:'Select an event to review the forecast and decide.',resolved:'Resolved',active:'Under review',available:'Available',goDecision:'Review decision',returnMap:'Return to control center',scenario:'Detected situation',apply:'Apply decision',chooseAction:'Choose an action to preview its impact.',impact:'Simulated impact',congestion:'Congestion',speed:'Estimated speed',critical:'Critical points',resources:'Available resources',agents:'Agents',lanes:'Reversible lanes',score:'Score',bonus:'Role insight',lesson:'What we learn',retry:'Change decision',nextScenario:'Next scenario',finish:'View final result',final:'Shift completed',restart:'Play again',of:'of',simulation:'Educational simulation',live:'Simulated data · Not operational recommendations',traffic:'Traffic',normal:'Normal',busy:'Busy',dense:'Dense',criticalState:'Critical',profile:'Operator',role:'Role',choose:'Select',confirm:'Confirm',day:'A day of decisions',items:['Explore the map. Move the clock and see how traffic changes during the day.','Enter the control center. Review four moments and decide what to do.','Observe the impact. Each decision compares congestion, speed and critical points.','Learn from the result. The score starts a conversation about why a choice works.']}
 };
 const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
 // Outline icons replace the GAME_DATA emojis on screen; the emoji stays as a fallback.
 const icon=(kind,id,fallback,className)=>window.PREDICTTODO_ICONS?.[kind]?.(id,className)??esc(fallback);
 const t=language=>words[language==='es'?'es':'en'];
 const total=game=>Object.values(game.results||{}).reduce((sum,value)=>sum+Number(value||0),0);
 const playedCount=game=>Object.keys(game.results||{}).length;
 const freeCopy=language=>language==='es'
  ? {menu:'Menú',replay:'Jugado · volver a jugar',chooseEvent:'Elegir otro evento',finishNow:'Ver resultados',continue:'Volver al mapa',completed:'Casos jugados'}
  : {menu:'Menu',replay:'Played · play again',chooseEvent:'Choose another event',finishNow:'View results',continue:'Back to map',completed:'Cases played'};
 const player=(data,game)=>data.characters.find(item=>item.id===game.playerId)||data.characters[0];
 const scenario=(data,game)=>data.scenarios[game.scenarioIndex]||data.scenarios[0];
 const action=(data,id)=>data.actions.find(item=>item.id===id);
 function roleScore(data,game,scenarioItem,actionId){const person=player(data,game);const base=scenarioItem.scores[actionId]||0;const bonus=person?.bonus?.action===actionId?person.bonus.points:0;return Math.min(100,base+bonus);}
 function roleBonus(data,game,actionId){const person=player(data,game);return person?.bonus?.action===actionId?person.bonus.points:0;}
 function stateForHour(hour,base,referenceHour=16){const curve=value=>(value>=16&&value<=20)?14:(value>=7&&value<=9)?10:(value>=21?0:-13);const detail=value=>(value%3)*2;return Math.max(10,Math.min(96,(base||55)+(curve(hour)+detail(hour))-(curve(referenceHour)+detail(referenceHour))));}
 function level(value,copy){if(value>=82)return copy.criticalState;if(value>=65)return copy.dense;if(value>=42)return copy.busy;return copy.normal;}
 function mapSvg(congestion,scenarioItem,copy){const risk=congestion>=80?'critical':congestion>=62?'dense':congestion>=42?'busy':'normal';return `<svg class="pulse-city-map" viewBox="0 0 760 520" role="img" aria-label="${copy.map}"><defs><linearGradient id="pulse-water" x1="0" x2="1"><stop stop-color="#0a3e66"/><stop offset="1" stop-color="#092b4b"/></linearGradient><filter id="pulse-glow"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="760" height="520" rx="28" fill="url(#pulse-water)"/><path class="pulse-river" d="M70 0C135 110 78 179 130 272S91 422 32 520"/><path class="pulse-road pulse-road--a ${risk}" d="M171 66L190 442"/><path class="pulse-road pulse-road--b ${risk}" d="M290 42L308 470"/><path class="pulse-road pulse-road--c ${risk}" d="M438 52L414 456"/><path class="pulse-road pulse-road--d ${risk}" d="M559 84L525 438"/><path class="pulse-road pulse-road--e ${risk}" d="M107 163C258 151 431 186 665 146"/><path class="pulse-road pulse-road--f ${risk}" d="M95 280C260 261 421 293 674 270"/><path class="pulse-road pulse-road--g ${risk}" d="M118 393C270 354 431 379 631 421"/><path class="pulse-link" d="M190 163L308 280L414 146L525 270M190 280L308 163L414 393L525 270"/><g class="pulse-map-labels"><text x="118" y="150">Calle 80</text><text x="464" y="136">Calle 100</text><text x="122" y="269">Av. El Dorado</text><text x="110" y="405">Av. 1° de Mayo</text><text x="196" y="502">Av. Ciudad de Cali</text></g><g filter="url(#pulse-glow)"><circle class="pulse-event-dot" cx="${scenarioItem.id==='cali_peak'?190:scenarioItem.id==='calle100_quiet'?525:414}" cy="${scenarioItem.id==='cali_peak'?280:scenarioItem.id==='calle100_quiet'?146:270}" r="17"/><circle class="pulse-event-core" cx="${scenarioItem.id==='cali_peak'?190:scenarioItem.id==='calle100_quiet'?525:414}" cy="${scenarioItem.id==='cali_peak'?280:scenarioItem.id==='calle100_quiet'?146:270}" r="6"/></g><g class="pulse-map-tag"><rect x="442" y="424" width="246" height="47" rx="12"/><text x="459" y="444">${scenarioItem.icon} ${esc(scenarioItem.time)}</text><text x="459" y="461">${esc(scenarioItem[`zone_${copy===words.en?'en':'es'}`]||scenarioItem.zone_es)}</text></g></svg>`;}
 const homeMark='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/></svg>';
 function header(data,game,language,readonly){
  const copy=t(language),free=freeCopy(language);
  // Figma 177:22367: brand only on the TV; the tablet keeps the ES/EN switch and one Menu (home) button.
  const tools=readonly?'':`<div class="pulse-command-language"><button type="button" data-language="es" aria-pressed="${language==='es'}">ES</button><button type="button" data-language="en" aria-pressed="${language==='en'}">EN</button></div><button type="button" class="pulse-command-exit" data-action="exit-game" aria-label="${free.menu}">${homeMark}<span>${free.menu}</span></button>`;
  return `<header class="pulse-command-header"><div class="pulse-command-brand"><span>●</span><p>${copy.center}</p></div>${tools}</header>`;
 }
 function meter(label,value,unit,kind){return `<div class="pulse-meter" data-meter="${kind}"><span>${label}</span><strong>${value}${unit?`<small class="pulse-meter-unit">${unit}</small>`:''}</strong><i class="pulse-meter-track"><b class="pulse-meter-fill pulse-meter-fill--${kind}" style="width:${Math.max(5,Math.min(100,value))}%"></b></i></div>`;}
 function hud(data,game,language,scenarioItem,preview){const copy=t(language),baseline=scenarioItem.baseline;const effect=preview&&scenarioItem.effects[preview]||{congestion:0,speed:0,critical:0};const congestion=Math.max(0,Math.min(100,stateForHour(game.hour,baseline.congestion,scenarioItem.hour)+effect.congestion));const speed=Math.max(0,baseline.speed+effect.speed);const critical=Math.max(0,baseline.critical+effect.critical);return `<section class="pulse-hud"><div class="pulse-hud-title"><span>${scenarioItem.icon}</span><div><small>${copy.scenario}</small><strong>${esc(scenarioItem[`title_${language}`])}</strong><em>${esc(scenarioItem[`zone_${language}`])}</em></div></div><div class="pulse-hud-meters">${meter(copy.congestion,congestion,'%',congestion>=65?'danger':'good')}${meter(copy.speed,speed,' km/h','speed')}${meter(copy.critical,critical,'','critical')}</div></section>`;}
 function missions(data,game,language){
  const copy=t(language),free=freeCopy(language);
  return `<section class="pulse-missions"><header><div><small>${copy.missions}</small><h2>${copy.day}</h2></div><b>${playedCount(game)}/4</b></header><p>${copy.missionHint}</p><div>${data.scenarios.map((item,index)=>{
   const done=Object.hasOwn(game.results||{},index),active=index===game.scenarioIndex;
   return `<button type="button" class="pulse-mission ${active?'is-active':''} ${done?'is-done':''}" data-scenario="${index}" aria-pressed="${active}"><span>${item.icon}</span><i><b>${esc(item[`title_${language}`])}</b><small>${item.time} · ${done?free.replay:active?copy.active:copy.available}</small></i><em>${done?'↻':'→'}</em></button>`;
  }).join('')}</div></section>`;
 }
 function mapPanel(data,game,language,scenarioItem,preview){const copy=t(language),effect=preview?scenarioItem.effects[preview]:null,traffic=stateForHour(game.hour,scenarioItem.baseline.congestion+(effect?.congestion||0),scenarioItem.hour);return `<section class="pulse-map-panel"><div class="pulse-map-topline"><span>${copy.map}</span><b>${level(traffic,copy)}</b></div>${mapSvg(traffic,scenarioItem,copy)}<div class="pulse-legend"><span><i class="normal"></i>${copy.normal}</span><span><i class="busy"></i>${copy.busy}</span><span><i class="dense"></i>${copy.dense}</span><span><i class="critical"></i>${copy.criticalState}</span></div><label class="pulse-timeline"><span>${copy.timeline}<b>${String(game.hour).padStart(2,'0')}:00</b></span><input type="range" min="6" max="23" value="${game.hour}" data-hour aria-label="${copy.timeline}"><i><em style="left:${((game.hour-6)/17)*100}%"></em></i><small>06:00 <b>12:00</b> <b>18:00</b> 23:00</small></label>${preview?`<div class="pulse-preview-chip">${copy.impact}: ${action(data,preview).icon} ${esc(action(data,preview)[language])}</div>`:''}</section>`;}
 function intro(data,game,language,readonly=false){
  const copy=t(language),es=language==='es';
  const steps=es?['Explora el mapa','Entra al centro de control','Gana puntos','Mira tus resultados']:['Explore the map','Enter the control center','Earn points','View your results'];
  const instructions=es?[
   'Mueve el reloj en la tableta y toca una vía para ver cómo cambian la congestión y la velocidad a lo largo del día.',
   'Elige cualquiera de los cuatro casos. Decide si ajustas semáforos, habilitas un carril reversible, envías agentes o sigues observando.',
   'Cada decisión suma entre 0 y 100 puntos según lo adecuada que sea para ese caso. Compara el resultado de tu acción.',
   'Revisa tu puntaje y compara tus decisiones. Puedes terminar después de un caso, repetir o jugar los demás.'
  ]:[
   'Move the clock on the tablet and tap a road to see how congestion and speed change throughout the day.',
   'Choose any of the four cases. Decide whether to adjust signals, open a reversible lane, send officers or keep watching.',
   'Each decision earns 0 to 100 points based on how well it suits the case. Compare the result of your action.',
   'Review your score and compare your decisions. Finish after one case, try again or play the others.'
  ];
  const title=`<p>${copy.center}</p><h1>${es?'Pulso vial <span>Bogotá</span>':'Bogotá <span>Traffic Pulse</span>'}</h1>`;
  if(!readonly){
   // Tablet opening (Figma 774:48585): kicker, two-tone title, two large buttons and a note; the steps are on the TV.
   return `<main class="pulse-command pulse-command--intro">${header(data,game,language,readonly)}<section class="pulse-intro-card">${title}<div class="ptd-intro-actions"><button type="button" class="pulse-command-secondary" data-action="exit-game">${es?'Volver al menú':'Back to menu'}</button><button type="button" class="pulse-command-primary" data-action="to-player">${es?'Elegir mi rol':'Choose my role'} <span>→</span></button></div></section><p class="ptd-intro-note">${es?'Las instrucciones están en la pantalla':'The instructions are on the screen'}</p></main>`;
  }
  if(window.PREDICTTODO_ICONS){
   // The TV opening is a four-step visual guide: one icon, one title, one short hint each.
   const hints=es?['Mueve la hora y toca una vía','Elige un caso y prueba una medida','Cada decisión suma hasta 100','Compara y aprende']:['Move the clock, tap a road','Pick a case, try a response','Each decision earns up to 100','Compare and learn'];
   const list=`<ol class="ptd-tv-guide-steps">${steps.map((item,index)=>`<li><span class="ptd-guide-icon" aria-hidden="true">${icon('step',index,'')}</span><b>${String(index+1).padStart(2,'0')}</b><div class="ptd-tv-step-copy"><h3>${item}</h3><p>${hints[index]}</p></div></li>`).join('')}</ol>`;
   return `<main class="pulse-command pulse-command--intro">${header(data,game,language,readonly)}<section class="pulse-intro-card ptd-tv-intro-instructions ptd-tv-guide">${title}<h2>${copy.intro}</h2>${list}</section></main>`;
  }
  return `<main class="pulse-command pulse-command--intro">${header(data,game,language,readonly)}<section class="pulse-intro-card ${readonly?'ptd-tv-intro-instructions':''}">${title}<h2>${readonly?copy.intro:es?'Decide dónde actuar.':'Decide where to act.'}</h2><ol>${steps.map((item,index)=>`<li><b>${String(index+1).padStart(2,'0')}</b>${readonly?`<div class="ptd-tv-step-copy"><h3>${item}</h3><p>${instructions[index]}</p></div>`:`<span>${item}</span>`}</li>`).join('')}</ol>${readonly?'':`<button type="button" class="pulse-command-primary" data-action="to-player">${es?'Elegir mi rol':'Choose my role'} <span>→</span></button>`}</section></main>`;
 }
 function playerScreen(data,game,language,readonly){
  const copy=t(language),tv=readonly?window.PREDICTTODO_INSIGHTS:null;
  const roles=data.characters.map(item=>`<${readonly?'div':'button type="button"'} class="pulse-role-card ${item.id===game.playerId?'is-selected':''}" ${readonly?`data-role-mirror="${item.id}"`:`data-role="${item.id}"`}><span>${icon(readonly?'role':'avatar',item.id,item.avatar)}</span><b>${item.name}</b><small>${item[`role_${language}`]}</small><em>${item[`focus_${language}`]}</em><i>${item.bonus.points > 0?`+${item.bonus.points} ${copy.score.toLowerCase()}`:''}</i></${readonly?'div':'button'}>`).join('');
  const heading=`<div><p>${copy.profile}</p><h1>${language==='es'?'¿Quién va a manejar <span>la ciudad hoy?</span>':'Who will manage <span>the city today?</span>'}</h1><span>${copy.roleHint}</span></div>`;
  const nameLabel=language==='es'?'Tu <span class="ptd-accent">nombre</span>':'Your <span class="ptd-accent">name</span>';
  if(tv){
   // The TV shows the chosen role large; the name field and the choice stay on the tablet.
   const person=player(data,game),s=tv.storyCopy[language==='es'?'es':'en'];
   const hero=`<div class="ptd-role-hero"><span class="ptd-role-hero-avatar" aria-hidden="true">${icon('role',person.id,person.avatar)}</span><div><p class="ptd-story-kicker">${s.selectedRole}</p><h2>${esc(person.name)}</h2><p>${esc(person[`role_${language}`])}</p><output class="pulse-name-mirror">${esc(game.playerName)}</output></div></div>`;
   return `<main class="pulse-command">${header(data,game,language,readonly)}<section class="pulse-player-screen ptd-tv-story ptd-tv-story--player"><div class="ptd-story-main">${heading}${hero}<div class="pulse-role-grid ptd-role-chips">${roles}</div></div><aside class="ptd-story-side"></aside></section></main>`;
  }
  return `<main class="pulse-command">${header(data,game,language,readonly)}<section class="pulse-player-screen">${heading}<label>${nameLabel}${readonly?`<output class="pulse-name-mirror">${esc(game.playerName)||copy.nameHint}</output>`:`<input data-name maxlength="40" value="${esc(game.playerName)}" placeholder="${copy.nameHint}">`}</label><div class="pulse-role-grid">${roles}</div><footer>${readonly?`<span class="pulse-command-primary">${language==='es'?'En la tableta, elige tu rol y pulsa «Empezar turno».':'On the tablet, choose your role and press “Start shift”.'}</span>`:`<button type="button" class="pulse-command-secondary" data-action="to-intro">${copy.back}</button><button type="button" class="pulse-command-primary" data-action="start-explore">${copy.start} <span>→</span></button>`}</footer></section></main>`;
 }
 function exploreScreen(data,game,language,readonly){
  const copy=t(language),free=freeCopy(language),scenarioItem=scenario(data,game);
  const finish=playedCount(game)?`<button type="button" class="ptd-finish-link" data-action="finish-session">${free.finishNow}</button>`:'';
  return `<main class="pulse-command">${header(data,game,language,readonly)}<div class="pulse-dashboard"><div>${mapPanel(data,game,language,scenarioItem,null)}</div><aside>${hud(data,game,language,scenarioItem,null)}${missions(data,game,language)}<div class="ptd-explore-actions">${finish}<button type="button" class="pulse-command-primary pulse-dashboard-cta" data-action="to-decision">${copy.goDecision} <span>→</span></button></div></aside></div></main>`;
 }
 function decisionScreen(data,game,language,readonly){const copy=t(language),scenarioItem=scenario(data,game),selected=game.actionId;const role=player(data,game);return `<main class="pulse-command">${header(data,game,language,readonly)}<div class="pulse-dashboard"><div>${mapPanel(data,game,language,scenarioItem,selected)}</div><aside class="pulse-decision-panel"><a href="#" data-action="to-explore">← ${copy.returnMap}</a>${hud(data,game,language,scenarioItem,selected)}<div class="pulse-decision-copy"><p>${copy.decide}</p><h1>${esc(scenarioItem[`title_${language}`])}</h1><span>${esc(scenarioItem[`brief_${language}`])}</span><em>✦ ${esc(scenarioItem[`clue_${language}`])}</em></div><div class="pulse-action-grid">${data.actions.map(item=>{const isSelected=selected===item.id,bonus=roleBonus(data,game,item.id);return `<button type="button" class="pulse-action-card ${isSelected?'is-selected':''}" data-action-choice="${item.id}"><span>${item.icon}</span><i><b>${esc(item[language])}</b><small>${esc(item[`description_${language}`])}</small>${bonus?`<em>+${bonus} ${copy.bonus.toLowerCase()}</em>`:''}</i><strong>${isSelected?'✓':'+'}</strong></button>`;}).join('')}</div><button type="button" class="pulse-command-primary pulse-apply" data-action="confirm-decision" ${selected?'':'disabled'}>${copy.apply} <span>→</span></button></aside></div></main>`;}
 function resultScreen(data,game,language,readonly){
  const copy=t(language),free=freeCopy(language),scenarioItem=scenario(data,game),chosen=action(data,game.actionId);
  const score=roleScore(data,game,scenarioItem,game.actionId),bonus=roleBonus(data,game,game.actionId);
  const effect=scenarioItem.effects[game.actionId];
  const after={congestion:Math.max(0,scenarioItem.baseline.congestion+effect.congestion),speed:scenarioItem.baseline.speed+effect.speed,critical:Math.max(0,scenarioItem.baseline.critical+effect.critical)};
  return `<main class="pulse-command">${header(data,game,language,readonly)}<section class="pulse-outcome"><div class="pulse-outcome-score"><p>${copy.impact}</p><h1>${score}<small>/100</small></h1><span>${score>=85?'★★★':score>=55?'★★☆':'★☆☆'}</span>${bonus?`<em>${copy.bonus}: +${bonus}</em>`:''}</div><div class="pulse-outcome-story"><p>${scenarioItem.icon} ${esc(scenarioItem[`title_${language}`])}</p><h2>${score>=85?(language==='es'?'Decisión acertada':'Sound decision'):(language==='es'?'Revisa el impacto':'Review the impact')}</h2><div class="pulse-after-grid">${meter(copy.congestion,after.congestion,'%',after.congestion>=65?'danger':'good')}${meter(copy.speed,after.speed,' km/h','speed')}${meter(copy.critical,after.critical,'','critical')}</div><h3>${copy.lesson}</h3><span>${esc(scenarioItem[`lesson_${language}`])}</span></div><div class="pulse-score-compare"><small>${copy.impact}</small>${data.actions.map(item=>`<div class="${item.id===chosen.id?'is-choice':''}"><span>${item.icon}</span><i><b>${esc(item[language])}</b><em style="width:${roleScore(data,game,scenarioItem,item.id)}%"></em></i><strong>${roleScore(data,game,scenarioItem,item.id)}</strong></div>`).join('')}</div><footer><button type="button" class="pulse-command-secondary" data-action="retry">${copy.retry}</button><button type="button" class="pulse-command-secondary" data-action="choose-event">${free.chooseEvent}</button><button type="button" class="pulse-command-primary" data-action="finish-session">${free.finishNow} <span>→</span></button></footer></section></main>`;
 }
 function finalScreen(data,game,language,readonly){
  const copy=t(language),free=freeCopy(language),score=total(game),count=playedCount(game),possible=count*100;
  const average=possible?score/possible:0;
  const played=data.scenarios.map((item,index)=>({item,index})).filter(({index})=>Object.hasOwn(game.results||{},index));
  const stars=average>=.8?'★★★':average>=.5?'★★☆':'★☆☆';
  const cases=played.map(({item,index})=>`<article><span>${icon('scenario',item.id,item.icon)}</span><b>${esc(item[`title_${language}`])}</b><strong>${game.results[index]}</strong></article>`).join('');
  const tv=readonly?window.PREDICTTODO_INSIGHTS:null;
  if(tv){
   // Stage 5 on the TV: the visitor's results, then the strongest project figures. No buttons.
   return `<main class="pulse-command">${header(data,game,language,readonly)}<section class="pulse-final-screen ptd-tv-story--final"><div class="ptd-final-hero"><p>${free.completed}: ${count}/4</p><h2>${language==='es'?'Tus resultados':'Your results'}</h2><h1>${score}<small>/${possible}</small></h1><span>${stars}</span></div><div class="ptd-final-summary"><div class="ptd-final-summary-heading"><h2>${language==='es'?'Casos que jugaste':'Cases you played'}</h2></div><div>${cases}</div>${tv.story('impact',language)}</div></section></main>`;
  }
  return `<main class="pulse-command">${header(data,game,language,readonly)}<section class="pulse-final-screen"><p>${free.completed}: ${count}/4</p><h1>${score}<small>/${possible}</small></h1><span>${stars}</span><h2>${average>=.8?(language==='es'?'Tomaste decisiones informadas':'You made informed decisions'):(language==='es'?'Cada escenario es una oportunidad de aprendizaje':'Each scenario is an opportunity to learn')}</h2><div>${cases}</div><div class="ptd-final-actions"><button type="button" class="pulse-command-secondary" data-action="resume-events">${free.continue}</button><button type="button" class="pulse-command-secondary" data-action="reset-game">${copy.restart} <span>↻</span></button><button type="button" class="pulse-command-primary" data-action="to-ranking">${language==='es'?'Continuar':'Continue'} <span>→</span></button></div></section></main>`;
 }
 function gpsRoadState(value){return value>=82?'critical':value>=65?'dense':value>=42?'busy':'normal';}
 function gpsRoadStates(congestion,scenarioId){
  const patterns={
   cali_peak:{cali:15,calle80:0,calle26:-18,mayor:-13,av68:-8,nqs:-20,autopista:-25,boyaca:-18},
   campin_arrival:{cali:-20,calle80:-8,calle26:4,mayor:-6,av68:1,nqs:13,autopista:-18,boyaca:-22},
   campin_exit:{cali:-12,calle80:-4,calle26:7,mayor:1,av68:9,nqs:16,autopista:-10,boyaca:-18},
   calle100_quiet:{cali:-8,calle80:-12,calle26:-10,mayor:-14,av68:-12,nqs:-9,autopista:3,boyaca:-16}
  };
  const pattern=patterns[scenarioId]||patterns.cali_peak;
  return Object.fromEntries(Object.entries(pattern).map(([road,offset])=>[road,gpsRoadState(Math.max(0,Math.min(100,congestion+offset)))]));
 }
 function criticalCount(scenarioItem,actionId){return Math.max(0,scenarioItem.baseline.critical+(scenarioItem.effects[actionId]?.critical||0));}
 function pointsAlongRoute(points,count){
  if(points.length<2||count===0)return [];
  const distances=[0];
  for(let i=1;i<points.length;i++)distances.push(distances[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
  return Array.from({length:count},(_,i)=>{
   const target=distances.at(-1)*(i+1)/(count+1);
   let end=1;while(end<distances.length-1&&distances[end]<target)end++;
   const fraction=(target-distances[end-1])/(distances[end]-distances[end-1]||1);
   return points[end-1].map((value,axis)=>value+(points[end][axis]-value)*fraction);
  });
 }
 const eventFlag='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V3m0 1h12l-3 5 3 5H6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
 function hotspotText(language,index){return language==='en'?`Hotspot ${index}: a place where traffic backs up in this simulation.`:`Punto crítico ${index}: un lugar donde se atasca el tráfico en esta simulación.`;}
 function gpsMapSvg(congestion,scenarioItem,copy,critical=scenarioItem.baseline.critical){
  const roads=gpsRoadStates(congestion,scenarioItem.id);
  const events={
   cali_peak:{x:208,y:373,label:'Av. Ciudad de Cali'},
   campin_arrival:{x:467,y:204,label:'El Campin'},
   campin_exit:{x:467,y:225,label:'El Campin'},
   calle100_quiet:{x:618,y:83,label:'Calle 100'}
  };
  const event=events[scenarioItem.id]||events.cali_peak;
  const language=copy===words.en?'en':'es';
  const reference=language==='en'?'Bogota road reference · simulated traffic':'Referencia vial de Bogota · trafico simulado';
  const routes={
   cali_peak:{d:'M600 512L501 470L501 383L350 373L208 373',start:{x:600,y:512},points:[[600,512],[501,470],[501,383],[350,373],[208,373]]},
   campin_arrival:{d:'M601 511L501 470L501 318L467 242L467 204',start:{x:601,y:511},points:[[601,511],[501,470],[501,318],[467,242],[467,204]]},
   campin_exit:{d:'M601 511L501 470L501 318L467 242L467 225',start:{x:601,y:511},points:[[601,511],[501,470],[501,318],[467,242],[467,225]]},
   calle100_quiet:{d:'M344 511L344 383L475 318L620 242L620 83',start:{x:344,y:511},points:[[344,511],[344,383],[475,318],[620,242],[620,83]]}
  };
  const route=routes[scenarioItem.id]||routes.cali_peak;
  const routeLabel=language==='en'?'Simulated route to event':'Ruta simulada al evento';
  return `<svg class="pulse-city-map pulse-city-map--gps" viewBox="0 0 900 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${copy.map}">
   <title>${copy.map}</title>
   <defs>
    <linearGradient id="pulse-terrain" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#112e42"/><stop offset=".5" stop-color="#0b2539"/><stop offset="1" stop-color="#0b3a3b"/></linearGradient>
    <pattern id="pulse-city-grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M0 38L38 0M-12 12L12 -12M26 50L50 26" stroke="#51718a" stroke-width="1" opacity=".24"/></pattern>
    <filter id="pulse-gps-glow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   </defs>
   <rect width="900" height="560" rx="30" fill="url(#pulse-terrain)"/>
   <image class="pulse-satellite-base" href="/assets/img/predicttodo/PredictToDo_Mapa_Satelital_Simulado.png" x="0" y="0" width="900" height="560" preserveAspectRatio="xMidYMid slice"/>
   <rect class="pulse-satellite-tint" width="900" height="560" rx="30"/>
   <path class="pulse-city-boundary" d="M116 41C245 4 551 19 701 63C819 98 860 191 820 309C790 399 689 500 526 521C354 543 171 506 103 404C47 319 62 125 116 41Z"/>
   <path class="pulse-city-grid" d="M116 41C245 4 551 19 701 63C819 98 860 191 820 309C790 399 689 500 526 521C354 543 171 506 103 404C47 319 62 125 116 41Z"/>
   <path class="pulse-waterway" d="M109 0C79 98 101 169 73 251C44 337 74 437 131 560"/>
   <path class="pulse-waterway pulse-waterway--east" d="M836 0C857 95 842 195 865 281C883 353 856 458 810 560"/>
   <g class="pulse-secondary-streets">
    <path d="M151 98L748 103M127 166L790 172M111 236L804 242M110 306L806 319M143 383L754 404M205 458L664 479"/>
    <path d="M207 54C206 171 207 322 222 485M344 46C342 164 351 339 373 507M474 41C483 157 477 341 501 518M619 50C609 178 620 339 653 489M740 95C717 200 728 314 770 398"/>
   </g>
   <g class="pulse-residential-streets">
    <path d="M157 125L315 112L455 126L581 110L734 131M135 205L254 190L400 205L560 187L749 209M124 274L275 259L421 275L589 265L786 286M125 344L280 325L437 344L594 333L782 355M167 425L290 409L440 431L577 414L721 439"/>
    <path d="M168 72L164 453M263 57L272 481M415 55L425 492M553 50L548 487M690 75L705 455M786 131L774 358"/>
    <path d="M162 125L272 205L425 126L548 187L705 131M164 274L272 325L425 275L548 333L705 286M272 481L425 431L548 487M164 344L272 259L425 344L548 265L705 355"/>
   </g>
   <g class="pulse-road-underlay">
    <path d="M208 55C208 166 207 312 222 487"/><path d="M344 47C342 171 351 338 373 506"/><path d="M475 42C483 158 477 340 501 518"/><path d="M620 50C609 178 620 338 652 489"/><path d="M738 96C717 201 728 312 769 398"/>
    <path d="M138 170C294 165 560 173 789 172"/><path d="M111 241C292 238 594 241 804 242"/><path d="M143 383C325 363 553 383 754 404"/><path d="M222 306L344 242L475 318L620 242M344 170L475 242L620 172"/>
   </g>
   <path class="pulse-road pulse-road--cali ${roads.cali}" d="M208 55C208 166 207 312 222 487"/>
   <path class="pulse-road pulse-road--av68 ${roads.av68}" d="M344 47C342 171 351 338 373 506"/>
   <path class="pulse-road pulse-road--nqs ${roads.nqs}" d="M475 42C483 158 477 340 501 518"/>
   <path class="pulse-road pulse-road--autopista ${roads.autopista}" d="M620 50C609 178 620 338 652 489"/>
   <path class="pulse-road pulse-road--boyaca ${roads.boyaca}" d="M738 96C717 201 728 312 769 398"/>
   <path class="pulse-road pulse-road--calle80 ${roads.calle80}" d="M138 170C294 165 560 173 789 172"/>
   <path class="pulse-road pulse-road--calle26 ${roads.calle26}" d="M111 241C292 238 594 241 804 242"/>
   <path class="pulse-road pulse-road--mayor ${roads.mayor}" d="M143 383C325 363 553 383 754 404"/>
   <path class="pulse-road pulse-road--connector ${roads.av68}" d="M222 306L344 242L475 318L620 242M344 170L475 242L620 172"/>
   <g class="pulse-route-overlay">
    <path class="pulse-route-shadow" d="${route.d}"/><path class="pulse-route-line" d="${route.d}"/>
    <circle class="pulse-route-start" cx="${route.start.x}" cy="${route.start.y}" r="10"/><path class="pulse-route-arrow" d="M${route.start.x-5} ${route.start.y+3}l5-9 5 9h-3v7h-4V${route.start.y+3}Z"/>
    <g class="pulse-event-flag" transform="translate(${event.x-16} ${event.y-16})"><title>${language==='en'?'Event':'Evento'}</title><rect width="32" height="32" rx="8" fill="#fff" stroke="#005cff" stroke-width="2"/><path d="M10 26V6m0 1h14l-4 6 4 6H10" fill="none" stroke="#005cff" stroke-width="2"/></g>
   </g>
   <g class="pulse-map-zone"><text x="127" y="92">SUBA</text><text x="116" y="290">ENGATIVA</text><text x="542" y="91">USAQUEN</text><text x="540" y="285">CHAPINERO</text><text x="164" y="444">KENNEDY</text><text x="594" y="442">TUNJUELITO</text></g>
   <g class="pulse-road-label"><rect x="233" y="142" width="74" height="22" rx="8"/><text x="242" y="157">Calle 80</text></g>
   <g class="pulse-road-label"><rect x="524" y="65" width="84" height="22" rx="8"/><text x="533" y="80">Calle 100</text></g>
   <g class="pulse-road-label"><rect x="314" y="212" width="73" height="22" rx="8"/><text x="323" y="227">Calle 26</text></g>
   <g class="pulse-road-label"><rect x="264" y="358" width="102" height="22" rx="8"/><text x="273" y="373">Av. 1 de Mayo</text></g>
   <g class="pulse-road-label"><rect x="115" y="485" width="119" height="22" rx="8"/><text x="124" y="500">Av. Ciudad de Cali</text></g>
   <g class="pulse-road-label"><rect x="351" y="487" width="75" height="22" rx="8"/><text x="360" y="502">Av. 68</text></g>
   <g class="pulse-road-label"><rect x="482" y="523" width="43" height="22" rx="8"/><text x="491" y="538">NQS</text></g>
   <g class="pulse-road-label"><rect x="628" y="123" width="99" height="22" rx="8"/><text x="637" y="138">Autopista Norte</text></g>
   <g class="pulse-map-north"><path d="M816 52l-9 23 9-4 9 4-9-23Z"/><text x="811" y="93">N</text></g>
   <g class="pulse-route-card"><rect x="28" y="27" width="184" height="50" rx="14"/><circle cx="50" cy="52" r="9"/><path d="M46 54l4-7 4 7h-2v5h-4v-5Z"/><text x="68" y="49">${routeLabel}</text><text x="68" y="65">${esc(event.label)} · ${esc(scenarioItem.time)}</text></g>
   ${pointsAlongRoute(route.points,critical).map(([x,y],i)=>`<g class="pulse-critical-marker" transform="translate(${x} ${y})"><title>${hotspotText(language,i+1)}</title><circle r="16" fill="#e6334d" stroke="#fff" stroke-width="3"/><text text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="17" font-weight="800">${i+1}</text></g>`).join('')}
   <g class="pulse-event-tag"><rect x="${Math.min(640,event.x+25)}" y="${Math.min(470,event.y+18)}" width="198" height="54" rx="12"/><text x="${Math.min(657,event.x+42)}" y="${Math.min(491,event.y+39)}">${scenarioItem.icon} ${esc(scenarioItem.time)} · ${esc(event.label)}</text><text x="${Math.min(657,event.x+42)}" y="${Math.min(510,event.y+58)}">${esc(scenarioItem[`zone_${language}`]||scenarioItem.zone_es)}</text></g>
   <text class="pulse-map-attribution" x="27" y="535">${reference}</text>
  </svg>`;
 }
 const liveMapScenes=Object.freeze({
  cali_peak:{center:[4.642,-74.142],event:[4.635008,-74.158041]},
  campin_arrival:{center:[4.654,-74.087],event:[4.644731,-74.078028]},
  campin_exit:{center:[4.638,-74.070],event:[4.644731,-74.078028]},
  calle100_quiet:{center:[4.699,-74.081],event:[4.684968,-74.054808]}
 });
 const liveMapColors=Object.freeze({normal:'#2fc99c',busy:'#f5c44d',dense:'#ff8b3d',critical:'#f65463'});
 const liveMapInstances=new WeakMap();
 let routeGeometryLoader=null,googleMapsLoader=null;
 function loadRouteGeometry(){
  return routeGeometryLoader ||= fetch('/projects/02-bogota-traffic-prediction/road-routes.json')
   .then(response=>response.ok?response.json():null).then(data=>data?.routes||{}).catch(()=>({}));
 }
 function loadGoogleMaps(){
  if(typeof window==='undefined'||typeof document==='undefined')return Promise.resolve(null);
  if(window.google?.maps?.Map)return Promise.resolve(window.google.maps);
  return googleMapsLoader ||= fetch('/api/maps-config',{cache:'no-store'})
   .then(response=>response.ok?response.json():null)
   .then(config=>{
    if(!config?.googleMapsApiKey)return null;
    return new Promise(resolve=>{
     const script=document.createElement('script');
     const timeout=setTimeout(()=>resolve(null),12000);
     script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(config.googleMapsApiKey)+'&v=weekly&loading=async';
     script.async=true;
     script.onload=()=>{clearTimeout(timeout);resolve(window.google?.maps?.Map?window.google.maps:null);};
     script.onerror=()=>{clearTimeout(timeout);resolve(null);};
     document.head.append(script);
    });
   }).catch(()=>null);
 }
 let leafletLoader=null;
 function loadLeaflet(){
  if(typeof window==='undefined'||typeof document==='undefined')return Promise.resolve(null);
  if(window.L)return Promise.resolve(window.L);
  if(leafletLoader)return leafletLoader;
  leafletLoader=new Promise(resolve=>{
   const style=document.createElement('link');style.rel='stylesheet';style.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
   const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';script.async=true;
   script.onload=()=>resolve(window.L||null);script.onerror=()=>resolve(null);
   document.head.append(style,script);
  });
  return leafletLoader;
 }
 function roadRouteSegments(points,congestion){
  const offsets=[-46,-25,-8,12];
  return offsets.map((offset,index)=>{
   const start=Math.floor((points.length-1)*index/4),end=Math.floor((points.length-1)*(index+1)/4);
   return {points:points.slice(start,end+1),color:liveMapColors[gpsRoadState(Math.max(0,Math.min(100,congestion+offset)))]};
  }).filter(segment=>segment.points.length>1);
 }
 function showMap(canvas,label,source){
  if(!canvas.isConnected)return;
  const sourceLabel=canvas.parentElement.querySelector('[data-pulse-map-source]');
  if(sourceLabel)sourceLabel.textContent=label;
  canvas.classList.add('has-live-map','is-'+source);
 }
 function mapSceneState(options){
  const scenarioItem=scenario(options.data,options.game),scene=liveMapScenes[scenarioItem.id]||liveMapScenes.cali_peak;
  const effect=options.game.actionId?scenarioItem.effects[options.game.actionId]:null;
  const congestion=stateForHour(options.game.hour,scenarioItem.baseline.congestion+(effect?.congestion||0),scenarioItem.hour);
  return {scenarioItem,scene,congestion,critical:criticalCount(scenarioItem,options.game.actionId),language:options.language};
 }
 function fitLiveRoute(record,options){
  if(!options||!record.canvas.isConnected)return;
  const {scene,scenarioItem}=mapSceneState(options),route=record.routes[scenarioItem.id]||[];
  if(record.provider==='osm'){
   record.map.invalidateSize({animate:false});
   if(route.length>1)record.map.fitBounds([...route,scene.event],{padding:[38,38],maxZoom:14.5,animate:false});
  }else if(route.length>1){
   const bounds=new record.api.LatLngBounds();[...route,scene.event].forEach(([lat,lng])=>bounds.extend({lat,lng}));record.map.fitBounds(bounds,44);
  }
 }
 function watchMapSize(record){
  if(typeof ResizeObserver==='undefined')return;
  record.resizeObserver=new ResizeObserver(()=>fitLiveRoute(record,record.canvas._pulseLatest));
  record.resizeObserver.observe(record.canvas);
 }
 function updateGoogleMap(G,record,options){
  const {scene,scenarioItem,congestion,critical,language}=mapSceneState(options),route=record.routes[scenarioItem.id]||[];
  if(record.sceneId!==scenarioItem.id){
   if(route.length>1){const bounds=new G.LatLngBounds();[...route,scene.event].forEach(([lat,lng])=>bounds.extend({lat,lng}));record.map.fitBounds(bounds,44);}
   else record.map.setCenter({lat:scene.center[0],lng:scene.center[1]});
  }
  record.overlays.forEach(item=>item.setMap(null));record.overlays=[];
  if(route.length>1){
   const path=route.map(([lat,lng])=>({lat,lng}));
   record.overlays.push(new G.Polyline({map:record.map,path,strokeColor:'#101b33',strokeWeight:12,strokeOpacity:.92,clickable:false}));
   roadRouteSegments(route,congestion).forEach(segment=>record.overlays.push(new G.Polyline({
    map:record.map,path:segment.points.map(([lat,lng])=>({lat,lng})),strokeColor:segment.color,strokeWeight:7,strokeOpacity:1,clickable:false
   })));
   record.overlays.push(new G.Marker({map:record.map,position:path[0],title:language==='en'?'Route start':'Inicio de ruta',
    icon:{path:G.SymbolPath.CIRCLE,scale:7,fillColor:'#24b6f1',fillOpacity:1,strokeColor:'#fff',strokeWeight:3}}));
  }
  pointsAlongRoute(route,critical).forEach(([lat,lng],i)=>record.overlays.push(new G.Marker({map:record.map,position:{lat,lng},title:hotspotText(language,i+1),
   label:{text:String(i+1),color:'#fff',fontWeight:'800',fontSize:'14px'},icon:{path:G.SymbolPath.CIRCLE,scale:16,fillColor:'#e6334d',fillOpacity:1,strokeColor:'#fff',strokeWeight:3}})));
  record.overlays.push(new G.Marker({map:record.map,position:{lat:scene.event[0],lng:scene.event[1]},title:scenarioItem['title_'+language],
   label:{text:'⚑',color:'#005cff',fontWeight:'800',fontSize:'20px'},icon:{path:G.SymbolPath.CIRCLE,scale:16,fillColor:'#fff',fillOpacity:1,strokeColor:'#005cff',strokeWeight:2}}));
  record.sceneId=scenarioItem.id;
  record.credit.textContent=language==='en'?'Simulated route © OpenStreetMap contributors':'Ruta simulada © colaboradores de OpenStreetMap';
  if(record.loaded)showMap(record.canvas,language==='en'?'Google Maps · current traffic · simulated route':'Google Maps · tráfico actual · ruta simulada','google');
 }
 function renderGoogleMap(G,canvas,target,routes){
  const latest=canvas._pulseLatest,{scene}=mapSceneState(latest);
  const map=new G.Map(target,{
   center:{lat:scene.center[0],lng:scene.center[1]},zoom:13.5,mapTypeId:'hybrid',
   disableDefaultUI:true,gestureHandling:'none',keyboardShortcuts:false,clickableIcons:false
  });
  const traffic=new G.TrafficLayer();traffic.setMap(map);
  const credit=document.createElement('span');credit.className='pulse-route-credit';canvas.append(credit);
  const record={provider:'google',api:G,map,traffic,canvas,routes,credit,overlays:[],sceneId:null,loaded:false};
  liveMapInstances.set(target,record);
  watchMapSize(record);
  G.event.addListenerOnce(map,'tilesloaded',()=>{
   record.loaded=true;
   if(canvas.isConnected)updateGoogleMap(G,record,canvas._pulseLatest);
  });
  updateGoogleMap(G,record,latest);
 }
 function updateOsmMap(L,record,options){
  const {scene,scenarioItem,congestion,critical,language}=mapSceneState(options),route=record.routes[scenarioItem.id]||[];
  if(record.sceneId!==scenarioItem.id){
   if(route.length>1)record.map.fitBounds([...route,scene.event],{padding:[38,38],maxZoom:14.5,animate:false});
   else record.map.setView(scene.center,13.5,{animate:false});
  }
  record.overlays.clearLayers();
  if(route.length>1){
   L.polyline(route,{color:'#101b33',weight:12,opacity:.9,interactive:false,lineCap:'round',lineJoin:'round'}).addTo(record.overlays);
   roadRouteSegments(route,congestion).forEach(segment=>L.polyline(segment.points,{color:segment.color,weight:7,opacity:1,interactive:false,lineCap:'round',lineJoin:'round'}).addTo(record.overlays));
   L.circleMarker(route[0],{radius:7,color:'#fff',weight:3,fillColor:'#24b6f1',fillOpacity:1,interactive:true}).bindTooltip(language==='en'?'Route start':'Inicio de la ruta').addTo(record.overlays);
  }
  pointsAlongRoute(route,critical).forEach((position,i)=>{
   L.marker(position,{icon:L.divIcon({className:'pulse-critical-pin',html:`<span>${i+1}</span>`,iconSize:[44,44],iconAnchor:[22,22]}),title:hotspotText(language,i+1),alt:hotspotText(language,i+1)})
    .bindPopup(hotspotText(language,i+1)).addTo(record.overlays);
  });
  L.marker(scene.event,{icon:L.divIcon({className:'pulse-event-pin',html:eventFlag,iconSize:[36,36],iconAnchor:[18,18]}),title:scenarioItem['title_'+language],alt:scenarioItem['title_'+language]})
   .bindTooltip(scenarioItem.icon+' '+esc(scenarioItem['title_'+language]),{direction:'top',offset:[0,-12],className:'pulse-live-map-tooltip'}).addTo(record.overlays);
  record.sceneId=scenarioItem.id;
  if(record.loaded)showMap(record.canvas,language==='en'?'OpenStreetMap · simulated congestion':'OpenStreetMap · congestión simulada','osm');
  setTimeout(()=>fitLiveRoute(record,record.canvas._pulseLatest),0);
 }
 function renderOsmMap(L,canvas,target,routes){
  const latest=canvas._pulseLatest,{scene}=mapSceneState(latest);
  const map=L.map(target,{attributionControl:true,zoomControl:false,dragging:false,touchZoom:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false});
  map.attributionControl.setPrefix(false);
  map.setView(scene.center,13.5,{animate:false});
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,
   attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'}).addTo(map);
  const overlays=L.layerGroup().addTo(map);
  const record={provider:'osm',map,canvas,routes,overlays,sceneId:null,loaded:false};
  liveMapInstances.set(target,record);
  watchMapSize(record);
  tiles.once('tileload',()=>{
   record.loaded=true;
   if(canvas.isConnected)updateOsmMap(L,record,canvas._pulseLatest);
  });
  updateOsmMap(L,record,latest);
 }
 function mountLiveMap(root,options){
  const canvas=root?.querySelector?.('[data-pulse-map-canvas]'),target=canvas?.querySelector?.('[data-pulse-live-map]');
  if(!canvas||!target)return;
  canvas._pulseLatest=options;
  canvas.dataset.criticalCount=criticalCount(scenario(options.data,options.game),options.game.actionId);
  const record=liveMapInstances.get(target);
  if(record){
   if(record.provider==='google')updateGoogleMap(window.google.maps,record,options);
   else updateOsmMap(window.L,record,options);
   return;
  }
  if(target.dataset.pulseMounted)return;
  target.dataset.pulseMounted='true';
  Promise.all([loadGoogleMaps(),loadRouteGeometry()]).then(async([G,routes])=>{
   if(!target.isConnected)return;
   if(G?.Map&&G?.TrafficLayer){renderGoogleMap(G,canvas,target,routes);return;}
   const L=await loadLeaflet();
   if(L&&target.isConnected)renderOsmMap(L,canvas,target,routes);
  }).catch(()=>{});
 }
 function decorate(root,{game,language,readonly=false}){
  const page=root.querySelector('.pulse-command');
  if(!page)return;
  const phase=game.phase||'intro';
  page.classList.add('ptd-game');
  page.classList.toggle('ptd-game--readonly',readonly);
  page.dataset.phase=phase;
  page.lang=language;
  const brand=page.querySelector('.pulse-command-brand');
  if(brand)brand.innerHTML='<img src="/projects/02-bogota-traffic-prediction/predicttodoImages/idb-group-white.svg" width="216" height="44" alt="IDB Group"><span class="ptd-header-divider" aria-hidden="true"></span><span class="ptd-header-copy"><strong>AI in Action</strong><small>IDB Group Projects Across the Region</small></span>';
  const title={
   explore:language==='es'?'Pulso vial Bogotá · Centro de control':'Bogotá Traffic Pulse · Control center',
   decision:language==='es'?'Elige una acción para Bogotá':'Choose an action for Bogotá'
  }[phase];
  const dashboard=page.querySelector('.pulse-dashboard');
  if(title&&dashboard){const heading=document.createElement('h1');heading.className='ptd-screen-title';heading.textContent=title;page.insertBefore(heading,dashboard);}
  if(phase==='explore'){
   const aside=dashboard?.querySelector('aside');
   if(aside){const intro=document.createElement('div');intro.className='ptd-aside-intro';intro.innerHTML=language==='es'?'<p>MISIÓN DE HOY</p><h2>Explora antes de decidir</h2>':'<p>TODAY’S MISSION</p><h2>Explore before deciding</h2>';aside.prepend(intro);}
  }
  if(phase==='result'){
   page.querySelectorAll('.pulse-score-compare>div').forEach(row=>{
    const label=row.querySelector('i b');
    if(label){const outside=document.createElement('span');outside.className='ptd-score-label';outside.textContent=label.textContent;row.prepend(outside);label.remove();}
    row.querySelector(':scope > span:not(.ptd-score-label)')?.remove();
   });
  }
  if(phase==='final'&&!readonly){
   const final=page.querySelector('.pulse-final-screen');
   if(final){
    const hero=document.createElement('div');hero.className='ptd-final-hero';
    const summary=document.createElement('div');summary.className='ptd-final-summary';
    const nodes=Array.from(final.children);
    nodes.forEach(node=>(node.matches('div,button')?summary:hero).appendChild(node));
    const heroTitle=hero.querySelector('h2');
    const score=hero.querySelector('h1');
    if(heroTitle&&score){
     heroTitle.textContent=language==='es'?'Tus resultados':'Your results';
     hero.insertBefore(heroTitle,score);
    }
    const summaryTitle=document.createElement('div');
    summaryTitle.className='ptd-final-summary-heading';
    summaryTitle.innerHTML=language==='es'
     ? '<h2>Casos que jugaste</h2>'
     : '<h2>Cases you played</h2>';
    summary.prepend(summaryTitle);
    final.append(hero,summary);
   }
  }
 }
 function renderInto(root,options){
  if(window.PREDICTTODO_CONTROL&&['explore','decision','result'].includes(options.game?.phase)){
   window.PREDICTTODO_CONTROL.renderInto(root,options);return;
  }
  window.PREDICTTODO_CONTROL?.release(root);
  const current=root.querySelector('[data-pulse-map-canvas]');
  const html=render(options);
  root.innerHTML=options.readonly&&window.PREDICTTODO_CONTROL?window.PREDICTTODO_CONTROL.displayOnly(html):html;
  const next=root.querySelector('[data-pulse-map-canvas]');
  if(current?.classList.contains('has-live-map')&&next)next.replaceWith(current);
  else if(current){
   const record=liveMapInstances.get(current.querySelector('[data-pulse-live-map]'));
   record?.resizeObserver?.disconnect();
   if(record?.provider==='osm')record.map.remove();
   if(record?.provider==='google'){
    record.traffic.setMap(null);
    record.overlays.forEach(item=>item.setMap(null));
   }
  }
  mountLiveMap(root,options);
  decorate(root,options);
  if(options.game?.phase==='resources'){window.PREDICTTODO_COMPLETION.mount(root,options);return;}
  const page=root.querySelector('.ptd-game'),control=window.PREDICTTODO_CONTROL;
  if(page&&control&&options.readonly){
   const fragment=document.createElement('div');fragment.innerHTML=control.insight(options);
   const card=fragment.firstElementChild,phase=options.game.phase,side=page.querySelector('.ptd-story-side');
   // The opening guide stays text-light and the closing hero keeps only the score (the impact block carries the idea).
   if(page.querySelector('.ptd-tv-guide')||page.querySelector('.ptd-tv-story--final')){}
   else if(side)side.append(card);
   else if(phase==='intro'){
    const actions=page.querySelector('.ptd-intro-actions');
    if(actions)actions.before(card);else page.querySelector('.pulse-intro-card')?.append(card);
   }
   else if(phase==='player')page.querySelector('.pulse-player-screen footer')?.before(card);
   else page.querySelector('.ptd-final-hero')?.append(card);
   if(options.readonly){
    const holder=document.createElement('div');holder.innerHTML=control.notice(options);page.append(holder.firstElementChild);
    page.querySelectorAll('button,input').forEach(el=>{el.disabled=true;el.tabIndex=-1;});
   }
  }
 }
 function mapPanel(data,game,language,scenarioItem,preview){
  const copy=t(language),effect=preview?scenarioItem.effects[preview]:null;
  const traffic=stateForHour(game.hour,scenarioItem.baseline.congestion+(effect?.congestion||0),scenarioItem.hour);
  const critical=criticalCount(scenarioItem,preview);
  const countLabel=language==='en'?`${critical} congestion hotspot${critical===1?'':'s'}`:`${critical} punto${critical===1?'':'s'} crítico${critical===1?'':'s'}`;
  const explanation=language==='en'?'Numbered red markers show where traffic backs up in this simulation.':'Los marcadores rojos numerados indican dónde se atasca el tráfico en esta simulación.';
  return `<section class="pulse-map-panel"><div class="pulse-map-topline"><span>${copy.map}<small data-pulse-map-source>${language==='en'?'Road route · simulated traffic':'Ruta vial · tráfico simulado'}</small></span><b>${level(traffic,copy)}</b></div><div class="pulse-map-canvas" data-pulse-map-canvas data-critical-count="${critical}"><div class="pulse-live-map" data-pulse-live-map aria-label="${copy.map}"></div>${gpsMapSvg(traffic,scenarioItem,copy,critical)}</div><div class="pulse-legend"><span><i class="normal"></i>${copy.normal}</span><span><i class="busy"></i>${copy.busy}</span><span><i class="dense"></i>${copy.dense}</span><span><i class="critical"></i>${copy.criticalState}</span></div><div class="pulse-map-key"><span class="pulse-hotspot-key"><b aria-hidden="true">1</b> ${countLabel}</span><span><i class="pulse-start-key" aria-hidden="true"></i>${language==='en'?'Route start':'Inicio de ruta'}</span><span class="pulse-event-key">${eventFlag}${language==='en'?'Event':'Evento'}</span><small>${critical===0?(language==='en'?'No congestion hotspots in this simulation.':'No hay puntos críticos en esta simulación.'):explanation}</small></div><label class="pulse-timeline"><span>${copy.timeline}<b>${String(game.hour).padStart(2,'0')}:00</b></span><input type="range" min="6" max="23" value="${game.hour}" data-hour aria-label="${copy.timeline}"><i><em style="left:${((game.hour-6)/17)*100}%"></em></i><small>06:00 <b>12:00</b> <b>18:00</b> 23:00</small></label>${preview?`<div class="pulse-preview-chip">${copy.impact}: ${action(data,preview).icon} ${esc(action(data,preview)[language])}</div>`:''}</section>`;
 }
 function render({data,game,language='es',readonly=false}){if(!data||!game)return '';const phase=game.phase||'intro';if(phase==='resources')return window.PREDICTTODO_COMPLETION.render({data,game,language,readonly},header(data,game,language,readonly));if(phase==='intro')return intro(data,game,language,readonly);if(phase==='player')return playerScreen(data,game,language,readonly);if(phase==='explore')return exploreScreen(data,game,language,readonly);if(phase==='decision')return decisionScreen(data,game,language,readonly);if(phase==='result')return resultScreen(data,game,language,readonly);return finalScreen(data,game,language,readonly);}
 window.PULSE_VIAL=Object.freeze({render,renderInto,roleScore,roleBonus,mountLiveMap});
})();
