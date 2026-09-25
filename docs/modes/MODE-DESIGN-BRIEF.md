# Brief: designing a Nani jo Ghar game mode "good from the start"

You're the lead designer for **one** game mode of *Nani jo Ghar*: a game that teaches Kutchi (a mostly spoken language of Kutch; the family are Khoja, with East African roots) to diaspora children aged 5–11 and adult heritage learners, through a grandmother's home life. Two modes exist: **Cook with Nani** (built and iterated) and **Find it** (designed, being built now). Your job is to make your mode good from the start by using everything learned so far, then write a document that (a) lets Zafar decide whether the mode is good and complete, and (b) can be handed to a future agent to build it.

Zafar's brief, in his words: *"Talk to me about the next game mode we'll be working on. Just like this one we had to brainstorm and iterate, let's try take some learnings to get the next one good from the start. Do some research and then come back to me on how each mechanic is fun, educational forcing Kutchi, distinct, helps the plot and has play again appeal."*

## 1. Read first (skim; grep; don't read everything line by line)

Repo: `/home/user/nani-jo-ghar`.

- `docs/game-modes-v2.md`: the 8 modes, their core verbs, syllabus stages and story uses; the in-game upgrades rule (section 3).
- `docs/game-modes-fun-analysis.md`: the fun checklist and the personas.
- `docs/Nani jo Ghar — Roadmap and Story Structure.md`: all 5 arcs, chapters and beats, the recurring cast, and the syllabus S1–S6.
- `docs/Nani jo Ghar — Game Design.md`: per-word difficulty, teaching without cutscenes, warm failure.
- `docs/Nani jo Ghar — Cast.md`: Nani, Big Ma (seamstress; her room), the doctor, Simba and Zazu (cats), Kasuku (African grey parrot who repeats words), Nana, Ma, Ali, baby Isa.
- **The lessons from Cook:**
  - `docs/cook-with-nani-phase-a-design.md`, especially section 3 (the learning link; "can you win without the Kutchi?"), 4 (word pill; text in one place only), 6 (stars), 7 (making actions clear), 8 (station library), 13 (audit).
  - `docs/cook-with-nani-kutchi-audit.md`: the leak patterns found, before and after Wave 3.
  - `docs/cook-with-nani-build-log.md`: persona reviews, rounds 1–3.
  - `docs/cook-with-nani-todo.md`: Zafar's playtest feedback, Waves 1–5. Read it carefully; it's the best record of what confused or bored a real player.
- **The model to follow:** `docs/find-it-design.md` (the Find it design; match its depth and go further on the persona loops and the build brief).
- `docs/cook-with-nani-recipes-guide.md`: the shared building blocks (mechanics as data, zones, levels as data, combined stations, grammar frames in data).
- **Art and assets:**
  - `docs/Nani jo Ghar — Art Bible.md`: cameras, layers, the set-dressing restraint rule: "modern with hints and nods, not caricature".
  - `docs/Nani jo Ghar — Asset Building Plan.md`: the existing ~56-pose hand set, skinned in code per character; ambient motion; the cats; the parrot.
- The platform plan in `docs/cook-with-nani-todo.md`, "Platform and tech debt": one app and save, a world map, "the world is the menu" with free play everywhere, no tutorial, and role reversal (relations stored as data).

## 2. Non-negotiable design rules (learned the hard way)

1. **Every choice the player makes is set by something said in Kutchi, and it varies between rounds.** Pass the wife's test: someone who doesn't know Kutchi must not be able to win the "understood" star by reading, matching letter shapes, eliminating options, remembering fixed patterns, or waiting for a glow.
2. **Known leak patterns to design out from day one:**
   - Help that shows the answer is free (it must cost the ear star).
   - Counts end by themselves, or trays hold exactly the number needed.
   - Optional steps are only offered when they were ordered.
   - Fixed positions or order.
   - "No X" is always the odd one out.
   - Pictures or colour swatches in the order list.
   - Text matching between the order card and item labels.
   - Target zones that move to the answer.
3. **A word shows as text in only one place at a time**, and fades by word stage: text, then speaker only, then •••; tap-to-reveal costs a star.
4. **The cue is on the object. Nothing covers the play area.** Nani's "pass me" lives in the sidebar.
5. **Calm and clarity (Zafar's latest feedback):**
   - An intro card shows who wants what, as a one-line-per-item sequence.
   - A few seconds of silence at the start so the player can work it out; Nani must not be chatty or intrusive.
   - A sidebar that doesn't eat the play area; help as a "?" button.
   - No English step pills.
   - A word review at the end (Kutchi → English).
   - Visible timers where there's time pressure.
   - Level 1 is simple in hand skill but varied in what's asked.
6. **Never invent Kutchi.** Use existing words and frames from `data/cook.json` and the content master. Where a word is missing, use an English placeholder (grey italic) and list it for the family.
7. **Levels are data; mechanics are reusable building blocks; free play and story routes both exist; every mode has a lab.**
8. **Upgrades never do the listening for you.**
9. **Hands:** first-person hands come from the existing hand set (poses, skinned per character); design for those poses, or name any new pose needed.

## 3. Research (web search)

Find what makes the proven hits behind your mode fun and replayable (the reference games are listed for your mode in `docs/game-modes-v2.md`; add others). Find how language learning uses your core verb: TPR, listening comprehension, describing, deduction and so on, with evidence for young learners where you can. Note concrete mechanics and why they work, and cite sources briefly (a link and one line each). If a page is blocked, use the search summaries and say so.

## 4. Process: design, then at least three self-check loops

**Loop 0 (draft):** the core loop and a library of 8–12 candidate mechanics.

**Loops 1, 2, 3 (persona and audit review):** in each loop, "play" the current design in your head as each of these, and write down what they do, say and struggle with:
- **Layla, 5:** can't read; plays with a parent.
- **Zayn, 8:** competitive; wants mastery and records.
- **Maryam, 11:** aesthetics and heritage; wants to make things hers.
- **Zafar, 38:** adult learner; wants lots of Kutchi per minute; a Puzzle Pirates fan.
- **Farah, 34:** commuter; plays 3–5 minutes at a time.
- **Nani, 68:** the voice; plays alongside a grandchild; must be proud of it.
- **The Sceptic:** Zafar's wife. She doesn't know Kutchi, actively tries to win the ear star by pattern matching, elimination, reading and waiting, and reports every way she succeeded.
- **The Builder:** a pragmatic engineer. What's expensive to build or to draw? What can reuse Cook and Find it?

Then revise the design, and record in a **changelog table per loop**: finding → change. Stop after loop 3 only if the Sceptic can't win and every persona has a reason to come back; otherwise do more loops. Keep the loop notes in the document (condensed) so Zafar can see the design earned its shape.

## 5. The document you write: `docs/modes/<mode-id>-design.md`

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
7. **Stars, rewards and upgrades:** this mode's three stars (the ear star is always "understood"; propose its own icon for the craft star, e.g. a chef's hat is Cook's), pocket money, collectibles, and upgrades that never do the listening.
8. **Engineering spec for the builder:**
   - the data model (scene, items, relations, requests, levels);
   - what's reused from Cook and Find it, and which new building blocks are needed;
   - the lab;
   - the test harness, including the automated leak bot (a no-Kutchi bot must fail the ear star in more than 90% of rounds);
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

## 6. Rules for you

- **Only create your one file**, `docs/modes/<mode-id>-design.md`. Don't edit any other file, and don't commit: other agents work in this checkout, and the orchestrator commits.
- Coordinate by respecting the other modes' core verbs, so the mechanics don't overlap:
  - Cook = build;
  - Find it = search;
  - Tidy up = arrange;
  - Dress up = style;
  - Nani's clinic = treat;
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
