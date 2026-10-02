# heal-B: the tooth, the sore spots, the eye (D15d, D15e, D15h; decision 27)

Branch `ccr-fcd9dddd-wnywzc`. No mechanic removed beyond the report + decision 27. Stand-in art; the plan's art swaps in by file name (each game's `data/clinic/heal/<game>.json` → `art`, `ready: false` until the cut session sets it).

## Per game
- **Tooth:** one mouth close-up (gums, teeth, the real toothbrush); brush moves said **one at a time** (each its own row, L3 six); a push-in (match cut) on the sore tooth, still in the mouth; **jagged decay scattered by level** (1 / 2 / 4 patches) drilled with the drill's tip under the finger; the fill: a **big press button**, a nozzle, a gauge with **green between red**, narrower and faster by level (data `fill`). Letting go under the green just pauses.
- **Sore spots:** three colours pop up and down (whack-a-mole); pop the colour(s) said with an **ointment bud** (never a pin), decoys stay; then one named drink (four: hardar waaro dudh, [honey] waaro dudh, aadu ne paani, limu ne paani): pour (the kit's pour look into the steel tumbler), add (spoon count from L2), stir, give: the rest fade. L3 "[spots], [red spots] na". Wrong drink: a face, try again (first is scored).
- **Eye:** front close-up, only the sore eye red, the dropper hangs over it; L2+ the lit corner chart starts the test (no ✓). **Version A** split screen / **B** side by side with the chart turned in perspective (`test.version`, lab `?eyetest=a|b`). Chart rows "now" band and gold tick; after *na* the dropper pulses over the eye.

## Rows built (not re-played by Zafar)
CLN-52, 53, 54, 55, 59, 61, 62, 63; CLN-51, 60 kept; SH-38/39/40/44/45 for these games; KEEP-10 (drill, tongue pops, redrop).

## Checks
Leak bots (L1, 5000 rounds; must be <10%): tooth worst 8.5%, taste worst 8.7%, eye worst 5.6%; fair 100% every level. `leak_clinic_heal_b`, `check_onboard`, `check_clinic_kutchi`, `test_clinic_r5` pass. Sandbox `--touched clinic:heal-{tooth,taste,eye}` (36 pages, every size, #mistake, #hint): every page reaches its end; `--check` passed, 0 new findings (run heal-B-2; the first run's 3 phone findings, the drops row's comma under 14 px, fixed by dropping the comma).

## Sheets
`/home/user/heal-B/build/screenshots/sandbox/heal-B-2/sheets/` (not committed, B19). Flaws first: tablets show the 800×500 drawing small with empty space (shared); the patient's speech bubble can sit off the top edge (shared); stand-in faces are flat next to Cook's art until the plan's M1/M2/Y/T/C art lands.

## Shared-change proposals
- `scene.js`: grow the close-up on tablets (crop to the safe area, not `meet`).
- `kit.js`: the `.pn` punctuation span renders under 14 px on phones; the patient's bubble should stay on screen.
- `pipeline.json` (group A): `coated-tongue` → "sore spots", tray `cotton-bud` + the drinks' things.
- `js/clinic/main.js`: a lab link for eye version B.

## For Zafar
Version A or B? The four drink names and *[red spots] na* are engine joins of existing words: for Mum's list with the colours, *malam*, and the direction words.
