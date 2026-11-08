# s18-w3-checks: wave 3's three check fixes

Branch s18-w3-checks (never pushed). Each fix is its own commit, red then green.

## What changed

1. **contract-22** (`build/sandbox/lib/contract.mjs`): an item's grey English (the lexicon gloss of a Cook item, without its
   bracketed note, and its plural: `itemEnglish(root)`) is an item word and may repeat, as item words do. Corn L2#mistake's
   "tamarind chutney" (said by the device, role "hear") no longer counts. Other repeated English is still a break.
   Test: `contract-voice.test.mjs` (red before, green after).
2. **Hook spotNow** (`contract-hook.mjs`): a `.njg-onboard` layer without class `on` (fading out) adds no holes.
   Test: `contract-hook-spot.test.mjs` runs the real hook on a fixture page (skips with no browser).
3. **loadcheck** (`loadcheck.mjs`): `cookStation(k)` also takes `data/stations/<k>.json` `assets`; `baking`, `eggs`, `corn` are pages;
   new `--manifest <page id>` prints a page's allowed pictures (no browser). Test: `loadcheck.test.mjs`.

## Open: loadcheck is green on baking, red on eggs and corn (real findings, not loosened)

`checks.mjs` load step now fails until two data files I don't own are fixed (I ran this with the edit, then reverted: 3/3 ok):

- `data/stations/eggs.json` `assets`: add `assets/cook/items/v3/hob/hob-2.webp`, `.../hob/knob-off-v2.webp`, `.../hob/knob-on-v2.webp`,
  `assets/cook/items/chai-station/flame-high.webp`, `.../flame-low.webp` (the heat ring's hob).
- `data/stations/corn.json` `assets`: add `assets/cook/items/shelf-ph-amli-bare-f.webp`.

## Proof

- Unit: `node --test build/sandbox/*.test.mjs` 187 pass; `build/tools/review/loadcheck.test.mjs` 2 pass.
- Contract run s18-w3-checks-contract: `CONTRACT FAILED: 1 breaks (contract-11 1)` over 16 pages (corn, baking, eggs, chai-tray x 4 sizes), every end reached, 0 page errors. The one break is not from these fixes: corn L1 at 1920x1080, `bg-table.webp` low-res (1.65 screen px per source px, ART-05): the art needs a larger file or the check needs Zafar's say. contract-22 and contract-53: 0 breaks. Folder: build/screenshots/sandbox/s18-w3-checks-contract/.
- No BEFORE run, no evidence --after (the brief's override).
