# Evidence run s14-D-ev

Commit 9e918ca2. 32 rows: 24 for a reviewer, 2 decided by the machine, 6 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 81 pages. Sheets and text: `build/screenshots/evidence/s14-D-ev/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s14-D-ev`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-161 | layout | 3/3 |  | `build/screenshots/evidence/s14-D-ev/SH-161.png` | 3 |
| SH-162 | layout | 3/3 |  | `build/screenshots/evidence/s14-D-ev/SH-162.png` | 3 |
| SH-163 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/SH-163.png` | 3 |
| SH-164 | layout | 2/2 |  | `build/screenshots/evidence/s14-D-ev/SH-164.png` | 4 |
| SH-166 | motion | 4/4 |  | `build/screenshots/evidence/s14-D-ev/SH-166.png` | 4 |
| SH-167 | text | 1/1 | PASS: machine: pass (node build/tools/review/unit.mjs build/sandbox/film.test.mjs: exit 0) | (text only) | 0 |
| SH-168 | text | 1/1 | PASS: machine: pass (node build/tools/review/unit.mjs build/sandbox/s14checks.test.mjs: exit 0) | (text only) | 0 |
| SH-169 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/SH-169.png` | 4 |
| SH-170 | layout | 3/3 |  | `build/screenshots/evidence/s14-D-ev/SH-170.png` | 4 |
| SEK-23 | layout | 2/2 |  | `build/screenshots/evidence/s14-D-ev/SEK-23.png` | 2 |
| PAN-18 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |
| CHAI-42 | motion | 2/2 |  | `build/screenshots/evidence/s14-D-ev/CHAI-42.png` | 2 |
| CHAI-46 | layout | 2/2 |  | `build/screenshots/evidence/s14-D-ev/CHAI-46.png` | 4 |
| CHAI-47 | layout | 4/4 |  | `build/screenshots/evidence/s14-D-ev/CHAI-47.png` | 4 |
| CHAI-48 | layout | 2/2 |  | `build/screenshots/evidence/s14-D-ev/CHAI-48.png` | 2 |
| CHAI-49 | layout | 2/2 |  | `build/screenshots/evidence/s14-D-ev/CHAI-49.png` | 2 |
| DAAR-36 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |
| SEK-22 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |
| MAA-19 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |
| CLN-205 | motion | 1/1 |  | `build/screenshots/evidence/s14-D-ev/CLN-205.png` | 1 |
| CLN-207 | motion | 7/7 |  | `build/screenshots/evidence/s14-D-ev/CLN-207.png` | 6 |
| CLN-208 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/CLN-208.png` | 2 |
| CLN-209 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/CLN-209.png` | 2 |
| CLN-210 | motion | 4/4 |  | `build/screenshots/evidence/s14-D-ev/CLN-210.png` | 3 |
| CLN-211 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/CLN-211.png` | 2 |
| CLN-212 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/CLN-212.png` | 2 |
| CLN-213 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/CLN-213.png` | 2 |
| CLN-214 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/CLN-214.png` | 2 |
| CLN-215 | motion | 3/3 |  | `build/screenshots/evidence/s14-D-ev/CLN-215.png` | 2 |
| SAM-28 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |
| SH-137 | layout | 2/2 |  | `build/screenshots/evidence/s14-D-ev/SH-137.png` | 2 |
| CHT-17 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |

## Tool failures (6): for the tool owner, never a FAIL in regressions.md

- PAN-18: PAN-18-p2-L4-1920x1080: the moment "onboard" never came; moments seen: page:start, life:order-count, life:order-level, life:request, life:popup-open, line:cook, life:pop-face, life:say-start, life:say-end, life:row-glide, rec:start, cook:click, only:.njg-rq-card, rec:order-card-big, life:skip-zone, life:stage-start, life:decoys, life:step-open, life:step-call, life:row-home, life:order-skip, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:view-pantry, rec:kind-tap, cook:tap, exp:cook-daal, cook-done:tap, life:act, life:pill, life:step-close, rec:kind-click, only:#passme .pm-it
- DAAR-36: DAAR-36-p2-L4-1920x1080: the moment "onboard" never came; moments seen: page:start, life:order-count, life:order-level, life:decoys, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, life:say-end, bubble, life:pop-face, rec:order-card-big, life:stage-start, life:chop-throw, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-slice, cook:slice, life:act, cook-done:slice, life:pill, life:step-close, life:stage-end, step:row-0-2, life:step-open, life:step-call, rec:kind-tap
- SEK-22: SEK-22-p2-L4-1920x1080: the moment "onboard" never came; moments seen: page:start, life:order-count, life:order-level, step:row-0-2, rec:start, life:ghost, life:request, life:popup-open, cook:click, only:.njg-rq-card, talk:nana, line:cook, life:say-start, life:bubble-spk, life:say-end, bubble, life:pop-face, rec:order-card-big, life:skip-zone, life:stage-start, life:order-skip, life:popup-fold, life:step-open, life:step-call, life:decoys, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-tap, cook:tap, exp:veg-02, cook-done:tap, life:act, exp:veg-03, life:step-close, step:r
- MAA-19: MAA-19-p2-L4-1920x1080: the moment "onboard" never came; moments seen: page:start, life:order-count, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, bubble, life:say-end, life:pop-face, rec:order-card-big, life:skip-zone, life:stage-start, life:step-open, life:step-call, life:order-skip, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-tap, cook:tap, exp:dough, cook-done:tap, life:act, rec:kind-roll, cook:roll, cook-done:roll, exp:tawa-on, rec:kind
- SAM-28: SAM-28-p2-L4-1920x1080: the moment "onboard" never came; moments seen: page:start, life:order-count, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, bubble, cook:click, only:.njg-rq-card, life:say-end, life:pop-face, rec:order-card-big, life:skip-zone, life:stage-start, life:decoys, life:step-open, life:step-call, life:order-skip, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-tap, cook:tap, exp:strip, cook-done:tap, life:act, exp:ph-keema, exp:veg-01, life:pill, rec:kind-swip
- CHT-17: CHT-17-p2-L4-1920x1080: the moment "onboard" never came; moments seen: page:start, life:order-count, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, bubble, life:say-end, life:pop-face, rec:order-card-big, life:stage-start, life:chop-throw, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:view-wood, rec:kind-slice, cook:slice, life:act, cook-done:slice, life:pill, life:step-close, life:stage-end, rec:view-marble, step:row-0-0, life:decoys, step:row-0-1, life:step-open, 
