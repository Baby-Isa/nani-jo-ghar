**SUPERSEDED — kept for history only. Build Brief v4, in `docs/build-briefs/`, is current. Do not run this one.**

---

# Nani jo Ghar: Build Brief v3 (Phaser rebuild of the fruit-bowl errand)

**Run with:** Sonnet, medium effort, in a **Claude Code** session with the repo `Baby-Isa/nani-jo-ghar` attached as the session's repository (so `git push` works without a token).
**Written by:** Opus, 23 Sep 2026, after diagnosing build v2 on a Galaxy Z Flip 5 and a laptop.
**Scope:** rebuild the scene layer for the ONE existing errand (`bowl-01`). No new content, no new Kutchi, no story work.

---

## 0. Rules you must follow

1. **Never author Kutchi.** Use only what's in `data/content.json`. Keep the `*` draft marks.
2. **Don't invent positions.** Every item, character and container position comes from the scene JSON in section 3, which was verified by rendering composites and inspecting them. If something looks wrong, fix it in the JSON and re-render the preview (section 5). Do not nudge CSS.
3. **No CDN at runtime.** Vendor `phaser.min.js` into `js/vendor/`. Nothing leaves the device: no analytics, no accounts.
4. **You're not done until every check in section 6 passes AND you have looked at every screenshot against the checklist.** "The script ran" is not a pass.
5. Push to `main` only after section 6 passes. Then confirm the live site updated (section 7).

---

## 1. Why v2 failed (don't repeat these)

| Symptom | Root cause |
|---|---|
| Nothing tappable in the shop | Front-row item boxes overlapped the back row. Taps on a target fruit landed on a decoy's transparent box and counted as "wrong". |
| Test said it passed | The test clicked the geometric centre of each box, which happened to miss the overlap. Real fingers tap the visible fruit. |
| Fruit floating on the wall | Positions were guessed as CSS percentages, not measured. |
| Dashed squares as "gaps" | Placeholder CSS, not silhouettes. |
| Characters floating | Full-body sprites standing mid-scene instead of waist-up framing cropped at the bottom edge. |
| Black bars on wide phones, 19% of the painting hidden | The sidebar sat inside the 16:9 stage instead of beside it. |
| Basket count stuck at 0 | No code ever updated it. |
| Lines talking over each other | `NjgAudio.speak()` resolved when playback *started*, not when it *ended*. |

---

## 2. Architecture

### 2.1 Two layers
- **Scene layer = Phaser 3 canvas** (latest 3.x stable, vendored). The world is fixed at **1600×900**, which is the backgrounds' own pixel size. All scene coordinates are background pixels. Scale mode is `Phaser.Scale.FIT`, centred on both axes.
- **UI layer = plain HTML/CSS** beside or over the canvas: the recipe sidebar, the caption band, the go button, the notebook/quilt tabs, and the overlays. This layer is responsive.

### 2.2 Responsive shell (CSS grid, no JS measuring)
```
body: 100dvw × 100dvh, grid
  wide screens (aspect ≥ 1.9, e.g. Flip 22:9):  [sidebar | game]   sidebar width = calc(100dvw - 100dvh*16/9), min 180px
  16:9-ish (1.6 ≤ aspect < 1.9, laptops):       [sidebar | game]   sidebar 20vw, game letterboxes slightly (FIT)
  narrow (aspect < 1.6, iPad 4:3, portrait):    game full width; sidebar becomes a pull-out drawer from the left,
                                                with a visible "Nani's recipe" tab handle; it auto-opens when a word is added
```
Use `@media (min-aspect-ratio: 19/10)` etc. The Phaser parent is the `game` grid cell. Phaser's FIT handles the rest. Fill any letterbox with the scene's dominant colour (a blurred copy of the background is a nice-to-have, not required).
Keep the portrait "turn your phone" overlay for phones in portrait only. Tablets in portrait use the drawer layout.

### 2.3 Input
- Every tappable item: `setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true })`. Only opaque pixels register taps, so overlapping sprites can never steal taps again.
- Give small items a minimum effective hit size of 80×80 world px. If a sprite is smaller, add an invisible hit zone behind it, but never let one item's hit zone overlap another's.

### 2.4 Audio
- Use Phaser's sound manager (`this.load.audio`, `this.sound.play`). It handles mobile unlock on the first tap.
- `speak()` must resolve on the sound's `complete` event (plus a timeout safety net of clip length + 1s).
- Keep the file convention `assets/audio/<kind>/<id>.mp3` so family recordings drop in as file swaps.

### 2.5 Keep
`data/content.json`, `data/errands.json` (updated per section 4), `js/progress.js`, and the quilt localStorage logic.

---

## 3. Scenes are data: the structure we'll mass-produce

Every scene is a JSON file in `data/scenes/<scene-id>.json`. A scene owns its **slots** (places an item can sit) and **character anchor**. Errands only say which item goes in which slot. New scenes later = new background + new scene JSON. No code changes.

Slot fields: `x` = horizontal centre, `baseline` = y of the bottom of the item (where it touches the surface), `w` = display width (height follows the sprite's aspect ratio). Items are drawn with origin `(0.5, 1)`, i.e. bottom-centre, at `(x, baseline)`. Depth = baseline (lower on screen draws in front).

### 3.1 `data/scenes/kitchen.json` (bg-nani-kitchen-v1.jpg)
Surfaces measured by edge detection: upper shelf top y≈205, lower shelf top y≈398, and shelves span x≈190–1108. Existing painted jars occupy the lower shelf at x≈935–1065 and the upper shelf at x≈215–385.
```json
{
  "id": "kitchen",
  "background": "assets/backgrounds/bg-nani-kitchen-v1.jpg",
  "character": { "id": "nani", "x": 1400, "scale": 1.1, "visibleFraction": 0.75 },
  "containers": {
    "bowl": { "image": "assets/items/bowl-empty.png", "x": 430, "baseline": 402, "w": 280,
              "inside": [ { "x": 395, "baseline": 345, "w": 75 }, { "x": 470, "baseline": 345, "w": 65 },
                          { "x": 430, "baseline": 330, "w": 70 }, { "x": 360, "baseline": 350, "w": 65 },
                          { "x": 505, "baseline": 350, "w": 65 } ] }
  },
  "slots": {
    "shelf-low-1": { "x": 640, "baseline": 398, "w": 90 },
    "shelf-low-2": { "x": 745, "baseline": 398, "w": 90 },
    "shelf-low-3": { "x": 850, "baseline": 398, "w": 90 },
    "shelf-high-1": { "x": 560, "baseline": 205, "w": 85 },
    "shelf-high-2": { "x": 670, "baseline": 205, "w": 85 },
    "shelf-high-3": { "x": 780, "baseline": 205, "w": 85 }
  }
}
```
Bowl `inside` positions 1–2 hold the pre-exposure fruit (mango `fru-03`, kiwi `fru-07`). Positions 3–5 receive the bought fruit at the end.

### 3.2 `data/scenes/bazaar.json` (bg-bazaar-stall-v2.jpg)
The counter top runs y≈552–608 and is only deep enough for ONE row. The empty painted crate (x≈175–460) and basket (x≈430–645) on the counter are used as containers. Painted tomatoes sit at x≈635–705, so keep clear of them.
```json
{
  "id": "bazaar",
  "background": "assets/backgrounds/bg-bazaar-stall-v2.jpg",
  "character": { "id": "shopkeeper", "x": 1420, "scale": 1.1, "visibleFraction": 0.75 },
  "slots": {
    "crate-1":   { "x": 265,  "baseline": 555, "w": 100 },
    "crate-2":   { "x": 370,  "baseline": 555, "w": 100 },
    "basket-1":  { "x": 500,  "baseline": 545, "w": 90 },
    "basket-2":  { "x": 585,  "baseline": 545, "w": 90 },
    "counter-1": { "x": 760,  "baseline": 592, "w": 96 },
    "counter-2": { "x": 872,  "baseline": 592, "w": 96 },
    "counter-3": { "x": 984,  "baseline": 592, "w": 96 },
    "counter-4": { "x": 1096, "baseline": 592, "w": 96 }
  }
}
```

### 3.3 Characters
Waist-up framing. Draw the sprite with origin `(0.5, 1)` at `y = 900 + height*(1 - visibleFraction)`, so the bottom 25% is cropped by the frame edge. The character is never interactive and never covers a slot.

---

## 4. Errand config changes (`data/errands.json`)

Replace the row arrays with slot assignments. **Shuffle which slots targets vs decoys land in each play** (seeded from `Date.now()`), so "the targets are always on the counter" never becomes the answer:
```json
"kitchen": { "pre_exposure_in_bowl": ["fru-03", "fru-07"],
             "gaps": { "fru-04": "shelf-low-1", "fru-06": "shelf-low-2", "fru-01": "shelf-low-3" } },
"bazaar":  { "stock": ["fru-04", "fru-06", "fru-01", "fru-02", "fru-13", "fru-15", "fru-16", "fru-09"],
             "slot_pool": ["crate-1", "crate-2", "basket-1", "basket-2", "counter-1", "counter-2", "counter-3", "counter-4"] }
```

---

## 5. Gameplay fixes (same flow as v2, done properly)

1. **Kitchen intro.** The bowl sits on the lower shelf with the mango and kiwi in it. Nani names each one (pre-exposure). The three missing fruit show as **silhouettes** in their shelf slots: the fruit sprite with `setTintFill(0x3c281e)` and alpha 0.35. When Nani asks for an item, its silhouette gently pulses (a scale 1.0↔1.06 tween, not a glow blob). Tapping the silhouette adds the word to the recipe list.
2. **Bazaar.** Tapping a correct item:
   - the fruit hops (tween up 20px and back), then a copy flies to the basket icon (a 400ms tween), and the basket counter increments;
   - the Kutchi number word shows in the caption and plays;
   - at quantity, the stall item dims to alpha 0.4 and the list row gets struck through.
   Wrong item: a clear 3-cycle wiggle (±8px) plus a soft "nope" sound, then the hint pulse on the correct items after 1 wrong tap or 5s idle.
3. **Home: fill the bowl** (in-scene, no overlay panel). The bought fruit appear in a tray strip along the bottom of the scene (a parchment strip, 3 items, above the characters' depth). Nani asks for each by name (carrier line). A correct tap flies the fruit into the next free bowl `inside` position. A wrong tap wiggles.
4. **Finish.** Nani switches to happy, "Well done!" appears (English text only, not spoken), then the patch overlay and quilt as in v2.
5. **Sidebar polish.** Fixed row layout: `[Kutchi word (wraps cleanly)] [play button 36px, never clipped]`, with the "English" toggle under the word. While disabled, the go button reads "Listen to Nani…", never "…".
6. Keep the tap-to-start overlay (it unlocks audio and requests fullscreen + landscape lock).

---

## 6. Verification (mandatory, all automated, all must pass)

### 6.1 `build/place_preview.py` (the placement tool; also used for every future scene)
Renders a PNG per scene: background + every slot filled with a sample fruit + containers + character at its anchor, with a thin red line at each baseline and the slot id as a label. Output goes to `build/previews/<scene>.png`. **Look at each preview** and check: every item rests on a surface (its base within ~6px of the painted surface), no item overlaps another item or painted clutter, and the character's bottom edge is cropped by the frame. If anything is off, fix the scene JSON and re-render. This is how positions get made exact for new scenes: a script proposes surfaces (horizontal-edge detection, as in section 3), the preview gets inspected, and nobody drags anything by hand.

### 6.2 `build/test_e2e.py` (Playwright, three viewports)
Viewports: **Flip 5 landscape 915×375 (touch)**, **laptop 1366×768**, **iPad 1024×768 (touch)**. For each one:
- Play the full errand start to finish **by tapping the screen at the coordinates of an opaque pixel of each target sprite**. Compute them from the sprite's world bounds × the canvas scale + canvas offset; expose a `window.__njg.debugItems()` helper that returns screen-space centres of opaque pixels. **Never click element centres or call handlers directly.**
- Assert: the basket count increments per correct tap; a wrong-item tap doesn't advance the list; the errand reaches the patch overlay; no console errors.
- Assert layout: the canvas is fully visible; the sidebar/drawer doesn't cover any slot's screen rect; the play buttons are fully inside the sidebar (bounding box check); no page-level horizontal scroll.
- Screenshot every step to `build/screenshots/<viewport>/NN_step.png`.

### 6.3 Visual review (you, before pushing)
Open every screenshot and tick this list in your final message, per viewport:
- [ ] Fruit sits on surfaces, nothing floating
- [ ] Silhouettes look like the fruit's shape
- [ ] Characters are waist-up, cropped by the bottom edge
- [ ] Sidebar text is aligned and no button is clipped
- [ ] No black bars on the Flip; the drawer works on the iPad
- [ ] The bowl reads as a bowl on a shelf, with fruit inside it

---

## 7. Deploy

1. Commit with a clear message, then `git push origin main`.
2. GitHub Pages redeploys automatically (Settings → Pages is already set to `main` / root). Wait about 60–90s.
3. Fetch `https://baby-isa.github.io/nani-jo-ghar/js/app.js` (or whichever entry file) and confirm it contains the new code. Then report back to Zafar: "Live, refresh the link", along with the tick-list from 6.3 and the Flip-viewport screenshots.
4. Update `README.md` (remove the stale v2 claims) and the placeholder list.

## 8. Out of scope
New errands, new art, story/syllabus, real audio, notebook redesign (a simple HTML overlay listing the words met is fine instead of `alert()`).
