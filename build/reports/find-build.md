# Find it: build report (phases 0 and 1, 25 Sept 2026)

Branch `claude/build-find`. Details: `docs/find-build-log.md`, `build/reports/find-leak.md`.

## What's built, and where
- **One-file mechanics and games.** `list.js` is gone: `js/find/mechanics/` has `spot`, `bag`, `greet`, `where`, `tell` and `bowl`; `js/find/games/` has `list` (F1), `whichone` (F2), `where` (F3) and `ali` (F4).
- **Pure generator** `js/find/gen.js` (page and Node).
- **F2 Which one?** *wadho / nindho*, the same picture at 1.25× and 0.8×.
- **F3 Where is it?** Calls on `Rel.holds`, matched by anchor word. The sitting room is a greybox (`data/scenes/sitting-room.json`, with under/behind occluders).
- **F4 Ali's turn** and **speaking moment 1, the bowl**, both on `Say.tell`, with the voice star from `Stars.voice`.
- **Digit fix:** a row shows its count only at stage ≤ 1.
- **Level 4** for every game.

## How to open it
`find.html` → **Search lab** (levels 1–4, word stage, bot, "with a parent"). In the lab the mic is a picker: "what did the child say?"

## Leak bot
Run `node build/leak_find.mjs --n 1000`: **PASS**. Ear-star rates, levels 1–3, stages 2 and 3, mean over strategies:

| Game | Rates | Worst single strategy |
|---|---|---|
| F1 | 0.2–1.8% | 4.0% |
| F2 | 0.0–0.2% | |
| F3, positions hidden | 0.1–0.7% | |
| F3 as it is today (readable English placeholders) | 17–25% | |

Today's F3 rounds don't count for the ear, which shows "not tested". F4 on pills never earns the voice star (0 in 4,000 rounds). The digit fix takes F1 level 1 at stage 2 from **14.3% to 2.0%**.

## Tests
`python3 build/test_find.py` on port 8801 passes on all seven viewports. It covers the story round with the bowl, F2, F3 at levels 1 and 3, F4 by voice, by pills and by a parent's ✓, and level 4 of every game.

## Stubs to swap
None. The shared modules are used directly. Two smaller gaps remain:
- The ear star still uses the engine's own rule, which is Stars' rule without `minTested`.
- `Find.fakeListen` stays as the lab's microphone.

## Left for the next phase
- F6, the torch modifier.
- Anchors qualified at level 4 (*the big basket*).
- The fruit-bowl errand moved onto this engine.
- A real-microphone round with family recordings.
- The shell entry.
- *hakro/hakri* and *ba* (still *hikdo/bo* in `data/cook.json`).
- Art from the sitting-room greybox.
