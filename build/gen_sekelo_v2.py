#!/usr/bin/env python3
"""Sekelo v2 game art (docs/design/cook-design-system-v1.md §15): what the station needs that the repo
doesn't have, ONE medium draft each, matched to sources/art/style-anchor-v1.png and the pantry-v2
front-on jars (§4: the shelf band's objects are front-on):
  bowls   four identical front-on prep bowls on one sheet: raw mishkaki (meat cubes), onion pieces,
          tomato pieces, boiled potato cubes (the decoy). Superseded (Zafar, 29 Sept): Sekelo stays top-down.
  bowl-meat-top  the repo's top-down cream topping bowl (topping-dungri-chopped-bowl-t) filled with raw
          mishkaki cubes, so the meat sits with the existing top-down onion, tomato and potato bowls
gpt-image-1 via /images/edits, quality medium, flat #808080 background (cut by build/cut_sekelo_v2.py).
Estimated cost is printed first; the run stops if the total would pass BUDGET. A draft already on disk
is never paid for twice. Actual cost is logged from the API's usage to sources/art/sekelo/cost.json.

  python3 build/gen_sekelo_v2.py            # estimate, then draw what's missing
  python3 build/gen_sekelo_v2.py --dry      # estimate only
"""
import base64
import io
import json
import os
import sys

import requests
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 'sekelo')
ANCHOR = os.path.join(ROOT, 'sources', 'art', 'style-anchor-v1.png')
JAR = os.path.join(ROOT, 'assets', 'cook', 'items', 'shelf-cook-khun-bare-f.webp')
MEAT = os.path.join(ROOT, 'assets', 'cook', 'items', 'mishkaki-meat-raw-t.webp')
TOPBOWL = os.path.join(ROOT, 'assets', 'cook', 'items', 'topping-dungri-chopped-bowl-t.webp')
BUDGET = 2.00
PRICE = {'text': 5e-6, 'image': 10e-6, 'out': 40e-6}
OUT_TOKENS = {'1024x1024': 1056, '1536x1024': 1584}
REF_TOKENS = 1300

STYLE = ('Match the reference images exactly in rendering style: soft semi-realistic 3D product render, warm soft '
         'light from the UPPER LEFT, gentle saturation, clean and premium, a children\'s cooking game asset. '
         'On a perfectly flat, even, plain mid-grey #808080 background with NO shadow cast on it. '
         'No marble, no counter, no table, no text, no labels, no people, no hands, no spoons, no other objects.')
BOWL = ('a small round cream-glazed ceramic prep bowl (a simple deep bowl with a thin rounded rim and a short foot), '
        'photographed FRONT-ON at eye level, the camera only very slightly above the rim (about 15 degrees), so you see '
        'the bowl\'s outside wall and a thin ellipse of the rim, with the food heaped just above the rim so it is easy '
        'to recognise')
PROMPTS = {
    'bowls': ('1536x1024', [ANCHOR, JAR, MEAT],
              'FOUR IDENTICAL ' + BOWL + '. One row, evenly spaced, exactly the same bowl, same size, same camera, each '
              'bowl about 20% of the image width, all standing on the same invisible base line. The food in each, '
              'from LEFT to RIGHT: 1 raw marinated BEEF CUBES (square red-orange meat cubes with a spice rub, exactly '
              'like the meat cube reference); 2 RED ONION cut in large square petals (purple-edged white layers); '
              '3 fresh TOMATO cut in wedges (bright red, seeds visible); 4 BOILED POTATO cubes (pale yellow, soft '
              'edges). ' + STYLE),
    'bowl-meat-top': ('1024x1024', [TOPBOWL, MEAT],
                      'EXACTLY the same round cream-glazed ceramic bowl as the first reference, seen from EXACTLY '
                      'directly above (top-down, the rim a perfect circle), the same size, rim, glaze and light. Instead '
                      'of onion it is filled to the same level with raw marinated BEEF CUBES exactly like the second '
                      'reference (square red-orange meat cubes with a spice rub, about 12 cubes, each clearly a cube). '
                      'The bowl alone, centred, filling about 80% of the frame. ' + STYLE.replace('No marble, no counter, no table, ', 'No marble, no counter, no table, no spoon, ')),
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
