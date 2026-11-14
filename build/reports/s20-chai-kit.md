# s20-chai-kit: the shared light, shelf and tally (Zafar's notes on chai's pictures, 14 Nov)

Branch `s20-chai-kit`, not pushed; only the six owned files.

## What changed (what a child sees; which games)
- **SH-292, the light centred.** Cause `onboard.js:312-318`: only the side facing a neighbour was trimmed. Fix: `litBox`'s `even` (every drawn light) trims the opposite side to match. Not at the screen's edge (orchestrator, 14 Nov). Chai's paani at L1 740x320: 8 px left / 3 px right before, 3 / 3 now. Every game's lights.
- **SH-293, the shelf taller.** Cause `shelf.js` classFit: its top kept a 17 px gap under the band's edge. Fix: `Shelf.classTop()`, the band's top (hop and glow still inside), via `St.classFit` and the DOM shelf: every class +10.2% (L 156 to 172 design px; paani 54 to 60 px at 740x320, 74 to 82 at 930x430). `Shelf.slots`: short of room, the group gaps close first (to 0), then the slots narrow. Chai, eggs, baking, daar.
- **SH-294, the tally** (Zafar's design, 14 Nov). Pills 20% bigger (`--njg-tally-k` 1.2: 32 to 38 px tall, picture 24 to 29 px, count 17 to 20 px). Laid above the stove (`Tally.row`, `Tally.room` from `Cook.Kit.hob`'s burners): the first centred over the selected pan, the rest alternately right and left inside the stove's width, a second row where it fits, past the stove only when needed (L1); never over the cog. They fade when cleared. ART-81's pictures swap in one place, `Tally.PIC`. Chai already shows only the selected pan's pills; the half pour hiding them is chai's `:1342` (asked of s20-chai-fix). Size: every tally; placing: a tally on a Kit hob (chai).

## Proof
- `checks.mjs` 13/14; unit 967 pass, 1 fail: `test_shared_shelf.mjs` "slots ... (as the reference shelf)" pins the old rule (PILL_ROOM 100, span 300-1300: gapW 44 now 0, slotW 91.2 now 100); the orchestrator rewrites it.
- Gate (`gate.mjs --game chai-tray`, 27.6 min): FAIL. Checks: the test above. Contract (21.7 min), 4 blocking: contract-112 x2, paani's mirrored left 3 px "wants 8" (light [236,222,294,320] round [239,236,290,317]: 3 left, 4 right), the check's pad rule against SH-292; contract-83 and -102 once each at 740x320, gone on replay. Boxes (3.8 min): 0/8 identical, by design: the shelf boxes 10% taller, `light-1`, the tally (L4 740x320 [232,20,292,52] now [270,13,341,52], centred on its pan).
- Rules: 9/10; pill-clear's 3.8 and 4.3 px are the sprint file's parked fault.
- Finish run, 4 flows x 4 sizes: `CONTRACT FAILED: 16 breaks (contract-92 2, contract-119 4, contract-104 4, contract-128 4, contract-11 1, contract-109 1)`. Mine: contract-92 (advisory, paani's 3 px). Every eggs and baking break replays on the base code (740x320, 1920x1080): no new break. It stands for the brief's eggs and baking run.
- No before folder (the rows have no probes; `evidence.mjs --after` refused).
- Tier 2 (`check-change.mjs`): see the last line.

## Open
The judge on SH-292/-293/-294; ART-81 waits on art; the slots test and the pad rule (contract-112, -92) are the orchestrator's.
