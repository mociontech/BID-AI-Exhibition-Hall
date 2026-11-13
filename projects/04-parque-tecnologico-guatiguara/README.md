# 04 — Parque Tecnológico Guatiguará

Tablet controller + TV for station 04 (English only). Links: tablet `projects/04-parque-tecnologico-guatiguara/index.html?station=4`, TV `display.html?station=4`.

## Files

- `index.html`, `module.js`: tablet controller. It shows the main-menu artwork with touch zones (About the project, Video, Home) and a Back pill while the TV shows the infographic or the video.
- `experience.js`: asset map and TV renderer (`window.GUATIGUARA.renderInto`, called from `shared/display.js`).
- `module.css`: the `gtg-*` (menu, pill, video) and `gts-*` (animated infographic) rules at the end of the file are the current ones.
- `Public/guatiguara-menu-en.png`: main menu, 1920 × 1080 (tablet and TV; the TV adds the "Select an option on the tablet" pill).
- `Public/guatiguara-infografia-en.png`: "About the project" infographic, 1920 × 1080. The TV builds it piece by piece from crops of this PNG over `guatiguara-infografia-base.png` (the same sheet with its content erased).

## Pending: institutional video

The video has not been delivered. Until then, "Video" shows a "Coming soon" screen on the TV. When it arrives:

1. Save it as `Video/<name>.mp4` (H.264 1080p, under 100 MB).
2. Write the file name in `VIDEO_FILE` in `experience.js` and bump the `?v=` versions in `experience.js`, `index.html` and `display.html`.

## If the infographic PNG changes

Re-measure the `SHEET` boxes in `experience.js` and regenerate `guatiguara-infografia-base.png` by erasing those same boxes.
