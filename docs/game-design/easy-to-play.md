# Easy to play, easy to learn: the plan (Zafar approved, 21 Oct)

## Context

Zafar's testers (his sister with his 3-year-old niece) didn't know what to tap next, even with the pulsing, and a beginner can't learn the words. The game must work as one design for 3-4 year olds with an adult, 7-8 year olds alone, and grandparents who don't play games. He will bend principles to get there.

This plan comes from three inputs, then an independent pass by Fable that was told to challenge both his ideas and mine:
- a codebase map of the labs, days, save and help system;
- a codebase map of the games and rules;
- a literature review: Duolingo, Rosetta Stone, fast mapping, retrieval, fading cues, toddler touch and onboarding research, and language nests.

The farm day waits until Cook and the clinic are right (Zafar, 21 Oct). There are two tracks in parallel:
- **Sprint 10, "Show it":** quick fixes, so he can keep showing people.
- **Sprint 11, "Easy to play, easy to learn":** the experiment. It covers chai with the kitchen conversation, the eye test, toothbrushing and the door, and is tested on real people before it is rolled out.

## Principles (new; where I differ from Zafar's ideas, it says so)

1. **One live thing at a time.** Only the next control can be tapped; the rest is inert (`inert`, as `Lifecycle.request` already does).
   - *Differ:* darkness alone isn't what fixes "where do I tap". Inertness plus a demonstration is. Overlays made tasks feel harder in the NNG studies, and tutorials didn't help simple games (Andersen, CHI 2012).
   - The spotlight is kept for first time and when stuck (his choice). I recommend the existing 62% dim over 80%, so a 3-year-old still sees the scene. That is decision 2.
2. **Show it with the real thing.** The first time an action appears, the actual item does it: the toothbrush slides along its track, the pan lifts to the glass. Then it returns, and the player copies (Zafar, 21 Oct).
   - 2-3 year olds copy a demonstration, not an arrow (toddler touch research). `Onboard.run` gains "move this item" next to its ghost hand.
3. **Three hint rungs on the clock, the same for every age:**
   - at 0 s, a demo the first time;
   - at 5 s idle, spotlight plus the demo replayed (the 5 s spotlight: a rounded box hugging each live control plus a soft round glow from the item itself (Zafar, 22 Oct); several live controls each get their own, never one box round the group);
   - at 15 s, the real item demonstrates again, with the guide's line. It never does the step for them: the critic warned that teaches a 3-year-old to wait.
   - The bulb stays everyone's help, whoever is playing (Zafar, 21 Oct).
   - Evidence: time-delay prompting (AFIRM). This replaces the level-based 7-15 s wait for the "where to tap" hint. Nani's bulb and her own lines keep their timing.
4. **No Next and no ✓ Done anywhere** (Zafar, 22 Oct: "it's so bad we have to drop it"). Every step moves on by itself when complete; a count ends at the right number and an extra tap doesn't land; tap a placed item to take it back until the step moves on.
5. **Tap by default; drag only along a track or for rubbing.**
   - Pick-and-place is tap the thing, then tap the spot.
   - Brushing and wiping is a drag, but the tool starts on the target, or runs in a fixed channel (the toothbrush cross).
   - You never drag a tool across the screen to its place. Evidence: under-5s find taps easiest and drags hard.
   - On a touchscreen, people's instinct is to drag a tool (Zafar, 21 Oct). So the tooth drill keeps its drag, but it **starts in the cavity**, and the cavity is bigger and clearer.
6. **One word card everywhere, four fixed slots:** picture, Kutchi, English, and a speaker that is always there.
   - Slots fade per word, by its progress stage, never by level. A faded slot is a blank with an obvious free reveal.
   - **Fade order (Zafar, 21 Oct): English first, then the picture, then the Kutchi text.** One layout serves pre-readers, who only use picture and sound, and readers, for whom written English is the fastest crutch.
7. **Fade over days, not after 3 showings.** *Differ:* 3 showings gives a foothold, not memory. Reliable recognition takes 6-10 meetings across days, and production takes more (Horst & Samuelson; Childers & Tomasello). The stages:
   - stages 1-2: everything shown;
   - stage 3: English blank;
   - stage 4: picture blank;
   - stage 5: Kutchi text blank, speaker only.
   - Stages already advance only on a Kutchi-only cue (`js/core/progress.js`). A reveal is free but logged as the "picture"/"english" cue, so it never advances the word.
8. **Matching while supported is study, not cheating.** The leak test becomes a progression rule. Elimination is "inert, not harmful" (Mather & Lindsay 2025). The leak bot plays a learned save.
9. **3-5 new words a round, each heard 3+ times in it.**
   - Chai L1 is four words: chai, dudh, khun, paani.
   - Each word is said at the order (its card pops from the guide), at the shelf, and at the pour.
   - Grammar ("Mukhe X khape") comes from many varied orders. It is never explained to children.
10. **Speaking is part of play, not a repeat-after-me pause** (Zafar, 21 Oct). There's no pause after cards. Instead, chosen moments make saying the word the action.
    - Examples: say *haa* or *na* in the eye test; call *chai* to serve the glass; answer in the kitchen conversation, using its existing "speak" rung.
    - They use the existing on-device recogniser, `Speech.listen({choices})` in `js/shared/speech.js` (closed set, family templates, nothing uploaded).
    - A miss is a shrug: the pills or a tap always work too, so speaking is never a gate.
    - Parents support naturally, so there's no grown-up script.
    - The kitchen conversation plays before the order (model, then ask; Zafar, 14 Oct).
11. **Feedback comes when it comes** (Zafar, 21 Oct). There is no testing schedule, and nothing depends on one.
    - A small on-device play log records each step's seconds to first action and taps that did nothing. It turns any ad-hoc play into evidence, and is viewable in the labs.

## Rule changes (orchestrator writes them, after the go)

- **CLAUDE.md rule 5.** Add: "and on a word card while the word is supported (stages 1-2); after that English shows only when tapped (Zafar, 21 Oct)."
- **Rule 6.** "The leak test applies to a player whose words are past support (the leak bot plays a learned save). While a word is supported, matching is study: it never advances the word." Swap words elsewhere to stay within the 900-word limit.
- **`docs/process/mode-design-method.md:141-149`.** The "pictures in the order list" leak applies only after a word's support ends.
- **`build/tools/review/leak.mjs`.** Add a `"save": "learned"` knob as the default (adapters build rows for a child whose words are all at stage 3 or higher). The 10% limit is unchanged.
- **`docs/design-language/ux-principles.md` §8/§15.** Add the hint rungs, the demo with the real item, the tap/drag rule, and "Next is retired".
- **`docs/ideas.md`.** Add the library mode (grammar notes for adults, shown only after 5-10 meetings with a pattern) and the wider conversations.

## Sprint 10, "Show it": one builder (Sonnet, medium effort, about $30-45, overnight)

Files are owned so that nothing overlaps Sprint 11.

1. **Labs tidy (`build/gen_labs.mjs`).**
   - **Top row:**
     - New player;
     - Walkthrough: pantry then chai, through Cook's existing `cook.html?first=pantry` chain into chai;
     - the house;
     - the day builder.
   - **Play any game:**
     - every Cook station and every clinic game, each with a level picker and a play button, like the clinic heal lab Zafar likes (`lab/clinic-heal-host.html`);
     - the door, the ride and the book.
   - **Retired, old, parked, test and demo pages** are hidden in one folded section. Nothing is deleted (rule 2).
2. **Day builder (`lab/day.html` and `js/day/day.js` `boot()`).**
   - Tick the stages: door (with weather), Cook station or full kitchen, clinic game or full morning, ride, book. Or tick a single game only.
   - This writes `?stages=door:sunny,cook:chai-tray:1,clinic:eye:1,book`.
   - The day saves the list in `story.today` and resumes after each hand-off (`day.js:386-390`).
   - Cook and clinic honour `?then=day.html`, generalising Cook's pattern at `js/cook/app.js:28-33` into `js/shared/host.js` and `js/clinic/main.js`. That also closes DAY-03.
3. **New player** (Zafar, 21 Oct): every word back to never seen, every onboarding runs again, and every mode starts at level 1.
   - One shared `Save.resetPlayer(id)` goes in `js/shared/save.js` and `js/core/save.js`.
   - It clears words, ui (onboarded and seen), cook, clinic levels, story and conversations.
   - It keeps the wallet, and `firstDone`, so the nine-scene first launch doesn't take over.
   - Both "Play as new" buttons (`js/cook/ui.js:772`, `js/clinic/screen.js:173`) use it. The labs button resets the current player and confirms on screen.
4. **Girl-only clinic.**
   - Fix the `flip["kind"]` crash in `js/clinic/pipeline.js` `other()`.
   - Set `kidsOnly.from: 1` in `data/clinic/pipeline.json`.
   - Add a `forceKind` option from `js/clinic/main.js` for the labs and the day builder.
5. **Effects off everywhere.**
   - Cook's code-drawn `burst`, `sparkle`, `puff` and `wisps` become no-ops in `js/cook/stations.js` (one file, so no station files are touched).
   - The clinic's local ones go too: `taste.js` sparkle and `boing.js` mist.
   - `NjgPour` stays for the chai work.
6. **Tooth drill** (a quick win to show; `tooth.js` is done before Sprint 11 starts). The drill keeps its drag, but starts in the middle of the first cavity instead of at `DRILL_REST`. The cavities are bigger (L1 at least r70) and clearly outlined.

**Proof, proportional** (Zafar, 21 Oct):
- `checks.mjs` green.
- Unit tests for `Save.resetPlayer`, `?stages=` and the girl-only patient.
- The labs, the day builder, the girl patient, the tooth drill, and chai without effects, screenshotted at laptop size (1366x768) and Galaxy Tab S8 Ultra size (1480x924 landscape), with filmstrips for the drill and the day builder's run.
- One `judge` pass on those sheets; fix-list rows for each item.
- Then `/publish`.

## Sprint 11, "Easy to play, easy to learn"

**Step 0: shared pieces.** One builder (Opus, high effort, about $40, half a day). It starts alongside Sprint 10.
- **Word card.** js/shared/word-card.js and css/shared/word-card.css provide `WordCard.card()` (big: door, eye test) and `WordCard.row()` (sidebar). They use one shape and the four slots, blanked by stage, with a reveal button. `WordCard.pop(from, to)` reuses `RequestPopup.fly`.
- **Progress.** The `js/core/progress.js` and `data/progress.json` support table gains `english` and `kutchiText` per stage, plus the cues `picture` and `english`.
- **Onboarding.** `js/shared/onboard.js` gains `Onboard.demo(item, path)`, in which the real item moves, and `Onboard.stuck(step)` for the 5 s and 15 s rungs.
- **Play log.** Each step's seconds to first action, taps that did nothing, and help shown are saved to `njg-play-log` on the device. lab/play-log.html lists them with the slow steps flagged and can export them.
- **Leak bot.** Add the learned-save knob.
- **Door.** `js/day/door.js:164-182` `card()` moves onto `WordCard.card`, which proves the card works.
- **Art run.** Write one paste block for Zafar (rule 13):
  - a proper toothbrush (straight handle, real bristles; Zafar may send a photo);
  - a doctor holding a big card;
  - a small painted effects sheet: sparkle, splash, steam, bubble, shine.

**Then two builders in parallel (Opus, high effort, about $60-80 each, 1-2 days).** Each owns its own files.

### B-cook: chai and the kitchen conversation

Owns `js/cook/ui.js`, `js/cook/stations/chai-tray.js`, `js/cook/coach.js`, `css/cook.css`, `data/stations/chai-tray.json` and `data/cook.json`.

- **Conversation.** The kitchen conversation runs before the order: `Conversations.maybe` CK1/CK2, hooked at `ui.js:1284` before `M.introduce`.
- **Order layout.**
  - The asker's face and bubble stay visible; the order pop-up no longer covers the face.
  - Items are said one by one. Each pops a `WordCard.row` from the guide box (top left, `#guide`) into the card (`#mission`).
  - `OrderCard.rowEl` (`js/shared/order-card.js:173`) delegates to `WordCard.row`, so every mode keeps one card (rule 8).
  - Sidebar verdict: keep the guide box. Its line slot is the "next action". There is no new circle icon, because the face is already the replay and its tools live there.
- **Pans.** Chai pans become true top-down and centred: `TOP.turn` goes to 0, and the s08c three-quarter pour frames (`pan-tip-*-s08c.webp`) are dropped.
- **The pour, coded from the one top-down pan.** It lifts over the glass and squashes slightly along the tilt, which is how a tilt looks from above. The tea surface slides toward the spout, and `NjgPour.stream` leaves from the spout.
- **Done and onboarding.**
  - `#go-btn` is replaced by auto-advance; ✓ stays for the cup's ingredients.
  - The first time, the real pan demonstrates; when stuck, the rungs run.
- **New effects.** These are tested here first: motion on the real item art (settle, squash, small bounce), soft sounds through the existing `js/shared/sfx.js`, and the painted effects sprites once the art lands.

### B-clinic: eye test and toothbrushing

Owns `js/clinic/heal/games/eye.js`, `js/clinic/heal/games/tooth.js`, `js/clinic/heal/scene.js`, `css/clinic.css`, `data/clinic/heal/eye.json` and `data/clinic/heal/tooth.json`.

- **Eye test.**
  - The chart is retired (`ROWS`, `drawChart`, versions A/B).
  - The doctor holds up one big `WordCard.card`, on the existing stand until the art lands.
  - The girl says her guess every 1.5 s until the player taps big haa or na.
  - A round is four judged cards: blind "always haa" wins about 9%, which is under the 10% limit.
  - The player can say *haa* or *na* instead of tapping (`Speech.listen`). The pills are always there.
  - The first card is the demo and isn't scored. A wrong answer gives a gentle shake and the doctor names it.
- **Toothbrushing** (Zafar, 21 Oct).
  - A large plus-shaped track, with the brush at its centre. It moves only along the vertical and horizontal channels.
  - Pull it to the end of a channel and it snaps back to the centre.
  - The ends carry a clear target, a tooth-shine spot that the brush head must meet, rather than bare dots.
  - The order is direction cards with an arrow picture and the word: left is *dabo* (confirmed), right is probably *jamno*, up is *mathe* and down is *niche* (Zafar, 21 Oct: "Mutt-Hair", "Knee-Chair"; he confirms the spelling). Up and down still need Mum's recording.
  - A wrong direction makes the brush bump back gently and the patient says the right word again.
  - The dirt is overlaid in code:
    - at L1-2, dirt shows only on the directions in the order (support);
    - from L3, all four sides are dirty, so listening is what wins.
  - The first time, the real brush demonstrates.
- **Tooth drill:** done in Sprint 10.

## Feedback and proof (no testing schedule; Zafar, 21 Oct)

- **Feedback.** Zafar plays with whoever he can, when he can. Voice notes go through `/feedback`, and the play log adds where people hesitated. Nothing waits on a tester.
- **Signals worth watching, not gates:**
  - steps that take more than 5 s to the first action;
  - taps that did nothing;
  - whether a player recognises a word on their second day.
  - The critic's warning: if play gets easy but words still don't stick, stop adding mechanics and lean on the book and the repetition.
- **Fix-list rows with judge evidence** at 1366x768 and 1480x924 (red then green; new features close on green):
  - EASY-01: the card pops from the guide.
  - EASY-02: English goes blank at stage 3 and the picture at stage 4.
  - EASY-03: the 5 s and 15 s rungs appear in the log.
  - EASY-04: no Next on chai or the eye test.
  - EASY-05: the leak bot is green on a learned save.
  - EYE, BRUSH and POUR rows: filmstrips judged at both sizes.

## Parked, then the rollout

- **Parked:** the library (grammar) mode, conversations beyond the kitchen pair, the farm day, and the other drag games.
- **After a green test,** roll out in this order: the pantry and maani (Cook), the knee (clinic), waiting, diagnosis and pharmacy, the book, and then the farm day on the new rules.

## Verification

- `node build/tools/review/checks.mjs`, with unit tests for word-card stages, `Save.resetPlayer`, the `?stages=` parsing and the leak bot on a learned save.
- Filmstrips at 1366x768 (laptop) and 1480x924 (Tab S8 Ultra), judged by the `judge` agent (rule 7). Proportional review: the touched flows only, then `/publish`.

## Opinions recorded (for docs/ideas.md)

- **Library / grammar:** later, as a sentence-builder toy, not lessons.
  - It opens after about 10 meetings with a pattern ("Mukhe ___ khape"): swap who and what, and Nani says the new sentence. A pattern note is there for grown-ups.
  - It's blocked by Mum's grammar and recordings (tenses), so it's 2-3 months out.
- **The critic's notes:**
  - Mum's voice is the true budget, so plan vocabulary deliberately.
  - The evening book that grows is the best reason to come back.
  - Don't let process outgrow play.
  - Make the end screens show progress, not verdicts.

## Order of work (Zafar, 21 Oct)

Tokens are short. Sprint 10, "Show it", runs first, **unsupervised overnight**, so Zafar can show his Masi this weekend. Sprint 11 starts only if budget is left over.

Overnight run:
- One builder (Sonnet, medium effort) in its own worktree, with a brief from `/brief`.
- The orchestrator judges, merges, runs `checks.mjs`, and pushes the branch.
- `/publish` to `main` happens only after the judge passes and checks are green (Zafar's go for the publish is part of the go for this run).

The same run makes these small edits, because they don't touch Sprint 11's files:
- the rule changes;
- `docs/ideas.md` gets the library mode and the critic's notes;
- Mum's list gets up (*mathe*), down (*niche*), brush and toothbrush.

## Decisions (Zafar, 21 Oct: yes to all; the drill keeps its drag)

1. Two sprints at once: 10 "Show it" (one builder) and 11 "Easy to play, easy to learn" (a Step 0 builder, then two). That makes three builders at most. **Recommend yes.** Total is about $200-250 over about 3 days.
2. The spotlight dims 62% (as now), not 80%, and everything else becomes untappable. **Recommend yes.** We can try 80% in the lab if testers still miss things.
3. Hint rungs at 0 s, 5 s and 15 s for every age. At 15 s the real item demonstrates again; it never does the step for them (changed after the critic's review).
4. No Next buttons; ✓ Done only where there's something to take back. **Recommend yes.**
5. Words fade over days by their stage (6-10 meetings), not after 3 showings. **Recommend yes.**
6. Rule 5 and 6 wording as above, and the leak bot plays a learned save. **Recommend yes.**
7. Tap by default; drag only in a track or for rubbing. The drill keeps its drag, starting in a bigger, clearer cavity (Zafar).
8. Effects: motion on the real art first, then painted effects from the art run. Sounds are soft real-world clicks, pours and pops through `sfx.js`, either recorded at home on a phone or taken from free CC0 libraries. **Recommend:** CC0 for testing, family-recorded kitchen sounds later if you like.
9. One art run during Step 0: the toothbrush, the doctor holding a card, and the effects sheet. **Recommend yes.** Send the toothbrush photo if you have it.
10. Mum's list gains up, down, brush and toothbrush, and right (*jamno*) gets confirmed. Until then they are grey English placeholders, spoken by the device voice while testing. **Recommend yes.**
