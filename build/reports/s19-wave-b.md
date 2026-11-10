# s19-wave-b: chop on its new art, corn on the one grill kit (two screens)

Opus, high. Branch `s19-wave-b`, never pushed; the integration branch merged in (wave A's stone tray).

## What changed

**Chop (ART-37, CK-71).** Samosa's v3 walnut board big above the band (never full-bleed); the v4 pieces whole on the stone tray with
their pills (the shared pill, chai's row rule); a cut lays the piece's own two halves on the board, where they stay; the v4 knife
upright beside the board; soft code shadows. The hop as merged (semi-random, never two together, at most the level's number up); the
slots span the whole tray so the pills read, and where they reach past the board a hop rises a little inward, two neighbours never up
together. Only the round's pictures load.

**Corn (CK-67).** `js/cook/grill-kit.js` (new; nothing corn-only in it): option 3, two by two. Screen 1: raw cobs two by two on the
tray, the grill big on the left, the cooked tray right; a cob grows and turns upright onto the grill (ends on its rims), rolls to
turn (cob-turned, cob-done), shrinks into the tray. Screen 2: each cob on its person's cream plate with their face circle, the six
bowls on the tray with pills, one person at a time (the rest dimmed), each person's own mix drawn on their cob in code; their plate
tapped is theirs (the kit's review and redo). The order lives in corn.json (one plate a person; the old frames, no new Kutchi). The
marble and tray replace the stall's table.

## Proof

- Contract, chop and corn L1-L4 at the four sizes (`s19-wave-b-l1l4`): 32/32 to their end, 0 page errors;
  `CONTRACT FAILED: 16 breaks (contract-37 4, contract-105 12)`: 37 is chop L1's no decoys (his 9 Nov word; ask 2); every 105 is the
  kit's reveal-lesson light on the sidebar card at the phone sizes (on base too). Mistake, hint, takeback, speed1 paths: to their end,
  0 page errors; contract-83 now and then on corn's mistake path (the lesson card's flight over a face circle; not on base, cause not
  found).
- Frames (script-made): a hop `build/screenshots/sandbox/s19-wave-b-l1l4/cook-chop-l2/930x430/05-kind-slice.png`, the halves
  `c06-stage.png`; corn's two screens `cook-corn/{740x320,1920x1080}/c06-stage.png`, `c08-stage.png`.
- `checks.mjs`: all ok. `loadcheck --only cook:chop,cook:corn`: 2/2.
- `evidence.mjs --after --brief`: refused (ART-37's probe has no driver, ask 1); no before folder exists.
- check-change (`build/reports/tiers/change-94820c616d.md`): FAILED, four blocks, none from these games: scope (the merge's files),
  rows (ask 1), frozen (chai, needs a re-freeze since s19-stoves), mount (chai-tray; base 21 fails, merged 22: a lab.html page error,
  `reading 'renderer'`, after the merge). Play, films, leak, loadtime pass.

## Asks (files I don't own)

1. evidence.json: ART-37 probe 1 -> `{"flow":"cook:chop","path":"fair","level":[1,2,3,4],"sizes":["740x320","930x430","1280x665","1920x1080"],"profile":"seen","at":"kind-slice","capture":["shot","strip:#game:12x150"],"note":"the board above the tray; a hop and a cut, the halves stay"}`;
   CK-67 `"at":"every:life:corn-screen"`; CK-71 probe 1 `"profile":"fresh"`.
2. games.json, contract-37: chop L1 wants 0 decoys.
3. js/cook/ui.js cardPic: a game's own items[].card before the word's.

## Open

The longest dressing names narrow below the pill floor at 740x320; sekelo onto the grill kit next.

## Fix round (10 Nov, morning)

- Merged the integration branch (3e64025ef: the probes, contract-37 at chop L1, the tray guard).
- **Corn's pills:** each pill sits at the floor (the larger of the shelf's pill rule and the kit's 14 px canvas text floor) at all four
  sizes. Nothing is narrowed or clipped, and pills stay a light's margin apart. Each slot is as wide as its pill or its bowl. Where
  the six can't share one row (740x320), they sit in two rows of three on a taller stone tray. The plates sit above them, a light's
  margin clear. canvas-text-small: 0 on corn and chop (chop's band slots now use the visible width on a phone).
- **Chop's halves:** each cut goes into a cell of its own along the board's bottom strip, then its top strip (four a strip), sized to
  fit. The middle stays the hops' lane. The knife goes back beside the board at the round's end.
- **contract-83 (cause):** the order card's face button has a 48 px tap area (`.face-say`, [5,64,53,112] at 740x320). It reaches 3 px
  into the first item card ([10,109,…]). It is the same on base. faces() counts the tap area as the face. Corn's per-person cards now
  let the kit's order pop land on its card, so the check sees the overlap. Corn draws neither, so it can't be fixed in corn. The fix
  is in js/shared/order-card.js (rows below the face button's tap area) or js/cook/flow.js faces() (the circle `.njg-face`, not its
  button).
- Also fixed: contract-99 (the panel's focus on the person being dressed, set before the last card folds); contract-109 (a not-ready
  plate shakes sideways, never turned; nothing takes a tap after the round).
- **Proof:** contract, chop and corn L1-L4 plus corn's two mistake paths at four sizes (`s19-wave-b-fix`): 40/40 to the end, 0 page
  errors, 0 contract-37. contract-109 and contract-99 were fixed after this run. Re-runs: `s19-wave-b-mistake2` (corn's mistake paths,
  four sizes: only contract-105) and `wb-focus2` (corn L3, L3#hint and L4 at 740x320: one contract-83). What remains is contract-105
  (the kit's lesson light, on base too) and contract-83 now and then (above).
- **check-change** (`build/reports/tiers/change-d5590e2ddd.md`):
  - It also blocked on contract-99 (fixed after it ran) and contract-83 (above).
  - scope: the merged files.
  - rows: CK-67's `life:corn-screen` needs the word in `build/sandbox/lib/moments.mjs` LIFE.
  - frozen: an orphan re-play held port 8903, so mount, leak and loadtime failed to start. Re-run by hand: mount 22 fails (the
    lab.html page error is still there; base has 21), leak ok, loadtime no baseline.
