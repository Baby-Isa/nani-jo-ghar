# s14-rules: one central rules file, and chai on it (29 Oct)

## What changed
- **SH-155** `data/rules.json` (named by `data/shared.json` rulesFile), read only through `js/shared/rules.js` (tokens.js loads it).
  Chai reads its cups, decoys, card, hint waits (moved from `helpMs`), holds, light, timed hold, pill and level-up from it.
- **SH-156** the cog top right of the play area in every Cook game; menu order from the file.
- **SH-157** skip zones in the shared pop-up (opt-in; chai). New `tap-zones` driver.
- **CHAI-39/SH-152** "no" items said last (the engine's sentence from reordered rows).
- **SH-154** pop-out placed against every face; waiting slots faint.
- **SH-158** first-time heat hold, new player only. **SH-159** per-word pill flag. **SH-160** level-up (free play picks).
- Checks: contract-75/76/77, row-home; outside my list (needed): `cook-player.mjs`, `catalog.mjs`, `flows/cook.mjs`,
  `evidence.mjs`, `evidence.test.mjs`, `regressions.mjs` CONTRACT_ROWS.

## Proof
- After: `build/screenshots/brief/s14-rules/` (RUN). No BEFORE folders existed.
- Contract `s14-rules-contract`: CONTRACT_LINE
- Checks: CHECKS_LINE
- SH-158: new player held 10.9 s at 0.760 until the tap; returning player boiled over (1.0).
- SH-159 (scripted save): paani, khun speaker only; dudh, chai written.
- SH-160: after 3 good rounds the next self-picked order is L2 (2 cups); a grown-up's L4 plays L4.
- QA: TXT ✅ LAY ✅ LNG ✅ CMP ⚠ (Cook only) ART n/a.

## For Mum (new word order)
"Muke aadu waari chai khape, ba khun, dudh na." · "..., hakro khun, aako, dudh na." · "..., dudh, adh, khun na."

## Open
OPEN_LINES
