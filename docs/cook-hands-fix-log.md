# Cook hands fix: log (branch `claude/cook-hands-fix`)

Brief: hands scale, the rolling-pin hands, the pantry grab pose, Cook reads the character's hands, and the ⌂ button on phones.

## 26 Sept
- **⌂ home button (task 5):** `css/shared/app.css` now defines `--njg-home-safe` (0 outside the app; the button's corner, 56 px, or 64 px on big screens, when opened from the house). Cook's title overlay (`css/cook.css`) pads its left by it. The clinic (`css/clinic.css`): the hint row starts right of the button and keeps its height, so the task card begins below it; in portrait the whole sidebar row starts right of it. Screenshots: `build/reports/cook-hands-fix/home-*.png` (390x844, 844x390, 915x375, 1440x900). Not fixed (outside this brief): in clinic portrait, the onboarding kit's grown-ups' ⏭ skip covers the card's right edge during the walkthrough.
- **Skin tones (task 4, part 1):** `build/hand_tones.py` recolours the game-size player hands (skin only, the soft skin mask from `gen_assets.py`) into each non-default skin swatch: `assets/cook/hands/player-{boy,girl}-s{1,2,4,5}/`, plus `data/hand-tones.json`. The default swatch (s3) is the painted set.
