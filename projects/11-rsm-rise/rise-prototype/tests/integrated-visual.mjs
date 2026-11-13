import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const require=createRequire(import.meta.url),state=require('../../state.js');
let pw;
for(const candidate of [process.env.PLAYWRIGHT_MODULE,'playwright','playwright-core',path.join(homedir(),'AppData/Local/Programs/Python/Python310/lib/site-packages/playwright/driver/package')].filter(Boolean)){
 try{pw=require(candidate);break;}catch{}
}
assert(pw,'Set PLAYWRIGHT_MODULE to an installed Playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4191',prefix='/projects/11-rsm-rise/';
const out=new URL('../artifacts/client-review/',import.meta.url);mkdirSync(out,{recursive:true});
const report={revision:'Approved client simulation notice, responsive tablet and historical insights',screenshots:[],errors:[],missing:[]};
const browser=await pw.chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const context=await browser.newContext({deviceScaleFactor:1,colorScheme:'light'});
await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
await context.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
const page=await context.newPage();
page.on('pageerror',e=>report.errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
await page.clock.install({time:new Date('2026-11-12T12:00:00Z')});
await page.clock.pauseAt(new Date('2026-11-12T12:00:01Z'));
const fixtures=[
 ['intro',{}],['problem',{sc:'problem'}],['solution',{sc:'ficha'}],['proposals',{sc:'deal'}],
 ...[0,1,2].map(deal=>['proposal-'+deal,{sc:'deal',deal}]),
 ['read',{sc:'read',deal:0}],['read-ready',{sc:'read',deal:0,p:1,run:2}],
 ['risk',{sc:'decide',deal:0,p:1,run:2}],['time',{sc:'time',deal:0,p:1,run:2}],
 ...[0,1,2].map(deal=>['insight-'+deal,{sc:'sup',deal,p:1,run:2,t:1}]),
 ['loop',{sc:'loop',deal:0,p:1,run:2,t:1}]
];
try{
 let n=0;
 for(const lang of ['en','es'])for(const [role,width,height] of [['tablet',1024,768],['tablet',1180,820],['tablet',1366,768],['tv',1920,1080]]){
  await page.setViewportSize({width,height});
  for(const [scene,partial] of fixtures){
   const room=(++n).toString(16).padStart(32,'0'),query='?station=11&room='+room;
   const game={...state.fresh(),...partial};
   const response=await context.request.post(base+'/api/state'+query,{data:{view:'game',projectId:'11',mode:game.sc==='loop'?'results':'game',language:lang,section:game.sc,screenIndex:state.stages.indexOf(game.sc)+1,game}});assert(response.ok());
   await page.goto(base+(role==='tablet'?prefix+'index.html':'/display.html')+query);
   await page.waitForFunction(({scene,lang})=>{const w=document.querySelector('iframe')?.contentWindow;return w?.S?.sc===scene&&w.document.documentElement.lang===lang;},{scene:game.sc,lang});
   const frame=page.frameLocator('iframe');
   const geometry=await page.locator('iframe').evaluate((f,role)=>{
    const doc=f.contentDocument,id=role==='tablet'?'tab':'tv',panel=doc.getElementById(id),r=panel.getBoundingClientRect();
    const outside=[...panel.querySelectorAll('.tband,.tbody,.thead,.tfoot,.dealbtn,.thint .ill,.rise-entry-notice,.rise-no-decision')].filter(el=>{
     const x=el.getBoundingClientRect();return x.width&&x.height&&(x.left<r.left-1||x.top<r.top-1||x.right>r.right+1||x.bottom>r.bottom+1);
    }).map(el=>el.className);
    const body=panel.querySelector('.tbody');
    const smallTargets=[...panel.querySelectorAll('button')].filter(el=>{const b=el.getBoundingClientRect();return b.width&&b.height&&(b.width<44||b.height<44);}).map(el=>el.textContent);
    return {width:r.width,height:r.height,left:r.left,top:r.top,outside,smallTargets,overflow:body?body.scrollHeight>body.clientHeight+1:false,missing:Object.keys(f.contentWindow.__i18nMiss||{})};
   },role);
   assert.equal(geometry.width,width,`${role} must fill width ${width}`);
   assert.equal(geometry.height,height,`${role} must fill height ${height}`);
   assert.equal(geometry.left,0,'No side bands');assert.equal(geometry.top,0);
   assert.deepEqual(geometry.outside,[],`${role}/${width}/${lang}/${scene}: clipped controls`);
   assert.deepEqual(geometry.smallTargets,[],`${role}/${width}/${lang}/${scene}: touch targets smaller than 44px`);
   assert.equal(geometry.overflow,false,`${role}/${width}/${lang}/${scene}: body overflow`);
   if(geometry.missing.length)report.missing.push({role,width,lang,scene,keys:geometry.missing});
   if(scene==='intro'){
    const title=await frame.locator(role==='tablet'?'.thead h3':'.rise-entry-notice h1').innerText();
    assert.match(title,lang==='en'?/simplified simulated experience/:/simplificada y simulada/);
    const text=await frame.locator('#'+(role==='tablet'?'tab':'tv')).innerText();
    assert.match(text,lang==='en'?/actual operational processes/:/procesos operativos reales/);
    assert.match(text,lang==='en'?/Clients, deals and data are fictional/:/clientes, las operaciones y los datos son ficticios/);
   }
   if(game.sc==='sup'){
    assert.equal(await frame.locator('[data-act]').count(),0);
    assert.equal(game.act,null);
    if(role==='tablet')assert(await frame.locator('[data-go="loop"]').isEnabled(),'May continue without a decision');
    const text=await frame.locator('#'+(role==='tablet'?'tab':'tv')).innerText();
    assert.match(text,lang==='en'?/No decision is required/:/No es necesario tomar una decisión/);
    assert(!/What is your next step|Your decision|¿Cuál es tu próximo paso/.test(text));
   }
   if(game.sc==='loop')assert.equal(await frame.locator('.sum .srow:last-child>span').textContent(),lang==='en'?'Historical insight':'Insight histórico');
   await page.locator('iframe').evaluate(f=>f.contentDocument.getAnimations().forEach(a=>{try{a.finish();}catch{a.pause();}}));
   const filename=`${lang}-${role}-${width}x${height}-${scene}.png`;
   await page.screenshot({path:fileURLToPath(new URL(filename,out)),animations:'disabled'});
   report.screenshots.push({lang,role,width,height,scene,filename});
   if(lang==='en'&&role==='tv'&&['risk','insight-0'].includes(scene)){
    await page.clock.runFor(8500);
    assert.equal(await frame.locator('.ptoast').count(),scene==='risk'?1:0,scene==='risk'?'Risk .keep toast remains':'Historical insight toast expires after 8.3 seconds');
   }
  }
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
 console.log(`PASS: ${report.screenshots.length} approved-revision captures; actual tablet viewports, Full HD TV, EN/ES, all scenes, no mandatory action, no overflow or browser errors.`);
}finally{
 writeFileSync(new URL('report.json',out),JSON.stringify(report,null,2));await browser.close();
}
