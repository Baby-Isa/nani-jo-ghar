# Sprint 18: every stove game at chai's standard, built properly

**Status:** open (Zafar, 7 Nov: "yes to all"; opens the moment Sprint 17's tools and docs are pushed, ~18:00 Sat 7 Nov, no gap)
**Opened:** 7 Nov 2026 · **Closes at:** the publish to `main` by Mon 9 Nov 07:00 UK, Zafar's play and `/feedback`

## Goal
Every game in the family list below is at chai's standard on the three layers, coded well; a first pass of every one is live on
`main` by Monday 07:00 for his review before 10:00. Chai itself is unchanged in behaviour: its frozen run says so after every move.

## The family this sprint (the one list; change it here only)
**Eight games, one builder each in wave 2:** daar, chaat, samosa, maani, sekelo, eggs at breakfast, baking, the corn stall.
**Plus chop as its own game**, built in wave 1 on the kit; daar and chaat use it (Zafar, 7 Nov). Each keeps its own mechanic
(non-negotiable 1) and takes the kit for the rest.
**Open question (Zafar, 7 Nov ~13:30, being asked now):** chaat and chop use no stovetop; he thinks they may belong in another
family. Until he answers they stay in this list as written; `docs/process/prototype-to-game.md`'s families table is not changed.
His answer changes this list, and the pointers in `docs/game-design/families/stove.md` and `docs/sprints/plan.md`.

The reference: `docs/design-language/chai-standard.md` (signed off 7 Nov) and Sprint 17's module map. The family and each game's
gap: `docs/game-design/families/stove.md`. The plan and its review: `build/reports/game-rollout-plan-review-2026-11-07.md`.

## "Coded well": the sprint's rules (Zafar, 7 Nov: "modular, scalable, best practice, easy to change things across all, consistent across all")
1. **Three layers.** The shared kit (`js/shared/`: every game) → the stove kit (made from chai and the existing `js/cook/kitchen-kit.js`
   and `js/cook/mechanics/`: every stove game) → each game, which is its settings file plus its own mechanic.
2. **A fix goes in the lowest layer that owns it**, once, and reaches every game from there.
3. **No game copies kit code; no kit code names a game.** A game that needs something the kit lacks asks for it in the kit.
4. **One module, one owner** for the run; files are disjoint between builders (`brief.mjs --live-check`).
5. **A stove-kit lab page shows every piece in every state**, like `lab/kit.html`; each kit builder adds its section.
6. **Every game keeps its own mechanic** (non-negotiable 1) and takes the kit for everything else: heat and boil, pour and
   serve, the shelf and pills, the lights and lessons, the order's flow and timings.

## Waves (up to eight builders at once, Zafar's 7 Nov decision 2)

**Wave 1, Sat 18:00 → Sun ~10:00, eight builders.** Chai's behaviour becomes the kit's; chai switches onto it piece by piece.
- **Chai's owner** (Opus, high, $40-60): the sole owner of `js/cook/stations/chai-tray.js`. Switches chai onto each kit piece as it
  lands, in Zafar's order: heat and boil; pour and serve; the shelf and pills; lights and lessons; the order's flow and timings.
  Chai's frozen-run diff after each switch; a film only where the diff shows change. Owns the stove-kit lab page's shell.
- **Five kit builders** (Opus, high, $20-30 each), each in its own files, each adding its section to the stove-kit lab page:
  (a) heat, burners, knobs and the boil sound; (b) pouring and serving; (c) the shelf and its pills; (d) lights and lessons (the
  shared kit); (e) the order's flow and timings (the shared kit; owns `js/cook/ui.js` and `js/shared/order-card.js` for this run).
- **Chop as its own game** (Opus, high, $20-30), on the kit (the family list above).
- **Prep for eggs, baking and the corn stall** (Sonnet, high, $10-15): cut and wire the art already landed, write their settings
  files, list their missing Kutchi.

**Wave 2, Sun 08:00 → ~20:00, eight builders, one per game in the family list** (Opus, high, $20-30 each). Each keeps its own mechanic, moves onto its settings file and the kits, deletes the code it copied, fixes
its own open rows, shows missing Kutchi as grey English. It starts with the game's own parts and takes each kit piece once chai's
owner has switched chai onto it.

**Wave 3, Sun 20:00 → Mon 07:00, the orchestrator.** Merge each game; one audit at the four sizes per game; one new-player film
per game; Fable judges the films and the diffs in batches of ten; fixes go back to the builder, or into the kit where the kit owns
the rule; publish to `main` (`--force` on Zafar's word, decision 9); handover with his play list. After Monday: his play,
`/feedback`, every row fixed once in the kit.

**Light checks** (decision 5): builders run `checks.mjs` and one run of their own game at one size at the end; the four sizes once
per game at merge; chai's frozen-run diff automatic after each switch; script-made before/after strips at fixed moments instead of
a before-run and judge at launch. A progress table every half hour (done in the last half hour, still to do, percentage).

## Budget
About $380-575 for the sprint (the weekend, Sprint 17's rest included, about $470-700). Time: Sat 18:00 to Mon 07:00.
Cut order if it runs over: the prototypes' polish (eggs, baking, the corn stall) before the live games; a game's own open rows
before its kit adoption; the stove-kit lab page's last sections before any game. Never cut chai's frozen-run diff, and never a kit
piece half-switched (chai is on the old code or the new, never both).

## Sessions
One line each as they launch: id, what it does, model and effort, report in `build/reports/`.

## Zafar's decisions at the opening (7 Nov afternoon, "yes to all")
1. The sign-off of chai covers the 88 px phone glasses and the side panel moving unscrolled on phones, as built.
2. Up to eight builders at once for Sprints 17 and 18 (CLAUDE.md's "two at most" suspended for these two sprints; Zafar, 7 Nov).
3. Chai keeps one owner; the kit pieces are built in parallel in their own files; "nobody else in the same folders" becomes
   "nobody else in the same file".
4. Eight game builders in wave 2 (the family list above, chaat included); chop built in wave 1.
5. Lighter checks: builders' own before/after strips, no before-run and judge at launch; Fable judges in batches at each wave's end;
   Zafar reads the standard's "every game" lines whenever he likes, blocking nothing.
6. The pantry's polish moves out of this sprint to Sprint 19; the chain in `docs/sprints/plan.md` slides by one sprint (every later
   row moves down one; Sprint 19 then has the pantry's polish with no roll-out).
7. Art: the first pass uses landed art only; placeholders for daar's chop background, samosa's fill and fold, baking's word moment
   (ART-37, ART-38) and the wide-door counter (ART-59); one optional paste block written tonight.
8. Eggs' frown at the end becomes chai's progress display (non-negotiable 7).
9. Publish to `main` on his word by Mon 07:00.
10. Open, not blocking: the skies' four, the tongue depressor's brown, ART-59; and (asked ~13:30) which family chaat and chop
    belong to.

## For every brief (lessons from 6-7 Nov)
- Builders own disjoint files (`brief.mjs --live-check`); a refused brief is not written: check every "Wrote …brief.txt" line.
- Set `"live": false` on specs once builders finish.
- A builder's worktree starts with `git fetch && git reset --hard origin/<branch>`.
- One browser lock for every browser run (`/tmp/njg-browser-all.lock`); long jobs one at a time (container restarts kill
  background tasks); eight builders on four CPUs is untested (six was), so browser runs are rationed.
- Merges: the overnight log conflicts every time (append both); never `git pull --rebase` after merges.
- A fix moved into the shared module avoids clashes and reaches every game.
- Script-made before/after strips at fixed moments beat evidence probes.
- Sound rows need {human} evidence (sound logs, envelope measurements).
- Real-user conditions the sandbox hides: `navigator.webdriver` hides tap-to-start; test speed hides races (one child-pace pass).
- Measure source assets, not only code.
- contract-83 is flaky: re-run once before calling it red.

## Small decisions
- The S18 row in `docs/sprints/plan.md` is the stove family only; the pantry's six opening decisions (in Sprint 17's file) wait for
  Sprint 19's opening.

## Outcome

## Look back (three lines)
1.
2.
3.

## Starting prompt for Sprint 18's opening chat

In Sprint 17's file, its final section ("When Sprint 17 is done: paste this into a new chat to start Sprint 18"): the chat that
finishes Sprint 17 ends by updating the handover and telling Zafar to open a new chat with that prompt.
