const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'shared/home.js'),'utf8');
function openHome(search,station){
 const redirects=[],sent=[],links=[],app={innerHTML:'',querySelectorAll:()=>links};
 const window={};vm.runInNewContext(fs.readFileSync(path.join(root,'shared/projects.js'),'utf8'),{window});
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared/home-art.js'),'utf8'),{window});
 for(const card of window.EXHIBITION_HOME.cards){
  const project=window.EXHIBITION_PROJECTS.find(project=>project.id===card.id);
  links.push({dataset:{project:card.id},href:project.href+'?station='+station+'&room=0123456789abcdef0123456789abcdef'});
 }
 links.forEach(link=>{link.addEventListener=(_event,handler)=>{link.click=handler;};});
 const sync={stationQuery:'?station='+station+'&room=0123456789abcdef0123456789abcdef',send:state=>sent.push(state)};
 vm.runInNewContext(code,{window:{...window,AI_SYNC:sync},document:{getElementById:()=>app},URLSearchParams,location:{search,replace:url=>redirects.push(url),assign:url=>redirects.push(url)}});
 return {redirects,sent,html:app.innerHTML,links};
}
test('Home opens the complete project grid for every station, with or without the legacy projects flag',()=>{
 for(let station=1;station<=11;station++)for(const suffix of ['', '&projects=1']){
  const result=openHome('?station='+station+'&room=0123456789abcdef0123456789abcdef'+suffix,station);
  assert.deepEqual(result.redirects,[],'Home unexpectedly redirects station '+station);
  assert.equal((result.html.match(/data-project="/g)||[]).length,10);
  assert.deepEqual(JSON.parse(JSON.stringify(result.sent)),[{view:'home',projectId:null,section:null}]);
  assert.ok(result.html.includes('projects/07-csd-maiia/index.html?station='+station+'&amp;room='));
 }
});
test('the root menu also opens without an explicit station query',()=>{
 assert.deepEqual(openHome('',7).redirects,[]);
 assert.equal((openHome('',7).html.match(/data-project="/g)||[]).length,10);
});
test('artwork card order opens the matching project and preserves the pairing',async()=>{
 const expected=['01','10','07','04','02','05','06','11','08','03'];
 const result=openHome('?station=3',3);
 assert.deepEqual(Array.from(result.html.matchAll(/data-project="(\d+)"/g),match=>match[1]),expected);
 for(const link of result.links){
  let prevented=false;
  await link.click({preventDefault:()=>{prevented=true;}});
  assert.equal(prevented,true);
  assert.equal(result.sent.at(-1).projectId,link.dataset.project);
  assert.equal(result.redirects.at(-1),link.href);
  assert.match(link.href,/station=3&room=0123456789abcdef0123456789abcdef$/);
 }
});
test('the large display home uses its own artwork without interactive links',()=>{
 const window={};
 vm.runInNewContext(fs.readFileSync(path.join(root,'shared/home-art.js'),'utf8'),{window});
 const html=window.EXHIBITION_HOME.render();
 assert.match(html,/assets\/home\/display-en\.png/);
 assert.doesNotMatch(html,/<a\b|<button\b|<nav\b/);
});
