# The stone tray against his ChatGPT trays; eggs' pans (10 Nov)

His message (10 Nov): the tray is too dark, its edges are fuzzy, it doesn't read as stone; eggs' items belong on a side-on shelf;
each game's band named in its design and its code; eggs' pan handles look awkward.

## The tray (pictures 1 and 2)
Measured at 1920x1080 (corn), against `sources/art/s19-mocks2/zafar-stone/`:
- **Too dark.** Ours is #B8ACA1 in the middle and #AAA09E at the ends; his trays are #D7CAC2 (empty) and #CDBBAF (chaat).
  That is 17 to 30 levels darker. A radial shading darkens our ends further, like a vignette.
- **Fuzzy edges.** His edge is a crisp darker outline with a lit bevel, a visible front thickness, and a firm shadow.
  Ours has a lighter ring with no outline, which melts into the light marble. Its shadow is 2% of the depth, so there's barely any.
- **Not stone.** Our speckle is 1 px dots at 7-17% (pixel spread 0.4); his has visible grain (spread 5.7).
  At game size ours is a flat paint.
- **Cause:** the slab is drawn in code from Fable's colour spec, and each fix made it smoother and darker.
- **Option A:** his own empty tray, cut and stretched along its middle, so the corners and edges stay true at any width.
- **Option B:** the same, toned to his warmer chaat tray.
- The mock pastes the cobs back without their shadows; the game keeps them.

## Eggs (picture 3)
- Chai puts every handle at 9 o'clock, short, in the gap between burners. Nothing crosses a neighbour.
- Eggs' steel pan has a long handle, so at 10 o'clock it reaches over the pot.
- Grid: now, 10 and 2, 8 and 4, 7:30 and 4:30, 9 and 3, and the two short-handle versions.
- The shelf was decided (build/reports/s19-fable-mock-answers.md, 7: "Side-on shelf (egg box, salt, pepper, chilli)"), and wave C's brief said so.
- Wave C put the top-down bowl and shakers on the tray instead. The side-on art exists: f-eggs-in-a-box, f-salt-jar, f-black-pepper-jar.

## Proof
- Pictures in `build/reports/s19-stone-tray-compare/`, made by script from the sandbox runs orch-tray3 (corn and daar at 1920x1080) and orch-tray2 (chai at L4).
- The eggs angles: eggs L4 in the browser with the pan and pot turned in place.
- Rows ART-72, CK-73, CK-74, SH-248.
