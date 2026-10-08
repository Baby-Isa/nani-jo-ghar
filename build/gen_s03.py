#!/usr/bin/env python3
"""Sprint 3 art (pack s03; plan docs/design-language/art-plans/s03-art-plan.md): the s02 redo list (B1 sekelo dish,
C10 daar bowl, E2 two-colour plasters), the kadchi ladle (DAAR-02), the potato chunks (ART-11) and the girl's hot,
cold, sore and happy faces as masked edits of her approved seated picture (CLN-65: one body).
gpt-image-2 via /images/edits, quality high, the style anchor and the approved art attached; flat #808080 ground.
Every try is kept (sources/art/s03/<id>-v<n>.png); a redo passes Fable's amended prompt with --prompt-file.
The spend is logged from the API's usage to sources/art/s03/cost.json; the run stops at the cap.

  python3 build/gen_s03.py --dry                       # the estimate
  python3 build/gen_s03.py                             # try 1 of every image not yet drawn
  python3 build/gen_s03.py --only G1 --try 2 --prompt-file p.txt   # a redo with Fable's amended prompt
"""
import argparse
import base64
import io
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor

import requests
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 's03')
A = lambda *p: os.path.join(ROOT, *p)
ANCHOR = A('sources', 'art', 'style-anchor-v1.png')
W1 = A('sources', 'art', 'clinic-heal-v3', 'girl-w1-front-neutral-v1.png')
SHEET = A('sources', 'art', 'clinic-heal-v3', 's1-girl-sheet-v2.png')
CAP = 60.0
MODEL = 'gpt-image-2'
# priced at gpt-image-1's rates until the first call shows the real ones (USD per token)
PRICE = {'text': 5e-6, 'image': 10e-6, 'out': 40e-6}
OUT_TOKENS = {'1024x1024': 4160, '1536x1024': 6240, '1024x1536': 6240}  # high quality
REF_TOKENS = 1300
FACE = (512, 368, 165, 140)  # the face ellipse on W1 (cx, cy, rx, ry), source px

GROUND = ('Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. '
          'No floor, no table, no gradient, no texture. NO shadows of any kind.')
STYLE = ('Style: exactly as the attached style anchor and references: a stylised 3D animated-feature-film look, '
         'semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.')
NEG = 'Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.'
GIRL = ('Edit the attached picture of the girl. Change ONLY her face inside the masked area: her expression. Everything else '
        'stays exactly as it is, pixel for pixel: her hair, plaits and ribbons, her ears, her neck, her yellow dress, her '
        'body, her hands, her legs and sandals, her pose, her size and position, the flat mid-grey #808080 background. '
        'She is the same girl as on the attached character sheet: the same round face, big brown eyes, small nose, warm '
        'light tan skin (about hex #C49A78, never orange). ')
GIRL_END = (' The expression must read clearly at a small size. A stylised 3D animated-feature-film look, soft light from the '
            'upper left, no outlines. ' + NEG + ' No bindi, tilak or other religious markers.')

JOBS = {
    'S1': ('1024x1024', [ANCHOR, A('sources/art/s02/b1-served-dishes-v1.png'), A('sources/art/s02/c7-sekelo-plate-plain-t-v1.png')], None,
           'Generate one served dish for a children\'s cooking game, as the seventh dish of the attached sheet of served '
           'dishes, drawn at exactly the same camera angle, scale and light as those dishes: seen from the front and a little '
           'above, the camera about at the rim\'s height looking about 15 degrees down. The dish: a plain oval brushed-steel '
           'plate (like the attached plate) with TWO grilled skewers lying on it, both straight and parallel, running left '
           'to right. Each skewer carries ONLY small grilled marinated meat cubes, wedges of red onion and pieces of red '
           'tomato, alternating, lightly charred. NO green pepper, NO capsicum, nothing green at all. The plain wooden ends '
           'of the skewers stick out a little at the right. The dish is centred, filling about 70% of the image width, '
           'with clear background all round; it stands on its flat base and nothing is drawn under it. ' + GROUND + ' ' + STYLE + ' ' + NEG + ' Halal food only.'),
    'S2': ('1024x1024', [ANCHOR, A('sources/art/s02/c10-daar-bowl-trivet-t-v1.png'), A('assets/cook/items/v3/daar/pot-daar.webp')], None,
           'One plain brushed-steel bowl for a children\'s cooking game, the same bowl as on the left of the first attached '
           'picture, seen from EXACTLY directly above so its rim is a perfect circle, centred, filling about 60% of the '
           'image width, on its own with nothing under it. It is full of cooked yellow lentil daar like the daar in the '
           'attached pot: a smooth, soft, creamy, MATTE golden-yellow surface, gently uneven like thick soup, with a few '
           'small soft lentil grains just visible in it. NO beads, NO balls, NO round droplets, NO glossy spheres, no '
           'tempering on top: it must never look like sweets or candy. ' + GROUND + ' ' + STYLE + ' ' + NEG),
    'S3': ('1536x1024', [ANCHOR, A('sources/art/s02/e2-plasters-flat-v1.png')], None,
           'A sprite sheet for a children\'s doctor game: six adhesive plasters in an invisible grid of 3 columns and 2 rows '
           'of equal cells, one plaster per cell, centred, lying flat and horizontal, seen from directly above, each filling '
           'about 75% of its cell\'s width, with clear background all round; nothing touches or crosses a cell boundary. Do '
           'not draw grid lines, borders or labels. Every plaster is EXACTLY the same shape, size and finish as the plasters '
           'in the attached sheet: a long rounded strip with a slightly raised square pad in the middle and tiny breathing '
           'dots, matte, even colour. Each plaster is TWO colours split LENGTHWISE: a straight dividing line runs along the '
           'whole length of the strip from its left end to its right end, through the middle of the pad; the TOP half of the '
           'strip and pad is the first colour and the BOTTOM half is the second colour. Never split left and right. '
           'Row 1, left to right: (1) top red, bottom yellow; (2) top red, bottom blue; (3) top red, bottom green. '
           'Row 2, left to right: (4) top yellow, bottom blue; (5) top yellow, bottom green; (6) top blue, bottom green. '
           'Colours exactly as the attached plasters: bright red, bright yellow, bright blue, bright green. ' + GROUND + ' ' + STYLE + ' ' + NEG),
    'S4': ('1024x1024', [ANCHOR, A('assets/cook/items/v3/daar/pot-daar.webp'), A('assets/cook/items/v3/daar/ladle-v2.webp')], None,
           'One Indian stainless-steel kadchi (a serving ladle for daar) for a children\'s cooking game, seen from directly '
           'above as it stands in a pot of daar: its deep, round, hemispherical bowl is at the LOWER LEFT, seen from above as '
           'a perfect circle with its polished inside showing, about 34% of the image width; its long, slim, flat steel '
           'handle leaves the bowl\'s rim and runs straight towards the UPPER RIGHT at about 55 degrees above horizontal, '
           'rising up out of the pot towards the camera, so it widens slightly and gets a little brighter towards its end; '
           'the handle end is a rounded flat paddle with a small hanging hole. Plain brushed steel, like the attached '
           'ladle\'s metal, but a real long-handled kadchi, NOT a measuring cup, NOT a dipper with a hooked handle. The bowl '
           'is empty and clean. The whole ladle inside the image with a margin of at least 8% on every side. ' + GROUND + ' ' + STYLE + ' ' + NEG),
    'S5': ('1536x1024', [ANCHOR, A('sources/art/cook-v3/k4-pieces-v1.png'), A('assets/cook/items/v3/sekelo/potato-raw.webp')], None,
           'A sprite sheet for a children\'s cooking game: four things in an invisible grid of 4 columns and 1 row of equal '
           'cells, one per cell, centred, each filling about 55% of its cell\'s width, with clear background all round; nothing '
           'touches or crosses a cell boundary. Do not draw grid lines, borders or labels. All are seen from directly above, '
           'at the same size and style as the meat, onion and tomato chunks in the attached sheet. Left to right: (1) ONE raw '
           'potato chunk, a rough cube: pale off-white cream starchy flesh, matte and slightly dry with a fine grainy texture, '
           'with a strip of thin light-brown potato skin with a few small eyes along one edge, so it clearly reads as potato; '
           '(2) the SAME chunk grilled: golden with dark brown grill stripes; (3) the SAME chunk charred: deep brown with '
           'black charred patches, the cream flesh still showing in places; (4) a small heap of six raw potato cubes like '
           'cell 1, some with skin. Never yellow like butter, never glossy, never like cheese. ' + GROUND + ' ' + STYLE + ' ' + NEG),
    'G1': ('1024x1536', [W1, SHEET], 'face',
           GIRL + 'Her new expression: she feels TOO HOT, like a mild fever: her cheeks flushed pink-red, her eyelids heavy '
           'and droopy, her eyes tired and half closed, her eyebrows slightly raised in the middle, her mouth a little open '
           'as if puffing out warm air, one small clear bead of sweat on her forehead near the temple. She is NOT crying: '
           'no tears, no frown of pain, no squeezed eyes.' + GIRL_END),
    'G2': ('1024x1536', [W1, SHEET], 'face',
           GIRL + 'Her new expression: she feels TOO COLD: she is shivering, her eyes squeezed a little narrow, her eyebrows '
           'pulled together and up, her lips pale with a slight hint of blue, her teeth showing a little as they chatter, '
           'her nose tip a little pink from the cold. Not crying, no tears.' + GIRL_END),
    'G3': ('1024x1536', [W1, SHEET], 'face',
           GIRL + 'Her new expression: something hurts (sore): a brave wince, one eye half shut and the other open, her '
           'eyebrows raised and drawn together, her lips pressed together and pulled a little to one side. Not crying, no '
           'tears.' + GIRL_END),
    'G4': ('1024x1536', [W1, SHEET], 'face',
           GIRL + 'Her new expression: she is HAPPY and better: a big warm open smile showing her top teeth, her eyes bright, '
           'wide and shining, her eyebrows relaxed and lifted, her cheeks lifted and a little rosy.' + GIRL_END),
}


def ref_png(path):
    im = Image.open(path).convert('RGBA')
    bg = Image.new('RGBA', im.size, (128, 128, 128, 255))
    bg.alpha_composite(im)
    b = io.BytesIO()
    bg.convert('RGB').save(b, 'PNG')
    return b.getvalue()


def face_mask():
    """Transparent where the edit may draw (the face ellipse), opaque elsewhere; the size of W1."""
    w, h = Image.open(W1).size
    m = Image.new('RGBA', (w, h), (0, 0, 0, 255))
    cx, cy, rx, ry = FACE
    ImageDraw.Draw(m).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(0, 0, 0, 0))
    b = io.BytesIO()
    m.save(b, 'PNG')
    return b.getvalue()


def estimate(names):
    return sum(OUT_TOKENS[JOBS[n][0]] * PRICE['out'] + len(JOBS[n][1]) * REF_TOKENS * PRICE['image'] + len(JOBS[n][3]) / 4 * PRICE['text'] for n in names)


def cost_of(u):
    d = u.get('input_tokens_details') or {}
    return d.get('image_tokens', 0) * PRICE['image'] + d.get('text_tokens', 0) * PRICE['text'] + u.get('output_tokens', 0) * PRICE['out']


def draw(n, tr, prompt, key):
    size, refs, mask, _ = JOBS[n]
    files = [('image[]', ('ref%d.png' % i, ref_png(p), 'image/png')) for i, p in enumerate(refs)]
    if mask == 'face':
        files.append(('mask', ('mask.png', face_mask(), 'image/png')))
    data = {'model': MODEL, 'prompt': prompt, 'quality': 'high', 'size': size, 'n': '1'}
    if mask is None:
        data['input_fidelity'] = 'high'
    for attempt in range(3):
        r = requests.post('https://api.openai.com/v1/images/edits', headers={'Authorization': 'Bearer ' + key},
                          data=data, files=files, timeout=600)
        if r.status_code == 400 and 'input_fidelity' in r.text and 'input_fidelity' in data:
            data.pop('input_fidelity')
            continue
        if r.status_code in (429, 500, 502, 503) and attempt < 2:
            time.sleep(10 * (attempt + 1))
            continue
        break
    if r.status_code != 200:
        return n, tr, None, r.status_code, r.text[:400]
    body = r.json()
    path = os.path.join(OUT, '%s-v%d.png' % (n.lower(), tr))
    with open(path, 'wb') as f:
        f.write(base64.b64decode(body['data'][0]['b64_json']))
    return n, tr, path, body.get('usage') or {}, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--only', default='')
    ap.add_argument('--try', dest='tr', type=int, default=1)
    ap.add_argument('--prompt-file', default='')
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    log_path = os.path.join(OUT, 'cost.json')
    log = json.load(open(log_path)) if os.path.exists(log_path) else {'model': MODEL, 'calls': []}
    spent = sum(c['usd'] for c in log['calls'])
    names = [x for x in a.only.split(',') if x] or list(JOBS)
    todo = [n for n in names if not os.path.exists(os.path.join(OUT, '%s-v%d.png' % (n.lower(), a.tr)))]
    est = estimate(todo)
    print('spent so far $%.3f; to draw %s (try %d): about $%.2f; cap $%.0f' % (spent, todo, a.tr, est, CAP))
    if a.dry or not todo:
        return
    if spent + est > CAP:
        sys.exit('over the cap')
    key = os.environ.get('OPENAI_API_KEY') or sys.exit('OPENAI_API_KEY is not set')
    prompts = {}
    os.makedirs(os.path.join(OUT, 'prompts'), exist_ok=True)
    for n in todo:
        prompts[n] = open(a.prompt_file).read().strip() if a.prompt_file else JOBS[n][3]
        with open(os.path.join(OUT, 'prompts', '%s-v%d.txt' % (n.lower(), a.tr)), 'w') as f:
            f.write(prompts[n])
    with ThreadPoolExecutor(4) as ex:
        for n, tr, path, usage, err in ex.map(lambda n: draw(n, a.tr, prompts[n], key), todo):
            if err:
                print(n, 'FAILED', usage, err)
                continue
            usd = cost_of(usage)
            log['calls'].append({'name': n, 'try': tr, 'usage': usage, 'usd': round(usd, 4)})
            json.dump(log, open(log_path, 'w'), indent=1)
            print(n, 'v%d' % tr, 'ok', '$%.3f' % usd, os.path.relpath(path, ROOT))
    print('total spent $%.3f' % sum(c['usd'] for c in log['calls']))


if __name__ == '__main__':
    main()
