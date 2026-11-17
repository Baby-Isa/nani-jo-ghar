# The first night: runbook

For the session that runs the first build in the new repository. You have not seen the conversation that led here. Read this page, then `BRIEF.md` and `CLAUDE.md` in the same folder. Where they disagree, `BRIEF.md` wins and you say so in the handover.

Zafar's go, 17 Nov 2026: build until he can play the rebuilt chai. There is no hard stop.

## The two repositories

| | Path | What you may do |
|---|---|---|
| **Old** | `/home/user/nani-jo-ghar` (GitHub `Baby-Isa/nani-jo-ghar`, live at `https://baby-isa.github.io/nani-jo-ghar`) | Read and play. Copy only the paths listed below. Change nothing. |
| **New** | `/home/user/nani-jo-ghar-game` (GitHub `Baby-Isa/nani-jo-ghar-game`, private, empty but for a README) | Everything is built here. |

Old chai plays at `lab.html?mode=cook&game=chai-tray&level=1&nonav=1` on the old site, or from the old folder served locally.

## What tonight produces

1. The new repository populated with the carry-over.
2. The architecture page and a one-page build plan.
3. The engine skeleton: the shared conversation scenes, the runner, the stove-top family layer, and chai's rules with no screen.
4. Chai's middle game, playable, with real art and real family voices. The order and the serve are plain stand-ins with the automatic serve.
5. The judge's ten differences beside old chai, the reviewer's verdict, and a handover for Zafar.

**The exit test** (this, not "no bugs", is tonight's bar):
- the robot plays chai's rules cleanly at all four levels, including "nothing is taken or turned before the green";
- the reviewer gives pass or fail on each of the ten coding rules;
- chai's middle game plays from the first pick to the last pour on a phone-size screen, at level 1 at least;
- the judge has listed the ten most obvious differences from old chai.

The run ends when step 9 below is done. A chai that matches old chai exactly is the next milestone, not tonight's.

## Roles and models

| Role | What it does | Model |
|---|---|---|
| **Orchestrator** | Runs this page, launches the others, merges nothing it has not checked, reports every 30 minutes, writes the handover. Never writes game code. | Top model |
| **Populate session** | Step 1 only: copies the carry-over and proves it. | Mid-tier |
| **Grammar-table session** | Step 2 only: documents, in the old repository's `docs/next-repo/`. Touches no code. | Top model |
| **Lead builder** | Steps 3 to 8. The only one who writes code in the new repository. | Top model, high effort |
| **Reviewer** | Gates 1 and 2 and the final verdict. Reads against the ten coding rules only. Never the builder. | Top model |
| **Judge** | Step 9. Looks at new chai beside old chai. Never the builder. | Top model |

One lead builder. No second builder on the engine, whatever the hour. Every launch states the model, the effort and the estimated cost. Expected total: $150 to $350. Pause and report if the total reaches the ceiling Zafar set (default $500).

## The steps

Steps 1 and 2 run alongside each other. Steps 3 to 9 run in order.

| # | Step | Who | Done when |
|---|---|---|---|
| 1 | **Populate.** Copy the carry-over (below) into the new repository. Add `CLAUDE.md`, `docs/BRIEF.md`, `docs/check-script.md` from `docs/next-repo/`. Commit and push. | Populate session | The language engine's tests pass in the new repository (`build/lang/engine.test.mjs`, `fill.test.mjs`). Nothing outside the list was copied. |
| 2 | **The grammar table.** Each of the 28 patterns in `grammar-ladder.md` gets its modes from the 24 in `games-map-review.md`: primary in at least two, with the rung each mode reaches. Rows Mum has not answered are marked "waits on Mum" and get no design. | Grammar-table session | One table, written to `docs/next-repo/grammar-table.md`. Gaps listed plainly. |
| 3 | **The plan.** `docs/architecture.md` (one page: the three layers, the scenes, the three places, the ten rules) and a one-page build plan: the files to be made, what each holds, in what order. | Lead builder | Both pages exist. No code yet. |
| 4 | **Gate 1.** The reviewer reads both pages against `BRIEF.md` section 4. | Reviewer | Pass. A fail goes back to step 3. |
| 5 | **The skeleton.** The runner and its list of scenes. The conversation scenes as shared modules with their slots and the two settings (who speaks; how the serve works). The family layer: hob, knob, the heat rule, shelf or tray, the cook scene's box. Art loaded by id only. Chai's rules as plain code with no screen. | Lead builder | The robot plays chai's rules at levels 1 to 4. |
| 6 | **The check script, steps 1 to 4 and 6** (`check-script.md`): code structure, art, words and grammar, the robot, one full play. Step 5 waits for chai's look. | Lead builder | `check chai` runs and prints its tick list. |
| 7 | **Gate 2.** The reviewer reads the skeleton. | Reviewer | Pass or fail per rule, with file and line. Fails are fixed before step 8. |
| 8 | **Chai's middle game.** Picking from the shelf, pouring, the boil and the green, the pour into each person's glass: as old chai plays, level 1 first, then levels 2 to 4 while time allows. Phone size (740x320) and laptop size (1280x665). Real art by id, real voices through the language engine. The order and serve are stand-ins. | Lead builder | The exit test's third line. The check script passes. |
| 9 | **The judge and the final verdict.** The judge is given old and new chai at the same moments, both sizes, and one instruction: "You are Zafar. List the ten most obvious differences, worst first. Would you sign this off?" Before it counts, plant one known fault (shadows off) and confirm the judge names it in its first three lines. The reviewer gives its final verdict on the ten rules. | Judge, reviewer | Both written to the handover. |

If a step fails twice, stop adding to it, write what happened, and take the simpler route. Do not patch round it.

## How chai is rebuilt

- **Read and play old chai; never copy its code.** It is the reference for behaviour: `js/cook/stations/chai-tray.js`, `js/cook/mechanics/boil.js`, `pour.js`, `pan.js`, and its settings `data/stations/chai-tray.json` and the chai recipe in `data/cook.json`.
- **`docs/next-repo/chai-standard.md` is the inventory**: 105 lines of what chai does, to walk so nothing is lost. It is not a checklist to pass tonight.
- **Chai's middle does not change.** No new deciding words, no new steps.
- **Keep the same drawing library** (Phaser, `js/vendor/phaser.min.js`) as plain files with no build step, unless Zafar said otherwise.
- **The ten coding rules apply from the first file** (`BRIEF.md` section 4): size limits, no game named in shared code, rules apart from drawing, no Kutchi typed in code, no fix-list references in comments.
- **Where old chai's numbers are needed** (speeds, the green band, sizes), put them in chai's one settings file.

## What is copied from the old repository

| What | Old path |
|---|---|
| The language engine, its data and tests | `js/core/lang/`, `data/lang/`, `build/lang/` |
| Family recordings and their lists | `assets/audio/family/`, `assets/audio/word/`, `data/family-audio.json` |
| The art list | `data/art/` |
| Art files: every approved piece, plus the stand-ins chai's list names (31 chai pieces: 20 approved, 11 stand-in), with the kit, shelf and people pieces chai shows | the files `data/art/registry.json` names, under `assets/art/` |
| Fonts | `assets/fonts/` |
| The drawing library | `js/vendor/phaser.min.js` |
| Language documents | `docs/language/` |
| Game designs | `docs/game-design/` |
| Vision | `docs/vision.md` |
| Curriculum research | `build/reports/research-language-targets-2026-10-31.md`, `research-topic-wordlists-2026-10-31.md` and `.csv`, `research-word-inventory-2026-10-31.md` and `.csv`, `research-verbs-grammar-2026-10-31.md`, `games-master-map-2026-10-31.md`, `word-groups-map-2026-10-31.md`, into `docs/curriculum/` |
| The planning drafts | `docs/next-repo/` (all files; `grammar-ladder.md`, `grammar-in-play.md`, `games-map-review.md`, the modes tables and `grammar-table.md` into `docs/curriculum/`) |
| The routines | `.claude/skills/feedback`, `mum-round`, `art-run` (feedback is rewritten later, per `BRIEF.md` section 5; do not run the old one) |

**Never copied:** any game code (`js/cook/`, `js/shared/`, `js/clinic/` and the rest), `css/`, the fix list, `build/tools/`, `build/sandbox/`, `build/lint/`, sprint files, decisions logs, reports other than those named, screenshots, `sources/`, the prototypes, the old `CLAUDE.md`.

Family voices and pictures are private. Nothing from the repository is sent to any outside service.

## Decisions overnight

Zafar's answers to the six "still needed" decisions are in `BRIEF.md` section 10; if he gave none, the recommended option stands. For anything else that comes up, take the recommended or simplest option, do not widen the scope, and log it. Never decide: Kutchi wording, new art, removing a mechanic, anything in chai's eight questions about the order and serve.

## Reporting every 30 minutes

One short message, plain words:

```
Step 5 of 9: the skeleton. About 60% through.
Done since last time: the runner plays the scene list; chai's rules pass at levels 1 and 2.
Next: levels 3 and 4; then the check script.
Problems: none.   Cost so far: about $90.
```

Say plainly if a step is stuck, has failed a gate, or the cost is heading past the estimate.

## The handover to Zafar

One message, flaws first, in this order:

1. **What to play:** the link (GitHub Pages if the plan allows it on a private repository; otherwise a temporary link), which levels work, and what to look at: the feel of the picks, the pour, the boil and the green. What to ignore: the order and serve, which are stand-ins.
2. **What was not reached,** in plain words.
3. **At most four pictures:** new beside old, at the same moment.
4. **The judge's ten differences,** with a space beside each for his own.
5. **The reviewer's verdict:** the ten rules, pass or fail, one line each.
6. **The robot's result** and the check script's tick list.
7. **Decisions taken overnight,** numbered, each reversible by "undo 3".
8. **The cost.**
9. **What he does next:** play it and send a voice note; play old chai and correct the 14 principles by voice; answer chai's eight questions.

Then rewrite `docs/now.md` in the new repository: where things stand and the next step.
