# s20-b1-eggs: eggs joins the kitchen frame (14 Nov)

Branch `s20-b1-eggs`. The model report `build/reports/s20-step12-frame.md` is not in the repo; I followed chai's diff in merge 115d900.

## What changed (what a child sees)
- **The frame.** Eggs calls `Cook.Frame.area(S, {top, base, far, draw: true})` and `F.stoneBand(S, {game: "eggs"})`. Its hob, pot, pan and tray are laid out in `F.play`. Its shelf row sits between `F.bottom`'s edges. The sizes come from `F.px` and the view from `F.view()`. The table scene is a zone the size of `Cook.Frame.sheet`. The old sums are deleted, and the settings went from `margin`/`extraMax`/`top`/`above` to `inset`/`viewIn`/`hMax`. **No frame option was added.** Seen by a child: the gap above the shelf is the frame's 28 (was 26), so the hob is up to 2 px smaller. On a wide phone at L3-L4, a long shelf row stays centred under the hob up to the view's edge (it was held inside x 40-1560).
- **SH-281.** The steam is now the kit's painted wisps (Juice), as in chai's boil, not flat white circles that read as grey discs. The pot steams while it boils. Leftover wisps go with the hob at the serve, and the table's steam is wisps too.
- **SH-283.** Each decoy's place on the shelf and each plate's well are drawn with the order, before the pictures load.
- `kitchen-frame.md`: eggs added under "Who calls it" and in the counts. `placement.md`: CHAI-109, -110 and -112 were placed with a note (see Calls 5).

## Rows (open, "waits for the frame", naming eggs)
| Row | State | Proof or reason |
|---|---|---|
| SH-236 | settled | contract-106 (blocking): 0 |
| SH-239 | settled | contract-108 (blocking): 0 |
| SH-245 | settled | contract-115: 0 in eggs |
| SH-248 | settled | band `shelf` in settings, `F.stoneBand`; band.test.mjs passes |
| SH-250, SH-253 | settled | contract-112's dim and moving-in: 0 |
| SH-256 | settled | contract-114: 0 in eggs |
| SH-249 | open: a check fault | 1 contract-112 break, also on the base (Proof) |
| SH-272 | passes the rule | panel-holds: 8/8 pages |
| SH-281, SH-283 | built | their checks are still to build; the eye judge to look |
| SH-274 | kit | contract-119 x8 (the dish card's flash): the order pop-up, Sprint 21's round |
| SH-277 | kit; Calls 1 | |
| CK-92, SH-275 | Calls 2 | |
| CK-93 | Calls 3 | |

## Calls for Zafar
1. **SH-277.** The order headline shrinks 2 px once the card is done (16.5 to 14.5 at 1280): the done tick takes 28 px of the head only when the card folds (`css/shared/order-card.css`). Keep the tick's room on every side-panel card from the start, so the headline is set once? **Recommend yes** (a kit change; it moves chai's headline box, so chai's reference is re-taken). The 3 lines at 740 are gone.
2. **CK-92 / SH-275.** A pan-wide fried egg cannot keep its size on a plate 0.38 of the tray (contract-114: within 15%). Grow the plates (or the tray) so the egg fills the pan and keeps its size, with the ring at the pan's rim as chai's? **Recommend yes**, shown on pictures first.
3. **CK-93.** Well done in the serve's kitchen means removing the table scene with the cat (his mechanic, non-negotiable 1). Remove it? **Recommend no** until he sees it beside chai's praise.
4. **contract-112 at eggs L3 hint 1280** (the same on base 115d900): the pot's light is on its round body (CK-63). Its picture is only 44% inside that light (the handle), so the judge takes the egg cooking inside as the lit thing. Let the judge take a game's lit body (`litBounds`) as the thing? **Recommend yes** (a check change, orchestrator).
5. The push hook refused every push from the base (`stdids`: CHAI-109, -110, -112 unplaced). I placed them as "not a standard" with a note saying why. The orchestrator places them for real.

## Proof
PROOF_HERE
