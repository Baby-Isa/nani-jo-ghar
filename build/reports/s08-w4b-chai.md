# s08-w4b-chai (builder's report, not judged)

Branch `worktree-agent-a1a00f6d36b562e9a`, not pushed. Detail: `build/reports/s08-w4b-chai/details.md`.

## Flaws first
1. The CP1 tilts don't fit the s08b pan: it's a different pan. So the pour turns the hob's own picture in code, in four 20° steps. Zafar's fallback picture (a half-turned s08b pan) still needs drawing.
2. At 800x360 the turned pan is drawn at about 0.7 of its size, and its handle comes close to the top edge.
3. The water, leaves, boil, foam and spiced stages show v3 pictures inside the s08b rim. They differ a little in colour from the s08b milk and black pictures.
4. Two things predate this work and are still there: the simmer bubbles are drawn in code (CK-06), and the black-tea glass is a side-on picture.
5. On the hob the pan is turned -40°, so its light comes from the left.
6. CK-45 is still failing (contract-21 on #mistake). The tap's act is not logged in flow.js, which isn't my file.
7. contract-22 and contract-37 also fail in the touched run. Neither is about lines or decoy counts this work changed.
8. The tally's comment (shared kit) and INT-16 both say the tally "never takes a tap". Zafar's P34 overrides that, so both need amending.
9. Pan-tap take-back is gone; the count badge is now the only way.

## What changed
The new pans on the hob and pouring (CHAI-08, CHAI-26). The word bubble centred over the pan (CHAI-19). Milk, water and tea go in once each (CHAI-22). "Slow kar" plays at the green (CHAI-24). The pan's glow is a ring (CHAI-25). Tapping a count-badge chip takes one out (CK-TB-01). New checks: contract-70 and contract-71.

## Proof
- Red/green: contract-70 and 71 failed on the old behaviour, then passed.
- `checks.mjs`: unit (406), words, static, leak, bump, specs, docs all ok. Load check ok.
- Touched set at 1366x768: 22 pages reached the end, 0 new findings.
- Filmstrips in `build/screenshots/w4b/`:
  - pour-1366x768-milky-top-black-bottom.png
  - pour-800x360-milky-final.png
  - pour-800x360-black.png (from the build before the fit fix)
  - word-bubbles-1366x768.png
  - ring-glow-1366x768.png
  - takeback-by-badge-1366x768.png
