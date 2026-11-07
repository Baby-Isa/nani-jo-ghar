# H Supply and roll-out

**The question:** how do art, voice and a new family arrive?

## H1 Art

#### STD-H1-01 · Art is made in ChatGPT runs Zafar supervises: Claude writes one paste block, he runs it and approves what lands, Claude judges, cuts and wires
- **Why:** non-negotiable 8 (decision 77); no image-API art without his say-so
- **Scope:** House
- **Pattern / part:** P10 / -
- **Checked by:** doc:CLAUDE.md + doc:/art-run
- **See it:** -
- **Status:** agreed (decision 77)
- **Layer:** game · **Lives in:** `docs/design-language/art-pipeline.md` §15

#### STD-H1-02 · A paste block is generated from its pack's run spec, never written by hand, and the runner fetches and downloads its own references
- **Why:** "You need to stop this happening and codify it in a tool so you brief it the same way and it works each time" (Zafar, 5 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:artblock (--check --pushed)
- **See it:** -
- **Status:** agreed 5 Nov (reopened 6 Nov night)
- **Layer:** game · **Lives in:** `build/tools/art/artblock.py` · **Source rows:** ART-42

#### STD-H1-03 · The art queue always holds two days of paste blocks, about 240 pictures, ordered by family, the next family first
- **Why:** "I get 120 images a day ... it's better to keep chatgpt occupied" (Zafar, 2 Nov)
- **Scope:** House
- **Pattern / part:** P13 / -
- **Checked by:** gap: a queue-depth line in /handover counting `build/reports/art-queue.md`
- **See it:** -
- **Status:** agreed 2 Nov
- **Layer:** game · **Lives in:** `build/reports/art-queue.md` · **Source rows:** ART-35

#### STD-H1-04 · A family's art block is queued before its build, every target size stated, so landing the art changes data and not layout
- **Why:** prototype-to-game step 2 (Zafar, 2 Nov); "start with samosa and daar I think we'll need new artwork" (3 Nov)
- **Scope:** House
- **Pattern / part:** P10 / -
- **Checked by:** doc:docs/process/prototype-to-game.md + tool:artblock (--check)
- **See it:** -
- **Status:** agreed 2 Nov
- **Layer:** game · **Source rows:** ART-37, ART-38, ART-36

#### STD-H1-05 · Where a picture has not landed, a named placeholder from landed art stands in and the picture is a line in the art queue; code never draws what a picture should show
- **Why:** "a first draft from ChatGPT beats a code-drawn placeholder" (Zafar, 2 Nov); Sprint 18 decision 7 (7 Nov: landed art only, placeholders named); lesson R5
- **Scope:** House
- **Pattern / part:** P10 / -
- **Checked by:** check:art + gap: the audit listing every code-drawn effect (R5)
- **See it:** lab.html?mode=cook&game=chai-tray&level=2 (1280x665)
- **Status:** agreed 7 Nov
- **Layer:** game · **Source rows:** CK-06, CHAI-64, ART-31, ART-32, CHAI-79, CHAI-80, ART-59, DAAR-02, SEK-20, CHT-13, CHT-04, CHT-16, BO1-3

#### STD-H1-06 · Every picture is cut by the cutter and passes the art data check and the rim rules before it is wired
- **Why:** a counter strip beside the glass (ART-39); twelve fill frames swapped and drifting (CHAI-79); lesson R7
- **Scope:** House
- **Pattern / part:** P10 / -
- **Checked by:** tool:artcut + tool:artcheck + tool:artdespill + check:unit
- **See it:** lab/word-moment.html (1280x665)
- **Status:** agreed 4 Nov
- **Layer:** game · **Lives in:** `build/tools/art/artcut.py`, `build/tools/art/artcheck.mjs` · **Source rows:** ART-39, CHAI-79

#### STD-H1-07 · Every landed picture is measured for colour and look against the house palette before it is wired
- **Why:** artcolour.py, Zafar's yes (6 Nov); the stricter look, ART-45 to ART-55
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:art
- **See it:** -
- **Status:** agreed 6 Nov
- **Layer:** game · **Lives in:** `build/tools/art/artcolour.py`

#### STD-H1-08 · A source picture is measured before it is cut, and one too small for its drawn size is redrawn large
- **Why:** his marble was 500x274 px, too small, so it was redrawn large (ART-40, 5 Nov); "Measure source assets, not only code" (Sprint 18 lessons, 7 Nov)
- **Scope:** House
- **Pattern / part:** P11 / -
- **Checked by:** tool:artcheck (bg) + gap: artcheck.mjs comparing each source to its largest drawn size
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** game · **Source rows:** ART-40

#### STD-H1-09 · A register lists every character pose the code loads, and a pose not yet redrawn in the house style is a line in the queue
- **Why:** "we should be collating all the poses we've used"; "are these just old models that haven't been re-drawn like nani has been?" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** P10 / -
- **Checked by:** gap: a pose-register check (every pose the code loads is listed)
- **See it:** -
- **Status:** agreed 1 Nov (open)
- **Layer:** game · **Source rows:** ART-34, ART-33

## H2 Voice and words

#### STD-H2-01 · Every word a game needs and lacks is on Mum's recording sheet, grouped by family, generated from the engine's gaps
- **Why:** prototype-to-game, "Mum's recording sheet" (Zafar, 2 Nov); the sheet is generated, never hand-kept
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:recordings
- **See it:** -
- **Status:** agreed 2 Nov
- **Layer:** shared kit · **Lives in:** `docs/language/recording-sheet.md`, `build/tools/ops/recordings.mjs`

#### STD-H2-02 · A round of Mum's recordings goes through one tool into clips, the manifest and the engine, and the next question sheet is built from what is still missing
- **Why:** CLAUDE.md, `/mum-round` (Mum is the authority, non-negotiable 2)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:mumround + tool:mumsheet + doc:/mum-round
- **See it:** -
- **Status:** agreed (decision 99)
- **Layer:** shared kit · **Lives in:** `build/tools/ops/mumround.mjs`, `data/family-audio.json`

#### STD-H2-03 · A store build plays only family clips; the device voice is a stand-in while testing
- **Why:** non-negotiable 2 (Zafar, 3 Nov: never in a store build)
- **Scope:** House
- **Pattern / part:** P14 / -
- **Checked by:** contract-17 + gap: the store-build flag that makes every fallback silent (checks-to-build, "No device voice in a store build")
- **See it:** -
- **Status:** agreed 3 Nov (before the store run)
- **Layer:** shared kit · **Lives in:** `js/core/voice.js`

#### STD-H2-04 · A game is store-ready only when its deciding words are recorded by the family and its leak bot is green on them
- **Why:** the Kutchi gate, prototype-to-game step 8 (Zafar, 2 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:leak + check:recordings + gap: a Kutchi gate (each game's deciding words against `data/family-audio.json`)
- **See it:** -
- **Status:** agreed 2 Nov
- **Layer:** shared kit

#### STD-H2-05 · Every sound effect comes from the recorded sound library by name and never plays over a family line
- **Why:** "play me all the sounds" (Zafar, 6 Nov); his picks wired through one sound file with the voice gate
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:voicegate + check:static/voice
- **See it:** lab/juice.html (1280x665)
- **Status:** agreed 6 Nov
- **Layer:** shared kit · **Lives in:** `js/shared/sfx.js`, `js/shared/juice.js` · **Source rows:** CHAI-92, CHAI-87

## H3 A family's entry checklist

#### STD-H3-01 · Every sprint polishes one reference with Zafar and rolls out the last sprint's reference to its whole family
- **Why:** "ensure our sprint plan is recorded nicely and we'll try stick to it this time" (Zafar, 2 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:docs/process/prototype-to-game.md + doc:/sprint
- **See it:** -
- **Status:** agreed 2 Nov (the chain slid one sprint, 7 Nov)
- **Layer:** shared kit · **Lives in:** `docs/sprints/plan.md` · **Source rows:** led:1.11-10

#### STD-H3-02 · A family enters by the eight steps of prototype-to-game, from its list of games and words to the Kutchi gate
- **Why:** prototype-to-game "Every family, step by step" (Zafar, 2 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:docs/process/prototype-to-game.md
- **See it:** -
- **Status:** agreed 2 Nov
- **Layer:** shared kit

#### STD-H3-03 · A family's page lists every game against its reference: its code, the kit calls it uses, its open rows, its words and where each is first met
- **Why:** prototype-to-game step 1; the kitchen family's page (3 Nov, renamed 7 Nov)
- **Scope:** Family
- **Pattern / part:** - / -
- **Checked by:** doc:docs/game-design/families/kitchen.md + tool:audit
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** game · **Lives in:** `docs/game-design/families/kitchen.md` · **Source rows:** DAAR-36, SEK-22, MAA-19, CHT-17, SAM-28

#### STD-H3-04 · Each game's roll-out starts with its gap page, rule by rule on the proof scale, with the next step for each gap
- **Why:** "every area is broken down rule by rule" (Zafar, 5 Nov, v2 §8); Sprint 18 wave 2 (7 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** gap: audit.mjs --standard (Sprint 17's tool builder)
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** game

#### STD-H3-05 · Each gap page names what not to touch: every mechanic he has not commented on, and his keep list
- **Why:** non-negotiable 1; "a do not touch list of what you liked" (v2 §4, locked 5 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:/brief standing lines
- **See it:** -
- **Status:** agreed 5 Nov
- **Layer:** game · **Source rows:** KEEP-21

#### STD-H3-06 · A rule a reference teaches goes into the standard, the kit or a check, never into one game
- **Why:** prototype-to-game step 4; "What the onboarding does in principle for all games" (SH-146, Zafar, 3 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:stdids + doc:docs/process/prototype-to-game.md
- **See it:** -
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Source rows:** SH-146, led:1.11-7

#### STD-H3-07 · A fix to a kit piece reaches every copy of it now, and each copy folds into the shared kit in its family's roll-out
- **Why:** Sprint 17 decision 6 (the spotlight bug fixed in every copy, SH-197); prototype-to-game "Once, in Sprint 17" 2
- **Scope:** House
- **Pattern / part:** - / the light
- **Checked by:** tool:teachgate + tool:kitmap
- **See it:** -
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Source rows:** SH-197, led:1.6-18

## H4 Open items

#### STD-H4-01 · A question for Zafar goes to the questions page as a numbered decision with a recommendation, and is never guessed
- **Why:** CLAUDE.md, "Where things live" and the working agreement
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** doc:CLAUDE.md
- **See it:** -
- **Status:** agreed (decision 99)
- **Layer:** game · **Lives in:** `docs/questions.md` · **Source rows:** CHAI-76, ART-41, DAAR-12

#### STD-H4-02 · A word for Mum is a numbered question on her sheet, and until she answers the game shows its English in grey
- **Why:** non-negotiable 2 (Zafar, 3 Nov: missing Kutchi as grey English, logged on the sheet)
- **Scope:** House
- **Pattern / part:** P14 / -
- **Checked by:** check:recordings + check:words
- **See it:** lab.html?mode=cook&game=chai-tray&level=4 (1280x665)
- **Status:** agreed 3 Nov
- **Layer:** shared kit · **Source rows:** LNG-23, R6-131, R6-134, R6-135, R6-136, R6-137, R6-138, R6-139, R6-141, R6-146, R6-18, R6-19, DAAR-26, SEK-18, MAA-15, MAA-16

#### STD-H4-03 · A row waiting on Zafar, Mum or art says so in its label and does not block a publish; every other open row does
- **Why:** decision 89 (13 Oct: "only rows that wait on Mum, art or Zafar stay open")
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:fixlist + tool:publishgate
- **See it:** -
- **Status:** agreed 13 Oct
- **Layer:** shared kit · **Source rows:** CHAI-63, ART-32

#### STD-H4-04 · Something he leaves to user testing is closed with his words as its reason, not left open
- **Why:** "let's leave that for now and I'll just check it with user testing" (Zafar, 1 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** check:fixlist
- **See it:** -
- **Status:** agreed 1 Nov
- **Layer:** shared kit · **Source rows:** CHAI-53

#### STD-H4-05 · Every source ID that became no rule is on the dropped list for him to read whenever he likes, blocking nothing
- **Why:** Sprint 17, the rest, "Close" (Zafar, 7 Nov)
- **Scope:** House
- **Pattern / part:** - / -
- **Checked by:** tool:stdids (--stitch)
- **See it:** -
- **Status:** agreed 7 Nov
- **Layer:** shared kit
