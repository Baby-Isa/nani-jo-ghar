# s19-clean-chai: chai's open rows and check faults (12 Nov)

Only `js/cook/stations/chai-tray.js` changed; nothing Zafar signed off changed in look. Never pushed.

## Flaws first
- **No before folders** (the spec's `rows` is empty): the before is a contract run on the base (`s19-clean-chai-before`).
- Load 18-33 on 4 cores inflated the timing checks.
- **One of my fixes taken back.** Holding the help's glow for its light box (contract-102) made the glow 0.6-2.2 s late under load, so L1's first water fell back to Nani's pause. The glow comes with its light again, as signed off; 102 and 107 are check questions (below).
- **CHAI-89 (contract-115)**: chai's hob is 65% of the room above the band at 1280x665. The check wants 70%, but SH-245 makes chai's hob the reference. A taller hob changes chai's look: **a question for Zafar**, or the check takes chai's share as its floor.
- **CHAI-111 not reproduced** with Zafar's exact steps (speed 1, 1480x750 at dpr 2, 90 s on the end screen, resize to 736x750, Play again, 40 s idle). The water hint came at 7 s.
- **check-change not finished.** I stopped it at 19 of 38 pages to take in s19-clean-a4's merge. Its scope audit fails anyway, on another session's `sources/art/s19-tray-pot/results/run-report.md`.

## What changed
1. The order card's light stays on the card it lit and waits for the count chip (contract-79 6→2).
2. A right tap ends its step's light (106).
3. The knob's light and "Slow kar!" come as the ring enters the green (CHAI-58, CHAI-24; 70 4→1).
4. A control's first-time light is spent only once it is up (SH-178; 78).
5. A help's glow goes with its light (102) and comes with it at once.
6. SH-268 (from s19-clean-a4): a bottle set back on the shelf gets its soft shadow back in the same moment. (contract-120 at L2-L3: 1 → 0).

## Rows
- **CHAI-19, -65** (113) and **CHAI-49, -56, -60, -83** (78): 0 breaks before and after. To judge.
- **CHAI-58, CK-65 (chai)**: `green-check.mjs`: chai L4 green 2000 ms; corn's at least chai's.
- **CHAI-104**: only contract-73 fails (`.cv-spk` is 47 px), but its `::before` gives a 48 px tap: a check fault.
- **CK-78**: chop's, not chai's. **CHAI-76**: the shared box's (below).
- **CHAI-95-100, -103, -107**: in code; they need Zafar's eye and ear.

## Zafar, 12 Nov: kari and mori chai
At L3 and L4 a named cup is said as its person's full sentence, and the card's headline names it. Spelt kari: no "khari" in js/ or data/. Frames are in `build/screenshots/sandbox/s19-clean-chai-kari/evidence/` (1280x665, the child listening through):
- L3, "Muke kari chai khape, ba khun, dudh na.": `cook-chai-tray-l3-order-whole-…/chai-kari-p2-l3-1280x665-h4-c0-room.png` (the bubble and the card), and `-h6-` (the card's rows).
- L4, "Muke kari chai khape, trae khun, adh, dudh na.": `cook-chai-tray-l4-order-whole-…/chai-kari-p2-l4-1280x665-h7-c0-room.png`.
- Mori, said: `s19-clean-chai-named2/evidence/…l3-speed1…kari-mori/`.

A named cup comes in about 10% of L3 orders and 13% of L4. **Recording sheet**: kari and mori are not recorded. The default test player skips after the first person: use `#order-whole`.

## For s19-clean-a4 (files I don't own)
- contract-36 (`contract-s19b.mjs:466`): change `n.t >= s.t - 1000` to `n.t >= s.t - CALL_BEFORE`.
- contract-102 and -107: a glow or hop that starts with the rung belongs to its light, even when the light box is painted late (1.3 s at 1920x1080).
- contract-73: measure `.cv-spk` with its `::before`. contract-113: no canvas pair under `.njg-wo-open`. contract-115: chai's hob is the reference.
- `ui.js`: `NaniGuide.markSaid` the helper's line when queued (22, "Dudh wiji chad!" twice). CHAI-76: show the blurred word whole once her card opens.

## Proof
- Before and after (`s19-clean-chai-before`, `-after`): chai L1-L4 and four paths at 740x320 and 1280x665: 15 of 16 ends in both (L4 740x320 times out in both), 0 page errors.
- SH-268 (`s19-clean-chai-shade-before` → `-shade-after`, chai L2-L3): contract-120 went from 1 to 0, 4 of 4 ends. contract-121 (shared, a4's) 1 at L3: the lesson's light misses its slot.
- Four sizes (`s19-clean-chai-contract`, ad80e0afa): 4 of 4 ends, 0 page errors, `CONTRACT FAILED: 3 breaks (contract-36 2, contract-107 1)`.
- `checks.mjs`: 13 steps ok (unit 897 pass, 0 fail). The load check was not run (it needs a browser).
