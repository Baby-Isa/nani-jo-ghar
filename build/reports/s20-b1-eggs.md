# s20-b1-eggs: eggs joins the kitchen frame (14 Nov)

Branch `s20-b1-eggs`. `s20-step12-frame.md` is not in the repo, so I followed chai's diff in 115d900.

## What changed
- **Frame:** eggs calls `Cook.Frame.area(S, {top, base, far, draw: true})` and `F.stoneBand(S, {game})`. The hob, pot, pan and tray are laid out in `F.play`, the shelf row between `F.bottom`'s edges. Sizes come from `F.px` and `F.view()`, and the table is a `Cook.Frame.sheet` zone. The old sums are gone; the settings `margin/extraMax/top/above` became `inset/viewIn/hMax`. **No frame option added.** A child sees: the hob up to 2 px smaller (the frame's 28 gap above the shelf, was 26). On wide phones at L3-L4 the shelf row stays centred under the hob up to the view's edge (it was held inside x 40-1560).
- **SH-281:** the kit's painted steam wisps, as chai's boil, in place of flat circles that read as grey discs. The pot steams while it boils, and its steam goes with the hob at the serve.
- **SH-283:** the decoys' shelf places and the plates' wells are drawn with the order, before the pictures load.
- `kitchen-frame.md`: eggs added to "Who calls it" and to the counts.

## Rows
| Row | State | Proof or reason |
|---|---|---|
| SH-236 / 239 | settled | contract-106 / -108 (blocking): 0 |
| SH-245, SH-256 | settled | contract-115, -114: 0 in eggs |
| SH-248 | settled | band `shelf`, `F.stoneBand`; band.test passes |
| SH-249, 250, 253 | settled, one flake | contract-112: 0 in the final gate (Call 4) |
| SH-272 | passes its rule | panel-holds 8/8 |
| SH-281, SH-283 | built | checks still to build; eye judge |
| SH-274 | kit, Sprint 21 | contract-119 x8, base too |
| SH-277 | kit | Call 1 |
| CK-92, SH-275 | Zafar | Call 2 |
| CK-93 | Zafar | Call 3 |

## Calls (yes/no)
1. **SH-277:** the headline drops 2 px (16.5 to 14.5 at 1280) once the card folds, because the done tick then takes 28 px (`css/shared/order-card.css`). Should every side-panel card keep the tick's room from the start? **Yes** (kit; chai's headline box moves, so its reference is re-taken). The three lines at 740 are gone.
2. **CK-92/SH-275:** a pan-wide fried egg cannot keep its size (contract-114) on a plate 0.38 of the tray. Should the plates or the tray grow so the egg fills the pan, with its ring at the rim as chai's? **Yes**, on pictures first.
3. **CK-93:** praise in the serve's kitchen means removing his table scene with the cat. Remove it? **No**, until he sees it beside chai.
4. **contract-112 (judge):** the pot's light is its round body (CK-63); its picture, with the handle, is only 44% inside it, so the judge picks the egg cooking inside. Should the judge use the game's `litBounds`? **Yes** (orchestrator).
5. The push hook refused every push on the base (`stdids`: CHAI-109/110/112 unplaced). I placed them in `placement.md` as "not a standard" with a note; the orchestrator to place them for real.

## Proof
- **Eggs gate** `gate-20261114T2213-eggs`: **PASS, 8.9 min** (checks 2.2, contract 6.6: 0 blocking over 18 pages). Two earlier runs, and one on base 115d900, broke contract-112 once at L3 hint 1280. The final run passed with no code change: flaky, logged (Call 4), never re-run for green.
- **Chai gate** `gate-20261114T2143-chai-tray`: **PASS, 26.2 min** (checks 2.1; contract 20.2, 0 blocking over 38 pages; boxes 3.8, **identical**).
- **frame-counts:** `eggs 0`.
- **Geometry rules** (`s20-b1-eggs-rules2`, L1/L4, four sizes): **8/10, 2.2 min.** headline 4 (SH-277). tap-size 13: the kit's word-card buttons, as chai's.
- **Four sizes** (`s20-b1-eggs-contract`): 8/8 pages reach their end, 0 page errors; 8 breaks, all contract-119 (base too).
- **check-change** (`build/reports/tiers/change-74268de8f2.md`): **FAILED, 9.2 min.** (a) contract-37 at L1 hint 740 counted n.egg as unasked while the card's rows were blank; the base tree has the same game code and 0 (a flake). (b) "SH-277: no evidence spec" (probes aren't mine). The brief has no rows, so there are no before/after folders.
- **checks.mjs:** pass (after Call 5).
