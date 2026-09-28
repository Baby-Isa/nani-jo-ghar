# Cook UI feedback (Zafar, 28 Sept): the request card, the sidebar, the pantry, the review

Zafar's feedback, with Claude's recommendations. Items marked **(decide)** are waiting on Zafar.

## 1. The request pop-up and its card (every mode)
- **No English instructions on any pop-up** (e.g. "Listen to what Nani needs, then tap each one into the basket"). If a pop-up needs them, it hasn't shown the task clearly enough.
- **Structure:** the headline is the overall request; the items are listed below it in one format. Today the pantry card shows "Muke dudh de." as the headline and lists atto and chai below it, which reads as if milk were a different kind of thing.
- **The headline wording (decide).** Recommendation: short and sharp at level 1 (*Muke chai khape.*), then the polite, longer form from level 2 (*Tu muke chai banai dinda?*). Both are family-recorded. For the pantry, the headline is "bring me these for {dish}", which **Mum needs to record**.
- **The item rows (decide):**
  - **A: tick rows.** A small round slot on the left fills with a mini gold tick when that step closes, and the row warms to gold.
  - **B: chips.** Each item is a shaded chip that fills from grey to gold when done.
  - **C: picture rows.** A small picture of the item, the word, and the tick slot.

  Claude recommends **A, or C where there's room**: it keeps the tick language, and the bullets disappear. Mid-round, rows only go gold or stay neutral (UX §11); what was wrong only shows in the end review.
- **The pop-up shrinks into the card** in the sidebar (as now).

## 2. The recipe (request) card in the sidebar
- Remove the three old badge icons.
- **No scroll bar:** the card grows to fit.
- **Header:** the face on the left, the headline next to it, the speaker on the right. **Drop the name** (the face is enough, and it saves space); show it only when a person is first met.
- The speaker stays on each card, so a child can replay one card rather than everything.
- **Mishkaki with more than one skewer:** a mini card per skewer inside the requester's card, under a headline such as "two skewers". **Show the order as a little skewer**: a stick with the four items threaded left to right and a pointed tip, with no numbers and no arrows. The stick itself shows the order.

## 3. Nani the guide: her own box at the top of the sidebar, in every mode
- She's always there: her face, and the instruction for what to do **now**, in Kutchi. Sometimes it's spoken, sometimes only written.
- **Her colour (decide).** Recommendation: the cream of her kurta, with a band of her red embroidery along the left edge. It's distinct from the plain cream recipe cards, without looking like a danger red.
- **Tap her box to mute or unmute her voice** (remembered for every mode), plus a replay button. The light bulb (translate) moves into her box row, drawn with the new bulb art, which frees the lonely top row.

## 4. The pantry: redo the art and the layout
- **The shelves:** straight on, at eye level, horizontal. Every item is drawn side-on at the same eye level. No angled shelves, and no top-down bowls on side-on shelves.
- **The containers:** clear containers with a label sticker (about a third of the jar) showing the item blown up:
  - small square jars for spices;
  - tall jars for flour, rice and lentils;
  - a milk carton; a clear water bottle; an oil bottle; a yoghurt tub;
  - vegetables in a wooden crate.

  **Meat and chicken (decide):** Claude suggests a **fridge section** of the pantry (a glass-door fridge or a cool shelf) for meat, chicken, milk and yoghurt, with meat in clear lidded tubs or a butcher's paper parcel with the label sticker. No generic Indian metal jugs.
- **The basket becomes a tray** on the counter, with one outlined space per item needed. Items sit in their spaces, so you can see what's still missing.
- **The "next item" highlight:** the ring looks off because it's centred on the item and its label together. Recommendation: a soft glow and a small bounce **of the item itself**, centred on the picture.
- **The backgrounds look low-resolution** next to the characters (kitchen, pantry, and the rest). Serve them at full resolution and quality. If the ChatGPT originals (1536 px) are still soft at laptop 2× resolution, upscale them.

## 5. The tally (top right)
- It's good. When an item is added, the voice says the count and the item: *hakro …*, *ba …* (needs Part 4's one and more-than-one forms).
- A later level, or Nani on mute, stays silent.

## 6. The word review (page 2 of the end-of-round screen)
- **Centred vertically**, not pushed to the top.
- **The card border and shadow the same all the way round.** Better colours: right = gold (the theme); wrong = red (Zafar's "red makes you want to fix it") **(decide)**.
- **The layout:** wrong words on the left, right words on the right. Each side's width is proportional to its count, with a minimum of one column. At most three across per side, stacking into rows.

## 7. Also noted
- The end-of-round screen in Cook still showed the old drawn badges. That's the live site not having rebuilt (GitHub Pages); check Cook after the next build.

## 8. The chai station (Zafar, 28 Sept, evening), with Claude's recommendations
- **Layout:** the hob and the chai tray sit side by side along the top, level top and bottom. The hob is turned to be wider (about 5/8 of the width) and the tray takes about 3/8. Below them runs a clean strip for the ingredients, and **nothing overlaps the hob**.
- **The ingredient row reuses the pantry's front-on containers** (the jar, carton and bottle family from the pantry-v2 art), standing on the counter edge. The child sees the same jars they fetched from the pantry, and liquids read clearly, which a top-down view can't manage. The hob, the pot and the tray stay top-down. There's no need to redo everything at 45°.
- **Liquids in the pot:** new art for the pot's contents: water, milk, light chai, dark chai, and a boiling-bubbles overlay. The level rises as liquid is added, with steam when hot. No more flat blue disc.
- **Pouring:** the jug or carton tilts over the pot (a rotation), a short pour-stream sprite plays, and the level rises. It's simple and convincing; no full liquid simulation is needed.
- **The chai tray:** use the real art that's already filed: `sources/art/chatgpt-batch3/tray-chai-t-v2.png` and the top-down chai glass `vessel-glass-chai-top-t-v1.png`. Each glass has the person's small round face badge on the tray rim beside it, so it's clear whose chai is whose.
- **The hob knobs:** `sheet-hob-parts-t-v1.png` is filed but not used; wire it in.
- **Polish, across the stations:**
  - the same soft shadow under every object;
  - the same glow-and-bounce highlight as the pantry;
  - a small puff or sprinkle when an ingredient goes in;
  - a spoon stir;
  - label pills in one style;
  - items without a word show no empty speaker pill.
- **Art still to request:** pot-content states and a pour stream, the ingredient containers (from the pantry-v2 pack), and any missing chai-glass fill levels.
- **Remove the fill line** from the chai glass and the pot: it's a relic. Nothing fills to a line any more.
- **Ingredients:** stations where you pick from a supply (the hob, chai) use the bottom strip of front-on containers. Stations where the items are part of the scene (the mishkaki tray, rolling) keep them in the scene. The rule is consistency within each station.
- **People behind the counter** use the character art of them leaning on the counter, or with an arm on it (the `char-*-counter` art already made), at least when they're sitting or waiting. No floating cut-out heads.
- **The Done button (every mode): decide** between:
  - (A) the new gold-metal tick art on a round cream button, the same tick as the end-of-round screen; recommended;
  - (B) a brass service bell for Cook ("order's ready!", with a ding), plus A everywhere else;
  - (C) a big gold arrow.
- **The opening game screen** is weak; that's parked until later (Zafar).

## 9. Sidebar v2 (Zafar's review of the first build, 28 Sept evening). Supersedes §1–3 wherever they differ.
Aim: as crisp and premium as the new jar art. Flat, modern, straight, organised. **Nothing wraps onto two lines**: every headline and every item fits one line; shrink the text to fit, with a readable minimum.
- **Cards use the short form only:** *Muke chai khape.* / *Muke mishkaki khape.* The polite long form belongs in Conversations, not the cards.
- **The face is the replay button** on every card, Nani's included: tap the face to hear it again, with a small speaker badge on the face's corner. There's no separate speaker button, which leaves more room for the headline.
- **Nani's box:** a brighter red tint that contrasts with the sidebar panel (e.g. a pale rose background with a deep red embroidery band). Her face = replay; on the right, only the light bulb and the mute button.
- **The sidebar panel:** a different, slightly deeper tone than the cards; straight edges; a crisp thin divider line against the play area. The cards inside are rounded, flat, with a 1 px border and a soft shadow.
- **Items are self-contained pills:** one per item, all the same width, in a straight stack, clearly separate from the card's headline.
  - Done = true metallic gold (a gold gradient, not flat yellow) with the gold tick art.
  - Next (ordered jobs) = a gold outline on a light grey fill.
  - Pending = a plain white pill with a light border.
  - No floating, no bullets, no empty circles.
- **Groups (e.g. several skewers):** the headline gives the summary (e.g. one mixed, two meat, using the recorded *hakri lakri mishkaki* / *ba lakri mishkaki* clips where they exist). Each skewer is a small group box of pills, with alternate groups tinted differently so they're distinct. No label per group.
- **No English in the item pills** (e.g. "green pepper"): if the Kutchi is missing, flag it "to record", list it in the report, and use the nearest recorded word or leave the item out of the level.
- **The Done button (every mode), decided: option A.** The gold-metal tick art (`assets/ui/results/tick-gold.webp`) on a round cream button. It replaces the green tick button.
- **The hands:** one still shows in the skewer station (at the bottom of the board). Remove it.
- **The word review:**
  - true gold (a metallic gradient, like the tick; not yellow) for right, red for wrong;
  - a thin vertical divider between wrong (left) and right (right);
  - both sides' rows **top-aligned** to the same line, not each centred on its own;
  - the cards restyled to match the sidebar pills: flat, modern, crisp.
