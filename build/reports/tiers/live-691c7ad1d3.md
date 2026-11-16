# check-live (tier 4) on 691c7ad1d3 + uncommitted changes

**FAILED**, 2026-11-16T05:49:30.337Z; 0.1 min.

Games: house, cook:chai-tray, cook:daar, clinic:heal-eye, day:door.

| | step | what | blocks | result |
|---|---|---|---|---|
| FAIL | live:house | house's first minute on the live site at 740x320 | yes | load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/index.html |
| FAIL | live:chai-tray | cook:chai-tray's first minute on the live site at 740x320 | yes | load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/lab.html?mode=cook&game=chai-tray&level=1&nonav=1 |
| FAIL | live:daar | cook:daar's first minute on the live site at 740x320 | yes | load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/lab.html?mode=cook&game=daar&level=1&nonav=1 |
| FAIL | live:eye | clinic:heal-eye's first minute on the live site at 740x320 | yes | load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/clinic.html?stage=heal&game=eye&level=1&nonav=1 |
| FAIL | live:door | day:door's first minute on the live site at 740x320 | yes | load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/day.html |

## Blocking (5, by game)

**clinic:heal-eye** (1)
- live:eye at build/screenshots/tiers/live-691c7ad1d3/logs/live_eye.log: load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/clinic.html?stage=heal&game=eye&level=1&nonav=1

**cook:chai-tray** (1)
- live:chai-tray at build/screenshots/tiers/live-691c7ad1d3/logs/live_chai-tray.log: load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/lab.html?mode=cook&game=chai-tray&level=1&nonav=1

**cook:daar** (1)
- live:daar at build/screenshots/tiers/live-691c7ad1d3/logs/live_daar.log: load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/lab.html?mode=cook&game=daar&level=1&nonav=1

**day:door** (1)
- live:door at build/screenshots/tiers/live-691c7ad1d3/logs/live_door.log: load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/day.html

**house** (1)
- live:house at build/screenshots/tiers/live-691c7ad1d3/logs/live_house.log: load: page.goto: net::ERR_NAME_NOT_RESOLVED at https://baby-isa.github.io/nani-jo-ghar/index.html


## For the eyes
- strips: 
- logs: build/screenshots/tiers/live-691c7ad1d3/logs
