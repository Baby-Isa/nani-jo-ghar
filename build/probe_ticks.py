#!/usr/bin/env python3
"""Sidebar v3 tick probe (docs/cook-ui-feedback-2026-09-28.md 10): play each station in the lab,
move by move, and check the sidebar's pills tick mid-round (UX 11), not only at the end.

  python3 build/probe_ticks.py                      # every station, level 2, laptop
  python3 build/probe_ticks.py --only chai-tray,fetch --level 1

For each station it prints the pills done after every move and pictures the first
mid-round moment with a ticked pill: build/reports/sidebar-v3/ticks-{station}.jpg
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shoot_sidebar_v3 as V  # noqa: E402
import test_cook as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

STATIONS = ["fetch", "chai-tray", "samosa", "fry", "mishkaki-grill", "grill", "thread", "chop", "assemble", "maani-line", "tadka", "stir", "boil", "pour", "count", "passme", "fill", "roll", "flip", "knead", "roll-tawa"]
PILLS = """() => { const m = document.querySelector('#mission:not(.hidden)'); if (!m) return null;
  const all = [...m.querySelectorAll('.r6:not(.head)')]; return [all.filter(e => e.classList.contains('done')).length, all.length]; }"""


def probe(pw, key, level, seed=4):
    browser, page, errors = V.open_page(pw, V.VIEWPORTS["laptop"], seed)
    P = T.Player(page, V.OUT, 3, mistakes=False)
    trace, shot = [], None
    try:
        V.lab(page, key, level)
        t0 = time.time()
        while time.time() - t0 < 240:
            e = P.exp()
            if page.evaluate("!!document.querySelector('#lab-list') && !document.querySelector('#overlay').classList.contains('hidden')"):
                break
            if not e or e["kind"] == "wait":
                time.sleep(0.1)
                continue
            if e.get("intro"):
                page.click("#intro .ic-card", force=True)
                P.wait_change(e, 10)
                continue
            if e["kind"] == "click" and "done-btn" in e.get("selector", ""):
                if not shot:  # the card just before Done: what has ticked by now
                    c = page.evaluate(PILLS)
                    if c and c[0]:
                        shot = V.shoot(page, f"ticks-{key}", "laptop")
                trace.append("DONE")
            P.act(e)
            P.wait_change(e, 20)
            time.sleep(0.25)
            c = page.evaluate(PILLS)
            if c and (not trace or trace[-1] != c):
                trace.append(c)
            # the picture: a card about half ticked (a few done, some still to do)
            if c and not shot and 0 < c[0] < c[1] and c[0] >= max(1, c[1] // 2):
                time.sleep(0.5)
                shot = V.shoot(page, f"ticks-{key}", "laptop")
    finally:
        browser.close()
    return trace, shot, errors


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="")
    ap.add_argument("--level", type=int, default=2)
    args = ap.parse_args()
    T.start_server()
    with sync_playwright() as pw:
        for key in [s for s in args.only.split(",") if s] or STATIONS:
            trace, shot, errors = probe(pw, key, args.level)
            mid = any(isinstance(c, list) and 0 < c[0] < c[1] for c in trace)
            last = len(trace) - 1 - trace[::-1].index("DONE") if "DONE" in trace else len(trace)
            before = any(isinstance(c, list) and c[0] > 0 for c in trace[:last])
            verdict = "TICKS MID-ROUND" if mid else "TICKS BEFORE DONE" if before else "NO TICK BEFORE DONE"
            print(f"{key:15} {verdict:20} {trace[:16]}" + (f"  errors: {errors[:2]}" if errors else ""))


if __name__ == "__main__":
    main()
