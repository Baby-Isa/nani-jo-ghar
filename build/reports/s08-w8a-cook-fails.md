# s08 wave 8A: Cook, the pre-publish evidence FAILs

Opus builder, worktree branch `worktree-agent-a4d17ff2d400b8b9d` (reset onto `claude/new-session-b5r2am` at 1cf4a05c: it had been cut from `main`). Not pushed.

Seven art loads raced `Cook.wait`, so at test speed the faces, tip frames and glasses missed a 1 s cap: they are capped in real time now, with a static rule (`loadcap`). MAA-14 was never a different woman: the pop-up swapped her half-length badge for a close-up frown; it uses her face sheet throughout. Card redraws re-created every face (the blank circles); decoded faces are kept. Sekelo's shelf keeps clear of the measured go-on button. Then the triage below: small fixes, stale tests reading the data, respecced probes, and Zafar's later words. The chicken is in the sekelo pool; the engine writes it *murgi* (confirmed in the lexicon) and the device says it, so the English placeholder he asked for needs a lexicon change (not my file).

Two things for the orchestrator: an evidence `cmd` runs on port+1, so mine (8874) hit 8B's server and SEK-05's machine FAIL there is stale. The load check on cook:chop fails only when the guide's face is caught mid-talk: `nani-face-talk` is the same 280 px debt as the known `nani-face`.

## Proof

Red is the base run ev-20261020-203453-9h9 unless named. Green runs (sheets in this worktree's `build/screenshots/evidence/`; indexes in `build/reports/`): uz7 = ev-20261021-002422-uz7, 1lu = ev-20261021-010237-1lu, ekc = ev-20261021-024230-ekc. Every picture still needs the judge.

| Blocker | Red | Green |
|---|---|---|
| (a) loadcap rule | 7 findings (chai-tray, assemble, flow x3, grill x2) | 0; static.test.mjs 10 pass |
| (a) CHAI-25, CK-04, CK-13 | green boxes by the knob and badges | uz7: every face, no box |
| (a) CHAI-08 | pan flat, glasses empty | uz7 C: pan tips 505-911 ms, glass full |
| (b) MAA-14 | badge then close-up at 3002 ms | uz7 A: one close-up, frown at 2400 ms |
| (c) blank faces | DAAR-18 4-6, CHT-06 B7-8 | 1lu: faces in every frame |
| (d) mishkaki@L3#hint 800x360 | w8a-sek-red: timed out, veg-03 under #go-btn | w8a-sek-green: end reached (also 1366x768); contract-24 hint pause fixed |
| (e) SH-57 | English after the bulb | ZAFAR: the bulb's 8 s English (D11, SH-41); propose adding the bulb to CLAUDE.md rule 5 |

| Row | Class | Proof or reason |
|---|---|---|
| CHAI-06, CK-02, SH-33 | STALE TEST | vessel check exit 1 (v3 ladle, rack) → 0 (s08c kadchi, tray); uz7 PASS |
| SEK-05 | STALE TEST + FIXED | orders test exit 1 → 0 on 8873; maani L3 now always both doughs (oneOfEach) |
| CHAI-15 | SPEC | L3 is two cups; probe at L4: uz7 PASS |
| DAAR-08 | SPEC | L4 card folded; probe reads the chop card: uz7 PASS |
| DAAR-22 | SPEC | speed 1, 90 ms strip: 1lu shows the split and cut line |
| SH-19 | SPEC | judged by check_onboard: 1lu PASS |
| SAM-04 | FIXED | "chundo" → uz7 B "hakro chundo", "ba chunda" |
| SH-39 | FIXED | 844x390 badge cut → 1lu B whole |
| SH-51 | FIXED | empty card → 1lu A jar |
| SH-32 | FIXED | faint heaps (1lu) → ekc a third bigger, partly under the teaspoon |
| DAAR-12 | ZAFAR + part FIXED | L3 dial follows the spoken switch (level table; a leak question); "0" chip → 1lu icon only |
| DAAR-13 | part FIXED, rest BIG | finger on the handle (1lu A); throws still cross mid-air |
| LNG-03, SH-13 | ZAFAR + SPEC | L3 dots items, numbers written; L4 dots uncalled rows: uz7 PASS |
| SH-12, SH-14 | ZAFAR | L3 dots and the chip rule (20 Oct); stickers, never labels (decision 88) |
| PAN-10, CK-21 | ZAFAR | one face, no fold; no shadow (both 14 Oct) |
| DAAR-34 | ZAFAR | the bulb peek writes every word (SH-98) |
| CHT-04 | ZAFAR | CHT-14's bowl; the lab has no service view |
| CK-27 | ZAFAR | the shared effect is a ripple since CK-06 |
| PAN-07 | SPEC (words) | "side-on" means the items, which are |
| PAN-13 | ZAFAR | day 1: pantry, chai demo, chai's pantry, chai |
| CK-07 | BIG | faces shrunk off the glass (CHAI-08) against CK-07 |
| PAN-01 | BIG | stamp over the headline, 800x360 scroll: shared card, cook-side-v2.css |
| SH-56, SH-63 | BIG | the guide box is empty between calls (base and old ui.js alike): the stepper's, needs the line table |

| Proposed row words | |
|---|---|
| LNG-03 | no English or "boga" placeholders; dots only as the level table dots |
| SH-13 | L1 counted aloud, L2-L3 written, L4 heard |
| CK-21 / PAN-10 | drop "shadows to the right" / "the guide box folded at L2" |
| PAN-07 / CK-27 | "the pass-me pop-up's items side-on" / "one shared ripple" |
| SH-72 | from L4 (the level table opens L3) |

| Wave 8B's Cook items | Answer |
|---|---|
| SH-72 | ZAFAR (above); Cook probe now L4: ekc PASS |
| Texture names | trivet `dv3-trivet`, `dv3-trivet-plain`; served `s02-served-<recipe>`; chaat bowl `cv3-bowl`; thali `mv-thali`; review faces `<who>-badge[-mood]-v2round-256`. DAAR-06, CHT-11 probe "results", where the station is gone: use a story day's drv:dish-served |
| Moments (ekc) | SH-58 to samosa: PASS; CHAI-18 kind-timing, SEK-03 and SEK-13 sidebar card: reached; SAM-03 popup-fold, L1-L2. Open: CHT-08 reaches wrong-tap but the card never changes; CK-38's peek never comes at 800x360 (driver) |
| Load check | add nani-face-talk/-blink/-happy to oversize-known (tools) or cut a 168 px face set (art) |

| Replay and checks | Result |
|---|---|
| Matrix s08-w8a-cook-fails-matrix (10 flows x 8 sizes, --contract, --parallel 3) | 80/80 reach their end, 0 page errors; 1 break: contract-5 on day1 800x360 after "?", seen in earlier runs (shared end screen) |
| Shot diff | 553 changed vs an old manifest, nearly all s08b/s08c art; sheet flaws: the "?" pop-up over the help strip (cells 5, 23); none traced to this wave |
| checks.mjs | unit 462, words, static, leak, bump, specs, recordings, size ok; load flaky as above |
