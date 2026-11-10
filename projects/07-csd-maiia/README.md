# 07 - MAIIA

English tablet controller and passive TV, using the approved screens from `Maiia.zip`.

## Client-approved maps (local revision)

`assets/maps/` contains the four original AMA PNGs supplied by the client, without recompression. Its manifest records dimensions, SHA-256 hashes and registration transforms. AMA-01 is the clean level-1 map and AMA-02 its approved reference; AMA-03 is the clean territory map and AMA-04 its approved references. The artwork PNGs remain unchanged.

`data/demo-maps.json` now has one approved close-up contour and eleven territorial contours, aligned from the reference game's digital paths to the clean supplied images using feature registration. All assisted candidates refer to those approved contours; the old fabricated false candidates are removed. The scan remains illustrative rather than a live model inference.

Level 2 has no pin-count limit. Its counter reports pins placed, while results use the number of approved areas as their denominator. Each area counts once; outside/repeated pins retain the existing error penalty. Both browser and local server validate/recompute the same geometry. A map-version field prevents restoring old invented-map sessions against the new references.

The level-2 review grades only the visitor's pins on both devices: green check for a correct first hit, red cross outside approved areas, amber repeat symbol for a previously counted area. The legend reports each count. Unmarked settlement outlines remain hidden before AI. On the final tablet map, white outlines show all approved areas, green shapes show assisted choices, and the same graded pins remain visible.

Every map shows approximate equivalent viewing height and a responsive distance bar: about 3 km / 250 m for the close-up, about 10 km / 1 km for the territory. Heights use the reference game's approximate ground extent and 60-degree field of view, not satellite altitude. Bar length is calculated from the visible ground width and rendered map width, including resizing and the zoom animation. No 1:X display scale is shown.

## Artwork and interaction

The 18 original PNGs live in `assets/branding/`, unchanged at 1920 x 1080. `source-manifest.json` records their archive paths and SHA-256 hashes. No images are recompressed or resized on disk.

`artwork.js` places each screen on a proportional 1920 x 1080 artboard. Transparent, keyboard-focusable buttons sit over the existing button artwork. Header Back uses the supplied Back button artwork; the logo returns Home. Fullscreen remains available. The artboard scales to fit the viewport without cropping.

Live SVG maps replace the example maps, so visitor drawings, markers, AI suggestions and answers stay interactive and synchronized. HTML overlays replace example scores and counters with actual game results. Clearer informal-settlement objectives are retained. The incorrect Bogotá project label in the supplied cover is corrected to MAIIA.

The activation step and final tablet map reuse the supplied visual elements because the ZIP has no dedicated designs for these states. The final tablet map shows reference zones, assisted selections and original manual markers; the TV shows the score comparison. Answers remain hidden during the unassisted hard level and its review. Both devices animate the scan from the same clock. Information and Simulation are available immediately.

The interface stays in English, including restored Spanish sessions. Spanish copy remains in the legacy renderer as a reference, with no language switch in this artwork flow. Navigation preserves station and room identifiers. Project ID, freehand input and sync transport remain unchanged; scoring now uses the approved area count.

## Map proportions

The TV fits the full map inside the large left-hand 1296 x 729 area, preserving the source photo proportions, with a 480 px instruction panel on the right. This applies to the welcome, game introduction, levels, individual results, activation and scan. The information sheet and final score comparison keep their supplied layouts.

Interactive and review maps on the tablet fit inside 1240 x 697.5. The full approved image remains visible without stretching or cropping settlements. Existing button artwork is reused with transparent hit areas. Normalized coordinates preserve drawing and marker alignment between devices. Landing, introduction and information maps also use the approved imagery.

Entering level 2 animates the SVG camera from the registered close-up extent to the full territory over 3.2 seconds on both devices. The high-resolution close-up fades over the matching territory crop. The tablet uses the shared `territoryAt` timestamp; a TV receiving the transition plays its full zoom locally so latency cannot skip it. Subsequent snapshots preserve playback progress; opening an already active territory view does not replay it. Pointer coordinates follow the moving camera; reduced-motion users see the final view immediately. `verify-territory-zoom.cjs` checks this transition and marker alignment.

## Visitor voice

English game copy uses conversational questions, short actions and natural transitions throughout the welcome, drawing, wider search, AI activation, scan, review and comparison. Tablet prompts remain brief; the TV provides context. Text overlays also replace baked-in welcome and final captions without changing the approved PNG files. Results describe the actual score change; they do not congratulate automatically or claim the AI found more areas merely because its score improved. Scoring, map gestures and the pre-AI answer restriction stay unchanged.

## Local preview

Run `npm start` from the repository root, then open:

- Tablet: http://localhost:4173/projects/07-csd-maiia/index.html?station=7
- TV: http://localhost:4173/display.html?station=7

Use the same `station` and optional `room` query on paired devices. For separate devices, replace localhost with the server's LAN address.

## Verification

- `node --test tests/*.test.js`: repository regressions and original asset hashes.
- `verify.cjs` / `verify-approved-maps.cjs`: local two-screen flow, freehand gesture, more than five touch pins, removal, approved geometry, true scale bars, activation, scan, final maps, replay, Home and station isolation. Screenshots and report go to the OS temporary directory.
- `verify-navigation.cjs`: Home/Back with pending writes or a simulated outage, including private rooms.
- `verify-hosting.cjs`: public-hosting transport with isolated Firebase responses; never writes visitor sessions.
- `visual-audit.cjs`: 99 screen/viewport combinations, PNG dimensions, proportional geometry, live-text clipping, passive TV and touch targets.

Browser checks use an external Playwright installation through `NODE_PATH` and `TEST_URL` for the preview server, without adding runtime dependencies.
