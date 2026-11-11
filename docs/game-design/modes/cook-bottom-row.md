# Cook: each game's bottom row

"The decision about which bottom element each game uses, the stone tray or the vertical shelf, should be in their game file design, but also in their actual code, so it pulls the shared element."

The rule (Zafar, 9 Nov):
- **Tray:** top-down things lie on the stone tray, in the game space, on the worktop.
- **Shelf:** side-on things stand on chai's shelf.

Each game's settings file (`data/stations/<game>.json`) has the same `band`. Its code passes `game: <key>` to `St.stoneBand`, which draws the shared tray (`Shelf.P.tray`) or the shelf. `build/core/band.test.mjs` holds the three together.

| Game | Band | Its things |
|---|---|---|
| chai-tray | shelf | side-on jars, the milk and water |
| eggs | shelf | the egg box, the salt and pepper jars, side-on (CK-73, Zafar 10 Nov) |
| corn | tray | raw cobs, top-down |
| chop | tray | whole vegetables, top-down |
| daar | tray | eight spice bowls, top-down |
| maani-line | tray | dough heaps and plates, top-down |
| mishkaki-grill | tray | sekelo's bowls, top-down |
| samosa | tray | the filling heaps, top-down |
| chaat | tray | the topping bowls, top-down, beside an opaque cream serving bowl seen from above (Zafar, 9 Nov, CHT-13: "I think maybe we go top down for chaat ... Opaque bowl looks better than the glass bowl"; the art landed 10 Nov: F3, C5-C11) |
| baking | shelf | side-on glass bowls and jugs |
