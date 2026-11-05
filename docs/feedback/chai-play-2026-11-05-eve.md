# Feedback: Zafar's chai notes, 5 Nov 2026 evening (his phone, then his laptop)

**Source:** docs/feedback/raw/chai-play-2026-11-05-eve.md (typed in the chat; pictures in `docs/feedback/images-2026-11-05-eve/`).
9 lines, 8 points, 1 line on the standards structure (recorded in `build/reports/s17-standards-structure-v2.md` §8). Levels replayed:
L2 New player through labs.html at 1280x665 and 930x430 (the lesson), L3 Words known at 971x318 (the eye), the word moment at half
(1280x665, before and after), L2 and L4 at 1280x665 and 971x318 (the layout, the pills), three L4 orders with a frame-by-frame row
log (the jerk), then the chai set with the contract checks.

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| The reveal lessons, every game | the lesson took the first dotted word in the page, shown or not | only a word the child can see; none: no lesson, no wait | P7 |
| The play area, chai | the hob and tray low, just above the shelf | the group centred on the worktop that shows, the count pills' room above it | P4 |
| The worktop, chai | the marble under a parchment wash (#f4ecdf, 0.18) | under a cream wash (#f8eccd, 0.18), the stone's undertone | P8 |

Nothing removed or replaced.

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| none | | |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:00 | "the eye circle just touches the top and the bottom of the blurred image rectangle ... some padding built in ... Otherwise it looks like it's a little bit clipped" | item card, every game | `css/shared/word-card.css:128` the eye's least height is the 48 px tap size, as tall as a phone's item picture | built: never taller than the picture less 8 px top and bottom; its tap area stays 48 px (a see-through ::before); shot at 971x318 |
| P2 | 0:01 | "just outside the edge of the glass, you'll see kind of a black, shadow ... going up in line with the level of the tea ... the only thing that changes is what's inside the glass" | word moment | `js/shared/word-moment.js:95` the full glass was uncovered across the picture's whole width below the tea's level, its edge outside the glass a shade darker than the empty one's | built: uncovered only inside the glass, its walls included; before and after at half, x3: the band gone |
| P3 | 0:02 | "the pills that count the number of items that have gone in ... seem a bit big compared with ... the ones on the shelf ... at least a little bit, just to be kind of proportionate" | count pills, every game | `css/shared/tally.css:14` text t1 (22 px) and a 32 px picture | built: text t3, picture s5, a step above the shelf's t4; chai's badge height 40 |
| P4 | 0:03 | "a lot more space on top ... placed centrally, both X and Y axis, including the gameplay area ... big enough to accommodate all the items" | chai's play area | `js/cook/stations/chai-tray.js:576` the hob set just above the shelf, so a taller stage's extra worktop all went above it | built: the hob-and-tray group, with the count pills' room, centred between the view's top and the shelf; shot L2 and L4 at 1280x665 and 971x318 |
| P5 | 0:04 | "the word pills of the items on the shelf are touching ... We had a rule ... spread out such that they fit within the left edge of the ... saucepan handle, and the right edge ... of the tea tray ... something's faulty, either in the logic or the execution" | shelf | `js/cook/stations/chai-tray.js:765` the execution: the row kept 190 px clear on the right for the old tick button chai no longer draws, so with three pans it stopped short of the tray's edge | built: the margins are the view's edges; L4 at both sizes: gaps between every pill |
| P6 | 0:05 | "on level 4, in the order giving stage ... the scrolling goes jerkily left and right a few times ... the item immediately preceding a half or whole item card" | order card | not code: not reproduced: three L4 orders, every row logged each frame: no reversal while the order is given (one, the glide home after it); the half and full cards the same width (115 px) as the others and their slots | open: his screen recording of it (told before: SH-211) |
| P7 | 0:06 | "still absolute toss-up whether I see the onboarding for the blurred English words ... level 2 ... didn't get the onboarding ... level 3 ... got both ... On level 2, it waits" | reveal lesson, every game | `js/cook/stations/chai-tray.js:2872` the lesson took the first dotted word in the page (`vis` only: in the DOM and not hidden), so it could light a word in a card still rolled up from the order, or out of the list's view, while the next light waited | built: only a word in an open card, in the list's view and what shows at its middle; waited for up to 3 s; none: no lesson and no wait, logged (`reveal-lesson`); his replay to confirm (told before: SH-196) |
| P8 | 0:07 | "change slightly the tone, the hue, the warmth of the kitchen counter? ... is it the perfect match for the stone ... they should just sing off each other ... consult Fable" | worktop, every stove game | not code: the marble file is a cool blue-white (hue 260) that the parchment wash flattened to a dead neutral, beside a warm stone (hue 28); Fable, `build/reports/s17-worktop-harmony.md` | built: the wash #f8eccd at 0.18 (`--njg-worktop-wash`, St.worktopWash): the marble lands on the board's cream-white (hue 30), the veins' contrast kept; optional art run for taupe veins (his call) |
| — | 0:08 | "break all areas down rule by rule ... built into the tools and ways of working ... start it on a new chat" | — | not code: the structure | chatter: recorded in the structure's §8 |

## 3. Regression rows (added to `docs/process/regressions.md`, 5 Nov)

| ID | Point | Status |
|---|---|---|
| SH-217 | P1 | to fix: check |
| CHAI-88 | P2 | to fix: check |
| SH-218 | P3 | to fix: check |
| CHAI-89 | P4 | to fix: check |
| SH-208 (reopened, told before) | P5 | to fix: check |
| SH-211 (reopened, told before) | P6 | waiting on Zafar (a recording) |
| SH-196 (told before) | P7 | to fix: check |
| ART-43 | P8 | to fix: check |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:00 | P1 |
| 0:01 | P2 |
| 0:02 | P3 |
| 0:03 | P4 |
| 0:04 | P5 |
| 0:05 | P6 |
| 0:06 | P7 |
| 0:07 | P8 |
| 0:08 | chatter |

Lines: 9; in a point 8; chatter 1; unmapped 0.

## 5. Why the told-before points slipped

- **SH-208:** the 4 Nov fix wrote the rule but kept an old clearance for a button that had gone; checked at L3 with two pans, not L4 with three.
- **SH-211:** last night's fix removed the snapping; whatever he still sees is not in a headless browser's timing.
- **SH-196:** every check asked "was it lit", never "was what it lit on screen".

## 6. The second reader

A fresh Fable read only his notes and the rows: 3 missing, 6 weakened; all fixed in the rows (SH-208's check is his span and
"touching"; CHAI-89 centred across as well, a tablet size, the group holding everything in play; ART-43 keeps "cleaner ... whiter",
answers "one image or one pack" and is his to keep or drop; CHAI-88 checked through the fill on both sides; SH-211's test case is his
theory). The structure line (0:08) is recorded in `build/reports/s17-standards-structure-v2.md` §8, not a row.
