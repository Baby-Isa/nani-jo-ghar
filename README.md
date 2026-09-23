# Nani jo Ghar — fruit bowl test errand

The single proof-of-concept errand: Nani needs a fruit bowl for tonight's
guests. Go to the bazaar, buy from a Kutchi-only list into the basket you
carry, come home, move everything from your basket into Nani's bowl.

**Playtest 2 (23 Sep 2026)** reshaped the scenes - see
`docs/playtest-2026-09-23.md` for the full findings, decisions and future
ideas, and the "What playtest 2 changed" table below. This is the **Build Brief v3** rebuild: the scene
layer is now a Phaser 3 canvas driven entirely by data, after the first
CSS/DOM version failed on a real phone (overlapping tap targets, floating
fruit, black bars on wide phones — see "What v2 got wrong" below).

## Running it

Any static file server works, e.g. from this folder:

    python3 -m http.server 8000

then open `http://localhost:8000/` on a phone in landscape, or on a
laptop. Tap "Tap to start" first — that unlocks audio and requests
fullscreen/landscape on mobile browsers, which can't be done without a
user gesture.

## Architecture

- **Scene layer = Phaser 3** (vendored at `js/vendor/phaser.min.js`, no
  CDN at runtime). The world is fixed at 1600×900 — the backgrounds' own
  pixel size — scaled with `Phaser.Scale.FIT`, centred on both axes.
- **UI layer = plain HTML/CSS** beside/over the canvas: the recipe
  sidebar, speech bubble (positioned beside whoever is talking),
  narration strip, go button, overlays. A CSS grid (`sidebar | game`),
  sized purely from `aspect-ratio` media queries — no JS measuring. In
  every landscape shape (4:3 and wider) the sidebar is its own column and
  **never sits on top of the game**; wide screens (Flip-style 22:9) get a
  sidebar exactly as wide as the leftover space, so the game is a clean
  16:9. Only screens narrower than 4:3 (portrait tablets) get an
  off-canvas drawer, which never opens by itself mid-task (its tab
  pulses instead) and has a close button.
- **Layers, back to front:** background → character → counter/island
  (hides the character's lower body) → items on shelves/counter (with
  contact shadows) → Nani's bowl (back, fruit, front) → your basket
  (back, fruit, front) → anything in flight. Containers are drawn as a
  back and a front image so their contents sit *inside* them.
- **Scenes are data.** `data/scenes/kitchen.json` and `data/scenes/bazaar.json`
  hold every slot, container and character anchor as background pixel
  coordinates, measured off the real art and verified with
  `build/place_preview.py` (renders a labelled composite PNG per scene —
  look at it before trusting a position). `data/errands.json` only says
  which words go in which slot *pool*; the actual slot assignment is
  shuffled every playthrough, so the correct answer's position is never
  the tell.
- **Every tappable item uses pixel-perfect hit-testing**
  (`setInteractive({ pixelPerfect: true, alphaTolerance: 1 })`), so an
  overlapping transparent bounding box can never steal a tap from the
  item underneath — the exact bug that broke v2's bazaar.
- **Audio** plays through Phaser's sound manager (handles mobile unlock
  on the first tap) and resolves on the `complete` event, not on
  playback start — fixes v2's overlapping lines. `data/audio-manifest.json`
  (from `build/build_audio_manifest.py`) lists which recordings actually
  exist, so the game never probes for a file at runtime — a HEAD 404
  logs a console error even when the JS catches it, which would have
  failed the "no console errors" check. Missing lines fall back to
  on-device speech synthesis reading the romanised Kutchi (never a real
  Kutchi voice — none exists from any vendor).

## What playtest 2 changed

| Symptom | Root cause | Fix |
|---|---|---|
| Two bazaar items hidden behind the sidebar on a 16:10 laptop | At exactly 16:10 the `8/5` min and max aspect queries both matched: the sidebar became an overlay drawer, auto-opened, and its close scrim was forced off | Sidebar is a grid column in all landscape shapes; drawer query (`1332/1000`) can't overlap; drawer never auto-opens over a scene |
| Tests passed anyway | No 16:10 viewport; taps never checked what was on top | 1440×900, 1280×800 and portrait iPad added; every tap asserts the canvas is the topmost element |
| Giant, stacked fruit in Nani's bowl | Pop-in tween went to `scale: 1` (native 260px), overriding the fitted size | Tweens go to the stored fitted scale |
| The bowl never filled; the basket never filled | Fruit was destroyed after flying; the "basket" was a corner counter | Foreground basket + bowl containers; fruit lands and stays |
| Bought 6, only 3 came home | Fill phase used unique words | Every bought item comes home in your basket |
| No quantities anywhere | List showed the word only; Nani always used the singular line | "2 × santra" with dots; Nani uses the sourced plural line + recording when qty > 1 |
| Pear qty 3 but its line says "bo" (two) | Data mismatch | Pear qty is now 2 - never compose Kutchi to fit a number |
| Pear poking out of the tray | Width-only sizing | Every item fits a max width **and** height |
| Fruit floating on shelves | No contact, baseline on the edge line | Soft contact shadow, item sunk 3px, baselines on the plank's top edge |
| Characters pasted on, static | Cropped by the frame edge; one pose swap per line | Stand behind a counter/island; breathing; mouth moves while a line plays (only the mouth - see `build/make_scene_art.py`); cheer pose; slight tilt |
| Characters barely talk | Recorded lines unused | Shopkeeper greets back, counts, says "Ghan", "Arre re!" on a wrong tap, "Aabhar aanjo", "Achija" |
| Unreadable gold caption on the awning | Faint band at the top | Speech bubble beside the speaker; narration in a solid strip |
| Painted tomatoes/chillies next to tappable fruit | Background art | Cloned off the counter (`bg-bazaar-stall-v3.jpg`) |
| Greyed "…" button looked broken | Disabled button still shown | Hidden until usable |

## What v2 got wrong (fixed in the Phaser rebuild)

| Symptom | Root cause | Fix |
|---|---|---|
| Nothing tappable in the shop | Front-row item boxes overlapped the back row; taps landed on a decoy's transparent box | Pixel-perfect hit-testing per sprite |
| Fruit floating on the wall | Positions guessed as CSS percentages | Positions measured off the real art, verified with `place_preview.py` |
| Dashed squares as "gaps" | Placeholder CSS | Real silhouettes: the fruit's own shape, tinted and dimmed |
| Characters floating | Full-body sprites standing mid-scene | Waist-up framing: baseline placed below the world's bottom edge, cropped by the frame |
| Black bars on wide phones | Sidebar sat inside the 16:9 stage | Sidebar sits beside the game area in a CSS grid, sized from aspect ratio |
| Basket count stuck at 0 | No code ever updated it | It updates on every correct bazaar tap |
| Lines talking over each other | Audio resolved when playback *started* | Resolves on the `complete` event |

## What's still a placeholder

- **Scene art made from existing art** (`build/make_scene_art.py`): the
  kitchen island is tiled from the bazaar counter's planks, your basket is
  cut out of the basket painted on the bazaar counter (upscaled, so a
  little soft), the brass bowl is procedural. Good enough to test the
  mechanic; commission proper art for these.
- **Mouth movement uses the talking pose's mouth only.** Blinks and extra
  mouth shapes are planned via a ChatGPT eyes-closed pose + LivePortrait
  (see the playtest doc). `assets/items/bowl-empty.png` and
  `build/make_placeholder_art.py` are from v3 and no longer used by the
  game except for the parchment texture.
- **Every line of Kutchi here is a draft** (marked with `*`), sourced
  from the content master's handouts, never invented. A few lines have
  no Kutchi at all yet ("What would you like?", "Well done!") and are
  shown in English only — never spoken, since English is text, never
  voice, in-game.
- **One errand only.** `data/errands.json` defines just `bowl-01`.
- **The quilt patch is a flat colour gradient**, not real patch artwork.
- **The notebook is a plain overlay list**, not a designed page.
- **A wrong tap gets a wiggle and a spoken "Arre re!"**, but that line
  has no recording yet, so it's the on-device speech-synthesis fallback.

## Files

- `build/build_content.py` — xlsx → `data/content.json`. Never invents
  Kutchi: confirmed → draft-flagged → English-only, in that order.
- `build/build_audio.py` — generates placeholder MP3s via `espeak-ng`.
- `build/build_audio_manifest.py` — scans `assets/audio/` and writes
  `data/audio-manifest.json`, so the game knows what exists without
  probing at runtime. Re-run after adding/removing an audio file.
- `build/make_placeholder_art.py` — the parchment texture (PIL).
- `build/make_scene_art.py` — the playtest-2 scene art, all derived from
  existing art: cleaned bazaar background, kitchen island, basket
  back/front, brass bowl back/front, each character's mouth frame and
  head-aligned happy pose. Needs Pillow + numpy.
- `build/place_preview.py` — renders `build/previews/<scene>.png` with
  every layer in game order (character behind the counter, occluder,
  slots with shadows, bowl and basket with sample contents, bubble box).
  Run this after touching any `data/scenes/*.json`.
- `build/test_e2e.py` — Playwright, six viewports (Flip 5 landscape,
  1366×768, 1440×900, 1280×800, iPad landscape and portrait). Plays the
  whole errand, including a wrong tap in the bazaar and at the bowl.
  Taps a visible, opaque, uncovered pixel of each sprite via
  `window.__njg.debugItems()`, and asserts nothing in the page covers
  it. Checks basket and bowl contents. Screenshots every step to
  `build/screenshots/<viewport>/`.
- `data/scenes/*.json` — per scene, in background pixels: character
  (behind the counter), occluder, speech-bubble anchor, bowl/basket with
  their inside spots, stall/shelf slots (max width and height), ambient
  effects.
- `assets/scene/` — island, basket and bowl layers (generated).
- `data/errands.json` — the one errand: which words, which slot pools,
  the reward patch.
- `data/audio-manifest.json` — generated; which recordings exist.
- `js/data.js` — loads content, errands, scenes, the audio manifest.
- `js/progress.js` — per-word stage, advances on correct recall only.
- `js/audio.js` — plays a recording through Phaser's sound manager if
  one exists, else falls back to on-device speech synthesis.
- `js/ui.js` — the HTML/CSS UI layer: sidebar list with quantities,
  speech bubble, narration, overlays, quilt.
- `js/game.js` — the Phaser scenes: kitchen intro → bazaar → bowl fill
  → patch/quilt. Also the Container (basket/bowl) and Character
  (behind-counter, breathing, talking) classes.
- `js/vendor/phaser.min.js` — vendored, no CDN at runtime.
