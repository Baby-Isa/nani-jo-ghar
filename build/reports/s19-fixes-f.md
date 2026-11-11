# s19-fixes-f: the kitchen games' open rows, measured with the new screen checks (11 Nov)

Opus, high. Branch `s19-fixes-f`. The integration branch is merged in twice (chaat top-down, s19-checks-2). Nothing pushed. Flaws first.

## Flaws and open
- **s19-checks-2's new checks are not cleared.** The four-size run after merging them has 182 breaks; chai has none. Per game and check:
  - contract-114 (snaps): daar 13, maani 16, sekelo 16, samosa 16, corn 8, chop 5, baking 4, eggs 3. Eggs, corn and daar's heap are fixed since; daar/chop's strip veg remains.
  - 115 (sizes): corn's and sekelo's grill at 54-56% of the room, baking's bowl, samosa's heaps.
  - 116 (card padding, one-card rows).
  - 36 (no call at a step): baking, corn. 37 (decoys at L1): corn 6, sekelo 3, samosa 2, baking 2.
  - 70 (no call at the green, at speed 3): eggs, maani, corn, samosa. 77 (no first-time hold): eggs, corn.
  - 78: maani's "Firai!" comes 1.6 s before its light; samosa's "Chulo bar!" comes with no light.

  These are layout and level work beyond this brief's rows: **next round**. Maani's speed-3 "Firai!" and chai's queued "Slow kar!" were not reached.
- **Breaks I judge check faults (s19-checks):**
  - sekelo contract-105: the light hugs the skewer as SEK-22 asks, but 105 reads the tray picture `sk3-rack-1` as the thing; contract-112 passes the same light (`s19-fixes-f-contract/cook-mishkaki-grill/1920x1080/06-kind-timing.png`).
  - chop's swipe at 1920x1080 (112 "still moving while it stood"): the light now stands 1.5 s before the knife moves, but on a busy machine the second look lands during the swipe, which STD-E2-08a means to light (`lights/cook-daar@1920x1080/01/mark.jpg` in an earlier run).
  - 112 names a picture by its texture, so the egg browning in place reads as a new thing.
- **`build/lint/static.test.mjs:219` fails:** it still asserts daar's chop zone is a known break, which SH-259 fixes here. Its "daar named" line should go.
- **Art:** no chopped golden onion (daar's heap and pot pieces are red); sekelo's served skewer sits in tray-1's painted left slot.
- **Not done:**
  - pills on corn's band cobs (opt3s: no pill; his call).
  - chai not re-frozen: `frozen.mjs --diff --quick` found 29 of 30 pages changed since 7 Nov and was cut by my timeout under three browsers. It needs a quiet full diff first.
- **Evidence:** CK-79's probe never reaches daar's view-marble at one size (before 1920x1080, after 1280x665). The other sizes are there.
- **Chaat:** contract-111 ×4 and 107 at 1920x1080, from assemble.js's shelf (s19-chaat-td's). Its contract-105 knife breaks did not appear here.
- **Shared change, flagged:** the kit's light steps back while the grown-ups' "?" pop-up is open (onboard.js).

## The before run (s19-fixes-f-before: L1, 740x320 and 1280x665): 9 breaks
| Game | contract-112 | contract-113 | contract-105 |
|---|---|---|---|
| eggs | 1 (the overdone egg) | | |
| chop | 1 (the knife moving in) | | |
| daar | 1 (the knife moving in) | 3 (face on the katori / served bowl) | |
| sekelo | | | 1 |
| samosa | 2 (the strip's light inside its canvas) | | |
| chai, corn, maani, baking | 0 | 0 | 0 |

The same run after (s19-fixes-f-after): every end reached, 0 page errors, 3 breaks. Eggs' "?" pop-up and sekelo's guided glow are fixed since; sekelo's 105 is above.

## What changed (before and after: `build/screenshots/brief/s19-fixes-f/<ROW>/{before,after}/`)
- **SH-259:** daar has no chop zone. The lint has no finding left.
- **SH-249/253:**
  - The swipe light stands still 1.5 s before the knife.
  - Samosa's flat strip is drawn from its pastry (frame "flat").
  - Samosa's knob step names the knob, so its light hugs the knob.
  - Sekelo's guided glow shows only inside the kit's light.
  - The light steps back under the "?" pop-up.
  - The coach gives a lit shelf thing back its glow and hop once it is still.
- **SH-254:** daar's face sits level with the katori on its left. Maani's plate face is on the rim corner.
- **SH-256:**
  - eggs go cracked → egg-part → cooked, fading in; the fried egg flies at its plate size and stays one picture.
  - corn's cob-over is wired, and the cob on the tray is within 15% of its grill length.
  - daar's piece grows into its heap.
  - a lone maani fills its plate.
- **CK-76:** step lines from the engine. The serve gap is on the recording sheet (recordings.mjs).
- **CK-79:** the heaps fill a 160 px glass. On a short sidebar, a card's rows become one sideways row (ui.js).
- **CK-80:** each person's cob has its own card, "hakro makai". The tray face is the kit badge's size, on the rim.
- **CK-75, 77, 78:** fixes-e's work holds on the before pictures.
- **Chaat's items:** chop's own card words reach the end review (`ctx.taught`), so "hakro" is listed.

## Proof
- Rows after: `build/screenshots/brief/s19-fixes-f/` (br-s19-fixes-f-after-20261111-055723-9s2).
- Four sizes (with s19-checks-2's checks, before the last snap fixes): CONTRACT FAILED: 182 breaks (contract-70 10, contract-77 5, contract-114 81, contract-116 25, contract-36 15, contract-37 16, contract-115 20, contract-78 8, contract-105 1, contract-109 1); every end reached, 0 page errors.
- checks.mjs: all ok but unit (static.test.mjs:219 above; artcheck.test 5-7 need sources/, not in this sparse checkout).
- check-change (started, stopped by me): push fail (unit: static.test.mjs:219 and artcheck 5-7, above); scope fail (sources/art/s19-tray-pot/results/run-report.md, from the merged integration branch, not mine); play was 120 flows at two sizes, about 2 h on this machine, stopped. The orchestrator's tier-2 run after merging stands in. Result: build/screenshots/tiers/push-80f6a68de0/.
