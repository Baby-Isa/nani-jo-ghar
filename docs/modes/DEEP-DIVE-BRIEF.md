# Deep-dive brief: every mode as mini-games built from modular mechanics (25 Sept 2026)

One design agent per mode. Each takes its mode's existing design doc to the depth the clinic reached in its "Revision 2" (visit types plus a scored treatment library), under the principles below. Read this whole brief first.

## Read first
- `docs/modes/MODE-DESIGN-BRIEF.md`: personas (Layla 5, Zayn 8, Maryam 11, Zafar, Farah, Nani), the Sceptic's "win without the Kutchi?" test, the Builder.
- `docs/modes/clinic-design.md`: its top section "Revision 2, 25 Sept 2026" is **the model of depth and shape** for this deep dive (kinds of round as the backbone, a scored library, a first set, a level ladder, direct agreement and disagreement).
- `docs/modes/REVIEW-2026-09-25.md`: the independent review. Address every critique of your mode, adopting it or saying why not.
- `docs/cook-with-nani-recipes-guide.md` sections 1, 5 and 6, and the file list of `js/cook/mechanics/` (add, assemble, boil, chop, count, fetch, fill-fold, fry, grill, knead, passme, pour, roll, stir, tadka, tawa, thread): this is how Cook is built, and every mode now follows the same pattern.
- `docs/Nani jo Ghar — Game Design.md`, the section on speaking (stage two: closed-set classification from a few family recordings per word).
- Your mode's own design doc, in full.

## Zafar's principles (25 Sept)
1. **Each mode is a set of mini-games**, the way Cook is a set of stations (chai tray, maani line, grill, chop…). Each mini-game is fun on its own, has its own levels, and can be dropped into the story or free play on its own.
2. **Mechanics are modular.** One mechanic = one file (`js/<mode>/mechanics/<id>.js`, or `js/shared/mechanics/<id>.js` when two or more modes use it), usable alone or inside a zone of a combined mini-game, with difficulty levels as data and rounds as data, exactly like `js/cook/mechanics/`. Reuse Cook's mechanics where they fit (pour, stir, count, fetch, passme…) rather than re-inventing them. Name every mechanic, and say for each whether it is **new**, **reused from Cook**, or **shared** with another mode (name the mode).
3. **Speaking is a core part of the game.** Every mode needs at least one mini-game or moment where the child **says the Kutchi aloud**: role reversal, where the child gives the instruction and a character acts on it. Recognition is **closed-set**: at that moment the game knows the 3–8 words the child could mean and picks the closest, trained from the family's own recordings. Design rules: say exactly what the closed set is at each speaking moment; always give a fallback (tap the word pills, or a parent judges "did they say it?"); never block progress on recognition; speaking earns its own star (the "voice" star), separate from the ear star. A speech agent is designing the shared recogniser (`js/shared/speech.js`, `listen({choices, timeoutMs}) → {choice, confidence} | null`); design against that call.
4. **All modes are built at once, one build agent per mode**, each mostly in isolation and then put together. So the build brief must be phased so phases 0–1 (pure logic, lab, bots, greybox) touch **only the mode's own files**, and must list the shared pieces it needs from the foundation agent (the shell/"one app, one save", the relations layer `data/relations.json` + `js/shared/rel.js` + scene `spots`, the shared "which one?" attribute-and-decoy module, overlay-at-anchor sprites, star sets and ear/voice rules as data, `js/shared/speech.js`). Assume those arrive; don't design them.
5. The Sceptic rule still holds: a child mustn't be able to win by pattern, elimination, or waiting for hints. Give a blind-bot estimate for level 1 of each mini-game in the first set.

## What to write
Add a new top section to your mode's design doc, **"Deep dive, 25 Sept 2026: mini-games and mechanics"**, superseding older sections where they conflict:
1. **Pitch** in two sentences, and **the kinds of round** that form the mode's backbone.
2. **The mini-game library**: a table scored 1–5 on fun at 5, fun at 11, forces the Kutchi, distinct from other modes, build cost (5 = cheap), plus the mechanics each uses. Include the ones already designed and new ones; reject weak ones with a one-line reason.
3. **The mechanics list**: every mechanic id, one line each, tagged new / reused from Cook / shared (with which mode).
4. **Speaking moments**: for each, the closed set, what the character does, the fallback, and when (which level) it appears.
5. **The first set** (3–5 mini-games) and why; **the level ladder** (what makes level 2, 3, 4 harder, in terms of what the Kutchi instruction carries).
6. **Story home** per mini-game, and one free-play entry.
7. **The review's critiques**: a short table, critique → what you did.
8. **Words needed**: the Kutchi the first set needs, in priority order, marking which are already in the Questions for Mum doc (`docs/Nani jo Ghar — Questions for Mum (Combined, for the visit).md`; don't edit it).
9. **Decisions for Zafar**, only ones that block the build, each with your default.
Then update the doc's **build brief** at the end to match (phased, own-files-first, shared pieces listed).

## Rules
- Edit only your own mode's design doc. Don't edit `OVERVIEW.md`, other modes' docs, the questions doc, or any code. Don't commit or push.
- Plain British English; tables welcome. The new section should be roughly 1,500–3,000 words.
- Final report to the orchestrator, under 350 words: the backbone, the first set with a line each, mechanics reused vs new vs shared (counts plus the shared ones by name), the speaking moments, the biggest changes from the old design, and blocking decisions with defaults.
