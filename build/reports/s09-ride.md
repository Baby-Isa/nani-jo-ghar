# s09-ride

Branch `worktree-agent-ac78a83501956f4f8` (not pushed). Changed: the window ride (`js/shared/window-ride.js`, `js/day/window.js`, `data/day.json`), its checks, flows, lab.

## Flaws first
1. RIDE-01's new spec (`strip:.wr-view:16x800`) is a tool failure: at most 12 frames.
2. The game's motion was already even in headless Chromium; the jerk was the recorder (below).
3. One 150-183 ms hitch early at 844x390 in 2 of 6 runs; no new element that frame.
4. Faint far-hill ghost over each overlap (the cut's outer tenths); `plus-lighter` needs Safari 15.4+.
5. Tablets lose the frame's pillars; things small at 800x360.
6. `ride-gentle` and `ride-together` are old recordings (5-8% repeated frames).
7. `checks.mjs` load: cook:chop fails now and then (Cook's oversized Nani face, not mine); all else ok.

## Round 3 (Zafar, 20 Oct evening)
- Gentle layers (0.5 / 0.8 / 1) are the farm road's default.
- **Smoothness, measured in the page** (rAF, 10 s, normal speed, no screenshots):
  - 1366x768: frames p5/p50/p95 16.6/16.7/16.7 ms; 1-4 dropped frames (33 ms).
  - 844x390: 16.6/16.7/16.8, max 16.8.
  - 0 frames whose move differed from its time (0.5 px margin).
  - Old Playwright videos: 5-10% of frames repeat, standstills up to 240 ms.
- **Fixes:** the clock is one pure step (`W.advance`), tested over 10 s of uneven frames (worst under 0.2%); sub-pixel `translate3d`; `will-change`; no repeated style writes.
- **Videos:** frame-exact recorder (paused Playwright clock, compositor capture, 50 fps). ride-normal (gentle, starting in town), slow and fast: 1000 frames each, 0 repeated, spacing 20 ms.
- **Town start:** the middle layer's first copy is town-shops (`lead`, marked placeholder), cross-faded into the fields.

## Proof
RIDE-02 to 05 machine PASS, RIDE-06 panels (`s09-ride-r3`). Matrix `s09-ride-matrix4`: fair and miss at 8 sizes, 16 pages end, 0 breaks. Unit tests 20/20.

## Requests
- RIDE-01 spec: at most 12 frames (e.g. `12x800`).
- `catalog.mjs`: `FAIR_MOMENTS["day-window"]` = `life:ride-*`.
- Move the injected CSS to `css/day.css`; re-cut far-hills with plain outer tenths.
