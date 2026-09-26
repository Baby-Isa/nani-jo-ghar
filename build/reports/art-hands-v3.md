# Hands v3: report (26 Sept 2026)

Every image was checked at full size. The results are in `build/reports/data/hands-v3-qa.json`, with a reason for each image.

## Pass counts

| Set | Before | After |
|---|---|---|
| Masters | 39/56 | **55/56** |
| player-boy | 39/55 | **55/55** |
| player-girl | 0/55 | **55/55** |
| nani | 0/102 | **102/102** |

Before this round:
- 8 masters that v2 had passed had torn tool gaps;
- a5-f2 had four digits;
- c5 had a frame line;
- every girl and Nani skin failed on the flat jewellery, plus cream cuff patches or sleeve-colour boxes.

## Jewellery method (route a)

The jewellery is ray-cast in code (`build/hand_jewellery3d.py`):
- ring bands wrap a finger cylinder, so their back half is hidden;
- the aqiq sits in a bezel and the solitaire is faceted, in six claws;
- the tennis bracelet is a chain of cups with faceted stones;
- the bangles are glass and gold tori round a forearm occluder.

Everything is lit from the upper left, is shaded by the skin light beneath it, and casts a contact shadow. It was proved on 3 poses before scaling up.

Also changed:
- The cuff mask is fitted geometrically, which fixes the b4 sliver, the d2 speck and the erase boxes.
- Mirrored left hands are re-lit from the upper left and tone-matched to the right.

## Masters fixed (14)

- b1 and 11 other grips were re-rendered with the tool as a cobalt-blue layer. Skin has no blue, so the key is clean.
- a5-f2 had its little finger added with a masked edit.
- c5's frame line was cleared.
- d6-f1's left hand was re-lit.

## Spend

36 medium edits cost ≈ **$1.80** of $8, with a pre-flight estimate before every batch. The log is `build/reports/data/hands-v3-spend.json`.

## Sheets

- Contact sheets with a verdict under each image: `build/contact-sheets/hands-v3-{masters,player-boy,player-girl,nani}.png`
- Review sheets for Zafar, before and after:
  - `hands-v3-review-nani-right.png`
  - `hands-v3-review-nani-left.png`
  - `hands-v3-review-girl-bangles.png`

## Still open

- **a2 (heel push)** still fails after 9 tries. Use a1 with a squash animation, or draw it by hand.
- Nani's hands keep the child's shape.
- There is a faint lit hairline at some cuff tops.
- Check the ring size on curled fingers in the game.
- The loose sprites in `skins/jewellery/` have been renamed (`bangles-glass-*`).
