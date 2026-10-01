# Step 3, R1 "The checks" (slim)

Branch `ccr-fcd9dddd-wnywzc`. No live page, mode, data or lab file changed.

## What exists
- `build/sandbox/run.mjs` plays the live flows through their real pages and lab URLs, records each distinct state (screenshot plus lint), and writes contact sheets and `summary.md`. See `build/sandbox/README.md`: `--all` (5 sizes, 95 min), `--quick --flow cook:chai-tray` (about 1 min), `--check` (fails on new findings, a flow that stops short, a new page error), `--update-baseline [--accept]`, `--from-run <id>` (re-judge saved data, no browser).
- `build/lint/layout.mjs`: clipped text, truncating ellipsis, text under 14 px, taps under 48 px, off-screen text and taps, page scroll, scroll containers. `layout.test.mjs` finds every planted violation in the fixture and no clean element; `build/sandbox/baseline.test.mjs` tests the ratchet.
- Adapters stay in the sandbox: seeded `Math.random`, a click-listener recorder, a `__heal` alias, and the page fonts served locally (`build/sandbox/fonts`, 1.6 MB; Google Fonts is blocked here and fallback fonts change every measurement).

## Flows: all 185 flow-size runs reach their end
37 flows: house; first launch (character, both Cook rounds, Eid story, Yes/No, house); Cook title; the ten Station-lab stations (pantry = `fetch`) and the chai and chaat recipes at level 1; chai-tray, stir, chop at level 3; the clinic's four stages at levels 1 and 3, nine heal games, "One patient" at levels 1 and 3. Nothing stops early today.

## Baseline: 2,054 findings
By check: tap-small 1,230; text-small 697; text-clipped 40; scroll-container 38; tap-offscreen 25; text-offscreen 24. By page: cook.html 1,218, clinic.html 745, index.html 91. By size: 800x360 547, 844x390 504, 1280x800 350, 1366x768 329, 1440x900 324.
Top offenders: the shared guide box (mute, bulb, face 26-44 px; "to record" flag at 9 px; Cook and clinic), Cook's rail buttons (46 px), the order card's face button (44 px), the clinic card's "to record" words clipped on phones, the title panel and house scrolling on phones, the results word list scrolling.

## Runtime
Full matrix 95 min (about 19 min per size; daar, samosa and mishkaki-grill take 1-3 min each).

## Stability
Re-runs on unchanged code: house and clinic at all sizes; first launch, Cook title, chai-tray, stir, chop, assemble at 844x390 and 1366x768. Cook and first launch: 0 new (196 known). The clinic first showed 5 new of about 830: known selectors turning up in another flow, plus a belt dish stopped at the edge. Fixes: such a finding is printed as "moved", not failed; the belt dish is in `build/lint/ignore.json` with its reason; each state is linted twice, 300 ms apart. Clinic then re-judged: 0 new, 4 moved.

## Out of scope
- Cook uses Phaser's canvas renderer (4-5x faster, no tints); `--webgl` for fidelity. Text drawn in the canvas is not linted.
- Fair player only; levels 2 and 4 not played; level 3 where cheap.
- Parked, run only by name: Cook parts; the maani, daal, samosa, mishkaki recipes (same states as their stations); heal games tummy, hic, hair. Not covered: Cook story days, shop, open kitchen, the clinic morning, other modes.
- Clinic runs `quiet=1&fast=1`, no lab bar, first-time help only in `clinic:patient`; no touch emulation, no sound.
- Not linted: overlap, mid-word breaks, 4/8 spacing.
