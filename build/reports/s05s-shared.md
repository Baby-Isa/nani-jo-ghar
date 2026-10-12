# S05-S: the shared layer

Branch `ccr-a7370759-t0lee7`. Red run `ev-20261012-2108` (all 21 rows); green runs `ev-20261012-2134`, `ev-20261012-2145`. Quick touched run `20261012-2207`.

## What changed (`js/shared`, `css/shared` only)
- **host.js:** every host stage logs `stage-start` (the clinic logged none), so the next stage owns its opening lines.
- **buttons.js / buttons.css:** a glowing ✓ gets the shared focal class `.njg-pulse`. The pulse is a glow with no bounce, because a moving button can't be pressed by the driver.
- **bulb.js:** test speed no longer shortens the bulb's time. The clinic's own `fast` mode still does.
- **order-card.js / .css:** a folded body is hidden once it has folded. The clip boxes keep 2 px of room above and below. Short phones give back 2 px. New `group: true` items draw a plain tinted box with no label, and an ordered group draws as a little skewer (SEK-03, for C to use).

## Proof
- `checks.mjs`: unit 265/0, words 0 literals, bump OK, loadcheck 21/21. `check_onboard` OK.
- Touched run (cook:fetch, cook:chai-tray, clinic:heal-cut; 24 pages at 1366×768): contract 0 breaks, 0 new findings, 6 fixed. The full `--touched` list covers every flow, which is over the 15-minute limit, so it is left to `/review`.
- Flaws seen: chai L4 cards are open, not closed (C). One card shows an empty band, probably mid-fold. Shotdiff has no approved manifest (550 new shots).

| Row | Red | Green | Verdict |
|---|---|---|---|
| SH-54 | FAIL | 2145 PASS | built |
| SH-67 | PASS | (no change) | built |
| CLN-69, SH-61 | sheet | — | built, sheet to judge |
| PAN-01 | FAIL | 2134 PASS at 1366 and 844; 2145 FAIL | open: Cook's #mission is 7 px short once stamped (C) |
| SH-58 | FAIL | 2134 PASS (chai); 2145 FAIL | open: Cook glows the ✓ after 2 s and the driver presses at once (C/T) |
| SH-41 | 780 ms | 974 ms | open: data/cook.json bulbMs is 1 s at L4 (C); clinic (D) |
| SH-66, SH-64, ART-18, SH-17, SH-19, SH-01, SH-03, SH-09, SH-48, SH-36, SH-44, SH-51, SH-16, SEK-03 | FAIL | — | open: probe or owner, details in each row |

## Requests
- **T:** end `silentAfter` at the next stage-start or request. SH-64's `popup-fold` fires before the pop-up opens, and its driver never taps. `lines:` counts element boxes, not text lines (SH-01/09/48). Strips need a 500 ms delay (SH-17). SH-36 needs a fold moment and `.oc-headline`. SH-44: `.rs-steps`. Add a day-2 greeting bubble probe at 800×360 (needs a driver). Run ids can collide across sessions (2134).
- **C:** say the call-back before the station's `stageEnd` (SH-66). Tighten `#mission`'s padding on short phones (SH-09, PAN-01). Set bulbMs to 8000 (SH-41). Glow the ✓ at once (SH-58). Use the shared ghost in samosa (SH-19). Pass `steps` (SH-44) and `group: true` (SEK-03).
- **Zafar:** SH-16, the eye on a closed card (D12) against the row.
- Not found in the docs: "item 10" and the "tooth end card".
