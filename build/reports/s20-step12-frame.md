# s20-step12-frame: chai into the kitchen frame (steps 1 and 2)

Builder report, 14 Nov. Branch `s20-step12-frame`, not pushed. Chai's boxes are identical.

## What changed
- **contract-83** (lab L4 740x320):
  - Cause: dudh's pop asked for a 240 px picture copy (`js/cook/ui.js:3410`). Its load redrew the order card mid-glide (`ui.js:3237`).
  - The row stayed unscrolled (`scrollLeft` 0, not 161), so `land()` (`ui.js:2237-2282`) flew the card onto Nana's head.
  - Fix: only copies the order card draws (under 200 px) redraw it.
- **contract-79** (L3 #hint):
  - Cause: the card light, buried under Nani's help light, came back mid-move when the child's press answered hers (gates 15:48 and 18:58).
  - Fix (`js/cook/coach.js` `C.cardLight`): a press while it is buried ends it. My first guess (a stillness recheck) is reverted.
- **Step 1** (`1fa74c678`):
  - New: `Cook.Frame.area(S, opts)` in `js/cook/frame.js`.
  - It holds chai's play-area lines and draws the wash.
  - Chai pulls its band from it by key.
- **Step 2** (`bebff4c9c`): chai reads the screen and the sheet only through the frame. `kitchen-frame.md` has the API and why.

## Proof
- **Gate, step 1:** PASS (checks 2.3, contract 21, boxes 3.7), 27 min.
- **Gate, step 2:**
  - First run: FAIL, 25.9 min: contract-79 and contract-102 (open 1).
  - After the contract-79 fix (`02fdf42ae`): PASS (checks 1.2, contract 20.9 with 0 blocking over 38 pages, boxes 3.7), 25.7 min.
- **Boxes `--diff`:** 0 moved, 8/8 pages identical after each step.
- **Geometry rules:** 10/10.
- **frame-counts, chai-tray:** 29, then 24, then 0.
- **Contract run, 4 sizes:** "CONTRACT PASSED: 0 breaks over 8 pages".
- **checks.mjs:** ok.
- **check-change** (`--base 9fa381001`): FAILED, 118 min (`build/reports/tiers/change-02fdf42ae4.md`).
  - play: 0 contract breaks over 38 pages (base: 0); leak bot ok.
  - Four blocks, none from this change:
    - mount: the base tree fails it the same way (re-run here: 8 failed).
    - vessel-meta: a file missing from this sparse checkout.
    - scope: flags `index.html`, which the brief owns.
    - frozen: the L1 card light and the lab's `sfx/cook-right` come and go with the bot's speed (base: 1 of 2 plays has the light; branch: 1 of 2 has the sound).
- **Rows:** none in the brief.

## Open
1. **contract-102** (L4 740x320, first step-2 gate) is the probe's fault.
   - The knob's glow sat inside the drawn light (`lit` samples, 51.8-52.4 s), but `s19lit` missed that light: it stood 130 ms before the bot's tap. It did not recur.
2. **The band checks** (`build/core/band.test.mjs:34`, `build/lint/static.mjs:460`) need the game's own `stoneBand(S, {game})` call. So chai calls `F.stoneBand`. To fold it into `area()`, those checks must accept the frame.
3. **The counter's false match:** a 900 ms wait (`chai-tray.js:1354`) is now `READ_AT_POUR_S * 1000`.
4. **Sizes still in sheet units:** TRAY_D, GAP, PAN_R, BASE, CHIP.y.
5. **Not mine:**
   - aadu's flight lands 26 px past the panel: `js/shared/order-card.js:545` and `577-600`, a stale `fold.want14`.
   - The scope audit flags `index.html`, which the brief owns.
