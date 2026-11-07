# 0 Foundations

**The question: is it allowed, and for whom?**

Two areas. 0.1 points to CLAUDE.md's non-negotiables by number and never restates them (Zafar's locked structure, 5 Nov:
`build/reports/s17-standards-structure-v2.md`): CLAUDE.md is the text, these blocks say where each is checked. 0.2 says who the
game is for. A rule another domain forces from here (the leak test's hint wording, undo, the grown-ups' door) lives in its own area
with its Why naming the non-negotiable. The rule block's shape: `README.md`, "The rule format".

## 0.1 The non-negotiables

#### STD-01-01 · Every game meets non-negotiable 1 (what Zafar didn't comment on stays)
- **Why:** CLAUDE.md non-negotiable 1
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:/brief standing lines + doc:CLAUDE.md + gap: a diff check at /review that names every mechanic or mini-game a branch removes or replaces
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** game · **Lives in:** each game's own mechanic · **Impact:** wrong

#### STD-01-02 · Every game meets non-negotiable 2 (real family voices; Kutchi from the engine, never invented)
- **Why:** CLAUDE.md non-negotiable 2 (its rules for lines: STD-A4-01 to STD-A4-04)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-17 + check:words + check:recordings + check:static/words + check:unit
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** shared kit · **Lives in:** `js/core/lang/`, `js/core/voice.js`, `data/lang/` · **Impact:** wrong

#### STD-01-03 · Every game meets non-negotiable 3 (no written English for the child, but for its stated exceptions)
- **Why:** CLAUDE.md non-negotiable 3 (the card's English: STD-A2-02; the grown-ups' door: domain D, D5)
- **Scope:** House
- **Pattern / part:** P14 / -
- **Checked by:** contract-16 + contract-46 + contract-39
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** shared kit · **Lives in:** `js/shared/word-card.js`, `js/shared/order-card.js` · **Impact:** wrong

#### STD-01-04 · Every game meets non-negotiable 4 (the Kutchi leak test once words are past support)
- **Why:** CLAUDE.md non-negotiable 4 (what moves a word: STD-C3-01)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:leak + tool:leak
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** game · **Lives in:** `build/tools/review/leak-configs/` · **Impact:** wrong

#### STD-01-05 · Every change meets non-negotiable 5 (done means the judge's independent picture)
- **Why:** CLAUDE.md non-negotiable 5
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:CLAUDE.md + judge: every changed screen, by the judge agent and never its builder, before `main`
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** shared kit · **Lives in:** `build/tools/review/evidence.mjs` · **Impact:** unfinished

#### STD-01-06 · Every game meets non-negotiable 6 (one set of shared screens and buttons; no clipped text)
- **Why:** CLAUDE.md non-negotiable 6
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/kit + check:static/shell + contract-40 + contract-41 + contract-49 + contract-51 + contract-15
- **See it:** `lab/kit.html` (1280x665)
- **Status:** agreed 5 Nov (pointer)
- **Layer:** shared kit · **Lives in:** `js/shared/`, `css/shared/` · **Impact:** cosmetic

#### STD-01-07 · Every game meets non-negotiable 7 (nothing makes a child feel bad)
- **Why:** CLAUDE.md non-negotiable 7
- **Scope:** House
- **Pattern / part:** P9 / -
- **Checked by:** contract-21 + contract-12 + gap: an undo check (a placed thing taken back by a tap until the step moves on, in every game)
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** shared kit · **Lives in:** `js/shared/input.js`, `js/shared/results.js` · **Impact:** feels bad

#### STD-01-08 · Every picture meets non-negotiable 8 (art from the ChatGPT runs Zafar supervises)
- **Why:** CLAUDE.md non-negotiable 8 (decision 77)
- **Scope:** House
- **Pattern / part:** P10 / -
- **Checked by:** doc:/art-run + check:art + contract-6
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** game · **Lives in:** `assets/` · **Impact:** wrong

#### STD-01-09 · Every game meets non-negotiable 9 (the family's faith: food, clothing, markers, rewards)
- **Why:** CLAUDE.md non-negotiable 9 (internal only: never named in anything public)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/reward + judge: every new picture at its art run, for clothing, food and markers
- **See it:** -
- **Status:** agreed 5 Nov (pointer)
- **Layer:** game · **Lives in:** `data/`, `assets/` · **Impact:** wrong

## 0.2 Who it is for

#### STD-02-01 · Every game is playable by a child of 3 to 7: a three-year-old with a grown-up near, a seven-year-old alone
- **Why:** "3-7, a grown-up near, no reading, touch, the four sizes" (the locked structure, 0.2; Zafar, 5 Nov); his testers' 3-year-old "didn't know what to tap next" (`docs/game-design/easy-to-play.md`, 21 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** judge: a New player's first round at L1 at a child's pace, 930x430 + gap: a child-pace driver for every game (the sandbox's pause-after-tea is chai's only)
- **See it:** `lab.html?mode=cook&game=chai-tray&level=1` (labs.html: New player), 930x430
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** - · **Impact:** stuck

#### STD-02-02 · No step needs reading: every choice the child makes can be made from pictures and the family's voice alone
- **Why:** "Everything is audio-first, so a child who cannot read plays exactly the same game" (`docs/vision.md`, Accessibility); the locked structure's "no reading" (5 Nov)
- **Scope:** House
- **Pattern / part:** - / the word card
- **Checked by:** contract-16 + gap: a pre-reader run of the leak bot (written words hidden, the voice known) that must still finish every level
- **See it:** `lab.html?mode=cook&game=chai-tray&level=1` (labs.html: New player), 1280x665
- **Status:** agreed 5 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/word-card.js` · **Impact:** stuck

#### STD-02-03 · Every action is a tap, except a drag along a fixed track or a rub that starts on its target; nothing is dragged across the screen to its place
- **Why:** "under-5s find taps easiest and drags hard" (easy-to-play principle 5, Zafar's yes 21 Oct); "Yes hand for drag is fine" (SH-141, Zafar, 30 Oct)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** contract-44 + gap: an input check that every drag in a game starts on its target or runs in a track
- **See it:** `lab.html?mode=cook&game=chai-tray&level=1`, 740x320
- **Status:** agreed 21 Oct
- **Layer:** shared kit · **Lives in:** `js/shared/input.js` · **Impact:** stuck · **Source rows:** SH-141

#### STD-02-04 · Every screen works at the four sizes (740x320, 930x430, 1280x665, 1920x1080), with no exception for one size unless it is strictly required
- **Why:** CLAUDE.md, rapid prototype (Zafar, 27 Oct); CHAI-33 (Zafar, 3 Nov: no exception for 740x320, an unpopular size, unless strictly required); CHAI-86 (5 Nov: "so it all fits nicely on all screens"); laying out by height is STD-E1-01
- **Scope:** House
- **Pattern / part:** - / the frame
- **Checked by:** tool:panelcheck + tool:labcheck + doc:CLAUDE.md
- **See it:** `lab.html?mode=cook&game=chai-tray&level=4` at each of the four sizes
- **Status:** agreed 3 Nov (sizes 27 Oct)
- **Layer:** shared kit · **Lives in:** `js/shared/frame.js`, `css/shared/frame.css` · **Value:** four sizes (values.md 0.2) · **Impact:** stuck · **Source rows:** CHAI-33, CHAI-86

#### STD-02-05 · Nothing leaves the device: no accounts, uploads or analytics, and speech is recognised on the device
- **Why:** "Nothing leaves the device. No accounts, no uploads, no analytics" (`docs/vision.md`, pillar 9); checks-to-build J1
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:static/privacy + check:unit
- **See it:** -
- **Status:** agreed (vision pillar 9)
- **Layer:** shared kit · **Lives in:** `js/shared/speech.js`, `js/core/save.js` · **Impact:** wrong
