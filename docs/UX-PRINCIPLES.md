# UX principles for every mode (Zafar's playtest of the Mishkaki grill, 25 Sept 2026)

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
- A card always shows the **same number of slots** for that dish. A skewer card always has **four dots**, even when all four are meat, so a mixed skewer later is the same picture with different dots.

## 4. Help: one light bulb, one speaker per card
- **Remove the per-line translate and 👁 buttons.** At the top of the sidebar, a **light bulb**: press it and everything flips to English for a few seconds, then back to Kutchi.
  - The time shrinks with difficulty: about 5 s at level 1, 3 s at level 2, 2 s at level 3, 1 s at level 4.
  - It still costs the ear star (existing help-cost rule).
- **Remove the per-line speaker.** Each card has **one speaker in its top-right corner**. It reads the card's words in order, highlighting each as it's spoken. Hearing it again costs the no-help star, as now.

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
- UI appears only when it's first needed. The sidebar, stars and light bulb fade in over the first rounds, not all at once.
- After the first time, the overlay is gone; the light bulb is the help.

## Claude's comments
- **Agreed with all of it.** Points 3 and 5 also serve the Kutchi: a fixed four-dot card makes *the count and order* the thing to listen for, and one job at a time leaves attention free for the words.
- **Keep the challenge, but move it.** You found the games addictive at their current difficulty, so don't delete the harder things: slide them up the level ladder. The juggle (thread while grilling) and the chips come back at levels 3 and 4 for Zayn and Maryam's ages.
- **Read-along highlighting needs the recording's timings.** Record the family's lines in the chunks the Technical Plan describes (frame, noun phrase…). Each chunk then lights up as it plays, which is simple and robust. Word-by-word highlighting inside one chunk would need timings per word. Whisper's word timestamps can give those from the recordings later.
- **The light bulb replaces a lot of UI.** Check that "hold" works for small hands: a tap that flips for N seconds is easier than press-and-hold for a five-year-old. The recommendation is **tap**, not hold.

## 9. The end-of-round screen (Zafar, 25 Sept, evening)
Two pages, big and visual, the same in every mode (one shared component).

**Page 1: three big badges, side by side.**
1. **Time.** A stopwatch with big numbers (seconds) for this round. Each mode and level keeps its own personal best. A new personal best gets a "bing", a sparkle and "New best!", with the time shown inside the stopwatch, so the child tries to beat it next time.
2. **Accuracy.** A clear picture of right out of total: e.g. a row of slots that fill green for right and red for wrong, or a jar that fills. Not a pie chart. All right turns the badge **gold**, with a satisfying sound.
3. **Hints.** The number of hints used, shown big: 0 hints turns it **gold**, 1 is a middling badge, 2 or more is a plain "not so good" one. The light bulb counts as a hint.
Then a big **Next** button.

**Page 2: the word review.** Just the key Kutchi words heard in the round, each with its English (and a tap to hear it). Nothing else.

These three badges replace the old star labels in the result card. They stay mapped to the existing stars (craft, ear, no-help) underneath, so progress and word stages are unchanged.

## 10. When onboarding gets built
- The **onboarding kit** (dim, spotlight, ghost finger, "do it now", fade-in of UI) is a shared component, built now.
- Each mini-game's **onboarding script** (which thing to spotlight, what the ghost finger does) is written at the end of that mini-game's build, once its mechanics have stopped changing, so it isn't redone after every playtest. Cook's stations get theirs first, since they're the most settled.

## 11. Show progress, not verdicts (Zafar, 25 Sept, late)
- **A tally with pictures.** Stations where you make several things show a small tally in the top-right corner: a picture of each item with how many you've done so far (e.g. 🧅 3, 🍅 2 in the chop game). It shows what *you* did, never the target (the existing rule). Applies to every mode where you collect, chop, count, fetch or place several things.
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
In a conversation, a wrong reply pill **shakes** (with a short vibration where supported). The person looks **embarrassed**, cycling through 3–4 gentle reactions, and **asks again**. The conversation only continues when the child picks the right reply. This holds for the whole game for tap replies, and is TBC for speaking (the child may skip speaking, then taps under the same rule). It's the one deliberate exception to §11's "no negatives mid-round": it's social and gentle, never a red cross, and the first-try result is still logged for the end review and the difficulty ladder. Details: `docs/modes/conversations-design.md` §10a.
