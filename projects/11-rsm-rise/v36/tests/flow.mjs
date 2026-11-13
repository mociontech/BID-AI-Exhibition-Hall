import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium,base,state} from './runtime.mjs';
const out=new URL('../artifacts/flow/',import.meta.url);mkdirSync(out,{recursive:true});
const query='?station=11&room=36363636363636363636363636363636';
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const ctx=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true,colorScheme:'light'});
await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
await ctx.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
const tablet=await ctx.newPage(),tv=await ctx.newPage(),isolated=await ctx.newPage();await tv.setViewportSize({width:1920,height:1080});
const report={source:'RISE v36 live local flow',checks:[],errors:[],tvWrites:0};
for(const page of [tablet,tv,isolated]){
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
}
tv.on('request',r=>{if(r.method()==='POST')report.tvWrites++;});
const frame=()=>tablet.frameLocator('iframe'),read=async()=>(await ctx.request.get(base+'/api/state'+query)).json();
const check=name=>{report.checks.push(name);console.log('PASS',name);};
const scene=async sc=>{
 await tv.waitForFunction(sc=>document.querySelector('iframe')?.contentWindow?.S?.sc===sc,sc);
 assert.equal(await tablet.locator('iframe').evaluate(f=>f.contentWindow.S.sc),sc);
};
const snap=async name=>{
 await tablet.bringToFront();await tablet.screenshot({path:fileURLToPath(new URL('tablet-'+name+'.png',out)),animations:'disabled'});
 await tv.bringToFront();await tv.screenshot({path:fileURLToPath(new URL('tv-'+name+'.png',out)),animations:'disabled'});await tablet.bringToFront();
};
const fit=async()=>{
 for(const [width,height] of [[1024,768],[1180,820],[1366,768]]){
  await tablet.setViewportSize({width,height});await tablet.waitForTimeout(150);
  assert.equal(await tablet.evaluate(()=>document.documentElement.scrollWidth>innerWidth||document.documentElement.scrollHeight>innerHeight),false);
  const panel=await frame().locator('#tab').evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:s.width,height:s.height};});
  assert.equal(panel.width,'736px');assert.equal(panel.height,'552px');
  assert(panel.left>=-1&&panel.top>=-1&&panel.right<=width+1&&panel.bottom<=height+1,'Original pane fits without distortion');
 }
};
try{
 await ctx.request.post(base+'/api/state'+query,{data:{view:'home',projectId:null,game:null}});
 await isolated.goto(base+'/display.html?station=11&room=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
 await tablet.goto(base+'/projects/11-rsm-rise/index.html'+query);await tv.goto(base+'/display.html'+query);
 await frame().locator('[data-ip="1"]').waitFor();await scene('intro');await tablet.waitForTimeout(600);
 assert.equal((await read()).game.version,36);assert.equal((await read()).game.ip,0);
 assert.equal(await tablet.locator('iframe').evaluate(f=>!!f.contentWindow.RISE_INTRO),false,'No v34 opening overlay');
 assert.equal(await tablet.locator('iframe').evaluate(f=>[...f.contentDocument.scripts].some(s=>/client\.js|opening\.js/.test(s.src))),false);
 await snap('notice');
 await frame().locator('[data-ip="1"]').click();
 await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.ip===1);
 const introStamp=(await read()).game.introStartedAt;assert(introStamp>0);
 await tablet.waitForTimeout(1000);await tablet.reload();await tv.reload();
 await frame().locator('[data-ip="2"]').waitFor();assert.equal((await read()).game.introStartedAt,introStamp);
 await frame().locator('.tb.pri[data-go="problem"]').waitFor({timeout:12000});
 await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.ip===2);
 assert.equal((await read()).game.sc,'intro','v36 waits for Start experience after the animation');
 assert.equal(await tv.locator('iframe').evaluate(f=>f.contentDocument.getElementById('opnn').textContent),'8,200');
 await snap('opening');check('v36 notice, Continue, original animation, reload recovery and explicit Start experience');
 for(let deal=0;deal<3;deal++){
  const language=deal===1?'es':'en';await frame().locator(`[data-lang="${language}"]`).click();
  if(deal===1){await frame().locator('[data-ip="1"]').click();await frame().locator('[data-ip="2"]').click();}
  await frame().locator('[data-go="problem"]').click();await scene('problem');
  await frame().locator('[data-go="ficha"]').click();await scene('ficha');
  await frame().locator('[data-go="deal"]').click();await scene('deal');
  assert(await frame().locator('[data-go="read"]').isDisabled());
  assert.equal(await frame().locator('[data-deal]').count(),3);
  await frame().locator(`[data-deal="${deal}"]`).click();
  await tv.waitForFunction(deal=>document.querySelector('iframe')?.contentWindow?.S?.deal===deal,deal);
  assert.deepEqual(await tv.locator('iframe').evaluate(f=>[...f.contentDocument.querySelectorAll('.deal.dim')].map(el=>getComputedStyle(el).opacity)),['0.25','0.25']);
  if(!deal)await snap('proposal');
  await frame().locator('[data-go="read"]').click();await scene('read');
  assert.equal((await read()).game.run,0);await frame().locator('[data-run]').click();await tablet.waitForTimeout(900);
  const readStamp=(await read()).game.readStartedAt;await tablet.reload();await tv.reload();
  await frame().locator('[data-go="decide"]').waitFor();assert.equal((await read()).game.readStartedAt,readStamp);
  await tablet.waitForFunction(()=>document.querySelector('iframe')?.contentDocument?.querySelector('[data-go="decide"]')?.disabled===false);
  await frame().locator('[data-go="decide"]').click();await scene('decide');
  assert.equal(await tv.locator('iframe').evaluate(f=>f.contentDocument.querySelectorAll('.igrid .ri').length),6);
  await fit();await tablet.waitForTimeout(4200);if(!deal)await snap('risk');
  await frame().locator('[data-go="time"]').click();await scene('time');
  assert.equal((await read()).game.tp,0);await frame().locator('[data-tp]').click();
  await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.tp===1);
  if(!deal){const timeStamp=(await read()).game.timeStartedAt;await tv.reload();await tablet.waitForTimeout(7800);await scene('time');assert.equal((await read()).game.timeStartedAt,timeStamp);await snap('years');}
  await frame().locator('[data-go="sup"]').click();await scene('sup');
  assert.equal((await read()).game.sr,0);await tablet.waitForTimeout(500);assert.equal((await read()).game.t,0,'Reports do not run automatically');
  await frame().locator('[data-sup]').click();await tablet.waitForTimeout(700);
  const supStamp=(await read()).game.supStartedAt;
  if(deal===2){await tablet.reload();await tv.reload();}
  await frame().locator('[data-act="0"]').waitFor({timeout:10000});assert.equal((await read()).game.supStartedAt,supStamp);
  assert(await frame().locator('[data-go="loop"]').isDisabled(),'Preserve the v36 insight selection control');
  await frame().locator(`[data-act="${deal}"]`).click();
  await tv.waitForFunction(act=>document.querySelector('iframe')?.contentWindow?.S?.act===act,deal);
  if(!deal)await snap('insight');
  await frame().locator('[data-go="loop"]').click();await scene('loop');
  if(!deal)await snap('memory');
  for(const page of [tablet,tv])assert.deepEqual(await page.locator('iframe').evaluate(f=>Object.keys(f.contentWindow.__i18nMiss||{})),[]);
  await tablet.reload();await frame().locator('[data-reset]').waitFor();await frame().locator('[data-reset]').click();await scene('intro');
  check(`Case ${deal+1}: ${language}, original proposal/read/risk, manual Play/Next/reports, insight ${deal+1}, memory, reload and replay`);
 }
 assert.equal(await isolated.locator('[data-rise-device]').count(),0);
 await frame().locator('[data-go="problem"]').click();await frame().locator('[data-home]').click();
 await tablet.locator('[data-project="11"]').waitFor();assert.equal(new URL(tablet.url()).searchParams.get('room'),new URLSearchParams(query).get('room'));
 assert.equal((await read()).view,'home');assert.equal(report.tvWrites,0);
 const rejected=await ctx.request.post(base+'/api/state'+query,{data:{view:'game',projectId:'11',mode:'game',game:{...state.fresh(),version:3}}});assert.equal(rejected.status(),400);
 check('Home/Back to Projects, room isolation, read-only TV, stale-version rejection, no JavaScript or translation errors');
 assert.deepEqual(report.errors,[]);
}finally{writeFileSync(new URL('report.json',out),JSON.stringify(report,null,2));await browser.close();}
