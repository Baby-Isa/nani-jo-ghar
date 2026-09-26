# Cook with Nani: the player's hands (branch `claude/cook-hands`)

`js/cook/hands.js` puts the child's own hands in the game: `player-boy` by default, or `player-girl`, set by "Your hands: boy / girl" on the title screen (`Cook.save.hands`). Nani's hands only appear when she takes something ("pass me") or demonstrates a move. The hands decorate the gestures; nothing in the input path changed.

## Pose map (`data/hand-poses.json`)
- tap → point
- pick → grab (open, then closed)
- pinch → pinch (open, then closed)
- pour → hook grip on the jug
- tool → b1 grip holding the painted knife, ladle, spatula or spoon
- roll → both hands on the pin
- fold → the two-hand fold
- count → 1–5 fingers
- Nani: palm up ("pass me"), and a see-through pointing finger (demos)

Taps get their hand through `S.tappable`. Tools replace `S.hand()`. Demos replace `S.ghost()`. The onboarding ghost is now a see-through player hand whose forearm fades out.

## Per station
- **Pantry:** a grab closes on the item.
- **Chai tray:** a point on the cups and knob; a pinch on the sugar and extras; a hook on the jug while it pours; fingers count the sugar spoons (bottom left).
- **Maani line:** a grab on the dough; the pin hands hold the pin's ends, off the dough; the tawa's own spatula does the flip.
- **Mishkaki:** a pinch to thread and a point on the grill; the arm lies along the bowls, not across the skewer.
- **Chop:** the knife in the grip.
- **Tadka:** a pinch on each spice.
- **Stir:** the ladle in the grip, aimed at the shoulder.
- **Chaat:** a pinch on each topping.
- **Samosa:** a pinch to fill; the fold hands follow the swipe; the slotted spoon in the grip.

A tap's hand is gone within about 0.6 s, so it never stays on a target.

## Textures loaded per station
Only the current station's poses are loaded, and the last station's are dropped (`build/reports/data/cook-hands-textures.json`).

| Station | Poses loaded |
|---|---|
| Pantry | 2 |
| Chai tray | 9 (5 are counting) |
| Maani line | 5 |
| Mishkaki | 3 |
| Chop | 1 |
| Tadka | 3 |
| Stir | 1 |
| Chaat | 2 |
| Samosa | 4 |

Nani's poses load only when she first needs them. The whole set is 436 KB per character.

## Tests
- `test_cook.py --orders`: the leak rates are unchanged (0%).
- Node leak bots: output identical to the base branch.
- Shared tests: 67/67.
- Playwright lab: TESTS
- Screenshots: `build/shoot_cook_hands.py`.
- Contact sheet: `build/contact-sheets/cook-hands-in-game.png`.

## Still looks wrong
- The hands are big next to the small bowls in the thread and chaat zones. They are scaled to the thing tapped, but never below 0.62.
- The rolling-pin hands cover the dough bowls on the left and the tawa's edge.
- The pantry is an eye-level view, but its grab is the top-down pose.
- The pin is still drawn in code.
- The knife blade is short against the fist.
- The jug hand is mostly off the top edge of the screen.
- Service ("give") isn't wired in.
- Nani's hand looks young (hands v3).
