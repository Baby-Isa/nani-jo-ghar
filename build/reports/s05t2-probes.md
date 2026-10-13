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

## Late items (orchestrator, 13 Oct)
| Row | Result |
|---|---|
| SH-01 | tool fixed (the wanted order reads the order's own surfaces, not the whole page). The earlier "match" was the *na* row (`fudino ji chutney na.`). Asking for a layer (`/fudino ji chutney(?!\s+na)/i`): no seed 1..40 gives one at L4 chaat, so B's 22% is not what plays: B/C |
| CLN-111 | PASS (ev-20261013-012257-dgq): the morning end is a registered moment; Next is not expected on the one-patient lab |
| ART-18 | still FAIL 2.4 px: every Cook line is `line:cook`, so the probe cannot tell Nani speaking from breathing; needs the speaker in the sound hook (T next) |

## Last items (13 Oct, run ev-20261013-081647-4eq)
CLN-117 PASS (new `variant-e4` driver plays `&variant=E4`: "Ask them how they feel." is said first). SH-41 PASS (Cook 7753 ms, clinic 8181 ms; the bulb's English is not lexicon-checked). CLN-111 PASS (morning end, 3 buttons). CLN-54: sheet, at the clinic's real pace. ART-18 and SH-01 stay as above (speaker in the sound hook; B/C data). A single re-run of every row in the table was not done; each row's last run id is above.
