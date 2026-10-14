# Docs index

Start with `CLAUDE.md`, then `docs/status.md` "Next chat". Open anything else only when a task needs it. Everything superseded is in `docs/archive/` (moved, never deleted).

## Every chat
- `status.md`: Next chat (the handover), the fix-list counts, what is live.
- `regressions.md` in `process/`: **the fix list**, the genuine things still to fix plus the keep list. Done rows: `archive/regressions-done.md`.
- `questions.md`: open questions for Zafar, each with a recommendation.
- Decisions live in the doc, row or check they change (the commit says "Zafar, <date>"); the old log, 1–99, is in `archive/decisions/`.
- `tools.md`: every tool in one table. The checks are the rules: `node build/tools/review/checks.mjs`.
- `process/checks-to-build.md`: the rules that should become checks, ranked; their text stays there until each check exists.

## The game
- `vision.md`: pitch, audience, pillars, out of scope.
- `game-design/`: `story-and-arcs.md`, `cast.md`, `progression-and-scoring.md`, `speaking.md`; `modes/` one file per mode (`cook.md`, `clinic.md`, `first-launch.md`, `conversations.md`, `story-by-the-fire.md`, `find-it.md`, stubs for the parked modes), each with its own design decisions.
- `design-language/`: `ui-design-system.md` (shared screens and buttons), `ux-principles.md` (how the game teaches and feels), `guide-and-card.md`, `art-bible.md`, `art-pipeline.md` and `art-plans/` (the next art run: the Sprint 5 audit and its paste block, the clinic items and their views; finished packs are in `archive/art-plans/`), `tone-of-voice.md`, `audio.md`.
- `language/`: `grammar-notes.md` (what Mum confirmed), `lexicon.md`, `grammar-kb.md`, `engine-spec.md`, `engine-design.md`, `fill-the-engine.md`, `doctor-recording-list.md`, `mum-questions/` (the current round).
- `ideas.md`: the parking lot.

## How it is built
- `architecture/`: `target-model.md`, `shared-api.md`, `code-map.md`, `building-games.md`, `clinic-heal-api.md`, `cook-recipes-guide.md`, `evidence-loop.md`, `testing.md` (ports, browser-test lessons, the contract checks), `speech-recognition-plan.md`, `technical-plan.md`.
- `process/`: `checks-to-build.md`, `qa-checklist.md`, `mode-design-method.md`, `session-brief-template.md`, `cost-and-speed.md`, `overnight-log.md`.
- `sprints/`: the current sprint and `TEMPLATE.md` (closed sprints in `archive/sprints/`).
- The old rulebook: `archive/process/rules-2026-10-13.md`, with `archive/process/rules-redirect.md` saying where each letter of rules lives now.
