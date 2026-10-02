# Step 3, R6 "Gate prep"

No mechanic changed.

## Causes found and fixed
- **Snap hang, Find it and Dress up off screen:** R3a removed the `#rotate` rule from `css/cook.css` that these pages borrow, so their own English rotate card sat above the page and pushed it down; they use the frame's wordless card now.
- **Sidebar overflow on tablets (most of the 94):** R3a's tablet scale (1.15 to 1.4) made a three-person round taller than the screen. The frame now shrinks the sidebar's own sizes until it fits (`layout.json sidebar.fit`).
- **Cook's shop:** fits on every screen with no scrolling; the grown-ups' "?" no longer moves the child's buttons.
- **Stitched speech:** `js/core/voice.js` says every line word by word; whole phrases are off until the pre-publish pass. Parity test holds with phrases on; a new test covers the rule.
- **Versioning:** `@import tokens.css`, `css/shared` urls, every ES module and `layout.json` stamped; `build/check_stamps.mjs` passes on the live pages.
- **Also done:** `labs.html` regenerated with `lab/kit.html`, no link lost; the Birthday's Cook errand is playable (`check_arcs` passes).

## Touched run (`r6-touch`, 55 pages)
- Every flow reaches its end: Snap, Find it, Dress up, days 1 to 6.
- New findings: 94 down to 20; 105 fixed.

## Left for the gate
1. **Phones:** a three-person round still overflows at 800×360 and 844×390 (17 findings); needs other sessions' files: fold idle people to their headline (`order-card.js`) or a pinned dock (`cook.html`).
2. Day 6 at 1024×768: the say-slot covers the play area (Cook).
3. Find it's five dock buttons can't reach 48 px in a 260 px sidebar.
4. Cook's test path still uses its own whole-phrase search in `js/cook/lang.js`; one line routes it through the core.
5. Parked modes fetch 21 files without the stamp.
6. Not mine: `test_shared_stars` fails (stars were removed in R4); a heal-taste onboarding check fails (R5's work in progress).
7. Upgrade bonus coins: R4 gave no numbers, so `economy.json` is unchanged.
