# Evidence run po-g1

Commit ab79b66b. 6 rows: 1 for a reviewer, 5 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 9 pages. Sheets and text: `build/screenshots/evidence/po-g1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-g1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-224 | text | 1/1 | FAIL: machine: SH-224-p1-repo: pass: node build/test_fonts_local.mjs: exit 1 | (text only) | 0 |
| SH-229 | layout | 2/2 | PASS: machine: noFinding:covered (no covered); noFinding:text-clipped (no text-clipped); noFinding:covered (no covered) | `build/screenshots/evidence/po-g1/SH-229.png` | 2 |
| SH-275 | layout | 4/4 |  | `build/screenshots/evidence/po-g1/SH-275.png` | 4 |
| SH-300 | layout | 2/2 | PASS: machine: count:#guide .ng-say=0 (0 visible); count:#guide .ng-say=0 (0 visible) | `build/screenshots/evidence/po-g1/SH-300.png` | 4 |
| CHT-22 | layout | 2/2 | PASS: machine: noOverlap:.njg-onboard .ob-box,#side-cog (no overlap (3 moments)); noOverlap:.njg-onboard .ob-box,#side-cog (no | `build/screenshots/evidence/po-g1/CHT-22.png` | 2 |
| LAB-08 | text | 1/1 | PASS: machine: pass (node build/test_labs_importmap.mjs: exit 0) | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
