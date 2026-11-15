# s20-b1-fixes: batch 1's fixes from Zafar's review (15 Nov)

Branch `s20-b1-fixes`, made from `ccr-87413d9b-j48fpk` (chai, eggs and maani on the kitchen frame). Pushed; no row's status changed. SH-301 to SH-303 are not in `docs/process/regressions.md` yet: the orchestrator adds them.

## Proof

### 1. SH-301: Nani's face is the order card's face (every game)
- **Cause** (`css/shared/order-card.css:485`, `:524-525`; `css/shared/guide.css:36`, `:80`). The face sits at the same size (44 px at 1280, 29 at a phone) in Nani's box and in the card, but the box places and rings it differently:
  - **ring:** Nani's has a 2 px white ring; the card's has a 1 px edge. Her circle drew 2 px wider.
  - **left:** her box has no edge line and no pull of the face toward the edge (the card's `margin-left: max(...)`). On a short phone it also lacks the card's 0.75 padding.
  - **top:** her face was centred on her two-line row, not set at the card's inset from the top.
  - **Result:** her circle sat 1 px right at 1280, and 4.3 px right and 4.2 px lower at 930x430 and on Zafar's 915x412.
  - **Her words:** on a phone the kit's guide tightens the face-to-words gap to s1 (R5), and her line started 2.6 px nearer her face than a headline does to its face.
- **Fix** (`css/shared/order-card.css`, the side panel's s14 rules: every game's Nani's box):
  - her face takes the card's ring;
  - it sits at the card's inset from her box's left and top, including the phone padding and the face's pull to the edge;
  - her line keeps the card head's s2 gap.
  - Her box keeps its size. The speaker badge rides on the circle, as the card's does.
- **Measured** (circle's inset from its box, Nani's / card's): 740 (4.95, 4.95) / (4.97, 4.97); 915 and 930 (6.28, 6.28) / (6.28, 6.28); 1280 and 1920 (9, 9) / (9, 9). Her line starts at the card headline's x at 740, 930 and 1280 (48.73 / 48.75, 50.06 / 50.06, 71 / 71).
- **What a child sees:** Nani's face and Nana's face in one column, the same size, ring and speaker, the same distance from the top of their boxes; her words start where his do.

### 2. SH-277: the order headline is one size in every state (every game)
- **Cause:** chai's one-size rule (SH-289) was written for chai alone, as `#side[data-recipe="chai"]` (`css/shared/order-card.css:782`). Every other game's headline was free to shrink. In eggs it dropped 2 px (16.5 to 14.5 at 1280) once the done tick took its room.
- **Fix:** the same rule as the kit's, on `#side`: 0.87 of the card's headline size, never shrunk, wrapped where it doesn't fit. Chai's own size is unchanged; its boxes show no headline move.
- **What a child sees:** the order's words stay one size from the first sentence to the end.

### 3. SH-303 and CK-93: one kitchen for well done, chai's (eggs)
- **Cause:** eggs' `serve()` (`js/cook/stations/eggs.js:1044-1188`) faded the whole kitchen and cut to its own scene:
  - the table room, with a breathing cat;
  - the people standing whole, with plates sliding to them;
  - its praise said by the game itself, with no "Shabash!" card.
- **Fix:** eggs serves chai's way through the kit (`Cook.Kit.serve()`):
  - the kitchen stays; only the steam goes;
  - each person's big face sits over their plate's rim (`faces`), happy when the plate is right, a gentle frown when not;
  - on a right serve, the "Shabash!" card sits beside the praise face as it is said, and Nani's box reads it;
  - the wrong-order pop-up and its crossed rows are as before.
  - The table, cat, table plates and room picture are no longer loaded. Their settings in `data/stations/eggs.json` stay as data.
- **Games reached:** eggs. **Maani** already praises chai's way (`js/cook/stations/maani-line.js:1045-1068`: the kit's review face beside its plate, in its own kitchen), so it is unchanged. Corn and daar are on other branches.
- **What a child sees:** at the end of eggs, the same kitchen they cooked in, Nana's face by his plate and a "Shabash!" bubble, as in chai. Pictures: `build/screenshots/boxes/b1fix-eggs/eggs/*/praise.jpg`.

### 4. SH-302: the egg in the hand (eggs)
- **Cause** (`js/cook/stations/eggs.js:457`, `rawEgg`): the egg lifted from the bowl took its pot size, 0.62 of the pot's floor radius, in the hand too. That was about 45 px beside a 190 px pot at 1280, sitting on the bowl's edge.
- **Fix** (`eggs.js` bowl tap and `putIn`; `data/stations/eggs.json` `egg.inPot`, `egg.inHand`):
  - the egg is a little larger everywhere (`inPot` 0.62 to 0.70; in the pot it still sits inside its heat ring);
  - in the hand it grows to 1.14 times that as it rises clear of the bowl, then glides back to its pot size as it flies in.
  - **Net:** 1.29 times its old size in the hand: 45 to 58 px at 1280, about 25 to 32 px at 740x320.
- **Why not bigger in the hand alone:** my first try (1.24 times the pot size in the hand, pot unchanged) broke contract-114 13 times in gate 1 (advisory): "eg-egg-brown rests at 27 px, -19% of its 34 px at its last place". The egg does rest in the pot, and an item keeps its size within 15% from rest to rest (SH-256). So the egg grew everywhere instead, and gate 3 has no contract-114.
- **Call for Zafar:** an egg in the hand much bigger than 1.29 needs either his word in contract-114's accepted sizes, or the egg and its heat ring bigger in the pot too.
- **What a child sees:** a clearly bigger brown egg lifts off the box, then shrinks a little as it drops into the pot or pan.

### The gate (`node build/tools/tiers/gate.mjs --game chai-tray,eggs,maani-line`)
**Gate 1** (`gate-20261115T0030`, after the four first fixes), 47 min:
- checks pass, 2.5 min;
- contract pass, 41 min: 0 blocking over 84 pages; 13 advisory contract-114 on eggs' egg (fixed, see 4);
- boxes FAIL, 3.5 min: Nani's box only.

**Gate 2:** stopped by me after I found the contract-114 breaks; not counted.

**Gate 3** (`gate-20261115T0119`, the final code `4e8940a`; the report and notes commit after it changes no code), **47.8 min**:
- **checks:** pass, 3 min.
- **contract:** pass, 41.4 min. **0 blocking breaks over 84 pages.** Advisory (not failing): 39 (contract-72 x2, -78 x2, -119 x20, -70 x6, -37 x5, -36 x4). No contract-114.
- **boxes, chai-tray:** FAIL, 3.4 min, as the brief expected: 0/8 pages identical, 20 differences a page. **Every difference is in Nani's box** (`nani/*`; checked by filtering the diff for anything else: none):

| What moved | Where | By how much | Why |
|---|---|---|---|
| `nani/face` (her face's tap area) | all 6 moments, 8 pages | 1280 and 1920: left 1, up 0.3; 930x430: left 4.26, up 4.16; 740x320: left 5.59, up 5.49 | SH-301: her circle at the card's inset |
| `nani/word#n`, `nani/ra#1` (her line's words) | light, mid, serve, praise | 1280 and 1920: left 3; 930x430: left 13.74; 740x320: left 12.43 | SH-301: her line starts where the card's headline starts |
| `nani/word#1`, `nani/ra#1` | order | gone | SH-300 (already on the base): her box is empty during the order |

No card, list, hob, tray, pan, shelf or pop-up box moved in chai. Chai was not re-frozen. Diff sheet: `build/screenshots/boxes/gate-20261115T0119-chai-tray+eggs+maani-line-chai-tray/diff-chai-tray.html`.

### Box runs
- `boxes.mjs --game eggs --run --run-id b1fix-eggs`: **pass**, 2.3 min. Every moment was reached and still at all 8 pages (L1 and L4, four sizes). Eggs has no reference to compare with.
- `--game eggs --rules --from b1fix-eggs`: **9/10**. Headline passes, where the earlier eggs report had 4 faults (SH-277). tap-size fails 13 times: the kit's word-card buttons in the open word card at L4's light (`wc14-eye`, `wc14-dots`, `wc-spk`). That is the same failure as in `s20-b1-eggs.md` and the base, and not one of these fixes.
- `--game chai-tray --rules --run-id b1fix-chai-rules`: **10/10**, 3.5 min.
- `checks.mjs`: pass (before the gates; the gate's tier 0 twice more).

### SH-304 (orchestrator, 15 Nov night)
The orchestrator asked for the speech bubble to move clear of the pop-up card, then cancelled it before I started. No bubble or pop-up placement code was changed, so there is nothing to revert.

### Files
`css/shared/order-card.css` (SH-301, SH-277), `js/cook/stations/eggs.js` (SH-303, SH-302), `data/stations/eggs.json` (SH-302), `docs/architecture/kitchen-frame.md` (three kit rules), this report.
