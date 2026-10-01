# Step 3, R3b "Plug and play: one game host, mode and arc formats"

Branch `ccr-fcd9dddd-wnywzc`. No live page, mode or shared-kit file changed. Guide: `docs/architecture/building-games.md`.

## The interfaces
- **Mini-game** (`js/shared/host.js`): `{id, gestures, levels, screen?, needs?, mount(el, ctx) → {start, destroy, expect?}, bot?}`. `ctx`: level, params, play, scene (stub until R3a's `stage.js`), lang, voice, progress, card/guide/shelf/buttons (the kit), input, onboard, mark, place/takeBack, hint, log, pause, rng, wait/after/every/on, test, done.
- **Host**: runs a plan stage by stage; after each, flags anything left in the play area or page, or a voice still playing (E17), and clears it; then one `Score.finish` and the shared end screen. First mark of a row counts (E14).
- **Mode** (`js/shared/mode.js`): `{id, data, games, plan(entry), lab(), free, actions}`; entries `story | free | lab` resolved through Unlocks; arcs' `opens` feed the unlock rules; the shell loop records errand, chapter and arc progress.
- **Input** (`js/shared/input.js`): tap, drag, swipe, circle with one feel; live during speech (E5); 48 px hit boxes reported to `njgTest.hitAreas`; take-back until Done.
- **Arcs** (`data/arcs/`): chapters of beats, errands and Conversation slots, `opens`, `open`; Birthday skeleton (H36, no new content); `build/host/check_arcs.mjs`.
- `labs.html` generated (`build/gen_labs.mjs`, all 36 old links kept); `check_onboard.mjs` works for any mode.

## The demo
`js/demo/`: Cook's pantry (`fetch`) and the clinic's scrape (`cut`) through two adapters, neither file touched. In Chromium (`build/host/demo-browser.mjs`, 1366×768, and 844×390 for the scrape, the lock and the story): lab scrape 2/2, lab pantry 3/3, free play locked "until the demo story (chapter 1)", story round with badges and 9 coins that finishes chapter and arc, then free play pays again (9 → 18). No E17 findings, no page errors.

## Checks
`node --test build/host/` 41 pass; core 42, shared 132, lint 12 pass; check_onboard, check_arcs, gen_labs `--check` ok. Sandbox `--quick --check` (house, cook:fetch, clinic:heal-cut; clean worktree): all end, 0 page errors, 16 fixed, 2 new `text-small` at 13.9 px (`.rs-en`, `.ng-rec`). Those come from R3a's token commit (e7592ce3): these flows load none of R3b's files. Rounding for R3a. No full run: R1b's gate is still going.

## Flaws seen in the shots (shared kit, not changed here)
1. The end screen's buttons carry English words ("Again", "Next", "Home", "All"): E1 in story and free play (`NjgButtons.endActions`; Results has no home icon).
2. A word with no Kutchi ("plaster") shows a blank title, not a grey-italic "to record" placeholder.
3. At 844×390 the heal tools are `tap-small` (clinic, known).

## For R4 (Cook)
- `js/cook/main.js`; each kept station a mini-game; `Mech.combined` runs inside one stage.
- Zone scoring → `ctx.mark` / `ctx.hint`; drop Cook's own `roundEnd` (the host shows the end screen).
- `__cook` → `ctx.test` / `njgTest`; Cook's labs come from `lab()`.

## For R5 (the clinic)
- `js/clinic/main.js`; waiting, diagnosis, pharmacy, heal and send-off as stages; the heal host's `ctx` maps almost one to one.
- `ctx.log` right/wrong → `ctx.mark`; the end screen's Again / All patients through `actions`.

## Left
- `bump_version.py` maps only `js/core/` in the import map: add `js/shared/{host,mode,input}.js` and `js/demo/` (until then those load unstamped).
- `lab.html` should sit in R3a's frame once `frame.js` lands (the host takes `frame: {root, play, own()}`).
- Conversations in the pause slots wait for the hub (R6). Lab rounds pay into the real purse: say if they shouldn't.
- `docs/README.md`: add a line for `building-games.md`.
