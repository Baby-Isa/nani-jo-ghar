# Evidence run s14-D-ev2

Commit 879b3c0a. 6 rows: 4 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 30 pages. Sheets and text: `build/screenshots/evidence/s14-D-ev2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s14-D-ev2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| PAN-18 | motion | 1/5 | TOOL FAILURE | (text only) | 1 |
| DAAR-36 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |
| SEK-22 | motion | 5/5 |  | `build/screenshots/evidence/s14-D-ev2/SEK-22.png` | 5 |
| MAA-19 | motion | 5/5 |  | `build/screenshots/evidence/s14-D-ev2/MAA-19.png` | 5 |
| SAM-28 | motion | 5/5 |  | `build/screenshots/evidence/s14-D-ev2/SAM-28.png` | 5 |
| CHT-17 | motion | 5/5 |  | `build/screenshots/evidence/s14-D-ev2/CHT-17.png` | 5 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- PAN-18: PAN-18-p2-L1-1920x1080: the moment "view-marble" never came; moments seen: page:start, life:order-count, life:order-level, life:request, life:popup-open, line:cook, life:pop-face, life:say-start, life:say-end, life:row-glide, rec:start, cook:click, only:.njg-rq-card, life:stage-start, life:decoys, life:step-open, life:step-call, life:ghost, life:rung, life:glow, life:row-home, life:popup-fold, rec:order-card-big, rec:order-card-in-sidebar, cook-done:click, life:help, rec:view-pantry, rec:kind-tap, cook:tap, exp:cook-dudh, cook-done:tap, life:act, life:step-close, rec:kind-click, only:#passme .
- DAAR-36: DAAR-36-p2-L1-740x320: the moment "view-marble" never came; moments seen: page:start, life:order-count, life:order-level, life:decoys, rec:start, life:ghost, cook:click, only:.njg-rq-card, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, life:say-end, bubble, life:pop-face, life:stage-start, life:chop-throw, rec:order-card-big, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:kind-slice, cook:slice, life:act, cook-done:slice, life:step-close, life:stage-end, step:row-0-1, life:step-open, life:step-call, rec:kind-tap, cook:tap, exp:knob, cook
