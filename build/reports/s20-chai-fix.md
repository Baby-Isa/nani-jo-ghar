# s20-chai-fix: chai's faults before the frame

Branch `s20-chai-fix`, not pushed. Opus, high effort.

## What changed

1. **SH-291 / SH-232 (contract-99): fixed.**
   - Causes: `js/cook/ui.js:4464` (M.reopen) cleared every card's fold state, so each boil-over redrew Nana's served card open and folded it again. And drawCards emptied the panel on every redraw (`box.innerHTML = ""`), which put its scroll back to 0.
   - Fix: M.reopen leaves fold states alone. The shared card folds a served card once (`order-card.js` foldable, `st.shut`). The new `OrderCard.keepScroll`, used by renderOrder6, stops a redraw from moving the panel.
   - What a child sees: a served card folds once, and the next card glides into place and stays there.
   - Reaches: every kitchen game; the fold-once rule also reaches the clinic's card.
2. **pill-clear: fixed** (chai-tray.js popAt; chai only). The pop sat 10 world px above the hob, which was 3-5 CSS px. It now keeps 7.5 CSS px and stays on screen. Measured gaps: 6.8 / 6.8 / 6.6 / 8.0 px at the four sizes.
3. **SH-295: fixed.** Cause: `text-wrap: balance` at `css/shared/order-card.css:528`.
   - L4 served cards, 740x320 and 1280x665: before "Muke elchi waari / chai khapeti."; after "Muke elchi waari chai / khapeti.". The aadu card changes the same way.
   - The tick's room under the stamp is unchanged.
   - Reaches: every s14 order card (all kitchen games and the prototypes).
4. **SH-294: done.** chai-tray.js:1361 skips UI.hideCount for a half pour, so at L4 the pills stay over the stove while Nani pours. Only gate 3 played it; no probe checks it.
5. **These three are the checks' faults, not chai's. No code was changed for them.**
   - **CHAI-113 (contract-124):** the want went from knob-on-ma to knob-nana with no tap in between. When the knob was later turned on, both sounds played.
   - **contract-84:** the screen ring round the box measured 125.5 against 98.4 when lit, so the whole light layer was invisible (mid-fade), not only its fill.
   - **contract-116:** a tick from closeItem logs no s19tick, so the check gave 1 s instead of 2 s. The row brought the card into view at 1.1 s.

## Proof

- `checks.mjs`: all 14 steps pass.
- Contract run at four sizes (cook:chai-tray, lab:cook/chai-tray): "CONTRACT PASSED: 0 breaks over 8 pages".
- `boxes.mjs --rules`: 10/10 at L1 and L4, four sizes, on every gate's box run.
- Gate 1 (`gate-20261114T1058`, items 1-2, machine alone): **PASS, 28 min.**
- Gates 2 and 3 (`T1141`, `T1238`, final code, sharing 4 cores with s20-chai-kit's gate at load 6-10): **FAIL, 32.5 and 29.5 min.**
  - contract-99: a sample taken mid-fold was held for 540 ms because the page drew no frames. Once the fold ended, the next card was whole, so nothing should have moved.
  - contract-79, -83, -102: timing checks on pieces these fixes do not touch.
- Box differences come only from SH-295: the L4 headline words at 740x320, 930x430 and 1280x665.
- evidence `--after`: refused (no probes for SH-291 or SH-232). There is no before folder.
- check-change: not run (about 94 min, on a shared machine).
- Run folders are deleted. One `--rules --from` read wrote `rules-chai-tray.json` into the orchestrator's gate box folder.
