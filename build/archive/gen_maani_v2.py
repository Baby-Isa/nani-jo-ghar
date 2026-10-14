#!/usr/bin/env python3
"""Maani v2 game art (docs/design-language/ui-design-system.md §11): the one piece the repo doesn't have.
Everything else is existing art (the chakla, velan, tawa, dough balls, maani states, thali, the chai v2 hob).
  chimta   Indian flat steel tongs, top-down, lying diagonally (it flips the maani: no hands)
gpt-image-1 via /images/edits, quality medium, flat #808080 background (cut by build/cut_maani_v2.py).
Estimated cost is printed first; the run stops if the total would pass BUDGET. A draft already on disk
is never paid for twice. Actual cost is logged to sources/art/maani-v2/cost.json.

  python3 build/gen_maani_v2.py            # estimate, then draw what's missing
  python3 build/gen_maani_v2.py --dry      # estimate only
"""
import base64
import io
import json
import os
import sys

import requests
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 'maani-v2')
ANCHOR = os.path.join(ROOT, 'sources', 'art', 'style-anchor-v1.png')
TAWA = os.path.join(ROOT, 'assets', 'cook', 'items', 'vessel-tawa-t.png')
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
PROMPTS = {
    'chimta': ('1024x1024', [ANCHOR, TAWA],
               'ONE Indian chimta: traditional kitchen tongs for turning rotis, made of two long, thin, FLAT strips of '
               'polished stainless steel joined at one end by a small round steel ring, the two strips running side by '
               'side with a small gap and their flat tips slightly flared at the other end. Lying flat, seen from '
               'EXACTLY directly above, placed diagonally from the lower left (the ring) to the upper right (the tips), '
               'filling about 80% of the frame diagonal. ' + TOP + STYLE),
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
