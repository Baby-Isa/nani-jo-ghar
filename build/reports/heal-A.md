# heal-A: scrape, knee, ear and clinic-wide fixes (2 Oct)

Only the mechanics §8H and decision 27 change were changed; the dab count, the kick and the wax drag stay. Stand-in art in the patient's colours, with v2 item art for the tools.

## Games
- **Scrape (D15a):** sweep the jug's water to wash the dirt off; counted dabs (kept); drag plasters on to cover the red, in the colours and order said. A red corner makes the patient wince: drag the plaster again or tap it off. L1: one plaster (settles if nearly right); L2: two; L3: two, two-coloured. Red and green are Mum's *laal* and *lilo*.
- **Knee (D15b):** one knee, side-on; the lit dot waits for the tap.
- **Ear (D15c):** a big ear, full of wax; dragging a blob out pops 0–2 more (capped). The bud wipes the smears; touching the pink skin makes the patient wince. Then drops, then the whispered-word check (`hearing.on`).
- **Clinic-wide:**
  - CLN-66–68.
  - SH-40: no ✓ where the next tool closes the step.
  - Art swaps in by file name.
  - Groups B and C's proposals: tablet growth, bubbles kept on screen, the sore spots' and fever's trays, eye test A/B labs, no zoom for the room, `ctx.countAt`.
  - The help's spotlight scales: this fixed the tooth hint stalling on tablets.

## Rows
Built, not re-played: CLN-45, 46, 48, 50, 66, 67, 68; SH-40. KEEP-09/10 kept.

## Checks
- **Leak bots** (`build/leak_clinic_heal_{cut,knee,ear}.mjs`, L1 blind): scrape 8.2–8.8%, ear 7.8–8.4%, knee 24–26% (13i exception); fair 100%.
- **Sandbox:** nine heal games, 108 pages: 0 new findings, every flow ends.
- **Sheets:** `build/screenshots/heal-A/sheets/`.
- **Unit checks:** R5 5/5; check_onboard and check_clinic_kutchi pass.
- **Flaws (only I have reviewed these):** stand-in limbs; the scrape is small on phones; the hand sits under the tools.

## Proposals
- `css/shared/order-card.css`: the folded card's "to record" flag runs under the eye at 844×390; pad it.
- `css/clinic.css`: adopt `HS.CSS`.
- API doc: `tally {next}`, `countAt`, `say {soft}`, `S.closeup`, scene `zoom`/`focus`/`safe`.
- `js/shared/mode.js`: `labList` passes `extra` (as asked).

## For Zafar
- Two lines to record: `ear-hear-q` and `ear-wax-out`.
- With the hearing check off, the ear's L1 is 25% blind.
