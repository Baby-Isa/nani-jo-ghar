# Samosa v2 (29 Sept, §15)

**Built:** a new station (`js/cook/stations/samosa.js`) with three jobs. **Fill:** a real pastry strip on a board, with prep bowls and `🔊 word` chips on the shelf band (speaker-only from level 3). Each tap adds one spoonful and pops its word. **Fold:** the swipe is kept. The real v2 pastry flap bends with the finger, a soft gold glow shows the next swipe, and it snaps shut with *samosa* popping. **Fry:** a karahi on the kit hob with one burner. Samosas go raw → light → golden → too dark, and a slotted spoon (no hand) lifts each onto a paper-lined plate. There's no tally. Serve and taste work as in §14a.

**Art: $0.07** (one API call: karahi + paper plate). The fold stages come from `sheet-samosa-folds-t-v2` on one canvas.

**Tests:** `test_cook.py --lab --viewport laptop` PASS; matrix in `build/reports/samosa-v2/`, no console errors.

**TO CONFIRM (Kutchi):** nothing new. The English placeholders are the phase lines and the "fry them" button.

**Notes:** kit karahi, and the card's early ✓ (`docs/overnight-queue.md`).

**Best shots:** `laptop-l1-fold-glow.png`, `laptop-l3-frying.png`, `laptop-l1-taste-right.png`.

## Polish (03:50)

- **Fold:** the filling is now one spoonful mound in the fold's pocket, the lower-left triangle that the first flap closes over. It is placed on the triangle's incircle, clear of the fold line. It grows with each spoon, and a later spoon sits slightly off the top so a mix of fillings shows.
- **Fry:** the chai/maani grid. The hob, the kit's karahi and the paper-lined plate are centred as one group above the shelf band. The folded samosas wait on steel thalis in the band, and the empty thalis leave once all the samosas are in the oil. `Cook.Kit.VESSELS.karahi` is now samosa v2's karahi (with `oil`), and the fry uses `Kit.place(S, "karahi", …)`. At serving, the plate still slides to the person.
- **Card:** a one-spoon filling row no longer ticks as its spoon lands. Count rows still count up, and everything closes at the fill's tick. The card is phase-folded (`closeCards`) from the fill's close until tasting. The early ✓ itself stays for now: the count lives in the headline, so the card is "done" once its filling rows close, and `OC.card` ignores `closed` on a done card. The ellipsis is also order-card territory. Both are noted for the follow-ups session in `docs/overnight-queue.md`, with a suggested fix.
- **Maani:** the chimta lies on the hob, along its right rim (ring at the front corner, tips up, clear of the heat ring), so it reads as put down. The chakla and hob are already centred as a group (checked in the shot).
- Re-shot: `samosa-v2/` laptop L1–L4 and phone-landscape L1/L3; `maani-v2/` laptop and phone-landscape L1.
