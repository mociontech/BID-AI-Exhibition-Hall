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
 assert.ok(fs.existsSync(path.join(folder,'Video','muestra-estacion-teachy-BID.mp4')));
 assert.equal(fs.readdirSync(path.join(folder,'Public')).filter(file=>file.endsWith('.png')).length,4);
 const experience=fs.readFileSync(path.join(folder,'experience.js'),'utf8');
 assert.match(experience,/muestra-estacion-teachy-BID\.mp4/);
 assert.match(experience,/data\.mode==='video'/);
 const controller=fs.readFileSync(path.join(folder,'module.js'),'utf8');
 assert.match(controller,/data-action="video"/);
 assert.doesNotMatch(controller,/teachy-hit--video" type="button" disabled/);
});

test('the tablet home uses ten visual positions',()=>{
 const home=fs.readFileSync(path.join(root,'shared','home.js'),'utf8');
 assert.match(home,/visibleProjects=projects;/);
 assert.match(home,/visibleProjects\.map\(\(p,index\)=>/);
 assert.match(home,/String\(index\+1\)\.padStart\(2,'0'\)/);
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
 assert.ok(fs.existsSync(path.join(project,'public','Imagen de ChatGPT 29 oct 2026, 03_20_42 p.m-3.png')));
 assert.ok(fs.existsSync(path.join(project,'Costa_Rica_Smart_Borders_03_Minigame_Prototipo_ES_EN','Costa_Rica_Smart_Borders_03','camion-frontera.jpg')));
 assert.match(controller,/projectId:'03'/);
 assert.match(controller,/setTimeout\(unlockGame,10000\)/);
 assert.match(controller,/gameReady/);
 assert.match(controller,/prototipo_actual_V5\.html/);
 assert.match(controller,/language==='en'/);
 assert.match(display,/renderCostaRica/);
 assert.match(display,/data\.mode==='cta'/);
 assert.match(server,/Invalid Costa Rica Smart Borders game state/);
});

test('PredictToDo uses only its approved bilingual information pair',()=>{
 const infoDir=path.join(root,'assets','img','predicttodo');
 assert.ok(fs.existsSync(path.join(infoDir,'PredictToDo_Infografia_TV_ES_1920x1080.png')));
 assert.ok(fs.existsSync(path.join(infoDir,'PredictToDo_Infografia_TV_EN_1920x1080.png')));
 assert.ok(fs.existsSync(path.join(infoDir,'PredictToDo_Mapa_Satelital_Simulado.png')));
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared','bogota-traffic.js'),'utf8'),context);
 assert.match(context.window.BOGOTA_TRAFFIC.infoImagePath('es'),/PredictToDo_Infografia_TV_ES_1920x1080\.png$/);
 assert.match(context.window.BOGOTA_TRAFFIC.infoImagePath('en'),/PredictToDo_Infografia_TV_EN_1920x1080\.png$/);
 assert.match(context.window.BOGOTA_TRAFFIC.SATELLITE_MAP_IMAGE,/PredictToDo_Mapa_Satelital_Simulado\.png$/);
 const controller=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','module.js'),'utf8');
 const visual=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','visual.js'),'utf8');
 assert.match(controller,/PREDICTTODO_VISUAL\.landing/);
 assert.ok(fs.existsSync(path.join(root,'projects','02-bogota-traffic-prediction','predicttodoImages','fondoprincipal.png')));
 assert.match(visual,/fondoprincipal\.png/);
 assert.match(visual,/data-action="information"/);
 assert.match(visual,/data-action="open-game"/);
 assert.match(visual,/data-action="back-information"/);
 assert.doesNotMatch(controller,/traffic-reference-grid/);
});

test('PredictToDo keeps information ungated and announces game entry unobtrusively',()=>{
 const controller=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','module.js'),'utf8');
 const display=fs.readFileSync(path.join(root,'shared','display.js'),'utf8');
 assert.doesNotMatch(controller,/infoTimer|infoCtaActive|10000|90000/);
 assert.match(controller,/mode:state\.informationActive\?'overview':state\.mode/);
 assert.match(display,/PREDICTTODO_INSIGHTS\.information/);
 assert.match(display,/PREDICTTODO_INSIGHTS\.gameView/);
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
  assert.match(result,/data-action="exit-game"/);
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
 assert.match(script,/Así era antes en Peñas Blancas/);
 assert.match(script,/How it used to be at Peñas Blancas/);
 assert.match(script,/330\.000 registros históricos/);
 assert.match(script,/330,000 historical trade records/);
 assert.match(script,/Selección aleatoria/);
 assert.match(script,/El semáforo de riesgo/);
 assert.match(script,/ya está en producción/);
 assert.match(script,/data-act="pop:place"/);
 assert.match(script,/data-act="pop:real"/);
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
