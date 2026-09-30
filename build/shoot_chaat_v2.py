#!/usr/bin/env python3
"""Screenshots of the chaat station (v2; v3 since 30 Sept: the side-on bowl and pots, the review face) (docs/archive/process/VISUAL-QA.md; docs/design-language/ui-design-system.md §14, §14a).

Plays the station in the Station lab with build/test_cook.py's Player and saves uncropped shots:
  demo        the first-time ghost finger (card row 1 -> its bowl -> the drop)
  start       the station ready, nothing chosen yet (after the demo, when there is one)
  mid         a layer settling into the glass, its word popping
  built       every layer in, just before the tick
  taste-right the glass with the person, a happy face and Shabash!
  taste-wrong a gentle "not quite" (the player makes one deliberate mistake: SHOOT_WRONG=1)
  rebuild     the glass back, empty, after a wrong serve
  peek        level 4: the folded card opened for a peek (it costs a hint)
  end         the end-of-station pop-up

  python3 build/shoot_chaat_v2.py                         # laptop, level 1 (iterating)
  python3 build/shoot_chaat_v2.py --level 3 --wrong       # a wrong first serve, then right
  python3 build/shoot_chaat_v2.py --matrix --vp laptop    # v3: every level as the whole recipe, into build/reports/chaat-v3/
  python3 build/shoot_chaat_v2.py --matrix --vp phone-landscape
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
    def __init__(self, page, shots, speed, tag, wrong=False, peek=False, demo=False, takeback=False):
        super().__init__(page, shots, speed)
        self.mistakes = False
        self.tag = tag
        self.taken = set()
        self.wrong = wrong
        self.peek = peek
        self.served = 0
        self.demo = demo
        self.takeback = takeback
        # the Player's own "?" and light-bulb checks are test_cook's job (and cost a hint)
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

    def act(self, e):
        k = e.get("kind") if isinstance(e, dict) else None
        key = e.get("key") if isinstance(e, dict) else None
        if DEBUG:
            print(round(time.time() % 1000, 1), k, key, flush=True)
        if k == "wait" and self.demo and "demo" not in self.taken:
            g = self.page.evaluate("(() => { const g = document.querySelector('.cv2-ghost'); return g ? [getComputedStyle(g).opacity, g.style.top] : null; })()")
            if g and float(g[0]) > 0.5:
                # the finger on the card row, then on its bowl
                time.sleep(0.25)
                self.snap("demo-card")
                time.sleep(1.6)
                self.snap("demo")
        if k == "slice":
            # the chop (the whole recipe only): mid-way = after the second slice
            self.slices = getattr(self, "slices", 0) + 1
            if self.slices == 1:
                self.snap("chop-start")
            if self.slices == 2:
                r = super().act(e)
                time.sleep(0.15)
                self.snap("chop-mid")
                return r
        if k == "tap" and "start" not in self.taken:
            time.sleep(0.4)
            self.snap("start")
            if self.peek:
                # level 4: open the folded card for a peek (a hint)
                card = self.page.query_selector("#mission .oc-card .oc-headline")
                if card:
                    card.click()
                    time.sleep(0.5)
                    self.snap("peek")
                    time.sleep(3.6 / self.speed)
        if k == "tap" and self.wrong and not self.served and "wrong-tap" not in self.taken and e.get("swrongs"):
            # one deliberate wrong layer (the second one in), so the first serve is not right
            if len([t for t in self.taken if t.startswith("layer")]) >= 1:
                self.taken.add("wrong-tap")
                w = e["swrongs"][0]
                self.tap(w["x"], w["y"], "wrong")
                time.sleep(0.2)
                return
        if k == "click" and e.get("selector") == "#done-btn":
            time.sleep(0.3)
            self.snap("built" if not self.served else "rebuilt")
            r = super().act(e)
            self.served += 1
            # v3 (T5): their big round face comes up over the bowl (Cook.Kit.review sets Cook.tasted)
            for i in range(60):
                time.sleep(0.1)
                st = self.page.evaluate("Cook.tasted || null")
                if st:
                    time.sleep(0.5)
                    self.snap("taste-right" if st == "happy" else "taste-wrong")
                    self.page.evaluate("Cook.tasted = null")
                    if st != "happy":
                        # the bowl comes back empty
                        for j in range(120):
                            time.sleep(0.1)
                            if self.exp() and self.exp().get("kind") == "tap":
                                break
                        time.sleep(0.3)
                        self.snap("rebuild")
                    break
            return r
        r = super().act(e)
        if k == "tap":
            n = len([t for t in self.taken if t.startswith("layer")])
            self.taken.add(f"layer{n}")
            # each layer going in: mid-drop (the spoonful over the bowl), then settled
            time.sleep(0.12)
            self.snap(f"in{n + 1}a", force=True)
            time.sleep(0.9)
            self.snap(f"in{n + 1}", force=True)
            if self.takeback and n == 2 and "takeback" not in self.taken:
                # §17: tap the bowl, the top layer comes back out to its pot
                time.sleep(0.9)
                xy = self.page.evaluate("""(() => { const s = Cook.scene; const o = [...s.children.list].filter(o => o.texture && o.texture.key === 'cv3-bowl').pop();
                    const p = Cook.UI.worldToScreen(o.x, o.y + o.displayHeight * 0.2); return [p.x, p.y]; })()""")
                self.snap("takeback-before")
                self.page.mouse.click(xy[0], xy[1])
                time.sleep(0.25)
                self.snap("takeback")
                time.sleep(0.9)
                self.snap("takeback-after")
            if n == 1 and "mid" not in self.taken:
                time.sleep(0.55 / self.speed * 1.5)
                self.snap("mid")
        return r


def run(vp, out, level, speed, guided=True, wrong=False, demo=True, takeback=False, recipe=False):
    tag = f"{vp['name']}-l{level}" + ("-wrong" if wrong else "") + ("-recipe" if recipe else "")
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        P = Shooter(page, out, speed, tag, wrong=wrong, peek=level >= 4, demo=demo, takeback=takeback)
        if not demo:
            page.evaluate("() => { Cook.save.coached = Object.assign(Cook.save.coached || {}, {'assemble-v2': true}); }")
        # recipe: the whole chaat (its chop, then the bowl), as a day plays it
        key = "recipe:chaat" if recipe else "assemble"
        page.evaluate(f"() => {{ __cook.lab('{key}', {'true' if guided else 'false'}, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
        if vp["height"] > vp["width"]:
            # Cook is landscape only: a phone held upright shows "turn your phone sideways"
            time.sleep(2.5)
            P.snap("portrait")
            browser.close()
            print(tag, "portrait: the rotate prompt", flush=True)
            return True
        P.play(lambda: page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"), timeout=300)
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
    ap.add_argument("--nodemo", action="store_true")
    ap.add_argument("--takeback", action="store_true")
    ap.add_argument("--recipe", action="store_true")
    ap.add_argument("--levels", default="1,2,3,4")
    ap.add_argument("--speed", type=float, default=1.5)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "screenshots", "chaat-v3"))
    a = ap.parse_args()
    T.start_server()
    ok = True
    if a.matrix:
        # v3: every level, each played as the whole recipe (the chop, then the bowl), its first serve wrong on
        # purpose (the frown and the rebuild), then right; level 1 with the first-time demo, level 2 with a
        # take-back (§17). One viewport per call (--vp), so each call stays inside a 10-minute run.
        out = os.path.join(T.ROOT, "build", "reports", "chaat-v3")
        os.makedirs(out, exist_ok=True)
        vp = VPS[a.vp]
        levels = [int(x) for x in a.levels.split(",")]
        for f in os.listdir(out):
            if any(f.startswith(f"{vp['name']}-l{lv}-") for lv in levels) and f.endswith((".png", ".jpg")):
                os.remove(os.path.join(out, f))
        for lv in levels:
            ok &= run(vp, out, lv, a.speed, wrong=True, demo=lv == 1, takeback=lv == 2, recipe=True)
        # kept as JPEG (a matrix of PNGs is ~15 MB)
        from PIL import Image
        for f in sorted(os.listdir(out)):
            if f.endswith(".png"):
                Image.open(os.path.join(out, f)).convert("RGB").save(os.path.join(out, f[:-4] + ".jpg"), quality=85)
                os.remove(os.path.join(out, f))
    else:
        os.makedirs(a.out, exist_ok=True)
        ok = run(VPS[a.vp], a.out, a.level, a.speed, wrong=a.wrong, demo=not a.nodemo, takeback=a.takeback, recipe=a.recipe)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
