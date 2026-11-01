# Overnight, 31 Oct to 1 Nov: the games designed, the code swept

For Zafar's morning. Everything is on `claude/nice-lovelace-0vfjcj`; **`main` (the live site) is untouched**. All checks are green.

## 1. The games: 18 designed, challenged, revised

Each game had its own Opus designer, then an independent Fable critic (flaws first, MUST and SHOULD), then an Opus revision applying every MUST. Each design follows the game-mode method (the five questions, the leak test per mini-game, levels, a walkthrough of the first round, words needed, art, reuse) and the new **lessons checklist** (73 rules from Sprints 7-15, `designs/lessons-checklist-2026-11-01.md`).

| Day | Designs (`build/reports/designs/`) |
|---|---|
| Kitchen | `cook-baking-eggs.md` |
| Clinic | `clinic-every-part.md` |
| A day at home | `hide-and-seek.md`, `pick-it-up-put-it-back.md`, `clean-up-day.md` |
| Someone's birthday | `party-gifts.md`, `party-guests.md`, `do-it-engine.md` (musical statues) |
| School day | `wake-up-clock.md`, `do-it-engine.md` (getting ready), `school-day.md` |
| Town and shops | `town-map.md`, `shops.md` |
| Sewing with Big Ma | `sewing.md` |
| The farm | `farm-animals.md`, `farm-eggs-orchard.md` |
| Adoption centre | `adoption-centre.md` |
| Safari | `safari.md` (a second game: "Who's hiding?") |
| Beach (boat second) | `beach-boat.md` |

**Read first:**
- `designs/days/README.md`: the 11 days, their games in order, visit-1 lengths, the word groups each owns, and a proposed unlock order
- each design's §10, "Decisions made for Zafar overnight": numbered, with the answer I assumed, so you can reverse any
- each design's §12, which says what the critic changed

**Your mock-ups:** `designs/chatgpt-prompt-sheet-2026-11-01.md` holds **79 prompts**, 2-5 per game, one per version or setting. Give Claude in Chrome its link on GitHub (the file is 219 KB, too big to paste). It has the run loop, 24 reference images with links, the save names (`mockup-<id>.png`), and the download from the ChatGPT Library at the end.

**Also:**
- `designs/consistency-2026-11-01.md`: one party cast and order, the school day's order, the farm's hens.
- Ideas 84-97 added from the designs.
- Big Ma's stall line in `cast.md`, marked for you to confirm.

**Questions the designs left for you** (each design lists its own):
- one rule for closing a count across all games: five different rules exist today
- the party's voices
- whether the family says the time in Kutchi, which the clock waits on
- which places in town the family says in Kutchi
- the farm's photo tick

Several days are too long for one sitting (the farm, the birthday, the beach). The proposal: they **grow by play**, with a short first visit and stages added later.

## 2. The code: Fable's sweep

Four areas (Cook, the clinic, the shared kit and pages, the six parked modes). Fable audited each, a second Fable pass challenged every finding (unsafe or doubtful ones rejected), and Fable fixers applied the rest in their own worktrees, with checks before and after. I merged all four (no conflicts) and re-ran everything.

| Area | Applied | The main gains |
|---|---|---|
| Cook | 10 | data files fetched once per page (lab chai: 205 → 197 requests); 3 cut-outs about 154 KB lighter, pixel for pixel the same; 16 dead functions and 15 dead CSS classes gone; Cook cleans up after itself on leaving; one fonts request instead of two |
| Clinic | 13 | the pipeline data parsed fewer times; dead code, a stale data file and 11 dead CSS rules gone; focus.js no longer loaded |
| Shared and pages | 10 | modules and data asked for at once (preloads) on lab, day, first and home pages; the kit's 13 sheets start with the page; unused ChatGPT upload folders moved out of the live site (**444 MB → 341 MB**) |
| Parked modes | 6 | Find's scene files fetched in one round trip; dead code and CSS gone; nothing about how they play changed |
| **Found and fixed by me after** | 1 | **a real bug:** the rules, the ladder table, the faces and the bulb timings were fetched without the version stamp, so a returning player could keep stale data after a publish. Now stamped on every page (checked in a browser: day, lab, clinic, cook) |

Nothing that plays, looks or sounds different. No mechanic, mini-game or parked mode was removed (non-negotiable 1). Each area's report: `build/reports/sweep-<area>-2026-11-01.md`.

**Found broken, not fixed (new fix rows today):**
- **CK-55:** the shop's "?" sits under the cog at 740x320.
- **CK-56:** two old Cook tests fail on the baseline too.
- **LAB-08:** labs.html loads its modules without the version stamp.

## 3. What's next (your call)

1. Run the prompt sheet in Claude in Chrome. Look at the mock-ups, and send notes per game.
2. Answer the designs' open questions; reverse any overnight decision.
3. Then the rapid labs, as you set out: one game at a time, your play, your feedback. My suggested first: the clinic (Sprint 16), hide and seek, the town map.
4. Publish the sweep to `main` when you're happy (`/review`, then `/publish`).

## Proof

- **Checks:** `node build/tools/review/checks.mjs` passes all 11 on the merged branch (unit 623 pass; static 0 new; leak 19 configs; load 29/29; size 341 MB).
- **Sweep proof:** each sweep report has its before and after numbers, the sandbox contract runs, and screenshots.
- **The stamp fix:** a Playwright request log on 4 pages, every file stamped, 0 console errors.
