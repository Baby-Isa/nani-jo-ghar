# CHAI-56 (open) · Cook: chai

**Issue:** "I'm still getting in the onboarding for Chulobara, turn on the stove, even though I haven't got new player selected. I'm immediately getting that onboarding. So that needs fixing ... because Nani says then as the next instruction, she says turn on the stove, and that triggers the onboarding support to give the visual to what she's saying. However, that works well during onboarding if you're a new player. If you're not a new player, Nani should just give you the instruction, and then, like how we have the rule of like 7 or 9 or 11 seconds of no activity, you get extra help. After that time has elapsed, then you should get the onboarding visual of turning on the stove. Otherwise, you should just get the verbal instruction": a returning player hears the call alone; the knob's light comes only after the level's wait

**Check:** auto: chai at L1, L2, L3 and L4, new and returning (returning: "Chulo bar!" with nothing lit; the lit knob after 7, 9, 11, 13 s with no tap)

**Source:** docs/feedback/chai-play-2026-11-01.md P17

**Status now:** to fix: code · waits for the frame (Sprint 20: settled when its game joins) (fails in s19-clean-b: contract-78 x1) · built (s15-chai-11): a returning player hears the call alone; the light after the level's wait

## Probes

- CHAI-56-p1-L1-1280x665: cook:chai-tray L1 @ 1280x665 [p-seen], at kind-timing: reached 1x (rec:kind-timing 18.3s) · a returning player: 'Chulo bar!' with nothing lit, then the lit knob after the level's wait (10 s filmed)
- CHAI-56-p1-L4-1280x665: cook:chai-tray@L4 L4 @ 1280x665 [p-seen], at kind-timing: reached 1x (rec:kind-timing 36.2s) · a returning player: 'Chulo bar!' with nothing lit, then the lit knob after the level's wait (10 s filmed)

## Panels (`build/screenshots/evidence/r16pb-newsh/CHAI-56.png`, `build/screenshots/evidence/r16pb-newsh/CHAI-56-2.png`, `build/screenshots/evidence/r16pb-newsh/CHAI-56-3.png`, `build/screenshots/evidence/r16pb-newsh/CHAI-56-4.png`)

- **A**: cook:chai-tray L1 1280x665 [p-seen] · strip:body:10x1000 at rec:kind-timing
- **B**: cook:chai-tray@L4 L4 1280x665 [p-seen] · strip:body:10x1000 at rec:kind-timing

## Text captures

#### CHAI-56-p1-L1-1280x665 · voice (seconds from the page's start; ---- a lifecycle step; >>>> the probe's moment)

```
(54 earlier lines left out)
 15.72  ---- act
 15.72  tap on canvas
 15.72  sfx sfx/cook-pop starts
 15.72  ---- step-close (k1)
 15.74  ---- chai-add (cook-chai)
 15.74-16.22  cook: "chai"  [family-unchecked: mum/chai.mp3]
 15.74  ---- step-open (3)
 15.74  ---- step-call (3)
 15.74  ---- step-open (3)
 15.74  ---- say-start (4)
 15.74  ---- step-call (3)
 15.74  sfx sfx/file:settle-a stops
 15.85  sfx sfx/settle stops
 15.90  sfx sfx/cook-pop stops
 15.93  ---- act
 15.93  tap on canvas
 15.93  sfx sfx/cook-pop starts
 15.93  ---- chai-add (cook-dudh)
 15.94  ---- step-close (k3)
 16.09  ---- say-end (4)
 16.11  sfx sfx/cook-pop stops
 16.27  ---- poke
 16.72  sfx sfx/file:settle-a starts
 16.72  ---- poke
 16.72  sfx sfx/settle starts
 16.73  ---- step-open (4)
 16.73  ---- step-call (4)
 16.73  ---- step-open (4)
 16.73  ---- step-call (4)
 16.91  sfx sfx/settle stops
 17.02  ---- idle-bump (pointerdown)
 17.02  ---- act
 17.02  tap on canvas
 17.02  sfx sfx/cook-pop starts
 17.03-18.50  cook: "hakro khun"  [family-unchecked: mum/hakro.mp3 + mum/khun.mp3]
 17.03  ---- step-close (k4)
 17.05  ---- step-open (5)
 17.05  ---- step-call (5)
 17.05  ---- say-start (5)
 17.06  ---- idle-bump (pointerup)
 17.09  sfx sfx/file:settle-a stops
 17.20  sfx sfx/cook-pop stops
 17.22  ---- act
 17.22  tap on canvas
 17.22  ---- step-call (5)
 17.22  sfx sfx/file:knob-a starts
 17.22  sfx sfx/knob starts
 17.22  sfx sfx/flame starts
 17.23  sfx sfx/file:simmer-b starts
 17.23  ---- chai-simmer (-23.8 dB)
 17.42  ---- chai-simmer (-21.4 dB)
 17.44  sfx sfx/knob stops
 17.44  sfx sfx/flame stops
 17.44  sfx sfx/file:flame-b starts
 17.44  sfx sfx/file:knob-a stops
 17.50  ---- poke
 17.59  ---- chai-simmer (-19.3 dB)
 17.80  ---- chai-simmer (-16.8 dB)
 17.98  ---- chai-simmer (-14.7 dB)
 18.15  ---- chai-simmer (-12.6 dB)
 18.25  >>>> moment rec:kind-timing
 18.32  ---- chai-simmer (-10.5 dB)
 18.35  ---- say-end (5)
 18.51  ---- chai-simmer (-8.2 dB)
 18.55  sfx sfx/simmer-loop starts
 18.55  sfx sfx/file:flame-b stops
 18.69  ---- chai-simmer (-6 dB)
 18.88  ---- chai-simmer (-3.8 dB)
 18.99  ---- chai-simmer (-2.5 dB)
 19.11  ---- chai-simmer (-2.5 dB)
 19.26  ---- chai-simmer (-2.5 dB)
 19.46  ---- chai-simmer (-2.5 dB)
 19.69  sfx sfx/file:ding-a starts
 19.69  sfx sfx/green starts
 19.69  ---- green-window (open)
 19.69  ---- chai-slow (0.672)
 19.70  ---- step-open (6)
 19.70  ---- step-call (6)
 19.70  ---- chai-simmer (-2.5 dB)
 19.70  ---- say-start (6)
 19.70-20.51  cook: "Slow kar!"  [family-unchecked: mum/slow.mp3 + mum/kar.mp3]
 19.81  sfx sfx/simmer-loop stops
 19.81  sfx sfx/file:ding-a stops
 19.89  sfx sfx/green stops
 19.91  ---- chai-simmer (-2.5 dB)
 20.29  ---- chai-simmer (-2.5 dB)
 20.55  sfx sfx/simmer-loop starts
 20.57  ---- say-end (6)
 20.67  ---- chai-simmer (-2.5 dB)
 21.02  ---- chai-simmer (-2.5 dB)
 21.12  ---- green-window (past)
 21.12  ---- chai-simmer (-2.4 dB)
 21.42  ---- chai-simmer (-1.7 dB)
 21.78  ---- chai-simmer (-0.8 dB)
 22.16  ---- chai-down (1.004)
 22.16  ---- green-window (over)
 22.16  ---- chai-boil (over)
 22.16  sfx sfx/file:knob-a starts
 22.16  sfx sfx/knob starts
 22.16  sfx sfx/puff starts
 22.16  sfx sfx/simmer-loop stops
 22.16  sfx sfx/file:simmer-b stops
 22.34  sfx sfx/knob stops
 22.38  sfx sfx/puff stops
 22.39  sfx sfx/file:knob-a stops
 22.57  ---- row-home (181)
 22.58  ---- chai-boil (again)
 22.58  ---- step-open (7)
 22.58  ---- step-call (7)
 22.58  ---- step-open (7)
 22.58  ---- step-call (7)
 29.58  ---- help (idle)
 29.60  ---- glow (on)
 29.65  ---- help (idle)
 29.65-33.81  cook: "Paani tapele me wij."  [device-voice: speechSynthesis + speechSynthesis + mum/me-word.mp3 + speechSynthesis]
 29.65  ---- say-start (7)
 29.68  ---- rung (7)
 29.68  ---- helper-open (cook-paani)
 29.68  ---- helper-call (7)
 29.69  ---- rung (chai-tray:s14-stuck)
(182 later lines left out)
```

#### CHAI-56-p1-L4-1280x665 · voice (seconds from the page's start; ---- a lifecycle step; >>>> the probe's moment)

```
(135 earlier lines left out)
 33.06  sfx sfx/flame stops
 33.10  sfx sfx/file:flame-b starts
 33.10  sfx sfx/file:knob-a stops
 33.13  ---- act
 33.13  tap on canvas
 33.14  ---- step-open (6)
 33.14  ---- poke
 33.15  ---- chai-simmer (-19.1 dB)
 33.34  ---- chai-simmer (-15.6 dB)
 33.39  ---- poke
 33.42  ---- chai-simmer (-14.2 dB)
 33.53  ---- chai-simmer (-12.2 dB)
 33.61  ---- idle-bump (pointerdown)
 33.61  ---- act
 33.61  tap on canvas
 33.61  sfx sfx/cook-pop starts
 33.62  ---- step-close (k8)
 33.66  ---- chai-add (cook-paani)
 33.67  ---- idle-bump (pointerup)
 33.67  ---- chai-simmer (-9.5 dB)
 33.80  ---- chai-simmer (-7.1 dB)
 33.83  sfx sfx/cook-pop stops
 33.87  sfx sfx/file:pour-a starts
 33.87  sfx sfx/file:pour-a stops
 33.87  sfx sfx/pour-short starts
 33.94  ---- chai-simmer (-4.6 dB)
 34.04  sfx sfx/pour-short stops
 34.08  ---- chai-simmer (-2.5 dB)
 34.16  ---- chai-simmer (-2.5 dB)
 34.26  sfx sfx/file:flame-b stops
 34.33  ---- chai-simmer (-2.5 dB)
 34.45  ---- chai-simmer (-2.5 dB)
 34.52  ---- poke
 34.52  sfx sfx/file:settle-a starts
 34.52  sfx sfx/settle starts
 34.59  ---- chai-simmer (-2.5 dB)
 34.73  sfx sfx/settle stops
 34.74  ---- green-window (open)
 34.74  sfx sfx/file:ding-a starts
 34.74  sfx sfx/green starts
 34.74  ---- chai-slow (0.725)
 34.74  ---- step-open (7)
 34.74  ---- step-call (7)
 34.74  ---- chai-simmer (-2.5 dB)
 34.75-35.95  cook: "Slow kar!"  [family-unchecked: mum/slow.mp3 + mum/kar.mp3]
 34.75  ---- say-start (5)
 34.90  sfx sfx/file:settle-a stops
 34.91  ---- chai-simmer (-2.5 dB)
 34.96  sfx sfx/green stops
 34.96  sfx sfx/simmer-loop stops
 34.96  sfx sfx/file:ding-a stops
 35.25  ---- chai-simmer (-2.5 dB)
 35.41  ---- green-window (past)
 35.41  ---- chai-simmer (-2.5 dB)
 35.49  sfx sfx/simmer-loop starts
 35.64  sfx sfx/simmer-loop stops
 35.79  ---- chai-simmer (-1.4 dB)
 35.99  sfx sfx/simmer-loop starts
 36.00  ---- chai-simmer (-0.7 dB)
 36.03  ---- say-end (5)
 36.24  >>>> moment rec:kind-timing
 36.29  ---- chai-down (1.012)
 36.29  ---- green-window (over)
 36.29  ---- chai-boil (over)
 36.29  sfx sfx/file:knob-a starts
 36.29  sfx sfx/knob starts
 36.29  sfx sfx/puff starts
 36.29  ---- step-open (8)
 36.29  ---- step-call (8)
 36.29  ---- step-open (8)
 36.30  sfx sfx/simmer-loop stops
 36.30  sfx sfx/file:simmer-b stops
 36.30  ---- step-call (8)
 36.50  sfx sfx/knob stops
 36.50  sfx sfx/puff stops
 36.53  sfx sfx/file:knob-a stops
 36.76  ---- row-home (428)
 36.80  ---- chai-boil (again)
 36.80  ---- step-open (9)
 36.80  ---- step-call (9)
 48.70  ---- idle-bump (pointerdown)
 48.70  tap on canvas
 48.70  ---- act
 48.70  ---- step-open (9)
 48.70  ---- poke
 48.70  ---- idle-bump (pointerup)
 49.06  ---- act
 49.06  tap on canvas
 49.07  sfx sfx/cook-pop starts
 49.07  ---- step-close (k2)
 49.13  ---- chai-add (cook-paani)
 49.26  sfx sfx/cook-pop stops
 49.31  sfx sfx/file:pour-a starts
 49.31  sfx sfx/file:pour-a stops
 49.31  sfx sfx/pour-short starts
 49.55  sfx sfx/pour-short stops
 50.01  ---- poke
 50.01  sfx sfx/file:settle-a starts
 50.01  sfx sfx/settle starts
 50.02  ---- step-open (10)
 50.02  ---- step-call (10)
 50.02  ---- step-open (10)
 50.02  ---- step-call (10)
 50.28  sfx sfx/settle stops
 50.39  sfx sfx/file:settle-a stops
 50.40  ---- act
 50.40  tap on canvas
 50.40  sfx sfx/cook-pop starts
 50.41  ---- step-close (k1)
 50.46  ---- chai-add (cook-chai)
 50.47  ---- step-open (11)
 50.47  ---- step-call (11)
 50.47  ---- step-open (11)
 50.47  ---- step-call (11)
 50.61  sfx sfx/cook-pop stops
 50.87  ---- idle-bump (pointerdown)
 50.87  ---- act
 50.87  tap on canvas
 50.87  sfx sfx/cook-pop starts
 50.87  ---- step-close (k3)
(464 later lines left out)
```
