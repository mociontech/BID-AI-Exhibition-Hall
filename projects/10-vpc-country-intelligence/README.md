# 10 — Country Intelligence / AI-Powered Country Strategies

Integration of the approved `AI-powered_Country_Strategies_Prototipo_v51.html` for the GitHub/Netlify exhibition. The existing shared Firebase transport, private room links and other projects are preserved.

## Review locally

- Tablet: http://localhost:4187/projects/10-vpc-country-intelligence/index.html?station=10
- Large display: http://localhost:4187/display.html?station=10
- General projects: http://localhost:4187/projects/10-vpc-country-intelligence/index.html?station=10&projects=1

From the exhibition repository root, use `$env:PORT='4187'; npm start` in PowerShell. Keep the tablet and display on the same station number.

## Cover and infographic

The tablet cover contains only Home, About the project and Interactive experience. Selecting About the project leaves the tablet cover unchanged apart from a blue perimeter on that card; the supplied infographic animates exclusively on the large display. Selecting the card again replays the animation. The seven-second reveal follows `Iniciativa 2.2_animada_PRO.mp4`; reduced motion shows all content immediately. The supplied PNGs and extracted visuals remain in `assets/`.

## Interactive experience — v51

`v51/source.html` is a byte-identical copy of the supplied HTML. Its SHA-256 is `0DF0C4DFB9F6565832134D2ABA4F3A25983344B7CB8486E119784F33E90B3F67`.

The original scene styles and both original scripts are embedded in `v51/device.html`. The device page isolates the TV and tablet roots in separate same-origin frames. Original English copy, map, embedded imagery, sector rules, disabled options, choices, animations and timing are retained. The exhibition is English-only: the EN/ES selector is removed, and saved Spanish preferences are ignored. The supplied source file remains unchanged. Inter fonts are stored locally; runtime does not require Google Fonts.

Original sequence: intro → challenge → country selection (26 countries) → country strategy cycle → design transition → eight signals → design comparison and choice → programming transition → programming comparison and choice → supervision comparison and choice → final impact. Comparisons last 3.2 seconds. Design and supervision include the original 6.5-second reading phase; programming opens its decision without that extra phase. Only Education is enabled in the design choice, and programming retains five choices. No scoring or additional eligibility rules were introduced.

Exhibition adaptations:

- The demonstration project grid is replaced by the existing exhibition navigation. Interactive experience opens the original intro directly.
- Back and Home pills appear in the tablet header. Back returns to the Country Intelligence cover; Home opens all exhibition projects. Original scene-level Back and replay controls remain.
- Only the tablet owns transitions and sends state. The large display consumes state and has no active controls.
- Country, signals, choices and phase timestamps synchronize through the existing station server. Reloading the tablet resumes comparisons and reading phases. Transition timers use elapsed time on recovery.
- The interactive experience retains its original one-minute inactivity timeout and returns to the project cover. The existing cover/infographic inactivity behavior is unchanged.

`v51/bridge.inc.js` contains only the pairing, navigation and recovery adapter. `v51/device.css` isolates the device roots and styles the added navigation. Rebuild the generated device page after changing either adapter file:

```powershell
python projects/10-vpc-country-intelligence/v51/build.py
```

`experience.js` owns the cover, infographic and paired frames. `state.js` validates both the exhibition wrapper and the v51 snapshot. The prior `prototype.js` and `translations.js` remain as legacy resources; they do not render the v51 experience.

## Verification

With Playwright available through `NODE_PATH`, optionally set `CHROMIUM_PATH` to an installed Chromium executable and `COUNTRY_URL` to a different local server.

```powershell
node --test tests/smoke.test.js tests/country-intelligence-state.test.cjs
node tests/country-intelligence.browser.cjs
node tests/country-intelligence.audit.cjs
node projects/10-vpc-country-intelligence/verification/presentation-check.cjs
```

The interaction test traverses the full v51 sequence across separate tablet and TV pages, including country selection, reload during a comparison, disabled choices, programming option five, automatic transitions, replay, Back, Home, infographic selection and station isolation. The audit compares English scene text against the original supplied renderer at 1024×768 and 1180×820, including restored EN and ES state (44 comparisons), confirms that no language selector is rendered,, checks tablet layout overflow and verifies local Inter loading. Reports and screenshots are in `verification/`. Physical tablet, TV and Wi-Fi checks remain for onsite review.