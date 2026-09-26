#!/bin/sh
# Slices the cooking sheets from ChatGPT batch 3's run (the second dump, 26 Sept:
# docs/chatgpt-art-prompts-batch2.md sections 1-2, run as part of
# docs/art-run-tonight.md) into assets/cook/items/, as each prompt's
# "slices to:" line says. Originals: sources/art/chatgpt-batch3/.
# The onion, thali sprites replace batch 1's (they were left unwired pending
# this redo). Report: build/reports/chatgpt-batch-3-dump-2.md.
# Re-run from the repo root.
set -e
S=sources/art/chatgpt-batch3
O=assets/cook/items
P="python3 build/slice_sheet.py"

# b2 1.2: the onion, whole and peeled (grey)
$P $S/sheet-dungri-t-v2.png 2 1 $O --key grey \
  veg-dungri-whole-t veg-dungri-peeled-t

# b2 1.5: the thali, round (grey)
$P $S/vessel-thali-t-v2.png 1 1 $O --key grey \
  vessel-thali-t

# b2 2.1: bajri (millet) maani (magenta)
$P $S/sheet-bajr-maani-t-v1.png 3 2 $O \
  dough-bajr-ball-t maani-bajr-raw-t maani-bajr-raw-torn-t \
  maani-bajr-cooked-half-t maani-bajr-cooked-puffed-t maani-bajr-burnt-t

# b2 2.2: hob knob off/on (grey) and flame rings. The pack said --glass for the
# flames, but that left a grey-tan rim and a faint grey haze in the ring's
# empty centre; build/cut_glow.py's minimal-alpha un-mix cuts them cleanly.
$P $S/sheet-hob-parts-t-v1.png 2 2 $O --key grey \
  hob-knob-off-t hob-knob-on-t - -
python3 build/cut_glow.py $S/sheet-hob-parts-t-v1.png 2 2 $O \
  - - flame-ring-high-t flame-ring-low-t

# b2 2.3: chai tray, jiko grill, potato cube (grey)
$P $S/sheet-tray-grill-t-v1.png 3 1 $O --key grey \
  tray-chai-t grill-jiko-t mishkaki-bataato-raw-t

# b2 2.4: samosa fold stages and the pale fried samosa (magenta)
$P $S/sheet-samosa-folds-t-v1.png 3 1 $O \
  samosa-fold-1-t samosa-fold-2-t samosa-fried-pale-t

# b2 2.5: pantry veg, front view (magenta). No --keep-purple, against the pack:
# this onion is copper-red, far from the key, and --keep-purple left magenta
# in its root tuft (and in the garlic's).
$P $S/sheet-veg-whole-f-v1.png 3 2 $O \
  veg-dungri-whole-f veg-tameto-whole-f veg-lasan-whole-f \
  veg-marcha-whole-f veg-aadu-whole-f veg-bataato-whole-f

# b2 2.6: pantry containers, front view (grey; glass jars and jug as glass)
$P $S/sheet-pantry-containers-f-v1.png 4 2 $O --key grey \
  --glass jar-daal-f,jug-dudh-f,jar-khun-f,jar-elchi-f \
  jar-atto-f jar-daal-f tin-chai-f jug-dudh-f \
  jar-khun-f jar-elchi-f jar-loon-f -

# b2 2.7: chaat layers, loose scatters (magenta; red onion spared the despill)
$P $S/sheet-chaat-layers-t-v1.png 4 3 $O --keep-purple layer-dungri-chopped-t \
  layer-channa-t layer-bataato-boiled-t layer-dai-t layer-amli-t \
  layer-lili-t layer-dungri-chopped-t layer-tameto-chopped-t layer-marcha-chopped-t \
  layer-dhana-chopped-t layer-sev-t - -

# Sizes. Batch 1's masters came off 4x3 sheets at about 250-400 px; these
# sheets have fewer, bigger cells. Each sheet is scaled by one factor (so its
# own relative sizes stay):
#  - sets that swap in place with a batch-1 sprite match it exactly: the bajri
#    raw maani = the wheat raw maani's width; the pale fried samosa = the
#    golden one's width (fold stages follow);
#  - everything else: the sheet's longest sprite at most 512 px.
F="python3 build/fit_sprites.py"
$F match:$O/maani-raw-t.png:$O/maani-bajr-raw-t.png \
  $O/dough-bajr-ball-t.png $O/maani-bajr-raw-t.png $O/maani-bajr-raw-torn-t.png \
  $O/maani-bajr-cooked-half-t.png $O/maani-bajr-cooked-puffed-t.png $O/maani-bajr-burnt-t.png
$F match:$O/samosa-fried-golden-t.png:$O/samosa-fried-pale-t.png \
  $O/samosa-fold-1-t.png $O/samosa-fold-2-t.png $O/samosa-fried-pale-t.png
$F max:512 $O/veg-dungri-whole-t.png $O/veg-dungri-peeled-t.png
$F max:512 $O/vessel-thali-t.png
$F max:512 $O/hob-knob-off-t.png $O/hob-knob-on-t.png $O/flame-ring-high-t.png $O/flame-ring-low-t.png
$F max:512 $O/tray-chai-t.png $O/grill-jiko-t.png $O/mishkaki-bataato-raw-t.png
$F max:512 $O/veg-dungri-whole-f.png $O/veg-tameto-whole-f.png $O/veg-lasan-whole-f.png \
  $O/veg-marcha-whole-f.png $O/veg-aadu-whole-f.png $O/veg-bataato-whole-f.png
$F max:512 $O/jar-atto-f.png $O/jar-daal-f.png $O/tin-chai-f.png $O/jug-dudh-f.png \
  $O/jar-khun-f.png $O/jar-elchi-f.png $O/jar-loon-f.png
$F max:512 $O/layer-channa-t.png $O/layer-bataato-boiled-t.png $O/layer-dai-t.png $O/layer-amli-t.png \
  $O/layer-lili-t.png $O/layer-dungri-chopped-t.png $O/layer-tameto-chopped-t.png \
  $O/layer-marcha-chopped-t.png $O/layer-dhana-chopped-t.png $O/layer-sev-t.png
