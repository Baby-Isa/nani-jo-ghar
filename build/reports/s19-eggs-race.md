# Eggs: the egg stuck on the shelf (s19 night, fast taps)

**Found:** eggs L4, 1280x665, 70.5 s. The egg box and the pot were tapped 30 ms apart. The egg sat on the shelf with the "lift" light on it,; every tap missed it for 200+ s.

**Cause** (js/cook/stations/eggs.js, before the fix): the egg box's tap starts a lift tween on the raw egg (line 714). `putIn` (lines 719-732) flew the same sprite and never stopped that tween. When `S.fly`'s fallback timer ends the flight first (a long frame), the lift tween writes the bowl's y after the landing. The bob (line 751) then starts from that y, so the egg swings between the shelf and its slot, away from its light.

**Fix:** `putIn` stops the egg's tweens before its flight. After landing, it stops them again and sets the egg on `egg.at`. A second contract-117 (already in the night run): with a raw egg in the hand, `nextThing` asked for a ripe egg to be lifted, but a tap there puts the held egg in. Now the egg in the hand goes first into the vessel of the first plate whose kind still needs one; an extra egg works as before. No mechanic or help was removed.

## Proof
- **Reproduced** with a Playwright script sending the egg-box and pot taps 20 ms apart. Before the fix, eggs sat at y 351-670 instead of their slots (46-203) in 3 of 4 runs. After it, every egg was in its slot in 3 of 3 runs.
- **Sandbox** `--contract`, eggs L1-L4 at 740x320 and 1280x665 (`eggs-race-after`): 8/8 flows reached their end, 0 page errors, **0 contract-117**. Left: contract-37 and contract-70 (already in the night run) and one contract-78 timing break that moves between runs.
- `checks.mjs`: all ok.
