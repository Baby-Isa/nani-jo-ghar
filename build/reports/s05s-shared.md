# S05-S: the shared layer (draft, filled in as groups land)

## S1 voice after a stop (SH-66, SH-64): what C, D and T need now

Red run `ev-20261012-2108`. The one voice layer stops every channel: **contract-3 has 0 breaks** on the pantry and the clinic patient. What the `silentAfter` expect still counts is not voice carrying over:

- **Cook (C):** after the station's `stage-end` the chef's call-back ("Dudh. Ne daar. Ne khun.") and *Shabash* start (decision 54, a mechanic Zafar asked for; not silenced). Fix in `js/cook`: say the call-back and Shabash **before** the station's `Lifecycle.stageEnd` (`station-lib.js end()`), or call `Lifecycle.stageStart("cook:closing")` just before them so they are their own beat.
- **Clinic (D, and T):** `laal.mp3` at 0.5 s and 3.5 s is the *next* stage's own pop-up and play (the heal game's "ne poi laal plaster"). The shared host now logs `stage-start` for every host stage (`js/shared/host.js`), so the clinic marks its starts too.
- **T (probe):** `silentAfter:<moment>` should end its window at the next `stage-start` or `request` after the moment (contract-3 already does this). SH-64 p1: `popup-fold` matched the page's first "popup closed" sample before the pop-up ever opened, and the `tap-through-popup` driver never tapped (no input before the fold in the timeline).
