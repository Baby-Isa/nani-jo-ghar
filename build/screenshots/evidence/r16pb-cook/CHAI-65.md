# CHAI-65 (open) · Easy to play (Sprint 11)

**Issue:** "the face is next to the tea. I think we should put them at the corners. So for the top left glass, put it in the top left corner. For the top right glass, put it in the top right corner. Bottom right glass, bottom right corner. Bottom left glass, bottom left corner. There's a bit of natural space there": each tray face in its glass's corner (replaces CHAI-18's place)

**Check:** auto: chai L1-L4 (1-4 glasses) at the four sizes: each face in its glass's corner, clear of every glass

**Source:** docs/feedback/chai-play-2026-11-01-night.md P3

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (fails in s19-clean-b: contract-113, the side menu) · built 2 Nov in chai (d23ac70, b45779e), shot at the four sizes by labcheck; the judge, then Zafar's play

## Probes

- CHAI-65-p1-L2-1280x665: cook:chai-tray@L2#speed1 L2 @ 1280x665 [p-fresh], at every onboard: reached 6x (visible:.njg-onboard 19.1s, visible:.njg-onboard 21.7s, visible:.njg-onboard 25.5s, visible:.njg-onboard 29.1s, visible:.njg-onboard 32.9s, visible:.njg-onboard 42.8s) · CHAI-65 as its row says
- CHAI-65-p1-L2-740x320: cook:chai-tray@L2#speed1 L2 @ 740x320 [p-fresh], at every onboard: reached 5x (visible:.njg-onboard 21.7s, visible:.njg-onboard 26.9s, visible:.njg-onboard 33.2s, visible:.njg-onboard 43.6s, visible:.njg-onboard 56.5s) · CHAI-65 as its row says

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-65.png`, `build/screenshots/evidence/r16pb-cook/CHAI-65-2.png`)

- **A**: cook:chai-tray@L2#speed1 L2 1280x665 [p-fresh] · crop:#game at every onboard (6)
- **B**: cook:chai-tray@L2#speed1 L2 740x320 [p-fresh] · crop:#game at every onboard (5)

