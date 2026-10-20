# Evidence run w4a-evred2

Commit 314f2e77. 3 rows: 2 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 3 pages. Sheets and text: `build/screenshots/evidence/w4a-evred2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id w4a-evred2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-117 | motion | 1/1 |  | `build/screenshots/evidence/w4a-evred2/SH-117.png` | 1 |
| DAAR-30 | motion | 2/2 |  | `build/screenshots/evidence/w4a-evred2/DAAR-30.png` | 2 |
| DAAR-34 | motion | 2/2 | TOOL FAILURE | (text only) | 0 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- DAAR-34: DAAR-34-p1-L3-1366x768: strip:#mission:8x700 at rec:kind-slice (hit 1): the filmstrip of "#mission" did not change over 8 frames (700 ms apart) · DAAR-34-p1-L4-1366x768: strip:#mission:8x700 at rec:kind-slice (hit 1): the filmstrip of "#mission" did not change over 8 frames (700 ms apart)
