# Where the rulebook's rules live now (13 Oct 2026, decision 99)

The rulebook (`docs/process/rules.md`) was retired: a rule that is not run gets forgotten, a check in code does not. Its full text is kept in `docs/archive/process/rules-2026-10-13.md`; `build/reports/rules-sort.md` Part A names the home of every single ID. By letter:

| IDs | What they were | Where they live now |
|---|---|---|
| Non-negotiables | the 16 | `CLAUDE.md`, word for word |
| A1–A30 | working with Zafar | `CLAUDE.md` Working agreement; the rest are the skills (`/feedback`, `/handover`, `/sprint`) or archived |
| B1–B21 | sessions, agents, git | `CLAUDE.md` 14; the tools that enforce them: `brief.mjs`, `publish.mjs`, `checkin.mjs`, `unpushed.mjs` (`docs/tools.md`) |
| C1–C23 | quality and review | the checks: `checks.mjs`, the sandbox and its contract checks, the evidence loop (`docs/architecture/evidence-loop.md`, `docs/architecture/testing.md`); the `judge` agent; `/review` |
| D1–D30 | art and assets | `docs/design-language/art-pipeline.md`, `art-bible.md`, `/art-run` |
| E1–E38 | game design, every mode | `docs/design-language/ux-principles.md` |
| F1–F24 | UI and visual design | `docs/design-language/ui-design-system.md`, `guide-and-card.md` |
| G1–G25 | language, Kutchi and voice | `docs/language/lexicon.md`, `engine-spec.md`, `docs/design-language/audio.md`, `/mum-round` |
| H1–H55 | modes, story, progression | the mode docs (`docs/game-design/modes/`), `story-and-arcs.md`, `progression-and-scoring.md` |
| I1–I15 | characters, family, culture | `docs/game-design/cast.md`, `docs/design-language/audio.md` |
| J1–J11 | platform, privacy, release | `docs/architecture/technical-plan.md`, `docs/vision.md` |
| Rules that should be code | 22 checks | `docs/process/checks-to-build.md` keeps their text word for word until each check exists |

Every rule an existing check already enforces (62 of them) is now just that check.
