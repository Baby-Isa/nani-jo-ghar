# Sweep: the clinic (1 Nov 2026)

Zafar's code sweep (1 Nov): old code, code causing problems, code slowing things down, fixed for real. This is the clinic area's
part: the approved findings CLINIC-1, -3, -4, -5, -7, -8, -9, -10, -11, -12, -13, -16 and -18, applied on the branch
`sweep/clinic-20261101` (from `d7835a5`, the 30 Oct publish) in the worktree `.claude/worktrees/wf_11a0c350-268-10`. One commit per
finding or small group; nothing pushed. No mechanic, screen, art, word, audio or data meaning changed; no Kutchi touched.

## What changed

| Finding | What changed | Files | Result |
|---|---|---|---|
| CLINIC-1 | The clinic no longer loads `js/shared/focus.js` (nothing in the clinic calls `Focus`; the file and `css/shared/focus.css` stay for `lab/kit.html`, the day and Cook) | `clinic.html`, `js/clinic/main.js` (CLASSIC) | Applied, `db57c0b`. After: `window.Focus` undefined on every clinic page, 0 console errors; `rg -w Focus` over js, lab, build/sandbox still hits only `lab/kit.html:144`. One script request fewer per clinic page. |
| CLINIC-3 | The s02 art cut's data and report leave `data/clinic/` for `build/archive/` (nothing fetches them; `build/tools/art/specs/s02.cut.json` names the path only as artcut.py's output) | `data/clinic/s02-cut.json`, `data/clinic/s02-cut-report.txt` → `build/archive/` | Applied, `2d89f03` (git mv, no code change). |
| CLINIC-4 | `Kit.Card.prototype.groupEnd` and its doc comment deleted (the card calls `stepEnd`, SH-45) | `js/clinic/kit.js` | Applied, `db428b4`. |
| CLINIC-5 | `Kit.Tray.prototype.firstEmpty` deleted | `js/clinic/kit.js` | Applied, `db428b4`. |
| CLINIC-7 | `botCut` (the old blind bot, never registered) and its comment deleted; the registered `def.bot` over `planScrape` stays | `js/clinic/heal/games/cut.js` | Applied, `993e55a`. The task's line range (129-152) was three lines off: the function ran 128-149 with a blank line after; removed 128-150, leaving one blank line. The cut leak bot (`leak.mjs clinic-heal-cut`) gives byte-identical output on the old and the new file (see below). |
| CLINIC-8 | `S.pulseTool` deleted (the host and the idle glow toggle `pulse` directly) | `js/clinic/heal/scene.js` | Applied, `6d90b94`. |
| CLINIC-9 | `const FINDS = {...}` deleted | `js/clinic/stages/diagnosis.js` | Applied, `6d90b94`. |
| CLINIC-10 | `const bigOrSmall = ...` deleted | `js/clinic/heal/games/ear.js` | Applied, `6d90b94`. |
| CLINIC-11 | `const glassArt = ...; void glassArt;` deleted | `js/clinic/heal/games/taste.js` | Applied, `6d90b94`. |
| CLINIC-12 | `HEAL_L4` (a second copy of HEAL's nine ids) deleted; `levels: HEAL.includes(g) ? [1, 2, 3, 4] : undefined`; its history note moved onto HEAL's comment. HEAL is NOT made to read `Clinic.Heal.IDS` lazily (load order on lab pages) | `js/clinic/main.js` | Applied, `8adb3b1`. Set equality of HEAL and the old HEAL_L4 checked (cut, knee, ear, tooth, taste, fever, boing, eye, foot); PARKED disjoint; so every game keeps its levels. The lab's level lists come out the same (the checks' `load` step: 29/29 pages). |
| CLINIC-13 | `Kit.warmJSON(path)` starts a data file's fetch (once per page) without parsing it; `Kit.loadJSON` calls it and parses as before; the heal host's CLN-88 warm-up uses `warmJSON`, so the six warm-up files are no longer parsed and thrown away | `js/clinic/kit.js`, `js/clinic/heal/host.js` | Applied, `6f36c6b`. Same request list per page (focus.js apart); every caller still gets its own parsed copy (run.js mutates its `pj`). pipeline.json parsed twice per page instead of three times; the other five once instead of twice. |
| CLINIC-16 | Fifteen lines of `css/clinic.css` deleted: `.cl-bench`, `.cl-bench::after`, `.cl-seat-img`, `.cl-exam-spot`, `.cl-exam-bench`, `.cl-faces`, `.cl-face-emoji`, `.cl-face-word`, `.cl-feel-q`, `.cl-feel-cards`, `.cl-feel-cards .cl-face-card`, the T27 comment, `.cl-req-veil`, `.cl-req-veil.going`, `.cl-req-pop`. `.cl-seat`, `.cl-seat-who`, `.cl-face-card`, `.cl-feel`, `.cl-feel-circle`, `.cl-feel-own`, `.cl-help-card` kept | `css/clinic.css` | Applied, `efd1e55`. `grep -rl -F` of each of the eleven class names over js, data, lab, build/tools, build/lint, build/sandbox, build/host, docs, css, *.html hits only `css/clinic.css`; no template-built `cl-…` name in js/clinic or js/shared can produce them. Screenshots at 1280x665 before and after: waiting room and send-off (faces) pixel-identical (diff bbox none); pharmacy differs only in the box 1109-1237 x 382-464, the belt dish riding with time (two "after" shots with the same CSS differ in the same box). Shots are in the scratchpad for the judge (`shot-{waiting,sendoff,pharmacy}-{before,after}.png`). Note: `css/clinic.css` is outside the "touch only" list in the brief, but the finding was approved with that file named; it is the clinic's own sheet. |
| CLINIC-18 | `S.heal.run_` is now defined as `run`; the dead `run: null` slot and `S.heal.run = S.heal.run_;` deleted; `S.heal.current` untouched | `js/clinic/stages/heal.js` | Applied, `aa6b2c3`. run.js:93 dispatches `S[name].run(env, sp, plan)`, so the same function runs; `rg 'heal\.run_|S\.heal\.run\b'` over js, lab, build now hits nothing. |

Skipped: nothing. Every approved fix went in as written, with the CLINIC-7 line-number correction and the CLINIC-13 `Kit.url` call kept outside the try (as before) noted above.

## Before and after

### checks.mjs

Before (on `d7835a5`, started before the first change; its unit, words and static steps ran before any edit, the later steps overlapped the dead-code commits, which the leak bots cannot see since they run the registered bots):

```
ok   unit   87 files, 623 pass, 0 fail
ok   words  strict on js/cook, js/clinic: 0 literals
ok   static static: 851 findings (kit 21, tokens 513, ladder 2, motion 20, jscolour 295), 851 known, 0 new
ok   leak   19 configs at every level
ok   bump   dry run lists 35 files, 76 modules
ok   specs  lint-specs: 0 flagged, 0 known, 0 new
ok   docs   docs: within every limit
ok   fixlist every open row is labelled
ok   recordings recording sheet is current (grammar 8 (+23 wider), cook 111, clinic 490, door 15, ride 29, book 4, other 118)
ok   size   ok: live site 444 MB in 4748 files (limit 800 MB; excluded: sources, build)
ok   load   29/29 pages load only what's on their screen
exit 0
```

After (on `efd1e55`, the branch head):

```
ok   unit   87 files, 623 pass, 0 fail
ok   words  strict on js/cook, js/clinic: 0 literals
ok   static static: 845 findings (kit 21, tokens 507, ladder 2, motion 20, jscolour 295), 845 known, 0 new; 6 known ones are fixed: run --write-known to shrink the list
ok   leak   19 configs at every level
ok   bump   dry run lists 35 files, 76 modules
ok   specs  lint-specs: 0 flagged, 0 known, 0 new
ok   docs   docs: within every limit
ok   fixlist every open row is labelled
ok   recordings recording sheet is current (grammar 8 (+23 wider), cook 111, clinic 490, door 15, ride 29, book 4, other 118)
ok   size   ok: live site 444 MB in 4748 files (limit 800 MB; excluded: sources, build)
ok   load   29/29 pages load only what's on their screen
exit 0
```

The static step's note (6 known findings fixed: the deleted CSS rules' raw colour tokens, 513 → 507) is a suggestion to shrink `build/lint/static-known.json` with `--write-known`; that file is outside this sweep's area and is left for the orchestrator. `build/reports/snap-leakbot.md` (its date line, rewritten by the run) restored with `git checkout` after each run; the tree is clean.

### Unit tests near the code

`node --test js/clinic/levelup.test.mjs js/clinic/heal/colour-clips.test.mjs js/clinic/heal/counts.test.mjs`: 17 pass, 0 fail before; 17 pass, 0 fail after.

### The cut leak bot (CLINIC-7)

`node build/tools/review/leak.mjs clinic-heal-cut` on the pre-sweep `cut.js` and on the new one: byte-identical output
(L1 5000 rounds fair 100.0%, random 6.1%, first-option 12.7%, last-option 0.0%, middle-option 12.4%; L2-L4 1000 rounds each, every
blind strategy under 3%; PASS as before, with Zafar's accepted L1 16% exception).

### Headless page loads (Playwright, chromium, 1280x665, a local static server, `load` event, then 4 s)

| page | before (ms) | after, during the leak bots (ms) | after, quiet (ms) | console errors b/a | failed requests b/a |
|---|---|---|---|---|---|
| `clinic.html` | 422 | 444 | 494 | 0 / 0 | 0 / 0 |
| `clinic.html?game=cut&level=2` | 334 | 221 | 265 | 0 / 0 | 0 / 0 |
| `lab.html?mode=clinic&game=ear&level=3` | 199 | 335 | 220 | 0 / 0 | 0 / 0 |
| `clinic.html?stage=heal&game=taste&level=2` | 223 | 214 | 242 | 0 / 0 | 0 / 0 |
| `clinic.html?stage=waiting&level=1` | 261 | 369 | 229 | 0 / 0 | 0 / 0 |
| `clinic.html?stage=sendoff&level=1` | 247 | 382 | 226 | 0 / 0 | 0 / 0 |
| `clinic.html?stage=pharmacy&level=2` | 259 | 321 | 195 | 0 / 0 | 0 / 0 |
| `clinic.html?patient=1&level=2` | 319 | 372 | 384 | 0 / 0 | 0 / 0 |
| mean | 283 | 332 | 282 | | |

Load time is the `load` event on a local static server (noise of ±100 ms between runs: the middle column ran while the baseline checks' leak bots were still using the CPU). No console error and no failed request on any page, before or after.

Request lists per page: the only file gone from every page is `/js/shared/focus.js`; every other difference between the two runs is the
random patient a seedless page draws (a knee game's art one time, a foot game's the next), not the sweep.

## How to look

- `git log d7835a5..sweep/clinic-20261101` for the nine commits.
- The judge's three screens (CLINIC-16): the scratchpad's `shot-waiting-before.png` / `-after.png`, `shot-sendoff-*.png`, `shot-pharmacy-*.png`
  (the scratchpad is session-only; re-shoot with `clinic.html?stage=waiting|sendoff|pharmacy&level=1|2&seed=7&quiet=1&onboard=0` at 1280x665).
