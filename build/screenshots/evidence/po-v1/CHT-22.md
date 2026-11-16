# CHT-22 (open) · Cook: chaat

**Issue:** Chaat at 740x320, smaller: the first light's box clear of the settings gear; the 'hakro' pill clear of the cut potato; no one-frame dim flash at the tameto turn (the dim fades in and holds); the flying piece a readable picture, not a speck, and the bowl's pill moving on with Nani's line; the stone tray reading full as chai's shelf; the potato not on the board and the tray at once

**Check:** auto: chaat L1-L4, 740x320 and 1280x665

**Source:** the Fable eye judge standing in for Zafar (decision 38), chaat L1 after s20-b2-chaat, build/screenshots/sidebyside/chaat-L1-20261115-1003, 15 Nov

**Status now:** to fix: code · partly (s20-b2-chaat round 2: the spoonful at least 46 CSS px, bigger tray bowls; the cut light under the cog, the pill over the potato, the dim flash and the potato on board and tray are chop's own: DAAR-65 and the daar session)

## Probes

- CHT-22-p1-L1-740x320: cook:chaat L1 @ 740x320 [p-fresh], at every onboard: reached 3x (visible:.njg-onboard 10.0s, visible:.njg-onboard 12.6s, visible:.njg-onboard 19.0s) · chaat at 740x320, a new player: every first light's gold box clear of the settings cog (the cut light under the cog)
  - expect noOverlap:.njg-onboard .ob-box,#side-cog: PASS (no overlap (2 moments))
- CHT-22-p2-L1-740x320: cook:chop L1 @ 740x320 [p-fresh], at every onboard: reached 2x (visible:.njg-onboard 5.3s, visible:.njg-onboard 7.7s) · chop L1 at 740x320 (chaat's chop step is chop's own code): the cut light's box clear of the cog
  - expect noOverlap:.njg-onboard .ob-box,#side-cog: PASS (no overlap)
- CHT-22-p3-L1-740x320: cook:chaat L1 @ 740x320 [p-seen], at every placed: reached 6x (cook-done:click 11.4s, cook-done:click 16.2s, cook-done:tap 18.1s, cook-done:tap 19.1s, cook-done:tap 20.3s, cook-done:click 28.9s) · chaat at 740x320, each move: the 'hakro' pill clear of the cut potato; no one-frame dim flash at the tameto turn; the flying piece a readable picture, not a speck; the potato never on the board and the tray at once
  - note (an every: moment where it was not on screen): strip:#stage:3x150 at cook-done:click (hit 2): the filmstrip of "#stage" did not change over 3 frames (150 ms apart)

## Panels (`build/screenshots/evidence/po-v1/CHT-22.png`, `build/screenshots/evidence/po-v1/CHT-22-2.png`, `build/screenshots/evidence/po-v1/CHT-22-3.png`)

- **A**: cook:chaat L1 740x320 [p-fresh] · shot at every onboard (3)
- **B**: cook:chop L1 740x320 [p-fresh] · shot at every onboard (2)
- **C**: cook:chaat L1 740x320 [p-seen] · strip:#stage:3x150 at cook-done:click
- **D**: cook:chaat L1 740x320 [p-seen] · strip:#stage:3x150 at cook-done:tap
- **E**: cook:chaat L1 740x320 [p-seen] · strip:#stage:3x150 at cook-done:tap · NO MOTION CAPTURED
- **F**: cook:chaat L1 740x320 [p-seen] · strip:#stage:3x150 at cook-done:tap
- **G**: cook:chaat L1 740x320 [p-seen] · strip:#stage:3x150 at cook-done:click

