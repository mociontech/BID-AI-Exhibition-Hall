const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../projects/07-csd-maiia/state.js'),C=require('../projects/07-csd-maiia/data/demo-maps.json');
test('MAIIA preserves a shared territory camera start and accepts older sessions',()=>{
 const game={...S.fresh(),phase:'manual',easyScore:0,territoryAt:123456};
 assert.equal(S.sanitize(game,C).territoryAt,123456);
 delete game.territoryAt;assert.equal(S.sanitize(game,C).territoryAt,0);
 for(const value of [-1,NaN,1.2,'now'])assert.equal(S.sanitize({...game,territoryAt:value},C),null);
});
