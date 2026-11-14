# check-change (tier 2) on 02fdf42ae4

**FAILED**, 2026-11-14T19:58:22.708Z; base 9fa3810012; 118.2 min.

Games: cook:chai-tray (the brief's flows).
- the brief names no fix-list row: no probes to play

| | step | what | blocks | result |
|---|---|---|---|---|
| ok   | push | tier 0 first (reused when it passed on this commit) | yes | check-push: PASSED in 1.2 min; build/reports/tiers/push-02fdf42ae4.md |
| FAIL | scope | the builder's files inside its owns (brief.mjs --audit) | yes | index.html |
| note | play | the robot plays cook:chai-tray (19 flows: L1,L2,L3,L4, paths) at 740x320, 930x430 with the contract rules | reports | CONTRACT PASSED: 0 breaks over 38 pages; CHECK FAILED: 243 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks |
| note | before | the same flows on the base commit 9fa3810012 (its own tree and sandbox) | reports | CONTRACT PASSED: 0 breaks over 38 pages; CHECK FAILED: 245 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks |
| ok   | pairs | before | after pictures, made by script from the two runs | reports | pairs: 923 before/after pictures, 163 not paired; build/screenshots/tiers/change-02fdf42ae4/before-after/index.html |
| ok   | film:chai-tray | a first-play film: cook:chai-tray as a new player at 740x320, for the orchestrator to look at | reports | 21:25:59 summary: /home/user/wt/s20-step12-frame/build/screenshots/sandbox/tiers-film-02fdf42ae4-chai-tray/summary.md |
| FAIL | frozen | chai against its frozen run (frozen.mjs --diff) | yes | lab:cook/chai-tray@740x320: a sound: always there before, missing now: sfx/cook-right -> - |
| FAIL | mount | Cook's mount test (COOK-16: leaked listeners) | yes | FAIL listeners on the page as before: window/pointerdown/true: 2 -> 3; window/resize/false: 2 -> 3; document/pointerdown/true: 0 -> 1; document/pointerup/true:  |
| ok   | leak-cook | Cook's Kutchi leak bot (a browser; non-negotiable 4) | yes | leak_cook: ok |
| FAIL | vessel-meta | vessels centred on their burners (build/check_vessel_meta.py) | yes | FileNotFoundError: [Errno 2] No such file or directory: '/home/user/wt/s20-step12-frame/assets/cook/items/v3/chaat/pot-chana.webp' |
| ok   | rows-to-recheck | the fix-list rows of the flows the change reaches (touched.mjs | regress.mjs) | reports | 548 distinct rows to recheck; add --shared for the Shared components rows. |

## Blocking (4, by game)

**(every game)** (4)
- scope at build/screenshots/tiers/change-02fdf42ae4/logs/scope.log: index.html
- frozen at build/screenshots/tiers/change-02fdf42ae4/logs/frozen.log: lab:cook/chai-tray@740x320: a sound: always there before, missing now: sfx/cook-right -> -
- mount at build/screenshots/tiers/change-02fdf42ae4/logs/mount.log: FAIL listeners on the page as before: window|pointerdown|true: 2 -> 3; window|resize|false: 2 -> 3; document|pointerdown|true: 0 -> 1; document|pointerup|true: 0 -> 1; document|keydown|true: 0 -> 1; document|wheel|true: 0 -> 1; document|touchstart|true: 0 -> 1; document|pointermove|true: 0 -> 1; window|pointermove|true: 0 -> 1; window|pointerup|true: 0 -> 1; window|pointercancel|true: 0 -> 1; FAIL no audio context left open (1); FAIL no Cook global, no iframe (Cook)
- vessel-meta at build/screenshots/tiers/change-02fdf42ae4/logs/vessel-meta.log: FileNotFoundError: [Errno 2] No such file or directory: '/home/user/wt/s20-step12-frame/assets/cook/items/v3/chaat/pot-chana.webp'


## Reported, not blocking (2, by game)

**(every game)** (2)
- play at build/screenshots/tiers/change-02fdf42ae4/logs/play.log: CONTRACT PASSED: 0 breaks over 38 pages; CHECK FAILED: 243 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks
- before at build/screenshots/tiers/change-02fdf42ae4/logs/before.log: CONTRACT PASSED: 0 breaks over 38 pages; CHECK FAILED: 245 new findings, 0 flows do not reach their end, 0 new page errors, 0 contract breaks


## For the eyes
- the play: build/screenshots/sandbox/tiers-change-02fdf42ae4
- before | after: build/screenshots/tiers/change-02fdf42ae4/before-after/index.html
- first-play films: build/screenshots/sandbox/tiers-film-02fdf42ae4-chai-tray/films/cook-chai-tray@740x320.webm
- logs: build/screenshots/tiers/change-02fdf42ae4/logs
