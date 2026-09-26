# Cook with Nani: the player's hands (`claude/cook-hands`)

`js/cook/hands.js` shows the child's own hands in the game: `player-boy` by default, or `player-girl`, chosen on the title screen ("Your hands") and stored in `Cook.save.hands`. Nani's hands appear only when she asks you to pass her something and when she demonstrates a move.

## Pose map (`data/hand-poses.json`)
- **Player:**
  - tap: point
  - pick: grab (open, then closed)
  - pinch: pinch (open, then closed)
  - pour: hook on the jug
  - tool: a grip holding the painted knife, ladle or spoon
  - roll: both hands on the pin
  - fold: the two-hand fold
  - count: 1–5 fingers
- **Nani:** her palm up ("pass me"), and a see-through pointing finger (demonstrations).
- **Onboarding:** the ghost finger is now a see-through player hand.

## Per station
- **Pantry:** a grab.
- **Chai tray:** a point; a pinch on the sugar; a hook on the jug while it pours; fingers count the spoons.
- **Maani line:** a grab on the dough; the hands hold the pin's ends, off the dough.
- **Mishkaki:** a pinch; the arm is kept off the skewer.
- **Chop:** the knife in a grip.
- **Tadka:** a pinch.
- **Stir:** the ladle in a grip.
- **Chaat:** a pinch.
- **Samosa:** a pinch; the fold hands follow the swipe; the spoon in a grip.

A tap's hand is gone in about 0.6 s.

## Textures loaded
Only the current station's poses are loaded, and the previous station's are dropped:

| Pantry | Chai | Maani | Mishkaki | Chop | Tadka | Stir | Chaat | Samosa |
|---|---|---|---|---|---|---|---|---|
| 2 | 9 | 5 | 3 | 1 | 3 | 1 | 2 | 4 |

The Chai tray's 9 include five counting hands. Nani's load when first needed (`build/reports/data/cook-hands-textures.json`).

## Tests
- Cook's leak bot (`--orders`) is still 0%.
- The other modes' leak bots give the same output as the base branch.
- Shared tests: 67 Node tests and both browser suites pass.
- `test_cook.py --lab` passes at phone, iPad and laptop sizes.
- The contact sheet is `build/contact-sheets/cook-hands-in-game.png`.

## Still looks wrong
- The hands are big next to the small bowls in the thread and chaat zones.
- The pin hands cover the dough bowls.
- The pantry's grab is a top-down pose on an eye-level shelf.
- The pin is still drawn in code.
- The knife is short.
- The jug hand is mostly off the top of the screen.
- Handing food to the customer isn't wired.
- Nani's hands look young.
