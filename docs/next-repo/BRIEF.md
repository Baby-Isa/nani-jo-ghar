# Brief for the new repository: Nani jo Ghar, built properly

For the lead agent of the new repository, and for Zafar to review first. Written 16 Nov 2026.
You have none of the project's history. This brief is self-contained. Read it whole, then `CLAUDE.md`.
Nothing here is agreed until Zafar says so. Section 10 lists what he still has to decide.

## 1. The project

- **What it is.** A game that teaches children Kutchi through play at their grandmother's house ("Nani jo Ghar"). Kutchi is a spoken family language with no written standard.
- **Who it is for.** Children of about 6 to 11 in families where the grandparents speak Kutchi and the children almost don't. Younger siblings play too.
- **The voices.** Only the real family is heard. Mum is the language authority. Nothing is invented.
- **The language target.** A2 listening and speaking for a child: about 1,000 words across 38 word groups, the most-used verbs, and 15 grammar patterns.
- **The platform.** A web app on GitHub Pages, later wrapped for the app stores.
- **Zafar.** He owns it and decides everything. He is not a programmer and works through AI. His time is the scarcest thing in the project.
- **Where it stands.** The old repository holds one game Zafar has signed off (chai, a stove-top cooking game), about sixty other playable games and prototypes below that level, a working language engine, the curriculum research and the art.

## 2. What went wrong before

Read this so it is not repeated.

1. **There was never a template.** Chai was one hand-built game. Nine others borrowed parts from it. Three attempts to "move games onto chai" each added shared parts to old games and left the old games in place.
2. **Moves were opt-in.** Anything not on the move list stayed old, silently. Maani's pan kept its own timer, so it could be turned before the green when chai's could not.
3. **Nothing ran the round.** Each game placed its own screen and ran its own order, cooking and serve. Shared code named games ("if chai … else if maani").
4. **"Done" was measured wrongly.** It meant checks green. It should have meant the old code deleted and Zafar's sign-off.
5. **Code was written as patches.** Games were single blocks of 1,200 to 2,500 lines with dozens of loose switches, written to close list rows.
6. **Every remark became a row, a test and a rule.** The result was 480 open rows, about 600 check scripts and a publish check of 2.5 hours. Things were still visibly wrong when Zafar opened a game.
7. **Tests read the code's claims, not the screen.** The shadow check passed a game with no visible shadows.
8. **Ten games were worked in parallel.** None reached chai's level.

## 3. Principles

1. **One game at a time, to Zafar's sign-off.** The scoreboard is "games he has signed off".
2. **Structure first.** The engine runs the game. A game is settings plus its own mechanic.
3. **Everything is chai's way unless the game sheet says otherwise.** Opt-out, never opt-in.
4. **A move ends with a deletion.** No old and new side by side in the code.
5. **Make the wrong thing impossible before writing a check for it.**
6. **Zafar's play is the proof.** Checks are a filter before he plays, not a substitute.
7. **Fast rounds.** Build, five minutes of checks, a link, his voice note. Aim for 30 minutes a round.
8. **Small documents.** One page each, written only when the next build step needs it.
9. **Never invent Kutchi.** Every line comes from the language engine and a family recording.
10. **Design carries the curriculum.** A game exists to carry words, verbs and grammar; its sheet says which.
11. **No process growth.** A new rule, check, tool or document replaces one.
12. **Say what you did not do.** Report flaws first, in plain words.

## 4. Architecture

The full page will be `docs/architecture.md`, one page, written at milestone 0 and checked by Zafar.

### The three layers

Dependencies go one way: a game may use the family engine and the shared kit; nothing lower knows anything higher.

1. **The shared kit (every mode).** Word card, order card, Nani's box, the first-time light and stuck help, sounds, the end screen, the language engine, and the two bottom rows: **the shelf** (side-on things stand on it) and **the tray** (top-down things lie on it). The shelf and tray draw their own shadows, word pills, spacing and face labels.
2. **The family engine (first: the stove-top kitchen).** It runs a round as a **list of separate scenes**:
   1. the order (who wants what; each card flies in as its phrase ends);
   2. the word moment, where there is one;
   3. the cook scene, which holds the game's own middle;
   4. the serve and thank-you;
   5. well done.

   It owns layout at every screen size, timing, the hob and knob, and the heat rule (nothing is taken or turned before the green). A caller can pass a different list, so story mode can skip or swap a scene. The old clinic is the model: five scene files run by one pipeline (`js/clinic/stages/`, `js/clinic/pipeline.js`).
3. **The game.** A settings file plus its own mechanic. The mechanic draws only inside the box it is given and answers three questions: what is the next right move, is this dish right, reset this dish.

### The three places on screen

- **The bottom row:** only things the child picks from. Shelf or tray, chosen in the game's settings.
- **The play area:** where the child works.
- **The serving spot:** inside the play area, where finished dishes sit with their face labels. Chai's glasses on their tray are this. (Where maani's plates go: decision 4.)

### Rules apart from drawing

The answers to "is this pick right?", "is the heat in the green?" and "is the order complete?" live in plain code with no screen. A robot can then play thousands of rounds in seconds. The old clinic pipeline already works this way; the old Cook games do not.

### Art by id

The engine shows a picture only by its id from the art list (`data/art/registry.json` in the old repo: 723 pieces, each with a status). A file path does not load. A store build refuses any piece not approved.

### The ten coding rules

1. Three layers, one direction. Shared code never names a game.
2. The engine runs the round as a list of scenes. A game never starts or ends a scene.
3. Rules are apart from drawing and run without a screen.
4. One place holds "where are we now": each scene has named states, not loose switches.
5. A game is a settings file plus its mechanic, drawn inside its box.
6. Art by id only.
7. Every sentence comes from the language engine. No Kutchi is typed in game code.
8. Numbers live in settings.
9. Size limits: a game's mechanic under about 400 lines, any file under about 600.
10. Comments say why, not history. No list references in code.

### Enforcement

- **By construction first:** the engine offers no other way (rules 2, 5, 6, 7).
- **By the check script, step 1:** file sizes, layers, game names in shared code, file paths, typed Kutchi, screen-measuring in a game file.
- **By the robot:** if it cannot play a game's rules without a browser, rule 3 is broken.
- **By a separate reviewer on the top model,** never the builder. It reads the code against the ten rules only and answers pass or fail per rule, with file and line. It reads at three points: after the engine skeleton, when chai matches, when maani is done. After that, every few feedback rounds.

**Over-engineering to avoid:** plug-in systems, options for cases no game needs yet, a second family engine before a second family is being built, a test per line.

## 5. How we work

### The play loop

1. Build one thing for the current game.
2. Run the check script: one run, six steps, 5 minutes at most (`docs/check-script.md`).
3. Send Zafar a link and at most four pictures.
4. He plays and sends a voice note.
5. `/feedback` keeps his words in a feedback file and adds one plain line per point to the working list.
6. Fix, and go round again. His next play is the proof.

### The working list

One list, for the current game only, 30 items at most, in `docs/now.md`. Three states: now, next, dropped. The old fix list is an archive: when a game's turn comes, its old rows get one pass (still true, gone with the rebuild, or dropped by Zafar).

### Fixes

Every fix names its home first: the engine, the kit, a setting or the game's mechanic. A patch in a game is allowed only for its mechanic. At a size limit, tidy before adding.

### Checks

The check script is the only gate before Zafar plays. Its steps, in order: code structure, art, words and grammar, game rules by robot, the standard's measurable rules, one full play. Everything else runs nightly and never blocks.

A check is added only when all of these hold:
- the engine cannot make the bug impossible;
- the same kind of bug has reached Zafar twice, or he could never see it by playing (Kutchi, voices, rare combinations);
- it fits one of the six steps and the 5-minute budget, or it replaces one.

### The by-eye judge

One look per game beside chai, when Zafar thinks the game is close, and nightly. No checklist. The instruction is: "You are Zafar. List the ten most obvious differences from chai, worst first. Would you sign this off?" Yes-or-no items (a shadow, a face's position) belong to the check script, not the judge. Before a judging run counts, plant a known fault (for example, shadows off); if the judge does not name it in its first three lines, fix the set-up.

### Mum's rounds, weekly

The word counter lists the words that are primary in the next two games and not yet recorded. That list goes to Mum each week. Recordings cost no AI time and are the true critical path: about 380 of the engine's 1,215 entries are confirmed today.

### Art runs

Art is made only in ChatGPT runs Zafar supervises. Claude plans one paste block, he runs it and approves, Claude cuts and wires. For each game, he approves one contact sheet of its latest pieces before the build.

### Decisions

Put to Zafar as one numbered list with recommendations ("yes to all except …"). His answer is written into the document it changes, with his name and the date. There is no separate log.

### Launches

Every launch states the model, the effort and the cost. One lead builder owns the engine. No parallel builders on shared code.

## 6. The documents

| Document | Where | Limit |
|---|---|---|
| Vision | `docs/vision.md` | 1 page |
| The standard ("chai's level") | `docs/standard.md`, with its long form `docs/standard-full.md` | 1 page; the long form about 3 |
| The architecture and the ten rules | `docs/architecture.md` | 1 page |
| A game sheet per game | `docs/games/<game>.md` and its data `data/games/<game>.json` | 1 page |
| Now: the current game and working list | `docs/now.md` | 30 items |
| The grammar ladder | `docs/curriculum/grammar-ladder.md` | as drafted |
| The modes table and word counter | `docs/curriculum/modes-table.md`, generated | generated |
| The check script | `docs/check-script.md` | 1.5 pages |
| Zafar's feedback, his words | `docs/feedback/<date>.md` | one per play |

**The standard, in two forms.** The draft `chai-standard.md` has 105 rules and is the builder's and judge's reference. Zafar confirms a top-20 summary, one page, from his own play of chai. Where chai falls short today (the order scene's art and animation, the serve scene) the standard records what he wants, marked "Target", not what chai does.

**A game sheet holds:** what the child does, step by step; what is on screen and where (the three places); shelf or tray; its ChatGPT mock-up as the target picture, with a note of where the mock breaks the rules; its levels; its "teaches" list; whether it is a starter game.

## 7. Curriculum

**What we are solving for.** Every word, verb and grammar pattern on the target list has a game where it is the point, enough other games where it comes round again, and a family recording; and no game carries too little or too much.

**The single source of truth** is each game sheet's "teaches" list, kept as data. Each line is:
- a word, verb or pattern, by its id in the language engine or the grammar ladder;
- its role: **primary** (the game cannot be won without understanding it, so the leak test applies), **secondary** (heard and used, not deciding), **tertiary** (heard in passing);
- the level it enters at.

**The word counter** is generated from those lists, the target word list, the engine's word list and the recordings list. Nothing in it is typed by hand. Its views:
- by word group: target, primary somewhere, heard in three or more games, recorded, gaps;
- by game: primary, secondary and tertiary counts, verbs, patterns, a verdict;
- by word: which games, in which role, recorded or not;
- by grammar pattern: which games, and on which rung;
- plan against reality: what a sheet says and what the built game really says.

**Starting rules** (to tune once two games are rebuilt):
- every target word is primary in at least one game and heard in at least three;
- no word group is carried only as tertiary;
- every grammar pattern is primary in at least two games;
- a game carries roughly 8 to 25 primary words and 2 to 4 patterns, or is marked "starter" on purpose (maani is one);
- a store build has no word without a family recording.

**Enforcement.** Step 3 of the check script fails when a sheet names a word the engine does not hold, a game is outside its load band without the starter mark, or the built game and its sheet disagree. Coverage gaps are a report, not a fail, until the first store set is chosen (decision 5); then they are the gate for that set.

**The grammar ladder** (`grammar-ladder.md`): 15 patterns in order. The grammar must decide the move, frames repeat with one slot changing, and nothing is explained to the child. Today most patterns are heard in Cook and the clinic but decide nothing.

**The modes table** (`modes-table.md`, `.json`): 82 games with what makes each different and fun, and their primary, secondary and tertiary word groups. It is the starting data for the counter. It works by word group today; the move to single words happens game by game as sheets are written.

## 8. The build order

Steps run back to back. Each ends at a review point with Zafar.

| # | Milestone | What is done | How it is proved | What Zafar does |
|---|---|---|---|---|
| 0 | **Set-up** | The new repository with only the carry-over list (section 9). The architecture page, the standard's summary, chai's game sheet, this CLAUDE.md. The check script's steps 1 to 3 working. | The check script runs on an empty game. The reviewer passes the architecture page against this brief. | Answers section 10. Plays chai once with the prompt list and corrects the standard. Approves chai's art contact sheet. |
| 1 | **The engine, with clean chai** | The shared kit and the stove-top engine, with chai as the first game. The middle game, item cards and side panel match old chai exactly. The order and serve scenes are separate scenes that behave as today. | Old and new chai side by side: Zafar cannot tell them apart. The robot plays chai's rules. The reviewer passes at the skeleton and at the match. Chai's mechanic is within the size limit. | Approves the lead builder's one-page plan. Plays in short rounds. Signs off. |
| 1b | **The two scenes** | The order scene's art and animation and the serve scene are brought to the standard's targets. | His play. | Feedback rounds. Signs off. |
| 2 | **Maani** | Built new from its game sheet, on the tray, as a starter game. | The engine needed no change beyond what the sheet said in advance. The reviewer passes. | Picks the plates spot from a phone-size mock. Plays. Signs off. |
| 3 | **One day (the vertical slice)** | Nani at the door gives a reason, then chai, then maani, then the evening book. Links are five-second family-voiced lines. Installed on a phone. | He plays the whole day on his phone. A child plays it. | Plays. Watches a child play. |
| 4 | **Eggs** | The third game, on the shelf. | No engine edit at all. If so, widen. | Plays. Signs off. |
| 5 | **Widen** | Two or three games at a time, each from its sheet, one builder per game, none touching the engine. | Per game, as milestone 2. | Chooses the order from the word counter. |

After milestone 1 the names are swapped, so the live address serves the new repository. The old one stays read-only.

**Decide before milestone 3, because they reach into the modes:**
- a mode can be started with given people, order and level, and hands back a result;
- how long one round and one day should last;
- word and pattern progress is shared across modes;
- what pocket money is for;
- no reading is needed to move between games.

## 9. Carry over, and leave behind

**Carry over** (paths in the old repository):

| What | From |
|---|---|
| Vision, trimmed to a page | `docs/vision.md` |
| Curriculum research | `build/reports/research-language-targets-2026-10-31.md`, `research-topic-wordlists-2026-10-31.md` and `.csv`, `research-word-inventory-2026-10-31.md` and `.csv`, `research-verbs-grammar-2026-10-31.md`, `games-master-map-2026-10-31.md`, `word-groups-map-2026-10-31.md` |
| Game designs | `docs/game-design/` (modes, days, story and arcs, cast) |
| The language engine, its data and tests | `js/core/lang/`, `data/lang/`, `build/lang/` |
| Language documents | `docs/language/` (grammar notes, grammar KB, lexicon, engine design, recording sheet) |
| Family recordings and their lists | `assets/audio/family/`, `assets/audio/word/`, `data/family-audio.json`, `data/lang/clips.json` |
| The art list and its approved pieces | `data/art/`, the files it names under `assets/art/`, `docs/design-language/art-bible.md`, `art-registry.md`, the art board `lab/art-board.html` |
| The clinic's pipeline, as the pattern | `js/clinic/pipeline.js`, `js/clinic/stages/` (to read) |
| The routines | `.claude/skills/feedback`, `mum-round`, `art-run` (feedback rewritten to section 5) |
| These drafts | `docs/next-repo/` |
| Settings to read for each game's sheet | `data/cook.json`, `data/stations/<game>.json` |

**Leave behind** (they stay in the old repository, read-only):
- all game code, as code. Old chai and old maani are played and read as references, never copied;
- the fix list and its archive (`docs/process/regressions.md`, `docs/archive/`);
- the check tooling (`build/tools/`, `build/sandbox/`, `build/lint/`), the play rules, the proof-per-row loop and the check tiers;
- sprint files, decisions logs and reports (`docs/sprints/`, `docs/decisions/`, `build/reports/` apart from the files above);
- screenshots (`build/screenshots/`), art sources (`sources/`), stand-in and unused art until a game sheet asks for a piece;
- the prototypes and labs, which stay playable on the old site;
- the old `CLAUDE.md` and the process documents.

## 10. Open decisions for Zafar

Yes to all except …

1. **A new repository, private.** Recommended: yes, private, since it holds family voices and pictures. Name: `nani-jo-ghar-game` until the swap.
2. **Chai first, rebuilt cleanly,** matching exactly except the two scenes, which are improved straight after. Recommended: yes.
3. **The standard:** you confirm a one-page top-20; the 105-rule draft is the builder's reference. Recommended: yes. Its **18 gaps** need your answers (`chai-standard.md`, "Gaps"); the ones that block chai are 1, 4 to 7, 9, 10 and 17.
4. **Maani's plates** (the standard's gap 3). Recommended: a serving spot in the play area beside or beneath the tawa, chosen from a phone-size mock. The bottom row holds only the dough.
5. **The first store set.** Recommended: choose the smallest set of games that fully covers a few word groups, from the word counter, after milestone 3. Not every designed game.
6. **The grammar ladder's six decisions** (`grammar-ladder.md`, section 4). Recommended: yes to all, including the past tense staying at A2 for now.
7. **The starting rules and load bands** in section 7. Recommended: yes as a start, tuned after two games.
8. **Roll-tawa folded into maani's levels** (the modes table's suggestion 8; it changes a built game). Recommended: decide when maani's sheet is written.
9. **The modes table's other seven suggestions** for new games. Recommended: not now; revisit when the counter shows the gaps by word.
10. **Art:** do games rebuild on today's art, or wait for new kitchen and people art (the standard's gap 15)? Recommended: rebuild on today's approved art; swap by id later.
11. **A weekly Mum round,** starting now. Recommended: yes.
12. **A test with real children** after milestone 3: a few children, a week, to see what they keep. Recommended: yes.

## 11. What not to do

- Do not copy old game code. Read it, play it, rebuild.
- Do not start a second game before Zafar signs off the first.
- Do not run parallel builders on the engine or the shared kit.
- Do not add a rule, check, tool or document without removing or replacing one.
- Do not turn each remark into a row, a test or a rule.
- Do not let a file pass its size limit, or a shared file name a game.
- Do not fix in a game what belongs in the engine or the kit.
- Do not change chai's behaviour during its rebuild, beyond the two scenes after it matches.
- Do not invent Kutchi, type Kutchi in code, or ship a voice that is not the family's.
- Do not make art outside a run Zafar supervises, or load a picture by file path.
- Do not send Zafar long reports. Send a link, four pictures and a short list.
- Do not call anything done that he has not played.
