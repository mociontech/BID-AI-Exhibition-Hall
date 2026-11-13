import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chromium,state} from './runtime.mjs';
const base=process.env.HOSTED_URL||'https://bidaiinaction.netlify.app';
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
const context=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true});
const errors=[];
// Exercise the public-hosting transport without writing to the exhibition DB.
let stored={payload:JSON.stringify({projectId:'11',view:'game',mode:'game',language:'en',game:{...state.fresh(),ip:2}})};
await context.route('https://f1-sap-default-rtdb.firebaseio.com/**',async route=>{
 if(route.request().method()==='PUT')stored=route.request().postDataJSON();
 await route.fulfill({contentType:'application/json',body:JSON.stringify(stored),headers:{'access-control-allow-origin':'*'}});
});
await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
const tablet=await context.newPage(),tv=await context.newPage();await tv.setViewportSize({width:1920,height:1080});
for(const page of [tablet,tv])page.on('pageerror',e=>errors.push(e.message));
const query='?station=11&room=38383838383838383838383838383838';
const frame=()=>tablet.frameLocator('[data-rise-device="tablet"]');
const both=async(sc,ip)=>{
 for(const page of [tablet,tv])await page.waitForFunction(({sc,ip})=>{const s=document.querySelector('[data-rise-device]')?.contentWindow?.S;return s?.sc===sc&&(ip===undefined||s.ip===ip);},{sc,ip});
};
try{
 await tablet.goto(base+'/projects/11-rsm-rise/index.html'+query);
 await tv.goto(base+'/display.html'+query);await both('intro',2);
 const out=new URL('../artifacts/hosted/',import.meta.url);mkdirSync(out,{recursive:true});
 await tablet.bringToFront();
 await tablet.screenshot({path:fileURLToPath(new URL('tablet-back.png',out)),animations:'disabled'});
 await frame().getByRole('button',{name:'Back',exact:true}).click();await both('intro',0);
 await frame().locator('[data-ip="1"]').click();await both('intro',1);
 await frame().locator('[data-ip="2"]').click();await both('intro',2);
 await frame().locator('[data-go="problem"]').click();await both('problem');
 await frame().getByRole('button',{name:'Back',exact:true}).click();await both('intro',2);
 stored={payload:JSON.stringify({projectId:'11',view:'game',mode:'results',language:'es',game:{...state.fresh(),sc:'loop',ip:2,deal:1,act:2,t:1,sr:1,run:2,p:1}})};
 await tablet.reload();await both('loop');
 await frame().getByRole('button',{name:'Atrás',exact:true}).click();await both('sup');
 assert.deepEqual(await tablet.locator('[data-rise-device]').evaluate(f=>[f.contentWindow.S.deal,f.contentWindow.S.act]),[1,2]);
 for(const page of [tablet,tv])assert.deepEqual(await page.locator('[data-rise-device]').evaluate(f=>Object.keys(f.contentWindow.__i18nMiss||{})),[]);
 assert.deepEqual(errors,[]);
 console.log('PASS deployed v36: EN/ES Back, original manual animation, passive TV sync and preserved insight; Firebase mocked');
}finally{await browser.close();}
