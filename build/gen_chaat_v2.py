#!/usr/bin/env python3
"""Chaat v2 game art (docs/design-language/ui-design-system.md §14, §14a): the pieces the chaat station needs
that the repo doesn't have, ONE medium draft each, matched to sources/art/style-anchor-v1.png and the
existing top-down topping bowls (assets/cook/items/topping-*-bowl-t):
  glass-bowl   a clear glass serving bowl seen front-on (side view), empty
  bowls-a/b    ten identical front-on prep bowls, each with one topping heaped in it (two sheets of five)
  strips-a/b   ten side-view food layers, as seen through the side of a glass bowl (two sheets of five)
gpt-image-1 via /images/edits, quality medium, flat #808080 background (cut by build/cut_chaat_v2.py).
Estimated cost is printed first; the run stops if the total would pass BUDGET. A draft already on disk
is never paid for twice. Actual cost is logged from the API's usage to sources/art/chaat-v2/cost.json.

  python3 build/gen_chaat_v2.py            # estimate, then draw what's missing
  python3 build/gen_chaat_v2.py --dry      # estimate only
"""
import base64
import io
import json
import os
import sys

import requests
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 'chaat-v2')
ANCHOR = os.path.join(ROOT, 'sources', 'art', 'style-anchor-v1.png')
BOWL = os.path.join(ROOT, 'assets', 'cook', 'items', 'topping-channa-bowl-t.png')
CHAAT = os.path.join(ROOT, 'assets', 'cook', 'items', 'chaat-bowl-full-t.png')
JAR = os.path.join(ROOT, 'assets', 'cook', 'items', 'shelf-ph-dahi-bare-f.webp')
BUDGET = 2.00
# gpt-image-1 prices (USD per token): text in, image in, image out; medium output tokens by size
PRICE = {'text': 5e-6, 'image': 10e-6, 'out': 40e-6}
OUT_TOKENS = {'1024x1024': 1056, '1536x1024': 1584}
REF_TOKENS = 1300  # a reference image, roughly (logged exactly after each call)

STYLE = ('Match the reference images exactly in rendering style: soft semi-realistic 3D product render, warm soft '
         'light from the UPPER LEFT, gentle saturation, clean and premium, a children\'s cooking game asset. '
         'On a perfectly flat, even, plain mid-grey #808080 background with NO shadow cast on it. '
         'No marble, no counter, no text, no labels, no people, no hands, no other objects.')
FRONT = ('Camera: FRONT-ON, a side view at the eye level of the object, only very slightly above its rim (about 12 '
         'degrees), so a round rim reads as a thin flat ellipse. ')
PREP = ('small round cream-white glazed ceramic serving bowls (the same bowl as the round bowl in the reference, now '
        'seen from the side): a wide rounded body, a short foot ring, a smooth rolled rim')
ROW5 = ('in ONE row, evenly spaced with clear gaps between them, exactly the same size and shape, each about 16% of the '
        'image width, all standing on the same invisible baseline in the lower middle of the image. ')
STRIP = ('FIVE wide flat horizontal slabs of chaat toppings, stacked one above the other with a clear gap of plain grey '
         'between them, each slab a long rectangle about 88% of the image width and 12% of the image height, with a '
         'straight flat bottom and a slightly uneven natural top. Each slab is the SIDE VIEW of one layer of food '
         'pressed against the inside of a clear glass bowl, as you would see it through the glass: densely packed, '
         'filling its whole slab, no bowl, no glass drawn. ')
PROMPTS = {
    'glass-bowl': ('1024x1024', [ANCHOR, CHAAT],
                   'ONE clear glass chaat serving bowl, EMPTY, seen from the side. A wide bowl, about 1.8 times wider '
                   'than it is tall: a wide round rim, straight smooth walls flaring gently outwards from a thick flat '
                   'round glass base (no stem, no foot, no pattern). Thick crystal-clear glass: you see straight through '
                   'it, with soft white highlights down the left wall and along the rim, and a faint cool blue-green '
                   'tint in the thick base and at the edges. It fills about 80% of the frame width, centred. '
                   + FRONT + STYLE),
    'bowls-a': ('1536x1024', [ANCHOR, BOWL, JAR],
                'FIVE identical ' + PREP + ', ' + ROW5 + 'Each holds a different chaat topping, heaped a little ABOVE '
                'the rim so the food is clearly visible from the side. From left to right: 1 boiled POTATO cubes (pale '
                'yellow); 2 boiled CHICKPEAS (golden chana); 3 thick white YOGHURT (dahi), a smooth glossy swirl; 4 '
                'dark brown glossy TAMARIND chutney; 5 bright green glossy MINT-CORIANDER chutney. ' + FRONT + STYLE),
    'bowls-b': ('1536x1024', [ANCHOR, BOWL, JAR],
                'FIVE identical ' + PREP + ', ' + ROW5 + 'Each holds a different chaat topping, heaped a little ABOVE '
                'the rim so the food is clearly visible from the side. From left to right: 1 crispy yellow SEV (thin '
                'fried gram-flour noodles); 2 chopped fresh CORIANDER leaves; 3 sliced GREEN CHILLI rings; 4 finely '
                'chopped RED ONION; 5 diced ripe red TOMATO. ' + FRONT + STYLE),
    'strips-a': ('1536x1024', [ANCHOR, CHAAT],
                 STRIP + 'From TOP to BOTTOM: 1 boiled POTATO cubes (pale yellow cubes); 2 boiled CHICKPEAS (golden '
                 'round chana); 3 thick white YOGHURT (dahi, creamy with a soft swirl); 4 dark brown TAMARIND chutney '
                 'drizzled in glossy ribbons over a little yoghurt; 5 bright green MINT chutney drizzled in glossy '
                 'ribbons over a little yoghurt. ' + STYLE),
    'strips-b': ('1536x1024', [ANCHOR, CHAAT],
                 STRIP + 'From TOP to BOTTOM: 1 crispy yellow SEV (a tangle of thin fried noodles); 2 chopped fresh '
                 'CORIANDER leaves (green); 3 sliced GREEN CHILLI rings; 4 finely chopped RED ONION (pink-purple '
                 'pieces); 5 diced red TOMATO. ' + STYLE),
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
