# Evidence run s12-w1a-ev1

Commit 6d8849f. 9 rows: 3 for a reviewer, 3 decided by the machine, 3 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 11 pages. Sheets and text: `build/screenshots/evidence/s12-w1a-ev1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s12-w1a-ev1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| EASY-08 | detail | 3/3 | TOOL FAILURE | (text only) | 3 |
| SH-118 | layout | 1/1 |  | `build/screenshots/evidence/s12-w1a-ev1/SH-118.png` | 1 |
| SH-119 | motion | 2/2 |  | `build/screenshots/evidence/s12-w1a-ev1/SH-119.png` | 1 |
| SH-120 | layout | 1/1 | PASS: machine: count:.njg-spot.on=1 (1 visible); count:.ob-finger=1 (1 visible) | `build/screenshots/evidence/s12-w1a-ev1/SH-120.png` | 1 |
| EASY-03 | layout | 4/4 |  | `build/screenshots/evidence/s12-w1a-ev1/EASY-03.png` | 4 |
| CK-50 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| CK-51 | detail | 3/3 | TOOL FAILURE | (text only) | 3 |
| CHAI-32 | layout | 5/5 | FAIL: machine: CHAI-32-p2-L1-1366x768: count:.ck-callout=1: 0 visible; CHAI-32-p2-L1-1366x768: count:.njg-spot=0: 1 visible | `build/screenshots/evidence/s12-w1a-ev1/CHAI-32.png` | 5 |
| EASY-10 | layout | 1/1 | PASS: machine: count:.njg-spot.on=1 (1 visible) | `build/screenshots/evidence/s12-w1a-ev1/EASY-10.png` | 2 |

## Tool failures (3): for the tool owner, never a FAIL in regressions.md

- EASY-08: spec: EASY-08 probe 2: cmd "node --test build/test_shared_word_card.mjs": a script under build/
- CK-50: spec: CK-50 probe 1: cmd "node --test build/core/cook-l1-order.test.mjs": a script under build/ · no evidence spec for this row (build/sandbox/data/evidence.json)
- CK-51: spec: CK-51 probe 2: cmd "node --test build/core/cook-l1-order.test.mjs": a script under build/
