# s20-p5-rules: the geometry rules (13 Nov)

Branch `s20-p5-rules`, never pushed. No game file changed; nothing a child sees changed.

## What changed
- `build/sandbox/lib/geometry.mjs` (+ `geometry.test.mjs`, 15 tests): ten rules on the boxes read at every moment and size: **overlap, frame-apart, on-screen, text-whole, light, tap-size, frame-slots, headline, pill-clear, panel-holds**. Each fault says what, where and by how much.
- `boxes.mjs --game <g> --rules` plays (or `--from <run>` re-judges a played one) and prints pass/fail per rule with the minutes; `--prove-plants` runs each planted fault through its own rule. Chai, eggs and maani-line have specs (eggs and maani read one-off: no reference written).
- `lib/boxes.mjs` reads more, in `read.extra` only (taps with their real touch boxes incl. the shelf's reach, pills, faces, fitted text, the shared tray's slab). The reference's `boxes` and `texts` are untouched; `diffRead` ignores `extra`, and the stand's "same" signature leaves it out. `boxes-play.mjs`: four more planted faults.
- For the orchestrator: add `build/sandbox/lib/geometry.test.mjs` to `checks.mjs` unitFiles and a line for `--rules` in `docs/tools.md` (both outside my files).

## Proof
| Rule | Fault it caught | Chai (L1, L4 x 4 sizes) |
|---|---|---|
| overlap | planted card over a face: `card-1/item-1 overlaps card-1/item-2 by 38.1 x 105 px` | pass 48/48 |
| frame-apart | side panel 8 px into the play area | pass |
| on-screen | tray 867 px past the right edge | pass |
| text-whole | cut word (Nani's line); **SH-277 eggs:** headline 3 lines at 740x320 (end, L1/L3/L4) | **FAIL**: L4 end, 740 and 930, headline 3 lines |
| light | light 20 px off: `17.5 px across (most 7.9)` | pass |
| tap-size | real: chai's own taps (below) | **FAIL** |
| frame-slots | unit tests (side 4 px, bottom 7 px); real: maani's slab inset 9.7 px vs chai's band | pass (chai is the standard) |
| headline | **SH-277 eggs:** 17.5 / 15.5 / 19 px, 1 to 2 to 3 lines | **FAIL**: L4 at 1280 sizes 18.5 / 16.5 / 19 px; 3 lines at 740, 930 |
| pill-clear | **CK-112 on the code before its fix** (064182e2e^): `pill touches board: 4.7 px` at 740x320; planted pill on the hob | pass (no word pop at a hold) |
| panel-holds | Nani's box 60 px wider than the panel | pass |

Planted faults: 7/7 caught by their own rule (`--prove-plants`, 3.7 minutes). The 4 px move breaks no rule (only the reference diff sees it).

**CK-112 is fixed in the base** (064182e2e: pill 13 px clear, passes at all levels). Its row still reads open; the rule proves itself on the old code (`NJG_GAME_ROOT`). **SH-277 reproduces today** in eggs.

## Chai fails (for you; none loosened)
- **tap-size at 740x320 and 930x430:** word-card speaker 29.8 px, Nani's arrow 31.7, the family badges 20.6 (28.2 at 930; 37.4 at 1280), knob zones 41, jars 47 wide (1 px short); the dots under the word cards, 15 px tall at 1280 L4. Pictures: `build/screenshots/boxes/p5-chai-final3/chai-tray/L1@740x320/mid.jpg`, `L1@740x320/light.jpg`.
- **headline/text-whole:** `.../L4@740x320/end.png`, `L4@930x430/end.png` (3 lines), and the sizes at L4@1280x665.
- Not read yet: chai's tally chip ("hakro") sits 3-9 px over the hob box by design; left out of pill-clear.

## Minutes and checks
Chai rules 3.7, eggs 4.4, maani 3.1 (L1-L4, two sizes). Eggs/maani rule fails (tap-size, headline, text-whole, maani's slab slot) are their own rows' business.
- After folder: the brief has no rows, so no before/after.
- Contract (`s20-p5-rules-contract`): chai 107/110, eggs 106/110, maani 105/110; "CONTRACT FAILED: 1 breaks (contract-114 1)": maani L1 930x430, `mv-cooked-maani` 75 px against 131 px at the serve. It is the game's, not this branch's: the sandbox never loads boxes or geometry code.
- `checks.mjs`: 14 steps ok. check-change: see its result file below.
