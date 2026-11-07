const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const folder=path.join(__dirname,'..','projects','02-bogota-traffic-prediction');
const data=JSON.parse(fs.readFileSync(path.join(folder,'GAME_DATA.json'),'utf8'));
const network=JSON.parse(fs.readFileSync(path.join(folder,'streets.geojson'),'utf8'));
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(folder,'pulse-vial.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(folder,'exploration.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(folder,'control-center.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(folder,'native-map.js'),'utf8'),context);
const control=context.window.PREDICTTODO_CONTROL;
function onLine(point,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],cross=(point[0]-a[0])*dy-(point[1]-a[1])*dx;return Math.abs(cross)<1e-10&&point[0]>=Math.min(a[0],b[0])-1e-9&&point[0]<=Math.max(a[0],b[0])+1e-9&&point[1]>=Math.min(a[1],b[1])-1e-9&&point[1]<=Math.max(a[1],b[1])+1e-9;}
test('every event has documented OSM streets and simulated hotspots sit on those streets',()=>{
 assert.equal(network.license,'ODbL 1.0');assert.match(network.source,/api\.openstreetmap\.org/);
 assert.ok(network.features.length>1000);
 for(let scenarioIndex=0;scenarioIndex<data.scenarios.length;scenarioIndex++)for(const actionId of [null,...data.actions.map(a=>a.id)]){
  const item=data.scenarios[scenarioIndex],game={phase:'decision',scenarioIndex,hour:item.hour,actionId,playerId:'valentina',results:{}};
  const original=JSON.stringify(game),m=control.model({data,game,language:'en'},network);
  assert.ok(m.active.length>10);
  for(const corridor of m.scene.corridors)assert.ok(m.active.some(f=>f.properties.corridor===corridor));
  const positions=control.hotspotPositions(m.active,m.after.critical,[m.scene.event[1],m.scene.event[0]]);
  assert.equal(positions.length,Math.max(0,item.baseline.critical+(item.effects[actionId]?.critical||0)));
  for(const p of positions)assert.ok(m.active.some(f=>f.geometry.coordinates.some((a,i,points)=>i<points.length-1&&onLine(p,a,points[i+1]))));
  assert.equal(JSON.stringify(game),original);
 }
});
test('tablet and passive TV show the same case, map, indicators and contextual insight',()=>{
 for(const language of ['es','en'])for(const phase of ['explore','decision','result']){
  const game={phase,scenarioIndex:1,hour:17,actionId:phase==='explore'?null:'agents',playerId:'camila',results:{1:100}};
  const tablet=control.render({data,game,language}),tv=control.render({data,game,language,readonly:true,station:2});
  if(phase==='explore'){
   assert.match(tablet,/data-hour/);assert.match(tablet,/cc-time-options--visible/);assert.doesNotMatch(tablet,/<details|<summary/);
  }else assert.doesNotMatch(tablet,/data-hour/);
  assert.match(tablet,/aria-current="step"/);assert.match(tv,/cc-app--tv/);assert.ok([...tv.matchAll(/<(?:button|input)\b[^>]*>/g)].every(m=>m[0].includes(' disabled')));
  for(const html of [tablet,tv])assert.match(html,/data-cc-geography/);
  for(const html of [tablet,tv])assert.match(html,/cc-map-dashboard/);
  assert.ok(tablet.indexOf('cc-map-dashboard')<tablet.indexOf('data-cc-geography'));
  assert.doesNotMatch(tablet,/class="cc-insight"/);assert.match(tv,/class="cc-insight"/);assert.match(tv,/class="cc-notice"/);
  for(const html of [tablet,tv])assert.doesNotMatch(html,/undefined|NaN/);
  if(game.actionId){assert.equal(control.state(data,game).critical,0);assert.equal(control.state(data,game).congestion,51);assert.match(tablet,/data-cc-metric="congestion"[^]*?<b>51/);assert.match(tablet,/data-cc-metric="critical"[^]*?<b>0/);}
 }
});
test('TV mirrors each case and selection without enabling controls or changing game state',()=>{
 for(const language of ['es','en'])for(const phase of ['explore','decision','result'])for(let scenarioIndex=0;scenarioIndex<4;scenarioIndex++){
  const game={phase,scenarioIndex,hour:data.scenarios[scenarioIndex].hour,actionId:phase==='explore'?null:'signals',playerId:'valentina',results:{}};
  const options={data,game,language,readonly:true},original=JSON.stringify(options),html=control.render(options);
  assert.match(html,/cc-app--mirror/);assert.match(html,/cc-map-live/);assert.match(html,/cc-insight/);
  assert.equal((html.match(/class="cc-notice"/g)||[]).length,1);
  assert.ok([...html.matchAll(/<(?:button|input)\b[^>]*>/g)].every(m=>m[0].includes(' disabled')));
  assert.doesNotMatch(html,/undefined|NaN/);assert.equal(JSON.stringify(options),original);
 }
});
test('four cases stay available; the controller guides a choice before confirmation',()=>{
 for(const language of ['es','en']){
  const game={phase:'explore',scenarioIndex:0,hour:16,actionId:null,playerId:'valentina',results:{2:70}},options={data,game,language};
  const overview=control.render(options);
  assert.equal(new Set([...overview.matchAll(/data-scenario="(\d)"/g)].map(m=>m[1])).size,4);assert.match(overview,/data-action="finish-session"/);
  const deciding=control.render({...options,game:{...game,phase:'decision'}});
  assert.match(deciding,/data-action="confirm-decision" disabled/);assert.doesNotMatch(deciding,/cc-event-brief|cc-clue/);
  const preview=control.render({...options,game:{...game,phase:'decision',actionId:'signals'}});
  assert.doesNotMatch(preview,/data-action="confirm-decision" disabled/);
  const tv=control.render({...options,game:{...game,phase:'decision',actionId:'signals'},readonly:true});
  assert.match(tv,/cc-metrics/);assert.equal((tv.match(/class="cc-notice"/g)||[]).length,1);
  const result=control.render({...options,game:{...game,phase:'result',actionId:'signals'}});
  assert.match(result,/class="cc-primary cc-results-button" data-action="finish-session"/);
 }
});

test('corridor exploration is scoped to each case and follows the clock and action without mutating scores',()=>{
 const explore=context.window.PREDICTTODO_EXPLORATION;
 for(let scenarioIndex=0;scenarioIndex<4;scenarioIndex++){
  const item=data.scenarios[scenarioIndex],game={scenarioIndex,hour:item.hour,actionId:null,results:{0:40}};
  const original=JSON.stringify(game),ids=explore.ids(item);
  const selection=explore.selection({data,game,language:'en'});
  assert.ok(ids.length>=2&&ids.length<=4);
  assert.equal(selection.now.congestion,item.baseline.congestion);
  const others=explore.selection({data,game:{...game,selectedCorridor:ids[1]},language:'en'});
  assert.notEqual(others.now.congestion,selection.now.congestion);
  assert.equal(explore.selected(item,'invalid'),ids[0]);
  assert.ok(new Set(explore.profile(data,game,ids[0])).size>1);
  assert.notEqual(explore.values(data,{...game,actionId:'signals'},ids[0]).congestion,selection.now.congestion);
  const html=explore.panel({data,game,language:'en'});
  assert.equal((html.match(/data-corridor=/g)||[]).length,ids.length);
  assert.match(html,/not live traffic/);assert.equal(JSON.stringify(game),original);
 }
});

test('unnamed vector streets are identified by their original geometry rather than an invented route',()=>{
 const explore=context.window.PREDICTTODO_EXPLORATION;
 const game={scenarioIndex:0,hour:16,actionId:null},m=control.model({data,game,language:'en'},network);
 const original=m.active.find(f=>f.properties.corridor==='cali'&&f.properties.highway==='primary');
 assert.equal(explore.identify({properties:{class:'primary'},geometry:original.geometry},m),'cali');
 assert.equal(explore.identify({properties:{class:'primary'},geometry:{type:'LineString',coordinates:[[0,0],[.01,.01]]}},m),undefined);
 assert.equal(explore.identify({properties:{class:'residential'},geometry:original.geometry},m),undefined);
});
test('traffic recolors the native map street layers without changing their source or width',()=>{
 const native=context.window.PREDICTTODO_STREET_MAP,style=JSON.parse(fs.readFileSync(path.join(folder,'map-style.json'),'utf8'));
 const baseline=control.model({data,game:{scenarioIndex:1,hour:17,actionId:null},language:'en'},network);
 const preview=control.model({data,game:{scenarioIndex:1,hour:17,actionId:'agents'},language:'en'},network);
 assert.notEqual(JSON.stringify(native.trafficPaint(baseline)),JSON.stringify(native.trafficPaint(preview)));
 // Exercise the painting API: only existing street color properties may change.
 const quiet=control.model({data,game:{scenarioIndex:3,hour:22,actionId:null},language:'en'},network);
 const untouched=style.layers.map(l=>({id:l.id,source:l.source,sourceLayer:l['source-layer'],width:l.paint?.['line-width']}));
 const changes=[];
 const map={setPaintProperty:(id,key,value)=>{changes.push([id,key]);style.layers.find(l=>l.id===id).paint[key]=value;}};
 native.paint({ready:true,map,roadIds:native.nativeRoadIds,markers:[],node:{dataset:{}},scene:quiet.item.id},quiet);
 assert.equal(changes.length,3);assert.ok(changes.every(([id,key])=>native.nativeRoadIds.includes(id)&&key==='line-color'));
 assert.deepEqual(style.layers.map(l=>({id:l.id,source:l.source,sourceLayer:l['source-layer'],width:l.paint?.['line-width']})),untouched);
 for(const id of native.nativeRoadIds)assert.equal(style.layers.find(l=>l.id===id)['source-layer'],'transportation');
});

test('insights change with the screen, role, case and selected action without altering the game',()=>{
 for(const language of ['es','en']){
  const game={phase:'decision',scenarioIndex:0,hour:16,actionId:null,playerId:'valentina',results:{}};
  const original=JSON.stringify(game),options={data,game,language};
  const actions=data.actions.map(a=>control.insight({...options,game:{...game,actionId:a.id}}));
  assert.equal(new Set(actions).size,4);
  const cases=data.scenarios.map((s,i)=>control.insight({...options,game:{...game,phase:'explore',scenarioIndex:i}}));
  assert.equal(new Set(cases).size,4);
  const roles=data.characters.map(p=>control.insight({...options,game:{...game,phase:'player',playerId:p.id}}));
  assert.equal(new Set(roles).size,4);
  for(const html of [...actions,...cases,...roles])assert.doesNotMatch(html,/undefined|NaN/);
  assert.equal(JSON.stringify(game),original);
 }
});
