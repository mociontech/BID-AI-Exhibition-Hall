# RISE v34

- Source of truth: `original.html`, a byte-for-byte copy of the supplied RISE_Prototipo_v34.html.
- Preserve every screen, text, number, timer, and interaction from that source. Mocion has no accent.
- English is the default. Spanish is for review; use the supplied dictionary.
- Keep TV container units (`cqw`) and tablet pixel units. Do not convert them.
- Toasts expire at 8,300 ms; `.keep` toasts remain until the scene changes.
- No frameworks, bundlers, analytics, additional CDNs, or production dependencies.
- Keep source extraction separate from station integration. Verify both against the original.
- The project entry must open v34 directly. Do not add a cover, gate, footer, or other product UI.
- Validate actual integrated tablet and TV pixels against the original; comparing the extracted preview alone is insufficient.
- Use the existing repository Git history; do not create a nested repository.

## Approved client revision

- Keep the original v34 files intact as the baseline. Apply the approved revision in `client.js` / `client.css` after i18n and before station integration.
- The tablet fills its actual landscape viewport with pixel-based layout; do not scale a fixed 736×552 panel or add black side bands. The TV keeps 16:9 and cqw.
- Show a large simplified/simulated-experience notice at entry. Explain that workflows are illustrative, do not reflect real processes, and clients/deals/data are fictional.
- Supervision presents historical insights for consideration in the analysis. Do not require a next-action selection or imply that the insight obliges a decision.
- Verify both languages, actual tablet sizes, Full HD TV, navigation and toast lifetimes. The approved revised screens intentionally differ from the archived v34.

## Presentation and start interaction

- Keep all approved copy, cases, numbers, insights and downstream stages. Entry uses an open composition without a white card over the mosaic.
- Tablet typography and controls must be proportionate to its actual landscape viewport; keep its layout in px and TV in cqw.
- The opening waits for an explicit tablet touch on Start experience. Preserve the original wall animation after that touch. Replay also waits; language changes never start it.
- During playback use the original full-width mosaic and centered 16cqw counter. Do not crop it to a circle, reduce it to a side column, or cover it with the simulation notice. The notice belongs before playback; the tablet shows the original RISE opening content during playback.
- `opening.js` anchors the original animation clock to `infoStartedAt`, an existing schema-3 timestamp reused for the opening. No new backend state field or transport is needed.
- The requested Figma node could not be read because its connection required reauthentication. The user authorized continuing with the explicit design changes. Do not claim pixel fidelity to that unread node.
