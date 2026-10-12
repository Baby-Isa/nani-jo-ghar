# Evidence run ev-s04-ev4

Commit 7812e59a. 3 rows: 2 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 12 pages. Sheets and text: `build/screenshots/evidence/ev-s04-ev4/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id ev-s04-ev4`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-17 | motion | 3/3 |  | `build/screenshots/evidence/ev-s04-ev4/SH-17.png` | 3 |
| CLN-85 | layout | 2/2 |  | `build/screenshots/evidence/ev-s04-ev4/CLN-85.png` | 2 |
| CLN-22 | detail | 7/7 | TOOL FAILURE | (text only) | 4 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- CLN-22: CLN-22-p3-L2-1366x768: strip:.cl-tray:6x300 at rec:pharmacy-belt (hit 1): the filmstrip of ".cl-tray" did not change over 6 frames (300 ms apart)
