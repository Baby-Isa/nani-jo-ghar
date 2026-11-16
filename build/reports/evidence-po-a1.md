# Evidence run po-a1

Commit f84c824. 16 rows: 2 for a reviewer, 14 decided by the machine, 0 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 30 pages. Sheets and text: `build/screenshots/evidence/po-a1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-a1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-270 | layout | 3/3 | FAIL: machine: SH-270-p1-L1-1280x665: count:#guide .ng-face>=1: 0 visible (8 moments); SH-270-p1-L1-740x320: count:#guide .ng- | `build/screenshots/evidence/po-a1/SH-270.png` | 3 |
| SH-271 | text | 4/4 | PASS: machine: contract-117 (0 breaks on this page); contract-117 (0 breaks on this page); contract-117 (0 breaks on this page | (text only) | 0 |
| SH-273 | text | 5/5 | PASS: machine: contract-128 (0 breaks on this page); contract-128 (0 breaks on this page); contract-128 (0 breaks on this page | (text only) | 0 |
| SH-276 | layout | 2/2 | PASS: machine: !textMatches:(?i)chop these (not (no text a child sees (only hidden tags))); !textMatches:(?i)chop these (not ( | `build/screenshots/evidence/po-a1/SH-276.png` | 2 |
| SH-277 | layout | 3/3 | FAIL: machine: SH-277-p1-L1-740x320: lines:#mission .oc-headline<=1: lines 2 (7 moments); SH-277-p1-L4-740x320: lines:#mission | `build/screenshots/evidence/po-a1/SH-277.png` | 3 |
| SH-279 | layout | 3/3 |  | `build/screenshots/evidence/po-a1/SH-279.png` | 3 |
| SH-288 | layout | 4/4 | FAIL: machine: SH-288-p1-L1-1280x665: noFinding:tap-small: 1 tap-small: div.oc-parts > div.oc-part.oc-row > div > p.oc-t.wc-k  | `build/screenshots/evidence/po-a1/SH-288.png` | 4 |
| SH-289 | layout | 1/1 | PASS: machine: noFinding:text-clipped (no text-clipped); noClip:.njg-results (1 clean) | `build/screenshots/evidence/po-a1/SH-289.png` | 1 |
| SH-291 | text | 2/2 | PASS: machine: contract-99 (0 breaks on this page); contract-99 (0 breaks on this page) | (text only) | 0 |
| SH-300 | layout | 1/1 | FAIL: machine: SH-300-p1-L1-740x320: !textMatches:[A-Za-z]: not (text: "Mare ji chai banai .") | `build/screenshots/evidence/po-a1/SH-300.png` | 2 |
| SH-304 | text | 4/4 | PASS: machine: contract-129 (0 breaks on this page); contract-129 (0 breaks on this page); contract-129 (0 breaks on this page | (text only) | 0 |
| PAN-23 | layout | 4/4 |  | `build/screenshots/evidence/po-a1/PAN-23.png` | 4 |
| MAA-25 | text | 2/2 | PASS: machine: contract-109 (0 breaks on this page); contract-115 (0 breaks on this page); contract-109 (0 breaks on this page | (text only) | 0 |
| CK-93 | layout | 2/2 | FAIL: machine: CK-93-p1-L1-1280x665: count:.cv-line>=1: 0 visible; CK-93-p1-L1-740x320: count:.cv-line>=1: 0 visible | `build/screenshots/evidence/po-a1/CK-93.png` | 2 |
| CK-115 | layout | 4/4 | FAIL: machine: CK-115-p1-L1-740x320: noClip:#mission .oc-card: .njg-face-btn past the edge; CK-115-p1-L2-740x320: noClip:#miss | `build/screenshots/evidence/po-a1/CK-115.png` | 8 |
| CHAI-114 | layout | 1/1 | FAIL: machine: CHAI-114-p1-L4-740x320: noClip:#guide: .njg-face-btn past the edge (17 moments) | `build/screenshots/evidence/po-a1/CHAI-114.png` | 1 |

## Tool failures (0): for the tool owner, never a FAIL in regressions.md

none
