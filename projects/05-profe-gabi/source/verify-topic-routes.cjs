const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),schema=require('../state.js');
(async()=>{
 const b=await chromium.launch({channel:'chrome'});
 try{
  const base=process.env.TEST_URL||'http://localhost:4173',out=path.resolve(__dirname,'../review/2026-11-14');fs.mkdirSync(out,{recursive:true});
  const es=JSON.parse(fs.readFileSync(path.join(__dirname,'conversations.es.json'),'utf8'));
  const en=JSON.parse(fs.readFileSync(path.join(__dirname,'conversations.en.json'),'utf8'));
  const tablet=await b.newPage({viewport:{width:1180,height:820},hasTouch:true}),tv=await b.newPage({viewport:{width:1920,height:1080}}),errors=[];
  for(const p of [tablet,tv])p.on('pageerror',e=>errors.push(e.message));
  const state=async()=>(await tablet.request.get(base+'/api/state?station=5')).json();
  const snapshot=async id=>{const d=(await tablet.request.get(base+'/api/state?station='+id)).json();const {serverNow,updatedAt,...rest}=await d;return rest;};
  const isolated=await Promise.all([1,2,3].map(snapshot));
  const click=async action=>tablet.locator(`[data-action="${action}"]`).first().click();
  await tv.goto(base+'/display.html?station=5');await tablet.goto(base+'/projects/05-profe-gabi/index.html?station=5');await tablet.locator('.gabi-approved-screen').waitFor();
  if(!await tablet.locator('[data-action=game]').count()){await click('home');await tablet.waitForURL(base+'/index.html?station=5');await tablet.goto(base+'/projects/05-profe-gabi/index.html?station=5');}
  await click('game');await tablet.locator('[data-topic="0"]').waitFor();await tv.locator('.gabi-game-welcome').waitFor();
  const expected=['Prepare for a class','Create activities and quizzes','Community Guidelines','Professional growth and wellbeing'];
  for(let i=0;i<4;i++)assert.equal(await tablet.locator(`[data-topic="${i}"]`).getAttribute('aria-label'),expected[i]);
  for(const p of [tablet,tv])assert.ok(!/Prepare a lesson|Create activities and assess|Guide my professional growth|Look after my wellbeing/i.test(await p.locator('body').textContent()));
  await tablet.screenshot({path:path.join(out,'tablet-topics.png')});await tv.screenshot({path:path.join(out,'tv-topics.png')});
  let deliveries=0,endings=0;
  async function read(pair,tag){
   for(let part=0;part<pair.gabiParts.length;part++){
    await tablet.locator('[data-action=continue]:not([disabled])').waitFor();
    await tv.waitForFunction(text=>document.querySelector('.gabi-message-gabi:not([hidden]) p')?.textContent===text,pair.gabiParts[part]);
    assert.equal(await tv.locator('.gabi-message-user p').textContent(),pair.user);
    assert.equal(await tv.locator('.gabi-message-gabi:not([hidden]) p').getAttribute('lang'),'es');
    const metrics=await tv.locator('.gabi-messages').evaluate(log=>{const r=log.getBoundingClientRect(),u=log.querySelector('.gabi-message-user').getBoundingClientRect(),p=log.querySelector('.gabi-message-gabi:not([hidden]) p'),a=p.closest('article').getBoundingClientRect();return {top:r.top,bottom:r.bottom,user:u.top,reply:a.bottom,font:getComputedStyle(p).fontSize};});
    assert.equal(metrics.font,'22px');assert.ok(metrics.user>=metrics.top-1&&metrics.reply<=metrics.bottom+1,tag+' clipped '+JSON.stringify(metrics));
    assert.equal(await tablet.locator('[data-action=menu],[data-action=fullscreen],[data-gabi-connection]').count(),0);
    assert.equal(await tv.locator('button').count(),0);
    if(part===0&&['biology-exam','community','growth','wellbeing'].includes(tag))await tv.screenshot({path:path.join(out,tag+'-chat.png')});
    if(tag==='community'&&part===0){await tablet.reload();await tv.reload();await tablet.locator('[data-action=continue]:not([disabled])').waitFor();await tv.waitForFunction(text=>document.querySelector('.gabi-message-gabi:not([hidden]) p')?.textContent===text,pair.gabiParts[part]);}
    const offline=tag==='community'&&part===0;
    if(offline){await tablet.context().setOffline(true);await tv.context().setOffline(true);}
    await click('continue');deliveries++;
    if(offline){await tablet.locator('[data-action=continue]:not([disabled])').waitFor();await tablet.context().setOffline(false);await tv.context().setOffline(false);await tv.waitForFunction(text=>document.querySelector('.gabi-message-gabi:not([hidden]) p')?.textContent===text,pair.gabiParts[part+1]);}
   }
  }
  const routes=[[0,0,0],[0,0,1],[1,0,0],[1,0,1],[2,0,null],[3,0,null],[3,1,null]];
  for(const [topic,situation,follow] of routes){
   if(endings)await click('restart');
   await tablet.locator(`[data-topic="${topic}"]`).click();
   if(topic===3){
    await tablet.locator('[data-situation="0"]').waitFor();await tv.locator('.gabi-subcategory-welcome').waitFor();
    assert.equal((await state()).game.phase,'situations');assert.equal((await state()).game.startedAt,0);
    assert.equal(await tv.locator('.gabi-chat').count(),0);assert.equal(await tablet.locator('[data-action=skip]').count(),0);
    assert.deepEqual(await tablet.locator('[data-situation]').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label'))),['Professional growth','Wellbeing']);
    if(situation===0){await tablet.screenshot({path:path.join(out,'tablet-growth-wellbeing-choice.png')});await tv.screenshot({path:path.join(out,'tv-growth-wellbeing-choice.png')});await tablet.reload();await tablet.locator('[data-situation="0"]').waitFor();}
    await tablet.locator(`[data-situation="${situation}"]`).click();
   }
   await click('skip');await read(es[topic].options[situation],topic===2?'community':topic===3?situation?'wellbeing':'growth':'initial');
   if(follow!==null){
    await tablet.locator('[data-follow="0"]').waitFor();
    if(topic===1)assert.deepEqual(await tablet.locator('[data-follow]').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label'))),['When to quiz my class','Prepare mid-term exams']);
    await tablet.locator(`[data-follow="${follow}"]`).click();await click('skip');await read(es[topic].options[situation].follow[follow],topic===1&&follow===1?'biology-exam':'follow');
   }else assert.equal(await tablet.locator('[data-follow]').count(),0);
   await tablet.locator('.gabi-summary').waitFor();await tv.locator('.gabi-art-live-chat.is-complete').waitFor();assert.equal((await state()).game.phase,'complete');
   if(topic===2){assert.equal((await state()).game.follow,null);await tablet.screenshot({path:path.join(out,'community-complete.png')});}
   endings++;
  }
  // Terminal conversations return to the appropriate choice without a stray follow-up.
  await click('back');await tablet.locator('[data-situation="0"]').waitFor();await click('back');await tablet.locator('[data-topic="0"]').waitFor();
  for(const size of [{width:960,height:600},{width:1180,height:820}]){
   await tablet.setViewportSize(size);for(const i of [0,1,2,3]){const m=await tablet.locator(`[data-topic="${i}"]`).evaluate(e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height};});assert.ok(m.w>=44&&m.h>=44);}
   for(const button of await tablet.locator('.gabi-project-nav button').all()){const hit=await button.boundingBox(),pill=await button.locator('.gabi-project-nav-pill').boundingBox();assert.ok(hit.height>=44);assert.ok(Math.abs(pill.width/pill.height-132/50)<.01);}
  }
  await click('project-menu');await tablet.locator('[data-action=information]').waitFor();await tv.locator('.gabi-tv-invite').waitFor();assert.equal((await state()).mode,'landing');
  await click('game');await tablet.locator('.gabi-project-nav [data-action=home]').click();await tablet.waitForURL(base+'/index.html?station=5');assert.equal((await state()).view,'home');assert.deepEqual(await Promise.all([1,2,3].map(snapshot)),isolated);assert.deepEqual(errors,[]);
  assert.equal(schema.sanitize({...schema.fresh(),version:6}),null);
  assert.equal(schema.sanitize({...schema.fresh(),phase:'follow',topic:2,situation:0}),null);
  const report={passed:true,topics:expected,endings,deliveries,communitySingleConversation:true,categoryFourChoosesBeforeChat:true,biologyExam:true,noClippedText:true,font:'22px',reload:true,homeBackRestart:true,stationIsolation:true,browserErrors:errors};
  fs.writeFileSync(path.join(out,'topic-routes-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
