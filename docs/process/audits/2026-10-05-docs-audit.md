# Docs audit, 5 Oct 2026

Read-only audit. Token counts are estimates (chars ÷ 3.8).

## Top 10 changes, ranked by token saving × risk reduction

1. **Cut the duplicated non-negotiables and "Working agreement" from CLAUDE.md; keep one list in `rules.md` "Top rules" and link to it.** CLAUDE.md:36–53 repeats rules.md:25–44 word for word. Saves ~1,200 tokens per session, every session.
2. **Rewrite `status.md` "Next chat" as one dated block; delete the three stacked "Done 15:50 / 17:24 / Running" lines that contradict each other** (status.md:11–19 says C3, A2, 4b are running *and* done). Saves ~400 tokens and stops a new chat re-checking finished sessions.
3. **Move the "Decisions log, 30 Sept" and "Open questions" out of `rules.md`** (rules.md:389–427, ~1,500 tokens). They duplicate `decisions.md` and status.md "Waiting on Zafar", and the log stops at 27 while rules cite 29–46.
4. **Move Cook station and clinic game details (rules.md §5, H10–H35, H52) into the mode docs.** They are designs, not standing rules. Saves ~1,200 tokens from a file every brief cites.
5. **Delete the pasted BUILD-COMMON block and its "Stale points" box from `session-brief-template.md`:51–80 and `testing.md`:22–35.** `brief.mjs` now generates the brief; the block gives stale ports, "no new art" scope and "never push to main". Saves ~1,300 tokens and a wrong-behaviour risk.
6. **Archive `rules-harvest*.md`, `step1-mapping.md`, `step1d-progress.md`, `step1d-harvest/`** (~420 KB in `docs/process/`). README:19 already says "archive after review".
7. **Fold decisions 1–46 that are now rules into `rules.md` and archive `decisions.md` up to 1 Oct.** The log is ~18k tokens; 40 of its 2026-09-22 to 09-30 lines are struck through or restate a rule. Keep a short "live decisions" file.
8. **Delete the stale "Waiting on Zafar" items that decisions already answered** (status.md:113 bookshelf replay, :114 notebook → decision 23, :117 Busy/Relaxed, :120 wages → 1 Oct "no wages", :122 Excel → decision 17). Prevents asking him twice.
9. **Rotate `overnight-log.md` by date** (148 lines, 46 KB, header still says "29 Sept"; 56 lines added on 5 Oct alone). Keep only the current run in the live file.
10. **Make `qa-checklist.md` agree with decisions 24 and 44:** add the tablet sizes (missing at :15), drop "auto planned (step 2a)" (:7; `build/lint/` and the sandbox exist), remove dead `build/test_e2e.py` (:50) and `build/reports/chai-v2-mockup/` (:20).

Together: the always-read set drops from ~7,600 to ~4,000 tokens per session, and the brief-cited rules sections from ~2,100 to ~1,500.

## Findings by file (flaws first)

### CLAUDE.md (~2,950 tokens)
- :36–53 duplicates rules.md Top rules; :9–21 restates A1–A28; :62–66 restates B11–B13 and `/checkin`; :84–92 restates B6–B9 and `/publish`; :103–108 restates A25 and `/handover`. With the skills in place, CLAUDE.md can be ~1,200 tokens.
- :55 "Read the sections that apply" and :98–101 "Starting a chat" clash with rules.md:76 (A15/A28), which says a new chat also reads `ux-principles.md`, `grammar-notes.md` (80 KB) and `ideas.md`. Pick one; recommend CLAUDE.md's.

### docs/README.md (~1,200 tokens)
- 44 docs still carry a "Stale points" box (a 1 Oct transition device). Resolve each into the text and delete it.
- :12, :19 list harvest and step-1 files as live.
- :48, :51 index two pre-refactor architecture docs as current.

### docs/status.md (~3,800 tokens; Next chat ~900)
- :11–19 three time-stamped layers; :14 lists sessions as running that :19 lists as done; :41 plan table says "4a running" though 4a–4e are done; :42 "Docs: after 4d/4e" is now step 6 of Next steps.
- :66–87 "Live today (30 Sept)" is five days stale (":83 the engine: not built"). Cut to one line plus report names.
- :51–60 the feedback table's prose cells go stale even though `statuscounts.mjs` rebuilds the numbers. Make it numbers-only.
- :91–144 "Waiting on Zafar": 31 items, several answered (change 8); numbering jumps 18 → 21.

### docs/decisions.md (~18,200 tokens)
- Entries 1–27 are unnumbered and :157–167 cite rules.md's own log as their source (circular); 28–46 are numbered. rules.md cites "decision 22" and the reader must count.
- 22–30 Sept sections (~14,000 tokens) are history; 19 entries are struck through. The working assumptions (:293–315) belong in status.md "Waiting on Zafar".
- :218–234 decision 27 (clinic heal games, 17 sub-points) is a design and belongs in `modes/clinic.md`.

### docs/process/rules.md (~12,100 tokens)
- §1–3 (~2,500 tokens, what briefs cite) are sound. §5 holds station designs; the decisions log ends at 27; "Open questions" (:389–394) duplicates status.md; :5 and :7 point at the harvest.
- :76 (A15/A28 read list) contradicts CLAUDE.md:98; :98 brief read list includes `ux-principles.md`, which `brief.mjs`:35–39 omits. The generator is the truth; align the rule.

### docs/process/qa-checklist.md (~3,900 tokens)
- Contradicts decision 24: no tablet sizes (:15); rules.md:123 has them.
- :7 "automated check is planned (step 2a)" is stale; :50 `build/test_e2e.py` is gone; :20 mock-up path is gone.
- Many "eye → auto" lines are auto today; name the sandbox and `build/lint/layout.mjs`.

### docs/process/regressions.md (~15,900 tokens, 252 rows)
- Columns fit `regress.mjs` (id, status, check, issue, section). Source (2–3 paths, ~25% of the file) is read by no tool; one path is enough.
- 7 rows have a status the tool classes as "other" (:28 "open (unverified)"); normalise to four statuses.
- :8 "Paths are as of 30 Sept (before the docs tidy)": fix the paths once instead of warning forever.

### docs/process/session-brief-template.md (~1,900 tokens) and testing.md (~2,400)
- Both paste the 25 Sept BUILD-COMMON block with a box saying to ignore half of it. `brief.mjs` is the template; testing.md keeps ports, lessons and the Tools tables.

### docs/process/overnight-log.md (~12,200 tokens)
- Unbounded, appended by `checkin.mjs --log`; only A21 (rules.md:75) ever reads it. Rotate per run.

### docs/ideas.md (~4,800 tokens)
- Rows 26–37 (:49–60) quote archived docs at length (~2,500 tokens); 27, 30, 33, 34 are answered by decisions 22, 23 and H56/H57. One line per idea.

### Skills and testing.md "Tools"
- The eight skills are tight (300–500 tokens) and cite rule IDs correctly; they cover exactly the CLAUDE.md sections that can go. Gap: no `/start` skill for the new-chat ritual. The testing.md Tools tables and the skills overlap; keep the tables, let skills point at them.

### Skim: the rest
- Parked mode docs are 178–208 KB each; archive them, leave a stub.
- `docs/feedback/` mixes transcripts (~100 KB) with reports; a `transcripts/` folder makes "read reports, never transcripts" a folder rule.
- `build/reports/`: 109 files, 1.1 MB, mixed naming (`chai-v3.md`, `c1-clinic-polish.md`, `step4e-clinic-engine.md`, `chatgpt-batch-3-dump-2.md`). Fix `<id>-<topic>.md` and the 400-word cap.

## Proposed target structure and budgets

| File | Holds | Budget |
|---|---|---|
| `CLAUDE.md` | Who Zafar is, the three-line working agreement, "Top rules are rules.md §0", where things live, the skills list, how to start | 1,200 tokens |
| `docs/status.md` | Next chat (one dated block, ≤600 tokens), the plan table, the generated feedback table (numbers only), open questions to Zafar (numbered, none answered) | 2,000 |
| `docs/process/rules.md` | §0 Top rules; §1–3 process (cited by every brief); §4 design rules for every mode; §6–10 as now. No station designs, no decisions log, no open questions | 8,000 (§1–3 ≤1,500) |
| `docs/decisions.md` | Numbered decisions from the current chapter only (28 onward), one line each; older ones archived once folded into rules | 2,500 |
| `docs/process/qa-checklist.md` | As now, with tablets and the real tool names | 3,500 |
| `docs/process/regressions.md` | ID / Issue / Status / Check / one Source; four statuses only | 10,000 |
| `docs/ideas.md` | One line per idea with status | 1,500 |
| `docs/process/overnight-log/<date>.md` | One file per run | not read by sessions |
| `docs/game-design/modes/<mode>.md` | The mode's design, build status and its station rules (from rules.md §5) | per mode |
| `docs/archive/` | harvests, step-1 docs, parked mode designs, old decisions, transcripts | not read |

Where a new fact goes (put this paragraph in CLAUDE.md): a yes/no from Zafar → `decisions.md`, and `rules.md` the same commit if standing; feedback → a regression row; a design detail → the mode doc; an unbuilt idea → `ideas.md`; a question for him → status.md; what a session did → its report.

## Migration plan (one session, mid-tier model, in this order)

1. Branch `docs-rewrite`. Run `statuscounts.mjs` and `node --test build/tools/review/review.test.mjs` first and last.
2. `git mv` harvests, step-1 files, parked mode docs and feedback transcripts to `docs/archive/`; update README.
3. rules.md: move §5 station/clinic items to the mode docs (keep IDs as anchors there); delete the decisions log and open questions; fix :76 and :98 to match `brief.mjs`.
4. decisions.md: number 1–27; archive everything before 5 Oct once each cited rule ID is confirmed present; move working assumptions to status.md.
5. qa-checklist: tablets, tool names, dead paths.
6. regressions.md: one Source per row, four statuses, current paths; rerun `regress.mjs` for one flow to prove parsing.
7. Delete every Stale box in the live docs, resolving each line into the text.
8. Rewrite CLAUDE.md to the 1,200-token shape; add a `/start` skill for the new-chat ritual.
9. status.md: new Next chat, plan table, answered questions removed; `statuscounts.mjs --write`.
10. Rotate overnight-log; teach `checkin.mjs --log` the dated path.
11. Fable reviews the diff against this audit; Zafar's go; merge.
