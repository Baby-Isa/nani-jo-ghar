# Structure review, 13 Oct 2026 (decision 98)

Read-only review of the docs against the structure set out on 1 Oct (`docs/archive/process/step1/step1-mapping.md`) and 5 Oct (`docs/archive/process/2026-10-05-docs-audit.md`). Token figures are chars ÷ 3.8. The repo clone is shallow (63 commits, all 13 Oct), so "then" sizes come from the 5 Oct audit, not git.

## 1. Flaws first

1. `docs/process/regressions.md` is 410 KB (~108k tokens), 7× the audit's 10k budget. 72% of it is the Status column; 160 KB (39% of the file) is the "· earlier:" history chain that `evidence.mjs --apply` keeps on 376 of 458 rows.
2. `rules.md` is 11.5k tokens against an 8k budget (§1–3: 3.9k against 1.5k). Since 5 Oct every decision became a rule paragraph of 60–90 words (C19–C23, A29, A30, E35–E38), so the rulebook is a second log.
3. `decisions.md` is 7.6k tokens against 2.5k: Zafar's answer lists are stored as one row each (97 has eight answers, ~230 words), and sprint-only clauses sit inside lasting decisions (96, 97, 98).
4. `status.md` is 3.7k tokens against 2k; only "Next chat" has an owner. "The plan" says Sprint 1→2 is next (Sprint 5 is live), "Where each part is" is dated 5 Oct, and "Waiting on Zafar" holds 27 items from 25 Sept on.
5. The sprint file became the run log: `S05-red-then-green.md` is 3,629 words (template: one line per session) with 25 timestamped check-ins pasted into "Sessions", beside the dated `overnight-log/` that `checkin.mjs --log` already keeps.
6. No budget from the 5 Oct audit was ever put in a tool, so nothing failed when a file grew.
7. The starting cost is almost all harness (~60k of ~63k). The docs work can cut the starting reads from ~3k to ~2k; the real doc cost sits in build sessions, judges and `/review` opening `regressions.md` (108k) and `rules.md` (11.5k).
8. Good: Cook and clinic rules already live in their mode docs with IDs kept; no "Stale points" boxes remain; the overnight log rotates by date; the skills are short (210–730 words).

## 2. Where we veered

| What 1 Oct / 5 Oct said | What is true now | Evidence |
|---|---|---|
| `CLAUDE.md`: working agreement + non-negotiables, ~1,200 tokens | 869 words, ~1.4k tokens (1.9k in `/context`). On budget; its "Working agreement" restates A1, A3, A7, A9–A11, A29 | `CLAUDE.md`:7–13 vs `rules.md`:39–57 |
| `rules.md`: 8k tokens, §1–3 ≤1.5k, no designs, no log | 7,318 words, 11.5k tokens; §1–3 3.9k; §4 2.2k, §6 1.2k, §8 1.3k | section sizes: §1 4.5 KB, §2 4.4, §3 4.5, §4 8.2, §5 2.9, §6 4.7, §7 4.0, §8 5.0, §9 1.6, §10 1.8 |
| `decisions.md`: current chapter only, one line each, 2.5k tokens | 86 rows, 5,456 words, 7.6k tokens; rows 87–98 are 100–230 words | rows 96, 97, 98 |
| `regressions.md`: ID/Issue/Status/Check/one Source, four statuses, 10k tokens (5 Oct: 252 rows, 15.9k) | 458 rows + keep/retired, 108k tokens; Status 294 KB, Issue 59 KB, Source 26 KB, Check 18 KB; 618 "earlier:" links | `awk` over the file; `PAN-01`'s Status alone is ~1,500 chars |
| `status.md`: 2k tokens; Next chat ≤600 | 2,353 words, 3.7k tokens; Next chat 1,050 tokens; stale plan table and 5 Oct part table | `status.md`:36–45, 70–81 |
| Sprint file: goal, budget, one line per session, small decisions, outcome, look back | S05 is 3,629 words of which ~2,500 are pasted check-ins; `S05-plan.md` (2,084 words) sits beside it | `S05-red-then-green.md`:12–86 |
| Mode docs hold their own rules (audit change 4) | Done for Cook (H10–H24, H49–H52) and the clinic (H25–H35); the heal ladders went to `clinic.md` on 13 Oct | `cook.md`:14, `clinic.md`:35, `rules.md`:203 |
| 44 "Stale points" boxes resolved | Done: none in live docs | grep |
| `overnight-log.md` rotated by date | Done | `overnight-log/` |
| `ideas.md` one line per idea, 1.5k tokens | 2,636 words | word count |
| Parked mode docs archived, stub left | Done; but `find-it.md` is 27,944 words (three 25 Sept passes kept whole) | word count |
| A `/start` skill for the new-chat ritual | Not made; the ritual lives in `CLAUDE.md` and the handover prompt (which already reads only `CLAUDE.md` + Next chat) | `status.md`:30 |

## 3. Why: the processes behind each drift

- **Regressions:** `applyVerdicts` (`build/tools/review/lib/evidence.mjs`:105–128) prepends the new verdict and keeps the old Status after "· earlier:", by design (`evidence-loop.md`). Builders also write long hand notes into Status. Decision 96 split rows one claim each (+ rows), and `/feedback` adds rows while only 9 have ever been retired.
- **Rules:** rule A29 / decision 49 ("a lasting decision becomes a rule in the same commit") plus the sprint look-back ("make it a rule") turn every answer into a new bullet; nobody shortens, so a rule carries its why and its exceptions (C23 is 90 words).
- **Decisions:** `/sprint` and `/feedback` say "a numbered row with a one-line why"; in practice one row per Zafar message, quoting him in Why, with sprint-only clauses inside.
- **Status:** `/handover` rewrites only "Next chat" and `statuscounts.mjs --write` only the table; no step owns "The plan", "Where each part is" or "Waiting on Zafar".
- **Sprint file:** `/checkin` logs to `overnight-log`, but the orchestrator also pasted each check-in into the sprint file so a new chat could catch up; the file became the handover.
- **No guard:** the audit's budgets were advice, not a check.

## 4. How to stop it (guards a tool runs)

1. **`build/tools/ops/docbudget.mjs` (new, ~60 lines).** A table of file → max words, exit 1 when over: `CLAUDE.md` 800; `rules.md` 2,600; `status.md` 1,500 and its "Next chat" 600; each `docs/sprints/S*.md` 1,200 (Outcome excluded); `decisions.md` index 1,200; each `regressions/<area>.md` Status cell ≤400 chars and no "· earlier:"; a decision row above number 98 ≤80 words (older rows are grandfathered). Run by `/review` (step 0), `/handover` (step 5) and as a test in `review.test.mjs`.
2. **`build/tools/ops/docids.mjs` (new, ~80 lines).** Every rule ID (`[A-J]\d+`) defined exactly once across the live docs' Standing rules; every ID cited anywhere resolves; every decision number once in the index and once in an area doc; every regression ID once across `regressions/*.md`; no `## ` area heading in two regression files. It is the move's before/after proof (§9) and stays as a test.
3. **History out of the Status cell.** `applyVerdicts` writes the "earlier" chain to `build/tools/review/data/status-history.jsonl` (`{id, run, date, earlier}`) and leaves Status as `built (evidence PASS <run>: <line>)`. Git keeps the rest.
4. **Where a fact goes, enforced:** `/feedback` step 7 names the area file; `/sprint` and `/feedback` say "one row per answer; a sprint-only answer goes in the sprint file, never in a decision row"; `/checkin` says "never paste check-ins into the sprint file"; `docids` fails a decision number that is in no area doc.
5. **Status ownership:** `/sprint` close owns "The plan" (one line per sprint) and deletes "Where each part is"; `/handover` lists only open questions (answered ones go).

## 5. The target structure

```
CLAUDE.md                                the overarching file (below): non-negotiables, the area map, where a fact goes, how to start
docs/
  README.md · vision.md · ideas.md
  status.md                              Next chat (≤600 words), the open-feedback table, questions for Zafar
  decisions.md                           the index: | n | date | area doc |  (plus the process rows in full, see Q3)
  sprints/Snn-*.md                       goal, budget, sessions one line each, small decisions, outcome, look back
  process/
    rules.md                             the process area: non-negotiables table, §1–3, the ID redirect table
    regressions/                         README.md (how to use, the file order) + shared.md cook.md clinic.md first-launch.md
                                         other-modes.md art.md language.md process.md keep.md retired.md
    qa-checklist.md · mode-design-method.md · session-brief-template.md · overnight-log/ · audits/
  game-design/   modes/<mode>.md (Standing rules + Decisions), modes/README.md, story-and-arcs.md, progression-and-scoring.md, cast.md, speaking.md
  design-language/   ux-principles.md, ui-design-system.md, art-bible.md, art-pipeline.md, audio.md, tone-of-voice.md
  language/   lexicon.md, engine-spec.md, grammar-notes.md, …
  architecture/   technical-plan.md, testing.md, evidence-loop.md, …
  archive/
.claude/agents/judge.md
.claude/skills/…
```

Every area doc gets two sections, appended as its last sections: `## Standing rules (from docs/process/rules.md §n, moved 14 Oct; the IDs are anchors other docs cite)` holding the bullets word for word with their `###` sub-headings, and `## Decisions (from docs/decisions.md; the numbers are the index)` holding the rows word for word with the same five columns.

**The overarching file.** `CLAUDE.md` stays `CLAUDE.md` (the harness loads it by that name; nothing else is automatic). Full draft; the 16 non-negotiables are copied unchanged from today's file and are two-thirds of it, so ~760 words / ~1.2k tokens is the floor (~650 if the Working agreement goes, Q1):

> # Nani jo Ghar
>
> A game that teaches young children Kutchi through play at Nani's house, voiced only by the real family. Zafar owns it and decides. It runs as a web app on GitHub Pages (`main` is the live site) and will be wrapped for the app stores.
>
> **The newest word from Zafar wins.** If he says something that clashes with this file or a Standing rules section, follow him, then update that section and `docs/decisions.md` in the same commit.
>
> ## Working agreement
> *(today's five bullets, unchanged)*
>
> ## Non-negotiables
> *(1–16, word for word as today; in 3 "docs/process/regressions.md" becomes "docs/process/regressions/")*
>
> ## Where things live
> Each area has one design doc holding its **Standing rules** (IDs like A1, E5) and its **Decisions** (numbered), and one regression file. `docs/decisions.md` is the index of every decision number. The process area is `docs/process/rules.md` (§1 Zafar, §2 sessions and git, §3 quality).
>
> | Area | Design doc | Regression file (`docs/process/regressions/`) |
> |---|---|---|
> | Process | `docs/process/rules.md` | `process.md` |
> | Every mode: teaching, help, levels, feedback | `docs/design-language/ux-principles.md` | – |
> | Shared UI: cards, end screen, buttons, text | `docs/design-language/ui-design-system.md` | `shared.md` |
> | Cook | `docs/game-design/modes/cook.md` | `cook.md` |
> | The clinic | `docs/game-design/modes/clinic.md` | `clinic.md` |
> | First launch | `docs/game-design/modes/first-launch.md` | `first-launch.md` |
> | Other modes | `docs/game-design/modes/<mode>.md`, `README.md` | `other-modes.md` |
> | Story, arcs, scoring | `docs/game-design/story-and-arcs.md`, `progression-and-scoring.md` | – |
> | Characters and culture | `docs/game-design/cast.md` | – |
> | Art | `docs/design-language/art-bible.md`, `art-pipeline.md` | `art.md` |
> | Language and voice | `docs/language/lexicon.md`, `engine-spec.md`, `docs/design-language/audio.md` | `language.md` |
> | Platform and release | `docs/architecture/technical-plan.md` | – |
>
> **Where a new fact goes:** a yes or no from Zafar → a Decisions row in its area doc and one line in the index (and a Standing rule in the same commit if it stands). Feedback → a regression row the same day. A design detail → the area doc. An unbuilt idea → `docs/ideas.md`. A question for him → `docs/status.md`. A sprint-only choice → the sprint file. What a session did → its report in `build/reports/`.
>
> ## Starting
> Read `docs/status.md` "Next chat", then only your area's docs from the table. Check `git log origin/main`. Read reports, never transcripts. Use the skills in `.claude/skills/` (`/sprint`, `/brief`, `/checkin`, `/review`, `/publish`, `/feedback`, `/mum-round`, `/art-run`, `/handover`) and the scripts in `build/tools/` by default; if one is missing or broken, fix it. The index of every doc is `docs/README.md`. Hand over at each step boundary or around 70% context.

**What each session reads at start (tokens):**

| Session | Reads | Now | After |
|---|---|---|---|
| Orchestrator chat | `CLAUDE.md` + status "Next chat" | 1.9k + 1.05k ≈ 3k | 1.2k + 0.6k ≈ 1.8k (on ~60k harness: a 2% cut) |
| Build session (one area) | `CLAUDE.md`, `rules.md` §2–3, `qa-checklist.md`, its area doc's Standing rules + Decisions, Next chat, the rows the brief lists | 1.9k + 2.5k + ~4.5k + 1k + whatever it opens of `regressions.md` (108k) | 1.2k + 2.5k + 4.5k + 2–4k + 0.6k ≈ 11–13k; a row lookup opens one area file (15–23k, ~10–14k once history moves out) |
| Judge (`judge` agent) | its agent file + one batch file + sheets | a Fable subagent with the full tool set (~40k of tools and prompt) | ~0.4k + 1–3k + the harness's agent minimum (Read, Write only); measure with `/context` |
| Reviewer (`/review`) | `rules.md` §3, `qa-checklist.md`, `regress.mjs` output, the area files for the rows listed | §3 1.2k + 4.5k + 108k if it opens the list | §3 1.2k + 4.5k + one area file |

Plainly: the starting-cost target is met by the current prompt already (it reads only `CLAUDE.md` and Next chat); the 60k is harness and only Zafar's settings cut it (status.md question 5). The docs work pays in build sessions, judges and reviews, where the regression split and the history move cut each list read by 5–10×.

## 6. The move table

Rules: every block moves word for word with its `###` sub-headings and IDs; the source keeps a one-line redirect. `rules.md` keeps "Contents", "The non-negotiables" table, §1, §2, §3, and gets `## Moved sections` listing each `§n → file § Standing rules (IDs …)` (the Opus session fills the ID lists from the moved text).

| `rules.md` section | Destination (`## Standing rules …`, appended as the last section) |
|---|---|
| §4 whole (Designing a mode … Speaking) | `docs/design-language/ux-principles.md` |
| §5 "Cook and the clinic" pointer paragraph | stays, as a row of the Moved sections table |
| §5 Conversations | `docs/game-design/modes/conversations.md` |
| §5 First launch | `docs/game-design/modes/first-launch.md` |
| §5 Story, arcs and progression | `docs/game-design/story-and-arcs.md` |
| §5 Parked, dropped and future | `docs/game-design/modes/README.md` |
| §6 whole | `docs/design-language/ui-design-system.md` |
| §7 Pipeline and cost; Planning art; Cutting and export | `docs/design-language/art-pipeline.md` |
| §7 Style; Characters and likeness | `docs/design-language/art-bible.md` |
| §8 Authority; Spelling and settled words; English | `docs/language/lexicon.md` |
| §8 The language engine | `docs/language/engine-spec.md` |
| §8 Voices and recordings | `docs/design-language/audio.md` |
| §9 whole | `docs/game-design/cast.md` |
| §10 whole | `docs/architecture/technical-plan.md` |

Decisions: each row moves whole into the destination's `## Decisions` table; `decisions.md` keeps the header paragraphs and becomes `| n | date | area doc |` for every number. Destination = the doc of the first ID in the row's Rule column; the exceptions are listed as questions.

| Numbers | Destination |
|---|---|
| 14, 15, 16, 20, 24, 33, 34, 46, 47, 48, 49, 50, 73, 75, 76, 78, 82, 86, 89, 96, 98 | process: stay in `decisions.md` in full (Q3) |
| 1, 12, 41, 51, 52, 53, 54, 57, 59 | `ux-principles.md` |
| 2, 10, 23 | `progression-and-scoring.md` |
| 3, 25, 55, 56, 93, 95 | `ui-design-system.md` |
| 4, 22, 39 | `story-and-arcs.md` |
| 8, 11 | `cast.md` |
| 9, 29, 64, 65, 71, 77, 79 | `art-pipeline.md` |
| 5, 21, 58, 61, 81, 84 | `lexicon.md` |
| 13, 17, 26, 36, 40 | `engine-spec.md` |
| 63, 66, 67, 69, 70 | `audio.md` |
| 6, 7, 18, 68 | `technical-plan.md` |
| 60, 62, 80, 87, 88, 90, 94 | `modes/cook.md` (into its existing decisions area, after "## Standing rules") |
| 27, 72, 74, 83, 85, 91, 92, 97 | `modes/clinic.md` (27 already heads the file: the row joins the table, the section stays) |
| 19, 21b, 23b, 28, 30–32, 35, 37, 38, 42–45 | already in `S01-remedial-and-engine.md`; unchanged |
| 96's "For Sprint 5's fix round only …" clause and 97's part (1) | the row stays whole (word for word); `S05-red-then-green.md` "Small decisions" gets a pointer line "decisions 96 (1 clause) and 97 (1) are this sprint's: see the index" (Q4) |

Regressions: each `## ` section goes whole, heading included and unchanged, into its file; the five header paragraphs go to `regressions/README.md` with the file order.

| `regressions.md` section(s) | File |
|---|---|
| Shared components (+ its five `###`) | `regressions/shared.md` |
| Cook: pantry, chai, maani, daar, chaat, samosa, sekelo, general | `regressions/cook.md` |
| Clinic (+ its six `###`) | `regressions/clinic.md` |
| First launch and shell | `regressions/first-launch.md` |
| Other modes | `regressions/other-modes.md` |
| Art (cuts, style, backgrounds, characters) | `regressions/art.md` |
| Language and audio | `regressions/language.md` |
| Process | `regressions/process.md` |
| Keep (things Zafar liked: must not regress) | `regressions/keep.md` |
| Retired | `regressions/retired.md` |

Archived (git mv to `docs/archive/`): `docs/process/regressions.md` is not kept (git has it); `docs/archive/sprints/S05-plan.md` → `archive/sprints/`; the 25 pasted check-ins in `S05-red-then-green.md` "Sessions" → `docs/process/overnight-log/2026-10-13.md` (appended, word for word) leaving one line per session; `status.md` "Where each part is" table → `archive/handovers/status-parts-2026-10-05.md`. Nothing else is archived in this item (`find-it.md`, `ideas.md`, `art-plans/` are Q6).

## 7. Tool changes

| Tool | Change | Proof |
|---|---|---|
| `review/lib/regressions.mjs` | `REGRESSIONS` → `REGRESSIONS_DIR`; `regressionFiles()` in README order; `loadRegressionTexts()` → `[{file, text}]`; `loadRegressions()` concatenates (headings unchanged, so `rowsForFlow`, `COOK_SECTION`, `CONTRACT_ROWS` need no change); `gitRegressions(ref)` reads each file at `ref`, falling back to `ref:docs/process/regressions.md` when the folder is absent there | new tests: two temp files → rows keep `h2`/`h3`; fallback on a pre-split ref |
| `review/lib/evidence.mjs` `applyVerdicts` | Status = head + note only; the stripped "earlier" text returned as `history: [{id, earlier}]`; `PREV` regex kept for old cells | "apply" test updated; new: history returned, Status has no "earlier:" |
| `review/evidence.mjs` | lines 62–67: `loadRegressionTexts` + `gitRegressions`; 486–490 `--apply`: loop per file, write changed files, append history to `data/status-history.jsonl`; 507: `loadRegressions`; help text 2, 37, 115, 382 | `evidence.test.mjs` 188, 245 still pass; `--apply --dry` on the repo lists 0 skipped for "fewer than four cells" |
| `review/sprintcheck.mjs` | 62–63 `gitRegressions`; 76 dirty check on the folder; wording 16, 85, 222, 245 | `review.test.mjs`:160 (CLN-100 since cdad804~1) passes via the fallback |
| `review/regress.mjs`, `statuscounts.mjs` | help wording only | `review.test.mjs`:56, 63 unchanged |
| `ops/feedback.mjs`:78 | max IDs over all files; wording 14, 95, 115 | run on `build/tools/ops/samples/feedback-sample.md`: same next-free IDs as before |
| `ops/brief.mjs`:60–63, 94 | read-first list: `CLAUDE.md`; `rules.md` §2–3; `qa-checklist.md`; the area doc's Standing rules and Decisions (new spec field `area`, from the `CLAUDE.md` table); Next chat; "rows of `docs/process/regressions/`" | regenerate `s05c3-cook.json` → brief names `cook.md` |
| `ops/briefpack.mjs` | `decisionsDigest` reads the index then each row from its area doc; `namedRules` searches every Standing rules section (the area-map docs), not only `rules.md`; `ruleSections` unchanged | `briefpack.test.mjs`:12 (15 decisions, named rules) passes; add: an `E` rule is found in `ux-principles.md` |
| `ops/docbudget.mjs`, `ops/docids.mjs` (new) | §4 | both exit 0 on the finished tree; both in `review.test.mjs` |
| `.claude/settings.json` | add `docbudget` to the PostToolUse hook beside `unpushed.mjs` (warn only) | — |
| Prose: `qa-checklist.md`:19, `testing.md`:64–68, 97, `sandbox/README.md`:84, 88, `sandbox/lib/contract.mjs`:14, `evidence-loop.md` | path wording | grep for `regressions.md` finds only archive and reports |

Commands that prove it: `node --test build/tools/review/review.test.mjs build/tools/review/evidence.test.mjs build/tools/ops/briefpack.test.mjs build/tools/ops/unpushed.test.mjs`; `node build/tools/review/statuscounts.mjs` (same numbers as before the move); `node build/tools/review/regress.mjs clinic:heal-cut` (same rows); `node build/tools/review/evidence.mjs --plan --all` (0 unknown rows).

## 8. Skill and prompt changes

| Skill | Reads after the change |
|---|---|
| `/brief` | unchanged for itself; the brief it writes lists `CLAUDE.md`, `rules.md` §2–3, `qa-checklist.md`, the area doc(s), Next chat |
| `/review` | `rules.md` §3, `qa-checklist.md`, `regress.mjs` output; step 0 `docbudget.mjs`; step 9 `--apply` "in `regressions/<area>.md`"; judging: "one `judge` agent call per batch file" |
| `/feedback` | `rules.md` §1 (A5, A6, A18, A19); step 7 "add the rows to `regressions/<area>.md`"; new 5d: one row per answer in Zafar's list, sprint-only ones to the sprint file |
| `/sprint` | A29; "a lasting decision → a Decisions row in its area doc + an index line in `decisions.md` + the Standing rule"; close owns status "The plan"; never paste check-ins into the sprint file |
| `/handover` | Next chat ≤600 words; step 5 runs `docbudget.mjs`; the new starting prompt below |
| `/checkin` | unchanged (`overnight-log/`); adds the "never into the sprint file" line |
| `/game-mode-design` | `ux-principles.md` § Standing rules (was `rules.md` §4–5), `mode-design-method.md`, `modes/README.md` § Standing rules |
| `/art-run` | `art-pipeline.md` and `art-bible.md` § Standing rules (D3, D12); non-negotiables 13, 16 |
| `/mum-round` | `lexicon.md` and `engine-spec.md` § Standing rules (G1, G16, G21); non-negotiables 4, 10, 11 |
| `/publish` | unchanged (B6–B9, B20, C9 stay in `rules.md`) |

**The new "Next chat" starting prompt:**

> Read `CLAUDE.md`, then `docs/status.md` "Next chat" only; open nothing else until a task needs it (your area's docs are in the `CLAUDE.md` table). Branch `<branch>`; `main` = `<sha>`. First task: <one line>. Tell me before launching anything new.

**`.claude/agents/judge.md`, in full:**

```markdown
---
name: judge
description: Independent evidence judge for Nani jo Ghar regression rows (decision 96, rule C23). Give it one batch file path; it reads only that file's sheets and writes the verdict file. Never the session that built the change.
tools: Read, Write
---
You judge evidence for Nani jo Ghar, a children's Kutchi game. You are not the session that built the change and you never read its account, its report or the code. Judge each row against its own words (Zafar's feedback), nothing else.

You are given one batch file, `build/screenshots/evidence/<run>/judge/batch-NN.md` (or `audit-NN.md`). For each row in it:
1. Read its Issue and Check from the batch file.
2. Read the sheet PNG it names (panels labelled A–D) and its text file (.md: the panels in words, the voice timeline, text captures, expect results). Nothing else.
3. Flaws first: note anything wrong in the panels (clipping, overlap, English for the child, a bubble away from its speaker, old art), even off the row's point.
4. Decide. PASS only when a panel shows the row's words met at the size and state the Check names, and cite that panel first. FAIL with one line saying what the panel shows instead. EVIDENCE when the sheet does not show the row's state at all (a tool failure, never a FAIL). "No change" is not a result. Words the engine marks loan:en (thank you, mixed, cup, film) are Kutchi (decision 87). Grey-italic English with the hidden to-record tag is allowed (decision 84): not a leak, not a missing clip. Sound quality and feel are not yours to judge.

Write the verdict file named in the batch (`batch-NN.verdicts.md`, next to it): first line `judge: <your model and session>`, then one line per row, in this exact form:
`ID | PASS: <panel letter>, <what that panel shows that proves it>`
`ID | FAIL: <panel letter>, <what is wrong>`
`ID | EVIDENCE: <what the sheet is missing>`
A text-only row (Sheet: (text only)) cites its text capture by its label in the .md instead of a panel letter. Change nothing else: never edit the regression files, the code, the batch file or any other file. Reply with the verdict file path and the count of PASS / FAIL / EVIDENCE.
```

`evidence.mjs --judge` keeps writing the batch files; its last line becomes "one `judge` agent call per batch file". The format matches `parseVerdicts` (`lib/evidence.mjs`:72–85): a PASS without a panel is refused.

## 9. The edit session's brief outline

Opus, high effort, one session on the integration branch, no publish (it lands with Sprint 6's publish, decision 98). Order:

1. **Baseline:** run `docids.mjs` (built first, step 2) and save its ID lists: every rule ID in `rules.md` (250 at line ends), every decision number (86), every regression ID (484 lines, 458 counted rows + keep/retired), and `statuscounts.mjs` output. Run the four test files.
2. **Tools first:** `lib/regressions.mjs`, `lib/evidence.mjs`, `evidence.mjs`, `sprintcheck.mjs`, `feedback.mjs`, `brief.mjs`, `briefpack.mjs`, `docbudget.mjs`, `docids.mjs`, tests. Commit.
3. **Regressions split** by script (split on `## ` headings, README from the header), then `evidence.mjs --apply --dry` on the last run and `regress.mjs`/`statuscounts.mjs` compared with step 1. Commit.
4. **Rules move** (§6 table): cut and paste by heading, append the Moved sections table. Commit.
5. **Decisions move**, the index, the two sprint pointer lines. Commit.
6. **CLAUDE.md**, `rules.md` head, `README.md`, `status.md` (plan table, parts table out, questions pruned only where a decision number answers them), S05's check-ins to the overnight log. Commit.
7. **Skills and prose paths** (§7, §8); `judge.md`. Commit.
8. **Proof:** `docids.mjs` after = before (each rule ID, decision number and regression ID exactly once, same sets); `grep -rn 'regressions\.md' --exclude-dir=archive --exclude-dir=reports` empty; `git diff --stat` shows moves as deletions matched by additions; a word-count check per moved block (bullets out of `rules.md` = bullets into the area docs); the four test files; `docbudget.mjs` exit 0; one `judge` agent call on an existing batch file (`build/screenshots/evidence/ev-20261013-135717-7pn/judge/`) whose verdicts match the cached ones; `/context` in a fresh chat after the new starting prompt, written into the report beside the 13 Oct baseline.
9. Report `build/reports/s06-structure.md` (under 300 words) and `/handover`.

Cost: ~2–3 h, about $30–40 on Opus high (mostly file moves and tests; the judgement is in this report).

## 10. Questions for Zafar

1. **Keep the five "Working agreement" lines in `CLAUDE.md`** (~110 words) rather than cut to the floor, because the orchestrator reads nothing else at start. *Recommend yes.*
2. **Move the Status history out of the rows** into `build/tools/review/data/status-history.jsonl` (and git), leaving the current verdict only. It is tool-written text, not a rule or decision, so it is outside decision 98's word-for-word clause; it is the single biggest cut (~40%). *Recommend yes.*
3. **Process decisions (21 rows) stay in full in `decisions.md`** beside the index, since the process area's doc is `rules.md` and adding 2k words there defeats the purpose. *Recommend yes.*
4. **Decisions 96 and 97 move whole** (96 to process, 97 to `clinic.md`, by their first cited rule) with a pointer line in the S05 file for their sprint-only parts, rather than splitting the rows. *Recommend yes.*
5. **§4 moves whole to `ux-principles.md`** rather than scattering "Designing a mode" to `mode-design-method.md`, "Feedback, scoring" to `progression-and-scoring.md` and "Speaking" to `speaking.md`. *Recommend yes; one home per section.*
6. **Out of scope for this item**, to a later sprint: `find-it.md` (27,944 words, three 25 Sept passes), `ideas.md` to one line per idea, the three `art-plans/` files (57k words). *Recommend: leave now, list in `ideas.md`.*
7. **Budgets** as in §4 (`CLAUDE.md` 800 words, `rules.md` 2,600, status 1,500 / Next chat 600, sprint file 1,200, new decision rows ≤80 words, Status cells ≤400 chars), failing `/review`. *Recommend yes.*
8. **The `judge` agent runs on the orchestrator's model** (Fable when judging pictures; Opus when Fable is at its limit), with no `model:` line in the file, as today's rule. *Recommend yes.*
