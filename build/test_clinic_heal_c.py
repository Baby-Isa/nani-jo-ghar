#!/usr/bin/env python3
"""Browser test for the clinic v2 heal games in lab C: eye and foot, on the
REAL host (lab/clinic-heal-host.html).

Each game is played through real mouse events by the shared driver
(build/heal_play.py), which asks the game's controller.debug.next() what a
child who understood the words would do next. A fair play must get every row
right, tick every card row and show a first-time cue (words) for every step;
a slip play makes one mistake and must lose exactly one row. Then it runs
build/test_clinic_heal_c_extras.py for the unchanged tummy, hic and hair
(--no-extras skips that). Screenshots go to
build/screenshots/clinic-heal-c/<size>/.

Usage:
  python3 build/test_clinic_heal_c.py
  python3 build/test_clinic_heal_c.py --only eye --levels 1 --sizes laptop
Port: COOK_TEST_PORT (default 8823).
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from heal_play import ROOT, run_suite  # noqa: E402

GAMES = ["eye", "foot"]
KINDS = {"eye": "nana", "foot": "boy"}

def edge_check(port):
    """The foot's buzz-wire rule: a pull that leaves the path makes the patient wince (logged) and the
    splinter slide back; then a clean pull still takes it out and the game ends all right."""
    from heal_play import Play, launch, start_server
    from playwright.sync_api import sync_playwright

    httpd = start_server(port)
    ok = False
    msg = ""
    with sync_playwright() as pw:
        br = launch(pw)
        page = br.new_page(viewport={"width": 1366, "height": 768})
        page.goto(f"http://127.0.0.1:{port}/lab/clinic-heal-host.html?quiet=1&fast=1&game=foot&level=1&seed=5")
        page.wait_for_function("__heal.run && __heal.run.controller && __heal.run.controller.debug", timeout=15000)
        p = Play(page, "foot", 1, "laptop", 5, None)
        try:
            for _ in range(60):
                a = page.evaluate("__heal.run.controller.debug.next()")
                if a["do"] == "drag" and a.get("what", "").startswith("pull"):
                    break
                p.act(a)
            pts = a["pts"]
            (x0, y0), (x1, y1) = pts[0], pts[min(4, len(pts) - 1)]
            # half way along, then straight off the path (perpendicular), 80 px
            dx, dy = x1 - x0, y1 - y0
            n = max(1.0, (dx * dx + dy * dy) ** 0.5)
            off = (x1 - dy / n * 80, y1 + dx / n * 80)
            p.act({"do": "drag", "pts": [[x0, y0], [x1, y1], [off[0], off[1]]], "steps": 6})
            winced = page.evaluate("__heal.log.some((e) => e.detail === 'touched the side')")
            mood = page.evaluate("document.querySelector('.hs-face').dataset.mood")
            t0 = __import__("time").time()
            while not page.evaluate("!!__heal.result") and __import__("time").time() - t0 < 60:
                p.act(page.evaluate("__heal.run.controller.debug.next()"))
            r = page.evaluate("__heal.result && [__heal.result.right, __heal.result.total]")
            ok = winced and mood == "wince" and r and r[0] == r[1]
            msg = f"winced {winced} (face {mood}), then pulled clean: {r}"
        except Exception as e:  # noqa: BLE001
            msg = f"{type(e).__name__}: {e}"
        br.close()
    if httpd:
        httpd.shutdown()
    print(f"{'ok  ' if ok else 'FAIL'} C foot edge: {msg}", flush=True)
    return 0 if ok else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default=",".join(GAMES))
    ap.add_argument("--levels", default="1,2,3")
    ap.add_argument("--sizes", default="phone,ipad,laptop")
    ap.add_argument("--seeds", type=int, default=2)
    ap.add_argument("--no-slip", action="store_true")
    ap.add_argument("--no-extras", action="store_true", help="don't also run tummy, hic, hair (test_clinic_heal_c_extras.py)")
    a = ap.parse_args()
    fails = run_suite(a.only.split(","), [int(x) for x in a.levels.split(",")], a.sizes.split(","), a.seeds,
                      int(os.environ.get("COOK_TEST_PORT", 8823)), os.path.join(ROOT, "build", "screenshots", "clinic-heal-c"), KINDS, "C", slip=not a.no_slip)
    fails += edge_check(int(os.environ.get("COOK_TEST_PORT", 8823)) + 40)
    if not a.no_extras:
        import subprocess

        for g in ["tummy", "hic", "hair"]:
            r = subprocess.run([sys.executable, os.path.join(ROOT, "build", "test_clinic_heal_c_extras.py"), "--only", g], capture_output=True, text=True)
            tail = (r.stdout.strip().splitlines() or ["(no output)"])[-1]
            print(f"{'ok  ' if r.returncode == 0 else 'FAIL'} C extras {g}: {tail}", flush=True)
            fails += 0 if r.returncode == 0 else 1
    print("PASS" if not fails else f"FAIL: {fails}")
    sys.exit(1 if fails else 0)
