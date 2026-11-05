const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const code=fs.readFileSync(path.join(root,'shared/home.js'),'utf8');
function openHome(search,station){
 const redirects=[],sent=[],app={innerHTML:'',querySelectorAll:()=>[]};
 const window={};vm.runInNewContext(fs.readFileSync(path.join(root,'shared/projects.js'),'utf8'),{window});
 const sync={stationQuery:'?station='+station+'&room=0123456789abcdef0123456789abcdef',send:state=>sent.push(state)};
 vm.runInNewContext(code,{window:{...window,AI_SYNC:sync},document:{getElementById:()=>app},URLSearchParams,location:{search,replace:url=>redirects.push(url),assign:url=>redirects.push(url)}});
 return {redirects,sent,html:app.innerHTML};
}
test('Home opens the complete project grid for every station, with or without the legacy projects flag',()=>{
 for(let station=1;station<=11;station++)for(const suffix of ['', '&projects=1']){
  const result=openHome('?station='+station+'&room=0123456789abcdef0123456789abcdef'+suffix,station);
  assert.deepEqual(result.redirects,[],'Home unexpectedly redirects station '+station);
  assert.equal((result.html.match(/data-project="/g)||[]).length,10);
  assert.deepEqual(JSON.parse(JSON.stringify(result.sent)),[{view:'home',projectId:null,section:null}]);
  assert.ok(result.html.includes('projects/07-csd-maiia/index.html?station='+station+'&room='));
 }
});
test('the root menu also opens without an explicit station query',()=>{
 assert.deepEqual(openHome('',7).redirects,[]);
 assert.equal((openHome('',7).html.match(/data-project="/g)||[]).length,10);
});
