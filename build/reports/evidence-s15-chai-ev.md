# Evidence run s15-chai-ev

Commit e036442. 6 rows: 4 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 14 pages. Sheets and text: `build/screenshots/evidence/s15-chai-ev/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s15-chai-ev`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-171 | motion | 3/3 |  | `build/screenshots/evidence/s15-chai-ev/SH-171.png` | 3 |
| SH-172 | layout | 0/2 | TOOL FAILURE | (text only) | 0 |
| SH-165 | detail | 0/2 | TOOL FAILURE | (text only) | 0 |
| SH-163 | motion | 3/3 |  | `build/screenshots/evidence/s15-chai-ev/SH-163.png` | 3 |
| CHAI-50 | layout | 2/2 |  | `build/screenshots/evidence/s15-chai-ev/CHAI-50.png` | 2 |
| CHAI-40 | layout | 3/3 |  | `build/screenshots/evidence/s15-chai-ev/CHAI-40.png` | 3 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-172: SH-172-p1-L1-1280x665: the moment "help-open" never came; moments seen: page:start, life:order-count, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, bubble, life:say-end, life:pop-face, life:row-glide, rec:order-card-big, life:skip-zone, life:stage-start, life:decoys, life:step-open, life:step-call, life:rung, life:glow, life:row-home, life:order-skip, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:kind-tap, cook:tap, exp:cook-paani, cook-done:tap, l
- SH-165: SH-165-p1-L2-740x320: the moment "help-open" never came; moments seen: page:start, life:order-count, life:order-level, rec:start, life:ghost, life:request, life:popup-open, talk:nana, line:cook, life:say-start, life:bubble-spk, cook:click, only:.njg-rq-card, bubble, life:say-end, life:pop-face, life:row-glide, rec:order-card-big, life:skip-zone, life:stage-start, life:decoys, life:row-home, life:order-skip, life:popup-fold, life:step-open, life:step-call, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, life:help, life:rung, life:helper-open, life:glow, rec:hint-nani-says, rec:hint
