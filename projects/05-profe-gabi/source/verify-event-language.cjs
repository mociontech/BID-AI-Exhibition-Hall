/* Event contract: English interface + Spanish WhatsApp, manually paginated. Local only. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const schema=require('../state.js');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const base=process.env.TEST_URL||'http://localhost:4173',out=path.resolve(__dirname,'../review/2026-11-09');
  const es=JSON.parse(fs.readFileSync(path.join(__dirname,'conversations.es.json'),'utf8'));
  const en=JSON.parse(fs.readFileSync(path.join(__dirname,'conversations.en.json'),'utf8'));
  const controller=await browser.newContext({viewport:{width:1180,height:820}}),receiver=await browser.newContext({viewport:{width:1920,height:1080}});
  const tablet=await controller.newPage(),tv=await receiver.newPage(),errors=[];
  for(const p of [tablet,tv]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});}
  const state=async(station=5)=>(await controller.request.get(base+'/api/state?station='+station)).json();
  const clean=s=>{const {serverNow,updatedAt,...rest}=s;return rest;};
  const isolated=await Promise.all([1,2,3].map(async s=>clean(await state(s))));
  const click=async a=>tablet.locator(`[data-action="${a}"]`).first().click();
  const ready=async()=>tablet.locator('[data-action="continue"]:not([disabled])').waitFor();
  const visible=async text=>tv.waitForFunction(text=>document.querySelector('.gabi-message-gabi:not([hidden]) p')?.textContent===text,text);
  const disclaimer='English translation of adapted, anonymised real cases. Profe Gabi can make mistakes; the teacher decides.';
  const pagedTopic=es.findIndex(t=>t.options[0].gabiParts.length>1);
  // A previously saved Spanish interface must restore as English without losing its part.
  await controller.request.post(base+'/api/state?station=5',{data:{projectId:'05',view:'game',mode:'game',language:'es',game:{...schema.fresh(),phase:'reading',topic:pagedTopic,situation:0,turn:'situation',part:1}}});
  await tv.goto(base+'/display.html?station=5');await tablet.goto(base+'/projects/05-profe-gabi/index.html?station=5');
  await ready();await visible(es[pagedTopic].options[0].gabiParts[1]);
  assert.equal((await state()).language,'en');assert.equal((await state()).game.part,1);
  assert.equal(await tablet.locator('html').getAttribute('lang'),'en');assert.equal(await tv.locator('html').getAttribute('lang'),'en');
  assert.equal(await tablet.locator('[data-language="es"]').count(),0);
  await click('menu');assert.equal(await tablet.locator('[data-action="information"]').isEnabled(),true);assert.equal(await tablet.locator('[data-action="game"]').first().isEnabled(),true);
  await tv.locator('.gabi-art-welcome.gabi-tv-invite').waitFor();
  await tv.locator('.gabi-art-welcome>img').evaluate(img=>img.decode());
  const idle=await tv.locator('.gabi-art-welcome').evaluate(card=>{const c=card.getBoundingClientRect(),a=card.querySelector('img').getBoundingClientRect();return {width:a.width,centerOffset:Math.abs((a.left+a.width/2)-(c.left+c.width/2)),inside:a.top>c.top&&a.bottom<c.bottom};});
  assert.ok(idle.width>=250&&idle.centerOffset<1&&idle.inside,'Idle avatar must be large and centered');
  assert.ok(!/mini[ -]?game/i.test(await tv.locator('body').textContent()));
  assert.ok((await tv.locator('.gabi-art-welcome').textContent()).includes('Interactive Experience'));
  await tv.screenshot({path:path.join(out,'balanced-idle-en.png')});
  await tablet.locator('.gabi-approved-artwork').evaluate(img=>img.decode());await tablet.screenshot({path:path.join(out,'event-cover-en.png')});
  await click('fullscreen');await tablet.waitForFunction(()=>!!document.fullscreenElement);await click('fullscreen');
  await click('information');await tv.locator('[data-file="tv-information-en.png"]').waitFor();
  assert.equal(await tablet.locator('[data-action="game"]').first().isEnabled(),true);await click('game');
  let pages=0,endings=0;
  async function read(pair,topic,turn,follow){
   const replyHeights=[];
   for(let part=0;part<pair.gabiParts.length;part++){
    await ready();await visible(pair.gabiParts[part]);
    assert.equal((await state()).game.part,part);
    assert.equal(await tablet.locator('[data-action="continue"]').textContent(),'Continue');
    assert.equal(await tablet.locator('[data-follow]').count(),0);
    assert.equal(await tv.locator('.gabi-message-gabi:not([hidden])').count(),1);
    assert.equal(await tv.locator('.gabi-chat-disclaimer').textContent(),disclaimer);
    assert.equal(await tv.locator('.gabi-source').count(),0);
    assert.equal(await tv.locator('.gabi-message-user p').textContent(),pair.user);
    assert.equal(await tv.locator('.gabi-message-gabi:not([hidden]) p').getAttribute('lang'),'es');
    assert.equal(await tv.locator('.gabi-message-part').textContent(),`Part ${part+1} of ${pair.gabiParts.length}`);
    const metrics=await tv.locator('.gabi-message-gabi:not([hidden]) p').evaluate(p=>{const b=p.closest('article').getBoundingClientRect(),l=p.closest('.gabi-messages').getBoundingClientRect(),u=p.closest('.gabi-messages').querySelector('.gabi-message-user').getBoundingClientRect();return {font:getComputedStyle(p).fontSize,top:b.top,bottom:b.bottom,userTop:u.top,logTop:l.top,logBottom:l.bottom};});
    assert.equal(metrics.font,'22px');assert.ok(metrics.top>=metrics.logTop-1&&metrics.bottom<=metrics.logBottom+1,'No clipped Spanish part: '+JSON.stringify(metrics));
    assert.ok(metrics.userTop>=metrics.logTop-1,'The question must also remain fully visible');
    replyHeights.push(metrics.bottom-metrics.top);
    assert.ok(!/mini[ -]?game/i.test(await tv.locator('body').textContent()));
    assert.ok(!/mini[ -]?game/i.test(await tablet.locator('body').textContent()));
    const nonChat=await tv.locator('body').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.gabi-messages').forEach(n=>n.remove());return copy.textContent;});
    assert.ok(!/Continuar|Parte \d|Situación elegida|Menú principal|Sin conexión/.test(nonChat));
    assert.equal(await tv.locator('button,input,textarea').count(),0);
    if(topic===0&&turn==='situation'&&follow===0&&part===0){
     await tablet.waitForTimeout(1100);assert.equal((await state()).game.part,0);
     await tv.screenshot({path:path.join(out,'event-chat-es.png')});await tablet.screenshot({path:path.join(out,'event-reading-en.png')});
    }
    if(topic===pagedTopic&&turn==='situation'&&follow===0&&part===1){await tablet.reload();await tv.reload();await ready();await visible(pair.gabiParts[part]);assert.equal((await state()).game.part,part);}
    if(topic===3&&turn==='situation'&&follow===0)await tv.screenshot({path:path.join(out,`balanced-wellbeing-part-${part+1}.png`)});
    await click('continue');pages++;
    if(part+1<pair.gabiParts.length)assert.equal(await tablet.locator('[data-action="continue"]').isDisabled(),true);
   }
   if(replyHeights.length===2)assert.ok(Math.max(...replyHeights)/Math.min(...replyHeights)<=1.25,'Two-part replies should have balanced visual density');
  }
  for(let topic=0;topic<4;topic++)for(let follow=0;follow<2;follow++){
   if(topic||follow)await click('restart');
   assert.equal(await tablet.locator(`[data-topic="${topic}"]`).getAttribute('aria-label'),en[topic].title);
   await tablet.locator(`[data-topic="${topic}"]`).click();
   if(topic||follow)await click('skip');
   else{
    await tv.waitForFunction(()=>document.querySelector('[data-draft]')?.textContent.startsWith('Nec'));
    const draft=await tv.locator('[data-draft]').textContent();assert.ok(es[0].options[0].user.startsWith(draft));
   }
   await read(es[topic].options[0],topic,'situation',follow);
   await tablet.locator('[data-follow="0"]:not([disabled])').waitFor();
   assert.equal(await tablet.locator(`[data-follow="${follow}"]`).getAttribute('aria-label'),en[topic].options[0].follow[follow].label);
   await tablet.locator(`[data-follow="${follow}"]`).click();await click('skip');
   await read(es[topic].options[0].follow[follow],topic,'follow',follow);
   await tv.locator('.is-complete').waitFor();await tablet.locator('.gabi-summary').waitFor();
   assert.ok((await tv.locator('.gabi-art-takeaway').textContent()).includes(en[topic].options[0].follow[follow].take));
   assert.equal(await tv.locator('[data-file="tv-result-en.png"]').count(),1);
   assert.equal(await tv.locator('.gabi-chat-disclaimer').textContent(),disclaimer);endings++;
   if(topic===0&&follow===0)await tv.screenshot({path:path.join(out,'event-result-en.png')});
  }
  await click('restart');await tablet.locator(`[data-topic="${pagedTopic}"]`).click();await click('skip');await ready();
  await controller.setOffline(true);await receiver.setOffline(true);await click('continue');await ready();
  await controller.setOffline(false);await receiver.setOffline(false);await visible(es[pagedTopic].options[0].gabiParts[1]);
  await tv.waitForFunction(()=>document.querySelector('.gabi-message-part')?.textContent==='Part 2 of 2');
  for(const size of [{width:960,height:600},{width:1180,height:820},{width:1920,height:1080}]){
   await tablet.setViewportSize(size);const r=await tablet.locator('[data-action="continue"]').evaluate(el=>{const r=el.getBoundingClientRect();return {w:r.width,h:r.height,bottom:r.bottom,view:innerHeight};});assert.ok(r.w>=44&&r.h>=44&&r.bottom<=r.view);
  }
  await click('back');await tablet.locator('[data-topic="0"]').waitFor();assert.equal((await state()).game.part,0);
  await tablet.locator(`[data-topic="${pagedTopic}"]`).click();await click('skip');await ready();await click('continue');await click('home');await tablet.waitForURL(base+'/index.html?station=5');
  await tablet.waitForTimeout(1200);assert.equal((await state()).view,'home');
  assert.deepEqual(await Promise.all([1,2,3].map(async s=>clean(await state(s)))),isolated);
  // Other projects retain their controller and receiver entry points.
  for(const slug of ['01-aquadata','02-bogota-traffic-prediction','03-costa-rica-smart-borders','04-parque-tecnologico-guatiguara']){
   assert.equal((await controller.request.get(base+'/projects/'+slug+'/index.html?station=1')).status(),200);
  }
  assert.deepEqual(errors,[]);
  const report={passed:true,endings,spanishPartsRead:pages,interfaceLanguage:'en',conversationLanguage:'es',chatFontAtHD:'22px',exactDisclaimer:true,noSourceLine:true,manualContinue:true,englishResults:true,priorSpanishSessionMigrated:true,reloadOfflineHomeBackRestart:true,stationIsolation:true,interactiveExperienceNaming:true,centeredLargeIdleAvatar:true,twoPartDensityRatioAtMost:1.25};
  fs.writeFileSync(path.join(out,'event-language-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
