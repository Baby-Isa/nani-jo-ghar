#!/usr/bin/env python3
"""Screenshots of the maani station v2 (docs/VISUAL-QA.md): start, rolling, on the tawa, serving.

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots:
  start      everyone has spoken, nothing done yet
  rolling    the pin rolling a ball on the chakla
  tawa       a maani cooking on the tawa, its heat ring filling (the next one rolling, when it can)
  serving    every maani on the plates, just before the tick

  python3 build/shoot_maani_v2.py                       # laptop, level 2 (iterating)
  python3 build/shoot_maani_v2.py --all --level 3       # laptop + phone landscape
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

    def shot(self, name):
        return None

    def snap(self, name):
        if name in self.taken:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))

    def act(self, e):
        kind = e.get("kind") if isinstance(e, dict) else None
        if kind == "click" and e.get("selector") == "#done-btn":
            time.sleep(0.5)
            self.snap("serving")
            self.done_at = time.time()
        if "start" not in self.taken and kind not in ("wait", None) and not e.get("intro"):
            time.sleep(0.3)
            self.snap("start")
        if os.environ.get("SHOOT_DEBUG"):
            print(round(time.time() % 1000, 1), kind, e.get("key"), flush=True)
        if kind == "more":
            # every maani on its plate, nothing on the go: the tick's moment (the last one wins)
            time.sleep(0.6)
            self.taken.discard("serving")
            self.snap("serving")
        if kind == "timing" and "tawa" not in self.taken:
            # the ring part-way round, before the green
            time.sleep(1.2 / self.speed)
            self.snap("tawa")
        if kind == "roll" and "rolling" not in self.taken:
            # a snap half-way through the drag
            self._roll_snap = True
        return super().act(e)

    def tap(self, x, y, what=""):
        return super().tap(x, y, what)


def run(vp, out, level, speed, guided=False):
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, f"{vp['name']}-l{level}")
        orig_move = page.mouse.move
        n = {"moves": 0}

        def move(x, y, **kw):
            orig_move(x, y, **kw)
            if getattr(P, "_roll_snap", False):
                n["moves"] += 1
                if n["moves"] > 40 and "rolling" not in P.taken:
                    P._roll_snap = False
                    P.snap("rolling")

        page.mouse.move = move
        page.evaluate(f"() => {{ __cook.lab('maani-line', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        P.done_at = None
        P.play(lambda: bool(P.done_at and time.time() - P.done_at > 4) or page.evaluate("!!document.querySelector('#lab-list') && !document.querySelector('#overlay').classList.contains('hidden')"), timeout=1200)
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
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "maani-v2"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    T.start_server()
    for name in (["laptop", "phone-landscape"] if a.all else [a.vp]):
        run(VPS[name], a.out, a.level, a.speed, a.guided)
        print("shot", name)


if __name__ == "__main__":
    main()
