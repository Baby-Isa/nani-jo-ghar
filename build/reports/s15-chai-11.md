# s15-chai-11: chai, Zafar's 1 Nov play (builder report)

Branch `s15-chai-11` (from claude/nice-lovelace-0vfjcj b438801). Not pushed.

## Proof
- **Before:** I played it myself before changing any code, from a clean checkout of the base, because no before existed. It is in `build/screenshots/brief/s15-chai-11/<ROW>/before/`. The new test hooks show as tool failures there, as expected.
- **After:** `build/screenshots/brief/s15-chai-11/<ROW>/after/` (run br-s15-chai-11-after-20261101-160545-swa). 18 rows: 12 for the judge, 6 with a tool failure:
  - the hooks were not yet set at the probe's moment (js:Cook.chaiFaces at view-marble, chaiPans at cook-done);
  - two hob strips showed no change in 4 frames;
  - one 10 s screenshot timed out.
  - Two L4 "seen" pages timed out under the heavy every:placed captures, but their probes still fired.
- **Contract run:** `cook:chai-tray` at 740x320, 930x430, 1280x665 and 1920x1080: **CONTRACT PASSED: 0 breaks over 4 pages**. I also ran L2-L4 at the same sizes:
  - contract-83 (the L4 card over Nana's face at 1920x1080) was found and fixed.
  - contract-78 leaves the breaks below, and they are expected (see SH-181).
- **Checks:** `node build/tools/review/checks.mjs`: all green (unit 623/0, words, static, leak, bump, specs, docs, fixlist, recordings, size, load).
- **Machine checks of my own (no frames):** the L4 lines, the face sizes, the pop-out card at four sizes, the boil (early, red, again, green), and L4 played to its end.
- **After the after run:** CK-06's sinking now starts at the boil, so its after shots show the older, earlier fade.

## Rows
- **SH-153 done.**
  - Cook's bubbles have no speaker. The shared `Conversations.bubble` adds one only with `waits: true`, so the clinic's lines lose theirs too.
  - A tap on a bubble during the pop-up replays nothing.
  - Not changed: the day's door and book bubbles (js/day is not mine).
- **SH-139 done.**
  - The tray faces are the burner faces' size (64), at least 30 px on screen, never reaching the glass.
  - 1280x665: 26.9 → 37.4 px. 740x320: 12.4 → 24.1 px.
  - A face may hang up to half past the tray's edge. CK-30 asked for less.
- **SH-180 done.** The said card and the next one ease their heights while the panel glides with them.
- **SH-178 done.** The light goes to the card's next item, scrolled in first when it is cut at the row's edge.
- **SH-182 done.**
  - The plan, the hint and the light follow the card's order (water, tea, extra, milk, sugar). An L4 play showed this order.
  - The hint probe only reaches the first hint.
- **CHAI-33 done.** The lit box clears the pill evenly (8-16 px). The after shot shows paani's box clear.
- **CK-57 checked, no code.**
  - The before and after traces show the stage still at L3 1280x665 through the speaker change.
  - So it was the browser's debugging bar.
- **SH-38 done.**
  - Sugar ticks at the number at every level, and a spoonful past it wiggles.
  - The asked-for extra takes one spoonful.
- **CHAI-54 done.**
  - Half ticks at the first pour, full at the second.
  - A pour past what was asked wiggles.
  - There is no 2.6 s wait.
- **CHAI-55 done.**
  - The data has a `teach` rule (data/cook.json chai cups.amount): seat 1 asks half, seat 2 full, while adh or aako is at stage 1-2.
  - The stuck hint for the second pour is the pour's control hint, at L4's 13 s.
- **LNG-23 partly.**
  - Half cups now say "Muke adh chai khape." through the engine's need frame, and the half row stays on the card unsaid.
  - Full cups, and cups with an extra or kari/mori, keep the amount said last. The engine would say "aaki", which is unrecorded and unconfirmed. These are decision 7's questions for Mum.
- **SH-181, CHAI-56 done.**
  - A control lights only the first time it comes up, for a new player.
  - After that, the call alone. The light comes with the call again after the level's wait, never for the knob at the green.
  - Chai's coach is marked seen at the round's end.
  - **contract-78 still flags** a call with no light: a second pot's "Chulo bar!", and a returning player's "Slow kar!". That check needs Zafar's 1 Nov rule (first time only). It lives in build/sandbox/lib/contract-s14.mjs, which is not my file.
- **CHAI-57 done.**
  - Early tap: the knob shakes, Nani says hever na (Mum's clip) and the heat runs on.
  - Green: it turns down.
  - Red, or no tap: it boils over, the pan empties, its rows reopen and it starts again. No mark.
  - **For Zafar:** at L4, at a child's pace, the green plus the red is about 3 s. A child busy with another pan will boil over often. The sandbox player missed it repeatedly under load.
- **ART-32: waiting on art.** The old foam stands in.
- **CHAI-43 done.**
  - The card fills the room under the faces, up to the full card: 1280x665 about 184x252, 1920x1080 300 wide. Its speaker's ring stays inside.
  - It keeps a fifth of a head below the faces.
  - On phones even the short 100 px card zooms, as the last step. The speaker is then 43-46 px, under 48.
  - 915x275 was not measured (no sandbox size).
- **CK-06 done.**
  - One elchi pod and one ginger slice, cut by an ellipse from the existing pictures, lie on the pan.
  - They stay after the milk and sink at the boil.
- **ART-31 done.** No splash, the pan settles, the sounds stay.

Also changed: build/core/cook-l1-order.test.mjs (CK-51 lets the half row be said in its headline), and recipes.js (`slot=word` conditions, the seat index).
