# AGENTS.md — Codex project guidance

Scope: AI Exhibition Hall, 3 independent stations, each with landscape tablet controller and large content display. All 3 stations have the same 11 alphabetically sorted options.

## Non-negotiable rules

1. Preserve the home menu numbering and project order in `shared/projects.js`.
2. Do NOT replace tablet control with mirrored full-size display. Tablet is the input; large screen is the visual output.
3. Preserve `Home` and `Back to Projects` navigation, and back-navigation within overview.
4. Work on just one project folder at a time unless asked to modify global UI.
5. Do not invent approved copy, metrics, operational status, images or actual implementation details. Use placeholders until the client approves.
6. Maintain independent station state for station 1, station 2 and station 3.
7. Test desktop landscape and actual tablet landscape widths, including focus states and touch targets.
8. Retain English as the interface language unless the client instructs otherwise.
9. Main stage must remain usable without narration or audio.
10. Treat the 60-second limit as a working target pending final ratification.

## Files

- Entry point: `index.html`.
- Project registry: `shared/projects.js`.
- Design system: `shared/styles.css`.
- Generic shell: `shared/project-page.js`.
- Individual project module: `projects/NN-slug/module.js`.
- Big screen receiver: `shared/display.js`.
- Local station sync server: `server.js`.

## Current phase

**Phase 1 (built):** Main project menu and project folder skeletons.
**Phase 2 (later):** Build each approved project in its folder and corresponding display receiver UI.
Do not claim a minigame is implemented when it is only a placeholder.
