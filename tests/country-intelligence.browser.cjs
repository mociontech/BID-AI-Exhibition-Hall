/* Run with NODE_PATH pointing to an installed Playwright, and COUNTRY_URL if needed. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.COUNTRY_URL||'http://127.0.0.1:4187';
const output=path.join(__dirname,'../projects/10-vpc-country-intelligence/verification');
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true});
 const errors=[],checks=[];
 const controller=await browser.newContext({viewport:{width:1024,height:768},hasTouch:true});
 const receiver=await browser.newContext({viewport:{width:1920,height:1080}});
 const tablet=await controller.newPage(),tv=await receiver.newPage();
 for(const page of [tablet,tv])page.on('pageerror',e=>errors.push(e.message));
 const state=()=>tablet.request.get(base+'/api/state?station=10').then(r=>r.json());
 async function displayHas(value){await tv.getByText(value,{exact:false}).first().waitFor();}
 async function shot(name){await tablet.screenshot({path:path.join(output,name+'-tablet.png'),animations:'disabled'});await tv.screenshot({path:path.join(output,name+'-tv.png'),animations:'disabled'});}
 async function fits(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight),'vertical overflow');}
 try{
  await tablet.goto(base+'/projects/10-vpc-country-intelligence/index.html?station=10');await tablet.locator('[data-info]').waitFor();
  await tv.goto(base+'/display.html?station=10');
  assert.equal(await tablet.locator('[data-start]').isDisabled(),false);
  await tablet.locator('[data-home]').focus();await tablet.keyboard.press('Tab');
  assert(await tablet.evaluate(()=>document.activeElement.matches('button:focus-visible')));
  await fits(tablet);await shot('01-menu');
  await tablet.locator('[data-start]').tap();await tablet.locator('[data-go="ficha"]').waitFor();
  await tablet.locator('[data-menu]').first().tap();
  checks.push('Both options available immediately, game starts without Information, keyboard focus, 1024×768 layout');
  await tablet.locator('[data-language="es"]').tap();
  await displayHas('Inteligencia País');
  await tablet.locator('[data-info]').tap();
  await tv.locator('.ci-infographic').waitFor();
  await displayHas('Evidencia dispersa');await fits(tv);await shot('00-infographic');
  assert.equal(await tv.locator('.tv').count(),0);
  await tablet.reload();await tablet.locator('[data-info]').waitFor();
  assert.equal(await tablet.locator('[data-start]').isDisabled(),false);
  await tv.reload();await tv.locator('.ci-infographic').waitFor();
  await displayHas('De señales dispersas');
  checks.push('Independent bilingual infographic, no game screens used for Information, reload recovery, no unlock timer');
  await tablet.locator('[data-start]').tap();await tablet.locator('[data-go="ficha"]').tap();
  await tablet.locator('[data-go="sig"]').tap();
  assert.equal(await tablet.locator('[data-go="m0"]').isDisabled(),true);
  await tablet.locator('[data-sig="0"]').tap();await displayHas('1 de 8 señales conectadas');
  await tablet.locator('[data-sig="0"]').tap();assert.equal((await state()).game.con.length,1);
  await tablet.reload();await tablet.locator('[data-sig="0"][aria-pressed="true"]').waitFor();
  await tv.reload();await displayHas('1 de 8 señales conectadas');
  await tablet.locator('[data-all]').tap();await displayHas('8 de 8 señales conectadas');
  await fits(tablet);await shot('02-signals');checks.push('Eight original signals, duplicate taps, Connect all, reload recovery');
  await tablet.locator('[data-go="m0"]').tap();
  for(let k=0;k<3;k++){
   await tablet.locator('[data-run]').tap();
   if(k===0){const before=(await state()).game.runs[0];await tablet.reload();await tablet.locator('.runn').waitFor();assert.equal((await state()).game.runs[0],before);await tv.reload();}
   await tablet.locator('[data-pick="1"]').waitFor({timeout:9000});
   const next=k===2?'loop':'m'+(k+1);
   assert.equal(await tablet.locator(`[data-go="${next}"]`).isDisabled(),true);
   await tablet.locator('[data-pick="1"]').tap();
   await displayHas(k===0?'El equipo país eligió':k===1?'pasa al próximo diálogo':'Los hallazgos vuelven a la estrategia.');
   await fits(tablet);await fits(tv);await shot('0'+(k+3)+'-moment');
   await tablet.locator(`[data-go="${next}"]`).tap();
  }
  checks.push('Three 5.2 second comparisons, no auto decision, all decisions synchronized, run timestamp survives reload');
  await tablet.locator('[data-reset]').waitFor();await displayHas('La IA conecta la información.');
  assert.deepEqual((await state()).game.pk,{'0':1,'1':1,'2':1});await shot('06-loop');
  await tablet.locator('[data-language="en"]').tap();await displayHas('AI connects the information.');
  await tablet.locator('[data-reset]').tap();await tablet.locator('[data-go="ficha"]').waitFor();assert.equal((await state()).game.con.length,0);
  await tablet.locator('[data-menu]').first().tap();await tablet.locator('[data-start]:enabled').waitFor();
  await tablet.setViewportSize({width:1180,height:820});await fits(tablet);await shot('07-landscape');
  await tablet.clock.install();await tablet.clock.fastForward(46000);await tablet.locator('[data-start]:enabled').waitFor();
  await tablet.locator('[data-info]').tap();await tablet.clock.fastForward(11000);await tablet.locator('[data-start]:enabled').waitFor();
  await tablet.locator('[data-start]').tap();await tablet.locator('[data-go="ficha"]').tap();
  await tablet.clock.fastForward(46000);await tablet.locator('[data-info]').waitFor();assert.equal(await tablet.locator('[data-start]').isDisabled(),false);
  checks.push('Final decisions, synchronized EN, replay, project menu, 1180×820 layout, 45 second inactivity reset');
  const isolated=await tablet.request.get(base+'/api/state?station=1').then(r=>r.json());assert.equal(isolated.projectId,null);
  const invalid=await tablet.request.post(base+'/api/state?station=10',{data:{view:'game',projectId:'10',game:{...(await state()).game,con:[99]}}});assert.equal(invalid.status(),400);
  await tablet.locator('[data-home]').tap();await tablet.waitForURL('**/index.html?station=10&projects=1');await tablet.locator('[data-project="10"]').waitFor();
  await tv.locator('.ci-display').waitFor({state:'detached'});
  checks.push('General Home, station 1 isolation, malformed state rejected, display timer cleanup');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
