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

## Contract checks (Zafar 13 Oct)
contract-8 now counts every lit thing (Phaser glows, the next row, the row being read, the active tinted group, `.lit`, `.glow`, `.njg-pulse`; one element once) and flags more than one at once or in more than one colour, held 300 ms. New contract-15 (SH-73): a word of 4+ letters whose letters sit on two lines in a card, request card or word tile. Unit tests in `contract-rows.test.mjs` (24 pass). Run on `cook:mishkaki-grill@L2` at 844x390 (the contract run skips the upright 390x844): contract-8 red (3 breaks, e.g. the active group tint and the row being read lit together at order-card-big); contract-15 0 breaks (S2's phone wrap is not at this size). Also red on `cook:chai` (the bulb's `.lit` row with a glowing picture, 4 s): S2/C to decide.

## C2/D2 probe items (13 Oct)
SH-19 PASS (ev-20261013-091913-ib4: counted once the ghost is visible; samosa and daar). SEK-03 now shows the open card during the peek (ev-20261013-091531-eor): sekelo L3/L4 pills break words across lines ("mis/hka/ki", SH-73: S2). DAAR-11 still amp 0: the walk filter only touches ceilings, so the `canvas:ladle` object is truly still (C or the wrong object). SH-17 p2 at speed 1: the guide strip does not change over 1.2 s (tool failure; S2/C to say whether the strip animates). SH-44 clinic probes (cut L1, pharmacy) and the no-tap steps page wait for decision 93 to be built: `.rs-steps-list` is still a hidden dialog in `js/shared/results.js`.

## Final run of every row (ev-20261013-095159-oh3, 52 rows; SH-44 not run: S2's steps page not pushed)
- **PASS:** SH-09, SH-13, SH-15, SH-16, SH-33, SH-36, SH-41, SH-48, SH-66, PAN-01, PAN-02, CHAI-06, CHAI-15, MAA-10, CHT-07, SEK-05, CK-02, CK-12, CK-20, CLN-11, CLN-12, CLN-48, CLN-111, CLN-117, MOD-01, LNG-02. (SH-09, PAN-01 and SEK-05 turned green: C fixed them.)
- **Game FAIL:** SH-70 (B/Mum), ART-18 (S: speaker not in the hook), SH-17 (S2/C: the pop-up read-along lasts 73 ms at speed 1 with silent test clips; the pantry strip shows no `.ra-on`), DAAR-11 (C2: `traceRot` reads 0, the ladle is static in the trace window; the probe measures rotation now), SH-19 (C2: samosa 0 visible in this run, PASS in the one before: the ghost flickers; daar PASS).
- **Tool failure:** SH-01 (no seed gives a fudino layer: B), SH-58 (the browser closed mid-page in this chunked run: re-run), CLN-45 (the pop-up card has no text at that moment: text-only row for a reviewer).
- **Sheets for a reviewer:** SH-51, SH-64, SEK-03, SEK-07, SEK-13, DAAR-04, SAM-02/07/08/09/10, CK-09, CHAI-18, MAA-08, CLN-54.
- contract-8 on `cook:mishkaki-grill@L3`, `@L4`, `cook:daar`: 0 breaks (bulb `.lit` excluded, the card's next row merged into the stage glow, frames before the first paint ignored).
