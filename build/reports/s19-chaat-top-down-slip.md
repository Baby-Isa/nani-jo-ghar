# Chaat top-down: decided 9 Nov, built side-on 10 Nov. Why

**The decision:** Zafar, 9 Nov (docs/feedback/kitchen-mocks-2026-11-09.md P18): "I think maybe we go top down for chaat ... Top down,
I think, looks better. Opaque bowl looks better than the glass bowl." It went into the fix list the same day, on row CHT-13, as
"changed from side-on to top-down", status **waiting on art**. Fable's answers agreed (build/reports/s19-fable-mock-answers.md §4).

**How it slipped, three steps:**
1. **It lived only in a fix-list row.** The rule says a yes or no from Zafar goes into the doc it changes; chaat's design (cook.md,
   and later cook-bottom-row.md) was not changed in that commit, because the row was waiting on art.
2. **On 10 Nov the orchestrator wrote the bottom-row table from the code as it stood** (commit 2b3ec417c, SH-248): chaat "shelf,
   side-on glass jars". That table is what the code is checked against (build/core/band.test.mjs) and what builders read, so the old
   look became the enforced one.
3. **When the art landed (10 Nov: F3's top-down bowls, C5-C11's tops), nobody swept the waiting-on-art rows.** CHT-13 stayed
   "waiting on art"; s19-wave-e2 was briefed from the table and wired the top-down tops into the side-on bowl, where they barely show.

**Fixed now:** cook-bottom-row.md says chaat is top-down on the tray with an opaque cream bowl; CHT-13 is "to fix: code"; the band
test holds chaat as a todo until it is built.

**So it doesn't happen again:**
- Design tables are written from Zafar's decisions and rows, never from the code.
- /art-run: when art lands, every "waiting on art" row it serves is moved on in the same commit (added to the skill).
- A check (docs/process/checks-to-build.md): an open row that records a changed design must name the design-doc line it changed.

## Proof
- docs/feedback/kitchen-mocks-2026-11-09.md:77 (P18, his words); docs/process/regressions.md CHT-13; git show 2b3ec417c (the table).
