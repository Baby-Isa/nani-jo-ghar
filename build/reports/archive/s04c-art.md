# S04-C: the served chaat and Nani leaning on the counter

Branch `ccr-a7370759-t0lee7`. Game code changed: no (files swapped under the same keys; `data/cook.json` served-dishes art block). Fable judged every image and the in-game shots.

## Flaws first
- **No contact shadow shows to the right of any served dish** (Fable, both sizes): the ellipse is code (`flow.js` servedPic, Session B). CK-21 stays reopened for it.
- A true lean with forearms on the island's top can't be drawn: the island (y ≥ 611) is painted over characters. Her forearms rest along its back edge instead; Fable reads it as leaning.
- Nani's face reads a little older and fuller than the sheet; every marker is right. Her head is ~12% bigger (nearer the counter); eyes moved under 8 px.
- `nani-point`: the arms change and her body is a little more upright (reads as a gesture). No code passes `mood: "point"` today.
- Chaat rim keeps a faint grey band; the plates are a touch steep (PASS, unchanged).

## What changed
- `served/chaat-v2.webp`: the glass bowl side-on, layers through the glass, no shadow, seated on the tray floor; `pantry-basket-v2.webp` smaller and seated. Other dishes: Fable PASS, kept.
- `characters/nani-{neutral,happy,talk,point}.webp`: one leaning base, the moods as masked edits pasted back (point registered on eyes and counter).
- Tools: `build/gen_s04c.py`, `build/cut_s04c.py`, `build/tools/art/shoot_served.mjs`.

## Spend
**$2.41 of the $20 cap**, 8 calls (chaat 1, Nani base 1, happy 1, talk 1, point 4).

## Proof
- `checks.mjs`: 229/229, 0 literals, load 21/21.
- Sandbox `s04c-a` (cook:chaat, cook:day1, 1366×768): both end, 0 errors, 0 new findings. Own shots of every dish and mood at 1366×768 and 844×390 (`build/screenshots/s04c/`). About 5 min of browser.
- Rows: CHT-11 built (proof); ART-13 art part built, row stays reopened for the 1440×900 route run; CK-21 reopened (shadow). The other 29 listed rows are untouched by art: left to `/review`.

QA: ART ✅ · CUL ✅ (Fable) · rest to `/review`.
