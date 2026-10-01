# Clinic play-test, 1 Oct 2026: the heal games, every point, analysis and the plan

**Source:** Zafar's two voice notes from playing the nine v2 heal games "in the pipeline" (`lab/clinic-core.html` → heal rows, levels 1 and 3). Transcripts (Whisper drafts; Kutchi spellings are guesses):
- `docs/feedback/clinic-playtest-2026-10-01-transcript-part1.md` (30 min: scrape, knee, ear, tooth, drinks);
- `…-part2.md` (21 min: fever, boing, eye, foot, and a closing thought).

Times are **1:m:ss** (part 1) and **2:m:ss** (part 2). The coverage check at the end (§14) maps every transcript line to a point.

**What this builds on:** the 29 Sept report (`docs/feedback/clinic-playtest-2026-09-29.md`, its §13–13l) and the fix session that carried it out (`build/reports/clinic-v2-fixes.md`). Where Zafar now says something different from §13, it's marked **⟲ newer** below: the newer word wins once he confirms it in §10.

**Where fixes land** (the code moves to the new framework this week: `docs/architecture/gap-analysis.md` §4 "Revised 1 Oct", `docs/architecture/target-model.md` §4 and §6, decisions 19–25):
- **[R3a]** the shared frame and kit: tokens, text fitting, sizes that scale, the bulb, buttons and card built once;
- **[R3b]** one game host and the mini-game interface (`js/shared/host.js`), the shelf, tally, onboarding and end screen components;
- **[R5]** the clinic moved onto the framework (a move: no mechanic changes, only the deletions and plumbing listed);
- **[Fin]** a clinic finishing session after R5, before the doctor's visit (~9 Oct);
- **[Art]** an art batch (ChatGPT via Claude in Chrome);
- **[Z]** a decision for Zafar first (§10).

Nothing here is built until Zafar answers §10.

---

## 1. What his notes would change (read this first)

### 1a. Mechanics: current → proposed

| Game | Now (checked in code) | Proposed |
|---|---|---|
| **Every heal game: staging** | A stand-in limb or head drawn alone on a blurred, washed-out bed (`js/clinic/heal/scene.js:89, 139–140`; the 29 Sept "limbs on the paper strip" plan) | The patient sits on the bed's edge in the exam room; the camera **zooms in to the sore part and swaps to the close-up at the peak**; the room goes soft behind it (§8A) **⟲ newer** |
| **Every heal game: ticks** | A counted row ticks only when the step closes (the next tool or ✓), never at the count (`cut.js:682–691`; rule E11) | **Level 1:** the row turns gold when the count is reached and the step closes by itself. **Level 2+:** unchanged, so the count isn't given away (§8E) **⟲ newer** |
| **Every heal game: the count** | L1: a number chip squeezed into the card row (`js/clinic/kit.js:392–400`); a digit tally in the far top-right corner at every level (`kit.js:582–595`) | The running count sits **on the tool you're using**: the Kutchi word at L1–2, dots at L3+; the corner chip goes (§8E) **⟲ newer** |
| **Every heal game: ✓** | A ✓ is on screen from the start (inert until a counted step has begun) and is the only way to finish most counted steps (`kit.js:668–680`) | The next action moves you on (the next tool, the syringe's end, the chart); ✓ only where nothing else can, and hidden until usable (rule F22) |
| **Every heal game: instructions** | From L2 the whole list is set and read out at the start (`cut.js:612, 626`; `boing.js:69`; `scene.js:247`) | **One step at a time** at every level: each step's line is said and its row appears when it opens (§8F) |
| **Every heal game: the card** | No headline (`js/clinic/heal/host.js:173`); the goal sits in the doctor's box (`host.js:175`) | The goal is the card's **headline** ("[heal the cut]", to record); the card folds to it with the gold check |
| **Every heal game: sides** | Knee L3 says *jamno*/*dabo* and draws both knees (`knee.js:44–47, 71–92`); foot L3 draws both feet (`foot.js:75, 104–110`); eye says the side from L2 and "cover the other eye" at L3 (`eye.js:52, 74`) | **Sides are said and tested in the diagnosis only;** the close-up shows the one sore part **⟲ newer** (supersedes §13 "both feet at L3" and §13i) |
| Closed card (L3) and the bulb | The bulb flips English for 2 s at L3 but a closed card stays folded; a peek is a separate tap (3.5 s) and a separate hint, counted by the bulb (`kit.js:537–569`; `js/clinic/screen.js:103–106`) | The bulb opens the closed card for its whole time (one tap, one hint), for longer; **peeks get their own "eye" count and their own end badge** at closed-card levels (§8G) **⟲ newer** |
| **Scrape** | Tap tool, tap scrape; dab N times; plasters in colour order (L3 three two-colour plasters) | A skill element (my three ideas, §8H); at most two things to hold in mind per step at L3 |
| **Knee wrap** | From L2 the lit dot moves on after 1.8 s / 1.1 s whether you tapped or not (`knee.js:23, 151–163`) | One dot lights; it **waits for your tap**; then the next lights. Speed is yours |
| **Ear** | Wax pop-ups arrive on a timer close round the canal (`ear.js:140–162`, radius 20–45 units); the cotton bud is a tap N times | Show from the start that more will come; **taking one out sometimes spawns one or two**; a bigger ear; the cotton bud **wipes the wax off without touching the rest** (drag-erase) |
| **Tooth** | Drill a lone tooth; one round blob of decay at every level (`tooth.js:53–57, 141–146`); fill = hold a blue box to a dashed line (`tooth.js:124–134`) | Drill **in the mouth**; decay jagged and scattered by level; fill with a **big press button**, a **green zone with red either side**, narrower and faster by level |
| **Drinks** | One to three drinks from colours, each with a spoon count from L1 (`taste.js:32–33`); things tapped into a cup appear as emoji (`taste.js:192–196`) | **Pop the sore spots of the colour(s) said** (whack-a-mole, decoys stay), then **one drink** clears the rest; no counts at L1; the pour shown (§8H) **⟲ newer** (replaces the 29 Sept three-drink design) |
| **Fever** | Measure, fix (cloth/fan/blanket N times), the patient flips hot↔cold, re-measure each time (`fever.js:46–47, 139–143`) | **The room version:** live thermometer with a green zone; things round the exam room (window, fans, ice, blanket, hot-water bottle, heater), each a small, medium or big change; the doctor names the thing (§8H) **⟲ newer** |
| **Boing** | Beads from a tool; tapping the syringe takes one out; ✓ starts the countdown (`boing.js:187–226`) | Press the **syringe's glowing end** to start the jab; no surprise take-back; later a **coloured-drop dispenser** feeding the syringe (colours, maybe shapes) |
| **Eye** | Eyes left, small chart right; current chart row a yellow band (`eye.js:110–127`); first-time help presses **haa** even on a wrong row (`eye.js:179`) | **The patient seen looking at the chart, the chart big beside them** (his split screen); chart rows highlight and tick like card rows; after *na* the dropper hovers over the eye; help fixed |
| **Foot** | Gentle curved paths; touching the side only slides it back, unscored (`foot.js:41–53, 301–307`) | **The sole of the foot;** a path with **three square turns** out to the foot's edge; touching the side counts **⟲ newer** (29 Sept: "not a maze") |

### 1b. Art: reused, and what needs replacing
- **Reused as is:** the exam room **CB2b** (`assets/clinic/rooms/bg-clinic-exam-cb2b-v1.webp`) becomes the wide shot *and*, zoomed and blurred, the close-ups' background; the **clinic v2 item art** already cut but never wired (`assets/clinic/items-v2/`: thermometer, desk fan, red blanket, syringe, reflex hammer, bandage roll, tweezers, cotton buds, eye drops, dentist drill, filling paste, toothbrush, honey, lemon, turmeric, milk jug, ginger, teaspoon, tumbler, every plaster colour pair, hot/cold/lukewarm jugs, basin, apple, pen torch, stethoscope, blue cloth); **Nana, Ma and Ali's final sitting poses** (with sit-head, sit-tummy, sit-knee) and their **twelve feeling layers each, including hot, cold, ouch, poorly** (`data/clinic/rough-art.json` → `final`), for the hot/cold/sore states.
- **Retired:** CB6b, the close-up bed (`cb6b-closeup-bed-blur-v1.webp`), as the heal background (kept as a fallback).
- **To replace:** every emoji tool in the heal games; every code-drawn stand-in limb, head, ear, mouth, tongue, eye, foot; the rough patient sprites for girl, boy, old man, old woman, uncle and auntie; the 🩺 badge, the 🧤 on the syringe and the gold half-circle "from the pharmacy" badge (removed, not redrawn).
- **New:** the close-ups (one per body part), state layers, a few new items (ice pack, hot-water bottle, heater, ceiling fan, open window, an eye chart, the filling button, later the drop dispenser). Full list in §12.

## 2. What Zafar liked (keep these)
- 🟢 **The vision:** "you can really see the potential… people would enjoy playing it even if they didn't want to learn Kutchi" (2:20:07–21:15).
- 🟢 **Scrape:** "the instructions are good" (1:2:11); "select it and then tap each time, that's probably fine" (1:2:36); the counting of three (1:3:28); the card "folds up nicely" (1:5:02); level 3 "is tough, I actually kind of like it" (1:7:26); **the three dots on the closed card**, "showing that he's talking" (1:7:26; `css/clinic.css:417`).
- 🟢 **Knee:** "the bandage one is kind of fun" (1:12:49, 1:13:23); "there's a fun game mode" (1:17:09).
- 🟢 **Ear:** "the fact it changes colour is good" (1:18:08); more wax "keeps coming… that's funny… more fun" (1:20:22–20:31, 1:21:41).
- 🟢 **Tooth:** drilling is "kind of funny… the blocky concept is funny" (1:23:04–23:14); "that's kind of fun actually" (1:25:21).
- 🟢 **Drinks:** "the tongue pops were funny" (1:26:48).
- 🟢 **Fever:** "the thermometer's kind of funny" (2:0:14); the hot-cold muddle is "kind of funny actually, unintentionally" (2:1:43).
- 🟢 **Boing:** "the boing is kind of funny", "the plaster is kind of funny" (2:9:46–9:52); showing the needle going in is fine.
- 🟢 **Eye:** wrong → another drop → they read again: "that's kind of clever" (2:16:41); "a very fun game mode… so many items you can put in the eye test" (2:14:59–15:18).
- 🟢 **Foot L3:** "kind of funny actually" (2:18:35).

---

## 3. The scrape (cut), level 1 then level 3 (1:0:00–11:54)

**P1. A stethoscope icon bottom left that does nothing (1:0:00).**
- **Cause:** `scene.js:216` draws a 🩺 disc (`.hs-doc`, `scene.js:97`, `pointer-events:none`) only as the anchor for the doctor's speech bubbles (`scene.js:220`).
- **Fix:** remove it. The doctor speaks from his box in the sidebar, whose face is the replay (rule F11).
- **Lands:** [R5] (a deletion while `scene.js` moves onto the host).

**P2. The background is very blurred and "the arm's just sitting… a limb by itself on a table" (1:0:00–0:26, 1:1:46–1:51).**
- **Cause:** the heal scene paints the pre-blurred CB6b bed and a 22% cream wash over it (`scene.js:89, 139–140`); the scrape draws a flat arm on the paper strip (`cut.js:632–633`). That was the approved 29 Sept placement ("limbs on the paper strip"); the planned zoom from the patient on the bed (`docs/game-design/modes/clinic.md` §D "Zoom") was never built: the host hides the patient figure after 0.9 s when a game doesn't use it (`host.js:307–313`).
- **Fix:** the zoom staging (§8A). **⟲ newer** than the 29 Sept CB6b plan.
- **Lands:** [Z] then [Fin] (the zoom with stand-ins) and [Art] (close-ups).

**P3. His staging idea: the patient on the bed's edge, maybe at 45°, the camera zooms to the knee, foot, arm or head, "secretly changes the image" at the peak, and the rest goes blurry (1:0:32–1:46).** He wasn't sure about 45° ("I'm not sure that's a good idea").
- **Recommendation:** yes to the zoom and the swap; front-on for the wide shot, not 45° (§8A).
- **Lands:** [Z] → [Fin] + [Art].

**P4. Water: tap the jug, tap the scrape. "Maybe a drag is better… give me your opinion" (1:1:53–2:36).**
- **Now:** pick a tool on the shelf, then tap the spot (`scene.js:256–290`, `cut.js:709–737`). He then got it: "you select it and then you tap each time. That's probably fine."
- **Recommendation:** keep tap-then-tap for using a tool; use a drag only where the drag *is* the skill (§8C).
- **Lands:** [Z] (D4).

**P5. Level 1: "we're more likely to lose people because they don't know how to play than because it's too easy" (1:2:40–3:28).** His mum, a good stand-in for a child, gets confused where he gets bored.
- **Agreed**, and it's already rule E6 ("start super simple"). §8D turns it into a concrete level-1 shape.
- **Lands:** [Z] (D13) → [Fin].

**P6. "Maybe that three needs to go somewhere else" (1:3:28–3:44).** See P23.

**P7. The dab row doesn't turn green or tick off after the three dabs; "tick it off when you've done it… across all game modes" (1:3:44–4:55).**
- **Cause:** at L1 the host counts up on the row (`host.js:215–221`), but the row ticks only when the step closes: the ✓ or the next tool (`cut.js:682–691, 709–715`). That's rule E11 / UX §11 ("never the moment the number is reached, so a tick can't give the count away"), agreed 26 Sept.
- **⟲ newer:** he now wants it ticked when done, "at least for level 1… and maybe all the levels".
- **Recommendation:** level 1 ticks gold at the count and the step closes by itself; level 2+ keeps E11, so a non-speaker can't tap until it ticks (non-negotiable 6). §8E.
- **Lands:** [Z] (D5) → [R3b] (the host's counted step) → [Fin].

**P8. The plaster: "you click it and you apply it, then you're done" (1:4:55–5:02).** Works. No action.

**P9. 🟢 "It folds up nicely" (1:5:02).** Keep (the shared card's fold).

**P10. The card never had a description: "heal the cut", then folded "you healed the cut" with a tick (1:5:07–5:33).** Same for the knee ("fix the knee", 1:12:20–12:36), "apply these for all the game modes".
- **Cause:** the host gives the card an empty headline (`host.js:173`) and puts the doctor's goal in his box instead (`host.js:175`).
- **Fix:** the goal becomes the card's headline (a line to record with the doctor, Section G); the folded card shows it with the gold check (one line, not a second "you healed" line to record). The doctor's box shows what he's saying now.
- **Lands:** [R5] (plumbing) + words to the doctor's recording.

**P11. "It's really boring… clicky clicky… give me three suggestions to make it more fun mechanically" (1:5:35–6:52).** Answered in §8H (the scrape).

**P12. "We really need… our own list" of what makes games fun, "a pool of things to draw upon… time pressure, variety", instead of starting from scratch each time (1:6:28–6:52).**
- **Context:** CQ17 (29 Sept, approved) made the clinic's design process into a project skill, `.claude/skills/game-mode-design/`. It hasn't been built (no `.claude/skills/` folder exists).
- **Recommendation:** build it now, with a `references/fun-patterns.md`: a pool of proven mechanics (whack-a-mole, buzz-wire, cleaning reveal, sweet-spot timing, sort-by-colour, rhythm, find-it, combine-to-target, chain reaction…), each with where it fits, the age it suits, how the Kutchi decides it, and which of our games already use it (so consecutive games don't repeat a main action, rule H9).
- **Lands:** [Z] (D17); a small job (mid-tier model, medium effort, ~0.5M tokens).

**P13. 🟢 Level 3: "whoa that is tough, I actually kind of like it"; likes the three dots (1:7:07–7:36).** Keep `css/clinic.css:417`.

**P14. Without the written card "you've got to go simple… how many things can someone remember? Two… I don't get to see it for that long" (1:7:36–8:06).**
- **Cause:** at L3 the card is closed (`host.js:171`) and the scrape puts every step up front (`cut.js:612, 626`): water, a dab count, then three two-colour plasters in order: about eight things to hold. A peek lasts 3.5 s (`js/shared/order-card.js:179`).
- **Fix:** one step at a time (§8F), so he only holds the open step; at L3 no step asks more than two things (e.g. two plasters, or one two-colour plaster).
- **Lands:** [Z] (D8) → [R3b] (the host's step pacing) → [Fin] (the scrape's L3 data).

**P15. L3 played through: the plasters right (1:8:06–8:32, 8:46–8:55).** No action.

**P16. A "half gold semicircle" in the top-right corner of every tool: "I don't know what the icon means" (1:8:32–8:46).**
- **Cause:** it's the "came from the pharmacy" dish badge (`scene.js:111–112, 277–280`), added for §13. Every heal tool now comes from the pharmacy, so it marks nearly everything and explains nothing.
- **Fix:** remove it. If the link to the pharmacy matters, show it once: the tray's items fly onto the shelf as the game opens.
- **Lands:** [R5] (deletion); the fly-in is [Fin], optional.

**P17. "We need to ramp up the difficulty… understand that when we switch to sound only it makes a difference" (1:8:55–9:04).** L2 (written) to L3 (heard only, plus more steps, plus two-colour plasters) is one big jump. §8D sets the ladder: each level adds one thing.
- **Lands:** [Fin] (level data).

**P18. "Show them as much as possible why they got penalised" (1:9:04–9:22).**
- **Cause:** a heal game hands the round only `right` and `total` (`js/clinic/run.js:91–92`) and a word list; which step was wrong, and what the child did, is lost before the end screen.
- **Fix:** each heal game reports its rows (what was asked, what was done, e.g. "3 dabs → 4"), and the end review shows the wrong ones as pictures (the shared review, rule F14). Still only at the end: no mid-round verdicts (E10).
- **Lands:** [R3b] (the results component takes rows) + [R5] (the clinic reports them).

**P19. The bulb: count the hints somewhere, maybe by the "?"; "it changes it to English once it's open… give it like eight seconds" (1:9:22–10:19).**
- **Cause:** at L3 the card is closed. The bulb flips the cards to English for 2 s (`Kit.BULB_MS`, `kit.js:537`), but a folded card shows nothing until it's peeked, which is a second tap, a second hint and a 3.5 s window (`screen.js:103–106`, `order-card.js:179`). So the bulb seems to do nothing, then works only if you also open the card.
- **Fix:** on a closed card the bulb opens it, in English, for the bulb's whole time (one tap, one hint); make the bulb's times data, longer than now (Zafar: 8 s). Rule E25 (5/3/2/1 s) changes.
- **Lands:** [Z] (D11) → [R3a/R3b] (the bulb is built once).

**P20. A new "eye" for looking: at levels where the words are hidden, a looking icon reveals the card; the end screen shows how many times you looked (gold if none, dimming per look); not in the ticks (that's getting words right) and not in the bulb (that's English) (1:10:19–11:54).**
- **Cause of the muddle:** peeks and bulbs add to the same number by the bulb (`screen.js:43, 80, 105`).
- **Recommendation:** yes, his design, shown only at closed-card levels (§8G).
- **Lands:** [Z] (D12) → [R3b] (shared end screen) + [R5].

## 4. Knee, level 1 then level 3 (1:11:54–17:14)

**P21. L1 played: "hammer, hakro; ne poi bandage, char turns" (1:11:54–12:17).** No action.

**P22. "Same point about the counting… same point about the title… these are cross-running points" (1:12:17–12:36).** P7, P10, P23 apply to every heal game.

**P23. The count in the row "squashes up the text… there's a lot of screen on the game itself… maybe next to the icons that you're using" (1:12:36–13:23).**
- **Cause:** the L1 count chip is inserted into the card row (`kit.js:392–400`, `css/clinic.css:356–359`), so the row's words shrink to fit. The digit tally (UX §11's "🧅 3") sits in the play area's top-right corner (`kit.js:582–595`, `css/clinic.css:95–98`), far from where the child is looking; he never mentioned it.
- **Fix:** one count, on the tool in use: a small badge on its shelf slot that counts up as you tap (the Kutchi number word at L1–2, dots at L3+, never the target). The corner chip and the row chip go. §8E.
- **Lands:** [Z] (D6) → [R3b] (the shelf/tally component) → [R5].

**P24. 🟢 "That's kind of fun" (1:13:23–13:35).** Keep.

**P25. L3: "jamno knee… I'm not… do we try to be consistent about left and right?" Maybe sides belong only in the diagnosis ("my left knee"), then the heal game remembers it, doesn't penalise, or shows one knee; the knee "face on or still three-quarters… you can see the knee kicking out" (1:13:35–14:58).** He also referred to "the other game mode where the left and right was complicated" (1:12:36–12:49), the same level.
- **Cause:** at L3 the row says "*Jamno* [knee]: [hammer], …" (`knee.js:44–47`), both knees are drawn and, by §13i, neither glows (`knee.js:71–92`); the wrong knee is logged as a mistake with an "ouch" (`knee.js:186–190`).
- **⟲ newer:** §13i (the word alone says which knee at L3) and §13 (both feet at L3, so "my left foot" is tested).
- **Recommendation:** yes. The diagnosis already teaches and tests the side (D2 L3 "[My left knee]"), with ideas.md #11 (*hi baju / hu baju* first) staying there. The heal close-up shows only the sore knee, side-on so the kick reads. The same goes for the foot (one foot) and the eye (the sore eye; no "cover the other eye"). The brush's *dabo/jamno* are directions, not sides, so they stay.
- **Lands:** [Z] (D10) → [Fin].

**P26. L3 "isn't counting… the five didn't count anywhere… maybe when you're listening it changes it to a number counting on the item, while [not] written out, so you can keep track but you're not just matching the word with the sound" (1:14:58–15:02, 1:15:27–15:51).**
- **Cause:** from L3 the count is only said (`scene.js:392–395`); the card count is L1 only (`host.js:218`). The corner digit chip does count, but out of sight.
- **Fix:** dots on the tool (P23). The child hears "*panj*", sees five dots appear as he taps, and has to know that *panj* is five.
- **Lands:** with P23.

**P27. Tapping the closed card: "the corners change to like a weird gold" (1:15:02–15:27).**
- **Cause (likely; confirm on screen):** a peeked closed card gets a 2 px gold ring as an outer shadow (`css/shared/order-card.css:87`); in the clinic's sidebar it shows mainly at the rounded corners.
- **Fix:** a peeked card looks like an open card: no ring.
- **Lands:** [R3a] (the card, once).

**P28. The bandage "keeps moving like whack-a-mole. I don't think it should let you move like that… once you've clicked one flashing dot, then it shows you the next… so you have to be quick to react; you can't just bust out a sequence" (1:15:54–17:09).**
- **Cause:** from L2 the lit dot moves on by itself after 1.8 s (L2) or 1.1 s (L3) (`knee.js:23, 151–163`).
- **Fix:** no timeout. One dot lights; it waits for the tap; then the next lights somewhere new. The fun is the reaction; the time badge rewards speed. **⟲ newer** than the 29 Sept "flash in a sequence" wording.
- **Lands:** [Fin].

**P29. Whack-a-mole for the stickers: "put the sticker on the part that's bleeding… maybe a bit gory" (1:16:34–16:53).** Yes, too gory (rule H26). §8H offers a non-gory version for the scrape.

**P30. 🟢 "There's a fun game mode though" (1:17:09).** Keep.

## 5. Ear, level 1 then level 3 (1:17:14–22:24)

**P31. "Numbers maybe for level ones a bit much, or for the first time playing the game" (1:17:28–17:42).**
- **Cause:** every level counts the cotton bud (2–4) and the drops (1–4) (`ear.js:23–24`).
- **Fix:** §8D: the first round of any heal game is a taught round with no counts; counts start on the next round. (The ear's L1 already has no size words, §13j.)
- **Lands:** [Z] (D13) → [Fin].

**P32. "You have to drag it; that wasn't clear for me on onboarding" (1:17:42–17:47).**
- **Cause:** the wax help is a tap on the tweezers, then a drag (`ear.js:30–31, 112`), so two different gestures in one demo; and the help runs once per profile per step (`scene.js:319, 382`), so a second play shows nothing.
- **Fix:** (1) the wax is dragged straight out, no tweezers pick first (one gesture); (2) on any step whose move the child hasn't yet managed, the ghost finger shows it again after ~6 s of nothing (a hint after hesitation is allowed, rule E16), not only the first time ever.
- **Lands:** [R3b] (the onboarding kit made general) + [Fin].

**P33. The cotton bud: "a bit boring, just clicking… definitely a skill element… you have to erase the wax without touching the rest of the ear, a bit like the tooth drilling game" (1:17:47–19:21).**
- **Cause:** the bud is a tap N times on the canal (`ear.js:230–239`).
- **Fix:** his design: wax smears on the ear; drag the bud over them to wipe them off; touching the sore pink skin makes the patient wince. The count (if any) becomes "wipe it *trae* times".
- **Lands:** [Fin].

**P34. "Give me five suggestions… be creative… look online" (1:19:26–19:38).** §8H (the ear).

**P35. 🟢 "I can hear again", great (1:19:38–19:44).** Keep the patient's line.

**P36. L3: "*pela nindho* wax… that is a small one, doesn't work" (1:19:44–20:14).**
- **Cause:** `grabAt` checks the big blob first (`ear.js:172`). At L3 the hit areas overlap (each blob's radius + 16 units; the big one reaches 46 units, the centres are 51 apart), so a tap on the small blob's upper side picks up the big one. It's the same bug the knee had in §13i (the first match, not the nearest).
- **Fix:** the nearest blob wins.
- **Lands:** [R5] (a one-line bug fix) or [Fin].

**P37. 🟢 The pop-ups: "oh, now it's showing me more… that's funny" (1:20:14–20:31).** Keep.

**P38. "Show that at the start, not suddenly there's more… one spawns two; take one of those out and the other spawns another two… randomly; sometimes it spawns, sometimes it doesn't" (1:20:31–21:13).**
- **Cause:** after the first two blobs, a separate "pop" step spawns blobs on a timer (`ear.js:52, 140–162`), with no warning.
- **Fix:** from L2 the ear starts visibly full (a few blobs half hidden); each one taken out spawns 0, 1 or 2 more (random, weighted down as the ear empties, with a cap), until clear. **⟲ newer** than §13j's "keep coming for the level's time". No time pressure (rule E29).
- **Lands:** [Fin].

**P39. "Right now it's all a little cramped… if it was bigger that'll be more fun, you've got to move around more" (1:21:14–21:31).**
- **Cause:** the canal is 44×56 units and pop-ups land 20–45 units from it (`ear.js:36, 80, 151`).
- **Fix:** the ear fills the close-up; blobs appear over the whole outer ear.
- **Lands:** [Fin] + [Art] (the ear close-up).

**P40. "The problem with all of these is it's all just following the number of instructions… how many times are we gonna hammer [the numbers] in… there's got to be some other language element… or just fun" (1:21:41–22:24).** §8I gives each heal game its own language strand, so numbers stop being the only Kutchi.

## 6. Tooth, drinks (1:22:24–29:49)

### Tooth
**P41. 🟢 L1: "kind of funny… drill the bad bits, fill it to the line" (1:22:34–22:47).** Keep.

**P42. "The tip of the drill isn't in the same place as the tip of my cursor" (1:22:47–23:01).**
- **Cause:** the drill is the 🪛 emoji drawn as text at the pointer −10, +10 (`tooth.js:121–122, 242–243`); the emoji's tip lands away from the point being tested (`tooth.js:245–246`).
- **Fix:** real drill art (`assets/clinic/items-v2/dentist-drill.webp`) with its pivot on the bur's tip (art pipeline §1 "Pivots"), placed so the tip is the pointer.
- **Lands:** [Fin].

**P43. "With better artwork it'll be better… the tooth should be shown in the mouth… zoom into the mouth… a bit of pinkiness around" (1:23:04–23:21).**
- **Cause:** the drill and fill views swap the mouth for a lone tooth (`tooth.js:141–146`).
- **Fix:** brush, drill and fill all happen in one mouth close-up; the drill view is a tighter zoom on one tooth with gum around it.
- **Lands:** [Art] + [Fin].

**P44. "As it gets more advanced the blobs could be more scattered… more jaggedy, less neatly grouped" (1:23:21–23:31, 1:25:04–25:14).**
- **Cause:** one round blob, the same at every level (`tooth.js:53–57`).
- **Fix:** L1 one blob; L2 two; L3 several small jagged patches spread over the tooth. Level data.
- **Lands:** [Fin].

**P45. The fill: "I've no idea what this visual is… it needs some visual to explain you have to hold… a green zone of the right level, red either side… the sweet spot can get smaller… the fill speeds up… a push button, like the nuclear button, that goes down when you press it… almost like a robotic arm… a lever" (1:23:31–24:36).** Also "no idea what the visuals are for the syringe" (1:25:17).
- **Cause:** a blue box with a 🧪 emoji and a dashed line (`tooth.js:124–134`); the fill speed and tolerance are the same at every level (`tooth.js:26–29`).
- **Fix:** as he designed: a big round button that presses down while held; a filling arm over the tooth; a gauge beside the hole with a green band and red either side; the band narrows and the fill speeds up by level (data). Rule E34 ("clear feedback while an action is under way") is met by the gauge.
- **Lands:** [Fin] + [Art] (button, arm).

**P46. L3 played: "first up, then down… drill the bad bits… kind of fun actually" (1:24:36–25:21).** Keep.

### Drinks (taste)
**P47. "Make me *hakro chamchi* honey and a *limu*… this is where you might need the recipe card thing, ingredients on different lines… and the title" (1:25:21–25:46).**
- **Cause:** each drink is one row with every part in it ("[make] hakro chamchi [honey] ne limu", `taste.js:51, 55`), under an empty headline (`host.js:173`).
- **Fix:** the order model (rule F9): the drink is the item ("[honey and lemon]"), its parts are rows ("*hakro chamchi* [honey]", "*limu*"); the headline is the goal (P10).
- **Lands:** [Fin] (data) after [R3a] (the card).

**P48. "I don't really understand… do I click again on the honey?… oh, I have to click the honey twice to add two honeys" (1:25:46–26:22).**
- **Cause:** spoon counts at every level, to keep a blind guess under 10% at L1 (`taste.js:32–33`); the design sheet put counts at L3 only.
- **Fix:** no counts at L1. The redesign (P50) gets its L1 Kutchi from the colour said, not a count.
- **Lands:** [Fin].

**P49. "It should be like the cooking game where it gets poured in… maybe just a tiny bit of liquid at the top… so you don't have to make loads of visuals" (1:26:22–26:41).**
- **Cause:** a tap drops an emoji above the cup (`taste.js:192–196, 109–114`).
- **Fix:** the kitchen kit's pour (Cook's chai), into a cup whose liquid is one of a few pre-rendered pictures cross-faded (rule D11), not drawn dots. The kitchen kit stays Cook's; the clinic imports it.
- **Lands:** [Fin].

**P50. 🟢 The tongue pops were funny → "maybe that's a whack-a-mole game… pop the tongue blisters with a pin as they pop up, then make the drink… speed it up as the levels get harder" (1:26:41–27:34),** then at L3, refined: "quality over quantity… popping leaves different-coloured residue healed by different drinks, but we can't have that many drinks… what about saying which colours you have to pop… someone decoys… only pop these ones, and the ones you don't pop, you have a cup of tea and it takes those away: a mixture" (1:28:28–29:49).
- **⟲ newer:** replaces the 29 Sept refined design (colours healed by drinks, three drinks at L3).
- **Recommendation:** his final version, with one change: a **cool cotton bud**, not a pin (§8H).
- **Lands:** [Z] (D15e) → [Fin].

**P51. L3: three drinks "too hard, especially without hearing it… that's just a memory game" (1:27:34–28:01).**
- **Cause:** three drinks, each with a count, in order, on a closed card (`taste.js:33`, `host.js:171`).
- **Fix:** the redesign (one drink).

**P52. "The text wraps off… it's unplayable, I can't even see all the text" (1:28:01–28:20).**
- **Cause:** card rows are one line (`.fit`) with `text-overflow: ellipsis` (`css/shared/order-card.css:45`), and a whole drink in one row can't shrink enough. That breaks non-negotiable 9 (no clipped or ellipsised text) and regression row SH-09.
- **Fix:** R3a removes every ellipsis rule (gap analysis §2.4) and adds the 14 px floor; P47 splits the drink into short rows.
- **Lands:** [R3a] + [Fin]. **SH-09 is reopened** (§13).

**P53. "Make the green ones… it's not terrible" (1:28:20–28:28).** No action.

## 7. Part 2 points: fever, boing, eye, foot, closing (2:0:00–21:15)

### Fever
**P54. 🟢 "Take the temperature… put on his forehead… the thermometer's kind of funny" (2:0:00–0:14).** Keep.

**P55. "I don't know why I'm adding the blanket to their face" (2:0:14–0:26).**
- **Cause:** the close-up is a head only, and the blanket is drawn as bands over the chin and mouth (`fever.js:73–80, 221–222`).
- **Fix:** the room version (§8H): the blanket goes over the shoulders of the sitting patient, a state picture (§8B).
- **Lands:** [Fin] + [Art].

**P56. The zoom idea again: "zoom in on their head and upper torso… the blanket over their shoulders or tucked under their arms… artwork for blanket or no blanket" (2:0:26–0:53).** §8A/§8B.

**P57. "Artwork for hot and cold and sore… get them all done now" (2:0:53–1:01).** §8B and §10.

**P58. The click-through muddle: blanket → "too hot now" → "now what? remove the blanket? does anything happen? ice? don't let me give him ice… fan?… I don't know how to click through" (2:1:01–1:43).**
- **Cause:**
  - every hot/cold swap opens a new "take the temperature" step (`fever.js:46–47, 139–143`), and until the thermometer is used again every other tool does nothing (`fever.js:197–198`);
  - the help showing that is first-time only;
  - the blanket stays drawn when the patient says "too hot" (`fever.js:168`);
  - the cool cloth is drawn as an ice cube 🧊 (`fever.js:186`), and the blanket tool is a bed 🛏️ (`fever.js:188`).
- **Fix:** the room version (§8H): the thermometer stays on and reads live, so there's no re-measuring; real item art (the blue cloth and red blanket exist in `items-v2`).
- **Lands:** [Fin].

**P59. A thermometer with a golden or green zone; "you test it the first time and then it dynamically goes up and down" (2:1:47–2:21).** Adopted in §8H.

**P60. Things with different effect sizes; "help me think of one more for each" (2:2:23–3:10).** §8H: the window or ceiling fan to cool, the heater to warm.

**P61. The overshoot combination puzzle with sizes 2, 3, 4 (2:3:12–4:21).** §8H, with the pushback.

**P62. "I have no idea what the educational element of this is… the doctor calls them out… you learn what the items are… conversations teach how to put sentences together… ideally just more vocab; that's why cooking is good" (2:4:21–5:25).** §8I.

**P63. The room: "open the window, close the window, turn on the ceiling fan, the handheld fan, the heater… all round the room… until you find the equilibrium… a hint from the doctor calls out something" (2:5:25–6:07).** §8H fever; recommended (D15f).

**P64. L3: "hot… *jaldi*, do the fan quickly… *hakro*… do that twice, now he's too cold… my idea is so good" (2:6:07–6:30).** No new point.

### Boing
**P65. L1 played: "wipe *ba*… countdown, boing, the plaster" (2:6:30–6:49).** No action.

**P66. "Say one instruction at a time… there's just too many… suggest how we can fix that" (2:6:49–8:13).**
- **Cause:** boing puts all five steps on the card at the start (`boing.js:69`), and `S.begin` reads the whole card out (`scene.js:247`).
- **Fix:** §8F.
- **Lands:** [Z] (D8) → [R3b] (step pacing in the host) → [Fin].

**P67. The beads: "a pick-and-mix dispenser… feeds the syringe… does Kutchi have shapes?… learn shapes and colours… click the pipes, it filters down into the syringe" (2:8:13–9:00).** §8H boing (after the visit). Ask Mum whether there are words for square, circle and triangle.

**P68. "Only click the hands" (2:9:00–9:07).**
- **Cause:** a 🧤 emoji sits on the syringe (`boing.js:87`) and looks tappable.
- **Fix:** remove it; real syringe art (`items-v2/syringe.webp`).
- **Lands:** [R5] (deletion).

**P69. "Just keep taking them out again… where's the boing, how do I count down… clicking everywhere, all on the syringe" (2:9:07–9:32).**
- **Cause:** a tap anywhere on the syringe takes the last bead out (take-back, `boing.js:192–200`), and the countdown only starts after ✓ (`boing.js:219–226`), which he didn't find.
- **Fix:** take-back by tapping the bead itself; the jab starts by pressing the syringe's glowing end.
- **Lands:** [Fin].

**P70. "Oh, I tick it… the tick is just not always that clear" (2:9:32–9:46); at L3 "I take it just not obvious whatsoever… it needs to be near the syringe at the top… highlight the end of the syringe, you press it, it does it… the tick… doesn't fit with a lot of games; shouldn't be used unless necessary" (2:10:21–11:16).** §8E (the ✓) and P69.

**P71. 🟢 "The boing is kind of funny… we can show the pointy bit going in, that's fine" (2:9:46–9:52); 🟢 "the plaster, this is kind of funny" (2:9:52–9:59).** Keep. A cartoon needle going in is allowed (rule H26: comical, not gory).

**P72. "Giving the apple… let's save the apple for… maybe it's fine… just the animation was a bit rubbish… with my idea it will be better" (2:9:59–10:15).**
- **Cause:** the apple is the last step (`boing.js:52, 180–185`), an emoji appearing in a corner.
- **Recommendation:** the apple stays at the send-off only; boing ends on the plaster.
- **Lands:** [Z] (D15g).

### Eye
**P73. L1 played: "drops… *ba*… *tray*… the eye test" (2:11:16–11:55).** No action.

**P74. "It's not quite obvious which eye to put it into" (2:11:55–12:06).**
- **Cause:** at L1 either eye counts (`eye.js:52`), and both eyes are drawn equally pink (`eye.js:105`).
- **Fix:** only the sore eye is red; with D10 that's the one the diagnosis found.
- **Lands:** [Fin].

**P75. "How do I start the eye test? I'll just press the tick" (2:12:06–12:25).**
- **Cause:** ✓ closes the drops step (`eye.js:292–297`).
- **Fix:** §8E: at L1 the step closes at the count; at L2+ the child taps the chart to start.
- **Lands:** [Fin].

**P76. "Tomato… no, it's not tomato, then why is it telling me to press yes?" (2:12:25–12:39).**
- **Cause:** a real bug. The first-time help on the first chart row always has the ghost finger tap **haa** (`eye.js:179`), but 45% of rows are read wrong (`eye.js:40`, `wrongP`). The help gives a wrong answer, and teaches that *haa* always wins (a leak).
- **Fix:** the first row the help is shown on is always read right; or the ghost points at both pills without choosing.
- **Lands:** [R5] (small fix) or [Fin].

**P77. "Then we should give her the eye drops to fix it… this kind of works but not quite… then the game just ended… weird" (2:12:39–12:59).**
- **Cause:** the redrop exists but is shown only once ever (`eye.js:193`); the game ends 1.5 s after the last row with only the patient's "I can see!" (`eye.js:229–238`).
- **Fix:** after *na* the dropper appears and pulses (P83); a short "can see" moment at the end (the patient looks up, happy) before the end screen.
- **Lands:** [Fin].

**P78. "How are they looking at this?… the eyes need to be looking at the board… but you also need to see the board fully… so maybe that doesn't quite work" (2:12:59–13:54).** §8H eye: the over-the-shoulder view.

**P79. The chart rows tick like the sidebar: "they speak each one… if they get it right you get a tick… that row's done, highlighted and gold… next row highlighted in the same style" (2:13:54–14:26).**
- **Cause:** the current chart row gets a yellow band (`eye.js:121`); judged rows don't change; the card has a single "The eye test" row (`eye.js:93`).
- **Fix:** as he said: the chart's rows use the card's "now" and gold "done" styles.
- **Lands:** [Fin].

**P80. "If they say it wrong and you say no, maybe the doctor just puts the eye drop in… or you get the eye drop… how do you switch between the eye drop game and the get-the-words-right game?" (2:14:26–14:59).** The camera does the switch: the close-up for drops, the pulled-back view for the test (§8H). After his L3 play he liked the child doing the redrop (P86).

**P81. 🟢 "Once you figured that one out, this would be a very fun game mode… so many items you can put in the eye test" (2:14:59–15:22).** Keep; the vocabulary grows from Find it and Cook (§8I).

**P82. L3: "drops, right eye, two… that's not correct, so now what?" (2:15:22–15:49).**
- **Cause:** L3 opens with a "cover the other eye" step that has no card row and no line (`eye.js:74, 93`); drop taps are ignored until it's done (`eye.js:281`).
- **Fix:** with D10 the cover step goes (the side lives in the diagnosis). Otherwise it needs its own row and line.
- **Lands:** [Z] (D10) → [Fin].

**P83. "Both looking at me… it needs to be more obviously an eye test board" (2:15:49–16:09).** Art: a proper picture chart (§12) and the over-the-shoulder view.

**P84. "I didn't hear what you said… the play button works" (2:16:09–16:16).** Replay works. No action.

**P85. "If I'm wrong how do I get penalised?" (2:16:16–16:31).** The end review (P18).

**P86. 🟢 "If it's wrong I have to put more drops in the eye, so then he reads it out to you… that's kind of clever… I can see" (2:16:31–16:53).** Keep.

**P87. The split screen, "like two-player on one PlayStation… he's looking at the board on the left, you see the board yourself on the right" (2:16:53–17:16).** §8H eye.

**P88. "It needs to be clear what happens if you get it wrong… not clear you need to give them an extra eye drop… maybe the dropper is just above their eye, you click it, it drops it in" (2:17:16–17:45).**
- **Cause:** the redrop cue is first-time only (`eye.js:193`); the dropper is a 💧 tool on the shelf.
- **Fix:** his design: the dropper appears above the eye after a *na* and pulses; one tap drops.
- **Lands:** [Fin].

### Foot
**P89. L1: "hot water, a plaster on each spot… it's a splinter, how does that work?… do I have to tick?… it doesn't hurt anymore… at level one it's okay; the proof of the pudding will come at higher levels" (2:17:45–18:35).**
- **Cause:** the splinter is pulled by dragging the splinter itself (no tool), shown by a once-only ghost; the soak needs ✓ (`foot.js:333`).
- **Fix:** §8E (L1 closes at the count) and P32 (the help repeats until the move is done).
- **Lands:** [Fin].

**P90. L3: "kind of funny actually… it's not hard enough… I didn't get in trouble for doing it inaccurately" (2:18:35–19:13).**
- **Cause:** touching the side only slides the splinter back and logs an "extra" (`foot.js:301–307`); it's never a scored row. The paths are gentle curves 40 units wide (`foot.js:25, 41–53`).
- **Fix:** §8H foot: square turns, narrower by level, a touch is a scored hand-skill row.
- **Lands:** [Fin].

**P91. "My left foot… *middle* toe" (2:19:13–19:25).** D10 (sides in the diagnosis).

**P92. "See the sole of the foot and pull it out towards the edge… along a path with three squarish turns… don't touch the sides" (2:19:25–20:07).** §8H foot. "We're done, my lord, it's such hard work": no action.

### Closing
**P93. 🟢 "You can really see the potential… I play League of Legends, Far Cry, SimCity, FIFA… mobile games are a bit shallow… this could be up there with a professional studio… people might enjoy it even if they didn't want to learn Kutchi… that would be the ambition… so many game modes" (2:20:07–21:15).** Noted as the bar. No action beyond keeping the quality bar in the reviews.

---

## 8. Bigger ideas: design, recommendation and pushback

### 8A. Staging: the patient on the bed, the zoom to the close-up (P2, P3, P43, P55, P56)

**What he asked for:** the patient sits on the edge of the bed; the camera zooms to the knee, foot, arm or head "enough that that thing becomes the main thing and everything else becomes blurry", and "secretly changes the image once it zooms in" (1:1:24–1:46). It should "seem more like a 3D real game".

**Precedent.** This is exactly how *Toca Doctor* (Toca Boca, ages 3+) works: the patient's sore places are marked on the whole body; tapping one goes into that place's mini-game (cleaning wounds, mazes, popping bugs), with no timers ([Common Sense](https://www.commonsense.org/education/reviews/toca-doctor), [GeekDad](https://geekdad.com/2011/05/practice-treating-ailments-with-toca-doctor/)). Our version adds a continuous zoom, which keeps a young child oriented (the knee they tapped is the knee they're now healing).

**Scene plan (rule D5: who stands where, the camera, the move, the states):**
1. **Wide shot = the diagnosis's own scene.** CB2b exam room, eye-level camera (art bible camera **E**). The patient sits centred on the bed's edge, **facing us**, feet on the step stool, about half the screen high (the 29 Sept overlay check). The doctor stands to the right, three-quarter turned to the patient while he talks, turning front on the child's turn (UX §16). The window is left, the door right, the toys bottom left.
2. **The cue.** The diagnosis ends on the found part (the sore mark glows). The doctor's goal line starts; input is never held for it (E5).
3. **The push-in (~0.7 s, ease-in-out).** The room layer (background, patient, doctor) scales about the part's anchor point, read from scene data (each patient pose stores anchors: knee, foot, forearm, upper arm, ear, mouth, eyes, forehead). It scales until the part fills about 60% of the play area's height, worked out per screen (phones to tablets, decision 24). The doctor slides out of frame as it scales. The background's blur ramps from 0 to ~8 px as it goes (depth of field).
4. **The swap (the last ~0.2 s).** A cross-fade to the close-up picture, registered so the part sits at the same place and size on screen (a "match cut"). Behind it stays the zoomed, blurred CB2b, so the room matches exactly. CB6b is no longer needed.
5. **Close-up states.** The game runs on the close-up. The patient's round face stays in the corner and reacts (the existing round face, with real face art when it exists).
6. **The pull-out.** When the game ends, the reverse: cross-fade back to the wide pose (now the happy state), zoom out, then the send-off.
7. **Reduced motion:** a plain cross-fade (the system "reduce motion" setting).

**Camera angle (pushback on 45°):** keep the wide shot **front-on**:
- it's the pose the diagnosis already uses, and the "their left is on our right" rule rests on it;
- the front sitting poses partly exist (Nana, Ma, Ali);
- a 45° body doubles the poses and makes the sides harder to read.

The **close-ups** take whatever angle reads best, because the swap at the peak hides the change: the knee from three-quarter side (so the kick reads, as he suggested at 1:14:36), the foot's sole (2:19:25), the ear side-on, the mouth, eyes and arm front-on. Children accept a cut at the moment of zoom (Toca Doctor cuts outright).

**What it costs:** the zoom and swap are code (CSS transforms on one layer and a cross-fade), a [Fin] job on R3a's stage coordinates. The art is §12: per patient one front sitting pose (needed for the diagnosis anyway) plus one close-up per body part.

**Scope pushback:** six patient kinds × nine close-ups is ~54 images before states. Recommendation:
- prototype with **one patient (the girl)** and the stand-ins first;
- then draw **limb close-ups per age group** (child, adult), with the sleeve or trouser colour tinted in code to the patient's outfit;
- draw **head close-ups only for the kinds the data gives that ailment** (for example, ear and tooth for children, eyes for the older two). That's a data change to who gets which ailment, which Zafar approves in D1.
- **Scrapes on the knee or forearm only** (two close-ups shared with the knee and boing), rather than five parts (`data/clinic/pipeline.json` ailments.scrape.parts).

### 8B. Hot, cold and sore: the character's states (P55–P57)
"In general we should have artwork for hot and cold and sore… try and get them all done now" (2:0:53–1:01).
- **Method (art pipeline §11, Stage A "one body, swappable face"):** one sitting body per patient; the states are **head-and-shoulders layers on the same registered canvas**: neutral, happy, sore (wince), hot (flushed, a bead of sweat), cold (blue-ish, shivering). Whole-body extras only where the body must change: **cold with the blanket over the shoulders** and **hot fanning themselves**.
- **Reuse:** Nana, Ma and Ali already have hot, cold, ouch, poorly, happy, sad and six more as head-and-shoulders layers (`data/clinic/rough-art.json` final.feelings), and sit, sit-head, sit-tummy, sit-knee poses. They're the style reference and can be patients now.
- **The same pictures serve three places:** the wide shot, the corner face in the close-ups, and the send-off's thought bubble (happy, sad, hot, cold, rule H33).
- No new animations beyond a swap and the existing shake (rule E22).

### 8C. Tap or drag (P4)
- **Research:** for 2–6 year-olds tapping is the easiest, most reliable gesture; dragging is harder but makes children attend more, and in one study children learned more object names by dragging than by tapping, because a tap is "prepotent" and needs little thought ([Frontiers in Psychology, 2017](https://www.frontiersin.org/articles/10.3389/fpsyg.2017.00578/text)).
- **Recommendation:**
  - **picking and using a tool:** tap, then tap (what he settled on);
  - **a drag only where the drag is the skill:** wax out, the cotton bud's wipe, the splinter's path, the drill, the brush, the wash (§8H);
  - within one game the gesture never changes between levels (rule E13).

### 8D. Level 1: "lose them by confusion, not by boredom" (P5, P17, P31)
Zafar's reasoning is right, and good practice agrees: the first level *is* the tutorial; teach one mechanic at a time, by doing, not by text ([Wayline](https://www.wayline.io/blog/tutorials-onboarding-level-design), [GDevelop](https://gdevelop.io/blog/improve-game-tutorials)). The expert's boredom is handled elsewhere: the level ladder, per-word difficulty (rule G23) and per-child settings (decision 22) move a confident player up fast.

**A concrete shape for every heal game:**
1. **The taught round** (the first time a child plays that game): one step at a time; the ghost finger shows each new move; **no counts, no sizes, no sides**; nothing scored. It's exempt from the leak bar, as the scrape's L1 already is (`cut.js:501`, `taught: true`).
2. **Level 1:** a count (written, said, counted aloud: rule E12), and the row ticks gold at the count (§8E).
3. **Level 2:** one new thing (the count written only, or colours, or an order).
4. **Level 3:** heard only (the closed card), but **never more than two things to hold per step** (P14).

Each level adds one thing (rule E6).

### 8E. Ticks, counts and the ✓ (P7, P23, P26, P70, P75, P89)
- **Ticks.** Level 1: the counted row turns gold when the count is reached, and the step closes by itself (no ✓). Level 2+: the row ticks when the step closes (rule E11), so tapping until it ticks can't win. This follows his "at least for level one" and keeps non-negotiable 6. It applies to Cook as well when Cook's turn comes ("across all game modes"); Cook isn't changed without his yes.
- **Counts on the tool.** A small badge on the shelf slot of the tool in use: the Kutchi number word at L1–2 (said at L1), dots at L3+. Never the target. The corner chip (`kit.js:582–595`) and the row chip (`kit.js:392–400`) go. Rules E12 and F25 change to "the count shows on the tool".
- **The ✓.** "The tick is just not always that clear… it doesn't fit with a lot of games, shouldn't be used unless necessary" (2:9:41, 2:11:10):
  - a step moves on by the child's next natural action: the next tool (as now), the syringe's end, the eye chart, the next splinter;
  - ✓ stays only where there's no next action (the last counted step at L2+);
  - it's hidden until usable (rule F22): today it's on screen from the start in every heal game and does nothing until a counted step has begun.

### 8F. One instruction at a time (P14, P66)
"They just can't say it all… say one instruction at a time… I've seen it says wipe and I'm wiping… now it's talking about the third instruction while I'm reading the second… suggest how we can fix that" (2:6:49–8:13).
- **Cause:** from L2 (the scrape), and at every level (boing, knee, ear, tooth, foot, eye), the whole job is set on the card at the start and read out at once (`scene.js:247`, `boing.js:69`, `knee.js:66`, `ear.js:71`, `tooth.js:81`, `foot.js:102`).
- **Recommendation:**
  - in the heal games, at every level, **the card grows one step at a time**: the doctor says the open step's line as it opens, its row appears (with the read-along), finished rows fold to a gold line;
  - parts of one step that aren't ordered appear together ("non-order ones it just gives it to you");
  - the step's line can always be replayed (the face).

  This also cuts the L3 memory load (P14) and fits rule F8 ("only the current need, no script").
- **Cook:** he wasn't sure ("well no, the cooking one, I don't know"). Cook's order card stays as it is unless he says otherwise; the pantry and orders are lists of things to fetch, not a procedure.

### 8G. The bulb and the "eye" (P19, P20)
- **The bulb on a closed card:** one tap opens the card in English for the bulb's time; one hint. The times become data; recommend 8 s at every level to start, tuned later.
- **The eye:** a small eye on the closed card is the way to look (the card's face stays the replay). Each look is counted apart from the bulbs, by the eye, not the bulb. At the end, at closed-card levels only, a fourth badge: an eye, gold if you never looked, dimming per look, with the count.
- **Pushback, mild:** a fourth badge is one more thing for a young child to read. It only shows at the levels where looking is possible, and it reads without words (gold eye, dim eye), so I recommend it. If he'd rather keep three badges, the hints badge can show both icons.
- It's a shared end-screen change, so Cook's closed cards (L4) get it too.

### 8H. The game redesigns
Each keeps the Kutchi deciding the outcome (the leak test) and a hand skill for the fun.

**The scrape: three ideas (he asked for three, 1:6:10):**
1. **Wash it clean (a reveal).** Hold the jug and sweep its stream over the scrape: the dirt washes away where the water goes, like a cleaning game. It's satisfying and needs no grit (he ruled grit out on 29 Sept: "that's the ear's game").
2. **Lay the plaster straight.** Drag each plaster onto the scrape so it covers the red; a corner left showing makes the patient wince; two swipes press the ends down. The colours and order said stay the Kutchi.
3. **Ouch spots (non-gory whack-a-mole).** Little red "ouch" glows flicker on the scrape; dab each with the cloth while it glows, *trae* dabs said. (His sticker idea without the blood, 1:16:42.)

**Recommend 1 + 2:** wash by sweeping, then plasters dragged on in the colours and order said. Idea 3 is close to the drinks' popping, and consecutive games shouldn't repeat a main action (rule H9).

**The knee:** the wrap waits for each tap (P28); one knee, side-on (P25). Otherwise as is: he likes it.

**The ear: five ideas (he asked for five, 1:19:33):**
1. **Wipe the wax off** with the bud without touching the sore skin (his).
2. **Pull one, get two:** removal spawns more, over a bigger ear (his).
3. **The torch first:** the canal is dark; drag the pen torch to light it and find the hidden bits, and the doctor says "*pela wadho*" (the torch is the diagnosis's "look in" tool, so the word is reinforced).
4. **Drops on target:** the head tilts gently; tap when the canal lines up, *ba* drops.
5. **Can you hear me?** At the end the doctor whispers a word the child knows (from Cook: *paani*, *limu*…), and the child taps its picture for the patient. A listening reward that's real Kutchi, and it fits "I can hear again".

**Recommend 1, 2 and 5;** 3 and 4 later.

**The drinks → sore spots, his final version:**
- Spots pop up and down on the tongue in two or three colours. The doctor says which to pop ("[only the red ones]"). The child pops them with a **cool cotton bud**; the others stay. Then the doctor names one drink (turmeric milk, ginger, or honey and lemon), the child pours it (the kitchen kit's pour), stirs, gives it, and the remaining spots fade.
- **Pushback on the pin:** a needle on a child's tongue sits badly with "pretend care, comical, never gory" (rule H26) for 4–7-year-olds and their parents, and real advice is not to pop mouth blisters. The pop is the fun, not the pin: a cool bud that makes the spot pop with a sparkle keeps it.
- **Levels:**
  - taught round: one colour, the drink with no count;
  - L1: one colour plus the drink;
  - L2: two colours, the drink with a count;
  - L3: "not the red ones" (*na*), faster spots, heard only.
- **Words:** the colours (still English placeholders: to record) and the drink words Cook already has.

**Fever → the room (his idea, 2:1:47–6:07):**
- **Scene:** the wide exam room itself (CB2b already has the window). The patient on the bed's edge, a thermometer that stays on and moves live, with a **green "just right" zone**.
- **Things round the room**, each a small, medium or big change:
  - **to cool:** the hand fan (small), the open window or the ceiling fan (medium), the ice pack (big);
  - **to warm:** the blanket over the shoulders (small), the hot-water bottle (medium), the heater (big).

  That's "one more each": the window or ceiling fan to cool, the heater to warm. Closing the window and switching things off undo them.
- **The loop:** the patient says how they feel ("[I'm too hot]"); the doctor names the thing ("[open the window]"); the child finds it and taps it; the reading moves by its size. Overshoot is funny: "[now I'm too cold!]".
- **The Kutchi decides it:** at every level the *named* thing is the answer, not just any cold thing. The thermometer shows hot or cold to anyone, so "hot → any cooler" would pass the leak test without Kutchi. That gives a new language strand: room things and the verbs open, close, switch on, switch off.
- **Pushback on the unit puzzle** (sizes 2, 3, 4 and getting "stuck"): arithmetic overshoot is fun for him, not for a five-year-old, and rule E29 says nothing may leave a child stuck. Every side always has a small step, so you can always nudge back. The free-choice "get the combination right" version is an L3 or free-play twist.
- **Hints:** the doctor's line replays; after hesitation the named thing glows (rule E16).
- It's no longer a close-up game; the blanket and hot/cold states come from §8B.

**Boing:**
- Before the visit: the jab starts by pressing the **syringe's glowing end** (not ✓); the glove goes; taking a bead back is a tap on that bead, not the whole barrel.
- **Later, the dispenser** (2:8:13–9:00): a machine with three or four coloured tubes; tap a tube and a drop rolls down into the syringe, counted. At L3 the colours are said; shapes if Mum has words for them (to ask).
- **Pushback:** draw it as a medicine machine with coloured drops, not a pick-and-mix sweet dispenser: sweets as a reward-shaped thing sit badly with rule I2.
- **The apple:** he began "let's save the apple for…" (2:9:59) and didn't finish. I recommend the apple only at the send-off (where it already is, rule H33), and boing ends on the plaster.

**Eye:**
- **Drops:** a front close-up of the face; the dropper hovers over the sore eye (red); tap to drop, counted on the dropper.
- **The test (his split screen, 2:16:45–17:13):** the camera pulls back to an over-the-shoulder view: the patient's head and shoulders three-quarter from behind on the left, looking right at a proper picture eye chart that fills the right half. The doctor points at the row; the patient reads it out; the child taps *haa* or *na* under the chart. The current row is lit in the card's "now" style; judged rows tick gold (his ask at 2:14:13–14:25).
- **Wrong:** after a *na* the dropper appears over the eye and pulses; one tap, then the patient reads the row again.
- The same view without a dividing line is cheaper than a true split screen and reads as one room. If he wants the split look, it's a frame on the same art.

**Foot:**
- **The sole of the foot.** Each splinter sits in a lighter channel with up to three square turns leading to the edge of the foot. Drag it along the channel; touching the side gets an "ow", it slides back to the last turn, and it's a scored hand-skill mistake.
- **Levels:** L1 straight; L2 one or two turns; L3 three turns and narrower; at L3 the toes are named for order (the Kutchi).
- **⟲ newer** than 29 Sept ("not a maze, too many twists"). The square turns fit a foot better than a maze would.

### 8I. What each game teaches besides numbers (P40, P62)
"There's got to be some other language element… ideally just more vocab" (1:21:54–22:20, 2:4:21–5:25). Give each game its own strand, so counting is one strand of many:

| Game | Strand (all words to confirm with Mum or the doctor) |
|---|---|
| Scrape | colours; first/then (*pela / ne poi*); water, cloth, plaster |
| Knee | body parts round the knee; "kick"; bandage, turn |
| Ear | big/small (*wadho / nindho*); "more"; known nouns in the hearing check |
| Tooth | up/down, *dabo / jamno* as directions; tooth, brush, drill |
| Sore spots | colours; *na* ("not those"); the drink words from Cook |
| Fever room | room things (window, fan, heater, blanket); open/close, on/off; hot/cold/just right (*koso*, *nokoso*?) |
| Boing | colours (shapes if they exist); counting down |
| Eye | household nouns from Find it and Cook; *haa / na* |
| Foot | toes; hot/cold/lukewarm water |

The list feeds the doctor's Section G recording and Mum's next round.

---

## 9. Contradictions with earlier feedback (newest wins once confirmed)

| Earlier (29 Sept §13 and before) | Now (1 Oct) | Decision |
|---|---|---|
| Rows tick when the step closes, never at the count (UX §11, rule E11; agreed 26 Sept) | Tick it off when done, at least at L1 (1:3:44) | D5 |
| L1 count written in the row (G6, §13c) | The count beside the tool (1:13:00) | D6 |
| The tick (✓) confirms a step (UX §11) | "Shouldn't be used unless necessary" (2:11:10) | D7 |
| Limbs lie on CB6b's paper strip; extra blur (CB6b approval, CLN-08) | Zoom from the patient on the bed (1:1:24) | D1 |
| Knee L3 named by the word alone, no glow (§13i); both feet at L3 (§13) | Sides only in the diagnosis; one sore part (1:14:08) | D10 |
| Wax pop-ups keep coming for the level's time (§13j) | Shown from the start; removal spawns more (1:20:31) | D15c |
| Drinks: colours healed by drinks, three at L3 with counts (29 Sept refined) | Pop the colours said, then one drink (1:29:40) | D15e |
| Fever: re-measure and swap each exchange (design H-fever) | Live thermometer, a zone, the room (2:1:47, 2:5:25) | D15f |
| Foot: short gentle paths, "not a maze" (CQ12) | Three square turns to the edge (2:19:44) | D15i |
| Knee L2–3: dots flash in a set order and move on (CQ8 as built) | The next dot waits for the tap (1:16:13) | D15b |
| Bulb 5/3/2/1 s by level (rule E25, decision 1) | Longer, about 8 s (1:10:04) | D11 |
| Three end badges: time, accuracy, hints (rule H5) | A fourth, "looks", at closed-card levels (1:10:35) | D12 |

---

## 10. Decisions for Zafar
Answer "yes to all except …".

- **D1 Staging.** Heal games open with a zoom from the patient on the bed's edge (CB2b, the diagnosis's own scene) into a close-up of the sore part, swapped at the peak; the room blurred behind; CB6b retired. Prototype with one patient (the girl) and stand-ins first; limb close-ups per age group; head close-ups only for the kinds the data gives that ailment; scrapes on the knee or forearm only. **Recommend yes.**
- **D2 Camera.** The wide shot front-on (not 45°); each close-up at the angle that reads best (knee three-quarter side, foot sole, ear side-on, the rest front). **Recommend yes.**
- **D3 States.** Hot, cold, sore, happy and neutral as head-and-shoulders swaps on one body (Stage A), plus two whole-body extras (cold with the blanket, hot fanning). Nana, Ma and Ali's existing feelings are reused. **Recommend yes.**
- **D4 Tap or drag.** Tap a tool, tap where it goes; drag only where the drag is the skill. **Recommend yes.**
- **D5 Ticks.** Level 1: a counted row turns gold at the count and the step closes by itself. Level 2+: the row ticks when the step closes, so the count isn't given away. Cook too, when its turn comes. **Recommend yes.**
- **D6 The count on the tool.** The running count as a badge on the tool in use (the Kutchi word at L1–2, dots from L3); the corner chip and the row chip go. **Recommend yes.**
- **D7 The ✓.** Steps move on by the next action wherever there is one; ✓ only where there isn't, and hidden until usable. **Recommend yes.**
- **D8 One step at a time.** In the heal games, at every level, each step's line and row appear as it opens. Cook unchanged unless you say. **Recommend yes.**
- **D9 Card headlines.** Every heal card's headline is the doctor's goal (to record); the card folds to it with the check. **Recommend yes.**
- **D10 Sides only in the diagnosis.** The heal close-up shows only the sore knee, foot or eye; no side rows, no both feet, no "cover the other eye". Supersedes §13 and §13i. **Recommend yes.**
- **D11 The bulb.** On a closed card one tap opens it in English for the bulb's time (one hint); the times become data, starting at 8 s. **Recommend yes.**
- **D12 The eye.** Looks at a closed card are counted apart from bulbs; a fourth end badge (an eye: gold if none, dimming per look) only at closed-card levels; shared, so Cook's L4 gets it. **Recommend yes.**
- **D13 The taught round.** The first time a child plays a heal game: one step at a time, ghost-finger help for each new move, no counts, sizes or sides, nothing scored, exempt from the leak bar. Counts start on the next round. **Recommend yes.**
- **D14 The end review says what went wrong.** Heal games report each step (asked vs done) and the review pictures the wrong ones. **Recommend yes.**
- **D15 The games:**
  - **a. Scrape:** wash by sweeping the jug's stream (a reveal), then plasters dragged on to cover, in the colours and order said; L3 no more than two things per step. **Recommend yes.**
  - **b. Knee:** the next dot lights only after your tap; no timeouts. **Recommend yes.**
  - **c. Ear:** a bigger ear; full from the start; each removal spawns 0–2 (capped); the bud wipes the wax without touching the skin; the nearest-blob fix; a whispered-word hearing check at the end. **Recommend yes.**
  - **d. Tooth:** everything in the mouth close-up; the drill tip under the finger; decay jagged and scattered by level; the fill with a press button, a green zone with red either side, narrower and faster by level. **Recommend yes.**
  - **e. Drinks → sore spots:** pop the colours said with a **cool cotton bud (not a pin)**, decoys stay; then one named drink, poured and stirred, clears the rest; no counts at L1. **Recommend yes.**
  - **f. Fever → the room:** CB2b with window, fans, ice pack, blanket, hot-water bottle, heater; a live thermometer with a green zone; the doctor names the thing; small, medium and big steps, always a small one each way. The unit-sum puzzle only at L3 or in free play. **Recommend yes.**
  - **g. Boing:** the syringe's glowing end starts the jab; no glove; take back a bead by tapping it; the apple only at the send-off. The coloured-drop dispenser after the visit (drawn as medicine, not sweets; shapes only if Mum has the words). **Recommend yes.**
  - **h. Eye:** drops in a front close-up with the dropper over the sore eye; the test from over the patient's shoulder with a proper picture chart big on the right; chart rows highlight and tick like the card's; after *na* the dropper pulses over the eye; the help-gives-*haa* bug fixed. **Recommend yes.**
  - **i. Foot:** the sole; a channel with up to three square turns to the edge; a touch is a scored "ow" and slides back to the last turn; narrower by level. **Recommend yes.**
- **D16 Remove** the 🩺 badge, the gold half-circle "from the pharmacy" badges and the 🧤 on the syringe. **Recommend yes.**
- **D17 Build the game-mode-design skill now** (CQ17), with a "fun patterns" pool (P12). A small job, mid-tier model, about 0.5M tokens. **Recommend yes.**
- **D18 A language strand per game** (§8I); the word list goes into the doctor's Section G and Mum's next round. **Recommend yes.**
- **D19 What lands before the doctor's ~9 Oct visit.** Recommend three tiers:
  1. **Before the visit, for sure:** D4–D11, D13, D14, D16 and the small bug fixes (ear blob, eye help, drill tip), plus the zoom staging with the stand-ins.
  2. **Before the visit if time allows:** the redesigns he'll enjoy most (sore spots, the fever room, the foot path, the tooth fill, the knee wait, the eye view).
  3. **After the visit:** the art batch beyond one patient, the dispenser, the eye badge in Cook.

  **Recommend yes,** and tell me which heal games the doctor should play, so tier 2 starts with those.

## 11. The plan, with costs
| Step | What | Model, effort | Size |
|---|---|---|---|
| 0 | This report; Zafar answers §10 | — | — |
| 1 | Add to the **R3a** brief: the bulb on closed cards, no peek ring, no ellipsis (SH-09) | top, high (already planned) | +~0.5M on R3a |
| 2 | Add to the **R3b** brief: the counted step (L1 auto-close), the count badge on the tool, ✓ hidden until usable, step pacing, onboarding repeat on hesitation, rows into the review, the eye badge | top, high (already planned) | +~1.5–2M on R3b |
| 3 | **R5** as planned, plus the deletions (D16), card headlines (D9), and the ear and eye bug fixes | top, high (already planned) | +~0.5M on R5 |
| 4 | **Finishing session F1** (after R5): tier 1 in all nine games, the zoom staging with stand-ins, laptop shots | top, high | ~6 h, 6–8M |
| 5 | Zafar plays F1 (laptop, the changed screens) | — | — |
| 6 | **F2:** tier 2 redesigns, in the order of the games the doctor plays | top, high | ~6 h, 6–9M |
| 7 | **Art batch "clinic heal 1"** for one patient (§12), via Claude in Chrome, after F1's staging is approved | Zafar's Chrome run (free) | ~25 images |
| 8 | **F3:** art in, full QA matrix, one push | top, high | ~4–6 h, 4–6M |

**Risk:** R3–R5 finish around 4–5 Oct; F1, F2, the art and F3 need four days. If time is short, F3 waits until after the visit and the doctor plays F2 on stand-ins.

## 12. Art list (art pipeline method; prompts not written yet)
Every state of a thing shares one registered canvas (rule D8); no text in art (D13); a flat base and contact shadow where things touch (D16). The first batch is **one patient: the girl**.

| # | Image | Purpose | Camera | States | Reuse? |
|---|---|---|---|---|---|
| A1 | Girl, sitting on the bed's edge | The wide shot for diagnosis and the zoom | E, front, on CB2b | neutral body | New (rough girl exists; final style from Nana/Ma/Ali sits) |
| A2 | Girl, head and shoulders | State swaps on A1, the corner face, the send-off bubble | E, front, same canvas as A1 | neutral, happy, sore, hot, cold | New; Nana/Ma/Ali's feelings are the model |
| A3 | Girl, cold with the blanket over her shoulders | Fever (cold), the send-off | as A1 | one | New; blanket matches `items-v2/blanket-red` |
| A4 | Girl, hot, fanning herself | Fever (hot) | as A1 | one | New |
| C1 | Knees close-up, sore knee nearest | Knee, scrape on the knee | three-quarter side | neutral; shin kicked out (same canvas) | New |
| C2 | Forearm close-up, sleeve rolled | Scrape on the arm | front | clean; grazed (dirt overlay in code) | New |
| C3 | Upper arm close-up | Boing | front | sleeve up | New |
| C4 | Ear close-up, side of the head | Ear | side | clean (wax as separate sprites) | New |
| C5 | Mouth open, teeth | Tooth (brush, drill, fill) | front | open; one tooth zoom | New |
| C6 | Tongue out | Sore spots | front | plain tongue (spots as sprites) | New |
| C7 | Eyes, upper face | Eye drops | front | both clear; one sore (red) | New |
| C8 | Head and shoulders from behind, three-quarter | The eye test | over the shoulder | looking right | New |
| C9 | Sole of the foot | Foot | from below the sole | plain (channels and splinters drawn in code) | New |
| I1 | Wax blob ×3 sizes; splinter; sore spot ×3 colours | Overlays | as their close-ups | popped / pulled | New (small; containers per rule D21) |
| I2 | Ice pack, hot-water bottle, heater, ceiling fan (on/off), hand fan | Fever room | E, front, on CB2b scale | on / off where relevant | New; the desk fan, thermometer, blanket exist |
| I3 | CB2b window open | Fever room | E (an edit of CB2b) | open (closed = today's) | Edit of approved art |
| I4 | Picture eye chart | Eye test | front | one (pictures as sprites per row) | New |
| I5 | Filling button (up, down) and filling arm | Tooth fill | front | button up/down; arm idle/filling | New |
| I6 | Medicine drop dispenser | Boing (after the visit) | front | idle; dropping | New, later |
| I7 | Every heal tool | Shelf and in-scene | per scene | — | **Reuse `assets/clinic/items-v2/`** (cut, not wired) |

After approval: the other five patients' A1–A4 (about 6 images each; Nana, Ma and Ali's existing sits and feelings cover part), and the head close-ups only where the data gives that kind the ailment.

---

## 13. New regression rows (for the orchestrator to add)
Format as `docs/process/regressions.md`. The source for each is this report with the timestamp. All **open** until built, then **built, not re-played**.

**Shared (Onboarding and help / Order cards / Buttons / End screen):**
| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| SH-38 | A counted row at L1 turns gold the moment the count is reached and the step closes by itself; from L2 it ticks only when the step closes (decision D5) | open | eye: L1 and L2, each counted step · CMP-09 | this report P7, 1:3:44–4:55 |
| SH-39 | The running count sits on the tool in use (Kutchi word L1–2, dots L3+), never squeezed into a card row or in a far corner (D6) | open | eye: 844×390 and 1366×768 · INT-10 | P23, P26, 1:12:49–13:23, 1:15:36–15:51 |
| SH-40 | ✓ hidden until usable; a step moves on by the next action where one exists (D7, rule F22) | open | eye: every heal game start · CMP-02 | P70, P75, P89, 2:9:32–11:16, 2:12:06, 2:18:06 |
| SH-41 | On a closed card the bulb opens it in English for the bulb's whole time, one hint; long enough to read (D11) | open | eye: L3 closed card, bulb · INT-04 | P19, 1:9:37–10:29 |
| SH-42 | Looks at a closed card are counted apart from bulbs, not stacked by the bulb; the eye badge shows only at closed-card levels (D12) | open | eye: L3 end screen | P20, 1:10:19–11:54 |
| SH-43 | A peeked closed card shows no odd gold corners | open | eye: ×2 zoom, peek · CMP-07 | P27, 1:15:02–15:27 |
| SH-44 | The end review shows which step went wrong (asked vs done, pictured) | open | eye: end review after a mistake · CMP-13 | P18, 1:9:04–9:22 |
| SH-45 | One instruction at a time in the heal games: each step's line and row appear as it opens; never the whole job read out up front (D8) | open | ear: boing L1, scrape L3 · TXT-08 | P14, P66, 2:6:49–8:13 |
| SH-46 | A move the child hasn't managed yet (e.g. a drag) is shown again by the ghost finger after a pause, not only the first time ever | open | eye: ear L1, second play | P32, 1:17:42–17:47 |

**Reopen:** **SH-09** (card rows never cut off): failed at drinks L3, "the text wraps off… I can't even see all the text" (1:28:01–28:20). Recheck the clinic's card rows at every level.

**Clinic, heal games:**
| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| CLN-42 | No unexplained icons: no 🩺 badge bottom left, no gold half-circle on tools, no glove on the syringe | open | eye: every heal game | P1, P16, P68, 1:0:00, 1:8:32–8:46, 2:9:00 |
| CLN-43 | A heal game opens by zooming from the patient on the bed to the sore part; never a lone limb on a table; the background soft, not washed out (D1) | open | eye: each heal game's opening, 1366×768 and 844×390 | P2, P3, 1:0:00–1:51, 2:0:26 |
| CLN-44 | Every heal card has a headline (the goal) and folds to it with the check | open | eye: each heal game · CMP-07 | P10, 1:5:07–5:33, 1:12:20 |
| CLN-45 | At L3 no step asks more than two things to remember; the jump from L2 to L3 is one thing | open | eye: scrape L2 and L3 · INT-10 | P14, P17, 1:7:36–9:04 |
| CLN-46 | The scrape and the cotton bud have a skill, not just taps | open | eye: scrape, ear | P11, P33, 1:5:35–6:52, 1:17:47–19:21 |
| CLN-47 | Sides are said and tested only in the diagnosis; the close-up shows the one sore knee, foot or eye (D10) | open | eye: knee, foot, eye L3 | P25, P82, P91, 1:13:35–14:58 |
| CLN-48 | Knee wrap: one dot lit at a time, waiting for the tap; nothing moves on by itself | open | eye: knee L2, L3 | P28, 1:15:54–17:09 |
| CLN-49 | Ear: the blob you aim at is the one you pick up (small next to big) | open | eye: ear L3 · INT-06 | P36, 1:19:51–20:14 |
| CLN-50 | Ear: more wax is shown from the start, spawns as you remove it, over a bigger ear | open | eye: ear L2, L3 | P38, P39, 1:20:31–21:31 |
| CLN-51 | Tooth: the drill's tip is under the finger | open | eye: ×2 zoom, drill | P42, 1:22:47–23:01 |
| CLN-52 | Tooth: drilled inside the mouth; decay jagged and scattered by level | open | eye: tooth L1, L3 | P43, P44, 1:23:04–23:31, 1:25:04 |
| CLN-53 | Tooth fill: a clear button, a green zone with red either side; harder by level | open | eye: tooth fill | P45, 1:23:31–24:36, 1:25:17 |
| CLN-54 | Drinks: the recipe on separate rows under a headline; no counts at L1; the pour shown | open | eye: drinks L1 | P47–P49, 1:25:21–26:41 |
| CLN-55 | Drinks are never a three-recipe memory test; the sore-spot game with one drink (D15e) | open | eye: drinks L3 | P50, P51, 1:26:48–29:49 |
| CLN-56 | Fever: the blanket goes over the shoulders, never the face | open | eye: fever, cold | P55, 2:0:14–0:26 |
| CLN-57 | Fever: always clear what to do next (no tools that silently do nothing); a live thermometer with a zone | open | eye: fever, after each change | P58, P59, 2:1:01–2:21 |
| CLN-58 | Boing: the syringe's end starts the jab; tapping the syringe never takes beads out by surprise | open | eye: boing L1, L3 | P69, P70, 2:9:07–11:16 |
| CLN-59 | Eye: the sore eye is clear | open | eye: eye L1 | P74, 2:11:55–12:06 |
| CLN-60 | Eye: the first-time help never presses *haa* on a row read wrong | open | auto: help path; eye: first play · LNG-02 | P76, 2:12:25–12:39 |
| CLN-61 | Eye: obviously an eye chart; the patient seen looking at it; chart rows highlight and tick like card rows | open | eye: eye test | P78, P79, P83, P87, 2:12:59–14:26, 2:15:49–17:16 |
| CLN-62 | Eye: after *na* the dropper over the eye shows what to do | open | eye: eye, a wrong read | P77, P88, 2:12:39–12:59, 2:17:16–17:45 |
| CLN-63 | Eye L3: no hidden first step without a row or a line | open | eye: eye L3 | P82, 2:15:22–15:49 |
| CLN-64 | Foot: the sole; a path with turns; touching the side is a scored mistake | open | eye: foot L2, L3 | P90, P92, 2:18:35–20:07 |
| CLN-65 | Patients have hot, cold, sore and happy states, from one body | open | eye: each state | P57, 2:0:53–1:01 |

**Keep rows:**
| ID | Issue | Status | Check | Source |
|---|---|---|---|---|
| KEEP-09 | The closed card's three dots ("he's talking"); the card's fold | keep | eye: L3 card | P9, P13, 1:5:02, 1:7:26 |
| KEEP-10 | Liked in the heal games: the bandage wrap, the ear pop-ups, the drill concept, the tongue pops, the thermometer, the boing and its plaster, the eye redrop-and-reread, foot L3 | keep | eye: each game | §2 of this report |

**Rows to update** after Zafar's answers:
- CLN-08 (CB6b blur): superseded by CLN-43 if D1 is yes;
- CLN-33 (knee L3 sides) and CLN-40 (foot, both feet at L3): superseded by CLN-47 if D10 is yes;
- CLN-31 (fever playable), CLN-36 (drinks understandable), CLN-37 (boing clear) and CLN-38 (eye "why am I clicking"): **reopened**, he played them and they still confuse;
- SH-10 and SH-13 (ticks and counting): superseded by SH-38 and SH-39 if D5 and D6 are yes;
- CLN-39 (eye cover can't be taken back): retired if D10 removes the cover.

**Rulebook changes to make with the answers** (orchestrator, same commit as `docs/decisions.md`): E11, E12, F25 (ticks and counts), F22 note (✓), E25 (bulb times), H5 (the eye badge), H31 and the clinic design sheets (`docs/game-design/modes/clinic.md` §B), UX §11.

---

## 14. Coverage check: every transcript line → a point

**Part 1**
| Lines | Point |
|---|---|
| 0:00 | P1, P2 |
| 0:26–0:53 | P2, P3 |
| 0:55–1:46 | P3 (§8A) |
| 1:46–1:51 | P2 |
| 1:53–2:36 | P4 (§8C) |
| 2:40–3:28 | P5 (§8D) |
| 3:28–3:44 | P6 → P23 |
| 3:44–4:41 | P7 (§8E) |
| 4:42–4:47 | P8 ("red blaster" = red plaster) |
| 4:49 | P7 (all modes) |
| 4:55–4:59 | P8 |
| 5:02–5:06 | P9 |
| 5:07–5:33 | P10 |
| 5:35–6:17 | P11 (§8H scrape) |
| 6:28–6:52 | P12 |
| 6:54–7:07 | no action (choosing what to play next) |
| 7:07–7:36 | P13 |
| 7:36–8:06 | P14 |
| 8:06–8:32 | P15 |
| 8:32–8:46 | P16 |
| 8:46–8:55 | P15 |
| 8:55–9:04 | P17 |
| 9:04–9:22 | P18 |
| 9:22–10:29 | P19 |
| 10:29–11:54 | P20 (§8G) |
| 11:54–12:17 | P21 |
| 12:17–12:36 | P22 |
| 12:36–12:49 | P25 |
| 12:49–13:23 | P23, P24 |
| 13:23–13:35 | P24 |
| 13:35–14:58 | P25 |
| 14:58–15:02 | P26 |
| 15:02–15:27 | P27 |
| 15:27–15:51 | P26 |
| 15:54–16:34 | P28 |
| 16:34–16:57 | P29 |
| 16:57–17:09 | P28 |
| 17:09–17:14 | P30 |
| 17:14–17:42 | P31 |
| 17:42–17:47 | P32 |
| 17:47–18:34 | P33 |
| 18:34–19:21 | P33 |
| 19:26–19:38 | P34 (§8H ear) |
| 19:38–19:44 | P35 |
| 19:44–20:14 | P36 |
| 20:14–20:31 | P37 |
| 20:31–21:13 | P38 |
| 21:14–21:31 | P39 |
| 21:31–21:41 | P33 (the bud) |
| 21:41–22:24 | P40 (§8I) |
| 22:24–22:47 | P41 |
| 22:47–23:01 | P42 |
| 23:01–23:21 | P43 |
| 23:21–23:31 | P44 |
| 23:31–24:36 | P45 |
| 24:36–25:04 | P46 |
| 25:04–25:14 | P44 |
| 25:17–25:21 | P45, P46 |
| 25:21–25:46 | P47 |
| 25:46–26:22 | P48 |
| 26:22–26:41 | P49 |
| 26:41–26:48 | no action (stir works, "my throat feels better") |
| 26:48–27:34 | P50 |
| 27:34–28:01 | P51 |
| 28:01–28:20 | P52 |
| 28:20–28:28 | P53 |
| 28:28–29:49 | P50 (the refined version) |

**Part 2**
| Lines | Point |
|---|---|
| 0:00–0:14 | P54 |
| 0:14–0:26 | P55 |
| 0:26–0:53 | P56 |
| 0:53–1:01 | P57 |
| 1:01–1:43 | P58 |
| 1:43–1:47 | §2 (liked) |
| 1:47–2:21 | P59 |
| 2:23–3:10 | P60 |
| 3:12–4:21 | P61 |
| 4:21–5:25 | P62 |
| 5:25–6:07 | P63 |
| 6:07–6:30 | P64 |
| 6:30–6:49 | P65 |
| 6:49–8:13 | P66 (§8F) |
| 8:13–9:00 | P67 |
| 9:00–9:07 | P68 |
| 9:07–9:32 | P69 |
| 9:32–9:46 | P70 |
| 9:46–9:59 | P71 |
| 9:59–10:15 | P72 |
| 10:15–11:16 | P70 (L3) |
| 11:16–11:55 | P73 |
| 11:55–12:06 | P74 |
| 12:06–12:25 | P75 |
| 12:25–12:39 | P76 |
| 12:39–12:59 | P77 |
| 12:59–13:54 | P78 |
| 13:54–14:26 | P79 |
| 14:26–14:59 | P80 |
| 14:59–15:22 | P81 |
| 15:22–15:49 | P82 |
| 15:49–16:09 | P83 |
| 16:09–16:16 | P84 |
| 16:16–16:31 | P85 |
| 16:31–16:53 | P86 |
| 16:53–17:16 | P87 |
| 17:16–17:45 | P88 |
| 17:45–18:35 | P89 |
| 18:35–19:13 | P90 |
| 19:13–19:25 | P91 |
| 19:25–20:07 | P92 |
| 20:07–21:15 | P93 |

**Not found in code:** none of the points needed something that couldn't be traced, except P27 (the gold corners), whose cause is the likeliest one (the peek ring) and needs a screenshot to confirm. "Level four" and "level five" in the transcript are Whisper's readings: the lab offers L1–L3 only (`lab/clinic-core.html`), and the host caps the level at 3 (`host.js:103`).
