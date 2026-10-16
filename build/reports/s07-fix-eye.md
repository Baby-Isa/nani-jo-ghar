# s07 fix: the eye chart's next row takes the same pill at once

## Cause

The game was at fault, not the probe. The shared button kit guards every press against double taps: `js/shared/buttons.js:76-78` (`wire`) ignores a second click on the same button for 400 ms. The answer pills kept that guard into the next question. In the eye test the probe tapped "haa" for one row. The next row ("dungri, limu") came up 80 ms later, because fast mode shortens the 700 ms pause. Its "haa" taps 150 and 276 ms later were dropped with no act. The sprint's new draws gave two "haa" rows in a row, and that exposed it. In real play the pause hides the pills for longer than the guard, so a child never met it, but the guard was scoped wrongly.

## Fix

The shared pills get `row.fresh()`, which clears the guard. The eye game calls it each time it puts the pills up for a new row (`showJudge`). Mechanics, art and words are unchanged. I added the missing `clinic:heal-eye@L4` sandbox flow.

## Proof

Red: the repro broke contract-21. Green: the repro passes. Eye L1-L4 and fever at 800x360 and 1366x768 (10 pages) show 0 contract breaks and 0 findings. The unit, static and leak checks pass.
