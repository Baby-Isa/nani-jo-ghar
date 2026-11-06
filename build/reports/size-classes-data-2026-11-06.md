# Size classes: the live items classed (data step), 6 Nov 2026

The data step of `size-classes-method-2026-11-06.md` ("class the ~150 live items now"). Data only: no game code, no rendering, no CSS touched. Steps are L 100 / M 91 / S 84, floor 40 CSS px (Zafar's numbers; the code step applies them).

## What was written, and where

| File | Field | Rows |
|---|---|---|
| `data/cook.json` `words[id]` | `size` (+ `sizeFlag`) | 31 items that have a words row |
| `data/cook.json` `art.sizes[id]` (new object) | `size` (+ `sizeFlag`) | 45: shelf-only containers (33 ids with no words row), the chai glass, 5 hand tools, the tawa and 5 vessels |
| `data/clinic.json` `items[id]` | `sizeClass` (+ `sizeFlag`) | all 53 |
| `data/clinic/heal/{eye,foot,hair,hic,tummy}.json` `items[id]` | `sizeClass` (+ `sizeFlag`) | the 14 heal items |
| `data/dress.json` `words[id]` | `size` (+ `sizeFlag`) | the 4 sewing tools |

Encoding: the class is `"L"`, `"M"`, `"S"` or `"STN"` (station piece, laid out by the scene). `sizeFlag` is `"LONG"` or `"W"`, absent if neither. Missing still means M (method §2). Every edit is an addition (checked by diffing the parsed JSON against HEAD with the new keys removed: identical).

**Why the clinic field is `sizeClass`, not `size`:** `Kit.itemInfo` (`js/clinic/kit.js` 246) reads `it.size || d.size`, and line 441 writes it to `data-size` on the item; 451-452 turn "small"/"big" into the `.small`/`.big` CSS. A `size: "M"` there would put `data-size="M"` on every belt item, and the placements' `it.size` ("small"/"big") is a different, per-placement thing. So the class sits beside it under another name; the code step renames it to `size` when it replaces `.small`/`.big` with `--size-k`. Cook and dress have no reader of a word's `size` (checked in `js/cook`, `js/shared`, `js/dress`: `item.size` is read only on order and row objects, never on a words entry).

Nothing else was changed. `art.sprites.shelf` keeps its old numbers (1 / 0.9 / 0.85 / 0.8 / 0.7); `art.vessels.kadai.size` (0.78, geometry) is untouched; `art.sizes` is read by nothing (`art` is only read by named key).

## Rule applied

How it is held: two hands (or taller than a milk carton) L; one hand M; fingers S; the ruler (over 20 cm, 10-20, under 10) only on ties. LONG on long thin things, W on wide loaf and box things, STN on station pieces. A thing in two views is two rows (cook shelf jar vs clinic pot).

## Counts

| set | rows | L | M | S | STN | LONG | W |
|---|---|---|---|---|---|---|---|
| cook words | 31 | 4 | 16 | 11 | 0 | 1 | 0 |
| cook art.sizes | 45 | 8 | 24 | 7 | 6 | 8 | 2 |
| clinic items | 53 | 8 | 16 | 29 | 0 | 15 | 0 |
| heal items | 14 | 3 | 3 | 8 | 0 | 3 | 0 |
| dress words | 4 | 0 | 1 | 3 | 0 | 3 | 0 |

147 rows in all; fewer distinct items, because clinic aliases (`fru-02`, `spi-16`, `care-*`, `tool-*`, `strip`) and heal items repeat a clinic item and carry its class.
Not classed (no slot, no picture of its own): numbers, lines, `cook-maani` and `cook-bajrmaani` (products), `ph-chips`, `ph-chaat`, `ph-samosa`, `ph-sekelo`, `ph-mishkaki`, people and kin words.
Method items with no data row yet (class decided, nothing to write on): rolling pin LONG L, tea strainer LONG M, teaspoon LONG S. They get their class when their row lands with the stove-400 cut.

## Every item classed

### cook.json `words[id].size` (items with a words row) (31)

| id | name | class | flags | why | old shelf number |
|---|---|---|---|---|---|
| `cook-paani` | water bottle | L | - | two-hand bottle | 1 |
| `cook-chai` | tea jar | M | - | one-hand jar | 1 |
| `cook-dudh` | milk carton | L | - | two-hand carton | 1 |
| `cook-khun` | sugar jar | M | - | one-hand jar | 1 |
| `cook-atto` | flour bag | L | - | two-hand bag | 1 |
| `cook-daal` | daal bag | L | - | two-hand bag | 1 |
| `veg-01` | potato | M | - | palm-sized, one hand | 0.9 |
| `veg-02` | onion | M | - | palm-sized, one hand | 0.9 |
| `veg-03` | tomato | M | - | palm-sized, one hand | 0.9 |
| `veg-12` | green chilli | S | - | fingertip pod | 0.9 |
| `veg-13` | garlic | S | - | method: fingers | 1 |
| `veg-10` | green peas | S | - | pinch of peas | 0.9 |
| `veg-14` | ginger | S | - | small root piece | 1 |
| `fru-02` | lemon | S | - | method: fingers | 0.9 |
| `spi-01` | turmeric | S | - | spice jar | 0.8 |
| `spi-02` | cumin seeds | S | - | spice jar | 0.8 |
| `spi-05` | mustard seeds | S | - | spice jar | 0.8 |
| `spi-10` | cardamom | S | - | spice jar | 1 |
| `spi-16` | salt | S | - | spice jar | 1 |
| `spi-04` | red chilli powder | S | - | spice jar | 0.8 |
| `ph-chana` | chickpeas | M | - | one-hand tin | 1 |
| `ph-dahi` | yoghurt | M | - | method: tub | 0.7 |
| `ph-amli` | tamarind chutney | M | - | one-hand bottle | 1 |
| `ph-lili` | mint chutney | M | - | one-hand bottle | 1 |
| `ph-sev` | sev | M | - | one-hand packet | 1 |
| `ph-dhana` | coriander | M | - | one-hand bunch | 0.9 |
| `ph-keema` | mince | M | - | one-hand tray | 0.7 |
| `ph-meat` | meat | M | - | one-hand tray | 0.7 |
| `ph-pepper` | green pepper | M | - | palm-sized, one hand | 0.9 |
| `ph-ghee` | ghee | M | - | one-hand jar | 0.7 |
| `ph-lakri` | skewer | M | LONG | held one hand | - |

### cook.json `art.sizes[id]` (no words row: shelf-only containers, hand tools, props, station pieces) (45)

| id | name | class | flags | why | old shelf number |
|---|---|---|---|---|---|
| `ph-bajri-atto` | millet flour bag | L | - | two-hand bag | 1 |
| `ph-rice` | rice bag | L | - | two-hand bag | 1 |
| `ph-cocoa` | cocoa tin | M | - | one-hand tin | 1 |
| `spi-11` | black pepper | S | - | spice jar | 0.8 |
| `spi-09` | cinnamon | S | - | spice jar | 0.8 |
| `ph-sprinkles` | sprinkles | S | - | small shaker | 0.8 |
| `ph-oil` | cooking oil | L | - | milk-carton tall | 1 |
| `ph-juice` | juice carton | L | - | two-hand carton | 1 |
| `ph-ketchup` | ketchup | M | - | one-hand bottle | 1 |
| `ph-honey` | honey | M | - | one-hand jar | 1 |
| `ph-rose` | rose syrup | M | - | one-hand bottle | 1 |
| `ph-chicken` | chicken | M | - | one-hand pack | 0.7 |
| `ph-fish` | fish | M | - | one-hand pack | 0.7 |
| `ph-butter` | butter | M | - | one-hand tub | 0.7 |
| `ph-cheese` | cheese | M | - | one-hand pack | 0.7 |
| `ph-cream` | cream | M | - | one-hand carton | 0.7 |
| `fru-01` | banana | M | LONG | one hand, long | 0.9 |
| `fru-04` | orange | M | - | palm-sized, one hand | 0.9 |
| `fru-05` | mango | M | - | palm-sized, one hand | 0.9 |
| `fru-06` | pear | M | - | palm-sized, one hand | 0.9 |
| `fru-08` | apple | M | - | palm-sized, one hand | 0.9 |
| `fru-09` | coconut | M | - | one hand, big | 0.9 |
| `veg-04` | carrot | M | LONG | one hand, long | 0.9 |
| `ph-corn` | corn on the cob | M | LONG | one hand, long | 0.9 |
| `ph-eggs` | egg box | M | W | wide box | 0.85 |
| `ph-bread` | bread loaf | M | W | wide loaf | 0.85 |
| `ph-biscuits` | biscuit packet | M | - | one-hand packet | 0.85 |
| `ph-mithai` | mithai box | M | - | one-hand box | 0.85 |
| `ph-pastry` | pastry | S | - | fingers | 0.85 |
| `ph-crisps` | crisps packet | M | - | one-hand bag | 0.85 |
| `ph-candles` | candles | S | - | small pack | 0.85 |
| `ph-jam` | jam jar | M | - | one-hand jar | 0.85 |
| `ph-chocolate` | chocolate bar | S | - | fingers | 0.85 |
| `glass` | chai glass | S | - | method: fingers | - |
| `hand:knife` | knife | L | LONG | method: LONG L | - |
| `hand:ladle` | ladle | L | LONG | method: LONG L | - |
| `hand:spatula` | spatula | L | LONG | like the ladle | - |
| `hand:spoon` | slotted spoon | L | LONG | like the ladle | - |
| `stick` | skewer (hand tool) | M | LONG | held one hand | - |
| `tawa` | tawa | STN | - | station piece | - |
| `vessel:pan` | pan | STN | - | station piece | - |
| `vessel:pot` | pot | STN | - | station piece | - |
| `vessel:tadka` | tadka pan | STN | - | station piece | - |
| `vessel:serving` | serving dish | STN | - | station piece | - |
| `vessel:kadai` | kadai | STN | - | station piece | - |

### clinic.json `items[id].sizeClass` (53)

| id | name | class | flags | why |
|---|---|---|---|---|
| `paani` | water jug | L | - | two-hand jug |
| `cloth` | washcloth | M | - | one hand |
| `plaster` | plaster | S | - | method: S |
| `bandage` | bandage roll | M | - | method: M |
| `thread` | thread spool | S | - | fingers |
| `needle` | needle | S | LONG | fingers, thin |
| `hammer` | reflex hammer | M | LONG | one hand, long |
| `xray` | x-ray film | L | - | two-hand sheet |
| `cast` | plaster cast | L | - | two-hand |
| `crutches` | crutches | L | - | method: L always |
| `torch` | torch | M | LONG | one hand, long |
| `tweezers` | tweezers | S | LONG | method: LONG S |
| `cotton-bud` | cotton bud | S | LONG | fingers, thin |
| `cotton` | cotton ball | S | - | fingers |
| `drops` | dropper bottle | S | - | fingers |
| `bottle` | medicine bottle | M | - | one-hand bottle |
| `toothbrush` | toothbrush | S | LONG | fingers, thin |
| `comb` | comb | S | LONG | fingers, thin |
| `drill` | dentist drill | M | LONG | one hand, long |
| `paste` | toothpaste tube | M | - | one-hand tube |
| `limu` | lemon | S | - | same as fru-02 |
| `loon` | salt pot | S | - | same as spi-16 |
| `khun` | sugar pot | S | - | small pot |
| `dudh` | milk glass | S | - | glass (rough art) |
| `cup` | glass | S | - | method: hiccups S |
| `thermometer` | thermometer | S | LONG | method: LONG S |
| `blanket` | blanket | L | - | two-hand cloth |
| `fan` | hand fan | M | - | one hand |
| `syringe` | syringe | S | LONG | method: LONG S |
| `lollipop` | lollipop | S | - | fingers |
| `pointer` | pointer stick | M | LONG | one hand, long |
| `patch` | eye patch | S | - | fingers |
| `tub` | tub | M | - | one-hand tub |
| `spoon` | medicine spoon | S | LONG | like teaspoon |
| `honey` | honey jar | M | - | one-hand jar |
| `tissue` | tissue | S | - | fingers |
| `stethoscope` | stethoscope | M | - | one hand |
| `sticker` | sticker | S | - | fingers |
| `fru-02` | lemon (alias of limu) | S | - | same as limu |
| `spi-16` | salt (alias of loon) | S | - | same as loon |
| `cook-khun` | sugar (alias of khun) | S | - | same as khun |
| `cook-paani` | water (alias of paani) | L | - | same as paani |
| `care-drops` | drops (alias) | S | - | same as drops |
| `tool-pointer` | pointer (alias) | M | LONG | same as pointer |
| `care-patch` | eye patch (alias) | S | - | same as patch |
| `care-plaster` | plaster (alias) | S | - | same as plaster |
| `tool-tweezers` | tweezers (alias) | S | LONG | same as tweezers |
| `jug-hot` | hot jug | L | - | two-hand jug |
| `jug-cold` | cold jug | L | - | two-hand jug |
| `strip` | thermometer strip | S | LONG | same as thermometer |
| `tool-hand` | helping hand | M | - | a hand part |
| `shampoo` | shampoo bottle | M | - | one-hand bottle |
| `bug-jar` | bug jar | M | - | one-hand jar |

### clinic/heal/eye.json `items[id].sizeClass` (3)

| id | name | class | flags | why |
|---|---|---|---|---|
| `drops-green` | eye drops | S | - | fingers |
| `pointer` | pointer | M | LONG | same as pointer |
| `patch` | eye patch | S | - | same as patch |

### clinic/heal/foot.json `items[id].sizeClass` (4)

| id | name | class | flags | why |
|---|---|---|---|---|
| `paani` | water jug | L | - | same as paani |
| `loon` | salt pot | S | - | same as loon |
| `tweezers` | tweezers | S | LONG | same as tweezers |
| `plaster` | plaster | S | - | same as plaster |

### clinic/heal/hair.json `items[id].sizeClass` (3)

| id | name | class | flags | why |
|---|---|---|---|---|
| `comb` | comb | S | LONG | same as comb |
| `bug-jar` | bug jar | M | - | same as bug-jar |
| `shampoo` | shampoo | M | - | same as shampoo |

### clinic/heal/hic.json `items[id].sizeClass` (2)

| id | name | class | flags | why |
|---|---|---|---|---|
| `cup` | glass | S | - | same as cup |
| `paani` | water jug | L | - | same as paani |

### clinic/heal/tummy.json `items[id].sizeClass` (2)

| id | name | class | flags | why |
|---|---|---|---|---|
| `cup` | cup | S | - | same as cup |
| `hot-water-bottle` | hot-water bottle | L | - | two-hand bottle |

### dress.json `words[id].size` (4)

| id | name | class | flags | why |
|---|---|---|---|---|
| `ph-needle` | needle | S | LONG | fingers, thin |
| `ph-thread` | thread | S | - | fingers |
| `ph-scissors` | scissors | M | LONG | method: LONG M |
| `ph-pin` | pin | S | LONG | fingers, thin |

## Disagreements with existing data

1. **Clinic:** no item row had a `size` before (the field `Kit.itemInfo` reads comes from belt placements: "small"/"big"). Nothing to agree or disagree with; the placements' `.small`/`.big` stay as they are.
2. **Cook shelf numbers** (old number mapped as the method says: 1 L, 0.9/0.85 M, 0.8/0.7 S) against the class by how it is held. The old number is kept; the class is added beside it.

| id | name | old number (as letter) | new class | why |
|---|---|---|---|---|
| `cook-chai` | tea jar | 1 (L) | M | one-hand jar |
| `cook-khun` | sugar jar | 1 (L) | M | one-hand jar |
| `veg-12` | green chilli | 0.9 (M) | S | fingertip pod |
| `veg-13` | garlic | 1 (L) | S | method: fingers |
| `veg-10` | green peas | 0.9 (M) | S | pinch of peas |
| `veg-14` | ginger | 1 (L) | S | small root piece |
| `fru-02` | lemon | 0.9 (M) | S | method: fingers |
| `spi-10` | cardamom | 1 (L) | S | spice jar |
| `spi-16` | salt | 1 (L) | S | spice jar |
| `ph-chana` | chickpeas | 1 (L) | M | one-hand tin |
| `ph-dahi` | yoghurt | 0.7 (S) | M | method: tub |
| `ph-amli` | tamarind chutney | 1 (L) | M | one-hand bottle |
| `ph-lili` | mint chutney | 1 (L) | M | one-hand bottle |
| `ph-sev` | sev | 1 (L) | M | one-hand packet |
| `ph-keema` | mince | 0.7 (S) | M | one-hand tray |
| `ph-meat` | meat | 0.7 (S) | M | one-hand tray |
| `ph-ghee` | ghee | 0.7 (S) | M | one-hand jar |
| `ph-cocoa` | cocoa tin | 1 (L) | M | one-hand tin |
| `ph-ketchup` | ketchup | 1 (L) | M | one-hand bottle |
| `ph-honey` | honey | 1 (L) | M | one-hand jar |
| `ph-rose` | rose syrup | 1 (L) | M | one-hand bottle |
| `ph-chicken` | chicken | 0.7 (S) | M | one-hand pack |
| `ph-fish` | fish | 0.7 (S) | M | one-hand pack |
| `ph-butter` | butter | 0.7 (S) | M | one-hand tub |
| `ph-cheese` | cheese | 0.7 (S) | M | one-hand pack |
| `ph-cream` | cream | 0.7 (S) | M | one-hand carton |
| `ph-pastry` | pastry | 0.85 (M) | S | fingers |
| `ph-candles` | candles | 0.85 (M) | S | small pack |
| `ph-chocolate` | chocolate bar | 0.85 (M) | S | fingers |

Pattern: the old numbers rated the pantry's *container* (a tall jar = 1); the class rates the *thing* (garlic, cardamom, salt, ginger, peas are S whatever the jar; sugar and tea jars are M; fruit and veg that were 0.9 sit M or S by hand).

3. **Same word, two classes by view (allowed by the method):** `cook-khun` sugar jar M (shelf) against clinic `khun` pot S; `dudh` milk carton L (cook) against clinic milk glass S. `spi-16`, `fru-02`, `cook-paani` agree in both modes.

## Not sure of (for Zafar or the judge)

| id | name | doubt |
|---|---|---|
| `cook-daal` | daal bag | bag (L) or jar (M)? |
| `ph-lakri` | skewer | same item as hand tool stick |
| `ph-oil` | cooking oil | oil bottle: L or M? |
| `ph-rose` | rose syrup | bottle could be tall (L) |
| `ph-chicken` | chicken | whole bird would be L |
| `ph-fish` | fish | whole fish would be L/LONG |
| `fru-09` | coconut | two-hand coconut would be L |
| `ph-eggs` | egg box | W per method, but no letter given: M chosen |
| `ph-bread` | bread loaf | W per method, but no letter given: M chosen |
| `ph-candles` | candles | pack could be M |
| `hand:spatula` | spatula | spatula: L or M? |
| `hand:spoon` | slotted spoon | slotted spoon: L or M? |
| `stick` | skewer (hand tool) | same item as ph-lakri |
| `drill` | dentist drill | toy drill: M or S? |
| `paste` | toothpaste tube | tube could be S |
| `khun` | sugar pot | cook shelf jar is M |
| `dudh` | milk glass | cook carton is L |
| `cook-khun` | sugar (alias of khun) | see khun |
| `tool-hand` | helping hand | not a held thing |
| `hot-water-bottle` | hot-water bottle | L or M? |

## Implementation plan for the code step

1. `St.classFit(S, key, size, room)` in `js/cook/stations/station-lib.js`: factor L 1.0 / M 0.91 / S 0.84 from `look-rules.json` `sizes`; height = room x factor, never under 40 CSS px at 740x320; LONG on the slot's long side; W by width; STN skipped. It reads `Cook.item(id).size`, then `data.art.sizes[id]`; absent means M.
2. Chai (`chai-tray.js`, drop `SHELF_K` 117/819), daar (`daar.js` 590), pantry (`fetch.js` 102 and `Art.shelfSize`, `js/cook/art.js` 898): replace the number with the class. Then the number in `art.sprites.shelf` can go; until then it stays.
3. Clinic: rename `sizeClass` to `size` in `clinic.json` and the heal `items`; in `kit.js` 246/441 keep the placement's "small"/"big" under another name (or drop it) so `data-size` and `.small/.big` stop meaning two things; `clinic.css` 68-69 become one `--size-k` per class.
4. `sizecheck.mjs`, plus a check that fails a slot item with no class (cook words with image, heap or bowl, or a `shelf` entry; clinic items; dress tools). Rows marked unsure get Zafar's yes first.
5. `art-bible.md` section 4 and `look-rules.json` as the method says. The chai shelf swap lands with the stove-400 cut (spice jars drop to 40 px at 740x320): lab shot first.

## Proof

`node build/tools/review/checks.mjs` (full run, this branch): words, static (836 known, 0 new), leak (20 configs), bump, specs, docs, fixlist, recordings, art, size and load (29/29 pages) are ok. **One red, not mine:** `unit` 643 pass, 1 fail, "each of those docs is under its limit": `docs/design-language/art-pipeline.md: 13528 > 13500` (a file this step did not touch; `docs.mjs` itself reports within every limit). Needs a trim of that doc or a raised limit; left alone.

Also checked: all eight edited JSON files parse; each, with the new keys removed, equals its HEAD version exactly (additions only); `grep` of the readers found none that changes behaviour (reasoning under "What was written"). No screenshots taken.

