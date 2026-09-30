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
