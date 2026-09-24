# Nani jo Ghar: asset building plan

**Started:** 24 Sept 2026. **Status:** plan only. Nothing is generated until the Cook with Nani stations are settled (see `docs/cook-with-nani-phase-a-design.md`, section 1: the asset run comes after Phase A).

This is the master list of art to build, and in what order. Section 1 covers hands and arms, the first thing we generate, because every game mode uses them. The rest (ingredients, props, backgrounds) goes here as each mode is planned.

---

## 1. Hands and arms (the player's own)

### 1.1 How hands work in the game

- **First person.** The player's forearms come up from the bottom of the screen, as in Cooking Mama.
- **Rigid images moved in code.** There's no finger animation. Code slides, rotates and swaps images: a knife chops up and down, a ladle goes round, a jug tilts. Most poses are one image. A few have two frames, open and closed (grab, catch, clap, squeeze).
- **Only right hands are drawn.** Left hands are mirrored in code. Two-handed poses are drawn as one image only where the hands touch or overlap (rolling pin, clap, handshake).
- **Hand and tool are separate images.** A "handle grip" hand holds a knife, ladle, spatula, rolling pin, racquet, paddle, drumstick, brush or umbrella, and the tool is its own sprite placed in the grip. That's why the list below is short: **it's organised by grip, not by action.** New actions later are mostly new tools, not new hands.
- **Two cameras:**
  - **Top-down (T):** looking down at a worktop or table. Used for cooking stations, Tidy up and the clinic table.
  - **Eye level (E):** looking forward, with the back of the hand towards the player. Used for greetings, reaching for shelves, Find it, Dress up, music, sport and Snap.

  A pose is drawn only in the cameras it's used in.

### 1.2 Boy and girl versions (Zafar, 24 Sept)

Plan: **generate one master set, then reskin it** with the image API's edit mode. The instruction is "change only the sleeve and the accessories; keep the hand exactly the same".

| Version | Sleeve and details |
|---|---|
| **Master / boy** | Kurta cuff with Kutch embroidery (the signature from the Phase A design) |
| **Girl** | Embroidered kurti cuff, a few glass bangles |
| **Girl, Eid** (optional) | The same, with mehndi on the back of the hand and the palm |
| **Nani** (small set, marked N below) | Older hands, gold bangles, her red sleeve. Used for the "watch me" demos and when she passes you things |

**Guarding against drift:** a script compares each reskin's outline with the master's. It rejects the image if the hand shape has moved, because otherwise the tools won't sit in the grip. Skin tones could be a later option through the same reskin step (open question for Zafar).

### 1.3 The list (condensed by grip)

Each line: pose, camera, frames, and what it's used for. Games: **C** Cook, **F** Find it, **T** Tidy up, **D** Dress up, **K** Nani's clinic, **W** Who did it?, **M** Monsoon rush, **S** Snap, **G** greetings in every mode, **X** future.

**A. Open hand**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| A1 | Flat palm down | T | 1 | Pressing, kneading, patting bajra rotlo, pressing a samosa edge, feeling a forehead (K), smoothing cloth (T, D) |
| A2 | Heel-of-palm push | T | 1 | Kneading, squashing, pushing an item across the table (T) |
| A3 | Palm up, open | T, E | 1 | Receiving ("here you are"), offering, holding out a hand for a coin, dua with two palms up (mirrored pair) |
| A4 | Reaching, fingers spread | E | 1 | Reaching for a shelf (C pantry, F, T), reaching up high |
| A5 | Wave | E | 2 | Hello and goodbye (G), getting someone's attention |
| A6 | Palm out, "stop" / high five | E | 1 | High five after a perfect order, "stop" or "enough" (C pour), blocking (M) |
| A7 | Hand on heart | E | 1 | Salaam greeting, thank you (G) |
| A8 | Cupped hand | T, E | 1 | Catching drips (M), holding a pile of seeds or spices, washing |

**B. Handle grip (the tool is a separate sprite)**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| B1 | Horizontal handle grip | T | 1 | Knife, spatula, ladle and doi, tadka ladle, whisk, pan handle (tilt a pan), tongs, skewer handle, grater |
| B2 | Vertical grip (fist, thumb on top) | T, E | 1 | Pestle and mortar (grinding), churning (chaas), stirring deep pots, umbrella (M), broom, hairbrush (D), torch |
| B3 | Loose stick grip | E | 1 | Drumstick (dhol, X), racquet and paddle, bat, kite reel (X), stick for the snake-and-ladder counter |
| B4 | Two hands on a rolling pin | T | 1 | Rolling maani (the two hands drawn with the pin, rocked in code) |
| B5 | Hook grip (fingers curled under a handle) | T, E | 1 | Jug handle (pour by tilting), bucket (M), basket (F bazaar), bag, kettle, chai-glass holder |

**C. Pinch and fingertip**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| C1 | Fingertip pinch, open and closed | T, E | 2 | Picking a small thing (spice, bead, coin, chick), placing it, sprinkling and garnish (quick alternation), threading a piece onto a skewer, pulling a thread (D) |
| C2 | Tripod grip (holding a spoon or pen) | T | 1 | Teaspoon (sugar, count-in), mehndi cone (D), piping jalebi, writing a list (F), medicine spoon and thermometer (K), paintbrush |
| C3 | Side pinch (holding something flat) | T, E | 1 | A card, photo (W, S), ticket, chapati edge (flip by hand), fabric (D), a page of the notebook |
| C4 | Pointing index finger | T, E | 1 | The default "tap" hand, pointing at a suspect or clue (W), pressing a button, turning a knob (a small rotation in code). Also the see-through demo finger (already in the game) |
| C5 | Two-hand pinch fold | T | 1 | Folding a samosa, folding cloth (T, D), wrapping a bandage (K), wrapping a gift |

**D. Whole-hand hold and fist**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| D1 | Grab, open then closed | T, E | 2 | Grabbing (the pantry, Tidy up), pulling a rope, picking up a vegetable, carrying |
| D2 | C-shape hold (cup or glass) | T, E | 1 | A chai glass or cup, a lassi glass, holding a bottle, pouring from a jar (tilt in code), shaking a jar |
| D3 | Two hands cupping a bowl | T | 1 | Carrying a bowl or thali, serving, holding a sweet box |
| D4 | Squeeze (fist half-closed, then tight) | T | 2 | Squeezing a lemon, wringing a cloth (M), squeezing a ketchup or chutney bottle |
| D5 | Throw release, fingers opening | E | 1 | Throwing (a ball, kite, grain to the chickens), letting go |
| D6 | Two-hand catch, open then closed | E | 2 | Catching (M, a ball, the chop station's thrown vegetables if we want a catch variant) |

**E. Social and number gestures**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| E1 | Thumbs up | E | 1 | Well done, yes, "just right" |
| E2 | Handshake (hand held out sideways) | E | 1 | Greeting guests (G), making a deal in the bazaar (F) |
| E3 | Counting fingers, 1 to 5 | E | 5 | Numbers everywhere: showing "trae", answering "how many?". **High language value**, since fingers show a number without any digits on screen |
| E4 | Clap, apart and together | E | 2 | Celebrating, rhythm games (X), calling the chickens |
| E5 | Arms up, two fists (celebration) | E | 1 | Perfect order, end of a day, finale |
| E6 | Stretch, two arms up with open hands | E | 1 | Waking up (story beats: the morning of Eid, a new day) |
| E7 | Shrug, two palms up and apart | E | 1 | "I don't know" (W), a wrong guess |

**F. Music, sport and play (mostly future)**

| # | Pose | Cam | Fr | Used for |
|---|---|---|---|---|
| F1 | Piano hands, fingers curved over keys | E | 2 | Harmonium or piano mini-game (X). Two frames: raised and pressed; keys light up in code |
| F2 | Hand-drum slap, flat and cupped | T | 2 | Dhol or tabla rhythm (X). The flat hand is A1; the cupped hand is a variant |
| F3 | Racquet and paddle | E | 1 | B3 plus a tool sprite, swung by rotating in code (a badminton-style catch game, X) |
| F4 | Holding a camera or phone, two hands | E | 1 | Snap (S) |
| F5 | Holding a kite string | E | 1 | Uttarayan kite flying (X). This is C1 with a string sprite; add it only if the pinch doesn't read well |

**Nani's set (N):** A1, A3, B1, B4, B5, C1, C4, D2, E1, E3 (about 10 poses). She demonstrates, passes things and counts on her fingers.

### 1.4 Totals and cost

- **Player master set:** about 38 images (counting 2-frame poses twice, and a pose in both cameras twice), for 30 poses.
- **Reskins:** boy (the master), girl, girl Eid: about 38 × 2 more, so about 115 player images.
- **Nani:** about 12.
- **Tools** (separate sprites, generated with their station's props): knife, spatula, ladle, doi, tadka ladle, whisk, tongs, rolling pin, teaspoon, jug, pestle, grater, racquet, drumstick, umbrella, brush, mehndi cone, camera and so on.
- **Estimate:** about 130 hand images. At the pipeline's rates that's about $10–$25, including rejected images being redone. One overnight run.

### 1.5 Generation order

1. **Reference hand.** One right hand, top-down, with the embroidered cuff. Zafar signs it off.
2. **Master set**, top-down poses first (Cook needs them first), then eye level.
3. **The code check.** Drop the hands into two stations (roll and tawa) and check that the grips line up with the tools.
4. **Reskins:** girl, girl Eid, then Nani's set.
5. **Contact sheets** reviewed by Claude against the visual QA checklist (camera angle, scale, clean alpha, cuff consistent). Rejected images go back into the queue.

---

## 2. Ingredients and props (to be written)

The Cook with Nani asset matrix goes here: each item's views (a front view for shelves and the bazaar, top-down for stations) and states (whole, chopped, cooked, burnt). **It's shared with Find it**: the bazaar sells the same items, drawn in the same front view.
