# Nani jo Ghar: status tracker

**The end point:** the app is live on the store with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once. User testing is tracked by Zafar, not here.

**Updated:** 29 Sept 2026, ~10:00 UTC (restructured around the story arcs and Zafar's plan). Percentages are Claude's estimates. The orchestrator updates this file at every milestone.

**Overall: about 24%.** The first release candidate is **Arc 1, the Birthday, end to end** (Roadmap "MVP and release scope"); the day-out trips and the two standalone arcs come after it.

**The rules everything is built to:** `docs/design/cook-design-system-v1.md` (the single source of truth: tokens, 22/78 grid, shelf band, order model §12, kitchen kit + burner rule §13, serve-and-taste §14a, station specs §5/§11/§13/§14/§15) and `docs/VISUAL-QA.md` (look at every state before calling it done).

## The path (Zafar, 29 Sept)
| # | Milestone | % | Why now / what it needs | When |
|---|---|---|---|---|
| 1 | **Lock Cook** | 80 | Zafar's play-test feedback on the six v2 stations, then one follow-up per station; the cream band fill (done 29 Sept) | This week |
| 2 | **The clinic** (the standalone *Volunteering at the clinic* arc's mode) | 30 | **The clinic's doctor (Hannah's granddad) visits in about 10 days (~9 Oct):** record his voice (Round 4 Section G, his instructions G108+) and show him the game. Zafar plays it → audit → feedback → build to the design system | Now → ~8 Oct |
| 3 | **Arc 1's other modes:** Put it there (set the table, pack the sweet box) and Hide and seek (find the sweets) | 25 | Built from Tidy up's `place`/`pack` engine and Find it's search; each rebuilt to the design system with the shared pieces | After the clinic |
| 4 | **Arc 1's story layer:** beats, the hub changing, the candles finale, the Story by the Fire, the first launch re-pointed at the Birthday | 20 | Needs 1–3's day-log events. **Claude's suggestion:** give every mode its one-line day-log hook as it's built (cheap), and build the book and beats straight after 3, *before* the trip, because Arc 1 end to end is the release candidate | After 3 |
| 5 | **The first day-out trip** (the beach: pack, packed lunch, travel spot-it, stall, sandcastle/kite, the Story by the Fire) | 5 | Mostly existing modes; new: spot-it out of the window, the stall dishes, beach art | After 4 |
| 4b | **Speaking pilot** (Cook role reversal: the child orders chai from Nani) | 0 | `docs/design/speaking-more-proposal.md`: speak only inside a natural two-person exchange the child has watched first; the inventory of every such point; needs Mum's order lines recorded. Small; after Cook and the clinic are locked | After 2 |
| 5a | **Landing page** (what the game is, a sign-up list) | 0 | Needed before the game is shared widely: Hannah's granddad (past president of the World Federation of Khoja Shia Ithna'ashari communities) can share it across a community with deep Kutch roots. Decide whose voices and faces appear first | Before wide sharing |
| 5b | **Trailer** (Planet Zoo style: in-game footage, slow sweeping camera, close-ups, gentle music, title cards, no narrator) | 0 | Built in code from the game itself (a scripted trailer page recorded to MP4), not generated video. Needs the clinic art and some recorded voice (the doctor's and Mum's lines with subtitles); a royalty-free track. First cut aimed around the doctor's visit | After the clinic art round |
| 5c | **How it's paid for (open question)** | – | Zafar's idea: about £2/month to support development, maybe with the first story arc free. Weigh against the reach through the World Federation network (free to the community, a supporter option, or a sponsor). Decide before the landing page | Before 5a |
| 6 | **Store release** (wrapper, offline, privacy, listing) | 10 | Near the end | Last |

## 1. Arc 1: The Birthday (the MVP, S1 + S2): about 35%
| Chapter / errand | Mode | % | State and next step |
|---|---|---|---|
| **First launch** (character creation → pantry → chai for Nani → the story → "help me cook?") | shell + Cook | 70 | Live (`first.html`). Its hook still says Eid: re-point it at the Birthday; the story panels (0%) redone for the Birthday; re-run after the pantry polish (plans B3) |
| **The guests are coming: cook each guest's order** | Cook | 80 | See §1a. The guests' ordering round (each guest asks by name) is Cook's existing customer flow |
| **The guests are coming: set the table** | Put it there (Tidy up T2, the dastarkhwan) | 20 | Tidy up's engine exists (`tidy.html`, `place`/`stack`/`check`), greybox, English placeholders. Needs the design-system rebuild, the table art, place words (idea 10, *munje same rakh*) |
| **The cat and the sweets: find the sweets** | Hide and seek (Find it's search) | 30 | Find it is 45% (`find.html`, engine + rooms); the sweets-and-Simba round isn't built. Audit → feedback → build (plans B2) |
| **The cat and the sweets: pack the sweet box** | Put it there (Tidy up T3, `pack` with counting) | 15 | Designed; the fruit skin first, the sweet skin when the sweet words exist (E59) |
| **The party: blow out the candles** | a finale beat | 0 | Small; one scene and one line |
| **The Story by the Fire** (every arc's ending) | its own module | 0 | Designed (`docs/modes/story-by-the-fire-design.md`), buildable in one session once the modes log their day |
| **Beats, the hub filling up** (balloons → streamers → table → cake) | story engine | 20 | `js/shared/story.js` + `data/story/*.json` exist (40%); Arc 1's beat script is TBC (Roadmap "Arc 1's beat script") |
| **Conversations** (greetings, thanks, how-are-you) | module | 25 | Engine + lab live; wire the 9 MVP exchanges into the first launch, Cook and the clinic (plans B4) |

### 1a. Cook with Nani (stations; v2 = rebuilt to the design system)
**29 Sept play-test (Zafar, 31-min voice note):** every point, analysis and the plan are in `docs/feedback/cook-playtest-2026-09-29.md` (the X, P, C, M, D, T, S and K items). **Decisions Q1-Q16 are waiting on Zafar**; no build starts until they are answered. Art: `docs/chatgpt-art-prompts-cook-v3.md` (27 prompts, one paste into Claude in Chrome).

| Station | State | Art | Open items | Report |
|---|---|---|---|---|
| **Chai v2** | ✅ live | $0.40 | One burner per person (1–4), on the kitchen kit. Nani's line English placeholder (to record). **29 Sept:** pans centred on their burners (the pan's centre was measured with its handle); a cup with no milk / no sugar is sometimes ordered as *Muke kari chai khape.* / *Muke mori chai khape.*, its rows saying *dudh na* / *khun na* (Zafar). *kari* and *mori* to record. | `build/reports/chai-v2.md` |
| **Maani v2** + **kitchen kit** | ✅ live | $0.05 | One tawa (Zafar). Kit = `js/cook/kitchen-kit.js` (`Cook.Kit`, shared-api §15). Adopt the new card APIs (queue note). | `maani-v2.md` |
| **Sekelo v2** (was the mishkaki grill) | ✅ live | $0.12 | Top-down throughout (Zafar). **To confirm:** headline *Muke sekelo khape.* (Zafar checking with Mum); *lakri gos* vs Mum's *hakri lakri mishkaki*. | `sekelo-v2.md` |
| **Chaat v2** | ✅ live | $0.32 | Glass cross-section, curved layers (follow-ups fix). L4 closed card + paid peek. Nani's line placeholder. | `chaat-v2.md`, `followups.md` |
| **Samosa v2** | ✅ live | $0.07 | Swipe fold kept; karahi fry on the kit. Polish pass: one filling mound, centred fry layout (kit karahi). **Still open:** the card headline cuts to "Muke ba samosa …" and ticks ✓ after filling (order-card/ui.js fix, queue note). Phase lines + "fry them" button English placeholders. | `samosa-v2.md` |
| **Daar v2** (chop, tadka, stir) | ✅ live | $0 | Stirs shown as a Kutchi word. **To record:** Nani's "Chop these". Confirm *hakro* as the first stir count. L4 closed card + paid peek, neutral don't rows (polish). **Still open:** gold settle on don't rows and Nana's ✓ during the stir (ui.js head rule, queue note). | `daar-v2.md` |
| **Pantry v2** (fetch) | 🟡 live, polish pending | – | Waiting on the final background render; then a polish pass (plans doc A3). | `pantry-v2/` |
| **Station select, day flow, title screen** | ⏸ | – | Plans doc A4; title screen parked by Zafar. | `docs/design/plans-remaining-2026-09-29.md` |

**Shared Cook pieces**
| Piece | State |
|---|---|
| Order card (person → items → parts; closed card + paid peek; don't rows; Nani's card via `UI.mission.addCard`) | ✅ `js/shared/order-card.js`, shared-api §14; 112/112 tests. 29 Sept: a "don't" row stays neutral until the dish is finished; a card waits for its head (no ✓ while the samosas fry or the daar is stirred); a folded headline shrinks then wraps, never "…" |
| Sidebar v3 (sage Nani box, one card per person, flat material pills) | ✅ |
| End pop-up (badges → words → actions) | ✅ |
| Kitchen kit (hob, burners, knobs, heat ring, chips, badges) | ✅ `Cook.Kit`; karahi added by the samosa polish |
| Serve and taste (§14a) | ✅ in sekelo, chaat, samosa, daar |
| The cream band above the counter | ✅ **Filled (29 Sept, queue item 8).** Phaser `EXPAND`: the canvas fills `#stage` at any shape; the 1600×900 design box sits at the stage's bottom (shelf band to the bottom edge), centred across; worktop/backgrounds cover the rest (pantry photo 1:1 with its edges carried on); each station's scene is lifted into the middle of the extra worktop (`Cook.lift`, `Cook.liftZone`). Report `build/reports/stage-fill.md`. |

**Cook overall: about 80%** (design 100, build 95, iterate 75, words 75, voice 15, onboarding 75, story 10). Still to go through before calling it finished: its parked ideas 5, 7, 8, 12, 18, 19 (`GAME-IDEAS-TBC.md`).

## 2. The clinic (next focus, for the doctor's visit ~9 Oct): about 30%
The clinic is set at the children's own doctor's clinic (Hannah's granddad's); the child is his helper. In the story it becomes the standalone **Volunteering at the clinic** arc (4–5 patients, after the first or second day out), but it's built now so the doctor can record his lines and see the game.

| Piece | % | State and next step |
|---|---|---|
| **v2 prototypes (29 Sept, live)** | 50 | A: the rooms on the new backgrounds (waiting-room ladder L1–5, diagnosis, pharmacy belt, send-off feelings), the Nani box and order-card look, skip behind "?". B: all nine heal games reworked on the CB6b close-up (plasters, knee flash-wrap, ear wax, tooth brush/drill/fill, soothing drinks, fever, boing, eye test, foot splinters). Stand-in art. Reports `build/reports/clinic-v2-a.md`, `clinic-v2-b.md`. **Next: Zafar plays**, then answers B's open questions |
| The mode (`clinic.html`: waiting room → where it hurts → pharmacy → heal games → send-off) | 35 | Phase 1 built and tested (21 lab entries, hotspots, speaking paths); greybox and rough sprites, **every row an English placeholder**. Dump 3's patients are in the manifest |
| Design-system rebuild (patient card = the shared order card, Nani box, end pop-up, kit-style props, no hands) | 0 | **Zafar plays it through → an audit session → Claude's feedback → Zafar approves → build** (plans B1) |
| Words and voice | 5 | Round 4 **Section G** (body parts, "it hurts", hot/cold, his instructions G108–G127) is the doctor's script. Get it ready to record with him; wire the clips straight after |
| Art | 32 | Still to do: 7.1 "where it hurts"; neck, back and hair parts; the belt and rail sit too high |
| The arc wrapper (patients over several visits, the certificate on the hub shelf) | 0 | After Arc 1 and the first trip |

## 3. After Arc 1
| Arc | % | State and next step |
|---|---|---|
| **Day-out trips** (repeatable template: pack → packed lunch → travel spot-it → the stall → place games → the Story by the Fire) | 5 | Designed 28 Sept (Roadmap "Story arcs"); beach first, then garden/farm, safari, boat. Reuses the pantry fetch, Cook stations, the clinic's conveyor shape (for spot-it) |
| **Volunteering at the clinic** (standalone, repeatable) | see §2 | The mode is being built now for the doctor's visit |
| **Making clothes with Big Ma** (standalone, repeatable) | 0 | Dress up's home; placement TBC. Dress up is parked (17–20%) |
| **Eid** (a later arc) | 0 | Moved out of Arc 1 on 28 Sept; not designed |
| **The monsoon** (proposed standalone arc, 29 Sept) | 17 | Monsoon rush's mode: designed in full, engine + greybox leak (G1–G3) built. Placement TBC |
| **Who did it?** (proposed standalone mystery arc, 29 Sept) | 17 | Designed (10 mini-games, 9 reveals); case engine + 4 greybox games built. Needs its describing words and past-tense frames recorded first. Maybe a small culprit round after Arc 1's Find the sweets |
| **Snap at every trip destination** (decided 29 Sept) | 17 | Shown the items and words, then find and snap them in the scene; the photos feed the album and the Story by the Fire. The travel game stays simple, like the pharmacy belt |

## 4. Foundation (shared by every arc)
| Piece | % | Next step |
|---|---|---|
| Shell: one app, one save, player picker | 100 | Live: Nani's house with doors for Cook, Find it and the clinic |
| Shared UI (end-of-round screen, onboarding kit, light bulb, request card, order card, Nani box) | 85 | Roll into each mode as it's rebuilt |
| Story engine (arcs and chapters as data, picture panels, Story help) | 40 | Arc 1's chapters as data (§1) |
| Day-log (what the child did, for the Story by the Fire) | 0 | Specified in the Story by the Fire design; add one hook per mode as each is built |
| World map and home (fog of war, "the world is the menu", role reversal) | 0 | After Arc 1; the hub filling up comes first |
| Speech recognition (on-device, closed set, voice star) | 30 | Enrol it with the family voice clips; the first speaking moments go in Cook |

## 5. Parked modes
| Mode | % | Where it's used |
|---|---|---|
| Tidy up | 20 | **Not parked for long:** its `place` and `pack` engine is Arc 1's Put it there (§1) |
| Who did it? | 17 | Its own arc (proposed 29 Sept, §3) |
| Dress up | 17 | Making clothes with Big Ma |
| Monsoon rush | 17 | Its own arc, the monsoon (proposed 29 Sept, §3) |
| Snap | 17 | The photo game at every trip destination (decided 29 Sept, §3) |
| ~~Arc 2: The Wedding~~ / ~~Arc 3: The Monsoon~~ / ~~Arc 4: Nani's Lost Ring~~ / ~~Arc 5: Nani's Village~~ | – | **Superseded 28 Sept**; see the Roadmap's "Replaced 28 Sept" note |

*The overnight Cook run, 29 Sept (00:28–05:00 UTC):* eight build sessions plus three polish sessions, ≤4 at once. Log: `docs/overnight-log.md`; queue and rules: `docs/overnight-queue.md`; reports: `build/reports/<name>.md`. API art spent: about **$1.05**.

## 6. Language
| Piece | % | Next step |
|---|---|---|
| Recordings with Mum (Sections A–J, about 170 min in all) | 25 | **28 Sept: Round 3 Parts 1–4 and C1–C21 recorded** (41 min, `sources/audio/mum-2026-09-28/`, report `build/reports/recording-2026-09-28.md`). **Next session: C22 onwards** (describing words, my/your, verbs and tenses), then G, E, F, H, D, I, J. Was: | **Next session: `docs/Questions for Mum (Round 3).docx`** (re-takes, Conversations, story lines, one/many nouns, then G, C, E, F, H, D, I, J). Was: | **Section C** (the grammar sentences) next, then G (clinic and monsoon), D, E, F, H, I. Also the 10 first-launch story lines. |
| Section A (grammar basics) and B (Cook words) | 100 | Done: grammar notes §1–§28. |
| Grammar notes and spelling rules | 45 | §29–§36 added 28 Sept (one/two, -o → -a plurals, -yu plurals, -e before *je/sathe*, the verb agreeing with the speaker). ⚠ spellings for Zafar to check. Was: | Grows with each recording. Answer the open spelling questions. |
| Voice clips (cut from the recordings, a lab page to check them) | 80 | **28 Sept: 182 new clips (102 Mum, 80 Zafar), checked by Zafar the same day: 157 OK, 25 redo; 18 second takes cut for the redos, 11 OK** (`checked` in `data/family-audio.json`). **To re-record next session** (no OK take yet): Mum *cup*, *ambo je mathe*, *amba je mathe*, *chokra sathe*, *chokri sathe*, *Nana sathe*; Zafar *hakro cup*, *salamun alaykum*, *na, muke na khape*, the S1 chai-things line, *trae bateta*, *hakri lakri*, the *pacheri* pair, *ambo je mathe*, *chokre sathe*; re-takes R1–R11 replace the redo clips; the Conversations and first-launch lines use them. Was: | **Checked by Zafar (26 Sept):** 146 OK, 27 to redo (`checked` field in `data/family-audio.json`), 21 not yet checked. Next: wire the OK clips into the game and speech enrolment. Was: | 86 Mum and 87 Zafar clips from Section B are in `lab/family-audio.html`. Zafar ticks the good ones; then wire them into the game and speech enrolment. |
| Words in the game data | Cook 70, Find 40, the clinic 5, the others 5–10 | Each mode's words go in when its recording section is done. |
| Syllabus word lists S1–S6 | S1 50, S2 20, S3–S6 5 | Recordings C and E–H fill S2–S4. |

## 7. Artwork (basic → initial → full → final)
- **Basic:** greybox or rough placeholder.
- **Initial:** the first real art, enough to play.
- **Full:** every asset exists.
- **Final:** polished, consistent, store-ready.

| Area | Basic | Initial | Full | Final | **%** | Next step |
|---|---|---|---|---|---|---|
| **Cook** | ✓ | ✓ | 70 | 0 | **62%** | Dump 3 is in: velan, chakla, chai tray, chai glass, skewer rack, and new counter moods for Nana, Ma and Ali in `assets/cook/characters/next/`, waiting for approval. Still to do: Nani's moods (cook pack 1.1–1.4) and the potato cube (still reads as butter). |
| **Hands** (player-boy, player-girl, Nani) | ✓ | ✓ | 90 | 0 | **80%** | Live in Cook. Fixes: the hands are too big beside small bowls, the rolling-pin hands cover the dough, and the pantry grab uses a top-down pose. Cook doesn't yet use the character's chosen hands. Eid mehndi later. |
| **Characters** (Nani ✓, Kasuku ✓, Big Ma, the doctor, Nana, Ma, Ali, cousin, animals) | ✓ | 60 | 30 | 0 | **45%** | Dump 3 approved; the new counter moods are live. Zafar processes Big Ma and the doctor (dump 2). Still to do: Nani feelings (1.1), Isa feelings (1.5). |
| **Player character** (layered, for character creation) | 0 | 0 | 0 | 0 | **0%** | A ChatGPT prompt for the layers (body, hair, eyes, clothing tints). |
| **Story panels** (first launch, then arc beats) | 0 | 0 | 0 | 0 | **0%** | Four Eid panels: the calendar and moon, the guests, the empty pots, "help me?". |
| **Find it** | ✓ | 45 | 10 | 0 | **33%** | Backgrounds from dump 3 are in. Relights 8.1–8.3 need redoing (8.2 and 8.3 were redrawn, not relit). The sitting room (3.2) needs the sofa lower. |
| **The clinic** | ✓ (143 rough sprites) | 40 | 5 | 0 | **32%** | Dump 3's patients and clinic art are in the manifest's `final` block. Still to do: 7.1 "where it hurts"; neck, back and hair parts; the belt and rail sit too high. |
| **Tidy up, Who, Dress, Monsoon, Snap** | ✓ | 10 | 0 | 0 | **12%** each | Batch-3 prompts; more once their rebuilds settle. |
| **UI and app icon** | ✓ | 40 | 10 | 0 | **30%** | Store icon and splash screen. |

## 8. Release (store)
| Piece | % | Next step |
|---|---|---|
| Wrapper (PWA, then Capacitor for iOS and Android) | 0 | Decide once the shell has landed. |
| Offline play and asset caching | 10 | A service worker after the shell. |
| Children's privacy (Kids category, no tracking, on-device speech only) | 20 | The speech design already keeps everything on the device. A privacy policy is still to write. |
| Performance on older phones | 20 | Budget each station's textures. |
| Store listing (screenshots, text, age rating) | 0 | Near the end. |

## Waiting on Zafar (open questions)
**New, 29 Sept (overnight Cook run):**
- *Muke sekelo khape.* as Sekelo's headline (checking with Mum; kept for now). *lakri gos* vs *hakri lakri mishkaki* for the all-meat skewer.
- Daar: record Nani's "Chop these"; confirm *hakro* as the first stir count.
- English placeholders still to record: Nani's guide lines per station (Round 4 N1–N23), samosa's phase lines and "fry them" button.
- **To record:** *kari chai* and *mori chai* (Mum, A4 §10; now in the chai station, 29 Sept).
- **The clinic:** play it through; then Section G of Round 4 is the script to record with the doctor (~9 Oct).
- ~~The cream band~~: **fill it** (Zafar, 29 Sept morning); done 29 Sept (queue item 8).
- ~~Cook's open ideas~~: **decided 29 Sept morning.** #1 is the sub cards' *dudh na* / *khun na* rows (no *wagar ji*); #2: cups are sometimes ordered as *kari chai* / *mori chai*, the rows explaining it (live 29 Sept); #3, the "don't" row, approved (live). Cook's other open ideas (5, 7, 8, 12, 18, 19) stay TBC.
- Play through Cook (all six v2 stations) and the clinic.

1. A8.9 "Who did it?": re-asked 28 Sept (R12); Mum said *kere karein* again, the final n "a half end". Zafar to judge by ear.
2. From 28 Sept (docs/kutchi-grammar-notes.md §29–§37): *hakro cup* (R8); *mirchi* with no plural vs *marcha* (P4); *watana* (fried) vs *matar* (green peas) for Cook's peas (P11); Big Ma's name (*Big Ma / Wadima / Maji*); whether Nani says *sambusa*; *Ki aiye?* vs *Ki ai?* (K4); *Alaikum salaam* without *wa* (K2); the ⚠ spellings of the story lines S1–S9. For Mum: which of *dinda / dinde* is for an elder; *khanij* (bring along) vs *khan* (take). Settled 28 Sept: *hever kadh* (urgent) and *hane kadh* (in a sequence) are both right; "in" is *me*; yesterday is *gaykal* for now.

Decided on 26 Sept: the story is English then Kutchi; *mirchi* is one chilli and *marcha* the plural; the dump 3 art is approved; the spellings are confirmed; the other modes' designs are parked; game ideas 10–17 have their verdicts (17 dropped, 12 folded into the placing game, new idea 20: the how-are-you greeting exchange).
