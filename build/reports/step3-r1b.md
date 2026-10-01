# Step 3, R1b "No gaps in the checks"

Branch `ccr-fcd9dddd-wnywzc`. No live page, mode, data or lab file changed. Measured on game commit 37c0096 (before R3a): its fixes will show as "fixed". Commands: `build/sandbox/README.md`.

## Coverage now
211 flows, 480 pages, 479 reach their end.
- **Levels:** every Cook station and the chai and chaat recipes at 1-4; clinic stages 1-3 (the waiting room 1-5, the only stage with 4 and 5); heal games 1-3; One patient 1-3.
- **Paths:** fair 129 flows, **#mistake 42, #hint 40** (wrong-answer feedback, bulb flip, peek, idle glow, end cards: all in the sheets).
- **Also:** story days 1-6, shop, open kitchen, other recipes, Cook parts, heal games tummy/hic/hair, a smoke flow per parked mode, the upright phone (ten pages), static CSS lint.
- **Sizes:** eight, three tablets added, touch emulated (canvas gestures are real touch events). Main flows run at all eight; deeper paths at 800x360 or 1024x768, alternating (all at all is about 6 h).
- **New checks, each with a fixture test:** `covered`, `covers-play-area`, `word-broken`, `spacing-grid`, and canvas text via Phaser's scene graph (the fixture catches a small, a scaled and a cut-off text). Sound hook with family-ok/unchecked/redo, tts, other, device-voice, silent.

## Not covered
- `cook:samosa@L3` at 1024x768 stops: the third fold's swipe never registers (mouse or touch; fine at 800x360). In the baseline as incomplete; not diagnosed.
- Mistakes go wrong and carry on; an explicit take-back is not driven. Parked modes: first mini-game, fair only. The clinic runs quiet: "silent" there means no family clip.

## Badge finding
Not missing or cut off: **mid-animation**. The hints badge pops in last, about 2.2 s after the card opens; the shot was at 1.8 s. The sandbox now waits; all three badges fit at 844x390 and 800x360.

## Sound
380 lines heard, **295 with no family clip** (141 computer voice, 157 silent, 4 older files, 1 device voice): `sound.json` and `summary.md` of each run.

## Baseline
2,054 to 6,600 findings, no existing entry changed. Appended by check: tap-small 2,186, text-small 1,400, spacing-grid 468, canvas-text-small 120, text-clipped 78, text-offscreen 78, scroll-container 74, tap-offscreen 74, covered 16, covers-play-area 6, ellipsis 4. Stability: 32 pages re-run, 0 new on 16 and 3 new on 16 (day and open-kitchen flows vary; those variants are now in).

## Time
Full gate: about 1 h 50 min of browser time (344 page-minutes, 3-4 at once, 8 chunks). `--all` now means everything: sessions use `--touched`.
