# DAAR-57 (open) · Cook: daar

**Issue:** Nani's box keeps her face and speaker in the chop step, as chai's in every state (her face moves onto the order card beside 'Chop these.' and is back in her box for the spice step)

**Check:** auto: chop and daar L1-L4, four sizes: Nani's face and speaker in her box in every state

**Source:** the Fable eye judge standing in for Zafar (decision 38), daar L4 beside chai, build/screenshots/sidebyside/daar-L4-20261115-0615, 15 Nov

**Status now:** to fix: code · daar built; chop on its own is the kit's: ui.js:1648 mission.stripMode = who === 'nani' strips Nani's box for any Nani-asked order

## Machine verdict: FAIL

machine: DAAR-57-p1-L1-1280x665: count:#guide .ng-face>=1: 0 visible (2 moments); DAAR-57-p1-L1-1280x665: count:#mission .oc-card[data-who=nani] .oc-face=0: 1 visible (2 moments)

## Probes

- DAAR-57-p1-L1-1280x665: cook:chop L1 @ 1280x665 [p-fresh], at every placed: reached 2x (cook-done:click 7.6s, cook-done:slice 10.3s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))
- DAAR-57-p1-L1-740x320: cook:chop L1 @ 740x320 [p-fresh], at every placed: reached 2x (cook-done:click 8.4s, cook-done:slice 11.1s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))
- DAAR-57-p1-L2-1280x665: cook:chop@L2 L2 @ 1280x665 [p-fresh], at every placed: reached 2x (cook-done:click 7.6s, cook-done:click 10.3s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))
- DAAR-57-p1-L2-740x320: cook:chop@L2 L2 @ 740x320 [p-fresh], at every placed: reached 2x (cook-done:click 9.0s, cook-done:click 11.9s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))
- DAAR-57-p1-L3-1280x665: cook:chop@L3 L3 @ 1280x665 [p-fresh], at every placed: reached 2x (cook-done:click 6.4s, cook-done:click 8.2s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))
- DAAR-57-p1-L3-740x320: cook:chop@L3 L3 @ 740x320 [p-fresh], at every placed: reached 2x (cook-done:click 9.1s, cook-done:click 12.0s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))
- DAAR-57-p1-L4-1280x665: cook:chop@L4 L4 @ 1280x665 [p-fresh], at every placed: reached 2x (cook-done:click 6.4s, cook-done:click 8.8s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))
- DAAR-57-p1-L4-740x320: cook:chop@L4 L4 @ 740x320 [p-fresh], at every placed: reached 2x (cook-done:click 9.7s, cook-done:click 12.3s) · chop on its own (Nani's own order, 'Muke ba dungri khape'): at every chop her face and speaker are in her box, and her order card beside 'Chop these' has no face of its own (one face per person); was: her box stripped (ui.js mission.stripMode for any Nani-asked order), her face on the card
  - expect count:#guide .ng-face>=1: FAIL (0 visible (2 moments))
  - expect count:#mission .oc-card[data-who=nani] .oc-face=0: FAIL (1 visible (2 moments))

## Panels (`build/screenshots/evidence/fk-daar57-base/DAAR-57.png`, `build/screenshots/evidence/fk-daar57-base/DAAR-57-2.png`, `build/screenshots/evidence/fk-daar57-base/DAAR-57-3.png`)

- **A**: cook:chop L1 1280x665 [p-fresh] · crop:#side at every placed (2)
- **B**: cook:chop L1 740x320 [p-fresh] · crop:#side at every placed (2)
- **C**: cook:chop@L2 L2 1280x665 [p-fresh] · crop:#side at every placed (2)
- **D**: cook:chop@L2 L2 740x320 [p-fresh] · crop:#side at every placed (2)
- **E**: cook:chop@L3 L3 1280x665 [p-fresh] · crop:#side at every placed (2)
- **F**: cook:chop@L3 L3 740x320 [p-fresh] · crop:#side at every placed (2)
- **G**: cook:chop@L4 L4 1280x665 [p-fresh] · crop:#side at every placed (2)
- **H**: cook:chop@L4 L4 740x320 [p-fresh] · crop:#side at every placed (2)

