# Nani jo Ghar — fruit bowl test errand

The single proof-of-concept errand: Nani needs a fruit bowl for tonight's
guests. Go to the bazaar, buy from a Kutchi-only list, come home, put
everything in the bowl. This is the **Build Brief v3** rebuild: the scene
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
  sidebar, caption band, go button, overlays. A CSS grid (`sidebar |
  game`), sized purely from `aspect-ratio` media queries — no JS
  measuring. Wide screens (Flip-style 22:9) get a sidebar exactly as wide
  as the leftover space, so the game area is a clean 16:9 with no
  letterbox. Narrow screens (iPad 4:3, portrait) get an off-canvas
  drawer instead of a squeezed sidebar; it auto-opens as soon as a word
  is added to the list.
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

## What v2 got wrong (fixed in this rebuild)

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

- **The bowl and the parchment sidebar/tray texture are procedurally
  generated** (`build/make_placeholder_art.py`), not commissioned art.
  Everything else (characters, fruit, backgrounds) is the existing art,
  untouched.
- **Every line of Kutchi here is a draft** (marked with `*`), sourced
  from the content master's handouts, never invented. A few lines have
  no Kutchi at all yet ("What would you like?", "Well done!") and are
  shown in English only — never spoken, since English is text, never
  voice, in-game.
- **One errand only.** `data/errands.json` defines just `bowl-01`.
- **The quilt patch is a flat colour gradient**, not real patch artwork.
- **The notebook is a plain overlay list**, not a designed page.
- **No sound effect for a wrong tap** — just the visual wiggle. A
  procedural "nope" tone would need synthesizing; out of scope for this
  pass.

## Files

- `build/build_content.py` — xlsx → `data/content.json`. Never invents
  Kutchi: confirmed → draft-flagged → English-only, in that order.
- `build/build_audio.py` — generates placeholder MP3s via `espeak-ng`.
- `build/build_audio_manifest.py` — scans `assets/audio/` and writes
  `data/audio-manifest.json`, so the game knows what exists without
  probing at runtime. Re-run after adding/removing an audio file.
- `build/make_placeholder_art.py` — the bowl and parchment texture (PIL).
- `build/place_preview.py` — renders `build/previews/<scene>.png`: every
  slot filled with a sample fruit, baselines drawn in red, labelled.
  Run this after touching any `data/scenes/*.json`.
- `build/test_e2e.py` — Playwright, three viewports (Flip 5 landscape,
  laptop, iPad), taps the actual screen-space coordinates of opaque
  sprite pixels via `window.__njg.debugItems()`, never element centres.
  Screenshots every step to `build/screenshots/<viewport>/`.
- `data/scenes/*.json` — slot, container and character positions per
  scene, in background pixels.
- `data/errands.json` — the one errand: which words, which slot pools,
  the reward patch.
- `data/audio-manifest.json` — generated; which recordings exist.
- `js/data.js` — loads content, errands, scenes, the audio manifest.
- `js/progress.js` — per-word stage, advances on correct recall only.
- `js/audio.js` — plays a recording through Phaser's sound manager if
  one exists, else falls back to on-device speech synthesis.
- `js/ui.js` — the HTML/CSS UI layer: sidebar, caption, overlays, quilt.
- `js/game.js` — the Phaser scenes: kitchen intro → bazaar → bowl fill
  → patch/quilt.
- `js/vendor/phaser.min.js` — vendored, no CDN at runtime.
