# Rules harvest: Orchestration 2 (the chat of 25–26 Sept 2026)

This lists every standing rule, preference and durable decision Zafar gave in this chat. It covers both the ones already in docs and the ones that only lived in the chat. Each line is the rule as an instruction, with roughly when he said it.
- **REVERSED** marks a rule he later changed.
- **(chat only)** marks a rule that wasn't in a doc before this harvest.

The chat was compacted once, so rules from before 26 Sept come from the summary made at that point and may be paraphrased.

## Working with Zafar; sessions and agents
1. Act as the orchestrator: delegate the work to sub-agents and remote sessions, keep the chat lean, and push as you go. (25 Sept)
2. Use Opus (5.5) models to build. Use "as many agents as you think best" for a whole game mode. (26 Sept, the clinic build)
3. Build one agent per mode, concurrently, with each mode made of mini-games built from modular mechanics (Cook's pattern). A foundation agent builds the shell and the shared pieces first, to keep rework low. (25 Sept)
4. **Keep to about 4 heavy sessions at once.** Six or more hit the 5-hour usage limit in about 90 minutes. (26 Sept, a lesson Zafar accepted; chat only until written into the handoff)
5. When a usage limit hits, get every session to save, and resume them all when the limit resets. (25 Sept: "get everyone to save and then safely resume in 3 hours 35 mins")
6. After a usage-limit reset, "continue from where you left off" without re-asking. (26 Sept, repeatedly)
7. Take the defaults when Zafar is busy ("take all the defaults"); don't block on him. (25 Sept)
8. Keep a single status tracker (`docs/status.md`), refer to it constantly, and update it at each milestone. Leave user testing out; Zafar tracks that himself. Pull artwork out as its own section with levels: basic → initial → full → final. The end point is the store launch with Arcs 1–5, with every mode appearing at least once. (26 Sept)
9. Park approved-but-unbuilt game ideas in a "to be built" area (`docs/ideas.md`). Before any mode is finished, remind Zafar of its open ideas, or he'll ask. (26 Sept)
10. Before moving to a new chat, write a full handover doc and a ready-to-paste starting prompt. (26 Sept)
11. Give Zafar links so he can try new modes on his laptop (`labs.html`). (25 Sept)
12. Explain unclear things plainly when asked (e.g. "what's the chai station fun pass?", "what are ideas 10–17?"): don't assume he remembers ids. (26 Sept, chat only)

## Git, pushing and publishing
13. Push work as it's made, and publish to `main` (the live GitHub Pages site). Run `build/bump_version.py` before every push to main (cache-busting). (25 Sept)
14. Artwork Zafar puts in a folder in `assets/` (e.g. "chat gpt dump 2/3") gets properly named, moved to its right place and processed, with a report and contact sheets. (26 Sept)
15. Mum has consented to her voice being in the GitHub repo. The repo is to be made private later. (25 Sept)

## Reviews and QA
16. An agent must assess **every** generated asset (e.g. every hand image) as pass or fail, and fix the failures. Obvious fails (flat sticker rings, dotted-line bracelets) must never reach Zafar. (26 Sept)
17. Get Fable to review documents and designs before they go to Zafar (Questions for Mum, clinic ideas, deep dives). (25 Sept)
18. Every mini-game gets a quality pass against five questions (what you do, the challenge, the fun, the instruction, what's new) and is cut to the best, borrowing from popular children's games. (25 Sept)
19. Every mode is a pipeline of stages with several mini-games per stage. (25 Sept)

## Art pipeline and costs
20. Throwaway rough art is fine for testing a mode visually: make a basic essentials pack with lots of assets per image request, to be replaced later. (26 Sept, the clinic)
21. The art zips for Claude in Chrome put cooking first, include all attachments, and allow private photos: "it can and should use them if needed". (25 Sept)
22. The OpenAI image API uses medium quality only. A pre-flight estimate over about $5 needs Zafar's OK. The per-job caps he agreed: the clinic's rough art ≤ $5, hands v3 ≤ $8. (earlier; reaffirmed 26 Sept)
23. Family and private-photo art (Big Ma, Nani from Mum's photo, the doctor) is left for Zafar to process himself. (26 Sept)
24. Approved art replaces the live art, and the old versions are kept (e.g. the counter moods moved to `old/*-v1`). (26 Sept, chat only)
25. The hands: the approach is approved. Jewellery must be 3D and shaded in the hands' style, wrapping round the finger or wrist. The hands v3 result was passed. (26 Sept)
26. Zafar's skin tone is the base for generated characters; real-likeness characters follow their photos. (24 Sept, in the Cast doc)
27. The doctor is Hannah's real granddad; the clinic centres on him. (25 Sept)

## UX, UI and game feel
28. A request card over the play area, read aloud, with read-along highlighting; it then shrinks into the sidebar. (25 Sept, UX §1)
29. The sidebar is on the left; big action buttons are on the right. (UX §2)
30. One fixed-shape card per item: a skewer card always has four dots. (UX §3)
31. Help is one light bulb (5/3/2/1 s, costs the star) plus one speaker per card; no per-line translate or speaker buttons. (UX §4)
32. One job at a time: split two-job stations into phases ("thread, then Go to the barbecue"). (UX §5)
33. Cut what isn't the lesson (no chips on the grill). (UX §6)
34. Start super simple: level 1 is tiny, the pantry comes first, and each level adds one thing. (UX §7)
35. Onboard by showing, not telling (dim, ghost finger, do it). UI appears as it's needed. (UX §8)
36. The end-of-round screen: three badges (time and personal best, accuracy, hints), then Next, then the word review. (UX §9)
37. Onboarding scripts are written once a mini-game's mechanics settle; the kit is built now. (UX §10)
38. A picture tally shows what you did, never the target. (UX §11)
39. **The instruction card auto-ticks at every level; count rows tick when the step closes, never when the number is reached.** (25–26 Sept, UX §11)
40. No negative feedback mid-round; mistakes show in the end review. Level 1 keeps one gentle correction. (UX §11) **Partly REVERSED for Conversations** (UX §14, below).
41. **Controls are consistent within each mini-game, not tap-only.** Swipe and stir are fine. If ingredients are tapped in, liquids are tapped too (a tap pours). A mini-game's gestures never change between levels. (25 Sept; **REVERSED** an earlier "always tap" instruction on 26 Sept)
42. The instruction card is the master. Nani is a voice plus throbbing hints and short interjections; she's on screen only in story moments, the request card and the send-off. (UX §13)
43. **Conversations: a wrong reply pill shakes, the person looks embarrassed (3–4 cycling reactions) and asks again, and the child can't move on until they pick the right one.** This applies all the way through for taps. For speaking, a skip is TBC. (26 Sept, UX §14)

## Kutchi language and voice
44. **Never invent Kutchi.** Use only the family's words, or mark placeholders. (standing)
45. **No V at the start of a Kutchi word: use W** (*wadho*, *wagar*, *wij*). A V inside a word is fine (*sev*, *vyo*). (25 Sept; refined 26 Sept)
46. There's no word for "the" in Kutchi; don't write English articles into Kutchi frames. (25 Sept)
47. Double long vowels where they're heard long (*waari*, *daar*, *maani*, *saani*). (25 Sept)
48. Spelling corrections to use everywhere:
    - *waari*, not *wari*; keep *khun* (sugar); *daar*, not *daal*;
    - *khapanti* / *khapanta*; one is *hakro/hakri*; two is *ba* (said "ber");
    - *wij*; *lai*, *ai*;
    - *khun nati khape*; *ki baki nai*; *ki rei nai vyo*;
    - *agiya*, *puthiya*, *rakh*, *hida*, *saani*;
    - *film khalas thai vai* (a she-word takes *vai*);
    - *tu ki aiye?* / *aai ki aayo?*; *e achi vyo / vya*, *e achdo / achda*;
    - *achindo* = will come; *nar* = look; *na* = no;
    - *hane* (now, in a sequence: use it for cooking); *hever* (now, in general);
    - *chundo* = mince (not *chindo*; *keema* is also accepted);
    - *aau theek ai*;
    - *cup* has no gender: *hakri cup*, *bharelo cup*, *aako cup* (the cooking measure);
    - *mirchi* = one chilli, *marcha* = several.

    (25–26 Sept)
49. The informal *Muke {x} khape* stays as Cook's order frame; the formal endings are a later stage. (25 Sept)
50. "Thank you" is said in English. Goodbye is ***khuda-fis***. Hello is *salaam*. (26 Sept)
51. ***aai*** is for everyone older, older cousins included. ***tu*** is for the same age or younger. (26 Sept)
52. Mum records the common whole phrases; everything else is built from modular chunks (smaller phrases or single words). (26 Sept)
53. The model voice for the child's replies: Zafar's if the player picked a boy, Mum's if a girl, for now. (26 Sept)
54. Mum says 🎤 words three times. Transcribe in 25-second chunks with Whisper. (25 Sept)
55. Questions for Mum: speak sentences, never fill in tables. The grammar is elicited through lots of short things to say. (25 Sept)
56. *kere karein* ("who did it?") isn't recognised by Zafar: re-ask Mum. (26 Sept, chat only until the grammar notes)

## Game design
57. **Current focus: Cook, the clinic, the first launch (story and character creation), and Conversations.** Tidy up, Who did it?, Dress up, Monsoon rush and Snap are parked, and their designs aren't reviewed yet. (26 Sept)
58. The clinic is the next big focus after Cook. (26 Sept)
59. The clinic:
    - the child never gives medicine (the doctor checks it, as a word review);
    - drop the pill organiser;
    - "my left, my right", always the patient's own side;
    - stitches and injections are fine, but comic, never gory.

    (25 Sept)
60. Speaking is core: every mode gets speaking moments (closed set, on-device, with a pills or parent fallback, and a voice star). (25 Sept)
61. Game ideas (26 Sept):
    - **Approved:** 10 (place words), 11 (*hi baju / hu baju* first, then *dabo / jamno*), 13, 14 (introduced slowly through greetings), 15, 16, 18 (asking an elder for chai), 19 (dai with *mervan*).
    - **Partly approved:** 12 keeps only *munje same rakh*, folded into the placing game; *munje same we* is dropped, and there's no plating-up mode.
    - **Dropped:** 17 (the fry station's "take them out?"), too complicated.
62. **Conversations is its own module.** Greetings and questions vary (salaam, how are you, "are you cooking today?", "can you help me?", "will you make chai?", "do you know who I am?"). It appears before, after or during modes and story beats, seamlessly. Difficulty ramps: written and sound → sound → speaking → asking. (26 Sept)
63. Conversations frequency: one per game mode, plus one every 2 minutes; tune it later. (26 Sept)
64. The wrong-register reaction is a head scratch or embarrassed look, cycling through 3–4 expressions. **No "Nana looks behind him" joke.** (26 Sept, reversing the design doc's default)
65. Kasuku only repeats words for now. Isa is only talked about, never talked to. (26 Sept)
66. The register choice is graded from S2 and spoken from S3. A spoken reply can earn the round's voice star. (26 Sept)
67. The chai station is "a bit boring" and needs a fun pass, because it's the second thing new players see. (26 Sept)
68. Green pepper has no Kutchi word. The recommendation (to drop it from the mishkaki) wasn't answered; don't treat it as decided. (26 Sept)

## Story and onboarding
69. **The first launch:**
    1. create a character;
    2. Nani's house;
    3. the three-item pantry round for the chai things;
    4. back to Nani, "Can you make me chai?";
    5. the chai station;
    6. Nani sips;
    7. the calendar (tomorrow is Eid), the thought bubble (guests), the empty pots;
    8. "Can you help me cook?", where only Yes works;
    9. then into the game.

    The pantry and chai scenes are separate, not one rolling sequence. (26 Sept)
70. **Story lines: English first, then Kutchi**, very simple ("Tomorrow is Eid", "Everyone is coming", "Oh no, the food is not ready", "Can you help me cook?"). **REVERSED** Claude's "sandwich" suggestion; English-then-Kutchi was chosen. (26 Sept)
71. The first-launch Yes/No: a tap on No shakes, Nani looks embarrassed and asks again, until Yes. (26 Sept; **REVERSED** the earlier "No dodges / Nani laughs")

## Characters and customisation
72. Character creation is quick and lightweight, and built to scale. The person is on the left, the choices on the right: gender, skin, hair colour, eye colour and clothing **colours** (not garments). (26 Sept)
73. The player's hands match the chosen gender (player-boy / player-girl). (26 Sept)

## Family and culture
74. The family uses *beta* for boys and girls. *boga* (vegetable) and *jikoni* (kitchen) are family Swahili words, fine to use. (26 Sept)
75. Mum's recordings are the authority for Kutchi; Zafar confirms the spellings; Masi is the tie-break for dialect questions. (25–26 Sept)
