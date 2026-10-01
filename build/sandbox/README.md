# The sandbox and the layout lint

Plays the **live flows** through their real pages and lab URLs, records every visually distinct state (a screenshot plus a screen lint), and ratchets the findings against a baseline. It measures what is on screen, not the code, so it survives refactors. It changes no game file: the adapters (a seeded `Math.random`, a click-listener recorder, a `__heal` alias on the clinic page) are injected by Playwright.

## Run it

One browser at a time, your own port:

```
COOK_TEST_PORT=8812 flock -w 1800 /tmp/njg-browser.lock timeout 14400 node build/sandbox/run.mjs --all
```

| Flag | What it does |
|---|---|
| `--all` | every live flow at all five sizes (844x390, 800x360, 1366x768, 1440x900, 1280x800) |
| `--flow a,b` | named flows: an exact id, a prefix (`cook:`, `clinic:`) or a group (`house`, `first`, `cook`, `clinic`, `cook-parts`) |
| `--quick` | laptop size (1366x768) only, named flows only: for iterating |
| `--sizes 844x390,800x360` | choose sizes |
| `--check` | compare with `build/lint/baseline.json`; **exit 1** on a new finding, a flow that no longer reaches its end, or a new page error |
| `--update-baseline` | drop fixed findings from the baseline (it only shrinks). `--accept` also adopts new findings, and creates the baseline the first time |
| `--webgl` | Phaser's WebGL renderer for Cook. Default is canvas (about 4x faster; no tints) |
| `--list`, `--no-sheets`, `--run-id`, `--resume <run-id>` | list flows; skip contact sheets; name the output folder; skip flow-sizes already done in that run |

`node build/sandbox/run.mjs --list` shows the flow ids: `house`, `first`, `cook:title`, `cook:<station>` (fetch = the pantry, chai-tray, maani-line, mishkaki-grill, daar, chop, tadka, stir, assemble, samosa), `cook:<recipe>` (chai, maani, daal, chaat, samosa as `cook:recipe:samosa`, mishkaki), `cook:<station>@L3` (level 3), `clinic:waiting|diagnosis|pharmacy|sendoff` (+ `@L3`), `clinic:heal-<game>` and `clinic:patient` (+ `@L3`). Cook's parts (`cook-parts`) run only when named.

Typical loop while iterating: `--quick --flow cook:chai-tray --check`. Before a push: `--all --check`.

## What is checked (build/lint/layout.mjs)

At every recorded state, on visible elements only: **text-clipped**, **ellipsis** (only if it truncates; line clamps too), **text-small** (under 14 px as rendered, transforms included), **tap-small** (under 48x48 px; buttons, links, roles, inline handlers and anything given a click/pointer listener, found by an injected recorder), **text-offscreen**, **tap-offscreen**, **page-scroll**, **scroll-container**. Each finding has page, flow, state, size, selector and the measured value. `node --test build/lint/layout.test.mjs` runs the lint on `build/lint/fixtures/violations.html` and must find every planted violation and none of the clean elements.

Not checked: text drawn inside a canvas (Cook's Phaser scene); things covering other things (LAY-06); words broken mid-word; spacing on the 4/8 grid.

## The ratchet

`build/lint/baseline.json` is today's findings. A finding is identified by **check + flow + size + selector** (not by state name, so renaming a state is free). `--check` fails only on findings not in the baseline; it prints the fixed ones so the baseline can shrink. A flow that reached its end in the baseline and now stops short also fails, so a refactor can't hide findings by breaking a flow. Stable runs: `Math.random` is seeded per flow, and the clinic takes `seed=7`, so people, patients and orders repeat.

## Output

`build/screenshots/sandbox/<run-id>/` (git-ignored, never commit): `<flow>/<size>/NN-state.png`, `sheets/<flow>__<size>.png` (the contact sheets: one labelled grid per flow per size), `data/*.json` (raw), `summary.md` (states and counts).

## Notes

- The page fonts (Nunito, Baloo 2) are served from `build/sandbox/fonts/`, so text measures as it will on a device; all other network is blocked.
- The clinic runs with `quiet=1&fast=1&onboard=0` (and onboarding on for `clinic:patient`); the lab bar is off, it is developer chrome.
- The player is "fair": it does what the game asks. Mistakes and blind bots are out of scope.
