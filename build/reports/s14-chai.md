# s14-chai: live chai on the s14 cards, helper card, light and pour (29 Oct)

## What changed (chai only, via the kit's `s14` option)
- Art: s14 pan states and glasses by their rims. Pour: the pan above its glass, `pan-empty`/`glass-fill` 1-6 in step (L4 half on frame 4), no tipping, no stream.
- Cards: `WordCard.big14/item14/morph/fit14`; the self-settling order row (`OrderCard s14`); the pop-out turning into its row card.
- Nani: arrow and helper card instead of bulb and speaker.
- Light: no finger, never blocks a tap; order card lit 1.2 s; first hint teaches the arrow; glass lit and tappable; dots lit once; bubble speaker 1.8 em.
- Zafar's level rules 1-8 (29 Oct) in data; heat values suggested, for his review.
- New checks contract-72/73/74 with tests.

## Proof
- After: `build/screenshots/brief/s14-chai/` (run br-s14-chai-after-20261029-033231-a9m). No BEFORE existed. SH-147/144/152/153 each have one tool failure at one size.
- Contract s14-chai-contract3: 12/12 ends. `CONTRACT FAILED: 40 breaks (contract-44 4, contract-39 24, contract-52 8, contract-51 4)`.
- Taps L1-L4 s14-chai-ck54: 4/4 ends. `12 breaks (contract-44 4, contract-39 5, contract-35 2, contract-37 1)`. 72/73/74: 0.
- Checks: unit 3 fail (206, 339: merged helpMs; 497: artcheck, s14 glasses); the rest ok.
- QA: TXT ✅ LAY ✅ LNG ✅ CMP ⚠ (chai only) ART ⚠ (foam).

## Open
- Breaks that follow his newer rules, so the checks need updating: 44 (no finger), 39 and 35 (rule 7), 37 (L4 decoys).
- clinic:heal-eye 51/52: untouched files.
- KUTCHI/ENGLISH labels dropped (English for a child).
- Sandbox shows a fallback serif, not Fraunces.
- Foam is still v3 art.
