# check-change (tier 2) on ded1bef559

**PASSED**, 2026-11-15T07:27:08.091Z; base 40352897ae; 19.5 min.

Games: cook:mishkaki-grill (the brief's flows).
- the brief names no fix-list row: no probes to play

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 2.5 min; build/reports/tiers/push-ded1bef559.md |
| ok   | scope | the builder's files inside its owns (brief.mjs --audit) | yes | scope: all 1 files are "s20-b2-sekelo: sekelo joins the kitchen frame"'s own |
| note | play | the robot plays cook:mishkaki-grill (6 flows: L1, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT PASSED: 0 breaks over 12 pages; CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks |
| note | before | the same flows on the base commit 40352897ae (its own tree and sandbox) | reports | CONTRACT PASSED: 0 breaks over 12 pages; CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 303 before/after pictures, 35 not paired; build/screenshots/tiers/change-ded1bef559/before-after/index.html |
| ok   | film:mishkaki-grill | a first-play film: cook:mishkaki-grill as a new player at 740x320, for the orchestrator to look at | reports | 07:46:36 summary: /home/user/nani-jo-ghar/build/screenshots/sandbox/tiers-film-ded1bef559-mishkaki-grill/summary.md |

## Blocking

Nothing to fix.


## Reported, not blocking (2, by game)

**(every game)** (2)
- play at build/screenshots/tiers/change-ded1bef559/logs/play.log: CONTRACT PASSED: 0 breaks over 12 pages; CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks
- before at build/screenshots/tiers/change-ded1bef559/logs/before.log: CONTRACT PASSED: 0 breaks over 12 pages; CHECK FAILED: 48 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-ded1bef559
- before | after: build/screenshots/tiers/change-ded1bef559/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-ded1bef559-mishkaki-grill/films/cook-mishkaki-grill@740x320.webm
- logs: build/screenshots/tiers/change-ded1bef559/logs
