# The check rules Zafar has already made (S19 review, 9 Nov)

Nothing invented. **"The judge" is Fable:** the `judge` agent is a Fable subagent on the orchestrator's model (decisions 96, 99).
Fable also second-reads feedback (decision 78) and reviews plans and art.

## 1. Who checks what, and when

| Moment | Machines run | Who looks | Source |
|---|---|---|---|
| Builder, building | checks.mjs, unit tests; ~15 min of browser at most, "never ... the size matrix" | Nobody: no pictures of its own, never its own judge | decisions 48 (5 Oct), 50 (6 Oct); one loop (26 Oct) |
| Builder, handing back | checks.mjs; script-made after shots of its rows; its game's contract run; fixes what it broke | Nobody | CLAUDE.md (22 Oct); light checks (7 Nov) |
| Orchestrator, merging | Contract-100 to -109, 0 page errors, end reached, L1-L4: these gate every merge | Orchestrator; the eye judge beside chai **waits** for the game's new scene and art | S19 "Judging, split" (9 Nov) |
| Fast-lane tweak | checks.mjs before every push; four sizes | The judge once, **at the sprint's end** | CLAUDE.md Fast lane (26 Oct) |
| New screen | Lab page, labcheck.mjs at four sizes | Orchestrator, then Zafar's numbered choices | CLAUDE.md (27 Oct) |
| Art run landing | artjudge.py; checks.mjs art step | Claude judges and cuts; Zafar approves what lands | Non-negotiable 8 (decision 77, 9 Oct) |
| End-of-sprint publish | /review: checks.mjs --browser, full contract gate once, evidence loop on touched rows; publish gate; four sizes | The judge on touched rows; Zafar says "publish", plays, /feedback | /review (20 Oct); decision 78; S19 (9 Nov) |
| Before the stores | Full checks at every size; the Kutchi gate; no device voice | Not decided | CLAUDE.md; S13 (26 Oct); prototype-to-game (2 Nov) |

**Zafar's eyes only for:** his play after a publish; sound and feel (decision 82); real people's likeness; a row failing twice (decision 96); a game's "done" (9 Nov: "Only when it gets to the chai standard is it done").

## 2. Conflicts (newest wins)

1. **Merge gate.** `/review`, `evidence-loop.md`, the rubric (8 Nov) and `status.md`: side-by-side and judge at every merge, merge
   rule "not yet agreed". Zafar, 9 Nov: "The merge rule ... I don't think I agree to that ... it should be more when we get to the
   later stages of refining games." **9 Nov wins;** those four are stale.
2. **Builder's sizes.** 6 Oct: never the matrix; 26 Oct: 1280x665 and 915x412 (template and `/brief`: 1366x768); `brief.mjs`: all four;
   7 Nov: "one run ... at one size at the end; the four sizes once per game at merge". **7 Nov wins** (gap 1).
3. **Before shots.** `/brief` 3b (26 Oct): played and judged at launch. 7 Nov: "no before-run and judge at launch". **7 Nov wins.**
4. **Judge before his play.** 2 Nov: "the judge passes it on film before he plays". 8 Nov: "first publish what is built so he can
   play". **8 Nov wins.**
5. **Open rows at publish.** Decision 89 (13 Oct): "No publish until every fixable row ... is fixed and proven" (the gate enforces it).
   9 Nov: "publish everything since the last publish together", known fails open. **9 Nov wins.**
6. **Fast lane's judge.** Decision 99 (13 Oct, still in `status.md`): "Fable judges the picture, Zafar sees it". 26 Oct: "the judge
   looks once, at the sprint's end". **26 Oct wins.**
7. **Review sizes.** `qa-checklist.md` step 3: 844x390, 800x360, 1366x768, tablets (decisions 15, 24). 27 Oct: four sizes. **27 Oct wins.**
8. **Art approval.** Decision 29 (5 Oct, in `/art-run`): only real people's art. CLAUDE.md: "approves what lands". **CLAUDE.md wins.**

## 3. Gaps

1. Were 7 Nov's light checks for Sprints 17-18 only? *Recommend: keep until the stores* (rapid prototype, cost).
2. After artjudge.py, who judges art: orchestrator or Fable? *Recommend: one Fable pass before Zafar sees it* (9 Nov: "Maybe ask
   Fable").
3. Does the publish gate cover untouched games? The code plays all; decision 34 (5 Oct) says changed only. *Recommend: machines on
   every game (cheap); judge and leak bots only on what changed* (22 Oct).
4. With the side-by-side parked, does the judge see a builder's rows at merge? *Recommend: once, at the sprint's end.*
5. Who makes before shots now (s19-games: "No BEFORE")? *Recommend: the orchestrator, by script, from the base commit* (one loop 1b).
6. What brings the eye judge beside chai back? *Recommend: the merge that puts a game on its new scene and art.*
7. Sprint close's `--run --all` and 10% re-judge (`/review` step 9)? *Recommend: park until the stores.*

A breach: s19-checks' builder judged its own dry run (non-negotiable 5).

## 4. Where it should live

`docs/process/qa-checklist.md` ("the definition of done"), replacing its review steps 1, 3 and 7. Cut to a pointer: `/review`'s merge and merge-rule paragraphs, `evidence-loop.md` lines 3-16's merge rule, the rubric's merge-rule paragraph,
the sizes in `session-brief-template.md` and `/brief`, `status.md` lines 17 and 88, S19's "Waiting on: the merge rule", `/art-run`'s
decision 29 line.

## Proof (files read)

CLAUDE.md; `docs/process/` qa-checklist, check-audit, checks-to-build, regressions (header), session-brief-template, eye-judge-rubric,
prototype-to-game, cost-and-speed, overnight-log; `docs/architecture/evidence-loop.md`; `docs/tools.md`; skills review, publish,
sprint, brief, checkin, art-run; `.claude/agents/judge.md`; sprints S12, S13, S17, S18, S19, archived S14; decisions-1-to-99,
decisions-log-99; `docs/feedback/` (grep), kitchen-mocks-2026-11-09, kitchen-play-2026-11-08; `docs/status.md`; reports
s18-review-and-direction, s19-games, s19-mini-judge; `brief.mjs`, `briefpack.mjs`, `publishgate.mjs`, `env.mjs`, `run.mjs`.
