# s14-rules: one central rules file, and chai on it (29 Oct)

## What changed
- **SH-155** `data/rules.json` (named by `data/shared.json`), read only through `js/shared/rules.js` (tokens.js loads it). Chai
  takes its cups, decoys, card, hint waits (moved from `helpMs`), holds, light, timed hold, pill and level-up from it.
- **SH-156** cog top right of the play area in every Cook game; its menu order from the file; its taps never reach the game.
- **SH-157** skip zones in the shared pop-up (chai asks for them); a `tap-zones` driver.
- **CHAI-39/SH-152** "no" items said last (the engine's sentence from reordered rows). **SH-154** pop-out kept off every face;
  waiting slots faint. **SH-158** first-time heat hold. **SH-159** per-word pill flag. **SH-160** level-up.
- Outside my list (needed): the driver (`cook-player.mjs`, `catalog.mjs`, `flows/cook.mjs`), `lib/evidence.mjs`, `evidence.test.mjs`
  (helpMs moved), `regressions.mjs` CONTRACT_ROWS.

## Proof
- After: `build/screenshots/brief/s14-rules/`. No BEFORE existed. Machine:
  SH-155/159/160 PASS; contract-72 (CHAI-39, 12 pages), 74, 75, 76, 77 all 0 breaks. Tool failures: the tool's own 4x250/4x500
  strips "did not change" (SH-154, CHAI-39, SH-152).
- Contract `s14-rules-contract2` (32 pages, 4 sizes): 32 ends; `CONTRACT FAILED: 6 breaks (contract-53 6)`, as before my build.
- Checks: every line ok (unit 596/0, load 29/29).
- SH-158: new player held 10.9 s at 0.760 until the tap; a returning player boiled over (1.0).
- SH-159 scripted save: right x3 hides; a miss or a peek leaves it written.
- SH-160: three good rounds, the next self-picked order L2 (2 cups); a grown-up's L4 plays L4 (3 cups).
- QA: TXT ✅ LAY ✅ LNG ✅ CMP ⚠ (Cook only) ART n/a.

## For Mum
"Muke aadu waari chai khape, ba khun, dudh na." · "…, hakro khun, aako, dudh na." · "…, dudh, adh, khun na."

## Open
- contract-53 (samosa, fetch, mishkaki: the help light's size) as before my build.
- SH-159/160 have no pictures (no save-seeding driver).
