# check-change (tier 2) on 74268de8f2

**FAILED**, 2026-11-14T22:24:24.846Z; base 12481b25e1; 9.2 min.

Games: cook:eggs (the brief's flows).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.2 min; build/reports/tiers/push-74268de8f2.md |
| ok   | scope | the builder's files inside its owns (brief.mjs --audit) | yes | scope: all 1 files are "s20-b1-eggs: eggs joins the kitchen frame"'s own |
| note | play | the robot plays cook:eggs (4 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 9 breaks (contract-119 8, contract-37 1); CHECK FAILED: 16 new findings, 0 flows do not reach their end, 0 new page errors, 9 contract breaks |
| note | before | the same flows on the base commit 12481b25e1 (its own tree and sandbox) | reports | CONTRACT FAILED: 8 breaks (contract-119 8); CHECK FAILED: 16 new findings, 0 flows do not reach their end, 0 new page errors, 8 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 172 before/after pictures, 17 not paired; build/screenshots/tiers/change-74268de8f2/before-after/index.html |
| FAIL | rows | the brief's rows, after (evidence.mjs --after --brief; the before was played at launch) | yes | SH-277: no evidence spec |
| note | rows-judge | the judge's before|after batch for Fable (evidence.mjs --judge --brief) | reports | No before run for brief s20-b1-eggs: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-b1-eggs.json first. |
| ok   | film:eggs | a first-play film: cook:eggs as a new player at 740x320, for the orchestrator to look at | reports | 22:33:38 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-74268de8f2-eggs/summary.md |

## Blocking (2, by game)

**cook:eggs** (1)
- contract-37 at cook:eggs#hint@740x320 (after order-card-big): cook:station1:marble (eggs at L1): 2 decoys on the shelf (n.egg*, cook-dudh*; * not in the order), the table wants 1

**(every game)** (1)
- rows at build/screenshots/tiers/change-74268de8f2/logs/rows.log: SH-277: no evidence spec


## Reported, not blocking (11, by game)

**cook:eggs** (8)
- contract-119 at cook:eggs@740x320 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card flashed only 100 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs@930x430 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card flashed only 89 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs#mistake@740x320 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card flashed only 94 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs#mistake@930x430 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:eggs#hint@740x320 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card flashed only 104 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs#hint@930x430 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:eggs#takeback@740x320 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card flashed only 112 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs#takeback@930x430 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card flashed only 99 ms beside their bubble (the base has it too)

**(every game)** (3)
- play at build/screenshots/tiers/change-74268de8f2/logs/play.log: CONTRACT FAILED: 9 breaks (contract-119 8, contract-37 1); CHECK FAILED: 16 new findings, 0 flows do not reach their end, 0 new page errors, 9 contract breaks
- before at build/screenshots/tiers/change-74268de8f2/logs/before.log: CONTRACT FAILED: 8 breaks (contract-119 8); CHECK FAILED: 16 new findings, 0 flows do not reach their end, 0 new page errors, 8 contract breaks
- rows-judge at build/screenshots/tiers/change-74268de8f2/logs/rows-judge.log: No before run for brief s20-b1-eggs: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-b1-eggs.json first.


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-74268de8f2
- before | after: build/screenshots/tiers/change-74268de8f2/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-74268de8f2-eggs/films/cook-eggs@740x320.webm
- logs: build/screenshots/tiers/change-74268de8f2/logs
