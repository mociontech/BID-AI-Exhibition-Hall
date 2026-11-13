# Animated information screen — local review

Reference: `Iniciativa 2.2_animada_PRO.mp4` (approximately ten seconds). The reference's blue panel contracts to its final column; the logo/title and subsequent content blocks reveal in sequence, then hold for reading.

Profe Gabi follows that motion language with its own approved `tv-information-en.png`. It reveals the blue panel, logo, title, subtitle, challenge, solution and impact metrics over 4.6 seconds, then holds the complete original image. No video, replacement text, generated art or recompressed image is used. Each animated fragment displays an unchanged region of the original PNG.

Clicking About the project leaves the tablet on its cover and starts the TV animation. Clicking it again replays the entrance through the existing synchronized `screenIndex` field (cycling within its supported 1–9 range). Information never gates Interactive Experience. Navigating to the game or Home removes the animation. Normal station heartbeat updates do not restart it. Reduced-motion preferences show the complete infographic immediately.

Verification: `node projects/05-profe-gabi/source/verify-info-motion.cjs` with the existing external Playwright installation. Screenshots and `report.json` cover entry, staggered reveal, completion, replay, navigation and reduced motion. Completed and reduced-motion HD screenshots were additionally compared pixel-for-pixel with the original PNG and matched exactly.

This animation and the tablet hint were reviewed locally and approved for publication on 2026-11-13. The supplied Start button is now labeled Home with a native text overlay, retaining its original outline/icon and general-menu navigation.

## Tablet instruction banner

The user approved the exact message: “When you are ready, tap ‘Interactive experience’ on the tablet” (rendered with double curly quotation marks around the option). A native blue pill with tablet and downward arrow icons is centered under the infographic's right content column, below all original metrics. It fades in after the 4.6-second entrance and remains visible. With reduced motion it is shown immediately. The original image file is untouched; only the bottom empty area has the added HTML overlay. Placement and lack of clipping are checked at 1280, 1920 and 3840-pixel widths.
