# s09a style test: independent review (Fable, 20 Oct 2026)

## Conclusion

The style is right and the windows are ready to key. Three things to fix before the full run: **the house** (Nani is 35-40% of the height in every try; plain sky 13-36%; trees and baked sun shadows fight the sky swap and the night tint), **B2** (drawn from Nani's eyes, so the zoom ends with the child wearing her sleeves), and **the book on a phone** (too small unless the code scales the book to the width, not the image to the height). The games pass the leak test as designed if the usage rules in §2 hold. L4 is redone (photo over the fold).

Mismatch: the sprint file says Nani "about two thirds" (Zafar, 20 Oct); the redo prompts say HALF. Two thirds plus a third of sky leaves no ground: recommend 55-60% and ask him (change 1).

## 1. The images

| Image | Verdict | Why |
|---|---|---|
| h-try1 | cut (style ref only) | Nani 36% of height, at x 64%; sky 17%, a tree over it |
| h-try2 | cut | Nani 22%; most sky (36%) but she is a dot |
| h-try3 | redo (one-arch base) | Best house: clean, modern, warm; Nani 37% at x 57%; sky 24%; hard wall shadow baked in |
| h-try4 | cut | Orange walls read old-fashioned; sky 13% |
| h-try5 | redo (three-arch base) | Closest likeness (dupatta drape, hem motif); Nani 39%, centred; sky 20%; dapple shadows baked in |
| h-try6 | cut | Nani 35%; tree in the sky; uneven roof lines |
| r1 car | keep, key now | 51% pure #00FF00 (std 2); ~1,800 edge pixels, erode 1 px; aspect problem §4 |
| r2 bus | keep, key now | 58% pure green; same aspect problem |
| b1 fireplace | keep | As asked: empty shelf at shoulder height, guard, lamp, plain spines. Face rounder and younger than the sheet, build heavier than "slim"; busy rug |
| b2 book | cut to the pages now; redo in the full run | Nani's own point of view; keystoned pages (§3) |
| l1 | layout ref | Matches the game's 3D look; items apart. Not tappable art: find-it needs sprites |
| l1b | drop | Painterly, off-style; tractor behind the cow |
| l2 | layout ref | Three identical speaker buttons read as speakers; empty tiles read as nothing (code writes them) |
| l3 | layout ref | Loose white-bordered photos read as draggable, the dashed frame as the target |
| l4 | redo | Goat photo straddles the spine; mounted photos rightly read as fixed |

All fifteen: no text, modest dress, no rings, no religious markers; style matches the clinic send-off and the s08 lineups except l1b.

## 2. The games on the pages

| Game | Sees, hears, does | Right / wrong | Leak test | Size notes |
|---|---|---|---|---|
| Find it (L1) | Today's place across both pages from item sprites over a drawn backdrop; "Where's the goat?"; tap | Bounce, full line back ("There's the goat…"), gold corner tick / wiggle, line again, no red | Pass if she asks for fewer than shown (2 of 4), only today's words, idle help replays only | Sprites ≥ 60 px on the phone (l1's hen is 90) |
| Name it (L2) | Left: one thing. Right: three identical speaker buttons, the empty sentence row above; "What's this?" (never the word); each button plays one word; tap the name | Button flies to the gap, the row fills with the written Kutchi, she says the day sentence / wobble, ask again | Pass: nothing written on the choices, no loanwords, the row never fills as a preview | Sentence as the shared pill row (17 px, shrink to 14, wrap), not four fixed tiles: sentences run 3-7 words |
| Stick in the photo (L3) | "Then we saw a big cow", written under the dashed frame as said; drag one of three loose photos | Snaps in, mounts appear, she repeats / slides back, line again | Pass if photos are unlabelled, decoys are today's words, one of three asked per page (all three hands the last one free) | Target 400x330 px in the image: ample |
| Our day (L4) | Photos slide in as she tells the day; tap replays | Not scored | No leak | Nothing over the fold |

| Screen | Page size (B2 spread 1190x705 of 1536x1024) | Buttons / tiles as drawn | Fix |
|---|---|---|---|
| 1366x768, fit by height | 430x500 per page | 75-90 px | none |
| 844x390, fit by height | 220x255 | 44 / 38 px: too small | scale the book to the width: pages 320x390, border clipped 16 px, buttons 69 px; no sidebar, Nani's replay as a round face on the page corner |
| Page turn | curl from the right page's bottom corner | 64 px corner, or the shared → | drags can be taken back until Done |

## 3. The camera move

| View | What it shows | Effect |
|---|---|---|
| B1 | The child's view: the book faces out, her fingers over its front edges, knees below | Right |
| B2 | Her view: sleeves from the bottom corners toward the camera, dupatta in the foreground, pages receding, keystoned | Zoom face → tilt to book → dissolve flips 180°: the arms jump from behind the book to "mine"; the child holds the book in Nani's clothes while her voice reads |
| Now | Cut B2 to the pages (x 170-1360, y 90-800); thumbs read fine either side; zoom B1 ~3x on her face, tilt to the book, dissolve early | Works at 1366 from a 1536 source |
| Full run | Redo B2 from the child's seat: book square to the camera, fingers over the outer edges, dupatta top and chin above, lap beyond; near-rectangular pages | DOM rectangles sit flat; "being read to" kept |

## 4. The ride

| Point | Finding | Fix |
|---|---|---|
| Key | Pure, flat, no reflection | Erode 1 px |
| Aspect | 3:2 at 16:9 loses 72 px top and bottom: r1's roof lining goes at the centre and the green runs off the top like a sunroof; on the phone (2.16:1) both top frames go | Code: fit by height, extend the sides with the outer columns (pillar, seat). Full run: opening in the middle 60% of the height |
| Play | Steady scroll, speed up and slow down change only the rate; items are sprites with 60 px hit areas; her bubble over the door panel | Supports it |

## 5. The door

| Need | What the house must leave | Note |
|---|---|---|
| Sidebar (weather card, then activity card, each speaker + Kutchi) | A quarter of the width: Nani dead centre, nothing important in the outer 15% of columns | try1/3/6 are off-centre |
| Her lines, English beneath | Bubble in the sky top-left (2-3 lines, ~70 px on the phone); sun or moon top-right | Sky must be a third |
| Sky swap | Straight roofline; no leaves, cables or lantern crossing the sky; one even pale blue | try1/5/6 have trees in it |
| Time of day and rain | Base in soft overcast light, no cast shadows; sun-shadow layer in code; night overlay for lantern, hallway, window | try3/5 have baked sun |
| Poses (arms out, fanning, pointing, waving in) | The empty house (edit removing her) + her poses as cut-outs at lineup scale | Cannot be baked in |

## Changes

| # | Change | Recommend |
|---|---|---|
| 1 | Ask Zafar: half or two thirds | 55-60%: feet on the step, head under the arch crown, roofline at the top third |
| 2 | H1/H2 prompts: Nani dead centre; overcast light, no cast shadows; straight roofline, nothing above it; one even pale sky | Yes |
| 3 | Full run: the empty house as an edit of the kept H; door poses on plain grey; night overlay | Yes |
| 4 | B2: cut to the pages now; redo from the child's seat, square-on | Yes |
| 5 | R1/R2: code fit by height and extend the sides; full run opening in the middle 60% | Yes |
| 6 | Code: book scaled to the phone's width; buttons ≥ 64 px; sentence as the shared pill row; 64 px turn corner | Yes |
| 7 | Spec rules: ask for fewer than shown; never say the word before name-it; no labels on photos; idle help replays only | Yes |
| 8 | L4 redo (queued); drop l1b | Yes |
| 9 | B1: full run asks for the slim build and the sheet's face; keep this one meanwhile | Yes |

## Proof

| Check | Result |
|---|---|
| Images opened | All 15 in `sources/art/s09a/`, the sheet `sources/art/s08/sheet-nani-final-1.png`, the clinic door `assets/clinic/rooms/bg-clinic-door-cb5-v1.webp` |
| Measured (PIL) | Nani's red-figure height and plain-sky rows per house try; green purity and bounding box in r1/r2 (pure 51% / 58%, std ≤ 2.6, fringe ~1,800-2,000 px) |
| Docs read | CLAUDE.md, S09 sprint, story-and-arcs Part 1, book-games research, s09-mock, s09a art plan and redo block, ui-design-system (48 px, pill sizes) |
| Not run | No code, no sandbox; nothing committed |
