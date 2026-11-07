# C Progression

**The question: how does it change over time?**

Four scales: within a round, across levels L1-L4, across the word ladder, across games and days. Two clocks move a child on: the
level (per game, from the rounds played) and the word ladder (per word, across every game). Both read once at a game's start and
change only between games (STD-C2-09, STD-C3-05). The numbers live in `data/rules.json` and `data/progress.json`, read through
`js/shared/rules.js` and `js/core/progress.js`; the values sheet names them. The rule block's shape: `README.md`, "The rule format".

## C1 Within a round

#### STD-C1-01 · While a contrasting pair of words is still supported, the round asks for them in a set teaching order, and at random once both are learned
- **Why:** CHAI-55 (Zafar, 1 Nov: "we should be strategic about when we introduce half ... Maybe the first person says half, and the second person says full")
- **Scope:** House
- **Pattern / part:** - / the order card
- **Checked by:** probe:CHAI-55
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player), 1280x665
- **Status:** agreed 1 Nov; every game (Zafar, 7 Nov)
- **Layer:** game (chai's `cups.amount.teach`; Sprint 18 may lift it to the kitchen kit) · **Lives in:** `data/cook.json` · **Impact:** wrong · **Source rows:** CHAI-55

#### STD-C1-02 · Within a round a word is modelled before the child is asked for it: the conversation before the order, the word moment before the kitchen
- **Why:** "The kitchen conversation plays before the order (model, then ask; Zafar, 14 Oct)" (easy-to-play principle 10); the word moment's place: STD-A3-02
- **Scope:** House
- **Pattern / part:** P8 / -
- **Checked by:** gap: a round-order contract (a model line or the word moment before the first ask of its word)
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` (labs.html: New player), 1280x665
- **Status:** agreed 14 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/conversations.js`, `js/shared/word-moment.js` · **Impact:** wrong

## C2 Across levels L1-L4

#### STD-C2-01 · Each level means the same in every game: L1 the core, L2 more of it, L3 other ways of saying it, L4 added complexity
- **Why:** the rulebook's level rules (Zafar's answers, 28-29 Oct: `docs/game-design/rulebook.md` §1)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/ladder + judge: a game's four levels side by side, New player, 1280x665
- **See it:** `lab.html?mode=cook&game=chai-tray&level=1` to `level=4`, 1280x665
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` (levels), `js/shared/rules.js` · **Impact:** wrong

#### STD-C2-02 · A game's one repeating thing counts 1 at L1, the game's most at L4 and even steps between, unless the game's own row sets a level
- **Why:** Zafar, 29 Oct round 4 ("pantry keep 3,4,5,6. maani 2,3,4,5. samosa: 2,3,4,6 ..."); the formula 1 + (most - 1) x (level - 1) / 3, rounded
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:unit
- **See it:** `lab.html?mode=cook&game=chai-tray&level=3`, 1280x665
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` (count), `js/shared/rules.js` (`Rules.count`) · **Value:** count by level (values.md B3) · **Impact:** wrong · **Source rows:** DAAR-37

#### STD-C2-03 · Decoys rise one a level from 1 at L1, and at L4 one decoy is a lookalike of a wanted thing
- **Why:** Zafar, 29 Oct round 1 ("from L1, one more a level where the space allows"); a game caps it by its space
- **Scope:** House
- **Pattern / part:** - / the shelf
- **Checked by:** check:unit + contract-37
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4`, 1280x665
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` (levels.decoys, lookalike) · **Value:** decoys (values.md C2) · **Impact:** wrong

#### STD-C2-04 · "No" asks come from L2, never at L1
- **Why:** the rulebook's L2, "more of it": "numbers; 'no' asks; one added item" (Zafar, 28-29 Oct)
- **Scope:** House
- **Pattern / part:** - / the order card
- **Checked by:** check:unit
- **See it:** `lab.html?mode=cook&game=chai-tray&level=2`, 1280x665
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` (levels.noAsks) · **Impact:** wrong

#### STD-C2-05 · The active order card's support drops by level: its Kutchi always written, its English dotted from L2, its picture blurred from L3 (the blur rule permitting), and the card never folds
- **Why:** Zafar, 29 Oct (chai's level rules, 7); a fully blanked card is a memory test (SH-110, Zafar, 26 Oct); the blur rule: STD-A2-03
- **Scope:** House
- **Pattern / part:** - / the order card
- **Checked by:** check:unit + contract-35 + gap: contract-35 still expects the 26 Oct ladder (no dots at L1-L2): retune it to `data/rules.json` levels
- **See it:** `lab.html?mode=cook&game=chai-tray&level=2` and `level=3` (labs.html: New player + Words known), 1280x665
- **Status:** agreed 29 Oct (the blur's ladder condition 3 Nov)
- **Layer:** shared kit · **Lives in:** `data/rules.json` (cardKutchi, cardEnglish, cardPicture), `js/cook/ui.js` · **Value:** card by level (values.md A2) · **Impact:** wrong

#### STD-C2-06 · Timing gets about 15% quicker with each level
- **Why:** "Cook's timers come from the level, set in data and getting about 15% quicker per level (H8)" (`docs/vision.md`, pillar 7); the rulebook's L1 "the gentlest timing"
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/ladder
- **See it:** `lab.html?mode=cook&game=chai-tray&level=1` against `level=4`, 1280x665
- **Status:** agreed (H8)
- **Layer:** shared kit · **Lives in:** `data/cook.json` (timing.levelSpeed) · **Value:** level speed (values.md B2) · **Impact:** feels bad

#### STD-C2-07 · A level only adds to the one before: no count goes down from one level to the next
- **Why:** the rulebook (Zafar's answers, 28-29 Oct): "L2 more of it", L4 "the most items"; his counts by game rise level by level (29 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/ladder + check:unit
- **See it:** -
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` · **Impact:** wrong

#### STD-C2-08 · A child moves up a level after 3 finished rounds in a row with the guide's hint at most once each, never moves down by itself, and a grown-up's pick always wins
- **Why:** Zafar, 29 Oct round 4 ("for now, make it easy to change"); only the guide's hint counts (STD-A2-05)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:unit
- **See it:** `labs.html` (pick a level), then three rounds of `lab.html?mode=cook&game=chai-tray&level=1`
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/rules.js` (`Rules.advance`), `data/rules.json` (advance) · **Value:** level up (values.md C2) · **Impact:** wrong

#### STD-C2-09 · The level never changes during a game, only between games
- **Why:** SH-207 (Zafar, 4 Nov: "word, ladder, effects should only take place after the game has ended"); the row names the level with the ladder
- **Scope:** House
- **Pattern / part:** P5 / -
- **Checked by:** gap: a level-freeze unit test (`ladder-freeze.test.mjs` covers the words only)
- **See it:** -
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/rules.js`, `js/cook/core.js` (save.levelUp) · **Impact:** wrong · **Source rows:** SH-207

#### STD-C2-10 · Chai's ladder: L1 one cup of its base words; L2 two cups, numbers, extras and "no"; L3 the teas' other names; L4 three cups and the amounts, taught first by the word moment
- **Why:** the rulebook's chai column (Zafar, 29 Oct); the amounts at L4 (CHAI-67, 3 Nov)
- **Scope:** Game
- **Pattern / part:** - / -
- **Checked by:** check:unit + contract-37 + judge: chai L1 to L4, New player, 1280x665
- **See it:** `lab.html?mode=cook&game=chai-tray&level=1` to `level=4`, 1280x665
- **Status:** agreed 29 Oct (the word moment 3 Nov)
- **Layer:** game · **Lives in:** `data/cook.json` (chai), `js/cook/stations/chai-tray.js` · **Impact:** wrong · **Source rows:** CHAI-67

## C3 Across the word ladder

#### STD-C3-01 · A word moves up only on a recall from the Kutchi alone: a right pick with no peek; a reveal of its picture, English or text never moves it
- **Why:** CLAUDE.md non-negotiable 4 ("Right picks while supported move a word's ladder", 29 Oct); "A reveal is free but logged ... so it never advances the word" (easy-to-play principle 7, 21 Oct)
- **Scope:** House
- **Pattern / part:** - / the word ladder
- **Checked by:** check:unit
- **See it:** -
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `js/core/progress.js`, `data/progress.json` (recallCues) · **Impact:** wrong

#### STD-C3-02 · A word's support fades over many meetings across visits, never after a few showings in one round
- **Why:** "Fade over days, not after 3 showings ... Reliable recognition takes 6-10 meetings across days" (easy-to-play principle 7; Zafar's yes, 21 Oct)
- **Scope:** House
- **Pattern / part:** - / the word ladder
- **Checked by:** check:unit
- **See it:** -
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `data/progress.json` (understand.advanceAfter) · **Value:** recalls to move a stage (values.md C3) · **Impact:** wrong

#### STD-C3-03 · Two misses in a row drop a word one stage, and a word once met never drops below its second stage
- **Why:** rule G23 (`data/progress.json`: "Two misses in a row drop a stage; once met, understanding never drops below floorOnceMet")
- **Scope:** House
- **Pattern / part:** - / the word ladder
- **Checked by:** check:unit
- **See it:** -
- **Status:** agreed (G23)
- **Layer:** shared kit · **Lives in:** `js/core/progress.js`, `data/progress.json` · **Impact:** feels bad

#### STD-C3-04 · A word's Kutchi shows under its shelf item until it is picked right three times in a row with no peek, then the speaker alone; a miss brings it back until the next right pick
- **Why:** SH-159 (Zafar, 29 Oct round 3: the word pill); the dots, the eye and the guide's help are help, never a right pick
- **Scope:** House
- **Pattern / part:** - / the word pill
- **Checked by:** check:unit
- **See it:** `lab.html?mode=cook&game=chai-tray&level=2` (labs.html: New player), 1280x665
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/rules.js` (`Rules.pillRun`), `js/core/progress.js` · **Value:** pill right in a row (values.md A2) · **Impact:** wrong

#### STD-C3-05 · The word ladder a game reads is frozen at its start and thawed at its end screen, while every right pick and miss is saved at once
- **Why:** SH-207 (Zafar, 4 Nov: "the item card started blurring halfway through playing ... word, ladder, effects should only take place after the game has ended")
- **Scope:** House
- **Pattern / part:** P5 / the word ladder
- **Checked by:** check:unit (`ladder-freeze.test.mjs`)
- **See it:** `lab.html?mode=cook&game=chai-tray&level=3` (labs.html: New player), 1280x665
- **Status:** agreed 4 Nov
- **Layer:** shared kit · **Lives in:** `js/core/progress.js` (freeze, thaw) · **Impact:** wrong · **Source rows:** SH-207, SH-195

#### STD-C3-06 · A word's big card holds longer while the order is said the less the word is known: longest when new, shortest once known
- **Why:** the rulebook's "The order said" row, from Zafar's answers (28-29 Oct): "the hold 1.5 s for a new word, 1.0 s learning, 0.6 s known"
- **Scope:** House
- **Pattern / part:** - / the pop-out
- **Checked by:** check:unit
- **See it:** `lab.html?mode=cook&game=chai-tray&level=2` (labs.html: New player), 1280x665
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `data/rules.json` (words.holdMs), `js/shared/rules.js` · **Value:** word hold (values.md A2) · **Impact:** cosmetic

#### STD-C3-07 · A word has one ladder across every game: a word met or learned in one game reads as met or learned in the next
- **Why:** "Difficulty is per word, not per level" (`docs/vision.md`, pillar 1); one progress model for every game (rule G23)
- **Scope:** House
- **Pattern / part:** - / the word ladder
- **Checked by:** check:unit + gap: a cross-game ladder check (a word learned in the pantry reads as learned in chai)
- **See it:** `cook.html?app=1&first=pantry&then=...` (labs.html: Walkthrough)
- **Status:** agreed (G23)
- **Layer:** shared kit · **Lives in:** `js/core/progress.js`, `js/cook/core.js` · **Impact:** wrong

## C4 Across games and days

#### STD-C4-01 · Every word that decides a round is met before it decides: in an earlier game, or in this game's own first meeting when no earlier game teaches it
- **Why:** `docs/process/prototype-to-game.md`, every family's step 1 (Fable's review, 2 Nov, Zafar's yes); the kitchen family's words table (3 Nov); SH-195 and SH-196 (the general first meeting)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** gap: a first-meeting map check (each deciding word's first game in the day plan against the games it decides)
- **See it:** `docs/game-design/families/kitchen.md`, "Words"
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Lives in:** `data/cook.json` (each game's words) · **Impact:** wrong · **Source rows:** SH-195, SH-196

#### STD-C4-02 · The next game loads behind the current one, so moving on never waits
- **Why:** SH-212 (Zafar, 5 Nov: "make sure every next game loads in the background of the current game so there's zero delay")
- **Scope:** House
- **Pattern / part:** P13 / -
- **Checked by:** tool:loadtime + gap: a next-game preload check (the next game's files fetched before the end screen)
- **See it:** `cook.html?app=1&first=pantry&then=...` (labs.html: Walkthrough), 1280x665
- **Status:** retired 7 Nov: doubles STD-F4-04 (its Why, gap and file moved there; was: agreed 5 Nov, to build before the store run)
- **Layer:** shared kit · **Lives in:** `js/shared/host.js` · **Impact:** feels bad

#### STD-C4-03 · Each game keeps its own level in the save; a grown-up's or a story day's pick sets it without moving the count
- **Why:** the level-up rule (Zafar, 29 Oct round 4; `data/rules.json` advance: "Kept per game in the save")
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:unit
- **See it:** `labs.html` (pick a level)
- **Status:** agreed 29 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/rules.js`, `js/core/save.js` · **Impact:** wrong
