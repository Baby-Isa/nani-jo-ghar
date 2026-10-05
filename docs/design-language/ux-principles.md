# UX principles for every mode (Zafar's playtest of the Sekelo grill, 25 Sept 2026)

Zafar: "I was concerned the games would be too easy, but they're very addictive and fun. They're way too overwhelming at the beginning, with lots of information." These rules apply to Cook and to every new mode. Build sessions follow them from their next phase; Cook gets them in Wave 6.

## 1. The request card
- Every round opens with a **card over the play area**: the customer or family member's face, their request, and the instructions.
- It is **read aloud**, and **each word (or recorded chunk) lights up as it's spoken** (read-along).
- When they've finished, the card **shrinks into the sidebar**.
- Wave 5A's intro card is the start of this. Add the read-along highlight, driven by the recording's chunks (the Technical Plan's chunked audio), so the timing is natural, not guessed.

## 2. The sidebar is on the left
People read left to right. Keep the big action buttons (Done, "Go to the barbecue") on the **right**, under the thumb.

## 3. One card per item, with a fixed shape
- One card per thing being made: one card per skewer, per cup, per bowl.
- A card always shows the **same number of slots** for that dish. A skewer card always has the **same number of slots**, even when all are meat, so a mixed skewer later is the same picture with different pieces (no step counters, F23).

## 4. Help: one light bulb; the face is the replay
- **Remove the per-line translate and 👁 buttons.** At the top of the sidebar, a **light bulb**: press it and everything flips to English for a few seconds, then back to Kutchi.
  - The time shrinks with difficulty: about 5 s at level 1, 3 s at level 2, 2 s at level 3, 1 s at level 4.
  - It costs a lightbulb on the hints badge (decision 1; E25).
- **Remove the per-line speaker.** The card's face is the one replay: it reads the card's words in order, highlighting each as it's spoken (F8, E25). Hearing it again costs nothing.

## 5. One job at a time
- Split stations that combine two jobs into **phases**, with a big button between them.
- Grill: first **thread the skewers**. Then press **"Go to the barbecue"** and grill them. This also fixes the lack of space on phones.
- The two-jobs-at-once juggle can come back as an optional hard level for older children, never at level 1.

## 6. Cut what isn't the lesson
- **Chips are removed from the Mishkaki grill for now.** Frying already has its own station, samosa + fry.
- Before adding anything to a station, ask whether it teaches a word or is fun on its own. If neither, cut it.

## 7. Start super, super simple
- Level 1 of everything is the smallest possible round:
  - one skewer;
  - one cup of chai;
  - three things from the pantry.
- Each level adds one thing.
- **The pantry is the easiest mode, so it's the first thing a new player does.** No-tutorial first launch goes straight into a three-item pantry round.

## 8. Onboarding by showing, not telling
- The first time, each station uses a **graphic overlay**:
  - dim everything except one thing;
  - show a ghost finger doing the action once;
  - let the child do it;
  - then reveal the next thing.
- UI appears only when it's first needed. The sidebar, badges and light bulb fade in over the first rounds, not all at once.
- After the first time, the overlay is gone; the light bulb is the help.
- **No English instructions for the child, ever** (Zafar, 29 Sept, restated after the clinic heal games broke it): no English sentences in bubbles and no device voice reading them. The child gets the ghost finger plus the Kutchi line with its read-along. The English goal for grown-ups lives only in the "?" pop. `build/check_onboard.mjs` enforces it in every mode that has first-time help.

## Claude's comments
- **Agreed with all of it.** Points 3 and 5 also serve the Kutchi: a fixed four-dot card makes *the count and order* the thing to listen for, and one job at a time leaves attention free for the words.
- **Keep the challenge, but move it.** You found the games addictive at their current difficulty, so don't delete the harder things: slide them up the level ladder. The juggle (thread while grilling) and the chips come back at levels 3 and 4 for Zayn and Maryam's ages.
- **Read-along highlighting needs the recording's timings.** Record the family's lines in the chunks the Technical Plan describes (frame, noun phrase…). Each chunk then lights up as it plays, which is simple and robust. Word-by-word highlighting inside one chunk would need timings per word. Whisper's word timestamps can give those from the recordings later.
- **The light bulb replaces a lot of UI.** Check that "hold" works for small hands: a tap that flips for N seconds is easier than press-and-hold for a five-year-old. The recommendation is **tap**, not hold.

## 9. The end-of-round screen (Zafar, 25 Sept, evening)
Two pages, big and visual, the same in every mode (one shared component).

**Page 1: three big badges, side by side.**
1. **Time.** A stopwatch with big numbers (seconds) for this round. Each mode and level keeps its own personal best. A new personal best gets a "bing", a sparkle and "New best!", with the time shown inside the stopwatch, so the child tries to beat it next time.
2. **Accuracy.** A clear picture of right out of total: a chunky tick that fills **gold** for right and grey for the rest (F13). Not a pie chart. All right turns the whole badge gold, with a satisfying sound.
3. **Hints.** The number of hints used, shown big: 0 hints turns it **gold**, 1 is a middling badge, 2 or more is a plain "not so good" one. The light bulb counts as a hint.
Then a big **Next** button.

**Page 2: the word review.** Just the key Kutchi words heard in the round, each with its English (and a tap to hear it). Nothing else.

These three badges are the whole score (H5): time, accuracy and hints. There are no stars, no ear star and no voice star.

## 10. When onboarding gets built
- The **onboarding kit** (dim, spotlight, ghost finger, "do it now", fade-in of UI) is a shared component, built now.
- Each mini-game's **onboarding script** (which thing to spotlight, what the ghost finger does) is written at the end of that mini-game's build, once its mechanics have stopped changing, so it isn't redone after every playtest. Cook's stations get theirs first, since they're the most settled.

## 11. Show progress, not verdicts (Zafar, 25 Sept, late)
- **Flat tallies only where kept** (chai's sugar): a small tally shows what *you* did, never the target, and never takes a tap (E12, F25). Other stations show no tally.
- **Tick off the instruction card, automatically, at every level** (Zafar, 25 Sept, late: final). **Count rows tick when that step closes** (the item is put down, finished or served), never the moment the number is reached, so a tick can't give the count away; the count is judged in the end review (Zafar agreed, 26 Sept). A line ticks when that part is done right (the right amount chopped, in the bowl, fried…). The challenge is doing the right things: wrong items, extra ones or the wrong order count against you in the end review.
- **No negative feedback during play.** No red crosses or "wrong" buzzes mid-round (at least from level 2). Mistakes are shown in the end-of-round review (§9 accuracy badge, then the word review). Level 1 keeps its gentle, one-time correction as part of onboarding.

## 12. Consistent controls inside each mini-game (Zafar, 25 Sept, late; clarified 26 Sept)
- **The rule is internal consistency, not tap-only.** Swiping, stirring, dragging and so on are all fine. What matters is that **within a mini-game** the same kind of action always uses the same gesture: if you tap ingredients to add them, you also tap the liquids (a tap on the jug pours the right amount), not press-and-hold.
- **A mini-game's controls never change between its levels.** Levels make the *Kutchi* harder, not the gestures. (E.g. the clinic's belt: whichever gesture it uses at level 1, it uses at every level.)
- Cook's press-and-hold pour didn't land in testing: in stations where ingredients are tapped in, liquids are tapped too.
- The detail and the success of each mode is in its mini-games: what you do, where the challenge is, where the fun is, where the instruction is, and what's new compared with the other mini-games. Design each one against those five questions, and borrow from what's successful in popular children's games right now.

## 13. The instruction card is the master; Nani is a voice
- The **instruction/recipe card** (the request card after it shrinks into the sidebar) is the one place to look for what to do.
- **Nani doesn't compete with it for space.** In play she's her **voice** alongside the on-screen **throbbing hints**, plus short interjections ("Arre re!", "Shabash!"). She appears on screen in story moments, the request card and the send-off.
- Keep every screen clean and simple: one card, the play area, one light bulb.

## 14. Conversations: you get it right before you move on (Zafar, 26 Sept)
In a conversation, a wrong reply pill **shakes** (with a short vibration where supported). The person looks **embarrassed**, cycling through 3–4 gentle reactions, and **asks again**. The conversation only continues when the child picks the right reply. This holds for the whole game for tap replies, and is TBC for speaking (the child may skip speaking, then taps under the same rule). It's the one deliberate exception to §11's "no negatives mid-round": it's social and gentle, never a red cross, and the first-try result is still logged for the end review and the difficulty ladder. Details: `docs/game-design/modes/conversations.md` §10a.

## 9a. The end-of-round screen, redrawn (Zafar, 28 Sept; overrides §9's visuals)
**The rule:** each badge's big picture must tell a child who can't read or count how well they did. Numbers go in small captions underneath, except the time, which can't avoid them. **One colour language:** gold = perfect (it glows, buzzes or shimmers with party lines); the other states step down from there.

**Page 1: three badges.**
1. **Time: a big stopwatch outline** (plain inside, drawn like the small stopwatch icon), with the time written inside it. Show seconds (e.g. "52s") up to 100 s; above that, minutes and seconds ("1m 52s"). Caption underneath: the crown plus the personal best, in the same format.
   - **New personal best:** bright gold, buzzing, with party lines.
   - **Good time** (within about 25% of the best): dim gold.
   - **Average or slower:** grey.
2. **Accuracy: a big chunky tick** (no circle, no numbers inside). It fills up like a gauge: **gold** for the share right, grey for the rest (decision 3). **All right:** the whole tick turns gold and vibrates or shimmers. Caption underneath: "7/10".
3. **Hints: a big light bulb** (no number inside).
   - **0 hints:** bright, gold and shining, glowing and buzzing with electricity.
   - **1 hint:** duller; you can see the filament, a faint glow, and a slight crack.
   - **2 hints:** very dim, with a few cracks.
   - **3 or more:** off.
   Caption underneath, in the same style as the stopwatch's crown: a small bulb icon "× N".

**Page 2: the word review.** Each word is a card with the Kutchi and the English underneath. Words you got **right** have a **gold** outline and are grouped on the **right**. Words you got **wrong** have a **red** outline and are grouped on the **left**, so the child can see at a glance what to work on.

## 15. The same screens and buttons in every game mode (Zafar, 29 Sept)
**The rule:** everything around the play looks and behaves the same in every mode (Cook's stations, the clinic, Find it, Put it there, and every mode after): the end-of-round screen (§9a: the three badges, then the word review), the actions after it (again, next, back to the choice of stations/patients/rooms), the "done" and "next" buttons during play, the "?" help, Nani's box, the order card and the light bulb. A child learns them once.

**How:**
- **One component each, from `js/shared/`, never a mode's own copy:** `results.js` (the end screen and the word review), `order-card.js` (cards), `guide.js` (Nani's box), `onboard.js` (first-time help and the skip in "?"). A mode passes data; it never restyles them.
- **One set of buttons** (a shared button kit, to add to `js/shared/`), each with one look, one size and one place:
  - **✓ Done**: the round gold tick, bottom right of the play area (commit what you've made: serve the dish, hand over the tray, finish the heal step);
  - **→ Next**: the arrow, moving on to the next screen or phase (the end screen's pages, "to the grill", "to the bench"): an icon and a short label, in one pill style;
  - **Again / Home**: the end screen's actions, in the same order everywhere;
  - **the answer pills** (haa / na, the speaking fallbacks): one pill style.
- **VISUAL-QA checks it:** a mode's shots are compared side by side with Cook's end screen and buttons, and any difference is a flaw.

Cook and the clinic use the shared pieces; Find it, Tidy up, Who did it?, Snap, Monsoon rush, Dress up and the first launch adopt them when each is rebuilt (decision 38). Open defects are rows in `docs/process/regressions.md`.

## 16. Stage it like a play: characters turn to the player when it's their turn (Zafar, 29 Sept)
When two characters talk (the doctor and a patient, Nani and a guest, a customer and the cook), they stand **three-quarter turned toward each other and partly to the front**, like actors on a stage, so the child watches a real exchange. When the child becomes part of the dialogue and has to act (pick the item, answer, speak), the characters **turn to face the player**. That turn is the "your turn" cue, so no written instruction is needed.
- It applies to the clinic and to every mode where the player joins a conversation: Cook's customers and the speaking pilot (`docs/game-design/speaking.md`: watch, then the handover), Conversations, and the trips' stalls.
- **Art:** every talking character needs two poses: **three-quarter** (drawn once and mirrored for left and right) and **facing front**. Plan them in each art round's people-and-placement plan (VISUAL-QA §2b).
- It's a swap between two drawn poses (with a quick crossfade), not an animation (the "no cheap animations" rule).
- **No script cards:** a character's card never lists everything they'll say. It shows the current need only, or nothing where the scene makes it clear.

## 17. You can take it back until you press Done (Zafar, 29 Sept)
Anything the child places, picks or adds (an item on the pharmacy tray, a plaster, a person's tick, a cup's ingredient where the game allows it) can be **tapped to take it back** until the step is committed with ✓ Done (or the step closes by itself). The **first** placement is what's scored: a mistake taken back still counts in the end review. That lets a child fix a misclick without letting them fish for the tick. It applies to every mode. Where a game truly can't allow it (something already cooked, poured or cut), the art or the action shows that it can't be undone.
