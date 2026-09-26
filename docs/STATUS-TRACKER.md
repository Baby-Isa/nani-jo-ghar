# Nani jo Ghar: status tracker

**The end point:** the app is live on the store with Arcs 1–5, and every game mode appears at least once. User testing is tracked by Zafar, not here.

**Updated:** 26 Sept 2026. Percentages are Claude's estimates. The orchestrator updates this file at every milestone.

**Overall: about 20%.**

**Focus now (Zafar, 26 Sept): Cook, the clinic, the first launch (story walkthrough and character creation), Cook and character art, and recordings with Mum.** The other five modes are parked, and their designs aren't reviewed yet.

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
| **Conversations** (module) | 60 | 0 | 0 | 0 | 0 | 0 | 0 | **9%** | Design decided (26 Sept). Build the MVP slice (9 exchanges) after the first launch; Mum records the common whole phrases. (`docs/modes/conversations-design.md`). |

## 2. Foundation and story
| Piece | % | Next step |
|---|---|---|
| Shared UI (end-of-round screen, onboarding kit, light bulb, request card) | 85 | Roll it into the five new modes as they're rebuilt. |
| Shell: one app, one save, player picker | 100 | Live: Nani's house with doors for Cook, Find it and the clinic; a player picker; one save with migration. |
| First launch: character creation and the walkthrough (pantry → chai for Nani → the Eid story → "help me cook?") | 15 | Being built now (`claude/first-launch`). |
| Story engine (arcs and chapters as data, picture panels, Story help) | 5 | Comes with the first launch. |
| World map and home (fog of war, "the world is the menu", role reversal) | 0 | Phase C, after the first launch. |
| Speech recognition (on-device, closed set, voice star) | 30 | Enrol it with the family voice clips; the first speaking moments go in Cook. |
| Arc 1: Eid at Nani's (S1 + S2) | 15 | The first launch, then its chapters mapped onto the modes. |
| Arc 2: The Wedding (S3) | 5 | Outline only. |
| Arc 3: The Monsoon (S4) | 5 | Outline only. |
| Arc 4: Nani's Lost Ring (S5) | 5 | Outline only. |
| Arc 5: Nani's Village (S6) | 5 | Outline only. |

## 3. Language
| Piece | % | Next step |
|---|---|---|
| Recordings with Mum (Sections A–J, about 170 min in all) | 15 | **Section C** (the grammar sentences) next, then G (clinic and monsoon), D, E, F, H, I. Also the 10 first-launch story lines. |
| Section A (grammar basics) and B (Cook words) | 100 | Done: grammar notes §1–§28. |
| Grammar notes and spelling rules | 35 | Grows with each recording. Answer the open spelling questions. |
| Voice clips (cut from the recordings, a lab page to check them) | 60 | 86 Mum and 87 Zafar clips from Section B are in `lab/family-audio.html`. Zafar ticks the good ones; then wire them into the game and speech enrolment. |
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
| **Hands** (player-boy, player-girl, Nani) | ✓ | ✓ | 90 | 0 | **70%** | Being put into Cook now. Eid mehndi later. |
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
1. A8.9 "Who did it?": re-ask Mum. Whisper heard *kere karein*, and Zafar doesn't recognise it.

Decided on 26 Sept: the story is English then Kutchi; *mirchi* is one chilli and *marcha* the plural; the dump 3 art is approved; the spellings are confirmed; the other modes' designs are parked; game ideas 10–17 have their verdicts (17 dropped, 12 folded into the placing game, new idea 20: the how-are-you greeting exchange).
