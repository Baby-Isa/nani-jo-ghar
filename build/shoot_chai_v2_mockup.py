#!/usr/bin/env python3
"""Screenshots of lab/chai-v2-mockup.html (design system v1 §9 step 1), laptop only (1366x768):
build/reports/chai-v2-mockup/state-a.png, state-b.png, state-c.png.

  python3 build/shoot_chai_v2_mockup.py

Nunito comes from Google Fonts; the page's font requests are fetched here (through the environment's
proxy, which the headless browser doesn't use) and handed to the page, so the shots use the real face.
"""
import os

import requests
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'reports', 'chai-v2-mockup')
PAGE = 'file://' + os.path.join(ROOT, 'lab', 'chai-v2-mockup.html')


def fonts(route):
    try:
        r = requests.get(route.request.url, headers={'User-Agent': route.request.headers.get('user-agent', '')}, timeout=30)
        route.fulfill(status=r.status_code, body=r.content, headers={'content-type': r.headers.get('content-type', ''),
                                                                      'access-control-allow-origin': '*'})
    except requests.RequestException:
        route.abort()


def main():
    os.makedirs(OUT, exist_ok=True)
    with sync_playwright() as p:
        exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
        b = p.chromium.launch(executable_path=exe if os.path.exists(exe) else None)
        pg = b.new_page(viewport={'width': 1366, 'height': 768})
        pg.route('https://fonts.googleapis.com/**', fonts)
        pg.route('https://fonts.gstatic.com/**', fonts)
        for s in 'abc':
            pg.goto(PAGE + '?shot#' + s)
            pg.evaluate('document.fonts.ready')
            pg.wait_for_timeout(400)
            print(s, 'Nunito' if pg.evaluate("document.fonts.check('800 20px Nunito')") else 'NO NUNITO')
            pg.locator('#stage').screenshot(path=os.path.join(OUT, f'state-{s}.png'))
        b.close()


if __name__ == '__main__':
    main()
