# Evidence run po-m1

Commit 0d7c2621. 2 rows: 1 for a reviewer, 1 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 6 pages. Sheets and text: `build/screenshots/evidence/po-m1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-m1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| PAN-23 | layout | 4/4 | PASS: machine: noOverlap:.cv-bubble,.wc14-pop (no overlap (3 moments)); contract-129 (0 breaks on this page); noOverlap:.cv-bu | `build/screenshots/evidence/po-m1/PAN-23.png` | 4 |
| SH-135 | layout | 2/2 |  | `build/screenshots/evidence/po-m1/SH-135.png` | 2 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
