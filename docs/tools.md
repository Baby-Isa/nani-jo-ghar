# Tools

Every tool in one table. Run one when the job needs it; each prints its own `--help`. The rules that used to say "run X before Y" now live in the tools themselves where they can (decision 99).

## Checks (run these; they are the rules)

| Tool | What it does | When |
|---|---|---|
| `node build/tools/review/checks.mjs` | Every fast check in one run, one line each, exit 1 on any failure: unit tests, the word lint, the static checks (`build/lint/static.mjs`: shared-kit identity, tokens, level ladders, banned forms, privacy, rewards, the bulb), the version-bump dry run, the evidence-spec lint, the picture-load check | Before every push |
| `node build/sandbox/run.mjs --flow <ids> --check` | Plays the game's flows in a browser, shoots every state, runs the 19 contract checks (one thing lit, the pop-up, voices, bubbles, words whole, no English for the child, one face per person, …; `--store` plays the store build's voice path); exit 1 on a break, and on any clipped, ellipsised, broken, scrolled, covered or off-screen text (never baselined) | After a change to a screen; the full set only in `/review` |
| `node build/tools/review/evidence.mjs --run --rows <IDs>` | Red then green for a fix-list row (`--apply` refuses a PASS with no earlier FAIL on the same probe, `data/verdict-log.jsonl`; two FAILs since built make the row Zafar's): plays the row's probe and makes its evidence sheet; `--judge`/`--collect` for the independent verdict; `--apply` writes it (a FAIL reopens, a PASS moves the row to the archive) | Before and after every fix |
| `node build/tools/review/evidence.mjs --before [--check] \| --after \| --judge --brief <spec.json>` | The one loop (S13; `docs/architecture/evidence-loop.md` first section): a brief's rows before the build and after it, same probes and sizes (1280x665, 915x412), copied to `build/screenshots/brief/<brief>/<ROW>/`; `--check` the judge's before check; `--judge` the before-beside-after batch | Before at launch, after at the builder's finish, judge at review |
| `contract-78` to `-86` (`build/sandbox/lib/contract-s14.mjs`, run by the contract run on every page; S14, SH-168) | Zafar's 29 Oct notes as checks: a control's call and its light within 200 ms (78); the order card's light after the last move plus 500 ms (79); no layout change in a lab.html view's first 2 s (80); no pan picture over the heat ring (81); no lit-box edge across a face (82); no card over a face, from `njgTest.faces()` (83); the light lifts a dark thing by 12 of 255 (84); Play again keeps every picture, the painted worktop (85); no bubble over a side panel with room (86) | Every contract run |
| `evidence.mjs` film: `strip:body:60x200` (15+ frames) at `life:request`, path `order-whole` | Films a whole order: every frame, the changing ones on the sheet, a table of the pop-out, the row's scroll and cards, faces per frame (SH-167); the old 1 s strips missed the glide and the flight | Rows about motion |
| `node build/tools/review/loadtime.mjs [--record] [--root <repo>]` | Time and bytes from lab.html to the first play tap per game on a set slow line; a baseline (`build/tools/review/data/loadtime-baseline.json`); 20% growth fails | After a change to a game's loading |
| `node build/tools/review/faces.mjs`, `labcheck.mjs ... --until <sel> --play --eval <js>` | Every face box of a game at a size (`njgTest.cook.faces()`); labcheck's spill and speaker-spacing measure on cook.html, lab.html and the clinic's states | A new card, bubble or pop-out |
| `build/sandbox/lib/seed.mjs`: profiles `returning`, `pill-hidden`, `pill-miss`, `levelup-ready`; paths `replay`, `auto-level`, `speed1` on `lab:cook/<game>` | A seeded save for the word pill and the level-up, a round and Play again on lab.html, a child's pace | Evidence specs (`profile`, `path`) |
| `node build/tools/review/kitsheet.mjs --elem <name> [--before\|--after]` | One sheet per shared element (`data/kit-elements.json`) cropped from every live page at both sizes; `--elem help-ladder`: the stuck player at each rung | An element's build; the judge passes the element on it |
| `node build/tools/review/kitmap.mjs [--elem <name>]` | Every file:line that draws or styles an element: the kit first, then the copies | Briefs (PLACES); before moving an element |
| `node build/tools/review/evidence.mjs --plan\|--run --changed [--since <run id or commit>]` | Only the rows whose probes play a flow that files changed since the last evidence run reach (`touched.mjs` map); untouched rows keep their cached verdicts; `--plan --changed` prints the subset | A review round after a small change |
| `node build/tools/review/sprintcheck.mjs` | Plays every row a sprint touched, one evidence sheet each | `/review` before a publish |
| `node build/tools/review/touched.mjs` | From a git diff, the flows to rerun (shared files included) | After any change |
| `node build/tools/review/regress.mjs <flows>` | The rows (fix list and archive) to recheck for those flows | With `touched.mjs` |
| `node build/tools/review/shotdiff.mjs` | What changed between a sandbox run's shots and the last approved run | `/review` |
| `node build/tools/review/leak.mjs` | The Kutchi leak bots: can a player who knows no Kutchi win? | After a game change |
| `node build/tools/review/loadcheck.mjs` | Each page loads only its own pictures | In `checks.mjs` |
| `node build/tools/review/statuscounts.mjs [--write]` | Open and built counts per area for `docs/status.md` | At a handover |
| `build/lint/` (`words.mjs`, `css.mjs`, `layout.mjs`, `phaser.mjs`) | The word lint (no English for the child in game code), CSS lint, the screen lint (what is actually on screen at every state and size; run by the sandbox) and Phaser lint | `checks.mjs` and the sandbox |

## Operations

| Tool | What it does | When |
|---|---|---|
| `node build/tools/ops/brief.mjs <spec.json>` | A complete session brief from a small spec: the rows its tasks name and the open rows of the `elements` it names, PLACES (kitmap) for those elements, and the one loop's PROOF (checks, `evidence.mjs --after --brief`, its flows' contract run at 1280x665 and 915x412, no frames of its own) | `/brief`, before any launch |
| `node build/tools/ops/checkin.mjs [--log]` | What landed since the last check-in | `/checkin` |
| `node build/tools/ops/feedback.mjs <transcript>` | A voice note -> the feedback report skeleton and draft rows (next free IDs) | `/feedback` |
| `node build/tools/review/labcheck.mjs <lab page> [states...]` | A lab page at the four edge sizes before Zafar sees it: screenshots, page errors, every word that leaves its card, a contact sheet; exit 1 on any (Zafar, 28 Oct: the lab-first way) | the lab-first loop (CLAUDE.md fast lane) |
| `node build/tools/ops/publish.mjs` | The publish gate first (`publishgate.mjs`: refuses while a fixable row is open, checks are red, or the last contract or evidence run is older than the game files), then bump the version, push to `main`, wait for Pages, shoot the live page | `/publish`, orchestrator only |
| `node build/tools/ops/mumround.mjs <folder>` | Mum's recordings -> clips, manifest, engine, gap counts | `/mum-round` |
| `node build/tools/ops/mumsheet.mjs` | The engine's gaps -> the next question sheet for Mum | `/mum-round` |
| `node build/tools/ops/recordings.mjs [--check]` | Writes `docs/language/recording-sheet.md`: every gap in one sheet (1 grammar first, 2 Cook, 3 clinic, 4-6 the story frame, 7 other modes) from the gap list, the engine, `data/day.json`, the doctor's list and the open Mum questions; English only. `--check` (in `checks.mjs` as `recordings`) fails when the sheet is out of date | After `import_all.mjs`, a change to `data/day.json`, or a Mum round; `/mum-round` builds the next question sheet from it |
| `node build/tools/ops/unpushed.mjs` | Hook: warns after 30 minutes unpushed | Automatic |
| `python3 build/bump_version.py` | Stamps the new version on every page | Orchestrator, at a publish |

## Art and audio

`build/tools/art/`, `build/tools/audio/` and the `build/*.py` scripts cut, fit and check art and audio (most were one-off cuts for a past art run; `/art-run` and `/mum-round` name the ones they use). Skills live in `.claude/skills/`; the `judge` agent in `.claude/agents/`.

## Data the tools keep

`build/tools/review/data/` (verdict cache, status history), `build/sandbox/data/evidence.json` (each row's probe), `build/screenshots/` (runs; not in git).
