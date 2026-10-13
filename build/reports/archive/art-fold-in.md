# Art fold-in: dump 2/3, approved pieces

**26/27 Sept 2026.** Folding in already-processed, approved art per Zafar's go-ahead. No new features, no new Kutchi: wiring only.

## Now in the game
- **Kasuku v2** (dump 2) replaces v1's sidebar/badge. Its sheet is laid out differently (no close-up row), so the badge crops its front-on perched pose instead; v1 kept at `assets/cook/characters/old/kasuku-badge-v1.webp`.
- **Cook:** the painted chakla (batch 2 redraw) via `data.art.sprites.art.chakla`; bajri's own maani art (dough/raw/half/puffed) replaces the grey-tinted wheat art in the Maani line; the onion's `whole` sprite now flies in the daal chop station (it was cut but never wired).
- **Clinic:** the three final room backgrounds (waiting/exam/pharmacy) and Nana/Ma/Ali's `neutral` mood (their seated "sit" pose, per the manifest's own `replaces` hint) now show instead of rough placeholders.
- Nana/Ma/Ali's dump-3 counter moods (happy, new impatient) were already live from an earlier session — confirmed still working in the lab run.

## Skipped, and why
- **The 6 raw images left in "chat gpt dump for processing 2/"**: these are the family/private-photo sheets (Big Ma, the doctor, Nani from Mum's photo) that the dump-2 report explicitly reserved for Zafar to process himself. Not touched.
- **Guests as Cook customers**: the customer list is hardcoded to Nana/Ma/Ali with real kinship words already recorded; new customers need new Kutchi and a rotation feature.
- **New clinic patients** (girl/boy/old-man/old-woman/dad+baby, approved): cutting needs hand-picked box/eye coordinates per sheet and visual iteration (as Kasuku v2 needed even reusing a layout); left for a follow-up rather than ship a rough cut.
- **Old-man/old-woman waist-colour crops** (already cut): the lookup is kind+mood only; a colour variant needs a small new lookup, not pure wiring.
- **Nana/Ma/Ali feelings sheets** (already cut, 12 moods each): no screen shows a feelings layer yet (clinic's sendoff uses an emoji, not art).
- **Samosa fold steps, the skewer rack**: both are drawn per-frame outside the shared sprite system (art.js's pastry stages; grill.js's own texture cache) — wiring needs a mechanic change.
- **Chai glass top, pantry jars, the veg-whole-f sheet**: no station renders a pantry front view or a top-down glass yet — a real gap, not unwired art.
- **Onion peeled, the velan, the thali**: no consumer (peeling isn't a step; the rolling pin is drawn as part of the two-hand grip in hands.js; `vessel:serving` already shows a chaat-bowl and swapping it to a flat thali is Zafar's call).
- **Evening/night backgrounds and parked-mode art** (farm animals, bazaar, sitting room, Big Ma's room): per instructions, listed only.

## Verified
Node shared tests (23/23); `test_cook.py --lab --viewport laptop` (every station, including the Maani line's bajri path); a 390×844 Playwright load of index/first/cook/clinic with no page errors (one pre-existing, environment-only warning: the sandbox blocks Google Fonts' CDN, unrelated to this work).
