const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.COUNTRY_URL||'http://localhost:4187';
const source=fs.readFileSync(path.join(__dirname,'../v51/source.html'),'utf8');
(async()=>{
 const b=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const original=await b.newPage({viewport:{width:1920,height:1080}});
 const tablet=await b.newPage({viewport:{width:1024,height:768}});
 const errors=[],overflow=[];let compared=0;
 for(const p of [original,tablet])p.on('pageerror',e=>errors.push(e.message));
 try{
  // Give the unchanged original renderer a test-only state setter for parity checks.
  await original.route('**/v51/source.html',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:source.replace('  reset();\n  i18nApply();','  window.qaRender=function(s,l){clearInterval(runT);clearTimeout(runT);S=s;I18N_LANG=l;render();i18nApply();};\n  reset();\n  i18nApply();')}));
  await original.goto(base+'/projects/10-vpc-country-intelligence/v51/source.html');
  await tablet.route('**/qa-v51',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:'<html><body style="margin:0"><iframe style="width:100vw;height:100vh;border:0" src="/projects/10-vpc-country-intelligence/v51/device.html?role=tablet"></iframe></body></html>'}));
  await tablet.goto(base+'/qa-v51');
  await tablet.waitForFunction(()=>document.querySelector('iframe').contentDocument.readyState==='complete');
  const frame=tablet.frames()[1];
  for(const [width,height] of [[1024,768],[1180,820]]){
   await tablet.setViewportSize({width,height});
   for(const language of ['en','es'])for(const sc of ['intro','problem','cty','ficha','dsg','sig','m0','ptr','m1','m2','loop']){
    const now=Date.now(),s={sc,cc:'MX',con:[0,1,2,3,4,5,6,7],last:7,ph:{0:'done',1:'done',2:'done'},pk:{0:0,1:4,2:2},p:{0:1,1:1,2:1},phaseAt:{},sceneAt:now,at:now,language};
    await original.evaluate(s=>window.qaRender(s,'en'),s);
    await tablet.evaluate(s=>new Promise(resolve=>{const f=document.querySelector('iframe');function done(e){if(e.source===f.contentWindow&&e.data?.action==='state'){removeEventListener('message',done);resolve();}}addEventListener('message',done);f.contentWindow.postMessage({type:'country-v51-init',snapshot:s,now:Date.now()},location.origin);}),s);
    const getText=()=>['tv','tab'].map(id=>{const copy=document.getElementById(id).cloneNode(true);copy.querySelectorAll('.tband,.ci-device-nav').forEach(e=>e.remove());return copy.textContent.replace(/\s+/g,' ').trim();});
    assert.deepEqual(await frame.evaluate(getText),await original.evaluate(getText),`Original English text parity with stored ${language}: ${sc}, ${width}`);
    assert.equal(await frame.locator('[data-lang],.lang').count(),0);
    const issues=await frame.evaluate(()=>[...document.querySelectorAll('#tab .tband,#tab .tbody,#tab .tfoot')].filter(e=>e.scrollWidth>e.clientWidth+2||e.scrollHeight>e.clientHeight+2).map(e=>({area:e.className,w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight})));
    issues.forEach(issue=>overflow.push({sc,language,width,...issue}));compared++;
   }
  }
  // Local font files must load without relying on Google Fonts at runtime.
  await frame.evaluate(()=>document.fonts.ready);
  assert(await frame.evaluate(()=>document.fonts.check('400 16px Inter')));
  assert.deepEqual(errors,[]);assert.deepEqual(overflow,[]);
  const report={originalTextComparisons:compared,landscapeWidths:[1024,1180],languages:['en'],restoredLanguageCases:['en','es'],localInterLoaded:true,overflow,errors};
  fs.writeFileSync(path.join(__dirname,'v51-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
