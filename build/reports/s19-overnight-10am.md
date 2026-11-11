# Overnight to 10:00 (11 Nov)

## Merged and pushed
- **Chaat top-down** (s19-chaat-td): the opaque cream bowl from above, each topping its own layer growing in, the drizzles, the ten
  bowls on the stone tray; Fable beside chai: 24 pass, 4 fail (CK-85: a blurred potato layer, lights for later items and cards, the
  phone praise zoom). Why it slipped for two days: build/reports/s19-chaat-top-down-slip.md.
- **Checks round 2** (s19-checks-2): snaps (contract-114), item sizes (115), card padding (116) measured on the screen; 72, 73, 74,
  80 rewritten; no game skips a check (games.json holds no check fields); the art check fails a pink rim. Each new check goes red on
  a saved bad screen and green on chai.
- **Fixes round** (s19-fixes-f): the twelve rows (one light at a time, nothing lit in flight, faces beside the dish, no snaps in
  eggs, corn and daar, daar plays chop as chaat does, daar's heaps, corn's cards and fourth stage, hakro in the review).
- **The pantry** (s19-pantry): the walnut-lid set, 35 of 36 (the orange waits on art), single vegetables for the crates; every
  kitchen page loads only what it shows (14 of 14).
- **The orchestrator:** the pink rim off 63 cuts (edge_bleed.py); the push check's limit raised (a busy machine timed it out with
  nothing failing); the shared-pieces lint has no known break left; the kitchen colour lesson in the art bible.

## Still running at 10:00
- **s19-fixes-g:** what the new checks find (they found 182 faults in nine games; snaps, padding, sizes, calls); five commits in.
- **s19-serve:** the serving kitchen's two views, the glide down, one walnut tray per person, each dish on its tray, on stand-ins
  named so the kitchen art drops in; built, finishing its final checks.

## Open
- Chai's saved reference pictures need refreshing on a quiet machine (after the builders).
- Three new-check readings the builder thinks are wrong (sekelo's rack light, chop's swipe light while it moves, an egg browning in
  place): a small checks pass.
- Art for the next run: a chopped golden onion (daar), sekelo's tray slots, top-down potato, chickpea and sev scatters (chaat), the
  orange (pantry).
- The other nine games are judged beside chai again once fixes-g merges.

## Costs (estimates; Opus high unless named)
chaat-td about $45, checks-2 about $45, fixes-f about $30, pantry about $40, fixes-g about $45 and serve about $45 (running), Fable
judges and reviews about $10: about $260 overnight, over the $150-200 planned (a third checks builder and the pantry were added).

## Proof
- Merge commits on ccr-87413d9b-j48fpk: s19-chaat-td, s19-checks-2, s19-fixes-f, s19-pantry (git log --merges).
- Chaat's verdict: build/screenshots/sidebyside/chaat-L1-20261111-0355/judge-batch.verdicts.md.
- check-push passed on efd878fd8 (build/reports/tiers/push-efd878fd82.md); the builders' reports: build/reports/s19-*.md.
