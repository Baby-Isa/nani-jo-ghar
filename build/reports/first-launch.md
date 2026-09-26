# First launch: the character, chai for Nani, the Eid story

Branch `claude/first-launch`. Decisions: `docs/first-launch-build-log.md`. API: `docs/shared-api.md` §13.

## The flow
A player without `firstDone` goes to `first.html` (`FIRST` in `js/home.js`). The scenes are data, played by `js/shared/story.js`:
1. **Make your character.** It's big on the left; picture tabs and swatches on the right (boy/girl, skin, hair, eyes, top, trousers); a big ✓.
2. **The courtyard:** Nani asks for the chai things.
3. **Cook's pantry round:** chai, dudh, khun.
4. **Her kitchen:** *Tu muke chai banai dinda?* (Mum's clip).
5. **Cook's chai round:** one cup, Nani's, level 1.
6. **Nani sips:** *Shabash!* (Mum's clip).
7. **Four Eid panels:** the calendar and moon, the family coming, the empty pots, "Can you help me cook?".
8. **Yes / No:** No runs away, Nani laughs; Yes gives *Ha!*, then home.

Every line is a read-along card (English, then Kutchi) with a speaker. The home badge, the picker and the grown-ups panel show the character. **Story help** (grown-ups): English then Kutchi, or Kutchi only.

Screenshots: `build/reports/first-launch/phone.jpg`, `ipad.jpg`, `laptop.jpg`.

## Data
- **`data/character-options.json`:** categories of swatches (colours, or variants with the Cook `hands` skin) and layers (SVGs in `assets/character/`). A new category is an entry plus layers.
- **Save:** `character` holds `{v, choices, hands}`. `story` holds `{"first-launch": {at}}`, so a reload resumes the scene. `Save.setting("storyHelp")` is per device.
- **`data/story/first-launch.json`:** `lines` (`en`, `kutchi`, `placeholder`, `clip`, `note`) and `scenes`.
- **Cook hooks:** `cook.html?app=1&first=pantry|chai&then=<page>`, plus `Cook.startDay`. No mechanics or levels changed.

## Tests: all pass
- `test_first_launch.py` at phone, iPad and laptop: the whole flow, two mid-flow reloads, a second player's own character, and Kutchi only.
- `test_shell.py` at all three sizes, now through the new first launch.
- Cook's lab test.
- The Node tests, including the new `test_shared_character.mjs`.

## Needs Mum or real art
- **Placeholder Kutchi:** the pantry request and the four Eid lines. Also "Mmm, lovely chai! Shabash, beta", the child's "Ha", and "Come, let's go to the kitchen".
- **Art:** the layered character, the four panels, and Nani's laugh, sip and point moods (her moods are all one picture now).

## Left
- Cook doesn't read the saved hands yet (`claude/cook-hands` isn't merged here).
- No way to edit a character after it's made.
- The chai station's fun pass.
- A speaking moment for *Ha*.
- The read-along lights whole lines, not single words.
