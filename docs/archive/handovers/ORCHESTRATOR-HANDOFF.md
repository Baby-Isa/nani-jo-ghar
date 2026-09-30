# Orchestrator handoff (for a new Claude chat)

## Start here (updated 29 Sept 2026, 05:00 UTC)
1. Read `docs/archive/handovers/HANDOVER-2026-09-29.md`, which covers what happened overnight and what's open for Zafar.
2. Then read `docs/status.md` (reworked 29 Sept: Cook stations table, shared pieces, other modes) and `docs/design-language/ui-design-system.md` (the single source of truth).
3. The integration branch is `claude/nifty-rubin-c0d431`. `main` is the live site.

**How the overnight run was orchestrated (reuse it):**
- **Queue and rules:** `docs/archive/handovers/overnight-queue.md`:
  - at most 4 sessions at once;
  - one owner per file group;
  - every session appends a timestamped line to `docs/process/overnight-log.md` and pushes every 20–30 minutes;
  - each session ends with a report in `build/reports/<name>.md`, the VISUAL-QA matrix, `bump_version` and **one** push to `main` (the Pages rate limit is about 10 builds an hour).
- **Tracking:** the orchestrator polls with `get_session` and `git log`, re-arming a `send_later` check-in every 30 minutes. At each check-in it **looks at the finished screenshots itself** and puts what it finds into a polish session. The session that built a station can't be messaged, so the next session takes over its files.
- **Launching sessions:**
  - `create_session` with `source_revision` and `outcome_branch` both set to the integration branch;
  - model = the top model for anything visual;
  - every brief names the files the session owns and a hard stop time.

**New lessons (29 Sept):**
- **Art runs always upload themselves** (Zafar, 29 Sept): every Claude in Chrome paste block ends with Chrome uploading the images to `sources/art/<pack>/` on `main` itself (a commit straight to main), and reporting pass/fail per prompt. Zafar never uploads by hand. Keep the prompt page on `main` before he pastes (Chrome reads it there), and if his upload and your push race, merge `origin/main` and push again.
- **Build sessions must not spawn helper sessions or background helpers** (29 Sept afternoon). The shared-fixes session split three items into helpers, sat idle at 14:21 waiting for them, and they never reported back, so their work was lost. Write it into every brief; the orchestrator checks `get_session` for `status_category: review_ready` + an old `updated_at`, and relaunches the lost items.
- **Zafar may talk to a child session directly** (he told sekelo "top-down throughout"). Read `docs/process/overnight-log.md` for decisions he made there, and copy them into the design doc.
- **A reviewer pass after every build is worth it.** Each station's first build had 2–4 visible issues that only showed up when someone looked at the screenshots (flat chaat layers, filling dots on the fold line, an off-centre fry layout, "•••" pills, a rack that looked like a picture frame).
- **Check a word is recorded before calling it English:** *mixed* and *boga* are family-recorded (B18, B17). Search `data/family-audio.json` first.

---

*(Older content below, from 25–28 Sept; the lessons still apply.)*


**Written 25 Sept 2026, ~11:30 UTC**, at the end of the first orchestration chat. Read this first, then `docs/archive/cook/cook-with-nani-todo.md` (the live to-do and status) and `docs/archive/mode-briefs/OVERVIEW.md`.

## How Zafar wants this run

- This chat is the orchestration, planning, strategy, review and feedback hub. Delegate the work to sub-agents with tight briefs, choosing model and effort per task:
  - the top model for design, mechanics and merges;
  - the mid-tier model for mechanical, test and doc jobs.
- Keep this chat's context lean; agents report in under ~250 words.
- **Push to `main` as you go**, after tests pass. `main` is the live GitHub Pages site (`baby-isa.github.io/nani-jo-ghar/cook.html`, `/find.html`).
- Commit messages end with the Co-Authored-By and Claude-Session lines from the system reminder. The working branch is `claude/funny-fermi-vyrabn`.
- Save often. **After any usage-limit hit or container restart, check every agent and restart any that stopped.** On 25 Sept the container restarted at about 01:40 UTC and all agents died silently.
- Zafar is cost-conscious. OpenAI image API: **medium quality only**, a draft first, and a pre-flight estimate over $5 needs his go-ahead. So far $31.70 has been spent, mostly at the old high-quality default. Free image generation happens in **ChatGPT via Claude in Chrome on his laptop**, from prompt packs we write.

## Lessons (don't repeat)

- **Follow-ups go to the same session** (Zafar, 28 Sept), to avoid paying the start-up cost again. The orchestrator can't message cloud sessions directly (`ListAgents` doesn't list them), so give Zafar a ready-to-paste message for the running session instead of launching a new one.

- **Never start a build while a question to Zafar is open** (Zafar, 28 Sept). If a message ends with questions for him, wait for his answers before launching anything that depends on them. On 28 Sept the chai mock-up was started with a masala dabba he then declined, and had to be stopped and restarted.

- **Browser tests:**
  - never run several at once; wrap each in `flock -w 1800 /tmp/cook-test-$((RANDOM % 2)).lock timeout 1200 …`;
  - use `--canvas` for `--days` runs (software WebGL here is 6–11 fps);
  - use `COOK_TEST_PORT` per agent.
- **`docs/status.md` is the master tracker (Zafar, 26 Sept).** Update its percentages and next steps at every milestone (a merge, a recording processed, an art dump sorted), and work to it.
- **Parked game ideas (`docs/ideas.md`): before any mode or station is called finished, remind Zafar of its open ideas there and decide with him whether they go in** (Zafar, 26 Sept). Add new approved-but-unbuilt ideas to that file, not only to design docs.
- **Cache-busting: every push to main runs `python3 build/bump_version.py` first.** GitHub Pages caches files, so without it returning players keep stale art and code. It stamps `?v=<UTC time>` on every css/js/img tag in the pages, every CSS `url()`, and `js/version.js` (code wraps the URLs it builds in `Cook.v()` / `njgV()`; Phaser loads are stamped automatically). New asset URLs built in code must go through `Cook.v()`.
- **Parallel agents only on disjoint files.** Wave 2's two-agent split cost a 2-hour merge. Combined stations each have their own file, which is why Wave 3 merged cleanly.
- **Cloud sessions and settings:**
  - remote sessions (`create_session`) pick up new environment settings; this chat doesn't;
  - remote sessions can't be messaged, so write complete briefs; to redirect one, interrupt it and relaunch.
- **Art:**
  - edit mode is only for small changes to the same object, never state changes (whole → chopped);
  - hands are one master set skinned in code (skin tone, sleeve, jewellery sprites at per-pose landmarks).

## State at handoff (final, 25 Sept ~18:30 UTC; the old chat has ended)

Everything below is on `main` (live) and on `claude/funny-fermi-vyrabn`. No agents are still running, and no unmerged work was left in the old chat's container.

| Thing | State |
|---|---|
| **Cook with Nani** | Live. Waves 1–5 are all merged. **Wave 5A** (calm UI): an intro order card; one row and one dot per item (a line joins steps in order); Nani quieter (4 s of quiet, later hints, tunable in `data.calm`); help behind "?"; a word-review result card; no step pills or coin counter; pocket money on the title and the day summary. Zafar's draft words (*nar, aastethi, jaldi, adh, bharelo, vadho, nindho*) have a phonetic `say` field. |
| **Art in the game** | **Batch 1 is wired in.** The sprite map is `art.sprites` in `data/cook.json`, with the drawn art as fallback. The painted worktop and hob (day only; the game has no time of day yet); 25 ingredient bowls, the chop vegetables, maani and dough, samosa, chips, mishkaki (raw, grilled, charred), and the vessels. Each station loads its own pictures (10–200 KB). `build/sprites_webp.py` rebuilds the webp files. Still missing or to redo: see the to-do's "Then" section. That's the list for the **next ChatGPT batch**, merged with batch 2 (`docs/archive/art-prompts/chatgpt-art-prompts-batch2.md`), whose results Zafar hasn't uploaded yet. |
| **Characters** | **Swapped to the new art (25 Sept, late).** Nani v2 (approved close-up, used for all her moods for now), Nana, Ma and Ali, all leaning on the island; `isa-badge` and `kasuku-badge` are cut for later. The old files are in `assets/cook/characters/old/`; `build/cut_characters.py` recreates them. Still needed (next art batch): Nani's happy, talk, point and blink; waist-up happy poses and a real impatient face for Nana, Ma and Ali; Big Ma, the doctor, Simba and Zazu. |
| **Cache-busting** | `js/version.js` holds one stamp, used on every css/js tag, data fetch and asset URL. **Run `python3 build/bump_version.py` before every push to `main`**, or returning players see stale art. |
| **Find it** | Live at `find.html` (unlinked). It now uses Cook's calm sidebar code. The target digit on list rows was a leak and is removed: the bot's win rate without Kutchi fell from 3.3% to 0–1.7%. The zoom and Done buttons are pinned in the sidebar foot. `UI.init` now tolerates pages without the optional elements. Tests: `build/test_find.py` (laptop, flip5-landscape, 667x375). |
| **Hands** | Branch `claude/art-hands-v1` (00edc63): v2 rings placed per pose from landmarks; all masters done; report `build/reports/art-hands-v1.md`. **Waiting on Zafar's approval of the rings**, then merge. It isn't wired into the game yet. |
| **Mode designs** | All six done (`docs/modes/*-design.md`, overview in `OVERVIEW.md`), all "Go with changes". Waiting on Zafar's answers to the 18 merged questions (in `OVERVIEW.md`). Build order: Tidy up → Who did it? → Dress up → Monsoon rush / clinic → Snap. |
| **Next up (not started)** | 1. **"One app, one save"**: Cook and Find it inside one shell with one save, on its own branch; approved by Zafar. The game modes are not in a shared shell yet. 2. Then the world map (fog of war), "the world is the menu", a no-tutorial first launch, and role-reversal groundwork (the to-do's "Platform and tech debt"). 3. Wire the hands once approved. |
| **Family words** | Questions for Mum: Round 2 plus Part 7 (the priority word list for all modes) and how to record. Split voice notes by silence into per-word clips. Zafar writes phonetic spellings; keep a `say` field for the voice. Never invent Kutchi. |
| **Costs** | OpenAI image API: $31.70 spent so far. Medium quality only; a pre-flight estimate over $5 needs Zafar's OK. Free art goes through ChatGPT via Claude in Chrome on his laptop. |

**Tests used for each push:** `test_cook.py --lab --viewport laptop` and `--viewport flip5-landscape`, `--days 2 --canvas --viewport laptop`, `--open-kitchen 2`, and `test_find.py --viewport laptop`. Each is wrapped in `flock -w 1800 /tmp/cook-test-$((RANDOM % 2)).lock timeout 1200 env COOK_TEST_PORT=<port>`, and they run one at a time. A lab run takes 11–18 minutes. Test runs rewrite the tracked `build/screenshots/`; discard them (`git checkout -- build/screenshots`) unless you mean to commit fresh ones.
## Update 25 Sept, 13:35 UTC (old chat, after the handoff)

The old chat is finishing three things and will push them; the new chat should check `git log origin/main` before redoing any of them:

1. **Wave 5A** (calm UI) is merged into `claude/funny-fermi-vyrabn` (3b7da69). Its tests were running; it goes to `main` once they pass.
2. **Find it calm sidebar** (worktree branch `worktree-agent-a5a7f3c8f8320458c`): the calm sidebar, no target digit on rows (a leak fix), zoom buttons pinned on phones.
3. **Batch 1 art wiring** (worktree branch `worktree-agent-a8c03f5aa01818f1b`): a sprite map in data (`art.sprites`), webp builds, the new hob/worktop backgrounds, with the current drawings as fallback.

**Not started:** "one app, one save" (the shell). Find it is still a separate page, `find.html`. **Hands v2** (`claude/art-hands-v1`) is still waiting on Zafar's ring approval.

**17:05 UTC:** Cook's tests all pass on the Wave 5A merge (laptop and flip5-landscape labs, two days, open kitchen). **But `find.html` crashes on it:** `UI.init` needs `#btn-help`, which the page doesn't have. So `main` is held back until the Find it calm-sidebar agent lands its fix. Both agents were stopped by the usage limit around 14:00; they were resumed at 17:05.
| **Family words** | Questions for Mum: Rounds 1 and 2 (incl. Part 7) merged and re-prioritised by Fable on 25 Sept into `docs/language/mum-questions/Questions for Mum (Combined, for the visit).md` + `docs/archive/language/Questions for Mum (combined).docx` (regenerate with `build/build_mum_questions_docx.js`). Core = Sections A (grammar) and B (live Cook words), ~20 min. Mum records one long voice file, saying section IDs aloud; Zafar types rough spellings into the Word doc. Voice notes are to be split by silence into per-word clips. Zafar writes phonetic spellings; Claude tidies them and keeps a `say` field for the voice. The Google TTS placeholder voice is blocked in this environment. |

## Update 25 Sept, ~14:00 UTC (new chat, branch `claude/nifty-rubin-c0d431`)

- **Questions for Mum:** one combined doc + Word copy (see the Family words row). New Section C (grammar sentences) with 12 grids in an appendix for Zafar. Clinic questions are Section G.
- **Voice notes:** `build/split_voice_notes.py` transcribes with OpenAI Whisper (~$0.006/min; HuggingFace is blocked here, Gemini was over quota) and cuts one MP3 per utterance. Tested on Zafar's sample (`build/voice-test/`).
- **Modes:** Fable's critical review `docs/feedback/modes-review-2026-09-25.md` recommends "real-Kutchi-first" order (Monsoon kitchen slice, Who did it phases 0–1, Find it relations + size, then Tidy up M2; Dress up art after the visit; Snap parked). Four blocking decisions A–D await Zafar.
- **Clinic:** redesigned twice (the real doctor's clinic; revision 2 = visit types + treatment library) in `docs/archive/clinic/clinic-design-v1.md`; five decisions await Zafar.
- **Art batch 2:** Zafar uploads raw ChatGPT images to `sources/art/chatgpt/` (props, backgrounds) and `sources/art/characters/` (character sheets) with the prompt pack's "save as" names; processing waits until the old chat's batch 1 wiring is on `main` (same files).

### Zafar's decisions, 25 Sept ~14:30 UTC
- **Build shape:** one build agent per mode, all concurrently, each mode as mini-games built from modular mechanics (Cook's pattern). Least rework wins: a foundation agent builds the shell ("one app, one save") and the shared pieces (relations layer, "which one?" module, overlay sprites, star/ear/voice rules as data, `js/shared/speech.js`) while mode agents do logic and greybox in their own files only; modes plug into the shell afterwards.
- **Before any of that:** tie off the old chat's work on `main` (Wave 5A calm UI, Find it calm sidebar, batch 1 art), then the shared Cook API is frozen.
- **Speaking is core:** every mode gets speaking moments (closed-set recognition from family recordings, with a tap/parent fallback; a voice star).
- **Clinic:** the child never gives medicine (hands it to the doctor, who checks it as a word review); patients say "my left / my right"; pill organiser dropped for now (Tidy up may take it for days of the week); the level-4 "clue" variant is later.
- **Running now:** Fable deep dives per mode to `docs/archive/mode-briefs/DEEP-DIVE-BRIEF.md` (Find it, Tidy up, Who did it?, Dress up, Monsoon rush, Snap; clinic Revision 3), plus a speech plan and prototype (`docs/architecture/speech-recognition-plan.md`, `js/shared/speech.js`, `build/speech/`).

### Zafar took every default, 25 Sept ~17:30 UTC
All blocking decisions in the deep dives (top sections of each mode's design doc), the review (`docs/feedback/modes-review-2026-09-25.md`, A–F and the numbered list) and `docs/architecture/speech-recognition-plan.md` take their stated defaults. In short: Ali is the role-reversal character everywhere; parent ✓ earns the voice star, pills never do; draft words count, flagged; Monsoon owns Arc 3 Ch1, the clinic owns Ch4; rooms = kitchen, sitting room, Big Ma's room; one rotating hub daily; speech on-device only (MFCC + warping + DTW, enrolment on), no cloud path in release one; Mum says 🎤 words three times.
**Build:** one remote build session per mode plus a foundation session, per `docs/archive/mode-briefs/BUILD-COMMON.md`. This branch now contains the old chat's `claude/funny-fermi-vyrabn` (Wave 5A) merged in, and is the base for every build branch.

### Build sessions launched 25 Sept 17:09 UTC (remote, base `claude/nifty-rubin-c0d431` @ 40e14b4)
| Session | Branch | ID |
|---|---|---|
| Monsoon rush | `claude/build-monsoon` | session_01XXUbgoNx6dBxqjmrJMLtxo |
| Who did it? | `claude/build-who` | session_01FkLSGNEs758RvckeK48Mjh |
| Tidy up | `claude/build-tidy` | session_016WUwkcH43LgAysqffFWAst |
| Dress up | `claude/build-dress` | session_01VLAqx6YNXH4MYSgZ15rk3v |
| Clinic | `claude/build-clinic` | session_01DSDPTSNvrqqPdwsr6ZmAfz |
| Snap | `claude/build-snap` | session_01HAy2YeBPBpzjVBGVifKc7G |
| Foundation phase A (shared modules) | `claude/build-foundation` | session_01KEQtafQq6co4gYRTgpC2Ab |

**Held back on purpose:** the Find it build and the foundation's phase B (the shell), until the old chat's Find it sidebar and batch 1 art wiring reach `main` (both touch the same files). Each session writes `build/reports/<mode>-build.md` on its branch.

### Paused for the usage limit, 25 Sept 18:10 UTC; resume at 21:45 UTC
- All seven build sessions were still running and pushing to their `claude/build-*` branches (commits every few minutes). Remote sessions can't be messaged from here, so they carry on until the limit stops them; anything they hadn't pushed is lost with the turn.
- **On resume:** for each session, `get_session`; read `build/reports/<mode>-build.md` on its branch if it exists (done). If it's not done, launch a continuation session from its branch (`source_revision` = the build branch, same `outcome_branch`) with the original prompt plus: "A previous session was cut off by a usage limit. Read `docs/<mode>-build-log.md` and `git log` on this branch, then continue from where it stopped."
- Then: check `origin/main` for the old chat's work (Find it sidebar, batch 1 art) and, if it's there, launch the Find it build and the foundation's phase B (shell).
- Mum's recordings: A3 done (`docs/language/grammar-notes.md`); next A4–A8, then B, then C. Word changes to batch into `data/cook.json` later: *daar*, *ba* (two, said "ber"), *hakro/hakri*, *wadho/nindho* (+ she-forms), *watana*, *waari*, *lai*.

- **Also on resume:** Zafar's grill playtest → `docs/design-language/ux-principles.md` (applies to every mode; linked from BUILD-COMMON) and Cook **Wave 6** in the to-do. Launch Wave 6 as one Cook session once the old chat's art wiring is on `main` (same files). Continuation build sessions must be told to apply UX-PRINCIPLES in their next phase.

### 25 Sept ~22:00 UTC: first build wave done, second wave launched
- All seven phase 0–1 builds finished with reports (`build/reports/*-build.md`) and are **merged into `claude/nifty-rubin-c0d431`** together with `origin/main` (the old chat's calm UI, Find it sidebar and batch 1 art). Clean merge; shared Node tests 59/59.
- Launched: **Cook Wave 6** (`claude/build-cook-wave6`, session_011XSUSd9KntKRw2qJKEoEjF) and **Find it** (`claude/build-find`, session_01DRSY1hWZmrqfCmkKabrRRg).
- Held: the **shell** (foundation phase B) until Wave 6 merges (both touch `cook.html`/Cook's save); **batch 2 art** processing after Wave 6 (both touch `data/cook.json`); swapping each mode's stubs for the shared modules + UX-PRINCIPLES in each mode's phase 2.
- `main` (the live site) has not been updated from this branch yet: waiting for Zafar's go-ahead to publish the new mode labs.

### 25 Sept ~23:00 UTC: Zafar's pipeline feedback; overnight plan
- New: `docs/archive/mode-briefs/PIPELINE-BRIEF.md` (every mode = a pipeline of stages, each with several mini-games; clinic worked example: waiting room → diagnosis → pharmacy conveyor → heal (15–20 comical body-part games; stitches/injections now OK) → send-off). UX principles §9 (end-of-round screen: time/accuracy/hints badges, then the word review) and §10 (onboarding kit now, per-station scripts once mechanics settle).
- Running overnight: 7 Fable pipeline redesigns (clinic, Find it, Tidy up, Who did it?, Dress up, Monsoon, Snap) as in-process agents (resume by message if a limit stops them); remote sessions Cook Wave 6, Find it build, shared UI (`claude/build-shared-ui`, session_01346mVNKdg8zWmhCWoMTMKA: results screen + onboarding kit); an agent writing `docs/archive/art-prompts/chatgpt-art-prompts-batch3.md`.
- **Mode builds are paused on purpose** until the pipeline designs are approved; their phase 0–1 code stays (engines, bots, labs, tests) and each redesign lists what survives.
- Labs are live on `main`: `labs.html` links every mode lab.

### 25 Sept ~23:35 UTC
- Merged into the branch and **published to `main`**: Cook Wave 6, the Find it phase 0–1 build, and the shared UI (`js/shared/results.js`, `js/shared/onboard.js`, demo `lab/shared-ui.html`). Versions re-stamped with `bump_version.py`. The old chat has ended; its final state is merged.
- Zafar's rules tonight: UX §11–§13 (auto-tick at every level; one control forever = tap, pour is a tap; the instruction card is the master and Nani is a voice).
- Running: **Cook Wave 6b** (`claude/build-cook-wave6b`, session_01DmaAgodzuDkuXkvQN1SsNQ); 8 Fable **mini-game quality passes** (`docs/archive/mode-briefs/MINIGAME-QUALITY-BRIEF.md`) on every mode doc including Cook's; an agent building tonight's art zip (`docs/archive/art/art-run-tonight.md`).
- Next: the **shell** (foundation phase B) after Wave 6b merges; mode builds resume after Zafar approves the quality-pass designs.

### 26 Sept ~04:45 UTC: the clinic is the main focus; clinic build team launched (Opus)
Contract: `docs/architecture/clinic-heal-api.md`. Sessions: core `claude/clinic-core` (session_015nuiYSYyy9PEjhTGM9ThVV), healing A knee/ear/tooth `claude/clinic-heal-a` (session_01JjgCWxwQMX4wUf2exczNqr), B taste/fever/boing `claude/clinic-heal-b` (session_01KvDuC9Yvy62LacWFvh7T2t), C eye/foot (+ extras) `claude/clinic-heal-c` (session_01YVNTUEysNinFPfLmLo2nL9), rough art via the OpenAI API ≤ $5 medium `claude/clinic-rough-art` (session_01MsFHeo1j7wwn5iGSJnb1FY). The core merges the others; orchestrator merges `claude/clinic-core` when its report lands. Also still running: Cook Wave 6b.
Hands ("arms") for Cook: `claude/art-hands-v1` still awaits Zafar's ring approval (contact sheets on that branch in `build/contact-sheets/hands-*.png`); 9 masters still fail, incl. the knife/spatula grip.

## 26 Sept, 08:00 UTC: relaunch after the usage limit (limit hit ~05:05, reset 07:50)
All seven sessions died mid-work. Relaunched (continuations resume from their branch's pushed work; 6b and hands v3 had pushed nothing so restarted fresh):
- clinic core `claude/clinic-core`: session_01BLkRpA1wXMkhSdjSp9JQHt
- heal A `claude/clinic-heal-a`: session_01GajdZViFJPvo2NsmHDYZyQ
- heal B `claude/clinic-heal-b`: session_01GTRPavnYUQ1Chjet7f5q3L
- heal C `claude/clinic-heal-c`: session_01DCJfKSxuK2tsXS7XURa9bq
- clinic rough art `claude/clinic-rough-art` (≤ $5 total incl. earlier spend): session_01RenYyPsQPppsiwA18j2C8f
- Cook Wave 6b `claude/build-cook-wave6b` (from nifty-rubin, with the clarified §12: consistency within a mini-game, not tap-only): session_01Eas3sw63Nh9b3GA6NEw5BV
- hands v3 `claude/art-hands-v3` (from art-hands-v1; QA every hand pass/fail, 3D jewellery, 9 failed masters b1 first, ≤ $8): session_015ho7YCkDF3zNcXC2bhmRkB
On reports: merge into nifty-rubin → bump_version → smoke test → push → publish main → update MORNING-SUMMARY.

### 26 Sept ~09:50 UTC: clinic and Cook Wave 6b merged and published
- `origin/claude/clinic-core` (with heal A/B/C and rough art) and `origin/claude/build-cook-wave6b` are merged into `claude/nifty-rubin-c0d431` and published to `main`. Conflicts were only `?v=` stamps (`clinic.html`, `cook.html`, `js/version.js`); neither branch touched `js/shared/*` or the grammar/ideas docs. `labs.html` now has a clinic section (play, lab index, lab bar, five stages, every healing game). Leak bots pass (whole patient L1 blind 0.30%; Cook count leaks 0%); smoke test clean at 390×844 and 1366×768. `claude/art-hands-v3` is still running and not merged.

## 26 Sept, ~11:00 UTC
- Merged and live: clinic (core + heal A/B/C + rough art) and Cook Wave 6b.
- Hands v3 done (`claude/art-hands-v3`): all characters pass; masters 55/56 (a2 still fails); jewellery ray-cast in code; $1.80 spent. Review sheets sent to Zafar. **Waiting on his OK**, then merge and wire into Cook.
- Mum's recordings A4–A8 and Section B transcribed into `docs/language/grammar-notes.md` §10–§28. Approved/proposed game ideas are parked in `docs/ideas.md` (standing rule above).
- Running now:
  - in-process agent applying the Section B words to Cook (`docs/archive/language/cook-word-changes-B.md`);
  - in-process agent cutting family voice clips (`assets/audio/family/`, `data/family-audio.json`, `lab/family-audio.html`);
  - shell "one app, one save" (`claude/build-shell`, session_01JZerhfa5qGNZnwu1LTq9Lp).
- 11:15 UTC: Zafar passed the hands. `claude/art-hands-v3` merged into nifty-rubin. Wiring session `claude/cook-hands` (session_01MAs1TPaN2juaEio8CC4aon) launched. First-launch story draft: `docs/game-design/modes/first-launch.md` (waiting on the rest of Zafar's thoughts; the shell continuation adds the character step and the story beat once agreed).
- 13:00 UTC: the usage limit (~12:00–12:50) killed the shell, cook-hands and the clip agent. Relaunched:
  - shell continuation: session_01M5e3LwxbfjVkAtRrpvuz5r;
  - cook-hands continuation: session_01KmnJa91eMGjErxqeiPe8E2;
  - the clip agent, resumed in-process.

  ChatGPT dump 3 (69 files, 48 unique; no log in the repo) is being sorted by an in-process agent. **Lesson: 6+ parallel Opus sessions hit the 5-hour limit in about 1½ h. Keep to about 4 at once.**
- 14:40 UTC: shell merged and live. First launch launched (`claude/first-launch`, session_01PLdXGEiy7YBMWGHWw5Nurd). Voice clips done (`lab/family-audio.html`).
- 16:30 UTC: cook-hands and first-launch merged and live. Yes/No was switched to UX §14 (shake, embarrassed, ask again). Open fixes: hand scale near small bowls, the pin hands cover the dough, the pantry grab pose, Cook reading the character's chosen hands. The first launch's placeholder Kutchi (e.g. 'Arre re! Khaanu taiyaar nai') is NOT family-confirmed: replace it with Mum's recordings.

## 26 Sept, ~19:10 UTC: new orchestrator chat (branch `claude/nifty-rubin-c0d431`)
Launched (remote, Opus, from nifty-rubin):
- Cook hands fixes + phone ⌂ fix `claude/cook-hands-fix`: session_013jck82TVZgaG3wyx9fLQf8 (Next-up items 1 and 7).
- Conversations engine + 9-exchange MVP lab `claude/conversations-mvp`: session_01JRrBDonr8rCpNzwEo7xC8r (new files only; wiring into first launch, Cook and the clinic comes after merge, per `docs/game-design/modes/conversations-wiring.md`).
Held until Zafar's mode feedback: the chai-station fun pass, the clinic iteration, first-launch changes. Held until Zafar ticks the clips: wiring the family clips, and the next Questions-for-Mum Word doc.

### Lesson, 28 Sept: visual work isn't done until someone has looked at it
The end-of-round badges took five rounds: grey fringes, holes, mismatched sizes, a wrong fill mapping, and a live site that hadn't rebuilt. The sessions passed their tests and saved screenshots but didn't judge them, and the orchestrator passed on "done" unseen. **Follow `docs/archive/process/VISUAL-QA.md` for every visual change, and link it from every brief.** Visual work goes to the top model.

### Lesson, 28 Sept: "idle" doesn't mean dead
A session showing "idle" or "review_ready" can still have a long background job running (e.g. a 7-minute screenshot run), with its commit and push still to come. Before relaunching one as a continuation: look at `updated_at` and its `status_detail`; if it says it will push after a background step, give it at least 20–30 more minutes. On 28 Sept a duplicate chai-station session was launched this way, and Zafar had to stop it.
