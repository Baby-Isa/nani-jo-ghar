# ChatGPT batch 3, dump 3: processing report

**Processed:** 26 Sept 2026. **Source:** `assets/chat gpt dump for processing 3/`: 69 PNGs, **48 unique**. The other 21 were byte-identical copies (md5), and those were deleted. There was no run log (it stayed on Zafar's machine), so every image was matched to its prompt by eye. **Nothing is wired into game code.** Re-run: `sh build/slice_chatgpt_batch3_dump3.sh`.

**Contact sheets** (every final sprite on black and white, with its file name): `build/contact-sheets/chatgpt-batch3-dump3-{cook,family,animals,clinic,backgrounds}.png`.

**Totals:** 94 sprites and 6 backgrounds. No family or private-photo images were in the dump: Big Ma, the doctor and photo-based Nani are all absent. So nothing was left for Zafar, and the dump folder is gone.

## 1. Mapping

Every original was renamed with `git mv` into `sources/art/chatgpt-batch3/`.

| Download | Prompt | Original | Out |
|---|---|---|---|
| 10_40_53 | b3 5.2 exam room | `bg-clinic-room-e-v1.png` | `assets/clinic/rooms/` png+webp |
| 10_42_12 | b2 2.3 tray, grill, cube (2nd render) | `sheet-tray-grill-t-v2.png` | not cut: same deep pan and butter cube |
| 10_45_18 (+1 dup) | cook 2.1 chai glass | `vessel-glass-chai-top-t-v1.png` | `assets/cook/items/vessel-glass-chai-top-t` (glass) |
| 10_45_22 (+1) | cook 2.2 skewer rack | `vessel-skewer-rack-t-v1.png` | `vessel-skewer-rack-t` |
| 10_49_42 | cook 1.5 Nana happy | `char-nana-counter-happy-v1.png` | `assets/cook/characters/next/nana-happy.webp` |
| 10_51_36 (+1) | cook 1.6 Ma happy | `char-ma-counter-happy-v1.png` | `next/ma-happy.webp` |
| 11_48_07 | cook 1.7 Ali happy | `char-ali-counter-happy-v1.png` | `next/cousin-happy.webp` |
| 10_56_07 (+1) | cook 1.8 Nana tsk | `char-nana-impatient-v2.png` | `next/nana-impatient.webp` |
| 11_02_13 (+1) | cook 1.9 Ma tsk | `char-ma-impatient-v2.png` | `next/ma-impatient.webp` |
| 10_57_35 | cook 1.10 Ali tsk | `char-ali-impatient-v2.png` | `next/cousin-impatient.webp` |
| 11_49_16 | b2 1.1 worktop evening | `bg-cook-worktop-t-evening-v1.png` | `assets/cook/bg/` png+webp |
| 11_03_58 | b2 1.2 onion (2nd render) | `sheet-dungri-t-v3.png` | not cut |
| 11_04_38 (+2) | b2 1.3 velan | `tool-velan-t-v2.png` | `tool-velan-t` (replaces batch 1's) |
| 11_05_30 | b2 1.4 chakla | `tool-chakla-t-v2.png` | `tool-chakla-t` (replaces batch 1's) |
| 11_06_28 / 11_08_34 / 11_09_31 / 11_10_32 | b2 2.1 / 2.4 / 2.5 / 2.6 (2nd renders) | `sheet-bajr-maani-t-v2`, `sheet-samosa-folds-t-v2`, `sheet-veg-whole-f-v2`, `sheet-pantry-containers-f-v2` | not cut |
| 11_51_19 | b2 2.3 chai tray regenerate | `tray-chai-t-v2.png` | `tray-chai-t` (replaces dump 2's) |
| 11_14_48 / 11_16_03 / 11_17_54 | b3 1.2 / 1.3 / 1.4 feelings | `char-{nana,ma,ali}-feelings-v1.png` | `assets/characters/<who>/<who>-feeling-*` (12 each) |
| 11_23_46 | b3 2.1 guests line-up | `char-guests-lineup-v1.png` | filed |
| 11_19_08…28 (+2 each) | b3 2.2–2.6 guest sheets | `char-older-cousin-v1`, `char-guest-aunt-teal-v1`, `-aunt-pink-v1`, `-uncle-kofia-v1`, `-uncle-glasses-v1` | filed (waiting for approval) |
| 11_25_29 (+2) | b3 3.1 courtyard | `bg-courtyard-e-v1.png` | `assets/backgrounds/` png+webp |
| 11_27_02 (+2) | b3 3.2 sitting room | `bg-sitting-room-e-v1.png` | `assets/backgrounds/` png+webp |
| 11_28_15 / 11_29_27 / 11_29_32 | b3 4.1 / 4.2 / 4.3 goat, hen, chick | `char-{goat,hen,chick}-v1.png` | `assets/characters/<animal>/` (9 poses each) |
| 11_30_44 / 11_31_57 | b3 5.1 / 5.3 waiting room, pharmacy | `bg-clinic-{waiting,pharmacy}-e-v1.png` | `assets/clinic/rooms/` |
| 11_35_27 | b3 6.1 clinic line-up | `char-clinic-lineup-v1.png` | filed |
| 11_33_18…35 | b3 6.2–6.6 patient sheets | `char-clinic-{girl,boy,oldman,oldwoman,dad-baby}-v1.png` | filed (waiting for approval) |
| 11_43_17 / 11_45_41 | b3 6.7 / 6.8 colours | `char-clinic-{oldman,oldwoman}-colours-v1.png` | `assets/clinic/patients/old-{man,woman}/` (4 each) |
| 11_37_07 / 11_38_20 / 11_40_34 | b3 7.2 / 7.3 / 7.4 hurts | `char-{nana,ma,ali}-hurts-v1.png` | `assets/clinic/patients/<who>/<who>-sit*` (4 each) |
| 11_44_31 | b3 8.2 sitting room night | `bg-sitting-room-e-night-v1.png` | not placed: redrawn, not relit |
| 11_46_57 | b3 8.3 courtyard evening | `bg-courtyard-e-evening-v1.png` | not placed: redrawn, not relit |

The two duplicates of the sitting room (11_41_42, 11_44_27) and of the courtyard (11_46_52) are where 8.1 and the relights were saved. Most likely the attached day image was downloaded instead of the new one.

## 2. Decisions

- **Counter moods go to `assets/cook/characters/next/`.** They don't overwrite the live files, because the game loads those today. `build/cut_counter_moods.py` cuts them with `cut_characters.py`'s own boxes, eyes and frames. Before cutting, the edits were checked against their originals: the heads and counters are within 3 px, and Ma's tilted head is within 9 px. The raised hands of Ma and Ali stuck out of today's canvas, so their happy frames are wider, and the body stays centred. To swap them in, move the files up a folder.
- **Alternate takes are filed but not cut.** Dump 2's cuts are as good or better:
  - onion v3: side-on, and the peeled onion is magenta-pink;
  - bajri v2: the same beige;
  - samosa v2: the pale samosa is nearly golden;
  - veg and containers v2: near-identical.
- **Sizes** use `build/fit_sprites.py`, one factor per sheet, with the longest side at most 512, as in dump 2. Feelings and animal poses were already under 512.
- **Animals** were cut by hand-set boxes with the new `build/cut_boxes.py`. It uses `slice_sheet.py`'s key and clears anything that crosses into a box from a neighbour. The chick's down left grey wisps, so the chick is cut with the new opt-in `slice_sheet.py --fluffy` (an 8 px soft-edge band). Earlier batches don't use it and are unchanged. Swatches and the hen-and-chick size panel stay on their sheets.
- **Backgrounds** are native 1536×1024 PNGs plus q90 WebPs, as in batch 1. The 16:9 crops and occluder cut-outs wait for each scene's wiring.
- **Clinic manifest.** A new top-level `final` block was added to `data/clinic/rough-art.json`, plus 59 `sprites` entries, all with `final: true`. The block has:
  - `rooms`;
  - `patients` (sit poses, and waist-up colour crops);
  - `feelings`;
  - `replaces`, which maps rough ids to final ones.

  Every rough entry, and `rooms`/`patients`/`alias`, is untouched, so the clinic still shows the rough art until code opts in. `sources/art/clinic-rough/slice_sheets.py` rewrites the manifest from scratch, so re-run `build/clinic_final_art.py` after it.

## 3. QA

| Prompt | Verdict |
|---|---|
| cook 1.5–1.10 | Pass. Clearly happy and mid-word, one hand up. The tsk faces read as impatient and stay friendly |
| cook 2.1 glass | Soft pass. The rim is an ellipse and the inside wall shows, but the camera is gentler than the pan/pot view |
| cook 2.2 rack | Pass. Plain rails, no notches, the gap keys out |
| b2 1.1 worktop evening | Pass. `bg_align_check`: 0 px shift, 1 px worst tile, 91% of edges kept |
| b2 1.3 velan / 1.4 chakla | Pass. The chakla is a true circle; its rim is a little thicker to the lower right |
| chai tray regenerate | Pass, soft. Flat, low even rim, 2% oval, but no handles |
| b3 1.2–1.4 feelings | Pass. All 12 are in order and gentle; no grid lines on Ali's |
| b3 2.1–2.6 | Pass, except the cousin: he has **no separate cap-less head panel** (his waist-up is cap-less instead) |
| b3 3.1 courtyard | Pass. No sky, and every anchor is there |
| b3 3.2 sitting room | **Fail on layout.** The sofa back's top is at about 46% down, not 60% (`sofa.json` expects 62% of the stage). Otherwise clean |
| b3 4.1 goat | Pass, soft. Brown hock markings on a "no patches" goat |
| b3 4.2 / 4.3 hen, chick | Pass |
| b3 5.1 waiting / 5.3 pharmacy | Soft. The rail is at about 52% and the belt at about 54% (62% asked). Everything else is right: no signs or crosses, and the belt is empty with hatches at both ends |
| b3 5.2 exam room | Pass. The bench top is at about 60% |
| b3 6.1–6.8 | Pass. The garments are plain colours, the old woman's hair is covered, no stick when seated, and the colours are in order |
| b3 7.2–7.4 | Pass. The hands are on the viewer's-left knee and the head |
| b3 8.2 / 8.3 | **Fail.** Redrawn: the night room drifts up to 35 px and keeps 52% of its edges; the courtyard shifts 54/74 px and keeps 27% |

The cut-outs are clean on black and white.

## 4. Regenerate

1. **8.1, 8.2, 8.3 relights.** 8.1 was never saved, and 8.2 and 8.3 moved. For the sitting room, regenerate 3.2 first and relight the new day image.
2. **3.2 sitting room**: the sofa is too high for `sofa.json`.
3. **Potato cube** (b2 2.3): still butter. Or use batch 1's `veg-bataato-cubed-t`.
4. Optional:
   - 5.1 and 5.3, to put the rail and belt at 62%, or move the clinic layout instead;
   - 2.2, for the cousin's cap-less head;
   - the goat without leg markings.

## 5. Still missing

- **Cook pack 1.1–1.4:** Nani happy, talk, point and blink.
- **Batch 3:**
  - 1.1 Nani feelings (Mum's photo);
  - 1.5 Isa feelings;
  - 7.1 Nani "where it hurts" (Mum's photo);
  - 8.1 sitting room evening.
- From batch 2 tonight, 1.5, 2.2 and 2.7 weren't re-run, but dump 2 already covers them.
