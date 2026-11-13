const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const project=path.join(__dirname,'..','projects','02-bogota-traffic-prediction');
const data=JSON.parse(fs.readFileSync(path.join(project,'GAME_DATA.json'),'utf8'));
const context={window:{}};
for(const file of ['icons.js','pulse-vial.js','exploration.js','control-center.js','insights.js'])vm.runInNewContext(fs.readFileSync(path.join(project,file),'utf8'),context);
const insights=context.window.PREDICTTODO_INSIGHTS;
// GAME_DATA keeps its emoji ids; on screen every one of them must be drawn as an outline icon.
const emojis=[...data.scenarios.map(s=>s.icon),...data.actions.map(a=>a.icon),...data.characters.map(c=>c.avatar)];
const noEmoji=html=>emojis.forEach(e=>assert.ok(!html.includes(e),'Emoji still rendered: '+e));

test('PredictToDo TV guides every phase in both languages without changing game state',()=>{
 for(const language of ['es','en'])for(const phase of ['intro','player','explore','decision','result','final']){
  const game={phase,playerId:'andres',playerName:'<script>alert(1)</script>',hour:17,scenarioIndex:1,actionId:'agents',results:{1:100}};
  const before=JSON.stringify(game);
  const html=insights.gameView({data,game,language,station:3});
  if(phase==='player'){
   assert.equal((html.match(/data-role-mirror=/g)||[]).length,4);
   assert.match(html,/pulse-name-mirror/);assert.match(html,/is-selected" data-role-mirror="andres"/);
  }
  assert.ok([...html.matchAll(/<(?:button|input)\b[^>]*>/g)].every(m=>m[0].includes(' disabled')));
  assert.doesNotMatch(html,/<script>/);
  assert.equal(JSON.stringify(game),before);
  // The TV carries no navigation pills; Menu and Back are tablet controls.
  assert.doesNotMatch(html,/pulse-command-exit|ptd-stage-back/);
  noEmoji(html);assert.match(html,/class="ptd-icon/);
  // The opening is a short visual guide; the strongest figures wait for the closing screen.
  if(phase==='intro'){assert.match(html,/ptd-tv-guide/);assert.equal((html.match(/ptd-guide-icon/g)||[]).length,4);assert.doesNotMatch(html,/ptd-story-stats|cc-insight/);}
  if(phase==='player'){assert.match(html,/ptd-role-hero/);assert.doesNotMatch(html,/data-name|<input|ptd-story-card/);}
  if(phase==='decision')assert.match(html,/data-observed-action="agents"/);
  if(phase==='result'){assert.match(html,/100<small>\/100/);assert.equal((html.match(/class="cc-tv-compare/g)||[]).length,1);assert.doesNotMatch(html,/cc-tv-response/);}
  if(phase==='final'){assert.match(html,/100<small>\/100/);assert.match(html,/ptd-story-impact/);assert.match(html,/12 h/);assert.doesNotMatch(html,/data-action=/);}
 }
});

test('PredictToDo project facts reach the TV closing and the tablet keeps no facts dialog',()=>{
 const controller=fs.readFileSync(path.join(project,'module.js'),'utf8');
 assert.doesNotMatch(controller,/attachFacts|ptd-facts/);
 assert.match(controller,/IDLE_MS/);
 for(const language of ['es','en']){
  const stats=insights.story('stats',language),impact=insights.story('impact',language);
  assert.match(stats,/12 h/);assert.match(stats,/15 min/);assert.match(stats,/20 TB/);assert.match(stats,language==='es'?/139\.000\+/:/139,000\+/);
  assert.match(impact,/ptd-story-stats/);assert.match(impact,new RegExp(insights.facts[language][0][1]));
  for(const html of [stats,impact])assert.doesNotMatch(html,/undefined|NaN|<button/);
 }
});

test('PredictToDo icons: Figma glyphs for cases, actions, steps and tablet figures; outline marks for TV roles',()=>{
 const icons=context.window.PREDICTTODO_ICONS;
 const scenarios=data.scenarios.map(s=>icons.scenario(s.id)),actions=data.actions.map(a=>icons.action(a.id)),steps=[0,1,2,3].map(i=>icons.step(i));
 const avatars=data.characters.map(c=>icons.avatar(c.id)),roles=data.characters.map(c=>icons.role(c.id));
 for(const set of [scenarios,actions,steps,roles])assert.equal(new Set(set).size,4);
 // Figma draws two role figures for the tablet: Valentina and Camila share one, Santiago and Andrés the other.
 assert.equal(new Set(avatars).size,2);
 for(const svg of [...scenarios,...actions,...steps,...avatars,icons.glyph('arrow'),icons.glyph('screen')]){
  assert.match(svg,/^<svg class="ptd-icon ptd-icon--[a-z-]+" viewBox="[\d. ]+" fill="none" aria-hidden="true"><path /);
  // Recolourable and safe to repeat on one page: no hard-coded colours, masks or ids.
  assert.match(svg,/currentColor/);assert.doesNotMatch(svg,/<text|<image|fill="#|stroke="#|<mask|<use|\sid=/);
 }
 for(const svg of roles){assert.match(svg,/^<svg class="ptd-icon ptd-icon--[a-z]+" viewBox="0 0 24 24" fill="none" stroke="currentColor"/);assert.doesNotMatch(svg,/<text|<image|fill="#/);}
});

test('PredictToDo project facts stay bilingual and TV choices follow the selected event',()=>{
 assert.equal(insights.facts.es.length,insights.facts.en.length);
 for(const language of ['es','en'])for(let i=0;i<data.scenarios.length;i++){
  const html=insights.gameView({data,game:{phase:'explore',scenarioIndex:i},language});
  assert.match(html,/cc-tv-corridor/);assert.match(html,/cc-chart-flow/);assert.doesNotMatch(html,/cc-map-dashboard/);assert.match(html,new RegExp('data-observed-case="'+i+'"'));assert.doesNotMatch(html,/data-scenario=|data-action-choice=/);
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

test('PredictToDo information assembles the supplied infographic from crops and ends on the PNG itself',()=>{
 vm.runInNewContext(fs.readFileSync(path.join(project,'..','..','shared','bogota-traffic.js'),'utf8'),context);
 const sheet=context.window.BOGOTA_TRAFFIC.INFO_SHEET;
 for(const language of ['es','en']){
  const html=insights.information({language,image:sheet.image,label:'PredictToDo: Information'});
  assert.match(html,/class="ptd-tv-information ptd-tv-information--sheet" lang="(es|en)"/);
  assert.match(html,/class="ptd-sh is-animated"/);
  // Blue panel, both card frames and the impact bar come from the erased copy;
  // logo, title, subtitle, unit, 2 × (heading, icon, text), impact title, 2 dividers, 3 figures, 3 labels, QR and 3 repo lines from the PNG.
  assert.equal((html.match(/ptd-sh-crop--base/g)||[]).length,4);
  assert.equal((html.match(/ptd-sh-crop--full/g)||[]).length,23);
  // Every crop stays inside the 1920 × 1080 sheet.
  const crops=[...html.matchAll(/--w:(\d+);--h:(\d+);[^"]*"><i class="ptd-sh-crop ptd-sh-crop--\w+" style="--sx:(\d+);--sy:(\d+)"/g)];
  assert.equal(crops.length,27);
  for(const [,w,h,x,y] of crops)assert.ok(+x+ +w<=1920&&+y+ +h<=1080,`${x},${y} ${w}×${h}`);
  // The last frame is the supplied PNG itself, with the guidance pill on top.
  assert.ok(html.includes(`class="ptd-sh-final" src="${sheet.image}" width="1920" height="1080"`));
  assert.match(html,language==='es'?/Experiencia interactiva/:/Interactive experience/);
  // v2: the GitHub QR and its three lines sit in a white card of the blue panel; the guidance pill is the 13 Nov reference.
  assert.match(html,/class="ptd-sh-el ptd-sh-qrcard" style="--x:166;--y:856;--w:433;--h:158"/);
  assert.match(html,/<footer class="ptd-sh-cta">/);assert.doesNotMatch(html,/ptd-tv-cta/);
  assert.match(html,language==='es'?/toca “Experiencia interactiva”/:/tap “Interactive experience”/);
  assert.doesNotMatch(html,/data-action=/);
 }
 // The crops belong to that exact PNG: any other artwork falls back to the plain image.
 context.window.AI_ARTWORK=(src,attributes)=>`<img src="${src}" ${attributes}>`;
 const plain=insights.information({language:'en',image:'other.png',label:'PredictToDo: Information'});
 assert.match(plain,/ptd-tv-infographic/);assert.doesNotMatch(plain,/ptd-sh/);
});
