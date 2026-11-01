# Critique: The wake-up clock (1 Nov 2026)

An independent read of `build/reports/designs/wake-up-clock.md` against the lessons checklist, the design method, the two 31 Oct research reports, the audit, the two maps with Zafar's answers, the rulebook, `data/rules.json` and CLAUDE.md. Flaws first, the most serious at the top. MUST means the design doesn't go to Zafar or a lab page as it stands; SHOULD means fix it in the next pass.

## Findings

### 1. MUST: the whole game stands on one unasked question (does the family say the time in Kutchi at all?)

**Place:** §1 the deciding words; §10 open question 1.
**Problem:** The design admits the biggest risk is that the family says "seven o'clock" in English, and that 0 of the 12 deciding words are recorded alone, 7 of them (five to ten) are class-handout drafts Mum has never confirmed, and the hour form ("___ o'clock") is unknown. If the family says times in English, there is no deciding Kutchi word, and §3's "does the Kutchi decide? 5/5" is wrong: the game teaches a frame and a part of day only. Yet the design puts four ChatGPT mock-ups, an art run (18 poses, two backgrounds, digit sprites) and a lab page ahead of that answer.
**Evidence:** lessons §1 "name the deciding words and how many Mum has recorded" (AUD flaw 2: a reader wins on English placeholders); lessons §10 "Mum's voice is the budget"; master map Part 5 row 15 "Mum first: the times"; the lexicon marks num.5 to num.10 `status: draft`, src "never confirmed by Mum".
**Change:** One voice note to Mum before any art or lab work: "How do you say 'wake me at seven'? And six, eight, nine?" Gate the art run and the lab page on her answer. The mock-ups can go ahead only if Zafar wants to see the scene regardless.

### 2. MUST: the level-up and the un-blur let a reader climb to L4 by reading digits

**Place:** §3 the leak test, "From L2" column; §3 level up; §10 decisions 9 and 12; §9 group 1.
**Problem:** From L2 the eye un-blurs a card *and its bedside alarm*, which is the complete answer (the digits to match against the wall clock). The design says a peeked wake "never moves the ladder", but the central rules (`data/rules.json` `advance`) move a child up after 3 consecutive finished rounds with at most one *guide hint*; the eye, the dots and the bulb explicitly never count. So a child with no Kutchi peeks all three cards every round, matches digits, finishes every round, and levels up to L3 and L4 by reading. The design's own level-up sentence ("after 3 rounds at a level with at most one bulb a round" and "only right wakes move ... the level-up") is a different rule from the central file, and nothing says which wins or that it is an override written in the game's row.
**Evidence:** rulebook §1 "Moving up a level ... the guide's hint came at most once"; rules.json `advance._about` "a peek at the dots or the eye ... and the bulb never count"; lessons §9 "rules are coded, not just written"; non-negotiable 4.
**Change:** Write the override in the game's row and code it: a round counts towards level-up only if all three wakes were right (first tap, no peek). Or the eye un-blurs the *card's* digits for 2 s and never the bedside alarm, so the wall-clock match must be made from memory of a number heard. Pick one; the first is simpler and reuses the kit.

### 3. MUST: a timed guide hint would hand over the next sleeper (waiting wins)

**Place:** §6 "bulb.js: the helper card (the next sleeper, their digits, Kutchi and English)"; §9 group 4 "hints are the bulb (child's choice) rather than timed hints".
**Problem:** The central rules give every game a timed guide hint (7, 9, 11, 13 s from the last action), and the helper card holds the full answer. The design wants no timed hint but doesn't say how: `hintS` is per level for every game, with no per-game switch named. If the clock is held (a speaker tap holds it; the hold has no limit) and the child waits 9 s, the helper card opens with the next sleeper and their digits. That is waiting's win, and it settles the one "open need the picture can't settle" (who is next).
**Evidence:** rulebook §1 "the guide's hint"; rules.json `levels.hintS`; lessons §3 "the guide names the next item only when her helper card opens with the full answer"; lessons §1 "show a need the picture can't settle".
**Change:** State an override in the row (timed hints off for this game; the bulb only), add the per-game switch to `rules.json` as part of the build, and cap the speaker hold (the clock resumes when the line ends, as written, and a replay never restarts the hint clock). The helper card should name the next sleeper by face and Kutchi, never with digits from L2.

### 4. MUST: two contradictions inside the design that a builder would have to guess at

**Place:** §3 step 5 and decision 6 ("tap the wall clock to hurry on") against §7 "The wall clock is in the scene and isn't a button" and the phone layout ("is also a tap target"); §3 counting against `rules.json` `skip` (a tap in the play area during a line skips it and "lands the order").
**Problem:** The clock is both a button and not a button. And a bed tap during Nani's "it's five o'clock" is either a skip of the line or a wake, and the design doesn't say; the kit says a play-area tap skips. A child who taps Ali the moment the clock pauses (the natural move) must get the wake, not a skipped line.
**Evidence:** lessons §13 "design questions left open for the builder"; rules.json `skip._about`; lessons §4 "a tap during speech is never lost".
**Change:** Decide: the clock is a tap target (then show it once in the first round, lit, as the "hurry" control) or it isn't (then cut the hurry tap and shorten the empty hours, finding 7). Write that a bed tap during any line is a wake (and the line stops), and that only the speech bubble and side panel never skip.

### 5. MUST: L4's look-alike pairs are built on draft, unconfirmed numbers, one probably wrong

**Place:** §3 L4 row "one look-alike pair of sounds (seven and eight, or nine and ten in the repo's drafts)"; §3 speaking "never *sat* with *ath*".
**Problem:** *sat*, *ath*, *no* and *do* are class-handout drafts. *do* for ten is suspect (it is Hindi and Urdu for two; the handout's *hikdo* for one was already overturned by Mum). A level whose one added thing is "a look-alike pair" cannot be designed until Mum says what the words are and which ones actually sound alike in her mouth. As written it risks shipping a wrong number as a deciding word, which is inventing Kutchi by omission.
**Evidence:** lexicon num.10 `lemma: do`, `status: draft`; num.1's history ("the handout's hikdo ... superseded"); non-negotiable 2 "two AIs agreeing is not evidence".
**Change:** L4 keeps before and after as its one thing. The look-alike pair is chosen *after* Mum's number round, from her recordings, and goes in data, not the design. Mark *do* as "to confirm; likely *dah*" on her sheet rather than trusting it.

### 6. SHOULD: the clock moves before the door, which reverses the day's shared opening

**Place:** §2, decision 18 ("the clock stage comes before the door ... its last sky is the day's weather").
**Problem:** Every day opens at the door, the sky above the door sets the weather and it follows the day into the window (days README rules 1 and 7, master map Part 7 "every day is the door, ... its games, then the evening book"). The master map's "the clock opens the school day" is a Claude proposal (Part 7, "proposed, 1 Nov"), not Zafar's answer, and "opens" there means first game, not before the door. The design makes the clock's window *produce* the weather and puts a game before the shared opener: a change to the day runner and the door for one day.
**Evidence:** days README §1.1, §1.7; master map Part 7; non-negotiable 6 (the same shared screens in every mode).
**Change:** Keep the door first (Nani at the door, dark sky: "today is school, everyone's asleep"), then the clock takes the day's weather from the door for its last sky. Add it to Zafar's numbered list rather than assume.

### 7. SHOULD: too many empty hours; the hands have nothing to do for most of a round from L2

**Place:** §3 level ladder (L2 "up to 9 hours", L3 "about 13 hours"); §3 step 5 "to move on early ... (for the sure child; never needed)".
**Problem:** Three wakes in 9 pauses at L2 is six 5 s pauses where the right move is "do nothing"; at L3 it's ten 4.3 s pauses. For a 3-5 year old that is 30-45 s of waiting per round, and the only thing to do (tap the clock) is "never needed" and never taught. The lessons say the hands need something at every step; the research says clock apps are drills with a short shelf life.
**Evidence:** lessons §12 "the hands have something to do at every step" (CLN-172); research-other-games §6 and "ours that look weak".
**Change:** Cap empty pauses at about 2-3 a round at every level (L2: 3 wakes in a 5-6 hour stretch). At L3, run the night in two parts with a fixed, always-the-same fast-forward (say 11 pm to 5 am) so the stretch is 7 pm to 10 pm then 5 am to 9 am: the repeated hour still happens, the round stays under 90 s and the skip is never a tell because it never varies. Give the empty hours a small toy (the moon drifts, Simba turns over) so a tap on the window or the cat does something harmless.

### 8. SHOULD: the first-ever round opens on a "nobody" hour

**Place:** §4 step 5.
**Problem:** After three asks, three cards and a goodnight (15-20 s of watching), the first live moment is 5:00 with nobody due. A 3-year-old waiting to do something taps a bed and gets *hever na*. The design calls that "how the child learns not now", but the lesson is "lose them by confusion, not boredom", and the first thing a child does in a new game should work.
**Evidence:** lessons §2 (K1001 §8D); rulebook "showing what to do ... each new action once".
**Change:** In the first-ever round, the clock's first pause is Ali's hour (start the whizz one hour before it). The first "nobody" hour comes after the first wake has been felt.

### 9. SHOULD: one slip spoils two sleepers; the first-tap rule is harsher than the leak needs

**Place:** §3 counting ("and nobody tapped them at a wrong hour earlier"); decision 9.
**Problem:** Tapping Ma by mistake at 7:00 makes Nana's wake not count (the first tap at 7 wasn't his) *and* Ma's later wake not count (she was tapped at a wrong hour). A genuine 4-year-old's motor slip costs two of three, which blocks the word ladder and (finding 2) the level-up, invisibly. The leak this rule guards against (tap every bed every hour) is already beaten by "first tap at their hour": a bot tapping one random bed or nobody at each pause lands the right bed first at about 1 in 4 per sleeper, about 1-2% a round, under the 10% target.
**Evidence:** research-other-games §6 "only a first-tap wake earns the badge"; Zafar's "first tap only"; non-negotiable 7.
**Change:** A sleeper counts when the first tap at their hour is theirs. Drop the "tapped earlier" clause. Run the bot on both rules in the lab page and keep the kinder one if it passes.

### 10. SHOULD: round one carries too many new words, and "o'clock" may not be a word

**Place:** §1 new words per level (L1: 3 hours plus "wake me at", "o'clock", "good morning", "goodnight": "about 5 a round"); §1 "about 20 new words on the first visit".
**Problem:** Round one has 7 new items (3 numbers, a frame, and three fixed phrases), over the 3-5 rule, and the three hours are the only ones that decide. "O'clock" is counted as a word before Mum has said whether Kutchi has one (the design's own open question). Goodnight and good morning are sound, not syllabus.
**Evidence:** lessons §10 "3-5 new words a round, each heard at least 3 times".
**Change:** Count round one as the 3 hours plus the "wake me at" frame. Goodnight and good morning are ambience lines, not counted, not on any card. Drop "o'clock" from the tables until Mum answers.

### 11. SHOULD: the card restyles the kit (face plus digits on one order card)

**Place:** §3 step 1; §6 "digits as the 'picture'"; §7 phones.
**Problem:** The shared order card has one picture slot, the Kutchi and the dotted English. The design wants the sleeper's face *and* the alarm digits *and* the Kutchi on each card. That is a new card shape, which non-negotiable 6 forbids per mode.
**Evidence:** rulebook §1 "the order card"; guide-and-card R1-R2; non-negotiable 6.
**Change:** The picture is the bedside alarm showing the digits (L1) or frosted (from L2). The asker's face is on screen (they sit up and speak) and the row is in bed order, which already says whose card is whose. If a face is needed on the card, ask the shared-layer owner for a small owner badge, used by every game with per-person asks (Cook's cups would want it too).

### 12. SHOULD: phone layout at 915x275 doesn't fit as written

**Place:** §7 phones.
**Problem:** At 275 px tall the design stacks the window strip (top left), the wall clock with 36 px digits (top centre), bubbles "in the free wall space above the heads", faces at 45-60% of the height, and bedside alarms with 18 px digits between beds. Bubbles above three heads and a wall clock in the same 100 px band will cross the clock or each other, and 18 px alarm digits are below any child's reading size, which makes L1's "bedside digits shown" support a fiction on phones.
**Evidence:** lessons §6 "nothing goes over a face; items and faces stay big; take the room from the scenery"; non-negotiable 6 (no clipped text).
**Change:** On phones, the ask bubble goes beside the sitting-up sleeper over the blanket (the bed is the free space), never above the clock. The bedside alarms are decorative from L1 on phones (say so) and the card's digits are the support; or make the alarm digits at least 28 px and drop the window strip into the wall clock as a moon or sun icon (finding 13). Check with a wireframe at 915x275 before the art run.

### 13. SHOULD: the day/night marker belongs on the clocks, not only in the window

**Place:** §3 L3 ("the window's moon or sun settles it"); §7 bedside alarm.
**Problem:** Zafar's design has a day/night window, and the "OK to wake" clocks the design borrows from show it *on the clock* (a moon or sun beside the digits). At L3 the un-blurred bedside alarm can't show "ten at night" versus "ten in the morning", so the eye's help is half an answer, and on phones the window is a slim strip the child may not connect to the time.
**Evidence:** §8 "borrowed: the night and day window beside digital digits"; game-settings map §1 "Time".
**Change:** A small moon or sun sprite in the wall clock's face and on each bedside alarm, lit by the time of day; the window stays as the scene's mood. One extra sprite pair.

### 14. SHOULD: the later visits are scope, not design

**Place:** §5 (the speaking flip, the holiday "no" ask, baby Isa's cot that wakes by itself and cries, half past, the afternoon nap with Big Ma); the art count.
**Problem:** Five visits of new mechanics (a fourth sleeper driven by a cause, a :30 pause, a daylight scene with a moving sun) for a game the research marks weak and the map says needs a lab test first. The cot is a different game (react to an event, not a time). Big Ma's nap needs her sheet in sleepwear. None of it is needed to judge the lab.
**Evidence:** master map Part 5 row 15 "lab test"; research "keep it small"; CLAUDE.md "keep it small"; lessons §13.
**Change:** Move §5 to `docs/ideas.md` as one entry. Keep in the design only what the lab needs: L1-L4 and visit 2's speaking.

### 15. SHOULD: the ticks and the badge contradict the lesson on fishing, and the badge is a verdict

**Place:** §3 counting ("a late or fished wake still ticks the row"; "the accuracy badge").
**Problem:** Lessons §1 says tick only the right item, first go, so a tick never tells a child what to fish for. Here a fished wake ticks. The tick leaks nothing new (the sleeper is visibly up), so it's defensible, but it is an exception that must be written as one. The "accuracy badge" is undefined (the end card has time, ticks and the bulb) and if it shows which wakes were "right" it is a verdict the design elsewhere promises never to show.
**Evidence:** lessons §1 (C1017 P62-63; CHT-14); non-negotiable 7; rulebook "the end card".
**Change:** Write the tick exception in the row. Drop the badge: the word ladder and level-up carry the counting, unseen. The end card shows the ticks and the bulb only.

### 16. SHOULD: reuse missed in the engine and the bot

**Place:** §6 new to build.
**Problem:** `js/shared/whichone.js` already has the blind-odds calculator and generator loop (add a decoy until a no-Kutchi player wins under budget); the leak bot entry should sit on it, not be a new script. `js/shared/window-ride.js` holds the "ask as it comes into view, a miss comes round again, a glow after hesitation" timing pattern and the hold rules; the clock's "pause, hold on a speaker, hurry" should follow its contracts rather than start a new timing model. The clinic's waiting room already does "tap the person called".
**Evidence:** method §2 "mechanics are modular ... reused where they fit"; lessons §13 "an everywhere rule fixed in one game only".
**Change:** Name both in §6 and have the builder read them first; the bot through `WhichOne`'s odds.

### 17. SHOULD: the ChatGPT prompts will mislead Zafar in four small ways

**Place:** §11.
**Problem:** (a) Prompt 1 asks for four different digit readouts; image models garble digits, so the mock-up will likely show wrong times and the design doesn't warn him that the asset run asks for blank faces. (b) "Small motion lines" on the rattling alarm and the quilt are a cartoon marker the art bible rejects; they'd land in the look he approves. (c) Prompt 1 has no "no letter Z for snoring" line (prompt 3 does), so the sleepers will get Zs, which is text. (d) The Nani sheet is attached to prompts 2 and 3 where Nani doesn't appear, which invites her into the scene; and prompt 3 asks for Ma "rolling over towards the wall" while her face reads "peaceful and a little amused": facing the wall hides the face. Also the camera: three faces lying flat on pillows under a front, slightly raised camera read as tops of heads; the design wants them readable.
**Evidence:** art bible §2-3; non-negotiable 3; lessons §7.
**Change:** One line in §11 that the mock-ups' digits are for the eye and the asset run uses blank faces and sprites. Drop motion lines (the tilted clock is enough). Add "no letter Z, no symbols, no speech bubbles" to all four. Attach only the sheets of people in the shot. Sleepers lie on their side facing the camera; Ma's roll-over turns her head away *after* the wave, or she waves without turning. No real people are named, which is right.

### 18. SHOULD: the voice budget is large and the fallback should lead

**Place:** §10 open question 2; §1 frames.
**Problem:** Three sleeper voices times (a frame plus 12 hours), plus Nani's "it's X o'clock" and "X o'clock, get up", is 60-80 clips before any part-of-day or relation line, in voices (Nana, Ma, Ali) the family hasn't cast. The engine splice ("wake me at" plus a number) may not be grammatical if the hour takes a changed form, which the design itself asks.
**Evidence:** lessons §10 "Mum's voice is the budget"; non-negotiable 2.
**Change:** Lead with the fallback: Nani says every ask in Mum's voice ("Ali, at six"), the sleeper only sits up and nods, and the sleepers' own lines come later if Zafar casts them. Ask Mum for the hour form first, then build the frame list from what she says, not before.

### 19. SHOULD: L4's relation is a coin toss as a teaching move

**Place:** §3 L4.
**Problem:** "Wake me after Ali" needs Ali's hour (heard) plus "after". A child who knows the numbers but not before and after guesses one of two adjacent hours: 50% per relation sleeper. The leak test still passes (the other two sleepers are random for a no-Kutchi bot), but the level doesn't make the relation word decide.
**Evidence:** lessons §1 "the heard word decides"; §9 "L4 is its own".
**Change:** Make two of the three asks relational in one round, both anchored on the same sleeper (before Ali, after Ali), so the two words must be told apart; or keep one relation ask and accept that L4's own thing is the look-alike (after finding 5).

## Verdict

The core is right and small: his three beds, a clock that pauses, the heard number against the wall digits from L2, first tap only, late never a verdict, and a wake gag per person that is genuinely funny. The leak test is written out properly and the bot estimate is sound. What stops it going to Zafar as is: it builds art, a lab page and a four-level ladder on 12 words of which none is recorded and seven are unconfirmed drafts (one likely wrong), without first asking Mum whether the family says times in Kutchi at all; the un-blur plus the central level-up rule let a reader climb to L4; a timed helper card would hand over who's next; and two internal contradictions (the clock as a button or not, a bed tap during a line) are left for the builder. Fix those five, trim the empty hours and round one's word count, move §5 to ideas, keep the door first, and it is a good lab candidate.
