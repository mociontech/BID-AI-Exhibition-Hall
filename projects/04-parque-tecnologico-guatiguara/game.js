/* Key Visual 04: editable bilingual data and shared TV/tablet renderers. */
window.GUATIGUARA_GAME=(function(){
 const base='/public/proyecto-04/';
 const challenges=[
  {id:'agroindustria',icon:'agroindustria',es:['Agroindustria','Optimizar procesos y productividad'],en:['Agro-industry','Optimize processes and productivity']},
  {id:'salud',icon:'salud',es:['Salud','Explorar soluciones para bienestar'],en:['Health','Explore solutions for well-being']},
  {id:'herramienta-digital',icon:'herramienta-digital',es:['Herramienta digital','Crear servicios y plataformas'],en:['Digital tool','Create services and platforms']},
  {id:'nuevo-producto',icon:'nuevo-producto',es:['Nuevo producto','Convertir una idea en prototipo'],en:['New product','Turn an idea into a prototype']}
 ];
 const labs=[
  {id:'agrotech',icon:'agroindustria',es:['AgroTech','Procesos, sensores y productividad'],en:['AgroTech','Processes, sensors, and productivity']},
  {id:'healthtech',icon:'salud',es:['HealthTech','Soluciones para salud y bienestar'],en:['HealthTech','Solutions for health and well-being']},
  {id:'software-ux',icon:'herramienta-digital',es:['Software & UX','Plataformas, interfaces y experiencia'],en:['Software & UX','Platforms, interfaces, and experience']},
  {id:'ia-analitica',icon:'ia-analitica',es:['IA & Analítica','Datos, modelos y apoyo a decisiones'],en:['AI & Analytics','Data, models, and decision support']},
  {id:'iot-sensores',icon:'iot-sensores',es:['IoT & Sensores','Conexión física y monitoreo inteligente'],en:['IoT & Sensors','Physical connection and smart monitoring']},
  {id:'prototipado-digital',icon:'nuevo-producto',es:['Prototipado digital','Pruebas, iteraciones y validación'],en:['Digital prototyping','Testing, iteration, and validation']},
  {id:'ciberseguridad',icon:'ciberseguridad',es:['Ciberseguridad','Protección, confianza y resiliencia'],en:['Cybersecurity','Protection, trust, and resilience']}
 ];
 const supports=[
  {id:'formacion',icon:'formacion',es:['Talento y formación','Fortalecer capacidades y habilidades'],en:['Talent & training','Build skills and capabilities']},
  {id:'validacion',icon:'nuevo-producto',es:['Prototipado y validación','Probar antes de escalar'],en:['Prototyping & validation','Test before scaling']},
  {id:'aliados',icon:'aliados',es:['Articulación con aliados','Conectar empresa, academia y red'],en:['Partner coordination','Connect businesses, academia, and networks']},
  {id:'acompanamiento',icon:'acompanamiento',es:['Acompañamiento técnico','Orientación experta durante el proceso'],en:['Technical guidance','Expert support throughout the process']}
 ];
 const copy={
  es:{welcome:['MINIJUEGO · BIENVENIDA','Activa la innovación','Descubre cómo una idea puede conectarse con laboratorios, talento y aliados para convertirse en una oportunidad.','Comenzar misión'],challenge:['PASO 1 · ELIGE UN RETO','Cada idea comienza con un desafío','Selecciona el tipo de reto que quieres ayudar a resolver.','Continuar'],labs:['PASO 2 · ELIGE UN LABORATORIO','Siete laboratorios, múltiples caminos','Elige el laboratorio que mejor puede impulsar el reto seleccionado.','Continuar'],supports:['PASO 3 · ACTIVA APOYOS','La innovación también necesita apoyo','Selecciona dos elementos que ayudan a que la idea avance.','Ver resultado'],result:['RESULTADO · MISIÓN COMPLETADA','Así se activa la innovación','En Guatiguará, una idea puede fortalecerse cuando se conecta con laboratorios, talento y colaboración.','Volver a jugar'],tablet:'TABLETA · CONTROLA LA EXPERIENCIA',home:'Ver inicio',exit:'Salir al menú',back:'Volver',hint:'Ejemplo guiado para la exhibición',editable:'Nombres y descriptores editables',disclaimer:'Resultado pedagógico · Ejemplo de recorrido'},
  en:{welcome:['MINIGAME · WELCOME','Activate innovation','Discover how an idea can connect with labs, talent, and partners to become an opportunity.','Start mission'],challenge:['STEP 1 · CHOOSE A CHALLENGE','Every idea begins with a challenge','Select the type of challenge you want to help solve.','Continue'],labs:['STEP 2 · CHOOSE A LAB','Seven labs, multiple paths','Choose the lab that can best support the selected challenge.','Continue'],supports:['STEP 3 · ACTIVATE SUPPORTS','Innovation also needs support','Select two elements that help the idea move forward.','View result'],result:['RESULT · MISSION COMPLETE','This is how innovation is activated','At Guatiguará, an idea grows stronger when it connects with labs, talent, and collaboration.','Play again'],tablet:'TABLET · CONTROL THE EXPERIENCE',home:'View home',exit:'Exit to menu',back:'Back',hint:'Guided exhibition example',editable:'Editable names and descriptions',disclaimer:'Educational result · Example journey'}
 };
 // These editorial messages paraphrase the supplied CO-T1754 project sheet.
 // They are intentionally factual, concise, and easy for the content team to edit.
 const projectInsights={
  es:[
   ['Conexiones que impulsan','El proyecto aborda la colaboraci\u00f3n entre el sector acad\u00e9mico y empresarial del ecosistema TI de Santander.'],
   ['Capacidades para avanzar','El fortalecimiento previsto incluye servicios especializados y capacidades empresariales para empresas TI de Santander.'],
   ['Talento en el centro','Las tecnolog\u00edas convergentes hacen parte del fortalecimiento del talento humano previsto por el proyecto.'],
   ['Una meta compartida','El fortalecimiento del Parque Tecnol\u00f3gico Guatiguar\u00e1 busca potenciar el sector de tecnolog\u00edas de la informaci\u00f3n en Colombia.'],
   ['De la investigaci\u00f3n a la oportunidad','El recorrido invita a conectar capacidades tecnol\u00f3gicas, demanda empresarial y talento TI de la regi\u00f3n.']
  ],
  en:[
   ['Connections that move ideas forward','The project addresses collaboration between academia and businesses in Santander\'s IT ecosystem.'],
   ['Capabilities to move forward','The planned strengthening includes specialized services and business capabilities for Santander\'s IT companies.'],
   ['Talent at the center','Convergent technologies are part of the project\'s planned strengthening of human talent.'],
   ['A shared goal','Strengthening Guatiguar\u00e1 Techno-Park seeks to enhance Colombia\'s information technology sector.'],
   ['From research to opportunity','This journey invites visitors to connect technological capabilities, business demand, and regional IT talent.']
  ]
 };
 const language=value=>value==='en'?'en':'es';
 const get=(item,lang,index=0)=>item[language(lang)][index];
 const find=(items,id)=>items.find(item=>item.id===id);
 const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const image=name=>`<img src="${base}iconos/${name}.svg" alt="" aria-hidden="true">`;
 const dayNumber=()=>Math.floor(Date.now()/86400000);
 function insightPanel(lang,step){
  const entries=projectInsights[language(lang)];
  const [title,body]=entries[(dayNumber()+step)%entries.length];
  const label=lang==='en'?'PROJECT PERSPECTIVE':'CLAVE DEL PROYECTO';
  const source=lang==='en'?'Based on the supplied CO-T1754 project sheet':'Basado en la ficha de proyecto CO-T1754 proporcionada';
  return `<aside class="kv-project-insight" aria-label="${label}"><span>${label}</span><strong>${esc(title)}</strong><small>${esc(body)}</small><i>${source}</i></aside>`;
 }
 const routeGuidance={
  es:{
   label:'TU RUTA SUGERIDA',title:'Convierte la selecci\u00f3n en un siguiente paso',
   mission:{agroindustria:'Delimita un proceso agroindustrial prioritario y la evidencia disponible para explorarlo.',salud:'Define la necesidad de salud, las personas involucradas y el proceso que se quiere mejorar.','herramienta-digital':'Aclara el servicio digital, sus usuarios y la tarea prioritaria antes de construir.','nuevo-producto':'Formula una hip\u00f3tesis de producto que pueda explorarse y aprenderse con rapidez.'},
   lab:'Usa el enfoque de',supports:{formacion:'prepara al equipo con formaci\u00f3n aplicada',validacion:'prueba una primera versi\u00f3n y recoge aprendizaje',aliados:'conecta la necesidad con empresa, academia y aliados',acompanamiento:'organiza los siguientes pasos con acompa\u00f1amiento t\u00e9cnico'},
   quote:'La clave es conectar demanda empresarial, infraestructura, talento y conocimiento.',note:'Ruta pedag\u00f3gica: los resultados reales se validan con las organizaciones participantes.'
  },
  en:{
   label:'YOUR SUGGESTED ROUTE',title:'Turn the selection into a next step',
   mission:{agroindustria:'Define a priority agro-industry process and the evidence available to explore it.',salud:'Define the health need, the people involved, and the process to improve.','herramienta-digital':'Clarify the digital service, its users, and the priority task before building.','nuevo-producto':'Form a product hypothesis that can be explored and learned from quickly.'},
   lab:'Use the approach of',supports:{formacion:'prepare the team through applied learning',validacion:'test an initial version and collect learning',aliados:'connect the need with business, academia, and partners',acompanamiento:'organize the next steps with technical guidance'},
   quote:'The key is connecting business demand, infrastructure, talent, and knowledge.',note:'Educational route: real outcomes are validated with participating organizations.'
  }
 };
 function solutionPanel(raw,selectedLanguage){
  const game=sanitize(raw),lang=language(selectedLanguage),guide=routeGuidance[lang];
  const challenge=find(challenges,game.mission)||challenges[0];
  const lab=find(labs,game.lab)||labs[0];
  const active=game.supports.map(id=>find(supports,id)).filter(Boolean);
  const supportSteps=active.map(item=>guide.supports[item.id]).filter(Boolean);
  const connector=lang==='es'?' y ':' and ';
  const supportsSentence=supportSteps.length===2?`${supportSteps[0]}${connector}${supportSteps[1]}`:supportSteps[0]||'';
  const nextStep=guide.mission[challenge.id];
  const labStep=`${guide.lab} ${get(lab,lang)}.`;
  return `<section class="kv-solution" aria-label="${guide.label}"><div class="kv-solution-icon">${image('ruta')}</div><div><p>${guide.label}</p><h3>${guide.title}</h3><strong>${esc(get(challenge,lang))} + ${esc(get(lab,lang))}</strong><ol><li>${esc(nextStep)}</li><li>${esc(labStep)}</li><li>${esc(supportsSentence)}.</li></ol></div><blockquote>${guide.quote}</blockquote><small>${guide.note}</small></section>`;
 }
 function tvRecommendation(raw,selectedLanguage){
  const game=sanitize(raw),lang=language(selectedLanguage),guide=routeGuidance[lang];
  const challenge=find(challenges,game.mission)||challenges[0];
  const lab=find(labs,game.lab)||labs[0];
  return `<aside class="kv-tv-recommendation"><img src="${base}iconos/oportunidad.svg" alt="" aria-hidden="true"><div><b>${lang==='es'?'Siguiente paso sugerido':'Suggested next step'}</b><span>${esc(guide.mission[challenge.id])} ${esc(guide.lab)} ${esc(get(lab,lang))}.</span></div></aside>`;
 }
 const fresh=()=>({step:0,mission:null,lab:null,supports:[]});
 function sanitize(value){
  const source=value&&typeof value==='object'?value:{};
  return {
   step:Number.isInteger(source.step)&&source.step>=0&&source.step<=4?source.step:0,
   mission:find(challenges,source.mission)?.id||null,
   lab:find(labs,source.lab)?.id||null,
   supports:Array.isArray(source.supports)?[...new Set(source.supports.filter(id=>find(supports,id)))].slice(0,2):[]
  };
 }
 function stageKey(step){return ['welcome','challenge','labs','supports','result'][step]||'welcome'}
 const line=()=>'<span class="kv-card__check" aria-hidden="true">✓</span>';
 function tvTop(step,lang){return `<header class="kv-tv-top"><div class="kv-tv-id"><span>04</span><div><b>PARQUE TECNOLÓGICO GUATIGUARÁ</b><small>AI EXHIBITION HALL · COLOMBIA</small></div></div><em>0${step} / 04</em></header>`;}
 function corner(){return `<div class="kv-corner" aria-hidden="true"><img src="${base}ilustraciones/parque-tecnologico.svg" alt=""></div>`;}
 function footer(text){return `<footer class="kv-tv-footer"><img src="${base}iconos/reto.svg" alt="" aria-hidden="true"><span>${text}</span></footer>`;}
 function renderTV(raw,selectedLanguage){
  const game=sanitize(raw),lang=language(selectedLanguage),c=copy[lang],step=stageKey(game.step);
  const selectedChallenge=find(challenges,game.mission)||challenges[0];
  const selectedLab=find(labs,game.lab)||labs[0];
  const picked=game.supports.map(id=>find(supports,id)).filter(Boolean);
  let content='';
  if(game.step===0)content=`<section class="kv-tv-stage kv-tv-welcome">${corner()}<div class="kv-copy"><p>${c.welcome[0]}</p><h1>${c.welcome[1]}</h1><i></i><h2>${c.welcome[2]}</h2></div><div class="kv-flow"><article>${image('idea')}<b>${lang==='es'?'Idea':'Idea'}</b></article><span></span><article>${image('laboratorio')}<b>${lang==='es'?'Laboratorio':'Lab'}</b></article><span></span><article>${image('talento')}<b>${lang==='es'?'Talento':'Talent'}</b></article><span></span><article>${image('aliados')}<b>${lang==='es'?'Colaboración':'Collaboration'}</b></article></div><button type="button" tabindex="-1">${c.welcome[3]} →</button></section>`;
  if(game.step===1)content=`<section class="kv-tv-stage"><div class="kv-copy">${corner()}<p>${c.challenge[0]}</p><h1>${c.challenge[1]}</h1><i></i><h2>${c.challenge[2]}</h2></div><div class="kv-tv-cards kv-tv-cards--challenge">${challenges.map(item=>`<article class="kv-card ${game.mission===item.id?'is-selected':''}">${image(item.icon)}<div><b>${esc(get(item,lang))}</b><span>${esc(get(item,lang,1))}</span></div>${game.mission===item.id?line():''}</article>`).join('')}</div></section>`;
  if(game.step===2)content=`<section class="kv-tv-stage"><div class="kv-copy">${corner()}<p>${c.labs[0]}</p><h1>${c.labs[1]}</h1><i></i><h2>${c.labs[2]}</h2></div><div class="kv-tv-cards kv-tv-cards--labs">${labs.map(item=>`<article class="kv-card ${game.lab===item.id?'is-selected':''}">${image(item.icon)}<div><b>${esc(get(item,lang))}</b><span>${esc(get(item,lang,1))}</span></div>${game.lab===item.id?line():''}</article>`).join('')}</div></section>`;
  if(game.step===3)content=`<section class="kv-tv-stage"><div class="kv-copy">${corner()}<p>${c.supports[0]}</p><h1>${c.supports[1]}</h1><i></i><h2>${c.supports[2]}</h2></div><div class="kv-tv-cards kv-tv-cards--support">${supports.map(item=>`<article class="kv-card ${game.supports.includes(item.id)?'is-selected':''}">${image(item.icon)}<div><b>${esc(get(item,lang))}</b><span>${esc(get(item,lang,1))}</span></div>${game.supports.includes(item.id)?line():''}</article>`).join('')}</div><div class="kv-mini-flow"><span>${image('reto')}${lang==='es'?'Reto':'Challenge'}</span><i></i><span>${image('laboratorio')}${lang==='es'?'Laboratorio':'Lab'}</span><i></i><span>${image('capas')}${lang==='es'?'Apoyos':'Support'}</span></div></section>`;
  if(game.step===4)content=`<section class="kv-tv-stage kv-tv-result"><div class="kv-copy">${corner()}<p>${c.result[0]}</p><h1>${c.result[1]}</h1><i></i><h2>${c.result[2]}</h2></div><div class="kv-route"><article>${image(selectedChallenge.icon)}<b>${lang==='es'?'Reto':'Challenge'}</b><span>${esc(get(selectedChallenge,lang))}</span></article><i></i><article>${image('laboratorio')}<b>${lang==='es'?'Laboratorio':'Lab'}</b><span>${esc(get(selectedLab,lang))}</span></article><i></i><article>${image('talento')}<b>${lang==='es'?'Apoyos':'Support'}</b><span>${picked.map(item=>`• ${esc(get(item,lang))}`).join('<br>')}</span></article><i></i><article>${image('oportunidad')}<b>${lang==='es'?'Oportunidad':'Opportunity'}</b><span>${lang==='es'?'Ruta de innovación activada':'Innovation route activated'}</span></article></div><button type="button" tabindex="-1">${c.result[3]} →</button></section>`;
  const footerText=game.step===2?`7 ${lang==='es'?'laboratorios · Referencia visual editable':'labs · Editable visual reference'}`:game.step===4?c.disclaimer:(lang==='es'?'Minijuego interactivo · Referencia visual para desarrollo':'Interactive minigame · Visual reference for development');
   if(game.step===4)content=content.replace('<button type="button"',`${tvRecommendation(game,lang)}<button type="button"`);
   return `<main class="kv-game kv-game--tv">${tvTop(game.step,lang)}${content}${footer(footerText)}</main>`;
 }
 function padTop(step,lang){return `<header class="kv-pad-top"><div>${image('idea')}<b>${copy[lang].tablet}</b></div><span>0${step} / 04</span></header>`;}
 function back(step,lang){return `<div class="kv-pad-nav"><button data-game-action="${step===0?'exit':'back'}">← ${step===0?copy[lang].exit:copy[lang].back}</button><span>${step?copy[lang][stageKey(step)][0]:''}</span></div>`;}
 function renderTablet(raw,selectedLanguage){
  const game=sanitize(raw),lang=language(selectedLanguage),c=copy[lang],step=stageKey(game.step);
  const challenge=find(challenges,game.mission)||challenges[0],lab=find(labs,game.lab)||labs[0],picked=game.supports.map(id=>find(supports,id)).filter(Boolean);
   let body='';
   const welcomeArt=`<figure class="kv-pad-hero-art" aria-hidden="true"><img src="${base}ilustraciones/parque-tecnologico.svg" alt=""><figcaption><span>04</span><b>${lang==='es'?'Parque Tecnol\u00f3gico Guatiguar\u00e1':'Guatiguar\u00e1 Techno-Park'}</b></figcaption></figure>`;
  if(game.step===0)body=`<p>${c.welcome[0]}</p><h1>${lang==='es'?'Bienvenido':'Welcome'}</h1><h2>${c.welcome[2]}</h2><button class="kv-primary" data-game-action="start">${c.welcome[3]} →</button><button class="kv-secondary" data-game-action="exit">${image('idea')}${c.exit}</button><aside>${lang==='es'?'Duración estimada: 30–60 segundos':'Estimated duration: 30–60 seconds'}</aside>`;
  if(game.step===1)body=`<p>${c.challenge[0]}</p><h1>${lang==='es'?'Elige un reto':'Choose a challenge'}</h1><h2>${lang==='es'?'Cada innovación empieza con una necesidad.':'Every innovation starts with a need.'}</h2><div class="kv-pad-list">${challenges.map(item=>`<button class="${game.mission===item.id?'is-selected':''}" data-game-action="mission" data-id="${item.id}">${image(item.icon)}<b>${esc(get(item,lang))}</b>${game.mission===item.id?line():'<i>○</i>'}</button>`).join('')}</div><button class="kv-primary" data-game-action="go-labs" ${game.mission?'':'disabled'}>${c.challenge[3]} →</button><aside>${c.hint}</aside>`;
  if(game.step===2)body=`<p>${c.labs[0]}</p><h1>${lang==='es'?'Elige un laboratorio':'Choose a lab'}</h1><h2>${lang==='es'?'Selecciona el punto de partida más útil para el reto.':'Select the most useful starting point for the challenge.'}</h2><div class="kv-pad-list kv-pad-list--labs">${labs.map(item=>`<button class="${game.lab===item.id?'is-selected':''}" data-game-action="lab" data-id="${item.id}">${image(item.icon)}<b>${esc(get(item,lang))}</b>${game.lab===item.id?line():'<i>○</i>'}</button>`).join('')}</div><button class="kv-primary" data-game-action="go-supports" ${game.lab?'':'disabled'}>${c.labs[3]} →</button><aside>${c.editable}</aside>`;
  if(game.step===3)body=`<p>${c.supports[0]}</p><h1>${lang==='es'?'Activa apoyos':'Activate supports'}</h1><h2>${lang==='es'?'Un laboratorio funciona mejor cuando sumas capacidades.':'A lab works better when capabilities are added.'}</h2><div class="kv-pad-list">${supports.map(item=>`<button class="${game.supports.includes(item.id)?'is-selected':''}" data-game-action="support" data-id="${item.id}">${image(item.icon)}<b>${esc(get(item,lang))}</b>${game.supports.includes(item.id)?line():'<i>○</i>'}</button>`).join('')}</div><button class="kv-primary" data-game-action="finish" ${game.supports.length===2?'':'disabled'}>${c.supports[3]} →</button><aside>${game.supports.length} / 2</aside>`;
  if(game.step===4)body=`<p>${lang==='es'?'FINAL':'FINAL'}</p><h1>${lang==='es'?'Misión completada':'Mission complete'}</h1><h2>${lang==='es'?'Completaste el recorrido del minijuego.':'You completed the minigame journey.'}</h2><div class="kv-recap"><span>${image(challenge.icon)}<b>${lang==='es'?'Reto seleccionado':'Selected challenge'}</b>${esc(get(challenge,lang))}</span><span>${image('laboratorio')}<b>${lang==='es'?'Laboratorio':'Lab'}</b>${esc(get(lab,lang))}</span><span>${image('talento')}<b>${lang==='es'?'Apoyos':'Support'}</b>${picked.map(item=>`• ${esc(get(item,lang))}`).join('<br>')}</span></div><button class="kv-primary" data-game-action="restart">${c.result[3]} →</button><button class="kv-secondary" data-game-action="exit">${image('idea')}${c.home}</button><aside>${lang==='es'?'Resumen para la experiencia':'Experience summary'}</aside>`;
   if(game.step===0)body=body.replace('<button class="kv-primary"',`${welcomeArt}<button class="kv-primary"`);
   if(game.step===1||game.step===3)body=body.replace('class="kv-pad-list"','class="kv-pad-list kv-pad-list--visual"');
   if(game.step===4)body=body.replace('<button class="kv-primary"',`${solutionPanel(game,lang)}<button class="kv-primary"`);
   return `<main class="kv-game kv-game--tablet">${padTop(game.step,lang)}<section class="kv-pad-stage">${back(game.step,lang)}<div class="kv-pad-language"><button data-language="es" aria-pressed="${lang==='es'}">ES</button><button data-language="en" aria-pressed="${lang==='en'}">EN</button></div>${body}${insightPanel(lang,game.step)}</section></main>`;
 }
 function transition(raw,action,id){
  const game=sanitize(raw);
  if(action==='start')return {...fresh(),step:1};
  if(action==='mission'&&find(challenges,id))return {...game,mission:id};
  if(action==='go-labs'&&game.mission)return {...game,step:2,lab:null};
  if(action==='lab'&&find(labs,id))return {...game,lab:id};
  if(action==='go-supports'&&game.lab)return {...game,step:3,supports:[]};
  if(action==='support'&&find(supports,id)){const active=game.supports.includes(id)?game.supports.filter(item=>item!==id):game.supports.length<2?[...game.supports,id]:game.supports;return {...game,supports:active};}
  if(action==='finish'&&game.supports.length===2)return {...game,step:4};
  if(action==='back'){if(game.step===4)return {...game,step:3};if(game.step===3)return {...game,step:2};if(game.step===2)return {...game,step:1};if(game.step===1)return fresh();}
  if(action==='restart')return fresh();
  return game;
 }
 return {challenges,labs,supports,fresh,sanitize,transition,renderTV,renderTablet};
})();
