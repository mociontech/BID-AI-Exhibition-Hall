const {test}=require('node:test');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=path.join(__dirname,'../projects/07-csd-maiia/assets/branding');
test('approved MAIIA PNGs retain original bytes and 1920 x 1080 resolution',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'source-manifest.json'),'utf8'));
 assert.equal(manifest.files.length,18);
 for(const entry of manifest.files){
  const bytes=fs.readFileSync(path.join(dir,entry.file));
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  assert.equal(bytes.readUInt32BE(16),1920);assert.equal(bytes.readUInt32BE(20),1080);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.file);
 }
});

test('November screen exports preserve their original PNG bytes and clip only export labels',()=>{
 const folder=path.join(__dirname,'../projects/07-csd-maiia/assets/screens-2026-11');
 const manifest=JSON.parse(fs.readFileSync(path.join(folder,'source-manifest.json'),'utf8'));
 assert.equal(manifest.source,'MAIIA_Pantallas.zip');
 assert.equal(manifest.files.length,20);
 for(const entry of manifest.files){const bytes=fs.readFileSync(path.join(folder,entry.file));
  assert.equal(bytes.readUInt32BE(16),entry.width);assert.equal(bytes.readUInt32BE(20),entry.height);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.file);
  if(entry.width===1920){assert.equal(entry.viewBox[2],1920);assert.equal(entry.viewBox[3],1080);assert.equal(entry.viewBox[1]+1080,entry.height);}
 }
});
