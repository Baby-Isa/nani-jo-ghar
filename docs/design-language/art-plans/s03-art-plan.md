# Sprint 3 art: the redo list, the art rows, the girl's states (pack `s03`)

**Written:** 8 Oct 2026, by S03-D (`build/tools/ops/specs/s03d-art.brief.txt`). **Status:** approved by Zafar in the session launch (decision 71: image API, Fable reviewing; spend cap $60).
**Built from:** `CLAUDE.md` (13, 16), `docs/process/rules.md` §7, `art-bible.md` §1–4 and §8, `art-pipeline.md` §1, `s02-art-plan.md` (the prompts these redo), `s02-redo-list.yaml`, the open Art rows and the art-waiting Cook and clinic rows.

## 1. How the run works
- **Generator:** `build/gen_s03.py` calls the OpenAI image API (`gpt-image-2`, quality high, `/images/edits`) with the style anchor `sources/art/style-anchor-v1.png` and the approved art each image must match attached. The girl's states are **masked edits of her approved seated picture** (`girl-w1-front-neutral-v1.png`): only the face is redrawn, so every state is the same body (CLN-65).
- **Judging:** `build/tools/art/artjudge.py` first, then Fable (an Agent subagent, model `fable`) sees each image with its plan line and the art bible: pass, or fail with an amended prompt; at most 4 tries. An image that never passes keeps the old art and is listed with Fable's last verdict.
- **Output:** `sources/art/s03/<id>-v<try>.png`; prompts and verdicts in `sources/art/s03/run-log.json`; spend in `sources/art/s03/cost.json`. Cut by `build/tools/art/artcut.py build/tools/art/specs/s03.cut.json`.
- **Grounds:** flat mid-grey `#808080`, no shadows (art-pipeline §1); light from the upper left; no text; halal; modest; no sweets.

## 2. The images

| ID | Image | Fixes | Camera, size | References attached | Where it goes |
|---|---|---|---|---|---|
| **S1** | The sekelo served dish: an oval steel plate with two straight parallel skewers of meat, onion and tomato only (no green pepper) | redo **B1** (s02 cell 7); CK-21 | Front and a little above (the counter's angle, as B1), 1024² | anchor, `s02/b1-served-dishes-v1.png` (the other seven dishes' angle and light), `s02/c7-sekelo-plate-plain-t-v1.png` (the plate) | `assets/cook/items/served/sekelo.webp`; `data/cook.json` art.s02 served-dishes `sekelo` |
| **S2** | The daar bowl alone, top-down: the same steel bowl full of smooth matte yellow daar, a few lentil grains, no beads, no gloss | redo **C10**; DAAR-10 | T, 1024² | anchor, `s02/c10-daar-bowl-trivet-t-v1.png` (bowl and trivet), `assets/cook/items/v3/daar/pot-daar.webp` (the daar's look in the pot) | `v3/daar/daar-bowl-plain-t.webp` (radius about 0.8 of the trivet's); art.s02 `daar-bowl` ready true |
| **S3** | The six two-colour plasters, split **lengthwise** (top half one colour, bottom half the other, the pad in both), 3×2 | redo **E2**; CLN-97 | T, 1536×1024 | anchor, `s02/e2-plasters-flat-v1.png` (shape, size, colours) | `assets/clinic/sheets/plaster-flat/plaster-flat-<a>-<b>.webp`; `data/clinic/sheets.json` remap |
| **S4** | A real *kadchi*: a steel serving ladle, a deep round bowl and a long flat handle, top-down, the handle rising toward us out of the pot | **DAAR-02** | T (handle foreshortened), 1024² | anchor, `assets/cook/items/v3/daar/ladle-v2.webp` (the steel; the dipper is the fault), `v3/daar/pot-daar.webp` (the pot it stirs) | `v3/daar/ladle-v3.webp`; `js/cook/stations/daar.js` LADLE (file, bowl centre, radius, handle angle) |
| **S5** | Potato chunks: raw (pale cream flesh with a strip of thin brown skin on one face, starchy matte), grilled, charred, and a heap of raw cubes, 4×1 | **ART-11** (not butter) | T, 1536×1024 | anchor, `cook-v3/k4-pieces-v1.png` (the other pieces' size and style), `v3/sekelo/potato-raw.webp` (the fault) | `v3/sekelo/potato-{raw,grilled,charred}.webp`, `heap-potato.webp` (same canvases, 404×396 and 374×368) |
| **G1** | The girl, hot: flushed cheeks, one bead of sweat at the temple, tired droopy eyes, mouth a little open; **not crying, no tears** | **CLN-65**, FV10 ("the crying emoji is not the one") | Masked face edit of W1, 1024×1536 | W1 (the edited image), `s1-girl-sheet-v2.png` | `assets/clinic/patients/girl/girl-face-hot.webp`, `girl-head-hot.webp` |
| **G2** | The girl, cold: shivering, pale lips with a hint of blue, eyes squeezed a little, teeth chattering | **CLN-65** | as G1 | as G1 | `girl-face-cold`, `girl-head-cold` |
| **G3** | The girl, sore: a wince, one eye half shut, brows up, lips pressed | **CLN-65** | as G1 | as G1 | `girl-face-pain`, `girl-head-pain` |
| **G4** | The girl, happy: a big open smile, bright eyes | **CLN-65**, CLN-98 | as G1 | as G1 | `girl-face-happy`, `girl-head-happy` |

**Re-cuts, no new image:** **ART-16** (the review tick's grey fringe: re-cut from its source, colour-to-alpha). **Not art:** MAA-09 (the dough piles' shadow is code-drawn, `maani-line.js`: Session B). **ART-05:** every live background is at its source's full resolution (1536-wide sources at 1600×900; the kitchen `service-v2` from the s02 A1); an @2x needs an upscale the generator can't do without moving things, so it stays listed, not run. **Send-off standing:** W12 (wave) is wired (`sendoff.js` waveOn); no pose is missing. **No other characters** (decision 71).

## 3. Estimate (before any spend)
- 9 images, at most 4 tries each: expected about 1.8 tries each, **about 16 calls**; worst case 36.
- Per call (gpt-image-2 high, priced conservatively at gpt-image-1's rates: $40 per million output tokens, $10 per million image input tokens): a 1024² or 1024×1536 image about $0.25–0.30 with its references, a 1536×1024 sheet about $0.30–0.35.
- **Expected about $5; worst case about $12.** Cap $60. The real price is read from the API's usage after the first call and the estimate corrected in the report.

## 4. Judging lines (Fable sees these with each image)
- S1: the plate oval and plain; two straight parallel skewers; only meat, onion, tomato, no green anywhere on the skewers; angle and light as B1's other dishes; no shadow.
- S2: perfect circle (top-down); daar smooth, matte, soft, a few grains; nothing reads as beads, balls or sweets; the same steel bowl.
- S3: six plasters, same shape and size as E2's; each split along the long axis (a line running end to end), both halves in the pad; correct colour pairs in order: red-yellow, red-blue, red-green, yellow-blue, yellow-green, blue-green.
- S4: reads as a kadchi (a serving ladle), not a measuring cup or dipper; deep round bowl seen from above; long flat handle; whole ladle inside the frame.
- S5: potato, never butter or cheese: pale cream starchy flesh, thin brown skin visible; grill marks on grilled, dark char on charred; the heap is the same cubes.
- G1–G4: the same girl, same body, hair and clothes untouched; the feeling reads at 90 px; nothing gross; no tears for hot; modest; skin warm light tan.
