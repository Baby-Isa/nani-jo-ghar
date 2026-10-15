# Feedback: Cook on a phone, 15 Oct

**Source:** Zafar's chat message and phone screenshot, 15 Oct: the live site (cc2b0e8b) on his phone in landscape, Cook's greeting at the counter, then the pantry and chai. 3 transcript lines, 3 points, 0 lines of chatter. Skeleton by `build/tools/ops/feedback.mjs`; causes checked in code and in a phone-size run (`build/screenshots/sandbox/zphone2/cook-day1/844x390/`).

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Every scene background, every game (Cook first) | One 1600×900 picture per scene, cover-fitted: on any stage that isn't 16:9 it is zoomed in about a fixed point and the overflow cropped (`js/cook/stations.js:146` `fitBg`) | One larger master picture per scene with the 1600×900 core in it; the stage shows more of the master instead of zooming (no mechanic changes) | P2 |
| Every game on a phone (pantry and chai first) | Stations lay out in the 1600×900 design box, anchored to the stage's bottom; on a phone the items are small and the stage keeps padding | A phone playability pass: the items bigger, taking space from the station's surroundings and the vertical padding (no mechanic changes; to be designed in its sprint) | P3 |

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| none | P1 replaces the kitchen picture (`assets/cook/bg/service-v2.webp`) | P1 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:01 | "The kitchen background has a strange duplication on the sides and if you notice the tap looks off with spout and and the handles, and through the door there's a plant on the floor which doesn't make sense." | Cook: the counter (greeting, every order) | not code: the painted kitchen itself, `assets/cook/bg/service-v2.webp` (art run s02 A1; wired by `data/cook.json` art.s02 "kitchen-trays", loaded at `js/cook/stations.js:84`). Its left edge is a garden window; through the arched door on the right is a second garden window with a shelf of pots, a stool and a plant on the floor, so the same view repeats on both sides. The tap is a spout with two loose handles at different heights, one standing apart on the worktop. `fitBg` (`js/cook/stations.js:146`) only scales and crops it: the phone-size run (844×390) shows no copying in code | Redraw the kitchen in the next art run, keeping the camera, the island and the three trays where they are (the trays' measured middles `art.s02.kitchen-trays.meta.trays` place the customers): one plain wall or a closed door on the right, no plant on the floor, a single-lever tap. Drawn as SH-91's master if he says yes to it |
| P2 | 0:02 | "Do we need several kitchen backgrounds for different sized screens or one very large upscaled upscaled image with all the core content in the middle and then stuff above and below to fill wider or taller screens?" | every background, Cook first | `js/cook/stations.js:165`: the service picture is cover-fitted about a pivot (800, 520); on his phone the stage is about 2.25:1, so it is zoomed about 1.27× and the top and bottom are cut; on a 4:3 tablet it is zoomed the other way and the sides are cut. The pantry carries its edge pixels on instead (`extendEdges`, `js/cook/stations.js:171`) | One master per scene (not one per screen): about 2100×1350, the 1600×900 core (people, counter, trays) in the middle and on the bottom, plain wall and ceiling above and plain kitchen to the sides. `fitBg` then draws the master 1:1 and shows as much as the stage has room for, with no zoom. Wider than about 2.3:1 or taller than about 1.2:1 falls back to today's cover fit. Several per-size pictures would multiply the art and drift apart. Upscaling today's picture only sharpens it (ART-05); it can't add the room around it, which has to be painted, and the kitchen needs redrawing anyway (P1) |
| P3 | 0:03 | "Also make a note we need to review playability on phones in a future sprint - the ingredients items need to be bigger and take take space from the pantry or the chai station in thosecgame modes which were the only ones I played, probably the rest as well as there's vertical padding." | every game on a phone (pantry and chai played) | `js/cook/stations.js:117`: stations lay out in the 1600×900 box, centred across and anchored to the bottom; the stage beside the sidebar on a landscape phone is about 644×390 CSS px, so the box is drawn at about 0.4 and the jars and glasses are small (the 844×390 pantry shot: jars about 60 px tall on a 390 px screen), with worktop or wall padding above | A future sprint: phone playability, every game at 844×390 and 800×360. Items bigger by taking space from the station's surroundings and the vertical padding. Not built now (he said "a future sprint") |

## 3. Regression rows (added to `docs/process/regressions.md` the same day)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| ART-21 | The kitchen background (`assets/cook/bg/service-v2.webp`): "a strange duplication on the sides" (a garden window on the left and a second through the door on the right), "the tap looks off with spout and the handles", "through the door there's a plant on the floor which doesn't make sense" | **waiting on art** (next art run; drawn as SH-91's master if Zafar says yes) | eye: 844×390 and 1366×768, the counter with the family | `docs/feedback/cook-phone-2026-10-15.md` P1 |
| SH-90 | "Review playability on phones in a future sprint - the ingredients items need to be bigger and take space from the pantry or the chai station ... probably the rest as well as there's vertical padding": a phone playability review of every game; known so far: items too small, and vertical padding the items should take | **open** (a future sprint; Zafar, 15 Oct) | eye: every game played through at 844×390 and 800×360 (the review) + auto: contract check every game (item size, and no unused vertical padding at 844×390) | `docs/feedback/cook-phone-2026-10-15.md` P3 |
| SH-91 | "Several kitchen backgrounds for different sized screens or one very large upscaled image with all the core content in the middle and then stuff above and below to fill wider or taller screens?": every scene's background, every game; recommended: one master per scene that the stage shows more of instead of zooming in (`fitBg`, `js/cook/stations.js:146`) | **waiting on Zafar** (the recommendation is one master per scene, redrawn rather than upscaled) | eye: every scene background (the counter, pantry, chai and every station, the clinic rooms, the other modes) at 844×390, 1366×768 and 1366×1024: nothing in the 1600×900 core zoomed or cut | `docs/feedback/cook-phone-2026-10-15.md` P2 |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:01 | P1 |
| 0:02 | P2 |
| 0:03 | P3 |

Lines: 3; in a point 3; chatter 0; unmapped 0.

Second reader (a fresh agent that read only the transcript and §3): 1 missing and 3 weakened on the first draft ("upscaled" dropped; the background question narrowed to the counter; the phone review narrowed to item size; the vertical padding not checked). All four fixed above: 0 unmapped, 0 weakened.

## 5. Old feedback coming back

None: no earlier row covers the kitchen picture's flaws, background fitting per screen, or a phone playability review (SH-27, SH-28, SH-47 and SH-65 were phone text and button sizes, all built).
