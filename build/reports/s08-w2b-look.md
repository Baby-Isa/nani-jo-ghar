# s08-w2b-look

Branch `worktree-agent-af35ffacecd1765c0` (from `claude/new-session-b5r2am` c5bbcfd3), not pushed. Builder's report, not judged.

## Flaws first

| # | Flaw |
|---|---|
| 1 | SH-112 on phones: the tool picture grows only to about 50x65 (was 46x60). At 800x360 four tools must stand in one column between her face circle and the foot of the screen, clear of the boing's machine (two columns covered its levers: seen, fixed). Doubling on phones needs another layout (a bottom tray?): Zafar's call. Laptop and tablet: 84x109 (1.8x). |
| 2 | SH-106: the clinic's go-on sits in `.cl-actions` (right 2%, bottom 3%), Cook's at 2.5% / 5%: a few px apart; those `css/clinic.css` lines are not mine. The heal games' step-closing ✓ (ear, knee, cut) stays the ✓; only the eye's chart button and the stage buttons are go-on buttons (the games' files are not mine). |
| 3 | SH-117 daal: the scene is top-down, so the bowl's tip reads as a lift and a slight narrowing; the stream, splash and fill carry it. The splash ring is bright on the daal. |
| 4 | Tidy-up: `glowDraw()` is NOT dead (`glow()` draws through it; station-lib wraps `glow()`); only `step()` was deleted. |
| 5 | Browser time about 15 min, 7 of them a hang of my own shot script. Not run: the touched sandbox command (86 flows), shotdiff, evidence probes, the counter shots, the full load check. |
| 6 | Outside the owned list: the contract check (`build/sandbox/lib/contract*.mjs`, tests), the two go-on pictures in `data/cook.json` station files. `js/shared/pour.js` loads unstamped until the next version bump. |
| 7 | Task 4: no change. The master is already drawn 1:1 with its occluder (s07-cook); CK-44 judged PASS 16 Oct (`ev-20261016-194922-b8t`); ART-21's tap is art. |

## What changed

| Task | Change |
|---|---|
| SH-106 | `js/shared/buttons.js`: the go-on button always draws the arrow, has a picture slot (`NjgButtons.pic`), a quarter taller than the ✓; sekelo and samosa use go-grill-s08b and go-karahi-s08b |
| SH-112 | `css/clinic.css` tool strip, `js/clinic/heal/scene.js`: one token-sized box, columns fitted to it, hung under her face |
| SH-117 | new `js/shared/pour.js` (plan, stream, Phaser and SVG drawers); the daal, the taste glass and Cook.Pour's stream use it |
| Tidy | `stations.js` `step()` deleted |

## Proof

| Check | Result |
|---|---|
| contract-27 red | `w2b-red`: 2 breaks, sekelo's `#go-btn` has no arrow |
| contract-27 green | `w2b-green` (sekelo, samosa): 0 breaks |
| `checks.mjs` (all but load) | unit 367 pass after the count fix; words, static, leak, bump, specs, docs, size ok |
| load check | mishkaki-grill, samosa, daar, taste: ok |
| Shots | `build/reports/s08-w2b-look/`: go-on buttons, tool strips (800x360, 1366x768), daal and taste filmstrips |
