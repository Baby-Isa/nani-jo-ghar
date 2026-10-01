# The sandbox and the layout lint

Plays **every live flow, at every level and on every path**, through its real page or lab URL, records every visually distinct state (a screenshot plus a screen lint, DOM and canvas), listens to what the game says, and ratchets the findings against a baseline. It measures what is on screen, not the code, so it survives refactors. It changes no game file: every adapter (a seeded `Math.random`, a click-listener recorder, a Phaser hook, a sound hook, touch input, a `__heal` alias on the clinic page) is injected by Playwright.

## Run it

Always under the browser lock, on your own port. Never hold the lock for more than about 20 minutes at a time.

| You want | Run |
|---|---|
| **What a session changed** | `COOK_TEST_PORT=8814 flock -w 1800 /tmp/njg-browser.lock timeout 1200 node build/sandbox/run.mjs --touched cook:chai-tray,clinic:waiting --parallel 3 --budget-min 13 --check` |
| **Everything (the gate), before the push to `main`** | `COOK_TEST_PORT=8814 node build/sandbox/run.mjs --gate` |
| One page while iterating (laptop, one flow) | `COOK_TEST_PORT=8814 flock -w 1800 /tmp/njg-browser.lock timeout 600 node build/sandbox/run.mjs --quick --flow cook:chai-tray --check` |

**`--touched <flows>`** runs the named flows with every level and path of them (`cook:chai-tray` also runs `@L2`, `@L3`, `@L4`, `#mistake`, `#hint`; a group or prefix such as `cook:` or `clinic:` works too) at each flow's sizes, then `--check`. Keep it inside `flock ... timeout 1200` with `--budget-min 13`: if it prints `N pages left` (exit 75), run the same line again with `--resume <run-id>`.

**`--gate`** is everything: every flow, every level, both paths, every size it has, 3 pages at once inside one browser. It takes and releases the lock itself, in chunks of about 13 minutes (each chunk is `flock ... timeout 1200`), so another session can use the browser in between, and it ends with the `--check` verdict (exit 0 or 1). If it is interrupted, run the same command with `--resume <run-id>` (the id is printed). A full gate takes about GATE_TIME of browser time.

| Flag | What it does |
|---|---|
| `--gate`, `--touched ids`, `--all`, `--flow ids` | which flows. `--flow` takes an exact id, a prefix (`cook:`, `clinic:`), a trailing `*` or a group (`house`, `first`, `cook`, `cook-parts`, `cook-recipes`, `clinic`, `modes`, `extra`) and runs just those ids |
| `--quick` | laptop size (1366x768) only, named flows only |
| `--sizes a,b` / `--every-size` | choose sizes / run every flow at every size (slow) |
| `--parallel N` | pages at once in the one browser (default 1; `--gate` uses 3) |
| `--budget-min M` | start no new page after M minutes; exit 75 if some are left |
| `--check` | compare with `build/lint/baseline.json`; **exit 1** on a new finding, a flow that no longer reaches its end, a new page that does not reach its end, or a new page error |
| `--update-baseline` | drop fixed findings (it only shrinks). `--accept` also adopts new ones and creates the file. `--append` only **adds** findings and pages the baseline lacks and changes no existing entry |
| `--webgl` | Phaser's WebGL for Cook (canvas is the default: about 4x faster, no tints) |
| `--from-run <id>` | judge a finished run's saved data (no browser): `--all --from-run <id> --check` |
| `--list`, `--no-sheets`, `--run-id`, `--resume` | list flows (with their sizes); skip contact sheets; name the output folder; continue a run |

## What is covered

**Sizes (touch emulated on every phone and tablet):** 844x390 and 800x360 phones; 1024x768, 1180x820 and 1366x1024 tablets; 1366x768, 1440x900 and 1280x800 laptops; plus one upright phone shot (390x844) of every page for the rotate card (the flow `rotate-card`). Phones and tablets use `hasTouch` + `isMobile`, and the players' canvas gestures (tap, hold, drag, circle) go in as real touch events (`lib/touch.mjs`).

**Flows** (`--list` shows every id with its sizes):
- the house, first launch, Cook's title; every Cook station (the pantry is `fetch`) and the chai and chaat recipes, each at **levels 1, 2, 3 and 4** (`cook:chai-tray@L2`); the other recipes (maani, daal, samosa, mishkaki) and the Cook parts (groups `cook-recipes`, `cook-parts`); **story days 1-6** (title, every order, summary, shop); **the shop**; **the open kitchen**;
- the clinic's four stages at levels 1-3 (the waiting room also at 4 and 5: the only stage that has them), the nine healing games at levels 1-3, the parked heal games (tummy, hic, hair, on the heal host lab), One patient at levels 1-3;
- a **smoke flow for each parked mode** (`mode:tidy`, `mode:who`, `mode:dress`, `mode:monsoon`, `mode:snap`, `mode:find`): the first mini-game at level 1, to its end, at phone and laptop size.

**Paths** (`#mistake`, `#hint` after the id):
- **fair**: does what the game asks (the default);
- **`#mistake`**: a wrong pick, tap or amount where the mini-game allows it (a wrong item, a decoy sliced, one too many, the wrong stir speed, the wrong greeting; in the clinic a wrong dish, probe, seat or card, and a healing game's own `debug.slip()`), then on to the end. It records the wrong-answer feedback and the end review with its red-outlined words;
- **`#hint`**: asks for help: waits for the hesitation hint and glow (Cook's lab is played unguided; the clinic's first-time help is on), presses the light bulb (the English flip; three times in Cook so the end card's bulb dims), peeks at a closed card. It records those states and the end card with its dimmed bulb.

Levels a flow does not have are not run: Cook has 1-4; the clinic stages 1-3 (the waiting room 1-5); the healing games 1-3.

**Sizes per flow.** The main flows (level 1, and the first level-3 runs) run at all eight sizes. The deeper paths (levels 2-4, mistake, hint, parts, other recipes, days, the clinic's extra levels) run at ONE of the two sizes that bound the others, 800x360 (the tightest phone) or 1024x768 (a 4:3 tablet), alternating down the list so each gets half; days 1 and 6 and the shop and open kitchen run at both; the parked modes run at 800x360 and 1366x768. Every path at every size would be about 6 hours of browser time: `--sizes a,b` runs chosen sizes of any flow and `--every-size` everything everywhere. Change the policy in `flows/index.mjs`.

## What is checked

At every recorded state, on visible elements only:

| Check | Meaning |
|---|---|
| `text-clipped`, `ellipsis` | text cut by its own box or a parent; a truncating ellipsis or line clamp (TXT-01, TXT-02) |
| `text-small` | text under 14 px as rendered, transforms included (TXT-05) |
| `tap-small` | a tappable thing under 48x48 px (LAY-04): buttons, links, roles and anything a recorder saw take a listener |
| `text-offscreen`, `tap-offscreen`, `page-scroll`, `scroll-container` | running outside the screen; the page or a child scrolling |
| `covered` | something sits on a tappable thing: the topmost element at its visible centre is neither it nor a child (LAY-06). A full-screen scrim or modal over everything is by design; a cover that is moving is passing by. The players also report a canvas tap whose point was covered |
| `covers-play-area` | something other than the canvas on top of the middle of the play area (LAY-06) |
| `word-broken` | a word split mid-word across two lines (TXT-10) |
| `canvas-text-small`, `canvas-text-offscreen`, `canvas-text-covered` | **text drawn in Cook's Phaser canvas**: the lint walks each scene's display list (containers included) and measures the rendered size (font size x the object's and its containers' scale x camera zoom x the canvas's CSS scale) and where it lands on screen (`build/lint/phaser.mjs`). Identified by its style (`canvas > Text[34px bold]`), not by its words |
| `spacing-grid` | static CSS (`css/**`): a margin, padding or gap in px or rem that is not 0, 4, 8, 12 or a multiple of 8 (LAY-03). `build/lint/css.mjs`; runs as the flow `css` (no browser) |

Each finding has page, flow, state, size, selector and the measured value. `node --test build/lint/*.test.mjs build/sandbox/*.test.mjs` runs the lint on fixtures (`build/lint/fixtures/`: `violations.html`, `covering.html`, `phaser-text.html`, `spacing.css`); it must find every planted violation and none of the clean elements.

Each state is linted twice, 300 ms apart, and only what shows in both counts (an animation half-way through is not a finding). The end-of-round card pops its badges in one at a time (about 2.2 s); the sandbox waits for the last (the light bulb) before it records, so a half-drawn card is never judged.

## Sound

A hook in every page (`lib/sound.mjs`) wraps `HTMLMediaElement.play`, Web Audio buffer sources (followed back to the file they were fetched from), `speechSynthesis.speak`, and the games' own "say a line" functions (`Cook.Lang.speak`, `Cook.speak`, the clinic's `Voice.say` and `Voice.now`). Each play is classified against `data/family-audio.json`: **family-ok** (a checked family clip), **family-unchecked**, **tts** (a computer-voice placeholder, `assets/audio/cook-tts/`), **other** (the older `word` and `carrier` files, not family-listed) or **device-voice**. A line is attached to what played while it was open; a line that played nothing is **silent**.

The run output (`summary.md`, `sound.json`, the console) has **the recording gap list** (every line never heard whole from family clips, with what played instead and where) and the list of played files that are not an approved family clip. It is informational in the test build (TTS never ships, rule 10): it never fails `--check`.

## The ratchet

`build/lint/baseline.json` is today's findings. A finding is identified by **check + flow + size + selector** (not by state name). It only fails as NEW if even check + size + selector is unknown in every flow; a known one turning up in a different flow is printed as "moved". `build/lint/ignore.json` lists the few findings that are timing noise by design, each with its reason. `--check` fails only on findings not in the baseline and prints the fixed ones so the baseline can shrink. A flow that reached its end in the baseline and now stops short also fails, and so does a page not yet in the baseline that does not reach its end. A new flow or size enters the baseline with `--update-baseline --append`. Stable runs: `Math.random` is seeded per flow and the clinic takes `seed=7`.

## Output

`build/screenshots/sandbox/<run-id>/` (git-ignored, never commit): `<flow>/<size>/NN-state.png`, `sheets/<flow>__<size>.png` (the contact sheets: one labelled grid per flow per size), `data/*.json` (raw), `summary.md`, `sound.json`, `chunks.log` (the time per chunk).

## Notes

- The page fonts (Nunito, Baloo 2) are served from `build/sandbox/fonts/`, so text measures as it will on a device; all other network is blocked.
- The clinic runs with `quiet=1&fast=1` (first-time help on for `clinic:patient` and every `#hint` flow, off elsewhere); the lab bar is off, it is developer chrome.
- Cook runs on Phaser's canvas renderer (no tints); `--webgl` for fidelity. Cook at test speed 3, the clinic fast, Monsoon on its virtual clock.
