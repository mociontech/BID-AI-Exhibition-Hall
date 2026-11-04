/* Native branding over the approved raster screens. Coordinates use each original
   image's viewBox, so artwork and accessible touch controls keep their alignment. */
(function(){
 const assetRoot=new URL('../',document.currentScript.src);
 const logo=new URL('assets/brand/idb-group.jpg',assetRoot).href;
 const profiles={
  "projects/01-aquadata/assets/en/01_Main_Screen.png":{"size":[1920,1080],"header":[65,30,650,95],"kicker":[70,175,390,40,"01 / AI in Action"],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/02_The_Challenge.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/03_Consequences.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/04_The_Solution.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/05_How_It_Works.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/06_Who_Benefits.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/07_Real_Results.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/08_Regional_Presence.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/en/09_Final_Message.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/01_Pantalla_Principal.png":{"size":[1920,1080],"header":[65,30,650,95],"kicker":[70,175,390,40,"01 / AI in Action"],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/02_El_Reto.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/03_Consecuencias.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/04_La_Solucion.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/05_Como_Funciona.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/06_Beneficiarios.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/07_Resultados_Reales.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/08_Presencia_Regional.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/assets/es/09_Mensaje_Final.png":{"size":[1920,1080],"header":[65,30,650,95],"footer":[174,1015,205,35]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/EN/01_Mision.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/EN/02_Seleccion_Sin_IA_Negocios.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/EN/03_Analisis_AquaData.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/EN/04_Seleccion_Con_IA_Negocios.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/EN/05_Verificacion_Resultados.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/EN/06_Impacto_Real.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/ES/01_Mision.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/ES/02_Seleccion_Sin_IA_Negocios.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/ES/03_Analisis_AquaData.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/ES/04_Seleccion_Con_IA_Negocios.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/ES/05_Verificacion_Resultados.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/ES/06_Impacto_Real.jpg":{"size":[1920,1080],"header":[65,22,650,90]},
  "projects/01-aquadata/ahorasi/AquaData_ Inteligencia para el Agua.png":{"size":[1672,941],"header":[43,35,460,60]},
  "projects/01-aquadata/ahorasi/Infografía AquaData_ IA para el agua.png":{"size":[1672,941],"header":[43,35,460,60]},
  "projects/02-bogota-traffic-prediction/assets/TABLET/PredictToDo_Pantalla_Inicio_EN.png":{"size":[1910,1080],"header":[65,24,650,88],"kicker":[65,183,355,43,"02 / AI in Action"],"footer":[230,991,205,40]},
  "projects/02-bogota-traffic-prediction/assets/TABLET/PredictToDo_Pantalla_Inicio_ES.png":{"size":[1910,1080],"header":[65,24,650,88],"kicker":[65,183,355,43,"02 / AI in Action"],"footer":[230,991,205,40]},
  "assets/img/predicttodo/PredictToDo_Infografia_TV_EN_1920x1080.png":{"size":[1920,1080],"header":[55,18,650,58]},
  "assets/img/predicttodo/PredictToDo_Infografia_TV_ES_1920x1080.png":{"size":[1920,1080],"header":[55,18,650,58]},
  "projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-1.png":{"size":[1672,941],"header":[55,18,620,83],"kicker":[60,162,340,40,"03 / AI in Action"],"footer":[193,878,220,29]},
  "projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_41 p.m-2.png":{"size":[1672,941],"header":[55,18,620,83],"kicker":[60,135,340,40,"03 / AI in Action"],"footer":[198,902,160,28]},
  "projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_42 p.m-3.png":{"size":[1672,941],"header":[55,18,620,83],"kicker":[60,135,340,40,"03 / AI in Action"],"footer":[198,894,157,30]},
  "projects/03-costa-rica-smart-borders/public/Imagen de ChatGPT 29 oct 2026, 03_20_42 p.m-4.png":{"size":[1672,941],"header":[55,18,620,83],"kicker":[60,162,340,40,"03 / AI in Action"],"footer":[193,878,220,29]},
  "projects/04-parque-tecnologico-guatiguara/04_Guatiguara_BID_Bilingue/04_Guatiguara_Home_EN_1920x1080.png":{"size":[1920,1080],"header":[65,24,700,86],"kicker":[70,162,340,45,"04 / AI in Action"],"footer":[176,1017,211,35]},
  "projects/04-parque-tecnologico-guatiguara/04_Guatiguara_BID_Bilingue/04_Guatiguara_Infografia_ES_1920x1080.png":{"size":[1920,1080],"header":[65,24,700,86]},
  "projects/04-parque-tecnologico-guatiguara/04_Guatiguara_BID_Bilingue/04_Guatiguara_Infographic_EN_1920x1080.png":{"size":[1920,1080],"header":[65,24,700,86]},
  "projects/04-parque-tecnologico-guatiguara/04_Guatiguara_BID_Bilingue/04_Guatiguara_Inicio_ES_1920x1080.png":{"size":[1920,1080],"header":[65,24,700,86],"kicker":[70,162,340,45,"04 / AI in Action"],"footer":[176,1017,211,35]},
  "projects/08-teachy/Public/IA para una escuela personalizada y eficiente.png":{"size":[1672,941],"header":[38,15,197,68]},
  "projects/08-teachy/Public/Imagen de ChatGPT 3 nov 2026, 12_24_11 p.m-1.png":{"size":[1672,941],"header":[69,14,640,76],"kicker":[73,129,350,39,"08 / AI in Action"],"footer":[173,878,170,28]},
  "projects/08-teachy/Public/Imagen de ChatGPT 3 nov 2026, 12_24_12 p.m-2.png":{"size":[1672,941],"header":[69,14,640,76],"kicker":[73,129,350,39,"08 / AI in Action"],"footer":[173,878,170,28]},
  "projects/08-teachy/Public/Infografía Teachy_ IA para escuelas personalizadas.png":{"size":[1672,941],"header":[38,15,197,68]}
 };
 const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 function patch(box,text,color='#6484a8'){
  const [x,y,w,h]=box;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fff"/>`+(text?`<text x="${x+7}" y="${y+h*.7}" fill="${color}" font-family="Inter,Arial,sans-serif" font-size="${h*.6}">${esc(text)}</text>`:'');
 }
 window.AI_ARTWORK=function(src,attributes='',fit='xMidYMid meet'){
  const url=new URL(src,document.baseURI);
  const key=decodeURIComponent(url.pathname.slice(assetRoot.pathname.length));
  const p=profiles[key];
  if(!p)return `<img src="${esc(src)}" ${attributes}>`;
  const [w,h]=p.size,[x,y,bw,bh]=p.header;
  let overlay=patch(p.header);
  if(bw<220){overlay+=`<image href="${logo}" x="${x+6}" y="${y+12}" width="${bw-12}" height="${bh-24}" preserveAspectRatio="xMidYMid meet"/>`;}
  else{
   const lw=bw*.31;
   overlay+=`<image href="${logo}" x="${x+12}" y="${y+8}" width="${lw}" height="${bh-16}" preserveAspectRatio="xMidYMid meet"/>
    <path d="M${x+lw+28} ${y+12}v${bh-24}" stroke="#cad7e4"/>
    <text x="${x+lw+45}" y="${y+bh*.46}" fill="#092746" font-family="Inter,Arial,sans-serif" font-size="${Math.min(30,bh*.34)}" font-weight="700">AI in Action</text>
    <text x="${x+lw+45}" y="${y+bh*.76}" fill="#315779" font-family="Inter,Arial,sans-serif" font-size="${Math.min(17,bh*.19)}">IDB Group Projects Across The Region</text>`;
  }
  if(p.kicker)overlay+=patch(p.kicker,p.kicker[4],'#009bdb');
  if(p.footer)overlay+=patch(p.footer,'AI in Action');
  const alt=attributes.match(/alt="([^"]*)"/);
  const attrs=attributes.replace(/alt="[^"]*"/,'').replace(/class="([^"]*)"/,'class="$1 brand-artwork"');
  return `<svg xmlns="http://www.w3.org/2000/svg" ${attrs} ${attributes.includes('class=')?'':'class="brand-artwork"'} viewBox="0 0 ${w} ${h}" preserveAspectRatio="${fit}" role="img" aria-label="${alt?alt[1]:'Project artwork'}" focusable="false" data-artwork="${esc(key)}"><image href="${esc(url.href)}" width="${w}" height="${h}"/>${overlay}</svg>`;
 };
})();
