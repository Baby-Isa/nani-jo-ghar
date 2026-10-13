# Context pack: S05-T2, tools round 2: the probes packages S and B found wrong (Sprint 5)

Pasted, not linked: the facts a launch used to re-read the whole rulebook for. The full rulebook only where this names a section.

## The last 15 decisions (docs/archive/decisions/decisions-1-to-99.md; the newest wins)
- **73** (8 Oct): Every build session updates the status of each regression row it fixes, in the same commit as the fix; the 'pending decision' note is removed once a decision row answers it.
- **74** (8 Oct): The waiting-room L1 'tap a girl' leak is left as it is until the other patients' art exists.
- **75** (8 Oct): A rule Zafar gives for every game is built once in the shared host and enforced by a contract check over every game and level, never as a per-game fix: the request pop-up before every play phase, moving on by itself when the outcome is ...
- **76** (8 Oct): Sprint 4 is "your feedback sticks": no new features or art beyond his named items until it's done. A route run plays what Zafar plays (every Labs tile and the clinic morning, L1–L4, voice log and a shot of every state); Fable audits every open, ...
- **77** (9 Oct): Art is made in ChatGPT runs Zafar supervises: Claude audits what's needed and writes one paste block; no image-API art without his say-so (replaces decision 71's API default). S04-C's leaning Nani is reverted to her previous art.
- **78** (9 Oct): Feedback is captured at his full strength and checked by the game: /feedback writes every shared or 'everywhere' point as a Shared row with a contract check, quotes his words, and a second Fable reader checks the rows for missing or weakened points before they ...
- **79** (9 Oct): The s05 art run: Nani's forearms really lie on the counter (a small code change draws her above the counter, the first tray kept in front); her face in the family's chunkier render, not the sheet's photographic one; the doctor's part runs only with his ...
- **80** (12 Oct): Samosa's second kind starts with the 'next kind' button (not when the first count is made, which gives the count away). Nani's how-to line at a station's start and her 'pass me' card stay outside the request pop-up (they are not orders); the contract check ...
- **81** (12 Oct): 'Thank you!' is the family's own Kutchi response (said in Kutchi speech as 'thank you'), not English: it stays as a greeting answer and as the pass-me reply, in the Kutchi style. Reviewers and the word lint must not flag it.
- **82** (12 Oct): The evidence loop (docs/architecture/evidence-loop.md): every row gets an evidence spec (the flow, level, size and moment that show it, captured as crops, filmstrips, voice timelines or element text, with machine assertions where possible); the sandbox reaches every moment; reviewers judge small cropped sheets in batches ...
- **83** (12 Oct): The waiting room's call comes from the doctor leaning out of his half-open door (built when his s05 art lands); the eye test's layout A (split screen) is built as a prototype beside layout B for Zafar to choose; the knee close-up framing stays as ...
- **84** (12 Oct): A line or word still to record shows as its English in grey italic only; the visible 'TO RECORD' flag goes (it threw off the spacing, so a screen can't be judged as it will look live). The tag stays in the markup (hidden) so ...
- **85** (12 Oct): The eye test keeps layout A (the close-up of her covering one eye, the chart beside it) as the default; B stays only behind ?eyeLayout=B.
- **86** (12 Oct): Red, then green, per row: every fix starts by running that row's evidence probe and seeing it fail, and ends with the same probe passing (machine) or Fable passing its sheet; nothing is reported done from reading code. Briefs carry each row's probe command.
- **87** (12 Oct): (1) Chaat: the dish is asked for first, the prep games come next, and the layer order is said just before the bowl. (2) Served dishes sit in their tray with the tray's front edge redrawn over them, as in the pantry tray. (3) English ...

## Rulebook sections this task reads
### rules.md §2. Sessions, agents and git
- **At most ~4 build sessions at once,** and one at a time when the plan says so. (A13, B1)
- **Parallel sessions only on disjoint files.** Shared files (kitchen kit, order card, `ui.js`) have one owner; others import, with small additive edits after `git pull --rebase`. (B2)
- **Build sessions never spawn helper sessions.** (B3)
- **A mode session edits only its own mode's files;** missing shared pieces become marked stubs with the same API; persistence only through the progress/storage API. (B17)
- **Launch with `create_session`, `source_revision` and `outcome_branch` = the integration branch** (top model for visual work); follow-ups go to the same session while it's open. (B5, B10)
- **Re-arm a `send_later` check-in every 30–40 minutes** and look at finished screenshots yourself each time. (B13)
- **"Idle" isn't dead:** read `updated_at` and `status_detail`, wait 20–30 minutes, and never relaunch a session that's still running. (B12)
- **After a usage limit or restart, carry on without re-asking:** check every session and relaunch stopped ones as continuations. (B11)
- **Big refactors live on their own branch** until they're ready. (B18)
- **Use the tools by default:** the project skills (`.claude/skills/`) and scripts (`build/tools/`, `build/lang/`, `build/lint/`) are used whenever a task matches, without Zafar asking; a missing or broken tool is fixed, not worked round. (B21, decision 46)
- **Work in sprints:** one goal and a budget per sprint; small decisions in the sprint file (`docs/sprints/`), lasting ones as rules with a why; each sprint ends with one `/review`, a publish, Zafar's play and a short look back. The orchestrator steers new work into a sprint. (A29, decision 49)
- **Every brief is complete:** owned files, a hard stop time, links to `CLAUDE.md`, the rulebook sections it needs and `docs/process/qa-checklist.md` (`build/tools/ops/brief.mjs` writes it, so the generator is the truth), "don't remove mechanics", "no helpers", and the permissions it needs asked for up front. To redirect, interrupt and relaunch. (A24, B3, B4)
- **The release cycle runs in this order:** art finished (a ChatGPT run Zafar supervises) → wired in → full checks on everything (the full QA matrix) → publish to `main` → Zafar plays and gives feedback → new art, art fixes and gameplay fixes from that feedback, then round again. Zafar plays only what is live on `main`, never a half-wired branch preview. The full checks cover only what changed since the last gate (plus screens reached by any shared-file change), never a repeat of unchanged screens. For the clinic, the girl's finished art (part B with its props) is enough; other patients are stitched in later. (B20, decisions 33, 34, 37)
- **Check `git log origin/main` before redoing work;** during a run, log a timestamped line in `docs/process/overnight-log.md` (`checkin.mjs --log` moves earlier days to `docs/process/overnight-log/<date>.md`) and push the branch every 20–30 minutes. (B6, B14)
- **End every session with** a report in `build/reports/<id>-<topic>.md` (under 300 words), the QA checklist results (`docs/process/qa-checklist.md`), `bump_version` and ONE push to `main`. (B6)
- **Run `python3 build/bump_version.py` before every push to `main`;** every asset URL built in code goes through `Cook.v()` / `njgV()`. (B7)
- **`main` is the live Pages site:** publish = bump, commit, push the branch and `HEAD:main`; if an upload races you, merge `origin/main` and push again; on `?v=` conflicts, take the real side and re-bump. (B8, B9)
- **Commit small and often, never force-push,** with the Co-Authored-By and Claude-Session lines. Big audio files go up as a GitHub release. (B15, J11)
- **Screenshots and report images are not committed;** they're kept as release or artifact files so the published site stays under GitHub's 1 GB. (B19, decision 20)
(+1 more bullets: read rules.md §2)
### rules.md §3. Quality and review
- **Tests passing isn't done for visual work.** Done is when someone has looked at every state and judged it the way Zafar will, and played every station through. (C1)
- **Compare side by side with the approved mock-up, with Cook's shared screens, and item by item with Zafar's last feedback** (each ✅ or a note). (C5, C14)
- **A rule Zafar gives for every game is code in the shared host plus a contract check, never a row against one screen.** The shared host runs every game's lifecycle (request pop-up → play → moves on by itself when the outcome is obvious → all voice stops → end screen); a game supplies only its play. One voice layer, one bubble placement, one talk animation for every mode. The contract checks run every game at every level and fail the build on a break (decision 75, 8 Oct). (C19)
- **Feedback lands at his full strength and the game checks it (decision 78):** `/feedback` writes shared or "everywhere" points as Shared rows with a contract check, in his words; a second Fable reader checks for missing or weakened points before the rows land; before every publish the sprint check plays every row the sprint touched and Fable judges each one's evidence sheet. (C21)
- **Red, then green, per row (decision 86):** before a fix, the fixer runs that row's evidence probe (`node build/tools/review/evidence.mjs --run --rows <ID>`) and sees it fail; after the fix the same probe passes (machine) or Fable passes its sheet. Only then is the row built. No fix is reported done from reading code. (C22)
- **Zafar never finds a known bug first.** Before anything reaches him, the route run plays what he plays (every Labs tile and the clinic morning, L1–L4) with a voice log and a shot of every state; Fable checks it against every open and built row; he gets the list of what's still wrong up front (decision 76). (C20)
- **Only tell Zafar it's live after** the Pages build ran for that commit and the fix shows after a hard refresh; send a screenshot. (C9)
- **The builder doesn't mark its own homework:** a fresh session or the orchestrator reviews (Fable for docs and designs); never pass on a "done" unseen. (C4, C17)
- **List flaws before saying anything is right:** zoom ×2 and check clipping, spacing, padding, alignment, overlap, crowding, unused lit things, labels, mock-up differences. (C3)
- **Screenshot every visually distinct state, uncropped, at phone landscape 844×390 (plus 800×360, the tightest common phone, in the full matrix), 1366×768 and 16:10 laptops (1440×900, 1280×800),** across levels 1–4, one written line per state; one upright phone shot checks the rotate card. (C2, C11, C16, decision 15)
- **Tablets are in the matrix too:** 1024×768, 1180×820 and 1366×1024 landscape. (decision 24)
- **Builders check fast; the full check runs once.** A build session runs the tests, leak scripts, `checks.mjs` and one `--touched` pass at laptop size on the flows it changed, one shot each. The full matrix, the sound run and the outside review run once, by the orchestrator's `/review`, before a publish. **Hard limit for build sessions: at most about 15 minutes of browser checks, never a full sandbox pass, a whole mode or the size matrix; anything longer is left to the orchestrator's `/review`.** (C8, decisions 48, 50)
- **The regression list:** every past feedback item is rechecked at every review. (C6)
- **The Kutchi leak test:** a non-speaker must not win by reading, matching, eliminating, patterns or waiting for hints; every mini-game gets a leak bot for level 1. (C10)
(+3 more bullets: read rules.md §3)
