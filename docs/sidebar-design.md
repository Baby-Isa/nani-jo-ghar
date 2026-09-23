# Nani jo Ghar: sidebar design spec

**Date:** 23 Sept 2026
**Reference mockup:** ChatGPT kitchen mockup with a cream panel docked on the right: item cards showing a picture, a count ("1/3") and progress dots, magnifier and lightbulb buttons, and four tabs (home, carrot, jug, star).
**Decisions from Zafar:**
- Keep this style, but with a **plain background (no curly blue ornament)**.
- Keep the **tabs**.
- Keep the **item + number + dots** way of showing progress.
- It must also work for **writing**.

---

## 1. What the sidebar has to do

| Job | Where it lives | MVP? |
|---|---|---|
| **Mission tracker:** what to fetch, how many, how many done | Mission tab (default) | MVP |
| **Hear a word again** | Speaker button on every card | MVP (exists) |
| **English help** (tap to see the English) | Small "English" link on every card | MVP (exists) |
| **The next step:** "Go to the bazaar →", "Go home →", "Play again" | Fixed at the bottom of the Mission tab | MVP (exists) |
| **Hints** when stuck | Lightbulb button | MVP |
| **Explore:** tap anything in the scene to hear its Kutchi name, without it counting as an answer | Magnifier button (toggle) | MVP (cheap to build, high learning value) |
| **Journal:** every word met, its stage, replay, what Nani said today | Journal tab | MVP (exists as a plain list; needs design) |
| **Rewards:** quilt patches | Quilt / star tab | MVP (exists; needs design) |
| **Home / menu:** map of places, sound on or off, English help level, parent area | Home tab | LATER (sound toggle is MVP) |
| **Writing practice:** trace or write the Kutchi word | Journal tab, per word | LATER, but the cards are designed for it now |
| **Money / wallet** (coins for the bazaar) | Top of the Mission tab, bazaar only | LATER |
| **Where am I in the errand:** kitchen → bazaar → home | Small 3-step strip under the mission title | MVP (cheap) |

---

## 2. The one change to the mockup that matters: pictures on the cards

In the mockup, each card shows a **picture** of the item. That breaks the core learning mechanic. The list is meant to be **Kutchi-only**: the player has to recall what *santra* means to find it in the bazaar. If the card shows an orange, the player just matches pictures and never uses the word.

**Rule:** the **Kutchi word is the hero of every card**. The picture slot exists, but it only fills in:
- when the word is **brand new** (stage 1, the first time it's met);
- when the player **uses a hint** (a hint is recorded, so a hinted pick counts less towards progress);
- after the item is **done** (the picture appears as a reward and confirms the meaning).

This also covers writing: the card has room for the word in large text, and later a second line for another script.

**To decide:** show Kutchi on the cards in **romanised only** (e.g. *santra*), or also add a **Gujarati-script** line underneath? The card should leave room for a second line either way.

---

## 3. Card anatomy (Mission tab)

```
┌───────────────────────────────────────┐
│ [picture slot]  santra *        2/3   │  ← Kutchi word is the largest text
│  (hidden until   English ▸      ● ● ○ │  ← count + dots on the right
│   new/hint/done)             [🔊]     │  ← speaker button
└───────────────────────────────────────┘
```
- **Kutchi word:** the largest text on the card. Live text, never baked into an image. A draft `*` sits right after it.
- **English ▸:** a small link that swaps the word to English while held or tapped.
- **Count "2/3" and dots:** only when a quantity matters. A "no count" item shows a single dot.
- **Speaker button:** replays the word.
- **Card states:**
  1. *To do*: plain cream.
  2. *In progress*: some dots filled.
  3. *Done*: soft green wash, a tick stamp in the corner, picture revealed. No strikethrough; it reads badly.
  4. *Hinted*: a tiny bulb badge.
  5. *New word*: a small sparkle badge.
- The **mode label** above the cards changes by phase: "To buy" in the bazaar, "Into the bowl" at home. That already exists.

## 4. Panel anatomy (top to bottom)

1. **Mission header:** a small portrait of Nani, the errand title ("Fruit for the guests"), and a 3-step strip (kitchen → bazaar → home) with the current step highlighted.
2. **Mode label:** "To buy" or "Into the bowl".
3. **Item cards:** 3–4 per errand. Keep errands to 4 items at most, so the list fits a phone without scrolling.
4. **Tool row:** 🔍 Explore (toggle) and 💡 Hint (shows how many hints are left, e.g. 3 small dots).
5. **Next-step button:** full width; hidden until usable (as now).
6. **Tab rail** on the panel's outer edge: 🏠 Home, 📜 Mission, 📖 Journal, 🧵 Quilt.
   - The mockup's **jug tab has no job**, so drop it.
   - Use the star as the Quilt tab icon, or a patch icon.

## 5. Floating or docked? (answer: docked, drawn to *look* floating)

The mockup shows the panel floating *over* the scene. That looks nice, but floating over the scene is exactly what broke playtest 1: the sidebar covered stall items. A floating panel covers about 22% of the scene on every screen, so every scene would need a dead zone where nothing can be tapped.

**What we have now:** the sidebar is its own column **beside** the game, never on top of it. Keep that, but **style it like the mockup**: a rounded cream card with a margin around it and a soft shadow, sitting in its own column on a dark or wood-coloured strip. It looks floating but never covers anything.

**Per screen shape:**
- **Wide phones (19.5:9 and wider):** there is spare width beyond 16:9, so the docked panel costs the game nothing. This is the main target.
- **16:9 and 16:10 laptops:** the panel takes its column and the game gets thin black bars top and bottom (as now). Acceptable.
- **Tablets (4:3):** the panel collapses to **the tab rail only** (about 64px), with a one-line mission summary ("2/5"). Tapping a tab slides the panel open *over* the scene, and taps on the scene pause while it's open.
- **Portrait:** unchanged (a slide-out drawer, or ask the player to turn the phone).

**Which side:** the mockup has it on the **right**; we currently have it on the **left**. **Recommendation: right side.**
- *For the right:* thumbs on landscape phones reach the right easily, and it matches the mockup.
- *Catch:* both characters currently stand on the right, so the panel sits next to them. Since it's docked it won't cover them. But when the backgrounds are redone, put the characters **centre-right**, not at the far right edge.

---

## 6. How to build it: what's CSS, what's ChatGPT art

**Rule:** anything that holds **text, numbers or changing state** is built in HTML/CSS. It stays sharp at any size, can be translated, can grow for writing, and costs nothing to change. ChatGPT only makes **icons and small decorations**, as separate transparent PNGs that are swapped in and out.

| Element | Built with | Why |
|---|---|---|
| Panel background, border, rounded corners, shadow | **CSS** (plain cream, thin indigo border) | Has to stretch to any screen height; ornament is dropped anyway |
| Cards, their states, dots, count, words | **CSS** + live text | Changing numbers and words; writing later |
| Tab shape (rounded tab with an active state) | **CSS** | Needs to highlight |
| Tab icons: home, mission scroll, journal book, quilt patch/star | **ChatGPT**, transparent PNG | Illustrated look |
| Tool icons: magnifier, lightbulb, speaker | **ChatGPT**, transparent PNG | Illustrated look |
| Badges: done tick stamp, hint bulb badge, new-word sparkle | **ChatGPT**, transparent PNG | Small illustrated stickers |
| Nani mini-portrait for the header | Crop of the existing Nani art | Consistent character |
| Step strip icons: kitchen, bazaar, home | **ChatGPT**, transparent PNG | Illustrated look |
| Item pictures | Existing fruit/veg art | Already have them |

**Palette (taken from the mockup):**

| Use | Colour |
|---|---|
| Panel | cream `#FBF3E2` |
| Card | `#F7EAD0` |
| Card border | `#E6D3AE` |
| Frame and numbers | deep indigo `#1F3F7A` |
| Filled dots and "done" | leaf green `#3E9B2F` |
| Hint | marigold `#E7A93A` |
| Empty dot | `#E9DCC3` with a `#CDB892` outline |

## 7. ChatGPT prompts (copy and paste)

Generate each on its own, so the style stays consistent and backgrounds are transparent. Always attach the mockup image as the style reference.

**Style line (paste at the start of every prompt):**
> Match the attached mockup's style exactly: warm hand-painted cartoon style, soft shading, thick clean dark outline, cheerful and friendly for children, South Asian (Kutchi) village kitchen theme. **Transparent background (PNG), no shadow on the background, no text, no letters, no numbers.** Centred, filling about 80% of a square 512×512 canvas.

Then one line per icon:
1. **Home tab icon:** a small whitewashed village house with an orange roof and a wooden door.
2. **Mission tab icon:** a rolled paper scroll tied with a red thread, slightly unrolled.
3. **Journal tab icon:** a closed notebook with a woven red-and-indigo Kutchi-pattern cover.
4. **Quilt tab icon:** a single square quilt patch with stitched edges, in marigold, red and indigo.
5. **Explore icon:** a brass magnifying glass with a wooden handle.
6. **Hint icon:** a glowing yellow light bulb with a few short light rays.
7. **Speaker icon:** a small brass speaker/horn with three curved sound waves.
8. **Done badge:** a round green stamp with a white tick, slightly tilted like a rubber stamp.
9. **New-word badge:** a small four-point golden sparkle.
10. **Kitchen step icon:** a clay cooking pot on a small stove.
11. **Bazaar step icon:** a market stall awning with red, green and orange stripes.
12. **Home-again step icon:** the same house as #1, with a small basket at the door.

**Optional full mockup (to check the look, not to use as an asset):**
> [style line, but a full UI mockup is allowed here] Recreate the attached sidebar with a **plain cream background, no blue curly ornament**, a thin deep-indigo border and rounded corners.
> - Tabs on the outer edge: house, scroll (active), notebook, quilt patch.
> - Top: a small portrait of an older South Asian woman in a red headscarf and glasses, with the title "Fruit for the guests" and a 3-step strip (pot → stall → house).
> - Three item cards. Each shows a large romanised word ("santra", "naaspati", "kelo"), a small "English" link, a speaker button, a count like "1/2" and progress dots. The first card's picture slot is **empty**; the last card is done, with a green tick stamp and its picture shown.
> - Bottom: a brass magnifier button and a light-bulb button, then a wide red button "Go to the bazaar →".

## 8. Open decisions

1. **Side:** right (recommended, for thumb reach and to match the mockup) or keep the left?
2. **Magnifier:** recommended job is **Explore**, a no-penalty "tap anything to hear its name" mode. Is that what you want it to do?
3. **Script:** romanised only, or romanised plus Gujarati script on the cards?
4. **Pictures on cards:** agree with section 2 (hidden until the word is new, hinted or done)?
5. **Hint ladder:**
   1. Replay the word slowly.
   2. Nani repeats the whole sentence.
   3. The right item in the scene glows.
   4. The picture shows on the card.

   Each rung counts as one hint. How many free hints per errand? Proposal: 3.
