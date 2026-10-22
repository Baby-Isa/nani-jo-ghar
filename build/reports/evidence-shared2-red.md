# Evidence run shared2-red

Commit a6961675. 4 rows: 3 for a reviewer, 1 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 11 pages. Sheets and text: `build/screenshots/evidence/shared2-red/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id shared2-red`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-53 | layout | 3/3 |  | `build/screenshots/evidence/shared2-red/SH-53.png` | 4 |
| PAN-01 | detail | 4/4 | FAIL: machine: PAN-01-p1-L1-800x360: noClip:#mission: .oc-in scrolls down; .oc-items past the edge; .oc-item past the edge; .o | `build/screenshots/evidence/shared2-red/PAN-01.png` | 4 |
| CLN-87 | motion | 3/3 |  | `build/screenshots/evidence/shared2-red/CLN-87.png` | 3 |
| SH-63 | text | 2/2 |  | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
