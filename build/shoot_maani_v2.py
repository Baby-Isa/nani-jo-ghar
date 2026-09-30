#!/usr/bin/env python3
"""Screenshots of the maani station (docs/VISUAL-QA.md §5; v3: the 29 Sept play-test §5, M3-M9, Q14, Q15).

Plays the Maani line in the Station lab with build/test_cook.py's Player and saves uncropped shots of every
state that draws something different. Two runs per level: the first goes wrong on purpose (it lets the first
maani burn on the tawa and makes one maani too many, so the wrong serve shows); the second is played right.
  start                      everyone has spoken, nothing done yet: the dough piles on the band (M3, M9)
  ball-flying                a ball flying out of the pile to the chakla (M3 / Q14)
  rolling, rolled            the velan rolling it out on the chakla (M4), then the rolled maani waiting
  tawa-raw                   on the tawa (M8), raw side up, the ring part-way, the flames round it (M7)
  turner-flip                the flat wooden turner flipping it (M6 / Q15)
  tawa-half                  the spotted, half-cooked side up, the ring going again (M5)
  lift-cooked                the turner lifting it off, flat and cooked (M5: no puff)
  burnt                      (wrong run) the first maani left too long: the burnt picture after its flip
  serving                    every maani on its plate, just before the tick
  taste-wrong, taste-right   the review face over the plates (wrong run, right run)
  end                        the end pop-up
Files: <vp>-l<level>-<run>-<state>.png, run = wrong | right.

  python3 build/shoot_maani_v2.py                         # laptop, level 1, both runs (iterating)
  python3 build/shoot_maani_v2.py --level 3 --run right   # one run
  python3 build/shoot_maani_v2.py --matrix                # laptop + phone landscape, levels 1-4 -> build/reports/maani-v3/
  python3 build/shoot_maani_v2.py --matrix --vp phone-landscape
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
DEBUG = bool(os.environ.get("SHOOT_DEBUG"))


class Shooter(T.Player):
    def __init__(self, page, shots, speed, tag, wrong):
        super().__init__(page, shots, speed, mistakes=False)
        self.tag = tag
        self.taken = set()
        self.wrong = wrong
        self.burnt = False
        self.extra = False
        self._roll_snap = False

    def shot(self, name):
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
        tasted = self.page.evaluate("Cook.tasted || null")
        if tasted:
            time.sleep(0.5)
            self.snap("taste-right" if tasted == "happy" else "taste-wrong")
            self.page.evaluate("Cook.tasted = null")
        return e

    def act(self, e):
        k = e.get("kind") if isinstance(e, dict) else None
        key = e.get("key") if isinstance(e, dict) else None
        p = self.page
        if DEBUG:
            print(round(time.time() % 1000, 1), k, key, flush=True)
        if "start" not in self.taken and k not in ("wait", None) and not e.get("intro"):
            time.sleep(0.3)
            self.snap("start")
        if k == "tap" and key == "tawa-on":
            time.sleep(0.2)
            self.snap("rolled")
        if k == "roll" and "rolling" not in self.taken:
            self._roll_snap = True
        if k == "more" and e["count"] >= e["target"]:
            if self.wrong and not self.extra:
                # one too many: the count is what the review judges
                self.extra = True
                self.tap(e["sx"], e["sy"], "one too many")
                return None
            time.sleep(0.6)
            self.snap("serving")
            p.click("#done-btn")
            return None
        if k == "timing" and key == "tawa-1":
            if self.wrong and not self.burnt:
                # leave the first one: it catches, and the station flips it (burnt side up)
                self.burnt = True
                time.sleep(1.0)
                self.snap("tawa-raw")
                t0 = time.time()
                while time.time() - t0 < 40:
                    cur = p.evaluate("__cook.expectation()")
                    if cur and cur.get("key") == "tawa-2":
                        break
                    time.sleep(0.05)
                time.sleep(0.5)
                self.snap("burnt")
                return None
            r = self.timed(e)
            if r:
                time.sleep(0.1)
                self.snap("turner-flip")
            return None
        if k == "timing" and key == "tawa-2":
            time.sleep(0.6)
            self.snap("tawa-half")
            r = self.timed(e)
            if r:
                time.sleep(0.12)
                self.snap("lift-cooked")
            return None
        if k == "tap" and key == "dough":
            # slow the station for a moment so the shot catches the ball in the air
            self.page.evaluate("() => { Cook.__ts = Cook.scene.tweens.timeScale; Cook.scene.tweens.timeScale = 0.15; }")
            r = super().act(e)
            time.sleep(0.25)
            self.snap("ball-flying")
            self.page.evaluate("() => { Cook.scene.tweens.timeScale = Cook.__ts; }")
            return r
        return super().act(e)

    def timed(self, e):
        """The Player's timing tap (in the green); True if it tapped."""
        p = self.page
        t0 = time.time()
        while time.time() - t0 < 30:
            g = self.gauge()
            if g and g["level"] >= (g["lo"] + g["hi"]) / 2:
                break
            cur = self.exp()
            if cur and cur.get("kind") != "timing":
                return False
            if not self.wrong and "tawa-raw" not in self.taken and g and g["level"] > 0.25:
                self.snap("tawa-raw")
            time.sleep(0.015)
        self.tap(e["sx"], e["sy"], "timing")
        return True


def run(vp, out, level, speed, wrong):
    tag = f"{vp['name']}-l{level}-{'wrong' if wrong else 'right'}"
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, tag, wrong)
        orig_move = page.mouse.move
        n = {"moves": 0}

        def move(x, y, **kw):
            orig_move(x, y, **kw)
            if P._roll_snap:
                n["moves"] += 1
                if n["moves"] > 30 and "rolling" not in P.taken:
                    P._roll_snap = False
                    P.snap("rolling")

        page.mouse.move = move
        page.evaluate("() => { Cook.tasteHold = 900; }")
        page.evaluate(f"() => {{ __cook.lab('maani-line', false, {json.dumps({'level': level})}); }}")
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
    ap.add_argument("--levels", default="1,2,3,4")
    ap.add_argument("--run", default="both", choices=["both", "wrong", "right"])
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "maani-v3"))
    a = ap.parse_args()
    T.start_server()
    runs = {"both": [True, False], "wrong": [True], "right": [False]}[a.run]
    ok = True
    if a.matrix:
        out = os.path.join(T.ROOT, "build", "reports", "maani-v3")
        os.makedirs(out, exist_ok=True)
        for name in a.vp.split(","):
            for level in [int(x) for x in a.levels.split(",")]:
                for wrong in runs:
                    ok &= run(VPS[name], out, level, a.speed, wrong)
    else:
        os.makedirs(a.out, exist_ok=True)
        for wrong in runs:
            ok &= run(VPS[a.vp], a.out, a.level, a.speed, wrong)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
