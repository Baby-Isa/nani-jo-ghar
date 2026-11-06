# The bulbs removed everywhere; the help comes (6 Nov 2026)

**Zafar, 6 Nov (~16:00):** "remove the bulbs from everywhere and retire them and take their rules out - they will be replaced by
chai's method. build the help comes now so it's tested in chai and used in post chai rollout."

## In plain words

No game draws or pulses a light bulb any more: not the day window, not the old clinic, not Cook (whose bulbs were already hidden).
Their four checks and their rules are retired. A new check, **the help comes** (contract-91), now watches every Cook and clinic play
stage: if a child is stuck on their turn past the level's hint wait, with nothing being said, the guide's hint must have come. On
chai it passes everywhere it ran; it found no place where the hint fails to come.

## Flaws first

1. **The end card still shows a bulb.** The end screen's hints badge (`js/shared/results.js`, `assets/ui/results/bulb-*.webp`,
   `icon-bulb.webp`) is a picture of a bulb that counts hints. It is a scoring badge, not the help, so I left it (non-negotiable 1).
   Question for Zafar: keep it, or redraw the hints badge without a bulb?
2. **The fair player is never stuck.** On the six chai pages of the brief's run the longest quiet stretch on the child's turn was
   3.7 s (L1) and 1.3 s (L4), under the 11 s and 17 s judge lines, so the check judged nothing there. The proof that it bites is the
   hint player (below) and the unit tests.
3. **The day window and the old clinic have no Nani's or doctor's line on the level's wait.** Wiring them was not small and clearly
   right, so they have rows: **RIDE-11** (the day window keeps the ride's own glow 5 s after each call) and **CLN-221** (the clinic:
   the heal games glow the step's tool on the wait, unspoken; the other stages have the first-time rungs). Both "to fix: code".
4. **A gap seen in the clinic, under the line:** on `clinic:heal-knee#hint` the child sat 8.6 s on the wrap step (L1) with no hint at
   all. The heal games' idle glow (`js/clinic/heal/scene.js` armGlow) skips a tool already picked (`.sel`), so the wrap step may
   never glow. 8.6 s is under the 11 s judge line, so no break; it is written into CLN-221's scope.
5. **`checks.mjs` art is red, not from this work:** 170 of 369 pictures fail on the branch's 458 changed pictures since `main` (the
   stove run); this work changed no picture.

## What was removed

| Where | What |
|---|---|
| `js/shared/bulb.js` | deleted (and `build/test_shared_bulb.mjs`); no page loads it (`cook.html`, `clinic.html`, `lab/kit.html`, Cook's and the clinic's script lists, the eight prototypes' lists) |
| `js/shared/guide.js` | the bulb button in Nani's (and the doctor's) box, `pulseBulbs`, `BULB_PULSE`, `BULBS`; `NaniGuide.poke` now logs `poke` (the end of a pour, `St.acted`) for the check |
| `js/day/window.js:87-118` | the day window's bulb, its English flip and its 250 ms pulse timer |
| `js/clinic/screen.js:33-44`, `kit.js`, `main.js`, `heal/host.js`, `stages/` | the doctor's bulb, `Kit.Bulb`, `Kit.BULB_MS`, the card's `bulbOpen`, the hint counter beside it, the bulb shim and its fade-in; `ctx.hint()` asks for nothing |
| `js/cook/ui.js` | `UI.bulb`, `UI.bulbOff`, `UI.bulbMs`, the shared and parked bulb, `ICON.bulb`, the `#btn-bulb` wiring, the bulb's English on the guide line and the closed card (`open`) |
| `js/cook/station-lib.js:367` | the 500 ms pulse of the hidden bulbs |
| `js/cook/flow.js`, `mount.js`, `main.js`, `words.js`, `stations/chai-tray.js` | the `ui-bulb` fade-in, the bulb selectors |
| `js/shared/order-card.js` | the closed card's small bulb (its peek sign is the eye), `opts.open` (the bulb's open card) |
| `js/shared/conversations.js`, `lab/conversations.html` | `Conversations.bulb()` and its event |
| CSS | `guide.css`, `order-card.css`, `cook.css`, `clinic.css`, `day.css`: every bulb rule and the `help-pulse` |
| Data | `data/shared.json` bulbMs, bulbPulseMs; `data/cook.json` calm.uiAfter; `data/kit-elements.json` the pulse patterns |
| Sandbox | the hint players no longer press a bulb; the probe's bulbs sample goes; the evidence probes of CLN-91 and SH-131 |
| Lint | the static `bulb` check becomes `hintwait` (one hint-wait table); the 14 known bulb findings dropped |

**Kept:** the peek at a closed card (a look, its eye badge), the word cards, the helper card, every hint and glow.

## What replaces the help, where

- **Cook (chai and every dish):** already chai's method: the word cards, Nani's helper card and her timed hint on the level's wait
  (`data/rules.json` levels.hintS, from the last action).
- **The clinic:** the heal games glow the step's tool on the level's wait (unspoken); the other stages have the first-time rungs.
  The doctor's spoken hint: CLN-221.
- **The day window:** the ride's own glow on the asked thing 5 s after its call. Nani's hint on the wait: RIDE-11.

## The new check: contract-91 help-comes

In a Cook station or a clinic stage, the stuck clock runs while the game waits for the child's move (the probe's new `want` sample:
a move, not wait, end, a button, the pop-up or a timing window) and nothing is being said; any action restarts it (a tap, a `poke`,
a step opening, the stage starting). Past the level's wait (7, 9, 11, 13 s) plus 4 s, the hint (Lifecycle `help`, `helper-open`,
`helper-call` or a `rung`) must have come since the last action. Skipped: `#mistake`, between stations, the end screen, old runs.
Unit tests: `build/sandbox/contract-help.test.mjs` (stuck with a hint passes, without one breaks, a talking stretch, the game's own
time, a timing window, the pop-up, #mistake and the clinic's stage).

**First results (numbers from the runs' timelines):**

| Page | Judge line | Longest quiet stuck | Hints | Breaks |
|---|---|---|---|---|
| cook:chai-tray, 1280x665 / 740x320 | 11 s | 3.7 s / 2.6 s | 4 (rungs) | 0 |
| cook:chai-tray@L4, 1280x665 / 740x320 | 17 s | 1.3 s / 1.1 s | 5 | 0 |
| lab:cook/chai-tray, 1280x665 / 740x320 | 11 s | 3.1 s / 2.9 s | 4 | 0 |
| cook:chai-tray#hint, 1280x665 | 11 s | **13.2 s, judged: the hint came** (help, helper card, her call) | 8 | 0 |
| cook:chai-tray@L4#hint, 1280x665 | 17 s | 12.8 s (the hint came anyway) | 9 | 0 |
| clinic:patient, 1280x665 (5 stages) | 11 s | 3.3 s | 0 | 0 |
| clinic:pharmacy@L3, 1280x665 | 11 s | 2.2 s | 0 | 0 |
| clinic:heal-knee#hint, 1280x665 | 11 s | 8.6 s (no hint; under the line: flaw 4) | 0 | 0 |

## Rows changed

- **Retired** (status "retired (Zafar, 6 Nov: the bulbs were removed everywhere, replaced by chai's method: the word cards and the
  timed hints)"): SH-96, SH-98, SH-100, SH-101, SH-41, SH-52, SH-57, SH-86, SH-131, CLN-91. CHAI-94 (already retired) now names
  contract-91 as its check.
- **New:** SH-228 the help comes, every game using chai's method (to fix: check; contract-91); RIDE-11 the day window; CLN-221 the
  clinic (to fix: code). `CONTRACT_ROWS`: contract-25, 27, 28, 29 out; contract-91 help-comes in (SH-228, CLN-221, RIDE-11).
- **Docs:** one line pointing at chai's method in place of each bulb rule: `ux-principles.md` §4 and its rules, `ui-design-system.md`,
  `rulebook.md` (a "The bulbs" row; the open question answered), `target-model.md`, `shared-api.md`, `clinic.md`, `cook.md`,
  `first-launch.md`, `conversations.md`, `conversations-wiring.md`, `easy-to-play.md`, `vision.md`, `qa-checklist.md`,
  `checks-to-build.md`, `mode-design-method.md`.

## Proof

- `COOK_TEST_PORT=8859 node build/sandbox/run.mjs --flow cook:chai-tray,cook:chai-tray@L4,lab:cook/chai-tray --sizes 1280x665,740x320 --check`:
  all six pages reach their end, 0 page errors, CONTRACT PASSED 0 breaks, CHECK PASSED 0 new findings.
- `--quick` (1280x665) on `cook:chai-tray#hint`, `cook:chai-tray@L4#hint`, `day:window`, `clinic:patient`, `clinic:pharmacy@L3`,
  `clinic:heal-knee#hint`: all reach their end, 0 page errors, 0 contract breaks, 0 new findings. No bulb is drawn on any page of
  either run except the end card's hints badge (flaw 1).
- `node build/tools/review/checks.mjs`: unit (89 files, 0 fail), words, static, leak, bump, specs, docs, recordings, fixlist, size,
  load: see the hand-back for the final line; art red from the branch's pictures (flaw 5).
