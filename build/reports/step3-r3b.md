# Step 3, R3b "Plug and play"

Branch `ccr-fcd9dddd-wnywzc`. No live page, mode or shared-kit file changed. Guide: `docs/architecture/building-games.md`.

## Interfaces
- **Mini-game** (`js/shared/host.js`): `{id, gestures, levels, screen?, needs?, mount(el, ctx) → {start, destroy, expect?}, bot?}`; one `ctx` (core, kit, input, marks, pauses, test hook).
- **Host**: runs the stages, flags and clears leftovers (E17), counts first marks only (E14), then `Score.finish` and the end screen.
- **Mode** (`js/shared/mode.js`): `{id, data, games, plan, lab, free, actions}`. Entries (story, free, lab) go through Unlocks; arcs feed its rules; story progress is recorded.
- **Input** (`js/shared/input.js`): one feel, live during speech (E5), 48 px hit boxes, take-back.
- **Arcs** (`data/arcs/`): the format, a Birthday skeleton (H36, no new content) and `build/host/check_arcs.mjs`.
- `labs.html` is now generated (`build/gen_labs.mjs`) and keeps all 36 old links. `check_onboard.mjs` works for any mode.

## Demo
`js/demo/`: Cook's pantry and the clinic's scrape, each through an adapter, with neither mode's files touched. In Chromium (`build/host/demo-browser.mjs`, 1366×768 and 844×390):
- the lab rounds pass;
- free play shows "Locked until the demo story";
- the story round gives three badges and 9 coins, and finishes the chapter and the arc;
- free play then pays again (9 → 18).

No E17 findings, no page errors.

## Checks
- Unit tests: host 41, core 42, shared 132, lint 12, all passing.
- `check_onboard`, `check_arcs` and `gen_labs --check` all pass.
- Sandbox `--quick --check` (house, cook:fetch, clinic:heal-cut, clean worktree): every flow ends, 0 page errors. It found 2 new 13.9 px `text-small` findings from R3a's tokens (R3a has since moved the floor to 14.5 px).

## Flaws seen (shared kit)
1. The end screen's buttons show English words (Again, Next, Home), which breaks E1 in story and free play.
2. A word with no Kutchi shows a blank title, not the "to record" placeholder.

## For R4 (Cook)
- Add `js/cook/main.js`, with the stations as mini-games; `Mech.combined` runs inside one stage.
- Zone scores go to `ctx.mark`/`ctx.hint`; drop `roundEnd`; `__cook` moves to `njgTest`.

## For R5 (the clinic)
- Add `js/clinic/main.js`, with the five rooms as stages; the heal host's `ctx` maps almost one to one.
- `ctx.log` becomes `ctx.mark`; Again and All patients come through `actions`.

## Left
- `bump_version.py` should map `js/shared/{host,mode,input}.js` and `js/demo/`.
- `lab.html` moves into R3a's frame (`frame: {root, play, own}`).
- Conversations go in the slots with the hub (R6).
- Lab rounds pay into the real purse: should they?
- Add `building-games.md` to `docs/README.md`.
