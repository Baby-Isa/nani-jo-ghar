# CHAI-08 (open) · Cook: chai

**Issue:** v2 mock-up fixes: hob and tray about 15% bigger and lower, pans true top-down, tilted pan for the pour, real top-down glasses and liquids · 22 Oct: "can we just revert to the old chai pans? ... this tea pan is still not top down properly and it's still not centred on the burner. I don't know why you can't see that"; "the tea glass is ... not exactly top down ... and it's not centred in the cup holder either" (screenshot 4) · 28 Oct (told again): "redo the chai pan and glasses to be proper top down" with his reference (sources/art/refs/2026-10-28-chai/glass-top-down-ref.png: the base centred, the rings even) · Superseded in part (Zafar, 29 Oct: "the pouring pans didn't work so now I'm switching to just having the pans move above the glasses and empty and the glasses fill up"): no tilted pan; the pan flat over its glass, emptying

**Check:** eye: 1366×768

**Source:** docs/design-language/ui-design-system.md §10; docs/feedback/s12-polish-2026-10-22.md B9; docs/feedback/chai-onboarding-2026-10-28.md P3

**Status now:** to fix: check · built 29 Oct in the live chai (s14-chai, build/reports/s14-chai.md); the judge, then Zafar's play

## Probes

- CHAI-08-p1-L1-1366x768: cook:chai-tray L1 @ 1366x768 [p-seen], at view: reached 1x (rec:view-marble 20.2s) · v2 mock-up: hob and tray about 15% bigger and lower, pans true top-down, tilted pan for the pour, real top-down glasses
- CHAI-08-p2-L1-1366x768: cook:chai-tray L1 @ 1366x768 [p-seen], at exp:pour: reached 1x (exp:pour-nana 28.3s) · the pour: the pan tilts over the glass and the liquid shows in the top-down glasses (the reference panel is the v2 mock-up, shot by build/tools/review/shoot_ref.mjs)
- CHAI-08-p3-L4-1920x1080: cook:chai-tray@L4 L4 @ 1920x1080 [p-seen], at exp:pour: reached 1x (exp:pour-nana 43.6s) · s14: the glasses from exactly above in their wells; L4's half glass stops at the fill's frame 4
- CHAI-08-p3-L4-930x430: cook:chai-tray@L4 L4 @ 930x430 [p-seen], at exp:pour: reached 1x (exp:pour-nana 101.4s) · s14: the glasses from exactly above in their wells; L4's half glass stops at the fill's frame 4

## Panels (`build/screenshots/evidence/r16pb-cook/CHAI-08.png`, `build/screenshots/evidence/r16pb-cook/CHAI-08-2.png`, `build/screenshots/evidence/r16pb-cook/CHAI-08-3.png`, `build/screenshots/evidence/r16pb-cook/CHAI-08-4.png`, `build/screenshots/evidence/r16pb-cook/CHAI-08-5.png`)

- **A**: cook:chai-tray L1 1366x768 [p-seen] · shot at rec:view-marble
- **B**: reference: build/sandbox/data/refs/chai-v2-mockup.png
- **C**: cook:chai-tray L1 1366x768 [p-seen] · strip:#stage:4x250 at exp:pour-nana
- **D**: cook:chai-tray@L4 L4 1920x1080 [p-seen] · strip:#stage:10x200 at exp:pour-nana
- **E**: cook:chai-tray@L4 L4 930x430 [p-seen] · strip:#stage:10x200 at exp:pour-nana

