# s20-b2-chaat: chaat joins the kitchen frame

Branch `s20-b2-chaat` (from `f794015`, `origin/ccr-7da5e9f0-04g4xm` merged again before the gates). Nothing a child sees moves, at any level or size.

## What changed
- **Chaat's layout** is its mechanic's, `js/cook/mechanics/assemble.js` (only the chaat recipe and its "Chaat bowl" lab use it), with its settings `data/stations/chaat.json`. It now reads only the frame: `Cook.Frame.area(S, {top, draw: true})` draws the wash; `F.stoneBand(S, {game: "chaat"})` pulls the tray. The serving bowl's width is a share of `play.w`. Its middle sits at shares of `play`, lowered by a share of its own width. The tray row's span is in shares of `play.w`. The pills' foot comes from `bottom`, and the pop, face, pills and review room from `view()`, `px` and `toScreen`. `Cook.liftZone`, `Cook.view`, `worldToScreen`, `1600` and `896` are gone.
- **Chop in chaat** stays chop's own game with the whole play area. Chaat lends nothing (see the calls below).
- **No frame option added.** `kitchen-frame.md` gains chaat's line and its count.

## Proof
- **frame-counts:** `frame-counts.mjs` lists only `stations/*.js`, so it has no chaat row. The same rule over `assemble.js` counts 7 before and 0 now. chai-tray stays at 0.
- **Tier 0** (`checks.mjs`): 14 steps ok in 311 s (unit tests: 1014 pass, 0 fail).
- **Gate chaat** (`gate-20261115T0549-chaat`, 6.4 min): FAIL, with 17 blocking breaks from 3 checks, none from this change:
  - contract-104 ×8 and -128 ×8: the "hakro chaat" dish card has no picture (SH-273). The kit's `ui.js` has no chaat picture and no art exists.
  - contract-74 ×1 (L1 #hint 1280): a tap during the layer order lands the whole order. This is the order's own logic.
  - The base `f794015` has the same breaks: the 740 gate showed contract-104 ×4 and -128 ×4, and a 1280 #hint replay showed contract-74.
  - The advisory breaks at 740 match the base at the same pixels, for example the tray pill tap at (366, 306).
- **Gate chai-tray** (`gate-20261115T0606-chai-tray`, 24.7 min): PASS. Contract: 0 blocking over 38 pages. Boxes: identical.
- **Geometry rules:** no box spec for chaat (`boxes.mjs` GAMES: chai-tray, eggs, maani-line).
- **Contract at four sizes** (`cook:chaat,lab:cook/assemble`): `CONTRACT FAILED: 21 breaks (contract-104 8, contract-128 8, contract-26 3, contract-111 2)`.
  - All 8 pages reach their end with 0 page errors (`build/screenshots/sandbox/s20-b2-chaat-contract2/`).
  - contract-104 and -128 are the dish card above. contract-26 is the missing "chano" clip, and contract-111 is the pill speaker's reach. Both are advisory and on the base.
  - The brief's `lab:cook/chaat` names no lab: it sat 871 s on a blank page twice, and the run timed out. Chaat's labs are `assemble` and `recipe-chaat`.
- **Evidence:** the brief has no rows, so there is no BEFORE folder and nothing was played at launch.
- **check-change** (`--base origin/ccr-7da5e9f0-04g4xm`; result `build/reports/tiers/change-6531e5599c.md`, 67 min): FAILED. Tier 0, film, leak-cook, pairs and rows pass. Nothing it blocks on comes from this change:
  - **Contract:** play has 47 breaks against the base's 46. The extra one is advisory contract-120 on the warm glow; the base gate had it twice.
  - **Scope** names `assemble.js`, which is chaat's layout code. The brief allows it, but the audit can't read that clause.
  - **Frozen:** chai's lab at 740 lost a sound, `cook-right`. Chai loads none of chaat's files, and chai's gate passed.
  - **Mount** is chai-tray's own page.
  - **vessel-meta** fails on `assets/cook/items/v3/chaat/pot-chana.webp`, which was never in git.
- **QA checklist:**
  - Tier 0 passes.
  - Flows reach their end with 0 page errors at the four sizes.
  - The leak bot passes.
  - No Kutchi or English changed, and no art changed.
  - The judge's pictures are the orchestrator's (no rows).

## Rows (waits for the frame, naming chaat)
| Row | Now | Proof or reason |
|---|---|---|
| SH-239, -241, -236, -238, -274 | check passing on chaat | contract-108, -100, -106, -103, -125: 0 in the gate (L1-L4, both sizes) |
| SH-245 | check passing | contract-115: 0 |
| CHT-19 | check passing | contract-36: 0 over L1-L4 (one seed each, not ten) |
| SH-248 | built | the band comes from chaat's key; `band.test` passes |
| CHT-17 | check passing | contract run, flows end, no new breaks |
| SH-258 | built (s19), unchanged | no contract check |
| SH-259 | built, except the lend | chop is chop's own game. Lending a part needs the recipe runner (call 1) |
| CK-110, SH-275, SH-280 | cannot be done here | the chop mechanic (`mechanics/chop.js`), ART-66, flow moves |
| SH-270, -271, -279, -283 | cannot be done here | the kit (Nani's box, the coach's light, the review's praise). SH-283: the tray is shuffled per round, so a different round shows a different order |
| CHT-13 | built, unchanged | an eye row: it needs the judge's pictures |

## Calls taken while Zafar was away
- **The bowl's place:** I kept the exact old place, the play area's middle lowered by 1.6% of the bowl's width. The other option was centring it exactly, about 9 units higher.
- **The tray row's span:** I kept the exact old span as shares of the play area, just past its edges. The other option was the bottom row's edges, as chai's, which would spread the bowls on wide screens.

## Calls for Zafar (left)
1. Should a recipe's step be able to name the room it lends the game it runs (`"room"` in `data/cook.json`, with `recipes.js` lending it through `Cook.Frame.lend`)? **Yes when a recipe first needs a part.** None does today.
2. Should chaat get a dish-card picture (a full chaat bowl from above) in the next art run? **Yes.** It clears contract-104 and -128 on chaat. Until then, the kit should drop the empty box (`ui.js`).
3. contract-74 at chaat's layer order: the kit's fix (s20-kit-fix).
