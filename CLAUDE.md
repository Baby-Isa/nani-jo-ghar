# Nani jo Ghar

A game that teaches young children Kutchi through play at Nani's house, voiced only by the real family. Zafar owns it and decides. It runs as a web app on GitHub Pages (`main` is the live site) and will be wrapped for the app stores.

**The newest word from Zafar wins.** When he clashes with a doc, follow him and change that doc or check in the same commit ("Zafar, <date>").

## Working agreement

- Discuss first; propose, wait for an explicit go, then act. Approval for one thing is not approval for the next. Never launch while a question to him is open; an agreed overnight run goes ahead.
- Work in sprints (`/sprint`): one to three days, one goal he can play, a budget; `/review` and publish at the end. Steer new work into a sprint.
- Work runs in the orchestrator's chat and its subagents, so nothing stalls on a permission prompt (Zafar, 14 Oct).
- Decisions go to him as a numbered list, each with a recommendation, answerable "yes to all except …".
- When he says more is coming, collect and list; plan nothing. Improve on his ideas: research, push back where warranted.
- Short, plain replies; don't assume he remembers IDs. Hand him exactly what to do, ready to paste. Every launch: a model, effort and cost.
- **Keep it small:** a rule that can be code becomes a check (`docs/process/checks-to-build.md`); a new written rule replaces an old one; `docs.mjs` fails a doc past its limit.

## Non-negotiables

1. **Discuss first; act only when told.** (above)
2. **If Zafar didn't comment on it, leave it.** Never remove or replace a mechanic or mini-game without his explicit OK.
3. **Fix it properly, once.** Every genuine thing still to fix is on the fix list (`docs/process/regressions.md`); done rows stay checked and come back if they fail.
4. **Never invent Kutchi.** Mum is the authority (Masi second opinion; Zafar confirms spellings). Two AIs agreeing is not evidence. Missing Kutchi is its English in grey italic, tagged "to record" in the markup only (no visible flag; decision 84).
5. **No written English for the child,** except under Nani's lines at the door in story mode (Zafar, 19 Oct). Spoken English only in story mode, said first then in Kutchi, rare and simple. Games and help use no English at all. Written English for grown-ups lives only in the "?" pop-up and the end-of-round review.
6. **Pass the Kutchi leak test:** someone who knows no Kutchi can't win by reading, matching, eliminating, patterns or waiting.
7. **Done means an independent picture, not tests passed.** Red then green: the row's check fails before the fix and passes after, and a judge who isn't the builder (the `judge` agent) passes the picture, flaws first.
8. **The same shared screens and buttons in every mode,** from `js/shared/`, never restyled per mode.
9. **No clipped or ellipsised text, anywhere.** Headlines shrink, then wrap.
10. **Only real family voices ship;** no AI Kutchi. The device voice reads unrecorded lines on the test site only, never the store build (Zafar, 20 Oct).
11. **Every line is a full, natural sentence built by the language engine, and every word the child hears is a real family voice.** The most frequent phrases (found by statistical analysis of simulated play) are recorded whole; the rest are assembled from recorded words. Never hand-written fragments or hand fixes: if the engine can't say it, report the gap.
12. **Nothing makes a child feel bad:** show progress, not verdicts; never make them wait for speech; they can take it back until Done.
13. **Art is made in ChatGPT runs that Zafar supervises** (decision 77): Claude writes one paste block, he runs it, Claude judges, cuts and wires; no image-API art without his say-so.
14. **Sessions:** builders are in-chat subagents in their own worktrees, two at most on different files (four while two sprints overlap: Zafar, 19 Oct); they never judge their own work or push; the orchestrator judges, merges, runs the full check and publishes (`/publish`).
15. **Be cost-conscious:** top model for judgement and visual work, mid-tier for mechanical work; no fan-outs or full re-shoots while iterating.
16. **The family is Khoja Shia Ithna'asheri Muslim** (internal note only; never named in anything players or the public read): halal only, no Hindu religious markers, modest clothing; never sweets, lollies or biscuits as rewards (mithai at a celebration is fine).

## Where things live

Each area's design and decisions live in its own doc (shared screens and art in `docs/design-language/`, modes in `docs/game-design/modes/`, language in `docs/language/`). A yes or no from Zafar → the doc, row or check it changes (sprint-only → the sprint file). Feedback → a fix-list row the same day (`/feedback`). An idea → `docs/ideas.md`. A question for him → `docs/questions.md`. A session's work → `build/reports/`. Index: `docs/README.md`; tools: `docs/tools.md`.

## Tools and skills: use them by default

Zafar never has to ask: `/sprint`, `/brief` (every launch), `/checkin`, `/review` (before anything reaches Zafar or `main`), `/publish`, `/feedback` (every voice note), `/mum-round`, `/art-run`, `/handover` (every step end); `node build/tools/review/checks.mjs` before every push. Fix any that is missing or broken.

## Starting a chat or session

Read `docs/status.md` "Next chat" only; open nothing else until a task needs it. Check `git log origin/main`. Read reports, never transcripts. Hand over at each step end or around 70% context.
