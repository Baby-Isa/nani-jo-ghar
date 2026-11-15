# check-change (tier 2) on a75811db1c

**FAILED**, 2026-11-15T07:05:49.882Z; base 1cc630134f; 20.1 min.

Games: cook:samosa (the brief's flows).
- the brief names no fix-list row: no probes to play

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.2 min; build/reports/tiers/push-a75811db1c.md |
| ok   | scope | the builder's files inside its owns (brief.mjs --audit) | yes | scope: all 1 files are "s20-b2-samosa: samosa joins the kitchen frame"'s own |
| note | play | the robot plays cook:samosa (6 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT FAILED: 10 breaks (contract-78 4, contract-111 2, contract-92 2, contract-36 2); CHECK FAILED: 68 new findings, 0 flows do not reach their end, 0 new p |
| note | before | the same flows on the base commit 1cc630134f (its own tree and sandbox) | reports | CONTRACT FAILED: 9 breaks (contract-78 5, contract-92 2, contract-36 2); CHECK FAILED: 68 new findings, 0 flows do not reach their end, 0 new page errors, 9 con |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 304 before/after pictures, 43 not paired; build/screenshots/tiers/change-a75811db1c/before-after/index.html |
| ok   | film:samosa | a first-play film: cook:samosa as a new player at 740x320, for the orchestrator to look at | reports | 07:25:55 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-a75811db1c-samosa/summary.md |

## Blocking (4, by game)

**cook:samosa** (4)
- contract-111 at cook:samosa@930x430 (kind-swipe): the shelf item veg-01: a tap at its picture's right edge (536, 362) picks word veg-12 (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-78 at cook:samosa#hint@740x320 (view-service): the call "Samosa hane kadh." starts and no light comes with it
- contract-111 at cook:samosa#hint@930x430 (kind-tap): the shelf item veg-01: a tap at its picture's right edge (537, 362) picks word ph-dhana (the item takes its picture, its slot down to its pill and the pill but its speaker)
- contract-36 at cook:samosa#returning@930x430 (hint-nani-says): a step opened on screen (the light on ph-keema) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged)


## Reported, not blocking (8, by game)

**cook:samosa** (6)
- contract-78 at cook:samosa@740x320 (view-service): the call "Samosa hane kadh." starts and no light comes with it (the base has it too)
- contract-92 at cook:samosa#hint@740x320 (hint-nani-says): the light round veg-01 covers its neighbour veg-02: it should stop short of it (the base has it too)
- contract-92 at cook:samosa#hint@930x430 (hint-nani-says): the light round veg-01 covers its neighbour ph-dhana: it should stop short of it (the base has it too)
- contract-36 at cook:samosa#returning@740x320 (hint-nani-says): a step opened on screen (the light on ph-keema) and Nani did not call it (no call line from 2 s before to 6 s after, no skip logged) (the base has it too)
- contract-78 at lab:cook/samosa@740x320 (samosa-view-service): the call "Samosa hane kadh." starts and no light comes with it (the base has it too)
- contract-78 at lab:cook/samosa@930x430 (samosa-view-service): the call "Samosa hane kadh." starts and no light comes with it (the base has it too)

**(every game)** (2)
- play at build/screenshots/tiers/change-a75811db1c/logs/play.log: CONTRACT FAILED: 10 breaks (contract-78 4, contract-111 2, contract-92 2, contract-36 2); CHECK FAILED: 68 new findings, 0 flows do not reach their end, 0 new page errors, 10 contract breaks
- before at build/screenshots/tiers/change-a75811db1c/logs/before.log: CONTRACT FAILED: 9 breaks (contract-78 5, contract-92 2, contract-36 2); CHECK FAILED: 68 new findings, 0 flows do not reach their end, 0 new page errors, 9 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-a75811db1c
- before | after: build/screenshots/tiers/change-a75811db1c/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-a75811db1c-samosa/films/cook-samosa@740x320.webm
- logs: build/screenshots/tiers/change-a75811db1c/logs
