# S06 round 2: Cook (s06-r2-cook)

Pictures are for the judge; no verdicts written. Run ids drop the `ev-20261014-` prefix.

| Row | Cause | Fix | Red | Green |
|---|---|---|---|---|
| SH-85 | Not a Cook bug: the "?" (#btn-help) leaves the cards alone; the bulb (#btn-bulb, pressed 0.4 s later) shows English for `data.calm.bulbMs` = 8 s at every level (SH-41, D11, Zafar: "give it like eight seconds") | stale `ui.js:1304` comment; `ux-principles.md:139` still says 5/3/2/1 s (orchestrator's doc) | contract `s06r2-cook-sh85-red`: 0 contract-16 | contract `s06r2-cook-final-contract`: 0 |
| DAAR-13 | `chop.js` k.slow: L1 0.8, L2 and L3 1; throws crossed the board's bottom edge | slow 0.67 / 0.76 / 0.86 (3.3 / 2.9 / 2.5 s in the air, ~15% a level; `test_cook_levels.mjs`); throws fade in and out clear of the edge; probe at speed 1 with an L2 panel | on record 011029-06w | 033839-s25 |
| DAAR-19 | the stir row (Zafar D12; the bare number is Mum's "Trae!" form) read as stray: a lone number | the station's ladle before it (recipe `pic`, `ui.js` rowPic, a 64 px copy for the load check) | 034414-bt3 | 052608-81u |
| CK-31 | probe | review faces at 2x (drv:review-face) | – | 040741-6zs |
| CHAI-13 | probe | pan strip from the first sugar tap (hook:cook.focus) | – | 042419-l3k |
| CK-21, CK-27 samosa | probe | each served tray at 2x (hook:cook.servedTray); samosa strip at the filling end | – | 043957-gnj |
| CK-32 | (8d19bac) | reverted in a scratch copy | 045350-19g | 050235-4w2 |
| SH-81 | (a23eea7) | reverted in a scratch copy: 4 tap-offscreen | 045754-y6f | 050235-4w2: 0 |
| DAAR-23 | (d5bcec0) changed no game file, so no game red can exist | – | – | 050235-4w2 |

Not done: CK-TAB-01, PAN-10, CK-27 (Zafar).

Seen outside this round's rows (`s06r2-cook-lint`): contract-19 at daar@L2 (the stir's spoken laps count along); contract-20 at daar 844x390 (two Nani faces: chop card and daar card).

## Proof

The runs in the table: the evidence runs (the scratch reds are copied into this worktree) and the two contract runs.
