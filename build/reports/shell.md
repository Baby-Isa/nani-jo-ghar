# Phase B: one app, one save (shell build report)

Branch `claude/build-shell`. It merges `claude/nifty-rubin-c0d431`: the conflicts were only `?v=` stamps, so both sides were kept and the pages re-stamped.

## The save (`js/shared/save.js`, shared-api section 11)
- **Layout.** A root key, `njg-save`, holds `{schema, current, players[], migrated}`. Each player's data sits in one key per namespace, `njg-save:<player>:<ns>`:
  - `cook`: word stages, stars, coins, and Find it's and Dress up's sub-objects;
  - `ui`: personal bests, onboarding "seen" flags, and the clinic's state;
  - `speech`: voice enrolment;
  - `shell`: `firstDone`;
  - `bowl`: the old quilt.

  It uses localStorage, which is synchronous, so every mode's load and save code works unchanged.
- **Adapters.**
  - Cook: `core.js` load/save.
  - Clinic, results and onboarding: `UIStore`, whose backend is now `"save"`.
  - Speech: `speech.js`.
  - Find it: shares Cook's save.
  - The lab harnesses load `save.js` too.
- **Migration** runs as schema steps. The 0→1 step copies every old key (`njg-cook-v1`, `njg-shared-ui-fallback-v1`, `njg-speech-enrol-v1`, `njg_quilt_v1`) into "Player 1". The old keys are never deleted. A corrupt key is skipped. A lost root is rebuilt from the players' keys. A migrated save counts as "started".
- **Safety.** Every storage access is in try/catch. If storage is blocked or full, the game carries on in memory and `Save.persistent()` returns false. `navigator.storage.persist()` is requested.
- **Parent export/import.** "Grown-ups" opens with a 1.5 s hold on ⚙. It saves the whole save as a JSON file, or loads one: players in the file are added, or replace the player with the same id.

## Navigation: by page
`index.html` is Nani's house, with a door per mode: Cook, Find it and the clinic. With `?labs=1`, "coming soon" doors are added. A door opens `mode.html?app=1`.

I chose separate pages over mounting modes inside one page. Cook and Find it define the same globals, the clinic has its own, and Phaser's WebGL context and timers don't unmount cleanly. A fresh page frees all of that and leaves every mode's code and tests untouched. The old URLs still work and use the same save.

To avoid a flash, `css/shared/app.css` is render-blocking and paints the house colour first. Pages cross-fade with cross-document view transitions (or a 150 ms fade where those aren't supported). Every mode gets the same ⌂ in the player's colour, and mid-round it asks before leaving.

A picker ("Who's playing?") appears once per visit when there are several children, each with their own save.

## The first-launch hook
A player without `firstDone` goes to one URL, `FIRST` in `js/home.js`. That is either a brand-new device, or a child just added in the picker. Today that URL is `cook.html?app=1&first=1`: one play button over Nani's kitchen, then day 1's pantry order, then `firstDone` is set and the child goes home.

The later character and Eid session replaces that one URL. Shared-api section 12 gives the contract: `Save.updatePlayer`, a `character` namespace, then either hand over to Cook's pantry round or set `firstDone` and go home.

## Test results (all pass)
- **Node:** `test_shared_save.mjs` has 11 tests (migration of every key, round trip, merge import, blocked/full storage, recovery, UIStore, events). All 9 `test_shared_*.mjs` pass.
- **`test_shell.py`, at phone 915×375, iPad and laptop:**
  - first launch → pantry round → house → clinic → home → Cook;
  - reload keeps word stages and coins;
  - a second player gets a separate save and their own first round;
  - on laptop: a pre-shell device migrates, the save exports, and the labs doors and grown-ups panel work.

  One fix: the test now waits out the 180 ms cross-fade before tapping.
- **Each mode's own tests:** `test_cook.py` (6 sizes), `test_find.py`, `test_clinic.py` (phone, iPad, laptop), and the shared-kit browser tests.
- **Leak bots:** find, clinic, clinic phase 1, and heal A/B/C all pass (L1 blind strategies under 10%).
- **Screenshots checked** (`build/screenshots/shell/`): the house, clinic, Cook title, picker, labs doors and grown-ups panel. There's no white flash. The corner ⌂ slightly overlaps Cook's title card and the clinic's task card on a phone. It's legible, but worth tidying.

## Left for phase C
- The world map replaces the house: `DOORS` is data, so that's a swap.
- Character creation and the Eid story, through the hook above.
- `bowl.html`'s IndexedDB profiles aren't merged into the save, and neither are per-profile speech keys (`njg-speech-enrol-v1:<profile>`).
- The lab modes as real doors, each with an adapter (Tidy, Who, Monsoon, Snap).
- Sync across devices (only export/import for now).
- A kinder way in to the grown-ups panel than holding ⚙.
