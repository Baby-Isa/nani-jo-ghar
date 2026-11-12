# s19-clean-chai: chai's open rows and check faults (12 Nov)

Opus, high. Branch `s19-clean-chai`, never pushed. Only `js/cook/stations/chai-tray.js` changed; nothing Zafar signed off changed in look.

## Flaws first
- **No before folders**: the spec's `rows` is empty, so `--after` has nothing to pair. My before is a contract run on the base (`s19-clean-chai-before`), played at launch.
- **Load 18-33 on 4 cores all session**: the timing checks (36, 106, 18, 104, 112) rose with it.
- **One of my fixes taken back.** Holding the help's glow for its light box (contract-102) made the glow 0.6-2.2 s late under load, so L1's first water fell back to Nani's pause (new contract-24 and -107 at all four sizes). The glow comes with its light again, as signed off. Contract-102 and -107 at 1920x1080 are now check questions (below).
- **CHAI-89 (contract-115)**: chai's hob is 65% of the room above the band at 1280x665. The check wants 70%, but SH-245 makes chai's hob the reference. A taller hob changes chai's look: **a question for Zafar**, or the check takes chai's share as its floor.
- **CHAI-111 not reproduced** with Zafar's exact steps (speed 1, 1480x750 at dpr 2, 90 s on the end screen, resize to 736x750, Play again, 40 s idle). The water hint came at 7 s. Every idle-clock bump is now logged.
- check-change: CHECKCHANGE_LINE

## What changed
1. The order card's light stays on the card it lit and waits for the count chip (contract-79 6→2).
2. A right tap ends its step's light (106).
3. The knob's light and "Slow kar!" come as the ring enters the green (CHAI-58, CHAI-24; 70 4→1).
4. A control's first-time light is spent only once it is up (SH-178; 78).
5. A help's glow goes with its light (102) and comes with it at once.

## Rows
- **CHAI-19, -65** (113) and **CHAI-49, -56, -60, -83** (78): 0 breaks before and after. To judge.
- **CHAI-58, CK-65's chai part**: `green-check.mjs` shows chai's L4 green at 2000 ms; corn's is at least chai's at every level.
- **CHAI-104**: only contract-73 fails (`.cv-spk` is 47 px), but its `::before` gives a 48 px tap: a check fault.
- **CK-78**: chop's, not chai's. **CHAI-76**: the shared box's (below).
- **CHAI-95-100, -103, -107**: in code; they need Zafar's eye and ear.

## Zafar, 12 Nov: kari and mori chai
At L3 and L4 a named cup is said as its person's full sentence, and the card's headline names it. It is spelt kari: there is no "khari" in js/ or data/. Frames are in `build/screenshots/sandbox/s19-clean-chai-kari/evidence/` (1280x665, the child listening through):
- L3, "Muke kari chai khape, ba khun, dudh na.": `cook-chai-tray-l3-order-whole-…/chai-kari-p2-l3-1280x665-h4-c0-room.png` (the bubble and the card), and `-h6-` (the card's rows).
- L4, "Muke kari chai khape, trae khun, adh, dudh na.": `cook-chai-tray-l4-order-whole-…/chai-kari-p2-l4-1280x665-h7-c0-room.png`.
- Mori, said: `s19-clean-chai-named2/evidence/…l3-speed1…kari-mori/`.

A named cup comes in about 10% of L3 orders and 13% of L4. **Recording sheet**: kari and mori are not recorded. The default test player taps the pop-up after the first person, so to hear a later person, use `#order-whole`.

## For s19-clean-a4 (files I don't own)
- contract-36 (`contract-s19b.mjs:466`): change `n.t >= s.t - 1000` to `n.t >= s.t - CALL_BEFORE`.
- contract-102 and -107: a glow or hop that starts with the rung belongs to its light, even when the light box is painted late (1.3 s at 1920x1080).
- contract-73: measure `.cv-spk` with its `::before`. contract-113: no canvas pair under `.njg-wo-open`. contract-115: chai's hob is the reference.
- `ui.js`: `NaniGuide.markSaid` the helper's line when queued (22, "Dudh wiji chad!" twice). CHAI-76: show the blurred word whole once her card opens.

## Proof
- Before and after (`s19-clean-chai-before`, `-after`): chai L1-L4, #mistake, #hint, #returning and L3 #serve-wrong at 740x320 and 1280x665. 15 of 16 pages reach their end in both runs (L4 740x320 times out in both: the test player), with 0 page errors. Down: 70, 79, 99, 72, 113, 22, 107. Up: the timing checks.
- Four sizes (`s19-clean-chai-contract`, 5e59a574e): 4 of 4 pages reach their end, 0 page errors, 12 breaks:
  - 36 ×5: the check fault above.
  - 102 ×2 and 107 ×1: the light box painted late.
  - 106 ×2: the kit's light stays on the press.
  - 119 ×2: SH-267's dish flash, shared.
  - contract-24 is back to 0.
- `checks.mjs`: 13 steps ok (unit 890 pass, 0 fail). The load check was not run (it needs a browser).
- check-change: CHECKCHANGE_FILE
- QA: builder checks only; no Kutchi invented.
