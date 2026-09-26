# Phase B: one app, one save

Branch `claude/build-shell`. It merges `claude/nifty-rubin-c0d431`; the only conflicts were `?v=` stamps.

## The save (`js/shared/save.js`, shared-api section 11)
- **Layout.** A root key, `njg-save`, lists the players. Each player has one key per namespace, `njg-save:<player>:<ns>`:
  - `cook`: word stages, stars, coins; Find it's and Dress up's parts;
  - `ui`: personal bests, onboarding flags, the clinic;
  - `speech`: voice enrolment;
  - `shell`: `firstDone`.

  It stays on localStorage, so every mode's synchronous load and save is unchanged.
- **Adapters.** Cook: `core.js`. Clinic, results and onboarding: `UIStore`. Speech: `speech.js`. The lab harnesses load the save too.
- **Migration** runs as versioned schema steps. Every old key (`njg-cook-v1`, `njg-shared-ui-fallback-v1`, `njg-speech-enrol-v1`, `njg_quilt_v1`) becomes "Player 1". Old keys are kept. Corrupt keys are skipped. A lost root is rebuilt.
- **Safety.** Every storage access is in try/catch. If storage is blocked or full, play carries on in memory.
- **Parent export/import.** Hold ⚙ for 1.5 s to open "Grown-ups": save or load a JSON copy.

## Navigation: by page
`index.html` is Nani's house. It has doors for Cook, Find it and the clinic, plus "coming soon" lab doors with `?labs=1`. A door opens `mode.html?app=1`.

Why pages: Cook and Find it share globals, and Phaser's WebGL context and timers don't unmount cleanly. A fresh page frees everything, leaves every mode's code and tests untouched, and keeps the old URLs working on the same save.

To avoid a flash, a render-blocking `css/shared/app.css` paints the house colour first, and pages cross-fade with view transitions. Every mode gets the same ⌂ in the player's colour. A "Who's playing?" picker appears when there are several children.

## First-launch hook
A player without `firstDone` (a new device, or a newly added child) goes to one URL, `FIRST` in `js/home.js`. Today that's Cook's pantry round (`cook.html?app=1&first=1`): one play button, then the pantry order, then the house.

The character/Eid session swaps that URL. Shared-api section 12 gives its contract.

## Tests: all pass
- **Node:** 11 save tests covering migration, round trip, import merge, blocked storage and recovery. All 9 `test_shared_*.mjs` pass.
- **`test_shell.py`** at phone, iPad and laptop:
  - first launch → house → clinic → home → Cook;
  - progress kept after a reload;
  - a second player with their own save;
  - migration from a pre-shell device;
  - export, the labs doors, and the grown-ups panel.

  The test now waits out the 180 ms cross-fade before tapping.
- **Each mode's own tests:** `test_cook.py` (6 sizes), `test_find.py`, `test_clinic.py` (3 sizes), and the shared-kit browser tests.
- **Leak bots:** find, clinic, clinic phase 1, and heal A/B/C pass.
- **Screenshots** look right. The corner ⌂ slightly overlaps Cook's title card and the clinic's task card on a phone.

## Left for phase C
- The world map replaces the house (`DOORS` is data).
- Character creation and the Eid story, through the hook.
- `bowl.html`'s IndexedDB profiles and per-profile speech keys aren't merged.
- Lab modes as real doors, each with an adapter.
- Sync across devices.
- A kinder way in to the grown-ups panel than holding ⚙.
