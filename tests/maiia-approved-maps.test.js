const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const S=require('../projects/07-csd-maiia/state.js'),C=require('../projects/07-csd-maiia/data/demo-maps.json');
// Concave settlements need a point inside the contour, not its vertex average.
function interior(zone){
 const xs=zone.points.map(p=>p[0]),ys=zone.points.map(p=>p[1]);
 for(let j=1;j<50;j++)for(let i=1;i<50;i++){
  const p=[Math.min(...xs)+(Math.max(...xs)-Math.min(...xs))*i/50,Math.min(...ys)+(Math.max(...ys)-Math.min(...ys))*j/50];
  if(S.inside(p,zone.points))return p;
 }
 throw Error('No interior point: '+zone.id);
}
test('MAIIA keeps all four client PNGs byte-for-byte and uses clean maps for play',()=>{
 const dir=path.join(__dirname,'../projects/07-csd-maiia/assets/maps');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'source-manifest.json')));
 assert.equal(manifest.files.length,4);
 for(const entry of manifest.files){const bytes=fs.readFileSync(path.join(dir,entry.file));
  assert.equal(bytes.readUInt32BE(16),entry.width);assert.equal(bytes.readUInt32BE(20),entry.height);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256);
 }
 assert.match(C.easy.image,/AMA-01\.png$/);assert.match(C.hard.image,/AMA-03\.png$/);
});
test('approved reference geometry replaces fabricated areas and candidates',()=>{
 assert.equal(C.easy.reference.length,1);assert.equal(C.hard.reference.length,11);
 assert.equal(C.hard.candidates.length,11);
 assert.ok(C.hard.candidates.every(c=>C.hard.reference.some(z=>z.id===c.referenceId)));
 for(const zone of [...C.easy.reference,...C.hard.reference])assert.ok(zone.points.every(p=>p.every(n=>n>=0&&n<=1)));
 assert.equal(S.iou(C.easy.reference.map(z=>z.points),C.easy.reference,C.scoring),100);
 assert.equal(S.iou([],C.easy.reference,C.scoring),0);
});
test('scores use eleven approved areas, count each once and penalize outside pins',()=>{
 const points=C.hard.reference.map(interior);
 assert.deepEqual(S.manual(points,C),{hits:11,errors:0,score:100});
 assert.deepEqual(S.manual([...points,points[0],[0,0]],C),{hits:11,errors:2,score:82});
 assert.deepEqual(S.assisted(C.hard.candidates.map(c=>c.id),C),{hits:11,errors:0,score:100});
});
test('more than five or eleven pins survive session validation and recalculation',()=>{
 const markers=Array.from({length:128},(_,i)=>[i/128,.01]);
 const game={...S.fresh(),phase:'manualResult',easyScore:0,markers,manual:{hits:999,errors:0,score:100}};
 const actual=S.sanitize(game,C);assert.equal(actual.markers.length,128);assert.deepEqual(actual.manual,S.manual(markers,C));
 assert.equal(S.sanitize({...game,markers:[[NaN,.1]]},C),null);
});
test('review distinguishes a correct hit, a repeated area and an outside pin consistently with scoring',()=>{
 const a=interior(C.hard.reference[0]),b=interior(C.hard.reference[1]);
 const markers=[a,a,[0,0],b];
 assert.deepEqual(S.markerResults(markers,C).map(r=>r.status),['correct','repeated','incorrect','correct']);
 assert.deepEqual(S.manual(markers,C),{hits:2,errors:2,score:0});
 assert.deepEqual(S.markerResults([],C),[]);
});
test('old fictitious-map sessions cannot be restored against approved geometry',()=>{
 const game=S.fresh();assert.ok(S.sanitize(game,C));
 delete game.mapVersion;assert.equal(S.sanitize(game,C),null);
 assert.equal(S.sanitize({...S.fresh(),mapVersion:1},C),null);
});
test('registered close-up and scale data retain the client territorial extent',()=>{
 const [x,y,w,h]=C.easy.territoryCrop;assert.ok(x>.15&&x<.17&&y>.61&&y<.63);
 assert.ok(w>.249&&w<.251&&h>.249&&h<.251);
 assert.equal(C.easy.scaleBarMeters,250);assert.equal(C.hard.scaleBarMeters,1000);
 assert.equal(C.hard.groundWidthMeters/C.easy.groundWidthMeters,4);
});
module.exports={interior};
