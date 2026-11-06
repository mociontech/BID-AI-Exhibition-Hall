/* Current RegLAC experience: local integration and visual verification. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const {spawn}=require('node:child_process'),net=require('node:net'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
(async()=>{
 const socket=net.createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
 const root=path.resolve(__dirname,'../..'),server=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:String(port),HOST:'127.0.0.1'},stdio:'ignore'});
 let browser;
 try{
  const base=`http://127.0.0.1:${port}`;
  for(let i=0;i<60;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({channel:'chrome',headless:true});
  const controller=await browser.newContext({viewport:{width:1180,height:820},hasTouch:true}),receiver=await browser.newContext({viewport:{width:1920,height:1080}});
  const tablet=await controller.newPage(),tv=await receiver.newPage(),errors=[],checks=[];
  for(const p of [tablet,tv]){p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});}
  const read=async n=>(await controller.request.get(base+'/api/state?station='+n)).json();
  const clean=s=>{const {serverNow,...rest}=s;return rest;};
  const others=await Promise.all([1,2,3,4,5,7,8,9,10,11].map(async n=>clean(await read(n))));
  const seed=async state=>{const response=await controller.request.post(base+'/api/state?station=6',{data:{view:'project',projectId:'06',language:'en',mode:'landing',game:null,...state}});assert.ok(response.ok());};
  await seed({});await tv.goto(base+'/display.html?station=6');await tablet.goto(base+'/projects/06-reglac/index.html?station=6');
  await tablet.waitForSelector('.rl-landing');await tv.waitForSelector('.rl-landing');
  const click=action=>tablet.locator(`[data-action="${action}"]`).first().click();
  async function noGame(page){assert.equal(await page.locator('[data-action="game"],[data-doc],.rl-clock,.rl-game,.rl-results').count(),0);assert.doesNotMatch(await page.locator('.rl-app').innerText(),/undefined|minigame|minijuego|Detective|Round 1|Ronda 1/i);}
  async function fits(page,label){await page.evaluate(()=>document.fonts.ready);const d=await page.evaluate(()=>({w:innerWidth,h:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}));assert.ok(d.sw<=d.w+1&&d.sh<=d.h+1,label+' '+JSON.stringify(d));await noGame(page);checks.push(label);}
  const out=path.join(os.tmpdir(),'reglac-video-qa');fs.mkdirSync(out,{recursive:true});
  assert.equal(await tablet.locator('[data-action="video"]').isDisabled(),false);
  await tablet.keyboard.press('Tab');assert.equal(await tablet.evaluate(()=>document.activeElement.tagName),'BUTTON');
  for(const lang of ['en','es']){
   await tablet.locator(`[data-language="${lang}"]`).click();
   for(const size of [{width:1180,height:820},{width:1024,height:768}]){
    await tablet.setViewportSize(size);await fits(tablet,`landing ${lang} ${size.width}`);
   }
   await click('information');await tv.waitForSelector(`.rl-information[data-language="${lang}"]`);
   await fits(tablet,`information controller ${lang}`);await fits(tv,`information TV ${lang}`);
   await click('video');await tv.waitForSelector('.rl-video-tv');
   await tv.waitForFunction(l=>document.documentElement.lang===l,lang);
   const title=lang==='es'?'Video institucional':'Institutional video';
   assert.equal(await tablet.locator('.rl-video h1').innerText(),title);assert.equal(await tv.locator('.rl-video h1').innerText(),title);
   const packet=await read(6);assert.equal(packet.mode,'video');assert.equal(packet.game,null);
   await fits(tv,`video TV ${lang}`);
   for(const size of [{width:1180,height:820},{width:1024,height:768}]){
    await tablet.setViewportSize(size);await fits(tablet,`video tablet ${lang} ${size.width}`);
   }
   await tablet.screenshot({path:path.join(out,`tablet-video-${lang}.png`)});await tv.screenshot({path:path.join(out,`tv-video-${lang}.png`)});
   const targets=await tablet.locator('button:not(:disabled):visible').evaluateAll(nodes=>nodes.map(n=>({w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height})));
   assert.ok(targets.every(t=>t.w>=44&&t.h>=44),'minimum touch targets');
   await tablet.reload();await tablet.waitForSelector('.rl-video-controller');
   assert.equal(await tablet.locator('.rl-video h1').innerText(),title);
   await click('back');await tv.waitForSelector('.rl-landing');
  }
  // Old packets must not resurrect the former game on either device.
  for(const mode of ['game','results','cta']){
   await tablet.goto('about:blank');
   await seed({mode,view:mode==='game'?'game':'project',game:require('./state.js').fresh(true)});
   await tablet.goto(base+'/projects/06-reglac/index.html?station=6');
   await tablet.waitForSelector(mode==='cta'?'.rl-landing':'.rl-video-controller');
   await tv.waitForSelector(mode==='cta'?'.rl-information':'.rl-video-tv');
   await noGame(tablet);await noGame(tv);
  }
  await click('home');await tablet.waitForURL(/projects=1/);await tv.waitForFunction(()=>!document.querySelector('.rl-app'));
  assert.equal((await read(6)).view,'home');
  assert.deepEqual(await Promise.all([1,2,3,4,5,7,8,9,10,11].map(async n=>clean(await read(n)))),others);
  assert.deepEqual(errors,[]);console.log(JSON.stringify({ok:true,checks,legacyMigration:true,reload:true,navigation:true,otherStationsUnchanged:true,errors,screenshots:out},null,2));
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
