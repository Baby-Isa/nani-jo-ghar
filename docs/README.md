# Docs index

One line per doc. Start with `CLAUDE.md`, then `docs/status.md`. Superseded docs are in `docs/archive/` (moved, never deleted). Where a design doc disagrees with the rulebook, the rulebook wins.

## Start here
- `status.md`: where things stand, the plan, open feedback numbers, questions waiting on Zafar; its "Next chat" section is the handover.
- `decisions.md`: the lasting decisions, numbered and dated, each with the rule it became.
- `sprints/`: one file per sprint (goal, budget, sessions, small decisions, outcome, look back) and `TEMPLATE.md`; `S01-remedial-and-engine.md` (closing), `S02-play-and-fix-cook-clinic.md` (next).
- `vision.md`: pitch, audience, design pillars (the tie-breakers), out of scope.
- `ideas.md`: the parking lot, one line per idea; go through a mode's ideas with Zafar before calling it finished.

## Process (`process/`)
- `rules.md`: the rulebook (every standing rule once, with IDs). The 16 non-negotiables are in `CLAUDE.md`.
- `qa-checklist.md`: the definition of done: checks with IDs, auto or by eye, the screenshot matrix (tablets included), the results template.
- `regressions.md`: every past feedback item with status and how to check it.
- `session-brief-template.md`: what every build session's brief names (`build/tools/ops/brief.mjs` writes it).
- `mode-design-method.md`: how a new mode is designed (personas, five questions, leak patterns, doc template).
- `overnight-log.md`: the current run's timestamped log; earlier days are in `overnight-log/<date>.md`.
- `audits/`: dated audits (the 5 Oct docs audit that this rewrite followed).

## Game design (`game-design/`)
- `story-and-arcs.md`: the arcs (the Birthday first, day-out trips, standalone arcs), story beats, syllabus.
- `cast.md`: the characters, the family, the cats and Kasuku.
- `progression-and-scoring.md`: per-word progress, the bookshelf, badges, pocket money and upgrades.
- `speaking.md`: the speaking ramp and every natural speaking point per mode.
- `modes/README.md`: one line per mode and its state; then one file per mode: `cook`, `clinic`, `find-it`, `conversations` (+ `conversations-wiring`), `story-by-the-fire`, `first-launch`, and stubs for the parked `tidy-up`, `who-did-it`, `dress-up`, `monsoon-rush`, `snap`.

## Design language (`design-language/`)
- `ui-design-system.md`: tokens, grid, shelf band, order card, end pop-up (the shared half of Cook's design system).
- `ux-principles.md`: how the game teaches and feels (onboarding, help, feedback, badges).
- `art-bible.md`: the look (style, palette, light, cameras, scale, characters, set dressing).
- `art-pipeline.md`: how art is prompted, cut, named and checked, and the art tools; `art-plans/` the clinic heal art plan and its Chrome blocks.
- `tone-of-voice.md`: Nani's voice and on-screen text.
- `audio.md`: voices, recordings, sound.

## Language (`language/`)
- `grammar-notes.md`: everything Mum has confirmed about Kutchi grammar, dated; a corrections table at the end.
- `lexicon.md`: the words, with source and confirmation status; the live lexicon is `data/lang/`.
- `engine-spec.md`: the language engine's requirements and what 4a built.
- `engine-design.md`: the engine design (approved 1 Oct): a Kutchi engine in GF's style, its data formats and API.
- `grammar-kb.md`: what's known, guessed and unknown about each grammar feature, and the question that settles it.
- `fill-the-engine.md`: how to add words and rules, and how gaps become Mum's questions.
- `mum-questions/`: every round of Questions for Mum (a record; `README.md` says which are answered).
- `sources/`: outside material (the Gemini blueprints, research notes); hypotheses only, never evidence.

## Architecture (`architecture/`)
- `target-model.md`: the architecture as built: the core, the shared kit, the host and plug-ins, content as data.
- `shared-api.md`: the `js/core/` and `js/shared/` modules and their APIs.
- `building-games.md`: how to build a new mini-game, mode, arc or map place from existing parts.
- `code-map.md`: how the code is laid out: pages, folders, build scripts.
- `technical-plan.md`: the technical plan, brought up to date.
- `clinic-heal-api.md`: the contract for the clinic's heal games.
- `cook-recipes-guide.md`: adding ingredients, recipes, levels and stations as data.
- `speech-recognition-plan.md`: on-device speech recognition.
- `testing.md`: ports, test rules, lessons, and the tools tables (review, ops, art, R7).

## Feedback (`feedback/`)
- Dated play-test reports and reviews (`playtest-2026-09-23.md`, `modes-review-2026-09-25.md`, `cook-ui-feedback-2026-09-28.md`, `cook-playtest-2026-09-29.md`, `clinic-playtest-2026-09-29.md`, `clinic-playtest-2026-10-01.md`, `external-reviews/`). Every item is on the regression list. The voice-note transcripts are in `archive/feedback-transcripts/`: read the reports, never the transcripts.

## Archive (`archive/`, not read by sessions)
- `process/step1/` (the rules harvest and the step-1 reorganisation), `process/art-how-to.md` (the manual art method), `decisions/` (the full log to 5 Oct), `modes/` (the parked modes' full designs), `architecture/` (superseded plans), `feedback-transcripts/`, and the older handovers, build logs, art prompts and design v1.
