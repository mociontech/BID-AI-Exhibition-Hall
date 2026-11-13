import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium} from './runtime.mjs';
const live=process.env.RISE_LIVE==='1';
const base=process.env.HOSTED_URL||'https://bidaiinaction.netlify.app';
const out=new URL(`../artifacts/session-${live?'live':'mock'}/`,import.meta.url);mkdirSync(out,{recursive:true});
const report={base,transport:live?'real Firebase':'mock Firebase',checks:[],errors:[],tvWrites:0};
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const stored=new Map();
const create=async(viewport)=>{
 const context=await browser.newContext({viewport,hasTouch:true});
 await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await context.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
 if(!live)await context.route('https://f1-sap-default-rtdb.firebaseio.com/**',async route=>{
  const key=new URL(route.request().url()).pathname;
  if(route.request().method()==='PUT')stored.set(key,route.request().postDataJSON());
  await route.fulfill({contentType:'application/json',body:JSON.stringify(stored.get(key)||null),headers:{'access-control-allow-origin':'*'}});
 });
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)report.errors.push(r.status()+' '+r.url());});
 return page;
};
const check=name=>{report.checks.push(name);console.log('PASS',name);};
try{
 const tablet=await create({width:1024,height:768}),tv=await create({width:1920,height:1080}),otherTV=await create({width:1920,height:1080});
 for(const page of [tv,otherTV])page.on('request',r=>{if(['PUT','POST','PATCH','DELETE'].includes(r.method())&&r.url().includes('firebaseio.com'))report.tvWrites++;});
 await tablet.goto(base+'/sesiones.html');
 const pair=tablet.locator('.session').first();
 const tabletURL=await pair.getByRole('link',{name:'Abrir tableta',exact:true}).getAttribute('href');
 const tvURL=await pair.getByRole('link',{name:'Abrir TV',exact:true}).getAttribute('href');
 const unrelatedURL=await tablet.locator('.session').nth(1).getByRole('link',{name:'Abrir TV',exact:true}).getAttribute('href');
 const tq=new URL(tabletURL).searchParams,vq=new URL(tvURL).searchParams;
 assert.equal(tq.get('station'),vq.get('station'));assert.equal(tq.get('room'),vq.get('room'));assert.match(tq.get('room'),/^[a-f0-9]{32}$/);
 report.links={tablet:tabletURL,tv:tvURL};
 // An actual 401 must fail here, before a cached tablet state can hide it.
 if(live){
  const probe=await tablet.request.get(`https://f1-sap-default-rtdb.firebaseio.com/aiExhibitionHall/rooms/${tq.get('room')}.json`);
  assert.equal(probe.status(),200,'Publish aiExhibitionHall.rooms rules before live testing');
 }
 await tv.goto(tvURL);await otherTV.goto(unrelatedURL);await tablet.goto(tabletURL);
 await tablet.locator('.home-art-image').waitFor();
 const card=tablet.locator('[data-project="11"]');
 assert.match(await card.getAttribute('aria-label'),/^RISE/);
 const target=new URL(await card.getAttribute('href'),tabletURL);
 assert.equal(target.pathname,'/projects/11-rsm-rise/index.html');
 assert.equal(target.search,'?'+tq.toString());
 await tablet.bringToFront();await tablet.screenshot({path:fileURLToPath(new URL('menu-tablet.png',out))});
 await card.click();
 const frame=()=>tablet.frameLocator('iframe');
 const scene=async(sc,ip)=>{
  for(const page of [tablet,tv])await page.waitForFunction(({sc,ip})=>{const s=document.querySelector('[data-rise-device]')?.contentWindow?.S;return s?.sc===sc&&(ip===undefined||s.ip===ip);},{sc,ip});
  assert.equal(new URL(tablet.url()).searchParams.get('station'),tq.get('station'));assert.equal(new URL(tablet.url()).searchParams.get('room'),tq.get('room'));
 };
 await scene('intro',0);check('sessions page -> matching links -> original RISE menu card -> tablet and TV intro');
 await frame().locator('[data-ip="1"]').click();await scene('intro',1);
 await frame().locator('.tb.pri[data-go="problem"]').waitFor({timeout:15000});await scene('intro',2);
 check('original opening animation completes and waits for Start experience');
 await frame().locator('[data-go="problem"]').click();await scene('problem');
 await frame().getByRole('button',{name:'Back',exact:true}).click();await scene('intro',2);
 await frame().locator('[data-go="problem"]').click();await scene('problem');
 await frame().locator('[data-go="ficha"]').click();await scene('ficha');
 await frame().locator('[data-go="deal"]').click();await scene('deal');
 await frame().locator('[data-deal="1"]').click();
 await frame().locator('[data-go="read"]').click();await scene('read');
 await frame().locator('[data-run]').click();
 await tablet.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.run===2);
 await frame().locator('[data-go="decide"]').click();await scene('decide');
 await tablet.reload();await scene('decide');
 await frame().locator('[data-lang="es"]').click();
 await tv.waitForFunction(()=>document.querySelector('iframe')?.contentDocument?.documentElement.lang==='es');
 await frame().locator('[data-go="time"]').click();await scene('time');
 await frame().locator('[data-tp]').click();
 await tv.waitForFunction(()=>document.querySelector('iframe')?.contentWindow?.S?.tp===1);
 await frame().locator('[data-go="sup"]').click();await scene('sup');
 await frame().locator('[data-sup]').click();await frame().locator('[data-act="2"]').waitFor();
 await frame().locator('[data-act="2"]').click();await frame().locator('[data-go="loop"]').click();await scene('loop');
 await frame().getByRole('button',{name:'Atrás',exact:true}).click();await scene('sup');
 for(const page of [tablet,tv]){
  assert.deepEqual(await page.locator('iframe').evaluate(f=>[f.contentWindow.S.deal,f.contentWindow.S.act]),[1,2]);
  assert.deepEqual(await page.locator('iframe').evaluate(f=>Object.keys(f.contentWindow.__i18nMiss||{})),[]);
 }
 check('full review, real tablet reload, EN/ES, manual Play/reports, chosen insight and Back synchronized');
 await frame().locator('[data-home]').click();await tablet.locator('[data-project="11"]').waitFor();
 await tv.locator('.home-art-image').waitFor();
 assert.equal(new URL(tablet.url()).searchParams.get('room'),tq.get('room'));
 await tablet.locator('[data-project="11"]').click();await scene('intro',0);
 await frame().getByRole('button',{name:'Back',exact:true}).click();
 await tablet.locator('[data-project="11"]').waitFor();await tv.locator('.home-art-image').waitFor();
 assert.equal(await otherTV.locator('[data-rise-device]').count(),0);
 assert.equal(report.tvWrites,0);assert.deepEqual(report.errors,[]);
 check('Home, re-entry, initial Back to projects, independent room and read-only TVs');
 console.log(JSON.stringify(report.links));
}finally{
 writeFileSync(new URL('report.json',out),JSON.stringify(report,null,2));
 await browser.close();
}
