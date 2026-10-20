# Evidence run s09-ride-fix2

Commit a9c5b962. 6 rows: 2 for a reviewer, 4 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 8 pages. Sheets and text: `build/screenshots/evidence/s09-ride-fix2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s09-ride-fix2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| RIDE-01 | motion | 2/2 |  | `build/screenshots/evidence/s09-ride-fix2/RIDE-01.png` | 2 |
| RIDE-02 | layout | 2/2 | PASS: machine: contract-47 (0 breaks on this page); contract-47 (0 breaks on this page) | `build/screenshots/evidence/s09-ride-fix2/RIDE-02.png` | 2 |
| RIDE-03 | motion | 3/3 | PASS: machine: lastsMs:.wr-member>=8000 (on screen 10692 ms); lastsMs:.wr-member>=3000 (on screen 3923 ms); lastsMs:.wr-member | (text only) | 0 |
| RIDE-04 | voice | 1/1 | PASS: machine: contract-48 (0 breaks on this page) | (text only) | 0 |
| RIDE-05 | text | 1/1 | PASS: machine: pass (node build/leak_window_ride.mjs --speeds slow,normal,fast: exit 0) | (text only) | 0 |
| RIDE-06 | layout | 4/4 |  | `build/screenshots/evidence/s09-ride-fix2/RIDE-06.png` | 4 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
