# s20-p2b-chai: chai's last fixes (13 Nov)

Branch `s20-p2b-chai`, never pushed. No evidence rows in the brief (no before/after folder).

## What changed (what a child sees)
- **SH-287:** while a customer orders, the camera sits 150 design px higher (`flow.js` serviceView/runLab; Cook.view rises with it, so the play box stays put). More wall, less island; customer and bubble whole. Serve, stations unchanged.
- **SH-288:** hit areas of 48 px, drawn look unchanged: canvas (chai-tray.js growHits: face and knob meet at their midpoint, each 48 outward; glass zones; jars 48.2 wide, 0.5 px into neighbours' room), DOM (dots by their insets; item-card speaker and Nani's arrow by a transparent border, disc and ring drawn on ::before).
- **SH-289:** end words, ten or more on a short phone: tile word 14% smaller, hair gap, four rows whole (shared rule by word count, every game). Chai's sidebar headline is one size in every state (0.87 of the card's size, `#side[data-recipe=chai]`; ui.js sets the marker): long orders now sit a touch smaller during the order.
- **Zafar, decision 25:** the served stamp replaces the tick in its place; the stamp's padding-right is gone (tick room stays unseen). Folded L4 orders at the end: **YES, two lines at 740x320 and 930x430** (they were three).

## Proof
Rules, chai L1+L4, four sizes (`build/screenshots/boxes/p2b-final2`, then -final3/-final4 after later edits): **10/10 pass** (tap-size 48 reads, headline, text-whole, frame-slots).
Pictures: SH-287 before `build/screenshots/boxes/p2b-before/chai-tray/L1@740x320/order.png`, `.../L1@1280x665/order.png`; after `build/screenshots/boxes/p2b-d/chai-tray/L1@740x320/order.png`, `.../L1@1280x665/order.png`. Ends: `build/screenshots/boxes/p2b-final3/chai-tray/L4@740x320/end.png`, `build/screenshots/boxes/p2b-930/chai-tray/L4@930x430/end.png`.
Contract (`s20-p2b-chai-contract`): chai 107/110; one contract-79 timing break at 1920 that passed on rerun (`-contract2`: CONTRACT PASSED). checks.mjs: 14 steps ok.

## Box diff against the reference (p2b-final; not re-frozen)
- order moment: the scene picture (lift, SH-287); the sidebar cards (card, face, items, list, texts): the headline size lock (SH-289), a few px up to 10 at L4.
- light/mid/praise/serve/end: the same cards' texts and boxes, same cause; light-1 0.2 to 2 px with them.
- shelf-first/last 0.2 px: the jar's tap box (SH-288), not drawn.
- no other drawn box moved.

## Open
- Pill-clear failed in 3 of 8 runs (L1@740 mid, `pill-11` 3.8 px from the hob, identical numbers; passes in others): not from these files; row CK-112 owner.
- L4@930 bot sometimes does not reach the end (also in the baseline run).
- check-change (tier 2) not run: its play stage did not finish in P5 either.
- Jars overlap neighbours' hit areas by 0.5 px (the slot is 47 px).
