# Prototypes: Sewing with Big Ma (2 Nov 2026)

Built overnight to `build/reports/proto-brief-2026-11-02.md`: rapid, laptop 1280x665, minimal checks. The design is
`build/reports/designs/sewing.md` and its critique, plus the sewing section of `games-at-a-glance-2026-11-01.md`. The parked
Dress up mode (`dress.html`, `js/dress/`) is untouched.

**Where it lives:** `js/sewing-proto/` (`kit.js` is the school kit copied with `sw-` classes and a new track; `cloth.js` holds the
flat SVG clothes; `art.js` lists the placeholder pictures; then `stall.js`, `make.js`, `mend.js` and `fit.js`). The rest:
- `css/sewing-proto.css`
- `mode=sewing-proto`
- a "Sewing prototypes (Big Ma; 2 Nov)" section in `labs.html`, through `build/gen_labs.mjs`
- `data/sewing-proto.json`, read by `build/lang/import_modes.mjs`
- `build/tools/review/leak-configs/sewing-proto.json` and a stub `leak-games/sewing-proto.mjs`, marked knownFail
- one placeholder cut: `assets/sewing-proto/bigma-face.webp`, the head of the clinic's rough clay Big Ma

**I re-ran `node build/lang/import_all.mjs`** (0 errors, 0 warnings). Two small changes to `import_modes.mjs`:
- it now reads `data/sewing-proto.json`;
- a placeholder word can now give its part of speech (`"pos": "A"`), so long, short and torn work as describing words. Before,
  only names in the colour and size list could be describing words. No other mode's data uses `pos`, so nothing else changes.

**The pattern in every game:**
- Whoever asks is in the helper's box and says one instruction at a time:
  - Big Ma at the stall;
  - Ali when you make, and at the fitting at L1-L2;
  - Nana when you mend;
  - Big Ma at the fitting from L3.
- Under them are the shared word tiles (`js/shared/word-tiles.js`). There is a tile for every thing in the scene, asked for or not.
- A tile's word is the cloth or kurta with its colour or size, with the word it teaches underlined (*lilo [cloth]*). The engine
  can't say a bare *lilo* or *wadho*: those words change their ending to match, so they need a noun.
- A wrong tap wobbles, nothing is removed, and the ask is said again.
- Steps tick the moment they're right; a count ticks at its number and an extra one doesn't land.
- **The track** (`F.track`, new in the kit) is one drag along a lit dashed line. It works the scissors, the machine and the
  needle. It only moves forward, keeps its progress if you let go, and never decides anything.
- Colours come only from tokens. I added `--njg-proto-cloth-*`, paper, machine, metal, awning, mirror and trousers to
  `css/shared/tokens.css`.
- All clothes are modest: long sleeves to the wrist, loose, the hem to the knee or the hip. "Short" is the hem, never the sleeve.

## The games

### 1. The cloth stall: `lab.html?mode=sewing-proto&game=stall&level=1`
**How it plays:**
- Big Ma tells the seller: "Muke laal [cloth] khape." Tap the bolt and it flops open across the counter, with a thump and a
  puff of lint.
- From L2 the seller holds up a big piece and a small one. Big Ma says "Wadho ginech" (a family line), and you tap that piece.
- The piece flies into her bag with a clink. At the end she pays ("Here's the money", to record).
- Bolts stay on the counter, so the second buy is never forced.

**Levels (all four built):**

| Level | What it adds |
|---|---|
| L1 | Red or green (both recorded), from two bolts. |
| L2 | Then the big or the small piece; three bolts. |
| L3 | One line says both ("Muke laal wadho [cloth] khape"); four bolts. |
| L4 | Two buys in order ("Pela laal [cloth], ne poi lilo [cloth]"), then the sizes; five bolts, with pink beside red. |

**Missing:**
- "Not the red one"
- "For Ali"
- The speaking moment (the seller's "what would you like?")
- Paying with coins
- Simba riding the roll
- Art: the stall, the bolts, Big Ma standing. The shops' shopkeeper stands in for the seller.

### 2. Make: `lab.html?mode=sewing-proto&game=make&level=1`
**How it plays:** the table seen from straight above, with the cloth in the middle, the paper patterns (no labels) on the left,
the machine at the top, the rail on the right, and Big Ma's face watching.
1. Ali says "[Kurta] banai!"
2. Tap the pattern. It slides onto the cloth and the chalk traces round it.
3. From L2 there are two chalk hems the same weight, and he says "[Long] [kurta] kap!" Tap one. The right one lights; a wrong one
   wobbles.
4. Drag the scissors along the lit chalk. The offcut drops.
5. Drag the piece along the seam under the machine. The machine chatters.
6. The garment flies to the rail.

**Levels (all four built):**

| Level | What it adds |
|---|---|
| L1 | A kurta or a cap, from two patterns. |
| L2 | The dupatta pattern joins (*pacheri*, Kutchi); a kurta has a long or short hem. |
| L3 | Three makes, from four patterns (the shawl joins). |
| L4 | After each kurta, its buttons: "Muke trae laal [buttons] khape", from a tin of red and pink buttons, onto five spots. The count ticks at its number. |

**Missing:**
- "Long, not short" (the "no" said last)
- "For Ali"
- Two sleeves
- Simba batting the offcut
- Big Ma's song at the machine
- Big Ma's line "Now sew it" is in the data but not used: the box is Ali's.

### 3. Mend: `lab.html?mode=sewing-proto&game=mend&level=1`
**How it plays:**
- Nana's kurta lies flat. It always shows more faults than he asks for: a torn sleeve (left or right), a button come off, from L2
  a torn pocket, and from L3 a hole.
- He says "My [sleeve] is torn" (all to record). Tap that fault and drag the needle along the lit zig-zag; the tear closes. For
  the button, it hops from the tin onto its spot.
- Each round brings a fresh kurta with its faults in fresh places, so the fault left over is never the next ask.

**Levels (all four built):**

| Level | What it adds |
|---|---|
| L1 | Two faults, one asked. Two rounds. |
| L2 | Three faults. |
| L3 | Four faults, two asked in order ("Pela [hole], ne poi [buttons]" and then his own line). |
| L4 | Both asks are "torn" (the sleeve and the pocket), so the part and the order decide. |

**Missing:**
- "Not the sleeve"
- "Two buttons" (a count)
- The hem too long
- The patch from the scrap tin
- Simba and the loose button
- Other customers
- The sleeve flapping like a windsock (the whole kurta does a small flap instead)

**A gap in the engine:** the "button" placeholder joined the existing word **buttons** (plural). "My button has come off" is
therefore a whole placeholder line, and the button tile doesn't light while Nana says it.

### 4. The fitting: `lab.html?mode=sewing-proto&game=fit&level=1`
**How it plays:**
- Big Ma's room, seen front on. The person stands full length on a low stool in front of the tall mirror. The wall rail is
  beside them, with hanging pieces.
- Tap the piece (it lifts), then tap the person (it swishes on).
- **Right:** "Barabar!" (the engine's *barabar*), a twirl, the camera's flash. The piece goes back on the rail.
- **Wrong:** each kind of mistake has its own gag, held about 1.6 s. Then the piece goes back and the ask is said again.
  - too big: the kurta pools onto the floor, and Big Ma says "Wadho!"
  - too small: it sticks at the chest; "Nindho!"
  - the wrong garment: the cap drops over the eyes, or the dupatta lands over the head like a tent, and they giggle
  - the wrong colour: a puzzled tilt, and the colour he's wearing named
- The garment word is in every line (critique MUST 1).

**Levels (all four built):**

| Level | Who asks | What it adds |
|---|---|---|
| L1 | Ali: "Muke [kurta] khape" | A kurta and a cap in the same colour, so colour can't decide. |
| L2 | Ali | Colour and garment; three on the rail. |
| L3 | Big Ma: "[The] wadho [kurta]. Hi Nana lai ai." | Two people (Ali and Nana); the kurta in two sizes, the cap, a dupatta decoy. |
| L4 | Big Ma | Four kurtas: two colours in each size. |

**Missing:**
- Take off (the empty hanger)
- The photo landing in the book
- The speaking moment ("how do I look?", *bo fine* / *barabar*)
- **Going out** (Nani calls the weather; the shawl or the umbrella). Its words are all to record. I left it for a later pass.
- The opening joke (Ali stuck in his old kurta)
- **A known leak:** the big kurtas are always Nana's, so hearing "Nana" gives the size. The fix needs a size the person can be
  given without it counting as a wrong answer.

## Words and lines still to record (grey English in the games)
- **Words:** kurta, cap, cloth, white, blue, pink, long, short, torn, button / buttons, sleeve, pocket, hole, shawl, clothes,
  colours, sizes.
- **The frames' English:** "The" (*TheX*), "My … is torn", "There's a hole in my …".
- **Lines** (`data/sewing-proto.json`):
  - "Come, let's buy cloth for Ali's kurta."
  - "Here's the money."
  - "Ali has grown! His clothes are small."
  - "Now sew it."
  - "Nana's kurta is torn. Let's mend it."
  - "My {x} is torn."
  - "My button has come off."
  - "There's a hole in my {x}."
  - "Come, try on what we made."
- **Kutchi the games use** (all already in the engine): *laal*, *lilo*, *wadho*, *nindho*, *muke … khape*, *banai*, *kap*,
  *wadho ginech* / *nindho ginech*, *pela … ne poi*, *Nana jo*, *hi … lai ai*, *barabar*, *shabash*, *pacheri*, the numbers.

## Art needed (all placeholders now)
- Big Ma's character sheet: standing, her face, a camera. The rough clay Big Ma and a head cut from it stand in.
- Ali and Nana full length, standing and front on, in a plain undershirt and trousers. Their face crops sit on flat bodies
  for now.
- Worn layers for each person: the kurta (fits, far too long, too small), the cap, the dupatta.
- The cloth stall: an awning, the counter, bolts on end, the seller.
- The top-down table: the sewing machine, the paper patterns, the button tin, the needle and scissors.
- Nana's kurta laid flat, with fault overlays: a tear, a button come off, a torn pocket, a hole.
- The tall mirror in a mirror-work frame, a wall rail with hangers, the stool, Big Ma's cloth bag.
- Simba's paw.

## Checks
- `node --check` passes on every new JS file.
- Lab shots at 1280x665 for every game, several levels each: no errors, nothing spills. The fitting's L1 shot raised one
  SPACING line, from the shared helper card's side-by-side layout, not from my files.
- I drove whole rounds through with a script: the stall at L2 (both buys), make at L4 (the kurta's buttons, then the
  dupatta's seam), mend at L4 (into its second round) and the fitting at L4 (to the end screen).
- The full checks (`build/tools/review/checks.mjs`): see the note at the end.
- The leak bot is a knownFail stub, as the school's.
