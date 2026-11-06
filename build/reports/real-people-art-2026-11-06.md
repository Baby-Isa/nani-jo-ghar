# Real people vs invented faces: which reads AI-made (overnight, 6 Nov 2026)

Reviewer: Fable (visual), independent. Nothing edited but this file.

**Answer.** Yes: Nani and the doctor read far less AI-made than Nana, Ma, Ali, the boy, Isa and the auntie. The cause is what a photo forces, not the photo itself: life-size eyes, a particular smile, a mole, real glasses, a belt and a watch, where the invented faces are the generator's stock child/grandpa module (one eye, nose and cheek gloss shared by Ali, the boy, Isa and the clinic girl). The girl proves it: in the locked lineup, yet shipped as the stock Pixar child because the prompt asked for "large expressive eyes". The rule is "one level, set by Nani's face; every face specific, drawn beside her", not "real references only".

## Evidence

| Image | Real / invented (run) | Tells seen |
|---|---|---|
| `assets/cook/characters/nani-{neutral,happy,talk}-v3.webp` | Real (s08) | Few. Life-size eyes, closed smile, thin gold frames; states one plate. Drift: mole faint, bracelet drawn as pearls |
| `.../nani-stand-v3-front.webp` | Real (s08) | Rounder, more cartoon face than the counter set; no mole |
| `assets/shared/faces/nani.webp` | Real (s08) | Nearest the photo: mole, asymmetric smile. Skin smoother than the bible wants; rim halo on the glasses |
| `assets/clinic/patients/doctor/v2/doctor-{front,3q-left,wave}-front.webp` | Real (s08) | Few. Side hair, beard, belt, watch; all views agree |
| `.../doctor/v2/faces/laugh.webp`, `assets/shared/faces/doctor.webp` | Real (s08) | A step more cartoon than the body art (bigger eyes): level drift |
| `assets/clinic/patients/girl/girl-stand-front.webp`, `girl-face-{happy,sad}.webp` | Real reference, stock result (s08c) | Eyes twice life size, two catchlights, bow pigtails: the default girl; nothing particular survives |
| `assets/cook/characters/{nana,ma,cousin}-neutral.webp` | Invented (customers sheet, old) | Same-face: one iris size and brow arc on all three; cheek gloss; Ma idealised, symmetric |
| `assets/characters/{nana,ma,ali}/*-feeling-*.png` | Invented (s08b) | Over-rendered eyes, plastic specular (Nana 4% near-white), stock poses; Nana's glasses change shape |
| `assets/clinic/patients/{ali,boy}/*.webp`, `assets/cook/characters/isa-face.webp` | Invented (s08b/c) | One child module: same hair lick, brow, nose, blush; only the shirt differs |
| `assets/clinic/patients/{auntie,old-man}/*-front.webp` | Invented (s08c) | Another level (smaller eyes, squat realism): the bench mixes batches, the chai-shelf fault on faces |
| `assets/characters/shopkeeper/shopkeeper-neutral.png` | Invented (storybook) | Outlines, cel shading: anti-reference, already flagged |

## What it means for the art bible

1. **One level, set by Nani's locked face** (section 1): eyes about 1.2x life, matte skin with one soft highlight, simple mouths. Pipeline templates (a) and (b): replace "large expressive eyes" with "eyes slightly larger than life, as the attached lineup; keep what is particular to this face".
2. **Every recurring character drawn beside Nani in one frame** (section 6): sheet first, Zafar signs it, every pose from the sheet. Invented characters carry a *specificity list* (three to five non-stock features: a nose, a gap tooth, a mole, a real garment) so they cannot fall back to the module.
3. **Judge row 10 gains a level check:** each landed face beside Nani's at equal head height; reject if eye size or skin finish differs from the lineup.
4. No "real references only" rule for faces: invented Kutchi is false, an invented auntie is not. Likenesses stay opt-in with consent, photos private; children only with an explicit yes before a store build.

## Decisions for Zafar

1. Rules 1-3 into the art bible and pipeline. **Yes.**
2. Redo Nana, Ma, Ali, the clinic walk-ons and the girl as one lineup run beside Nani (one paste block, decision 77), poses cut from the sheet. **Yes; this sprint's art run, nothing else redrawn.**
3. Ask the family for photos for Nana, Ma and Masi, as with Mum. **Yes for adults who agree; no new child likenesses yet.**
4. Nani's pearl bracelet and the lost blazer check. **Leave; log on the sheet.**

## Implementation plan

- `docs/design-language/art-bible.md` sections 1 and 6, `art-pipeline.md` templates (a)/(b) and judge row 10. Half an hour; the bible is at 6260 of 6500 words, so cut a line per line added.
- `build/tools/art/lineup.py`: any face beside `assets/shared/faces/nani.webp` at equal head height, plus the near-white share. One to two hours.
- One `/art-run`: the customers and walk-ons sheet with Nani's face attached as the level reference; judged at the sheet, before any pose is cut. An evening of Zafar's.
- Checks: `node build/tools/review/checks.mjs` (docs limits); the lineup sheet in the review report.
- Risk: the pull to the stock child is strong (the girl shows it). Reject at the sheet, never fix a pose.

## Proof

- Read: `CLAUDE.md`; `art-bible.md` sections 1, 2, 6; `art-pipeline.md` lines 69-93, 136-152; `docs/game-design/cast.md`; `art-plans/character-poses.md` (provenance); `build/reports/s17-fonts-review.md`, "Gemini's critique".
- Looked at: the 24 images in the table and `sources/art/s08/lineup-v4-1.png`, on contact sheets at 300 px plus 2-4x face crops.
- Measured: near-white share per cut-out (doctor 3.9%, Nana feelings 4.1%, girl 5.2%, Nani v3 0.02%, Ma 0.01%); the fonts review's quadrant light test, rejected for clothed figures (a red dupatta swings it 50 points).
- `node build/tools/review/docs.mjs`: this file passes; the one FAIL (`regressions.md` names `overnight-2026-11-06.md`, not yet written) predates this work.
- Not done: no in-play render of mixed faces; the level numbers are a proposal, not a built check.
