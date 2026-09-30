# Chai v3 (29 Sept play-test §4: C1–C13; this session C8 / X9, C5, C2, the tray layout)

Branch `claude/cook-chai-v3`. Station `js/cook/stations/chai-tray.js`, shoot script `build/shoot_chai_v2.py`,
shots `build/reports/chai-v3/`. Most of §4 (C1, C3, C4, C6, C7, C9–C13) was already done and live; this
session did the rest.

## 1. Mechanics changed or removed
- **None removed.** Water, leaves, milk, sugar, extras, the salt decoy, one knob and one heat gauge per pan,
  the boil band, boil-over, the pour (half / full at level 4), the kari / mori orders, the card pop-up and the
  review faces all work exactly as before.
- **What the pan shows changed (C8 / X9):** the drawn water shading, the v2 painted pools (tea, milk, milky,
  dark) and the "how full" radius are gone. The pan itself is now one of v3's nine pictures, chosen by stage
  and heat and cross-faded (see §2). The pan no longer looks fuller after a second splash of water; the
  pictures have one fill level.
- **Shared files touched (small, additive, default off):**
  - `js/cook/order.js` (`O.sentence`): a row whose words are all marked `joinless` in `data.words` never
    takes the join word; the join waits for the next row. Only `ph-half` / `ph-full` (adh / aako) carry the
    mark, so nothing else changes.
  - `data/cook.json`: `"joinless": true` on `ph-half` and `ph-full`.
  - `build/check_vessel_meta.py`: the chai `panTop` check now measures the v3 pan (five of its pictures) and
    compares `META.panTop` with `v3/chai/meta.json` (one canvas, same anchor, body radius, contents radius
    inside the rim). The v2 `chai-v2/meta.json` check stays (the kit's `VESSELS.pan` still uses the v2 pan).
- **Debug hooks for the shoot script (harmless when unused):** `Cook.chaiPans()` (each pan's state and
  heat) and `Cook.chaiServe` ("right" / "wrong", set just before the review faces).

## 2. What was built
- **C8 / X9, pictured pan contents.** `assets/cook/items/v3/chai/pan-*.webp` (nine pictures on one
  registered canvas, 405×389) replace the v2 top-down pan. `META.panTop` is the canvas's registration
  point, the rim's measured centre with the handle left out (0.3754, 0.6146), and the rim's own radius
  (0.3243) is the heat gauge's radius, as before. The pan is drawn 1.087× its body, as the v2 pan was, so
  pans, flames and gauges are the same size on the hob as yesterday.
  - Which picture: empty → **water** → **leaves** (steeping) → **tea** as it heats (a cross-fade by heat) →
    **boil-tea** at the green. With milk: **milky** (or **spiced** once aadu / elchi is in) → **boil-milky**
    at the green → **foam** past the green (the boil-over warning). Turned down, it settles back to tea /
    milky / spiced. Poured out: empty.
  - Anything going in fades the next picture in over the last: the bottle and carton over their pour,
    a spoon (leaves, spice) as it lands. The heat tick waits while a fade runs, so nothing flickers.
  - **Nothing liquid is drawn.** The only drawn things on the pan are the C11 bubbles and the steam wisps,
    on top, as Zafar liked them.
  - `pan` and `mix` are the two images (the stage, and the next one fading in); the pour hides both while
    the pan is away, and the burner under it stays unlit as before.
- **C5, the sentence.** Checked with 600 generated orders per level (every combination of named / milk /
  sugar / extra / amount):
  - an extra always heads the sentence in its *waari* form, and is the card's top row:
    *Muke aadu waari chai khape, with dudh, ba khun.*;
  - *Muke kari chai khape, dudh na, with hakro khun.* and *Muke mori chai khape, with dudh, khun na.*
    read right; an extra wins over kari / mori (*Muke elchi waari chai khape, dudh na, khun na.*), which
    is the data's own rule;
  - **fixed:** at level 4 the amount took the join word when nothing before it did: *…dudh na, khun na,
    with aako* ("no milk, no sugar, with full"). It now reads *…dudh na, khun na, aako.*
- **C2, the water bottle.** Measured in the running game (laptop and phone landscape, level 1, the bottle
  hopping as the first thing to do): its top at the peak of the hop is y 686 (design px), inside the band
  (top 666) and below the padding line (683). The X7 padding rule (`St.shelfFit`) already covers it;
  nothing to change.
- **The shoot script** now shoots every state (start, water, leaves, tea, mid-cook, milky, spiced, boiling,
  foam, pan-pour, serving, taste-wrong, taste-right, end), with a clean second run per level for the right
  serve, and `--matrix` for laptop + phone landscape, levels 1–4 and 4 people.
- **The praise card at 4 people** (found in the shots, fixed): the card goes right of the last face, which
  at 4 people is the tray's bottom-right one, so *Shabash!* ran off the view. When it won't fit, it now goes
  left of the leftmost face (over the hob's right end, which has stepped back by then). 1–3 people
  are unchanged.
- **Tray layout at 3–4 people:** unchanged, and it holds. The hob and tray keep the 72 design px gap (about
  55 px on the laptop, 35–45 px on phone landscape). The tray shrinks with the hob, and nothing touches.

## 3. Tests
All run after the last change; the second set after merging `origin/main`.
- `python3 build/test_cook.py --lab --stations chai-tray,pour,boil,passme --viewport laptop`: **PASS**
  (31 screenshots, 351 s); `--viewport phone-landscape`: **PASS** (31 screenshots, 144 s).
- **After merging `origin/main`** (chaat v3 and the rest): the lab test again, laptop **PASS** (32 shots,
  199 s) and phone landscape **PASS** (32 shots, 190 s); `python3 build/test_cook.py --days 1 --canvas`
  **PASS on all 6 viewports** (flip5-landscape, laptop, laptop-16x10, laptop-1280x800, ipad, ipad-portrait).
- `node --test build/test_shared_*.mjs`: 117/117. `node build/check_onboard.mjs`: ok.
  `python3 build/check_vessel_meta.py`: ok, 93 checks, including the new chai `panTop` against the v3 pan.
- The shot matrix (20 runs: laptop and phone landscape × levels 1–4 and 4 people, each once with mistakes and
  once clean) played through with **no console errors**; the clean runs scored boil 100% on almost every pan;
  the two 35% scores are the shoot bot's own tap timing under load (it waits on the gauge from outside the page).
- C5: 600 orders per level generated and read (§2); C2: the bottle's hop measured in the running game (§2).

## 4. Shots with their flaws
`build/reports/chai-v3/<viewport>-l<level>[-4cups][-right]-<state>.png`, laptop (1366×768) and phone
landscape (844×390), levels 1–4 (1, 2, 3, 3 people) and `-l4-4cups` (4 people, Isa joining). The first run
of each goes wrong on purpose (salt in the last pan; the first milky pan left on the flame till it foams),
so its `taste-wrong` shows the frown. `-right-*` is a clean second run: `taste-right`, `serving`, `end`.
States a run doesn't reach are missing because that order didn't have them (orders are random):
- `tea` (a pan with no milk) at levels 1 and 4;
- `milky` / `spiced` / `foam` wherever a milky pan was ordered (not level 1 laptop / phone: their order
  was *dudh na*);
- `spiced` wherever milk and an extra met.

**Flaws first:**
- **The glasses are always milky.** The tray's glass pictures are v2's (`glass-half`, `glass-full`: milky
  chai), so a *kari chai* (no milk) pan pours into a milky glass (`phone-landscape-l1-taste-wrong`,
  `laptop-l4-pan-pour`). It's more noticeable now that the pan shows black tea. It needs a black-tea glass
  pair (art: see §5).
- **No picture for three in-between stages,** so the nearest one shows:
  - black tea with elchi or aadu shows plain black tea (`pan-spiced` is milky chai with spices);
  - milk poured in before the leaves shows milky chai half over the water;
  - leaves in a dry pan show the empty pan.
- **The tipped pan** in the pour is still v2's picture (`pan-pour`). It's a little brighter and cooler than
  the v3 pan and always holds milky chai, even when it's black tea (`laptop-l4-pan-pour`).
- **The pan's fill level doesn't change** (one level per picture): a second splash of water, or the rest
  after a half pour at level 4, looks the same as a full pan.
- **The water shot catches the bottle on its way home** over the pan (`laptop-l1-water`). The pour itself is
  fine; that's the shot's timing.
- **Pre-existing, not changed here:**
  - the pan handles reach the hob's top edge on the rightmost burner (`laptop-l3-*`, `-4cups-*`);
  - the laptop sidebar can't show four people's open cards (the fourth is cut off: `laptop-l4-4cups-pan-pour`);
  - on phone at 4 people the sidebar's bottom buttons are cut off;
  - review faces cover the glasses;
  - under heavy load (four browsers) one run's shelf art missed the station's 5 s load race and showed the
    fallback jugs and bowls (a re-shoot was normal). That's the load race in `station()`, and I left it.
- **A spiced pan loses its pods while it boils:** at the boil it shows `pan-boil-milky` (froth, no pods),
  then settles back to `pan-spiced` when turned down. A boiling-spiced picture would keep them.
- **The focal glow round a knob** is a flat brown disc on the dark hob (`laptop-l2-boiling`: Nana's knob).
  It's the shared glow's canvas halo, pre-existing.

**What's right:**
- every pan sits on its burner's measured centre in all nine pictures (no jump between stages);
- the stages read at a glance: clear water, leaves steeping, amber tea, milky, spiced with pods and ginger,
  a rolling boil, froth up to the rim;
- the bubbles ride on top, and the gauge sits on the rim inside the flames;
- the burner under a pan that's away pouring is unlit;
- the review faces, praise card and end pop-up are unchanged (the card stays in view at 4 people);
- the tray never touches the hob at 3–4 people.

## 5. Open for Zafar
- **Art for the glasses and the tipped pan:** a black-tea `glass-half` / `glass-full`, and a v3-style tipped
  pan (milky and black tea) would make the pour and the tray match the pan. Until then the glass is milky
  whatever was poured.
- **Pictures for the in-between stages** if you want them: black tea with spices, milk in water (milk before
  the leaves), dry leaves in the pan. Or keep the nearest-picture fallback.
- **Fill level:** the pictures have one level. A lower-level set (e.g. after a half pour) is optional.
- **The sentence's join word is still the English placeholder "with"** (Q5: ask Mum). Where it lands now:
  before the first row after the headline that isn't a *na* row or the amount
  (*Muke kari chai khape, dudh na, with hakro khun, adh.*).
- **An extra beats kari / mori in the headline** (the data's rule): a no-milk elchi cup says
  *Muke elchi waari chai khape, dudh na…*, never *kari*. Say if you'd rather it said *kari elchi waari chai*
  (that would need Mum's word order).

## 6. New placeholder words
None. No new Kutchi and no new English lines. (`joinless` is a flag on two existing words, not a word.)
