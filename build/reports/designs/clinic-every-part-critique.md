# Critique: the clinic, every part treatable (`clinic-every-part.md`)

Independent critic, 1 Nov 2026. I did not write the design. Judged against the lessons checklist (1 Nov), `/game-mode-design`, the two 31 Oct research reports, the audit of our games, the master map with Zafar's 1 Nov answers, and CLAUDE.md. Flaws first; MUST before SHOULD. Evidence is cited to the file and line or section I checked.

**What I checked outside the design:** `data/clinic/pipeline.json` (parts, ailments, days.mix, parked), `data/patients/grey-adult.json` (the figure's hotspots and `closeup`), `js/clinic/stages/diagnosis.js` (the magnifier, sides), `js/clinic/heal/games/{cut,knee,ear,eye,taste,tummy}.js`, `data/rules.json` (`heal-cut`, `heal-foot`), `data/family-audio.json` and `data/lang/lexicon.json` for every Kutchi word the design marks, `docs/game-design/cast.md`, `docs/game-design/speaking.md`, `docs/game-design/rulebook.md` §3, `docs/game-design/modes/clinic.md`.

**What I could not check:** the family's actual Kutchi for the health words (whether "toothache" is a word or "tooth hurts"); nothing was played.

---

## The findings

### 1. MUST: the recording budget is under-counted by about half, and the engine's frame gaps aren't reported

- **Place:** §1 "Mum first" and §1 "Frames"; §10 decision 25 ("about 33 clips").
- **Problem:** the design counts the 24 parts, two frames and 7 health words. But every patient line and doctor line it quotes is a full sentence that must be built by the engine from recorded phrases (non-negotiable 2), and most of them are new frames the engine does not have. Lessons §10: "list every line needed". NN2: "if the engine can't say it, report the gap." The design reports the verb gaps (show, fall, drink) but not the frames.
- **Evidence:** `data/clinic/pipeline.json` lines 135-137 hold only `[Where does it hurt?]`, `[My {part} hurts]`, `[My {side} {part}]`. Not in the engine, each needed by a deciding row: "My {part} and my {part} hurt" (3A L2), "I've got a {cough/cold/headache/fever}" (3A L3), "Clean the one on the {part} first, then the {part}" (3B L3), "Make the drink for her {cough/tummy}" (3E L3), "{n} drops on the {side} side" and "two on the left, one on the right" (3D L3-L4), "the top tooth", "the forehead / under the arm" (3F), "first the big one, in the thumb" (3C L3) and the four finger names. Plus the story and reaction lines: "I fell over (in Nani's garden)", "I was picking up sticks", "I ate too much at the birthday party", "I danced all afternoon…", "My nose is blocked", "Some drops, then we'll wipe it", "Let's clean it and put a plaster on", "Let's take the splinters out", "Thank you, I feel better", "that tickles", "excuse me". That is roughly 25 sentences on top of some 30 words (parts, health words, blue, yellow, plaster, tissue, cream, honey, bandage, splinter, fingers): 55-60 clips, not 33.
- **Also:** Zafar, 14 Oct (`cast.md` line 193): **the doctor voices his own lines.** "Where does it hurt?", "First …, then …", "Clean the one on the elbow first", "Make the drink for…", "Careful" are the doctor's recording, not Mum's. The design puts "where does it hurt?" on Mum's list.
- **Change:** one table of every line, split into Mum's (patients' lines, the parts, the health words) and the doctor's (his asks), each marked exists / frame missing / to record, with the count. Report the missing frames to Zafar as gaps, and say which levels are playable with today's frames (L1-L2 of the chart and the cut game are; every L3 "other way of saying it" is not).

### 2. MUST: the face parts at L2 can't be tapped on a 275 px body; the design's own zoom rule stops at L4

- **Place:** §3A levels (L2 adds eye, nose, mouth, tooth on the body); §7 layout; §10 decision 6.
- **Problem:** decision 6 says small parts "can't be tapped at 275 px tall" and sends finger, thumb, toe, ankle, cheek and chin to the zoom at L4. But eye, nose, mouth and tooth join at L2 as direct taps. At 915x275 the seated patient fills about 275 px, so the head is 50-60 px tall: five face parts (eye, nose, mouth, tooth, ear) in 60 px cannot each have the 44 px zone §7 promises. Mouth and tooth share one spot. This is the first L2 round on Zafar's own phone failing.
- **Evidence:** `data/patients/grey-adult.json` line 2: "Face parts are only tappable in the close-up (`closeup`), which zooms the same drawing." `js/clinic/stages/diagnosis.js` lines 112-128: D2 already has a magnifier button that zooms the head 2.4x, and `zoom.need` fires for `FACE` parts. The design never mentions this built zoom; it designs a new zoom-to-find at L4 and leaves L2's face parts on the body.
- **Change:** the face is a zoom region from L2, on the built `closeup` (tap the face, the head fills the play area, then tap the part). Say what happens on a wrong region tap (see finding 5). Reuse the magnifier's zoom; drop the magnifier button itself (lessons §6: the cog is the only button on the play screen). Check the tap zones on the lab page at 915x275 before any art.

### 3. MUST: the drinks' L3 leaks at about 17%: two complaints, "which first", is a coin toss

- **Place:** §3E L3 and its leak table ("Eliminating: No"; no L3 odds given).
- **Problem:** at L3 the patient has two complaints and the doctor says which drink first. A child with no Kutchi has 1/2 on the order; the second drink is then forced (elimination). With the L2 spoon count (about 1/3) the blind win is around 17% a round, over the 10% limit (lessons §1; E2P 8). The table computes odds for every other game and skips this one.
- **Evidence:** §3E "The patient has two complaints, and the doctor says which first"; the lessons' bot rule is "must win under 10% of rounds".
- **Change:** three remedies in play at L3 (tummy, cough, throat) with two asked in order (1/3 × 1/2 = 1/6, then the count), or one complaint named by its why word among three possible drinks with the count (1/3 × 1/3). Add the L3 row to the leak bot (`build/leak_clinic.mjs`) and write the number in the table. Keep `taste.js`'s four drinks (line 36: four so L1 stays under 10%): the design lists three.

### 4. MUST: the nose's drop count can leak by waiting unless the sneeze's trigger is pinned down

- **Place:** §3D steps 1-2 and the leak table ("Waiting: No").
- **Problem:** step 1 says extra drops aren't stopped and nothing ends by itself; step 2 says "after the drops the nose twitches". If the twitch starts when the count is reached, the picture says when to stop and the count never decides (the exact leak the fever's "just right" had, CLN-176). If it starts when the child picks the tissue, it's clean. The design doesn't say which, and §3D's lessons line "the sneeze waits until the drops are still" reads as the first.
- **Evidence:** §3D; lessons §4 "A light waits until everything is still"; §5 "Rows tick when the step closes, not when a count is reached".
- **Change:** write it as a rule for the builder: the drops row closes only when the child taps the tissue box (the next item), as the cut game's rows do (`cut.js` line 14); the twitch and build-up start on that tap, never on the count. Same sentence for the cut game's cream (it's already right there) and the hand's jugs (the foot's one-dirt-per-jug rule is Zafar's, 29-30 Oct, and stays).

### 5. MUST: design questions left for the builder (lessons §13), in the stage the sprint depends on

- **Place:** §3A, §3B, §3E, §4, §6.
- **Problem:** the following are undecided and each changes code and data:
  1. **The chart's zoom:** "Hands, feet and face are tapped to zoom in" (every level) but "From L4, a second tap picks the small part". At L1-L3, does tapping the hand zoom and then need a second tap, or is it the answer (§4 step 4 says it's the answer)? If the line is "my toe hurts" at L4 and the child taps the hand, does it zoom (telling them they're in the wrong region: a two-stage elimination with feedback), giggle, or both? The delight line conflates the chart's find-zoom with the heal game's D1 zoom.
  2. **The chart's L2 two-part line:** "tap both, in any order", then which heal game follows, and what does the pharmacy ask for? §5 puts two cures in a row at L4 only.
  3. **The cut game's dab gesture:** "Tap the tube, then tap the scrape, N times": tube once then N scrape taps, or tube-then-scrape N times?
  4. **The chart's parts data is shared by D1 and D3.** Moving finger and toe to L4 and adding nose, cheek, chin, ankle, tongue, throat changes the check-up's pool and each tool's `finds` list (`pipeline.json` lines 70-73). Nothing is said about D1 or D3.
  5. **The first round in §4 replaces session 2's ear patient with the hand** (`pipeline.json` line 198: `["knee-bump", "seed-in-ear"]`). That is a `days.mix` change not in §6's build list, and it removes the ear from the second session (NN1: say so, or add the hand as a third session).
- **Change:** answer each in the design (decisions for Zafar where they're his), and add the `days.mix` and D3 `finds` changes to §6.

### 6. MUST: the sprint is two or three sprints, not one; name the one playable goal

- **Place:** §0 "Rough size: medium, one sprint"; §6 "New to build" (ten items); §7 (six pictures, about ten items).
- **Problem:** CLAUDE.md: a sprint is one to three days with one playable goal, at most two builders, one per game area. §6 lists chart data plus the no-clue rule, a reworked cut game on four different close-ups (arm, knee, side-on head, face), a hand variant of foot.js, a brand-new nose game with a timed catch, a drinks variant of taste.js, L3 words in five live games, Ali's teddy (a new scene on the speaking pattern, which has no pilot yet: `speaking.md` §"The pilot": "nothing else is built yet"), a check, leak-bot rows, and an art run that waits on the backgrounds. Plus 55-60 clips (finding 1) before any of it teaches. §0 says five pictures, §7 lists six.
- **Change:** Sprint 16's goal in one line, for example: "the chart at L1-L2 with the face zoom, the cut game un-parked on the arm and knee, the hand splinter; the rest designed, not built". Push the nose, the drinks, the teddy, the ankle and the head wrap to the next sprint with their own rows. Write the budget (model, effort, cost) as every launch needs.

### 7. SHOULD: scope beyond Zafar's word, each needing his yes before it's built

- **Place:** §3G Ali's teddy; §1 ankle; §3D the sneeze catch; §5 "second clinic visit: his knee".
- **Problem:** Zafar's 1 Nov scope (the task line) names the chart to ~25 parts, the cut game for hand/finger/elbow/shoulder/neck and a head bandage, the drinks for tummy and cough, the hand splinter, the nose as drops then a tissue to wipe, hair parked, the health half via the why line, careful on the foot and ear, a body or side word at L3, the wedding stories to the birthday. Not in it: a speaking moment (the teddy), the ankle as a new part with a wrap reskin, a timed sneeze catch replacing "wipe", two-part patients at L2. They are in §10 as decisions, which is right, but §0 counts them in the one-sprint size and §6 in the build list as if agreed.
- **Evidence:** master map Part 6 answers; `speaking.md` line 46: the emphasis for speaking goes on Cook and Conversations, the clinic rows are "lighter touches"; its pilot (chai) hasn't run.
- **Change:** mark decisions 3, 16 and 23 as "adds to your scope" rather than "likely yes", and keep them out of the sprint's build list until he answers. The teddy also sits oddly with Ali, "the cousin, tall and lanky" (`cast.md` line 28); Isa, the baby, or a younger patient fits a teddy.

### 8. SHOULD: the knee's "L3 side word" doesn't exist in the game, so the knee gets no body word; decision 20 drops a glow that isn't there

- **Place:** §3F knee row; §10 decision 20.
- **Problem:** the design says the knee's L3 word is "the side, as built" and drops "the glow on the said leg". That is `clinic.md`'s 29 Sept sheet, not the code. In the built knee the side is tested in the diagnosis only and the close-up shows one knee side-on with no side in its rows.
- **Evidence:** `js/clinic/heal/games/knee.js` lines 12 and 83-84: "sides are said and tested in the diagnosis only, so the close-up's rows never name the side"; line 124 is the knee's own glow, not a leg glow. The audit (§1b) calls the knee's leak "weak: blind wins 15-37%", and §5 asks for "a spoken side or a body part per wrap at L3".
- **Change:** give the knee a real L3 word in its own rows: the wrap's place ("above the knee, below the knee", or "the knee, then the ankle" when the ankle joins), or which leg when the close-up shows both. Rewrite decision 20 as "the knee has no side word today; here is the one it gets".

### 9. SHOULD: the ear's and nose's "side-on head" and the neck scratch inherit a code-drawn head

- **Place:** §3B (the neck "on the ear's side-on head"), §3F (the ear's close-up mirrored), §7 "nothing drawn in code".
- **Problem:** the design treats the ear's head as a picture to reuse. It is SVG paths drawn in code.
- **Evidence:** `js/clinic/heal/games/ear.js` lines 3 and 132-143 ("A PROTOTYPE close-up… drawn in the patient's own colours"; `s("path", …)` for the head, hair, ear). Lessons §7: "Draw nothing in code (food, liquids, limbs, tools)". The design also omits from its art list the things that will otherwise be drawn in code: the splash, the grit specks' fizz, the cream sparkle, the half-faded scrape (a second state of the scrape art), the plaster's peeled backing, the head bandage wrapped, the sneeze's cotton flurry, the falling drop.
- **Change:** add a side-on head (the girl, then the boy) to the paste block, shared by the ear and the neck; list every effect as sprite states or short frame sets in §7 "Items". Reuse first: the eye game already has a front-on face close-up of the girl (`eye.js` lines 5 and 136, the s08c close-up), so picture #3 may be a redo of that, not a new face.

### 10. SHOULD: "Found it" ticks after fishing, so the chart's reward doesn't follow the word

- **Place:** §3A fun ("The right tap gets an 'ow!', a soft red glow and Found it") and §4 step 4.
- **Problem:** every part stays live and misses are fun, which is right (NN7), but the gold tick, the "ow", the glow and the zoom come after any number of misses. Lessons §1: "Ticks mustn't let a child fish… Tick only the right item, first go." The design's own leak answer is "only a first-try tap moves a word's ladder", which is the tracker, not what the child sees.
- **Change:** the first-try find gets the gold tick and the "ow… found it"; a find after misses gets the plain tick and the zoom (progress, not a verdict), as D5 does in the heal games (L2+ gold at the step's close). Say it in the design so the review and the end screen read the same.

### 11. SHOULD: the nose's timed catch replaces Zafar's "tissue to wipe"; keep the wipe, make the sneeze a reaction

- **Place:** §3D step 2; §10 decision 16.
- **Problem:** Zafar (1 Nov): "drops to dissolve it, then a tissue to wipe." The design turns the tissue step into a catch-in-time with a build-up timer; the wipe itself ("the tissue only wipes the outside") is never a step. The research's sneeze is a delight to borrow, not a mechanic: "a tickle, a build-up, then atchoo blows things off the table" (other-games §16). The mechanics research warns speed and listening fight each other and Studycat removed timers from children's games (finding 4). It's also the one row in the game with no word (the design admits "a skill row, no words").
- **Change:** step 2 is the wipe: tap the tissue, then the nose (tap, then tap), the patient blows with a comic honk; the sneeze is the reaction when the drops are done and the tissue arrives (always caught, the flurry if the child dawdles, nothing lost). If Zafar wants the catch, keep it as decision 16 with "this adds a timer to the clinic" said plainly, timing in `rules.json`.

### 12. SHOULD: the L3 "why-only" rung may collapse for toothache, earache and tummy ache

- **Place:** §3A L3; §1 "The health half".
- **Problem:** "I've got a toothache → the tooth" is only "another way of saying it" if Kutchi has a separate word. If the family says "my tooth hurts" (dant dukhe), the why line is the L1 line again, and the design's health half shrinks to cough, cold and fever. The design marks all seven "to record" without asking.
- **Change:** add to Mum's sheet: how the family says a headache, toothache, earache, tummy ache; keep cough, cold and fever as the certain why-only words, and let the other three be whatever she gives.

### 13. SHOULD: the prompts would produce muddled screens and show the clues the design bans

- **Place:** §11.
- **Problem, by prompt:**
  - **1 (the chart):** an eye-level patient with "a rounded inset bubble" showing the hand top-down is two cameras in one picture (art bible §3: one camera per scene) and draws UI into the art. The references are Cook's kitchen (`assets/cook/bg/service.jpg`) and Cook's sheets for a clinic exam room, when the clinic's own backgrounds exist (`sources/art/clinic-v2/cb2b-exam-bed-close-v1.png`) and the girl's and doctor's art is approved. Lessons §7: the backgrounds locked first.
  - **3 (the nose):** the dropper with a falling drop, the tissue in front of the nose, the sneeze build-up and the cotton flurry all at once: two steps in one frame, and the sneeze is shown mid-drop, which the safety rule (decision 15) avoids.
  - **4 (the drinks):** "one hand resting on her chest and a small comic cough puff at her mouth" is exactly the clue §3E's leak table removes ("the pose stays neutral"). And "a drop of honey falling" plus "steam from the stir" is two moments.
  - **5 (the hand):** "being drawn out carefully" names no tool, so the image may add tweezers or a hand (the game uses a drag, no tool).
  - **All five:** fine on text (none), on real people (none named; the doctor is described, not named). 2 and 4 ask for 3:1 for 915x275 only; the lab also needs 740x320 and 930x430 (lessons §6; the design's §7 omits 930x430).
- **Change:** one moment per picture; drop the inset in 1 (the glow alone, or a second picture of the hand close-up); 3 shows the tissue arriving with the dropper back on the tray; 4 shows the neutral patient and the counter; name the gesture in 5 ("no tool: the splinter slides along its channel"); attach the clinic backgrounds and the approved patient sheets, not Cook's.

### 14. SHOULD: small corrections to the words and to Zafar's record

- *ha* (§1 frames, §3A delight) is spelt *haa* everywhere in the repo (`pipeline.json` lines 128, 139); Zafar confirms spellings (NN2).
- *jamni* exists only as a she-form (`lexicon.json` line 8698, "jamni baju"); the tooth sheet in `clinic.md` writes *jamno*. Check the form Mum gives before "two drops on the right side" is built.
- *garam*: `clinic.md` H-fever says the family may say *koso*, and *garam* may be Gujarati; the design marks *garam* ✓ recorded. It has two family takes, so say which voice and keep the *koso* question open.
- Hair (§1) is listed under "kept off the chart until each has a cure" with "stays parked (Zafar: yes)": right. But hair's parts are still in `js/clinic/figure.js` hotspots; the check in §6 item 9 should cover D3's calls too, or D3 can still say a part with no cure.
- §3G "a pill tap counts the same" contradicts `speaking.md` ("the fallback is the pills: they earn no speaking bonus").
- Decision 19 reverses Zafar's 14 Oct ear ruling (the side at L4) on his 1 Nov word: right under "newest wins", but write "this reverses your 14 Oct ear decision" so he sees it.

### 15. SHOULD: the stethoscope on the chest and the drinks' close-up

- **Place:** §3E, prompt 4.
- **Problem:** the design and prompt put a six-year-old girl, hand on chest, with the stethoscope step. Clothed, so NN9 is met, but the boy is the natural chest patient and the girl the tummy one, and it costs nothing.
- **Change:** the cough patient is the boy; the tummy patient either.

---

## What's good (so it isn't lost)

The no-clue body (gaze, hands in the lap, no mark until tapped) is the right fix and comes straight from the research. Look-alike scrapes picked by the body word turns CLN-172's "nothing to do" into a listening game cheaply. The one tray for every cure answers the "tool gives the action away" leak. Moving the drinks' listen step after the drink at L3 is a sharp catch. Decisions are numbered and answerable. The first round is written step by step. The leak tables are mostly honest about L1 allowances.

---

## Verdict

The design is the right shape (extend D2, un-park the scrape, reskin foot and taste, one tray, no clue on the body) and it keeps every one of Zafar's 1 Nov answers. It is not ready to brief: its recording list is half the real one and hides the engine's missing frames, which decides when any of it teaches; its L2 chart fails on a 275 px phone because it ignores the face zoom the code already has; the drinks' L3 leaks at a coin toss; the nose's count can leak by waiting unless the sneeze's trigger is written down; and five builder questions sit in the stage the whole sprint rests on. It is also two or three sprints dressed as one, with a speaking moment, an ankle and a timed catch that Zafar hasn't asked for mixed in with what he has. Fix findings 1-6, cut the sprint to one playable goal, and it becomes a strong Sprint 16; the rest are a morning's edits.
