# Cook v3 art: the 28 ChatGPT sheets, cut, and the shared kit swapped (29 Sept)

Branch `claude/nifty-rubin-c0d431`. Brief: rename and cut all 28 images from Zafar's play-test pack
(`docs/archive/art-prompts/chatgpt-art-prompts-cook-v3.md`), put the parts every station shares into `Cook.Kit` (the hob
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
what it's for (`python3 build/v3_readme.py` writes it). 95 sprites + 15 faces.

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
(41: pans, pots, bowls, maani, dough balls, chakla, tawa, karahi, plates, knobs; the ladle's bowl with its
handle masked off), and each hob's burner centres re-found from its brass caps, compared with both
`hob/meta.json` **and** `Cook.Kit`'s `HOBS` table. **Result: all pass** (41 round things within 0.2% of the art, the 5 hobs' burners
within 0.04%, meta = the kit's table exactly; plus the 4 older checks). It fits the rims independently of the
cut script's own recorded values: the ladle's bowl (recorded from its hand-drawn outline) came back 0.17% off.

## 4. What changed in the game (Cook.Kit and chai only)

- **The hob family** (`js/cook/kitchen-kit.js`): `HOBS` 1–4 + `wide`, each drawn whole (H1–H5), burner centres
  and the front strip's middle measured from the art. `Kit.hob`, `Kit.size`, `Kit.art` take `wide: true` for
  the wide one (a kit option: no station uses it yet). Each burner has its own measured y. `compose_hobs` is
  retired (`build/cut_chai_v2.py`) and its four stitched hobs deleted.
- **Knobs (H6)**: `v3/hob/knob-off|on.webp`; the knob's round body is now the badge's size (64 px: the sprite is
  86 px, its body 0.742 of it); "on" = the glowing knob, turned a quarter (bar vertical); "low" now turns it to
  135° (bar diagonal), not 180°, where the new bar lay flat again and read as "off".
- **Flames**: sized per vessel: the ring reaches 1.2 × the flame radius the station passes (was 1.29), and never
  more than 0.46 of the burner pitch, so neighbours can't touch at 3–4 pans. The 15 px gauge sits on top.
- **Faces**: `assets/cook/characters/<who>-face[-happy|-frown].webp` for nani, nana, ma, cousin (Ali) re-cut from
  A1/A2; isa's are new (`Cook.FACES` gains "isa"; Cook doesn't show Isa yet). The sidebar, intro card, hob badges
  and review face use them. `build/cut_characters.py` no longer rewrites them (`--old-faces` to force it).
- **Chai** (`js/cook/stations/chai-tray.js`), only what the swap needed: the hob height per burner count, each
  pan on its own burner's measured y, and the hob's scale solved with the tray (the new 4-burner hob is wider:
  1753 px vs 1483, because H4's burners are drawn smaller relative to its frame).
- Maani, daar and samosa needed no change: they already place by `Kit.hob` / `Kit.size`, and the new 1-burner
  hob (465 × 658) is close to the old (421 × 671).

## 5. Screenshots (VISUAL-QA §5): flaws first

Uncropped shots in `build/reports/cook-v3-art/shots/` (laptop 1366×768 and phone landscape 844×390), taken
with the stations' own shoot scripts (`shoot_chai_v2.py`, now with `--cups N`; `shoot_maani_v2.py`,
`shoot_daar_v2.py`, `shoot_samosa_v2.py`; `shoot_review.py`, now with `--out`). Each looked at, zoomed on the hob.
Knobs ×2: `build/reports/cook-v3-art/knobs-off-on-x2.png`.

| shot | flaws found | what's right |
|---|---|---|
| chai, 1 person, boiling (`chai/laptop-l1-boiling`, `chai/phone-landscape-l1-boiling`) | the pan's handle reaches past the hob's top edge (as before); the hob's front strip is tall for one badge and knob | the portrait hob-1; pan centred on the burner; flames peek just past the rim under the gauge; knob on (bar upright, warm rim) |
| chai, 2 people, start / boiling (`laptop-l2-start`, `laptop-l2-boiling`, `chai/phone-landscape-l2-boiling`) | the selected pan's beige halo is big (the station's, unchanged); the pan supports' arms show past the pans (they did before too: same burner size) | even silver frame, clean corners (X5); both pans on their burners; knobs the badges' size; off = bar flat, on = upright |
| chai, 3 people, boiling (`chai/laptop-l3-boiling`) | hob-3's front strip is deeper than hob-2's (H3 was drawn deeper): more empty black below the knobs | three flame rings with clear gaps (no touching, X6); the 15 px gauge reads on each rim |
| chai, 4 people (`chai/laptop-l2-4cups-*`, `chai/phone-landscape-l2-4cups-*`) | **the game never orders 4 cups** (the family list is Nana, Ma, Ali, and levels stop at 3): shot with `--cups 4`, Isa joining for the shot. The sidebar can't fit four cards on the laptop (the fourth is cut off: not this change). Pans are smaller (k 0.63 vs 0.69 before: H4's burners are drawn small inside a wide frame, so the hob is wider for the same burner) | four burners, four pans, flames apart with ~70 px between them, gauges read; the new Isa badge |
| maani, tawa / rolling (`maani/laptop-l2-*`, `maani/phone-landscape-l2-*`) | the tawa (and its handle) is wider than hob-1 and overhangs it a little; the chimta overlaps the hob's right edge (the station's own art, unchanged) | tawa centred on the burner; badge + knob (high: upright) on the front strip; gauge ring round the tawa |
| daar, tadka / stir (`daar/laptop-l1-tadka-mid`, `stir-mid`, `daar/phone-landscape-l1-*`) | **"low" read like "off"**: the kit turned the knob 180° for low, which lays the H6 bar flat again → fixed: low is 135° (the bar diagonal, glowing), re-shot (`daar-knob-low-x1.png`: tadka high, done low, stir low). One phone frame shows a small white dot under the knob: the coach's moving pointer under the dim, not the art | pot centred; flames peek round the pot, the gauge on top |
| samosa, fry (`samosa/laptop-l1-frying`, `samosa/phone-landscape-l1-frying`) | **the karahi is much wider than hob-1** and hangs over both sides (it did on the old hob too). The wide hob (H5, `wide: true`) is the fix; left to the samosa session with the rest of its layout (the plate would need to move right ~30 px) | the karahi centred on the burner; knob on the strip; gauge round the samosa |
| review face (`review/chai-tray-happy-laptop-review`, `chai-tray-frown-laptop-review`, `chai-tray-happy-phone-landscape-review`, `daar-frown-phone-landscape-review`) | on phone the face is clamped to the view's top, touching the stage's edge; Nana's white cap blends into the badge's white disc at the top | the new A1 faces: happy (big smile) and a gentle frown read at a glance; framed like the sidebar badges (eyes on one line) |
| knobs ×2 (`knobs-off-on-x2.png`) | the on-glow is subtle at 64 px: it reads as a warmer, softer rim more than a glow | off and on are clearly different (bar flat vs upright); same size as the badge beside it |

## 6. Images that could be redone (none blocks)

Nothing has to be redone for the kit to work; all 28 are usable. Worth a second go, if there's a free ChatGPT run:
- **H4 (4 burners):** it failed its own check ("the same burner size as H1"): its burners are drawn about 15% smaller
  relative to the frame, so once every burner is scaled to the same size, hob-4 comes out wide (1753 px) and chai's
  4-pan layout shrinks a little. A redo with H1's burner size, and the hob only as wide as four burners need, would
  give bigger pans at 4. (Low priority: the game never shows 4 pans today.)
- **H6 (knob on):** the warm glow is subtle once the knob is badge-sized (64 px). A stronger, wider orange glow would
  read better. The bar's turn carries the meaning meanwhile.
- **H5 (wide burner):** the burner is ~1.3× H1's, not 1.5×. Fine for the karahi; noted.
- **H3:** its front strip is deeper than H1's (more empty black under the knobs). Cosmetic.
- **D2 (ladle):** it came standing in a small pot, not alone; cut out along a hand-drawn outline. The handle's top
  edge is slightly soft where it met the pot's rim. A redo of the ladle alone (top-down, on grey) would be cleaner.
- **A1:** Nani's head is tilted ~19° in all three cells (the cut levels half of it), and every head touches the
  top of its cell, so a white sliver of the badge's disc can show at the top of Nani's and Nana's badges.
- **Every sheet:** ChatGPT drew soft drop shadows despite "no shadows". The cut removes them; no redo needed, but the
  next prompts could say it more strongly.

## 7. Tests

- `python3 build/check_vessel_meta.py`: **pass** (§3), after the final merge of `origin/main`.
- `build/test_cook.py --lab --viewport laptop`, split in two with `--stations`:
  the 10 kept stations **PASS** (126 screenshots, 2087 s, under load from the shoot scripts), the 11 parts **PASS**
  (88 screenshots, 1013 s). Re-run of the kept stations after merging `origin/main` and the last two kit edits: **PASS** (109 screenshots, 929 s).
- `build/test_cook.py --days 1 --canvas`: **PASS** on all six viewports (flip5-landscape, laptop, laptop-16x10,
  laptop-1280x800, ipad, ipad-portrait).
- Shared Node tests `node --test build/test_shared_*.mjs`: **113/113 pass** (after the merge too).
- `node build/check_onboard.mjs`: ok.
