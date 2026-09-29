# Nani jo Ghar: status tracker

**The end point:** the app is live on the store with Arc 1 (the Birthday) plus the repeatable day-out trips, and every game mode appears at least once. User testing is tracked by Zafar, not here.

**Updated:** 29 Sept 2026, 05:00 UTC (after the overnight Cook run). Percentages are Claude's estimates. The orchestrator updates this file at every milestone.

**Overall: about 24%.**

**Focus now (Zafar, 28–29 Sept): lock Cook first** (every station to the design system, real art, calm spacing), then the next Arc 1 mode. The clinic waits for Zafar's own play-through; Find it waits; the other five modes stay parked.

**The rules everything is built to:** `docs/design/cook-design-system-v1.md` (the single source of truth: tokens, 22/78 grid, shelf band, order model §12, kitchen kit + burner rule §13, serve-and-taste §14a, station specs §5/§11/§13/§14/§15) and `docs/VISUAL-QA.md` (look at every state before calling it done).

## 0. Overnight run, 29 Sept (00:28–05:00 UTC)
Eight build sessions plus three polish sessions, all Opus, ≤4 at once, each pushing to `main` once. Log: `docs/overnight-log.md`; queue and rules: `docs/overnight-queue.md`; reports: `build/reports/<name>.md` + screenshot folders. API art spent overnight: about **$1.05** (all medium quality, no paste blocks needed).

## 1. Cook with Nani: stations (v2 = rebuilt to the design system)
| Station | State | Art | Open items | Report |
|---|---|---|---|---|
| **Chai v2** | ✅ live | $0.40 | One burner per person (1–4), on the kitchen kit. Nani's line English placeholder (to record). | `build/reports/chai-v2.md` |
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
| Order card (person → items → parts; closed card + paid peek; don't rows; Nani's card via `UI.mission.addCard`) | ✅ `js/shared/order-card.js`, shared-api §14; 112/112 tests |
| Sidebar v3 (sage Nani box, one card per person, flat material pills) | ✅ |
| End pop-up (badges → words → actions) | ✅ |
| Kitchen kit (hob, burners, knobs, heat ring, chips, badges) | ✅ `Cook.Kit`; karahi added by the samosa polish |
| Serve and taste (§14a) | ✅ in sekelo, chaat, samosa, daar |
| The cream band above the counter | 🔨 **Zafar (29 Sept): fill it** with the counter top, and game pieces where they help. One build session owns it (queue item 8), with the order card's two open fixes. |

**Cook overall: about 75%** (design 100, build 95, iterate 70, words 75, voice 15, onboarding 75, story 10).

## 1b. Other modes
| Mode | Overall | Next step |
|---|---|---|
| **The clinic** | 35% | **Zafar plays it through first.** Then an audit session → Claude's feedback draft → Zafar approves → build to the design system (plans doc B1). |
| **Find it** | 45% | Same process after the clinic (plans doc B2). |
| **Conversations** (module) | 25% | Engine + lab live. Wire the 9 MVP exchanges into the first launch, Cook and the clinic (plans doc B4). |
| **First launch** | 70% | Re-run end to end after the pantry polish; the story panels to be redone for the Birthday arc (plans doc B3). |
| Tidy up / Who did it? / Dress up / Monsoon rush / Snap | 17–20% | Parked (Zafar). Each gets audit → design refresh → build with the shared components. |

## 2. Foundation and story
| Piece | % | Next step |
|---|---|---|
| Shared UI (end-of-round screen, onboarding kit, light bulb, request card) | 85 | Roll it into the five new modes as they're rebuilt. |
| Shell: one app, one save, player picker | 100 | Live: Nani's house with doors for Cook, Find it and the clinic; a player picker; one save with migration. |
| First launch: character creation and the walkthrough (pantry → chai for Nani → the Eid story → "help me cook?") | 70 | Live (`first.html`). Needs Mum's story lines, real panel art and a layered character; also a way to edit a character later, and the chai station's fun pass. |
| Story engine (arcs and chapters as data, picture panels, Story help) | 40 | `js/shared/story.js` and `data/story/*.json` exist. Next: Arc 1's chapters as data. |
| World map and home (fog of war, "the world is the menu", role reversal) | 0 | Phase C, after the first launch. |
| Speech recognition (on-device, closed set, voice star) | 30 | Enrol it with the family voice clips; the first speaking moments go in Cook. |
| Arc 1: The Birthday (S1 + S2) | 15 | Reworked 28 Sept from Eid to a birthday party (Roadmap "Story arcs"); same % as before, since it's the same modes reflavoured. Next: the first launch (needs its own hook updated off Eid), then Cook's order errand, Put it there and Hide and seek mapped onto the modes. |
| Story by the fire (every arc's ending) | 0 | Design written 28 Sept: `docs/modes/story-by-the-fire-design.md` (the day-log API, page templates, gap ladder). Buildable in one session; not started. |
| Day-out trips: the repeatable arc template (beach, garden/farm, safari, boat sketched) | 0 | Design written 28 Sept (Roadmap "Story arcs"). Next: build the template once Arc 1 lands, starting with the beach. |
| Volunteering at the clinic (standalone, repeatable arc) | 0 | Approved 28 Sept; introduced after the first or second day-out trip. Shares its build with the clinic mode above. |
| Making clothes with Big Ma (standalone, repeatable arc) | 0 | Approved 28 Sept; exact placement TBC. Shares its build with Dress up. |
| Eid (a later arc) | 0 | Moved out of Arc 1 on 28 Sept; not yet designed. |
| ~~Arc 2: The Wedding~~ / ~~Arc 3: The Monsoon~~ / ~~Arc 4: Nani's Lost Ring~~ / ~~Arc 5: Nani's Village~~ | – | **Superseded 28 Sept.** Folded into the rows above and the cross-arc vocabulary spine; see the Roadmap's "Replaced 28 Sept" note for where each idea went. |

## 3. Language
| Piece | % | Next step |
|---|---|---|
| Recordings with Mum (Sections A–J, about 170 min in all) | 25 | **28 Sept: Round 3 Parts 1–4 and C1–C21 recorded** (41 min, `sources/audio/mum-2026-09-28/`, report `build/reports/recording-2026-09-28.md`). **Next session: C22 onwards** (describing words, my/your, verbs and tenses), then G, E, F, H, D, I, J. Was: | **Next session: `docs/Questions for Mum (Round 3).docx`** (re-takes, Conversations, story lines, one/many nouns, then G, C, E, F, H, D, I, J). Was: | **Section C** (the grammar sentences) next, then G (clinic and monsoon), D, E, F, H, I. Also the 10 first-launch story lines. |
| Section A (grammar basics) and B (Cook words) | 100 | Done: grammar notes §1–§28. |
| Grammar notes and spelling rules | 45 | §29–§36 added 28 Sept (one/two, -o → -a plurals, -yu plurals, -e before *je/sathe*, the verb agreeing with the speaker). ⚠ spellings for Zafar to check. Was: | Grows with each recording. Answer the open spelling questions. |
| Voice clips (cut from the recordings, a lab page to check them) | 80 | **28 Sept: 182 new clips (102 Mum, 80 Zafar), checked by Zafar the same day: 157 OK, 25 redo; 18 second takes cut for the redos, 11 OK** (`checked` in `data/family-audio.json`). **To re-record next session** (no OK take yet): Mum *cup*, *ambo je mathe*, *amba je mathe*, *chokra sathe*, *chokri sathe*, *Nana sathe*; Zafar *hakro cup*, *salamun alaykum*, *na, muke na khape*, the S1 chai-things line, *trae bateta*, *hakri lakri*, the *pacheri* pair, *ambo je mathe*, *chokre sathe*; re-takes R1–R11 replace the redo clips; the Conversations and first-launch lines use them. Was: | **Checked by Zafar (26 Sept):** 146 OK, 27 to redo (`checked` field in `data/family-audio.json`), 21 not yet checked. Next: wire the OK clips into the game and speech enrolment. Was: | 86 Mum and 87 Zafar clips from Section B are in `lab/family-audio.html`. Zafar ticks the good ones; then wire them into the game and speech enrolment. |
| Words in the game data | Cook 70, Find 40, the clinic 5, the others 5–10 | Each mode's words go in when its recording section is done. |
| Syllabus word lists S1–S6 | S1 50, S2 20, S3–S6 5 | Recordings C and E–H fill S2–S4. |

## 4. Artwork (basic → initial → full → final)
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

## 5. Release (store)
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
- ~~The cream band~~: **fill it** (Zafar, 29 Sept morning); build queued.
- ~~Cook's open ideas~~: **decided 29 Sept morning.** #1 and #2 are the sub cards' *dudh na* / *khun na* rows (no *wagar ji*, no *kari/mori chai*), already live; #3, the "don't" row, approved (live). Cook's other open ideas (5, 7, 8, 12, 18, 19) stay TBC.
- Play through Cook (all six v2 stations) and the clinic.

1. A8.9 "Who did it?": re-asked 28 Sept (R12); Mum said *kere karein* again, the final n "a half end". Zafar to judge by ear.
2. From 28 Sept (docs/kutchi-grammar-notes.md §29–§37): *hakro cup* (R8); *mirchi* with no plural vs *marcha* (P4); *watana* (fried) vs *matar* (green peas) for Cook's peas (P11); Big Ma's name (*Big Ma / Wadima / Maji*); whether Nani says *sambusa*; *Ki aiye?* vs *Ki ai?* (K4); *Alaikum salaam* without *wa* (K2); the ⚠ spellings of the story lines S1–S9. For Mum: which of *dinda / dinde* is for an elder; *khanij* (bring along) vs *khan* (take). Settled 28 Sept: *hever kadh* (urgent) and *hane kadh* (in a sequence) are both right; "in" is *me*; yesterday is *gaykal* for now.

Decided on 26 Sept: the story is English then Kutchi; *mirchi* is one chilli and *marcha* the plural; the dump 3 art is approved; the spellings are confirmed; the other modes' designs are parked; game ideas 10–17 have their verdicts (17 dropped, 12 folded into the placing game, new idea 20: the how-are-you greeting exchange).
