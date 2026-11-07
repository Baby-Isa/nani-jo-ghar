# Review: the plan for rolling chai out to the stove games and every family (Fable, 7 Nov 2026)

**Question (Zafar, 7 Nov):** check the orchestrator's plan for the stove games (and all games, which take chai's principles) for
speed, cost and accuracy; accuracy first. **Read-only; no code changed.**

## Flaws first: what the repo's history says about re-doing

1. **The last roll-out (S14, option c) was redone because rules were not checks, not because retrofitting is wrong.** Two Opus
   builders moved every Cook station and heal game in one morning (`build/reports/s14-rollout.md`, phase C). Zafar's one play of
   four pages (`docs/feedback/cook-s14-play-2026-10-30.md`) gave 19 points: 12 new rows, 8 reopened; 4 of the 5 "on the s14 kit"
   rows reopened (DAAR-36, SEK-22, MAA-19, CHT-17; only SAM-28 held). The sprint file names the cause: "the checks looked at still
   frames and scripted rules" (`docs/sprints/S15-cook-game-by-game.md`). The game-by-game redo then never started.
2. **Chai's own re-doing was rule discovery:** the S16-S17 ledger counts 51 rule rows against 35 bugs; SH-180 reopened twice,
   SH-206, SH-189, CHAI-43 once each. **Chai is still moving:** today's replay gave six points (`docs/feedback/chai-play-2026-11-07.md`:
   SH-232 at `js/shared/order-card.js:653`, a lesson race at `js/cook/stations/chai-tray.js:2938-2955`); 20 commits to chai-tray.js
   and 30 to the shared kit in eight days. Splitting a file that changes daily multiplies merges and regressions.
3. **The standard page is incomplete.** `docs/design-language/chai-standard.md:45` says only §1.4, §1.5 and the next-pan light are
   "chai"; the code cites 24 CHAI rows that exist only in chai-tray.js (CHAI-50, -54, -56, -57, -61, -63 to -66, -99, -100 among
   them) and about 40 `*14` onboarding states (`ctl14`, `seen14`, `cardWait14`, `firstLit14`, `holding14`) woven through its step
   machine. Those are the hidden rules a builder cannot be measured against.
4. **The checks are chai-gated.** Of 76 contract checks, contract-70, -71, -90, -91 run on chai flows only; `CONTROL_CALLS` lists
   only chai-tray (`build/sandbox/lib/contract-s14.mjs:28`); `CHAI_ROW`, `S14_TAPS`, `DECOY_STATIONS` name stations by hand
   (`build/sandbox/lib/contract.mjs:1421-1428`). A game not in a regex is not checked. Three checks the standard relies on are unbuilt
   (`docs/process/checks-to-build.md`: 26 the boil-over driver, the zoom-in light everywhere, SH-196's lesson surviving a tap).
   `audit.mjs` reports five tool steps (`build/tools/review/audit.mjs:50-54`), not the standard's rules.
5. **The stove kit half exists and chai ignores it.** `js/cook/kitchen-kit.js` already gives every station the hob, burners, knobs,
   heat ring and pans; `js/cook/mechanics/` holds boil, pour, fry, tadka, tawa, chop, roll, thread (8,296 lines). Chai has its own
   heat (79 mentions), knob (59) and pour (159) code. Step 1 is less "extract a kit from chai" than "make chai's behaviour the kit's".
6. **The browser lock serialises every check** (`build/sandbox/run.mjs:4-6`, 20-minute chunks). Builders build in parallel; their
   audits queue (sandbox 4-10 min for chai's 16 pages, panel 5-8, labcheck 3-13). Six audits are about 2.5 hours of lock a round; two
   rounds a day is the real ceiling, whatever the builder count.
7. **The judge's capacity:** about ten rows a batch; the S04 audit of 88 sheets overflowed (`docs/process/cost-and-speed.md` §1).

## The options

| Option | Accuracy: first time, and where re-doing comes from | Speed | Cost |
|---|---|---|---|
| (a) clone chai per game | Worst. Nine 3,400-line copies; every chai fix (20 in 8 days) reapplied nine times; S12's lesson: "every shared look rebuilt game by game, four fix rounds for one help box". | 1 day to first play, then endless | 9 sessions, then 9 per chai change |
| (b) one big split, games as configs | Right end state, wrong step size: one builder rewrites chai while it moves; the contract run proves 16 pages, but CHAI-95/97/99/100 are "Zafar's ear", so a regression shows at his next replay. Chop, fold, roll, thread, grill do not fit a recipe config; forcing them breaks non-negotiable 1. | 2-3 days split, 1-2 roll-out, then fixes | 1 big, 6, plus redo |
| (c) retrofit each game (S14) | Known: 4 of 5 reopened, 19 points in 4 pages, because rules were eye-judged on stills. Sound for the live games' own mechanics once rules are checks. | fastest build, slowest redo | 2, then a sprint of redo |
| **(d) strangler split, measured adoption** | Chai gives one behaviour at a time to the kit (each move: chai's contract run green, one filmed before/after, the judge); each moved rule's check widened from the chai regex to every stove flow. Live games adopt module by module, mechanics kept; the three prototypes (300-580 lines, never judged) are rebuilt on the kit. | 5-6 days | about 9 sessions |

**Why (d):** re-doing here came from rules not yet known, rules not checked, and unattended changes judged on stills. (d) removes
the second and third before any builder starts and gates on chai's "done" for the first; the plan's shape stays.

## Every family, not only stoves

The standard divides cleanly: §1 onboarding, §2 the order, §3 cards and panel, §4 speech, §5.2-5.4 layout, undo, loading, §6 words
and the leak test apply to **every** game; only §5.1 (heat, boil, several pans) is the stove's. The shared pieces exist
(`js/shared/onboard.js`, `order-card.js`, `word-card.js`, `request-popup.js`): the clinic calls Onboard 41 times, the farm 22, but the
clinic also keeps its own `js/clinic/kit.js` (1,234 lines; CLN-207, -210, -211, -213 reopened in S14). Each family gets the standard
three ways: the shared modules folded in at its roll-out (S17 decision 6); the page as its checklist, each rule with a check id and
"kit / game / judge"; contract checks keyed by **data per game** (its flows, its control calls), never station regexes, so a game is
checked the day it is listed. §5.1 becomes the stove kit's own section.

## Risks, and how to remove each before building

| Risk | Remove it by |
|---|---|
| Chai regresses in the split | Gate on his "done"; freeze a golden run (contract L1-L4 at four sizes, one film per level, his ear items as judge rows); one builder owns chai-tray.js and the kit; one module per commit; nobody else in `js/shared/` or `js/cook/` meanwhile |
| Hidden chai-only rules | Finish the standard **from the code**: every CHAI row cited only in chai-tray.js and every `*14` state gets a line: kit, stove kit, chai's recipe, or retired; Zafar reads the "every game" lines |
| Rules without checks | Build the three missing checks; widen contract-70/71/90/91 and `CONTROL_CALLS` to per-game data; `audit.mjs --standard` prints the rules with pass / fail / judge, so builders are measured, not judged by eye |
| Mechanics that don't fit | The kit owns add, heat, pour, serve, the shelf, the lights, the order flow; a game's verb stays its mechanic; the brief names what stays with its decision (DAAR-37 to -39, SAM-28) |
| The judge's capacity | Diffs only: before/after per changed row, plus one new-player film per game; batches of ten |
| The lock | Builders run `--touched` on their own ports; the orchestrator queues one full audit per game; two rounds a day planned |

## Recommended plan

| Phase | What | Who, model | Cost, time | Gate |
|---|---|---|---|---|
| 0 | Chai "done": today's six points; the golden run frozen | the chat, Opus high | $15-25, half a day | his "done" on the live site |
| 1 | The standard completed from code; three checks built; chai-gated checks widened to per-game data; `audit.mjs --standard` | one tool builder, Opus high (Sonnet for the page's table) | $20-30, 1 day | every rule has a check id or a named judge row; Fable reads the page once |
| 2 | Strangler split: heat and boil; pour and serve; the shelf and pills; lights and lessons; the order flow and timings; each a commit, chai's run green, a film | one builder, Opus high, sole owner | $40-60, 1.5-2 days | golden run and audit green after each module; Fable judges the films at the end |
| 3 | Adoption in parallel: daar; samosa; maani with roll-tawa; sekelo with the grill; eggs with corn; baking with the word moment. Live games adopt, mechanics kept; prototypes rebuilt | six builders, Opus high (the cap of two suspended again: the 6 Nov rule was S17 only) | $15-25 each; 1.5 days (two audit rounds) | each audit green on the standard; Fable judges its new-player film |
| 4 | His play of the family in one sitting; `/feedback`; rows fixed once, in the kit | the chat | $20-30, 1 day | his "done" per game; publish |

About $200-300 and 5-6 days against the plan's implied 3-4; the difference is phases 0-1, where S14's sprint of redo went.

## For Zafar ("yes to all except ...")

1. The split waits for your "done" on chai, guarded by a frozen golden run. *Recommended.*
2. Before any builder: the standard finished from the code, every rule a check or a named judge row, checks keyed by per-game data.
   *Recommended.*
3. Chai is split one module at a time by one builder who owns it, not in one rewrite. *Recommended.*
4. Daar, sekelo, maani, chaat and samosa keep their mechanics and adopt the kit's modules; eggs, baking and the corn stall are
   rebuilt on the kit. *Recommended.*
5. Six builders for phase 3 only; the orchestrator queues their audits. *Recommended.*
6. The judge sees diffs and one new-player film per game, never whole-game sheets. *Recommended.*
7. Every other family takes the standard the same way at its sprint: shared modules folded in, the page as its checklist, its flows
   in the checks' data at listing time; the clinic's own kit folds into `js/shared/` at Sprint 20. *Recommended.*

## Proof

The files cited; reopened rows from `docs/process/regressions.md` and `docs/archive/regressions-done.md` (28 in all); commits from
`git log --since=2026-10-30`; timings from the sandbox runs' `chunks.log` and the 3 Nov audit reports.
