# s14-tools: the checks that catch what Zafar found on 29 Oct (30 Oct, Sonnet)

## What changed
- **B1, the film.** The strips filmed 1.2 s from the first big card (the brief's extras 1 s and 2 s), of the order card alone: the row glided before the first frame and the card flew after the last. A strip of 15+ frames is now a film: from `life:request`, the whole screen, the changing frames on the sheet, a table from the page's own per-frame recorder. Driver `order-whole`; `tap-zones` taps first, records after (a state takes a second, the order lasts six).
- **B2.** `njgTest.cook.faces()`, `njgTest.faces()`, `njgTest.clinic.faces()` (the only game code touched), `faces.mjs`.
- **B3-B8:** contract-78 to 86 on a second probe. **B6:** `loadtime.mjs`. **B9:** `labcheck.mjs` on lab.html and the clinic, with the speaker spacing. **B10:** paths `speed1`, `replay`, `auto-level`, profile `returning`. **B11:** `seed.mjs`.

## Open: the branch fails its own checks (real findings)
CHAI-42: the card's light starts 32-370 ms after the last move, or while a jar flies. SH-164: the knob's light is glow only (lift 0 of 255). CHAI-47: at L4 the tray's lit box clips the cousin's badge. SH-166: a bubble reaches 11-21 px into `#side` at L4. SH-165: the speaker sits 18-20 px from its words, the item card pads 12. CHAI-40: once, L4's third pan had no light with "Chulo bar!". cook.html's title backdrop still jumps, as on main. No level-up picture: no chai day order; the save moved 1 to 2 (text). Contract-79 and -84 now fail chai's flow: fix the game, never loosen them.

## Proof
After folder: `build/screenshots/brief/s14-tools/` (before: main's code, the new probes; the launch before is `before-launch-old-probes`). Contract `s14-tools-contract`: **CONTRACT FAILED: 20 breaks (contract-79 7, contract-84 1, contract-52 8, contract-51 4)**; 12 of 12 flows reached their end; 52 and 51 are the clinic's known breaks.

| Check | Rows | main 89729f48 | branch |
|---|---|---|---|
| film | SH-152, 154, CHAI-39, SH-157 | strips failed; `zone-play` never | 0 tool failures at 930x430, 1920x1080 |
| contract-78 | CHAI-40 | 6 | 0 |
| contract-79 | CHAI-42 | 13 | 10 (open) |
| contract-80 (lab.html) | CHAI-45 | 2 | 0 |
| contract-81 | CHAI-46 | 10 | 0 |
| contract-82 | CHAI-47 | 7 | 2 (open) |
| contract-83 | SH-154, CHAI-43 | 4 | 0 |
| contract-84 | SH-164 | 9 | 14 (open) |
| contract-85 | SH-161 | 4 | 0 |
| contract-86 | SH-166 | 6 | 2 (open) |
| load, chai L3 | CHAI-44 | 28.4 s, 9.5 MB, 378 requests | 26.5 s, 8.5 MB, 356 |

Pill pictures: `build/screenshots/evidence/s14t-seed4/SH-159.png` (hidden, back after a miss). Tests: `film.test.mjs`, `s14checks.test.mjs`. QA: tools only, no screen changed (TXT, LAY, LNG n/a).
