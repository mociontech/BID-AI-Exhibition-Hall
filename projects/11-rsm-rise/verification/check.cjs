const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const hosted=process.env.RISE_HOSTED==='1',checks=[],errors=[],states=new Map();
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const ctx=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true});
 const local=process.env.BASE_URL||'http://localhost:4181',base=hosted?'https://rise-preview.invalid':local;
 const room=hosted?'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa':'0123456789abcdef0123456789abcdef',query=`?station=8&room=${room}`;
 if(hosted)await ctx.route('**/*',async route=>{
  const req=route.request(),url=new URL(req.url());
  if(url.hostname==='f1-sap-default-rtdb.firebaseio.com'){
   if(req.method()==='PUT'){const value=req.postDataJSON();value.updatedAt=Date.now();states.set(url.pathname,value);}
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(states.get(url.pathname)||null)});
  }
  if(url.origin===base)return route.fulfill({response:await ctx.request.fetch(local+url.pathname+url.search,{method:req.method()})});
  if(['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname))return route.continue();
  throw Error('Unexpected external request '+req.url());
 });
 const tablet=await ctx.newPage(),tv=await ctx.newPage(),isolated=await ctx.newPage();await tv.setViewportSize({width:1920,height:1080});
 for(const p of [tablet,tv,isolated]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});}
 const check=name=>{checks.push(name);console.log('PASS',name);};
 const wait=async fn=>{for(let i=0;i<100;i++){if(await fn())return;await new Promise(r=>setTimeout(r,100));}throw Error('Synchronization timeout');};
 const read=async()=>hosted?JSON.parse(states.get('/aiExhibitionHall/rooms/'+room+'.json')?.payload||'null'):(await ctx.request.get(local+'/api/state'+query)).json();
 const fit=async()=>{for(const [w,h] of [[1024,768],[1366,768],[1180,820]]){await tablet.setViewportSize({width:w,height:h});assert.equal(await tablet.evaluate(()=>document.documentElement.scrollHeight>innerHeight||document.documentElement.scrollWidth>innerWidth),false,'Tablet overflow '+w+'×'+h);}assert.equal(await tv.evaluate(()=>document.documentElement.scrollHeight>innerHeight||document.documentElement.scrollWidth>innerWidth),false,'TV overflow');};
 const snap=async(name)=>{if(hosted)return;await tablet.waitForTimeout(300);await tablet.screenshot({path:`projects/11-rsm-rise/verification/tablet-${name}.png`});await tv.screenshot({path:`projects/11-rsm-rise/verification/tv-${name}.png`});};
 if(!hosted)await ctx.request.post(local+'/api/state'+query,{data:{view:'home',projectId:null,game:null}});
 await isolated.goto(base+'/display.html?station=8&room=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
 await tablet.goto(base+'/projects/11-rsm-rise/index.html'+query);await tablet.locator('[data-action="information"]').waitFor();
 await tv.goto(base+'/display.html'+query);await tv.locator('.rise-display').waitFor();
 assert(await tablet.locator('[data-action="game"]').first().isEnabled());await fit();await tablet.locator('[data-action="game"]').first().click();await tablet.locator('[data-game="select"]').first().waitFor();await wait(async()=>(await read()).mode==='game');assert.equal((await read()).game.infoStartedAt,0);await tablet.locator('[data-action="menu"]').click();check('game available immediately without information, private room and landscape layouts');
 await tablet.locator('[data-action="information"]').click();await tablet.waitForTimeout(1100);const started=(await read()).game.infoStartedAt;
 await tablet.locator('[data-action="information"]').click();assert.equal((await read()).game.infoStartedAt,started);
 await tablet.reload();await tablet.locator('[data-countdown]').waitFor();await tv.reload();await tv.locator('.rise-scenes').waitFor();
 await tablet.locator('[data-language="en"]').click();await wait(async()=>(await tv.locator('html').getAttribute('lang'))==='en');
 await tablet.locator('.rise-status [data-action="game"]').waitFor();assert(await tablet.locator('[data-action="game"]').first().isEnabled());check('optional information never locks game; repeated taps, reload recovery and synchronized language');
 await tablet.locator('.rise-status [data-action="game"]').click();await tablet.locator('[data-game="select"]').first().waitFor();
 assert.equal(await tablet.locator('[data-game="select"]').count(),3);assert(await tablet.locator('[data-game="next"]').isDisabled());
 assert.deepEqual(await tablet.evaluate(()=>[0,1,2].map(i=>({name:RISE_GAME.caseFor(i,'en').name,pages:RISE_GAME.caseFor(i,'en').pages}))),[{name:'SME credit line',pages:186},{name:'Urban metro line',pages:412},{name:'Solar power plant',pages:268}]);
 check('prototype proposals restored: SME credit line, urban metro and solar plant');
 for(let deal=0;deal<3;deal++){
  const lang=deal===1?'es':'en';await tablet.locator(`[data-language="${lang}"]`).click();await wait(async()=>(await tv.locator('html').getAttribute('lang'))===lang);
  await tablet.locator(`[data-game="select"][data-value="${deal}"]`).click();await wait(async()=>(await read()).game.deal===deal);
  await tv.locator('.rise-proposal-document').waitFor();assert(await tablet.locator('[data-game="next"]').isEnabled());await fit();if(deal===0)await snap('proposal');
  await tablet.locator('[data-game="next"]').click();assert(await tablet.locator('[data-game="next"]').isDisabled());
  await tablet.locator('[data-game="run"]').click();await tv.locator('.rise-reading-split').waitFor();await tablet.waitForTimeout(1200);
  const readTime=(await read()).game.readStartedAt;await tablet.reload();await tv.reload();await tablet.locator('.rise-restored-game[data-stage="read"]').waitFor();assert.equal((await read()).game.readStartedAt,readTime);
  await wait(async()=>await tablet.locator('[data-game="next"]').isEnabled());await tv.locator('.rise-speed-result').waitFor();
  const counts=await tv.locator('.rise-reading-pane header>span').allTextContents();const pages=[186,412,268][deal];assert.match(counts[0],new RegExp(Math.round(pages/3)+' / '+pages));assert.match(counts[1],new RegExp(pages+' / '+pages));
  await fit();if(deal===0)await snap('read');check(`case ${deal+1}: simulated manual/RISE comparison, structured extraction and reload-safe progress`);
  await tablet.locator('[data-game="next"]').click();await tv.locator('.rise-classify').waitFor();assert(await tablet.locator('[data-game="next"]').isDisabled());
  await tablet.locator('[data-game="why"]').click();await tv.locator('.rise-evidence>div p').first().waitFor();assert.equal(await tv.locator('.rise-evidence>div p').count(),3);
  const dec=deal===1?'adjust':'accept';await tablet.locator(`[data-game="decision"][data-value="${dec}"]`).click();await wait(async()=>(await read()).game.dec===dec);assert((await read()).game.decisionAt>0);
  await fit();if(deal===0)await snap('evidence');check(`case ${deal+1}: Why evidence and ${dec} classification decision restored`);
  await tablet.locator('[data-game="next"]').click();await tv.locator('.rise-timeline').waitFor();assert.equal(await tablet.locator('[data-game="action"]').count(),0);
  const supTime=(await read()).game.supStartedAt;await tablet.waitForTimeout(800);await tablet.reload();await tv.reload();await tablet.locator('.rise-restored-game[data-stage="sup"]').waitFor();assert.equal((await read()).game.supStartedAt,supTime);
  await tablet.locator('[data-game="action"]').first().waitFor();assert(await tablet.locator('[data-game="next"]').isDisabled());await tablet.locator(`[data-game="action"][data-value="${deal}"]`).click();await wait(async()=>(await read()).game.act===deal);
  await tv.locator('.rise-timeline-pins .late.visible').waitFor();await fit();if(deal===0)await snap('supervision');
  await tablet.locator('[data-game="next"]').click();await tv.locator('.rise-memory-close').waitFor();await tablet.locator('[data-game="reset"]').waitFor();
  assert.equal((await read()).game.sc,'loop');assert.match(await tablet.locator('.rise-review').innerText(),new RegExp([186,412,268][deal]));assert(await tv.locator('canvas[data-memory="close"]').evaluate(cv=>cv.width>100));await fit();if(deal===0)await snap('memory');
  check(`case ${deal+1}: year 2 warning versus year 3 review, action ${deal+1}, memory document #8,201`);
  await tablet.reload();await tablet.locator('[data-game="reset"]').waitFor();await tablet.locator('[data-game="reset"]').click();await tablet.locator('[data-game="select"]').first().waitFor();
  const fresh=(await read()).game;assert.equal(fresh.deal,null);assert.equal(fresh.readStartedAt,0);assert.equal(fresh.dec,null);assert.equal(fresh.act,null);
 }
 check('all three proposals, both classification decisions, all supervision actions and full replay');
 await tablet.locator('[data-game="select"][data-value="1"]').click();await tablet.locator('[data-game="next"]').click();await tablet.locator('[data-game="run"]').click();
 await tablet.locator('[data-game="back"]').click();await tablet.locator('[data-game="select"][data-value="2"]').click();await tablet.locator('[data-game="next"]').click();assert(await tablet.locator('[data-game="run"]').isVisible());
 await tablet.locator('[data-action="menu"]').click();await tablet.locator('[data-action="information"]').waitFor();assert(await tablet.locator('[data-action="game"]').first().isEnabled());
 await tablet.locator('[data-action="home"]').first().click();await tablet.locator('.projects-grid').waitFor();assert.equal(new URL(tablet.url()).searchParams.get('room'),room);
 assert.equal(await isolated.locator('.rise-display').count(),0);check('backtracking, changing proposal, project menu, Home and same-station room isolation');
 assert.deepEqual(errors,[]);check('no JavaScript errors or failed requests');
 fs.writeFileSync('projects/11-rsm-rise/verification/'+(hosted?'hosted-report.json':'report.json'),JSON.stringify({game:'restored supplied prototype mechanics',transport:hosted?'mock Firebase, no production reads/writes':'local API',checks,errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
