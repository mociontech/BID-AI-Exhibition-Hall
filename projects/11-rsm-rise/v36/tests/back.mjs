import assert from 'node:assert/strict';
import {chromium,base,state} from './runtime.mjs';
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const ctx=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true});
await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
await ctx.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
const tablet=await ctx.newPage(),tv=await ctx.newPage(),errors=[];
await tv.setViewportSize({width:1920,height:1080});
let tvWrites=0;
tv.on('request',r=>{if(r.method()==='POST')tvWrites++;});
for(const page of [tablet,tv]){
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
}
const query='?station=11&room=37373737373737373737373737373737';
const cases=[['intro',2,'intro',0],['intro',1,'intro',0],['problem',2,'intro',2],['ficha',2,'problem',2],['deal',2,'ficha',2],['read',2,'deal',2],['decide',2,'read',2],['time',2,'decide',2],['sup',2,'decide',2],['loop',2,'sup',2]];
try{
 for(const language of ['en','es']){
  for(const [sc,ip,target,targetIp] of cases){
   const game={...state.fresh(),sc,ip,deal:1,act:2,run:2,p:1,t:1,sr:1};
   await ctx.request.post(base+'/api/state'+query,{data:{projectId:'11',view:'game',mode:sc==='loop'?'results':'game',section:sc,language,game}});
   await tablet.goto(base+'/projects/11-rsm-rise/index.html'+query);
   await tv.goto(base+'/display.html'+query);
   const back=tablet.frameLocator('iframe').getByRole('button',{name:language==='es'?'Atrás':'Back',exact:true});
   await back.waitFor();assert.equal(await back.count(),1);
   await back.click();
   for(const page of [tablet,tv]){
    await page.waitForFunction(({target,targetIp})=>{const w=document.querySelector('iframe')?.contentWindow;return w?.S?.sc===target&&w.S.ip===targetIp;},{target,targetIp});
    assert.deepEqual(await page.locator('iframe').evaluate(f=>Object.keys(f.contentWindow.__i18nMiss||{})),[]);
    if(targetIp!==0){
     assert.deepEqual(await page.locator('iframe').evaluate(f=>[f.contentWindow.S.deal,f.contentWindow.S.act]),[1,2]);
    }
   }
   if(sc==='intro'&&ip===2){
    await tablet.frameLocator('iframe').locator('[data-ip="1"]').click();
    await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.ip===1);
    await tablet.frameLocator('iframe').locator('[data-ip="2"]').click();
    await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.ip===2);
   }
   console.log('PASS',language,sc,ip,'->',target,targetIp);
  }
 }
 await ctx.request.post(base+'/api/state'+query,{data:{projectId:'11',view:'game',mode:'game',language:'en',game:state.fresh()}});
 await tablet.goto(base+'/projects/11-rsm-rise/index.html'+query);
 await tablet.frameLocator('iframe').getByRole('button',{name:'Back',exact:true}).click();
 await tablet.waitForURL('**/index.html?**projects=1');
 assert.equal((await (await ctx.request.get(base+'/api/state'+query)).json()).view,'home');
 assert.equal(tvWrites,0);assert.deepEqual(errors,[]);
 console.log('PASS initial Back returns to projects; no TV writes or page errors');
}finally{await browser.close();}
