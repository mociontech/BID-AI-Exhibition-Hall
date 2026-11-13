const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
let chromium;
for(const name of [process.env.PLAYWRIGHT_MODULE,'playwright','playwright-core',path.join(os.homedir(),'AppData/Local/Programs/Python/Python310/lib/site-packages/playwright/driver/package')].filter(Boolean)){
 try{chromium=require(name).chromium;break;}catch{}
}
if(!chromium)throw Error('Set PLAYWRIGHT_MODULE to your installed Playwright.');
(async()=>{
 const base=process.env.BASE_URL||'http://127.0.0.1:4191',room='34343434343434343434343434343434',query='?station=11&room='+room;
 const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
 const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,colorScheme:'light'});
 const report={checks:[],errors:[],requests:0,tvWrites:0};
 const out=path.join(__dirname,'../rise-prototype/artifacts/station');fs.mkdirSync(out,{recursive:true});
 await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await context.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 const tablet=await context.newPage(),tv=await context.newPage(),isolated=await context.newPage();
 await tv.setViewportSize({width:1920,height:1080});
 for(const page of [tablet,tv,isolated]){
  page.on('pageerror',error=>report.errors.push(error.message));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
  page.on('request',r=>{if(r.method()==='POST')report.requests++;});
 }
 tv.on('request',r=>{if(r.method()==='POST')report.tvWrites++;});
 const check=name=>{report.checks.push(name);console.log('PASS',name);};
 const read=async()=>(await context.request.get(base+'/api/state'+query)).json();
 const scene=async expected=>{
  await tv.waitForFunction(expected=>document.querySelector('iframe')?.contentWindow?.S?.sc===expected,expected);
  assert.equal(await tablet.locator('iframe').evaluate(frame=>frame.contentWindow.S.sc),expected);
 };
 const frame=()=>tablet.frameLocator('[data-rise-device="tablet"]');
 const shot=async name=>{
  await tablet.bringToFront();
  await tablet.screenshot({path:path.join(out,'tablet-'+name+'.png'),animations:'disabled'});
  await tv.bringToFront();
  await tv.screenshot({path:path.join(out,'tv-'+name+'.png'),animations:'disabled'});
  await tablet.bringToFront();
 };
 const fit=async()=>{
  for(const [w,h] of [[1024,768],[1180,820],[1366,768]]){
   await tablet.setViewportSize({width:w,height:h});await tablet.waitForTimeout(200);
   assert.equal(await tablet.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false,'Tablet overflow '+w+'x'+h);
   assert(await frame().locator('#tab').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;}),'Source tablet must fit viewport');
  }
 };
 try{
  const fresh=require('../state.js').fresh();
  // Legacy menu state must also enter the actual v34 rather than the old cover.
  await context.request.post(base+'/api/state'+query,{data:{view:'project',projectId:'11',mode:'landing',language:'en',game:fresh}});
  await isolated.goto(base+'/display.html?station=11&room=abababababababababababababababab');
  await tablet.goto(base+'/projects/11-rsm-rise/index.html'+query);await tv.goto(base+'/display.html'+query);
  assert.equal(await tablet.locator('html').getAttribute('lang'),'en');
  await frame().locator('[data-intro-start]').waitFor();await scene('intro');
  assert.equal(await tablet.locator('.rise-landing,.rise-v34-navigation,[data-action="information"]').count(),0);
  assert.equal(await tv.locator('.rise-tv-hero,.rise-scenes').count(),0);
  assert.match(await frame().locator('.thead h3').innerText(),/simplified simulated experience/);
  check('Direct entry with the approved simplified/simulated notice, no legacy cover or added navigation');
  for(let deal=0;deal<3;deal++){
   const language=deal===1?'es':'en';
   await frame().locator(`[data-lang="${language}"]`).click();
   await tv.waitForFunction(language=>document.querySelector('iframe')?.contentDocument?.documentElement.lang===language,language);
   await frame().locator('[data-intro-start]').click();
   await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.RISE_INTRO?.startedAt>0);
   await frame().locator('[data-go="problem"]').click();await scene('problem');
   if(!deal)await shot('problem');
   await frame().locator('[data-go="ficha"]').click();await scene('ficha');
   await frame().locator('[data-go="deal"]').click();await scene('deal');
   assert(await frame().locator('[data-go="read"]').isDisabled());
   await frame().locator(`[data-deal="${deal}"]`).click();
   if(!deal)await shot('proposals');
   await frame().locator('[data-go="read"]').click();await scene('read');
   await frame().locator('[data-run]').click();await tablet.waitForTimeout(1100);
   const readStartedAt=(await read()).game.readStartedAt;
   await tablet.reload();await tv.reload();await frame().locator('[data-go="decide"]').waitFor();
   assert.equal((await read()).game.readStartedAt,readStartedAt);
   await frame().locator('[data-go="decide"]').waitFor({state:'visible'});
   await tablet.waitForFunction(()=>!document.querySelector('iframe')?.contentDocument?.querySelector('[data-go="decide"]')?.disabled);
   await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.run===2);
   await frame().locator('[data-go="decide"]').click();await scene('decide');
   assert.equal(await tv.locator('iframe').evaluate(f=>f.contentDocument.querySelectorAll('.igrid .ri').length),6);
   await fit();await tablet.waitForTimeout(4200);if(!deal)await shot('risk');
   await frame().locator('[data-go="time"]').click();await scene('time');
   if(!deal)await shot('time');
   await scene('time');await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.sc==='sup',{timeout:15000});
   await frame().locator('.rise-insight-card').waitFor({timeout:15000});
   assert.equal(await frame().locator('[data-act]').count(),0,'Historical insight must not require an action');
   assert(await frame().locator('[data-go="loop"]').isEnabled());
   assert.equal((await read()).game.act,null,'No action is recorded');
   if(!deal)await shot('supervision');
   await frame().locator('[data-go="loop"]').click();await scene('loop');
   if(!deal)await shot('memory');
   for(const p of [tablet,tv])assert.deepEqual(await p.locator('iframe').evaluate(f=>Object.keys(f.contentWindow.__i18nMiss||{})),[]);
   check(`Proposal ${deal+1}: ${language}, read/reload, six risk indicators, historical insight, no action required, memory`);
   await tablet.reload();await frame().locator('[data-reset]').waitFor();await frame().locator('[data-reset]').click();await scene('intro');
  }
  // Keep the scene while changing language and while reconnecting the TV.
  await frame().locator('[data-intro-start]').click();
  await frame().locator('[data-go="problem"]').click();await scene('problem');
  await frame().locator('[data-lang="es"]').click();await tv.reload();await scene('problem');
  assert.equal((await read()).language,'es');
  // A TV may never write the station state.
  assert.equal(await isolated.locator('.rise-v34-tv').count(),0);
  await frame().locator('[data-home]').click();await tablet.locator('.projects-grid').waitFor();
  assert.equal(new URL(tablet.url()).searchParams.get('room'),room);
  assert.equal(new URL(tablet.url()).searchParams.get('station'),'11');
  assert.equal(report.tvWrites,0,'TV must never write station state');
  check('Language, TV reload, three landscape tablet sizes, room isolation, replay and original Home returning to Projects');
  assert.deepEqual(report.errors,[]);check('No browser errors, failed requests, or missing translations');
 }finally{
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
