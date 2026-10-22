# Evidence run s10b-ev

Commit 5e050a1. 3 rows: 2 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 10 pages. Sheets and text: `build/screenshots/evidence/s10b-ev/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s10b-ev`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| GIRL-01 | layout | 3/3 |  | `build/screenshots/evidence/s10b-ev/GIRL-01.png` | 4 |
| DRILL-01 | motion | 3/3 | TOOL FAILURE | (text only) | 2 |
| FX-01 | motion | 5/5 |  | `build/screenshots/evidence/s10b-ev/FX-01.png` | 5 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- DRILL-01: DRILL-01-p1-L1-1366x768: strip:.cl-heal:6x250 at step:drill (hit 1): the filmstrip of ".cl-heal" did not change over 6 frames (250 ms apart) · DRILL-01-p1-L3-1366x768: strip:.cl-heal:6x250 at step:drill (hit 1): the filmstrip of ".cl-heal" did not change over 6 frames (250 ms apart)
