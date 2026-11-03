# Audit: daar (2026-11-03)

`node build/tools/review/audit.mjs daar`: **1 of 2 steps fail**. Logs: `build/screenshots/audit/daar-202611031637/`.
The judge looks at what this can't measure (the light's look, the motion, the art); the standard is `docs/process/prototype-to-game.md`.

| Step | What it checks | Result | Minutes | Last lines |
|---|---|---|---|---|
| panel | the side panel's measures and the order film | **FAIL** | 5.5 | pass SH-190 1920x1080 L4: picture padding 10.6/10.6, 10.6/10.6, 10.6/10.6 / pass SH-192 1920x1080 L4: above/below the headline 17.1/17.9, 20.1/21.9 / 54 pass, 6 fail |
| labcheck | the lab page at L1-L4, played to the order: errors, spills, speaker gaps | pass | 2.7 | - 1920x1080 mode=cook&game=daar&level=3&nonav=1&seed=7&speed=3: no errors; nothing spills / - 1920x1080 mode=cook&game=daar&level=4&nonav=1&seed=7&speed=3: no errors; nothing spills / ok: 16 shots, sheet /home/user/nani-jo-ghar/build/screenshots/audit/daar-202611031637/labcheck/sheet.png |
