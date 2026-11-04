/* Uses an external Playwright installation; adds no runtime dependencies.
   TEST_URL=http://localhost:4197 NODE_PATH=<qa>/node_modules node .../verify.cjs */
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('./state.js'),config=require('./data/demo-maps.json');
const out=path.join(__dirname,'verification');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const checks=[],errors=[],base=process.env.TEST_URL||'http://localhost:4197';
 const geometry=config.easy.reference.map(z=>z.points);
 assert.equal(S.iou(geometry,config.easy.reference,config.scoring),100);
 assert.equal(S.iou([],config.easy.reference,config.scoring),0);
 assert.equal(S.iou([...geometry,...geometry],config.easy.reference,config.scoring),100);
 assert.equal(S.iou([[[0,0],[.01,0],[.01,.01],[0,.01]]],config.easy.reference,config.scoring),0);
 const center=z=>[0,1].map(i=>z.points.reduce((sum,p)=>sum+p[i],0)/z.points.length);
 const centers=config.hard.reference.map(center);
 assert.deepEqual(S.manual(centers,config),{hits:5,errors:0,score:100});
 assert.deepEqual(S.manual([centers[0],centers[0]],config),{hits:1,errors:1,score:0});
 assert.deepEqual(S.assisted(config.hard.candidates.map(c=>c.id),config),{hits:5,errors:2,score:60});
 assert.deepEqual(S.assisted(['C6','C7'],config),{hits:0,errors:2,score:0});
 assert.equal(S.sanitize({...S.fresh(),markers:[[2,.5]]},config),null);
 assert.equal(S.sanitize({...S.fresh(),phase:'activation',easyScore:0},config),null);
 const circle=Array.from({length:1000},(_,i)=>[.5+.3*Math.cos(i/999*Math.PI*2),.5+.3*Math.sin(i/999*Math.PI*2)]);
 const simplified=S.simplifyStroke(circle,config.scoring.maxPoints);
 assert.ok(simplified.length>=3&&simplified.length<=40);assert.ok(Math.abs(S.area(simplified)-Math.PI*.3*.3)<.01);
 checks.push('geometry: actual IoU, empty/disjoint/duplicate unions; unique hits, penalties and bounded coordinates');
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
 const controller=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true}),receiver=await browser.newContext({viewport:{width:1920,height:1080}});
 await receiver.addInitScript(()=>{const real=Date.now.bind(Date);Date.now=()=>real()+300000;});
 const tablet=await controller.newPage(),tv=await receiver.newPage();
 const remote=async(n=7)=>(await controller.request.get(base+'/api/state?station='+n)).json();
 const other=await Promise.all([1,2,3,5,6].map(remote));
 for(const page of [tablet,tv]){page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});}
 await controller.request.post(base+'/api/state?station=7',{data:{projectId:'07',view:'project',mode:'landing',language:'es',game:S.fresh(false)}});
 const click=a=>tablet.locator(`[data-action="${a}"]`).first().click();
 const shot=async(p,name)=>p.screenshot({path:path.join(out,name+'.png'),fullPage:true});
 async function fits(p,label){const d=await p.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}));assert.ok(d.sw<=d.w+1&&d.sh<=d.h+1,label+' '+JSON.stringify(d));checks.push(label);}
 async function phase(p){await tablet.waitForSelector('.mai-phase-'+p);await tv.waitForSelector('.mai-phase-'+p);}
 async function tap(p){const b=await tablet.locator('[data-map]').boundingBox();await tablet.touchscreen.tap(b.x+p[0]*b.width,b.y+p[1]*b.height);}
 const touch=await controller.newCDPSession(tablet);
 async function draw(vertices,{mouse=false,cancel=false,live=false,closePath=true}={}){
  const b=await tablet.locator('[data-map]').boundingBox(),xy=p=>({x:b.x+p[0]*b.width,y:b.y+p[1]*b.height}),path=closePath?[...vertices,vertices[0]]:vertices;
  const before=(await remote()).game.polygons.length;
  const send=async(type,p)=>{if(mouse){if(type==='touchStart'){await tablet.mouse.move(p.x,p.y);await tablet.mouse.down();}else if(type==='touchMove')await tablet.mouse.move(p.x,p.y);else await tablet.mouse.up();}else await touch.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{...p,id:1}]});};
  await send('touchStart',xy(path[0]));
  for(let i=1;i<path.length;i++){
   for(let step=1;step<=8;step++)await send('touchMove',xy(path[i].map((v,k)=>path[i-1][k]+(v-path[i-1][k])*step/8)));
   if(live&&i===1){await waitRemote(s=>s.game.draft.length>0);await tv.waitForSelector('.mai-draft',{state:'attached'});assert.ok((await tv.locator('.mai-draft').getAttribute('points')).split(' ').length>=2);assert.equal((await remote()).game.polygons.length,before);}
  }
  await send(cancel?'touchCancel':'touchEnd',xy(path.at(-1)));
  await waitRemote(s=>s.game.draft.length===0&&s.game.polygons.length===before+(cancel?0:1));
 }
 async function waitRemote(predicate){for(let i=0;i<100;i++){const s=await remote();if(predicate(s))return s;await tablet.waitForTimeout(80);}throw Error('Remote state did not converge');}
 await tv.goto(base+'/display.html?station=7');await tablet.goto(base+'/index.html?station=7');await tablet.waitForSelector('.mai-landing');
 assert.match(tablet.url(),/07-csd-maiia/);assert.equal(await tablet.locator('[data-action=game]').isEnabled(),true);assert.equal(await tablet.locator('[data-action=information]').isEnabled(),true);
 await click('game');await phase('intro');await click('menu');await tablet.waitForSelector('.mai-landing');checks.push('mini-game opens immediately without viewing information, including a restored legacy locked state');
 await fits(tablet,'menu 1180×820');await shot(tablet,'tablet-menu-es');
 assert.equal(await tablet.locator('.mai-hero-caption').count(),0);checks.push('tablet landing map has no overlapping blue caption');
 await tablet.keyboard.press('Tab');assert.equal(await tablet.evaluate(()=>document.activeElement.tagName),'BUTTON');
 const targets=await tablet.locator('.mai-header button,.mai-option,.mai-footer :is(button,a)').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
 assert.ok(targets.every(t=>t.w>=44&&t.h>=44));checks.push('keyboard focus and 44px touch targets');
 await tablet.setViewportSize({width:1024,height:768});await fits(tablet,'menu 1024×768');
 await click('information');await tv.waitForSelector('.mai-infographic');
 assert.equal(await tablet.locator('.mai-infographic').count(),0);assert.equal(await tablet.locator('.mai-landing').count(),1);
 await fits(tv,'single infographic TV 1920×1080 ES');await shot(tv,'tv-infographic-es');
 await tablet.locator('[data-language=en]').click();await tv.waitForSelector('[data-language=en]');await fits(tv,'single infographic TV EN');await shot(tv,'tv-infographic-en');
 assert.equal(await tablet.locator('[data-action=game]').isEnabled(),true);
 await tablet.reload();await tablet.waitForSelector('.mai-landing');assert.equal((await remote()).game.unlockAt,0);
 await tv.waitForSelector('.mai-infographic');checks.push('information remains optional; both entries stay enabled after language change and reload');
 await click('game');await phase('intro');await fits(tablet,'intro 1024×768');await shot(tablet,'tablet-intro-en');await click('start');await phase('easy');
 assert.match(await tv.locator('.mai-copy h1').textContent(),/informal settlements/);assert.match(await tablet.locator('.mai-controller-heading h1').textContent(),/informal settlements/);
 await fits(tablet,'drawing 1024×768');await fits(tv,'drawing TV');
 const drawingArea=await tablet.locator('[data-map]').boundingBox();
 assert.ok(drawingArea.width>1024*.85&&drawingArea.height>768*.6);
 assert.equal(await tablet.locator('.mai-lead,.mai-help,.mai-legend').count(),0);
 checks.push('tablet map occupies more than 85% of viewport width; only compact hint and toolbar');
 // Reproduce two browser windows side by side, including a narrow CSS
 // viewport as seen with browser zoom. The SVG must never collapse to 0px.
 await tablet.setViewportSize({width:764,height:830});
 await fits(tablet,'split-window tablet 764×830');
 const splitMap=await tablet.locator('[data-map]').boundingBox();assert.ok(splitMap.width>650&&splitMap.height>350);
 assert.equal(await tablet.locator('[data-action=close]').count(),0);
 await draw([[.15,.15],[.35,.15],[.25,.35]],{live:true,closePath:false});await tv.waitForFunction(()=>document.querySelectorAll('.mai-user').length===1);
 await shot(tablet,'tablet-split-window-drawing-en');
 await tablet.setViewportSize({width:1024,height:768});assert.equal((await remote()).game.polygons.length,1);await click('clear');
 checks.push('portrait/split-window map is visible and touch drawing stays aligned after resize');
 await click('review');await tablet.waitForFunction(()=>document.querySelector('.mai-feedback').textContent.length>0);assert.equal((await remote()).game.phase,'easy');
 await tap([.1,.1]);assert.equal((await remote()).game.polygons.length,0);
 await draw([[.1,.1],[.3,.1],[.2,.3]],{cancel:true,live:true});await tv.waitForFunction(()=>!document.querySelector('.mai-draft'));
 await draw([[.8,.15],[1.04,.15],[1.04,.35],[.8,.35]],{mouse:true});
 const bounded=(await remote()).game.polygons[0];assert.ok(bounded.every(p=>p.every(n=>n>=0&&n<=1)));assert.ok(bounded.some(p=>p[0]===1));
 await click('undo');await waitRemote(s=>s.game.polygons.length===0);
 // Preserve a keyboard alternative without a separate closing button.
 await tablet.locator('[data-map]').focus();await tablet.keyboard.press('Enter');await tablet.keyboard.press('ArrowRight');await tablet.keyboard.press('Enter');await tablet.keyboard.press('ArrowDown');await tablet.keyboard.press('Enter');await tablet.keyboard.press('Space');
 await waitRemote(s=>s.game.polygons.length===1);await click('clear');
 await draw(geometry[0],{live:true});await draw(geometry[1],{mouse:true});
 await tv.waitForFunction(()=>document.querySelectorAll('.mai-user').length===2);checks.push('freehand touch/mouse, automatic closure, live TV preview, canceled gestures, bounded pointer capture, undo/clear and keyboard fallback');
 await shot(tablet,'tablet-drawing-en');await click('review');await phase('easyResult');
 assert.ok((await remote()).game.easyScore>=99);await shot(tv,'tv-easy-result-en');
 assert.equal(await tablet.locator('.mai-big-score').count(),0);assert.equal(await tv.locator('.mai-big-score').count(),1);assert.equal(await tablet.locator('.mai-controller-canvas .mai-map').count(),1);
 for(const page of [tablet,tv])assert.equal(await page.locator('.mai-reference').count(),config.easy.reference.length);
 await click('next');await phase('manual');assert.match(await tv.locator('.mai-copy h1').textContent(),/informal settlements/);assert.match(await tablet.locator('.mai-controller-heading h1').textContent(),/informal settlements/);await click('review');assert.equal((await remote()).game.phase,'manual');
 await tap(centers[0]);await tap(centers[1]);await tap([.9,.1]);await waitRemote(s=>s.game.markers.length===3);
 await tablet.locator('[data-marker="2"]').click();await waitRemote(s=>s.game.markers.length===2);
 await tap([.9,.1]);await tap([.91,.8]);await tap([.1,.8]);await waitRemote(s=>s.game.markers.length===5);
 await tap([.95,.95]);assert.equal((await remote()).game.markers.length,5);await tv.waitForFunction(()=>document.querySelectorAll('.mai-marker').length===5);
 const before=(await remote()).game.markers;await tablet.locator('[data-language=es]').click();await waitRemote(s=>s.language==='es');assert.deepEqual((await remote()).game.markers,before);
 await tablet.setViewportSize({width:1180,height:820});await fits(tablet,'markers 1180×820');await shot(tablet,'tablet-markers-es');
 const mapBefore=await tablet.locator('.mai-map image').getAttribute('href');
 await click('review');await phase('manualResult');const manual=(await remote()).game.manual;assert.deepEqual(manual,{hits:2,errors:3,score:0});checks.push('marker add/remove, cap five, viewport alignment, real manual score, language preserves progress');
 for(const page of [tablet,tv]){
  assert.equal(await page.locator('.mai-reference,.mai-candidate,.mai-answer-selection,.mai-reference-key').count(),0);
  assert.equal(await page.locator('.mai-marker').count(),before.length);
 }
 checks.push('manual review shows only visitor markers and overall score on tablet/TV; hard reference answers remain hidden until AI');
 await shot(tv,'tv-manual-result-es');await click('next');await phase('activation');
 assert.equal((await remote()).game.analysisAt,0);
 for(const page of [tablet,tv]){assert.equal(await page.locator('.mai-reference,.mai-candidate,.mai-scanning').count(),0);assert.match(await page.locator('h1').textContent(),/MAIIA/);}
 await fits(tablet,'activation 1180 x 820');await fits(tv,'activation TV');await shot(tablet,'tablet-activation-es');await shot(tv,'tv-activation-es');
 await tablet.reload();await tablet.waitForSelector('.mai-phase-activation');await tablet.waitForTimeout(500);assert.equal((await remote()).game.phase,'activation');assert.equal((await remote()).game.analysisAt,0);
 checks.push('activation is a separate synchronized step after manual results; reload retains it; no scan or answer reveal before the explicit activation');
 await click('activate');await phase('analysis');await shot(tv,'tv-analysis-es');
 const analysisAt=(await remote()).game.analysisAt;await tablet.reload();await tablet.waitForSelector('.mai-phase-analysis');assert.equal((await remote()).game.analysisAt,analysisAt);
 assert.equal(await tablet.locator('.mai-scanning').count(),0);assert.equal(await tv.locator('.mai-scanning').count(),1);
 await phase('assisted');assert.ok(Date.now()-analysisAt>=3900);assert.equal(await tablet.locator('.mai-map image').getAttribute('href'),mapBefore);
 await fits(tablet,'assisted 1180×820');await fits(tv,'assisted TV');
 // Exercise all candidate toggles, then retain three true and one false area.
 const candidateTap=async id=>{const c=config.hard.candidates.find(c=>c.id===id),z=c.points?c:config.hard.reference.find(z=>z.id===c.referenceId);await tap(center(z));};
 await candidateTap('C1');await candidateTap('C1');await waitRemote(s=>s.game.selected.length===0);
 await click('review');assert.equal((await remote()).game.phase,'assisted');
 for(const id of ['C1','C2','C3','C6'])await candidateTap(id);
 await tv.waitForFunction(()=>document.querySelectorAll('.mai-candidate.is-selected').length===4);await shot(tv,'tv-assisted-es');
 // A newly opened receiver recovers the entire snapshot without advancing it.
 await tv.reload();await tv.waitForSelector('.mai-phase-assisted');assert.equal(await tv.locator('.is-selected').count(),4);checks.push('4-second simulated scan resumes; exact same hard image; candidate toggle/sync; late TV recovery');
 await click('review');await phase('final');const result=(await remote()).game;
 assert.deepEqual(result.assisted,{hits:3,errors:1,score:40});assert.deepEqual(result.manual,manual);
 assert.ok((await tv.locator('.mai-final-message').textContent()).includes('ayudaron'));
 assert.equal(await tablet.locator('.mai-scorecard,.mai-final-message').count(),0);
 assert.equal(await tablet.locator('.mai-summary-scores article').count(),0);
 assert.equal(await tablet.locator('.mai-final-map .mai-reference').count(),config.hard.reference.length);
 assert.equal(await tablet.locator('.mai-final-map .mai-answer-selection').count(),result.selected.length);
 assert.equal(await tablet.locator('.mai-answer-selection.is-incorrect').count(),1);
 assert.equal(await tablet.locator('.mai-final-map .mai-marker').count(),result.markers.length);
 assert.equal(await tablet.locator('.mai-final-map [data-map],.mai-final-map [data-candidate],.mai-final-map [data-marker]').count(),0);
 const falsePolygon=config.hard.candidates.find(c=>c.id==='C6').points.map(([x,y])=>`${x*1000},${y*562.5}`).join(' ');
 assert.equal(await tablet.locator('[data-answer-id="C6"]').getAttribute('points'),falsePolygon);
 checks.push('final tablet map shows every reference, actual selected areas, false selections and original markers; TV keeps score comparison');
 await fits(tablet,'final 1180×820');await fits(tv,'final TV');await shot(tv,'tv-final-es');await shot(tablet,'tablet-final-es');
 await tablet.locator('[data-language=en]').click();await tv.waitForSelector('[data-language=en]');await shot(tv,'tv-final-en');
 await tablet.setViewportSize({width:1024,height:768});await fits(tablet,'final 1024×768 EN');await shot(tablet,'tablet-final-en');
 await tablet.reload();await tablet.waitForSelector('.mai-phase-final');assert.deepEqual((await remote()).game.assisted,result.assisted);
 assert.equal(await tablet.locator('.mai-final-map .mai-answer-selection').count(),result.selected.length);
 assert.match(await tablet.locator('.mai-final-map>.mai-legend').textContent(),/Correct areas \(demo\)/);
 // Fullscreen is tested on a real click; headless Chrome supports the API.
 await click('fullscreen');await tablet.waitForFunction(()=>!!document.fullscreenElement);await click('fullscreen');await tablet.waitForFunction(()=>!document.fullscreenElement);checks.push('actual final scores ES/EN, progress reload and fullscreen enter/exit');
 await click('replay');await phase('intro');assert.deepEqual((await remote()).game,S.fresh(true));assert.equal((await remote()).language,'en');
 await click('menu');await tablet.waitForSelector('.mai-landing');assert.equal(await tablet.locator('[data-action=game]').isEnabled(),true);
 // An interrupted scan must not trigger an old transition after menu or replay.
 await click('game');await click('start');await draw([[.1,.1],[.3,.1],[.2,.3]]);await click('review');await click('next');await tap(centers[0]);await click('review');await click('next');await phase('activation');await click('activate');await phase('analysis');await click('menu');await tablet.waitForTimeout(4300);assert.equal((await remote()).mode,'landing');assert.equal((await remote()).game.analysisAt,0);
 await click('home');await tablet.waitForSelector('[data-project="07"]');assert.equal((await remote()).view,'home');
 await tablet.locator('[data-project="07"]').click();await tablet.waitForSelector('.mai-landing');assert.equal(await tablet.locator('[data-action=game]').isEnabled(),true);checks.push('replay clears every interaction; both menu entries stay available; cancel scan; Home reaches exhibition menu');
 // Show equal/lower dynamic messages with genuine precomputed geometry scores.
 const synthetic={...S.fresh(true),phase:'final',markers:centers,selected:['C6'],manual:S.manual(centers,config),assisted:S.assisted(['C6'],config)};
 await tv.evaluate(s=>MAIIA.renderInto(document.getElementById('app'),s,{readonly:true}),{view:'game',mode:'game',projectId:'07',language:'en',game:synthetic});
 assert.match(await tv.locator('.mai-final-message').textContent(),/human interpretation/);
 synthetic.markers=[[.99,.99]];synthetic.manual=S.manual(synthetic.markers,config);
 await tv.evaluate(s=>MAIIA.renderInto(document.getElementById('app'),s,{readonly:true}),{view:'game',mode:'game',projectId:'07',language:'en',game:synthetic});
 assert.match(await tv.locator('.mai-final-message').textContent(),/same result/);checks.push('equal and lower outcomes; assisted score is not forced to improve');
 const strip=s=>{const {serverNow,...rest}=s;return rest;};
 for(const [i,n] of [1,2,3,5,6].entries())assert.deepEqual(strip(await remote(n)),strip(other[i]));
 const bad=await controller.request.post(base+'/api/state?station=7',{data:{view:'game',projectId:'07',mode:'game',game:{...S.fresh(),markers:[[2,.1]]}}});assert.equal(bad.status(),400);
 assert.deepEqual(errors,[]);checks.push('station isolation; invalid state rejected; zero browser/asset errors');
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({passed:true,checks,results:{easy:result.easyScore,manual:result.manual,assisted:result.assisted},errors},null,2));
 console.log(JSON.stringify({passed:true,checks,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
