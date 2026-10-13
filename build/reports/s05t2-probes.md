# s05t2-probes

Branch `ccr-a7370759-t0lee7`. No game code changed. Tools, drivers and specs only (also `build/sandbox/**`, `build/test_cook.py`, `check_vessel_meta.py`, the daar `meta.json`).

## What changed
- Run ids carry seconds and a suffix. `lines:` counts text lines. `lexicon` knows engine inflections. Profile `numbers-known`.
- Layout expects (`count`, `inside`, `centredOn`, `noClip`, `lines`, `minFont`) are decided at the moment, before the captures.
- Trace expects: a walk is no talk bob (ceilings ignore it). `silentAfter` bound includes a same-instant stage start. `countsUp` reads words and dots.
- Drivers: SH-64 at a child's pace; `open-steps` (SH-44); the clinic hint driver holds the pick while the bulb is open.
- Leak: heal L1 judged by a Wilson bound (LNG-02: taste 10.3% in noise, no leak).
- `evidence.mjs --lint-specs` (checks `specs`; baseline now 0), "Probe pitfalls" in `evidence-loop.md`, a standing brief line. 21 unit tests.

## Rows
| Row | Run | Result / owner |
|---|---|---|
| SH-13, SH-16, SH-36, SH-48, PAN-02, SH-15, SH-44, SH-58, CHAI-15, CHT-07 | final runs | PASS |
| SH-66, SH-33, CHAI-06, MAA-10, CK-02, CK-12, CK-20, CLN-11, CLN-12, CLN-48, MOD-01, LNG-02 | various | PASS |
| SH-64 | ev-…232804 | PASS, weak (silent test clips) |
| SH-01 | | game: no "fudino ji chutney" in the words (C/B) |
| SH-09, PAN-01 | ev-…004029 | game: `#mission` scrolls at 800x360/844x390 (C) |
| SH-19 | ev-…004611 | game: samosa shows no finger at +0.3 s (C); daar PASS |
| SH-70 | | game: "Bring me these" (B/Mum) |
| ART-18 | ev-…005916 | game: talk bob 2.4 px, limit 2 (S) |
| SEK-05 | | game: pantry ladder 4 rows vs 3 (C/B) |
| SH-41 | ev-…001230 | clinic English lasts 0.4 s under the driver though it holds the pick (D to check); Cook PASS |
| DAAR-11 | ev-…010052 | game: `canvas:ladle` still at stir-mid (C) |
| SEK-03, SEK-07, SH-17, SH-51, SAM-02/07/08/09/10, CK-09, CHAI-18, MAA-08/12, ART-02, CLN-45/62/86/102, SEK-13, DAAR-04 | | sheets for a reviewer |
| CLN-117 | | tool: 12 seeds never drew E4; needs a driver |
| SEK-03 L4 stop | | not reproduced in a plain run (37 s to the end); only at DPR 2 (driver/perf) |
contract-11: no background is judged while a heal push-in is running (`contract-hook.mjs`); heal-cut sandbox run: 0 breaks (t2-c11).
