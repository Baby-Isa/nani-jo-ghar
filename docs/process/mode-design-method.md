# Mode-design method

How a mode gets designed, in the order the work runs. The five questions, the pipeline-of-stages rule and the leak test are rules (H1, H2, non-negotiable 6); this file keeps the **method** behind them. Also see `game-design/modes/README.md` for the modes and their core verbs.

**The process:** pipeline (stages and mini-games) → design template with persona loops → quality pass (five questions, cut to the best) → deep dive (modular mechanics, speaking moments, first set) → fun checklist → Zafar approves → build.

## 1. The pipeline brief (25 Sept): every mode is a factory of stages

> from: docs/archive/mode-briefs/PIPELINE-BRIEF.md (whole file)


Zafar's feedback on the clinic, which he wants applied to **every** mode:

> "What's missing is the structure and the process. It should be almost factory-like, a set process." Each mode is a **pipeline of stages**; **each stage has several mini-games** (variants that get harder or different); the stages are **stitched into one sequence** that tells a little story with a beginning and an end. Mini-games reuse mechanics from other modes wherever they fit (e.g. making turmeric milk is the tadka station from Cook).

### The worked example: the clinic
1. **Waiting room → clinic.** The doctor says "bring in the little girl", "bring in the old man"; the child taps the right person (learning who's who: girl, boy, old man, old woman, baby, Nana…). Later: several old men in different colours, and the doctor says which colour.
2. **Diagnosis** (three variants):
   - "Does it hurt here?": the possible parts pulse; the child taps one, the patient says yes or no; a yes goes "ding". The very first, easiest level.
   - "It's my knee": the patient names the part; the child taps it. **The bulk of diagnosis.**
   - A guessing/deduction variant for later levels.
3. **Gather the treatment: the pharmacy counter.** A conveyor or sushi-style belt carries items past; the child grabs the ones asked for (hot water, lemon, *hardar*, blankets, bandages, the green bottle…). Everything gathered is used in the next stage.
4. **Heal.** The most fun part: one comical mini-game per body part, **15–20 of them** (see below). Some reuse Cook (making a cup of chai with lemon; turmeric milk = the tadka station).
5. **Send-off.** "Is everything okay now?" "Yes, now I'm happy!": feelings words (*okay, happy, better, sad, scared*) and goodbye.

**Healing mini-games: Zafar's steer.** Comical, never gory, but **stitches and injections are allowed** (25 Sept steer, reversing the earlier "no needles, no stitches" call; the pill organiser stays out, H46). Look at popular children's doctor apps (e.g. Toca Life: Hospital, Dr. Panda Hospital, My Town: Hospital, Baby Panda's Hospital, Bimi Boo Doctor, Dentist games) for mechanics that already work. Ideas so far: ear (pull out the earwax, then clean), cut (suturing, following a sequence), teeth (brush in an order: up, up, left, right…; tap the tooth; cover a crack), eyes (drops), tongue (something!), elbows, knees, stomach. Every one must carry Kutchi, even if only through the instructions and the counts/colours/sides in them.

### What each mode's redesign must produce
Add a new top section to the mode's design doc, **"Pipeline design, 25 Sept 2026"**, superseding older sections where they conflict:
1. **The pipeline**: the stages in order, what the child does in each, and how one stage hands over to the next (what's carried forward), from arrival to a send-off/ending. A diagram in text.
2. **Per stage: the mini-game variants** (at least two, usually three or more), each with: the mechanic(s), what the Kutchi instruction carries, how it gets harder (levels), and which existing mechanic it reuses (Cook's, another mode's, or new).
3. **The big library** where the mode has one (the clinic's 15–20 healing games; a mode's equivalent pool of "fun" mini-games): each with a one-line pitch, the Kutchi it teaches, the mechanic, age fit (5 / 8 / 11), and a score 1–5 for fun, Kutchi, and build cost.
4. **Research**: what popular children's apps in this genre do (name them, and the mechanics worth borrowing). Use web search.
5. **Stitching**: how a session runs (e.g. a clinic morning = 3 patients through the whole pipeline), how the first ever session is tiny (UX principle 7), and how free play dips into single stages.
6. **What survives from the current build** (`js/<mode>/`, `data/<mode>.json`, the build report in `build/reports/<mode>-build.md`): which files and mechanics carry over, which change, which go. Be concrete: this tells the next build agent what to keep.
7. **Words needed**, marking what's already in the Questions for Mum doc.
8. A rewritten **build brief**, phased, own files first.

Follow `docs/design-language/ux-principles.md` (request card, left sidebar, fixed-shape cards, light bulb, one job at a time, start tiny, the end-of-round screen) and `docs/archive/mode-briefs/DEEP-DIVE-BRIEF.md`'s principles (modular mechanics, speaking moments with a closed set and a fallback, the Sceptic's win-without-Kutchi test).

## 2. The mini-game quality pass (25 Sept): five questions, then cut to the best

> from: docs/archive/mode-briefs/MINIGAME-QUALITY-BRIEF.md (whole file)


Zafar, after reading the pipeline designs: "It's the right idea, but I need help making these mini-games distinct and good. The detail and success will all be in how these mini-games work: what do you need to do, where is the challenge, where is the fun, where is the instruction, what is novel or different in this game mode. Find lots of inspiration for what is successful elsewhere right now." Also: "20 sewing mini-games might be too much; let's see the suggestions and then pick the best."

### Rules Zafar set tonight (see `docs/design-language/ux-principles.md` §11–§13)
- **Consistent controls inside each mini-game** (clarified by Zafar: not tap-only). Swipe, stir, drag and tap are all fine, but within a mini-game the same kind of action uses the same gesture (if ingredients are tapped in, liquids are tapped too), and a mini-game's gestures never change between its levels. Fix any mini-game that mixes gestures for the same kind of action or changes them by level.
- **Auto-tick** lines on the instruction card when done right; mistakes show only in the end review; no negative feedback mid-round.
- **The instruction card is the master; Nani is a voice** (plus throbbing hints and interjections).

### For each mini-game in your mode's pipeline design, answer the five questions
1. **What do you do?** (the gestures, step by step)
2. **Where is the challenge?** (what makes it hard, and how that grows by level; the Kutchi must be what decides it)
3. **Where is the fun?** (the moment of delight: a comic reaction, a satisfying sound or animation, a near miss, a reveal)
4. **Where is the instruction?** (what the card and Nani's voice say, in the Kutchi the family has given us so far, `docs/language/grammar-notes.md`)
5. **What is novel?** (what this mini-game has that no other mini-game in any mode has; if nothing, merge or cut it)

### Then cut to the best
- Research what's working **right now** in children's games (2024–2026 app-store charts and awards: Toca Boca, Sago Mini, Dr. Panda, BabyBus, Pok Pok, Lingokids, Khan Academy Kids, Duolingo ABC, Pepi, My Town, Bluey games, Hey Duggee, also casual hits like Good Pizza Great Pizza, Overcooked, Cooking Mama). Name the specific mechanic you're borrowing and why it works.
- Score every mini-game on the five questions (1–5 each) and keep the best: **at most 6–8 per stage, and 8–10 for a big library** (e.g. Big Ma's table, the clinic's healing). Put the rest in a short "maybe later" list with one line each.
- Check **distinctness across modes**: read the other modes' "Pipeline design" sections, and don't keep a mini-game that's the same as one elsewhere unless it's deliberately shared (then say so and reuse the mechanic).
- For the first set of each stage, write a **one-paragraph walkthrough** of a level-1 round (what's on screen, the card, each tap, the fun moment, the tick, the end).

Write a new top section **"Mini-game quality pass, 25 Sept 2026"** in the mode's design doc (above the pipeline design), updating the pipeline design's build brief where the cut changes it. Edit only your mode's doc. Don't commit or push. Save as you go. Report under 300 words: the kept mini-games per stage with the novel thing about each, what was cut, and any controls you changed for consistency.

## 3. The deep dive (25 Sept): modular mechanics, speaking, the first set

> from: docs/archive/mode-briefs/DEEP-DIVE-BRIEF.md (whole file)


One design agent per mode. Each takes its mode's existing design doc to the depth the clinic reached in its "Revision 2" (visit types plus a scored treatment library), under the principles below. Read this whole brief first.

### Read first
- `docs/archive/mode-briefs/MODE-DESIGN-BRIEF.md`: personas (Layla 5, Zayn 8, Maryam 11, Zafar, Farah, Nani), the Sceptic's "win without the Kutchi?" test, the Builder.
- `docs/archive/clinic/clinic-design-v1.md`: its top section "Revision 2, 25 Sept 2026" is **the model of depth and shape** for this deep dive (kinds of round as the backbone, a scored library, a first set, a level ladder, direct agreement and disagreement).
- `docs/feedback/modes-review-2026-09-25.md`: the independent review. Address every critique of your mode, adopting it or saying why not.
- `docs/architecture/cook-recipes-guide.md` sections 1, 5 and 6, and the file list of `js/cook/mechanics/` (add, assemble, boil, chop, count, fetch, fill-fold, fry, grill, knead, passme, pour, roll, stir, tadka, tawa, thread): this is how Cook is built, and every mode now follows the same pattern.
- `docs/archive/design-v1/Game Design.md`, the section on speaking (stage two: closed-set classification from a few family recordings per word).
- Your mode's own design doc, in full.

### Zafar's principles (25 Sept)
1. **Each mode is a set of mini-games**, the way Cook is a set of stations (chai tray, maani line, grill, chop…). Each mini-game is fun on its own, has its own levels, and can be dropped into the story or free play on its own.
2. **Mechanics are modular.** One mechanic = one file (`js/<mode>/mechanics/<id>.js`, or `js/shared/mechanics/<id>.js` when two or more modes use it), usable alone or inside a zone of a combined mini-game, with difficulty levels as data and rounds as data, exactly like `js/cook/mechanics/`. Reuse Cook's mechanics where they fit (pour, stir, count, fetch, passme…) rather than re-inventing them. Name every mechanic, and say for each whether it is **new**, **reused from Cook**, or **shared** with another mode (name the mode).
3. **Speaking is a core part of the game.** Every mode needs at least one mini-game or moment where the child **says the Kutchi aloud**: role reversal, where the child gives the instruction and a character acts on it. Recognition is **closed-set**: at that moment the game knows the 3–8 words the child could mean and picks the closest, trained from the family's own recordings. Design rules: say exactly what the closed set is at each speaking moment; always give a fallback (tap the word pills, or a parent judges "did they say it?"); never block progress on recognition; speaking earns its own star (the "voice" star), separate from the ear star. A speech agent is designing the shared recogniser (`js/shared/speech.js`, `listen({choices, timeoutMs}) → {choice, confidence} | null`); design against that call.
4. **All modes are built at once, one build agent per mode**, each mostly in isolation and then put together. So the build brief must be phased so phases 0–1 (pure logic, lab, bots, greybox) touch **only the mode's own files**, and must list the shared pieces it needs from the foundation agent (the shell/"one app, one save", the relations layer `data/relations.json` + `js/shared/rel.js` + scene `spots`, the shared "which one?" attribute-and-decoy module, overlay-at-anchor sprites, star sets and ear/voice rules as data, `js/shared/speech.js`). Assume those arrive; don't design them.
5. The Sceptic rule still holds: a child mustn't be able to win by pattern, elimination, or waiting for hints. Give a blind-bot estimate for level 1 of each mini-game in the first set.

### What to write
Add a new top section to your mode's design doc, **"Deep dive, 25 Sept 2026: mini-games and mechanics"**, superseding older sections where they conflict:
1. **Pitch** in two sentences, and **the kinds of round** that form the mode's backbone.
2. **The mini-game library**: a table scored 1–5 on fun at 5, fun at 11, forces the Kutchi, distinct from other modes, build cost (5 = cheap), plus the mechanics each uses. Include the ones already designed and new ones; reject weak ones with a one-line reason.
3. **The mechanics list**: every mechanic id, one line each, tagged new / reused from Cook / shared (with which mode).
4. **Speaking moments**: for each, the closed set, what the character does, the fallback, and when (which level) it appears.
5. **The first set** (3–5 mini-games) and why; **the level ladder** (what makes level 2, 3, 4 harder, in terms of what the Kutchi instruction carries).
6. **Story home** per mini-game, and one free-play entry.
7. **The review's critiques**: a short table, critique → what you did.
8. **Words needed**: the Kutchi the first set needs, in priority order, marking which are already in the Questions for Mum doc (`docs/language/mum-questions/Questions for Mum (Combined, for the visit).md`; don't edit it).
9. **Decisions for Zafar**, only ones that block the build, each with your default.
Then update the doc's **build brief** at the end to match (phased, own-files-first, shared pieces listed).

### Rules
- Edit only your own mode's design doc. Don't edit `OVERVIEW.md`, other modes' docs, the questions doc, or any code. Don't commit or push.
- Plain British English; tables welcome. The new section should be roughly 1,500–3,000 words.
- Final report to the orchestrator, under 350 words: the backbone, the first set with a line each, mechanics reused vs new vs shared (counts plus the shared ones by name), the speaking moments, the biggest changes from the old design, and blocking decisions with defaults.

## 4. The design template, personas and leak list

> from: docs/archive/mode-briefs/MODE-DESIGN-BRIEF.md (whole file)


You're the lead designer for **one** game mode of *Nani jo Ghar*: a game that teaches Kutchi (a mostly spoken language of Kutch; the family are Khoja, with East African roots) to diaspora children aged 5–11 and adult heritage learners, through a grandmother's home life. Two modes exist: **Cook with Nani** (built and iterated) and **Find it** (designed, being built now). Your job is to make your mode good from the start by using everything learned so far, then write a document that (a) lets Zafar decide whether the mode is good and complete, and (b) can be handed to a future agent to build it.

Zafar's brief, in his words: *"Talk to me about the next game mode we'll be working on. Just like this one we had to brainstorm and iterate, let's try take some learnings to get the next one good from the start. Do some research and then come back to me on how each mechanic is fun, educational forcing Kutchi, distinct, helps the plot and has play again appeal."*

### 1. Read first (skim; grep; don't read everything line by line)

Repo: `/home/user/nani-jo-ghar`.

- `docs/archive/design-v1/game-modes-v2.md`: the 8 modes, their core verbs, syllabus stages and story uses; the in-game upgrades rule (section 3).
- `docs/archive/design-v1/game-modes-fun-analysis.md`: the fun checklist and the personas.
- `docs/archive/design-v1/Roadmap and Story Structure.md`: all 5 arcs, chapters and beats, the recurring cast, and the syllabus S1–S6.
- `docs/archive/design-v1/Game Design.md`: per-word difficulty, teaching without cutscenes, warm failure.
- `docs/game-design/cast.md`: Nani, Big Ma (seamstress; her room), the doctor, Simba and Zazu (cats), Kasuku (African grey parrot who repeats words), Nana, Ma, Ali, baby Isa.
- **The lessons from Cook:**
  - `docs/archive/cook/cook-with-nani-phase-a-design.md`, especially section 3 (the learning link; "can you win without the Kutchi?"), 4 (word pill; text in one place only), 6 (stars), 7 (making actions clear), 8 (station library), 13 (audit).
  - `docs/archive/cook/cook-with-nani-kutchi-audit.md`: the leak patterns found, before and after Wave 3.
  - `docs/archive/build-logs/cook-with-nani-build-log.md`: persona reviews, rounds 1–3.
  - `docs/archive/cook/cook-with-nani-todo.md`: Zafar's playtest feedback, Waves 1–5. Read it carefully; it's the best record of what confused or bored a real player.
- **The model to follow:** `docs/game-design/modes/find-it.md` (the Find it design; match its depth and go further on the persona loops and the build brief).
- `docs/architecture/cook-recipes-guide.md`: the shared building blocks (mechanics as data, zones, levels as data, combined stations, grammar frames in data).
- **Art and assets:**
  - `docs/design-language/art-bible.md`: cameras, layers, the set-dressing restraint rule: "modern with hints and nods, not caricature".
  - `docs/archive/art/Asset Building Plan.md`: the existing ~56-pose hand set, skinned in code per character; ambient motion; the cats; the parrot.
- The platform plan in `docs/archive/cook/cook-with-nani-todo.md`, "Platform and tech debt": one app and save, a world map, "the world is the menu" with free play everywhere, no tutorial, and role reversal (relations stored as data).

### 2. Non-negotiable design rules (learned the hard way)

1. **Every choice the player makes is set by something said in Kutchi, and it varies between rounds.** Pass the Kutchi leak test (non-negotiable 6): someone who knows no Kutchi must not be able to win by reading, matching letter shapes, eliminating options, remembering fixed patterns, or waiting for a glow.
2. **Known leak patterns to design out from day one:**
   - Help that shows the answer is free (it must cost a lightbulb on the hints badge).
   - Counts end by themselves, or trays hold exactly the number needed.
   - Optional steps are only offered when they were ordered.
   - Fixed positions or order.
   - "No X" is always the odd one out.
   - Pictures or colour swatches in the order list.
   - Text matching between the order card and item labels.
   - Target zones that move to the answer.
3. **A word shows as text in only one place at a time**, and fades by word stage: text, then speaker only, then •••; tap-to-reveal costs a hint (the eye badge at closed-card levels).
4. **The cue is on the object. Nothing covers the play area.** Nani's "pass me" lives in the sidebar.
5. **Calm and clarity (Zafar's latest feedback):**
   - An intro card shows who wants what, as a one-line-per-item sequence.
   - A few seconds of silence at the start so the player can work it out; Nani must not be chatty or intrusive.
   - A sidebar that doesn't eat the play area; help as a "?" button.
   - No written English for the child, ever (E1): no English step pills; the end word review shows Kutchi with English under it for the grown-ups' check (F14).
   - Visible timers where there's time pressure.
   - Level 1 is simple in hand skill but varied in what's asked.
6. **Never invent Kutchi.** Use existing words and frames from `data/cook.json` and the content master. Where a word is missing, use an English placeholder (grey italic) and list it for the family.
7. **Levels are data; mechanics are reusable building blocks; free play and story routes both exist; every mode has a lab.**
8. **Upgrades never do the listening for you.**
9. **Hands:** none. Hands are parked (H13); a mode that needs a first-person scene says so and asks Zafar first.

### 3. Research (web search)

Find what makes the proven hits behind your mode fun and replayable (the reference games are listed for your mode in `docs/archive/design-v1/game-modes-v2.md`; add others). Find how language learning uses your core verb: TPR, listening comprehension, describing, deduction and so on, with evidence for young learners where you can. Note concrete mechanics and why they work, and cite sources briefly (a link and one line each). If a page is blocked, use the search summaries and say so.

### 4. Process: design, then at least three self-check loops

**Loop 0 (draft):** the core loop and a library of 8–12 candidate mechanics.

**Loops 1, 2, 3 (persona and audit review):** in each loop, "play" the current design in your head as each of these, and write down what they do, say and struggle with:
- **Layla, 5:** can't read; plays with a parent.
- **Zayn, 8:** competitive; wants mastery and records.
- **Maryam, 11:** aesthetics and heritage; wants to make things hers.
- **Zafar, 38:** adult learner; wants lots of Kutchi per minute; a Puzzle Pirates fan.
- **Farah, 34:** commuter; plays 3–5 minutes at a time.
- **Nani, 68:** the voice; plays alongside a grandchild; must be proud of it.
- **The Sceptic:** Zafar's wife. She doesn't know Kutchi, actively tries to win (the accuracy badge) by pattern matching, elimination, reading and waiting, and reports every way she succeeded.
- **The Builder:** a pragmatic engineer. What's expensive to build or to draw? What can reuse Cook and Find it?

Then revise the design, and record in a **changelog table per loop**: finding → change. Stop after loop 3 only if the Sceptic can't win and every persona has a reason to come back; otherwise do more loops. Keep the loop notes in the document (condensed) so Zafar can see the design earned its shape.

### 5. The document you write: `docs/game-design/modes/<mode>.md`

UK English. Tables and short bullets. No filler. Sections:

1. **One-paragraph pitch and core loop.** Why this mode exists (its syllabus stage and core verb), and how it differs from Cook and Find it.
2. **Research summary:** what we borrow from which game and why, and the language-learning evidence, with sources.
3. **Mechanic library** (8–12): one table row each, scoring **Fun / Forces Kutchi / Distinct / Plot / Replay** from 1 to 5, each with a one-line reason. For "Forces Kutchi", name the exact decision the Kutchi drives, the leak risks and how they're designed out. For "Plot", name the arc, chapter or beat. For "Replay", name the variation, twists, levels and any collection.
4. **Recommended first set** (3–5 mechanics), with reasons, and what's held back and why.
5. **Story integration:**
   - every arc, chapter and beat where the mode appears;
   - which cast members drive it (Nani, Big Ma, the cats, Kasuku, the doctor, the family);
   - how it opens a place on the world map;
   - its free-play route.
6. **Learning design:**
   - the words and frames it drives, mapped to the syllabus;
   - the hint ladder and its costs;
   - word-stage fading;
   - recasts on mistakes;
   - role-reversal potential (the player gives the instruction);
   - a **list of words and frames needed from the family**, marked as English placeholders until then.
7. **Badges, rewards and upgrades:** the three shared badges (time, accuracy, hints; H5), what the mode adds to pocket money (volume × quality × difficulty, decision 10), collectibles, and upgrades that never do the listening.
8. **Engineering spec for the builder:**
   - the data model (scene, items, relations, requests, levels);
   - what's reused from Cook and Find it, and which new building blocks are needed;
   - the lab;
   - the test harness, including the automated leak bot (a no-Kutchi bot must fail to win in more than 90% of rounds);
   - the file layout (e.g. `<mode>.html`, `js/<mode>/`, `data/<mode>.json`, until the one-app shell exists).
9. **Scene, art and asset list:**
   - the camera per scene;
   - separate layers and ambient motion;
   - hand poses used (from the existing set, and any new ones);
   - new items, characters and backgrounds, with reuse flagged;
   - rough counts, and which can be made free in ChatGPT versus which need the API.
10. **Persona loops:** condensed notes and a changelog table per loop.
11. **Scorecard and verdict:**
    - an overall score per criterion;
    - is the mode good? Is it complete (does it cover its syllabus stage and story uses)?
    - **Go / Go with changes / Rethink**;
    - the top risks;
    - **open questions for Zafar** (short).
12. **Build brief for a future agent:**
    - phases, each with acceptance criteria (what's playable, the tests passing, the leak bot rate, screen sizes);
    - the first 3 tasks, in enough detail that an agent could start tomorrow.

### 6. Rules for you

- **Only create your one file**, `docs/game-design/modes/<mode>.md`, and edit no other file (a session's own rules are in its brief, `process/session-brief-template.md`).
- Coordinate by respecting the other modes' core verbs, so the mechanics don't overlap:
  - Cook = build;
  - Find it = search;
  - Tidy up = arrange;
  - Dress up = style;
  - The doctor's clinic = treat;
  - Who did it? = deduce;
  - Monsoon rush = react;
  - Snap = aim and capture.

  If you think a mechanic belongs to another mode, say so rather than taking it.
- Reply to the orchestrator in under 250 words:
  - the verdict;
  - the recommended first set, one line each on fun, Kutchi, plot and replay;
  - the 3 biggest risks;
  - the open questions;
  - the file path.

## 5. The fun checklist every mode must pass

> from: docs/archive/design-v1/game-modes-fun-analysis.md § 4. What actually makes games fun (the checklist every mode must pass). The personas (§1) are in `docs/vision.md`; Cook's "service" loop (§5) is in `game-design/modes/cook.md`.


1. **A core verb that feels good the 500th time** (dragging sauce, swiping to chop, tapping a found object).
2. **A clear goal in each short round** (1–3 minutes) and visible progress within it.
3. **Mastery:** you can get better, and the game shows it (grades, combos, personal bests).
4. **Variety through rule twists,** not new games: new ingredient, new customer quirk, new modifier.
5. **Juice:** instant feedback (bounce, pop, sound, particles, a customer's reaction).
6. **A meta loop:** pocket money → upgrades and unlocks → new possibilities in the next round (never a wage or a loss, decision 20).
7. **Characters you care about** (recurring family members with tastes and personalities).
8. **Surprise:** randomised orders and occasional special events (a rush of guests, a guest with an odd request).
9. **Tension then release,** but never punishment for the language itself.
10. **The language is the input:** you can't win without understanding the Kutchi.

## 6. What all six designs agreed on (points 2 to 4)

> from: docs/archive/mode-briefs/OVERVIEW.md § What all six designs agree on

2. **Build on the shared engine, after "one app, one save".** Every mode reuses Cook and Find it's building blocks: word pills, the order ladder, the three badges and the light bulb as the help, levels as data, the lab, the test harness and the leak bot. Relations stored as data also enables role reversal later.
3. **Most modes have a slice that already works as a real Kutchi test:**
   - Monsoon rush's kitchen leak (food words);
   - Who did it?'s magnifier (*hardar*);
   - Snap's "just so many" (fruit and numbers);
   - Tidy up's "put the shopping away" (food nouns).

   Build those slices first.
4. **New art types to test small before any art run:**
   - full-body "paper-doll" dressing (Dress up);
   - seated patients and a first-person "lap view" of the player's own knees (clinic);
   - scenery strips (Snap);
   - the courtyard shared by Find it and Monsoon rush.
