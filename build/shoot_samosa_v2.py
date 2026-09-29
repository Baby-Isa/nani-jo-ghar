#!/usr/bin/env python3
"""Screenshots of the samosa station v2 (docs/VISUAL-QA.md; docs/design/cook-design-system-v1.md §15).

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots:
  fill-start  the pastry on the board, the prep bowls on the shelf, nothing chosen yet
  fill-mid    a spoonful landing, its word popping
  filled      the filling in, just before the tick
  fold-glow   the soft glow showing the first swipe
  fold-mid    a flap half folded, following the finger
  folded      a samosa done (on the plate), the next strip in
  fry-start   the hob, the karahi, the knob to light
  frying      samosas in the oil, going golden
  plate       the paper-lined plate with the fried samosas
  taste-right / taste-wrong   serve and taste (--wrong: one spoon too many, so the first serve is not right)
  end         the end-of-station pop-up
  python3 build/shoot_samosa_v2.py                 # laptop, level 1 (iterating)
  python3 build/shoot_samosa_v2.py --level 3 --wrong
  python3 build/shoot_samosa_v2.py --matrix        # phone + laptop, levels, into build/reports/samosa-v2/
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
VPS["phone"] = {"name": "phone", "width": 390, "height": 844, "touch": True}
VPS["phone-landscape"] = {"name": "phone-landscape", "width": 844, "height": 390, "touch": True}
DEBUG = bool(os.environ.get("SHOOT_DEBUG"))


class Shooter(T.Player):
    def __init__(self, page, shots, speed, tag, wrong=False):
        super().__init__(page, shots, speed)
        self.mistakes = False
        self.tag = tag
        self.taken = set()
        self.wrong = wrong
        self.served = 0
        self.spoons = 0
        self.last_tap = None
        self.helped = True

    def shot(self, name):
        return None

    def snap(self, name, force=False):
        if name in self.taken and not force:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))
        if DEBUG:
            print("  snap", name, flush=True)

    def taste(self):
        for _ in range(120):
            time.sleep(0.1)
            st = self.page.evaluate("(() => { const s = Cook.scene; return s ? [...s.children.list].filter(o => o.texture && /sv2-.*-(happy|impatient)$/.test(o.texture.key)).map(o => o.texture.key) : []; })()")
            if st:
                time.sleep(0.6)
                self.snap("taste-right" if st[0].endswith("happy") else "taste-wrong")
                return

    def act(self, e):
        k = e.get("kind") if isinstance(e, dict) else None
        key = e.get("key") if isinstance(e, dict) else None
        if DEBUG:
            print(round(time.time() % 1000, 1), k, key, flush=True)
        if k == "wait" and "frying" in self.taken:
            st = self.page.evaluate("(() => { const s = Cook.scene; return s ? [...s.children.list].filter(o => o.visible && o.texture && /sv2-.*-(neutral|happy|impatient)$/.test(o.texture.key)).map(o => o.texture.key) : []; })()")
            if st and st[0].endswith("neutral"):
                self.snap("plate")
            elif st:
                time.sleep(0.6)
                self.snap("taste-right" if st[0].endswith("happy") else "taste-wrong")
            return
        if k == "tap" and key not in ("knob", "samosa") and "fill-start" not in self.taken:
            time.sleep(0.4)
            self.snap("fill-start")
        if k == "click" and e.get("selector") == "#done-btn" and not self.served:
            if self.wrong and self.last_tap and "wrong-tap" not in self.taken:
                self.taken.add("wrong-tap")
                self.tap(self.last_tap[0], self.last_tap[1], "one too many")
                time.sleep(1.0)
            time.sleep(0.3)
            self.snap("filled")
        if k == "swipe":
            if "fold-glow" not in self.taken:
                time.sleep(0.6)
                self.snap("fold-glow")
            if "fold-mid" not in self.taken:
                p = self.page
                p.mouse.move(e["sx1"], e["sy1"])
                p.mouse.down()
                for s in range(1, 6):
                    p.mouse.move(e["sx1"] + (e["sx2"] - e["sx1"]) * s / 11, e["sy1"] + (e["sy2"] - e["sy1"]) * s / 11)
                    time.sleep(0.02)
                time.sleep(0.2)
                self.snap("fold-mid")
                for s in range(6, 11):
                    p.mouse.move(e["sx1"] + (e["sx2"] - e["sx1"]) * s / 10, e["sy1"] + (e["sy2"] - e["sy1"]) * s / 10)
                    time.sleep(0.02)
                p.mouse.up()
                return
        if k == "click" and e.get("selector") == "#go-btn":
            time.sleep(0.4)
            self.snap("folded")
        if k == "tap" and key == "knob":
            time.sleep(0.5)
            self.snap("fry-start")
        if k == "timing" and "frying" not in self.taken:
            time.sleep(0.2)
            self.snap("frying")
        r = super().act(e)
        if k == "tap" and key not in ("knob", "samosa"):
            self.spoons += 1
            self.last_tap = (e["sx"], e["sy"])
            if self.spoons == 2:
                time.sleep(0.35)
                self.snap("fill-mid")
        return r


def run(vp, out, level, speed, guided=True, wrong=False):
    tag = f"{vp['name']}-l{level}" + ("-wrong" if wrong else "")
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, tag, wrong=wrong)
        page.evaluate(f"() => {{ __cook.lab('samosa', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        if vp["height"] > vp["width"]:
            time.sleep(2.5)
            P.snap("portrait")
            browser.close()
            print(tag, "portrait: the rotate prompt", flush=True)
            return True
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
    ap.add_argument("--wrong", action="store_true")
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "samosa-v2"))
    a = ap.parse_args()
    T.start_server()
    ok = True
    if a.matrix:
        out = os.path.join(T.ROOT, "build", "reports", "samosa-v2")
        os.makedirs(out, exist_ok=True)
        for f in os.listdir(out):
            if f.endswith(".png"):
                os.remove(os.path.join(out, f))
        ok &= run(VPS["phone"], out, 1, a.speed)
        for name in ["laptop", "phone-landscape"]:
            ok &= run(VPS[name], out, 1, a.speed)
            ok &= run(VPS[name], out, 2, a.speed, wrong=True)
            ok &= run(VPS[name], out, 3, a.speed)
        ok &= run(VPS["laptop"], out, 4, a.speed)
    else:
        os.makedirs(a.out, exist_ok=True)
        ok &= run(VPS[a.vp], a.out, a.level, a.speed, wrong=a.wrong)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
