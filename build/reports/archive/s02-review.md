# S02 review: the end-of-sprint check before the publish

Reviewer: the orchestrator (not the builder of A–G). Branch `ccr-a7370759-t0lee7`. 8 Oct 2026.

## Flaws first (open, going live as they are)
1. **Small-phone word list scrolls** (800x360, ten or more words, one side): three tiles across so no word or "to record" flag is cut; the list scrolls inside its panel (CLN-73 asked for no scroll; at four across it already scrolled and clipped). With no wrong words the left half stays empty (SH-03, decision 18 of the Cook play).
2. Pour pan's handle touches the top edge at 1366x768 (Cook, from E).
3. U1-v2 upper arm not wired (E).
4. Cook still loads every station's code at open (~1.3 MB JS); pictures load per station (decision 68).
5. Standing girl is small on phones (CLN-94); heal tool shelf touches the sore eye at 4:3.
6. Waiting room L1: "tap a girl" wins about half the time (leak bot 24%, existing).
7. Samosa L3 grid mounds are small (strips at about a third).
8. Art held on the redo list: B1 sekelo pepper, C10 daar bowl beads, E2 two-colour plasters.
9. Sound: 42 lines in the clinic flows have no family clip yet (grey "to record" or the robot stand-in, decision 67).

## What the review fixed
- End-screen word tiles: "thermometer" broke mid-word and the "to record" flag was cut at 800x360. Tiles fit their words (FitText, shrink then wrap); short phones keep three columns (`results.js`, `results.css`).
- The cut game's order card scrolled 9 px at 800x360: the guide strip gives back padding on the shortest phones (`order-card.css`).
- **Heal-ear first-time help stalled on a tablet** (gate `s02-gate2`): the help moved on at the finger's lift but the browser never sent the tool's click, so the cotton bud was never picked; a child would have been stuck. Heal tools now pick on a lift inside the tool (`js/clinic/heal/scene.js`); a plaster dragged off the shelf is not a tap; a keyboard click still picks.
- Five spacings off the 4 px grid (eye bubble, Cook day sun, pass-me tray) use the shared tokens.
- Checked, not a bug: the "Thank you" tile is the family's English words (rule G6, 26 Sept).

## Proof
- Full gate `s02-gate2` (224 flows, every size): 1,687 old findings fixed; 5 new spacing findings and 1 stall, both fixed above.
- Rechecks after the fixes: `s02-recheck3` (clinic patient L2/L3, cut L2, samosa L3 at 800x360 and 1366x768), `s02-gate2b` (ear #hint, eye L3, cook fetch), `s02-heal-tools3` (all nine heal games, fair/#hint/#mistake, patient #hint and L3, at 1024x768, 800x360, 1366x768: 87 pages): **CHECK PASSED**, every flow reaches its end, 0 page errors.
- `checks.mjs`: unit 229/229, words 0 literals, bump ok; `loadcheck.mjs` 21/21.
- Leak harness (before the review, `cf5f81d8`): clinic passes; taste sample passes at 8,000 rounds.
- Looked at: the word end screen (800x360, 1366x768), the cut game mid-way (800x360), the ear help stall shot.

## Regression rows
Rows for the touched screens (shared end screen, order card, heal games) rechecked on the shots: SH-01 (long word wraps between words) and SH-03 (centre line) hold; CLN-73 partly (see flaw 1). Open rows: 145 open or reopened, 138 built and not re-played (`statuscounts.mjs`); most of Sprint 2's fixes wait on Zafar's play to be closed.
