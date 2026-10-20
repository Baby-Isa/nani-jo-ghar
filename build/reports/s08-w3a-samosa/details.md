# s08 w3A samosa: details (builder, not judged)

## Flaws first (zoom x2 on the filmstrips)

1. The finished samosa is a flat, plain triangle: its layers barely show once the end has tucked under (`fold-1366x768-x2.jpg`, "let go" of swipe 3). It reads as folded pastry, not yet as a plump samosa.
2. The first fold's lit flap (the small corner) shows only a faint glow on the dark board; folds 2-3 show a clear gold haze. The arrow does the real telling.
3. At the end of the first swipe (67-92%) a sliver of the filling peeks past the flap's edge for a frame; it is hidden once the fold lands.
4. Mid-fold, upright, the flap is a thin leaning sliver for about a tenth of the swipe (no thickness is drawn).
5. The filling sits at the strip's left end, half-way up (inside where the corner lands), not low in the bottom-left corner.
6. Swipes run 30 degrees off the strip (equilateral triangles are the only shape that rolls cleanly); a fold starts within 25 degrees of its arrow, so a flat swipe along the strip does nothing.
7. Three swipes per samosa (`data/cook.json` mechanics.fold `folds: 3`; 4 is allowed). Zafar asked for "three or four"; three keeps it short ("the folding thing becomes a bit boring").
8. The coach script (`data/cook.json` onboard.samosa) is a fixed list of 7 moves; with 2 samosas or 3 spoons its later moves land one step off (as before). `build/test_cook.py` was not run.
9. Two blank cream shots in `cook:recipe:samosa` (shotdiff #29, #30, and #18): loading moments between stations; not checked whether they are new.
10. Not run (browser budget, 20 min used, about 10 of it lost to two film runs that hung): the other sizes, `check_onboard.mjs`, `loadcheck` (`checks.mjs --only load`), the evidence probes. SAM-05's and SAM-16's probes capture `canvas:sv3-fold` (the live canvas is `sv3-foldcv`, the strips `sv3-fold-strip`), unrun.
11. Docs not changed (not mine): `docs/game-design/modes/cook.md` §15 still says "real pastry art for each fold stage"; SAM-05 ("never a code-drawn strip") is reversed by decision 10. `docs/architecture/testing.md` does not list contract-50.

## What changed

- `js/cook/mechanics/fill-fold.js`: `Cook.Pastry`, the coded fold. Layers of pastry (polygons), each carrying the tile through its own placement, so a turning flap shows its mirrored underside; a soft shadow under every layer and under the flap in the air; a light model on the turning flap; soft corners, no outlines; the strip drawn whole at rest (no seam on the crease). The lit flap glows in the focal colour; a white arrow per swipe.
- `js/cook/stations/samosa.js`: six strips on a bigger board (1040 wide, 2 x 3) at every level; tap any strip (it lifts a little), fill it, take a spoon back by tapping its mound; one tick; every strip graded at the tick (decision 51 per strip; extras emptied; too few, the order again); only then the rows close; each filled strip folded in the middle, onto the plate, then the fryer with no button. The six fold pictures and the one-at-a-time L1-L2 path are gone (decision 10).
- `build/sandbox/lib/contract.mjs` contract-50 and `contract-hook.mjs` (rows carry a `no` flag); unit test in `contract.test.mjs`.
- `data/stations/samosa.json` grown-ups' lines; `data/cook.json` onboard.samosa (a strip tap first).

## Proof

| Check | Result |
|---|---|
| contract-50, red | old code `cook:samosa@L3` (run w3a-red-l3): "two samosas / two minces" ticked 2.6 s before "ba samosa / ba bataata" |
| contract-50, green | runs w3a-g1 (7 pages) and w3a-g2 (6 pages): 0 breaks; unit test red, green, redo and "don't" cases pass |
| sandbox `--check`, 1366x768 | samosa L1-L4, L3#hint, #mistake, L2#mistake, #takeback, recipe:samosa: every page reaches its end, 0 findings, 0 page errors; w3a-g2 contract 0 breaks |
| contract-21 in w3a-g1 #mistake | a wrong tap blocked by the coach while "Bhar! Chundo." was said: fixed by calling a strip's first filling before the strip is tapped; green in w3a-g2 |
| checks.mjs (no browser) | unit 388 pass; words, static, leak (17 configs), bump, specs, docs ok |
| shotdiff w3a-g2 | 16 changed, 172 new (pages new to the baseline); sheet `build/screenshots/sandbox/w3a-g2/sheets/changed.png` looked at |
| Filmstrips | `fold-1366x768.jpg`, `fold-800x360.jpg`, and the x2 zooms, L1, every frame of three swipes |

## Rows rechecked (regress.mjs cook:samosa, 28)

SAM-21, SAM-25, SAM-24, SAM-22: built, for the judge. SAM-05: reversed by decision 10. SAM-16: each fold its own diagonal, alternating, kept. SAM-18: the pastry never vanishes (filmstrips). SAM-19: the first fold hides the filling. SAM-12, SAM-06: all strips laid out, each starts empty. SAM-17: mounds on laid-out strips drawn a quarter bigger (w3a-g1 L3 kind-click). SAM-02, SAM-10, CK-27: heaps, mounds, the puff unchanged. SAM-07, SAM-14: plate spots unchanged, the coded samosa sized by its triangle (not checked at x2 on the plate). SAM-08, SAM-09, SAM-13, CK-08: the fry untouched (KEEP-03). SAM-01, SAM-03, SAM-04, SAM-11, SAM-15: order and card data untouched. CK-29, CK-43: contract green. CK-09: the same board, bigger, not blown up (847 px tall art at 631 design px).

## QA checklist (builder's own pass; the judge's is the one that counts)

QA: samosa · reviewer: builder (not independent) · commit: see the branch
Auto: checks.mjs (no-browser) ok · sandbox 1366x768 ok · contract ok · loadcheck, check_onboard not run
Checklist: TXT ok · LAY ok at 1366x768 only · CMP ok (shared tick, no new buttons) · LNG ok (no new words; lines from the engine) · INT ⚠ INT-15 coach script order · AUD not checked · ART ⚠ flaw 1 · CUL ok
