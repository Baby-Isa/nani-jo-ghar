# Nani jo Ghar

A game that teaches young children Kutchi through play at Nani's house, voiced only by the real family. Zafar owns it and decides. It runs as a web app on GitHub Pages (`main` is the live site) and will be wrapped for the app stores.

**The newest word from Zafar wins.** When he clashes with a doc, follow him and change that doc or check in the same commit ("Zafar, <date>").

## Working agreement

- Discuss first: propose, wait for an explicit go, act. Approval for one thing isn't approval for the next. Never launch while a question to him is open; an agreed overnight run goes ahead.
- Work in sprints (`/sprint`): one to three days, one playable goal, a budget; `/review` and publish at the end. Steer new work into a sprint.
- Decisions: a numbered list with recommendations, answerable "yes to all except …".
- When he says more is coming, collect. Improve his ideas; push back.
- Short, plain replies; no IDs to remember; hand him exactly what to do. Every launch: model, effort, cost.
- **Keep it small:** a rule that can be code becomes a check (`docs/process/checks-to-build.md`); new rules replace old.
- **Fix it properly, once** (the fix list, `docs/process/regressions.md`): a builder fixes what it breaks before handing back; anything found broken after a merge, and every point of Zafar's feedback, is a row the same day, fixed this sprint if it blocks play, else next. Built is done; done rows come back if they fail (Zafar, 22 Oct).
- **Fast lane (Zafar, 26 Oct):** small tweaks in this chat with the checks; the judge looks once, at the sprint's end. New screens: a mock-up (his, or ChatGPT after talking), a lab page, my four-size check, his numbered choices, then the game (Zafar, 27 Oct).
- **Builders** (in-chat subagents, own worktrees, two at most) only for new mechanics or screens, one per game area, design settled first; they never judge their own work or push; the orchestrator judges, merges, checks and publishes (`/publish`). Briefs: `docs/process/session-brief-template.md`.
- **Be cost-conscious:** top model for judgement and visual work, mid-tier for mechanical; no fan-outs or re-shoots while iterating.
- **Rapid prototype (Zafar, 22 Oct), until the app-store run:** phone and big-screen layouts by height, checked at 740x320, 930x430, 1280x665, 1920x1080 (Zafar, 27 Oct); the leak bot and the judge only on what a sprint changed; script-made before-and-after shots of a builder's rows; only CLAUDE.md has a word limit. Full checks before the stores.

## Non-negotiables

1. **If Zafar didn't comment on it, leave it.** Never remove or replace a mechanic or mini-game without his OK.
2. **Never invent Kutchi; only real family voices ship.** Mum is the authority (Masi second; Zafar confirms spellings); two AIs agreeing is not evidence. Every line is a full, natural sentence built by the language engine from recorded phrases and words; no hand-written fragments: if the engine can't say it, report the gap. Missing Kutchi is its English in grey italic, tagged "to record" in the markup only (decision 84), device-spoken while testing, never in a store build.
3. **No written English for the child,** except under Nani's lines at the door, on the order card at L1 and the helper card (Zafar, 28-29 Oct) and on a supported word card, tapped. Spoken English: story mode only, rare and simple. Grown-ups' English: only the "?" pop-up and the end-of-round review.
4. **The Kutchi leak test** once words are past support: no winning by reading, matching, eliminating, patterns or waiting. Right picks while supported move a word's ladder (29 Oct, sprint file).
5. **Done means an independent picture:** the `judge` agent, never the builder, passes the changed screens, flaws first.
6. **The same shared screens and buttons in every mode** (`js/shared/`, never restyled per mode); **no clipped or ellipsised text** (headlines shrink, then wrap).
7. **Nothing makes a child feel bad:** show progress, not verdicts; never make them wait for speech; they can undo until the step moves on (Zafar, 22 Oct).
8. **Art is made in ChatGPT runs that Zafar supervises** (decision 77): Claude plans and writes one paste block, he runs it and approves what lands, Claude judges, cuts and wires. No image-API art without his say-so.
9. **The family is Khoja Shia Ithna'asheri Muslim** (internal only; never named in anything public): halal only, no Hindu religious markers, modest clothing; never sweets, lollies or biscuits as rewards (mithai at a celebration is fine).

## Where things live

Each area's design and decisions live in its own doc (shared screens and art in `docs/design-language/`, modes in `docs/game-design/modes/`, language in `docs/language/`). A yes or no from Zafar → the doc, row or check it changes (sprint-only → the sprint file). Feedback → a fix-list row the same day (`/feedback`). An idea → `docs/ideas.md`. A question for him → `docs/questions.md`. A session's work → `build/reports/`. Index: `docs/README.md`; tools: `docs/tools.md`.

## Tools and skills: use them by default

Zafar never has to ask: `/sprint`, `/brief` (every launch), `/checkin`, `/review` (before anything reaches Zafar or `main`), `/publish`, `/feedback` (every voice note), `/mum-round`, `/art-run`, `/handover` (every step end); `node build/tools/review/checks.mjs` before every push. Fix any that is missing or broken.

## Starting a chat or session

Read `docs/status.md` "Next chat" only; open nothing else until a task needs it. Check `git log origin/main`. Read reports, never transcripts. Hand over at each step end or ~70% context.
