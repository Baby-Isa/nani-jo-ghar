# s18-w3-kit: wave 3's kit fixes

Opus, high.

## What changed

| Commit | What |
|---|---|
| b4a13e60 | `Cook.Coach.box(thing, pad, {bounds, visible})`, the one page box. Chai's `pageRect`, samosa's `pageBox`, baking's and corn's `boxOf` and eggs' `pageRect` are gone. Eggs and samosa pass their own `bounds`. `hugOf` uses it too |
| 13d40b21 | SAM-29: `St.stoneBand` draws its 3 px top shade at chai's depth. Chai's own lines are gone |
| de09106e | Orchestrator's ask: `C.lessons` scrolls the lesson's own thing into the panel's view before it measures again (chaat at 740x320) |
| 888a5421 | `UI.wordMoment(ids, set)`: a game's own pair, key and pictures. Baking's jug moment plays: adh, then cup, at L3's first jug round. Its vessel needed a spout, or `WordMoment.play` threw. Chai's call is unchanged |
| b4d5fb01 | DAAR-42: daar's cook phase uses `Cook.Coach.control` first-time lights on the knob, the first pile's row and the bowl. A spice is never lit. The old `St.coach("daar-cook")` overlay is gone |

## Proof

- Contract at 1280x665: daar L1, @L2 and @L2#mistake, baking @L3 and @L4, eggs, samosa: 0 breaks. Chaat @L2 and @L4 at 740x320: 0 breaks, and the lesson log reads `shown nana:ok`.
- Chai's frozen diff (`build/reports/frozen-diff-chai-tray-202611080227.md`, 30 pages): 4 changes, all of them the glass sound (`sfx/glass`) at 740x320, which is CHAI-107's known variation. Clean.
- Four sizes, the six flows (`s18-w3-kit-contract`): 24/24 pages reached their end, 0 page errors. Its last line: `CONTRACT FAILED: 3 breaks (contract-11 1, contract-92 2)`, all of them corn's:
  - contract-92 is the ph-lili light after the serve. It shows on the commit before mine too (`s18-w3-kit-cornbase`), and is corn's spotNow ask to s18-w3-checks.
  - contract-11 is corn's low-resolution `bg-table.webp` at 1920x1080.
- SAM-29: the script cut `build/screenshots/brief/s18-w3-kit/SAM-29/after-band-top-x4.png` from the sandbox's samosa shot. The band's top 2 rows are about 13 levels darker, which is the shade.
- `evidence.mjs --after` was refused: the SAM-29 probe (`at: "now"`) has no samosa driver, a spec error in s18-w3-checks' area. There is no after folder. DAAR-42's probe is the #mistake contract above.
- Checks: words, docs and specs pass. `static` has 2 new findings: chai's known `0x2a1a0a` moved into the band (ask 1).

## Asks

1. Orchestrator: run `node build/lint/static.mjs --write-known`.
2. The live `St.stoneBand` is in kitchen-kit.js, not station-lib.js: kitchen-kit loads later and replaces station-lib's copy. I gave both the shade (kitchen-kit.js was outside my list). station-lib's copy is dead and can go.
3. `data/cook.json` `onboard["daar-cook"]` is now unused.
4. maani-line's band gains the same shade.

## Open

Baking's moment is placeholder art (the water bottle, the tea-tinted fill) until ART-38. The brief said "baking L4", but L4 asks neither half nor cup, so it has no moment.
