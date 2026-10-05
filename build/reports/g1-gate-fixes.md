# G1 gate fixes (finishing step 3)

No mechanic removed. A busy phone sidebar now folds in steps (item 1).

## Items
1. ✅ **Phones, three-person round.** When the sidebar still overflows at the frame's smallest fit, `js/cook/ui.js` folds it one step at a time:
   - idle people to their headline;
   - then to their faces (still the replay);
   - then rows as pills (decision 25).

   Chai L3/L4 fit at 800×360 and 844×390. Laptop is unchanged.
2. ✅ **SH-48.** No row wraps above the floor. Not fixable here: the clinic's "Ne poi cloth, ba dabs" wraps at 800×360 because it is already at the 14.5 px floor in an indented part. One line needs shorter text or a wider sidebar (Zafar's call).
3. ✅ **SH-47.** The closed card's head leaves the eye's corner free (`--oc-look-room`). **Stub:** `.cl-card { --oc-look-room: 0 }` sits in `order-card.css` but belongs in `css/clinic.css`, because the clinic's "···" already clears the eye.
4. ✅ **Day 6 at 1024×768.** The bubble sits beside the speaker's face; the covers-play-area finding is gone.
5. ✅ **Find it's dock.** Two rows of 48 px buttons, all five kept.
6. ✅ **Voice through the core.** `test_cook_voice` (stitched) and `voice-parity` pass. Family clips still play in the labs.
7. ✅ **Stamps.** `check_stamps`: 787 requests, 0 unstamped. All six parked modes reach their end.
8. ✅ **Stars test retargeted** to the parked modes' sets via `Stars.installInto`; it asserts that cook.json has none. 8/8 pass.
9. ✅ **C1's finding: read-along underlined the "to record" flag.** It now underlines the line only.

## Left
- **Daar at 800×360 during a 3.5 s peek:** the sidebar is 19 px over (was 44).
- **C1's "ne laal" at 8 px (taste L2):** not reproduced. The row sits at its 16.67 px minimum.
- **Not mine:**
  - `lab/order-card.html` loads without its CSS.
  - The day-6 Eid rug looks cut at the bottom.
  - Find it shows "Done ✓" in writing.

## Sandbox and checks
- `--touched cook:chai-tray,cook:daar,cook:day1` (41 pages): **check passed**. 0 new findings, 90 fixed, every page reaches its end.
- Re-runs after the later changes passed (`g1-b` to `g1-final`).
- QA:
  - automated checks clean;
  - changed screens shot at the three sizes and judged, flaws first;
  - rows SH-27, SH-36, SH-47 and SH-48 rechecked.
  - Not done: a second reviewer and the gate (orchestrator).

## Screenshots looked at (`build/screenshots/sandbox/`)
- g1-a/cook-chai-tray-l4/800x360/{03,06}
- g1-c/cook-chai-tray-l3/{844x390,1366x768}/05
- g1-c/cook-day1/844x390/06
- g1-daar/cook-daar-l{3,4}/800x360
- g1-b/cook-daar-l3-hint/800x360/05
- g1-day6/cook-day6/1024x768/{03,18}
- g1-find/mode-find/{800x360,1366x768}/04
- g1-d/clinic-*-l3/{844x390,800x360}
