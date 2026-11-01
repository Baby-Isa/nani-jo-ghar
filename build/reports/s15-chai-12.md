# s15-chai-12: chai, Zafar's evening notes (1 Nov; builder report)

Branch `s15-chai-12` (from claude/nice-lovelace-0vfjcj 9518819). Not pushed.

## Proof
- **Before** shots and numbers come from a frozen copy of the base's game code (js, css, data and the sandbox at 9518819). The **after** ones come from this branch. Both were played by the sandbox's own fair player (`build/sandbox/lib/cook-player.mjs`) through a small probe of mine, which is not committed.
- Everything is in `build/screenshots/brief/s15-chai-12/<ROW>/{before,after}/`:
  - a `.json` per play: samples every 50 ms of each pan's state, heat and picture, the order rows' scroll, and every hint with the idle clock at that moment;
  - small JPEG shots;
  - a `compare-*.jpg` beside them for the judge.
- **Contract run:** cook:chai-tray at L1-L4 (see the end).
- **Checks:** `node build/tools/review/checks.mjs` is all green. The detail is at the end.

## Rows

### CHAI-61: done
- **Cause:** js/cook/stations/chai-tray.js:1413 (base). The heat tick ran only `if (pan.state === "heating" && !busy)`. `busy` counts a bottle in flight (the water or milk pour, `pourInto`), a take-back and a pour into a glass.
  - This was deliberate, from s14's contract-70: "Slow kar" waited for the pour, so every lit pan was held still for it.
  - So each paani or dudh added to another pan stopped every lit pan for the whole animation.
- **Fix:**
  - The boil now runs on its own clock, with no `busy` gate.
  - A pan that reaches the green during another pan's add is called at once ("Slow kar!", the knob's glow and tap, contract-70's moment). `refresh()` used to return early while busy; it now lets that one step through.
  - New read-only test hook: `Cook.chaiBusy`.
- **Proof** (speed 1: a child's pace, the fair player): `CHAI-61/{before,after}/boilclock-L2-1280x665.json` and `-L4-`.
  - A lit pan's heat frozen while another pan's add was in flight. L2: 4.2 s before, 0 after. L4: 4.6 s and 5.6 s before, 0 after.
  - The only frozen heat left after the fix is at the middle of the green. That is SH-158's first-time hold: at L1 and L3 it is 0.76 and 0.77.
  - The CHAI-62 after file shows Nana's heat climbing from 0.748 to 0.866 while `busy` was 1.
  - `boil-look-L2-*.jpg`: Ma's milk pours in while Nana's pan boils on.

### CHAI-62: done (a shared rule)
- **Cause:** js/shared/order-card.js:397-424 (`OrderCard.settle14`, the s14 card row every Cook game now uses). After a redraw the row went back to where it was scrolled, and it moved only for a new tick.
  - A boil-over calls `UI.mission.reopen`, which opens that person's rows again. So the row stayed scrolled to the end of a card that had started again.
- **Fix:** in the shared `settle14`, a card whose ticked rows have opened again glides back to its first item. It waits for the cards to slide back, then scrolls smoothly, logged as `row-home` (contract-72 reads it).
  - It applies to every start again: a boil-over, a redo, a take-back that reopens a row. It works on every card that uses the shared row, not just chai.
- **Proof** (returning player, the knob never turned down):
  - `CHAI-62/{before,after}/boilover-L2-1280x665.json` and `boilover-L3-740x320.json`: the boiled-over person's row is still at 359 and 272 px before, and 0 after. The other person's row is untouched.
  - Picture: `CHAI-62/compare-after-again-L2-1280x665.jpg`. Before, Nana's card still shows "trae khun, dudh na"; after, it is back on "paani, chai".

### CHAI-63: done (checked at every level; two fixes)
- **What I found:** the "nearly ready" look is the s14 milky boil picture (or the v3 foam past the green) and the painted steam. It is the same code at every level, but two things made it look missing above L1.
  1. js/cook/stations/chai-tray.js:797 (base): `boilAt = lo - 0.12` was a fixed amount of heat. L1's heat is slow (0.09/s) and L2-L4's quicker (0.12-0.13/s), so the boil came up later and for less time: 0.72 s before the green at L1, 0.45-0.73 s at L2-L4.
     - L1's first-time hold (SH-158) then keeps the pan in the green until the knob is tapped. So at L1 a new player sees the boil for as long as they like, and at L2-L4 for barely a second.
     - The steam started at a fixed fraction of heat too (chai-tray.js:1438), and was later still.
  2. js/cook/stations/chai-tray.js:180: black tea's boil stage (`"boil-tea": ["black"]`) was the plain black picture. A "dudh na" pan, which only exists from L2, never showed a boil at all.
- **Fix:**
  - The boil now comes up the same time before the green at every level: `boilAt = lo - rate x 2 s`. The steam starts at `boilAt`.
  - Black tea boils with v3's rolling black boil (`pan-boil-tea.webp`, already in the data's asset list). It is cut to the contents circle over the s14 black, the way the boil-over's foam already is. This is existing art, not new art.
- **Proof** (`CHAI-63/` and `CHAI-61/`, `boilclock-L1..L4-1280x665.json`, field `boilLead`, the time the boil picture is on screen before the green):

  | Level | Before | After |
  |---|---|---|
  | L1 | 0.72 s | 1.04 s |
  | L2 | 0.52-0.73 s | 1.14-1.26 s |
  | L3 | 0.45-0.61 s | 0.98-1.05 s |
  | L4 | 0.48-0.73 s | 0.91-1.11 s |

  - "Shown" counts from the boil's half-way point, so the full fade-in is 2 s at every level.
  - Pictures: `CHAI-63/compare-boil-look-L1-L4.jpg` (rows L1-L4, before on the left). The black pans now bubble at L2-L4.
- **For the judge:** v3's black boil is a little warmer in colour than the s14 black under it. An s14 black boil picture would be a line for the next art run (ART-32 already covers the boil-over).
- **Every Cook station that boils:**
  - The chai recipe (`recipe:chai`) uses this same station, so it gets the fix too.
  - The eggs prototype's pot has one look at every level: the ring's green and a steam puff at ready (js/cook/stations/eggs.js:403-423). No change.
  - The old one-pan "boil" part is a lab Part, not a played station. No change.
  - Nothing else boils.

### SH-183: done
- **Cause:** js/cook/stations/chai-tray.js:647 (base). The tray faces were at depth `D.item + 1` (31), under the tray's "quiet" veil `trayQuiet` (chai-tray.js:532, depth 31.1, page colour at 42%). That veil sits over the tray until the first pan is ready, so the faces were washed out, as in his 7-faded-faces.png.
  - The eggs prototype's plate faces were also at 31, under the eggs and plates' effects.
- **Fix:** a shared depth for tray and plate face badges, `Cook.D.badge` (44: over every picture, veil and effect, under only the helping hand; js/cook/stations.js:32). Chai's tray faces and the eggs' plate faces use it, at alpha 1.
  - No other game has tray or plate face badges. The burner faces on the hob are a different thing, so I left them alone.
- **Proof:**
  - `SH-183/{before,after}/faces-L3-*.json`: the tray badges were depth 31 under a 0.42 veil at 31.1; they are now 44. The eggs plates were 31 and are now 44.
  - Pictures: `SH-183/compare-1280x665.jpg` and `compare-740x320.jpg`, before on the left. The faces are now full contrast.
  - A first-time spotlight's dim still dims the faces with everything else. That is the spotlight's own job, and I left it.

### SH-184: done (the cause found in code; his exact moment not reproduced)
- **Cause:**
  1. Every hint (Nani's stepper, the kit's stuck rungs, chai's own) counts from the page's one idle clock (js/shared/guide.js:124-136). That clock restarts only at a tap, so it counted from the tap that began a pour.
     - A pour into a glass, or an add, lasts about 2 s at a child's pace. That ate the wait, so a hint came about 2 s "early" after every pour.
     - Measured: at the end of every add or pour, the clock had already run 1.8-2.4 s (`SH-184/before/boilclock-L4-1280x665.json`, `idleAtActionEnd`).
  2. Chai's control hint (js/cook/stations/chai-tray.js:2273-2287, base) was a one-shot timer from the step's opening. A pour or a spoon cancelled it for good, and it was blind to every other action. It did not use the shared clock.
- **Fix:**
  - New shared helper `Cook.Stations.acted()` (js/cook/station-lib.js) restarts the page's idle clock when a legitimate action ENDS. Chai calls it at the end of every pour into a glass, water or milk add, spoonful and take-back.
  - Chai's control hint now waits on the shared clock, from the later of the step's opening and the last action. Any action restarts it rather than cancelling it.
  - data/rules.json's `hintS` note now says this (SH-184).
- **Proof:** `SH-184/after/boilclock-L4-1280x665.json` `idleAtActionEnd`: 0.02-0.5 s after every pour or add, against 1.8-2.4 s before. The leftover is the 50 ms sampling and the station's "wait" ending a frame after the pour.
- **Not reproduced:** three slow plays at a child's pace never brought a hint before the fix or after it. They were L2, L3 and L4 at 1280x665, about 13 minutes in all, with an action every 0.55 of the level's wait (`CHAI-61/before/timeline-L2,L3`, `SH-184/before/timeline-L4`).
  - So the exact moment in his play is not reproduced. The two causes above are the only ways I found for a hint to come sooner than the level's wait after a right move.
- **Other games:** the shared clock already restarts at any tap in every game. `acted()` is there for any station with an animation that lasts; I only wired it in chai.

### CK-46 (reopened): done for placement; partly for the art
- **Cause:** js/cook/stations.js:48-50 (base). Nana, Ma and Ali are drawn with their hands and forearms resting forward on a table. At their old tops (181, 201, 296) the counter's back edge cut through those forearms (the occluder starts at y 611). Their forearms, Ma's elbows and Ali's arms lay on the counter top, as in his 8-elbows.png.
- **Fix** (placement only): each gets an `armTop`, the canvas row where their first forearm, elbow or hand begins, measured on the neutral canvas that every mood shares (Nana 333, Ma 326, Ali 296). Their top is computed as `615 - armTop x scale`, the same 4 px rule Nani has, so the counter's edge hides every forearm, elbow and hand.
  - The new tops are Nana 199, Ma 243, Ali 313.
  - Nani was already right (redrawn, hands in her lap).
- **Proof:** `CK-46/{before,after}/counter-L3-*.jpg` and `counter-L4-*.jpg`, at 1280x665 and 740x320. L4 has all three people.
  - Before, Ma's forearms, Nana's hands and Ali's forearms lie on the counter. After, none do, and everyone reads as behind the counter.
- **Still to do:**
  - Ma's and Ali's pictures are the old table pose. Lowered, their upper arms run straight down to the edge, which reads as seated but not as relaxed as Nani's redraw. Nana is the same.
  - ART-33 (the redraw seated, as Nani was) is still needed for all three.
  - Ma now sits lowest, 44 px lower than before, so the judge should look at the heights side by side.

### CHAI-60: done (the check)
- contract-78 (build/sandbox/lib/contract-s14.mjs:51) now judges only the first time each control comes up on a page. A second pot's "Chulo bar!" or a later "Slow kar!" is the call alone, under SH-181.
- "Comes up" means the control's words show in Nani's box, whether or not they are said. In this run, at L4 740x320, the player tapped the first pot's knob before "Chulo bar!" was said, so the first call actually said was the second pot's, with no light. That is right under SH-181, and the check now knows it.
- The fixture tests in build/sandbox/s14checks.test.mjs cover both cases.

## Contract run
- **Command:** `run.mjs --flow cook:chai-tray,cook:chai-tray@L2,cook:chai-tray@L3,cook:chai-tray@L4 --sizes 1280x665,740x320 --contract` (run `s15-chai-12-contract`, in `build/screenshots/sandbox/`).
- **Result:** 8 pages, every one reached its end.
  - First pass: one contract-78 break, the case above.
  - With the check fixed and the saved run judged again (`--all --from-run s15-chai-12-contract --contract`): **CONTRACT PASSED: 0 breaks over 8 pages**.
- 930x430 and 1920x1080 were not run, to save time.
- **For Zafar (CHAI-58):** with the boil now running through the adds (CHAI-61), the sandbox player boiled Ma's pot over twice at L4. It is quick at speed 3: L4's green lasts about 0.6 s, or 1.7 s at a child's pace. This is the tight L4 window that CHAI-58 already holds open.

## Checks
`node build/tools/review/checks.mjs`: all green.
- unit: 623 passed, 0 failed.
- Also green: words, static, leak, bump, specs, docs, fixlist, recordings, size.
- load: 29/29 pages load only what is on their screen.
- build/reports/snap-leakbot.md was not changed.
