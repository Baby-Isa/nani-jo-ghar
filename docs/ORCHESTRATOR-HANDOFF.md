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
- **Parallel agents only on disjoint files.** Wave 2's two-agent split cost a 2-hour merge. Combined stations each have their own file, which is why Wave 3 merged cleanly.
- **Cloud sessions and settings:**
  - remote sessions (`create_session`) pick up new environment settings; this chat doesn't;
  - remote sessions can't be messaged, so write complete briefs; to redirect one, interrupt it and relaunch.
- **Art:**
  - edit mode is only for small changes to the same object, never state changes (whole → chopped);
  - hands are one master set skinned in code (skin tone, sleeve, jewellery sprites at per-pose landmarks).

## State at handoff

| Thing | State |
|---|---|
| **Cook with Nani** | Live. Waves 1–4 and 5B merged: combined stations (Chai tray, Maani line, Mishkaki grill), stir on a track, the open kitchen, levels as data, varied level 1, timed chop, Zafar's draft words (*nar, aastethi, jaldi, adh, bharelo, vadho, nindho*). |
| **Wave 5A** (calm UI) | Agent was running: intro order card, one line per item, quieter Nani, compact sidebar, "?" help, word-review result card, no step pills or coin counter; plus Wave 4's iPad and phone layout defects. Brief: `docs/modes/wave5a-brief.md`. Merge when done; tests; push. |
| **Find it** | First slice live at `find.html` (unlinked): Nani's list + Check the bag; leak bot 3.3%. Follow-ups: adopt Wave 5A's calm sidebar; check whether the small number beside each row is a tally or the target (a leak if it's the target); phone zoom buttons off-screen. |
| **Hands** | Branch `claude/art-hands-v1`. Remote session `session_01QFx4ptYi3c5h7JiSz152Rd`: per-pose landmark ring placement and the 9 failed masters (API cap $5). Check its report `build/reports/art-hands-v1.md`. Not yet merged into `main`. |
| **Art** | Batch 1 processed and merged: 108 sprites in `assets/cook/items/`, 14 backgrounds, character sheets in `sources/art/characters/` (Nani v2 approved). Batch 2 pack sent to Zafar (`docs/chatgpt-art-prompts-batch2.md`): redos, bajri maani, hob, tray and grill, samosa folds, front-view pantry items, chaat layers, and Big Ma, doctor and cats sheets with counter views. **Nothing is wired into the game yet.** That's the next art task, after Wave 5A. |
| **Mode designs** | All six done (`docs/modes/*-design.md`, overview in `OVERVIEW.md`), all "Go with changes". Zafar is answering the 18 merged questions; then build in this order: Tidy up → Who did it? → Dress up → Monsoon rush / clinic → Snap. Each doc ends with a build brief. |
| **Platform** | "One app, one save" is approved; start after Wave 5A merges. Then the world map and "world is the menu", no-tutorial first launch, role-reversal groundwork. See the to-do's "Platform and tech debt". |
| **Family words** | Questions for Mum: Round 2 plus Part 7 (the priority word list for all modes) and how to record. Voice notes are to be split by silence into per-word clips. Zafar writes phonetic spellings; Claude tidies them and keeps a `say` field for the voice. The Google TTS placeholder voice is blocked in this environment. |

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
