import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {homedir} from 'node:os';
import path from 'node:path';
import {compare} from './png.mjs';
const require = createRequire(import.meta.url);
const candidates = [process.env.PLAYWRIGHT_MODULE, 'playwright', 'playwright-core',
  path.join(homedir(), 'AppData/Local/Programs/Python/Python310/lib/site-packages/playwright/driver/package')].filter(Boolean);
let pw;
for (const candidate of candidates) { try { pw = require(candidate); break; } catch {} }
if (!pw) throw Error('Set PLAYWRIGHT_MODULE to an existing Playwright installation. No project dependency is installed.');
const root = new URL('../', import.meta.url);
const out = new URL('artifacts/flow/', root); mkdirSync(out, {recursive:true});
let base = process.env.RISE_URL, server;
const source = readFileSync(new URL('original.html', root), 'utf8');
assert.equal(readFileSync(new URL('styles.css', root), 'utf8'), source.match(/<style>([\s\S]*?)<\/style>/)[1]);
assert.equal('\n(function(){\n' + readFileSync(new URL('app.js', root), 'utf8') + readFileSync(new URL('i18n.js', root), 'utf8') + '})();\n', source.match(/<script>([\s\S]*?)<\/script>/)[1]);
const browser = await pw.chromium.launch({headless:true, channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge'});
const report = {screenshots:[], errors:[], missing:[]};
try {
  if (!base) {
    server = spawn(process.execPath, [fileURLToPath(new URL('dev.cjs',root))], {env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
    base = await new Promise((resolve,reject) => {
      const timeout=setTimeout(()=>reject(Error('Prototype server did not start')),10000);
      server.stdout.on('data',data=>{const match=String(data).match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timeout);resolve(match[0]+'/');}});
      server.once('error',error=>{clearTimeout(timeout);reject(error);});
      server.once('exit',code=>{clearTimeout(timeout);reject(Error('Prototype server exited: '+code));});
    });
  }
  for (const lang of ['en','es']) {
    const shots = [];
    for (const file of ['original.html','index.html']) {
      const context = await browser.newContext({viewport:{width:1500,height:900},deviceScaleFactor:1,colorScheme:'light'});
      // Compare using the system fallback too. No network or CDN is needed by tests.
      await context.route('https://fonts.googleapis.com/**', route => route.fulfill({contentType:'text/css',body:''}));
      await context.route('**/favicon.ico', route => route.fulfill({status:204,body:''}));
      await context.addInitScript(value => localStorage.setItem('aia-lang',value), lang);
      const page = await context.newPage();
      page.on('pageerror', e => report.errors.push(`${file}: ${e.message}`));
      page.on('console', m => { if(m.type()==='error') report.errors.push(`${file}: ${m.text()}`); });
      await page.clock.install({time:new Date('2026-11-12T12:00:00Z')});
      await page.clock.pauseAt(new Date('2026-11-12T12:00:01Z'));
      await page.goto(new URL(file, base).href);
      await page.evaluate(() => document.fonts.ready);
      const captures = new Map();
      const snap = async name => {
        await page.clock.runFor(100);
        const filename = `${lang}-${file.split('.')[0]}-${name}.png`;
        // Capture both devices even though the tablet sits below the fold.
        const data = await page.locator('.stage').screenshot({path:fileURLToPath(new URL(filename,out)),animations:'disabled'});
        captures.set(name,data);
        const misses = await page.evaluate(() => Object.keys(window.__i18nMiss || {}));
        if (misses.length) report.missing.push({lang,file,scene:name,keys:misses});
      };
      const click = async selector => { await page.locator(selector).click({force:true}); };
      await snap('intro');
      await click('[data-go="problem"]'); await snap('problem');
      await click('[data-go="ficha"]'); await snap('solution');
      await click('[data-go="deal"]'); await snap('proposals');
      for (let deal=0;deal<3;deal++) {
        await click(`[data-deal="${deal}"]`); await snap(`deal-${deal}`);
        await click('[data-go="read"]'); await snap(`read-idle-${deal}`);
        await click('[data-run]'); await page.clock.runFor(2400); await snap(`reading-${deal}`);
        await page.clock.runFor(2600); await snap(`read-ready-${deal}`);
        await click('[data-go="decide"]'); await page.clock.runFor(4500); await snap(`risk-${deal}`);
        await page.clock.runFor(8500);
        assert.equal(await page.locator('.ptoast.keep').count(),1,'Risk toast must persist after 8.3 seconds');
        await click('[data-go="time"]'); await snap(`time-${deal}`);
        await page.clock.runFor(12000); await snap(`supervision-${deal}`);
        await click(`[data-act="${deal}"]`); await snap(`action-${deal}`);
        await click('[data-go="loop"]'); await snap(`loop-${deal}`);
        await page.clock.runFor(8500);
        assert.equal(await page.locator('.ptoast').count(),0,'Ordinary toast must expire');
        await click('[data-reset]'); await click('[data-go="problem"]'); await click('[data-go="ficha"]'); await click('[data-go="deal"]');
      }
      shots.push(captures); await context.close();
    }
    for (const [scene, original] of shots[0]) {
      const result = compare(original,shots[1].get(scene));
      report.screenshots.push({lang,scene,...result});
      assert(result.match,`Screenshot differs from original: ${lang}/${scene}: ${JSON.stringify(result)}`);
    }
  }
  assert.deepEqual(report.errors,[], 'Browser errors');
  assert.deepEqual(report.missing,[], 'Untranslated keys in window.__i18nMiss');
  console.log(`PASS: ${report.screenshots.length} original/extracted screenshot pairs; EN/ES, all three proposals, toast lifetimes, offline fonts.`);
} finally {
  writeFileSync(new URL('report.json',out),JSON.stringify(report,null,2));
  await browser.close();
  server?.kill();
}
