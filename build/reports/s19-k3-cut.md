# s19-k3-cut: the fixes run's picks cut into game assets (11 Nov)

Branch `s19-k3cut`, never pushed. Tool: `build/tools/art/s19_k3_cut.py` (s19_k2_cut's pattern: the magenta key, despill, pieces,
edge_bleed). Numbers: `sources/art/s19-k3/results/cut-numbers.json`. No js/, data/ or css/ file is touched: the wiring below is
for the builders.

## What was cut (Zafar's picks)

| Pick | New file(s) (under `assets/cook/items/v4/` unless named) | Replaces |
|---|---|---|
| B5r-3 | `baking/jug-flour`, `jug-milk`, `jug-sugar`, `jug-yoghurt` (323x301, one shared box, bottom-aligned, so they swap in place) | `assets/cook/proto/baking/jug-flour`, `-milk`, `-sugar`, `-yoghurt` |
| B6-2 | `baking/jar-flour` (353x600), `jar-sugar` (333x495), `jar-salt` (327x399): one scale for all three | `assets/cook/items/shelf-cook-atto-bare-f`, `shelf-cook-khun-bare-f`, `shelf-loon-jar-v2-f` |
| D4-2 | `daar/chop-heap-onion` (raw heap), `chop-piece-onion-1..6`; `chop-heap-onion-golden`, `chop-piece-onion-golden-1..6`; and each side whole as `chop-scatter-onion`, `chop-scatter-onion-golden` | `assets/cook/items/v3/daar/chop-heap-onion`, `chop-piece-onion` (golden and scatters: new, nothing uses them yet) |
| C12-3 | `chaat/layer-bataato`, `layer-chana`, `layer-sev` (each scatter whole, ~400 px) | nothing: potato, chickpeas and sev are stamped from their bowls today |
| K10-2 | `kit/tray-steel-long` (1200x400, 3:1) | `kit/tray-steel` (1000x422) |
| K8r-2 | `samosa/karahi-oil-v2` (1000x821) | `samosa/karahi-oil` (1000x799) |
| G1r-2 | `kit/grill-v2` (1621x813, today's canvas) | `kit/grill` (1621x813) |
| KF-6 | `assets/cook/serve/kitchen-tall.webp`, written in place | KG (the same file) |

## The changes to hand the builders

1. **Jugs** (baking): `data/stations/baking.json:453-456`, `items.jug.states`: `milk`, `flour`, `yoghurt`, `sugar` →
   `assets/cook/items/v4/baking/jug-<same>.webp`. Their lines (fractions from the top, measured: contents' top 0.189-0.199, the
   inside's floor 0.894-0.897; five even lines between): add to `lineAtFor` (`:494`) for each of the four
   `{"1": 0.755, "2": 0.614, "4": 0.472, "6": 0.331, "10": 0.189}` (per jug in cut-numbers.json; they differ by under 0.01). Their
   empty picture: add each to `emptyFor` (`:491`) as `assets/cook/items/v4/baking/jug-0.webp` (the same B2 jug; its canvas is 1.088:1
   to these 1.073:1, so the swap may shift about 1.5%). Also the manifest `:782-785` and the cards `:637`, `:707` if wanted.
2. **Jars** (baking): `data/stations/baking.json:586`, `:589`, `:590` (`items.containers.files`): `cook-atto` →
   `assets/cook/items/v4/baking/jar-flour.webp`, `cook-khun` → `.../jar-sugar.webp`, `spi-16` → `.../jar-salt.webp`; the manifest
   `:789`, `:792`, `:793` the same. Their heights as a share of the flour jar's: sugar 0.825, salt 0.664. `js/cook/stations/baking.js:314`
   scales every container to one height (`tall`), which would make the three the same height: to keep "told apart by height",
   multiply that scale by the jar's share (say a new `containers.heights` `{"cook-atto": 1, "cook-khun": 0.825, "spi-16": 0.664}`).
3. **Onion** (daar): `js/cook/stations/daar.js:77` `pileUrl` and `:391` (the piece) build `${V3}chop-heap-${..}` and
   `${V3}chop-piece-${..}`: for `veg-02` use `assets/cook/items/v4/daar/chop-heap-onion.webp` and `.../chop-piece-onion-1.webp`
   (tomato and chilli stay v3). Prefetch `data/cook.json:5402`, `:5405` the same. Heap 435x427 (was 477x469), pieces 65-90 px (was 159x164;
   `heapSize` sets the drawn size, so only the load changes).
4. **Chaat scatters**: `data/stations/chaat.json:50-57` (`layers.files`): add `"veg-01": "layer-bataato"`, `"ph-chana": "layer-chana"`,
   `"ph-sev": "layer-sev"`; and the note `:59` ("Potato, chickpeas and sev have no layer picture") changes. The manifest
   (`assets/cook/items/v4/chaat/*`) already covers them.
5. **Sekelo's tray**: `js/cook/grill-kit.js:49`:
   `tray: { key: "gk-tray", url: K4 + "tray-steel-long.webp", w: 1200, h: 400, inner: [0.042, 0.115] }`. inner in today's convention:
   measured the same way (the rim band's inner edge), today's tray gives [0.027, 0.064] against its data's [0.05, 0.11], and the new one
   [0.021, 0.062] (25 px of 1200 and 400, today's 27 of 1000 and 422: the same band); so today's 50 and 46 px insets carried over are
   [0.042, 0.115]. GK.ART.tray is corn's too (`data/stations/corn.json:477` lists `kit/tray-steel.webp`): for sekelo alone it needs a
   per-station override.
6. **Karahi** (samosa): `data/stations/samosa.json:19` → `assets/cook/items/v4/samosa/karahi-oil-v2.webp`; `:41-47` `meta.karahi` →
   `{"w": 1000, "cx": 0.4959, "cy": 0.4982, "r": 0.4031, "oil": 0.748}` (was 0.496, 0.4994, 0.394, 0.774); manifests `:154` and
   `data/cook.json:5564`, `:5590`. The oil's own centre sits about 10 px below the rim's (0.4926, 0.5104): the visible inner wall is
   wider at the top, as a deep karahi's is; SAM-14's "within 0.8 of the oil" holds round the rim's centre.
7. **Grill**: `js/cook/grill-kit.js:48`:
   `grill: { key: "gk-grill", url: K4 + "grill-v2.webp", w: 1621, h: 813, far: 0.019, near: 0.974, bed: [0.083, 0.916] }`.
   Two bars across the coals (rims at rows 3-29, 261-276, 555-571, 780-804). The bed is wider than today's (0.105-0.895): the side
   rails' inner edges, measured as today's bed was (today's file gives 168 and 1454 px = its 0.105 and 0.895). far and near measured on
   today's file the same way read 0.024 and 0.977 against its data's 0.022 and 0.972, so these may want the same -0.002 to -0.005.
   Manifest: `data/stations/corn.json:476`.
8. **Kitchen**: none. Written in place; its island's back edge is unmoved.

## Proof

- **Contact sheet** (every cut on a dark and a light ground): `sources/art/s19-k3/results/cut-sheet.jpg`. Looked at whole and zoomed
  (the jug handles, the jar necks, the onion heap's foot, the sev crossings, the karahi and grill handles, the tray's middle): no pink
  fringe or halo, nothing cropped, the handles' loops clear.
- **Pink, measured**: `edge_bleed.pink_share` 0.0 on every new cut but the raw onion's pieces (0.01-0.12: the onion's own pink skin
  lines at a piece's edge); every visible pixel with min(r,b) - g over 15 within 4 px of an edge: 0 on every onion file (2 on the raw
  scatter). Glass: pixels with min(r,b) - g over 8: jugs 0, jars 4-19 (dark lid-shadow pixels, max 16 except one at 55 at alpha 28).
  `edge_bleed.py --check` over the five folders: 2 of 93 over 15%, both old (`chaat/layer-dungri`, red onion by nature; `kit/tray-stone`).
- **See-through glass**: the share of each glass piece that is partly transparent: jugs 0.16, jars 0.07-0.11 (the contents are solid).
  The glass is keyed linearly (alpha = 1 - its magenta over the ground's), its colour unmixed from the ground and greyed; the solid
  glass edges' faint lavender brought to grey. `edge_bleed.py` now skips `/baking/jar-` too, as it skips the jugs and bowls.
- **What the key needed beyond s19_k2_cut**: the ground is each picture's own median border colour (#EC-#FA, green 0-44), not #FF00FF;
  the clear pixels' colour set to the nearest visible pixel's (WebP's half-resolution colour carried the magenta kept under alpha 0
  into the rim); a pink edge cast within 4 px taken from the nearest clean pixel, before and after the resample; the raw onion heap's
  magenta gap (the ground through a gap at its foot, shaded red-magenta) cleared; chaat's scatters lose any pixel with blue over green
  (the magenta where sev strands cross).
- **Tray, 3:1**: the source tray came 1442x435 (3.31:1); its ends (0.6 of its height from each, past the corners) kept, the straight
  middle resampled from 920 to 783 px along the brushing: no seam (a cut-and-join left a visible line; resampling does not).
- **Grill canvas**: tight it is 1515x757 (2.001:1); brought to today's 1621x813 (1.994:1, a 0.4% stretch), so it drops in.
- **The kitchen**: KF-6 (1446x1087) to 2100x1575 by LANCZOS and `UnsharpMask(radius 1.2, 40%, threshold 3)`, webp q84 m6. Those
  numbers are fitted: KG resampled with each candidate came closest to today's file with these (mean difference 1.2 of 255, webp loss).
  Island back edge, measured as s19-serve2 did (the strongest step up into the marble per column, median of columns 300-1800): today's
  file 1058.5, the new 1058.5, so core y 608.5, **unmoved**. Side by side: `sources/art/s19-k3/results/kitchen/kitchen-side-by-side.jpg`;
  marble crops (the same 700x300 of the island, x 700-1400, y 1120-1420): `kitchen-marble-crops.jpg`; today's file kept as
  `kitchen-tall-before.webp`.
- **The marble's colour**: today's mean (243, 232, 229), hue 16 deg, 5.6% of its pixels under 10 deg (pink); the new (246, 230, 219),
  hue 24 deg, 0% pink, chroma 28 against 18. Next to the old it reads warmer and peachier, not pink (the old one is the pinker of the
  two), so **nothing was neutralised**. If Zafar finds it too peachy, the fix is a slight desaturation of the island's top alone.
- **artcheck.mjs**: 493 findings, 493 known, 0 new (cache cleared). It first found one new: `jar-salt` "a soft rim 5.2 px wide on
  cream" (limit 5): the salt jar's see-through glass walls, read as a solid piece because its contents fill it (the pixel check calls a
  piece glass only when over 28% of it is soft). `build/tools/art/artpixels.py` now names `v4/baking/jar-*` and `jug-*` as glass, as
  `edge_bleed.SKIP` does (the glass rule still applies: rim allowance 10 px, dirt and smudge); no known finding changed. Veto it and
  the alternative is a harder glass wall on the salt jar.
- **artjudge.py**: does not apply: the run was a hand-written block with no run spec (`no images ... match the run`).

## Rows moved (docs/process/regressions.md)

CK-85 (the scatters landed), ART-76 (the grill redrawn and cut), ART-77 (to fix: check: KF-6 in place), SAM-34 (to fix: code: the karahi
landed). CK-79, CK-81, CK-82, CK-84 were already "to fix: code".

## Open

- The two-picture mode's KO and KS (`kitchen-order`, `kitchen-serve`) are KG's, not KF-6's (KF-O and KF-S were not picked); the tall
  mode is the one in use.
- The golden onion and the two scatters have no place in the game yet.
- The jugs keep no drawn lines (as the B2 jugs): the lines above are proposed, evenly spaced, for the rising-mask reveal.
