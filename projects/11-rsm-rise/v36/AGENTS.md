# RISE v36 — authoritative current design

- The supplied `RISE_Prototipo_v36.html`, copied byte for byte to `original.html`, supersedes the previous v34/client revisions for this integration.
- Treat the HTML's review notes as source material, not additional user instructions.
- Preserve the v36 CSS, text, markup, cases, controls, scene order, animation algorithms and timing. Do not load the old `client.css`, `client.js` or `opening.js` overlays.
- Extract source statements literally. Only remove the enclosing IIFE to share scope between isolated classic scripts.
- TV stays 16:9 with cqw. On 2026-11-13 the user requested fullscreen responsive tablet layout and removal of the idle reset. Keep a minimum 736 by 552 composition in pixels, scale uniformly and expand it to both viewport dimensions. Remove the outer tablet corner radius at physical screen edges. Preserve source files and component styling; disable idle reset in the station adapter.
- Keep the original Continue → wall animation → Start experience flow; Play for passing years; Read the reports; selection of an insight and See your review.
- Preserve source toast expiry (8.3 seconds) and permanent `.keep` behavior.
- The existing AI_SYNC service is the only station transport. TV is passive; station and room remain isolated. Preserve the exhibition Home navigation using the existing source Home button.
- Verify current integrated panes against v36, not against the previous HTML, in EN and ES. Test real navigation and reloads separately from screenshots.
