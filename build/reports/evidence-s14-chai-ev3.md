# Evidence run s14-chai-ev3

Commit ef1b9bb8. 2 rows: 0 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 2 pages. Sheets and text: `build/screenshots/evidence/s14-chai-ev3/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s14-chai-ev3`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-164 | detail | 2/2 | TOOL FAILURE | (text only) | 3 |
| CHAI-46 | detail | 2/2 | TOOL FAILURE | (text only) | 1 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-164: SH-164-p1-L1-930x430: zoom2:canvas:pan at life:timed-hold (hit 1): "canvas:pan" is not on screen at life:timed-hold
- CHAI-46: CHAI-46-p1-L1-1920x1080: zoom2:canvas:pan at life:timed-hold (hit 1): "canvas:pan" is not on screen at life:timed-hold
