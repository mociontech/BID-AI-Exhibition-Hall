# 01 — AquaData

Tablet controller for the AquaData station. The TV (`display.html`) is rendered by `../../shared/display.js` from the station state.

## Files

- `index.html`: wrapper; loads `aquadata.css` and `module.js`.
- `module.js`: all tablet screens (landing, information, six-stage mini-game), bilingual copy (ES/EN, kept for later), timers and the state sent through `AI_SYNC`.
- Language: AquaData runs in English only (November 2026). The top bar has no ES/EN selector on the tablet or the TV, only Back and Home; `visual.js` fixes `lang` to `en`, and the Spanish copy stays in the file in case it is needed again.
- `aquadata.css`: 2026 Figma look (blue header, Inter, blue/black titles). Every rule is scoped to `.aqd-*`.
- `aquadata/`: landing card photos (`card-video.png`, `card-about.png`, exported from Figma) and the white IDB Group logo used by the header. `card-information.jpg` and `card-experience.jpg` belong to the previous landing and are no longer shown. The Figma reference PNGs are kept out of the repo.
- `video/`: `AquaData_V3_web.mp4` (compressed from `AquaData_V3 final.mp4`: H.264 1080p about 4 Mbps, AAC 128 kbps, faststart, 73 MB instead of 280 MB), played full screen on the TV when the visitor taps “Video” (path in `AQUADATA.videoPath()`, `../../shared/aquadata.js`).
- `AquaData_12_Imagenes_Ligeras_JPG/`: business photos (`negocios/`, no longer shown in the game since the November 2026 redesign), `contratos_ficticios.json` (8 fictional contracts with risk scores) and `hallazgos_simulados_DEMO.json` (simulated field outcomes). The ES/EN JPGs are still used by the TV mirror.
- Game customers and icons: `visual.js` overrides the names and types of the eight contracts with the redesign roster (`ROSTER`) and draws each one with a minimalist icon (`BIZ`, exported from Figma). Risk scores and simulated outcomes still come from the two JSON files, so the game logic is unchanged.
- `ahorasi/`: the TV information sheet. It is the source of the animated HTML sheet and its fallback: `AquaData_Infografia_TV_1920x1080.png` (November 2026 version: challenge, solution and impact to date, VPS · INE); the two older sheets are kept for reference.

## Flow

1. Landing (November 2026): the tablet shows the supplied main menu `aquadata/menu-principal-en.png` (1920 × 1080, pixel for pixel) with touch zones over Home, Video, About the project and Interactive experience (`menu()` in `visual.js`, `.aqd-menu-*` styles); while the TV shows the video or the sheet, a Back pill appears next to Home. The TV shows the same three cards in HTML with a call to action; its About photo, `aquadata/card-about.png`, is cropped from the menu artwork. The cards do not change when tapped: no active frame and no badge.
2. Video: the TV plays the AquaData video full screen and in a loop. Back or Home returns to the landing.
3. About the project: the TV shows the information sheet, rebuilt in HTML from the infographic (`sheet()` in `visual.js`, `.aqd-sheet-*` styles) and animated element by element like the IDB reference video: the blue panel sweeps in, the title rises, then the challenge, the solution and each impact figure. It plays once; a language switch shows it complete. The PNG stays underneath as a fallback. The call to action appears when the sheet is complete.
4. Game (tablet, with Back buttons on every step): mission → selection without AI → round-1 result (only the number) → how to read the risk score → analysis (four acts played on the TV one at a time from the tablet, with “Play on screen / Next step” and “Previous step” to replay: collects the data, reads consumption, detects patterns, scores and ranks; “Continue” unlocks about 10 s after the last act) → selection with AquaData → results → documented EMCALI case. The TV does not mirror the tablet: it shows guide screens per stage (manual round, AquaData ranking, comparison, real results) with instructions. Both rounds use the same eight businesses; selections are independent and results are computed from `hallazgos_simulados_DEMO.json`.
5. Results are fictional (educational simulation). The 1.4 % / 11.6 % EMCALI figures live only on the last screen, next to the impact figures of the information sheet (x7.3 Cali, x2.3 Urabá, 53 % Guatemala).

State packet: `{view, projectId:'01', section, language, mode:'landing'|'info'|'video'|'cta'|'game', screenIndex, game:{step (1–8),p1,p2,p1Result,p2Result,act (0–4, analysis act shown on the TV),take (counter so a repeated act plays again)}}`.

## Test

```
npm start
http://localhost:4173/projects/01-aquadata/index.html?station=1
http://localhost:4173/display.html?station=1
```
