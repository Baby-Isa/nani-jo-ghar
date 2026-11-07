# s18-chai2: chai's owner, second session (Sprint 18, wave 1)

Opus, high. Zafar's decision 5 for this run: no BEFORE run, no evidence --before; proof by `frozen.mjs --diff` and contract runs.

## 1. The last glass's ring on `#mistake` 740x320 (the pan switch's diff)

`cook:chai-tray#mistake` at 740x320, three plays on each commit (detached sparse worktrees, deleted after), the glass sounds counted
from each page's sound log (`sfx/glass`, file `glass-c`):

| Commit | Play 1 | Play 2 | Play 3 |
|---|---|---|---|
| 030077eb (before the pan switch) | 0 | 1 (13.2 s) | 1 (13.4 s) |
| 3338b26f (the pan switch) | 0 | 0 | 0 |

All six reached their end, contract passed. **A flake, on the old code too.** The cause, in every page's timeline: the glass's
drop lands 460 ms after the pour ends (`glassDone`, Juice.P.drop's onLand plays `drop` then `glass`); the tick's praise
("shabash", the family's voice) starts within the same 0-50 ms. `js/shared/sfx.js` gates any effect longer than SHORT while a family
voice sounds (`gate`: glass-c is 1228 ms, so 0): when the drop lands first the ring plays, when the praise starts first it is
silenced (the `drop` itself, short, always plays). The switch shifts the race by a few ms; it does not touch the glass.

**Proposed row (chai, sfx):** "The last glass's ring is silenced when the tick's praise starts as the drop lands (the voice gate,
glass-c 1228 ms); seen on L1 and #mistake at 740x320." Fix options for Zafar: (1) the ring at the drop's start of the fall
rather than its landing; (2) the praise waits for the drop (about 0.5 s); (3) leave it (the drop is heard). Recommend (2).

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
- Frozen diff after (b): `frozen-diff-chai-tray-202611072039.md`, **no change**. The first play showed 13 one-off changes on 7 pages
  that did not come again on the re-play (the glass ring above; the known contract-99 panel at L4, SH-232; one contract-83 at L4
  1280x665, the order card's pop 10 px square over Nana's face at 17.4 s, before any pour; L3 740x320's help firing on a slow beat).
