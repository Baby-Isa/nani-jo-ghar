# The Cook redo landed: 3 sheets cut, judged, and the flames and the shop's rolling pin swapped (6 Nov)

Zafar's Cook redo run (`build/tools/art/specs/s17-cook-redo.run.yaml`) came as three images attached in chat (not on `main`):
1254 px and 1536 px screenshots of ChatGPT's pictures, not full-size downloads. This step cut every item but the glass, judged
the cuts, found where the game shows each item today, and swapped only what is shown and comes out better. The old files stay
in the repo, unreferenced.

**In plain words.** Two swaps reach a child: **the gas flames** (chai, daar, samosa and the maani line all draw the same two
rings) are now the calmer blue drops with warm tips, and **Nani's shop's rolling pin** is the walnut one. Everything else turned
out not to be on screen: the hob knobs, the tray, the light velan, the failing chopped tomato and the failing rai picture are
all files the game names but never draws. Their new cuts wait in `sources/art/s17-cook-redo/cuts/`. **The clear glass is not
cut** (Zafar, 6 Nov ~18:00: "I thought it worked quite well as it was"); its raw stays on the sheet.

## Flaws first

1. **Screenshots, not downloads.** The flame cells are about 330 px; the high ring is scaled up 1.5x (the low 1.3x) to the old
   rings' size, so the flames are a little soft. They glow, so it barely shows on the hob at play size; a full-size download
   would be crisper.
2. **The new flames all point up** (a teardrop ring seen from a little in front), where the old ones pointed out from the
   centre. Under chai's pan the lower half of the ring peeks out as blue drops and the upper half as small warm tips, so the
   ring looks heavier at the bottom; the old showed even yellow tips all round. The biggest risk of the swap, so it is the
   judge batch's named question. If it reads lopsided, the fix is a redraw with radial flames, not a cut.
3. **The low ring hides under the pan in chai**, before and after: the kit draws it at 0.92 of the high ring's scale, inside
   the pan's rim (unchanged geometry; the new low ring is placed at the old one's radius, 191 of 512 px, and made round: it
   was drawn 5% wider than tall).
4. **The glow was trimmed**: the faintest 15% of each ring's halo is cut (scaled up, the high ring's soft rim was 11.7 px, over
   the pixel check's 10). The flames and their warm tips are untouched.
5. **The tomato is not much calmer** than the old one (chroma 84 against 89). It now passes the natural-red rule (the old
   failed it by 2), but by eye it is still a bright red. Not swapped anyway (below).
6. **The walnut pins flag the wood rule**: their highlights (`#ad7049`, 17-20% of the pin) read to the tool as light oak,
   though the body is mid walnut (median `#885433`, L 41; the maani line's velan is `#78401f`, L 34). By eye: walnut, lighter
   than the maani velan, not pine. A FLAG, not a FAIL.
7. **The knob and tray are champagne steel**, the game's hob is black with gold (its knob has a gold ring). Not swapped.

## Where each item is shown, and what was done

| Item | Today's file | Where the game shows it | Done |
|---|---|---|---|
| Flame ring, high and low | `assets/cook/items/chai-station/flame-high.webp`, `flame-low.webp` | every hob: `Cook.Kit.art`/`burner` (`js/cook/kitchen-kit.js`) in chai, daar, samosa, the maani line, the eggs lab; the Station lab's Boil (`js/cook/mechanics/boil.js`) | **swapped** to `assets/cook/items/s17-cook-redo/flame-*.webp`, on the old 512 px canvas at the old radius, so no size changes; `data/cook.json` prefetch and file lists follow |
| Knob off and on | `chai-station/knob-off.webp`, `knob-on.webp` | only the Station lab's Boil (a dev lab) and `lab/chai-v2-mockup.html`; every station draws the kit's knob, `v3/hob/knob-*-v2.webp` (black and gold) | **not swapped**; cuts in `cuts/` (decision 1) |
| Tray | `chai-station/tray.webp` | nowhere (only the chai station's file list glob) | **not swapped**; cut in `cuts/` |
| Glass | `chai-station/glass.webp`; chai draws `chai-v2` and `s14` glasses | chai | **not cut** (Zafar, 6 Nov) |
| Thin velan | `assets/cook/items/maani-v2/velan.webp` (light pine) | nowhere; the maani line and the Roll lab draw `v3/maani/velan.webp`, already walnut-toned, which passes | **not swapped**; cut in `cuts/` |
| Rolling pin with handles | `assets/cook/props/rolling-pin.webp` (light pine) | Nani's shop, the "Special rolling pin" upgrade card (`data/cook.json` upgrades, `image`) | **swapped**: `assets/cook/props/rolling-pin-walnut.webp`, the new pin turned 38 degrees to lie as the old card's did |
| Chopped tomato | `assets/cook/items/veg-tameto-chopped-t.png` (the failing one) | nowhere: daar's `CHOPPED` names it, but `HEAP5` draws `v3/daar/chop-heap-tomato.webp` for the tomato (passes, one set with the onion and chilli heaps) | **not swapped**; cut in `cuts/` |
| Mustard seeds | `assets/cook/props/rai.webp` (the failing one) | nowhere (no station lists the `rai` prop); the game's rai is `spice-rai-bowl-t.webp`, one of the tadka's five cream bowls (passes) | **not swapped**: the new bowl would be the odd one of five; cut in `cuts/` |

**Chai's hob** comes from the s14/v3 art (the hob, the pans, the kit's knob); the only `chai-station` files it drew were the two
flame rings. Nothing else in chai changes.

## The judge

- **Sheets** (`artjudge.py --spec … --no-look`): 3 images, 0 pass, 3 flag, 0 fail. KH01 and KW01 "edge not crisp" (the flames'
  glow; the clear glass, not cut); KF01 "may read as sweets" (the round bowl of seeds; by eye, seeds).
- **Cuts** (`artcolour.py`, by sheet): the flames, knobs and tray 2 pass, 3 flag, 0 fail (batch splits: flames against steel);
  the pins 0 pass, 2 flag (the wood rule, flaw 6); the tomato and rai 2 pass. **The low flame no longer fails** (it was the redo
  list's palette FAIL). The old `veg-tameto-chopped-t.png` and `rai.webp` still FAIL, but are never drawn.
- **Pixels** (`artcheck.mjs`): 471 findings, 471 known, 0 new.
- **By eye** (`build/reports/art/cook-redo-landed-2026-11-06.jpg`, every cut on dark and cream): clean edges, no grey, no
  magenta left; the knobs and tray are clean circles centred on their canvas (cut by `build/tools/art/cook_redo_post.py`: a
  plain key left their pale steel rims ragged); the lit knob keeps its soft amber glow; one light from the upper left.

## Before and after

Chai's look changes (the flames), so: `build/screenshots/cook-redo/sheet-1280x665.png`, `sheet-740x320.png` (chai L1, the
fair player at test speed 3; BEFORE serves the old flame files at the new paths, so both runs play the same code), each with
the hob zoomed, and Nani's shop. Judge batch: `build/screenshots/cook-redo/judge/brief-01.md` (not yet judged).

## Decisions for Zafar ("yes to all except …")

1. **The hob knobs:** keep today's black-and-gold knob (it matches the black-and-gold hob), or swap in the new champagne-steel
   knob? Recommend: **keep**; the new one is cut and ready if you want it.
2. **The new flames** (blue drops pointing up, warm tips) in place of the old (radial, yellow-tipped). Recommend: **yes**, once
   the judge passes the sheets; if you prefer the old shape, it's a two-line revert.
3. **The tomato and rai redos stay unused** (the pictures the game shows pass and belong to sets). Recommend: **yes**.

## Proof

- Cut: `python3 build/tools/art/artcut.py build/tools/art/specs/s17-cook-redo.cut.json` (3 jobs, 0 flags), then
  `artdespill.py` on the tomato and rai, then `python3 build/tools/art/cook_redo_post.py` (the rings placed, the round steel
  pieces, the shop pin).
- Rows: ART-53 (the walnut pins landed; the jars still wait); the redo list `redo-strict-2026-11-06.yaml` notes on the flame,
  tomato and rai rows.
