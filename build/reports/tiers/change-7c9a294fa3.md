# check-change (tier 2) on 7c9a294fa3

**PASSED**, 2026-11-15T06:49:17.989Z; base dfd56dec3b; 14.6 min.

Games: cook:baking (the brief's flows).
- the brief names no fix-list row: no probes to play

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.4 min; build/reports/tiers/push-7c9a294fa3.md |
| ok   | scope | the builder's files inside its owns (brief.mjs --audit) | yes | scope: all 1 files are "s20-b2-baking: baking joins the kitchen frame"'s own |
| note | play | the robot plays cook:baking (4 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 3 breaks (contract-53 1, contract-119 2); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 3 contract breaks |
| note | before | the same flows on the base commit dfd56dec3b (its own tree and sandbox) | reports | CONTRACT FAILED: 3 breaks (contract-53 1, contract-119 2); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 3 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 198 before/after pictures, 6 not paired; build/screenshots/tiers/change-7c9a294fa3/before-after/index.html |
| ok   | film:baking | a first-play film: cook:baking as a new player at 740x320, for the orchestrator to look at | reports | 07:03:51 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-7c9a294fa3-baking/summary.md |

## Blocking

Nothing to fix.


## Reported, not blocking (5, by game)

**cook:baking** (3)
- contract-53 at cook:baking#hint@740x320 (hint-nani-says): the help's light is 4.0 times the size of cook-atto: it should hug it (the base has it too)
- contract-119 at cook:baking#hint@740x320 (view-marble): the customer said the dish ("Muke naan khape.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:baking#hint@930x430 (hint-nani-says): the customer said the dish ("Muke naan khape.") at level 1 and its card never flashed up beside their bubble (the base has it too)

**(every game)** (2)
- play at build/screenshots/tiers/change-7c9a294fa3/logs/play.log: CONTRACT FAILED: 3 breaks (contract-53 1, contract-119 2); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 3 contract breaks
- before at build/screenshots/tiers/change-7c9a294fa3/logs/before.log: CONTRACT FAILED: 3 breaks (contract-53 1, contract-119 2); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 3 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-7c9a294fa3
- before | after: build/screenshots/tiers/change-7c9a294fa3/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-7c9a294fa3-baking/films/cook-baking@740x320.webm
- logs: build/screenshots/tiers/change-7c9a294fa3/logs
