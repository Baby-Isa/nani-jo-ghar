# Step 3, R3a "Shared frame and kit, built to scale"

Branch `ccr-fcd9dddd-wnywzc`. No mechanic changed; Cook and the clinic run their own code through thin hook-ups in `cook.html` / `clinic.html`.

## What changed
- **One scale** (`data/layout.json`, `js/shared/frame.js`): phone / tablet / laptop from the viewport, one scale (tablets 1.15–1.4), every size token written on `<html>`; text never under 14 px (at-floor text is 14.5 px so rounding can't take it under), taps never under 48 px. `css/shared/tokens.css` is the one place for colours, type, 8-pt spacing, radii, shadow; its fallback is tested equal to the data. **No px left in `css/shared/**`.**
- **The frame**: sidebar width from data (laptop 19 % as before, tablets 25 %), safe areas, the one wordless turn-your-phone card (Cook's English one removed, E1).
- **The stage** (`js/shared/stage.js`): one mapping for scenes (safe area, cover/fit, item scale per form factor). Unit tests prove it equals Cook's Phaser EXPAND and the clinic's `fitScene` exactly; both pages now use it. `Stage.art()` picks @2x through `njgV`.
- **fit.js**: shrink to the floor, then wrap at the largest two-line size; never an ellipsis. The 7 ellipsis rules and every sub-14 px floor are gone.
- **Kit**: guide box per the approved mock-up (face and tools on top, line underneath, 48 px taps, its own face/badge styles); `bulb.js`, `tally.js`, `focus.js` with shims behind Cook's `UI.bulb` and the clinic's `Kit.Bulb`/`Kit.Tally`; order card on tokens, rows grow instead of clipping, 48 px face, **pill flow** (`card.rows` per form factor, default stacked); end screen on tokens, review words wrap, end actions are pictures (E1), a word with no Kutchi shows its flagged placeholder. State sheet: `lab/kit.html` (`?part=results`, `?part=words`).

## Checks
- Unit: shared 132, frame 9, stage 6, browser frame test 4 (one number in layout.json resizes Cook's sidebar on reload). All pass.
- CSS lint: 470 → 421 (`css/shared` 48 → 0).
- Sandbox: RESULT_LINE

## Regression rows
SH-01 fixed (review word wraps). SH-09 fixed (rows wrap, never cut). SH-27 fixed (guide tools, rail, faces 48 px). PAN-01 fixed (headline shrinks then wraps; ring inset). FL-02 fixed (corner home sits in the dock on framed pages). SH-24, SH-29, SH-30, SH-36, SH-37 rechecked OK. SH-28 open: the shelf chips are Phaser canvas text (R4).

## Tablets
Before/after: `build/screenshots/r3a/pairs/` (left before, right after), kit sheets `build/screenshots/r3a/after/kit__*.png`. Sidebar and all its UI 15–40 % bigger, no letterbox. **Play items do not grow yet:** Cook's shelf chips reach both edges of the 16:9 box, so its safe area is the whole box; R4 must lay stations out for 4:3, then narrow `stage.scenes.cook.safe` and the stage grows them (tested up to `itemScale` 1.25).

## Art for tablets (@2x or more bleed)
All backgrounds (Cook 1600×900, clinic 1536×1024): drawn up to ~3600 device px on an iPad Pro; need @2x and 4:3 bleed (Cook's cover-fit stretches 16:9 art ~1.8× on a square stage). Characters (~400 px): @2x. Props (≤480 px), badges, results art: fine.

## Left
- `bump_version.py`: stamp `css/shared/tokens.css` (imported by `app.css`), map the new shared files.
- The sandbox lint reads 14 px text at a fractional width as 13.9 px.
