# Evidence run ev-s05b-p17g

Commit a779674. 3 rows: 0 for a reviewer, 3 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 6 pages. Sheets and text: `build/screenshots/evidence/ev-s05b-p17g/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id ev-s05b-p17g`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| PAN-04 | voice | 3/3 | PASS: machine: pass (0 contract breaks); pass (0 contract breaks); pass (0 contract breaks) | (text only) | 0 |
| PAN-16 | voice | 2/2 | PASS: machine: !textMatches:(Muke [a-z]+ de\.)\s+\1 (not (text: "Muke dudh de. Muke daar de. Muke khun de. Muke dudh de. hakro | (text only) | 0 |
| PAN-17 | text | 4/4 | FAIL: machine: PAN-17-p1-L3-1366x768: !textMatches:(?i)\bMuke [a-z]+ de\b: not (text: "Muke atto de. Bring me these ? ⌂ 📖");  | (text only) | 0 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
