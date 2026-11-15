# s20-kit-fix: the shared kit's batch 1 faults (15 Nov, decision 38)

Branch `s20-kit-fix` (merged to dc384d5); shared code, every kitchen game.

## What changed 
- **SH-306:** the bubble wrapped at the kit's 460 px (`conversations.css:35`); eggs L4's sentence is 479 px. While an order card is up, the bubble may grow to the play area's width (`request-popup.js`, `conversations.js`). The sentence is on one line wherever it fits.
- **SH-307:** the row's peeking third card, the row's end (daar) and the panel's foot (sekelo) cut cards. Now a card cut at rest keeps its empty frame; its picture, words and speaker go until the row or panel moves. No clipped words.
- **SH-305:** `ui.js` land()'s path planner summed faces against the take-off total. It also counted the face button's tap area, and a face within 8 px of the landing, so it never curved. Each face now counts alone, as its circle, and the card curves clear of Nana's circle.
- **SH-308** (`ui.js` UI.guidePraise): the well done closes and folds every card, as chai's counter does.
- **SH-311** (`order-card.css`): no side-panel gold while a first-time light is on.
- **SH-309** (`results.css`): one end-screen tile layout on a phone, the speaker on the corner.
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
- **Chai's boxes** differ only by SH-307 (the peek card's words, at the light moment) and SH-309 (end tiles, L1 740x320 and 930x430).
- **Contract run `s20-kit-fix-contract`:** the brief's flows plus sekelo L3, four sizes, 24 pages, all reached their end.
  - contract-83, -129, -116 and -99 are at 0;
  - one blocking break: contract-11, chai's counter picture low-res at 1920x1080 (art);
  - 18 advisory breaks.
- **SH-305 on corn at 740x320:** contract-83 4 breaks before, 0 after.
- **Sheet:** `build/reports/s20-kit-fix-before-after.png` (before: the working branch, 3f0c206).
- SH-305 to SH-307 have no probes: no `evidence.mjs --after`; no BEFORE was played at launch.

## Calls taken while Zafar was away
1. The wider bubble applies only while an order card is up.
2. A cut card shows an empty frame, because contract-116 reads a missing card as a gap.
3. SH-310 is in `word-card.js`, outside my files.

## Open
- check-change stopped at my 58-minute limit in its play step.
- CK-97: outside chai a card takes the catalogue's picture (atto's steel tin) before the shelf's (`cook-atto.shelf`, the glass jar); shelf-first risks SH-242's crates.
- Samosa L1 740x320's headline wrapping on its tick (SH-277): not done.
- Sekelo's panel does not scroll to the next skewer itself.
