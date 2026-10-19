# s08 w3A samosa (builder report, not judged)

Branch `worktree-agent-aa375192437065399`, not pushed. Detail: `build/reports/s08-w3a-samosa/details.md`.

## Flaws first

1. The finished samosa is a flat plain triangle; its layers barely show.
2. The first fold's lit corner glows faintly on the dark board (the arrow carries it).
3. A sliver of filling peeks past the first flap for a frame mid-swipe.
4. Only 1366x768 played; 800x360 filmed. Other sizes, loadcheck, check_onboard and the evidence probes not run (20 min browser budget, 10 lost to two hung film runs).
5. The coach's fixed 7 moves land one step off with two samosas (as before).
6. cook.md §15 and SAM-05 still describe fold pictures (not my files).

## What changed

- SAM-21: a coded fold in the pastry tile (`Cook.Pastry`, `js/cook/mechanics/fill-fold.js`). The corner folds over the filling, bottom left to top right; the triangle then rolls left to right, alternating. Three swipes, an arrow on each, only the flap lit; the end tucks under by itself. No seam, no outlines.
- SAM-25: six strips on a bigger board at every level. Tap any strip, fill it, one tick, fold every filled strip, then straight to the fryer.
- SAM-24: every strip is graded at the tick; the card ticks then, all kinds together. contract-50 checks it.
- SAM-22: no button with nothing to decide; fry untouched (KEEP-03).

## Proof

| Check | Result |
|---|---|
| contract-50 | red on the old L3 run (one kind ticked 2.6 s early); green on 13 pages (L1-L4, #mistake, #takeback, #hint, recipe) |
| sandbox --check 1366x768 | every page reaches its end; 0 findings, 0 breaks |
| checks.mjs (no browser) | all ok, unit 388 pass |
| Filmstrips | `s08-w3a-samosa/fold-*.jpg` (git-ignored, in the worktree) |

## Open

For the judge: SAM-21, SAM-22, SAM-24, SAM-25.
