# MAA-21 (open) · Cook: maani

**Issue:** The first rolls stop at the board's edge (Zafar, 9 Nov, his tester, a new player on his phone: "The person didn't really see or realize the fact that there was like a size guide for the Marnie. She just rolled as quickly as possible until it couldn't roll anymore. So my suggestion is, and let's log this for this sprint or this section of change, this round of changes. I think at the beginning, there's a hard stop around the perimeter of, or maybe just inside the perimeter of the rolling board."); it changes his 8 Nov, maani L1: "once it's reached the right size maybe the first time you do the maani it stops you rolling at the right size you hit the size guide it will have a highlight ... in pulsating yellow ... the juice sound is for rolling into the right size ... then the highlight comes on and prompts you to click it but there shouldn't be the finger to click it then"

**Check:** auto: maani at L1, L2, L3 and L4 as a new player: before the big/small level a flat-out roll stops at the board's rim or just inside it with no tear, the juice sound in the sound log, no finger on the tap

**Source:** docs/feedback/kitchen-play-2026-11-08.md P7; docs/feedback/kitchen-mocks-2026-11-09.md P3; docs/feedback/kitchen-mocks-2026-11-09.md P38

**Status now:** to fix: check (built, the sweep's FIXED-IN-CODE and s19-clean-c passes the contract; its probe not run; to judge) · Sprint 19 (his "let's log this for this sprint") · told again 9 Nov (docs/feedback/kitchen-mocks-2026-11-09.md P3), changed: cause: the dough grows to 1.45 times the ring and tears at 1.3 (roll.js:248-249, data/cook.json:2888-2889), the ring drawn at every level (roll.js:158-185), the ghost finger on the tap (maani-line.js:376-381); fix: before the big/small lesson (MAA-23) the roll stops hard at the chakla's rim or just inside it (his "around the perimeter of, or maybe just inside": the place tried on the lab page at the four sizes), never tearing there, the juice sound at the stop, no finger on the tap; the ring not shown until the lesson (decision 1 to confirm)

## Probes

- MAA-21-p1-L1-1280x665: cook:maani-line L1 @ 1280x665 [p-fresh], at kind-roll: reached 1x (rec:kind-roll 18.3s) · maani at L1 (before big and small, MAA-23) as a new player, MAA-21's 9 Nov version: the roll stops hard just inside the chakla's rim (0.92 of it), no gold ring drawn, never a tear; the juice sound at the stop; then the light asks for the tap on the maani with no finger (the test player rolls to the stop: the gauge reads the way to it)
- MAA-21-p1-L1-740x320: cook:maani-line L1 @ 740x320 [p-fresh], at kind-roll: reached 1x (rec:kind-roll 21.3s) · maani at L1 (before big and small, MAA-23) as a new player, MAA-21's 9 Nov version: the roll stops hard just inside the chakla's rim (0.92 of it), no gold ring drawn, never a tear; the juice sound at the stop; then the light asks for the tap on the maani with no finger (the test player rolls to the stop: the gauge reads the way to it)

## Panels (`build/screenshots/evidence/r16pb-cook/MAA-21.png`, `build/screenshots/evidence/r16pb-cook/MAA-21-2.png`, `build/screenshots/evidence/r16pb-cook/MAA-21-3.png`)

- **A**: cook:maani-line L1 1280x665 [p-fresh] · strip:#game:12x250 at rec:kind-roll
- **B**: cook:maani-line L1 740x320 [p-fresh] · strip:#game:12x250 at rec:kind-roll

## Text captures

#### MAA-21-p1-L1-1280x665 · voice (seconds from the page's start; ---- a lifecycle step; >>>> the probe's moment)

```
  1.44  ---- cover (shown)
  3.02  ---- order-count (1)
  3.04  ---- order-level (1)
  3.10  ---- poke
  3.81  ---- cover (lifted)
  4.87  ---- ghost (conversation:pill)
  8.99  ---- request (cook:order)
  9.01  ---- dish-flash (nana)
  9.02  ---- pop-face (0)
  9.03  ---- order-pass
  9.03  ---- card-fold (nana)
  9.15-11.10  cook: "Muke hakri bajr ji maani khapeti,"  [device-voice: speechSynthesis + mum/hakri.mp3 + speechSynthesis + speechSynthesis + mum/maani-rc.mp3 + mum/khapeti.mp3]
  9.15  ---- say-start (1)
  9.16  ---- pop-face (0)
 11.03  ---- say-end (1)
 11.09  ---- pop-face (0)
 11.10  ---- say-start (2)
 11.10-11.25  cook: "hakri maani."  [family-unchecked: mum/hakri.mp3]
 11.24  tap on div.njg-rq-veil.njg-rq-along.njg-rq-open
 11.24  ---- idle-bump (pointerdown)
 11.24  ---- skip-zone (play)
 11.27  ---- order-skip (30)
 11.28  ---- idle-bump (pointerup)
 11.33  ---- stage-start (cook:station)
 11.33  ---- poke
 11.47  ---- say-end (2)
 11.76  ---- band (maani-line)
 11.82  ---- step-open (1)
 11.82  ---- step-call (1)
 12.74  ---- rung (cook/maani-line)
 12.75  ---- glow (on)
 17.11  tap on canvas
 17.11  ---- idle-bump (pointerdown)
 17.11  ---- act
 17.12  sfx sfx/cook-pop starts
 17.13-18.11  cook: "millet chapati"  [silent: silent line (its words' clip lengths)]
 17.14  ---- say-start (3)
 17.14  ---- say-end (3)
 17.14  ---- idle-bump (pointerup)
 17.29  sfx sfx/cook-pop stops
 17.30  ---- step-open (2)
 17.30  ---- step-call (2)
 17.36  sfx sfx/pop starts
 17.54  sfx sfx/pop stops
 18.26  >>>> moment rec:kind-roll
 18.38  ---- rung (cook/maani-line)
 18.38  ---- glow (on)
 18.59  ---- ghost (cook/maani-line#1)
 19.16  ---- ghost (cook/maani-line#1)
 19.73  ---- ghost (cook/maani-line#1)
 20.29  ---- ghost (cook/maani-line#1)
 20.83  ---- ghost (cook/maani-line#1)
 21.37  ---- ghost (cook/maani-line#1)
 21.94  ---- ghost (cook/maani-line#1)
 22.54  ---- ghost (cook/maani-line#1)
 23.14  ---- ghost (cook/maani-line#1)
 23.69  ---- ghost (cook/maani-line#1)
 23.77  tap on canvas
 23.77  ---- idle-bump (pointerdown)
 23.77  ---- act
 23.86  ---- idle-bump (pointermove)
 23.86  ---- poke
 24.34  sfx sfx/flip starts
 24.52  sfx sfx/flip stops
 24.61  ---- poke
 25.14  ---- poke
 25.55  sfx sfx/flip starts
 25.71  sfx sfx/flip stops
 25.85  ---- poke
 25.89  ---- idle-bump (pointermove)
 26.35  ---- poke
 26.90  ---- poke
 27.43  ---- poke
 27.67  sfx sfx/flip starts
 27.89  sfx sfx/flip stops
 27.95  ---- idle-bump (pointermove)
 27.95  ---- poke
 28.46  ---- idle-bump (pointerup)
 28.70  sfx sfx/cook-right starts
 28.71  ---- step-open (3)
 28.71  ---- step-call (3)
 28.80  sfx sfx/pop starts
 28.87  sfx sfx/cook-right stops
 28.96  sfx sfx/pop stops
 29.24  ---- rung (cook/maani-line)
 29.25  ---- glow (on)
 29.31  ---- ghost (cook/maani-line#2)
 35.12  tap on canvas
 35.12  ---- idle-bump (pointerdown)
 35.12  ---- act
 35.13  ---- step-open (4)
 35.13  ---- step-call (4)
 35.13  ---- idle-bump (pointerup)
 35.28  sfx sfx/sizzle starts
 35.28  sfx sfx/sizzle-loop starts
 35.28  sfx sfx/noise:js/shared/sfx.js starts
 35.47  sfx sfx/sizzle stops
 35.48  sfx sfx/noise:js/shared/sfx.js stops
 36.40  sfx sfx/click starts
 36.40  ---- rung (maani-line:s14-control)
 36.40  ---- step-open (5)
 36.40  ---- step-call (5)
 36.59  ---- say-start (4)
 36.59  sfx sfx/click stops
(125 later lines left out)
```

#### MAA-21-p1-L1-740x320 · voice (seconds from the page's start; ---- a lifecycle step; >>>> the probe's moment)

```
  1.24  ---- cover (shown)
  2.94  ---- order-count (1)
  2.94  ---- order-level (1)
  2.99  ---- poke
  3.59  ---- cover (lifted)
  4.90  ---- ghost (conversation:pill)
  9.14  ---- request (cook:order)
  9.18  ---- dish-flash (nana)
  9.19  ---- pop-face (0)
  9.20  ---- order-pass
  9.20  ---- card-fold (nana)
  9.37-11.64  cook: "Muke hakri bajr ji maani khapeti,"  [device-voice: speechSynthesis + mum/hakri.mp3 + speechSynthesis + speechSynthesis + mum/maani-rc.mp3 + mum/khapeti.mp3]
  9.37  ---- say-start (1)
  9.39  ---- pop-face (0)
 11.63  ---- idle-bump (pointerdown)
 11.63  ---- skip-zone (play)
 11.63  tap on div.njg-rq-veil.njg-rq-along.njg-rq-open
 11.74  ---- order-skip (100)
 11.74  ---- idle-bump (pointerup)
 11.81  ---- stage-start (cook:station)
 11.81  ---- poke
 12.01  ---- say-end (1)
 12.33  ---- band (maani-line)
 12.42  ---- step-open (1)
 12.42  ---- step-call (1)
 13.20  ---- rung (cook/maani-line)
 13.21  ---- glow (on)
 19.50  ---- help (idle)
 19.57  tap on canvas
 19.58  ---- idle-bump (pointerdown)
 19.58  ---- act
 19.58  ---- idle-bump (touchstart)
 19.58  sfx sfx/cook-pop starts
 19.59-20.09  cook: "maani"  [family-ok: mum/maani-rc.mp3]
 19.59  ---- say-start (2)
 19.72  ---- idle-bump (pointerup)
 19.77  ---- step-open (2)
 19.77  ---- step-call (2)
 19.85  sfx sfx/cook-pop stops
 19.90  sfx sfx/pop starts
 19.99  ---- say-end (2)
 20.13  sfx sfx/pop stops
 20.85  ---- rung (cook/maani-line)
 20.85  ---- glow (on)
 21.13  ---- ghost (cook/maani-line#1)
 21.26  >>>> moment rec:kind-roll
 21.72  ---- ghost (cook/maani-line#1)
 22.44  ---- ghost (cook/maani-line#1)
 23.04  ---- ghost (cook/maani-line#1)
 23.64  ---- ghost (cook/maani-line#1)
 24.20  ---- ghost (cook/maani-line#1)
 24.83  ---- ghost (cook/maani-line#1)
 25.49  ---- ghost (cook/maani-line#1)
 25.58  tap on canvas
 25.59  ---- idle-bump (pointerdown)
 25.59  ---- act
 25.59  ---- idle-bump (touchstart)
 25.80  ---- idle-bump (pointermove)
 25.80  ---- poke
 26.55  ---- poke
 26.69  sfx sfx/flip starts
 26.88  sfx sfx/flip stops
 27.09  ---- poke
 27.80  ---- poke
 28.03  ---- idle-bump (pointermove)
 28.41  ---- poke
 29.11  ---- poke
 29.86  ---- poke
 30.00  sfx sfx/flip starts
 30.09  ---- idle-bump (pointermove)
 30.19  sfx sfx/flip stops
 30.55  ---- poke
 31.62  ---- poke
 32.00  sfx sfx/flip starts
 32.18  ---- idle-bump (pointermove)
 32.18  ---- poke
 32.20  sfx sfx/flip stops
 32.68  ---- poke
 32.99  ---- idle-bump (pointerup)
 33.25  sfx sfx/cook-right starts
 33.26  ---- step-open (3)
 33.26  ---- step-call (3)
 33.35  sfx sfx/pop starts
 33.47  sfx sfx/cook-right stops
 33.54  sfx sfx/pop stops
 33.83  ---- rung (cook/maani-line)
 33.83  ---- glow (on)
 33.88  ---- ghost (cook/maani-line#2)
 34.76  tap on canvas
 34.76  ---- idle-bump (pointerdown)
 34.76  ---- act
 34.76  ---- idle-bump (touchstart)
 34.77  ---- step-open (4)
 34.77  ---- step-call (4)
 34.90  sfx sfx/sizzle starts
 34.90  sfx sfx/sizzle-loop starts
 34.91  sfx sfx/noise:js/shared/sfx.js starts
 35.18  sfx sfx/sizzle stops
 35.18  sfx sfx/noise:js/shared/sfx.js stops
 36.05  sfx sfx/click starts
 36.06  ---- rung (maani-line:s14-control)
 36.06  ---- step-open (5)
 36.06  ---- step-call (5)
 36.22  sfx sfx/click stops
 36.65  ---- say-start (3)
(142 later lines left out)
```
