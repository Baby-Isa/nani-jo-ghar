# F2: the Sprint 1 review's findings

Branch `ccr-fcd9dddd-wnywzc`. No push to main, no bump.

1. **Greeting pills over the play area (800x360): fixed.** Three pills wrapped into two rows. At 430 px high or less they now sit in one low row across the stage, with 48 px tap targets kept (`css/cook.css`).
2. **13.5 px canvas words: fixed at source.** The word pops in chai-tray ("khun", "chai") and grill ("mishkaki") use `Cook.Kit.textFloor` (`kitchen-kit.js`, same maths as F1's `floorK`). Samosa and daar pops get it too.
3. **Spacing grid: fixed.** Both speaker margins are now `calc(-1 * var(--njg-s2))`.
4. **heal-knee/ear #hint stall: did not reproduce** (solo, and 12 heal hint pages at 4 parallel). The likely cause is in the game: a first-time help that starts late (queued, or the 8 s re-show) could light a tool the child already holds and block their next tap. Steps are now built when the help starts (`js/clinic/heal/scene.js`). The driver's timeout now prints the help's state.

**Proof (~10 min browser):** brief's run, 16 pages: CHECK PASSED, 0 new, 112 fixed. Exact finding paths plus both #hint flows: PASSED. checks.mjs, leak_cook ok.
**Shots:** day2 pills, chai-tray L2 wrong tap, grill takeback. **Flaws:** shelf chip labels still look small (baselined). No pop caught in a shot.
