/**
 * Local-only exhibition prototype server (no external packages).
 * Syncs three independent tablet/display pairs on the same LAN.
 * Does NOT secure this API for use on an untrusted/public network.
 */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const PORT=Number(process.env.PORT||4173);
const HOST=process.env.HOST||'0.0.0.0';
const ROOT=__dirname;
const MIME={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.ico':'image/x-icon'};
const stations={
  1:{stationId:1,view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null},
  2:{stationId:2,view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null},
  3:{stationId:3,view:'home',projectId:null,section:null,language:null,mode:null,screenIndex:null,game:null}
};
function sendJson(res,code,data){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Access-Control-Allow-Origin':'*'});res.end(JSON.stringify(data));}
function stationParam(url){const num=Number(url.searchParams.get('station'));return [1,2,3].includes(num)?num:1;}
const server=http.createServer((req,res)=>{
 let url;
 try{url=new URL(req.url,'http://localhost');}catch{return sendJson(res,400,{error:'Bad URL'});}
 if(url.pathname==='/api/state'){
  const station=stationParam(url);
  if(req.method==='GET')return sendJson(res,200,stations[station]);
  if(req.method!=='POST')return sendJson(res,405,{error:'Method not allowed'});
  let buffer='';
  req.on('data',chunk=>{buffer+=chunk;if(buffer.length>10000)req.destroy();});
  req.on('end',()=>{
   try{
    const payload=JSON.parse(buffer);
    if(!['home','project','overview','game'].includes(payload.view))return sendJson(res,400,{error:'Invalid view'});
    if(payload.projectId!==null && payload.projectId!==undefined && !/^(0[1-9]|1[01])$/.test(payload.projectId))return sendJson(res,400,{error:'Invalid project'});
    if(payload.language!==undefined && !['es','en',null].includes(payload.language))return sendJson(res,400,{error:'Invalid language'});
    if(payload.mode!==undefined && !['landing','overview','info','cta','game',null].includes(payload.mode))return sendJson(res,400,{error:'Invalid mode'});
    if(payload.screenIndex!==undefined && payload.screenIndex!==null && (!Number.isInteger(payload.screenIndex)||payload.screenIndex<1||payload.screenIndex>9))return sendJson(res,400,{error:'Invalid screen index'});
    let game=null;
    if(payload.game!==undefined&&payload.game!==null){
     if(payload.projectId==='02'){
      const value=payload.game;
      const phases=['intro','player','explore','decision','result','final'];
      const players=['valentina','camila','santiago','andres'];
      const actions=['signals','reversible','agents','monitor'];
      if(typeof value!=='object'||!phases.includes(value.phase)||!Number.isInteger(value.scenarioIndex)||value.scenarioIndex<0||value.scenarioIndex>3||!Number.isInteger(value.hour)||value.hour<0||value.hour>23||!players.includes(value.playerId))return sendJson(res,400,{error:'Invalid PredictToDo game state'});
      if(typeof value.playerName!=='string'||value.playerName.length>40)return sendJson(res,400,{error:'Invalid PredictToDo player'});
      if(value.actionId!==null&&value.actionId!==undefined&&!actions.includes(value.actionId))return sendJson(res,400,{error:'Invalid PredictToDo action'});
      const results=value.results&&typeof value.results==='object'?value.results:{};
      const cleanResults={};
      for(const [key,score] of Object.entries(results)){
       if(!/^(0|1|2|3)$/.test(key)||!Number.isInteger(score)||score<0||score>100)return sendJson(res,400,{error:'Invalid PredictToDo scores'});
       cleanResults[key]=score;
      }
      game={phase:value.phase,playerId:value.playerId,playerName:value.playerName,hour:value.hour,scenarioIndex:value.scenarioIndex,actionId:value.actionId||null,results:cleanResults};
     }else{
      if(typeof payload.game!=='object'||!Number.isInteger(payload.game.step)||payload.game.step<1||payload.game.step>6)return sendJson(res,400,{error:'Invalid game state'});
      const cleanSelection=value=>Array.isArray(value)&&value.length<=3&&value.every(id=>/^A-0[1-8]$/.test(id))?[...new Set(value)]:null;
      const p1=cleanSelection(payload.game.p1),p2=cleanSelection(payload.game.p2);
      if(!p1||!p2)return sendJson(res,400,{error:'Invalid game selections'});
      const result=value=>Number.isInteger(value)&&value>=0&&value<=3?value:null;
      const p1Result=result(payload.game.p1),p2Result=result(payload.game.p2);
      if(p1Result===null||p2Result===null)return sendJson(res,400,{error:'Invalid game results'});
      game={step:payload.game.step,p1,p2,p1Result,p2Result};
     }
    }
    stations[station]={stationId:station,view:payload.view,projectId:payload.projectId??null,section:typeof payload.section==='string'?payload.section:null,language:payload.language==='en'?'en':payload.language==='es'? 'es':null,mode:payload.mode||null,screenIndex:payload.screenIndex??null,game,updatedAt:Date.now()};
    sendJson(res,200,{ok:true,station});
   }catch{return sendJson(res,400,{error:'Invalid JSON'});}
  });return;
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return sendJson(res,405,{error:'Method not allowed'});
 let requested;
 try{requested=decodeURIComponent(url.pathname);}catch{return sendJson(res,400,{error:'Invalid encoding'});}
 if(requested.includes('\0')||requested.includes('\\'))return sendJson(res,403,{error:'Forbidden'});
 let file=path.resolve(ROOT,'.'+(requested==='/'?'/index.html':requested));
 if(file!==ROOT&&!file.startsWith(ROOT+path.sep))return sendJson(res,403,{error:'Forbidden'});
 fs.stat(file,(err,stat)=>{
  if(err||!stat.isFile())return sendJson(res,404,{error:'Not found'});
  const extension=path.extname(file);
  res.writeHead(200,{'Content-Type':MIME[extension]||'application/octet-stream','Cache-Control':['.html','.js','.css'].includes(extension)?'no-store':'public, max-age=60'});
  if(req.method==='HEAD')return res.end();
  fs.createReadStream(file).pipe(res);
 });
});
server.listen(PORT,HOST,()=>{
 console.log(`\nAI Exhibition Hall — local station server at http://localhost:${PORT}`);
 console.log('Stations:');
 console.log(`  STATION 1 Tablet  http://localhost:${PORT}/?station=1  | Display http://localhost:${PORT}/display.html?station=1`);
 console.log(`  STATION 2 Tablet  http://localhost:${PORT}/?station=2  | Display http://localhost:${PORT}/display.html?station=2`);
 console.log(`  STATION 3 Tablet  http://localhost:${PORT}/?station=3  | Display http://localhost:${PORT}/display.html?station=3`);
 for(const list of Object.values(os.networkInterfaces()))for(const item of list||[])if(item.family==='IPv4'&&!item.internal)console.log(`  LAN address: http://${item.address}:${PORT}`);
 console.log('');
});
