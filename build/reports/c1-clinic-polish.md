# C1 clinic polish (5 Oct)

No mechanic removed or replaced. Commits on `ccr-fcd9dddd-wnywzc`: abef311 (WIP), 688e886, 024db0b, then this report.

## Items
1. ✅ **CLN-69** Results sit over the room (the wide shot kept at rest, a still of the happy patient), all nine games.
2. ✅ **CLN-70** `done()` clears the game's buttons and counts; no ✓ in any zoom-out or results shot.
3. ✅ **CLN-71** Bubbles are clamped inside the play area and never cover another speaker (the doctor's sat on the round face). A new bubble replaces the speaker's last one (the eye's rows stacked).
4. ✅ **CLN-72** Help light: a soft round glow with a faint halo.
5. ✅ **CLN-73** Level-3 review (12 words) scrolled at 800×360. Short landscape phones now get compact tiles (word and 🔊 English on one line), with 4 columns from 10 words. Cook's review checked too.
6. ✅ **CLN-74** The scrape's wrist and hand follow the tool column's edge (shorter at phone size). The leg version (knee graze) is not done: see below.
7. ✅ **CLN-75** Drawn steam on the hot jug, ice on the cold one; lukewarm plain.
8. ✅ **CLN-76** English bubbles: grey italic with "to record".
9. ✅ **CLN-77** Close-up UI hidden before the pull-out; the pull-out starts part-way in with less blur; the hurt swirl goes after healing.
10. ✅ **CLN-78** Hearing check and chart use the clinic's own art where it has the thing (water jug, milk jug, lemon, ginger), else Cook's realistic renders, on wood-framed picture cards.
11. ✅ **CLN-79** A taught first round (nothing scored, D13) shows a whole gold tick and ✓, never '–'.
12. ✅ **CLN-80** haa/na pills are 96×56 at 844×390 and 800×360, test A and B.
13. ✅ `check_onboard.mjs` passes for all nine games (27 kinds of step). R6's failure was heal-B's unfinished taste work.
14. ✅ All nine played at level 1 at laptop size; each ends in results over the room with nothing left on screen.

Rows CLN-69 to CLN-80 are marked "built, not re-played". `test_clinic_r5-browser` 6/6 passes (CLN-49, 51, 60, SH-09, D5–D12), so no row was broken.

## Sandbox
`--touched` on the nine heal games (`c1-touched`, 108 pages): every page reached its end, 0 page errors, check passed. Its 5 scroll-container findings (L3 word review) are fixed and re-run clean (`c1-words`). One text-small is left, in G1's order card: a taste L2 row ("ne laal") shrinks to 8 px at 1024×768.

## QA checklist
Automated checks clean · every changed state shot at 1366×768, 844×390, 800×360 and looked at, flaws first · regressions rechecked. Not reviewed by someone other than the builder yet (the gate).

## Seen, not fixed
- The knee-graze version of the scrape: the foot can still sit under the tool column.
- Order card (G1's files): read-along underline runs under the "TO RECORD" flag; "Ne poi cloth, ba dabs" wraps at 800×360 (SH-48).
- Push-in: one cross-fade frame shows a blurred room over the close-up (brief).
- Taste's tools are small at laptop size (two columns).

## Screenshots (not committed)
`build/screenshots/sandbox/c1-wip`, `c1-844`, `c1-800`, `c1-touched`, `c1-words`; zoom frames and checks in the session scratchpad.
