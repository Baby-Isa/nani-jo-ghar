# Step 3, R1 "The checks" (slim)

Branch `ccr-fcd9dddd-wnywzc`. No live page, mode, data or lab file changed.

## What exists
- `build/sandbox/run.mjs`: plays the live flows through their real pages and lab URLs, records each distinct state (screenshot plus lint), writes contact sheets, `summary.md` and a ratchet check. How to run, flags and output: `build/sandbox/README.md`.
  `node build/sandbox/run.mjs --all` (all five sizes, 95 min); `--quick --flow cook:chai-tray` (laptop, about 1 min); `--check` fails only on new findings, a flow that no longer reaches its end, or a new page error; `--update-baseline [--accept]` only shrinks without `--accept`; `--from-run <id>` re-judges saved data with no browser.
- `build/lint/layout.mjs` (+ fixture and `layout.test.mjs`, which finds every planted violation and no clean element): text clipped, truncating ellipsis, text under 14 px, taps under 48 px, text and taps off screen, page scroll, scroll containers. `baseline.json` is today's 2,054 findings, one per line. `build/sandbox/baseline.test.mjs` tests the ratchet.
- Adapters live in the sandbox only: seeded `Math.random`, a click-listener recorder, a `__heal` alias on the clinic page, the page fonts served locally (Google Fonts is blocked here, and fallback fonts would have changed every measurement).

## Flows: all 185 flow-size runs reach their end
37 flows: house; first launch (character, both Cook rounds, Eid story, Yes/No, house); Cook title; the ten Station-lab stations (pantry = `fetch`) and the chai and chaat recipes at level 1; chai-tray, stir and chop at level 3; the clinic's four stages at levels 1 and 3, nine heal games, "One patient" at levels 1 and 3. Where it stops: nowhere today.

## Baseline (2,054 findings; distinct per check, flow, size, selector)
By check: tap-small 1,230; text-small 697; text-clipped 40; scroll-container 38; tap-offscreen 25; text-offscreen 24. By page: cook.html 1,218, clinic.html 745, index.html 91. By size: 800x360 547, 844x390 504, 1280x800 350, 1366x768 329, 1440x900 324.
Top offenders: the shared guide box (mute, bulb, face 26-44 px; "to record" flag at 9 px; both Cook and clinic), the rail buttons (46 px) and the order card's face button (44 px), the clinic card's "to record" words clipped on phones, the title panel and house scrolling on phones, the results word list scrolling.

## Runtime
Full matrix 95 min. About 19 min per size, dominated by Cook (daar, samosa, mishkaki-grill take 1-3 min each).

## Stability
Second runs on unchanged code: the house and every clinic flow at all five sizes, and first launch, Cook title, chai-tray, stir, chop and assemble at 844x390 and 1366x768. The Cook and first-launch part passed with 0 new findings (196 known, 0 fixed). The clinic part first showed 5 new findings out of about 830: the same selectors turning up in another flow (which words are on a card, whether a card is folded) and one pharmacy-belt dish stopped at the screen edge. Fixes: a known check+size+selector in another flow is printed as "moved", not failed (4 cases); the belt dish is listed with its reason in `build/lint/ignore.json`; every state is linted twice 300 ms apart and only findings in both count. After that the clinic re-judged clean: 0 new, 4 moved, 1 fixed (not shrunk). Seeded `Math.random`, the clinic's `seed=7` and local fonts make the rest repeat.

## Out of scope / limits
- Cook is drawn with Phaser's canvas renderer (4-5x faster than software WebGL; no tints). `--webgl` for fidelity. Text drawn inside the canvas is not linted.
- Fair player only; no mistakes, blind bot, or hint states. Levels 2 and 4 are not played; level 3 only where cheap.
- Parked and not in `--all`: Cook parts, the maani, daal, samosa and mishkaki recipes (they replay the stations already covered, identical states), the parked heal games (tummy, hic, hair), Cook's story days, shop and open kitchen, the clinic morning, other modes.
- Clinic runs with `quiet=1&fast=1`, no lab bar, first-time help off except in `clinic:patient`; touch is not emulated; sound is not tested.
- Not linted: things covering other things, mid-word breaks, 4/8 spacing.
