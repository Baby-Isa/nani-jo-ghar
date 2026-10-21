# Evidence run sweep-3

Commit 75727a2d. 6 rows: 3 for a reviewer, 2 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 18 pages. Sheets and text: `build/screenshots/evidence/sweep-3/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id sweep-3`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| PAN-01 | detail | 3/3 | PASS: machine: noClip:#mission (1 clean (6 moments)); !textMatches:…/\.\.\. (not (no text a child sees (only hidden tags))); n | `build/screenshots/evidence/sweep-3/PAN-01.png` | 3 |
| DAAR-12 | detail | 5/6 | TOOL FAILURE | (text only) | 5 |
| SAM-22 | detail | 8/8 |  | `build/screenshots/evidence/sweep-3/SAM-22.png` | 8 |
| CK-21 | detail | 2/2 |  | `build/screenshots/evidence/sweep-3/CK-21.png` | 2 |
| CK-07 | layout | 3/3 |  | `build/screenshots/evidence/sweep-3/CK-07.png` | 4 |
| LNG-09 | text | 2/2 | PASS: machine: textMatches:ATEMPO = 1\.0 (the script's output matches /ATEMPO = 1\.0/); textMatches:u\.rate = 1; (the script's | (text only) | 0 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- DAAR-12: DAAR-12-p1-L1-1366x768: the moment "stir-mid" never came (the flow stopped: page.waitForSelector: Timeout 20000ms exceeded.); moments seen: page:start, rec:stopped-here
