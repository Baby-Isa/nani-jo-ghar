# Evidence run s12-w1a-ev5

Commit 4afad8c. 2 rows: 1 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 9 pages. Sheets and text: `build/screenshots/evidence/s12-w1a-ev5/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s12-w1a-ev5`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-118 | layout | 9/9 |  | `build/screenshots/evidence/s12-w1a-ev5/SH-118.png` | 9 |
| SH-119 | motion | 9/9 | TOOL FAILURE | (text only) | 8 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- SH-119: SH-119-p1-L1-1366x768: strip:.njg-spot:6x500 at exp:cook-paani (hit 1): capture failed: page.screenshot: Timeout 10000ms exceeded.
