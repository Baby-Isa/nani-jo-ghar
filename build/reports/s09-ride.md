# s09-ride

Branch `worktree-agent-ac78a83501956f4f8` (not pushed). Changed: the window ride (`js/shared/window-ride.js`, `js/day/window.js`, `data/day.json`), its checks, flows, lab.

## Flaws first
1. A faint ghost of the far hills remains over each 10% overlap: the cut's outer tenths are not plain hillside.
2. `plus-lighter` (the two-way cross-fade) needs Safari 15.4 or later.
3. Tablets: the height-fitted frame loses its pillars (s09b's window fixes it).
4. 800x360: things are small (door about 70 px; taps 56 px minimum).
5. `touched.mjs` can't place `js/day/*`, `data/day.json`, `lab/*`.
6. `load` once failed on cook:chop (an oversized Nani face, Cook's), then passed 29/29.

## Fix round (20 Oct)
- **RIDE-01 jump/stall**, causes: (a) the strip filmed a 3x ride, a fifth to a half of the window per 400 ms frame; (b) late frames were clamped to 100 ms, so the road lost time, then crept; (c) a prop at a group's front came on inside the window. Now the fair ride plays at speed 1, the road keeps wall-clock time, and the prop comes on with its group. The new no-jump test was red on (c).
- **Zafar's stray edge**: the join, not the cut. Only the incoming copy faded, so the old copy's hill line ended in a hard vertical edge. Now both copies fade, summed with `plus-lighter`.
- **Parallax**: `parallax` and `parallaxSets` (deep, gentle, together) per trip, default deep; switch on the preview.

## Proof
RIDE-01: red `s09-ride-r01-red`, then green filmstrips `s09-ride-fix2` for the judge. RIDE-02 to 05 machine PASS; RIDE-06 panels. Matrix `s09-ride-matrix3`: fair and miss at 8 sizes, 0 breaks. `checks.mjs` all ok.
Videos and stills in `build/screenshots/s09-ride/`: slow, normal, fast (20 s); `ride-gentle.webm`, `ride-together.webm` (15 s); a placeholder still.

## Requests
- `catalog.mjs`: `FAIR_MOMENTS["day-window"]` = the `life:ride-*` moments.
- Move the ride's injected CSS to `css/day.css`.
- Re-cut far-hills with plain outer tenths.
