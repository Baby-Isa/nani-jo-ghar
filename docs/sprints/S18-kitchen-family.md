# Sprint 18: every kitchen game at chai's standard, built properly

**Status:** open (Zafar, 7 Nov: "yes to all"; opens the moment Sprint 17's tools and docs are pushed, ~18:00 Sat 7 Nov, no gap)
**Opened:** 7 Nov 2026 · **Closes at:** the publish to `main` by Mon 9 Nov 07:00 UK, Zafar's play and `/feedback`

## Goal
Every game in the family list below is at chai's standard on the three layers, coded well; a first pass of every one is live on
`main` by Monday 07:00 for his review before 10:00. Chai itself is unchanged in behaviour: its frozen run says so after every move.

## The family this sprint (the one list; change it here only)
**The family is "Make in the kitchen (a recipe)"** (Zafar, 7 Nov, decision 11, answered ~14:00): chai its reference; daar, sekelo,
maani (and the rolling), chaat, chop, samosa, eggs at breakfast, baking, the corn stall. It is every Cook game except **the
pantry**, which stays the reference of **fetch and serve** (someone asks, you find and give; its family includes stalls outside the
kitchen). Story mode and free play are ways of playing the Cook games, not games; "count to a heard number" is its own mode outside
Cook. The cake is in the word-tiles family (3 Nov). The families table: `docs/process/prototype-to-game.md`.
**Eight games, one builder each in wave 2:** daar, chaat, samosa, maani, sekelo, eggs at breakfast, baking, the corn stall.
**Plus chop as its own game**, built in wave 1 on the kit; daar and chaat use it (Zafar, 7 Nov). Each keeps its own mechanic
(non-negotiable 1) and takes the kit for the rest.

The reference: `docs/design-language/chai-standard.md` (signed off 7 Nov; after Sprint 17's stitch, a pointer to the standard folder
docs/design-language/standard/) and Sprint 17's module map. The family and each game's gap: `docs/game-design/families/kitchen.md`.
The plan and its review: `build/reports/game-rollout-plan-review-2026-11-07.md`.

## "Coded well": the sprint's rules (Zafar, 7 Nov: "modular, scalable, best practice, easy to change things across all, consistent across all")
1. **Three layers** (Zafar, 7 Nov, decision 13). The shared kit (`js/shared/`: every game) → the kitchen kit (`js/cook/`, made from
   chai and the existing `js/cook/kitchen-kit.js` and `js/cook/mechanics/`: the worktop, board and knife, pans, burners, knobs,
   heat, the boil and its sound, pouring; its **stove part** used only by games that cook with heat) → each game, which is its
   settings file plus its own mechanic. **Whatever the pantry and the fetch-and-serve stalls will also need goes in the shared
   kit:** the shelf with its word chips and count pills, the order's flow and timings, lights and lessons, serving to a customer.
2. **A fix goes in the lowest layer that owns it**, once, and reaches every game from there.
3. **No game copies kit code; no kit code names a game.** A game that needs something the kit lacks asks for it in the kit.
4. **One module, one owner** for the run; files are disjoint between builders (`brief.mjs --live-check`).
5. **A lab page shows every piece in every state:** the shared kit's pieces on `lab/kit.html`; the kitchen kit's on the kitchen-kit
   lab page; each kit builder adds its section.
6. **Every game keeps its own mechanic** (non-negotiable 1) and takes the kits for everything else: heat and boil, pour and
   serve, the shelf and pills, the lights and lessons, the order's flow and timings.
7. **Every game is measured against the standard, rule by rule** (Zafar, 5 Nov, `build/reports/s17-standards-structure-v2.md` §8):
   `audit --standard <game>` reads the rule rows (ID, Checked by) and prints each as pass, fail or judge; a game's gap page is
   `docs/design-language/standard/gaps/<game>.md`.

## Waves (up to eight builders at once, Zafar's 7 Nov decision 2)

**Wave 1, Sat 18:00 → Sun ~10:00, eight builders.** Chai's behaviour becomes the kits'; chai switches onto it piece by piece.
- **Chai's owner** (Opus, high, $40-60): the sole owner of `js/cook/stations/chai-tray.js`. Switches chai onto each kit piece as it
  lands, in Zafar's order: heat and boil; pour and serve; the shelf and pills; lights and lessons; the order's flow and timings.
  Chai's frozen-run diff after each switch; a film only where the diff shows change. Owns the kitchen-kit lab page's shell.
- **Five kit builders** (Opus, high, $20-30 each), each in its own files, each adding its section to a lab page:
  (a) heat, burners, knobs and the boil sound (the kitchen kit's stove part); (b) pouring and serving (the kitchen kit; serving to a
  customer in the shared kit); (c) the shelf and its word chips and count pills (**the shared kit**, decision 13: the pantry and the
  stalls need it); (d) lights and lessons (the shared kit); (e) the order's flow and timings (the shared kit; owns `js/cook/ui.js`
  and `js/shared/order-card.js` for this run).
- **Chop as its own game** (Opus, high, $20-30), on the kits (the family list above); its first step is its gap page.
- **Prep for eggs, baking and the corn stall** (Sonnet, high, $10-15): cut and wire the art already landed, write their settings
  files, list their missing Kutchi.

**Wave 2, Sun 08:00 → ~20:00, eight builders, one per game in the family list** (Opus, high, $20-30 each). **Its first step is the
game's gap analysis, rule by rule:** `docs/design-language/standard/gaps/<game>.md` from `audit --standard <game>` plus its own
read of the game, every rule scored on the proof scale (0 n/a · 1 missing · 2 built, unproven · 3 check green · 4 judged · 5 his
"done"; or "different by design", dated), with the next step per gap (Kit, Adopt, Game code, Art, Words, Decision, Check). Then it
works to that page: keeps its own mechanic, moves onto its settings file and the kits, deletes the code it copied, fixes its own
open rows, shows missing Kutchi as grey English. It starts with the game's own parts and takes each kit piece once chai's owner
has switched chai onto it.

**Wave 3, Sun 20:00 → Mon 07:00, the orchestrator.** Merge each game; one audit at the four sizes per game (`--standard` included);
one new-player film per game; Fable judges the films and the diffs in batches of ten; fixes go back to the builder, or into the kit
where the kit owns the rule; publish to `main` (`--force` on Zafar's word, decision 9); handover with his play list. Optional, cut
first: the heat-map roll-up of the gap pages (domain x game, a readiness bar per game). After Monday: his play, `/feedback`, every
row fixed once in the kit.

**Light checks** (decision 5): builders run `checks.mjs` and one run of their own game at one size at the end; the four sizes once
per game at merge; chai's frozen-run diff automatic after each switch; script-made before/after strips at fixed moments instead of
a before-run and judge at launch. A progress table every half hour (done in the last half hour, still to do, percentage).

## Budget
About $380-575 for the sprint (the weekend, Sprint 17's rest included, about $470-700). Time: Sat 18:00 to Mon 07:00.
Cut order if it runs over: the heat-map roll-up; the prototypes' polish (eggs, baking, the corn stall) before the live games; a
game's own open rows before its kit adoption; the kitchen-kit lab page's last sections before any game. Never cut chai's frozen-run
diff, never a game's gap page, and never a kit piece half-switched (chai is on the old code or the new, never both).

## Sessions
One line each as they launch: id, what it does, model and effort, report in `build/reports/`.

## Zafar's decisions at the opening (7 Nov afternoon, "yes to all"; 11-13 at ~14:00)
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
10. Open, not blocking: the skies' four, the tongue depressor's brown, ART-59.
11. **The family is "Make in the kitchen (a recipe)"** (answered ~14:00): chai, daar, sekelo, maani (and the rolling), chaat, chop
    (its own game, used by daar and chaat), samosa, eggs at breakfast, baking, the corn stall; every Cook game except the pantry,
    which stays fetch and serve's reference (its family includes stalls outside the kitchen). Story mode and free play are ways of
    playing, not games; "count to a heard number" is its own mode outside Cook. The cake stays in word tiles (3 Nov).
12. **The standard is a folder, not one page** (his yes to the limit's intent): docs/design-language/standard/, each page under
    its own limit (about 2,500 words), in the structure he locked on 5 Nov (`build/reports/s17-standards-structure-v2.md`).
13. **Three layers in code; what the pantry and the stalls also need is shared** (the orchestrator's recommendation, applied; he
    can strike it): the shared kit → the kitchen kit (its stove part for games that cook with heat) → each game. The shelf with its
    word chips and count pills, the order's flow and timings, lights and lessons and serving to a customer go in the shared kit, so
    kit builder (c) builds there. The 5 Nov "Engine" scope folds away: a rule scoped Engine goes to House if the pantry or stalls
    need it, else Family. Scopes are now three: House, Family (the kitchen family), Game (chai only).

## Zafar's answers, 7 Nov ~16:30 (the standard's questions and the art: "yes to everything else"; 8, 11, 12, 13, 19 below)
- **Chai is fixed first ("ensure the chai is fixed"):** chai's owner's first three tasks, before any switch onto a kit piece, each
  proven by `frozen.mjs --diff` and its check: **CHAI-105** (a boiled-over pot's card stays ticked; contract-96), **CHAI-106** (no
  card light after a skipped order at L4; contract-90 widened past L1), **CK-60** (a word said after a skip on the take-back
  player; contract-95). Then re-freeze chai (`frozen.mjs --freeze`) so the guard holds the fixed chai.
- **Kit builder (e)** (the order card): the item card's padding at least 4 px (SH-234, values.md "item padding floor").
- **Kit builder (d)** (lights): delete the old `showing.lightHelpArrow` switch as the lights move into the kit (off since 29 Oct).
- **Pass-me out** of every game (13: `data/cook.json` passMeChance 0, done 7 Nov; MAA-14 parked): no builder brings it back.
- **The orchestrator's fast lane:** the door's four skies and the sun card swapped in (the nights kept, ceiling re-tuned; the day
  square kept); art block 3c (the two farm edits, the walnut tongue depressor and hourglass, the wide counter) in the art queue.
- Settled in the docs: a contrasting pair in teaching order in every game (STD-C1-01), a wrong move brings the hint at once
  everywhere (STD-D2-04), Nani's hint hides a word past support (STD-D2-05), the call with its light (STD-D1-06), the word moment's
  pair hold 2.2 s, the white marble kept (ART-55), the vision's age line and cutscene pillar, the dropped list, `publish.mjs --force`
  needs `--words` (his words into the commit), every brief lists the game's keep rows. 12 (the frown after a wrong cup) left as is.

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
- 7 Nov ~15:00 (the orchestrator, from the standard's F1): the module map is `docs/architecture/module-map.md`; the pans and their
  looks go to kit builder (b) with pouring, the worktop wash and the stone band to (a) with the stove's scene.
- The S18 row in `docs/sprints/plan.md` is the kitchen family only; the pantry's six opening decisions (in Sprint 17's file) wait for
  Sprint 19's opening.
- 7 Nov ~14:00: this file and the family page were renamed from "stove" to "kitchen" (decision 11); stubs at the old paths.

## Outcome

## Look back (three lines)
1.
2.
3.

## Starting prompt for Sprint 18's opening chat

In Sprint 17's file, its final section ("When Sprint 17 is done: paste this into a new chat to start Sprint 18"): the chat that
finishes Sprint 17 ends by updating the handover and telling Zafar to open a new chat with that prompt.
