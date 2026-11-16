# CHAI-49 (open) · Cook: chai

**Issue:** Found by the s14-tools check (contract-78) and the orchestrator's film (30 Oct): at L3-L4 a cold pan that was not the one in hand opened its knob step as a tap on the pan, so "Chulo bar!" was said with nothing lit (the third pan, every L4 round at a child's pace): its knob is lit with the call

**Check:** auto: contract-78 on chai L3-L4 at speed 1

**Source:** build/reports/s14-rollout.md

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (fails in s19-clean-b: contract-78 x1) · built 30 Oct in the fast lane (the station's log: the light and the call in the same millisecond at L4); the sprint's judge, then Zafar's play

## Probes

- CHAI-49-p1-L4-1280x665: cook:chai-tray@L4#speed1 L4 @ 1280x665 [p-seen], at kind-timing: reached 1x (rec:kind-timing 87.5s) · L4: the third pan's knob step, opened while another pan is in hand, lights the knob with 'Chulo bar!' (the light's Lifecycle rung and the call in the same moment: the contract's timeline)
- CHAI-49-p1-L4-930x430: cook:chai-tray@L4#speed1 L4 @ 930x430 [p-seen], at kind-timing: reached 1x (rec:kind-timing 129.5s) · L4: the third pan's knob step, opened while another pan is in hand, lights the knob with 'Chulo bar!' (the light's Lifecycle rung and the call in the same moment: the contract's timeline)

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-49.png`)

- **A**: cook:chai-tray@L4#speed1 L4 1280x665 [p-seen] · shot at rec:kind-timing
- **B**: cook:chai-tray@L4#speed1 L4 930x430 [p-seen] · shot at rec:kind-timing

## Text captures

#### CHAI-49-p1-L4-1280x665 · contract-78 (contract)

```
contract-78 kind-timing 85.9s: the call "Slow kar!" starts and no light comes with it
```

#### CHAI-49-p1-L4-930x430 · contract-78 (contract)

```
contract-78 kind-timing 114.8s: the call "Chulo bar!" starts and the light comes 58760 ms later (more than 200 ms)
contract-78 kind-timing 126.8s: the call "Slow kar!" starts and the light comes 46742 ms later (more than 200 ms)
```
