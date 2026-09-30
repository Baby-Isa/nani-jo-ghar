# Regression list

Every piece of feedback Zafar has given, plus every defect found since, so that a fixed issue stays fixed (top rule 3). One row per issue; the same issue reported in several documents is one row.
**How to use it:** filter by the screens your change touches and recheck every row there, at the size or state named in the Check column. A row that fails again becomes **reopened** and is reported to Zafar first, before any fix.
**How to add rows:** every new feedback item gets a row the day it arrives, in the right section, with the next free ID (IDs are stable: never reuse or renumber). Use the original document as the Source, not a handover summary.
**Status:** **open** (not fixed) · **reopened** (was fixed, failed again) · **built, not re-played** (the builder says fixed; Zafar has not confirmed it in play; true of everything from 29 Sept onward unless noted) · **fixed** (confirmed, or superseded by a later rebuild and checked). "open (unverified)" means the fix status was never recorded: recheck it and move it to fixed or open.
**Check:** **auto: <script>** means a script covers it; **eye: <size/state>** means a screenshot review at that size or state. "auto planned" means the checklist line exists but the script does not yet. Checklist IDs are in `docs/process/qa-checklist.md`; rule IDs in `docs/process/rules.md`.
Paths are as of 30 Sept 2026 (before the docs tidy); `R-x` means `build/reports/x.md`. Keep (liked) items and retired items are at the end.

## Shared components

### End screen and word review

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-01 | **KNOWN BUG.** Shared end-screen word tile overflows its box (*fudino ji chutney*); overflows on phone at level 4 | **open** | eye: 390×844 L4 · TXT-01 (auto planned) | `docs/UX-PRINCIPLES.md` §15; `docs/NEXT-CHAT-START.md` §5 |
| SH-02 | **KNOWN BUG.** Results card writes *hakro* where the order said *hakri* (also *hakri lakri* in sekelo) | **open** | eye: 390×844 L4 · LNG-06 | `docs/UX-PRINCIPLES.md` §15; `build/reports/sekelo-v3.md` §6; `docs/NEXT-CHAT-START.md` §5 |
| SH-03 | Word review vertically centred and balanced in its card; even border and shadow; right on the right (gold), wrong on the left (red); widths proportional | fixed | eye: 1366×768 · CMP-13 | `docs/cook-ui-feedback-2026-09-28.md` §6; `docs/design/cook-design-system-v1.md` §10 (late) |
| SH-04 | End-of-round badges clean on cream: no grey fringes, holes, mismatched sizes or wrong fill (took five rounds) | fixed | eye: ×2 zoom on cream · CMP-12; auto: `build/test_shared_ui.mjs` | `docs/ORCHESTRATOR-HANDOFF.md` (Lesson, 28 Sept); `docs/VISUAL-QA.md` intro |
| SH-05 | End screen shows the new badges; no old drawn badges, and no old "Cook with Nani" menu card behind the end pop-up | fixed | eye: after hard refresh · CMP-11 | `docs/cook-ui-feedback-2026-09-28.md` §7; `docs/design/cook-design-system-v1.md` §10 (late) |
| SH-06 | Result cards show whole-number percentages and labelled lines | fixed | eye: 1366×768 | `docs/cook-with-nani-todo.md` Wave 1 |

### Order cards

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-07 | One white card per person: face, headline, stacked rows; no name label, no scroll bar, no intro line such as "Nani laide" | fixed | eye: 1366×768 · CMP-07 | `docs/cook-ui-feedback-2026-09-28.md` §2; `docs/ideas-2026-09-28-arcs-and-focus.md` §5 |
| SH-08 | Card order equals spoken order (Nani reads top to bottom, not sugar, milk, flour) | built, not re-played | auto: `build/test_cook.py` order-card tests; eye: ear · CMP-08 | `docs/feedback/cook-playtest-2026-09-29.md` P4, X1 |
| SH-09 | Card rows stay on one line, shrunk to fit; headlines shrink first, then wrap (rule F7, 30 Sept, replaces "nothing wraps"); never clipped (pantry failed again: see PAN-01) | fixed | eye: 390×844 · TXT-02 (auto planned) | `docs/cook-ui-feedback-2026-09-28.md` §9; `docs/NEXT-CHAT-START.md` §2 |
| SH-10 | Rows tick or count up as items go in (chai bug, tooth three taps, clinic rows); level-1 counts for fever, foot, drinks, boing judged in play | built, not re-played | auto: `build/test_cook.py` tick check; eye: L1 · CMP-09 | `docs/cook-ui-feedback-2026-09-28.md` §10; `docs/feedback/clinic-playtest-2026-09-29.md` G6 |
| SH-11 | No early ticks or folds: samosa card ticked after filling while still frying, daar Nana's tick during the stir, "don't" row gold mid-dish; samosa headline cut to "Muke ba samosa …" | built, not re-played | auto: order-card node tests; eye: samosa, daar · CMP-09, TXT-01 | `docs/overnight-log.md` 03:07; `docs/overnight-queue.md` notes |
| SH-12 | Items with no word at higher levels keep a speaker-only chip of the same size and position | fixed | eye: L3–L4 · CMP-08 | `docs/cook-ui-feedback-2026-09-28.md` §10 |
| SH-13 | Counting along is consistent: L1 written and counted aloud, L2 written, L3+ heard | built, not re-played | eye: L1–L4 · INT-10 | `docs/feedback/cook-playtest-2026-09-29.md` X12, Q7 |
| SH-14 | Item labels do not overlap with more than five items; look-alike bowls are labelled | fixed | eye: 1366×768 | `docs/cook-with-nani-todo.md` Wave 1 |
| SH-15 | Count badges show the running tally, not the target | fixed | eye: each station | `docs/cook-with-nani-todo.md` Wave 1 |
| SH-16 | Speaker icon sits inside the face circle and is tappable everywhere (cards, pop-up, guide box, hob faces); face = replay; no per-line speaker, translate or eye buttons | built, not re-played | eye: 390×844 · INT-01 | `docs/UX-PRINCIPLES.md` §4; `docs/feedback/cook-playtest-2026-09-29.md` X3 |
| SH-17 | Read-along underline wherever a line is spoken | built, not re-played | eye: each spoken line · TXT-08 | `docs/feedback/cook-playtest-2026-09-29.md` X2 |

### Onboarding and help

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-18 | Not overwhelming at the start: smallest possible first round, one card, one bulb, silence first, help behind "?" | fixed | eye: 390×844 L1 · INT-04 | `docs/UX-PRINCIPLES.md` intro (25 Sept); `docs/modes/wave5a-brief.md` |
| SH-19 | First-time help in every phase of every station (dim all but one thing, ghost finger once); none missing (samosa, daar) | built, not re-played | auto: `build/check_onboard.mjs` · INT-04 | `docs/UX-PRINCIPLES.md` §8; `docs/feedback/cook-playtest-2026-09-29.md` X11, S4 |
| SH-20 | Input is live from the start; nothing waits for spoken instructions to finish | built, not re-played | eye: ear, tap during speech · INT-01 | `docs/feedback/clinic-playtest-2026-09-29.md` §13i |
| SH-21 | No grown-up skip button visible in play; it lives behind "?" | built, not re-played | eye: 390×844 · INT-04 | `docs/feedback/clinic-playtest-2026-09-29.md` G7, CQ15 |
| SH-22 | Guide box (Nani, doctor) in every mode: sage not red, top of the sidebar, mute and replay, bulb in her row | fixed | eye: 1366×768 · CMP-06 | `docs/cook-ui-feedback-2026-09-28.md` §3, §10 |

### Buttons and sidebar

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-23 | One shared button kit: Done, Next, "Found it", "to the grill", "to the bench" look the same in every mode, are not cut off by the frame, and are hidden until usable, never greyed | built, not re-played | eye: 390×844 and 1366×768 · CMP-02, CMP-03 | `docs/playtest-2026-09-23.md` §1 #16; `docs/UX-PRINCIPLES.md` §15; `docs/feedback/clinic-playtest-2026-09-29.md` §13b |
| SH-24 | Sidebar is a docked column, never a floating panel over the game | fixed | eye: 390×844 · LAY-05 | `docs/sidebar-design.md` §5 |
| SH-25 | Sidebar has no horizontal scroll, words do not break letter by letter at 1024×768, a long order card does not push the goal below the fold | built, not re-played | auto: `build/test_cook.py` sidebar · LAY-02 | `docs/cook-with-nani-todo.md` Wave 1, Wave 4 (builder) |
| SH-26 | Sidebar looks designed: no old three badge icons on the recipe card, not plain | fixed | eye: 1366×768 · CMP-05 | `docs/playtest-2026-09-23.md` §7; `docs/cook-ui-feedback-2026-09-28.md` §2 |
| SH-27 | Phone sidebar buttons (speaker, translate, eye) are 22 px, too small; goal box capped at about four lines | open (unverified) | eye: 390×844, 915×375 · LAY-04 | `docs/cook-with-nani-build-log.md` §9 (builder) |

### Layout and stage

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-28 | **KNOWN BUG.** Chip words on phone are tiny | **open** | eye: 390×844 · TXT-05 (auto planned) | `docs/NEXT-CHAT-START.md` §5 |
| SH-29 | Stage fills the screen: no black bars, no dead cream band above the counter | fixed | eye: 1440×900, wide, tall · LAY-01; auto: `build/test_e2e.py` | `docs/playtest-2026-09-23.md` §1, README; `docs/overnight-log.md` 29 Sept |
| SH-30 | At 16:10 (1440×900, 1280×800) the sidebar never hides a tappable item or becomes an undismissable drawer | fixed | auto: `build/test_e2e.py` six viewports · LAY-02 | `docs/playtest-2026-09-23.md` §1 #1 |
| SH-31 | Nothing on the page covers a tappable item | fixed | auto: `build/test_cook.py` topmost-element check · LAY-06 | `docs/Nani jo Ghar — Roadmap and Story Structure.md` Lessons 2 |
| SH-32 | Collected things are visible where they go (no invisible counters) | open (unverified) | eye: each station | `docs/Nani jo Ghar — Roadmap and Story Structure.md` Lessons 3 |
| SH-33 | Items are sized by width and height, never overflow their box | open (unverified) | auto: `build/check_vessel_meta.py`; eye | `docs/playtest-2026-09-23.md` §1 #9; Roadmap Lessons 4 |
| SH-34 | Shelf band: equal padding top and bottom, bounce and glow stay inside, water bottle does not touch the top, room above dough containers | built, not re-played | eye: 1366×768 · LAY-07 | `docs/feedback/cook-playtest-2026-09-29.md` X7, C2, M9 |
| SH-35 | Shelf items at true relative heights; enough gap between cooking area and shelf | open (unverified) | eye: 1366×768 · LAY-07 | `docs/design/cook-design-system-v1.md` §10 (late) |
| SH-36 | One line of text beside a character icon is centred on the icon | open (unverified) | eye: collapsed cards · TXT-09 | `docs/design/cook-design-system-v1.md` §10 (late) |
| SH-37 | Cook screens have one focal thing; UI and world look like one product; identical shelf slots; design tokens only | built, not re-played | eye: 1366×768 · CMP-10, CMP-04 | `docs/design/cook-design-system-v1.md` §1.1–1.4 |

## Cook: pantry

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| PAN-01 | **KNOWN BUG.** "Bring me these" headline clipped ("these" cut) and the growing highlighted row / gold done-outline clipped at the card edges (re-found 30 Sept 18:00 UK) | **reopened** | eye: 390×844 and 1366×768, each fetched row · TXT-01, TXT-04 (auto planned) | `docs/feedback/cook-playtest-2026-09-29.md` P3, P2; `docs/NEXT-CHAT-START.md` §2 |
| PAN-02 | **KNOWN BUG.** Spoken and written lines are fragments with no verb (*khun, ne daar, ne dudh*; "I want tea and milk. I want tea with two sugars…"); want one natural sentence per person, in every station. Needs the language engine | **open** | eye/ear: every order sentence · LNG-03 | `docs/feedback/cook-playtest-2026-09-29.md` X1; `docs/NEXT-CHAT-START.md` §2 |
| PAN-03 | Headline says "bring me these for {dish}", not "Muke dudh de." over atto with chai below (reads as if milk were a different kind of thing); Kutchi line still to record | fixed | eye: pantry card · LNG-04 | `docs/cook-ui-feedback-2026-09-28.md` §1 |
| PAN-04 | Counting voice and Nani's "next thing" line do not overlap (one speech queue per station) | built, not re-played | eye: ear | `docs/feedback/cook-playtest-2026-09-29.md` P1 |
| PAN-05 | Pantry is fetched first, the first time each dish is made that day, story mode only | built, not re-played | eye: story mode | `docs/feedback/cook-playtest-2026-09-29.md` X13, T4 |
| PAN-06 | Shelves side-on, not top-down bowls; clear labelled jars; meat in a fridge section; no generic metal jugs; three to four full shelves; nothing floating | fixed | eye: 1366×768 · ART-03 | `docs/cook-with-nani-phase-a-design.md` §2; `docs/cook-ui-feedback-2026-09-28.md` §4 |
| PAN-07 | Basket is a tray with outlined spaces; front edge drawn over what sits on it; outline fades as the item lands; tally at most three across; pass-me pop-up side-on | fixed | eye: 1366×768 | `docs/cook-ui-feedback-2026-09-28.md` §4; `docs/chatgpt-art-prompts-pantry-jars.md` Status |
| PAN-08 | "Next item" ring centred on the item (glow and bounce of the item itself) | fixed | eye: 1366×768 · CMP-10 | `docs/cook-ui-feedback-2026-09-28.md` §4 |
| PAN-09 | Jar labels read at phone size: colour reads better than label; white-on-cream icons (salt) vanish | open | eye: 390×844 | `docs/chatgpt-art-prompts-pantry-jars.md` Status |

## Cook: chai

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHAI-01 | Chai station is "a bit boring"; it is the second thing every new player sees (waits for the fun pass) | open | eye: first play | `docs/cook-with-nani-todo.md` (From Zafar, 26 Sept); `docs/first-launch-story.md` (concern) |
| CHAI-02 | Layout: hob and tray do not overlap; top-down ingredient row; real liquid, not a flat blue disc; pour animation; knobs wired; no fill-line relic on glass or pot | fixed | eye: 1366×768 | `docs/cook-ui-feedback-2026-09-28.md` §8 |
| CHAI-03 | Pour is tap-to-measure, never press-and-hold | fixed | eye: pour · INT-01 | `docs/UX-PRINCIPLES.md` §12; `docs/cook-with-nani-phase-a-design.md` Q0 |
| CHAI-04 | Everything is made in the pan, not partly in the glass; one card per person | built, not re-played | eye: 1366×768 | `docs/design/cook-design-system-v1.md` §1.5 |
| CHAI-05 | Sentence: *Muke aadu waari chai khape*, extras first, then *dudh*, *ba khun*; ginger phrase not last and not repeating *chai* | built, not re-played | eye/ear: orders · LNG-03 | `docs/feedback/cook-playtest-2026-09-29.md` C5 |
| CHAI-06 | Pans centred on burners; no flame on a burner whose pan is away; gauge on the rim; boiling state shot in QA | built, not re-played | auto: `build/check_vessel_meta.py` · LAY-10; eye: boiling state | `docs/VISUAL-QA.md` §5; `docs/feedback/cook-playtest-2026-09-29.md` §4 |
| CHAI-07 | Black-tea glass and tipped-pan art still open | open | eye: black-tea state | `docs/feedback/cook-playtest-2026-09-29.md` C8 |
| CHAI-08 | v2 mock-up fixes: hob and tray about 15% bigger and lower, pans true top-down, tilted pan for the pour, real top-down glasses and liquids | open (unverified) | eye: 1366×768 | `docs/design/cook-design-system-v1.md` §10 |
| CHAI-09 | No leftover "1 1" tally at serving (orchestrator) | fixed | eye: serve state | `docs/overnight-log.md` 01:34–03:40 (orchestrator) |

## Cook: maani

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| MAA-01 | Maani card headline still repeats its row over *hakri maani* | open | eye: maani card · CMP-07 | `docs/feedback/cook-playtest-2026-09-29.md` X12 ("left open") |
| MAA-02 | Sentence is *Muke hakri bajr ji maani khape*, no spare "Ne" | built, not re-played | eye/ear: orders | `docs/feedback/cook-playtest-2026-09-29.md` M1 |
| MAA-03 | Flames peek top, bottom and sides of the tawa: wide single burner, ring on the rim | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` M2, M7 |
| MAA-04 | Dough: two realistic piles, one tap sends one ball; ball goes back if you change your mind; no tray (question: can a pile run out?) | built, not re-played | eye: dough shelf | `docs/feedback/cook-playtest-2026-09-29.md` M3, Q14 |
| MAA-05 | Cooked maani is flat (raw, half, cooked, burnt), never puffed like a poori | built, not re-played | eye: each state | `docs/feedback/cook-playtest-2026-09-29.md` M5 |
| MAA-06 | Turner is a flat wooden turner, not "weird tweezers" | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` M6, Q15 |
| MAA-07 | Tawa is high-resolution, not a 400 px upscale | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` M8 |
| MAA-08 | Count badge does not overlap the hob; roll-tawa plate not cut off; tick not over the resting spatula (builder) | open (unverified) | eye: 1280×800, 915×375 | `docs/cook-with-nani-todo.md` Wave 4 (builder) |

## Cook: daar

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| DAAR-01 | Swipe chop stays ("there's no game now" when it became tap crate, tap knife) | built, not re-played | auto: `build/test_cook.py`; eye: chop | `docs/feedback/cook-playtest-2026-09-29.md` D1, X15, Q4 |
| DAAR-02 | Ladle: handle not up in the air, reads as a *kadchi*, not a dipper (still a dipper in the latest art) | open | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` D6; `build/reports/art-v3-1.md` R3 |
| DAAR-03 | Stir shows speed and laps (speed dial, laps as Kutchi word) | built, not re-played | eye: stir | `docs/feedback/cook-playtest-2026-09-29.md` D7, Q10 |
| DAAR-04 | Chopped rows reset at the pan and tick as each goes in | built, not re-played | auto: order-card state; eye · CMP-09 | `docs/feedback/cook-playtest-2026-09-29.md` D9 |
| DAAR-05 | Ginger and added things are not white dots; stir turns the pictured contents (review bowl still shows dry chilli and curry leaves) | built, not re-played | eye: each stage | `docs/feedback/cook-playtest-2026-09-29.md` D3, D10 |
| DAAR-06 | Finished daar is photoreal on a small wooden trivet | built, not re-played | eye: serve | `docs/feedback/cook-playtest-2026-09-29.md` D5 |
| DAAR-07 | Pot and chopped-ingredient container are straight top-down | built, not re-played | eye: 1366×768 · ART-03 | `docs/feedback/cook-playtest-2026-09-29.md` D11 |
| DAAR-08 | Chop card writes quantities at every level (open question: should L1 say *ba dungri* only?) | open | eye: L1–L4 · INT-10 | `build/reports/daar-v3.md` (open question) |

## Cook: chaat

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CHT-01 | Quantities are not only heard: card says *ba dungri* at L1 (counting rule) | built, not re-played | eye: L1 · INT-10 | `docs/feedback/cook-playtest-2026-09-29.md` T1 |
| CHT-02 | Ingredient bowls side-on, not three-quarter | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` T2 |
| CHT-03 | Glass bowl fully side-on with layer strips (tomato pot is a recoloured stand-in) | built, not re-played | auto: `build/check_vessel_meta.py` check_chaat; eye | `docs/feedback/cook-playtest-2026-09-29.md` T3, Q2 |
| CHT-04 | Layers read as food, not liquid or flat rectangles; chilli layer not too thick; tidy ingredient grid with chips; no big red digit tally; card shows the order; bowl not huge | built, not re-played | eye: serve and build states | `docs/design/cook-design-system-v1.md` §14; `docs/overnight-log.md` (orchestrator) |
| CHT-05 | Chop timer ring in the shared colours, not the old ones (verify) | built, not re-played | eye: chop phase · CMP-04 | `docs/UX-PRINCIPLES.md` §15 |

## Cook: samosa

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SAM-01 | Spoken order says "with three chillies" (not "and") and lists all ingredients; "with" is still an English placeholder | built, not re-played | eye/ear: orders · LNG-03 | `docs/feedback/cook-playtest-2026-09-29.md` S1 |
| SAM-02 | Ingredients are top-down heaps, no bowls | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` S2, X8 |
| SAM-03 | Base filling (*chundo* or *bataato*) is always a row; one filling per order; base never zero | built, not re-played | auto: order probe (6,000 orders); eye | `docs/feedback/cook-playtest-2026-09-29.md` S3, S18 |
| SAM-04 | Counter shown as you fill, per the counting rule | built, not re-played | eye: L1–L4 · INT-10 | `docs/feedback/cook-playtest-2026-09-29.md` S5 |
| SAM-05 | Fold: fixed fold pictures; first fold does not hide the filling | built, not re-played | eye: each fold | `docs/feedback/cook-playtest-2026-09-29.md` S8, S11, Q3 |
| SAM-06 | Second samosa starts empty when its filling differs from the first | built, not re-played | eye: L3 | `docs/feedback/cook-playtest-2026-09-29.md` S9 |
| SAM-07 | Samosas sit inside the plate's rim | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` S10 |
| SAM-08 | Frying area bigger: wide single burner, bigger karahi that does not cover the knob | built, not re-played | eye: 1366×768 | `docs/feedback/cook-playtest-2026-09-29.md` S19 |
| SAM-09 | Jharo (slotted spoon) goes under the samosas, not over | built, not re-played | eye: fry | `docs/feedback/cook-playtest-2026-09-29.md` S20 |
| SAM-10 | Filling reads as filling, not two dots on the fold line; fry layout centred (orchestrator) | built, not re-played | eye: fold, fry | `docs/overnight-log.md` 01:34–03:40 (orchestrator) |

## Cook: sekelo

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SEK-01 | Headline is *Muke sekelo khape* (was "mishkaki"; mishkaki is the meat cubes); *sekelo* still to confirm with Mum | built, not re-played | eye/ear: card · LNG-04 | `docs/feedback/cook-playtest-2026-09-29.md` K1; `docs/design/cook-design-system-v1.md` §15 |
| SEK-02 | All-new art, not reused old grill, rack, board and skewer; rack does not read as an empty picture frame; frame and skewers look good | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` K2, K7; `docs/overnight-log.md` (orchestrator) |
| SEK-03 | Several skewers get a mini card each; order shown as a little skewer | fixed | eye: L3–L4 · CMP-08 | `docs/cook-ui-feedback-2026-09-28.md` §2, §9 |
| SEK-04 | No bare "boga" skewers; a veg skewer names what is on it, in order | built, not re-played | auto: data check; eye | `docs/feedback/cook-playtest-2026-09-29.md` K4 |
| SEK-05 | No duplicate pick in an order ("tameto, tameto") | fixed | auto: `build/test_cook.py --orders` | `docs/cook-with-nani-todo.md` Wave 1 |
| SEK-06 | Onion and tomato are big and chunky, the same in the bowl and on the skewer, not oversized against the stick | built, not re-played | eye: ×2 zoom | `docs/feedback/cook-playtest-2026-09-29.md` K5; `docs/overnight-log.md` (orchestrator) |
| SEK-07 | Plate skewers drawn close together; skewer handle sits off the plate; plate lines up with grill and rack | open | eye: plate state | `docs/feedback/cook-playtest-2026-09-29.md` K8; `build/reports/sekelo-v3.md` §6 |
| SEK-08 | One job per phase (thread, then grill); no chips on the grill | fixed | eye: each phase | `docs/UX-PRINCIPLES.md` §5, §6 |

## Cook: general

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CK-01 | Levels 2–4 of every station (Cook and clinic) not yet played by Zafar; needs his pass | open | eye: L2–L4 · INT-11 | `docs/feedback/cook-playtest-2026-09-29.md` K11; `docs/feedback/clinic-playtest-2026-09-29.md` G12 |
| CK-02 | Hobs are straight with clean corners and even sides, one family for all burner counts (not composed from one 2-burner picture) | built, not re-played | auto: `build/check_vessel_meta.py` · LAY-10; eye | `docs/feedback/cook-playtest-2026-09-29.md` X5, C3 |
| CK-03 | Knobs big enough, match the face badges; on = glowing ring, no icon | built, not re-played | eye: 390×844 · LAY-04 | `docs/feedback/cook-playtest-2026-09-29.md` X5, C4, Q8 |
| CK-04 | Flames small (peek, never touch neighbours), on whenever the knob is on; heat gauge thicker and readable against them | built, not re-played | eye: 4-pan hob | `docs/feedback/cook-playtest-2026-09-29.md` X6, C9, C10, S21 |
| CK-05 | One camera look per station (no side-on jars with top-down sekelo and three-quarter bowls); straight-down station backgrounds | built, not re-played | eye: each station · ART-03 | `docs/cook-with-nani-phase-a-design.md` §2; `docs/feedback/cook-playtest-2026-09-29.md` X8 |
| CK-06 | Things inside pots and pans look real (chai liquid, daar oil, contents), not white dots or swirling dots | built, not re-played | eye: each cooking state | `docs/feedback/cook-playtest-2026-09-29.md` X9, C8, D2 |
| CK-07 | One review at serve in every station: large round face circle over the dish, happy or frown, no pretend eating or sliding half-body; wrong marks the wrong row | built, not re-played | eye: each station · CMP-13 | `docs/design/cook-design-system-v1.md` §14a; `docs/feedback/cook-playtest-2026-09-29.md` X10, C12, K10 |
| CK-08 | No oil-heating ring (it looks like the timing ring); sizzle means ready | built, not re-played | eye: samosa, daar | `docs/feedback/cook-playtest-2026-09-29.md` S16, Q9 |
| CK-09 | One house chakla: dark walnut, not blown up or low-res; no board drawn on a board | built, not re-played | eye: maani, samosa · ART-03 | `docs/cook-with-nani-phase-a-design.md` §2; `docs/feedback/cook-playtest-2026-09-29.md` M4, S6 |
| CK-10 | Tadka arrow and pulse from small pan to pot; chopped vegetables thrown high enough | fixed | eye: daar | `docs/cook-with-nani-todo.md` Wave 1 |

## Clinic

### Clinic-wide

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-01 | Rough stand-in art made judging hard ("so overwhelmed by how terrible the visuals were"); real art after prototypes | open | eye: each room | `docs/feedback/clinic-playtest-2026-09-29.md` G2 |
| CLN-02 | Backgrounds locked first: six new rooms, heal games have a background, nothing faded; pharmacy straight-on belt (CB4c) still to come | built, not re-played | eye: 1366×768 · ART-03 | `docs/feedback/clinic-playtest-2026-09-29.md` G1; `docs/chatgpt-art-prompts-clinic-v1.md` Round 2 |
| CLN-03 | Clinic uses what Cook learned: shared order card as patient card, guide box, end pop-up, review faces, spacing | built, not re-played | eye: 1366×768 · CMP-01 | `docs/feedback/clinic-playtest-2026-09-29.md` G3 |
| CLN-04 | Language builds up simply (man, woman, boy, girl; old, young; tall, short; colours; "with the baby"); per-child complexity tracker deferred | built, not re-played | eye/ear: waiting room ladder | `docs/feedback/clinic-playtest-2026-09-29.md` G4, W4, CQ2 |
| CLN-05 | No Nani box in the clinic; the doctor fills her role | built, not re-played | eye: sidebar · CMP-06 | `docs/feedback/clinic-playtest-2026-09-29.md` §13f |
| CLN-06 | Each stage clears its own UI: no reply pills from an earlier round left on screen until refresh | built, not re-played | auto: stage-end UI check; eye · INT-03 | `docs/feedback/clinic-playtest-2026-09-29.md` §13f |
| CLN-07 | Lab debug log (bottom left) does not overlap the pills or counter | open (unverified) | eye: lab pages | `docs/feedback/clinic-playtest-2026-09-29.md` §13a–b |
| CLN-08 | Heal-game close-up background blurred more in code so the room never competes; certificate frame blurred to match | open (unverified) | eye: heal games | `docs/modes/clinic-v2-design-sheets.md` §B |
| CLN-09 | Clinic tooth at least 1 cm even zoomed (0.50 cm on iPad); trolley objects about 60 design px on phone; replay timer does not overlap a recast line (builder) | open | auto: `build/check_hotspots.py` · LAY-11 | `docs/clinic-build-log.md` Known gaps (builder) |

### Waiting room

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-10 | Waiting room not too wide, front half not empty floor; something on the wall says "doctor's" | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` W1; `docs/chatgpt-art-prompts-clinic-v1.md` Round 2 |
| CLN-11 | People sit on one large bench (six seats, no armchairs) | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` W2 |
| CLN-12 | Picking the right person: no walking; tick under each person; the picked person rises off the seat | built, not re-played | eye: each level | `docs/feedback/clinic-playtest-2026-09-29.md` W3, §13 |
| CLN-13 | At most six people at every level (changed from 8–12) | built, not re-played | eye: L4 | `docs/feedback/clinic-playtest-2026-09-29.md` W5, §13a |
| CLN-14 | "Call them in" does not leak: card shows a round face with no text; call heard from L3 | built, not re-played | auto: leak bot; eye · LNG-02 | `docs/feedback/clinic-playtest-2026-09-29.md` §13a |
| CLN-15 | L4: pick everyone straight away, judge at the end, ticks show numbers; L5 has the same fixes | built, not re-played | eye: L4, L5 | `docs/feedback/clinic-playtest-2026-09-29.md` §13a, §13f |

### Diagnosis

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-16 | "Found it" and "Next" variant is explained (folded into D1 as level 2) | built, not re-played | eye: L2 | `docs/feedback/clinic-playtest-2026-09-29.md` D2 |
| CLN-17 | Scene: patient sits on the bed edge, doctor beside them three-quarter turned (or stands by an anatomy poster) | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` D3, CQ3 |
| CLN-18 | D3 tools are clear: torch looks like a torch (not a pill), thermometer looks like one, one cue per tool, two tools at L1 | built, not re-played | eye: ×2 zoom | `docs/feedback/clinic-playtest-2026-09-29.md` D5; `docs/modes/clinic-v2-design-sheets.md` D3 |

### Pharmacy

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-19 | Items are not at 45 degrees; the game uses the painted belt, not a code-drawn belt across the top; straight-on belt (CB4c) still to come | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` P1; `docs/modes/clinic-v2-design-sheets.md` §P |
| CLN-20 | Level 3 is harder by faster belt or closer items, not a timer; hard-to-draw "filling" item is a tube | built, not re-played | eye: L3 · INT-08 | `docs/feedback/clinic-playtest-2026-09-29.md` P4, CQ5 |
| CLN-21 | Doctor says "[Bring me] the plaster"; "Muke plaster khape" is a customer's line (English placeholder, to record with Mum) | built, not re-played | eye: pharmacy card · LNG-04 | `docs/feedback/clinic-playtest-2026-09-29.md` §13b |
| CLN-22 | A filled slot loses its dashed outline; a placed item can be put back; first pick is scored | built, not re-played | auto: take-back test; eye · INT-02 | `docs/feedback/clinic-playtest-2026-09-29.md` §13b; `docs/UX-PRINCIPLES.md` §17 |
| CLN-23 | Items sit on the belt (flat base, contact shadow), not floating or tilted | open | eye: ×2 zoom · ART-03 | `docs/feedback/clinic-playtest-2026-09-29.md` §13b |
| CLN-24 | Pharmacy tray feeds the heal game; a wrong pick costs score, nothing greyed out | built, not re-played | eye: pharmacy to heal | `docs/feedback/clinic-playtest-2026-09-29.md` §13 |

### Send-off

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-25 | Patient leaving with door half open, doctor beside; both stand left in the free wall space, not over the green cross sign | built, not re-played | eye: 1366×768 | `docs/feedback/clinic-playtest-2026-09-29.md` E1, §13d |
| CLN-26 | Happy and sad clear without English: thought bubble with four feeling faces (happy, sad, hot, cold); goodbye in the scene from L2 | built, not re-played | eye: L2–L4 | `docs/feedback/clinic-playtest-2026-09-29.md` E2, E4, CQ6, §13d |
| CLN-27 | An apple, never a lolly (also boing's lollipop) | built, not re-played | auto: grep lolly, lollipop · CUL-02 | `docs/feedback/clinic-playtest-2026-09-29.md` E3 |
| CLN-28 | Doctor card does not list every line up front or repeat them; no script card | built, not re-played | eye: L2–L4 · CMP-07 | `docs/feedback/clinic-playtest-2026-09-29.md` §13e; `docs/UX-PRINCIPLES.md` §16 |
| CLN-29 | Send-off L3: help items and reply pills do not sit on top of each other; reply pills only when needed | built, not re-played | eye: L3 · INT-03 | `docs/feedback/clinic-playtest-2026-09-29.md` §13f |

### Heal games

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-30 | Each heal game explains itself with one "why" beat ("why am I clicking on the things?"), no English sentences in bubbles | built, not re-played | auto: `build/check_onboard.mjs` · LNG-01 | `docs/feedback/clinic-playtest-2026-09-29.md` G5, §13g |
| CLN-31 | Fever playable: tray id is thermometer, first-time help does not block taps, fan does not look like the strip; hot and cold to "just right" (Zafar's review pending) | built, not re-played | auto: help-path test; eye | `docs/feedback/clinic-playtest-2026-09-29.md` G8, H-fever |
| CLN-32 | Scrape: not too clicky; plasters in clear colours and order; a plaster can be taken off; sequence on the shared card | built, not re-played | eye: scrape · INT-02 | `docs/feedback/clinic-playtest-2026-09-29.md` H-cut, §13h |
| CLN-33 | Knee: bandage shows on every tap; flashing stops when done; named leg not highlighted at top level; level 3 left and right clear (leak bot blind rate about 25% at L1 accepted) | built, not re-played | auto: leak bot; eye · INT-06 | `docs/feedback/clinic-playtest-2026-09-29.md` H-knee, §13i, §13l |
| CLN-34 | Ear: level 1 not too hard (*wadho* and *nindho* not too early); wax is dragged to a tissue, not tapped; pop-up wax does not vanish by itself | built, not re-played | eye: L1 | `docs/feedback/clinic-playtest-2026-09-29.md` §13j |
| CLN-35 | Tooth: brushing clear; no confusing bug; voice-overs, input live and sidebar work | built, not re-played | eye: tooth | `docs/feedback/clinic-playtest-2026-09-29.md` H-tooth, §13k |
| CLN-36 | Taste game is understandable (soothing drinks redesign) | built, not re-played | eye: drinks | `docs/feedback/clinic-playtest-2026-09-29.md` H-taste |
| CLN-37 | Boing: plaster part clear; apple not lollipop; coloured beads idea | built, not re-played | eye: boing | `docs/feedback/clinic-playtest-2026-09-29.md` H-boing |
| CLN-38 | Eye: "what else other than fruit and veg?" answered; "why am I clicking on the things?" answered | built, not re-played | eye: eye game | `docs/feedback/clinic-playtest-2026-09-29.md` H-eye |
| CLN-39 | Eye cover cannot be taken back | open | eye: eye game · INT-02 | `docs/feedback/clinic-playtest-2026-09-29.md` H-eye |
| CLN-40 | Foot: swirly part understood; toes, tweezers and plaster position clear; splinters buzz-wire style, both feet at L3 | built, not re-played | eye: foot | `docs/feedback/clinic-playtest-2026-09-29.md` H-foot |
| CLN-41 | Tummy, hic and hair still on the old help; decide later | open | eye: those games · INT-04 | `docs/feedback/clinic-playtest-2026-09-29.md` CQ14; `build/reports/clinic-v2-fixes.md` §7 |

## First launch and shell

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| FL-01 | A wrong reply pill (Yes/No) shakes, the person is embarrassed and asks again | fixed | eye: first-launch Yes/No | `docs/UX-PRINCIPLES.md` §14 |
| FL-02 | On phone the home button does not overlap Cook's title card or the clinic's task card | open (unverified) | eye: 390×844 · LAY-06 | `docs/HANDOVER-2026-09-26.md` "Next up" 7 |

## Other modes

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| MOD-01 | Find it relights 8.2 and 8.3 are a relight, not a redraw | open | auto: `build/bg_align_check.py` · ART-04 | `docs/STATUS-TRACKER.md` §7 Artwork |
| MOD-02 | Sitting room 3.2: sofa too high | open | eye: Find it | `docs/STATUS-TRACKER.md` §7 Artwork |

## Art (cuts, style, backgrounds, characters)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| ART-01 | Game does not look old ("early App Store"): no airbrushed Nani, glossy outlined clip-art, skeuomorphic wood, emoji icons, system font, stiff motion | fixed | eye: 1366×768 | `docs/art-direction-options.md` §1 |
| ART-02 | Clean cuts: no grey leftover inside handles or gaps, no bad corners (hob, karahi handle, charcoal grill) | built, not re-played | eye: ×2 zoom on cream · ART-02; auto: grey-leftover flag (planned) | `docs/feedback/cook-playtest-2026-09-29.md` X14, S14, K6 |
| ART-03 | Items sit on surfaces with contact shadows, never float on a shelf or stand on the worktop lip | fixed | eye: ×2 zoom · ART-03 | `docs/playtest-2026-09-23.md` §1 #10; `docs/cook-with-nani-phase-a-design.md` §2 |
| ART-04 | Background has no painted produce or objects that look tappable | fixed | eye: each background | `docs/playtest-2026-09-23.md` §1 #15 |
| ART-05 | Backgrounds are full resolution, not low-res next to the characters | open (unverified) | eye: 1440×900 | `docs/cook-ui-feedback-2026-09-28.md` §4 |
| ART-06 | Characters are not "pasted on": poses share one canvas so they do not jump, a blink does not redraw the whole character, cut by the scene never the screen edge | open | eye: each pose · LAY-08 | `docs/playtest-2026-09-23.md` §1 #12; `docs/Nani jo Ghar — Roadmap and Story Structure.md` Lessons 6, 7 |
| ART-07 | People are not floating cut-out heads: leaning on the counter | fixed | eye: Cook counter · LAY-08 | `docs/cook-ui-feedback-2026-09-28.md` §8 |
| ART-08 | Face close-ups: eyes at the same height, filling the circle, three expressions (face, happy, frown) | built, not re-played | eye: each face | `docs/feedback/cook-playtest-2026-09-29.md` X4, Q12 |
| ART-09 | No bindi, tilak or sindoor on any character; no visible grey hair under the dupatta | fixed | eye: every character · CUL-01 | `docs/art-direction-options.md` §10 |
| ART-10 | Nani has four cooking moods (not one image); Nana, Ma and Ali "impatient" faces do not smile smugly | open | eye: Nani faces | `docs/cook-with-nani-todo.md` "Then"; `docs/STATUS-TRACKER.md` §7 Artwork |
| ART-11 | Potato cube does not read as butter | open | eye: ×2 zoom | `docs/STATUS-TRACKER.md` §7 Artwork |
| ART-12 | Clinic 7.1 "where it hurts" has neck, back and hair parts; belt and rail do not sit too high | open | eye: 1366×768 | `docs/STATUS-TRACKER.md` §7 Artwork |

## Language and audio

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| LNG-01 | No English instruction text or audio for the child (pop-ups, help bubbles read by a device voice); no English or pictures where the task is understanding Kutchi; English only in "?" | built, not re-played | auto: `build/check_onboard.mjs` · LNG-01, LNG-05 | `docs/cook-ui-feedback-2026-09-28.md` §1; `docs/UX-PRINCIPLES.md` §8; `docs/feedback/clinic-playtest-2026-09-29.md` §13g |
| LNG-02 | "Can you win without the Kutchi?": no help that shows the answer, no skipped steps, no decoys or row shapes that give it away | built, not re-played | auto: `build/leak_*.mjs`, `build/test_cook.py` leak checks · LNG-02 | `docs/cook-with-nani-kutchi-audit.md` |
| LNG-03 | No English or dot placeholders in pills or cards ("mixed", "boga", "•••", "Muke ••• khape", "hakri lakri mixed") | fixed | auto: data check; eye: daar L4 · LNG-04 | `docs/cook-ui-feedback-2026-09-28.md` §9; `docs/overnight-log.md` 02:07 |
| LNG-04 | English placeholder words still waiting for Mum: the "with" join, *ph-turner*, *sekelo*, the plaster line | open | auto: `build/lines_needing_family.py` · LNG-04 | `docs/feedback/cook-playtest-2026-09-29.md` Q5, M6, K1 |
| LNG-05 | *nar* is not used for "no" (*na*; *nar* means look) in diagnosis answers and the eye chart | built, not re-played | auto: grep `nar` · LNG-06 | `docs/feedback/clinic-playtest-2026-09-29.md` G9, CQ16 |
| LNG-06 | Voice is not "crazy fast"; no device or browser voice in shipped audio (family voices only) | fixed | eye: ear · AUD-01 | `docs/cook-with-nani-build-log.md` §1; Roadmap Lessons 11 |
| LNG-07 | Nani's reading pauses can be skipped ("tap anywhere to skip") | fixed | eye: ear · INT-01 | `docs/cook-with-nani-build-log.md` §5 |

## Process

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| PRC-01 | Tested only headless while the game was unplayable on a real device; review on phone and 16:10 laptop | fixed | eye: 390×844 and 1440×900 | `docs/Nani jo Ghar — Roadmap and Story Structure.md` Lessons 1, 12 |
| PRC-02 | Tests had no 16:10 viewport | fixed | auto: `build/test_e2e.py` six viewports | `docs/playtest-2026-09-23.md` §1 #2 |
| PRC-03 | Reported "live" before the Pages build had run (old badges on the live site) | fixed | eye: hard refresh on the live URL · REL-02 | `docs/cook-ui-feedback-2026-09-28.md` §7; `docs/ORCHESTRATOR-HANDOFF.md` (Lesson, 28 Sept) |
| PRC-04 | Overnight run went off script: swipe chop replaced by tap crate and knife; sekelo v2 reused old art and was reported done | fixed | eye: report's "mechanics changed" section | `docs/feedback/cook-playtest-2026-09-29.md` X15 |
| PRC-05 | Tests switched first-time help off, so help bugs went unseen | built, not re-played | auto: `build/check_onboard.mjs` · INT-04 | `docs/modes/clinic-v2-design-sheets.md` G8 (builder) |

## Keep (things Zafar liked: must not regress)

| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| KEEP-01 | Underline while a line is spoken; order card and pop-up are "the bar we want to set" | keep | eye: every station · TXT-08, CMP-07 | `docs/feedback/cook-playtest-2026-09-29.md` C1, C13 |
| KEEP-02 | Daar: chopped things wait at the side and you add them in | keep | eye: daar | `docs/feedback/cook-playtest-2026-09-29.md` D4 |
| KEEP-03 | Samosa: oil looks better, frying is fun, adding samosas is fun, slotted-spoon lift is good | keep | eye: samosa | `docs/feedback/cook-playtest-2026-09-29.md` §S |
| KEEP-04 | Samosa fold swipe stays and feels great; no dashed line, no red dot | keep | eye: fold | `docs/design/cook-design-system-v1.md` §15 |
| KEEP-05 | Sekelo top-down ingredients look good; sekelo stays top-down | keep | eye: sekelo | `docs/feedback/cook-playtest-2026-09-29.md` §K; `docs/design/cook-design-system-v1.md` §15 |
| KEEP-06 | Diagnosis: "does it hurt here?", "my foot", "look at the knee, then the hand"; calm, no time pressure | keep | eye: diagnosis | `docs/feedback/clinic-playtest-2026-09-29.md` D1, D2, D3 |
| KEEP-07 | Heal games liked: knee tap, ear wax taking-out, tooth small-tooth three taps, taste "bones", boing wipe and count, eye test, plaster colour idea | keep | eye: each heal game | `docs/feedback/clinic-playtest-2026-09-29.md` H-knee, H-ear, H-tooth, H-taste, H-boing, H-eye |
| KEEP-08 | The lolly "so funny" (now an apple, never a lolly) | keep | auto: grep lolly · CUL-02 | `docs/feedback/clinic-playtest-2026-09-29.md` E3 |

## Retired

Not rechecked. The thing each row was about has been removed or replaced.

| ID | Issue | Why retired | Source |
|---|---|---|---|
| RET-01 | Fruit piled huge, vanished or appeared twice in Nani's bowl; basket never visibly filled; bought 6, only 3 came home | Fruit-bowl bazaar build replaced by Cook and Find it | `docs/playtest-2026-09-23.md` §1 #3, #4, #5, #7, #11 |
| RET-02 | No digits on the shopping list (players could not tell how many to buy); pear quantity 3 vs plural line; pear taller than the tray | Bazaar removed; numbers are now heard or written in Kutchi with no digits (E12) | `docs/playtest-2026-09-23.md` §1 #6, #8, #9; Roadmap Learning design |
| RET-03 | Bazaar characters barely spoke; awning text unreadable | Bazaar stall removed (solid cream bubble rule lives on as CMP-06) | `docs/playtest-2026-09-23.md` §1 #13, #14 |
| RET-04 | Kitchen rug runs under the island; kitchen storage must hold every fruit and vegetable | Kitchen v3 replaced the fruit-bowl kitchen; pantry is PAN-06 | `docs/playtest-2026-09-23.md` §7 |
| RET-05 | Hands everywhere in Cook; hands scale, rolling-pin hands, pantry grab pose, leftover hand at the skewer station, Cook ignoring the chosen hands | No hands anywhere in Cook (H13) | `docs/cook-ui-feedback-2026-09-28.md` §9; `docs/ORCHESTRATOR-HANDOFF.md` 26 Sept; `docs/HANDOVER-2026-09-26.md` |
| RET-06 | Hands art: orange skin, "approach approved, output not good enough" (flat sticker rings, dotted bracelet) | Hands removed from Cook; `build/qa_hands.py` stays for other modes | `docs/MORNING-SUMMARY.md` (Decided); `docs/Nani jo Ghar — Art Bible.md` §2 |
| RET-07 | Stars on the end screen and stations (ear star, voice star, "no stars anywhere") | Scoring is now the three badges (time, accuracy, hints); star code removed (H5, J7) | `docs/UX-PRINCIPLES.md`; `docs/process/rules.md` H5 |
