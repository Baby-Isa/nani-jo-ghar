# Cook v3 art: the 28 ChatGPT sheets, cut, and the shared kit swapped (29 Sept)

Branch `claude/nifty-rubin-c0d431`. Brief: rename and cut all 28 images from Zafar's play-test pack
(`docs/chatgpt-art-prompts-cook-v3.md`), put the parts every station shares into `Cook.Kit` (the hob
family, knobs, flames, faces), and cut and document the rest for the station sessions.

## 1. The mapping (all 28 checked by eye: every one matches the orchestrator's list)

| upload | prompt | saved as | match |
|---|---|---|---|
| `chatgpt-cook-v3-01-h1.png` | H1, 2-burner hob | `h1-hob-2-v1.png` | ✓ |
| `…02_27_56 PM` | H2, 1 burner (portrait) | `h2-hob-1-v1.png` | ✓ |
| `…02_33_16` | H3, 3 burners | `h3-hob-3-v1.png` | ✓ |
| `…02_36_51` | H4, 4 burners | `h4-hob-4-v1.png` | ✓ |
| `…02_40_03` | H5, wide single burner | `h5-hob-wide-v1.png` | ✓ |
| `…02_43_57` | H6, knob off/on | `h6-knob-off-on-v1.png` | ✓ |
| `…02_51_14` | A1, Nani / Nana / Ma × 3 | `a1-faces-nani-nana-ma-v1.png` | ✓ |
| `…02_56_12` | A2, Ali / Isa × 3 | `a2-faces-ali-isa-v1.png` | ✓ |
| `…03_00_44` | C1, chai pan states | `c1-chai-pan-states-v1.png` | ✓ |
| `…03_12_05` | M1, dough piles + balls | `m1-dough-v1.png` | ✓ |
| `…03_18_06` | M2, chakla + velan | `m2-chakla-velan-v1.png` | ✓ |
| `…04_12_12` | M3, maani states | `m3-maani-states-v1.png` | ✓ |
| `…04_16_25` | M4, tawa | `m4-tawa-v1.png` | ✓ |
| `…04_20_01` | M5, wooden turner | `m5-turner-wood-v1.png` | ✓ |
| `…04_24_22` | D1, daar pot states | `d1-daar-pot-states-v1.png` | ✓ |
| `…04_33_23` | D2, ladle (in a pot) + daar bowl on trivet + veg bowl | `d2-ladle-trivet-bowl-v1.png` | ✓ |
| `…04_36_27` | T1, chaat glass bowl side-on | `t1-chaat-bowl-side-v1.png` | ✓ |
| `…04_41_57` | T2, chaat pots side-on | `t2-chaat-pots-side-v1.png` | ✓ |
| `…04_48_56` | S1, samosa fold | `s1-samosa-fold-v1.png` | ✓ |
| `…04_52_47` | S2, the house board | `s2-board-v1.png` | ✓ |
| `…04_59_40` | S3, karahi | `s3-karahi-v1.png` | ✓ |
| `…05_02_45` | S4, plate + jharo | `s4-plate-jharo-v1.png` | ✓ |
| `…05_05_52` | S5, fillings as heaps | `s5-fillings-top-v1.png` | ✓ |
| `…05_08_57` | K1, rack 0–4 skewers | `k1-rack-0-4-v1.png` | ✓ |
| `…05_13_54` | K2, plates 1–4 skewers | `k2-plate-1-4-v1.png` | ✓ |
| `…05_17_58` | K3, grill | `k3-grill-v1.png` | ✓ |
| `…05_43_32` | K4, chunky pieces (no holes) | `k4-pieces-v1.png` | ✓ |
| `…05_53_13` | K5, heaps | `k5-heaps-v1.png` | ✓ |

All renamed with `git mv` in `sources/art/cook-v3/`.

## 2. The cuts

`python3 build/cut_cook_v3.py` (every group; `--only hob,faces,...` for one) → `assets/cook/items/v3/<group>/*.webp`
plus a `meta.json` each; `assets/cook/items/v3/README.md` lists every file, what it is, its measured meta and
what it's for (`python3 build/v3_readme.py` writes it). 117 sprites + 15 faces.

The method (VISUAL-QA §2, cut_tick_v2's):
- the object is everything not connected to the flat grey, holes filled; **then any enclosed patch that is flat
  background grey is background again** (inside loop handles, the rack's frame, the grill's handles, the jharo's
  holes, the tawa's handle hole);
- colour-to-alpha edges against the measured grey (each sheet's own; D2's three panels each their own);
- **ChatGPT drew soft drop shadows on most sheets** despite "no shadows": unsaturated slightly-dark patches
  outside the body are removed (the game draws its own contact shadows);
- glass (T1, T2) is colour-to-alpha all over, solid only where strongly coloured, so the cream shows through;
- **the grey-leftover check**: every cut is scanned for an opaque patch of flat background grey (≥120 px); the
  first run flagged 30 cuts (loop handles, rack, grill, jharo, glass); the final run flags **none**. A flagged
  cut would get `grey_left_px` in its meta.json;
- **registered canvases**: one canvas per object shown in several states, placed by an anchor measured on each
  cell: the rim centre (C1 pans, D1 pots, M3 maani, K2 plates), the bottom-centre (T2 pots), the strip's right
  end (S1 folds), the rack's left end + lower rail (K1). ChatGPT's grids aren't equal (D1's bottom row crossed
  the equal-thirds line and got clipped in the first run), so cells are cut on lines measured midway between
  the drawn objects;
- the hobs are scaled so every burner's brass cap matches the old hob's (r 70.9 px), so each station's hob
  scale keeps its burner size (the supports matched too: 213 px before, 205 px now);
- **the ladle (D2)** came standing in a small pot: it is cut out along a hand-drawn outline (the bowl's circle,
  the handle polygon, the handle's hole; `LADLE` in the script) → `daar/ladle.webp`. The pot is dropped.
- the faces (A1/A2) are framed by the eyes (read off a 10 px grid, `build/face_eyes_v3.py`): the eyes on one
  line at 45% and 0.32 of the badge apart (a closer crop than before, so the face fills the circle, X4), the
  head tilt halved, and the person cut from the grey (so the badge's white disc shows behind).

Contact sheets on the game's cream (zoomed edges too), all looked at:
`build/reports/cook-v3-art/contact-{hob,chai,maani,daar,chaat,samosa,sekelo,faces}.png`,
`contact-zoom-edges.png` (each cut's top-left quarter, enlarged: no grey fringe, no ring, loops open).

## 3. Measured, and checked

`python3 build/check_vessel_meta.py` now also re-measures every v3 meta: each round thing's centre and radius
(47: pans, pots, bowls, maani, dough balls, chakla, tawa, karahi, plates, knobs; the ladle's bowl with its
handle masked off), and each hob's burner centres re-found from its brass caps, compared with both
`hob/meta.json` **and** `Cook.Kit`'s `HOBS` table. RESULT_CHECK

## 4. What changed in the game (Cook.Kit and chai only)

- **The hob family** (`js/cook/kitchen-kit.js`): `HOBS` 1–4 + `wide`, each drawn whole (H1–H5), burner centres
  and the front strip's middle measured from the art. `Kit.hob`, `Kit.size`, `Kit.art` take `wide: true` for
  the wide one (a kit option: no station uses it yet). Each burner has its own measured y. `compose_hobs` is
  retired (`build/cut_chai_v2.py`) and its four stitched hobs deleted.
- **Knobs (H6)**: `v3/hob/knob-off|on.webp`; the knob's round body is now the badge's size (64 px: the sprite is
  86 px, its body 0.742 of it); "on" = the glowing knob, turned a quarter (bar vertical).
- **Flames**: sized per vessel: the ring reaches 1.2 × the flame radius the station passes (was 1.29), and never
  more than 0.46 of the burner pitch, so neighbours can't touch at 3–4 pans. The 15 px gauge sits on top.
- **Faces**: `assets/cook/characters/<who>-face[-happy|-frown].webp` for nani, nana, ma, cousin (Ali) re-cut from
  A1/A2; isa's are new (Cook doesn't show Isa yet). The sidebar, intro card, hob badges and review face use them.
- **Chai** (`js/cook/stations/chai-tray.js`), only what the swap needed: the hob height per burner count, each
  pan on its own burner's measured y, and the hob's scale solved with the tray (the new 4-burner hob is wider:
  1753 px vs 1483, because H4's burners are drawn smaller relative to its frame).
- Maani, daar and samosa needed no change: they already place by `Kit.hob` / `Kit.size`, and the new 1-burner
  hob (465 × 658) is close to the old (421 × 671).

## 5. Screenshots (VISUAL-QA §5): flaws first

SHOTS

## 6. Images that could be redone (none blocks)

REDO

## 7. Tests

TESTS
