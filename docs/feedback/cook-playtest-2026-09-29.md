# Cook play-test, 29 Sept 2026: every point, analysis and the plan

**Source:** Zafar's 31-minute voice note, played on the live site after the overnight v2 run (build 16c3fb1, before the 11:50 chai fixes). Transcript: `docs/archive/feedback-transcripts/cook-playtest-2026-09-29-transcript.md`. Every point below carries its timestamp. The coverage check at the end maps every line of the transcript to an item, so nothing is dropped.

**How to read it:**
- **X** items are shared (they touch every station). The station sections follow them: **P** pantry, **C** chai, **M** maani, **D** daar, **T** chaat, **S** samosa, **K** sekelo.
- Each item says what Zafar said, what's causing it (checked in the code), and what to do.
- ✅ = done already today. 🟢 = Zafar liked it: keep it and copy it elsewhere.
- **Q** items are decisions for Zafar (§10). Nothing is built until they're answered.
- **Art:** every picture needed is in the one ChatGPT page, `docs/archive/art-prompts/chatgpt-art-prompts-cook-v3.md` (§11, step 1).

---

## 1. What Zafar liked (keep these, and copy them)
- 🟢 **The read-along underline** (2:15). Each word underlines as it's spoken ("Muke chai khape"). Make it the standard wherever a line is spoken: the sidebar card, the order pop-up, Nani's box and the person cards (X2).
- 🟢 **The order card and its pop-up** (8:52): "just so nice now… clean and beautiful… moves very smoothly… **the bar we want to set**."
- 🟢 **Chai:** the tea animation with the bubbles (7:31); the flames are "kind of a cool visual" (7:12); "much better though" (8:08).
- 🟢 **Maani:** "the layout's nice" (12:11).
- 🟢 **Daar:** the chopped things wait at the side and you add them in (14:05): "very clever… really, really good."
- 🟢 **Samosa:**
  - it pre-fills the same filling for the next samosa (22:35), and pre-making it makes you think about the numbers (24:10);
  - the oil looks much better (24:10);
  - frying "is quite fun" (25:28);
  - the slotted spoon's lifting animation is good (26:45).
- 🟢 **Sekelo:** the top-down ingredients look good (27:46).
- 🟢 **Pantry:** "looking kind of good" (2:09).

---

## 2. Shared issues (X): these touch every station

### X1. The spoken orders don't make sense (4:04–5:29, 9:01–9:22, 20:10–20:30, 27:25) — the biggest issue
**What Zafar heard:**
- **Chai:** "I want tea and milk. I want tea with two sugars. Ginger with…"
- **Maani:** "Muke maani khape. Ne hakri bajr ji maani." ("and one millet maani")
- **Samosa:** "Muke ba samosa khape. Ne trae marcha." ("and three chillies")

**Why:** each order is stitched together from separate one-line phrases (`data/cook.json` "lines"), one phrase per card row, joined with spaces (`recipes.js` `build()`, `Lang.join`). For example:
- **Chai** comes out as three sentences: "Muke chai khape." + "Ne dudh." + "Muke chai me ba khun khape." + "Aadu waari chai." So *chai* is said three times, and the ginger phrase comes last.
- **Maani and samosa:** every count after the first dish gets the "and" phrase ("Ne …"), whatever it is.
- Any-order rows are shuffled, and "don't" rows are dropped in at random.

**What Zafar wants:** one natural sentence per person, with the kind of dish in the headline and the rest as "with…":
- *Muke aadu waari chai khape* (ginger tea), with *aadu* as the top row, then milk and two sugars.
- *Muke maani khape. Hakri bajr ji maani.* with no *ne*. Even better, one sentence: *Muke hakri bajr ji maani khape.*
- Samosa: "I want two samosas **with** three chillies and X and Y." Start with "with".
- Sekelo: *Muke sekelo khape* (K1).

**Plan:**
- Rebuild the sentence maker as **one sentence per person**, built from a small set of sentence patterns rather than a string of phrases.
- **Blocker: the Kutchi "with".** The only "with" we have is ***waari***, and only as *{x} waari chai* (Mum: *dudh / khun / kesar waari chai*). There is no confirmed way to say "samosa with chillies", and *sathe* is "with a person". **We don't invent Kutchi.** So the patterns need Mum: record 8–10 whole example orders (the list is in Q5). Until then, use the confirmed parts and flag the rest "to record".
- **Rule for every station:** the card's rows and the spoken sentence come from the same data, in the same order (fixes P4 as well).

### X2. 🟢 The read-along underline becomes the standard (2:15)
It already exists in the sidebar card (`ui.js`, the `reading` class). Check that every spoken line uses it: the pop-up, Nani's guide box, and the station's own speech (the chai tray's person lines).

### X3. The speaker icon isn't tappable where it sticks out (5:38)
Tapping a character's face plays their line, but the part of the small speaker icon that sits outside the round face does nothing. **Fix:** the whole speaker icon, plus a margin, is tappable wherever a face-plus-speaker appears: the sidebar cards, the pop-up, Nani's box, and the faces on the hob. Small, shared CSS/JS.

### X4. The face pictures: close-ups that fill the circle, cropped the same (6:05–6:20)
Nani is cropped closer than Nana, and the crops don't match. **Fix:** one head-and-shoulders close-up per person, with the face filling the circle and the eyes at the same height in every one.
- **Option 1:** re-crop the existing character art in code (free, today).
- **Option 2:** a ChatGPT sheet of matching close-ups (prompt A3).

**Recommendation:** do both. Crop now; swap in the ChatGPT close-ups when they arrive.

### X5. The hobs need redrawing, all of them (3:07–3:58, 9:27, 24:31, 25:34)
**What Zafar saw:**
- the silver edge looks "bent, like someone bashed it";
- the corners aren't cut properly, and one side is thinner than the other;
- "all the burners everywhere look terrible."

**Why (confirmed):** the 1-, 2-, 3- and 4-burner hobs were never drawn. `build/cut_chai_v2.py` `compose_hobs()` builds all four from one 2-burner picture: it slices it into tiles, stretches the front strip to make room for the knobs, and pastes the corners back on. That's the dent, the uneven sides and the untidy corners.

**Fix:** a proper hob art set, drawn as one family (prompts H1–H5):
- 1, 2, 3 and 4 burners, all in the same style;
- a **wide single burner** (landscape) for a big karahi (S20);
- an even silver edge and clean corners;
- used by every station: chai, maani, daar and samosa.

**Knobs (3:58, 7:38–8:04):** make them bigger, the same size as the face badges beside them. Zafar was unsure about an on/off symbol. **Recommendation:** no icon. The knob's ring glows warm when it's on (prompt H6: off and on).

### X6. Flames and the heat gauge (7:08–7:20)
- **Flames toned down:** ✅ partly done (11:50 today). The flames now peek just past the pan instead of flaring out, and the gauge moved onto the pan's rim, inside the flames. At three and four pans the flame tips of neighbouring burners still just touch; the new hob art (more space between burners) fixes that.
- **Gauge thicker** so it reads against the flames: still to do (10 px → about 14–16 px, and a darker track).

### X7. Shelf padding: the ingredient band (2:41–3:03, 12:19–12:49)
- The top of the chai water bottle nearly touches the top of the band, and when it bounces (highlighted) it pops out above it.
- Maani's dough containers need more room above them.

**The rule:** the gap from the top of the band to the tops of the items equals the gap from the bottom of the name chips to the bottom of the band. The bounce and glow must stay inside the band.

**Fix:** one shared layout rule in the shelf code (station-lib / kitchen kit): the tallest item sets the top gap, and the bounce height is taken off it.

### X8. One camera angle for ingredients: stop the ¾-angle bowls (17:54–18:56, 20:35–20:50)
Chaat and samosa each generated a new set of ¾-angle bowls of ingredients. That makes three looks side by side:
- the pantry's side-on jars;
- the top-down ingredients (sekelo's, which Zafar likes);
- these ¾-angle bowls.

Zafar: "we just have to decide, is it side-on or not side-on"; for samosa, "use the top-down ones… might not even need to be in bowls, just keep it clean". **This is decision Q2.** My recommendation is there.

### X9. Things inside pots and pans look fake (6:30–7:04, 13:33–14:00, 16:31)
- Chai's liquid in the pan should be semi-photoreal, like the rest of the art.
- Daar: whatever starts in the pan (oil?) looks unrealistic.
- Daar: ginger and the other added things are "just rendered white dots".
- Daar: the ingredients swirling as you stir aren't to the new standard.

**Fix:** pre-rendered contents for each vessel, all the same size and position so they layer:
- chai pan: empty, water, water and leaves, black tea, milky chai, boiling (prompt C1);
- daar pot: oil, oil with spices crackling, with onion, with tomato, the daar itself (prompt D1).

Stirring then turns the whole contents picture, instead of moving dots around.

### X10. Tasting and the review: one way, in every station (8:14–8:47, 15:16–16:09, 19:33–20:05, 30:22–30:42)
**Zafar said four things, and they point to one standard:**
1. **Chai (8:14):** nobody drinks it or says whether they like it. Maybe that belongs in the story mode: they order at the kitchen counter, the food comes back to the counter, and they say thank you, it's good, or it's not.
2. **Daar (15:16):** "the tasting mechanism wasn't good." Maybe every tasting goes back to the scene where they ordered:
   - the food goes on the table;
   - they say well done, or "not quite right" and **show what you got wrong**;
   - you go back and redo it;
   - when it's right, you get the end screen.
3. **Chaat (19:33):** "maybe it's okay, in-screen, without moving to a different screen… it's just the fake tasting." The dish slides over to him and he says yes or no **with a reaction**. Pretending to eat "looks childish."
4. **Sekelo (30:22):** here the review is a small round face (top right), which "also kind of works". But ideally there's **one way across all of them**.

**What exists now:**
- **Chaat, daar, samosa:** the person slides in, leans in to "taste", then a happy or impatient face; a wrong dish repeats the order and comes back empty.
- **Sekelo:** a small round face, and a wrong dish only wiggles.
- **Chai, maani, pantry:** nothing.

**My recommendation (Q1):** one shared "serve" component used by all seven stations:
1. The dish slides to the person, who is shown **big** as in chaat and daar, not as a small circle. There's no pretend eating.
2. **Right:** a happy reaction and a line such as *Shabash!*, then the end screen.
3. **Wrong:** a gentle "not quite" face, and the card marks **the row that was wrong** (the rows already turn red). The dish comes back and you redo only that part where possible, or the whole dish.
4. In **story mode**, the counter scene (the guest thanks you at the kitchen counter) wraps around this later through Conversations; it doesn't replace it.

### X11. First-time help (onboarding) is missing in places (21:41–21:53, 22:18)
**Confirmed:**
- **Samosa** has no help script at all. It even switches off the fry help as it starts, and there's none for folding. That's why "nothing told me how much chundo" and "it just says click tick."
- **Daar:** help covers the chopping only; the tadka and stir get nothing.

**Fix:** every phase of every station gets a first-time coach, and a finished station's help covers every phase. Add a check that fails when a phase has no help script.

### X12. Counting along: where, and why (17:00–17:45, 21:53–22:06)
Zafar: "We should do a review about where we are counting along and where we're not, and why. Are we doing it deliberately?" What each station does today (checked):

| Station | What counts as you go | Spoken? |
|---|---|---|
| Pantry | a tally on the fridge, +1 each pick | the count and the thing, at level ≤2 while the word is new |
| Chai | a tally of sugar spoons (salt and extras silently) | the same |
| Maani | none: the plate's stack is the count (deliberate) | – |
| Sekelo | none: the skewer shows it ("no picture tally", deliberate) | – |
| Chaat | none ("NO TALLY", deliberate) | the chop quantities are only **heard**, never written (T1) |
| Samosa | none: the plate shows it; only the filling rows count up on the card | – |
| Daar | none while chopping; the stir shows a Kutchi number word each lap | every lap |

**Why it's like this:** the calm-UI and "listen, don't copy digits" rules (UX-PRINCIPLES), applied station by station and not always the same way.

**Proposed rule (Q7):**
- **Level 1:** the card row **writes the quantity in Kutchi** (*ba dungri*, *trae khun*; no digits). Counting is heard as you add.
- **Level 2:** written, not spoken.
- **Level 3+:** heard in the order only; remember it.

Every station follows this, with no separate tally counters, except chai's sugar, which is the listening test there.

### X13. Fetch from the pantry first? Which stations (18:56–19:25)
Zafar: "I also wonder if you should get things from the pantry at the start of this game. Why not? … it just reinforces what the items are, and how many." He asked for thoughts: which stations, pros and cons (Q6).
- **For:**
  - it repeats the nouns and counts before cooking;
  - it makes story sense (get things, then cook);
  - the pantry mode is already built.
- **Against:**
  - it adds 30–60 seconds to every order;
  - "consecutive errands never repeat the same main action" (Roadmap), so a pantry trip before every dish becomes a chore;
  - the pantry must stock every station's ingredients (chundo, sev, spices) and art for them.
- **Recommendation:** in **story mode only**, the **first dish of each day** starts with a pantry trip for that dish. Free play (the lab and station select) skips it. It suits chai, daar, chaat and samosa best (pantry ingredients). Maani (dough) and sekelo (prepared bowls) don't need it.

### X14. Bad cut-outs keep getting through (3:25, 24:21, 28:56)
Examples: the hob corners; the karahi's right handle has grey left inside it; the charcoal grill is badly cut.
**Fix:**
- These pieces get new art (H, S3, K3).
- Every new cut goes through VISUAL-QA §2's zoomed check on the cream background.
- Add a script that flags leftover background grey inside handles: pixels of the flat `#808080` background still inside the cut.

### X15. The overnight run went off script (13:04–13:29, 29:02–29:17)
Zafar: "What happened? I left you overnight… you did the feedback nicely, and then… without adult supervision, you just go haywire."
**What actually happened (checked):**
- **Daar:** the swipe-chop game (vegetables thrown up, you slice only the ones Nani names, before the timer runs out) was replaced by "tap a crate, tap the knife". The design doc's "the knife cuts on its own" was read too literally, and nobody asked Zafar.
- **Sekelo:** the "v2" station reused the old art (a column crop of the old grill sheet, the old rack redrawn in code, the old board and skewer). It spent $0.12, and the report called it done.
- In both cases the orchestrator passed it on without looking closely.

**Guardrails from now on:**
1. A build brief may **not** remove or replace a mechanic without Zafar's OK. The report's first section must list every mechanic changed and every piece of old art reused.
2. VISUAL-QA §5 (added today): shoot every state, list flaws before verdicts, and **the builder doesn't review its own shots**.
3. The orchestrator compares each station with Zafar's last feedback before calling it done.

---

## 3. Pantry (P) — 0:00–2:09
- **P1. The voices overlap (0:00).** The counting voice ("hakro dudh") and Nani's "next thing to get" line play on top of each other. **Why:** the count is spoken without waiting for it to finish, and the next hint fires straight away (`ui.js` `UI.count`, `stations.js` `S.step`). **Fix:** one speech queue per station: a line waits for the one before it to finish, and the counting voice goes first.
- **P2. The gold done-outline gets clipped (0:26–1:01).** A fetched row's thin grey outline turns into a thicker gold one, which is cut off at the left and right, at the top of the first row and at the bottom of the last. **Why:** the card's list clips anything that sticks out, and the thicker border has no room. **Fix:** use an inset outline, or give the list a few pixels of padding (the shared order card CSS).
- **P3. "Bring me these" is clipped in the pop-up (1:20).** The end of "these" is cut off. **Fix:** the pop-up headline wraps or shrinks (the same fit-and-wrap as the sidebar headline got today).
- **P4. Nani reads in a different order from the card (1:46–2:04).** She said sugar (top), then milk (bottom), then flour (middle). Order doesn't matter in this game, but she should read top to bottom. **Why:** the spoken list takes the lead row, then shuffles the rest, while the card is drawn in a different order (`order.js:135`). **Fix:** say it in card order everywhere (the X1 rule).

## 4. Chai (C) — 2:12–9:01
- ✅ **Done today (11:50, live):**
  - pans centred on their burners;
  - no flame or glow on a burner whose pan is away pouring;
  - the gauge on the pan's rim, inside the flames;
  - smaller flames;
  - a "boiling" shot in QA;
  - *kari chai* / *mori chai* orders.
- **C1.** 🟢 Underline while speaking (X2).
- **C2.** The water bottle is too close to the top of the band, and pops out above it when it bounces (X7).
- **C3.** The hob art: bent silver edge, bad corners, uneven sides (X5).
- **C4.** The knob is too small: match the face badge, and consider an on/off look (X5).
- **C5. The sentence (4:04–5:29):** see X1. Target: *Muke aadu waari chai khape* with *aadu* as the first row, then *dudh* and *ba khun*. "I want tea with milk, two sugars and aadu" is the English shape.
  - Note: when a cup has an extra (ginger or cardamom), the headline should be the *waari* form (*aadu waari chai*). Today that phrase comes last and repeats *chai*.
  - This fits today's *kari chai* / *mori chai* headline: a cup's headline names its kind of chai.
  - Zafar also said "the play button didn't work" once (4:16). Worth checking the speaker button on the person card (X3).
- **C6.** The speaker icon outside the face circle isn't tappable (X3).
- **C7.** Face close-ups and a consistent crop (X4).
- **C8.** The liquid in the pan should be semi-photoreal: pre-rendered pan states for water, milk and chai (X9, prompt C1).
- **C9.** Tone the flames down (X6). ✅ Partly done.
- **C10.** Make the gauge ("time tracker") thicker so it reads against the flames (X6).
- **C11.** 🟢 Bubbles.
- **C12.** No one reacts after "take": the drinker should say whether they like it (X10). In story mode that's the counter scene.
- **C13.** 🟢 The card pop-up is "the bar".

## 5. Maani (M) — 9:01–12:49
- **M1.** The sentence has a spare "Ne" (X1). Target: *Muke hakri bajr ji maani khape* (one sentence), to confirm with Mum.
- **M2.** The hob needs reworking (X5).
- **M3. The silver bowls of dough look bad (9:37–11:15).** The metal stands out awkwardly, and the piled dough balls don't look real. Zafar's choice: **one picture of a realistic pile of dough balls, no tray. Tap it and one ball flies out** (prompt M1). The alternative, single balls spaced out, was rejected.
- **M4. The rolling board (chakla) and rolling pin (velan) (9:52–10:15):** darker, richer, more expensive-looking wood. The same applies to "the chopping board" in general (one house board, prompts M2 and S2).
- **M5. The cooked maani still puffs up like a poori (11:19–11:26).** Zafar: "I thought we did new artwork for the cooked version." The game shows `maani-cooked-puffed` as the finished state. **Fix:** new cooked states, flat with brown spots and at most a small bubble (prompt M3). Stop using the puffed picture as "done".
- **M6. The turner looks like "weird tweezers" (11:33).** That's the maani v2 chimta art. A decision is needed on the tool (Q15): tongs (chimto) or a flat turner.
- **M7. The flames only peek out at the top and bottom of the tawa, not the sides (11:44–11:57).** **Why:** the one-burner hob is narrower than the tawa, so the sides are covered, and the flame size is set per station. **Fix:** the new hob art (wider single burner), plus the flame ring sized to the tawa (as chai's now is).
- **M8. The tawa looks low-res (12:01–12:11).** The tawa picture is 400 px wide and gets scaled up. **Fix:** regenerate it at high resolution (prompt M4).
- **M9.** Padding above the dough containers, equal to the gap below the chips (X7).

## 6. Daar (D) — 12:54–16:44
- **D1. The chopping game was replaced (12:54–13:29):** "Why did we change the whole game mode? There's no game now." **Fix:** bring back the swipe chop (Fruit-Ninja style), which is still in the code (`mechanics/chop.js`, still live in chaat) as daar's chop phase. Keep the nice bits of v2: the chopped pieces wait at the side (D4).
- **D2. Whatever starts in the pan looks unrealistic (13:33–13:50):** "don't know if it's oil." **Fix:** pre-rendered hot oil in the pot (D1 art).
- **D3. The things added look fake:** ginger in the pan is "just rendered white dots… same for all of them" (13:50–14:00). **Fix:** pre-rendered pot contents per ingredient (X9, D1 art).
- **D4.** 🟢 The chopped things sit at the side, then you add them in (14:05).
- **D5. The finished daar at the side should look photoreal (14:14–14:24),** and sit on a small wooden trivet (heat mat). Prompt D2.
- **D6. The ladle orientation is terrible (14:36–14:40).** It should be much more top-down, with the handle sticking up into the air (foreshortened toward us). Prompt D2.
- **D7. Stirring shows neither how fast nor how many times (14:53–15:06),** and the old speed dial ("speedometer") is gone. **Why:** the standalone stir game had a speed dial (stopped, tortoise, hare, spilling), and daar v2 replaced it with a lap count only. **Fix:** reintroduce both: a speed dial in the kitchen-kit style, plus a clear lap count (the Kutchi number word stays).
- **D8. The tasting wasn't good (15:16):** X10.
- **D9. The chopped ingredients stay ticked into the cooking (16:09–16:22).** They should reset when you get to the pan, because you still have to put them in. **Fix:** at the start of the cooking phase the chopped rows go back to "to do" and tick again as each goes into the pot (the order card state).
- **D10. The ingredients swirl as flat dots when you stir (16:31).** Not to the new standard. **Fix:** stirring turns the pre-rendered contents (X9).
- **D11. The pot isn't straight top-down (16:39).** Nor is the container of chopped ingredients (16:44). **Fix:** new top-down pot and container art (D1, D2), in line with the design system's single top-down viewpoint.

## 7. Chaat (T) — 16:51–20:05
- **T1. Quantities are only heard, never written (16:51–17:45).** When you chop something twice, the card should say *ba dungri* ("two onions"). **Fix:** at level 1 the card row writes the quantity (X12 rule).
- **T2. Terrible visuals (17:54–18:20):** the shelf has redrawn ¾-angle bowls of ingredients. "We have top-down ingredients already rendered, and side-on ones from the pantry. Why have we gone for this?" (X8).
- **T3. The glass bowl looks terrible (18:20–18:36).** Top-down is "the only way you can realistically render it", but then you lose the layers. So **maybe the bowl should be fully side-on**, using the side-on items the way they sit in the pantry jars, "and then maybe just keep everything side-on" (18:36–18:56). Q2 decides; my recommendation for chaat is fully side-on (a new side-on glass bowl plus side-on layer strips, prompt T1).
- **T4. Fetch from the pantry first (18:56–19:25):** X13 / Q6.
- **T5. The tasting (19:33–20:05):** keep it on the same screen, but no pretend eating. The dish slides over, and he says yes or no with a reaction (X10).

## 8. Samosa (S) — 20:10–27:07
- **S1. The sentence (20:10–20:30):** "and three chillies" should be "with three chillies". The order should list **all** the ingredients, "with X and Y" (X1). "With" needs Mum (Q5).
- **S2. The ¾-angle ingredient bowls again (20:35–20:50):** "we have top-down ingredients… could we not just use them? They might not even need to be in bowls, just keep it clean" (X8 / Q2).
- **S3. The base filling isn't named (20:56–21:35).** He didn't list chundo (mince), which isn't a given, because there are veg samosas too.
  - **Rule:** if both samosas are the same, the rows below are what goes in each. If there are two different fillings, show two separate blocks (that logic exists, from the order model).
  - **The fix:** the base (chundo, or bataato for veg) is always a row.
- **S4. No first-time help at all (21:41–21:53):** nothing said how much chundo (X11).
- **S5. No counter as you fill (21:53–22:06):** "which I think is okay", but review where we count and why (X12).
- **S6. The board looks like a blown-up, low-quality image (22:09–22:13).** Same for the rolling board. Use the one house board (prompt S2).
- **S7. "I don't know what to do now, it just says click tick" (22:18)** (X11).
- **S8. The fold pictures are terrible (22:23).**
- **S9.** 🟢 It pre-fills the next samosa with the same filling (22:35). Watch out: when the two samosas are different, it mustn't copy the filling automatically (22:41). Check the second block starts empty.
- **S10. The samosas sit over the plate's rim (22:50–22:58).** Place them on the flat centre.
- **S11. A new fold (23:04–24:10):** don't try to render the filling photorealistically as it's folded. Research how samosas are really folded. **The first fold hides the filling**, and the later steps are pre-rendered pictures, the same every time. See Q3 for the real method (it fits even better).
- **S12.** 🟢 Pre-making the next samosa makes you think about the numbers (24:10).
- **S13.** 🟢 The oil looks much better (24:10).
- **S14. The karahi's right handle has grey inside it: a bad cut-out (24:21)** (X14; new karahi, prompt S3).
- **S15.** The burners (X5).
- **S16. The oil-heating ring is confusing (24:40–25:22).** It looks exactly like the timing ring you stop yourself, so Zafar kept tapping it. It adds nothing. Zafar's alternative was a vertical "ready" bar, but his preference is no timer at all. **Fix:** remove it. The oil is already hot, or it starts sizzling at once; the **sizzle sound** says it's ready. (The same ring is in daar's oil heating: remove it there too, for consistency.)
- **S17.** 🟢 Adding the samosas is fun. **The karahi should be bigger**, especially with several samosas (25:28–25:34).
- **S18. The order was confusing (25:40–26:14):** "two samosas and three chilli": five in total? Only chillies? "It's not really a samosa if it's just got chillies."
  - **Why (confirmed):** the filling tally has no minimum, so the base (chundo) can come out at zero and the order says only "Ne trae marcha" (about 1 in 8 at level 1).
  - **Fix:** every samosa has a base of at least one spoon. Marcha and dhania are extras.
- **S19. The frying area should be bigger:** there's room. Maybe the burner goes landscape, with a bigger karahi (26:14–26:37). The wide single burner (H5), plus the karahi at about 1.5× its size.
- **S20. The slotted spoon (jharo) goes over the samosas when lifting them (26:56–27:25).** It should go underneath. **Fix:** draw the spoon below the samosa as it scoops, then the samosa rides on top.
- **S21. "Oh, so this time there's fire?" (26:45).** Sometimes the fry shows flames and sometimes not. Find out why and make it consistent (flames whenever the knob is on).

## 9. Sekelo (K) — 27:25–30:47
- **K1. The headline should say *Muke sekelo khape* (27:25).** It still says *mishkaki*: the dish word is spelled "mishkaki", and "sekelo" is only its English label. **Fix:** the Kutchi word becomes *sekelo* (still to confirm with Mum, per the 29 Sept note); *mishkaki* stays for the meat cubes.
- **K2. "No updates… all old artwork" (27:33–27:46).** Confirmed: v2 reused the old grill, rack, board and skewer (X15).
- **K3.** 🟢 The top-down ingredients look good (27:46).
- **K4. A vegetable (*boga*) skewer must say what's on it and in what order (27:51–28:32).** If it's all one vegetable, say so, but most should be **mixed**, with the order spelled out. Today "boga" highlighted onion, with tomato next to it: "why would I need tomato?" **Fix:**
  - no bare "boga" skewers;
  - a veg skewer is either a named single vegetable or a mixed list in order, like the meat-mixed ones;
  - most skewers at the higher levels are mixed.
- **K5. Pieces look different in the bowl and on the skewer (28:32–28:49).** Onion and tomato are small dice in the bowls, but big on the skewer. Make them match, **big and chunky** (prompt K4).
- **K6. The charcoal grill is cut out badly (28:56).** New grill (prompt K3).
- **K7. The wooden frame the skewers rest on looks bad, and the skewers look bad (29:02).**
- **K8. The plate:** the skewer's handle should sit off the plate, and the plate should line up with the grill and the rack (29:22–29:41).
- **K9. Zafar's idea (29:47–30:07):** pre-render the rack holding one, two, three and four empty skewers, and the plate holding one to four skewers, then add the pieces in code on top. The skewer and holder look real, and only the pieces are overlaid (prompts K1 and K2). **Recommended.**
- **K10. The review here is a round face icon (30:22–30:42):** one way across all stations (X10).
- **K11.** Zafar didn't try the other levels (30:47). After the fixes, each station needs a pass at levels 2–4 (by Zafar, or a QA pass first).

---

## 10. Decisions for Zafar (answer these before any agent starts)
Answer "yes to all recommendations except …".

- **Q1 Tasting and review:** one shared serve step in all seven stations. The dish slides to the person (big, not a circle), with no pretend eating. Right: a happy reaction, then the end screen. Wrong: "not quite", the wrong row is marked, and you redo it. Story mode's counter "thank you" comes later via Conversations. **Recommend: yes.**
- **Q2 Camera angle for ingredients:**
  - (a) **Top-down everywhere on the stations**: heaps with no bowls, as in sekelo. The pantry stays its own side-on room.
  - (b) **Chaat is the exception**: fully side-on (a side-on glass bowl, and side-on layer strips on the shelf), because the layers are the game.
  - **Recommend a + b.**
- **Q3 The samosa fold:** a real Kutchi/East African samosa is folded from a pastry strip into a **cone pocket first**, then filled, then the flap closes it. That hides the filling naturally, as Zafar wanted.
  - **Proposal:** 1 tap folds the strip into a cone. Spoon the filling into the cone (you see it go into the pocket, then it's hidden). 2 taps fold the flap and seal. All fold stages are fixed pictures (prompt S1).
  - **Recommend: yes** (or: fill on the flat strip, and the first fold covers it).
- **Q4 Daar's chop:** bring back the swipe chop in daar as it was (same levels, decoys and timer), with the chopped pieces then waiting at the side. **Recommend: yes.** Does chaat keep its swipe chop too? **Recommend: yes.**
- **Q5 Kutchi to record with Mum:** the "with" sentence and whole example orders. Zafar, please check or correct these guesses first; Mum then records the right ones:
  1. *Muke aadu waari chai khape, dudh ne ba khun.*
  2. *Muke kari chai khape, ba khun.*
  3. *Muke hakri bajr ji maani khape.*
  4. *Muke hakri maani ne ba bajr ji maani khape.*
  5. "I want two samosas with chundo and three chillies."
  6. "I want two samosas with potato, no onion."
  7. *Muke sekelo khape*: one meat skewer and one mixed.
  8. "Bring me these" for the pantry.
  9. *Muke daar khape, dungri na.*

  How does Mum say "with" for food (*waari / waara*?), and does it change for samosa (plural)?
- **Q6 Pantry first:** story mode only, first dish of each day, for chai, daar, chaat and samosa; free play skips it. **Recommend: yes.**
- **Q7 Counting rule:**
  - Level 1: quantity written on the card row, and counting heard;
  - Level 2: written only;
  - Level 3+: heard in the order only;
  - no tally counters except chai's sugar.

  **Recommend: yes.**
- **Q8 Knobs:** the same size as the face badges; on = a warm glowing ring, no icon. **Recommend: yes.**
- **Q9 Samosa fry:** no oil-heating ring (sizzle means ready, in daar too); a wide burner and a bigger karahi. **Recommend: yes.**
- **Q10 Daar stir:** bring back a speed dial in the kitchen-kit style, plus a lap count. **Recommend: yes.**
- **Q11 Sekelo:**
  - rack and plate as pre-rendered one-to-four-skewer pictures with pieces added in code;
  - no bare "boga" skewers (named single vegetable, or a mixed list in order);
  - mostly mixed at level 3+;
  - chunky pieces.

  **Recommend: yes.**
- **Q12 Faces:** re-crop now in code, and swap in ChatGPT close-ups when they land. **Recommend: yes.**
- **Q13 Pots and pans:** pre-rendered contents (chai, daar) instead of drawn dots. **Recommend: yes.**
- **Q14 Maani dough:** one realistic pile picture, and one ball flies out per tap (Zafar's choice). Where does the pile sit: straight on the shelf band, or on a small wooden board? **Recommend: straight on the band, no tray.**
- **Q15 Maani turner:** what does the family use to flip maani on the tawa: a *chimto* (flat tongs) or a flat turner? The ChatGPT page draws both; you pick.
- **Q16 Order of work:** Cook fixes first, or the clinic in parallel? The doctor visits ~9 Oct. **Recommend:** start the clinic audit (a cheap session, no code) in parallel today, while the Cook fixes run.

### Zafar's answers (29 Sept, ~12:30 UTC) — these override the recommendations above
- **Q1 Review:** **not** the half-body sliding in. The person appears as a **large round face circle over the dish** (the same face art as the badges, scaled to suit each station): a happy face with a thumbs-up feel when it's right, a frowny face when it's wrong. "I don't like bodies floating where you can see the bottom half of them cut off. The circle is cleaner." One way in all seven stations; wrong still marks the wrong row and you redo it.
- **Q2:** **(b) yes**: chaat goes fully side-on. **(a) no**: don't change everything to top-down. "I like how it is in the chai one, side-on. **If I didn't comment on something, leave it.**" So only what Zafar commented on changes: chaat (side-on), samosa's filling bowls (his own ask: the top-down heaps, no bowls, S2), sekelo's chunky pieces (K5). Chai's and daar's jars stay as they are.
- **Q3:** **fill on the flat strip, and the first fold covers the filling** (not the cone). The filling lands on the flat strip as now; the first fold hides it; every later step is a fixed picture.
- **Q4:** bring back the swipe chop, **with the same full review as everything else** (size, layout, design, quality, polish). The chopped pieces can go in bowls, or just sit on the counter at the top right: try it and judge.
- **Q5:** Zafar thinks *sathe* may mean "together", but isn't sure: **ask Mum** for "with" and the example orders. Until then, the with-lines stay placeholders flagged "to record".
- **Q6:** yes, as Zafar put it: in story mode, **the first time each dish is made that day** starts with a pantry trip for that dish (the first chai of the day fetches chai things; a second chai that day doesn't; the first samosa later that day fetches samosa things). Chai, daar, chaat and samosa. Free play skips it.
- **Q7:** yes (level 1 written and counted aloud, level 2 written, level 3+ heard only).
- **Q8, Q9, Q11, Q13:** yes.
- **Q10:** yes, and the speed dial needs its own design review, probably a new design element (art if needed).
- **Q12:** yes, and **three expressions per face**: neutral (a small smile), happy (the food's right), frowny (it's wrong). These are the Q1 review faces too.
- **Q14:** the dough pile sits straight on the shelf band, no tray.
- **Q15:** the family uses a **flat wooden turner** (Zafar's word sounds like *moikyo*; to confirm with Mum). Maybe no tool is needed at all: try it with a flat wooden turner that flips.
- **Q16:** Cook first. Zafar gets the art running, then plays the clinic and gives feedback in the orchestrator chat, and a clinic plan is made the same way.

---

## 11. The plan

**Step 0: today, done or ready.**
- ✅ Chai hob fixes live.
- ✅ This report, the transcript, and the ChatGPT page.
- ✅ VISUAL-QA §5 (hunt for flaws; the builder doesn't review its own shots) and `build/check_vessel_meta.py`.

**Step 1: Zafar (about 20 minutes).**
- Answer Q1–Q16.
- Paste the ChatGPT block into Claude in Chrome. It generates about 24 pictures and uploads them to `sources/art/cook-v3/`. The art runs while the code sessions start.

**Step 2: shared fixes (one session, owns the shared files, about 3 hours).**
Files: `ui.js`, `order-card`, `lang.js`, `recipes.js`, `order.js`, `data/cook.json` lines and recipes, `station-lib.js`, `kitchen-kit.js`, the shelf and card CSS.
- X1 (the sentence maker: one sentence per person, card order equals spoken order; confirmed parts now, flagged placeholders for the rest);
- X2, X3, X4 (crop), X6 (gauge thickness), X7 (shelf padding);
- X10 (one serve component), X11 (help for every phase, plus the check), X12 (counting rule);
- P1–P4;
- the samosa base-filling rule (S18) and K1 (sekelo word), K4 (veg skewer lists), D9 (untick), T1 (quantities).

**Step 3: once the art is uploaded — cut it in and fit the hob.**
One session cuts every sheet with the cut_tick_v2 method and the new grey-leftover check. It also puts the hob family into `Cook.Kit` (H1–H6), with bigger knobs and flame rings sized to each vessel. Then **every station's hob changes at once**.

**Step 4: station sessions (three at once, separate files, about 2–3 hours each).**
- **Daar:** swipe chop back (D1), oil and contents art (D2, D3, D10), trivet bowl (D5), ladle (D6), speed dial and laps (D7), top-down pot and container (D11), no oil ring (S16).
- **Samosa:** cone fold (S11, Q3), top-down fillings with no bowls (S2), house board (S6), plate centre (S10), wide burner and bigger karahi (S19), jharo underneath (S20), no oil ring (S16), flames consistent (S21), help (S4, S7).
- **Sekelo:** rack and plate composites (K9), new grill (K6), chunky pieces (K5), plate position and handle (K8), serve step (K10).

**Then:**
- **Maani:** dough pile (M3), board and velan (M4), flat cooked maani (M5), turner (M6), tawa high-res and flames (M7, M8).
- **Chaat:** side-on bowl and strips (T2, T3).
- **Chai:** pan contents (C8), sentence check (C5).

**Step 5: review, the new way.** A fresh session or the orchestrator shoots every state at levels 1–4 (laptop and phone) and lists flaws against this report item by item. Every item gets ✅ or a note.

**Step 6: Zafar plays it** (all levels this time), and the Cook ideas list is checked before Cook is called finished.

**Kutchi:** Q5's sentences go into the next recording with Mum. Until then, those lines are marked "to record".

---

## 12. Coverage check (every line of the transcript → an item)
0:00 P1 · 0:17–1:06 P2 · 1:06–1:20 P3 · 1:46–2:04 P4 · 2:09 §1 · 2:12–2:25 C1/X2 · 2:34–3:03 C2/X7 · 3:07–3:51 C3/X5 · 3:58 C4/X5 · 4:04–5:29 C5/X1 · 5:38–5:58 C6/X3 · 6:05–6:20 C7/X4 · 6:30–7:04 C8/X9 · 7:08–7:20 C9/C10/X6 · 7:31 C11 · 7:38–8:08 C4/X5 · 8:14–8:47 C12/X10 · 8:52–9:01 C13 · 9:01–9:22 M1/X1 · 9:27 M2/X5 · 9:37–9:52 M3 · 9:52–10:15 M4 · 10:19–11:15 M3 · 11:19–11:26 M5 · 11:33 M6 · 11:44–11:57 M7 · 12:01–12:11 M8 · 12:11 §1 · 12:19–12:49 M9/X7 · 12:54–13:29 D1/X15 · 13:33–13:50 D2 · 13:50–14:00 D3/X9 · 14:05–14:13 D4 · 14:14–14:24 D5 · 14:36–14:40 D6 · 14:53–15:06 D7 · 15:16–16:09 D8/X10 · 16:09–16:22 D9 · 16:31 D10 · 16:39–16:44 D11 · 16:51–17:45 T1/X12 · 17:54–18:20 T2/X8 · 18:20–18:56 T3 · 18:56–19:25 T4/X13 · 19:33–20:05 T5/X10 · 20:10–20:30 S1/X1 · 20:35–20:50 S2/X8 · 20:56–21:35 S3 · 21:41–21:53 S4/X11 · 21:53–22:06 S5/X12 · 22:09–22:13 S6 · 22:18 S7/X11 · 22:23 S8 · 22:35–22:41 S9 · 22:50–22:58 S10 · 23:04–24:10 S11/Q3 · 24:10 S12, S13 · 24:21 S14/X14 · 24:31–24:36 S15/X5 · 24:40–25:22 S16 · 25:28–25:34 S17 · 25:40–26:14 S18 · 26:14–26:37 S19 · 26:45 S21 · 26:45–27:25 S20 · 27:25 K1 · 27:33–27:46 K2/X15 · 27:46 K3 · 27:51–28:32 K4 · 28:32–28:49 K5 · 28:56 K6/X14 · 29:02–29:17 K7/X15 · 29:22–29:41 K8 · 29:47–30:07 K9 · 30:22–30:42 K10/X10 · 30:47 K11.

### Zafar's answers to the v3 station reports (30 Sept, morning: "yes to everything for now")
- **Daar:**
  - Nani may ask for a speed from level 2 (ear star only);
  - slicing a decoy costs the ear star but doesn't ruin the dish;
  - **the chop card hides the numbers from level 3** (Q7, words only);
  - **use the extra pot pictures** (R4 in the overnight art page) so an order without onion shows no onion.
- **Samosa:**
  - **the base filling goes first on the card** (a small `headFirst` option in the shared `order.js`);
  - **two different samosas in one order** (two blocks on the card; the second strip starts empty when it differs);
  - the karahi at 1.39× is fine.
