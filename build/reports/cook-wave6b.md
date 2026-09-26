# Cook with Nani: Wave 6b (`claude/build-cook-wave6b`)

## What changed, every station
- **End-of-round screen** (`js/shared/results.js`) after every order and lab round.
  - Accuracy: the order's rows, plus a red slot per stray mistake.
  - The badges map to the stars.
- **Picture tally**, top right: what you did, never the target.
- **Auto-tick at every level.** Count rows tick when their step closes, right or not. A hidden tadka order comes back row by row.
- **No mid-round verdicts from level 2.** Wrong picks land like any other and show in the review. Level 1 keeps one "Arre re!" per round. Stars never grey mid-round.
- **Nani is a voice at stations.** Her card leaves the sidebar and the rows she names throb. Off-card lines appear as a small caption.
- **Onboarding scripts** (`data.onboard`) for the nine stations, via `js/shared/onboard.js`.
- **Skewer-count leak fixed:** one card per kind, titled as said ("ba ghos"), not one per skewer. Maani cards follow the same rule.
- **Knead unlinked** (file kept, upgrade hidden). The lab lists the nine stations; parts fold away.

## Per station
- **Pantry:** from level 2 a wrong item goes in the basket.
- **Chai tray:** water, milk and chai are taps (`Cook.Pour.measure`).
  - Each tap fills to the next line; every cup shows both lines.
  - A cup's rows tick when it's full.
  - Tally per cup. The hand star is the knob alone.
- **Maani line:** tally per dough.
- **Mishkaki grill:** level 2 up, a wrong piece stays on (level 1 bounces it). The tally shows skewer pictures.
- **Chop:** wrong slices fall grey; rows tick when the ring empties.
- **Tadka:** wrong spices go in the oil.
- **Stir:** ends on Done. From level 2, no "enough!".
- **Chaat:** layer tally. The customer's check stays: it is the review.
- **Samosa + fry:** tallies replace the bowl badges. One lab entry.
- **Tools:** painted knife, ladle, spatula, slotted spoon, skewer stick, tawa.

## Gestures kept, and why
Each kind of action keeps one gesture at every level:
- chop's swipe (the fun);
- stir's drag (speed is the answer);
- the roll (shaping);
- the fold swipe;
- tap-on-green timing.

Only the hold pour changed (ingredients are tapped, so liquids are too), and stir's let-go ending became Done.

## Leak numbers
- **Other modes' Node bots:** find, tidy (`--bot 300`), who, dress, monsoon, clinic, snap all PASS; level 1 under 10%.
  - Rows over 10% are the usual report-only placeholder rows: Find's Ali pills 24.8% and Tidy's "Reader".
- **Cook (`--orders`):**
  - tap-till-tick: 0/820;
  - card counts giving the number away: 0% at every level (was 100%).

## Tests
All pass, one at a time, with no console errors or sidebar warnings. Screenshots checked.
- `--lab`:
  - laptop, every entry;
  - level 2, the nine stations;
  - phone and iPad, the nine stations.
- `--days 2 --canvas` on laptop and phone.
- `--open-kitchen 2`.
- `--orders`.
- `test_find.py`.
- Shared Node tests.

`js/shared/` is untouched. Only Cook's files are version-stamped: the orchestrator stamps the rest before pushing to main.

## What's left
- Velan and chakla sprites (batch 1 failed QA; waiting on batch 2). The fillable chai glass and the skewer rack are still drawn.
- Q9, next wave:
  - chop level 1 = one kind;
  - serve reactions;
  - serving the right person;
  - a speaking moment.
- Nani's captions show English placeholders until family recordings exist.
