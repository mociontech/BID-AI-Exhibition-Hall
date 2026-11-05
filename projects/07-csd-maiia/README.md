# 07 - MAIIA

English tablet controller and passive TV, using the approved screens from `Maiia.zip`.

## Artwork and interaction

The 18 original PNGs live in `assets/branding/`, unchanged at 1920 x 1080. `source-manifest.json` records their archive paths and SHA-256 hashes. No images are recompressed or resized on disk.

`artwork.js` places each screen on a proportional 1920 x 1080 artboard. Transparent, keyboard-focusable buttons sit over the existing button artwork. Header Back uses the supplied Back button artwork; the logo returns Home. Fullscreen remains available. The artboard scales to fit the viewport without cropping.

Live SVG maps replace the example maps inside the same image bounds, so visitor drawings, markers, AI suggestions and answers stay interactive and synchronized. HTML overlays replace example scores and counters with actual game results. Clearer informal-settlement objectives are retained. The incorrect Bogotá project label in the supplied cover is corrected to MAIIA.

The activation step and final tablet map reuse the supplied visual elements because the ZIP has no dedicated designs for these states. The final tablet map shows reference zones, assisted selections and original manual markers; the TV shows the score comparison. Answers remain hidden during the unassisted hard level and its review. Both devices animate the scan from the same clock. Information and Simulation are available immediately.

The production interface stays in English, including restored Spanish sessions. Spanish copy remains in the legacy renderer as a reference, with no language switch in this artwork flow. Navigation preserves station and room identifiers. Original project ID, scoring, freehand input and sync transport remain unchanged.

## Local preview

Run `npm start` from the repository root, then open:

- Tablet: http://localhost:4173/projects/07-csd-maiia/index.html?station=7
- TV: http://localhost:4173/display.html?station=7

Use the same `station` and optional `room` query on paired devices. For separate devices, replace localhost with the server's LAN address.

## Verification

- `node --test tests/*.test.js`: repository regressions and original asset hashes.
- `verify.cjs`: complete two-screen flow, freehand touch/mouse, keyboard fallback, genuine scores, activation, scan, replay and station isolation.
- `verify-navigation.cjs`: Home/Back with pending writes or a simulated outage, including private rooms.
- `verify-hosting.cjs`: public-hosting transport with isolated Firebase responses; never writes visitor sessions.
- `visual-audit.cjs`: 99 screen/viewport combinations, PNG dimensions, proportional geometry, live-text clipping, passive TV and touch targets.

Browser checks use an external Playwright installation through `NODE_PATH` and `TEST_URL` for the preview server, without adding runtime dependencies.
