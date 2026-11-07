# s18-chai2: chai's owner, second session (Sprint 18, wave 1)

Opus, high. Zafar's decision 5 for this run: no BEFORE run, no evidence --before; proof by `frozen.mjs --diff` and contract runs.

## 1. The last glass's ring on `#mistake` 740x320 (the pan switch's diff)

Replayed three times before and after the pan switch (030077eb: 0, 1, 1 rings; 3338b26f: 0, 0, 0; all six ended, contract passed):
**a flake on the old code too**. The drop lands as the tick's praise starts; `js/shared/sfx.js` gates long effects (glass-c,
1228 ms) under a family voice, so whichever starts first wins. Logged as CHAI-107 (fix options for Zafar there).

## 2. Switches

| Switch | Commit | Frozen diff | Verdict |
|---|---|---|---|
| (b) pieces 6-8: the shelf pour and spoon, pan into glass and take-back, serving | d4ec4236 | `build/reports/frozen-diff-chai-tray-202611072039.md` | **No change** over 30 pages |
| (c) pieces 9-12: the shelf slots, word pills, the word pop (third session) | (this commit) | `build/reports/frozen-diff-chai-tray-202611072132.md` | **No change** over 30 pages (7 one-off changes on the first play, none again on the re-play) |

**(b) pieces 6-8** (chai-tray.js about 290 lines fewer):
- Piece 6: `pourInto` is `Mech.pour(S, {pan, from, level, look, settle, onEnd})`; `spoonInto` is `Mech.pour.spoon`; chai's `land`
  is `Cook.Kit.pan.land` (the same lines).
- Piece 7: the pour into the glass is `Mech.pour.toGlass(S, {pan, well, from, to, frames, look, lift, gap, arc, ms, sound, hook,
  onDone})`, then `pan.unhide()`; the take-back zones are `Mech.pour.takeBack(S, {can, onTap})` (`sync`, `at` for `Cook.undoAt`),
  the spoonful back to its jar `Mech.pour.unspoon`. Chai's frame table (S14F), POUR, GLASS and the `pour` times are gone: the
  frames, the resting glass and the measures are read from `data/stations/chai-tray.json` `kit.glass` (checked equal, 24 frames),
  the art lists built from it.
- Piece 8: the review faces are `NjgServe.for(Cook).faces(S, dishes, wrong, {left: tray.x, right})`; the tick and the recast loop
  is `NjgServe.round({items, done, check, onRight, review, oops, recast, afterReview, redo, key, showRight, reset, again})`;
  chai keeps its check of a glass and what its people say.

Outside my files: `build/test_shared_sfx_files.mjs` lists `js/cook/mechanics/pour.js` among chai's sound files (the short pour
and the settle moved there), as the first session did for boil.js.

**(c) pieces 9-12** (third session; chai-tray.js about 90 lines fewer): the slots are `Shelf.slots(shelfIds, {span, view, pitch,
groupGap, pillRoom})`; the pills' floor, gap, room and row scale `Shelf.pillWant`, `.pillGap`, `.pillRoom`, `.pillScale`; each pill
`Shelf.P.chip(S, x, CHIP.y, word, {word, depth, shade, onTap})` with `chip.face(word, cap)` and `chip.hit(slotW)` (chai's chipFace,
pillHit, PILL_* and its speaker wrapper gone); the word pop `Juice.P.pop` placed by `Juice.popAt` (hob edge, the count badge).
Chai keeps its old card shadow (40, 25, 10: `shade`). The test hook `Cook.chaiPills` reads `chip.parts`. Count pills: chai draws
none (the count badge is ui.js's, `UI.tallyAt`). The decoys and size classes already go through St's wrappers onto `Shelf`.

## What waits

(d) lights and lessons (the `lightHelpArrow` block); (e) people say their orders and the timings. Static check: "4 known ones are
fixed" (`checks.mjs` static `--write-known` would shrink its list; build/tools is not mine). Frozen runs: `frozen.mjs --diff` takes
the browser lock itself (never wrap it in flock).

## Proof

- Unit: kitpan, kitpour, serve, sfx calls, sfx files, cook harness, rules, word card: pass (test_cook_mount fails before and after).
- `checks.mjs --only static,words,load`: words ok (0 literals), static ok (0 new), load ok (29/29).
- After (c): unit shelf, cook harness, smoke, sfx files pass; `checks.mjs --only static,words,load` ok (0 new, 0 literals, 29/29);
  frozen diff `frozen-diff-chai-tray-202611072132.md`, **no change**.
- Frozen diff after (b): `frozen-diff-chai-tray-202611072039.md`, **no change** (13 one-off changes on the first play, none again).
