const test=require('node:test'),assert=require('node:assert/strict');
const state=require('../projects/10-vpc-country-intelligence/state.js');
test('comparison progress is recovered from its original timestamp',()=>{
 const value={...state.fresh(10000),screen:'game',sc:'m0',ph:{0:'run'},runs:{0:10000}};
 const restored=state.sanitize(JSON.parse(JSON.stringify(value)));
 assert.equal(state.visual(restored,12600).p[0],.5);
 assert.equal(state.visual(restored,15200).ph[0],'done');
 assert.equal(restored.ph[0],'run');
});
test('all three human decisions survive transport, including option zero',()=>{
 const original={...state.fresh(10000,'es'),con:[0,1,2,3,4,5,6,7],pk:{0:0,1:1,2:2}};
 assert.deepEqual(state.sanitize(original).pk,original.pk);
 assert.equal(state.sanitize({...original,con:[0,0]}),null);
 assert.equal(state.sanitize({...original,con:[8]}),null);
 assert.equal(state.sanitize({...original,pk:{0:3}}),null);
 assert.equal(state.sanitize({...original,ph:{0:'run'}}),null);
 assert.equal(state.sanitize({...original,lastActive:NaN}),null);
});
test('v51 retains country, reading phase, comparison timestamps and all five program options',()=>{
 const v51={...state.freshV51(10000),sc:'m2',cc:'MX',ph:{0:'done',1:'done',2:'read'},pk:{0:0,1:4},p:{0:1,1:1,2:1},phaseAt:{0:4000,1:7000,2:9500}};
 const packet={...state.fresh(10000),screen:'game',v51};
 assert.deepEqual(state.sanitize(JSON.parse(JSON.stringify(packet))).v51,v51);
 assert.equal(state.sanitize({...packet,v51:{...v51,cc:'XX'}}),null);
 assert.equal(state.sanitize({...packet,v51:{...v51,pk:{0:1}}}),null);
 assert.equal(state.sanitize({...packet,v51:{...v51,pk:{1:5}}}),null);
 assert.equal(state.sanitize({...packet,v51:{...v51,p:{2:1.1}}}),null);
 assert.equal(state.sanitize({...packet,v51:{...v51,con:[0,0]}}),null);
});
