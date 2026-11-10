# s19-wave-c: eggs on its new art, chai's hob, the steel pan, cream plates

Opus, high. Branch `s19-wave-c`, never pushed. Files: `js/cook/stations/eggs.js`, `data/stations/eggs.json`, `data/cook.json` (eggs only).

## What changed

- **Scene (CK-66, SH-246, ART-67, SH-243).** The hob is chai's two-burner kit hob, as big as the room allows (the extra worktop goes into size, as in chai). Each knob sits below its pan, because both pans show at every level. The boiled eggs cook in chai's own top-down pan, handle left. The fried eggs cook in the v4 steel pan, its handle turned up and to the left between the two pans, away from the band. The bowl and the top-down shakers lie on the stone tray band with their pills. Chai's walnut tray on the right holds a cream plate per person, with their face in that plate's corner; the tray stays clear of the cog. An egg cracks into the pan, cooks, and browns if left (a look only). Boiled eggs are halved on the plate. Soft shadows come from the grill kit.
- **CK-64.** Each person's headline gives their count, built by the engine ("Muke ba tarela inda khape"). There is one card per egg with no number, and each card ticks as its egg lands.
- **CK-62.** The cards show v4 pictures. **CK-63.** The light sits on the pan's round body; each plate is lit together with its face.
- **Breaks fixed:** 106 (`Coach.began` on every tap), 102 (a glow only while the kit's light is up).

## Proof

- **After:** `build/screenshots/brief/s19-wave-c/` (run br-s19-wave-c-after-20261110-100940-br7). 7 rows, 0 tool failures. CK-62 and SH-247 pass by machine. CK-63's two fails are both 105 (below).
- **Before:** partial. Chromium crashed while the disk was full, but every row has panels.
- **Contract** (`build/screenshots/sandbox/s19-wave-c-contract/`): eggs L1-L4 at four sizes, 16/16 reached the end, 0 page errors. Last line: `CONTRACT FAILED: 14 breaks (contract-83 4, contract-105 6, contract-18 4)`. None of these come from eggs:
  - 105 is the kit's reveal-lesson light on the sidebar card (the base has it too).
  - 83 is the card's face button tap area.
  - 18: the step-close was logged 2-3 s earlier, while the third card was below the sidebar's fold.
- `checks.mjs`: all ok. `loadcheck --only cook:eggs`: ok. The mistake, hint and takeback paths reach their end.
- **check-change** (`build/reports/tiers/change-e9467921c5.md`): FAILED.
  - Blocks that are not eggs': scope (`sources/art/s19-redo/refs/S4.jpg`), frozen (chai), and contract-83 ×4.
  - frozen left its replay holding port 8904, so mount, leak and loadtime fell over. Run by hand: mount 21 (the old ones), leak ok, loadtime ok (no baseline).

## Open

- No one-pan frame: eggs always has both pans, because the pick is the game.
- No four-plate frame: orders top out at three people, as in chai. A fourth person needs Zafar's word.
- At the table, the boiled eggs are still in egg cups (side-on art).
