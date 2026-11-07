# s17-o1-order: nothing said after a skip; half or full lands with its headline

Builder, 7 Nov 2026. Rows CK-60, CHAI-104 (CHAI-96 and CK-51 rechecked).

## Flaws first
- Only L4's half cup has its amount in the headline (LNG-23). Full is said last on its own, so it was never a gap. It is unchanged.
- The water and tea cards (CK-51) still wait off the row until the order ends, as before.
- The skip now acts on the press in every pop-up, the clinic's too, because the code is shared. Only Cook was played. Zone taps still act on their click. After a skip, the press's click reaches a game button under the veil or is swallowed.
- The ui.js parts of both rows went into the CK-60 commit.

## What changed
- **CK-60:**
  - `request-popup.js` skips on pointerdown (document capture).
  - The ui.js read loop's `live()` (not skipped, the same run, the voice generation taken at read start) guards sayPart, the 260 ms opening wait and every pop.
- **CHAI-104:**
  - The headline amount rows are marked `saidBy: "head"` (`data/cook.json`), and `recipes.js` and `Order.row` carry the mark.
  - `Order.sentence` keeps the row among the headline part's rows.
  - The ui.js folded list takes the row, and a said row still away lands as the order passes on.

## Proof
Script-made sound and card logs (the orchestrator's override: no evidence --before/--after runs).
- **CK-60:** a 250 ms press on the kitchen during the headline. Say-starts after the skip-zone note:
  - before the fix, chai L1: 1 ("dudh,")
  - after: chai L1 1280x665, chai L4 740x320, maani L1 1280x665 and maani L4 930x430: 0 each
- **CHAI-104:** chai L4, the first cup seeded plain, half, milk, no sugar.
  - Before: adh stayed away all order (12 gap states).
  - After, at 1280x665 and 740x320: 0 gap states. Adh lands with the headline.
  - L1-L3: 0 gap states.
  - The sentence is unchanged. A scratch unit test (600 orders) passes.
- **Contract:** `CONTRACT PASSED: 0 breaks over 4 pages` (cook:chai-tray at 740x320, 930x430, 1280x665 and 1920x1080, every end reached)

## Requests
Add the scratch test under `build/core/` and the line in `docs/process/overnight-log.md`.
