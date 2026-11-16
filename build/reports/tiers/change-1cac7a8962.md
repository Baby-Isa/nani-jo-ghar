# check-change (tier 2) on 1cac7a8962 + uncommitted changes

**FAILED**, 2026-11-16T06:15:25.241Z; base 4800353218; 100 min.

Games: cook:baking (--games).
Rows: CK-100.

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 3.5 min; build/reports/tiers/push-1cac7a8962.md |
| note | play | the robot plays cook:baking (9 flows: L1,L2,L3,L4, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 4 breaks (contract-53 2, contract-119 2); CHECK FAILED: 120 new findings, 0 flows do not reach their end, 0 new page errors, 4 contract breaks |
| note | before | the same flows on the base commit 4800353218 (its own tree and sandbox) | reports | CONTRACT FAILED: 11 breaks (contract-113 4, contract-111 1, contract-53 2, contract-78 2, contract-119 2); CHECK FAILED: 120 new findings, 0 flows do not reach  |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 374 before/after pictures, 81 not paired; build/screenshots/tiers/change-1cac7a8962/before-after/index.html |
| ok   | rows-red | the rows' probes on the base commit (red): CK-100 | reports | 0 rows: 0 for a reviewer, 0 machine-decided, 0 tool failures, 0 Zafar's, 0 need a decision. Index: build/reports/evidence-tiers-red-4800353218-1cac7a8962.md |
| ok   | rows-green | the rows' probes on this commit (green): CK-100 | yes | 1 rows: 1 for a reviewer, 0 machine-decided, 0 tool failures, 0 Zafar's, 0 need a decision. Index: build/reports/evidence-tiers-green-1cac7a8962.md |
| ok   | rows-judge | the judge's batch for Fable (evidence.mjs --judge) | reports | One reviewer call per batch file (Fable; Opus when Fable is at its limit; never the builder). Then: node build/tools/review/evidence.mjs --collect --run-id tier |
| ok   | film:baking | a first-play film: cook:baking as a new player at 740x320, for the orchestrator to look at | reports | 07:10:20 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-1cac7a8962-baking/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | re-playing 24 page(s) that changed, to confirm ... |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL no audio context left open (2) |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 610 distinct rows to recheck; add --shared for the Shared components rows. |

## Blocking (2, by game)

**(every game)** (2)
- frozen at build/screenshots/tiers/change-1cac7a8962/logs/frozen.log: re-playing 24 page(s) that changed, to confirm ...
- mount at build/screenshots/tiers/change-1cac7a8962/logs/mount.log: FAIL no audio context left open (2)


## Reported, not blocking (6, by game)

**cook:baking** (4)
- contract-53 at cook:baking#hint@740x320 (hint-nani-says): the help's light is 4.0 times the size of cook-atto: it should hug it (the base has it too)
- contract-119 at cook:baking#hint@740x320 (hint-nani-says): the customer said the dish ("Muke naan khape.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:baking#hint@930x430 (view-marble): the customer said the dish ("Muke naan khape.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-53 at cook:baking@L3#hint@740x320 (hint-glow): the help's light is 3.8 times the size of cook-atto: it should hug it (the base has it too)

**(every game)** (2)
- play at build/screenshots/tiers/change-1cac7a8962/logs/play.log: CONTRACT FAILED: 4 breaks (contract-53 2, contract-119 2); CHECK FAILED: 120 new findings, 0 flows do not reach their end, 0 new page errors, 4 contract breaks
- before at build/screenshots/tiers/change-1cac7a8962/logs/before.log: CONTRACT FAILED: 11 breaks (contract-113 4, contract-111 1, contract-53 2, contract-78 2, contract-119 2); CHECK FAILED: 120 new findings, 0 flows do not reach their end, 0 new page errors, 11 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-1cac7a8962
- before | after: build/screenshots/tiers/change-1cac7a8962/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-1cac7a8962-baking/films/cook-baking@740x320.webm
- the judge's batch: build/screenshots/evidence/tiers-green-1cac7a8962/judge/
- logs: build/screenshots/tiers/change-1cac7a8962/logs
