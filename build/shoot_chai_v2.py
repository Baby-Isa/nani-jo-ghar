#!/usr/bin/env python3
"""Screenshots of the chai station v2 (docs/VISUAL-QA.md): start, mid-cook with a pour, serving.

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots:
  start       everyone has spoken, nothing done yet
  mid-cook    the milk carton pouring into a pan (another pan heating, when there are two or more)
  pan-pour    a ready pan tipped over its person's glass
  serving     every glass poured, just before the tick

  python3 build/shoot_chai_v2.py                       # laptop, level 2 (iterating)
  python3 build/shoot_chai_v2.py --all --level 3       # laptop + phone landscape
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
    def __init__(self, page, shots, speed, tag):
        super().__init__(page, shots, speed)
        self.tag = tag
        self.taken = set()
        self.helped = bool(os.environ.get("SHOOT_NOHELP"))

    def shot(self, name):
        return None

    def snap(self, name):
        if name in self.taken:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))

    def act(self, e):
        key = e.get("key") if isinstance(e, dict) else None
        if isinstance(e, dict) and e.get("kind") == "click" and e.get("selector") == "#done-btn":
            time.sleep(0.5)
            self.snap("serving")
        if "start" not in self.taken and isinstance(e, dict) and e.get("kind") not in ("wait", None) and not e.get("intro"):
            time.sleep(0.3)
            self.snap("start")
        if os.environ.get("SHOOT_DEBUG"): print(round(time.time() % 1000, 1), e.get("kind"), key, flush=True)
        r = super().act(e)
        if key == "cook-dudh" and "mid-cook" not in self.taken:
            time.sleep(0.45)
            self.snap("mid-cook")
        if key and key.startswith("pour-") and "pan-pour" not in self.taken:
            time.sleep(0.75 / self.speed * 3)
            self.snap("pan-pour")
        return r


def run(vp, out, level, speed, guided=False):
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, f"{vp['name']}-l{level}")
        page.evaluate(f"() => {{ __cook.lab('chai-tray', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        P.play(lambda: page.evaluate("!!document.querySelector('#lab-list') && !document.querySelector('#overlay').classList.contains('hidden')"), timeout=1200)
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        print("console errors:", bad[:5])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--level", type=int, default=2)
    ap.add_argument("--guided", action="store_true")
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "chai-v2"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    T.start_server()
    for name in (["laptop", "phone-landscape"] if a.all else [a.vp]):
        run(VPS[name], a.out, a.level, a.speed, a.guided)
        print("shot", name)


if __name__ == "__main__":
    main()
