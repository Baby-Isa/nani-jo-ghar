# Evidence run w6j-green

Commit 9b95445d. 6 rows: 5 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 14 pages. Sheets and text: `build/screenshots/evidence/w6j-green/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id w6j-green`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-98 | detail | 2/3 | TOOL FAILURE | (text only) | 2 |
| SH-37 | layout | 1/1 |  | `build/screenshots/evidence/w6j-green/SH-37.png` | 1 |
| SH-60 | motion | 2/2 |  | `build/screenshots/evidence/w6j-green/SH-60.png` | 1 |
| SH-117 | motion | 1/1 |  | `build/screenshots/evidence/w6j-green/SH-117.png` | 1 |
| DAAR-34 | detail | 3/3 |  | `build/screenshots/evidence/w6j-green/DAAR-34.png` | 3 |
| SAM-21 | motion | 8/8 |  | `build/screenshots/evidence/w6j-green/SAM-21.png` | 8 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- SH-98: SH-98-p1-L3-1366x768: the moment "visible:#mission .oc-card.peek" never came; moments seen: page:start, life:order-level, life:request, line:cook, life:say-start, life:popup-open, life:say-end, rec:start, cook:click, only:#intro .ic-card, rec:order-card-big, life:stage-start, life:decoys, life:popup-fold, life:step-open, life:step-call, rec:order-card-in-sidebar, cook-done:click, rec:view-marble, rec:hint-nani-says, life:help, life:glow, rec:hint-glow, rec:bulb-english, rec:kind-tap, cook:tap, exp:strip, cook-done:tap, life:act, exp:ph-keema, exp:veg-12, exp:veg-01, rec:kind-click, only:#done-
