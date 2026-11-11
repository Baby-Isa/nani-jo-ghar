# s19-fixes-f: the kitchen games' open rows, measured with the new screen checks (11 Nov)

Opus, high. Branch `s19-fixes-f` (integration merged in at 1d3d11c0f for chaat's items), never pushed. Flaws first.

## Flaws and open
- **Breaks left, judged check faults (s19-checks):** (1) sekelo contract-105 (740x320, 1920x1080): the light hugs the skewer as SEK-22 asks ("the whole skewer ... fairly tight"); 105 takes the tray picture `sk3-rack-1` (the skewer is painted into it) as the thing; contract-112 passes the same light; 105 is one of the quick checks the check sort retires (G1). (2) chop's swipe at 1920x1080 (contract-112 "still moving inside it while it stood"): the light now stands 1.5 s before the knife moves, but on a busy machine the second look comes later, during the swipe itself; the swipe variant's path is the knife's to move along (STD-E2-08a), so 112's still-rule should not judge the knife inside a swipe light. (3) A thing changing its own look in place (eggs' egg browning) reads to 112 as a new thing "coming into" the light (the id is the texture key).
- **Unit test `build/lint/static.test.mjs:219` fails now:** it asserts daar's chop zone is still a known break; this branch fixes it (SH-259). Its "daar named" line should go (build/lint is read-only to me).
- **Art missing:** a chopped golden onion (the board and card show the golden onion; daar's waiting heap and pot pieces are the red v3 heap); sekelo's served skewer sits in tray-1's painted left slot, its handle past the foot. Sekelo's skewer at 740x320 keeps the layout's length (BAMBOO).
- **Not done:** pills on corn's band cobs (opt3s: "a cob is the dish, no pill"; his call); the cob has its own order card now.
- **Chai not re-frozen:** `frozen.mjs --diff --quick` found 29 of 30 pages changed since 7 Nov and was cut by my timeout while confirming them (three browsers on the machine: s19-checks-2's too). It needs a full diff on a quiet machine before `--freeze`.
- **Chaat (merged in to check its two items):** at 1920x1080 contract-111 x4 (the shelf's tap areas) and 107 x1, from assemble.js's shelf: s19-chaat-td's. 930x430 fair and mistake: 0 breaks. Its four contract-105 knife breaks did not appear in my runs.
- **New shared change, flagged:** the kit's light steps back while the grown-ups' "?" pop-up is open (onboard.js); the coach already does so for a panel.

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
- **SH-254:** daar's face sits level with the katori on its left, clear of the served bowl and the plain bowl's light. Maani's plate face moved to the rim corner.
- **SH-256:** eggs go cracked → egg-part → cooked, each fading in, set just before the green. The fried egg flies at its plate size. Corn's cob-over is wired (CK-80). A lone maani fills its plate's floor.
- **CK-76:** step lines from the engine. The serve gap is on the recording sheet (recordings.mjs).
- **CK-79:** daar's waiting heaps fill a 160 px glass. On a short sidebar, the card's rows become one sideways row (ui.js; samosa's blocks and several skewers excepted).
- **CK-80:** each person's cob gets its own card, "hakro makai" (corn.json order, unsaid, saidBy head). The tray face is the kit badge's size, on the rim.
- **CK-75, CK-77, CK-78:** fixes-e's work holds on the before pictures, so nothing changed.
- **Lights, the contract's finds:** samosa's knob step names the knob (Cook.Coach.lit), so its light hugs it (contract-82 at 1920x1080); the light steps back under the "?" pop-up (eggs, corn help-open).
- **Chaat's two items:** chop's own card words reach the end review (`ctx.taught`, reviewWords), so "hakro" is listed. Coach re-glow (above).

## Proof
- After run `s19-fixes-f-after` (740x320, 1280x665): every end reached, 0 page errors. 3 breaks: the two above, plus sekelo's contract-102, fixed since.
- Rows after: `build/screenshots/brief/s19-fixes-f/` (run br-s19-fixes-f-after-20261111-042013-bwc).
- Four sizes: CONTRACT_LINE
- checks.mjs: everything ok except unit (static.test.mjs:219 above, and artcheck.test 5-7: sources/ is not in this sparse checkout).
- check-change: CHECK_CHANGE_LINE
