# Nani jo Ghar — fruit bowl test errand

The single proof-of-concept errand agreed on 23 Sep 2026: Nani needs a
fruit bowl for tonight's guests. Go to the bazaar, buy from a Kutchi-only
list, come home, put everything in the bowl. Rebuilt from scratch after
the first version failed on a real phone — see
`claude/Nani jo Ghar — Roadmap and Story Structure.md` in the project for
the full diagnosis and the decisions this build follows.

## Running it

Any static file server works, e.g. from this folder:

    python3 -m http.server 8000

then open `http://localhost:8000/` on a phone in landscape, or on a
laptop. Tap "Tap to start" first — that's what unlocks audio and requests
fullscreen/landscape on mobile browsers, which can't be done without a
user gesture.

**Play it on GitHub Pages, not the Claude artifact viewer.** The artifact
viewer isn't full screen and its container measurement broke the previous
JS-scaled layout; this build uses a CSS-only responsive stage instead, but
GitHub Pages is still the real test.

## What changed from the first build

Every item here was a specific failure reported after testing the first
version on an actual Android phone:

- **No more JS canvas scaling.** The stage is sized with CSS `min()`
  against the viewport, not a `transform: scale()` computed from a
  measured container — that's what broke on Android.
- **Item positions are measured off the real backgrounds**, not shared
  generic rows. Pantry items sit on the kitchen's actual shelves; bazaar
  items sit in the actual open counter space, clear of the shopkeeper.
- **The shopping list shows Kutchi text and a play button only** — no
  picture, no English by default. English is one tap away per item.
  Showing a picture turned the task into picture-matching with no Kutchi
  required, which was the strongest objection to the first build.
- **No digits anywhere.** The chalkboard and the `have/qty` badges are
  gone. Quantity is taught by tapping once per unit while the Kutchi
  number word for the running count plays and is shown as text.
- **Audio is pre-baked MP3s**, not live `SpeechSynthesis`. Android's
  in-app webview has no Web Speech support at all, which is why the first
  build was silent on the phone but fine on a laptop. `build/build_audio.py`
  generates a placeholder-voice MP3 per line with `espeak-ng` (a Hindi
  voice reading the romanised draft — still a mispronunciation guide, per
  the Technical Plan, not a real Kutchi voice, which doesn't exist for any
  vendor). Dropping in a real family recording later is a file swap at
  `assets/audio/<kind>/<id>.mp3` — no code change, same as before.
- **Glow is a hint, not an announcement.** It no longer fires automatically
  for every new word; it appears after a wrong tap or about five seconds
  of not finding the right item.
- **A word's stage advances on a correct recall**, not on being shown.
  `progress.js`'s `recordMeeting()` now only tracks exposure; a new
  `recordCorrect()` is what moves a word up the stage table.
- **The "recall" step is no longer a full-screen quiz overlay.** Per the
  design principle "the task is the test, no quiz screens", bought items
  now go into a bowl in-scene: a tray of what you just bought sits over
  the (still-visible) kitchen while Nani asks for each one back, and a
  correct tap drops it into the bowl graphic.
- **The chalkboard component is gone entirely** — it didn't do anything
  the recipe-list sidebar doesn't already do better.
- Fixed the stray `?` placeholder text and the blank/grey go-button state
  (the button now always has a label).

## What's still a placeholder

- **The bowl and the parchment sidebar texture are procedurally generated**
  (`build/make_placeholder_art.py`), not commissioned art — there was
  nothing to reuse for either, per the "make up assets for the bowl and
  stuff" instruction. Everything else (characters, fruit) is the existing
  sliced art, untouched.
- **Every line of Kutchi here is a draft** (marked with `*`), sourced from
  the content master's handouts, never invented. Three lines have no
  Kutchi at all yet ("What would you like?", "How many?", "Well done!")
  and are shown in English only — they're never spoken, since the project
  rule is English is text, never voice, in-game.
- **One errand only.** `data/errands.json` defines just `bowl-01`. More
  errands are a content job once the syllabus and story-arc planning
  (next two steps per the Roadmap doc) are done.
- **The quilt patch is a flat colour gradient**, not real patch artwork.
- **The notebook is a plain `alert()`** listing words met and their stage.
- Tested headlessly (`build/test_playwright.py`) and should be tested on
  an actual phone next — that's the whole point of moving this to GitHub
  Pages.

## Files

- `build/build_content.py` — xlsx → `data/content.json`. Never invents
  Kutchi: confirmed → draft-flagged → English-only, in that order.
- `build/build_audio.py` — generates the placeholder MP3s this one errand
  needs via `espeak-ng` + `ffmpeg`.
- `build/make_placeholder_art.py` — generates the bowl and parchment
  texture with PIL.
- `build/prep_assets.py` — downscales sliced art for phone delivery.
- `build/test_playwright.py` — headless click-through, screenshots in
  `build/screenshots/`.
- `data/errands.json` — the one errand, hand-written, kept separate from
  the content spreadsheet as agreed.
- `js/progress.js` — per-word stage, advances on correct recall only.
- `js/audio.js` — plays a file if one exists at
  `assets/audio/<kind>/<id>.mp3`, else falls back to on-device speech
  (kept as a safety net; not exercised by this errand since every line it
  needs is pre-baked).
- `js/app.js` — the game: kitchen ask → bazaar buy → bowl → patch → quilt.
