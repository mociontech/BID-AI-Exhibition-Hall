/* Presentation only. Figma (page 08_RISE) paints part of some TV headings in IDB blue and
   forces one line break in the opening notice. The v36 source renders those headings as a
   single text node, so this adapter wraps the second part in <em> (or <span class="fgl">)
   before each translation pass. Copy is untouched: head + " " + tail is always the original
   sentence, in English and in Spanish, and every part goes through the source i18n table. */
(function(){
 var RULES=[
  /* selector, EN head, EN tail, ES head, ES tail, wrapper */
  ['.opn-sim h1','You are entering a','simplified simulated experience','Vas a entrar a una','experiencia simulada y simplificada','em'],
  ['.opn-sim p','Illustrative flows and fictional deals.','They do not reflect real flows or real data.','Flujos ilustrativos y operaciones ficticias.','No reflejan flujos ni datos reales.','span'],
  ['.ficha .H','Every investment decision starts','with hundreds of documents','Toda decisión de inversión comienza','con cientos de documentos','em'],
  ['.scene h3','Three new investment proposals have just landed.','Choose one to review.','Acaban de llegar tres nuevas propuestas de inversión.','Elige una para revisar.','em'],
  ['.mh','Manual vs. RISE,','in parallel','Manual vs. RISE,','en paralelo','em'],
  ['.mh','Risk Analysis','with RISE','Análisis de riesgo','con RISE','em'],
  ['.mh','Early alert','detection','Detección temprana','de alertas','em'],
  ['.flow .k','What','happens next','Lo que','sigue','em']
 ];
 var PAGES=/^(\d+) pages to review\.$/, PAGES_ES=/^(\d+) páginas por revisar\.$/;
 var START='Where does a risk officer start?', START_ES='¿Por dónde empieza un oficial de riesgo?';
 RULES.forEach(function(r){[[r[1],r[3]],[r[2],r[4]]].forEach(function(p){if(!Object.prototype.hasOwnProperty.call(ES,p[0]))ES[p[0]]=p[1];});});
 if(!Object.prototype.hasOwnProperty.call(ES,START))ES[START]=START_ES;
 ES['Hundreds of']='Cientos de';ES['pages per deal']=ES['pages per operation']='páginas por operación';
 var baseExtra=typeof I18N_EXTRA==='function'?I18N_EXTRA:null;
 I18N_EXTRA=function(x,t){var m=x.match(PAGES);if(m)return m[1]+' páginas por revisar.';return baseExtra?baseExtra(x,t):null;};

 function split(el,head,tail,tag,origHead,origTail){
  var a=document.createTextNode(head+' '),w=document.createElement(tag),b=document.createTextNode(tail);
  if(tag==='span')w.className='fgl';
  w.appendChild(b);el.textContent='';el.appendChild(a);el.appendChild(w);
  /* Already translated when found: register both parts so EN can be restored. */
  if(origHead){I18N_MAP.set(a,{orig:origHead+' ',tr:head+' '});I18N_MAP.set(b,{orig:origTail,tr:tail});}
 }
 function mark(){
  RULES.forEach(function(r){
   tv.querySelectorAll(r[0]).forEach(function(el){
    if(el.childElementCount)return;
    var x=el.textContent.trim();
    if(x===r[1]+' '+r[2])split(el,r[1],r[2],r[5]);
    else if(x===r[3]+' '+r[4]&&r[3]+' '+r[4]!==r[1]+' '+r[2])split(el,r[3],r[4],r[5],r[1],r[2]);
   });
  });
  tv.querySelectorAll('.scene h3').forEach(function(el){
   if(el.childElementCount)return;
   var x=el.textContent.trim(),i,head;
   if(x.slice(-START.length-1)===' '+START){head=x.slice(0,-START.length-1);if(PAGES.test(head))split(el,head,START,'em');}
   else if(x.slice(-START_ES.length-1)===' '+START_ES){head=x.slice(0,-START_ES.length-1);i=head.match(PAGES_ES);if(i)split(el,head,START_ES,'em',i[1]+' pages to review.',START);}
  });
  /* Tablet, stage 1 (958:780): Figma starts the blue line one word earlier. */
  tab.querySelectorAll('.thead h3').forEach(function(el){
   var a=el.firstChild,em=el.lastChild,b=em&&em.firstChild;
   if(el.childNodes.length!==2||!a||a.nodeType!==3||em.nodeName!=='EM'||em.childNodes.length!==1||b.nodeType!==3)return;
   if(a.nodeValue==='Hundreds of pages '&&/^per (deal|operation)$/.test(b.nodeValue)){a.nodeValue='Hundreds of ';b.nodeValue='pages '+b.nodeValue;}
   else if(a.nodeValue==='Cientos de páginas '&&b.nodeValue==='por operación'){
    var o=I18N_MAP.get(b);
    a.nodeValue='Cientos de ';b.nodeValue='páginas por operación';
    I18N_MAP.set(a,{orig:'Hundreds of ',tr:'Cientos de '});I18N_MAP.set(b,{orig:'pages '+(o?o.orig:'per deal'),tr:'páginas por operación'});
   }
  });
 }
 var baseApply=i18nApply;
 i18nApply=function(){i18nObs.disconnect();mark();baseApply();};
 i18nApply();
})();
