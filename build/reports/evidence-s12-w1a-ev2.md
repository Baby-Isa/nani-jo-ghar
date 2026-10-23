# Evidence run s12-w1a-ev2

Commit d3e1c0d. 4 rows: 1 for a reviewer, 3 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 10 pages. Sheets and text: `build/screenshots/evidence/s12-w1a-ev2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s12-w1a-ev2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| EASY-08 | detail | 4/4 | PASS: machine: count:.njg-spot .ob-box=1 (1 visible); count:.njg-spot .ob-box=1 (1 visible); count:.njg-spot .ob-box=1 (1 visi | `build/screenshots/evidence/s12-w1a-ev2/EASY-08.png` | 3 |
| CK-50 | text | 1/1 | PASS: machine: pass (node build/core/cook-l1-order.test.mjs: exit 0) | (text only) | 0 |
| CK-51 | detail | 4/4 |  | `build/screenshots/evidence/s12-w1a-ev2/CK-51.png` | 3 |
| CHAI-32 | layout | 5/5 | FAIL: machine: CHAI-32-p2-L1-1366x768: count:.ck-callout=1: 0 visible; CHAI-32-p2-L1-1366x768: count:.njg-spot=0: 1 visible | `build/screenshots/evidence/s12-w1a-ev2/CHAI-32.png` | 5 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
