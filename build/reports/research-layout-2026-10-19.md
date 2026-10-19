# Layout review: sekelo grill stage and the eye-test chart

Screenshots (1366x768, via `__cook.lab("grill")` on cook.html and `__heal.run.controller.debug.next()` on the heal host):
- /tmp/claude-0/-home-user/1b81caf2-a2ea-5762-a247-00bd8811bfec/scratchpad/layout/grill-L1-a.png
- /tmp/claude-0/-home-user/1b81caf2-a2ea-5762-a247-00bd8811bfec/scratchpad/layout/grill-L3-a.png
- /tmp/claude-0/-home-user/1b81caf2-a2ea-5762-a247-00bd8811bfec/scratchpad/layout/eye-L3-A-chart.png (split screen)
- /tmp/claude-0/-home-user/1b81caf2-a2ea-5762-a247-00bd8811bfec/scratchpad/layout/eye-L3-B-judged.png (easel)
- /tmp/claude-0/-home-user/1b81caf2-a2ea-5762-a247-00bd8811bfec/scratchpad/layout/eye-L4-A-judged.png

## Task 1: the sekelo grill

**Conclusion.** Zafar's instinct is right: the stage is a 1600x900 box and the scene is a 1420x350 strip across its middle (design y 250-595; 250 px empty above, 305 below). A line of three can't grow (480 + 582 + 282 + gaps = 1600), so stacking the left side is the only way to make the barbecue bigger. Recommend his two-rack stack with the grill 1.4x; the square tray only if he wants the cooked row to read as "serving", and then rotated (its skewers are drawn horizontal, handles right; rack and grill skewers are vertical, handles toward the child).

**Why it feels off (grill-L1-a.png):**
1. Three shapes, three materials, three skewer directions: portrait wooden rack (skewers up), landscape dark-steel grill (skewers across the bars), bright chrome oval (skewers fanned). Nothing repeats, so nothing feels designed.
2. The padding really is unequal. The rack's wood ends 54 design px before the grill's left handle; the plate's rim sits 12 px from the right handle (its shadow touches it). Measured in LAYOUT3: rack art box x 60-540, grill 569-1151 (handles) / ~600-1120 (body), plate rim 1199-1481.
3. No focal point: the grill is the job but is shorter than the rack (310 vs 378) and only twice the plate's width; all three weigh the same on one line.
4. Use of space: 38% of the stage's height carries everything and nothing anchors the strip, so the marble reads as void, not breathing room.
5. The chrome plate is the brightest thing on screen against a matte cast-iron grill; the eye goes to the empty plate first.

**Options (all with the skewer kept at BAMBOO 262 on every surface, as the code requires):**

| | Layout | Fit | Verdict |
|---|---|---|---|
| A | Current line, plate swapped for the square tray, gaps equalised | widths already full; scene can't grow | fixes 2 and 5 only |
| B | Zafar's stack, tray as the cooked row | tray at the rack's 94 px skewer pitch would be ~456 square: 378 + 456 > 900. Works only with cooked chunks at 0.75 (tray ~340 square), composed from tray-0 + sk3-stick as plate3 does, and rotated 90 deg so handles hang down. Column widths mismatch (480 over 340) | good semantics ("done, to serve"), three materials, more code |
| **D** | **Zafar's stack, two racks (same rack art), grill 1.4x** | 378 + 57 + 378 = 813 of 900; rack3 and rack-n pictures exist | **tidiest: two materials, one skewer direction, one pitch, no new composition code** |

The grill can grow without changing the skewer: at G3H = 434 bar 1 is at 105, the bamboo ends at 367, the handle at 452: pieces between the bars (bar 2 at 284), handle 18 px past the front edge. Beyond ~1.45x the handle would rest inside the grill.

**Recommended layout D, design px (1600x900):**
```
   x: 0     80        560   700                1515   1600
y 60    +---------+          +----------------------+
        | RAW rack|          |                      |
        | 480x378 |          |      GRILL 1.4x      |
y 440   +---------+   140    |      815 x 434       |
y 497   +---------+   gutter |  centre (1105, 450)  |
        |COOKED   |          |                      |
        | rack    |          |                      |
y 875   +---------+          +----------------------+
            centre x 320         y 233 - 667
```
- Raw rack: SK.rack3 at centre (320, 250), scale as now (0.956) -> box 80-560 x 61-439.
- Cooked rack: same art at centre (320, 655) -> box 80-560 x 466-844; `set(n)` counts cooked skewers; pieces grilled/charred.
- Grill: sk3-grill at G3H 434 -> w 815, centre (1105, 450); `skewerY` so a skewer's tip sits just under bar 1 (y ~ 338); RING unchanged.
- Gutters: 80 left, 140 rack-to-grill, 85 right; 57 between racks. The left column (480x783) and the grill (815x434) carry similar mass; the grill is the biggest single object.
- Tap flow: raw rack -> grill -> cooked rack; the cooked rack's skewers are not tappable (Done is the shared button). Chips (CHIPS at 1410,560) would collide with the grill: drop or move to (1450, 790).
- If he prefers option B: tray centre (320, 690), tray-0 scaled to 340 square, rotated 90 deg clockwise, cooked chunks at 0.75, handles hanging 45 px below the tray; everything else as D.

## Task 2: the eye-test chart

**Conclusion.** Keep the 1-2-3-4 ladder (it is Snellen's own top four rows); make the rows shrink by 0.8 each (the logMAR step), space pictures 1.5 widths apart, let the row gaps shrink with the rows so the chart is a triangle, and draw nothing else: no eye, no ruled lines, no row outlines. The new board picture carries the frame.

**What real charts do:**
- Snellen: rows of 1, 2, 3, 4, 5, 6, 7, 8 letters, each smaller; nothing else on the board but tiny side numbers; wide margins.
- Bailey-Lovie / ETDRS (the modern standard): 5 optotypes per row, every row 0.8x the one above (0.1 logMAR), letter gap = one letter width, row gap = the next row's height. A clean triangle whose spacing tightens as the letters shrink.
- Children's: LEA Symbols (apple, house, circle, square; 5 per line), HOTV (4 letters), Kay Pictures (8 pictures). Few, very distinct shapes; a "crowded" version boxes a row for crowding, not decoration.

**Current vs. real (eye-L3-A-chart.png):** an eye icon takes the top 58 units; ruled lines; rows 84/60/44/32 units spaced evenly whatever their size; pictures at a 1.12 pitch (nearly touching); stroked bands and outlines. It reads as a form, not a chart.

**Recommendation, as fractions of the board's white area (W x H; the picture's white is x 0.149-0.834, y 0.104-0.779 of ec1, 701x1038 px, W = 0.675 H):**

| row | pictures | size s (of H) | centre y (of H) | pitch | span (of W) |
|---|---|---|---|---|---|
| 1 | 1 | 0.200 | 0.19 | - | 0.30 |
| 2 | 2 | 0.160 | 0.45 | 1.5 s | 0.59 |
| 3 | 3 | 0.128 | 0.66 | 1.5 s | 0.76 |
| 4 | 4 | 0.102 | 0.82 | 1.5 s | 0.83 |

Top margin 0.09 H, bottom 0.125 H, side margins >= 0.085 W; rows centred on x = 0.5 W; the gap under a row is half the next row's height (0.08, 0.064, 0.051). On the A layout (board 238x352 units) that is s1 = 70, s4 = 36 units: 97 px and 50 px on this screen; the smallest picture is the floor, do not go below s4 = 0.1 H. A 3-row chart (L1's 1-1-2 if kept) uses rows 1-3 of the same ladder shifted down 0.06 H.

- Nothing drawn but the pictures: no eye, no lines, no row outlines.
- "Now": a soft pale-amber band (fill only, no stroke) the row's height + 0.03 H, from 0.05 W to 0.95 W, rounded. Judged: the gold tick in the side margin at x = 0.93 W, level with the row's centre, not over the pictures; the gold outline goes.
- Placement, layout A (viewBox 800x500): picture at x 430, y -36, w 347, h 521 (top 36 units crop) -> board at x 482-720, y 18-370; the skirting shows at y ~445 under it. Fill the right panel edge to edge: the wall is cool blue-grey and would clash as a tile on the cream ground. Layout B's easel is superseded (a wall board has no legs).
- Question for Zafar (K.per is game data, non-negotiable 2): draw the fixed 1-2-3-4 chart at every level and let the level decide which rows are read (L1 rows 1-2, L2-L3 rows 1-3, L4 all four)? Recommend yes: a chart that changes shape by level never looks like one; L1 then judges 1+2 pictures instead of 1+1+2.

Sources: [LogMAR chart](https://en.wikipedia.org/wiki/LogMAR_chart), [Prevent Blindness chart design](https://advocacy.preventblindness.org/wp-content/uploads/sites/23/2020/04/vision_tips_appropriate_eye_chart_design.pdf), [LEA Symbols](https://store.good-lite.com/products/250411), [LEA 5 per row](https://www.schoolhealth.com/lea-symbolsr-lea-numbersr-charts-for-insta-line-led-illuminated-cabinets), [Snellen (LITFL)](https://litfl.com/snellen-chart/).
