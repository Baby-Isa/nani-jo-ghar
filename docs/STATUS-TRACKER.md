# Nani jo Ghar: status tracker

**The end point:** the app is live on the store with Arcs 1–5, and every game mode appears at least once. User testing is tracked by Zafar, not here.

**Updated:** 28 Sept 2026. Percentages are Claude's estimates. The orchestrator updates this file at every milestone.

**Overall: about 20%.**

**Focus now (Zafar, 26 Sept): Cook, the clinic, the first launch (story walkthrough and character creation), Cook and character art, and recordings with Mum.** The other five modes are parked, and their designs aren't reviewed yet.

## Now (28 Sept)
- **Reworked (28 Sept, docs only):** the story arcs, per Zafar's decisions (`docs/ideas-2026-09-28-arcs-and-focus.md`). Nani is now written as the child's guide, not a kitchen-bound character. Arc 1 is now **The Birthday** (guests order their own food, set the table, sweets hide-and-seek and counting, blow out the candles), not Eid; Eid moves to a later, not-yet-designed arc. Arc 2 onward is now a repeatable **"day out with Nani"** template (pack the bag, cook the packed lunch, travel with a new spot-it window game, a three-game food stall, one or two place games, then the fire), sketched for the beach, the garden/farm, the safari and the boat. Two standalone repeatable arcs are placed in the sequence: **volunteering at the clinic** and **making clothes with Big Ma**. Every arc now ends with **the Story by the Fire**: a fireside scene, then a picture book built from records of what the child actually did that day (not screenshots), voiced by Nani, with tap-to-fill-in-the-word gaps that grow as the child improves. Full rewrite: `docs/Nani jo Ghar — Roadmap and Story Structure.md` (old five-arc plan kept as a short "Replaced 28 Sept" note); new design and data model: `docs/modes/story-by-the-fire-design.md`; new pantry art direction (every pantry item redrawn as a side-on jar or tub, one consistent family, replacing today's top-down-on-a-side-on-shelf mismatch): `docs/chatgpt-art-prompts-pantry-jars.md`. New approved-but-unbuilt ideas logged in `docs/GAME-IDEAS-TBC.md`.
- **Redrawn (28 Sept):** the end-of-round screen's three badges (`js/shared/results.js`, `docs/UX-PRINCIPLES.md` s9a) — a stopwatch outline with the time inside (gold/dim-gold/grey), a chunky tick that fills green/red as a gauge (gold + shimmer when all right), a light bulb that dims and cracks with each hint — all inline SVG with CSS animation, reduced-motion respected. Page 2's word review now groups right words (green) on the right and wrong ones (red) on the left; Cook passes real per-word right/wrong, the clinic doesn't track it yet so its words default to right. Same API, so every caller picks it up unchanged. Verified: `build/test_shared_ui.mjs`, `build/test_shared-ui-browser.mjs`, a Cook grill round, screenshots in `build/reports/results-9a.md`.
- **Wired (28 Sept):** the family voice clips play in the game. A shared lookup, `js/shared/family-voice.js` (mum "ok" > zafar "ok" > either unchecked, "redo" never used), used by Cook (`js/cook/lang.js`'s `Lang.speak`, whole line/frame/word, mixed with the placeholder voice where there's no clip), `first.html` (`js/shared/story.js`, by a line's `clip` id or its Kutchi text) and the clinic (`js/clinic/kit.js`'s `Kit.Voice.say`). Coverage: `build/reports/voice-coverage.md` (18 Cook words now Mum, 2 Zafar, 34 still fallback; the clinic's own words aren't recorded yet, so it's wired but silent there for now).
- **Fixed (28 Sept):** family clips playing no sound on the live site — `lab/conversations.html` never loaded `js/version.js` (so `njgV` was undefined) and `build/bump_version.py` only stamped root-level pages, so returning players on GitHub Pages kept a stale, cache-busted-nothing copy of the lab and its data/audio fetches; `js/shared/conversations.js`'s `C.say` also built clip URLs without `njgV`. `bump_version.py` now stamps every `lab/*.html` too. Verified with Playwright served from a subdirectory (404-free, `readyState > 0`, `play()` resolves after a click).
- **Art fold-in (27 Sept):** Kasuku v2, the painted chakla, bajri's own maani art, the onion's whole sprite, and the clinic's final rooms + Nana/Ma/Ali seated pose are live (`build/reports/art-fold-in.md`). Still waiting on a cutting pass: the new clinic patients (girl/boy/old-man/old-woman/dad+baby) and old-man/old-woman's colour variants. The 6 family/private-photo raw images left in the dump-2 folder are still Zafar's to process.
- **Paused (Zafar, 26 Sept eve):** Cook hands fixes + phone ⌂ fix (`claude/cook-hands-fix`). Zafar is reviewing whether the hands stay at all (long thin arms add clutter); maybe only where the hands sit near the bottom of the screen, e.g. turning the skewers.
- **Live (26 Sept, 20:40 UTC):** the Conversations engine and lab (`lab/conversations.html`, linked from `labs.html`). Not wired into any mode yet (hook points: `docs/modes/conversations-wiring.md`). Mum's recording list: `build/reports/conversations-mvp.md`.
- **Waiting on Zafar:** detailed feedback on Cook, the clinic and the first launch (then the chai fun pass and clinic iteration start); ticks on the voice clips (then wiring the clips and a new Word doc for Mum).

## 1. Game modes
The stages are: design → build the MVP → iterate from Zafar's feedback → Kutchi words in → family voice in → onboarding → story hooks.

| Mode | Design | MVP build | Iterate | Words | Voice | Onboard | Story | **Overall** | Next step |
|---|---|---|---|---|---|---|---|---|---|
| **Cook with Nani** | 100 | 100 | 60 | 70 | 10 | 70 | 10 | **65%** | Merge the hands. A fun pass on the chai station. Zafar decides the next wave (chop level 1, customer reactions). |
| **Find it** | 100 | 90 | 30 | 40 | 5 | 50 | 10 | **45%** | Into the shell. Rebuild to the quality-pass design (the library cut from 21 to 10). |
| **The clinic** | 100 | 85 | 0 | 5 | 0 | 60 | 0 | **35%** | Zafar's first play. Record Section G (the clinic words). Build D3 clues, the album and free play. |
| **Tidy up** (parked) | 100 | 30 | 0 | 10 | 0 | 0 | 0 | **20%** | Zafar reviews the quality-pass design, then a rebuild. |
| **Who did it?** (parked) | 100 | 30 | 0 | 10 | 0 | 0 | 0 | **20%** | Same. The family's A6 lines are ready for it. |
| **Dress up** (parked) | 100 | 30 | 0 | 5 | 0 | 0 | 0 | **18%** | Same. It shares art with character creation. |
| **Monsoon rush** (parked) | 100 | 30 | 0 | 5 | 0 | 0 | 0 | **18%** | Same. Section G has the weather words. |
| **Snap** (parked) | 100 | 25 | 0 | 5 | 0 | 0 | 0 | **17%** | Same. |
| **Conversations** (module) | 80 | 70 | 0 | 0 | 0 | 0 | 0 | **25%** | **Engine + lab live (26 Sept eve); 23/23 tests.** Next: wire the 15 placements after Zafar's mode feedback; Mum records the list in `build/reports/conversations-mvp.md`. Design decided (26 Sept). Build the MVP slice (9 exchanges) after the first launch; Mum records the common whole phrases. (`docs/modes/conversations-design.md`). |

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
| Voice clips (cut from the recordings, a lab page to check them) | 80 | **28 Sept: 182 new clips (102 Mum, 80 Zafar), checked by Zafar the same day: 157 OK, 25 redo** (`checked` in `data/family-audio.json`); re-takes R1–R11 replace the redo clips; the Conversations and first-launch lines use them. Was: | **Checked by Zafar (26 Sept):** 146 OK, 27 to redo (`checked` field in `data/family-audio.json`), 21 not yet checked. Next: wire the OK clips into the game and speech enrolment. Was: | 86 Mum and 87 Zafar clips from Section B are in `lab/family-audio.html`. Zafar ticks the good ones; then wire them into the game and speech enrolment. |
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
1. A8.9 "Who did it?": re-asked 28 Sept (R12); Mum said *kere karein* again, the final n "a half end". Zafar to judge by ear.
2. From 28 Sept (docs/kutchi-grammar-notes.md §29–§36): *hever kadh* or *hane kadh* (R6); *hakro cup* (R8); *mirchi* with no plural vs *marcha* (P4); *watana* (fried) vs *matar* (green peas) for Cook's peas (P11); Big Ma's name (*Big Ma / Wadima / Maji*); whether Nani says *sambusa*; *Ki aiye?* vs *Ki ai?* (K4); *Alaikum salaam* without *wa* (K2); the ⚠ spellings of the story lines S1–S9.

Decided on 26 Sept: the story is English then Kutchi; *mirchi* is one chilli and *marcha* the plural; the dump 3 art is approved; the spellings are confirmed; the other modes' designs are parked; game ideas 10–17 have their verdicts (17 dropped, 12 folded into the placing game, new idea 20: the how-are-you greeting exchange).
