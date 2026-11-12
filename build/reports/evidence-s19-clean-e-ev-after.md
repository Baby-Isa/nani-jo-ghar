# Evidence run s19-clean-e-ev-after

Commit bb281f3fb. 24 rows: 21 for a reviewer, 1 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 47 pages. Sheets and text: `build/screenshots/evidence/s19-clean-e-ev-after/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s19-clean-e-ev-after`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| ART-52 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/ART-52.png` | 2 |
| PAN-21 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/PAN-21.png` | 2 |
| DAAR-36 | motion | 5/5 |  | `build/screenshots/evidence/s19-clean-e-ev-after/DAAR-36.png` | 5 |
| DAAR-39 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/DAAR-39.png` | 2 |
| SEK-26 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/SEK-26.png` | 2 |
| SEK-27 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/SEK-27.png` | 2 |
| SAM-34 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/SAM-34.png` | 2 |
| MAA-20 | motion | 1/1 |  | `build/screenshots/evidence/s19-clean-e-ev-after/MAA-20.png` | 1 |
| CHT-19 | text | 4/4 |  | (text only) | 0 |
| CK-46 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-46.png` | 2 |
| CK-55 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-55.png` | 2 |
| CK-65 | layout | 4/4 | PASS: machine: pass (pass: the cmd's exit code (the CLI); node build/tools/review/green-check.mjs: exit 0); pass (pass: the cm | `build/screenshots/evidence/s19-clean-e-ev-after/CK-65.png` | 4 |
| CK-75 | layout | 4/4 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-75.png` | 4 |
| CK-76 | layout | 4/4 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-76.png` | 4 |
| CK-81 | layout | 8/8 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-81.png` | 8 |
| CK-82 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-82.png` | 4 |
| CK-86 | layout | 4/4 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-86.png` | 4 |
| CK-78 | layout | 8/8 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-78.png` | 8 |
| CK-79 | layout | 7/8 | TOOL FAILURE | (text only) | 8 |
| CK-89 | layout | 4/4 |  | `build/screenshots/evidence/s19-clean-e-ev-after/CK-89.png` | 4 |
| CHT-17 | motion | 4/5 | TOOL FAILURE | (text only) | 4 |
| ART-72 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/ART-72.png` | 2 |
| ART-79 | layout | 4/4 |  | `build/screenshots/evidence/s19-clean-e-ev-after/ART-79.png` | 4 |
| ART-80 | layout | 2/2 |  | `build/screenshots/evidence/s19-clean-e-ev-after/ART-80.png` | 2 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- CK-79: CK-79-p1-L1-1920x1080: the moment "view-marble" never came; moments seen: page:start, life:cover, life:order-count, life:order-level, life:decoys, life:poke, rec:start, life:ghost, talk:nana, line:cook, life:request, life:dish-flash, life:say-start, life:popup-open, cook:click, only:.njg-rq-card, bubble, life:say-end, life:order-pass, life:card-fold, life:pop-face, rec:order-card-big, life:idle-bump, life:skip-zone, life:order-skip, life:stage-start, life:step-open, life:step-call, life:chop-strip, life:popup-fold, life:rung, rec:order-card-in-sidebar, cook-done:click, life:chop-throw, life:ch
- CHT-17: CHT-17-p2-L1-1920x1080: the moment "view-marble" never came; moments seen: page:start, life:cover, life:order-count, life:order-level, life:poke, life:ghost, rec:start, life:request, life:popup-open, talk:nana, line:cook, life:dish-flash, life:say-start, cook:click, only:.njg-rq-card, bubble, life:say-end, life:stage-start, life:popup-fold, life:step-open, life:decoys, life:step-call, life:chop-strip, life:rung, rec:order-card-big, life:chop-throw, life:chop-hop, rec:order-card-in-sidebar, cook-done:click, life:helper-open, life:step-close, rec:kind-slice, cook:slice, exp:veg-01, life:idle-bum
