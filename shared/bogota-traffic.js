/* Approved PredictToDo information artwork shared by the tablet controller
   and the independent TV receiver. No individual topic deck is active. */
(function(){
  const INFO_IMAGES=Object.freeze({
    es:'assets/img/predicttodo/PredictToDo_Infografia_TV_ES_1920x1080.png',
    en:'assets/img/predicttodo/PredictToDo_Infografia_TV_EN_1920x1080.png'
  });
  const SATELLITE_MAP_IMAGE='/assets/img/predicttodo/PredictToDo_Mapa_Satelital_Simulado.png';
  function infoImagePath(language){return INFO_IMAGES[language==='en'?'en':'es'];}
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
