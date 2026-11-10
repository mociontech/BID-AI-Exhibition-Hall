/* Minimal outline icons for PredictToDo (24×24 grid, single stroke, currentColor).
   GAME_DATA.json keeps its emoji ids untouched; these replace them only on screen. */
(function(){
 const paths={
  car:'<path d="M3.5 15.5v-3l2.2-5A1.6 1.6 0 0 1 7.2 6.5h9.6a1.6 1.6 0 0 1 1.5 1l2.2 5v3"/><path d="M3.5 15.5h17"/><path d="M6.5 12h11"/><circle cx="7.5" cy="17.8" r="1.8"/><circle cx="16.5" cy="17.8" r="1.8"/>',
  ball:'<circle cx="12" cy="12" r="9"/><path d="M12 7.6l3.4 2.5-1.3 4h-4.2l-1.3-4z"/><path d="M12 7.6V3M15.4 10.1l4-1.3M14.1 14.1l2.5 3.5M9.9 14.1l-2.5 3.5M8.6 10.1l-4-1.3"/>',
  exit:'<path d="M13 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5"/><path d="M4 12h10"/><path d="M10.5 8.5 14 12l-3.5 3.5"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  signal:'<rect x="8" y="2.5" width="8" height="19" rx="3"/><circle cx="12" cy="7" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="17" r="1.6"/>',
  arrows:'<path d="M4 8h12"/><path d="M13 5l3 3-3 3"/><path d="M20 16H8"/><path d="M11 13l-3 3 3 3"/>',
  officer:'<circle cx="12" cy="10" r="3.2"/><path d="M7.5 8.4h9"/><path d="M9.3 8.4a2.7 2.7 0 0 1 5.4 0"/><path d="M5 20.5a7 7 0 0 1 14 0"/>',
  eye:'<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="3"/>',
  chart:'<path d="M4 20h16"/><path d="M5 16l4.5-5 3.5 3 6-7"/><path d="M15.5 7H19v3.5"/>',
  monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/><path d="M7 12l3-3 3 2 4-4"/>',
  badge:'<path d="M12 3l7 3v5.5c0 4.6-3 8.1-7 9.5-4-1.4-7-4.9-7-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
  user:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  pin:'<path d="M12 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21 12 21z"/><circle cx="12" cy="10" r="2.5"/>',
  sliders:'<path d="M4 7h8"/><path d="M17 7h3"/><circle cx="14.5" cy="7" r="2.2"/><path d="M4 17h3"/><path d="M12 17h8"/><circle cx="9.5" cy="17" r="2.2"/>',
  star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8z"/>',
  flag:'<path d="M5 21V4"/><path d="M5 4h12l-2.5 4 2.5 4H5"/>',
  network:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="9" r="2.5"/><circle cx="9" cy="18" r="2.5"/><path d="M8.4 6.6l7.2 1.8M6.6 8.4l1.8 7.2M10.8 16.2l5.4-5.4"/>',
  tablet:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  bulb:'<path d="M9 18h6"/><path d="M10 21h4"/><path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.9.8-1.5 1.6-1.5 3.5h-4c0-1.9-.6-2.7-1.5-3.5z"/>'
 };
 const svg=(name,className='')=>`<svg class="ptd-icon ptd-icon--${name}${className?' '+className:''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.pin}</svg>`;
 const scenarios={cali_peak:'car',campin_arrival:'ball',campin_exit:'exit',calle100_quiet:'moon'};
 const actions={signals:'signal',reversible:'arrows',agents:'officer',monitor:'eye'};
 const roles={valentina:'chart',camila:'monitor',santiago:'signal',andres:'badge'};
 const steps=['pin','sliders','star','flag'];
 window.PREDICTTODO_ICONS=Object.freeze({
  svg,names:Object.keys(paths),
  scenario:(id,className)=>svg(scenarios[id]||'pin',className),
  action:(id,className)=>svg(actions[id]||'eye',className),
  role:(id,className)=>svg(roles[id]||'user',className),
  step:(index,className)=>svg(steps[index]||'star',className)
 });
})();
