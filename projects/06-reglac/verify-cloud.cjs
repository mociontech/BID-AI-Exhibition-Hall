/* Live Firebase/Netlify QA. Writes only station 6; restores its starting state.
   Other stations are read-only. Requires Playwright via NODE_PATH. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),S=require('./state.js');
(async()=>{
 const base=process.env.TEST_URL||'https://bidaiinaction.netlify.app',firebase='https://f1-sap-default-rtdb.firebaseio.com/aiExhibitionHall/stations/',ids=[1,2,3,4,5,6,7,9,10,11];
 const browser=await chromium.launch({channel:'chrome',headless:true});let original=null,request,wrote=false;const checks=[],errors=[];
 const raw=async id=>{const r=await request.get(firebase+id+'.json');assert.equal(r.status(),200,'Firebase read '+id);return r.json();};
 const write=async packet=>{const r=await request.put(firebase+'6.json',{data:{stationId:6,updatedAt:{'.sv':'timestamp'},payload:JSON.stringify({...packet,station:6,ts:Date.now()})}});assert.equal(r.status(),200,'Firebase station 6 write');wrote=true;};
 try{
  const control=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true}),receiver=await browser.newContext({viewport:{width:1920,height:1080}});request=control.request;
  original=await raw(6);const other=new Map();for(const id of ids.filter(n=>n!==6))other.set(id,await raw(id));
  const probe=await control.newPage();await probe.goto(base+'/projects/06-reglac/assets/regulatory-analysis.svg');const source=await (await request.get(base+'/shared/sync.js')).text();
  for(const id of ids){const result=await probe.evaluate(async({id,source})=>{history.replaceState(null,'','/display.html?station='+id);(0,eval)(source);const s=await AI_SYNC.read();return {station:AI_SYNC.station,key:AI_SYNC.KEY,received:s.stationId};},{id,source});assert.equal(result.station,id);assert.equal(result.received,id);assert.equal(result.key,'ai-exhibition-state-'+id);}
  await probe.close();checks.push('all ten production station IDs use their own Firebase endpoint');
  await write({view:'project',projectId:'06',section:'landing',mode:'landing',language:'es',game:S.fresh()});
  await receiver.addInitScript(()=>{const actual=Date.now.bind(Date);Date.now=()=>actual()+300000;});
  const tablet=await control.newPage(),tv=await receiver.newPage();
  for(const p of[tablet,tv]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});}
  const click=action=>tablet.locator('[data-action="'+action+'"]').first().click();
  const both=async selector=>{await tablet.waitForSelector(selector,{timeout:20000});await tv.waitForSelector(selector,{timeout:20000});};
  const remote=async()=>{const v=await raw(6);return JSON.parse(v.payload);};
  async function waitRemote(test){const end=Date.now()+20000;while(Date.now()<end){const s=await remote();if(test(s))return s;await new Promise(r=>setTimeout(r,200));}throw Error('Firebase state did not converge');}
  await tv.goto(base+'/display.html?station=6');await tablet.goto(base+'/projects/06-reglac/index.html?station=6');await both('.rl-landing');
  assert.equal(await tablet.locator('[data-action="game"]').isDisabled(),true);await waitRemote(s=>s.mode==='landing');
  await click('information');await tv.waitForSelector('.rl-information[data-language="es"]');
  await tablet.locator('[data-language="en"]').click();await tv.waitForSelector('.rl-information[data-language="en"]');
  await tablet.waitForFunction(()=>!document.querySelector('[data-action="game"]').disabled,null,{timeout:15000});await waitRemote(s=>s.game.ready&&s.language==='en');
  checks.push('live information, language and ten-second unlock synchronize');
  await click('game');await both('.rl-mission');await click('start');await both('.rl-phase-manual');
  for(const id of['A','C'])await tablet.locator('[data-doc="'+id+'"]').click();await tv.waitForFunction(()=>document.querySelectorAll('.is-selected').length===2);
  const clockDiff=Math.abs(await tablet.evaluate(()=>AI_SYNC.now())-await tv.evaluate(()=>AI_SYNC.now()));assert.ok(clockDiff<1600,'public clock drift '+clockDiff);checks.push('TV clock +5 minutes corrected by Netlify time');
  await tablet.waitForTimeout(1000);await click('check');await both('.rl-phase-manualReveal');const manual=(await waitRemote(s=>s.game.phase==='manualReveal')).game.elapsed[0];assert.ok(manual>=1000);
  await click('next');await both('.rl-transition');await click('next');await both('.rl-phase-assist');await click('activate');await both('.rl-phase-organize');
  await both('.rl-phase-confirm');assert.equal(await tv.locator('.is-match').count(),2);
  for(const id of['B','D'])await tablet.locator('[data-doc="'+id+'"]').click();await click('check');await both('.rl-phase-assistReveal');await click('next');await both('.rl-results');
  const finished=(await waitRemote(s=>s.game.phase==='results')).game;assert.deepEqual(finished.outcomes,[true,true]);assert.equal(finished.elapsed[0],manual);assert.ok(finished.elapsed[1]>=6000);checks.push('manual round, simulated assistance, human confirmation and actual results synchronize');
  await tablet.reload();await tablet.waitForSelector('.rl-results');assert.deepEqual((await remote()).game.elapsed,finished.elapsed);await click('restart');await both('.rl-mission');assert.deepEqual((await waitRemote(s=>s.game.phase==='intro')).game,S.fresh(true));
  await click('menu');await both('.rl-landing');checks.push('reload and complete restart retain consistent state');
  // Close the controller before restoring, so its heartbeat cannot overwrite it.
  await control.close();await receiver.close();
  request=await (await browser.newContext()).request;
  for(const[id,before]of other)assert.deepEqual(await raw(id),before,'station '+id+' was changed');
  assert.deepEqual(errors,[]);checks.push('other nine station states unchanged; no browser or HTTP errors');
  const report={passed:true,url:base,checks,sessionTimes:finished.elapsed,clockDifferenceMs:clockDiff,errors};
  fs.writeFileSync(path.join(process.env.TEMP||__dirname,'reglac-cloud-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{
  if(request&&wrote){
   for(const context of browser.contexts())await context.close();
   request=(await browser.newContext()).request;
   await write(original?.payload?JSON.parse(original.payload):{view:'project',projectId:'06',section:'landing',mode:'landing',language:'es',game:S.fresh()});
  }
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
