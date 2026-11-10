# check-change (tier 2) on 7d812f2d23

**PASSED**, 2026-11-10T01:31:07.513Z; base 8b4beca7b3; 3.3 min.

Games: cook:chop (--games).

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 0.8 min; build/reports/tiers/push-7d812f2d23.md |
| note | play | the robot plays cook:chop (5 flows: L1, paths) at 740x320 with the contract rules | reports | CONTRACT PASSED: 0 breaks over 5 pages; CHECK FAILED: 15 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks |
| note | before | the same flows on the base commit 8b4beca7b3 (its own tree and sandbox) | reports | CONTRACT PASSED: 0 breaks over 5 pages; CHECK FAILED: 15 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 93 before/after pictures, 13 not paired; build/screenshots/tiers/change-7d812f2d23/before-after/index.html |
| ok   | film:chop | a first-play film: cook:chop#speed1 as a new player at 740x320, for the orchestrator to look at | reports | 01:34:23 summary: /home/user/wt/s19-tiers/build/screenshots/sandbox/tiers-film-7d812f2d23-chop/summary.md |

## Blocking

Nothing to fix.


## Reported, not blocking (2, by game)

**(every game)** (2)
- play at build/screenshots/tiers/change-7d812f2d23/logs/play.log: CONTRACT PASSED: 0 breaks over 5 pages; CHECK FAILED: 15 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks
- before at build/screenshots/tiers/change-7d812f2d23/logs/before.log: CONTRACT PASSED: 0 breaks over 5 pages; CHECK FAILED: 15 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-7d812f2d23
- before | after: build/screenshots/tiers/change-7d812f2d23/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-7d812f2d23-chop/films/cook-chop-speed1@740x320.webm
- logs: build/screenshots/tiers/change-7d812f2d23/logs
