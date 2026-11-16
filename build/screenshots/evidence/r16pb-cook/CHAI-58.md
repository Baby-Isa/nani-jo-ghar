# CHAI-58 (open) · Easy to play (Sprint 11)

**Issue:** The new boil (CHAI-57) is tight at L4: at a child's pace the green plus the red lasts about 3 s, and a miss empties the pan and starts it again; a child busy with another pan may boil over often (the builder's note, 1 Nov)

**Check:** auto: the green's length at L4, measured at speed 1, 2 s (±0.1) · eye: chai L4 at 1280x665

**Source:** build/reports/s15-chai-11.md

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (fails in s19-clean-b: contract-70) · built 2 Nov in chai (d23ac70, b45779e), shot at the four sizes by labcheck; the judge, then Zafar's play

## Probes

- CHAI-58-p1-L1-1280x665: cook:chai-tray#speed1 L1 @ 1280x665 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 21.4s, visible:.njg-onboard 25.5s, visible:.njg-onboard 29.0s, visible:.njg-onboard 40.5s) · CHAI-58 as its row says
- CHAI-58-p1-L1-740x320: cook:chai-tray#speed1 L1 @ 740x320 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 21.5s, visible:.njg-onboard 27.4s, visible:.njg-onboard 30.2s, visible:.njg-onboard 43.4s) · CHAI-58 as its row says

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-58.png`)

- **A**: cook:chai-tray#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- **B**: cook:chai-tray#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

