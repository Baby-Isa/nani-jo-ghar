#!/usr/bin/env python3
"""Browser test for the clinic v2 heal games in lab B: the soothing drinks
(taste), fever and boing, on the REAL host (lab/clinic-heal-host.html).

Each game is played through real mouse events by the shared driver
(build/heal_play.py), which asks the game's controller.debug.next() what a
child who understood the words would do next. A fair play must get every row
right, tick every card row and show a first-time cue (words) for every step;
a slip play makes one mistake and must lose exactly one row. Screenshots go to
build/screenshots/clinic-heal-b/<size>/.

Usage:
  python3 build/test_clinic_heal_b.py
  python3 build/test_clinic_heal_b.py --only fever --levels 1 --sizes laptop
Port: COOK_TEST_PORT (default 8822).
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from heal_play import ROOT, run_suite  # noqa: E402

GAMES = ["taste", "fever", "boing"]
KINDS = {"taste": "nana", "fever": "nana", "boing": "girl"}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default=",".join(GAMES))
    ap.add_argument("--levels", default="1,2,3")
    ap.add_argument("--sizes", default="phone,ipad,laptop")
    ap.add_argument("--seeds", type=int, default=2)
    ap.add_argument("--no-slip", action="store_true")
    a = ap.parse_args()
    fails = run_suite(a.only.split(","), [int(x) for x in a.levels.split(",")], a.sizes.split(","), a.seeds,
                      int(os.environ.get("COOK_TEST_PORT", 8822)), os.path.join(ROOT, "build", "screenshots", "clinic-heal-b"), KINDS, "B", slip=not a.no_slip)
    print("PASS" if not fails else f"FAIL: {fails}")
    sys.exit(1 if fails else 0)
