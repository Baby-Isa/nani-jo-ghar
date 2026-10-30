# Evidence run s15-chai-ev4

Commit dd20952. 6 rows: 4 for a reviewer, 0 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 15 pages. Sheets and text: `build/screenshots/evidence/s15-chai-ev4/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id s15-chai-ev4`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-171 | motion | 3/3 |  | `build/screenshots/evidence/s15-chai-ev4/SH-171.png` | 3 |
| SH-172 | layout | 2/2 | TOOL FAILURE | (text only) | 4 |
| SH-165 | detail | 3/3 |  | `build/screenshots/evidence/s15-chai-ev4/SH-165.png` | 4 |
| SH-163 | motion | 5/5 |  | `build/screenshots/evidence/s15-chai-ev4/SH-163.png` | 5 |
| CHAI-50 | text | 2/2 |  | `build/screenshots/evidence/s15-chai-ev4/CHAI-50.png` | 1 |
| CHAI-40 | voice | 2/2 | TOOL FAILURE | (text only) | 0 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-172: spec: SH-172 probe 2: at "life:helper-open": no driver of cook:chai-tray@L3#hint reaches it (add it to the driver and lib/moments.mjs first)
- CHAI-40: spec: CHAI-40 probe 3: at "life:helper-open": no driver of cook:chai-tray@L3#hint reaches it (add it to the driver and lib/moments.mjs first) · spec: CHAI-40 probe 4: at "life:helper-open": no driver of cook:chai-tray@L4#hint reaches it (add it to the driver and lib/moments.mjs first)
