# Cook with Nani — art audit

**Date:** 25 Sept 2026 (updated 26 Sept for batch 2's delivery, and again for dump 3: `build/reports/chatgpt-batch-3-dump-3.md`). **Method:** cross-checked `data/cook.json` (`art.sprites`: `items`, `art`, `props`, `vessels`, `need`), every station/mechanic in `js/cook/` and `js/cook/mechanics/` for what it actually draws (a real sprite vs. a canvas-drawn placeholder shape), against what exists in `assets/cook/` and `sources/art/chatgpt/`, and against `docs/chatgpt-art-prompts.md` (batch 1), `-batch2.md` (batch 2, in progress — its items count as covered), and `-batch3.md` (batch 3, being written now — read, not edited: it's entirely characters/backgrounds for the *other* modes, nothing for Cook, confirmed by grep).

**Bottom line:** Cook's art is in very good shape. Every ingredient the game names has at least one painted state, and batch 2 (once delivered) closes the remaining big ones (chaat topping layers, the charcoal grill, the velan/chakla redos, bajri maani, samosa fold stages). Two genuinely new gaps turned up that no batch has asked for — both are live stations drawing a placeholder shape every time they run. There's also a wiring backlog: several tool sprites already exist on disk (batch 1's `sheet-tools-v1.png`) but `data/cook.json` never points to them, so the game still draws them in code. That's a data/JSON fix, not an art gap, and it's out of scope here — flagged in the notes column so it isn't lost.

Legend: **have** = painted asset exists and (unless noted) is wired · **have, unwired** = asset exists on disk but `art.sprites` doesn't reference it, so the code-drawn placeholder still shows · **batch 2** = requested, in the batch 2 pack, not delivered yet · **missing** = no prompt has ever asked for this.

## Tools & utensils

| Item / state | Status | Notes |
|---|---|---|
| Knife (chop) | have, unwired | `tool-knife-t.png` (batch 1). `chop.js` still calls `S.hand("knife", …)`, a code-drawn hand. |
| Ladle (stir) | have, unwired | `tool-ladle-t.png` (batch 1). `stir.js` still code-drawn. |
| Spatula (fry, tawa flip) | have, unwired | `tool-spatula-t.png` (batch 1). |
| Rolling pin / velan (roll) | have, unwired | **Redone** (batch 2's 1.3, delivered in dump 3): `tool-velan-t.png` replaced by a tapered, handle-less Gujarati velan, 512 px. Still in `art.sprites`' left-out list, so wiring it is a data change. `roll.js` still calls `S.hand("pin", …)`. |
| Chakla / rolling board (roll, maani line) | have, unwired | **Redone** (batch 2's 1.4, delivered in dump 3): `tool-chakla-t.png` replaced by a top-down round board, a true circle (512×512), no feet; its rim reads a little thicker to the lower right. Still in the left-out list. `roll.js`/`maani-line.js` call `S.tex("chakla")`, still code-drawn. |
| Chopping board | have, unused | `tool-board-t.png` (batch 1). Not called by any current mechanic. Could stand in for the thread station's skewer-assembly board (see Vessels), though that board is drawn tall/portrait and this is a flat rectangle. |
| Wooden spoon, slotted spoon, tongs, tea strainer, teaspoon, chips basket | have, unused | All in batch 1's `sheet-tools-v1.png`, sliced, sitting in `assets/cook/items/`. No mechanic calls for them yet (future stations). |
| Bare hands (knead, thread — no tool) | missing, by design | `art.js`'s own comment: the drawn hand + embroidered cuff is the deliberate Phase A placeholder, "replaces all of this once the stations are settled." Not commissioned in any batch; not proposed here. |

## Vessels

| Item / state | Status | Notes |
|---|---|---|
| Saucepan (pan) | have, wired | `vessel-saucepan-t` |
| Cooking pot | have, wired | `vessel-pot-t` |
| Tadka pan | have, wired | `vessel-tadka-pan-t` |
| Kadai (oil, frying) | have, wired | `vessel-kadai-oil-t` |
| Tawa (griddle, flip mechanic) | have, unwired | `vessel-tawa-t` exists and is wired as a **prop** elsewhere, but the flip mechanic's own drawn key (`S.tex("tawa")`) has no `art.sprites.art` entry, so it still draws the code tawa. |
| Serving/chaat bowl (empty) | have, wired | `chaat-bowl-empty-t` |
| Chaat bowl (full, finished dish) | have | `chaat-bowl-full-t` |
| Katori (small bowl, skewer pieces) | have, wired | `vessel-katori-t` |
| Enamel plate (samosas) | have, wired | `plate-enamel-empty-t` |
| Thali (round platter) | have, unwired | **Redone** (batch 2's 1.5, delivered 26 Sept): `vessel-thali-t.png` replaced, now 1.7% oval (was 8%) and 512 px. Still in `art.sprites`' left-out list, so wiring it is a data change |
| Masala dabba | have, unused | `vessel-masala-dabba-t.png` on disk; no mechanic references it (decorative only so far) |
| Water jug / milk jug | have, wired | `vessel-water-jug-f` / `vessel-milk-jug-f` |
| Chai glass, front view (empty/full, the standing icon) | have, wired | `vessel-glass-chai-empty-f` / `-full-f` |
| Chai glass/cup, fillable three-quarter view | have, unwired | `vessel-glass-chai-top-t` (cook pack 2.1, dump 3): clear tumbler with a steel rim, cut as glass. The camera is gentler than asked (the rim is an ellipse and the inside wall shows, but it's closer to a front view than the pan/pot); it needs a `vessels` opening entry in `data/cook.json` before `chai-tray.js` can fill it. |
| Mishkaki serving plate (finished, with skewers + chips) | have | `mishkaki-plated-t` |
| Charcoal grill (jiko) | have, unwired | `grill-jiko-t` (batch 2's 2.3, delivered 26 Sept) — closes `grill.js`'s procedurally-drawn firebox once wired |
| Chai tray | have, unwired | `tray-chai-t`, **replaced in dump 3** by a regenerate: a flat steel tray with a low even rim, a true circle (2% oval), 512 px. No handles (the prompt asked for two small ones) |
| Hob knob (off/on) and flame rings (high/low) | have, unwired | `hob-knob-off-t`, `hob-knob-on-t`, `flame-ring-high-t`, `flame-ring-low-t` (batch 2's 2.2, delivered 26 Sept) |
| Wooden skewer rack (holds skewers waiting to grill) | have, unwired | `vessel-skewer-rack-t` (cook pack 2.2, dump 3): two plain parallel rails with end pieces, no notches, the gap between them transparent; 512×105. `grill.js` still draws it in code (`drawRack`). |
| Skewer stick (bamboo, empty/raw/grilled/charred) | have, unwired | `skewer-empty-t.png`, `skewer-meat-*-t.png` etc. (batch 1) sit unused; `thread.js`/`grill.js` still draw the stick in code (`SK.tex("stick")`). |
| Grill's own serving plate (under the skewers, mid-cook) | have, unwired | Can reuse `plate-enamel-empty-t`; currently code-drawn (`SK.tex("plate")`). |

## Ingredients — raw / whole

| Item | Status |
|---|---|
| Potato, tomato, chilli, ginger, lime (whole) | have, wired |
| Onion (whole, peeled) | have, unwired — `veg-dungri-whole-t` / `veg-dungri-peeled-t` **replaced by batch 2's 1.2 redo** (26 Sept: papery copper whole, glossy purple peeled), but `veg-02` has no `.whole` entry in `art.sprites.items` |
| Garlic (whole, clove) | have |
| Turmeric, cumin, mustard, cardamom, salt, red chilli (spice bowls) | have, wired |
| Sugar, tea leaves, flour, lentils (dry, bowl) | have, wired |
| Ghee, chickpeas, meat, pepper, samosa pastry (bowl/raw) | have, wired |
| Bajri (millet) dough/maani states | have, unwired | `dough-bajr-ball-t`, `maani-bajr-{raw,raw-torn,cooked-half,cooked-puffed,burnt}-t` (batch 2's 2.1), scaled so the raw maani matches the wheat one's width |
| Potato cube (thread station decoy) | have, unwired (weak) | `mishkaki-bataato-raw-t` (batch 2's 2.3): glossy and yellow, reads as butter. Dump 3's second render of the sheet (`sheet-tray-grill-t-v2.png`, not sliced) has the same butter cube; `veg-bataato-cubed-t` may be the better stand-in |
| Peas (raw pod) | not needed | game only ever uses cooked/bowl peas |

## Ingredients — prepared / cooked

| Item | Status |
|---|---|
| Chopped onion, tomato, chilli, coriander, garlic; grated ginger; cubed/halved potato & tomato | have |
| Dough ball / rough dough; maani raw/torn/half/puffed/burnt | have |
| Samosa: pastry strip, filled, folded, fried golden, burnt | have |
| Samosa: two extra fold stages + pale underdone | have, unwired | `samosa-fold-1-t`, `samosa-fold-2-t`, `samosa-fried-pale-t` (batch 2's 2.4), scaled to batch 1's samosa |
| Mishkaki pieces: meat/onion/pepper/tomato — raw/grilled/charred | have |
| Chips: raw/golden/burnt | have |
| Chaat toppings as loose "layer" scatters (10, for stacking in the bowl) | have, unwired | `layer-{channa,bataato-boiled,dai,amli,lili,dungri-chopped,tameto-chopped,marcha-chopped,dhana-chopped,sev}-t` (batch 2's 2.7) — closes `assemble.js`'s code-drawn heaps once wired |
| Pantry front views (F): onion, tomato, garlic, chilli, ginger, potato; flour, daal, tea, milk, sugar, cardamom, salt | have, unwired | `veg-{dungri,tameto,lasan,marcha,aadu,bataato}-whole-f`, `jar-atto-f`, `jar-daal-f`, `tin-chai-f`, `jug-dudh-f`, `jar-khun-f`, `jar-elchi-f`, `jar-loon-f` (batch 2's 2.5 and 2.6) |

## Dishes finished

| Dish | Status |
|---|---|
| Chaat (full bowl) | have |
| Samosa (fried) | have |
| Maani (puffed) | have |
| Mishkaki (plated, with chips + lemon) | have |
| Chai (glass, full) | have |

This group is complete — no gaps, nothing proposed.

## UI icons (the planned picture tally)

`docs/cook-with-nani-todo.md` (Wave 6b) lists a not-yet-built feature: "Picture tally… what you did, never the target" for chop and other multi-item stations, replacing the current digit-only badge (`UI.count`, `js/cook/ui.js`). It doesn't exist in code yet, so nothing has ever been painted for it on purpose — but nothing new needs painting either: every countable ingredient already has a small, clean, top-down sprite that was scaled down for testing and reads fine as a thumbnail — e.g. `veg-*-whole-t` / `veg-*-chopped-t` for chop, `spice-*-bowl-t` and `dry-*-bowl-t` for count/add (sugar, tea, salt…), and the mishkaki piece `raw` sprites for thread/grill. **Recommendation: reuse these at icon size; no new prompts.** Revisit only if the eventual tally badge design wants a common frame/background behind each icon (a UI/code decision, not new art).

---

## Summary

- **Fully covered today:** vessels used by every live station bar two, all raw ingredients, most prepared/cooked states, all finished dishes.
- **Batch 2 delivered (26 Sept, `build/reports/chatgpt-batch-3-dump-2.md`), sliced but unwired:** chaat topping layers, the charcoal grill and chai tray, hob knobs and flames, bajri maani, extra samosa fold stages, the onion and thali redos, pantry front views.
- **Dump 3 delivered (26 Sept, `build/reports/chatgpt-batch-3-dump-3.md`), sliced but unwired:** the velan and chakla redos, a flat chai tray (replacing dump 2's pan), the worktop's golden evening (`assets/cook/bg/bg-cook-worktop-t-evening-v1`, within 1 px of the day image), and the cook pack's two gaps: the fillable chai glass and the skewer rack. The counter moods for Nana, Ma and Ali (happy/talking poses and "tsk" impatient faces, cook pack 1.5–1.10) are cut with `build/cut_characters.py`'s boxes into `assets/cook/characters/next/`, not over the live files: moving them up a folder swaps them in.
- **Still to make:** Nani's four counter moods (cook pack 1.1–1.4: happy, talk, point, blink; not in any dump yet, so all four still use the one v2 close-up) and a potato cube that doesn't read as butter (dump 3's second try is the same; `veg-bataato-cubed-t` may do).
- **Not an art gap, flagged for the team anyway:** several batch-1 tool sprites (knife, ladle, spatula, velan, chakla, skewer) and one vessel (tawa) exist on disk but aren't referenced in `data/cook.json`'s `art.sprites`, so the stations still draw their code placeholders. Wiring them in is a data-file change, not new art.
