# Tools

Every tool in one table. Run one when the job needs it; each prints its own `--help`. The rules that used to say "run X before Y" now live in the tools themselves where they can (decision 99).

## Checks (run these; they are the rules)

| Tool | What it does | When |
|---|---|---|
| `node build/tools/review/checks.mjs` | Every fast check in one run, one line each, exit 1 on any failure: unit tests, the word lint, the version-bump dry run, the evidence-spec lint, the picture-load check | Before every push |
| `node build/sandbox/run.mjs --flow <ids> --check` | Plays the game's flows in a browser, shoots every state, runs the 15 contract checks (one thing lit, the pop-up, voices, bubbles, words whole, …); exit 1 on a break, and on any clipped, ellipsised, broken, scrolled, covered or off-screen text (never baselined) | After a change to a screen; the full set only in `/review` |
| `node build/tools/review/evidence.mjs --run --rows <IDs>` | Red then green for a fix-list row (`--apply` refuses a PASS with no earlier FAIL on the same probe, `data/verdict-log.jsonl`; two FAILs since built make the row Zafar's): plays the row's probe and makes its evidence sheet; `--judge`/`--collect` for the independent verdict; `--apply` writes it (a FAIL reopens, a PASS moves the row to the archive) | Before and after every fix |
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
| `node build/tools/ops/brief.mjs <spec.json>` | A complete session brief from a small spec, with its fix-list rows | `/brief`, before any launch |
| `node build/tools/ops/checkin.mjs [--log]` | What landed since the last check-in | `/checkin` |
| `node build/tools/ops/feedback.mjs <transcript>` | A voice note -> the feedback report skeleton and draft rows (next free IDs) | `/feedback` |
| `node build/tools/ops/publish.mjs` | The publish gate first (`publishgate.mjs`: refuses while a fixable row is open, checks are red, or the last contract or evidence run is older than the game files), then bump the version, push to `main`, wait for Pages, shoot the live page | `/publish`, orchestrator only |
| `node build/tools/ops/mumround.mjs <folder>` | Mum's recordings -> clips, manifest, engine, gap counts | `/mum-round` |
| `node build/tools/ops/mumsheet.mjs` | The engine's gaps -> the next question sheet for Mum | `/mum-round` |
| `node build/tools/ops/unpushed.mjs` | Hook: warns after 30 minutes unpushed | Automatic |
| `python3 build/bump_version.py` | Stamps the new version on every page | Orchestrator, at a publish |

## Art and audio

`build/tools/art/`, `build/tools/audio/` and the `build/*.py` scripts cut, fit and check art and audio (most were one-off cuts for a past art run; `/art-run` and `/mum-round` name the ones they use). Skills live in `.claude/skills/`; the `judge` agent in `.claude/agents/`.

## Data the tools keep

`build/tools/review/data/` (verdict cache, status history), `build/sandbox/data/evidence.json` (each row's probe), `build/screenshots/` (runs; not in git).
