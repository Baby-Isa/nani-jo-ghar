# Nani jo Ghar: sidebar design spec

**Date:** 23 Sept 2026
**Status:** proposal for Zafar to confirm (open decisions are in section 8). Written to fit the Roadmap's *Layout contract v2*, *Learning design decisions* and *Thin shell spec*, and the Game Design doc's quilt and notebook sections. Where this spec and those docs disagree, those docs win.
**Reference mockup:** a ChatGPT kitchen mockup with a cream panel docked on the right. It shows item cards with a picture, a count ("1/3") and progress dots, magnifier and lightbulb buttons, and four tabs (home, carrot, jug, star).
**Zafar's direction:**
- Keep this style, but with a **plain background (no curly blue ornament)**.
- Keep the **tabs**.
- Keep the **number + dots** progress.
- It must also work for **writing**.

---

## 1. What the sidebar has to do

| Job | Where it lives | Phase |
|---|---|---|
| **Mission tracker:** what to fetch, how many, how many done | Mission tab (default) | MVP (exists; restyle) |
| **Hear a word again** | Play button on every card | MVP (exists) |
| **English, one tap away** | Small "English" link on every card | MVP (exists) |
| **The next step:** "Go to the bazaar →", "Go home →" | Fixed at the bottom of the Mission tab, hidden until usable | MVP (exists) |
| **Leave the errand** (back to the hub, with a one-tap confirm; word progress is kept) | Home tab | MVP (Build Brief v4 thin shell) |
| **Where am I in the errand:** kitchen → bazaar → home | 3-step strip under the mission title | MVP (cheap) |
| **Hint** when stuck | Lightbulb button | MVP (small) |
| **Explore:** tap anything in the scene to hear its Kutchi name, without it counting as an answer | Magnifier button (toggle) | Proposed; see section 8 |
| **Notebook:** every word met, with its picture and recording; dictionary; collection; quest tool; writing practice | Notebook tab | Later (Game Design roadmap step 8). The tab exists now as a plain list |
| **Quilt:** patches earned; tap one to replay an errand | Quilt tab (and the hub wall) | MVP (exists; restyle) |
| **Pocket money** (buys play, e.g. a hint that pauses a timer) | Small purse line at the top of the Mission tab | Later |

The mockup's **jug tab** has no job, so drop it. Its **star tab** also goes: the Game Design doc rules out points and stars, and the quilt is the progress object. So the rail is: 🏠 Home · 📜 Mission · 📖 Notebook · 🧵 Quilt.

---

## 2. What changes from the mockup: no pictures on the cards

The mockup shows a picture on every card. The project rules forbid that. The Roadmap says: "The shopping list shows Kutchi (romanised) plus a play button, never a picture and never English." Its build rule 10 says: "Never show English or pictures where the task is to understand Kutchi." A picture would let the player match pictures instead of recalling the word, which is the whole point.

So the card keeps the mockup's *layout and feel* (cream card, count on the right, dots), but the **left-hand hero is the Kutchi word** (for readers) or **a big play button** (for non-readers, see section 3). Pictures belong in the **Notebook**, where the task is reference rather than recall.

Hints never show a picture or English either. Per the Roadmap, the hint is the **glow in the scene** (after a wrong tap or about 5 seconds), plus replaying the word.

---

## 3. Card anatomy (Mission tab)

The profile's **"Can read"** toggle (set by an adult, Thin shell spec) switches between two layouts. Neither is a difficulty setting; both use the same slot.

**Reader card:**
```
┌───────────────────────────────────────┐
│  2 × santra *                   ▶     │  ← Kutchi word is the largest text
│  English                       ● ○    │  ← small English link; dots
└───────────────────────────────────────┘
```

**Non-reader card** (a 4-year-old understands dots filling in, not numbers):
```
┌───────────────────────────────────────┐
│   ( ▶ )    santra                ● ○  │  ← large play button is the hero,
│                                       │     the word is small, dots stay
└───────────────────────────────────────┘
```

- **Word:** live text, romanised Kutchi, draft `*` straight after it. Never baked into an image.
- **Quantity:** "2 ×" before the word, plus the dots. An item with no count shows no number and no dots (Roadmap sidebar rule).
- **Mockup's "1/2" fraction:** readers can have it alongside the dots if Zafar prefers the look. The dots alone are enough and match "a picture filling in" from the quilt reasoning.
- **Play button:** never clipped (Roadmap).
- **Card states:**
  1. *To do*: plain cream.
  2. *In progress*: some dots filled.
  3. *Done*: soft green wash and a tick stamp in the corner. No strikethrough; it reads badly.
  4. *New word*: a small sparkle badge, first meeting only.
- **Mode label** above the cards: "To buy" in the bazaar, "Into the bowl" at home (exists).
- **Writing, later:** the card itself never asks for typing. Writing practice lives in the Notebook, only from produce stage 3 and only for "Can type" profiles. The card just needs to fit long words on up to two lines.

## 4. Panel anatomy (top to bottom)

1. **Mission header:** a small portrait of Nani (cropped from her art), the errand title, and the 3-step strip (kitchen → bazaar → home) with the current step lit.
2. **Mode label.**
3. **Item cards:** 3 new words per errand to start, up to 5–6 for fast learners (Roadmap). Six compact cards must fit a 375px-tall phone, so the card height must adapt: about 64px, or about 48px when there are more than four cards.
4. **Tool row:** 💡 Hint, and 🔍 Explore if it's approved.
5. **Next-step button:** full width, hidden until usable.
6. **Tab rail** on the panel's outer edge: 🏠 📜 📖 🧵.

## 5. Floating or docked? Docked, but styled to *look* floating

The mockup floats the panel over the scene. That's what broke playtest 1, and Layout contract v2 now says the sidebar is "always its own column beside the game in landscape, never on top of it".

So: **keep it docked, and style it like the mockup.**
- A rounded cream card with a margin around it and a soft shadow, sitting in its own column.
- The column itself is filled with the scene's dominant colour or a blurred copy of the background. That's the Layout contract's letterbox rule: never black bars.
- The panel looks like it floats beside the scene without ever covering it.

**Per screen shape:**
- **Wide phones (19.5:9 and wider):** there's spare width beyond 16:9, so the panel costs the game nothing. This is the main target.
- **16:9 and 16:10 laptops:** the panel takes its column; the game gets thin bars top and bottom, filled per the letterbox rule.
- **Tablets (4:3):** still a column (per the contract), but narrower: compact cards, icon-only tools.
- **Portrait:** slide-out drawer with a close button that never opens by itself (as now).

**Which side:** the mockup puts it on the **right**; the current build has it on the **left**. The docs don't fix a side.
- Recommendation: **right**, because landscape phone thumbs reach the right edge, and it matches the mockup.
- Consequence: when backgrounds are redone, characters stand centre-right rather than at the far right edge.

---

## 6. What's CSS and what's ChatGPT art

The Game Design doc's "hard separation" rule applies: **"No image ever contains a word."** Anything with text, numbers or changing state is HTML/CSS. It stays sharp at any size, can change without regenerating art, and is ready for writing. ChatGPT makes only **icons and small stickers**, as separate transparent PNGs that are swapped in and out.

| Element | Built with |
|---|---|
| Panel background, border, rounded corners, shadow | **CSS**: plain cream, thin indigo border, no ornament |
| Cards, their states, dots, counts, words, English link | **CSS** + live text |
| Tab shapes and the active-tab highlight | **CSS** |
| Letterbox fill behind the panel | **CSS** (scene colour or blurred background) |
| Tab icons: home, mission scroll, notebook, quilt patch | **ChatGPT**, transparent PNG |
| Tool icons: hint bulb, explore magnifier, play/speaker | **ChatGPT**, transparent PNG |
| Stickers: done tick stamp, new-word sparkle | **ChatGPT**, transparent PNG |
| Step strip icons: kitchen pot, bazaar stall, house | **ChatGPT**, transparent PNG |
| Nani mini-portrait | Crop of the existing Nani art |

**Palette.** The Game Design doc wants the interface colours sampled from the finished Kutch artwork (ajrakh indigo, madder red, marigold, whitewash, terracotta). The mockup already fits:

| Use | Colour |
|---|---|
| Panel | cream `#FBF3E2` |
| Card | `#F7EAD0` |
| Card border | `#E6D3AE` |
| Frame and text | ajrakh indigo `#1F3F7A` |
| Filled dots and done | leaf green `#3E9B2F` |
| Hint | marigold `#E7A93A` |
| Next-step button | madder red `#A63B3B` |
| Empty dot | `#E9DCC3` with a `#CDB892` outline |

Re-sample these from the final backgrounds once they exist.

## 7. ChatGPT prompts (copy and paste)

Generate each icon on its own; attach the mockup as the style reference every time.

**Style line (start of every prompt):**
> Match the attached mockup's style exactly: warm hand-painted cartoon style, soft shading, clean dark outline, friendly for young children, Kutch (India) village theme in indigo, madder red, marigold and terracotta. **Transparent background (PNG), no text, no letters, no numbers, no drop shadow on the background.** One object, centred, filling about 80% of a square 512×512 canvas.

Then one per icon:
1. **Home tab:** a small whitewashed village house with a terracotta roof and a wooden door.
2. **Mission tab:** a rolled paper recipe scroll tied with red thread, slightly unrolled.
3. **Notebook tab:** a closed notebook with an indigo-and-madder ajrakh-pattern cover.
4. **Quilt tab:** one square quilt patch with visible running stitches, in marigold, madder and indigo.
5. **Hint:** a glowing yellow light bulb with a few short rays.
6. **Explore:** a brass magnifying glass with a wooden handle.
7. **Play:** a round indigo button with a cream triangle "play" symbol.
8. **Done sticker:** a round green stamp with a white tick, tilted like a rubber stamp.
9. **New-word sticker:** a small four-point golden sparkle.
10. **Step, kitchen:** a clay cooking pot on a small stove.
11. **Step, bazaar:** a market-stall awning with red, green and orange stripes.
12. **Step, home again:** the house from #1 with a woven basket at the door.

**Optional full mockup** (to check the overall look only, not an asset). Allow text for this one:
> Recreate the attached sidebar with a **plain cream background, no blue curly ornament**, a thin ajrakh-indigo border and rounded corners.
> - Place it in its own column on the right, beside (not over) the kitchen scene.
> - Tabs on the outer edge: house, scroll (active), notebook, quilt patch.
> - Top: a small portrait of an older South Asian woman in a red headscarf and glasses, the title "Fruit for the guests", and a 3-step strip (pot → stall → house) with the pot lit.
> - Three cards **with no pictures**. Each has a large romanised word ("2 × santra", "2 × naaspati", "kelo"), a small "English" link, a round play button, and progress dots. The last card is done, with a green tick stamp.
> - Bottom: a light-bulb button, then a wide madder-red button "Go to the bazaar →".

## 8. Open decisions for Zafar

**Already settled by the project docs:** no pictures on the list; romanised Kutchi; English one tap away; no points or stars; docked, never on top of the game; hints are the scene glow and replay; writing only in the Notebook.

**Decided by Zafar (23 Sept 2026):**
1. **Side: right.** When the backgrounds are redone, characters stand centre-right.
2. **Counts: dots only**, for readers and non-readers alike. No "1/2" fraction.
3. **Hint button:** first press replays the word slowly; second press makes the right item glow straight away (instead of waiting 5 seconds). Free for now; later it may cost pocket money.

**Still to decide:**
4. **Explore / magnifier.** Press the magnifier, then tap anything in the scene (the pot, the rug, a fruit) to hear its Kutchi name. It never counts as right or wrong. The risk: mid-errand, a player could tap every fruit until they hear "santra", which skips the recall the errand is testing. Options:
   - (a) Leave it out.
   - (b) Explore only outside the shopping and bowl steps.
   - (c) Allow it any time, but if you explore a list item and then pick it, that pick counts as *hinted* (the word doesn't move up a stage). Recommended: it stays honest and still rewards curiosity.
5. **Stars and streaks.** The Game Design doc currently rules them out. Zafar is weighing whether to add them; see the pros and cons in the chat of 23 Sept 2026. If added, a star or "patch detail" slot is needed on the Mission header and the Quilt tab.
