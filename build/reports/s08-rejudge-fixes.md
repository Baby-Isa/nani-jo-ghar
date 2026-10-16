# s08-rejudge-fixes: the judge's must-fix 1-3 (16 Oct 2026)

Done. Shadows: `--njg-contact` 0.30, ellipse 0.35x its width tall, centre 0.06x right. Level 2 send-off on phones: four cards at 48 px, gap 8, padding 8/12, left edge at room x 0.50 (level 3 and laptops unchanged). Nani at the counter: `{x:330, top:166, scale:0.90}` (the orchestrator's middle numbers; 0.82 read too small), forearms on the counter's back edge in all five moods, no seam; the lineup draws her at 1.08. The load check's failure was `nani-face-blink.webp`: the check's limit is a picture's width, not bytes (over 3x its drawn width; 280 px drawn at 56), and its known list may only shrink, so the file is now 168 px (same cut, webp quality 92, 16.3 to 9.0 KB); at 2x on a phone it is identical by eye.

Flaws: shadows stay soft at 800 wide; level 2's faces are small at 48 px; her head is still below Ma's (0.85) and her crown above (53 px).

## Proof

Shots: `build/reports/s08-rejudge-fixes/` (before | after): `shadow-*`, `zoom-shadow-*`, `sendoff-{L2,L3}-*`, `cook-counter-{neutral,happy,talk,point,blink}-*`, `zoom-cook-seam-5moods-1366x768.jpg`, `cook-finale-*`.

| fix | before | after |
|---|---|---|
| shadows 800 (his / hers, px) | 29-33 x 7-8 / 23 x 6 | 29-33 x 10-12 / 23-24 x 8 |
| shadows 1366 | 54-60 x 14-15 / 43 x 11 | 54-60 x 19-21 / 43 x 15 |
| L2 tray left / right / centre | 0.227 / 0.773 / 0.50 (800) | 0.50 / 0.907 / 0.703 (800); 0.511 / 0.889 / 0.70 (844) |
| tray over feet (px) | 14.8 (800), 8.7 (844) | 0, 0 (her shoe edge 0.427, his 0.263) |
| Nani's crown, design y (Ma 222.4) | 120 (102.4 above) | 169.6 (52.8 above) |
| forearms' underside (occluder top 611) | 613 | 613.3 |
| her head, design px (Ma 197.2) | 186 (0.94) | 167.4 (0.85) |
| lineup 800: crown (Nana 132.7, Ma 133.8, Ali 131) | 120.4 | 126.1 |
| lineup 1366: head (Nana 43.9, Ma 54, Ali 59) | 53.8 | 49.3 (0.91 of Ma's) |

Runs: load check 29/29 (run directly). Sandbox `cook:day1, cook:day6` at 800x360 and 1366x768, `--check --no-sheets`: 4/4 reached the end, 0 contract breaks, 0 new findings. `unit` (337), `static`, `leak`, `size`, `docs` pass. Earlier, at 0.82: `clinic:sendoff`, `clinic:diagnosis@L3`, `clinic:sendoff@L2/@L3` ended, 0 breaks. Run folders deleted.
