# Step 1: docs mapping (for Zafar's review at Gate A)

Every doc → **keep** (move to its new home), **merge** (its live content moves into the new doc named; the file then goes to the archive), **record** (a dated record kept whole) or **archive** (nothing live left). Nothing moves until you approve. Files are moved in a way that keeps their full history, and nothing is deleted.

Three read-only passes checked every file for decisions, design content and past feedback before any "archive" verdict. What they found is already harvested into two new files on the branch, `docs/decisions.md` (138 dated decisions, plus Claude's unconfirmed assumptions listed apart) and `docs/process/regressions.md` (188 past feedback items with status and how to check each), and into the "harvest" column below. The full per-file notes are in the session scratchpad and can be committed if you want them.

**Result:** 105 Markdown docs today → about 45 live docs in a clear tree, plus dated records and the archive.

## The new tree

```
CLAUDE.md                      working agreement + non-negotiables (loads in every session)
README.md                      short front door → docs/README.md
docs/
  README.md                    index: one line per doc
  vision.md                    pitch, audience, pillars, out of scope
  status.md                    tracker, roadmap, open questions for Zafar
  decisions.md                 dated decisions log
  ideas.md                     parking lot
  game-design/
    story-and-arcs.md · cast.md · progression-and-scoring.md · speaking.md
    modes/README.md (index) · cook · clinic · conversations (+ wiring) · story-by-the-fire
          · first-launch · find-it · tidy-up · who-did-it · dress-up · monsoon-rush · snap
  design-language/
    art-bible.md · art-pipeline.md · ui-design-system.md · ux-principles.md · tone-of-voice.md · audio.md
  language/
    grammar-notes.md · lexicon.md · engine-spec.md (NEW) · mum-questions/ (the rounds)
  architecture/
    technical-plan.md · code-map.md (NEW) · shared-api.md · clinic-heal-api.md
    · speech-recognition-plan.md · cook-recipes-guide.md · testing.md (NEW)
  process/
    rules.md · rules-harvest*.md · qa-checklist.md · regressions.md
    · mode-design-method.md (NEW) · session-brief-template.md (NEW) · art-how-to.md (NEW)
  feedback/                    play-tests, reviews, external-reviews/
  archive/                     everything superseded (art-prompts/, build-logs/, handovers/ …)
```

## How merging works

- **Sections move word for word**, each with a "from: <old file> §" line. Step 1 doesn't rewrite design content.
- **Each moved doc gets a short "Stale points" box at the top** listing what `rules.md` now overrides (stars → three badges, quilt → bookshelf, *nar* → *na*, lolly → apple, hands out of Cook, Eid → Birthday…). The passes found these in almost every design doc. Full corrections happen when each mode is refactored in step 3.
- **Rewritten now, because they're live every day:** `status.md` (from STATUS-TRACKER, which has garbled cells and stale numbers), the root `README.md` (describes the 23 Sept fruit-bowl build) and the new index.

## Mapping table

### Project, status and handovers

| Doc | Verdict | Goes to | Harvest / reason |
|---|---|---|---|
| `STATUS-TRACKER.md` | keep (rewrite) | `status.md` | Master tracker; clean up garbled Language rows, stale %, voice star, *marcha*, hands-in-Cook row |
| `NEXT-CHAT-START.md` | merge | `status.md`, `vision.md`, `language/engine-spec.md` | Plan and current state → status; your aim → vision; step 2b language-engine requirements → engine-spec. From now on the handover lives in a "Next chat" section at the top of `status.md` (rewritten whenever a chat fills up), so there's one place to start |
| `design/plans-remaining-2026-09-29.md` | merge | `status.md`, `modes/cook.md` | Live items: pantry polish, station-select screen and day flow, Find it audit, first-launch re-run, Conversations wiring |
| `ORCHESTRATOR-HANDOFF.md` | merge | `decisions.md` | 25–26 Sept decisions; every rule already in rules.md; session log → archive |
| `HANDOVER-2026-09-26.md` | merge | `decisions.md`, `modes/first-launch.md` | Character-creation layout (person left, swatches right) is nowhere else |
| `HANDOVER-2026-09-29.md` | merge | `decisions.md`, `status.md` | Overnight decisions; open list |
| `overnight-log.md` | keep | `process/overnight-log.md` | Rule B6 still requires a timestamped run log; orchestrator-found flaws copied to regressions |
| `MORNING-SUMMARY.md`, `overnight-queue.md` | archive | `archive/handovers/` | Checked: the only decisions are in rules.md |
| `GAME-IDEAS-TBC.md` | keep | `ideas.md` | Add the quilt-making Big Ma arc row |
| `free-play-and-world-ideas.md` | merge | `ideas.md`, `vision.md` | Free-play per mode, places map, other languages later |
| `ideas-2026-09-28-arcs-and-focus.md` | archive | `archive/` | Checked: every point is in the Roadmap, the Cook design system or rules |
| `README.md` (root) | keep (rewrite) | root `README.md` (short), `architecture/code-map.md` | Architecture and build-script list move; the rest is 23 Sept history |

### Game design, story and modes

| Doc | Verdict | Goes to | Harvest / reason |
|---|---|---|---|
| `Nani jo Ghar — Project Brief.md` | merge | `vision.md`, `language/lexicon.md` | Pitch, why, audience, success ladder, pillars, non-goals; handout-rights table → lexicon |
| `Nani jo Ghar — Game Design.md` | merge | `progression-and-scoring.md`, `vision.md`, `audio.md`, `ux-principles.md`, `story-and-arcs.md`, `modes/first-launch.md` | Per-word stages, rejected mechanics, Grandparent mode, notebook, recording method, world and scene catalogue, blanket quest (seed of Big Ma's quilt arc) |
| `Nani jo Ghar — Roadmap and Story Structure.md` | merge | `story-and-arcs.md` (most), `ui-design-system.md`, `architecture/`, `progression-and-scoring.md`, `cast.md`, `regressions.md` | Arcs, story beats, syllabus S1–S6; layout contract; thin-shell spec; the 12 "Lessons" → regressions |
| `Nani jo Ghar — Cast.md` | keep | `game-design/cast.md` | Plus family descriptions from the old Image Prompt Sheets (Masi, Mama, Kaka, Kaki, Fui aren't in Cast today), cats' roles by mode, Big Ma's room |
| `game-modes-v2.md` | merge | `modes/README.md`, `progression-and-scoring.md`, `modes/cook.md`, `story-and-arcs.md` | Syllabus-first method, upgrade rules, Cook station table, Kutch specialities |
| `game-modes-fun-analysis.md` | merge | `vision.md`, `process/mode-design-method.md`, `modes/cook.md` | Personas, 10-point fun checklist |
| `modes/OVERVIEW.md` | merge | `modes/README.md` | Core-verb table per mode; family-words priority list → lexicon |
| `modes/MODE-DESIGN-BRIEF.md`, `DEEP-DIVE-BRIEF.md`, `MINIGAME-QUALITY-BRIEF.md`, `PIPELINE-BRIEF.md` | merge | `process/mode-design-method.md` | Personas, leak-pattern list, doc template, "cut to the best 6–8 per stage", pipeline worked example |
| `modes/BUILD-COMMON.md` | merge | `architecture/testing.md`, `session-brief-template.md` | Test-port table (8800–8807) is nowhere else |
| `modes/wave5a-brief.md` | archive | `archive/` | Checked: all 8 points are in rules E2–E4, E27 and the design system |
| `modes/REVIEW-2026-09-25.md` | record | `feedback/` | Independent review; its cross-mode overlap rulings go into the mode docs |
| `design/speaking-more-proposal.md` | keep | `game-design/speaking.md` | Approved 29 Sept; ramp detail and speaking points per mode |
| `design/cook-design-system-v1.md` | keep (split) | `ui-design-system.md` (§2–4, 6, 7, 10, 12, kit) + `modes/cook.md` (station specs) | Your "single source of truth" for Cook, split into the shared UI half and the Cook half |
| `cook-with-nani-phase-a-design.md` | merge | `modes/cook.md` | Station-by-station design, gesture audit, 16-dish list |
| `cook-with-nani-build-log.md` | merge | `modes/cook.md`, `progression-and-scoring.md`, `regressions.md` | Upgrade table ("sugar counting deliberately none"), bug table |
| `cook-with-nani-todo.md` | archive | `archive/` | Checked every ☐: tech-debt ideas → `ideas.md` |
| `cook-with-nani-kutchi-audit.md` | merge | `qa-checklist.md` (leak patterns, done), `modes/cook.md` | The origin of the leak test; open leak items |
| `cook-art-audit.md` | archive | `archive/` | Checked: gaps are in the tracker's art section |
| `modes/clinic-v2-design-sheets.md` | keep | `modes/clinic.md` (the spine) | Current clinic design (29 Sept) |
| `modes/clinic-design.md` (v1, 1,804 lines) | merge | `modes/clinic.md` | Live parts only: left/right ladder, speaking moments, safety checklist, album and upgrades, words needed, art list. The rest is superseded; whole file archived |
| `modes/conversations-design.md` + `conversations-wiring.md` | keep | `modes/conversations.md` (+ `-wiring.md` until wired) | Only Conversations design; your 26 Sept answers in §10a |
| `modes/story-by-the-fire-design.md` | keep | `modes/story-by-the-fire.md` | Current |
| `first-launch-story.md` | keep | `modes/first-launch.md` | Hook still says Eid (open question) |
| `find-it-design.md` | keep | `modes/find-it.md` | Plus the Roadmap's fruit-bowl errand |
| `modes/tidy-up-, who-did-it-, dress-up-, monsoon-rush-, snap-design.md` | keep | `modes/<mode>.md` | Parked designs; stale box lists stars, quilt, *nar*, old arc homes |
| 9 mode build logs (`clinic-`, `conversations-`, `dress-`, `find-`, `first-launch-`, `monsoon-`, `snap-`, `tidy-up-`, `who-build-log.md`) | merge | each mode's doc, "Build status" section | Leak-bot numbers and builders' decisions exist nowhere else; then → `archive/build-logs/` |
| `sidebar-design.md` | archive | `archive/` | Right-hand tab sidebar was replaced; two ideas (magnifier, notebook tab) → `ideas.md` |

### Design language and art

| Doc | Verdict | Goes to | Harvest / reason |
|---|---|---|---|
| `Nani jo Ghar — Art Bible.md` | keep (split) | `art-bible.md` (the look) + `art-pipeline.md` (§5 export, §9 prompts, §10 QA) | Stale box: liquids as discs (rule D11 says pictures), image-API transparency (D1 says ChatGPT), hands, quilt |
| `Nani jo Ghar — Asset Building Plan.md` | merge | `art-bible.md`, `art-pipeline.md`, `cast.md` | Ambient-motion table, East African set-dressing lists, cats, Big Ma's room; hands as "parked" |
| `Nani jo Ghar — Asset Naming Convention.md` | merge | `art-pipeline.md` | Naming scheme; old magenta slicing kept as "legacy" |
| `alive-nani-test-2026-09-23.md` | merge | `art-pipeline.md`, `architecture/testing.md` | ChatGPT drift-low prompt method; headless timing lessons |
| `art-direction-options.md` | merge | `decisions.md`, `ideas.md`, `art-pipeline.md` | 23 Sept 3D-look decision; juice list; style-lock test |
| `art-run-tonight.md` | merge | `process/art-how-to.md` | Per-prompt runner rules |
| `chatgpt-art-prompts.md` (batch 1) | merge | `art-pipeline.md` | Style-anchor prompt and templates later packs depend on |
| 9 other `chatgpt-art-prompts-*.md` | archive | `archive/art-prompts/` | Exact prompts behind shipped art (needed for re-prompts). Harvested: colour grounds, edit rules, registration, the 30 Sept paste block → art-how-to |
| `Nani jo Ghar — Chapter 1 Art Prompts.md` | archive | `archive/art-prompts/` | Retired storybook style; Eid-decoration beat mapping → `story-and-arcs.md` |
| `superseded/…Image Prompt Sheets.md` | merge | `art-pipeline.md`, `cast.md` | Templates (rewritten to 3D), family character descriptions |
| `superseded/…Build Brief v3 (Phaser rebuild).md`, `build-briefs/` (2) | archive | `archive/build-briefs/` | Checked: nothing unique |
| `UX-PRINCIPLES.md` | keep | `design-language/ux-principles.md` | Stale box: stars, green/red tick, per-card speaker, picture tally |
| `VISUAL-QA.md` | merge | `process/qa-checklist.md` (done in the draft) | One place for reviews |
| `cook-ui-feedback-2026-09-28.md` | record | `feedback/` | Word-review layout, Nani's mute button, chai layout → `ui-design-system.md` / `modes/cook.md` (not in the design system today) |
| `docs/cook-screens/` (11 jpg) | archive | `archive/cook-screens/` | Two are the Art Bible's anti-reference examples; links updated |
| `lab/PROMPTS.md` | archive | `archive/` | Frames done; `build/expressions.py` reference updated |
| — | new | `design-language/tone-of-voice.md` | Short: Nani's voice and on-screen text, from rules E27, E30, G6–G8 and the cast notes |

### Language

| Doc | Verdict | Goes to | Harvest / reason |
|---|---|---|---|
| `kutchi-grammar-notes.md` | keep | `language/grammar-notes.md` | The only record of the family's grammar; stale box: *marcha*, *chindo*, *hakri cup*, "repo private later" |
| `cook-word-changes-B.md` | merge | `language/lexicon.md` | Word choices (*chundo*, *aako*, chutney genders); flags its wrong "*hakri cup*" |
| `cook-with-nani-words.md` | archive | `archive/` | Handout vocabulary never confirmed by Mum → lexicon as "unconfirmed" |
| 5 `Questions for Mum` rounds (.md) | record | `language/mum-questions/` | Round 3 holds your ✓/⚠ marks; Round 4 is the live round (Section G = the doctor's script) |
| `Questions for Mum (Round 4).docx` | keep | `language/mum-questions/` | The copy Mum reads |
| Round 3 and Combined `.docx` | archive | `archive/` | Regenerable by `build/build_mum_questions_docx.js` |
| — | new | `language/engine-spec.md` | Your step-2b requirements (GF, Sindhi template, fill-the-engine rulebook); the design itself comes in step 2b |

### Architecture and process

| Doc | Verdict | Goes to | Harvest / reason |
|---|---|---|---|
| `Nani jo Ghar — Technical Plan.md` | keep | `architecture/technical-plan.md` | Stale box: says no engine (Cook uses Phaser), quilt entity, chunked recording (clashes with G9), IndexedDB profiles (only the legacy bowl page), 44 px targets |
| `shared-api.md` | keep | `architecture/shared-api.md` | Matches the code except §3 stars (legacy, to delete) and §6–7 stub swaps (history) |
| `clinic-heal-api.md` | keep | `architecture/clinic-heal-api.md` | Live contract |
| `speech-recognition-plan.md` | keep | `architecture/speech-recognition-plan.md` | Matches `js/shared/speech.js`; voice star stale |
| `cook-with-nani-recipes-guide.md` | keep | `architecture/cook-recipes-guide.md` | How to add stations and recipes as data |
| `process/rules.md`, `rules-harvest.md` | keep | same place | The rulebook and its source. Its own file paths (GAME-IDEAS-TBC, STATUS-TRACKER, VISUAL-QA, UX-PRINCIPLES, overnight-log) are updated with the moves, and H10 ("`cook-design-system-v1.md` is Cook's single source of truth") is reworded to its two new homes |
| `process/qa-checklist.md`, `process/regressions.md`, `decisions.md`, root `CLAUDE.md` | new | same place | The Gate A drafts, committed on the branch for your review |
| `process/step1-mapping.md` (this file) | archive after step 1 | `archive/` | A record of how the move was done |
| `process/rules-harvest-orch1/2/3.md` | record | same place | Already merged into rules.md |
| `feedback/*` (5), `playtest-2026-09-23.md` | record | `feedback/` | Dated play-tests; every item is on the regression list |
| `design/external-review-chatgpt-2026-09-28.md`, `design/external-review-gemini-2026-09-28.md` | record | `feedback/external-reviews/` | Outside advice, not your words |

## Code and data that point at doc paths

About 400 references in 207 files (code comments, data notes, test headers) name doc paths. **None are read when the game runs.** A script fixes every old path in the same commit as the moves, so every pointer stays correct. No behaviour changes; the quick automated tests are run to prove it.

## Questions for Zafar (answer "yes to all except …")

1. **New files in the tree:** `language/engine-spec.md`, `process/mode-design-method.md`, `process/session-brief-template.md`, `process/art-how-to.md`, `game-design/speaking.md`, `game-design/modes/README.md`, `architecture/code-map.md` and `testing.md`, `feedback/external-reviews/`. *Recommend yes.*
2. **`VISUAL-QA.md` folds into the QA checklist,** so reviews live in one place. *Recommend yes.*
3. **Merge word for word plus a "Stale points" box; don't rewrite design docs now.** Each mode's doc gets corrected properly when that mode is refactored in step 3. *Recommend yes.*
4. **Where a design doc conflicts with `rules.md`, the rulebook wins,** and the box says so. The main cases:
   - the Brief's "no timers in Nani's house" (Cook has level timers);
   - the English gist captions in story beats (E1 says no English for the child);
   - the clinic waiting room of 8–10 people at level 3 (H28 says at most 6);
   - the Art Bible's liquids as discs (D11 says pictures).

   *Recommend yes.* Say so if any of these should go the other way.
5. **Clinic:** the v2 sheets are the spine; the live parts of v1 are copied in; v1 is archived whole. *Recommend yes.*
6. **Mum's Word copies:** Round 4's stays beside its `.md`; the other two are archived (regenerable). *Recommend yes.*
7. **Path references** in code and data are updated by script in the same commit as the moves. *Recommend yes.*
8. **Wording:** `rules.md` says "Khoja Muslim" in the top rules and "Khoja Shia Muslim" in §9. *Recommend "Khoja Shia Muslim" everywhere.*
9. **Phone screenshots:** the rules say 390×844, which is a phone held upright. But the game is landscape (J2), and Cook shows a "please rotate" card on an upright phone (`css/cook.css`). An upright shot of Cook shows only that card. *Recommend shooting the phone at 844×390 (landscape) as the main phone size, plus one upright shot to check the rotate card*, and updating rule C2 and the checklist to match.

**Not needed for step 1:** the passes found about 40 open content questions. Examples: what "Hide and seek" is in Arc 1, whether the notebook and Grandparent mode are still planned, Busy/Relaxed Cook modes, the Excel's role, first launch still hooked on Eid before Mum records its lines, and a long list of words for Mum. They'll be listed in `status.md` under "Waiting on Zafar", grouped and each with a recommendation, for when you have time.

## After your approval (step 1d: carrying it out)

1. Moves and the path-fixing script: done by me.
2. Merges, run as three Sonnet sessions on separate folders, so there are no clashes:
   - `game-design/`;
   - `design-language/` and `architecture/`;
   - `language/`, `process/`, `vision.md` and `ideas.md`.
3. `status.md`, the index and the root README: done by me.
4. One Fable review of the finished tree, looking for lost content and broken links, before it comes back to you.
5. Merge into `main` (docs only; the game is unchanged).

**Estimate:** about 1.5–2M tokens, mostly on Sonnet.
