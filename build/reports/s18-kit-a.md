# s18-kit-a: the kitchen kit's stove part, the worktop and stone band (Sprint 18, wave 1, builder a)

Opus, high. Cost about $25. Chai is unchanged: it stays on its old code until its owner switches it (STD-F1-05).

## What landed (each its own KIT-READY commit)

| Piece | Call |
|---|---|
| 1, 3 Heat and boil, its sound (`js/cook/mechanics/boil.js`) | `Mech.boil(S, pan, {band, rate, burner, ring, id, can, canLight, has, steam, bind, on})`, `Mech.boil.stove(S, {log, hold, onHoldEnd, sound, done})`, `.settings({level, profile, heat})`, `.times`, `.simmerDb`, `.art()`, `.sounds` |
| 2 Hob, burners, flames, heat ring (`js/cook/kitchen-kit.js`, kept) | `Cook.Kit.hob`, `.burner`, `.heatRing` |
| 4 Worktop wash, stone band (moved into kk) | `St.worktopWash()`, `St.STONE`, `St.stoneBand(S, o)`, `Cook.Kit.worktop(S, {top, far, depth})` |
| Lab section | `lab/sections/kk-stove.html?set=a\|b\|c\|live[&level=1-4][&sound=off]` |
| Kit (c)'s ask | `Cook.Kit.chip`, `.speaker` on `Shelf.P` |
| Kit (b)'s ask | `Cook.Kit.review` on `NjgServe.review`; `Kit.place` deleted (no callers) |

The calls and options are written at the head of each section. Each section names no game (a unit check). The art folders' own names
(`chai-station/`, `chai-v2/`) stay in the asset paths.

## Proof

- Unit: `build/core/kit-boil.test.mjs`, 11 checks, all pass. Each of chai's four levels gives the same frames as the old heat loop at
  60 and 24 fps (entering the green, leaving it, boiling over). Also checked: the knob, too early, boil-over and starting again,
  the first-time hold, the loop's level in dB, `bind`, a view cleared mid-boil, and that stoneBand matches station-lib's copy.
- Lab: labcheck at 1280x665 and 740x320, sets a, b and c. No errors and nothing spills. The sheet is at
  `build/screenshots/labcheck/kk-stove/sheet.png`.
- Contract runs at 1280x665 only (the four-size replay is the orchestrator's merge run):
  - After pieces 1-4, chai: "CONTRACT PASSED: 0 breaks over 1 pages".
  - After the chip and review changes, samosa broke contract-92: the shared pill reports its card's size, which changed what
    the check measured. Fixed at the source: `Kit.chip` keeps the box it always had (the pill's size moves to `pillW`/`pillH`),
    and chai and samosa now pass, "CONTRACT PASSED: 0 breaks over 2 pages".
- Checks: `static` and `words` are ok, with 0 new findings. `unit` has 3 fails, all in `build/tools/art/artcheck.test.mjs`. That
  file needs `sources/`, which this worktree doesn't have; none of the fails are in my files.

## What waits

- **station-lib.js's owner:** delete lib's own `S$.worktopWash`, `S$.STONE` and `S$.stoneBand` (the block that starts with the
  ART-41 comment, about 30 lines). It's dead now, because the kit's copy loads later and wins.
- **Chai's owner (the switch):** one `Mech.boil.stove(S, {log: "chai", hold, onHoldEnd, done})`. Then for each pan,
  `Mech.boil(S, pan, {id, band, rate, burner, ring, ringR: rimR, bind: true, can, canLight, has, steam: {when}, puff: {r: rIn},
  on})`, with chai's knobTap, boilOver and turnDown parts as the `on` hooks. After that, delete chai's heat tick, its simmer code
  and those three functions. `Cook.chaiBoil` becomes `stove.boilLog` and `Cook.chaiSimmer` becomes `stove.simmerLog`; the note
  names stay the same.
- **The orchestrator:** `js/shared/serve.js` is not in any import map yet. The next bump stamps it.
