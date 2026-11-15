# check-change (tier 2) on a75811db1c

**FAILED**, 2026-11-15T07:26:10.684Z; base 5a52815884; 84.1 min.

Games: cook:samosa (the brief's flows).
- the brief names no fix-list row: no probes to play

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: passed on a75811db1c already (2026-11-15T07:08:04.170Z); nothing to run |
| ok   | scope | the builder's files inside its owns (brief.mjs --audit) | yes | scope: all 4 files are "s20-b2-samosa: samosa joins the kitchen frame"'s own |
| note | play | the robot plays cook:samosa (14 flows: L1,L2,L3,L4, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 18 breaks (contract-70 1, contract-37 3, contract-78 8, contract-36 2, contract-92 3, contract-112 1); CHECK FAILED: 253 new findings, 0 flows  |
| note | before | the same flows on the base commit 5a52815884 (its own tree and sandbox) | reports | CONTRACT FAILED: 19 breaks (contract-78 7, contract-37 4, contract-105 1, contract-36 3, contract-92 3, contract-111 1); CHECK FAILED: 257 new findings, 0 flows |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 770 before/after pictures, 67 not paired; build/screenshots/tiers/change-a75811db1c/before-after/index.html |
| ok   | film:samosa | a first-play film: cook:samosa as a new player at 740x320, for the orchestrator to look at | reports | 08:20:27 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-a75811db1c-samosa/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | lab:cook/chai-tray@740x320: a sound: always there before, missing now: sfx/cook-right -> - |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL listeners on the page as before: window/pointerdown/true: 2 -> 3; window/resize/false: 2 -> 3; document/pointerdown/true: 0 -> 1; document/pointerup/true:  |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| FAIL | vessel-meta | vessels centred on their burners (build/check_vessel_meta.py) | yes | FileNotFoundError: [Errno 2] No such file or directory: '/home/user/nani-jo-ghar/assets/cook/items/v3/chaat/pot-chana.webp' |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 44 distinct rows to recheck; add --shared for the Shared components rows. |

## Blocking (9, by game)

**cook:samosa** (6)
- contract-70 at cook:samosa@L3@930x430 (view-service): the heat ring entered its green (0.68-0.8) and no call was said by 0.86 (the turn-off call as the bar enters the green; 0.06 a speed, at speed 3)
- contract-78 at cook:samosa#mistake@740x320 (view-service): the call "Samosa hane kadh." starts and no light comes with it
- contract-112 at cook:samosa@L3#hint@740x320 (kind-swipe): light 5 [306,54,554,180]: sv3-foldcv [287,34,574,199] (its picture, pill and face) is not inside the light with its pad: left -19 px (wants 10), top -20 px (wants 10), right -20 px (wants 10), bottom 
- contract-78 at lab:cook/samosa@L2@740x320 (samosa-kind-timing): the call "Samosa hane kadh." starts and no light comes with it
- contract-78 at lab:cook/samosa@L4@740x320 (samosa-kind-timing): the call "Samosa hane kadh." starts and the light comes 207 ms later (more than 200 ms)
- contract-78 at lab:cook/samosa@L4@930x430 (samosa-kind-timing): the call "Chulo bar!" starts and the light comes 248 ms later (more than 200 ms)

**(every game)** (3)
- frozen at build/screenshots/tiers/change-a75811db1c/logs/frozen.log: lab:cook/chai-tray@740x320: a sound: always there before, missing now: sfx/cook-right -> -
- mount at build/screenshots/tiers/change-a75811db1c/logs/mount.log: FAIL listeners on the page as before: window|pointerdown|true: 2 -> 3; window|resize|false: 2 -> 3; document|pointerdown|true: 0 -> 1; document|pointerup|true: 0 -> 1; document|keydown|true: 0 -> 1; document|wheel|true: 0 -> 1; document|touchstart|true: 0 -> 1; document|pointermove|true: 0 -> 1; window|pointermove|true: 0 -> 1; window|pointerup|true: 0 -> 1; window|pointercancel|true: 0 -> 1; FAIL no audio context left open (1); FAIL no Cook global, no iframe (Cook)
- vessel-meta at build/screenshots/tiers/change-a75811db1c/logs/vessel-meta.log: FileNotFoundError: [Errno 2] No such file or directory: '/home/user/nani-jo-ghar/assets/cook/items/v3/chaat/pot-chana.webp'


## Reported, not blocking (14, by game)

**cook:samosa** (12)
- contract-37 at cook:samosa@L4@740x320 (view-marble): cook:station1:marble (samosa at L4): 3 decoys on the shelf (ph-dhana, veg-10*, ph-keema, veg-02*, veg-01, veg-12*; * not in the order), the table wants at least 4 (the base has it too)
- contract-78 at cook:samosa#mistake@930x430 (view-service): the call "Samosa hane kadh." starts and no light comes with it (the base has it too)
- contract-36 at cook:samosa#hint@740x320 (hint-nani-says): a step opened on screen (the light on veg-01) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged) (the base has it too)
- contract-92 at cook:samosa#hint@740x320 (hint-nani-says): the light round veg-01 covers its neighbour veg-02: it should stop short of it (the base has it too)
- contract-36 at cook:samosa#hint@930x430 (hint-nani-says): a step opened on screen (the light on veg-01) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged) (the base has it too)
- contract-92 at cook:samosa#hint@930x430 (hint-nani-says): the light round veg-01 covers its neighbour veg-12: it should stop short of it (the base has it too)
- contract-92 at cook:samosa@L3#hint@740x320 (hint-glow): the light round ph-keema covers its neighbour veg-12: it should stop short of it (the base has it too)
- contract-78 at lab:cook/samosa@740x320 (samosa-view-service): the call "Samosa hane kadh." starts and no light comes with it (the base has it too)
- contract-78 at lab:cook/samosa@930x430 (samosa-view-service): the call "Samosa hane kadh." starts and no light comes with it (the base has it too)
- contract-78 at lab:cook/samosa@L3@930x430 (samosa-kind-timing): the call "Samosa hane kadh." starts and the light comes 720 ms later (more than 200 ms) (the base has it too)
- contract-37 at lab:cook/samosa@L4@740x320 (after samosa-kind-click): host:cook/samosa|cook:station1:marble (samosa at L4): 3 decoys on the shelf (veg-01, ph-dhana*, veg-10*, veg-12, ph-keema, veg-02*; * not in the order), the table wants at least 4 (the base has it too)
- contract-37 at lab:cook/samosa@L4@930x430 (samosa-view-marble): host:cook/samosa|cook:station1:marble (samosa at L4): 3 decoys on the shelf (veg-01, ph-dhana*, veg-10*, veg-12, ph-keema, veg-02*; * not in the order), the table wants at least 4 (the base has it too)

**(every game)** (2)
- play at build/screenshots/tiers/change-a75811db1c/logs/play.log: CONTRACT FAILED: 18 breaks (contract-70 1, contract-37 3, contract-78 8, contract-36 2, contract-92 3, contract-112 1); CHECK FAILED: 253 new findings, 0 flows do not reach their end, 0 new page errors, 18 contract breaks
- before at build/screenshots/tiers/change-a75811db1c/logs/before.log: CONTRACT FAILED: 19 breaks (contract-78 7, contract-37 4, contract-105 1, contract-36 3, contract-92 3, contract-111 1); CHECK FAILED: 257 new findings, 0 flows do not reach their end, 0 new page errors, 19 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-a75811db1c
- before | after: build/screenshots/tiers/change-a75811db1c/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-a75811db1c-samosa/films/cook-samosa@740x320.webm
- logs: build/screenshots/tiers/change-a75811db1c/logs
