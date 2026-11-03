# Audit: assemble (2026-11-03)

`node build/tools/review/audit.mjs assemble`: **1 of 2 steps fail**. Logs: `build/screenshots/audit/assemble-202611031716/`.
The judge looks at what this can't measure (the light's look, the motion, the art); the standard is `docs/process/prototype-to-game.md`.

| Step | What it checks | Result | Minutes | Last lines |
|---|---|---|---|---|
| panel | the side panel's measures and the order film | **FAIL** | 6.0 | pass SH-190 1920x1080 L4: picture padding 10.6/10.6 / FAIL SH-192 1920x1080 L4: above/below the headline 20.1/24.9 / 51 pass, 9 fail |
| labcheck | the lab page at L1-L4, played to the order: errors, spills, speaker gaps | pass | 6.1 | - 1920x1080 mode=cook&game=assemble&level=3&nonav=1&seed=7&speed=3: no errors; nothing spills / - 1920x1080 mode=cook&game=assemble&level=4&nonav=1&seed=7&speed=3: no errors; nothing spills / ok: 16 shots, sheet /home/user/nani-jo-ghar/build/screenshots/audit/assemble-202611031716/labcheck/sheet.png |
