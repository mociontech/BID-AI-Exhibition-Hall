/* Exercise the real public-hosting frontend with isolated Firebase responses.
   No visitor's production station is read or overwritten by this test. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('./state.js'),C=require('./data/demo-maps.json');
(async()=>{
 const base=process.env.TEST_URL||'http://localhost:4198',origin='https://maiia-preview.test',errors=[],writes=[],requests=[];
 let stored={stationId:7,updatedAt:Date.now(),payload:JSON.stringify({projectId:'07',view:'game',mode:'game',section:'easy',language:'es',game:{...S.fresh(true),phase:'easy'}})};
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 try{
  const a=await browser.newContext({viewport:{width:764,height:830},hasTouch:true}),b=await browser.newContext({viewport:{width:1920,height:1080}});
  await b.addInitScript(()=>{const actual=Date.now.bind(Date);Date.now=()=>actual()+300000;});
  for(const context of [a,b])await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());requests.push({url:request.url(),method:request.method()});
   if(url.hostname==='f1-sap-default-rtdb.firebaseio.com'){
    assert.ok(url.pathname.endsWith('/stations/7.json'));
    if(request.method()==='PUT'){const value=request.postDataJSON();assert.ok(value.payload.length<=10000);stored={...value,updatedAt:Date.now()};writes.push(JSON.parse(value.payload));}
    return route.fulfill({json:stored,headers:{'Access-Control-Allow-Origin':'*'}});
   }
   assert.equal(url.origin,origin);const response=await route.fetch({url:base+url.pathname+url.search});return route.fulfill({response});
  });
  const tablet=await a.newPage(),tv=await b.newPage();for(const p of [tablet,tv])p.on('pageerror',e=>errors.push(e.message));
  await tv.goto(origin+'/display.html?station=7');await tablet.goto(origin+'/index.html?station=7');
  await tablet.waitForSelector('.mai-phase-easy');await tv.waitForSelector('.mai-phase-easy');
  const click=action=>tablet.locator(`[data-action="${action}"]`).first().click();
  const at=async p=>{const r=await tablet.locator('[data-map]').boundingBox();return {x:r.x+p[0]*r.width,y:r.y+p[1]*r.height};};
  const move=async p=>{const q=await at(p);await tablet.mouse.move(q.x,q.y,{steps:8});};
  await move([.1,.1]);await tablet.mouse.down();await move([.35,.1]);await move([.35,.4]);
  await tv.waitForSelector('.mai-draft',{state:'attached'});await move([.1,.4]);await tablet.mouse.up();
  await tv.waitForFunction(()=>document.querySelectorAll('.mai-user').length===1);
  await click('review');await tv.waitForSelector('.mai-phase-easyResult');await click('next');await tv.waitForSelector('.mai-phase-manual');
  for(const p of [[.2,.15],[.45,.14],[.9,.9]]){const q=await at(p);await tablet.mouse.click(q.x,q.y);}
  await click('review');await tv.waitForSelector('.mai-phase-manualResult');
  for(const p of [tablet,tv])assert.equal(await p.locator('.mai-reference,.mai-candidate,.mai-reference-key').count(),0);
  await click('activate');await tv.waitForSelector('.mai-phase-analysis');await tablet.waitForSelector('.mai-phase-assisted');await tv.waitForSelector('.mai-phase-assisted');
  for(const id of ['C1','C2','C6']){
   const candidate=C.hard.candidates.find(c=>c.id===id),zone=candidate.points?candidate:C.hard.reference.find(z=>z.id===candidate.referenceId);
   const center=[0,1].map(i=>zone.points.reduce((sum,p)=>sum+p[i],0)/zone.points.length),q=await at(center);await tablet.mouse.click(q.x,q.y);
  }
  await tv.waitForFunction(()=>document.querySelectorAll('.mai-candidate.is-selected').length===3);
  await click('review');await tv.waitForSelector('.mai-phase-final');
  assert.equal(await tablet.locator('.mai-final-map .mai-reference').count(),5);assert.equal(await tablet.locator('.mai-answer-selection').count(),3);assert.equal(await tv.locator('.mai-scorecard').count(),2);
  const final=JSON.parse(stored.payload);assert.deepEqual(final.game.assisted,{hits:2,errors:1,score:20});
  await tablet.locator('[data-language=en]').click();await tv.waitForSelector('[data-language=en]');await tv.reload();await tv.waitForSelector('.mai-phase-final');
  assert.equal(JSON.parse(stored.payload).game.assisted.score,20);assert.ok(Math.abs(await tv.evaluate(()=>AI_SYNC.now())-Date.now())<1800);
  assert.ok(writes.length>8);assert.ok(requests.some(r=>r.method==='HEAD'));assert.ok(!requests.some(r=>new URL(r.url).pathname==='/api/state'));assert.deepEqual(errors,[]);
  const report={passed:true,transport:'Firebase REST PUT/GET (isolated test)',writeCount:writes.length,checks:['public entry and passive TV','freehand live synchronization','no pre-AI answer reveal','shared hosting clock with TV skew','assisted selections and actual final score','language and late receiver restoration'],errors};
  fs.writeFileSync(path.join(__dirname,'verification/hosting-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
