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

**Guarding against drift:** a script compares each reskin's outline with the master's. It rejects the image if the hand shape has moved, because otherwise the tools won't sit in the grip.

**Skin tone (Zafar, 24 Sept):** one tone for now, Zafar's own — a light brown, a little more brown than beige, just past the generic game skin tone; hex range in the Art Bible, section 2. No skin-tone variants for now.

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

---

## 3. The cats (Zafar's two cats, 24 Sept)

**Simba** (the big brother, 5, black Russian Blue) and **Zazu** (the little brother, 1, grey Russian Blue). Both have **green eyes**. Their size and proportions tell them apart: Simba a big adult cat, **Zazu drawn as a kitten** (bigger head and eyes, shorter legs, fluffier), which also makes them good "describe the cat" clues (big/small, dark/light, old/young).

**Role:** recurring mischief-makers and part of the house's life. They're introduced in a story beat (e.g. the sweets go missing) and then show up across modes.

| Where | What the cats do | The Kutchi it drives |
|---|---|---|
| **Hub and scenes** | Asleep in a sunbeam, washing, tail flicking on the floor or a windowsill; tap to pet (purr) | Ambient; later "come here", the cats' own words |
| **Cook with Nani** | A scripted mischief event: a cat steals an ingredient and Nani says where it went ("on the shelf", "under the table") | Positions, nouns |
| **Who did it?** | Suspects in "who ate the sweets?": the clues describe them (colour, big/small, tail, where they were) | Describing, past tense |
| **Find it** | Hidden somewhere in a busy scene; find the cat and what it took | Positions |
| **Tidy up** | Knocked everything over; put it back where Nani says | Positions, rules |
| **Monsoon rush** | Get the cats inside before the rain | Rooms, positions |
| **Snap** | "Take a photo of the cat asleep on the chair" | Describing |
| **Care ritual** (optional) | Feed them each day: *bo* scoops for one, *hikdo* for the other | Numbers, names, kinship-style "whose bowl?" |

**Rules:** a cat never covers a tap target and never blocks play at random. Mischief is a scripted event with its own moment; otherwise the cats live on the floor layer and in the margins.

**Art:** one character sheet per cat (turnaround, sitting, lying, sleeping curled, walking, pouncing, eating, guilty face, carrying something in the mouth), made from Zafar's photos with the game's style reference. **The tail and head are separate layers** so code can flick the tail, turn the head, blink and breathe (sleeping cats rise and fall). About 15 images per cat.

**Needs from Zafar:** 4–6 photos of each (both sides, the face, the tail, a typical pose). Keep the photos out of the public repo (a git-ignored `sources/private/` folder, or upload them straight into the chat).

## 4. Making scenes feel alive (ambient motion)

**Rule for every background from now on: anything that should move is its own layer with a pivot point**, not painted into the background. Code does the motion (a gentle sine sway, flicker, particles), so the art cost is mostly just separating the layers.

| Motion | Art needed | Done in code |
|---|---|---|
| Bunting swaying (Eid) | Each flag its own small sprite on a string sprite | Per-flag sway with an offset, a gust every so often |
| Curtain in a breeze | Curtain as a separate layer | A slow skew/wave |
| Ceiling fan | The blades as a separate sprite | Rotation |
| Steam (chai, daal, rain on a hot road) | One soft wisp sprite | Particles |
| Flames on the hob | Already drawn in code | Flicker |
| Dust in a sunbeam | One soft dot | Drifting particles in the light shaft |
| Plants, leaf shadows on the wall | Plant and leaf-shadow layers | Sway |
| Washing line, a kite through the window | Each item a sprite | Sway, a kite bobbing |
| Birds on the windowsill or wire (pigeons, sparrows) | 3–4 poses (sit, peck, hop, fly off) | Occasional hop; fly off when tapped |
| Kasuku, the parrot (African grey, windowsill or a perch — hub, doorway, kitchen) | Pose set: perched, head tilt, beak open "talking", wings flapping, walking along the perch. Head a separate layer | Idle tilts and the odd "talking" beat when it repeats a word (behaviour: `docs/Nani jo Ghar — Cast.md`); never during a task |
| Lanterns and fairy lights (Eid) | Lantern sprite; one light-dot sprite | Glow pulse, twinkle |
| Clock | Hands as separate sprites | Ticking |
| Rain on the window, drips (Monsoon) | Drop and streak sprites | Particles |
| Cats, Nani | See section 3; Nani's breathing and blinking already exist | Breathing, blinking, tail flicks |

Keep it subtle: 2–4 moving things per scene, never near a tap target, and switched off by the "reduce motion" setting.

## 5. Nani and the cats from real life (Zafar, 24 Sept)

**It works, and it won't hurt the style if it's done in the right order:**
1. Photos plus the style reference go in, and out comes a **character sheet** in the game's 3D-film style (turnaround and expressions). The likeness lives in the features that survive stylising: face shape, glasses, hair, the headscarf and its colours, a cat's coat pattern and eye colour.
2. Zafar signs off the sheet.
3. **Every later pose is generated from the sheet, never from the photos again.** That keeps Nani looking the same across hundreds of images.

**Cost:** the current Nani images (poses, talking frames, the LivePortrait test) were made from a generated Nani, so moving to Mum's likeness means redoing Nani's set. Decide before the asset run, not after it.

**Consent:** Mum has agreed (24 Sept 2026), which matters especially once the game is shared with other communities.

## 6. Set dressing: East African and Kutch objects

**Restraint rule (decided with the family, 24 Sept 2026): at most 1–2 cultural nods per scene**, rotated between scenes and visits rather than all shown at once, introduced gradually, never clutter. Zafar's wife: "don't do too much, it will look old again" — the game is modern-looking with hints and nods, not a caricature. See also the Art Bible, section 1. Object first, then a one-line description of how it looks, then which scenes it suits.

### East Africa — chosen (24 Sept 2026)

| Object | How it looks | Suits |
|---|---|---|
| **Tandoor** | Large clay oven, wide mouth, set into a low brick surround | **Background only**, somewhere in the yard. Replaces the charcoal jiko stove (removed) |
| **Vacuum flask of chai** | Tall metal or patterned plastic flask with a cup-lid | Hub, guests arriving, the dastarkhwan |
| **Blue-rimmed enamel mugs and plates** | White enamel with a speckled dark-blue rim and edge chips | Dastarkhwan, kitchen shelves, yard meals |
| **Kanga cloth** | Bright block-printed cotton, bold border, folded stacks or worn as a wrap | Market stalls, washing line, Ma or a guest's dress |
| **Woven mkeka mat** | Flat plaited palm-leaf mat, natural tan with a simple woven pattern | Floor seating, dastarkhwan, yard |
| **Mbuzi, the coconut-grater stool** | Low wooden stool with a curved serrated blade fixed at one end, sat astride to grate | Kitchen background, a cook-along beat |
| **Carved Swahili-style door** | Dark wood, deep geometric and floral relief carving, brass studs | Bazaar or hub exterior establishing shot |
| **Woven baskets (kiondo)** — the family's own suggestion | Tightly coiled woven fibre, rounded body, often a leather or cloth trim and carry strap | Bazaar (Find it), hub shelves, carried by shoppers |
| **Three-legged wooden stool (kigoda)** — the family's own suggestion | Low, round-topped, three splayed legs, plain turned wood | Hub, kitchen, yard, bazaar stalls |
| **Short straw broom (ufagio)** — the family's own suggestion | A tight bunch of stiff grass or straw bound at the top into a handle, no long shaft; used bent over | Yard, tidy-up scenes, propped by a doorway |
| **Panga (machete)** — the family's own suggestion | A long, broad steel blade with a plain wooden handle | **Tool only, hanging**, on a hook in the yard or a store; never handled, since it's a children's game |

**Not now** (suggestions the family didn't pick; drop unless a later scene calls for one): brass coffee pot, kerosene lamp, tin trunk, transistor radio, mosquito net, crate of soda bottles, sugarcane, mango tree, Maasai shuka blanket.

### Kutch — suggestions, same restraint rule

Not yet chosen; a list to work from.

| Object | How it looks | Suits |
|---|---|---|
| Mirror-work cushions (abhla) | Embroidered cotton with small round mirror discs stitched in, bright thread borders | Hub seating, dastarkhwan, bedroom |
| Bandhani cloth | Tie-dyed fine cotton or silk, small dot patterns in bright colours on a deep ground | Dupattas, cushion covers, folded stacks on a shelf |
| Brass and copper vessels | Hand-hammered pots and lotas, warm gold and reddish sheen, dented and polished | Kitchen shelves, serving, the courtyard |
| Charpai | Low wooden frame strung with woven rope or webbing in a criss-cross pattern | Yard or courtyard seating, an outdoor nap spot |
| Clay water pots (matka) | Rounded unglazed terracotta, a narrow neck, sometimes on a stand or ring | Kitchen, yard, bazaar |
| Rogan-painted cloth | Fine, raised, glossy castor-paint scrollwork in bright colour on dark cloth | A framed wall piece, a special cushion or cloth |
| Carved wooden chest | Dark wood, brass corner fittings and studs, sometimes a domed lid | Bedroom, storage, the wedding arc (dowry chest) |

## 7. Big Ma's room (new scene, decided 24 Sept 2026)

Replaces the tailor's shop in "The spill" (Roadmap, Arc 1). Big Ma is the family's seamstress: instead of a shop, the player goes to her room to get the stained kurta fixed.

- **Background:** a warm, homely room with a **sewing corner** — a sewing machine or basket, thread reels in a small rack or tin, a pin cushion, folded cloth, scissors. Restrained set dressing (section 6's rule: 1–2 nods, not more).
- **Character sheet:** Big Ma, real-life likeness (Art Bible, section 6; `docs/Nani jo Ghar — Cast.md`). Sheet-first rule: photos in, character sheet out, Zafar signs off, every later pose from the sheet.
- **Audio:** she **sings a song while she sews** — a new audio asset, recorded by Zafar's wife, alongside the family's other spoken-word recordings.
