# check-change (tier 2) on 549197e0be + uncommitted changes

**FAILED**, 2026-11-14T22:40:02.879Z; base 7be142e69f; 13.9 min.

Games: cook:corn (the brief's flows).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.3 min; build/reports/tiers/push-549197e0be.md |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | docs/process/overnight-log.md |
| note | play | the robot plays cook:corn (4 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 9 breaks (contract-119 8, contract-83 1); CHECK FAILED: 19 new findings, 0 flows do not reach their end, 0 new page errors, 9 contract breaks |
| note | before | the same flows on the base commit 7be142e69f (its own tree and sandbox) | reports | CONTRACT FAILED: 9 breaks (contract-83 1, contract-119 8); CHECK FAILED: 19 new findings, 0 flows do not reach their end, 0 new page errors, 9 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 169 before/after pictures, 43 not paired; build/screenshots/tiers/change-549197e0be/before-after/index.html |
| ok   | rows | the brief's rows, after (evidence.mjs --after --brief; the before was played at launch) | yes | Next (the orchestrator): node build/tools/review/evidence.mjs --judge --brief build/tools/ops/specs/s20-b1-corn.json |
| note | rows-judge | the judge's before|after batch for Fable (evidence.mjs --judge --brief) | reports | No before run for brief s20-b1-corn: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-b1-corn.json first. |
| ok   | film:corn | a first-play film: cook:corn as a new player at 740x320, for the orchestrator to look at | reports | 22:53:54 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-549197e0be-corn/summary.md |

## Blocking (2, by game)

**cook:corn** (1)
- contract-83 at cook:corn#mistake@740x320 (order-card-big): a card (37,97,122,267) sits over nana: 36 px squared

**(every game)** (1)
- scope at build/screenshots/tiers/change-549197e0be/logs/scope.log: docs/process/overnight-log.md


## Reported, not blocking (11, by game)

**cook:corn** (8)
- contract-119 at cook:corn@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn#mistake@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn#mistake@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 96 ms beside their bubble (the base has it too)
- contract-119 at cook:corn#hint@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn#hint@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn#takeback@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn#takeback@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 126 ms beside their bubble (the base has it too)

**(every game)** (3)
- play at build/screenshots/tiers/change-549197e0be/logs/play.log: CONTRACT FAILED: 9 breaks (contract-119 8, contract-83 1); CHECK FAILED: 19 new findings, 0 flows do not reach their end, 0 new page errors, 9 contract breaks
- before at build/screenshots/tiers/change-549197e0be/logs/before.log: CONTRACT FAILED: 9 breaks (contract-83 1, contract-119 8); CHECK FAILED: 19 new findings, 0 flows do not reach their end, 0 new page errors, 9 contract breaks
- rows-judge at build/screenshots/tiers/change-549197e0be/logs/rows-judge.log: No before run for brief s20-b1-corn: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-b1-corn.json first.


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-549197e0be
- before | after: build/screenshots/tiers/change-549197e0be/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-549197e0be-corn/films/cook-corn@740x320.webm
- logs: build/screenshots/tiers/change-549197e0be/logs
