# check-change (tier 2) on d264ad5c21 + uncommitted changes

**FAILED**, 2026-11-15T07:05:49.300Z; base b86f02f7dc; 67 min.

Games: cook:corn (the brief's flows).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.5 min; build/reports/tiers/push-d264ad5c21.md |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | js/art-map.js |
| note | play | the robot plays cook:corn (9 flows: L1,L2,L3,L4, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 22 breaks (contract-129 7, contract-119 8, contract-37 2, contract-78 3, contract-83 1, contract-109 1); CHECK FAILED: 184 new findings, 0 flow |
| note | before | the same flows on the base commit b86f02f7dc (its own tree and sandbox) | reports | CONTRACT FAILED: 29 breaks (contract-129 7, contract-119 8, contract-83 3, contract-37 2, contract-114 6, contract-78 3); CHECK FAILED: 184 new findings, 0 flow |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 472 before/after pictures, 14 not paired; build/screenshots/tiers/change-d264ad5c21/before-after/index.html |
| FAIL | rows | the brief's rows, after (evidence.mjs --after --brief; the before was played at launch) | yes | CK-119: no evidence spec |
| note | rows-judge | the judge's before|after batch for Fable (evidence.mjs --judge --brief) | reports | No before run for brief s20-corn-upright: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-corn-upright.json first. |
| ok   | film:corn | a first-play film: cook:corn as a new player at 740x320, for the orchestrator to look at | reports | 07:34:53 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-d264ad5c21-corn/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | lab:cook/chai-tray@L4#child@740x320: a state: never seen before: - -> chai-tray-view-null |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL listeners on the page as before: window/pointerdown/true: 2 -> 3; window/resize/false: 2 -> 3; document/pointerdown/true: 0 -> 1; document/pointerup/true:  |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| ok   | loadtime | time and bytes to the first tap (loadtime.mjs; 20% growth fails) | yes | corn@L3@930x430@4000/60: 21942 ms, 7004 KB, 245 requests: no baseline yet (--record writes one) |
| FAIL | vessel-meta | vessels centred on their burners (build/check_vessel_meta.py) | yes | FileNotFoundError: [Errno 2] No such file or directory: '/home/user/nani-jo-ghar/assets/cook/items/v3/chaat/pot-chana.webp' |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 551 distinct rows to recheck; add --shared for the Shared components rows. |

## Blocking (7, by game)

**cook:corn** (2)
- contract-78 at cook:corn@L3@740x320 (help-open): the call "Makai hane kadh." starts and the light comes 1966 ms later (more than 200 ms)
- contract-109 at cook:corn#hint@740x320 (hint-nani-says): the shelf item ph-amli stands -10 px off chai's base line (296 px at 740x320): one line for every shelf

**(every game)** (5)
- scope at build/screenshots/tiers/change-d264ad5c21/logs/scope.log: js/art-map.js
- rows at build/screenshots/tiers/change-d264ad5c21/logs/rows.log: CK-119: no evidence spec
- frozen at build/screenshots/tiers/change-d264ad5c21/logs/frozen.log: lab:cook/chai-tray@L4#child@740x320: a state: never seen before: - -> chai-tray-view-null
- mount at build/screenshots/tiers/change-d264ad5c21/logs/mount.log: FAIL listeners on the page as before: window|pointerdown|true: 2 -> 3; window|resize|false: 2 -> 3; document|pointerdown|true: 0 -> 1; document|pointerup|true: 0 -> 1; document|keydown|true: 0 -> 1; document|wheel|true: 0 -> 1; document|touchstart|true: 0 -> 1; document|pointermove|true: 0 -> 1; window|pointermove|true: 0 -> 1; window|pointerup|true: 0 -> 1; window|pointercancel|true: 0 -> 1; FAIL no audio context left open (1); FAIL no Cook global, no iframe (Cook)
- vessel-meta at build/screenshots/tiers/change-d264ad5c21/logs/vessel-meta.log: FileNotFoundError: [Errno 2] No such file or directory: '/home/user/nani-jo-ghar/assets/cook/items/v3/chaat/pot-chana.webp'


## Reported, not blocking (23, by game)

**cook:corn** (20)
- contract-129 at cook:corn@740x320 (after start): the order's pop-up card (238,10,386,310) sits over a speech bubble (366,91,620,135): 837 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-119 at cook:corn@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-37 at cook:corn@L3@740x320 (view-service): cook:station1:marble (corn at L3): 2 decoys on the shelf (ph-lili*, ph-amli, spi-11*; * not in the order), the table wants at least 3 (the base has it too)
- contract-83 at cook:corn@L3@740x320 (after kind-click): a card (37,93,119,247) sits over nana: 47 px squared (the base has it too)
- contract-78 at cook:corn@L3@930x430 (help-open): the call "Makai hane kadh." starts and the light comes 1942 ms later (more than 200 ms) (the base has it too)
- contract-37 at cook:corn@L4@740x320 (view-service): cook:station1:marble (corn at L4): 1 decoy on the shelf (ph-lili*, ph-amli, spi-11; * not in the order), the table wants at least 4 (the base has it too)
- contract-78 at cook:corn@L4@740x320 (help-open): the call "Makai hane kadh." starts and the light comes 1768 ms later (more than 200 ms) (the base has it too)
- contract-129 at cook:corn#mistake@740x320 (after start): the order's pop-up card (239,10,388,309) sits over a speech bubble (366,91,620,135): 933 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#mistake@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 107 ms beside their bubble (the base has it too)
- contract-129 at cook:corn#mistake@930x430 (after start): the order's pop-up card (239,10,441,419) sits over a speech bubble (439,135,746,182): 80 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#mistake@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-129 at cook:corn#hint@740x320 (after start): the order's pop-up card (239,10,388,309) sits over a speech bubble (366,91,620,135): 933 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#hint@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-129 at cook:corn#hint@930x430 (order-card-big): the order's pop-up card (239,10,441,419) sits over a speech bubble (439,135,746,182): 80 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#hint@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 95 ms beside their bubble (the base has it too)
- contract-129 at cook:corn#takeback@740x320 (after start): the order's pop-up card (239,10,388,309) sits over a speech bubble (366,91,620,135): 933 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#takeback@740x320 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-129 at cook:corn#takeback@930x430 (order-card-big): the order's pop-up card (239,10,441,419) sits over a speech bubble (439,135,746,182): 80 px squared, the bubble's words hidden (the base has it too)
- contract-119 at cook:corn#takeback@930x430 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card flashed only 104 ms beside their bubble (the base has it too)

**(every game)** (3)
- play at build/screenshots/tiers/change-d264ad5c21/logs/play.log: CONTRACT FAILED: 22 breaks (contract-129 7, contract-119 8, contract-37 2, contract-78 3, contract-83 1, contract-109 1); CHECK FAILED: 184 new findings, 0 flows do not reach their end, 0 new page errors, 22 contract breaks
- before at build/screenshots/tiers/change-d264ad5c21/logs/before.log: CONTRACT FAILED: 29 breaks (contract-129 7, contract-119 8, contract-83 3, contract-37 2, contract-114 6, contract-78 3); CHECK FAILED: 184 new findings, 0 flows do not reach their end, 0 new page errors, 29 contract breaks
- rows-judge at build/screenshots/tiers/change-d264ad5c21/logs/rows-judge.log: No before run for brief s20-corn-upright: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s20-corn-upright.json first.


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-d264ad5c21
- before | after: build/screenshots/tiers/change-d264ad5c21/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-d264ad5c21-corn/films/cook-corn@740x320.webm
- logs: build/screenshots/tiers/change-d264ad5c21/logs
