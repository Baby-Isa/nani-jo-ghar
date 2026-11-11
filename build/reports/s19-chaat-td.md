# s19-chaat-td: chaat top-down (CHT-13)

Opus, high. Branch `s19-chaat-td`, never pushed. Flaws first.

## Flaws and open
- **"hakro" still missing from the end review**: `reviewWords` (js/cook/flow.js) lists only the order card's words; the chop's card (`M.addCard("chop-nani")`, js/cook/mechanics/chop.js) is gone by then. For s19-fixes-f: chop.js pushes that card's word segs to `ctx.taught`; `reviewWords` appends any not listed.
- Potato, chickpeas and sev have no layer picture: stamped from their F3 bowls (heaps when not first). Art run.
- 1920x1080 L1: the long chutney pill shows its speaker alone (CHT-17's rule, unchanged).
- **Orchestrator:** `data/cook.json` art.assets.stations.assemble: `files` → `["assets/cook/items/v4/chaat/*"]`, `prefetch` → `["assets/cook/items/v4/chaat/bowl-empty.webp"]`. Retire `check_chaat` in `build/check_vessel_meta.py` (side-on BOWL/POT gone). CHT-13 → built.
- No probe for CHT-13 (`evidence.mjs --after` refused), so no after folder.

## What changed
- `assemble.js`: the cream bowl from above; each topping one transparent picture on its canvas in order (C5-C11, the drizzles), growing in over 0.9 s from where it lands; the base covers the floor, later base and sev lie in heaps; F3 bowls on the stone tray, pills at chai's size; face on the rim from the first frame; well done face beside the bowl, Shabash in Nani's box; word pop right of the bowl. Every mechanic and help kept.
- `chaat.json`: band "tray", new settings. `band.test.mjs`: chaat on, passing.

## Proof
- Before: `build/screenshots/sandbox/s19-chaat-td-before/` (L1-L4, 740x320 and 1280x665, keyframes): 3 breaks (contract-105 x2 in chop's stage; contract-112 on chaat's chana light).
- After: `build/screenshots/sandbox/s19-chaat-td-mid/` (same, plus #mistake, #takeback): 0 page errors, every end reached, 8 lights 0 failing; 2 breaks, both contract-105 in chop's stage (s19-fixes-f).
- Contract, four sizes: `CONTRACT PASSED: 0 breaks over 4 pages`.
- checks.mjs: all ok but 3 art-block tests (no sources/ here).
- check-change (`build/screenshots/tiers/change-6031d8ebe9/logs/`, pairs in `before-after/`): did not pass. push: the 3 art tests above. scope: measured from main's merge-base (other branches' files); against my branch start only `band.test.mjs` (its chaat entry is mine). play, L1-L4 and paths at 740x320 and 930x430, every end reached, 0 page errors, 14 breaks: contract-105 x4 in chop's stage; contract-111 x9 one sample at L4 930x430 taken as the tray's taps went live (all pass 1.1 s later); contract-107 x1 (#mistake 930x430) the coach's box came 0.9 s before its glow and hop (coach.js timing). 66 new findings are the side panel's and end screen's (tap-small, text-small). It stopped in "rows" at my 30-minute cap (no rows).
