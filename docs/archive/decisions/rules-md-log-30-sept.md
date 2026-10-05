# The 30 Sept decisions log and open questions (1–27), as they stood in rules.md until 5 Oct 2026

Archived by the docs rewrite (D1). The lasting ones are in `docs/decisions.md`; the rest are in `docs/sprints/S01-remedial-and-engine.md`.

## Decisions log, 30 Sept

Zafar's answers to the NEEDS ZAFAR conflicts, 30 Sept, 19:30 UTC (harvest Conflicts table numbers in brackets):

1. **Hints cost lightbulbs** (the hints badge); nothing costs the ear star any more. (#5)
2. **The voice star goes;** correct speaking earns more pocket money. The child isn't told the mechanism: simply, the better they do, the more pocket money. (#58)
3. **The accuracy tick fills gold / grey,** not green/red. (#59)
4. **The quilt becomes Big Ma's quilt-making story arc** (separate from her making-outfits arc); the progress marker is a bookshelf that fills with one named book per finished arc at the "book end" review with Nani. (#6)
5. **Use *mirchi* only for now** (no *marcha* plural); Zafar will confirm with Mum. (#25)
6. **Everything stays public** (repo, recordings) until the game or landing page is published and people start looking; then revisit. (#41)
7. **Commercial model: TBC;** both ideas stay open, no rule. (#42)
8. **Mithai at a celebration is fine;** never lollies, biscuits or sweets as rewards to the child (the clinic lolly goes). (#43)
9. **Unattended runs may make art of family members;** all consent is given; Zafar supervises only each person's first character sheet. Supersedes "real people's art only with Zafar present". (#66)
10. **Pocket money model:** pay by volume × quality (hints, ticks, time) × difficulty; upgrade prices calibrated so an upgrade comes every 2–3 games at first, stretching to 4–5. (Zafar, 30 Sept)
11. **Big Ma is called "Big Ma"** in the game. Quilt-making and making outfits are two separate Big Ma arcs. (Zafar, 30 Sept)
12. **English:** no written English for the child, ever. Story mode may speak English and then repeat in Kutchi where needed, especially at the start for longer exposition, avoided where simple lines and visuals will do. (Zafar, 30 Sept, reviewing CLAUDE.md)
13. **Engine and voices:** every word must be a human recording, but the sentence can be built by the engine; statistical analysis of simulated play identifies the most-used phrases, which are recorded whole. (Zafar, 30 Sept)
14. **Handover timing:** don't wait for a full chat; hand over at step boundaries and around 70% context rather than compacting. (Zafar, 30 Sept)
15. **Phone screenshots are landscape:** 844×390 (iPhone 12–14, one of the three most-used phone sizes) as the main phone size, 800×360 (the most-used Android size and the tightest height) in the full matrix, plus one upright shot for the rotate card. (Zafar, 30 Sept)
16. **The orchestrator owns the regression list** and reports open rows at every step end; a one-line update to Zafar at every check-in during runs. (Zafar, 1 Oct)
17. **The language engine is a Kutchi engine:** GF's design, our own small JavaScript engine; Sindhi only as a structural reference. The Excel is retired as a source. (Zafar, 1 Oct)
18. **The code target model is approved** (`docs/architecture/target-model.md`); star code and the clinic's phase-1 prototype go; computer voices stay on the test site, out of the store app. (Zafar, 1 Oct)
19. **Keep building the clinic, ideally to completion before the doctor's ~9 Oct visit,** so he can play his section. Supersedes "no clinic build before the visit". (Zafar, 1 Oct)
20. **Screenshots and report images are not committed** (site under 1 GB); **the clinic's coins join the one purse now**; no wages; browser tests in Node; the layout lint only gets stricter. (Zafar, 1 Oct)
21. **Unconfirmed gender → the he-form, flagged and never shipped;** the bowl errand retired; step 3 as the lean plan with R4 and R5 side by side; Mum's 1 Oct session uses Round 4. (Zafar, 1 Oct)
22. **Story mode and free play;** the free-play map shows every place, locked ones labelled with the story that opens them; the core holds the play context, unlocks, the map as data, the language setting, per-child settings, a paid-content check and content versions. (Zafar, 1 Oct)
23. **Word books** (a picture dictionary by topic) on the shelf beside the story books; R3b (one game host, mode and arc formats, a build guide) is back in step 3. (Zafar, 1 Oct)
24. **No gaps in the checks** (every live flow and level, mistakes and hints, canvas text, sound, overlap, tablets, parked-mode smoke flows); **tablets first-class and layout built to scale**, the scaling rules set later in data. (Zafar, 1 Oct)
25. **Flexible, not locked:** the sidebar and its text scale with the screen; the order card can lay short rows out as pills sharing a line, chosen per screen size in data (default stacked until Zafar chooses). (Zafar, 1 Oct)
26. **Stitched speech everywhere** until the pre-publish pass (whole-phrase clips off); a dictionary mode later; device support set by the market (iOS 15+ with a shim, Android 7+, a cheap-phone performance budget); model reply voice follows the character; five word stages; labs pay like real play. (Zafar, 1 Oct)
27. **The clinic's heal games** per the 1 Oct report §10 with Zafar's changes (`docs/decisions.md`): zoom in and out, two wide shots, body states, the bulb/eye split, the guided first round, the review shows what went wrong; everything lands before the doctor's visit and must look better than Cook today. (Zafar, 1 Oct)

## Open questions

- **Commercial model: TBC.** Zafar's £2/month idea (first arc free) and "free to the community" both stay open; no rule yet. (J5, decision 7)
- **The *mirchi* plural:** *mirchi* only for now; Zafar to confirm with Mum. (decision 5)
- **Words still to ask Mum:** *kere karein* ("who did it?"), which Zafar doesn't recognise; green pepper (no Kutchi word: drop it from skewers?); the maani turner *moikyo*; *Muke sekelo khape*. (G25, H20, H21)
- **A skip for spoken replies in Conversations** is TBC. (E26)