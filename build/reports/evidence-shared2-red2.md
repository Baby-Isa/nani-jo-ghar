# Evidence run shared2-red2

Commit a6961675. 4 rows: 2 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 18 pages. Sheets and text: `build/screenshots/evidence/shared2-red2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id shared2-red2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-113 | detail | 4/5 | TOOL FAILURE | (text only) | 4 |
| CLN-82 | layout | 8/8 |  | `build/screenshots/evidence/shared2-red2/CLN-82.png` | 8 |
| CLN-155 | layout | 2/2 |  | `build/screenshots/evidence/shared2-red2/CLN-155.png` | 2 |
| SH-63 | text | 4/4 | TOOL FAILURE | (text only) | 0 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-113: SH-113-p1-L1-1366x768: the moment "order-card-in-sidebar" never came; moments seen: page:start, life:order-level, life:request, line:cook, life:say-start, life:popup-open, life:say-end, life:stage-start, life:decoys, life:popup-fold, rec:start, life:step-open, life:step-call, rec:view-marble, life:help, life:glow, rec:kind-tap, cook:tap, exp:cook-paani, cook-done:tap, life:act, life:chai-add, exp:cook-chai, exp:cook-khun, life:step-close, exp:spi-10, exp:knob-on-nana, life:chai-slow, rec:kind-timing, cook:timing, exp:knob-nana, cook-done:timing, life:chai-down, exp:pour-nana, life:stage-end, t
- SH-63: SH-63-p2-L1-1366x768: dom:#mission .oc-strip at life:step-open (hit 1): no text on screen in "#mission .oc-strip" at life:step-open · SH-63-p2-L1-1366x768: dom:#mission .oc-strip at life:step-open (hit 2): no text on screen in "#mission .oc-strip" at life:step-open · SH-63-p2-L1-1366x768: dom:#mission .oc-strip at life:step-open (hit 3): no text on screen in "#mission .oc-strip" at life:step-open
