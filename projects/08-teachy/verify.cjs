/* Run with the local server and Playwright available through NODE_PATH. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const output=path.join(__dirname,'verification');
 fs.mkdirSync(output,{recursive:true});
 const tablet=await browser.newPage({viewport:{width:1180,height:820},hasTouch:true});
 const tv=await browser.newPage({viewport:{width:1920,height:1080}});
 const errors=[];
 for(const page of [tablet,tv]){
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('favicon.ico'))errors.push(response.status()+' '+response.url());});
 }
 const base=process.env.BASE_URL||'http://localhost:4173';
 const state=async station=>(await tablet.request.get(base+'/api/state?station='+station)).json();
 const otherStation=await state(1);
 const seed=await tablet.request.post(base+'/api/state?station=9',{data:{view:'project',projectId:'08',mode:'landing',language:'es',section:null,game:null}});
 assert.ok(seed.ok());
 const ready=page=>page.waitForFunction(()=>{const image=document.querySelector('.teachy-tablet-image,.teachy-display-image');return image?.complete&&image.naturalWidth>0;});
 const expectTV=async name=>{
  await tv.waitForFunction(value=>decodeURI(document.querySelector('.teachy-display-image')?.src||'').includes(value),name);
  await ready(tv);
 };
 try{
  await tv.goto(base+'/display.html?station=9');
  await tablet.goto(base+'/projects/08-teachy/index.html?station=9');
  await ready(tablet);
  await expectTV('12_24_11 p.m-1.png');
  await tablet.screenshot({path:path.join(output,'tablet-es.png')});
  const originalImage=await tablet.locator('.teachy-tablet-image').getAttribute('src');
  const originalPixels=await tablet.locator('.teachy-artboard').screenshot();
  await tablet.locator('[data-action="information"]').first().click();
  await expectTV('Infografía Teachy_ IA para escuelas personalizadas.png');
  assert.equal(await tablet.locator('.teachy-tablet-image').getAttribute('src'),originalImage);
  assert.ok(originalPixels.equals(await tablet.locator('.teachy-artboard').screenshot()),'Information must leave the tablet visual unchanged');
  const bounds=await tv.locator('.teachy-display-image').boundingBox();
  assert.deepEqual(bounds,{x:0,y:0,width:1920,height:1080});
  await tv.screenshot({path:path.join(output,'tv-info-es-1920x1080.png')});
  await tablet.locator('[data-language="en"]').click();
  await ready(tablet);
  assert.match(decodeURI(await tablet.locator('.teachy-tablet-image').getAttribute('src')),/12_24_12 p.m-2\.png/);
  await expectTV('IA para una escuela personalizada y eficiente.png');
  await tv.screenshot({path:path.join(output,'tv-info-en-1920x1080.png')});
  await tablet.screenshot({path:path.join(output,'tablet-en.png')});
  await tablet.reload();
  await ready(tablet);
  assert.equal(await tablet.locator('[data-language="en"]').getAttribute('aria-pressed'),'true');
  assert.equal((await state(9)).mode,'info');
  for(const size of [{width:1024,height:768},{width:1280,height:800},{width:1920,height:1080}]){
   await tablet.setViewportSize(size);
   const layout=await tablet.evaluate(()=>({scrollX:document.documentElement.scrollWidth>innerWidth,scrollY:document.documentElement.scrollHeight>innerHeight}));
   assert.deepEqual(layout,{scrollX:false,scrollY:false});
   assert.equal(await tablet.locator('[data-action="information"]').first().isVisible(),true);
  }
  await tablet.setViewportSize({width:1180,height:820});
  await tablet.locator('[data-action="back"]').click();
  await expectTV('12_24_12 p.m-2.png');
  assert.equal(await tablet.locator('[data-action="information"]').first().isVisible(),true);
  const tabletBeforeVideo=await tablet.locator('.teachy-artboard').screenshot();
  await tablet.locator('[data-action="video"]').click();
  await tv.waitForFunction(()=>{const video=document.querySelector('.teachy-display-video');return video&&video.readyState>=2&&!video.paused&&video.currentTime>0;});
  assert.match(decodeURI(await tv.locator('.teachy-display-video').getAttribute('src')),/Video\/muestra-estacion-teachy-BID\.mp4/);
  assert.deepEqual(await tv.locator('.teachy-display-video').boundingBox(),{x:0,y:0,width:1920,height:1080});
  assert.ok(tabletBeforeVideo.equals(await tablet.locator('.teachy-artboard').screenshot()),'Video must leave the tablet visual unchanged');
  assert.equal((await state(9)).mode,'video');
  await tv.screenshot({path:path.join(output,'tv-video-1920x1080.png')});
  await tablet.locator('[data-language="es"]').click();
  await tablet.waitForTimeout(400);
  assert.equal(await tv.locator('.teachy-display-video').count(),1,'Language change must not restart the video');
  await tablet.locator('[data-action="back"]').click();
  await expectTV('12_24_11 p.m-1.png');
  assert.equal(await tv.locator('.teachy-display-video').count(),0);
  await tablet.locator('[data-action="home"]').first().click();
  await tablet.waitForURL('**/index.html?station=9');
  await tv.waitForSelector('.display-app');
  assert.equal(await tablet.locator('[data-project="08"]').count(),1);
  assert.equal(await tablet.locator('[data-project="09"]').count(),0);
  assert.deepEqual(await state(1),otherStation,'Station 08 must not alter station 1');
  assert.equal(fs.existsSync(path.resolve(__dirname,'../09-teachy')),false);
  assert.deepEqual(errors,[]);
  // Leave the requested preview ready on Teachy in Spanish.
  await tablet.locator('[data-project="08"]').click();
  await tablet.waitForSelector('.teachy-tablet-image');
  await tablet.locator('[data-language="es"]').click();
  await tablet.locator('[data-action="information"]').first().click();
  await expectTV('Infografía Teachy_ IA para escuelas personalizadas.png');
  console.log('PASS: exact ES/EN PNGs, unchanged tablet on Information and Video, TV video playback, 1920x1080 TV, reload, 3 landscape sizes, Home, Back, station isolation, and no browser/resource errors.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
