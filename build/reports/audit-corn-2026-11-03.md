# Audit: corn (2026-11-03)

`node build/tools/review/audit.mjs corn`: all 2 steps pass. Logs: `build/screenshots/audit/corn-202611031758/`.
The judge looks at what this can't measure (the light's look, the motion, the art); the standard is `docs/process/prototype-to-game.md`.

| Step | What it checks | Result | Minutes | Last lines |
|---|---|---|---|---|
| panel | the side panel's measures and the order film | pass | 6.0 | pass SH-190 1920x1080 L4: picture padding 10.6/10.6, 10.6/10.6, 10.6/10.6 / pass SH-192 1920x1080 L4: above/below the headline 20.1/21.9 / 60 pass, 0 fail |
| labcheck | the lab page at L1-L4, played to the order: errors, spills, speaker gaps | pass | 2.9 | - 1920x1080 mode=cook&game=corn&level=3&nonav=1&seed=7&speed=3: no errors; nothing spills / - 1920x1080 mode=cook&game=corn&level=4&nonav=1&seed=7&speed=3: no errors; nothing spills / ok: 16 shots, sheet /home/user/nani-jo-ghar/build/screenshots/audit/corn-202611031758/labcheck/sheet.png |
