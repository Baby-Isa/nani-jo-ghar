# S04 audit verdicts, batch 2a (30 rows)

Reviewer: independent judge; built none of it. Evidence is the sprint-check sheets in `build/screenshots/sprintcheck/s04-audit/` (one sandbox run, `build/screenshots/sandbox/s04-c1366`, 1366x768 only). Where a sheet tile was too small, one shot from that run was cropped and zoomed; that is noted in the row.

MAA-07 | FAIL: no evidence: the tawa is drawn about 190 px wide in a DPR-1 shot, so a 400 px source can't be told from a high-resolution one. Needs a x2 or DPR-2 capture of the tawa (2x crop of L4 kind-timing is inconclusive and also dimmed).
MAA-08 | FAIL: no evidence: no 1280x800 or 915x375 shots, and no count-badge, roll-tawa plate or resting-spatula-with-tick state on the sheet.
MAA-09 | PASS: zoomed in 2x, the L4 results shot shows both dough piles on the shelf with no cast drop shadow. They are only shaded.
MAA-10 | FAIL: 4x crop of the L4 results shot: the stacked bajr maani on the left thali spill over the curled rim, top-right and bottom-left. They don't stay on the flat inner area.
MAA-11 | FAIL: no evidence: this is about sound (sizzle only with food on a lit tawa) and no flame-off-by-knob state is on the sheet. A person must listen with an empty tawa and turn the knob off.
MAA-12 | PASS: 2x crop of the roll state: the rolling pin draws over both size rings and spans the board edge to edge. The "about 10% longer" change can't be measured from one shot, so a person should compare it with the old build.
MAA-13 | FAIL: no evidence: no second-play or idle-pause state with the ghost finger on the sheet. A person must check that it repeats after each pause until the move is made.
MAA-14 | FAIL: no evidence: the only shot is the cook:day2 day summary. No pass-me pop-up, no Nani crossing the screen, no ring or face, and no station other than this one.
DAAR-01 | PASS: chop at L1–L4 is still a slicing game: produce on the board, knife and timer ring. It is not tap crate / tap knife. (test_cook.py result not on the sheet.)
DAAR-02 | FAIL: 2x crop of the stir and the daar stir: the ladle is a round measuring-scoop dipper with a thin flat handle lying flat in the picture. It is not a kadchi, and its handle doesn't rise toward the viewer.
DAAR-03 | PASS: the stir shows a tortoise-to-hare speed dial, and the card shows the lap count as a Kutchi word ("ba", "char").
DAAR-04 | FAIL: no evidence: the sheet shows clinic:heal-eye flows (wrong mapping). No daar pan with chopped rows resetting or ticking.
DAAR-05 | FAIL: no evidence: only a stir-mid still per level. No stage-by-stage contents and no stir turning shown. The one zoomed pot has no white dots but shows curry leaves that weren't on that order.
DAAR-06 | FAIL: no evidence: no serve state. The daar result card (cropped) has an empty left half where a dish could sit, and no photoreal daar on a trivet.
DAAR-07 | FAIL: no evidence for the container: the pot is top-down (2x crop), but in the tap shot the chopped pieces lie as loose piles on the counter, and no chopped-ingredient container is shown.
DAAR-08 | FAIL: 2x crop of the cook:daar@L3 chop card ("Chop these."): rows read "dungri / tameto / mirchi" with no quantities. L1, L2 and L4 do show them. The cards also write English "ba tomatoes" / "trae tomatoes" in Kutchi styling.
DAAR-09 | FAIL: no evidence: no wrong-spice or #mistake daar state on the sheet, nor the three-tries "show the right way".
DAAR-10 | FAIL: no evidence: no daar-in (bowl tipping into the pot) state. One tap shot shows a filled bowl on a woven trivet beside the pot, but not the tip.
DAAR-11 | FAIL: no evidence: one stir-mid frame per level, with the ladle at the same spot each time. You can't see it turn as it goes round, and the handle lies flat rather than resting on the rim.
DAAR-12 | FAIL: 2x crop of the L2 dial: the asked speed (aste, tortoise) is marked gold/yellow, not green, and no red spill zone is visible. Speed is only in Nani's line ("Char! aste thi"); the card rows carry laps, not speed.
DAAR-13 | FAIL: 1.6x crop of chop L1: the knife is smaller with its tip intact, but items are not spread (the chilli lies on the garlic, the ginger touches the knife) and the ghost finger floats at the far right, not dragging the knife. "Slower at L1" and the row highlight aren't shown. Contract-6 passed.
DAAR-14 | FAIL: no evidence: no x2 of a silver saucepan. The daar pot that is shown has an intact round rim, but the row's pot isn't identified on the sheet.
DAAR-15 | FAIL: no evidence: labs.html isn't on the sheet (it shows cook:daar flows).
DAAR-16 | FAIL: no evidence: every order on the sheet includes dungri (no "dungri na" order), and the shots are order cards with no pot contents at any stage.
DAAR-17 | FAIL: no evidence: the wrong-slice frames (daar #mistake, L2#mistake) only show the screen dimming at the slip. Nothing shows the chop carrying on afterwards, and there is no chaat decoy slice (test_cook.py result not on the sheet).
CHT-01 | PASS: the L1 chop card reads "ba dungri / ba mirchi …", and the chaat card (assemble results) writes "ba bataata", so quantities are written, not only heard.
CHT-02 | FAIL: no evidence: the sheet shows only cook:chop (daar) flows. No chaat ingredient bowls.
CHT-03 | FAIL: no evidence: the sheet shows only cook:chop (daar) flows. No glass bowl, empty or full, at any zoom (check_vessel_meta.py result not on the sheet).
CHT-04 | FAIL: no evidence: the sheet shows only cook:chop (daar) flows. No chaat build or serve states.
CHT-05 | FAIL: no evidence: the chop ring is visible (green wedge on white, dark rim), but nothing on the sheet shows the shared token colours to compare it with. Needs a side-by-side with the shared ring or token swatch.

## Other flaws seen

- **English written as Kutchi on the order card:** "ba tomatoes" / "trae tomatoes" is in red Kutchi styling on the daar order and chop cards (cook:chop, cook:daar L3/L4, cook:stir L2/L4). The same text is in Nani's line, "Kali ba dungri. Ne ba mirchi. Ne ba tomatoes." It is the lexicon's English plural gloss for the missing "tameto" plural (gap Q14). It is not a grey-italic "to record" placeholder, so it breaks non-negotiables 4/5.
- **Stir looks like a different game:** the stir mini-game (cook:stir) uses a flat vector pot with plain orange daar and a cartoon hand. The daar station uses a photoreal pot with real daar. One product shouldn't switch art style mid-recipe.
- **Wrong sheet mapping:** DAAR-04's sheet shows clinic heal-eye flows, and CHT-02–05 reuse the daar chop sheet. Half the chaat rows have no chaat shots at all.
- **Chop items overlap and clip:** produce overlaps across many chop frames (tomato on garlic, chilli on garlic, ginger on onion), and items are clipped at the board's bottom edge (daar@L2 ginger, daar@L3#hint chilli/garlic).
- **"Chop these." placeholder:** its speaker avatar is an empty beige circle (missing portrait), and the placeholder text is red-brown italic, not the grey italic the rule asks for.
- **Odd guide line:** "Char! aste thi" puts an exclamation mark mid-sentence followed by lower case, which looks hand-assembled. Check it against the language engine.
- **Dimmed mid-play shots:** the maani kind-timing and stir-mid shots are dimmed under a dark overlay. If that dimming is the hint or ghost pause, fine; if not, it hides the state being judged.
- **Daar result card:** the left half is empty white (no dish or face circle), and the "mustard seeds" gloss nearly touches its card edge.
- **CHT-03's art does exist elsewhere:** the cook:assemble shot on the CHT-01 sheet shows a thin, plain side-on glass bowl that looks close to CHT-03's spec, but that row's own sheet doesn't carry it, so it can't pass yet.
