# Cost and speed: where the tokens go, and what to change

**Written 12 Oct 2026 (Sprint 4), for Zafar.** The question: with the shared host, the contract checks, the sprint check, the evidence loop and sprints in place, is that enough, or can we do more? Prices used (API list, 12 Oct): Fable $10/$50 per M tokens in/out, Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50. Opus is 2.5× cheaper than Fable; Sonnet 5×; Haiku ~100×.

## Flaws first (what Sprint 3–4 actually cost)

1. **Judging from pictures.** The S04 audit sent 88 whole-screen sheets to a judge; it overflowed context, half the rows came back "no evidence", and the same rows were judged twice (Fable, then Opus after the limit). Pixels are the most expensive evidence we have.
2. **Workers re-read the world.** Every brief says "read CLAUDE.md, rules §2, 3, 4, 6, the mode doc, the QA checklist": 10–15k words before the first edit, on every session and every relaunch after a limit.
3. **Rework.** The pantry box, "Thank you" as English and the word-review English were each touched by two helpers with opposite ideas because no worker saw decisions 80–85 before acting. Session work was moved to "built" by reading code (110 rows), then redone.
4. **Whole-world checks.** A full gate is ~2 h of browser and GBs of PNGs (`build/screenshots` is 2.9 GB today); the disk filled twice. Most of those pages had not changed.
5. **Usage limits mid-task.** Helpers stopped with uncommitted work; the 9–12 Oct stall was limits, not the problem.
6. **The orchestrator carries everything:** verdict merging, spec writing and judging all ran in the one chat whose context is the most expensive to fill.

## Changes

Each: (a) what, (b) saving, (c) effort, (d) scope risk. None cuts a mechanic or a rule.

1. **Model per task type, written into `brief.mjs` as a default table.** Fable: art judgement, a design, the one review before `main`. Opus high: game code and the shared layer. Sonnet medium: spec writing, driver fixes, docs, verdict merging, report writing. Haiku: text-only expects, row counting, log scraping, transcript tidy. (b) 40–60% of session spend (S03's A–D at $12–27 each were all Opus; half of that work was mechanical). (c) 1 h. (d) None if judgement stays on Fable.
2. **Text before pixels, always.** Judge only rows whose probes have no `expect`; 171 of 371 rows already never need eyes. Text batches of 30 on Sonnet; image batches of 8–10 on Fable, one composite PNG per row. (b) The 88-sheet audit (~$60, twice) becomes ~$10 once. (c) Built; enforce in `/review`. (d) None.
3. **Verdict and run caches are mandatory, not optional.** `--apply` refuses a run without the cache; the gate replays only pages whose (flow, size, mode tree hash) changed since the last approved run; `touched.mjs` decides the page list for every review. (b) A sprint gate drops from ~2 h to 20–40 min and from GBs to ~200 MB. (c) 2–4 h. (d) Shared-layer changes still fan out to every page by design.
4. **One context pack per worker, 2k words.** `brief.mjs` writes it: the task, the owned files, the regression rows for its screens, and a **known-decisions digest** (the last 15 decisions and every rule the task touches, pasted, not linked). Workers read the full rulebook only when the brief says a section applies. (b) ~10k tokens per worker per launch; fewer "undid each other" fixes. (c) 2 h. (d) A missed rule; mitigated by the digest being generated from `decisions.md`.
5. **Single owner per shared file, enforced.** `brief.mjs` fails if two live briefs own one path; a worker that must touch another owner's file writes the edit as a request in its report. (b) Removes the pantry-box/word-review class of rework (~$20 and a day in S04). (c) 30 min. (d) None.
6. **Sessions for code, subagents for reading; never a subagent for a long run.** Subagents inherit the orchestrator's context cost and die with its limit. A judge or spec writer is a session on its own branch with a resumable task file. (b) Orchestrator context halves. (c) Process only. (d) None.
7. **Resumable by construction.** Every long task writes progress to a file (`--resume <id>` already exists for evidence runs; add it to judging and verdict merging); commit and push every 20 min (rule B14) with a hook that fails a session that has not pushed in 30 min. (b) A limit costs minutes, not a day. (c) 1 h. (d) None.
8. **Screenshot retention policy.** Keep the last approved run, the current run and evidence crops; `run.mjs` deletes the rest at start; sandbox pages saved as WebP at 80%. (b) 2.9 GB → under 500 MB; no more full-disk stops. (c) 1 h. (d) None (approved sets stay).
9. **Batch Zafar's feedback into one `/feedback` per play, rows landed before any session launches.** One pass, one coverage check, one set of rows; no fix sessions on a half-transcribed note. (b) Fewer relaunches and fewer re-dos; the coverage audits found 23 unwritten points because feedback was handled piecemeal. (c) Process only. (d) None.
10. **The orchestrator stops doing hands-on work.** It plans, judges verdicts' summaries and publishes; judging, spec writing and merging go to Sonnet sessions. Hand over at 50% context, not 70%. (b) Fable chat spend down a third. (c) Process only. (d) None.

## The multi-language plan (Gujarati, Sindhi, Punjabi…)

What already makes a second language cheap: no Kutchi in code (G13, the word lint); lines are meanings (`{fn: "Need", thing: …}`) and the engine linearizes them from `data/lang/`; `params.json` is a feature model (gender, number, case) built against RGL Sindhi's set; the recordings index and clip planner are data; `/mum-round` is a pipeline from voice files to clips and lexicon. A second language is a new `data/lang/<lang>/` pack: lexicon, paradigms, params, concrete rules, a family-audio manifest, with the same meanings. Art, modes, the host and the tools stay as they are.

Design now (cheap while there is one language): a `lang` key in the save and on every data path (`data/lang/kutchi/` today, no behaviour change); the word lint and the lexicon expect keyed packs; the "to record" placeholder, gap list and Mum's question sheets generated per pack. Design later: the recording app for other families, per-pack art words (dishes differ), store listings, and which language the shell asks for. Do not build any second pack until Cook and the clinic are finished in Kutchi; a half-finished game in four languages is four half-finished games.

## Verdict: is what we have enough?

The architecture is: the shared host, contract checks and the evidence loop are the right shape and the language engine is already language-neutral. What is missing is discipline around them: models chosen per task, text evidence before pixels, caches and touched-only runs made mandatory, a 2k-word context pack with a decisions digest for every worker, and push-often resumable tasks. Those are a day's tooling and a process line each, and together they should roughly halve a sprint's spend and take a gate from hours to under an hour, without touching scope.
