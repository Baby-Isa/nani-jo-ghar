# S05 open-row triage

Source: `docs/process/regressions.md` (open or reopened rows), 13 Oct 2026. Each row is placed by its newest note, then the S05 plan, S05 log and decisions 88-95. Where the newest note is older than T2's final report (`build/reports/s05t2-probes.md`), the report is cited.

**Counts:** FIX NOW 35 · MUM 7 · ART 17 · ZAFAR 5 · LATER 4 · **Total 68**

## FIX NOW

Most are tool or record fixes (S). Rows saying 'Mark built' have a green T2 run and need only the row updated.

| ID | What's wrong | Why this bucket | Owner area | Size |
|---|---|---|---|---|
| SH-03 | Word review layout; probe lexicon flags the English gloss ('three, cardamom') | Layout PASS (S05-S). The gloss stays by decision (F14, 12 Oct), so the probe is wrong: make the lexicon expect skip glosses, then mark built | tools build/tools | S |
| SH-13 | Counting along by level; probe failed at L3 because a fresh save writes the number | Decision 57 says a number is written the first times heard; T2 final run shows PASS. Confirm and mark built | tools build/tools | S |
| SH-15 | Count badge shows the running tally | Tally now word/dots by D6; T2 final run PASS. Mark built | tools build/tools | S |
| SH-69 | Name shown and heard only on first meeting; first-launch bubble had written English | English bubble now a tagged to-record line (decision 84); sheet ev-s05b-g3 still to judge. Flat child figure beside photoreal Nani is art (see Unsure) | Cook js/cook | S |
| SH-19 | First-time help in every phase; samosa ghost finger flickers between runs | Game fault: samosa uses Cook's own coach finger, not the shared ghost (S05-F task 3) | Cook js/cook + shared js/shared | M |
| SH-58 | Lone ✓ glows in the first plays | Cook now glows it at once (C2); T2 final run lists PASS. Re-run once at chai and daar L1, then mark built | Cook js/cook | S |
| SH-66 | No voice carries over after a stage or game end | Clinic half green (D); T2 final run PASS with the window bound. Mark built | tools build/tools | S |
| SH-33 | Items sized by width/height; check_vessel_meta.py exited 1 | T2 final run PASS (scipy installed, meta keys updated). Mark built | tools build/tools | S |
| SH-41 | Bulb opens a closed card in English for 8 s | Cook 7753 ms and clinic 8181 ms PASS (T2); left is the probe's !lexicon on the aliases. Mark built | tools build/tools | S |
| PAN-02 | Spoken lines were fragments; probe flags plural 'chunda' | T2 final run PASS. The list connector 'with' is Mum's gap, tracked in LNG-04. Mark built | tools build/tools | S |
| CHAI-06 | Pans centred, no flame on empty burner (vessel meta probe) | check_vessel_meta.py PASS in T2's final run. Mark built | tools build/tools | S |
| CHAI-15 | Everyone who orders comes in first | T2 final run PASS; the L3 pop-up writing every row is fixed (SH-72). Mark built | tools build/tools | S |
| MAA-08 | Count badge/plate not clipped; zoom capture is under the end card | Probe fault: capture before results | tools build/sandbox | S |
| MAA-10 | Maani lands on the thali's flat area (vessel meta probe) | check_vessel_meta.py PASS in T2's final run. Mark built | tools build/tools | S |
| SAM-02 | Samosa ingredients are bare top-down heaps | Probe plays the legacy cook:fill lab; point it at cook:samosa | tools build/tools | S |
| SAM-08 | Frying area: one wide burner, bigger karahi | Probe plays the legacy cook:fry lab; point it at cook:samosa | tools build/tools | S |
| SAM-10 | Filling reads as filling; fry layout centred | Probe catches the fold late and the legacy fry lab; capture at the fill, point at cook:samosa. If it still fails, the fill art is the game's | tools build/tools | S |
| SEK-07 | Plate skewers straight, parallel, plate lines up with grill | Capture is under the end card; capture at stage-end. L4 bot stalled once (rack tap off screen) | tools build/sandbox | S |
| SEK-11 | Spoken order: each mixed skewer's sequence follows at once | Sequence works; the plain skewer ('one onion') was never spoken in the L4 sample, and 'with' is English until Mum records it. Check the plain-skewer line, judge the sheet | words js/cook/order.js + judge | M |
| SEK-13 | Card ticks each piece of a mixed skewer | Bot threads the tameto skewers first and the 8-frame cap never reaches the mixed one; raise the cap to 16 | tools build/tools | S |
| CK-02 | Hobs straight, one family (vessel meta probe) | check_vessel_meta.py PASS in T2's final run. Mark built | tools build/tools | S |
| CK-09 | One dark-walnut chakla and velan | Probe plays the legacy cook:roll lab; point at cook:maani-line. Legacy Roll tile moved to painted art in C2 | tools build/tools | S |
| CK-12 | Pot/pan contents inside the rim (vessel meta probe) | check_vessel_meta.py PASS in T2's final run (needs bg_align spec args for CK-12/MOD-01 noted earlier). Mark built | tools build/tools | S |
| CK-20 | Things sit on the flat inner area (vessel meta probe) | check_vessel_meta.py PASS in T2's final run. Mark built | tools build/tools | S |
| CLN-111 | Clinic end offers Again and All patients | Shared .rs-again built (S2); morning end PASS with 3 buttons (T2, ev-20261013-012257-dgq). Mark built | tools build/tools | S |
| CLN-11 | People sit on one six-seat bench | Spec counted a retired element; T2 final run PASS. Mark built | tools build/tools | S |
| CLN-117 | Send-off E4: doctor cues 'how do you feel?', no English | Pills now tagged to-record; the E4 driver plays and passes (T2). Mark built | tools build/tools | S |
| CLN-45 | Every heal game's ladder adds one thing per level | Probe fault: the pop-up folds before the dom capture. Also cut L2 to L3 changes several things at once (S04 evidence): check the cut ladder, then the other eight games | clinic js/clinic + tools build/tools | M |
| CLN-48 | Knee wrap: one dot lit at a time | Game holds correctly (measured on a direct page); probe fires before the bandage is picked. T2 final run PASS. Mark built | tools build/tools | S |
| CLN-65 | Patient hot/cold/happy/sad/pain states from one body | Plan class TOOL: the probe never reaches the states (fan strip caught the results card). Respecify the probe first; other patients' bodies wait for art (see Unsure) | tools build/tools | M |
| CLN-122 | Knee close-up framing judged at play size | Answered: decision 83 and S05 small decision 3 keep the framing as is. Close in regressions.md and decisions; no code | docs only | S |
| MOD-01 | Find it relights are relights | bg_align_check.py needed spec args; T2 final run PASS. Mark built | tools build/tools | S |
| ART-12 | Clinic 7.1 'where it hurts' has neck, back, hair parts | Plan class TOOL: the probe shows the hair game, not 7.1. Respecify the probe to reach 7.1; judge the picture | tools build/tools | S |
| ART-18 | Talk bob a third of before, one shared animation | Probe can't tell Nani speaking from breathing; S05-F task 5: put the speaker in the sound hook and trace only her talk (clinic already PASS, Cook talk measured at about 0.8 px) | shared js/shared + tools build/tools | M |
| LNG-02 | Can you win without the Kutchi? (leak.mjs clinic) | Cook PASS; clinic taste L1 10.3% is sampling noise on 1/3 x 1/4 = 8.3%. T2 final run PASS. Mark built | tools build/tools | S |

## MUM

| ID | What's wrong | Why this bucket |
|---|---|---|
| PAN-10 | Pantry wording 'Muke de' + items; 'Muke chai lai de' | Waits on Mum's Round 5 (decision 83); no Kutchi invented. One-at-a-time guidance build is on top (see Unsure) |
| CLN-119 | Each heal game teaches its own language strand (colours, body parts, up/down) | Plaster colours (yellow, blue), cloth, dabs, up/down are English placeholders until Mum records them |
| LNG-01 | No English instruction text or audio for the child | Probe now fails only on silent placeholder lines (22 of 22 'not family-ok') and the 'tomatoes' plural; Mum records the silent lines (plan class MUM) |
| LNG-04 | English placeholders waiting for Mum: 'with' join, ph-turner, sekelo, plaster line | Mum's Round 5 list |
| LNG-06 | No device voice in shipped audio | familyOnly fails only on silent to-record lines (decision 84); Mum records |
| LNG-10 | 'Thank you' and 'oh dear' recorded; arre re out | familyOnly fails only on silent/unchecked lines; Mum records |
| LNG-11 | 'Muke de', 'Muke chai lai de' checked with Mum | Not yet asked/confirmed; Round 5 |

## ART

| ID | What's wrong | Why this bucket |
|---|---|---|
| CHAI-13 | Real teaspoon for the sugar stir | Teaspoon is in art part G (not drawn yet) |
| DAAR-02 | Ladle is a real kadchi seen top-down | Kadchi art in part G; the turning-ladle code (decision 94) is already built |
| DAAR-07 | Chopped onion/tomato/chilli in a container, not loose piles | Decision 90 answered it: a side-on bowl, one image in part G |
| SEK-14 | Rack and plate as pre-rendered pictures with 1-4 skewers | Decision 79: drawn in s05 art run part C (SK2) |
| CLN-01 | Real art instead of stand-ins | Doctor and guide-box doctor still flat stand-ins; four emoji-style feeling faces; part B (doctor, needs his photos) and part C |
| CLN-81 | Girl's finished art across the whole story | The girl is done; the doctor is the flat stand-in in diagnosis and send-off: part B |
| CLN-115 | Door call from the half-open door, doctor leaning out | Decision 83: built when the doctor's s05 art lands (part B) |
| CLN-17 | Patient on bed edge, doctor beside, three-quarter turned | Doctor is a flat placeholder: part B (certificate frame is CLN-116) |
| CLN-25 | Patient leaving with door half open, doctor beside | Send-off waits for her standing and leaving poses (parts D and E) |
| CLN-37 | Boing: dispenser of 3-4 coloured tubes, lever, blobs | Drop machine is a stand-in: part C (DM1-DM2) |
| CLN-38 | Eye chart draws household nouns, not only food | Engine has the nouns (cup, chair, door...) but no item pictures; household item pictures needed (art), recordings unchecked |
| CLN-106 | Boing: alcohol wipe motion, jab, plaster choice | Drop machine and arm are stand-ins: part C; wipe motion rides on the new art |
| ART-05 | Backgrounds at full resolution | Clinic pages 0 breaks; one left, Cook's chai marble worktop at 1.59 px/px: needs a higher-resolution picture |
| ART-10 | Nani has four cooking moods; Nana/Ma/Ali impatient faces | Part A (Nani) and the family faces: new art |
| ART-11 | Potato cube does not read as butter | Potato cube in part G |
| ART-19 | Speaking characters blink, mouth shapes, breathing, pose set | Needs blink and mouth frames: parts A and C (N3, N5, GB1, GM1) |
| ART-20 | Item/view table and sprite sheets for every clinic item | Belt's tilted plaster and comb need sheets: part F (conditional). The item table in clinic.md is a docs task Claude can do now |

## ZAFAR

| ID | What's wrong | Why this bucket |
|---|---|---|
| CHAI-01 | Chai station is 'a bit boring'; waits for the fun pass | Needs his ear and play; no decision yet |
| CK-01 | Levels 2-4 of every station not yet played by Zafar | His play pass |
| CLN-116 | Doctor's certificate photo in the exam-room frame | Waits on the photo from Zafar |
| LNG-08 | Family voices sound clean: clean-up pass, a mic | Pending decision, his ear |
| LNG-12 | Clip candidates say only the target word | His ear when picking clips |

## LATER

| ID | What's wrong | Why this bucket |
|---|---|---|
| CK-TAB-01 | Cook play items grow to use a 4:3 tablet screen | Moved to Sprint 6 (S05 small decision 2) |
| CLN-14 | 'Call them in' card is a round face with no text | Decision 74: waits for the other patients' art; plan lists it OBSOLETE/WONT (see Unsure) |
| CLN-41 | Tummy, hic and hair still on the old help | Parked games; probe obsolete (plan OBSOLETE/WONT) |
| MOD-02 | Find it sitting room 3.2: sofa too high | Find it is parked (decision 38); plan OBSOLETE/WONT |

## Unsure

- **SH-69**: Marked FIX NOW (judge the sheet). The flat vector child beside the photoreal Nani is art if it still shows.
- **SEK-11**: FIX NOW for the unspoken plain skewer, but 'with' is Mum's gap; part of it may end up MUM.
- **CLN-45**: The probe fault is certain; whether cut L2 to L3 really changes several things is a design call that may need Zafar.
- **CLN-65**: Probe respec is FIX NOW; the other patients' bodies and the blanket/bottle states may need art.
- **CLN-14**: LATER by decision 74, but the S04 evidence shows written English 'Bring in man' at L1. If that is not a grey to-record line, it is a game fault (words js/clinic/lang.js).
- **PAN-10**: Waits on Mum's wording; the one-at-a-time guidance and folding box are still unbuilt and could be coded after Mum answers.
- **LNG-01**: MUM for the silent lines; the 'tomatoes' plural and the bulb-English tag are tool/engine items.
- **CLN-116**: A grey placeholder frame could be coded now, but decision 84 removed visible flags, so left with Zafar.
- **ART-20**: The clinic.md item/view table is a docs job Claude could do now; sprite sheets stay ART.
- **All 'Mark built' rows**: The row text was last edited before T2's final report (build/reports/s05t2-probes.md); the pass is from that report and the row's last run id should be cited when closing. S05-F re-runs only six rows, so a quick evidence re-run of these is worthwhile before marking built.
