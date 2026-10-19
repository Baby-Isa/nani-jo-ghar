# Evidence run w4a-evgreen

Commit 314f2e77. 11 rows: 8 for a reviewer, 2 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 8 pages. Sheets and text: `build/screenshots/evidence/w4a-evgreen/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id w4a-evgreen`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-117 | motion | 1/1 |  | `build/screenshots/evidence/w4a-evgreen/SH-117.png` | 1 |
| DAAR-05 | detail | 3/3 |  | `build/screenshots/evidence/w4a-evgreen/DAAR-05.png` | 4 |
| DAAR-26 | text | 4/4 |  | (text only) | 0 |
| DAAR-27 | voice | 2/2 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks) | (text only) | 0 |
| DAAR-29 | detail | 4/4 |  | `build/screenshots/evidence/w4a-evgreen/DAAR-29.png` | 4 |
| DAAR-30 | motion | 2/2 |  | `build/screenshots/evidence/w4a-evgreen/DAAR-30.png` | 2 |
| DAAR-31 | detail | 4/4 |  | `build/screenshots/evidence/w4a-evgreen/DAAR-31.png` | 4 |
| DAAR-32 | text | 1/1 |  | (text only) | 0 |
| DAAR-33 | layout | 3/3 |  | `build/screenshots/evidence/w4a-evgreen/DAAR-33.png` | 4 |
| DAAR-34 | motion | 2/2 | TOOL FAILURE | (text only) | 1 |
| DAAR-35 | motion | 2/2 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks) | `build/screenshots/evidence/w4a-evgreen/DAAR-35.png` | 2 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- DAAR-34: DAAR-34-p1-L4-1366x768: strip:#mission:8x700 at rec:kind-slice (hit 1): the filmstrip of "#mission" did not change over 8 frames (700 ms apart)
