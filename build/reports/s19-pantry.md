# s19-pantry: the pantry on the walnut shelf set; the kitchen pages stop loading the old props

Builder, 11 Nov. Branch `s19-pantry` (not pushed).

## What changed

- **The pantry's shelf** (`data/cook.json` art.sprites.shelf): every item with a picture in the stored walnut set is that picture
  (`items-s17-stove/f-*`): 35 of the 36 it shows, plus 16 it can draw as a look-alike. Single vegetables replace the pine crates.
  **The orange keeps its old crate** (no walnut picture: the art run's PS1). The cupboard's pale oak shelves stay until a
  background run.
- **Sizes by class** (`js/cook/mechanics/fetch.js`): each thing stands at its class's share of its slot (L 1, M .91, S .84),
  on the picture's opaque part, never more than 5% wider than its slot, and on its shelf (no floating foot). The tray uses the same
  rule, and nothing shrinks 15% or more when it lands there. The fridge columns sit 5 px further apart (`mechanics.fetch.slots`).
  Pills, lights, the "pass me" and the leak bot are unchanged.
- **What the kitchen pages stopped loading** (`art.assets`; checked against the drawn-art log of the S19 runs, where none of these was ever drawn on screen):
  - `cook/props/` from every station's props and prefetch: tea-tin, elchi (chai and its mechanics); atto (maani and its five);
    knife, pot, onion, tomato, chilli, garlic, daal-dry (daar, chop, tadka, stir); onion, chilli (chaat, samosa and theirs);
    onion, tomato (sekelo and theirs); all eleven from the pantry and pass-me. Props that load a painted sprite stay.
  - `shared/fx-s11` steam and sparkle from chai (no code draws them).
  - The pantry's 38 old shelf prefetches and chai's 8, replaced by their walnut files.
- **Load check fixes**: the item cards' v4 vegetables are allowed on every page, and daar's page includes chop, tadka and stir.

## Proof

- Before|after (L1-L4, 740x320 and 1280x665): `build/screenshots/sandbox/s19-pantry-before/sheets/`, `.../s19-pantry-after/sheets/`.
  The evidence tool has no before or after for this brief. It names no fix-list row (`--after`: "names no fix-list row").
- Contract, four sizes: `CONTRACT FAILED: 15 breaks (contract-36 6, contract-109 8, contract-107 1)`; every flow reached its
  end, 0 page errors; chai 0 breaks. 36 (Nani's step calls) and 109 (one base line: the pantry has three shelves and a fridge) were
  in the before run too (45 breaks at L1-L4, 27 after). 107 (a lit thing without its hop) came once, at 1920x1080 only. The
  before run did not play that size.
- Pantry leak bot: `leak_cook: ok` (every strategy 0-1.8%).
- Load check: `14/14 pages load only what's on their screen` (5 failed on the base).
- `checks.mjs`: all ok but unit (3 art-block tests need `sources/`, absent in this sparse checkout).
- Tier 2 (`check-change --brief`): **no result file**. It stopped at my one-hour limit while playing its before, on origin/main's
  tree, after 28.6 min of after-play. It compares against origin/main, so its push, scope and contract steps carry the integration
  branch's 909 files, not this change. Push fails only on the sparse unit tests; scope fails on `sources/art/s19-tray-pot/...`;
  its 215 contract breaks are mostly s19-checks-2's new checks (70, 77, 78, 80, 114). In its 45 pages, two did not reach their end:
  `lab:cook/chai-tray@L4` at 740x320 and 930x430, timed out at 372 s. That page **times out on the branch base's data too** (run
  here, 375 s), so this change did not cause it. Play run: `build/screenshots/sandbox/tiers-change-035911d983/`.

QA checklist (tier 2 lines): code checks ok but the sparse unit tests; robot play 0 page errors, every pantry and chai flow at its end;
pantry contract breaks 45 to 27 (L1-L4, two sizes); no row probes (no rows); the judge's look is the orchestrator's.

## Needed from other owners

- s19-fixes-g (`js/cook/ui.js`): the order card's fallback (`WC_ID`, `WC_PIC`) still draws the old `shelf-*` jars when a
  word has no card. In the pantry it could read `Art.refUrl(id + ".shelf")`.
- The old shelf set still draws in daar's and chai's fallbacks and in baking's shelf (`data/stations/baking.json`), so its globs stay.
- `js/cook/art.js` and `loadcheck.mjs`: a shelf stem that starts `assets/` would avoid the `../` stems.
