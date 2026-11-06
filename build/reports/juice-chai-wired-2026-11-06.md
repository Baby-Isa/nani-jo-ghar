# Chai's juice wired in: Zafar's picked sounds and effects (6 Nov 2026)

**Zafar, 6 Nov ~17:30:** his picks on `lab/juice.html` ("feel free to put them in the live game"); **~17:45:** he did pick the pours
(pour A, short pour A). Rows: CHAI-92, CHAI-87, SH-226, CHAI-93. Branch `ccr-1f71c98a-wwowh8` (this worktree), not pushed.

## Flaws first

1. **Nobody has heard it in the game.** The sandbox has no speaker: every level is as the lab played it (the file as cut, gain 1;
   the made drop at twice the lab's gain), and the timing is proven from the sound log, not by ear.
2. **Three picked sounds are Mixkit** (knob A `knob-a`, green A `ding-a`, the sparkle's chime A `sparkle-a`): free for the app, but the
   licence forbids offering the file on its own, and the open repository and the web build do. **Decision for Zafar before the
   stores:** keep them (and take them out of the public repository) or take a CC0 option. Everything else picked is CC0.
3. **The gate drops sounds he may expect.** No effect longer than 120 ms starts while a family line sounds (ticks play ducked). In
   play that silences some moments he picked: the shelf's short pour and the bottle's settle are often dropped, because the item's
   word ("paani") is still being said as the bottle tips and lands; the sparkle's chime under the serve's "barabar" never plays.
   This is the rule he set (the voice is never masked); if a moment feels empty, the fix is timing, not a louder sound.
4. **The tray's twinkles are drawn in added light** (`add: true`): in plain light the s17 sparkle sprites were invisible on the wood
   and the glass (measured: the sprites were there, alpha 0.8, no visible pixels). They now read as gold glints; the judge decides.
5. **Shared pieces changed for every station, not only chai** (non-negotiable 6, the same shared screens everywhere): the kit's
   knob (knob A, then flame B as it lights) in every stove game; the gold burst behind the end screen's stopwatch and the serve's
   stamp in every Cook station (the clinic's end screen does not load the juice kit yet: one script line when he wants it there).
6. **The existing Done sparkle is a verdict-ish picture he never commented on**: chai's `fx("sparkle")` at Done shows only over a
   glass that came out right (`chai-tray.js`, the review). It now draws the s17 twinkles instead of the s11 star (one sparkle look);
   I did not remove it (non-negotiable 1). Question for him: keep, or every glass?
7. Reduced motion: every effect is a fade in place in code (`Juice.less()`), shot below.

## What plays where

| Moment | Sound (pick, file, licence) | Effect | Where |
|---|---|---|---|
| A soft tap, an item off the shelf | "Now": the made `cook-pop`, first thing at the tap | the item lifts (as before) | `chai-tray.js` `use()` |
| The shelf's water or milk goes in | short pour A: `pour-a` first 0.9 s, faded (CC0) | none (ART-31) | `pourInto`, 170 ms into the tip |
| The bottle back on the shelf | settle A: `settle-a` (CC0), as it lands (was the made `tap`, 1.7 s late) | its squash (as before) | `pourInto` |
| The gas knob turns | knob A: `knob-a` (Mixkit) (was the too-quiet `click`) | the knob turns | `kitchen-kit.js` `b.set` |
| The flame catches (off to on) | flame B: `flame-b` (CC0), 180 ms after the knob | the flame fades in | `kitchen-kit.js` |
| The pan heats past the middle | simmer A: `simmer-a` loop (CC0), 35% to 100% as it nears the green, gone at the turn-down; silent under a voice | steam 1: the s17 full wisps rising off the far rim from the boil to the turn-down (was the s11 curl now and then) | the heat tick; `Juice.P.steam` |
| The heat reaches the green | green A: `ding-a` (Mixkit) | the ring (as before) | the heat tick |
| A boil-over | `puff` (unchanged: no pick) | the s17 wisp, twice (was s11) | `boilOver` via `fx("steam")` |
| The pan pours into the glass | pour A: `pour-a` loop (CC0), at its own level (was the made `pour` loop) | the s14 pour (as before) | `teaPourLoop` |
| The glass is poured | drop B (the made plink, at 2x: gain 0.16) as the drop lands, with glass C: `glass-c` (CC0) (was `right` at 0.35) | the painted drop falls from a third of the lab's height, smaller, clear of the face | `glassDone` |
| A full glass | the sparkle's chime A: `sparkle-a` (Mixkit) | sparkle 2: three twinkles over the glass's right half | `glassDone` |
| The word moment's pour | pour A loop as `pour-glass` (the made loop only while the file is not in) | (as before) | `word-moment.js` |
| The word moment's last drop | drop B (2x) as it lands | last drop 1: the painted drop and its crown (was a CSS shape) | `word-moment.js` via `Juice.drop` |
| The serve's stamp | chop + soft (unchanged), the chime A after 120 ms (the gate drops it under "barabar") | gold burst 1 behind the stamp | `flow.js` `servedMoment` |
| The end screen's stopwatch | the chime A (not over a new best's `bing`) | gold burst 1 behind the watch, every round | `results.js` `animate` |

**Levels:** the files play as cut and levelled by `build/tools/juice/make_sfx.py` (a hit peaks at -16 dBFS, the pour and simmer near
-32 dBFS RMS), at gain 1 as the lab played them; the made sounds at `Sfx.volume` 0.5 as before; the drop at twice its lab gain. The
family's clips play at 1.6 in Cook (about -21 dBFS RMS before that). The mute (`Sfx.muted`) silences all of it. Only the picked
files are ever fetched (`Sfx.preload` at chai's start and the kit's burner; a file not in yet is skipped, never played late); the
other 15 files stay for the lab.

## How (the code)

- `js/shared/sfx.js` (the one place a sound plays): `FILES` maps a name to its file; `Sfx.play` / `Sfx.loop` play a recorded one by
  the same name as a made one; `Sfx.preload`, `Sfx.file` (the lab's player, `Juice.sound` now calls it), `Sfx.len`, `Sfx.speaking`,
  `Sfx.hush`. **The voice gate:** while `Cook.voiceBusy()` or `NjgVoice.busy()` (added), an effect over 120 ms does not start (not
  queued), a tick plays at x0.35; Cook's player and the shared voice call `Sfx.hush()` as a line starts, so a recorded sound still
  ringing fades in 30 ms and the loop goes silent; a 50 ms watcher brings the loop back after the line.
- `js/shared/juice.js`: `Juice.P`, the Phaser twin (sparkle, steam, puff, drop; texture keys `fx-juice-*`, so the kitchen's
  "is it still?" checks, the game's and the sandbox's contract-79, leave them out as they did the s11 effects); `Juice.drop` gains
  `onLand`. Never through the `Cook.Stations` sparkle/steam stubs (`S.verdict`).
- `js/cook/core.js` (`Cook.sfx`: knob, flame, green, glass, settle, sparkle, drop, simmerLoop, teaPourLoop, pourShort, preload),
  `js/cook/kitchen-kit.js`, `js/cook/stations/chai-tray.js`, `js/cook/flow.js`, `js/shared/results.js`, `js/shared/word-moment.js`,
  `js/core/voice.js`, `cook.html` / `lab.html` / `lab/word-moment.html` (load `juice.js`), `data/cook.json` (the sprites in chai's
  and the shared manifests), `build/sandbox/lib/sound.mjs` (a recorded effect is logged as `sfx/file:<stem>`, never as a voice).
- Nothing removed: the made loops stay as the fallback; the unpicked files stay in `assets/shared/sfx/` (rows kept in `SOURCES.md`).

## Proof

| Check | Result |
|---|---|
| The chai contract run, final code (`--touched cook:chai-tray,lab:cook/chai-tray --parallel 3 --budget-min 20 --check`, port 8860, run 20261106-1704) | 60 pages, every one reached its end, **0 page errors; 1 contract break**: contract-8 at `cook:chai-tray@L3#hint` 740x320 ("2 highlights at once for 780 ms": a shelf glow and the order row's reading light). Re-run of that path at 740x320, 930x430 and 1280x665 (run 20261106-1725): **0 breaks**, so a load-timing flake of the hint path, not this change (no highlight code was touched). contract-91 (help comes) passed on every page. The run before (20261106-1629, on step 2's code while I edited, so not counted) broke contract-79 and contract-24 once each on other paths, both timing checks, neither in the final run |
| Its 16 "new findings" | all order-card tap and text sizes (`.oc-part` buttons, "khun na") on lab pages not in the baseline yet: the order card's typography round, not touched here |
| **The voice gate, from the sound log** (`node build/tools/juice/voicegate.mjs build/screenshots/sandbox/20261106-1704`) | over the 60 pages: 361 clip plays (the family's and the stand-in files), 2973 named effects, 1468 recorded-file plays, 339 heard spans of the simmer and pour loops: **0 effects started over a voice line, 0 recorded sounds or loops heard over one** (3 ticks ducked under a line, as the rule allows). The device voice (947 plays, testing only) is not judged. Same on the five shooting plays (incl. reduced motion): 0 |
| The same proof on the code before (09c3dc4's files, the same plays) | 1 overlap: the stamp's `cook-soft` under Mum's "barabar"; the gate now drops it |
| The tap's sound at the tap (`cook-pop` against the input that caused it, every chai page) | 619 taps: median 1 ms, 90% within 4 ms, the latest 25 ms after the tap (the late made `tap` 1.7 s later is gone: the settle plays as the bottle lands) |
| Unit: `node --test build/test_shared_sfx_files.mjs` (new; in `checks.mjs`) | 7 pass: every sound chai calls exists (a recipe, a loop or its file on disk), chai calls each pick, every file has its `SOURCES.md` row and licence, only the picked files are named by game code, the three Mixkit ones listed; the gate on a stand-in Web Audio (no >120 ms effect under a voice, a tick ducked to x0.35, a file not loaded is skipped, muted is silent) |
| `node build/tools/review/checks.mjs` (17:40-17:58 UK) | **green** but for one flake: unit 90 files, 651 pass, 0 fail; words 0 literals; static 822 known, 0 new; bump; specs; docs; fixlist; recordings; art 0 fail; size 416 MB; **load 29/29** (the juice sprites are in chai's and the shared Cook manifests). The leak bots failed once on the clinic and snap (neither touched here) and passed on the re-run (`--only leak`: 20 configs at every level), as they had at 17:07 on the same code: a flaky bot, worth a row of its own |
| Reduced motion (`--less`, the system setting) | every effect fades in place: one still wisp, one soft star, the drop a dot where it lands, the burst a glow (sheet F); the reduced-motion star was halved after a first shot showed it glaring over the glass (`juice.js`, after the contract run: that path is not in the run; sheet F is after the change) |

## Shots for the judge

Batch `build/screenshots/juice/judge/brief-01.md` (verdicts to `brief-01.verdicts.md`): sheets A steam, B the tray glass (L1 full,
L4 half), C the word moment's drop and crown, D the end screen, E the serve's stamp, BEFORE (commit 09c3dc4's files served over this
branch) beside AFTER, at 1280x665; and `strip-after-1280x665.png`. Tools: `build/tools/juice/shoot_juice.mjs`, `sheets_juice.py`,
`voicegate.mjs` (in `docs/tools.md`).

## Decisions for Zafar

1. **Mixkit's three files** (knob A, green A, the sparkle's chime A): keep and move them out of the public repository before the
   stores, or a CC0 option. Recommend: keep for now, decide at the store run.
2. **The Done sparkle on right glasses only** (flaw 6): keep, or every glass? Recommend every glass (never a verdict).
3. **The clinic's end screen** gets the gold burst too (one script line)? Recommend yes, with the clinic's next sprint.

## Launches and cost

One builder (this session, the top model), about two hours (16:14-18:00 UK): the wiring, the checks, the contract run (twice: the first ran across
my own mid-run edits), the shots.
