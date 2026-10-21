# s09-final-art

Worktree branch `worktree-agent-a1449e1d3a26de190` (not pushed: in-chat run).

## Flaws first (builder's list; the judge decides)
1. Fix round: lines now wait their turn, so a found line can come up to a second after the tap, while the tick shows at once.
2. 4:3 tablets: both pillars show, so the view is small (a goat about 60 px at 1024x768); the headliner above is a gradient with a faint join.
3. Under the sidebar the car is its own mirror image (one wide seatbelt).
4. Real heights: a bus on the field fills half the view at 844x390; a bird is drawn at the tap floor.
5. Mid push-in the close-up's edge shows over the room for a moment; the tilt cross-fades two pictures (hands, book angle).
6. The recorder is not in the repo; the sheet predates the ride-start and stall commits (layers and clock unchanged).

## What changed
- **RIDE-07:** 19 s09b things at real heights; sky band; landmarks; big things on the field, in the grass before the fence; the s09b hills; the wide window shows both pillars, runs under the sidebar; calls end half behind the pillar; no jump after a stall.
- **RIDE-01:** `build/reports/s09-ride-join-844x390.png` (12 frames, 1008 ms apart, two joins, 0.87 MB).
- **BOOK-09:** spreads across both pages; push-in lined up on her eyes; the tilt lands on the pages under it; real sprites.
- `docs/language/recording-sheet.md` regenerated (the ride's new gaps).
- **Fix round:** the first page is built and decoded during the greeting and rises with the pages; face and card show together; every book line through one queue (once per event, no overlap, no zero length); the day-book flow fails on such a fault; unit tests.

## Proof
| what | result |
|---|---|
| red | `s09fa-red` |
| ride rows | `s09fa-green5`: RIDE-02 to 05 machine PASS; 01, 06, 07 sheets |
| book rows | `s09fa-green6`: BOOK-02, 08 machine PASS; 01, 03 to 07, 09 sheets |
| matrix | `s09-final-art-matrix6` (ride), `-matrix7` (book): 16/16 end, 0 breaks, 0 page errors |
| unit | ride 22/22, book 9/9; leak bots pass |
| checks | unit 487/487, static, docs, specs, recordings ok |
| fix round | BOOK-09 red `s09fa-fix-red`, green `s09fa-fix-green2` (BOOK-01 to 09, DAY-02); book at 8 sizes `s09fa-fix-matrix2`: 0 breaks |

Shared rows: covered by the contract checks (0 breaks).
