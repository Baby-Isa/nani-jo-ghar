# Stone tray vs walnut: judge's view (Fable, Sprint 19)

**Which is which:** `stone-tray-rim-empty.png` has the real raised lip (his "image one"). `stone-tray-rim-chaat.png` has only a soft rounded bevel, no lip (his "image two").

## Flaws first

1. **The empty tray is too pale.** Field #D8CBC4 against marble #F1EBE8: at 740x320 it nearly dissolves into the worktop, and a cream pill (#FDEDD2) on it barely separates. The chaat mock's greyer stone (#CCBAAE) is the better tone.
2. **The empty tray's rim reads as plastic.** It is lighter than the field and too crisp: melamine, not stone. A stone lip is the same colour, only lit.
3. **Bowls float on the stone.** Contact shadows under the bowls are weaker than on the walnut.
4. **The travertine (middle option) is wrong for us.** Its banding is a third stripe pattern beside marble veins and wood grain, and its value collides with the marble.

## His four questions

**1. More modern and clean than walnut?** Yes, clearly. The saturated walnut band on white marble is heavy and dated; a honed stone slab reads as a high-end kitchen. It also fixes hierarchy: the walnut boards above become the single warm wood accent.

**2. Colour.** Warm greige, a step darker than the chaat mock, never pinkish, never cold. Paste: *"honed warm-grey limestone, field #C4B8AD shading to #B5A99E at the edges, lip highlight #DAD0C7; one step darker than the white marble, one step lighter than walnut, cooler than cream but not blue-grey."* Reject the right-hand option (#938885): too cold for the cream house palette.

**3. Texture.** The chaat mock has it right. Paste: *"matte honed finish, very fine even speckle a few percent darker than the field, no veins, no bands, no sheen; the speckle disappears at phone size."*

**4. Rim.** A rim, but low and soft, between his two. Paste: *"a shallow raised lip 3-4% of the tray depth wide (about 10 px at 1920x1080, 3 px at 740x320), same stone as the field, softly radiused, not a sharp step; a thin lighter edge on its upper-left faces, a thin ambient-occlusion line inside the lip on the lower-right; outer corner radius about one-eighth of the tray depth; the slab casts a soft contact shadow offset lower-right by about 2% of its depth, fading over the next 2%."* That makes it an object rather than an overlay, and at 96 px it stays one clean line.

## Further points

**(a) Chai's stone shelf.** They harmonise if they are one family: chai's pale shelf (#DFD5CC) is the lit top face, the tray a thicker, darker cut of the same honed stone. Same hue and finish, only the value differs. No second stone.

**(b) Cream bowls and pills.** Bowls separate fine; their rim highlight and shadow do the work. Pills are fine at the recommended tone, marginal at the empty mock's. In the live game the shared pill is white, which separates better still. Change nothing on bowls or pills; hold the tray at or below #C4B8AD.

**(c) One tray or several slabs?** One tray along the whole band. Short slabs split the row into groups the child reads as categories, and the gaps waste width at 740, where ten bowls are already about 55 px each.

**(d) Also change:** firm contact shadows under the bowls (soft, lower-right, about a quarter of the bowl radius); inset the tray from the screen edges by the walnut's 3%; lighting consistent with the screen (soft upper-left, no pink light leak).

Recommendation: adopt the stone tray with the colour, texture and rim above; one slab; chai shelf unchanged.

## Proof

Read by eye from `sources/art/s19-mocks2/zafar-stone/*.png`, `sources/art/s19-mocks2/results/A2-corn-tray-closeup.png`, `A2-corn-2-improved.png`, `B2-chaat-1.png`, `A3-maani-1.png` and `sources/art/s19-mocks2/refs/00-HOUSE-*`; colours sampled from those files.
