#!/usr/bin/env python3
"""Screenshots of the Chai tray (docs/archive/process/VISUAL-QA.md §5; v2, then the 30 Sept v3 pan states, C8).

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots of every
state that draws something different. The first run goes wrong on purpose (the salt in the last pan,
and one milky pan left on the high flame till it foams), so the wrong serve shows; a second, clean run
(`-right-*`) shoots the right serve.
  start       everyone has spoken, nothing done yet
  water       the first pan with water in it
  leaves      the chai leaves in (water with leaves)
  tea         a pan with no milk near the boil (black tea)
  mid-cook    the milk carton pouring into a pan
  milky       milky chai in the pan
  spiced      milky chai with the extra in (aadu or elchi)
  boiling     a pan on the high flame at the boil, the heat gauge in the green
  foam        a milky pan left too long: foaming up to the rim (first try only)
  pan-pour    a ready pan tipped over its person's glass (its burner unlit)
  serving     every glass poured, just before the tick
  taste-wrong / taste-right   the review faces over the glasses (the right serve: a clean second run, `-right-*`)
  end         the lab's end pop-up

  python3 build/shoot_chai_v2.py                       # laptop, level 2 (iterating)
  python3 build/shoot_chai_v2.py --all --level 3       # laptop + phone landscape
  python3 build/shoot_chai_v2.py --cups 4              # 4 people (the data stops at 3 people: Isa joins)
  python3 build/shoot_chai_v2.py --matrix              # laptop + phone landscape, levels 1-4 and 4 people,
                                                       # into build/reports/chai-v3/
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
    def __init__(self, page, shots, speed, tag, mistakes=True, only=None):
        super().__init__(page, shots, speed, mistakes=mistakes)
        self.tag = tag
        self.only = only
        self.taken = set()
        self.helped = bool(os.environ.get("SHOOT_NOHELP"))
        self.first = True

    def shot(self, name):
        return None

    def snap(self, name):
        if name in self.taken or (self.only and name not in self.only):
            return
        self.taken.add(name)
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{name}.png"))
        if DEBUG:
            print("  snap", self.tag, name, flush=True)

    def pans(self):
        return self.page.evaluate("Cook.chaiPans ? Cook.chaiPans() : []")

    def exp(self):
        e = super().exp()
        st = self.page.evaluate("[Cook.tasted || null, Cook.chaiServe || null]")
        if st[0] and st[1]:
            time.sleep(0.6)
            self.snap(f"taste-{st[1]}")
            self.page.evaluate("Cook.tasted = null; Cook.chaiServe = null")
            self.first = False  # the lab doesn't play it again: the right serve is a second, clean run
        return e

    def heat(self, e):
        """The knob's timing: shots of black tea near the boil, the boil, and (first try) a milky pan foaming."""
        t0 = time.time()
        while time.time() - t0 < 40:
            hot = [q for q in self.pans() if q["state"] == "heating"]
            if not hot:
                return
            q = max(hot, key=lambda q: q["heat"])
            lo, hi = q["lo"], q["hi"]
            if not q["milk"] and q["leaves"]:
                self.snap("tea")
            if q["heat"] >= lo + 0.03:
                self.snap("boiling")
            if self.first and self.mistakes and q["milk"] and "foam" not in self.taken:
                if q["heat"] >= hi + (1 - hi) * 0.55:
                    self.snap("foam")
                    break
            elif q["heat"] >= (lo + hi) / 2:
                break
            cur = super().exp()
            if cur and cur.get("kind") != "timing":
                return
            time.sleep(0.03)
        self.tap(e["sx"], e["sy"], "timing")

    def act(self, e):
        key = e.get("key") if isinstance(e, dict) else None
        k = e.get("kind") if isinstance(e, dict) else None
        if k == "click" and e.get("selector") == "#done-btn":
            time.sleep(0.5)
            self.snap("serving")
        if "start" not in self.taken and k not in ("wait", None) and not e.get("intro"):
            time.sleep(0.3)
            self.snap("start")
        if DEBUG:
            print(round(time.time() % 1000, 1), k, key, flush=True)
        if k == "timing":
            return self.heat(e)
        r = super().act(e)
        if key == "cook-paani":
            time.sleep(2.2 / self.speed)
            self.snap("water")
        elif key == "cook-chai":
            time.sleep(2.0 / self.speed)
            self.snap("leaves")
        elif key == "cook-dudh":
            time.sleep(0.45)
            self.snap("mid-cook")
            time.sleep(1.6 / self.speed)
            self.snap("milky")
        elif key in ("spi-10", "veg-14") and any(q["milk"] and q["extras"] for q in self.pans()):
            time.sleep(2.0 / self.speed)
            self.snap("spiced")
        elif key and key.startswith("pour-"):
            time.sleep(0.75 / self.speed * 3)
            self.snap("pan-pour")
        return r


def run(vp, out, level, speed, guided=False, cups=None, right=False):
    """right: a clean second run (no salt, no foam) for the right serve and its end pop-up."""
    tag = f"{vp['name']}-l{level}" + (f"-{cups}cups" if cups else "") + ("-right" if right else "")
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, tag, mistakes=not right, only={"taste-right", "end", "serving"} if right else None)
        if cups:  # this page only: every level orders `cups` cups
            # (the family list is Nana, Ma and Ali: a fourth cup needs a fourth person, so Isa joins)
            page.evaluate(f"() => {{ const r = Cook.data.recipes.chai; r.slots.cups.count = {{ byLevel: [{cups}, {cups}, {cups}, {cups}] }}; if (!r.lists.family.includes('isa')) r.lists.family.push('isa'); }}")
        page.evaluate("() => { Cook.tasteHold = 900; }")
        page.evaluate(f"() => {{ __cook.lab('chai-tray', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        P.play(lambda: page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), timeout=1500)
        time.sleep(1.0)
        P.snap("end")
        res = page.evaluate("Cook.labResult ? [Cook.labResult.why, Cook.labResult.skills.join(' · '), Cook.labResult.help] : null")
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    print(tag, res, ("console errors: " + str(bad[:5])) if bad else "no console errors", flush=True)
    return not bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--matrix", action="store_true")
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--level", type=int, default=2)
    ap.add_argument("--guided", action="store_true")
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--cups", type=int, default=None)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "chai-v2"))
    a = ap.parse_args()
    T.start_server()
    ok = True
    if a.matrix:
        out = os.path.join(T.ROOT, "build", "reports", "chai-v3")
        os.makedirs(out, exist_ok=True)
        for name in a.vp.split(","):
            for level, cups in ((1, None), (2, None), (3, None), (4, None), (4, 4)):
                ok &= run(VPS[name], out, level, a.speed, cups=cups)
                ok &= run(VPS[name], out, level, a.speed, cups=cups, right=True)
    else:
        os.makedirs(a.out, exist_ok=True)
        for name in (["laptop", "phone-landscape"] if a.all else a.vp.split(",")):
            ok &= run(VPS[name], a.out, a.level, a.speed, a.guided, a.cups)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
