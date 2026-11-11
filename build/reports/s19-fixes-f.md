# s19-fixes-f: the kitchen games' open rows, measured with the new screen checks (11 Nov)

Opus, high. Branch `s19-fixes-f` (integration merged in at 1d3d11c0f for chaat's items), never pushed. Flaws first.

## Flaws and open
- **Two breaks left, both judged check faults (s19-checks owns them):**
  - eggs, 1280x665 `help-open` (contract-112, "2 lit regions"). The second region is the white "Play as new" button of the grown-ups' "?" pop-up, drawn over the dim. The light itself is one box round the egg. Picture: `build/screenshots/sandbox/s19-fixes-f-after/lights/cook-eggs@1280x665/04/mark.jpg`. Two fixes: lightjudge masks the page's own pop-ups, or the kit's light steps back while that pop-up is open. That second one is Zafar's call.
  - sekelo, rack light (contract-105). The light hugs the skewer, as SEK-22 asks ("the whole skewer ... fairly tight"). contract-105 takes the tray picture `sk3-rack-1` as the thing because the skewer is painted into it. contract-112 passes the same light. This is one of the quick checks the check sort retires (G1). Picture: `s19-fixes-f-after/cook-mishkaki-grill/1280x665/06-kind-timing.png`.
- **Eggs' overdone egg under a light** (before: "came into it"). contract-112 names a picture by its texture, so a thing changing its own look in place reads as something new arriving. It did not recur after the change, but the check can still catch it (s19-checks).
- **Unit test `build/lint/static.test.mjs:219` now fails.** It still asserts that daar's chop zone is a known break, and this branch fixes that break (SH-259). Its `daar named` line should go (build/lint is read-only to me).
- **Art missing:** there is no chopped picture of the golden onion. The board and card show the golden onion, but daar's waiting heap and its pot pieces are red (v3 `chop-heap-onion`). The art is also why sekelo's served skewer sits at the tray picture's left slot with its handle past the foot (tray-1's painted slots). Sekelo at 740x320 keeps the layout's skewer length (BAMBOO).
- **Not done:** pills on corn's band cobs. opt3s decided "a cob is the dish, no pill", so they wait on Zafar. The cob now has its own order card instead.
- **Chai not re-frozen.** `frozen.mjs --diff --quick` found 29 of 30 pages changed since 7 Nov, then hit my timeout while confirming them. Three browsers were running on the machine at once (s19-checks-2's too). It needs a full diff on a quiet machine before `--freeze`.
- **Chaat (merged in):** at 1920x1080 there are contract-111 ×4 (the shelf's tap areas) and contract-107 ×1. Both come from assemble.js's shelf, so they belong to s19-chaat-td. At 930x430 (fair and mistake) chaat has 0 breaks.
- **Evidence tool failures, from the load:** SH-254/SH-256 maani 930x430 (the page timed out) and CK-79 daar 1280x665 (view-marble never came). Before, CK-79 1920x1080 failed the same way.

## The before run (s19-fixes-f-before: L1, 740x320 and 1280x665, 18 pages): 9 breaks
| Game | contract-112 | contract-113 | contract-105 |
|---|---|---|---|
| eggs | 1 (the overdone egg) | | |
| chop | 1 (the knife moved 42 px into the swipe light) | | |
| daar | 1 (the knife moved 185 px) | 3 (Nana's face on the katori, then on the served bowl, 740) | |
| sekelo | | | 1 (rack) |
| samosa | 2 (the strip's light inside its canvas) | | |
| chai, corn, maani, baking | 0 | 0 | 0 |

## What changed (rows; before and after under `build/screenshots/brief/s19-fixes-f/<ROW>/{before,after}/`)
- **SH-259:** daar's combo has no chop zone (`zones: []`). The lint has no finding left.
- **SH-249/253:** the swipe light stands still about 1.1 s before the knife moves. Samosa's flat strip is drawn from its pastry (frame "flat"), so its light, its picture and the checks read one sheet. Sekelo's guided glow shows only inside the kit's light (contract-102). The coach gives a lit shelf thing back its glow and hop once it is still (chaat#mistake, contract-107).
- **SH-254:** daar's face sits beside the larger of the katori and the served bowl. Maani's plate face moved to the rim corner.
- **SH-256:** eggs go cracked → egg-part → cooked, each fading in, set just before the green. The fried egg flies at its plate size. Corn's cob-over is wired (CK-80). A lone maani fills its plate's floor.
- **CK-76:** step lines from the engine. The serve gap is on the recording sheet (recordings.mjs).
- **CK-79:** daar's waiting heaps fill a 160 px glass. On a short sidebar, the card's rows become one sideways row (ui.js; samosa's blocks and several skewers excepted).
- **CK-80:** each person's cob gets its own card, "hakro makai" (corn.json order, unsaid, saidBy head). The tray face is the kit badge's size, on the rim.
- **CK-75, CK-77, CK-78:** fixes-e's work holds on the before pictures, so nothing changed.
- **Chaat's two items:** chop's own card words reach the end review (`ctx.taught`, reviewWords), so "hakro" is listed. Coach re-glow (above).

## Proof
- After run `s19-fixes-f-after` (740x320, 1280x665): every end reached, 0 page errors. 3 breaks: the two above, plus sekelo's contract-102, fixed since.
- Rows after: `build/screenshots/brief/s19-fixes-f/` (run br-s19-fixes-f-after-20261111-042013-bwc).
- Four sizes: CONTRACT_LINE
- checks.mjs: everything ok except unit (static.test.mjs:219 above, and artcheck.test 5-7: sources/ is not in this sparse checkout).
- check-change: CHECK_CHANGE_LINE
