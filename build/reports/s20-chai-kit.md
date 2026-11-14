# s20-chai-kit: the shared light, shelf and tally

Branch `s20-chai-kit`, not pushed; the six owned files only.

## What changed
- **SH-292, the light centred.** Cause `onboard.js:312-318`: only the side facing a neighbour was trimmed. Fix: `litBox`'s `even` trims the opposite side to match (not at the screen's edge, orchestrator 14 Nov). Chai's paani at L1 740x320: 8 px left / 3 px right before, 3 / 3 now. Every game's lights.
- **SH-293, the shelf taller.** Cause `shelf.js` classFit: its top kept a 17 px gap under the band's edge. Fix: `Shelf.classTop()`, the band's top (hop and glow still inside), via `St.classFit` and the DOM shelf: every class +10.2% (paani 54 to 60 px at 740x320, 74 to 82 at 930x430). `Shelf.slots`: short of room, the group gaps close first (to 0), then the slots narrow. Chai, eggs, baking, daar.
- **SH-294, the tally** (Zafar's design, 14 Nov). Pills 20% bigger (32 to 38 px tall, picture 24 to 29, count 17 to 20). Laid above the stove (`Tally.row`; `Tally.room` from `Cook.Kit.hob`'s burners): the first centred over the selected pan, the rest alternately right and left within the stove's width, two rows where they fit, past the stove only when needed (L1), never over the cog; they fade as they clear. ART-81's pictures swap in one place, `Tally.PIC`. Only the selected pan's pills show (chai's own calls); the half pour hiding them is chai's `:1342` (asked of s20-chai-fix). Size: every tally; placing: chai.

## Proof
- `checks.mjs` 13/14; unit 967 pass, 1 fail: `test_shared_shelf.mjs` "slots ... (as the reference shelf)" pins the old rule (PILL_ROOM 100, span 300-1300: gapW 44 now 0, slotW 91.2 now 100); the orchestrator rewrites it.
- Gate (`gate.mjs --game chai-tray`, 27.6 min): FAIL. Contract (21.7 min), 4 blocking: contract-112 x2, paani's mirrored left 3 px "wants 8" (light [236,222,294,320], thing [239,236,290,317]), the check's pad rule against SH-292; contract-83 and -102 once each at 740x320, gone on replay. Boxes (3.8 min): 0/8 identical, by design: the shelf 10% taller, `light-1`, the tally (L4 740x320 [232,20,292,52] now [270,13,341,52]).
- Rules 9/10: pill-clear is the sprint file's parked fault.
- Finish run, 4 flows x 4 sizes: `CONTRACT FAILED: 16 breaks (contract-92 2, contract-119 4, contract-104 4, contract-128 4, contract-11 1, contract-109 1)`. Mine: contract-92 (advisory, the 3 px). Eggs and baking (the brief's run included): every break replays on the base: none new.
- No before folder: the rows have no probes (`evidence.mjs --after` refused).
- Tier 2 (`check-change.mjs --base f3eca7f3a`): FAIL on the test above; play (69 min, 74 pages): mine only contract-92 x18, -112 x2 (the pad rule); the rest repeat on the base or not on replay. Stopped before its base replay; its blocking parts run alone: teachgate, loadtime, leak, panelcheck, word-card taps pass; mount fails alike on the base; vessel-meta lacks a sparse-checkout picture.

## Open
The judge on SH-292/-293/-294; ART-81 waits on art; the slots test and the pad rule (contract-112, -92) are the orchestrator's.
