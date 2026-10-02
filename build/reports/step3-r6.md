# Step 3, R6 "Gate prep"

Branch `ccr-fcd9dddd-wnywzc`. No mechanic changed.

## Causes found and fixed
- **Snap hang, Find it and Dress up off screen:** R3a removed the `#rotate` rule from `css/cook.css` that these pages borrow, so their own English rotate card sat above the page and pushed it down. They now use the frame's wordless card.
- **Sidebar overflow on tablets (most of the 94):** R3a's tablet scale (1.15 to 1.4) made a three-person round taller than the screen. The frame now shrinks the sidebar's own sizes until it fits (`layout.json sidebar.fit`). Floors, taps and the dock keep their size.
- **Cook's shop:** fits on every screen with no scrolling. The grown-ups' "?" shows only their English, so the child's buttons never move.
- **Stitched speech:** `js/core/voice.js` now says every line word by word, ahead of stand-ins; whole phrases are off until the pre-publish pass. The parity test holds with phrases on; a new test holds the new rule.
- **Versioning:** `tokens.css`'s `@import`, `css/shared` urls, every ES module and `layout.json` are now stamped. `build/check_stamps.mjs` passes: every live-page request is stamped.
- **Also done:** `labs.html` regenerated with `lab/kit.html`, no link lost; the Birthday's Cook errand is playable (`check_arcs` passes).

## Touched run (`r6-touch`, 55 pages)
- Every flow reaches its end: Snap, Find it, Dress up, days 1 to 6.
- New findings: 94 down to 20; 105 fixed.

## Left for the gate
1. **Phones:** a three-person round still overflows at 800×360 and 844×390 (17 findings). The fix is in other sessions' files: fold the people not in progress to their headline (`order-card.js`), or keep the dock always visible (`cook.html`).
2. Day 6 at 1024×768: the say-slot covers the play area (Cook).
3. Find it's five dock buttons can't reach 48 px in a 260 px sidebar (an old finding; R4's baseline shrink dropped it).
4. Cook's test path still uses its own whole-phrase search in `js/cook/lang.js`. A one-line change routes it through the core voice.
5. Parked modes fetch 21 files without the stamp.
6. Not mine: `test_shared_stars` fails (stars were removed in R4); a heal-taste onboarding check fails (R5's work in progress).
7. Upgrade bonus coins: R4 gave no numbers, so `economy.json` is unchanged.
