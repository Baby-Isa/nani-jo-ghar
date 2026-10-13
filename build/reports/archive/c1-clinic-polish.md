# C1 clinic polish (5 Oct)

No mechanic removed or replaced.

## Items
1. ✅ **CLN-69** Results sit over the room, all nine games.
2. ✅ **CLN-70** `done()` clears buttons and counts.
3. ✅ **CLN-71** Bubbles stay inside the play area and off the round face; one bubble per speaker.
4. ✅ **CLN-72** Help light: a soft round glow
5. ✅ **CLN-73** The L3 review (12 words) scrolled at 800×360; short phones now get compact tiles, 4 columns from 10 words. Cook's review checked.
6. ✅ **CLN-74** The scrape's hand ends left of the tool column.
7. ✅ **CLN-75** Drawn steam on the hot jug, ice on the cold one; lukewarm plain.
8. ✅ **CLN-76** English bubbles: grey italic with "to record".
9. ✅ **CLN-77** Close-up UI hidden before the pull-out; the pull-out starts part-way in with less blur; no hurt swirl after healing.
10. ✅ **CLN-78** Clinic art where it exists (water and milk jugs, lemon, ginger), else Cook's renders, on wood-framed picture cards.
11. ✅ **CLN-79** A taught first round (nothing scored, D13) shows a whole gold tick and ✓, never '–'.
12. ✅ **CLN-80** haa/na pills are 96×56 at 844×390 and 800×360, test A and B.
13. ✅ `check_onboard.mjs` passes for all nine games; R6's failure was heal-B's unfinished taste.
14. ✅ All nine played at level 1 at laptop size: each ends in results over the room, nothing left on screen.

Rows CLN-69 to CLN-80 are marked "built, not re-played". `test_clinic_r5-browser` 6/6 passes; no row broken.

## Sandbox
`--touched` on the nine heal games (`c1-touched`, 108 pages): all reached their end, 0 page errors, check passed; its 5 scroll-container findings are fixed (`c1-words`). One text-small is left, in G1's order card: a taste L2 row ("ne laal") shrinks to 8 px at 1024×768.

## QA checklist
Automated checks clean · every changed state shot at 1366×768, 844×390, 800×360 and looked at, flaws first · regressions rechecked. Not reviewed by someone other than the builder yet (the gate).

## Seen, not fixed
- The knee-graze version of the scrape: the foot can still sit under the tool column.
- Order card (G1's files): read-along underline runs under the "TO RECORD" flag; "Ne poi cloth, ba dabs" wraps at 800×360 (SH-48).
- Push-in: one brief blurred cross-fade frame.
- Taste's tools are small at laptop size (two columns).

## Screenshots (not committed)
`build/screenshots/sandbox/c1-wip`, `c1-844`, `c1-800`, `c1-touched`, `c1-words`.
