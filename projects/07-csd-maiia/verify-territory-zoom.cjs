/* Paired camera transition, stable pointer coordinates and reduced motion. */
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const S=require('./state.js'),C=require('./data/demo-maps.json');
(async()=>{
 const base=process.env.TEST_URL||'http://localhost:4199',browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1024,height:768}});
  const tablet=await context.newPage(),tv=await context.newPage(),errors=[];
  for(const page of [tablet,tv])page.on('pageerror',e=>errors.push(e.message));
  const game={...S.fresh(),phase:'easyResult',polygons:C.easy.reference.map(z=>S.simplifyStroke(z.points,C.scoring.maxPoints)),easyScore:100};
  const seeded=await context.request.post(base+'/api/state?station=11',{data:{view:'game',projectId:'07',mode:'game',language:'en',game}});assert.equal(seeded.status(),200);
  await tv.goto(base+'/display.html?station=11');await tablet.goto(base+'/projects/07-csd-maiia/index.html?station=11');
  await tablet.waitForSelector('.mai-phase-easyResult');await tv.waitForSelector('.mai-phase-easyResult');
  await tablet.locator('[data-action=next]').click();
  for(const p of [tablet,tv])await p.waitForSelector('.mai-territory-zoom');
  const width=p=>p.locator('.mai-map').evaluate(n=>n.viewBox.baseVal.width);
  const initial=await width(tablet);assert.ok(initial>=C.easy.territoryCrop[2]*1000&&initial<950);
  await tablet.bringToFront();await tablet.waitForTimeout(250);assert.ok(await width(tablet)>initial);
  const before=await width(tablet);
  const expected=await tablet.locator('[data-map]').evaluate(svg=>{
   const b=svg.getBoundingClientRect(),clientX=b.x+b.width*.55,clientY=b.y+b.height*.5;
   const p=new DOMPoint(clientX,clientY).matrixTransform(svg.getScreenCTM().inverse());
   svg.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX,clientY,button:0,isPrimary:true,pointerId:1}));
   return [p.x/1000,p.y/562.5];
  });
  const marker=await tablet.locator('.mai-marker').getAttribute('transform');
  const xy=marker.match(/[\d.]+/g).map(Number);assert.ok(Math.abs(xy[0]/1000-expected[0])<.00002&&Math.abs(xy[1]/562.5-expected[1])<.00002);
  assert.ok(await width(tablet)>=before,'marker render must not restart the camera');
  const snapshot=await(await context.request.get(base+'/api/state?station=11')).json();assert.ok(snapshot.game.territoryAt>0);
  await tv.reload();await tv.waitForSelector('.mai-phase-manual');assert.ok(await width(tv)>before,'late receiver resumes instead of restarting');
  for(const p of [tablet,tv]){await p.waitForFunction(()=>!document.querySelector('.mai-territory-zoom'));assert.equal(await width(p),1000);assert.equal(await p.locator('.mai-reference,.mai-candidate').count(),0);}
  await tablet.reload();await tablet.waitForSelector('.mai-phase-manual');assert.equal(await width(tablet),1000);assert.equal(await tablet.locator('.mai-territory-zoom').count(),0);
  await tv.emulateMedia({reducedMotion:'reduce'});
  await tv.evaluate(()=>MAIIA.renderInto(document.getElementById('app'),{mode:'game',language:'en',game:{...MAIIA_STATE.fresh(),phase:'manual',easyScore:0,territoryAt:AI_SYNC.now()}},{readonly:true}));
  assert.equal(await width(tv),1000);assert.equal(await tv.locator('.mai-territory-zoom').count(),0);
  await tv.emulateMedia({reducedMotion:'no-preference'});await tv.bringToFront();
  // Keep receiver polling on the same delayed snapshot. An unrelated live
  // server timestamp would replace this synthetic camera mid-assertion.
  const delayedState={projectId:'07',view:'game',mode:'game',language:'en',game:{...S.fresh(),phase:'manual',easyScore:0,territoryAt:Date.now()-5000}};
  await tv.route('**/api/state?*',route=>route.fulfill({json:{...delayedState,serverNow:Date.now()}}));
  const delayed=await tv.evaluate(state=>{
   const mount=document.getElementById('app'),game={...MAIIA_STATE.fresh(),phase:'easyResult',easyScore:0};
   MAIIA.renderInto(mount,{mode:'game',game},{readonly:true});
   MAIIA.renderInto(mount,state,{readonly:true});
   return {state,width:mount.querySelector('.mai-map').viewBox.baseVal.width};
  },delayedState);
  assert.ok(delayed.width<500,'a delayed TV update must start the complete zoom, even after the tablet finished');
  await tv.waitForTimeout(300);const delayedProgress=await width(tv);assert.ok(delayedProgress>delayed.width&&delayedProgress<1000,JSON.stringify({initial:delayed.width,delayedProgress,animated:await tv.locator('.mai-territory-zoom').count()}));
  await tv.evaluate(s=>MAIIA.renderInto(document.getElementById('app'),s,{readonly:true}),delayed.state);
  assert.ok(await width(tv)>=delayedProgress,'TV snapshot updates must preserve local playback progress');
  await tv.waitForFunction(()=>!document.querySelector('.mai-territory-zoom'));assert.equal(await width(tv),1000);
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,checks:['both views zoom out from the close-up crop','camera progresses without resetting on marker input','pointer coordinates track the moving camera','late TV resumes the shared transition','exact full territory and no pre-AI answers','completed transition does not replay on reload','reduced motion skips animation','TV shows the full zoom after a delayed state update without restarting on redraw'],errors},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
