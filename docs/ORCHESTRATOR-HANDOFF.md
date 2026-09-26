# Orchestrator handoff (for a new Claude chat)

**Written 25 Sept 2026, ~11:30 UTC**, at the end of the first orchestration chat. Read this first, then `docs/cook-with-nani-todo.md` (the live to-do and status) and `docs/modes/OVERVIEW.md`.

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

- **Browser tests:**
  - never run several at once; wrap each in `flock -w 1800 /tmp/cook-test-$((RANDOM % 2)).lock timeout 1200 …`;
  - use `--canvas` for `--days` runs (software WebGL here is 6–11 fps);
  - use `COOK_TEST_PORT` per agent.
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
| **Art in the game** | **Batch 1 is wired in.** The sprite map is `art.sprites` in `data/cook.json`, with the drawn art as fallback. The painted worktop and hob (day only; the game has no time of day yet); 25 ingredient bowls, the chop vegetables, maani and dough, samosa, chips, mishkaki (raw, grilled, charred), and the vessels. Each station loads its own pictures (10–200 KB). `build/sprites_webp.py` rebuilds the webp files. Still missing or to redo: see the to-do's "Then" section. That's the list for the **next ChatGPT batch**, merged with batch 2 (`docs/chatgpt-art-prompts-batch2.md`), whose results Zafar hasn't uploaded yet. |
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
| **Family words** | Questions for Mum: Rounds 1 and 2 (incl. Part 7) merged and re-prioritised by Fable on 25 Sept into `docs/Nani jo Ghar — Questions for Mum (Combined, for the visit).md` + `docs/Questions for Mum (combined).docx` (regenerate with `build/build_mum_questions_docx.js`). Core = Sections A (grammar) and B (live Cook words), ~20 min. Mum records one long voice file, saying section IDs aloud; Zafar types rough spellings into the Word doc. Voice notes are to be split by silence into per-word clips. Zafar writes phonetic spellings; Claude tidies them and keeps a `say` field for the voice. The Google TTS placeholder voice is blocked in this environment. |

## Update 25 Sept, ~14:00 UTC (new chat, branch `claude/nifty-rubin-c0d431`)

- **Questions for Mum:** one combined doc + Word copy (see the Family words row). New Section C (grammar sentences) with 12 grids in an appendix for Zafar. Clinic questions are Section G.
- **Voice notes:** `build/split_voice_notes.py` transcribes with OpenAI Whisper (~$0.006/min; HuggingFace is blocked here, Gemini was over quota) and cuts one MP3 per utterance. Tested on Zafar's sample (`build/voice-test/`).
- **Modes:** Fable's critical review `docs/modes/REVIEW-2026-09-25.md` recommends "real-Kutchi-first" order (Monsoon kitchen slice, Who did it phases 0–1, Find it relations + size, then Tidy up M2; Dress up art after the visit; Snap parked). Four blocking decisions A–D await Zafar.
- **Clinic:** redesigned twice (the real doctor's clinic; revision 2 = visit types + treatment library) in `docs/modes/clinic-design.md`; five decisions await Zafar.
- **Art batch 2:** Zafar uploads raw ChatGPT images to `sources/art/chatgpt/` (props, backgrounds) and `sources/art/characters/` (character sheets) with the prompt pack's "save as" names; processing waits until the old chat's batch 1 wiring is on `main` (same files).

### Zafar's decisions, 25 Sept ~14:30 UTC
- **Build shape:** one build agent per mode, all concurrently, each mode as mini-games built from modular mechanics (Cook's pattern). Least rework wins: a foundation agent builds the shell ("one app, one save") and the shared pieces (relations layer, "which one?" module, overlay sprites, star/ear/voice rules as data, `js/shared/speech.js`) while mode agents do logic and greybox in their own files only; modes plug into the shell afterwards.
- **Before any of that:** tie off the old chat's work on `main` (Wave 5A calm UI, Find it calm sidebar, batch 1 art), then the shared Cook API is frozen.
- **Speaking is core:** every mode gets speaking moments (closed-set recognition from family recordings, with a tap/parent fallback; a voice star).
- **Clinic:** the child never gives medicine (hands it to the doctor, who checks it as a word review); patients say "my left / my right"; pill organiser dropped for now (Tidy up may take it for days of the week); the level-4 "clue" variant is later.
- **Running now:** Fable deep dives per mode to `docs/modes/DEEP-DIVE-BRIEF.md` (Find it, Tidy up, Who did it?, Dress up, Monsoon rush, Snap; clinic Revision 3), plus a speech plan and prototype (`docs/speech-recognition-plan.md`, `js/shared/speech.js`, `build/speech/`).

### Zafar took every default, 25 Sept ~17:30 UTC
All blocking decisions in the deep dives (top sections of each mode's design doc), the review (`docs/modes/REVIEW-2026-09-25.md`, A–F and the numbered list) and `docs/speech-recognition-plan.md` take their stated defaults. In short: Ali is the role-reversal character everywhere; parent ✓ earns the voice star, pills never do; draft words count, flagged; Monsoon owns Arc 3 Ch1, the clinic owns Ch4; rooms = kitchen, sitting room, Big Ma's room; one rotating hub daily; speech on-device only (MFCC + warping + DTW, enrolment on), no cloud path in release one; Mum says 🎤 words three times.
**Build:** one remote build session per mode plus a foundation session, per `docs/modes/BUILD-COMMON.md`. This branch now contains the old chat's `claude/funny-fermi-vyrabn` (Wave 5A) merged in, and is the base for every build branch.

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
- Mum's recordings: A3 done (`docs/kutchi-grammar-notes.md`); next A4–A8, then B, then C. Word changes to batch into `data/cook.json` later: *daar*, *ba* (two, said "ber"), *hakro/hakri*, *wadho/nindho* (+ she-forms), *watana*, *waari*, *lai*.

- **Also on resume:** Zafar's grill playtest → `docs/UX-PRINCIPLES.md` (applies to every mode; linked from BUILD-COMMON) and Cook **Wave 6** in the to-do. Launch Wave 6 as one Cook session once the old chat's art wiring is on `main` (same files). Continuation build sessions must be told to apply UX-PRINCIPLES in their next phase.

### 25 Sept ~22:00 UTC: first build wave done, second wave launched
- All seven phase 0–1 builds finished with reports (`build/reports/*-build.md`) and are **merged into `claude/nifty-rubin-c0d431`** together with `origin/main` (the old chat's calm UI, Find it sidebar and batch 1 art). Clean merge; shared Node tests 59/59.
- Launched: **Cook Wave 6** (`claude/build-cook-wave6`, session_011XSUSd9KntKRw2qJKEoEjF) and **Find it** (`claude/build-find`, session_01DRSY1hWZmrqfCmkKabrRRg).
- Held: the **shell** (foundation phase B) until Wave 6 merges (both touch `cook.html`/Cook's save); **batch 2 art** processing after Wave 6 (both touch `data/cook.json`); swapping each mode's stubs for the shared modules + UX-PRINCIPLES in each mode's phase 2.
- `main` (the live site) has not been updated from this branch yet: waiting for Zafar's go-ahead to publish the new mode labs.

### 25 Sept ~23:00 UTC: Zafar's pipeline feedback; overnight plan
- New: `docs/modes/PIPELINE-BRIEF.md` (every mode = a pipeline of stages, each with several mini-games; clinic worked example: waiting room → diagnosis → pharmacy conveyor → heal (15–20 comical body-part games; stitches/injections now OK) → send-off). UX principles §9 (end-of-round screen: time/accuracy/hints badges, then the word review) and §10 (onboarding kit now, per-station scripts once mechanics settle).
- Running overnight: 7 Fable pipeline redesigns (clinic, Find it, Tidy up, Who did it?, Dress up, Monsoon, Snap) as in-process agents (resume by message if a limit stops them); remote sessions Cook Wave 6, Find it build, shared UI (`claude/build-shared-ui`, session_01346mVNKdg8zWmhCWoMTMKA: results screen + onboarding kit); an agent writing `docs/chatgpt-art-prompts-batch3.md`.
- **Mode builds are paused on purpose** until the pipeline designs are approved; their phase 0–1 code stays (engines, bots, labs, tests) and each redesign lists what survives.
- Labs are live on `main`: `labs.html` links every mode lab.

### 25 Sept ~23:35 UTC
- Merged into the branch and **published to `main`**: Cook Wave 6, the Find it phase 0–1 build, and the shared UI (`js/shared/results.js`, `js/shared/onboard.js`, demo `lab/shared-ui.html`). Versions re-stamped with `bump_version.py`. The old chat has ended; its final state is merged.
- Zafar's rules tonight: UX §11–§13 (auto-tick at every level; one control forever = tap, pour is a tap; the instruction card is the master and Nani is a voice).
- Running: **Cook Wave 6b** (`claude/build-cook-wave6b`, session_01DmaAgodzuDkuXkvQN1SsNQ); 8 Fable **mini-game quality passes** (`docs/modes/MINIGAME-QUALITY-BRIEF.md`) on every mode doc including Cook's; an agent building tonight's art zip (`docs/art-run-tonight.md`).
- Next: the **shell** (foundation phase B) after Wave 6b merges; mode builds resume after Zafar approves the quality-pass designs.

### 26 Sept ~04:45 UTC: the clinic is the main focus; clinic build team launched (Opus)
Contract: `docs/clinic-heal-api.md`. Sessions: core `claude/clinic-core` (session_015nuiYSYyy9PEjhTGM9ThVV), healing A knee/ear/tooth `claude/clinic-heal-a` (session_01JjgCWxwQMX4wUf2exczNqr), B taste/fever/boing `claude/clinic-heal-b` (session_01KvDuC9Yvy62LacWFvh7T2t), C eye/foot (+ extras) `claude/clinic-heal-c` (session_01YVNTUEysNinFPfLmLo2nL9), rough art via the OpenAI API ≤ $5 medium `claude/clinic-rough-art` (session_01MsFHeo1j7wwn5iGSJnb1FY). The core merges the others; orchestrator merges `claude/clinic-core` when its report lands. Also still running: Cook Wave 6b.
Hands ("arms") for Cook: `claude/art-hands-v1` still awaits Zafar's ring approval (contact sheets on that branch in `build/contact-sheets/hands-*.png`); 9 masters still fail, incl. the knife/spatula grip.
