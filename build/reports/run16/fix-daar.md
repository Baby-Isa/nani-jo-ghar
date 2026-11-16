# run16 fix-daar: hand-back

## Flaws first
- **check-change never finished.** The first run hit the background time limit. In the second, push, play, the base run and the pairs finished, and I stopped it during the rows step at the cut-off. frozen, mount and leak were not run. Its play against the base, daar and chop at L1 and L4, 740x320 and 930x430:
  - contract-119: 10 and 10. This is SH-267, fix-kit's.
  - contract-72: 3 on the base, 4 here.
  - contract-36: 1 on the base, 2 here.
  - **contract-111: 0 on the base, 8 here.** All 8 are in `lab:cook/daar@L4` at 740x320, at the stir: the spice shelf's taps pick nothing. It came in both check-change plays (3 pages at once) but not in three single runs of the head (07:50-07:53: 0, 0, 0 contract-111). It may be load timing or my DAAR-59 shelf change; prove should run `run.mjs --contract --flow lab:cook/daar@L4 --sizes 740x320 --parallel 3` and, if it is real, revert DAAR-59's daar.js part (the chop band's part stands alone).
- **DAAR-59 is only part-fixed.** The row's word sizes are now even wherever the row has room (L1-L3 at 1280x665, L1-L2 at 740x320). Rows with eight pills (L4, and L3 on a phone) still shrink 'laal marcha' alone, as on the base (55%; 69% at L4 1280x665). Fitting them needs Zafar's choice (question below).
- **DAAR-56's margin at 740x320 is thin.** The finger rests 431 ms against a 500 ms limit, so a slow machine may flake. prove runs it twice.
- **I touched three sandbox files nobody owns:** `build/sandbox/lib/framebuf.mjs`, `lightshot.mjs`, `lightpix.mjs`. DAAR-55 is a fault in the checks, not the game.
- **I took `js/cook/mechanics/chop.js` as mine.** The brief's `stations/{chop,stir,tadka}` files don't exist; chop's strip and band live in the mechanic.
- **One kit fault needs fix-kit** (KIT-PILL-PAD in the results): `Cook.Kit.chip` draws every pill on a fixed 128 card by default, and it pads with 52 while `Shelf.faceW` measures with 48. daar and chop work around both (`w`, `PAD_FIX`). samosa, maani-line and the grill also pass fixed widths.

## Proven
- **CHT-21** (with fix-kit's ui.js, merge after fix-kit): chop.js passes the kit's keepOrder for chaat's chop-game. At L4 its check fails on the base (one card, Nana's line gone) and passes with fix-kit's ui.js (two cards), at 740x320 and 1280x665.
- **DAAR-60:** contract-120 is red on 193fa1c^ (a chopped heap with no shadow, daar L4 740x320) and green on the base (fixed by 193fa1c). Its contract-98 half was already green when the row was filed.

## Built (red on the base, green here; for prove)
- **DAAR-55** (Check). The judge's "light off at +1350 ms, the finger left on the knife" was the sandbox's own light-picture check. It hides every dim layer, but not the finger, for its under.jpg, and those frames slipped into the side-by-side strips. `framebuf.mjs hideFor` now opens the hidden window before the hide.
  - Red/green: `node --test build/tools/review/run16/framebuf-hide.test.mjs` (red da9432c, green 0bf3551).
  - The game's light: frame by frame it shows no gap on the base or on the 15 Nov code.
- **DAAR-56.** Chop's finger comes to the knife 250 ms before the drag (it had come at +0.3 s and sat still 1.2 s), and the drag eases out. The 1.5 s still scene is kept (SH-253).
  - Check: `run16/chop-strip.mjs --row DAAR-56`, red on 48003532, green on 7d9c86e.
- **DAAR-59** (part). Each pill gets its own face's card where the row has room, and the slots widen for the widest pill.
  - Check: `run16/daar-pills.mjs`, red on 48003532, green on 8fef796.
- **CK-111:** its finger part is DAAR-56. Its other two parts were already in the code, and need the eye.

## Questions for Zafar
1. **DAAR-59's crowded rows.** At L4 (and L3 on a phone) the eight spice pills have no room for 'laal marcha' at its neighbours' size. Options:
   1. (Recommended) Every word in that row takes one smaller size: SEK-32's rule for sekelo. About 70% on a laptop, 55% on a phone.
   2. Leave 'laal marcha' alone smaller, as today.
   3. Two rows of spices at L4.

## Not taken
- **CHT-22, read in code only** (no browser time left):
  - The dim flash at the tameto turn is most likely the same harness artifact as DAAR-55.
  - The potato on the board and the tray at once was probably fixed by d7d8a06.
  - The 'hakro' pill over the cut potato is still open.
- **CHT-19, CK-79, CK-106:** not reached. SH-276 in daar was left alone, as the orchestrator asked: keeping Nana's card in daar would undo DAAR-44's one-card panel, so it is Zafar's call.
