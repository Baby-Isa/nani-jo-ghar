# Evidence run s09-ride-r3

Commit 25f0cb6b. 6 rows: 1 for a reviewer, 4 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 7 pages. Sheets and text: `build/screenshots/evidence/s09-ride-r3/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s09-ride-r3`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| RIDE-01 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| RIDE-02 | layout | 2/2 | PASS: machine: contract-47 (0 breaks on this page); contract-47 (0 breaks on this page) | `build/screenshots/evidence/s09-ride-r3/RIDE-02.png` | 2 |
| RIDE-03 | motion | 3/3 | PASS: machine: lastsMs:.wr-member>=8000 (on screen 10637 ms); lastsMs:.wr-member>=3000 (on screen 3779 ms); lastsMs:.wr-member | (text only) | 0 |
| RIDE-04 | voice | 1/1 | PASS: machine: contract-48 (0 breaks on this page) | (text only) | 0 |
| RIDE-05 | text | 1/1 | PASS: machine: pass (node build/leak_window_ride.mjs --speeds slow,normal,fast: exit 0) | (text only) | 0 |
| RIDE-06 | layout | 4/4 |  | `build/screenshots/evidence/s09-ride-r3/RIDE-06.png` | 4 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- RIDE-01: spec: RIDE-01 probe 1: strip "strip:.wr-view:16x800": 2 to 12 frames · no evidence spec for this row (build/sandbox/data/evidence.json)
