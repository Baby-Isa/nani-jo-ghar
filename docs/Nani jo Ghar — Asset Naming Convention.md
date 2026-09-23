# Nani jo Ghar — Asset Naming Convention

*How generated art sheets and the individual files sliced from them are named. Companion to the Image Prompt Sheets, Chapter 1 Art Prompts and Technical Plan docs.*

## Source sheets (unsliced, as generated)

Every sheet gets renamed on arrival, kept in `sources/`:

| Sheet type | Pattern | Examples |
| --- | --- | --- |
| Item grid (Template A) | `sheet-<category>-v<N>.png` | `sheet-fruit-v1.png`, `sheet-vegetable-v1.png`, `sheet-spice-v1.png`, `sheet-eid-decorations-v1.png` |
| Character sheet (Template B) | `char-<name>-v<N>.png` | `char-nani-v3.png`, `char-shopkeeper-v2.png` |
| Background (Template C) | `bg-<scene>-v<N>.png` | `bg-bazaar-stall-v3.png`, `bg-nani-kitchen-v3.png`, `bg-spice-cupboard-v1.png`, `bg-sitting-room-v1.png` |

`vN` tracks which regeneration was kept, matching the "kept as vN" notes in the Chapter 1 Art Prompts doc. A background is never sliced — the whole sheet is the game-ready asset once renamed, and saved directly to `assets/backgrounds/`.

## Sliced, game-ready files

**Items already in the content master** (fruit, vegetable, spice, and any future sheet once its words are added to the spreadsheet) are sliced one file per grid cell and named by the content master's `id` column, so the art and the word are joined by filename alone:

```
items/<category>/<id>.png
items/fruit/fru-01.png ... fru-16.png
items/vegetable/veg-01.png ... veg-16.png
items/spice/spi-01.png ... spi-16.png
```

This is what the Technical Plan means by "files named to match the content master's image_ref" — image_ref (`fruit-sheet r1c1`) is the *locator* used to find the item in the source sheet; the *filename* is the id.

**Character sheets** are sliced into their three poses by state name, not by number:

```
characters/<name>/<name>-neutral.png   (mouth closed)
characters/<name>/<name>-talking.png   (mouth open)
characters/<name>/<name>-happy.png     (celebrating)
```

**Items not yet in the content master** (generated ahead of word review, per the rule that images can precede the word list) are sliced and named by a plain English slug instead of an id, since no id exists for them yet:

```
items/<category>/item-<slug>.png       e.g. item-rice.png, item-plate.png
items/colour-threads/thread-<colour>.png
items/sweet-stall/sweet-<slug>.png
```

When any of these categories gets its own content-master rows, rename the files to that sheet's real ids in one pass (matching row order) rather than carrying the slug forward.

**Prop and container sheets** (the containers sheet, tableware sheet, Eid decorations sheet — see Chapter 1 Art Prompts) slice the same way as item grids: each cell gets its own file under `assets/props/<slug>.png` (e.g. `assets/props/lantern.png`, `assets/props/bunting.png`), since these aren't content-master vocabulary items, just scene dressing and carried/destination containers.

## Categories covered so far

| Category | Sheet slug | Status |
| --- | --- | --- |
| Fruit | fruit | In content master (fru-01–16) |
| Vegetable | vegetable | In content master (veg-01–16) |
| Spice | spice | In content master (spi-01–16) |
| Store cupboard | store-cupboard | Generated, not yet in content master |
| Household items | household | Generated, not yet in content master |
| Colour threads | colour-threads | Generated, not yet in content master |
| Clothes stall | clothes-stall | Generated, not yet in content master |
| Sweet stall | sweet-stall | Generated, not yet in content master |
| Eid decorations | eid-decorations | Generated 23 Sep 2026, kept as v1, not yet sliced (`sources/sheet-eid-decorations-v1.png`) |
| Nani | char-nani | v3, sliced |
| Shopkeeper | char-shopkeeper | v2, sliced |
| Bazaar stall | bg-bazaar-stall | v3, background, kept 23 Sep 2026 |
| Nani's kitchen | bg-nani-kitchen | v3, background, kept 23 Sep 2026 |
| Spice cupboard | bg-spice-cupboard | v1, background, kept 23 Sep 2026 |
| Sitting room with dastarkhwan | bg-sitting-room | v1, background, kept 23 Sep 2026 |

## Slicing method

A first version of the script assumed each item sat inside an equal-sized grid box, and blended out the magenta with a soft edge. Both assumptions were wrong: items don't fill their cells evenly (a shoe's toe, a mirror's handle can cross the notional boundary), so a fixed box clipped some items and let slivers of the neighbouring item bleed in; and a soft edge left a visible magenta rim on a dark background.

**The method that actually works:**

1. Key the flat magenta (`FF00FF`) background with a hard colour-distance threshold, not a soft one.
2. Find every connected blob of non-magenta pixels across the *whole* sheet (not per assumed cell).
3. Assign each whole blob — not pixel-by-pixel — to whichever expected grid position its centroid is nearest to. This is what fixes overflow: a shoe that pokes past the midline between two cells is one connected blob, so it moves as a unit to the cell its centre belongs to, rather than being sliced in half at the midline. A multi-part item (three separate lychees, a pile of cloves) still ends up under one label even though its pieces don't touch, as long as each piece's centroid is closer to that cell than any other. A handful of stray pixels (compression noise) too small to be a real fragment is dropped rather than assigned anywhere.
4. Erode the mask by ~2px to remove the anti-aliased rim entirely, then crop to that blob's own bounding box — never a shared fixed box — with a small pad.
5. Alpha is binary (fully opaque or fully transparent), not blended, which is the right call for flat cel-shaded art with thick outlines and avoids the soft-edge amplification that caused the magenta rim.
6. Build a black-backed and white-backed contact sheet per category and check every item against both before delivery — the rim was invisible on white and obvious on black, so checking only one background misses it.

**Known residual cases, not yet fixed:**

- `item-vermicelli.png` (store cupboard, not yet in the content master) still shows a faint magenta fleck around its lacy strand edges — the strands are thin enough that some partially-transparent rim pixels read as "far enough from magenta" by colour distance while still carrying a slight tint. Regenerating that one sheet with "transparent background" in the ChatGPT prompt (rather than magenta) would sidestep the problem entirely; not worth special-casing the script for one item in a future-scene sheet.
- The Eid decorations sheet's fairy-lights cell has the same class of problem: the bulb glow blends into the magenta at the edges. Same fix path — clean cut plus a code-added glow effect, not a regeneration (see Chapter 1 Art Prompts, section 7 review).
