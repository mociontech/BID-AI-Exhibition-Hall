const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');

test('the exhibition registry has ten projects and only one Teachy at 08',()=>{
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared','projects.js'),'utf8'),context);
 const projects=context.window.EXHIBITION_PROJECTS;
 assert.equal(projects.length,10);
 assert.equal(projects.filter(project=>project.slug==='teachy').length,1);
 assert.equal(projects.find(project=>project.slug==='teachy').id,'08');
});

test('Teachy ships its supplied tablet, infographic and video resources',()=>{
 const folder=path.join(root,'projects','08-teachy');
 const video=path.join(folder,'Video','Teachy_Musica_v2_web.mp4');
 assert.ok(fs.existsSync(video));
 assert.ok(fs.statSync(video).size<100*1024*1024,'GitHub rejects files over 100 MB');
 for(const [file,width,height] of [['teachy-portada-en.png',1672,941],['teachy-infografia-en.png',1920,1080],['teachy-infografia-base.png',1920,1080]]){
  const png=fs.readFileSync(path.join(folder,'Public',file));
  assert.equal(png.readUInt32BE(16),width);assert.equal(png.readUInt32BE(20),height);
 }
 const experience=fs.readFileSync(path.join(folder,'experience.js'),'utf8');
 assert.match(experience,/Teachy_Musica_v2_web\.mp4/);
 assert.match(experience,/data\.mode==='video'/);
 assert.match(experience,/data\.mode==='info'/);
 const controller=fs.readFileSync(path.join(folder,'module.js'),'utf8');
 assert.match(controller,/data-action="video"/);
 assert.match(controller,/data-action="information"/);
 assert.match(controller,/data-action="back"/);
 assert.match(controller,/data-action="home"/);
 assert.doesNotMatch(controller,/teachy-hit--video" type="button" disabled/);
});

test('the tablet home uses ten visual positions',()=>{
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared','projects.js'),'utf8'),context);
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared','home-art.js'),'utf8'),context);
 const html=context.window.EXHIBITION_HOME.render({interactive:true,stationQuery:'?station=1'});
 assert.equal((html.match(/data-project="/g)||[]).length,10);
 assert.match(html,/assets\/home\/tablet-en\.png/);
 for(const device of ['tablet','display']){
  const artwork=fs.readFileSync(path.join(root,'assets','home',device+'-en.png'));
  assert.equal(artwork.readUInt32BE(16),1920);
  assert.equal(artwork.readUInt32BE(20),1080);
 }
});

test('AquaData game controller and supplied resources are available',()=>{
 const controller=fs.readFileSync(path.join(root,'projects','01-aquadata','module.js'),'utf8');
 const folder=path.join(root,'projects','01-aquadata','AquaData_12_Imagenes_Ligeras_JPG');
 assert.ok(fs.existsSync(path.join(folder,'contratos_ficticios.json')));
 assert.ok(fs.existsSync(path.join(folder,'hallazgos_simulados_DEMO.json')));
 assert.equal(fs.readdirSync(path.join(folder,'negocios')).filter(file=>file.endsWith('.jpg')).length,8);
 assert.match(controller,/analysisReady/);
 assert.match(controller,/p1Result/);
 assert.match(controller,/p2Result/);
});

test('Costa Rica Smart Borders keeps its tablet home visual and unlocks the supplied game after the CTA',()=>{
 const project=path.join(root,'projects','03-costa-rica-smart-borders');
 const controller=fs.readFileSync(path.join(project,'module.js'),'utf8');
 const display=fs.readFileSync(path.join(root,'shared','display.js'),'utf8');
 const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
 assert.ok(fs.existsSync(path.join(project,'public','Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-1.png')));
 assert.ok(fs.existsSync(path.join(project,'public','cover-en-1920x1080.png')));assert.ok(fs.existsSync(path.join(project,'public','info-en-1920x1080.png')));
 assert.ok(fs.existsSync(path.join(project,'Costa_Rica_Smart_Borders_03_Minigame_Prototipo_ES_EN','Costa_Rica_Smart_Borders_03','camion-frontera.jpg')));
 assert.match(controller,/projectId:'03'/);
 assert.doesNotMatch(controller,/setTimeout\(unlockGame|10000/);
 assert.match(controller,/gameReady:true/);
 assert.match(controller,/prototipo_actual_V5\.html/);
 assert.match(controller,/CRB_COVER\(state\.language/); // portada HTML compartida tableta/TV (prueba1.png)
 assert.ok(fs.existsSync(path.join(project,'cover.js')));assert.ok(fs.existsSync(path.join(project,'public','cover-truck.jpg')));
 assert.match(fs.readFileSync(path.join(project,'index.html'),'utf8'),/cover\.js/);
 assert.match(display,/window\.CRB_COVER\(language/);assert.match(fs.readFileSync(path.join(root,'display.html'),'utf8'),/03-costa-rica-smart-borders\/cover\.js/);
 // Tarjeta «Video»: la TV reproduce el video comprimido (<100 MB para GitHub)
 assert.match(display,/03-costa-rica-smart-borders\/video\/PenasBlancas_web\.mp4/);
 assert.ok(fs.statSync(path.join(project,'video','PenasBlancas_web.mp4')).size<95*1024*1024);
 assert.match(controller,/displayMode:'video'/);
 assert.match(display,/renderCostaRica/);
 assert.match(display,/data\.mode==='info'\|\|data\.mode==='cta'/);
 assert.match(server,/Invalid Costa Rica Smart Borders game state/);
});

test('PredictToDo information uses the new client-supplied 1920 x 1080 PNG',()=>{
 const imagePath='projects/02-bogota-traffic-prediction/assets/PredictToDo_Infographic_2026-11-v2_1920x1080.png';
 const basePath='projects/02-bogota-traffic-prediction/assets/PredictToDo_Infographic_2026-11-v2_base.png';
 // The supplied sheet and its content-erased copy (the animation's background) share the same 1920 × 1080 grid.
 for(const file of [imagePath,basePath]){
  const artwork=fs.readFileSync(path.join(root,file));
  assert.equal(artwork.readUInt32BE(16),1920,file);assert.equal(artwork.readUInt32BE(20),1080,file);
 }
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared','bogota-traffic.js'),'utf8'),context);
 assert.equal(context.window.BOGOTA_TRAFFIC.infoImagePath('es'),imagePath);
 assert.equal(context.window.BOGOTA_TRAFFIC.infoImagePath('en'),imagePath);
 assert.equal(context.window.BOGOTA_TRAFFIC.INFO_SHEET.image,imagePath);
 assert.equal(context.window.BOGOTA_TRAFFIC.INFO_SHEET.base,basePath);
 assert.match(context.window.BOGOTA_TRAFFIC.SATELLITE_MAP_IMAGE,/PredictToDo_Mapa_Satelital_Simulado\.png$/);
 const controller=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','module.js'),'utf8');
 const visual=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','visual.js'),'utf8');
 assert.match(controller,/PREDICTTODO_VISUAL\.landing/);
 // November 2026 main menu: the supplied 1920 × 1080 artwork on the tablet (touch zones over the cards and Home, Back
 // while the TV shows the sheet) and the same artwork without the Home pill on the TV. English only: no ES/EN anywhere.
 for(const file of ['menu-principal-en.png','menu-principal-tv.png']){
  const artwork=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','predicttodoImages',file));
  assert.equal(artwork.readUInt32BE(16),1920,file);assert.equal(artwork.readUInt32BE(20),1080,file);
 }
 const menuContext={window:{},URL,document:{currentScript:{src:'http://127.0.0.1/projects/02-bogota-traffic-prediction/visual.js'}}};
 vm.runInNewContext(visual,menuContext);
 const menu=menuContext.window.PREDICTTODO_VISUAL;
 const tablet=menu.landing('en'),withSheet=menu.landing('en',{informationActive:true}),tv=menu.landing('en',{readonly:true});
 assert.match(tablet,/menu-principal-en\.png/);assert.match(tv,/menu-principal-tv\.png/);
 for(const action of ['information','open-game','home'])assert.match(tablet,new RegExp(`data-action="${action}"`));
 assert.doesNotMatch(tablet,/back-information/);assert.match(withSheet,/data-action="back-information"/);
 assert.doesNotMatch(tv,/<button|data-action/);
 assert.match(tv,/class="ptd-menu-cta" role="status">.*Select an option on the tablet/);assert.doesNotMatch(tablet+withSheet,/ptd-menu-cta/);
 for(const html of [tablet,withSheet,tv])assert.doesNotMatch(html,/data-language/);
 assert.doesNotMatch(controller,/data-language/);
 assert.doesNotMatch(controller,/traffic-reference-grid/);
});

test('PredictToDo keeps information ungated and announces game entry unobtrusively',()=>{
 const controller=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','module.js'),'utf8');
 const display=fs.readFileSync(path.join(root,'shared','display.js'),'utf8');
 assert.doesNotMatch(controller,/infoTimer|infoCtaActive|10000|90000/);
 assert.match(controller,/mode:state\.informationActive\?'overview':state\.mode/);
 assert.match(display,/PREDICTTODO_INSIGHTS\.information/);
 assert.match(display,/PREDICTTODO_INSIGHTS\.renderGameInto/);
 assert.doesNotMatch(display,/bogota-cta-overlay/);
});

test('PredictToDo game data has four configurable simulated scenarios',()=>{
 const game=JSON.parse(fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','GAME_DATA.json'),'utf8'));
 assert.equal(game.scenarios.length,4);
 assert.equal(game.actions.length,4);
 for(const scenario of game.scenarios){
  assert.match(scenario.time,/^\d{2}:\d{2}$/);
  assert.deepEqual(Object.keys(scenario.scores).sort(),['agents','monitor','reversible','signals']);
  for(const score of Object.values(scenario.scores))assert.ok(Number.isInteger(score)&&score>=0&&score<=100);
 }
 const controller=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','module.js'),'utf8');
 assert.match(controller,/GAME_DATA\.json/);
 assert.match(controller,/'final'/);
});

test('Pulso Vial offers role-aware decisions in the project 02 renderer',()=>{
 const game=JSON.parse(fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','GAME_DATA.json'),'utf8'));
 assert.equal(game.characters.length,4);
 assert.ok(game.characters.every(person=>person.bonus?.action&&person.bonus.points>0));
 assert.ok(game.scenarios.every(item=>item.brief_es&&item.clue_es&&item.effects?.signals&&item.effects?.monitor));
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','pulse-vial.js'),'utf8'),context);
 const gameState={phase:'decision',playerId:'andres',playerName:'Daniela',hour:17,scenarioIndex:1,actionId:'agents',results:{}};
 const screen=context.window.PULSE_VIAL.render({data:game,game:gameState,language:'es',readonly:false});
 assert.match(screen,/pulse-city-map/);
 assert.match(screen,/pulse-city-map--gps/);
 assert.match(screen,/pulse-satellite-base/);
 assert.match(screen,/PredictToDo_Mapa_Satelital_Simulado\.png/);
 assert.match(screen,/preserveAspectRatio="xMidYMid slice"/);
 assert.match(screen,/pulse-road-underlay/);
 assert.match(screen,/pulse-route-overlay/);
 assert.match(screen,/data-pulse-live-map/);
 assert.equal(typeof context.window.PULSE_VIAL.mountLiveMap,'function');
 const controller=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','module.js'),'utf8');
 const display=fs.readFileSync(path.join(root,'shared','display.js'),'utf8');
 assert.match(controller,/PULSE_VIAL\.renderInto/);
 assert.match(display,/PULSE_VIAL\.renderInto/);
 const routes=JSON.parse(fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','road-routes.json'),'utf8')).routes;
 for(const item of game.scenarios){
  assert.ok(routes[item.id].length>10);
  assert.ok(routes[item.id].every(([lat,lng])=>lat>4&&lat<5&&lng>-75&&lng<-73));
 }
 assert.match(screen,/Av\. Ciudad de Cali/);
 assert.match(screen,/Autopista Norte/);
 assert.match(screen,/Referencia vial de Bogota/);
 assert.match(screen,/data-hour/);
 assert.match(screen,/data-action-choice="agents"/);
 assert.match(screen,/Aplicar decisión/);
  assert.equal(context.window.PULSE_VIAL.roleScore(game,gameState,game.scenarios[1],'agents'),100);
  const oneResult={...gameState,results:{1:100}};
  const result=context.window.PULSE_VIAL.render({data:game,game:{...oneResult,phase:'result'},language:'en',readonly:false});
  assert.match(result,/data-action="choose-event"/);
  assert.match(result,/data-action="finish-session"/);
  // The tablet bar carries only the Home pill (no ES/EN switch).
  assert.match(result,/data-action="home"/);
  assert.doesNotMatch(result,/data-language/);
  const explore=context.window.PULSE_VIAL.render({data:game,game:{...oneResult,phase:'explore',actionId:null},language:'en',readonly:false});
  assert.equal((explore.match(/data-scenario="\d"/g)||[]).length,4);
  assert.doesNotMatch(explore,/data-scenario="\d" disabled/);
  const final=context.window.PULSE_VIAL.render({data:game,game:{...oneResult,phase:'final',actionId:null},language:'en',readonly:false});
  assert.match(final,/100<small>\/100<\/small>/);
  assert.equal((final.match(/<article>/g)||[]).length,1);
  assert.match(final,/data-action="resume-events"/);
});

test('Costa Rica Smart Borders ships the redesigned bilingual mini-game and keeps the TV on the information sheet',()=>{
 const game=path.join(root,'projects','03-costa-rica-smart-borders','game');
 assert.ok(fs.existsSync(path.join(game,'index.html')));
 assert.ok(fs.existsSync(path.join(game,'game.css')));
 const script=fs.readFileSync(path.join(game,'game.js'),'utf8');
 const controller=fs.readFileSync(path.join(root,'projects','03-costa-rica-smart-borders','module.js'),'utf8');
 assert.ok(controller.includes("./game/index.html"));
 for(const screen of ['intro','manual','ai','results'])assert.match(script,new RegExp(screen+':screen'));
 assert.match(script,/Tu tiempo/);
 assert.match(script,/Your time/);
 assert.match(script,/Manifiesto de carga/);
 assert.match(script,/Declaración aduanera/);
 assert.match(script,/Falta un documento/);
 assert.match(script,/no abre el camión/);
 assert.match(script,/Se trata de priorizar mejor/);
 assert.match(script,/It is about prioritizing better/);
 assert.match(script,/data-act="home"/);
 assert.match(script,/id="es"/);
 assert.match(script,/id="en"/);
 // Fuera del juego el paquete no lleva estado; dentro, lleva solo el resumen (etapa, semáforos, cronómetro), nunca documentos.
 assert.match(controller,/game:null/);
});

test('Costa Rica Smart Borders mini-game carries bilingual VUCE 3.0 project popups (Peñas Blancas, three mechanisms, risk traffic light, real-life stage)',()=>{
 const script=fs.readFileSync(path.join(root,'projects','03-costa-rica-smart-borders','game','game.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'projects','03-costa-rica-smart-borders','game','game.css'),'utf8');
 for(const key of ['place','how','light','real'])assert.match(script,new RegExp(`${key}:\{title:`));
 assert.match(script,/El reto en Peñas Blancas/);assert.match(script,/solTitle:'Lo que hace VUCE 3.0'/);
 assert.match(script,/The challenge at Peñas Blancas/);
 assert.match(script,/330\.000 registros históricos/);
 assert.match(script,/330,000 historical trade records/);
 assert.match(script,/Selección aleatoria/);
 assert.match(script,/El semáforo de riesgo/);
 assert.match(script,/ya está en producción/);
 // Rebrand de Figma (nov 2026): Peñas Blancas se abre solo al cruzar; «Cómo explorar» abre «¿Cómo se juega?»
 assert.match(script,/openModal\('place'\)/);
 assert.match(script,/data-act="pop:play"/);
 assert.match(script,/data-tap="inst"/);
 assert.match(css,/\.modal\{position:fixed/);
 assert.match(css,/\.light--red/);
});

test('Costa Rica Smart Borders mini-game decides with the VUCE risk traffic light and shows project facts',()=>{
 const script=fs.readFileSync(path.join(root,'projects','03-costa-rica-smart-borders','game','game.js'),'utf8');
 const css=fs.readFileSync(path.join(root,'projects','03-costa-rica-smart-borders','game','game.css'),'utf8');
 assert.match(script,/play:\{title:'¿Cómo se juega\?'/);
 assert.match(script,/play:\{title:'How to play\?'/);
 assert.match(script,/lights:\{green:\{name:'Verde'/);
 assert.match(script,/lights:\{green:\{name:'Green'/);
 assert.match(script,/function expected\(c\)\{return c\.issue\?'red':c\.missing\?'yellow':'green';\}/);
 assert.match(script,/act==='green'\|\|act==='yellow'\|\|act==='red'/);
 assert.match(script,/factsTitle:'Datos de VUCE 3\.0/);
 assert.match(script,/360\.000/);
 assert.match(script,/class="info-btn"/);
 assert.match(css,/\.facts-grid/);
 assert.match(css,/\.btn--yellow/);
});

test('Costa Rica Smart Borders mini-game drives one truck through 3 agency stops and merges them into a single VUCE 3.0 stop with the AI',()=>{
 const project=path.join(root,'projects','03-costa-rica-smart-borders');
 const game=fs.readFileSync(path.join(project,'game','game.js'),'utf8');
 const css=fs.readFileSync(path.join(project,'game','game.css'),'utf8');
 const tv=fs.readFileSync(path.join(project,'tv.js'),'utf8');
 const tvCss=fs.readFileSync(path.join(project,'module.css'),'utf8');
 const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
 // Un camión, tres instituciones (paradas) y una sola ventanilla con la IA
 for(const key of ['aduana','policia','salud','animal','vegetal'])assert.ok(game.includes("key:'"+key+"'"));
 assert.ok(game.includes("steps:['Llega un camión','Tú revisas: 5 paradas','La IA revisa: 1 parada','Comparación']"));
 assert.ok(game.includes("steps:['A truck arrives','You check: 5 stops','AI checks: 1 stop','Comparison']"));
 assert.ok(game.includes('Parada {i} de 5'));
 assert.ok(game.includes('una sola ventanilla'));
 assert.ok(game.includes("phase='merging'"));
 assert.ok(game.includes('const SIM={stop:20,ai:5}'));
 // La tableta solo interactúa (aviso "Mira la TV" y pasos de la IA); el camión y la unión de cajas viven en la TV
 assert.ok(game.includes('function tvCue('));
 assert.ok(game.includes("aiSteps:['Una sola ventanilla'"));
 assert.ok(game.includes('explain,'));
 assert.ok(!game.includes('stripHtml'));
 assert.ok(css.includes('.ai-steps li.current'));
 assert.ok(tv.includes('crtv-explain'));
 assert.ok(tvCss.includes('.crtv-gate.is-open .crtv-bar'));
 assert.ok(tvCss.includes('.crtv-rig.is-moving .crtv-wheel'));
 // Paquete v:2 con posición del camión; la TV anima el recorrido y la unión de las 3 cajas
 assert.ok(game.includes('return {v:2,screen'));
 assert.ok(game.includes('pos:state.pos,moving:state.moving'));
 assert.ok(tv.includes('data-crtv-rig'));
 assert.ok(tv.includes('crtv-booth--vuce'));
 assert.ok(tv.includes("classList.add('is-merged','is-animating')"));
 assert.ok(tvCss.includes('.crtv-scene.is-merged .crtv-booth--vuce'));
 assert.ok(server.includes('![1,2].includes(value.v)'));
});

test('Costa Rica Smart Borders mirrors the mini-game on the TV through the station state (no documents, only stage, lights and clocks)',()=>{
 const project=path.join(root,'projects','03-costa-rica-smart-borders');
 const game=fs.readFileSync(path.join(project,'game','game.js'),'utf8');
 const controller=fs.readFileSync(path.join(project,'module.js'),'utf8');
 const tv=fs.readFileSync(path.join(project,'tv.js'),'utf8');
 const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
 const display=fs.readFileSync(path.join(root,'shared','display.js'),'utf8');
 const html=fs.readFileSync(path.join(root,'display.html'),'utf8');
 assert.ok(game.includes('function tvPacket()'));
 assert.ok(game.includes("postMessage({type:'cr-game',game:tvPacket()}"));
 const mirror=game.slice(game.indexOf('function tvPacket'));
 assert.ok(!mirror.includes('docValue(')&&!mirror.includes('DOCS.map'),'the TV packet must never carry document contents');
 assert.ok(controller.includes("data.type!=='cr-game'"));
 assert.ok(controller.includes('game:isGame?gameState:null'));
 assert.ok(server.includes('function cleanCostaRica'));
 assert.match(server,/Invalid Costa Rica Smart Borders game state/);
 assert.ok(display.includes('window.CRB_TV.render(app,data.game)'));
 assert.ok(html.includes('projects/03-costa-rica-smart-borders/tv.js'));
 assert.ok(tv.includes('window.CRB_TV={render,stop}'));
 assert.ok(tv.includes('data-crtv-clock'));
});
