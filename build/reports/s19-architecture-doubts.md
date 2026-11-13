# Sprint 19: Zafar's doubts, answered (13 Nov)

Third report, after `s19-architecture-review.md` and `s19-architecture-how.md`. Read-only. Where my own plan was wrong, I say so.

## 1. The empty template: he is right

- There is almost nothing to approve on an empty frame. How many cards, how big the middle, which bottom row: all of that depends on the game.
- **I withdraw the empty-template lab page with sliders as an approval step.** A "dressed" frame with placeholder items is useful to a builder. It is not worth Zafar's time.
- **What he approves, and when:**
  1. Chai, after its frame code moves: he need not look. A machine says "identical" or it does not go in.
  2. **Eggs beside chai, at the four sizes.** This is the first real approval: a real game, playable, sitting in chai's frame.
  3. Then each game beside chai as it joins.
- He approves games. He never approves a frame, a rule card or a number.

## 2. "Measure chai, then move it": the nervousness is right

- My plan had a translation in it: measure chai, write rules from the measurements, re-build chai from the rules. Every translation loses something. That is the risk he feels.
- **The safer step: move chai's frame sums as they are. Do not re-derive them.** About 45 lines (`js/cook/stations/chai-tray.js:418-462`) go, unchanged, into one shared function. The same code gives the same numbers.
- The proof shrinks to match. No big measure sheet: about ten boxes (play area, hob, tray, bottom row, first and last pan) at the four sizes, before and after. Identical, or it does not go in.
- Then eggs calls that function instead of its own (`js/cook/stations/eggs.js:101`). That is the first visible win: **eggs laid out like chai.**
- Rule cards come later, and only for a rule a second game actually strains. I had about twelve up front, each tested over sizes, people, levels and words. That was overbuilt: more checks, in a project already drowning in them.
- If eggs in chai's frame looks wrong, we have learned cheaply that the frame needs an option, before nine other games depend on it.

## 3. Why the checks keep "not working"

Bluntly, six causes. The first is the real one.

1. **The checks are being asked to fix a code problem.** Each game lays itself out, so one frame fault shows up as a row in ten games at four sizes. Last night: 19 rows closed, 28 built, **97 new** (`build/reports/s19-morning-2026-11-13.md`). No check process can win against that. "Get to 0" was never reachable this way.
2. **The suite is never green, so it cannot gate.** The bar became "fewer breaks than yesterday": 69 against 76 (`s19-morning`); a builder's branch showed 84 against a baseline of 63, "18 got better and 40 got worse", explained as timing checks that wander (`build/reports/s19-r2-games.md`). When red is normal, everyone learns to explain red away. There are four "known failures" lists (`build/tools/review/data/*-known.json`).
3. **Proving a fix costs more than making it.** Every row wants its own probe, picture and judge. So 204 rows sit at "built, needs a check" against 150 needing code (`docs/process/regressions.md`). The middle tier of checks plans **264 minutes**, so it was "not run" (`s19-r2-games.md`). A rule nobody can afford to run is not a rule. "Red first, then green" only applies when a row's evidence is run at all.
4. **Builders still grade themselves in practice.** They write their rows as "DONE" in their own reports, and one raised its own row's probe limit to get the picture it needed ("CK-105's probe ... max raised from 8 to 16", `s19-r2-games.md`). The judge only sees the sheets the builder's run produced. A third of this morning's sheets did not show the thing at all (the coordinator's count).
5. **Rows turn one sentence into a permanent law, and the laws collide.** 340 of the 478 open rows come straight from Zafar's feedback. Each became a row, many became a check. Then DAAR-39 (his) broke contract-105 (also his); this morning's decisions list has a whole section headed "each fix needs one of your earlier rules to give way" (`build/reports/s19-decisions-2026-11-13.md`).
6. **The checking machine is nearly as big as the game.** 96,500 lines of build tools against 126,300 lines of game. 179 contract checks, 177 other checks audited on 8 Nov with 160 kept (`docs/process/check-audit.md`), 685 reports. It has its own bugs (the evidence tool's faults fill commit `973226bc7`). A large share of each night goes to feeding it.

One thing in fairness: **the checks are mostly sound.** In last night's gate, 161 of 179 contract checks had zero breaks; 18 had any (`build/screenshots/sandbox/s19-r2-gate/contract.md`). The trouble is not bad checks. It is 18 noisy ones making the whole suite red, one probe per row, and a list that refills from the code.

Is the game simple? One game is. Eleven games, four levels, four sizes, one to four people, each hand-laid, is about seven hundred screens. That is exactly what a shared frame collapses.

## 4. Stop, keep, and the simplest process that holds

**Stop:**
- One probe and one judged picture per row.
- "Fewer breaks than yesterday" as a pass.
- A new check for each new row. No new checks at all until the suite is green.
- Builders touching probes, row statuses or checks.
- Fixing or checking kitchen layout rows game by game.
- New tiers, new audits of the checks, new reviews of the process.

**Keep:**
- The fast checks before every push (`checks.mjs`: 14 steps, all passing, about 2.5 minutes).
- "Every game reaches its end with no page errors at the four sizes."
- The 161 contract checks that are at zero.
- The eye judge beside chai. It is the one check that told the truth this sprint.
- The Kutchi and no-English rules.
- Zafar's play.

**The process, three gates:**
1. **Green means zero.** The 161 clean contract checks plus the fast checks are the gate. Any break blocks a merge. The 18 noisy ones are set aside as "advisory" (kept, not deleted) and return one at a time when fixed.
2. **Beside chai.** A game that changed is judged beside chai by the independent judge, on a whole play-through, not per row.
3. **Zafar plays.** His feedback is grouped by cause before it becomes rows: one row for a frame fault, not ten.

**The fix list:** kitchen layout rows are parked under one item per game, "on chai's frame". When a game joins the frame, its parked rows are judged together in one sitting, and closed or kept. The 204 "built, needs a check" rows are judged the same way, by game, with no new probes.

## 5. Revised decisions for Zafar

1. **No approval of an empty template.** Your first approval is eggs beside chai. Recommend yes.
2. **First step: move chai's frame sums unchanged into one shared function**, proven identical on about ten boxes at the four sizes. Recommend yes.
3. **Second step: eggs uses it.** You look at eggs beside chai. Recommend yes.
4. **Drop from my plan:** the slider lab page, the dozen rule cards up front, the full measure sheet. Recommend yes.
5. **Green means zero:** the 161 clean checks gate; the 18 noisy ones become advisory. Recommend yes.
6. **No new checks, tiers or check reviews** until that gate has stayed green through one game joining the frame. Recommend yes.
7. **Park kitchen layout rows;** judge each game's rows together when it joins. Recommend yes.
8. **Builders never touch probes, checks or row statuses.** Recommend yes.
9. **One builder** on the frame until eggs passes. Recommend yes.

## Proof

- `build/reports/s19-morning-2026-11-13.md` (19 closed, 28 built, 97 new; 69 against 76 breaks).
- `build/reports/s19-r2-games.md` (84 against 63; "18 got better and 40 got worse"; check-change "not run", 264 minutes; the probe raised by its builder; rows written DONE).
- `build/screenshots/sandbox/s19-r2-gate/contract.md` (179 checks listed, 18 with breaks; the largest: contract-114 with 12, contract-37 with 10).
- `docs/process/regressions.md` (478 rows: 204 "to fix: check", 150 "to fix: code", 69 waiting on art; 340 sourced from Zafar's feedback, counted from the Source column).
- `docs/process/check-audit.md` (177 checks: 160 kept, 14 fixed, 3 retired).
- Line counts: `build/` scripts 96,542; `js/` without vendor 126,287; 685 entries in `build/reports/`.
- `build/reports/s19-decisions-2026-11-13.md` (section B); `build/tools/review/data/*-known.json`.
- Not done: no checks were run; "a third of sheets" is the coordinator's figure; whether the 18 noisy checks are flaky or catching real faults was not examined one by one.
