/* npm install --prefix <temporary-dir> playwright; set NODE_PATH to its node_modules. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('./state.js');
(async()=>{
 const base=process.env.TEST_URL||'http://localhost:4186',out=path.join(__dirname,'verification');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const controller=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true}),receiver=await browser.newContext({viewport:{width:1920,height:1080}});
 await receiver.addInitScript(()=>{const original=Date.now.bind(Date);Date.now=()=>original()+300000;});
 const tablet=await controller.newPage(),tv=await receiver.newPage(),errors=[],checks=[];
 for(const p of [tablet,tv]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});}
 const request=controller.request;
 const remote=async(station=6)=>(await request.get(base+'/api/state?station='+station)).json();
 const clean=s=>{const {serverNow,...rest}=s;return rest;};
 const other=await Promise.all([1,2,3,5].map(async n=>clean(await remote(n))));
 await request.post(base+'/api/state?station=6',{data:{view:'project',projectId:'06',mode:'landing',language:'es',game:S.fresh()}});
 const click=action=>tablet.locator(`[data-action="${action}"]`).first().click();
 async function waitState(phase){await tablet.waitForFunction(p=>document.querySelector('.rl-phase-'+p),phase);await tv.waitForFunction(p=>document.querySelector('.rl-phase-'+p),phase);}
 async function fits(page,label){const d=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}));assert.ok(d.sw<=d.w+1&&d.sh<=d.h+1,label+' '+JSON.stringify(d));checks.push(label);}
 async function shot(page,name){await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});}
 await tv.goto(base+'/display.html?station=6');await tablet.goto(base+'/projects/06-reglac/index.html?station=6');
 await tablet.waitForSelector('.rl-landing');assert.match(tablet.url(),/projects\/06-reglac/);
 assert.equal(await tablet.locator('[data-action="game"]').isDisabled(),true);await fits(tablet,'landing 1180x820');await shot(tablet,'tablet-main-es');
 await tablet.keyboard.press('Tab');assert.equal(await tablet.evaluate(()=>document.activeElement.tagName),'BUTTON');
 const targets=await tablet.locator('.rl-header button,.rl-footer button').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
 assert.ok(targets.every(t=>t.w>=44&&t.h>=44));checks.push('keyboard focus and minimum 44px touch controls');
 await tablet.setViewportSize({width:1024,height:768});await fits(tablet,'landing 1024x768');
 const start=Date.now();await click('information');await tv.waitForSelector('.rl-information[data-language="es"]');
 await tablet.locator('[data-language="en"]').click();await tv.waitForSelector('.rl-information[data-language="en"]');
 assert.equal(await tablet.locator('.rl-landing').count(),1);
 await tablet.waitForFunction(()=>!document.querySelector('[data-action="game"]').disabled,{},{timeout:14000});
 assert.ok(Date.now()-start>=9700);assert.equal(await tablet.locator('[data-action="game"]').count(),2);
 assert.equal(await tv.locator('.rl-information[data-language="en"]').count(),1);checks.push('10-second unlock; infographic persists; ES/EN');
 await shot(tv,'tv-information-en');await click('game');await tablet.waitForSelector('.rl-mission');await fits(tablet,'intro 1024x768');await shot(tablet,'tablet-intro-en');
 await click('start');await waitState('manual');await fits(tablet,'manual 1024x768');await fits(tv,'manual TV 1920x1080');await shot(tv,'tv-manual-en');
 await tablet.locator('[data-doc="A"]').click();await tablet.locator('[data-doc="B"]').click();await tablet.locator('[data-doc="C"]').click();assert.deepEqual((await remote()).game.selected,['A','B']);
 await tablet.locator('[data-doc="B"]').click();await tablet.locator('[data-doc="C"]').click();
 await tv.waitForFunction(()=>document.querySelectorAll('.is-selected').length===2);
 const before=await remote();await tablet.locator('[data-language="es"]').click();assert.equal((await remote()).game.startedAt,before.game.startedAt);
 await tablet.waitForTimeout(1200);
 const time=async p=>p.locator('[data-clock]').textContent();
 assert.ok(Math.abs(Number((await time(tablet)).replace(':',''))-Number((await time(tv)).replace(':','')))<=1);checks.push('shared server clock corrects TV +5 minute skew');
 await click('check');await waitState('manualReveal');assert.equal((await remote()).game.outcomes[0],true);await fits(tablet,'manual reveal 1024x768');
 const elapsed=(await remote()).game.elapsed[0];await tablet.waitForTimeout(300);assert.equal((await remote()).game.elapsed[0],elapsed);
 await click('next');await click('next');await waitState('assist');
 await click('activate');await waitState('organize');await fits(tablet,'organize 1024x768');await shot(tv,'tv-organize-es');
 assert.equal(await tablet.locator('[data-doc="B"]').isDisabled(),true);
 await waitState('scan');await shot(tv,'tv-scan-es');await waitState('identify');await fits(tv,'identify TV 1920x1080');await shot(tv,'tv-identify-es');await waitState('confirm');
 assert.equal(await tv.locator('.is-match').count(),2);await fits(tablet,'confirm 1024x768');await shot(tablet,'tablet-confirm-es');
 await tablet.locator('[data-doc="B"]').click();await tablet.locator('[data-doc="D"]').click();await click('check');await waitState('assistReveal');await click('next');
 await tablet.waitForSelector('.rl-results');await tv.waitForSelector('.rl-results');
 let result=(await remote()).game;assert.equal(result.outcomes[1],true);assert.ok(result.elapsed[1]>=6000);assert.equal(result.elapsed[0],elapsed);
 await fits(tablet,'results 1024x768');await shot(tv,'tv-results-es');await shot(tablet,'tablet-results-es');
 await tablet.locator('[data-language="en"]').click();assert.deepEqual((await remote()).game.elapsed,result.elapsed);await tv.waitForFunction(()=>document.documentElement.lang==='en');await shot(tv,'tv-results-en');
 await tablet.reload();await tablet.waitForSelector('.rl-results');assert.deepEqual((await remote()).game.elapsed,result.elapsed);checks.push('reload restores results and actual elapsed times');
 await click('restart');await tablet.waitForSelector('.rl-mission');assert.deepEqual((await remote()).game,S.fresh(true));
 await click('start');await tablet.locator('[data-doc="E"]').click();await tablet.locator('[data-doc="F"]').click();await click('check');await waitState('manualReveal');assert.equal((await remote()).game.outcomes[0],false);
 await click('next');await click('next');await click('activate');await waitState('organize');
 const animationAt=(await remote()).game.animationAt;await tablet.reload();await waitState('organize');assert.equal((await remote()).game.animationAt,animationAt);checks.push('reload resumes animation without restarting time');
 await click('menu');await tablet.waitForTimeout(6500);assert.equal((await remote()).mode,'landing');checks.push('incorrect answer continues; menu cancels animation and timers');
 await click('home');await tablet.waitForSelector('[data-project="06"]');assert.equal((await remote()).view,'home');
 await tablet.locator('[data-project="06"]').click();await tablet.waitForSelector('.rl-landing');assert.equal(await tablet.locator('[data-action="game"]').isDisabled(),true);checks.push('Home reaches general menu; project 06 remains accessible');
 for(const [i,n] of [1,2,3,5].entries())assert.deepEqual(clean(await remote(n)),other[i]);
 assert.deepEqual(errors,[]);checks.push('other stations unchanged; no browser or HTTP errors');
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({passed:true,checks,sessionTimes:result.elapsed,errors},null,2));console.log(JSON.stringify({passed:true,checks,sessionTimes:result.elapsed,errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
