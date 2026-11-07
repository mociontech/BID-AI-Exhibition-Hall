# RegLAC - Institutional video

Updated 2026-11-06 after client feedback: the minigame has been replaced by an institutional video placeholder.

## Current experience

- Landing: Information and Institutional video, both immediately available.
- Information: the existing project information appears on TV; the tablet remains the controller.
- Video: TV shows "The RegLAC institutional video will appear here"; the tablet identifies the reserved space on TV. Both indicate the asset is awaiting delivery.
- English by default, Spanish available. Language and navigation synchronize using the existing station/room transport.
- Home returns to Projects; Back returns to the project landing (or to Projects when already on landing).
- Saved game/results states migrate to the video placeholder. Saved info/CTA states migrate to information. New packets have game:null.
- No playback controls or fake media URL until an actual video is provided.

## Pending content

Client-provided institutional video, including approved language versions/subtitles. No replacement footage or institutional script has been invented.

## Verification

From the repository root, with Playwright available through NODE_PATH:

```powershell
node projects/06-reglac/verify.cjs
```

This starts and stops its own local server, verifies tablet/TV pairing in ES/EN, reload, old saved-state migration, navigation, no game UI, landscape layouts, and independent station state. Screenshots go to the system temporary directory.

The previous game source assets, state.js/state.test.cjs, old cloud/visual audits and figma-editable/ are retained as historical references, not part of the current user flow. state.js also keeps server-side compatibility with older clients. Figma game frames have not been changed by this code update.

## Links

- Tablet: https://bidaiinaction.netlify.app/projects/06-reglac/index.html?station=6
- TV: https://bidaiinaction.netlify.app/display.html?station=6
