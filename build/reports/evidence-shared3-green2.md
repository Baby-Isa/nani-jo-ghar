# Evidence run shared3-green2

Commit c439077e. 5 rows: 3 for a reviewer, 1 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 19 pages. Sheets and text: `build/screenshots/evidence/shared3-green2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id shared3-green2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-113 | detail | 5/5 |  | `build/screenshots/evidence/shared3-green2/SH-113.png` | 5 |
| DAAR-12 | detail | 5/6 | TOOL FAILURE | (text only) | 5 |
| CLN-87 | motion | 3/3 |  | `build/screenshots/evidence/shared3-green2/CLN-87.png` | 3 |
| SH-56 | text | 3/3 | PASS: machine: !textMatches:(?i)make each pan/^\s*$ (not (text: "Dudh wiji chad! Khun wiji chad! Khun wiji chad! Khun wiji cha | (text only) | 0 |
| SH-63 | text | 4/4 |  | (text only) | 0 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- DAAR-12: DAAR-12-p1-L3-1366x768: the moment "stir-mid" never came (the flow stopped: page.waitForSelector: Timeout 20000ms exceeded.); moments seen: page:start, rec:stopped-here
