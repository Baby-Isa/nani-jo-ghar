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
| **Find it** | Live at `find.html` (unlinked). It now uses Cook's calm sidebar code. The target digit on list rows was a leak and is removed: the bot's win rate without Kutchi fell from 3.3% to 0–1.7%. The zoom and Done buttons are pinned in the sidebar foot. `UI.init` now tolerates pages without the optional elements. Tests: `build/test_find.py` (laptop, flip5-landscape, 667x375). |
| **Hands** | Branch `claude/art-hands-v1` (00edc63): v2 rings placed per pose from landmarks; all masters done; report `build/reports/art-hands-v1.md`. **Waiting on Zafar's approval of the rings**, then merge. It isn't wired into the game yet. |
| **Mode designs** | All six done (`docs/modes/*-design.md`, overview in `OVERVIEW.md`), all "Go with changes". Waiting on Zafar's answers to the 18 merged questions (in `OVERVIEW.md`). Build order: Tidy up → Who did it? → Dress up → Monsoon rush / clinic → Snap. |
| **Next up (not started)** | 1. **"One app, one save"**: Cook and Find it inside one shell with one save, on its own branch; approved by Zafar. The game modes are not in a shared shell yet. 2. Then the world map (fog of war), "the world is the menu", a no-tutorial first launch, and role-reversal groundwork (the to-do's "Platform and tech debt"). 3. Wire the hands once approved. |
| **Family words** | Questions for Mum: Round 2 plus Part 7 (the priority word list for all modes) and how to record. Split voice notes by silence into per-word clips. Zafar writes phonetic spellings; keep a `say` field for the voice. Never invent Kutchi. |
| **Costs** | OpenAI image API: $31.70 spent so far. Medium quality only; a pre-flight estimate over $5 needs Zafar's OK. Free art goes through ChatGPT via Claude in Chrome on his laptop. |

**Tests used for each push:** `test_cook.py --lab --viewport laptop` and `--viewport flip5-landscape`, `--days 2 --canvas --viewport laptop`, `--open-kitchen 2`, and `test_find.py --viewport laptop`. Each is wrapped in `flock -w 1800 /tmp/cook-test-$((RANDOM % 2)).lock timeout 1200 env COOK_TEST_PORT=<port>`, and they run one at a time. A lab run takes 11–18 minutes. Test runs rewrite the tracked `build/screenshots/`; discard them (`git checkout -- build/screenshots`) unless you mean to commit fresh ones.
