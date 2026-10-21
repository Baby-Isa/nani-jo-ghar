# Evidence run s09-ride-g2

Commit 03c102c. 2 rows: 0 for a reviewer, 2 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 4 pages. Sheets and text: `build/screenshots/evidence/s09-ride-g2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s09-ride-g2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| RIDE-02 | layout | 2/2 | PASS: machine: contract-47 (0 breaks on this page); contract-47 (0 breaks on this page) | `build/screenshots/evidence/s09-ride-g2/RIDE-02.png` | 2 |
| RIDE-03 | motion | 3/3 | PASS: machine: lastsMs:.wr-member>=8000 (on screen 10677 ms); lastsMs:.wr-member>=3000 (on screen 4001 ms); lastsMs:.wr-member | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
