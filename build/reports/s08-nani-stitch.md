# s08 Nani stitch and the CP1 chai pan (16 Oct 2026)

Zafar (16 Oct): "all good and consistent". Nani is the jaw-fixed v3 set outside the clinic, cut by `build/tools/art/specs/s08-nani.cut.json` (artcut `lean`, `faces`). Counter: forearms on the back edge (y 613), head 186 px, CK-44 untouched, each frame the base outside its face or arm layer. Story, Find, Snap: the same cut on the ledge canvas. Badge and box faces: `nani-faces-v2.png`. Point: `nani-lean-point-v3.png`, zero shift. Nine old files deleted.

Flaws: the counter point's finger hides behind the back edge (Cook never calls point), and on the Eid panels it runs off the foot. She sits taller, head about 50 px above Ma's; the finale draws her 1.18× to match. Box faces differ ΔE 1.0–1.6. CP1's pan has a black handle, but the hob pan's is steel.

CP1 (`s08-cp1.cut.json`, artcut `shaped`): cut by shape, no halo at 3×, six pieces on one canvas. Milk pours tilt 0→45, pour, back. Black tea pours directly (the tilts are milk only). Over the last glass the pan shrinks so its handle stays on screen.

## Proof

- Counter swaps: ≤0.08 px, alpha the same, skin ΔE ≤1.2. Box faces: ≤1.5/280 px.
- Sandbox cook:title, fetch, day1, day6, chai-tray and first at 800×360, 844×390 and 1366×768 `--check`: all ended, 0 new, contract 0 breaks.
- unit, static, leak, size, load (29/29) and art pass.
- `build/reports/s08-nani-stitch/`: `counter-moods-*.jpg`, `ba-finale-*.jpg`, `ba-cover-844x390.jpg`, `ba-cook-title-800x360.jpg`, `ba-pantry-800x360.jpg`, `ba-arrive-844x390.jpg`, `ba-eid1-1366x768.jpg`, `ba-find-1366x768.jpg`, `ba-snap-800x360.jpg`, `likeness.jpg`, `chai-pour-{before,after}-*.jpg`.
