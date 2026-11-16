# CHAI-56 (open) · Cook: chai

**Issue:** "I'm still getting in the onboarding for Chulobara, turn on the stove, even though I haven't got new player selected. I'm immediately getting that onboarding. So that needs fixing ... because Nani says then as the next instruction, she says turn on the stove, and that triggers the onboarding support to give the visual to what she's saying. However, that works well during onboarding if you're a new player. If you're not a new player, Nani should just give you the instruction, and then, like how we have the rule of like 7 or 9 or 11 seconds of no activity, you get extra help. After that time has elapsed, then you should get the onboarding visual of turning on the stove. Otherwise, you should just get the verbal instruction": a returning player hears the call alone; the knob's light comes only after the level's wait

**Check:** auto: chai at L1, L2, L3 and L4, new and returning (returning: "Chulo bar!" with nothing lit; the lit knob after 7, 9, 11, 13 s with no tap)

**Source:** docs/feedback/chai-play-2026-11-01.md P17

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (fails in s19-clean-b: contract-78 x1) · built (s15-chai-11): a returning player hears the call alone; the light after the level's wait

## Probes

- CHAI-56-p1-L1-1280x665: cook:chai-tray L1 @ 1280x665 [p-fresh], at every onboard: reached 4x (visible:.njg-onboard 13.1s, visible:.njg-onboard 16.2s, visible:.njg-onboard 18.0s, visible:.njg-onboard 22.4s) · a new player: the knob lit with Chulo bar! once (the first pot); never again for the second pot
- CHAI-56-p1-L1-740x320: cook:chai-tray L1 @ 740x320 [p-fresh], at every onboard: reached 5x (visible:.njg-onboard 14.5s, visible:.njg-onboard 20.8s, visible:.njg-onboard 22.5s, visible:.njg-onboard 24.3s, visible:.njg-onboard 29.1s) · a new player: the knob lit with Chulo bar! once (the first pot); never again for the second pot
- CHAI-56-p1-L3-1280x665: cook:chai-tray@L3 L3 @ 1280x665 [p-fresh], at every onboard: reached 5x (visible:.njg-onboard 15.1s, visible:.njg-onboard 19.5s, visible:.njg-onboard 25.4s, visible:.njg-onboard 32.8s, visible:.njg-onboard 41.1s) · a new player: the knob lit with Chulo bar! once (the first pot); never again for the second pot
- CHAI-56-p1-L3-740x320: cook:chai-tray@L3 L3 @ 740x320 [p-fresh], at every onboard: reached 7x (visible:.njg-onboard 17.5s, visible:.njg-onboard 22.1s, visible:.njg-onboard 30.4s, visible:.njg-onboard 42.7s, visible:.njg-onboard 47.1s, visible:.njg-onboard 57.0s) · a new player: the knob lit with Chulo bar! once (the first pot); never again for the second pot

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-56.png`, `build/screenshots/evidence/r16pb-cook/CHAI-56-2.png`, `build/screenshots/evidence/r16pb-cook/CHAI-56-3.png`, `build/screenshots/evidence/r16pb-cook/CHAI-56-4.png`, `build/screenshots/evidence/r16pb-cook/CHAI-56-5.png`)

- **A**: cook:chai-tray L1 1280x665 [p-fresh] · shot at every onboard (4)
- **B**: cook:chai-tray L1 740x320 [p-fresh] · shot at every onboard (5)
- **C**: cook:chai-tray@L3 L3 1280x665 [p-fresh] · shot at every onboard (5)
- **D**: cook:chai-tray@L3 L3 740x320 [p-fresh] · shot at every onboard (7)

