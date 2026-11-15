# check-change (tier 2) on 891f97eae6 + uncommitted changes

**FAILED**, 2026-11-15T06:40:42.592Z; base a4de366f62; 6.5 min.

Games: cook:roll-tawa (the brief's flows).
- the brief names no fix-list row: no probes to play

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 3.2 min; build/reports/tiers/push-891f97eae6.md |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | docs/process/regressions.md |
| note | play | the robot plays cook:roll-tawa (1 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 21 breaks (contract-119 2, contract-120 5, contract-113 6, contract-114 8); CHECK FAILED: 8 new findings, 0 flows do not reach their end, 0 new |
| note | before | the same flows on the base commit a4de366f62 (its own tree and sandbox) | reports | CONTRACT FAILED: 22 breaks (contract-119 2, contract-120 6, contract-113 6, contract-114 8); CHECK FAILED: 8 new findings, 0 flows do not reach their end, 0 new |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 42 before/after pictures, 11 not paired; build/screenshots/tiers/change-891f97eae6/before-after/index.html |
| ok   | film:roll-tawa | a first-play film: cook:roll-tawa as a new player at 740x320, for the orchestrator to look at | reports | 06:47:12 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-891f97eae6-roll-tawa/summary.md |

## Blocking (1, by game)

**(every game)** (1)
- scope at build/screenshots/tiers/change-891f97eae6/logs/scope.log: docs/process/regressions.md


## Reported, not blocking (23, by game)

**cook:roll-tawa** (21)
- contract-119 at cook:roll-tawa@740x320 (after start): the customer said the dish ("Muke char maani khapanti.") at level 1 and its card never flashed up beside their bubble (the base has it too)
- contract-120 at cook:roll-tawa@740x320 (help-open): dough-ball stands on the worktop (107x106 at 336,743, depth 30) with no soft shadow of its own (SH-268: one light, upper left) (the base has it too)
- contract-120 at cook:roll-tawa@740x320 (kind-click): chapati-burnt stands on the worktop (172x169 at 1059,719, depth 32) with no soft shadow of its own (SH-268: one light, upper left) (the base has it too)
- contract-120 at cook:roll-tawa@740x320 (kind-click): chapati-puffed stands on the worktop (177x174 at 1061,703, depth 32) with no soft shadow of its own (SH-268: one light, upper left) (the base has it too)
- contract-113 at cook:roll-tawa@740x320 (after kind-roll): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (44% of it, at [624,8,732,46]): nothing covers a face, a pill or a card's words (the base has it too)
- contract-113 at cook:roll-tawa@740x320 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (62% of it, at [655,8,732,46]): nothing covers a face, a pill or a card's words (the base has it too)
- contract-113 at cook:roll-tawa@740x320 (after kind-tap): the word pill trae is under the page's button#side-cog.rail-btn.side-cog (52% of it, at [640,8,732,46]): nothing covers a face, a pill or a card's words (the base has it too)
- contract-114 at cook:roll-tawa@740x320 (help-open): chapati-burnt rests at 52 px at [538,235,594,289], -28% of its 73 px at its last place [528,58,601,129] (chapati-burnt): an item keeps its size from step to step (the base has it too)
- contract-114 at cook:roll-tawa@740x320 (kind-click): chapati-puffed rests at 52 px at [538,229,595,285], -31% of its 75 px at its last place [527,56,602,129] (chapati-puffed): an item keeps its size from step to step (the base has it too)
- contract-114 at cook:roll-tawa@740x320 (kind-click): chapati-puffed rests at 52 px at [538,224,593,279], -31% of its 75 px at its last place [527,56,602,129] (chapati-puffed): an item keeps its size from step to step (the base has it too)
- contract-114 at cook:roll-tawa@740x320 (after kind-tap): chapati-puffed rests at 52 px at [535,219,591,274], -29% of its 73 px at its last place [528,57,601,128] (chapati-puffed): an item keeps its size from step to step (the base has it too)
- contract-119 at cook:roll-tawa@930x430 (after start): the customer said the dish ("Muke char maani khapanti.") at level 1 and its card flashed only 118 ms beside their bubble (the base has it too)
- contract-120 at cook:roll-tawa@930x430 (help-open): dough-ball stands on the worktop (107x106 at 336,743, depth 30) with no soft shadow of its own (SH-268: one light, upper left) (the base has it too)
- contract-120 at cook:roll-tawa@930x430 (help-open): chapati-puffed stands on the worktop (172x169 at 1059,719, depth 32) with no soft shadow of its own (SH-268: one light, upper left) (the base has it too)
- contract-113 at cook:roll-tawa@930x430 (after kind-roll): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (44% of it, at [814,8,922,46]): nothing covers a face, a pill or a card's words (the base has it too)
- contract-113 at cook:roll-tawa@930x430 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (62% of it, at [845,8,922,46]): nothing covers a face, a pill or a card's words (the base has it too)
- contract-113 at cook:roll-tawa@930x430 (after kind-tap): the word pill trae is under the page's button#side-cog.rail-btn.side-cog (52% of it, at [830,8,922,46]): nothing covers a face, a pill or a card's words (the base has it too)
- contract-114 at cook:roll-tawa@930x430 (help-open): chapati-puffed rests at 72 px at [654,313,730,388], -31% of its 103 px at its last place [638,72,741,173] (chapati-puffed): an item keeps its size from step to step (the base has it too)
- contract-114 at cook:roll-tawa@930x430 (kind-click): chapati-puffed rests at 72 px at [647,302,731,385], -30% of its 102 px at its last place [639,72,741,172] (chapati-puffed): an item keeps its size from step to step (the base has it too)
- contract-114 at cook:roll-tawa@930x430 (kind-click): chapati-puffed rests at 72 px at [650,299,725,374], -29% of its 100 px at its last place [640,73,740,171] (chapati-puffed): an item keeps its size from step to step (the base has it too)
- contract-114 at cook:roll-tawa@930x430 (after kind-tap): chapati-puffed rests at 72 px at [648,288,732,371], -29% of its 100 px at its last place [640,73,740,171] (chapati-puffed): an item keeps its size from step to step (the base has it too)

**(every game)** (2)
- play at build/screenshots/tiers/change-891f97eae6/logs/play.log: CONTRACT FAILED: 21 breaks (contract-119 2, contract-120 5, contract-113 6, contract-114 8); CHECK FAILED: 8 new findings, 0 flows do not reach their end, 0 new page errors, 21 contract breaks
- before at build/screenshots/tiers/change-891f97eae6/logs/before.log: CONTRACT FAILED: 22 breaks (contract-119 2, contract-120 6, contract-113 6, contract-114 8); CHECK FAILED: 8 new findings, 0 flows do not reach their end, 0 new page errors, 22 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-891f97eae6
- before | after: build/screenshots/tiers/change-891f97eae6/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-891f97eae6-roll-tawa/films/cook-roll-tawa@740x320.webm
- logs: build/screenshots/tiers/change-891f97eae6/logs
