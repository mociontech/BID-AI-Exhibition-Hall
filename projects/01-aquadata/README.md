# 01 — AquaData

Tablet controller for the AquaData station. The TV (`display.html`) is rendered by `../../shared/display.js` from the station state.

## Files

- `index.html`: wrapper; loads `aquadata.css` and `module.js`.
- `module.js`: all tablet screens (landing, information, six-stage mini-game), bilingual copy (ES/EN), timers and the state sent through `AI_SYNC`.
- `aquadata.css`: 2026 Figma look (blue header, Inter, blue/black titles). Every rule is scoped to `.aqd-*`.
- `aquadata/`: landing card photos (`card-*.jpg`) and the white IDB Group logo used by the header. The Figma reference PNGs are kept out of the repo.
- `AquaData_12_Imagenes_Ligeras_JPG/`: business photos (`negocios/`), `contratos_ficticios.json` (8 fictional contracts with risk scores) and `hallazgos_simulados_DEMO.json` (simulated field outcomes). The ES/EN JPGs are still used by the TV mirror.
- `ahorasi/`: technical sheets shown on the TV. The file named "Inteligencia para el Agua" is the English sheet; "Infografía ... IA para el agua" is the Spanish one.

## Flow

1. Landing: Information and Interactive experience (both always available). The TV shows the two options with a call to action; the tablet landing cards use `aquadata/card-information.jpg` and `aquadata/card-experience.jpg`.
2. Information: the tablet shows a small notice, the TV shows the technical sheet in the chosen language with a slim call to action at the bottom.
3. Game (tablet, with Back buttons on every step): mission → selection without AI → analysis (3.2 s bar) → selection with AquaData → results → documented EMCALI case. The TV does not mirror the tablet: it shows guide screens per stage (manual round, AquaData ranking, comparison, real results) with instructions. Both rounds use the same eight businesses; selections are independent and results are computed from `hallazgos_simulados_DEMO.json`.
4. Results are fictional (educational simulation). The 1.4 % / 11.6 % EMCALI figures live only on the last screen.

State packet: `{view, projectId:'01', section, language, mode:'landing'|'info'|'cta'|'game', screenIndex, game:{step,p1,p2,p1Result,p2Result}}`.

## Test

```
npm start
http://localhost:4173/projects/01-aquadata/index.html?station=1
http://localhost:4173/display.html?station=1
```
