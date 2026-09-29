# Stage fill + the order card's open fixes (29 Sept, queue item 8)

**Zafar (29 Sept):** "Yes, it should be filled with the counter top and actual game elements if required."

## 1. The cream band is gone, at every stage shape

**Before:** the world was 1600×900 with `Phaser.Scale.FIT` in `#stage`. At laptop (1366×768, stage ≈1106×768) about 73 px of flat cream showed above and below the counter at every station (`before/laptop-*.png`). On a phone held sideways (wider than 16:9) the strips were at the sides instead.

**Now:**
- **Scale** (`js/cook/flow.js`): `Phaser.Scale.EXPAND`. The canvas fills `#stage` whatever its shape, and the visible world grows past 1600×900 in whichever direction the stage has room. `#stage`'s CSS didn't need a change.
- **Camera** (`CookScene.fitView`, `js/cook/stations.js`): the 1600×900 design box stays centred across and is **anchored to the bottom**, so the shelf band always reaches the stage's bottom edge and the extra height is worktop above it. It re-fits on every resize. `Cook.view` = the visible world rectangle.
- **Backgrounds** (`fitBg`): the marble, hob and wood worktops are cover-fitted to the view (scaled, never stretched). The service room picture is scaled about the island's edge (y 520), so the family still lean on it. The **pantry photo stays 1:1** (its shelves are the tap targets), and past its edges it carries on in its own edge row and column: the wall goes up and the fridge reaches the ceiling. It reads as a built-in fridge.
- **Each station's softened-marble rectangle and shelf band** are drawn past the design box (`FAR = 2000`), so no edge shows at any shape (chai, maani, daar, samosa, chaat, sekelo).
- **Play pieces use the extra height:** `Cook.lift()` (half the extra height) raises each scene into the middle of the worktop, rather than leaving it squeezed against the shelf with empty marble above. Chai lifts its hob and tray, maani its hob and chakla, and daar its board, knife, bowls, hob and serve bowl. Samosa lifts the fill board, plate and fry hob; chaat the glass; sekelo the thread board, rack and grill. The shelf band (slots, chips, planks, samosa's thalis) stays on the plain zone. Two helpers: `Cook.liftZone(z)` wraps a zone so its `Y`/`P` are raised while input, expectations and reporting stay the zone's own, and `Cook.offRight(x)` makes a person slide in from beyond the visible right edge, even on a wide stage.
- **HTML placed from world points** (`js/cook/ui.js` `worldToScreen` / `worldToStage` / new `worldScale`): these go through the camera (scroll and zoom). Nani's bubble, the tally on the pantry fridge (re-placed on resize via `UI.onViewFit`), the coach's ghost finger (`coach.js`), the hand tap size (`hands.js`) and the test hooks' `sx/sy` all use them. The ✓ serve button, "to the grill" and "fry them" are stage-anchored HTML, so they sit in the stage corner as before. Pointer hit-testing already used `worldX/worldY` (camera-aware); every station played through in the shots and in `test_cook`.
- **Layout only in the stations.** No mechanic changed.

**Art:** none needed. The only compromise is the pantry at extreme shapes, where the carried-on wall and fridge are plain. A taller pantry painting (wall above the shelves, the fridge to the ceiling) would be nicer at 4:3, but it's optional.

## 2. The order card

- **A "don't" row stays neutral while the dish is made.** `settle()` no longer ticks a section's no-rows when its other rows close, and `closeItem` no longer closes a no-row by its word mid-dish. A no-row ticks with the dish's finish (`finishDish`), a whole-order `closeItem([], {all})` (chai's per-person pour), or the station's own `tickItem(…, {no})`. The shared card already lets an open no-row count as done for folding. Daar's stopgap `neutralNo()` is deleted.
- **A card waits for its head.** The order's own card passes `data.done = rows all done && head done` when the head is a thing being made (samosa's *trae samosa*, Nana's *daar*). A head still to record (the pantry's "Bring me these") or with no word waits for nothing. `closeItem` ticks the head on `{head: true}`, on `{all}` for the whole order, or when its word is the only match (samosa's `closeItem(["ph-samosa"])` after tasting). Checked in shots: samosa stays face + headline with **no ✓** while folding and frying, and Nana's daar card stays open through the stir with *dungri na* neutral. The ✓ and "Served" come at the end. Chaat's level-4 start-folded card now also stays closed after the rows close (before, a done card ignored `closed`).
- **The folded headline never shows "…"** (`js/shared/fit.js` `fit-wrap`, used by `.oc-headline`). It shrinks on one line down to 14 px, then wraps to two lines. The whole-line state is set inline, so the fit watcher can't loop.
- New Node test (`build/test_shared_order_card.mjs`): a host's `done: false` holds the card, and an open no-row never holds the fold.

## 3. Shots, each opened and judged (`build/reports/stage-fill/`)

`before/`: the original build (a324cb7), laptop and phone landscape: cream strips above and below at laptop; a strip below and thin strips at the sides on the phone.

`after/` (start = first playable moment or the order card over the room; mid = a few actions in):

| Station | laptop 1366×768 | phone landscape 844×390 |
|---|---|---|
| chai | Marble to the top, shelf to the bottom; hob + tray centred in the worktop. Tally top right, clear. ✓ | Fills the width, no side strips; hob/tray/shelf all visible. ✓ |
| maani | Chakla + hob centred; plates on the band to the bottom edge. ✓ | Fills; order card over the room picture, room fills the width. ✓ |
| sekelo | Board + rack centred; bowls/chips on the band; "to the grill" in the corner. ✓ | Fills; bowls and chips readable. ✓ |
| chaat | Glass centred in the worktop, bowls + chips on the band, ✓ button bottom right. ✓ | Fills; glass and six bowls fit. ✓ |
| samosa | Board + plate centred; fillings on the band; fry hob centred (card shots). ✓ | Fills; board, plate, bowls and ✓ fit. ✓ |
| daar | Board, knife, bowl centred; veg crates on the band; stir word pop beside the pot. ✓ | Fills; board/knife/bowl and crates fit. ✓ |
| pantry | Photo 1:1; the wall and fridge carry on to the top; tally on the fridge. ✓ | Fills the width (wall/fridge carried on at the sides); tray and shelves 1:1. ✓ |

Also: `wide-*` (1920×1080): all seven fill with no strips; the room picture is scaled about the island. ✓ `tall-*` (1024×768, a stage close to square): all seven fill. The scenes sit in the middle of a tall worktop, so the pieces look a little small with a lot of marble. That's acceptable. Scaling the scenes up on near-square stages would be a follow-up if Zafar wants it. ✓

Card states: `card-samosa-frying.png` (folded, no ✓, while frying) and `card-daar-stir.png` (open through the stir, *dungri na* neutral).

## 4. Tests

- `node build/test_shared_order_card.mjs`: 7/7. `test_shared_ui.mjs` 8/8, `test_shared_compat.mjs` 5/5.
- `build/test_cook.py --lab --viewport laptop`: **PASS** (200 screenshots, 1460 s; every lab station played through, so pointer hit-testing through the camera works).
- `build/test_cook.py --days 1 --canvas --viewport laptop`: **PASS** (36 shots; the service room with Nani leaning on the island looks right). It first failed twice at "the ? didn't close the goal": the test pressed ? on the first tap, and the first-time coach (which starts on its own 120 ms tick) arrived just after, covering the button. It passed on the old build by timing alone. The test now gives the coach 0.4 s and tries the ? later if the coach is up. No test is skipped.

## 5. Notes for others

- The orchestrator's kari/mori chai commit landed on this branch mid-run (`orderCards` person headline `s.head`); it merged cleanly, and my `data.done` change only touches the order's own card.
- New station code should draw backgrounds past the design box (`FAR`) and lay scene pieces out with `Cook.liftZone(z)` / `Cook.lift()`, keeping the shelf band on the plain zone.
