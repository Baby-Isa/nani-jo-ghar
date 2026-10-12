# s05t2-probes

Branch `ccr-a7370759-t0lee7`. No game code changed. Final run **ev-20261012-232804-aql** (15 rows).

## What changed (tools and specs only)
- `evidence.mjs`: run ids carry seconds and a random suffix.
- `evidence-probe.mjs`: `lines:` counts text lines of the element's own Kutchi text (not icon, tick, English, to-record boxes); trace expects decide on the traces that moved, and a walk across the screen is no bob (`traceDecision`, `traceStats`).
- `evidence.mjs`: `lexicon` knows engine-inflected forms (paradigms: chundo, chunda); new profile `numbers-known` (`flows/cook.mjs`).
- Drivers: SH-64 plays at a child's pace and taps half a second into the first line (Cook, clinic); `times:tapped-through>=1` proves the tap.
- Specs: SH-17 (starts when the underline shows; child's pace), SH-36 (folded-card moment, `.oc-headline`), SH-13, SH-16, SH-70 (robust moment), MOD-01 (day + relight arguments for the three backgrounds), SH-68 (day-2 greeting bubble at 800x360).
- Unit tests: 18 pass (one per expect change).

## Rows (final run)
| Row | Result | Owner |
|---|---|---|
| SH-48, SH-36, SH-13, SH-16, PAN-02 | PASS | — |
| SH-64 | PASS, weak: the test build's pop-up lines are silent and 0.4 s each, the clinic's said nothing | S/Mum |
| SH-01 | FAIL: "fudino ji chutney" is not in the chaat words | C/B (data) |
| SH-09 | FAIL: `#mission` scrolls at 800x360/844x390 | C |
| SH-44 | FAIL: Cook passes no steps | C |
| SH-70 | FAIL: pantry headline "Bring me these" | B/Mum |
| SH-19 | FAIL: samosa uses Cook's own finger, not `.ob-ghost` | C |
| ART-18 | FAIL: Nani's talk bob 2.4–3.8 px (limit 2) | S |
| SH-17, SH-51, SEK-03 | sheets for a reviewer | — |
| MOD-01 | PASS (earlier run ev-20261012-231013-cx8) | — |
| CK-12 | FAIL: `check_vessel_meta.py` (daar cuts) | C/T (queued) |

SEK-03: `cook:mishkaki-grill@L4` stops on a repeated rack tap (C or driver).

## Orchestrator's extra items
| Item | Run | Result |
|---|---|---|
| SH-66 (silentAfter bound includes a stage starting at the same instant) | ev-20261012-234117-ria | PASS |
| SH-33, CHAI-06, MAA-10, CK-02, CK-20, CK-12 (`check_vessel_meta.py` reads the loaded cuts; 3 meta entries) | ev-20261012-234353-9al | PASS |
| SEK-05 (`test_cook.py` waits attached) | ev-20261012-234636-yyj | game FAIL: pantry ladder 4 rows vs 3 (C/B) |
| SAM-02/08/10, CK-09, SEK-13, DAAR-04, CHAI-18, MAA-08 re-pointed or `max` 16 | ev-20261012-234811-hs4 | sheets for a reviewer |
| SH-15 (words, dots), CHT-07 (markers) | -234811-hs4, -235519-b5z | PASS |
| DAAR-11, CHAI-15, SEK-07 | ev-20261012-235701-b64 | still tool failures (ladle still at speed 1; pop-up cards not found; `sk3-plate` never on screen): next T |
| `--lint-specs` + Probe pitfalls + brief line | checks `specs` | 33 flagged at first: end-card 17, legacy 9, expect 5, flow 1, cmd 1; baseline now 26 |

Open: SEK-03 L4 stops on a repeated rack tap (C or driver).
