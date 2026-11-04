/* Regression checks with isolated Firebase responses; no live sessions are used.
   TEST_URL=http://localhost:4199 NODE_PATH=<qa>/node_modules node verify-navigation.cjs */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const S=require('./state.js');
(async()=>{
 const base=process.env.TEST_URL||'http://localhost:4199',origin='https://maiia-navigation.test';
 const room='0123456789abcdef0123456789abcdef',query='?station=7&room='+room;
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 let hold=false,fail=false;
 const releases=[],errors=[],writes=[];
 let stored={stationId:7,updatedAt:Date.now(),payload:JSON.stringify({view:'game',projectId:'07',mode:'game',section:'manual',language:'en',game:{...S.fresh(),phase:'manual',easyScore:0}})};
 try{
  const tabletContext=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true});
  const tvContext=await browser.newContext({viewport:{width:1920,height:1080}});
  for(const context of [tabletContext,tvContext])await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(url.hostname==='f1-sap-default-rtdb.firebaseio.com'){
    assert.equal(url.pathname,'/aiExhibitionHall/rooms/'+room+'.json');
    if(request.method()==='PUT'){
     const body=request.postDataJSON(),packet=JSON.parse(body.payload);
     if(fail)return route.fulfill({status:503,json:{error:'Simulated outage'}});
     stored={...body,updatedAt:Date.now()};writes.push(packet);
     // The write is delivered to the TV, but its acknowledgement is delayed.
     if(hold&&packet.projectId==='07')await new Promise(resolve=>releases.push(resolve));
    }
    try{return await route.fulfill({json:stored,headers:{'Access-Control-Allow-Origin':'*'}});}catch(error){
     // A native Home navigation intentionally abandons the old document's request.
     if(!/closed|disposed|Invalid InterceptionId|intercepted|handled/i.test(error.message))throw error;
     return;
    }
   }
   if(url.hostname==='fonts.googleapis.com')return route.fulfill({body:'',contentType:'text/css'});
   // The preview toolbar belongs to Netlify and can cover the product's footer.
   if(url.pathname==='/.netlify/scripts/cdp')return route.fulfill({body:'',contentType:'text/javascript'});
   assert.equal(url.origin,origin);
   try{const response=await route.fetch({url:base+url.pathname+url.search});return await route.fulfill({response});}
   catch(error){if(!/closed|disposed|Invalid InterceptionId|intercepted|handled/i.test(error.message))throw error;}
  });
  const tablet=await tabletContext.newPage(),tv=await tvContext.newPage();
  for(const page of [tablet,tv])page.on('pageerror',error=>errors.push(error.message));
  await tv.goto(origin+'/display.html'+query);
  await tablet.goto(origin+'/projects/07-csd-maiia/index.html'+query);
  await tablet.waitForSelector('.mai-phase-manual');await tv.waitForSelector('.mai-phase-manual');
  await tablet.waitForTimeout(150);
  hold=true;
  const map=await tablet.locator('[data-map]').boundingBox();
  await tablet.touchscreen.tap(map.x+map.width*.2,map.y+map.height*.2);
  await tablet.touchscreen.tap(map.x+map.width*.5,map.y+map.height*.3);
  await tv.waitForFunction(()=>document.querySelectorAll('.mai-marker').length===1);
  assert.equal(await tablet.locator('.mai-marker').count(),2);
  assert.equal(await tablet.locator('.mai-network').count(),0);
  const home=tablet.locator('.mai-footer [data-action="home"]');
  assert.equal(await home.evaluate(node=>node.tagName),'A');
  const homeURL=new URL(await home.getAttribute('href'),origin);
  assert.equal(homeURL.searchParams.get('room'),room);assert.equal(homeURL.searchParams.get('station'),'7');assert.equal(homeURL.searchParams.get('projects'),'1');
  await tablet.locator('.mai-footer [data-action="menu"]').tap();
  await tablet.waitForSelector('.mai-landing',{timeout:1500});
  await tablet.locator('.mai-footer [data-action="home"]').tap();
  await tablet.waitForSelector('[data-project="07"]',{timeout:3000});
  assert.equal(releases.length,1,'Home and Back must work while the previous write remains unacknowledged');
  assert.equal(new URL(tablet.url()).searchParams.get('room'),room);
  await tv.waitForFunction(()=>!document.querySelector('.mai-app'));
  assert.equal(JSON.parse(stored.payload).view,'home');
  hold=false;for(const release of releases)release();
  await tablet.locator('[data-project="07"]').tap();await tablet.waitForSelector('.mai-landing');
  await tablet.locator('[data-action="information"]').tap();await tv.waitForSelector('.mai-infographic');
  await tablet.locator('.mai-footer [data-action="menu"]').tap();await tv.waitForSelector('.mai-phase-landing');
  assert.equal(JSON.parse(stored.payload).mode,'landing');
  fail=true;
  await tablet.locator('[data-action="game"]').tap();await tablet.waitForSelector('.mai-phase-intro');
  await tablet.locator('.mai-footer [data-action="menu"]').tap();await tablet.waitForSelector('.mai-landing');
  assert.equal(await tablet.locator('.mai-network').count(),0);
  await tablet.locator('.mai-footer [data-action="home"]').tap();await tablet.waitForSelector('[data-project="07"]',{timeout:3000});
  assert.equal(new URL(tablet.url()).searchParams.get('station'),'7');assert.equal(new URL(tablet.url()).searchParams.get('room'),room);
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({passed:true,checks:['TV still receives writes while acknowledgements are delayed','no misleading sync banner','Back to menu works with a pending write and from Information','Home uses a native link without waiting for queued writes','Home reaches the project grid and updates the TV','station and private room survive navigation','Home and Back remain usable during a write outage'],errors},null,2));
 }finally{for(const release of releases)release();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
