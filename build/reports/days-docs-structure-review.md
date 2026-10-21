# Days docs: structure review (21 Oct 2026)

**Conclusion: yes to Zafar's shape, in a new folder `docs/game-design/days/`, not under `modes/`.** The target model splits *engines* (code, plug-ins) from *content* (data). A mode doc describes an engine; a day is content, a stage list in `data/day.json`. So days get their own folder beside `modes/`: `days/README.md` is the principles and index (as `modes/README.md` is for modes), and one file per trip named by its data id (`trips.farm` → `days/farm.md`). Kitchen and clinic days get no file: one index row each, pointing at `cook.md` and `clinic.md`.

**The rule against writing anything twice.** True for every day using the engine → the mode doc. True only on this trip → the trip file. The stage order → data; the trip file lists it with each stage's engine, level and what the Kutchi decides, never how the engine plays.

## Recommendations

1. **Create `docs/game-design/days/README.md`** from `a-day-at-nanis.md` §1–3 (principles, the people, the stage library with each engine's doc link) plus an index table: trip, weather, file, status, next visit.
2. **One file per trip:** `farm.md` (from §4); `shops.md`, `beach.md`, `safari.md`, `boat.md` as stubs (from §5). Names match `data/day.json` trip ids, so doc, data and ride share one id.
3. **Trip file template:** (a) one line: what, weather, host, status, sources newest-wins; (b) *The day's list*: the stage table mirroring `data/day.json` (stage, engine link, level, what the Kutchi decides); (c) *People, the thing for Ali, what comes home*; (d) *Words it needs* (English only, ✓ or to record); (e) *Art it needs*; (f) *Later visits*; (g) *Zafar's answers and open questions*, dated.
4. **Engines without a doc get a short one in `modes/`:** the window ride, put it in its place, count to a heard number, pack the bag. Trip files link to them, never repeating gestures, levels or leak rules.
5. **Retire `modes/a-day-at-nanis.md`** to `docs/archive/modes/`; its row in `modes/README.md` points to `days/README.md`, and "Arcs and trips are in story-and-arcs.md" changes to `days/`.
6. **`story-and-arcs.md` Part 1:** keep Nani's role, how the story is told and the syllabus. The 19 Oct paragraph moves to `days/`. The arcs (Birthday, day-out template, standalone arcs, five-arc plan), retired by Zafar on 19 Oct, go to `docs/archive/game-design/` with a one-line pointer. Give the doc a limit (3000).
7. **The trip research report stays** in `build/reports/`, untouched (history); `days/README.md` cites it once where Zafar hasn't overruled it.
8. **`docs.mjs`:** add `docs/game-design/days` to `DOC_DIRS`; limits: `README.md` 1500, each trip file 1500, each new engine doc 1000.
9. **Make the data match the doc.** `data/day.json` says a day is a stage list, but its `days` entries hold only weather, activity and trip; the stages are still in code. Put the farm day's stage list in the data in Sprint 10, and add a check (`checks-to-build.md`) that a trip file's stage table matches its data, like `gen_labs --check`.
10. **Differently:** no ideas dump in the README; an unnamed trip is a line in `docs/ideas.md` until Zafar names it, then a stub.

Answerable "yes to all except …".
