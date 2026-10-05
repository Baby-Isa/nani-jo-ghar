> **Harvest notes from step 1a (30 Sept).** Paths in the tables are the OLD names (before the move); `moves.json` in this folder maps each to its new place.

# Step 1a, batch C: art, language, Cook docs, technical

Read-only pass. Repo paths are relative to `/home/user/nani-jo-ghar`. 35 files. All of `docs/process/rules.md` read first.

How deep I read: Art Bible, Asset Building Plan, Asset Naming Convention, Chapter 1 Art Prompts, art-direction-options, art-run-tonight, grammar notes, cook-with-nani-words, cook-with-nani-kutchi-audit, cook-word-changes-B, cook-with-nani-todo, Technical Plan, clinic-heal-api and speech-recognition-plan: read in full. Skimmed: the 10 `chatgpt-art-prompts*.md` (headers, run instructions, rules, notes sections, not each prompt), the five Questions for Mum files (headings, how-to-answer block, where answers are recorded), cook-with-nani-phase-a-design (read §1–§14 and Q3–Q9 selectively, not every line), cook-with-nani-recipes-guide (first 60 lines plus §5–§9), shared-api.md (headings plus §3, §6, §7, §11, §15, §16).

## 1. Mapping table

| path | lines | verdict | target | reason (one line) | harvest note |
|---|---|---|---|---|---|
| `docs/Nani jo Ghar — Art Bible.md` | 459 | KEEP | `docs/design-language/art-bible.md` | The single source of truth for visual style; most of it is live. | Split on the way in: §1–§4, §6–§8 and "cultural accuracy" stay in art-bible.md; §5 Export/cut, §9 prompt templates and the §10 QA checklist go to art-pipeline.md (see 1b). Annotate the stale points in §6. |
| `docs/Nani jo Ghar — Asset Building Plan.md` | 240 | MERGE | `art-bible.md` (§4 motion, §6 set dressing), `art-pipeline.md` (§1 hands), `game-design/cast.md` (§3 cats, §7 Big Ma's room) | Plan is half-done; hands run is finished and hands are out of Cook; cats, set dressing, ambient motion and Big Ma's room are still live design. | Hands list A–F (56 masters, 47 pass, 9 fail), how reskins are done in code, $31.70 cost history → art-pipeline "Hands (parked)". Ambient-motion table and East African / Kutch object lists → art-bible. Cat roles-by-mode table and Big Ma's room (sewing corner, sings while she sews, recorded by Zafar's wife, replaces the tailor's shop in "The spill") → cast.md / story-and-arcs. |
| `docs/Nani jo Ghar — Asset Naming Convention.md` | 86 | MERGE | `art-pipeline.md` (naming + slicing) | Short; source-sheet and sliced-file patterns are still the naming scheme, but the slicing method is for the old magenta cel-shaded sheets. | Keep the three source-sheet patterns, `items/<category>/<id>.png` (ids fru-01…), character state names, `assets/props/<slug>.png`, and the slicing method as "legacy magenta method". Reconcile with current names (`sources/art/<pack>/`, `shelf-<id>-f.webp`, `icon-<id>.webp`). |
| `docs/Nani jo Ghar — Chapter 1 Art Prompts.md` | 136 | ARCHIVE | `docs/archive/` | Prompts use the retired storybook style line and the old Chapter 1 layout contract v2. Checked: the style line is superseded by the Art Bible; nothing else live. | Only the Eid decorations story mapping (lantern → errand 1 intro, bunting after errand 1, fairy lights after errand 2, crescent and star at end, dates Chapter 2, prayer mat held for Eid morning) → `story-and-arcs.md` if Eid stays a later arc. |
| `docs/art-direction-options.md` | 225 | MERGE | `decisions.md`, `ideas.md` | The exploration that led to the 3D look; decision record plus a few loose ideas. | 2026-09-23 decision record (3D film look, modern home with Kutch accents) → decisions.md. "Juice" list (squash and stretch on taps, springy landings, celebration with marigold petals or bandhani dots, soft tactile UI sounds) → ideas.md / audio.md. Lesson "don't attach the old art for style; one style per image" → art how-to. |
| `docs/art-run-tonight.md` | 91 | MERGE | `docs/process/art-how-to.md` | The runner prompt and per-prompt rules are the ChatGPT-via-Chrome method; the zip/Downloads delivery is superseded by direct GitHub upload. | Per-prompt rules (fresh chat, attach exactly the attach line, compare edits with the original, one redo only, download button never a screenshot, log line format, image-limit waits, "don't change anything") → art-how-to. Drop zip delivery. One-off 58-image run list → archive. |
| `docs/chatgpt-art-prompts.md` (batch 1) | 715 | MERGE | `art-pipeline.md` | Holds the style-anchor prompt, the §0 tips and the character-sheet prompt pattern that later packs depend on. | Style-anchor prompt (§1), §0 tips, character-sheet structure (§2), magenta-grid sheet pattern (§3), background and relight prompts (§4.6) → art-pipeline as reusable templates. Rest of the individual prompts archived. |
| `docs/chatgpt-art-prompts-batch2.md` | 493 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (redos + new Cook sheets). Checked: §0.1 colour-ground rules and §3 real-life character notes are all in the Art Bible. | Rule "food on magenta `#FF00FF`; steel, glass, wood, tools on grey `#808080`" → art-pipeline. |
| `docs/chatgpt-art-prompts-batch3-cook.md` | 309 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (cook character moods as edits). Checked: §0.1 edit rules. | "Edit of an approved image": attach only that image, no style anchor, always the approved original, fresh chat, reject if identical or if head/hands/counter edge moved → art-how-to. |
| `docs/chatgpt-art-prompts-batch3.md` | 924 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (34 images: family feelings, guests, courtyard, sitting room, clinic rooms and patients, relights). Checked §0, §9 and §10. | §0.1 "sheets on flat `#808080`, no floor, no shadows, so they cut straight out"; line-up then one sheet each in the same chat; relights last and only if the day image passed, must differ from day with nothing moved → art-pipeline. §9 "not in this batch" list → status.md art backlog. |
| `docs/chatgpt-art-prompts-chai-station.md` | 71 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (chai liquids, pour streams, glass fills). Checked header and rules. | Registration rule (one object in several states = same size and position in every cell) → art-pipeline. |
| `docs/chatgpt-art-prompts-clinic-v1.md` | 217 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (clinic backgrounds, three rounds). Checked Zafar's round 2 and 3 notes. | Notes already in rules.md H35 (bench of six, exam room with clear wall for the real certificate and toys, pharmacy straight on); "front door approved as is" → clinic mode doc. |
| `docs/chatgpt-art-prompts-cook-v3.md` | 406 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (28 Cook v3 prompts from the 29 Sept play-test). Checked the "built to Zafar's answers" header. | Answers (faces in three expressions, chaat fully side-on, samosa fillings as top-down heaps with no bowls, flat wooden turner, chai and daar keep side-on jars) are in rules.md H14, H19, H21. none missing. |
| `docs/chatgpt-art-prompts-overnight-2026-09-30.md` | 207 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (Cook redos + clinic items). Its paste block is the current runner template. | Copy its paste block (read the pack from GitHub, download references, redo at most twice, upload to `sources/art/<pack>/` on main, report pass/fail) into art-how-to as the template. Open: samosa redos and clinic people wait on other work. |
| `docs/chatgpt-art-prompts-pantry-jars.md` | 438 | MERGE | `art-pipeline.md` (cut + label + registration), `architecture/` (pantry wiring) | The "For Claude" section holds the real cutting and labelling method and the pantry wiring notes; prompts themselves are finished. | Cutting method (measure background from edge, find cells from gutters, largest piece, colour-to-alpha, clear glass), registered canvases 256×384 / 256×256, relative container heights, label rules; pantry slot counts (15 shelf, 6 fridge, tray of 6). Status notes are dated log → archive. |
| `docs/chatgpt-art-prompts-results-badges.md` | 79 | ARCHIVE | `docs/archive/art-prompts/` | One-off run (stopwatch, tick, bulb, caption icons). Checked: spec is in rules.md F13. | Sheet spec (identical size/position per cell, empty stopwatch face, tick fills, bulb states) only matters if the badges are redrawn. |
| `docs/kutchi-grammar-notes.md` | 533 | KEEP | `docs/language/grammar-notes.md` (and split: word tables to `lexicon.md`) | The only place the family's confirmed grammar lives; Zafar's new direction (G11) makes it the base for the engine. | See §4 and §6: annotate superseded items (mirchi/marcha, chindo, "repo private later"). |
| `docs/Nani jo Ghar — Questions for Mum (Round 1).md` | 109 | RECORD | `docs/language/mum-questions/` | Header says superseded by Combined; nothing answered here. | none — checked: all its questions reappear in Combined (A, C, E, F, I). |
| `docs/Nani jo Ghar — Questions for Mum (Round 2 — Cooking).md` | 172 | RECORD | `docs/language/mum-questions/` | Superseded by Combined; contains the 16-dish table and Part 5 "check what we've guessed" list. | Dish table → `modes/cook.md` (future dishes); Part 5 handout words → lexicon (§4). |
| `docs/Nani jo Ghar — Questions for Mum (Combined, for the visit).md` | 1351 | RECORD | `docs/language/mum-questions/` | Round that was answered in Sections A and B (25–26 Sept); other sections were carried to Round 3 and 4 unchanged. | Answers are recorded in `kutchi-grammar-notes.md` §1–§28 (not in this file). |
| `docs/Nani jo Ghar — Questions for Mum (Round 3).md` | 1084 | RECORD | `docs/language/mum-questions/` | Parts 1–4 and C1–C21 answered (28 Sept); Zafar's heard/clear/⚠ notes are inline in the right-hand columns. | Answers also in grammar-notes §29–§37 and `data/family-audio.json` (qid R/K/S/P/C). Sections G, E, F, H, D, I, J unanswered here; they were re-issued in Round 4. |
| `docs/Nani jo Ghar — Questions for Mum (Round 4).md` | 1069 | RECORD | `docs/language/mum-questions/` | Live round, 28 Sept, not yet answered (no answer notes). Section G is the doctor's script, to record with him ~9 Oct. | Keep as the active round. |
| `docs/Questions for Mum (Round 3).docx` | binary, ~6.9k words | ARCHIVE | `docs/archive/` | Word copy of Round 3 (same title and text, without Zafar's inline answer notes). Built by `build/build_mum_questions_docx.js`, so regenerable. | none — checked: text matches the .md front matter. |
| `docs/Questions for Mum (Round 4).docx` | binary, ~6.3k words | ARCHIVE | `docs/archive/` | Word copy of Round 4 (what Mum reads), regenerable from the .md. | none — checked as above. Ask first if Mum still opens this file (§5). |
| `docs/Questions for Mum (combined).docx` | binary, ~9.1k words | ARCHIVE | `docs/archive/` | Word copy of the Combined doc; the Round 1/2 "superseded" notes point to it. | none — checked as above. |
| `docs/cook-with-nani-words.md` | 103 | ARCHIVE | `docs/archive/` | Pre-correction word list of the first prototype; nearly every spelling is superseded (nar, bo, hikdo, daal, Gujarati TTS voice). | Handout vocabulary that exists only here → lexicon.md (§4). |
| `docs/cook-with-nani-kutchi-audit.md` | 160 | MERGE | `docs/process/qa-checklist.md` (leak patterns), `modes/cook.md` | The origin of the Kutchi leak test; the pattern catalogue is reusable for every mode. | Leak patterns (help shows the answer; the game decides for you; the screen gives the answer; fixed slots; sound matching; asymmetric decoys; row shape decodes the order; count shown) → qa-checklist. Still-open: English placeholder decision words, who-gets-the-cup, serving to the right person. Ear-star language is superseded. |
| `docs/cook-word-changes-B.md` | 172 | MERGE | `lexicon.md` | A one-off change log for data edits (46 text changes); decisions buried in it are still live. | See §4: green chutney = mint, chutney genders, lakri extension, `{x} na` frame doubt, green pepper recommendation, lines left in English. |
| `docs/cook-with-nani-phase-a-design.md` | 524 | MERGE | `docs/game-design/modes/cook.md` | The design record for Cook: pipeline, station-by-station five questions, controls audit, dishes, open questions; Cook's UI now lives in `design/cook-design-system-v1.md`. (Skimmed.) | Q1 pipeline, Q3 per-station design, Q4 keep/cut scores, Q5 gesture audit, Q9 change list, §9 dish list, §3 learning link, §6 pocket-money intent (updated by rules.md) → cook.md. §2 visuals diagnosis → art-bible history. |
| `docs/cook-with-nani-recipes-guide.md` | 197 | KEEP | `docs/architecture/cook-recipes-guide.md` | How to add ingredients, taste, recipes, levels and stations as data; matches current file layout (`data/stations/`, `js/cook/mechanics/`, `js/cook/stations/`). | Annotate: "ear, hand and lightning stars" (§6) and `hikdo`/`bo` examples are stale. |
| `docs/cook-with-nani-todo.md` | 157 | ARCHIVE | `docs/archive/` | Wave 1–6 status log, nearly all ticked; the live parts have moved to STATUS-TRACKER. Checked all ☐ lines. | "Platform and tech debt" 1–5 (one save: done; world map with fog; world-is-the-menu; no tutorial; role reversal) → ideas.md (rules.md H56, H57). "Noun singular and plural forms" → lexicon/engine notes. |
| `docs/Nani jo Ghar — Technical Plan.md` | 146 | KEEP | `docs/architecture/technical-plan.md` | Still the only data-model and pipeline doc; dated 22 Sept and partly stale (see §6c). | Needs an "as built" correction pass; do not archive. |
| `docs/shared-api.md` | 633 | KEEP | `docs/architecture/shared-api.md` | Matches the code on every spot-check except star scoring and the stub-swap section (§6c). | Annotate §3 (stars) and §6–§7 (stub-swap, "phase B owns") as historical. |
| `docs/clinic-heal-api.md` | 67 | KEEP | `docs/architecture/clinic-heal-api.md` | Live contract for the heal games; `js/clinic/heal/registry.js`, `host.js` and `lab/clinic-heal-host.html` exist. | Game id list (9) is behind the code, which also has hair, hic and tummy (parked per rules.md H32). |
| `docs/speech-recognition-plan.md` | 141 | KEEP | `docs/architecture/speech-recognition-plan.md` | Live plan behind `js/shared/speech.js`; the decision defaults are still open. | Annotate: voice star is gone (decision 2); examples use *nar*, *bo*, *hikdo*, *aastethi*. |

Verdict counts: KEEP 7 · MERGE 9 · RECORD 5 · ARCHIVE 14 · ASK 0 (questions for Zafar are in §5).

### 1b. Where art content goes: art-bible.md vs art-pipeline.md vs art how-to

- **`design-language/art-bible.md`: what the art looks like.** Style paragraph and Do/Don't; palette hexes; four lighting states; shadow rules; the cameras T/E/F and the per-scene camera table; scale table and readability rules; layers/baked-vs-sprite rule and pivots; containers back/front; characters (sheet contents, expression list, cast consistency table, cats, Kasuku); hands spec (shape, skin, sleeves); items and states matrix (spices in bowls, liquids, flames); set dressing lists and ambient motion; cultural accuracy; canonical style references and anti-references.
- **`design-language/art-pipeline.md`: how art is made, cut, named and exported.** Prompt templates (a)–(f) plus the style and negative blocks; style-anchor prompt; chat discipline tips; colour-ground rules (magenta for food, grey `#808080` for the rest); the slicing and cutting method (cut_tick_v2 method, pantry cut, slice_sheet legacy); registered canvases; export (WebP, trim, 16 px pad, stored size, 1600×900); naming convention; hands pipeline (parked); QA checklist §10 (or link to `process/qa-checklist.md`).
- **`process/art-how-to.md`: the ChatGPT-via-Chrome runner method, step by step.** The paste block (from the 30 Sept overnight pack), per-prompt rules (fresh chat, attach exactly the attach line, redo once, edits compared with the original, download button), the log format, image-limit waits, "don't change anything", upload to `sources/art/<pack>/`, what Claude does next (rename to "save as", cut, review). This is what rules.md §7 "Pipeline and cost" points at.
- **Archive:** the individual prompt batches (`docs/archive/art-prompts/`), kept because they are the exact prompts behind shipped art and are needed for any re-prompt.

## 2. Decisions found

Only decisions not already in rules.md. "Claude-made" marks ones Claude proposed that Zafar has not confirmed.

- 2026-09-23 · The look is a stylised 3D animated-feature look, with a modern limewash/marble kitchen and Kutch only as accents; the bazaar may stay more traditional; "the language is the main cultural thing" · after the wife said it "looks like early App Store games" · `art-direction-options.md` §7, §10
- 2026-09-23 · Stars, points and streaks "a yes in principle" · "if it gets kids playing, attention is spent in a good place" · `art-direction-options.md` §7 **[SUPERSEDED by rules.md: scoring is the three badges; decisions 1–3; stars/ear star/voice star removed]**
- 2026-09-23 · Keep the first-person hands holding the basket in the foreground · `art-direction-options.md` §7 **[SUPERSEDED by rules.md H12/H13: no hands anywhere in Cook; the basket became the pantry tray]**
- 2026-09-24 · Hand skin tone is Zafar's own: warm light tan, not orange, not saturated (mid `#C49A78`, highlights `#D8B894`, shadows `#A07A60`); one tone, no variants · `Art Bible` §2, `Asset Building Plan` §1.2 (rules.md I12 has the gist only)
- 2026-09-24 · Hands: modern everyday sleeves, not costume; master = white linen rolled sleeve; girl = soft dusty-pink sleeve + 3–4 thin glass bangles; girl-Eid = mehndi; Nani = deep-red sleeve, her skin, aqiq ring + tennis bracelet right, solitaire left, no bangles · Asset Building Plan §1.2, Art Bible §7
- 2026-09-25 · Hand reskins are done in code (`build/skin_hands.py`), never with the image API (39 of 47 API reskins redrew the hand) · Asset Building Plan §1.2
- 2026-09-24 · Cats: Simba black, 5, big; Zazu grey-blue, 1, drawn as a kitten (~85% of Simba's length); both green eyes; head and tail as separate layers; a cat never covers a tap target · Art Bible §6, Asset Plan §3 (rules.md I8 has only "mischief, never peril")
- 2026-09-24 · Kasuku is an African grey, generic; pose set: perched, head tilt, beak open, wings flapping, walking; head a separate layer · Art Bible §6
- 2026-09-24 · East African set dressing chosen: tandoor (background only, replaces the charcoal jiko), flask of chai, blue-rimmed enamel mugs, kanga, mkeka mat, mbuzi coconut stool, carved Swahili door, kiondo, kigoda stool, ufagio broom, panga hanging on a hook only and never handled. Not now: brass coffee pot, kerosene lamp, tin trunk, radio, mosquito net, soda crate, sugarcane, mango tree, Maasai shuka · Asset Building Plan §6 (rules.md I16 lists only a few)
- 2026-09-24 · Big Ma's room (a sewing corner) replaces the tailor's shop in "The spill"; she sings while she sews and Zafar's wife records the song · Asset Building Plan §7
- 2026-09-24 · Scene lighting is planned in four states (day, golden evening, night, storm); a scene's backgrounds come in every state it uses, as a straight relight of the same camera and layers, not a redraw · Art Bible §2
- 2026-09-24 · Cook strategy: mechanics and learning first, art second; "done" means a child asks for another go unprompted, the wife's test (no Kutchi = can't earn the "understood" mark), and an adult's word dots climb over a week · cook-with-nani-phase-a-design §1
- 2026-09-24 · Mastered phrases stop being asked (only an occasional spaced-review retest) · phase-a-design §5
- 2026-09-24 · "Pass me": Busy mode keeps the pan cooking; Relaxed mode pauses the cooking · phase-a-design §3 **[SUPERSEDED by rules.md if Busy/Relaxed modes no longer exist; rules.md never mentions them. ASK]**
- 2026-09-25 · Mum agreed her recordings can be stored in the GitHub repo, "the repo will be made private later" · kutchi-grammar-notes (25 Sept note) **[SUPERSEDED by rules.md decision 6: everything stays public until launch]**
- 2026-09-25 · Photos of real people may be attached to ChatGPT prompts (the tonight run allows at most two photos, Mum's only, in two prompts) · art-run-tonight (PHOTOS section); older packs still say "never attach photos" **[SUPERSEDED for the older packs by rules.md decision 9]**
- 2026-09-25/26 · Zafar's V rule refined: Kutchi words don't start with V but V can appear inside (*sev*, *vyo*, *kyo*); use W at the start · kutchi-grammar-notes §28 (rules.md G4 has only the W half)
- 2026-09-26 · The game uses *chundo* for mince (keema also accepted), replacing *chindo* · kutchi-grammar-notes "Zafar's corrections to A8 and Section B"; cook-word-changes-B
- 2026-09-26 · "Full" in recipe amounts is *aako* (a whole cup, *aako cup*); *bharelo* is filled-up/heaped; *adh* for half amounts, *ardo/ardi* only for half portions (unused in Cook) · cook-word-changes-B §2
- 2026-09-26 · Claude-made, doubt flagged: "no X" order rows use the short Mum shape *{x} na* (*Dudh na.*), not the polite *Muke {x} na khape*, so a hidden "no" row doesn't stand out by length · cook-word-changes-B §2, §5 item 1
- 2026-09-26 · Claude-made: green chutney is the mint one (*fudino ji chutney*, she-word) because the game's bowl is bright green; coconut chutney would need new art · cook-word-changes-B §1
- 2026-09-26 · Claude-made, doubt flagged: *lakri* (skewer) is put before *gos*, *boga*, *mixed* in mishkaki orders (Mum said it only with *mishkaki*) · cook-word-changes-B §1
- 2026-09-26 · Claude-made, doubt flagged: *{x} hane kadh* and *{x} chadi de* name the thing instead of Mum's *inke* · cook-word-changes-B §3
- 2026-09-26 · Claude-made: drop green pepper from mishkaki at the next recipe/art change (no Kutchi word; don't rename it *mirchi*) · cook-word-changes-B §4 (rules.md open question asks the same)
- 2026-09-26 · Zafar: chilli *mirchi*, plural *marcha* (irregular) · kutchi-grammar-notes "Zafar, 26 Sept (afternoon)" **[SUPERSEDED by rules.md decision 5: *mirchi* only]**
- 2026-09-26 · Zafar: children's Big Ma name is open (*Big Ma* / *Wadima* / *Maji*) · kutchi-grammar-notes §30 **[SUPERSEDED by rules.md decision 11: "Big Ma"]**
- 2026-09-26 · Zafar: *Hida acho* / *aai ki aayo?* (elder forms) wait for a later speaking moment; customers speak to the child with *tu* · cook-word-changes-B §3
- 2026-09-28 · Nani says *sambusa*, not *samosa* (the family grew up with it) · kutchi-grammar-notes §34 P7 (Zafar's instruction)
- 2026-09-28 · "Yesterday" uses *gaykal* for now · kutchi-grammar-notes §37.9
- 2026-09-28 · *hane kadh* (gentle, in a step sequence) stays in Cook; *hever kadh!* is for an urgent moment (Monsoon, about to burn) · kutchi-grammar-notes §37.6
- 2026-09-28 · Zafar skipped Round 3 Section G on purpose and did the grammar (C1–C21) first, "so we don't have to restructure things later"; recording C22–C154 before building more sentence frames still makes sense · kutchi-grammar-notes (28 Sept)
- 2026-09-28 · Pantry: the basket goes; the tray is painted into the background with one outlined space per needed item (3 at level 1, up to 6), shaped like the item's container, no picture inside; fridge holds milk, yoghurt, meat, mince, chicken, fish, butter, cheese, cream, eggs, juice and never mixes with shelves · chatgpt-art-prompts-pantry-jars "The tray", "What goes where" (rules.md H52 has the gist only)
- 2026-09-28 · Tallies are a grid at most three across (2×3 for six) in every Cook station · pantry-jars status note
- 2026-09-28 · Claude-made recommendation, not confirmed: jar labels stay off (bare containers) for now; if labels return, give salt/rice/sugar icons a darker sticker · pantry-jars status
- 2026-09-28 · Hands removed from Cook (`hands.js` commented out, art kept) · cook-with-nani-todo (already H13)

## 3. Past feedback items (for the regression list)

Zafar's or the family's own reports. "Claude-found" items are marked where they add a concrete check.

- Game "looks really old, like early App Store games": semi-realistic airbrushed Nani, clip-art glossy fruit with shine spots and outlines, skeuomorphic wood/parchment, brown-orange muddle, flat stage camera, system font and emoji icons, black letterbox bars, stiff motion · whole game (wife, 23 Sept) · `art-direction-options.md` §1 · status: addressed by the 3D restyle; letterbox rule is rules.md F18 · by eye
- Chakla drawn on top of a chopping board (two boards) · Cook roll station · `cook-with-nani-phase-a-design.md` §2 · fixed by the no-doubled-surfaces rule · by eye
- Items "stood" on the worktop lip (a shadow, not a surface); no contact shadows · Cook stations · phase-a-design §2 · addressed by the contact-shadow rule · by eye
- Props at ~30° from the side and the hob at ~60° from above; ¾ splashback in the stove background · Cook stations · phase-a-design §2, Art Bible §3 · fixed by straight-down station backgrounds · by eye
- Pantry items drawn top-down on eye-level shelves, cardamom as big as the milk jug, top shelf floating · Cook pantry · phase-a-design §2 · redone in pantry v2/v3 · by eye
- Liquid a flat oval; flames blue dots; gauges floating on the hob; glass standing on the hob · Cook stations · phase-a-design §2 · fixed or superseded (see stale §6: Art Bible §8 vs rules D11) · by eye
- Nani placeholder had a bindi (Hindu marker, wrong for a Khoja family) and visible grey hair under the dupatta · Nani art · `art-direction-options.md` §10 · fixed (rule I1) · by eye: no bindi/tilak/sindoor on any character
- Hands came out orange (round 3 `#D3833E`–`#DE9351`) · hands art · Art Bible §2 · fixed by the skin normaliser; hands now out of Cook · auto (`build/qa_hands.py`) for other modes
- Nani's four moods were one image; Nana/Ma/Ali "impatient" faces smiled smugly · Cook characters · cook-with-nani-todo "Then" · fixed by batch3-cook edits · by eye
- Press-and-hold pour didn't land (small hands let go early; jug "appeared by itself") · Cook pour · phase-a-design Q0 · fixed: pour is a tap-measure · by eye
- Level 1 overwhelming ("hard to know what to do; lots of information at once") · Cook, 25 Sept · todo "Wave 5" · fixed by Wave 5/6 (smallest round, one card, bulb, overlay) · by eye
- Chai station "a bit boring" · Cook chai · todo "From Zafar, 26 Sept" · open until the fun pass (rules H42/H43) · by eye
- Skewer order read "tameto, tameto" (duplicate pick; English placeholders dotted out) · Cook skewers · todo Wave 1 · fixed · auto (`build/test_cook.py --orders`)
- Result cards: percentages not whole numbers, unlabelled lines · Cook end screen · todo Wave 1 · fixed · by eye
- Sidebar clipped, horizontal scrollbar, Nani's text not wrapping · Cook sidebar · todo Wave 1 · fixed · by eye
- Item labels overlap (more than 5 items) · Cook · todo Wave 1 · fixed · by eye
- Count badges show the target instead of a running tally · Cook · todo Wave 1 · fixed · by eye
- Missing label on a look-alike bowl · Cook · todo Wave 1 · fixed · by eye
- Tadka arrow/pulse missing from small pan to pot; chop vegetables not thrown high enough · Cook · todo Wave 1 · fixed · by eye
- Claude-found: iPad 1024×768 sidebar breaks words letter by letter ("tr/ae/kh/un"), phone 915×375 buttons 22 px and goal box cut at ~4 lines, long order card pushes goal below the fold, count badge overlaps the Maani hob, ✓ over the resting spatula, roll-tawa plate cut off, 1280×800 spatula hand past the canvas edge · Cook · todo Wave 4 "For Wave 5" · iPad letter-breaking addressed by Wave 5 ("rows flow as text"); the rest unknown · by eye at those viewports
- Clinic waiting room too wide (people small), front half empty floor; exam room had a poster; pharmacy came out looking down from above · clinic backgrounds, 29 Sept · chatgpt-art-prompts-clinic-v1 "Round 2" · fixed by CB1b/CB2b/CB4b · by eye
- Pantry tray's front edge must be drawn over what is on it; outlined space fades as its item lands; fridge items drawn at least 0.9 so yoghurt reads; tally max three across; pass-me pop-up shows side-on containers · Cook pantry, 28 Sept evening · chatgpt-art-prompts-pantry-jars "Status" · fixed · by eye
- Jar labels: at phone size the jar's colour reads better than the label; white-on-cream icons (salt) vanish · Cook pantry · pantry-jars status · open (bare for now) · by eye
- Wife's "can you win without the Kutchi?" (help that shows the answer, steps skipped for you, count shown, fixed slots, sound matching, decoys that give it away, row shapes that decode the order) · every Cook station, all modes · `cook-with-nani-kutchi-audit.md` · systems closed after Wave 4; English placeholder decision words still open · auto (leak bots `build/leak_*.mjs`)

## 4. Design content at risk

Content in MERGE/ARCHIVE files that exists nowhere else.

**Art and design**
- Asset Building Plan §1.3 hands list A–F (poses, cameras, frames, uses) and §1.4 actuals → `art-pipeline.md` "Hands (parked)". Hands are out of Cook; other modes (Find it, clinic greetings) may still want them.
- Asset Building Plan §3 cats: the table of what cats do in each mode (hub ambient, Cook scripted theft, Who did it suspects, Find it hidden, Tidy up knocked things, Monsoon get inside, Snap photo, feeding ritual) → `cast.md` and each mode doc.
- Asset Building Plan §4 ambient-motion table (bunting, curtain, fan, steam, dust, plants, washing line, birds, Kasuku, lanterns, clock, rain) and "2–4 moving things per scene, never near a tap target, off with reduce-motion" → `art-bible.md`.
- Asset Building Plan §6 object lists (East African chosen/not now; Kutch suggestions, not yet chosen) → `art-bible.md`.
- Asset Building Plan §7 Big Ma's room and song → `cast.md`, `story-and-arcs.md`, `audio.md` (a recording to get from Zafar's wife).
- art-direction-options §5.2 "style-lock test" steps (one complete scene before regenerating everything) and §10 ChatGPT stress-test list → `art-pipeline.md` as the acceptance test for any new style.
- art-direction-options §3 juice list → `ideas.md`; its font suggestion (Baloo 2) is superseded by rules F2 (Nunito).
- Chapter 1 Art Prompts: the old layout contract v2 (counter/island/bolster across the scene so characters stand behind something; every tappable surface clear and flat; no painted food near it; no rug in the foreground) → already reflected in rules D5/D15; Eid-decoration story mapping → `story-and-arcs.md`.
- pantry-jars "For Claude" section: slot counts (15 shelf, 6 fridge, 6 tray spaces 160 px apart), what goes in the fridge, pantry v3 background file names → `architecture/` or Cook mode doc.
- cook-with-nani-phase-a-design: Q3 station-by-station design (all nine stations), Q4 scores and cut list (knead cut; boil/count/add/pour not stations), Q5 gesture audit and "tap pour exactly", Q9 12-item change list, §9 dish list (16 dishes with verbs: mogo, makai, mandazi, dabeli, falooda, jalebi, sheer khurma, biryani/pilau…) → `modes/cook.md`. §3 "learning link" (order is the recipe; look-alike decoys; "no"/"not"; end-of-day recall; later role swap) → `modes/cook.md` and qa-checklist.
- cook-with-nani-kutchi-audit: the 8 ranked fixes and the "still leaks" table (English placeholder decision words, cups and who, label speakers free at stage 2, serving to the right person, tastes as a bias, chaat base always chickpeas+potato, tea always *chai*, maani ghee not built) → `modes/cook.md` open items and `process/qa-checklist.md`.
- cook-with-nani-todo "Platform and tech debt" 2–5 (world map with fog of war as data; world is the menu; no tutorial, first launch straight into play; role reversal prerequisites: Find it scenes store relations not just coordinates, every grammar frame buildable from pills) → `ideas.md` / `status.md`.

**Language: confirmed Kutchi words and grammar that live ONLY in a file to be merged or archived**

The only file that would be kept and already holds almost everything is `kutchi-grammar-notes.md` (§1–§37). Nothing confirmed by Mum or Zafar is lost if the Questions files are kept whole. What lives only in merge/archive files:

1. `cook-with-nani-words.md` (archive): **handout vocabulary, never confirmed by Mum**, which the lexicon should carry with status "class handout / content master, unconfirmed" (rules.md G21 allows handout vocabulary):
   - nouns: *paani* water, *chai* tea, *dudh* milk, *atto* flour (Zafar 24 Sept "OK for now"); *dungri* onion, *tameto* tomato, *marcha* green chilli, *lasan* garlic, *hardar* turmeric, *jeeru* cumin, *rai* mustard seeds, *elchi* cardamom, *loon* salt (content master ids veg-02, veg-03, veg-12, veg-13, spi-01, spi-02, spi-05, spi-10, spi-16);
   - numbers *trae* 3, *char* 4, *panj* 5 (handout; *hikdo* and *bo* are superseded by *hakro/hakri* and *ba*);
   - phrases: *Salamun alaykum*, *Wa alaikum salaam* (Mum said *Alaikum salaam*, ⚠ in §30), *Aabhar aanjo* (thank you; the family says English "thank you"), *Achija* (bye; replaced by *khuda-fis*), *Arre re!* (oh dear), *Hedo!* (used before "the usual" order / Nani's *Hedo, beta!*), *Ghan* (here you are), frames *Muke … khape*, *Ne …* (and);
   - the Round 2 "Part 5 check what we've guessed" list asks Mum to confirm exactly these; it was never answered (Combined Section D / Round 3 Section D are unanswered). The lexicon should mark them "confirm with Mum".
   - *khun* not *khand* for sugar (Zafar 24 Sept) is already in grammar notes §6.
2. `cook-word-changes-B.md` (merge): *tarela bataata* is a plural (*bataato → bataata*); chutneys *amli ji chutney* and *fudino ji chutney* stored as she-words (inference from *ji*, not a spoken fact); *chundo*'s gender stays unknown; *lakri* she-word so "one" = *hakri*; *Kali {x}* ("only") used as *Kali ba dungri. Ne hakro tameto.*; lines the game still leaves in English (*times*, *pocket*); `ph-pepper` = no Kutchi word (*mirchi* chilli, *lilo* green; capsicum not traditional). **Its line "cup has no gender: hakri cup" is wrong** (Mum, 28 Sept: *hakro cup*, cup is a he-word, grammar notes §29 R8).
3. `cook-with-nani-phase-a-design.md` §3: *Muke atto de. Ne khun. Ne dudh.* (Nani's first pantry list) and the order shapes used as examples; all built from confirmed frames, so nothing new.
4. `Questions for Mum (Round 2)`: the **dish list** (chai, maani, daal, chaat/chana bateta, samosa, mishkaki with chips, chips mayai, mogo, makai, mandazi, dahi puri/sev puri, dabeli, falooda, jalebi, sheer khurma, biryani/pilau) and the dish names "as the family calls them" are questions, not answers. Answers live in Round 3/4 Section I (still unanswered) and grammar notes §26 (B28–B38).

**Everything else (the answers)** is in `kutchi-grammar-notes.md` (KEEP) or in the RECORD files. Specifically, Round 3's inline Zafar notes (28 Sept, ✓/⚠/✗ per line) in the RECORD file `Round 3.md` are the **only** place the per-line confidence marks for R1–R12, K1–K15, S1–S9, P1–P13, C1–C21 are kept in table form; grammar-notes §29–§36 repeat them. `data/family-audio.json` holds the clip ids (qid R1…, K1…, S1…, P1…, C1…).

**Excel:** `content/Nani jo Ghar - Content Master.xlsx` exists (not opened). `build/build_content.py` reads it and warns never to resave it with openpyxl, because the "Carrier sentences" tab holds Excel formulas. Docs in my batch that mention it: Technical Plan (source of truth, edited by Mum and her sister), Asset Naming Convention (ids `fru-01…`, `veg-01…`, `spi-01…`), cook-with-nani-words (ids; "seven confirmed words should be added to the content master; for now they live in `data/cook.json`"), cook-with-nani-recipes-guide (family words keep their content-master ids), cook-word-changes-B. Not in my batch but also mentioning it: Game Design, Project Brief, Roadmap, NEXT-CHAT-START, MODE-DESIGN-BRIEF, cook-with-nani-build-log, superseded/Image Prompt Sheets. **Drift risk:** confirmed Cook words since 24 Sept live in `data/cook.json`, not the sheet (see §5).

## 5. Open items and questions for Zafar

Open decisions, TODOs and unanswered questions still live:

1. **Is the Excel Content Master still the single source of truth?** The Technical Plan says so and `build/build_content.py` reads it, but every word confirmed since 24 Sept (*daar*, *ba*, *hakro/hakri*, *chundo*, *aako*, *gos*, *boga*…) is in `data/cook.json`. With the language-engine plan (rules G10, J8), should `lexicon.md` become the source, or does Mum keep editing the sheet? (Also: the docs' "Mum and aunt edit it" assumption.)
2. **Round 4 is unanswered** (28 Sept). Section G (body parts, hurts, the doctor's instructions G108–G127) is the doctor's script, to record with Hannah's granddad around 9 Oct. Sections C22–C154 (describing words, my/your, verbs and tenses) are what shapes sentence data most.
3. **Words to ask Mum**, from the docs (rules.md already lists the first four): *kere karein* (who did it; Zafar doesn't recognise it); green pepper (no word: drop it from mishkaki?); maani turner *moikyo*; *Muke sekelo khape*. Add: *wadhare*, *thorok*, *Jara e wandho nai*, *Mu lai khobar!* (⚠ doubtful); *dinda* vs *dinde* (which is for an elder); *khan* vs *khanij*; *randhnu no khapdo* (real "of" word or a slip); the word for "corner" (ask Masi); *rei* vs *baki* in "none left" (ask Masi); *kyo* ("which one"); *watana* vs *matar* (peas: which does Cook mean); tomato spelling (*tameto/tumata*); whether *hi/hu*-style "this side/that side" is the level-1 clinic side word; the Kutchi for "yesterday" (*gaykal* for now) and "tomorrow" (*saware* vs *kale*).
4. **`{x} na` or the polite `Muke {x} na khape`** for "no X" rows (Mum called the short form "very informal"). Also *lakri* before *gos/boga/mixed* and *{x} hane kadh* / *{x} chadi de*.
5. **Elder forms and the speaking ramp:** whether the child says the formal *khapeti/khapeto* or the informal *khape* in Conversations (E6 in the notes); the "speak to elders" lesson (*hida acho*, *aai ki aayo?*) is proposed for stage S3.
6. **Boy and girl forms for "I will…"** (*kar dos* / *kar dis*): data needs a boy and a girl form picked from the character. Zafar's clip gives the boy's; Mum's gives both.
7. **Grammar still not nailed down:** -o → -e before *je/sathe* (a tendency: *chokre sathe* but *ambo je mathe*), the *-yu* plural (*akhyu*, *chokriyu*) and *bakra* for she-goats, plus everything from C22 on (describing words, my/your, tenses).
8. **Speech recognition:** the plan's decision table has defaults awaiting Zafar: record Isa (and a cousin) saying five words for measurement, kept in the family; enrol children's takes by default; any cloud path (default no); ask Mum for three takes of the ~25 speaking words; budget for the on-device model if children score under 85%. Also how this squares with rules.md I15 (children's voices never ship, stay on device).
9. **Pantry jar labels:** labelled or bare. Claude recommends bare; script `build/label_pantry_v2.py` stays ready.
10. **Art backlog from batch 3 §9 and the 30 Sept pack:** healing-game close-ups and body parts, patient people and doctor poses (wait on the people-and-placement plan and overlay test), Big Ma and doctor feelings/"where it hurts" sheets (batch 4), expressions and poses for the new people (wait for sheet approval), Find it courtyard and sitting room scenes, Tidy up high-angle dastarkhwan, Monsoon house cross-section, Snap strips, farm and village, samosa redos.
11. **The nine hand masters that failed** (a2, b1, c2, c3-t, c3-e, d3, d6-f1, e3-count-4, e5) and the Eid mehndi overlay: only needed if hands come back in another mode.
12. **Art Bible questions:** Nani's headscarf hair (Q5 in cook-with-nani-words: does grey hair show at the front?) still unanswered in the docs; the doctor and Big Ma sheets wait for photos ("photos to come").
13. **Busy and Relaxed Cook modes:** cook-with-nani-phase-a-design and the todo describe them (lightning star, patience ring, pause vs keep cooking). rules.md never mentions them. Are they gone?
14. **Technical Plan open decisions** (22 Sept) still listed: per-item carrier-sentence recording and a second family's audio.
15. **Do you still use the Word copies** of the Questions for Mum rounds (Mum reading on paper or phone)? If not, the three .docx can stay archived; if so, regenerate from the .md.
16. **Commercial model** and the *mirchi* plural remain open in rules.md; nothing in my batch adds to them.

## 6. Stale or conflicting content

**Art Bible (KEEP: annotate)**
- §3 "Hub" row: "the island front is the occluder and the quilt's surface". Quilt is no longer the progress marker (rules decision 4: bookshelf). Reword.
- §3 cooking stations: "bottom 20% kept clear for hands entering from the bottom edge"; §4 first-person hands at 1.2×; all of §7 Hands. Hands are out of Cook (rules H13, 28 Sept). Mark hands as "parked, not used in Cook".
- §5 "Default: the image API's native transparent background" vs rules D1 (art is made in ChatGPT via Chrome; API only for a rapid prototype under $2) and D3. ChatGPT gives no alpha: batches use `#FF00FF` for food and `#808080` for steel, glass, wood, tools, characters and badges, then key it. Rewrite §5 around that; prompt templates §9 say "Transparent background" which is the API route.
- §8 "Liquids from above: liquid is a disc masked by the pot's inner rim… colour, bubbles and boil-over are code" vs rules D11 "Pot and pan contents are pre-rendered pictures, cross-faded; never drawn dots or discs". The Art Bible is older; follow D11.
- §6 cast table calls the current Nani "a generated placeholder, to be replaced by a sheet made from Mum's photos"; rules I4 says sheet v2 is canonical. Doctor and Big Ma still "photos to come".
- §3 island top edge "65–70% of frame height"; the old Chapter 1 prompts (archived) used 60%. Keep the Art Bible number.
- §8 states matrix and ingredient art mention chips "frying golden" etc.; fine.

**Asset Building Plan / Asset Naming Convention (MERGE)**
- Plan §3 care ritual: "*bo* scoops for one, *hikdo* for the other": *bo* and *hikdo* are superseded (one = *hakro/hakri*, two = *ba*).
- Plan §1.5 "Reference hand… with the embroidered cuff": superseded by the white linen rolled sleeve.
- Plan §1.4 cost rule (`--yes` over $5) conflicts with rules D2 (under $2 for any paid API).
- Naming Convention "Slicing method" and the `assets/backgrounds/`, `assets/characters/` paths describe the old cel-shaded storybook art, which the Art Bible lists as anti-references. Method still works for magenta sheets; keep only as legacy.

**art-direction-options (MERGE)**
- §7 "stars, points, streaks: a yes in principle"; "embroidered stars on quilt patches": superseded (badges, bookshelf).
- §3 suggests Baloo 2 font; rules F2 uses Nunito.
- §7 "hands holding the basket: keep it": no hands in Cook, basket replaced by the tray.
- §10 risk row "consider a few skin tones per profile": superseded by the one-tone decision (hands out of Cook).

**Art prompt packs (ARCHIVE)**
- batch 2, batch 3, batch 3-cook: "no private photos" wording superseded by decision 9 (and art-run-tonight).
- Older packs say "Zafar uploads" or "drag PNGs into Claude Code"; current method is Chrome uploading to `sources/art/<pack>/` on main (rules D3).
- batch 1 and Chapter 1 prompts still ask for "thick outlines / cel shading" in Chapter 1 only (retired).

**kutchi-grammar-notes (KEEP: annotate)**
- §28/§4 "Zafar, 26 Sept afternoon: *mirchi* one, *marcha* plural": superseded by rules decision 5 (*mirchi* only, Zafar to confirm with Mum); §34 P4 records the Mum view.
- §24 B33 and "Claude's view": *chindo* is replaced by *chundo* (kept in the "corrections" block but the earlier text still reads *chindo*). §25 B27 "*hakri cup*" is overridden by §29 R8 (*hakro cup*); cook-word-changes-B repeats the old form.
- Early sections use *bo* for two and *hikdo* for one as "current game" states; both are fixed in data (cook.json: `was hikdo`).
- §30 K14 "Zafar to choose Big Ma / Wadima / Maji": decided, "Big Ma" (decision 11).
- 25 Sept header note: "the repo will be made private later" conflicts with decision 6.
- §20 *nar* = "look": correct and not the old "no" (don't "fix" it). The word "no" is *na*.
- Uses "Game ideas 9–13 are parked in `docs/GAME-IDEAS-TBC.md`": fine, but that file is outside this batch.

**cook-with-nani-words (ARCHIVE), phase-a-design (MERGE), kutchi-audit (MERGE), recipes-guide (KEEP), todo (ARCHIVE)**
- Ear star, hand star, lightning/tick star, "no help" star, pocket-money-from-stars, completion-card collection: superseded by the three badges, decisions 1–2 and the pocket-money model (decision 10). Affects phase-a-design §6, kutchi-audit throughout, recipes-guide §6 ("one set of ear, hand and lightning stars"), todo Wave 2/6b.
- phase-a-design §2: "image API pipeline… $15 to $60 for about 300 images", first-person hands with embroidered cuff: superseded (ChatGPT route, hands out).
- cook-with-nani-words: `nar`, `bo`, `hikdo`, `aastethi`, `bharelo`, `vadho`, `ghos`, `channa`, `bajr jo maani`, `daal`, Gujarati-TTS placeholder at half speed (rules G14: TTS test-only).
- Busy/Relaxed mode language (see §5 item 13).
- recipes-guide and todo name "knead" as a mechanic; knead was cut from the playable stations.

**Technical / API files (KEEP: annotate)**

*6c. Does the Technical Plan or shared-api still match the code? Spot-checks done with grep/ls in `js/`, `data/`, `build/`, `*.html`:*

| Claim | Check | Result |
|---|---|---|
| Plan: "Plain web technology, not a game engine" | `cook.html` line 109 loads `js/vendor/phaser.min.js`; `js/shared/app.js` talks about Phaser | **Stale for Cook** (Phaser). Other modes are DOM/SVG. |
| Plan: content master spreadsheet → JSON build script | `build/build_content.py` reads `content/Nani jo Ghar - Content Master.xlsx` | Matches, but Cook's words live in `data/cook.json` (see §5.1). |
| Plan: `PlayerWordProgress` with `understand_stage` / `produce_stage` | `js/progress.js` has both, stage thresholds 0/1–2/3–5/6–11/12+, drops after two misses | **Matches.** (Plan's "5 stages" table lives in code comments.) |
| Plan: device profile in a store on the device | `js/storage.js` (IndexedDB `njg_shell`) is loaded only by `bowl.html` (legacy fruit errand); every other page uses `js/shared/save.js` (localStorage `njg-save`) | **Stale:** the shell/IndexedDB profile model is the legacy bowl page; the live save is `Save` (shared-api §11). |
| Plan: `Patch` entity "the quilt, as a list of earned patches" | no patch/quilt entity in the live save; `js/*` mentions found only in legacy/monsoon/clinic code for other meanings | **Stale** (quilt replaced by the bookshelf, decision 4). |
| Plan: `chunk_type` (frame / noun_phrase / place_phrase / reaction) chunked recording | `grep chunk_type js build data` finds nothing | **Not built, and conflicts with rules G9/G10/G12** (every line a full natural sentence from the language engine; most frequent phrases recorded whole). |
| Plan: touch targets minimum 44 px | `css/shared/buttons.css` uses `min-height: 48px`; rules F2 says ≥48 | **Stale:** 48. |
| Plan: PWA on the home screen, then Capacitor wrap | no `manifest`, `sw.js`, `package.json` or `capacitor.config.*` at the repo root | **Not started**: still a plan (rules J2 says so too). |
| Plan: "one fixed aspect ratio 16:9… locked to landscape" | rules F18 fills the whole stage; backgrounds 1600×900 | Broadly true; letterbox now forbidden. |
| Plan's architecture diagram (one app shell) | Modes are separate pages (`cook.html`, `clinic.html`, `find.html`, `dress.html`, `tidy.html`, `who.html`, `snap.html`, `monsoon.html`, `first.html`) on `js/shared/app.js` + `save.js` | **Needs a rewrite** to describe the multi-page shell, `js/shared/`, `data/shared/`, per-mode `data/` and `build/` tools. |
| shared-api §0 file/global table | `js/shared/{speech,rel,whichone,stars,say,overlay,save,app,order-card,guide}.js` all exist; also `buttons.js`, `results.js`, `onboard.js`, `uistore.js`, `character.js`, `charmaker.js`, `conversations.js`, `family-voice.js`, `fit.js`, `sfx.js`, `story.js` | **Matches**; table is missing ~10 newer modules (some are covered in later sections §9, §12–§16). |
| shared-api §11 save keys `njg-save`, `njg-save:<player>:<ns>`, `Save.exportJSON/importJSON/persistent` | `js/shared/save.js` line 52 `ROOT_KEY = "njg-save"`; exports/persistent present | **Matches.** `node --test build/test_shared_save.mjs` exists. |
| shared-api §14 `OrderCard.shape(data, {big})`, §16 `NjgButtons` (+ `build/test_shared_buttons.mjs`, `css/shared/buttons.css`) | `js/shared/order-card.js` line 68 `OC.shape`; `buttons.js` + `buttons.css` exist | **Matches.** |
| shared-api §3 Star sets and ear/voice rules (`data/shared/stars.json`, `js/shared/stars.js`, ear and voice star, `Stars.ear`, `Stars.voice`) | files exist; `js/shared/results.js` still maps the badges to the stars (`Results.toStars`, "accuracy gold ⇔ ear, hints ⇔ no-help") | **Code matches doc, but the concept is superseded** (rules H5, decisions 1–2: remove the legacy star code; no ear star, no voice star). Mark as legacy to delete. |
| shared-api §6 stub-swap table and §7 "Phase B owns the rest" | `js/tidy/stubs/`, `js/who/stubs/`, `js/clinic/stubs/` still exist but `save.js`/`app.js` (phase B) are built | **Stale/historical**: §6–§7 describe the state on 25 Sept. |
| clinic-heal-api: games `knee cut ear tooth taste fever boing eye foot` | `js/clinic/heal/games/` also has `hair`, `hic`, `tummy` | Minor: list behind the code; tummy/hic/hair are parked (rules H32). `registry.js`, `host.js`, `lab/clinic-heal-host.html` exist. |
| speech-recognition-plan: `js/shared/speech.js` with `listen({choices, timeoutMs})`, `enrol`, `loadTemplates` | present in `js/shared/speech.js`; `build/speech/{harness.js,cloud_whisper.py,augment.py}` exist | **Matches the code**; "voice star" and *nar/bo/hikdo/aastethi* examples are stale. |

**Other stale items to flag in the KEEP technical docs**
- Technical Plan "MVP… Story 1, *Eid at Nani's*, is the release candidate; the other four arcs conditional": superseded by rules H36–H41 (Arc 1 is the Birthday, store launch with Arcs 1–5).
- Technical Plan audio pipeline says placeholder TTS "in the nearest available voice"; rules G14 says TTS is test-only and only real family voices ship.
- speech-recognition-plan "Voice star rules": remove (decision 2). Its "children's takes kept in the family, never shipped" sits next to rules I15 (children's voices never ship, on device): consistent, but say it.

### 6b. Style rules in the art docs that are NOT in rules.md §7

(rules.md §7 holds: one camera per scene, 1600×900 backgrounds, sizes never invert up to 1.5×, under ~90 px in a container, 1–2 cultural nods, no text, warm light upper left, no outlines/cel/photoreal, flat base and contact shadow, cut with cut_tick_v2, WebP with 16 px pad, never key magenta from metal/glass/glow, states generated fresh, contents pre-rendered, sheet-first characters, faces in a circle with three expressions, two poses per talker.)

Not in rules.md:
- "Reds belong to Nani" is in rules, but **"tappable items get the most saturation in the frame"** and **"one accent pattern per surface"** are not (Art Bible §2).
- The **palette** (hex values: Kutch red `#B72424`, maroon, marigold, indigo, limewash, marble, sage, pale oak, brass, steel, terracotta, green; hand-skin hexes) (§2).
- **Four lighting states** (day, golden evening, night, storm) and "a scene's backgrounds come in every state it uses, same camera and layers, a relight not a redraw"; rules has only "evening/night versions" (§2).
- **Shadow rules detail:** sprites carry no cast shadow of their own unless cut in place; code draws the contact shadow as a multiply ellipse offset down-right; "nothing floats: an item without a contact shadow is a reject" (§2).
- **Camera definitions:** T (straight down, circles not ovals, no horizon), E (horizon 50–60%, one-point), F (item front, ~10° down), and the per-scene table (island top edge at 65–70% of frame height; pantry shelf tops just visible) (§3).
- **Scale table** (real cm per item; child's hand 13 cm, Nani's 18 cm; hands at 1.2×) and "size_cm per asset, pixels-per-cm per scene" (§4).
- **Layers rule:** anything that moves, is tapped, changes state or can be covered is its own layer; everything else is baked; no doubled surfaces; receiving containers in two layers (back and front); pivot table (§5).
- **Ambient motion:** 2–4 moving things per scene, never near a tap target, off with "reduce motion"; each is its own layer with a pivot (Asset Plan §4).
- **Export details:** stored size = largest on-stage size × 1.5, lossless for fine edges else quality ~90, `<item>-<view>-<state>` naming, never stretch a non-16:9 background (crop a central 16:9 band) (§5).
- **Colour grounds:** magenta `#FF00FF` for food, grey `#808080` for steel, glass, wood, tools and sheets that are to be cut; glass and steam need partial alpha (§5; batch 2 §0.1).
- **Do/Don't:** chunky rounded silhouettes with thin parts thickened; large eyes with a highlight; real but gentle specular; no clip-art shine spots, heavy gradients, plastic toy sheen; no depth-of-field, motion blur, vignette, lens flare or bloom on sprites (§1).
- **Cultural look of food and kit** (rotli thin and soft with brown spots; daal yellow and loose; chai milky orange-brown in a glass; mishkaki small marinated cubes; steel thali/katori, masala dabba, tawa, chakla, thin tapered velan) (§10).
- **Hands spec:** slender with long fingers, no bones/veins, right hands only (mirror in code), grip + separate tool, reskins in code; 17-point QA checklist for hands (§7, §10).
- **Characters:** what stays fixed per character; expression list (12 + impatient for customers); blink/mouth frames are in-place edits; "poses are edits of the sheet, never fresh generations"; head and tail as separate layers for cats and Kasuku (§6). (rules D8/D9 say each state is generated fresh; this is the stricter character rule.)
- **Item art:** spices always heaped in open bowls; tins and jars only in the pantry F view; liquids as discs, flames as a flame-ring sprite, not dots (conflict with D11 noted in §6); keep other objects out of item prompts (a hand in the scale comparison makes the model draw the hand) (§8, §9c).
- **Set-dressing lists:** the chosen East African objects and the "not now" list; panga tool-only, hanging (Asset Plan §6).
- **Reference discipline:** canonical references (`assets/cook/bg/service.jpg`, the `sources/cook/*-sheet.webp` files) and anti-references (old `assets/backgrounds/`, `assets/characters/`, old pantry and tawa screenshots); "don't attach old art for style; generate each style separately" (Art Bible §1, art-direction-options §7).
- **Chat discipline** (goes to art-how-to): regenerate don't argue, one chat per character/background, fresh chat per ingredient sheet, never make a state by editing another, download not screenshot.
- **Pantry cut/label rules** (registered canvases 256×384 and 256×256 with bases on one line; label ≈ 70% of the sticker's inner circle; relative heights: tall jar/bottle 1.0, packet 0.75, crate 0.6, tub 0.55, spice jar 0.5) (pantry-jars).

## 7. Checkable items

Every checkable art rule in my batch, one line each: item · source § heading. (A = could be automated; E = by eye.)

**Sizes and canvases**
- Backgrounds exactly 1600×900, 16:9; never stretch; if the generator can't do 16:9, ask for the nearest landscape with the scene in a central 16:9 band, then crop · Art Bible §5 Export (A)
- Stored sprite size = largest on-stage size × 1.5 · Art Bible §5 Export (A)
- Hand forearm width 250 px on the 1024 px canvas, within ~5% of the reference · Art Bible §7 post steps, §10 check 15 (A: `build/gen_assets.py forearm_widths()`)
- Minimum tap target about 90 px on the 1600×900 stage; smaller comes in a container or as a heap · Art Bible §4 Readability rules (A/E)
- Small items drawn up to 1.5× true size; size order never inverts (cardamom < garlic < milk jug) · Art Bible §4 (E/A with `size_cm`)
- Hands at 1.2× worktop scale, same factor for every hand · Art Bible §4 (E)
- Child's reference hand 13 cm, Nani's 18 cm · Art Bible §4 Scale reference (E)
- Pantry canvases: tall jars and bottles 256×384; spice jars, tubs, crates, packets 256×256; one scale factor per sheet; base on the same line · pantry-jars "Cutting the sheets" (A)
- Relative heights: tall jar/bottle 1.0, packet 0.75, crate 0.6, tub 0.55, spice jar 0.5 · pantry-jars "Cutting the sheets" (A: `data/cook.json` `art.sprites`)
- Label ≈ 70% of the sticker's inner circle; label diameter ≈ one third of the container height; same anchor for all items of a type · pantry-jars "Putting the labels on" (E)
- Island top edge at 65–70% of frame height (eye-level scenes); horizon 50–60% for E view · Art Bible §3 Cameras (E)
- Shelf tops just visible (a few pixels) on pantry shelves; no shelf at the very top edge · Art Bible §3 Per scene type (E)
- Sheet canvases asked of ChatGPT: 1536×1024 landscape for sheets and backgrounds, 1024×1024 for the style anchor · chatgpt-art-prompts §0 Tips (A)
- Badge sheets: 1536×512 (three cells) and 2048×512 (four cells); identical size, shape and position in every cell · results-badges "R1, R2" (A)
- Chai station sheets: 3×3 grid, nine equal cells, one object per cell, same size and position across states · chai-station (A)
- Clinic backgrounds 1536×1024 landscape, no people/animals/text · clinic-v1 "Rules on every image" (A/E)

**Padding and export format**
- Trim to the item's own bounding box, then pad 16 px transparent on every side · Art Bible §5 Export (A)
- WebP with alpha in `assets/`; lossless for hands and fine edges, quality ~90 otherwise · Art Bible §5 Export (A)
- Clean alpha: no coloured fringe (check on black), halos, clipped edges, stray pixels; check on both black and white backing and on cream · Art Bible §10 check 7 and intro (E/A)
- Cut method: background measured from the outer 6 px median; cells from gutters; largest piece kept; holes filled; colour-to-alpha edges; glass-only pixels also colour-to-alpha; no grey ring · pantry-jars "Cutting the sheets" (A)
- Legacy magenta cut: hard key, whole blobs by centroid, 2 px erode, binary alpha, black-and-white contact sheet per category · Asset Naming Convention "Slicing method" (A)
- Never key magenta out of steel, brass, glass, glowing or wispy items; glass and steam come from native transparency or grey · Art Bible §5 (E)
- Food on `#FF00FF`; steel, glass, wood, tools, characters, badges on `#808080`; no shadows or floor on those grounds · batch2 §0.1, batch3 §0.1 (E/A)
- Pivots recorded as normalised `[x, y]` (0–1 from top-left) per sprite type · Art Bible §5 Pivots (A)
- Receiving containers have back and front layers · Art Bible §5 Containers (E)
- Sprites carry no cast shadow (code draws a soft multiply ellipse offset down-right) unless cut in place, then the shadow is its own layer · Art Bible §2 Shadow rules (E)
- Ambient motion: 2–4 moving things per scene, none near a tap target, off with reduce-motion · Asset Building Plan §4 (E)

**Naming**
- Source sheets: `sheet-<category>-v<N>.png`, `char-<name>-v<N>.png`, `bg-<scene>-v<N>.png`, kept in `sources/` · Asset Naming Convention "Source sheets" (A)
- Sliced item files named by content-master id: `items/<category>/<id>.png` (`fru-01`…`spi-16`) · Asset Naming Convention "Sliced, game-ready files" (A)
- Character states `characters/<name>/<name>-neutral|talking|happy.png` · Asset Naming Convention (A)
- Items not yet in the master: `item-<slug>.png`, `thread-<colour>.png`, `sweet-<slug>.png`; props `assets/props/<slug>.png` · Asset Naming Convention (A)
- Game art `<item>-<view>-<state>` (e.g. `onion-t-chopped.webp`, `milk-jug-f.webp`, `hand-b1-t-girl.webp`) · Art Bible §5 Export (A) (marked provisional)
- Pantry: `shelf-<id>-f.webp` (labelled), `shelf-<id>-bare-f.webp`, `icon-<id>.webp`, `sticker-blank.webp`; background `bg-pantry-v3-1600.webp` · pantry-jars "Putting the labels on", "Status" (A)
- Uploads go to `sources/art/<pack>/` (e.g. `cook-v3`, `clinic-v2/items`, `chai-station`, `pantry-v2`), "save as" names exactly · packs' step 4; art-run-tonight "SAVING" (A)
- Approved characters: `char-nani-v2.png` (not v1) for Nani edits · batch2 §0.1 (A)

**Look (by eye, listed so the QA checklist can absorb them)**
- One camera per scene; T sprites in E scenes (and the reverse) rejected; no ¾ views; circles not ovals in T · Art Bible §10 check 1 (E)
- Everything touching a surface has a contact shadow; nothing floats · Art Bible §10 check 2 (E)
- Light from upper left, shadows lower right, no second light · Art Bible §10 check 8, §2 Light (E)
- No doubled surfaces (board on board, baked item plus its sprite) · Art Bible §10 check 4 (E)
- Tap target obvious, not covered by a cat, hand or decoration · Art Bible §10 check 5 (E)
- Timing cue where the eye already is (no gauge floating on the hob) · Art Bible §10 check 6 (E)
- No text, letters, numbers, logos or watermarks, including on bunting, tins, packaging · Art Bible §1 Don't, §10 check 12 (E)
- Style holds: no outlines, cel shading, photographic textures, clip-art shine, blur · Art Bible §10 check 9 (E)
- Character consistent with the sheet; sleeve consistent with the master · Art Bible §10 checks 10–11 (E)
- Finger count: five per hand, counted and written down per hand; counting frames raise exactly 1–5 · Art Bible §10 check 14 (E/A)
- Hand camera/light/skin match the reference; tool gaps clean (no tool drawn in the hand, no sliced finger) · Art Bible §10 checks 16–17 (E)
- Hand skin near mid `#C49A78`, not orange (sampled hex) · Art Bible §2 (A)
- Cultural accuracy: no bindi/tilak/sindoor/deities; halal; modest clothing · Art Bible §10 "Cultural accuracy" (E)
- At most 1–2 cultural nods per scene · Art Bible §1 (E)
- Reds kept out of the background behind Nani; tappables most saturated · Art Bible §2 Rules (E)
- Edits of an approved image must differ from it, with head, hands and counter edge unmoved · art-run-tonight "FOR EACH PROMPT" 4 and batch3-cook §0.1 (E/A by image diff)
- Relights differ from the day image and nothing moved, grew or appeared · batch3 §8 check (E/A by diff)
- Registration: states of one object identical in size and position on every cell · chai-station, results-badges (A)
- Pantry cut checked on cream, zoomed: no grey fringe, no ring, no holes (water bottle especially) · pantry-jars "Cutting the sheets" (E)
- Runner pace and limits (about 1 image a minute, 3 at once; redo at most once per step in tonight's run, at most two retries in later packs) · art-run-tonight, cook-v3 step 3 (process, not art)
- Cost cap: any paid API work under $2, `quality` set explicitly, medium default · rules D2; Asset Building Plan §1.4 ("over $5 needs `--yes`" is older) (A: `build/gen_assets.py`)
