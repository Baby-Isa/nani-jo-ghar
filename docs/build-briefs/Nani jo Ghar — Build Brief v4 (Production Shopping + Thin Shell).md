# Nani jo Ghar: Build Brief v4 (production Shopping + thin shell)

**Run with:** Sonnet, medium effort, in a **Claude Code** session with the repo `Baby-Isa/nani-jo-ghar` attached as the session's repository.
**Written:** 23 Sep 2026, after playtest 2 of Build Brief v3.
**Read first:** `README.md`, the playtest review (23 Sept 2026) in the repo, and in the project docs: Roadmap and Story Structure (layout contract v2, thin shell spec, "How the story is told"), Chapter 1 Art Prompts (the kitchen v3 review table), and the Technical Plan (data model).
**Scope:** turn the fruit-bowl errand (`bowl-01`) into production quality, and wrap it in the thin game shell: profiles, saving, hub, quilt, settings. This is phase 2 of the Roadmap. Cook-along and Put it there (Chapter 1's other two errands) are separate briefs.

---

## 0. Rules

1. **Never author Kutchi.** Use only `data/content.json`, keeping the `*` draft marks. A story line with no Kutchi yet shows its English gist caption only, with no audio, and is listed in the "lines needing the family" report (section 7).
2. **Nothing leaves the device.** No network calls at runtime, no CDN, no analytics, no accounts.
3. **Positions come from scene JSON**, checked with `build/place_preview.py`. Never nudge CSS.
4. **New art arrives in stages.** Kitchen v3 (`bg-nani-kitchen-v3.png`) is kept and used now. Everything else is built against the current art; when new backgrounds or props land (see Chapter 1 Art Prompts), swapping them in must only mean replacing files and re-measuring scene JSON, never changing code.
5. Not done until section 8 passes and you have looked at every screenshot yourself.

---

## 1. Basket angle test (do this first, report before the rest)

The playtest confirmed the foreground basket as a core mechanic. The new art will draw the basket from slightly above, but the fruit sprites are drawn straight on. Check whether that looks right before any new art is generated.

- Build `lab/basket-angle.html`: the current basket, then the same basket skewed to a top-down view (vertical squash to ~70% plus a slight perspective on the rim), each holding 2, 6 and 10 fruit in preset spots, turned ±8°, overlapping.
- Screenshot at 915×375 and 1440×900 into `lab/review/basket-angle/`.
- Report to Zafar: does 10 fruit stay recognisable, and do straight-on sprites look right in the top-down basket? Recommend one of: keep the angle; soften the angle in the containers prompt; or items need a top-down variant.

## 2. Thin shell

Build to the thin shell spec in the Roadmap. Specifics:

### 2.1 Files

- `js/storage.js`: the only module that touches storage. IndexedDB, one object store `profiles`, one record per profile. Exposes `listProfiles()`, `getProfile(id)`, `saveProfile(p)`, `deleteProfile(id)`, `isAvailable()`. Calls `navigator.storage.persist()` on first profile creation.
- `js/shell.js`: launch flow, profile picker, create profile, hub, settings, leave-errand.
- `js/progress.js`: kept, but reads and writes through `storage.js` instead of localStorage, and gains `produce_stage` (always ≤ `understand_stage`; nothing in this errand raises it yet, it just has to exist and persist).

### 2.2 Profile record

```json
{
  "schema_version": 1,
  "id": "p_…",
  "name": "Isa",
  "avatar": "avatar-03",
  "reads": false,
  "writes": false,
  "words": { "fru-04": { "understand_stage": 2, "produce_stage": 1, "last_seen": "2026-09-24T10:00:00Z", "recent_misses": 0 } },
  "errands_done": ["bowl-01"],
  "patches": [{ "errand_id": "bowl-01", "motif": "fruit" }],
  "in_progress": { "errand_id": "bowl-01", "phase": "shop" },
  "hub_dressing": ["lantern"],
  "settings": { "volume": 0.8 }
}
```

`hub_dressing` records which Eid decorations the hub shows (section 4).

### 2.3 Launch flow

Tap to start (kept) → profile picker → hub → "Nani needs you" → errand → patch overlay → hub.

- **Profile picker:** up to 6 large avatar tiles with names, plus "+". With one profile, still show the picker (it's one tap and makes adding a cousin obvious).
- **Create profile:** name (text field, typed by an adult), avatar from 8 placeholder avatars (simple coloured initials circles until generated art exists), "Can read" and "Can type" toggles, both off by default. Neither is described as a difficulty setting anywhere.
- **Hub:** kitchen v3, Nani behind the island, the **quilt draped over the island front** (the current quilt drawn as a cloth panel hanging over the island's front edge, at the scene JSON's `quilt_spot`), Eid decorations on the top shelf per `hub_dressing`, and one lit button "Nani needs you" leading to the next errand. No carried basket in the hub. For now there is only one errand, so after it's done the button replays it.
- **Quilt:** tap it to open the existing quilt overlay; tap a patch to replay its errand. The quilt is hidden during errands (the basket takes the island front).
- **Leave an errand:** a home tab in the sidebar rail, one-tap confirm, back to the hub. Word progress already earned stays; the errand restarts from its beginning next time.
- **Settings:** a small cog in the hub, opened by pressing and holding for 3 seconds (an on-screen ring fills while held). Volume, rename profile, delete profile (with confirm), reset this profile's progress (with confirm).
- **Storage unavailable** (private browsing): the game still plays with a temporary profile, and the picker shows one gentle line: "Progress won't be saved on this device."

### 2.4 When to save

| Data | Saved when |
| --- | --- |
| Profile fields | On create or edit |
| Word progress | Every time a word's stage changes |
| `errands_done`, `patches`, `hub_dressing` | At the patch overlay |
| `in_progress` | At each phase boundary (kitchen intro, bazaar, home) |
| Settings | On change |

## 3. Production polish for `bowl-01`

Against layout contract v2 in the Roadmap. Most of this was done in playtest 2; verify each and finish what isn't:

- **Swap in kitchen v3** (section 6) for both the errand's kitchen phases and the hub.
- Sidebar always its own column in landscape; drawer only in portrait or very narrow, with a close button, never auto-opening.
- **Letterbox filled** with the scene's dominant colour or a blurred copy of the background, never black bars (visible in the 23 Sep screenshots at 16:10 fullscreen).
- Carried basket: back layer, items, front rim; ≤22% of screen height; sits over the island front, bottom-centre; everything bought stays visible in it and comes home.
- Nani's bowl on the island top: back, items, front rim; the bowl ends holding the 2 pre-exposure fruit plus every bought fruit.
- Speech bubble from the speaker, cream background, dark text, English one tap away inside it.
- Contact shadows on every placed item, sunk ~4px; every item sized to a max width and height box.
- Sidebar buttons hidden until usable.
- Bazaar background: the painted tomatoes and chillies in the right-hand crates are near the tappable row; mask them out as before, or leave a note if the v3 background is imminent. **Note: bazaar stall v3 is now kept and has zero painted produce, so this masking step no longer applies — use v3.**

## 4. Story beats (new)

The story is told through what you see and hear, with Kutchi and an optional English gist caption, never through text you must read. See "How the story is told" in the Roadmap. Implement it as data, so every later errand gets it for free.

### 4.1 Data

Add to each errand in `data/errands.json`:

```json
"intro_beat": { "visual": "hang-lantern", "line_id": "snt-story-01", "gist": "Eid is tomorrow and the guests are coming tonight!" },
"outro_beat": { "visual": "bowl-full-glow", "line_id": "snt-story-02", "gist": "The fruit is ready. Now help me cook dinner." }
```

- `visual` names a small scripted moment from a fixed list implemented in code: `hang-lantern` (hangs from the kitchen's top shelf, the Eid shelf), `add-decoration` (places the next Eid dressing prop on the top shelf), `bowl-full-glow`, `nani-points-door`, `knock-at-door` (sound plus Nani turning to the door). The Eid decorations sheet (`sheet-eid-decorations-v1.png`) is now kept, so these can use real art rather than placeholder props — see its review table in Chapter 1 Art Prompts for which decoration maps to which beat.
- `line_id` points at a sentence in `content.json`. If it has no Kutchi yet, show the gist caption only, with no audio.
- `gist` is the English gist caption, shown small in the speech bubble for readers; it is never spoken.

### 4.2 Behaviour

- A beat lasts 3 to 5 seconds, plays once, and is skippable with a tap anywhere. Replays skip the intro beat automatically.
- Nani does the visual action while speaking (talking frames plus a gesture).
- Nothing in the errand depends on understanding the beat. A non-reader who ignores it still sees the empty bowl and the pantry gaps, and the task explains itself.
- After the patch overlay, the hub shows one more Eid decoration than before (`hub_dressing`), so the house visibly fills up with Eid across the chapter.

### 4.3 `bowl-01` beats

- Intro: `hang-lantern`, then Nani points at the empty bowl on the island. Gist: "Eid is tomorrow and the guests are coming tonight!"
- Outro: `bowl-full-glow`, then Nani pats the stove. Gist: "The fruit is ready. Now help me cook dinner." (This is the hook into Errand 2; for now it leads back to the hub.)

## 5. Content additions

- Add the two story lines above to the content spreadsheet as sentences with English only, Kutchi blank, flagged "needs family". Rebuild `content.json`.
- Do not add any Kutchi for them.

## 6. Kitchen v3 and art swap readiness

**Kitchen v3** (`assets/backgrounds/bg-nani-kitchen-v3.png`): resize to exactly 1600×900, then measure `data/scenes/kitchen.json` from it, following the review table in the Chapter 1 Art Prompts doc:

| Scene JSON block | What to measure |
| --- | --- |
| `eid_shelf` | The **top** shelf. Anchor points for hanging decorations (lantern, crescent, lights) and a line along its front edge for bunting. **No pantry slots here**: items standing on it would be cut off by the frame |
| `pantry` | The **lower three** shelves, ~8 evenly spaced slots each (~24 total), leaving the right end of each shelf clear where Nani's shoulders overlap it |
| `island_top` | Bowl position (Errand 1) and cooking-pot position (Errand 2) |
| `carried_container` | Bottom-centre, over the island front, ≤22% of screen height |
| `quilt_spot` | The island front, hub only |
| `character.nani` | Behind the island, head over the plain wall between the shelf ends and the curtain; lower body hidden by the island |
| `spice_cupboard_tap` | The carved cupboard, top-left |
| `stove` | For the "pats the stove" beat |

- Run `place_preview.py` and look at the preview. **If Nani's red headscarf blends into the red curtain**, add a step to `build/make_scene_art.py` that shifts the curtain region's reds towards indigo; if it reads clearly, leave the curtain alone.
- Put every other scene's slot positions, character anchor and container positions in its scene JSON too, so later v3 backgrounds need only a re-measure. **The spice cupboard v1 and sitting room v1 backgrounds are also now kept** — measure their scene JSON in the same pass if time allows, per their review tables in Chapter 1 Art Prompts, even though their errands (Cook-along, Put it there) are out of scope for this brief.

## 7. Reports to produce

- `build/reports/lines-needing-family.md`: every sentence used by any errand whose Kutchi is blank or draft, with its English and where it's used.
- The basket angle verdict from section 1.
- A note on whether the curtain colour shift was needed, with the before and after preview.

## 8. Verification

### 8.1 Existing e2e, extended (six viewports as before: 915×375, 1366×768, 1440×900, 1280×800, iPad landscape, iPad portrait)

- Full errand from profile creation: tap to start → create profile → hub → errand → patch → hub, tapping visible pixels only, checking nothing covers each tap.
- No black letterbox bars at any viewport (sample the pixels outside the canvas).
- Nothing placed on the kitchen's top shelf except Eid decorations.

### 8.2 Shell tests

- Two profiles: play partway with A, switch to B, play partway, reload. Each profile's word stages and progress are intact and separate.
- Leave mid-errand: stages earned so far are kept; next time the errand restarts at its beginning.
- Complete the errand: patch on the quilt, one more hub decoration, hub button updates.
- Storage unavailable (block IndexedDB in the test): the game plays and shows the notice.
- Settings: hold-to-open works, a short tap does nothing; delete and reset ask for confirmation.

### 8.3 Visual review (you, before pushing)

Per viewport, tick in your final message:
- [ ] Picker, create-profile and hub screens are readable and nothing is clipped
- [ ] The hub reads as Nani's kitchen: quilt over the island front, decorations on the top shelf, Nani clearly visible against the wall
- [ ] Intro and outro beats play, are skippable, and read as a moment rather than a slideshow
- [ ] Basket and bowl contents are visible and recognisable throughout
- [ ] No black bars anywhere
- [ ] Sidebar never covers the game

## 9. Deploy

Commit, push to `main`, wait for Pages, confirm the live `js/shell.js` contains the new code, update `README.md`. Report to Zafar: the link, the tick-list, the basket angle verdict, the curtain note, and the lines-needing-family report.

## 10. Out of scope

Cook-along and Put it there (their own briefs), new art generation, real audio, the notebook, onboarding, Grandparent mode, service worker and offline caching, store packaging.
