# check-change (tier 2) on 3ba4e7a1fc

**FAILED**, 2026-11-14T22:18:06.304Z; base 2585c9bfad; 21.3 min.

Games: cook:maani-line (the brief's flows).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2 min; build/reports/tiers/push-3ba4e7a1fc.md |
| ok   | scope | the builder's files inside its owns (brief.mjs --audit) | yes | scope: all 1 files are "s20-b1-maani: maani joins the kitchen frame"'s own |
| note | play | the robot plays cook:maani-line (6 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 16 breaks (contract-119 12, contract-112 2, contract-36 2); CHECK FAILED: 29 new findings, 0 flows do not reach their end, 0 new page errors, 1 |
| note | before | the same flows on the base commit 2585c9bfad (its own tree and sandbox) | reports | CONTRACT FAILED: 16 breaks (contract-119 12, contract-112 2, contract-36 2); CHECK FAILED: 29 new findings, 0 flows do not reach their end, 0 new page errors, 1 |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 280 before/after pictures, 44 not paired; build/screenshots/tiers/change-3ba4e7a1fc/before-after/index.html |
| ok   | rows | the brief's rows, after (evidence.mjs --after --brief; the before was played at launch) | yes | Next (the orchestrator): node build/tools/review/evidence.mjs --judge --brief build/tools/ops/specs/s20-b1-maani.json |
| note | rows-judge | the judge's before|after batch for Fable (evidence.mjs --judge --brief) | reports | No before run for brief s20-b1-maani: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-b1-maani.json first. |
| ok   | film:maani-line | a first-play film: cook:maani-line as a new player at 740x320, for the orchestrator to look at | reports | 22:39:24 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-3ba4e7a1fc-maani-line/summary.md |

## Blocking (1, by game)

**cook:maani-line** (1)
- contract-112 at cook:maani-line#mistake@930x430 (kind-roll): light 2 [356,56,548,252]: lit while mv-raw-maani came into it after the light came: nothing moves into a light (picture: build/screenshots/sandbox/tiers-change-3ba4e7a1fc/lights/cook-maani-line-mistak


## Reported, not blocking (18, by game)

**cook:maani-line** (15)
- contract-119 at cook:maani-line@740x320 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card flashed only 104 ms beside their bubble (the base has it too)
- contract-119 at cook:maani-line@930x430 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-112 at cook:maani-line@930x430 (kind-roll): light 2 [356,56,548,252]: lit while mv-raw-bajr came into it after the light came: nothing moves into a light (picture: build/screenshots/sandbox/tiers-change-3ba4e7a1fc/lights/cook-maani-line@930x430 (the base has it too)
- contract-119 at cook:maani-line#mistake@740x320 (after start): the customer said the dish ("Muke ba maani khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:maani-line#mistake@930x430 (after start): the customer said the dish ("Muke ba maani khapanti.") at level 1 and its card flashed only 101 ms beside their bubble (the base has it too)
- contract-36 at cook:maani-line#hint@740x320 (hint-nani-says): a step opened on screen (the light on njg-tray@1504x260@50@art) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged) (the base has it too)
- contract-119 at cook:maani-line#hint@740x320 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-36 at cook:maani-line#hint@930x430 (hint-nani-says): a step opened on screen (the light on njg-tray@1504x260@50@art) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged) (the base has it too)
- contract-119 at cook:maani-line#hint@930x430 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:maani-line#returning@740x320 (after start): the customer said the dish ("Muke ba maani khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:maani-line#returning@930x430 (after start): the customer said the dish ("Muke ba maani khapanti.") at level 1 and its card flashed only 119 ms beside their bubble (the base has it too)
- contract-119 at cook:maani-line#takeback@740x320 (after start): the customer said the dish ("Muke ba bajr ji maani khapanti.") at level 1 and its card flashed only 86 ms beside their bubble (the base has it too)
- contract-119 at cook:maani-line#takeback@930x430 (after start): the customer said the dish ("Muke ba bajr ji maani khapanti.") at level 1 and its card flashed only 102 ms beside their bubble (the base has it too)
- contract-119 at lab:cook/maani-line@740x320 (after maani-line-start): the customer said the dish ("Muke hakri maani khapeti,") at level 1 and its card flashed only 100 ms beside their bubble (the base has it too)
- contract-119 at lab:cook/maani-line@930x430 (after maani-line-start): the customer said the dish ("Muke hakri maani khapeti,") at level 1 and its card flashed only 103 ms beside their bubble (the base has it too)

**(every game)** (3)
- play at build/screenshots/tiers/change-3ba4e7a1fc/logs/play.log: CONTRACT FAILED: 16 breaks (contract-119 12, contract-112 2, contract-36 2); CHECK FAILED: 29 new findings, 0 flows do not reach their end, 0 new page errors, 16 contract breaks
- before at build/screenshots/tiers/change-3ba4e7a1fc/logs/before.log: CONTRACT FAILED: 16 breaks (contract-119 12, contract-112 2, contract-36 2); CHECK FAILED: 29 new findings, 0 flows do not reach their end, 0 new page errors, 16 contract breaks
- rows-judge at build/screenshots/tiers/change-3ba4e7a1fc/logs/rows-judge.log: No before run for brief s20-b1-maani: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-b1-maani.json first.


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-3ba4e7a1fc
- before | after: build/screenshots/tiers/change-3ba4e7a1fc/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-3ba4e7a1fc-maani-line/films/cook-maani-line@740x320.webm
- logs: build/screenshots/tiers/change-3ba4e7a1fc/logs
