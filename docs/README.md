# Docs index

One line per doc. Start with `docs/status.md`. Superseded docs are in `docs/archive/` (moved, never deleted); where a design doc disagrees with the rulebook, the rulebook wins, and each doc's "Stale points" box says where.

## Start here
- `status.md`: where things stand, the plan, open feedback, questions waiting on Zafar; its "Next chat" section is the handover.
- `decisions.md`: every decision Zafar has made, dated, plus Claude's unconfirmed assumptions.
- `vision.md`: pitch, audience, design pillars (the tie-breakers), out of scope.
- `ideas.md`: the parking lot; go through a mode's ideas with Zafar before calling it finished.

## Process (`process/`)
- `rules.md`: the rulebook (every standing rule, once, with IDs). `rules-harvest*.md`: where each rule came from.
- `qa-checklist.md`: the definition of done: checks with IDs, auto or by eye, the screenshot matrix, the results template.
- `regressions.md`: every past feedback item with status and how to check it.
- `session-brief-template.md`: what every build session's brief contains.
- `mode-design-method.md`: how a new mode is designed (personas, five questions, leak patterns, doc template).
- `art-how-to.md`: making art in ChatGPT via Claude in Chrome, step by step.
- `overnight-log.md`: timestamped log of runs.
- `step1-mapping.md`, `step1d-progress.md`, `step1d-harvest/`: how the docs were reorganised (1 Oct); archive after review.

## Game design (`game-design/`)
- `story-and-arcs.md`: the arcs (the Birthday first, day-out trips, standalone arcs), story beats, syllabus.
- `cast.md`: the characters, the family, the cats and Kasuku.
- `progression-and-scoring.md`: per-word progress, badges, pocket money and upgrades.
- `speaking.md`: the speaking ramp and every natural speaking point per mode.
- `modes/README.md`: one line per mode, then one file per mode: `cook`, `clinic`, `conversations` (+ `conversations-wiring`), `story-by-the-fire`, `first-launch`, `find-it`, and the parked `tidy-up`, `who-did-it`, `dress-up`, `monsoon-rush`, `snap`.

## Design language (`design-language/`)
- `ui-design-system.md`: tokens, grid, shelf band, order card, end pop-up (the shared half of Cook's design system).
- `ux-principles.md`: how the game teaches and feels (onboarding, help, feedback, badges).
- `art-bible.md`: the look (style, palette, light, cameras, scale, characters, set dressing).
- `art-pipeline.md`: how art is prompted, cut, named and exported.
- `tone-of-voice.md`: Nani's voice and on-screen text.
- `audio.md`: voices, recordings, sound.

## Language (`language/`)
- `grammar-notes.md`: everything Mum has confirmed about Kutchi grammar, dated.
- `lexicon.md`: the words, with source and confirmation status.
- `engine-spec.md`: the language engine's requirements.
- `engine-design.md`: the engine design (step 2b, approved 1 Oct): a Kutchi engine in GF's style, its data formats and API.
- `grammar-kb.md`: what's known, guessed and unknown about each grammar feature, and the question that settles it.
- `fill-the-engine.md`: how to add words and rules, and how gaps become Mum's questions.
- `mum-questions/`: every round of Questions for Mum (Round 4 is the live one; `README.md` says which are answered).
- `sources/`: outside material (the Gemini blueprints, research notes); hypotheses only, never evidence.

## Architecture (`architecture/`)
- `target-model.md`: the target architecture (step 2a, approved 1 Oct): the core, the shared kit, content as data, modes as plug-ins.
- `gap-analysis.md`: today's code against the target, and the step 3 refactor plan ("Revised 1 Oct" box).
- `building-games.md`: how to build a new mini-game, mode, arc or map place from existing parts (step 3, R3b).
- `code-map.md`: how the code is laid out, pages, build scripts.
- `technical-plan.md`: the original technical plan (partly stale; see its box).
- `shared-api.md`: the `js/shared/` modules and their APIs.
- `clinic-heal-api.md`: the contract for the clinic's heal games.
- `speech-recognition-plan.md`: on-device speech recognition.
- `cook-recipes-guide.md`: adding ingredients, recipes, levels and stations as data.
- `testing.md`: test scripts, ports, headless-testing lessons.

## Feedback (`feedback/`)
- Dated play-tests and reviews: `playtest-2026-09-23.md`, `modes-review-2026-09-25.md`, `cook-ui-feedback-2026-09-28.md`, `cook-playtest-2026-09-29.md` (+ transcript), `clinic-playtest-2026-09-29.md` (+ transcripts), `clinic-playtest-2026-10-01.md` (+ transcripts), `external-reviews/`. Every item is on the regression list.
