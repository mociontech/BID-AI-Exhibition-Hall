/* End-to-end Home navigation from every project, with isolated public sync.
   NODE_PATH=<playwright>/node_modules TEST_URL=http://localhost:4199 node tests/verify-home-navigation.cjs */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const base=process.env.TEST_URL||'http://localhost:4199',origin='https://home-navigation.test';
 const registry={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../shared/projects.js'),'utf8'),registry);
 const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'msedge',headless:true});
 const errors=[],checks=[];
 try{
  for(const station of [7,6,1]){
   const room=String(station).padStart(32,'0'),query='?station='+station+'&room='+room;
   let stored={stationId:station,updatedAt:Date.now(),payload:JSON.stringify({view:'home',projectId:null})};
   const controller=await browser.newContext({viewport:{width:station===6?1180:1024,height:station===6?820:768},hasTouch:true});
   const receiver=await browser.newContext({viewport:{width:1920,height:1080}});
   for(const context of [controller,receiver])await context.route('**/*',async route=>{
    const request=route.request(),url=new URL(request.url());
    if(url.hostname==='f1-sap-default-rtdb.firebaseio.com'){
     assert.equal(url.pathname,'/aiExhibitionHall/rooms/'+room+'.json');
     if(request.method()==='PUT')stored={...request.postDataJSON(),updatedAt:Date.now()};
     return route.fulfill({json:stored,headers:{'Access-Control-Allow-Origin':'*'}});
    }
    if(url.hostname==='fonts.googleapis.com')return route.fulfill({body:'',contentType:'text/css'});
    if(url.pathname==='/.netlify/scripts/cdp')return route.fulfill({body:'',contentType:'text/javascript'});
    assert.equal(url.origin,origin);
    try{const response=await route.fetch({url:base+url.pathname+url.search});await route.fulfill({response});}
    catch(error){if(!/closed|disposed|Invalid InterceptionId|intercepted|handled/i.test(error.message))throw error;}
   });
   const tablet=await controller.newPage(),tv=await receiver.newPage();
   for(const page of [tablet,tv])page.on('pageerror',error=>errors.push(error.message));
   await tv.goto(origin+'/display.html'+query);
   for(const project of registry.window.EXHIBITION_PROJECTS){
    await tablet.goto(origin+'/'+project.href+query);
    const home=tablet.locator('[data-action="home"],[data-go-home]').first();
    await home.waitFor({state:'visible'});
    await tv.waitForFunction(()=>!document.querySelector('.display-title')?.textContent.includes('Explore AI in Action'));
    await home.tap();
    await tablet.waitForSelector('.projects-grid');
    assert.equal(new URL(tablet.url()).pathname,'/index.html');
    assert.equal(new URL(tablet.url()).searchParams.get('station'),String(station));
    assert.equal(new URL(tablet.url()).searchParams.get('room'),room);
    assert.equal(await tablet.locator('[data-project]').count(),10);
    await tv.waitForFunction(()=>document.querySelector('.display-title')?.textContent==='Explore AI in Action');
    assert.equal(JSON.parse(stored.payload).view,'home');assert.equal(JSON.parse(stored.payload).projectId,null);
    // Opening another project via the grid must keep the same paired devices.
    const next=registry.window.EXHIBITION_PROJECTS.find(p=>p.id!==project.id);
    const link=tablet.locator('[data-project="'+next.id+'"]');
    assert.equal(new URL(await link.getAttribute('href'),origin).searchParams.get('room'),room);
    checks.push('station '+station+': '+project.id+' -> Home (tablet and TV)');
   }
   await controller.close();await receiver.close();
  }
  assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,journeys:checks.length,checks,errors},null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
