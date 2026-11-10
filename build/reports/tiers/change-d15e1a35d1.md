# check-change (tier 2) on d15e1a35d1

**FAILED**, 2026-11-10T16:23:13.898Z; base 1e85a893d6; 163.9 min.

Games: cook:mishkaki-grill, cook:chaat, cook:samosa, cook:baking (the brief's flows).
- the brief names no fix-list row: no probes to play

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: passed on d15e1a35d1 already (2026-11-10T14:24:10.702Z); nothing to run |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | sources/art/s19-redo/refs/S4.jpg |
| note | play | the robot plays cook:mishkaki-grill, cook:chaat, cook:samosa, cook:baking (46 flows: L1,L2,L3,L4, paths) at 740x320, 930x430 with the contract rules | reports | moved canvas-text-small cook:mishkaki-grill@L3 @ 740x320 canvas > Text[25px 800] (known in another flow; not a failure) |
| note | before | the same flows on the base commit 1e85a893d6 (its own tree and sandbox) | reports | CONTRACT FAILED: 78 breaks (contract-105 56, contract-109 14, contract-102 6, contract-89 2); CHECK FAILED: 238 new findings, 0 flows do not reach their end, 0  |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 2557 before/after pictures, 245 not paired; build/screenshots/tiers/change-d15e1a35d1/before-after/index.html |
| ok   | film:mishkaki-grill | a first-play film: cook:mishkaki-grill as a new player at 740x320, for the orchestrator to look at | reports | 18:30:16 summary: /home/user/wt/s19-wave-d/build/screenshots/sandbox/tiers-film-d15e1a35d1-mishkaki-grill/summary.md |
| ok   | film:chaat | a first-play film: cook:chaat as a new player at 740x320, for the orchestrator to look at | reports | 18:30:41 summary: /home/user/wt/s19-wave-d/build/screenshots/sandbox/tiers-film-d15e1a35d1-chaat/summary.md |
| ok   | film:samosa | a first-play film: cook:samosa as a new player at 740x320, for the orchestrator to look at | reports | 18:31:17 summary: /home/user/wt/s19-wave-d/build/screenshots/sandbox/tiers-film-d15e1a35d1-samosa/summary.md |
| ok   | film:baking | a first-play film: cook:baking as a new player at 740x320, for the orchestrator to look at | reports | 18:31:45 summary: /home/user/wt/s19-wave-d/build/screenshots/sandbox/tiers-film-d15e1a35d1-baking/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | cook:chai-tray@L4@1280x665: a new contract break: - -> contract-99 |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL no timers left: [{"n":1509,"ms":3000,"at":"go (js/core/voice.js:404:9) < js/core/voice.js:411:10 < new Promise (<anonymous>)"},{"n":1516,"ms":2700,"at":"go |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| FAIL | loadtime | time and bytes to the first tap (loadtime.mjs; 20% growth fails) | yes | baking@L3@930x430@4000/60: 35598 ms, 8211 KB, 303 requests: no baseline yet (--record writes one) |
| ok   | teachgate | the prototypes' first-time light (teachgate.mjs, SH-197) | yes | PASS: every first-time light went with its tap |
| note | onboard | every phase has a first-time help (build/check_onboard.mjs) | reports | - farm/photo: no first-time help (onboard: a ghost-finger script), and no onboardWhy saying why it needs none |
| ok   | vessel-meta | vessels centred on their burners (build/check_vessel_meta.py) | yes | ok   chai-v2/meta.json panTop: recorded (0.3434, 0.6408), rim (0.3434, 0.6408), off 0.0000 (fit 0.9px) |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 736 distinct rows to recheck. |

## Blocking (10, by game)

**cook:mishkaki-grill** (4)
- contract-111 at cook:mishkaki-grill#takeback@930x430 (order-card-in-sidebar): the shelf item ph-meat: a tap at its foot (408, 392) picks nothing; a tap just above its pill (408, 400) picks nothing; a tap on its pill (408, 412) picks nothing: the pill says the word (the item's t
- contract-111 at cook:mishkaki-grill#takeback@930x430 (order-card-in-sidebar): the shelf item n.corn-on-the-cob: a tap at its foot (493, 392) picks nothing; a tap just above its pill (493, 400) picks nothing; a tap on its pill (493, 412) picks nothing: the pill says the word (th
- contract-111 at cook:mishkaki-grill#takeback@930x430 (order-card-in-sidebar): the shelf item veg-03: a tap at its foot (578, 392) picks nothing; a tap just above its pill (578, 400) picks nothing; a tap on its pill (578, 412) picks nothing: the pill says the word (the item's ta
- contract-111 at cook:mishkaki-grill#takeback@930x430 (order-card-in-sidebar): the shelf item veg-02: a tap at its foot (662, 392) picks nothing; a tap just above its pill (662, 400) picks nothing; a tap on its pill (662, 412) picks nothing: the pill says the word (the item's ta

**cook:samosa** (2)
- contract-89 at cook:samosa@L4@740x320 (kind-timing): "Tar!" was said while Nani's helper card named the item and was closed: the item said before her card shows it
- contract-89 at lab:cook/samosa@L2@740x320 (samosa-kind-timing): "Tar!" was said while Nani's helper card named the item and was closed: the item said before her card shows it

**(every game)** (4)
- scope at build/screenshots/tiers/change-d15e1a35d1/logs/scope.log: sources/art/s19-redo/refs/S4.jpg
- frozen at build/screenshots/tiers/change-d15e1a35d1/logs/frozen.log: cook:chai-tray@L4@1280x665: a new contract break: - -> contract-99
- mount at build/screenshots/tiers/change-d15e1a35d1/logs/mount.log: FAIL no timers left: [{"n":1509,"ms":3000,"at":"go (js/core/voice.js:404:9) < js/core/voice.js:411:10 < new Promise (<anonymous>)"},{"n":1516,"ms":2700,"at":"go (js/core/voice.js:404:9) < js/core/voice.js:411:10 < new Promise (<anonymous>)"}]; FAIL no audio context left open (1); FAIL no Cook global, no iframe (Cook)
- loadtime at build/screenshots/tiers/change-d15e1a35d1/logs/loadtime.log: baking@L3@930x430@4000/60: 35598 ms, 8211 KB, 303 requests: no baseline yet (--record writes one)


## Reported, not blocking (3, by game)

**(every game)** (3)
- play at build/screenshots/tiers/change-d15e1a35d1/logs/play.log: moved canvas-text-small cook:mishkaki-grill@L3 @ 740x320 canvas > Text[25px 800] (known in another flow; not a failure)
- before at build/screenshots/tiers/change-d15e1a35d1/logs/before.log: CONTRACT FAILED: 78 breaks (contract-105 56, contract-109 14, contract-102 6, contract-89 2); CHECK FAILED: 238 new findings, 0 flows do not reach their end, 0 new page errors, 78 contract breaks
- onboard at build/screenshots/tiers/change-d15e1a35d1/logs/onboard.log: - farm/photo: no first-time help (onboard: a ghost-finger script), and no onboardWhy saying why it needs none (reports, not blocks: FIX in the audit (section 9): 39 prototype phases (beach, town, farm) have no onboarding and no onboardWhy; reports until that fix lands)


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-d15e1a35d1
- before | after: build/screenshots/tiers/change-d15e1a35d1/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-d15e1a35d1-mishkaki-grill/films/cook-mishkaki-grill@740x320.webm, build/screenshots/sandbox/tiers-film-d15e1a35d1-chaat/films/cook-chaat@740x320.webm, build/screenshots/sandbox/tiers-film-d15e1a35d1-samosa/films/cook-samosa@740x320.webm, build/screenshots/sandbox/tiers-film-d15e1a35d1-baking/films/cook-baking@740x320.webm
- logs: build/screenshots/tiers/change-d15e1a35d1/logs
