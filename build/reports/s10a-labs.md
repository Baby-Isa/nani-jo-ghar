# s10a-labs

Branch `worktree-agent-a5e1a30adbf97518f` (merge it; not `ccr-1888a520-dk18y7`, which I did not touch), head `bb7053c`. Nothing pushed, no bump, no publish.

## What was built
- **Labs page** (`build/gen_labs.mjs`): top row (New player, Walkthrough, house, day builder); 36 "Play any game" cards with a level picker and Play; one folded "Behind the scenes" with every old, parked, test and demo page once. Each clinic game appears once; eye test B is behind the scenes.
- **Day builder** (`lab/day.html`, `js/day/day.js`): stages in order, or one game; `?stages=` is kept in `story.today` and resumed after each hand-off; new `cook` and `clinic` stages.
- **`?then=`** (`js/shared/host.js`, `js/clinic/main.js`): the end screen's list becomes Next and goes to the waiting page. The old kitchen day's `cook.html` hand-off is unchanged (`day:full-kitchen` expects it), so DAY-03 is your call.
- **New player**: `Save.resetPlayer` in both saves, used by both "Play as new" buttons and the labs one.


## Open items
1. `checks.mjs` fails `recordings` (docs file out of date), also on the base commit: run `node build/tools/ops/recordings.mjs`.
2. LAB-01..04: machine PASS, left open for the judge.
3. Deviations: the clinic hand-off omits `lab=1`; evidence sizes 1366x768 and 1440x900 (1480x924 pictures come from `build/s10a_shoot.mjs`); `build/host/labs.test.mjs` rewritten, its link fixture now guards pages.
4. House flow: 13 tap-small findings on the untouched grown-ups form.

## Proof
- Unit: `test_shared_reset_player` 8, `test_day_stages` 9, `host/labs` 4; `checks.mjs` otherwise green (see commit log).
- Contract matrix `s10a-labs-matrix` (house, day:door, day:book, day:full-kitchen, cook:chai-tray, clinic:heal-eye, lab:cook/chai-tray at 1366x768, 1440x900): 14/14 reach the end, 0 contract breaks, 0 page errors.
- Evidence `ev-20261022-004909-bbo` (LAB-02..04), `ev-20261022-005004-cj9` (LAB-01): machine PASS.
- Pictures, `build/screenshots/s10a-labs/` (not committed): `labs-top|full|new-player|behind-{1366x768,1480x924}.png`, `builder-empty|built-*.png`; filmstrips `day-01..26` (door, chai L1 at the builder's link, Next, book, house), `dayclinic-*` (door, eye L1, Next, book), `walk-*` (pantry, chai, back at labs). `s10a_shoot.mjs labs|builder|day|dayclinic|walk` reprints 0 clipped text and all links answering.
