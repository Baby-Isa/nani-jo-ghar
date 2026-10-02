# heal-C: the fever room, the boing's drop machine, the foot's sole

Branch `ccr-fcd9dddd-wnywzc`. Nothing removed beyond D15f/g/i and decision 27. All words are placeholders "to record" (`data/clinic/lang.json` `fever-*`, `boing-*`, `foot-*`, appended).

## What changed
- **Fever → the room (D15f).** No close-up: the wide exam room, the patient's own figure on the bed (CLN-67). Kept: "take the temperature" (KEEP-10), then a live wall thermometer with a green zone. Window big, ceiling fan medium, hand fan small; heater big, hot-water bottle medium, blanket small; ice pack a spare (`rules.icePack: false`). Every tap toggles something (CLN-57); blanket over the shoulders (CLN-56); hot/cold body stand-ins (CLN-65, part). L1 three named "switch on" fixes; L2 + the undo verbs; L3 + "fix it" (may need two things). Each swing lands the named thing, plus at least one other, in the zone.
- **Boing (D15g).** Wipe (KEEP-07); drop machine (one dispenser L1–2, four at L3 with colours said), matte teardrop drops counted on the syringe; take back by tapping that drop (CLN-58); the glowing end starts the jab, no ✓, no glove; countdown in Kutchi words, BOING as a starburst (no written word); plaster; no apple, no lollipop (CLN-66, CLN-37).
- **Foot (D15i).** The sole; channels with square turns, clipped to the foot's edge (L1 straight, L2 1–2 turns, L3 three toes × 3 turns, narrower); touching the side = "ow", back to the last turn, a scored steady-hand row; toes named at L3 (CLN-64, CLN-47). The soak closes by grabbing a splinter (no ✓).
- Art swaps in by file name (`art` blocks in each JSON).

## Leak bots (2000 rounds, worst blind L1)
fever 5.5% (`reads-gauge` 2.5%), boing 7.2%, foot 6.9%; fair 100%. `build/leak_clinic_heal_{fever,boing,foot}.mjs`.

## Rows built (not re-played)
CLN-31, 37, 40, 47, 56, 57, 58, 64, 66 (boing data), 67 (fever's figure); CLN-65 part (stand-ins); SH-38/40/45 in all three; KEEP-07, KEEP-10 kept.

## Checks
Sandbox `--touched clinic:heal-{fever,boing,foot}` (36 pages, every size, L2, L3, `#mistake`, `#hint`): 0 new findings, every flow ends (run heal-C-2; boing#hint re-run heal-C-3 after the fix). Sheets: `build/screenshots/sandbox/heal-C-2/sheets/` (not committed). check_onboard, test_clinic_r5, check_clinic_kutchi pass. Looked at, flaws: tablet close-ups (boing, foot) don't grow (shared); the fever room's things are small on phones (48 px targets kept); the foot's L3 channels read busy.

## Shared-change proposals (group A)
1. `host.js` `HOST.stage`: skip the zoom when `camera.wide === "room"` (fever removes `.cl-zoom` itself until then).
2. A count anchor for non-tool counts (`ctx.countAt(el)`); boing draws its own `.hs-count` on the syringe.
3. `pipeline.json` fever items/ask: the room needs only the thermometer.
4. Closed card at 844×390: "TO RECORD" runs under the eye; the card's "," span is 13.7 px (text-small in heal-C-1).
5. Close-ups don't grow on tablets (scene.js).

## For Zafar
Kutchi needed: the room things and open/close/switch on/off/give/put on (word order), hot/cold lines, "fix it", drops/medicine, press, middle toe, "ow". Grammar notes already have *laal* (red) and *lilo* (green): use them for boing's colours?
