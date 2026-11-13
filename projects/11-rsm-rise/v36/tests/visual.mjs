import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium,base,state} from './runtime.mjs';
import {compare} from '../../rise-prototype/tests/png.mjs';
const root=new URL('../',import.meta.url),out=new URL('artifacts/visual/',root);mkdirSync(out,{recursive:true});
const html=readFileSync(new URL('original.html',root),'utf8');
assert.equal(readFileSync(new URL('styles.css',root),'utf8'),html.match(/<style>([\s\S]*?)<\/style>/)[1]);
assert.equal('\n(function(){\n'+readFileSync(new URL('app.js',root),'utf8')+readFileSync(new URL('i18n.js',root),'utf8')+'})();\n',html.match(/<script>([\s\S]*?)<\/script>/)[1]);
const report={source:'RISE_Prototipo_v36.html',screenshots:[],errors:[],missing:[]};
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const context=await browser.newContext({viewport:{width:1500,height:900},deviceScaleFactor:1,colorScheme:'light'});
await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
await context.route('**/favicon.ico',r=>r.fulfill({status:204,body:''}));
const original=await context.newPage(),tablet=await context.newPage(),tv=await context.newPage();
// Static fixture transport is isolated from all station sessions. The live API
// and clock recovery are exercised separately by flow.mjs.
let fixture;
await context.route('**/api/state?**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({...fixture,serverNow:Date.now()})}));
for(const page of [original,tablet,tv]){
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.clock.install({time:new Date('2026-11-12T12:00:00Z')});
 await page.clock.pauseAt(new Date('2026-11-12T12:00:01Z'));
}
const prefix='/projects/11-rsm-rise/';
try{
 for(const lang of ['en','es']){
  await original.goto(base+prefix+'v36/original.html');
  await original.locator(`[data-lang="${lang}"]`).click({force:true});
  const sizes=await original.evaluate(()=>Object.fromEntries(['tv','tab'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return[id,{width:r.width,height:r.height}];})));
  await tablet.setViewportSize({width:Math.round(sizes.tab.width),height:Math.round(sizes.tab.height)});
  await tv.setViewportSize({width:Math.round(sizes.tv.width),height:Math.round(sizes.tv.height)});
  const snap=async(name,partial,advance=0)=>{
   const game={...state.fresh(),...partial};
   fixture={stationId:11,view:'game',projectId:'11',mode:game.sc==='loop'?'results':'game',section:game.sc,language:lang,game};
   await tablet.goto(base+prefix+'index.html?station=11');await tv.goto(base+'/display.html?station=11');
   for(const [role,page,id] of [['tablet',tablet,'tab'],['tv',tv,'tv']]){
    await page.waitForFunction(({sc,lang})=>{const w=document.querySelector('iframe')?.contentWindow;return w?.S?.sc===sc&&w.document.documentElement.lang===lang;},{sc:game.sc,lang});
    if(advance)await page.clock.runFor(advance);
    await original.bringToFront();
    await original.evaluate(({id,size})=>{
     const node=document.getElementById(id),marker=document.createComment('reference origin');node.before(marker);window.originMarker=marker;
     const wrapper=document.createElement('div');wrapper.id='reference-origin';
     Object.assign(wrapper.style,{position:'fixed',left:'0',top:'0',width:size.width+'px',height:size.height+'px',background:'#0a0a0a',zIndex:'2147483647'});
     document.body.append(wrapper);wrapper.append(node);void wrapper.offsetHeight;
     document.getAnimations().forEach(a=>{try{a.finish();}catch{a.pause();}});
    },{id,size:sizes[id]});
    const expected=await original.screenshot({clip:{x:0,y:0,width:Math.round(sizes[id].width),height:Math.round(sizes[id].height)},path:fileURLToPath(new URL(`${lang}-${name}-${role}-original.png`,out)),animations:'disabled'});
    await original.evaluate(id=>{originMarker.replaceWith(document.getElementById(id));document.getElementById('reference-origin').remove();},id);
    await page.bringToFront();
    await page.locator('iframe').evaluate(f=>{void f.contentDocument.body.offsetHeight;f.contentDocument.getAnimations().forEach(a=>{try{a.finish();}catch{a.pause();}});});
    // Back is the sole requested addition to the supplied v36 design. Hide only
    // that extra control for the original comparison, preserving its layout.
    await page.locator('iframe').evaluate(f=>f.contentDocument.querySelectorAll('[data-rise-back]').forEach(b=>b.style.visibility='hidden'));
    const actual=await page.screenshot({path:fileURLToPath(new URL(`${lang}-${name}-${role}-integrated.png`,out)),animations:'disabled'});
    await page.locator('iframe').evaluate(f=>f.contentDocument.querySelectorAll('[data-rise-back]').forEach(b=>b.style.removeProperty('visibility')));
    const result=compare(expected,actual);report.screenshots.push({lang,scene:name,role,...result});
    assert(result.match,`${lang}/${name}/${role}: ${JSON.stringify(result)}`);
    const missing=await page.locator('iframe').evaluate(f=>Object.keys(f.contentWindow.__i18nMiss||{}));
    if(missing.length)report.missing.push({lang,scene:name,role,keys:missing});
   }
  };
  const click=selector=>original.locator(selector).click({force:true});
  await original.clock.runFor(400);await snap('notice',{sc:'intro',ip:0},400);
  await click('[data-ip="1"]');await original.clock.runFor(8200);await snap('opening-complete',{sc:'intro',ip:2});
  await click('[data-go="problem"]');await snap('problem',{sc:'problem',ip:2});
  await click('[data-go="ficha"]');await snap('solution',{sc:'ficha',ip:2});
  await click('[data-go="deal"]');await snap('proposals',{sc:'deal',ip:2});
  for(let deal=0;deal<3;deal++){
   await click(`[data-deal="${deal}"]`);await snap(`proposal-${deal}`,{sc:'deal',deal,ip:2});
   await click('[data-go="read"]');await snap(`read-idle-${deal}`,{sc:'read',deal,ip:2});
   await click('[data-run]');await original.clock.runFor(2400);await snap(`reading-${deal}`,{sc:'read',deal,ip:2,p:.5,run:1});
   await original.clock.runFor(2600);await snap(`read-ready-${deal}`,{sc:'read',deal,ip:2,p:1,run:2});
   await click('[data-go="decide"]');await original.clock.runFor(4500);await snap(`risk-${deal}`,{sc:'decide',deal,ip:2,p:1,run:2},4500);
   await click('[data-go="time"]');await snap(`time-idle-${deal}`,{sc:'time',deal,ip:2,p:1,run:2});
   await click('[data-tp]');await snap(`time-playing-${deal}`,{sc:'time',deal,ip:2,p:1,run:2,tp:1});
   await click('[data-go="sup"]');await snap(`reports-idle-${deal}`,{sc:'sup',deal,ip:2,p:1,run:2,tp:1});
   await click('[data-sup]');await original.clock.runFor(4200);await snap(`insights-${deal}`,{sc:'sup',deal,ip:2,p:1,run:2,tp:1,sr:1,t:1});
   await click(`[data-act="${deal}"]`);await snap(`insight-selected-${deal}`,{sc:'sup',deal,ip:2,p:1,run:2,tp:1,sr:1,t:1,act:deal});
   await click('[data-go="loop"]');await snap(`memory-${deal}`,{sc:'loop',deal,ip:2,p:1,run:2,tp:1,sr:1,t:1,act:deal});
   await click('[data-reset]');await click('[data-go="problem"]');await click('[data-go="ficha"]');await click('[data-go="deal"]');
  }
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.missing,[]);
 console.log(`PASS: ${report.screenshots.length} v36 original/integrated pane comparisons, EN/ES and all three cases; source statements/CSS unchanged; no errors or missing translations.`);
}finally{writeFileSync(new URL('report.json',out),JSON.stringify(report,null,2));await browser.close();}
