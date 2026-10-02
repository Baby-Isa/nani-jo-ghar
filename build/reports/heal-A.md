# heal-A: the scrape, knee and ear, plus clinic-wide fixes (2 Oct)

Branch `ccr-fcd9dddd-wnywzc`. Only the mechanics the 1 Oct report §8H and decision 27 change were changed. The dab count, the hammer kick and the wax drag stay. The art is stand-ins in the patient's own colours, plus the v2 item art for the tools.

## The games
- **Scrape (D15a):** you sweep the jug's water across the scrape and the dirt washes away where it passes. The counted cloth dabs stay. Then you drag plasters on to cover the red, in the colours and order said. If a red corner shows, the patient winces: drag the plaster again to fix it, or tap it to take it off until ✓.
  - L1: one plaster, which settles into place if it's nearly right.
  - L2: two plasters, one colour each.
  - L3: two plasters, two colours each.
  - The colours are Mum's *laal* and *lilo*; yellow and blue are still flagged placeholders.
- **Knee (D15b):** one knee, side-on. The lit dot waits for the tap.
- **Ear (D15c):**
  - A bigger ear, full of wax from the start. Each blob is dragged out in one gesture, and 0–2 more pop out of the canal each time (capped).
  - The bud wipes the wax smears off; touching the sore pink skin makes the patient wince.
  - Then the drops, then the whispered-word check (`hearing.on` in `ear.json`).
- **Clinic-wide:**
  - CLN-66, 67 and 68.
  - SH-40: no ✓ where the next tool closes the step.
  - Art swaps in by file name (`S.closeup`).
  - Group B's proposals: close-ups grow on tablets, speech bubbles stay on screen, the sore spots' tray, labs for eye test A and B.
  - Group C's proposals: no zoom for `camera.wide: "room"`, `ctx.countAt`, the fever tray is the thermometer only.
  - The first-time help's spotlight now grows with the close-up (this fixed the tooth hint stalling on tablets).

## Rows
Built, not re-played: CLN-45, 46, 48, 50, 66, 67, 68, and SH-40. KEEP-09 and KEEP-10 are kept.

## Checks
- **Leak bots** (`build/leak_clinic_heal_{cut,knee,ear}.mjs`, level 1 blind):
  - scrape 8.2–8.8%
  - ear 7.8–8.4%
  - knee 24–26% (Zafar's 13i exception, unchanged)
  - fair 100% everywhere
- **Sandbox:** all nine heal games ran (108 pages): 0 new findings, every flow reached its end. My three games: all sizes, `#mistake` and `#hint`.
- **Contact sheets:** `build/screenshots/heal-A/sheets/` (not committed).
- **Unit checks:** R5 5/5; check_onboard and check_clinic_kutchi pass.
- **Flaws** (my own review; nobody else has reviewed these yet):
  - The limbs are stand-ins.
  - The scrape is still small on phones.
  - The hand sits under the tool column.

## Proposals
- `css/shared/order-card.css`: at 844×390 the closed card's "to record" flag runs under the eye. Pad the folded headline's right side by the eye's width.
- `css/clinic.css`: adopt `HS.CSS` from `scene.js`.
- `clinic-heal-api.md`: add `tally {next}`, `countAt`, `say {soft}`, `S.closeup`, and the scene's `zoom`/`focus`/`safe`.
- `js/shared/mode.js`: I made one small change at the orchestrator's request: `labList` now passes an entry's `extra`.

## For Zafar
- New lines to record: `ear-hear-q` ("Which one did I say?") and `ear-wax-out`.
- With the hearing check off, the ear's only Kutchi row at L1 is the drops count (25% blind).
