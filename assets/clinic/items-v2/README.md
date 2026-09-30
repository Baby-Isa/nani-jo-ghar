# Clinic v2 items (CI1-CI5, 30 Sept)

Cut by `python3 build/cut_cook_v3_1.py --only clinic` from `sources/art/clinic-v2/items/` (the five ChatGPT sheets of
`docs/archive/art-prompts/chatgpt-art-prompts-overnight-2026-09-30.md`, CI1-CI5). The method is `docs/archive/process/VISUAL-QA.md` §2's (cut_tick_v2):
colour-to-alpha edges, grey inside loops made transparent (and checked), ChatGPT's drawn shadows removed. Each item is
one piece (the pen torch's drawn light spot on the counter is dropped; the stethoscope keeps all its parts); glass
things (the eye-drop bottle, the cotton-bud pot, the thermometer, the syringe, the honey jar, the milk jug, the two
glasses) are cut see-through, solid only where strongly coloured. Longest side at most 512 px.

- **The plasters (CI4)** share one canvas, each centred on its box (they're all the same size and shape).
- **The jugs (CI5)** share one canvas, registered on the jug's bottom-centre (`anchor`); the hot jug's steam is
  colour-to-alpha above the rim, so it stays a soft veil on any background.
- **The basin** is round and top-down: `cx, cy, r` measured from its rim (`build/check_vessel_meta.py` style).

Not wired yet: for the clinic's pharmacy belt and heal games. Contact sheet: `build/reports/art-v3-1/contact-clinic.png`;
review: `build/reports/art-v3-1.md` §1.

| file | px | sheet | what it is | measured |
|---|---|---|---|---|
| `plasters-box.webp` | 323x328 | CI1 | plasters box |  |
| `bandage-roll.webp` | 364x323 | CI1 | bandage roll |  |
| `tweezers.webp` | 378x177 | CI1 | tweezers |  |
| `cotton-buds.webp` | 268x326 | CI1 | cotton buds |  |
| `eye-drops.webp` | 169x334 | CI1 | eye drops |  |
| `thermometer.webp` | 404x226 | CI1 | thermometer |  |
| `toothbrush.webp` | 374x291 | CI1 | toothbrush |  |
| `filling-paste.webp` | 400x202 | CI1 | filling paste |  |
| `dentist-drill.webp` | 394x212 | CI1 | dentist drill |  |
| `reflex-hammer.webp` | 393x261 | CI2 | reflex hammer |  |
| `stethoscope.webp` | 396x377 | CI2 | stethoscope |  |
| `pen-torch.webp` | 375x284 | CI2 | pen torch |  |
| `syringe.webp` | 397x233 | CI2 | syringe |  |
| `water-jug.webp` | 333x345 | CI2 | water jug |  |
| `cloth-blue.webp` | 399x294 | CI2 | cloth blue |  |
| `blanket-red.webp` | 433x357 | CI2 | blanket red |  |
| `desk-fan.webp` | 322x417 | CI2 | desk fan |  |
| `apple.webp` | 309x331 | CI2 | apple |  |
| `tumbler.webp` | 278x359 | CI3 | tumbler |  |
| `teaspoon.webp` | 412x192 | CI3 | teaspoon |  |
| `honey-jar.webp` | 359x380 | CI3 | honey jar |  |
| `ginger.webp` | 391x344 | CI3 | ginger |  |
| `lemon-half.webp` | 305x302 | CI3 | lemon half |  |
| `turmeric-bowl.webp` | 369x309 | CI3 | turmeric bowl |  |
| `milk-jug.webp` | 351x402 | CI3 | milk jug |  |
| `turmeric-milk.webp` | 313x392 | CI3 | turmeric milk |  |
| `ginger-water.webp` | 309x390 | CI3 | ginger water |  |
| `plaster-red.webp` | 360x175 | CI4 | plaster red | box_w_px 332; box_h_px 146 |
| `plaster-yellow.webp` | 360x175 | CI4 | plaster yellow | box_w_px 330; box_h_px 146 |
| `plaster-blue.webp` | 360x175 | CI4 | plaster blue | box_w_px 332; box_h_px 146 |
| `plaster-green.webp` | 360x175 | CI4 | plaster green | box_w_px 331; box_h_px 146 |
| `plaster-red-yellow.webp` | 360x175 | CI4 | plaster red yellow | box_w_px 332; box_h_px 146 |
| `plaster-red-blue.webp` | 360x175 | CI4 | plaster red blue | box_w_px 331; box_h_px 146 |
| `plaster-red-green.webp` | 360x175 | CI4 | plaster red green | box_w_px 332; box_h_px 146 |
| `plaster-yellow-blue.webp` | 360x175 | CI4 | plaster yellow blue | box_w_px 331; box_h_px 146 |
| `plaster-yellow-green.webp` | 360x175 | CI4 | plaster yellow green | box_w_px 332; box_h_px 146 |
| `plaster-blue-green.webp` | 360x175 | CI4 | plaster blue green | box_w_px 331; box_h_px 145 |
| `plaster-skin.webp` | 360x175 | CI4 | plaster skin | box_w_px 330; box_h_px 145 |
| `jug-hot.webp` | 432x512 | CI5 | jug hot | registered bottom-centre; anchor [0.499, 0.9702] |
| `jug-cold.webp` | 432x512 | CI5 | jug cold | registered bottom-centre; anchor [0.499, 0.9702] |
| `jug-lukewarm.webp` | 432x512 | CI5 | jug lukewarm | registered bottom-centre; anchor [0.499, 0.9702]; grey_left_px 309 |
| `basin.webp` | 509x512 | CI5 | a round steel basin of clear water, top-down (the foot soak) | cx 0.5; cy 0.4969; r 0.4733; fit_px 1.3 |
