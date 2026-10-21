# The window ride

**Built (Sprint 9).** `js/shared/window-ride.js` with `js/day/window.js`; each trip's road is data in `data/day.json` (`window.rides`). Used by every trip's ride stage (`docs/game-design/days/`).

## What it is

The view from a car, bus, jeep or boat window: three looping layers (far, middle, near) behind the vehicle's window frame, joined end to end by a cross-fade, moving gently apart (far 0.5, middle 0.8, near 1: Zafar, 20 Oct). Things stand on two ground lines (the near verge, the field behind) or fly in the sky band, placed by code; props on the near line can half-hide them. Nani names a thing; the child taps it as it passes.

## Rules

- **Speed:** three speeds, never stopped; Nani says speed up and slow down and everything really rushes past or slows (Zafar, 20 Oct: "that's the fun of it"). A thing crosses the window in about 9, 6 and 3.5 s.
- **Fair at every speed:** asked only as it comes into view, never while leaving or fully hidden; a missed thing comes round until found.
- **The leak test:** look-alikes pass together and unasked things pass too, so tapping everything, waiting or guessing scores under 10% (`build/leak_window_ride.mjs`, every speed).
- **The motion follows real time** (`W.advance`), sub-pixel, so it never jerks; checked by a unit test.
- **Art:** each layer a loop from ChatGPT keyed on magenta; the window frame keyed on green; sprites from the trip's art run. A placeholder layer is marked in the data (the shops lead on the farm road).

## Rows

RIDE-01 to RIDE-07 (`docs/process/regressions.md`).
