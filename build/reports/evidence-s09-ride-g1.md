# Evidence run s09-ride-g1

Commit 03c102c. 6 rows: 2 for a reviewer, 3 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 8 pages. Sheets and text: `build/screenshots/evidence/s09-ride-g1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s09-ride-g1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| RIDE-01 | motion | 2/2 |  | `build/screenshots/evidence/s09-ride-g1/RIDE-01.png` | 2 |
| RIDE-02 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| RIDE-03 | motion | 3/3 | FAIL: machine: RIDE-03-p2-L1-800x360: lastsMs:.wr-member<=4500: on screen 7287 ms (still at the end) | (text only) | 0 |
| RIDE-04 | voice | 1/1 | PASS: machine: contract-48 (0 breaks on this page) | (text only) | 0 |
| RIDE-05 | text | 1/1 | PASS: machine: pass (node build/leak_window_ride.mjs --speeds slow,normal,fast: exit 0) | (text only) | 0 |
| RIDE-06 | layout | 4/4 |  | `build/screenshots/evidence/s09-ride-g1/RIDE-06.png` | 4 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- RIDE-02: spec: RIDE-02 probe 1: at "call": no driver of day:window reaches it (add it to the driver and lib/moments.mjs first) · no evidence spec for this row (build/sandbox/data/evidence.json)
