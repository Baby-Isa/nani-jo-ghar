# check-change (tier 2) on e4f292cc21

**FAILED**, 2026-11-15T17:41:10.150Z; base 0d93c68b53; 63 min.

Games: cook:chai-tray (a shared change).
Rows: SAM-38.
- the change reaches 74 games (a shared file): tier 2 plays cook:chai-tray and chai's frozen run; check-sprint plays every game

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: passed on e4f292cc21 already (2026-11-15T17:36:55.230Z); nothing to run |
| note | play | the robot plays cook:chai-tray (7 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT PASSED: 0 breaks over 14 pages; CHECK FAILED: 52 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks |
| note | before | the same flows on the base commit 0d93c68b53 (its own tree and sandbox) | reports | CONTRACT FAILED: 1 breaks (contract-72 1); CHECK FAILED: 54 new findings, 0 flows do not reach their end, 0 new page errors, 1 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 366 before/after pictures, 19 not paired; build/screenshots/tiers/change-e4f292cc21/before-after/index.html |
| ok   | rows-red | the rows' probes on the base commit (red): SAM-38 | reports | 0 rows: 0 for a reviewer, 0 machine-decided, 0 tool failures, 0 Zafar's, 0 need a decision. Index: build/reports/evidence-tiers-red-0d93c68b53-e4f292cc21.md |
| ok   | rows-green | the rows' probes on this commit (green): SAM-38 | yes | 1 rows: 1 for a reviewer, 0 machine-decided, 0 tool failures, 0 Zafar's, 0 need a decision. Index: build/reports/evidence-tiers-green-e4f292cc21.md |
| ok   | rows-judge | the judge's batch for Fable (evidence.mjs --judge) | reports | One reviewer call per batch file (Fable; Opus when Fable is at its limit; never the builder). Then: node build/tools/review/evidence.mjs --collect --run-id tier |
| ok   | film:chai-tray | a first-play film: cook:chai-tray as a new player at 740x320, for the orchestrator to look at | reports | 18:04:10 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-e4f292cc21-chai-tray/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | re-playing 19 page(s) that changed, to confirm ... |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL listeners on the page as before: window/pointerdown/true: 2 -> 3; window/resize/false: 2 -> 3; document/pointerdown/true: 0 -> 1; document/pointerup/true:  |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 865 distinct rows to recheck. |

## Blocking (2, by game)

**(every game)** (2)
- frozen at build/screenshots/tiers/change-e4f292cc21/logs/frozen.log: re-playing 19 page(s) that changed, to confirm ...
- mount at build/screenshots/tiers/change-e4f292cc21/logs/mount.log: FAIL listeners on the page as before: window|pointerdown|true: 2 -> 3; window|resize|false: 2 -> 3; document|pointerdown|true: 0 -> 1; document|pointerup|true: 0 -> 1; document|keydown|true: 0 -> 1; document|wheel|true: 0 -> 1; document|touchstart|true: 0 -> 1; document|pointermove|true: 0 -> 1; window|pointermove|true: 0 -> 1; window|pointerup|true: 0 -> 1; window|pointercancel|true: 0 -> 1; FAIL no audio context left open (1); FAIL no Cook global, no iframe (Cook)


## Reported, not blocking (2, by game)

**(every game)** (2)
- play at build/screenshots/tiers/change-e4f292cc21/logs/play.log: CONTRACT PASSED: 0 breaks over 14 pages; CHECK FAILED: 52 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks
- before at build/screenshots/tiers/change-e4f292cc21/logs/before.log: CONTRACT FAILED: 1 breaks (contract-72 1); CHECK FAILED: 54 new findings, 0 flows do not reach their end, 0 new page errors, 1 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-e4f292cc21
- before | after: build/screenshots/tiers/change-e4f292cc21/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-e4f292cc21-chai-tray/films/cook-chai-tray@740x320.webm
- the judge's batch: build/screenshots/evidence/tiers-green-e4f292cc21/judge/
- logs: build/screenshots/tiers/change-e4f292cc21/logs
