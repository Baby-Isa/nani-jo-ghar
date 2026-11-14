# s20-p2c-chai: the two faults the gate's first run caught (13 Nov)

Written by the orchestrator on 14 Nov from the branch's commits (the builder handed back without a report). Merged as f8a1ac20f.

## What changed (what a child sees)
- **contract-80 (lab pages):** the lab page draws the order view at its height from the first frame. Before, the title backdrop sat at the old height for a moment, then jumped up by SH-287's lift. `js/cook/flow.js` showTitle lifts the hosted title backdrop as the order's (`orderLift(S(), true)`; c26ab7167).
- **contract-83 (L4, 740x320):** an item card flying to its row never crosses a face. The flight path is sampled finer, with a pixel's margin (06c39e38a), and counts faces apart from speech bubbles (324f3e8e5), all in `js/cook/ui.js`.

## Proof
The gate on chai after the merge (gate-20261113T2122): checks pass; contract pass, 0 blocking over 38 pages; boxes differ from the reference only by SH-289's headline (the reference is re-taken on Zafar's yes, P6).
