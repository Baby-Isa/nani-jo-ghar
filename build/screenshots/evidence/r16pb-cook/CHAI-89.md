# CHAI-89 (open) · Shared components > Order cards

**Issue:** The play area centred on the worktop at every size (Zafar, 5 Nov evening: "a lot more space on top ... placed centrally, both X and Y axis, including the gameplay area ... big enough to accommodate all the items that will or currently appear")

**Check:** auto: chai L1-L4 at the four sizes, 971x318 and 1024x768: the space above the group (less the count pills' room) and below it within 10% of each other, and the space left and right of it within 10%; nothing in play crosses the group's box

**Source:** docs/feedback/chai-play-2026-11-05-eve.md P4

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (fails in s19-clean-b: contract-115, the hob) · built: js/cook/stations/chai-tray.js the hob-and-tray group, the count pills' room above it, centred between the view's top and the shelf; shot L2 and L4 at 1280x665 and 971x318; across: the group centred on the view's middle (the hob and tray's span, the first handle included); the group's box holds everything that appears over it in play (the count pills above the hob, the tray's faces); judged at L1-L4

## Probes

- CHAI-89-p1-L1-1280x665: cook:chai-tray#speed1 L1 @ 1280x665 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 21.4s, visible:.njg-onboard 25.5s, visible:.njg-onboard 29.0s, visible:.njg-onboard 40.5s) · CHAI-89 as its row says
- CHAI-89-p1-L1-740x320: cook:chai-tray#speed1 L1 @ 740x320 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 21.5s, visible:.njg-onboard 27.4s, visible:.njg-onboard 30.2s, visible:.njg-onboard 43.4s) · CHAI-89 as its row says

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-89.png`)

- **A**: cook:chai-tray#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- **B**: cook:chai-tray#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

