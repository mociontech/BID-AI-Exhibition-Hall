# 10 — VPC Country Intelligence

**Scope:** this is an individual module for the AI Exhibition Hall tablet controller.

- `index.html`: project landing and navigation wrapper.
- `module.js`: the editable location for this project's overview content and mini-game.
- Shared display, tablet UI, navigation and station synchronization are in `../../shared/`.

## Status

Integrated locally from the supplied **Country Intelligence Prototipo.html**. The user's explicit instruction to preserve its dynamics takes precedence over the different Valleverde game described in the pasted brief.

The original sequence remains: Problem → Solution → eight signals → Design → Program → Supervise → Loop. Each comparison lasts 5.2 seconds. Each moment requires one human choice; every offered choice is valid, as in the original. Back navigation, Connect all, and replay are retained. There is no added scoring, source rejection, drag interaction, or 60-second cutoff: those would change the supplied game.

The exhibition wrapper adds two independent options, both active from the start: Information and Minigame. Information shows a separate bilingual infographic about Country Intelligence on TV: scattered evidence → AI connections → human decisions, the three connected capabilities, and more than eight experiments. It does not reuse the minigame screens. There is no unlock timer or prerequisite. Synchronized ES/EN, fullscreen, general Home, and return to the project menu are retained. The original 45-second inactivity reset returns to the project menu with both options available. Absolute server-aligned timestamps preserve comparison progress across tablet/TV reloads. Only the tablet writes state; the display is read-only.

## Local routes

- Tablet: `/projects/10-vpc-country-intelligence/index.html?station=10`.
- TV: `/display.html?station=10`.
- General exhibition menu: `/index.html?station=10&projects=1`.
- The project can also be selected from the existing menu on other paired stations.

Start with `npm start`; the default port is 4173. On Netlify the existing shared transport uses Firebase, including private `room` links.

## Files and resources

- `module.js` uses the existing `mountController` extension in the shared shell.
- `experience.js` owns the tablet lifecycle and the read-only TV renderer.
- `prototype.js` adapts the supplied HTML's views and retains its SVG icons, sector visualization, comparisons, choices, and cycle diagram.
- `module.css` scopes the original design and adds landscape sizing and the exhibition wrapper. Colors come from the supplied prototype and existing blue/white convention. No new raster assets, external fonts, or external dependencies are required at runtime.
- `state.js` validates the shared payload on the server and calculates recoverable progress.
- `translations.js` translates visible prototype text without modifying its choice values or rules.
- Shared changes are limited to loading its renderer in `display.html`, calibrating the shared clock for project 10, and validating its payload in `server.js`. Registry numbering and other project folders are unchanged.

The referenced Country Intelligence case sheet, context document, standalone Valleverde prototype, and original brand manual were not supplied/found. The repository contains a brand text extract with no usable content. Prototype figures remain visible to preserve the supplied experience and are labeled **illustrative simulation values**, rather than validated pilot results. The unsupported 2027 rollout claim was replaced with the provided statement about more than eight experiments.

## Verification

- `node --test tests/smoke.test.js tests/country-intelligence-state.test.cjs`
- `node tests/country-intelligence.browser.cjs` with Playwright available via `NODE_PATH`; use `COUNTRY_URL` to select the running server (default `http://127.0.0.1:4187`).
- `node tests/country-intelligence.audit.cjs` checks all three choices in every scene, both languages, untranslated text, and TV panel overflow.

Browser verification covers two separate contexts (touch tablet at 1024×768 and 1180×820; TV at 1920×1080), immediate game access without opening Information, the independent infographic and reload, individual and bulk signal selection, each comparison and decision, replay, project menu, language synchronization, inactivity, Home, malformed payload rejection, and isolation from station 1. Screenshots and reports are in `verification/`. Physical tablet/TV and Wi-Fi testing remain pending.
