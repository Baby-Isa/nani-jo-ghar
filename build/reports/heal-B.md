# heal-B: tooth, sore spots, eye (D15d, e, h; decision 27)

No mechanic removed beyond the report and decision 27. The art is stand-in for now. The plan's art swaps in by file name: each game's JSON has an `art` block, and the cut session sets `ready: true`.

## Per game
- **Tooth:** everything happens in one mouth close-up. The brush moves come one at a time (each is its own row). The camera pushes in on the sore tooth and stays inside the mouth. Jagged decay is scattered by level (1, 2 or 4 patches), and the drill's tip sits under the finger. The fill uses a press button, a nozzle and a gauge with green between red; the green narrows and the fill speeds up by level.
- **Sore spots:** spots in three colours pop up and down. The child pops the colours said with an ointment bud; the decoys stay. Then comes one named drink (four drinks): pour, add (a spoon count from L2), stir, give, and the rest of the spots fade. Level 3 uses *na*.
- **Eye:** only the sore eye is red, and the dropper sits over it. From L2, tapping the lit chart starts the test. **A** is the split screen; **B** is side by side, with the chart turned in perspective (`test.version`, or `?eyetest=a|b` in the lab). Chart rows highlight and tick like card rows. After *na*, the dropper pulses over the eye.

## Rows
Built, not yet replayed by Zafar: CLN-52 to 55, 59, 61 to 63. CLN-51 and CLN-60 are kept, and so is KEEP-10.

## Checks
- **Leak bots, L1** (must be under 10%): tooth 8.5% worst, taste 8.7%, eye 5.6%; the fair strategy wins 100%.
- **Other checks:** onboard, Kutchi, R5 unit tests and the old `leak_b` all pass.
- **Sandbox** (36 pages, every size, #mistake and #hint): every page ends, and `--check` passes with 0 new findings.

## Sheets
`build/screenshots/sandbox/heal-B-2/sheets/` (not committed). Flaws:
- On tablets the drawing stays small.
- The patient's speech bubble can sit off the top of the screen.
- The stand-in faces are flat next to Cook's art.

## Proposals (shared files)
- `scene.js`: make the close-up grow on tablets.
- `kit.js`: the `.pn` punctuation span is under 14 px on phones; keep the patient's bubble on screen.
- `pipeline.json`: rename `coated-tongue` to "sore spots", and add the bud to the tray.
- `main.js`: add a lab link for eye B.

## For Zafar
- A or B?
- For Mum's list: the drink names, *[red spots] na*, the colours, *malam* and the direction words.
