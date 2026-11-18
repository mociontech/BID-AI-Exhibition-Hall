# 04 — Parque Tecnológico Guatiguará

Tablet controller + TV for station 04 (English only). Links: tablet `projects/04-parque-tecnologico-guatiguara/index.html?station=4`, TV `display.html?station=4`.

## Files

- `index.html`, `module.js`: tablet controller. It shows the main-menu artwork with touch zones (About the project, Video, Home) and a Back pill while the TV shows the infographic or the video.
- `experience.js`: asset map and TV renderer (`window.GUATIGUARA.renderInto`, called from `shared/display.js`).
- `module.css`: the `gtg-*` (menu, pill, video) and `gts-*` (animated infographic) rules at the end of the file are the current ones.
- `Public/guatiguara-menu-en.png`: main menu, 1920 × 1080 (tablet and TV; the TV adds the "Select an option on the tablet" pill).
- `Public/guatiguara-infografia-en.png`: "About the project" infographic, 1920 × 1080. The TV builds it piece by piece from crops of this PNG over `guatiguara-infografia-base.png` (the same sheet with its content erased).

## Institutional video

`Video/guatiguara.mp4` is the web-optimized version of the revised institutional video supplied as `Parque Tecnológico Guatiguará F.mp4` (41,350,324 bytes). It preserves the full 74.36-second duration, 1920 x 1080 resolution and stereo audio, encoded as H.264/AAC with fast-start metadata. The original file in Downloads is preserved.

From the repository root, run `npm start`, then open both:

- Tablet controller: http://localhost:4173/projects/04-parque-tecnologico-guatiguara/index.html?station=4
- TV display: http://localhost:4173/display.html?station=4

Tap **Video** on the tablet to play it full screen in a loop on the TV. **Back** returns to the project menu. If the browser blocks audio autoplay, playback falls back to muted video. The TV has no interactive controls; all visitor interaction takes place on the tablet.

The video is configured by `VIDEO_FILE` in `experience.js`. When replacing it, update that file name and the experience script cache versions in `experience.js`, `index.html` and `display.html`.

## If the infographic PNG changes

Re-measure the `SHEET` boxes in `experience.js` and regenerate `guatiguara-infografia-base.png` by erasing those same boxes.
