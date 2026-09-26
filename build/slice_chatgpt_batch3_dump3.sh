#!/bin/sh
# Slices ChatGPT batch 3's third dump (26 Sept, 48 unique images, no run log:
# matched to their prompts by eye) as each pack's "slices to:" / "cuts to:"
# line says. Originals: sources/art/chatgpt-batch3/. Report:
# build/reports/chatgpt-batch-3-dump-3.md. Nothing here is wired into the
# game. Re-run from the repo root.
#
# Not cut on purpose (see the report): the new people's sheets and line-ups
# (they wait for Zafar's approval), the alternate takes of batch 2 sheets
# that dump 2 already sliced (*-v2 / sheet-dungri-t-v3: dump 2's were as good
# or better), and the two relights that moved (sitting room night, courtyard
# evening).
set -e
S=sources/art/chatgpt-batch3
O=assets/cook/items
P="python3 build/slice_sheet.py"
F="python3 build/fit_sprites.py"
B="python3 build/cut_boxes.py"

# ---------------------------------------------------------------- Cook
# cook 2.1: the chai glass, three-quarter from above, empty (grey, glass)
$P $S/vessel-glass-chai-top-t-v1.png 1 1 $O --key grey --glass vessel-glass-chai-top-t \
  vessel-glass-chai-top-t
# cook 2.2: the skewer rack, plain (grey; the gap between the rails keys out)
$P $S/vessel-skewer-rack-t-v1.png 1 1 $O --key grey vessel-skewer-rack-t
# b2 1.3 and 1.4: the velan and chakla redos (grey), replacing batch 1's
# (both are on data/cook.json's left-out list, so nothing in the game changes)
$P $S/tool-velan-t-v2.png 1 1 $O --key grey tool-velan-t
$P $S/tool-chakla-t-v2.png 1 1 $O --key grey tool-chakla-t
# b2 2.3's tray, regenerated alone: flat with a low rim (dump 2's was a deep
# pan with loop handles); replaces dump 2's tray-chai-t
$P $S/tray-chai-t-v2.png 1 1 $O --key grey tray-chai-t
$F max:512 $O/vessel-glass-chai-top-t.png
$F max:512 $O/vessel-skewer-rack-t.png
$F max:512 $O/tool-velan-t.png
$F max:512 $O/tool-chakla-t.png
$F max:512 $O/tray-chai-t.png

# cook 1.5-1.10: the counter moods, cut with build/cut_characters.py's boxes
# into assets/cook/characters/next/ (not over the live files)
python3 build/cut_counter_moods.py

# b2 1.1: the worktop, golden evening (a relight: native PNG plus a q90 WebP
# beside the day and night, as batch 1's backgrounds)
cp $S/bg-cook-worktop-t-evening-v1.png assets/cook/bg/
python3 -c "from PIL import Image; Image.open('assets/cook/bg/bg-cook-worktop-t-evening-v1.png').save('assets/cook/bg/bg-cook-worktop-t-evening-v1.webp', 'WEBP', quality=90, method=6)"

# ---------------------------------------------------------------- family
# b3 1.2-1.4: feelings, 4x3 (grey), head-and-shoulders layers for every mode
for who in nana ma ali; do
  $P $S/char-$who-feelings-v1.png 4 3 assets/characters/$who --key grey \
    $who-feeling-happy $who-feeling-sad $who-feeling-scared $who-feeling-poorly \
    $who-feeling-tired $who-feeling-better $who-feeling-ouch $who-feeling-sneeze \
    $who-feeling-hot $who-feeling-cold $who-feeling-notme $who-feeling-caught
  $F max:512 assets/characters/$who/$who-feeling-*.png
done

# ---------------------------------------------------------------- animals
# b3 4.1-4.3: nine poses each, cut by hand-set boxes (grey); swatches and the
# chick sheet's hen-and-chick size panel stay on the sheet as references.
# The chick's down is cut --fluffy (an 8 px soft edge band: 2 px left grey wisps)
$B $S/char-goat-v1.png assets/characters/goat \
  goat-front=79,27,301,481 goat-three-quarter=393,27,712,476 goat-side=730,26,1163,471 \
  goat-back=1265,29,1445,478 goat-walk=4,504,372,865 goat-graze=375,530,727,858 \
  goat-jump=728,484,1039,784 goat-lie=975,596,1278,862 goat-bleat=1303,485,1526,876
$B $S/char-hen-v1.png assets/characters/hen \
  hen-front=85,35,343,449 hen-three-quarter=429,37,707,452 hen-side=744,38,1135,453 \
  hen-back=1208,35,1452,452 hen-walk=21,491,361,862 hen-peck=361,518,669,863 \
  hen-flap=615,465,1004,841 hen-sit=966,602,1242,862 hen-cluck=1243,482,1514,862
$B $S/char-chick-v1.png assets/characters/chick --fluffy \
  chick-front=42,156,280,470 chick-three-quarter=292,164,527,472 chick-side=542,168,800,470 \
  chick-back=823,167,1053,469 chick-run=5,544,244,802 chick-peck=245,587,484,800 \
  chick-hop=485,523,677,782 chick-sit=677,590,887,808 chick-cheep=898,538,1095,805
for a in goat hen chick; do $F max:512 assets/characters/$a/$a-*.png; done

# ---------------------------------------------------------------- backgrounds
# b3 3.1 and 3.2: the courtyard and the sitting room (day), native PNG + WebP.
# The 16:9 crops and occluder cut-outs wait for each scene's wiring.
for n in bg-courtyard-e-v1 bg-sitting-room-e-v1; do
  cp $S/$n.png assets/backgrounds/
  python3 -c "from PIL import Image; Image.open('assets/backgrounds/$n.png').save('assets/backgrounds/$n.webp', 'WEBP', quality=90, method=6)"
done

# ---------------------------------------------------------------- the clinic
# b3 5.1-5.3: the rooms (native PNG + WebP), listed in data/clinic/rough-art.json's `final`
mkdir -p assets/clinic/rooms
for n in bg-clinic-waiting-e-v1 bg-clinic-room-e-v1 bg-clinic-pharmacy-e-v1; do
  cp $S/$n.png assets/clinic/rooms/
  python3 -c "from PIL import Image; Image.open('assets/clinic/rooms/$n.png').save('assets/clinic/rooms/$n.webp', 'WEBP', quality=90, method=6)"
done
# b3 7.2-7.4: "where it hurts", seated, 4x1 (grey)
C=assets/clinic/patients
for who in nana ma ali; do
  $P $S/char-$who-hurts-v1.png 4 1 $C/$who --key grey $who-sit $who-sit-head $who-sit-tummy $who-sit-knee
  $F max:512 $C/$who/$who-sit*.png
done
# b3 6.7 and 6.8: the old man and old woman in four colours, waist up, 4x1 (grey)
$P $S/char-clinic-oldman-colours-v1.png 4 1 $C/old-man --key grey \
  clinic-oldman-waist-blue clinic-oldman-waist-green clinic-oldman-waist-yellow clinic-oldman-waist-red
$P $S/char-clinic-oldwoman-colours-v1.png 4 1 $C/old-woman --key grey \
  clinic-oldwoman-waist-blue clinic-oldwoman-waist-green clinic-oldwoman-waist-yellow clinic-oldwoman-waist-purple
$F max:512 $C/old-man/clinic-oldman-waist-*.png
$F max:512 $C/old-woman/clinic-oldwoman-waist-*.png
# the clinic's manifest points at WebPs (as the rough art does): one per PNG,
# then the `final` block in data/clinic/rough-art.json (rough entries untouched)
python3 build/clinic_final_art.py
