# Plans for the rest of the game (Claude, 29 Sept). For Zafar's review; nothing is queued from this doc until he approves.

Everything follows `docs/design-language/ui-design-system.md` (tokens, grid, shelf band, shared order card §12, kitchen kit §13, phase-fold rule, end pop-up, VISUAL-QA) and the chai v2 learnings: one viewpoint per scene, no hands, real art, calm spacing, one focal point.

**Already queued:** chai v2 (finishing), maani v2, daar v2 (chop, tadka, stir), chaat v2, the shared order card, then the clinic and Find it adopting it.

---

## A. The Cook stations still to plan

### A1. Samosa (fill, fold, then fry)
**Now:** a flat drawn triangle with a dashed fold line and a red dot; a plain white bowl of filling; a plate of finished samosas; the tally in big red digits. Mechanically fine, visually the weakest station.
**Proposal:**
- **Fill:** real top-down samosa pastry strips (art) on a wooden board; the filling comes from front-on prep bowls on the shelf band (watana, bataato, dungri…). Each tap adds a spoonful, and the word pops with the clip.
- **Fold:** the classic triangle fold as 2–3 taps, each tap animating one fold of the real pastry (no dashed line or dot; a soft glow shows where to tap next). Level 1 folds itself after one tap.
- **Fry:** the shared kitchen kit (§13): a karahi on the same hob and heat ring, samosas going golden in stages (raw → light → golden → too dark), lifted out with a slotted spoon (no hand) onto a paper-lined plate. *hane kadh* when they're golden.
- **Card:** the order model: *ba samosa* with parts (*trae watana*, *hakro bataato*) and a "don't" row (*dungri na*). The phase-fold rule applies between fill and fry.
- **Tally:** drop it; the plate shows the count made.
- **Serve and taste,** as in chaat (§14a).

### A2. Mishkaki (thread, then grill)
**Now:** a plank board with a skewer, three steel bowls in a column (one missing its label), a skewer preview floating on the right, and the "Go to the barbecue" red button in an older style.
**Proposal:**
- **Thread:** the skewer lies horizontally across a wooden board in the centre; the ingredients stand in front-on prep bowls on the shelf band (gos, dungri, tameto, boga when recorded). Each tap threads a piece left to right, sliding along the skewer. The card shows the order-model parts with the sequence line and the grey "next" row.
- **Two different mixed skewers:** thread one, it slides up into a rack, then the next (the card's tinted rows match).
- **The phase button:** a flat design-system button ("to the grill", with an icon), in the same style as Done.
- **Grill:** a charcoal grill top-down (art) with the same heat ring language. Tap a skewer to turn it; it goes raw → grilled → charred per side. Its own grill art, consistent with the kitchen kit's style.
- **No floating preview skewer:** the card is the recipe.
- **Serve and taste.**

### A3. The pantry (fetch) and "pass me"
**Now:** pantry v2 (shelves, fridge, tray with outlined spaces) is in, waiting on the final background render.
**Proposal:** a polish pass only, once the render lands:
- the shelf/fridge background at full resolution;
- the containers on consistent shelf lines;
- the tray spaces;
- the glow-and-bounce highlight;
- the word chips as on the shelf band;
- the pantry headline "bring me these for {dish}" (to record, Round 4 N1–N2).

"Pass me" uses the same shelf band and chips.

### A4. Cross-station, Cook-wide
- **One station-select screen** (All stations) in the design system: a grid of station cards with the dish picture, the best time and stars. It needs a look.
- **A "day" flow** (Cook's run of orders) with the shared end pop-up between stations.
- **The Cook title and opening screen:** parked by Zafar ("do later").

---

## B. The other modes in focus

### B1. The clinic (a focus mode)
- **Step 1: an audit.** A cheap Sonnet session plays the clinic through (waiting room → diagnosis → pharmacy → heal games → send-off) and screenshots every screen (laptop). Claude reviews them and writes a feedback draft like chaat's §14, for Zafar to approve, **before** any build.
- **Expected direction:**
  - the shared order card becomes the "patient card" (face + "where it hurts" + item rows);
  - Nani's guide box, the end pop-up, the kitchen-kit-style consistent props (bandage, plaster, thermometer…);
  - real art replacing the rough sprites (the dump 3 patients are already in);
  - body-part words;
  - no hands.

### B2. Find it (the shop and the rooms)
- Same process: an audit screenshot session → Claude's draft feedback → Zafar approves → build.
- **Expected direction:** the shared order card as the shopping list, the shelf band / relations layer, real room backgrounds (dump 3), no hands.

### B3. The first launch (character creation → pantry → chai → story)
- **After chai v2 and the pantry polish land,** re-run the first launch end to end, audit it, and draft feedback. The story panels still need art (4 Eid panels, now to be redone for the **birthday** Arc 1).
- **The story by the fire** (design already written: `docs/game-design/modes/story-by-the-fire.md`) is built after the Birthday arc's stations exist, because it needs their day-log events.

### B4. Conversations
The engine is built and the lab exists. **Next:** wire the 9 MVP exchanges into the first launch, Cook and the clinic (the placements doc exists), using the shared order card and bubble style so they match. Mum's Round 3 recorded most lines.

---

## C. The parked modes (Tidy up, Who did it?, Dress up, Monsoon rush, Snap)
They stay parked (Zafar). When each is picked up: an audit → a design refresh against this design system → a build that uses the shared components from day one (order card, Nani box, end pop-up, kitchen-kit-style props, shelf band where relevant).

---

## Suggested order (after the current queue)
1. Samosa v2 and mishkaki v2 (they share the kitchen kit, so run them one after the other, not together).
2. The clinic audit, then the clinic feedback for Zafar.
3. The pantry polish (when the render lands).
4. Find it audit, then feedback.
5. The first launch audit, then feedback; the Conversations wiring.
6. The Cook station-select screen.

**Art:** each build generates its missing art through the API if the total is under $2, otherwise it writes a paste-block pack for Claude in Chrome.
