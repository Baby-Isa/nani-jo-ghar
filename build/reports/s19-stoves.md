# s19-stoves: the knob rule, tap areas, daar's lap card, the lights' leftovers (9 Nov)

Opus, high. Flaws first.

## Flaws and open
- **The AFTER run stopped at 108 of 152 pages: the disk filled** (197 MB free; the main checkout's screenshots are 13 GB). Resume once there is room: `COOK_TEST_PORT=8896 NJG_LOCK=/tmp/njg-browser-8896.lock node build/tools/review/evidence.mjs --after --brief build/tools/ops/specs/s19-stoves.json --resume ev-br-s19-stoves-after-20261109-204115-zmj`.
- **No BEFORE was played at launch.** I played it on the unchanged game files with the new probes (`build/screenshots/brief/s19-stoves/*/before`).
- **Chai's frozen diff is not clean:** 62 changes on 24 pages (`build/reports/frozen-diff-chai-tray-202611092006.md`). They are chai's own jar glow (102), the side card's light (105, below), and help and skip notes, none from a file this branch touches. The fingerprint predates contracts 102-109, so chai needs a re-freeze. No baseline run was played to prove it.
- **CK-63's card light** (every game, L2 and up, 740x320 and 930x430): the light stands 7 px below the item card's top. The cause is in `js/cook/coach.js`, which I don't own: `C.cardLight` lights the row (`.oc-row.oc-it14`), not its card. The change to make: in `lightOf` and `lit`, light `item.querySelector(".wc14") || item`.
- **contract-111 "picks nothing"** where a pill overlaps its item's foot: chaat at 930x374, samosa's fill at L2 930x430 and L4 740x320. Not explained yet; it may be the probe.
- **Mine to place:**
  - `build/tools/review/lib/regressions.mjs` CONTRACT_ROWS needs `"contract-110 knob-side": ["SH-247"], "contract-111 item-reach": ["SH-244"]`.
  - Move `build/sandbox/lib/s19-stoves.test.mjs` to `build/sandbox/` so checks.mjs runs it.
- **Eggs:** pot and pan at every level, so unchanged.
- **Daar's dial** moved to the pot's left during the stir to free the right side for the lap card. This is my call, unseen by Zafar.

## What changed
- **SH-247** (`Kit.hob`/`Kit.burner` `knobs: "left"`):
  - The one-burner hob is turned a quarter. Knob and face stand in a column on its glass, left of the pan, centred on its height.
  - Daar, samosa's fry and maani use it. Pans keep their places.
  - New contract-110.
- **SH-244:**
  - Cause: Phaser reads a pill's tap area from its top-left corner, so its 80 px box sat up and left of the pill: the item's foot said the word, the pill's right half took no tap.
  - Now the pill takes taps on its card plus 8 px at the sides and foot. Every `S.tappable` thing reaches down its slot to its pill (`Shelf.P.reach`).
  - New contract-111, a 930x374 size (the browser bar showing), and the `hook:cook.taps` picture of the tap areas.
- **DAAR-50:**
  - The shared item card (`WordCard.big14`) pops right of the pot on each lap: the numeral as its picture, the Kutchi, the English, the speaker lit while Nani counts.
  - A number with no recording shows its English in grey italic. The dial's chip stays only where no card can show.
- **Leftovers:**
  - Contract-105's probe now reads `pillW` (mishkaki) and the best-fitting thing (corn's plate).
  - `Shelf.pillScale` keeps a natural-size pill inside its slot (chaat at 1920).
  - Evidence specs: SH-119 (`.njg-onboard`), SH-228 eggs (`life:helper-open`), SH-236 and MAA-22 (3 s films). New specs for SH-247, SH-244, DAAR-50 and SH-245.

## Proof
- **Contract, 8 flows x 4 sizes** (`s19-stoves-contract`):
  - 32/32 reached their end, 0 page errors.
  - `CONTRACT FAILED: 3 breaks (contract-92 1, contract-105 1, contract-11 1)`: chaat at 1920 (clean after the pillScale fix, `s19stoves-it3`) and corn's background art.
  - 110 and 111: 0.
- **BEFORE:** SH-247 machine FAIL (red). SH-244's chai picture, CK-63 FAIL, SH-119 and SH-245 panels. DAAR-50 is not there yet.
- **AFTER (partial, judged offline):** contract-110 has 1 break, samosa L3 at 740x320, 1 px; fixed since and not re-played.
- **Checks:**
  - `checks.mjs --only unit,static,words,specs`: all ok (766 pass).
  - `s19-stoves.test.mjs`: 6/6.
  - `evidence.mjs --lint-specs`: 0 flagged.
- **After folder:** `build/screenshots/brief/s19-stoves/` once resumed. QA: the auto lines above; the eye lines are the judge's.

## Fix round (Zafar, 9 Nov: "if there's multiple things taking up width, then we put the button underneath")
- Maani and samosa's fry are as they were. Daar's hob, pot and knob are as they were. `knobs: "left"` stays in the kit, unused.
- Daar's stir: the dial is back on the pot's right (smaller where the room asks), with the lap card beside it, below the settings corner.
- Contract-110 is refined: left only for a pan alone in the width; otherwise below, clear of its body. It is judged over the page, held 300 ms, and sees daar's dial (`njgBox`).
- **Proof:**
  - `s19-stoves-fix-contract`, daar, samosa and maani at the four sizes: `CONTRACT PASSED: 0 breaks over 12 pages`, 0 page errors.
  - Pairs at 930x430 and 740x320: `build/screenshots/brief/s19-stoves/fix-round/`. The before is the knob-left run at L2; the after is L1.
  - `s19-stoves.test.mjs` 7/7.
