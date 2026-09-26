#!/bin/sh
# Slices ChatGPT batch 1's item sheets (docs/chatgpt-art-prompts.md, section 3)
# into assets/cook/items/. Names: <group>-<item>-<state>-<view>, Kutchi where
# data/cook.json has the word (dungri, jeeru...), English otherwise.
# --keep-purple spares red onion from the magenta despill (it is nearly the
# key's hue). Report: build/reports/chatgpt-batch-1.md. Re-run from the repo root.
set -e
S=sources/art/chatgpt
O=assets/cook/items
P="python3 build/slice_sheet.py"

$P $S/sheet-spices-t-v1.png 4 3 $O \
  spice-hardar-bowl-t spice-lal-marcha-bowl-t spice-jeeru-bowl-t spice-rai-bowl-t \
  spice-elchi-bowl-t spice-loon-bowl-t dry-khun-bowl-t dry-chai-leaves-bowl-t \
  dry-atto-bowl-t dry-daal-bowl-t dry-ghee-bowl-t veg-aadu-grated-bowl-t

$P $S/sheet-veg-whole-t-v1.png 4 3 $O --keep-purple veg-dungri-whole-t,veg-dungri-peeled-t \
  veg-dungri-whole-t veg-tameto-whole-t veg-bataato-whole-t veg-bataato-peeled-t \
  veg-lasan-whole-t veg-lasan-clove-t veg-marcha-whole-t veg-aadu-whole-t \
  veg-limu-whole-t veg-pepper-whole-t veg-dhana-bunch-t veg-dungri-peeled-t

$P $S/sheet-veg-cut-t-v1.png 4 3 $O --keep-purple veg-dungri-halved-t,veg-dungri-chopped-t \
  veg-dungri-halved-t veg-dungri-chopped-t veg-tameto-halved-t veg-tameto-chopped-t \
  veg-bataato-halved-t veg-bataato-cubed-t veg-lasan-chopped-t veg-marcha-chopped-t \
  veg-aadu-chopped-t veg-dhana-chopped-t veg-limu-halved-t veg-limu-wedge-t

$P $S/sheet-toppings-t-v1.png 4 3 $O --keep-purple topping-dungri-chopped-bowl-t \
  topping-channa-bowl-t topping-bataato-boiled-bowl-t topping-dai-bowl-t topping-amli-bowl-t \
  topping-lili-bowl-t topping-dungri-chopped-bowl-t topping-tameto-chopped-bowl-t topping-marcha-chopped-bowl-t \
  topping-dhana-chopped-bowl-t topping-sev-bowl-t topping-vatana-bowl-t topping-keema-bowl-t

$P $S/sheet-dough-t-v1.png 4 3 $O \
  dough-rough-t dough-ball-t maani-raw-t maani-raw-torn-t \
  maani-cooked-half-t maani-cooked-puffed-t maani-burnt-t samosa-pastry-strip-t \
  samosa-filled-t samosa-folded-t samosa-fried-golden-t samosa-burnt-t

$P $S/sheet-mishkaki-pieces-t-v1.png 4 3 $O \
  --keep-purple mishkaki-dungri-raw-t,mishkaki-dungri-grilled-t,mishkaki-dungri-charred-t \
  mishkaki-meat-raw-t mishkaki-pepper-raw-t mishkaki-dungri-raw-t mishkaki-tameto-raw-t \
  mishkaki-meat-grilled-t mishkaki-pepper-grilled-t mishkaki-dungri-grilled-t mishkaki-tameto-grilled-t \
  mishkaki-meat-charred-t mishkaki-pepper-charred-t mishkaki-dungri-charred-t mishkaki-tameto-charred-t

$P $S/sheet-serving-t-v1.png 4 3 $O --keep-purple chaat-bowl-full-t,skewer-mixed-grilled-t \
  skewer-empty-t skewer-meat-raw-t skewer-meat-grilled-t skewer-meat-charred-t \
  chips-raw-t chips-golden-t chips-burnt-t chaat-bowl-empty-t \
  chaat-bowl-full-t plate-enamel-empty-t mishkaki-plated-t skewer-mixed-grilled-t

$P $S/sheet-vessels-v1.png 4 3 $O --key grey \
  --glass vessel-glass-chai-empty-f,vessel-glass-chai-full-f \
  vessel-saucepan-t vessel-pot-t vessel-tadka-pan-t vessel-tawa-t \
  vessel-kadai-oil-t vessel-thali-t vessel-katori-t vessel-masala-dabba-t \
  vessel-water-jug-f vessel-milk-jug-f vessel-glass-chai-empty-f vessel-glass-chai-full-f

$P $S/sheet-tools-v1.png 4 3 $O --key grey \
  --sheer tool-tea-strainer-t,tool-chips-basket-t \
  tool-knife-t tool-ladle-t tool-spatula-t tool-slotted-spoon-t \
  tool-tongs-t tool-teaspoon-t tool-tea-strainer-t tool-chips-basket-t \
  tool-velan-t tool-chakla-t tool-board-t tool-wooden-spoon-t
