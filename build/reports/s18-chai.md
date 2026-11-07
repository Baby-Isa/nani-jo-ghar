# s18-chai: chai's owner (Sprint 18, wave 1)

Opus, high. Cost so far about $30 (reading, nine sandbox plays, two frozen-run diffs, the re-freeze, three switches).

## What landed

| Commit | What |
|---|---|
| a39bccd0 | Lab shells: `lab/kitchen-kit.html` (every `lab/sections/kk-*.html`), `lab/kit.html`'s loader (`kit-*.html`), each section in a frame; 0 errors at 1280x665 and 740x320. |
| 8c42e213 | **(a) heat and boil:** `Mech.boil(S, pan, opts)` per pan, `Mech.boil.stove(S, {log: "chai", hold, done, onHoldEnd})`; chai's knob, clock, hold, too early, green, boil-over and again, steam and simmer deleted (about 190 lines). Hooks and notes keep their names. `build/test_shared_sfx_files.mjs` lists `mechanics/boil.js` among chai's sound files. |
| 9d357098 | **(a) the worktop:** `Cook.Kit.worktop(S, {top, far})`. |
| 030077eb | **The re-freeze** after CK-60 (below). |
| 3338b26f | **(b) piece 5, pans and looks:** `Cook.Kit.pan(S, {at, rimR, panR, set: kit.pan, lookOf, heaps, spoonWet, sel})`; chai's pan pictures, look-setting, fade, spoonfuls and chosen-pan drawing deleted (about 200 lines). `data/stations/chai-tray.json` gains `"kit"` (pan, glass, shelf: kit b's KIT object, unchanged). |

## The three chai rows

- **CHAI-105**: chai was right; contract-96 read past the player's refill (the orchestrator's fix landed).
- **CHAI-106**: a skip keeps the lesson; the missing light was the player's pace (contract-90 now at every level).
- **CK-60**: (e)'s fix merged; contract-95 green on `#takeback` and `#returning` at 1280x665 and 740x320 (run `s18-chai-ck60`), nothing played between the skip and the first step.

## The re-freeze

`frozen.mjs --freeze --runs s18-chai-freeze1,s18-chai-freeze2`: the 15 frozen flows at 1280x665 and 740x320, two plays each (30 pages,
two samples each). Known break left: contract-99 at `@L4` 1280x665 (SH-232, the panel after a fold; kit e's panel), once in two
plays. The freeze holds the two quick sizes only: 930x430 and 1920x1080 are the orchestrator's four-size run.

## Frozen-run diff per switch

- (a) heat and boil + worktop: `build/reports/frozen-diff-chai-tray-202611071854.md`: **no change** over 30 pages (against the old freeze).
- (b) piece 5, pans: `build/reports/frozen-diff-chai-tray-202611072011.md`: 2 changes on 1 page, both the same sound: the last glass's
  ring (`glass-c`) missing on `#mistake` 740x320 (twice). **Explained, not the switch:** the ring comes about 2.7 s after the last
  pour starts and races the round's end at 740x320; the frozen run itself lacks it on the L1 page in both samples and on `#hint`
  in one (`build/frozen/chai-tray/frozen.json`). Piece 5 does not touch the glass. Worth a row: the last glass's ring cut by the
  round's end on phones (the sfx voice gate or the closing).

## Waits (Zafar's order)

- **(b) pieces 6-8**: the pour from the shelf (`Mech.pour`, `.spoon`), the pan into its glass and take-back (`Mech.pour.toGlass`, `.takeBack`), the serving loop (`NjgServe`). Chai's pour reads `kit.pan`'s mirror, rim and empty look now; its frames (`S14F`) and `POUR` timings stay chai's until piece 7 (then `kit.glass`, `kit.shelf`).
- **(c) the shelf** (`Shelf`, `Tally.label/.place`, `Juice.P.pop`), **(d) lights and lessons** (kit d's map in `build/reports/s18-kit-d.md`; the `lightHelpArrow` block goes then), **(e) the order's flow** (landed: `UI.personSay(pan.who, {obj: pan.face, rows, line, hide})`, `OrderCard.TIMES`).

## For other builders

- Kit b: `lab/sections/kk-pan-pour.html` can drop its own `KIT` copy now that `data/stations/chai-tray.json` has `"kit"`.

## Proof

- `s18-chai-b2`, `s18-chai-c1`: CHAI-105 and CHAI-106 traced (data kept). `s18-chai-ck60`: `CONTRACT PASSED: 0 breaks over 4 pages`.
- After (a): `@L3#boil-over` 1280x665, end reached, 0 page errors, contract passed; the frozen diff: no change.
- After piece 5: `@L3` and `@L3#boil-over` 1280x665, end reached, 0 page errors, `CONTRACT PASSED: 0 breaks over 2 pages`.
- Unit: kit-boil, chai104, kitpan, sfx, chip-words: 30 pass. `checks.mjs --only static,words,bump,load`: all ok.
