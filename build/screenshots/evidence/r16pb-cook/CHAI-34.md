# CHAI-34 (open) · Cook: chai

**Issue:** "The pan I'm so fed up with the pan": the chai pan exactly top-down, from his reference (sources/art/refs/2026-10-27-cards/pan-top-down-reference.png), the chai sitting in it (told before: "needs re-doing again"); the pour animation is poor too: later ("I can't really think about the poor animation for now") · 28 Oct: "before we push to main can we redo the chai pan and glasses to be proper top down ... we can do a small art run" (told again); Zafar, 28 Oct: "yes to all, include the pour frames" (every pan state and its pour frames)

**Check:** eye: chai L1-L4 at both sizes

**Source:** docs/feedback/chai-cards-2026-10-27.md P3; docs/feedback/chai-onboarding-2026-10-28.md P3

**Status now:** to fix: check · built 29 Oct in the live chai (s14-chai, build/reports/s14-chai.md); the judge, then Zafar's play

## Probes

- CHAI-34-p1-L1-1920x1080: cook:chai-tray L1 @ 1920x1080 [p-seen_x2], at kind-timing: reached 1x (rec:kind-timing 32.1s) · the s14 pan exactly overhead, its state painted (milky at L1, black and milky at L4), centred on its burner; nothing in it drawn in code
- CHAI-34-p1-L1-930x430: cook:chai-tray L1 @ 930x430 [p-seen_x2], at kind-timing: reached 1x (rec:kind-timing 30.0s) · the s14 pan exactly overhead, its state painted (milky at L1, black and milky at L4), centred on its burner; nothing in it drawn in code
- CHAI-34-p1-L4-1920x1080: cook:chai-tray@L4 L4 @ 1920x1080 [p-seen_x2], at kind-timing: reached 1x (rec:kind-timing 47.1s) · the s14 pan exactly overhead, its state painted (milky at L1, black and milky at L4), centred on its burner; nothing in it drawn in code
- CHAI-34-p1-L4-930x430: cook:chai-tray@L4 L4 @ 930x430 [p-seen_x2], at kind-timing: reached 1x (rec:kind-timing 62.1s) · the s14 pan exactly overhead, its state painted (milky at L1, black and milky at L4), centred on its burner; nothing in it drawn in code
- CHAI-34-p2-L1-1920x1080: cook:chai-tray L1 @ 1920x1080 [p-seen], at exp:pour: reached 1x (exp:pour-nana 25.5s) · the new pour: the pan lifts to sit just above its glass, empties (six frames) while the glass fills in step; no tipping, no drawn stream; the glass never jumps
- CHAI-34-p2-L1-930x430: cook:chai-tray L1 @ 930x430 [p-seen], at exp:pour: reached 1x (exp:pour-nana 32.7s) · the new pour: the pan lifts to sit just above its glass, empties (six frames) while the glass fills in step; no tipping, no drawn stream; the glass never jumps
- CHAI-34-p2-L4-1920x1080: cook:chai-tray@L4 L4 @ 1920x1080 [p-seen], at exp:pour: reached 1x (exp:pour-nana 43.6s) · the new pour: the pan lifts to sit just above its glass, empties (six frames) while the glass fills in step; no tipping, no drawn stream; the glass never jumps
- CHAI-34-p2-L4-930x430: cook:chai-tray@L4 L4 @ 930x430 [p-seen], at exp:pour: reached 1x (exp:pour-nana 101.4s) · the new pour: the pan lifts to sit just above its glass, empties (six frames) while the glass fills in step; no tipping, no drawn stream; the glass never jumps

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-34.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-2.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-3.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-4.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-5.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-6.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-7.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-8.png`, `build/screenshots/evidence/r16pb-cook/CHAI-34-9.png`)

- **A**: cook:chai-tray L1 1920x1080 [p-seen_x2] · zoom2:canvas:pan at rec:kind-timing
- **B**: cook:chai-tray L1 930x430 [p-seen_x2] · zoom2:canvas:pan at rec:kind-timing
- **C**: cook:chai-tray@L4 L4 1920x1080 [p-seen_x2] · zoom2:canvas:pan at rec:kind-timing
- **D**: cook:chai-tray@L4 L4 930x430 [p-seen_x2] · zoom2:canvas:pan at rec:kind-timing
- **E**: cook:chai-tray L1 1920x1080 [p-seen] · strip:#stage:10x200 at exp:pour-nana
- **F**: cook:chai-tray L1 930x430 [p-seen] · strip:#stage:10x200 at exp:pour-nana
- **G**: cook:chai-tray@L4 L4 1920x1080 [p-seen] · strip:#stage:10x200 at exp:pour-nana
- **H**: cook:chai-tray@L4 L4 930x430 [p-seen] · strip:#stage:10x200 at exp:pour-nana

