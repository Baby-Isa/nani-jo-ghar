# Evidence run po-o1

Commit 0c827344. 6 rows: 5 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 17 pages. Sheets and text: `build/screenshots/evidence/po-o1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-o1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-275 | layout | 2/6 | TOOL FAILURE | (text only) | 2 |
| SH-279 | motion | 4/4 |  | `build/screenshots/evidence/po-o1/SH-279.png` | 4 |
| SH-286 | motion | 4/4 |  | `build/screenshots/evidence/po-o1/SH-286.png` | 7 |
| SH-295 | detail | 4/4 |  | `build/screenshots/evidence/po-o1/SH-295.png` | 4 |
| SH-299 | motion | 1/1 |  | `build/screenshots/evidence/po-o1/SH-299.png` | 1 |
| SH-303 | motion | 3/3 |  | `build/screenshots/evidence/po-o1/SH-303.png` | 3 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- SH-275: SH-275-p2-L1-740x320: the moment "phase:pour" never came; moments seen: page:start, life:cover, rec:start, line:cook, life:say-start, life:say-end, life:order-level, life:poke, life:ghost, talk:nana, life:request, life:dish-flash, life:popup-open, life:pop-face, cook:click, only:.njg-rq-card, bubble, life:stage-start, life:decoys, life:band, life:popup-fold, rec:order-card-big, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-tap, cook:tap, exp:cook-atto, cook-done:tap, life:idle-bump, life:act, life:rung, life:step-close, exp:cook-paani, life:baking-oven, life:step-call, 
