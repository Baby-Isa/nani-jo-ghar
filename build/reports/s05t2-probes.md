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

## Open
Orchestrator's extra items (SH-66 window, vessel meta, SEK-05, legacy-lab re-points, `--lint-specs`) were queued during this run; see the overnight log for what landed.
