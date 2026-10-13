# Testing: how we check the code

The definition of done is `docs/process/qa-checklist.md`. This file is the practical side: ports, commands and lessons.

## The rule on browser tests (by ID)

**B16** (`docs/process/rules.md`): browser tests run one at a time (`flock -w 1800 … timeout`, own `COOK_TEST_PORT`, `--canvas` for `--days`, split by `--stations`); discard rewritten screenshots unless intended.

The quick (non-browser) tests for the shared modules are `build/test_shared_*.mjs` (for example `node --test build/test_shared_save.mjs`); the onboarding check is `check_onboard`.

---

## Ports and the rules for browser tests

- **One browser test at a time**, under `flock -w 1800 /tmp/njg-browser.lock timeout <seconds> …` (B16). At most about four sessions run at once and none spawns helpers (B1, B3).
- **Each session sets its own `COOK_TEST_PORT`**, named in its brief. The sandbox's default is 8812 (`build/sandbox/lib/env.mjs`); the 25 Sept per-mode ports (8800–8807) are retired. Ports in use by recent sessions: 8810, 8812, 8814, 8820, 8823. When a new session needs one, pick the next free number above 8823 and add it here.
- **Done means looked at, not tests passed** (non-negotiable 7): every state is screenshotted and judged by someone other than the builder; the QA checklist says how.
- **The Kutchi leak test applies to every game** (non-negotiable 6): `node build/tools/review/leak.mjs <game>` (`--list` names them), plus `build/leak_*.mjs`.
- **Reports** are `build/reports/<id>-<topic>.md`, under 300 words (B6); `skeleton.mjs` starts the proof section.

---

## Testing lessons from the alive-Nani test

From `docs/archive/art/alive-nani-test-2026-09-23.md`. Cook still runs on Phaser (`js/vendor/phaser.min.js`); the other modes are DOM/SVG. The wall-clock lesson holds for any headless test.

## LEARNING — Phaser's internal clock drifts badly in headless Chromium

`this.time.delayedCall` is driven by Phaser's own clock, which advances via
`requestAnimationFrame`. Headless Chromium throttles rAF well below 60fps
when the tab isn't "focused" (which a fresh Playwright page often isn't) —
observed a 2500–6000ms scheduled blink firing at ~10s wall-clock. Fixed by
scheduling blinks with plain `setTimeout` (wall-clock time) instead —
see `lab/nani-alive.html`'s `scheduleNextBlink`/`runBlinkCycle`. Tweens
(breathing/sway) were left on Phaser's clock since they're cosmetic only,
not correctness-tested.

## LEARNING — audio RMS thresholds must be calibrated per-project, not assumed

Initial mouth-sync thresholds (low 0.04 / high 0.14, coarse per-frame
smoothing) were tuned by feel and didn't match this project's actual word
clips: `assets/audio/word/snt-01.mp3`'s smoothed RMS peaks around
0.05–0.09, so "mouth-open" (0.14) almost never triggered. Fixed by:
- Measuring the real envelope (logged raw + smoothed RMS against
  `snt-01.mp3`) and setting `THRESH_LOW = 0.02`, `THRESH_HIGH = 0.06`.
- Switching to **frame-rate-independent** one-pole smoothing
  (`coeff = 1 - exp(-dt / tauMs)`, attack 30ms / release 90ms as time
  constants) rather than a fixed per-frame coefficient — the latter
  behaves differently at 60fps vs. headless Chromium's throttled rate.

If a future character's audio is louder/quieter, re-measure — don't assume
these exact numbers carry over.

---

## Tools

Every tool is in one table: `docs/tools.md`. The old per-step tool sections (T1, T3, R7, Sprint 5 package T) are in `docs/archive/process/testing-tool-sections.md`.

## The contract checks (decision 75, rule C19; S04-A)

Zafar's "everywhere" rules are tested on every flow the sandbox plays, measured on screen and from the sound log, never from reading game code, so they hold whatever the shared host becomes. A probe injected into every page (`build/sandbox/lib/contract-hook.mjs`) records stage boundaries, the shared lifecycle's own log (`Lifecycle.log`: request, advance, stage-end, results, each at its own millisecond), the request pop-up, sidebar cards (open or closed), ✓/Next/stage buttons (shown, or shown greyed), speech bubbles with their speakers' heads, end-screen badges, next-thing highlights, reply pills left from an earlier stage, the talk animations, backgrounds' scale across and down, every image drawn and every real tap (with what the game expected then, the staged talkers' poses, Cook's take-back and live pictures, and the heal game's count as it reports it to `ctx.tally`); the sound hook records every clip's real start, length and stop. `build/sandbox/lib/contract.mjs` turns that into breaks, each naming the flow, level, size, the state and a shot of the moment (`c<NN>-<kind>.png` beside the state shots).

| Check | Item | How it measures |
|---|---|---|
| contract-1 | the request pop-up, read out, then folded, before every play phase that gives an order | stages from `Cook.inStation` and `njgTest.state()`; the first real tap in the play area; an order = a line said outside a pop-up before it, a new sidebar card, or the first stage with a card; a pop-up must have been up since the last stage, a line must start while it is up, a card must show within 2 s of it closing; Nani's how-to step line and her 'pass me' (tagged `howto` / `passme` by the game, `Lang.role`) are not orders (decision 80) |
| contract-2 | moves on by itself: no ✓, Next or stage button once the step is decided | each such button on screen, and each press of one, with what the game expected then: only that button (the clinic between stages, a heal game's `button` step, Cook clicking it) is a break; the shell between rounds is not. A ✓/Done the child can still take back until Done (non-negotiable 12) is not: Cook's count or `more` step, an expectation offering a take-back (`undo`), Cook's pictures still taking taps (`live`: chaat's bowl), a heal count reported uncapped (the ear's drops, C10). A capped count (`ctx.tally {capped}`, the knee's wrap) still showing its ✓ is (decision 79). A button that starts the next part of the order (samosa's 'next kind', expectation `choice`) is not (decision 80) |
| contract-3 | every stage and game end stops all voice | each clip's real interval (decoded length, or the file's own, and its stop); it belongs to the line and stage it was said for; a stage ends at the lifecycle's own `stage-end` (`Lifecycle.log`, the latest in the 1.5 s before the sampler saw the change), so a line queued just after the stop belongs to the next stage; still sounding 250 ms after that stage ended is a break. A Cook line that played nothing in the test build is bounded by its words' clip lengths (about 0.45 s a word without one), cut by the next Cook line or a voice stop |
| contract-4 | every bubble above (or below) its speaker's head | the bubble's box and tail against the head: a Cook character's sprite (top quarter), the clinic figure's measured head anchor on its art (`data/clinic/heal-art.json` `anchors.head`, radius 0.12 of the art's height, the figure's own `artSpot("head")`; else the art's top fifth), the doctor's figure (top fifth); tail in the head's column and the bubble above or below it; no head on screen, beside, or in a corner is a break |
| contract-5 | end-screen badges one, two, three | every 40 ms while the end screen is up: does anything of each badge show (its parts, or a picture on its spot) |
| contract-6 | no retired art | every image drawn by file and content hash against `build/sandbox/data/retired-art.json` (`node build/sandbox/lib/retired.mjs --write` makes it from the manifests' `replaces` entries plus the 8 Oct items, pinned to their old content so art redrawn under the same name passes) |
| contract-7 | one voice at a time (PAN-04) | every clip said for a line, its real start and stop; two clips of different lines sounding together for more than 150 ms; estimated lengths are not judged |
| contract-8 | one next-thing highlight at a time (SH-53) | Cook's pictures carrying the shared glow (`glowFx`) and the clinic's `next-up` or pulsing tools (a tool family, all the plasters, is one); more than one for 300 ms or more |
| contract-9 | from L3 the card is closed (CLN-114) | the waiting room, the pharmacy and every heal game at level 3 or more: at the first play tap every sidebar card has OrderCard's `closed` |
| contract-10 | the talkers face the player on the child's turn (SH-71) | at each tap the clinic asked for, every staged talker (`.cl-staged`, `data-pose`) is `front`. Cook has no poses yet: its half is an eye check |
| contract-11 | backgrounds in proportion and sharp (PAN-14, ART-05) | each picture covering half the screen or Cook's canvas (`<img>`, CSS background, Phaser image): screen px per source px across and down; differing by more than 3% is stretched, over 1.5 (times the pixel ratio) is low-res |
| contract-12 | buttons hidden until usable, never greyed (SH-23) | a ✓/Next/stage button on screen disabled, aria-disabled, under 60% opacity or greyscale for 400 ms or more, not within 1.5 s of a press |
| contract-13 | each stage clears its own UI (CLN-06) | each reply pill remembers the stage it was first seen in; still up 600 ms into a later play stage |
| contract-14 | one talk animation (ART-18) | Cook's characters' repeating tweens against `Lifecycle.talk.SPEC` (2 px, 0.4°, 380 ms) and the play area's endless CSS talk or bob animations (only `njg-talk`) |

Every `regressions.md` row whose Check says "contract check" or names a `contract-N` must be covered by that check in `CONTRACT_ROWS` (`build/tools/review/lib/regressions.mjs`; `review.test.mjs` fails otherwise). A rule that can't be measured on screen or in the sound log is an eye check on the sprint check sheet ("eye: <state> (sprint check sheet)"), judged by Fable.

Run them on their own: `COOK_TEST_PORT=8841 flock -w 1800 /tmp/njg-browser.lock timeout 900 node build/sandbox/run.mjs --contract` (the route of 8 Oct at laptop size, about 2 minutes: the Chop tile on both pages, chaat L4, the pantry and the story round at a child's pace (`#speed1`), the waiting room, the diagnosis, the knee at L2, a morning) or `--contract --flow <ids> --sizes <s>`. Every `--check` (and so `--touched` and `--gate`) runs them over every page and exits 1 on any break; breaks are never ratcheted into the baseline. Output: `contract.md` (every check with how it measures, then every break) and `contract.json`. `node --test build/sandbox/contract.test.mjs build/sandbox/contract-rows.test.mjs` (part of `checks.mjs` unit): one test per check on timelines recorded on 8 Oct's build (`build/sandbox/fixtures/contract/`) or built from the probe's event shapes, each break also mended and passing. `run.mjs --list` ends with every labs.html tile and the flows that play it (or why none). A shared file (`js/shared/`, `css/shared/`, `js/core/voice.js`) now reaches every game flow in `touched.mjs` (PRC-07); `regress.mjs` prints which rows the contract run checks.
