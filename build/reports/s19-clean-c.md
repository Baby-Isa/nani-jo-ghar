# s19-clean-c: daar, samosa, maani and sekelo (11 Nov night)

Opus, high. Branch `s19-clean-c`, never pushed. Flaws first.

## Flaws and open
- **Not zero.** L1-L4 at 740x320 and 1280x665: **150 → 124 breaks**. 78 and 91 went to 0; the rest have owners below.
- **After the merge** (s19-taps, the k3 art) the four-size contract went 29 → 82: mostly samosa's fill lights (36, 106) and stuck clocks (91). Not yet split between the merge and my wiring.
- **Sekelo at 740x320** hits the 300 s cap at L2-L3 (L4 before): the piece cards redraw the order per piece.
- **CK-86, built on the k3 wide tray, with costs:**
  - The 3:1 tray is drawn about 1.45 times taller than its shape.
  - The grill shrank (width-bound): contract-115 reads 65% of the room, under 70%.
  - It is `SK.rackLong` in `grill.js`: sekelo never used `grill-kit.js`.
- **No frames:** MAA-23 (no sandbox state lands on the moment), and corn's before.
- `evidence.mjs --after`: the spec lists no rows.
- I overwrote a stale Nov-10 `scratchpad/base` copy by mistake.

## Rows built
Before `s19-clean-c-before/`, after `s19-clean-c-after/`; the same flow, frame and sizes (740x320, 1280x665).

| row | what | frames |
|---|---|---|
| DAAR-45, -46, -03 | One stir, `Cook.StirKit` (`stir.js`), for daar and the stir game. It ends when the child lets go and the beat passes; under or over is stirred again. A gold mark per lap under the hob. | `cook-daar*/10-stir-mid` |
| DAAR-12 | No speed before L4 | the same, L1-L4 |
| DAAR-51 | Katori 130 → 200, the served bowl 166 → 256 | the same |
| SH-228 | Stuck help on the stir's ladle and maani's board; laps and rolling poke the idle clock (91: 8 → 0) | `cook-maani-line-l2/06-kind-roll` |
| MAA-19 | Firai's light from L2 (`Coach.control`; the staged script stands down; 78: 4 → 0) | `cook-maani-line-l3/07-kind-timing` |
| SAM-30 | Knob, each samosa of the first batch, and the lift on `Coach.control` (78: 15 → 0) | `cook-samosa-l3/08-kind-timing` |
| SEK-25 | Four piece cards per skewer, ticked as each piece goes on | `cook-mishkaki-grill-l2/05-kind-tap`, `07-kind-timing` |
| MAA-23 | A maani rolled to each ring turns into its word card, said by the engine, once per player | none |
| k3 art | Sekelo's wide trays; daar's v4 onion (pieces 1-6 vary); samosa's `karahi-oil-v2` and its measures; corn's `grill-v2` | after `s19-clean-c-contract/`, L1: `cook-mishkaki-grill/06-kind-timing`, `cook-daar/05-kind-tap`, `cook-samosa/07-kind-timing`, `cook-corn/05-kind-tap`; before: the same frames |

## Breaks by check, before → after (L1-L4, two sizes)
| check | daar | samosa | maani | sekelo |
|---|---|---|---|---|
| 36 | 12→13 | 5→0 | 4→4 | 9→5 |
| 78 |  | 15→0 | 4→0 |  |
| 91 | 4→0 |  | 4→0 |  |
| 111 | 3→0 | 2→0 |  | 4→0 |
| 114 | 4→5 | 17→18 | 0→1 |  |
| 115 | 6→11 |  |  |  |
| 30, 18, 72 |  |  |  | 0→9 |
| other | 23→19 | 13→17 | 6→11 | 15→11 |
| **all** | 52→48 | 52→35 | 18→16 | 28→25 |

## Left, by owner
- **s19-clean-a (the checks):**
  - 112 samosa: lightjudge picks the filling on the strip (`lightjudge.py:274`); `contract-s19.mjs:712` reads `getBounds`, not `litBounds`.
  - 96 maani: the tawa's ring resets as the maani flips; no pot empties (`cook-maani-line-l2/740x320/09-view-service`).
  - 30 sekelo: with SEK-25 the count is no longer written; each skewer is a row.
  - 37: gos is mishkaki's piece; samosa's plurals.
  - 114: samosa's heaps (`ACCEPTED_SIZES`).
  - 36: the tadka pop-up's lines; the "no" card. Also 105, 116, 72, 70, 73.
  - 115: sekelo's grill rectangle, measured grill alone.
- **s19-clean-b (chop):** daar's chop phase: 115, 114, 65, and 112 (DAAR-39).
- **s19-taps:** 111.
- **Me, next round:** the post-merge rise, 106 (stuck lights fade 400-700 ms late), 102, sekelo's speed.
- **Mum:** "Stir it {n} times.", daar:veg, maani-line:roll.

## Exact lines for files I don't own
`build/reports/s19-clean-c.shared.patch` (`git apply` it; it was applied in my runs):
- `data/cook.json`:
  - daal's `speed` by level (none before L4).
  - The stir row's `pic` is the kit ladle.
  - Sekelo's tally gets `pieces`.
  - The stir lab's `files` get daar's pot, discs, ladle, dial and hob.
  - Prefetch: daar gets `v4/chop/*-whole` and the ladle; sekelo gets `mishkaki-meat-grilled-t`, `skewer-mixed-grilled-t` and `tray-steel-long`.
  - The k3 lines: `:5402` → `v4/daar/chop-heap-onion`, `:5405` → `v4/daar/chop-piece-onion-1`, `:5564` and `:5590` → `v4/samosa/karahi-oil-v2`.
- `js/cook/recipes.js:370` and `js/cook/order.js:83`: pass `pieces`.
- `js/cook/ui.js`: a row of piece cards per skewer, each with its own key. A mixed skewer loses its kind card.
- **`data/stations/corn.json:476` (s19-clean-b):** `"assets/cook/items/v4/kit/grill-v2.webp",`

## FIXED-IN-CODE rows, by their check in the after run
- **Pass:** DAAR-37 (37), DAAR-38 (91), DAAR-40 (95), DAAR-41 (98), DAAR-43 (92), DAAR-44 (100), MAA-21 (contract; its probe not run), MAA-22 (112), SAM-31 (100), SEK-22 (105, 112).
- **Fail:** DAAR-36 (48 breaks, named above); DAAR-39 (112, chop: two lit regions).

## Proof
- Before: `build/screenshots/sandbox/s19-clean-c-before/`: 30/32 ends (sekelo L4 timed out), 0 page errors, `CONTRACT FAILED: 150 breaks`.
- After: `s19-clean-c-after/` (4ed56aa80 with the patch): 29/32 ends (sekelo at 740x320, L2-L4), 0 page errors, `CONTRACT FAILED: 124 breaks`.
- The four-size contract (`s19-clean-c-contract/`):
  - Before the merge: 20/20 ends, 0 page errors, `CONTRACT FAILED: 29 breaks`.
  - After the merge: 20/20 ends, 0 page errors, `CONTRACT FAILED: 82 breaks`.
- `checks.mjs`: every step ok (699 s). The load check: 6/6 of my pages, the stir lab included, with the patch.
- check-change (`--brief`, base 3c80c8aa4): push passed (7.1 min; `build/reports/tiers/push-e2f548e51f.md`); scope failed on the merged integration branch's `sources/art/s19-k3/` files; play was stopped at my 25-minute limit. No change result file was written.

QA: builder only · checks ✅ · contract ❌ · LNG ✅ (engine only) · CMP ✅ (shared kit pieces only).
