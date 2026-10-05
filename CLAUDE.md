# Nani jo Ghar

A game that teaches young children Kutchi through play at Nani's house, voiced only by the real family. Zafar owns it and decides. It runs as a web app on GitHub Pages (`main` is the live site) and will be wrapped for the app stores.

**The newest word from Zafar wins.** If he says something that clashes with this file or the rulebook, follow him, then update the rulebook (`docs/process/rules.md`) and the decisions log (`docs/decisions.md`) in the same commit.

## Working agreement

- Discuss first. Never start builds, agents, sessions or art while Zafar is still talking something through or while a question to him is open. Propose, wait for an explicit go, then act.
- Approval for one thing is not approval for the next. Work one step at a time; each step ends with a deliverable Zafar reviews.
- When he says more is coming, collect and list; plan nothing until he's done.
- Put decisions to him as a numbered list, each with a recommendation, answerable "yes to all except …". Write his answers into `docs/decisions.md`.
- Nothing reaches Zafar that breaks a written rule. Run the QA checklist first and look at the screenshots yourself.
- Keep replies short and plain. Don't assume he remembers IDs.
- Hand him exactly what to do, ready to paste: one block for Chrome, one message for a session, the link and what to play (`labs.html` links every lab).
- Recommend a model and effort level with every suggested action, and give a cost estimate before every launch.
- Improve on his ideas: research best practice and push back where it's warranted.
- Voice-note feedback becomes a full report: every point with its timestamp, the cause checked in code, the fix, and a coverage check mapping every transcript line. It opens with every mechanic changed and old art reused.
- The orchestrator owns the regression list, so Zafar never has to track feedback: every new feedback item becomes a row the same day; every brief lists the rows for the screens it touches; every step end reports open rows by mode in `docs/status.md`.
- During runs, post a one-line update to Zafar at every check-in.
- New mode work runs: audit (screenshots of every screen) → Claude's feedback draft → Zafar approves → build. Before calling a mode finished, go through its open ideas in `docs/ideas.md` with him.

## Tools and skills (use them by default)

Zafar never has to ask for these. The orchestrator and every session use the project skills in `.claude/skills/` and the scripts in `build/tools/` whenever the task matches, instead of doing the work by hand: `/checkin` at every check-in, `/brief` for every launch, `/review` before anything reaches Zafar or `main`, `/publish` to go live, `/feedback` for every voice note, `/mum-round` for every batch of Mum's recordings, `/art-run` for every art run, `/handover` at every step end. If a tool is missing or broken, fix or extend it rather than working round it. The tool list is in `docs/architecture/testing.md` (Tools).

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
13. **Art is made in ChatGPT via Claude in Chrome** from one ready-to-paste block. A paid API only for a rapid prototype when Zafar can't respond, under $2.
14. **Sessions:** at most ~4 at once, no helper sessions, complete briefs, `python3 build/bump_version.py` and one push to `main` at the end.
15. **Be cost-conscious:** top model for judgement and visual work, mid-tier for mechanical work; no fan-outs or full re-shoots while iterating.
16. **The family is Khoja Shia Ithna'asheri Muslim** (internal note only; never named in anything players or the public read): halal only, no Hindu religious markers, modest clothing; never sweets, lollies or biscuits as rewards (mithai at a celebration is fine).

The full rulebook, grouped by topic, is `docs/process/rules.md`. **Read the sections that apply before any build or design work.** Every rule lives there once; other docs link to its IDs rather than restating it.

## Where things live

- `docs/README.md`: the index of every doc. Start here.
- `docs/status.md`: what's live, in progress and next. Update it at every milestone.
- `docs/decisions.md`: every decision Zafar has made, dated, newest last.
- `docs/process/rules.md`: the rulebook. `docs/process/qa-checklist.md`: the definition of done. `docs/process/regressions.md`: every past feedback item.
- `docs/vision.md`: pitch, audience and the design pillars that break ties.
- `docs/game-design/`: arcs, cast, progression and scoring, one file per mode.
- `docs/design-language/`: art bible, art pipeline, UI design system, UX principles, tone of voice, audio.
- `docs/language/`: grammar notes, lexicon, Mum's question rounds, the engine spec.
- `docs/architecture/`: technical plan, shared API, conventions, testing.
- `docs/feedback/`: dated play-test notes. `docs/ideas.md`: the parking lot. `docs/archive/`: superseded docs (moved, never deleted).
- `build/reports/<name>.md`: one report per build session.

## Starting a chat or session

1. Read `docs/status.md` (its "Next chat" section first) and the rulebook sections for the work at hand.
2. Check `git log origin/main` before redoing anything.
3. For a mode, read its file in `docs/game-design/modes/` and the design-language docs it touches.
4. A new orchestrator chat opens with a short plan update for Zafar.

## Running sessions

- Re-arm a `send_later` check-in every 30–40 minutes while sessions run, and look at their finished screenshots yourself each time.
- "Idle" isn't dead: read `updated_at` and `status_detail`, wait 20–30 minutes, and never relaunch a session that's still running. After a usage limit or restart, check every session and relaunch stopped ones as continuations.
- During a run, log a timestamped line in `docs/process/overnight-log.md` and push the branch every 20–30 minutes.
- Overnight runs end with a written report by 08:00 UK, then `docs/status.md` is updated so a new chat can start.

## Briefing a build session

Use `docs/process/session-brief-template.md`. Every brief names: the files the session owns, a hard stop time, links to this file, the rulebook and the QA checklist, "don't remove mechanics", "no helper sessions", and the permissions it needs up front.

- Parallel sessions only on disjoint files. Shared files (`js/shared/`, the kitchen kit, the order card) have one owner; others import them.
- A mode session edits only its own mode's files. A missing shared piece becomes a marked stub with the same API.
- Big refactors live on their own branch until approved.

## Git and publishing

- Commit small and often. Never force-push. End commit messages with the Co-Authored-By and Claude-Session lines.
- Every asset URL built in code goes through `Cook.v()` / `njgV()`. Run `python3 build/bump_version.py` before every push to `main`.
- Publish = bump, commit, push the branch and `HEAD:main`. If an upload races you, merge `origin/main` and push again; on `?v=` conflicts take the real side and re-bump.
- Browser tests run one at a time (`flock -w 1800 … timeout`, own `COOK_TEST_PORT`).
- End every build session with `build/reports/<name>.md`, the QA checklist results, and ONE push to `main`.
- Tell Zafar something is live only after the Pages build ran for that commit and the fix shows after a hard refresh; send a screenshot.

## Definition of done

Work is done when `docs/process/qa-checklist.md` passes:

- the automated checks run clean;
- every visually distinct state is screenshotted uncropped at the sizes and levels the checklist names, one written line per state;
- someone other than the builder has reviewed the screenshots, listing flaws first (zoom ×2: clipping, spacing, padding, alignment, overlap);
- every item on `docs/process/regressions.md` for the touched screens is rechecked;
- the change is compared side by side with the approved mock-up and with Zafar's last feedback, item by item.

Build sessions check fast (tests, leak scripts, `checks.mjs`, one laptop-size `--touched` pass on what they changed); the full matrix, sound run and outside review run once, in the orchestrator's `/review`, before a publish (decision 48).

## Language

- Romanised Kutchi only; the family's spellings and words as written in `docs/language/grammar-notes.md` and `docs/language/lexicon.md`.
- No Kutchi grammar in game code: frames and word forms live in data; nouns carry gender, singular and plural.
- Search `data/family-audio.json` before calling a word "English only".
- Never show English or pictures where the task is understanding Kutchi.

## Art

- Plan before prompting: what the object is for, how it's seen in game, who stands where in a background.
- Judge every generated asset pass/fail and fix failures before Zafar sees anything. Zafar approves only characters based on real people (Nani, Big Ma, the doctor); everything else needs no approval from him.
- Art runs need no manual steps from Zafar: the Chrome runner moves images between GitHub and ChatGPT in the browser, never via downloads.
- The method is `docs/design-language/art-pipeline.md`; the look is `docs/design-language/art-bible.md`.

## Handover

Don't wait for a chat to fill up. Rewrite the "Next chat" section at the top of `docs/status.md` (where things stand, what's open, a ready-to-paste starting prompt) and push it at the end of every step or gate, and before any long run. Recommend a fresh chat at each step boundary, or when Zafar sees the context around 70% full, rather than letting it compact mid-task.
