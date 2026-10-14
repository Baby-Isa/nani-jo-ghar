#!/usr/bin/env python3
"""Sprint 4 art, session C (brief build/tools/ops/specs/s04c-art.brief.txt; feedback Z3, Z9; rows CK-21, CHT-11, ART-13):
the served chaat redrawn at the counter tray's low camera with no baked shadow, and Nani leaning on the counter in
every Cook service mood (nani-neutral, -happy, -talk, -point, swapped under the same keys: no code change).
gpt-image-2 via /images/edits, quality high, the style anchor and the approved art attached; flat #808080 ground.
Fable (an Agent subagent, model fable) judges every try; a redo passes Fable's amended prompt with --prompt-file.
Every try is kept (sources/art/s04c/<id>-v<n>.png); spend is logged from the API's usage to sources/art/s04c/cost.json.

  python3 build/gen_s04c.py --dry                                  # the estimate
  python3 build/gen_s04c.py --only C1                              # try 1
  python3 build/gen_s04c.py --only C1 --try 2 --prompt-file p.txt  # a redo with Fable's amended prompt
  python3 build/gen_s04c.py --only N1 --base sources/art/s04c/n0-v2.png   # a mood as a masked edit of the passed base
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
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 's04c')
A = lambda *p: os.path.join(ROOT, *p)
ANCHOR = A('sources', 'art', 'style-anchor-v1.png')
SHEET = A('sources', 'art', 'characters', 'char-nani-v2.png')
CAP = 20.0
MODEL = 'gpt-image-2'
PRICE = {'text': 5e-6, 'image': 10e-6, 'out': 40e-6}  # USD per token (s03's measured rates)
OUT_TOKENS = {'1024x1024': 4160, '1536x1024': 6240, '1024x1536': 6240}
REF_TOKENS = 1300

GROUND = ('Background: one perfectly flat, uniform neutral mid-grey, hex #808080, filling the whole image edge to edge. '
          'No floor, no table, no gradient, no texture. NO shadows of any kind.')
STYLE = ('Style: exactly as the attached style anchor and references: a stylised 3D animated-feature-film look, '
         'semi-photoreal materials, soft global illumination, warm light from the upper left, no outlines.')
NEG = 'Do not add any text, letters, numbers, labels, logos or watermarks. No outlines, no cel shading, no photorealism, no blur.'
NANI = ('She is EXACTLY the woman on the attached character sheet (Nani, a warm grandmother): the same face, the same '
        'thin round gold glasses, the same small mole, the same warm skin, the same deep red scarf wrapped round her head '
        'and neck covering all her hair, the same long-sleeved cream kurta with red and gold embroidery at the cuffs and '
        'chest, the thin white pearl bracelet on her right wrist, two gold rings (one with an oval red stone, one with a '
        'small white stone), no bangles. Modest: sleeves to the wrists, scarf covering hair and neck. No bindi, tilak or '
        'other religious markers. ')

# the camera reference: the middle tray on the kitchen island (assets/cook/bg/service-v2.webp), made in prep()
TRAY_REF = os.path.join(OUT, 'ref-tray.png')
PANEL_REF = os.path.join(OUT, 'ref-nani-panel.png')
FACE = None  # set per base in mood jobs (cx, cy, rx, ry) on the base image

JOBS = {
    'C1': ('1536x1024', [ANCHOR, A('assets/cook/items/v3/chaat/bowl-side-v2.webp'), TRAY_REF], None,
           'Generate one served dish for a children\'s cooking game: a bowl of chaat ready to serve. The bowl is EXACTLY '
           'the attached clear glass bowl (wide, flared, with a flat round base) and it is seen exactly as in that '
           'picture: from the side, the camera at the height of the rim looking only about 12 degrees down, so the rim is '
           'a THIN ellipse (its height about a quarter of its width) and the bowl\'s front wall faces the camera straight '
           'on. This is the same low camera as the attached photo of a wooden tray on a kitchen counter: the dish will be '
           'served on that tray, so it must match its angle; but do NOT draw the tray, the counter or the kitchen. Through '
           'the clear glass wall the layers of the chaat show as neat horizontal bands, from the bottom up: boiled '
           'chickpeas (chana) with small cubes of boiled potato; chopped red onion and tomato; a band of thick white '
           'yoghurt (dahi); a drizzle of dark brown tamarind chutney and a little green chutney; and on top, heaped a little '
           'above the rim, crispy golden-yellow sev sprinkled with fresh green coriander leaves. The food is matte and '
           'appetising, clearly food: never liquid-looking, never glossy beads, never like sweets. The bowl stands on its '
           'flat base and NOTHING is drawn under or around it: no contact shadow, no dark ring, no reflection, no plate. '
           'Centred, filling about 60% of the image width, clear background all round. ' + GROUND + ' ' + STYLE + ' ' + NEG +
           ' Halal food only.'),
    'N0': ('1024x1024', [PANEL_REF, SHEET, ANCHOR], None,
           'Edit the first attached picture: Nani at a kitchen counter. ' + NANI + 'Change her pose: she is now LEANING '
           'on the counter, relaxed and friendly, as a grandmother leans on her kitchen counter to chat with a child: her '
           'upper body tilts forward over the counter, her shoulders a little forward and down, both forearms lying flat '
           'along the counter top, folded loosely one over the other in front of her chest with her hands resting on her '
           'forearms, her elbows out to the sides resting on the counter. Her head is a little forward and tilted very '
           'slightly to one side; she looks straight at the viewer with a warm, gentle, closed-mouth smile. The camera is '
           'at the height of the counter top looking straight at her, as in the first picture. The counter top is a plain '
           'white slab running the full width of the image across the bottom, its top edge one straight horizontal line '
           'about 78% down the image; her forearms and elbows rest ON it and nothing of her shows below it. Framing: from '
           'a little above the top of her scarf down to the counter; her whole head, both shoulders, both elbows and both '
           'hands inside the image with a clear margin left and right. Everything above the counter that is not her is '
           'the flat grey background. Background: one perfectly flat, uniform neutral mid-grey, hex #808080, no shadows '
           'on it. ' + STYLE + ' ' + NEG),
    # the moods: masked edits of the passed base (--base); only the masked area changes, then it is pasted back feathered
    'N1': ('1024x1024', [None, SHEET], 'face',
           'Edit the attached picture of Nani leaning on her counter. Change ONLY her face inside the masked area: her '
           'expression. Everything else stays exactly as it is: her scarf, glasses, kurta, arms, hands, the counter, the '
           'grey background, her size and position. ' + NANI + 'Her new expression: HAPPY and delighted with the child: a big '
           'warm open smile showing her top teeth, her eyes bright and crinkled with joy behind her glasses, her cheeks '
           'lifted. ' + NEG),
    'N2': ('1024x1024', [None, SHEET], 'face',
           'Edit the attached picture of Nani leaning on her counter. Change ONLY her face inside the masked area: her '
           'expression. Everything else stays exactly as it is: her scarf, glasses, kurta, arms, hands, the counter, the '
           'grey background, her size and position. ' + NANI + 'Her new expression: TALKING kindly to a child, caught mid-word: '
           'her mouth open in a soft relaxed oval as when saying "aa", a little of her top teeth showing, her eyebrows '
           'lifted a little, her eyes warm and engaged, a slight smile in her cheeks. ' + NEG),
    'N3': ('1024x1024', [None, SHEET], 'point',
           'Edit the attached picture of Nani leaning on her counter. Change ONLY what is inside the masked area. ' + NANI +
           'Her LEFT forearm (on the right side of the picture as we see it) stays resting on the counter exactly as it is. '
           'Inside the mask, her other hand (her right hand, on the left of the picture) lifts off the counter: her right '
           'elbow stays on the counter and her forearm rises, her hand at about shoulder height beside her face, pointing '
           'with her index finger down and towards the viewer\'s right, as if pointing at the food on the counter; the '
           'other fingers curled, her pearl bracelet on that wrist, the sleeve to the wrist. Her face: talking kindly, '
           'mouth a little open, eyebrows lifted. Everything outside the mask stays exactly as it is. Five fingers, natural '
           'hand. ' + NEG),
}
# point, try 3 on: only the base attached (the sheet made the model reframe her: she grew 20% and her arms sank)
JOBS['N3b'] = ('1024x1024', [None], 'point', JOBS['N3'][3])
# try 4: the arm only (no face in the mask), on the talk composite (n2-on-n0.png), the sheet attached for likeness
JOBS['N3c'] = ('1024x1024', [None, SHEET], 'arm', JOBS['N3'][3])


def ref_png(path, size=None):
    im = Image.open(path).convert('RGBA')
    bg = Image.new('RGBA', im.size, (128, 128, 128, 255))
    bg.alpha_composite(im)
    b = io.BytesIO()
    bg.convert('RGB').save(b, 'PNG')
    return b.getvalue()


def prep():
    os.makedirs(OUT, exist_ok=True)
    if not os.path.exists(TRAY_REF):
        bg = Image.open(A('assets/cook/bg/service-v2.webp')).convert('RGB')
        bg.crop((560, 520, 1044, 760)).resize((968, 480), Image.LANCZOS).save(TRAY_REF)
    if not os.path.exists(PANEL_REF):
        # the sheet's counter panel (its leaning close-up), on a 1024 square of the flat grey
        p = Image.open(SHEET).convert('RGB').crop((1030, 0, 1536, 600))
        p = p.resize((round(p.width * 1.4), round(p.height * 1.4)), Image.LANCZOS)
        c = Image.new('RGB', (1024, 1024), (128, 128, 128))
        c.paste(p, ((1024 - p.width) // 2, 1024 - p.height - 40))
        c.save(PANEL_REF)


def mask_png(base, kind):
    """Transparent where the edit may draw, opaque elsewhere (the base's size). Regions come from MOODMASK in
    sources/art/s04c/masks.json: {"face": [cx, cy, rx, ry], "point": [[x0, y0, x1, y1], ...]} on the base."""
    w, h = Image.open(base).size
    regions = json.load(open(os.path.join(OUT, 'masks.json')))
    m = Image.new('RGBA', (w, h), (0, 0, 0, 255))
    d = ImageDraw.Draw(m)
    cx, cy, rx, ry = regions['face']
    if kind != 'arm':
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(0, 0, 0, 0))
    if kind in ('point', 'arm'):
        for b in regions['arm']:
            d.rectangle(b, fill=(0, 0, 0, 0))
    b = io.BytesIO()
    m.save(b, 'PNG')
    return b.getvalue()


def cost_of(u):
    d = u.get('input_tokens_details') or {}
    return d.get('image_tokens', 0) * PRICE['image'] + d.get('text_tokens', 0) * PRICE['text'] + u.get('output_tokens', 0) * PRICE['out']


def estimate(names):
    return sum(OUT_TOKENS[JOBS[n][0]] * PRICE['out'] + len(JOBS[n][1]) * REF_TOKENS * PRICE['image'] + len(JOBS[n][3]) / 4 * PRICE['text'] for n in names)


def draw(n, tr, prompt, key, base=None):
    size, refs, mask, _ = JOBS[n]
    refs = [base if r is None else r for r in refs]
    files = [('image[]', ('ref%d.png' % i, ref_png(p), 'image/png')) for i, p in enumerate(refs)]
    if mask:
        files.append(('mask', ('mask.png', mask_png(base, mask), 'image/png')))
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
    ap.add_argument('--prompt-file')
    ap.add_argument('--base')
    a = ap.parse_args()
    names = [n for n in (a.only.split(',') if a.only else JOBS) if n]
    print('estimate: $%.2f for %s' % (estimate(names), ','.join(names)))
    if a.dry:
        return
    prep()
    cp = os.path.join(OUT, 'cost.json')
    log = json.load(open(cp)) if os.path.exists(cp) else {'model': MODEL, 'calls': []}
    spent = sum(c['usd'] for c in log['calls'])
    if spent + estimate(names) > CAP:
        sys.exit('stop: $%.2f spent, the cap is $%.0f' % (spent, CAP))
    key = os.environ['OPENAI_API_KEY']
    with ThreadPoolExecutor(3) as ex:
        futs = []
        for n in names:
            prompt = open(a.prompt_file).read().strip() if a.prompt_file else JOBS[n][3]
            pdir = os.path.join(OUT, 'prompts')
            os.makedirs(pdir, exist_ok=True)
            open(os.path.join(pdir, '%s-v%d.txt' % (n.lower(), a.tr)), 'w').write(prompt)
            futs.append(ex.submit(draw, n, a.tr, prompt, key, a.base))
        for f in futs:
            n, tr, path, usage, err = f.result()
            if err:
                print('%s try %d FAILED %s %s' % (n, tr, usage, err))
                continue
            usd = round(cost_of(usage), 4)
            log['calls'].append({'name': n, 'try': tr, 'usage': usage, 'usd': usd, 'base': a.base})
            print('%s try %d -> %s ($%.3f)' % (n, tr, path, usd))
    json.dump(log, open(cp, 'w'), indent=1)
    print('spent so far: $%.2f of $%.0f' % (sum(c['usd'] for c in log['calls']), CAP))


if __name__ == '__main__':
    main()
