# check-change (tier 2) on d264ad5c21 + uncommitted changes

**FAILED**, 2026-11-15T06:52:08.106Z; base 4b7fba3fd4; 13.3 min.

Games: cook:corn (the brief's flows).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.5 min; build/reports/tiers/push-d264ad5c21.md |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | build/reports/s20-corn-upright-sheet.py |
| note | play | the robot plays cook:corn (4 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 17 breaks (contract-129 7, contract-119 8, contract-109 1, contract-83 1); CHECK FAILED: 67 new findings, 0 flows do not reach their end, 0 new |
| note | before | the same flows on the base commit 4b7fba3fd4 (its own tree and sandbox) | reports | CONTRACT FAILED: 17 breaks (contract-129 7, contract-119 8, contract-83 1, contract-109 1); CHECK FAILED: 67 new findings, 0 flows do not reach their end, 0 new |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 205 before/after pictures, 11 not paired; build/screenshots/tiers/change-d264ad5c21/before-after/index.html |
| FAIL | rows | the brief's rows, after (evidence.mjs --after --brief; the before was played at launch) | yes | CK-119: no evidence spec |
| note | rows-judge | the judge's before|after batch for Fable (evidence.mjs --judge --brief) | reports | No before run for brief s20-corn-upright: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-corn-upright.json first. |
| ok   | film:corn | a first-play film: cook:corn as a new player at 740x320, for the orchestrator to look at | reports | 07:05:23 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-d264ad5c21-corn/summary.md |

## Blocking (3, by game)

**cook:corn** (1)
- contract-83 at cook:corn#takeback@740x320 (order-card-big): a card (37,94,122,264) sits over nana: 47 px squared

**(every game)** (2)
- scope at build/screenshots/tiers/change-d264ad5c21/logs/scope.log: build/reports/s20-corn-upright-sheet.py
- rows at build/screenshots/tiers/change-d264ad5c21/logs/rows.log: CK-119: no evidence spec


## Reported, not blocking (19, by game)

**cook:corn** (16)
- contract-129 at cook:corn@740x320 (after start): the order's pop-up card (238,10,386,310) sits over a speech bubble (366,91,620,135): 837 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 94 ms beside their bubble (the base has it too)
- contract-119 at cook:corn@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-129 at cook:corn#mistake@740x320 (after start): the order's pop-up card (239,10,388,309) sits over a speech bubble (366,91,620,135): 933 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#mistake@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-129 at cook:corn#mistake@930x430 (after start): the order's pop-up card (239,10,441,419) sits over a speech bubble (439,135,746,182): 80 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#mistake@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-129 at cook:corn#hint@740x320 (after start): the order's pop-up card (239,10,388,309) sits over a speech bubble (366,91,620,135): 933 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#hint@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-109 at cook:corn#hint@740x320 (hint-nani-says): the shelf item ph-amli stands -10 px off chai's base line (296 px at 740x320): one line for every shelf (the base has it too)
- contract-129 at cook:corn#hint@930x430 (order-card-big): the order's pop-up card (239,10,441,419) sits over a speech bubble (439,135,746,182): 80 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#hint@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 108 ms beside their bubble (the base has it too)
- contract-129 at cook:corn#takeback@740x320 (after start): the order's pop-up card (239,10,388,309) sits over a speech bubble (366,91,620,135): 933 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#takeback@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-129 at cook:corn#takeback@930x430 (after start): the order's pop-up card (239,10,441,419) sits over a speech bubble (439,135,746,182): 80 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#takeback@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 97 ms beside their bubble (the base has it too)

**(every game)** (3)
- play at build/screenshots/tiers/change-d264ad5c21/logs/play.log: CONTRACT FAILED: 17 breaks (contract-129 7, contract-119 8, contract-109 1, contract-83 1); CHECK FAILED: 67 new findings, 0 flows do not reach their end, 0 new page errors, 17 contract breaks
- before at build/screenshots/tiers/change-d264ad5c21/logs/before.log: CONTRACT FAILED: 17 breaks (contract-129 7, contract-119 8, contract-83 1, contract-109 1); CHECK FAILED: 67 new findings, 0 flows do not reach their end, 0 new page errors, 17 contract breaks
- rows-judge at build/screenshots/tiers/change-d264ad5c21/logs/rows-judge.log: No before run for brief s20-corn-upright: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-corn-upright.json first.


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-d264ad5c21
- before | after: build/screenshots/tiers/change-d264ad5c21/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-d264ad5c21-corn/films/cook-corn@740x320.webm
- logs: build/screenshots/tiers/change-d264ad5c21/logs
