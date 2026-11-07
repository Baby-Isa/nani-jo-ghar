# s17-o2-panel: SH-232, the panel follows a served card's fold (7 Nov)

## Flaws first
1. **Unscrolled phones do move.** At 905x298 and 740x320 L4, after Nana's card folds, Ma's card would end at 61 px with its foot under the soft fade. The rule (SH-191 and the brief) counts the fade as cut, so the panel glides Ma's card to its top. The accept line said "unscrolled, nothing changes". **Orchestrator: confirm with Zafar.** For strict "never move unscrolled", one line changes.
2. **The before is not the same every run.** The browser's scroll anchoring sometimes held the card. At 905x298 scrolled, the base ended at -148, -63, -114 and +4 px (4 runs). The after ended at 4 px in all 4 runs and never dipped below 4. The final 905 strip is the run where the base happened to hold the card. The 740x320 scrolled strip shows the bug (-144 to 4).
3. The fold drawn by a redraw ("folded still": the card snaps, which was already true before) now lands the panel before that frame is painted. It does not glide.

## What changed
- `js/shared/order-card.js`: `OC.followFold`, `OC.inProgress`, `OC.foldCurve`. When a card folds (on the timer, or the first time it folds on a redraw), the card in progress is found: `opts.inProgress()`, else `.speaking`, else the next card not done. That card's place in the panel eases to its top less 4 px on the fold's own curve and time. Nothing moves when it would be whole anyway. A child's touch or wheel stops the glide.
- `css/shared/order-card.css`: `#mission { overflow-anchor: none; }`.

## Proof (script-made: the before uses f782f0a's two files)
`build/screenshots/brief/s17-o2-panel/`: strips, plus per-frame traces in `*.json`, at 905x298@2.8 and 740x320 (scrolled and unscrolled), 1280x665 and 1920x1080. The last two are identical before and after: Ma at 79 px, nothing moves. The bare-panel check (`synth.mjs`) covers the timer, the redraw, whole in view and fits.

Contract: `CONTRACT PASSED: 0 breaks over 4 pages`. Checks: all 12 ok.

## Requests
- s17-o1 (owner of `ui.js`): pass `inProgress: () => mission.focusWho` in both `OC.update` calls (ui.js:3130 and 3167).
- The orchestrator: add one line to `docs/process/overnight-log.md`. It is not in my files.
