# DAAR-39 (open) · Cook: daar

**Issue:** "the onboarding for the chop game definitely went awry ... going up and down jerkily"; "the whole entire screen of the chop game has been highlighted, and it's been treated as an item ... Just highlight the knife ... a small horizontal strip, maybe twice the height of the knife, running the full width along. The rest is shaded darker. And then there's a finger grabbing the knife and dragging it from right to left. And as it drags it from right to left, it chops an item in half. So an item happens to jump in ... that highlighted rectangle box on purpose, predestined ... don't add it to the chopped list ... once it's chopped it, the highlight goes and the player can play. But if the player chooses to grab the knife, no, actually don't let them ... make them wait for the onboarding": the chop's first time is that strip demo; nothing else lit or bouncing; the knife locked until it ends

**Check:** auto: daar's chop at L1 as a new player, filmed at the four sizes: a strip about twice the knife's height across the board's full width, the rest darker, the finger dragging the knife right to left, one planted vegetable cut, not counted; the knife inert until the end; the window resized during the demo: no jitter

**Source:** docs/feedback/cook-s14-play-2026-10-30.md P14

**Status now:** to fix: check · built (s20-b1-daar round 3: chop's strip light holds the hand where the move starts; contract-112 0 over two runs and gate-20261115T0535)

## Probes

- DAAR-39-p1-L1-1280x665: cook:daar#speed1 L1 @ 1280x665 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 21.6s, visible:.njg-onboard 35.6s, visible:.njg-onboard 45.4s, visible:.njg-onboard 47.8s) · daar's chop swipe: one lit region
- DAAR-39-p1-L1-740x320: cook:daar#speed1 L1 @ 740x320 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 19.7s, visible:.njg-onboard 30.9s, visible:.njg-onboard 45.0s, visible:.njg-onboard 47.9s) · daar's chop swipe: one lit region

## Panels (`build/screenshots/evidence/r16pb-cook/DAAR-39.png`)

- **A**: cook:daar#speed1 L1 1280x665 [p-fresh] · crop:#game at every onboard (4)
- **B**: cook:daar#speed1 L1 740x320 [p-fresh] · crop:#game at every onboard (4)

