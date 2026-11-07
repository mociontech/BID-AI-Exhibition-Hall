const test=require('node:test'),assert=require('node:assert/strict');
const ranking=require('../projects/02-bogota-traffic-prediction/ranking.js');
const session={sessionId:'12345678-1234-1234-1234-123456789abc',playerId:'valentina',playerName:' Test ',results:{0:100,1:100,2:100,3:100},durationMs:91000};
test('ranking totals four unique cases with a maximum of 400, and accepts partial play',()=>{
 const full=ranking.snapshot(session);assert.equal(full.score,400);assert.equal(full.casesPlayed,4);assert.equal(full.displayName,'Test');
 const partial=ranking.snapshot({...session,results:{2:60}});assert.equal(partial.score,60);assert.equal(partial.casesPlayed,1);
 for(const results of [{},{0:101},{4:100},{0:NaN}])assert.throws(()=>ranking.snapshot({...session,results}));
 assert.throws(()=>ranking.snapshot({...session,durationMs:NaN}));assert.throws(()=>ranking.snapshot({...session,durationMs:0}));
});
test('score dominates time; shorter duration breaks equal scores',()=>{
 const fast=ranking.snapshot({...session,durationMs:12345}),slow=ranking.snapshot({...session,durationMs:12346});
 assert.ok(fast.rankKey<slow.rankKey);
 const worstPerfect=ranking.snapshot({...session,durationMs:ranking.maxDuration});
 const fast399=ranking.snapshot({...session,results:{0:100,1:100,2:100,3:99},durationMs:1});
 assert.ok(worstPerfect.rankKey<fast399.rankKey);
});
test('session clock excludes summary/QR reading and accumulates resumed play',()=>{
 const clock=ranking.clock();clock.start(1000);clock.start(2000);assert.equal(clock.pause(11000),10000);
 assert.equal(clock.pause(50000),10000);clock.start(60000);assert.equal(clock.pause(65000),15000);
 clock.reset();clock.start(70000);assert.equal(clock.pause(71000),1000);
});
test('Firestore writes use session ID for retries and a server timestamp',async()=>{
 const original=global.fetch,calls=[];global.fetch=async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return {ok:true,json:async()=>({})};};
 try{
  await ranking.save(session);await ranking.save(session);
  assert.equal(calls[0].body.writes[0].update.name,calls[1].body.writes[0].update.name);
  assert.equal(calls[0].body.writes[0].update.fields.score.integerValue,'400');
  assert.equal(calls[0].body.writes[0].updateTransforms[0].setToServerValue,'REQUEST_TIME');
 }finally{global.fetch=original;}
});
test('Firebase failures are surfaced so controller can offer retry',async()=>{
 const original=global.fetch;global.fetch=async()=>({ok:false,json:async()=>({error:{status:'PERMISSION_DENIED'}})});
 try{await assert.rejects(()=>ranking.save(session),/PERMISSION_DENIED/);}finally{global.fetch=original;}
});
