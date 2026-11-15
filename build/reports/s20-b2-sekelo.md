# s20-b2-sekelo: sekelo joins the kitchen frame (15 Nov)

Files: `mishkaki-grill.js`, `mishkaki-grill.json`, the thread and grill mechanics (only sekelo runs them: call 1), `frame.js` (one option added), `kitchen-frame.md`. The BEFORE evidence was not played at launch (the spec names no rows, so there is no before folder). In its place I ran the base's own gate: `GATE FAIL mishkaki-grill: contract FAIL 17.3` (26 blocking: contract-104 and -128 on every page, contract-91 at L3 #hint).

## What changed, and what a child sees
- **Frame:** both screens ask `Cook.Frame.area` (its wash, its stone band, `F.row`). Removed: `centreLift`, `Cook.view`, `Cook.lift`, `worldToScreen`, the sheet's 1600/900, and the shelf's `1600 - RIGHT`.
- **Thread screen:** the board and the tray are now the frame's row of two, centred across the play area with the frame's gap. A child sees the pair about 40-60 sheet units further left at every size; up and down is unchanged (chai's measure).
- **Bowls:** they sit between the bottom row's edges, as chai's shelf does. Where the screen shows more than the sheet (740x320, 930x430, 1280x665) they shift with the wider view. At 1920x1080 nothing moves.
- **Grill screen:** the same sums, now `F.row([grill, tray], {room 63, gapUnit 0.08, min 120})`. Sizes and places are unchanged; the group moves at most 24 down where its height is not what bounds it (chai's TOP_KEEP).
- **New frame option, `gapUnit`:** the gap as a share of the unit, so the grill and its tray stay one tidy rectangle (CK-86). Chai and maani get the frame's gap as before.
- **Dish card:** "hakro sekelo" now shows the served sekelo on the order card and in the dish's flash, at every level and size (contract-104, -128).
- **Grill, stuck:** after the level's wait, Nani's helper card and the kit's light come on the first skewer on the band (contract-91, every level).
- **Thread, stuck:** the bowl's glow goes out while the grown-ups' "?" pop-up hides the light (contract-102, a race on the base code).

## Calls taken while Zafar was away
1. I treated the thread and grill mechanics as sekelo's own, since all its layout lives there (the other option: only the station file, leaving the screen reads in them).
2. Each screen reads the area afresh, not `area.next`, because `St.begin` clears the stage (the other option: keep one band across both).
3. `gapUnit` (the other option: the frame's tenth, which parts the tray from the grill and makes the grill about 3% smaller where width bounds it).
4. The dish card is the served plate (the other option: a single grilled skewer, which needs art).
5. The stuck light goes on the first skewer, not the one the order still needs: the leak test (the other option: the needed one).

## Rows ('waits for the frame', naming sekelo)
Every check below is at 0 in gate-20261115T0704 (28 pages, L1-L4, 740x320 and 1280x665). I moved no row's status.

| Row | State | Proof or reason |
|---|---|---|
| SH-245, CK-86 | built | contract-115: 0 (it was 8 in S19); eye beside the mock: the judge |
| SEK-26 | built | contract-114, -115: 0; eye beside the mock: the judge |
| SEK-27, SH-248 | built | contract-123: 0 (band, grill, one cooked tray on the right) |
| SH-236, SH-238, SH-239 | pass for sekelo | contract-106, -103, -108: 0 |
| SH-227, SH-241 | pass for sekelo | contract-100: 0 (the card is the kit's, `ui.js`) |
| SH-53, SH-158 | pass for sekelo | contract-8, -77: 0 |
| SEK-28 | built (S19, `serveAs`) | its own check is still to build |
| SEK-29 | lights pass | contract-117: 0. The order row's jump (contract-72, advisory, 2 in my first gate) is the kit's (`ui.js`). Browning and the cog: eye |
| CK-81 | built | contract-113: 0; the ring at 740x320: eye |

## Proof
PROOF
