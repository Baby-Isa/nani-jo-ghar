# Maani v2 and the kitchen kit (29 Sept, §11 + §13)

**Built:** on the left, the chakla with a faint gold ring that glows at the right size; the velan rolls on its own. On the right, a one-burner hob holds ONE tawa, centred on the burner, with the heat ring centred on the tawa. The chimta flips the maani and lifts it off (a slight puff). No hands. You roll the next maani while one cooks. The shelf band holds the dough plates with `🔊 word` chips (speaker only from level 3), and the finished plates sit beneath the hob, fanned so you can count them. Timers get ~15% quicker per level (`timing.levelSpeed`).

**Art: $0.05** (one chimta, gpt-image-1 medium). Everything else is existing art.

**Kit:** `Cook.Kit.art/size/hob/burner/place/heatRing/chip/badge/speaker` (`js/cook/kitchen-kit.js`; docs/shared-api.md §15). Chai v2 now uses it. Its old hob numbers were slightly off, so pans now sit exactly on their grates (chai shots re-shot).

**Tests:** `test_cook.py --lab --viewport laptop` PASS.

**Best shots** (`build/reports/maani-v2/`): `laptop-l3-tawa.png`, `laptop-l4-rolling.png`, `laptop-l3-serving.png`.
