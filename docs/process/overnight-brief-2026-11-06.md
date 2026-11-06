# Overnight brief: 6 Nov 2026 (Friday), ready by 10:30 UK

**From Zafar (6 Nov, about 01:40):** "Make a handover to a new chat, which will start by running all of the above independently as
much as it can (some will be detailed reports ready for me in the morning to review and then say yes implement - add implementation
plans to the report so they are ready to go) ... Have it all done by 10:30am UK time today (Friday) ... I won't input overnight. Be
generous in using fable for judgment and double checks (this time you can be generous, it's not a future rule)."

## How to run (read first)

- **Branch.** Everything so far is on `claude/vibrant-hopper-v3yexp` (pushed; `main` = live, 20261106T011831Z). Start from it:
  `git fetch origin claude/vibrant-hopper-v3yexp && git checkout -B <your session's branch> origin/claude/vibrant-hopper-v3yexp`.
  Push your work to your session's branch; publish to `main` only where a task says so (`/publish`, the gate forced on his word as
  on 5 Nov, said in the log line).
- **No questions to Zafar tonight.** Where a decision is his, write it into the morning report as a numbered decision with a
  recommendation; build only what he already said yes to (tasks 1 and 5's tool).
- **Restarts:** a `send_later` check-in every 30 minutes (it survives a restart) and a line in `docs/process/overnight-log.md` at each
  step (`- 2026-11-06 HH:MM UK · overnight · done / next`). `node build/tools/review/checks.mjs` before every push.
- **Fable generously** (his words, tonight only): a Fable judge or second reader on every report and every built change, flaws first.
  Opus high for building and writing. Note each launch's model and rough cost in the morning report.
- **Every report** ends with an **Implementation plan** (files, steps, checks, size, risk) so his "yes, implement" can start at once,
  and a **Proof** section (the docs check needs it).
- **Morning report** by 10:30: a new report in build/reports named overnight-2026-11-06: one page: what is done and live, each report's link with
  its decisions (numbered, "yes to all except ..."), launches and costs. Then `/handover`.

## The tasks, in order

1. **Pills that fit their word (SH-219, his "do it now for chai so no surprises later").** The shelf chip's width from its content
   (the word's measured width plus the speaker and padding; a speaker-only chip narrower), so a crowded row (L4, ten items, 740x320)
   can grow its words towards the 13 CSS px floor (today 8.6 px there). The rule stays: the floor, at most 1.5x, never touching.
   Chai only (`js/cook/stations/chai-tray.js`, the shelf section). Prove at L1-L4, the four sizes and 971x318 (a measurement table
   of word sizes before and after), contract run, Fable judges the shots. **Publish.**

2. **The colour and look tool (his yes, 6 Nov).** `build/tools/art/` (python): for any image or cut-out: (a) its main colours matched
   to Sanzo Wada's 159 colours (the open GitHub transcription Fable used, vendored into the repo as data) and the house family
   (combinations 283, 249, 311; `build/reports/s17-palette-review.md`), off-palette flagged; (b) Fable's "looks AI-made" checks
   (`build/reports/s17-fonts-review.md` "Gemini's critique"): light direction by quadrant luminance (upper-left, the art bible),
   rim or edge finish (near-white halo at the alpha edge), baked shadow (reject), batch consistency on one surface (gloss, lid
   family, specular), proportion once real heights exist; (c) a contact sheet. Wire it into the art judge (`artjudge.py` FLAG/FAIL)
   and the paste blocks (`artblock.py`: the house colours named in words and a swatch strip as a reference; one edge-finish line).
   Tests in `build/tools/art/artcheck.test.mjs`. Then a **retrospective** over every asset in `assets/` (backgrounds, props, jars,
   characters, cards): a new report in build/reports named art-retrospective-2026-11-06 with the worst outliers, Fable's view, and a redo list.

3. **Fonts (his "no" to changing now: options first).** A Fable review of **where writing appears across the game** (every surface:
   order card, item card, pills, Nani's box, bubbles, the pop-up, end screen, labs, buttons, the word moment, clinic, farm, the
   door, the book) and which font each area should use and why (early readers, Kutchi transliteration, sizes, the one-face-per-word
   question). **Mock 3-4 options on the real screens** (pixel-true CSS overrides, four sizes and 971x318), Fable ranks.
   a new report in build/reports named fonts-across-the-game-2026-11-06 with an implementation plan. Start from `build/reports/s17-fonts-review.md`.

4. **Sound and juice: the map (his "a decent version for chai ... helps us flesh out when and where and how all the sounds and
   juice comes from").** Fable maps **every moment in chai** (and the shared kit) where a sound or juice could go: each action,
   success, mistake, progress tick, the order, the word moment, transitions, the end screen; what is there now, what to add, what to
   leave silent and why. Principles with reasons (feedback for every action, never a verdict, the family's voice never masked,
   loudness and frequency for 3-7, phone speakers, reduced motion), cited from game-feel practice. Then the **chai version** as an
   implementation plan (sfx in `js/shared/sfx.js` synthesised or art-run assets; juice in the kit), and **the juice art run**: a
   paste block (`artblock.py`: a new pack spec and plan) for the juice sprites the map needs (sparkles, steam, splashes, ticks, a
   coin or star burst; halal, no sweets). a new report in build/reports named sound-and-juice-chai-2026-11-06. Build nothing in the game.

5. **The stove family's art run: about 400 items (his yes).** Research, per stove game (chai, maani, daar, chaat, samosa, sekelo,
   eggs at breakfast, baking, the corn stall, and the cake; `docs/game-design/families/stove.md`), the most popular and common
   dishes such a game could include in a Kutchi Khoja Shia home (halal, no pork or alcohol, no sweets as rewards), their main
   ingredients and tools; bank likely future ones. One shared list, de-duplicated, each item: name (English, and Kutchi where Mum's
   sheet has it, else blank), which games, view (side-on shelf item or top-down), new or a redo (the chai shelf's two batches are a
   redo: one batch, one light, one lid family, true relative size). Then the **paste file**: pack spec + art plan + block from
   `artblock.py` (sheets of items on one sheet, one camera, one light, the house palette, true relative sizes; the colour tool's
   checks in the judge). a new report in build/reports named stove-art-400-2026-11-06 (the list, the research's sources, the run's size and time) and
   the block in `docs/design-language/art-plans/`. Push the references so the block runs with nothing from him.

6. **If time remains:** start the chai standard's fill on the locked structure (`build/reports/s17-standards-structure-v2.md`,
   section 8: every area rule by rule; every rule tied to a check or tool): the glossary and the patterns first.

Also answer in the morning report, with Fable: do characters drawn from real people (Nani, the doctor) read less AI than invented
ones, and what that means for the art bible.
