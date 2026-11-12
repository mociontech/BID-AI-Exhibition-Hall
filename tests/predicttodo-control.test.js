const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const folder=path.join(__dirname,'..','projects','02-bogota-traffic-prediction');
const data=JSON.parse(fs.readFileSync(path.join(folder,'GAME_DATA.json'),'utf8'));
const network=JSON.parse(fs.readFileSync(path.join(folder,'streets.geojson'),'utf8'));
const context={window:{}};
for(const file of ['icons.js','pulse-vial.js','exploration.js','control-center.js','native-map.js'])vm.runInNewContext(fs.readFileSync(path.join(folder,file),'utf8'),context);
const control=context.window.PREDICTTODO_CONTROL;
const emojis=[...data.scenarios.map(s=>s.icon),...data.actions.map(a=>a.icon),...data.characters.map(c=>c.avatar)];
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
  // Indicators are a tablet instrument; the TV gives that height to the map and shows before → after in its response card.
  assert.match(tablet,/cc-map-dashboard/);assert.doesNotMatch(tv,/cc-map-dashboard/);
  assert.ok(tablet.indexOf('cc-map-dashboard')<tablet.indexOf('data-cc-geography'));
  if(phase==='decision'){assert.equal((tv.match(/<span><small>[^<]+<\/small><b>\d+/g)||[]).length,2);assert.match(tv,/cc-tv-delta/);}else assert.doesNotMatch(tv,/cc-tv-delta/);
  // The TV panel stays short: no case paragraph, no footnotes.
  assert.doesNotMatch(tv,/cc-tv-context-brief|Comparación educativa|Educational comparison|bono del rol|role bonus/);
  // The panel people read first sits before the map on both screens.
  for(const html of [tablet,tv])assert.ok(html.indexOf('class="cc-side"')<html.indexOf('cc-map-panel'));
  assert.doesNotMatch(tablet,/class="cc-insight"/);if(phase==='result')assert.doesNotMatch(tv,/class="cc-insight"/);else assert.match(tv,/class="cc-insight"/);assert.match(tv,/class="cc-notice"/);
  // Touch hints stay on the tablet; after a decision the TV shows how each response scored.
  assert.doesNotMatch(tablet,/cc-tv-compare|cc-tv-delta|cc-city-label/);
  for(const html of [tablet,tv])assert.doesNotMatch(html,/cc-map-explanation|Toca un punto rojo|Tap a red hotspot|Desliza la barra|Drag the slider/);
  assert.match(tv,/cc-city-label/);
  if(phase==='result'){assert.match(tv,/cc-tv-compare/);assert.equal((tv.match(/<em style="width:\d+%"><\/em>/g)||[]).length,4);assert.doesNotMatch(tv,/cc-tv-corridor/);}
  else if(phase==='explore'){assert.doesNotMatch(tv,/cc-tv-compare/);assert.match(tv,/cc-tv-corridor/);}
  else assert.doesNotMatch(tv,/cc-tv-compare|cc-tv-corridor/);
  // Cases, actions and roles are drawn with the outline icon set, never with the GAME_DATA emojis.
  for(const html of [tablet,tv]){assert.match(html,/class="ptd-icon ptd-icon--/);for(const e of emojis)assert.ok(!html.includes(e),'Emoji still rendered: '+e);}
  for(const html of [tablet,tv])assert.doesNotMatch(html,/undefined|NaN/);
  if(game.actionId){assert.equal(control.state(data,game).critical,0);assert.equal(control.state(data,game).congestion,51);assert.match(tablet,/data-cc-metric="congestion"[^]*?<b[^>]*>51/);assert.match(tablet,/data-cc-metric="critical"[^]*?<b[^>]*>0/);}
 }
});
test('TV mirrors each case and selection without enabling controls or changing game state',()=>{
 for(const language of ['es','en'])for(const phase of ['explore','decision','result'])for(let scenarioIndex=0;scenarioIndex<4;scenarioIndex++){
  const game={phase,scenarioIndex,hour:data.scenarios[scenarioIndex].hour,actionId:phase==='explore'?null:'signals',playerId:'valentina',results:{}};
  const options={data,game,language,readonly:true},original=JSON.stringify(options),html=control.render(options);
  assert.match(html,/cc-app--mirror/);assert.match(html,/cc-map-live/);if(phase==='result')assert.doesNotMatch(html,/cc-insight/);else assert.match(html,/cc-insight/);
  assert.equal((html.match(/class="cc-notice"/g)||[]).length,1);
  // Figma 774:52199: no page title, the note sits in the legend row, done steps keep their number, place name unbroken.
  assert.doesNotMatch(html,/class="cc-title"|class="cc-simulation"|✓/);assert.match(html,/class="cc-map-legend">[^]*class="cc-map-note"/);
  assert.equal((html.match(/class="is-done"/g)||[]).length,['explore','decision','result'].indexOf(phase));
  assert.match(html,/<p class="cc-kicker">[^<]+<\/p><h2>[^<]*<span class="cc-(nowrap|accent)">/);
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
  assert.match(tv,/cc-tv-delta/);assert.doesNotMatch(tv,/cc-metrics/);assert.equal((tv.match(/class="cc-notice"/g)||[]).length,1);
  const result=control.render({...options,game:{...game,phase:'result',actionId:'signals'}});
  assert.match(result,/class="cc-primary cc-results-button" data-action="finish-session"/);assert.ok(result.indexOf('data-action="retry"')<result.indexOf('data-action="finish-session"'));
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
 const quiet=control.model({data,game:{scenarioIndex:3,hour:22,actionId:null,mapView:{scenarioIndex:3,center:[-74.05,4.68],zoom:13}},language:'en'},network);
 const untouched=style.layers.map(l=>({id:l.id,source:l.source,sourceLayer:l['source-layer'],width:l.paint?.['line-width']}));
 const changes=[];
 const map={setPaintProperty:(id,key,value)=>{changes.push([id,key]);style.layers.find(l=>l.id===id).paint[key]=value;}};
 native.paint({ready:true,map,roadIds:native.nativeRoadIds,markers:[],node:{dataset:{}},scene:quiet.item.id},quiet);
 assert.equal(changes.length,3);assert.ok(changes.every(([id,key])=>native.nativeRoadIds.includes(id)&&key==='line-color'));
 assert.deepEqual(style.layers.map(l=>({id:l.id,source:l.source,sourceLayer:l['source-layer'],width:l.paint?.['line-width']})),untouched);
 for(const id of native.nativeRoadIds)assert.equal(style.layers.find(l=>l.id===id)['source-layer'],'transportation');
});

test('the real local basemap covers every scenario and uses absolute worker URLs',()=>{
 const native=context.window.PREDICTTODO_STREET_MAP,dir=path.join(folder,'assets','bogota-map');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
 const origin='http://127.0.0.1:4184',prefix=origin+'/projects/02-bogota-traffic-prediction/assets/bogota-map/';
 assert.equal(manifest.license,'ODbL-1.0');
 assert.ok(manifest.tiles.length<=3000&&manifest.bytes<=50*1024*1024);
 const x=(lng,z)=>Math.floor((lng+180)/360*2**z);
 const y=(lat,z)=>Math.floor((1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*2**z);
 for(const scene of Object.values(network.scenes))for(let z=8;z<=14;z++){
  const key=`${z}/${x(scene.event[1],z)}/${y(scene.event[0],z)}`;
  assert.ok(manifest.tiles.includes(key),'Missing real tiles at '+key);
 }
 for(const key of manifest.tiles){
  const [z,x,y]=key.split('/'),url=manifest.tileTemplate.replace('{z}',z).replace('{x}',x).replace('{y}',y);
  assert.equal(native.basemapRequest(url,manifest,origin).url,prefix+'tiles/'+key+'.pbf');
  assert.ok(fs.statSync(path.join(dir,'tiles',key+'.pbf')).size>0);
 }
 assert.equal(native.basemapRequest('https://tiles.openfreemap.org/fonts/Noto%20Sans%20Regular/0-255.pbf',manifest,origin).url,prefix+'fonts/Noto%20Sans%20Regular/0-255.pbf');
 const outside=manifest.tileTemplate.replace('{z}','14').replace('{x}','0').replace('{y}','0');
 assert.equal(native.basemapRequest(outside,manifest,origin).url,outside);
 assert.equal(native.basemapRequest('https://example.com/planet/a/14/0/0.pbf',manifest,origin).url,'https://example.com/planet/a/14/0/0.pbf');
 assert.equal(native.basemapRequest(outside,null,origin).url,outside);
});

test('the overview uses official Bogotá geometry and all scenarios lie inside the city',()=>{
 const geography=JSON.parse(fs.readFileSync(path.join(folder,'assets','bogota-map','geography.geojson'),'utf8'));
 const localities=geography.features.filter(f=>f.properties.kind==='locality'),urban=geography.features.filter(f=>f.properties.kind==='urban');
 assert.equal(localities.length,20);assert.equal(geography.coordinateSystem,'EPSG:4326');
 assert.ok(geography.sources.every(s=>s.startsWith('https://serviciosgis.catastrobogota.gov.co/')));
 assert.equal(geography.license,'CC-BY-4.0');
 const ringContains=(point,ring)=>{let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [x,y]=point,[a,b]=ring[i],[c,d]=ring[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)inside=!inside;
 }return inside;};
 const contains=(feature,point)=>{
  const polygons=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];
  return polygons.some(rings=>ringContains(point,rings[0])&&!rings.slice(1).some(r=>ringContains(point,r)));
 };
 for(const scene of Object.values(network.scenes)){
  const point=[scene.event[1],scene.event[0]];
  assert.ok(urban.some(f=>contains(f,point)),'Scenario is outside official urban Bogotá');
  assert.ok(localities.some(f=>contains(f,point)),'Scenario is outside official Bogotá localities');
 }
 const campin=localities.find(f=>contains(f,[-74.077828,4.645731]));assert.equal(campin.properties.LOCNOMBRE,'TEUSAQUILLO');
 const cali=localities.find(f=>contains(f,[-74.160184,4.637021]));assert.equal(cali.properties.LOCNOMBRE,'KENNEDY');
 const original=JSON.parse(fs.readFileSync(path.join(folder,'map-style.json'),'utf8'));
 const changed=context.window.PREDICTTODO_STREET_MAP.geographicStyle(original,geography,network);
 assert.ok(changed.sources['bogota-geography']);
 assert.equal(changed.sources['bogota-city-name'].data.geometry.type,'Point');
 assert.ok(urban.some(f=>contains(f,changed.sources['bogota-city-name'].data.geometry.coordinates)));
 for(const id of context.window.PREDICTTODO_STREET_MAP.nativeRoadIds){
  assert.equal(JSON.stringify(changed.layers.find(l=>l.id===id)),JSON.stringify(original.layers.find(l=>l.id===id)));
 }
});

test('selecting the same case republishes its framing after the shared camera was cleared',()=>{
 const native=context.window.PREDICTTODO_STREET_MAP,events=[];
 const game={scenarioIndex:3,hour:22,actionId:null,mapView:null};
 const m=control.model({data,game,language:'en'},network);
 context.CustomEvent=function(type,options){this.type=type;this.detail=options.detail;};
 let fits=0;
 const record={ready:true,scene:m.item.id,options:{readonly:false},roadIds:[],markers:[],
  node:{isConnected:true,dataset:{},dispatchEvent:e=>events.push(e)},
  map:{resize(){},fitBounds(){fits++;},getZoom:()=>13.3,getCenter:()=>({lng:-74.054604,lat:4.686191}),getContainer:()=>({clientWidth:800,clientHeight:500})}};
 native.paint(record,m);
 assert.equal(fits,1);assert.equal(events.length,1);assert.equal(events[0].type,'ptd-map-view');
 assert.equal(events[0].detail.scenarioIndex,3);assert.equal(events[0].detail.viewport.width,800);
 assert.equal(game.mapView,null);
 delete context.CustomEvent;
});

test('the tablet guide is a short three-step popup with outline icons, never part of the TV render',()=>{
 const controller=fs.readFileSync(path.join(folder,'module.js'),'utf8');
 assert.match(controller,/close-guide/);assert.match(controller,/guideSeen/);
 for(const language of ['es','en']){
  const html=control.guide(language);
  assert.match(html,/data-cc-guide/);assert.match(html,/role="dialog"/);
  assert.equal((html.match(/<li>/g)||[]).length,3);assert.equal((html.match(/class="ptd-icon/g)||[]).length,4);
  assert.equal((html.match(/data-action="close-guide"/g)||[]).length,2);
  assert.ok(html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').length<400,'guide copy stays short');
  for(const e of emojis)assert.ok(!html.includes(e));
  const tv=control.render({data,game:{phase:'explore',scenarioIndex:0,hour:16,actionId:null,playerId:'valentina',results:{}},language,readonly:true});
  assert.doesNotMatch(tv,/cc-guide/);
 }
});

test('the clock runs in quarter hours: whole hours keep their values and in-between times interpolate',()=>{
 const game={scenarioIndex:1,hour:17,actionId:null,playerId:'camila',results:{}};
 const at=hour=>control.state(data,{...game,hour}).congestion;
 assert.equal(at(17),74);
 for(let h=6;h<23;h+=.25){const lo=Math.min(at(Math.floor(h)),at(Math.ceil(h))),hi=Math.max(at(Math.floor(h)),at(Math.ceil(h)));assert.ok(at(h)>=lo-1&&at(h)<=hi+1,'discontinuity at '+h);}
 assert.equal(control.clock(15.25),'15:15');assert.equal(control.clock(6),'06:00');assert.equal(control.clock(22.75),'22:45');
 assert.equal(control.clock(17,data.scenarios[1]),'17:15');assert.equal(control.clock(17.25,data.scenarios[1]),'17:15');
 assert.equal(control.night(12),0);assert.ok(control.night(22)>control.night(18)&&control.night(18)>0);assert.ok(control.night(6)>0);
 const tablet=control.render({data,game:{...game,phase:'explore'},language:'es'});
 assert.match(tablet,/step="0\.25"/);assert.match(tablet,/cc-time-sky/);assert.match(tablet,/cc-map-sky/);assert.match(tablet,/--cc-night:/);
 assert.match(fs.readFileSync(path.join(__dirname,'..','server.js'),'utf8'),/Math\.round\(value\.hour\*4\)\/4/);
});

test('the TV reproduces the tablet framing through the camera, at its own pixel size',()=>{
 const native=context.window.PREDICTTODO_STREET_MAP;
 const tv=(w,h)=>({options:{readonly:true},node:{clientWidth:w,clientHeight:h}});
 const view={center:[-74.08,4.65],zoom:13,viewport:{width:1000,height:500}};
 assert.equal(native.mirrorZoom(tv(2000,1000),view),14);          // twice the size: one zoom level more
 assert.equal(native.mirrorZoom(tv(2000,500),view),13);           // height is the limiting axis: same zoom
 assert.ok(Math.abs(native.mirrorZoom(tv(1500,1000),view)-(13+Math.log2(1.5)))<1e-9);
 assert.equal(native.mirrorZoom({options:{readonly:false},node:{clientWidth:2000,clientHeight:1000}},view),13);
 assert.equal(native.mirrorZoom(tv(2000,1000),{center:[-74.08,4.65],zoom:13}),13);
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
test('before → after uses one scale; only the after value turns BID green (better) or red (worse)',()=>{
 const expected=(key,b,a)=>b===a?'':(key==='speed'?a>b:a<b)?'is-better':'is-worse';
 const seen=new Set();
 for(const language of ['es','en'])for(let scenarioIndex=0;scenarioIndex<data.scenarios.length;scenarioIndex++)for(const action of data.actions){
  const game={phase:'decision',scenarioIndex,hour:data.scenarios[scenarioIndex].hour,actionId:action.id,playerId:'valentina',results:{}};
  const before=control.state(data,game,null),after=control.state(data,game);
  const tablet=control.render({data,game,language}),tv=control.render({data,game,language,readonly:true});
  for(const [key,unit] of [['congestion','%'],['speed',' km/h'],['critical','']]){
   const want=expected(key,before[key],after[key]);seen.add(want);
   // Same markup for both values: number + unit at the same scale.
   assert.match(tablet,new RegExp(`data-cc-metric="${key}"[^]*?<del>${before[key]}<small>${unit}</small></del>`));
   const cls=tablet.match(new RegExp(`data-cc-metric="${key}"[^]*?<b( class="([^"]+)")?>${after[key]}<small>`))[2]||'';
   assert.equal(cls,want,`${language} ${scenarioIndex} ${action.id} ${key}`);
   if(key==='speed')continue;
   const u=unit?`<em>${unit}</em>`:'';
   assert.match(tv,new RegExp(`<b>${before[key]}${u}<i aria-hidden="true"><svg class="ptd-icon ptd-icon--arrow"[^]*?</svg></i><span class="cc-after${want?' '+want:''}">${after[key]}${u}</span></b>`));
  }
 }
 assert.ok(seen.has('is-better')&&seen.has('is-worse'),'the data covers both outcomes');
});
