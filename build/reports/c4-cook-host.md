# C4: Cook mounted through the shared host (decision 45)

**Mechanics changed: none. Art: none.**

## What changed
1. **Modules, mount, teardown.** Cook's files share one module namespace (`js/cook/ns.js`), loaded in cook.html's order (`index.js`). `mount.js` starts Cook in a given element; unmount stops it and removes everything. Marked globals left: `window.Cook` on parked pages; `window.__cook` (and `Cook` under automation) on cook.html for the sandbox.
2. **No iframes.** Each host stage mounts Cook directly.
3. **Shell screens:** the end of round (`results.js`) and the station list (`labs.html`) were already shared. Not moved, with the missing piece:
   - Title: the house opening Cook through `mode.js`.
   - Days: a several-order plan with patience.
   - Day's end: a shared summary.
   - Shop: a shared shop over the wallet.
   - Book: the bookshelf (decision 4).
4. **G26:** hic, tummy and hair rows use engine words and six seed placeholders; 360 rounds unchanged; lint 0.
5. **Daar smoke:** the onboarding kit blocked presses during its 450 ms step pause and after its last step. The test bot then waited 25 s per item. Fixed in `onboard.js`.

**Shared edits** (needed for teardown or the smoke): `frame.js` `unwatchSide`; `fit.js` unwatch; `onboard.js` `leave()` plus the input fix.

## Proof
- Mount test (`test_cook_mount`), 5 runs: nothing left. Host test: 3 flows, no iframe. 10 station smokes at 1366×768 end; daar 3×25 s.
- `checks.mjs` (229 unit), `check_onboard`, lang 57, Cook words/lang/voice, leaks pass (tidy's one failing cell predates C4).
- Sandbox at 1366×768, stopped early on the orchestrator's word: 137 of 223 touched pages end, 0 page errors (days 1–6, open kitchen). Six parked flows and the title end, 0 new findings.

## Open
- `bump_version.py` should map `js/cook/` (the five classic-compatible files are stamped by `index.js` until then).
- `js/demo/cook-adapter.js` (not mine) still frames `cook.html`; it already waits for a removed `#panel h1`.
- The architecture docs need a C4 pass (D1).
- **QA:** shot-diff and SH-row recheck left to `/review`.
