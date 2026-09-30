> **Harvest notes from step 1a (30 Sept).** Paths in the tables are the OLD names (before the move); `moves.json` in this folder maps each to its new place.

# Step 1a, batch A: process, status, handovers, feedback

Read-only pass over `/home/user/nani-jo-ghar` (nothing changed in the repo). `docs/process/rules.md` read first. Files under 300 lines were read fully. Skimmed or classified only, as the brief allowed: the two long transcripts and two clinic transcripts (raw Whisper text, RECORD), `external-review-chatgpt` (716 lines: read headings, intro and the closing "changes I would make first"), the four `rules-harvest*` files (heads only), the 28 Cook v3 build-report open sections (only "Open for Zafar" sections read), and `docs/superseded/` v3 brief (first 40 lines plus headings).

Abbreviations used in sections 2 to 7 (all paths relative to the repo root):
- **PT23** `docs/playtest-2026-09-23.md` · **ANT** `docs/alive-nani-test-2026-09-23.md` · **UI28** `docs/cook-ui-feedback-2026-09-28.md`
- **CP** `docs/feedback/cook-playtest-2026-09-29.md` · **CL** `docs/feedback/clinic-playtest-2026-09-29.md`
- **NCS** `docs/NEXT-CHAT-START.md` · **OH** `docs/ORCHESTRATOR-HANDOFF.md` · **HO26** `docs/HANDOVER-2026-09-26.md` · **HO29** `docs/HANDOVER-2026-09-29.md` · **MS** `docs/MORNING-SUMMARY.md`
- **OL** `docs/overnight-log.md` · **OQ** `docs/overnight-queue.md` · **ST** `docs/STATUS-TRACKER.md` · **GI** `docs/GAME-IDEAS-TBC.md`
- **UXP** `docs/UX-PRINCIPLES.md` · **VQA** `docs/VISUAL-QA.md` · **PLANS** `docs/design/plans-remaining-2026-09-29.md`
- **R-x** `build/reports/x.md` (e.g. R-chai-v3, R-art-v3-1, R-clinic-v2-fixes)

---

## 1. Mapping table

| path | lines | verdict | target | reason (one line) | harvest note |
|---|---|---|---|---|---|
| docs/NEXT-CHAT-START.md | 150 | MERGE → docs/status.md | docs/status.md (+ docs/vision.md, + a language-engine spec) | The live "where we are and what happens next" handover of 30 Sept; its plan and state belong in the tracker, then the file is history | Plan steps 1 to 4 and the current-state block (live build, open bugs, open decisions, doctor visit ~9 Oct, paused sessions) → status.md. Zafar's aim quote (§1) → vision.md. Step 2b language-engine requirements (Grammatical Framework abstract/concrete split, Sindhi resource grammar as template, "how to fill the engine" rulebook, Mum elicitation lists, recording separate from the engine, inventory first, the Excel's role) → a new `docs/language/engine-spec.md` (the target structure has no slot for it: see §4). Step 2a code target-operating-model brief → docs/architecture/. "Why we paused" list → decisions.md |
| docs/ORCHESTRATOR-HANDOFF.md | 201 | MERGE → docs/decisions.md | docs/decisions.md | Lessons are all in rules.md; the rest is a chronological session log plus Zafar decisions of 25-26 Sept that are not in rules.md | Section 2 decisions (25 Sept "took every default", build shape, 26 Sept clinic/first-launch/Conversations notes) → decisions.md with the SUPERSEDED marks. Hands pipeline facts, session IDs, branch names, $31.70 spend and wave tables → archive only (history). Check-before-archive done: every rule (A11-A13, A20-A21, B1-B16, C9, C15, D1-D3) is already in rules.md |
| docs/HANDOVER-2026-09-26.md | 69 | MERGE → docs/decisions.md | docs/decisions.md (+ docs/game-design/modes/first-launch.md) | A 26 Sept end-of-session handover; "decided on 26 Sept" list is mostly captured but character-creation layout is not | Character-creation layout (person left, swatches right: gender, skin, hair, eyes, clothing colours, data-driven layers) → modes/first-launch.md. 26 Sept decisions → decisions.md (mark *marcha* as superseded). "Next up" list and "waiting on" list are stale (hands fixes, chai fun pass, etc.): status.md picks up any still live |
| docs/HANDOVER-2026-09-29.md | 56 | MERGE → docs/decisions.md | docs/decisions.md + docs/status.md | Morning-after-overnight handover; decisions and "open for Zafar" list partly live | Overnight decisions (sekelo naming, top-down, swipe fold, one burner, *Muke sekelo khape.* kept pending Mum) → decisions.md. "Open for Zafar" items 2-5 → status.md open list (most now answered: see §5). The station table and screenshots list → archive |
| docs/MORNING-SUMMARY.md | 53 | ARCHIVE | docs/archive/ | 26 Sept status note about the clinic/Cook Wave 6b builds, all superseded by later builds | Checked for decisions and design: the one decision ("count row ticks when that step closes") is in rules.md E11; mode pipeline table lives in each mode doc; hands v3 decision is superseded by rules H13. Nothing live left |
| docs/overnight-log.md | 79 | ARCHIVE | docs/archive/ | One-line timestamped build log of 29-30 Sept sessions; reports in build/reports/ hold the detail | Checked: decisions Zafar made in child sessions (sekelo "top-down throughout") are in rules H20/HO29. The orchestrator review remarks (rack reads as picture frame, "•••" pills, ellipsis on headline, flat chaat layers, etc.) are regression candidates, copied to §3 as "orchestrator-found" |
| docs/overnight-queue.md | 46 | ARCHIVE | docs/archive/ | Queue items 1-8 are all launched/done/cancelled; its API notes were resolved by the follow-up and stage-fill sessions | Checked: item 3 "clinic + Find it adopt shared order card: cancelled by Zafar 29 Sept" is a decision (recorded in §2; later overtaken by CL §13c). The long "notes from samosa/daar v2" lists were fixed per OL 03:20-10:01 and 09:36 (head rule, closed card, ellipsis): no live item left |
| docs/STATUS-TRACKER.md | 166 | KEEP | docs/status.md | Master tracker (rules A15); must be renamed and corrected, not replaced | Needs the corrections in §6 (stale percentages, garbled Language table cells, *marcha* line, hands row, clinic 55% vs 30%). Absorbs NEXT-CHAT-START and PLANS |
| docs/GAME-IDEAS-TBC.md | 33 | KEEP | docs/ideas.md | The parking lot with its per-mode "remind Zafar before calling a mode finished" gate (rules A14) | Needs a row for the quilt-making Big Ma arc (rules decision 4/11) and a rename of the references in rules.md/NEXT-CHAT-START. No stale rules content otherwise (see §6) |
| docs/UX-PRINCIPLES.md | 133 | KEEP | docs/design-language/ux-principles.md | The UX principles; every checkable rule in it feeds the QA checklist | Needs the corrections in §6 (stars, green/red tick, per-card speaker, picture tally). §7 lists its checkable items |
| docs/VISUAL-QA.md | 49 | KEEP | docs/process/visual-qa.md | The "how to review visual work" procedure that every brief links to; the checkable items feed `docs/process/qa-checklist.md` | Small update: add 16:10 laptops and phone landscape to §1 and levels 1-4 (rules C2). §7 lists its checkable items. The §5 chai-pan story can stay as the worked example |
| docs/playtest-2026-09-23.md | 255 | RECORD → docs/feedback/ | docs/feedback/ | Dated play-test of the fruit-bowl build (23 Sept) with cause-and-fix table; the build has since been rebuilt | §6 "rules from now on" are all in rules.md (C2, E23, E24, D21, D13, F19, D8, G1, E12, C1). §4 character-animation research (Spine/Live2D/Rive, LivePortrait, painted blinks rejected, "same canvas for every pose") → art-pipeline.md as a short "considered and rejected" note (see §4) |
| docs/alive-nani-test-2026-09-23.md | 113 | MERGE → docs/design-language/art-pipeline.md | art-pipeline.md (+ docs/architecture/testing) | A lab result with four LEARNINGs; the reusable part is the prompt method and QA tuning | ChatGPT drift-low prompt template (attach the base fresh every time, one new chat per frame, list every preserved feature, never chain) → art-pipeline.md. Phaser clock drifts in headless Chromium (use setTimeout for test-critical timers) and audio RMS thresholds must be calibrated per project → architecture/testing. Gemini API had zero quota (history, archive) |
| docs/cook-ui-feedback-2026-09-28.md | 109 | RECORD → docs/feedback/ | docs/feedback/ | Zafar's 28 Sept feedback on the card, sidebar, pantry, review and chai station, with three revisions (§1-3 superseded by §9, §9 by §10) | Word-review layout detail (widths proportional to count, max three across, top-aligned, thin divider, vertically centred) and the chai-station layout (hob 5/8, tray 3/8, front-on ingredient strip, pour = tilt + stream) and the polish list → ui-design-system.md / modes/cook.md if cook-design-system-v1 does not already hold them (grep shows it does not: see §4) |
| docs/feedback/clinic-playtest-2026-09-29.md | 480 | RECORD → docs/feedback/ | docs/feedback/ | Zafar's clinic play-test, every point with cause, plan, CQ answers and later rounds (§13-13l) | Heal-game designs (scrape, knee, ear, tooth, drinks, eye, foot, boing, fever) and clinic staging/send-off/pharmacy decisions → modes/clinic.md (the clinic-design docs are in another batch; check they hold them) |
| docs/feedback/clinic-playtest-2026-09-29-transcript-part1.md | 238 | RECORD → docs/feedback/ | docs/feedback/ | Raw Whisper transcript (24 min), source for the report above | none — checked: header and first lines only; the report's coverage check maps every line to an item |
| docs/feedback/clinic-playtest-2026-09-29-transcript-part2.md | 180 | RECORD → docs/feedback/ | docs/feedback/ | Raw Whisper transcript (18 min) | none — checked: as above |
| docs/feedback/cook-playtest-2026-09-29.md | 423 | RECORD → docs/feedback/ | docs/feedback/ | Zafar's 31-min Cook play-test with X/P/C/M/D/T/S/K items, Q1-Q16 and his answers, plus the 30 Sept answers | Answers to Q1-Q16 that rules.md only partly holds (Q3 fold method, Q4 chaat keeps swipe chop, Q10 speed dial needs design review) → decisions.md and modes/cook.md |
| docs/feedback/cook-playtest-2026-09-29-transcript.md | 270 | RECORD → docs/feedback/ | docs/feedback/ | Raw Whisper transcript (31 min) | none — checked: header and first lines only; report's coverage check covers it |
| docs/design/external-review-chatgpt-2026-09-28.md | 716 | RECORD → docs/feedback/ (as docs/feedback/external-reviews/) | docs/feedback/external-reviews/ | An outside AI's UI critique of the chai screen, the source of the Cook design-system diagnosis; not Zafar's words | none — skimmed (headings, intro, closing list). Its eight "first changes" are reflected in cook-design-system-v1 §1-§6; it is advice, not regression items |
| docs/design/external-review-gemini-2026-09-28.md | 53 | RECORD → docs/feedback/ (external-reviews/) | docs/feedback/external-reviews/ | Short outside critique (material mismatch, scale stove down 20%, ingredient cards, shadows, typography) | none — read fully. Ingredient-card panels and "scale down stove 20%" were not adopted as written (CDS chose shelf band + chips); keep as a record |
| docs/design/plans-remaining-2026-09-29.md | 87 | MERGE → docs/status.md | docs/status.md (+ modes/cook.md) | Claude's 29 Sept plan for the rest; A1/A2 (samosa, mishkaki) and B1 (clinic audit) are done, the rest is roadmap | Live items → status.md: A3 pantry polish, A4 station-select screen (grid of station cards with dish picture, best time, stars [stars now stale]) and day flow, title screen parked, B2 Find it audit, B3 first-launch re-run (Birthday panels), B4 Conversations wiring, C parked modes procedure (audit, refresh vs design system, shared components from day one), art-by-API <$2 rule (A11/D2 covered) |
| docs/cook-art-audit.md | 99 | ARCHIVE | docs/archive/ | 25-26 Sept art inventory of Cook; overtaken by the v2/v3 art rounds and `assets/cook/items/v3/README.md` | Checked: the open gaps it lists (Nani's four cooking moods, potato cube reading as butter, wiring backlog) are already in ST §7 Artwork; wiring backlog was done by v2/v3 station rebuilds. Nothing unique |
| docs/build-briefs/Nani jo Ghar — Build Brief Alive Nani test.md | 110 | ARCHIVE | docs/archive/ | One-off run brief for a finished lab experiment | Checked: results are in ANT (merged above). The QA thresholds (leak 1.5%, seam 18, no-op 0.15%) live in `build/expressions.py`. Nothing else |
| docs/build-briefs/Nani jo Ghar — Build Brief v4 (Production Shopping + Thin Shell).md | 185 | ARCHIVE | docs/archive/ | Executed 23 Sept brief for the fruit-bowl shell; shell since rebuilt (index.html house, js/shared/save.js) | Checked: profile record JSON and the "when to save" table → docs/architecture/ only if they still match `js/shared/save.js` (verify; Technical Plan §data model already holds progress fields). Story-beat data spec (`intro_beat`/`outro_beat`, fixed visual list, 3-5 s skippable, once only) → modes/first-launch.md or story-and-arcs.md if `js/shared/story.js` still works this way. Basket-angle verdict: straight-on art is fine skewed (README) |
| docs/superseded/Nani jo Ghar — Build Brief v3 (Phaser rebuild).md | 183 | ARCHIVE | docs/archive/ (already marked SUPERSEDED) | Old brief, superseded by v4 and then by the shell rebuild | Checked headings/first 40 lines: the "why v2 failed" table is repeated in README and PT23; pixel-perfect hit-testing, audio resolves on `complete`, scene-JSON positions are in rules J4 and README Architecture. Nothing unique found (skimmed) |
| docs/superseded/Nani jo Ghar — Image Prompt Sheets.md | 104 | MERGE → docs/design-language/art-pipeline.md (+ docs/game-design/cast.md) | art-pipeline.md, cast.md | Its header says partly live: Templates A/B/C, item-grid prompts, and the "later sheets" list are not superseded. But the style text is the old cel-shaded look (the Art Bible's anti-reference) | Template A (item grid 4x4, magenta key, no text), B (three-pose character sheet) and C → art-pipeline.md, rewritten to the 3D style and the magenta/grey key rules. Family character descriptions (Nana, Masi, Mama, Kaka, Kaki, Fui, older cousin) → cast.md: NOT in `Nani jo Ghar — Cast.md` (grep: 0 hits for Fui/Kaki/Mama). Later-sheets list (store cupboard, household, colour threads 4x3, clothes stall, sweet stall; body parts and journey scene need their own approach) → art-pipeline.md backlog / ideas.md |
| docs/process/rules-harvest.md | 446 | KEEP | docs/process/rules-harvest.md | The merged source record behind rules.md (264 rules, conflicts table) | none — checked: head and merge summary. Stays as the source record |
| docs/process/rules-harvest-orch1.md | 172 | RECORD → docs/process/ | docs/process/ | Per-chat harvest, already merged into rules-harvest.md | none — checked: head only; merged into rules.md per NCS §3 |
| docs/process/rules-harvest-orch2.md | 137 | RECORD → docs/process/ | docs/process/ | As above (chat of 25-26 Sept) | none — checked: head only |
| docs/process/rules-harvest-orch3.md | 214 | RECORD → docs/process/ | docs/process/ | As above (chat of 26-29 Sept) | none — checked: head only |
| README.md (repo root) | 290 | KEEP (rewrite) | README.md (root, short) + docs/architecture/ | Root README still describes the 23 Sept fruit-bowl MVP and the Cook "Phase A" (24 Sept) with stars, quilt, Eid hub, hands; very stale | Architecture section (Phaser 1600x900 FIT, HTML/CSS UI layer, scenes as data, pixel-perfect hit-testing, audio on `complete`) and the Files list (build scripts, what each does, "never resave the tracked xlsx with openpyxl") → docs/architecture/. Everything else is history. Root README becomes a 20-line front door linking docs/README.md. See §6 |
| lab/PROMPTS.md | 26 | ARCHIVE | docs/archive/ | Manual-fallback prompts for the five Nani expression frames; frames exist and passed QA | Checked: prompts are duplicated in the Alive Nani brief §2; method is in ANT. **Caution:** `build/expressions.py` refers to this file: update or leave a stub when moving |
| docs/cook-screens/ (11 jpg: 01-title … 11-finale) | 11 files | ARCHIVE | docs/archive/cook-screens/ | 24-25 Sept screenshots of Cook "Phase A" drawn-placeholder art; only referenced by `docs/cook-with-nani-build-log.md` and the Art Bible | Checked with grep: referenced by the build log (line 164) and by `Nani jo Ghar — Art Bible.md` §(line 28), which names `03-pantry.jpg` and `08-tawa.jpg` as **anti-references** (camera/scale faults). When moving, update that Art Bible link (or keep those two in art-bible/ as anti-reference images) |

Verdict tally: 34 rows = 33 files + the cook-screens folder (11 jpgs) as one row. **KEEP 6** (STATUS-TRACKER, GAME-IDEAS-TBC, UX-PRINCIPLES, VISUAL-QA, rules-harvest.md, README) · **MERGE 7** (NEXT-CHAT-START, ORCHESTRATOR-HANDOFF, HANDOVER-09-26, HANDOVER-09-29, alive-nani-test, plans-remaining, Image Prompt Sheets) · **RECORD 12** (playtest-23-Sept, cook-ui-feedback, the 5 files in docs/feedback/, the 2 external reviews, rules-harvest-orch1/2/3) · **ARCHIVE 9** (MORNING-SUMMARY, overnight-log, overnight-queue, cook-art-audit, 2 build briefs, the superseded v3 brief, lab/PROMPTS.md, cook-screens) · **ASK 0** (the genuine questions are in section 5, including hands vs rule H13).

---

## 2. Decisions found (not already in rules.md)

### Design and mechanics
- 2026-09-23 · Core MVP mechanic is a first-person **foreground container** (your basket in the bazaar, carried home, emptied into Nani's bowl); characters stand behind a counter/island; "tap to move, not drag"; basket ≤22% of screen height, three layers (back, items, front rim) · "you always see what you've collected; take from the world, put in your thing" · PT23 "Core MVP decision", §2-3 (kept in spirit by the pantry tray; check against H12/H13 "no hands in Cook")
- 2026-09-23 · Painted-on blinks rejected; closed eyes from ChatGPT, mouth frames from LivePortrait; "one body, swappable face", about 7-8 images per character (neutral, blink, mouth half, mouth wide, happy, gesture, concerned, optional listening), all on one identical canvas · "flicker and jump" otherwise · PT23 §4.4. **[partly SUPERSEDED by rules.md E22/F26: no new character animations unless done well; two-pose swap for staging; art is now 3D renders]**
- 2026-09-23 · ChatGPT manual path is good enough to roll the expression-frame pipeline out to other characters; Gemini path untested · ANT § Recommendation. (Art is now made in ChatGPT via Chrome per D1, consistent.)
- 2026-09-25 · "Zafar took every default" in the mode deep dives and review: **Ali is the role-reversal character everywhere**; draft words count but are flagged; **rooms = kitchen, sitting room, Big Ma's room**; **one rotating hub daily**; speech on-device only (MFCC + warping + DTW, enrolment on, no cloud path in release one); Mum says 🎤 words three times · OH § Zafar took every default. Sub-items **[SUPERSEDED by rules.md decision 2: "parent ✓ earns the voice star"]** and **[SUPERSEDED by the 28 Sept arc plan (rules H36-H39): "Monsoon owns Arc 3 Ch1, the clinic owns Ch4"]**
- 2026-09-25 · Build shape "one agent per mode, all concurrently, plus a foundation agent" · OH § Zafar's decisions. **[SUPERSEDED by rules.md B1/A13: at most ~4 sessions]**
- 2026-09-25 (late) · UX §11 "picture tally top-right in multi-item stations" · UXP §11. **[SUPERSEDED by rules.md E12/F25: no tallies except chai's sugar; flat tallies only where kept]**
- 2026-09-25 · End screen v1: accuracy badge as a row of slots filling green/red, "New best!" bing and sparkle · UXP §9. **[SUPERSEDED by rules.md F13/decision 3: gold/grey tick]**
- 2026-09-26 · **Character creation:** the person on the left, swatches on the right (gender, skin, hair, eyes, clothing colours), built from data-driven layers · HO26 § Decided on 26 Sept
- 2026-09-26 · First-launch placeholder Kutchi (e.g. "Arre re! Khaanu taiyaar nai") is NOT family-confirmed and must be replaced by Mum's recordings · OH § 26 Sept 16:30 (live: story lines still placeholder, first-launch hook still says Eid)
- 2026-09-26 · Chilli: *mirchi* is one, *marcha* the plural; nouns need singular and plural forms · HO26. **[SUPERSEDED by rules.md decision 5: *mirchi* only, no plural, for now]** (the ST also still states it)
- 2026-09-26 · Hands v3 passed ("Zafar passed the hands") and wired into Cook · OH 26 Sept 11:15. **[CONTRADICTED by rules.md H13: no hands anywhere in Cook]**: ST §7 still lists Hands as live in Cook. Ask whether the hands art is kept for first-person scenes (Find it, etc.)
- 2026-09-28 · **Nani's box has a mute button** (tap to mute/unmute her voice, remembered for every mode) and the light bulb sits in her box row; the box may use up to 2 lines · UI28 §3, §9, §10 (rules F11/E25 cover the sage colour, bulb, replay; the mute button is not in rules.md)
- 2026-09-28 · **Word-review layout:** vertically centred; wrong words left, right words right, each side's width proportional to its count (minimum one column, at most three across, stacking into rows), thin vertical divider, both sides top-aligned, flat white cards with flat gold/red outline · UI28 §6, §9-10 (rules F14 has left/right and outline colours only)
- 2026-09-28 · **Chai station layout:** hob ~5/8 width and chai tray ~3/8 along the top, level top and bottom, nothing overlapping the hob; below it a clean strip of the pantry's front-on jars, carton, bottle; hob, pot and tray stay top-down; pot contents as new art (water, milk, light chai, dark chai, bubbles), pour = container tilts + short stream sprite; remove the fill line from glass and pot; a small puff when an ingredient goes in, spoon stir, label pills in one style, items without a word show no empty speaker pill; consistency rule "supply stations use the bottom strip, stations whose items are in the scene keep them there" · UI28 §8
- 2026-09-28 · Cook's opening/title screen is weak but **parked** until later · UI28 §8, PLANS A4
- 2026-09-28 · The Done button: option A (gold tick on round cream button) · UI28 §9. **[refined by rules.md F3/F6: flat gold outline and flat gold check, round gold tick bottom right]**
- 2026-09-29 · Clinic + Find it adopting the shared order card: **cancelled** · "the clinic waits until he's played it; Find it is left for now" · OQ item 3. **[overtaken by CL §13c (Zafar asked 29 Sept late): the clinic moved onto the shared OrderCard; Find it still waits]**
- 2026-09-29 (overnight, in child session) · Sekelo is top-down throughout; skewer vertical; samosa swipe fold stays; one burner per order, maani keeps one tawa; *Muke sekelo khape.* kept while Zafar checks it with Mum · HO29 § Decisions Zafar made during the night (mostly in rules H11/H19/H20; the "kept for now" is the open part)
- 2026-09-29 · Cook play-test answers not (fully) in rules.md: **Q3** samosa: fill on the flat strip, the first fold hides the filling, every later step a fixed picture (not the cone fold); **Q4** swipe chop returns in daar with the same full review as everything else, chopped pieces may sit in bowls or on the counter top right ("try it and judge"), **chaat keeps its swipe chop**; **Q2 scope:** only what Zafar commented on changes (chaat side-on, samosa top-down heaps with no bowls, sekelo chunky pieces); chai's and daar's jars stay; **Q10** speed dial "needs its own design review, probably a new design element"; **Q5** Zafar thinks *sathe* may mean "together": ask Mum; with-lines stay placeholders · CP § Zafar's answers
- 2026-09-30 · Answers to the v3 station reports ("yes to everything for now"): daar: **Nani may ask a speed from level 2 and a sliced decoy costs the ear star but does not ruin the dish [ear star is gone: SUPERSEDED by rules.md decision 1/2, needs restating as accuracy/hints]**; samosa: base filling first on the card (`baseFirst`), **two different samosas per order from level 3**, karahi 1.39x is fine; daar uses the extra pot pictures so an order without onion shows none · CP §12 end; R-art-v3-1
- 2026-09-29 · Clinic CQ answers beyond rules.md: **CQ7 scrape = plaster stickers in order** (three plasters in the colours and order said; half-and-half colours at higher levels; "a bit of a cop-out, but for the moment"; suture/stitches stay as the cut variant); **ear = wax blobs, not seeds**, they keep coming from level 2 and stay until dragged to a tissue/dish; **CQ10 taste game → sore throat and swollen tongue: make the soothing drink** (bumps in different colours each healed by a different drink, e.g. yellow turmeric milk, orange ginger, green honey and lemon; time pressure liked; L1 one colour, L2 two in order, L3 three with counts and a tighter timer); **tooth** = drag a fixed toothbrush head in the called order ("Just Dance") + drill the dark decay + press-and-hold filling to a line, **bug dropped**; **knee** flash-and-tap bandage, flashing stops when done (keep, even though it gives the count away); **eye test** = patient reads the chart, you judge, wrong = another drop, written at L1 then heard only, more items per row; **foot** splinters like buzz-wire, both feet at L3; **boing** = coloured beads counted into the syringe, apple not lollipop; wider eye-test vocabulary · CL §9 answers, §13-13l
- 2026-09-29 · Clinic backgrounds: six, round 1 review (CB5 front door approved; CB1 closer with a six-seat bench and no armchairs; CB2 closer, no poster, wall kept for a photo of the real doctor's certificate that **Zafar will supply**, toys in the left corner; CB4 straight on), then CB1b, CB2b, CB3b, CB5, CB6b approved, CB4c (pharmacy belt, no hatches) still to come; heal-game close-ups are character close-ups drawn later over CB6b · CL §9 answers
- 2026-09-29 · Clinic: pharmacy tray feeds the heal game (everything needed is there; a wrong pick costs score); no walk/slide animation, the picked patient rises; doctor's art based on Hannah's granddad and he is happy with it; no Nani box in the clinic (doctor's box); no script cards; waiting room at most 6, W3 "Call them in" dropped (speaking moves to the patient conversation, pharmacy ask and send-off); from L3 the call is heard not read (closed card, paid peek); L4 pick both then judge; "[Bring me]" not "I want" for the pharmacy (Kutchi to confirm) · CL §13-13f (several are in rules H25-H35; the doctor's-box, closed-card-in-clinic and L4 judge-at-end details are not)
- 2026-09-29 · CQ2: the waiting-room language ladder goes ahead now (man, woman, boy, girl → old/young → tall/short → colours → "the woman with the baby"); a shared per-child sentence-pattern tracker stays a **later foundation item** · CL §9 answers
- 2026-09-29 · Cook order of work: Cook first, then the clinic plan, Zafar plays and gives feedback in the orchestrator chat · CP Q16
- 2026-09-30 · Language engine: **standard, researched approach: abstract syntax (meanings) + concrete Kutchi grammar (lexicon, morphology, syntax), Grammatical Framework as the model, the published Sindhi GF resource grammar as the template (Kutchi is close to Sindhi; differences confirmed with Mum)**; engine generates every sentence; "how to fill the engine" rulebook outputs a Mum phrase list; recording never changes the engine (rules G9-G12 hold the principles; the GF/Sindhi choice and the output list are not in rules.md) · NCS §4 step 2b. Proposal by Claude within Zafar's "standard, not bespoke" requirement: Zafar approved the sequence, not yet the design
- 2026-09-30 · Plan sequence (rules J8 has it in one line): step 1 brain + CLAUDE.md, step 2a code target-operating-model + gap analysis and 2b language-engine research (read-only, side by side), step 3 refactor one session at a time with flow tests and layout lint, step 4 build and populate the engine, then features resume; give an estimate before each launch · NCS §4, §7
- 2026-09-30 · Documentation policy: "don't be too quick to dismiss previous handover documents"; every doc gets keep/merge/archive with a reason; `git mv` to `docs/archive/`, never delete; Zafar reviews the table first · NCS §4 (rules A18/A19 cover this)

### Process decisions in these files not already in rules.md
- 2026-09-28 · "Idle" sessions can still be mid-background-job: wait 20-30 min before relaunch (in rules B12). Covered; listed only to confirm nothing is missing.
- 2026-09-29 · Landing page: Hannah's granddad (past president of the World Federation of Khoja Shia Ithna'asheri communities) can share it across a community with deep Kutch roots; decide whose voices and faces appear first; trailer "Planet Zoo style" (in-game footage, slow sweeping camera, close-ups, gentle music, title cards, no narrator) built in code from the game, first cut around the doctor's visit · ST §The path 5a-5b (rules J5 has the existence of landing page and trailer only)

---

## 3. Past feedback items (for the regression list)

Status convention: **fixed** = the doc or a later build report says it was fixed; "(built, not re-played)" means the builder's report says done but Zafar has not confirmed in play (true of everything from 29 Sept onward unless noted). **open**, **reopened**, **unknown** as stated. "Keep" lines are things Zafar liked that must not regress. Check: **auto** = a named script or test exists or can be written; **by eye** = screenshot review.

### 3.1 Play-test 1 and 2 of the fruit-bowl build, 23 Sept (PT23; fruit-bowl/bazaar errand, now largely superseded by Cook/Find it)
- Sidebar hid two fruit on an exactly 16:10 screen and became an undismissable drawer · bazaar · PT23 §1 #1 · fixed (§0, built and tested on six sizes) · auto (test_e2e six viewports incl. 1440x900, 1280x800 + tap-coverage assertion)
- Tests had no 16:10 viewport · test process · PT23 §1 #2 · fixed · auto
- Fruit in Nani's bowl huge and piled (tween to scale 1) · kitchen bowl · PT23 §1 #3 · fixed · by eye
- Fruit vanished instead of filling the bowl · kitchen · PT23 §1 #4 · fixed · auto (bowl holds 2 + 6)
- Basket never visibly filled (fly-away copy, 🛒 counter) · bazaar · PT23 §1 #5 · fixed (foreground basket) · auto (basket holds 6)
- No numbers shown; Nani always said the singular sentence · list/bazaar · PT23 §1 #6 · fixed ("2 x santra", dots, plural sentence) · by eye + data check
- Bought 6, only 3 came home · errand flow · PT23 §1 #7 · fixed · auto
- Pear quantity 3 vs plural line "bo" (two): never compose Kutchi to fit a number · content · PT23 §1 #8 · fixed (pear = 2) · auto (data check)
- Pear stuck out above the tray (width-only sizing) · bazaar/bowl · PT23 §1 #9 · fixed (max width and height) · by eye
- Fruit looked like it floated on shelves (no contact shadow, sat on the edge line) · shelves · PT23 §1 #10 · fixed · by eye
- Fruit appeared twice at the end (shelf and tray) · kitchen fill phase · PT23 §1 #11 · fixed · by eye
- Characters static, "pasted on", pose images different widths so they jump, cropped by screen edge · bazaar/kitchen · PT23 §1 #12 · partly fixed (behind counters, breathing, mouth); blink poses and LivePortrait frames still to do · by eye
- Characters barely spoke (*Ghan*, *Arre re!*, *Achija* unused; wrong tap only wiggled) · bazaar · PT23 §1 #13 · fixed (*Arre re!* recording missing) · by eye/ear
- "What would you like?" gold text on the striped awning unreadable · bazaar · PT23 §1 #14 · fixed (solid cream bubble, dark text) · by eye
- Painted produce next to tappable fruit confusing · bazaar background · PT23 §1 #15 · fixed (bazaar stall v3 has none); rule for future backgrounds · by eye
- Greyed-out "…" button looked broken · bazaar UI · PT23 §1 #16 · fixed (hidden until usable) · by eye
- Playtest 2 ("not bad"): rug runs under the island; redo all background art and props realistically · kitchen · PT23 §7 · unknown (kitchen v3 replaced it; other props since redone) · by eye
- Kitchen storage must hold every fruit and vegetable: 3-4 full shelves, not two half-empty · kitchen · PT23 §7 · fixed (kitchen v3: four shelves, three for pantry per v4 brief) · by eye
- Sidebar/recipe panel looks plain; visual redesign only · UI · PT23 §7 · fixed (sidebar v3) · by eye
- Fullscreen black bars / letterbox · all · PT23 §1 (symptom of #1) and README · fixed (letterbox fill, later Phaser EXPAND stage-fill 29 Sept) · by eye at 16:10 and wide

### 3.2 Zafar's grill play-test, 25 Sept (UXP, written as the rules it produced)
- "Way too overwhelming at the beginning, with lots of information" (Mishkaki grill) · grill/all modes · UXP intro · fixed by the rules below (built into Cook Wave 6/6b) · by eye
- Per-line translate and 👁 buttons removed; one light bulb; per-line speakers removed · cards · UXP §4 · fixed (later: face = replay) · by eye
- Two jobs in one station (thread while grilling) split into phases · sekelo · UXP §5 · fixed · by eye
- Chips removed from the grill · sekelo · UXP §6 · fixed · by eye
- Level 1 was not simple enough (one skewer, one cup, three pantry items) · all stations · UXP §7 · fixed · by eye
- Onboarding: no first-time graphic overlay · all stations · UXP §8 · fixed for Cook stations; missing in some phases (see CP X11) · auto (`build/check_onboard.mjs`)
- Pressing-and-holding pour "didn't land"; controls must be consistent inside a mini-game · chai/pour · UXP §12 · fixed (pour = tap-measure) · by eye
- Wrong reply pill must shake, person embarrassed, asks again · Conversations/first launch Yes-No · UXP §14 · fixed (Yes/No switched 26 Sept) · by eye
- End-of-round badges took five rounds: grey fringes, holes, mismatched sizes, a wrong fill mapping, a live site that had not rebuilt · end screen · OH § Lesson 28 Sept, VQA intro · fixed · by eye (zoomed on cream) + check Pages build ran

### 3.3 Cook UI feedback, 28 Sept (UI28; sidebar and pantry, later revisions supersede earlier ones)
- English instruction text on pop-ups ("Listen to what Nani needs, then tap each one into the basket") · every mode · UI28 §1 · fixed in Cook; broke again in clinic heal help (CL 13g) · auto (`check_onboard.mjs`)
- Pantry card headline "Muke dudh de." with atto, chai listed below it, reads as if milk were a different kind of thing · pantry card · UI28 §1 · fixed (headline "bring me these for {dish}", to record) · by eye
- Old three badge icons on the recipe card · sidebar · UI28 §2 · fixed · by eye
- Card scroll bar · sidebar · UI28 §2 · fixed ("no scroll bar") · by eye
- Card header: face + headline + speaker, drop the name · sidebar card · UI28 §2 · fixed (face = replay) · by eye
- Mishkaki order with several skewers needs a mini card per skewer; order shown as a little skewer · sekelo card · UI28 §2, §9 · fixed in v2/v3 (group boxes, then sequences) · by eye
- Nani's guide box needed in every mode; mute/replay; bulb in her row · Nani box · UI28 §3 · fixed (sage box) · by eye
- Nani's box too alarming in red/rose · Nani box · UI28 §10 · fixed (sage) · by eye
- Pantry shelves angled/top-down bowls on side-on shelves; containers should be labelled clear jars; meat in a fridge section; no generic metal jugs · pantry art · UI28 §4 · fixed (pantry v2), final background render and polish pending · by eye
- Pantry basket should be a tray with outlined spaces · pantry · UI28 §4 · fixed · by eye
- "Next item" ring off-centre (centred on item plus label) · pantry highlight · UI28 §4 · fixed (glow + bounce of the item) · by eye
- Backgrounds low-resolution next to the characters · all scenes · UI28 §4 · unknown (rule D15: 1600x900 full res) · by eye
- Word review not vertically centred; border/shadow uneven; wrong colours; widths · end screen p2 · UI28 §6 · fixed (sidebar v3 / results) · by eye
- End screen in Cook still showed old drawn badges (Pages had not rebuilt) · end screen · UI28 §7 · fixed · by eye after hard refresh
- Chai layout overlapping hob/tray; top-down ingredient row; flat blue disc for liquid; no pour animation; knobs unwired; fill-line relic on glass and pot · chai · UI28 §8 · fixed (chai v2/v3) · by eye
- People floating as cut-out heads · Cook counter · UI28 §8 · fixed ("leaning on counter" art) · by eye
- Nothing may wrap onto two lines in sidebar; every headline and item one line, shrink to fit · sidebar · UI28 §9 · fixed but regressed: clipped headlines re-found 30 Sept (see 3.6) · auto (overflow/clipping lint proposed)
- Pills must tick as items go in (BUG in chai, maybe elsewhere) · sidebar pills · UI28 §10 · fixed · auto (test_cook per-station tick check) + by eye
- A leftover hand still showed in the skewer station at the bottom of the board · sekelo · UI28 §9 · fixed (hands removed from Cook) · by eye
- "Muke ••• khape." and "mixed"/"boga" English in pills; no English in item pills · cards · UI28 §9 (and OL 02:07) · fixed · auto (data check) + by eye
- Items without a word at higher levels must keep a speaker-only chip of the same size and position · cards/shelf · UI28 §10 · fixed · by eye

### 3.4 Cook play-test, 29 Sept (CP; 31-min voice note). Status = builder reports in OL and R-*-v3 unless stated; "Q" = Zafar's answer in CP §10
**Shared (X)**
- **X1** Spoken orders are stitched fragments ("I want tea and milk. I want tea with two sugars. Ginger with…", "…ne hakri bajr ji maani", "…ne trae marcha"); want one natural sentence per person · all stations · CP §2 X1 · fixed in part (one sentence per person, card order = spoken order; the join word "with" is an English placeholder pending Mum, Q5) · by ear/eye + auto (600-order sentence probe in R-chai-v3)
- **X2** Read-along underline must be the standard wherever a line is spoken · all · CP X2 · fixed ("X2 read-along everywhere", OL 13:40) · by eye
- **X3** Speaker icon outside the face circle not tappable · cards, pop-up, Nani's box, hob faces · CP X3 · fixed (OL 13:40) · by eye/auto
- **X4** Face close-ups uneven (Nani cropped closer than Nana); need eyes at the same height, filling the circle; three expressions per face · faces · CP X4, Q12 · fixed (re-cropped by the eyes, `<who>-face/-happy/-frown`); ChatGPT close-ups later · by eye
- **X5** Hobs look bent and badly cornered, uneven sides, all burners terrible (composed from one 2-burner picture) · chai/maani/daar/samosa · CP X5 · fixed (hob family H1-H5 + knobs H6, 30 Sept; 4-burner hob at full size, v3.1) · by eye + auto (`check_vessel_meta.py`)
- **X5b** Knobs too small; should match face badges; on = glowing ring, no icon · hob · CP X5, Q8 · fixed · by eye
- **X6** Flames too big (touching neighbours at 3-4 pans) and heat gauge hard to read against them; gauge thicker (10 to 14-16 px, darker track) · chai/others · CP X6 · fixed (flames peek, gauge on rim; 11:50 live; thicker gauge in shared fixes) · by eye
- **X7** Shelf band padding: top gap equals gap below chips; bounce and glow stay inside the band; chai water bottle touches band top; maani dough containers need room above · shelf band · CP X7 · fixed ("X7 shelf padding rule", OL 13:40) · by eye (rule F16); auto-measurable
- **X8** Three camera looks side by side (side-on pantry jars, top-down sekelo, three-quarter chaat/samosa bowls) · chaat/samosa · CP X8, Q2 · fixed (chaat side-on, samosa top-down heaps) · by eye
- **X9** Things inside pots and pans look fake (chai liquid, daar oil, white dots, swirling dots) · chai/daar · CP X9 · fixed (pre-rendered contents cross-faded, v3) · by eye
- **X10** Tasting/review differs by station (chai/maani/pantry none; chaat/daar/samosa half-body slides in and "tastes"; sekelo small circle); want one way, a large round face circle over the dish, no pretend eating, happy/frown, wrong marks the wrong row · all 7 stations · CP X10, Q1 · fixed (`Cook.Kit.review` in 6 stations, OL 17:22; chai and maani via v3 passes) · by eye
- **X11** First-time help missing: samosa has none (switches off fry help), daar covers chopping only · samosa/daar (all phases) · CP X11 · fixed (samosa + daar-cook coaches, `check_onboard.mjs`) · auto (`build/check_onboard.mjs`)
- **X12** Counting along inconsistent across stations: review where and why · all · CP X12, Q7 · fixed in data (counting rule L1 written+heard, L2 written, L3+ heard); the maani card's headline repeating its row still open ("X12 left open") · by eye
- **X13** Fetch from the pantry first? · story mode · CP X13, Q6 · fixed (first time each dish is made that day, story mode only) · by eye
- **X14** Bad cut-outs keep getting through (hob corners, karahi handle with grey inside, charcoal grill) · art · CP X14 · fixed for listed items; standing check · auto (flag `#808080` leftover inside cuts) + by eye zoomed
- **X15** Overnight run went off script: daar swipe chop replaced by "tap crate, tap knife"; sekelo v2 reused old art and was reported done · daar/sekelo · CP X15 · fixed (swipe chop back in v3; new sekelo art); guardrails now rules A5/A6/C4 · by eye + report's "mechanics changed" section
**Pantry**
- **P1** Counting voice and Nani's "next thing" line overlap · pantry · CP P1 · fixed (one speech queue per station, OL 13:40) · by ear/auto
- **P2** Gold done-outline of a fetched row clipped at left/right/top/bottom of the list · pantry card · CP P2 · **reopened: re-found 30 Sept 18:00 UK (NCS §2)** · auto (clipping lint) + by eye
- **P3** "Bring me these" headline clipped in the pop-up ("these" cut) · pantry pop-up · CP P3 · **reopened: growing highlighted row and headline clipped 30 Sept (NCS §2)** · auto + by eye
- **P4** Nani reads in a different order from the card (sugar, milk, flour vs top-to-bottom) · pantry · CP P4 · fixed (card order = spoken order) · by ear + auto
**Chai**
- C1/C13 keep: underline while speaking; order card and pop-up "the bar we want to set"
- C2 Water bottle too close to band top and pops out on bounce · chai shelf · CP C2 · fixed (X7; "C2 bottle hop measured inside the band", R-chai-v3) · by eye
- C3 Hob art bent/bad corners · chai · CP C3 · fixed (X5) · by eye
- C4 Knob too small · chai · CP C4 · fixed (Q8) · by eye
- C5 Sentence: *Muke aadu waari chai khape* with the extra first, then *dudh*, *ba khun*; today the ginger phrase comes last and repeats *chai*; "play button didn't work" once · chai · CP C5 · fixed (extras first as *waari*, kari/mori with *dudh na/khun na*; "with" join still English placeholder) · by ear/eye
- C6 Speaker icon outside the face circle not tappable · chai · CP C6 · fixed (X3) · by eye
- C7 Face close-ups consistent crop · chai · CP C7 · fixed (X4) · by eye
- C8 Liquid in the pan should be semi-photoreal · chai · CP C8 · fixed (nine pan pictures, R-chai-v3); black-tea glass and tipped pan art still open · by eye
- C9 Flames toned down · chai · CP C9 · fixed (partly 11:50, completed with new hob) · by eye
- C10 Gauge ("time tracker") thicker · chai · CP C10 · fixed (X6) · by eye
- C12 Nobody reacts after "take": drinker should say whether they like it · chai · CP C12 · fixed (shared review face, Q1) · by eye
- Also done 29 Sept 11:50 (live): pans centred on burners; no flame on a burner whose pan is away pouring; gauge on rim; smaller flames; "boiling" shot in QA; kari/mori orders · chai · CP §4 · fixed · by eye
**Maani**
- M1 Spare "Ne" in the sentence; want *Muke hakri bajr ji maani khape* · maani · CP M1 · fixed (X1); headline still repeats its row over *hakri maani* (X12, open) · by ear/eye
- M2/M7 Hob: flames only peek top and bottom of the tawa, not sides · maani · CP M2, M7 · fixed (wide single burner, flames 0.95x tawa, ring on rim) · by eye
- M3 Silver bowls of dough look bad, balls unreal; want one realistic pile, tap = one ball flies out, no tray · maani · CP M3, Q14 · fixed (two realistic piles on the band; ball goes back if you change your mind); "can a pile run out?" open · by eye
- M4 Chakla and velan: darker, richer wood; one house board · maani/samosa · CP M4 · fixed (dark walnut) · by eye
- M5 Cooked maani still puffs like a poori · maani · CP M5 · fixed (flat states raw, half, cooked, burnt; puffed removed, also in art registry and Tawa lab) · by eye
- M6 Turner looks like "weird tweezers" (chimta art) · maani · CP M6, Q15 · fixed (flat wooden turner); word *ph-turner* is a placeholder · by eye
- M8 Tawa looks low-res (400 px upscaled) · maani · CP M8 · fixed (hi-res tawa placed by measured body) · by eye
- M9 Padding above dough containers · maani · CP M9 · fixed (band rule) · by eye
**Daar**
- D1 The swipe chop was replaced; "there's no game now" · daar · CP D1, Q4 · fixed (chop.js back with options; 23:35 30 Sept) · by eye + test_cook
- D2 Whatever starts in the pan looks unreal ("don't know if it's oil") · daar · CP D2 · fixed (pre-rendered oil/contents) · by eye
- D3 Ginger and added things are "just rendered white dots" · daar · CP D3 · fixed (pot pictures per stage; per-vegetable pots in v3.1, stir swirl and review bowl still carry dry chilli/curry leaves) · by eye
- D5 Finished daar at the side should be photoreal on a small wooden trivet · daar · CP D5 · fixed (trivet bowl) · by eye
- D6 Ladle orientation terrible; handle up into the air; ladle came out as a dipper · daar · CP D6 · fixed (ladle-v2) but **open**: "dipper" in R-art-v3-1 R3 (redo with a real *kadchi* photo?) · by eye
- D7 Stir shows neither speed nor laps; speed dial gone · daar · CP D7, Q10 · fixed (kit-style dial, laps as Kutchi word, dial icons) · by eye
- D8 Tasting wasn't good · daar · CP D8 · fixed (X10) · by eye
- D9 Chopped rows stay ticked into the cooking; should reset at the pan and tick as each goes in · daar card · CP D9 · fixed (OL 13:40) · auto (order card state) + by eye
- D10 Ingredients swirl as flat dots when stirred · daar · CP D10 · fixed (stir turns the pictured contents) · by eye
- D11 Pot and chopped-ingredient container not straight top-down · daar · CP D11 · fixed (top-down pot/trivet art) · by eye
- Keep: chopped things wait at the side and you add them in (D4)
**Chaat**
- T1 Quantities only heard, never written; card should say *ba dungri* at L1 · chaat · CP T1 · fixed (rule E12); daar's chop card still writes quantities at every level (R-daar-v3, open question) · by eye
- T2 Terrible visuals: redrawn three-quarter ingredient bowls · chaat · CP T2 · fixed (side-on) · by eye
- T3 Glass bowl looks terrible; make it fully side-on with layer strips · chaat · CP T3, Q2 · fixed (side-on bowl placed by measured inside; tomato pot is a recoloured stand-in) · by eye + auto (`check_vessel_meta.py check_chaat`)
- T4 Fetch from pantry first · chaat · CP T4 · fixed (X13) · by eye
- T5 Tasting on the same screen, no pretend eating · chaat · CP T5 · fixed (X10) · by eye
**Samosa**
- S1 "…and three chillies" should be "with three chillies"; list all ingredients · samosa · CP S1 · fixed in part ("with" placeholder, Q5 open) · by ear/eye
- S2 Three-quarter ingredient bowls; want top-down heaps, no bowls · samosa · CP S2 · fixed · by eye
- S3 Base filling (chundo/bataato) not named; must always be a row · samosa card · CP S3, S18 · fixed (base always a row, `baseFirst`, one filling per order; two different samosas from L3) · by eye + auto (6,000-order probe)
- S4/S7 No first-time help; "it just says click tick" · samosa · CP S4, S7, X11 · fixed (coach) · auto (`check_onboard.mjs`)
- S5 No counter as you fill · samosa · CP S5 · fixed/decided (rule E12) · by eye
- S6 Board looks like a blown-up low-quality image · samosa/maani · CP S6 · fixed (house board) · by eye
- S8 Fold pictures terrible · samosa · CP S8 · fixed (six fixed fold pictures) · by eye
- S9/Keep Pre-fills the next samosa with the same filling; must start empty when the two differ · samosa · CP S9 · fixed (second strip starts empty when it differs) · by eye
- S10 Samosas sit over the plate's rim · samosa plate · CP S10 · fixed (plate.webp, flat centre) · by eye
- S11 Fold: first fold hides the filling; later steps fixed pictures · samosa · CP S11, Q3 · fixed · by eye
- S14 Karahi right handle has grey left inside (bad cut) · samosa · CP S14 · fixed (new karahi 1.39x) · auto (grey-leftover flag) + by eye
- S16 Oil-heating ring looks like the timing ring and adds nothing; remove (also in daar) · samosa/daar · CP S16, Q9 · fixed (no oil ring, sizzle = ready) · by eye
- S19 Frying area bigger: wide single burner, bigger karahi · samosa · CP S19 · fixed (karahi 1.39x; 1.5x covered the knob) · by eye
- S20 Jharo (slotted spoon) goes over the samosas; should go under · samosa · CP S20 · fixed ("jharo under the samosa") · by eye
- S21 Flames shown sometimes, not always; consistent when knob is on · samosa · CP S21 · fixed (flames stay on) · by eye
- S18 "Two samosas and three chilli": base could be zero (1 in 8 at L1) · samosa data · CP S18 · fixed (min one spoon base) · auto (probe)
- Keep: oil looks better, frying fun, adding samosas fun, slotted-spoon lift good
**Sekelo**
- K1 Headline must say *Muke sekelo khape* (was mishkaki) · sekelo · CP K1 · fixed in data; *sekelo* still to confirm with Mum · by ear
- K2 "No updates… all old artwork" (v2 reused old grill/rack/board/skewer) · sekelo · CP K2 · fixed (new v3 art, pictures for rack-0..4 and plate-0..4) · by eye
- K4 Bare "boga" skewers; veg skewer must name what's on it in order; mostly mixed at higher levels · sekelo card · CP K4 · fixed (no bare boga) · auto (data check)
- K5 Onion/tomato small dice in bowls but large on skewer; make them match, big and chunky · sekelo · CP K5 · fixed (chunky pieces) · by eye
- K6 Charcoal grill cut out badly · sekelo · CP K6 · fixed (new grill) · by eye zoomed
- K7 Wooden frame and skewers look bad · sekelo · CP K7 · fixed (rack/plate pictures) · by eye
- K8 Skewer handle should sit off the plate; plate lines up with grill and rack · sekelo · CP K8 · fixed (one line); plate skewers drawn close together (open, R-sekelo-v3 §6) · by eye
- K10 Review is a small circle here; one way across all stations · sekelo · CP K10 · fixed (X10) · by eye
- K11 Levels 2-4 of every station not yet played by Zafar · all · CP K11 · open (needs Zafar's pass) · by eye
- Keep: sekelo top-down ingredients look good

### 3.5 Clinic play-test, 29 Sept (CL; two voice notes) and Zafar's later play rounds (§13-13l). Status = R-clinic-v2-a/b and R-clinic-v2-fixes (30 Sept 01:14 UTC); none re-played by Zafar yet
**Clinic-wide**
- G1 Backgrounds must be locked first so assets don't need resizing; existing rooms empty, faded 45-55%, heal games had no background · clinic · CL G1 · fixed (six new backgrounds; CB4c pharmacy belt pending) · by eye
- G2 Rough art made judging hard ("so overwhelmed by how terrible the visuals were") · clinic · CL G2 · open (stand-in art; real art after prototypes) · by eye
- G3 Bring over everything Cook learned (shared order card as patient card, guide box, end pop-up, review faces, spacing) · clinic · CL G3 · fixed (v2 fixes) · by eye
- G4 Language should build up simply; asked whether sentence complexity is tracked per child (it is not) · waiting room/clinic · CL G4, CQ2 · partly fixed (W4 ladder); per-child tracker deferred · by eye
- G5 Heal games explain nothing (foot, taste, eye: "why am I clicking on the things?") · heal games · CL G5 · fixed (one "why" beat, only standalone/lab after 13i) · by eye + auto (`check_onboard.mjs`)
- G6 Rows don't tick when done (tooth three taps) · heal games · CL G6 · fixed (Cook counting rule); level-1 counts for fever/foot/drinks/boing "Zafar will judge in play" · by eye
- G7 Grown-up skip button (top-right ▶|) confused him · clinic/first-time help · CL G7, CQ15 · fixed (moved behind the "?" menu) · by eye
- G8 Fever game unplayable: tray sends a strip the game doesn't know, help blocks every tap; fan looks like the fever strip · fever · CL G8 · fixed (tray id, thermometer, test of help path) · auto
- G9 *Nar* used for "no"; is *na* (*nar* = look) · diagnosis and eye chart · CL G9, CQ16 · fixed · auto (grep for `nar`)
- G12 Levels 2-4 of Cook not checked by Zafar ("I've actually not checked level threes") · Cook · CL G12 · open · by eye
**Waiting room**
- W1 Background quality; something on the wall to say "doctor's" · waiting room · CL W1 · fixed (CB1b) · by eye
- W2 People should sit on one large bench · waiting room · CL W2 · fixed (six-seat bench, no armchairs) · by eye
- W3 How to show you picked the right person: no walking; a tick under each person; later "the picked person rises off the seat" (the slide looked cheap) · waiting room · CL W3, §13 · fixed · by eye
- W4 Language ladder (man/woman/boy/girl, old/young, tall/short, colours, "woman with the baby") · waiting room · CL W4 · fixed in part (words to Mum: man, woman, young, tall, short, colours, "with the baby") · by ear
- W5 Wider waiting room, up to 8-12 people, doctor's door half open, head leaning out · waiting room · CL W5, CQ1 · **changed**: max 6 people at every level (§13a) · by eye
- "Call them in" leaks (card shows the same sentence as the right pill) and speaking is unnatural here · waiting room W3 · CL §13a · fixed (W3 dropped; card shows round face no text; call heard from L3) · auto (leak bot) + by eye
- L4: pick everyone straight away, judge at the end; ticks show numbers · waiting room · CL §13a · fixed · by eye
- Lab debug log (bottom left) overlaps the pills/counter · lab pages · CL §13a-b · unknown · by eye
- L5 needs the earlier fixes: 6 max counting babies and children, closed card from L3, rises off the seat · waiting room · CL §13f · fixed · by eye
**Diagnosis**
- D2/D1b "Found it"/"Next" variant unexplained · diagnosis · CL D2 · fixed (folded into D1 as level 2) · by eye
- D3 Scene: patient sits on the bed edge, knees dangling, doctor beside them turned three-quarter; or stands by an anatomy poster · diagnosis · CL D3, CQ3 · fixed (CB2b/CB3b, doctor stand-in) · by eye
- D5 D3's tools unclear (torch picture looks like a pill; no cue per tool) · diagnosis · CL D5 · fixed (clear torch, per-tool cues, L1 two tools) · by eye
- Keep: D1 "does it hurt here?", D2 "my foot", D3 "look at the knee → the hand"; diagnosis stays calm (no time pressure)
**Pharmacy**
- P1 Camera angle/items: 45-degree items, painted belt used by the game · pharmacy · CL P1-P3 · fixed in part (items on the painted belt; CB4c straight-on belt still to come) · by eye
- P4 Level 3 harder by faster belt/closer items, not a timer; hard-to-draw "filling" item → draw a tube · pharmacy · CL P4, CQ5 · fixed (no timer) · by eye
- "Muke plaster khape" is a customer's "I want"; doctor says "[Bring me] the plaster" · pharmacy card · CL §13b · fixed (English placeholder, to record with Mum) · by eye
- A filled slot keeps its dashed outline · pharmacy tray · CL §13b · fixed · by eye
- No way to put a placed item back (misclick); first pick scored · pharmacy · CL §13b, UXP §17 · fixed · auto (take-back test) + by eye
- Items don't sit on the belt (float/tilt; needs flat base and contact shadow) · pharmacy art · CL §13b · open (stand-in art) · by eye
- Green bottom-right button ("To the bench") cut off by the frame's right edge · pharmacy · CL §13b (and UXP §15) · fixed (shared button kit, "button in frame") · by eye at 390x844 and 1366x768
- Pharmacy tray must feed the heal game; wrong pick costs score, nothing greyed · pharmacy/heal · CL §13 · fixed · by eye
**Send-off**
- E1 Patient leaving, door half open, doctor beside them · send-off · CL E1 · fixed (CB5) · by eye
- E2 Make happy/sad clear without English; thought bubble with four feeling faces (happy, sad, hot, cold) · send-off · CL E2, CQ6, §13d · fixed · by eye
- E3 Lolly becomes an apple (also boing's lollipop) · send-off/boing · CL E3 · fixed (apple); lolly must not reappear · auto (grep lolly/lollipop) + by eye
- E4 E2 vs E3 unclear; one send-off with the goodbye in the scene from L2 · send-off · CL E4 · fixed · by eye
- Patient and doctor should stand on the left in the free wall space, not by the door where the face circle sat on the green cross sign · send-off · CL §13d · fixed · by eye
- Doctor card listed every line up front and repeated them; no script card · send-off · CL §13e, UXP §16 · fixed · by eye
- Send-off L3: help items and reply pills on top of each other; reply pills only when needed · send-off · CL §13f · fixed · by eye
- Stale UI between rounds: reply pills from an earlier round stayed on screen until refresh · clinic stages · CL §13f · fixed ("stale UI cleared") · auto (stage-end UI check) + by eye
- No Nani box in the clinic; the doctor fills her role · clinic sidebar · CL §13f · fixed · by eye
**Heal games**
- Scrape: too clicky, star/cat/red-dot plaster designs unclear, no way to take a plaster off, no sequence card · scrape · CL H-cut, §13h · fixed (plasters in colours and order, take-back, sequence on shared card) · by eye
- First-time help in heal games used English sentences in bubbles read by the device voice (breaks UXP §8) · all heal games · CL §13g · fixed (back on ghost finger; `check_onboard.mjs` flipped) · auto (`check_onboard.mjs`)
- Nothing tappable until spoken instructions finish (whole clinic) · clinic · CL §13i · fixed (input live from the start) · auto (test) + by ear
- Knee: bandage game fun, keep; stop the flashing when done; bandage did not show on every tap (bug); named leg still highlighted at top level; level 3 unclear (left/right) · knee · CL H-knee, §13i · fixed; leak bots show blind rate ~25% at L1 (accepted by Zafar, 13l) · auto (leak bot) + by eye
- Ear: level 1 too hard (wadho/nindho too early); wax dragged not tapped, to a tissue; pop-up wax must not disappear by itself · ear · CL §13j · fixed · by eye
- Tooth: brushing unclear; bug confusing (dropped); fine after fixes: voice-overs, input live, sidebar · tooth · CL H-tooth, §13k · fixed · by eye
- Taste game unclear ("I just don't really get what I'm doing") · taste/drinks · CL H-taste · fixed by redesign (soothing drinks) · by eye
- Fever unplayable (see G7/G8); redesign alternating hot/cold to "just right" · fever · CL H-fever · fixed first pass; Zafar's review pending · by eye
- Boing: plaster part unclear; lollipop → apple; coloured beads idea · boing · CL H-boing · fixed first pass · by eye
- Eye: "what else other than fruit and veg?"; "why am I clicking on the things?"; eye cover can't be taken back · eye · CL H-eye · fixed first pass; eye cover take-back **open** · by eye
- Foot: "I don't really get the swirly thing", toes, tweezers, plaster position · foot · CL H-foot · fixed first pass (splinters buzz-wire style, both feet at L3) · by eye
- Tummy, hic, hair still on old help; decide later · clinic · CL CQ14, R-clinic-v2-fixes §7 · open (CQ14)
- Keep (liked): knee tap, ear wax taking-out, tooth small-tooth-three-taps, taste "bones", boing wipe/count, eye test, plaster colour idea, lolly "so funny" (now apple)

### 3.6 Regressions and defects logged in handovers/status, 26-30 Sept
- Pantry "Bring me these" headline and growing highlighted row clipped at the card edge (re-found 30 Sept 18:00 UK) · pantry · NCS §2 · **reopened** · auto (clipping lint) + by eye
- Pantry lines are fragments with no verb (*khun, ne daar, ne dudh*): sessions produced fragments instead of admitting a Kutchi gap · pantry and others · NCS §2 · open (language engine, step 4) · by ear/eye
- Shared end screen word tile overflows (*fudino ji chutney*) · end screen · NCS §5 · open · auto (overflow lint) + by eye at L4 phone
- Tiny chip words on phone · shelf band · NCS §5 · open · by eye 390x844
- Results words card overflows on phone at L4 and writes *hakro* where the order said *hakri* (*hakri lakri* in sekelo) · shared results card · UXP §15 "Known differences", R-sekelo-v3 §6 · open · by eye
- Clinic "Found it"/"Next" pills and a bottom-right button cut off on the pharmacy screen; sekelo "to the grill" pill; chaat chop timer ring in old colours: all differ from Cook's shared buttons · clinic/sekelo/chaat · UXP §15 · fixed (shared button kit `js/shared/buttons.js`) except verify chaat ring · by eye
- Chai pans sat low-left of burner; a lit burner with no pan; heat gauge on the flame tips; nobody had shot the boiling state · chai · VQA §5 · fixed 29 Sept · auto (`check_vessel_meta.py`) + by eye (shoot every state)
- Hands: scale near small bowls, rolling-pin hands cover dough, pantry grab pose, Cook ignores the character's chosen hands · Cook · OH 26 Sept, HO26 · unknown (hands removed from Cook per H13) · by eye
- Phone: ⌂ home button overlaps Cook's title card and the clinic's task card · shell/Cook/clinic · HO26 "Next up 7" · unknown · by eye at 390x844
- Hands art 26 Sept: "approach approved, output not good enough" (flat sticker rings, dotted-line bracelet) · hands · MS § Decided · fixed (hands v3) then removed from Cook · by eye
- Dead cream band above the counter (letterbox from Phaser FIT) · all Cook stations · OQ/OL 29 Sept, ST · fixed (stage-fill: EXPAND, scenes lifted) · by eye at wide/tall viewports
- Samosa card headline cut to "Muke ba samosa …" and ticked ✓ after filling, folding while still frying; daar Nana's ✓ during the stir; "don't" row turning gold mid-dish · cards · OL 03:07, OQ notes · fixed (head rule, closed card, wrap not ellipsis) · auto (order-card node tests 112/112)
- Orchestrator-found (not Zafar's words, worth rechecking): sekelo rack reads as an empty picture frame; tomato/onion oversized vs stick; "hakri lakri mixed" English in a pill; chaat layers flat rectangles; chilli layer too thick; samosa filling as two dots on the fold line; fry layout off-centre; "•••" pills at daar L4; chai leftover "1 1" tally at serving; dead chaat tally · cook v2 · OL 01:34-03:40 · fixed · by eye
- Art: Find it relights 8.2/8.3 were redrawn not relit; sitting room 3.2 sofa too high; clinic 7.1 "where it hurts", neck/back/hair parts missing, belt and rail sit too high; potato cube reads as butter; Nani's four cooking moods missing · art · ST §7 · open · by eye

---

## 4. Design content at risk (exists nowhere else; carry into the target before archiving)

- **Language-engine requirements (NCS §4 step 2b)** → new `docs/language/engine-spec.md` (suggest adding to the target structure; the structure has lexicon/grammar-notes/mum-questions but no engine spec). Contents: GF abstract/concrete split, Sindhi GF resource grammar as template, engine generates every sentence, fill-the-engine rulebook and Mum's questionnaire ordered by unlock value (gender, number, *jo/ji/ja* possession, polite forms, numbers, negation *na*, lists/"with", postpositions, word order), recording separate from the engine (frequency statistics from simulated play), inventory first, decide the Excel's role.
- **Code target-operating-model brief (NCS §4 step 2a)** → docs/architecture/: engine core, shared game framework (one scoring model matching three badges), content as data, modes as plug-ins, a sandbox that plays real flows including labs, layout linting, screenshot review against the checklist; deliverable is a target doc plus gap analysis and sequenced refactor plan.
- **Zafar's stated aim (NCS §1)** → vision.md and the top of CLAUDE.md.
- **Character-creation spec (HO26)** → modes/first-launch.md.
- **Nani's box mute button, word-review layout, chai layout and polish list (UI28 §3, §6, §8-10)** → ui-design-system.md (and modes/cook.md): cook-design-system-v1 has no "three across", "proportional", "fill line" or "5/8" hits.
- **Clinic heal-game designs and staging (CL §7-8, §13-13l)** → modes/clinic.md: scrape plasters, knee flash-and-tap, ear wax drag, tooth brush/drill/fill, soothing drinks by bump colour, eye test, foot splinters, boing beads, waiting-room ladder, send-off thought bubble, pharmacy tray feeds heal games. rules.md defers to the harvest (H31-H32); check `docs/modes/clinic-design.md` and `clinic-v2-design-sheets.md` (other batches) hold them.
- **Character-animation research (PT23 §4)** → art-pipeline.md "considered and rejected": Spine, Live2D, Rive, DragonBones, Animated Drawings, LivePortrait retargeting, painted-on blinks tried and rejected; future-art brief "every pose on the same canvas, eyes and mouth as separate layers, hands away from the face".
- **ChatGPT prompt method and QA tuning (ANT)** → art-pipeline.md and architecture/testing.
- **Image Prompt Sheets templates A/B/C, item lists, "later sheets" (family characters, store cupboard, household, colour threads, clothes stall, sweet stall)** → art-pipeline.md; family descriptions → cast.md.
- **Story-beat data spec and profile/save schema (Build Brief v4 §2, §4)** → architecture (verify against `js/shared/save.js`, `js/shared/story.js`); otherwise drop.
- **Open-ideas gate list (GI)** → stays as ideas.md; make sure any idea Zafar approved inside the feedback docs (GI #10-16, #18, #19 approved; #4-9 TBC) remains there.
- **Plans A4 (station-select grid: dish picture, best time)** and the "day flow" of Cook between stations → modes/cook.md.
- **Landing-page audience note and trailer style (ST 5a-5b)** → vision.md / status.md.
- **Decisions of 25-26 Sept (OH, HO26)** → decisions.md (with SUPERSEDED tags from §2).

---

## 5. Open items and questions for Zafar

**Already in rules.md open list (not repeated in full):** commercial model TBC; *mirchi* plural (confirm with Mum); *kere karein*, green pepper, *moikyo*, *Muke sekelo khape*; skip for spoken replies in Conversations.

**Dates and commitments**
- The clinic's doctor (Hannah's granddad) visits ~9 Oct: record his voice (Round 4 Section G, his instructions G108-G127) and show him the game. Decide early how the pause and refactor fit around this date. · NCS §5, ST
- Zafar to supply a photo of the real doctor's certificate (for the framed wall on CB2b/CB6b). · CL §9 answers
- CB4c (pharmacy belt, straight on, no hatches) art still to come. · CL §9 answers
- Mum's recording session: Round 4 (`Questions for Mum (Round 4).docx`), next from C22 (describing words, my/your, verbs, tenses), then G, E, F, H, D, I, J; re-record list of clips without an OK take (Mum: *cup*, *ambo je mathe*, *amba je mathe*, *chokra sathe*, *chokri sathe*, *Nana sathe*; Zafar: *hakro cup*, *salamun alaykum*, *na, muke na khape*, the S1 chai-things line, *trae bateta*, *hakri lakri*, the *pacheri* pair, *ambo je mathe*, *chokre sathe*) · ST §6

**Play-throughs waiting on Zafar**
- Play all six Cook stations at levels 1-4 (none re-played since the v3 builds); then go through Cook's parked ideas (GI #5, 7, 8, 12, 18, 19 stay TBC; #10, 11, 13-16, 18, 19 approved but unbuilt) before calling Cook finished. · NCS §5, ST, rules A14
- Review the clinic first-pass heal games: drinks, fever, boing, eye, foot. · CL §13k, R-clinic-v2-fixes §6

**Build-report questions (source: `build/reports/*-v3.md`, `art-v3-1.md`, `clinic-v2-fixes.md`; "yes to everything for now" of 30 Sept covered the ones marked)**
- Chai (R-chai-v3 §5): art for black-tea glass and the tipped pan; pictures for in-between pan states; fill-level set; the join word "with" is still English (Q5, ask Mum); extra beats kari/mori in the headline: say if *kari elchi waari chai* is wanted (needs Mum's word order).
- Maani (R-maani-v3 §5): should the dough piles never run out? should a finished maani be tappable back off its plate? X12 headline repeating its row; old tawa/chakla in the Roll-Tawa labs; steel thalis for finished maani stay. Turner word `ph-turner` to record (*moikyo*?).
- Chaat (R-chaat-v3 §5): a real tomato pot (stand-in now) or drop tomato; is take-back "tap the bowl, top layer only" right, and should the demo show it; cap level 3 at 5-6 layers or let the bowl grow; bigger shelf chips on phone (chaat-only or shared); delete the unused `assets/cook/items/chaat-v2/` (~30 files)?
- Daar (R-daar-v3 §6): pot pictures by vegetable (answered: extra pot pictures, done in v3.1); tadka dry chilli/curry leaves always shown; plain-daar trivet bowl; speed asked from L2 (answered yes); Nani's chop card writes quantities at every level but Q7 says heard-only from L3 (answered: hides numbers from L3); retry re-marks the ear star [star removal].
- Samosa (R-samosa-v3 §5 and R-art-v3-1 §5): base-first and two-different-samosas answered yes; **open: when the second kind starts** (auto-switch once the first count is made gives away the count, or a "next kind" button needing a new button word); second block's count heard-only at L3+ or written; matching v3 fry-art set; the fry coach doesn't show the knob.
- Sekelo (R-sekelo-v3 §6, R-art-v3-1): plate skewers drawn close together (want a fanned plate picture); 5th rack slot needs `rack-5`; empty plate seam; decoy potato chunk; old threading board art; R6 "four" cell has five sticks (redo cell 5); ladle came out a dipper (redo from a photo of a real *kadchi*?); stir swirl and review bowl keep D1's dry chilli/curry leaves.
- Clinic (R-clinic-v2-fixes §7): knee flash-stop gives away the count (answered: keep); closed cards from L3 in heal games and pharmacy (answered yes); wrong pharmacy item swapped before the heal game (answered yes); staging needs a three-quarter and a front pose for the doctor and each patient kind; eye cover cannot be taken back; tummy/hic/hair decide later (CQ14); "Again / All patients" on the clinic end screen (answered, **not yet built**); CI1 dentist drill has a small bur: keep?; clinic items cut but not wired.

**Kutchi to ask Mum (new, from these files)**
- "With" for food (*waari / waara*? does it change for plural samosa?) and the nine whole example orders (CP Q5); *sathe* as "together"; "bring me these" / "[Bring me]" (Cook pantry and pharmacy); *kari chai* / *mori chai* to record; *sekelo* as the dish word and *lakri gos* vs *hakri lakri mishkaki*; *hakro* as the first stir count; Nani's "Chop these"; Nani's guide lines N1-N23; samosa phase lines and "fry them" button; maani turner word.
- Clinic words: man, woman, young, tall, short, "with the baby", colours, taste words (sour, sweet, salty, spicy), *koso* (hot) / *nokoso* (lukewarm) / garam (maybe Gujarati), *Muke thadh lage* ("I feel cold"), "my left/right foot", up/down with *dabo/jamno*, *hardar waaro dudh*, *aadu*, *madh ne limu*, *ba chamchi madh*.
- From ST §Waiting on Zafar item 2: *hakro cup* (R8); *watana* (fried) vs *matar* (green peas) for peas (P11); whether Nani says *sambusa*; *Ki aiye?* vs *Ki ai?* (K4); *Alaikum salaam* without *wa* (K2); ⚠ spellings of story lines S1-S9; *dinda/dinde* for an elder; *khanij* vs *khan*; A8.9 "Who did it?" (*kere karein*, Zafar to judge by ear). Settled earlier: *hever kadh* / *hane kadh* both right; "in" is *me*; yesterday *gaykal*. (Big Ma's name: decided "Big Ma", rules decision 11.)

**Product and planning**
- Excel (`content/Nani jo Ghar - Content Master.xlsx`): what role does it play (editable source for lexicon and paradigms, or not)? · NCS §4
- Approve the language-engine design (GF/Sindhi template) and the code target-operating-model when step 2 lands. · NCS
- Landing page: whose voices and faces appear first; pricing decided before it (ST 5c). Trailer needs clinic art plus recorded voice. · ST
- Where do the approved **hands** stay (first-person scenes?) given rules H13 "no hands in Cook"? Hands art exists (hands v3, passed 26 Sept). · ST §7 vs rules H13
- Arc 1's beat script TBC; first launch re-pointed from Eid to the Birthday and its four story panels (0%) redone; Eid arc not designed; quilt-making Big Ma arc has no idea row yet. · ST §1, GI #25
- Cook station-select screen and day flow (PLANS A4); title screen parked; pantry polish waits on the final background render; Find it audit → feedback → build; first-launch re-run; Conversations wiring (9 MVP exchanges). · PLANS, ST
- Wrapper (PWA then Capacitor), offline service worker, privacy policy, store listing. · ST §8
- The Cook speaking pilot (`docs/design/speaking-more-proposal.md`, approved) waits until Cook and the clinic are locked. · ST 4b
- Shared per-child sentence-pattern tracker: later foundation item. · CL CQ2

---

## 6. Stale or conflicting content (annotate or correct when the kept docs move)

**STATUS-TRACKER (→ status.md)**
- Header says updated 29 Sept and "Overall about 24%"; text appended later says 30 Sept; Cook is "v2" in the table, v3 in a paragraph below it. The table should be rebuilt on v3.
- "Cook play-test … **Decisions Q1-Q16 are waiting on Zafar**; no build starts until they are answered" (§1a): answered 29 Sept ~12:30 UTC and built.
- The clinic is 55% in "The path" but 30% in §2, and §2 says the design-system rebuild is 0% and "Zafar plays it → audit": the audit, feedback and v2 fix session are done (R-clinic-v2-fixes).
- §4 Foundation: "Speech recognition (… **voice star**)": the voice star goes (rules decision 2).
- §7 Hands row: "Live in Cook … the hands are too big beside small bowls": conflicts with rules H13 (no hands anywhere in Cook).
- §6 Language: the "Recordings", "Grammar notes" and "Voice clips" rows contain garbled cells (`Was: | **Next session: …** | Was: |` fragments from earlier edits: three versions of the same row pasted together). Needs a clean rewrite.
- §Waiting on Zafar item 2 and the last paragraph: "*mirchi* with no plural vs *marcha*" and "Decided on 26 Sept: *mirchi* is one chilli and *marcha* the plural" contradict rules decision 5 (*mirchi* only for now).
- §1a Chai row: "Nani's line English placeholder" and "kari/mori to record" are still true; Sekelo row "To confirm *Muke sekelo khape.*" still open; other v2 open items are fixed by v3.
- The "Station select … stars" mention is stale (stars removed).
- "User testing is tracked by Zafar, not here" matches rules A15; keep.

**UX-PRINCIPLES (→ ux-principles.md)**
- §4 "It still costs the ear star" and "Hearing it again costs the no-help star": stars are gone; hints cost lightbulbs (rules decision 1). Also "one speaker in each card's top-right corner": superseded by "the face is the replay" (UI28 §9; rules E25/F8).
- §8 "The sidebar, stars and light bulb fade in": stars stale.
- §9 badges: accuracy as slots filling "green for right and red for wrong"; "They stay mapped to the existing stars (craft, ear, no-help) underneath": conflicts with decisions 1-3 (gold/grey tick, no ear or voice star, legacy star code to be removed). §9a repeats "green for the share right, **red** for the share wrong (Zafar is deliberately allowing red here)" and word review "green outline": rules F13/F14 say gold for right and grey for the accuracy tick; red stays only for wrong words in the review.
- §3 "A skewer card always has four dots": check against "no step counters, internal numbers"/"sequences never numbered" (F9, F23) and the order model (CDS §12).
- §11 "A tally with pictures … in the top-right corner": rules E12/F25 allow flat tallies only where kept (chai sugar).
- §15 "Known differences today (29 Sept)": time-bound list; most fixed by the shared button kit, re-check and remove.
- Header says "Zafar's playtest of the Mishkaki grill": fine as history, rename the mode to Sekelo.

**VISUAL-QA (→ process/visual-qa.md)**
- §1 lists only 390x844 and 1366x768; rules C2/C11 add 16:10 laptops and phone landscape and levels 1-4 (and C8's "while iterating: laptop only"). Not contradictory, incomplete.

**GAME-IDEAS-TBC (→ ideas.md)**
- Row 1 still shows *wagar ji* as the source Kutchi though the game uses "don't" rows; its Status column already says so. Idea 25 covers Big Ma's making clothes only: add the quilt-making arc (rules decision 4/11). Idea 12 and 17 match rules (*munje same rakh* kept, fry "take out?" dropped).

**README.md (root)**
- Describes the 23 Sept fruit-bowl MVP, "Cook with Nani … Phase A" with "ear / hand / lightning star cut-outs", "1 to 3 stars, coins and tips", "16 stations", "hold to pour to the line", "knead", first-person hands, Relaxed/Busy patience bar, "the quilt" as progress marker, Eid-decorations hub, and IndexedDB `js/storage.js` shell. All conflict with rules (three badges not stars; bookshelf not quilt; no hands in Cook; pour is a tap-measure; no knead; Birthday not Eid; one save via `js/shared/save.js`).

**ORCHESTRATOR-HANDOFF, HANDOVER-09-26 (being merged)**
- "voice star" (OH 25 Sept decisions), "Monsoon owns Arc 3 Ch1, clinic owns Ch4" (superseded 28 Sept), *marcha* plural (HO26), hands v3 wired (conflicts H13), "sessions: create_session for 6+ in parallel" (conflicts B1), $31.70 OpenAI spend "medium quality only" (consistent with D2 but the $5 pre-flight vs the $2 prototype cap: rules D2 is the newer rule).

**NEXT-CHAT-START (being merged)**
- Nothing contradicts rules.md (it is the source). One inherited detail: "Art stays in ChatGPT via Claude in Chrome (free), unless … under $2" matches D1/D2. The "99 docs" count and "Earlier handovers, to check before archiving" list become obsolete once this mapping is done.

**STATUS/other**
- "Zafar's answers 30 Sept" for daar mention the **ear star** (speed judged by the ear star only; decoy costs the ear star): restate against the three badges when folding into modes/cook.md.

---

## 7. Checkable items

### UX-PRINCIPLES.md (→ ux-principles.md; each line is one candidate QA-checklist row; A = automatable, E = by eye)
- Every round opens with a request card over the play area showing face, request and instructions (E) · UXP §1
- The request card is read aloud and each word or chunk underlines as spoken (read-along) in card, pop-up, Nani's box, person cards (A: class present during audio; E) · UXP §1, CP X2
- When the request finishes the card shrinks into the sidebar (E) · UXP §1
- Sidebar on the left; Done and phase buttons on the right under the thumb (E/A position) · UXP §2
- One card per thing being made (skewer, cup, bowl) (E) · UXP §3
- A card always shows the same number of slots for its dish (e.g. four dots per skewer), whatever is on it (A/E; verify against the order model first) · UXP §3
- No per-line translate or eye buttons; one light bulb at the top of the sidebar (A: element count) · UXP §4
- Light bulb flips text to English for 5 / 3 / 2 / 1 s at levels 1 / 2 / 3 / 4 (A: timing) · UXP §4
- The bulb works by a tap, not a press-and-hold (A/E) · UXP §4
- The bulb counts as a hint / costs a lightbulb on the hints badge (A) · UXP §4, §9, rules decision 1
- One speaker per card (now: the face is the replay); replay costs a hint where the rule says so (A/E) · UXP §4
- A station that combines two jobs is split into phases with a big button between them (E) · UXP §5
- The two-jobs-at-once juggle never appears at level 1 (E) · UXP §5
- Nothing in a station that neither teaches a word nor is fun on its own (chips removed from the grill) (E) · UXP §6
- Level 1 is the smallest possible round (one skewer, one cup, three pantry items); each level adds one thing (A/E) · UXP §7
- First launch goes straight into a three-item pantry round (A) · UXP §7
- First-time help: dim everything but one thing, ghost finger demonstrates once, the child does it, then the next thing is revealed (A: `check_onboard.mjs`) · UXP §8
- First-time help contains no English sentences and no device voice; the child gets the ghost finger plus the Kutchi line with read-along (A: `build/check_onboard.mjs`) · UXP §8, CL §13g
- Every phase and every kind of step of every station has a first-time coach (A: check fails when a phase has no script) · CP X11
- The sidebar, bulb and other UI fade in over the first rounds, not all at once; overlay gone after the first time (E) · UXP §8
- The grown-up skip sits behind the "?" menu, not a visible button (E) · CL G7, CQ15
- End screen is two pages, the same component in every mode (E) · UXP §9, §15
- Page 1 shows three badges side by side (time, accuracy, hints), then a Next button (E) · UXP §9
- Time badge: a big stopwatch outline with the time inside; seconds up to 100 s, then "1m 52s"; caption with crown and personal best in the same format (E) · UXP §9a
- Time badge states: new personal best = bright gold, buzzing, party lines; within ~25% of best = dim gold; slower = grey (E/A) · UXP §9a
- Accuracy badge: a big chunky tick, no circle, no numbers inside; fills like a gauge; all right = whole tick gold and vibrating; caption "7/10" (E); colour of the wrong share: grey per rules decision 3 (UXP text still says red) · UXP §9a
- Hints badge: a big bulb, no number inside; 0 hints bright gold glowing; 1 duller with a crack; 2 very dim several cracks; 3 or more off; caption bulb icon × N (E) · UXP §9a
- Each badge's big picture tells a child who can't read or count how well they did; numbers only in small captions (except the time) (E) · UXP §9a
- Gold means perfect everywhere (one colour language) (E) · UXP §9a
- Page 2 word review: each word a card with Kutchi and English underneath, a tap to hear it; right on the right (gold outline per rules), wrong on the left (red outline) (E) · UXP §9, §9a
- Word review card text is never clipped or overflowing, at phone width and level 4, and shows the word the order used (*hakri*, not *hakro*) (A overflow lint / E) · UXP §15 known differences, CP
- Each mode and level keeps its own personal best and the new-best sparkle shows (A) · UXP §9
- The onboarding kit is the shared `js/shared/onboard.js`, not a mode's copy (A: grep imports) · UXP §10
- Count rows tick when that step closes (put down, finished, served), never the moment the number is reached (A/E) · UXP §11
- Rows tick automatically at every level, when that part is done right (A) · UXP §11
- No red crosses or "wrong" buzzes mid-round from level 2; mistakes show only in the end review; level 1 keeps one gentle correction (E) · UXP §11
- The same kind of action always uses the same gesture inside a mini-game; if ingredients are tapped, liquids are tapped (a tap on the jug pours the right amount) (E) · UXP §12
- A mini-game's controls never change between levels (E) · UXP §12
- The instruction card is the master; Nani does not compete with it for space; one card, the play area, one bulb (E) · UXP §13
- A wrong reply pill in a conversation shakes, the person looks embarrassed (3-4 cycling reactions) and asks again; the first try is logged (A for the log, E) · UXP §14
- End screen, actions (again, next, back), Done/Next buttons, "?" help, Nani's box, order card and bulb look and behave the same in every mode (E: side-by-side with Cook) · UXP §15
- Each comes from one `js/shared/` component (`results.js`, `order-card.js`, `guide.js`, `onboard.js`, `buttons.js`), never a mode's own copy (A: grep) · UXP §15
- Done is the round gold tick bottom right of the play area; Next is an arrow with a short label in one pill style; Again/Home in the same order everywhere; answer pills (haa/na) one style (E) · UXP §15
- Two characters who talk stand three-quarter turned toward each other and partly to the front; they turn to face the player on the child's turn (pose swap with quick crossfade) (E) · UXP §16
- Every talking character has two poses: three-quarter (mirrored for left/right) and front (A: asset exists) · UXP §16
- A character's card never lists everything they will say; it shows the current need only or nothing (E) · UXP §16
- Anything the child places, picks or adds can be tapped to take it back until Done; the first placement is what is scored; where it truly can't be undone, the art shows it (A: take-back test) · UXP §17

### VISUAL-QA.md (→ visual-qa.md / qa-checklist.md)
- While iterating: laptop view (1366x768) only, changed screens only, one screenshot each, looked at and fixed (process) · VQA §0
- Before the one final push to main: the full matrix (phone and laptop, every state) plus the repo's tests (process) · VQA §0
- Uncropped screenshots of every state (all right / mixed / none; 0, 1, 2, 3+ hints; new best / good / plain) at 390x844 and 1366x768 (E) · VQA §1
- One written line per state saying what is right or wrong; "the screenshot exists" doesn't count (process) · VQA §1
- Judged against the design intent: would a five-year-old read it at a glance? do the pieces match in style and size? anything clipped, misaligned, fringed or squashed? (E) · VQA §1
- Art cut by `build/cut_tick_v2.py`'s method: object is everything not connected to the flat background, holes filled; colour-to-alpha for edges and glow; glow cells' core is only the strongly coloured body (A) · VQA §2
- Every cut checked zoomed on the game's cream background: no grey fringe, ring, holes; glow not squared off at the canvas edge (A: grey-leftover flag; E) · VQA §2, CP X14
- Every state of one object shares one canvas registered to its own bounding box; pixel-diff overlay for layered states (A) · VQA §2
- Code that maps a value onto art (fill %) maps onto the object's extent, not the image's (A/E) · VQA §2
- Before a background prompt: who sits/stands where, at what share of the height, what stays clear; numbers in the prompt (process) · VQA §2b
- Background approved only after overlaying the real character art at game size with the 16:9 visible box (red box); check heads, feet, wall pictures, room for everyone (E) · VQA §2b
- Ship: run `bump_version.py`, push branch and `HEAD:main` (A) · VQA §3
- Confirm the GitHub Pages build ran for that commit; only then tell Zafar it is live, with a screenshot (process) · VQA §3
- Visual or judgement work goes to the top model; the orchestrator looks at the screenshot itself before reporting done (process) · VQA §4
- Shoot every state that draws something different, not only start/mid/end (a hob: heating with flames and gauge, turned down, pan lifted away, boiled over); levels 1-4 where layout changes with the count (1-4 burners); each station's shoot script names its states in its header (process/A) · VQA §5
- The reviewer lists what is wrong before anything is right: per shot, crop ×2 on the focal object and list every flaw (alignment, overlap, crowding, empty or lit-but-unused things, labels, differences from the approved mock-up) (process/E) · VQA §5
- Compare with the approved mock-up (`build/reports/*-mockup/`) side by side, not from memory (E) · VQA §5
- Measure what can be measured: `python3 build/check_vessel_meta.py` passes (each vessel's recorded centre matches its art's rim); add a check whenever art metadata drives placement (A) · VQA §5
- The builder doesn't mark its own homework: the orchestrator or a fresh session reviews the final shots (process) · VQA §5
- Tests passing is not "done" for visual work (`test_cook.py` is a play-through, it never looks at the picture) (process) · VQA §5

*(Added for the checklist from rules.md C2 and CP, not in these two files: 16:10 laptops 1440x900 and 1280x800, phone landscape, nothing covers a tap target before each tap, contact shadows, equal shelf-band padding top and bottom, no "…" ellipsis, no English in first-time help.)*
