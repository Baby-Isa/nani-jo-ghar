> **Harvest notes from step 1a (30 Sept).** Paths in the tables are the OLD names (before the move); `moves.json` in this folder maps each to its new place.

# Step 1a, batch B: game design, story, modes (41 files)

Read-only pass over `/home/user/nani-jo-ghar/docs/`. All paths below are relative to `docs/`. The prompt said `modes/` has 20 files; it has 18 (listed below). Read fully: rules.md, the four core docs, the six short mode briefs, `story-by-the-fire-design.md`, `clinic-v2-design-sheets.md`, `first-launch-story.md`, `speaking-more-proposal.md`, `cook-design-system-v1.md`, `game-modes-v2.md`, `game-modes-fun-analysis.md`, `free-play-and-world-ideas.md`, `ideas-2026-09-28-arcs-and-focus.md`, `sidebar-design.md` (sections 1 to 8), all ten build logs (first ~1,000 chars of the long ones). **Skimmed** (headings, status lines, decisions and "stars/rewards" sections, greps for the contradiction terms): `clinic-design.md`, `conversations-design.md` (headings, sections 1, 5.4, 7.7, 10a), `find-it-design.md`, `tidy-up-design.md`, `dress-up-design.md`, `who-did-it-design.md`, `monsoon-rush-design.md`, `snap-design.md`, `conversations-wiring.md`, `REVIEW-2026-09-25.md` (read most of it).

Convention: the five parked-mode design docs, Find it, Clinic and Conversations are all stacked layers (Mini-game quality pass, then Pipeline design, then Deep dive, then the original sections, each "superseding where they conflict"). The top two layers are current; everything below is history that still carries some live content (word lists, leak rules, art lists, build briefs).

---

## 1. Mapping table

| path | lines | verdict | target | reason (one line) | harvest note |
|---|---|---|---|---|---|
| Nani jo Ghar — Project Brief.md | 150 | MERGE | docs/vision.md | Pitch, audience, success and non-goals are the vision; scope, roles and "documents" tables are stale | Pitch, why, audience table, success ladder, principles, non-goals into vision.md (see 1c). Language-authority + class-handout rights table into language/lexicon.md; the "systematic r/d pattern" note into language/grammar-notes.md. "Scope of first release" (one room, one stall, 60 words, quilt) goes to status.md as history only. "Roles", "Rules for working with Claude", "Documents" tables: none, all in rules.md or obsolete |
| Nani jo Ghar — Game Design.md | 308 | MERGE | game-design/progression-and-scoring.md (primary); vision.md; design-language/audio.md; ux-principles.md; modes/first-launch.md | Already marks itself partly superseded; its live content is the per-word model, rejected mechanics, Grandparent mode, notebook, speaking stages | Per-word stage table and drop-back rule, pocket money/functional purchases, notebook: progression-and-scoring.md. "Mechanics rejected" table + "nothing may make a child feel bad" + Grandparent mode + age-fit table: vision.md. Recording method, multiple voices, sound design: audio.md. Accessibility: ux-principles.md. "Teaching without cutscenes" (fixed frame, five mechanisms, worked first session): vision.md pillar, worked example to modes/first-launch.md. World (hub and spokes, semi-open, travel two taps, people live here) and Unit 1-9 scene catalogue and blanket quest: story-and-arcs.md. Free-text spelling-match algorithm: language/lexicon.md or architecture. Build-order gate table: status.md. Art direction: see section 6 (conflicts with rules.md) before moving to art-bible.md |
| Nani jo Ghar — Roadmap and Story Structure.md | 445 | MERGE | game-design/story-and-arcs.md (primary); design-language/ui-design-system.md; architecture/; progression-and-scoring.md; status.md; process/regressions.md; cast.md | The newest arc/story doc; about half is arcs and story (keeps), the rest is layout, shell, phases, lessons that belong elsewhere | To story-and-arcs.md: Nani's role, story structure levels table, how the story is told, story beats, Story arcs (Arc 1 table, day-out template, trips table, cross-arc spine, standalone arcs, Eid moved, old five-arc mapping), syllabus S1-S6 + grammar-forced + gaps. To ui-design-system.md (after correcting, section 6): layout contract v2, carried container, item zones, background brief, sidebar. To architecture/: thin shell spec, storage rules, platform decisions. To progression-and-scoring.md: learning design decisions, skill-channel rungs, procedural generation. To status.md: workstreams, phase sequence, MVP scope (as history). To process/regressions.md: the 12 "Lessons". To cast.md: recurring cast table. Design research table (Habgood, TPR, TBLT, narrative load, cozy) to vision.md or the mode-design method file. First test errand (fruit bowl) to modes/find-it.md as reference |
| Nani jo Ghar — Cast.md | 123 | KEEP | game-design/cast.md | Only cast doc; accurate except the arc headings | Correct the stale arc labels and the Kasuku "after a mistake" line (section 6); art-rule parts (likeness notes, skin tones, hands) may be cross-linked from art-bible.md. Skin-tone "to do: fold into art bible" is still open |
| modes/BUILD-COMMON.md | 26 | MERGE | architecture/testing.md | Rules mostly in rules.md B17/B6; the test-port table is unique | Port table: Find it 8801, Tidy up 8802, Who 8803, Dress up 8804, Monsoon 8805, Clinic 8806, Snap 8807, Foundation 8800 (and leak-bot requirement: Node bot, level 1 not winnable blind). Rest: none, in rules.md B17, B6, H1 |
| modes/DEEP-DIVE-BRIEF.md | 36 | MERGE | process/mode-design-method.md (new; or archive if Zafar prefers) | One-off agent brief, but its five principles are the mode-design method | Principles: each mode a set of mini-games; one mechanic per file, tagged new/reused/shared; speaking core with closed set + fallback; phased own-files-first build brief; Sceptic rule + blind-bot estimate. "Voice star" line is stale (section 6) |
| modes/MINIGAME-QUALITY-BRIEF.md | 23 | MERGE | process/mode-design-method.md | Five questions are in rules.md H2; the "cut to best" procedure and per-stage caps are not | Score on 5 questions (1-5), keep at most 6-8 per stage and 8-10 for a big library, "maybe later" list, distinctness check across modes, level-1 walkthrough paragraph per first-set game, research named mechanics from current children's apps |
| modes/MODE-DESIGN-BRIEF.md | 138 | MERGE | process/mode-design-method.md | The design template and persona set; non-negotiable leak list is the most complete one | Personas (Layla 5, Zayn 8, Maryam 11, Zafar 38, Farah 34, Nani 68, the Sceptic, the Builder); "known leak patterns" list (9 items); doc template (12 sections); loop-0 to loop-3 method; "calm and clarity" list. Star lines (section 7 of the template) stale |
| modes/PIPELINE-BRIEF.md | 30 | MERGE | process/mode-design-method.md | Zafar's "factory-like" pipeline rule with the clinic worked example | Pipeline-of-stages rule (rules.md H1 states it in one line); the 5-stage clinic worked example; "stitches and injections are fine" steer (25 Sept); list of reference doctor apps |
| modes/OVERVIEW.md | 97 | MERGE | docs/README.md (mode index table); then ARCHIVE | 25 Sept snapshot; core-verb/status table and "what all designs agree on" still useful, story homes and decisions stale | Keep the core-verb table (Cook build, Find it search, Tidy arrange, Dress style, Clinic treat, Who deduce, Monsoon react, Snap aim/capture). Shared family-words priority list (position, colours, describing, kinship, yes/no, body, weather, clothes, rooms, animals, past tense, comparatives) to language/mum-questions index or lexicon.md. "New art types to test small" list to art-pipeline.md. Decisions 1-19: still-open ones in section 5 |
| modes/REVIEW-2026-09-25.md | 218 | RECORD | docs/feedback/ (as a dated review) | Independent review with verdicts, cross-mode overlap rulings and the A-F decisions | Keep whole. Before filing, carry the overlap rulings into the mode docs (list in section 4): Monsoon owns Arc 3 Ch1, clinic owns Ch4, Dress up weather to Ch4, Tidy up M8 dropped, Snap M12 cut, door scenes named `doorway-floor` / `front-door`, one rotating hub daily |
| modes/clinic-design.md | 1804 | MERGE | game-design/modes/clinic.md (see 1b) | Base doc; top two layers current, three revisions and the 12 original sections are history; superseded in part by the v2 sheets | Skimmed. Live parts to carry: quality pass Q1 rules, Q4 healing library (nine kept/11 cut), P1 pipeline and P2-P4 stages, P8 stitching and first-ever session, R3.2 left/right ladder, R3.4 speaking moments S1-S8, R2.7 keeping the doctor warm, 7.2 album/collections, 7.3 upgrades, 7.4 safety checklist, P10/R3.6 words-needed list, section 9 art list, P12 build brief. Everything else (Revisions 1-2, sections 1-6, 10-11) to archive. Lolly lines need fixing (section 6) |
| modes/clinic-v2-design-sheets.md | 198 | KEEP | game-design/modes/clinic.md (becomes its current spine) | 29 Sept, newer than clinic-design.md; built from Zafar's clinic playtest answers | **This is the current clinic design** for the five rooms and the nine heal games. One conflict with rules.md (waiting room size, section 6) |
| modes/conversations-design.md | 749 | KEEP | game-design/modes/conversations.md | Only Conversations design; section 10a holds Zafar's 26 Sept decisions | Annotate: voice star (5.4, 10a.7) superseded; arc map 7.7 uses the old five arcs; Achija/Aabhar aanjo lines superseded by 10a itself. Merge conversations-build-log decisions in |
| modes/conversations-wiring.md | 273 | KEEP | game-design/modes/conversations-wiring.md (appendix; archive once wired) | Wiring of the 15 MVP placements is not done (STATUS-TRACKER line 36) | None yet; archive when FL/CK/CL hooks are in. Line numbers will have drifted |
| modes/dress-up-design.md | 1179 | KEEP | game-design/modes/dress-up.md | Parked mode design; pipeline + quality-pass layers current | Skimmed. Merge dress-build-log. Fix star/quilt/nar/hikdo references (section 6). Story homes (Eid morning, "The spill", wedding) need re-homing to Making clothes with Big Ma arc |
| modes/monsoon-rush-design.md | 1428 | KEEP | game-design/modes/monsoon-rush.md | Parked mode design; now a proposed standalone arc | Skimmed. Merge monsoon-build-log. Its P.10 already maps stars under the three badges (good model for the others). Fix nar/stars/quilt |
| modes/snap-design.md | 1272 | KEEP | game-design/modes/snap.md | Parked mode design; Snap now belongs to every day-out destination (29 Sept) | Skimmed. Merge snap-build-log. Re-home Arc 5 "village" story to day-out trips; fix stars/quilt/nar |
| modes/story-by-the-fire-design.md | 133 | KEEP | game-design/modes/story-by-the-fire.md | Current, consistent with rules H40; nothing built | None; Story.log API and page templates are the content. Check wording "voice" in gap ladder G4 uses pocket money not star (it does) |
| modes/tidy-up-design.md | 1244 | KEEP | game-design/modes/tidy-up.md | Parked mode design; Roadmap's "Put it there" = this mode | Skimmed. Merge tidy-up-build-log. Fix stars/quilt/nar. Pill organiser (T6) idea here is the one rules H46 keeps dropped for the clinic |
| modes/wave5a-brief.md | 15 | ARCHIVE | docs/archive/ | One-off Cook UI run brief (Wave 5A) | none — checked: its 8 points (intro card, sequence list, no step pills, "?" help, Nani says less, sidebar, no coin counter, word-review result card) are all in rules.md E2-E4, E27, F-section and cook-design-system-v1 §3/§10 |
| modes/who-did-it-design.md | 1338 | KEEP | game-design/modes/who-did-it.md | Parked mode design; proposed standalone arc (29 Sept) | Skimmed. Merge who-build-log. Fix stars/quilt/nar/marcha; "Case of the day" daily (line 778) to be reconciled with "one hub daily" |
| find-it-design.md | 975 | KEEP | game-design/modes/find-it.md | Only Find it design; top layers current | Skimmed. Merge find-build-log and the Roadmap's fruit-bowl reference errand. Fix stars (Q2 sharp-eye star, D4 voice star, "ear star" throughout), nar, hikdo. Four open questions (section 5) |
| first-launch-story.md | 128 | KEEP | game-design/modes/first-launch.md | Agreed, built flow with Zafar's decisions | Merge first-launch-build-log. Flag "Tomorrow is Eid" hook (Roadmap known follow-up) and the record list built on it (section 5) |
| free-play-and-world-ideas.md | 125 | MERGE | docs/ideas.md; vision.md (future languages) | Idea assessment of 23 Sept; most absorbed in Roadmap/modes | Free-play version of every mode (rules H1 has "lab and free play"); places map after Chapter 1; "Puzzle Pirates" translation (skill = the language); "other languages later" (keep templates in data; rules J10 has one line); Pokemon-style walking world = No. Streaks/stars/daily lines are stale. Then ARCHIVE |
| game-modes-fun-analysis.md | 222 | MERGE | vision.md (personas) + process/mode-design-method.md (checklist); then ARCHIVE | Personas and the 10-point fun checklist are reused by every brief; the rest is superseded | Personas table and "what the personas tell us" (primary target 6-11 plus the parent); fun checklist (10 points); "what makes genres addictive" list; Good Pizza loop as Cook's model (context for cook.md). Lineup/"daily word of the day" sections stale |
| game-modes-v2.md | 164 | MERGE | docs/README.md (mode table); progression-and-scoring.md (upgrades); modes/cook.md (stations); then ARCHIVE | "Syllabus first" approach and eight-games table; upgrade rules; Cook stations table | Syllabus-first method; "what the syllabus demands" table (S1-S6 to game-kind) to story-and-arcs.md; upgrade design (one wallet, per-game shop, limited slots, physical steps only) to progression-and-scoring.md; Cook station table and Kutch specialities (bajra rotlo, khichdi, kadhi, dabeli) to cook.md; greetings-as-choice-in-every-mode idea (replaced by Conversations) noted; feasibility table and "avoid entirely" list to vision.md. Section 4 arc table is the old Arc 1: stale |
| ideas-2026-09-28-arcs-and-focus.md | 41 | ARCHIVE | docs/archive/ | Zafar's raw 28 Sept thinking; every point is now in the Roadmap, story-by-the-fire or Cook design system | none — checked: Nani's role, day-out template, Birthday, Story by the Fire are in Roadmap; sidebar complaints (two-line words, two people icons, Nani's narrator box, recipe cards without intro line) are in cook-design-system-v1 §3; "hands out everywhere" is rules H13. The "focus: lock one mode then the next" question is answered by rules H41 order of work |
| sidebar-design.md | 180 | ARCHIVE | docs/archive/ | 23 Sept proposal for a right-hand tabbed sidebar; replaced by cook-design-system-v1 §3/§12 and UX-PRINCIPLES | Two live ideas to ideas.md: (a) Explore/magnifier button ("tap anything to hear its Kutchi name", open decision 4, option c: counts as hinted), (b) a Notebook tab (dictionary/collection). Palette (indigo/madder/marigold) is superseded by CDS tokens. Everything else superseded, see section 6 |
| design/cook-design-system-v1.md | 192 | KEEP | design-language/ui-design-system.md (§2-4, 6, 7, 10 pop-up, 12 order model, 13 kit); station specs (§1, 5, 11, 13-15) to game-design/modes/cook.md | Rules H10 names it Cook's single source of truth; it is half tokens/components, half Cook station specs | Split as stated. Add a section 7 "Checkable items" (see section 7 below, these feed qa-checklist.md). Fix `marcha` (section 6) and the §4/§15 viewpoint inconsistency |
| design/speaking-more-proposal.md | 90 | KEEP | game-design/speaking.md (new; or fold into modes/conversations.md) | Approved 29 Sept, nothing built; holds the speaking ramp detail rules E32 only summarises | Keep whole: watch/handover/say-it-after ladder (4 rungs), the inventory of natural speaking points per mode, the Cook ordering pilot spec, open question 3. Voice-star lines stale |
| clinic-build-log.md | 65 | MERGE | modes/clinic.md ("Build status") | Decisions and leak numbers exist nowhere else | What's built (visit engine, mechanics, lab), nine decisions (minTested, voice-star two-row rule [now moot], V4 has no ear slot, sides follow R3.2, level-2 tools drawn evenly), leak-bot table, hotspot sizes (tooth under 1 cm even zoomed: open), known gaps. Then ARCHIVE |
| conversations-build-log.md | 16 | MERGE | modes/conversations.md | Short; records §10a applied and engine facts | Register balance kept across sessions; queued second tap; R4/R5 capped to R3 until Say wired; 23 tests; nothing wired into pages. Then ARCHIVE |
| dress-build-log.md | 66 | MERGE | modes/dress-up.md | Leak numbers and 8 decisions | Leak table, real-Kutchi slice rule (report apart), decisions 1-8 (DOM/SVG not Phaser; house clothes greyed; num-04/05 not recorded), next phase list. Then ARCHIVE |
| find-build-log.md | 50 | MERGE | modes/find-it.md | Leak numbers, digit-leak fix, 7 decisions | Digit shown only while the number word is taught (stage <= 1; old rule gave 14.3%); wadho spelling override; asked sizes dealt mixed; F3 "not tested" while positions are placeholders. Then ARCHIVE |
| first-launch-build-log.md | 42 | MERGE | modes/first-launch.md | Builder defaults for the agreed flow | Flow as built (9 scenes), story-help device setting (English then Kutchi default, Kutchi only), five skin tones, placeholder Kutchi sources, "Yes/No runs away twice then vanishes". Then ARCHIVE |
| monsoon-build-log.md | 47 | MERGE | modes/monsoon-rush.md | Leak numbers and 11 decisions | Menu words never called; sequence means order counts; drops never wait in Drizzle; english-clip bot 34/34 null. Then ARCHIVE |
| snap-build-log.md | 38 | MERGE | modes/snap.md | Leak numbers, 8 decisions, perf numbers | HTML not Phaser; orchard dealt per seed; lens star thresholds; hand-in never sticks. Then ARCHIVE |
| tidy-up-build-log.md | 82 | MERGE | modes/tidy-up.md | Leak numbers, 12 decisions, stubs table | Masala dabba from L2; no "next to" in dabba; places drawn uniformly; stubs to swap (rel, say, fetch, passme); screenshot-found bugs; left-for-next list. Then ARCHIVE |
| who-build-log.md | 60 | MERGE | modes/who-did-it.md | Leak numbers, 9 decisions | Eaters drawn with replacement; one word one meaning per line-up; pills audio-only below stage 3; `tell` stub. Then ARCHIVE |
| cook-with-nani-build-log.md | 226 | MERGE | modes/cook.md; progression-and-scoring.md (section 8 upgrades table); process/regressions.md (bug table) | 24 Sept overnight build: decisions, persona reviews, station upgrade table | Upgrade table (per station: in the build vs real upgrade; "sugar counting deliberately none"; "no upgrade touches the Kutchi"); days 1-5 story; stations list; shop numbers (375 coin shop, 175 story) now superseded by decision 10; bug table (section 3) to regressions. Then ARCHIVE |

### 1b. Mode-doc merge plan (task 1)

| Mode | Target | Merges into it (from this batch) | Not in this batch (for other readers) |
|---|---|---|---|
| Cook | game-design/modes/cook.md | cook-design-system-v1 §1 (diagnosis), §5 (chai v2), §9-11, §13-15 (station specs: chai, maani, daar, chaat, samosa, sekelo); cook-with-nani-build-log (stations, days, upgrades, persona reviews); game-modes-v2 §7 (station table, recipes, Kutch specialities); game-modes-fun-analysis §5 "Cook in detail"; OVERVIEW row | cook-with-nani-phase-a-design, recipes-guide, todo, words, kutchi-audit, cook-word-changes-B, cook-playtest feedback |
| Clinic | game-design/modes/clinic.md | **Current = `clinic-v2-design-sheets.md` (29 Sept)** for the waiting room, diagnosis, pharmacy, send-off and all nine heal games; `clinic-design.md` (v1, 25 Sept, 1,804 lines, never updated after the v2 sheets) is the base for everything the sheets do not redo: pitch, safety, left/right ladder (R3.2), speaking moments S1-S8 (R3.4), words needed, stitching/first session, album/upgrades, art list, build brief. Plus clinic-build-log | feedback/clinic-playtest-2026-09-29.md (the sheets cite its §9/§11) |
| Conversations | game-design/modes/conversations.md | conversations-design; conversations-build-log; conversations-wiring as appendix; speaking-more-proposal cross-linked | first-launch placements |
| Story by the Fire | game-design/modes/story-by-the-fire.md | story-by-the-fire-design (133 lines, whole) | Roadmap story-beats text (already in story-and-arcs.md) |
| First launch | game-design/modes/first-launch.md | first-launch-story; first-launch-build-log; Game Design's worked first session (pantry, frame, five teaching mechanisms) | conversations-design FL2-FL8 placements |
| Find it | game-design/modes/find-it.md | find-it-design; find-build-log; Roadmap "First test errand: fruit bowl" | REVIEW (Find it section) |
| Tidy up | game-design/modes/tidy-up.md | tidy-up-design; tidy-up-build-log. Roadmap's "Put it there" mode is this mode | |
| Who did it? | game-design/modes/who-did-it.md | who-did-it-design; who-build-log. Absorbs the old "Ask around" and the deduction half of "At the door" | |
| Dress up | game-design/modes/dress-up.md | dress-up-design; dress-build-log | |
| Monsoon rush | game-design/modes/monsoon-rush.md | monsoon-rush-design; monsoon-build-log | |
| Snap | game-design/modes/snap.md | snap-design; snap-build-log | |

Open gap: the Roadmap's Arc 1 still says it needs "Put it there" and "Hide and seek, both still to build". Put it there is Tidy up. "Hide and seek" has no mode doc of its own: candidates are Find it (M4 Simba's mischief) or Who did it? (sweets case). See section 5, Q1.

### 1c. What vision.md should draw on (task 2)

| vision.md section | Draw on |
|---|---|
| Pitch | Brief "What we are building" (hub = Nani's house, act on spoken Kutchi, every voice a real family member, web app wrapped for stores); Game Design "The core loop" (one errand = 5-8 min, instruction > journey > recognition > return > recall); update to today's shape: modes + arcs + Nani as guide (Roadmap "Nani's role") |
| Why it exists | Brief "Why it exists": four reasons (Zafar, Isa and cousins, Mum's teaching structure, a project with Mum); nothing adequate exists; no Kutchi ASR/TTS (constraint and later corpus opportunity) |
| Audience | Brief "Who it is for" table (children 4-11, adult heritage learners, the teaching adult; "the third audience is central"); Game Design "Session shape and age fit" (age table, tone, accessibility); game-modes-fun-analysis §1 personas (Layla 5, Zayn 8, Maryam 11, Zafar 38, Farah 34, Nani 68) and "primary target 6-11 plus the parent" |
| Success | Brief "What success looks like" (5-step ladder; Mum enjoying recording is the gate; explicitly not downloads/streaks/time in app); rules.md J9; Game Design "Build order" closing gate ("stage two is the real gate") |
| Design pillars | Brief "Design principles" 1-11, each re-checked against rules.md (amend 4, 7, 8, see section 6): per-word difficulty; the task is the test; no cutscenes (beats skippable); English never spoken [amend: story lines]; every voice a real person; nothing is ever lost; calm vs busy places; progress is an object [now a bookshelf]; nothing leaves the device; text never in an image; content model first. Add from Game Design: "nothing in this game may make a child feel bad", "Grandparent mode is the one to protect" (not in rules.md at all), warm failure. Add from Roadmap "Design research": intrinsic integration / "could the player win without Kutchi?", TPR, task-based teaching, narrative load, cozy progression |
| Out of scope / will not do | Brief "Non-goals" (not CEFR, not script-teaching, not dictionary/archive, not a replacement for speaking to grandma, not multi-dialect; "not a business" is contradicted by rules.md decision 7, see section 6). Game Design "Mechanics rejected" table (double-or-nothing haggling, endless runner between places, streaks/daily goals, lives, leaderboards, card battlers/escape rooms, Kutchi TTS, script teaching, cutscenes) with the reasons. game-modes-v2 §5 "avoid entirely" (3D, physics piles, multiplayer, full-body animation); free-play §4 (Pokemon-style walking world: No for MVP; multiplayer/social: No). Brief "Out of scope for now" is stale |
| Future | free-play §6 other languages (keep grammar out of engines: rules G13); rules J10 Gujarati next; speaking stage 3 corpus (Game Design "Audio and speaking") with "a line to hold" (child recordings never uploaded; adults' voices only by consent) |

---

## 2. Decisions found (not already in rules.md)

Decisions already covered by rules.md (na not nar, khun, khuda-fis, aai/tu, thank you in English, apple not lolly, hints cost lightbulbs, the Birthday arc, Story by the Fire, Snap at every destination, travel as a belt, bookshelf, Big Ma naming, pocket-money model, etc.) are omitted.

**Project-level (Sept 22-24)**
- 2026-09-22 · The world is a Muslim Kutchi one: headscarves/dupattas, no tilak or temple imagery, minaret not shikhara, Salamun alaykum, halal butcher, food cooked in Kutchi Memon and Khoja homes · already mostly in rules I1; "minaret", "butcher", "Memon and Khoja homes" are extra · Game Design § Art direction
- 2026-09-22 · Romanised spelling only, matched generously; family's preferred spelling shown afterwards so people converge without being marked wrong · also G4; the "shown afterwards" detail is new · Game Design § Teaching without cutscenes (Free text)
- 2026-09-22 · Systematic differences (e.g. r where the handout says d) are proposed in one pass once a pattern appears; Mum and Masi still confirm · Project Brief § Language authority and rights
- 2026-09-22 · Class handouts (copyright GTP Course): private use fine, vocabulary not ownable, their rhymes/lesson text/images/layouts never shipped; unit sequence fine as inspiration for scene order · Project Brief § Language authority and rights (rules G1/G21 summarise)
- 2026-09-22 · Handwriting is deliberately absent; writing practice only in the Notebook, only from stage 3, only for "Can type" profiles · Game Design § The notebook
- 2026-09-22 · Stage-two speaking is closed-set classification among a known handful of words trained on ~5 family recordings each (few-shot keyword spotting); stage one is shadowing (record yourself, play beside the family clip) · Game Design § Audio and speaking (E32 summarises the ramp only)
- 2026-09-22 · Recordings made in the app never leave the device; any future corpus comes only from adults who chose to contribute, never mixed with children's · Game Design § Audio and speaking (rules I15 covers children's voices)
- 2026-09-22 · Multiple voices are a feature: the same word by Mum, Masi and a cousin, played at random · Game Design § Audio and speaking
- 2026-09-22 · Grandparent mode (the adult holds the phone and plays the shopkeeper, reading their line; she marks it) is "the one to protect" · Game Design § Mechanics adopted. **Not in rules.md**
- 2026-09-22 · Warm failure: a wrong answer gets a gentle spoken "Arre re!" from Nani, never a buzzer; warm chime for correct · Game Design § Mechanics adopted / Sound (rules E10 restates "no buzzes")
- 2026-09-22 · Mystery containers (unlabelled jars chosen by ear) and "play both sides" (child is the shopkeeper) and an end-of-session "errand log" recap are adopted mechanics · Game Design § Mechanics adopted
- 2026-09-22 · The notebook is dictionary + collection + quest tool + writing practice, and a cram grid sorted by shakiest word for adults · Game Design § The notebook. Status unclear after the bookshelf decision, see section 5
- 2026-09-22 · Pocket money "buys things that change play" (extra seconds, a hint that pauses the clock, a new shelf that opens words); "money that buys hats is grinding" · Game Design § The quilt · **[SUPERSEDED in part by rules.md decision 10 (volume x quality x difficulty, paced upgrades) and decision 1 (hints cost lightbulbs, not money)]**; the "no cosmetic purchases" stance survives in snap-design and tidy-up-design
- 2026-09-23 · Nani's house is in Kutch, not the UK; the monsoon is a real Kutch monsoon · Roadmap § Setting
- 2026-09-23 · New words per errand: three to start, up to five or six for fast players; never labelled easy or hard · Roadmap § Learning design decisions
- 2026-09-23 · Pre-exposure: at the bowl/pot step Nani names things already added so the next errand's words are heard first · Roadmap § Learning design decisions
- 2026-09-23 · Quantities are shown ("2 x santra" with dots) and heard; supersedes "no digits on the list" after playtest 1 · Roadmap § Learning design decisions · **[SUPERSEDED by rules.md counting rule E12 and cook-design-system-v1 §12 "no pips, no digits"]**
- 2026-09-23 · Buying quantity is tap-per-unit with the target shown on a chalkboard in large digits and a running sidebar count; capped at the asked number · Game Design § Buying quantity (a working assumption, never play-tested) · **[SUPERSEDED by rules.md E12/F25: the tally shows what you did, never the target]**
- 2026-09-23 · Sidebar on the right; counts as dots only; hint button first press replays slowly, second press makes the item glow · sidebar-design § 8 · **[SUPERSEDED by rules.md F4 (left, ~22%) and decision 1 (the light bulb is the help)]**
- 2026-09-23 · Skill channels by word stage (six rungs: audio+picture+glow > fading audio > romanised text (reads flag) > picture-only say it (role reversal) > type it (writes flag) > answer a question aloud) · Roadmap § Skill channels
- 2026-09-23 · Profiles carry "Can read" and "Can type" toggles set by an adult, neither a difficulty setting · Roadmap § Thin shell spec
- 2026-09-23 · Errand lists are generated from due + new words with look-alike decoys; the generator only picks combinations whose recorded chunks exist and outputs the next recording list · Roadmap § Procedural generation
- 2026-09-23 · Target about 400 words plus about 40 sentence frames; six internal syllabus stages S1-S6 never shown to players; S3+ stage-to-arc mapping provisional · Roadmap § Syllabus
- 2026-09-23 · Free play = a generated, endless, scored version of each mode; a tap-to-travel places map after Chapter 1; no Pokemon-style walking world in the MVP · free-play-and-world-ideas § 4-5 (rules H1, H56 cover the gist)
- 2026-09-23 · Coins from any game go to one wallet; each game has its own shop of upgrades that change how it plays; limited slots so every purchase is a choice; upgrades only automate physical steps · game-modes-v2 § 3 (rule H6 has only the last clause)
- 2026-09-24 · Big Ma is the family seamstress; instead of a tailor's shop the child goes to Big Ma's room; she sings while she sews (Zafar's wife records it) · Cast § Big Ma (rules I7 covers)
- 2026-09-24 · Kasuku (African grey, Swahili for parrot) speaks family recordings pitch-shifted with a squawk added, no extra recording; can also greet with "Salamun alaykum!" and, favouring weakest words, repeat a recent word; tap to hear it · Cast § The parrot (rule I9 has idle-moments-only)
- 2026-09-24 · Zafar's skin tone is the basis for every generated generic character (midtone about #C49A78, highlights #D8B894, shadows #A07A60, daylight face #BE826B) · Cast § Skin tones
- 2026-09-24 · The player's hands: boy = white linen sleeve rolled back; girl = rolled sleeve in a soft colour with a few thin glass bangles; Nani's hands unchanged (red sleeve, gold bangles and rings) · Cast § The player's hands. Note Cast later says Nani has **no bangles**, so this line is self-contradicting
- 2026-09-24 · Nani's close-up (leaning on the counter, waist up) is her canonical in-game framing; every later Nani image from sheet v2, never the photos · Cast § Approved character sheets
- 2026-09-24 · Cook: one upgrade per station bought with coins, money is the choice; "no streak that can break", instead "You've cooked with Nani on N days"; stars/coins/tips kept; quick order (one customer ~2 min) and free cooking biased to weak words; tap anywhere to skip a line · cook-with-nani-build-log § 1, 4-5 · **[stars/coins/tips SUPERSEDED by rules.md H5/J7 (three badges); "never lose what you earned" stands]**
- 2026-09-24 · Cook "sugar counting deliberately has no upgrade"; no upgrade touches Kutchi; a masala dabba only ever as décor, never opening the right spice · cook-with-nani-build-log § 8
- 2026-09-24 · Helpers as family staff with a daily wage (tycoon-style) proposed as a real upgrade · cook-with-nani-build-log § 8 (not decided; conflicts with "never lose what you earned", see section 6)

**25-26 Sept (mode design)**
- 2026-09-25 · Zafar took every default in every mode design doc · modes/BUILD-COMMON.md line 3 (so each doc's "defaults in bold" are settled unless listed open in section 5)
- 2026-09-25 · Mode pipeline brief: "almost factory-like, a set process"; stitches and injections are fine in the clinic (reversing "no needles, no stitches") · modes/PIPELINE-BRIEF.md (OVERVIEW still says stitches/needles rejected: stale)
- 2026-09-25 · Mini-game quality brief: pick the best, "20 sewing mini-games might be too much", at most 6-8 per stage, 8-10 for a big library · modes/MINIGAME-QUALITY-BRIEF.md
- 2026-09-25 · Clinic: it is the doctor's clinic (Hannah's granddad), the child first a patient then his helper; the child never gives medicine, hands it to the doctor who names and checks it (a spoken word review in the fiction); pill organiser dropped (goes to Tidy up for older children); sides only from the patient's own mouth ("my left knee"); level-4 "patient gives a clue" not in first set · modes/clinic-design.md § R3.1 (rules H25-H27 cover gist)
- 2026-09-25 · A clinic level 1 morning is 2 check-ups and 2 named ailments, first visit always a check-up; "level" follows word stages, not a door · clinic-design § R3.1 (default, Zafar "didn't follow the question; left to me")
- 2026-09-25/26 · Snap: Zafar overruled the review's "don't build now", so the engine is rethought (still scene, rectangle evaluator, HTML prints) · snap-design § D (line ~619)
- 2026-09-25 · Monsoon: the cats are called *wadho/nindho* in calls, never *Simba/Zazu*; consequences carry forward but never punish (rained-on washing becomes stage-4 work, never a lost star) · monsoon-rush-design § P.9 (defaults)
- 2026-09-26 · Conversations 10a.4: Nani and Nana get the same respect form · conversations-design § 10a
- 2026-09-26 · Conversations 10a.6: register is graded from S2 and spoken from S3 · § 10a
- 2026-09-26 · Conversations 10a.8: the wrong-register reaction is a gentle head scratch or embarrassed look cycling through 3-4 expressions; no "looks behind him" joke · § 10a (rules E26 has "embarrassed")
- 2026-09-26 · Conversations 10a.10: Kasuku only repeats words, for now · § 10a
- 2026-09-26 · Conversations 10a.7: a spoken reply can earn the round's voice star · § 10a · **[SUPERSEDED by rules.md decision 2: the voice star goes; correct speaking earns more pocket money]**
- 2026-09-26 · First launch: character step is quick and pictures-only (boy/girl also picks hands, skin tone, hair colour, eye colour, clothing colours only, name optional typed by a parent); options are data so categories can be added without code · first-launch-story § Character creation
- 2026-09-26 · First launch: the chai station is "a bit boring" and gets a fun pass before the story ships (added to cook todo) · first-launch-story § A concern Zafar raised
- 2026-09-26 · First launch: "Story help" parent setting: English then Kutchi (default) or Kutchi only; "off (pictures only)" and other languages later · first-launch-story § Decided; first-launch-build-log
- 2026-09-26 · First launch Yes/No: No shakes (and in the build, runs away twice then vanishes), Nani looks embarrassed and asks again until Yes · first-launch-story § Zafar's flow (rule H42 has gist)

**28-29 Sept (Cook design system, arcs, speaking, clinic v2)**
- 2026-09-28 · Cook: no masala dabba; tap the object = use, tap the word chip = hear; speaker stays when words disappear; one pan per person, hob up to 4 burners by level · cook-design-system-v1 header/§8 (rules H11/F15 cover gist; "no masala dabba" is new)
- 2026-09-28 · Cook pills are stacked full-width rows with the tick on the right; a person's card collapses to face + headline + small gold check when complete, tap to re-open · cook-design-system-v1 § 10
- 2026-09-28 · Chai v2 build goes ahead: hob and tray about 15% bigger and lower, true top-down pans lit upper left, tilted-pan sprite for pouring, face badges on the hob edge in front of each burner, knobs with 48 px tap area · § 10
- 2026-09-28 · Word-review speaker buttons are neutral (charcoal icon on a light cream circle) for both right and wrong; colour lives only in the card outline (gold right, red wrong) · § 10
- 2026-09-28 · The end pop-up sits over the game scene only (no Cook menu card behind) and the word review sits inside the same card, vertically balanced · § 10
- 2026-09-28 · Maani v2: two-zone grid (left prep plates + chakla, right hob + tawa + finished plates), a faint gold target ring on the board that glows at the right size, chimta/spatula flip with no hands, only a slight puff · § 11
- 2026-09-28 · Every mode uses the order model (person > items > parts, max three tiers), built as shared `js/shared/order-card.js` + css with a mode-agnostic data shape; clinic and Find it adopt next, parked modes when rebuilt · § 12
- 2026-09-29 · Daar v2: Nani's chop card (a person card with Nani's face, headline "Chop these" as a flagged English placeholder, Kutchi quantities); only cards you can act on in the phase stay expanded, the rest fold to face + headline; stirs show a Kutchi number word, no digits · § 13
- 2026-09-29 · Chaat v2: front-on clear glass bowl as a cross-section with real layer art, ingredients as front-on prep bowls on the shelf band; drop the tally; level 4 is still one person but the card starts folded and peeking costs a hint; the serve review is a large face circle over the dish (happy + praise clip, or gentle frown and redo); one review in all seven stations (`Cook.Kit.review`) · § 14, 14a
- 2026-09-29 · Faces framed by the eyes: same eye line and size for everyone, three moods each (neutral, happy, frown) · § 14a (rules D18 has it)
- 2026-09-29 · Samosa: keep the swipe fold (make it feel great, glow not dashed line, no red dot); fry in a karahi with a slotted spoon onto a paper-lined plate, no hands, *hane kadh*; no tally · § 15
- 2026-09-29 · Sekelo: keeps vertical skewers, **top-down throughout including top-down prep bowls** (the cream topping-bowl family), a flat "to the grill" phase button, no floating preview skewer; two different mixed skewers move to the rack one at a time; headline wording "Muke sekelo khape" is to be confirmed with Zafar · § 15 (rules H20 has gist and the open question)
- 2026-09-29 · Timers by level: about 15% quicker per level, in `timing.levelSpeed` in data · § 11 (rules H8)
- 2026-09-29 · Speaking proposal approved in full: watch > handover (prop + "your turn" mic bubble) > say it after a recorded model > words only > picture only > choice; no whisper recordings (the model is an already-recorded clip); rung 1 earns coins and a cheer; Cook ordering pilot (chai only) first; emphasis on Cook and above all Conversations; clinic "W3 Call them in" dropped, waiting room back to listening only; speaking moves into the doctor-patient conversation · design/speaking-more-proposal (rules E32 has the ramp)
- 2026-09-29 · Clinic v2 (Zafar's playtest answers): waiting-room language ladder (man/woman/boy/girl, + old/young, + tall/short, + a colour, + "with the baby"); diagnosis D1/D2/D3 with "Found it" and the torch that must look like a torch; pharmacy belt painted and hatchless with L3 faster belt, no timer; send-off L1 feeling faces, L2 said feeling, L3 pick what helps; heal games: scrape (plasters in colours and order), knee (hammer taps then flash-and-tap wrap), ear (wax blobs big then small, cotton bud, drops), tooth (brush in called order, drill the dark bits, fill to the line, no green bug), soothing drinks (turmeric milk / ginger / honey-lemon mapped to tongue colours), fever (thermometer red/blue, alternate until "just right"), boing (beads counted into the syringe), eye (patient reads the chart, child judges), foot (soak then pull splinters along paths); tummy/hic/hair unchanged for now · clinic-v2-design-sheets (rules H27-H34 summarise)
- 2026-09-29 · Clinic v2: every game opens with one "why" beat (patient says the problem, doctor says the goal); the grown-up skip button moves behind the "?" menu in the shared onboarding (this also fixes Cook's samosa coach) · clinic-v2-design-sheets § Shared clinic fixes (G5, G7/CQ15)
- 2026-09-29 · Clinic v2: heal close-ups lie on the white strip (limbs) or sit against the plain wall (head), over a more-blurred CB6b, patient's round face in a corner reacting · clinic-v2-design-sheets § B

---

## 3. Past feedback items (for the regression list)

Zafar's own reports only, plus the 23 Sept playtest lessons. Builder-found issues are marked (builder).

**23 Sept playtests (Roadmap "Lessons", from two phone + laptop playtests of the fruit bowl)**
- Tested only headless while the game was unplayable on a real device · all modes · Roadmap § Lessons 1, 12 · fixed as a rule (rules C1, C2) · by eye on phone + 16:10 laptop
- Something on the page covered a tappable item · all modes · Roadmap § Lessons 2 · fixed (tap-cover check) · auto (test checks before every tap)
- Collected things were not visible where they go (invisible counters) · all · § Lessons 3 · unknown · by eye
- Items sized by width alone overflowed the box · scenes · § Lessons 4 · unknown · by eye / auto (check_vessel_meta.py)
- Items floated with no contact shadow · scenes · § Lessons 5 · unknown · by eye
- Characters hidden by the screen edge rather than the scene · scenes · § Lessons 6 · unknown · by eye
- A blink redrew the whole character (poses not on one canvas) · characters · § Lessons 7 · unknown · by eye
- Players couldn't tell how many to buy (no digits on the list) · Shopping · Roadmap § Learning design (playtest 1) · "fixed" by showing digits, **but rules E12/CDS §12 now say numbers are heard/written in Kutchi with no digits** · by eye
- English or pictures shown where the task is to understand Kutchi · all · § Lessons 10 · rule · by eye
- Browser speech engine used for shipped audio (Android web views lack it) · audio · § Lessons 11 · rule · by eye/auto
- The floating panel covered the game (broke playtest 1) · sidebar · sidebar-design § 5 · fixed by docked column · by eye

**Cook (Zafar's 24-29 Sept notes)**
- Placeholder voice "crazy fast" · Cook audio · cook-with-nani-build-log § 1 · fixed (half speed; TTS now test-only anyway) · by ear
- Nani's reading pauses can't be skipped · Cook · build-log § 5 (persona) · fixed ("tap anywhere to skip") · by eye
- "Hard to know what to do; lots of information all at once" · Cook · modes/wave5a-brief.md · fixed by Wave 5A (intro card, sequence list, no step pills, "?" help, silence first, slimmer sidebar, no coin counter, word-review result) · by eye
- No focal point: pot, empty burner, big tray and seven ingredients all shout equally · Cook screens · cook-design-system-v1 § 1.1 · addressed in v2 (focal rule) · by eye
- UI and world look like two products (web boxes, nested cards, pink, rust text next to 3D art) · Cook · § 1.2 · addressed in v2 · by eye
- Inventory has no grid; mixed heights; labels on some items only; loose speaker bubbles · Cook stations · § 1.3 · addressed (identical slots, chips) · by eye
- No system for spacing, type sizes, radii and colours · Cook · § 1.4 · addressed (tokens) · auto-ish (CSS audit) + by eye
- Chai made partly in the glass; order card held other people's orders · chai · § 1.5 · addressed (everything in the pan; one card per person) · by eye
- Sidebar words wrap onto two lines; two people icons; Nani needs her own narrator box in her own shade; recipe cards should show only person, dish, ingredients with no intro line such as "Nani laide" · Cook sidebar · ideas-2026-09-28-arcs-and-focus § 5 · addressed in CDS §3 · by eye
- Hands everywhere in Cook · Cook · same doc · rules H13: no hands anywhere · by eye
- Chai v2 mock-up fixes: hob and tray ~15% bigger and lower; pans true top-down; tilted pan for pour; badges on hob edge not handles; knobs 48 px; real top-down glasses and liquids · chai · cook-design-system-v1 § 10 · unknown · by eye
- A one-line text beside a character icon not centred on the icon · collapsed cards · § 10 (late) · unknown · by eye
- Shelf items not at true relative heights; too little gap between cooking area and shelf · chai/pantry · § 10 (late) · unknown · by eye
- Old "Cook with Nani" menu card visible behind the end pop-up · end pop-up · § 10 (late) · unknown · by eye
- Word review not vertically balanced in its card · end pop-up · § 10 (late) · unknown · by eye
- Chaat: mixed viewpoints (side glass bowl, top-down ingredient bowls); layers read as liquids not food; ragged 4+3 ingredient grid with no chips/shelf; big red digit tally on two rows; card doesn't show order; Nani's line English placeholder; bowl huge · chaat · § 14 · addressed in v2 spec · by eye
- Half-body sliding in and pretend eating at serve ("X10") · all Cook serve · § 14a · replaced by face circle review · by eye
- Samosa fold swipe should stay and feel great; no dashed line, no red dot · samosa · § 15 · spec · by eye
- Sekelo wrongly called "Mishkaki grill" (mishkaki = the meat cubes); sekelo must stay top-down after first build; "Go to the barbecue" red button · sekelo · § 15 · spec · by eye
- Chai station "a bit boring", second thing every new player sees · chai/first launch · first-launch-story § A concern · **open** · by eye

**Clinic (29 Sept playtest, via the v2 sheets; full list is in feedback/clinic-playtest-2026-09-29.md, not this batch)**
- Rows should count up as you tap at level 1 (Cook rule), not tick only at step close · clinic · clinic-v2-design-sheets § Shared fixes G6 · spec · auto (onboard/tick test)
- Grown-up skip button visible during play (also in Cook's samosa coach) · shared onboarding · § G7/CQ15 · spec: move behind "?" · by eye
- Fever tray id `strip` should be `thermometer`; no test covers the first-time help path because tests switch help off · clinic fever · § G8 · spec · auto
- "no" shown as *nar* in clinic diagnosis answers and the eye chart's "not" row · clinic · § G9 · spec · auto (grep)
- Torch must look like a torch (not a pill-like sprite); thermometer must look like one; "paste" filling replaced by a clear tube · clinic art · § D3, H-fever, P · spec · by eye
- CB6b background only slightly soft: blur more in code so the room never competes; certificate frame blurred to match · heal close-ups · § B · spec · by eye
- Pharmacy belt ran as a code-drawn belt across the top; hatches dropped (CB4c) · pharmacy · § P · spec · by eye
- Lolly in the send-off · clinic · § E ("an apple, not a lolly; Mum") · rule · auto (grep) + by eye

**Builder-found open items worth carrying (builder)**
- Clinic tooth under 1 cm even zoomed (0.50 cm on iPad); trolley objects ~60 design px on phone; replay timer can overlap a recast line · clinic-build-log § Known gaps · open · by eye/auto (check_hotspots.py)
- Cook phone sidebar buttons (speaker, translate, eye) 22 px, too small for small fingers; goal box capped at ~4 lines · cook-with-nani-build-log § 9 · unknown (later CDS requires 48 px) · by eye

---

## 4. Design content at risk

Content in MERGE/ARCHIVE files (or in stale layers) that exists nowhere else. Each line names the target.

- Game Design § "Per-word difficulty" 5-stage table (Introduced, Supported, Prompted, Recalled, Known: times met, picture/written/audio/help) and the drop-back rule, and its later split into understand_stage / produce_stage · progression-and-scoring.md
- Game Design § "Mechanics rejected" table with reasons · vision.md
- Game Design § "Grandparent mode" and the speaking stages 1-3 · vision.md + game-design/speaking.md
- Game Design § "The notebook" (4 jobs, cram grid, no handwriting) · progression-and-scoring.md (or ideas.md if Zafar drops it)
- Game Design § "The world" + "Scene catalogue" (Unit 1-9 sequence to scene/mechanic) + "Blanket quest" (thread for Nani's quilt: ask each relative their favourite colour, notebook, buy threads, recall; "one quest carries kinship, colours, asking, reading back and recall") · story-and-arcs.md; the blanket quest is the seed of Big Ma's quilt-making arc (rules decision 4)
- Game Design § "Audio and speaking" recording method (one take, each word twice, split on silence, soft room beats good mic) and "Sound" (market chatter, kettle, gulls, warm chime) · design-language/audio.md
- Game Design § "Session shape and age fit" (age table, tone, accessibility: touch targets, subtitles, colour never alone) · vision.md / ux-principles.md
- Game Design § "Build order" 10-stage table with "what it proves" and the recording-evening gate · status.md (history) + vision.md (gate)
- Roadmap § "Layout contract v2": depth layers 1-8, carried container (bottom-centre, max 22% height, three layers, tap to move), item zones table (shop display 10-12 slots; pantry 4 shelves ~32 items; spice cupboard 3x6; dastarkhwan hotspots), background art brief · ui-design-system.md + art-pipeline.md (after correcting, section 6)
- Roadmap § "Thin shell spec": launch flow, profile picker (up to 6), create profile with Can-read/Can-type, what is saved and when, IndexedDB + `schema_version`, `navigator.storage.persist()`, iPhone Safari clearing data unless installed to home screen, private-window notice · architecture/
- Roadmap § "Story structure": the levels table (Story > Chapter > Errand > Game mode > Container), "two kinds of progress split" (containers = words, quilt = story), learning tree per domain (Kitchen/Sewing/Wardrobe/Family 1-5), storytelling principles (alternate pace, goal/complication/payoff, consecutive errands never repeat the main action), cost note · story-and-arcs.md (replace "quilt tracks story" with the bookshelf)
- Roadmap § "How the story is told": three channels (picture/action, sound, text), story beats (3-5 s, one visual moment, one Kutchi line, one gist caption, skippable, auto-skipped on replay, gist-only until recorded), "the hub fills up with the story" · story-and-arcs.md (gist caption rule needs reconciling, section 6)
- Roadmap § "Story arcs": Arc 1 chapter table, dropped-from-Arc-1 list, day-out template with the four trip sketches (vocabulary and art needs), cross-arc vocabulary spine, standalone arcs (clinic volunteering, Making clothes; Monsoon, Who did it proposed), Eid moved later, the old five-arc plan and where its content went · story-and-arcs.md
- Roadmap § "Recurring cast" (cat, Nana, older cousin, Big Ma, shopkeeper roles) · cast.md
- Roadmap § "Syllabus" (grammar forced by Kutchi; S1-S6 table; numbers and respect strands; gaps and fixes) · story-and-arcs.md + language/
- Roadmap § "Design research" table (Habgood & Ainsworth, TPR, TBLT, narrative load, cozy progression with sources) · vision.md or mode-design-method.md
- Roadmap § "Lessons" 1-12 · process/regressions.md
- Brief § "Language authority and rights" class-handout table and "systematic r/d" note · language/lexicon.md, grammar-notes.md
- game-modes-v2 § 3 upgrade design and Cook upgrade table with trade-offs (sharp knife, chai machine, second burner, bigger pantry, tawa upgrade, cousin helper) · progression-and-scoring.md
- cook-with-nani-build-log § 8 upgrade table (real upgrade per station; "deliberately none" for sugar counting; "no checker" style guards) · progression-and-scoring.md
- game-modes-v2 § 7 Cook station table (gesture, why fun, language, build) and Kutch specialities · modes/cook.md
- game-modes-fun-analysis § 1 personas, § 4 fun checklist, § 5 Cook "service" loop · vision.md / mode-design-method.md / cook.md
- OVERVIEW "What all six designs agree on" (shared family-words priority list) · language/ (Questions for Mum index)
- REVIEW-2026-09-25 cross-mode overlap table and "shared engine pieces to build once" list · each mode doc + architecture/
- clinic-design § 7.4 safety checklist (9 items), § 7.2 album/thank-you shelf/plaster designs, § 7.3 clinic upgrades, § R3.2 left/right ladder, § R3.4 speaking moments S1-S8 · modes/clinic.md
- Each parked/Find/clinic mode's "Stars, rewards and upgrades" section holds a per-mode upgrade list (tidy: big tray, steady hands, shoe horn, sweet tongs, step stool, doorbell delay; clinic: plaster dispenser, warm flask, second bench, toy box...) and collections (Nani's little secrets, album, sticker album, thank-you shelf) · progression-and-scoring.md (upgrades catalogue) and each mode doc; re-express money lines under decision 10
- speaking-more-proposal inventory of natural speaking points per mode · speaking.md (and each mode's "speaking points" line)
- sidebar-design open decision 4 (explore/magnifier, option c) and Notebook tab · ideas.md
- free-play-and-world-ideas § 6 "genre skin, language engine" and "other languages later" · vision.md / ideas.md
- first-launch-build-log default Kutchi placeholders and their sources ("Kaale Eid ai", "Magani acheto", guessed "Arre re! Khaanu taiyaar nai") · modes/first-launch.md flagged placeholder, and into the Mum list
- Build logs' leak-bot tables and "decisions I had to take" (all ten) · each mode doc's Build status

---

## 5. Open items and questions for Zafar

1. **"Hide and seek" and "Put it there" in Arc 1.** Roadmap says both are still to build. Put it there = Tidy up. What is Hide and seek now: Find it's Simba's mischief, or Who did it?'s sweets case? (Roadmap § Story arcs, Arc 1 table)
2. **Replaying finished content after the bookshelf decision.** The quilt patch was also the level-select ("tap a patch replays that errand", Roadmap thin shell, Game Design § The quilt). With books on a shelf, does tapping a book replay the arc or a chapter? Do chapters get progress marks at all?
3. **Notebook.** Still wanted (dictionary, collection, cram grid, writing practice from stage 3)? The nav dock's "book" button (CDS §3) might be this. Where does it live in the target docs?
4. **Grandparent mode** is called "the one to protect" but is in no rule and no mode design beyond Conversations' parent tick. Is it still planned, and as what?
5. **First launch hook.** It ends "Tomorrow is Eid... Will you help me cook?" but Arc 1 is now the Birthday (Roadmap known follow-up, not done). The 10 lines to record for Mum are built on Eid. Re-word to the birthday before Mum records them?
6. **English gist captions.** Brief principle 4, Game Design ("Nani is cooking. Something's missing." before she speaks), and Roadmap story beats all show a short English gist caption; rules E1/F23 say no English instruction on screen. Is the gist caption allowed, and only in story beats?
7. **Daily hooks.** REVIEW decision E (one rotating hub daily instead of six) is unanswered; game-modes-v2 and free-play still list "Nani's word of the day (daily streak)"; Brief says no streaks; Cook uses a never-resetting "N days" count. Is a daily wanted at all?
8. **Timers in Nani's house.** Brief principle 7: "Nani's house has no timers, ever." Cook's Busy mode, the chai boil and level-speed timers run in her kitchen. Which stands?
9. **Clinic waiting room size.** rules H28 says at most 6 people; clinic-v2 sheet says 8-10 people at level 3 (six-seat bench + standing). Which?
10. **Clinic: does the picked person "rise" (rules H28) or "stand and walk to the door" (v2 sheet W step 3)?** Minor; rules wording probably wins.
11. **Kutchi words still open inside these docs (already partly in rules Open questions):** *kere karein*; green pepper; *moikyo*; *Muke sekelo khape*; *mirchi* plural (CDS §13 still writes *ba marcha*); hot = *koso* / lukewarm = *nokoso* (clinic v2 fever; *garam* may be Gujarati); honey, *waaro* form for drinks; doctor's recording (Section G, ~9 Oct).
12. **Doctor.** His display name in-game; does he voice his own lines or does Mum? (OVERVIEW decision 3, never answered.)
13. **Open OVERVIEW decisions with defaults taken, never confirmed one by one:** Who did it culprits (Nana, Nani, Isa, Kasuku as silent suspect); goat in the kitchen and Big Ma's song during the leak (Monsoon); young Nani in Snap photos, instant camera or phone, vehicle; which sweets in Nani's box (#6, blocks Ch3 art in three modes); mehndi owner (Tidy up vs Dress up); Footprints owner; sky-watch owner; *topi* or *kofia* and what the family wears (blocks all Dress up art); rooms in Nani's house; "sad/scared" feelings in clinic; Who did it "Prove it" for 8+.
14. **Find it design.** Q1 fruit-bowl errand onto the Find it engine (blocks shell errand list); Q5 panning scenes vs one screen with zoom (blocks sitting-room art); parent tick earning credit (D9.2, now moot with the voice star gone: what does a parent tick earn?).
15. **Speaking.** Should speaking ever be required to progress, or always optional? (speaking-more-proposal Open Q3; Claude suggests optional.) Also the Conversations skip for spoken replies (already in rules Open questions).
16. **Pocket money and old receipts.** Every mode's "receipt" (5 for helping, +5 ear, +3 craft, +3 tick, combo) predates decision 10. Fine to replace all with the one model, and is the "perfect combo" bonus still wanted?
17. **Cook upgrades with running costs** (helper cousin with a daily wage). Allowed, given "never lose what you earned"?
18. **Sidebar explore/magnifier** (tap anything to hear its name; counts as hinted if used on a list item): still an idea worth keeping? (sidebar-design §8.4)
19. **Hands.** Cast says the player's hands (boy/girl sleeves) appear in first-person scenes; rules H13 says no hands in Cook. Confirm hands only outside Cook (clinic, Dress up "demos").
20. **Sekelo vs mishkaki in the Roadmap beach stall** ("mishkaki, already in the game"): rename to sekelo when the trip is built.
21. **Commercial model** stays TBC (rules decision 7): the Brief says "Not a business... free", the idea of £2/month is open; vision.md must say "open", not "free".
22. **rules.md internal inconsistency:** Top rule 16 says "Khoja Muslim", §9 says "Khoja Shia Muslim"; Game Design says "Memon and Khoja homes". Confirm the wording the vision and cast docs should use.

---

## 6. Stale or conflicting content (contradicts rules.md, current designs or Zafar's decisions)

### 6.1 Scoring stars (rules H5, J7, decisions 1-3: scoring is the three badges time/accuracy/hints, no ear star, no voice star, legacy star code removed)
- **modes/clinic-design.md § 7.1** "three stars" table (Understood ear, Said it voice, Gentle hands plaster-star craft, No help/Quick), `star_sets.clinic`; 7.2 receipt "+5 ear, +3 gentle hands"; R3.4 voice-star paragraphs; Q-layer mentions of the ear star
- **modes/conversations-design.md § 5.4** (voice star, "Stars.voice"), **§ 10a.7**, § 10 Q7; wiring doc CK11 and "For the voice star, pass Stars.voice"
- **find-it-design.md**: Q2 "sharp-eye" star, D4 "voice star", 5.3 hint-ladder costs, "ear star" throughout, decision D9.2 (parent tick earns voice star); Stars section
- **modes/tidy-up-design.md § 7** (Ear, Neat/broom, No help/Quick), **dress-up** § 7 (needle-and-thread craft star), **who-did-it** § 7 (Nani's glasses), **monsoon-rush** § 7 (umbrella; but P.10 already maps stars under the three badges, use that as the model), **snap** § 7 (lens iris); "star_sets" and "minTested" rules in each build log
- **modes/OVERVIEW.md** craft-star icons table and decision 11 (ear-star strictness)
- **modes/MODE-DESIGN-BRIEF.md** § 5.7 ("three stars") and **DEEP-DIVE-BRIEF** principle 3 ("voice star")
- **modes/BUILD-COMMON.md** ("star/ear/voice rules" stubs), **wave5a-brief** (stars + "next time" tip per missed star)
- **design/speaking-more-proposal.md** ("the voice star starts at rung 2"; "coins, never the voice star") and its Open Q3 ("voice star as the reward")
- **cook-with-nani-build-log § 1** "Stars, coins, tips: yes 1-3 stars per order"; **game-modes-v2** and **game-modes-fun-analysis** ("stars", "3 stars", "grade per step plus tip"); **free-play-and-world-ideas** ("stars, streaks and a daily request which Zafar now favours"); **sidebar-design** (star tab decision and open decision 5 "Stars and streaks")
- All ten build logs report "ear star / voice star" leak numbers; the numbers are still valid as "level-1 cannot be won blind" evidence but the labels change to accuracy badge
- **Game Design** and **Brief** say "no points, stars, XP" (consistent with rules); but Game Design § Mechanics adopted line "Functional purchases" and pocket money at Eid conflict with decision 10 (see 6.9)

### 6.2 Quilt as progress marker (decision 4: bookshelf; quilt-making is a Big Ma arc)
- **Project Brief** principle 8 ("A quilt that fills in"), scope "The quilt, with patches earned", audience table ("visible progress")
- **Game Design** § The core loop (diagram "A patch joins the quilt"), § The quilt (whole section: patch motif, replay by tapping, finished quilt = finished game), § The world and scene catalogue (blanket quest as second build), § Build order stage 6, final status note
- **Roadmap** § Story structure table ("Finishing it completes a quilt", "one quilt patch per chapter", "Progress object" column), Thin-shell (hub with quilt on the wall, replay via patch, "Patch overlay"), Phase sequence ("first quilt patch", "quilt finished"), Hub-fills-up paragraph, the blanket-quest references
- **Mode docs:** clinic-design (stethoscope patch, Arc 3 Ch4), dress-up (offcuts become the chapter's patch), monsoon (raindrop-and-umbrella patch), who-did-it (magnifier/sweet-box patch), tidy-up (quilt grid M5, "Arc 2 gift"), snap (final quilt patch)
- **sidebar-design**: Quilt tab in the rail; **game-modes-v2**/**free-play**: "the quilt for story progress"; **cook-with-nani-build-log**: Day 5 finale "a quilt patch"
- Replacement: one named book per finished arc on a bookshelf at the "book end" review with Nani; the quilt-making idea becomes Big Ma's quilt-making arc (the blanket quest is its seed). Tidy up's M5 quilt grid and Dress up's offcuts are natural fits for that arc.

### 6.3 Lolly / sweets as rewards (decision 8: apple, never lollies, biscuits or sweets as rewards; mithai at a celebration fine)
- **modes/clinic-design.md**: lollipop in H9 (lines ~149-153, 314, 387-390), listed on the tray, in the "order words" frame (*ne poi [the lollipop]*), words list row 3 (line ~562), and E2 thought-bubble text; replace with apple. **clinic-v2-design-sheets** already says apple.
- Tidy up's sweet box and Who did it's sweets are celebration mithai: fine, but Who did it "the sweets eaten" comedy should stay non-reward.
- clinic-design "a small thank-you gift for the shelf" (Nana's coin, Big Ma's button) is fine (objects, not food).

### 6.4 Kutchi spellings and forms (rules G5, G6, G24, decisions 5)
- *nar* used for "no": find-it-design (19 hits), clinic-design (13), clinic-v2 (2, in the "G9 fix" text, fine), dress-up-design (16), monsoon-rush-design (12), snap-design (20), who-did-it-design (18), dress-build-log, monsoon-build-log, conversations-design (1, its own spelling flag at line ~187, correct). Correct: ***na*** (*nar* = look).
- *hikdo* (one) and *bo* (two), *vadho*, *daal*: hikdo in Game Design, clinic, dress-up, monsoon, snap, tidy-up, who-did-it, find-it, conversations; vadho in find-it, who, snap, monsoon, dress-up, build logs; *daal* in Roadmap, game-modes-v2, fun-analysis, monsoon, cook log. Correct: *hakro/hakri* by gender, *ba* (said "ber"), *wadho*, *daar*. Game Design shows "hikdo, bo, trae" as the tap counts.
- *Achija* (goodbye) and *Aabhar aanjo* (thank you) are in clinic-design, conversations-design (sections 4, 7, 9 before 10a), dress-up, tidy-up, find-it, speaking-more-proposal, who-did-it, cook log. Zafar's 26 Sept decision: goodbye ***khuda-fis***, thank you in English. Conversations' own 10a overrides its body but the body still carries the old lines.
- ***marcha*** (plural, "ba marcha"): cook-design-system-v1 §13 (Nani's chop card), §14 ("Marcha na."), who-did-it-design (7). Decision 5: *mirchi* only, no plural, for now.
- "*mishkaki*" as the dish: Roadmap § beach stall and OVERVIEW; rules H20: *sekelo* is the dish, *mishkaki* = the meat cubes.

### 6.5 Arcs, Eid and old story homes (rules H36-H39)
- **Cast.md** headings "Arc 1: Eid at Nani's", "Later arcs" (3 Monsoon, 2 Wedding, 4 crow, 5 village), "The spill" and "Eid morning" appearances, "Nana ... storyteller in Arc 5".
- **first-launch-story.md**: Eid hook and the record list.
- **modes/OVERVIEW.md** and every mode's "Story integration" / story-home rows use the pre-28 Sept five-arc plan (Arc 3 Monsoon, Arc 4 lost ring, Arc 5 village; "Eid morning", "The spill", wedding, the shoe mountain, Who's at the door). **conversations-design § 7.7** map (94 rows, A1.1-A5.5) is built on it: rebase onto Birthday + trips + clinic + Making clothes + Monsoon + Who did it.
- **game-modes-v2 § 4** (old Arc 1 table with Knock knock, The spill, Eid morning). **Roadmap** itself: Phases 4-5 and the "Current working documents" / Workstreams tables are labelled snapshots but are stale.
- **Roadmap § Cast** Big Ma "recurring at Eid... mends the kurta in The spill".

### 6.6 English on screen, help and counting
- Brief principle 4 ("English as text one tap away on any word or sentence"; gist caption), Game Design (gist caption, "Subtitles for every spoken line, in English and romanised Kutchi", English link on every card), Roadmap (speech bubble with "English one tap away", sidebar row "English toggle beneath"): conflict with rules E1 (no English instructions for the child, on screen or in audio), F23 (no English support text), decision 1 (the light bulb is the help and costs a lightbulb).
- Game Design § Buying quantity (target digits on the chalkboard) and Roadmap § Learning design (digits and dots "2 x santra") conflict with rules E12/F25 and CDS §12.
- sidebar-design hint behaviour (free; "later may cost pocket money") conflicts with decision 1.

### 6.7 Layout and look (rules F4, F5, F18, F19, D13, D22)
- Roadmap layout contract v2: letterbox "filled with the scene's dominant colour or a blurred copy", sidebar "own column... slide-out drawer in portrait" (rules F18: no letterbox or cream strip; F4: left ~22% sidebar); "speech bubble... English one tap away"; sidebar rows format `[quantity x] [Kutchi word] [play]` with English toggle (superseded by the person card).
- sidebar-design: sidebar on the **right** (Zafar 23 Sept) vs rules F4 left; tabs rail; green "done" wash; dots only.
- **Game Design § Art direction:** "soft cel shading, thick soft outlines" and "thick outlines" vs rules D13 ("stylised 3D animated-feature look... no outlines, cel shading or photorealism"); "generate characters on flat magenta FF00FF" vs rules D22 (never key magenta out of metal, glass or glow; ok for characters); "interface colours sampled from the artwork (ajrakh indigo, madder...)" vs CDS tokens (parchment/charcoal/gold/sage).
- CDS §4/§14 "front-on inventory bowls" vs §15 Sekelo "top-down prep bowls throughout": pick per station and state it (rules H14 lists cameras per station: sekelo and samosa top-down, chaat side-on).
- CDS §2 "one line per pill (shrink to fit, down to 14 px)" vs rules F7 "headlines shrink, then wrap": reconcile the two in the UI doc.
- Clinic v2 sheet: waiting room 8-10 people at level 3 vs rules H28 max 6.

### 6.8 Platform and business
- Roadmap § Platform decisions: "Pages is public. Fine with placeholder audio. Move to a private host before family recordings go in." **[SUPERSEDED by rules decision 6: everything stays public until launch]**.
- Brief § Non-goals: "Not a business. No ads, no subscriptions... If released widely, it is free." vs decision 7 (commercial model TBC).
- Brief § Scope: one room and one stall, 60 words, quilt; out of scope lists the clinic and the beach: stale (the repo has Cook, clinic and six parked modes).

### 6.9 Pocket money and upgrades (decision 10)
- Game Design § The quilt (pocket money "given at Eid"; hint that pauses the clock; extra seconds); game-modes-v2 § 3; cook-with-nani-build-log § 1, 8 (prices, daily-wage helpers); every mode's "receipt" lines (5 for helping, +5 ear, +3 craft, +3 tick, combo) and "perfect-order combo"; free-play "meta layer ties modes"; tension: "money that buys hats is grinding" vs mode docs' décor/plaster-design unlocks (fine when earned, not bought).

### 6.10 Other
- **Cast § The parrot:** Kasuku imitates "Arre re!" "just after a mistake" vs rules I9 (idle moments only, never during a task). Cast "Hannah's granddad" appears as "Zafar's wife's granddad" (same person; rules use Hannah's).
- **Cast § Nani's hands** (gold bangles) vs later "no bangles" correction in the same file.
- **Brief principle 7/Game Design** "Nani's house has no timers ever" vs Cook Busy mode (Open Q8).
- **modes/OVERVIEW.md**: says stitches, needles and the pill organiser are out of the clinic; PIPELINE-BRIEF later allowed stitches and injections. Stale.
- **modes/REVIEW-2026-09-25.md** describes `js/shared/` as absent; it now exists (record as a dated snapshot).
- **conversations-design § 10** (original questions, defaults) is "answered: see 10a"; the body sections 3-9 still quote *Aabhar aanjo* and *Achija* as defaults.
- **Monsoon P.10 / Snap** already reconcile the stars with the three badges: use as a template for the others.

---

## 7. Checkable items in docs/design/cook-design-system-v1.md (feed qa-checklist.md)

One line each: item · source §. Every item is a measurable or eyeballable rule. (The file already has sections 1-15; this list is the extra "Checkable items" section the brief asked for, to be added to the file or kept in qa-checklist.md.)

**Tokens (§2 Tokens)**
- Page background is #F4ECDF (parchment) · §2 Tokens
- Panel background is #EFE5D6 · §2 Tokens
- Card background is #FFFFFF · §2 Tokens
- Body text colour is #2A2522, never rust · §2 Tokens
- Kutchi keyword colour is #8C2F2F and used only on the Kutchi word · §2 Tokens
- Gold is #C9962E, flat, for outlines and icons only · §2 Tokens
- Grey is #D9D2C7 · §2 Tokens
- Nani sage box is #DDE6D5 with band #7E9A76 · §2 Tokens
- "Wrong" red is #C0443C and appears only in the end review · §2 Tokens
- Font is Nunito throughout · §2 Tokens
- L1 lesson line is 22 px / weight 800 · §2 Tokens
- L2 Kutchi target is 20 px / 800 · §2 Tokens
- L3 labels and pills are 17 px / 700 · §2 Tokens
- L4 support text is 14 px / 600 · §2 Tokens
- One line per pill or label (shrink to fit, 14 px minimum); Nani's line may use 2 lines · §2 Tokens
- Spacing only from 4, 8, 12, 16, 24, 32, 40 px · §2 Tokens
- Outer margin 32; between regions 24-32; inside cards 16; between related controls 12; label to icon 8 · §2 Tokens
- Radii are 12 px for cards and pills, full circle for round buttons, nothing else · §2 Tokens
- One shadow only: `0 2px 8px rgba(40,25,10,.10)` · §2 Tokens
- No gradients, bevels or 3D text anywhere in the UI · §2 Tokens
- Every tap target is at least 48 px even when the icon is 24 px; whole inventory slot is tappable · §2 Tokens

**Screen grid (§3 The screen grid)**
- Left panel is about 22% of the width, one continuous surface, no cards inside cards · §3 The screen grid
- Nani's sage box is at the top of the panel: larger waist-up portrait, her line (max 2 lines), bulb and mute; her face replays the line · §3 The screen grid
- One white card per person: face (replay) + short headline + that person's pills on the card · §3 The screen grid
- Several of the same thing (skewers, cups) sit as light grey subgroups, never boxes in boxes · §3 The screen grid
- Nav dock at the bottom: three identical circular buttons (? , home, book), 48 px, quiet · §3 The screen grid
- Play area is about 78%; top 74% is the scene and bottom 26% is the inventory shelf band · §3 The screen grid
- Focal rule: the next object pulses gently; inactive objects are dimmed about 10%; tray and serving items are quiet until the serving step · §3 The screen grid

**Inventory (§4 The inventory)**
- Identical slots: artwork box about 96 px scaled to fit, evenly spaced on the shelf band · §4 The inventory
- Each object has exactly one chip under it (`speaker + word`); tap object = use, tap chip = hear · §4 The inventory
- At higher levels the word disappears but the speaker stays, same size, shape and position · §4 The inventory
- Groups by kind with a small gap: liquids, jars, spices (small identical spice jars) · §4 The inventory
- No masala dabba · §4 The inventory
- When an item is used its Kutchi word pops by the pour/sprinkle and the family clip plays · §4 The inventory
- Shelf items keep true relative heights (bottle/carton tall, jars medium, spice jars short), each standing on the shelf line · §10 Decisions after the mock-up review
- Slightly more breathing space between cooking area and shelf than chai v2's first build, less than the mock-up · §10 Decisions after the mock-up review

**Chai v2 (§5 The chai station v2, §10)**
- Everything is cooked in the pan; nothing is made in the glass; chai is poured from the pan into that person's glass · §5
- One pan per person; hob up to 4 burners: L1 1 person/1 burner, L2 2, L3+ 3-4; burner count equals the level's pan count; no unused burner shown · §5
- Each pan has that person's face badge; badges sit on the hob edge in front of each burner, not on handles · §5, §10
- Tray is a small square wooden tray with 4 round cut-outs, each holding a glass with that person's face under it; dimmed until pouring · §5
- Pouring: tap a ready pan, it tilts (tilted-pan sprite) and pours into the glass, which fills · §5, §10
- Pills tick when each step closes · §5
- Hob and tray about 15% bigger and lower than the first build; pans true top-down, lit from the upper left · §10
- Knobs have a 48 px tap area · §10
- Real top-down glasses and liquids · §10
- Chai card: one item with a recipe has no item row, parts sit straight under the headline · §12 The order model

**Feedback (§6 Feedback)**
- Correct action: small bounce + soft glow + click + word pop + family clip · §6
- Step done: pill ticks with a flat gold outline and flat gold check · §6
- Wrong: a wiggle and the word said again; no red mid-round · §6
- End of station: three badges, then word review (flat cards, gold/red outline), then Again / All stations · §6
- Not adopted (must not appear): "Step 3 of 8" counters, English support text, red crosses, Toca-style restyle · §1 The diagnosis

**Art consistency (§7 Art consistency)**
- One camera per scene: top-down for counter and hob; front-on only for inventory objects on the shelf band · §7
- Light from the upper left; same soft shadow; one box size per inventory slot; same saturation range · §7
- Marble counter contrast softened so it doesn't compete · §7

**End pop-up and cards (§10, §12)**
- Pills are stacked full-width rows, one per row, tick on the right (not side-by-side chips) · §10
- A completed person card collapses to one line: face + headline + small flat gold check; tap to re-open · §10
- End pop-up is one card that steps through: three badges (stopwatch, tick, bulb) > Next; word review inside the same card; actions (Again / All stations, or Next station) at the bottom · §10
- Word-review speaker buttons are charcoal icon on a light cream circle for right and wrong; only the card outline is coloured (gold right, red wrong) · §10
- A one-line text beside a character icon is vertically centred on the icon · §10
- The end pop-up sits over the game scene only (no Cook menu card behind); word review vertically balanced · §10
- Order model is person > items > parts, at most three tiers, no word repeated across tiers · §12
- Headline always shown (*Muke mishkaki khape.*) · §12
- Item rows: one per distinct item, same visual level, each with its Kutchi number; no pips, no digits · §12
- A row ticks when its step closes; the tally shows what has been made, never the target · §12
- Parts only for items with a recipe, indented under the item, joined by the thin sequence line when order matters; recipe-less items (maani, all-meat skewer) have no parts · §12
- Same recipe several times = one row with the parts shown once; different recipes = separate rows, alternate rows lightly tinted · §12
- Everything stays fully expanded until done; a finished item row folds to a gold line; a finished person folds to face + headline + check · §12
- The pop-up uses the same tree at full size in the same flat style: no yellow highlight box, no grey box around a single pill · §12
- Card built from shared `js/shared/order-card.js` + `css/shared/order-card.css` with data shape `{person, headline, items:[{label, count, parts, ordered}]}` · §12

**Maani v2 (§11 The maani station v2)**
- Two-zone grid: left prep row of dough plates (bajri, wheat, empty third) with the chakla centred under; right hob with tawa centred on the burner and finished-maani plates beneath; shared top and bottom lines; equal sizes and even spacing · §11
- Everything centred: tawa on burner, timer ring on tawa, dough on board · §11
- No hands anywhere; rolling pin rolls itself; flip is a chimta (or spatula with no hand) by tapping the maani · §11
- Rolling target is a faint gold ring etched on the board that glows at the right size (no white dashed circle) · §11
- Maani puffs only slightly, not a puri ball · §11
- Flip, boil and fry timers are about 15% quicker per level, set in data (`timing.levelSpeed`) · §11
- Maani pills tick as each maani is done · §11

**Daar / kitchen kit (§13 The daar station v2 and the shared kitchen kit)**
- A hob shows one burner per pan in play, up to 4, never an empty burner; Maani keeps ONE tawa on one burner; the kit supports 1-4 burners · §13
- Nani's chop card is a person card with Nani's face, the headline "Chop these" (flagged English placeholder) and item rows with Kutchi quantities (*ba marcha*, *ba tameto*, *ba dungri*: fix marcha) · §13
- Only cards you can act on in the current phase stay expanded; others fold to face + headline (no check unless finished); they re-open when back in play · §13
- Stirs show a Kutchi number word near the pot or spoon, no digits; the tally counts stirs done · §13
- First-time onboarding uses a ghost finger: Nani's card > the vegetable > the knife > the pill ticks · §13
- One shared kit for every station: one hob, knob, pan, pot, ladle, wooden board and knife; one heat component (chai v2 heat ring, replacing the speedometer everywhere); one pour (tilt and stream, replacing the arrow) · §13
- No hands or arms: the knife cuts and the spoon stirs on their own · §13

**Chaat v2 (§14 The chaat station v2, §14a)**
- One viewpoint: clear glass bowl seen front-on as a cross-section so every layer stays visible; ingredients as front-on prep bowls on the shelf band with slot rules from §4 · §14
- Real textured layers (potato cubes, chana, dahi swirl, chutney lines, sev, dhania, chilli) settle with a small drop and bounce; 4-6 layers stay visible · §14
- Bowl about 60% of its old size, centred, with breathing space below; nothing floating · §14
- Card is an ordered job with the sequence line and a grey "next" row; "don't" row is the word plus a small muted *na* tag and ticks when served without it · §14
- No tally at this station · §14a
- Levels: L1 three layers no decoys; L2 adds decoys; L3 adds a "don't" row; L4 one person with the card starting folded and peeking costs a hint (light-bulb badge) · §14, §14a
- Serve: the bowl slides to the person; review is a large round face over the dish (happy + praise clip, or gentle frown and redo with the wrong row marked); the wrong bowl returns empty · §14a
- Faces use the same eye line and eye size for everyone, three moods (neutral, happy, frown); art at `assets/cook/characters/<who>-face*.webp` · §14a
- One review (`Cook.Kit.review`) in all seven stations · §14a

**Samosa v2 (§15 Samosa v2 and Sekelo v2)**
- Fill: real top-down pastry on a wooden board; filling from front-on prep bowls on the shelf band; one spoonful per tap with the word pop · §15
- Fold keeps the swipe: pastry art per fold stage, fold follows the finger, snap and sound at the end, soft glow showing where to swipe; no dashed line, no red dot · §15
- Fry uses the kitchen-kit hob and a karahi; samosas go raw > light > golden > too dark; lifted with a slotted spoon (no hand) onto a paper-lined plate; *hane kadh* · §15
- Samosa card: order model with a "don't" row; phase fold between fill and fry; no tally; serve and taste · §15

**Sekelo v2 (§15)**
- Station is named Sekelo; *mishkaki* names only the square meat cubes · §15
- Skewers vertical on the board · §15
- One top-down view throughout including top-down prep bowls (cream topping-bowl family) in the shelf slots with their chips · §15
- Thread by tapping onto the vertical skewer; card shows parts with the sequence line and grey "next"; two different mixed skewers move to the skewer rack one at a time; no floating preview skewer · §15
- The phase button is a flat design-system button ("to the grill" with an icon), not a red "Go to the barbecue" · §15
- Grill: heat-ring language; tap a skewer to turn it; raw > grilled > charred; no hands · §15

---

*End of batch B.*
