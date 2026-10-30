# Feedback 30 Oct 2026 (evening): the live chai on his phone

**Source:** his typed note in the chat after the 19:12 publish (20261030T190918Z), one line per sentence below, and two photos of
his phone (Galaxy Z Fold in its in-app browser, about 915x275 CSS px of game): Nani's old box at the start, Nana's greeting bubble
on his chest. **Replayed:** chai at 915x275, 915x372, 930x430 and 1280x665 (scripted pages), the load timed request by request.

## 1. What it changes

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Fixed | Points |
|---|---|---|---|
| Chai's pour | the person's card read row by row while their chai pours (Sprint 11, principle 9) | quiet | P1 |
| The cooker's first light | at once as the last thing lands | after the stage is still, then a second | P4 |
| The order card's light | the whole order card | the next item's own card (chai; every game once chai passes, his words) | P7 |
| A bubble with no room above the head | below the head, on the face and body | beside the head, the right first | P6 |

### 1b. Old art reused
None.

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:01 | "For some reason when the tea is pouring is says "milk and one sugar* which is shouldn't." | chai's pour | js/cook/stations/chai-tray.js:1432: the Sprint 11 read-along of the person's card at the pour (L1-L2) | READ_AT_POUR false |
| P2 | 0:02 | "The game loads the old style and then suddenly switches, see first image old Nani card." | every station's start | js/cook/ui.js:96 (`UI.applyS14`): the s14 look came with the order (flow.js preLook), after Nani's box was drawn | mountGuide applies the look (UI.S14_ALL) as her box mounts |
| P3 | 0:03 | "It also still takes ages to load into the game (from clicking in labs to the order starting)." | every station's start | js/cook/zone.js:555 (`M.need`): a station's files imported one after another, a round trip each; the greeting's data asked for after them | every file asked for at once (Mech.prefetch, modulepreload), Conversations.load at the lab's start |
| P4 | 0:04 | "I think add a second extra to the pause between the last item being added (including it's animation) and the chulo bar onboarding." | chai's cooker | js/cook/stations/chai-tray.js:2036: the control's light (and its call) at the step's opening | after the stage is still plus 1 s (knob only), the call held for it (UI.holdCalls) |
| P5 | 0:05 | "The text for mukhe chai kupe on the menu order card looks small compared to all other text - can you review text sizes and feedback and change?" | the order headline | not code: measured equal (css/shared/order-card.css:74, --oc-h = --njg-side-h, Nani's line too): 16/16 px at 915x372, 19/19 at 1280x665; the small one was fitted in the old layout before the switch (P2) | P2's fix |
| P6 | 0:06 | "The speech bubble blocks the face and body but it seems like it could easily go on the right so there's space for the card on the left." | Nana's bubbles, short screens | js/shared/conversations.js:711 (`placeBubble`): no room above, so below; js/shared/request-popup.js placeByFace: the side towards the play area's middle first (the left) | beside the head, the right first, wrapped narrower to the room; then the left; below last |
| P7 | 0:07 | "I think the onboarding of the menu card after the first two items should just highlight the item card (milk). Make that a rule for everywhere if chai passes." | chai's order card light | js/cook/stations/chai-tray.js:1963 (`cardLit`): the whole order card | the next item's own card, glided into view |
| P8 | 0:08 | "Nani help card looks big (tall) for what it needs to be since we need to preserve vertical space. Fix" | the helper's side card | css/shared/word-card.css:161: a 30% square picture, so the card stood about 95 px | a 4:3 picture of 24%, less padding, words a size down: her box 128 px tall at 915x275 (was 162) |

## 3. Rows (`docs/process/regressions.md`, 30 Oct)
CHAI-51, CHAI-52, SH-174 to SH-179. Levels: chai L1-L4 at the four sizes and 915x275.

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

Lines: 8; unmapped 0.
