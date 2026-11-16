# DAAR-57 (open) · Cook: daar

**Issue:** Nani's box keeps her face and speaker in the chop step, as chai's in every state (her face moves onto the order card beside 'Chop these.' and is back in her box for the spice step)

**Check:** auto: chop and daar L1-L4, four sizes: Nani's face and speaker in her box in every state

**Source:** the Fable eye judge standing in for Zafar (decision 38), daar L4 beside chai, build/screenshots/sidebyside/daar-L4-20261115-0615, 15 Nov

**Status now:** to fix: code · daar built; chop on its own is the kit's: ui.js:1648 mission.stripMode = who === 'nani' strips Nani's box for any Nani-asked order

## Probes

- DAAR-57-p1-L1-740x320: cook:daar L1 @ 740x320 [p-seen], at every step: reached 3x (life:step-open 11.0s, life:step-call 11.4s, life:step-close 15.1s) · daar part (built): Nani's face and speaker stay in her box in every step; the chop-alone part is fix-kit's (ui.js stripMode)
- DAAR-57-p1-L4-740x320: cook:daar@L4 L4 @ 740x320 [p-seen], at every step: reached 3x (life:step-open 15.2s, life:step-call 15.8s, life:step-close 34.7s) · daar part (built): Nani's face and speaker stay in her box in every step; the chop-alone part is fix-kit's (ui.js stripMode)

## Panels (`build/screenshots/evidence/r16pb-newcook/DAAR-57.png`)

- **A**: cook:daar L1 740x320 [p-seen] · crop:#side at every step (3)
- **B**: cook:daar@L4 L4 740x320 [p-seen] · crop:#side at every step (3)

