# CHAI-61 (open) · Easy to play (Sprint 11)

**Issue:** "If I'm making the second or third pan of chai while the first is still cooking, the addition of paani stops the cooking of the first one (pauses is during the animation). Check the additions to the other pans dont stop or slow the cooking of the lit chai pans": a lit pan's boil runs on, unchanged, while anything is added to another pan

**Check:** auto: chai L2, L3, L4: the lit pan's boil clock advances at the same rate during another pan's add

**Source:** docs/feedback/chai-play-2026-11-01.md (evening round)

**Status now:** to fix: check · built (s15-chai-12): a lit pan boils on through another pan's add

## Probes

- CHAI-61-p1-L2-1280x665: cook:chai-tray@L2 L2 @ 1280x665 [p-seen], at every placed: reached 3x (cook-done:click 12.5s, cook-done:tap 16.9s, cook-done:tap 18.0s) · with one pan heating, a thing added to another pan never pauses the first: its ring keeps growing through the other pan's add
  - note (an every: moment where it was not on screen): strip:#stage:6x250 at cook-done:click (hit 1): the filmstrip of "#stage" did not change over 6 frames (250 ms apart)
- CHAI-61-p1-L3-1280x665: cook:chai-tray@L3 L3 @ 1280x665 [p-seen], at every placed: reached 3x (cook-done:click 15.8s, cook-done:tap 23.5s, cook-done:tap 24.9s) · with one pan heating, a thing added to another pan never pauses the first: its ring keeps growing through the other pan's add
  - note (an every: moment where it was not on screen): strip:#stage:6x250 at cook-done:click (hit 1): the filmstrip of "#stage" did not change over 6 frames (250 ms apart)

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-61.png`, `build/screenshots/evidence/r16pb-cook/CHAI-61-2.png`, `build/screenshots/evidence/r16pb-cook/CHAI-61-3.png`, `build/screenshots/evidence/r16pb-cook/CHAI-61-4.png`)

- **A**: cook:chai-tray@L2 L2 1280x665 [p-seen] · strip:#stage:6x250 at cook-done:tap
- **B**: cook:chai-tray@L2 L2 1280x665 [p-seen] · strip:#stage:6x250 at cook-done:tap
- **C**: cook:chai-tray@L3 L3 1280x665 [p-seen] · strip:#stage:6x250 at cook-done:tap
- **D**: cook:chai-tray@L3 L3 1280x665 [p-seen] · strip:#stage:6x250 at cook-done:tap · NO MOTION CAPTURED

