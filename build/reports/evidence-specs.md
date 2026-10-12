# Evidence specs: build/sandbox/data/evidence.json (12 Oct)

What it is: one entry for every live row of `docs/process/regressions.md`, written to the format in `docs/architecture/evidence-loop.md` (decision 82) and Fable's review (12 Oct). Each entry is one of:
- 1 to 3 probes (flow, path, level, sizes, profile, want, at, after, capture, expect, webgl, note);
- `{human}` when only Zafar can judge it;
- `{needsDecision, probes}` when the row waits on his yes (Fable 18). These go to `docs/status.md`, never to a sheet.

The file's header keys (`_expect`, `_capture`, `_at`, `_moments`, `_drivers`, `_tools`) define every word the specs use, for the tool builder. The JSON is valid. A check script confirmed that the 371 live rows are covered exactly once, every capture and expect is in the vocabulary, and every new driver is described.

## Coverage

| | |
|---|---|
| Live rows covered | **371 of 371**: 220 built, not re-played · 65 reopened · 43 open · 43 fixed. Keep and Retired rows are left out. |
| Probes | 509 |
| Expects (machine assertions) | 331. 199 rows have at least one. 171 rows have one on every probe, so they never reach a reviewer. |
| Human-only rows | 6 |
| needsDecision rows | 5 |

**Rows using each capture kind** (a row can use several): zoom2 130 · dom 112 · crop 87 · voice 62 · strip 50 · shot 46 · cmd 34 · contract 30 · trace 19 · ref 8.

**Sizes.** Each probe uses only the sizes its row names. The default is 1366x768. Phone rows use 844x390 and 800x360. 390x844 is used only for the rotate card. 915x375 has no sandbox entry, so it maps to 844x390. 16:10 rows use 1440x900 and 1280x800. Tablet and "phone/laptop/tablet" rows add 1024x768. The iPad hotspot check uses 1366x1024.

**Levels.** `level` can be a list (one panel per level), for example L1–L3 or L1–L4, wherever the row names a range.

## Expect vocabulary (in `_expect`)

`lexicon`, `hasWord:<tag>`, `textMatches`, `count`, `inside`, `noOverlap`, `centredOn`, `order`, `sameOrder`, `noClip`, `lines`, `minFont`, `minSize`, `countsUp`, `silentAfter`, `familyOnly`, `clipClass`, `gapMs`, `lastsMs`, `traceAmp`, `tracePeriod`, `traceRepeats`, `liveInput`, `pass`, and `!` (negation) in front of any of them.

- **Kutchi checks use the lexicon, never an English dictionary.** `lexicon` passes a word if it is in the family lexicon or inside a grey "to record" placeholder. "Thank you!" is in the lexicon (decision 81).
- **No spec hand-writes Kutchi** (rule 4). Numbers, sides and names are tagged words from the lexicon, checked with `hasWord:number`, `hasWord:side` and `hasWord:name`.

## Capture additions beyond the original format

- **From Fable's review:** `trace:<sel>:<ms>` (Fable 8), `ref:` (Fable 12), `cmd:` (Fable 13), `canvas:<texture>` (Fable 7), `tool:<id>`, `zoom2` at device scale 2 (Fable 6), `profile`, `want` (Fable 5) and `webgl`.
- **`contract:<n>`:** the breaks found by contract check n, with numbers as in `build/sandbox/lib/contract.mjs`.
- **`<sel>@<moment>`:** the element's text as it was at an earlier moment of the same play.
- **`flow: "repo"` with `at: "now"`:** for process rows that are only a script's output.

## Human-only rows (Zafar's ear or feel)

- **CHAI-01:** does the chai station feel fun enough?
- **CK-01:** do levels 2–4 of every game feel right?
- **CLN-36:** is the taste game understandable on a first play?
- **LNG-08:** a blind A/B of Mum's cleaned clips.
- **LNG-11:** Mum confirms *Muke de* and *Muke chai lai de*.
- **LNG-12:** in the clip picker, does each candidate say only the target word?

For sound rows, which clip plays, when and in what order is checked by machine with `voice` + `expect`. Whether it sounds right is left to Zafar.

## needsDecision rows

| Row | The question for Zafar |
|---|---|
| PAN-10 | Pantry wording and the folded guide box (pending decision) |
| SEK-14 | Pre-rendered skewer rack and plate, or plates laid out in code? |
| CLN-115 | Does the doctor call from the door, or is the sidebar box enough? |
| CLN-61 | Eye test: layout A or B? |
| CLN-122 | Knee close-up framing: is it right? |

## Drivers (paths, in `_drivers`): all 18 built (s04-e3, 12 Oct)

Each is a sandbox path (`build/sandbox/drivers/catalog.mjs`: the kinds of flow it plays on and the moments it records; `flows/index.mjs flowKind` lists them; flow ids may carry a hyphenated path, `cook:fetch#tap-during-speech`). Each plays fair except for its one move, through the games' own hooks only (`__cook.expectation()`, `__clinic.expect()`, the heal games' `debug.next()`/`slip()`, `RequestPopup`, the probe's own sound and Lifecycle events). Their descriptions in `_drivers` say what each does as built. Three more paths the specs needed: the clinic's `takeback`, `real-pace` (the clinic without `&fast=1`, where its zooms take 120 ms) and `mistake` on the game host and story days.

Smoked (runs ev-e3smoke1..3, 1366x768): wrong-extra-person, wrong-count (SH-50), serve-combined (SH-54), tap-during-speech (SH-20, PAN-11, CLN-35), tap-during-pause (LNG-07), mute-across-modes (SH-22), start-over (SH-60), tap-through-popup (SH-64), tap-quick (PAN-12), tawa-empty-then-off (MAA-11), idle-twice (MAA-13, SH-46, CLN-101), force-passme (ART-10), wrong-spice-thrice (DAAR-09), turn-early-late (SEK-09 L1–L4), wrong-thrice (CK-23), lab-log-on (CLN-07), heal-fast (CLN-109), find-scene (MOD-02), takeback (CLN-112).

**Named moments mapped** (`lib/moments.mjs` ALIASES): zoom-in (`.cl-zoom.on` shows), zoom-in-end, zoom-out (`.cl-outro`), taught (a fresh child's taught heal round: `taught-<game>`), greeting (Cook's `#choices`, the clinic's say pills), hearing-test (`heal:picture`), labs (the house's "Game labs" link, evidence runs only), retry (ticked rows reopen after a mistake), your-turn (Cook's reply pills; each clinic stage's first ask of a kind), daar-in, tap-no (first launch's No), pour (`step:pour`, the taste game's milk or water), after-mute, after-start-over, scene, count-word, knob-off, tawa-empty; served and after-wrong also match the game host's game-named states, and a heal slip answers after-wrong.

## Game-hook requests (what a driver cannot prove without one)

1. **The ghost finger's replays** (SH-46, MAA-13, CLN-101): in a second play, and at the ear's first step on a fresh play, no `.ob-ghost` was on screen during 4–20 s idle traces. Either no ghost comes after a pause (then the row's finding), or it plays too briefly to sample. Wanted: `Onboard` logs each ghost play to `Lifecycle.log` (`{what: "ghost", step}`), so a probe counts plays instead of catching frames.
2. **The dropper over the eye** (CLN-62): no element per eye. Wanted: the eye game's `debug.dropper()` and `debug.soreEye()` boxes (client px), so `inside:` decides it (the reviewer reads the zoom until then).
3. **The glowing next thing** (PAN-08, CHAI-10, CHT-05 in Cook: Phaser effects and drawn graphics, not textures; CLN-82, CLN-104 in the heal games: the tool strip never moves, a glow is on one tool): wanted `__cook.glowing()` and `debug.glowing()` (the glowing object or tool and its screen box) and a screen box on `__cook.gauge()`. The reviewer reads crops until then.
4. **Cook's sizzle** (MAA-11): a synthesized loop the sound hook cannot see; the driver wraps `Cook.sfx.sizzleLoop` at run time and logs it as `sfx/sizzle-loop`. A `Cook.sfx` event into the sound log would make it a first-class check.

## Tools needed (in `_tools`)

- `build/tools/review/heal-marks.mjs`: the words each heal game marks, and the eye chart's item pool (CLN-119, CLN-38).
- `build/tools/review/evidence.mjs --plan --all`: being built in parallel (PRC-06).

## Notes for the tool builder

- Selectors come from `css/shared` and `css/cook*`. Cook uses `#mission`, `#side`, `#stage`, `#count-badge`, `#passme` and `#btn-bulb`. The clinic uses `.cl-side`, `.cl-heal`, `.cl-stage`, `.hs-tools` (the heal tool strip; `.ng-tools` is the guide box's bulb and mute) and `.ng-bulb`. Shared screens use `.njg-guide`, `.njg-rq-card`, `.rs-words` and `.njg-done`.
- The inferred class names are resolved (s04-e3): the scrape's hand is `.cut-hand`, the fever gauge `[data-reading]`, CLN-62's eye zone has no element (game-hook request 2). Cook's request pop-up is `#intro .ic-card`; `.njg-rq-card` is the clinic's. The clinic's ✓ is `.njg-done.cl-go`.
- `canvas:<name>` resolves by texture-key prefix through the Phaser display-list walk, the same walk as `build/lint/phaser.mjs`.
- `cmd:python3 build/bg_align_check.py` (MOD-01) needs scipy in the sandbox.
