#!/usr/bin/env python3
"""Screenshots of the daar station v3 (docs/VISUAL-QA.md §5; the 29 Sept play-test §6, D1-D11, S16).

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots of every
state that draws something different. One run per level: the first try goes wrong on purpose (it stirs
past the count, through every band of the speed dial), so the wrong serve shows; the second try is right.
  chop-start, chop-mid, chopped        the swipe chop (Nani's card, the ring, the knife), the pieces at the side
  cook-start, hot, tadka-mid, piles    the kit hob and the v3 pot (hot oil), the knob on (no ring, S16),
                                       the seeds in, the chopped piles waiting (D9: their rows back to do)
  veg-in, daar-in                      the pot after the vegetables, after the daar (the tadka on top)
  stir-stopped, stir-tortoise,         the stir: the dial at each band, the laps as the Kutchi word,
  stir-hare, stir-spill, stir-mid      the contents turning (D10)
  taste-wrong, again-*, taste-right    the review face over the trivet bowl, wrong then right
  end                                  the end pop-up
  python3 build/shoot_daar_v3.py                  # laptop, level 1 (iterating)
  python3 build/shoot_daar_v3.py --matrix         # laptop + phone landscape, levels 1-4, build/reports/daar-v3/
  python3 build/shoot_daar_v3.py --side bowl      # the chopped pieces in the v3 veg-bowl instead (Q4's other option)
"""
import argparse
import json
import math
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_cook as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

VPS = {v["name"]: v for v in T.VIEWPORTS}
VPS["phone-landscape"] = {"name": "phone-landscape", "width": 844, "height": 390, "touch": True}
DEBUG = bool(os.environ.get("SHOOT_DEBUG"))
FORCE = ""  # --force: slots forced on the lab's order (JSON)
PHASE_SHOT = {"chopped": "chopped", "hot": "hot", "piles": "piles", "veg-in": "veg-in", "daar-in": "daar-in"}


class Shooter(T.Player):
    def __init__(self, page, shots, speed, tag, wrong=True):
        super().__init__(page, shots, speed, mistakes=False)
        self.tag = tag
        self.taken = set()
        self.wrong = wrong
        self.slices = 0
        self.helped = True
        self.phase = None

    def shot(self, name):
        if name == "stir-mid" and not self.wrong:
            self.snap("stir-mid")
        return None

    def snap(self, name):
        if name in self.taken:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))
        if DEBUG:
            print("  snap", name, flush=True)

    def exp(self):
        e = super().exp()
        st = self.page.evaluate("[Cook.daarPhase || null, Cook.tasted || null]")
        if st[0] != self.phase:
            self.phase = st[0]
            if st[0] in PHASE_SHOT:
                time.sleep(0.5 if st[0] != "chopped" else 0.1)
                self.snap(PHASE_SHOT[st[0]])
        if st[1]:
            time.sleep(0.5)
            self.snap("taste-right" if st[1] == "happy" else "taste-wrong")
            self.page.evaluate("Cook.tasted = null")
            if st[1] != "happy" and self.wrong:
                # the second try: the same states again, played right
                self.wrong = False
                self.tag += "-again"
                self.taken = {n for n in self.taken if n.startswith("taste")}
                self.slices = 0
        return e

    def act(self, e):
        k = e.get("kind") if isinstance(e, dict) else None
        key = e.get("key") if isinstance(e, dict) else None
        if k == "slice":
            self.slices += 1
            if self.slices == 1:
                time.sleep(0.2)
                self.snap("chop-start")
        if k == "tap" and key == "knob":
            time.sleep(0.3)
            self.snap("cook-start")
        if k == "stir" and self.wrong:
            return self.dial_stir(e)
        if k == "stir":
            time.sleep(0.4)
            self.snap("stir-stopped")
        r = super().act(e)
        if k == "slice" and self.slices == 5:
            time.sleep(0.1)
            self.snap("chop-mid")
        if k == "tap" and key and key.startswith("spi-") and "tadka-mid" not in self.taken:
            time.sleep(0.9)
            self.snap("tadka-mid")
        return r

    def dial_stir(self, e):
        """Stir through every band of the dial (a shot at each), then past the count: the wrong serve."""
        p = self.page
        cx, cy, r, target = e["sx"], e["sy"], e["srx"], e["target"]
        time.sleep(0.5)
        self.snap("stir-stopped")
        # through every band (in-page, steady: Cook.stirDrive), a shot in each while it's turning
        for rate, name, ms in [(0.45, "stir-tortoise", 2600), (1.4, "stir-hare", 2000), (3.0, "stir-spill", 1300)]:
            p.evaluate(f"() => {{ Cook.__drive = Cook.stirDrive({rate}, {ms}); }}")
            time.sleep(ms / 1000 * 0.9)
            if DEBUG:
                print("   dial", name, p.evaluate("Cook.stirSpeed ? Cook.stirSpeed() : -1"), flush=True)
            p.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))
            self.taken.add(name)
            p.evaluate("() => Cook.__drive")
        # on past the count (one too many)
        for _ in range(40):
            count = p.evaluate("Cook.stirCount ? Cook.stirCount() : -1")
            if count < 0 or count > target:
                break
            p.evaluate("() => Cook.stirDrive(0.7, 500)")
        time.sleep(0.3)
        p.click("#done-btn")


def run(vp, out, level, speed, side="counter"):
    tag = f"{vp['name']}-l{level}" + ("-bowl" if side == "bowl" else "")
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, tag)
        page.evaluate(f"() => {{ Cook.daarSide = {json.dumps(side)}; Cook.tasteHold = 900; Cook.daarForce = {FORCE or 'null'}; }}")
        page.evaluate(f"() => {{ __cook.lab('daar', false, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        P.play(lambda: page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), timeout=900)
        time.sleep(1.0)
        P.snap("end")
        res = page.evaluate("Cook.labResult ? [Cook.labResult.why, Cook.labResult.skills.join(' · '), Cook.labResult.help] : null")
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    print(tag, res, ("console errors: " + str(bad[:5])) if bad else "no console errors", flush=True)
    return not bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--matrix", action="store_true")
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--level", type=int, default=1)
    ap.add_argument("--side", default="counter")
    ap.add_argument("--force", default="", help='slots to force on the lab order, JSON: \'{"onions": 0}\' (30 Sept: a no-onion order)')
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "daar-v3"))
    a = ap.parse_args()
    global FORCE
    FORCE = a.force
    T.start_server()
    ok = True
    if a.matrix:
        out = os.path.join(T.ROOT, "build", "reports", "daar-v3")
        os.makedirs(out, exist_ok=True)
        for name in a.vp.split(","):
            for level in (1, 2, 3, 4):
                ok &= run(VPS[name], out, level, a.speed)
    else:
        os.makedirs(a.out, exist_ok=True)
        ok &= run(VPS[a.vp], a.out, a.level, a.speed, side=a.side)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
