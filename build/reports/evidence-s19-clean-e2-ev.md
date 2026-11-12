# Evidence run s19-clean-e2-ev

Commit 91a47c87e. 10 rows: 7 for a reviewer, 1 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 28 pages. Sheets and text: `build/screenshots/evidence/s19-clean-e2-ev/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s19-clean-e2-ev`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| ART-52 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e2-ev/ART-52.png` | 2 |
| DAAR-36 | motion | 5/5 |  | `build/screenshots/evidence/s19-clean-e2-ev/DAAR-36.png` | 5 |
| DAAR-39 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e2-ev/DAAR-39.png` | 2 |
| CHT-19 | text | 4/4 |  | (text only) | 0 |
| CK-65 | layout | 4/4 | PASS: machine: pass (pass: the cmd's exit code (the CLI); node build/tools/review/green-check.mjs: exit 0); pass (pass: the cm | `build/screenshots/evidence/s19-clean-e2-ev/CK-65.png` | 4 |
| CK-75 | layout | 4/4 |  | `build/screenshots/evidence/s19-clean-e2-ev/CK-75.png` | 4 |
| CK-76 | layout | 4/4 |  | `build/screenshots/evidence/s19-clean-e2-ev/CK-76.png` | 4 |
| CK-79 | layout | 7/8 | TOOL FAILURE | (text only) | 8 |
| CHT-17 | motion | 3/5 | TOOL FAILURE | (text only) | 3 |
| ART-72 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e2-ev/ART-72.png` | 2 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- CK-79: CK-79-p1-L1-1920x1080: the moment "view-marble" never came; moments seen: page:start, life:cover, life:order-count, life:order-level, life:decoys, life:poke, rec:start, life:ghost, cook:click, only:.njg-rq-card, talk:nana, line:cook, life:request, life:dish-flash, life:say-start, life:popup-open, bubble, life:say-end, life:order-pass, life:card-fold, life:pop-face, rec:order-card-big, life:idle-bump, life:skip-zone, life:order-skip, life:stage-start, life:step-open, life:band, life:step-call, life:chop-strip, life:popup-fold, life:rung, rec:order-card-in-sidebar, cook-done:click, life:chop-thr
- CHT-17: CHT-17-p2-L1-1920x1080: the moment "view-marble" never came; moments seen: page:start, life:cover, life:order-count, life:order-level, life:poke, rec:start, life:ghost, talk:nana, line:cook, life:request, life:dish-flash, life:say-start, life:popup-open, cook:click, only:.njg-rq-card, bubble, life:say-end, life:stage-start, life:step-open, life:popup-fold, life:band, life:decoys, life:step-call, life:chop-strip, life:rung, rec:order-card-big, life:chop-throw, life:chop-hop, rec:order-card-in-sidebar, cook-done:click, life:helper-open, life:step-close, life:stage-end, rec:kind-slice, cook:slice
