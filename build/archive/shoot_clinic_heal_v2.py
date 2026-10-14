#!/usr/bin/env python3
"""Laptop shots of the clinic v2 heal games (design sheets part B) for review.

States shot per game at levels 1 and 3 (VISUAL-QA s5: every state that draws
something different): the opening (the why beat's line), each step as it
opens (its first-time cue showing), the middle of each step (after its first
action), and the end. The lab bar is folded away and the debug log hidden so
the play area is what's judged.

Usage: python3 build/shoot_clinic_heal_v2.py [--games knee,ear] [--levels 1,3] [--size 1366x768]
Out:   build/reports/clinic-v2-b/<game>-L<level>-<nn>-<state>.png
Port:  8830.
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from heal_play import ROOT, Play, launch, start_server  # noqa: E402

GAMES = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"]
KINDS = {"cut": "girl", "knee": "ali", "ear": "boy", "tooth": "girl", "taste": "nana", "fever": "nana", "boing": "girl", "eye": "nana", "foot": "boy"}
OUT = os.path.join(ROOT, "build", "reports", "clinic-v2-b")


def shoot(page, game, level, seed):
    page.evaluate(
        """([g, L, seed, kind]) => {
          const out = document.getElementById("lab-out");
          if (out) out.style.display = "none";
          const bar = document.getElementById("lab");
          if (bar) bar.style.display = "none";
          try { localStorage.clear(); } catch (e) {}
          document.getElementById("lab-game").value = g;
          document.getElementById("lab-level").value = String(L);
          document.getElementById("lab-seed").value = String(seed);
          document.getElementById("lab-kind").value = kind;
          __heal.mount();
        }""",
        [game, level, seed, KINDS[game]],
    )
    page.wait_for_function("__heal.run && __heal.run.controller && __heal.run.controller.debug", timeout=15000)
    n = [0]

    def snap(label):
        n[0] += 1
        page.screenshot(path=os.path.join(OUT, f"{game}-L{level}-{n[0]:02d}-{label}.png"))

    page.wait_for_timeout(250)
    snap("why")
    p = Play(page, game, level, "laptop", seed, None, KINDS[game])
    last_row = None
    acted_in_step = 0
    t0 = time.time()
    while not page.evaluate("!!__heal.result"):
        if time.time() - t0 > 90:
            raise RuntimeError(f"{game} L{level}: timed out")
        a = page.evaluate("__heal.run.controller.debug.next()")
        row = page.evaluate("(() => { const r = document.querySelector('.cl-row.now'); return r ? r.dataset.row : null; })()")
        if a["do"] != "wait" and row != last_row:
            last_row = row
            acted_in_step = 0
            page.wait_for_timeout(120)
            snap(f"open-{row or 'step'}")
        p.act(a)
        if a["do"] != "wait":
            acted_in_step += 1
            if acted_in_step == 2:
                page.wait_for_timeout(200)
                snap(f"mid-{row or 'step'}")
    page.wait_for_timeout(250)
    snap("end")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--games", default=",".join(GAMES))
    ap.add_argument("--levels", default="1,3")
    ap.add_argument("--size", default="1366x768")
    a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True)
    w, h = (int(x) for x in a.size.split("x"))
    httpd = start_server(8830)
    from playwright.sync_api import sync_playwright

    with sync_playwright() as pw:
        br = launch(pw)
        page = br.new_page(viewport={"width": w, "height": h})
        page.goto("http://127.0.0.1:8830/lab/clinic-heal-host.html?quiet=1&fast=1")
        page.wait_for_function("window.__heal && Clinic.Heal.has('foot')", timeout=15000)
        for g in a.games.split(","):
            for L in [int(x) for x in a.levels.split(",")]:
                for f in os.listdir(OUT):
                    if f.startswith(f"{g}-L{L}-"):
                        os.remove(os.path.join(OUT, f))
                shoot(page, g, L, 21 + L)
                print(f"shot {g} L{L}", flush=True)
        br.close()
    if httpd:
        httpd.shutdown()


if __name__ == "__main__":
    main()
