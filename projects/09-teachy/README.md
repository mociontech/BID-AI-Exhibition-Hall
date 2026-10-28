# 09 — Teachy

**Scope:** this is an individual module for the AI Exhibition Hall tablet controller.

- `index.html`: project landing and navigation wrapper.
- `module.js`: the editable location for this project's overview content and mini-game.
- Shared display, tablet UI, navigation and station synchronization are in `../../shared/`.

## Status

Project-specific interactive content has **not yet been programmed**. Validate the real project journey and approved copy before implementation.

## How to develop

1. Add approved overview content inside `window.ProjectModule.overview` using the six predefined section IDs.
2. Implement `window.ProjectModule.mountMiniGame(container)` for the experience.
3. Connect new interactions to `AI_SYNC.send({ view: 'game', projectId: '09', section: 'your-event-name' })` if content needs to change on the large screen.
4. Test the project from the home menu and with `display.html?station=1` on the same local server.

You can implement this module without modifying the remaining 10 project folders.
