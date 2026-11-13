# Sprint 19: an independent review of the kitchen games' architecture (13 Nov)


## 1. The short answer

- Zafar's model is right. Three layers, with the mechanic in the game's own file, is the correct shape.
- One thing in it must be made sharper: **the middle layer must run the screen, not just offer parts.** His words ("you would get an order ... an open gameplay area with nothing in it ... placeholders") describe a template you could play empty. That does not exist today.
- Today the kitchen layer is a box of parts (a hob, a knob, a stone band). Each game is still the director: it measures the screen, places everything, and runs its own round. So every game is laid out differently, and a shared fix meets ten different callers.
- "Clone chai and adapt" is the right instinct but the wrong move. Ten clones means every fix is done ten times. The right move is: **pull the empty stove game out of chai once, then plug each game into it.**
- The week was not wasted. The parts are real and mostly good. What is missing is the frame that holds them.
- The one thing that matters most: **a game file must not be able to do layout or run the round.** Make that a check, and the drift stops.

## 2. How it should work

**Layer 1: the shared kit (every mode).** A toolkit of finished parts, each with its own spacing rules and a few named options.
- Parts: the word card, the order card, Nani's box, speech bubbles, the first-time light and stuck help, the count pill, the well-done and wrong-order moments, the end screen, sounds.
- Item displays: the shelf and the stone tray, each knowing its own padding, gaps, size limits and how the pill attaches. A game picks an option; it never sets a number.
- It never knows any game's name.

**Layer 2: the kitchen template (every kitchen game).** This is a small program that runs a round and owns the screen.
- It runs the sequence: order, optional word moment, play screen, serve, well done or wrong order and redo, closing kitchen scene, level-up count.
- It divides the screen at all four sizes: side panel, a central play area, the bottom row. It hands the game named boxes: "your play area is this rectangle", "your bottom row has these slots".
- It allows only the kitchen's choices: shelf or stone tray; knobs below or to the left; one screen or two (corn, samosa and sekelo have two).
- It owns the kitchen's timing rules: when the first light comes, the stuck-hint wait, the breath between steps.
- A **stove part** sits inside it for games with heat: hob, burners, knob, green window, boil-over.
- Played with no game plugged in, it shows an order, empty slots and an empty middle. That is Zafar's picture, and it should be a real lab page.

**Layer 3: the game.** Two things only.
- Its **mechanic code**: how the maani grows as you roll, how a piece slides on a skewer, how the samosa folds. It draws inside the box it was given.
- Its **settings file** (`data/stations/<game>.json`): what goes on the bottom row, the levels, decoys, timings, pictures.
- It answers a few questions the template asks: "what is the next right move?", "is this dish right?", "reset this dish".

**Where rules live.**
- Numbers (levels, decoys, timings, how many right picks hide a pill): settings files, `data/rules.json` and the game's json.
- Rule logic (the word ladder, the pill, the leak test): one shared place (`js/shared/rules.js`, the progress core). Never in a game.
- The Kutchi language engine: shared, below everything. A game names what to say; it never builds a sentence.

**A very different mode (the window).** It uses layer 1 as it is: cards, Nani's box, lights, the end screen, the language engine. It gets its own family template (a ride, not a kitchen). It never touches the kitchen template. This is why the middle layer earns its place: it keeps kitchen assumptions out of the shared kit.

## 3. Where the code is today, measured

**Every game does its own layout.**
- Chai works out its hob size, tray and centring itself over about 60 lines of sums (`js/cook/stations/chai-tray.js:420-462`).
- Eggs has its own separate `layout()` (`js/cook/stations/eggs.js:101`). Daar, samosa, maani, corn and baking each have theirs.
- The same centring function is pasted, word for word, in four files: `samosa.js:79`, `daar.js:226`, `maani-line.js:118`, `mechanics/thread.js:56`.
- The "how many screen pixels is one game pixel" sum is re-written in 14 files (6 times in chai alone).
- The bottom row's height is typed as a fallback `630` in four game files (`eggs.js:202`, `baking.js:229` and `661`, `chop.js:32`, `corn.js:40`), beside the shared value (`js/shared/shelf.js:88`).
- Big position numbers (three or four digits) per game file: daar 113, samosa 112, eggs 97, chai 95, maani 92, baking 80; the grill mechanic 325.

**Every game runs its own round.**
- The template idea exists from September (`js/cook/zone.js`: screen regions a mechanic is placed into). Every large game declares regions and then ignores them. Chai declares two regions that are both the whole screen (`chai-tray.js:189-192`). Sekelo says so plainly: "the two-zone screen isn't used" (`mishkaki-grill.js:59`).
- The shared serve round is used by five games (chai, corn, eggs, maani, chaat); daar, samosa, sekelo, baking and chop do their own.
- The level-up count is called by hand in three games and by a catch-all that skips chai by name (`js/cook/flow.js:522`).

**The shared files know the games by name.** (Lines of live code, comments excluded.)
- `js/cook/flow.js`: 33 lines name a game; e.g. a chain of "if chai ... else if maani ... chaat ... samosa ... mishkaki" (`flow.js:1008-1029`).
- `js/cook/serve.js`: 17. `js/cook/ui.js`: 16 (`ui.js:1606`, `1630`). `js/cook/station-lib.js`: 8, including "skip this if the game is chai" (`station-lib.js:60`, `436`).
- This breaks the project's own rule STD-F1-02 ("no kit file names a game"). It is why a shared fix for one game breaks another.

**Sizes.** Game files: chai 2,346 lines, samosa 1,872, daar 1,508, eggs 1,179, maani 1,108, corn 1,033, baking 894. The shared side panel file `js/cook/ui.js` is 5,272 lines.

**Settings files have no common shape.** Chai's has 5 top-level keys, baking's 16, eggs' 14; each game invented its own `scene` block of layout numbers.

**The safety net is currently red.** Chai's frozen run shows 382 changes on 30 pages (`build/reports/frozen-diff-chai-tray-202611131035.md`). Only chai has a frozen run.

## 4. What carries over from this week, and what doesn't

**Carries over (real, keep):**
- Chai shrank from 3,453 to 2,346 lines since 7 Nov. About a third of it really did move into shared parts.
- The parts themselves: the shelf (`js/shared/shelf.js`), the serve round and wrong-order moment (`js/shared/serve.js`, `wrong-order.js`), the lights and stuck help (`js/shared/onboard.js`, `js/cook/coach.js`), pans, pouring and boiling (`mechanics/pan.js`, `pour.js`, `boil.js`), the grill kit, the hob and knob rule.
- One chop game used everywhere. The settings file per game. The new art.
- The checks: the contracts, the evidence tool, the frozen run, the eye judge beside chai. These are what make a safe migration possible.
- Every decision Zafar made. None is lost. In short: the week built the bricks and paid for ten hand-built walls; the bricks are kept.

**Does not carry over:**
- The layout code written into each game this week. Eggs grew from 580 to 1,179 lines, corn from 309 to 1,033, baking from 443 to 894. The mechanic part stays; the placing part is replaced by the template.
- Per-game pixel fixes (for example "the tray 6 px left of the cog", commit `cd6f8aac2`). The template will decide these once.
- The by-name patches in shared files. Each becomes an option or goes.
- A large share of the open layout rows. They should not be fixed one by one; most disappear when the game sits in the template.


## 5. How to get there safely

In order, each step starting when the one before is proven:

1. **Make chai green again.** Fix the three known faults, then freeze chai afresh. Without a trusted reference nothing can be proven.
2. **Freeze every kitchen game** as it plays today (extend `frozen.mjs` beyond chai). This is each game's "before".
3. **Pull the template out of chai.** One builder, one owner. Chai's layout sums and round steps move into the template; chai keeps its recipe and its heat-and-pour rules. Proof: chai's frozen run unchanged, at the four sizes. Target: chai under about 900 lines.
4. **Build the empty-template lab page.** Zafar plays it: an order, empty slots, an empty middle. He signs off the frame once.
5. **Eggs second.** Same family (a hob, pans, plates), so it tests the template with the fewest new needs. Proof: the eye judge beside chai, plus eggs' frozen run with only expected changes listed.
6. **Then a no-heat game** (maani), to prove the stove part is truly optional. Then a two-screen game (corn). Then samosa, sekelo, daar, baking, chop and chaat, the pantry last.
7. The old path stays live for each game until its new one passes. One switch per game, so `main` always works. Once passed, the old code is deleted (rule STD-F1-05).

**Guard rails, as code checks:**
- A game file may not read the screen size or convert pixels (no `Cook.view`, no `worldToScreen`).
- A game file may not hold position numbers; only fractions of its own box.
- A kit or shared file may not name a game. Start with a count that may only go down.
- No function body may appear in two files (catches pasted copies).
- Size limits: a game file 900 lines; a count that may only go down for `ui.js` and `flow.js`.
- One shape for every settings file, checked.
- A template contract test: the empty template at four sizes, every slot in place; every game calls the same round.

## 6. Risks, and what Zafar decides

1. **Pause per-game layout fixes on kitchen games until the template exists?** Recommend yes. Fix only what blocks play.
2. **Build the template by pulling it out of chai, not by cloning chai?** Recommend yes.
3. **One builder owns the template, with no parallel builders in shared files?** Recommend yes. Eight builders in shared files is how shared fixes broke other games.
4. **Eggs as the second game?** Recommend yes; then maani, then corn.
5. **The menu of allowed options** (shelf or stone tray; knobs below or left; one or two screens). Recommend he approves it on the empty-template lab page.
6. **Retire the September "zones" system** once the template replaces it? Recommend yes; two half-used systems is worse than one.
7. **Accept small visible changes** in other games as they join (they will look more like chai)? Recommend yes; that is the goal, and each change is listed for him.

Risks: the template could grow its own by-name exceptions (the check in section 5 stops it); chai could shift while its code moves (the frozen run stops it); the 5,272-line side panel file is a slow hazard, to be split later, not now.

## Proof

- Read: `js/cook/kitchen-kit.js`, `station-lib.js`, `zone.js`, `stations/*.js`, parts of `flow.js`, `ui.js`, `serve.js`, `js/shared/serve.js`, `shelf.js`; `data/stations/*.json`; `docs/architecture/module-map.md`; `docs/design-language/standard/f-build.md` (F1); `git show 50e660f:docs/design-language/chai-standard.md`; `docs/sprints/S19-chai-standard-everywhere.md`; the latest frozen diff.
- Measured with line counts and searches over code lines (comments excluded): game names in shared files; position numbers and screen-size reads per game; calls to the serve round and level-up count; pasted functions (`centreLift`, the pixel sum).
- Sizes then and now: `git show 50e660f:js/cook/stations/<game>.js | wc -l` against today.
- Not done: no browser runs, no play-through; the language engine and the other modes were not read in depth.
