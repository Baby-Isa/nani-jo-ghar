# S05-C: Cook stations (Sprint 5)

**Changed (js/cook, css/cook.css).** Chaat asks for the dish first, then pantry, chop, layer order, bowl (CHT-07, decision 87). The lab brings everyone in before the pop-up (CHAI-15). The chai tally sits on the pan as a Kutchi word (L1–2) or dots (L3+) (SH-39, D6). Sugar and elchi show in the pan (SH-32). Spice drops use one shared puff, with no white-dot spray (CK-27, CK-06, DAAR-05). The chop ring uses the kit's colours (CHT-05). The grill phase has no chips (SEK-08). Served dishes sit in their tray, with its front wall redrawn over them (CK-21). Days show as suns (CK-24). The chai hob is bigger and lower (CHAI-08). Tray badges sit on the rim (CHAI-18). The review face sits over the glass (CK-07). Pass-me crosses in, with its ring and a frown face (MAA-14), and its "Thank you!" finishes before play resumes. The call-back now has its own `cook:closing` beat (SH-66). assemble.js `BOWL` is a const for the vessel check.

**Proof.** Red run ev-20261012-2151. Green runs: 2211 (groups 1–2), 2219 (3–4), 2225 (5–6), 2248, 2251, 2253. `checks.mjs`: all ok (268 unit tests). Touched run `s05c-touched` (7 flows at 1366, 9 min 53 s): 0 new findings, 1 contract-3 break, fixed, then `s05c-day4` passed 0/0. shotdiff: no approved manifest, left for `/review`.

**Requests to T.** (1) silentAfter's window bound never applies: SH-66 Cook and clinic still count lines after a new stage-start (ev-2251). (2) Re-point these probes: SAM-02, SAM-08, SAM-10, CK-09 (they play the legacy `cook:fill`, `cook:fry` and `cook:roll` labs). SEK-07, MAA-08 and CHAI-18 A/B capture under the end card. SEK-13 and DAAR-04: raise max to 16. SH-15 should count words and dots. CHAI-15's selector is stale. CHT-07 `order:` has no markers. (3) `check_vessel_meta.py` checks daar against superseded art keys. (4) `test_cook.py --orders` waits on a hidden h1, then breaks on `Cook.data.lines[seq]`. (5) MOD-01 needs arguments.

**Flaws seen, not mine.** At L3 the pop-up writes every row (E12). The legacy Roll and Fill tiles still use the drawn art. The pantry reads its lines twice. DAAR-07 needs Zafar: counter piles or a bowl.

| row | red | green | verdict |
|---|---|---|---|
| SH-37, CHAI-08, DAAR-04 | 2151 | 2211 | built, sheet to judge |
| SH-39 | 2151 | 2211 | noOverlap PASS; sheet to judge |
| SH-32, CK-06, DAAR-05, CK-27, CHAI-07, CHAI-17, CHAI-18, SAM-05 | 2151 | 2219 | built, sheet to judge |
| DAAR-13, CHT-05, PAN-05, CHT-07, SEK-08, MAA-14, CK-07, CK-21 | 2151 | 2225 | built, sheet to judge |
| CK-24 | 2151 | 2253 | built, sheet to judge |
| SH-15, SEK-07, MAA-08, SEK-13, SAM-02, SAM-08, SAM-10, CK-09, CHAI-15, DAAR-11 | 2151 | 2211–2248 | open: probe (T) |
| SH-66 | 2151 | 2251 | open: T's window |
| SH-33, CHAI-06, MAA-10, CK-02, CK-12, CK-20, SEK-05, MOD-01 | 2151 | — | open: check (T) |
| DAAR-07 | 2151 | 2225 | open: Zafar |

**QA checklist.** Fast checks only (C8). Every changed state was looked at on the sheets. The full matrix, sizes and sound are left for `/review`.
