import {createRequire} from 'node:module';
import {homedir} from 'node:os';
import path from 'node:path';
export const require=createRequire(import.meta.url);
let runtime;
for(const candidate of [process.env.PLAYWRIGHT_MODULE,'playwright','playwright-core',path.join(homedir(),'AppData/Local/Programs/Python/Python310/lib/site-packages/playwright/driver/package')].filter(Boolean)){
 try{runtime=require(candidate);break;}catch{}
}
if(!runtime)throw Error('Set PLAYWRIGHT_MODULE to the installed Playwright; no project dependency is added.');
export const chromium=runtime.chromium;
export const base=process.env.BASE_URL||'http://127.0.0.1:4191';
export const state=require('../../state.js');
