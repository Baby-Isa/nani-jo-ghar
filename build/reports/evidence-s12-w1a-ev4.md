# Evidence run s12-w1a-ev4

Commit 4afad8c. 3 rows: 1 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 13 pages. Sheets and text: `build/screenshots/evidence/s12-w1a-ev4/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s12-w1a-ev4`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| EASY-08 | detail | 5/5 |  | `build/screenshots/evidence/s12-w1a-ev4/EASY-08.png` | 5 |
| SH-118 | layout | 8/9 | TOOL FAILURE | (text only) | 8 |
| SH-119 | motion | 8/9 | TOOL FAILURE | (text only) | 8 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-118: SH-118-p2-L1-1366x768: the moment "order-card-in-sidebar" never came; moments seen: page:start, life:order-level, life:request, line:cook, life:say-start, life:say-end, life:popup-open, life:stage-start, life:decoys, life:step-open, life:step-call, life:popup-fold, life:ghost, rec:start, rec:view-pantry, rec:kind-tap, cook:tap, exp:cook-dudh, cook-done:tap, life:act, life:step-close, rec:kind-click, cook:click, only:#passme .pm-item[data-id="spi-16"] img, cook-done:click, exp:cook-daal, exp:cook-khun, life:stage-end, talk:nani, bubble, life:results, rec:view-service, only:.njg-results .rs-next
- SH-119: SH-119-p2-L1-1366x768: the moment "order-card-in-sidebar" never came; moments seen: page:start, life:order-level, life:request, line:cook, life:say-start, life:say-end, life:popup-open, life:stage-start, life:decoys, life:step-open, life:step-call, life:popup-fold, life:ghost, rec:start, rec:view-pantry, rec:kind-tap, cook:tap, exp:cook-dudh, cook-done:tap, life:act, life:step-close, rec:kind-click, cook:click, only:#passme .pm-item[data-id="spi-16"] img, cook-done:click, exp:cook-daal, exp:cook-khun, life:stage-end, talk:nani, bubble, life:results, rec:view-service, only:.njg-results .rs-next
