# Feedback: Cook on a phone, 15 Oct

**Source:** Zafar's two chat messages and phone screenshots, 15 Oct: the live site (cc2b0e8b) on his phone in landscape (a stage about 2.25:1 beside the sidebar), Cook's greeting at the counter, then the pantry and chai. 5 transcript lines, 4 points, 0 lines of chatter. Skeleton by `build/tools/ops/feedback.mjs`; causes checked in code and in a phone-size run (`build/screenshots/sandbox/zphone2/cook-day1/844x390/`, a stage narrower than 16:9, which hides P1).

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| Every scene background, every game (Cook first) | One 1600×900 picture per scene, cover-fitted: on any stage that isn't 16:9 it is zoomed in about a fixed point and the overflow cropped (`js/cook/stations.js:146` `fitBg`) | One larger master picture per scene with the 1600×900 core in it, drawn 1:1; the stage shows more of the master instead of zooming (no mechanic changes) | P3 (and it removes P1's cause) |
| Every game on a phone (pantry and chai first) | Stations lay out in the 1600×900 design box, anchored to the stage's bottom; on a phone the items are small and the stage keeps padding | A phone playability review: items bigger, taking space from the station's surroundings and the vertical padding (no mechanic changes; designed in its sprint) | P4 |

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| none | P2 and P3 replace the kitchen picture (`assets/cook/bg/service-v2.webp`) with its master | P2, P3 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:01, 0:04 | "The kitchen background has a strange duplication on the sides" ... "This is the duplication, can you see the table has a sharp vertical line and then "starts again"?" | Cook: the counter (greeting, every order) on a stage wider than 16:9 | `js/cook/stations.js:682` `occluder()`: the counter's front (the picture from y 611 down) is drawn again over the family at 1:1 in the 1600×900 box, while the background behind it is zoomed about (800, 520) to cover a wide stage (`fitBg`, `js/cook/stations.js:165`; about 1.27× on his phone). Past x 0 and x 1600 the zoomed counter shows: a hard vertical edge, then the marble "starts again" a step lower. The served dish's tray fronts are cut the same 1:1 way (`trayFront`, `js/cook/flow.js:777`). A stage narrower than 16:9 crops the sides, so the 844×390 run never showed it | Properly: P3's master, drawn 1:1, so the background and the counter's front are one picture at one size. Until it lands, an interim code fix if Zafar wants one (his decision) |
| P2 | 0:01 | "if you notice the tap looks off with spout and and the handles, and through the door there's a plant on the floor which doesn't make sense." | Cook: the counter | not code: the painted kitchen `assets/cook/bg/service-v2.webp` (art run s02 A1): the tap is a spout with two loose handles at different heights, one standing apart on the worktop; through the arched door on the right a plant stands on the floor | Redraw in the next art run as the kitchen's master (P3), keeping the camera, the island and the three trays where they are (their measured middles `art.s02.kitchen-trays.meta.trays` place the customers): a tap that reads as one tap, no plant on the floor through the door |
| P3 | 0:02, 0:05 | "Do we need several kitchen backgrounds for different sized screens or one very large upscaled upscaled image with all the core content in the middle and then stuff above and below to fill wider or taller screens?" ... "Yes to everything else, chatgpt can redraw but you might need to upscale as well after" | every scene background, Cook first | `js/cook/stations.js:165`: the service picture is cover-fitted about a pivot (800, 520); on his phone it is zoomed about 1.27× and the top and bottom cut; on a 4:3 tablet the sides are cut. The pantry carries its edge pixels on instead (`extendEdges`, `js/cook/stations.js:171`) | **Agreed (Zafar, 15 Oct):** one master per scene, not one per screen size. About 2100×1350: the 1600×900 core (people, counter, trays) in the middle and on the bottom, wall and ceiling above, kitchen to the sides. ChatGPT redraws it in a run Zafar supervises, then it is upscaled to full size. `fitBg` then draws it 1:1 and shows as much as the stage has room for |
| P4 | 0:03, 0:05 | "Also make a note we need to review playability on phones in a future sprint - the ingredients items need to be bigger and take take space from the pantry or the chai station in thosecgame modes which were the only ones I played, probably the rest as well as there's vertical padding." ... "Yes to everything else" | every game on a phone (pantry and chai played) | `js/cook/stations.js:117`: stations lay out in the 1600×900 box, centred across and anchored to the bottom; the stage beside the sidebar on a landscape phone is about 644×390 CSS px, so the box is drawn at about 0.4 and the jars and glasses are small (the 844×390 pantry shot: jars about 60 px tall on a 390 px screen), with worktop or wall padding above | **Agreed (Zafar, 15 Oct):** its own sprint after Sprint 6: every game played at 844×390 and 800×360 and on his phone's shape, items bigger, taking space from the station's surroundings and the vertical padding. Nothing built before then |

## 3. Regression rows (added to `docs/process/regressions.md` the same day)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CK-44 | "The kitchen background has a strange duplication on the sides": "the table has a sharp vertical line and then starts again" on a stage wider than 16:9 (the counter's front, `occluder()` `js/cook/stations.js:682`, is drawn 1:1 over a background zoomed to cover the stage; the tray fronts, `trayFront` `js/cook/flow.js:777`, the same) | **open** (fixed for good by SH-91's master; an interim code fix is Zafar's call) | eye: the counter at 2.25:1 (his phone, about 915×412) and 844×390, 1366×768, 1366×1024: one continuous counter, no vertical edge | `docs/feedback/cook-phone-2026-10-15.md` P1 |
| ART-21 | The kitchen background (`assets/cook/bg/service-v2.webp`): "the tap looks off with spout and the handles", "through the door there's a plant on the floor which doesn't make sense" | **waiting on art** (next art run, as the kitchen's SH-91 master) | eye: 844×390 and 1366×768, the counter with the family | `docs/feedback/cook-phone-2026-10-15.md` P2 |
| SH-90 | "Review playability on phones in a future sprint - the ingredients items need to be bigger and take space from the pantry or the chai station ... probably the rest as well as there's vertical padding": a phone playability review of every game; known so far: items too small, and vertical padding the items should take | **open** (its own sprint after Sprint 6; Zafar, 15 Oct) | eye: every game played through at 844×390, 800×360 and 915×412 (the review) + auto: contract check every game (item size, and no unused vertical padding at 844×390) | `docs/feedback/cook-phone-2026-10-15.md` P4 |
| SH-91 | "Several kitchen backgrounds for different sized screens or one very large upscaled image with all the core content in the middle and then stuff above and below to fill wider or taller screens?": every scene's background, every game, is one master that the stage shows more of instead of zooming in (`fitBg`, `js/cook/stations.js:146`); "chatgpt can redraw but you might need to upscale as well after" | **open** (Zafar, 15 Oct: yes, one master per scene, ChatGPT redraws, then upscaled; the kitchen first, in the next art run) | eye: every scene background (the counter, pantry, chai and every station, the clinic rooms, the other modes) at 844×390, 915×412, 1366×768 and 1366×1024: nothing in the 1600×900 core zoomed or cut | `docs/feedback/cook-phone-2026-10-15.md` P3 |

Second reader (a fresh agent that read only the transcript and §3, on the first message): 1 missing and 3 weakened ("upscaled" dropped; the background question narrowed to the counter; the phone review narrowed to item size; the vertical padding not checked). All four fixed. The second message then corrected P1's cause (I had put the "duplication" down to the painting's two garden views; it is the counter seam in code), so the painting's second window is no longer in any row: he did not name it.

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:01 | P1, P2 |
| 0:02 | P3 |
| 0:03 | P4 |
| 0:04 | P1 |
| 0:05 | P3, P4 |

Lines: 5; in a point 5; chatter 0; unmapped 0.

## 5. Old feedback coming back

None: no earlier row covers the counter seam, the kitchen picture's tap and plant, background fitting per screen, or a phone playability review (SH-27, SH-28, SH-47 and SH-65 were phone text and button sizes, all built; CK-TAB-01 is the tablet layout, which SH-90's review sits next to).
