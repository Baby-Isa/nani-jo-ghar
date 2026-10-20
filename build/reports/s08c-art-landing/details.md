# s08c art landing: the Sprint 8 fix run judged (20 Oct 2026)

**Conclusion: 27 of 28 landed; 21 pass, 3 fail, 3 wait on Zafar's likeness call (the doctor set), 1 never ran.** The dump (`main` commit 075aaec7, "assets/ChatGPT Sprint 8 Image Dump/", 27 PNGs named by ChatGPT's chat titles) was mapped to the run lines by eye against the prompts and copied to `sources/art/s08c/` under the run spec's save-as names. No line has two tries; **AL3 (Ali impatient) is the missing one**. The redo list has four lines (DS1, CP3, CP4, AL3); the plan's prompts carry the fixes and the redo block is regenerated. `artjudge.py`: 14 pass, 10 flag, 3 fail; every flag and fail was looked at, below. Nothing was committed or pushed.

## 1. Every image, flaws first

| ID | Dump file | Save-as | Verdict | Why |
|---|---|---|---|---|
| DS1 | Dal Ingredient Pile Grid | ds1-daal-stirred-in-v1 | **FAIL** | Cell 1's "onion" is yellow cubes, a dead ringer for cell 4's potato; cell 8's mustard seeds are glossy spheres (the beads rule). Cells 2–7 are good. Redo. |
| CP3 | Milk Pans Pouring Tea Sequence | cp3-chai-pan-tip-pour-v1 | **FAIL** | The tilt steps collapse: cell 2 barely differs from 1 and cell 4 from 3, so the "20° each time" reads as two steps. The pour streams are thick syrup, the milky one 1.3% from the bottom edge (artjudge flag). Tipped the right way, handle right. Fallback if Zafar wants no redo: cells 1, 3, 5, 6. Redo. |
| CP4 | Three Pans, Three Stages of Tea | cp4-chai-pan-brewing-v1 | **FAIL** | Cell 1's bubbles are a neat ring of large glossy spheres (a drawn ring; beads under the sweets rule); cell 3's are pea-to-marble size. Cell 2 (tea with leaves) is good. artjudge passed it; this is the eye's call against CK-06. Redo. |
| AL3 | (missing) | al3-ali-impatient-v1 | **MISSING** | Not in the dump; neither boy sheet is the impatient figure. On the redo list as "not run". |
| DW2 | Kindly Dressed Elderly Gentleman (1) | dw2-doctor-3q-left-v1 | **Zafar's likeness call** | True 45° turn left, chest and feet lower left, head with the body, watch on his LEFT wrist, five fingers, mouth closed, same clothes, feet and head at the base's heights. artjudge FAILs skin (ΔE 16.6 from the sheet swatch #C88A6F), but the wired face-on base it was told to copy is itself ΔE 14.5 from that swatch and DW2 is ΔE 4.4 from the base: consistent with the set it stands beside. Overridden to pass on skin; see decision 2. |
| DT2 | Friendly Elderly Gentleman in Navy Blazer (1) | dt2-doctor-3q-left-talk-v1 | **Zafar's likeness call** | A clean edit of DW2 (0.3% changed, leak 0). The mouth is a broad open smile with teeth rather than "a little open", usable as the talk frame. Skin as DW2. |
| DB2 | Serene Elderly Gentleman with Closed Eyes | db2-doctor-3q-left-blink-v1 | **Zafar's likeness call** | A clean edit of DW2: both eyes closed, brows unchanged, nothing else moved. Skin as DW2. |
| GZ1 | Cheerful Girl in Yellow Dress (2) | gz1-girl-face-aah-v1 | PASS + likeness | Head and shoulders, mouth wide "aah" with clean top and bottom teeth and tongue, eyes open, plaits, bows, yellow dress, soft clinic behind. Skin ΔE 6.5 lighter than the sheet's face (12.1 from the swatch): colour-correct in the cut. The green cross on the wall poster is the wired background's own. |
| GZ2 | Cheerful Girl with Braided Pigtails | gz2-girl-face-eyes-v1 | PASS with a flaw + likeness | Brows, forehead, fringe and hairline in view; the two eyes 39% of the width; calm small smile. **The crown is cropped** (the prompt asked for "just above the top of her head"). Skin ΔE 8.7 from the sheet's face: colour-correct. Decision 3. |
| GZ3 | Sweet Girl with One Watery Eye | gz3-girl-face-eye-sore-v1 | PASS | Her left eye (viewer's right) pink-rimmed and watery, fully open, no wink; clean edit (leak 0). |
| GZ4 | Serene Braided Girl in Cozy Room | gz4-girl-face-eyes-closed-v1 | PASS | Both eyes gently closed, lashes resting, brows unchanged; clean edit (3.6% changed, leak 0). |
| KD1 | Twin Stainless Steel Ladles with Creamy Dal | kd1-kadchi-v1 | PASS | Deep round bowl, the handle foreshortened, rising and leaning right with a hanging hole; right cell full of daal; flat grey. The bowl's wall is a touch straight (a hint of measuring cup from above). Wire only on Zafar's yes (plan decision 2). |
| TP1 | Three Spoons: Empty, Sugar, and Chai | tp1-teaspoon-v1 | PASS | Same spoon three times, bowl left, handle right, level: empty, sugar heap, milky chai. artjudge's "edge not crisp 11%" is the grey steel keying against the grey, not a shadow. |
| GL1 | Three Glasses of Tea Tasting | gl1-chai-glasses-top-v1 | PASS | Exactly above: round rims, even walls, centred floors; empty, milky chai with a skin, clear amber black tea. Faceted glass, consistent across the three. Keying flag (4.7%) is the clear glass. |
| SK4 | Brushed Metal Tray with Four Wooden Skewers | sk4-sekelo-tray-upright-v1 | PASS | One square tray, brushing top to bottom, upper part of the image; four skewers at 1/5–4/5 of its width (measured), tips at the top wall, wooden handles past the bottom edge onto the grey; no food. Tray is 80% wide, not 70%. The 23.6% edge flag is grey steel against grey: cut by rectangle, not key. |
| SK5 | Grilled Kebab Ingredient Grid | sk5-sekelo-decoys-v1 | PASS | Three rows (chicken, chilli tube, corn slice) × heap, raw, grilled, charred; nothing crosses a cell. artjudge's sweets flag is the raw corn slice; it reads as corn, kernels matte enough. Heaps are drawn slightly three-quarter. |
| WT1 | Pale Cream Marble with Golden Veins | wt1-marble-tile-v1 | PASS | Even light (corners 222–223 vs centre 222 of 255), no streaks, vignette or objects. Wrap seam 4–5 levels against a 1.2 typical neighbour difference: the cross-fade in the cut covers it. Veins a little finer than the hob worktop's. |
| CR1 | Twin Wooden Underarm Crutches on Gray | cr1-crutches-flat-v1 | PASS | Lying flat, pads left, feet right, every part down, 80% wide, no surface or shadow. Drawn from nearly straight above, which is how the belt's spoon and bud are seen. Grey pads key softly (10.6%): cut by rectangle. |
| TC1 | Brushed Stainless Steel Tumbler | tc1-steel-cup-v1 | PASS | Upright, level, from the front and a little above, inside and floor showing, no shadow, 55% wide. |
| NN1 | Elderly Man Character Reference Sheet | nn1-nana-talk-v1 | PASS | Only the top-right face changed (mouth open, teeth): 0.03% of the sheet, leak outside the face panel 0. |
| NN2 | Elderly Gentleman's Character Reference Sheet | nn2-nana-blink-v1 | PASS | Only the top-right face changed (eyes closed): leak 0. |
| MA1 | Traditional Girl Character Turnaround Sheet | ma1-ma-talk-v1 | PASS | Mouth open, teeth; leak 0. The file is 1535 px wide: pad one column in the cut. |
| MA2 | South Asian Character Turnaround Sheet | ma2-ma-blink-v1 | PASS | Eyes closed; leak 0. |
| AL1 | Animated Boy Character Turnaround Sheet | al1-ali-talk-v1 | PASS | Mouth open, teeth; leak 0. |
| AL2 | Young Boy Character Turnaround Sheet | al2-ali-blink-v1 | PASS | Eyes closed; leak 0. |
| WR1 | Seated Pink Hijab Cartoon Woman | wr1-auntie-seated-v1 | PASS | Seated front-on, hands on knees, feet flat, pink dupatta, orange kurta, maroon salwar, sandals; the old man's proportions and finish. 91% of the height, not 80%. |
| WR2 | Friendly Man in Teal Kurta | wr2-uncle-seated-v1 | PASS | Teal kurta, moustache, khaki trousers, brown sandals; same style. 92% tall. |
| WR3 | Smiling Mother and Baby in Green | wr3-mother-baby-seated-v1 | PASS | Green headscarf, kurta and trousers, baby in a yellow top held with both arms; same style. 90% tall. |

No text, logos, religious markers, sweets as rewards or immodest clothing anywhere. The family edits (NN, MA, AL) were diffed against their sheets by hand because artjudge only resolves `kept:` bases; all six are real edits with nothing moved outside the face panel.

## 2. Cut notes for the passes (`s08c.cut.json`, to write)

- **KD1:** grid 2×1, steel `tol` 5, `hole_min` 8; left = ladle (handle stub outward, turned by code, decision 94), right = stir frame. Only on Zafar's yes.
- **TP1:** grid 3×1, `tol` 4–5 (grey steel): `teaspoon-empty`, `-sugar`, `-chai`; cell 3 is the stir, cell 2 the scoop.
- **GL1:** grid 3×1, `glass` + `soft_floor`: `glass-empty-top`, `glass-chai-top`, `glass-black-top`, replacing the chai-v2 three.
- **SK4:** one cell, `rect` crop (grey on grey keys badly), `x2`; `tray-4`; `tray-0..3` by painting the skewers out from the right; re-measure the four skewer lines into `meta.json` (`build/measure_sekelo_v3.py`).
- **SK5:** grid 4×3 → `chicken-{heap,raw,grilled,charred}`, `chilli-*`, `corn-*` as `v3/sekelo` names them; add to `decoyPool`.
- **WT1:** `rect` + `tile` (`tile_ov` 96, lossless), then `upscale.py` ×2 → `bg-cook-worktop-tile-v1.webp`; hob cut from `bg-cook-hob-t-v1.png` ×2; `fitBg` tiles at its own size; rerun contract-11.
- **CR1:** one cell, `rect`, replaces `crutches-flat-belt`. **TC1:** one cell, `tol` 5, no shadow to drop; re-measure the rim and inside for `taste.json`.
- **DW2/DT2/DB2** (after Zafar): the 3q-left set, DT2/DB2 registered on DW2 by `expressions.py`'s paste-back; skin per decision 2.
- **GZ1–GZ4:** whole frame, no key; colour-correct the skin toward the sheet's face (GZ1 ΔE 6.5, GZ2–4 ΔE 8.7–9); GZ3/GZ4 registered on GZ2 (leak 0, no shift).
- **NN/MA/AL:** `cut_characters.py`'s boxes, paste back only the changed face pixels; MA1 padded to 1536.
- **WR1–3:** like `old-man-front` in `s07.cut.json`; scale to the old man's height (these are 90% tall, he is 80%); colour variants recoloured in code.

## 3. Rows each pass unblocks

TP1 → CHAI-13. GL1 → CHAI-08. SK4 → SEK-14, SEK-20. SK5 → contract-37. WT1 → contract-11, ART-05, SH-91. CR1 → CLN-23. TC1 → CLN-196 (and ART-20's cup row). NN1/NN2, MA1/MA2, AL1/AL2 → ART-19 (Nana, Ma, Ali). WR1–3 → ART-23. KD1 → DAAR-02 on his yes. After his likeness call: DW2 set → CLN-17; GZ1–4 → CLN-163, CLN-185. Still waiting on the redo: DAAR-05 (DS1), CHAI-26 (CP3), CK-06 (CP4), ART-10 (AL3).

## 4. Decisions for Zafar

1. **The redo (4 images, about 15 min):** DS1, CP3, CP4 with the amended prompts, AL3 as it is. Recommend yes. Fallback for CP3 if he'd rather not: cells 1, 3, 5, 6 as 0°, 40°, pour, black-tea pour.
2. **The doctor's skin:** the s08 face-on set in play is ΔE 14.5 lighter than his sheet's swatch; DW2 matches that set, not the sheet. Either accept the lighter tone (nothing to do) or shift the whole doctor set toward the sheet in the cut, one correction for every frame. Recommend the cut-time shift, after his likeness call on DW2.
3. **GZ2's cropped crown:** keep (the eye game needs brows and eyes, both in view) or redo GZ2 with GZ3 and GZ4 following (3 images). Recommend keep.
4. **Likeness:** DW2/DT2/DB2 and GZ1–GZ4 (`sources/art/s08c/dw2-*`, `dt2-*`, `db2-*`, `gz1-*` to `gz4-*`).

## 5. The redo (20 Oct, pasted by Zafar in chat)

| ID | save-as | verdict | why |
|---|---|---|---|
| DS1 | ds1-daal-stirred-in-v2 | PASS | onion now thin translucent slivers (not the potato's cubes); matte pinhead mustard seeds, not beads; all eight cells distinct |
| CP4 | cp4-chai-pan-brewing-v2 | PASS | small scattered bubbles on the water, leaves in amber tea, a natural foam edge on the milky chai (no glossy ring of spheres) |
| CP3 | cp3-chai-pan-tip-pour-v2 | PASS for the tilt (cells 1-4), FAIL for the stream | the four rims are now four flatter ellipses; but the streams in 5-6 still read as glossy syrup and the pans cast shadows on the grey: use cells 1-4 for the tip and draw the stream with js/shared/pour.js (thin, translucent tea) |
| AL3 | al3-ali-impatient-v1 | PASS | an edit of his impatient sheet: arms crossed, frowning pout, eyes turned away, foot tapping; impatient, not smug; same clothes and face as his sheet |
