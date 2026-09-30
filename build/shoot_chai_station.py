#!/usr/bin/env python3
"""Screenshots of the Chai tray station (docs/archive/process/VISUAL-QA.md): start, mid-pour, full tray.

Plays the station in the Station lab with build/test_cook.py's Player and saves
uncropped shots at the moments that matter.

  python3 build/shoot_chai_station.py                      # laptop only (iterating)
  python3 build/shoot_chai_station.py --all                # laptop + phone landscape
  python3 build/shoot_chai_station.py --out build/reports/chai-station --level 3
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
    """The test player, taking a picture at the start of a pour, mid-pour and before the tick."""

    def __init__(self, page, shots, speed, tag):
        super().__init__(page, shots, speed)
        self.tag = tag
        self.taken = set()

    def shot(self, name):
        return None  # only the named moments below

    def snap(self, name):
        if name in self.taken:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))

    def act(self, e):
        key = e.get("key") if isinstance(e, dict) else None
        if isinstance(e, dict) and e.get("kind") == "click" and e.get("selector") == "#done-btn":
            time.sleep(0.4)
            self.snap("full-tray")
        r = super().act(e)
        if key in ("cook-paani",) and "water-pour" not in self.taken:
            time.sleep(0.55)
            self.snap("water-pour")
        if key == "pan" and "mid-pour" not in self.taken:
            time.sleep(0.55)
            self.snap("mid-pour")
        if key == "cook-dudh" and "milk-pour" not in self.taken:
            time.sleep(0.55)
            self.snap("milk-pour")
        if isinstance(e, dict) and e.get("kind") in ("knob", "hold", "tap") and key and key.startswith("cup-") and "cups" not in self.taken:
            self.snap("cups")
        return r


def run(vp, out, level, speed):
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, vp["name"] if level == 1 else f"{vp['name']}-l{level}")
        page.evaluate(f"() => {{ __cook.lab('chai-tray', true, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        time.sleep(1.2)
        P.snap("start")
        P.play(lambda: page.evaluate("!!document.querySelector('#lab-list') && !document.querySelector('#overlay').classList.contains('hidden')"), timeout=300)
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        print("console errors:", bad[:5])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--level", type=int, default=1)
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "chai-station"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    T.start_server()
    for name in (["laptop", "phone-landscape"] if a.all else [a.vp]):
        run(VPS[name], a.out, a.level, a.speed)
        print("shot", name)


if __name__ == "__main__":
    main()
