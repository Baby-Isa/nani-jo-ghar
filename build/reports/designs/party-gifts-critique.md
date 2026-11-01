# Critique: Gifts and cake to the right person (`party-gifts.md`)

Independent read, 1 Nov 2026, flaws first. Checked against the lessons checklist (1 Nov), the design method skill, the two research reports of 31 Oct, the audit of our games, the master map and the settings map with Zafar's answers, CLAUDE.md's non-negotiables, the archived designs it folds in, and the repo's own data (`data/lang/lexicon.json`, `data/family-audio.json`, `js/shared/`, `js/snap/`, `js/tidy/`). Nothing was edited.

**MUST** blocks the design going to Zafar; **SHOULD** is fixed before the brief.

---

## MUST

### 1. Two Nanis on one screen: the deciding word can't decide (A2, B1, C1; §1, §4)

- **Place:** §1's word table ("Nani (mother's mother; hers)" decides moves in slices, bags, Snap), C1's "Nani with the baby", §4 step 1 ("Nani stands at the left by the side panel").
- **Problem:** the game's Nani (the child's grandmother, Mum's voice, the host of every day) stands on screen and asks; the birthday girl's grandmother is also "Nani", and "Nani" is a tested word. A child who hears "it's Nani's" or "Nani with the baby" has two Nanis in view and the one who spoke is the obvious tap. Worse for the teaching: in every other day "Nani" means the child's own grandmother; here the same word is a stranger. The same clash reaches the evening book: "who's this?" over the party photos shows a "Nana" who is not the Nana of the kitchen (KEEP-11's recorded Nana).
- **Evidence:** non-negotiable 4 (the heard word decides); lessons 3 "bubbles belong to faces" (the face that speaks is the cue, so a self-referring "Nani" fails); the map Part 2 names the party as the home of family words, which means the words must be unambiguous here first.
- **Change:** make the host family's grandparents the father's side: *dada* and *dadima* (*dadima* is already in the engine, entry `n.grandmother`). Nana and Nani stay the child's own, Nani stays the asker, and the party teaches two new kinship words instead of muddling two old ones. If Zafar wants the girl's Nana/Nani, Nani must be off screen for those asks (voice from the panel) and the design must say so.

### 2. The deciding voices are not family voices (A1, A3, A5, B1, B2, B3; §1 frames, §3, decision 10)

- **Place:** A3 ("'my' is heard from the asker": the guest's first-person line decides), B2 ("she is always the one speaking": the girl's *mine / yours / his* decides), B3 (the girl asks "whose is it?"), B1 (the host aunty names the toy and the person), A5 (the host mum asks), A1 ("I'm four today").
- **Problem:** non-negotiable 2: only real family voices ship. Decision 10 says "Nani gives most asks", but the mechanics as written make a four-year-old girl, a host aunty, a host mum and several guests the speakers of the deciding line. Nobody in the family is a four-year-old girl; the design's open question 1 admits it and then builds three mini-games on her voice. B2's whole leak argument ("the speaker's face never decides") depends on her speaking every line.
- **Evidence:** NN2; `data/family-audio.json` has Mum, Zafar and (per LNG-19) Zafar's takes are not good enough; speaking.md's watch step needs both sides of the exchange recorded.
- **Change:** every deciding ask is Nani's (Mum) or, where a second voice is wanted, Masi's as the mother or aunty. B2 becomes Nani's: *tojo/toji* ("yours", the child's bag), *chokri jo* ("the girl's", her table), *baby jo* ("the baby's"), which keeps three places with three different heard words; the girl's "mine!" is her reaction, unscored. A3's "my cup" needs a recorded guest: Masi as the aunty or it waits. Put the voice question to Zafar before the design, not after.

### 3. The dastarkhwan is sent elsewhere, against the agreed fold (decision 11; A4)

- **Place:** A4 ("the full positional layout stays a pick-it-up board"), decision 11 ("the positional board stays with pick-it-up... assumed yes").
- **Problem:** this contradicts Zafar's word twice. The audit's §4 fold list (his yes to Q10, 1 Nov) keeps *Lay the dastarkhwan* at the birthday party; the master map Part 1 says "The party: the dastarkhwan, seat the guests, where's my cup?, the family photo, give one to Nana"; and this design's own scope says "the dastarkhwan ... fold in here". The design takes the owner rows and reassigns the positional half as an assumed yes. Non-negotiable 1: nothing moves without his OK, and an assumed yes in §10 is not an OK on a point he has already decided the other way.
- **Change:** fold it in: the dastarkhwan is A2's opener from L2 ("Nana's cup, in front of Nana": owner plus position, two words per move), on Tidy's `place.js`, `check.js` and `games/dastarkhwan.js`, which exist. If the designer still thinks positions belong to pick-it-up, that is a numbered question for Zafar marked "reverses your 1 Nov yes", not a decision.

### 4. Snap has no rule for what a shot "of" someone is, so a wide shot wins every ask (C1; §3)

- **Place:** C1's Do ("frames with the viewfinder, then taps to shoot"), its leak test ("shots are any frame, not a pick from a list"), C2 ("all of us: everyone in the frame").
- **Problem:** nothing says the named person must be the subject. A frame holding everyone contains the grandad, the aunty in red and "Nani with the baby" at once; a child or the bot shoots wide every time and never needs the word. C2 rewards exactly that frame. This is the waiting-and-elimination leak in one.
- **Evidence:** NN4; the archived Snap design judges "the big one" as *the main subject* and "just so many" as *exactly N*; the research's whack-a-mole/catch rows: a target that is always in reach fails (d).
- **Change:** a shot counts only when the named person is the main subject: the largest face, inside the centre two-thirds, and no other face above a set fraction of theirs; "Nani with the baby" means exactly those two; extra faces make a funny miss (the photobomber is the gag, from visit 1). Write the blind rate for a wide shot (must be 0).

### 5. Who ate the cake?'s L4 clue carries in a deal that doesn't exist on visit 2 (D1; §3, §5)

- **Place:** D1 L4 ("someone whose present was the drum: the B1 deal carries in"); §5 visit 2 ("Pass the parcel (B4) replaces the party bags"); §2 order (D1 follows the photo, part B comes last).
- **Problem:** on visit 2 there is no B1 deal (B4 replaced it) and part B hasn't happened yet when D1 runs. L4 is unbuildable as written, and the lessons say every level is designed and played (checklist 9; C1017 P35, "an L4 that was only a faster L3 was literally unplayable").
- **Change:** either D1's owner clue uses what has already happened that day (the cups from A3: "the one with the red cup"; the seat from A5: "the one next to Nana"), or part B runs before the photo on visit 2. Say which and redo the L4 row.

### 6. Scope: the brief was one give-to, Snap of people and a later Who-did-it; this is a mode (§0, §3, §5, §7)

- **Place:** the pool keeps 13 of 15 mini-games; §5 adds pass the parcel, Nani guesses, seat the guests, an arranged family photo, cupcakes with joke ages; §6 adds a cut drag, a mic blow and an unwrap; §7 asks for a family of 9, each in 5 poses, the girl at three ages, three backgrounds, ~30 items. It calls this "medium".
- **Problem:** this is the largest art job in the game (about 50 character poses, some needed twice: see SHOULD 7) and it depends on two rebuilds not yet scheduled (Snap, Who did it?; decision 21 puts Snap's party part after the farm's). CLAUDE.md: sprints of one to three days with one playable goal, two builders at most; "keep it small". The scope given to this design named the give-to, Snap's people shots and Who ate the cake? on a later visit; B4, D2, A5 and the cupcakes are new mechanics nobody asked for, each with its own leak surface and its own open question (the music for B4).
- **Change:** visit 1 is A1 + A2 + B1 (+ B3 as the one speaking moment) on `giveto` alone, with six people at most (girl, baby, mother, dada, dadima, aunty). C1 lands with Snap's rebuild; D1 with Who did it?'s. B4, D2, A5, the arranged photo and the cupcake ages go to `docs/ideas.md` as later visits. Rough size becomes honest: give-to one sprint; art one run for six people; the rest later.

### 7. The word table is wrong where it matters most: the owner words are already recorded (§1, §9, decision 7)

- **Place:** §1 marks *munjo/munji, tojo/toji, anjo/anji, injo/inji* "in engine"; "Mum first" asks her to record "mine, yours and his/hers, each said in a short sentence"; §9.1 says only Nana, Nani, "it's Nana's", "this is for Nana", small, red and cup are ✓; the budget is "about 22 clips".
- **Problem:** `data/family-audio.json` has Mum's clips *munjo cup*, *tojo cup*, *injo cup*, *anjo cup*, *asanjo cup* and *panjo cup* (all with files). The design's own core group (owners and pronouns, the scope's "whose?, mine, yours, his, hers") is the best-recorded thing it has, and it doesn't know. The budget, the "Mum first" list and the level order (B2 pushed to L3 "until recorded") all rest on this error. Two smaller ones: *nindho* and *kha* are Zafar's takes, not Mum's (LNG-19 says his aren't good enough), yet carry ✓; "thank you" has no plain clip (only *na, thank you*).
- **Evidence:** lessons 1 ("name the deciding words and how many Mum has recorded") and 10 ("Mum's voice is the budget"); the audit's flaw 2.
- **Change:** redo the table from `family-audio.json` by id, not memory; recount the budget; move the pronoun sort to the earliest level its recordings allow (it can be L2 today, with *cup* as the thing until the toys land).

### 8. The first round confuses: eight new things and a microphone dialog in seventy seconds (§4)

- **Place:** §4 steps 2-7.
- **Problem:** the "guided, unscored" first round exposes "I'm four today", the counted set-down of three bundles (one, four, eight), *hakro ba trae char*, a countdown, "happy birthday" by everyone, a cut drag, "this is for Nana", cake, and at step 4 "the mic glows": on a first play that is the browser's microphone permission dialog, over the game, mid-round. The rule is 3-5 new words a round (lessons 10) and "lose them by confusion, not by boredom" (lessons 2). Step 3 also contradicts itself: "everything else is dim and can't be tapped" and "a tap on another bundle: it wobbles".
- **Change:** the first round is A2 only: the cake already lit, one tap to blow it out (no mic), one give ("this is for Nana", the ✓ clip), "aah", the word card with Nana and cake. The candles and the mic arrive in round two or at L2, after the speaking moment has introduced the mic elsewhere. Fix the dim/wobble line to one or the other.

---

## SHOULD

### 9. Counts that decide nothing (A2 L2, B1 L2)

- **Place:** A2's level table ("L2: 'two pieces for the boy'", slices 2); B1 L2 ("two toys in a box", toys 2, blind rate "under 1%").
- **Problem:** with two slices on the tray and an ask for two, the number word chooses nothing: all slices go. In B1 L2 the second toy is the only toy left, so its "which" is free: the real blind rate is about 1/8 × 1/4 ≈ 3%, not under 1%. The research's rule everywhere else is "more than asked" (eggs, shells, mangoes).
- **Change:** the tray always holds more slices than the asks total (sizes mixed), and a box with two toys sits beside a box with three; state the real blind rates.

### 10. Phone layout at 915x275 can't hold L4 (§7)

- **Place:** §7's 915x275 row ("up to 6 across at about 110 px each (heads about 50 px)"); A2 L4 (6 people, 4 slices), B1 L4 (6 people, 2 boxes, toys, the bag, the basket), the card that "pops up big beside the panel (never over a face)".
- **Problem:** the panel takes about a fifth (ui-design-system §F4), leaving ~715 px; six people at 110 px fill it, so there is nowhere beside the panel for the big card that isn't a face, and the bubbles' "free space above heads" is about 60 px once the tray strip is in. L4's look-alikes (two aunties, two old men told apart by a cap) have to be told apart at 50 px heads. Lessons 6: "two people stand in the middle and on the right"; faces stay big; take the room from the scenery.
- **Change:** cap people on screen at four below 430 px tall (L4's pairs are exactly four: two aunties, two old men); others wait off the right edge and walk in as the step moves on. Faces 64 px minimum at every size. Say where the big card goes at 740x320 in pixels.

### 11. A1's L1 teaches nothing and L3 is arithmetic (A1)

- **Place:** A1's levels and leak test ("the age itself is unscored after the first ever round"; L1 "her age only", 1 pick); L3 ("5 = 3 + 2, so the child picks one or two").
- **Problem:** at L1 the only pick is the age, fixed all visit and unscored after round one, so L1 candles is a cutscene with a tap. L3's sum is a maths task, not a Kutchi test, and breaks "levels make the Kutchi harder, never the task" (UX §12); a 4-year-old doesn't add.
- **Change:** the cupcake count (a guest's number, new each round) is in from L1; cut the sum; L3's "other way of saying it" is *kitla* alone.

### 12. D1's numbers are copied, not computed (D1)

- **Place:** "blind rate 3.7% at L1" and "levels 3, 4, 5 and 6 suspects; clues 1, 2, 2-3, 3".
- **Problem:** the archive's 3.7% is for its own L1 shape; here one clue ("boy") among three suspects is a one-in-three tap. The clue sets are also undefined for this cast: is the baby a "boy"? is the birthday girl "small"? Each clue must fit at least two suspects from L2 or it solves alone.
- **Change:** write the suspect-by-clue table per level and the real rates.

### 13. B2 has no watch step, though it is the hardest moment (B2, B3)

- **Place:** B2 (the sort to three places) is given straight; B3 gets the two-character model.
- **Problem:** "mine" said by her means her table and "yours" means the child's bag: pronoun perspective is a late skill for 3-4-year-olds. B3 models the easy half; B2, the half that decides, is not modelled.
- **Change:** B2 opens with two guests sorting one box each while the girl says whose it is; then the child's turn. (Lessons 3: model it, then ask.)

### 14. Pattern leak in A3 and a broken carry-in (A3, §2)

- **Place:** A3's Challenge ("the baby being the only person not speaking"); §2 "the guests who were thirsty now hold cups".
- **Problem:** if "his/hers" is always the baby, *injo* is learned as "the baby" and the pronoun isn't tested; and if guests already hold cups from look after the guests, there is no cup to give.
- **Change:** rotate the third person (the grandma's cup, *anji*, at L4); drop the cups carry-in or make it the plates.

### 15. The ChatGPT prompts (§11)

No real person is named and no text is asked for: good. But:
- **Prompt 1** asks for bundles that read as 1, 4 and 8 and in the same image shows the four mid-hop (one on the cake, one in the air): the count can't read. Show the moment before the tap, the lit box on the whole bundle.
- **Prompt 2** has the girl say "open it and see"; B1's asker is the host aunty. One or the other.
- **Prompt 3** puts the two old men "side by side" and then frames one; the frame can't exclude the other, which is the exact leak in MUST 4. Space them. "Full figures" is a second camera for every person (SHOULD 7).
- **Prompt 4**'s "innocent and slightly guilty" standing children are a tell (the waiting leak) and the aunty "rolling her eyes" is the disapproving look the research flags as a verdict (NN7). Everyone blinks the same.
- **All four:** no aspect ratio (ask for wide landscape, about 21:9, so the 740x320 check means something) and "no side panel" without reserving the left fifth, so the composition fills the frame and the panel then covers it. "Sound-burst sparkles" invites drawn "BOOM"; say "no comic sound marks". Attaching `nani-sheet.webp` to scenes without Nani (1, 2, 4) risks her turning up.

### 16. The art list is both doubled and short (§7)

- **Problem:** the room is E waist-up and the garden Snap wants full figures: the art bible draws a sprite in its scene's camera, so that is every person twice. The list misses per-candle lit/out states (the flames go out "one by one"), cupcakes with candles, the second grandmother the word table promises at visit 2, and counts the girl's three ages as one person.
- **Change:** shoot Snap's garden waist-up behind a low wall; list every state; count sheets, not people.

### 17. Reuse missed (§6)

- Snap's `js/snap/mechanics/handin.js` is the tap-print-tap-person give already greyboxed (5b *Who wants which?*): `giveto` should be lifted from it, not built from nothing.
- `js/shared/whichone.js` (pick one among decoys) for the person pick and the cups; `js/shared/onboard.js` for the first-time showings; the clinic's waiting-room ladder for "the aunty in red" and "the old man with the cap" (pick the person described is the clinic's, audit §5.6); Cook's `count` for the candle tally; Tidy's `tell.js` for B3.

### 18. English reaching the child (B3, D1's ending)

- **Place:** B3's pills (*mine, yours, the baby's*), D1's "it's okay" / "share!" pills, the child's spoken "thank you".
- **Problem:** the ending pills' words aren't recorded, so they would be grey English pills the child reads (NN3; CLN-158). "Thank you" as the child's own line is spoken English outside story mode; Tidy used *Aabhar aanjo*.
- **Change:** speaker pills with Mum's clip or no pill until it lands; ask Mum what the family says for thanks.

### 19. Small contradictions to settle

- "The hint costs a bulb" (every leak test) against "hints after 7-13 s... the helper card costs a bulb" (§3 shared rules; rulebook: the guide's hint is free). Pick one.
- "I'm a hundred!" needs a Kutchi hundred that isn't in scope or on the record list; make the joke visual (he reaches for the biggest bundle).
- Decision 2 reverses the day order of the map's Part 7 (gifts before statues); Part 7 is a proposal, so this is fine, but say in one line that the map changes too.
- "Happy birthday said by everyone" over Nani's countdown is two voices at once (lessons 3: no overlapping voices).

---

## Verdict

The bones are right: one shared give-to, the toy named only after the unwrap, any toy to anyone, faces off the card past support, a heard clue with no trace, and the mock-up prompts are clean of text and real people. But it can't go to Zafar as it stands. Two Nanis on one screen break the deciding word at the heart of the game, the deciding lines are in voices the family doesn't have, the dastarkhwan is moved against his 1 Nov yes, Snap's people shots leak to a wide frame, Who ate the cake?'s L4 rests on a deal that isn't there on visit 2, the word table misses that the owner words are already Mum's clips (which changes the budget and the level order), the first round does eight things and a mic dialog in seventy seconds, and the whole is a mode's worth of art and three new mechanics where the brief asked for one. Fix the eight MUSTs, cut to visit 1 on `giveto`, recount the words from the manifest, and this becomes a strong, small first sprint with the delight (the unwrap, the grandad's drum, the blow-out) intact.
