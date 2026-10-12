# The evidence loop: every row proven by the game, judged without Zafar

**Why (12 Oct, Zafar):** "fix the game reviewers so they can see and validate all the things they couldn't … I can't be judging all of these things myself." The S04 audit judged 174 rows from whole-screen sheets of one 1366×768 run: 86 were "no evidence" because the run never reached the moment the row is about, showed the wrong game, or the row is about sound, timing or motion. Decision 82.

## The design (speed and tokens first)

1. **An evidence spec per row** — `build/sandbox/data/evidence.json`, keyed by row id. Each row has 1–3 probes:
   ```json
   "SH-49": [{ "flow": "cook:fetch", "path": "hint", "level": 2, "sizes": ["1366x768"],
               "at": "results-words", "after": "bulb", "capture": ["crop:.rs-words", "dom:.rs-words"],
               "expect": null, "note": "a bulb press, then the word review: no tick lost" }]
   ```
   - `flow`, `path` (fair, mistake, hint, takeback, speed1, or a new named driver), `level`, `sizes` (only the sizes the row names; default 1366x768, plus 800x360 when it is about phones).
   - `at`: the moment. A Lifecycle event (`request`, `stage-start`, `stage-end`, `results`), a game test state (`njgTest` / `ctx.test.state` names), a heal debug step id, or `every:<state>` (each time it happens, e.g. every knee turn).
   - `capture`: `shot` (whole screen, last resort), `crop:<selector>` (the element and a margin, the default), `zoom2:<selector>` (2× crop for clipping, fringes, ticks), `strip:<selector>:<n>x<ms>` (a filmstrip of n frames for motion: the bob, a wrap, a fade), `voice` (the text timeline of every line: words, clip, start, end, stage boundaries), `dom:<selector>` (the element's text, for wording, English and Kutchi checks).
   - `expect` (optional): a machine assertion the probe can decide alone (no English word outside "to record" tags; one highlight; bubble tail inside the head box; badge order). A row whose every probe has an `expect` never goes to a reviewer.
2. **Reach every moment.** The sandbox plays only the flows, paths, levels and sizes the specs ask for, and captures at the moment, not at fixed start/mid/end points. A spec whose moment is never reached is a tool failure, reported as such (fix the driver or the spec), never as "no evidence" to a reviewer.
3. **Small evidence.** One compact sheet per row: its words (issue, Check, source line), then at most four crops or filmstrips, and any text captures as text (voice timelines and DOM text are read, not looked at). Crops replace whole screens: about a tenth of the tokens.
4. **Machines first.** `expect` probes decide alone; contract checks (decision 75) stay; the reviewer only gets what needs eyes.
5. **Verdict cache.** A verdict is stored with a hash of the row's words and its evidence bytes (`build/tools/review/data/verdicts.json`). Next time, unchanged evidence keeps its verdict; only changed rows are judged again. A sprint re-judges tens of rows, not hundreds.
6. **Judging in small batches.** 15 rows per reviewer call (Fable, or Opus when Fable is at its limit; never the builder), flaws first, PASS or FAIL with one line, written back by the tool. A FAIL reopens the row; a PASS marks it built with the evidence path (decision 76).
7. **Zafar's list is only what a machine and a reviewer can't judge:** how a family voice sounds, whether something feels right to play. Target: under ten per sprint.

## The commands

```
node build/tools/review/evidence.mjs --plan [--rows a,b | --all | --sprint]   # specs, flows to play, rows with no spec
node build/tools/review/evidence.mjs --run  [...]                             # plays, captures, decides the expect probes
node build/tools/review/evidence.mjs --judge [--batch 15]                     # prints/feeds the batches not in the cache
node build/tools/review/evidence.mjs --apply                                  # verdicts → regressions.md
```
`/review` step 9 (the sprint check) runs these for the sprint's rows; the full list once per sprint close.
