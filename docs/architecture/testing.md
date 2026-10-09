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

## Tools: review and check scripts (`build/tools/review/`, T1, decision 44)

Anything done the same way twice is a script. Each prints a short summary (counts, paths, top items), never a dump; each has `--help`; none uses the network. `node --test build/tools/review/review.test.mjs` tests them (synthetic shots, the repo's own docs).

| Tool | Command | Saves |
|---|---|---|
| Screenshot diff | `node build/tools/review/shotdiff.mjs [--run id] [--vs id] [--approve [--also id,id]]` | Compares a sandbox run's shots with the approved manifest (`build/tools/review/approved-shots.json`: size, pixel hash and a 16x9 thumbnail per shot, never images, B19) or another run; prints only changed and new shots and writes `<run>/sheets/changed.png` of just those. Approve a run only after its screenshots were looked at; approve from two runs of the same code (`--also`) so a state that wobbles with timing (Cook hints) keeps both variants. |
| Touched-flow mapper | `node build/tools/review/touched.mjs [--base ref] [--files a,b] [--json]` | From `git diff` lists the sandbox flows (decision 34), through what each page loads and the rules for `js/core`, `data/lang`, stations and heal games; prints the `--touched` command. |
| Regression lookup | `node build/tools/review/regress.mjs <flows> [--shared]` or `touched.mjs --json \| regress.mjs --stdin` | The `regressions.md` rows to recheck for those flows (id, status, check, one line); a shared-file change adds the Shared components rows. |
| Sprint check (decision 78) | `node build/tools/review/sprintcheck.mjs [--plan] [--since ref]`, then `--run`, `--sheets`, `--judge-prompt` | Every `regressions.md` row the sprint added or whose status or issue changed (default: since the commit before the newest `docs/sprints/S*.md` was created) → the sandbox flows that show it: the row's Check words first (games, stations, stages, flow ids; `L1–L3`, `#mistake`, bulb, `844x390` narrow levels, paths, sizes), else the `regress.mjs` lookup inverted (its section), else its issue words; a row about every game or a contract row with no other flow plays the contract route. Rows that map to nothing are listed UNMAPPED (a flow or a manual check before the sprint closes). `--run` plays them through `run.mjs --check` under the lock in 13-minute chunks (resumable, `--resume id`); `--sheets` (or `--sheets --from-run <gate run>`, nothing replayed) writes one evidence sheet per row, `build/screenshots/sprintcheck/<run>/<ROW>.png`, and `build/reports/sprintcheck-<run>.md` (row, flows, contract result, sheet, verdict); `--judge-prompt` is Fable's prompt to judge each sheet and fill the verdicts. `--quick`, `--sizes`, `--rows` narrow it. |
| Word checks (report-only; strict gate on Cook) | `node build/lint/words.mjs [--only a,b,c,d] [--strict]` | G26 literals in game code, English a child may see, misspelt variants from the engine's clash list, lines with no family recording. Allow-list `build/lint/words-allow.json`. Findings use the layout lint's shape so the sandbox can adopt them. `--strict` exits 1 on a finding; the standard check command enforces it (check A) on the folders in `build/lint/words-gate.json` `enforce` (js/cook, 0 literals); `ready` folders (js/clinic: 72) move to `enforce` when their step reports 0. |
| Status counts | `node build/tools/review/statuscounts.mjs [--write]` | Rebuilds the numbers of the "Open feedback" table in `docs/status.md` from `regressions.md` and lists prose to fix by hand. |
| Report skeleton | `node build/tools/review/skeleton.mjs <name> [--run id]` | Writes `build/reports/<name>.md`: proof section filled from the run (pages, end reached, findings vs baseline, sound gaps, shot diff, word counts), the QA results template and the regression rows. |
| Leak harness | `node build/tools/review/leak.mjs <config>` (`--list`) | One bot loop and a config per game in `build/tools/review/leak-configs/`. The twelve heal games (`clinic-heal-a/b/c` run several) use the shared loop and give the same verdict as the old scripts (the same numbers where the old script used the same seed and round counts: a, b, cut, ear, eye, knee, taste, tooth; boing, fever, foot, c differ in sampling only). A game with its own bot (`clinic`, `cook`, `dress`, `find`, `monsoon`, `snap`, `tidy`, `who`) has a `"script"` config naming its bot in `build/tools/review/leak-games/`; leak.mjs runs it and takes its output and exit code, so the verdict is identical by construction (checked line by line). The old `build/leak_*.mjs` are thin wrappers (`leak-wrapper.mjs`) with the same flags (R7). `cook` needs a browser: one at a time under the lock. |

| **Standard check command** | `node build/tools/review/checks.mjs [--only unit,words,bump]` | Every fast no-browser check in one run, one line each, exit 1 on any failure: the unit tests (shared kit, core, host, css lint, review tools), the word gate above, and `bump_version.py --dry-run` (R7). Browser checks stay separate and one at a time: `check_stamps.mjs`, the layout lint test, the sandbox. |

A review in short: `touched.mjs` → run its command → `shotdiff.mjs` → look at `changed.png` → `regress.mjs --stdin` → `skeleton.mjs <name>`. Before a publish, also the sprint check: `sprintcheck.mjs --plan` → `--run` (or `--sheets --from-run <gate run>`) → `--sheets` → `--judge-prompt` (decision 78).

## The contract checks (decision 75, rule C19; S04-A)

Zafar's "everywhere" rules are tested on every flow the sandbox plays, measured on screen and from the sound log, never from reading game code, so they hold whatever the shared host becomes. A probe injected into every page (`build/sandbox/lib/contract-hook.mjs`) records stage boundaries, the request pop-up, sidebar cards, ✓/Next/stage buttons, speech bubbles with their speakers' heads, end-screen badges, every image drawn and every real tap; the sound hook records every clip's real start, length and stop. `build/sandbox/lib/contract.mjs` turns that into breaks, each naming the flow, level, size, the state and a shot of the moment (`c<NN>-<kind>.png` beside the state shots).

| Check | Item | How it measures |
|---|---|---|
| contract-1 | the request pop-up, read out, then folded, before every play phase that gives an order | stages from `Cook.inStation` and `njgTest.state()`; the first real tap in the play area; an order = a line said outside a pop-up before it, a new sidebar card, or the first stage with a card; a pop-up must have been up since the last stage, a line must start while it is up, a card must show within 2 s of it closing |
| contract-2 | moves on by itself: no ✓, Next or stage button once the step is decided | each such button on screen, and each press of one, with what the game expected then: only that button (the clinic between stages, a heal game's `button` step, Cook clicking it) is a break; a count ended with Done is not; the shell between rounds is not |
| contract-3 | every stage and game end stops all voice | each clip's real interval (decoded length, or the file's own, and its stop); it belongs to the line and stage it was said for; still sounding 250 ms after that stage ended is a break. A Cook line that played nothing in the test build is bounded by its words' clip lengths (about 0.45 s a word without one), cut by the next Cook line or a voice stop |
| contract-4 | every bubble above (or below) its speaker's head | the bubble's box and tail against the head: a Cook character's sprite (top quarter), the clinic figure's art and head anchor, the doctor's figure (top fifth); tail in the head's column and the bubble above or below it; no head on screen, beside, or in a corner is a break |
| contract-5 | end-screen badges one, two, three | every 40 ms while the end screen is up: does anything of each badge show (its parts, or a picture on its spot) |
| contract-6 | no retired art | every image drawn by file and content hash against `build/sandbox/data/retired-art.json` (`node build/sandbox/lib/retired.mjs --write` makes it from the manifests' `replaces` entries plus the 8 Oct items, pinned to their old content so art redrawn under the same name passes) |

Run them on their own: `COOK_TEST_PORT=8841 flock -w 1800 /tmp/njg-browser.lock timeout 900 node build/sandbox/run.mjs --contract` (the route of 8 Oct at laptop size, about 2 minutes: the Chop tile on both pages, chaat L4, the pantry and the story round at a child's pace (`#speed1`), the waiting room, the diagnosis, the knee at L2, a morning) or `--contract --flow <ids> --sizes <s>`. Every `--check` (and so `--touched` and `--gate`) runs them over every page and exits 1 on any break; breaks are never ratcheted into the baseline. Output: `contract.md` (every check with how it measures, then every break) and `contract.json`. `node --test build/sandbox/contract.test.mjs`: one test per check on timelines recorded on 8 Oct's build (`build/sandbox/fixtures/contract/`), each break also mended and passing. `run.mjs --list` ends with every labs.html tile and the flows that play it (or why none). A shared file (`js/shared/`, `css/shared/`, `js/core/voice.js`) now reaches every game flow in `touched.mjs` (PRC-07); `regress.mjs` prints which rows the contract run checks.

## Tools: ops scripts and project skills (`build/tools/ops/`, `.claude/skills/`, T3, decision 44)

Same principles as the review tools: short summaries, `--help`, re-runnable, no network except git (the two exceptions are flagged: `mumround.mjs --go` calls Whisper through the existing Python scripts, `publish.mjs --go` polls the Pages site). Anything that writes or pushes is a dry run unless given `--go` (or `--out`, `--log`).

| Tool | Command | Saves |
|---|---|---|
| Brief generator | `node build/tools/ops/brief.mjs <spec.json> [--out f]` | The session brief from a JSON spec, with the standing lines and the regression rows (`regress.mjs`) for its flows. Example spec `build/tools/ops/specs/4e-clinic-engine.json`. |
| Mum-round pipeline | `node build/tools/ops/mumround.mjs <folder> [--go] [--draft-items]` | Transcribe (Whisper, `--go` only) → item list (draft from the transcript's question ids) → cut and normalise (`cut_family_clips.py`) → loudness check (EBU R128, ±3 LU of -16) → `import_all.mjs` (`--check` on a dry run) → gap counts. |
| Voice-note feedback | `node build/tools/ops/feedback.mjs <transcript> [part2] --name n` | The CLAUDE.md report skeleton: mechanics changed, every point with its time, draft regression rows with the next free ids, coverage of every line. |
| Publish | `node build/tools/ops/publish.mjs [--go]` | Preflight (branch, tree, `origin/main` ahead, bump size); `--go`: bump → commit → push branch and `HEAD:main` → wait for Pages to serve the stamp → screenshot `labs.html`. |
| Check-in summary | `node build/tools/ops/checkin.mjs [--log --note t]` | Commits by session since the last check-in, reports landed, art on `main`, sessions in `status.md`; `--log` appends the overnight-log line and moves earlier days to `docs/process/overnight-log/<date>.md`. |
| Mum question sheet | `node build/tools/ops/mumsheet.mjs [--out f.md --docx]` | The next round's sheet from `gap-list.md` and `clash-list.md`: quick checks, then Cook, then the clinic, capped per part. |

Skills (load only when needed; each points at the rulebook IDs): `/sprint`, `/brief`, `/checkin`, `/review`, `/publish`, `/mum-round`, `/feedback`, `/art-run`, `/handover`.

## Tools: R7 additions (leftovers closed, decision 45)

- **Stamps (`build/bump_version.py`):** `--dry-run` (and `--list`) now prints what a stamp reaches: the import map's modules by folder (js/core including js/core/lang/engine/, js/shared/{host,mode,input}.js, js/demo/, each mode's main.js), the stylesheets (css/shared/tokens.css by its tag and the `@import`), and the note that data (data/lang/** and every fetch) is stamped in code through `Cook.v()` / `njgV()`. `node build/check_stamps.mjs` proves it in a browser; the parked modes' pictures, faces and speech clips now go through `Cook.v()` too (`Snap.picture`, `Tidy.picture`, `Find.picture`, `Dress.face` stamp at the source).
- **Art judge setup:** `pip install -r build/tools/art/requirements.txt` (opencv-python-headless, numpy, pillow, scipy, pyyaml). `python3 build/tools/art/artjudge.py` then runs in full (about 2 minutes, 76 images).
- **Publish, two ways to confirm Pages:** by default `publish.mjs --go` polls `<site>/js/version.js`. Where github.io is blocked (a container's proxy), `--via api` (or `auto`, which falls back when the site can't be reached) asks the GitHub API for the "pages build and deployment" run of the pushed commit (`gh api repos/{o}/{r}/actions/runs?head_sha=`; the proxy blocks `/pages/builds`, not `/actions/runs`). `publish.mjs --pages <sha|main>` only waits for a commit. The API path can't screenshot the site: open `labs.html` after a hard refresh.
- **Mum item lists:** `node build/tools/ops/mumitems.mjs <recording|folder> [--write]` rebuilds `<stem>.items.json` (the `--items` file of `cut_family_clips.py`, and what `mumround.mjs` looks for) from `data/family-audio.json`, which keeps every take's question, id, Kutchi, English, speaker and times. The 5 Oct lists are committed beside the recordings in `sources/audio/mum-2026-10-05/`. Item format: `[{"qid": "C1", "at": 12.5, "items": [{"id", "kutchi", "english", "mum": [start, end] | "skip: why", "zafar": [start, end] | "skip: why", "note"}]}]`; full format in the header of `build/cut_family_clips.py`.
