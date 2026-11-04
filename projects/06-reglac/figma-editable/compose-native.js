const COMP={};await Promise.all(Object.entries(MAP.components).map(async([k,id])=>COMP[k]=await figma.getNodeByIdAsync(id)));
const names=['Tablet / Main Screen','Tablet / Information state','Tablet / Mini-game state','TV / Main Screen','TV / Information','TV / Mini-game','TV / Results or Final message'];
if(page.children.some(n=>n.name==='Tablet / Main Screen — ES'))throw Error('Frames exist; inspect saved ledger instead of duplicating');
function kicker(parent,str,w=1200){return text(parent,'Eyebrow',str,17,'blue','Semi Bold',w);}
function heading(parent,title,sub=null,size=60){const top=box(parent,'Title / hierarchy',1748,sub?134:104,'VERTICAL',null,0,10);kicker(top,'06  /  AI IN ACTION');text(top,'Title',title,size,'ink','Bold',1660);if(sub)text(top,'Description',sub,26,'muted','Regular',1660);return top;}
function progress(parent,w){return instance(parent,'Progress / Step=03','Organize / scan / identify',600,48,{'Step 1':w.phases[0],'Step 2':w.phases[1],'Step 3':w.phases[2]});}
function artwork(parent,w,width=812,height=560){const wrap=box(parent,'Regulatory illustration',width,height,'VERTICAL','blue');radius(wrap,16);const art=instance(wrap,'illustration','Six documents / native vectors',width,height);const cap=box(wrap,'Illustration caption',width-48,36,'HORIZONTAL',null,0,12);cap.layoutPositioning='ABSOLUTE';cap.x=24;cap.y=20;cap.counterAxisAlignItems='CENTER';icon(cap,'layers',20,'white');text(cap,'Caption',w.artLabel,15,'white','Semi Bold',width-110);const badge=box(wrap,'AI and human validation',330,46,'HORIZONTAL','white',12,10);badge.layoutPositioning='ABSOLUTE';badge.x=24;badge.y=height-70;radius(badge,8);badge.counterAxisAlignItems='CENTER';icon(badge,'chip',24);text(badge,'Badge',w.badge,18,'ink','Medium',260);return wrap;}
function main(body,w,lang,informationState){
 const hero=box(body,'Project introduction',1748,informationState?488:574,'HORIZONTAL',null,0,64);const copy=box(hero,'Hero / native editable copy',860,informationState?488:574,'VERTICAL',null,0,20);copy.primaryAxisAlignItems='CENTER';kicker(copy,'06  /  AI IN ACTION',800);
 const title=box(copy,'RegLAC title',850,180,'HORIZONTAL',null,0,0);const reg=text(title,'Reg','Reg',156,'ink','Extra Bold',272);reg.letterSpacing={unit:'PERCENT',value:-7};const lac=text(title,'LAC','LAC.',156,'blue','Extra Bold',530);lac.letterSpacing={unit:'PERCENT',value:-7};
 text(copy,'Project description',w.description,30,'muted','Regular',790);const note=box(copy,'Human decision note',810,42,'HORIZONTAL',null,0,14);note.counterAxisAlignItems='CENTER';icon(note,'people',26);text(note,'Human decision',w.human,20,'ink','Regular',760);
 artwork(hero,w,824,informationState?488:574);
 const row=box(body,'Information and game cards',1748,190,'HORIZONTAL',null,0,24);
 instance(row,'Content Card / State=Default','01 / '+w.info,862,190,{Index:'01',Title:w.info,Description:w.infoBody});
 instance(row,'Content Card / State='+ (informationState?'Selected':'Locked'),'02 / '+w.game,862,190,{Index:'02',Title:w.game,Description:w.gameBody});
 if(informationState){const status=box(body,'Information state / unlocked after 10 seconds',1748,76,'HORIZONTAL','tint',16,24);status.counterAxisAlignItems='CENTER';status.primaryAxisAlignItems='SPACE_BETWEEN';text(status,'Availability',w.available,24,'ink','Semi Bold',1110);instance(status,'CTA Primary / State=Default','Start minigame',470,56,{Label:w.cta});}
}
function information(body,w){
 const top=box(body,'Information introduction',1748,164,'HORIZONTAL',null,0,64);const left=box(top,'Title block',960,164,'VERTICAL',null,0,16);kicker(left,'06  /  AI IN ACTION',930);text(left,'Information title',w.infoTitle,84,'ink','Bold',950);text(top,'Subtitle',w.infoSubtitle,34,'muted','Regular',724);
 const cols=box(body,'Five information blocks',1748,418,'HORIZONTAL',null,0,24);
 w.infoItems.forEach(([title,desc],i)=>{const item=instance(cols,'Information Card / State=Default','0'+(i+1)+' / '+title,330.4,418,{Title:title,Body:desc});});
 const evidence=box(body,'Human validation / key message',1748,164,'HORIZONTAL','ink',32,30);radius(evidence,12);evidence.counterAxisAlignItems='CENTER';icon(evidence,'people',64,'tint');const copy=box(evidence,'Editable key message',1570,110,'VERTICAL',null,0,12);text(copy,'Supporting note',w.infoNote,19,'tint','Medium',1530);text(copy,'Key message',w.evidence,37,'white','Semi Bold',1530);
}
function mini(body,w,lang,device){
 const top=box(body,'Mini-game heading',1748,112,'HORIZONTAL',null,0,24);const titles=box(top,'Game title',1440,112,'VERTICAL',null,0,12);kicker(titles,'06  /  RegLAC / '+w.game,1400);text(titles,'Confirmation title',w.confirm,54,'ink','Bold',1420);const clock=box(top,'Elapsed clock / editable session value',284,105,'VERTICAL',null,0,2);text(clock,'Time label',w.time,18,'muted','Medium',250);text(clock,'Elapsed time',Math.floor(DATA.sessionTimes[1]/1000).toString().padStart(2,'0')==='00'?'00:00':'00:'+String(Math.floor(DATA.sessionTimes[1]/1000)).padStart(2,'0'),48,'blue','Semi Bold',260);
 text(body,'Mission',w.confirmBody,26,'muted','Regular',1748);
 if(device==='TV')progress(body,w);
 const workspace=box(body,'Documents and controls',1748,device==='TV'?548:584,'HORIZONTAL',null,0,24);
 const boardW=device==='TV'?1748:1236,board=box(workspace,'Document board',boardW,device==='TV'?548:584,'VERTICAL',device==='TV'?'ink':'pale',20,12);radius(board,12);
 const label=box(board,'Board header',boardW-40,26,'HORIZONTAL',null,0,12);icon(label,'layers',20,device==='TV'?'tint':'blue');text(label,'Documents label',w.documentsLabel,17,device==='TV'?'tint':'muted','Semi Bold',boardW-100);
 const columns=device==='TV'?3:2,rows=device==='TV'?2:3,cardW=(boardW-40-(columns-1)*20)/columns,cardH=device==='TV'?214:144;
 for(let r=0;r<rows;r++){const row=box(board,'Document row '+(r+1),boardW-40,cardH,'HORIZONTAL',null,0,20);for(let c=0;c<columns;c++){const i=r*columns+c,[title,req]=DATA.documents[lang][1][i],id=String.fromCharCode(65+i),selected=['B','D'].includes(id);const values={ID:'DOC '+id,Title:title};if(device==='TV')values.Requirement=req;const card=instance(row,'Document Card / Device='+device+', State='+ (selected?'Selected':'Default'),'DOC '+id+' / '+title,cardW,cardH,values);if(device==='TV'&&selected){const reqNode=card.findAllWithCriteria({types:['TEXT']}).find(n=>n.name==='Requirement');if(reqNode)reqNode.fills=[paint('blue')];}}}
 if(device==='Tablet'){
  const panel=box(workspace,'Human confirmation controls',488,584,'VERTICAL','white',28,14);radius(panel,12);stroke(panel);kicker(panel,w.roundLabel+' 02 / 02',425);text(panel,'Confirm mission',w.confirmBody,28,'ink','Bold',422);text(panel,'Instruction',w.readScreen,20,'muted','Regular',422);
  const count=box(panel,'Selected count',420,95,'VERTICAL',null,0,4);text(count,'Count','2 / 2',42,'blue','Semi Bold',400);text(count,'Selected label',w.selectionLabel,17,'muted','Regular',400);
  instance(panel,'CTA Primary / State=Default','Confirm finding',430,64,{Label:w.confirmAction});text(panel,'Human note',w.human,15,'muted','Regular',420);
 }else{
  const link=box(board,'Relationship B to D',boardW-40,28,'HORIZONTAL',null,0,12);link.primaryAxisAlignItems='CENTER';icon(link,'link',22,'tint');text(link,'Relationship',w.matchLabel,18,'white','Semi Bold',530);
 }
 text(body,'Simulation disclosure',w.simulation,15,'muted','Regular',1748);
}
function results(body,w){
 heading(body,w.results);
 const row=box(body,'Comparison / session results',1748,500,'HORIZONTAL',null,0,24);
 [0,1].forEach(r=>{const c=box(row,r?'Assisted review':'Manual review',862,500,'VERTICAL',r?'blue':'white',36,22);radius(c,12);if(!r)stroke(c);text(c,'Round',w.roundLabel+' 0'+(r+1),17,r?'tint':'muted','Semi Bold',790);text(c,'Review type',r?w.with:w.without,44,r?'white':'ink','Bold',790);const total=Math.floor(DATA.sessionTimes[r]/1000),time=String(Math.floor(total/60)).padStart(2,'0')+':'+String(total%60).padStart(2,'0');text(c,'Measured session time',time,112,r?'white':'ink','Semi Bold',790);text(c,'Review description',r?w.aiResult:w.manualResult,25,r?'white':'muted','Regular',790);text(c,'Selection outcome',w.success,21,r?'white':'muted','Medium',790);});
 text(body,'Time interpretation',w.timing,19,'muted','Regular',1748);
 const msg=box(body,'Final human validation message',1748,106,'HORIZONTAL','tint',24,20);msg.counterAxisAlignItems='CENTER';icon(msg,'people',42);text(msg,'Final message',w.closing,26,'ink','Regular',1610);
}
const frames=[];
for(let row=0;row<names.length;row++)for(let col=0;col<2;col++){
 const lang=col?'en':'es',label=col?'EN':'ES',name=names[row]+' — '+label,w=DATA.words[lang];
 const frame=box(page,name,1920,1080,'VERTICAL','background');frame.x=200+col*2120;frame.y=200+row*1280;frame.clipsContent=true;
 instance(frame,'Header / Language='+label,'Header / BID AI in Action',1920,104);
 const body=box(frame,'Content / native editable layout',1920,888,'VERTICAL',null,0,24);body.paddingTop=32;body.paddingBottom=24;body.paddingLeft=86;body.paddingRight=86;
 if([0,1,3].includes(row))main(body,w,lang,row===1);
 else if(row===4)information(body,w);
 else if([2,5].includes(row)){gap(body,16);mini(body,w,lang,row===2?'Tablet':'TV');}
 else results(body,w);
 const stage=[0,3].includes(row)?w.mainStage:[1,4].includes(row)?w.informationStage:w.game;
 const step=[0,3].includes(row)?'01':[1,4].includes(row)?'02':row===6?'07':'06';
 const foot=instance(frame,'Footer / Language='+label,'Footer / navigation',1920,88,{Breadcrumb:'/  AI in Action  /  RegLAC  /  '+stage,Progress:step+' / 09'});
 if(row>=3){for(const i of foot.findAllWithCriteria({types:['INSTANCE']}))if(['Home','Back','Next'].includes(i.name))i.opacity=.55;}
 frames.push({id:frame.id,name,width:frame.width,height:frame.height,url:'https://www.figma.com/design/6WCZLX7n6GHksVOfP9TKZz?node-id='+frame.id.replace(':','-')});
}
const headline=text(page,'06 / Handoff note','06 · RegLAC — Editable\n14 frames · 1920 × 1080 · ES / EN\nMinijuego: confirmación de ronda 2. Resultados: tiempos reales de la prueba local.\nContenido e identidad: projects/06-reglac. Componentes a la derecha.',26,'ink','Semi Bold',4000);headline.x=200;headline.y=-60;
const nodes=page.findAll(()=>true);const types={};for(const n of nodes)types[n.type]=(types[n.type]||0)+1;
return {pageId:page.id,frames,createdNodeIds:[...new Set([...created,...frames.flatMap(f=>{const n=page.findOne(x=>x.id===f.id);return n.findAll(()=>true).map(x=>x.id);})])],nodeTypes:types,fontFamilies:[...new Set(nodes.filter(n=>n.type==='TEXT').map(n=>n.fontName.family))],imageNodes:nodes.filter(n=>Array.isArray(n.fills)&&n.fills.some(f=>f.type==='IMAGE')).map(n=>({id:n.id,name:n.name,type:n.type,width:n.width,height:n.height})),nativeTextCount:types.TEXT};
