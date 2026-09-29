#!/usr/bin/env python3
"""Screenshots of the 29 Sept review face and first-time coaches (build/reports/cook-shared-fixes.md;
docs/VISUAL-QA.md 5).

  python3 build/shoot_review.py --station daar --mood happy          # the review face, right
  python3 build/shoot_review.py --station daar --mood frown          # ... and wrong (the look only)
  python3 build/shoot_review.py --station samosa --coach             # the coach at each phase (guided)

States: the review face (happy / frown) in chai-tray, maani-line, daar, assemble (chaat), samosa and
mishkaki-grill (sekelo); the coach's spotlight at samosa's fill, fold and fry and daar's tadka and stir.
--mood sets Cook.forceReview (the face's look; the station's verdict still runs), or for sekelo
Cook.forceTaste (its real path). Each shot is taken while the face holds (Cook.tasteHold).
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
OUT = os.path.join(T.ROOT, "build", "reports", "cook-shared-fixes")
# the coach phases to catch: (name, JS condition on Cook.expect / the page)
COACH = {
    "samosa": [("fill", "k === 'samosa' && e.kind === 'tap'"), ("fold", "k === 'samosa' && e.kind === 'swipe'"), ("fry", "k === 'fry' && (e.kind === 'tap' || e.kind === 'timing')")],
    "daar": [("tadka", "k === 'daar-cook' && e.kind === 'tap'"), ("stir", "k === 'daar-cook' && e.kind === 'stir'")],
}


class Shooter(T.Player):
    def __init__(self, page, tag, speed):
        super().__init__(page, OUT, speed, mistakes=False)
        self.tag = tag
        self.helped = True

    def shot(self, name):
        return None

    def snap(self, name):
        p = os.path.join(OUT, f"{self.tag}-{name}.png")
        self.page.screenshot(path=p)
        print("shot", os.path.relpath(p, T.ROOT))


def run(vp, station, mood, coach, level, speed):
    with sync_playwright() as pw:
        browser, page, errors = T.open_page(pw, vp, speed, False)
        tag = f"{station}-{'coach' if coach else mood}-{vp['name']}" + (f"-l{level}" if level > 1 else "")
        P = Shooter(page, tag, speed)
        if not coach:
            if station == "mishkaki-grill":
                page.evaluate(f"Cook.forceTaste = {'true' if mood == 'happy' else 'false'}")
            else:
                page.evaluate(f"Cook.forceReview = {'true' if mood == 'happy' else 'false'}")
            page.evaluate("Cook.tasteHold = 2600")
        page.evaluate(f"() => {{ __cook.lab('{station}', {'true' if coach else 'false'}, {json.dumps({'level': level})}); }}")
        page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=20000)
        want = list(COACH.get(station, [])) if coach else None
        done = {"shot": False}

        def until():
            if coach:
                if not want:
                    return True
                name, cond = want[0]
                ok = page.evaluate(f"(() => {{ const e = Cook.expect || {{}}; const k = Cook.Coach.key(); return !!document.querySelector('.njg-onboard') && ({cond}); }})()")
                if ok:
                    time.sleep(0.6 if name == "fry" else 1.4)
                    P.snap(name)
                    want.pop(0)
                return False
            if not done["shot"] and page.evaluate("!!Cook.tasted"):
                time.sleep(0.9)
                P.snap("review")
                done["shot"] = True
            return done["shot"]

        try:
            P.play(until, timeout=T.LONG.get(station, 400))
        except Exception as e:
            print("play stopped:", str(e)[:160])
        if coach and want:
            print("coach states not caught:", [w[0] for w in want])
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        print("console errors:", bad[:5])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--station", default="daar")
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--mood", default="happy")
    ap.add_argument("--coach", action="store_true")
    ap.add_argument("--level", type=int, default=1)
    ap.add_argument("--speed", type=float, default=3)
    ap.add_argument("--out", default=OUT)
    a = ap.parse_args()
    globals()["OUT"] = a.out
    os.makedirs(OUT, exist_ok=True)
    T.CANVAS = True
    T.start_server()
    run(VPS[a.vp], a.station, a.mood, a.coach, a.level, a.speed)


if __name__ == "__main__":
    main()
