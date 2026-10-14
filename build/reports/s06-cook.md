# S06 Cook and shared kit (branch s06-cook)

Runs: c97 = ev-20261014-005632-c97, 06w = ev-…-011029-06w, sqj = ev-…-014202-sqj, odn = ev-…-020634-odn. Picture rows: for the judge.

| Row | Cause · fix | Red | Green |
|---|---|---|---|
| SH-10 | already right on this branch · none | on record | ev-…-004527-3br |
| SH-69 | works ("Ali!", "Nana!"); probe missed it (day 1's 12 bubbles all Nani's demo; 1.1 s bubble gone at speed 3) · probe at speed 1 | on record | 06w |
| SH-81 | order-card.css face margin hung the tap 2 px off 800x360 · clamp to card padding | c97 lint | 06w |
| CK-35 | cook.json L1 boil 1.18 s, tawa 0.92 s · 1.76 / 1.42 s, ~15% per level; test_cook_levels | hyz | y12 machine PASS |
| CK-07/31/32 | card folded (all rows ticked), no wrong-row style · serve-wrong driver; OrderCard `wrong` red, card stays open; rim badge hidden | c97 | 06w, odn |
| CK-21 | flow.js trayFront copied the scaled bg at its pivot · copy the 1:1 occluder | on record | sqj |
| CK-27 | puff matched what it landed on · white clouds, warm edge, rising | on record | odn |
| DAAR-13/22 | ghost on a 4 s timer; faint cut; knife rested over items · ghost when throws start (L1), cut along swipe, knife rests | on record | 06w |
| DAAR-23 | tool: captures at speed 3 lost throws · probe at speed 1 | on record | 06w |
| DAAR-19, -20 | not reproduced | c97 | c97 |
| SEK-13 | second skewer of a mix ticked all at once · tickPiece; peek-every-tap driver | 06w | sqj |
| CHAI-13 | spoon under its puff and chip · over it, two turns | on record | sqj |
| PAN-10 | built: L2+ box folds, tap shows the fuller line (grey, to record); wording waits on Mum. Zafar: the folded box shows a second Nani face beside her card (R4) | — | s06-cook-pan10 |
| CK-TAB-01 | not started: each station needs a 4:3 layout (shelf band in two rows, then narrow stage.scenes.cook.safe); a design call | — | — |

Also: core.js localStorage fallback removed (static.mjs is not on this branch: --write-known after merge); word review at 800x360 no longer breaks words or scrolls.

Checks: full checks.mjs passes (unit 309, words, bump, specs, docs, load 21/21). Clinic + Cook flows at 800x360 and 1366x768 (s06-cook-regress), then the results fix re-checked (s06-cook-results2, -results3): CHECK PASSED, contract 0 breaks.
