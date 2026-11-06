# Batch brief-02: CHAI-92 re-check, the tray glass's last drop and twinkles after brief-01's FAIL (6 Nov evening)

Verdict file: build/screenshots/juice/judge/brief-02.verdicts.md

One sheet, chai's station lab at 1280x665 (cook.html, `njgTest.cook.lab("chai-tray")`, the sandbox's fair player, speed 1), shot by `build/tools/juice/shoot_juice.mjs`. The top row (BEFORE, red) is brief-01's BEFORE: the code before the juice (commit 09c3dc4). The bottom row (AFTER, green) is this branch after the fix. Each still is taken with the kitchen's Phaser tweens frozen for the instant of the shot. The AFTER strip now counts the game's own clock (brief-01's stills by the wall clock came out nearly one moment, the drop hanging where it started), so the round's own events (the "Shabash" bubble, the face shrinking as the round moves on) come at different frames from BEFORE: judge only the drop and the twinkles. Never a verdict: every glass gets its effect whatever went in.

## CHAI-92 (the tray glass)
Issue (Zafar, 6 Nov, on the tray's top-down glass): "maybe it just needs to start from a smaller height, like a third of the height ... so it doesn't start from way above ... It's just a bit more subtle, but paired with the 3 sparkles." brief-01 FAIL: no frame showed the drop in flight; a bright gold flare at the glass's top-centre touched the face and was still lit at 1500 ms.
Check:
- sheet-B-glass-L1-fix-1280x665.png: AFTER a small painted tea drop shows above the glass's right side and falls into it (150 ms, 300 ms), clear of the person's face on the glass's upper left (it may sit beside the face, not over it); then small gold twinkles inside the glass (600 ms, fading at 900 ms), not touching the face; nothing left by 1200 ms. Subtle: smaller and calmer than BEFORE's s11 star.
