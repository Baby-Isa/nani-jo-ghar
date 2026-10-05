# F1: step 3 gate findings

All on branch `ccr-fcd9dddd-wnywzc`; not published (no bump, no push to main).

## Fixed
- **"bataato" 13.5 px (assemble L2/L3 at 800x360):** it was the word pop (36 px text under a small canvas scale), not the chip. The pop and the chip text now never render under 14 px (`floorK` in `js/cook/mechanics/assemble.js`). "chana" had the same cause.
- **"green pepper" 12.8 px (day 6 pantry):** it did not reproduce in my run (that pantry draw is random), so the fix is by cause: a pantry label's text grows when the canvas is shown small enough to drop it under 14 px (`label()` in `js/cook/stations.js`). Not seen in a shot; flagged for the reviewer.
- **"Salamun alaykum" bubble over the play area:** a side bubble that would reach the middle of the play area now rides up beside the head (`placeBubble`, `js/cook/ui.js`).
- **Spacing grid (10 findings, not 9):** `#count-badge` and `#go-btn` gaps and padding snapped to the grid in `css/cook.css`.
- **Card scroll at L2 on phones (3):** `css/shared/order-card.css`. At 400 px high or less, rows are 20 px and drop their padding. At 370 px or less the headline line-height and the row gaps tighten too. The words stay at the 14 px floor.
- **Decision 35(b):** `lal marcha` is now `laal marcha` in the data files and the 4 clip files and ids (nothing re-recorded). No "lal marcha" is left in `data/` or `js/`. All 372 audio paths in the two clip maps resolve. The bowl picture `spice-lal-marcha-bowl-t` is art, not a clip, so it is unchanged. I did not run the sound run.

## Proof
`--touched` on cook assemble, day2, day6, open-kitchen, fetch and the clinic patient, waiting and pharmacy pages at 1366x768, 844x390 and 800x360, then a final re-run at 800x360. Final run: **0 new findings**. The earlier proof run also showed findings at sizes the gate baseline never ran. They are not caused by this work:
- bubble speaker button 34 px and choice button 36 px (`tap-small`, cook day2, day6, open-kitchen at 1366x768 and 844x390). The same buttons are already in the baseline at 800x360.
- clinic waiting L4 tick, 10 px off the screen at 844x390 (clinic file, read-only for me).

## Shots looked at
Assemble L3 `04-view-marble`, day2 `03-kind-click` and the tooth L2 mid card, all at 800x360.
- **Flaws:** the card's rows now sit very tight (2 px apart). The bubble is higher than the mouth.
- **Not looked at:** the 1366x768 shots and the 844x390 card.
