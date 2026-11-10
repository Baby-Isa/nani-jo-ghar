# check-change (tier 2) on d5590e2ddd

**FAILED**, 2026-11-10T05:57:21.063Z; base 1e85a893d6; 76.3 min.

Games: cook:chop, cook:corn (the brief's flows).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 1.1 min; build/reports/tiers/push-d5590e2ddd.md |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | sources/art/s19-redo/refs/S4.jpg |
| note | play | the robot plays cook:chop, cook:corn (22 flows: L1,L2,L3,L4, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 28 breaks (contract-105 26, contract-83 1, contract-99 1); CHECK FAILED: 96 new findings, 0 flows do not reach their end, 0 new page errors, 28 |
| note | before | the same flows on the base commit 1e85a893d6 (its own tree and sandbox) | reports | CONTRACT FAILED: 36 breaks (contract-105 32, contract-53 4); CHECK FAILED: 98 new findings, 0 flows do not reach their end, 0 new page errors, 36 contract break |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 818 before/after pictures, 255 not paired; build/screenshots/tiers/change-d5590e2ddd/before-after/index.html |
| FAIL | rows | the brief's rows, after (evidence.mjs --after --brief; the before was played at launch) | yes | CK-67: spec error: CK-67 probe 1: at "life:corn-screen": no driver of cook:corn reaches it (add it to the driver and lib/moments.mjs first) |
| note | rows-judge | the judge's before|after batch for Fable (evidence.mjs --judge --brief) | reports | No before run for brief s19-wave-b: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s19-wave-b.json first. |
| ok   | film:chop | a first-play film: cook:chop#speed1 as a new player at 740x320, for the orchestrator to look at | reports | 06:37:43 summary: /home/user/wt/s19-wave-b/build/screenshots/sandbox/tiers-film-d5590e2ddd-chop/summary.md |
| ok   | film:corn | a first-play film: cook:corn as a new player at 740x320, for the orchestrator to look at | reports | 06:38:11 summary: /home/user/wt/s19-wave-b/build/screenshots/sandbox/tiers-film-d5590e2ddd-corn/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | re-playing 30 page(s) that changed, to confirm ... |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | Node.js v22.23.4 |
| FAIL | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | Node.js v22.23.4 |
| FAIL | loadtime | time and bytes to the first tap (loadtime.mjs; 20% growth fails) | yes | Node.js v22.23.4 |
| ok   | vessel-meta | vessels centred on their burners (build/check_vessel_meta.py) | yes | ok   chai-v2/meta.json panTop: recorded (0.3434, 0.6408), rim (0.3434, 0.6408), off 0.0000 (fit 0.9px) |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 736 distinct rows to recheck. |

## Blocking (8, by game)

**cook:corn** (2)
- contract-83 at cook:corn@L2@740x320 (after order-card-big): a card (13,111,91,242) sits over circle: 64 px squared
- contract-99 at cook:corn@L3#hint@740x320 (view-service): after nana's card folded, ma's card is 58 px down, cut at the foot (58 px over) 820 ms on, with the panel at 3 (its planned place: 57 of 76)

**(every game)** (6)
- scope at build/screenshots/tiers/change-d5590e2ddd/logs/scope.log: sources/art/s19-redo/refs/S4.jpg
- rows at build/screenshots/tiers/change-d5590e2ddd/logs/rows.log: CK-67: spec error: CK-67 probe 1: at "life:corn-screen": no driver of cook:corn reaches it (add it to the driver and lib/moments.mjs first)
- frozen at build/screenshots/tiers/change-d5590e2ddd/logs/frozen.log: re-playing 30 page(s) that changed, to confirm ...
- mount at build/screenshots/tiers/change-d5590e2ddd/logs/mount.log: Node.js v22.23.4
- leak-cook at build/screenshots/tiers/change-d5590e2ddd/logs/leak-cook.log: Node.js v22.23.4
- loadtime at build/screenshots/tiers/change-d5590e2ddd/logs/loadtime.log: Node.js v22.23.4


## Reported, not blocking (29, by game)

**cook:chop** (16)
- contract-105 at cook:chop@L3@740x320 (order-card-in-sidebar): the light [6,111,90,253] is not whole round card:hakro tameto [10,104,87,249] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L3@930x430 (order-card-in-sidebar): the light [8,112,91,254] is not whole round card:hakro tameto [12,107,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L2@740x320 (order-card-in-sidebar): the light [6,111,90,255] is not whole round card:hakro tameto [10,104,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L2@930x430 (order-card-in-sidebar): the light [8,112,91,256] is not whole round card:hakro tameto [12,107,87,253] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L4@740x320 (order-card-in-sidebar): the light [6,111,90,255] is not whole round card:trae mirchi [10,104,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L4@930x430 (order-card-in-sidebar): the light [8,112,91,256] is not whole round card:trae mirchi [12,107,87,253] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L2#mistake@740x320 (order-card-in-sidebar): the light [6,111,90,255] is not whole round card:hakro tameto [10,104,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L2#mistake@930x430 (order-card-in-sidebar): the light [8,112,91,256] is not whole round card:hakro tameto [12,107,87,253] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L3#hint@740x320 (view-marble): the light [6,111,90,253] is not whole round card:ba lasan [10,104,87,249] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:chop@L3#hint@930x430 (order-card-in-sidebar): the light [8,112,91,254] is not whole round card:ba lasan [12,107,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at lab:cook/chop@L2@740x320 (chop-view-marble): the light [6,111,90,253] is not whole round card:trae mirchi [10,104,87,249] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at lab:cook/chop@L2@930x430 (chop-view-marble): the light [8,112,91,254] is not whole round card:trae mirchi [12,107,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at lab:cook/chop@L3@740x320 (chop-order-card-in-sidebar): the light [6,111,90,252] is not whole round card:trae dungri [10,104,87,248] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at lab:cook/chop@L3@930x430 (chop-order-card-in-sidebar): the light [8,112,91,253] is not whole round card:trae dungri [12,107,87,250] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at lab:cook/chop@L4@740x320 (chop-view-marble): the light [6,111,90,255] is not whole round card:hakro tameto [10,104,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at lab:cook/chop@L4@930x430 (chop-view-marble): the light [8,112,91,256] is not whole round card:hakro tameto [12,107,87,253] (its picture and pill): it pokes out at the top (the base has it too)

**cook:corn** (10)
- contract-105 at cook:corn@L2@740x320 (order-card-in-sidebar): the light [6,113,90,242] is not whole round card:limu [10,109,87,238] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L2@930x430 (order-card-in-sidebar): the light [8,116,91,246] is not whole round card:limu [12,114,87,242] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L3@740x320 (order-card-in-sidebar): the light [6,113,90,257] is not whole round card:laal marcha [10,109,87,253] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L3@930x430 (order-card-in-sidebar): the light [8,116,91,262] is not whole round card:laal marcha [12,114,87,258] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L4@740x320 (order-card-in-sidebar): the light [6,113,90,257] is not whole round card:laal marcha [10,109,87,253] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L4@930x430 (order-card-in-sidebar): the light [8,116,91,262] is not whole round card:laal marcha [12,114,87,258] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L2#mistake@740x320 (order-card-in-sidebar): the light [6,113,90,255] is not whole round card:limu [10,109,87,251] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L2#mistake@930x430 (order-card-in-sidebar): the light [8,116,91,260] is not whole round card:limu [12,114,87,256] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L3#hint@740x320 (view-marble): the light [6,113,90,257] is not whole round card:laal marcha [10,109,87,253] (its picture and pill): it pokes out at the top (the base has it too)
- contract-105 at cook:corn@L3#hint@930x430 (order-card-in-sidebar): the light [8,116,91,262] is not whole round card:laal marcha [12,114,87,258] (its picture and pill): it pokes out at the top (the base has it too)

**(every game)** (3)
- play at build/screenshots/tiers/change-d5590e2ddd/logs/play.log: CONTRACT FAILED: 28 breaks (contract-105 26, contract-83 1, contract-99 1); CHECK FAILED: 96 new findings, 0 flows do not reach their end, 0 new page errors, 28 contract breaks
- before at build/screenshots/tiers/change-d5590e2ddd/logs/before.log: CONTRACT FAILED: 36 breaks (contract-105 32, contract-53 4); CHECK FAILED: 98 new findings, 0 flows do not reach their end, 0 new page errors, 36 contract breaks
- rows-judge at build/screenshots/tiers/change-d5590e2ddd/logs/rows-judge.log: No before run for brief s19-wave-b: node build/tools/review/evidence.mjs --before --brief build/tools/ops/specs/s19-wave-b.json first.


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-d5590e2ddd
- before | after: build/screenshots/tiers/change-d5590e2ddd/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-d5590e2ddd-chop/films/cook-chop-speed1@740x320.webm, build/screenshots/sandbox/tiers-film-d5590e2ddd-corn/films/cook-corn@740x320.webm
- logs: build/screenshots/tiers/change-d5590e2ddd/logs
