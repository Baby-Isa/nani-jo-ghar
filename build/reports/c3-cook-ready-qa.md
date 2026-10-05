# C3 QA results (builder's pass; a second reviewer still to do)

```
QA: Cook, every flow (ui.js, order, bulb, voice) · reviewer: builder (C3), orchestrator to review · commit: see git log
Auto: sandbox --touched cook: (c3-proof, 248 pages) ❌ 4 new covers-play-area → fixed, c3-proof2 ✅ 0 new, c3-proof3 ✅ 0 new
      leak_cook ✅ · test_cook_host ✅ · test_cook_smoke ✅ · check_onboard ✅ · core tests ✅ · test_cook_voice ✅ · test_cook_lang ✅
      test_cook.py ⚠ not run (no Python Playwright in this container)
Screens (flaws first):
- chop L3 @ 1366x768: a hand holds the knife (ART-13, not new); "Kali ••• dungri." and rows without numbers ✅
- day2 greeting @ 800x360: the choices sit over the boy's chin (not new); speakers 48 px ✅
- samosa L3 @ 800x360: headline wraps to two lines (allowed: shrinks, then wraps); no numbers ✅
- chai tray L3 peek @ 800x360: "khun", no number ✅; guide line still an English "to record" placeholder (not new)
- sekelo L3 plate @ 1366x768: skewers fanned, handles off the plate and meeting at the rim; plate level with grill and rack ✅
- maani @ 1280x800, 844x390: headline "Muke maani khape." over "hakri maani" ✅; plates whole, tick clear of the turner ✅
- pantry @ 844x390 mid-fetch: headline and the done row's gold outline whole ✅
- grill, early turn @ 1366x768: raw side shown, back on the rack ✅
- samosa after a take-back: the Done tick stays up on an empty strip ⚠
Checklist: TXT ✅ · LAY ✅ (LAY-04 speakers fixed) · CMP ✅ · LNG ✅ · INT ⚠ INT-02 take-back only where physically possible · INT-10 ✅ · AUD ✅ (core voice) · ART n/a · CUL n/a
Regressions rechecked: PAN-01 ✅ · MAA-01 ✅ · MAA-08 ✅ · SEK-07 ✅ · SEK-09 ✅ · SH-35 ✅ · DAAR-08 ✅ · SH-13 ✅
Against Zafar's last feedback: decision 41 ✅ (every station, section 2 of the report) · decision 38d ✅ except the station iframes
```
