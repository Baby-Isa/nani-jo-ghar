# s20-kit-fix: the shared kit's batch 1 faults (15 Nov, decision 38)

Branch `s20-kit-fix` (merged to dc384d5); shared code, every kitchen game.

## What changed 
- **SH-306:** the bubble wrapped at the kit's 460 px (`conversations.css:35`); eggs L4's sentence is 479 px. While an order card is up, the bubble may grow to the play area's width (`request-popup.js`, `conversations.js`). The sentence is on one line wherever it fits.
- **SH-307:** the row's peeking third card, the sliver at the row's end (daar stir) and the panel's own foot (sekelo) cut cards. Now a card cut at rest keeps its empty frame; its picture, words and speaker go until the row or panel moves. No clipped words.
- **SH-305:** `ui.js` land()'s path planner summed faces against the take-off total. It also counted the face button's tap area, and a face within 8 px of the landing, so it never curved. Each face now counts alone, as its circle, and the card curves clear of Nana's circle.
- **SH-308** (`ui.js` UI.guidePraise): the well done closes and folds every card, as chai's counter does.
- **SH-309** (`results.css`): on a short phone every end screen's tiles are one layout: the Kutchi over its English, the speaker on the corner.
- **SH-310** (`word-card.js` row pass): one Kutchi size per row.

## Proof
- **Gates on merged 41eae54:**

  | Game | Result | Time |
  |---|---|---|
  | eggs | PASS | 10.6 min |
  | maani-line | PASS | 16.6 min |
  | corn | PASS (contract-83 0 on every page) | 9.8 min |
  | daar,chop | PASS (0 blocking, 56 pages) | 23.7 min |
  | chai-tray | FAIL, 1 blocking: contract-112 | 30.3 min |

- contract-112 (aadu's light, L4 740x320) breaks on 41eae54 too (2 of 2).
- **Chai's box differences** are the fixes only: the peek card's words gone at the light moment (SH-307; later words shift index), and the end tiles at L1 740x320 and 930x430 (SH-309).
- **Contract run `s20-kit-fix-contract`:** the brief's flows plus sekelo L3, four sizes, 24 pages, all reached their end.
  - contract-83, -129, -116 and -99 are at 0;
  - one blocking break: contract-11, chai's counter picture low-res at 1920x1080 (art);
  - 18 advisory breaks.
- **SH-305 on corn at 740x320:** contract-83 4 breaks before, 0 after.
- **Sheet:** `build/reports/s20-kit-fix-before-after.png` (before: the working branch at 3f0c206). Corn's landing is not pictured.
- **Evidence loop:** SH-305 to SH-307 have no probes, so `evidence.mjs --after` cannot run; the BEFORE was not played at launch.

## Calls taken while Zafar was away
1. The wider bubble applies only while an order card is up.
2. A cut card shows an empty frame, because contract-116 reads a missing card as a gap.
3. A waiting dashed slot may show cut: it has no words (Zafar's half gap, 2 Nov).
4. SH-310 is in `word-card.js`, outside my files.

## Open
- Sekelo's panel does not scroll to the next skewer itself.
- contract-72 is flaky on the base too.
