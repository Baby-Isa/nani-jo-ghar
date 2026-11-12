# s19-clean-e: report (second part, after the stop)

## Flaws first
- **Most of task 1's rows were not touched in this part.** Zafar's three new asks, SH-268's shadow lines and the two coordinator items came first. These rows are still open: CK-46, CK-55, CK-65, CK-75, CK-76, CK-79, DAAR-36, DAAR-39, MAA-20, CHT-13, CHT-17, CHT-19, PAN-21, ART-52, ART-72. Their owners: PAN-21's count pills, CK-46 and CK-55 are `js/cook/ui.js` (a4). Corn's contract-37 needs the corn recipe's asks in `data/cook.json` (six bowls cannot give four decoys).
- **No before folder exists for this brief** (`build/screenshots/brief/s19-clean-e/` is missing here and in the main checkout), and `evidence.mjs --after --brief` refuses: CHT-13 has no probe ("Zafar's ear or feel"). I played the other 24 rows with `--run` (index `build/reports/evidence-s19-clean-e-ev-after.md`): 21 for the judge, 1 machine PASS (CK-65), 2 tool faults (CK-79: the "view-marble" moment never came at 1920x1080; CHT-17: 4 of 5 probes reached). These go to a3.
- **Tier 2 (`check-change.mjs`) not run.** It plans 36 steps, about 316 min, and its rows step would refuse for the same CHT-13 reason. It is left for `/review`.
- **CK-89's probe never sees the salt.** It fires at `every:onboard`, and the salt step is not a first-time light. Spec change for a3 (`build/sandbox/data/evidence.json` CK-89): `"at": "life:baking-salt", "every": true, "delay": 500, "max": 3`. The game now logs that moment.
- **Pinch has no Kutchi.** Nani's sentence is grey English: "Put in a pinch of salt." Recording sheet: ask Mum for "a pinch"; then lexicon `n.pinch` (to-record, alias `ph-pinch`) and pinch `parts` `["ph-pinch","spi-16"]`. Until then its row shows "loon" alone.
- **Corn's contract-114 is unchanged.** The cob on the tray is 288 px and on the plate 222 px: the plate's cap, not the tray.
- **Sekelo's pinned art is the mock's cut, a stand-in.** A clean magenta tray is still needed in the next art run (ART-80). The tray-deep cut is not in `data/art/registry.json` yet; the orchestrator should run `registry.mjs` add.
- Docs (not mine) should note Zafar's 12 Nov word: sekelo as corn, deep trays.

## What changed
- **SEK-27:** `grill.js` `layout5` gives sekelo corn's screen.
  - Raw skewers lie two by two on the stone band (`SK.rackBand`), within 15% of their grill length, with the soft shadow.
  - The grill is middle-left; one cooked deep tray on its right, no taller than the grill (contract-115), skewers upright at grill size. Nana's face at its top-left, as corn's.
- **ART-80:** `assets/cook/items/v4/kit/tray-deep.webp` is cut from the mock's top tray (790x658). Cut along its outline, its painted shadow left behind. `GK.deepTex` resizes it to any shape (corners kept, the middle drawn out). Sekelo's thread tray and cooked tray use it. Corn's cooked tray uses it too: `scene.layout.grill.tray: "deep"`, and `"steel"` puts back the flat tray. The before frames show the steel tray.
- **CK-89:** from L2, every plan puts salt in after the flour.
  - A teaspoon: "Hakri chamchi loon wiji chad!", built by the engine.
  - A pinch: grey English.
  - The salt jar tips once straight into the bowl. A small pile of cool white crystals shows on the flour, a pinch smaller than a teaspoon (`items.saltPile`). It mixes in with the first wet thing.
- **SH-268:**
  - `GK.shadow` and chop's `shadow` now wrap `Cook.Kit.shadow`.
  - Baking's bowl, jug (by its glass), jars, oven and naan cast the shadow.
  - Chaat's bowl casts it; this follows Zafar's newest word, over CHT-12. The food in the bowl shares the bowl's shadow.
  - Samosa's spoon casts it on its cloth (none while it is in use), and so do the samosas on the thali. The pastry on the board shares the board's shadow.
  - Result: contract-120 at L1 is baking 0, chaat 0, samosa 0, sekelo 0, maani 0.
- **Maani's rotis** (Zafar, 12 Nov): they cast the kit's shadow from when they are rolled flat (a new `onTex` hook in roll.js), on the tawa and on the plate. The balls and heaps stay shadowless (MAA-09). Maani's contract-120 is now 0 (L1 and L3, two sizes).
- **SH-259 and SH-260 were already built.** I proved them, with no code change, in `build/screenshots/evidence/s19-clean-e-sh259/`. Chop alone and daar's chop: the same board, band, knife and light; `Cook.Chop.refused` is `[]` everywhere (chaat's panels did not fit the sheets). Eggs and samosa sit centred as chai's at four sizes.
- **Sekelo L4 740x320 stall:** the test player (speed 3, about 5 s per action under load), not the game; a child's green lasts 0.83-1.1 s. With a4's player wait, L4 ends at both sizes.

## Proof
- `checks.mjs`: every step ok.
- **Contract, PROOF line** (`s19-clean-e-contract`, ten flows at L1, four sizes): 40/40 ends, 0 page errors, 67 breaks. (before the band and roti shadows; rechecks after them: sekelo and maani contract-120 0).
- **L1-L4 at 740x320 and 1280x665** (`s19-clean-e-after` plus the contract run's L1): 80/80 ends, 0 page errors.
  - Breaks: 141 before, 139 after. contract-120 (19) and contract-121 (13) are new checks since the before.
  - By check: 36 22→16, 111 22→6, 44 11→0, 65 9→1, 112 8→3, 106 7→2, 37 10→11, 114 9→14, 117 3→8, 113 1→8 (fetch pills under the side panel; a4).
  - By game: baking 28→9, chaat 22→12, chop 10→5, sekelo 4→10, then 4 after its fix (all shared: 121, 72 a4's; 117 the thread's free pick). Eggs 11→20 and pantry 9→18 rise on contract-121, 113 and 119 (a4).
- **Evidence after:** `build/screenshots/evidence/s19-clean-e-ev-after/` (24 rows) and `.../s19-clean-e-sh259/` (SH-259, SH-260).
