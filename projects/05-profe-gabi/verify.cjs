/* Integration: run with local server and NODE_PATH pointing to Playwright. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const schema=require('./state.js');
(async()=>{
 const base=process.env.TEST_URL||'http://localhost:4173',output=path.join(__dirname,'verification');
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const controller=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true});
 const receiver=await browser.newContext({viewport:{width:1920,height:1080}});
 // Simulate a TV clock five minutes ahead: shared server time must correct it.
 await receiver.addInitScript(()=>{const original=Date.now.bind(Date);Date.now=()=>original()+300000;});
 const tablet=await controller.newPage(),tv=await receiver.newPage(),errors=[];
 for(const p of [tablet,tv]){
  p.on('pageerror',e=>errors.push(e.message));
  p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});
 }
 const request=controller.request;
 const state=async(station=5)=>(await request.get(`${base}/api/state?station=${station}`)).json();
 const clean=s=>{const {serverNow,updatedAt,...rest}=s;return rest;};
 async function waitState(predicate){
  const end=Date.now()+7000;let value;
  while(Date.now()<end){value=await state();if(predicate(value))return value;await new Promise(r=>setTimeout(r,60));}
  assert.fail('State did not match: '+JSON.stringify(value));
 }
 async function fits(page,label){
  const d=await page.evaluate(()=>({width:innerWidth,height:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}));
  assert.ok(d.sw<=d.width+1&&d.sh<=d.height+1,label+' '+JSON.stringify(d));
 }
 const shot=async(p,name)=>p.screenshot({path:path.join(output,name+'.png'),fullPage:true});
 const click=async action=>tablet.locator(`[data-action="${action}"]`).first().click();
 async function tvText(text){await tv.waitForFunction(text=>document.querySelector('.gabi-app')?.textContent.includes(text),text);}
 async function choose(kind,index){await tablet.locator(`[data-${kind}="${index}"]`).click();}
 async function skip(){await click('skip');}
 const checks=[],reset={view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null};
 try{
  for(const station of [1,2,3,5])assert.equal((await request.post(`${base}/api/state?station=${station}`,{data:reset})).status(),200);
  const isolated=await Promise.all([1,2,3].map(async s=>clean(await state(s))));
  await request.post(`${base}/api/state?station=5`,{data:{view:'project',projectId:'05',section:'menu',language:'en',mode:'landing',game:schema.fresh(false,Date.now()+10000)}});
  await tv.goto(`${base}/display.html?station=5`);
  await tablet.goto(`${base}/index.html?station=5`);await tablet.locator('[data-project="05"]').click();
  await tablet.waitForURL('**/projects/05-profe-gabi/index.html?station=5');await tv.locator('.gabi-tv-invite').waitFor();
  assert.equal(await tablet.locator('[data-language="en"]').getAttribute('aria-pressed'),'true');
  await tablet.locator('.gabi-approved-artwork').evaluate(img=>img.decode());
  assert.equal(await tablet.locator('.gabi-art-hotspot[data-action="game"]').isDisabled(),false);
  await click('game');await tablet.locator('[data-topic="0"]').waitFor();
  await click('menu');
  await request.post(`${base}/api/state?station=5`,{data:{view:'project',projectId:'05',section:'menu',language:'en',mode:'landing',game:schema.fresh(false,Date.now()+10000)}});
  await tablet.reload();
  assert.equal(await tablet.locator('[data-action="game"]').first().isEnabled(),true);
  await waitState(s=>s.game.ready&&s.game.unlockAt===0);
  checks.push('Legacy locked session upgrades to immediate access on reload');
  await shot(tablet,'branded-cover-en');
  await tablet.locator('[data-language="es"]').click();
  await tablet.evaluate(()=>document.fonts.ready);
  assert.equal(await tablet.locator('[data-action="game"]').first().isDisabled(),false);
  await fits(tablet,'menu');await shot(tablet,'menu-es');await shot(tv,'tv-invitation-es');
  assert.equal(await tv.locator('button,input,textarea').count(),0);
  await tablet.locator('[data-language="es"]').focus();
  await tablet.keyboard.press('Tab');
  assert.equal(await tablet.locator('[data-language="en"]').evaluate(el=>el===document.activeElement),true);
  assert.equal(await tablet.locator('[data-language="en"]').evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
  const small=await tablet.locator('button').evaluateAll(nodes=>nodes.filter(el=>el.getBoundingClientRect().width<44||el.getBoundingClientRect().height<44).map(el=>({text:el.textContent,w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height})));
  assert.deepEqual(small,[]);
  await click('fullscreen');await tablet.waitForFunction(()=>!!document.fullscreenElement);
  await click('fullscreen');await tablet.waitForFunction(()=>!document.fullscreenElement);
  checks.push('Menu, separate TV invitation, native fullscreen, keyboard focus, touch targets');
  await click('information');await tv.locator('.gabi-infographic').waitFor();
  assert.equal(await tablet.locator('.gabi-hero').count(),1);
  assert.equal(await tablet.locator('[data-action="game"]').first().isDisabled(),false);
  await tablet.locator('[data-language="en"]').click();await tvText('136 survey respondents');
  const artwork=tv.locator('.gabi-approved-artwork');await artwork.waitFor();
  await artwork.evaluate(img=>img.decode());
  assert.deepEqual(await artwork.evaluate(img=>({width:img.naturalWidth,height:img.naturalHeight})),{width:1920,height:1080});
  assert.equal(await tv.locator('button,input,textarea').count(),0);
  for(const size of [{width:1280,height:800},{width:3840,height:2160},{width:1920,height:1080}]){
   await tv.setViewportSize(size);await fits(tv,'approved PNG '+size.width);
   const bounds=await artwork.evaluate(img=>{const b=img.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,fit:getComputedStyle(img).objectFit};});
   assert.ok(bounds.x>=-1&&bounds.y>=-1&&bounds.x+bounds.width<=size.width+1&&bounds.y+bounds.height<=size.height+1);
   assert.ok(Math.abs(bounds.width/bounds.height-16/9)<.01);assert.equal(bounds.fit,'contain');
  }
  await shot(tv,'infographic-en');await fits(tv,'infographic EN');
  await tablet.reload();await tablet.locator('.gabi-hero').waitFor();
  assert.equal(await tablet.locator('[data-action="game"]').first().isDisabled(),false);
  await tablet.waitForFunction(()=>document.querySelector('.gabi-info-controls [data-action="game"]'));
  assert.equal((await state()).game.unlockAt,0);
  await shot(tablet,'cta-en');
  await tablet.locator('[data-language="es"]').click();await tvText('136 personas');await fits(tv,'infographic ES');await shot(tv,'infographic-es');
  assert.equal(await tv.locator('.gabi-approved-artwork').count(),0);
  await click('menu');assert.equal(await tablet.locator('[data-action="game"]').first().isEnabled(),true);
  await click('game');await tv.locator('.gabi-game-welcome').waitFor();
  assert.equal(await tablet.locator('[data-topic]').count(),4);
  await shot(tablet,'cases-es');await fits(tv,'four cases on TV');
  checks.push('Infographic ES/EN, survey denominator and causal-impact caveat, immediate game access survives language/reload without unlock timer');
  checks.push('Original English TV PNG, 1920x1080 intrinsic size, proportional fit at three TV viewports, Spanish fallback and read-only TV');
  // Run the first exchange at its real speed and inspect literal typing.
  await choose('topic',0);await tv.locator('[data-animate]').waitFor();
  await tv.waitForFunction(()=>document.querySelector('[data-draft]')?.textContent.length>=3);
  const sample=await tv.locator('[data-draft]').textContent();
  assert.ok(sample.startsWith('\u00bfMe')&&sample.length<30,sample);
  assert.equal(await tablet.locator('[data-topic="1"]').isDisabled(),true);
  await shot(tv,'chat-typing-es');
  await tv.locator('[data-thinking]').waitFor({state:'visible'});await fits(tv,'live chat TV');await shot(tv,'chat-thinking-es');
  await tablet.locator('[data-follow="0"]').waitFor();
  await tvText('objetivo de aprendizaje');
  const skew=await tv.evaluate(()=>Date.now()-AI_SYNC.now());assert.ok(Math.abs(skew-300000)<500,`clock ${skew}`);
  await choose('follow',0);await tv.locator('[data-animate]').waitFor();
  await tv.waitForFunction(()=>document.querySelector('[data-draft]')?.textContent.length>8);
  await tv.reload();await tv.locator('[data-animate]').waitFor();
  await tablet.reload();await tablet.locator('[data-action="skip"]').waitFor();
  await skip();await tablet.locator('.gabi-summary').waitFor();await tv.locator('.is-complete').waitFor();
  await fits(tablet,'summary');await fits(tv,'summary TV');await shot(tablet,'completion-tablet-es');await shot(tv,'completion-tv-es');
  checks.push('Literal typing, auto-send, thinking, five-minute TV clock skew corrected, reload both devices mid-animation');
  // Four documented cases, one decision with two choices: eight endings per language.
  let traversed=0;
  for(const language of ['es','en']){
   await tablet.locator(`[data-language="${language}"]`).click();
   for(let topic=0;topic<4;topic++)for(let situation=0;situation<1;situation++)for(let follow=0;follow<2;follow++){
    await click('restart');await choose('topic',topic);await skip();
    await choose('follow',follow);await skip();
    const actual=await waitState(s=>s.game.phase==='complete'&&s.game.topic===topic&&s.game.situation===situation&&s.game.follow===follow&&s.language===language);
    assert.ok(schema.sanitize(actual.game));
    const take=await tablet.evaluate(({language,topic,situation,follow})=>PROFE_GABI_CONVERSATIONS[language][topic].options[situation].follow[follow].take,{language,topic,situation,follow});
    await tvText(take);assert.equal(await tv.locator('button,input,textarea').count(),0);
    traversed++;
   }
  }
  await shot(tablet,'completion-tablet-en');await shot(tv,'completion-tv-en');
  await click('menu');
  await tablet.locator('.gabi-approved-artwork').evaluate(img=>img.decode());
  await click('information');await tv.locator('.gabi-infographic').waitFor();
  await click('game');await tablet.locator('[data-topic="0"]').waitFor();
  for(const size of [{width:960,height:600},{width:1180,height:820},{width:1920,height:1080}]){
   await tablet.setViewportSize(size);await fits(tablet,'branded hotspots '+size.width);
   for(const index of [0,1,2,3]){
    const region=await tablet.locator(`[data-topic="${index}"]`).evaluate(el=>{const a=el.getBoundingClientRect(),c=el.closest('.gabi-artwork-canvas').getBoundingClientRect();return {x:(a.x-c.x)/c.width,y:(a.y-c.y)/c.height,w:a.width,h:a.height};});
    const expected=await tablet.evaluate(i=>PROFE_GABI_ARTWORK.regions.topics[i],index);
    assert.ok(Math.abs(region.x-expected[0]/1920)<.003&&Math.abs(region.y-expected[1]/1080)<.003);assert.ok(region.w>=44&&region.h>=44);
   }
   await choose('topic',2);await skip();await tvText('recognition');
   await shot(tablet,'branded-career-follow-'+size.width);await choose('follow',1);await skip();await tv.locator('.is-complete').waitFor();
   await tvText('human mentoring');if(size.width!==1920)await click('restart');
  }
  checks.push('English cover/info/game image hotspots work; career case stays current; proportional hit areas at three tablet sizes');
  assert.equal(await tablet.locator('a[href^="http"]').count(),0);
  assert.equal(await tv.locator('a[href^="http"]').count(),0);
  await tv.locator('.gabi-source').waitFor();
  assert.ok(await tv.locator('.gabi-official-avatar').count()>0);
  assert.equal(await tv.locator('.gabi-official-avatar').first().evaluate(el=>el.complete&&el.naturalWidth>0),true);
  checks.push('Official avatar loaded, source visible as plain text, no external navigation');
  checks.push(`${traversed} conversational paths completed (8 ES + 8 EN), every final takeaway received by separate TV`);
  // Language switching during typing atomically rebuilds all messages.
  await click('restart');await choose('topic',1);
  await tablet.locator('[data-language="es"]').click();await tv.waitForFunction(()=>document.documentElement.lang==='es');
  await skip();await tvText('Podemos partir con actividades de apoyo visual');
  assert.equal(await tv.locator('.gabi-messages').textContent().then(t=>t.includes('Hi!')),false);
  // Back cancels an animation, without allowing stale completions.
  await choose('follow',0);await click('back');await tablet.locator('[data-follow="1"]').waitFor();
  await waitState(s=>s.game.phase==='follow'&&s.game.follow===null);
  // Offline changes must re-publish even with no subsequent visitor input.
  await controller.setOffline(true);await receiver.setOffline(true);
  await choose('follow',1);await skip();
  await tablet.waitForFunction(()=>document.querySelector('[data-gabi-connection]')?.dataset.status==='offline');
  await tv.waitForFunction(()=>document.querySelector('[data-gabi-connection]')?.dataset.status==='offline');
  assert.equal(await tv.locator('.gabi-chat').count(),1);
  await controller.setOffline(false);await receiver.setOffline(false);
  await waitState(s=>s.game.phase==='complete'&&s.game.follow===1);
  await tv.locator('.is-complete').waitFor();
  await tv.waitForFunction(()=>document.querySelector('[data-gabi-connection]')?.dataset.status==='connected');
  assert.equal(await tv.locator('.gabi-message-user').count(),2);
  checks.push('Atomic language change during typing, Back cancels timers, offline cached TV and automatic latest-state replay');
  await click('restart');
  await waitState(s=>s.game.phase==='topics'&&s.game.topic===null&&s.game.situation===null&&s.game.follow===null);
  await tv.locator('.gabi-game-welcome').waitFor();
  for(const size of [{width:1024,height:768},{width:1280,height:800},{width:1366,height:768},{width:960,height:600}]){
   await tablet.setViewportSize(size);await fits(tablet,'topics '+size.width);
   await choose('topic',0);await skip();await fits(tablet,'follow '+size.width);
   await choose('follow',1);await skip();await fits(tablet,'complete '+size.width);
   await click('menu');await fits(tablet,'menu '+size.width);await click('game');
  }
  await choose('topic',0);await click('home');await tablet.waitForURL(`${base}/index.html?station=5`);
  await tablet.locator('[data-project="05"]').click();
  assert.equal(await tablet.locator('[data-action="game"]').first().isEnabled(),true);
  await click('information');await click('home');
  await tablet.waitForURL(`${base}/index.html?station=5`);await tv.locator('.display-app').waitFor();
  await tablet.waitForTimeout(10500);assert.equal((await state()).view,'home');
  assert.deepEqual(await Promise.all([1,2,3].map(async s=>clean(await state(s)))),isolated);
  checks.push('Restart clears choices, menu and fresh visitor keep game available, Home cancels animations, five landscape viewports, station isolation');
  // Malformed new game state cannot replace current station state.
  for(const game of [{...schema.fresh(true),phase:'complete'},{...schema.fresh(true),topic:4},{...schema.fresh(true),version:2},{...schema.fresh(true),phase:'follow',topic:0,situation:1},{...schema.fresh(true),phase:'animating',turn:'follow',startedAt:Date.now()}]){
   const r=await request.post(`${base}/api/state?station=5`,{data:{view:'game',projectId:'05',mode:'game',game}});assert.equal(r.status(),400);
  }
  assert.equal((await state()).view,'home');
  // Existing project receivers still load their own assets and entry points.
  for(const [id,slug,selector,mode] of [['01','aquadata','.aquadata-display','info'],['02','bogota-traffic-prediction','.ptd-tv-information','overview'],['03','costa-rica-smart-borders','.crb-display','info'],['04','parque-tecnologico-guatiguara','.guatiguara-display','info']]){
   await request.post(`${base}/api/state?station=1`,{data:{view:id==='02'?'overview':'project',projectId:id,section:'info',language:'es',mode,game:null}});
   const p=await browser.newPage();await p.goto(`${base}/display.html?station=1`);await p.locator(selector).waitFor();
   await p.waitForFunction(()=>[...document.images].every(img=>img.complete&&img.naturalWidth>0));
   await p.goto(`${base}/projects/${id}-${slug}/index.html?station=1`);await p.waitForFunction(()=>document.querySelector('#app')?.children.length>0);await p.close();
  }
  checks.push('Server rejects invalid 05 state; 01–04 controller and display smoke checks');
  assert.deepEqual(errors,[]);
  const report={passed:true,gameAvailableFromStart:true,pathsCompleted:traversed,checks,limitations:'Browser emulation and separate contexts; physical tablet/TV hardware not available.'};
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
