# s09-ride

Branch `worktree-agent-ac78a83501956f4f8` (not pushed). Changed: the window ride (`js/shared/window-ride.js`, `js/day/window.js`, `data/day.json`), its checks, flows, lab.

## Flaws first
1. `recordings` and two unit tests outside my files still expect stop-the-car (requests).
2. Tablets: the height-fitted frame loses its pillars (s09b's window fixes it).
3. 800x360: things small (door about 70 px; taps 56 px minimum).
4. `touched.mjs` can't place `js/day/*`, `data/day.json`, `lab/*`: lists every flow (only `day:window` loads the ride).
5. No cow, tractor, bicycle art: placeholders.

## Built
- Three looping layers (0.15, 0.4, 1), cross-faded over the outer tenth; s09r cuts by path.
- Keyed car window (0 green px), sides from its outer columns.
- Two ground lines, half-hiding props, unasked things passing; look-alikes asked once all in view.
- Speeds 9 / 6 / 3.3 s on any window, eased over 1 s; no stop-the-car; a missed thing comes round until found.
- Contracts 47, 48; three drivers; timed leak bot; 16 tests; `lab/ride-preview.html`.

## Proof
| row | red | green (`s09-ride-green2`) |
|---|---|---|
| RIDE-01, 06 | tool failure | judge panels |
| RIDE-02 | tool failure | PASS |
| RIDE-03 | fast 17 s | slow 10.7 s, fast 3.9 s |
| RIDE-04 | FAIL | PASS |
| RIDE-05 | FAIL | PASS |

Matrix `s09-ride-matrix`: 8 sizes end, 0 breaks. Videos: `build/screenshots/s09-ride/ride-{slow,normal,fast}.webm` with stills; placeholder still.

## Engine gaps
cow, tractor, bicycle, Speed up!, Slow down!

## Requests
- `recordings.mjs:239`: say each `r.speedLines` entry instead of `r.stopCar` (tried: green).
- `test_shared_day.mjs`: drop "Stop the car!".
- `catalog.mjs`: `FAIR_MOMENTS["day-window"]` = the `life:ride-*` moments.
- Move the ride's injected CSS to `css/day.css`.
