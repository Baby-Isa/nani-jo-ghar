# check-change (tier 2) on 4800353218

**PASSED**, 2026-11-16T05:23:34.604Z; base 4800353218; 11.5 min.

Games: cook:chop (--games).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 4.6 min; build/reports/tiers/push-4800353218.md |
| note | play | the robot plays cook:chop (5 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 10 breaks (contract-119 10); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 10 contract breaks |
| note | before | the same flows on the base commit 4800353218 (its own tree and sandbox) | reports | CONTRACT FAILED: 10 breaks (contract-119 10); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 10 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 214 before/after pictures, 39 not paired; build/screenshots/tiers/change-4800353218/before-after/index.html |
| ok   | film:chop | a first-play film: cook:chop#speed1 as a new player at 740x320, for the orchestrator to look at | reports | 05:35:04 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-4800353218-chop/summary.md |

## Blocking

Nothing to fix.


## Reported, not blocking (12, by game)

**cook:chop** (10)
- contract-119 at cook:chop@740x320 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:chop@930x430 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card flashed only 112 ms beside their bubble (the base has it too)
- contract-119 at cook:chop#mistake@740x320 (start): the customer said the dish ("Muke ba lasan khape.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:chop#mistake@930x430 (start): the customer said the dish ("Muke ba lasan khape.") at level 1 and its card flashed only 115 ms beside their bubble (the base has it too)
- contract-119 at cook:chop#hint@740x320 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card flashed only 120 ms beside their bubble (the base has it too)
- contract-119 at cook:chop#hint@930x430 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:chop#takeback@740x320 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card flashed only 97 ms beside their bubble (the base has it too)
- contract-119 at cook:chop#takeback@930x430 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at lab:cook/chop@740x320 (start): the customer said the dish ("Muke ba mirchi khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at lab:cook/chop@930x430 (start): the customer said the dish ("Muke ba mirchi khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)

**(every game)** (2)
- play at build/screenshots/tiers/change-4800353218/logs/play.log: CONTRACT FAILED: 10 breaks (contract-119 10); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 10 contract breaks
- before at build/screenshots/tiers/change-4800353218/logs/before.log: CONTRACT FAILED: 10 breaks (contract-119 10); CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 10 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-4800353218
- before | after: build/screenshots/tiers/change-4800353218/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-4800353218-chop/films/cook-chop-speed1@740x320.webm
- logs: build/screenshots/tiers/change-4800353218/logs
