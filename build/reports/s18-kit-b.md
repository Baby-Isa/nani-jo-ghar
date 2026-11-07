# s18-kit-b: pans, pouring and serving as kit pieces (Sprint 18, wave 1)

Builder b, Opus high, 7-8 Nov. Chai is unchanged: it calls none of these yet (chai's owner switches it).

## What landed (each its own KIT-READY commit)

| Piece | File | A game calls |
|---|---|---|
| 5 Pans and their looks | `js/cook/mechanics/pan.js` | `Cook.Kit.pan(S, {at, panR, set, lookOf, heaps, spoonWet})` → `{show, fade, view, heaps, select, glow, hide, unhide, vessel}`; `Cook.Kit.pan.art(set)`, `.look`, `.land` |
| 6 Pour or spoon from the shelf | `js/cook/mechanics/pour.js` | `Mech.pour(S, {pan, from, level, look, settle, ms})`, `Mech.pour.spoon(z, {pan, from, word, ms})` |
| 7 Pan into its glass; take-back | `js/cook/mechanics/pour.js`, `js/shared/pour.js` | `Mech.pour.toGlass(S, {pan, well, from, to, frames, look, ms, sound, hook, onDone})` on `NjgPour.plan`, `.frameOf`, `.holdOver`; `Mech.pour.takeBack(S, {can, onTap}).sync()`, `Mech.pour.unspoon(z, o)` |
| 8 Serving | `js/shared/serve.js` | `NjgServe.for(Cook).review(S, o)`, `.faces(S, dishes, wrong, o)`, `NjgServe.round({items, done, check, review, oops, recast, redo, key, showRight, reset, again})` |

Every timing defaults to chai's; every picture, measure and colour is the game's data.

## Proof

- `node --test`: `build/test_shared_kitpan.mjs` (5: every look of chai's set by chai's registration, the fade, CHAI-91's nearest look), `build/test_shared_kitpour.mjs` (3: frameOf and holdOver equal chai's own lines in 162 cases), `build/test_shared_serve.mjs` (5: the faces' layout equals chai's in 108 cases; the tick-and-recast loop: right stays done, oops once, third try shown).
- Lab sections, `labcheck.mjs` at 1280x665 and 740x320, no errors, nothing spills: `lab/sections/kk-pan-pour.html?state=` looks, pour, tip, takeback, carry, glass, half; `lab/sections/kit-serve.html?state=` one, right, wrong, round. Strips: `build/screenshots/labcheck/s18kb*/sheet.png` (not in git).
- Chai still plays unchanged: `run.mjs --contract --flow cook:chai-tray --sizes 1280x665` → `CONTRACT PASSED: 0 breaks over 1 pages` (end reached, 0 page errors).

## What waits (exact changes for others)

1. **Chai's owner:** move the `KIT` object in `lab/sections/kk-pan-pour.html` (pan, glass, shelf: chai's values copied from chai-tray.js) into `data/stations/chai-tray.json` as `"kit"`; the section reads it from there once present. Then switch chai's pans, pours, carry, take-back and review loop onto the calls above (its `lookOf`, heaps list and checks stay chai's).
2. **Builder a (`js/cook/kitchen-kit.js`):** `Kit.place` (303-314) has no caller: delete it. `Kit.review` (178-247): replace its body with `review: (S, o) => NjgServe.review(S, o, NjgServe.env(Cook))` and `import { NjgServe } from "../shared/serve.js";`, so all nine callers take the shared serve (same look and timings).
3. **Orchestrator:** the module map's rows 5-8 take these files and calls; I added `jscolour|js/shared/serve.js|art-only` to `build/lint/static-known.json` (the review's two art colours).

## Checks

`checks.mjs --only unit,static,words,load,docs`: words ok (0 literals), static ok (0 new), docs ok, load ok (29/29); unit 711 pass, 3 fail, all in `build/tools/art/artcheck.test.mjs` (`sources/art/... is not in the repo`: this worktree leaves sources/ out; not my files). No BEFORE run and no evidence --after (Zafar's decision 5 for this run).

## Cost

About $20 (Opus, high).
