# s18-g-eggs: eggs at breakfast on its settings file and the kits (Sprint 18, wave 2)

Opus, high. About $20. Zafar's decision 5 for this run: no BEFORE run, no evidence --before or --after.

## What changed

- **Gap page first** (`docs/design-language/standard/gaps/eggs.md`, committed alone): 205 rules scored from the audit with a
  contract run of the old game (cook:eggs L1, L4 at 1280x665: end reached, 5 breaks: contract-24 4, the next thing glowing at
  once; contract-98 1, a dotted word with no lesson at L4), then rescored after the build.
- **The mechanic is kept** (non-negotiable 1).
- **Lights and lessons are the kit's** (kit d): `Cook.Coach.firsts`, one `Cook.Coach.control` per step (the first time lit with
  its call; after that the stuck hint after the level's wait), `Cook.Coach.wrong` on a wrong move (an unready egg, a full plate,
  the wrong egg or shaker, the tray early), `Cook.Coach.nextLight` on the pot or the pan this plate needs, `Cook.Coach.lessons`.
- **Settings and art**: everything from `Cook.data.settings.eggs` (items, scene; places and body measures added to
  `data/stations/eggs.json`). Block 1 is wired (the fried egg sets by its ring; the meal's kitchen at the
  table). The ring is `Cook.Kit.heatRing`.
- **The end never frowns** (decision 8): `const mood = ok ? "happy" : "neutral";`, the soft sound, no head shake. `Cook.roundDone`.
- **Fixed on the way**: a tap on an egg's middle with a raw egg in the hand puts it in ; an egg still flying when the tray leaves is dropped (a page error); a plate's lit box stops short of the next
  plate's face (contract-82).

**Copied code deleted** (old eggs.js): its first-time gate `seen`/`fresh`/`first()` (63-71, chai's old fresh14/first14); the
glow at once on the next thing and the first-time glows on the bowl, both vessels and every plate (330-333, 369, 413, 497); its
own ring drawing (455-459); the code-drawn plate, eggs, cup and shakers (117-155); the wall, window, sky, sill and table
(509-545); the frown and the head shake (590-599). The palette keeps 3 of 33 colours.

## Proof

- Commits: `8263c17b` gap page; `10c5f405` the build; `93649361` the plate box and the rescore; `068dad98` trim; `1238e926` this report.
- Contract, L1-L4 at 1280x665 (`s18-g-eggs-b4`): `CONTRACT PASSED: 0 breaks over 4 pages`, every end reached, 0 page errors.
- Contract, `cook:eggs` at 740x320, 930x430, 1280x665, 1920x1080 (`s18-g-eggs-contract`): `CONTRACT PASSED: 0 breaks over 4 pages`, every end reached, 0 page errors.
- Gap page: before 0:14, 1:44, 2:133, 3:14; after 0:14, 1:23, 2:149, 3:19. Audit with the run: before 16 pass, 24 fail; after 16
  pass, 22 fail (the rest: other games' probes, or no tool).
- Checks: `static` 0 new, `words` 0 literals, `load` 29/29, `docs` within limits; `node --test build/sandbox/contract-chai.test.mjs` pass.

## Asks (exact changes, others' files)

1. **coach.js (kit d):** a page box for a canvas thing, so no game keeps its own: `C.box = (o, pad = 0) => () => { if (!o || !o.active) return null; const b = o.getBounds(); const a = Cook.UI.worldToScreen(b.x - pad, b.y - pad); const z = Cook.UI.worldToScreen(b.right + pad, b.bottom + pad); return [a.x, a.y, z.x - a.x, z.y - a.y]; };` (chai's `pageRect` and eggs' are the same lines).
2. **data/cook.json recipes.eggs (orchestrator):** the order's levels move to `data/stations/eggs.json` `recipe` in wave 3; and
   for Zafar (gap page, Decision): "no" from L2 (now L4 only), L3's eggs each 1 after L2's 1-2 (a count goes down), cookMs
   growing by level (slower, not quicker), no redo at the table, no overcooking (dbd?).
3. **Not taken, for the next pass:** the card light, the helper card's step help, the rungs' word gate, `UI.peopleSay` (the
   request pop-up says the orders today), `NjgServe` (its faces frown on a wrong dish; the table keeps its people).
