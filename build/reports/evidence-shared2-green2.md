# Evidence run shared2-green2

Commit fadea953. 7 rows: 5 for a reviewer, 1 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 27 pages. Sheets and text: `build/screenshots/evidence/shared2-green2/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id shared2-green2`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-53 | layout | 3/3 |  | `build/screenshots/evidence/shared2-green2/SH-53.png` | 4 |
| SH-113 | detail | 5/5 |  | `build/screenshots/evidence/shared2-green2/SH-113.png` | 5 |
| PAN-01 | detail | 4/4 | PASS: machine: noClip:#mission (1 clean (5 moments)); !textMatches:…/\.\.\. (not (no text a child sees (only hidden tags))); n | `build/screenshots/evidence/shared2-green2/PAN-01.png` | 4 |
| CLN-82 | layout | 9/10 | TOOL FAILURE | (text only) | 10 |
| CLN-87 | motion | 3/3 |  | `build/screenshots/evidence/shared2-green2/CLN-87.png` | 3 |
| CLN-155 | layout | 2/2 |  | `build/screenshots/evidence/shared2-green2/CLN-155.png` | 2 |
| SH-63 | text | 4/4 |  | (text only) | 0 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- CLN-82: CLN-82-p1-L3-1366x768: the moment "visible:.cl-row.next-up" never came; moments seen: page:start, host:idle, life:stage-start, life:stage-end, host:clinic/cut/heal, life:request, clinic:heal/game, step:row-0-0, life:popup-open, line:clinic-doctor, life:popup-fold, rec:stage-heal, rec:heal-cut-start, heal:paani, life:act, heal-done:paani, step:paani, heal:wash, life:step-close, step:row-0-1, heal-done:wash, step:wash, heal:cloth, heal-done:cloth, step:cloth, heal:tap, heal-done:tap, step:tap, rec:heal-cut-mid, heal:pl-yellow, step:row-0-2, heal-done:pl-yellow, step:pl-yellow, step:row-0-3, heal
