/* Teachy tablet + TV walkthrough. Run with the local server (BASE_URL, default http://127.0.0.1:4173)
   and Playwright available through NODE_PATH. Uses station 9 and ends on the home menu (Start). */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const out=path.join(__dirname,'verification');fs.mkdirSync(out,{recursive:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
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
 await tv.goto(base+'/display.html?station=9');
 await tablet.goto(base+'/projects/08-teachy/index.html?station=9');
 await tablet.waitForFunction(()=>document.querySelector('.teachy-tablet-image')?.complete);
 await tv.waitForSelector('.teachy-display--landing img');
 await wait(600);
 await tablet.screenshot({path:path.join(out,'01-tablet-landing.png')});
 await tv.screenshot({path:path.join(out,'02-tv-landing.png')});
 assert.equal(await tablet.locator('.teachy-back').isVisible(),false);
 // About project
 await tablet.locator('.teachy-hit--info').tap();
 await tv.waitForSelector('.tch-sheet');
 const t0=Date.now();
 for(const at of [2300,7200]){
  await wait(Math.max(0,at-(Date.now()-t0)));
  await tv.screenshot({path:path.join(out,`03-tv-info-${String(at).padStart(4,'0')}.png`)});
 }
 assert.equal(await tablet.locator('.teachy-back').isVisible(),true);
 await tablet.screenshot({path:path.join(out,'04-tablet-info.png')});
 // Republishing the same state must not restart the animation
 const sheetHandle=await tv.$('.tch-sheet');
 await tablet.locator('.teachy-hit--info').tap();await wait(800);
 assert.equal(await sheetHandle.evaluate(n=>n.isConnected),true,'sheet must not remount');
 // Back
 await tablet.locator('.teachy-back').tap();
 await tv.waitForSelector('.teachy-display--landing img');
 assert.equal(await tablet.locator('.teachy-back').isVisible(),false);
 // Video
 await tablet.locator('.teachy-hit--video').tap();
 await tv.waitForSelector('.teachy-display-video');
 await tv.waitForFunction(()=>{const v=document.querySelector('.teachy-display-video');return v&&v.currentTime>1.5;},null,{timeout:20000});
 const v=await tv.evaluate(()=>{const v=document.querySelector('.teachy-display-video');return {w:v.videoWidth,h:v.videoHeight,dur:Math.round(v.duration),muted:v.muted,t:v.currentTime.toFixed(1),src:decodeURI(v.currentSrc).split('/').pop()};});
 console.log('video',JSON.stringify(v));
 await tv.screenshot({path:path.join(out,'05-tv-video.png')});
 await tablet.screenshot({path:path.join(out,'06-tablet-video.png')});
 // Layout at several tablet sizes
 for(const size of [{width:1024,height:768},{width:1280,height:800},{width:1366,height:1024},{width:1920,height:1080}]){
  await tablet.setViewportSize(size);await wait(150);
  const layout=await tablet.evaluate(()=>({scrollX:document.documentElement.scrollWidth>innerWidth,scrollY:document.documentElement.scrollHeight>innerHeight}));
  assert.deepEqual(layout,{scrollX:false,scrollY:false});
  const back=await tablet.locator('.teachy-back').boundingBox();
  const start=await tablet.locator('.teachy-hit--home').boundingBox();
  assert.ok(back.x+back.width<=start.x,'Back must not overlap Start');
 }
 await tablet.setViewportSize({width:1180,height:820});
 await tablet.locator('.teachy-back').focus();
 {const b=await tablet.locator('.teachy-back').boundingBox();await tablet.screenshot({path:path.join(out,'07-tablet-back-focus.png'),clip:{x:b.x-200,y:b.y-20,width:b.width+330,height:b.height+40}});}
 // Back from video
 await tablet.locator('.teachy-back').tap();
 await tv.waitForSelector('.teachy-display--landing img');
 // Start → home menu
 await tablet.locator('.teachy-hit--home').tap();
 await tablet.waitForURL(u=>!u.pathname.includes('08-teachy'));
 await wait(800);
 const state=await (await tablet.request.get(base+'/api/state?station=9')).json();
 console.log('after Start',state.view,state.projectId,tablet.url());
 assert.equal(state.view,'home');
 console.log('errors',JSON.stringify(errors));
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log('OK');
})().catch(e=>{console.error(e);process.exit(1);});
