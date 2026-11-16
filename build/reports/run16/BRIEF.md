# Run 16: the brief common to all ten sessions

## The run

You are one of ten cloud sessions in **run 16**, a 5-hour autonomous run for Nani jo Ghar. Zafar owns the game and approved this run. His words (16 Nov ~05:15 UK, decision 45): "Launch as many separate sessions as you need to - do categorisation, build checks that work (red then green) for every line that should have one, and then build all the solutions and test them and have them ready to merge by 5am Miami time ... the outstanding rows should be drastically reduced with proven fixes, the rest ready to merge."

The orchestrator is the cloud session that launched you. It:
- publishes to main at 06:00
- runs Fable's look at the published game
- merges the branches
- applies every result to the fix list

Before anything else, read CLAUDE.md. Its non-negotiables bind you; its "two builders at most" is lifted for this run only.

## Clock

`date` prints UTC, which is UK time in November. Times below are UK.

- **07:45:** the last new fix may start.
- **08:30:** builders stop, run checks, and push.
- **08:45:** proving and judging stop.
- **09:00:** every session has pushed its last commit and is idle. Do nothing after 09:00.

Push your branch at least every 30 minutes; a usage limit loses unpushed work.

## Your branch

You work on the branch this session was created with, `run16/<your name>`, cut from `ccr-2c4bd3c9-mncohx` at 48003532.
- Push only to your own branch: `git push -u origin HEAD`.
- Never push to main or to `ccr-2c4bd3c9-mncohx`.
- Never merge another session's branch into yours. You may `git fetch origin <branch>` and read files from it with `git show origin/<branch>:<path>`.
- End every commit message with:

  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_014xb3kQPhiJXAHjeT4WMdGS

## Files you must NOT edit

The orchestrator applies everything to these:
- docs/process/regressions.md (the fix list)
- docs/status.md
- docs/decisions/*
- CLAUDE.md

## Your results file

Report every row you handle in `build/reports/run16/<your name>.json`. It is a JSON array of objects, one per row:

```json
{ "row": "SAM-44", "kind": "Look", "game": "samosa", "status": "proven", "probe": "evidence spec key or test file",
  "red": "<commit where the check is red, and how you ran it>", "green": "<commit where it is green>",
  "judge": "machine | needs-eye | <judge verdict>", "files": ["js/cook/stations/samosa.js"],
  "note": "one plain sentence", "quote": "Zafar's later words + source, only for overridden" }
```

- **kind**, one of:
  - **Logic:** the game does the wrong thing.
  - **Look:** overlap, size, position, clipping.
  - **Teaching:** the leak test, the ladder, hints.
  - **Kutchi:** wording or a recording gap.
  - **Art:** needs a ChatGPT run.
  - **Check:** a tool, check or process fault.
  - **HisCall:** waiting on Zafar's decision.
  - **Parked:** clinic, the day, the parked modes, before-the-stores work.
- **status**, one of:
  - **open:** still true.
  - **built:** fixed, not yet proven.
  - **proven:** a check red before and green after, or a judge's pass for an eye row.
  - **overridden:** a later decision of Zafar's, quoted.
  - **duplicate:** of a named row.
  - **question:** needs his design choice. Never guess it; write the question in "note".
  - **cannot-probe:** with the reason.

## Checks: red then green

- A row's check must fail on the code before the fix **for the row's own reason** and pass after it.
- The fix list's probes live in `build/sandbox/data/evidence.json`, an object keyed by row id. Read its `_about`, `_expect`, `_capture`, `_at` and `_moments` keys for the format.
  - You may add or change the keys for **your own rows only**.
  - The orchestrator merges this file key by key, so don't reformat other keys.
- Runner: `node build/tools/review/evidence.mjs --plan --rows A,B` validates; `--run --rows A,B` plays.
- Cook unit-style tests in `build/` (`node --test ...`) are fine where the row is pure logic or data.
- A check that is green on the base means the row is already fixed. Find the commit and mark the row proven, citing it, or rewrite the check if it tests the wrong thing.

## Browser

- Your VM has its own Chromium. Run browser jobs under `flock -w 3600 /tmp/njg-browser-all.lock` with a `COOK_TEST_PORT` of your own (88xx).
- Use one browser job at a time on your VM.
- Don't run `playwright install`.

## Before every push

Run `node build/tools/review/checks.mjs`. A pre-push hook also runs check-push. Fix what you break before you push.

## Non-negotiables, in short

- Never invent Kutchi. Every line comes from the language engine; a gap is reported as a Kutchi row.
- Make no art and call no image APIs.
- Never remove or replace a mechanic.
- No design guesses: anything needing a choice becomes a "question".
- A builder never judges its own eye rows; the `judge` session does.
- Nothing of Zafar's feedback is closed without proof, or without his later decision quoted with its source.

## Hand-back

When done, or at 08:30 for builders and 08:45 for the others:
- Push your results file and a short `build/reports/run16/<your name>.md`: what is proven, built, open and questions, with flaws first.
- Then stop.

---
# Each session's own part

## sort (Fable)
Sort every live row of docs/process/regressions.md (about 547; leave the keep list alone).
- **Split:** use 4 subagents by prefix group, Cook first.
- **Cook rows:** CHAI, CK, DAAR, SAM, MAA, RT, CHT, SEK and the like, plus shared SH rows that touch the kitchen games.
- **Per row, write:**
  - kind and game
  - whether it should have a machine probe: yes, eye, or no
  - a verdict, one of:
    - still true in today's code (status open)
    - built (its own status says built; it needs proof)
    - overridden (a later decision of Zafar's: docs/decisions/*.md, the mode docs in docs/game-design/modes/, docs/feedback/; quote his words and the source)
    - duplicate (name the surviving row)
    - question
    - Parked
- **Checking "still true":** read the code. Don't guess.
- **Pushes:** push `build/reports/run16/sort.json` with the Cook rows **by 05:50**, then the rest **by 06:45**. The builders and the probe sessions read it from your branch.
- **No browser.**
- **Done:** every live row has one entry, and an md gives the counts by kind x game, before and after.

## probes-built (Opus)
Prove the rows whose own status says **built** but that were never proven; there are about 165. Cook rows go first, then shared, then the rest.
- Find them in regressions.md: their status column contains "built" while the label is "to fix".
- **Rows with an evidence spec:** run them (`evidence.mjs --run --rows ...`) on today's head.
- **Rows without a spec:** write one.
- **Proving red:** where you can find the commit that fixed a row (`git log -S`, the row's own note), run the spec on the commit before it (a worktree) to show it red.
- **Eye-only rows** (no machine expect possible): produce the sheets and leave a judge batch (`evidence.mjs --judge` writes build/screenshots/evidence/<run>/judge/batch-NN.md). Commit the batch and its sheets for the **judge** session, and mark the rows "needs-eye".
- **Statuses:** proven, failing (it is not fixed: status open, with what the check shows), or cannot-probe.

## probes-open (Opus)
Write the red-on-base checks for **open** Logic, Look and Teaching rows that have no evidence spec. Cook first.
- **Find the rows:** labelled "to fix: code" and not built. Use sort's file from origin/run16/sort once it lands, and row prefixes until then.
- **Skip** the rows the builders already own. Those are listed below under fix-kit, fix-daar, fix-samosa, fix-chai and fix-stove; the builders write their own checks.
- **Per row:** a spec in evidence.json (or a node test), shown **red on today's head for the row's reason**.
- **Pushes:** every 20-30 minutes, so the builders can take the rows for their games from your branch.
- **Results:** for each row, set "game" exactly to one of: kit, daar, chop, chaat, stir, samosa, roll-tawa, chai, chai-tray, maani, maani-line, sekelo, mishkaki, eggs, corn, baking, other.

## Builders: fix-kit, fix-daar, fix-samosa, fix-chai, fix-stove (Opus)
For each row:
1. Write a check that is **red on the base** (48003532) for the row's reason.
2. Fix the code.
3. The check goes **green**.
4. Run `node build/tools/tiers/check-change.mjs --base 48003532 --games <your games> --rows <your rows>`. It must exit 0 or show no new break; it writes before|after pictures and build/reports/tiers/change-<commit>.md.
5. For eye rows, leave the evidence judge batch for the **judge** session: `evidence.mjs --judge` after an `--after` or `--run`. Commit the batch and its sheets.

When you've finished your list:
- Take more rows for your games from origin/run16/sort and origin/run16/probes-open (`git fetch`).
- A row that needs a file you don't own goes in your results as "needs <owner>", left unedited.

**Before the 07:45 cut-off:**
- Start no new fix after 07:45.
- At 08:30, stop, run checks and push.
- In your results file, mark each finished row `"status": "built"` with its red and green.
- Write `build/reports/run16/<name>-ready.txt` listing the rows ready for the **prove** session.

### File ownership (strict: edit only what is yours)
- **fix-kit:** js/shared/**, css/shared/**, js/cook/*.js (Cook's core files, NOT js/cook/stations/), data/cook.json.
  - Rows: SH-267 (the dish card's flash; contract-119 red 31 times in eggs, corn, baking, chop and roll-tawa), SH-292 (the first-time light centred), DAAR-57/CHT-21 (ui.js stripMode: Nani's face alone in chop; a keepOrder option for Nana's line during chaat's chop), SH-232, CK-121 (eggs' side-panel rows closed and ticked at well done, all in view), the panel and plate parts of CK-132/CK-137 that live in the kit.
  - You are the only session that may touch shared files. Builders send their kit needs as "needs fix-kit" rows, and you pick them up from their branches every 30 minutes.
- **fix-daar:** js/cook/stations/{daar,chop,chaat,stir,tadka}.js and data/stations/{daar,chop,chaat,stir,tadka}.json.
  - Rows: DAAR-55 (chop's first-time light steady until the move starts), DAAR-56 (chop's finger travels the knife's path), DAAR-59 (daar's dressing pill words one size), DAAR-60 (daar at child pace: the first hidden pop-up card big to the middle, chopped vegetables' shadows), plus open chaat, chop, daar and tadka rows.
- **fix-samosa:** js/cook/stations/{samosa,roll-tawa}*.js and data/stations/{samosa,roll-tawa}*.json (also fill, fold and fry where they are samosa's own).
  - Rows: RT-01, RT-02, RT-03, RT-04, SAM-44, SAM-46, SAM-47, plus open samosa and roll-tawa rows.
- **fix-chai:** js/cook/stations/{chai-tray,maani-line}*.js and data/stations/{chai-tray,maani-line,maani}*.json.
  - Rows: MAA-28 (check first whether it is real; it is traced as maybe not), plus open maani and chai rows.
  - **Chai is FROZEN:** don't change chai's look or timing. Its boxes must stay identical (`node build/tools/review/frozen.mjs --diff`). A chai row that would change it is a "question".
- **fix-stove:** js/cook/stations/{mishkaki-grill,eggs,corn,baking}*.js and their data/stations/*.json.
  - Rows: CK-132 and CK-137 (corn: the face circles one size, the tray clear of the settings button at 740x320, the served cob as cooked, 'Shabash!' clear, 'Makai hane kadh.' with its light; their kit parts go to fix-kit), sekelo's rows that don't fold at well done (SH-308), plus open eggs, corn, baking and sekelo rows.

## judge (Fable)
You are the independent judge. Every 20 minutes:
1. `git fetch origin 'refs/heads/run16/*:refs/remotes/origin/run16/*'`.
2. Find new judge batch files on the other run16 branches: build/screenshots/evidence/*/judge/batch-*.md, and the before|after pictures in build/screenshots/tiers/change-*/.
3. Check out each branch's files into a worktree to see the pictures.
4. Judge with the `judge` agent on Fable (.claude/agents/judge.md), one batch per call, flaws first.

Also:
- Audit 10% of probes-built's and probes-open's new checks: does each one test the row's own words? A check that tests something else is a FAIL with the reason.
- Write verdicts to `build/reports/run16/judge.json`: row, branch, verdict PASS or FAIL, a one-line reason, and the panel cited.
- Push after each round. You never judge your own work and you never fix.

## prove (Opus)
Every 20 minutes, fetch the run16 branches. For each branch with a new `build/reports/run16/<name>-ready.txt`:
1. Check that branch out fresh in a worktree.
2. Run its rows' checks **twice**: the evidence specs or node tests from its results file.
3. Run `node build/tools/tiers/check-change.mjs --base 48003532 --games <its games> --rows <its rows>` once.

A row passing both times, with check-change exit 0, is **ready**. A flaky row (passes once) is **unproven**. A failing row is **bounced**, with the output.

Write `build/reports/run16/prove.json` (branch, commit, row, ready/unproven/bounced, why) and push after each round. You fix nothing.
