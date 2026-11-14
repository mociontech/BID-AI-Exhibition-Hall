/* Client copy revisions: Figma comments by the IDB reviewer on page 08_RISE, 2026-11-14.
   The v36 source files stay byte-identical. This adapter edits the proposal data and swaps
   whole text nodes before each translation pass, so Spanish keeps working through ES. */
(function(){
 var own=Object.prototype.hasOwnProperty;
 /* Proposals (958:1127, 944:5526): real countries and a new title for the third one. */
 var COUNTRY=['Peru','Colombia','Mexico'];
 D.forEach(function(d,i){
  d.who=d.who.replace(/Country [A-C]$/,COUNTRY[i]);
  d.f.forEach(function(f){if(f[0]==='Country')f[1]=COUNTRY[i];});
 });
 D[2].name='Fiber-optic infrastructure expansion';

 /* English source text -> revised English text. */
 var SWAP={
  /* TV, stage 1 (955:10461) */
  'As deals grow in number, size and complexity, can risk teams keep pace without losing consistency?':'As operations grow in number, size and complexity, can risk teams read everything without losing consistency?',
  'of documents per deal: Investment Proposals, Annual Supervision Reports, aide memoires and ESG documents':'of documents per operation: Investment Proposals, Annual Supervision Reports, aide memoires and ESG documents',
  'of risk knowledge locked in unstructured documents that are hard to search':'of risk knowledge locked in unstructured documents that are difficult to sort through',
  /* TV, reading (944:5392, 944:5634) */
  'Ingest':'Read',
  /* Tablet, stage 1 (958:780) */
  'per deal':'per operation',
  'Can risk teams keep pace?':'Can risk teams read everything?',
  'Deals grow in number, size and complexity.':'Operations grow in number, size and complexity.'
 };
 Object.keys(SWAP).forEach(function(k){if(own.call(ES,k)&&!own.call(ES,SWAP[k]))ES[SWAP[k]]=ES[k];});
 ES[SWAP['As deals grow in number, size and complexity, can risk teams keep pace without losing consistency?']]='A medida que las operaciones crecen en número, tamaño y complejidad, ¿pueden los equipos de riesgo leerlo todo sin perder consistencia?';
 ES['of risk knowledge locked in unstructured documents that are difficult to sort through']='de conocimiento de riesgo repartido en archivos difíciles de revisar';
 ES['Can risk teams read everything?']='¿Pueden los equipos de riesgo leerlo todo?';
 ES['Read']='Lectura';
 ES['Peru']='Perú';ES['Colombia']='Colombia';ES['Mexico']='México';
 ES['Fiber-optic infrastructure expansion']='Expansión de infraestructura de fibra óptica';
 ES['Run simulation']='Ejecutar simulación';ES['Manual vs. RISE']='Manual vs. RISE';

 function swap(){
  [tv,tab].forEach(function(root){
   i18nWalk(root,function(n){
    var x=n.nodeValue,k=x.trim();
    if(k&&own.call(SWAP,k))n.nodeValue=x.split(k).join(SWAP[k]);
   });
  });
  /* Tablet, stage 4 (958:1188, 971:1256): "Run simulation" in black, "Manual vs. RISE" in blue. */
  tab.querySelectorAll('.thead h3').forEach(function(el){
   var a=el.firstChild,em=el.lastChild;
   if(el.childNodes.length===2&&a.nodeType===3&&a.nodeValue==='Run '&&em.nodeName==='EM'&&em.textContent==='manual and RISE'){
    a.nodeValue='Run simulation ';em.textContent='Manual vs. RISE';
   }
  });
 }
 var baseApply=i18nApply;
 i18nApply=function(){i18nObs.disconnect();swap();baseApply();};
 render();
})();
