# Clinic play-test, 29 Sept 2026: every point, analysis and the plan

**Source:** Zafar's two voice notes from playing the clinic lab (`lab/clinic-core.html`, heal labs A–C). Transcripts:
- `docs/feedback/clinic-playtest-2026-09-29-transcript-part1.md` (24 min: waiting room, diagnosis, pharmacy, send-off, and the heal games cut, knee and ear);
- `…-part2.md` (18 min: the heal games tooth, taste, fever, boing, eye and foot).

Every point carries its timestamp (**1:** or **2:** for the part). The coverage check at the end maps every line of both transcripts to an item.

**Why this matters now:** the clinic is the children's own doctor's clinic (Hannah's granddad's). He visits around 9 Oct to record his lines (Round 4 Section G) and see the game.

**How to read it:**
- **G** items are clinic-wide. Then: **W** waiting room, **D** diagnosis, **P** pharmacy, **E** send-off, **H-…** each heal game.
- Each item gives what Zafar said, what's causing it (checked in the code), and what to do.
- 🟢 = Zafar liked it. **CQ** = a decision for Zafar (§9).
- Nothing is built until the CQs are answered.

---

## 1. What Zafar liked (keep these)
- 🟢 **"The mechanics are there. Maybe we're not so far off as we think"** (1:9:22). **"Maybe it's quite good if we get all of these right"** (2:17:34).
- 🟢 **Diagnosis:** D1's "does it hurt here? → no / yes" teaches the parts (1:5:26–5:38); D2 works (1:7:34); D3's "look at the knee → the hand" (1:8:40).
- 🟢 **Pharmacy** is fun (1:9:26); level 3's "toothbrush first, then a drill, then a filling": "kind of fun… feeling enthused" (1:11:15–12:14).
- 🟢 **Send-off:** "I really like this send-off, happy or sad" (1:12:32). The lolly is "so funny" (1:13:49). "This is actually quite a good game mode" (1:14:05). E4's extra dialogue is a good mechanic (1:17:13).
- 🟢 **Heal games:**
  - the plaster **colour** idea (1:18:23);
  - the knee tap is funny (1:20:55);
  - the ear's taking-out game is funny (1:23:44);
  - tooth's "small tooth, three taps" is funny (2:1:20);
  - taste has "the bones of something… definitely different" (2:5:53);
  - boing's wipe and the counting are good (2:9:12);
  - **the eye test is "really quite clever… really funny"** (2:10:45).

---

## 2. Clinic-wide (G)

### G1. Lock the backgrounds first, then build on them (1:1:46, 1:7:08, 2:11:36, 2:17:52)
Zafar: lock the backgrounds, "then we'll know where to fit all the elements… and not have to resize them"; "for all of these the background artwork has to be really good and hopefully not changed too much, so we build the assets right the first time."

**What exists:** the three "final" rooms (waiting, exam room, pharmacy) are good-quality paintings in the Cook palette (cream, sage, terrazzo). But:
- they're **empty panels designed for the old layout**: no people space, no medical cues, no exam bed, and a drawn conveyor the game doesn't use;
- the game fades them to 45–55%;
- the heal games have **no background at all** (plain cream).

**Plan:** six new backgrounds (§10, prompts CB1–CB6), approved by Zafar **before** any mechanic work.

### G2. The rough art made judging hard (1:23:54)
"I was just so overwhelmed by how terrible the visuals were… I don't know why I'm enjoying this more now." The characters are still mostly rough sprites and grey stand-ins (only Nana, Ma and Ali have final sitting poses).

This is why the token plan (G10) prototypes on **good backgrounds with simple stand-in pieces**, so the next play-through judges the mechanics, not the scribbles.

### G3. Bring over everything Cook learned (1:15:51–16:21)
"All the shared UI nice elements… the side panel, the front screen, the pop-up screen… and all the design lessons about spacing and placement and consistency and grouping."
- The clinic gets the shared order card as the **patient card**, the Nani box, the end pop-up, the review faces, shelf-band spacing, and VISUAL-QA §5.
- This is the design-system rebuild planned in B1, now with Zafar's notes.

### G4. Language: build it up simply, and track it (1:2:15–3:23)
Zafar: "language needs to build simply and build up… man, woman, boy, girl, then old man, young… then adjectives: young, old, tall, short… then colours, or the woman with the baby." He asked: "are we tracking sentence complexity independently, or just within game modes and levels?"

**The answer (checked):** it's **not tracked per learner**. The game tracks two things:
1. how well each **word** is known (stages 1–4);
2. each mode's **level** (the clinic levels each stage separately, up to 3).

The S1–S6 syllabus is only a design ladder. The one component that reads it (Conversations) is stuck at S1. So sentence complexity comes from the mode's level, not from the child.

**What the waiting room asks today:**
- **kinds:** girl, boy, old man, old woman, baby, auntie, uncle (no "man" or "woman", no "young", no "tall" or "short");
- **W2:** adds a colour (English placeholder) or *wadho / nindho* (only on he-words, because the she-forms aren't confirmed).

**Plan:**
- Rewrite the waiting room's ladder as Zafar describes (W below). The words needed go to Mum: man, woman, young, tall, short, "with the baby", and colours.
- **CQ2:** a small shared "sentence-pattern stage" per child, so the clinic, Cook and Find it can all step up the same way. Now, or later as foundation work?

### G5. The heal games explain nothing (2:15:13, 1:8:05, 2:5:05–5:33, 2:12:21)
Foot: "doesn't really explain anything… there's no explanation." Taste: "I have no idea what's going on or why." Eye: "why am I clicking on the things?"

**Why (checked):**
- Every heal game's first-time help is a **silent ghost hand**: no words, no reason.
- It runs once per profile, at level 1 only.
- Foot's help covers only the water; eye's only the drops.
- The lab links never show it again once it's been seen.

**Plan:** every game opens with **one clear "why" beat**: the patient says the problem and the doctor says the goal ("a thorn in my foot" → "let's take it out"). Every step gets its first-time cue, with words and voice. Plus the same check as Cook's X11 (no phase without help).

### G6. Rows don't tick when you've done them (2:2:18–2:25)
Tooth: "this still hasn't ticked off that I did three taps… oh, I ticked it, so it doesn't tell you that you've done it."

**Why:** by design, rows tick only when the step closes (you pick the next tool or press ✓), so the count isn't given away. At level 1 that hides progress completely.

**Plan:** use the Cook counting rule (Q7):
- **level 1:** the row counts up as you tap, and the count is heard;
- **level 2:** written, not counted;
- **level 3+:** heard only.

### G7. The grown-up "skip" button confused him (2:7:41–7:54)
The top-right ▶| button is the first-time help's **skip for grown-ups** (hold for 1 second). Zafar took it for "go to next chapter": "I don't know why that's there… not good." **Plan:** make it small, grey and labelled for grown-ups ("skip"), at the bottom corner rather than top right, or hide it behind the ? menu (**CQ15**).

### G8. The fever game can't be played: a bug (2:7:30–8:42)
- **In the full clinic:** the tray sends a "strip" the fever game doesn't know, so the thermometer never appears, and the first-time help blocks every other tap.
- **In the lab:** the level-1 help blocks every tap except the thermometer's dish, and the fan is the rainbow-coloured thing that *looks* like the fever strip in the design.

**Plan:** fix the tray id, make the thermometer look like a thermometer, and add a test for the help path (tests currently switch help off).

### G9. A Kutchi mistake: *nar* vs *na* (1:5:51, the eye game)
- The clinic uses *Nar* for "no" (the patient's answer in diagnosis, and the eye chart's "not" row).
- Mum's notes (grammar notes §24 and the Cook "no" line) say **no is *na*, not *nar***. *Nar* means "look".

**Plan:** change it to *na* everywhere in the clinic (**CQ16**, confirm).

### G10. A token-saving plan (2:17:42–18:11)
"We'd have to do a big think on some of these and how we don't just burn up loads of tokens… the background, then fake art over the good backgrounds to show the mechanic working, and then if we like it, iterate, then commission the artwork. Come up with a reasonable token usage plan." See §11.

### G11. How the clinic was designed, and making it a skill (1:14:05–14:50)
"Remind me how we designed this… I think I gave you or Fable a big prompt that said make it… could we retrospectively make a skill of this kind of game research… we should codify this."

**How it was actually done:** five briefs, each adding a layer to `docs/modes/clinic-design.md`:
1. **Mode design** (`MODE-DESIGN-BRIEF.md`): research the hit games; draft 8–12 mechanics; score each on Fun, Forces Kutchi, Distinct, Plot and Replay; run persona loops (children aged 5, 8 and 11, Zafar, a parent, Nani, a Sceptic, a Builder); give a verdict and a build brief.
2. **An outside review** (`REVIEW-2026-09-25.md`).
3. **A deep dive** (`DEEP-DIVE-BRIEF.md`): a mini-game library scored on fun at 5 and at 11, Kutchi, distinctness and build cost; speaking moments; a blind-bot estimate.
4. **The pipeline** (`PIPELINE-BRIEF.md`): the stages from arrival to send-off, the 20 healing games, and research into doctor apps.
5. **A quality pass** (`MINIGAME-QUALITY-BRIEF.md`): the three UX rules; five questions per mini-game (what do you do, where's the challenge, the fun, the instruction, what's new); cut 20 games to 9; level-1 walkthroughs; a final Sceptic pass.

**About 70% of it is general.** It can become a project skill, `.claude/skills/game-mode-design/SKILL.md`:
- the process in the skill itself;
- `references/` for the scoring criteria, the personas, the leak patterns (how a bot could win without Kutchi) and the doc template;
- pointers to the game's own docs for the project-specific parts.

A small job (**CQ17**). It would also be the first step of every future mode (Tidy up, Find it, the trips), and would make the redesigns below cheaper.

### G12. A note for Cook (1:22:32)
"I've actually not checked level threes of the cooking game." Levels 2–4 of every Cook station need a pass (Cook report K11).

---

## 3. Waiting room (W), part 1: 0:00–5:04
- **W1. Background quality check, and something on the wall to say "doctor's" (1:0:07–0:25, 2:02).** Today's panel is good quality but empty.
- **W2. The people should sit on a bench, one large one (1:0:25, 2:06).**
- **W3. How to show you picked the right person (1:0:35–1:44).** Zafar doesn't want them to move (where to?), and raising hands needs lots of new art. His choice: **a large tick or checkbox under (or above) each person**. Tap it: it shakes if wrong, and locks in if right. "That way they don't have to move." Recommended.
- **W4. The language ladder (1:2:15–3:23):** see G4.
  - Stage 1: man, woman, boy, girl.
  - Stage 2: old / young.
  - Stage 3: tall / short.
  - Stage 4: colours (of clothes).
  - Stage 5: "the woman with the baby", "the lady with the child".
- **W5. Zafar's bigger idea (1:3:24–4:59), recommended (CQ1):** scrap this background for a **wider, more interesting waiting room**:
  - people on a bench, on sofas, standing by the door and near the check-in desk;
  - "like an array… not quite a find-them, not Where's Waldo", growing to **8–12 people** as the game progresses;
  - a desk, the medical cross on the wall, a stethoscope on a table; "not too busy";
  - **the doctor's door half open, his head leaning out**, calling "bring in so-and-so".

  This makes the waiting room a light search game (listen, then find), which suits the language ladder well.

## 4. Diagnosis (D), part 1: 5:04–9:26
- **D1.** 🟢 D1 "does it hurt here?" works: tap parts, and the patient says no or yes (1:5:04–5:38).
- **D2. D1b follows the same rule (1:5:46–5:51).** D1b is D1 with scoring and a **Next** button (press "Found it" after yes, "Next" after no). Zafar didn't know what it was. **Plan:** fold D1b into D1 as its level 2 (the card explains), rather than a separate variant.
- **D3. The scene: art suggestions asked for (1:5:51–7:15).** Zafar's picture:
  - the patient **sits on the edge of the doctor's bed, knees dangling**;
  - or **stands next to an anatomy poster**, "some posters on the wall, not too busy";
  - **the doctor next to them in both**: the patient faces you, the doctor is turned ¾ between the patient and you;
  - you tap around the patient to find where it hurts.

  **Recommended (CQ3):** one exam room (CB2) with the bed centred and an anatomy poster; the standing variant uses the same room's other wall (CB3); the heal games use a close-up of the same bed (CB6). The doctor art (dump 2) goes in beside.
- **D4.** 🟢 D2 "where does it hurt? → my foot" works; left and right at level 3 (1:7:19–7:46, 8:44–8:53).
- **D5. D3's tools aren't clear (1:7:46–8:40).** "It doesn't really tell you which tools to use to look at the ear… a tablet? a torch? stethoscope for the ear?"
  - **Why:** the **torch's rough picture looks like a pill**, and it's the only right tool for "look in the ear".
  - **Plan:**
    - a clear torch picture;
    - a first-time cue per tool ("look **in** = the torch, **listen** = the stethoscope, **look at** = your hand, **the temperature** = the thermometer");
    - at level 1, only the right tool plus one other.
- **D6. Time pressure? Probably not (1:9:06–9:22).** Agreed: diagnosis stays calm.

## 5. Pharmacy (P), part 1: 9:26–12:14
- **P1. Camera angle for the items (1:9:33–11:08).** "Some things are better side-on and some top-down." Zafar likes the current background's angle (about 30° up) and suggests **moving the camera to about 45°**, rendering the new medical objects at 45°, with top-down, side-on and rotated versions as spare, "the most easy to see and the most realistic". Recommended: 45° for the pharmacy (CQ4).
- **P2. The drawn conveyor belt isn't the one you use (1:10:00–10:07).** The background has a belt, but the game draws its own belt across the top. **Plan:** the items ride on the painted belt (CB4 draws it at 45°, with room in front for the tray).
- **P3. Take inspiration from the pantry's tray (1:10:07).**
- **P4. Level 3 (1:11:15–12:14):**
  - move the belt faster, or put the items **closer together**, at the hard level;
  - "I wonder if a countdown timer would be helpful" (CQ5);
  - "what is a filling going to look like? Be strategic about items we can easily display and draw." **Plan:** swap hard-to-draw items for clear ones (the "filling" is `paste`, so draw a tube).

## 6. Send-off (E), part 1: 12:14–17:20
- **E1. The scene (1:12:20–12:30):** the patient leaving, **the door half open**, about to step through, the doctor beside them asking if everything's okay (CB5).
- **E2. Make happy or sad clear without English (1:12:36–13:37).** "If you don't know English… how are you going to know it's a thought bubble?"
  - **Today:** emoji cards (okay, happy, better, sad; scared at level 3), not the drawn feeling art (which exists but isn't connected).
  - Zafar's thinking:
    - maybe the patient's own face;
    - or generic icons, the same for everyone (hot, cold, happy, sad);
    - "the thought bubble comes out and you answer for them";
    - "give me four options".
  - **Four options:**
    1. **The patient's face shows it:** the round face circle over them (as Cook's review, Q1) shows the feeling, and the child picks the matching card. Pure seeing.
    2. **The patient says it:** *"Muke thadh lage"* ("I feel cold", words to record), with no picture. The child picks the card. Pure listening: the most Kutchi.
    3. **Say it for them:** the thought bubble shows the feeling picture, and the child taps the Kutchi word or says it aloud (a speaking moment).
    4. **Fix it:** the feeling shows, and the child picks what helps (cold → a blanket, sad → the apple). Links the feeling to an action.

    **Recommended:** 1 at level 1, 2 at level 2, 4 at level 3 (CQ6). All with the four drawn feeling faces (happy, sad, hot, cold), the same for everyone.
- **E3. The lolly becomes an apple (1:13:49):** Mum says no sweets for children ("an apple a day…"). The same goes for **boing's lollipop** (H-boing).
- **E4. E2 vs E3 isn't clear (1:15:09).** E3 = E2 plus a spoken goodbye. **Plan:** make it one send-off whose goodbye appears from level 2, and the goodbye happens **in the scene**, not in the left panel (1:15:30–15:52: "I'm not sure you even need the side panel for it").
- **E5. 🟢 E4: the doctor tells you to ask how they feel (1:16:21–17:20).** "You need to understand what the doctor is asking you… I like it, we'll just have to think about how we explain it." **Plan:** the first time, Nani whispers the idea ("ask them how they feel"), and the question card shows the patient's face with a question mark.

## 7. Heal games, part 1: 17:24–24:20
### H-cut (the scrape: water, cloth, plaster) (1:17:24–20:49)
- **What happens:** the cloth gets dabbed 1–4 times; at level 1 the plaster is one of three designs (cat, star, "spots", which shows as a red dot); from level 2 it's a plaster colour.
- **Zafar:**
  - "the star, the cat, the red dot: I'm not sure what that is";
  - the **colour plaster is a good idea**;
  - "very clicky: click, click, click… there's no skill… no one's going to enjoy sticking a plaster on the way they enjoy the cooking… I'm really struggling with ideas… you see a close-up of a cut… clean bits off it. I need your help."
- **Three ideas:**
  1. **Grit out:** a close-up of the scrape with little bits of grit. Tap or drag each bit out (the count is said: "take out three"). More bits keep appearing at level 3 (like the ear). A skill and a count, and it's satisfying.
  2. **Line it up:** the plaster must be dragged so its pad covers the cut, then each end smoothed down with a swipe. The patient winces if it's off. A small precision skill.
  3. **Clean in rhythm:** the cloth dabs on a beat ("one, two, three"). Tap in time, and the dirt fades with each good tap. Timing skill, like the maani flip.

  **Recommended: 1 plus 2's line-up** (CQ7). Drop the cat, star and dot designs, and keep colours only.

### H-knee (1:20:55–23:07)
- 🟢 Tapping the knee (the reflex hammer) is funny, and it's perfect with the patient hanging their legs over the bed.
- **The bandage, redesigned by Zafar (1:21:26–22:32):** a flash-and-tap wrap.
  - **Level 1:** two dots, left and right, at the same height. Tap left, right, left ("three turns"), and each tap wraps the bandage from dot to dot.
  - **Later:** three dots on each side at different heights. They flash in a sequence (bottom left, top right, middle left…) and you tap each as it flashes.
  - "Almost like a reaction game… how quickly can you do it. That would be fun."

  **Adopt as designed** (CQ8).
- **Level 3 is unclear (1:22:40–23:07):** "first on the knee, then that knee, then the leg: it needs to say left or right, or only highlight one knee and one leg at the start." **Plan:** the side is said and shown at first; only the named leg glows at level 1–2.

### H-ear (1:23:07–24:03)
- 🟢 Cleaning it (the cotton bud, four times), taking out the "wax blobs" (actually **seeds**: big one first, then the small one), then the drops: "at first I thought it was ridiculous… it's kind of funny."
- **Zafar's addition (1:23:48):** "what if more of them keep coming… they keep repopulating. That would make a fun game." **Plan:** from level 2, seeds (or wax) keep popping up for a few seconds and you clear them before the drops. A calm whack-a-mole.

## 8. Heal games, part 2
### H-tooth (2:0:00–4:44)
- **Brushing is unclear (2:0:09–1:20).** "Brush down, down, up… does it mean brush those teeth, or the order? … Two teeth have down marks: are those the ones to brush?"
  - Zafar's design: **a toothbrush fixed across the mouth; grab its head and move it up, down, left, right in the order called, "almost like Just Dance"**, with the sequence getting longer.
  - Words: *up / down* (versus top / bottom), and *dabo / jamno* (left / right).
  - Recommended as designed (CQ9).
- **The green bug (2:1:28–2:25):** confusing (it hops about, a second one appears, and the three taps don't tick). **Zafar:** "let's not scare the kids, let's just not do it, but keep it in mind." **Drop the bug.** (The tick problem is G6.)
- **New: drill the bad bits (2:2:30–4:14).** "You see a tooth and have to drill the black bits out while keeping the good bits… especially under some time pressure." A careful-drilling game: tap or drag over the dark decay, and the white stays. Too much and the tooth shows a chip. Recommended (CQ9).
- **New: the filling (2:3:01, 4:14–4:44).** "The doctor holds the filling pipette; you press and hold and it fills more and more, and you stop at the right line." That's chai's boil timing on a tooth, so it's cheap. Recommended.

### H-taste (2:4:45–7:25)
- **What it is:** Cook's food words used on the body. "Stick out your tongue", then drops in the order said (*pela limu, ne poi paani*; at level 3 *pela ba marcha, ne poi ba loon*), and the patient reacts. The droppers look alike, so the word is the only clue.
- **Zafar:** "I just don't really get what I'm doing… I don't understand the point… but there's something here… Mum kind of liked it (teaching flavours)… give me three different suggestions."
- **Three ideas:**
  1. **Guess the food:** the patient (eyes closed) tastes a drop and pulls a face: sour, salty, sweet or spicy, with the taste word said. The child hands over the food that tastes like that (limu, loon, khun, marcha). This teaches **taste words**, which are new, alongside known foods.
  2. **Make the medicine nice:** the doctor's medicine tastes awful. Add drops in the order said (*pela madh, ne poi limu…*) until the patient smiles. This is today's game, **with a reason to do it**.
  3. **Which taste is missing:** the patient has a cold and has lost one taste. Try each; they react to all but one, and that's the problem. A diagnosis game.
- **Avoid the "tongue map"** (the taste zones idea is a myth). **Recommended: 1** (CQ10). The taste words (sour, sweet, salty, spicy) go to Mum.

### H-fever (2:7:30–8:58)
- **Unplayable:** see G7 (skip button) and G8 (thermometer).
- **The original intention:** the only game driven by a conversation. Take the temperature: hot means the cloth or fan, cold means the blanket. The patient says "still cold", "too hot", "just right", which decides the next step.
- **Zafar's idea is the same shape:** "take the temperature; if it's hot you need a cold thing, then they're cold and you need a hot one… maybe it alternates."
- **Plan:** make it playable and obvious:
  - a thermometer that looks like one, with a reading that turns red or blue;
  - one clear "why" line;
  - an alternating back-and-forth until "just right".
- **Words:** *koso* (hot) and *nokoso* (lukewarm) from Zafar (2:15:51–15:56); garam may be Gujarati. Check with Mum.

### H-boing (the injection) (2:9:06–10:27)
- **What it is:** wipe the arm N times, count down with the doctor, BOING, then *pela* plaster, *ne poi* lollipop.
- **Zafar:**
  - 🟢 "wiping is fine… count with me: okay, that's good";
  - "I don't get the plaster part" (unclear);
  - **his idea:** "a pretend injection with different-coloured things inside; you count them in: click one and the first goes in, click two and the second goes in… and sometimes it could be the colour."
- **Plan:**
  - the syringe holds coloured beads; each tap sends one in as the count is said; later levels say the colours;
  - the doctor still holds it (the child never gives medicine);
  - the lollipop becomes an apple (E3);
  - the plaster step gets a clear line or goes.

### H-eye (2:10:27–14:23)
- 🟢 Drops, then an **eye test, row by row**: "really quite clever… really funny".
- "What else, other than fruit and veg? I get a lot of that." Vocabulary: household things and anything the child has met elsewhere ("bed, table, so many things").
- "Why am I clicking on the things?" Zafar then designed it (2:13:13–14:16):
  - **the patient reads the chart out, row by row** (the objects get smaller), and **you judge whether they're right**;
  - if they got it wrong, **another eye drop, then they try again**;
  - **level 1:** one item per row, and what they say is **written by their mouth** as well;
  - **later:** heard only, several items per row read left to right, so you have to think whether they got it all right.

  Adopt as designed (CQ11). Also fix *nar* in its "not" row (G9).

### H-foot (2:14:23–17:34)
- **Water:** cold, hot and lukewarm: "fine… once you've learned it you've learned it" (words: koso / nokoso, G-fever).
- **Unclear:**
  - "I don't really get the swirly thing" (it marks which foot has the thorn);
  - the toes (big toe, little toe);
  - the tweezers;
  - where the plaster goes: "doesn't explain anything" (G5).
- **Zafar's idea (2:16:12–17:34):** removing splinters, **like the buzz-wire game: pull the splinter out without touching the sides**. A real maze would need too many twists for the space, so it's "take it out accurately" rather than a maze. Several splinters, then the plaster where they were.

  **Recommended** (CQ12): each splinter is pulled along its own short path; touching the edge makes the patient wince and the splinter slides back a bit.

### Not played: tummy, hic, hair
- **tummy:** bubbles up a tube to a burp, then milk from unlabelled jugs.
- **hic:** sips, a counted breath-hold, then "Boo!".
- **hair:** comb, catch beetles by colour and count, shampoo.

The design rated all three "maybe later". They'll be looked at in the prototype pass (§11).

---

## 9. Decisions for Zafar (answer these before any agent starts)
Answer "yes to all recommendations except …".

- **CQ1 Waiting room:** the wider room, 8–12 people (seated and standing), the doctor calling from his half-open door, a **tick under each person** (shakes if wrong, locks in if right). **Recommend yes.**
- **CQ2 Language ladder:** W4's five stages in the waiting room now (words to Mum). Also, should we add a small **per-child sentence-pattern stage**, shared by the clinic, Cook and Find it? **Recommend: the ladder now, the shared tracker later, with the story engine.**
- **CQ3 Exam scenes:** one exam room: the patient sits on the bed's edge facing you, the doctor beside them, turned ¾. The standing variant is by an anatomy poster on the other wall. The heal games use a close-up of the bed. **Recommend yes.**
- **CQ4 Pharmacy:** a 45° camera; items at 45° (with spare top-down and side-on versions); the items ride the painted belt; a tray like the pantry's. **Recommend yes.**
- **CQ5 Pharmacy level 3:** a countdown timer, or just a faster belt with the items closer together? **Recommend no timer** (the calm principle); faster and closer instead.
- **CQ6 Send-off feelings:** the face at level 1, heard at level 2, fix-it at level 3, with four drawn feeling faces; apple not lolly; the goodbye happens in the scene from level 2 (E2 and E3 merged); no left panel. **Recommend yes.**
- **CQ7 The scrape:** grit-out plus plaster line-up; colours only (drop cat, star, dot). **Recommend yes.**
- **CQ8 Knee bandage:** your flash-and-tap wrap, as described. **Recommend yes.**
- **CQ9 Tooth:** brush by dragging the fixed brush's head in the called order ("Just Dance"); no bug; drill the bad bits; press-and-hold filling to the line. **Recommend yes.**
- **CQ10 Taste:** which of the three (guess the food / make the medicine nice / which taste is missing)? **Recommend 1.**
- **CQ11 Eye test:** your design (they read, you judge; wrong → another drop; written at level 1, heard later, more items per row); wider vocabulary. **Recommend yes.**
- **CQ12 Foot:** splinters pulled out accurately without touching the edges; several splinters; the plaster where they were. **Recommend yes.**
- **CQ13 Boing:** coloured beads counted into the syringe (colours at higher levels); an apple, not a lollipop. **Recommend yes.**
- **CQ14 Tummy, hic, hair:** leave until the prototype pass, or drop for now? **Recommend: leave; decide after the prototypes.**
- **CQ15 The skip button:** a small grey "skip" for grown-ups in the bottom corner (or behind the ? menu). **Recommend: behind the ? menu.**
- **CQ16 *nar* → *na*** for "no" everywhere in the clinic. **Recommend yes** (Mum's notes).
- **CQ17 Make the design process a project skill** (`.claude/skills/game-mode-design`). **Recommend yes.** A small job; I can do it here.
- **CQ18 Timing against Cook:**
  - the clinic backgrounds now, via ChatGPT (below);
  - the clinic's prototype sessions start once Cook's station sessions are running;
  - the doctor's recording script (Section G) is checked this week.

  **Recommend yes.**

### Zafar's answers (29 Sept, ~15:40 UTC): these override the recommendations above
- **Everything not listed here: yes, as recommended** (CQ1, CQ3–CQ6, CQ8, CQ9, CQ11–CQ18). The token plan (§11) is approved.
- **CQ2:** Zafar asked what the shared tracker means (explained in chat). The waiting-room ladder goes ahead now; the shared tracker stays a later foundation item.
- **CQ7, the scrape: plaster stickers, in order.** No grit (that's the ear's game). The child puts on **three plasters in the colours and order said**; at higher levels the plasters become **half-and-half colours** (two colours each), so it's a pure colour-and-order game. "It seems a bit of a cop-out, but for the moment let's just do that." (The suture/stitches stay as the cut variant.)
- **The ear:** use **wax blobs**, not seeds ("better for the ear"). They keep coming back from level 2.
- **CQ10, taste → a sore throat and a swollen tongue: make the soothing drink.** The tongue has swollen bumps (a sore throat too); the child **makes a drink to bring them down**, following the doctor's instruction (the language), borrowing from the chai game, with a little trial and error: if one drink doesn't settle all the bumps, the doctor says the next one. Drinks from Cook's own words: *hardar waaro dudh* (turmeric milk), *aadu* (ginger), *madh ne limu* (honey and lemon, words to check). A countdown at higher levels. Design sheet to follow.
  - **Refined (Zafar, ~15:50):** less trial and error. The bumps on the tongue come in **different colours, and each colour is healed by a different drink** (for example yellow = turmeric milk, orange = ginger, green = honey and lemon: the mapping taught by the doctor's instruction and the card). The child makes each drink and gives it to the patient **before the time runs out** (Zafar likes the time pressure). Level 1: one bump colour, one drink. Level 2: two colours, two drinks in order. Level 3: three, with counts (*ba chamchi madh*) and a tighter timer.
- **Backgrounds:** six different ones, confirmed as written. The heal games' zoomed body parts (knee, scrape, ear, mouth, eye, foot) are **character close-ups**, drawn later with the patient art, on top of CB6. The flow: the patient sits on the bed's edge (CB2), you pick where it hurts, and the view zooms in to that close-up.

- **Backgrounds, round 1 review (Zafar, ~16:30):** CB5 (front door) approved. CB1 goes closer, with a six-seat bench and no armchairs. CB2 goes closer, with **no poster**: the wall to the right is kept for **a photo of the real doctor's certificate** (Zafar will supply it; it's added in code as a framed picture), and children's toys go in the left corner in place of the desk chair. CB4 is redone **straight on**, the same scene without looking down. Round 2 prompts: the bottom of `docs/chatgpt-art-prompts-clinic-v1.md`.

- **Backgrounds approved (29 Sept, ~17:15):** CB1b, CB2b, CB3b, CB5 and CB6b pass their checks (CB6b already shows an empty frame on the right wall for the certificate). CB4c (the pharmacy belt, no hatches) is to come.

- **Overlay check (29 Sept, after Zafar asked about room for dangling feet):** the real sitting poses on CB2b and CB1b (`build/reports/clinic-bg-check/`). The bed has room: at about half the screen height, the feet land on the step stool, with space for the doctor on the right. Six fit the bench with feet on the floor; an adult under the heart poster just touches its frame, so seat a child there or scale adults slightly (code). Both approved.

- **CB6b approved** (the placement plan is in the design sheets: limbs on the paper strip, heads against the wall, extra blur in code). The clinic's backgrounds are done apart from CB4c.

## 10. Art: the backgrounds first (ChatGPT; the page is `docs/chatgpt-art-prompts-clinic-v1.md`)
Six backgrounds, built to the recommended answers:
- CB1 the waiting room, wider;
- CB2 the exam room with the bed;
- CB3 the exam room's poster wall;
- CB4 the pharmacy counter at 45°;
- CB5 the front door;
- CB6 the close-up bed for the heal games.

All in today's clinic palette, empty of people (the people are placed on top). If Zafar answers CQ1, CQ3 or CQ4 differently, the page is edited before it's pasted. **Characters and medical items wait until the prototypes are approved** (the token plan).

## 11. The plan, with a token budget
**The principle (Zafar's):** good backgrounds first, then the mechanics on them with simple stand-in pieces, then judge, then commission the art. No overnight fan-outs, no full re-shoots while iterating.

| Step | What | Who / cost |
|---|---|---|
| 0 | This report; the answers to CQ1–CQ18; the background prompts | Done here (cheap) |
| 1 | Zafar pastes the six backgrounds into Claude in Chrome | Free (ChatGPT) |
| 2 | **One design sheet per changed game**, written in this chat (tooth, taste, eye, foot, knee, cut, boing, fever, waiting room, send-off): exact steps, levels, lines, words for Mum. Sessions then build, not research | Cheap: one pass, here |
| 3 | **Prototype session A:** waiting room, diagnosis, pharmacy and send-off on the new backgrounds with stand-in pieces, plus the shared clinic fixes (G5 help, G6 ticks, G7 skip, G8 fever bug, G9 *na*, the patient card from Cook's shared UI) | One top-model session; laptop shots only |
| 4 | **Prototype session B:** the heal games (cut, knee, ear, tooth, taste, eye, foot, fever, boing) on the close-up background, with stand-in pieces | One top-model session, in parallel with A (separate files) |
| 5 | **Zafar plays the prototypes** and notes what to change | One short iteration round (the same sessions if still open) |
| 6 | **Art:** one ChatGPT page for the approved games only (doctor and patient poses, the 45° medical items, close-ups) | Free (ChatGPT), cut by one session |
| 7 | **Art in and polish:** VISUAL-QA §5 at the end only (laptop and phone), one push to `main` | One or two sessions |

About **4–5 build sessions in all**, against about 11 for the Cook overnight run. Cheaper tiers for the purely mechanical parts (data, wiring, tests). Target: steps 1–5 before the doctor's visit (~9 Oct), and Section G ready for him to record.

---

## 12. Coverage check (every line of both transcripts → an item)
**Part 1:** 0:00–0:25 W1 · 0:25 W2 · 0:35–1:44 W3 · 1:46–2:02 W1/G1 · 2:06–2:12 W2 · 2:15–3:23 W4/G4 · 3:24–4:59 W5 · 5:04–5:38 D1 · 5:46–5:51 D2/G9 · 5:51–7:15 D3/G1 · 7:19–7:46 D4 · 7:46–8:40 D5 · 8:44–8:53 D4 · 8:53–9:22 D6/§1 · 9:26–11:08 P1/P2/P3 · 11:08–12:14 P4 · 12:20–12:32 E1 · 12:36–13:37 E2 · 13:36–13:47 E2 · 13:49–14:05 E3 · 14:05–14:50 G11 · 14:50–15:30 E4 · 15:30–15:52 E4 · 15:51–16:21 G3 · 16:21–17:20 E5 · 17:24–20:49 H-cut · 20:55–21:26 H-knee · 21:26–22:32 H-knee (bandage) · 22:32 G12 · 22:40–23:07 H-knee (L3) · 23:07–24:03 H-ear/G2 · 24:03–24:20 (recording note).

**Part 2:** 0:00–1:20 H-tooth (brush) · 1:20–2:25 H-tooth (bug)/G6 · 2:30–4:44 H-tooth (drill, filling) · 4:45–7:25 H-taste · 7:30–8:42 H-fever/G7/G8 · 8:46–8:58 H-fever · 9:06–10:27 H-boing · 10:27–12:15 H-eye · 12:15–14:23 H-eye (the test)/G5 · 14:23–15:48 H-foot · 15:48–16:02 H-fever/H-foot (koso, nokoso) · 16:02–17:34 H-foot (splinters) · 17:34–18:11 G10.

## 13. After the v2 prototypes (29 Sept, evening): Zafar's answers to prototype B's questions
- **The pharmacy tray feeds the heal game.** The pharmacy asks for the items the heal game will use (all of them, or some of them). Every item is needed in the heal game, so nothing is greyed out there: a wrong or missing pick costs **score** (the pharmacy's row and the accuracy badge), and the heal game still plays. The heal games keep their own tool shelf, but it shows what came from the pharmacy.
- **Both feet at level 3** in the splinter game, so "my left foot" is actually tested.
- **Level-1 counts** (fever, foot, drinks, boing): not answered yet; Zafar will judge them in play.
- **Choosing a patient in the waiting room (decided):** the picked person **rises up off the seat** and stays raised; no walk and no slide to the door (the current slide looks cheap). Zafar: better not to attempt a complicated animation and have it look cheap; the game has enough real animations already. This is a general rule too: no new character animations unless they can be done well.
- **The doctor's art is based on Hannah's granddad,** and he's happy with it.

### 13a. Waiting room, from Zafar's play of prototype A (29 Sept, late)
- **W3 "Call them in" leaks (Zafar: it fails the "you don't need to know Kutchi" test).** The card row shows the same sentence as the right pill ("the girl, come"), so a child who knows no Kutchi can match the text to the text. The design said the card shows the **picture** of who to call, not the words. **Fix:** in W3 the card shows the person's round face with no text. The pills are the Kutchi calls, each with its speaker, and the mic comes first. A pill match earns coins, never the voice star. W3 starts at level 2, as designed (it appeared at L1).
- **Higher levels: the doctor's call is heard, not read** (Zafar's idea, Claude agrees). From level 3 the card row is **closed**: the call is only spoken, and tapping the row to see the words is the paid peek (Cook's L4 closed card). Levels 1–2 keep the words showing.
- **Level 4 (two in order, against the comfort rings): pick everyone straight away.** No waiting for each person's greeting or the doctor between picks. Each tick shows its number (1, 2) as it's tapped; once the last one is tapped, the whole set is judged: all right → they lock in and rise; any wrong → the ticks shake and clear, and everyone sits back down to try again.
- The lab's debug log (bottom left) overlaps the pills: it's lab-only, but it should sit clear of the play area.
- **At most 6 people in the waiting room** (Zafar), at every level, counting the babies and children sitting with the grown-ups at level 5.
- **Speaking moves out of the waiting room** (Zafar: you don't naturally call "little boy, next"). W3 "Call them in" is dropped in the clinic fix session unless Zafar says otherwise; the clinic's speaking goes into the patient conversation (E4), the pharmacy ask and the send-off. See `docs/design/speaking-more-proposal.md`.

### 13b. Pharmacy, from Zafar's play of prototype A (29 Sept, late)
- **The doctor orders, so the card says "bring me", not "I want".** The row reads *Muke plaster khape* (a customer's "I want"). It should be the doctor's request: **"[Bring me] the plaster"**. The Kutchi for "bring me" is still to confirm with Mum (Cook Q5 item 8, "bring me these", is the same ask), so it stays an English placeholder flagged "to record". Never invent it.
- **A filled slot loses its dashed outline**, like the pantry's tray: once an item is in a slot, the cut-out box disappears.
- **Tap a placed item to put it back** (a misclick). The first pick is what's scored: a wrong item put back still counts as a mistake in the review (the score penalty), so undo can't be used to fish for the tick.
- **Items don't sit on the belt** (they float or tilt). That's the stand-in art: the real item art needs a flat base and a contact shadow on the belt.
- Seen in the same shot: the green button at the bottom right ("To the bench"?) is cut off by the frame's right edge, and the lab's debug log overlaps the counter.
- Otherwise good (Zafar).

### 13c. The clinic's card becomes Cook's order card, properly (Zafar asked, 29 Sept)
Prototype A only borrowed the order card's **look** (its CSS classes and the gold check) and kept the clinic's own card code. The clinic fix session switches the clinic to the shared `OrderCard` (`js/shared/order-card.js`, shared-api §14; its data is mode-agnostic), so every clinic card behaves exactly like Cook's:
- **ordered jobs** show the sequence line, with the next step in a light grey band: the pharmacy's *pela … ne poi …*, the waiting room's two-in-order (L4), and each heal game's steps (wash → dab → plasters);
- rows tick when their step closes, and a wrong pick marks its row in the review only;
- the **read-along underline** runs as each line is spoken;
- the **closed card and the paid peek** at the higher levels (the waiting room from L3, as decided in 13a);
- counts follow Cook's rule (Q7: written and heard at L1, written at L2, heard only from L3);
- Nani's box on top, one card per person (the patient's card, the doctor's request).

### 13d. Send-off layout (Zafar, 29 Sept, late)
- **The doctor and the patient stand on the left**, in the free wall space (not by the door, where the face circle sat on the green cross sign).
- **The feeling cards come in a thought bubble.** After the patient answers ("I feel …"), a thought bubble rises from their head and opens out to the right, holding the four face cards (happy, sad, hot, cold). The child taps the one the patient is thinking. This replaces the card tray along the bottom.
- At level 1, the hint that the feeling shows (the design's round face circle) sits on the patient's own face, via their expression once the real art exists. It's never a second face floating beside the bubble.

### 13e. Send-off flow and staging (Zafar, 29 Sept, late)
- **No doctor card listing every line up front.** At the send-off the doctor's card showed all his lines at once ("Is everything okay now?", "What will help?", "Say thank you to the doctor."), and he said them again at each step. Drop that: **maybe no card at all here**. If a card shows, it holds only the current need, never the whole script.
- **The flow follows on from level 1:** the patient says how they feel (the thought bubble of 13d at L1–2). From level 3, a **tray along the bottom of the screen** holds the items the doctor can give (blanket, fan, apple, …), and the child picks the one that fixes it.
- **Staging (a general rule; UX-PRINCIPLES §16):** while the doctor and patient talk, they stand three-quarter turned to each other and partly to the front, like actors on a stage. When it's the child's turn to act, they **turn to face the player**. That turn is the "your turn" cue.

### 13f. End of Zafar's play of the prototypes (29 Sept, late)
- **Waiting room level 5 needs the earlier fixes:** 6 people at most (13, counting the babies and children on laps), the picked person rises off the seat (13), the closed card from L3 (13a), and no W3 (13 speaking note).
- **Send-off level 3: the help items and the reply pills sat on top of each other.** Reply pills only appear when a reply is actually needed, and never overlap the item tray (13e).
- **Stale UI between rounds:** in E2 level 1 (which Zafar likes), the reply pills from an earlier round were still on screen, unused, until a page refresh. Every stage must clear its own UI when it ends.
- **No Nani box in the clinic** (Zafar): Nani isn't there, so **the doctor fills her guidance role**. The guide box at the top of the sidebar becomes the doctor's box (his face, his line, the replay, the bulb). Nani's box only comes back if a story has her come with you.
- **Zafar: "fix the rest of this game mode based on the previous feedback."** The clinic fix session carries out 13–13f, plus the heal-game answers in 13 (the tray feeds the heal game, both feet at L3). Level-1 counts (B's question 3) stay as built for now.

### 13g. The heal games' first-time help breaks UX §8 (Zafar, 29 Sept, late)
Prototype B replaced the shared onboarding kit's ghost finger with **English sentences in bubbles, read by the device voice** ("Tap the water, then tap the scrape.", "Tap the cloth, then dab the scrape. Count the dabs you're told."). It named that as a departure in its report, and it wasn't flagged to Zafar. It breaks **UX §8 (onboarding by showing, not telling)** and §10 (one shared onboarding kit). Fix:
- **Back onto the shared onboarding kit** (`js/shared/onboard.js`): dim everything except the one thing, the **ghost finger does the action once** (tap the water, tap the scrape; the dab count shown by the finger dabbing), the child does it, then the next thing is revealed. No English sentences, and no device voice.
- **What the child hears is the Kutchi instruction** (the doctor's line, a recorded clip or a flagged placeholder) with the card's read-along. That is the only "words" in the help.
- **The "why" beat** (the patient's problem, the doctor's goal) is shown, not told: the patient's pained face and the scrape, then the doctor's line. No English caption.
- The English goal for grown-ups lives only in the "?" pop, as in Cook.
- **`build/check_onboard.mjs` enforces the opposite of what it checks now:** a heal game fails if its first-time help shows child-facing English text or uses the device voice, and passes when every kind of step has a ghost-finger demo (a move the kit can show: tap, swipe, drag, hold) on its target.

### 13h. Scrape again, and an audit of every clinic game (Zafar, 29 Sept, late)
- **No way to take a plaster off before finishing.** Same as the pharmacy (13b): a placed plaster (or any placed thing) can be tapped to take it back until the step is committed. The first placement is what's scored. This is now a general rule (UX-PRINCIPLES §17).
- **The sequence card isn't there.** The scrape's plaster order ("*pela* red and yellow, *ne poi* blue and green, *ne poi* …") must show on the shared order card as a **sequence**: the sequence line, the next step in the grey band, each part ticking as it's done (13c). Today the heal game's rows sit on the old clinic card with no sequence.
- **Audit every clinic game against these rules**, not just the scrape: the waiting room, diagnosis D1–D3, the pharmacy, all nine heal games (scrape, knee, ear, tooth, drinks, fever, boing, eye, foot; and tummy, hic and hair) and the send-off. For each, the fix session reports a row in a table:
  1. **First-time help:** ghost finger on the shared kit, no child-facing English, no device voice (13g, UX §8)?
  2. **Take back before Done:** can a placed or chosen thing be undone until commit (UX §17)?
  3. **Sequences on the card:** is every ordered instruction a sequence on the shared order card (13c)?
  4. **Stale UI:** does it clear its own UI at the end (13f)?
  5. **Done / Next:** does it use the shared buttons (UX §15)?

  Then it fixes every "no", and says why for any it can't.

### 13i. Knee (bandage) game and waiting on instructions (Zafar, 29 Sept, late)
- **The heal game's "why" explainer only plays in the lab.** In a normal run the patient has already said what's wrong at the diagnosis, so the heal game starts straight in. Standalone or lab play keeps the short beat.
- **The bandage game is fun: keep it.** It's not very educational, but there are plenty of other chances to learn numbers.
  - **Stop the flashing when you're done:** once the last turn is wrapped, no dot flashes.
  - **The bandage doesn't show on every tap** (a bug): every right tap must draw its turn of the bandage.
  - **At the top level the named leg isn't highlighted.** It still glows while "left knee" is said; by then the child should know it from the word alone.
- **Never make the child wait for the talking to finish (the whole clinic).** In several games nothing can be tapped until the spoken instructions end. Input is live from the start. The instruction can still be replayed, and a tap during it simply goes ahead.

### 13j. Ear wax (Zafar, 29 Sept, late)
- **Level 1 is too hard:** it already uses *wadho / nindho* (big and small). Level 1 has no size words: just take the wax out, with at most a count. Big and small start at level 2.
- **Wax is dragged out, not tapped:** drag each blob from the ear to a set place (a tissue or a dish beside the ear) and let go there. The gesture is the same at every level (UX §12).
- **The wax that pops up (the higher levels) never goes away by itself.** Today a new blob slips back and disappears on its own, so the child can ignore it. Instead the new blobs keep coming and **stay until the child drags each one out**. The round ends when the ear is clear (with the level's pop-up time or count as its limit).

### 13k. Tooth, and the plan for the rest (Zafar, 29 Sept, late)
- **Tooth (brush, drill, fill) is good.** It only needs the usual fixes: the voice-overs (13g), input live from the start (13i), and the sidebar (the doctor's box and the shared order card, 13c/13f).
- **Zafar reviews the other heal games tomorrow** (drinks, fever, boing, eye, foot). Before then, **a first pass applies everything learned tonight to all of them**:
  - first-time help on the ghost finger with no English;
  - input never waits for speech;
  - take back until Done;
  - ordered instructions as sequences on the shared card;
  - level 1 without the harder describing words (big/small, sides) where a game front-loads them (13j);
  - no highlight on what the words should tell at the top level (13i);
  - effects that stop when the job is done (13i);
  - each game clears its own UI;
  - the doctor's box.

  Tummy, hic and hair stay as they are (CQ14).

### 13l. Answers to the fix session's "Open for Zafar" (30 Sept, morning: "yes to everything for now")
- The knee's flashing stops when done: **keep it**, even though it gives the count away (the leak bots' named exception).
- **Closed cards from L3** in the heal games and the pharmacy too: yes.
- A wrong pharmacy item is swapped before the heal game (the pharmacy's row still costs): yes.
- **The clinic's end screen also offers "Again" (the same patient) and "All patients"**, like Cook.
