#!/usr/bin/env python3
"""Screenshots of the Sekelo station v2 (docs/VISUAL-QA.md; design system §15).

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots:
  start        everyone has spoken, nothing threaded yet
  thread       two pieces on the skewer
  rack         a finished skewer on the rack, the next one started
  go           every skewer threaded: the "to the grill" button
  grill        the skewers on the grill, rings running
  turned       a skewer just turned (grilled marks)
  serving      every skewer on the plate, just before Done
  taste        the person tastes it (serve and taste)

  python3 build/shoot_sekelo_v2.py                    # laptop, level 3 (iterating)
  python3 build/shoot_sekelo_v2.py --all --level 4    # laptop + phones
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
VPS["phone"] = {"name": "phone", "width": 390, "height": 844, "touch": True}


class Shooter(T.Player):
    def __init__(self, page, shots, speed, tag):
        super().__init__(page, shots, speed)
        self.tag = tag
        self.taken = set()
        self.pieces = 0
        self.turns = 0
        # the help buttons are the sidebar's (tested by build/test_cook.py), not this station's
        self.helped = True

    def shot(self, name):
        return None

    def snap(self, name):
        if name in self.taken:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))

    def act(self, e):
        key = e.get("key") if isinstance(e, dict) else None
        if os.environ.get("SHOOT_DEBUG"):
            print(round(time.time() % 1000, 1), e.get("kind") if isinstance(e, dict) else e, key, flush=True)
        kind = e.get("kind") if isinstance(e, dict) else None
        if kind == "click" and e.get("selector") == "#go-btn":
            time.sleep(0.5)
            self.snap("go")
        if kind == "click" and e.get("selector") == "#done-btn":
            time.sleep(0.5)
            self.snap("serving")
        if "start" not in self.taken and kind not in ("wait", None) and not e.get("intro"):
            time.sleep(0.9)
            self.snap("start")
        if key == "turn" and "grill" not in self.taken:
            self.snap("grill")
        # Done: click it here (not the player's click, which waits on its own), so the taste is shot live
        r = self.page.click("#done-btn") if kind == "click" and e.get("selector") == "#done-btn" else super().act(e)
        if kind == "tap" and key and key not in ("rack", "undo", "turn", "lift"):
            self.pieces += 1
            if self.pieces == 2:
                time.sleep(0.6)
                self.snap("thread")
            if self.pieces == 6:
                time.sleep(0.6)
                self.snap("rack")
        if key == "turn":
            time.sleep(0.25)
            self.snap("turned")
        if kind == "click" and e.get("selector") == "#done-btn":
            # serve and taste: shoot the moment their face changes (Cook.tasted), then its outcome
            self.page.evaluate("Cook.tasted = null")
            time.sleep(0.5)
            self.snap("taste" if "taste" not in self.taken else "taste2")
            for _ in range(80):
                if self.page.evaluate("Cook.tasted"):
                    break
                time.sleep(0.05)
            time.sleep(0.6)
            if "-wrong" in self.tag and "redo" not in self.taken:
                self.snap("not-quite")
                time.sleep(3.4)
                self.snap("redo")
            else:
                self.snap("praise")
        return r


def run(vp, out, level, speed, guided=False, wrong=False):
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, f"{vp['name']}-l{level}")
        if os.environ.get("SHOOT_DEBUG"):
            print("page open", flush=True)
        # serve and taste: hold the praise (and the "not quite") long enough to shoot it
        page.evaluate("Cook.tasteHold = 2500")
        if wrong:
            # the "not quite" path (serve and taste, §14a): the first plate is tasted as wrong
            P.tag += "-wrong"
            page.evaluate("Cook.forceTaste = false")
        page.evaluate(f"() => {{ __cook.lab('mishkaki-grill', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        t_end = []

        def until():
            # done once they've praised it and the end-of-station pop-up is up (its shot is the last)
            if "praise" not in P.taken:
                return False
            t_end.append(time.time())
            if page.evaluate("!!document.querySelector('.njg-results')"):
                time.sleep(1.0)
                P.snap("results")
                return True
            return time.time() - t_end[0] > 25

        P.play(until, timeout=1200)
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        print("console errors:", bad[:5])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--level", type=int, default=3)
    ap.add_argument("--guided", action="store_true")
    ap.add_argument("--wrong", action="store_true")
    ap.add_argument("--speed", type=float, default=2)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "sekelo-v2"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    T.start_server()
    for name in (["laptop", "phone-landscape", "phone"] if a.all else [a.vp]):
        run(VPS[name], a.out, a.level, a.speed, a.guided, a.wrong)
        print("shot", name, flush=True)


if __name__ == "__main__":
    main()
