# s20-b2-roll-tawa: roll-tawa joins the kitchen frame (15 Nov)

Files: `roll-tawa.js`, `roll-tawa.json` (`band: "tray"`), `kitchen-frame.md` (who calls it, the count). No frame option added; `frame.js` untouched.

## What changed
Roll-tawa (the lab's two-zone proof) now reads only its play area, as maani does. `Cook.Frame.area({top, far, draw})` and the stone tray; the board and the hob are `area.row`'s two stations (equal shares, `max` the tawa's old size, 363). Each mechanic's zone is fitted to its station: its design px times the station's unit. Each zone owns the pointer on its side of the gap's middle. Deleted: the sheet regions `[0,0,800,900]` / `[800,0,800,900]`, both footprints, the fixed spots and the wood backdrop crop. Roll and tawa mechanics untouched.

## What a child sees (all levels, every size)
- Marble worktop with the frame's wash, as maani; the left half's wood panel is gone.
- The board and the hob sit side by side, centred in the worktop (CHAI-89's measure). The tawa is never bigger than before. The board is the tawa's size: at most 363, was 409. On phones both shrink with the play area.
- L1: a one-burner hob, flames lit. From tawa level 2 (lab L2, L3): a two-burner hob with two full-size tawas (they were 0.7 on the painted plate).
- The spare dough (left), the rolled maani waiting, and the plate (under the hob) lie on the stone tray.
- The turner rests beside the hob. Where the view has no room (two burners on a phone), it lies on the tray under the hob's right end.

## Calls taken while Zafar was away
1. **The board on marble, no wood panel** (maani's look). Other: a wood panel behind the board's station.
2. **The knob is drawn but not turnable** (the old painted hob's knobs weren't either; the tawa mechanic has no heat). Other: maani's working knob, a mechanic change.
3. **Two tawas full size on a two-burner hob.** Other: the old 0.7 size.

## Rows
No row in `regressions.md` names roll-tawa (0 'waits for the frame' rows; the brief lists none).

| Row | State | Proof or reason |
|---|---|---|
| (none) | — | `grep -niE "roll-tawa" docs/process/regressions.md`: 0 |

## For the orchestrator (not my files)
- **contract-112 (blocking) at the lab's order pop-up, L2+ on phones:** the eye-covered picture's light reads "not one box" (81% lit; at 930x430, "corners too round"). It fires before the station opens. The base f794015 (old roll-tawa code) breaks the same at L2 740x320 (run `rt-base-l2`). Kit: `ui.js` word pop, `.wp-eye`. The gate plays roll-tawa at L1 only, so it passes.
- Advisory, mechanics' or kit's: contract-120 (`tawa.js`/`roll.js` sprites without the kit shadow), -114 (`tawa.js` plate shrinks the chapati), -113 (the tally's pill under the side cog), -119 (the dish card at L1).

## Proof
PROOF_PLACEHOLDER
