# Evidence run po-e1

Commit ab79b66b. 8 rows: 3 for a reviewer, 4 decided by the machine, 1 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 20 pages. Sheets and text: `build/screenshots/evidence/po-e1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-e1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-276 | layout | 2/2 | FAIL: machine: SH-276-p1-L1-740x320: count:#mission .oc-card .oc-face>=1: 0 visible (6 moments); SH-276-p2-L1-740x320: count:# | `build/screenshots/evidence/po-e1/SH-276.png` | 2 |
| SH-279 | layout | 4/4 |  | `build/screenshots/evidence/po-e1/SH-279.png` | 4 |
| SH-300 | layout | 2/2 | TOOL FAILURE | (text only) | 4 |
| SH-303 | layout | 2/2 |  | `build/screenshots/evidence/po-e1/SH-303.png` | 2 |
| PAN-23 | layout | 4/4 | PASS: machine: noOverlap:.cv-bubble,.wc14-pop (no overlap (3 moments)); noOverlap:.cv-bubble,.wc14-pop (no overlap (3 moments) | `build/screenshots/evidence/po-e1/PAN-23.png` | 4 |
| CK-93 | layout | 4/4 |  | `build/screenshots/evidence/po-e1/CK-93.png` | 4 |
| CK-115 | layout | 4/4 | FAIL: machine: CK-115-p1-L3-740x320: inside:#mission .oc-card in #side: 1 of 2 outside; CK-115-p1-L4-740x320: inside:#mission  | `build/screenshots/evidence/po-e1/CK-115.png` | 8 |
| CHAI-114 | layout | 1/1 | PASS: machine: noClip:#guide .ng-say (1 clean (10 moments)) | `build/screenshots/evidence/po-e1/CHAI-114.png` | 1 |

## Tool failures (1): for the tool owner, never a FAIL in regressions.md

- SH-300: SH-300-p1-L1-740x320: dom:#guide .ng-say at life:popup-open (hit 1): no text on screen in "#guide .ng-say" at life:popup-open · SH-300-p2-L1-740x320: dom:#guide .ng-say at life:popup-open (hit 1): no text on screen in "#guide .ng-say" at life:popup-open
