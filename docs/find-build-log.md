# Find it: build log

## 25 Sept 2026: phases 0 and 1 (the deep dive's first set)

Branch `claude/build-find`. Built from `docs/find-it-design.md` (deep dive D1–D9, brief section 8), `docs/modes/BUILD-COMMON.md`, `docs/UX-PRINCIPLES.md` and `docs/shared-api.md`. Every default taken.

### What changed in the live slice

| Brief item | Where |
|---|---|
| `list.js` split into one-file mechanics and games | `js/find/mechanics/{spot,bag,greet,where,tell,bowl}.js`, `js/find/games/{list,whichone,where,ali}.js`; `round.js` keeps thin `searchTap/collect/wrong` that call `Find.Spot` |
| Pure generator (rows by level: count, size, where, not; the size rule; placement) | `js/find/gen.js` (UMD: the page and Node use the same code) |
| Digit leak (the review's High) | a row shows its count's digit only while the number word is taught (stage ≤ 1, read when the list opens); a count miss on such a row is noted, not tested |
| Level 4 | every game's `levels` in `data/find.json` |
| Where-rows match by anchor word | `Find.matches` → `Gen.matches` → `Rel.holds` (by word is the shared default) |
| The listening recall becomes speaking moment 1 | `mechanics/bowl.js`, at the end of Nani's list (lab and story) |
| Node leak bot | `js/find/blind.js` (strategies) + `build/leak_find.mjs` |

### Shared modules used directly (no stubs)

`Rel.holds` / `Rel.info` / `Rel.mergeWords` (positions and their placeholder words), `WhichOne.checkDecoys` (every size row is checked, every round), `WhichOne.rng/shuffle` (seeded generator), `Say.tell` (every speaking moment; the lab passes `Find.fakeListen` as `speech`), `Stars.voice` (the voice star), `Stars.rules("find").placeholdersTested` (a row decided by a placeholder isn't tested), `Stars.installInto`, `Stars.ICONS.mic`. Nothing in `js/shared/` was edited.

### Decisions I had to take

1. **Family spelling on screen.** `data/cook.json` still says *vadho* and is read-only here, so `data/find.json` `words.spelling` sets `ph-big` to ***wadho*** on Find it's screens; the voice stays the draft recording until the family records it.
2. **Every stall thing in both sizes once any row is sized.** Otherwise a row with a size word (longer) points at the only two-size thing. A row with no size then takes either size.
3. **Asked sizes are dealt mixed** (never all big), so "always the big one" is no better than chance.
4. **F3 ear star shows "not tested"** while the position words are English placeholders (the shared rule). Its leak numbers are measured as if the positions were Kutchi ("hidden") and reported apart as "reader" (today's readable placeholders).
5. **F4 has no ear star** (nothing is heard and chosen): voice, sharp eyes (the bag's mistake found first time) and no help.
6. **Pills live at once outside the lab** (no family recordings yet for the recogniser, so `Say` hides the mic); in the lab the mic is a picker ("what did the child say?").
7. **A round that breaks a rule is dealt again** (at most 40 times; mean 1.0–1.6 deals, except F3 level 4, size and where on six calls: mean 2.7, max 15 in 500).

### Leak bot (`node build/leak_find.mjs --n 1000`, full table in `build/reports/find-leak.md`)

Ear-star rate of a player who knows no Kutchi, mean over strategies (worst single strategy in brackets).

| Game | L1 st2 | L1 st3 | L2 st2 | L2 st3 | L3 st2 | L3 st3 |
|---|---|---|---|---|---|---|
| F1 list + bag | 1.7% (3.2) | 1.8% (4.0) | 0.3% | 0.2% | 0.3% | 0.2% |
| F2 which one? + bag | 0.1% (2.0) | 0.2% (1.2) | 0.2% | 0.2% | 0.0% | 0.0% |
| F3 calls (positions hidden) | 0.7% (3.6) | 0.5% (3.6) | 0.4% | 0.3% | 0.1% | 0.1% |
| F3 today (placeholders readable, untested) | 25% | 22% | 17% | 18% | 18% | 17% |

F4 by pills only: all pills right first time 24% at L1 (one pick from five), 0% from L2; the voice star 0 times in 4,000 rounds. The generator's checks (the size decoy rule, "in three places") held in 3,200 rounds; the digit shows at stage 1 only.

**The digit fix:** with the old rule (digit shown up to stage 2), F1 level 1 at stage 2 was **14.3%** (worst strategy 31%); now **2.0%**.

### Tests

`python3 build/test_find.py` (port 8801): the story round (now with the bowl), lab rounds, F2, F3 at levels 1 and 3 (sitting room), F4 through the mic stand-in (voice star), pills only (no voice star), a parent's ✓ (voice star), level 4 of every game. `--leak N` still runs the in-page bot.
