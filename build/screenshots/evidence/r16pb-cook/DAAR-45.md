# DAAR-45 (open) · Cook: daar

**Issue:** One stir, one look (Zafar, 8 Nov: "stir ... it's not the same as the stir in daar like it is a different speedo it's a different style different art different zoom different everything's different ... you might just drop that game in half basically which is two completely different screens")

**Check:** auto: stir and daar's stir at L1, L2, L3 and L4: the same dial, pot, art and zoom (one frame each, side by side)

**Source:** docs/feedback/kitchen-play-2026-11-08.md P29

**Status now:** to fix: check (built: s19-clean-c, s19-clean-c2, one Cook.StirKit for daar and the stir game; to judge) · cause: daar keeps its own stir and its code-drawn dial (daar.js:19-36, :1242-1330) beside the stir game's (mechanics/stir.js:1-36); fix: one stir in the kitchen kit (mechanics/stir.js), daar's stir step calls it, the stir game is the same screen

## Probes

- DAAR-45-p1-L1-1280x665: cook:daar L1 @ 1280x665 [p-seen], at stir-mid: reached 1x (rec:stir-mid 41.7s) · daar's own stir today (its dial) | waits: One stir in the kitchen kit for daar and the stir game (out of scope for s19-cards: the next builder)

## Panels (`build/screenshots/evidence/r16pb-cook/DAAR-45.png`)

- **A**: cook:daar L1 1280x665 [p-seen] · stir-mid: the screen, #side outlined
- **B**: cook:daar L1 1280x665 [p-seen] · crop:#side at rec:stir-mid

