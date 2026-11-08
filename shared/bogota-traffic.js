/* User-supplied PredictToDo information artwork, shared by controller and TV. */
(function(){
  const INFO_IMAGES=Object.freeze({
    // The replacement supplied by the client is a single English PNG.
    // Both interface languages use that exact artwork; the UI stays bilingual.
    es:'projects/02-bogota-traffic-prediction/assets/PredictToDo_Infographic_Challenge_Solution_1920x1080.png',
    en:'projects/02-bogota-traffic-prediction/assets/PredictToDo_Infographic_Challenge_Solution_1920x1080.png'
  });
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
  window.BOGOTA_TRAFFIC=Object.freeze({INFO_IMAGES,SATELLITE_MAP_IMAGE,infoImagePath,screen,imagePath});
})();
