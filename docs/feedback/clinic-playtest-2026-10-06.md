# Clinic play-test, 6 Oct 2026: every point, the causes in code, and the decisions

**Source:** Zafar's voice notes 5, 7 and 8 (there was no part 6) after the Sprint 1 publish (live build `20261006T012012Z`): the clinic morning, then the waiting room, diagnosis variants, pharmacy and all nine heal games in the lab. Transcripts (Whisper drafts): `docs/archive/feedback-transcripts/clinic-playtest-2026-10-06-transcript-part5.md`, `-part7.md`, `-part8.md` (23 + 25 + 25 min). The same day's Cook report is `docs/feedback/cook-playtest-2026-10-06.md`; many points are shared, and the decisions there are referred to as **Cook §4 n**.

Times are **part:m:ss** (5, 7, 8). Causes were checked by reading the code (file:line); nothing was run in a browser. **[Z]** = needs Zafar's yes (§4); **[Art]** = art run. Nothing is built before he answers (A1).

**The two root causes behind most of this play:**
1. **Stuck at L2/L3.** From level 2 a counted step closes only when you start the **next** step (rule F22, SH-40). But the next step's row, line and cue appear only **after** the close (`kit.js:577-600`), and the ✓ is hidden (`tally {next:true}`). So after the right number of dabs, kicks, wipes or jugs, nothing on screen says what comes next. This is the scrape (`cut.js:748-800, 1078`), knee (`knee.js:157, 199, 219`), boing (`boing.js:~213, 341-343`) and foot (`foot.js:242-249, 294-299`).
2. **The girl's art isn't in the story.** It is wired into the heal games and the diagnosis only. The waiting room uses rough sprites (`stages/waiting.js:29-47`), and the send-off drops the art on purpose (`sendoff.js:47`).

---

## 1. What it would change (read this first)

### 1a. Mechanics: now → proposed

| Game or screen | Now (checked in code) | Proposed | Points |
|---|---|---|---|
| **Every heal game, L2+: the next step** | The next step's row and cue appear only after the current step closes, and it closes only by starting the next step (see root cause 1) | Once the count is reached, **the next step's row appears and its tool glows after a short pause**; doing it closes the step (F22 kept) | H1, K5, B5, FT4 |
| **Clicks that state the obvious** | D1 needs "Found it" after she says yes (`diagnosis.js:179-184, 215`); pharmacy and heal games end on a ✓ or a stage button | **Moves on by itself** when the outcome is clear (she says yes; the tray is complete; the last plaster is on), after a short beat; no new bottom-right buttons **[Z]** | D2, P2, S4, E10 |
| **The doctor's request** | The card is read aloud while the belt or game already runs (`pharmacy.js:62, 98-117`; heal `S.begin`) | **One pop-up first**: the doctor says what he wants (or what to do), dots for hidden parts, then it folds to the left and the game is quiet; the bulb reveals it (as Cook §4 6) **[Z]** | P1, P8, T5, B7 |
| **Diagnosis D1** | Dots ~44–58 px; any tapped dot turns green before her answer and stays green after "no" (`diagnosis.js:200-201`; `clinic.css:224-225`) | A tried dot goes grey (or back to pulsing) after "no"; smaller dots centred on the parts; she says yes and **the doctor names the part**; it moves on | D1, D3, D4 |
| **Diagnosis D3** | Tool, then part; face parts answer only after the 🔍 zoom, which nothing tells you about (`diagnosis.js:78-94`; `figure.js:248-249`); two rows highlighted in two colours (`clinic.css:55-56`); no card headline (`diagnosis.js:119, 228, 275`) | **A card like sekelo**: a tool head ("use the hand") with its parts under it, ticking as done; the torch on the face zooms by itself; one highlight colour; a headline; played on a bigger patient standing palms-forward **[Z]** | D7, D8, D10–D13 |
| **Pharmacy: wrong colour** | The checker is exact on colour (`pipeline.js:382, ~495-540`), but the ticked red plaster for *lilo* can't be reproduced from code | Same rule as Cook: a wrong item is redone (Cook §4 5); find the tick in play | P5 |
| **Ear: hearing test** | The doctor asks "Which one did I say?" (English placeholder), whispers the word, the child taps a picture; it ends the game (`ear.js:354-397`) | **Both speak with faces.** The doctor says "I'm telling you ___", with the word as dots in his bubble (replay from his box), then "Did you hear?". She says "You told me…", and **the child picks the picture for her**. If it's wrong, more drops and he asks again **[Z]** | E3 |
| **Eye: judging a row** | Any judged row gets the gold ✓, right or wrong (`eye.js:~356-364, 470-485`) | A wrong yes/no **turns red and shakes**, and the doctor names the row's items with pictures in his bubble. If she misread: no → drop → she re-reads it right → the row ticks itself → pause → yes/no again for the next row **[Z]** | EY14 |
| **Eye: the chart** | Rows barely shrink (~12% top to bottom, `eye.js:~371-380`); 1 per row at L1–L2; a realistic eye baked into the chart art | Items shrink clearly row by row and sit on the lines; drawn in code; a stylised eye; **few big items at the top, more small ones lower** (a real eye chart does it that way) | EY1, EY13 |
| **Fever: the model** | Reading = swing + Σ of things on (window 3, ceiling fan 2, hand fan 1; heater 3, bottle 2, blanket 1); zone \|r\| ≤ 1, but the drawn green is ±1.5; she can say "too cold" at ±1, already green (`fever.js:58-61, 468-472, 697`) | One number: each thing adds or takes ±2, ±3 or ±4; a short puzzle to reach the zone; **what she says, how she looks and the gauge always agree**; small sweat or snowflake icons by her head, not a crying face **[Z]** | FV2, FV8–FV10 |
| **Fever: the room** | Items as room buttons placed by fractions (`fever.js:~419-440`); the mouth thermometer is a room button mid-scene; a gust animation on the window | The mouth thermometer in the tool column; the heater on the right facing her; the fan on a desk or shelf, pointing down; the window just opens and closes | FV1, FV4, FV5, FV12 |
| **Boing** | Wipe (cotton bud, count) → drops (levers) → plunger → countdown → plaster; no ✓, nothing says what's next (`boing.js:68-77, 341-370`) | An **alcohol wipe** with a wipe motion; the up-front pop-up says the steps; the next step glows (root cause 1); **a funny jab** (sound and animation, never scary); different plasters to choose **[Z]** | B1–B7 |
| **Tooth** | Brush placed unrotated, bristles up-left; a fixed ±70 px nudge per swipe (`tooth.js:176-182, 470`); jagged round decay; drill round | Bristles into the mouth; the brush follows the finger across the whole mouth; **plaque that clears as you brush**; the mouth less open (teeth a third of it); try a square drill on square-edged decay; "ow" and a buzz outside the line **[Z]** | T1, T4, T7, T9 |
| **Foot** | Soak (jugs, water rising as an overlay) → pull → plaster (`foot.js:90-94, 313`) | **The water washes the dirt away to show the splinter**; no flooding | FT2 |
| **Waiting room** | People stand at L2+ (`pipeline.json:60-61`); W3 pills show the same text as the call (`common.js:364`); the closed card's eye peeks it | **Six on the bench, nobody standing** (Zafar said this before: CLN-11, 13); pills as speakers or faces (no matching text); the eye becomes **a small bulb**, no counter **[Z]** | W2, W3, W5 |
| **Send-off** | She says how she feels and the child picks a feeling (`sendoff.js:127-148`), but on the stand-in body | The same, on her real art, and clearer (her line in her bubble, then the choice) | SO1 |

### 1b. Art [Art]
- **The girl's art through the whole story** (waiting room, diagnosis, send-off, the sticker and card faces): a wiring job, plus any missing poses (sitting, standing, leaving).
- **One sprite sheet per item, with every view it needs** (on the belt, in the tray, in the tool column, in use): Zafar's ask (7:0:14–1:20). This starts with a review table of where each item appears.
- **Pharmacy:** items sitting on the belt (the green bottle floats; drops have no green sprite, `clinic.css:343`); the jugs re-cut; the red plaster red all the way.
- **Scrape:** a dabbing cloth (only a folded one now, `items-v2/cloth-blue.webp`); more realistic cuts and scrapes.
- **Knee:** remove the yellow glow ellipse (`knee.js:83`); a wrap that goes round the knee (path fitted to the art, `knee.js:130, 258-260`).
- **Ear:** wax blobs at the ear's angle (flat front-lit now, `heal-v3/wax-*.webp`); the drop bottle nozzle down; a bin or waste tray instead of the tissue.
- **Tooth:** toothbrush (`items-v2/toothbrush.webp`) re-cut and turned; plaque layer; filling a shade off white with no outline.
- **Taste:** liquids that look like what's in them, the level rising.
- **Fever:** a fan pointing down (`room-items/hand-fan.webp` is face-on); sweat and snowflake icons.
- **Boing:** all new (alcohol wipe, syringe, the jab).
- **Eye:** a chart drawn in code with a stylised eye; her mouth moves as she talks.
- **D1/D3:** a bigger standing patient (palms forward) for D3; no swirl icon (inline SVG, `figure.js:~292-311`) or a better one.

---

## 2. What Zafar liked (keep)
- 🟢 The greeting placement once she answered: "that's good… the placement's good, I take that back" (5:1:03–1:08).
- 🟢 The zoom in (5:5:13) and the zoom out, "that's kind of cool" (5:8:28–8:43).
- 🟢 The scrape sequence: "it looks quite cool to see the sequence, the water and then the dabbing" (5:7:44–7:55).
- 🟢 Pharmacy hint: "it showed me green because I paused for a while, that was clever, I like that" (5:10:45–10:52); the card "folded up nicely" (7:1:51).
- 🟢 Knee: the bandage animation "quite impressive" (7:7:28); "the little dots at the top you keep clicking on… very clever" (7:9:01).
- 🟢 Ear: clearing up afterwards "kind of clever… that was kind of fun" (7:10:24–10:37); wax that keeps coming "kind of funny" (7:15:20); "it could be a good game mode" (7:14:26).
- 🟢 Tooth: drill marks and "fill to the green, that's kind of good" (7:19:16); "the mouth is very clean… I do like that" (7:19:52); "a perfect Pixar-level mouth" (7:23:28); L3 "actually kind of fun… he tells you one by one" (7:22:26–23:06); keep the fill timer (7:22:49–23:00).
- 🟢 Taste: popping the dots "was good"; L2 "quite fun" (8:0:26, 8:1:20).
- 🟢 Fever: "kind of fun"; the window open and close "looked good" (8:3:51, 8:8:02).
- 🟢 Eye: "I like the eye test"; "very nice artwork" (8:13:02, 8:15:43); "it's not bad, actually" (8:22:01).
- 🟢 Foot: the splinters "actually kind of cool… I like that" (8:23:48–24:06).
- 🟢 The waiting room L3 that you hear but can't see (5:13:55).

---

## 3. Every point

| Point | Time | What Zafar said (shortened) | Screen | Cause (checked in code) | Fix |
|---|---|---|---|---|---|
| **CL1** | 5:0:00–0:36 | "I thought we put the new artwork of the girl into this… wired her into all the clinics… what was the point of me waiting… she should be wired in anyway" | clinic morning | Root cause 2 (`waiting.js:29-47`; `sendoff.js:47`; `common.js:199-204`) | Wire the art everywhere **[Z]** item 2 |
| CL2 | 5:0:43–1:08 | "why does he say salaam alaikum and then reply to himself, alaikum salaam… surely the girl should be replying… now she says salaam alaikum, walaikum salaam, okay that's good" | waiting | Code: `salaam` = patient, `salaam-back` = doctor (`waiting.js:147-148`), both queued; the patient bubble anchors on the wrap (`:146`), so the first time it may read as his; the clip may also be wrong. Play check | Each line's bubble from its speaker's face; check the clip |
| CL3 | 5:1:08–1:18 | "I shouldn't say where does it hurt… I should just say doctor's room in the button… more location-led" | waiting end | The button is the `where` line (`pipeline.json:137`) | A "to the doctor's room" button (picture of the room; Kutchi to record) |
| D1 | 5:1:18–2:52 | "we need to be a bit more zoomed in… quite hard to click on her body parts… the pulsating things are quite big… smaller and more accurately centred… elbow… maybe make her bigger" | diagnosis | Dots 44–58 px (`clinic.css:223`); taps from measured fractions (`heal-art.json`), dot positions from `fig.hotspot` | Bigger patient, smaller centred dots |
| D2 | 5:2:52–3:25 | "why do I need to click the found it… she says yes… it should just take you to the next part… we don't introduce more of these bottom-right clicks" | diagnosis | `found` enabled only after yes (`diagnosis.js:179-184, 215`) | **[Z]** item 3 |
| D3 | 5:3:25–4:02 | "when he says a scrape, that doesn't make sense… is he first diagnosing where it is and then what it is… where is it, you click, she says no… then yes… then he says your knee" | diagnosis D1 | On yes she says "[My {part}]" (`pipeline.json:153`); the ailment word follows | Where → no… yes → the doctor names the part; the ailment word later |
| P1 | 5:4:02–4:55 | "nothing really introduces this game mode, the pharmacy… the doctor should instruct you, bring me a plaster… the green bottle is not sitting on the travelator… artwork redone… it didn't go green when I selected… maybe that's fine… we need that first explaining the items to get" | pharmacy | No intro; the card is read while the belt runs (`pharmacy.js:62, 98-117`); the green bottle is a neutral sprite plus a tint, with 12 px padding at its base (`clinic.css:343`) | **[Z]** item 4; **[Art]** |
| P2 | 5:4:58–5:09 | "he says plaster good… you should just be taken to the next game mode again" | pharmacy end | Ends on a stage button | **[Z]** item 3 |
| Z1 | 5:5:13–5:22 | "zooming wasn't bad… a little smoother, maybe half the speed… her animations don't look good" | zoom | 900 ms both ways, easing cubic (`heal/host.js:128, 213-233`) | ~1.5 s; her poses with the art run |
| **G1** | 5:5:22–6:07, 5:17:06–17:39, 5:22:13–22:28, 7:4:13–5:36, 8:5:04–5:24, 8:12:36–12:50 | "he's there twice, in the green and in the recipe card… maybe the green card is just there for the sound and the help and the instruction comes in the recipe card… as long as we're consistent… what's the purpose of the doctor green card… a big fundamental problem… we have to come away from the sprint having clear logic for what's said by Nani or the doctor in the green box and what's said in the recipe card… you see the same face twice… it feels wrong… the green card in cook gives you the next item in the recipe, maybe that's what he should do… the recipe card should just say clean and heal… I want a full review of every single thing said by the green doctor or the recipe card doctor, for every single game… a big table… what they should be and why, with clear logic and consistency" | every game | Clinic: the doctor's box holds the goal (`heal/host.js:175`) and the card holds the steps; Cook: Nani's box holds phase lines; no rule decides | **[Z]** item 1: the table, first job of Sprint 2 |
| G2 | 5:6:12–6:45, 8:13:54–14:13 | "her icon happens to be top left… move her icon to the top right so it doesn't get confused… for all these clinic games… like in the cooking game the person comes on the top right… [eye:] maybe her text under her mouth or on her torso… there's no top right space in this game" | heal games | `.hs-face` at the top left (`heal/scene.js:261`; `clinic.css:498`) | Patient face top right; in the eye game her bubble under her mouth |
| S1 | 5:6:49–7:24 | "we need that artwork for the cloth when you're dabbing with it… a folded cloth off to the side makes sense, but when you're dabbing it should be a dabbing-form cloth" | scrape | One folded cloth for both (`cut.js:1071`) | **[Art]** |
| S2 | 5:7:24–7:41 | "I feel like all the instructions should be there from the beginning… he's spelling them out at the beginning, that's fine the first time" | scrape | – | With **[Z]** item 4 |
| S3 | 5:7:44–8:16 | "the sequencing joiny thing… the vertical line extended past the horizontal line… the plaster wasn't included… none or all should be in the sequence" | scrape card | `.oc-seq::before` assumes a one-line last row (`order-card.css:150-157`); plaster rows have no `seq` and `card.ordered(false)` (`cut.js:614-647`) | Line ends at the last row's centre; all steps in the sequence |
| S4 | 5:8:16–8:28 | "press the tick again… not sure how I feel about this tick when it's done… you should just get moved on" | scrape | ✓ commits the plasters (`cut.js:1090-1092`) | **[Z]** item 3 |
| Z2 | 5:8:28–8:43 | "the zoom out, that's kind of cool… zoom out from the position of the knee… whichever thing you've just fixed… slightly slower" | zoom | Starts at 55% zoom from the same part (`host.js:~228-233`) | Slower; from full zoom on the healed part |
| SO1 | 5:8:43–9:12, 5:11:30–11:41 | "is everything okay now… she said thank you… she should have said yes I'm happy… you click the emotion she's feeling… the send-off screen, she needs to say how she feels, then you select how she feels" | send-off | She does say it and the choice exists (`sendoff.js:127-148`), on the stand-in body; easy to miss | Her line in her bubble from her real art, then the choice, clearly |
| D4 | 5:9:12–10:23 | "I clicked on her forehead… she said no but the circle turned green… should turn red or grey… as soon as she says no it should go back to pulsating" | diagnosis D1 | `.sel` green on every tap before the answer (`diagnosis.js:200-201`) | Grey after "no" (tried), never green |
| P3 | 5:10:30–10:40 | "we could redo the artwork for the pharmacist but let's just leave it" | pharmacy | – | No change |
| SH1 | 5:10:40–10:45, 7:1:22–1:30 | "the tick button… a bit of a drop shadow around it… a drop shadow on the white border behind the gold tick, I don't like that" | ✓ everywhere | `.cl-go.done` shadow (`clinic.css:110-116`) on the shared `.njg-done` lip (`buttons.css:10-17`; `tokens.css:39-41`) | Flat ✓, no shadow, shared |
| P4 | 5:10:45–10:52 | "it showed me green because I paused… that was clever, I like that" | pharmacy | – | KEEP-14 |
| P5 | 5:10:52–11:22 | "it's saying lilo plaster… I put red… I got a tick though… the wrong mechanism and do it again mechanism needs to be the same as cook… consistency" | pharmacy | Checker exact on colour (`pipeline.js:382-540`); colour asked only from L2, half the time; not reproduced | Reproduce with a seed; Cook §4 5 |
| L1 | 5:11:41–11:46 | "that's the old clinic lab index" | labs | An old index page still linked | Point labs at the current clinic lab only |
| W1 | 5:11:46–12:16 | "the round circles underneath the characters… looks a bit messy… the padding and spacing between the circle selectors and the boxes, call them in" | waiting | `.cl-wtick` under each slot (`waiting.js:67-80`; `clinic.css:318-323`) | Spacing pass |
| W2 | 5:12:29–13:48 | "level two… chokri come… I can still just match the words… should it be a speaker… people can't read… probably fine" | waiting W3 | Pill label = the called line (`common.js:364`) | Pills show faces or speakers, not the text (leak test, non-negotiable 6); CLN-14 reopened |
| W3 | 5:12:43–12:56 | "we should only have people sitting on the bench… maximum six… no one standing… I've already told you that… if it's legacy, update it" | waiting | Standing at L2+ (`pipeline.json:60-61`; `pipeline.js:255-258`) | Nobody stands; CLN-11, 13 reopened |
| W4 | 5:13:55–14:00 | "this time you can hear but you can't see… I like that" | waiting L3 | – | KEEP-14 |
| W5 | 5:14:00–15:30 | "there's a little eye button… we shouldn't do that… change that eye to a light bulb… keep it small… a counter next to it… we don't need the counter… should we always have the bulb on speechy things… not on ingredients or tasks… they need to learn to press the global bulb" | closed card | The `.oc-look` eye (`order-card.js:183-224`); the number is the bulb's hint counter (`screen.js:50, 72-73`) | **[Z]** item 10 |
| D5 | 5:16:03–16:39 | "D1 level two… why the two buttons… my initial feedback about the buttons" | diagnosis D1 L2 | `found` and `next` (`pipeline.json:165-166`) | With D2 |
| D6 | 5:16:48–17:42 | "on D2 he should say his item in the recipe card… the doctor doubled up twice… both saying where does it hurt… maybe one should say test or ask… the purpose of each" | diagnosis D2 | – | In the G1 table |
| D7 | 5:17:42–18:19 | "D3… I don't feel well, I don't know why… a speech bubble should come from her… then from the doctor, or the sidebar says look at the hand" | diagnosis D3 | `unwell` line (`pipeline.json:144`) | Her bubble; his instruction on the card |
| D8 | 5:18:19–19:05 | "two things on the left, thermometer and a hand… not easy to click her hand… D3 only on standing patients, palms facing the front… bigger" | diagnosis D3 | Taps on the seated art; small parts | **[Z]** item 5; **[Art]** |
| D9 | 5:19:05–19:28 | "I'm not sure I like the swirly icon for where the injury is… it brings it down" | diagnosis | Inline SVG (`figure.js:~292-311`) | Remove; the patient's own sore look instead |
| D10 | 5:19:40–20:21 | "the doctor said two things, look at the hand… then look in the eyes… a different colour… both highlighted in slightly different colours… I don't know which one's first… which implement to use" | diagnosis D3 L2 | `.cl-row.now` and `.cl-row.reading` in two colours at once (`clinic.css:55-56`; `kit.js:503-505`) | One highlight (Cook SH-53) |
| D11 | 5:20:21–20:46, 5:22:28–22:40 | "click on her eye… that didn't work… I'm clicking the eye and all around the eye and it's just not working" | diagnosis D3 | Face parts answer only after the 🔍 zoom, which nothing cues (`diagnosis.js:78-94`; `figure.js:248-249`) | The torch zooms by itself |
| D12 | 5:21:02–21:49 | "two instructions, which thing to use and where to look… like the mishkaki skewers… use your hand, and the sub is look at the knee, look at the hand… they tick off… then use the torch, look in the eye" | diagnosis D3 | Rows are `check` = verb + part (`pipeline.js:~358-363`) | **[Z]** item 5 |
| D13 | 5:21:49–22:13 | "there's also no main title for the doctor's recipe card… look everywhere… find it?" | diagnosis | `title: ""` (`diagnosis.js:119, 228, 275`) | A headline (in the G1 table) |
| P6 | 7:0:00–1:20 | "the artwork… on the conveyor belt and then in your tray… two orientations… the icon on the right-hand side to select… when you use the item, the drill… a review of where and how all these items are used… one sprite sheet for each item" | all items | – | **[Z]** item 11 |
| P7 | 7:1:35–1:51 | "it went bandage to hammer… always top to bottom… I like how the card folded up nicely" | pharmacy | – | KEEP-14 |
| P8 | 7:1:57–2:33 | "level five [three]… he should say the items he wants before you go into the game, otherwise you're hearing and trying to play and listen at the same time… consistent across these games" | pharmacy L3 | Card read while the belt runs | **[Z]** item 4 |
| P9 | 7:2:41 | "the red plaster probably needs to be red all the way" | pharmacy | Plaster art | **[Art]** |
| P10 | 7:2:53–2:59 | "these jugs aren't cut out nicely, but… temporary quick artwork" | pharmacy | – | **[Art]** |
| H1 | 7:3:07–4:08, 7:5:48–6:01 | "level two… use the cloth, four dabs, which I did, nothing happened… it keeps counting higher… no tick or next button… I'm just stuck… same for level three" | scrape | Root cause 1: closes only on picking a plaster (`cut.js:796-800, 993, 1078`) | 1a first row |
| H2 | 7:3:51–3:57 | "presumably we're going to fix the artwork for the cuts and scrapes to look more realistic" | scrape | – | **[Art]** |
| H3 | 7:5:36–5:48 | "I don't know why it needs to say cold after that" | scrape | The patient says "Cold!" when the wash finishes (`cut.js:902`; `cut.json lines.cold`) | Drop "Cold!" at the wash, or say it as she flinches (a reaction, not a step) |
| K1 | 7:6:05–6:26 | "that is quite zoomed in… a tad zoomed out… maybe it's fine" | knee | – | Check at review |
| K2 | 7:6:28–6:46, 7:8:40–8:46 | "why is there a yellow semicircular moon crescent to the side and behind the knee… is that cut out badly… take away that weird yellow thing" | knee | The glow ellipse (`knee.js:83`), off-centre from the art, under it | Remove |
| K3 | 7:6:51–7:28, 7:8:21–8:40 | "the bandage has to go around the knee… over the kneecap and behind… move it diagonally… right now it ends in the middle of the leg" | knee | Straight lines between fixed dot offsets (`knee.js:130, 258-260`) | Wrap path fitted to the knee art |
| K4 | 7:7:28–7:45 | "not a bad animation actually, quite impressive" | knee | – | KEEP-14 |
| K5 | 7:7:45–8:21, 7:9:06–9:14 | "the text for the bandage didn't come out until I clicked the bandage… once I've done the hammering it needs to tell me what's next… the vertical line… extends beyond the bottom" | knee | Root cause 1 (`knee.js:157, 199, 219`); the connector as S3 | 1a first row; S3 |
| K6 | 7:8:21–8:47, 7:9:24–9:37 | "a good opportunity to use higher numbers… definitely needs to be higher numbers even for the easy mode… that's the whole fun of it" | knee | Wrap turns L1 2–4, L2–L3 3–5 (`knee.js:21-24`) | Turns about 4–6 / 5–8 / 6–10 |
| K7 | 7:9:01–9:24 | "I like the little dots… very clever… the dots need to alternate left to right" | knee | They already alternate (`knee.js:39-43`); heights vary from L2 | KEEP-14; check alternation reads in play |
| E1 | 7:9:39–10:14, 7:15:06–15:11 | "I have to drag it? Now I'm confused… that explainer wasn't clear… use the tweezers to put it in the tissue… the help doesn't show you need the tweezers to drag them" | ear | Ghost drag without the tweezers (`ear.js:318, 426-427`) | Ghost finger drags the tweezers with a blob to the bin |
| E2 | 7:10:24–10:37 | "clear up afterwards… kind of clever, but the bits you clear with the cotton bud shouldn't appear out of nowhere… residue from the earwax" | ear | `leaveSmear` pops 6 ellipses at once (`ear.js:230-239`) | The smear stays where a blob was pulled, visibly |
| E3 | 7:10:37–13:55, 7:16:03–18:13 | "tomato? why all of a sudden did it say which one… is this testing the hearing… clear the question is from the doctor and the answer from the girl… a little face icon of the girl… I'm telling you tomato, did you hear… she says you told me… and you select the image the doctor said… if you get it wrong you put in more drops and he asks again… she lets you answer for her… the word hidden with dots… replay from the green card" | ear | `ear-hear-q` "Which one did I say?" (English placeholder); whisper; picture tap ends the game (`ear.js:354-397`) | **[Z]** item 6 |
| E4 | 7:12:46–13:05 | "earwax is disgusting… a chemical waste tray or waste paper basket so once it goes inside you don't see it" | ear | Tissue target | **[Art]** a bin |
| E5 | 7:14:02–14:26 | "there's a pink blob that never went away… you're meant to be clearing all that out" | ear | Sore-skin ellipses never cleared (`ear.js:139-148`) | Clear at the end |
| E6 | 7:14:34–15:06 | "the ear blobs don't look realistic… flat at the bottom like on a flat surface, but you're looking at the ear side-on… they don't look adhered" | ear | Front-lit blobs at 2.5× radius (`ear.js:176`) | **[Art]** |
| E7 | 7:15:20 | "it's kind of funny that more keep coming" | ear | – | KEEP-14 |
| E8 | 7:15:36–15:53 | "when you do the drops the bottle is facing nozzle up… it should face nozzle down" | ear | Upright art, no rotation (`ear.js:517`) | Turn it, drops fall from the nozzle |
| E9 | 7:16:00–16:03 | "you have to press the tick for some reason, which is annoying" | ear L2 | ✓ closes the drops at L2/L3 (`ear.js:494-503`) | **[Z]** item 3 |
| T1 | 7:18:21–18:53 | "the toothbrush needs to be how it was the first time… bristles facing into the mouth… cut out much better… move it more to the right, more to the left… to the edge of the mouth… movements too small" | tooth | Unrotated art (`tooth.js:176-182`); fixed ±70 px nudge (`:470`) | Turned art; the brush follows the finger |
| T2 | 7:19:04–19:23 | "drill the bad bits… there's no drill… okay I see… it makes a mark… fill to the green, kind of good" | tooth | – | KEEP-14 |
| T3 | 7:19:23–19:52 | "the button looks a little awkward floating there… the final filling slightly closer to tooth colour… don't put the outline around it" | tooth | Paste white; grey outline when overfilled (`tooth.js:308`) | Off-white, no outline; the button anchored |
| T4 | 7:19:52–20:11 | "if you damage the teeth she should say ow… or a mock vibration if you go outside the line… otherwise quite clever" | tooth | – | "Ow" (to record) and a buzz |
| T5 | 7:20:11–20:50 | "this can't be too fiddly… phones and tablets… you should have the instructions with you beforehand… I've said that enough times" | tooth | – | **[Z]** item 4 |
| T6 | 7:20:50–21:02 | "the ghost hand is showing you to swipe… I guess you can swipe" | tooth | – | – |
| T7 | 7:21:05–22:29 | "the drill should make square holes… the area you drill out has 90-degree square edges… it's clear you're in the right space… your tool is circular… let's try it how I suggested, if it's wrong it's wrong" | tooth | Round drill, jagged polygons (`tooth.js:47-56`) | **[Z]** item 7 (try it) |
| T8 | 7:22:26–23:13 | "level three, it's actually kind of fun… listen and then do one move after the next… once you include the timer… let's keep it… reveal nicely in the beginning levels" | tooth | – | KEEP-14 |
| T9 | 7:23:13–24:49 | "the teeth should become cleaner as you brush… plaque around the teeth… the mouth a bit more closed… the mouth is six or seven times the height of the teeth… the brush is nowhere near the teeth… a third, a third, a third… the filling can stay open as it is, or the same for continuity" | tooth | Wide-open mouth art | **[Z]** item 7; **[Art]** |
| TA1 | 8:0:18–0:31 | "popping the dots… putting the ointment on them as they moved around, that was good" | taste | – | KEEP-14 |
| TA2 | 8:0:31–0:45 | "the liquid needs work going in… new artwork… different liquid depending on what's in there" | taste | A flat ellipse that fades in; the level never rises (`taste.js:265, 288-290`) | **[Art]** |
| TA3 | 8:0:45–1:00 | "I put the milk in… then what do I do… is it done… the teaspoon and I click on it… my tongue feels better" | taste | Next step not cued (root cause 1 shape) | Cue the next action |
| TA4 | 8:1:00–1:11 | "there's some purple dots left remaining… you fixed it, there shouldn't be any left" | taste | The `HOLES` ellipses are never cleared (`taste.js:165, 469`) | Clear them on the fix |
| TA5 | 8:1:18–1:48 | "spots… that's quite fun" | taste L2 | – | KEEP-14 |
| FV1 | 8:1:48–2:05 | "the temperature thing is sitting not off to the right as an item like in other game modes… randomly in the middle" | fever | A room button mid-scene (`fever.json room.at.thermometer`) | Tool column |
| FV2 | 8:2:05–3:00 | "I'm too hot… then it said barabar… like it was correct… the thermometer went above the green… maybe a bug when it passes the green mark… or he was asking the question, but it's not voiced like a question" | fever | "barabar" only from `closeEx()` when \|r\| ≤ 1 (`fever.js:61, 706-711`), but the green band is drawn ±1.5 (`:468-472`) and the gauge lags 0.6 s | One zone for both; a question clip if he asks |
| FV3 | 8:2:39–3:51 | "the doctor's things should come up top left in a speech bubble… who's saying what… her lines above her head… if he's in a conversation, his own speech bubbles from the left… if it's instructions to you, in his green box" | fever, all | – | In the G1 table: dialogue in bubbles from faces; instructions in the box |
| FV4 | 8:2:46–2:54 | "the fan artwork… face-on… it should be pointing downwards" | fever | `room-items/hand-fan.webp` face-on | **[Art]** |
| FV5 | 8:3:56–5:00 | "I don't really like items scattered about haphazardly… they need a place… the heater on the right-hand side facing her… the mouth thermometer on the right like items normally… the fan lying properly, on the bed or desk or a shelf" | fever | Placement by fractions (`fever.js:~419-440`) | A tidy layout |
| FV6 | 8:4:09–4:14 | "the windows as a game mode… that would have been cool" | fever | – | `ideas.md` |
| FV7 | 8:5:04–5:24 | "let's get you just right… English text… I'm not getting drawn back into who should be saying what in what card" | fever | English placeholder headline | In the G1 table |
| FV8 | 8:5:24–6:05 | "I'm too cold… the thermometer's in the green, which is incorrect… if she's too cold she has to look too cold, say too cold, and the thermometer in the cold section… all that needs stitching together" | fever | She says hot/cold from `e.hot` at open while ±1 is already green (`fever.js:697`; `K.gaps`) | **[Z]** item 8 |
| FV9 | 8:6:06–7:10 | "switch on fan, switch off fan… that's the answer… a temperature needs to be a nominal number like 10… items give +3, +2, +4 or −2, −3, −4… an equation… an interesting sequence… you can't just give one thing then take it away and all of a sudden it's better" | fever | ±1/2/3 sizes; gaps 1–3 (`fever.js:58-59`) | **[Z]** item 8 |
| FV10 | 8:7:21–7:44 | "the crying emoji is not the one… she needs a sweating icon on the top right of her head and a little ice flake… so you can read it" | fever | The girl's hot/cold face art via `artMood` (`figure.js:453`) | Small icons by her head; keep the faces |
| FV11 | 8:7:44–8:02 | "the game's highlighting something but there's nothing there anymore… the hand fan… it was just the wrong point" | fever | A cue on an item that moved or was taken | Cue follows the item |
| FV12 | 8:8:02–8:24 | "the window open and close look good, the intermediate… cartoony gust of wind wasn't good… just open and close" | fever | `.fv-breeze` on the stand-in | Remove the gust |
| FV13 | 8:8:24–8:30 | "fix how all this works… in theory it's good, but I need it good in practice" | fever | – | With item 8 |
| B1 | 8:8:37–8:59, 8:9:35–9:39 | "I'll do it, you count… why does it say that… it doesn't [match] what's actually happening" | boing | `boing-goal` headline, English placeholder (`boing.json:175`) | In the G1 table |
| B2 | 8:9:09–9:27 | "the countdown… it needs not a flashbang but a funny sound and animation so the kids don't get scared of injections" | boing | – | **[Z]** item 9 |
| B3 | 8:9:27–9:35 | "in theory it's okay, it needs all new artwork" | boing | – | **[Art]** |
| B4 | 8:9:40–9:51 | "wipe three times… a cotton bud isn't the best thing to wipe with… no wiping animation… an alcohol wipe" | boing | Cotton count (`boing.js:68-77`) | **[Z]** item 9 |
| B5 | 8:9:55–11:32 | "I've wiped it three times, now what… four drops… might need more support… I'm just clicking random things… the light bulb… never told me what drops… I can't move on… needs completely fixing" | boing | Root cause 1 (`boing.js:~213, 341-370`); the bulb has no boing hint | 1a first row; the bulb shows the next step |
| B6 | 8:10:30–10:34 | "different kinds of plasters… to make that part vaguely interesting" | boing | – | **[Z]** item 9 |
| B7 | 8:11:32–12:24 | "level three, he should say clearly what's needed… that screen should come up at the front… voice it out… dots where the colours are… a pop-up card… minimises to the left… reveal… the onboarding should show you what to do after you've dabbed enough… the dab should be an alcohol wipe" | boing | – | **[Z]** item 4 |
| EY1 | 8:13:02–13:10 | "I like the eye test… the eye is a bit freaky… a stylised eye at the top, not a real-looking one" | eye | Baked into `heal-v3/eye-chart-front.webp` | Chart drawn in code |
| EY2 | 8:13:10–13:28 | "she says limu, so you say no and give her another eye drop… that is correct" | eye | – | – |
| EY3 | 8:13:28–13:47 | "all the outlines on the eye test overlapping each other as they turn gold" | eye | Row rects y−4…y+h+4 overlap 4–6 units (`eye.js:~358-364`) | Inset outlines |
| EY4 | 8:13:47–13:54 | "if I didn't listen I just have to guess now" | eye | – | Her face replays (as everywhere) |
| EY5 | 8:13:54–14:13 | "her text under her mouth… on her torso… lots of empty space there" | eye | – | With G2 |
| EY6 | 8:14:23–14:46, 8:16:35–17:04 | "a whole coloured chart thing has appeared and it's flashing… made no sense… let's put it at the bottom right… everyone else had text saying go to this… just say go to eye test" | eye L2 | The mini chart `MINI` pulses after the first drop (`eye.js:~226-247, 555-593`) | A "to the eye test" button bottom right, like the others |
| EY7 | 8:14:51–15:20 | "in level one it should say limu in a bubble… under her mouth… pops up and already starts fading… in a second… for level one" | eye L1 | – | Her word as a fading bubble at L1 |
| EY8 | 8:15:23–15:43 | "it'd be nice if her mouth moves… even with the speech bubble" | eye | – | **[Art]** a talking mouth |
| EY9 | 8:15:43–15:49 | "the artwork's quite nice, very nice artwork" | eye | – | KEEP-14 |
| EY10 | 8:15:49–16:03 | "she said paani… I'm assuming that wasn't paani, it looked like milk" | eye | The paani picture reads as milk | Picture check (water vs milk) |
| EY11 | 8:16:18–16:35 | "at level three he no longer needs to count out the numbers… you can see them on the right and the little dots" | eye L3 | `S.count` speaks at L3 (`eye.js:~588`; `scene.js:560-562`) | Count-along at L1 only (decision 41) |
| EY12 | 8:17:16–18:29 | "the items need to get physically smaller… sit on the line… redo the eye chart… much more exaggerated… draw the lines yourself… more items at the top and fewer at the bottom, like a triangle? I think so" | eye | Sizes 74→44, capped to ~38→34 by the art's ruled lines (`eye.js:~371-380`) | **[Z]** item 12 (a real chart has *fewer* big items at the top) |
| EY13 | 8:18:32–21:58 | "she got that correct, but I'm going to say no, but it still ticked it as correct… a teachable moment… the doctor says item one, item two with a picture… my no button turns red and shakes… then I press yes… if she was wrong I give the eye drop, she says it again, gets it right, the row ticks itself… then a pause, the yes/no buttons reappear, the next row" | eye | Any judged row draws the gold ✓ (`eye.js:~356-364, 470-485`) | **[Z]** item 6 |
| FT1 | 8:22:12–22:23 | "taking ten hours to load" | foot | No preloading; 12 game scripts and ~1 MB of language JSON loaded serially before the first stage (`main.js:97`; `heal/host.js:39-66`; `lang.js:56-57`) | Measure; load per game (with Cook CK-25) |
| FT2 | 8:22:27–23:03 | "take out the pouring water… the whole flooding in water doesn't make sense… focus on taking the splinter out… it should clean the dirt and unveil the splinter" | foot | Soak overlay rising per jug (`foot.js:313`) | **[Z]** item 13 |
| FT3 | 8:23:03–23:12 | "I start ignoring the cards because it's just so noisy and incorrect all the time" | all | – | G1 table; one-at-a-time lines |
| FT4 | 8:23:25–23:48 | "three jugs… now what do I do… a recurring problem… I've done the right number, what do I do next… really annoying" | foot | Root cause 1 (`foot.js:242-249, 294-299`) | 1a first row |
| FT5 | 8:23:48–24:06 | "splinters… that's kind of cool… I like that" | foot | – | KEEP-14 |
| TU1 | 8:24:13–25:00 | "I kind of like the idea of the tummy game… show a tummy with vegetables, fruit and sweets, chocolate, mithai… a big sucky pipe to take out the bad stuff… then you give them tea… give me your thoughts… or let's just leave the tummy for now, we've got enough game modes" | tummy (parked) | The parked tummy game drags bubbles to burp (`heal/games/tummy.js`) | `ideas.md` (§4 item 14) |

---

## 4. Decisions for Zafar (answer "yes to all except …")

1. **The green box vs the card: the full table** (G1). You asked for this, so *recommend* it is **the first job of Sprint 2**: every line said by the guide box (Nani or the doctor) and the card in every Cook station and clinic stage, with what it should say and why. One rule decides it. The rule I'll propose:
   - **The card** is what's wanted: the headline is the goal ("clean and heal"), and the rows are the steps or items.
   - **The guide box** is the next step and help. It is never the same text as the card.
   - **Dialogue between characters** goes in bubbles from each speaker's face. The person being served or treated sits at the top right.
   - **When the same person is both asker and guide** (Nani in the pantry), one card, not two faces.
   - The table comes to you to answer row by row.
2. **The girl's art through the whole clinic story** (CL1). *Recommend yes,* first thing in the clinic fix session.
3. **No extra clicks when it's obvious** (D2, P2, S4, E9). "Found it", the end ✓ and the stage buttons go where the outcome is clear (she says yes, the tray is complete, the last plaster is on), and it moves on after a beat. *Recommend yes.* It is the same rule as Cook's ✓.
4. **The request first, then a quiet game** (P1, P8, T5, B7): the same as Cook §4 6, for the pharmacy and every heal game. *Recommend yes.*
5. **Diagnosis D3:** a card like sekelo (tool head, parts under it, ticking); the torch zooms by itself; a bigger standing patient. D1 and D2 keep their roles, and their lines go into the table (D6). *Recommend yes.*
6. **Ear and eye judging, your redesigns** (E3, EY13):
   - In the ear, she says "you told me…" and the child picks for her.
   - In the eye, a wrong yes/no shakes red and the doctor names the row with pictures.
   - A misread gets a drop and she re-reads it right.
   - *Recommend yes to both.*
7. **Tooth** (T7, T9): plaque that clears as you brush, the mouth less open, and a trial of the square drill on square decay. *Recommend yes,* as a trial you play.
8. **Fever as one number** (FV8, FV9): things add or take ±2/±3/±4, and what she says, how she looks and the gauge always agree. Small sweat and snowflake icons, and a tidy room. *Recommend yes.*
9. **Boing** (B2, B4, B6): an alcohol wipe, a funny jab, and a choice of plasters. *Recommend yes.*
10. **The bulb on closed cards** (W5): the closed card's eye becomes a small bulb with no counter. Keep it on spoken cards (the waiting room, conversations) but not on ingredient or task cards, where the main bulb does the job. *Recommend yes.*
11. **One sprite sheet per item** (P6): a table of every item and every view it needs (belt, tray, tool column, in use), then one art block per item. *Recommend yes,* folded into the art run.
12. **The eye chart** (EY12). A real eye chart has **one big item at the top and more, smaller items lower down**, not more at the top. *Recommend:* the real way, items shrinking clearly, drawn in code.
13. **The foot** (FT2): water washes the dirt off to show the splinter; no flooding. *Recommend yes.*
14. **The tummy idea** (TU1): you ended with "leave the tummy for now". *Recommend:* park it in `ideas.md` with your design.
    - My thoughts for later: show a cutaway tummy with good food and too many sweets; the child pulls out only the extra sweets (the count is the Kutchi); then a cup of warm water or tea.
    - The sweets stay what she ate too much of at a wedding. They are never a reward and never "bad food", so it stays kind (non-negotiable 16 allows mithai at a celebration).

---

## 5. Coverage
Every transcript line maps to a point above or to chatter. Chatter: the item words he read aloud while playing (5:1:31, 5:13:48–15:56 parts, 7:5:48–6:28 counts, 7:11:12–12:38 "tomato" repeats, 8:13:10–21:28 the chart words, 8:22:21–22:27), "I'm so bored of giving feedback for hours" (8:0:05–0:18), the level presses, and the closing lines (8:25:00). **Unmapped: 0.**

## 6. Regression rows added (6 Oct)
New: CLN-81–CLN-108, SH-61–SH-63, KEEP-14. Reopened: CLN-01, CLN-11, CLN-13, CLN-14, CLN-16, CLN-18, CLN-23, CLN-31, CLN-34, CLN-35, CLN-57, CLN-61, CLN-65.
