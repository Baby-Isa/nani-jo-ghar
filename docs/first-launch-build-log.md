# First launch: build log and decisions (26 Sept 2026, branch `claude/first-launch`)

The spec is `docs/first-launch-story.md` ("Character creation", "Zafar's flow", "Decided: English, then Kutchi"). Nobody was available for questions, so these are the defaults taken.

## The flow
`index.html` sends any player without `firstDone` to `first.html?app=1` (`FIRST` in `js/home.js`). The scenes are data (`data/story/first-launch.json`), played by `js/shared/story.js`:

1. **character**: make your character (`js/shared/charmaker.js`);
2. **arrive**: the courtyard; Nani asks for the chai things;
3. **pantry**: Cook's pantry round (`cook.html?app=1&first=pantry&then=…`);
4. **ask-chai**: back in Nani's kitchen, "Can you make me chai?" (Mum's B40 clip);
5. **chai**: Cook's chai round (`&first=chai`): one cup, Nani's, the chai tray at level 1;
6. **sip**: the sitting room, Nani sips (the glass tilts, hearts float), "Shabash!" (Mum's clip);
7. **eid**: four panels (calendar with crescent moon; a thought bubble of the family; the empty pots; "Can you help me cook?");
8. **help**: Yes / No; No runs away, twice, then Nani laughs and it's gone; Yes → the child's "Ha!" → "Shabash! Let's cook!";
9. **end**: `firstDone`, home.

## Decisions
- **Where the character lives:** a new namespace, `character` (`{v, choices, hands, updated}`). Choices are swatch ids, not colours, so the palette can be retuned without breaking saves. `hands` is stored as `player-boy` / `player-girl`. `claude/cook-hands` hasn't landed on this base, so nothing reads it yet.
- **Where the story's place lives:** namespace `story` (`{"first-launch": {at}}`). Resuming: the same scene. A panel story restarts at panel 1, and a Cook round starts again (Cook has no mid-round save).
- **Story help** is a device setting, not a player's: grown-ups set it once. It lives in the save's root (`Save.setting` / `Save.setSetting`, a four-line addition to `save.js`) and isn't in the exported save file. Options: "English, then Kutchi" (default) and "Kutchi only". "Off (pictures only)" and other languages are left for later.
- **The pantry items:** Cook's pantry picks level 1's three from `basics` (five items). For this visit only, `js/cook/app.js` narrows `basics` to chai, dudh and khun, so Nani's list is exactly the chai things. The mechanics are unchanged.
- **Nani's chai:** the chai tray's cups come from the recipe's `family` list (Nana, Ma, cousin). For this visit only it's `["nani"]`, so the one cup has Nani's face. Her chai's details (milk, sugar, elchi) are still random, as for anyone.
- **Cook hooks:** a `then=` return page, restricted to `<name>.html?…` on this site, and `Cook.startDay` exported (one line in `flow.js`). The old `first=1` still works. Cook's chai demo and pocket-money rules don't run in the story's rounds.
- **The English/Kutchi card:** one chunk per language. Each chunk lights up as it's spoken (read-along, UX §1). The speaker replays. Placeholder Kutchi has a faint dotted underline. It's there for grown-ups; children won't notice it.
- **Voices:** Mum's clip where one says exactly the Kutchi shown (`make-chai`, `lovely-chai` "Shabash!", `lets-cook`). The child's "Ha!" is Zafar's clip. Otherwise the browser's speech, else silent timing. If a browser blocks sound (coming back from Cook without a tap), the speaker pulses gold.
- **"Mmm, lovely chai! Shabash, beta."**: only "Shabash!" is recorded, so the Kutchi chunk is "Shabash!" (real voice) and "beta" is in the English.
- **Kutchi placeholders:** never invented freely. Each is built from family words or frames, and each is marked `placeholder: true` with a `note` giving its source:
  - "Muke chai, dudh ne khun de." (Cook's frames);
  - "Kaale Eid ai." (`ai` is the family's; `kaale` is unchecked Gujarati);
  - "Magani acheto." (Zafar, from memory);
  - "Arre re! Khaanu taiyaar nai." (a guess);
  - "Tu muke khaanu banai dinda?" (the B40 frame with *khaanu*).
- **Skin tones:** five tones, warm and unsaturated, from #E2C3A0 to #8A5F44 around Zafar's #C49A78 (the default), per the Cast doc. The Cast's "vary only slightly" rule is for generic characters. The player's own character needs a real range.
- **Boy/girl:** the boy has short hair, a shirt-kurta and trousers; the girl has long hair, a long kurta and shalwar. These are placeholder shapes, and only colours are chosen, as the spec says.
- **No name step:** names stay on the player picker ("typed by a parent, or skipped").
- **UI:** the maker's tabs show each part in its current colour, and each swatch is the part in that choice, so no reading is needed. After a pick, the next tab bounces once as an invitation (UX §8) but doesn't move by itself. The ✓ and the → are big and bottom-right (UX §2). Yes and No are on the right too.

## Tests
- `build/test_first_launch.py`: phone, iPad and laptop.
- `build/test_shared_character.mjs`: Node.
- `build/test_shell.py`: now plays the new first launch.
