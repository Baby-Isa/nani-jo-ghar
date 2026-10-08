# Nani jo Ghar

A game that teaches young children Kutchi through play at Nani's house, voiced only by the real family. Zafar owns it and decides. It runs as a web app on GitHub Pages (`main` is the live site) and will be wrapped for the app stores.

**The newest word from Zafar wins.** If he says something that clashes with this file or the rulebook, follow him, then update `docs/process/rules.md` and `docs/decisions.md` in the same commit.

## Working agreement

- Discuss first; propose, wait for an explicit go, then act. Approval for one thing is not approval for the next.
- Work in sprints (decision 49, `/sprint`): one goal, a budget, one `/review` and publish at the end, then Zafar plays. Steer new work into a sprint first.
- Decisions go to him as a numbered list, each with a recommendation, answerable "yes to all except …".
- When he says more is coming, collect and list; plan nothing. Improve on his ideas: research, push back where warranted.
- Short, plain replies; don't assume he remembers IDs. Hand him exactly what to do, ready to paste. Recommend a model and effort and give a cost estimate with every launch.

## Non-negotiables

1. **Discuss first; act only when told.** (above)
2. **If Zafar didn't comment on it, leave it.** Never remove or replace a mechanic or mini-game without his explicit OK.
3. **Fix it properly, once.** Every past feedback item is on `docs/process/regressions.md` and is rechecked at every review.
4. **Never invent Kutchi.** Mum is the authority (Masi second opinion; Zafar confirms spellings). Two AIs agreeing is not evidence. Missing Kutchi is a grey-italic English placeholder flagged "to record".
5. **No written English for the child, ever.** Spoken English is allowed only in story mode, said first and then repeated in Kutchi where needed, mainly early on to carry longer exposition; keep it rare with simple lines and visuals. Games and help use no English at all. Written English for grown-ups lives only in the "?" pop-up.
6. **Pass the Kutchi leak test:** someone who knows no Kutchi can't win by reading, matching, eliminating, patterns or waiting.
7. **Done means looked at, not tests passed.** Every state is screenshotted and judged, flaws listed first, by someone other than the builder.
8. **The same shared screens and buttons in every mode,** from `js/shared/`, never restyled per mode.
9. **No clipped or ellipsised text, anywhere.** Headlines shrink, then wrap.
10. **Only real family voices ship.** TTS is test-only and never ships; no AI-generated Kutchi.
11. **Every line is a full, natural sentence built by the language engine, and every word the child hears is a real family voice.** The most frequent phrases (found by statistical analysis of simulated play) are recorded whole; the rest are assembled from recorded words. Never hand-written fragments or hand fixes: if the engine can't say it, report the gap.
12. **Nothing makes a child feel bad:** show progress, not verdicts; never make them wait for speech; they can take it back until Done.
13. **Art is made in ChatGPT runs that Zafar supervises** (decision 77): Claude plans the run and writes one paste block; he runs it and approves what lands; Claude judges, cuts and wires. No image-API art without his say-so.
14. **Sessions:** at most ~4 at once, no helper sessions, complete briefs. A build session pushes its branch only and checks fast (at most about 15 minutes of browser checks, never a full sandbox pass, a whole mode or the size matrix; anything longer is left to the orchestrator's `/review`); the orchestrator alone runs the full check, `python3 build/bump_version.py` and the one push to `main` (decisions 33, 48, 50).
15. **Be cost-conscious:** top model for judgement and visual work, mid-tier for mechanical work; no fan-outs or full re-shoots while iterating.
16. **The family is Khoja Shia Ithna'asheri Muslim** (internal note only; never named in anything players or the public read): halal only, no Hindu religious markers, modest clothing; never sweets, lollies or biscuits as rewards (mithai at a celebration is fine).

## Where a new fact goes

A yes or no from Zafar → `docs/decisions.md` (and `rules.md` in the same commit if it stands). Feedback → a regression row the same day. A design detail → the mode doc. An unbuilt idea → `docs/ideas.md`. A question for him → `docs/status.md`. What a session did → its report in `build/reports/`.

## Tools and skills: use them by default

Zafar never has to ask. Use `/sprint`, `/brief` (every launch), `/checkin`, `/review` (before anything reaches Zafar or `main`), `/publish`, `/feedback` (every voice note), `/mum-round`, `/art-run`, `/handover` (every step end), from `.claude/skills/`, and the scripts in `build/tools/`. If one is missing or broken, fix it. The tool list is in `docs/architecture/testing.md`.

## Starting a chat or session

Read `docs/status.md` ("Next chat" first), then only the `docs/process/rules.md` sections and the mode doc the work needs. Check `git log origin/main`. Read reports, never transcripts. The index of every doc is `docs/README.md`; the rulebook is `docs/process/rules.md` (every rule lives there once; other docs cite its IDs). A new orchestrator chat opens with a short plan update. Hand over at each step boundary or around 70% context.
