# s08-w3b-stations (builder report; not judged)

Branch `worktree-agent-ad8726d440ddf65d6`, not pushed. Detail and paths: `build/reports/s08-w3b-stations/details.md`.

## Flaws first

1. Sekelo's empty racks read as thin wooden frames; the left column looks light beside the 1.4x grill when empty.
2. Sekelo L3-L4 still has one decoy (no piece art): contract-37 breaks, as the brief allowed.
3. `cook:assemble@L2#mistake`: contract-22, "Muke chaat khape." said twice 2.5 s apart (the pop-up, then the card's reveal). Not my code; not proven older.
4. Chaat: thin chutney layers; a faint see-through line between chickpeas and potato.
5. Outside my file list (needed): `ui.js` step call and the "ba lakri mixed" row, `station-lib.js` one option, contract-22 and its test, `test_cook_levels.mjs`, a new leak config.
6. No evidence probes (none exist for these rows); not judged.

## What changed

- **Chaat:** no shadow; the s08b side-on bowl, measured; each layer is its own strip. A wrong item bounces back out (pause, wobble, amber glow). One from later empties the bowl. A row ticks only when it is right first go.
- **Sekelo:** raw piece *gos*, card *hakri lakri mishkaki*; even bins. Research layout D: two racks (not the shiny horizontal trays), grill 1.4x, even gaps. *ba lakri mixed* written.
- **Maani:** Firai on both turns; the window is the old one + 0.75 s.
- **contract-8:** one highlight while a card is read.

## Proof

- Leak bot `leak.mjs chaat`: blind 0-1%; `--old` (red) 49-100% at L2-L4.
- Maani windows 2.17/1.95/1.68/1.54 s. MAA-17 test red on the old data.
- Firai sound log: both turns.
- contract-8 and contract-30 green on sekelo L3#hint (orchestrator's red: 3 and 1). chai-tray L3 was already green.
- `checks.mjs` all ok; load check ok.

Filmstrips: `build/screenshots/w3b/*.png` (listed in details).

## Left open

SEK-14, SEK-07 (plate gone: needs Zafar), sekelo decoy art, "take it off" (Mum).
