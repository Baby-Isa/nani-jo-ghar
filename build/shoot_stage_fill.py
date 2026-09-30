#!/usr/bin/env python3
"""Stage-fill screenshots (docs/archive/process/VISUAL-QA.md): every v2 Cook station, start + mid-cook, at any viewport.

Checks the stage has no dead cream strip: the worktop reaches the stage's top edge, the shelf band the
bottom edge, and nothing is letterboxed at the sides (build/reports/stage-fill.md).

  python3 build/shoot_stage_fill.py                                  # laptop, all seven stations
  python3 build/shoot_stage_fill.py --vp phone-landscape --only daar
  python3 build/shoot_stage_fill.py --vp laptop,phone-landscape,wide,tall --out build/reports/stage-fill/after
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_cook as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

VPS = {v["name"]: v for v in T.VIEWPORTS}
VPS["phone-landscape"] = {"name": "phone-landscape", "width": 844, "height": 390, "touch": True}
VPS["wide"] = {"name": "wide", "width": 1920, "height": 1080, "touch": False}
VPS["tall"] = {"name": "tall", "width": 1024, "height": 768, "touch": False}

# station name -> (lab key, level, actions before the mid-cook shot)
STATIONS = {
    "chai": ("chai-tray", 2, 7),
    "maani": ("maani-line", 2, 6),
    "sekelo": ("mishkaki-grill", 2, 5),
    "chaat": ("assemble", 2, 3),
    "samosa": ("samosa", 2, 5),
    "daar": ("daar", 2, 4),
    "pantry": ("fetch", 2, 2),
}


class Shooter(T.Player):
    def __init__(self, page, shots, speed):
        super().__init__(page, shots, speed)
        self.helped = True
        self.acts = 0

    def shot(self, name):
        return None

    def act(self, e):
        if isinstance(e, dict) and e.get("kind") not in (None, "wait"):
            self.acts += 1
        return super().act(e)


def run(vp, out, names, speed):
    with sync_playwright() as pw:
        for name in names:
            key, level, n = STATIONS[name]
            browser, page, errors = T.open_page(pw, vp, speed, False)
            P = Shooter(page, out, speed)
            page.evaluate(f"() => {{ __cook.lab('{key}', false, {{level: {level}}}); }}")
            page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=15000)
            time.sleep(3.5)
            tag = f"{vp['name']}-{name}"
            page.screenshot(path=os.path.join(out, f"{tag}-1-start.png"))
            t0 = time.time()
            try:
                P.play(lambda: P.acts >= n or time.time() - t0 > 90, timeout=120)
            except Exception as ex:  # noqa: BLE001
                print(name, "play stopped:", str(ex)[:120])
            time.sleep(1.2)
            page.screenshot(path=os.path.join(out, f"{tag}-2-mid.png"))
            bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
            if bad:
                print(tag, "console errors:", bad[:3])
            browser.close()
            print("shot", tag, flush=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vp", default="laptop")
    ap.add_argument("--only", default="")
    ap.add_argument("--speed", type=float, default=2)
    ap.add_argument("--out", default=os.path.join(T.ROOT, "build", "reports", "stage-fill", "after"))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    T.start_server()
    names = [s for s in a.only.split(",") if s] or list(STATIONS)
    for v in a.vp.split(","):
        run(VPS[v], a.out, names, a.speed)


if __name__ == "__main__":
    main()
