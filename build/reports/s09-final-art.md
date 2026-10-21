# s09-final-art

Worktree branch `worktree-agent-a1449e1d3a26de190` (not pushed: in-chat run).

## Flaws first (builder's list; the judge decides)
1. **Request:** `artcheck` now sees `assets/day/s09b/bicycle.webp` (haze, soft shadow) and `rainbow.webp` (soft rim): re-cut or list as known. Unit test 413 fails until then.
2. 4:3 tablets: both pillars show, so the view is small (a goat about 60 px at 1024x768); the headliner above is a gradient with a faint join.
3. Under the sidebar the car is its own mirror image (one wide seatbelt).
4. Real heights: a bus on the field fills half the view at 844x390; a bird is drawn at the tap floor.
5. Mid push-in the close-up's edge shows over the room for a moment; the tilt cross-fades two pictures (hands, book angle).
6. The recorder is not in the repo; the sheet predates the ride-start and stall commits (layers and clock unchanged).

## What changed
- **RIDE-07:** 19 s09b things sized from real metres; sky band; landmarks; doors, vehicles and big animals on the field, in the grass before the fence; the s09b hills; the wide window shows both pillars and runs under the sidebar; a call ends half behind the pillar; the ride starts with things whole; a 250 ms stall never jumps the road.
- **RIDE-01:** `build/reports/s09-ride-join-844x390.png` (12 frames, 1008 ms apart, two joins, 0.87 MB).
- **BOOK-09:** spreads across both pages; push-in to her close-up lined up on her eyes; the tilt lands on the pages laid under it (reversed on the way out); real sprites; pages show once their pictures are drawn; no blank card.
- `docs/language/recording-sheet.md` regenerated (the ride's new gaps).

## Proof
| what | result |
|---|---|
| red | `s09fa-red` |
| ride rows | `s09fa-green5`: RIDE-02 to 05 machine PASS; 01, 06, 07 sheets |
| book rows | `s09fa-green6`: BOOK-02, 08 machine PASS; 01, 03 to 07, 09 sheets |
| matrix | `s09-final-art-matrix6` (ride), `-matrix7` (book): 16/16 end, 0 breaks, 0 page errors |
| unit | ride 22/22, book 7/7; leak bots pass |
| checks | all ok but unit 413 (flaw 1), load cook:chop (flaky, not mine) |

Shared rows: covered by the contract checks (0 breaks).
