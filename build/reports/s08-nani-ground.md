# s08-nani-ground: the family seated behind the counter (16 Oct 2026)

Zafar (16 Oct): "as if sitting on a stool behind". Everyone at the counter sits behind it, hands in laps, the counter's front over the lower forearms. One rule (`js/cook/stations.js` CHARS): every arm's lowest point at least 4 px under the counter's front, so the talk's lift never opens a gap. Nani's top 166 to 210 (her body meets the counter at canvas row 449.7); Ma, Nana, Ali 6 px lower. No art edits: the point's hand is a new cut drawn over the counter, its fingertip into the tray in front of her. Snap's charpai covers her lower forearms; the Eid panels got a ledge, the finger on it. Story scenes: she stands where there is no counter, and sits behind the kitchen's own island.

Flaws: the fingertip reads "into the tray", not "on the counter"; its shadow is faint. Her right elbow's round tip leaves a 2-column notch, 4 to 12 px. The panel ledge is a plain box, lighter than p3's painted counter. The hop can briefly lift an elbow; standing, she is small on phones.

## Proof

Gap = cabinet rows between a figure's lowest pixel and the counter, per screen column (`hide-and-diff` mask). "Span" = columns between the first and last that reach the counter; "outside" = beyond them.

| place | before | after |
|---|---|---|
| Nani, 5 moods, 800 / 844 / 1366 | span 1 px; her elbows outside it: 29+22, 31+22, 54+43 cols, up to 15+25, 16+21, 27+42 px | span 0 everywhere; only her right elbow's tip: 2/1/2 cols up to 8/4/12 px |
| Ma neutral / Nana neutral / Ali neutral | span 0; outer elbow tips up to 8 / 28 / 25 px (1366) | span 0; up to 0 / 23 / 21 px |
| their gestures (happy, impatient) | waving or crossed arms in the air | the same (not resting) |
| story, courtyard and sitting room (gate flaw 1) | leaning on a lone brown block, 14 / 15 / 29 px gap (800 / 844 / 1366); the glass floating by her shoulder | standing (`nani-stand-v3-front.webp`, cut from the s08 run's `nani-front-neutral-v3.png`), feet on the floor with a `--njg-contact` shadow; the glass in her hand |
| story, kitchen (ask-chai, help) | the same block; the pan on the island's wooden front, no shadow | behind the picture's own island (drawn again over her from its back edge, image y 0.608), body line 3 px under it; the pan on the island top with a contact shadow |
| Eid panels | no ledge; body cut on the floor band, hands and finger off the panel | ledge at 78.4%, body line 79.2%; fingertip on the ledge |
| Snap hand-in | body's cut line over the charpai | charpai in front, 1% overlap |
| Find Ali, Find/Snap titles, finale, cover | over his crate's rim (0); portraits and a button, nothing to rest on | unchanged |

Nani vs Ma (design px): crowns 213.6 vs 228.4 (14.8 above; was 52.8), heads 167.4 vs 197.2 (0.85).

Shots: `build/reports/s08-nani-ground/` `counter-*`, `zoom-nani-moods-*`, `zoom-family-*`, `zoom-point-*`, `story-*` (arrive, ask-chai, sip, help, eid1-4), `snap-handin-*`, `find-*`, `snap-title-*` (each before | after), `finale-*`, `flow-day6-talk-1366x768.jpg`.

Runs: sandbox `cook:title, cook:fetch, first, cook:day1, cook:day6` at 800x360 and 1366x768 `--check --no-sheets`: all reach their end, 0 page errors, contract 0 breaks, 0 new findings (`first` and `cook:title` again after the story change: the same). `checks.mjs`: all pass, load 29/29. Run folders deleted.
