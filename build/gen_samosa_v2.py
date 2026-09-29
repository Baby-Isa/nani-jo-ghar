#!/usr/bin/env python3
"""Samosa v2 game art (docs/design/cook-design-system-v1.md §15): the two pieces the samosa station needs that
the repo doesn't have, ONE medium draft, matched to sources/art/style-anchor-v1.png, the chai v2 top-down pan
and the enamel plate:
  fry-sheet   a top-down karahi of hot oil (for the kitchen-kit hob) + a top-down enamel plate lined with paper
gpt-image-1 via /images/edits, quality medium, flat #808080 background (cut by build/cut_samosa_v2.py).
Estimated cost is printed first; the run stops if the total would pass BUDGET. A draft on disk is never paid
for twice. Actual cost is logged to sources/art/samosa-v2/cost.json.
  python3 build/gen_samosa_v2.py [--dry]
"""
import base64
import io
import json
import os
import sys

import requests
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 'samosa-v2')
ANCHOR = os.path.join(ROOT, 'sources', 'art', 'style-anchor-v1.png')
BUDGET = 2.00
# gpt-image-1 prices (USD per token): text in, image in, image out; medium output tokens by size
PRICE = {'text': 5e-6, 'image': 10e-6, 'out': 40e-6}
OUT_TOKENS = {'1024x1024': 1056, '1536x1024': 1584}
REF_TOKENS = 1300  # a reference image, roughly (logged exactly after each call)

STYLE = ('Match the reference images exactly in rendering style: soft semi-realistic 3D product render, warm soft '
         'light from the UPPER LEFT, gentle saturation, clean and premium, a children\'s cooking game asset. '
         'On a perfectly flat, even, plain mid-grey #808080 background with NO shadow cast on it. '
         'No marble, no counter, no text, no labels, no people, no hands, no other objects.')
PAN = os.path.join(ROOT, 'assets', 'cook', 'items', 'chai-v2', 'pan-top.webp')
PLATE = os.path.join(ROOT, 'assets', 'cook', 'items', 'plate-enamel-empty-t.png')
KADAI = os.path.join(ROOT, 'assets', 'cook', 'items', 'vessel-kadai-oil-t.png')
TOP = ('Camera: exactly TOP-DOWN, looking straight down, so round things are perfect circles. ')
PROMPTS = {
    'fry-sheet': ('1536x1024', [ANCHOR, PAN, PLATE],
                  'TWO objects side by side with a wide gap of plain grey between them, each about 40% of the image '
                  'width, centred vertically. LEFT: ONE Indian KARAHI (a deep round steel wok with a wide rounded rim '
                  'and two small curved loop handles, one on the left and one on the right), full of clear golden hot '
                  'cooking oil with a few soft light reflections, EMPTY of food, no steam. The same brushed steel and '
                  'lighting as the reference pan. RIGHT: ONE round white enamel plate with a thin dark blue rim (the '
                  'same plate as the reference), lined with ONE sheet of white crinkled kitchen paper (a square of soft '
                  'absorbent paper, its corners a little crumpled and hanging over the rim), nothing on the paper. '
                  + TOP + STYLE),
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
