#!/usr/bin/env python3
"""Chai v2 game art (docs/design/cook-design-system-v1.md §10): the pieces the station needs that the
repo doesn't have, ONE medium draft each, matched to sources/art/style-anchor-v1.png and the mock-up's
generated hob (assets/cook/items/chai-v2/hob-2-burner-t.webp):
  pan-top    a true top-down saucepan, empty (light from the upper left)
  pan-pour   the same saucepan lifted and tipped to pour, with chai in it
  glasses    three top-down chai glasses: empty, half, full
  liquids    four pan liquids from above: milk, light tea, milky chai, dark chai
  jar-aadu   the pantry-v2 small square spice jar, filled with ginger
  jar-lasan  the same jar, filled with garlic cloves
gpt-image-1 via /images/edits, quality medium, flat #808080 background (cut by build/cut_chai_v2.py).
Estimated cost is printed first; the run stops if the total would pass BUDGET. A draft already on disk
is never paid for twice. Actual cost is logged from the API's usage to sources/art/chai-v2/cost.json.

  python3 build/gen_chai_v2.py            # estimate, then draw what's missing
  python3 build/gen_chai_v2.py --dry      # estimate only
"""
import base64
import io
import json
import os
import sys

import requests
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 'chai-v2')
ANCHOR = os.path.join(ROOT, 'sources', 'art', 'style-anchor-v1.png')
HOB = os.path.join(ROOT, 'assets', 'cook', 'items', 'chai-v2', 'hob-2-burner-t.webp')
JAR = os.path.join(ROOT, 'assets', 'cook', 'items', 'shelf-spi-10-bare-f.webp')
BUDGET = 2.00
# gpt-image-1 prices (USD per token): text in, image in, image out; medium output tokens by size
PRICE = {'text': 5e-6, 'image': 10e-6, 'out': 40e-6}
OUT_TOKENS = {'1024x1024': 1056, '1536x1024': 1584}
REF_TOKENS = 1300  # a reference image, roughly (logged exactly after each call)

STYLE = ('Match the reference images exactly in rendering style: soft semi-realistic 3D product render, warm soft '
         'light from the UPPER LEFT, gentle saturation, clean and premium, a children\'s cooking game asset. '
         'On a perfectly flat, even, plain mid-grey #808080 background with NO shadow cast on it. '
         'No marble, no counter, no text, no labels, no people, no hands, no other objects.')
TOP = 'Camera: EXACTLY top-down (orthographic, looking straight down), so every round rim is a perfect circle. '
PAN = ('a small stainless-steel milk saucepan for making chai: round, polished steel with a soft brushed finish, a '
       'thin rolled rim, one long straight flat steel handle with a small hanging hole at its end')
PROMPTS = {
    'pan-top': ('1024x1024', [ANCHOR, HOB],
                'ONE ' + PAN + ', EMPTY and clean, seen from directly above. The pan body is centred; its handle '
                'points straight towards the upper right at exactly 45 degrees. Only the inside floor and the rim are '
                'visible (no outside wall, no perspective). The body fills about 55% of the frame width. ' + TOP + STYLE),
    'pan-pour': ('1024x1024', [ANCHOR, HOB],
                 'ONE ' + PAN + ', held up and TIPPED to pour, seen from above at a slight angle: the pan is tilted '
                 'down towards the LOWER LEFT, so its rim reads as a tilted ellipse, a little of its outside wall shows '
                 'on the lower left, and the handle rises towards the upper right. It holds hot milky masala chai '
                 '(caramel brown) whose flat surface has slid towards the lower-left lip, ready to pour. No stream, no '
                 'cup. The pan fills about 60% of the frame. ' + STYLE),
    'glasses': ('1536x1024', [ANCHOR, HOB],
                'THREE identical small clear glass Indian chai tumblers (cutting-chai glasses with fluted sides, thick '
                'round base), seen from EXACTLY directly above, in one row, evenly spaced, exactly the same size, each '
                'about 26% of the image width. LEFT: empty clear glass (you see the round base through it). MIDDLE: '
                'half full of milky chai (a smaller caramel-brown circle of chai deep inside the glass). RIGHT: full of '
                'milky chai to just below the rim, with a thin pale froth ring at the edge. ' + TOP + STYLE),
    # the first glasses draft was ¾ view with half and full alike: a second, stricter draft
    'glasses2': ('1536x1024', [ANCHOR, HOB],
                 'THREE identical small clear glass Indian chai tumblers (cutting-chai glasses, fluted sides), photographed '
                 'from STRAIGHT OVERHEAD, the camera exactly above each glass looking down its axis: each glass reads as '
                 'concentric circles only (the round rim outside, the smaller round base inside), NO side view, NO '
                 'perspective. One row, evenly spaced, exactly the same size, each about 26% of the image width. LEFT: '
                 'EMPTY (clear glass, the concentric base visible). MIDDLE: HALF full: a SMALL circle of milky chai, '
                 'only about 60% of the rim diameter, deep down, with a wide ring of clear empty glass wall around it. '
                 'RIGHT: FULL to the brim: a LARGE circle of milky chai filling about 92% of the rim diameter, a thin '
                 'pale froth ring at its edge. Opaque flat mid-grey #808080 background (not transparent). ' + STYLE),
    'liquids': ('1536x1024', [ANCHOR, HOB],
                'FOUR flat round pools of liquid, as the surface of liquid filling a round pan seen from EXACTLY '
                'directly above, in one row, evenly spaced, exactly the same size, each a perfect circle about 22% of '
                'the image width, with a soft meniscus at the edge and one soft highlight at the upper left. From left '
                'to right: 1 fresh creamy white MILK; 2 LIGHT TEA just starting to brew (clear amber with a few loose '
                'black tea leaves floating); 3 MILKY CHAI, light (pale beige-caramel, smooth); 4 DARK MASALA CHAI, boiled '
                '(rich deep caramel brown with a few tiny bubbles at the edge). Flat colour pools only, no pan, no '
                'rim. ' + TOP + STYLE),
    'jar-aadu': ('1024x1024', [JAR],
                 'EXACTLY the same small square glass spice jar with a brushed-steel screw lid as in the reference: the '
                 'same shape, size, camera (straight front-on), lid and lighting. But filled to the same height with '
                 'small chunks of fresh peeled GINGER root (pale yellow-beige knobbly pieces). The jar alone, centred, '
                 'filling about 70% of the frame. ' + STYLE),
    'jar-lasan': ('1024x1024', [JAR],
                  'EXACTLY the same small square glass spice jar with a brushed-steel screw lid as in the reference: the '
                  'same shape, size, camera (straight front-on), lid and lighting. But filled to the same height with '
                  'whole peeled GARLIC cloves (creamy white). The jar alone, centred, filling about 70% of the '
                  'frame. ' + STYLE),
}


def ref_png(path):
    """A reference as PNG bytes: the cut sprites go on the flat grey background they'll be drawn on."""
    im = Image.open(path).convert('RGBA')
    bg = Image.new('RGBA', im.size, (128, 128, 128, 255))
    bg.alpha_composite(im)
    b = io.BytesIO()
    bg.convert('RGB').save(b, 'PNG')
    return b.getvalue()


def estimate(names):
    total = 0
    for n in names:
        size, refs, prompt = PROMPTS[n]
        total += OUT_TOKENS[size] * PRICE['out'] + len(refs) * REF_TOKENS * PRICE['image'] + len(prompt) / 4 * PRICE['text']
    return total


def cost_of(u):
    d = u.get('input_tokens_details') or {}
    return d.get('image_tokens', 0) * PRICE['image'] + d.get('text_tokens', 0) * PRICE['text'] + u.get('output_tokens', 0) * PRICE['out']


def main():
    os.makedirs(OUT, exist_ok=True)
    log_path = os.path.join(OUT, 'cost.json')
    log = json.load(open(log_path)) if os.path.exists(log_path) else {'calls': []}
    spent = sum(c['usd'] for c in log['calls'])
    todo = [n for n in PROMPTS if not os.path.exists(os.path.join(OUT, n + '-draft1.png'))]
    est = estimate(todo)
    print(f'spent so far ${spent:.3f}; to draw {todo}: about ${est:.3f}; total about ${spent + est:.3f} (budget ${BUDGET:.2f})')
    if '--dry' in sys.argv or not todo:
        return
    if spent + est > BUDGET:
        sys.exit('over budget: write the ChatGPT prompt pack instead')
    key = os.environ.get('OPENAI_API_KEY')
    if not key:
        sys.exit('OPENAI_API_KEY is not set')
    for n in todo:
        size, refs, prompt = PROMPTS[n]
        files = [('image[]', (f'ref{i}.png', ref_png(p), 'image/png')) for i, p in enumerate(refs)]
        r = requests.post('https://api.openai.com/v1/images/edits', headers={'Authorization': 'Bearer ' + key},
                          data={'model': 'gpt-image-1', 'prompt': prompt, 'quality': 'medium', 'size': size, 'n': '1'},
                          files=files, timeout=400)
        if r.status_code != 200:
            print(n, 'FAILED', r.status_code, r.text[:300])
            continue
        body = r.json()
        with open(os.path.join(OUT, n + '-draft1.png'), 'wb') as f:
            f.write(base64.b64decode(body['data'][0]['b64_json']))
        usd = cost_of(body.get('usage') or {})
        log['calls'].append({'name': n, 'usage': body.get('usage'), 'usd': round(usd, 4)})
        json.dump(log, open(log_path, 'w'), indent=1)
        print(n, 'ok', f'${usd:.3f}')
    print(f'total spent ${sum(c["usd"] for c in log["calls"]):.3f}')


if __name__ == '__main__':
    main()
