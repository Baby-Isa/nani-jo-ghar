#!/usr/bin/env python3
"""Screenshots of the daar station v2 (docs/VISUAL-QA.md; docs/design/cook-design-system-v1.md §15).

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots:
  chop-start, on-board, chop-mid, chopped   the chop (Nani's card, the crates, the board, the knife, the katori)
  cook-start, tadka-mid, tadka-done         the kit hob, one pot, the spices in order, the vegetables
  stir-start, stir-mid, serve               the stir (the count as the Kutchi word), the bowl
  taste-right / taste-wrong, end            serve and taste (--wrong: one vegetable too many), the end pop-up
  python3 build/shoot_daar_v2.py                 # laptop, level 1 (iterating)
  python3 build/shoot_daar_v2.py --matrix        # phone + laptop, levels, into build/reports/daar-v2/
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
        self.crates = 0
        self.last_crate = None
        self.helped = True

    def shot(self, name):
        if name == "stir-mid":
            self.snap("stir-mid")
        return None

    def snap(self, name, force=False):
        if name in self.taken and not force:
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))
        if DEBUG:
            print("  snap", name, flush=True)

    def taste(self):
        for _ in range(160):
            time.sleep(0.1)
            st = self.page.evaluate("(() => { const s = Cook.scene; return s ? [...s.children.list].filter(o => o.texture && /dv2-.*-(happy|impatient)$/.test(o.texture.key)).map(o => o.texture.key) : []; })()")
            if st:
                time.sleep(0.6)
                self.snap("taste-right" if st[0].endswith("happy") else "taste-wrong")
                return

    def act(self, e):
        k = e.get("kind") if isinstance(e, dict) else None
        key = e.get("key") if isinstance(e, dict) else None
        if DEBUG:
            print(round(time.time() % 1000, 1), k, key, flush=True)
        if k == "tap" and key and key.startswith("veg-") and "chop-start" not in self.taken:
            time.sleep(0.5)
            self.snap("chop-start")
        if k == "tap" and key == "knife" and "on-board" not in self.taken:
            time.sleep(0.3)
            self.snap("on-board")
        if k == "click" and e.get("selector") == "#done-btn" and "chopped" not in self.taken:
            if self.wrong and self.last_crate and "wrong-tap" not in self.taken:
                # one too many: an extra vegetable, chopped
                self.taken.add("wrong-tap")
                self.tap(self.last_crate[0], self.last_crate[1], "one too many")
                for _ in range(150):
                    time.sleep(0.1)
                    cur = self.exp()
                    if cur and cur.get("key") == "knife":
                        self.tap(cur["sx"], cur["sy"], "knife")
                        break
                for _ in range(200):
                    time.sleep(0.1)
                    cur = self.exp()
                    if cur and cur.get("selector") == "#done-btn":
                        break
                time.sleep(0.4)
            time.sleep(0.3)
            self.snap("chopped")
        if k == "tap" and key == "knob":
            time.sleep(0.4)
            self.snap("cook-start")
        if k == "tap" and key == "katori":
            time.sleep(0.2)
            self.snap("tadka-done")
        if k == "stir" and "stir-start" not in self.taken:
            time.sleep(0.8)
            self.snap("stir-start")
        r = super().act(e)
        if k == "tap" and key == "knife" and "chop-mid" not in self.taken:
            time.sleep(0.35)
            self.snap("chop-mid")
        if k == "tap" and key and (key.startswith("veg-") or key.startswith("spi-")):
            if key.startswith("veg-"):
                self.last_crate = (e["sx"], e["sy"])
            if key.startswith("spi-") and "tadka-mid" not in self.taken:
                time.sleep(0.25)
                self.snap("tadka-mid")
        if k == "click" and e.get("selector") == "#done-btn" and "chopped" in self.taken and "stir-start" in self.taken:
            self.snap("serve")
            self.taste()
            self.served += 1
            if self.wrong:
                for n in ("chop-start", "on-board", "chop-mid", "chopped", "cook-start", "tadka-mid", "tadka-done", "stir-start", "stir-mid", "serve"):
                    self.taken.discard(n)
                self.tag = self.tag + "-again"
                self.wrong = False
        return r


def run(vp, out, level, speed, guided=True, wrong=False, nono=False):
    tag = f"{vp['name']}-l{level}" + ("-wrong" if wrong else "") + ("-no" if nono else "")
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, tag, wrong=wrong)
        if nono:  # a round where they say no onions (the "don't" row: dungri na)
            page.evaluate("() => Cook.data.recipes.daal.slots.onions.byLevel.forEach((b) => (b.zero = 1))")
        page.evaluate(f"() => {{ __cook.lab('daar', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
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
    ap.add_argument("--no", action="store_true", help="a round with a don't row (dungri na)")
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "daar-v2"))
    a = ap.parse_args()
    T.start_server()
    ok = True
    if a.matrix:
        out = os.path.join(T.ROOT, "build", "reports", "daar-v2")
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
        ok &= run(VPS["laptop"], out, 2, a.speed, nono=True)
    else:
        os.makedirs(a.out, exist_ok=True)
        ok &= run(VPS[a.vp], a.out, a.level, a.speed, wrong=a.wrong, nono=a.no)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
