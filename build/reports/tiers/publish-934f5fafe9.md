# check-publish (tier 3b) on 934f5fafe9

**FAILED**, 2026-11-16T00:25:44.301Z; base 8b4beca7b3; 158.7 min.

Games: house, first, cook:title, cook:fetch, cook:chai-tray, cook:maani-line, cook:mishkaki-grill, cook:daar, cook:chop, cook:tadka, cook:stir, cook:assemble, cook:samosa, cook:eggs, cook:baking, cook:corn, cook:chai, cook:chaat, clinic:waiting, clinic:diagnosis, clinic:pharmacy, clinic:sendoff, clinic:heal-cut, clinic:heal-knee, clinic:heal-ear, clinic:heal-tooth, clinic:heal-taste, clinic:heal-fever, clinic:heal-boing, clinic:heal-eye, clinic:heal-foot, clinic:patient, cook:passme, cook:pour, cook:boil, cook:count, cook:roll, cook:flip, cook:fill, cook:fry, cook:thread, cook:grill, cook:roll-tawa, cook:maani, cook:daal, cook:recipe:samosa, cook:mishkaki, cook:day1, cook:day2, cook:day3, cook:day4, cook:day5, cook:day6, cook:shop, cook:open-kitchen, clinic:morning, clinic:heal-extra-tummy, clinic:heal-extra-hic, clinic:heal-extra-hair, mode:tidy, mode:who, mode:dress, mode:monsoon, mode:snap, mode:find, lab:cook/recipe-chai, lab:cook/recipe-maani, lab:cook/recipe-daal, lab:cook/recipe-chaat, lab:cook/recipe-samosa, lab:cook/recipe-mishkaki, lab:cook/order, lab:cook/round, lab:cook/story-birthday, lab:cook/free, day:door, day:full-farm, day:full-kitchen, day:book, day:window (the diff since 8b4beca7b3).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.6 min; build/reports/tiers/push-934f5fafe9.md |
| note | changed | every changed game (80) at 1280x665 to its end (352 flows) | reports | CONTRACT FAILED: 429 breaks (contract-39 8, contract-92 6, contract-112 57, contract-3 1, contract-22 1, contract-111 5, contract-96 2, contract-72 2, contract- |
| ok   | checks-full | checks.mjs --full: every fast check, the browser's load check, the parked modes' leak bots | yes | checks: 15 steps in 251 s (all at once; the longest: leak 251 s, unit 214 s, art 137 s) |
| note | frozen | chai against its frozen run (frozen.mjs --diff) | reports | lab:cook/chai-tray@L3@740x320: a game note: never seen before: - -> panel-follow |
| FAIL | stamps | every file a page asks for carries the version stamp (build/check_stamps.mjs, B7) | yes | STAMP CHECK PASSED: every request of the live pages stamped (984 requests; 0 known in the parked modes' own code) |

## Blocking (3, by game)

**clinic:heal-ear** (1)
- stuck at clinic:heal-ear#hint@1280x665: did not reach its end (heal ear: timed out playing (last {"do":"tap","x":1203.9453125,"y":389.3671875,"what":"drops"}; {"next":{"do":"tap","x":)

**first** (1)
- page error at first@1280x665: /cook.html: Transition was aborted because of invalid state. ViewTransition opt-in disabled

**(every game)** (1)
- stamps at build/screenshots/tiers/publish-934f5fafe9/logs/stamps.log: STAMP CHECK PASSED: every request of the live pages stamped (984 requests; 0 known in the parked modes' own code)


## Reported, not blocking (431, by game)

**clinic:diagnosis** (1)
- contract-112 at clinic:diagnosis#hint@1280x665 (stage-diagnosis): light 1 [260,372,368,478]: 2 lit regions, not one: [260,372,368,478] [390,380,466,438]; the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 

**clinic:heal-boing** (12)
- contract-7 at clinic:heal-boing@1280x665 (heal-boing-mid): host:clinic/boing: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-7 at clinic:heal-boing@1280x665 (heal-boing-mid): host:clinic/boing: "Chando: trae blue" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 460 ms together
- contract-7 at clinic:heal-boing@1280x665 (results-badges): host:clinic/boing: "ba" (assets/audio/family/mum/ba-word.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 429 ms together
- contract-7 at clinic:heal-boing@1280x665 (results-badges): host:clinic/boing: "trae" (assets/audio/family/mum/trae.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 181 ms together
- contract-8 at clinic:heal-boing@L4@1280x665 (results-badges): host:clinic/boing: 2 highlights at once for 306 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-7 at clinic:heal-boing#mistake@1280x665 (heal-boing-mid): host:clinic/boing: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-7 at clinic:heal-boing#mistake@1280x665 (heal-boing-mid): host:clinic/boing: "Chando: trae blue" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 337 ms together
- contract-7 at clinic:heal-boing#mistake@1280x665 (heal-boing-slip): host:clinic/boing: "trae" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 601 ms together
- contract-4 at clinic:heal-boing#hint@1280x665 (after heal-boing-mid): host:clinic/boing: patient's bubble "Thank you, I feel better!" at {"l":800,"t":141,"r":1079,"b":197} tail 792,185: no head of "patient" on screen
- contract-112 at clinic:heal-boing#hint@1280x665 (stage-heal): light 1 [886,88,1094,224]: the dim is darker than chai's: 0.57 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-boing#hint@1280x665 (idle-hint-heal): light 3 [788,84,860,156]: not one box: only 52% of its own box is lit (two shapes, or a ring); the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it 
- contract-112 at clinic:heal-boing#hint@1280x665 (results-words): light 4 [568,236,696,366]: the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 

**clinic:heal-cut** (4)
- contract-112 at clinic:heal-cut#hint@1280x665 (stage-heal): light 1 [980,88,1140,224]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-cut#hint@1280x665 (heal-cut-mid): light 3 [1124,88,1280,224]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-cut#hint@1280x665 (heal-cut-mid): light 4 [272,238,444,408]: the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-cut#hint@1280x665 (heal-cut-mid): light 5 [288,204,1280,392]: the dim is darker than chai's: 0.54 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is

**clinic:heal-ear** (4)
- contract-112 at clinic:heal-ear#hint@1280x665 (stage-heal): light 1 [574,86,1280,596]: 2 lit regions, not one: [574,86,1280,596] [632,448,802,508]; not a rounded rectangle: an oval (corners 254 px on a box 510 px high, at most a quarter: 128 px); not one box: 
- contract-112 at clinic:heal-ear#hint@1280x665 (heal-ear-mid): light 2 [1124,206,1280,340]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:heal-ear#hint@1280x665 (stopped-here): light 4 [1124,322,1280,456]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:heal-ear#hint@1280x665 (stopped-here): light 5 [644,262,832,450]: the dim is darker than chai's: 0.66 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 

**clinic:heal-extra-hair** (2)
- contract-4 at clinic:heal-extra-hair@1280x665 (start): ?: patient's bubble "Itchy, itchy! Something's in my hair!" at {"l":243,"t":0,"r":1280,"b":22}: in the head's column, above the head (speaker:ellipse {"l":467,"t":243,"r":772,"b":567}); in the top-rig
- contract-7 at clinic:heal-extra-hair@1280x665 (heal-hair-jar): ?: "trae" (assets/audio/family/mum/trae.mp3) started while "Bye bye, beetle!" (assets/audio/family/mum/ba-word.mp3) was still sounding: 360 ms together

**clinic:heal-extra-hic** (1)
- contract-4 at clinic:heal-extra-hic@1280x665 (after heal-hic-sips): ?: patient's bubble "hakro" at {"l":243,"t":0,"r":1280,"b":22}: in the head's column, above the head (speaker:ellipse {"l":519,"t":102,"r":876,"b":476}); in the top-right corner

**clinic:heal-eye** (7)
- contract-7 at clinic:heal-eye@1280x665 (heal-eye-mid): host:clinic/eye: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-21 at clinic:heal-eye@L4@1280x665 (heal-eye-can-see): host:clinic/eye: a tap on span.eye-pill-t at 939,613 while "dungri" was being said: no act logged within 150 ms (the game expected {"clinic":{"kind":"game","stage":"heal","target":null},"host":"clinic
- contract-7 at clinic:heal-eye#mistake@1280x665 (heal-eye-mid): host:clinic/eye: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-21 at clinic:heal-eye#hint@1280x665 (heal-eye-can-see): host:clinic/eye: a tap on div.cl-stage.cl-heal.heal-eye at 939,613 while "mirchi" was being said: no act logged within 150 ms (the game expected {"clinic":{"kind":"game","stage":"heal","target":null},
- contract-112 at clinic:heal-eye#hint@1280x665 (stage-heal): light 1 [1124,88,1280,224]: not a rounded rectangle: a circle (corners 68 px on a box 136 px high, at most a quarter: 34 px); not one box: only 82% of its own box is lit (two shapes, or a ring); the d
- contract-112 at clinic:heal-eye#hint@1280x665 (idle-hint-heal): light 3 [880,576,1180,648]: it lights nothing: no picture with its pill, no picture and no card is in [880,576,1180,648] (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/clinic-heal
- contract-112 at clinic:heal-eye#hint@1280x665 (heal-eye-redrop): light 6 [384,96,506,284]: it lights nothing: no picture with its pill, no picture and no card is in [384,96,506,284] (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/clinic-heal-eye

**clinic:heal-fever** (4)
- contract-4 at clinic:heal-fever#hint@1280x665 (after heal-fever-change-03): host:clinic/fever: patient's bubble "barabar" at {"l":800,"t":146,"r":912,"b":202} tail 792,190: no head of "patient" on screen
- contract-112 at clinic:heal-fever#hint@1280x665 (start): light 1 [1080,88,1280,224]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-fever#hint@1280x665 (heal-fever-change-01): light 2 [712,148,812,228]: the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-fever#hint@1280x665 (heal-fever-mid): light 4 [474,8,718,76]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is in 

**clinic:heal-foot** (3)
- contract-112 at clinic:heal-foot#hint@1280x665 (taught-foot): light 1 [1124,88,1280,224]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-foot#hint@1280x665 (idle-hint-heal): light 3 [752,216,1116,404]: it lights nothing: no picture with its pill, no picture and no card is in [752,216,1116,404] (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/clinic-heal
- contract-112 at clinic:heal-foot#hint@1280x665 (heal-foot-mid): light 4 [1124,440,1280,572]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i

**clinic:heal-knee** (7)
- contract-7 at clinic:heal-knee@1280x665 (heal-knee-turn-01): host:clinic/knee: "hakro" (assets/audio/family/mum/hakro.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 305 ms together
- contract-7 at clinic:heal-knee@1280x665 (heal-knee-turn-01): host:clinic/knee: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 548 ms together
- contract-7 at clinic:heal-knee#mistake@1280x665 (heal-knee-turn-01): host:clinic/knee: "hakro" (assets/audio/family/mum/hakro.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 417 ms together
- contract-7 at clinic:heal-knee#mistake@1280x665 (heal-knee-turn-01): host:clinic/knee: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 399 ms together
- contract-112 at clinic:heal-knee#hint@1280x665 (heal-knee-start): light 1 [1124,88,1280,224]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-knee#hint@1280x665 (heal-knee-mid): light 3 [1124,206,1280,340]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:heal-knee#hint@1280x665 (idle-hint-heal): light 4 [956,336,1040,420]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is

**clinic:heal-taste** (7)
- contract-8 at clinic:heal-taste@1280x665 (heal-taste-mid): host:clinic/taste: 2 highlights at once for 661 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-8 at clinic:heal-taste@L3@1280x665 (heal-taste-mid): host:clinic/taste: 2 highlights at once for 393 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-8 at clinic:heal-taste#mistake@1280x665 (heal-taste-mid): host:clinic/taste: 2 highlights at once for 908 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-4 at clinic:heal-taste#hint@1280x665 (after heal-taste-mid): host:clinic/taste: patient's bubble "My tongue feels better!" at {"l":932,"t":46,"r":1205,"b":102} tail 1209,54: no head of "patient" on screen
- contract-8 at clinic:heal-taste#hint@1280x665 (idle-hint-heal): host:clinic/taste: 2 highlights at once for 907 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-112 at clinic:heal-taste#hint@1280x665 (stage-heal): light 1 [1124,88,1280,224]: the dim is darker than chai's: 0.64 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-taste#hint@1280x665 (idle-hint-heal): light 3 [1124,88,1280,224]: the dim is darker than chai's: 0.63 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is

**clinic:heal-tooth** (3)
- contract-91 at clinic:heal-tooth@1280x665 (results-badges): host:clinic/tooth: 11.0 s stuck on the child's turn (game) since the last action with nothing said and no hint (L1 waits 7000 ms, judged at 11000 ms)
- contract-91 at clinic:heal-tooth#hint@1280x665 (heal-tooth-mid): host:clinic/tooth: 11.0 s stuck on the child's turn (game) since the last action with nothing said and no hint (L1 waits 7000 ms, judged at 11000 ms)
- contract-112 at clinic:heal-tooth#hint@1280x665 (heal-tooth-mid): light 2 [844,412,988,556]: not a rounded rectangle: a circle (corners 72 px on a box 144 px high, at most a quarter: 36 px); not one box: only 27% of its own box is lit (two shapes, or a ring); the di

**clinic:morning** (5)
- contract-7 at clinic:morning@1280x665 (heal-knee-mid): host:clinic/heal: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-7 at clinic:morning@1280x665 (heal-knee-mid): host:clinic/heal: "trae" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 601 ms together
- contract-7 at clinic:morning@1280x665 (heal-knee-mid): host:clinic/heal: "trae" (assets/audio/family/mum/trae.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 213 ms together
- contract-30 at clinic:morning@L2@1280x665 (after heal-knee-turn-06): host:clinic/sendoff: "One more thing." says one, which no card written in this stage holds (every number said is written)
- contract-52 at clinic:morning@L2@1280x665 (after waiting-tap): the bubble "Salamun alaykum." covers patient's face (25% of the head)

**clinic:patient** (11)
- contract-112 at clinic:patient@1280x665 (stage-diagnosis): light 1 [260,372,368,478]: 2 lit regions, not one: [260,372,368,478] [392,380,466,438]; the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 
- contract-112 at clinic:patient@1280x665 (stage-heal): light 2 [612,86,1280,600]: 2 lit regions, not one: [612,86,1280,600] [632,448,802,508]; not a rounded rectangle: an oval (corners 256 px on a box 514 px high, at most a quarter: 128 px); not one box: 
- contract-112 at clinic:patient@1280x665 (heal-ear-mid): light 3 [1124,206,1280,340]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:patient@1280x665 (stage-sendoff): light 5 [1124,322,1280,456]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:patient@1280x665 (stage-sendoff): light 6 [644,262,832,450]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-7 at clinic:patient#mistake@1280x665 (heal-ear-slip): host:clinic/heal: "trae" (assets/audio/family/mum/trae.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 390 ms together
- contract-112 at clinic:patient#hint@1280x665 (stage-diagnosis): light 1 [260,372,368,478]: 2 lit regions, not one: [260,372,368,478] [392,380,466,438]; the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 
- contract-112 at clinic:patient#hint@1280x665 (stage-heal): light 2 [612,86,1280,596]: 2 lit regions, not one: [612,86,1280,596] [632,448,802,508]; not a rounded rectangle: an oval (corners 254 px on a box 510 px high, at most a quarter: 128 px); not one box: 
- contract-112 at clinic:patient#hint@1280x665 (heal-ear-mid): light 3 [1124,206,1280,340]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:patient#hint@1280x665 (stage-sendoff): light 5 [1124,322,1280,456]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-52 at clinic:patient@L2@1280x665 (after waiting-tap): the bubble "Salamun alaykum." covers patient's face (25% of the head)

**clinic:waiting** (1)
- contract-52 at clinic:waiting@L2@1280x665 (after waiting-tap): the bubble "Salamun alaykum." covers patient's face (25% of the head)

**cook:assemble** (10)
- contract-37 at cook:assemble@L2@1280x665 (view-marble): cook:station1:marble (assemble at L2): 1 decoy on the shelf (veg-01, ph-chana, ph-sev, ph-dahi, ph-lili*, veg-03; * not in the order), the table wants 2
- contract-37 at cook:assemble@L3@1280x665 (view-marble): cook:station1:marble (assemble at L3): 2 decoys on the shelf (veg-12*, ph-chana, veg-02, ph-lili, veg-03, ph-amli*, veg-01, ph-dahi; * not in the order), the table wants 3
- contract-37 at cook:assemble@L4@1280x665 (view-marble): cook:station1:marble (assemble at L4): 3 decoys on the shelf (ph-amli, veg-02*, ph-sev, ph-lili*, veg-03, veg-12*, ph-chana, ph-dhana, veg-01; * not in the order), the table wants 4
- contract-37 at cook:assemble@L2#mistake@1280x665 (view-marble): cook:station1:marble (assemble at L2): 1 decoy on the shelf (ph-lili*, veg-01, veg-12, ph-chana, ph-sev, ph-dhana; * not in the order), the table wants 2
- contract-120 at cook:assemble@L2#mistake@1280x665 (view-service): ct-warm stands on the worktop (683x683 at 800,201, depth 29.6) with no soft shadow of its own (SH-268: one light, upper left)
- contract-37 at cook:assemble@L3#hint@1280x665 (view-marble): cook:station1:marble (assemble at L3): 2 decoys on the shelf (veg-12, veg-02*, ph-lili, ph-dhana*, ph-amli, veg-01, ph-chana, ph-sev; * not in the order), the table wants 3
- contract-37 at lab:cook/assemble@L2@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble (assemble at L2): 1 decoy on the shelf (veg-03, ph-chana, veg-12, ph-dahi*, veg-01, ph-amli; * not in the order), the table wants 2
- contract-37 at lab:cook/assemble@L3@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble (assemble at L3): 2 decoys on the shelf (ph-sev, veg-03, ph-lili, ph-amli*, veg-01, ph-chana, ph-dhana*, veg-12; * not in the order), the table wants 3
- contract-37 at lab:cook/assemble@L4@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble (assemble at L4): 3 decoys on the shelf (veg-01, ph-lili, veg-12, veg-03, ph-chana, ph-sev, veg-02, ph-amli*, ph-dhana*, ph-dahi*; * not in the order), the tabl
- contract-115 at lab:cook/assemble@L4@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble: the shelf item veg-01 (ct-bowl-veg-01, class M) stands 77 px, 86% of chai's M height at 1280x665 (90 px): one height per size class, within 10%

**cook:baking** (7)
- contract-36 at cook:baking@L3@1280x665 (view-service): a step opened on screen (the order card's next card "dedh cup paani") and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-114 at cook:baking@L4@1280x665 (view-service): bk-dough rests at 101 px at [488,304,589,384], +20% of its 85 px at its last place [771,280,855,350] (bk-dough): an item keeps its size from step to step
- contract-78 at cook:baking#mistake@1280x665 (view-service): the call "Tayar ai." starts and no light comes with it
- contract-36 at cook:baking@L2#mistake@1280x665 (view-service): a step opened on screen (the light on cook-atto) and Nani did not call it (no call line from 2 s before to 4.1 s after, no skip logged)
- contract-119 at cook:baking#hint@1280x665 (hint-nani-says): the customer said the dish ("Muke naan khape.") at level 1 and its card never flashed up beside their bubble
- contract-36 at cook:baking@L3#hint@1280x665 (hint-glow): a step opened on screen (the light on cook-atto) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-36 at cook:baking@L3#hint@1280x665 (view-service): a step opened on screen (the light on bk-bowl-mixing) and Nani did not call it (no call line from 2 s before to 3.1 s after, no skip logged)

**cook:boil** (2)
- contract-104 at cook:boil@1280x665 (after start): the item card "paani" has no picture
- contract-120 at cook:boil@1280x665 (after start): container stands on the worktop (140x140 at 715,588, depth 31) with no soft shadow of its own (SH-268: one light, upper left)

**cook:chaat** (12)
- contract-26 at cook:chaat@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-26 at cook:chaat@L2@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L2@1280x665 (kind-tap): cook:station2:marble (chaat at L2): 1 decoy on the shelf (ph-sev, ph-dahi*, ph-chana, veg-12, veg-01, ph-amli; * not in the order), the table wants 2
- contract-26 at cook:chaat@L3@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L3@1280x665 (help-open): cook:station2:marble (chaat at L3): 2 decoys on the shelf (ph-dhana, veg-02, ph-sev, ph-lili*, veg-12, ph-dahi*, veg-01, ph-chana; * not in the order), the table wants 3
- contract-65 at cook:chaat@L3@1280x665 (help-open): wave 2's first throw came 513 ms after wave 1's last (its spacing 278 ms): a gap of 235 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-37 at cook:chaat@L4@1280x665 (help-open): cook:station2:marble (chaat at L4): 3 decoys on the shelf (ph-chana, veg-12, ph-dahi*, ph-amli*, veg-02, veg-03*, ph-lili, ph-sev, veg-01; * not in the order), the table wants 4
- contract-26 at cook:chaat#mistake@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-26 at cook:chaat@L2#mistake@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L2#mistake@1280x665 (kind-tap): cook:station2:marble (chaat at L2): 1 decoy on the shelf (ph-sev, ph-lili, veg-01, veg-12, ph-dhana*; * not in the order), the table wants 2
- contract-26 at cook:chaat#hint@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L3#hint@1280x665 (hint-nani-says): cook:station2:marble (chaat at L3): 2 decoys on the shelf (veg-01, ph-sev, ph-chana, veg-03, veg-12, ph-dahi*, ph-lili*, veg-02; * not in the order), the table wants 3

**cook:chai** (1)
- contract-36 at cook:chai@L3#hint@1280x665 (kind-timing): a step opened on screen (the light on kit-knob-off) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)

**cook:chai-tray** (2)
- contract-96 at cook:chai-tray@L3#returning@1280x665 (kind-timing): a pot boiled over and its card is scrolled 38 px along, not back at the first item within 1500 ms
- contract-72 at lab:cook/chai-tray@L4@1280x665 (chai-tray-kind-timing): the order row glided 428 px at once, more than 2.5 cards (115 px each)

**cook:chop** (21)
- contract-119 at cook:chop@1280x665 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card never flashed up beside their bubble
- contract-65 at cook:chop@L3@1280x665 (view-service): wave 2's first throw came 858 ms after wave 1's last (its spacing 300 ms): a gap of 558 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L3@1280x665 (view-service): wave 3's first throw came 953 ms after wave 2's last (its spacing 478 ms): a gap of 475 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-114 at cook:chop@L3@1280x665 (view-service): chop4-dungri-half-a rests at 65 px at [545,108,603,176], -35% of its 100 px at its last place [771,204,855,304] (chop4-dungri-half-a): an item keeps its size from step to step
- contract-114 at cook:chop@L3@1280x665 (view-service): chop4-dungri-half-b rests at 65 px at [614,108,672,176], -35% of its 101 px at its last place [771,204,855,304] (chop4-dungri-half-b): an item keeps its size from step to step
- contract-65 at cook:chop@L2@1280x665 (view-service): wave 2's first throw came 539 ms after wave 1's last (its spacing 308 ms): a gap of 231 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L4@1280x665 (view-service): wave 2's first throw came 568 ms after wave 1's last (its spacing 200 ms): a gap of 368 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L4@1280x665 (view-service): wave 3's first throw came 657 ms after wave 2's last (its spacing 390 ms): a gap of 267 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L4@1280x665 (view-service): wave 4's first throw came 803 ms after wave 3's last (its spacing 300 ms): a gap of 503 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-119 at cook:chop#mistake@1280x665 (start): the customer said the dish ("Muke ba lasan khape.") at level 1 and its card never flashed up beside their bubble
- contract-65 at cook:chop@L2#mistake@1280x665 (view-service): wave 2's first throw came 711 ms after wave 1's last (its spacing 400 ms): a gap of 311 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-119 at cook:chop#hint@1280x665 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card flashed only 93 ms beside their bubble
- contract-36 at cook:chop@L3#hint@1280x665 (view-service): a step opened on screen (the order card's next card "ba dungri") and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-65 at cook:chop@L3#hint@1280x665 (view-service): wave 2's first throw came 532 ms after wave 1's last (its spacing 201 ms): a gap of 331 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-119 at cook:chop#takeback@1280x665 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card flashed only 142 ms beside their bubble
- contract-119 at lab:cook/chop@1280x665 (start): the customer said the dish ("Muke ba mirchi khapanti.") at level 1 and its card never flashed up beside their bubble
- contract-65 at lab:cook/chop@L2@1280x665 (chop-view-service): wave 2's first throw came 618 ms after wave 1's last (its spacing 289 ms): a gap of 329 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-36 at lab:cook/chop@L3@1280x665 (chop-view-service): a step opened on screen (the order card's next card "ba mirchi") and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-65 at lab:cook/chop@L3@1280x665 (chop-view-service): wave 2's first throw came 620 ms after wave 1's last (its spacing 288 ms): a gap of 332 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at lab:cook/chop@L3@1280x665 (chop-view-service): wave 3's first throw came 625 ms after wave 2's last (its spacing 300 ms): a gap of 325 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at lab:cook/chop@L4@1280x665 (chop-view-service): wave 3's first throw came 426 ms after wave 2's last (its spacing 148 ms): a gap of 278 ms between the waves (at most 167, 0.5 s at the test speed 3)

**cook:corn** (7)
- contract-119 at cook:corn@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble
- contract-78 at cook:corn@L4@1280x665 (help-open): the call "Hane makai!" starts and the light comes 3663 ms later (more than 200 ms)
- contract-78 at cook:corn@L4@1280x665 (help-open): the call "Makai hane kadh." starts and the light comes 1935 ms later (more than 200 ms)
- contract-119 at cook:corn#mistake@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble
- contract-119 at cook:corn#hint@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble
- contract-36 at cook:corn@L3#hint@1280x665 (hint-glow): a step opened on screen (the light on spi-04) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-119 at cook:corn#takeback@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble

**cook:count** (7)
- contract-37 at cook:count@1280x665 (after order-card-big): cook:station1:hob (count at L1): 2 decoys on the shelf (cook-atto*, spi-16*, cook-khun; * not in the order), the table wants 1
- contract-102 at cook:count@1280x665 (kind-click): spr:cook-khun.bowl glows [775,552,851,627] outside the kit's light (no light up): the game's own glow
- contract-109 at cook:count@1280x665 (kind-click): the shelf item cook-atto stands 6 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-113 at cook:count@1280x665 (after order-card-big): the word pill  is under the page's button#side-cog.rail-btn.side-cog (81% of it, at [1219,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:count@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:count@1280x665 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (56% of it, at [1195,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-115 at cook:count@1280x665 (view-hob): cook:station1:hob: the shelf item cook-atto (spr:cook-atto.bowl, class L) stands 75 px, 76% of chai's L height at 1280x665 (99 px): one height per size class, within 10%

**cook:daar** (3)
- contract-66 at cook:daar@L2@1280x665 (stir-mid): lap 1: no number asked for within 250 ms of the lap
- contract-37 at cook:daar@L3#hint@1280x665 (hint-nani-says): cook:station3:marble (daar at L3): 2 decoys on the shelf (spi-02, spi-10*, spi-01*, veg-12, veg-13, spi-05; * not in the order), the table wants at least 3
- contract-37 at lab:cook/daar@L2@1280x665 (daar-kind-stir): host:cook/daar|cook:station2:marble (daar at L2): 1 decoy on the shelf (veg-12, spi-10*, spi-01, veg-13; * not in the order), the table wants at least 2

**cook:day1** (1)
- contract-109 at cook:day1@1280x665 (order-card-in-sidebar): the shelf item spi-10 stands -109 px off chai's base line (621 px at 1280x665): one line for every shelf

**cook:day2** (11)
- contract-37 at cook:day2@1280x665 (view-pantry): cook:station2:pantry (day2 at L1): 5 decoys on the shelf (cook-khun, fru-05*, ph-dahi*, ph-ghee*, spi-04*, spi-05*; * not in the order), the table wants 1
- contract-37 at cook:day2@1280x665 (day-summary): cook:station3:marble (day2 at L1): 2 decoys on the shelf (cook-dudh, cook-chai, cook-khun, veg-13*, spi-05*, veg-14, spi-10; * not in the order), the table wants 1
- contract-71 at cook:day2@1280x665 (day-summary): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-72 at cook:day2@1280x665 (day-summary): the order row glided 304 px at once, more than 2.5 cards (115 px each)
- contract-78 at cook:day2@1280x665 (day-summary): the call "Slow kar!" starts and no light comes with it
- contract-108 at cook:day2@1280x665 (day-summary): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day2@1280x665 (view-pantry): the pill under ph-dahi sits -3 px off the chip line (518 px): one line for every pill
- contract-119 at cook:day2@1280x665 (after kind-click): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card flashed only 188 ms beside their bubble
- contract-114 at cook:day2@1280x665 (kind-timing): mv-raw-maani rests at 172 px at [875,126,1047,294], -18% of its 210 px at its last place [543,148,753,353] (mv-raw-maani): an item keeps its size from step to step
- contract-114 at cook:day2@1280x665 (help-open): mv-cooked-maani rests at 65 px at [987,547,1060,619], -62% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step
- contract-114 at cook:day2@1280x665 (results-badges): mv-cooked-maani rests at 65 px at [1002,546,1072,615], -62% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step

**cook:day3** (13)
- contract-1 at cook:day3@1280x665 (kind-roll): cook:station6:marble: the play phase starts with no request pop-up (said outside it: "nindhi maani / wadhi maani"); first tap at 580,580
- contract-37 at cook:day3@1280x665 (after kind-tap): cook:station1:pantry (day3 at L1): 0 decoys on the shelf (veg-03, veg-02, cook-daal; * not in the order), the table wants 1
- contract-37 at cook:day3@1280x665 (day-summary): cook:station7:pantry (day3 at L1): 6 decoys on the shelf (spi-10, fru-05*, ph-pepper*, cook-atto*, spi-16*, ph-keema*, ph-dahi*; * not in the order), the table wants 1
- contract-37 at cook:day3@1280x665 (day-summary): cook:station8:marble (day3 at L1): 3 decoys on the shelf (cook-paani, cook-dudh, cook-chai, cook-khun, spi-10, spi-05*, veg-14, spi-02*, veg-13*; * not in the order), the table wants 1
- contract-92 at cook:day3@1280x665 (order-card-in-sidebar): the light round cook-daal leaves 0 px on its top with nothing beside it: at least 6 px
- contract-109 at cook:day3@1280x665 (after kind-tap): the pill under cook-daal sits -122 px off the chip line (518 px): one line for every pill
- contract-111 at cook:day3@1280x665 (day-summary): the shelf item ph-keema: a tap at its picture's left edge (1170, 466) picks word ph-dahi (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-119 at cook:day3@1280x665 (after stir-mid): the customer said the dish ("Muke daar khapeti,") at level 1 and its card never flashed up beside their bubble
- contract-112 at cook:day3@1280x665 (order-card-in-sidebar): light 1 [380,286,478,412]: cook-daal [392,288,466,409] (its picture, pill and face) is not inside the light with its pad: top 2 px (wants 8), bottom 3 px (wants 8) (picture: build/screenshots/sandbox/
- contract-114 at cook:day3@1280x665 (day-summary): mv-cooked-bajr rests at 99 px at [845,531,944,628], -42% of its 172 px at its last place [875,126,1047,294] (mv-cooked-bajr): an item keeps its size from step to step
- contract-114 at cook:day3@1280x665 (day-summary): mv-cooked-maani rests at 65 px at [991,551,1056,615], -62% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step
- contract-114 at cook:day3@1280x665 (day-summary): mv-burnt-maani rests at 65 px at [1000,545,1073,617], -62% of its 172 px at its last place [875,126,1047,294] (mv-burnt-maani): an item keeps its size from step to step
- contract-114 at cook:day3@1280x665 (day-summary): mv-raw-maani rests at 138 px at [892,142,1029,277], +18% of its 117 px at its last place [590,193,707,308] (mv-raw-maani): an item keeps its size from step to step

**cook:day4** (8)
- contract-26 at cook:day4@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:day4@1280x665 (order-card-in-sidebar): cook:station1:pantry (day4 at L1): 2 decoys on the shelf (ph-chana, cook-daal*, ph-ghee*; * not in the order), the table wants 1
- contract-71 at cook:day4@1280x665 (kind-timing): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-104 at cook:day4@1280x665 (after help-open): the item card "hakro chaat" has no picture
- contract-108 at cook:day4@1280x665 (kind-timing): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day4@1280x665 (results-badges): the shelf item cook-daal stands -131 px off the base line (642 px): one line for every item
- contract-128 at cook:day4@1280x665 (after help-open): the dish's flashing card shows an empty picture box for 593 ms: the card is whole
- contract-112 at cook:day4@1280x665 (view-marble): light 2 [524,72,1256,428]: the light frames a region round veg-01 [757,210,869,305], not the thing: left 233 px, top 138 px, right 387 px, bottom 123 px of room (the pad is 10); lit while chop4-knife 

**cook:day5** (11)
- contract-37 at cook:day5@1280x665 (order-card-in-sidebar): cook:station1:pantry (day5 at L1): 2 decoys on the shelf (veg-01, cook-atto, veg-03*, ph-meat*; * not in the order), the table wants 1
- contract-71 at cook:day5@1280x665 (day-summary): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-104 at cook:day5@1280x665 (day-summary): the item card "ba samosa" has no picture
- contract-108 at cook:day5@1280x665 (day-summary): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day5@1280x665 (order-card-in-sidebar): the pill under ph-meat sits -3 px off the chip line (518 px): one line for every pill
- contract-111 at cook:day5@1280x665 (after kind-tap): the shelf item veg-01: a tap at its picture's left edge (611, 602) picks word ph-keema (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-128 at cook:day5@1280x665 (day-summary): the dish's flashing card shows an empty picture box for 784 ms: the card is whole
- contract-109 at cook:day5@1280x665 (day-summary): the shelf item cook-dudh stands -113 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-114 at cook:day5@1280x665 (kind-timing): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -82% of its 400 px at its last place [510,101,909,286] (sv3-fold-strip#flat): an item keeps its size from step to step
- contract-114 at cook:day5@1280x665 (day-summary): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -82% of its 392 px at its last place [509,101,901,283] (sv3-fold-strip#flat): an item keeps its size from step to step
- contract-114 at cook:day5@1280x665 (day-summary): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -81% of its 366 px at its last place [505,101,871,272] (sv3-fold-strip#flat): an item keeps its size from step to step

**cook:day6** (16)
- contract-1 at cook:day6@1280x665 (after kind-slice): cook:station7:marble: the request pop-up was not read out (no line while it was up)
- contract-37 at cook:day6@1280x665 (help-open): cook:station4:marble (day6 at L1): 2 decoys on the shelf (ph-meat, n.chicken*, veg-12*, veg-03; * not in the order), the table wants 1
- contract-37 at cook:day6@1280x665 (kind-swipe): cook:station7:marble (day6 at L1): 3 decoys on the shelf (veg-01, ph-chana*, ph-amli*, ph-sev*; * not in the order), the table wants 1
- contract-37 at cook:day6@1280x665 (kind-swipe): cook:station9:pantry (day6 at L1): 3 decoys on the shelf (cook-paani*, spi-02*, ph-dahi*; * not in the order), the table wants 1
- contract-71 at cook:day6@1280x665 (day-summary): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-78 at cook:day6@1280x665 (day-summary): the call "Samosa hane kadh." starts and the light comes 3832 ms later (more than 200 ms)
- contract-101 at cook:day6@1280x665 (after help-open): Nani's box in cook:station6:marble never showed its drop-down (.ng-arrow) while the station played
- contract-104 at cook:day6@1280x665 (kind-swipe): the item card "ba samosa" has no picture
- contract-108 at cook:day6@1280x665 (day-summary): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day6@1280x665 (help-open): the shelf item ph-chana stands 131 px off the base line (511 px): one line for every item
- contract-111 at cook:day6@1280x665 (after kind-slice): the shelf item veg-01: a tap at its picture's left edge (611, 602) picks word ph-keema (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-119 at cook:day6@1280x665 (after view-pantry): the customer said the dish ("Muke sekelo khape,") at level 1 and its card never flashed up beside their bubble
- contract-128 at cook:day6@1280x665 (kind-swipe): the dish's flashing card shows an empty picture box for 975 ms: the card is whole
- contract-112 at cook:day6@1280x665 (kind-slice): light 8 [524,72,1256,428]: the light frames a region round veg-01 [757,210,869,305], not the thing: left 233 px, top 138 px, right 387 px, bottom 123 px of room (the pad is 10) (picture: build/screens
- contract-114 at cook:day6@1280x665 (after help-open): chop4-bataato-whole at [757,210,869,305] is swapped in one frame for chop4-bataato-whole at [757,525,869,620] (316 px away, 113 to 113 px): no glide, no fade
- contract-114 at cook:day6@1280x665 (day-summary): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -83% of its 408 px at its last place [511,100,919,290] (sv3-fold-strip#flat): an item keeps its size from step to step

**cook:eggs** (14)
- contract-119 at cook:eggs@1280x665 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card never flashed up beside their bubble
- contract-37 at cook:eggs@L2@1280x665 (after kind-click): cook:station1:marble (eggs at L2): 3 decoys on the shelf (n.egg*, cook-atto*, cook-dudh*; * not in the order), the table wants 2
- contract-37 at cook:eggs@L3@1280x665 (after kind-click): cook:station1:marble (eggs at L3): 5 decoys on the shelf (n.egg, spi-16*, spi-11*, cook-khun*, cook-atto*, cook-chai*; * not in the order), the table wants 3
- contract-37 at cook:eggs@L4@1280x665 (view-marble): cook:station1:marble (eggs at L4): 3 decoys on the shelf (spi-16, spi-11, cook-khun*, cook-chai*, cook-dudh*; * not in the order), the table wants 4
- contract-70 at cook:eggs@L4@1280x665 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-114 at cook:eggs@L4@1280x665 (view-service): eg-friedEgg-cooked rests at 80 px at [1145,164,1224,243], +83% of its 44 px at its last place [772,154,815,197] (eg-friedEgg-cooked): an item keeps its size from step to step
- contract-119 at cook:eggs#mistake@1280x665 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card never flashed up beside their bubble
- contract-70 at cook:eggs@L2#mistake@1280x665 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-37 at cook:eggs#hint@1280x665 (after order-card-big): cook:station1:marble (eggs at L1): 2 decoys on the shelf (n.egg*, cook-dudh*; * not in the order), the table wants 1
- contract-78 at cook:eggs#hint@1280x665 (view-service): the call "Indo wiji chad!" starts and the light comes 789 ms later (more than 200 ms)
- contract-119 at cook:eggs#hint@1280x665 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card never flashed up beside their bubble
- contract-70 at cook:eggs@L3#hint@1280x665 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-112 at cook:eggs@L3#hint@1280x665 (hint-nani-says): light 6 [486,136,564,212]: not a rounded rectangle: corners too round (corners 27 px on a box 76 px high, at most a quarter: 19 px) (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/
- contract-119 at cook:eggs#takeback@1280x665 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card never flashed up beside their bubble

**cook:fetch** (8)
- contract-92 at cook:fetch@L2@1280x665 (view-pantry): the light round cook-chai leaves 2 px on its top with nothing beside it: at least 6 px
- contract-112 at cook:fetch@L2@1280x665 (view-pantry): light 4 [654,296,752,414]: cook-chai [666,300,740,409] (its picture, pill and face) is not inside the light with its pad: top 4 px (wants 9) (picture: build/screenshots/sandbox/tiers-publish-934f5fafe
- contract-3 at cook:fetch#mistake@1280x665 (after help-open): "hakro khun" (assets/audio/family/mum/shabash-rc.mp3, 0.74 s) started 1282 ms after 1709 ms past the end of cook:station1:pantry (into cook:between1:pantry); it stopped by stop
- contract-22 at cook:fetch#mistake@1280x665 (wrong-choice): cook:station1:pantry: "Muke rai de." said twice, 1306 ms apart (a line is said once; again only after 10 s idle)
- contract-92 at cook:fetch#mistake@1280x665 (order-card-in-sidebar): the light round cook-daal leaves 5 px on its top with nothing beside it: at least 6 px
- contract-112 at cook:fetch@L2#mistake@1280x665 (view-pantry): light 4 [508,410,624,534]: veg-03 [521,421,612,531] (its picture, pill and face) is not inside the light with its pad: bottom 3 px (wants 10) (picture: build/screenshots/sandbox/tiers-publish-934f5faf
- contract-92 at cook:fetch@L3#hint@1280x665 (hint-glow): the light round cook-dudh covers its neighbour ph-dahi: it should stop short of it
- contract-111 at lab:cook/fetch@L2@1280x665 (fetch-order-card-in-sidebar): the shelf item ph-keema: a tap at its picture's right edge (1168, 466) picks word ph-dahi (the item takes its picture, its slot down to its pill and the pill but its speaker)

**cook:fill** (10)
- contract-36 at cook:fill@1280x665 (order-card-in-sidebar): a step opened on screen (the light on ph-keema) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-36 at cook:fill@1280x665 (kind-swipe): a step opened on screen (the light on sv3-board) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-105 at cook:fill@1280x665 (kind-swipe): the light [594,229,808,443] is round 39% of sv3-board [594,201,1032,466] (middle off by 26%, 1% of its size): it should sit whole round it
- contract-109 at cook:fill@1280x665 (order-card-in-sidebar): the shelf item veg-12 stands -96 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-113 at cook:fill@1280x665 (after kind-swipe): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-114 at cook:fill@1280x665 (kind-swipe): spr:chaat-bowl.empty rests at 178 px at [404,199,581,373], -40% of its 296 px at its last place [667,170,962,460] (spr:chaat-bowl.empty): an item keeps its size from step to step
- contract-114 at cook:fill@1280x665 (kind-swipe): layer:ph-keema rests at 32 px at [448,282,480,303], -40% of its 53 px at its last place [740,308,793,343] (layer:ph-keema): an item keeps its size from step to step
- contract-114 at cook:fill@1280x665 (kind-swipe): layer:ph-keema rests at 32 px at [501,313,532,334], -40% of its 53 px at its last place [828,361,880,396] (layer:ph-keema): an item keeps its size from step to step
- contract-114 at cook:fill@1280x665 (kind-click): sv3-fold-6 rests at 178 px at [1050,498,1228,553], -55% of its 400 px at its last place [613,274,1013,398] (sv3-fold-6): an item keeps its size from step to step
- contract-115 at cook:fill@1280x665 (view-marble): cook:station1:marble: the shelf item veg-12 (spr:veg-12.bowl, class S) stands 70 px, 85% of chai's S height at 1280x665 (83 px): one height per size class, within 10%

**cook:flip** (5)
- contract-119 at cook:flip@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:flip@1280x665 (kind-click): chapati-burnt stands on the worktop (172x169 at 368,746, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:flip@1280x665 (after kind-timing): chapati-puffed stands on the worktop (190x188 at 353,730, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-114 at cook:flip@1280x665 (kind-click): chapati-burnt rests at 95 px at [510,526,611,625], -29% of its 133 px at its last place [913,294,1046,424] (chapati-burnt): an item keeps its size from step to step
- contract-114 at cook:flip@1280x665 (after kind-timing): chapati-puffed rests at 95 px at [497,511,608,621], -29% of its 133 px at its last place [913,294,1046,424] (chapati-puffed): an item keeps its size from step to step

**cook:fry** (5)
- contract-70 at cook:fry@1280x665 (after kind-tap): the heat ring entered its green (0.62-0.84) and no call was said by 0.80 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-77 at cook:fry@1280x665 (after kind-tap): a new player's first timed window: the ring went on past the middle of its green (0.73, at 0.759) before the tap (the first-time hold waits in the green until the child acts)
- contract-119 at cook:fry@1280x665 (after start): the customer said the dish ("Muke trae samosa khapanta.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:fry@1280x665 (after order-card-big): spr@pastry:3 stands on the worktop (119x106 at 998,728, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-113 at cook:fry@1280x665 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (56% of it, at [1195,8,1272,46]): nothing covers a face, a pill or a card's words

**cook:grill** (1)
- contract-36 at cook:grill@1280x665 (order-card-in-sidebar): a step opened on screen (the light on mk:stick:v4) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)

**cook:maani** (1)
- contract-119 at cook:maani@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card never flashed up beside their bubble

**cook:maani-line** (9)
- contract-119 at cook:maani-line@1280x665 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card flashed only 124 ms beside their bubble
- contract-96 at cook:maani-line@L4@1280x665 (view-service): a pot boiled over and emptied, and 2 cards stayed ticked for 1500 ms (its rows open again)
- contract-119 at cook:maani-line#mistake@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card flashed only 79 ms beside their bubble
- contract-36 at cook:maani-line#hint@1280x665 (hint-nani-says): a step opened on screen (the light on njg-tray@1504x260@75@art) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-119 at cook:maani-line#hint@1280x665 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card never flashed up beside their bubble
- contract-36 at cook:maani-line@L3#hint@1280x665 (hint-glow): a step opened on screen (the light on njg-tray@1504x260@75@art) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-119 at cook:maani-line#returning@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-119 at cook:maani-line#takeback@1280x665 (after start): the customer said the dish ("Muke ba bajr ji maani khapeti.") at level 1 and its card flashed only 101 ms beside their bubble
- contract-119 at lab:cook/maani-line@1280x665 (after maani-line-start): the customer said the dish ("Muke hakri maani khapeti,") at level 1 and its card never flashed up beside their bubble

**cook:mishkaki-grill** (1)
- contract-119 at cook:mishkaki-grill#returning@1280x665 (after start): the customer said the dish ("Muke sekelo khape,") at level 1 and its card flashed only 181 ms beside their bubble

**cook:open-kitchen** (10)
- contract-1 at cook:open-kitchen@1280x665 (after kind-timing): cook:station5:marble: the request pop-up was not read out (no line while it was up)
- contract-37 at cook:open-kitchen@1280x665 (close-kitchen): cook:station5:marble (open-kitchen at L1): 3 decoys on the shelf (ph-dahi*, ph-chana*, veg-01, ph-dhana*; * not in the order), the table wants 1
- contract-74 at cook:open-kitchen@1280x665 (after order-card-big): the station started 1859 ms after the tap during the order (within 1 s)
- contract-100 at cook:open-kitchen@1280x665 (after kind-timing): an old order-card piece on screen: .oc-item (only the 6 Nov item cards, no count box, strip, skewer or group box)
- contract-101 at cook:open-kitchen@1280x665 (after kind-timing): Nani's box in cook:station4:marble never showed its drop-down (.ng-arrow) while the station played
- contract-119 at cook:open-kitchen@1280x665 (after results-words): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card flashed only 145 ms beside their bubble
- contract-114 at cook:open-kitchen@1280x665 (kind-timing): mv-raw-bajr rests at 172 px at [875,126,1047,294], -18% of its 210 px at its last place [543,148,753,353] (mv-raw-bajr): an item keeps its size from step to step
- contract-114 at cook:open-kitchen@1280x665 (close-kitchen): mv-cooked-bajr rests at 99 px at [839,525,950,634], -42% of its 172 px at its last place [875,126,1047,294] (mv-cooked-bajr): an item keeps its size from step to step
- contract-114 at cook:open-kitchen@1280x665 (close-kitchen): mv-raw-maani rests at 172 px at [875,126,1047,294], -18% of its 210 px at its last place [543,148,753,353] (mv-raw-maani): an item keeps its size from step to step
- contract-114 at cook:open-kitchen@1280x665 (close-kitchen): mv-cooked-maani rests at 99 px at [979,529,1081,630], -42% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step

**cook:pour** (1)
- contract-104 at cook:pour@1280x665 (after start): the item card "paani" has no picture

**cook:recipe:samosa** (1)
- contract-114 at cook:recipe:samosa@1280x665 (kind-swipe): sv3-heap-ph-keema at [764,138,806,179] is swapped in one frame for sv3-heap-ph-keema at [850,539,882,572] (405 px away, 42 to 33 px): no glide, no fade

**cook:roll** (7)
- contract-119 at cook:roll@1280x665 (after start): the customer said the dish ("Muke trae maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:roll@1280x665 (help-open): mv-ball-maani stands on the worktop (137x136 at 230,760, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:roll@1280x665 (help-open): mv-raw-maani stands on the worktop (261x256 at 1330,700, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-113 at cook:roll@1280x665 (after kind-roll): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:roll@1280x665 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (56% of it, at [1195,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-114 at cook:roll@1280x665 (after kind-roll): mv-raw-maani at [691,283,912,499] is swapped in one frame for mv-raw-maani at [1046,474,1199,623] (358 px away, 221 to 153 px): no glide, no fade
- contract-114 at cook:roll@1280x665 (after kind-roll): mv-raw-maani rests at 153 px at [1046,474,1199,623], -31% of its 221 px at its last place [691,283,912,499] (mv-raw-maani): an item keeps its size from step to step

**cook:roll-tawa** (8)
- contract-119 at cook:roll-tawa@1280x665 (after start): the customer said the dish ("Muke char maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:roll-tawa@1280x665 (kind-tap): dough-ball stands on the worktop (98x97 at 351,743, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:roll-tawa@1280x665 (help-open): chapati-burnt stands on the worktop (171x168 at 1039,719, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:roll-tawa@1280x665 (help-open): chapati-puffed stands on the worktop (166x163 at 1038,703, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-114 at cook:roll-tawa@1280x665 (kind-timing): chapati-burnt rests at 95 px at [903,511,1003,609], -29% of its 133 px at its last place [887,169,1020,299] (chapati-burnt): an item keeps its size from step to step
- contract-114 at cook:roll-tawa@1280x665 (help-open): chapati-puffed rests at 95 px at [904,503,1001,598], -29% of its 133 px at its last place [887,169,1019,299] (chapati-puffed): an item keeps its size from step to step
- contract-114 at cook:roll-tawa@1280x665 (kind-click): chapati-puffed rests at 95 px at [902,495,997,588], -29% of its 133 px at its last place [887,169,1019,299] (chapati-puffed): an item keeps its size from step to step
- contract-114 at cook:roll-tawa@1280x665 (after help-open): chapati-puffed rests at 95 px at [902,482,1005,582], -29% of its 133 px at its last place [887,169,1019,299] (chapati-puffed): an item keeps its size from step to step

**cook:samosa** (7)
- contract-37 at cook:samosa@L4@1280x665 (view-marble): cook:station1:marble (samosa at L4): 3 decoys on the shelf (ph-dhana, veg-10*, ph-keema, veg-02*, veg-01, veg-12*; * not in the order), the table wants at least 4
- contract-78 at cook:samosa#mistake@1280x665 (view-service): the call "Samosa hane kadh." starts and no light comes with it
- contract-92 at cook:samosa#hint@1280x665 (hint-nani-says): the light round veg-01 covers its neighbour veg-12: it should stop short of it
- contract-78 at cook:samosa@L3#hint@1280x665 (kind-timing): the call "Samosa hane kadh." starts and the light comes 245 ms later (more than 200 ms)
- contract-78 at lab:cook/samosa@1280x665 (samosa-kind-timing): the call "Samosa hane kadh." starts and no light comes with it
- contract-37 at lab:cook/samosa@L4@1280x665 (samosa-view-marble): host:cook/samosa|cook:station1:marble (samosa at L4): 3 decoys on the shelf (veg-12, ph-dhana*, veg-01, ph-keema, veg-10*, veg-02*; * not in the order), the table wants at least 4
- contract-70 at lab:cook/samosa@L4@1280x665 (samosa-view-service): the heat ring entered its green (0.68-0.8) and no call was said by 0.86 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)

**cook:stir** (47)
- contract-78 at cook:stir@1280x665 (order-card-in-sidebar): the call "Char!" starts and the light comes 986 ms later (more than 200 ms)
- contract-78 at cook:stir@1280x665 (order-card-in-sidebar): the call "jaldi" starts and the light comes 796 ms later (more than 200 ms)
- contract-89 at cook:stir@1280x665 (order-card-in-sidebar): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-112 at cook:stir@1280x665 (order-card-in-sidebar): light 1 [732,162,890,320]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10), bottom 3 px
- contract-78 at cook:stir@L3@1280x665 (view-marble): the call "Ba!" starts and no light comes with it
- contract-89 at cook:stir@L3@1280x665 (view-marble): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L3@1280x665 (view-marble): "Ba!" was said 680 ms after the order was skipped, before the game's first step
- contract-78 at cook:stir@L2@1280x665 (view-marble): the call "Char!" starts and the light comes 934 ms later (more than 200 ms)
- contract-78 at cook:stir@L2@1280x665 (view-marble): the call "aste thi" starts and the light comes 671 ms later (more than 200 ms)
- contract-89 at cook:stir@L2@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L2@1280x665 (view-marble): "Char!" was said 544 ms after the order was skipped, before the game's first step
- contract-112 at cook:stir@L2@1280x665 (view-marble): light 4 [732,162,890,320]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10), bottom 3 px
- contract-78 at cook:stir@L4@1280x665 (view-marble): the call "Char!" starts and no light comes with it
- contract-78 at cook:stir@L4@1280x665 (view-marble): the call "aste thi" starts and no light comes with it
- contract-89 at cook:stir@L4@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L4@1280x665 (view-marble): "Char!" was said 608 ms after the order was skipped, before the game's first step
- contract-78 at cook:stir#mistake@1280x665 (after order-card-big): the call "Ba!" starts and the light comes 942 ms later (more than 200 ms)
- contract-89 at cook:stir#mistake@1280x665 (after order-card-big): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir#mistake@1280x665 (after order-card-big): "Ba!" was said 456 ms after the order was skipped, before the game's first step
- contract-112 at cook:stir#mistake@1280x665 (order-card-in-sidebar): light 1 [732,162,890,324]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10) (picture: bu
- contract-78 at cook:stir@L2#mistake@1280x665 (view-marble): the call "Char!" starts and the light comes 966 ms later (more than 200 ms)
- contract-78 at cook:stir@L2#mistake@1280x665 (view-marble): the call "jaldi" starts and the light comes 733 ms later (more than 200 ms)
- contract-89 at cook:stir@L2#mistake@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L2#mistake@1280x665 (view-marble): "Char!" was said 622 ms after the order was skipped, before the game's first step
- contract-112 at cook:stir@L2#mistake@1280x665 (view-marble): light 4 [732,162,890,320]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10), bottom 3 px
- contract-78 at cook:stir#hint@1280x665 (order-card-in-sidebar): the call "Trae!" starts and no light comes with it
- contract-89 at cook:stir#hint@1280x665 (order-card-in-sidebar): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir#hint@1280x665 (order-card-in-sidebar): "Trae!" was said 623 ms after the order was skipped, before the game's first step
- contract-66 at cook:stir@L3#hint@1280x665 (view-service): lap 4's number was left out (quiet) though no other line was sounding
- contract-78 at cook:stir@L3#hint@1280x665 (view-marble): the call "Char!" starts and no light comes with it
- contract-78 at cook:stir@L3#hint@1280x665 (view-marble): the call "aste thi" starts and no light comes with it
- contract-89 at cook:stir@L3#hint@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L3#hint@1280x665 (view-marble): "Char!" was said 775 ms after the order was skipped, before the game's first step
- contract-89 at cook:stir#takeback@1280x665 (after order-card-big): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir#takeback@1280x665 (after order-card-big): "Trae!" was said 416 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@1280x665 (after stir-order-card-big): the call "Trae!" starts and no light comes with it
- contract-89 at lab:cook/stir@1280x665 (after stir-order-card-big): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@1280x665 (after stir-order-card-big): "Trae!" was said 428 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@L2@1280x665 (after stir-kind-click): the call "Ba!" starts and no light comes with it
- contract-89 at lab:cook/stir@L2@1280x665 (after stir-kind-click): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@L2@1280x665 (after stir-kind-click): "Ba!" was said 277 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@L3@1280x665 (stir-view-marble): the call "Trae!" starts and no light comes with it
- contract-89 at lab:cook/stir@L3@1280x665 (stir-view-marble): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@L3@1280x665 (stir-view-marble): "Trae!" was said 844 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@L4@1280x665 (stir-view-marble): the call "Ba!" starts and no light comes with it
- contract-89 at lab:cook/stir@L4@1280x665 (stir-view-marble): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@L4@1280x665 (stir-view-marble): "Ba!" was said 672 ms after the order was skipped, before the game's first step

**cook:tadka** (35)
- contract-36 at cook:tadka@1280x665 (order-card-in-sidebar): a step opened on screen (the light on spi-01) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (spi-16*, veg-13*, spi-05*, veg-12, spi-01, spi-02*; * not in the order), the table wants 1
- contract-113 at cook:tadka@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-36 at cook:tadka@L2@1280x665 (view-hob): a step opened on screen (the light on veg-12) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka@L2@1280x665 (after kind-click): cook:station1:hob (tadka at L2): 4 decoys on the shelf (veg-12, spi-01*, spi-02, spi-16*, spi-05*, veg-13*; * not in the order), the table wants 2
- contract-113 at cook:tadka@L2@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka@L2@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka@L3@1280x665 (view-hob): cook:station1:hob (tadka at L3): 6 decoys on the shelf (spi-04*, spi-01*, veg-12, spi-16*, veg-13*, spi-05*, spi-02, spi-10*; * not in the order), the table wants 3
- contract-113 at cook:tadka@L3@1280x665 (after kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka@L4@1280x665 (view-hob): cook:station1:hob (tadka at L4): 6 decoys on the shelf (spi-16*, spi-05*, veg-13, spi-10*, veg-12*, spi-02*, spi-04*, spi-01; * not in the order), the table wants 4
- contract-113 at cook:tadka@L4@1280x665 (after kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-36 at cook:tadka#mistake@1280x665 (order-card-in-sidebar): a step opened on screen (the light on spi-05) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-36 at cook:tadka#mistake@1280x665 (view-service): a step opened on screen (the light on veg-13) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka#mistake@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (spi-05, veg-13, spi-01*, spi-02*, spi-16*, veg-12*; * not in the order), the table wants 1
- contract-113 at cook:tadka#mistake@1280x665 (after wrong-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka#mistake@1280x665 (after wrong-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-36 at cook:tadka@L2#mistake@1280x665 (view-hob): a step opened on screen (the light on veg-12) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka@L2#mistake@1280x665 (view-hob): cook:station1:hob (tadka at L2): 4 decoys on the shelf (spi-16*, spi-01*, spi-02*, spi-05, veg-13*; * not in the order), the table wants 2
- contract-113 at cook:tadka@L2#mistake@1280x665 (after wrong-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka@L2#mistake@1280x665 (after wrong-tap): the word pill hakrohakrohakro is under the page's button#side-cog.rail-btn.side-cog (13% of it, at [932,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka#hint@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (spi-02*, veg-12, spi-05*, spi-16*, veg-13*, spi-01; * not in the order), the table wants 1
- contract-113 at cook:tadka#hint@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka@L3#hint@1280x665 (view-hob): cook:station1:hob (tadka at L3): 6 decoys on the shelf (spi-10*, spi-05*, spi-04*, veg-12*, spi-01, veg-13*, spi-02*, spi-16; * not in the order), the table wants 3
- contract-113 at cook:tadka@L3#hint@1280x665 (after kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka#takeback@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (veg-12, veg-13*, spi-02, spi-16*, spi-01*, spi-05*; * not in the order), the table wants 1
- contract-113 at cook:tadka#takeback@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka#takeback@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at lab:cook/tadka@1280x665 (tadka-order-card-in-sidebar): host:cook/tadka|cook:station1:hob (tadka at L1): 4 decoys on the shelf (veg-13*, spi-16*, veg-12*, spi-02, spi-01*, spi-05; * not in the order), the table wants 1
- contract-37 at lab:cook/tadka@L2@1280x665 (tadka-view-hob): host:cook/tadka|cook:station1:hob (tadka at L2): 4 decoys on the shelf (spi-05*, veg-13*, spi-02*, spi-16, spi-01*, veg-12; * not in the order), the table wants 2
- contract-113 at lab:cook/tadka@L2@1280x665 (after tadka-kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at lab:cook/tadka@L3@1280x665 (tadka-view-hob): host:cook/tadka|cook:station1:hob (tadka at L3): 6 decoys on the shelf (spi-05*, spi-01, spi-16*, spi-10*, veg-12, veg-13*, spi-04*, spi-02*; * not in the order), the table wants 3
- contract-113 at lab:cook/tadka@L3@1280x665 (after tadka-kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at lab:cook/tadka@L4@1280x665 (tadka-view-hob): host:cook/tadka|cook:station1:hob (tadka at L4): 6 decoys on the shelf (veg-12, spi-10*, spi-16*, spi-05*, spi-02*, spi-01*, veg-13, spi-04*; * not in the order), the table wants 4
- contract-113 at lab:cook/tadka@L4@1280x665 (after tadka-kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words

**cook:thread** (2)
- contract-36 at cook:thread@1280x665 (order-card-in-sidebar): a step opened on screen (the light on veg-02) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-95 at cook:thread@1280x665 (kind-click): "dungri" was said 6140 ms after the order was skipped, before the game's first step

**day:full-farm** (2)
- contract-112 at day:full-farm@1280x665 (find-find): light 2 [862,266,1056,476]: 2 lit regions, not one: [862,266,1056,476] [966,156,1020,210]; the dim is darker than chai's: 0.83 of the way to the dim's colour against chai's 0.45 (within 0.08); it ligh
- contract-112 at day:full-farm@1280x665 (find-nameit): light 3 [800,340,920,460]: the dim is darker than chai's: 0.83 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 

**day:full-kitchen** (2)
- contract-112 at day:full-kitchen@1280x665 (door-lines-and-yes): light 1 [1036,520,1148,592]: the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at day:full-kitchen@1280x665 (find-find): light 2 [236,266,434,476]: 2 lit regions, not one: [236,266,434,476] [136,342,212,400]; the dim is darker than chai's: 0.83 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 

**first** (9)
- contract-39 at first@1280x665 (after pantry-round-view-service): the word card for cook-chai (stage 1) shows its English "chai" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for cook-chai (stage 1) shows its English "chai" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the word card for cook-dudh (stage 1) shows its English "milk" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for cook-dudh (stage 1) shows its English "milk" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for cook-khun (stage 1) shows its English "sugar" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for spi-10 (stage 1) shows its English "cardamom" without the child tapping it open
- contract-39 at first@1280x665 (after chai-round-order-card-big): the word card for cook-khun (stage 2) shows its English "one sugar" without the child tapping it open
- contract-39 at first@1280x665 (after chai-round-order-card-big): the order card's row for cook-paani (stage 1) shows its English "water" without the child tapping it open
- contract-92 at first@1280x665 (pantry-round-kind-click): the light round cook-dudh leaves 0 px on its top with nothing beside it: at least 6 px

**lab:cook/recipe-chaat** (4)
- contract-26 at lab:cook/recipe-chaat@L2@1280x665 (after recipe-chaat-kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at lab:cook/recipe-chaat@L2@1280x665 (recipe-chaat-kind-tap): host:cook/recipe-chaat|cook:station2:marble (chaat at L2): 1 decoy on the shelf (ph-sev, veg-02, ph-chana, veg-01, veg-12, veg-03*; * not in the order), the table wants 2
- contract-37 at lab:cook/recipe-chaat@L3@1280x665 (recipe-chaat-kind-tap): host:cook/recipe-chaat|cook:station2:marble (chaat at L3): 2 decoys on the shelf (veg-12, ph-dhana, ph-amli*, ph-sev*, veg-01, ph-dahi, ph-chana; * not in the order), the table wants 3
- contract-37 at lab:cook/recipe-chaat@L4@1280x665 (recipe-chaat-kind-tap): host:cook/recipe-chaat|cook:station2:marble (chaat at L4): 3 decoys on the shelf (ph-lili, ph-chana, ph-amli, ph-dhana*, ph-sev, ph-dahi*, veg-12, veg-02*, veg-01; * not in the order), the table wants

**lab:cook/recipe-daal** (2)
- contract-112 at lab:cook/recipe-daal@1280x665 (recipe-daal-order-card-in-sidebar): light 1 [524,72,1256,428]: the light frames a region round veg-02 [768,206,857,308], not the thing: left 244 px, top 134 px, right 399 px, bottom 120 px of room (the pad is 10); lit while chop4-knife 
- contract-112 at lab:cook/recipe-daal@L4@1280x665 (recipe-daal-view-marble): light 4 [524,72,1256,428]: the light frames a region round veg-02 [813,206,902,308], not the thing: left 289 px, top 134 px, right 354 px, bottom 120 px of room (the pad is 10); lit while chop4-knife 

**lab:cook/recipe-maani** (1)
- contract-119 at lab:cook/recipe-maani@1280x665 (after recipe-maani-start): the customer said the dish ("Muke ba bajr ji maani khapeti.") at level 1 and its card flashed only 113 ms beside their bubble

**lab:cook/recipe-samosa** (3)
- contract-37 at lab:cook/recipe-samosa@L3@1280x665 (recipe-samosa-view-marble): host:cook/recipe-samosa|cook:station1:marble (samosa at L3): 2 decoys on the shelf (veg-12, veg-01, veg-02*, veg-10, ph-dhana*, ph-keema; * not in the order), the table wants at least 3
- contract-78 at lab:cook/recipe-samosa@L3@1280x665 (recipe-samosa-kind-timing): the call "Chulo bar!" starts and the light comes 286 ms later (more than 200 ms)
- contract-37 at lab:cook/recipe-samosa@L4@1280x665 (after recipe-samosa-kind-click): host:cook/recipe-samosa|cook:station1:marble (samosa at L4): 3 decoys on the shelf (ph-dhana, ph-keema, veg-10*, veg-01, veg-12*, veg-02*; * not in the order), the table wants at least 4

**lab:cook/round** (12)
- contract-37 at lab:cook/round@1280x665 (after pantry-order-card-big): host:cook/pantry|cook:station1:pantry (round at L1): 2 decoys on the shelf (cook-dudh, cook-khun, spi-05*, ph-dahi*; * not in the order), the table wants 1
- contract-109 at lab:cook/round@1280x665 (after pantry-order-card-big): the pill under cook-dudh sits -3 px off the chip line (518 px): one line for every pill
- contract-112 at lab:cook/round@1280x665 (order-order-card-in-sidebar): light 2 [544,494,630,664]: it lights nothing: no picture with its pill, no picture and no card is in [544,494,630,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build
- contract-37 at lab:cook/round@L2@1280x665 (after pantry-kind-click): host:cook/pantry|cook:station1:pantry (round at L2): 3 decoys on the shelf (cook-chai, cook-dudh, spi-10, ph-chana*, spi-05*, fru-05*; * not in the order), the table wants 2
- contract-109 at lab:cook/round@L2@1280x665 (after pantry-kind-click): the pill under cook-dudh sits -3 px off the chip line (518 px): one line for every pill
- contract-112 at lab:cook/round@L2@1280x665 (order-order-card-in-sidebar): light 5 [444,494,528,664]: it lights nothing: no picture with its pill, no picture and no card is in [444,494,528,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build
- contract-37 at lab:cook/round@L3@1280x665 (after pantry-order-card-big): host:cook/pantry|cook:station1:pantry (round at L3): 4 decoys on the shelf (cook-khun, veg-03*, spi-02*, ph-amli*, spi-05*; * not in the order), the table wants 3
- contract-112 at lab:cook/round@L3@1280x665 (order-order-card-in-sidebar): light 4 [424,494,510,664]: it lights nothing: no picture with its pill, no picture and no card is in [424,494,510,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build
- contract-37 at lab:cook/round@L4@1280x665 (pantry-order-card-in-sidebar): host:cook/pantry|cook:station1:pantry (round at L4): 7 decoys on the shelf (veg-02*, veg-03*, spi-05*, cook-atto*, ph-dahi*, spi-04*, ph-keema*; * not in the order), the table wants 4
- contract-109 at lab:cook/round@L4@1280x665 (pantry-order-card-in-sidebar): the pill under ph-dahi sits -3 px off the chip line (518 px): one line for every pill
- contract-111 at lab:cook/round@L4@1280x665 (pantry-order-card-in-sidebar): the shelf item ph-dahi: a tap at its picture's right edge (1168, 463) picks word ph-keema (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-112 at lab:cook/round@L4@1280x665 (order-order-card-in-sidebar): light 4 [380,494,466,664]: it lights nothing: no picture with its pill, no picture and no card is in [380,494,466,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build

**lab:cook/story-birthday** (3)
- contract-109 at lab:cook/story-birthday@1280x665 (pantry-order-card-in-sidebar): the pill under ph-dahi sits -3 px off the chip line (518 px): one line for every pill
- contract-109 at lab:cook/story-birthday@1280x665 (pantry-order-card-in-sidebar): the shelf item spi-10 stands -109 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-112 at lab:cook/story-birthday@1280x665 (order-order-card-in-sidebar): light 2 [544,494,630,664]: it lights nothing: no picture with its pill, no picture and no card is in [544,494,630,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build

**mode:dress** (2)
- contract-41 at mode:dress@1280x665 (after title): a pop-up of the game's own (#intro.) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:dress@1280x665 (after title): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card

**mode:find** (4)
- contract-34 at mode:find@1280x665 (after kind-click): ?: button#find-done.btn.primary "✓" is not the kit's button (.njg-btn)
- contract-26 at mode:find@1280x665 (list-in-sidebar): the opening line "Muke hakro anjir khape." was not heard whole: hakro, anjir had no sound (no clip played and the device voice did not say it)
- contract-41 at mode:find@1280x665 (after kind-click): a pop-up of the game's own (#intro.njg-rq-open.going) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:find@1280x665 (after kind-click): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card

**mode:snap** (3)
- contract-41 at mode:snap@1280x665 (after title): a pop-up of the game's own (#intro.njg-rq-open) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:snap@1280x665 (after title): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:snap@1280x665 (after title): a pop-up of the game's own (#intro.njg-rq-open.going) on screen: the order pop-up is the kit's .njg-rq-card

**mode:tidy** (4)
- contract-34 at mode:tidy@1280x665 (after intro): ?: button#btn-done.rail-btn.done is not the kit's button (.njg-btn)
- contract-34 at mode:tidy@1280x665 (after speak): ?: button.go "✓" is not the kit's button (.njg-btn)
- contract-41 at mode:tidy@1280x665 (start): a pop-up of the game's own (#intro.) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:tidy@1280x665 (start): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card

**mode:who** (1)
- contract-34 at mode:who@1280x665 (after ui-pick): ?: button#who-next.btn.primary "▶" is not the kit's button (.njg-btn)

**(every game)** (3)
- changed at build/screenshots/tiers/publish-934f5fafe9/logs/changed.log: CONTRACT FAILED: 429 breaks (contract-39 8, contract-92 6, contract-112 57, contract-3 1, contract-22 1, contract-111 5, contract-96 2, contract-72 2, contract-119 31, contract-36 19, contract-66 2, contract-37 55, contract-65 13, contract-114 34, contract-113 24, contract-78 27, contract-89 13, contract-95 13, contract-120 10, contract-115 3, contract-70 5, contract-26 9, contract-52 3, contract-7 18, contract-91 2, contract-8 5, contract-4 5, contract-21 2, contract-104 5, contract-102 1, contract-109 14, contract-105 1, contract-77 1, contract-71 4, contract-108 4, contract-1 3, contract-128 3, contract-101 2, contract-74 1, contract-100 1, contract-30 1, contract-34 4, contract-41 9); CHECK FAILED: 525 new findings, 1 flows do not reach their end, 0 new page errors, 429 contract breaks
- frozen at build/screenshots/tiers/publish-934f5fafe9/logs/frozen.log: lab:cook/chai-tray@L3@740x320: a game note: never seen before: - -> panel-follow
- check-sprint: none since the last publish; published on his word: Yes, do 1-3 then publish (Zafar, 15 Nov, decision 43)


## Known fails (open, published with the list) (433, by game)

**clinic:diagnosis** (1)
- contract-112 at clinic:diagnosis#hint@1280x665 (stage-diagnosis): light 1 [260,372,368,478]: 2 lit regions, not one: [260,372,368,478] [390,380,466,438]; the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 

**clinic:heal-boing** (12)
- contract-7 at clinic:heal-boing@1280x665 (heal-boing-mid): host:clinic/boing: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-7 at clinic:heal-boing@1280x665 (heal-boing-mid): host:clinic/boing: "Chando: trae blue" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 460 ms together
- contract-7 at clinic:heal-boing@1280x665 (results-badges): host:clinic/boing: "ba" (assets/audio/family/mum/ba-word.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 429 ms together
- contract-7 at clinic:heal-boing@1280x665 (results-badges): host:clinic/boing: "trae" (assets/audio/family/mum/trae.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 181 ms together
- contract-8 at clinic:heal-boing@L4@1280x665 (results-badges): host:clinic/boing: 2 highlights at once for 306 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-7 at clinic:heal-boing#mistake@1280x665 (heal-boing-mid): host:clinic/boing: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-7 at clinic:heal-boing#mistake@1280x665 (heal-boing-mid): host:clinic/boing: "Chando: trae blue" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 337 ms together
- contract-7 at clinic:heal-boing#mistake@1280x665 (heal-boing-slip): host:clinic/boing: "trae" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 601 ms together
- contract-4 at clinic:heal-boing#hint@1280x665 (after heal-boing-mid): host:clinic/boing: patient's bubble "Thank you, I feel better!" at {"l":800,"t":141,"r":1079,"b":197} tail 792,185: no head of "patient" on screen
- contract-112 at clinic:heal-boing#hint@1280x665 (stage-heal): light 1 [886,88,1094,224]: the dim is darker than chai's: 0.57 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-boing#hint@1280x665 (idle-hint-heal): light 3 [788,84,860,156]: not one box: only 52% of its own box is lit (two shapes, or a ring); the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it 
- contract-112 at clinic:heal-boing#hint@1280x665 (results-words): light 4 [568,236,696,366]: the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 

**clinic:heal-cut** (4)
- contract-112 at clinic:heal-cut#hint@1280x665 (stage-heal): light 1 [980,88,1140,224]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-cut#hint@1280x665 (heal-cut-mid): light 3 [1124,88,1280,224]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-cut#hint@1280x665 (heal-cut-mid): light 4 [272,238,444,408]: the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-cut#hint@1280x665 (heal-cut-mid): light 5 [288,204,1280,392]: the dim is darker than chai's: 0.54 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is

**clinic:heal-ear** (4)
- contract-112 at clinic:heal-ear#hint@1280x665 (stage-heal): light 1 [574,86,1280,596]: 2 lit regions, not one: [574,86,1280,596] [632,448,802,508]; not a rounded rectangle: an oval (corners 254 px on a box 510 px high, at most a quarter: 128 px); not one box: 
- contract-112 at clinic:heal-ear#hint@1280x665 (heal-ear-mid): light 2 [1124,206,1280,340]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:heal-ear#hint@1280x665 (stopped-here): light 4 [1124,322,1280,456]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:heal-ear#hint@1280x665 (stopped-here): light 5 [644,262,832,450]: the dim is darker than chai's: 0.66 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 

**clinic:heal-extra-hair** (2)
- contract-4 at clinic:heal-extra-hair@1280x665 (start): ?: patient's bubble "Itchy, itchy! Something's in my hair!" at {"l":243,"t":0,"r":1280,"b":22}: in the head's column, above the head (speaker:ellipse {"l":467,"t":243,"r":772,"b":567}); in the top-rig
- contract-7 at clinic:heal-extra-hair@1280x665 (heal-hair-jar): ?: "trae" (assets/audio/family/mum/trae.mp3) started while "Bye bye, beetle!" (assets/audio/family/mum/ba-word.mp3) was still sounding: 360 ms together

**clinic:heal-extra-hic** (1)
- contract-4 at clinic:heal-extra-hic@1280x665 (after heal-hic-sips): ?: patient's bubble "hakro" at {"l":243,"t":0,"r":1280,"b":22}: in the head's column, above the head (speaker:ellipse {"l":519,"t":102,"r":876,"b":476}); in the top-right corner

**clinic:heal-eye** (7)
- contract-7 at clinic:heal-eye@1280x665 (heal-eye-mid): host:clinic/eye: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-21 at clinic:heal-eye@L4@1280x665 (heal-eye-can-see): host:clinic/eye: a tap on span.eye-pill-t at 939,613 while "dungri" was being said: no act logged within 150 ms (the game expected {"clinic":{"kind":"game","stage":"heal","target":null},"host":"clinic
- contract-7 at clinic:heal-eye#mistake@1280x665 (heal-eye-mid): host:clinic/eye: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-21 at clinic:heal-eye#hint@1280x665 (heal-eye-can-see): host:clinic/eye: a tap on div.cl-stage.cl-heal.heal-eye at 939,613 while "mirchi" was being said: no act logged within 150 ms (the game expected {"clinic":{"kind":"game","stage":"heal","target":null},
- contract-112 at clinic:heal-eye#hint@1280x665 (stage-heal): light 1 [1124,88,1280,224]: not a rounded rectangle: a circle (corners 68 px on a box 136 px high, at most a quarter: 34 px); not one box: only 82% of its own box is lit (two shapes, or a ring); the d
- contract-112 at clinic:heal-eye#hint@1280x665 (idle-hint-heal): light 3 [880,576,1180,648]: it lights nothing: no picture with its pill, no picture and no card is in [880,576,1180,648] (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/clinic-heal
- contract-112 at clinic:heal-eye#hint@1280x665 (heal-eye-redrop): light 6 [384,96,506,284]: it lights nothing: no picture with its pill, no picture and no card is in [384,96,506,284] (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/clinic-heal-eye

**clinic:heal-fever** (4)
- contract-4 at clinic:heal-fever#hint@1280x665 (after heal-fever-change-03): host:clinic/fever: patient's bubble "barabar" at {"l":800,"t":146,"r":912,"b":202} tail 792,190: no head of "patient" on screen
- contract-112 at clinic:heal-fever#hint@1280x665 (start): light 1 [1080,88,1280,224]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-fever#hint@1280x665 (heal-fever-change-01): light 2 [712,148,812,228]: the dim is darker than chai's: 0.55 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-112 at clinic:heal-fever#hint@1280x665 (heal-fever-mid): light 4 [474,8,718,76]: the dim is darker than chai's: 0.56 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is in 

**clinic:heal-foot** (3)
- contract-112 at clinic:heal-foot#hint@1280x665 (taught-foot): light 1 [1124,88,1280,224]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-foot#hint@1280x665 (idle-hint-heal): light 3 [752,216,1116,404]: it lights nothing: no picture with its pill, no picture and no card is in [752,216,1116,404] (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/clinic-heal
- contract-112 at clinic:heal-foot#hint@1280x665 (heal-foot-mid): light 4 [1124,440,1280,572]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i

**clinic:heal-knee** (7)
- contract-7 at clinic:heal-knee@1280x665 (heal-knee-turn-01): host:clinic/knee: "hakro" (assets/audio/family/mum/hakro.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 305 ms together
- contract-7 at clinic:heal-knee@1280x665 (heal-knee-turn-01): host:clinic/knee: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 548 ms together
- contract-7 at clinic:heal-knee#mistake@1280x665 (heal-knee-turn-01): host:clinic/knee: "hakro" (assets/audio/family/mum/hakro.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 417 ms together
- contract-7 at clinic:heal-knee#mistake@1280x665 (heal-knee-turn-01): host:clinic/knee: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 399 ms together
- contract-112 at clinic:heal-knee#hint@1280x665 (heal-knee-start): light 1 [1124,88,1280,224]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-knee#hint@1280x665 (heal-knee-mid): light 3 [1124,206,1280,340]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:heal-knee#hint@1280x665 (idle-hint-heal): light 4 [956,336,1040,420]: the dim is darker than chai's: 0.53 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is

**clinic:heal-taste** (7)
- contract-8 at clinic:heal-taste@1280x665 (heal-taste-mid): host:clinic/taste: 2 highlights at once for 661 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-8 at clinic:heal-taste@L3@1280x665 (heal-taste-mid): host:clinic/taste: 2 highlights at once for 393 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-8 at clinic:heal-taste#mistake@1280x665 (heal-taste-mid): host:clinic/taste: 2 highlights at once for 908 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-4 at clinic:heal-taste#hint@1280x665 (after heal-taste-mid): host:clinic/taste: patient's bubble "My tongue feels better!" at {"l":932,"t":46,"r":1205,"b":102} tail 1209,54: no head of "patient" on screen
- contract-8 at clinic:heal-taste#hint@1280x665 (idle-hint-heal): host:clinic/taste: 2 highlights at once for 907 ms (dom:.oc-row.reading[0]#rgb(255, 255, 255), dom:.oc-row.reading[1]#rgb(255, 255, 255)); one at a time, in one colour
- contract-112 at clinic:heal-taste#hint@1280x665 (stage-heal): light 1 [1124,88,1280,224]: the dim is darker than chai's: 0.64 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is
- contract-112 at clinic:heal-taste#hint@1280x665 (idle-hint-heal): light 3 [1124,88,1280,224]: the dim is darker than chai's: 0.63 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is

**clinic:heal-tooth** (3)
- contract-91 at clinic:heal-tooth@1280x665 (results-badges): host:clinic/tooth: 11.0 s stuck on the child's turn (game) since the last action with nothing said and no hint (L1 waits 7000 ms, judged at 11000 ms)
- contract-91 at clinic:heal-tooth#hint@1280x665 (heal-tooth-mid): host:clinic/tooth: 11.0 s stuck on the child's turn (game) since the last action with nothing said and no hint (L1 waits 7000 ms, judged at 11000 ms)
- contract-112 at clinic:heal-tooth#hint@1280x665 (heal-tooth-mid): light 2 [844,412,988,556]: not a rounded rectangle: a circle (corners 72 px on a box 144 px high, at most a quarter: 36 px); not one box: only 27% of its own box is lit (two shapes, or a ring); the di

**clinic:morning** (5)
- contract-7 at clinic:morning@1280x665 (heal-knee-mid): host:clinic/heal: "ba" (assets/audio/family/mum/ba-word.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 549 ms together
- contract-7 at clinic:morning@1280x665 (heal-knee-mid): host:clinic/heal: "trae" (assets/audio/family/mum/trae.mp3) started while "hakro" (assets/audio/family/mum/hakro.mp3) was still sounding: 601 ms together
- contract-7 at clinic:morning@1280x665 (heal-knee-mid): host:clinic/heal: "trae" (assets/audio/family/mum/trae.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 213 ms together
- contract-30 at clinic:morning@L2@1280x665 (after heal-knee-turn-06): host:clinic/sendoff: "One more thing." says one, which no card written in this stage holds (every number said is written)
- contract-52 at clinic:morning@L2@1280x665 (after waiting-tap): the bubble "Salamun alaykum." covers patient's face (25% of the head)

**clinic:patient** (11)
- contract-112 at clinic:patient@1280x665 (stage-diagnosis): light 1 [260,372,368,478]: 2 lit regions, not one: [260,372,368,478] [392,380,466,438]; the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 
- contract-112 at clinic:patient@1280x665 (stage-heal): light 2 [612,86,1280,600]: 2 lit regions, not one: [612,86,1280,600] [632,448,802,508]; not a rounded rectangle: an oval (corners 256 px on a box 514 px high, at most a quarter: 128 px); not one box: 
- contract-112 at clinic:patient@1280x665 (heal-ear-mid): light 3 [1124,206,1280,340]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:patient@1280x665 (stage-sendoff): light 5 [1124,322,1280,456]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:patient@1280x665 (stage-sendoff): light 6 [644,262,832,450]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 
- contract-7 at clinic:patient#mistake@1280x665 (heal-ear-slip): host:clinic/heal: "trae" (assets/audio/family/mum/trae.mp3) started while "ba" (assets/audio/family/mum/ba-word.mp3) was still sounding: 390 ms together
- contract-112 at clinic:patient#hint@1280x665 (stage-diagnosis): light 1 [260,372,368,478]: 2 lit regions, not one: [260,372,368,478] [392,380,466,438]; the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 
- contract-112 at clinic:patient#hint@1280x665 (stage-heal): light 2 [612,86,1280,596]: 2 lit regions, not one: [612,86,1280,596] [632,448,802,508]; not a rounded rectangle: an oval (corners 254 px on a box 510 px high, at most a quarter: 128 px); not one box: 
- contract-112 at clinic:patient#hint@1280x665 (heal-ear-mid): light 3 [1124,206,1280,340]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at clinic:patient#hint@1280x665 (stage-sendoff): light 5 [1124,322,1280,456]: the dim is darker than chai's: 0.67 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-52 at clinic:patient@L2@1280x665 (after waiting-tap): the bubble "Salamun alaykum." covers patient's face (25% of the head)

**clinic:waiting** (1)
- contract-52 at clinic:waiting@L2@1280x665 (after waiting-tap): the bubble "Salamun alaykum." covers patient's face (25% of the head)

**cook:assemble** (10)
- contract-37 at cook:assemble@L2@1280x665 (view-marble): cook:station1:marble (assemble at L2): 1 decoy on the shelf (veg-01, ph-chana, ph-sev, ph-dahi, ph-lili*, veg-03; * not in the order), the table wants 2
- contract-37 at cook:assemble@L3@1280x665 (view-marble): cook:station1:marble (assemble at L3): 2 decoys on the shelf (veg-12*, ph-chana, veg-02, ph-lili, veg-03, ph-amli*, veg-01, ph-dahi; * not in the order), the table wants 3
- contract-37 at cook:assemble@L4@1280x665 (view-marble): cook:station1:marble (assemble at L4): 3 decoys on the shelf (ph-amli, veg-02*, ph-sev, ph-lili*, veg-03, veg-12*, ph-chana, ph-dhana, veg-01; * not in the order), the table wants 4
- contract-37 at cook:assemble@L2#mistake@1280x665 (view-marble): cook:station1:marble (assemble at L2): 1 decoy on the shelf (ph-lili*, veg-01, veg-12, ph-chana, ph-sev, ph-dhana; * not in the order), the table wants 2
- contract-120 at cook:assemble@L2#mistake@1280x665 (view-service): ct-warm stands on the worktop (683x683 at 800,201, depth 29.6) with no soft shadow of its own (SH-268: one light, upper left)
- contract-37 at cook:assemble@L3#hint@1280x665 (view-marble): cook:station1:marble (assemble at L3): 2 decoys on the shelf (veg-12, veg-02*, ph-lili, ph-dhana*, ph-amli, veg-01, ph-chana, ph-sev; * not in the order), the table wants 3
- contract-37 at lab:cook/assemble@L2@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble (assemble at L2): 1 decoy on the shelf (veg-03, ph-chana, veg-12, ph-dahi*, veg-01, ph-amli; * not in the order), the table wants 2
- contract-37 at lab:cook/assemble@L3@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble (assemble at L3): 2 decoys on the shelf (ph-sev, veg-03, ph-lili, ph-amli*, veg-01, ph-chana, ph-dhana*, veg-12; * not in the order), the table wants 3
- contract-37 at lab:cook/assemble@L4@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble (assemble at L4): 3 decoys on the shelf (veg-01, ph-lili, veg-12, veg-03, ph-chana, ph-sev, veg-02, ph-amli*, ph-dhana*, ph-dahi*; * not in the order), the tabl
- contract-115 at lab:cook/assemble@L4@1280x665 (assemble-view-marble): host:cook/assemble|cook:station1:marble: the shelf item veg-01 (ct-bowl-veg-01, class M) stands 77 px, 86% of chai's M height at 1280x665 (90 px): one height per size class, within 10%

**cook:baking** (7)
- contract-36 at cook:baking@L3@1280x665 (view-service): a step opened on screen (the order card's next card "dedh cup paani") and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-114 at cook:baking@L4@1280x665 (view-service): bk-dough rests at 101 px at [488,304,589,384], +20% of its 85 px at its last place [771,280,855,350] (bk-dough): an item keeps its size from step to step
- contract-78 at cook:baking#mistake@1280x665 (view-service): the call "Tayar ai." starts and no light comes with it
- contract-36 at cook:baking@L2#mistake@1280x665 (view-service): a step opened on screen (the light on cook-atto) and Nani did not call it (no call line from 2 s before to 4.1 s after, no skip logged)
- contract-119 at cook:baking#hint@1280x665 (hint-nani-says): the customer said the dish ("Muke naan khape.") at level 1 and its card never flashed up beside their bubble
- contract-36 at cook:baking@L3#hint@1280x665 (hint-glow): a step opened on screen (the light on cook-atto) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-36 at cook:baking@L3#hint@1280x665 (view-service): a step opened on screen (the light on bk-bowl-mixing) and Nani did not call it (no call line from 2 s before to 3.1 s after, no skip logged)

**cook:boil** (2)
- contract-104 at cook:boil@1280x665 (after start): the item card "paani" has no picture
- contract-120 at cook:boil@1280x665 (after start): container stands on the worktop (140x140 at 715,588, depth 31) with no soft shadow of its own (SH-268: one light, upper left)

**cook:chaat** (12)
- contract-26 at cook:chaat@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-26 at cook:chaat@L2@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L2@1280x665 (kind-tap): cook:station2:marble (chaat at L2): 1 decoy on the shelf (ph-sev, ph-dahi*, ph-chana, veg-12, veg-01, ph-amli; * not in the order), the table wants 2
- contract-26 at cook:chaat@L3@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L3@1280x665 (help-open): cook:station2:marble (chaat at L3): 2 decoys on the shelf (ph-dhana, veg-02, ph-sev, ph-lili*, veg-12, ph-dahi*, veg-01, ph-chana; * not in the order), the table wants 3
- contract-65 at cook:chaat@L3@1280x665 (help-open): wave 2's first throw came 513 ms after wave 1's last (its spacing 278 ms): a gap of 235 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-37 at cook:chaat@L4@1280x665 (help-open): cook:station2:marble (chaat at L4): 3 decoys on the shelf (ph-chana, veg-12, ph-dahi*, ph-amli*, veg-02, veg-03*, ph-lili, ph-sev, veg-01; * not in the order), the table wants 4
- contract-26 at cook:chaat#mistake@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-26 at cook:chaat@L2#mistake@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L2#mistake@1280x665 (kind-tap): cook:station2:marble (chaat at L2): 1 decoy on the shelf (ph-sev, ph-lili, veg-01, veg-12, ph-dhana*; * not in the order), the table wants 2
- contract-26 at cook:chaat#hint@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:chaat@L3#hint@1280x665 (hint-nani-says): cook:station2:marble (chaat at L3): 2 decoys on the shelf (veg-01, ph-sev, ph-chana, veg-03, veg-12, ph-dahi*, ph-lili*, veg-02; * not in the order), the table wants 3

**cook:chai** (1)
- contract-36 at cook:chai@L3#hint@1280x665 (kind-timing): a step opened on screen (the light on kit-knob-off) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)

**cook:chai-tray** (2)
- contract-96 at cook:chai-tray@L3#returning@1280x665 (kind-timing): a pot boiled over and its card is scrolled 38 px along, not back at the first item within 1500 ms
- contract-72 at lab:cook/chai-tray@L4@1280x665 (chai-tray-kind-timing): the order row glided 428 px at once, more than 2.5 cards (115 px each)

**cook:chop** (21)
- contract-119 at cook:chop@1280x665 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card never flashed up beside their bubble
- contract-65 at cook:chop@L3@1280x665 (view-service): wave 2's first throw came 858 ms after wave 1's last (its spacing 300 ms): a gap of 558 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L3@1280x665 (view-service): wave 3's first throw came 953 ms after wave 2's last (its spacing 478 ms): a gap of 475 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-114 at cook:chop@L3@1280x665 (view-service): chop4-dungri-half-a rests at 65 px at [545,108,603,176], -35% of its 100 px at its last place [771,204,855,304] (chop4-dungri-half-a): an item keeps its size from step to step
- contract-114 at cook:chop@L3@1280x665 (view-service): chop4-dungri-half-b rests at 65 px at [614,108,672,176], -35% of its 101 px at its last place [771,204,855,304] (chop4-dungri-half-b): an item keeps its size from step to step
- contract-65 at cook:chop@L2@1280x665 (view-service): wave 2's first throw came 539 ms after wave 1's last (its spacing 308 ms): a gap of 231 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L4@1280x665 (view-service): wave 2's first throw came 568 ms after wave 1's last (its spacing 200 ms): a gap of 368 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L4@1280x665 (view-service): wave 3's first throw came 657 ms after wave 2's last (its spacing 390 ms): a gap of 267 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at cook:chop@L4@1280x665 (view-service): wave 4's first throw came 803 ms after wave 3's last (its spacing 300 ms): a gap of 503 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-119 at cook:chop#mistake@1280x665 (start): the customer said the dish ("Muke ba lasan khape.") at level 1 and its card never flashed up beside their bubble
- contract-65 at cook:chop@L2#mistake@1280x665 (view-service): wave 2's first throw came 711 ms after wave 1's last (its spacing 400 ms): a gap of 311 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-119 at cook:chop#hint@1280x665 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card flashed only 93 ms beside their bubble
- contract-36 at cook:chop@L3#hint@1280x665 (view-service): a step opened on screen (the order card's next card "ba dungri") and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-65 at cook:chop@L3#hint@1280x665 (view-service): wave 2's first throw came 532 ms after wave 1's last (its spacing 201 ms): a gap of 331 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-119 at cook:chop#takeback@1280x665 (start): the customer said the dish ("Muke ba dungri khapanti.") at level 1 and its card flashed only 142 ms beside their bubble
- contract-119 at lab:cook/chop@1280x665 (start): the customer said the dish ("Muke ba mirchi khapanti.") at level 1 and its card never flashed up beside their bubble
- contract-65 at lab:cook/chop@L2@1280x665 (chop-view-service): wave 2's first throw came 618 ms after wave 1's last (its spacing 289 ms): a gap of 329 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-36 at lab:cook/chop@L3@1280x665 (chop-view-service): a step opened on screen (the order card's next card "ba mirchi") and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-65 at lab:cook/chop@L3@1280x665 (chop-view-service): wave 2's first throw came 620 ms after wave 1's last (its spacing 288 ms): a gap of 332 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at lab:cook/chop@L3@1280x665 (chop-view-service): wave 3's first throw came 625 ms after wave 2's last (its spacing 300 ms): a gap of 325 ms between the waves (at most 167, 0.5 s at the test speed 3)
- contract-65 at lab:cook/chop@L4@1280x665 (chop-view-service): wave 3's first throw came 426 ms after wave 2's last (its spacing 148 ms): a gap of 278 ms between the waves (at most 167, 0.5 s at the test speed 3)

**cook:corn** (7)
- contract-119 at cook:corn@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble
- contract-78 at cook:corn@L4@1280x665 (help-open): the call "Hane makai!" starts and the light comes 3663 ms later (more than 200 ms)
- contract-78 at cook:corn@L4@1280x665 (help-open): the call "Makai hane kadh." starts and the light comes 1935 ms later (more than 200 ms)
- contract-119 at cook:corn#mistake@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble
- contract-119 at cook:corn#hint@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble
- contract-36 at cook:corn@L3#hint@1280x665 (hint-glow): a step opened on screen (the light on spi-04) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-119 at cook:corn#takeback@1280x665 (after start): the customer said the dish ("Muke hakro makai khape,") at level 1 and its card never flashed up beside their bubble

**cook:count** (7)
- contract-37 at cook:count@1280x665 (after order-card-big): cook:station1:hob (count at L1): 2 decoys on the shelf (cook-atto*, spi-16*, cook-khun; * not in the order), the table wants 1
- contract-102 at cook:count@1280x665 (kind-click): spr:cook-khun.bowl glows [775,552,851,627] outside the kit's light (no light up): the game's own glow
- contract-109 at cook:count@1280x665 (kind-click): the shelf item cook-atto stands 6 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-113 at cook:count@1280x665 (after order-card-big): the word pill  is under the page's button#side-cog.rail-btn.side-cog (81% of it, at [1219,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:count@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:count@1280x665 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (56% of it, at [1195,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-115 at cook:count@1280x665 (view-hob): cook:station1:hob: the shelf item cook-atto (spr:cook-atto.bowl, class L) stands 75 px, 76% of chai's L height at 1280x665 (99 px): one height per size class, within 10%

**cook:daar** (3)
- contract-66 at cook:daar@L2@1280x665 (stir-mid): lap 1: no number asked for within 250 ms of the lap
- contract-37 at cook:daar@L3#hint@1280x665 (hint-nani-says): cook:station3:marble (daar at L3): 2 decoys on the shelf (spi-02, spi-10*, spi-01*, veg-12, veg-13, spi-05; * not in the order), the table wants at least 3
- contract-37 at lab:cook/daar@L2@1280x665 (daar-kind-stir): host:cook/daar|cook:station2:marble (daar at L2): 1 decoy on the shelf (veg-12, spi-10*, spi-01, veg-13; * not in the order), the table wants at least 2

**cook:day1** (1)
- contract-109 at cook:day1@1280x665 (order-card-in-sidebar): the shelf item spi-10 stands -109 px off chai's base line (621 px at 1280x665): one line for every shelf

**cook:day2** (11)
- contract-37 at cook:day2@1280x665 (view-pantry): cook:station2:pantry (day2 at L1): 5 decoys on the shelf (cook-khun, fru-05*, ph-dahi*, ph-ghee*, spi-04*, spi-05*; * not in the order), the table wants 1
- contract-37 at cook:day2@1280x665 (day-summary): cook:station3:marble (day2 at L1): 2 decoys on the shelf (cook-dudh, cook-chai, cook-khun, veg-13*, spi-05*, veg-14, spi-10; * not in the order), the table wants 1
- contract-71 at cook:day2@1280x665 (day-summary): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-72 at cook:day2@1280x665 (day-summary): the order row glided 304 px at once, more than 2.5 cards (115 px each)
- contract-78 at cook:day2@1280x665 (day-summary): the call "Slow kar!" starts and no light comes with it
- contract-108 at cook:day2@1280x665 (day-summary): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day2@1280x665 (view-pantry): the pill under ph-dahi sits -3 px off the chip line (518 px): one line for every pill
- contract-119 at cook:day2@1280x665 (after kind-click): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card flashed only 188 ms beside their bubble
- contract-114 at cook:day2@1280x665 (kind-timing): mv-raw-maani rests at 172 px at [875,126,1047,294], -18% of its 210 px at its last place [543,148,753,353] (mv-raw-maani): an item keeps its size from step to step
- contract-114 at cook:day2@1280x665 (help-open): mv-cooked-maani rests at 65 px at [987,547,1060,619], -62% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step
- contract-114 at cook:day2@1280x665 (results-badges): mv-cooked-maani rests at 65 px at [1002,546,1072,615], -62% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step

**cook:day3** (13)
- contract-1 at cook:day3@1280x665 (kind-roll): cook:station6:marble: the play phase starts with no request pop-up (said outside it: "nindhi maani / wadhi maani"); first tap at 580,580
- contract-37 at cook:day3@1280x665 (after kind-tap): cook:station1:pantry (day3 at L1): 0 decoys on the shelf (veg-03, veg-02, cook-daal; * not in the order), the table wants 1
- contract-37 at cook:day3@1280x665 (day-summary): cook:station7:pantry (day3 at L1): 6 decoys on the shelf (spi-10, fru-05*, ph-pepper*, cook-atto*, spi-16*, ph-keema*, ph-dahi*; * not in the order), the table wants 1
- contract-37 at cook:day3@1280x665 (day-summary): cook:station8:marble (day3 at L1): 3 decoys on the shelf (cook-paani, cook-dudh, cook-chai, cook-khun, spi-10, spi-05*, veg-14, spi-02*, veg-13*; * not in the order), the table wants 1
- contract-92 at cook:day3@1280x665 (order-card-in-sidebar): the light round cook-daal leaves 0 px on its top with nothing beside it: at least 6 px
- contract-109 at cook:day3@1280x665 (after kind-tap): the pill under cook-daal sits -122 px off the chip line (518 px): one line for every pill
- contract-111 at cook:day3@1280x665 (day-summary): the shelf item ph-keema: a tap at its picture's left edge (1170, 466) picks word ph-dahi (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-119 at cook:day3@1280x665 (after stir-mid): the customer said the dish ("Muke daar khapeti,") at level 1 and its card never flashed up beside their bubble
- contract-112 at cook:day3@1280x665 (order-card-in-sidebar): light 1 [380,286,478,412]: cook-daal [392,288,466,409] (its picture, pill and face) is not inside the light with its pad: top 2 px (wants 8), bottom 3 px (wants 8) (picture: build/screenshots/sandbox/
- contract-114 at cook:day3@1280x665 (day-summary): mv-cooked-bajr rests at 99 px at [845,531,944,628], -42% of its 172 px at its last place [875,126,1047,294] (mv-cooked-bajr): an item keeps its size from step to step
- contract-114 at cook:day3@1280x665 (day-summary): mv-cooked-maani rests at 65 px at [991,551,1056,615], -62% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step
- contract-114 at cook:day3@1280x665 (day-summary): mv-burnt-maani rests at 65 px at [1000,545,1073,617], -62% of its 172 px at its last place [875,126,1047,294] (mv-burnt-maani): an item keeps its size from step to step
- contract-114 at cook:day3@1280x665 (day-summary): mv-raw-maani rests at 138 px at [892,142,1029,277], +18% of its 117 px at its last place [590,193,707,308] (mv-raw-maani): an item keeps its size from step to step

**cook:day4** (8)
- contract-26 at cook:day4@1280x665 (after kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at cook:day4@1280x665 (order-card-in-sidebar): cook:station1:pantry (day4 at L1): 2 decoys on the shelf (ph-chana, cook-daal*, ph-ghee*; * not in the order), the table wants 1
- contract-71 at cook:day4@1280x665 (kind-timing): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-104 at cook:day4@1280x665 (after help-open): the item card "hakro chaat" has no picture
- contract-108 at cook:day4@1280x665 (kind-timing): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day4@1280x665 (results-badges): the shelf item cook-daal stands -131 px off the base line (642 px): one line for every item
- contract-128 at cook:day4@1280x665 (after help-open): the dish's flashing card shows an empty picture box for 593 ms: the card is whole
- contract-112 at cook:day4@1280x665 (view-marble): light 2 [524,72,1256,428]: the light frames a region round veg-01 [757,210,869,305], not the thing: left 233 px, top 138 px, right 387 px, bottom 123 px of room (the pad is 10); lit while chop4-knife 

**cook:day5** (11)
- contract-37 at cook:day5@1280x665 (order-card-in-sidebar): cook:station1:pantry (day5 at L1): 2 decoys on the shelf (veg-01, cook-atto, veg-03*, ph-meat*; * not in the order), the table wants 1
- contract-71 at cook:day5@1280x665 (day-summary): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-104 at cook:day5@1280x665 (day-summary): the item card "ba samosa" has no picture
- contract-108 at cook:day5@1280x665 (day-summary): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day5@1280x665 (order-card-in-sidebar): the pill under ph-meat sits -3 px off the chip line (518 px): one line for every pill
- contract-111 at cook:day5@1280x665 (after kind-tap): the shelf item veg-01: a tap at its picture's left edge (611, 602) picks word ph-keema (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-128 at cook:day5@1280x665 (day-summary): the dish's flashing card shows an empty picture box for 784 ms: the card is whole
- contract-109 at cook:day5@1280x665 (day-summary): the shelf item cook-dudh stands -113 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-114 at cook:day5@1280x665 (kind-timing): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -82% of its 400 px at its last place [510,101,909,286] (sv3-fold-strip#flat): an item keeps its size from step to step
- contract-114 at cook:day5@1280x665 (day-summary): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -82% of its 392 px at its last place [509,101,901,283] (sv3-fold-strip#flat): an item keeps its size from step to step
- contract-114 at cook:day5@1280x665 (day-summary): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -81% of its 366 px at its last place [505,101,871,272] (sv3-fold-strip#flat): an item keeps its size from step to step

**cook:day6** (16)
- contract-1 at cook:day6@1280x665 (after kind-slice): cook:station7:marble: the request pop-up was not read out (no line while it was up)
- contract-37 at cook:day6@1280x665 (help-open): cook:station4:marble (day6 at L1): 2 decoys on the shelf (ph-meat, n.chicken*, veg-12*, veg-03; * not in the order), the table wants 1
- contract-37 at cook:day6@1280x665 (kind-swipe): cook:station7:marble (day6 at L1): 3 decoys on the shelf (veg-01, ph-chana*, ph-amli*, ph-sev*; * not in the order), the table wants 1
- contract-37 at cook:day6@1280x665 (kind-swipe): cook:station9:pantry (day6 at L1): 3 decoys on the shelf (cook-paani*, spi-02*, ph-dahi*; * not in the order), the table wants 1
- contract-71 at cook:day6@1280x665 (day-summary): cook-paani went in again with no row on the card wanting it (a second tap adds nothing)
- contract-78 at cook:day6@1280x665 (day-summary): the call "Samosa hane kadh." starts and the light comes 3832 ms later (more than 200 ms)
- contract-101 at cook:day6@1280x665 (after help-open): Nani's box in cook:station6:marble never showed its drop-down (.ng-arrow) while the station played
- contract-104 at cook:day6@1280x665 (kind-swipe): the item card "ba samosa" has no picture
- contract-108 at cook:day6@1280x665 (day-summary): "Shabash!" was said with 4 card rows still open ("paani", "chai", "dudh"): well done once the whole card is ticked
- contract-109 at cook:day6@1280x665 (help-open): the shelf item ph-chana stands 131 px off the base line (511 px): one line for every item
- contract-111 at cook:day6@1280x665 (after kind-slice): the shelf item veg-01: a tap at its picture's left edge (611, 602) picks word ph-keema (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-119 at cook:day6@1280x665 (after view-pantry): the customer said the dish ("Muke sekelo khape,") at level 1 and its card never flashed up beside their bubble
- contract-128 at cook:day6@1280x665 (kind-swipe): the dish's flashing card shows an empty picture box for 975 ms: the card is whole
- contract-112 at cook:day6@1280x665 (kind-slice): light 8 [524,72,1256,428]: the light frames a region round veg-01 [757,210,869,305], not the thing: left 233 px, top 138 px, right 387 px, bottom 123 px of room (the pad is 10) (picture: build/screens
- contract-114 at cook:day6@1280x665 (after help-open): chop4-bataato-whole at [757,210,869,305] is swapped in one frame for chop4-bataato-whole at [757,525,869,620] (316 px away, 113 to 113 px): no glide, no fade
- contract-114 at cook:day6@1280x665 (day-summary): sv3-fold-done-3 rests at 71 px at [1119,261,1196,331], -83% of its 408 px at its last place [511,100,919,290] (sv3-fold-strip#flat): an item keeps its size from step to step

**cook:eggs** (14)
- contract-119 at cook:eggs@1280x665 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card never flashed up beside their bubble
- contract-37 at cook:eggs@L2@1280x665 (after kind-click): cook:station1:marble (eggs at L2): 3 decoys on the shelf (n.egg*, cook-atto*, cook-dudh*; * not in the order), the table wants 2
- contract-37 at cook:eggs@L3@1280x665 (after kind-click): cook:station1:marble (eggs at L3): 5 decoys on the shelf (n.egg, spi-16*, spi-11*, cook-khun*, cook-atto*, cook-chai*; * not in the order), the table wants 3
- contract-37 at cook:eggs@L4@1280x665 (view-marble): cook:station1:marble (eggs at L4): 3 decoys on the shelf (spi-16, spi-11, cook-khun*, cook-chai*, cook-dudh*; * not in the order), the table wants 4
- contract-70 at cook:eggs@L4@1280x665 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-114 at cook:eggs@L4@1280x665 (view-service): eg-friedEgg-cooked rests at 80 px at [1145,164,1224,243], +83% of its 44 px at its last place [772,154,815,197] (eg-friedEgg-cooked): an item keeps its size from step to step
- contract-119 at cook:eggs#mistake@1280x665 (after start): the customer said the dish ("Muke hakro tarelo indo khapeto.") at level 1 and its card never flashed up beside their bubble
- contract-70 at cook:eggs@L2#mistake@1280x665 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-37 at cook:eggs#hint@1280x665 (after order-card-big): cook:station1:marble (eggs at L1): 2 decoys on the shelf (n.egg*, cook-dudh*; * not in the order), the table wants 1
- contract-78 at cook:eggs#hint@1280x665 (view-service): the call "Indo wiji chad!" starts and the light comes 789 ms later (more than 200 ms)
- contract-119 at cook:eggs#hint@1280x665 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card never flashed up beside their bubble
- contract-70 at cook:eggs@L3#hint@1280x665 (view-service): the heat ring entered its green (0.72-1) and no call was said by 0.90 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-112 at cook:eggs@L3#hint@1280x665 (hint-nani-says): light 6 [486,136,564,212]: not a rounded rectangle: corners too round (corners 27 px on a box 76 px high, at most a quarter: 19 px) (picture: build/screenshots/sandbox/tiers-publish-934f5fafe9/lights/
- contract-119 at cook:eggs#takeback@1280x665 (after start): the customer said the dish ("Muke hakro bafelo indo khapeto.") at level 1 and its card never flashed up beside their bubble

**cook:fetch** (8)
- contract-92 at cook:fetch@L2@1280x665 (view-pantry): the light round cook-chai leaves 2 px on its top with nothing beside it: at least 6 px
- contract-112 at cook:fetch@L2@1280x665 (view-pantry): light 4 [654,296,752,414]: cook-chai [666,300,740,409] (its picture, pill and face) is not inside the light with its pad: top 4 px (wants 9) (picture: build/screenshots/sandbox/tiers-publish-934f5fafe
- contract-3 at cook:fetch#mistake@1280x665 (after help-open): "hakro khun" (assets/audio/family/mum/shabash-rc.mp3, 0.74 s) started 1282 ms after 1709 ms past the end of cook:station1:pantry (into cook:between1:pantry); it stopped by stop
- contract-22 at cook:fetch#mistake@1280x665 (wrong-choice): cook:station1:pantry: "Muke rai de." said twice, 1306 ms apart (a line is said once; again only after 10 s idle)
- contract-92 at cook:fetch#mistake@1280x665 (order-card-in-sidebar): the light round cook-daal leaves 5 px on its top with nothing beside it: at least 6 px
- contract-112 at cook:fetch@L2#mistake@1280x665 (view-pantry): light 4 [508,410,624,534]: veg-03 [521,421,612,531] (its picture, pill and face) is not inside the light with its pad: bottom 3 px (wants 10) (picture: build/screenshots/sandbox/tiers-publish-934f5faf
- contract-92 at cook:fetch@L3#hint@1280x665 (hint-glow): the light round cook-dudh covers its neighbour ph-dahi: it should stop short of it
- contract-111 at lab:cook/fetch@L2@1280x665 (fetch-order-card-in-sidebar): the shelf item ph-keema: a tap at its picture's right edge (1168, 466) picks word ph-dahi (the item takes its picture, its slot down to its pill and the pill but its speaker)

**cook:fill** (10)
- contract-36 at cook:fill@1280x665 (order-card-in-sidebar): a step opened on screen (the light on ph-keema) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-36 at cook:fill@1280x665 (kind-swipe): a step opened on screen (the light on sv3-board) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-105 at cook:fill@1280x665 (kind-swipe): the light [594,229,808,443] is round 39% of sv3-board [594,201,1032,466] (middle off by 26%, 1% of its size): it should sit whole round it
- contract-109 at cook:fill@1280x665 (order-card-in-sidebar): the shelf item veg-12 stands -96 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-113 at cook:fill@1280x665 (after kind-swipe): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-114 at cook:fill@1280x665 (kind-swipe): spr:chaat-bowl.empty rests at 178 px at [404,199,581,373], -40% of its 296 px at its last place [667,170,962,460] (spr:chaat-bowl.empty): an item keeps its size from step to step
- contract-114 at cook:fill@1280x665 (kind-swipe): layer:ph-keema rests at 32 px at [448,282,480,303], -40% of its 53 px at its last place [740,308,793,343] (layer:ph-keema): an item keeps its size from step to step
- contract-114 at cook:fill@1280x665 (kind-swipe): layer:ph-keema rests at 32 px at [501,313,532,334], -40% of its 53 px at its last place [828,361,880,396] (layer:ph-keema): an item keeps its size from step to step
- contract-114 at cook:fill@1280x665 (kind-click): sv3-fold-6 rests at 178 px at [1050,498,1228,553], -55% of its 400 px at its last place [613,274,1013,398] (sv3-fold-6): an item keeps its size from step to step
- contract-115 at cook:fill@1280x665 (view-marble): cook:station1:marble: the shelf item veg-12 (spr:veg-12.bowl, class S) stands 70 px, 85% of chai's S height at 1280x665 (83 px): one height per size class, within 10%

**cook:flip** (5)
- contract-119 at cook:flip@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:flip@1280x665 (kind-click): chapati-burnt stands on the worktop (172x169 at 368,746, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:flip@1280x665 (after kind-timing): chapati-puffed stands on the worktop (190x188 at 353,730, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-114 at cook:flip@1280x665 (kind-click): chapati-burnt rests at 95 px at [510,526,611,625], -29% of its 133 px at its last place [913,294,1046,424] (chapati-burnt): an item keeps its size from step to step
- contract-114 at cook:flip@1280x665 (after kind-timing): chapati-puffed rests at 95 px at [497,511,608,621], -29% of its 133 px at its last place [913,294,1046,424] (chapati-puffed): an item keeps its size from step to step

**cook:fry** (5)
- contract-70 at cook:fry@1280x665 (after kind-tap): the heat ring entered its green (0.62-0.84) and no call was said by 0.80 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-77 at cook:fry@1280x665 (after kind-tap): a new player's first timed window: the ring went on past the middle of its green (0.73, at 0.759) before the tap (the first-time hold waits in the green until the child acts)
- contract-119 at cook:fry@1280x665 (after start): the customer said the dish ("Muke trae samosa khapanta.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:fry@1280x665 (after order-card-big): spr@pastry:3 stands on the worktop (119x106 at 998,728, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-113 at cook:fry@1280x665 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (56% of it, at [1195,8,1272,46]): nothing covers a face, a pill or a card's words

**cook:grill** (1)
- contract-36 at cook:grill@1280x665 (order-card-in-sidebar): a step opened on screen (the light on mk:stick:v4) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)

**cook:maani** (1)
- contract-119 at cook:maani@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card never flashed up beside their bubble

**cook:maani-line** (9)
- contract-119 at cook:maani-line@1280x665 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card flashed only 124 ms beside their bubble
- contract-96 at cook:maani-line@L4@1280x665 (view-service): a pot boiled over and emptied, and 2 cards stayed ticked for 1500 ms (its rows open again)
- contract-119 at cook:maani-line#mistake@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card flashed only 79 ms beside their bubble
- contract-36 at cook:maani-line#hint@1280x665 (hint-nani-says): a step opened on screen (the light on njg-tray@1504x260@75@art) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-119 at cook:maani-line#hint@1280x665 (after start): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card never flashed up beside their bubble
- contract-36 at cook:maani-line@L3#hint@1280x665 (hint-glow): a step opened on screen (the light on njg-tray@1504x260@75@art) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-119 at cook:maani-line#returning@1280x665 (after start): the customer said the dish ("Muke ba maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-119 at cook:maani-line#takeback@1280x665 (after start): the customer said the dish ("Muke ba bajr ji maani khapeti.") at level 1 and its card flashed only 101 ms beside their bubble
- contract-119 at lab:cook/maani-line@1280x665 (after maani-line-start): the customer said the dish ("Muke hakri maani khapeti,") at level 1 and its card never flashed up beside their bubble

**cook:mishkaki-grill** (1)
- contract-119 at cook:mishkaki-grill#returning@1280x665 (after start): the customer said the dish ("Muke sekelo khape,") at level 1 and its card flashed only 181 ms beside their bubble

**cook:open-kitchen** (10)
- contract-1 at cook:open-kitchen@1280x665 (after kind-timing): cook:station5:marble: the request pop-up was not read out (no line while it was up)
- contract-37 at cook:open-kitchen@1280x665 (close-kitchen): cook:station5:marble (open-kitchen at L1): 3 decoys on the shelf (ph-dahi*, ph-chana*, veg-01, ph-dhana*; * not in the order), the table wants 1
- contract-74 at cook:open-kitchen@1280x665 (after order-card-big): the station started 1859 ms after the tap during the order (within 1 s)
- contract-100 at cook:open-kitchen@1280x665 (after kind-timing): an old order-card piece on screen: .oc-item (only the 6 Nov item cards, no count box, strip, skewer or group box)
- contract-101 at cook:open-kitchen@1280x665 (after kind-timing): Nani's box in cook:station4:marble never showed its drop-down (.ng-arrow) while the station played
- contract-119 at cook:open-kitchen@1280x665 (after results-words): the customer said the dish ("Muke hakri bajr ji maani khapeti,") at level 1 and its card flashed only 145 ms beside their bubble
- contract-114 at cook:open-kitchen@1280x665 (kind-timing): mv-raw-bajr rests at 172 px at [875,126,1047,294], -18% of its 210 px at its last place [543,148,753,353] (mv-raw-bajr): an item keeps its size from step to step
- contract-114 at cook:open-kitchen@1280x665 (close-kitchen): mv-cooked-bajr rests at 99 px at [839,525,950,634], -42% of its 172 px at its last place [875,126,1047,294] (mv-cooked-bajr): an item keeps its size from step to step
- contract-114 at cook:open-kitchen@1280x665 (close-kitchen): mv-raw-maani rests at 172 px at [875,126,1047,294], -18% of its 210 px at its last place [543,148,753,353] (mv-raw-maani): an item keeps its size from step to step
- contract-114 at cook:open-kitchen@1280x665 (close-kitchen): mv-cooked-maani rests at 99 px at [979,529,1081,630], -42% of its 172 px at its last place [875,126,1047,294] (mv-cooked-maani): an item keeps its size from step to step

**cook:pour** (1)
- contract-104 at cook:pour@1280x665 (after start): the item card "paani" has no picture

**cook:recipe:samosa** (1)
- contract-114 at cook:recipe:samosa@1280x665 (kind-swipe): sv3-heap-ph-keema at [764,138,806,179] is swapped in one frame for sv3-heap-ph-keema at [850,539,882,572] (405 px away, 42 to 33 px): no glide, no fade

**cook:roll** (7)
- contract-119 at cook:roll@1280x665 (after start): the customer said the dish ("Muke trae maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:roll@1280x665 (help-open): mv-ball-maani stands on the worktop (137x136 at 230,760, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:roll@1280x665 (help-open): mv-raw-maani stands on the worktop (261x256 at 1330,700, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-113 at cook:roll@1280x665 (after kind-roll): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:roll@1280x665 (after kind-tap): the word pill ba is under the page's button#side-cog.rail-btn.side-cog (56% of it, at [1195,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-114 at cook:roll@1280x665 (after kind-roll): mv-raw-maani at [691,283,912,499] is swapped in one frame for mv-raw-maani at [1046,474,1199,623] (358 px away, 221 to 153 px): no glide, no fade
- contract-114 at cook:roll@1280x665 (after kind-roll): mv-raw-maani rests at 153 px at [1046,474,1199,623], -31% of its 221 px at its last place [691,283,912,499] (mv-raw-maani): an item keeps its size from step to step

**cook:roll-tawa** (8)
- contract-119 at cook:roll-tawa@1280x665 (after start): the customer said the dish ("Muke char maani khapeti.") at level 1 and its card never flashed up beside their bubble
- contract-120 at cook:roll-tawa@1280x665 (kind-tap): dough-ball stands on the worktop (98x97 at 351,743, depth 30) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:roll-tawa@1280x665 (help-open): chapati-burnt stands on the worktop (171x168 at 1039,719, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-120 at cook:roll-tawa@1280x665 (help-open): chapati-puffed stands on the worktop (166x163 at 1038,703, depth 32) with no soft shadow of its own (SH-268: one light, upper left)
- contract-114 at cook:roll-tawa@1280x665 (kind-timing): chapati-burnt rests at 95 px at [903,511,1003,609], -29% of its 133 px at its last place [887,169,1020,299] (chapati-burnt): an item keeps its size from step to step
- contract-114 at cook:roll-tawa@1280x665 (help-open): chapati-puffed rests at 95 px at [904,503,1001,598], -29% of its 133 px at its last place [887,169,1019,299] (chapati-puffed): an item keeps its size from step to step
- contract-114 at cook:roll-tawa@1280x665 (kind-click): chapati-puffed rests at 95 px at [902,495,997,588], -29% of its 133 px at its last place [887,169,1019,299] (chapati-puffed): an item keeps its size from step to step
- contract-114 at cook:roll-tawa@1280x665 (after help-open): chapati-puffed rests at 95 px at [902,482,1005,582], -29% of its 133 px at its last place [887,169,1019,299] (chapati-puffed): an item keeps its size from step to step

**cook:samosa** (7)
- contract-37 at cook:samosa@L4@1280x665 (view-marble): cook:station1:marble (samosa at L4): 3 decoys on the shelf (ph-dhana, veg-10*, ph-keema, veg-02*, veg-01, veg-12*; * not in the order), the table wants at least 4
- contract-78 at cook:samosa#mistake@1280x665 (view-service): the call "Samosa hane kadh." starts and no light comes with it
- contract-92 at cook:samosa#hint@1280x665 (hint-nani-says): the light round veg-01 covers its neighbour veg-12: it should stop short of it
- contract-78 at cook:samosa@L3#hint@1280x665 (kind-timing): the call "Samosa hane kadh." starts and the light comes 245 ms later (more than 200 ms)
- contract-78 at lab:cook/samosa@1280x665 (samosa-kind-timing): the call "Samosa hane kadh." starts and no light comes with it
- contract-37 at lab:cook/samosa@L4@1280x665 (samosa-view-marble): host:cook/samosa|cook:station1:marble (samosa at L4): 3 decoys on the shelf (veg-12, ph-dhana*, veg-01, ph-keema, veg-10*, veg-02*; * not in the order), the table wants at least 4
- contract-70 at lab:cook/samosa@L4@1280x665 (samosa-view-service): the heat ring entered its green (0.68-0.8) and no call was said by 0.86 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)

**cook:stir** (47)
- contract-78 at cook:stir@1280x665 (order-card-in-sidebar): the call "Char!" starts and the light comes 986 ms later (more than 200 ms)
- contract-78 at cook:stir@1280x665 (order-card-in-sidebar): the call "jaldi" starts and the light comes 796 ms later (more than 200 ms)
- contract-89 at cook:stir@1280x665 (order-card-in-sidebar): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-112 at cook:stir@1280x665 (order-card-in-sidebar): light 1 [732,162,890,320]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10), bottom 3 px
- contract-78 at cook:stir@L3@1280x665 (view-marble): the call "Ba!" starts and no light comes with it
- contract-89 at cook:stir@L3@1280x665 (view-marble): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L3@1280x665 (view-marble): "Ba!" was said 680 ms after the order was skipped, before the game's first step
- contract-78 at cook:stir@L2@1280x665 (view-marble): the call "Char!" starts and the light comes 934 ms later (more than 200 ms)
- contract-78 at cook:stir@L2@1280x665 (view-marble): the call "aste thi" starts and the light comes 671 ms later (more than 200 ms)
- contract-89 at cook:stir@L2@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L2@1280x665 (view-marble): "Char!" was said 544 ms after the order was skipped, before the game's first step
- contract-112 at cook:stir@L2@1280x665 (view-marble): light 4 [732,162,890,320]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10), bottom 3 px
- contract-78 at cook:stir@L4@1280x665 (view-marble): the call "Char!" starts and no light comes with it
- contract-78 at cook:stir@L4@1280x665 (view-marble): the call "aste thi" starts and no light comes with it
- contract-89 at cook:stir@L4@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L4@1280x665 (view-marble): "Char!" was said 608 ms after the order was skipped, before the game's first step
- contract-78 at cook:stir#mistake@1280x665 (after order-card-big): the call "Ba!" starts and the light comes 942 ms later (more than 200 ms)
- contract-89 at cook:stir#mistake@1280x665 (after order-card-big): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir#mistake@1280x665 (after order-card-big): "Ba!" was said 456 ms after the order was skipped, before the game's first step
- contract-112 at cook:stir#mistake@1280x665 (order-card-in-sidebar): light 1 [732,162,890,324]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10) (picture: bu
- contract-78 at cook:stir@L2#mistake@1280x665 (view-marble): the call "Char!" starts and the light comes 966 ms later (more than 200 ms)
- contract-78 at cook:stir@L2#mistake@1280x665 (view-marble): the call "jaldi" starts and the light comes 733 ms later (more than 200 ms)
- contract-89 at cook:stir@L2#mistake@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L2#mistake@1280x665 (view-marble): "Char!" was said 622 ms after the order was skipped, before the game's first step
- contract-112 at cook:stir@L2#mistake@1280x665 (view-marble): light 4 [732,162,890,320]: dv4-c-daar [735,164,888,317] (its picture, pill and face) is not inside the light with its pad: left 3 px (wants 10), top 2 px (wants 10), right 2 px (wants 10), bottom 3 px
- contract-78 at cook:stir#hint@1280x665 (order-card-in-sidebar): the call "Trae!" starts and no light comes with it
- contract-89 at cook:stir#hint@1280x665 (order-card-in-sidebar): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir#hint@1280x665 (order-card-in-sidebar): "Trae!" was said 623 ms after the order was skipped, before the game's first step
- contract-66 at cook:stir@L3#hint@1280x665 (view-service): lap 4's number was left out (quiet) though no other line was sounding
- contract-78 at cook:stir@L3#hint@1280x665 (view-marble): the call "Char!" starts and no light comes with it
- contract-78 at cook:stir@L3#hint@1280x665 (view-marble): the call "aste thi" starts and no light comes with it
- contract-89 at cook:stir@L3#hint@1280x665 (view-marble): "Char!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir@L3#hint@1280x665 (view-marble): "Char!" was said 775 ms after the order was skipped, before the game's first step
- contract-89 at cook:stir#takeback@1280x665 (after order-card-big): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at cook:stir#takeback@1280x665 (after order-card-big): "Trae!" was said 416 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@1280x665 (after stir-order-card-big): the call "Trae!" starts and no light comes with it
- contract-89 at lab:cook/stir@1280x665 (after stir-order-card-big): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@1280x665 (after stir-order-card-big): "Trae!" was said 428 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@L2@1280x665 (after stir-kind-click): the call "Ba!" starts and no light comes with it
- contract-89 at lab:cook/stir@L2@1280x665 (after stir-kind-click): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@L2@1280x665 (after stir-kind-click): "Ba!" was said 277 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@L3@1280x665 (stir-view-marble): the call "Trae!" starts and no light comes with it
- contract-89 at lab:cook/stir@L3@1280x665 (stir-view-marble): "Trae!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@L3@1280x665 (stir-view-marble): "Trae!" was said 844 ms after the order was skipped, before the game's first step
- contract-78 at lab:cook/stir@L4@1280x665 (stir-view-marble): the call "Ba!" starts and no light comes with it
- contract-89 at lab:cook/stir@L4@1280x665 (stir-view-marble): "Ba!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-95 at lab:cook/stir@L4@1280x665 (stir-view-marble): "Ba!" was said 672 ms after the order was skipped, before the game's first step

**cook:tadka** (35)
- contract-36 at cook:tadka@1280x665 (order-card-in-sidebar): a step opened on screen (the light on spi-01) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (spi-16*, veg-13*, spi-05*, veg-12, spi-01, spi-02*; * not in the order), the table wants 1
- contract-113 at cook:tadka@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-36 at cook:tadka@L2@1280x665 (view-hob): a step opened on screen (the light on veg-12) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka@L2@1280x665 (after kind-click): cook:station1:hob (tadka at L2): 4 decoys on the shelf (veg-12, spi-01*, spi-02, spi-16*, spi-05*, veg-13*; * not in the order), the table wants 2
- contract-113 at cook:tadka@L2@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka@L2@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka@L3@1280x665 (view-hob): cook:station1:hob (tadka at L3): 6 decoys on the shelf (spi-04*, spi-01*, veg-12, spi-16*, veg-13*, spi-05*, spi-02, spi-10*; * not in the order), the table wants 3
- contract-113 at cook:tadka@L3@1280x665 (after kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka@L4@1280x665 (view-hob): cook:station1:hob (tadka at L4): 6 decoys on the shelf (spi-16*, spi-05*, veg-13, spi-10*, veg-12*, spi-02*, spi-04*, spi-01; * not in the order), the table wants 4
- contract-113 at cook:tadka@L4@1280x665 (after kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-36 at cook:tadka#mistake@1280x665 (order-card-in-sidebar): a step opened on screen (the light on spi-05) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-36 at cook:tadka#mistake@1280x665 (view-service): a step opened on screen (the light on veg-13) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka#mistake@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (spi-05, veg-13, spi-01*, spi-02*, spi-16*, veg-12*; * not in the order), the table wants 1
- contract-113 at cook:tadka#mistake@1280x665 (after wrong-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka#mistake@1280x665 (after wrong-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-36 at cook:tadka@L2#mistake@1280x665 (view-hob): a step opened on screen (the light on veg-12) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-37 at cook:tadka@L2#mistake@1280x665 (view-hob): cook:station1:hob (tadka at L2): 4 decoys on the shelf (spi-16*, spi-01*, spi-02*, spi-05, veg-13*; * not in the order), the table wants 2
- contract-113 at cook:tadka@L2#mistake@1280x665 (after wrong-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka@L2#mistake@1280x665 (after wrong-tap): the word pill hakrohakrohakro is under the page's button#side-cog.rail-btn.side-cog (13% of it, at [932,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka#hint@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (spi-02*, veg-12, spi-05*, spi-16*, veg-13*, spi-01; * not in the order), the table wants 1
- contract-113 at cook:tadka#hint@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka@L3#hint@1280x665 (view-hob): cook:station1:hob (tadka at L3): 6 decoys on the shelf (spi-10*, spi-05*, spi-04*, veg-12*, spi-01, veg-13*, spi-02*, spi-16; * not in the order), the table wants 3
- contract-113 at cook:tadka@L3#hint@1280x665 (after kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at cook:tadka#takeback@1280x665 (order-card-in-sidebar): cook:station1:hob (tadka at L1): 4 decoys on the shelf (veg-12, veg-13*, spi-02, spi-16*, spi-01*, spi-05*; * not in the order), the table wants 1
- contract-113 at cook:tadka#takeback@1280x665 (after kind-tap): the word pill hakro is under the page's button#side-cog.rail-btn.side-cog (40% of it, at [1164,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-113 at cook:tadka#takeback@1280x665 (after kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at lab:cook/tadka@1280x665 (tadka-order-card-in-sidebar): host:cook/tadka|cook:station1:hob (tadka at L1): 4 decoys on the shelf (veg-13*, spi-16*, veg-12*, spi-02, spi-01*, spi-05; * not in the order), the table wants 1
- contract-37 at lab:cook/tadka@L2@1280x665 (tadka-view-hob): host:cook/tadka|cook:station1:hob (tadka at L2): 4 decoys on the shelf (spi-05*, veg-13*, spi-02*, spi-16, spi-01*, veg-12; * not in the order), the table wants 2
- contract-113 at lab:cook/tadka@L2@1280x665 (after tadka-kind-tap): the word pill hakrohakro is under the page's button#side-cog.rail-btn.side-cog (19% of it, at [1048,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at lab:cook/tadka@L3@1280x665 (tadka-view-hob): host:cook/tadka|cook:station1:hob (tadka at L3): 6 decoys on the shelf (spi-05*, spi-01, spi-16*, spi-10*, veg-12, veg-13*, spi-04*, spi-02*; * not in the order), the table wants 3
- contract-113 at lab:cook/tadka@L3@1280x665 (after tadka-kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words
- contract-37 at lab:cook/tadka@L4@1280x665 (tadka-view-hob): host:cook/tadka|cook:station1:hob (tadka at L4): 6 decoys on the shelf (veg-12, spi-10*, spi-16*, spi-05*, spi-02*, spi-01*, veg-13, spi-04*; * not in the order), the table wants 4
- contract-113 at lab:cook/tadka@L4@1280x665 (after tadka-kind-tap): the word pill ●● is under the page's button#side-cog.rail-btn.side-cog (28% of it, at [1121,8,1272,46]): nothing covers a face, a pill or a card's words

**cook:thread** (2)
- contract-36 at cook:thread@1280x665 (order-card-in-sidebar): a step opened on screen (the light on veg-02) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)
- contract-95 at cook:thread@1280x665 (kind-click): "dungri" was said 6140 ms after the order was skipped, before the game's first step

**day:full-farm** (2)
- contract-112 at day:full-farm@1280x665 (find-find): light 2 [862,266,1056,476]: 2 lit regions, not one: [862,266,1056,476] [966,156,1020,210]; the dim is darker than chai's: 0.83 of the way to the dim's colour against chai's 0.45 (within 0.08); it ligh
- contract-112 at day:full-farm@1280x665 (find-nameit): light 3 [800,340,920,460]: the dim is darker than chai's: 0.83 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card is 

**day:full-kitchen** (2)
- contract-112 at day:full-kitchen@1280x665 (door-lines-and-yes): light 1 [1036,520,1148,592]: the dim is darker than chai's: 0.78 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights nothing: no picture with its pill, no picture and no card i
- contract-112 at day:full-kitchen@1280x665 (find-find): light 2 [236,266,434,476]: 2 lit regions, not one: [236,266,434,476] [136,342,212,400]; the dim is darker than chai's: 0.83 of the way to the dim's colour against chai's 0.45 (within 0.08); it lights 

**first** (9)
- contract-39 at first@1280x665 (after pantry-round-view-service): the word card for cook-chai (stage 1) shows its English "chai" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for cook-chai (stage 1) shows its English "chai" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the word card for cook-dudh (stage 1) shows its English "milk" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for cook-dudh (stage 1) shows its English "milk" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for cook-khun (stage 1) shows its English "sugar" without the child tapping it open
- contract-39 at first@1280x665 (after pantry-round-order-card-big): the order card's row for spi-10 (stage 1) shows its English "cardamom" without the child tapping it open
- contract-39 at first@1280x665 (after chai-round-order-card-big): the word card for cook-khun (stage 2) shows its English "one sugar" without the child tapping it open
- contract-39 at first@1280x665 (after chai-round-order-card-big): the order card's row for cook-paani (stage 1) shows its English "water" without the child tapping it open
- contract-92 at first@1280x665 (pantry-round-kind-click): the light round cook-dudh leaves 0 px on its top with nothing beside it: at least 6 px

**lab:cook/recipe-chaat** (4)
- contract-26 at lab:cook/recipe-chaat@L2@1280x665 (after recipe-chaat-kind-slice): the opening line "Pela chano." was not heard whole: chano had no sound (no clip played and the device voice did not say it)
- contract-37 at lab:cook/recipe-chaat@L2@1280x665 (recipe-chaat-kind-tap): host:cook/recipe-chaat|cook:station2:marble (chaat at L2): 1 decoy on the shelf (ph-sev, veg-02, ph-chana, veg-01, veg-12, veg-03*; * not in the order), the table wants 2
- contract-37 at lab:cook/recipe-chaat@L3@1280x665 (recipe-chaat-kind-tap): host:cook/recipe-chaat|cook:station2:marble (chaat at L3): 2 decoys on the shelf (veg-12, ph-dhana, ph-amli*, ph-sev*, veg-01, ph-dahi, ph-chana; * not in the order), the table wants 3
- contract-37 at lab:cook/recipe-chaat@L4@1280x665 (recipe-chaat-kind-tap): host:cook/recipe-chaat|cook:station2:marble (chaat at L4): 3 decoys on the shelf (ph-lili, ph-chana, ph-amli, ph-dhana*, ph-sev, ph-dahi*, veg-12, veg-02*, veg-01; * not in the order), the table wants

**lab:cook/recipe-daal** (2)
- contract-112 at lab:cook/recipe-daal@1280x665 (recipe-daal-order-card-in-sidebar): light 1 [524,72,1256,428]: the light frames a region round veg-02 [768,206,857,308], not the thing: left 244 px, top 134 px, right 399 px, bottom 120 px of room (the pad is 10); lit while chop4-knife 
- contract-112 at lab:cook/recipe-daal@L4@1280x665 (recipe-daal-view-marble): light 4 [524,72,1256,428]: the light frames a region round veg-02 [813,206,902,308], not the thing: left 289 px, top 134 px, right 354 px, bottom 120 px of room (the pad is 10); lit while chop4-knife 

**lab:cook/recipe-maani** (1)
- contract-119 at lab:cook/recipe-maani@1280x665 (after recipe-maani-start): the customer said the dish ("Muke ba bajr ji maani khapeti.") at level 1 and its card flashed only 113 ms beside their bubble

**lab:cook/recipe-samosa** (3)
- contract-37 at lab:cook/recipe-samosa@L3@1280x665 (recipe-samosa-view-marble): host:cook/recipe-samosa|cook:station1:marble (samosa at L3): 2 decoys on the shelf (veg-12, veg-01, veg-02*, veg-10, ph-dhana*, ph-keema; * not in the order), the table wants at least 3
- contract-78 at lab:cook/recipe-samosa@L3@1280x665 (recipe-samosa-kind-timing): the call "Chulo bar!" starts and the light comes 286 ms later (more than 200 ms)
- contract-37 at lab:cook/recipe-samosa@L4@1280x665 (after recipe-samosa-kind-click): host:cook/recipe-samosa|cook:station1:marble (samosa at L4): 3 decoys on the shelf (ph-dhana, ph-keema, veg-10*, veg-01, veg-12*, veg-02*; * not in the order), the table wants at least 4

**lab:cook/round** (12)
- contract-37 at lab:cook/round@1280x665 (after pantry-order-card-big): host:cook/pantry|cook:station1:pantry (round at L1): 2 decoys on the shelf (cook-dudh, cook-khun, spi-05*, ph-dahi*; * not in the order), the table wants 1
- contract-109 at lab:cook/round@1280x665 (after pantry-order-card-big): the pill under cook-dudh sits -3 px off the chip line (518 px): one line for every pill
- contract-112 at lab:cook/round@1280x665 (order-order-card-in-sidebar): light 2 [544,494,630,664]: it lights nothing: no picture with its pill, no picture and no card is in [544,494,630,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build
- contract-37 at lab:cook/round@L2@1280x665 (after pantry-kind-click): host:cook/pantry|cook:station1:pantry (round at L2): 3 decoys on the shelf (cook-chai, cook-dudh, spi-10, ph-chana*, spi-05*, fru-05*; * not in the order), the table wants 2
- contract-109 at lab:cook/round@L2@1280x665 (after pantry-kind-click): the pill under cook-dudh sits -3 px off the chip line (518 px): one line for every pill
- contract-112 at lab:cook/round@L2@1280x665 (order-order-card-in-sidebar): light 5 [444,494,528,664]: it lights nothing: no picture with its pill, no picture and no card is in [444,494,528,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build
- contract-37 at lab:cook/round@L3@1280x665 (after pantry-order-card-big): host:cook/pantry|cook:station1:pantry (round at L3): 4 decoys on the shelf (cook-khun, veg-03*, spi-02*, ph-amli*, spi-05*; * not in the order), the table wants 3
- contract-112 at lab:cook/round@L3@1280x665 (order-order-card-in-sidebar): light 4 [424,494,510,664]: it lights nothing: no picture with its pill, no picture and no card is in [424,494,510,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build
- contract-37 at lab:cook/round@L4@1280x665 (pantry-order-card-in-sidebar): host:cook/pantry|cook:station1:pantry (round at L4): 7 decoys on the shelf (veg-02*, veg-03*, spi-05*, cook-atto*, ph-dahi*, spi-04*, ph-keema*; * not in the order), the table wants 4
- contract-109 at lab:cook/round@L4@1280x665 (pantry-order-card-in-sidebar): the pill under ph-dahi sits -3 px off the chip line (518 px): one line for every pill
- contract-111 at lab:cook/round@L4@1280x665 (pantry-order-card-in-sidebar): the shelf item ph-dahi: a tap at its picture's right edge (1168, 463) picks word ph-keema (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-112 at lab:cook/round@L4@1280x665 (order-order-card-in-sidebar): light 4 [380,494,466,664]: it lights nothing: no picture with its pill, no picture and no card is in [380,494,466,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build

**lab:cook/story-birthday** (3)
- contract-109 at lab:cook/story-birthday@1280x665 (pantry-order-card-in-sidebar): the pill under ph-dahi sits -3 px off the chip line (518 px): one line for every pill
- contract-109 at lab:cook/story-birthday@1280x665 (pantry-order-card-in-sidebar): the shelf item spi-10 stands -109 px off chai's base line (621 px at 1280x665): one line for every shelf
- contract-112 at lab:cook/story-birthday@1280x665 (order-order-card-in-sidebar): light 2 [544,494,630,664]: it lights nothing: no picture with its pill, no picture and no card is in [544,494,630,664]; cut by the frame at the bottom: its thing is 1 px from that edge (picture: build

**mode:dress** (2)
- contract-41 at mode:dress@1280x665 (after title): a pop-up of the game's own (#intro.) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:dress@1280x665 (after title): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card

**mode:find** (4)
- contract-34 at mode:find@1280x665 (after kind-click): ?: button#find-done.btn.primary "✓" is not the kit's button (.njg-btn)
- contract-26 at mode:find@1280x665 (list-in-sidebar): the opening line "Muke hakro anjir khape." was not heard whole: hakro, anjir had no sound (no clip played and the device voice did not say it)
- contract-41 at mode:find@1280x665 (after kind-click): a pop-up of the game's own (#intro.njg-rq-open.going) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:find@1280x665 (after kind-click): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card

**mode:snap** (3)
- contract-41 at mode:snap@1280x665 (after title): a pop-up of the game's own (#intro.njg-rq-open) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:snap@1280x665 (after title): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:snap@1280x665 (after title): a pop-up of the game's own (#intro.njg-rq-open.going) on screen: the order pop-up is the kit's .njg-rq-card

**mode:tidy** (4)
- contract-34 at mode:tidy@1280x665 (after intro): ?: button#btn-done.rail-btn.done is not the kit's button (.njg-btn)
- contract-34 at mode:tidy@1280x665 (after speak): ?: button.go "✓" is not the kit's button (.njg-btn)
- contract-41 at mode:tidy@1280x665 (start): a pop-up of the game's own (#intro.) on screen: the order pop-up is the kit's .njg-rq-card
- contract-41 at mode:tidy@1280x665 (start): a pop-up of the game's own (#intro) on screen: the order pop-up is the kit's .njg-rq-card

**mode:who** (1)
- contract-34 at mode:who@1280x665 (after ui-pick): ?: button#who-next.btn.primary "▶" is not the kit's button (.njg-btn)

**(every game)** (5)
- changed at build/screenshots/tiers/publish-934f5fafe9/logs/changed.log: CONTRACT FAILED: 429 breaks (contract-39 8, contract-92 6, contract-112 57, contract-3 1, contract-22 1, contract-111 5, contract-96 2, contract-72 2, contract-119 31, contract-36 19, contract-66 2, contract-37 55, contract-65 13, contract-114 34, contract-113 24, contract-78 27, contract-89 13, contract-95 13, contract-120 10, contract-115 3, contract-70 5, contract-26 9, contract-52 3, contract-7 18, contract-91 2, contract-8 5, contract-4 5, contract-21 2, contract-104 5, contract-102 1, contract-109 14, contract-105 1, contract-77 1, contract-71 4, contract-108 4, contract-1 3, contract-128 3, contract-101 2, contract-74 1, contract-100 1, contract-30 1, contract-34 4, contract-41 9); CHECK FAILED: 525 new findings, 1 flows do not reach their end, 0 new page errors, 429 contract breaks
- frozen at build/screenshots/tiers/publish-934f5fafe9/logs/frozen.log: lab:cook/chai-tray@L3@740x320: a game note: never seen before: - -> panel-follow
- check-sprint: none since the last publish; published on his word: Yes, do 1-3 then publish (Zafar, 15 Nov, decision 43)
- fix list: 422 open rows to fix: SH-232, SH-233, SH-234, CHAI-91, CHAI-92, CHAI-93, SH-222, SH-227, SH-223, SH-224, SH-225, SH-226, ART-45, ART-46, ART-47, ART-49, ART-50, ART-51, ART-52, ART-53, SH-213, SH-214, SH-216, SH-215, CHAI-86, CHAI-87, CHAI-90, SH-219, SH-220, SH-217, CHAI-88, SH-218, CHAI-89, ART-43, ART-44, ART-42, ART-41, SH-210, SH-211, SH-212, ART-40, CHAI-84, CHAI-85, ART-39, SH-209, CHAI-83, SH-201, SH-202, SH-203, SH-204, SH-205, SH-206, SH-207, SH-208, SH-189, SH-12, SH-13, SH-62, SH-171, SH-172, SH-173, SH-175, SH-176, SH-177, SH-180, SH-182, SH-239, SH-241, SH-242, SH-230, SH-37, SH-53, SH-60, SH-228, SH-112, SH-138, SH-139, SH-140, SH-141, SH-142, SH-143, SH-144, SH-151, SH-152, SH-154, SH-155, SH-156, SH-157, SH-158, SH-159, SH-160, SH-147, SH-148, SH-149, SH-150, SH-108, SH-236, SH-237, SH-238, SH-240, SH-119, SH-244, SH-245, SH-270, SH-271, SH-272, SH-273, SH-274, SH-275, SH-276, SH-277, SH-278, SH-279, SH-280, SH-281, SH-283, SH-284, SH-285, SH-286, SH-287, SH-288, SH-289, SH-290, SH-291, SH-292, SH-293, SH-295, SH-299, SH-300, SH-301, SH-302, SH-303, SH-305, SH-306, SH-307, SH-308, SH-309, SH-310, PAN-04, PAN-13, PAN-19, PAN-21, PAN-22, PAN-23, CHAI-102, CHAI-103, CHAI-104, CHAI-95, CHAI-96, CHAI-97, CHAI-98, CHAI-99, CHAI-100, CHAI-19, CHAI-02, CHAI-34, CHAI-08, CHAI-35, CHAI-36, CHAI-38, CHAI-39, CHAI-42, CHAI-48, CHAI-49, CHAI-54, CHAI-55, CHAI-56, CHAI-57, CHAI-108, DAAR-36, DAAR-38, DAAR-39, DAAR-40, DAAR-41, DAAR-43, DAAR-44, DAAR-45, DAAR-03, DAAR-46, DAAR-47, DAAR-54, DAAR-55, DAAR-56, DAAR-57, DAAR-58, DAAR-59, DAAR-60, DAAR-61, DAAR-62, DAAR-63, DAAR-64, DAAR-65, DAAR-66, SEK-14, SEK-20, SEK-22, SEK-25, SEK-26, SEK-27, SAM-30, SAM-31, SAM-34, SAM-36, SEK-28, SEK-31, SEK-32, SAM-40, SAM-42, SAM-43, SAM-44, SAM-45, SAM-46, SAM-47, MAA-19, MAA-20, MAA-21, MAA-22, MAA-23, MAA-25, MAA-26, MAA-27, MAA-28, CHT-13, CHT-18, CHT-19, CHT-20, CHT-21, CHT-22, CK-59, CK-01, CK-45, CK-46, CK-06, CK-53, CK-54, CK-55, CK-56, CK-57, CK-61, CK-62, CK-63, CK-64, CK-68, CK-77, CK-92, CK-93, CK-96, CK-97, CK-100, CK-102, CK-103, CK-104, CK-106, CK-110, CK-111, CK-113, CK-114, CK-115, CK-116, CK-117, CK-118, CK-119, CK-120, CK-121, CK-122, CK-123, CK-124, CK-125, CK-126, CK-127, CK-128, CK-129, CK-130, CK-131, CK-132, CK-133, CK-134, CK-135, CK-136, CK-137, RT-01, RT-02, RT-03, RT-04, SH-311, SH-312, SH-313, SH-314, SH-315, SH-316, SH-317, CLN-220, CLN-221, CLN-222, CLN-82, CLN-216, CLN-217, CLN-218, CLN-156, CLN-35, CLN-52, CLN-57, CLN-99, CLN-205, CLN-206, CLN-207, CLN-210, CLN-211, CLN-213, BOOK-05, DAY-02, RIDE-11, LAB-08, FARM-01, ART-58, ART-18, ART-28, ART-29, ART-30, ART-64, LNG-20, LNG-22, SH-51, SH-63, SH-135, SH-136, SH-137, SH-64, PRC-10, PRC-11, PRC-06, PRC-12, PRC-13, PRC-14, PRC-15, PRC-16, CHAI-31, CHAI-58, CHAI-60, CHAI-61, CHAI-62, CHAI-74, CHAI-75, CHAI-76, CHAI-77, CHAI-78, CHAI-79, CHAI-80, CHAI-81, CHAI-82, CHAI-63, CHAI-64, CHAI-65, CHAI-66, CHAI-67, CHAI-68, CHAI-107, CHAI-109, CHAI-110, CHAI-111, CHAI-112, CHAI-113, CHAI-114, SH-221, SH-122, SH-19, SH-183, SH-185, SH-186, SH-187, SH-188, SH-191, SH-193, SH-194, SH-195, SH-196, SH-235, SH-248, SH-249, SH-250, SH-251, SH-252, SH-253, SH-254, SH-255, SH-256, SH-257, CK-81, CK-82, CK-83, CK-84, SH-258, SH-259, CK-85, SH-260, SH-261, SH-264, SH-265, SH-266, SH-267, SH-268, CK-86, CK-87, CK-88, CK-78, CK-79, CK-80, CK-89, CK-90, CK-91, BOOK-10, CHT-17, ART-27, ART-34, ART-35, ART-72, ART-74, ART-76, ART-77, ART-78, ART-79, ART-80
- fix list: 110 rows waiting on Mum, art or Zafar: ART-48, ART-56, ART-57, SH-70, SH-14, SH-178, SH-90, SH-91, SH-106, SH-117, SH-243, SH-246, SH-247, SH-282, SH-294, SH-296, SH-297, SH-298, SH-304, PAN-06, PAN-01, PAN-10, CHAI-37, DAAR-02, DAAR-26, DAAR-37, DAAR-48, DAAR-49, DAAR-50, DAAR-53, SEK-18, SAM-21, SAM-32, SAM-33, SAM-35, SEK-29, SAM-39, SAM-41, MAA-15, MAA-16, MAA-24, CHT-04, CK-TAB-01, CK-66, CK-67, CK-69, CK-70, CK-71, CK-98, CK-99, CK-112, CLN-87, CLN-38, CLN-65, CLN-106, CLN-107, CLN-119, CLN-137, CLN-150, CLN-163, CLN-175, CLN-179, CLN-180, CLN-219, CLN-186, CLN-192, CLN-193, CLN-196, CLN-43, MOD-10, ART-59, ART-10, ART-11, ART-12, ART-20, ART-22, ART-23, ART-32, ART-61, ART-62, ART-63, ART-65, ART-66, ART-67, ART-68, ART-69, ART-70, ART-71, LNG-01, LNG-04, LNG-06, LNG-08, LNG-10, LNG-11, LNG-12, LNG-15, LNG-21, LNG-23, LNG-24, SH-262, ART-37, ART-38, CHT-16, ART-26, ART-33, ART-36, ART-73, ART-75, ART-81, ART-82


## For the eyes
- known-fails list: build/reports/tiers/known-fails-934f5fafe9.md
- logs: build/screenshots/tiers/publish-934f5fafe9/logs
