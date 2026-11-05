const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const project=path.join(__dirname,'..','projects','02-bogota-traffic-prediction');
const data=JSON.parse(fs.readFileSync(path.join(project,'GAME_DATA.json'),'utf8'));
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(project,'pulse-vial.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(project,'insights.js'),'utf8'),context);
const insights=context.window.PREDICTTODO_INSIGHTS;

test('PredictToDo TV guides every phase in both languages without changing game state',()=>{
 for(const language of ['es','en'])for(const phase of ['intro','player','explore','decision','result','final']){
  const game={phase,playerId:'andres',playerName:'<script>alert(1)</script>',hour:17,scenarioIndex:1,actionId:'agents',results:{1:100}};
  const before=JSON.stringify(game);
  const html=insights.gameView({data,game,language,station:3});
  assert.match(html,/class="ptd-tv-cta"/);
  assert.match(html,language==='es'?/EN LA TABLETA/:/ON THE TABLET/);
  assert.match(html,/03/);
  assert.doesNotMatch(html,/<button|<input|<script>/);
  assert.equal(JSON.stringify(game),before);
  if(phase==='decision')assert.ok(html.includes(data.actions.find(a=>a.id==='agents')[language]));
  if(phase==='result'||phase==='final')assert.match(html,/100<small>\/100/);
 }
});

test('PredictToDo project facts stay bilingual and TV choices follow the selected event',()=>{
 assert.equal(insights.facts.es.length,insights.facts.en.length);
 for(const language of ['es','en'])for(let i=0;i<data.scenarios.length;i++){
  const html=insights.gameView({data,game:{phase:'explore',scenarioIndex:i},language});
  assert.ok(html.includes(data.scenarios[i]['title_'+language]));
  assert.doesNotMatch(html,/undefined|NaN/);
 }
});

test('simulated hotspot markers match the counter for every event and action, including zero',()=>{
 for(const language of ['es','en'])for(let scenarioIndex=0;scenarioIndex<data.scenarios.length;scenarioIndex++){
  const item=data.scenarios[scenarioIndex];
  for(const actionId of [null,...data.actions.map(action=>action.id)]){
   const game={phase:'decision',scenarioIndex,actionId,playerId:'valentina',hour:item.hour,results:{}};
   const before=JSON.stringify(game);
   const html=context.window.PULSE_VIAL.render({data,game,language});
   const expected=Math.max(0,item.baseline.critical+(item.effects[actionId]?.critical||0));
   assert.equal((html.match(/class="pulse-critical-marker"/g)||[]).length,expected);
   assert.ok(html.includes(`data-critical-count="${expected}"`));
   assert.equal(Number(html.match(/data-meter="critical"><span>[^<]*<\/span><strong>(\d+)/)[1]),expected);
   assert.equal(JSON.stringify(game),before);
   if(!expected)assert.match(html,language==='es'?/No hay puntos críticos/:/No congestion hotspots/);
  }
 }
});
