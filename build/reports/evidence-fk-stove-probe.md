# Evidence run fk-stove-probe

Commit f7fa3dea. 2 rows: 0 for a reviewer, 2 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 16 pages. Sheets and text: `build/screenshots/evidence/fk-stove-probe/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id fk-stove-probe`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-308 | layout | 8/8 | PASS: machine: count:#mission .oc-card:not(.folded)=0 (0 visible); inside:#mission .oc-card,#side (1 inside); count:#mission . | `build/screenshots/evidence/fk-stove-probe/SH-308.png` | 12 |
| CK-132 | motion | 8/8 | FAIL: machine: CK-132-p1-L1-1280x665: traceRepeats:#guide .ng-arrow>=2: repeats 0; CK-132-p1-L1-740x320: traceRepeats:#guide . | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
