/* Prepare source-of-truth states for a Figma export. Does not modify Figma. */
const fs=require('node:fs'),path=require('node:path');
const schema=require('../state.js');
const frames=[];
const definitions=[
 ['Tablet','Main Screen',false,'landing',schema.fresh(false)],
 ['Tablet','Information state',false,'cta',schema.fresh(true)],
 ['Tablet','Mini-game state',false,'game',{...schema.fresh(true),phase:'follow',topic:0,situation:0}],
 ['TV','Main Screen',true,'landing',schema.fresh(false)],
 ['TV','Information',true,'info',schema.fresh(true)],
 ['TV','Mini-game',true,'game',{...schema.fresh(true),phase:'follow',topic:0,situation:0}],
 ['TV','Results or Final message',true,'game',{...schema.fresh(true),phase:'complete',topic:0,situation:0,follow:0}]
];
for(const [device,title,readonly,mode,game] of definitions)for(const language of ['es','en']){
 if(!schema.sanitize(game))throw Error('Invalid design state');
 const index=frames.length;
 frames.push({name:`${device} / ${title} — ${language.toUpperCase()}`,width:1920,height:1080,x:(index%2)*2120,y:Math.floor(index/2)*1280,readonly,state:{projectId:'05',view:mode==='game'?'game':'project',mode,language,section:mode,screenIndex:null,game}});
}
const brief={
 status:'prepared-locally-not-created-in-figma',
 project:'05 — Profe Gabi',fileKey:'6WCZLX7n6GHksVOfP9TKZz',pageName:'05_ProfeGabi — Editable',
 rules:{onlyNewPage:true,nativeEditableLayers:true,fullScreenRasterForbidden:true,photographsAsImageFillsOnly:true,autoLayout:['cards','buttons','headers','repeated blocks'],font:'Inter',useExistingContentOnly:true},
 components:[
  {name:'Language / ES-EN',variants:['ES active','EN active','TV read-only'],autoLayout:true},
  {name:'Navigation / Home',variants:['default','hover','pressed'],autoLayout:true},
  {name:'Navigation / Back',variants:['default','disabled'],autoLayout:true},
  {name:'Navigation / Next',variants:['default','disabled'],autoLayout:true},
  {name:'Navigation / Circular arrow',variants:['default','hover','pressed','disabled'],autoLayout:true},
  {name:'Progress / Steps',variants:['01','02','03','complete'],autoLayout:true},
  {name:'Cards / Content',variants:['default','selected','disabled'],autoLayout:true},
  {name:'Cards / Topic',variants:['lesson','classroom','wellbeing'],autoLayout:true},
  {name:'CTA / Primary',variants:['default','hover','pressed','disabled'],autoLayout:true},
  {name:'CTA / Secondary',variants:['default','hover','pressed','disabled'],autoLayout:true},
  {name:'Chat / Message',variants:['teacher','Profe Gabi','thinking','composing'],autoLayout:true},
  {name:'Information / Metric',variants:['550','8','200+','85.3%'],autoLayout:true},
  {name:'Header / BID Exhibition Hall',variants:['tablet','TV'],autoLayout:true}
 ],
 sources:['../experience.js','../module.css','../state.js','../conversations.js','../source/conversations.es.json','../source/conversations.en.json'],
 assets:{logo:'../assets/bid-logo.png',font:'../assets/fonts/Inter.ttf',photographReference:'../assets/references/reference-01.jpg',heroCrop:{x:660,y:100,width:555,height:410},informationCardCrop:{x:430,y:520,width:260,height:210},referenceImageSize:{width:1600,height:900}},
 notes:[
  'Information state on tablet represents the unlocked CTA after 10 seconds; main screen represents the initial disabled game card.',
  'Mini-game frames use the first lesson-planning situation with two follow-up options; TV shows its corresponding scripted conversation.',
  'TV frames preserve the implemented read-only navigation/language indicators; do not add touchscreen controls to the TV.',
  'The repository has no game score: progress and the final takeaway replace any invented numeric score.',
  'Next is a requested library component; do not insert a new Next action into an implemented flow that does not contain it.',
  'Verify every frame and component in the actual Figma document after connection; local preparation is not proof of Figma editability.'
 ],
 pendingContent:[],optionalAssetImprovements:['Independent high-resolution originals of the teacher photographs; the approved reference crops are currently available.'],
 frames
};
fs.writeFileSync(path.join(__dirname,'frames.json'),JSON.stringify(brief,null,2));
console.log(`Prepared ${frames.length} frames for ${brief.pageName}; Figma has not been modified.`);
