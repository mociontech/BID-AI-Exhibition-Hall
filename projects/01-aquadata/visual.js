/* AquaData shared visual shell (project 01). Renders the branded tablet screens (interactive)
   and the TV guide screens (context, animations and a call to action per stage). */
(function(){
 const base=new URL('./',document.currentScript.src);
 const url=rel=>new URL(rel,base).href;
 const logo=url('aquadata/idb-group-white.svg');
 /* Landing artwork from the Figma rebrand: the video and project cards carry a photo, the game card an icon. */
 const landingArt={video:url('aquadata/card-video.png'),about:url('aquadata/card-about.png')};
 const dataRoot=url('AquaData_12_Imagenes_Ligeras_JPG/');
 const MAX_PICKS=3;
 /* Game steps: 1 mission, 2 blind round, 3 blind result, 4 how the score works, 5 analysis,
    6 round with AquaData, 7 comparison, 8 real case. The header shows them as six chapters. */
 const LAST_STEP=8,ANALYSIS_STEP=5;
 const CHAPTER=[0,1,2,2,3,3,4,5,6];
 /* Example contract for the explainer: not one of the eight, so it gives nothing away. */
 const SAMPLE={series:[52,50,54,51,22,14,12],risk:88};
 /* Real EMCALI figures (documented case). Kept apart from the simulated game outcomes. */
 const EMCALI={reference:1.4,withAquaData:11.6};
 const copy={
  en:{
   brand:'AI in Action',brandSub:'IDB Group Projects Across the Region',home:'Home',station:'Station',onTablet:'On the tablet',
   kicker:'VPS · INE',intro:'Artificial intelligence to help decide which water accounts to inspect first.',
   info:'About the project',infoBody:'Explore the challenge, the solution, how AI works and its impact.',
   video:'Video',videoBody:'Watch the video to see AquaData in action and discover how it transforms inspection workflows.',
   game:'Interactive experience',gameBody:'Choose which accounts to inspect before and after AI prioritization.',
   entered:"You've entered the interactive experience",
   back:'Back',next:'Start',continue:'Continue',confirm:'Confirm inspections',pick:'Tap 3 accounts',again:'Play again',menu:'Back to menu',
   watch3:'Watch the analysis on the big screen',watch5:'See the findings on the main screen',watch6:'Watch the real case on the big screen',
   f1Kicker:'Round 1 · Result',f1Of:'out of 3 cases found.',f1Body:'That’s how a random inspection works.',f1Next:'See how AI does it',
   e1Kicker:'How AI does it',e1Title:'How AI reads',e1Accent:'each account',e1ScoreHead:'Risk score:',e1ScoreBody:'how likely fraud is',e1Body:'Each card now displays the consumption history and the score calculated by the model.',e1Ok:'Got it',sample:'Example',
   s1Kicker:'Your mission',s1Title:'Can you uncover',s1Accent:'water fraud?',s1Body:'Some accounts hide irregularities. You have two rounds to find them.',watch1:'The instructions are on the screen',s1Go:'Choose 3 accounts blind',s1Menu:'Choose another option',
   s1Contracts:'Contracts',s1ContractsBody:'on the water network',s1Visits:'Inspections',s1VisitsBody:'per round',s1Rounds:'Rounds',s1RoundsBody:'blind, then with AI',
   s2Kicker:'Round 1 · Decision without data',s2Title:'Select without',s2Accent:'artificial intelligence',s2Body:'8 customers in a water network. Some of them are hiding fraud.',
   s4Kicker:'Round 2 · With AquaData',s4Title:'Now choose',s4Accent:'using risk scores',s4Body:'Each card displays its risk score. Choose 3.',
   selected:'Selected inspections',risk:'Risk',
   s3Kicker:'How AI thinks',s3Title:'How AquaData',s3Accent:'analyzes',s3Body:'The model reads each contract’s consumption and estimates how likely an inspection is to find an irregularity.',
   s3Phases:['Gathers data','Reads consumption','Detects patterns','Calculates and ranks'],s3Sources:['Billing','Meter readings','Inspections'],s3Trend:'Consumption',
   s3Inputs:[['Consumption history','Monthly readings and evolution'],['Billing','Company records'],['Past inspections','Known outcomes']],
   s3Model:'AquaData · Analysis Agent',s3Working:'Analyzing accounts…',s3Done:'Scores ready',s3Play:'Play on screen',s3NextAct:'Next step',s3Prev:'Previous step',s3Replay:'Replay',s3Intro:'Four steps for reading the 8 accounts.',s3Rank:'RIR risk ranking',s3RankBody:'Suggested inspection order',
   s3Note:'A high score is not proof of fraud. The inspector verifies it in the field.',
   s5Kicker:'The result',s5Title:'Same accounts.',s5Accent:'A different perspective.',s5Body:'This is what the field team found in each round.',s5Without:'Without AI',s5With:'With AquaData',
   found:'Irregularity',clear:'Nothing found',
   s5NoteMore:'In a real city, that difference means inspections that aren’t wasted and water that is actually recovered.',
   s5NoteSame:'A tie this round. AI improves the average, not every visit.',
   s5NoteLess:'Your intuition won this time. AI improves the average, not every visit.',
   s6Kicker:'Real case · EMCALI, Cali',s6Title:'Real',s6Accent:'Impact',s6Body:'A real example demonstrates the value of prioritising inspections.',
   s6Reference:'Before',s6With:'With AquaData',s6Metric:'Detection rate in field test',
   s6Quote:'Artificial intelligence does not replace the inspector. It helps them know where to start.',s6QuoteBody:'With the same field capacity, a prioritised list can help find more irregularities.',
   s6Source:'Source: AquaData fact sheet, data presented at ANDESCO (September 2026).',simulation:'Educational simulation · fictitious data',
   cta:{1:'Press “Next” on the tablet to start the mission',2:'Choose 3 contracts on the tablet, then confirm',2.5:'Press “Confirm inspections” on the tablet',3:'AquaData is analysing. Press “Continue” on the tablet',4:'Now use the risk scores: choose 3 contracts and confirm',5:'Compare both rounds. Press “Continue” on the tablet',6:'Play again or return to the menu from the tablet'}
  },
  es:{
   brand:'AI in Action',brandSub:'IDB Group Projects Across the Region',home:'Inicio',station:'Estación',onTablet:'En la tableta',
   kicker:'VPS · INE',intro:'Inteligencia artificial para decidir qué contratos de agua inspeccionar primero.',
   info:'Sobre el proyecto',infoBody:'Explora el reto, la solución, cómo funciona la IA y su impacto.',
   video:'Video',videoBody:'Mira el video para ver AquaData en acción y descubrir cómo transforma el trabajo de inspección.',
   game:'Experiencia interactiva',gameBody:'Elige qué contratos inspeccionar antes y después de la priorización con IA.',
   entered:'Has entrado a la experiencia interactiva',
   back:'Volver',next:'Comenzar',continue:'Continuar',confirm:'Confirmar inspecciones',pick:'Toca 3 contratos',again:'Jugar de nuevo',menu:'Volver al menú',
   watch3:'Mira el análisis en la pantalla grande',watch5:'Mira los hallazgos en la pantalla grande',watch6:'Mira el caso real en la pantalla grande',
   f1Kicker:'Ronda 1 · Resultado',f1Of:'de 3 casos encontrados.',f1Body:'Así funciona una inspección al azar.',f1Next:'Ver cómo lo hace la IA',
   e1Kicker:'Cómo lo hace la IA',e1Title:'Así lee la IA',e1Accent:'cada contrato',e1ScoreHead:'Puntaje de riesgo:',e1ScoreBody:'qué tan probable es que haya fraude',e1Body:'Cada tarjeta ahora muestra el historial de consumo y el puntaje que calcula el modelo.',e1Ok:'Entendido',sample:'Ejemplo',
   s1Kicker:'Tu misión',s1Title:'¿Puedes encontrar',s1Accent:'el fraude de agua?',s1Body:'Algunos contratos esconden irregularidades. Tienes dos rondas para encontrarlos.',watch1:'Las instrucciones están en la pantalla',s1Go:'Elige 3 contratos a ciegas',s1Menu:'Elegir otra opción',
   s1Contracts:'Contratos',s1ContractsBody:'en la red de agua',s1Visits:'Inspecciones',s1VisitsBody:'por ronda',s1Rounds:'Rondas',s1RoundsBody:'a ciegas y con IA',
   s2Kicker:'Ronda 1 · Decisión sin datos',s2Title:'Elige sin',s2Accent:'inteligencia artificial',s2Body:'8 clientes en una red de agua. Algunos esconden fraude.',
   s4Kicker:'Ronda 2 · Con AquaData',s4Title:'Ahora elige',s4Accent:'con puntajes de riesgo',s4Body:'Cada tarjeta muestra su puntaje de riesgo. Elige 3.',
   selected:'Inspecciones seleccionadas',risk:'Riesgo',
   s3Kicker:'Así piensa la IA',s3Title:'Así analiza',s3Accent:'AquaData',s3Body:'El modelo lee el consumo de cada contrato y calcula qué tan probable es que una inspección encuentre una irregularidad.',
   s3Phases:['Reúne los datos','Lee el consumo','Detecta patrones','Calcula y ordena'],s3Sources:['Facturación','Lecturas','Inspecciones'],s3Trend:'Consumo',
   s3Inputs:[['Historial de consumo','Lecturas y evolución mensual'],['Facturación','Registros de la empresa'],['Inspecciones previas','Resultados conocidos']],
   s3Model:'AquaData · agente de análisis',s3Working:'Analizando contratos…',s3Done:'Puntajes listos',s3Play:'Ver en pantalla',s3NextAct:'Siguiente paso',s3Prev:'Paso anterior',s3Replay:'Repetir',s3Intro:'Cuatro pasos para leer los 8 contratos.',s3Rank:'Ranking de riesgo RIR',s3RankBody:'Orden sugerido de inspección',
   s3Note:'Un puntaje alto no es prueba de fraude. El inspector lo verifica en campo.',
   s5Kicker:'El resultado',s5Title:'Mismos contratos.',s5Accent:'Distinta forma de mirar.',s5Body:'Esto encontró el equipo de campo en cada ronda.',s5Without:'Sin IA',s5With:'Con AquaData',
   found:'Irregularidad',clear:'Sin hallazgo',
   s5NoteMore:'En una ciudad real, esa diferencia son inspecciones que no se desperdician y agua que sí se recupera.',
   s5NoteSame:'Empate en esta ronda. La IA mejora el promedio, no cada visita.',
   s5NoteLess:'Esta vez ganó tu intuición. La IA mejora el promedio, no cada visita.',
   s6Kicker:'Caso real · EMCALI, Cali',s6Title:'Impacto',s6Accent:'real',s6Body:'Un ejemplo real demuestra el valor de priorizar las inspecciones.',
   s6Reference:'Antes',s6With:'Con AquaData',s6Metric:'Tasa de detección en prueba de campo',
   s6Quote:'La inteligencia artificial no reemplaza al inspector. Le ayuda a saber dónde empezar.',s6QuoteBody:'Con la misma capacidad de campo, una lista priorizada puede ayudar a encontrar más irregularidades.',
   s6Source:'Fuente: ficha de AquaData, datos presentados en ANDESCO (septiembre de 2026).',simulation:'Simulación educativa · datos ficticios',
   cta:{1:'Pulsa “Siguiente” en la tableta para comenzar la misión',2:'Elige 3 contratos en la tableta y confirma',2.5:'Pulsa “Confirmar inspecciones” en la tableta',3:'AquaData está analizando. Pulsa “Continuar” en la tableta',4:'Ahora usa los puntajes de riesgo: elige 3 contratos y confirma',5:'Compara las dos rondas. Pulsa “Continuar” en la tableta',6:'Vuelve a jugar o regresa al menú desde la tableta'}
  }
 };
 const icons={
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L19 7"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M10 20v-5h4v5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H4m6-6-6 6 6 6"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 9h5a1 1 0 0 1 1 1v11M2 21h20M8 8h2M8 12h2M8 16h2"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
  minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>',
  replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 6v7"/><circle cx="12" cy="17.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  /* Outline tablet of the Figma call-to-action pill. */
  pillTablet:'<svg viewBox="0 0 29 22" fill="currentColor" aria-hidden="true"><path d="M25.931 21.0553L2.86153 21.0649C1.37168 21.066 0 19.879 0 18.3428V2.70237C0 1.28172 1.27161 0 2.70184 0L26.0561 0.00532278C27.4666 0.00532278 28.7084 1.31526 28.7084 2.70025V18.3455C28.7079 19.8103 27.4086 21.0548 25.931 21.0553ZM25.9161 19.1498C26.4207 19.0752 26.805 18.7388 26.805 18.231V2.81894C26.805 2.30955 26.4154 1.98167 25.9416 1.90343H2.76731C2.27762 1.97901 1.97794 2.28241 1.89757 2.77051L1.90396 18.2337C1.90396 18.725 2.32073 19.145 2.81522 19.1455L25.9155 19.1508Z"/><circle cx="13.96" cy="3.96" r=".96"/></svg>',
  tablet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M12 17h.01"/></svg>',
  dice:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="9"/><g fill="currentColor" stroke="none"><circle cx="16" cy="16" r="2.8"/><circle cx="32" cy="16" r="2.8"/><circle cx="24" cy="24" r="2.8"/><circle cx="16" cy="32" r="2.8"/><circle cx="32" cy="32" r="2.8"/></g></svg>',
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V4m-6 6 6-6 6 6"/></svg>',
  screen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  bulb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z"/></svg>',
  chip:'<svg viewBox="0 0 53 53" fill="none" aria-hidden="true"><path fill="currentColor" d="M19.4786 33.8337H15.4233L20.6907 18.2223H25.7141L30.9814 33.8337H26.9261L23.2595 22.1556H23.1376L19.4786 33.8337ZM18.9374 27.6897H27.4139V30.5559H18.9374V27.6897ZM36.4355 18.2223V33.8337H32.6622V18.2223H36.4355Z"/><path fill="currentColor" d="M37.532 50.3108C37.539 51.6168 36.7887 52.4633 35.7453 52.5172C34.58 52.5781 33.7382 51.6801 33.7406 50.4234L33.7547 46.8993H28.1344L28.1485 50.421C28.1532 51.6028 27.4123 52.4656 26.3689 52.5172C25.2036 52.5758 24.3595 51.6801 24.3642 50.421L24.3782 46.897H18.758L18.7721 50.4187C18.7768 51.6004 18.0359 52.4633 16.9925 52.5148C15.8272 52.5735 14.9831 51.6778 14.9878 50.4187L15.0018 46.8993H11.241C8.11549 46.904 5.62777 44.3975 5.62308 41.2767L5.61839 37.5159L2.09667 37.5323C1.00874 37.537 0.181063 36.9133 0.0263136 35.966C-0.137815 34.9648 0.474149 33.8136 1.63008 33.8019L5.62543 33.7597V28.1395L2.09902 28.1535C1.01108 28.1582 0.183408 27.5345 0.0286583 26.5873C-0.13547 25.5861 0.476494 24.4349 1.63242 24.4231L5.62543 24.3833V18.7631L2.09902 18.7771C1.01108 18.7818 0.183408 18.1581 0.0286583 17.2109C-0.13547 16.2097 0.476494 15.0584 1.63242 15.0467L5.62074 15.0045L5.62777 11.2413C5.63246 8.11348 8.11783 5.63983 11.241 5.63514L15.0042 5.63045L14.9925 2.09701C14.9878 0.896528 15.7193 0.0618194 16.7721 0.00320215C17.9421 -0.0601044 18.7768 0.821498 18.7744 2.09466L18.7627 5.63514H24.3806L24.3689 2.09701C24.3642 0.896528 25.0957 0.0618194 26.1485 0.00320215C27.3185 -0.0601044 28.1532 0.821498 28.1509 2.09466L28.1391 5.63514H33.757L33.7476 2.09701C33.7429 0.905907 34.4534 0.0688534 35.5249 0.00554684C36.5964 -0.0577597 37.5062 0.676128 37.5085 1.85785L37.5179 5.63045L41.0396 5.62342C44.2612 5.61873 46.8873 8.00093 46.8919 11.2389L46.899 14.9998L50.8849 15.035C51.9659 15.0444 52.5661 16.0971 52.5145 16.9881C52.4512 18.0667 51.5884 18.7771 50.4207 18.7724L46.8919 18.7584V24.3786L50.8849 24.4138C51.9659 24.4231 52.5661 25.4759 52.5145 26.3669C52.4512 27.4454 51.5884 28.1559 50.4207 28.1512L46.8919 28.1371V33.7573L50.8849 33.7925C51.9659 33.8019 52.5661 34.8546 52.5145 35.7456C52.4512 36.8242 51.5884 37.5346 50.4207 37.5299L46.8943 37.5135L46.9013 41.0329C46.906 44.2498 44.5097 46.9017 41.2741 46.8993H37.5179L37.5366 50.3038L37.532 50.3108ZM41.3116 43.1572C42.4417 42.9931 43.1311 42.2662 43.1311 41.2205V11.2976C43.1311 10.2167 42.3104 9.40071 41.2061 9.40071H11.3043C10.1905 9.40071 9.37693 10.2096 9.37693 11.2952V41.2228C9.37693 42.299 10.2046 43.1431 11.2949 43.1431L41.3092 43.1548L41.3116 43.1572Z"/></svg>',
  explore:'<svg viewBox="0 0 158 154" fill="none" aria-hidden="true"><g fill="currentColor" stroke="currentColor" stroke-width=".5"><path d="M100.798 0.341797C103.276 0.344299 105.729 1.47619 107.562 3.21484C109.394 4.95346 110.63 7.31987 110.64 9.81543L110.866 62.8965L110.867 63.1309L110.634 63.1465L101.233 63.7783L100.968 63.7969L100.967 63.5293L100.895 9.94141H11.2207C10.7215 9.9415 10.0867 10.3988 10.0332 11.3037L10.0342 11.4229L10.0479 119.898C10.0479 120.45 10.2326 120.815 10.5059 121.047C10.7855 121.284 11.1899 121.409 11.6738 121.409L68.0176 121.39H68.2021L68.2568 121.566C69.3297 125.061 71.0879 127.65 73.04 130.631L73.293 131.019H72.8311L11.6465 131.046L11.6475 131.047C6.21245 131.297 0.366304 127.399 0.361328 121.384L0.25 11.0811C0.240129 4.76865 5.05137 0.245072 11.1973 0.25L100.798 0.341797Z"/><path d="M108.104 71.482C120.378 71.2586 131.743 77.5896 138.361 88.2564C145.604 99.9346 145.072 114.74 136.645 125.598L156.8 145.361C157.86 146.402 157.913 147.803 157.538 149.029C157.165 150.249 156.352 151.359 155.574 151.885H155.573C154.348 152.712 153.106 153.06 151.905 152.945C150.871 152.846 149.888 152.404 148.99 151.666V151.699L148.567 151.294L129.291 132.866C111.614 145.662 87.0082 139.627 77.1895 120.296C72.1281 110.335 72.7674 98.6413 78.3818 88.9332C84.6333 78.1262 95.8266 71.7005 108.104 71.482ZM113.465 82.3697C104.046 80.6351 94.8432 83.9566 89.1504 91.3336C81.517 101.225 82.5845 114.766 92.0303 123.028C101.458 131.274 114.765 131.493 124.318 123.647V123.643L124.409 123.569C130.228 118.744 133.453 111.918 133 104.559C132.317 93.5474 124.144 84.3356 113.465 82.3697Z"/><path d="M56.833 50.6645C58.2952 50.667 59.3994 51.1714 60.1328 52.0375C60.8609 52.8974 61.1986 54.0841 61.1963 55.4086L61.1768 95.8451C61.1767 96.8524 60.9412 97.9474 60.3799 98.7953C59.8119 99.6531 58.9131 100.25 57.6328 100.237V100.238H57.6279V100.237L57.625 100.238V100.237L51.2451 100.156H51.2441C50.9267 100.151 50.5932 100.026 50.2822 99.8432C49.9679 99.6582 49.6583 99.403 49.3857 99.1127C48.8504 98.5424 48.4111 97.7858 48.4082 97.1V97.099L48.3262 53.6928V53.6488L48.3408 53.6078C49.0352 51.6781 50.6446 50.6498 52.6611 50.6547L56.833 50.6645Z"/><path d="M87.708 68.5355V68.639L87.6035 68.7435L87.5713 68.7611C82.2858 71.5786 78.0714 75.2294 74.0771 80.2172L73.6328 80.7719L73.6318 80.0609L73.584 33.6937L73.5889 33.4935C73.6884 31.44 75.3136 29.8788 77.2314 29.8939L84.3057 29.9467H84.3066C86.0948 29.9628 87.4386 31.6309 87.6865 33.2845L87.6885 33.3031V33.3217L87.708 68.5355Z"/><path d="M33.3428 70.7837L33.5596 70.8023C34.0755 70.8786 34.6608 71.1862 35.1309 71.5845C35.6327 72.0098 36.0701 72.596 36.125 73.2183L36.1309 73.3433L36.1787 97.2242V97.2251C36.1786 97.8685 35.8492 98.5871 35.376 99.1431C34.9035 99.6982 34.2426 100.143 33.5352 100.166L27.0635 100.373H27.0625C25.8616 100.411 24.8941 99.9727 24.2305 99.2281C23.5707 98.4877 23.2266 97.4626 23.2266 96.3472V74.6704C23.2266 73.5462 23.5919 72.543 24.2646 71.8228C24.9396 71.1002 25.9084 70.6799 27.0781 70.6978L33.3428 70.7837Z"/></g></svg>',
  brain:'<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M52 22c-9-8-26-3-26 11-10 2-13 16-5 22-6 9 0 21 10 22 1 10 14 14 21 7V22Z"/><path d="M68 22c9-8 26-3 26 11 10 2 13 16 5 22 6 9 0 21-10 22-1 10-14 14-21 7V22Z"/><rect x="44" y="44" width="32" height="32" rx="6"/><path d="M52 44v-8m8 8v-8m8 8v-8M52 84v-8m8 8v-8m8 8v-8M44 52h-8m8 8h-8m8 8h-8M84 52h-8m8 8h-8m8 8h-8"/><circle cx="34" cy="34" r="3" fill="currentColor" stroke="none"/><circle cx="86" cy="34" r="3" fill="currentColor" stroke="none"/><circle cx="30" cy="70" r="3" fill="currentColor" stroke="none"/><circle cx="90" cy="70" r="3" fill="currentColor" stroke="none"/></svg>'
 };
 /* Minimalist business icons from the Figma redesign. They replace the photos on every game screen. */
 const BIZ={
  building:'<svg viewBox="0 0 44 51" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true"><path fill="currentColor" d="M0 47.0208L0.0118563 1.62182C0.0118563 0.733461 0.752609 0 1.63094 0H28.7836C29.7248 0 30.3999 0.814552 30.4009 1.70746L30.5047 16.2774L41.8246 16.2992C42.744 16.3011 43.3426 17.0209 43.4437 17.9092L43.4483 47.0254L43.4701 50.6717H0.0318985L0 47.0208ZM21.6057 34.4044C22.484 34.4044 23.1473 35.2034 23.1491 35.9961L23.1792 47.6796L27.6064 47.6896V2.98123H3.26277L3.25821 47.6741L7.69179 47.6796L7.70728 36.0954C7.70819 35.1888 8.37058 34.3952 9.31998 34.3962L21.6039 34.4034L21.6057 34.4044ZM40.3723 19.2641H30.4109V47.6914H40.3723V19.2641ZM20.4613 37.3646H10.3177V47.6905H20.4613V37.3646ZM37.4107 23.5145H33.0737V27.1427H37.4107V23.5145ZM37.4107 30.7552H33.0737V34.3834H37.4107V30.7552ZM37.4107 37.9961H33.0737V41.6242H37.4107V37.9961ZM12.89 5.41309H8.00635V9.04121H12.89V5.41309ZM22.9304 5.41309H18.4111V9.04121H22.9304V5.41309ZM12.89 12.6538H8.00635V16.2819H12.89V12.6538ZM22.9304 12.6538H18.4111V16.2819H22.9304V12.6538ZM12.89 19.8947H8.00635V23.5228H12.89V19.8947ZM22.9304 19.8947H18.4111V23.5228H22.9304V19.8947ZM12.89 27.1353H8.00635V30.7634H12.89V27.1353ZM22.9304 27.1353H18.4111V30.7634H22.9304V27.1353Z"/></svg>',
  bread:'<svg viewBox="0 0 59 31" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true"><path d="M24.123 0.0839844C26.6408 -0.208717 29.231 0.536911 31.5059 2.50488L31.5186 2.5166L31.5332 2.50684C35.9267 -0.383968 41.601 0.651195 44.3828 5.34082L44.3936 5.3584L44.4121 5.35059C47.6997 3.953 50.5991 4.94605 52.8926 7.1123C55.187 9.27964 56.8736 12.6202 57.7285 15.9092C58.5418 19.0359 57.6083 22.0147 55.2178 24.1895V24.1885L55.1797 24.2227C50.8674 28.1054 43.199 29.9592 35.1387 30.6172C27.0798 31.275 18.6342 30.7367 12.7725 29.8379C9.7531 29.3755 6.9825 28.5039 4.44531 26.9902C0.935493 24.896 -0.650695 21.0885 0.288086 17.0576C2.04995 9.49285 9.18761 3.47117 17.1504 3.90527H17.1611L17.168 3.89746C19.157 1.70842 21.605 0.376789 24.123 0.0839844Z" fill="currentColor" stroke="currentColor" stroke-width="0.0455566"/><path d="M26.3579 2.5155C27.437 2.71848 28.3001 2.97219 29.4927 3.93347C27.2028 6.10173 25.6354 8.40537 24.0122 11.2587C22.9932 8.00678 23.9844 4.82652 26.3579 2.5155Z" fill="white" stroke="currentColor" stroke-width="0.0455566"/><path d="M40.1914 4.27307C41.1406 4.9092 41.87 5.67239 42.3535 6.66858C41.081 7.83238 40.1959 8.9826 39.0449 10.5914C37.5601 9.35824 37.6021 7.46936 38.5928 6.04163V6.04065C39.0564 5.35451 39.4683 4.72295 40.1914 4.27307Z" fill="white" stroke="currentColor" stroke-width="0.0455566"/><path d="M15.0732 6.44043C14.1039 7.98028 13.4271 9.29542 12.6182 10.9941C11.6615 9.63981 11.8342 8.31031 12.1768 6.96094C13.1407 6.59242 13.9506 6.36239 15.0732 6.44043Z" fill="white" stroke="currentColor" stroke-width="0.0455566"/><path d="M22.897 2.80103C20.6557 6.5408 20.6969 10.8246 22.6626 14.6477C22.9023 15.1145 23.1801 15.441 23.6108 15.4954C24.1457 15.5618 24.655 15.3013 24.9448 14.7346C26.2335 12.1945 27.8782 9.20982 29.9604 6.92896C32.0329 4.6589 34.5362 3.08833 37.5503 3.34204C36.2868 4.91584 35.3677 6.49109 35.4575 8.427C35.534 10.0678 36.4741 11.6634 37.5171 12.6604C38.0385 13.1588 38.5877 13.5094 39.0698 13.6409C39.3111 13.7066 39.5374 13.7173 39.7349 13.6633C39.9327 13.6092 40.1005 13.49 40.2261 13.2981C41.3819 11.5302 42.4644 9.78565 44.0513 8.4436C45.1114 7.54753 46.3017 7.08549 47.4868 7.09009C48.6719 7.09472 49.8541 7.56512 50.897 8.53833C53.4738 10.9426 55.2005 14.2818 55.6079 17.8879L55.606 17.886L55.6128 17.9495C55.8243 19.8932 54.725 21.5514 53.0708 22.8889C51.417 24.2262 49.2127 25.24 47.2251 25.8948C37.7703 29.0081 24.5163 29.0336 14.5708 27.717C11.4356 27.3011 8.45748 26.5713 5.79346 25.0393C2.96758 23.4144 1.83768 20.4378 2.66748 17.2981C3.6622 13.5262 6.07229 10.3782 9.45166 8.25708C9.32152 9.99789 9.99091 11.5714 10.8638 12.6536C11.3039 13.1992 11.7962 13.6209 12.2651 13.8762C12.7333 14.1311 13.182 14.2225 13.5317 14.0999C13.6214 14.0684 13.7107 14.0042 13.8003 13.9133C13.89 13.8223 13.9806 13.7027 14.0747 13.5598C14.2628 13.2742 14.4641 12.8905 14.686 12.4377C15.1303 11.5314 15.6606 10.3465 16.3501 9.10474C17.7207 6.63642 19.7164 3.95022 22.897 2.80103Z" fill="white" stroke="currentColor" stroke-width="0.0455566"/></svg>',
  store:'<svg viewBox="0 0 56 52" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true"><path fill="currentColor" d="M51.9054 48.2053C51.9036 50.0831 50.1205 51.9364 47.983 51.9355L7.51866 51.9209C5.27819 51.9209 3.68006 49.951 3.68097 47.8053L3.69282 25.5472C1.09791 23.7769 -0.709772 20.4267 0.270607 17.3598L7.15785 2.00722C7.72184 0.749862 9.15415 0 10.5044 0L45.215 0.00820019C46.4878 0.00820019 47.89 0.777196 48.4176 1.95347L55.3258 17.3799C56.2825 20.4531 54.5021 23.7587 51.9291 25.5491L51.9063 48.2044L51.9054 48.2053ZM13.0082 18.2846C13.1923 17.0582 13.6843 15.9867 14.0551 14.8724L14.9562 12.1645C15.2697 11.2242 15.5002 10.2976 15.9084 9.39104C16.1398 8.4216 16.496 7.53871 16.8104 6.59933L17.7817 3.70102L10.57 3.71833C10.2074 4.19212 10.0753 4.6486 9.84661 5.16339L3.72744 18.9443C3.94612 21.1246 5.53786 22.7455 7.64987 23.089C9.27077 23.3523 10.9263 22.6498 11.9705 21.3451C12.6647 20.4768 12.8351 19.4345 13.0073 18.2837L13.0082 18.2846ZM25.8816 18.8194L25.9481 3.70375L21.7569 3.71651L16.7184 18.8313C16.8969 21.069 18.4787 22.74 20.6371 23.0872C23.3314 23.52 25.8698 21.305 25.8807 18.8194H25.8816ZM38.8653 18.7766L33.8513 3.71651L29.6583 3.71378L29.682 18.8486C29.9362 21.0945 31.455 22.7355 33.6253 23.0881C36.2139 23.509 38.7705 21.4963 38.8644 18.7766H38.8653ZM42.7285 19.0955C42.9863 21.2339 44.5808 22.7537 46.6062 23.089C49.1538 23.5118 51.7122 21.5373 51.8361 18.8932L45.3206 4.17207C45.2286 3.96343 45.0309 3.7074 44.8049 3.7074L37.8111 3.72471C38.2366 4.76796 38.4799 5.66178 38.796 6.61482C39.1158 7.57789 39.4876 8.48629 39.7217 9.48489C40.1445 10.355 40.3477 11.2634 40.6538 12.1782L41.6351 15.1166L42.3139 17.1001C42.5353 17.7479 42.6401 18.3611 42.7285 19.0946V19.0955ZM25.9582 48.229L47.7588 48.2235C47.9757 48.2235 48.2126 47.9866 48.2126 47.7716L48.208 26.8401C45.2733 27.1663 42.61 26.0629 40.7878 23.8398C39.0256 26.0019 36.448 27.0962 33.6755 26.8675C31.3603 26.7645 29.3057 25.6447 27.7977 23.8452C26.0393 26.0001 23.4617 27.0971 20.69 26.8675C18.373 26.7654 16.322 25.6438 14.8114 23.8462C13.0119 26.052 10.3404 27.17 7.41024 26.8401L7.40022 47.4882C7.40022 47.7433 7.41297 47.8964 7.5296 48.0422C7.62982 48.167 7.80841 48.2335 8.02161 48.2317L11.1067 48.2117L14.825 48.2281L22.2444 48.2162L25.9591 48.2308L25.9582 48.229Z"/></svg>',
  house:'<svg viewBox="0 0 55 52" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true"><path fill="currentColor" d="M53.8543 23.3058L49.0599 18.8795L49.0426 5.00391C49.0417 4.12922 48.3711 3.32925 47.4773 3.32834L36.2895 3.31649C35.5542 3.31649 35.0048 3.80304 34.7497 4.47181L34.6194 5.70457L29.0706 0.692432C28.072 -0.209589 26.4711 -0.252412 25.4333 0.694254L0.664206 23.2803C-0.266971 24.1295 -0.0874783 25.703 0.402711 26.6652C0.948479 27.3722 1.61361 27.9471 2.4974 27.9562L6.69955 28L6.70592 50.648C7.00386 51.4352 7.53597 51.9054 8.35781 51.9281L18.0359 51.9099V51.9354H35.7237V51.93L46.301 51.9081C46.9087 51.9072 47.7852 51.3368 47.7871 50.6489L47.8326 28L52.1031 27.9453C52.9104 27.9353 53.5281 27.3868 54.0383 26.7909C54.6679 25.7495 54.8082 24.1869 53.8543 23.3067V23.3058ZM23.3259 36.7077H31.199L31.1953 48.6344H23.3277L23.325 36.7077H23.3259ZM46.2819 24.6807C45.3024 24.6898 44.5234 25.4124 44.5981 26.4465L44.5945 48.6353L35.7246 48.639V48.6335H34.4463L34.4308 35.2417C34.4927 34.233 33.7529 33.465 32.7452 33.465H21.7815C20.7729 33.465 20.0385 34.2321 20.0932 35.2417V48.6326H18.0368L9.9286 48.6308V26.4438C10.0015 25.4588 9.27987 24.7062 8.33594 24.6898L4.05362 24.6151L27.2583 3.44587L34.9128 10.4388C35.4239 10.9062 35.9095 11.2279 36.6066 11.0967C37.1806 10.9882 37.7482 10.5172 37.9076 9.86025L37.9213 6.60933H45.7817L45.7935 19.8736C45.7935 20.3173 46.1798 20.6717 46.4741 20.946L50.4612 24.6434L46.281 24.6816L46.2819 24.6807Z"/></svg>',
  washer:'<svg viewBox="0 0 46 51" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true"><path fill="currentColor" d="M45.799 46.4295C45.799 48.8303 43.7899 50.669 41.4702 50.669L4.34336 50.6726C2.00813 50.6726 0 48.7984 0 46.4231V4.23768C0 1.91976 1.95529 0.00364453 4.2559 0.00364453L41.5504 0C43.8738 0 45.8054 2.00085 45.8054 4.20123L45.799 46.4295ZM42.8506 10.1518L42.8615 4.21034C42.7348 3.49601 42.2164 2.98487 41.4684 2.93385L4.25863 2.93658C3.62266 3.0286 2.96938 3.54157 2.96847 4.20579L2.963 10.1537L42.8506 10.1509V10.1518ZM41.5103 47.7288C42.1909 47.6276 42.8515 47.1411 42.8515 46.4404V13.2005H2.95207V46.4413C2.95207 47.1711 3.69281 47.6796 4.34427 47.7278H41.5103V47.7288ZM32.8412 8.04621C31.7505 8.16922 30.6681 8.13004 29.613 8.05988C28.8039 8.00612 28.2044 7.26355 28.2272 6.55287C28.2518 5.77567 28.8695 5.08139 29.6659 5.07957L32.6744 5.0741C33.4726 5.07228 34.0694 5.70734 34.1395 6.46449C34.2042 7.15422 33.6849 7.95146 32.8412 8.04621ZM41.8771 6.15659C42.1641 6.99756 41.4999 8.0727 40.5614 8.07179L37.4281 8.06814C36.6108 8.06814 35.9903 7.26908 36.0222 6.54655C36.0568 5.76207 36.6736 5.07507 37.4818 5.07507L40.4749 5.0769C41.1327 5.0769 41.6402 5.46139 41.8771 6.15568V6.15659ZM22.9026 16.313C15.0869 16.313 8.75 22.649 8.75 30.4656C8.75 38.2822 15.086 44.6182 22.9026 44.6182C30.7192 44.6182 37.0552 38.2822 37.0552 30.4656C37.0552 22.649 30.7192 16.313 22.9026 16.313ZM22.9026 41.6488C16.726 41.6488 11.7185 36.6413 11.7185 30.4647C11.7185 24.2881 16.726 19.2805 22.9026 19.2805C29.0792 19.2805 34.0868 24.2881 34.0868 30.4647C34.0868 36.6413 29.0792 41.6488 22.9026 41.6488Z"/></svg>',
  wrench:'<svg viewBox="0 0 51 51" preserveAspectRatio="xMidYMid meet" fill="none" aria-hidden="true"><path fill="currentColor" d="M47.0596 8.39391C47.7002 7.75533 48.9815 7.83614 49.3738 8.76051C51.5244 13.8318 50.4599 19.652 46.7915 23.7141C43.2117 27.6796 37.6608 29.4062 32.4193 27.9004L11.6367 48.611C8.85923 51.3802 4.43186 50.9092 1.91067 48.2366C-0.66966 45.4989 -0.657833 41.2062 2.07625 38.4705L22.5592 17.9826C21.0808 12.6512 22.8293 7.14828 26.7126 3.63999C30.5959 0.131712 36.478 -1.0272 41.5539 0.987103C42.031 1.17631 42.305 1.60401 42.4016 1.98046C42.5198 2.44166 42.4292 2.98367 42.0349 3.37983L34.3294 11.1138L35.2401 15.1976L39.3146 16.1043L47.0615 8.39391H47.0596ZM40.862 18.8084C40.5131 19.1533 40.0735 19.3484 39.6379 19.2578L33.9352 18.0575C33.2531 17.9136 32.6499 17.5056 32.4962 16.798L31.2346 10.9719C31.1518 10.4062 31.2701 9.91943 31.6604 9.52524L37.9939 3.1512C33.878 2.554 30.0814 4.06178 27.6332 7.01228C25.1849 9.96279 24.3885 14.0998 25.6481 17.8407C25.8571 18.4635 25.7428 19.0587 25.2638 19.5376L4.20517 40.5992C2.55329 42.2508 2.65185 44.7795 4.23277 46.3011C5.81369 47.8227 8.21858 47.8365 9.83104 46.2242L30.8955 25.1686C31.3115 24.7528 31.8851 24.5557 32.4449 24.7488C36.2297 26.0516 40.3791 25.3421 43.4227 22.7936C46.3401 20.3516 47.9762 16.5201 47.3178 12.4225L40.862 18.8104V18.8084Z"/></svg>'
 };
 /* Fictional customers of the redesign. Names stay in Spanish in both languages; scores and outcomes
    still come from the data files, so the game logic does not change. */
 const ROSTER={
  'A-01':{es:'Edificio Los Pinos',en:'Edificio Los Pinos',esType:'Residencial',enType:'Residential',icon:'building'},
  'A-02':{es:'Panadería Central',en:'Panadería Central',esType:'Comercial',enType:'Commercial',icon:'bread'},
  'A-03':{es:'Comercial El Norte',en:'Comercial El Norte',esType:'Comercial',enType:'Commercial',icon:'store'},
  'A-04':{es:'Carlos Peña',en:'Carlos Peña',esType:'Residencial',enType:'Residential',icon:'house'},
  'A-05':{es:'Lavandería Azul',en:'Lavandería Azul',esType:'Comercial',enType:'Commercial',icon:'washer'},
  'A-06':{es:'Taller Mecánico Ruiz',en:'Taller Mecánico Ruiz',esType:'Comercial',enType:'Commercial',icon:'wrench'},
  'A-07':{es:'Rosa Delgado',en:'Rosa Delgado',esType:'Residencial',enType:'Residential',icon:'house'},
  'A-08':{es:'Familia Gómez',en:'Familia Gómez',esType:'Residencial',enType:'Residential',icon:'house'}
 };
 const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 /* Entry animations play once per stage: re-renders of the same stage (a pick, a language switch) stay still. */
 const played={};
 const fresh=(scope,key)=>{const is=played[scope]!==key;played[scope]=key;return is;};
 const riskLevel=risk=>risk>=60?'high':risk>=40?'mid':'low';
 /* Consumption sparkline from the contract series; a dot marks a sharp drop. CSS draws the line. */
 function spark(series){
  const max=Math.max(...series)||1;
  const pts=series.map((value,i)=>[(i/(series.length-1)*94+3).toFixed(1),(37-value/max*32).toFixed(1)]);
  let drop=0,at=0;series.forEach((value,i)=>{if(i&&series[i-1]-value>drop){drop=series[i-1]-value;at=i;}});
  const dot=drop/max>.2?`<circle class="aqd-spark-dot" cx="${pts[at][0]}" cy="${pts[at][1]}" r="3.2"/>`:'';
  return `<svg class="aqd-spark" viewBox="0 0 100 40" aria-hidden="true"><polyline pathLength="1" points="${pts.map(point=>point.join(',')).join(' ')}"/>${dot}</svg>`;
 }
 /* Business icon of a contract. Cards align it bottom-left; circles centre it. */
 const glyph=(c,align='xMidYMid')=>`<span class="aqd-glyph" aria-hidden="true">${(BIZ[c&&c.icon]||BIZ.house).replace('xMidYMid',align)}</span>`;
 /* Three inspection slots: the chosen contract's icon, or an empty circle. */
 function slots(data,picks,ids=false){
  const chosen=picks.map(id=>data.contracts.find(c=>c.id===id)).filter(Boolean);
  return `<ol class="aqd-slots">${[0,1,2].map(i=>{const c=chosen[i];return c?`<li class="is-filled ${i===chosen.length-1?'is-new':''}">${glyph(c)}<i aria-hidden="true">${icons.check}</i>${ids?`<b>${c.id}</b>`:''}</li>`:'<li></li>';}).join('')}</ol>`;
 }
 /* One round of the comparison: score, a three-step meter and each inspected contract with its outcome.
    The tablet uses the compact form (score only); the icons belong to the TV. */
 function resultCard(data,ids,label,kind,x,compact){
  const list=[...(ids||[])].sort();
  const hits=list.filter(id=>data.outcomes.get(id)===true).length;
  return `<article class="aqd-result aqd-result--${kind}"><h2>${label}</h2><p class="aqd-score"><b>${hits}</b>/${MAX_PICKS}</p><span class="aqd-meter" aria-hidden="true">${[0,1,2].map(i=>`<i class="${i<hits?'is-on':''}"></i>`).join('')}</span>${compact?'':`<ul>${list.map((id,i)=>{const c=data.contracts.find(item=>item.id===id);const hit=data.outcomes.get(id)===true;return `<li class="${hit?'is-found':''}" style="--i:${i}"><span class="aqd-result-photo" aria-label="${id} · ${esc(hit?x.found:x.clear)}">${c?glyph(c):''}<i aria-hidden="true">${hit?icons.alert:icons.minus}</i></span></li>`;}).join('')}</ul>`}</article>`;
 }
 /* Documented EMCALI field test (real figures, never mixed with the simulated game). */
 function chart(x,lang,animate){
  const fmt=value=>lang==='es'?String(value).replace('.',',')+' %':value+' %';
  const scale=value=>Math.round(value/EMCALI.withAquaData*100);
  return `<figure class="aqd-chart ${animate?'is-animated':''}" aria-label="${esc(x.s6Metric)}"><div class="aqd-bars"><div class="aqd-bar aqd-bar--reference" style="--value:${scale(EMCALI.reference)}"><b>${fmt(EMCALI.reference)}</b><i></i><span>${x.s6Reference}</span></div><div class="aqd-bar aqd-bar--aquadata" style="--value:${scale(EMCALI.withAquaData)}"><b>${fmt(EMCALI.withAquaData)}</b><i></i><span>${x.s6With}</span></div></div><figcaption>${x.s6Metric}<small>${x.s6Source}</small></figcaption></figure>`;
 }
 /* Four acts of about 3.5 s each: [start, length] in seconds. aquadata.css follows the same clock. */
 const ACTS=4;
 /* The agent panel: what the model is doing while the contract cards are scanned. */
 function agent(x,act,animate){
  return `<aside class="aqd-agent ${animate?'is-animated':''}" data-act="${act}"><div class="aqd-agent-head"><span class="aqd-model-icon">${icons.chip}</span><span><strong>${x.s3Model}</strong><em class="aqd-agent-status"><span>${x.s3Working}</span><span>${x.s3Done}</span></em></span></div><ul class="aqd-agent-sources">${x.s3Sources.map((source,i)=>`<li style="--i:${i}">${source}</li>`).join('')}</ul><ol>${x.s3Phases.map((phase,i)=>`<li class="${i+1<act?'is-done':i+1===act?'is-active':''}"><i aria-hidden="true"><b>${i+1}</b>${icons.check}</i><strong>${phase}</strong></li>`).join('')}</ol><span class="aqd-progress" role="progressbar" aria-label="${esc(x.s3Model)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${act*25}"><i style="--p:${act}"></i></span></aside>`;
 }
 /* Each contract is read in turn: consumption line, risk score, then its place in the ranking. */
 function scanGrid(data,x,act,animate){
  const ranked=[...data.contracts].sort((a,b)=>b.risk-a.risk);
  return `<ul class="aqd-scan ${animate?'is-animated':''}" data-act="${act}">${data.contracts.map((c,i)=>{const rank=ranked.indexOf(c)+1;return `<li class="aqd-scan-card aqd-risk--${riskLevel(c.risk)} ${rank<=MAX_PICKS?'is-top':''}" style="--i:${i}"><span class="aqd-scan-head"><b>${c.id}</b>${esc(c.es)}</span>${spark(c.series)}<span class="aqd-scan-score"><i style="--value:${c.risk}"></i><b class="aqd-count" style="--to:${c.risk}" aria-label="${c.risk}"></b></span><em class="aqd-scan-rank">#${rank}</em></li>`;}).join('')}</ul>`;
 }
 /* The explainer card: a consumption line and the score the model gives it. */
 function sample(x,animate){
  return `<article class="aqd-sample aqd-risk--high ${animate?'is-animated':''}"><span class="aqd-sample-tag">${x.sample}</span><span class="aqd-scan-trend"><em>1</em>${x.s3Trend}</span>${spark(SAMPLE.series)}<span class="aqd-scan-score"><em>2</em><i style="--value:${SAMPLE.risk}"></i><b class="aqd-count" style="--to:${SAMPLE.risk}" aria-label="${SAMPLE.risk}"></b></span></article>`;
 }
 let dataPromise=null;
 /* Contracts and simulated outcomes are shared by both screens. */
 function load(){
  if(!dataPromise)dataPromise=(async()=>{
   const [c,o]=await Promise.all([fetch(dataRoot+'contratos_ficticios.json'),fetch(dataRoot+'hallazgos_simulados_DEMO.json')]);
   if(!c.ok||!o.ok)throw Error('AquaData resources');
   const contracts=(await c.json()).map(item=>({...item,...(ROSTER[item.id]||{})}));const demo=await o.json();
   return {contracts,outcomes:new Map(demo.outcomes.map(item=>[item.id,item.finding]))};
  })().catch(error=>{dataPromise=null;throw error;});
  return dataPromise;
 }
 function render(state,options){
  const {data,readonly=false,station=1}=options;
  const lang='en'; // AquaData runs in English only: no language switch on the tablet or the TV.
  const x=copy[lang];
  const step=Math.max(1,Math.min(LAST_STEP,Number(state.step)||1));
  const picks=step<=ANALYSIS_STEP?(state.p1||[]):(state.p2||[]);
  const chapter=CHAPTER[step];
  /* Business names stay in Spanish in both languages; only the business type is translated. */
  const name=c=>c.es;
  const type=c=>lang==='es'?c.esType:c.enType;
  const tag=readonly?'span':'button type="button"';
  const close=readonly?'span':'button';
  const animate=fresh('tablet',`${state.mode}:${step}`);
  const backBtn=()=>readonly?'':`<button type="button" class="aqd-secondary" data-action="back">${icons.back} ${x.back}</button>`;
  /* Points the visitor to the TV, where the detail of this stage is shown. */
  const watch=(text,big)=>`<p class="aqd-watch ${big?'aqd-watch--big':''}"><i aria-hidden="true">${icons.screen}</i><span>${text}</span></p>`;
  function header(){
   const steps=state.mode==='game'?`<ol class="aqd-steps" aria-label="${esc(lang==='es'?'Etapas':'Stages')}">${[1,2,3,4,5,6].map(n=>`<li class="${n===chapter?'is-current':n<chapter?'is-done':''}" ${n===chapter?'aria-current="step"':''}>${n}</li>`).join('')}</ol>`:'';
   const tools=readonly
    ?`<div class="aqd-tools"></div>`
    :`<div class="aqd-tools">${state.mode==='landing'?'':`<button type="button" class="aqd-home aqd-home--back" data-action="back">${icons.back}<span>${x.back}</span></button>`}<button type="button" class="aqd-home" data-action="home">${icons.home}<span>${x.home}</span></button></div>`;
   return `<header class="aqd-header"><div class="aqd-brand"><img src="${logo}" width="216" height="44" alt="IDB Group"><span class="aqd-brand-divider" aria-hidden="true"></span><span class="aqd-brand-copy"><strong>${x.brand}</strong><small>${x.brandSub}</small></span></div>${steps}${tools}</header>`;
  }
  function title(kicker,plain,accent,body,joiner=' '){
   return `<div class="aqd-title">${kicker?`<p class="aqd-kicker">${kicker}</p>`:''}<h1>${plain}${joiner}<span>${accent}</span></h1>${body?`<p class="aqd-lead">${body}</p>`:''}</div>`;
  }
  function cta(){
   if(!readonly||state.mode!=='game')return '';
   const key=(step===2||step===4)&&picks.length===MAX_PICKS?2.5:step;
   return `<aside class="aqd-cta" role="status"><span class="aqd-cta-icon">${icons.pillTablet}</span><span><small>${x.onTablet}</small><strong>${x.cta[key]}</strong></span><i aria-hidden="true">${icons.arrow}</i></aside>`;
  }
  /* Landing: the title and three options (video, the project sheet, the game). Whatever
     is showing on the TV, the cards stay as they are: nothing is added on tap. */
  function landing(){
   const card=(action,head,body,media)=>`<${tag} class="aqd-home-card" data-action="${action}"><span class="aqd-home-card-copy"><strong>${head}</strong><small>${body}</small></span>${media}</${close}>`;
   return `${header()}<section class="aqd-screen aqd-landing aqd-landing--three"><div class="aqd-landing-grid">${title(x.kicker,'Aqua','Data',x.intro,'')}${card('video',x.video,x.videoBody,`<img src="${landingArt.video}" alt="" aria-hidden="true">`)}${card('information',x.info,x.infoBody,`<img src="${landingArt.about}" alt="" aria-hidden="true">`)}${card('game',x.game,x.gameBody,`<span class="aqd-home-card-icon" aria-hidden="true">${icons.explore}</span>`)}</div></section>`;
  }
  function contractCard(c,withRisk,index){
   const selected=picks.includes(c.id);
   const full=picks.length>=MAX_PICKS&&!selected;
   return `<${tag} class="aqd-contract ${selected?'is-selected':''}" data-contract="${c.id}" style="--i:${index}" aria-pressed="${selected}" ${full?'aria-disabled="true"':''}><span class="aqd-contract-top">${glyph(c,'xMinYMax')}${withRisk?`<span class="aqd-contract-score ${c.risk>=50?'is-strong':''}"><b class="aqd-count" style="--to:${c.risk}" aria-label="${c.risk}"></b><small>${x.risk}</small></span>`:''}</span><span class="aqd-contract-id">${c.id} · ${esc(type(c))}</span><span class="aqd-contract-name">${esc(name(c))}</span><span class="aqd-contract-check" aria-hidden="true">${icons.check}</span></${close}>`;
  }
  function selection(withRisk){
   const count=picks.length,ready=count===MAX_PICKS;
   const head=withRisk?[x.s4Kicker,x.s4Title,x.s4Accent,x.s4Body]:[x.s2Kicker,x.s2Title,x.s2Accent,x.s2Body];
   const counter=`<output class="aqd-counter" aria-live="polite"><span>${x.selected}</span><strong>${count}/${MAX_PICKS}</strong></output>`;
   const action=readonly?'':`${backBtn()}<button type="button" class="aqd-primary" data-action="confirm" ${ready?'':'disabled aria-disabled="true"'}>${ready?x.confirm:x.pick} ${icons.arrow}</button>`;
   return `${header()}<section class="aqd-screen aqd-select"><div class="aqd-select-head">${title(...head)}${counter}</div><div class="aqd-contract-grid ${withRisk&&animate?'is-animated':''}">${data.contracts.map((c,i)=>contractCard(c,withRisk,i)).join('')}</div><footer class="aqd-actions">${action}</footer></section>`;
  }
  function mission(){
   const panel=readonly?'':`<div class="aqd-panel"><button type="button" class="aqd-tile" data-action="cover"><span class="aqd-tile-copy"><strong>${x.menu}</strong><small>${x.s1Menu}</small></span></button><button type="button" class="aqd-tile aqd-tile--go" data-action="next"><span class="aqd-tile-copy"><strong>${x.next}</strong><small>${x.s1Go}</small></span><i aria-hidden="true">${icons.arrow}</i></button></div>`;
   return `${header()}<section class="aqd-screen aqd-mission aqd-mission--remote">${title(x.s1Kicker,x.s1Title,x.s1Accent,'')}${panel}<p class="aqd-watch aqd-watch--note">${x.watch1}</p></section>`;
  }
  /* Round 1 outcome: only the number. Which contracts had a finding is revealed in the comparison. */
  function blindResult(){
   const hits=(state.p1||[]).filter(id=>data.outcomes.get(id)===true).length;
   const action=readonly?'':`<footer class="aqd-actions aqd-actions--center"><button type="button" class="aqd-primary" data-action="next">${x.f1Next} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-feedback-screen"><div class="aqd-feedback aqd-feedback--stack ${animate?'is-animated':''}"><p class="aqd-kicker">${x.f1Kicker}</p><p class="aqd-feedback-score"><b class="aqd-count" style="--to:${hits};--cd:.9s" aria-label="${hits}"></b><span>${x.f1Of}</span></p><p class="aqd-feedback-body">${x.f1Body}</p>${action}</div></section>`;
  }
  /* What the risk score is, before the model runs. */
  function explain(){
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-primary" data-action="next">${x.e1Ok} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-explain-screen">${title(x.e1Kicker,x.e1Title,x.e1Accent,'')}<div class="aqd-tutorial ${animate?'is-animated':''}"><p class="aqd-tutorial-score"><i aria-hidden="true">${icons.up}</i><b class="aqd-count" style="--to:${SAMPLE.risk};--cd:.3s" aria-label="${SAMPLE.risk}"></b><span><strong>${x.e1ScoreHead}</strong><small>${x.e1ScoreBody}</small></span></p><p class="aqd-tutorial-body">${x.e1Body}</p></div>${action}</section>`;
  }
  function analysis(){
   const act=Math.max(0,Math.min(4,Number(state.act)||0)),ready=!!state.analysisReady;
   const play=fresh('tablet-act',`${step}:${act}:${state.take||0}`);
   const main=act>=4?`<button type="button" class="aqd-primary" data-action="next" ${ready?'':'disabled aria-disabled="true"'}>${x.continue} ${icons.arrow}</button>`:`<button type="button" class="aqd-primary" data-action="play">${act?x.s3NextAct:x.s3Play} ${icons.arrow}</button>`;
   const prev=act?`<button type="button" class="aqd-secondary" data-action="replay">${icons.replay} ${act>1?x.s3Prev:x.s3Replay}</button>`:'';
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}${prev}${main}</footer>`;
   return `${header()}<section class="aqd-screen aqd-analysis aqd-analysis--solo ${ready?'is-ready':''}">${title(x.s3Kicker,x.s3Title,x.s3Accent,'')}<div class="aqd-agent-solo">${agent(x,act,play)}</div>${watch(act?tvCopy[lang].s3Captions[act-1]:x.watch3)}${action}</section>`;
  }
  function results(){
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-primary" data-action="next">${x.continue} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-results aqd-results--compact">${title(x.s5Kicker,x.s5Title,x.s5Accent,'')}<div class="aqd-compare ${animate?'is-animated':''}">${resultCard(data,state.p1,x.s5Without,'without',x,true)}<span class="aqd-vs" aria-hidden="true">vs.</span>${resultCard(data,state.p2,x.s5With,'with',x,true)}</div>${watch(x.watch5)}${action}</section>`;
  }
  function impact(){
   const action=readonly?'':`<footer class="aqd-actions">${backBtn()}<button type="button" class="aqd-secondary" data-action="restart">${icons.replay} ${x.again}</button><button type="button" class="aqd-primary" data-action="cover">${x.menu} ${icons.arrow}</button></footer>`;
   return `${header()}<section class="aqd-screen aqd-impact aqd-impact--remote">${title(x.s6Kicker,x.s6Title,x.s6Accent,'')}${watch(x.watch6,true)}${action}</section>`;
  }
  const screen=state.mode!=='game'?landing():step===1?mission():step===2?selection(false):step===3?blindResult():step===4?explain():step===5?analysis():step===6?selection(true):step===7?results():impact();
  return `<main class="aqd-app ${state.mode==='game'?'aqd-app--game':'aqd-app--landing'} ${readonly?'aqd-app--readonly':''}">${screen}${cta()}</main>`;
 }
 function notice(language){return `<aside class="aqd-notice" role="status">${copy[language==='es'?'es':'en'].entered}</aside>`;}
 const tvCopy={
  en:{
   onTablet:'On the tablet',
   landingCta:'Select an option on the tablet',
   infoCta:'When you are ready, tap “Interactive experience” on the tablet',
   /* Information sheet (November 2026 infographic), rebuilt in HTML so it can be animated. */
   sheet:{sub:'Smarter Water Loss Detection',unit:'VPS - INE',
    cards:[['THE','CHALLENGE','Limited Inspection Capacity','Water service providers manage thousands of accounts but can only inspect a fraction, often missing potential irregularities.'],['THE','SOLUTION','AI-Powered Prioritization','AquaData analyzes existing billing and consumption data to rank accounts by risk, helping teams inspect the most critical cases first.']],
    impact:'IMPACT TO DATE',facts:[['7.3 times',['more detection','EMCALI','Cali, Colombia']],['2.3 times',['more detection','Aguas Regionales','Urabá, Colombia']],['53%',['more detection in','Guatemala']]]},
   s1Kicker:'Water Detective',s1Title:'Can you uncover',s1Accent:'water fraud?',
   s1Stats:[['8','Accounts','in the water network'],['3','Inspections','per round'],['2','Rounds','blind and with AI']],
   s1Insight:'Some hide irregularities. Without data, there are no clues.',s1Steps:[['Round 1 · Blind','Choose 3 accounts without any clues, just like a traditional inspection.'],['How AI Works','AquaData reads each account’s consumption and calculates a risk score.'],['Round 2 · With AquaData','Choose again using the scores and compare both results.']],
   s2Kicker:'Round 1 · Decision without data',s2Title:'Select without',s2Accent:'artificial intelligence',s2Hint:'This is how a traditional inspection works: without any clues.',
   f1Kicker:'Round 1 · Result',f1Title:'This is how',f1Accent:'a random inspection works',f1Of:'out of 3 cases found.',f1Insight:'What if AI showed where to look first?',
   e1Kicker:'How AI does it',e1Title:'How AI reads',e1Accent:'each account',
   e1Notes:[['Consumption history','How the account’s consumption has changed.'],['Risk score','How likely it is that fraud exists.']],
   s3Kicker:'AquaData in action',s3Title:'AquaData reads',s3Accent:'each account’s data',
   s3Captions:['Gathers the data the utility already has: billing, meter readings and inspections.','Reads the consumption history of each account.','Detects patterns: a sudden change in consumption is a clue.','Calculates the risk score and ranks the accounts.'],
   s4Kicker:'Round 2 · With AquaData',s4Title:'Choose 3',s4Accent:'using risk scores',s4Hint:'A high score is not proof of fraud.',s4RankTitle:'Risk score: likelihood of an irregularity.',
   s5Kicker:'The result',s5Title:'Same accounts.',s5Accent:'A different perspective.',
   s6Kicker:'Real case · EMCALI, Cali',s6Title:'More findings',s6Accent:'with the same effort',
   s6Facts:[['x7.3','more detection in Cali (EMCALI)'],['x2.3','more detection in Urabá (Aguas Regionales)'],['53 %','more detection in Guatemala']],
   selected:'Your inspections',
   cta:{mission:'Tap “Start” on the tablet',pick:'Tap 3 accounts on the tablet',confirm:'Tap “Confirm inspections” on the tablet',feedback:'Tap “See how AI does it” on the tablet',explain:'Tap “Got it” on the tablet',analysis:'Tap “Play on screen” on the tablet',analysisNext:'Tap “Next step” on the tablet',analysisDone:'Tap “Continue” on the tablet',results:'Tap “Continue” on the tablet',impact:'Play again or go back to the menu'},
   simulation:'Educational simulation · fictitious data'
  },
  es:{
   onTablet:'En la tableta',
   landingCta:'Elige una opción en la tableta',
   infoCta:'Cuando estés listo, pulsa “Experiencia interactiva” en la tableta',
   sheet:{sub:'Detección más inteligente de pérdidas de agua',unit:'VPS - INE',
    cards:[['EL','RETO','Capacidad de inspección limitada','Las empresas de agua gestionan miles de contratos, pero solo pueden inspeccionar una fracción y a menudo pasan por alto posibles irregularidades.'],['LA','SOLUCIÓN','Priorización con IA','AquaData analiza los datos de facturación y consumo para ordenar los contratos por riesgo y que los equipos inspeccionen primero los casos más críticos.']],
    impact:'IMPACTO A LA FECHA',facts:[['7,3 veces',['más detección','EMCALI','Cali, Colombia']],['2,3 veces',['más detección','Aguas Regionales','Urabá, Colombia']],['53 %',['más detección en','Guatemala']]]},
   s1Kicker:'Detective del Agua',s1Title:'¿Puedes encontrar',s1Accent:'el fraude de agua?',
   s1Stats:[['8','Contratos','en la red de agua'],['3','Inspecciones','por ronda'],['2','Rondas','a ciegas y con IA']],
   s1Insight:'Algunos esconden irregularidades. Sin datos, no hay ninguna pista.',s1Steps:[['Ronda 1 · A ciegas','Elige 3 contratos sin ninguna pista, como una inspección tradicional.'],['Cómo funciona la IA','AquaData lee el consumo de cada contrato y calcula un puntaje de riesgo.'],['Ronda 2 · Con AquaData','Elige de nuevo usando los puntajes y compara los dos resultados.']],
   s2Kicker:'Ronda 1 · Decisión sin datos',s2Title:'Elige sin',s2Accent:'inteligencia artificial',s2Hint:'Así trabaja una inspección tradicional: sin ninguna pista.',
   f1Kicker:'Ronda 1 · Resultado',f1Title:'Así funciona',f1Accent:'una inspección al azar',f1Of:'de 3 casos encontrados.',f1Insight:'¿Y si la IA mostrara dónde mirar primero?',
   e1Kicker:'Cómo lo hace la IA',e1Title:'Así lee la IA',e1Accent:'cada contrato',
   e1Notes:[['Historial de consumo','Cómo ha cambiado el consumo del contrato.'],['Puntaje de riesgo','Qué tan probable es que haya fraude.']],
   s3Kicker:'AquaData en acción',s3Title:'AquaData lee',s3Accent:'los datos de cada contrato',
   s3Captions:['Reúne los datos que la empresa ya tiene: facturación, lecturas e inspecciones.','Lee el historial de consumo de cada contrato.','Detecta patrones: un cambio brusco de consumo es una pista.','Calcula el puntaje de riesgo y ordena los contratos.'],
   s4Kicker:'Ronda 2 · Con AquaData',s4Title:'Elige 3',s4Accent:'con puntajes de riesgo',s4Hint:'Un puntaje alto no es prueba de fraude.',s4RankTitle:'Puntaje de riesgo: probabilidad de una irregularidad.',
   s5Kicker:'El resultado',s5Title:'Mismos contratos.',s5Accent:'Distinta forma de mirar.',
   s6Kicker:'Caso real · EMCALI, Cali',s6Title:'Más hallazgos',s6Accent:'con el mismo esfuerzo',
   s6Facts:[['x7,3','más detección en Cali (EMCALI)'],['x2,3','más detección en Urabá (Aguas Regionales)'],['53 %','más detección en Guatemala']],
   selected:'Tus inspecciones',
   cta:{mission:'Pulsa “Comenzar” en la tableta',pick:'Toca 3 contratos en la tableta',confirm:'Pulsa “Confirmar inspecciones” en la tableta',feedback:'Pulsa “Ver cómo lo hace la IA” en la tableta',explain:'Pulsa “Entendido” en la tableta',analysis:'Pulsa “Ver en pantalla” en la tableta',analysisNext:'Pulsa “Siguiente paso” en la tableta',analysisDone:'Pulsa “Continuar” en la tableta',results:'Pulsa “Continuar” en la tableta',impact:'Vuelve a jugar o regresa al menú'},
   simulation:'Simulación educativa · datos ficticios'
  }
 };
 /* TV stage: not a mirror of the tablet. Each screen is a title, one main graphic, one line of insight
    and the call to action, so the story can be followed without looking at the tablet. */
 function renderTv(state,options){
  const {data,station=1}=options;
  const lang='en'; // AquaData runs in English only: no language switch on the tablet or the TV.
  const x=copy[lang],tv=tvCopy[lang];
  const step=Math.max(1,Math.min(LAST_STEP,Number(state.step)||1));
  const picks=step<=ANALYSIS_STEP?(state.p1||[]):(state.p2||[]);
  const chapter=CHAPTER[step];
  const name=c=>c.es;
  const type=c=>lang==='es'?c.esType:c.enType;
  const full=picks.length===MAX_PICKS;
  const animate=fresh('tv',`${state.mode}:${step}`);
  const header=()=>{
   const steps=state.mode==='game'?`<ol class="aqd-steps" aria-hidden="true">${[1,2,3,4,5,6].map(n=>`<li class="${n===chapter?'is-current':n<chapter?'is-done':''}">${n}</li>`).join('')}</ol>`:'';
   return `<header class="aqd-header"><div class="aqd-brand"><img src="${logo}" width="216" height="44" alt="IDB Group"><span class="aqd-brand-divider" aria-hidden="true"></span><span class="aqd-brand-copy"><strong>${x.brand}</strong><small>${x.brandSub}</small></span></div>${steps}<div class="aqd-tools"></div></header>`;
  };
  const cta=(text,extra='')=>`<aside class="aqd-cta ${extra}" role="status"><span class="aqd-cta-icon">${icons.pillTablet}</span><span><small>${tv.onTablet}</small><strong>${text}</strong></span><i aria-hidden="true">${icons.arrow}</i></aside>`;
  const title=(kicker,plain,accent,lead='',joiner=' ')=>`<div class="aqd-title aqd-tv-title"><p class="aqd-kicker">${kicker}</p><h1>${plain}${joiner}<span>${accent}</span></h1>${lead?`<p class="aqd-lead">${lead}</p>`:''}</div>`;
  /* One short line of meaning under the main graphic. */
  const insight=(text,style='',mark=icons.bulb)=>`<p class="aqd-insight" ${style}><i aria-hidden="true">${mark}</i><span>${text}</span></p>`;
  /* Side panel of both rounds: how many inspections are chosen and which ones. */
  const picksPanel=(hint,mark)=>`<aside class="aqd-tv-picks" aria-live="polite"><p>${tv.selected}</p><strong>${picks.length}<small>/${MAX_PICKS}</small></strong>${slots(data,picks)}<span class="aqd-hint"><i aria-hidden="true">${mark}</i>${hint}</span><small>${tv.simulation}</small></aside>`;
  function landing(){
   const card=(head,body,media)=>`<article class="aqd-home-card"><span class="aqd-home-card-copy"><strong>${head}</strong><small>${body}</small></span>${media}</article>`;
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-landing aqd-landing--three"><div class="aqd-landing-grid">${title(x.kicker,'Aqua','Data',x.intro,'')}${card(x.video,x.videoBody,`<img src="${landingArt.video}" alt="" aria-hidden="true">`)}${card(x.info,x.infoBody,`<img src="${landingArt.about}" alt="" aria-hidden="true">`)}${card(x.game,x.gameBody,`<span class="aqd-home-card-icon" aria-hidden="true">${icons.explore}</span>`)}</div></section>${cta(tv.landingCta)}`;
  }
  function mission(){
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-mission">${title(tv.s1Kicker,tv.s1Title,tv.s1Accent)}<ul class="aqd-bigstats ${animate?'is-animated':''}">${tv.s1Stats.map(([n,t,b],i)=>`<li style="--i:${i}"><b>${n}</b><span><strong>${t}</strong><small>${b}</small></span></li>`).join('')}</ul><ol class="aqd-howto ${animate?'is-animated':''}">${tv.s1Steps.map(([t,b],i)=>`<li style="--i:${i}"><i aria-hidden="true">${[icons.search,icons.chip,icons.check][i]}<b>${i+1}</b></i><span><strong>${t}</strong><small>${b}</small></span></li>`).join('')}</ol></section>${cta(tv.cta.mission)}`;
  }
  function manual(){
   const cards=data.contracts.map((c,i)=>`<li class="${picks.includes(c.id)?'is-selected':''}" style="--i:${i}">${glyph(c,'xMinYMax')}<span><b>${c.id} · ${esc(type(c))}</b>${esc(name(c))}</span><i aria-hidden="true">${icons.check}</i></li>`).join('');
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-round aqd-tv-round--blind">${title(tv.s2Kicker,tv.s2Title,tv.s2Accent)}<ul class="aqd-tv-cards ${animate?'is-animated':''}">${cards}</ul>${picksPanel(tv.s2Hint,'?')}</section>${cta(tv.cta[full?'confirm':'pick'])}`;
  }
  /* Round 1 outcome on the TV: the number and the three contracts that were inspected. */
  function blindResult(){
   const hits=(state.p1||[]).filter(id=>data.outcomes.get(id)===true).length;
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-feedback">${title(tv.f1Kicker,tv.f1Title,tv.f1Accent,tv.f1Insight)}<div class="aqd-feedback ${animate?'is-animated':''}"><p class="aqd-feedback-score"><b class="aqd-count" style="--to:${hits};--cd:.9s" aria-label="${hits}"></b><span>${tv.f1Of}</span><small>${tv.simulation}</small></p>${slots(data,state.p1||[],true)}</div></section>${cta(tv.cta.feedback)}`;
  }
  /* How to read a card: the consumption line and the score, on an example contract. */
  function explain(){
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-explain">${title(tv.e1Kicker,tv.e1Title,tv.e1Accent,tv.s4Hint)}<div class="aqd-explain ${animate?'is-animated':''}">${sample(x,animate)}<ol class="aqd-explain-notes">${tv.e1Notes.map(([head,body],i)=>`<li style="--i:${i}"><b>${i+1}</b><span><strong>${head}</strong><small>${body}</small></span></li>`).join('')}</ol></div></section>${cta(tv.cta.explain)}`;
  }
  function analysis(){
   const act=Math.max(0,Math.min(4,Number(state.act)||0));
   const play=fresh('tv-act',`${step}:${act}:${state.take||0}`);
   /* The caption of the current act sits under the title, where the visitor already looks. */
   const caption=act?tv.s3Captions[act-1]:x.s3Intro;
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-analysis"><div class="aqd-title aqd-tv-title"><p class="aqd-kicker">${tv.s3Kicker}</p><h1>${tv.s3Title} <span>${tv.s3Accent}</span></h1><p class="aqd-lead ${play?'is-new':''}" role="status">${caption}</p></div><div class="aqd-agent-grid">${agent(x,act,play)}${scanGrid(data,x,act,play)}</div></section>${cta(tv.cta[act>=4?'analysisDone':act?'analysisNext':'analysis'])}`;
  }
  function withAi(){
   const ranked=[...data.contracts].sort((a,b)=>b.risk-a.risk);
   const rows=ranked.map((c,i)=>`<li class="${picks.includes(c.id)?'is-selected':''} aqd-risk--${riskLevel(c.risk)}" style="--i:${i}"><b>${i+1}</b><span>${esc(name(c))}</span><i style="--value:${c.risk}"></i><em class="aqd-count" style="--to:${c.risk}" aria-label="${c.risk}"></em></li>`).join('');
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-round">${title(tv.s4Kicker,tv.s4Title,tv.s4Accent)}<div class="aqd-tv-ranking"><strong>${tv.s4RankTitle}</strong><ol class="${animate?'is-animated':''}">${rows}</ol></div>${picksPanel(tv.s4Hint,icons.alert)}</section>${cta(tv.cta[full?'confirm':'pick'])}`;
  }
  function results(){
   const found=list=>(list||[]).filter(id=>data.outcomes.get(id)===true).length;
   const r1=found(state.p1),r2=found(state.p2);
   const note=r2>r1?x.s5NoteMore:r2===r1?x.s5NoteSame:x.s5NoteLess;
   return `${header()}<section class="aqd-screen aqd-tv aqd-results">${title(tv.s5Kicker,tv.s5Title,tv.s5Accent,note)}<div class="aqd-compare ${animate?'is-animated':''}">${resultCard(data,state.p1,x.s5Without,'without',x)}<span class="aqd-vs" aria-hidden="true">vs.</span>${resultCard(data,state.p2,x.s5With,'with',x)}</div></section>${cta(tv.cta.results)}`;
  }
  function impact(){
   return `${header()}<section class="aqd-screen aqd-tv aqd-tv-impact">${title(tv.s6Kicker,tv.s6Title,tv.s6Accent,x.s6Quote)}<div class="aqd-impact-grid">${chart(x,lang,animate)}<ul class="aqd-facts ${animate?'is-animated':''}">${tv.s6Facts.map(([n,t],i)=>`<li style="--i:${i}"><b>${n}</b><span>${t}</span></li>`).join('')}</ul></div></section>${cta(tv.cta.impact)}`;
  }
  /* Information sheet, rebuilt from the infographic so each element enters one by one, like the
     animated IDB reference. It covers the PNG, which stays underneath as a fallback. */
  function sheet(){
   const s=tv.sheet;
   const card=([a,b,head,body],i)=>`<article class="aqd-sheet-card aqd-sheet-card--${i?'solution':'challenge'}" style="--d:${(1.8+i*.7).toFixed(1)}s"><h2><span><b>${a}</b> ${b}</span></h2><span class="aqd-sheet-icon" aria-hidden="true">${i?icons.chip:icons.explore}</span><p><strong>${head}</strong>${body}</p></article>`;
   const fact=([n,lines],i)=>`<li style="--i:${i}"><b><span>${n}</span></b><p>${lines.join('<br>')}</p></li>`;
   return `<section class="aqd-sheet ${animate?'is-animated':''}" aria-label="AquaData"><div class="aqd-sheet-stage"><i class="aqd-sheet-veil" aria-hidden="true"></i><div class="aqd-sheet-side"><img class="aqd-sheet-logo" src="${logo}" alt="IDB Group"><div class="aqd-sheet-title"><h1><span>AquaData</span></h1><p class="aqd-sheet-sub"><span>${s.sub}</span></p><p class="aqd-sheet-unit"><span>${s.unit}</span></p></div></div>${s.cards.map(card).join('')}<h2 class="aqd-sheet-impact-title"><span>${s.impact}</span></h2><ul class="aqd-sheet-impact">${s.facts.map(fact).join('')}</ul></div></section>`;
  }
  if(state.mode==='info')return `${sheet()}${cta(tv.infoCta,'aqd-cta--slim')}`;
  const screen=state.mode!=='game'?landing():step===1?mission():step===2?manual():step===3?blindResult():step===4?explain():step===5?analysis():step===6?withAi():step===7?results():impact();
  return `<main class="aqd-app aqd-app--readonly aqd-app--tv">${screen}</main>`;
 }
 window.AQUADATA_VISUAL=Object.freeze({load,render,renderTv,notice,copy,MAX_PICKS});
})();
