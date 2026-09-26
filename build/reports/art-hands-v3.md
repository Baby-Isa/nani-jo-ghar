# Hands v3: report (26 Sept 2026)

Branch `claude/art-hands-v3`. Every image was checked at full size. The results are in `build/reports/data/hands-v3-qa.json`, with a reason for each image, before and after.

## Pass counts

| Set | Before | After |
|---|---|---|
| Masters | 39 / 56 | **55 / 56** |
| player-boy | 39 / 55 | **55 / 55** |
| player-girl | 0 / 55 | **55 / 55** |
| nani | 0 / 102 | **102 / 102** |

Looked at full size, 8 masters that v2 had passed failed on torn, stair-stepped tool gaps. c5 had a frame line. a5-f2 had only four digits. Every girl and Nani skin failed on the flat jewellery, and most also had cream cuff patches or hard sleeve-colour boxes.

## Jewellery method (route a, in code)

The jewellery is ray-cast in `build/hand_jewellery3d.py`:
- rings are a band round a finger cylinder (the back half is occluded), with a bezelled aqiq cabochon or a six-claw faceted solitaire;
- the tennis bracelet is a chain of white-gold cups with faceted stones;
- the bangles are glass and gold tori round a forearm occluder.

Everything is lit from the upper left, as the hands are, with speculars. Each piece is multiplied by the local skin light and casts a contact shadow. It was proved on a1, a3-e and e3-5 before scaling up.

Other changes:
- The sleeve mask is now geometric: the cuff's top edge is fitted to cloth-coloured pixels. This removes the b4 sliver, the d2 speck and the erase-box rectangles.
- Mirrored left hands are re-lit from the upper left (a height field from the silhouette), then tone-matched to the right hand.
- A few anchor pins were set by eye: d3, d4-f1, e4-f1, e7 and f4.

## Masters fixed (14)

- b1 and 11 other grips (b2-e, b3, b5 ×2, c2, c3 ×2, d1-f2 ×2, d2-t, d3, d4-f1) were re-rendered with the tool drawn as a **cobalt-blue object on its own layer**. Skin never contains blue, so the key is clean.
- a5-f2 had its little finger added with a masked edit.
- c5's frame line was cleared.
- d6-f1's left hand was re-lit.

## Spend

36 medium edits cost ≈ **$1.80** of the $8 budget. Every batch had a pre-flight estimate, and the log is in `build/reports/data/hands-v3-spend.json`.

## Sheets

- Contact sheets with a verdict under each image: `build/contact-sheets/hands-v3-{masters,player-boy,player-girl,nani}.png`
- Review sheets for Zafar, before and after:
  - `build/contact-sheets/hands-v3-review-nani-right.png`
  - `build/contact-sheets/hands-v3-review-nani-left.png`
  - `build/contact-sheets/hands-v3-review-girl-bangles.png`

## Still failing or open

- **a2 (heel push)** still fails after 9 tries across rounds. The model will not foreshorten the lifted fingers. Use a1 with a squash animation, or draw it by hand.
- Nani's hands keep the child's hand shape.
- There is a faint light hairline at some cuff tops (the master's own lit rim), which isn't visible at play size.
- Check the ring sizes on curled fingers in the game.
- The loose sprites in `skins/jewellery/` are new 3D renders. Any game code that loads the old names (`bangle-*`) needs updating to `bangles-glass-*`.
