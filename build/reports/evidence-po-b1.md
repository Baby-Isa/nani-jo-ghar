# Evidence run po-b1

Commit f84c8246. 16 rows: 10 for a reviewer, 4 decided by the machine, 2 TOOL FAILURES (never evidence; fix the driver or the spec), 0 with no spec. 29 pages. Sheets and text: `build/screenshots/evidence/po-b1/<ROW>.png|.md`.

Next: `node build/tools/review/evidence.mjs --judge --run-id po-b1`, the reviewer fills the batch files, then `--collect` and `--apply`.

| row | kind | probes reached | machine | sheet | panels |
|---|---|---|---|---|---|
| SH-275 | layout | 0/4 | TOOL FAILURE | (text only) | 0 |
| SH-280 | motion | 1/1 |  | `build/screenshots/evidence/po-b1/SH-280.png` | 2 |
| SH-281 | layout | 2/2 |  | `build/screenshots/evidence/po-b1/SH-281.png` | 2 |
| SH-283 | layout | 4/4 |  | `build/screenshots/evidence/po-b1/SH-283.png` | 4 |
| SH-284 | layout | 4/4 |  | `build/screenshots/evidence/po-b1/SH-284.png` | 8 |
| SH-286 | layout | 2/2 |  | `build/screenshots/evidence/po-b1/SH-286.png` | 2 |
| SH-287 | layout | 4/4 |  | `build/screenshots/evidence/po-b1/SH-287.png` | 4 |
| SH-295 | detail | 2/2 |  | `build/screenshots/evidence/po-b1/SH-295.png` | 2 |
| SH-299 | motion | 1/1 |  | `build/screenshots/evidence/po-b1/SH-299.png` | 1 |
| SH-301 | detail | 4/4 |  | `build/screenshots/evidence/po-b1/SH-301.png` | 4 |
| SH-302 | layout | 2/2 |  | `build/screenshots/evidence/po-b1/SH-302.png` | 2 |
| SH-303 | layout | 2/2 | FAIL: machine: SH-303-p1-L4-740x320: count:.cv-line>=1: 0 visible; SH-303-p2-L1-740x320: count:.cv-line>=1: 0 visible | `build/screenshots/evidence/po-b1/SH-303.png` | 2 |
| CHT-22 | layout | 1/1 | PASS: machine: noOverlap:.njg-onboard .ob-box,#side-cog (no overlap (2 moments)) | `build/screenshots/evidence/po-b1/CHT-22.png` | 1 |
| CK-97 | text | 4/4 | PASS: machine: contract-104 (0 breaks on this page); contract-104 (0 breaks on this page); contract-104 (0 breaks on this page | (text only) | 0 |
| LAB-08 | layout | 0/0 | TOOL FAILURE | (text only) | 0 |
| PRC-11 | text | 1/1 | FAIL: machine: PRC-11-p1-repo: pass: grep -niE 'progress table/% complete' .claude/skills/checkin/SKILL.md: exit 1 | (text only) | 0 |

## Tool failures (2): for the tool owner, never a FAIL in regressions.md

- SH-275: SH-275-p1-L1-1280x665: the moment "kind-timing" never came; moments seen: page:start, life:cover, life:order-level, life:decoys, life:poke, rec:start, life:ghost, life:request, life:popup-open, life:dish-flash, life:pop-face, life:order-pass, life:card-fold, cook:click, only:.njg-rq-card, talk:nana, line:cook, life:say-start, bubble, rec:order-card-big, life:say-end, life:stage-start, life:band, life:eggs-scene, life:step-open, life:step-call, life:eggs-next, life:rung, life:glow, life:popup-fold, rec:order-card-in-sidebar, cook-done:click, life:helper-open, life:helper-call, rec:view-marble, 
- LAB-08: spec: LAB-08 probe 1: cmd "node --test build/test_labs_importmap.mjs": a script under build/ · no evidence spec for this row (build/sandbox/data/evidence.json)
