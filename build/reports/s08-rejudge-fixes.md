# s08-rejudge-fixes: the judge's must-fix 1-3 (16 Oct 2026)

Done, and nothing else touched. Shadows: `--njg-contact` 0.30, ellipse 0.35x its width tall, centre 0.06x right. Level 2 send-off on phones: its four cards are 48 px, gap 8, padding 8/12, left edge at room x 0.50 (level 3's rule); level 3 and laptops unchanged. Nani at the counter: `{x:330, top:205, scale:0.82}`, forearms and the CK-44 seam hold; the lineup draws her at 1.0.

Flaws, worst first: her head now reads small (counter 0.77 of Ma's by my row measure, lineup 0.84); the shadows show but stay soft at 800 wide; the level 2 faces are small at 48 px. The load check fails on two Cook pages for `nani-face-blink.webp` (oversize), the same at f5eed146 without my change.

## Proof

Shots: `build/reports/s08-rejudge-fixes/` (before | after JPEGs): `shadow-{exam,stand}-*`, `zoom-shadow-*`, `sendoff-{L2,L3}-*`, `cook-counter-{neutral,happy,talk,point,blink}-*`, `cook-finale-*`.

| fix | before | after |
|---|---|---|
| shadows 800 (his / hers, px) | 29-33 x 7-8 / 23 x 6 | 29-33 x 10-12 / 23-24 x 8 |
| shadows 1366 | 54-60 x 14-15 / 43 x 11 | 54-60 x 19-21 / 43 x 15 |
| L2 tray, left / right / centre, room share | 0.227 / 0.773 / 0.50 (800); 0.245 (844) | 0.50 / 0.907 / 0.703 (800); 0.511 / 0.889 / 0.70 (844); 1366 0.312-0.708 same |
| tray over feet (px) | 14.8 (800), 8.7 (844) | 0, 0 (her shoe edge 0.427, his 0.263; L3 0.50 / 0.504 as before) |
| Nani's crown, design y (Ma 222.4) | 120 (102.4 above) | 208.3 (14.1 above) |
| forearms' underside (occluder top 611) | 613 | 612.5 |
| her head width, design px (Ma 197.2) | 186 (0.94) | 152.5 (0.77) |
| lineup, 800: crown y (Nana 132.7, Ma 133.8, Ali 131) | 120.4 | 130.7 |
| lineup, 1366: head width (Nana 43.9, Ma 54, Ali 59) | 53.8 | 45.6 |

If her head reads small: counter 0.90 with top 166 (head about 0.85 of Ma's, crown 53 above hers) or 0.93 with top 148 (about parity, crown 70 above); lineup 1.08.

Runs: sandbox `clinic:sendoff, clinic:diagnosis@L3, cook:day1, cook:day6` at 800x360 and 1366x768, `--check --no-sheets`: 8/8 reached the end, contract 0 breaks, 0 new findings; `clinic:sendoff@L2` and `@L3` at 800x360 and 844x390 also ended, 0 breaks. unit (337), static, leak, size, docs pass. Load check: 27/29 (the oversize face above, not mine). Run folders deleted.
