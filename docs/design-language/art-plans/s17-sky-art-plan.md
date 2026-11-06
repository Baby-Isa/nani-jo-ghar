# Art plan (pack `s17-sky`): the game's skies, redrawn softer, and a small bank

**Written:** 6 Nov 2026, from Zafar's words (6 Nov, about 16:00; ART-56): "I feel the skies could be better - less jarringly
vibrant and more in theme, but still distinct and attractive ... semi photo, semi 3D photorealistic ... a slightly more
sophisticated, refined, elegant, upscale feel ... by ever so slightly muting down the vibrancy of the colours and having the tones
merge and match well ... colours of sunsets, colours of bright blue skies, colours of nightfall ... include them in the art runs."
**Decision 77:** Claude wrote this plan and its block; Zafar runs it; Claude judges, cuts and wires. **ART-29:** one paste block,
every reference already on the branch the block reads. **Run spec:** `build/tools/art/specs/s17-sky.run.yaml`; the block:
`s17-sky-chrome-block.txt`. The look: the art bible's **Skies** section (one Wada combination per time of day).

**Keep the laptop awake for the whole run:** on a Mac, `caffeinate -dims` in Terminal, charger in, lid open; on Windows,
PowerToys Awake on.

## 0. Totals

| Part | What | Images |
|---|---|---|
| A | The anchor: the door's sunny sky (bright day), the look every later sky copies | 1 |
| B | Today's other skies and cards: cloudy, raining, night, the sun card, the farm card's sky, the book's farm spread's sky | 6 |
| C | The bank: each time of day (bright day, golden hour, dusk, night) wide and square | 8 |
| | **Total** | **15 prompts** (about 20 images with redos; about 1 hour 15 minutes with 3 windows) |

## 1. Flaws and uncertainties first

1. **"Muted" can come back grey and dull.** The checks ask for attractive and distinct as well as soft; `artcolour.py`'s sky rule
   has a floor in practice (the time's combination is coloured) and a ceiling (mean chroma 24-30, the brightest 5% at 40-50).
2. **The edits (SE01, SE02) may redraw more than the sky.** The check compares the rest of the picture with the attached one;
   a card whose farmer, animals or house changed is a redo (the farmer is not a real person; nothing here needs Zafar's eye).
3. **Tiling:** the door's sky is also the farm photo game's sky, tiled side by side (`data/farm/photo.json`, tile 3200). The
   anchor asks for edges that join; if the join shows, the cut mirrors and blends 64 px (as the far hills were).
4. **The ride's window sky is code today** (the weather's SVG gradient, `data/day.json` `weather.*.sky`, `art: null`): it takes
   the door's four skies as `art` at wiring; no new picture.
5. **Golden hour and dusk have no game yet** (the bank); story mode's evening and the guests-tonight arc will use them.

## 2. Today's skies and what replaces each

| Picture today | Used by | Time of day | Line |
|---|---|---|---|
| `assets/day/s09b/sky-sunny.webp` | the morning door (sunny), the farm game, the farm photo game (tiled), the pets prototype; the ride window when wired | bright day | SD01 |
| `assets/day/s09b/sky-cloudy.webp` | the door (cloudy), the weather card | bright day, overcast | SD02 |
| `assets/day/s09b/sky-raining.webp` | the door (raining), the weather card | bright day, rain clouds | SD03 |
| `assets/day/s09b/sky-night.webp` | the door (night), the farm at night, tomorrow's card in the book | night | SN01 |
| `assets/day/s12/door-sun.webp` | the door's weather card (sunny) | bright day | SC01 |
| `assets/day/s12/door-farm.webp` | the door's activity card (the farm): only its sky changes | bright day | SE01 |
| `assets/day/s09b/book-farm-spread.webp` | the book's farm page: only its sky changes | bright day | SE02 |

## 3. References (all on the branch; nothing from Zafar)

| Name | Repo path | What it carries |
|---|---|---|
| sky-day.png | `build/tools/art/data/swatches/wada-194.png` | bright day: Olympic Blue, Seashell Pink (Jasper Red only as the faintest warmth, if at all) |
| sky-golden.png | `build/tools/art/data/swatches/wada-209.png` | golden hour: Ivory Buff, Yellow Orange, Salvia Blue |
| sky-dusk.png | `build/tools/art/data/swatches/wada-339.png` | dusk: Ochraceous Salmon, English Red, Light Glaucous Blue, Violet Blue |
| sky-night.png | `build/tools/art/data/swatches/wada-75.png` | night: Pale King's Blue, Violet Blue |
| door-farm-card.png | `sources/art/s12/fm-door-farm-v1.png` | the farm card to edit (SE01) |
| book-farm.png | `sources/art/s09b/k1-book-farm-spread-v1.png` | the book's farm spread to edit (SE02) |
| kept:SD01 | (made in part A) | the sky look every later line copies |

## 4. The prompts

#### SK. A sky, only sky
```
Generate an image, {SIZE}.

Only sky, nothing else: {SCENE}

The look: a softly painted sky in a semi-realistic 3D animated-feature-film style, refined, calm and elegant: gentle gradients from the top of the sky to the horizon, big soft cumulus clouds with warm lit tops and cool, softly shaded undersides, warm atmospheric light and a little haze near the bottom edge. The colours are ever so slightly muted so the tones merge and match well: distinct and attractive, never a flat cartoon blue and never a loud, saturated gradient. {MATCH}

Use the attached colour strip only as the palette: {STRIP_WORDS}, in lighter and darker tones; whites and soft greys are free. Never draw the strip, swatches or any text.

No ground, no hills, no trees, no birds, no buildings, no people: the bottom edge is just sky. No lens flare, no outlines, no rays drawn as lines.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SC. The sun card
```
Generate an image, 1536×1024, landscape.

A sky for a young child's weather card, with ONE BIG SUN as its subject: a round, softly glowing sun whose disc fills about TWO THIRDS of the picture's height, centred a little above the middle, its warm pale glow fading gently into the sky round it. The sun is a plain soft-edged disc: no face, no rays drawn as lines or spikes, no lens flare. Only sky round it: no ground, hills, trees, buildings, birds or people; at most two small soft clouds, near the bottom corners, never in front of the sun.

The look: exactly the attached sky picture's soft painted semi-realistic 3D style, refined and calm, its colours ever so slightly muted so the tones merge. The sun is a warm pale cream glow, never a loud lemon yellow.

Use the attached colour strip only as the palette: {STRIP_WORDS}, in lighter and darker tones; whites and soft greys are free. Never draw the strip, swatches or any text.

Do not add any text, letters, numbers, labels, logos or watermarks.
```

#### SE. A new sky in an existing picture (an edit)
```
Edit the attached picture: change ONLY its sky. Keep everything else exactly as it is, pixel for pixel where you can: {UNCHANGED}. The same size, framing and light direction (from the upper left).

The new sky: {SCENE} Softly painted in the semi-realistic 3D style of the second attached picture (a sky): gentle gradients, soft cumulus with warm lit tops, a little haze at the horizon, colours ever so slightly muted so the tones merge with the rest of the picture.

Use the attached colour strip only as the sky's palette: {STRIP_WORDS}, in lighter and darker tones; whites and soft greys are free. Never draw the strip, swatches or any text.

Do not add any text, letters, numbers, labels, signs, logos or watermarks.
```

## 5. Cut and wire notes

- **Cut:** the skies are full pictures (no key): WebP at the source size, `@2x` never past it. Today's skies replace their files
  in place after Zafar's yes (`sky-sunny`, `-cloudy`, `-raining`, `-night` in `assets/day/s09b/`; `door-sun`, `door-farm` in
  `assets/day/s12/`, cover-cropped to 4:3 as before; `book-farm-spread` in `assets/day/s09b/`); the old ones move to
  `sources/art/s09b/` and `s12/` as `-v1`. The bank goes to a new day folder, sky (made at the cut), as `sky-<time>-wide.webp` and
  `sky-<time>-square.webp` (`<time>`: day, golden, dusk, night): `look-rules.json` `palette.sky` names their time from the name.
- **Judge:** `artjudge.py` (aspect), then `python3 build/tools/art/artcolour.py` on the new sky folder and `assets/day/s09b/sky-*.webp`
  and `assets/day/s12/door-sun.webp` (the sky rule: the time's combination and the ceiling), then a look at the door at the four sizes.
- **Wire (a build session):** `data/day.json` `weather.<w>.sky.art` → the door's four skies (the ride window and tomorrow's card
  then paint the picture, not the SVG gradient); nothing else changes.

## 6. Judging

Every sky: only sky (no ground or birds), the upper LEFT quarter calm (the game puts a speech bubble there), its time's colours
from its strip and no other, soft and attractive rather than loud or grey; then the colour tool's sky rule on every landed
picture. The edits: nothing but the sky changed.
