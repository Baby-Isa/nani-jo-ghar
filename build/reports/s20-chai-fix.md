# s20-chai-fix: chai's five faults before the frame

Branch `s20-chai-fix`, not pushed. Opus, high effort.

## What changed

1. **SH-291 / SH-232 (contract-99): fixed.** There were two causes. First, `js/cook/ui.js:4464` (M.reopen) cleared every card's fold state, served cards included. So at each boil-over of the next pan, Nana's served card was drawn open again (192 px), folded again on its timer and made the panel follow again. Second, Cook's drawCards empties the panel (`box.innerHTML = ""`) on every redraw, so the browser reset `#mission`'s scroll to 0 at the next tick.
   - Fix: M.reopen leaves fold states alone. The shared card now folds a served card once: `js/shared/order-card.js` foldable keeps `st.shut`, so later redraws draw it folded straight away, with no timer and no second follow. The shared card also has a new `OrderCard.keepScroll`, which Cook's renderOrder6 uses, so a redraw never moves the panel.
   - What a child sees: a served card folds once, and the next card glides to its planned place and stays there.
   - Reaches: every kitchen game. The fold-once rule also reaches the clinic's card.
2. **pill-clear: fixed** (`js/cook/stations/chai-tray.js` popAt). The pop sat 10 world px above the hob, which is 3 to 5 CSS px on phones and laptops. It now keeps 7.5 CSS px at every size. Where there is little room, the screen-top margin gives way, but the pop never goes off screen. If it still cannot fit, it goes beside the hob.
   - Drawn gaps: 6.8 at 740x320, 6.8 at 930x430, 6.6 at 1280x665 (the pop moves up about 2 px), and 8.0 at 1920x1080 (unchanged).
   - Reaches: chai only.
3. **CHAI-113 (contract-124): the check is at fault; no code change.** In the 09:14 gate (lab L3 1280x665), the want went to `knob-on-ma` at 22.59 s and then to `knob-nana` (Nana's green) at 22.67 s. There was no tap in between, so no knob was turned on. Ma's knob was actually turned on at 25.09 s, and sfx/knob and sfx/flame both played. The check reads "the want moved on" as "the knob turned on".
4. **contract-84: the check is at fault.** In the 06:58 run, the shot "with the light" has the ring outside the box at 125.5 brightness. In the passing 06:24 measure of the same box, that ring is dimmed to 98.4. So the dim was missing too, not only the fill: the whole light layer was not visible (still classed `.on`, part-way through its opacity fade). The fill is drawn in the same layer as the dim, so it is never missing while the light shows.
5. **contract-116: the check is at fault.** In the 06:24 run, "hakro khun" was ticked by its step closing (M.closeItem). The probe only wraps tickItem, so no s19tick was logged and the check allowed only 1 s instead of its 2 s grace after a tick. The row brought "aako" whole into view 1.1 s after the close, on a page drawing one frame every 170 ms.

Not fixed: none of mine. contract-72, contract-78 and contract-113 are advisory and were also in the 09:14 gate.

## Proof

PROOF_PLACEHOLDER
