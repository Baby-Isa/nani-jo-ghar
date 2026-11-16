# MAA-21 (open) · Cook: maani

**Issue:** The first rolls stop at the board's edge (Zafar, 9 Nov, his tester, a new player on his phone: "The person didn't really see or realize the fact that there was like a size guide for the Marnie. She just rolled as quickly as possible until it couldn't roll anymore. So my suggestion is, and let's log this for this sprint or this section of change, this round of changes. I think at the beginning, there's a hard stop around the perimeter of, or maybe just inside the perimeter of the rolling board."); it changes his 8 Nov, maani L1: "once it's reached the right size maybe the first time you do the maani it stops you rolling at the right size you hit the size guide it will have a highlight ... in pulsating yellow ... the juice sound is for rolling into the right size ... then the highlight comes on and prompts you to click it but there shouldn't be the finger to click it then"

**Check:** auto: maani at L1, L2, L3 and L4 as a new player: before the big/small level a flat-out roll stops at the board's rim or just inside it with no tear, the juice sound in the sound log, no finger on the tap

**Source:** docs/feedback/kitchen-play-2026-11-08.md P7; docs/feedback/kitchen-mocks-2026-11-09.md P3; docs/feedback/kitchen-mocks-2026-11-09.md P38

**Status now:** to fix: check (built, the sweep's FIXED-IN-CODE and s19-clean-c passes the contract; its probe not run; to judge) · Sprint 19 (his "let's log this for this sprint") · told again 9 Nov (docs/feedback/kitchen-mocks-2026-11-09.md P3), changed: cause: the dough grows to 1.45 times the ring and tears at 1.3 (roll.js:248-249, data/cook.json:2888-2889), the ring drawn at every level (roll.js:158-185), the ghost finger on the tap (maani-line.js:376-381); fix: before the big/small lesson (MAA-23) the roll stops hard at the chakla's rim or just inside it (his "around the perimeter of, or maybe just inside": the place tried on the lab page at the four sizes), never tearing there, the juice sound at the stop, no finger on the tap; the ring not shown until the lesson (decision 1 to confirm)

## Probes

- MAA-21-p1-L1-1280x665: cook:maani-line L1 @ 1280x665 [p-fresh], at kind-roll: reached 1x (rec:kind-roll 16.5s) · the first rolls filmed 8 s through the roll: stop at the board's rim, no tear
- MAA-21-p1-L2-1280x665: cook:maani-line@L2 L2 @ 1280x665 [p-fresh], at kind-roll: reached 1x (rec:kind-roll 39.5s) · the first rolls filmed 8 s through the roll: stop at the board's rim, no tear

## Panels (`build/screenshots/evidence/r16pb-newsh/MAA-21.png`, `build/screenshots/evidence/r16pb-newsh/MAA-21-2.png`, `build/screenshots/evidence/r16pb-newsh/MAA-21-3.png`)

- **A**: cook:maani-line L1 1280x665 [p-fresh] · strip:#game:32x250 at rec:kind-roll
- **B**: cook:maani-line@L2 L2 1280x665 [p-fresh] · strip:#game:32x250 at rec:kind-roll

## Text captures

#### MAA-21-p1-L1-1280x665 · strip:#game:32x250 at rec:kind-roll

```
a film of 32 frames, every 250 ms (8.0 s), from rec:kind-roll; the sheet shows the 7 frames where the picture changed (*)
the page's own recorder (265 animation frames): the order row's scroll moved at most 0 px between two frames (0 moves over 0 ms); a card of the row moved at most 0 px on screen between two frames; the big card was up in 0 frames, at most 0 cards in flight; most of a card over a face: 0 px2 (265 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0      28   0.00                              0     0      -  5
  1*     250     250  44.40                              0     0      -  5
  2      500     501   0.12                              0     0      -  5
  3      750     750   0.08                              0     0      -  5
  4     1000    1000   0.06                              0     0      -  5
  5     1250    1250   0.06                              0     0      -  5
  6*    1500    1499  76.59                              0     0      -  5
  7*    1750    1750  76.55                              0     0      -  5
  8     2000    2001   0.07                              0     0      -  5
  9*    2250    2250  76.55                              0     0      -  5
 10*    2500    2500  76.49                              0     0      -  5
 11     2750    2750   0.12                              0     0      -  5
 12     3000    3000   0.04                              0     0      -  5
 13     3250    3250   0.10                              0     0      -  5
 14     3500    3500   0.10                              0     0      -  5
 15     3750    3750   0.03                              0     0      -  5
 16     4000    4000   0.10                              0     0      -  5
 17     4250    4250   0.00                              0     0      -  5
 18     4500    4499   0.11                              0     0      -  5
 19     4750    4750   0.01                              0     0      -  5
 20     5000    5001   0.12                              0     0      -  5
 21     5250    5251   0.08                              0     0      -  5
 22     5500    5500   0.05                              0     0      -  5
 23     5750    5751   0.10                              0     0      -  5
 24     6000    6000   0.00                              0     0      -  5
 25     6250    6250   0.08                              0     0      -  5
 26     6500    6499   0.01                              0     0      -  5
 27     6750    6750   0.10                              0     0      -  5
 28     7000    7000   0.07                              0     0      -  5
 29     7250    7251   0.06                              0     0      -  5
 30     7500    7500   0.07                              0     0      -  5
 31*    7750    7750   0.06                              0     0      -  5
```

#### MAA-21-p1-L1-1280x665 · voice (seconds from the page's start; ---- a lifecycle step; >>>> the probe's moment)

```
  1.17  ---- cover (shown)
  1.92  ---- order-count (1)
  1.92  ---- order-level (1)
  1.98  ---- poke
  3.04  ---- cover (lifted)
  3.86  ---- ghost (conversation:pill)
  8.01  ---- request (cook:order)
  8.03  ---- dish-flash (nana)
  8.04  ---- pop-face (0)
  8.04  ---- order-pass
  8.04  ---- card-fold (nana)
  8.15-10.21  cook: "Muke hakri bajr ji maani khapeti,"  [device-voice: speechSynthesis + mum/hakri.mp3 + speechSynthesis + speechSynthesis + mum/maani-rc.mp3 + mum/khapeti.mp3]
  8.15  ---- say-start (1)
  8.16  ---- pop-face (0)
 10.15  ---- say-end (1)
 10.21  ---- idle-bump (pointerdown)
 10.21  ---- skip-zone (play)
 10.21  tap on div.njg-rq-veil.njg-rq-along.njg-rq-open
 10.22  ---- order-skip (15)
 10.22  ---- idle-bump (pointerup)
 10.26  ---- stage-start (cook:station)
 10.26  ---- poke
 10.50  ---- band (maani-line)
 10.55  ---- step-open (1)
 10.55  ---- step-call (1)
 11.75  ---- rung (cook/maani-line)
 11.77  ---- glow (on)
 15.42  ---- idle-bump (pointerdown)
 15.42  ---- act
 15.42  tap on canvas
 15.42  sfx sfx/cook-pop starts
 15.43-15.92  cook: "maani"  [family-ok: mum/maani-rc.mp3]
 15.43  ---- say-start (2)
 15.43  ---- idle-bump (pointerup)
 15.60  sfx sfx/cook-pop stops
 15.63  ---- step-open (2)
 15.63  ---- step-call (2)
 15.68  sfx sfx/pop starts
 15.76  ---- say-end (2)
 15.86  sfx sfx/pop stops
 16.54  >>>> moment rec:kind-roll
 16.65  ---- rung (cook/maani-line)
 16.66  ---- glow (on)
 16.77  ---- ghost (cook/maani-line#1)
 17.38  ---- ghost (cook/maani-line#1)
 17.94  ---- ghost (cook/maani-line#1)
 18.47  ---- ghost (cook/maani-line#1)
 19.09  ---- ghost (cook/maani-line#1)
 19.63  ---- ghost (cook/maani-line#1)
 20.21  ---- ghost (cook/maani-line#1)
 20.78  ---- ghost (cook/maani-line#1)
 21.31  ---- ghost (cook/maani-line#1)
 21.84  ---- ghost (cook/maani-line#1)
 22.38  ---- ghost (cook/maani-line#1)
 22.65  ---- help (idle)
 22.93  ---- ghost (cook/maani-line#1)
 23.47  ---- ghost (cook/maani-line#1)
 24.01  ---- ghost (cook/maani-line#1)
 24.58  ---- ghost (cook/maani-line#1)
 25.14  ---- ghost (cook/maani-line#1)
 25.71  ---- ghost (cook/maani-line#1)
 26.29  ---- ghost (cook/maani-line#1)
 26.82  ---- ghost (cook/maani-line#1)
 27.39  ---- ghost (cook/maani-line#1)
 28.00  ---- ghost (cook/maani-line#1)
 28.61  ---- ghost (cook/maani-line#1)
 29.21  ---- ghost (cook/maani-line#1)
 29.76  ---- ghost (cook/maani-line#1)
 30.02  ---- idle-bump (pointerdown)
 30.02  ---- act
 30.02  tap on canvas
 30.09  ---- idle-bump (pointermove)
 30.09  ---- poke
 30.44  sfx sfx/flip starts
 30.50  sfx sfx/flip starts
 30.61  sfx sfx/flip stops
 30.69  sfx sfx/flip stops
 30.74  ---- poke
 31.27  ---- poke
 31.85  ---- poke
 31.91  sfx sfx/flip starts
 32.09  sfx sfx/flip stops
 32.15  ---- idle-bump (pointermove)
 32.40  ---- poke
 32.57  ---- idle-bump (pointerup)
 32.86  sfx sfx/cook-right starts
 32.87  ---- step-open (3)
 32.87  ---- step-call (3)
 32.87  sfx sfx/pop starts
 33.03  sfx sfx/cook-right stops
 33.05  sfx sfx/pop stops
 33.33  ---- rung (cook/maani-line)
 33.33  ---- glow (on)
 33.38  ---- idle-bump (pointerdown)
 33.38  ---- act
 33.38  tap on canvas
 33.39  ---- step-open (4)
 33.39  ---- step-call (4)
 33.57  sfx sfx/sizzle starts
 33.57  sfx sfx/sizzle-loop starts
(133 later lines left out)
```

#### MAA-21-p1-L2-1280x665 · strip:#game:32x250 at rec:kind-roll

```
a film of 32 frames, every 250 ms (8.0 s), from rec:kind-roll; the sheet shows the 6 frames where the picture changed (*)
the page's own recorder (139 animation frames): the order row's scroll moved at most 0 px between two frames (0 moves over 0 ms); a card of the row moved at most 0 px on screen between two frames; the big card was up in 0 frames, at most 0 cards in flight; most of a card over a face: 0 px2 (139 frames had face boxes)
frame slot_ms real_ms change  pop-out                  flying  row  bubbles  faces
  0*       0      38   0.00                              0     0      -  5
  1      250     251   0.02                              0     0      -  5
  2      500     613   0.12                              0     0      -  5
  3      750    1260   0.00                              0     0      -  5
  4     1000    1583   0.00                              0     0      -  5
  5     1250    1760   0.03                              0     0      -  5
  6     1500    2028   0.08                              0     0      -  5
  7*    1750    2291  76.67                              0     0      -  5
  8     2000    2533   0.10                              0     0      -  5
  9     2250    2691   0.01                              0     0      -  5
 10*    2500    3094  76.60                              0     0      -  5
 11     2750    3305   0.13                              0     0      -  5
 12     3000    3445   0.14                              0     0      -  5
 13*    3250    4061  76.55                              0     0      -  5
 14     3500    4348   0.17                              0     0      -  5
 15     3750    4496   0.17                              0     0      -  5
 16     4000    4798   0.00                              0     0      -  5
 17*    4250    5065  76.51                              0     0      -  5
 18     4500    5179   0.13                              0     0      -  5
 19     4750    5347   0.13                              0     0      -  5
 20     5000    5621   0.02                              0     0      -  5
 21     5250    5955   0.10                              0     0      -  5
 22     5500    6108   0.04                              0     0      -  5
 23     5750    6320   0.01                              0     0      -  5
 24     6000    6640   0.02                              0     0      -  5
 25     6250    7040   0.06                              0     0      -  5
 26     6500    7411   0.00                              0     0      -  5
 27     6750    7559   0.07                              0     0      -  5
 28     7000    7717   0.06                              0     0      -  5
 29     7250    8194   0.02                              0     0      -  5
 30     7500    8499   0.00                              0     0      -  5
 31*    7750    8645   0.11                              0     0      -  5
```

#### MAA-21-p1-L2-1280x665 · voice (seconds from the page's start; ---- a lifecycle step; >>>> the probe's moment)

```
(22 earlier lines left out)
 22.81  sfx sfx/reveal stops
 25.44  ---- idle-bump (pointerdown)
 25.44  tap on button.wc14-dots.wc14-k-dots
 25.44  ---- idle-bump (pointerup)
 25.45  sfx sfx/reveal starts
 25.64  sfx sfx/reveal stops
 26.62  tap on button.wc14-dots.wc14-en-dots
 26.62  sfx sfx/reveal starts
 26.78  sfx sfx/reveal stops
 27.73  ---- pop-face (0)
 27.74-28.99  cook: "hakri wadhi maani,"  [device-voice: mum/hakri.mp3 + speechSynthesis + mum/maani-rc.mp3]
 27.74  ---- say-start (2)
 28.87  ---- say-end (2)
 30.23  ---- pop-face (0)
 30.23  ---- row-glide (57)
 30.23-30.25  cook: "hakri nindhi maani."  [family-unchecked: mum/hakri.mp3]
 30.23  ---- say-start (3)
 30.25  ---- idle-bump (pointerdown)
 30.25  tap on div.njg-rq-veil.njg-rq-along.njg-rq-open
 30.25  ---- skip-zone (play)
 30.34  ---- order-skip (84)
 30.34  ---- idle-bump (pointerup)
 30.44  ---- stage-start (cook:station)
 30.44  ---- poke
 30.70  ---- say-end (3)
 31.42  ---- band (maani-line)
 31.51  ---- word-moment (maani-line)
 31.51  ---- step-open (maani-line:big-small)
 32.72  sfx sfx/click starts
 32.78  ---- say-start (4)
 32.78-33.84  cook: "nindhi maani"  [family-ok: mum/nindhi-rc.mp3 + mum/maani-rc.mp3]
 32.91  sfx sfx/click stops
 33.78  sfx sfx/click starts
 34.02-34.82  cook: "wadhi maani"  [device-voice: speechSynthesis + mum/maani-rc.mp3]
 34.04  ---- say-end (4)
 34.04  ---- say-start (5)
 34.04  sfx sfx/click stops
 34.76  ---- say-end (5)
 34.83  ---- step-open (1)
 34.83  ---- step-call (1)
 35.46  ---- rung (cook/maani-line)
 35.47  ---- glow (on)
 36.93  tap on canvas
 36.93  ---- idle-bump (pointerdown)
 36.93  ---- act
 36.94  sfx sfx/cook-pop starts
 36.97-37.95  cook: "millet chapati"  [silent: silent line (its words' clip lengths)]
 36.97  ---- say-start (6)
 36.97  ---- say-end (6)
 36.97  ---- idle-bump (pointerup)
 37.23  ---- step-open (2)
 37.23  ---- step-call (2)
 37.36  sfx sfx/pop starts
 37.38  sfx sfx/cook-pop stops
 37.51  sfx sfx/pop stops
 37.87  ---- ghost (cook/maani-line#1)
 37.99  ---- rung (cook/maani-line)
 38.00  ---- glow (on)
 38.64  ---- ghost (cook/maani-line#1)
 39.29  ---- ghost (cook/maani-line#1)
 39.45  >>>> moment rec:kind-roll
 39.98  ---- ghost (cook/maani-line#1)
 40.84  ---- ghost (cook/maani-line#1)
 41.58  ---- ghost (cook/maani-line#1)
 42.11  ---- ghost (cook/maani-line#1)
 42.66  ---- ghost (cook/maani-line#1)
 43.37  ---- ghost (cook/maani-line#1)
 44.02  ---- ghost (cook/maani-line#1)
 44.64  ---- ghost (cook/maani-line#1)
 45.18  ---- ghost (cook/maani-line#1)
 45.77  ---- ghost (cook/maani-line#1)
 46.29  ---- help (idle)
 46.35  ---- ghost (cook/maani-line#1)
 46.99  ---- ghost (cook/maani-line#1)
 47.89  ---- ghost (cook/maani-line#1)
 48.45  ---- ghost (cook/maani-line#1)
 49.05  ---- ghost (cook/maani-line#1)
 49.62  ---- ghost (cook/maani-line#1)
 50.20  ---- ghost (cook/maani-line#1)
 50.81  ---- ghost (cook/maani-line#1)
 51.54  ---- ghost (cook/maani-line#1)
 52.16  ---- ghost (cook/maani-line#1)
 52.77  ---- ghost (cook/maani-line#1)
 53.41  ---- ghost (cook/maani-line#1)
 54.06  ---- ghost (cook/maani-line#1)
 54.66  ---- ghost (cook/maani-line#1)
 55.38  ---- ghost (cook/maani-line#1)
 55.91  tap on canvas
 55.91  ---- idle-bump (pointerdown)
 55.91  ---- act
 56.15  ---- idle-bump (pointermove)
 56.15  ---- poke
 56.97  ---- poke
 57.63  ---- poke
 58.26  ---- idle-bump (pointermove)
 58.26  ---- poke
 58.26  sfx sfx/flip starts
 58.47  sfx sfx/flip stops
 59.06  ---- poke
 60.06  ---- poke
 60.28  ---- idle-bump (pointerup)
 60.78  sfx sfx/cook-right starts
 60.83  ---- step-open (3)
 60.83  ---- step-call (3)
 60.96  sfx sfx/pop starts
 60.97  sfx sfx/cook-right stops
 61.13  sfx sfx/pop stops
 61.28  ---- idle-bump (pointerdown)
 61.28  ---- act
 61.28  tap on canvas
 61.29  ---- step-open (4)
 61.29  ---- step-call (4)
 61.54  sfx sfx/sizzle starts
 61.54  sfx sfx/sizzle-loop starts
 61.54  sfx sfx/noise:js/shared/sfx.js starts
 61.78  sfx sfx/sizzle stops
 61.78  sfx sfx/noise:js/shared/sfx.js stops
 62.71  sfx sfx/click starts
 62.72  ---- rung (maani-line:s14-control)
 62.73  ---- step-open (5)
(204 later lines left out)
```
