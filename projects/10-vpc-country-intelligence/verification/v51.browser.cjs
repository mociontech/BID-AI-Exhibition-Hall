const {chromium}=require('playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const base=process.env.COUNTRY_URL||'http://localhost:4187';
(async()=>{
 const b=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 const checks=[],errors=[];
 const tablet=await b.newPage({viewport:{width:1024,height:768},hasTouch:true});
 const tv=await b.newPage({viewport:{width:1920,height:1080}});
 const t=()=>tablet.frameLocator('iframe'),d=()=>tv.frameLocator('iframe');
 const current=()=>tablet.request.get(base+'/api/state?station=10').then(r=>r.json());
 const shot=async name=>{await tablet.screenshot({path:path.join(__dirname,'v51-'+name+'-tablet.png')});await tv.screenshot({path:path.join(__dirname,'v51-'+name+'-tv.png')});};
 async function go(sc){await t().locator(`[data-go="${sc}"]`).click();}
 async function visible(sc){await d().locator(sc).first().waitFor();}
 try{
  for(const p of [tablet,tv])p.on('pageerror',e=>errors.push(e.message));
  await tablet.goto(base+'/projects/10-vpc-country-intelligence/index.html?station=10');
  await tablet.locator('[data-start],iframe').first().waitFor();
  if(await tablet.locator('iframe').count())await t().locator('[data-ci-back]').click();
  await tablet.locator('[data-start]').tap();
  await t().locator('[data-go="problem"]').waitFor();
  await tv.goto(base+'/display.html?station=10');await visible('.xintro');
  assert.equal(await t().locator('#tv').isVisible(),false);
  assert.equal(await d().locator('#tab').isVisible(),false);
  await shot('intro');checks.push('Original v51 intro; separate tablet and read-only TV');
  await go('problem');await visible('.ficha');await go('cty');await visible('.ctysel');
  assert.equal(await t().locator('[data-go="ficha"]').isDisabled(),true);
  assert.equal(await t().locator('button[data-cc]').count(),26);
  await t().locator('button[data-cc="MX"]').click();
  await d().locator('#tv').getByText('Mexico',{exact:true}).waitFor();
  await shot('country');await tablet.reload();await t().locator('button[data-cc="MX"][aria-pressed="true"]').waitFor();
  await go('ficha');await visible('.cyc');await shot('cycle');
  await go('dsg');await t().locator('[data-sig="0"]').waitFor({timeout:8000});
  await visible('.sigwrap');
  assert.equal(await t().locator('[data-go="m0"]').isDisabled(),true);
  await t().locator('[data-sig="0"]').click();
  await t().locator('[data-all]').click();await go('m0');
  checks.push('26 countries, country selection reload, original cycle, automatic design transition and eight signals');
  for(let k=0;k<3;k++){
   await t().locator('[data-run]').click();
   if(k===0){await tablet.waitForTimeout(800);await tablet.reload();}
   if(k===2){
    await t().getByText('Review the results',{exact:true}).waitFor({timeout:6000});
    const phaseAt=(await current()).game.v51.phaseAt[2];
    await tablet.reload();await t().getByText('Review the results',{exact:true}).waitFor();
    assert.equal((await current()).game.v51.phaseAt[2],phaseAt);
    await tv.reload();await visible('.mscene');
   }
   await t().locator('[data-pick="0"]').waitFor({timeout:14000});
   if(k===0){assert.equal(await t().locator('[data-pick="1"]').isDisabled(),true);assert.equal(await t().locator('[data-pick="2"]').isDisabled(),true);}
   if(k===1)assert.equal(await t().locator('[data-pick]').count(),5);
   await t().locator(`[data-pick="${k===1?4:0}"]`).click();
   await shot('moment-'+k);
   await go(k===0?'ptr':k===1?'m2':'loop');
   if(k===0)await t().locator('[data-run]').waitFor({timeout:8000});
  }
  await visible('.rcap');await shot('complete');
  const state=await current();assert.deepEqual(state.game.v51.pk,{'0':0,'1':4,'2':0});
  checks.push('Original 3.2-second comparisons, 6.5-second reading pauses and reload recovery, disabled design choices, five program choices, auto program transition, decisions and final impact');
  await t().locator('[data-reset]').click();await t().locator('[data-go="problem"]').waitFor();
  await t().locator('[data-ci-back]').click();await tablet.locator('[data-start]').waitFor();
  assert.equal(await tablet.locator('button').count(),3);
  await tablet.locator('[data-info]').click();await tv.locator('.ci-infographic').waitFor();
  assert.equal(await tablet.locator('[data-info]').getAttribute('aria-pressed'),'true');
  await tablet.locator('[data-start]').click();await t().locator('[data-ci-home]').click();
  await tablet.waitForURL('**/index.html?station=10&projects=1');await tablet.locator('[data-project="10"]').waitFor();
  assert.equal((await tablet.request.get(base+'/api/state?station=1').then(r=>r.json())).projectId,null);
  checks.push('Replay, Back to Country Intelligence cover, existing infographic, Home to all projects, station isolation');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(__dirname,'v51-report.json'),JSON.stringify({checks,errors},null,2));
  console.log(JSON.stringify({checks,errors},null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
