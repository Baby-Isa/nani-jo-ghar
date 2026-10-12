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

## Drivers needed (paths, in `_drivers`): 18

wrong-extra-person, wrong-count, serve-combined, tap-during-speech, tap-during-pause, mute-across-modes, start-over, tap-through-popup, tap-quick, tawa-empty-then-off, idle-twice, force-passme, wrong-spice-thrice, turn-early-late, wrong-thrice, lab-log-on, heal-fast, find-scene.

There are also 18 named moments in `_moments`. Some are general forms: `exp:<key>`, `phase:<p>`, `step:<id>`, `visible:<sel>`, `only:<sel>` and `every:<moment>`. The rest are named states: served, fold, pass-me, greeting, zoom-in, zoom-out, hearing-test, taught, daar-in, retry, after-wrong, after-mute, after-start-over, idle, labs and scene.

## Tools needed (in `_tools`)

- `build/tools/review/heal-marks.mjs`: the words each heal game marks, and the eye chart's item pool (CLN-119, CLN-38).
- `build/tools/review/evidence.mjs --plan --all`: being built in parallel (PRC-06).

## Notes for the tool builder

- Selectors come from `css/shared` and `css/cook*`. Cook uses `#mission`, `#side`, `#stage`, `#count-badge`, `#passme` and `#btn-bulb`. The clinic uses `.cl-side`, `.cl-heal`, `.cl-stage`, `.ng-tools` and `.ng-bulb`. Shared screens use `.njg-guide`, `.njg-rq-card`, `.rs-words` and `.njg-done`.
- A few class names are inferred and not confirmed: `.oc-row.done`, `.cl-hand`, `.cl-gauge`, `.cl-eye-zone`, `.njg-home`. If one does not match, it fails as a tool failure (Fable 3); fix the spec.
- `canvas:<name>` resolves by texture-key prefix through the Phaser display-list walk, the same walk as `build/lint/phaser.mjs`.
- `cmd:python3 build/bg_align_check.py` (MOD-01) needs scipy in the sandbox.
