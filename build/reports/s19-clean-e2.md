# s19-clean-e2: the games' last open rows (round two of s19-clean-e)

## Flaws first
- **All breaks went from 139 to 146** (L1-L4, 740x320 and 1280x665).
  - The four games I changed and played again went from 53 to 33: baking 9 to 2, samosa 19 to 7, eggs 20 to 18, chop 5 to 6.
  - The other six went from 86 to 113: daar 12 to 24, chaat 12 to 23, fetch 18 to 28.
  - Those six were played before a5's merge and my last chop fix, on a shared, loaded machine.
  - Their rises: timing checks (106, 65), shared checks (73, 74, 119), fetch's pills under the side panel (113 x12).
- **Not fixed (owner: me):**
  - **Chai L4 at 740x320:** the elchi light stops 54 px short (112). The cause: the light avoids its neighbours' pills (`shelfBut`, chai-tray.js:1454). Fixing it changes chai's signed-off light, so I left it for a decision.
  - **Daar:** the chopped heap is 25 px on the chop screen and 46 px in its glass at the tadka (114, +84%)., against CK-79's "not a speck".
  - **Corn:** cob 289 px on the tray, 222 px on the plate (114 x7). This is SH-256, Zafar's call.
- **Tier 2 (`check-change.mjs`) not run:** it plans 36 steps, about 316 min. Its rows step refuses the brief, because CHT-13 has no probe.
- **No before folder for this brief.** - **Not pushed** (the brief), though the push hook asked.

## Rows
- **Proven, no code (the after frames):** CK-65 (machine PASS), CK-75 (eggs' praise fills the play area), CK-76, CHT-19.
  - CK-76 and CHT-19: contract-36 at 0 for eggs and chaat at L1-L4.
  - CHT-19: a checker test, 11 calls over three orders, each the next layer as said.
- **ART-52:** daar, chop, the pantry and chaat take every item's size class (`St.classFit`). Every item id in daar.json, chop.json and chaat.json has a class.
  - Still open: the clinic and `sizecheck.mjs` (not mine).
- **ART-72:** wired in `Shelf.TRAY_ART`. Its probe plays baking, which has the shelf, not the tray. Spec change for a6: corn, daar, maani, chop.
- **CK-79, DAAR-36, DAAR-39:**
  - contract-115 is 0 in daar.
  - 112 is 0 in daar.
  - The hop no longer starts from a squash (114).
  - Halves never land under a face (113).
- **CHT-13, CHT-17:** frames in the run. CHT-17's L4 pills fall back to the speaker alone (`fitPills`).

## What changed
- **Baking:**
  - The tip is called with its first-time light: Mum's "Wiji chad!".
  - The help line after the pause is the step's call.
  - The gap notes are brought up to Mum's 12 Nov amounts.
- **Eggs:** a fried egg keeps its pan size on the plate.
- **Chop:**
  - A hop starts from the item's own size, after its squash.
  - Cut halves avoid face circles.
  - Its well done is clear of the knife and the cog.
- **Samosa:**
  - The strip step and the heap step are two steps, so the help lights the heap. This fixes 36, 117 and 53.
  - Lights close on the press.
  - The fold light comes back after a press that was no swipe.
  - The heaps keep their taps between moves (111).
- **Registry:** `kit.tray-deep` is in the art registry as a stand-in (ART-80).
- **Design doc:** cook.md has Zafar's 12 Nov word, kept within its word limit.

## For others (exact)
- **a6 (checks):**
  - contract-36's skip window is -1 s, but the light comes 1.0-1.2 s after the step (eggs' tray, the pantry's first light).
  - contract-105 should skip chop's swipe light (`chop:s14-strip`).
  - contract-78 reads daar's "Pela mirchi." (an item line) as a knob call.
  - contract-37 counts eggs' decoys differently from the game's note (L3 3, L4 4).
- **a5:** at 1280x665 the side panel covers the pantry's left shelf pills (fetch 113).
- **Language:** seed `ph-cups-34` "pono cup" (the lexicon has `num.three-quarters`, draft).

## Proof
- **Contract, PROOF line** (ten flows, L1, four sizes):
  - `s19-clean-e2-contract`: 40/40 ends, 0 page errors.
  - eggs, baking, chop and samosa were played again in `s19-clean-e2-contract-r` and `s19-clean-e2-samosa`: 16/16 and 8/8 ends.
  - 94 breaks, each named above.
- **L1-L4 at 740x320 and 1280x665:**
  - `s19-clean-e2-after` (60/60), `-after-r` (24/24), `-samosa` (8/8): 0 page errors.
  - By check, before to after: 120 19 to 2, 121 13 to 8, 111 6 to 2, 113 8 to 13, 114 14 to 17, 36 16 to 17, 106 2 to 8.
- **Evidence:** `build/screenshots/evidence/s19-clean-e2-ev/` (index `build/reports/evidence-s19-clean-e2-ev.md`): 10 rows, 7 for the judge, CK-65 machine PASS, 2 tool faults (CK-79 and CHT-17 at 1920x1080: "view-marble" never comes; a6's specs).
- **Checks:** `checks.mjs` passed every step but unit, which failed on cook.md's words. That is fixed now (`docs.test.mjs` 0 fails).
