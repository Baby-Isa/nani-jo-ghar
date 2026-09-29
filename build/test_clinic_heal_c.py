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
    if not a.no_extras:
        import subprocess

        for g in ["tummy", "hic", "hair"]:
            r = subprocess.run([sys.executable, os.path.join(ROOT, "build", "test_clinic_heal_c_extras.py"), "--only", g], capture_output=True, text=True)
            tail = (r.stdout.strip().splitlines() or ["(no output)"])[-1]
            print(f"{'ok  ' if r.returncode == 0 else 'FAIL'} C extras {g}: {tail}", flush=True)
            fails += 0 if r.returncode == 0 else 1
    print("PASS" if not fails else f"FAIL: {fails}")
    sys.exit(1 if fails else 0)
