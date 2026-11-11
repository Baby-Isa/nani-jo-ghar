# s19-clean-c: daar, samosa, maani and sekelo, their rows and breaks (11 Nov night)

Opus, high. Branch `s19-clean-c`, never pushed. Flaws first.

## Flaws and open
- **Not zero.** L1-L4 at 740x320 and 1280x665: **150 → 124 breaks**. 78 and 91 are gone; 36 and 114 are mostly the chop's, the checks' or the kit's (below).
- **Sekelo at 740x320 is slower:** L2 and L3 now hit the 300 s cap (L2 at its results screen), as L4 did before. The four piece cards per skewer redraw the order on every piece.
- **CK-86 (sekelo's trays), built on the k3 tray, with a cost.**
  - The wide tray (3:1) is drawn over the old tray's box, so each is half the grill's width and the two stack to its height. It stands about 1.45 times taller than its own shape (a plain tray: only its rim's ends thicken).
  - The skewers stay upright, as on the grill.
  - The grill is smaller now (the rectangle is width-bound): contract-115 says the grill stands at 65% of the room, under the 70% asked. The check or Zafar decides (it should measure the trays and grill together).
  - Sekelo never used `grill-kit.js`, so its trays sit in `grill.js` (`SK.rackLong`), not as a per-station override in the kit.
- **MAA-23 has no frame:** no sandbox state lands on the moment (its `word-moment` note is in each L2 page's data). An evidence row at `life:word-moment` would give the judge one.
- **Rows have no before/after folder:** the brief's spec lists no rows, so `evidence.mjs --after` plays nothing.
- I overwrote a stale Nov-10 `scratchpad/base` copy by mistake (no repo file touched).

## Rows built (before `s19-clean-c-before/`, after `s19-clean-c-after/`, same flow, size and frame)
| row | what | frames (740x320 and 1280x665) |
|---|---|---|
| DAAR-45, -46, -03 | One stir: `Cook.StirKit` in `stir.js` (daar's pot, ladle, flag, dial, lap card); daar's step and the stir game call it. It ends when the child lets go and the move-on beat passes; under or over is stirred again. A gold mark under the hob per lap. "Enough" at the count only while teaching. | `cook-daar*/10-stir-mid` (L1-L4); the stir game `cook:stir` was not in the before |
| DAAR-12 | No speed before L4 (`daar.json stirSpeedFrom`); L1-L3 say "Stir it two times." | `cook-daar`, `-l2`, `-l3`, `-l4` `/10-stir-mid` |
| DAAR-51 | Katori 130 → 200 design px, the served bowl 166 → 256 | `cook-daar*/10-stir-mid` |
| SH-228 | Stir: the stuck help on the ladle, each lap pokes the idle clock. Maani: the roll's stuck help on the board, rolling pokes. contract-91 8 → 0 | `cook-maani-line-l2/06-kind-roll` |
| MAA-19 | Firai's light from L2 (`Cook.Coach.control`; the staged script stands down as the first maani lands). 78: 4 → 0 | `cook-maani-line-l3/07-kind-timing` |
| SAM-30 | Knob, each samosa of the first batch and the lift on the kit's controls. 78: 15 → 0 | `cook-samosa-l3/08-kind-timing` |
| SEK-25 | Four piece cards per skewer ("gos gos gos gos"), ticked as each goes on (`thread.js`, plus the shared lines below) | `cook-mishkaki-grill-l2/05-kind-tap`, `07-kind-timing` |
| MAA-23 | Big and small word moment: a maani rolled to each ring turns into its big word card, said by the engine (`Lang.phrase`), once per player | none (above) |
| CK-86 + k3 art | Sekelo's two wide plain trays (`v4/kit/tray-steel-long`). Daar's v4 onion heap and pieces 1-6 (the flying piece varies). Samosa's `karahi-oil-v2` and its measures. The kit's `grill-v2` for corn (`grill-kit.js`) | after: `s19-clean-c-contract/` (L1, four sizes): `cook-mishkaki-grill/06-kind-timing`, `cook-daar/05-kind-tap`, `cook-samosa/07-kind-timing`, `cook-corn/05-kind-tap`. Before: `s19-clean-c-before/` (the same frames). Corn was not in my before run, so it has no before frame here |

## Breaks by check (before → after)
| check | daar | samosa | maani | sekelo | all |
|---|---|---|---|---|---|
| 36 | 12→13 | 5→0 | 4→4 | 9→5 | 30→22 |
| 78 |  | 15→0 | 4→0 |  | 19→0 |
| 91 | 4→0 |  | 4→0 |  | 8→0 |
| 111 | 3→0 | 2→0 |  | 4→0 | 9→0 |
| 114 | 4→5 | 17→18 | 0→1 |  | 21→24 |
| 115 | 6→11 |  |  |  | 6→11 |
| 30 / 18 / 72 |  |  |  | 0→5 / 0→2 / 0→2 | new |
| other | 23→19 | 13→17 | 6→11 | 15→11 | 57→58 |
| **all** | 52→48 | 52→35 | 18→16 | 28→25 | **150→124** |

## Left, by owner
- **s19-clean-a (checks):**
  - 112 samosa: the light is round the strip, but lightjudge picks the filling on it (`lightjudge.py:274`), and `contract-s19.mjs:712` reads `getBounds`, not `litBounds`.
  - 96 maani (x3): the tawa's ring resets on its flip; no pot empties. Picture: `cook-maani-line-l2/740x320/09-view-service`.
  - 30 sekelo: SEK-25 drops the written count, one row per skewer.
  - 37 sekelo: gos is mishkaki's piece. 37 samosa: the plurals.
  - 114 samosa: the heaps (`ACCEPTED_SIZES`).
  - 36: the tadka pop-up's lines are not role call; the "no" card is ticked at the serve.
  - 105, 116, 72, 70, 73: the card, the row, the queue, the bubble.
- **s19-clean-b (chop):** daar's chop phase: 115 (x11), 114 (`chop4-*` snaps), 65, the swipe's 112 (DAAR-39).
- **s19-taps:** 111.
- **Me, next round:** 106 (maani's stuck lights fade about 500 ms after the press), 102 (one each), sekelo's speed at 740x320, CK-86.
- **Mum:** "Stir it {n} times." (daar-stir-ask), daar:veg, maani-line:roll. "nindhi/wadhi maani" come from the engine. Maani's word moment shows grey English wherever a word is missing.

## Exact lines for files I don't own
`build/reports/s19-clean-c.shared.patch` (git diff, applied in my runs, not committed):
- `data/cook.json`: daal's `speed` slot by level (none before L4); the stir row's `pic` set to the kit ladle; sekelo's tally gets `pieces`; daar's prefetch gets `v4/chop/*-whole` and `v4/kit/ladle`; sekelo's gets `mishkaki-meat-grilled-t`.
- `js/cook/recipes.js:370`, `js/cook/order.js:83`: pass `pieces`.
- `js/cook/ui.js` (plain rows): a row of piece cards per unit, each with its own key; a mixed skewer has no kind card.
- In the patch's `data/cook.json`, the k3 prefetch: `:5402` → `v4/daar/chop-heap-onion.webp`; `:5405` → `v4/daar/chop-piece-onion-1.webp`; `:5564` and `:5590` → `v4/samosa/karahi-oil-v2.webp`. Sekelo's prefetch gets `skewer-mixed-grilled-t.png` and `v4/kit/tray-steel-long.webp`. The stir lab's `files` get daar's pot, discs, ladle, dial and hob.
- **`data/stations/corn.json:476` (s19-clean-b):** `"assets/cook/items/v4/kit/grill-v2.webp",` (was `grill.webp`). Corn keeps `tray-steel` (`:477`).

## FIXED-IN-CODE rows, by their check in the after run
| row | check | result |
|---|---|---|
| DAAR-37 | 37 | passes |
| DAAR-38 | 91 | passes |
| DAAR-40 | 95 | passes |
| DAAR-41 | 98 | passes |
| DAAR-43 | 92 | passes |
| DAAR-44 | 100 | passes |
| DAAR-36 | contract run | fails (48 breaks, each named above) |
| DAAR-39 | 112 (chop, daar L1 740x320) | fails (2 lit regions) |
| MAA-21 | contract; the evidence probe not run | passes |
| MAA-22 | 112 | passes |
| SAM-31 | 100 | passes |
| SEK-22 | 105, 112 | passes |

## Proof
- Before: `build/screenshots/sandbox/s19-clean-c-before/`, 30/32 ends (sekelo L4 timed out at both sizes), 0 page errors, `CONTRACT FAILED: 150 breaks`.
- After: `s19-clean-c-after/` (commit 4ed56aa80, plus the patch), 29/32 ends (sekelo 740x320 L2-L4), 0 page errors, `CONTRACT FAILED: 124 breaks`.
- Contract, 4 sizes: CONTRACT_LINE
- checks.mjs: CHECKS_LINE
- check-change: CHANGE_LINE

QA: daar, samosa, maani, sekelo · reviewer: builder (the judge's to come) · Auto: checks ✅, contract ❌ (124, owners above) · LNG ✅ (engine lines only) · CMP ✅ (WordCard.big14, Coach.control and Coach.stuck only).
