# Feedback: Zafar's chai notes, 5 Nov 2026 just after midnight (L1-L4, laptop, a video)

**Source:** docs/feedback/raw/chai-replay-2026-11-05.md (his typed notes, five pictures, a video on `main`:
`assets/20261105_004201.mp4`). 15 transcript lines, 11 points, 2 lines of chatter. Levels replayed by the sandbox: L1-L4 at the four
sizes with a frame-by-frame panel log (`NJG_INIT`), the order heard whole (`#order-whole`) at L2-L4; his video's case (a served card
tapped open and shut, three people) at L4 on last night's version (red) and tonight's (green).

## 1. What it would change (read this first)

### 1a. Every mechanic changed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| The side panel, every Cook game on the s14 look | a card opening made the order list scroll and the frame stepped the whole panel down a size | the order list scrolls; the panel never shrinks for it | P10 |
| The item row (s14) | mandatory scroll snapping to a card's edge | no snapping; the code places the row | P4 |
| The word moment | half 0.5, full just below the rim, a drawn oval on the tea | half 0.42, full to the rim (new art), no oval | P6, P7 |
| The order's half and full cards | the old fill-stage pictures | the word moment's own glass; plain tea for an order with no milk | P7 |
| The stove games' worktop | s08c's cream marble | his white marble (redrawn large, tiled) | P3 |

Nothing removed or replaced but on his word.

### 1b. Old art reused

| Asset | Where it is reused | Points |
|---|---|---|
| s17-wm2's empty glass | re-cut in one box with the new full glasses (`build/tools/art/cut_s17_art4.py`) | P7 |
| block 1's tilted kettle (no chai at its spout) | pours as itself now; the drawn-chai kettle retired | P5 |

## 2. Every point

| Point | Time | What Zafar said | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| P1 | 0:00 | "level 1 after order completion, the item card doesn't minimise after pouring, even into the end kitchen scene - check and fix at all levels" | order card | `js/cook/ui.js:3551` a dish made at the pour drew the cards again only if a row ticked then; at L1 every row had ticked as its item went in, so the card learnt it was served only at the closing scene | built: a dish newly made redraws the cards; replayed L1-L4: every card glides home and folds within a second of its pour |
| P2 | 0:01 | "during multiple orders (2+) in the kitchen, the first menu card doesn't scroll up nicely like how it scrolls down, it still just snaps back up" | order card, every game | `js/cook/ui.js:2181` the next person's card was revealed by a second redraw straight after the fold's, which drew the folding card again already folded and dropped its glide | built: the reveal rides the fold's own redraw; filmed at L2 and L4: 256 to 62 px over the glide |
| P3 | 0:03 | "Can we change this to the new background marble for the stove top down games?" | stove games' worktop | not code: the worktop was s08c's cream tile; his picture was 500x274, too small to upscale | built: pack s17-art4 MW (his run), edges blended so it tiles, x2, `data/cook.json` bg marble and hob |
| P4 | 0:04-0:05 | "the row of item cards ... jerkily scrolls back and forth ... almost like it can't decide or it has two competing instructions" | item row, every s14 game | `css/shared/order-card.css:598` `scroll-snap-type: x mandatory` pulled the row back onto a card's edge after each glide the code makes between edges | built: no snapping; replayed L3 and L4 at three sizes with the whole order heard: no oscillation left |
| P5 | 0:06, 0:13 | "the pour looks different from the spout to the straight like stream"; "slightly left of the kettle so it looks like it's actually coming from the spout" | word moment | `js/cook/ui.js:131` the pour swapped in a kettle with chai drawn at its spout, a different chai from the real stream, and the stream started at that drawn tongue | built: the plain kettle pours; the real stream starts inside its spout's lip, drawn under it; filmed |
| P6 | 0:08 | "at the top of the chai there's a circle/oval drawn ... is it needed or can we take it out?" | word moment | `js/shared/word-moment.js:107` the tea's surface drawn as an oval while it rises | built: taken out (the glass is side-on; the tea's own edge is its top) |
| P7 | 0:07 | "half should be a little lower than current end height, and full should be right to the rim ... that bigger difference shown on item cards ... non-milk tea versions as item cards" | word moment, order cards | not code: the full glass was drawn just below the rim; the cards were an older pack's fill stages | built: pack s17-art4 WR and WB (to the rim, chai and plain tea); half 0.42; the cards made from the same glass (`build/tools/art/teacards.py`), plain tea when the person's order says "dudh na" |
| P8 | 0:09 | "the kitchen background still loads and is visible first before the word focus begins" | word moment | `js/cook/ui.js:100` the moment put up its scene only after loading its script and the word card | built: its scene is up at once, its script and pictures load behind it; filmed: covered 0.3 s after Play |
| P9 | 0:10 | "make sure every next game loads in the background of the current game so there's zero delay" | every game | not code: before the stores | row SH-212, to fix before the store run |
| P10 | 0:12, 0:14 | "nani's hint card growing and hence all the menu cards moving up/down whenever i opened or closed a menu card" | side panel, every Cook game | `js/shared/frame.js:236` the frame's side fit counted the scrolling order list as a too-full panel and stepped every size down (Nani's box, faces, cards) as a card opened, and back up as it shut | built: a list that scrolls by design never shrinks the panel; Nani's line always two lines' room; red on last night's version (scale 1/0.8, her box 35-62 px), green tonight (scale 1, one height) at the four sizes |
| P11 | 0:02 | "the dropdown button for the green hint card is completely in the wrong place, it should be centred height-wise in the green box when the green box is minimised and keeps its place when the green box opens" | Nani's box | `css/shared/order-card.css:567` last night's fix took the tools cell's height away, so the arrow hung from the box's foot | built: centred in the box's first row, out of the flow; measured at the four sizes, closed and open |
| — | 0:11 | "Do proper checks ... I'll stick around for 10 mins" | — | not code: how to work | chatter |
| — | 0:13 | "just checking the random speech bubble doesn't come on the fixed version" | — | not code: the bubble was the test's own (the moment started by hand during the greeting) | chatter: answered; a real L4 start filmed, no bubble |

## 3. Regression rows (added to `docs/process/regressions.md`, 5 Nov)

| ID | Point | Status |
|---|---|---|
| SH-206 (reopened, told before) | P1 | to fix: check |
| SH-180 (reopened, told before) | P2 | to fix: check |
| ART-40 | P3 | to fix: check |
| SH-211 | P4 | to fix: check |
| CHAI-80 (told before) | P5, P6 | to fix: check |
| CHAI-84 | P7 | to fix: check |
| CHAI-85 | P8 | to fix: check |
| SH-212 | P9 | to fix: code (before the stores) |
| SH-210 | P10 | to fix: check |
| SH-209 (reopened, told before) | P11 | to fix: check |

## 4. Coverage: every transcript line → a point

| Lines | Point |
|---|---|
| 0:00 | P1 |
| 0:01 | P2 |
| 0:02 | P11 |
| 0:03 | P3 |
| 0:04 | P4 |
| 0:05 | P4 |
| 0:06 | P5 |
| 0:07 | P7 |
| 0:08 | P6 |
| 0:09 | P8 |
| 0:10 | P9 |
| 0:11 | chatter |
| 0:12 | P10 |
| 0:13 | P5 |
| 0:14 | P10 |

Lines: 15; in a point 14; chatter 1 (and the bubble question inside 0:13, answered); unmapped 0.

## 5. Why the told-before points slipped

- **SH-206:** last night's fix ran only when the pour ticked a row; L1's orders tick every row before the pour.
- **SH-180:** last night's roll-up was right but a second redraw straight after it threw it away; filmed only with a skipping player.
- **SH-209:** last night's fix for its height moved the arrow; it was measured for height, not for place.
- **CHAI-80:** the stream was new but the kettle still drew its own chai at the spout.
