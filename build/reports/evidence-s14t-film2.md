# Evidence run s14t-film2

Commit fa803a80. 1 rows: 0 for a reviewer, 0 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 2 pages. Sheets and text: `build/screenshots/evidence/s14t-film2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s14t-film2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-152 | motion | 2/2 | TOOL FAILURE | (text only) | 0 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- SH-152: SH-152-p1-L1-1920x1080: strip:body:60x200 at life:request (hit 1): capture failed: allTimesOf is not defined · SH-152-p1-L1-930x430: strip:body:60x200 at life:request (hit 1): capture failed: allTimesOf is not defined
