# Rules harvest: every standing rule Zafar has given (30 Sept 2026)

**What this is.** A complete harvest of Zafar's standing instructions, preferences, quality bars and durable product decisions, gathered from every handover, design doc, play-test report and the current orchestrator chat. It feeds one tight rulebook (`CLAUDE.md`) that every future session loads. Completeness wins over brevity here; `CLAUDE.md` takes the "Candidate CLAUDE.md core" at the end plus pointers.

**How to read a line.** `R-<category><n> — the rule — source: <file § / timestamp>, <date>`. Where the same rule appears in several places it's merged into one line citing all of them. Timestamps from the chat are UTC. Newest word from Zafar wins; clashes are listed in "Conflicts and superseded rules".

**Sources read (all in full unless noted):**
- **ZM** = Zafar's own messages in the current orchestrator chat, 29–30 Sept (`scratchpad/zafar-messages.txt`). Highest authority.
- **CS** = the chat's compaction summary ("standing instructions"), 29 Sept.
- **OH** `docs/ORCHESTRATOR-HANDOFF.md` · **H26** `docs/HANDOVER-2026-09-26.md` · **H29** `docs/HANDOVER-2026-09-29.md` · **MS** `docs/MORNING-SUMMARY.md` · **OQ** `docs/overnight-queue.md` · **OL** `docs/overnight-log.md`
- **UX** `docs/UX-PRINCIPLES.md` · **VQA** `docs/VISUAL-QA.md` · **CDS** `docs/design/cook-design-system-v1.md` · **SMP** `docs/design/speaking-more-proposal.md` · **PR** `docs/design/plans-remaining-2026-09-29.md`
- **CPT** `docs/feedback/cook-playtest-2026-09-29.md` · **CLPT** `docs/feedback/clinic-playtest-2026-09-29.md` · **CUF** `docs/cook-ui-feedback-2026-09-28.md` · **PT23** `docs/playtest-2026-09-23.md` · **TODO** `docs/cook-with-nani-todo.md`
- **RM** Roadmap and Story Structure · **AB** Art Bible · **PB** Project Brief · **TP** Technical Plan · **GD** Game Design · **CAST** Cast · **ABP** Asset Building Plan · **KGN** `docs/kutchi-grammar-notes.md` (spelling/word rules only) · **ST** `docs/STATUS-TRACKER.md` · **IDEAS** `docs/ideas-2026-09-28-arcs-and-focus.md` · **GI** `docs/GAME-IDEAS-TBC.md`
- **BC** `docs/modes/BUILD-COMMON.md` · **MQB** `modes/MINIGAME-QUALITY-BRIEF.md` · **MDB** `modes/MODE-DESIGN-BRIEF.md` · **DDB** `modes/DEEP-DIVE-BRIEF.md` · **PIPE** `modes/PIPELINE-BRIEF.md` · **CONV** `modes/conversations-design.md` §10a · **CD** `modes/clinic-design.md` · **CV2** `modes/clinic-v2-design-sheets.md` · **FL** `docs/first-launch-story.md` · **SRP** `docs/speech-recognition-plan.md` · **GM2** `docs/game-modes-v2.md` · **FPW** `docs/free-play-and-world-ideas.md` · **CWW** `docs/cook-with-nani-words.md` · **CWB** `docs/cook-word-changes-B.md` · **BB4** Build Brief v4 · the ChatGPT prompt pages (`chatgpt-art-prompts-*.md`, `art-run-tonight.md`), skimmed for rules.

---

## A. Working agreement and communication

- R-A1 — Discuss first; act only when told. While Zafar is discussing, thinking aloud or asking a question, don't start building, editing, launching agents or generating assets: talk it through, agree the plan, then act. "Don't start doing anything, just talk to me first." — source: ZM 2026-09-30T17:25 and 17:40; PB "Rules for working with Claude" 1, 22 Sept
- R-A2 — Never launch a build or agents while a question to Zafar is open. Clarify every question and decision first, then set agents off. — source: ZM 2026-09-29T11:32; OH Lessons, 28 Sept; CS standing instructions, 29 Sept; CPT §10 and CLPT §9 ("nothing is built until answered"), 29 Sept
- R-A3 — Put decisions to Zafar as a numbered Q list, each with a recommendation, answerable as "yes to all except …". His answers override the recommendations and are written into the doc. — source: CPT §10, CLPT §9, 29 Sept
- R-A4 — "If I didn't comment on something, leave it." Change only what Zafar commented on; don't restyle or rework anything he didn't mention. — source: ZM 2026-09-29T13:06; CPT §10 Q2; CS, 29 Sept
- R-A5 — Never remove or replace a mechanic (or a whole mini-game) without Zafar's explicit OK. A report's first section lists every mechanic changed and every piece of old art reused. — source: CPT X15, 29 Sept; CS, 29 Sept
- R-A6 — Voice-note feedback becomes a full, thorough report: every point with its timestamp, the cause checked in code, the fix, Claude's analysis, a game plan, and a coverage check mapping every transcript line to an item. Don't lose any detail; triple-check. — source: ZM 2026-09-29T11:32; CS; CPT §12 and CLPT §12 (the method), 29 Sept
- R-A7 — When Zafar says more input is coming (e.g. a second voice note), transcribe and prepare, but don't make the plan or act until all of it is in. — source: ZM 2026-09-29T14:01
- R-A8 — Fix things properly: "not a quick fix, the genuine fix". Once an issue is fixed it stays fixed; Zafar must never meet old feedback again. — source: ZM 2026-09-30T17:18 and 17:25
- R-A9 — Zafar states his aims; Claude proposes how to reach them, researches best practice, and improves on or pushes back against his suggestions rather than just executing them. — source: ZM 2026-09-30T17:40 and 18:06
- R-A10 — Hand Zafar exactly what he has to do, in its simplest form: one ready-to-paste block for Claude in Chrome, one ready-to-paste message for a running session, the link and what to play. Never make him assemble or decode instructions. — source: ZM 2026-09-29T11:32 and 16:15; OH Lessons, 28 Sept
- R-A11 — Always recommend a model and an effort level (and, for a new chat, the mode) alongside any suggested action, so cost is a visible choice. — source: PB "Rules for working with Claude" 2, 22 Sept; ZM 2026-09-30T17:40
- R-A12 — Be token- and cost-conscious: the cheapest route that reaches the quality bar; the top model for judgement and visual work, the mid-tier model for mechanical work (data, wiring, tests, docs). No overnight fan-outs and no full re-shoots while iterating. — source: PB rules 3, 22 Sept; OH, 25 Sept; VQA §4; CLPT G10 and §11, 29 Sept; ZM 2026-09-30T17:40
- R-A13 — When the plan says so, go slower and execute one thing at a time rather than in parallel. — source: ZM 2026-09-30T17:40
- R-A14 — Before any mode or station is called finished, remind Zafar of its open ideas in `docs/GAME-IDEAS-TBC.md` and decide with him; approved-but-unbuilt ideas go in that file (marked done when built, never deleted). — source: GI header, 26 Sept; OH Lessons, 26 Sept; H26; H29
- R-A15 — `docs/STATUS-TRACKER.md` is the master tracker: update its percentages and next steps at every milestone and work to it. A status update covers every section, structured around the current story arcs and plan. — source: OH Lessons, 26 Sept; ST header; ZM 2026-09-29T09:21
- R-A16 — Apply what one game's feedback taught to all its sibling games before Zafar plays them (e.g. a first pass on every heal game after the first ones were reviewed). — source: ZM 2026-09-29T23:54; CLPT §13k
- R-A17 — Overnight runs: set up check-ins, and have a written report ready by 08:00 UK on what was done and what's next. — source: ZM 2026-09-29T23:54
- R-A18 — Keep one tight rulebook and one place for reviews; don't scatter Zafar's rules across many lists, handovers and files. — source: ZM 2026-09-30T17:40 and 18:06
- R-A19 — Don't be quick to dismiss older handover docs: check them for rules before archiving them. — source: ZM 2026-09-30T18:14
- R-A20 — The orchestrator chat is the planning, strategy, review and feedback hub: delegate the work with tight briefs, keep its context lean, and have agents report in under ~250 words. — source: OH "How Zafar wants this run", 25 Sept
- R-A21 — Zafar may talk to a child session directly: read `docs/overnight-log.md` for decisions he made there and copy them into the design doc. — source: OH new lessons, 29 Sept
- R-A22 — New work on a mode follows: audit (screenshots of every screen) → Claude's feedback draft → Zafar approves → build. — source: PR B1–B2 and C, 29 Sept; ST §2
- R-A23 — Plan in the orchestrator chat, then write a clean instruction file for any new chat that executes it. — source: ZM 2026-09-30T17:40

## B. Sessions, agents and git

- R-B1 — At most about 4 build sessions at once (6+ parallel top-model sessions hit the 5-hour usage limit in ~1½ h). — source: OH lesson, 26 Sept; H26 Setup; OQ rules, 29 Sept
- R-B2 — Parallel sessions only on disjoint files: one owner per file group. Shared files (the kitchen kit/hob, the order card, `ui.js`) have one owner at a time; others import only, making small additive edits after `git pull --rebase` if they must. — source: OH Lessons, 25 Sept; OQ rules, 29 Sept
- R-B3 — Build sessions must not spawn helper sessions or background helpers; write this into every brief. — source: OH new lessons, 29 Sept; CS, 29 Sept
- R-B4 — Every brief is complete (remote sessions can't be messaged): it names the files the session owns and a hard stop time, links UX-PRINCIPLES, VISUAL-QA and the design system/rulebook, and forbids removing or replacing mechanics. To redirect a session, interrupt it and relaunch. — source: OH, 25 and 29 Sept; VQA intro; CPT X15, 29 Sept
- R-B5 — Launch remote sessions with `create_session`, `source_revision` and `outcome_branch` both set to the integration branch; the top model for anything visual. — source: OH "Start here", 29 Sept
- R-B6 — Every session appends a timestamped line to `docs/overnight-log.md` and pushes its branch every 20–30 minutes; it ends with a report in `build/reports/<name>.md`, the VISUAL-QA matrix, `bump_version` and ONE push to `main` (Pages allows about 10 builds an hour). — source: OQ rules, 29 Sept; OH "Start here", 29 Sept; CS ("push main once per session at the end, after bump_version"), 29 Sept
- R-B7 — Run `python3 build/bump_version.py` before every push to `main`; every asset URL built in code goes through `Cook.v()` / `njgV()`. — source: OH Lessons, 25 Sept; H26 Setup
- R-B8 — `main` is the live GitHub Pages site. Publish = bump_version, commit, push the branch and `HEAD:main`. If Zafar's art upload races your push, merge `origin/main` and push again. — source: H26 Setup; OH new lessons, 29 Sept; CS errors, 29 Sept
- R-B9 — `?v=` stamp conflicts in a merge: take the side with real changes, then re-bump. — source: H26 Setup, 26 Sept
- R-B10 — Follow-ups go to the same session while it's open (it saves the start-up cost): give Zafar a ready-to-paste message for it. Otherwise start a new session with the old report attached. — source: OH Lessons, 28 Sept; H29 "Suggested next steps"
- R-B11 — After any usage-limit hit or container restart, check every agent and session and relaunch the stopped ones as continuations from their branch. — source: OH, 25 and 26 Sept
- R-B12 — "Idle" doesn't mean dead: read `updated_at` and `status_detail`, and give a session 20–30 more minutes before relaunching it as a continuation. — source: OH lesson, 28 Sept
- R-B13 — While sessions run, the orchestrator re-arms a `send_later` check-in every ~30–40 minutes and looks at finished screenshots itself at each one. — source: OH "Start here", 29 Sept; CS pending tasks, 29 Sept
- R-B14 — Check `git log origin/main` before redoing any work. — source: OH update, 25 Sept
- R-B15 — Commit messages end with the Co-Authored-By and Claude-Session lines; commit small and often; never force-push. — source: OH, 25 Sept; BC Git
- R-B16 — Browser tests run one at a time, wrapped in `flock -w 1800 … timeout`, each agent on its own `COOK_TEST_PORT`, `--canvas` for `--days` runs; split a long lab run by `--stations`; discard rewritten `build/screenshots/` unless you mean to commit them. — source: OH Lessons, 25 Sept; CS, 29 Sept
- R-B17 — A mode build session edits only its own mode's files; `js/shared/`, Cook's files and other modes are read-only unless the brief gives ownership. Missing shared pieces become clearly marked stubs with the same API; persistence goes through the progress/storage API, never a mode's own `localStorage` keys. — source: BC Files, 25 Sept

## C. Review and QA (the definition of done)

- R-C1 — Tests passing is not "done" for visual work. It's done only when someone has looked at every state and judged it against the design intent, the way Zafar will. "What's the point of all these tests if it passes this?" — source: ZM 2026-09-29T11:09; VQA intro and §1, 28 Sept; OH lesson, 28 Sept; PT23 §6 rule 10, 23 Sept; RM Lessons 12
- R-C2 — Shoot uncropped screenshots of every state that draws something different (e.g. heating, turned down, pan away, boiled over; all right / mixed / none), at 390×844 phone and 1366×768 laptop, and levels 1–4 where the layout changes. Open each and write one line per state. Each shoot script lists its states. — source: VQA §1 and §5, 28–29 Sept
- R-C3 — The reviewer lists what's wrong before saying anything is right: zoom ×2 on the focal object and write every flaw (alignment, overlap, crowding, clipped words, spacing and padding, empty or lit-but-unused things, labels, differences from the mock-up). "Looks right" with no flaws listed isn't a review. — source: VQA §5, 29 Sept; ZM 2026-09-30T17:40 (the standard checklist: clipping, spacing, padding)
- R-C4 — The builder doesn't mark its own homework: the orchestrator or a fresh session reviews the final shots, and the orchestrator never passes on a session's "done" unseen. A reviewer pass follows every build. — source: VQA §4 and §5; OH new lessons, 29 Sept
- R-C5 — Before calling a station or game done, compare it side by side with the approved mock-up and item by item with Zafar's last feedback (every item gets ✅ or a note). — source: VQA §5; CPT X15 guardrail 3 and §11 step 5, 29 Sept
- R-C6 — Keep a regression list of every past feedback item (e.g. clipped "Bring me these", a clipped highlighted word) and recheck all of them at every review, so old issues never come back. — source: ZM 2026-09-30T17:18
- R-C7 — Measure what can be measured (`build/check_vessel_meta.py` and the like); add a check whenever art metadata drives placement. — source: VQA §5, 29 Sept
- R-C8 — While iterating: laptop view only, only the changed screens, one shot each. The full matrix (phone and laptop, every state) plus the repo's tests only before the one final push to `main`. — source: VQA §0, 28 Sept
- R-C9 — After pushing, confirm the GitHub Pages build ran for that commit; only then tell Zafar it's live, and send a screenshot. — source: VQA §3, 28 Sept
- R-C10 — The Kutchi leak test (the Sceptic, "the wife's test"): someone who knows no Kutchi must not win by reading, matching text to text, eliminating options, fixed patterns or waiting for hints. Every mini-game gets a leak bot proving level 1 can't be won blind. — source: MDB §2 rules 1–2; DDB principle 5; BC Tests, 25 Sept; RM research table; ZM 2026-09-29T22:22 ("this clearly doesn't pass the don't-need-to-know-Kutchi test")
- R-C11 — Test on 16:10 laptops (1440×900, 1280×800) as well as phones and tablets; before every tap the test checks that nothing covers the item. — source: PT23 §6 rules 1–2, 23 Sept; RM Layout contract and Lessons
- R-C12 — Every phase of every station or heal game has first-time help, and a check fails when one doesn't (`build/check_onboard.mjs`). It also fails any help that shows child-facing English or uses the device voice. — source: CPT X11, 29 Sept; CLPT §13g, 29 Sept
- R-C13 — Audit each game against the rule table and fix every "no": ghost-finger help with no English; take back before Done; ordered instructions as sequences on the shared card; clears its own UI; shared Done/Next buttons. — source: CLPT §13h, 29 Sept
- R-C14 — A mode's shots are compared side by side with Cook's end screen and buttons; any difference in the shared screens is a flaw. — source: UX §15, 29 Sept
- R-C15 — Check a word is family-recorded (search `data/family-audio.json`) before calling it English. — source: OH new lessons, 29 Sept
- R-C16 — Reviews cover levels 1–4 of every station, not only level 1. — source: CPT K11; CLPT G12, 29 Sept

## D. Art and assets pipeline (including cost)

- R-D1 — Artwork is made in ChatGPT via Claude in Chrome, because it's free, from prompt packs Claude writes. A paid image API only when you need to test or prototype something rapidly, have reason to believe Zafar won't respond, and it costs under $2. — source: ZM 2026-09-30T17:40 (newest); ZM 2026-09-29T11:32 ("I'm more confident on ChatGPT-generated art"); OH Costs, 25 Sept
- R-D2 — When the API is used: medium quality only, a draft first, and the spend reported and tracked. — source: OH, 25 Sept; CDS §10; H29
- R-D3 — Gather every art request into one long paste block for Claude in Chrome. Each prompt has a save-as name and a check line. The block ends with Chrome uploading the images itself to `sources/art/<pack>/` on `main` and reporting pass/fail per prompt; Zafar never uploads by hand. Keep the prompt page on `main` before he pastes. — source: ZM 2026-09-29T11:32 and 16:50 ("that's a good idea we should always do in the future"); OH new lessons, 29 Sept; CS, 29 Sept
- R-D4 — Think before prompting: work out what each object is for and how it will be seen in the game (e.g. skewer pieces seen top-down show no holes). — source: ZM 2026-09-29T16:23; CS errors, 29 Sept
- R-D5 — Backgrounds: before writing the prompt, plan who sits or stands where, at what size, and what must stay clear (heads, dangling feet, the doctor's spot, the card or face circle), and put those numbers in the prompt. Before approving, overlay the real character art at game size with the 16:9 box. "This is the type of thinking that needs to be done before making the prompts." — source: ZM 2026-09-29T16:53; VQA §2b, 29 Sept; CS, 29 Sept
- R-D6 — Lock the backgrounds first, then build on them; prototype mechanics with simple stand-ins on good backgrounds, judge in play, then commission the final art for the approved games only. — source: CLPT G1, G10 and §11, 29 Sept; CV2
- R-D7 — Cut ChatGPT sheets with `build/cut_tick_v2.py`'s method, then check every cut zoomed on the cream background: no grey fringe, ring, holes, squared-off glow or leftover background grey inside handles (run the grey-leftover check). — source: VQA §2, 28 Sept; CPT X14, 29 Sept
- R-D8 — All states of one object share one canvas registered to the object's own bounding box; code maps values onto the object's extent, not the image's. — source: VQA §2, 28 Sept
- R-D9 — Each state of an item is generated fresh with its own full prompt; edit mode is only for small changes to the same object, never state changes. — source: AB §8; OH Lessons, 25 Sept
- R-D10 — Reuse existing approved art where it fits and generate only what's missing, but never pass old art off as a redo: list every reused piece in the report. — source: CDS §15, 29 Sept; CPT X15 and K2, 29 Sept
- R-D11 — Things inside pots and pans are pre-rendered content pictures on one registered canvas (e.g. the chai pan's and the daar pot's states), cross-faded; stirring turns the picture; never drawn dots or flat discs. — source: CPT X9 and Q13, 29 Sept; CUF §8
- R-D12 — Character sheet first: a sheet Zafar has signed off is the only reference for later poses, and nothing is made from a sheet he hasn't approved. Real people's photos stay in git-ignored `sources/private/`, never in the repo; they may be attached to prompts where likeness helps. — source: AB §6; CAST likeness notes; `chatgpt-art-prompts-batch2.md` §3; `batch3` rules; `art-run-tonight.md` PHOTOS, 25 Sept
- R-D13 — Style: a stylised 3D animated-feature look; soft global illumination; warm light from the upper left; believable materials; no outlines, cel shading, flat vector or photorealism; no blur or lens effects; no text, letters or numbers anywhere in art; a contact shadow wherever something touches; nothing floats. — source: AB §1–2 and §9 style/negative blocks, 24 Sept
- R-D14 — One camera per scene: every sprite is drawn in its scene's camera; the same light direction, shadow and scale convention across a scene. — source: AB §3; CDS §7
- R-D15 — Backgrounds are 1600×900 (16:9), never stretched; no painted food near tappable zones; clear flat surfaces where items go; a counter or island for characters to stand behind. — source: AB §5; RM background art brief; PT23 §7
- R-D16 — Item art needs a flat base and a contact shadow so it sits on its surface (e.g. the pharmacy belt). — source: CLPT §13b, 29 Sept
- R-D17 — Every talking character needs two poses, three-quarter (drawn once, mirrored) and facing front; plan them in each art round's people-and-placement plan. — source: UX §16, 29 Sept
- R-D18 — Faces: a head-and-shoulders close-up filling the circle, the same eye line and eye size for every person, three expressions each: neutral (small smile), happy, frown. — source: CPT X4 and Q12, 29 Sept; ZM 2026-09-29T13:06; CDS §14a
- R-D19 — Set-dressing restraint: at most 1–2 cultural nods per scene, rotated between scenes; modern with hints of Kutch and East Africa, never caricature, never clutter. — source: AB §1; ABP §6 (Zafar's wife: "don't do too much, it will look old again"), 24 Sept
- R-D20 — Reds belong to Nani (keep large reds out of the backgrounds behind her); tappable items get the most saturation; backgrounds stay lighter and calmer. — source: AB §2
- R-D21 — Sizes: the order of real sizes never inverts; small items may be drawn up to 1.5× true size; anything below ~90 px on the 1600×900 stage comes in a container or as a heap. — source: AB §4
- R-D22 — Export as WebP with alpha, trimmed with a 16 px pad (lossless for fine edges). Never key magenta out of steel, brass, glass or glowing items: use native transparency or a neutral grey. — source: AB §5
- R-D23 — Assets follow the word list: no image for a word that isn't going into the app. — source: PB "Rules for working with Claude" 5, 22 Sept (see Conflicts)
- R-D24 — The ChatGPT runner (Claude in Chrome) changes no settings, signs nothing in or out, uploads only the listed files, and logs-and-skips anything that needs Zafar's decision. — source: `chatgpt-art-prompts-batch2.md` and `batch3` runner rules; `art-run-tonight.md`, 25–26 Sept

## E. UX and interaction

- R-E1 — No English instructions for the child, ever: no English sentences in bubbles or pop-ups, and no device voice reading them. The child gets the ghost finger plus the Kutchi line with its read-along. The English goal for grown-ups lives only in the "?" pop. If a pop-up needs English, it hasn't shown the task clearly enough. — source: UX §8 (restated 29 Sept); CUF §1, 28 Sept; CLPT §13g, 29 Sept; ZM 2026-09-29T23:35
- R-E2 — Onboarding by showing, not telling, on the one shared onboarding kit (`js/shared/onboard.js`): dim everything except one thing, the ghost finger does the action once, the child does it, then the next thing is revealed. Each mini-game's script is written once its mechanics settle. — source: UX §8 and §10, 25 Sept; CLPT §13g, 29 Sept
- R-E3 — At the start, babysit: every spoken line is also written, and underlined as Nani or the doctor says it. — source: ZM 2026-09-29T22:37; SMP "Say it after", 29 Sept
- R-E4 — The read-along underline is the standard wherever a line is spoken: cards, the pop-up, the guide box, person cards. — source: CPT X2, 29 Sept; UX §1
- R-E5 — Never make the child wait for speech to finish: input is live from the start, a tap during an instruction just goes ahead, and the line can be replayed. — source: ZM 2026-09-29T23:44; CLPT §13i, 29 Sept
- R-E6 — Start super simple: level 1 is the smallest possible round (one skewer, one cup, three pantry things) and each level adds one thing. Level 1 doesn't front-load harder describing words (big/small, sides). — source: UX §7, 25 Sept; CLPT §13j–k, 29 Sept; ZM 2026-09-29T23:48
- R-E7 — One job at a time: a station with two jobs is split into phases with a button between; juggling returns only as a hard level for older children. — source: UX §5, 25 Sept
- R-E8 — Cut what isn't the lesson: before adding anything, ask whether it teaches a word or is fun on its own; if neither, cut it. — source: UX §6, 25 Sept
- R-E9 — UI appears only when it's first needed, fading in over the first rounds. — source: UX §8, 25 Sept
- R-E10 — Show progress, not verdicts: no red crosses, buzzes or "Arre re!" mid-round (from level 2); mistakes show in the end review. The deliberate, gentle exceptions are the conversation reply (R-E26) and the serve review face (R-F20). — source: UX §11, 25 Sept; TODO Wave 6b; CDS §1 and §6
- R-E11 — Card rows tick automatically at every level when that step closes (put down, finished, served), never the moment a number is reached; the count is judged in the end review. — source: UX §11, 25–26 Sept; MS "Decided", 26 Sept; CDS §12
- R-E12 — The counting rule, in every station and mode: level 1 writes the quantity on the card row in Kutchi words and counts aloud as you add; level 2 is written only; level 3+ is heard in the order only. No separate tally counters except chai's sugar. — source: CPT X12 and Q7, 29 Sept; CLPT G6 and §13c, 29 Sept
- R-E13 — Consistent controls inside each mini-game: tap, swipe, drag and stir are all fine, but the same kind of action always uses the same gesture, and a mini-game's gestures never change between levels. Levels make the Kutchi harder, not the gestures. — source: UX §12, 25–26 Sept; MQB
- R-E14 — You can take it back until you press Done: tap anything placed, picked or added to undo it. The first placement is what's scored, so a mistake taken back still counts. Where undo is impossible (cooked, poured, cut), the art shows it. — source: UX §17, 29 Sept; ZM 2026-09-29T22:56 and 23:39
- R-E15 — A filled slot loses its dashed cut-out outline (the pantry tray, the pharmacy tray). — source: ZM 2026-09-29T22:56; CLPT §13b; pantry notes, 28 Sept
- R-E16 — At the top level, don't highlight what the words should tell (e.g. no glow on the left knee while "left knee" is said). — source: ZM 2026-09-29T23:44; CLPT §13i and §13k
- R-E17 — Effects stop when the job is done (no flashing after the last step). — source: ZM 2026-09-29T23:44; CLPT §13i (the knee's done-flash is the one named exception, §13l)
- R-E18 — Every stage clears its own UI when it ends; nothing stale carries into the next round. — source: ZM 2026-09-29T23:32; CLPT §13f
- R-E19 — Reply pills and reply text appear only when a reply is actually needed, and never overlap other UI. — source: ZM 2026-09-29T23:32; CLPT §13f
- R-E20 — Stage it like a play: two characters talking stand three-quarter turned to each other and partly to the front; when it's the child's turn they turn to face the player, and that turn is the "your turn" cue. It's a pose swap with a quick crossfade, not an animation. Applies to the clinic, Cook's customers, Conversations and the trips' stalls. — source: ZM 2026-09-29T23:26; UX §16
- R-E21 — No script cards: a character's card never lists everything they'll say; it shows only the current need, or nothing where the scene makes it clear. — source: ZM 2026-09-29T23:26; UX §16; CLPT §13e
- R-E22 — No new character animations unless they can be done well: a complicated animation that fails makes the game feel cheap, and there are enough real animations already. Prefer the simple version (a picked person rises off the seat). — source: ZM 2026-09-29T22:17; CLPT §13
- R-E23 — Nothing on the page may cover a tappable item or the play area (Nani's "pass me" lives in the sidebar). — source: PT23 §6 rule 2; MDB §2 rule 4; TODO Wave 2
- R-E24 — Anything collected is visible where it goes: no invisible counters. — source: PT23 §6 rule 3; RM Lessons 3
- R-E25 — Help: one light bulb flips the text to English for a few seconds (about 5/3/2/1 s by level) and counts as a hint; one replay per card (the face is the replay button). — source: UX §4, 25 Sept; CUF §9–10; TODO Wave 6
- R-E26 — Conversations: a wrong reply pill shakes (with a short vibration), the person looks embarrassed (3–4 cycling reactions) and asks again until the child picks right; the first try is logged for the end review. Holds for the whole game for tap replies. — source: UX §14, 26 Sept; CONV §10a.13; H26
- R-E27 — The instruction card is the master; in play Nani is a voice plus throbbing hints and short interjections. — source: UX §13, 25 Sept; MQB
- R-E28 — A glow is a hint, not a giveaway: only after a wrong tap or about 5 s of hesitation. — source: RM Learning design decisions, 23 Sept
- R-E29 — Pressure is always the upside version: nothing floods, breaks or punishes; customers never leave angry; you never lose what you've earned. — source: RM Game modes; PB principle 6; FPW; CPT pocket money
- R-E30 — Nothing in the game may make a child feel bad: warm failure, a warm tone (never sarcastic, never babyish), no nagging, no notifications. — source: GD "Warm failure" and "Tone"
- R-E31 — Grown-ups can always skip; nothing is unskippable. The grown-up skip sits behind the "?" menu, not as a visible top-right button. — source: GD "Skipping"; CLPT G7 and CQ15, 29 Sept
- R-E32 — Speaking only inside a real two-person exchange the child has already watched many times (ordering food, the doctor and the patient), never where nobody would say it (no "little boy, next" in a waiting room). Introduce it as watch → handover → say it after the recorded model (words written and underlined) → words only → picture only. Closed set, pills as the fallback, never block progress on recognition. — source: ZM 2026-09-29T22:37, 22:41 and 22:50; SMP, 29 Sept; DDB principle 3, 25 Sept
- R-E33 — Colour never carries meaning on its own: colours are also named aloud. — source: GD "Accessibility"

## F. UI and visual design

- R-F1 — The same screens and buttons in every mode: the end-of-round screen and word review, the three badges, Again/Next/Home, Done, "?" help, the guide box, the order card and the light bulb. One shared component each from `js/shared/`; a mode passes data and never restyles them. — source: ZM 2026-09-29T23:19; UX §15; CDS §12
- R-F2 — Every screen uses only the design tokens: colours (page `#F4ECDF`, panel `#EFE5D6`, card `#FFFFFF`, text `#2A2522`, Kutchi keyword `#8C2F2F`, gold `#C9962E`, sage `#DDE6D5`/`#7E9A76`, wrong `#C0443C` in the end review only), Nunito with the L1–L4 type scale, 8-pt spacing, radii 12 or full circle, one soft shadow, tap targets ≥48 px. — source: CDS §2, 28 Sept
- R-F3 — The UI is flat material, contrasting with the 3D art: white pills with a 1 px border; done = a flat 2 px gold outline and flat gold check; next = a light grey fill; no gradients, bevels or 3D text. — source: CUF §10, 28 Sept; CDS §2
- R-F4 — The grid: the left panel about 22% (guide box on top, one white card per person, a nav dock of three round buttons ? · ⌂ · book); the play area about 78% (scene on top, the shelf band along the bottom). — source: CDS §3, 28 Sept
- R-F5 — The sidebar is on the left; the big action buttons (✓ Done, → Next) sit bottom right under the thumb. — source: UX §2, 25 Sept; UX §15
- R-F6 — Done is the round gold tick at the bottom right of the play area; Next is the arrow with a short label in one pill style; answer pills share one style. — source: UX §15, 29 Sept; CUF §9 (option A)
- R-F7 — Text is never clipped, cut or ellipsised: headlines shrink to fit, then wrap; outlines and glows have room (inset outlines, padding); the guide box may use 2 lines, card rows 1. — source: ZM 2026-09-30T17:18; CPT P2–P3, 29 Sept; OQ note 03:20 and OL 03:07, 29 Sept; CUF §10
- R-F8 — One white card per person: the face (the replay, with a small speaker badge; the whole icon plus a margin tappable) + a short headline + stacked item rows. No name label, no redundant "{name} lai" sub-header, no cards inside cards. — source: CUF §9–10, 28 Sept; CDS §3; CPT X3
- R-F9 — The order model, every mode: person → items → parts, at most three tiers, no word repeated across tiers; no pips or digits (Kutchi number words); rows lower case with no full stop; "don't" rows (*{x} na*) dashed with a small no-sign, neutral until the dish is finished; a finished item folds to one gold line, a finished person to face + headline + ✓; a card waits for its head before the ✓; only cards you can act on in this phase stay expanded; closed card + paid peek at the higher levels; sequences show the sequence line with "next" in grey. — source: CDS §12–§14a, 28–29 Sept; OQ notes, 29 Sept; CLPT §13c
- R-F10 — The card's rows and the spoken sentence come from the same data in the same order; Nani reads the card top to bottom. — source: CPT X1 and P4, 29 Sept
- R-F11 — The guide box is sage (not red or rose): the face is the replay, with only the bulb and mute beside it; the colour lives in one CSS variable. In the clinic it's the doctor's box. — source: CUF §10, 28 Sept; CDS §2; CLPT §13f
- R-F12 — The end-of-station pop-up is one card that steps through: three badges → Next → the word review inside the same card → the actions at the bottom (Again / All stations, or Next station). It sits over the game scene only. — source: CDS §10, 28 Sept; UX §9a
- R-F13 — The badges: each big picture tells a child who can't read or count how they did; gold = perfect (it glows); numbers only in small captions (time inside the stopwatch). Accuracy is a big tick filling green for right and red for wrong; hints is a bulb from bright gold (0) to off (3+). — source: UX §9a, 28 Sept
- R-F14 — The word review: cards with the Kutchi and the English underneath; right words on the right (gold outline), wrong on the left (red outline), a thin divider, both sides top-aligned, the whole vertically balanced; speaker buttons in a neutral colour. — source: UX §9a; CUF §6, §9–10; CDS §10
- R-F15 — The inventory shelf: identical slots; items at true relative heights standing on the shelf line; grouped by kind; under each object one 🔊 word chip (tap the object = use it, tap the chip = hear it). At higher levels the word goes but a same-size speaker-only chip stays. Items with no word show no empty speaker pill. — source: CDS §4 and §10, 28 Sept; CUF §8 and §10
- R-F16 — Shelf padding: the gap from the band's top to the item tops equals the gap from the chips' bottoms to the band's bottom; bounces and glows stay inside the band. — source: CPT X7, 29 Sept
- R-F17 — The focal rule: the thing to act on next pulses gently, inactive things dim about 10%, serving things stay quiet until the serving step. — source: CDS §3
- R-F18 — Fill the whole stage: no letterbox or cream strip; the counter top and game elements fill it. — source: ZM 2026-09-29T09:08; H29; OQ item 8; ST shared pieces
- R-F19 — A single line of text next to a character icon is vertically centred on the icon. — source: CDS §10, 28 Sept
- R-F20 — The serve review, one way everywhere: a large round face circle over the dish (no floating half-bodies, no pretend eating). Happy with the praise clip when right; a gentle frown with the wrong row marked when wrong, and the child redoes it. — source: ZM 2026-09-29T13:06; CPT Q1; CDS §14a
- R-F21 — Characters are hidden by something in the scene (a counter, island, bolster), never by the screen edge; people behind a counter use the counter art; no floating cut-out heads or bodies. — source: PT23 §6 rule 6; RM Characters; CUF §8; ZM 2026-09-29T13:06
- R-F22 — Buttons are hidden until usable, never shown greyed out as "…". — source: PT23 §1.16; RM Sidebar
- R-F23 — No "Step 3 of 8" counters, no English support text on screen, no restyling of the art to a Toca Boca cartoon look. — source: CDS §1, 28 Sept
- R-F24 — Speech comes in a bubble from the speaker: a solid cream background with dark text. — source: PT23 §1.14; RM Characters
- R-F25 — Where a tally is kept it's flat (charcoal numbers, one row, a grid at most three across), shows what you did and never the target, and never takes a tap. — source: CDS §14; UX §11; pantry notes, 28 Sept; TODO Wave 1

## G. Language, Kutchi and voice

- R-G1 — Never invent Kutchi. Zafar's mother (and his aunt, Masi, as a second opinion) is the only authority; two AI models agreeing is not evidence. A word ships only after a family member confirms it. — source: PB "Language authority", 22 Sept; PT23 §6 rule 8; RM Lessons 8; H26; CS, 29 Sept; CPT X1
- R-G2 — Missing Kutchi: use an English placeholder flagged "to record" (grey italic) and list it for the family. Never English inside item pills: use the nearest recorded word or leave the item out of that level. — source: MDB §2 rule 6; CUF §9, 28 Sept; CLPT §13b
- R-G3 — Drafts carry `draft: true` and their source; Zafar's phonetic spellings keep a `say` field for the voice. — source: CWW, 24–25 Sept; TODO Wave 6; OH family words
- R-G4 — Spelling: romanised only, matched generously; W, not V, at the start of a word (V may appear inside, e.g. *sev*); no "the" or other English articles in Kutchi frames; long vowels doubled where the family hears them long (*waari*, *daar*, *maani*). — source: KGN "Spelling rules from Zafar", 25 Sept, and §28; CWB; PB non-goals
- R-G5 — Settled words: no = ***na*** (never *nar*, which means "look"); sugar = ***khun***; two = ***ba*** on screen and "ber" in the voice; one = *hakro* / *hakri* by the noun's gender; unknown gender takes the he-form; he-words in -o pluralise to -a, she-words in -i don't change; the cooking "now" is ***hane*** (*hever kadh* is the urgent one). — source: KGN §3–4, §24, §37; CLPT G9 and CQ16; CWB
- R-G6 — Greetings and register: hello is *salaam*; goodbye is ***khuda-fis*** (not *achija*); thank you is the English "thank you" (not *aabhar aanjo*); ***aai*** for anyone older (older cousins too), ***tu*** for the same age or younger. — source: CONV §10a.1–3, 26 Sept; H26
- R-G7 — Polite refusals: *na khape* / *muke na khape*, never a bare *na*, which is rude. — source: KGN §11; GI #6
- R-G8 — The informal frame *Muke {x} khape* is right and never changes. Cards use the short form; the polite long form (*Tu muke … banai dinda?*) belongs in Conversations. — source: KGN §1; CUF §9, 28 Sept
- R-G9 — Every spoken line is a proper, natural, full sentence (one sentence per person, correct syntax, e.g. includes "want"), never stitched phrases or a literal word list, and it comes from the language engine, not from hand corrections. — source: ZM 2026-09-30T17:18; CPT X1, 29 Sept
- R-G10 — Build a proper language engine the standard way (researched): a lexicon, morphology (how nouns, verbs and adjectives change for gender, number, politeness, possession) and syntax rules, with sentences generated from the rules. Keep the core engine standard, not heavily modified; a rulebook alongside says how to fill and use it. — source: ZM 2026-09-30T17:40 and 18:06
- R-G11 — The engine is filled from Mum's recordings: elicit the grammar through example sentences she answers naturally (one boy, two boys; one girl, two girls), not grammar tables. The engine outputs the phrase and word lists it needs recorded. — source: ZM 2026-09-30T18:06
- R-G12 — Assume the engine builds every word and sentence. After a simulated run of the game, record whole the most frequent phrases so they sound human; assembling from words is the fallback; recordings never change the engine. — source: ZM 2026-09-30T17:40 and 18:06; TP chunked recording
- R-G13 — Never hard-code Kutchi grammar in game engines: frames and templates live in data. — source: FPW; TODO Wave 2
- R-G14 — Every voice in the product is a real family member: no TTS or AI Kutchi ships. Placeholder audio (Gujarati TTS at half speed, or the device voice) is for testing only and is replaced file for file. Never the phone's speech engine for shipped audio, and never a device voice reading English to the child. — source: PB principle 5; RM Platform and Lessons 11; CWW, 24 Sept; UX §8
- R-G15 — English never arrives in the gameplay audio; the only spoken English is the short story lines (English, then Kutchi). — source: PB principle 4; FL "Decided", 26 Sept; H26
- R-G16 — Recording practice: Mum records one long take per session, saying the section IDs; Zafar reads the English and Mum says the Kutchi; speaking words three times from Mum and five takes from Zafar; takes split by silence into clips; Zafar ticks good clips in `lab/family-audio.html`. — source: OH family words, 25 Sept; CONV §9; SRP; KGN recording notes
- R-G17 — The model voice for the child's replies is Zafar's for a boy and Mum's for a girl, for now. — source: CONV §10a.11, 26 Sept
- R-G18 — Nouns carry gender, singular and plural in the data, and the game says the right form for the count. — source: TODO "Noun singular and plural", 26 Sept; TP Word entity; H26
- R-G19 — Sides are always the patient's own, said in first person ("my left"): *dabo* / *jamno*; the family's *hi baju* / *hu baju* with pointing at level 1. — source: CD R3.1; GI #11; KGN §17
- R-G20 — The doctor orders, so his request is "bring me", never "I want"; it stays an English placeholder until Mum confirms the Kutchi. — source: ZM 2026-09-29T22:56; CLPT §13b
- R-G21 — Class-handout differences may be systematic: propose a pattern correction in one pass, and the family confirms it. Vocabulary is fine to use; the handouts' rhymes, text, images and layouts are never shipped. — source: PB "Language authority", 22 Sept
- R-G22 — Never show English or pictures where the task is to understand Kutchi; a word shows as text in only one place at a time. — source: RM Lessons 10; MDB §2 rule 3
- R-G23 — Difficulty is per word, not per level: a word moves up a stage on correct recall from the Kutchi, and two misses drop it. — source: PB principle 1; RM Learning design decisions

## H. Game design and content decisions

### H1. Every mode
- R-H1 — Every mode is a pipeline of stages, each stage a set of mini-games, stitched into one little story with a start and an end. Mechanics are modular (one file each, levels and rounds as data); reuse Cook's mechanics where they fit. — source: PIPE, 25 Sept; DDB principles 1–2
- R-H2 — Design every mini-game against five questions: what you do, where the challenge is (the Kutchi must decide it), where the fun is, where the instruction is, and what's novel. Borrow from what works in current hit children's games; cut to the best. — source: MQB, 25 Sept; UX §12
- R-H3 — Start from the syllabus, find a proven, genuinely fun game for each need, then fit the story around the games. — source: GM2, 23 Sept
- R-H4 — Speaking is core and should grow as the game progresses, with most of it in Cook and above all Conversations; every mode's design sheet lists its natural speaking points. — source: ZM 2026-09-29T22:32 and 22:50; SMP; DDB principle 3
- R-H5 — Scoring is the three end-of-round badges (time, accuracy, hints), with a personal best per mode and level. There is no "ear star" any more; legacy star logic goes. — source: UX §9 and §9a; ZM 2026-09-30T17:25 ("We don't have an ear star anymore")
- R-H6 — Upgrades only ever automate physical steps, never the listening. — source: GM2 §3
- R-H7 — Every mode has a lab and a free-play entry. — source: TODO Wave 3; MDB §2 rule 7
- R-H8 — Timers get about 15% quicker per level, set in the game data so they can be tuned. — source: CDS §11, 28 Sept
- R-H9 — Consecutive errands never repeat the same main action. — source: RM storytelling principles

### H2. Cook
- R-H10 — `docs/design/cook-design-system-v1.md` is the single source of truth for Cook; where it disagrees with an older doc, it wins. — source: CDS header; H29; ST
- R-H11 — Everything is cooked in the pan or pot, never in the glass. One pan per person and one burner per pan (1–4 by level); never an empty or lit-but-unused burner; flames whenever the knob is on. Maani keeps one tawa, because its game is rolling while flipping. — source: CDS §5 and §13; H29; CPT S21
- R-H12 — One shared kitchen kit (the H1–H5 hob family, knobs, heat ring, pour, boards) for every station. Knobs are the size of the face badges, and "on" is a warm glowing ring, with no icon. — source: CDS §13; CPT X5 and Q8
- R-H13 — No hands anywhere in Cook: the knife cuts, the spoon stirs and the pin rolls on their own. — source: CDS §11 and §13; TODO "Hands taken out", 28 Sept; IDEAS §5
- R-H14 — Ingredient cameras: chai's and daar's side-on jars stay; chaat is fully side-on; samosa fillings are top-down heaps with no bowls; sekelo is top-down throughout; the pantry is a straight-on side-on shelf. — source: CPT Q2, 29 Sept; H29; CUF §4
- R-H15 — Pantry first, in story mode only: the first time each dish (chai, daar, chaat, samosa) is made that day starts with a pantry trip for that dish; free play skips it. — source: ZM 2026-09-29T13:06; CPT Q6
- R-H16 — Chai: a cup is sometimes (about half the time, from level 1) ordered by name, *kari chai* / *mori chai*, with rows saying what it means (*dudh na* / *khun na*); a cup with an extra is headed by the *waari* form (*aadu waari chai*). — source: ZM 2026-09-29T09:08 and 09:21; GI #1–2; CPT C5
- R-H17 — "Don't" rows are approved as sub-card rows (*dudh na*, *dungri na*), not *{x} wagar ji {dish}*. — source: ZM 2026-09-29T09:08; GI #1 and #3
- R-H18 — Daar: the swipe (Fruit Ninja) chop stays, with the full review; the chopped pieces wait at the side and untick back to "to do" at the pot; a newly designed speed dial plus a lap count; no oil-heating ring (the sizzle says it's ready); the chop card hides numbers from level 3; slicing a decoy costs but doesn't ruin the dish; Nani may ask for a speed from level 2; the pot shows only what went in. — source: CPT D1–D11, Q4, Q9, Q10 and 30 Sept answers; ZM 2026-09-30T11:03
- R-H19 — Samosa: the swipe fold stays; fill on the flat strip and the first fold covers it, with every later stage a fixed picture; every samosa has a base filling of at least one spoon, and the base row comes first on the card; two different samosas in one order is allowed (the second strip starts empty); a wide burner and a bigger karahi; the jharo lifts from underneath; samosas sit on the plate's flat centre. — source: CPT S-items, Q3 and 30 Sept answers; H29
- R-H20 — Sekelo is the grill station's name and dish word; *mishkaki* means only the meat cubes. The skewer stays vertical; rack and plate are pre-rendered for 0–4 skewers with the pieces added in code; no bare "boga" skewers (a named vegetable or a mixed list in order), mostly mixed at level 3+; chunky pieces that match in bowl and on skewer. — source: H29; CDS §15; CPT K-items and Q11
- R-H21 — Maani: dough is one realistic pile straight on the shelf band, and one ball flies out per tap; cooked maani is flat with brown spots (no puri puff); the turner is a flat wooden one (Zafar's *moikyo*, to confirm); a darker, richer wood board and pin. — source: CPT M-items, Q14 and Q15; ZM 2026-09-29T13:06
- R-H22 — Chaat: build the bowl in order; no tally (the glass shows it); level 4 is one person with the card folded, and peeking costs a hint. — source: CDS §14a, 29 Sept
- R-H23 — Pour is a tap-measure; press-and-hold pouring is out. — source: UX §12; TODO Wave 6b
- R-H24 — Chips are off the grill (they belong to samosa + fry); the juggle and chips may come back at levels 3–4 (parked idea). — source: UX §5–6; GI #8

### H3. The clinic
- R-H25 — The clinic is the children's own doctor's clinic (Hannah's granddad's) and the child is his helper. The doctor fills the guidance role: his box replaces Nani's, which only returns if a story brings her along. — source: CD Revision 2; ZM 2026-09-29T23:32; CLPT §13f; ST §2
- R-H26 — Pretend care only: comical, never gory or scary (no bug); the child never gives medicine, but hands things to the doctor, who checks them and gives them; stitches and injections are fine; no pills or doses for the player. — source: CD safety rule and R3.1; PIPE, 25 Sept; CLPT H-tooth
- R-H27 — The pipeline is waiting room → diagnosis → pharmacy belt → heal game → send-off. The pharmacy tray feeds the heal game; a wrong or missing pick costs score but nothing is greyed out; a wrong item is swapped before the heal game. — source: PIPE; ZM 2026-09-29T21:58; CLPT §13 and §13l
- R-H28 — Waiting room: at most 6 people at every level (babies on laps included); the picked person rises off the seat; ticks under each person; the ladder man/woman/boy/girl → old/young → tall/short → colours → "with the baby"; the call is heard, not read, from level 3 (closed card + paid peek); at level 4 pick everyone straight away, then the set is judged; no speaking here ("call them in" is dropped). — source: ZM 2026-09-29T22:17, 22:22 and 22:32; CLPT W4 and §13–13a
- R-H29 — Diagnosis stays calm, with no time pressure; D1b is folded into D1; tools are clear pictures, and level 1 offers only the right tool plus one other. — source: CLPT D2, D5, D6
- R-H30 — Pharmacy: a straight-on painted belt with no hatches (items of any size slide in and out); items ride the painted belt; a tray like the pantry's; no countdown timer (faster and closer at level 3 instead). — source: ZM 2026-09-29T16:11 and 16:48; CLPT CQ4–CQ5; CV2
- R-H31 — Heal games: scrape = three plasters in the colours and order said (half-and-half colours later); knee = the flash-and-tap bandage wrap (fun, kept); ear = wax blobs dragged out to a set place, pop-ups that stay until dragged, no size words at level 1; tooth = brush in the called order, drill the decay, press-and-hold filling; drinks = coloured bumps, each healed by one drink, against a timer; fever = thermometer back-and-forth until "just right"; boing = coloured beads counted into the syringe; eye = the patient reads the chart and the child judges; foot = pull splinters without touching the edges, both feet at level 3. Tummy, hic and hair wait. — source: ZM 2026-09-29T15:40, 23:44, 23:48 and 23:54; CLPT §9 answers and §13
- R-H32 — The heal game's "why" explainer plays only standalone or in the lab; in a normal run the diagnosis has already set it up. — source: ZM 2026-09-29T23:44; CLPT §13i
- R-H33 — Send-off: the doctor and patient stand on the left in the free space; feelings come in a thought bubble opening to the right (happy, sad, hot, cold); level 1 the face shows it, level 2 it's heard, level 3 a tray of fixes along the bottom; the goodbye happens in the scene; an apple, not a lolly. — source: ZM 2026-09-29T23:21 and 23:26; CLPT §13d–e and E3
- R-H34 — The clinic's end screen also offers "Again" (the same patient) and "All patients", like Cook. Closed cards from level 3 in the heal games and the pharmacy too. — source: CLPT §13l, 30 Sept
- R-H35 — Clinic backgrounds: the bench of six (no armchairs); the exam room with no poster and a frame on the right wall for the real doctor's certificate, with children's toys in a corner; the pharmacy straight on; the front door; the close-up bed for heal games, where the body parts are character close-ups the view zooms into. — source: ZM 2026-09-29T15:40, 15:59 and 16:11; CLPT §9 answers

### H4. Story arcs, other modes and the plan
- R-H36 — The first release candidate is Arc 1, the Birthday, end to end: cook each guest's order, set the table (Put it there), find the sweets (Hide and seek), pack the sweet box, blow out the candles, then the Story by the Fire. No clothes-making, door greetings or shoe mountain in Arc 1; Eid becomes a later arc. — source: RM Story arcs, 28 Sept; IDEAS; GI #23
- R-H37 — Then repeatable day-out trips: pack your bag → cook your packed lunch → travel spot-it → a food stall of three Cook-style games → one or two place games → the Story by the Fire. The beach first. — source: RM, 28 Sept; IDEAS §2
- R-H38 — The travel game stays simple, like the pharmacy belt (the window is the belt, no camera); Snap happens at every destination (shown the items and words, then find and snap them in the scene). — source: ZM 2026-09-29T18:15; RM
- R-H39 — Standalone repeatable arcs: Volunteering at the clinic (introduced after the first or second day out) and Making clothes with Big Ma; the Monsoon and Who did it? are proposed as arcs of their own. — source: RM; ZM 2026-09-29T18:15; GI #24–25
- R-H40 — Every arc ends with the Story by the Fire: a picture book built from what the child actually did that day, voiced by Nani, with gaps the child fills in. — source: RM; IDEAS §4; GI #22
- R-H41 — Order of work: Cook → the clinic (before the doctor's visit, ~9 Oct) → Arc 1's other modes → Arc 1's story layer (the review-the-day book and cutscene transitions) → one trip arc. — source: ZM 2026-09-29T09:21; ST "The path"
- R-H42 — First launch: make your character (the character on the left, picture swatches on the right: gender, skin, hair, eyes, clothing colours only; the name optional and parent-typed) → arrive at Nani's → a three-item pantry round → "*Tu muke chai banai dinda?*" → the chai station → Nani drinks it → the story (English then Kutchi, very short) → Yes/No where only Yes works → home. Its hook is re-pointed at the Birthday. — source: FL, 26 Sept; H26; RM "Known follow-up"
- R-H43 — The chai station gets a fun pass before the first-launch story ships. — source: FL; TODO, 26 Sept
- R-H44 — Conversations: one per mode plus one every 2 minutes (tune after play-testing); get it right to move on. — source: CONV §10a.9 and .13, 26 Sept
- R-H45 — Dropped ideas stay dropped: the fry "take them out or not yet?" (#17), *munje same we*, the pill organiser in the clinic, the tooth bug. — source: GI #12 and #17; CD R3.1; CLPT H-tooth
- R-H46 — Parked modes (Tidy up, Who did it?, Dress up, Monsoon rush, Snap) are rebuilt on the shared components from day one when picked up. — source: PR C; ST §5

## I. Story, characters, and family and cultural rules

- R-I1 — The family is Muslim, Khoja (Shia Ithna'ashari), with Kutch and East African roots: no bindi, tilak, sindoor, deity images or temple items; halal food only (no pork, no alcohol); modest clothing. — source: AB §6 and §10; MDB; ZM 2026-09-29T21:58
- R-I2 — No sweets as treats for children (Mum's rule): the reward is an apple, never a lolly or lollipop. — source: CLPT E3 and H-boing, 29 Sept
- R-I3 — Nani is the child's guide everywhere, not a kitchen-bound character. She's based on Zafar's mum (who agreed); the approved sheet v2 close-up is her canonical look. — source: RM "Nani's role", 28 Sept; CAST; AB §6
- R-I4 — Nani calls the child *beta*, boys and girls alike. — source: GI #16, 26 Sept
- R-I5 — Nani's house is in Kutch: a modern kitchen with Kutch accents; modern throughout, with culture as a hint. — source: RM Setting, 23 Sept; AB §1
- R-I6 — The doctor is based on Hannah's granddad (Zafar's wife's granddad), who is happy with the art. He's always competent, kind and in charge; the comedy is in the patients and the cats, never at his expense; his sheet is signed off by Zafar and Hannah. — source: ZM 2026-09-29T21:44; CD R8 and checklist; CLPT §13
- R-I7 — Big Ma is Zafar's wife's great-grandma: the family seamstress, in her room, who sings while she sews (Zafar's wife records the song). Her relationship to the player is never explained; her in-game name is TBC (Big Ma for now). — source: CAST, 24 Sept; KGN K14
- R-I8 — Simba (black, 5) and Zazu (grey, drawn as a kitten, 1) are Zafar's cats: mischief, no peril. A cat never covers a tap target or blocks play. — source: CAST; AB §6
- R-I9 — Kasuku, the African grey, only repeats words, in the family's own pitch-shifted voices, and only in idle moments, never during a task. — source: CAST "The parrot", 24 Sept; CONV §10a.10
- R-I10 — Isa is only talked about, never talked to. — source: CONV §10a.12, 26 Sept
- R-I11 — Ali is the tall, lanky cousin (renamed from Bilal) and the role-reversal character. Nana, Ma, Ali and the guests are generic, not real family members. — source: CAST; AB §6; OH, 25 Sept defaults
- R-I12 — Zafar's own skin tone (a warm light tan, never orange or oversaturated) is the basis for every generic character; real-likeness characters follow their photos; the player's character offers a real range of warm tones. — source: CAST "Skin tones", 24 Sept; AB §2; first-launch build log
- R-I13 — The story is carried by picture and sound, never by text the child must read; understanding it is a bonus, and the task never depends on it. — source: RM "How the story is told"
- R-I14 — The hub fills up with the story (decorations accumulate), so progress shows as a changed place. — source: RM "The hub fills up"
- R-I15 — Recording consent: every contributor is told where their voice is used and can have it removed. Children's voices are never in the shipped app, and a child's recordings stay on the device. — source: PB; GD; SRP

## J. Other (platform, privacy, release, codebase)

- R-J1 — Nothing leaves the device: no accounts, uploads or analytics; speech recognition is on-device only, with no cloud path in release one. — source: PB principle 9; RM storage rules; OH, 25 Sept defaults; SRP
- R-J2 — A web app on GitHub Pages for testing, wrapped with Capacitor for the stores; landscape; Kids-category rules. — source: RM Platform; TP
- R-J3 — One app, one save: every mode plugs into the shell and `js/shared/save.js`; progress is per word (understand and produce stages). — source: H26; TP; TODO Platform 1
- R-J4 — The content model comes first: positions are measured from each background and stored as scene data, never nudged in CSS; swapping art means replacing files and re-measuring, never changing code. — source: PB principle 11; RM Platform; BB4 rules 3–4
- R-J5 — A landing page (what the game is, plus a sign-up list) and a Planet Zoo–style trailer (built in code from in-game footage, no narrator) are in the plan; decide how it's paid for (Zafar's £2/month idea, first arc free, vs free to the community) before the landing page. — source: ZM 2026-09-29T21:58, 22:17 and 22:22; ST 5a–5c
- R-J6 — The target: a beautifully organised, clear, logical, modular, scalable codebase to modern best practice, so development is quick, global changes are rapid, and the game can be played in the test sandbox against a standard checklist. — source: ZM 2026-09-30T17:40
- R-J7 — Remove legacy code and concepts when the design moves on (e.g. the ear star); no technical debt left lying around. — source: ZM 2026-09-30T17:25
- R-J8 — The agreed sequence from 30 Sept: this rulebook (`CLAUDE.md`) → the docs "brain" structure (living docs with one index, checked against best practice) and archiving of obvious old docs after checking them for rules → the language-engine research and design together with the target operating model and gap analysis → refactor to the target → populate the engine. — source: ZM 2026-09-30T17:40, 18:06 and 18:14
- R-J9 — Success is measured by Mum enjoying the recording, and a child asking to play again unprompted; not downloads, streaks or time in the app. — source: PB "What success looks like"

---

## Conflicts and superseded rules

Newest word from Zafar wins unless he said otherwise. "Keep" = the rule as written in this harvest.

| # | Older rule | Newer rule | Recommendation |
|---|---|---|---|
| 1 | Paid image API allowed up to $5 with Zafar's OK (OH, 25 Sept), then "API if under $2, else a ChatGPT pack" (CDS §10–§15, PR, 28–29 Sept) | ChatGPT via Claude in Chrome by default; API only for a rapid prototype when Zafar won't respond **and** under $2 (ZM 30 Sept 17:40) | Keep R-D1. The design-system "API if under $2" default is superseded. |
| 2 | "Push to `main` as you go, after tests pass" (OH, 25 Sept) | One push to `main` per session, at the end, after bump_version (OQ, CS, 29 Sept); mode build sessions "never push to main" (BC, 25 Sept) | Keep R-B6: one push at the end. BC's "never push to main" was for the parallel phase-0/1 builds; drop it. |
| 3 | At most 2 sessions at once (OQ header) | At most 4 (OQ rules, OH, H26) | Keep R-B1 (≈4), with R-A13 (one at a time when the plan says so). |
| 4 | One build agent per mode, all concurrently (OH / DDB, 25 Sept) | ≤4 at once; go slower, one at a time (ZM 30 Sept) | Keep R-B1 and R-A13. |
| 5 | Every help use "costs the ear star" (UX §4; CPT 30 Sept answers "ear star only") | "We don't have an ear star anymore" (ZM 30 Sept 17:25); badges are the scoring (UX §9a) | Keep R-H5: map every "costs the ear star" to the accuracy or hints badge; clear legacy star code in the refactor. Confirm the mapping with Zafar. |
| 6 | "Progress is an object, not a number: a quilt, not points, stars or XP" (PB principle 8); stars and streaks ruled out (GD) | The three badges with seconds and captions, personal bests, pocket money, voice star (UX §9a, 25–28 Sept) | Newer wins for rounds; the quilt still carries story progress. Flag to Zafar whether the quilt survives at all. |
| 7 | "Nani's house has no timers, ever" (PB principle 7; GD) | Timers in Cook stations, 15% faster per level (CDS §11); Zafar likes the drinks game's time pressure (CLPT, 29 Sept) | Timers are fine as a mini-game challenge that never punishes; the calm rule survives for diagnosis and the pharmacy (R-H29, R-H30). |
| 8 | "No cutscenes" (PB principle 3) | Picture-story panels in the first launch; "the kind of cutscene transition bits" after Arc 1's modes (ZM 29 Sept 09:21) | Short, skippable story beats and transitions are allowed; teaching still happens inside play. |
| 9 | "English never spoken" (PB principle 4) | Story lines: English first, then Kutchi (FL, 26 Sept) | Keep R-G15: spoken English only in the short story lines; gameplay stays Kutchi-only. |
| 10 | "Tap to move, never drag" (RM layout contract, 23 Sept; PT23 §3.1) | Swipe, drag and stir are fine if consistent within a mini-game (UX §12, 26 Sept); ear wax is dragged (ZM 29 Sept 23:48) | Keep R-E13. |
| 11 | Sidebar on the right (sidebar-design, 23 Sept) | Sidebar on the left (UX §2, 25 Sept) | Keep R-F5. |
| 12 | Quantities as "2 × santra" with dots filling in (RM, PT23); "dots only" (sidebar-design); running digit tallies (TODO Wave 1); a picture tally in every station (UX §11) | No pips or digits: Kutchi number words (CDS §12); the counting rule L1/L2/L3+; no tallies except chai's sugar (CPT Q7, 29 Sept) | Keep R-E12 and R-F9. |
| 13 | One card per item with a fixed four-dot skewer card (UX §3); one card per kind (TODO Wave 6b) | The order model: one row per distinct item, same recipe = one row (CDS §12) | Keep R-F9. |
| 14 | Pills as side-by-side chips; a gold-gradient done pill (CUF §9) | Stacked full-width rows; flat 2 px gold outline + flat check (CUF §10; CDS §10) | Keep R-F3 and R-F9. The Done *button* stays the round gold tick (R-F6). |
| 15 | Nani's box in cream-and-red, then pale rose (CUF §3, §9) | Sage (CUF §10; CDS §2) | Keep R-F11. |
| 16 | "Nothing wraps onto two lines" (CUF §9) | Nani up to 2 lines (CUF §10); a folded headline shrinks, then wraps, never "…" (OQ, ST, 29 Sept) | Keep R-F7: shrink first, wrap if needed, never clip or ellipsise. |
| 17 | Word review as a separate page 2 (UX §9) | Inside the same pop-up card (CDS §10) | Keep R-F12. |
| 18 | Letterbox filled with the scene colour or a blurred background (RM; BB4) | Fill it with the counter top and game elements (ZM 29 Sept 09:08) | Keep R-F18. |
| 19 | The masala dabba is the natural top-down spice container (AB §8) | No masala dabba (Zafar, CDS §8, 28 Sept) | Keep "no dabba"; update the Art Bible. |
| 20 | Hands on every station; a whole hand pipeline (AB §7; ABP) | Hands out everywhere; no hands (TODO, CDS §11/§13, 28 Sept) | Keep R-H13. Art Bible §7 is dormant. |
| 21 | Cooking stations top-down (AB §3, provisional) | Chaat fully side-on; chai/daar side-on jars stay (CPT Q2, 29 Sept) | Keep R-H14. |
| 22 | Maani flip with a chimta (CDS §11) | A flat wooden turner, maybe none (CPT Q15) | Keep R-H21. |
| 23 | Thank you = *aabhar aanjo*; bye = *achija* (PT23, CWW, handouts) | English "thank you"; *khuda-fis* (CONV §10a, 26 Sept) | Keep R-G6. |
| 24 | No = *nar* (CWW draft, 25 Sept; old clinic) | *na*; *nar* means "look" (KGN §24; CLPT G9) | Keep R-G5. |
| 25 | *mirchi* one / *marcha* many (H26, ST, 26 Sept) | Mum (28 Sept): *mirchi* has no plural; *marcha* may be Gujarati (KGN P4) | Open: Zafar to decide. Use *mirchi* until then. |
| 26 | "No needles, no stitches" in the clinic (CD R2) | Stitches and injections are fine, comical (PIPE, 25 Sept) | Keep R-H26. |
| 27 | Waiting room grows to 8–12 people (CLPT CQ1) | At most 6 (ZM 29 Sept 22:32) | Keep R-H28. |
| 28 | Speaking in the waiting room (W3 "call them in") (CD; CLPT) | No speaking there; speaking only inside a natural two-person exchange (ZM 29 Sept 22:41; SMP) | Keep R-E32 and R-H28. |
| 29 | Nani whispers "ask them how they feel" at the send-off (CLPT E5) | No Nani box in the clinic; the doctor guides (ZM 29 Sept 23:32); no whisper recordings (SMP) | The doctor gives the cue. Drop Nani's whisper. |
| 30 | "Nani appears everywhere" (RM, 28 Sept) | No Nani in the clinic unless a story brings her (ZM 29 Sept 23:32) | Newer is more specific: keep both; the clinic is the exception. |
| 31 | Taste: "guess the food" recommended; scrape: grit-out recommended (CLPT CQ7, CQ10) | Soothing drinks with coloured bumps; plasters in colour and order (ZM 29 Sept 15:40) | Keep R-H31. |
| 32 | Pharmacy at 45° (CLPT CQ4) | Straight on, no hatches (ZM 29 Sept 16:11, 16:48) | Keep R-H30. |
| 33 | Rows tick only when the step closes (UX §11) | Level 1 the row counts up as you tap (CLPT G6 plan) | Q7 (written + counted aloud at L1) is the rule; a row that visibly counts up must not reveal the target. Confirm with the leak bot. |
| 34 | "Effects stop when done" (CLPT §13i) | The knee's done-flash kept although it gives the count away (CLPT §13l) | Keep both: the knee is the one named exception. |
| 35 | "No negative feedback mid-round" (UX §11) | Gentle social exceptions: the conversation reply (UX §14), the serve frown and redo (CDS §14a), the waiting-room ticks shake (CLPT §13a) | Not a clash: deliberate exceptions, all gentle, never a red cross. |
| 36 | "Assets follow the word list" (PB rule 5) | "Images can precede the word list" (Naming Convention; RM workstreams) | Art may come before the Kutchi is confirmed, but only for items the game will actually use. |
| 37 | Touch targets ≥44 px (TP) | ≥48 px (CDS §2); ~90 px on the 1600×900 stage for art (AB §4) | 48 px for UI, ~90 stage px for tappable art. |
| 38 | Plain web tech, no game engine; magenta-keyed sheets (TP, 22 Sept) | Phaser 3 (RM Platform); native transparency or grey key, cut_tick_v2 (AB §5; VQA §2) | Newer wins. |
| 39 | "No Kutchi speech recognition exists": record-and-compare only (PB; RM) | On-device closed-set recogniser, pills and parent fallback (SRP; DDB, 25 Sept) | Newer wins (R-E32, R-J1). |
| 40 | Card headline: polite long form from level 2 (CUF §1, recommendation) | Cards use the short form only (CUF §9) | Keep R-G8. |
| 41 | "Pages is public: move to a private host before family recordings go in" (RM Platform) | Family clips are already live on `main` (`lab/family-audio.html`, H26) | **Unresolved.** Ask Zafar: accept public hosting for now, or move before wider sharing (the landing page/trailer). |
| 42 | "Not a business … if released widely, it's free" (PB non-goals) | £2/month idea, first arc free (ZM 29 Sept 22:22) | **Open.** Zafar decides before the landing page (R-J5). |
| 43 | "No sweets for children → apple" (CLPT E3) | Arc 1 has "The cat and the sweets", mithai and a sweet box (RM) | **Ask Zafar/Mum.** Likely: the rule is about treats given *to the child* (the clinic's reward); the party's mithai is family food. Don't swap it until he says. |
| 44 | Never show English or pictures where the task is to understand Kutchi (RM Lessons 10) | Claude's first-launch proposal put pictures beside the words on the pantry card (FL) | Zafar's agreed flow didn't adopt that; keep R-G22. Pictures are fine for speaking prompts (SMP), where the task is to say it. |
| 45 | Use existing art wherever possible (CDS §15) | Zafar angry that sekelo v2 reused the old art and called it done (CPT K2, X15) | Keep R-D10: reuse approved art, but say so and never present it as new. |
| 46 | UX §13: Nani appears on screen only in story moments | CDS §3: a sage Nani box with her portrait at the top of the sidebar | Not a real clash: her box lives in the sidebar, never in the play area. |

---

## Candidate CLAUDE.md core (priority order)

The non-negotiables every session loads. Everything else stays in this harvest and the linked docs.

1. R-A1 — discuss first; act only when told
2. R-A2 — no build or agents while a question is open
3. R-G1 — never invent Kutchi; the family is the authority
4. R-A4 — if Zafar didn't comment on it, leave it
5. R-A5 — never remove or replace a mechanic without his OK
6. R-A8 — genuine fixes; fixed issues stay fixed
7. R-C1 — visual work is done only when someone has looked at every state
8. R-C3 — list flaws first (clipping, spacing, padding checklist)
9. R-C4 — the builder doesn't review its own work
10. R-C6 — the regression list of past feedback
11. R-E1 — no English for the child, ever
12. R-C10 — the Kutchi leak test
13. R-F1 — the same screens and buttons everywhere, from `js/shared/`
14. R-F7 — no clipped or ellipsised text
15. R-E5 — never make the child wait for speech
16. R-E14 — take it back until Done
17. R-E12 — the counting rule
18. R-E10 — progress, not verdicts
19. R-G9 — full natural sentences from the language engine
20. R-G14 — real family voices only in the product
21. R-D1 — art via ChatGPT in Claude in Chrome; API only under $2 for rapid prototypes
22. R-D3 — one paste block, auto-uploaded, pass/fail per prompt
23. R-D5 — plan people and placement before background prompts; overlay-test
24. R-B3 — no helper sessions
25. R-B1 — at most ~4 sessions at once
26. R-B4 — complete briefs with owned files, stop time and rule links
27. R-B6 — log, report, VISUAL-QA matrix, one push to `main` at the end
28. R-B7 — bump_version before every push to `main`
29. R-C9 — confirm the Pages build, then tell Zafar with a screenshot
30. R-A6 — thorough voice-note reports with a coverage check
31. R-A3 — decisions as a Q list, "yes to all except …"
32. R-A10 — hand Zafar ready-to-paste instructions
33. R-A11 — recommend a model and effort level
34. R-A12 — cost-conscious; top model for visual, mid-tier for mechanical
35. R-A14 — go through GAME-IDEAS-TBC before calling anything finished
36. R-A15 — keep STATUS-TRACKER current
37. R-I1 — the Khoja Muslim family: no Hindu markers, halal
38. R-I2 — no sweets for children: an apple
39. R-E22 — no cheap animations
40. R-H5 — the three badges are the scoring; no ear star
