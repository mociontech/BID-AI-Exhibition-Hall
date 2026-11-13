/* User-supplied PredictToDo information artwork, shared by controller and TV. */
(function(){
  // «About the project» infographic supplied on 13 Nov 2026, v2 with the GitHub QR in the blue panel (English PNG, 1920 × 1080)
  // and the same sheet with its content erased: the TV assembles the first from crops laid
  // over the second (insights.js → sheet), so the finished frame is the supplied PNG.
  const INFO_SHEET=Object.freeze({
    image:'projects/02-bogota-traffic-prediction/assets/PredictToDo_Infographic_2026-11-v2_1920x1080.png',
    base:'projects/02-bogota-traffic-prediction/assets/PredictToDo_Infographic_2026-11-v2_base.png'
  });
  // Both interface languages use that exact artwork; the UI stays bilingual.
  const INFO_IMAGES=Object.freeze({es:INFO_SHEET.image,en:INFO_SHEET.image});
  const SATELLITE_MAP_IMAGE='/assets/img/predicttodo/PredictToDo_Mapa_Satelital_Simulado.png';
  function infoImagePath(language){return INFO_IMAGES[language==='es'?'es':'en'];}
  // Compatibility helpers keep the generic display receiver small while all
  // topic navigation is retired in favour of the single approved infographic.
  function screen(){return {index:1,labels:{es:'Información',en:'Information'}};}
  function imagePath(index,language){return infoImagePath(language);}
  if(typeof Image!=='undefined'){
    const satelliteImage=new Image();
    satelliteImage.src=SATELLITE_MAP_IMAGE;
  }
  window.BOGOTA_TRAFFIC=Object.freeze({INFO_SHEET,INFO_IMAGES,SATELLITE_MAP_IMAGE,infoImagePath,screen,imagePath});
})();
