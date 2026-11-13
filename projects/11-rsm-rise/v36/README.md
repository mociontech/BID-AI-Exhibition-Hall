# RISE v36

`original.html` is the byte-for-byte supplied file. `index.html`, `styles.css`, `app.js` and `i18n.js` are a literal extraction. `npm run extract` regenerates only those extracted files from the original.

The live exhibition loads `screen.html` for one device at a time, with the existing local station service. No previous client styling is loaded. See [the integration guide](../README.md) for URLs, behavior and verification.

With the repository server running on port 4191:

```powershell
npm run test:visual
npm test
npm run test:state
```

Tests use an existing Playwright installation; set `PLAYWRIGHT_MODULE` if necessary and `BASE_URL` to override the server. Screenshots and reports are in `artifacts/`. The standalone source preview is `/projects/11-rsm-rise/v36/index.html`; the current paired preview is `/projects/11-rsm-rise/preview.html?station=11&v=36`.
