#!/usr/bin/env python3
"""Rough placeholder art for the clinic: generates sprite sheets with the
OpenAI Images API (gpt-image-1, medium quality only), keeps the raw sheets
here, and logs the real cost from each response's token usage.

    python3 sources/art/clinic-rough/gen_sheets.py --estimate
    python3 sources/art/clinic-rough/gen_sheets.py [--only sheet,sheet] [--redo] [--budget 5]

Slicing is sources/art/clinic-rough/slice_sheets.py. Throwaway art: the real
art comes later from ChatGPT.
"""
import argparse
import base64
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor

import requests

HERE = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(HERE, "cost-log.json")
MODEL = "gpt-image-1"
# Medium quality prices (image output), plus text input at $5 / 1M tokens.
PRICE = {"1024x1024": 0.042, "1536x1024": 0.063, "1024x1536": 0.063}
OUT_PER_TOKEN = 40 / 1e6
IN_TEXT_PER_TOKEN = 5 / 1e6
BUDGET = 5.00

STYLE = ("Stylised 3D animated family-film look: soft warm global illumination, gentle rounded "
         "simplified shapes, slightly chunky cute proportions, clean surfaces, bright warm palette, "
         "no outlines. Friendly and comical, for a children's game; every object must read clearly "
         "when small.")
SHEET = ("This is a SPRITE SHEET: a {rows} x {cols} grid ({n} cells). Exactly one separate object in "
         "each cell, centred in its cell, all at a similar size filling about 65% of the cell, with wide "
         "empty gaps between them so nothing touches or overlaps. The background is a perfectly flat, "
         "uniform, plain mid-grey (#808080) everywhere, with no gradient, no floor, no cast shadows, "
         "no reflections, no grid lines, no borders, no labels, no text, no numbers.")
NEG = ("Do not add any text, letters, numbers, logos or watermarks. Correct anatomy: five fingers per "
       "hand. No blood, nothing gory. No bindi or tilak.")

PEOPLE_STYLE = ("South Asian (Kutchi Muslim) family, warm brown skin, big expressive eyes, rosy cheeks, "
                "simple readable mouths.")


def grid(rows, cols, cells):
    order = []
    for r in range(rows):
        row = cells[r * cols:(r + 1) * cols]
        order.append(f"Row {r + 1}, left to right: " + "; ".join(c[1] for c in row) + ".")
    return " ".join(order)


def item_sheet(name, rows, cols, cells, size="1024x1024", extra=""):
    assert len(cells) == rows * cols, name
    prompt = " ".join([STYLE, SHEET.format(rows=rows, cols=cols, n=rows * cols), extra,
                       grid(rows, cols, cells), NEG])
    return {"name": name, "kind": "grid", "rows": rows, "cols": cols,
            "ids": [c[0] for c in cells], "size": size, "prompt": prompt}


PATIENT_FACES = [("neutral", "sitting calmly, neutral friendly face, hands in lap"),
                 ("ouch", "wincing 'ouch!' face, eyes squeezed, one hand hovering near the knee"),
                 ("giggle", "giggling, eyes closed with laughter, shoulders up"),
                 ("relief", "relieved sigh, eyes half closed, soft smile, shoulders dropped"),
                 ("happy", "big happy beaming smile, eyes open and bright, hands in lap"),
                 ("wave", "happy, waving one hand hello/goodbye")]


EXTRA_FACES = [("sad", "sad, droopy eyebrows, small frown, shoulders slumped (comic, not crying)"),
               ("scared", "a little scared, eyes wide, hands up near the chin, comic worried wobbly mouth")]


def patient_sheet(pid, who, faces=None, cols=3, seat=True):
    faces = faces or PATIENT_FACES
    rows = len(faces) // cols
    cells = [(f"{pid}-{k}", f"the same {who}, {d}") for k, d in faces]
    pose = ("sitting on a small plain wooden stool, facing the viewer, whole figure and stool visible"
            if seat else "standing, facing the viewer, whole figure visible from head to shoes")
    prompt = " ".join([
        STYLE, PEOPLE_STYLE,
        f"This is a CHARACTER SHEET of ONE character: a {rows} x {cols} grid ({len(cells)} cells), the SAME "
        f"character {len(cells)} times, "
        "identical clothes, hair and colours in every cell, each a full-body front view, symmetrical, "
        f"{pose}, centred "
        "in its cell with wide empty gaps between cells so no figures touch. The background is a perfectly "
        "flat uniform plain mid-grey (#808080), no floor, no cast shadows, no grid lines, no borders, no text.",
        f"The character: {who}.",
        grid(rows, cols, cells),
        NEG])
    return {"name": f"patient-{pid}", "kind": "grid", "rows": rows, "cols": cols,
            "ids": [c[0] for c in cells], "size": "1536x1024", "prompt": prompt, "group": "patients"}


def room_sheet(name, desc):
    prompt = " ".join([STYLE, "A game background, wide landscape, eye-level camera, empty of people, "
                       "uncluttered, with clear open floor and surfaces for game characters and items to "
                       "be placed on later. Warm limewashed walls, a few Kutch accents (mirror-work, "
                       "ajrakh print). Modern and clean.", desc, NEG, "No people. No text or signs."])
    return {"name": name, "kind": "room", "ids": [name], "size": "1536x1024", "prompt": prompt,
            "group": "rooms"}


SHEETS = [
    item_sheet("items-a", 4, 4, [
        ("bandage-red", "a rolled red crepe bandage roll"),
        ("bandage-blue", "a rolled blue crepe bandage roll"),
        ("bandage-green", "a rolled green crepe bandage roll"),
        ("bandage-yellow", "a rolled yellow crepe bandage roll"),
        ("plaster", "a plain beige sticking plaster (band-aid), flat, seen from above"),
        ("plaster-cat", "a sticking plaster with a cute cat face print, seen from above"),
        ("plaster-stars", "a blue sticking plaster with little yellow stars, seen from above"),
        ("plaster-hearts", "a pink sticking plaster with little red hearts, seen from above"),
        ("drops-red", "a small red eye-drop squeeze bottle with a pointed cap"),
        ("drops-green", "a small green eye-drop squeeze bottle with a pointed cap"),
        ("drops-blue", "a small blue eye-drop squeeze bottle with a pointed cap"),
        ("drops-yellow", "a small yellow eye-drop squeeze bottle with a pointed cap"),
        ("thermometer", "a chunky cartoon digital thermometer, white and blue, blank screen"),
        ("stethoscope", "a doctor's stethoscope coiled neatly, silver and dark blue"),
        ("torch", "a small pen torch / medical flashlight, switched off"),
        ("reflex-hammer", "a doctor's reflex hammer with a red triangular rubber head"),
    ]),
    item_sheet("items-b", 4, 4, [
        ("syringe", "a huge comical cartoon toy syringe with red and white candy stripes and a tiny flag on the end, no needle visible"),
        ("toothbrush", "a child's toothbrush, green handle"),
        ("toothpaste", "a toothpaste tube, blank white and blue, no text"),
        ("tissues", "a box of tissues with one tissue poking out"),
        ("towel", "a folded fluffy white towel with a blue stripe"),
        ("bowl-water", "a round white bowl of clear blue water"),
        ("foot-basin", "a wide shallow plastic foot tub / basin, turquoise, empty"),
        ("cotton-bud", "three cotton buds (Q-tips) lying together"),
        ("tweezers", "a pair of silver tweezers"),
        ("lemon", "a bright yellow lemon (limu)"),
        ("salt-pot", "a small steel pot of white salt with a tablespoon in it"),
        ("sugar-pot", "a small glass pot of white sugar with a lid"),
        ("cup", "a plain steel tumbler cup"),
        ("jug-water", "a small steel water jug with a spout"),
        ("cloth", "a small folded pale blue wash cloth"),
        ("ice-pack", "a pale blue gel ice pack with little ice cubes pattern"),
    ]),
    item_sheet("items-c", 4, 4, [
        ("blanket-red", "a neatly folded red blanket"),
        ("blanket-blue", "a neatly folded blue blanket"),
        ("blanket-green", "a neatly folded green blanket"),
        ("pillow", "a small plump white pillow"),
        ("hot-water-bottle", "a red rubber hot-water bottle"),
        ("cast-blue", "a roll of blue plaster-cast bandage"),
        ("cast-pink", "a roll of pink plaster-cast bandage"),
        ("cast-white", "a roll of white plaster-cast bandage"),
        ("crutches", "a pair of child-size wooden crutches side by side"),
        ("xray-plate", "a dark blue X-ray film sheet showing a simple white cartoon leg bone"),
        ("lollipop", "a round swirly rainbow lollipop on a stick"),
        ("cotton-wool", "a fluffy white ball of cotton wool"),
        ("thread-red", "a spool of red thread"),
        ("thread-blue", "a spool of blue thread"),
        ("thread-green", "a spool of green thread"),
        ("fan", "a folded paper hand fan, colourful, opened out"),
    ]),
    item_sheet("items-d", 4, 4, [
        ("dropper", "a glass medicine dropper with a rubber bulb, lying diagonally"),
        ("eye-patch-pirate", "a black pirate eye patch with a strap"),
        ("eye-patch-bandhani", "an eye patch in red bandhani tie-dye dot fabric with a strap"),
        ("pointer", "a long thin wooden teacher's pointer stick with a red tip, diagonal"),
        ("dental-drill", "a tiny cute cartoon dentist drill, white and mint green"),
        ("filling", "a small white blob of tooth filling paste on a tiny spatula"),
        ("bug-jar", "an empty small glass jar with a cork lid"),
        ("needle", "a big blunt cartoon sewing needle with an eye, silver, diagonal"),
        ("honey-jar", "a small jar of golden honey with a wooden dipper"),
        ("syrup", "a brown bottle of cough syrup with a measuring cup cap"),
        ("med-green", "a small round medicine bottle with a green label and white cap, no text"),
        ("med-red", "a small round medicine bottle with a red label and white cap, no text"),
        ("med-blue", "a small round medicine bottle with a blue label and white cap, no text"),
        ("dental-mirror", "a small dentist's mouth mirror"),
        ("soap", "a bar of pale pink soap with bubbles"),
        ("doctor-bag", "a brown leather doctor's bag, closed"),
    ]),
    item_sheet("parts-a", 3, 3, [
        ("part-knee", "a child's bare leg bent at the knee seen from the side, from mid-thigh to the ankle, the knee clearly the front point, brown skin, clean cut ends"),
        ("part-ear", "a close-up of one big cartoon ear (side of the head only), brown skin"),
        ("part-mouth", "a wide-open cartoon mouth close-up showing a neat row of big white teeth top and bottom, pink gums, lips, brown skin"),
        ("part-tongue", "a cartoon mouth close-up sticking out a big pink tongue, brown skin"),
        ("part-eye", "a close-up of one big friendly cartoon eye with eyebrow and eyelashes, brown skin around it"),
        ("part-foot", "a bare foot standing flat, seen from the front and slightly above, exactly five separate round toes (big toe on the left, getting smaller to the right), brown skin"),
        ("part-forearm", "a close-up of a child's forearm lying horizontally, bare, brown skin, hand at one end with five fingers"),
        ("part-head", "a close-up of a child's head and forehead, front view, black hair, neutral face, brown skin"),
        ("part-hand", "a close-up of an open hand, palm facing the viewer, exactly five fingers, brown skin"),
    ], extra="All skin is the same warm brown tone. Only the body part itself in each cell, cropped softly, no clothing except a sleeve edge where needed. Crisp clean edges everywhere: no blur, no fade, no vignette. Do not draw any lines or frames between cells."),
    item_sheet("overlays", 3, 3, [
        ("sore-swirl", "a soft pink glowing swirl mark (a cartoon sore spot marker), flat"),
        ("scrape", "a cartoon scrape: a small patch of light pink grazed lines, no blood"),
        ("cut", "a cartoon cut: a short pink zig-zag line with small dots either side, no blood"),
        ("bump", "a cartoon bump: a round shiny pinkish-red lump like a little dome"),
        ("seed", "a single sesame seed, big and cute"),
        ("bead", "a single round shiny purple bead"),
        ("marble", "a glass marble with a swirl inside"),
        ("tiny-sock", "a tiny striped sock"),
        ("sugar-bug", "a cute tiny cartoon beetle with big eyebrows (the sugar bug), green"),
    ]),
    item_sheet("ui", 3, 3, [
        ("tray-3", "an empty wooden serving tray seen from above with three round empty white dishes in a row"),
        ("tray-4", "an empty wooden serving tray seen from above with four round empty white dishes in a row"),
        ("dish", "one round empty white dish seen from slightly above"),
        ("tick", "a big chunky bright green tick / check mark, 3D, glossy"),
        ("bulb", "a big glowing yellow cartoon light bulb, 3D"),
        ("tally-frame", "an empty rounded wooden picture frame, landscape, blank cream inside"),
        ("eye-chart", "an optician's eye chart board, but with small pictures instead of letters: rows of simple fruit and cup pictures getting smaller row by row, a tiny green parrot on the smallest row; no letters at all"),
        ("star", "a big chunky golden 3D star"),
        ("thorn", "a single small brown thorn, curved"),
    ]),
    patient_sheet("girl", "a little girl about 6 years old, two black plaits, yellow kurta with small embroidery, pink trousers"),
    patient_sheet("boy", "a little boy about 7 years old, short black hair, orange t-shirt and blue shorts"),
    patient_sheet("old-man", "a kind old man, white beard, white topi cap, cream kurta, brown waistcoat, glasses"),
    patient_sheet("old-woman", "a kind old woman, grey hair under a loose cream dupatta, lilac shalwar kameez, glasses"),
    patient_sheet("baby", "a young mother in a teal dupatta and green kameez holding a chubby baby on her lap (the baby is the patient; the mother is calm); the face descriptions below are the BABY's expression"),
    patient_sheet("nana", "Nana, a cheerful grandfather, grey moustache and short grey hair, navy waistcoat over a white kurta, a round belly"),
    patient_sheet("ma", "Ma, a young mother in her thirties, black hair under a soft mustard dupatta, maroon kameez"),
    patient_sheet("ali", "Ali, a cheeky boy about 9, messy black hair, green hoodie, jeans"),
    room_sheet("room-waiting", "The waiting room of a small friendly doctor's clinic: a long wooden bench along the back wall under a window, a door on the right, a potted plant, a few children's posters with pictures only. Leave the bench empty."),
    room_sheet("room-exam", "A small friendly doctor's examination room: a padded examination bench/couch in the centre facing the viewer, a small wooden side table, a cabinet with glass jars, a sink on the left. Leave the bench empty."),
    room_sheet("room-pharmacy", "A small clinic pharmacy counter: a long wooden counter across the front with a flat conveyor belt running along its top from right to left, dispensary shelves with jars and boxes behind it. The belt surface is empty."),
]
SHEETS.append(item_sheet("items-e", 3, 3, [
    ("cotton-bud", "three white cotton buds (Q-tips) with pink sticks, lying together"),
    ("cup", "a bright blue enamel cup with a handle"),
    ("jug-water", "a bright red enamel water jug with a spout and handle"),
    ("salt-pot", "a small white ceramic pot full of white salt with a wooden spoon in it"),
    ("sugar-pot", "a small glass jar of white sugar with an orange lid"),
    ("cloth", "a small folded pale yellow wash cloth"),
    ("dental-mirror", "a dentist's mouth mirror with a bright green handle"),
    ("tweezers", "a pair of golden tweezers"),
    ("lollipop-red", "a round red lollipop on a white stick"),
], extra="Nothing is grey or silver: every object is brightly coloured."))

# Round 2 (coverage pass): the kinds, the doctor, the heal games' missing items.
EIGHT = PATIENT_FACES + EXTRA_FACES
SHEETS += [
    patient_sheet("auntie", "an auntie in her forties, plump and smiling, black hair in a bun under a bright pink dupatta, pink and orange kameez", EIGHT, 4),
    patient_sheet("uncle", "an uncle in his forties, black moustache, neat short black hair, sky-blue kurta, a small round belly", EIGHT, 4),
    patient_sheet("nani", "Nani, a warm grandmother, silver hair in a bun under a white dupatta with a thin green border, green shalwar kameez, round glasses", EIGHT, 4),
    patient_sheet("bigma", "Big Ma, a tall jolly great-aunt, grey plait, big maroon shawl over a mustard kameez, gold bangles", EIGHT, 4),
    patient_sheet("cousin", "the cousin, a boy about 8, curly black hair, big ears, red and white striped t-shirt, grey shorts", EIGHT, 4),
    patient_sheet("doctor", "the doctor, a friendly young man with a short neat black beard, white doctor's coat over a teal shirt, a stethoscope round his neck", [
        ("neutral", "hands folded in front, calm friendly smile, looking at the viewer"),
        ("talk", "talking, one open hand raised as if explaining, mouth open"),
        ("point", "pointing to his left with one finger, friendly"),
        ("thumbs", "big grin and a thumbs-up"),
        ("syringe", "holding a huge comical toy syringe with red and white candy stripes (no needle), cheeky grin"),
        ("happy", "laughing happily, arms open wide"),
    ], 3, seat=False),
    {**item_sheet("moods-a", 2, 4, [
        ("girl-sad", "the girl from the first reference image, sad"),
        ("boy-sad", "the boy from the second reference image, sad"),
        ("old-man-sad", "the old man from the third reference image, sad"),
        ("old-woman-sad", "the old woman from the fourth reference image, sad"),
        ("girl-scared", "the same girl, a little scared"),
        ("boy-scared", "the same boy, a little scared"),
        ("old-man-scared", "the same old man, a little scared"),
        ("old-woman-scared", "the same old woman, a little scared"),
    ], size="1536x1024", extra=("Each cell is one of the characters from the reference images: exactly the same "
                               "character design, clothes and colours, full body, sitting on the same small wooden "
                               "stool, front view. 'Sad' means droopy eyebrows and a small frown, shoulders slumped, "
                               "comic, not crying. 'A little scared' means eyes wide, hands up near the chin, a "
                               "wobbly worried mouth, comic.")),
     "group": "patients", "refs": ["patient-girl", "patient-boy", "patient-old-man", "patient-old-woman"]},
    {**item_sheet("moods-b", 2, 4, [
        ("baby-sad", "the mother and baby from the first reference image, the BABY sad"),
        ("nana-sad", "the grandfather from the second reference image, sad"),
        ("ma-sad", "the young mother from the third reference image, sad"),
        ("ali-sad", "the boy from the fourth reference image, sad"),
        ("baby-scared", "the same mother and baby, the BABY a little scared"),
        ("nana-scared", "the same grandfather, a little scared"),
        ("ma-scared", "the same young mother, a little scared"),
        ("ali-scared", "the same boy, a little scared"),
    ], size="1536x1024", extra=("Each cell is one of the characters from the reference images: exactly the same "
                               "character design, clothes and colours, full body, sitting on the same small wooden "
                               "stool, front view. 'Sad' means droopy eyebrows and a small frown, shoulders slumped, "
                               "comic, not crying. 'A little scared' means eyes wide, hands up near the chin, a "
                               "wobbly worried mouth, comic.")),
     "group": "patients", "refs": ["patient-baby", "patient-nana", "patient-ma", "patient-ali"]},
    item_sheet("items-f", 4, 4, [
        ("jug-hot", "a bright red enamel jug of hot water with three big curly white steam swirls rising from it"),
        ("jug-cold", "a bright blue enamel jug of cold water with ice cubes poking out of the top and a frosty rim"),
        ("chilli", "one bright green chilli pepper"),
        ("milk-glass", "a tall glass of white milk"),
        ("chai-cup", "a small glass cup of milky brown chai on a saucer"),
        ("comb", "a bright orange plastic hair comb"),
        ("spoon", "a shiny steel tablespoon, diagonal"),
        ("sticker", "a round shiny sticker with a big smiling star on it, peeling up at one edge"),
        ("plaster-red", "a plain bright red sticking plaster (band-aid), flat, seen from above"),
        ("plaster-blue", "a plain bright blue sticking plaster (band-aid), flat, seen from above"),
        ("plaster-green", "a plain bright green sticking plaster (band-aid), flat, seen from above"),
        ("plaster-yellow", "a plain bright yellow sticking plaster (band-aid), flat, seen from above"),
        ("plaster-spots", "a white sticking plaster with big colourful polka dots, seen from above"),
        ("foot-bath", "a wide shallow turquoise foot tub full of clear blue water with bubbles"),
        ("fever-strip", "a forehead fever strip: a flat rounded rectangle strip with a rainbow colour scale, no numbers"),
        ("bandage-white", "a rolled white crepe bandage roll"),
    ], extra="Nothing is grey or silver unless stated: every object is brightly coloured."),
    item_sheet("overlays-b", 4, 4, [
        ("foam", "a fluffy cluster of white toothpaste foam bubbles"),
        ("sparkle", "a bright four-pointed white and yellow twinkle sparkle"),
        ("stitches", "a short row of five neat blue criss-cross stitches, like cartoon sewing stitches, flat, no skin"),
        ("drop-blue", "a single big glossy light-blue water droplet"),
        ("steam", "a single soft white curly steam puff"),
        ("beam", "a cone of pale yellow torch light, wide at the right, pointed at the left"),
        ("sweat", "three little blue cartoon sweat drops in a fan"),
        ("heartbeat", "a glossy red cartoon heart with little motion lines"),
        ("face-happy", "a round yellow face card: a big happy smile"),
        ("face-sad", "a round blue face card: a sad frown"),
        ("face-okay", "a round green face card: a calm small smile"),
        ("face-better", "a round orange face card: a relieved smile with closed eyes and a little sigh puff"),
        ("face-scared", "a round purple face card: a scared face, eyes wide, wobbly mouth"),
        ("paste-yellow", "a small blob of yellow tooth filling paste on a tiny spatula"),
        ("paste-pink", "a small blob of pink tooth filling paste on a tiny spatula"),
        ("bone-kink", "a cartoon white bone with a funny kink in the middle and a cute worried face, comic, clean"),
    ], extra="Simple bold shapes, bright colours, cute and comical, nothing gory."),
    item_sheet("parts-b", 3, 3, [
        ("part-nose", "a close-up of a cute cartoon nose, front view, brown skin, cheeks around it"),
        ("part-tummy", "a close-up of a child's round tummy in an orange t-shirt, front view"),
        ("part-elbow", "a child's bare arm bent at the elbow, seen from the side, brown skin, five fingers"),
        ("part-finger", "one pointing index finger close-up with the hand, brown skin"),
        ("part-tooth", "one big cute cartoon white tooth with a happy face"),
        ("part-tooth-cracked", "one big cute cartoon white tooth with a small zig-zag crack and a worried face"),
        ("part-leg", "a child's whole bare leg, straight, standing, from the hip of the shorts down to the foot, brown skin"),
        ("part-arm", "a child's whole straight arm with the t-shirt sleeve rolled up to the shoulder, brown skin, five fingers"),
        ("part-chest", "a close-up of a child's chest and shoulders in a yellow t-shirt, front view, no head"),
    ], extra="All skin is the same warm brown tone. Crisp clean edges everywhere: no blur, no fade, no vignette. Do not draw any lines or frames between cells."),
    item_sheet("furniture", 3, 3, [
        ("bench", "a long empty wooden waiting-room bench, front view"),
        ("exam-couch", "a padded doctor's examination couch, mint green, front view, empty"),
        ("trolley", "a small steel medical trolley with two shelves, empty, front view"),
        ("belt", "a straight section of a sushi-style conveyor belt seen from the front at a slight angle, dark rubber belt with wooden sides, long and thin, horizontal"),
        ("counter", "a long wooden pharmacy counter, front view, empty top"),
        ("stool", "a small plain wooden stool"),
        ("album", "an open sticker album with a few colourful star and smiley stickers"),
        ("door", "a friendly wooden door painted blue, closed"),
        ("plant", "a potted green plant in a terracotta pot"),
    ]),
]

# The model skipped a cell on some sheets: the rows actually drawn (None = a blob to ignore).
# Sprites from a later sheet override the same id from an earlier one.
LAYOUT = {
    "items-b": [["syringe", "toothbrush", "toothpaste", "tissues"], ["towel", "bowl-water", "foot-basin"],
                ["tweezers", "lemon", None, None], [None, None, None, "ice-pack"]],
}
BY_NAME = {s["name"]: s for s in SHEETS}
for _n, _o in LAYOUT.items():
    BY_NAME[_n]["layout"] = _o


REF_TOKENS = 1600  # a guess per reference image (input image tokens at $10 / 1M)


def estimate(sheets):
    return sum(PRICE[s["size"]] + len(s["prompt"]) / 4 * IN_TEXT_PER_TOKEN
               + len(s.get("refs", [])) * REF_TOKENS * 10 / 1e6 for s in sheets)


def load_log():
    if os.path.exists(LOG):
        return json.load(open(LOG))
    return {"calls": []}


def spent(log):
    return sum(c["cost"] for c in log["calls"])


def gen(sheet, key, suffix=""):
    t0 = time.time()
    for attempt in range(4):
        if sheet.get("refs"):
            # the same characters: the earlier sheets go in as references (the edits endpoint)
            files = [("image[]", (f"{n}.png", open(os.path.join(HERE, n + ".png"), "rb"), "image/png"))
                     for n in sheet["refs"]]
            r = requests.post("https://api.openai.com/v1/images/edits",
                              headers={"Authorization": f"Bearer {key}"}, files=files,
                              data={"model": MODEL, "prompt": sheet["prompt"], "size": sheet["size"],
                                    "quality": "medium", "n": "1"}, timeout=300)
        else:
            r = requests.post("https://api.openai.com/v1/images/generations",
                              headers={"Authorization": f"Bearer {key}"},
                              json={"model": MODEL, "prompt": sheet["prompt"], "size": sheet["size"],
                                    "quality": "medium", "n": 1, "background": "opaque"},
                              timeout=300)
        if r.status_code in (429, 500, 502, 503) and attempt < 3:
            time.sleep(5 * 2 ** attempt)
            continue
        r.raise_for_status()
        break
    j = r.json()
    u = j.get("usage", {})
    det = u.get("input_tokens_details", {})
    cost = (u.get("output_tokens", 0) * OUT_PER_TOKEN + det.get("text_tokens", u.get("input_tokens", 0)) * IN_TEXT_PER_TOKEN
            + det.get("image_tokens", 0) * 10 / 1e6)
    if not u:
        cost = PRICE[sheet["size"]]
    path = os.path.join(HERE, sheet["name"] + suffix + ".png")
    with open(path, "wb") as f:
        f.write(base64.b64decode(j["data"][0]["b64_json"]))
    return {"sheet": sheet["name"], "file": os.path.basename(path), "size": sheet["size"],
            "usage": u, "cost": round(cost, 4), "secs": round(time.time() - t0, 1)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--estimate", action="store_true")
    ap.add_argument("--only", default="")
    ap.add_argument("--redo", action="store_true", help="regenerate even if the png exists")
    ap.add_argument("--suffix", default="", help="save as <name><suffix>.png (for retries)")
    ap.add_argument("--budget", type=float, default=BUDGET)
    ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    todo = [BY_NAME[n] for n in a.only.split(",")] if a.only else SHEETS
    if not a.redo:
        todo = [s for s in todo if not os.path.exists(os.path.join(HERE, s["name"] + a.suffix + ".png"))]
    log = load_log()
    est = estimate(todo)
    print(f"Pre-flight: {len(todo)} sheets, medium quality, estimated ${est:.2f}; "
          f"spent so far ${spent(log):.2f}; budget ${a.budget:.2f}")
    for s in todo:
        print(f"  {s['name']:18} {s['size']:10} {len(s['ids'])} sprites  ${PRICE[s['size']]:.3f}")
    if spent(log) + est > a.budget:
        sys.exit("Over budget: cut sheets first.")
    if a.estimate or not todo:
        return
    key = os.environ["OPENAI_API_KEY"]
    with ThreadPoolExecutor(a.workers) as ex:
        futs = {ex.submit(gen, s, key, a.suffix): s for s in todo}
        for f, s in futs.items():
            try:
                rec = f.result()
                log["calls"].append(rec)
                print(f"  done {rec['file']}  ${rec['cost']:.4f}  {rec['secs']}s")
            except Exception as e:  # keep going; report
                print(f"  FAILED {s['name']}: {e}")
            json.dump(log, open(LOG, "w"), indent=1)
    print(f"Total spent: ${spent(log):.4f}")


if __name__ == "__main__":
    main()
