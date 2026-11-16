# Evidence run po-j1

Commit a4d3a78e. 4 rows: 1 for a reviewer, 3 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 12 pages. Sheets and text: `build/screenshots/evidence/po-j1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-j1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-271 | motion | 4/4 | PASS: machine: lastsMs:.njg-onboard .ob-shade>=1000 (on screen 2636 ms); lastsMs:.njg-onboard .ob-shade>=1000 (on screen 3515  | `build/screenshots/evidence/po-j1/SH-271.png` | 12 |
| MAA-25 | layout | 4/4 |  | `build/screenshots/evidence/po-j1/MAA-25.png` | 4 |
| CHAI-114 | layout | 4/4 | PASS: machine: noClip:#guide .ng-say (1 clean (12 moments)); noClip:#guide .ng-say (1 clean (17 moments)); noClip:#guide .ng-s | `build/screenshots/evidence/po-j1/CHAI-114.png` | 4 |
| ART-74 | text | 1/1 | PASS: machine: pass (node build/test_no_upload_folders.mjs: exit 0) | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
