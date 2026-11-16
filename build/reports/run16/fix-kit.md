# Run 16: fix-kit

The kit's rows (js/shared, js/cook core). Branch run16/fix-kit, from 48003532. Results: `fix-kit.json`; ready list: `fix-kit-ready.txt`.

## Flaws first

- **check-change 0725e61 "FAILED", for reasons not this branch's:** two contract breaks the base run happened not to show,
  contract-37 in eggs#hint at 930x430 (decoys on the shelf, eggs.js's) and contract-113 in baking#hint at 740x320 (Nana's face over
  the naan). My own base run (fk-119-base) shows the same contract-113 in plain baking, so both are flaky and older. Its frozen step
  was stopped by me: I had wrapped check-change in the browser lock, which its frozen step also takes (a deadlock); chai's frozen
  diff ran on its own instead (below). Its mount step was red then; fixed since (SH-314).
- **Chai's frozen diff** (frozen-diff-chai-tray-202611160600): 11 changes on 10 pages, every one also in the frozen diffs made
  before this branch (16 Nov 02:07 and 15 Nov): the panel-follow note, sfx/cook-right, card-light at L4 1280x665, dudh.mp3 at
  L4#child. Chai is not changed by this branch: SH-267's new hold and replay match skip chai on purpose.
- **CHT-21 depends on two branches:** the kit option is here; fix-daar wired its caller (mechanics/chop.js). Merge fix-kit first.
- **CK-132's drop-down probe (fix-stove's) fails on this branch**, but its trace shows the arrow on screen at opacity 1 for the whole
  9 s; the probe counts it coming back (traceRepeats >= 2) and a trace cannot see `visibility: hidden`. That probe needs a look by
  fix-stove; no kit change made.
- DAAR-57's red is the base's own screenshot, plus a spec run on the base tree (see fix-kit.json).

## Built (red, then green)

- **SH-267** (the dish card at L1): red 28 contract-119 breaks on the base (chop, eggs, corn, baking at L1, every path, two sizes);
  green 0 here. Causes: the order's first item card shut the dish card at once (eggs never seen, corn 114 ms, chop 86 ms); a
  replay's headline ("Muke naan khape.") never matched the card's ("Muke naan khape,"). Now the dish card holds for its hold, then
  the item cards follow; chop's first item card is its dish card; the replay matches without stops.
- **DAAR-57 / SH-270** (Nani's face and speaker in her box during the chop): only the pantry's list strips her box; her own
  orders keep her face and speaker in the box and her card has none (as daar's). Machine PASS at L1-L4, two sizes.
- **SH-314** (Cook leaves nothing behind): red in check-change's mount step (a SECTION.wc on body, a resize listener a late font fit
  put back); green three runs in a row (5 mounts each, all clean).
- **CHT-21** (kit part): M.addCard(key, data, {keepOrder}); fix-daar passes it from chaat's chop.

## Proven (already fixed on the base)

- **SH-292** (light centred): new unit test red before 49f28f8a (left 3 px, right 9.6 px), green after.
- **CK-121** (eggs' cards at well done): fixed by cb34df93 and 49369e32; seen right at L4 at 1280x665 and 740x320; spec added.
- **SH-232** (panel follows a fold): built 7 Nov (63c880ce), contract-99 0 breaks in every run here; its red can't be shown (the
  check came after the fix).
- **SH-308 in sekelo**: fix-stove's probe passes on this branch at L1-L4, two sizes (not re-run on the base).

## Questions for Zafar

1. **SH-299:** the fix (an item card's flight landing in its slot: the row's live glide wins over an older one) changes chai's row
   motion too, and chai is frozen. May the kit fix change chai?
2. **SH-284:** keeping Nani's box out of the first-time showing's dim while she speaks also changes chai's showings. May it?
3. **SH-267 in chai:** when a chai order's first sentence says one of its rows (adh, elchi), that row's card still replaces the
   dish card at once; the other games now hold the dish card first. Should chai's do the same?
4. **SH-276 in daar:** keeping Nana's card in view during daar's chop reverses DAAR-44 ("one order card in the panel"). Which wins?

## Not done

SH-279 (the Shabash card's place: needs a check on a canvas card that doesn't exist yet), PAN rows, SH-211, SH-203 and the
other kit rows in sort.json: not started (time).
