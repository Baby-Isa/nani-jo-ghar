# Evidence run po-l1

Commit a4d3a78e. 4 rows: 2 for a reviewer, 1 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 5 pages. Sheets and text: `build/screenshots/evidence/po-l1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-l1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-211 | motion | 2/2 |  | `build/screenshots/evidence/po-l1/SH-211.png` | 2 |
| LNG-22 | text | 1/1 | FAIL: machine: LNG-22-p1-repo: pass: node build/test_no_religious_set_pieces.mjs: exit 1 | (text only) | 0 |
| SH-135 | layout | 2/2 | TOOL FAILURE | (text only) | 0 |
| SH-136 | detail | 1/1 |  | `build/screenshots/evidence/po-l1/SH-136.png` | 1 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- SH-135: SH-135-p1-L1-1280x665: shot at rec:title (hit 1): the screen is one flat colour at rec:title (nothing drawn yet) · SH-135-p1-L1-740x320: shot at rec:title (hit 1): the screen is one flat colour at rec:title (nothing drawn yet)
