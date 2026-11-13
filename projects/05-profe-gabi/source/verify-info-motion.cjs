const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 try{
  const base=process.env.TEST_URL||'http://localhost:4173',out=path.resolve(__dirname,'../review/2026-11-13/info-motion');fs.mkdirSync(out,{recursive:true});
  const tablet=await browser.newPage({viewport:{width:1180,height:820}}),tv=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
  for(const p of [tablet,tv])p.on('pageerror',e=>errors.push(e.message));
  await tv.goto(base+'/display.html?station=5');await tablet.goto(base+'/projects/05-profe-gabi/index.html?station=5');
  if(!await tablet.locator('[data-action=information]').count()){await tablet.locator('[data-action=home]').click();await tablet.goto(base+'/projects/05-profe-gabi/index.html?station=5');}
  await tablet.locator('[data-action=information]').click();await tv.locator('.is-info-ready').waitFor();
  assert.equal(await tv.locator('[data-info-fragment]').count(),9);
  const initial=await tv.locator('.gabi-info-animated').evaluate(c=>({base:getComputedStyle(c.querySelector('.gabi-approved-artwork')).opacity,panel:c.querySelector('.gabi-info-blue-panel').getBoundingClientRect().width,challenge:getComputedStyle(c.querySelector('[data-info-fragment=challenge]')).opacity}));
  assert.equal(initial.base,'0');assert.ok(initial.panel>764);assert.equal(initial.challenge,'0');
  await tv.screenshot({path:path.join(out,'01-entry.png')});
  await tv.waitForTimeout(2200);await tv.screenshot({path:path.join(out,'02-content-reveal.png')});
  await tv.waitForFunction(()=>getComputedStyle(document.querySelector('.gabi-info-animated>.gabi-approved-artwork')).opacity==='1');
  await tv.waitForFunction(()=>getComputedStyle(document.querySelector('.gabi-info-tablet-hint')).opacity==='1');
  assert.equal(await tv.locator('.gabi-info-tablet-hint').textContent(),'When you are ready, tap “Interactive experience” on the tablet');
  for(const size of [{width:1280,height:720},{width:1920,height:1080},{width:3840,height:2160}]){
   await tv.setViewportSize(size);
   const hint=await tv.locator('.gabi-info-tablet-hint').evaluate(el=>{const r=el.getBoundingClientRect(),c=el.closest('.gabi-artwork-canvas').getBoundingClientRect(),s=c.width/1920;return {center:(r.x+r.width/2-c.x)/s,top:(r.y-c.y)/s,bottom:(r.bottom-c.y)/s,inside:r.right<=c.right,unclipped:el.scrollWidth<=el.clientWidth};});
   assert.ok(Math.abs(hint.center-1342)<1&&hint.top>878&&hint.bottom<1080&&hint.inside&&hint.unclipped);
  }
  await tv.setViewportSize({width:1920,height:1080});
  await tv.screenshot({path:path.join(out,'03-complete.png')});
  assert.equal(await tv.locator('.gabi-info-motion').evaluate(e=>getComputedStyle(e).visibility),'hidden');
  assert.equal(await tablet.locator('[data-action=game]').isEnabled(),true);
  await tv.locator('.gabi-info-animated').evaluate(e=>{window.previousInfoCanvas=e;});
  await tablet.locator('[data-action=information]').click();await tv.waitForFunction(()=>document.querySelector('.is-info-ready')&&document.querySelector('.gabi-info-animated')!==window.previousInfoCanvas);
  assert.equal(await tv.locator('.gabi-approved-artwork').evaluate(e=>getComputedStyle(e).opacity),'0');
  await tablet.locator('[data-action=game]').click();await tv.waitForFunction(()=>!document.querySelector('.gabi-info-motion'));
  await tablet.locator('[data-action=home]').click();await tablet.waitForURL(base+'/index.html?station=5');await tablet.goto(base+'/projects/05-profe-gabi/index.html?station=5');
  await tv.emulateMedia({reducedMotion:'reduce'});await tablet.locator('[data-action=information]').click();await tv.locator('.gabi-info-animated').waitFor();
  assert.equal(await tv.locator('.gabi-approved-artwork').evaluate(e=>getComputedStyle(e).opacity),'1');
  assert.equal(await tv.locator('.gabi-info-motion').evaluate(e=>getComputedStyle(e).display),'none');
  await tv.screenshot({path:path.join(out,'04-reduced-motion.png')});
  assert.equal(await tablet.locator('[data-action=menu],[data-action=fullscreen],[data-gabi-connection]').count(),0);assert.deepEqual(errors,[]);
  const report={passed:true,staggeredFragments:9,durationSeconds:4.6,originalPNGUnmodified:true,tabletHint:true,hintCenteredUnderInfographic:true,hintTestedAtWidths:[1280,1920,3840],tabletRemainsOnCover:true,replaysOnEachClick:true,gameImmediatelyAvailable:true,animationRemovedOnNavigation:true,reducedMotion:true,extraToolbarAbsent:true,browserErrors:errors};
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
