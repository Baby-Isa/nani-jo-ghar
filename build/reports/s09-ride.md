# s09-ride

Branch `worktree-agent-ac78a83501956f4f8` (not pushed). Game code changed: the window ride (`js/shared/window-ride.js`, `js/day/window.js`, `data/day.json` window), its checks, flows and lab.

## Flaws first (builder's list; the judge decides)
1. **Checks red outside my files:** `recordings` and two unit tests still expect the stop-the-car beat (requests below).
2. Tablets (1024x768, 1366x1024): the frame, fitted by height, loses both pillars; only the headliner and door show (s09b's window with the opening in the middle 60% fixes it).
3. On 800x360 things are small (a door about 70 px; tap boxes 56 px minimum).
4. `touched.mjs` cannot place `js/day/*`, `data/day.json`, `lab/*`, so it lists every flow; only `day:window` loads the ride.
5. No s09r cow, tractor or bicycle: placeholders (they only pass by: engine gaps).

## What was built
- Three looping layers per trip (far 0.15, middle 0.4, near 1); copies cross-fade over the outer tenth; the s09r cuts drop in by path (`artBox`).
- Keyed car window `assets/day/ride/car-window*.webp` (0 green px), fitted by height, sides from its outer columns.
- Two ground lines, props on the verge (half-hide at most), unasked things passing; groups of look-alikes asked when all are in view.
- Three speeds (9 / 6 / 3.3 s across any window), eased over 1 s; Nani's speed lines; no stop-the-car.
- A missed thing comes round, with new look-alikes, until found.
- Contracts 47, 48; drivers speed-slow, speed-fast, miss; timed leak bot; 16 tests; `lab/ride-preview.html`.

## Proof
| | red | green |
|---|---|---|
| RIDE-01, 06 | tool failure, old frame | panels for the judge (`s09-ride-green2`) |
| RIDE-02 | tool failure | contract-47 PASS |
| RIDE-03 | fast 17 s, FAIL | slow 10.7 s, fast 3.9 s, PASS |
| RIDE-04 | contract-48 FAIL | PASS |
| RIDE-05 | no model, FAIL | PASS |

Matrix `s09-ride-matrix`: 8 sizes, all end, 0 contract breaks, 0 findings; paths `s09-ride-paths` 0 breaks. Videos and stills: `build/screenshots/s09-ride/ride-{slow,normal,fast}.webm/.png` (s09r art), `ride-normal-artplaceholders.png`.

## Engine gaps (grey, to record)
cow (`n.cow`), tractor, bicycle, Speed up! (`phrase.speed-up`), Slow down! (`phrase.slow-down`).

## Requests
- `recordings.mjs` line 239: replace the `r.stopCar` line with `for (const [k, l] of Object.entries(r.speedLines || {})) if (!k.startsWith("_")) say(l.meaning, l.en, \`Ride: Nani to the driver (${k === "up" ? "faster" : "slower"})\`, n, ride);` then rerun it (tried: the sheet and its test pass).
- `build/test_shared_day.mjs`: drop "Stop the car!" from the can-say list.
- `drivers/catalog.mjs`: `FAIR_MOMENTS["day-window"] = ["life:ride-call", "life:ride-pass", "life:ride-found", "life:ride-end", "life:ride-speed"]`.
- Move the ride's injected CSS into `css/day.css`.
