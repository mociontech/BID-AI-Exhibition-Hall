/* AquaData's approved screen catalogue. Shared by the tablet controller and
   the independent large display so language labels and asset pairs stay in sync. */
(function(){
  const root='projects/01-aquadata/assets/';
  const screens=[
    {index:1,files:{es:'01_Pantalla_Principal.png',en:'01_Main_Screen.png'},labels:{es:'Pantalla principal',en:'Main Screen'}},
    {index:2,files:{es:'02_El_Reto.png',en:'02_The_Challenge.png'},labels:{es:'El Reto',en:'The Challenge'}},
    {index:3,files:{es:'03_Consecuencias.png',en:'03_Consequences.png'},labels:{es:'Consecuencias',en:'Consequences'}},
    {index:4,files:{es:'04_La_Solucion.png',en:'04_The_Solution.png'},labels:{es:'La Solución',en:'The Solution'}},
    {index:5,files:{es:'05_Como_Funciona.png',en:'05_How_It_Works.png'},labels:{es:'Cómo Funciona',en:'How It Works'}},
    {index:6,files:{es:'06_Beneficiarios.png',en:'06_Who_Benefits.png'},labels:{es:'Beneficiarios',en:'Who Benefits'}},
    {index:7,files:{es:'07_Resultados_Reales.png',en:'07_Real_Results.png'},labels:{es:'Resultados Reales',en:'Real Results'}},
    {index:8,files:{es:'08_Presencia_Regional.png',en:'08_Regional_Presence.png'},labels:{es:'Presencia Regional',en:'Regional Presence'}},
    {index:9,files:{es:'09_Mensaje_Final.png',en:'09_Final_Message.png'},labels:{es:'Mensaje Final',en:'Final Message'}}
  ];
  function screen(index){return screens.find(item=>item.index===Number(index))||screens[0];}
  function imagePath(index,language){const item=screen(index);const lang=language==='en'?'en':'es';return `${root}${lang}/${item.files[lang]}`;}
  function technicalSheetPath(language){
    return language==='en'
      ? 'projects/01-aquadata/ahorasi/AquaData_ Inteligencia para el Agua.png'
      : 'projects/01-aquadata/ahorasi/Infografía AquaData_ IA para el agua.png';
  }
  function gameReferencePath(step,language){
    const lang=language==='en'?'EN':'ES';
    const files=['01_Mision.jpg','02_Seleccion_Sin_IA_Negocios.jpg','03_Analisis_AquaData.jpg','04_Seleccion_Con_IA_Negocios.jpg','05_Verificacion_Resultados.jpg','06_Impacto_Real.jpg'];
    return `projects/01-aquadata/AquaData_12_Imagenes_Ligeras_JPG/${lang}/${files[Math.max(1,Math.min(6,Number(step)||1))-1]}`;
  }
  window.AQUADATA=Object.freeze({screens,screen,imagePath,technicalSheetPath,gameReferencePath});
})();
