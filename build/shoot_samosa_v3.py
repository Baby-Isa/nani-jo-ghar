#!/usr/bin/env python3
"""Screenshots of the samosa station v3 (29 Sept play-test, S1-S21; docs/VISUAL-QA.md §5).

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots:
  fill-start  the flat strip on the house board, the filling heaps on the band (S2, S6), nothing chosen yet
  fill-mid    a spoonful landing on the strip's end, its word popping
  filled      the filling in, just before the tick
  fold-glow   the soft glow showing the first swipe
  fold-1-mid  the first fold half way (the fold-2 triangle wiping over the filling)
  fold-1 / fold-2 / fold-3   the fixed picture after each swipe (S8, S11: fold-2, fold-4, fold-6)
  sam-2-filled  the second strip, pre-filled with the same filling (S9)
  folded      samosas on the plate's flat middle (S10), "fry them" up
  fry-start   the wide hob, the big karahi, the knob to light (S17, S19)
  fry-on      the knob on: flames up, no heating ring (S16, S21)
  frying-1    one samosa in the oil;  frying-all  all of them in
  scoop       the jharo under a samosa, lifting it (S20)
  plate       the plate with the fried samosas
  taste-right / taste-wrong   the review face over the plate (--wrong: one spoon too many)
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
        self.swipes = 0

    def shot(self, name):
        return None

    def snap(self, name, force=False):
        if name in self.taken and not force:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))
        if DEBUG:
            print("  snap", name, flush=True)

    def act(self, e):
        k = e.get("kind") if isinstance(e, dict) else None
        key = e.get("key") if isinstance(e, dict) else None
        if DEBUG:
            print(round(time.time() % 1000, 1), k, key, flush=True)
        if k == "wait" and "scoop" in self.taken:
            t = self.page.evaluate("Cook.tasted || null")
            if t:
                time.sleep(0.5)
                self.snap("taste-right" if t == "happy" else "taste-wrong")
                if self.wrong and t != "happy":
                    self.page.evaluate("Cook.tasted = null")
                return
            if "plate" not in self.taken and not self.page.evaluate("(() => { const s = Cook.scene; return !!s && [...s.children.list].some(o => o.texture && o.texture.key === 'sv3-jharo' && o.alpha > 0.05); })()"):
                self.snap("plate")
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
            self.swipes += 1
            if self.swipes == 1:
                time.sleep(0.6)
                self.snap("fold-glow")
            if self.swipes == 4:
                time.sleep(0.3)
                self.snap("sam-2-filled")
            if self.swipes == 1:
                p = self.page
                p.mouse.move(e["sx1"], e["sy1"])
                p.mouse.down()
                for s in range(1, 6):
                    p.mouse.move(e["sx1"] + (e["sx2"] - e["sx1"]) * s / 10, e["sy1"] + (e["sy2"] - e["sy1"]) * s / 10)
                    time.sleep(0.02)
                time.sleep(0.2)
                self.snap("fold-1-mid")
                for s in range(6, 11):
                    p.mouse.move(e["sx1"] + (e["sx2"] - e["sx1"]) * s / 10, e["sy1"] + (e["sy2"] - e["sy1"]) * s / 10)
                    time.sleep(0.02)
                p.mouse.up()
                time.sleep(0.6)
                self.snap("fold-1")
                return
            r = super().act(e)
            if self.swipes in (2, 3):
                time.sleep(0.6 if self.swipes == 2 else 0.12)
                self.snap(f"fold-{self.swipes}")
            return r
        if k == "click" and e.get("selector") == "#go-btn":
            time.sleep(0.4)
            self.snap("folded")
        if k == "tap" and key == "knob":
            time.sleep(0.5)
            self.snap("fry-start")
            r = super().act(e)
            time.sleep(0.8)
            self.snap("fry-on")
            return r
        if k == "timing" and "frying-all" not in self.taken:
            time.sleep(0.2)
            self.snap("frying-all")
        if k == "timing" and "scoop" not in self.taken:
            r = super().act(e)
            time.sleep(0.3)
            self.snap("scoop")
            return r
        r = super().act(e)
        if k == "tap" and key == "samosa" and "frying-1" not in self.taken:
            time.sleep(0.9)
            self.snap("frying-1")
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
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "samosa-v3"))
    a = ap.parse_args()
    T.start_server()
    ok = True
    if a.matrix:
        out = os.path.join(T.ROOT, "build", "reports", "samosa-v3")
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
