# Feedback 29 Oct 2026 (night): the live chai on the central rules

**Source:** `build/reports/voice/feedback-2026-10-29-part0.md` and `-part1.md` (his typed notes, verbatim; part 1 sent while the fixes were made, on my filmed sheets) and five photos of his laptop
(`sources/art/refs/2026-10-29-chai/`), chai L3 on `lab.html`. The video he mentions did not come through. **Replayed here:** chai
L1 as a new player at a child's speed with every glow switch logged (a scripted page), his URL's load filmed every 150 ms, the
art loader's code for the replay; then chai L1-L4, maani and samosa at the four sizes after the fixes.

## 1. What it changes

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Fixed | Points |
|---|---|---|---|
| Chai: a step's call | said as the step opens, with its light | said a beat after (the central `callAfterLightMs`, 350 ms), the light seen first | P1 |
| Chai: the order card's light | at the step change after the tea | after nothing is moving, then a beat (`pointAfterMoveMs`), then 1.2 s | P4 |
| Chai: the first hint | lit the helper card's arrow, then opened it | opens the card (the central `lightHelpArrow` false) | P3 |
| The lit box (s14 look) | a gold edge only | a soft warm fill inside, a thicker edge | P6 |
| Chai: the counter | two people at the left and middle trays | middle and right (the central `scene.counterSpots`); three: the big card under the faces first | P7 |
| Chai: the pour frames | loaded before the station starts | loaded behind it; the pour waits for them only if not in yet | P8 |

### 1b. Old art reused
None.

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:01 | "Chulo bar is spoken early, before the visual help, which needs syncing." | chai's cooker step | js/cook/ui.js:567 (`stepCall`): the call queued at the step's opening, its light (the glow, the first-time box) the same instant, so the voice could lead the light's fade-in; not reproduced at a child's speed here (his video did not come) | the hook is in (`Rules.callAfterLightMs()`), set to 0: at 350 ms a call was sometimes lost (contract-36 at L4), and the early call did not reproduce; **open:** his video, to find the moment |
| P2 | 0:02 | "When you press replay, things change like visual effects and the chai background becomes the low res coded version." | chai, replay | js/cook/art.js:777 (`load`, and `loadFile`): a replay builds a new game with its own texture store, but the loader's cached promise said "loaded", so the marble and the effects were never added to it and the worktop fell back to the code-drawn one | each loaded image kept and added to any scene that lacks it |
| P3 | 0:03 | "There's no need to highlight the down arrow on the help card, it's obvious when it opens (make that rule everywhere, as do most of these)." | Nani's helper card | js/cook/stations/chai-tray.js:1797 (`first14("arrow")`) | the card simply opens; a central rule for every game |
| P4 | 0:04 | "The highlight on the menu card needs to start it's timer after the last animation action (so when the tea has finished going in cos that's where your eyes goes)." | the order card's light | js/cook/stations/chai-tray.js:1906: lit at the step change, while the tea still flew in | waits for nothing in flight, then `pointAfterMoveMs` (500 ms), then 1.2 s |
| P5 | 0:05 | "When the big item card goes into the left menu card, the text goes funky as it transitions ... hakro Khun ... even single line items." | the order's morph | js/shared/word-card.js:595 (`morph`): a different scale across and down stretched the letters, and both cards' words showed half-faded at once (his photo 4: "hahakro") | one even scale, centre to centre; the big card gone before the small one shows (a brief overlap) |
| P6 | 0:06 | "The highlight on the burner isn't clear enough because the burner is black ... it might need lighten-ing inside the highlight box or something else please suggest." | the lit box on dark things | css/shared/onboard.css:131: the s14 box was a gold edge, nothing inside | a soft warm fill inside every lit box (`--njg-card14-light-fill`) and a thicker edge |
| P7 | 0:07 | "If there's two people, have them on the middle and right to make space for the cards on the left. If there's three, put the cards bottom left under the face as I've annotated." | the counter, the big card | js/cook/flow.js:1723 (two people at spots 0 and 1); js/cook/ui.js `placeFree14` (from the top left) | `Rules.counterSpot` (two: middle, right); from three people the card tries under the faces first |
| P8 | 0:08 | "The loading on a new level takes extra long ... why is that and can we fix it?" | chai's start | js/cook/stations/chai-tray.js:369: the station waited for all 24 pour frames (about 1.5 MB) before it began | the 20 frames not on the tray at rest load behind the station's start |
| P9 | 0:09 | "The kitchen background loading, the image loads and then jerks into a different version or different zoom level - the kitchen ceiling becomes more visible ..." | the kitchen at the start | js/cook/ui.js:1251: chai's look (its wider side panel) was switched on as the order opened, after the kitchen was first drawn, so the play area narrowed and the kitchen re-fitted (filmed: 0.9 s to 1.05 s) | the look set before the first draw (`preLook` in js/cook/flow.js) |
| P10 | 0:10 | "Part of the handle looks like it covers the loading circle, by the green area." | chai's heat ring | js/cook/stations/chai-tray.js:554: the ring at D.fx - 2, the handle redrawn at D.fx - 1.9 over it | the ring at D.fx - 1.85 |
| P11 | 0:11 | "The highlight box on the chai tray should go under the face circle so the face circle sits on top and doesn't get a line over the face." | the glass's light | js/cook/stations/chai-tray.js:1755 (`rungOf` pour): the box was the glass alone, its edge across the face badge | the box takes in the face badge (no edge crosses it) |
| P12 | 0:12 | "If it doesn't need to, the speaker shouldn't sit for far over to the right. Make it padded to the right of the item card the same amount the speaker is padded to the bottom of the item cards in the menu box. If needed though it can move over when the word requires." | the side-by-side card | css/shared/word-card.css:157: `30% 1fr auto` pushed the speaker to the far edge | words then the speaker at one gap (`--njg-card14-spk-gap`); a long word moves it on |
| P13 | 0:13 | "Fix all and explain why did didn't catch them and how to make sure you do next time." | the process | not code: the checks (section 5) | section 5 |
| P14 | 1:0:01 | "This overlaps doesn't look fixed" (his circle: the big card over the side panel at 740x320 with three people) | the big card, three people | js/cook/ui.js:1650 (`placeFree14`): with no face-free spot in the play area the card fell back over the side panel | P16's rule: under the faces, scaled to fit |
| P15 | 1:0:02 | "Why does the speech bubble go over the left panel even though there is space to right? It shouldn't overlap the panel almost ever" | every speech bubble | js/shared/conversations.js:696 (`placeBubble`): clamped to the window only, and placed before its words were in (measured narrow); js/shared/request-popup.js:380 the same clamp | a side panel marked `data-njg-keepout` is out of bounds; the bubble moves along beside it, its tail still at the head; placed after its words |
| P16 | 1:0:03 | "If there's three people and no space for the big card under the left face they use the smalller card version ... or just scale it down to fit. With three people their wont be a better place" | the big card, three people | js/cook/ui.js:1650 (`placeFree14`) | from three people (the central `popBelowFacesFrom`) always under the faces at the left, narrower first, then scaled (zoom) to the room |

## 3. Rows (`docs/process/regressions.md`, 29 Oct)
CHAI-40, CHAI-42 to CHAI-47, SH-161 to SH-166 (one per point, P13 in section 5; P14 and P16 in CHAI-43). Levels: chai L1-L4 at the four sizes.

## 4. Coverage

| Lines | Point |
|---|---|
| 0:01 | P1 |
| 0:02 | P2 |
| 0:03 | P3 |
| 0:04 | P4 |
| 0:05 | P5 |
| 0:06 | P6 |
| 0:07 | P7 |
| 0:08 | P8 |
| 0:09 | P9 |
| 0:10 | P10 |
| 0:11 | P11 |
| 0:12 | P12 |
| 0:13 | P13 |
| 1:0:01 | P14 |
| 1:0:02 | P15 |
| 1:0:03 | P16 |

Lines: 16; in a point 16; chatter 0; unmapped 0.

## 5. Why these were missed, and the check that catches each next time

| Point | Why it was missed | The check from now on |
|---|---|---|
| P1, P4 | No check compares when a line is said with when its light shows, or when a light starts with when things stop moving | a timeline check: a step's call never before its light; the order card's light only after the last move ends |
| P2 | The replay is never played: every run is one round | the sandbox plays a round, presses Play again, and checks no texture is missing and the worktop is the painted one |
| P3, P6, P11 | The judge looks for what a row names; nobody asked "is this light clear on a dark thing, does its edge cut a face" | the light check measures the lit box's contrast against what is under it, and that no box edge crosses a face circle |
| P5, P7, P9 | Motion and layout changes are only seen in a film, and the evidence tool's film probe fails (my check, lesson 1); the load was never filmed | a film of every order and every page load at the four sizes, judged frame by frame (the strip probe fixed first); no layout change after the first frame (a "jump" check) |
| P8 | Load time is never measured | the load check records the time from the page to the first play tap and the bytes before it, per game, and fails a growth |
| P10, P12 | Overlaps of game pieces (a handle over a gauge) and spacing inside a card are not measured | an overlap check (no picture over a gauge or a face) and the card spacing measure of the lab check run on the game's cards |
| all | Zafar plays on his laptop at full speed, from `lab.html`; the checks play from `cook.html` at speed 3 | the evidence runs play through `lab.html` too, at speed 1 for the timing rows |
