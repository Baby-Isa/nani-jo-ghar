# Step 1d progress (carrying out the docs reorganisation)

**If you are a session resuming after a limit or restart:** read this file first. Do only the unticked items in *your* section, tick each one as you finish it, and commit and push after every item (`git pull --rebase` first). Never redo a ticked item. The plan is `docs/process/step1-mapping.md` (old names); the move map is at the end of this file.

Branch: `claude/cool-albattani-7pbgd5`. Sessions (launched 1 Oct 00:04 UK, Sonnet): G `session_01G9W5cc2SPT69pxFCpAx9T7`, D `session_01VB243jrV1kL9orwskaUCNt`, L `session_01W6ZbXoqdfXAGGjatYhWbMF`; orchestrator `session_01AByCiJUWQHyiojceoysBgu` checks them every ~35 minutes and resumes any that stop. Nothing goes to `main` until Zafar approves the finished tree.

## Phase 1: moves and path fixes (orchestrator): done 1 Oct 00:15 UK

- [x] 100 moves with `git mv` (history kept; nothing deleted), including `docs/cook-screens/` → `docs/archive/cook-screens/`
- [x] 1,146 old doc paths rewritten in 335 files (code comments, data notes, test headers, docs); no runtime reads of docs anywhere
- [x] rules.md's bare doc names updated; H10 reworded to the two new homes
- [x] Quick tests pass unchanged (`test_shared_ui/order_card/save/buttons/rel/say`, `check_onboard`); all data JSON loads

## Phase 2: merges (three sessions, separate folders)

Each merge copies sections **word for word** with a `> from: <old file> §<heading>` line, and every moved or new design doc gets a **"Stale points"** box at the top listing what `docs/process/rules.md` now overrides (rule ID for each). The rulebook wins every conflict. Don't rewrite design content. Sources for merges are now in `docs/archive/`. The harvest notes per file are in `docs/process/step1d-harvest/` (A = process/feedback, B = game design, C = art/language/technical).

### Session G: `docs/game-design/` and `docs/design-language/ui-design-system.md` only
- [x] `game-design/story-and-arcs.md` (new) ← Roadmap (story sections, arcs, syllabus S1–S6), Game Design (world, scene catalogue, blanket quest), game-modes-v2 syllabus-first table, Chapter 1 Art Prompts Eid mapping
- [x] `game-design/progression-and-scoring.md` (new) ← Game Design per-word stages, notebook; Roadmap learning design, skill channels, procedural generation; game-modes-v2 upgrades; cook build-log upgrade table
- [ ] `game-design/cast.md` ← stale box; add family descriptions from the archived Image Prompt Sheets, cats' roles by mode and Big Ma's room from the Asset Building Plan, Roadmap recurring cast
- [ ] `game-design/speaking.md` ← stale box only
- [ ] `game-design/modes/README.md` (new) ← OVERVIEW core-verb table, one line per mode
- [x] `game-design/modes/cook.md` (new) ← ui-design-system.md station specs (§1, 5, 9–11, 13–15: **move** them out of that file, leave a pointer), phase-a-design, cook build log, game-modes-v2 §7, fun-analysis §5, plans-remaining A4, cook-ui-feedback chai layout, kutchi-audit open items, Round 2 dish table
- [ ] `design-language/ui-design-system.md` (Session G owns this file) ← after moving the station specs out: stale box; add the cook-ui-feedback-2026-09-28 word-review layout and Nani's mute button
- [ ] `game-design/modes/clinic.md` ← v2 sheets are the spine; add live parts of the archived clinic-design v1 (see harvest B row); clinic build log; stale box
- [ ] `modes/conversations.md`, `story-by-the-fire.md`, `first-launch.md`, `find-it.md`, `tidy-up.md`, `who-did-it.md`, `dress-up.md`, `monsoon-rush.md`, `snap.md` ← each: stale box; its build log appended as "Build status"; first-launch gets HO26 character creation

### Session D: `docs/design-language/` (except `ui-design-system.md`) and `docs/architecture/` only
- [x] `art-bible.md` ← stale box (liquids D11, API transparency D1, hands parked, quilt); keep §1–4, 6–8, cultural accuracy; **move** §5, §9, §10 to art-pipeline.md; add Asset Plan ambient motion and set-dressing lists
- [x] `art-pipeline.md` (new) ← Art Bible §5/§9/§10, Asset Naming Convention, Asset Plan hands (parked), batch-1 style-anchor and templates, pantry-jars cut/label method, colour-ground rules, alive-nani prompt method, playtest-23 animation research, Image Prompt Sheets templates, art-direction style-lock test
- [x] `ux-principles.md` ← stale box (stars, green/red tick, per-card speaker, picture tally)
- [ ] `tone-of-voice.md` (new, short) ← rules E27, E30, G6–G8, cast notes, speaking tone
- [ ] `audio.md` (new) ← Game Design recording method, multiple voices, sound design; rules G14–G17 by ID
- [ ] `architecture/technical-plan.md` ← stale box (Phaser, quilt entity, chunk_type, IndexedDB, 44 px, no manifest)
- [ ] `architecture/shared-api.md`, `speech-recognition-plan.md`, `clinic-heal-api.md`, `cook-recipes-guide.md` ← stale boxes
- [ ] `architecture/code-map.md` (new) ← root README's Architecture and Files sections; Roadmap thin-shell spec and storage rules
- [ ] `architecture/testing.md` (new) ← BUILD-COMMON test ports, alive-nani testing lessons, the rules on browser tests (B16) by ID

### Session L: `docs/language/`, `docs/process/`, `docs/vision.md`, `docs/ideas.md` only
- [x] `language/grammar-notes.md` ← stale box (marcha, chindo, hakri cup, "repo private later")
- [x] `language/lexicon.md` (new) ← cook-word-changes-B, handout vocabulary (marked unconfirmed), Brief handout-rights table, the Excel's role (open question)
- [x] `language/engine-spec.md` (new) ← NEXT-CHAT-START step 2b requirements, pointer to `language/sources/`; design itself comes in step 2b
- [x] `language/mum-questions/README.md` (new, short) ← which rounds are answered, where answers live
- [ ] `process/mode-design-method.md` (new) ← MODE-DESIGN, DEEP-DIVE, MINIGAME-QUALITY, PIPELINE briefs, fun-analysis checklist
- [ ] `process/session-brief-template.md` (new) ← rules B3, B4, B17, CLAUDE.md "Briefing a build session", BUILD-COMMON
- [ ] `process/art-how-to.md` (new) ← art-run-tonight rules, 30 Sept overnight paste block, batch3-cook edit rules, chat discipline
- [ ] `vision.md` (new) ← Project Brief (pitch, why, audience, success, pillars, non-goals), Game Design (rejected mechanics, Grandparent mode, age fit), fun-analysis personas, Roadmap design research, Zafar's aim (NEXT-CHAT-START §1); commercial model "open"
- [ ] `ideas.md` ← add quilt-making Big Ma arc; free-play ideas, sidebar magnifier and notebook, art juice list, todo tech-debt ideas, TTS-from-family-voices (parked, see decisions 30 Sept)

## Phase 3: orchestrator
- [ ] `docs/status.md` rewritten: "Next chat" section first; plan (steps 1–4 and the later docs clean-up); live state; open questions for Zafar (grouped, each with a recommendation); open regression rows by mode
- [ ] `docs/README.md` index; root `README.md` short front door
- [ ] Scripted check: every old file accounted for, every doc link resolves
- [ ] Fable review of the tree (lost content, broken links, stale boxes present)
- [ ] Zafar reviews → merge to `main` (docs only, bump version)

## Notes for the orchestrator

