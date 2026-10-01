# Step 3, R3a "Shared frame and kit, built to scale"

Branch `ccr-fcd9dddd-wnywzc`. No mechanic changed; Cook and the clinic keep their code behind thin hook-ups in `cook.html` / `clinic.html`.

## What changed
- **One scale:** `data/layout.json` + `js/shared/frame.js` pick phone/tablet/laptop, one scale (tablets 1.15–1.4) and write every size token; text ≥14 px (floor text 14.5 px), taps ≥48 px. `css/shared/tokens.css` holds colours, type, spacing, radii, shadow; its fallback is tested equal to the data. No px left in `css/shared/**`.
- **Frame:** sidebar width from data (laptop 19 % as before, tablets 25 %), safe areas, one wordless rotate card (Cook's English one gone).
- **Stage** (`stage.js`): one scene mapping (safe area, fit/cover, item scale); tests prove it equals Cook's Phaser fit and the clinic's `fitScene`; both pages use it. `Stage.art()` picks @2x via `njgV`.
- **fit.js:** shrink to the floor, then wrap; no ellipsis anywhere (the 7 rules and sub-14 floors gone).
- **Kit:** guide box as the mock-up (48 px tools); `bulb.js`, `tally.js`, `focus.js` with shims behind `UI.bulb`, `Kit.Bulb`, `Kit.Tally`; order card rows grow instead of clipping, **pill flow** by data (default stacked); end screen on tokens, words wrap, actions are icons (E1). State sheet: `lab/kit.html` (`?part=results|words`).

## Checks
Unit: shared 132, core 42, host 41, lint 17, frame browser test 4 (one layout.json number resizes the sidebar on reload). CSS lint 470 → 416. Sandbox `--check`, clean worktree, all Cook stations, paths and clinic flows at phone/laptop/tablet: every flow ends, 0 page errors. Full gate: first chunk only (15/480 pages): **1 new** (first launch @ 800x360: guide mute 15 px off screen), 241 fixed. Baseline not shrunk yet.

## Regression rows
Fixed: SH-01, SH-09, SH-27, PAN-01, FL-02 (home moves to the dock). Rechecked OK: SH-24, SH-29, SH-30, SH-36, SH-37. Open: SH-28 (shelf chips are canvas text, R4).

## Tablets
`build/screenshots/r3a/pairs/` (before | after), `after/kit__*.png` (stacked and pill cards, each size). Sidebar UI 15–40 % bigger, no letterbox. Play items don't grow yet: Cook's shelf chips reach both edges, so its safe area is the whole box; once R4 lays stations out for 4:3, narrowing `stage.scenes.cook.safe` grows them.

## Art for tablets
All backgrounds need @2x and 4:3 bleed (up to ~3,600 device px on an iPad Pro). Characters (~400 px) need @2x. Props, badges, results art are fine.

## Next (R5 owns host/tally/order-card/results/bulb/onboard now)
Full gate, then `--update-baseline`; the 800x360 first-launch mute; drop the shims once modes call `Bulb.create`/`Tally.mount`; Zafar to try `card.rows: "pills"`; check the review's no-Kutchi placeholder against G2; `bump_version.py` to stamp `tokens.css` and map the new files; a `labs.html` entry for `lab/kit.html`; the lint reads 14 px text as 13.9 px.
