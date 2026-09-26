# Cook with Nani: Wave 6b (branch `claude/build-cook-wave6b`)

UX principles §9, §11, §12 and §13, the quality pass's kept stations, and the Wave 6b list in `docs/cook-with-nani-todo.md`.

## What changed, everywhere
- **End-of-round screen** (`js/shared/results.js`) after every order and every lab round: time and personal best (per game and level), accuracy, hints, then the word review. Accuracy is the order's rows, plus a red slot for each mistake that isn't a row. The badges map to the stars.
- **Picture tally**, top right: what you did, never the target. It never takes a tap.
- **Auto-tick at every level.** Count rows tick when their step closes, right or not; a hidden tadka order comes back row by row.
- **No mid-round verdicts from level 2.** A wrong pick lands like any other and is shown in the review. Level 1 keeps one "Arre re!" a round. Stars never grey out mid-round.
- **Nani is a voice at the stations.** Her card leaves the sidebar; the rows she names throb. A line that isn't on the card shows as a small caption.
- **Onboarding scripts** for the nine stations (`data.onboard`), run by `js/shared/onboard.js`.
- **Skewer-count leak fixed:** one card per kind with the number as said ("ba ghos"), not one per skewer (maani too).
- **Knead unlinked** (file kept; its upgrade hidden). The Station lab lists the nine kept stations, with the sub-mechanics under "Parts".

## Per station
- **Pantry:** wrong things go into the basket (level 2 up); the tally shows the basket.
- **Chai tray:** water, milk and chai are taps (`Cook.Pour.measure`, one tap per line; both lines on every cup). A cup's rows tick when it's full. The tally is per cup. The hand star is the knob.
- **Maani line:** tally per dough; rows tick at Done.
- **Mishkaki grill:** from level 2 a wrong piece goes on (level 1 bounces it); the tally shows skewer pictures, threaded then plated.
- **Chop:** the tally shows every slice by kind; wrong slices fall grey from level 2; rows tick when the ring runs out.
- **Tadka:** wrong spices go into the oil from level 2.
- **Stir:** ends on Done, not on letting go. No "enough!" past the count from level 2. Tally of laps.
- **Chaat:** tally of layers. The customer's layer-by-layer check stays: it is the review.
- **Samosa + fry:** tallies replace the per-bowl badges; fill rows tick at Done. One lab entry covers fill, fold and fry.
- **Tools:** painted knife, ladle, spatula, slotted spoon, skewer stick, tawa. The velan and chakla wait for batch 2: batch 1's failed QA.

## Gestures kept, and why
Same gesture for the same kind of action inside each station, at every level:
- chop's swipe (the slice is the fun);
- the stir drag (speed is the answer);
- the roll drag (the only shaping gesture);
- the samosa fold swipe (three kinds of action, one gesture each);
- tap-on-green timing (tawa, grill, fry, knob).

Only the hold pour changed (Chai tray: ingredients are tapped, so liquids are too). Stir's "let go to finish" became Done.

## Leak numbers
- Node leak bots (the other modes', no code of theirs changed): find, tidy (`--bot 300`), who, dress, monsoon, clinic and snap all PASS; every blind strategy is under 10% at level 1. The rows over 10% are report-only placeholder rows, as before: Find's 24.8% (Ali's pills) and Tidy's English-placeholder "Reader".
- Cook (`test_cook.py --orders`): tap-till-it-ticks 0% (0/820 count rows); counting cards 0% at every level (was 100% for any count above one).

## Tests
One at a time, `COOK_TEST_PORT=8830`; screenshots checked at each size. All pass, with no console errors and no sidebar warnings:
- `--lab`: every station and part at laptop (level 1), then the nine kept stations at level 2 (the quiet-mistake paths), phone (flip5-landscape) and iPad;
- `--days 2`: laptop and phone, on the canvas renderer;
- `--open-kitchen 2`;
- `--orders`, including the new leak checks;
- `test_find.py`, since Find it shares `js/cook/ui.js`.

The harness now pictures the end-of-round screen and waits for the first-time overlay.

`js/shared/` is unchanged: no bug fixes were needed there.

## What's left
- Velan and chakla sprites (batch 2); the fillable chai glass and the skewer rack are still drawn.
- Q9 for the next wave: chop level 1 = one kind; the serve reaction library; serving to the right person; a speaking moment.
- Nani's captions show placeholder words until the family's recordings exist.
