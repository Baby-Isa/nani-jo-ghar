# Cost and speed: where the tokens go, and what to change

**Written 12 Oct 2026 (Sprint 4), for Zafar.** The question: with the shared host, contract checks, sprint check, evidence loop and sprints in place, is that enough? Prices (API list, 12 Oct, per M tokens in/out): Fable $10/$50, Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50. Opus is 2.5× cheaper than Fable, Sonnet 5×, Haiku ~100×.

## Flaws first (what Sprints 3–4 actually cost)

1. **Judging from pictures.** The S04 audit sent 88 whole-screen sheets to a judge; it overflowed, half the rows came back "no evidence", and the rows were judged twice (Fable, then Opus after the limit). Pixels are our dearest evidence.
2. **Workers re-read the world.** Every brief says "read CLAUDE.md, rules §2–4, 6, the mode doc, the QA checklist": 10–15k words before the first edit, again on every relaunch.
3. **Rework.** The pantry box, "Thank you" as English and the word-review English were each touched by two helpers with opposite ideas; none had seen decisions 80–85. Sprint 3 marked 110 rows built from code reading, then redid them.
4. **Whole-world checks.** A full gate is ~2 h of browser and GBs of PNGs (`build/screenshots` is 2.9 GB); the disk filled twice. Most pages had not changed.
5. **Usage limits mid-task** stopped helpers with unpushed work; the 9–12 Oct stall was limits, not the problem.
6. **The orchestrator does hands-on work** (merging verdicts, writing specs, judging) in the one chat whose context costs most.

## Changes

Each: (a) what, (b) saving, (c) effort, (d) scope risk. None cuts a mechanic or a rule.

1. **Model per task type, as a default table in `brief.mjs`.** Fable: art judgement, design, the one review before `main`. Opus high: game code and the shared layer. Sonnet medium: spec writing, driver fixes, docs, verdict merging, reports. Haiku: text-only expects, row counts, log scraping. (b) 40–60% of session spend (S03's four sessions were all Opus; half the work was mechanical). (c) 1 h. (d) None while judgement stays on Fable.
2. **Text before pixels.** Judge only rows whose probes lack an `expect` (171 of 371 never need eyes). Text batches of 30 on Sonnet; image batches of 8–10 on Fable, one composite PNG per row. (b) The 88-sheet audit (~$60, twice) becomes ~$10 once. (c) Built; enforce in `/review`. (d) None.
3. **Caches and touched-only runs made mandatory.** `--apply` refuses a run without the verdict cache; the gate replays only pages whose flow, size or mode tree hash changed since the last approved run; `touched.mjs` sets every review's page list. (b) Gate ~2 h → 20–40 min, GBs → ~200 MB. (c) 2–4 h. (d) Shared-layer changes still fan out to every page, by design.
4. **A 2k-word context pack per worker.** `brief.mjs` writes it: the task, owned files, the rows for its screens, and a **known-decisions digest** (the last 15 decisions and every rule the task touches, pasted, not linked). The full rulebook only when the brief names a section. (b) ~10k tokens per launch; fewer "undid each other" fixes. (c) 2 h. (d) A missed rule; mitigated by generating the digest from `decisions.md`.
5. **Single owner per shared file, enforced.** `brief.mjs` fails when two live briefs own one path; an edit to another owner's file goes in the report as a request. (b) Removes the pantry-box class of rework (~$20 and a day in S04). (c) 30 min. (d) None.
6. **Sessions for code and long runs; subagents only for reading.** Subagents share the orchestrator's limit and die with it. A judge or spec writer is its own session with a task file. (b) Orchestrator context halves. (c) Process only. (d) None.
7. **Resumable by construction.** Long tasks write progress to a file (`--resume` exists for evidence runs; add it to judging and merging); push every 20 min, and a hook fails a session unpushed for 30. (b) A limit costs minutes, not a day. (c) 1 h. (d) None.
8. **Screenshot retention.** Keep the last approved run, the current run and evidence crops; `run.mjs` deletes the rest at start; sandbox pages as WebP. (b) 2.9 GB → under 500 MB. (c) 1 h. (d) None.
9. **One `/feedback` per play, rows landed before any launch.** No fix sessions on a half-transcribed note. (b) Fewer relaunches; the audits found 23 unwritten points from piecemeal handling. (c) Process only. (d) None.
10. **The orchestrator plans, reads summaries and publishes; nothing else.** Hand over at 50% context. (b) Fable chat spend down a third. (c) Process only. (d) None.

## The multi-language plan (Gujarati, Sindhi, Punjabi…)

Already cheap: no Kutchi in code (G13, the word lint); lines are meanings (`{fn: "Need", thing: …}`) that the engine linearizes from `data/lang/`; `params.json` is a feature model built against RGL Sindhi's set; clips and the recordings index are data; `/mum-round` turns voice files into clips and lexicon. A second language is a new `data/lang/<lang>/` pack (lexicon, paradigms, params, rules, a family-audio manifest) over the same meanings; art, modes, host and tools stay.

Design now, while there is one language: a `lang` key in the save and on every data path (`data/lang/kutchi/`, no behaviour change); the lint, placeholders, gap list and question sheets keyed per pack. Design later: a recording app for other families, per-pack dish and object words, store listings, the shell's language choice. Build no second pack until Cook and the clinic are finished in Kutchi: a half-finished game in four languages is four half-finished games.

## Verdict: is what we have enough?

The architecture is: the shared host, contract checks and evidence loop are the right shape, and the engine is already language-neutral. What is missing is discipline around them: models chosen per task, text evidence before pixels, caches and touched-only runs mandatory, a 2k-word pack with a decisions digest for every worker, and push-often resumable tasks. That is about a day of tooling and a process line each, and together should roughly halve a sprint's spend and bring a gate under an hour, without touching scope.

## Starting cost, measured (13 Oct, decision 98)

Claude Code's `/context` panel in an orchestrator chat on 13 Oct, before the reset: about 60k tokens fixed before any project file (system tools 22k, MCP tools 17.3k, system prompt 11k, skills 6.6k, CLAUDE.md 1.9k, MCP server instructions 1.3k), plus about 3k of starting reads (`CLAUDE.md` and status "Next chat"). Most of it is the harness: fewer skills and connectors cut it; the docs can cut only the reads. Measure again in a fresh chat after the starting prompt and write the number here.
