# s20-bubble: the speech bubble keeps clear of the order's pop-up card (SH-304, 15 Nov)

Branch `s20-bubble` from `ccr-87413d9b-j48fpk` (25039ab). Code at **6cd7247**; this report and the sheet after it. Zafar's yes to the fix is recorded as decision 35(1) (fd686ae, on the newer working branch).

## Proof

**Cause.**
- The order's pop-up card is placed by `js/cook/ui.js:2013` (popPlace). It keeps clear of bubbles already up (`:2022`), but it is often placed before its line's bubble shows.
- The bubble is `js/shared/conversations.js:1201` (Conversations.bubble). Cook's lines call it from `js/cook/ui.js:508`, avoiding only the other people's heads, and place it with `js/shared/request-popup.js:452` (placeBubble). The bubble knew nothing of the card, so it sat centred over its speaker's head, under the card.
- Line numbers are at 25039ab.

**The fix.** Shared code only, every game; the card's place, size, path and timing are unchanged, and the view's lift is untouched.
- `conversations.js` (Conversations.bubble): the bubble now knows every `.wc14-pop` card's resting box:
  - measured at rest: the pop-in scale is undone, and a card in flight counts where it rested;
  - a card it has met stays avoided for the bubble's life, so it moves at most once and never back and forth through an order;
  - it is placed again when a card lands.
- `request-popup.js` (placeBubble, new option `clear`): the faces still go through the existing steps unchanged. Only after them, a bubble still over the card:
  1. slides along its row to the card's side, on the same side of the head, with its tail still pointing into the head's middle and its words wrapped narrower if they must;
  2. where no slide keeps its tail on the head (chai L4 740x320, where the card fills the column over Nana's head), it goes beside the head on its right instead. This is the placement it already takes when there is no room above.
- It never goes onto a face, off screen or over the side panel. With nothing clear, it stays where it was.
- My first version (c00da13) handed the card to the face steps. Those moved chai L4 740x320's bubble below Nana's head, onto his face. 6cd7247 replaced it.

**What a child sees.** The card comes as before. The person's sentence is whole and readable beside it:
- chai L4, phone: beside Nana's head, its tail at his head;
- eggs L1: on two lines next to the card, at both sizes;
- corn L1, phone: one line, moved a little right.

The tail still points at the speaker. No face is covered.

**The gate.** Gate `gate-20261115T0315-chai-tray+eggs+maani-line+corn+daar+chop` on 6cd7247: **GATE FAIL**, 74.3 min. Checks pass in 2.9 min; contract FAIL in 67.8 min (164 pages); boxes:chai-tray FAIL in 3.6 min.
- **contract-129: 0 on all 164 pages.** On the unchanged code it was 6 breaks on 8 pages (chai L4 740x320, eggs and corn at both sizes).
- No break of the bubble-at-the-head check (contract-4).
- The 4 blocking contract problems:
  - daar contract-22 and contract-116: known, waiting on Zafar (decision 35(3)-(4)).
  - daar contract-112 (cook:daar@L2 740x320, a light with two lit regions): did not repeat in 3 runs on this branch or 3 on the unchanged code. A one-off, nowhere near the bubble.
  - contract-83 (cook:corn#mistake L1 740x320: a card 36 px² over the corner of Nana's face circle in the side panel): **this was already there.** The same box, (37,97,122,267), shows on the unchanged code: 1 of 6 corn pages there, 3 of 6 on this branch in the same rounds. It is the card's last flight frame landing on its row while the row still glides, against the face circle. That is the card's path and the side panel, which this change does not touch. It came more often on this branch in a small sample; it needs its own row and fix. `land()` in `js/cook/ui.js` lets a card fly only to a row that clears every face by popFaces' 2 px margin; this landing clears that and still touches the check's face box.
- Advisory, not failing: 90 lines, not compared page by page with the unchanged code; contract-119 also breaks on the unchanged code at every eggs and corn L1 page tried (contract-119 x40, contract-36 x11, contract-70 x7, contract-37 x7, contract-72 x6, contract-114 x5, contract-120 x4, contract-65 x4, contract-78 x3, contract-113 x3).

**Chai's box differences** (boxes:chai-tray, 8 pages: L1 and L4 at four sizes):
- The only differences on every page are two texts gone from Nani's box at the order moment, `nani/word#1` and `nani/ra#1`. That is SH-300's empty Nani box, already on the working branch (the 02:39 gate notes).
- **No bubble box moved at any of the six box moments.** The bubble moves only while the order's card is up, which no box moment holds.
- The reference needs re-taking after the merges, as the handover says.

**The sheet:** `build/reports/s20-bubble-before-after.png`. It shows chai L4 740x320, eggs L1 740x320 and 1280x665, and corn L1 740x320, during the order with the card and the bubble both up. Before is the working branch (run s20bubble-before); after is 6cd7247 (run s20bubble-after3).

## Not done here
The orchestrator's message (03:26) asked this session to build the order view's lift (SH-287, decision 35(2)) next, on this branch, after merging `ccr-7da5e9f0-04g4xm`. This session's brief forbids touching the lift, so it is left for its own brief; nothing of it is on this branch.
