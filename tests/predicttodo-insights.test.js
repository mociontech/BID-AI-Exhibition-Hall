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
