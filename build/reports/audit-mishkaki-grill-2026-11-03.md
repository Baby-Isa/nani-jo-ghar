# Audit: mishkaki-grill (2026-11-03)

`node build/tools/review/audit.mjs mishkaki-grill`: **1 of 2 steps fail**. Logs: `build/screenshots/audit/mishkaki-grill-202611031656/`.
The judge looks at what this can't measure (the light's look, the motion, the art); the standard is `docs/process/prototype-to-game.md`.

| Step | What it checks | Result | Minutes | Last lines |
|---|---|---|---|---|
| panel | the side panel's measures and the order film | **FAIL** | 6.4 | pass SH-190 1920x1080 L4: picture padding 10.6/10.6 / pass SH-192 1920x1080 L4: above/below the headline 20.1/21.9 / 58 pass, 2 fail |
| labcheck | the lab page at L1-L4, played to the order: errors, spills, speaker gaps | pass | 2.8 | - 1920x1080 mode=cook&game=mishkaki-grill&level=3&nonav=1&seed=7&speed=3: no errors; nothing spills / - 1920x1080 mode=cook&game=mishkaki-grill&level=4&nonav=1&seed=7&speed=3: no errors; nothing spills / ok: 16 shots, sheet /home/user/nani-jo-ghar/build/screenshots/audit/mishkaki-grill-202611031656/labcheck/sheet.png |
