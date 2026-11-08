# s19-cards: chai's cards in every kitchen game, no tick buttons, cards tick as made

Opus, high. Branch `s19-cards`, with the integration branch merged in at 02ab1ba. Flaws first.

## Flaws and open
- **Chai's frozen diff after the merge** (`build/reports/frozen-diff-chai-tray-202611082125.md`) lists 22 changes:
  - 20 of them are the new contract-102 and -105 (light checks), which have no frozen baseline yet.
  - 2 are on L2 `#mistake` at 740x320: "Chulo bar!" was missing in both of the diff's plays. A third play (`s19-chulo-a`) hears it once, so I read it as a timing variation, not a change. The judge should listen.
  - Before the merge (`-202611081955`): 3 known variations only.
- **contract-101, samosa L1 at 740x320:** station one never showed the drop-down. It shows at the other three sizes.
- **Not done, because the files aren't mine** (exact changes are in the hand-back):
  - CHAI-107 (`js/shared/serve.js`)
  - SH-235 (`js/shared/buttons.js`, `css/shared/buttons.css`)
  - the ART row (`docs/process/regressions.md`)
  - the stir line's row in the recording sheet (generated from `data/lang/seed`)
- **Maani flaw 5 not done:** the pop bubble still shows the whole headline the voice says.
- **Sekelo's card English** is not yet two words ("one skewer of tomato"): that needs the engine's gloss.
- **Chop's "chop again"** (`M.askLine`) is still a headline-only big card.
- **No BEFORE folder.** The before is the HEAD copy's contract run, plus s19-checks' table of rows 100-109 on the old code.
- **Count cards (qty > 1)** tick when their last unit is made. The counting rule (SEK-25, CK-64) waits on Zafar.

## What changed
1. **Roll-out:** `UI.TYPE_ALL` is on, with no chai gate in `M.open` or `preLook`. `js/shared/fit.js` `fit2` now shrinks before it wraps (SH-240).
2. **One card path:**
   - Every dish row is a 6 Nov item card: ordered steps, samosa's kind with its fillings, skewer pieces, and Nani's chop card (`UI.itemPart`).
   - The skewer strip, group box, count box and sequence line are deleted from `order-card.js` and `.css`.
   - The tadka's order is said one card at a time.
   - While Nani's chop card shows, the order's cards are held unseen.
3. **No ✓:** `#done-btn` is gone. `UI.done` moves on by itself, called by every game when its work is complete. The "?" texts no longer mention the tick or the gold ring.
4. **Ticks:**
   - `M.tickCard` ticks a row at its last unit.
   - Every card ticks before the well done: at daar's and samosa's serve, and at the lab's ending.
   - Nani's helper card is in every station, eggs too.
5. **Pictures:** each card shows one of the thing, from `words[id].card` and eggs' `items.*.card`. The stir row shows its ladle, and samosa's kind shows a samosa. Chai's jars are unchanged.
6. **Text:**
   - Daar's stir line is a grey-italic placeholder (`Lang.toRecord`).
   - The tadka's step names one spice at a time.
   - "ne poi" is no longer in the word review.
   - Card English drops bracketed glosses.

## Proof
- **Contract** (`s19-cards-contract2`, the four sizes): 40/40 pages reached their end, with 36 breaks.
  - Mine: 1 (contract-101, samosa at 740x320). Rows 100, 103, 104 and 108 are clean.
  - The rest are other builders' rows: lights (32), shelf (2), corn's background (ART-60).
- **Checks:** words, static and specs pass; loadcheck 32/32. Unit: 753 pass, 1 fail. The failure is test 646: the s19-cards and s19-lights specs both own `evidence.json`, which is the orchestrator's to settle.
- **After folder:** `build/screenshots/brief/s19-cards/` (run `br-s19-cards-after-20261108-214654-675`).
  - Machine PASS: SH-227, SH-240, SH-241, DAAR-44, SH-238, SH-242, SEK-24, CK-62, SH-235 (`noClip` at 740x320, the short goal), SAM-31.
  - Left to a reviewer: SH-149, SH-239, SEK-25, CK-64, DAAR-45.
  - CHAI-107: a tool failure (the frozen diff timed out in the probe).
  - SH-239's probe was too late (the results screen); it now films every placement, not yet re-played.
