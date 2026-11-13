/* Local-only paired MAIIA verification; external Playwright via NODE_PATH. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const S=require('./state.js'),C=require('./data/demo-maps.json');
const out=process.env.MAIIA_QA_OUT||path.join(os.tmpdir(),'maiia-approved-qa');fs.mkdirSync(out,{recursive:true});
function interior(z){
 const xs=z.points.map(p=>p[0]),ys=z.points.map(p=>p[1]),x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0,candidates=[];
 for(let y=1;y<30;y++)for(let x=1;x<30;x++){const p=[x0+w*x/30,y0+h*y/30];if(S.inside(p,z.points))candidates.push(p);}
 return candidates.sort((a,b)=>(a[0]-x0-w/2)**2+(a[1]-y0-h/2)**2-(b[0]-x0-w/2)**2-(b[1]-y0-h/2)**2)[0];
}
(async()=>{
 const base=process.env.TEST_URL||'http://localhost:4199';assert.match(new URL(base).hostname,/^(localhost|127\.0\.0\.1)$/,'Use only a local server');
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true}),checks=[],errors=[];
 try{
 const pad=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true}),screen=await browser.newContext({viewport:{width:1920,height:1080}});
 await screen.addInitScript(()=>{const real=Date.now.bind(Date);Date.now=()=>real()+300000;});
 const tablet=await pad.newPage(),tv=await screen.newPage(),station=11;
 for(const p of [tablet,tv]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});}
 const remote=async(n=station)=>(await pad.request.get(base+'/api/state?station='+n)).json(),other=await Promise.all([1,2,3].map(remote));
 await pad.request.post(base+'/api/state?station='+station,{data:{projectId:'07',view:'project',mode:'landing',language:'en',game:S.fresh()}});
 const click=a=>tablet.locator('[data-action="'+a+'"]').first().click();
 const waitState=async predicate=>{for(let i=0;i<100;i++){const s=await remote();if(predicate(s))return s;await tablet.waitForTimeout(80);}throw Error('State did not converge');};
 const phase=async name=>{await tablet.waitForSelector('.mai-phase-'+name);await tv.waitForSelector('.mai-phase-'+name);};
 const shot=async(p,name)=>p.screenshot({path:path.join(out,name+'.png')});
 const noAnswers=async()=>{for(const p of [tablet,tv])assert.equal(await p.locator('.mai-reference,.mai-candidate').count(),0);};
 async function checkScale(p,kind){
  const info=await p.locator('.mai-map-frame').first().evaluate(f=>{const svg=f.querySelector('.mai-map'),line=f.querySelector('[data-scale-line]');return {ratio:svg.getBoundingClientRect().width/svg.getBoundingClientRect().height,label:f.querySelector('[data-scale-label]').textContent,height:f.querySelector('[data-height]').textContent,barRatio:line.getBoundingClientRect().width/svg.getBoundingClientRect().width};});
  assert.ok(Math.abs(info.ratio-C[kind].width/C[kind].height)<.002);assert.equal(info.height,kind==='easy'?'3 km':'10 km');assert.equal(info.label,kind==='easy'?'250 m':'1 km');
  assert.ok(Math.abs(info.barRatio*C[kind].groundWidthMeters-C[kind].scaleBarMeters)<3);
 }
 await tv.goto(base+'/display.html?station='+station);await tablet.goto(base+'/projects/07-csd-maiia/index.html?station='+station);
 await tablet.waitForSelector('.mai-cover .mai-approved-art');assert.ok(await tablet.locator('[data-action=game]').isEnabled());assert.ok(await tablet.locator('[data-action=information]').isEnabled());await shot(tablet,'tablet-menu');
 await click('information');await tv.waitForSelector('.mai-infographic.mai-info-ready');assert.ok(decodeURI(await tv.locator('.mai-infographic .mai-approved-art').getAttribute('src')).endsWith('/assets/infographics/Infografia_MAIIA.png'));assert.equal(await tv.locator('.mai-infographic .mai-map').count(),0);await tv.waitForTimeout(5100);await shot(tv,'tv-information');
 await click('information');await tv.waitForSelector('.mai-cover');await click('game');await phase('intro');await shot(tablet,'tablet-intro');await click('start');await phase('easy');await noAnswers();
 const box=await tablet.locator('[data-map]').boundingBox(),vertices=C.easy.reference[0].points;
 await tablet.mouse.move(box.x+vertices[0][0]*box.width,box.y+vertices[0][1]*box.height);await tablet.mouse.down();
 for(const [x,y]of [...vertices.filter((_,i)=>i%3===0),vertices[0]])await tablet.mouse.move(box.x+x*box.width,box.y+y*box.height);
 await tablet.mouse.up();await waitState(s=>s.game.polygons.length===1);await click('review');await phase('easyResult');
 assert.ok((await remote()).game.easyScore>60);assert.equal(await tv.locator('.mai-reference').count(),1);await shot(tablet,'tablet-level-1-result');checks.push('approved close-up, real freehand gesture, calculated overlap and paired result');
 await click('next');await phase('manual');for(const p of [tablet,tv])await p.waitForSelector('.mai-territory-zoom');
 const before=await tablet.locator('[data-height]').textContent();await tablet.waitForTimeout(450);const during=await tablet.locator('[data-height]').textContent();assert.ok(parseFloat(during)>=parseFloat(before));await shot(tablet,'tablet-zoom');
 for(const p of [tablet,tv]){await p.waitForFunction(()=>!document.querySelector('.mai-territory-zoom'));await checkScale(p,'hard');}await noAnswers();checks.push('paired registered zoom, equivalent height and true scale bars');
 async function tap(point){const b=await tablet.locator('[data-map]').boundingBox();await tablet.touchscreen.tap(b.x+point[0]*b.width,b.y+point[1]*b.height);}
 const large=[...C.hard.reference].sort((a,b)=>S.area(b.points)-S.area(a.points)).slice(0,2);for(const z of large)await tap(interior(z));for(let i=0;i<12;i++)await tap([.02+i*.07,.015]);
 await waitState(s=>s.game.markers.length===14);await tv.waitForFunction(()=>document.querySelectorAll('.mai-marker').length===14);
 await tablet.locator('[data-marker="13"]').press('Enter');await waitState(s=>s.game.markers.length===13);await shot(tablet,'tablet-more-than-five-pins');
 await click('review');await phase('manualResult');await noAnswers();const manual=(await remote()).game.manual;assert.equal(manual.hits,2);assert.equal(manual.errors,11);assert.equal(manual.score,0);
 for(const p of [tablet,tv]){assert.equal(await p.locator('.mai-marker.is-correct').count(),2);assert.equal(await p.locator('.mai-marker.is-incorrect').count(),11);assert.equal(await p.locator('.mai-marker.is-reviewed .mai-marker-symbol').count(),13);assert.match(await p.locator('.mai-pin-legend').innerText(),/Correct \(2\)/);assert.match(await p.locator('.mai-pin-legend').innerText(),/Incorrect \(11\)/);}
 await shot(tablet,'tablet-level-2-result');await shot(tv,'tv-level-2-result');checks.push('14 touch pins, keyboard removal, sync, correct/incorrect symbols and counted legends on both screens, hidden pre-AI answers');
 await click('next');await phase('activation');await noAnswers();await shot(tablet,'tablet-activation');await click('activate');await phase('analysis');
 for(const p of [tablet,tv]){await p.waitForSelector('.mai-scan-line');assert.equal(await p.locator('.mai-candidate').count(),11);await checkScale(p,'hard');}
 await shot(tablet,'tablet-scanning');await shot(tv,'tv-scanning');await phase('assisted');
 const first=tablet.locator('[data-candidate="C1"]');await first.press('Enter');await waitState(s=>s.game.selected.length===1);await first.press('Enter');await waitState(s=>s.game.selected.length===0);
 for(const c of C.hard.candidates)await tablet.locator('[data-candidate="'+c.id+'"]').press('Enter');
 await tv.waitForFunction(()=>document.querySelectorAll('.mai-candidate.is-selected').length===11);await shot(tablet,'tablet-assisted');await click('review');await phase('final');
 const final=(await remote()).game;assert.deepEqual(final.assisted,{hits:11,errors:0,score:100});assert.deepEqual(final.manual,manual);
 assert.equal(await tablet.locator('.mai-reference').count(),11);assert.equal(await tablet.locator('.mai-answer-selection').count(),11);assert.equal(await tablet.locator('.mai-marker').count(),13);assert.equal(await tablet.locator('.mai-marker.is-incorrect').count(),11);
 assert.match(await tv.locator('.mai-scorecard-assisted').innerText(),/11 \/ 11/);await shot(tablet,'tablet-final');await shot(tv,'tv-final');checks.push('activation, both scan animations, approved suggestions, toggles and exact final scores');
 await tv.reload();await tv.waitForSelector('.mai-final');assert.match(await tv.locator('.mai-scorecard-assisted').innerText(),/100%/);
 for(const size of [{width:1024,height:768},{width:1280,height:800}]){await tablet.setViewportSize(size);await checkScale(tablet,'hard');const fit=await tablet.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}));assert.ok(fit.sw<=fit.w&&fit.sh<=fit.h);}
 await shot(tablet,'tablet-final-1280');await click('replay');await phase('intro');assert.deepEqual((await remote()).game,S.fresh());await click('menu');await tablet.waitForSelector('.mai-landing');
 await tablet.locator('[data-navigation=back]').click();await tablet.waitForURL(/\/index\.html\?/);assert.equal(new URL(tablet.url()).pathname,'/index.html');assert.deepEqual(await Promise.all([1,2,3].map(remote)),other);assert.deepEqual(errors,[]);
 checks.push('late TV, landscape widths, resized scale bars, replay, Home and station isolation');
 const report={passed:true,checks,manual,assisted:final.assisted,errors,output:out};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
