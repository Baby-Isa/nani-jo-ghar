# ChatGPT batch 3, dump 2: processing report

**Processed:** 26 Sept 2026. **Source:** 16 PNGs and Claude in Chrome's log in `assets/chat gpt dump for processing 2/`. **Not wired into the game.** Contact sheet: `build/contact-sheets/chatgpt-batch3-dump2.png` (every sprite on black and white at 0.5×, plus the wheat maani and golden samosa they must swap with). Re-run: `sh build/slice_chatgpt_batch3.sh`.

This dump is not the RUN-ME run (`docs/art-run-tonight.md`): the log (`sources/art/chatgpt-batch3/nani-art-report-log.md`) covers the real-life characters Zafar approved and batch 2's sections 1 and 2 (`docs/chatgpt-art-prompts-batch2.md`). None of the cook pack (`-batch3-cook.md`) or batch 3 (`-batch3.md`) prompts are in it.

## 1. Mapping (checked by eye against the log)

| Download | Prompt | Original (`sources/art/chatgpt-batch3/`) | Sprites (`assets/cook/items/`) |
|---|---|---|---|
| 08_55_49 | b2 3.1 Big Ma main sheet | *left for Zafar* | |
| 08_55_55 | Big Ma expressions | *left for Zafar* | |
| 08_56_02 | b2 3.2 Big Ma counter view | *left for Zafar* | |
| 08_56_19 | Nani expressions (face from Mum's photo) | *left for Zafar* | |
| 08_56_49 | Doctor expressions | *left for Zafar* | |
| 08_57_25 | b2 3.2 doctor counter view | *left for Zafar* | |
| 09_03_03 | b2 2.3 tray, grill, potato cube | `sheet-tray-grill-t-v1.png` | `tray-chai-t` `grill-jiko-t` `mishkaki-bataato-raw-t` |
| 09_04_39 | b2 1.5 thali | `vessel-thali-t-v2.png` | `vessel-thali-t` (replaces batch 1's) |
| 09_05_02 | b2 2.1 bajri maani | `sheet-bajr-maani-t-v1.png` | `dough-bajr-ball-t` `maani-bajr-{raw,raw-torn,cooked-half,cooked-puffed,burnt}-t` |
| 09_07_27 | b2 2.2 hob knob and flames | `sheet-hob-parts-t-v1.png` | `hob-knob-{off,on}-t` `flame-ring-{high,low}-t` |
| 09_08_09 | b2 1.2 onion | `sheet-dungri-t-v2.png` | `veg-dungri-whole-t` `veg-dungri-peeled-t` (replace batch 1's) |
| 09_09_50 | b2 2.4 samosa folds | `sheet-samosa-folds-t-v1.png` | `samosa-fold-1-t` `samosa-fold-2-t` `samosa-fried-pale-t` |
| 09_10_15 | b2 2.5 pantry veg (F) | `sheet-veg-whole-f-v1.png` | `veg-{dungri,tameto,lasan,marcha,aadu,bataato}-whole-f` |
| 09_11_37 | b2 2.6 pantry containers (F) | `sheet-pantry-containers-f-v1.png` | `jar-atto-f` `jar-daal-f` `tin-chai-f` `jug-dudh-f` `jar-khun-f` `jar-elchi-f` `jar-loon-f` |
| 09_12_06 | b2 2.7 chaat layers | `sheet-chaat-layers-t-v1.png` | `layer-{channa,bataato-boiled,dai,amli,lili,dungri-chopped,tameto-chopped,marcha-chopped,dhana-chopped,sev}-t` |
| 09_12_28 | batch 1's 2.6 Kasuku main sheet (a new render) | `char-kasuku-v2.png` | not sliced (character sheets never were) |

**Log against picture:** the log's "2.3 pan, grill, butter" is right about the picture: the tray has deep sides and loop handles, and the potato cube looks like butter. The log's Kasuku ("8-pose sheet", save as `char-kasuku-v1.png`) is a fresh render of batch 1's prompt, not the file already in `sources/art/characters/char-kasuku-v1.png` (mean pixel difference 27/255), so it's kept as v2 and v1 (which `build/cut_characters.py` uses) is untouched. The log's doctor main sheet (`char-doctor-v1.png`, "copy in this outputs folder") is not in the dump.

## 2. Decisions

- **Family images left in the dump folder** (6): Big Ma and the doctor are real-likeness characters drawn from the family's private photos (batch 2's section 3, which Zafar runs himself), and the Nani expressions sheet used Mum's photo. Kasuku is not based on a real bird (batch 1's 2.6), so it was filed.
- **Originals** go to `sources/art/chatgpt-batch3/` under their pack "save as" names (renamed with `git mv`), with the log beside them. Batch 1 split them between `sources/art/characters/` and `sources/art/chatgpt/`; this batch keeps its own folder, as asked.
- **Replacements:** the onion and thali sprites overwrite batch 1's in place, as the pack's "slices to" says. All three were on `data/cook.json`'s left-out list pending this redo, so nothing in the game changes.
- **Keys:** as the pack says, except: the front-view onion and garlic are cut *without* `--keep-purple` (this onion is copper-red, far from the key, and `--keep-purple` left magenta in both root tufts); the flame rings are cut with the new `build/cut_glow.py` instead of `--glass` (glass left a grey-tan rim round every tongue and a faint grey haze in the ring's empty centre; the minimal-alpha un-mix keeps the glow's own colour).
- **Sizes** (`build/fit_sprites.py`, one factor per sheet, so each sheet's relative sizes stay): the bajri set is scaled so its raw maani is exactly the wheat raw maani's width (310 px; the ball then matches the wheat ball, 230 against 231); the samosa set so the pale samosa matches the golden one's width. Every other sheet is capped so its longest sprite is at most 512 px (the thali, onions and tray/grill came down; the rest were already under). No WebPs: `build/sprites_webp.py` makes those for wired sprites only.

## 3. QA against each prompt's check

| Prompt | Verdict |
|---|---|
| 1.2 onion | Pass. Whole: papery, copper; peeled: glossy deep purple, not pink. The whole one is more orange than red-onion copper-purple |
| 1.5 thali | Pass. 1.7% oval (batch 1's was 8%), even rim, empty. Its wall is deep for a thali |
| 2.1 bajri maani | Pass, soft. Clearly darker than wheat, circles within 3%, stages right. It's beige-brown rather than the asked grey-olive (the log says "slightly beige") |
| 2.2 hob parts | Pass. Same knob turned a quarter left, no markings; blue flames with warm tips, empty centres |
| 2.3 tray, grill, cube | Grill pass (side handles not asked for, harmless). **Tray: soft fail**, a deep pan with loop handles, not a flat tray with small handles. **Cube: fail**, glossy yellow, reads as butter or cheese |
| 2.4 samosa folds | Pass. Long tail, then short flap; the pale one is cooked and blistered |
| 2.5 pantry veg (F) | Pass. Garlic is not clearly the smallest (as the log says); fine, since code scales by cm |
| 2.6 containers (F) | Pass. No writing, salt and sugar look nothing alike, empty last cell |
| 2.7 chaat layers | Pass, soft. The chopped onion is hot pink, close to the key (kept with `--keep-purple` so it isn't dulled); the sev reads a little like grated cheese |

Cut-outs: clean on black and white. The leftovers are a few dull red-brown hairlines inside the chilli rings and between coriander leaves, and a faint pink on the garlic's root tips. Batch 1 had the same and they don't show at game size.

**Worth regenerating:** the potato cube (or use batch 1's `veg-bataato-cubed-t`), the chai tray (flat, low rim, small handles), and optionally the chopped-onion layer on grey.

## 4. Still missing

- From batch 2's sections 1 and 2: **1.1** worktop golden evening, **1.3** velan, **1.4** chakla.
- From the real-life characters: `char-doctor-v1.png` (the doctor's main sheet: the log says a copy is in its outputs folder, not in this dump). Simba and Zazu aren't done yet.
- The whole RUN-ME run is still to do: cook pack 1.1–1.10, 2.1–2.2 (12) and batch 3's 34 prompts.
