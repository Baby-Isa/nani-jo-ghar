# check-change (tier 2) on aa3c820bf6

**FAILED**, 2026-11-15T07:59:50.272Z; base a2716eca83; 194.8 min.

Games: cook:chai-tray, cook:eggs, cook:corn, cook:maani (the brief's flows).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: passed on aa3c820bf6 already (2026-11-15T07:52:08.490Z); nothing to run |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | docs/process/overnight-log.md |
| note | play | the robot plays cook:chai-tray, cook:eggs, cook:corn, cook:maani (38 flows: L1,L2,L3,L4, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 49 breaks (contract-79 1, contract-112 1, contract-119 18, contract-37 6, contract-70 7, contract-78 6, contract-114 6, contract-83 4); CHECK F |
| note | before | the same flows on the base commit a2716eca83 (its own tree and sandbox) | reports | CONTRACT FAILED: 50 breaks (contract-79 2, contract-72 1, contract-119 18, contract-37 8, contract-70 8, contract-78 7, contract-83 4, contract-114 2); CHECK FA |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 1954 before/after pictures, 156 not paired; build/screenshots/tiers/change-aa3c820bf6/before-after/index.html |
| FAIL | rows | the brief's rows, after (evidence.mjs --after --brief; the before was played at launch) | yes | SH-304: no evidence spec |
| note | rows-judge | the judge's before|after batch for Fable (evidence.mjs --judge --brief) | reports | No before run for brief s20-lift: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-lift.json first. |
| ok   | film:chai-tray | a first-play film: cook:chai-tray as a new player at 740x320, for the orchestrator to look at | reports | 10:35:02 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-aa3c820bf6-chai-tray/summary.md |
| ok   | film:eggs | a first-play film: cook:eggs as a new player at 740x320, for the orchestrator to look at | reports | 10:35:31 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-aa3c820bf6-eggs/summary.md |
| ok   | film:corn | a first-play film: cook:corn as a new player at 740x320, for the orchestrator to look at | reports | 10:36:06 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-aa3c820bf6-corn/summary.md |
| ok   | film:maani | a first-play film: cook:maani as a new player at 740x320, for the orchestrator to look at | reports | 10:36:51 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-aa3c820bf6-maani/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | lab:cook/chai-tray@L4#child@740x320: a sound: always there before, missing now: family/mum/dudh.mp3 -> - |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL listeners on the page as before: window/pointerdown/true: 2 -> 3; window/resize/false: 2 -> 3; document/pointerdown/true: 0 -> 1; document/pointerup/true:  |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 340 distinct rows to recheck; add --shared for the Shared components rows. |

## Blocking (13, by game)

**cook:chai-tray** (2)
- contract-79 at cook:chai-tray@L3#hint@930x430 (hint-glow): the order card's light starts while something moves (dom:ng-help/450,fade:jar-cook-paani,fade:jar-cook-dudh,fade:jar-cook-chai,fade:jar-cook-khun,fade:jar-spi-02)
- contract-112 at lab:cook/chai-tray@L4@740x320 (chai-tray-order-card-in-sidebar): light 1 [234,158,330,262]: aadu [239,161,325,310] (its picture, pill and face) is not inside the light with its pad: bottom -48 px (wants 0) (picture: build/screenshots/sandbox/tiers-change-aa3c820bf6

**cook:corn** (6)
- contract-114 at cook:corn@L3@740x320 (view-service): cn4-over rests at 107 px at [366,68,474,104], -33% of its 160 px at its last place [635,50,661,209] (cn4-over): an item keeps its size from step to step
- contract-114 at cook:corn@L3@740x320 (view-service): cn4-done rests at 107 px at [494,69,602,104], -33% of its 160 px at its last place [671,50,696,209] (cn4-done): an item keeps its size from step to step
- contract-114 at cook:corn@L4@740x320 (view-service): cn4-over rests at 107 px at [366,68,474,104], -33% of its 160 px at its last place [635,50,661,209] (cn4-over): an item keeps its size from step to step
- contract-114 at cook:corn@L4@740x320 (view-service): cn4-done rests at 107 px at [494,69,602,104], -33% of its 160 px at its last place [671,50,696,209] (cn4-done): an item keeps its size from step to step
- contract-83 at cook:corn@L4@930x430 (after kind-click): a card (38,96,128,264) sits over nana: 41 px squared
- contract-83 at cook:corn@L2#mistake@740x320 (after kind-click): a card (37,93,119,247) sits over nana: 46 px squared

**cook:eggs** (1)
- contract-37 at cook:eggs@L2@740x320 (after kind-click): cook:station1:marble (eggs at L2): 3 decoys on the shelf (n.egg*, cook-atto*, cook-dudh*; * not in the order), the table wants 2

**(every game)** (4)
- scope at build/screenshots/tiers/change-aa3c820bf6/logs/scope.log: docs/process/overnight-log.md
- rows at build/screenshots/tiers/change-aa3c820bf6/logs/rows.log: SH-304: no evidence spec
- frozen at build/screenshots/tiers/change-aa3c820bf6/logs/frozen.log: lab:cook/chai-tray@L4#child@740x320: a sound: always there before, missing now: family/mum/dudh.mp3 -> -
- mount at build/screenshots/tiers/change-aa3c820bf6/logs/mount.log: FAIL listeners on the page as before: window|pointerdown|true: 2 -> 3; window|resize|false: 2 -> 3; document|pointerdown|true: 0 -> 1; document|pointerup|true: 0 -> 1; document|keydown|true: 0 -> 1; document|wheel|true: 0 -> 1; document|touchstart|true: 0 -> 1; document|pointermove|true: 0 -> 1; window|pointermove|true: 0 -> 1; window|pointerup|true: 0 -> 1; window|pointercancel|true: 0 -> 1; FAIL no audio context left open (1); FAIL no Cook global, no iframe (Cook)


## Reported, not blocking (43, by game)

**cook:corn** (18)
- contract-119 at cook:corn@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 101 ms beside their bubble (the base has it too)
- contract-119 at cook:corn@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-37 at cook:corn@L3@740x320 (view-service): cook:station1:marble (corn at L3): 2 decoys on the shelf (ph-lili*, ph-amli, spi-11*; * not in the order), the table wants at least 3 (the base has it too)
- contract-78 at cook:corn@L3@740x320 (help-open): the call "Makai hane kadh." starts and the light comes 1802 ms later (more than 200 ms) (the base has it too)
- contract-78 at cook:corn@L3@930x430 (help-open): the call "Makai hane kadh." starts and the light comes 2034 ms later (more than 200 ms) (the base has it too)
- contract-37 at cook:corn@L4@740x320 (view-service): cook:station1:marble (corn at L4): 1 decoy on the shelf (ph-lili*, ph-amli, spi-11; * not in the order), the table wants at least 4 (the base has it too)
- contract-78 at cook:corn@L4@740x320 (help-open): the call "Makai hane kadh." starts and the light comes 2058 ms later (more than 200 ms) (the base has it too)
- contract-78 at cook:corn@L4@930x430 (help-open): the call "Makai hane kadh." starts and the light comes 1989 ms later (more than 200 ms) (the base has it too)
- contract-83 at cook:corn#mistake@740x320 (order-card-big): a card (37,93,122,264) sits over nana: 47 px squared (the base has it too)
- contract-119 at cook:corn#mistake@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn#mistake@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-83 at cook:corn#hint@740x320 (order-card-big): a card (37,93,122,264) sits over nana: 46 px squared (the base has it too)
- contract-119 at cook:corn#hint@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn#hint@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 114 ms beside their bubble (the base has it too)
- contract-114 at cook:corn@L3#hint@740x320 (view-service): cn4-over rests at 107 px at [366,68,474,104], -33% of its 160 px at its last place [635,50,661,209] (cn4-over): an item keeps its size from step to step (the base has it too)
- contract-114 at cook:corn@L3#hint@740x320 (view-service): cn4-done rests at 107 px at [494,69,602,104], -33% of its 160 px at its last place [671,50,696,209] (cn4-done): an item keeps its size from step to step (the base has it too)
- contract-119 at cook:corn#takeback@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 119 ms beside their bubble (the base has it too)
- contract-119 at cook:corn#takeback@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 106 ms beside their bubble (the base has it too)

**cook:eggs** (20)
- contract-119 at cook:eggs@740x320 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card flashed only 104 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs@930x430 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-70 at cook:eggs@L3@740x320 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3) (the base has it too)
- contract-78 at cook:eggs@L3@740x320 (view-service): the call "Mitho wiji chad!" starts and the light comes 4981 ms later (more than 200 ms) (the base has it too)
- contract-70 at cook:eggs@L3@930x430 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3) (the base has it too)
- contract-78 at cook:eggs@L3@930x430 (help-open): the call "Indo khan!" starts and the light comes 1428 ms later (more than 200 ms) (the base has it too)
- contract-37 at cook:eggs@L4@740x320 (view-marble): cook:station1:marble (eggs at L4): 3 decoys on the shelf (spi-16, spi-11, cook-khun*, cook-chai*, cook-dudh*; * not in the order), the table wants 4 (the base has it too)
- contract-70 at cook:eggs@L4@740x320 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3) (the base has it too)
- contract-37 at cook:eggs@L4@930x430 (view-marble): cook:station1:marble (eggs at L4): 3 decoys on the shelf (spi-16, spi-11, cook-khun*, cook-chai*, cook-dudh*; * not in the order), the table wants 4 (the base has it too)
- contract-70 at cook:eggs@L4@930x430 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3) (the base has it too)
- contract-119 at cook:eggs#mistake@740x320 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:eggs#mistake@930x430 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card flashed only 125 ms beside their bubble (the base has it too)
- contract-70 at cook:eggs@L2#mistake@740x320 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3) (the base has it too)
- contract-119 at cook:eggs#hint@740x320 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card flashed only 93 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs#hint@930x430 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-37 at cook:eggs@L3#hint@740x320 (after kind-click): cook:station1:marble (eggs at L3): 5 decoys on the shelf (n.egg*, spi-16*, spi-11*, cook-dudh*, cook-atto*; * not in the order), the table wants 3 (the base has it too)
- contract-70 at cook:eggs@L3#hint@740x320 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3) (the base has it too)
- contract-70 at cook:eggs@L3#hint@930x430 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3) (the base has it too)
- contract-119 at cook:eggs#takeback@740x320 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card flashed only 111 ms beside their bubble (the base has it too)
- contract-119 at cook:eggs#takeback@930x430 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card flashed only 103 ms beside their bubble (the base has it too)

**cook:maani** (2)
- contract-119 at cook:maani@740x320 (after start): the customer said the dish ("Muke ba maani khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:maani@930x430 (after start): the customer said the dish ("Muke ba maani khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)

**(every game)** (3)
- play at build/screenshots/tiers/change-aa3c820bf6/logs/play.log: CONTRACT FAILED: 49 breaks (contract-79 1, contract-112 1, contract-119 18, contract-37 6, contract-70 7, contract-78 6, contract-114 6, contract-83 4); CHECK FAILED: 592 new findings, 0 flows do not reach their end, 0 new page errors, 49 contract breaks
- before at build/screenshots/tiers/change-aa3c820bf6/logs/before.log: CONTRACT FAILED: 50 breaks (contract-79 2, contract-72 1, contract-119 18, contract-37 8, contract-70 8, contract-78 7, contract-83 4, contract-114 2); CHECK FAILED: 589 new findings, 0 flows do not reach their end, 0 new page errors, 50 contract breaks
- rows-judge at build/screenshots/tiers/change-aa3c820bf6/logs/rows-judge.log: No before run for brief s20-lift: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-lift.json first.


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-aa3c820bf6
- before | after: build/screenshots/tiers/change-aa3c820bf6/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-aa3c820bf6-chai-tray/films/cook-chai-tray@740x320.webm, build/screenshots/sandbox/tiers-film-aa3c820bf6-eggs/films/cook-eggs@740x320.webm, build/screenshots/sandbox/tiers-film-aa3c820bf6-corn/films/cook-corn@740x320.webm, build/screenshots/sandbox/tiers-film-aa3c820bf6-maani/films/cook-maani@740x320.webm
- logs: build/screenshots/tiers/change-aa3c820bf6/logs
