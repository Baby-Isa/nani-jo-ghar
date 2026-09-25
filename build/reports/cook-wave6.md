# Cook with Nani: Wave 6 (branch `claude/build-cook-wave6`)

All nine items from Zafar's grill playtest (`docs/UX-PRINCIPLES.md`).

## What changed
- **Request card** reads along: each spoken chunk lights its row or card as it plays, shows the dish's plain-English `how`, then shrinks into the sidebar.
- **Sidebar on the left**; Done and the new **"Go to the barbecue"** stay bottom right. Opt-in via `body.w6`, so the other pages sharing `ui.js` are unchanged.
- **One card per item, fixed shape:** skewer (always four dots; a mixed one names its pieces in order), maani, cup (face, *Nana lai.*, then milk / sugar / which chai; an empty slot for plain).
- **Help:** the per-row speaker, 👁 and A/En are gone. One **light bulb** shows English for 5/3/2/1 s by level and costs the ear star. **One speaker per card** reads the card with read-along.
- **Grill:** thread → "Go to the barbecue" → grill. The juggle is level 4 (`juggle: true`). No chips on the grill.
- **Level 1 is the smallest round:** one skewer, one cup, one maani, three pantry things. Each level adds one thing. A new `pantry` recipe (Nani's list, *Muke {x} de*) is the first thing a new player does; the rules come after it.
- **Onboarding:** at each station, the first (guided) time dims everything but the next thing, with a ghost finger (`js/cook/coach.js`). The stars fade in from the second order, the bulb from the third.
- **Family words:** *daar*, *ba* (voice *ber*), *hakro/hakri* by the noun's `gender`, *wadho/wadhi*, *nindhi*, *watana*, *{x} waari chai*, *Muke chai me {n} khun khape*, *{person} lai*, *Muke {x} de*, *Pela … Ne poi …*. Drafts are flagged; ids unchanged.

## Try it
`cook.html` → Start cooking (a fresh save opens on the pantry), or the Station lab at levels 1–4.

## Tests (one at a time, `COOK_TEST_PORT=8810`)
All pass, with no console errors and no sidebar warnings:
- `--orders`
- `--lab` laptop and flip5-landscape (WebGL)
- `--days 2 --canvas`
- `--open-kitchen 2`
- `test_find.py` laptop
- lab level 3 and 4 runs at phone, iPad and laptop sizes (canvas)

Screenshots checked at each size; the harness now also tests read-along and the bulb.

## Left
- **Placeholder voice for the new words.** Google TTS is blocked here. Run `build_cook_tts.py` (it knows the new words) where there's network.
- **For Zafar:**
  - One card per skewer or maani shows the count, so the count no longer needs listening. See the audit's "After Wave 6".
  - Ordering *for* others at the Chai tray (*Nana lai*) needs design.
- Word-by-word highlighting inside a chunk needs per-word timings from the family's recordings.
