#!/usr/bin/env python3
"""Screenshots for the shared Cook fixes of 29 Sept (build/reports/cook-shared-fixes.md; docs/archive/process/VISUAL-QA.md 5).

Plays a lab station with build/test_cook.py's Player and saves uncropped shots every `--every` seconds
(the request pop-up first, then the station as it's played), so the pop-up, Nani's box, the shelf
band, the heat gauge and the sidebar card are all caught:

  python3 build/shoot_shared_fixes.py --station chai-tray --level 2        # laptop
  python3 build/shoot_shared_fixes.py --station maani-line --vp phone-landscape
"""
import argparse
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_cook as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

VPS = {v["name"]: v for v in T.VIEWPORTS}
VPS["phone-landscape"] = {"name": "phone-landscape", "width": 844, "height": 390, "touch": True}


class Shooter(T.Player):
    def __init__(self, page, shots, speed, tag, every):
        super().__init__(page, shots, speed)
        self.tag = tag
        self.every = every
        self.t0 = time.time()
        self.n = 0
        self.helped = False

    def shot(self, name):
        return None

    def snap(self, name):
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))

    def tick(self):
        if time.time() - self.t0 > self.every * (self.n + 1):
            self.n += 1
            self.snap(f"t{self.n:02d}")

    def exp(self):
        self.tick()
        return super().exp()


def run(vp, out, station, level, speed, secs, every, guided):
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, f"{station}-{vp['name']}-l{level}", every)
        page.evaluate(f"() => {{ __cook.lab('{station}', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
        time.sleep(1.6)
        P.snap("popup")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=15000)
        P.t0 = time.time()
        try:
            P.play(lambda: time.time() - P.t0 > secs, timeout=secs + 60)
        except Exception as e:  # the station ended (the lab's end pop-up) before the time was up
            print("play stopped:", str(e)[:120])
        P.snap("end")
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        print("console errors:", bad[:5])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--station", default="chai-tray")
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--level", type=int, default=2)
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--secs", type=float, default=40)
    ap.add_argument("--every", type=float, default=6)
    ap.add_argument("--guided", action="store_true")
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "reports", "cook-shared-fixes", "iter"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    T.start_server()
    run(VPS[a.vp], a.out, a.station, a.level, a.speed, a.secs, a.every, a.guided)
    print("shot", a.station, a.vp)


if __name__ == "__main__":
    main()
