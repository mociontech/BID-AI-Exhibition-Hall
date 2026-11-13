/* RegLAC tablet + TV walkthrough. Run with the local server (BASE_URL, default http://127.0.0.1:4173)
   and Playwright available through NODE_PATH. Uses station 6 and ends on the projects menu (Home). */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const out=path.join(__dirname,'verification','menu-2026-11');fs.mkdirSync(out,{recursive:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const station=process.env.STATION||'6';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const tablet=await browser.newPage({viewport:{width:1180,height:820},hasTouch:true});
 const tv=await browser.newPage({viewport:{width:1920,height:1080}});
 const errors=[];
 for(const [name,page] of [['tablet',tablet],['tv',tv]]){
  page.on('pageerror',e=>errors.push(name+' '+e.message));
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(name+' '+r.status()+' '+r.url());});
 }
 await tv.goto(`${base}/display.html?station=${station}`);
 await tablet.goto(`${base}/projects/06-reglac/index.html?station=${station}`);
 await tablet.waitForSelector('.rgl-menu--tablet .rgl-hit--video');
 await tv.waitForSelector('.rgl-menu--landing .rgl-cta');
 assert.equal((await tv.locator('.rgl-cta').innerText()).trim(),'Select an option on the tablet');
 await wait(600);
 await tablet.screenshot({path:path.join(out,'01-tablet-landing.png')});
 await tv.screenshot({path:path.join(out,'02-tv-landing.png')});
 assert.equal(await tablet.locator('.rgl-back').isVisible(),false);
 // About project
 await tablet.locator('.rgl-hit--information').tap();
 await tv.waitForSelector('.rls-sheet');
 const t0=Date.now();
 for(const at of [1000,2300,4600,7200]){
  await wait(Math.max(0,at-(Date.now()-t0)));
  await tv.screenshot({path:path.join(out,`03-tv-info-${String(at).padStart(4,'0')}.png`)});
 }
 assert.equal(await tablet.locator('.rgl-back').isVisible(),true);
 assert.equal((await tv.locator('.rls-cta').innerText()).trim(),'When you are ready, tap “Video” on the tablet');
 assert.equal(await tv.locator('.rls-cta').evaluate(n=>getComputedStyle(n).opacity),'1');
 await tablet.screenshot({path:path.join(out,'04-tablet-info.png')});
 // Republishing the same state must not restart the animation
 const sheetHandle=await tv.$('.rls-sheet');
 await tablet.locator('.rgl-hit--information').tap();await wait(800);
 assert.equal(await sheetHandle.evaluate(n=>n.isConnected),true,'sheet must not remount');
 // Back
 await tablet.locator('.rgl-back').tap();
 await tv.waitForSelector('.rgl-menu--landing .rgl-cta');
 assert.equal(await tablet.locator('.rgl-back').isVisible(),false);
 // Second card → video
 await tablet.locator('.rgl-hit--video').tap();
 await tv.waitForSelector('.reglac-display-video');
 await tv.waitForFunction(()=>{const v=document.querySelector('.reglac-display-video');return v&&v.currentTime>1.5;},null,{timeout:20000});
 const v=await tv.evaluate(()=>{const v=document.querySelector('.reglac-display-video');return {w:v.videoWidth,h:v.videoHeight,dur:Math.round(v.duration),muted:v.muted,t:v.currentTime.toFixed(1),src:decodeURI(v.currentSrc).split('/').pop()};});
 console.log('video',JSON.stringify(v));
 assert.equal(v.w,1920);assert.equal(v.h,1080);
 await tv.screenshot({path:path.join(out,'05-tv-video.png')});
 await tablet.screenshot({path:path.join(out,'06-tablet-video.png')});
 // A reload keeps the video on the tablet state
 await tablet.reload();
 await tablet.waitForSelector('.rgl-menu--tablet .rgl-hit--video');
 assert.equal(await tablet.locator('.rgl-back').isVisible(),true,'reload keeps the current screen');
 assert.equal(await tablet.locator('.rgl-hit--video').getAttribute('aria-pressed'),'true');
 // Layout at several tablet sizes
 for(const size of [{width:1024,height:768},{width:1280,height:800},{width:1366,height:1024},{width:1920,height:1080}]){
  await tablet.setViewportSize(size);await wait(150);
  const layout=await tablet.evaluate(()=>({scrollX:document.documentElement.scrollWidth>innerWidth,scrollY:document.documentElement.scrollHeight>innerHeight}));
  assert.deepEqual(layout,{scrollX:false,scrollY:false});
  const back=await tablet.locator('.rgl-back').boundingBox();
  const start=await tablet.locator('.rgl-hit--home').boundingBox();
  assert.ok(back.x+back.width<=start.x,'Back must not overlap Home');
 }
 await tablet.setViewportSize({width:1180,height:820});
 await tablet.locator('.rgl-back').focus();
 {const b=await tablet.locator('.rgl-back').boundingBox();await tablet.screenshot({path:path.join(out,'07-tablet-back-focus.png'),clip:{x:b.x-200,y:b.y-20,width:b.width+330,height:b.height+40}});}
 // Back from video
 await tablet.locator('.rgl-back').tap();
 await tv.waitForSelector('.rgl-menu--landing .rgl-cta');
 // Old saved packets (game/results) open the video, not the retired game
 await tablet.request.post(`${base}/api/state?station=${station}`,{data:{view:'project',projectId:'06',section:'game',language:'en',mode:'game',screenIndex:null,game:null}});
 await tv.waitForSelector('.reglac-display-video');
 await tablet.request.post(`${base}/api/state?station=${station}`,{data:{view:'project',projectId:'06',section:null,language:'en',mode:'landing',screenIndex:null,game:null}});
 await tv.waitForSelector('.rgl-menu--landing .rgl-cta');
 // Home → projects menu
 await tablet.locator('.rgl-hit--home').tap();
 await tablet.waitForURL(u=>!u.pathname.includes('06-reglac'));
 await wait(800);
 const state=await (await tablet.request.get(`${base}/api/state?station=${station}`)).json();
 console.log('after Home',state.view,state.projectId,tablet.url());
 assert.equal(state.view,'home');
 assert.ok(tablet.url().includes('projects=1'));
 console.log('errors',JSON.stringify(errors));
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log('OK');
})().catch(e=>{console.error(e);process.exit(1);});
