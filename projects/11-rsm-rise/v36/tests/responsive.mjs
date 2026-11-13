import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium,base as localBase,state} from './runtime.mjs';
const base=process.env.HOSTED_URL||localBase;
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const ctx=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true});
const out=new URL('../artifacts/responsive/',import.meta.url);mkdirSync(out,{recursive:true});
const errors=[];let fixture;
await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
await ctx.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
await ctx.route('**/api/state?**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({...fixture,serverNow:Date.now()})}));
await ctx.route('https://f1-sap-default-rtdb.firebaseio.com/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({payload:JSON.stringify(fixture)}),headers:{'access-control-allow-origin':'*'}}));
const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
await page.clock.install();
const check=async(width,height)=>{
 const rects=await page.locator('[data-rise-device]').evaluate(f=>{
  const doc=f.contentDocument,rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};};
  return {pane:rect(doc.getElementById('tab')),buttons:[...doc.querySelectorAll('.tfoot button,.home,[data-lang]')].map(rect),scroll:doc.documentElement.scrollWidth>f.contentWindow.innerWidth||doc.documentElement.scrollHeight>f.contentWindow.innerHeight};
 });
 const {pane}=rects;assert(Math.abs(pane.left)<1&&Math.abs(pane.top)<1&&Math.abs(pane.right-width)<1&&Math.abs(pane.bottom-height)<1,JSON.stringify({width,height,...rects}));
 assert.equal(rects.scroll,false);
 for(const r of rects.buttons){assert(r.left>=-1&&r.right<=width+1&&r.top>=-1&&r.bottom<=height+1,'Visible controls fit the screen');assert(r.bottom>r.top,'Control has a usable hit area');}
};
try{
 for(const language of ['en','es'])for(const [width,height] of [[1024,768],[1180,820],[1366,768],[1920,1080],[768,1024]]){
  await page.setViewportSize({width,height});
  for(const sc of state.stages){
   const game={...state.fresh(),sc,ip:2,deal:1,run:2,p:1,t:1,sr:1,tp:1,act:2};
   fixture={stationId:11,view:'game',projectId:'11',mode:sc==='loop'?'results':'game',language,game};
   await page.goto(base+'/projects/11-rsm-rise/index.html?station=11&room=45454545454545454545454545454545');
   await page.waitForFunction(({sc,language})=>{const w=document.querySelector('[data-rise-device]')?.contentWindow;return w?.S?.sc===sc&&w.document.documentElement.lang===language;},{sc,language});
   await check(width,height);
   if(['deal','decide','sup'].includes(sc)){
    await page.clock.fastForward(120000);
    assert.deepEqual(await page.locator('[data-rise-device]').evaluate(f=>[f.contentWindow.S.sc,f.contentWindow.S.deal,f.contentWindow.S.act]),[sc,1,2],'Two inactive minutes preserve the current scene and selections');
   }
   assert.deepEqual(await page.locator('[data-rise-device]').evaluate(f=>Object.keys(f.contentWindow.__i18nMiss||{})),[]);
   if(language==='en'&&sc==='deal')await page.screenshot({path:fileURLToPath(new URL(`tablet-${width}x${height}.png`,out)),animations:'disabled'});
  }
  console.log('PASS',language,`${width}x${height}`, 'all nine scenes fill the screen, reachable controls and no idle reset');
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
