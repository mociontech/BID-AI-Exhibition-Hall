import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import path from 'node:path';
const require=createRequire(import.meta.url),state=require('../../state.js');
let pw;
for(const name of [process.env.PLAYWRIGHT_MODULE,'playwright','playwright-core',path.join(homedir(),'AppData/Local/Programs/Python/Python310/lib/site-packages/playwright/driver/package')].filter(Boolean)){
 try{pw=require(name);break;}catch{}
}
assert(pw,'Set PLAYWRIGHT_MODULE');
const base=process.env.BASE_URL||'http://127.0.0.1:4191';
const browser=await pw.chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const ctx=await browser.newContext({viewport:{width:1024,height:768},colorScheme:'light'});
await ctx.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
const tablet=await ctx.newPage(),tv=await ctx.newPage(),errors=[];
await tv.setViewportSize({width:1920,height:1080});
for(const page of [tablet,tv]){
 page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date('2026-11-12T12:00:00Z')});
 await page.clock.pauseAt(new Date('2026-11-12T12:00:01Z'));
 await page.addInitScript(()=>window.addEventListener('message',e=>{if(e.data?.type==='rise:change')window.outgoing=e.data;}));
}
const deliver=async(page,game,language='en')=>{
 await page.evaluate(({game,language})=>window.postMessage({type:'rise:state',game,language,now:Date.now()},location.origin),{game,language});
 await page.waitForFunction(sc=>S.sc===sc,game.sc);
};
try{
 await tablet.goto(base+'/projects/11-rsm-rise/rise-prototype/screen.html?role=tablet');
 await tv.goto(base+'/projects/11-rsm-rise/rise-prototype/screen.html?role=tv');
 await deliver(tablet,state.fresh());await deliver(tv,state.fresh());
 for(const page of [tablet,tv]){
  await page.clock.runFor(15000);
  assert.equal(await page.evaluate(()=>S.sc),'intro','Must not advance before touch');
  assert.equal(await page.evaluate(()=>RISE_INTRO.startedAt),0);
  assert.equal(await page.evaluate(()=>raf),0,'No wall animation before touch');
 }
 assert(await tablet.locator('[data-intro-start]').isVisible());
 assert.equal(await tv.locator('.rise-entry-notice').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
 await tablet.locator('[data-intro-start]').click();
 await tablet.waitForFunction(()=>window.outgoing?.game.infoStartedAt>0);
 const running=await tablet.evaluate(()=>outgoing.game),stamp=running.infoStartedAt;
 assert.equal(running.sc,'intro');
 await deliver(tv,running);
 assert.equal(await tv.evaluate(()=>RISE_INTRO.startedAt),stamp);
 const fullWall=await tv.evaluate(()=>{
  const canvas=tv.querySelector('canvas.iwall'),r=canvas.getBoundingClientRect(),caption=tv.querySelector('.opn-t'),c=caption.getBoundingClientRect();
  return {width:r.width,left:r.left,mask:getComputedStyle(canvas).maskImage,radius:getComputedStyle(canvas).borderRadius,captionCenter:c.left+c.width/2,captionWidth:parseFloat(getComputedStyle(caption).width),counterFont:parseFloat(getComputedStyle(document.getElementById('opnn')).fontSize)};
 });
 assert.equal(fullWall.width,1920,'Original wall must cover the full TV width');
 assert.equal(fullWall.left,0);assert.equal(fullWall.mask,'none');assert.equal(fullWall.radius,'0px');
 assert(Math.abs(fullWall.captionCenter-960)<.1);assert.equal(fullWall.captionWidth,1920,'Original counter stays centered over the wall');
 assert(Math.abs(fullWall.counterFont-307.2)<.1,'Original counter retains its 16cqw size');
 assert.equal(await tv.locator('.rise-entry-notice').count(),0,'No notice covers the original animation');
 assert.equal(await tablet.locator('.thead h3').innerText(),'RISE');
 for(const page of [tablet,tv]){
  await page.clock.runFor(1000);
  assert.equal(await page.evaluate(()=>S.sc),'intro');
  assert(await page.evaluate(()=>raf>0),'The same original wall animation now runs');
 }
 // A reload recovers the elapsed opening rather than starting another 11.5 s.
 await tablet.reload();await deliver(tablet,running);
 assert.equal(await tablet.evaluate(()=>RISE_INTRO.startedAt),stamp);
 await tablet.clock.runFor(11000);
 assert.equal(await tablet.evaluate(()=>S.sc),'problem');
 const advanced=await tablet.evaluate(()=>outgoing.game);await deliver(tv,advanced);
 assert.equal(await tv.evaluate(()=>S.sc),'problem');
 await deliver(tablet,{...state.fresh(),sc:'loop',deal:0,p:1,run:2,t:1});
 await tablet.locator('[data-reset]').click();
 assert.equal(await tablet.evaluate(()=>RISE_INTRO.startedAt),0);
 await tablet.clock.runFor(15000);
 assert.equal(await tablet.evaluate(()=>S.sc),'intro','Replay must also wait for touch');
 await tablet.locator('[data-lang="es"]').click();
 assert.equal(await tablet.evaluate(()=>RISE_INTRO.startedAt),0,'Language changes do not start animation');
 assert.equal(await tablet.locator('[data-intro-start]').innerText(),'Iniciar experiencia');
 for(const page of [tablet,tv])assert.deepEqual(await page.evaluate(()=>Object.keys(__i18nMiss)),[]);
 assert.deepEqual(errors,[]);
 console.log('PASS: waits for touch, starts on both devices, preserves original animation, recovers elapsed time, replay waits, ES, no browser errors.');
}finally{await browser.close();}
