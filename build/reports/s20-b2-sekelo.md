# s20-b2-sekelo: sekelo joins the kitchen frame (15 Nov)

Files: the station, its settings, the thread and grill mechanics (call 1), `frame.js` (one option added) and `kitchen-frame.md`. The BEFORE evidence was not played at launch, and the spec has no rows. The base's gate: `contract FAIL 17.3` (26 blocking: contract-104 and -128 on every page, contract-91 at L3 #hint).

## What a child sees
- **Thread screen:** the board and the tray are the frame's row of two (`F.row`), centred across the play area. They sit about 40-60 sheet units further left at every size; up and down is unchanged.
- **Bowls:** they sit between the bottom row's edges, as chai's shelf does. At 740, 930 and 1280 they shift with the wider view; at 1920x1080 nothing moves.
- **Grill screen:** unchanged. The same sums now run as `F.row([grill, tray], {room 63, gapUnit 0.08, min 120})`; the group can sit at most 24 lower where its height is not what limits it.
- **Dish card:** "hakro sekelo" now shows the served sekelo, at every level and size.
- **Grill, stuck:** after the level's wait, Nani's helper card and the kit's light on the first skewer on the band.
- **Thread, stuck:** the bowl's glow goes out while the grown-ups' "?" pop-up hides its light.
- **Frame option `gapUnit`:** the gap as a share of the unit, so the grill and its tray stay one rectangle (CK-86). Chai and maani are unchanged.

## Calls taken while Zafar was away
1. I treated the thread and grill mechanics as sekelo's own, since only sekelo runs them and its layout lives there. Other option: only the station file.
2. Each screen reads the area afresh, not `area.next`, because `St.begin` clears the stage. Other option: one band across both screens.
3. `gapUnit`. Other option: the frame's tenth of the play width, which parts the tray from the grill and makes the grill about 3% smaller where width limits it.
4. The dish card shows the served plate. Other option: one grilled skewer, which needs art.
5. The stuck light goes on the first skewer, not the needed one (the leak test). Other option: the needed one.

## Rows ('waits for the frame', naming sekelo)
Each check is at 0 in gate-20261115T0704. No status moved.

| Row | State | Proof or reason |
|---|---|---|
| SH-245, CK-86 | built | contract-115 (S19: 8); eye: the judge |
| SEK-26 | built | contract-114, -115; eye: the judge |
| SEK-27, SH-248 | built | contract-123 |
| SH-236, -238, -239 | pass | contract-106, -103, -108 |
| SH-227, SH-241 | pass | contract-100 (the kit's card) |
| SH-53, SH-158 | pass | contract-8, -77 |
| SEK-28 | built (S19) | its check is still to build |
| SEK-29 | lights pass | contract-117; the row jump (contract-72, advisory) is `ui.js`'s; browning and the cog: eye |
| CK-81 | built | contract-113; the ring at 740x320: eye |

## Proof
- **frame-counts:** mishkaki-grill 0 (was 2); chai-tray 0.
- **Sekelo's gate:** `GATE PASS mishkaki-grill: checks pass 2.6, contract pass 16; 18.6 min`: 0 blocking over 28 pages, advisory contract-120 x1. The first run's one block (contract-102, L2 #mistake 740x320) is fixed.
- **Chai's gate:** `GATE PASS chai-tray: checks pass 2.5, contract pass 22.6, boxes:chai-tray pass 3.6; 28.6 min`, boxes identical. The later merge brought no code.
- **Four sizes** (`s20-b2-sekelo-contract`): 8/8 pages reach their end; `CONTRACT PASSED: 0 breaks over 8 pages`.
- **Geometry rules:** cannot run: "No box spec for mishkaki-grill" (`boxes.mjs`, read-only).
- **check-change:** `PASSED in 19.5 min`, `build/reports/tiers/change-ded1bef559.md`.
- **Evidence:** no after folder (no rows).
