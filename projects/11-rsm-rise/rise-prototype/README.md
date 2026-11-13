# RISE v34 — local prototype

**Archived revision.** The current tablet/TV integration uses `../v36/` and the supplied v36 without the overlays in this folder. Run current integration tests from `../v36/tests/`; these earlier station tests describe the previous schema and UI.

The first commit preserves `index.html` exactly as supplied. This folder uses the existing project Git repository.

Run from this folder with `npm run dev`, or use the repository's `npm run dev` to serve the exhibition and synchronize a tablet with its TV. No installation is needed for the local server.

Inter uses the original Google Fonts URL. The existing font stack falls back to Helvetica Neue, Arial, or sans-serif when offline.

`original.html` preserves the supplied bytes. `styles.css`, `app.js` and `i18n.js` contain the original statements, in the same order; only the enclosing IIFE was removed so both classic scripts share scope. These globals stay isolated inside each device document during station integration.

`npm test` compares 62 screenshot pairs with the original at 1500×900 in EN/ES. Playwright must already exist in the environment; set `PLAYWRIGHT_MODULE` if needed. Reports and screenshots go to `artifacts/`. For the paired exhibition views and tests, see [the project README](../README.md).

`npm run test:integrated` checks 120 captures of the approved client revision across three actual tablet viewports and Full HD TV, in EN/ES. It requires the repository server on port 4191 (`BASE_URL` overrides it). It verifies the simulation/workflow notices, absence of mandatory next-action choices, viewport fit, translations, and toast lifetimes. `client.js`/`client.css` apply the revision without changing this archived v34 preview. Open `../preview.html` for the current paired devices.
