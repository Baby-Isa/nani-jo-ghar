#!/usr/bin/env python3
"""Chai v2 mock-up art (docs/design-language/ui-design-system.md §9 step 1): ONE medium draft each of
the two pieces the repo doesn't have yet, matched to sources/art/style-anchor-v1.png:
  hob-2  a compact top-down hob with exactly 2 burners
  tray-4 a small square wooden tray with 4 round cut-outs, top-down
gpt-image-1 via /images/edits (the style anchor as the reference), quality medium, 1024x1024,
flat #808080 background (cut afterwards by build/cut_chai_v2_mockup.py).
About $0.06 each with the reference image; a draft already on disk is never paid for twice.

  python3 build/gen_chai_v2_mockup.py
"""
import base64
import os
import sys

import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sources', 'art', 'chai-v2-mockup')
ANCHOR = os.path.join(ROOT, 'sources', 'art', 'style-anchor-v1.png')
STYLE = ('Match the reference image exactly in rendering style: soft semi-realistic 3D product render, warm soft '
         'light from the upper left, one soft contact shadow, gentle saturation, clean and premium, a children\'s '
         'cooking game asset. Camera: exactly top-down (orthographic, looking straight down). The object alone, '
         'centred, filling about 80% of the frame, on a perfectly flat, even, plain mid-grey #808080 background. '
         'No marble, no counter, no text, no labels, no people, no hands, no other objects.')
PROMPTS = {
    'hob-2': ('A compact tabletop gas hob with exactly TWO burners side by side (left and right), seen from '
              'directly above. A small rounded-rectangle plate of matte charcoal enamelled steel, wider than tall '
              '(about 2:1), with a thin brushed-steel rim. Each burner: a small round brass burner cap inside a '
              'black cast-iron pan support with four short prongs. Nothing on the burners, no pans, no flames, '
              'no control knobs. Plain, calm, uncluttered. ' + STYLE),
    'tray-4': ('A small SQUARE wooden serving tray seen from directly above: warm honey-coloured sheesham wood '
               'with a low raised rim and softly rounded corners. The flat tray surface has FOUR round cut-outs '
               'in a neat 2 by 2 grid, each a shallow circular recessed well sized to hold one small tea glass, '
               'evenly spaced with generous margins. The tray is empty. Simple, calm, handmade feel. ' + STYLE),
}


def main():
    key = os.environ.get('OPENAI_API_KEY')
    if not key:
        sys.exit('OPENAI_API_KEY is not set')
    os.makedirs(OUT, exist_ok=True)
    for name, prompt in PROMPTS.items():
        dst = os.path.join(OUT, name + '-draft1.png')
        if os.path.exists(dst):
            print(name, 'already drawn, skipped')
            continue
        with open(ANCHOR, 'rb') as f:
            r = requests.post('https://api.openai.com/v1/images/edits',
                              headers={'Authorization': 'Bearer ' + key},
                              data={'model': 'gpt-image-1', 'prompt': prompt, 'quality': 'medium',
                                    'size': '1024x1024', 'n': '1'},
                              files={'image[]': ('style-anchor-v1.png', f, 'image/png')}, timeout=300)
        if r.status_code != 200:
            print(name, 'FAILED', r.status_code, r.text[:300])
            continue
        body = r.json()
        with open(dst, 'wb') as f:
            f.write(base64.b64decode(body['data'][0]['b64_json']))
        print(name, 'ok', body.get('usage'))


if __name__ == '__main__':
    main()
