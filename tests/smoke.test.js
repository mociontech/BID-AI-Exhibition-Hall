const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');

test('the exhibition registry preserves its eleven projects',()=>{
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared','projects.js'),'utf8'),context);
 assert.equal(context.window.EXHIBITION_PROJECTS.length,11);
});

test('the tablet home intentionally hides SIEMPLEA and uses ten visual positions',()=>{
 const home=fs.readFileSync(path.join(root,'shared','home.js'),'utf8');
 assert.match(home,/visibleProjects=projects\.filter\(project=>project\.id!=='08'\)/);
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
 assert.match(controller,/Costa_Rica_Smart_Borders_03_index\.html/);
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
 assert.match(controller,/data-action="information"/);
 assert.doesNotMatch(controller,/traffic-reference-grid/);
});

test('PredictToDo presents a bilingual mini-game CTA after the information pause',()=>{
 const controller=fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','module.js'),'utf8');
 const display=fs.readFileSync(path.join(root,'shared','display.js'),'utf8');
 assert.match(controller,/infoTimer/);
 assert.match(controller,/},10000\)/);
 assert.match(controller,/infoCtaActive/);
 assert.match(display,/PREDICTTODO .* SIGUIENTE PASO/);
 assert.match(display,/The mini-game is now available/);
 assert.match(display,/data\.mode==='cta'/);
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

test('Pulso Vial offers role-aware decisions and a shared command-center renderer',()=>{
 const game=JSON.parse(fs.readFileSync(path.join(root,'projects','02-bogota-traffic-prediction','GAME_DATA.json'),'utf8'));
 assert.equal(game.characters.length,4);
 assert.ok(game.characters.every(person=>person.bonus?.action&&person.bonus.points>0));
 assert.ok(game.scenarios.every(item=>item.brief_es&&item.clue_es&&item.effects?.signals&&item.effects?.monitor));
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared','pulse-vial.js'),'utf8'),context);
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
});
