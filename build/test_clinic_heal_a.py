#!/usr/bin/env python3
"""Browser test for heal-game agent A's games (knee, ear, tooth) on the REAL
host (lab/clinic-heal-host.html, js/clinic/heal/host.js).

Each game is played fairly (it reads the plan, as a child who understood the
Kutchi would) through real pointer events: the host's sidebar dishes, taps and
drags on our stage, the host's Done button. It checks that every row comes
out right (right == total), that ctx.done fires, that the card ticks every
row, that the KIT-A block is identical in the three files, and that there
are no console errors. Screenshots at the start, mid-game and the end go to
build/screenshots/clinic-heal-a/.

Usage:
  python3 build/test_clinic_heal_a.py                   # every game x level 1-3, phone + iPad + laptop
  python3 build/test_clinic_heal_a.py --only ear --levels 1 --sizes laptop
Port: COOK_TEST_PORT (default 8821).
"""
import argparse
import hashlib
import http.server
import math
import os
import re
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("COOK_TEST_PORT", 8821))
SIZES = {
    "phone": {"width": 915, "height": 412, "touch": True},
    "ipad": {"width": 1024, "height": 768, "touch": True},
    "laptop": {"width": 1366, "height": 768, "touch": False},
}
KINDS = {"knee": "ali", "ear": "boy", "tooth": "girl"}
SHOTS = os.path.join(ROOT, "build", "screenshots", "clinic-heal-a")


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def start_server():
    os.chdir(ROOT)

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    try:
        httpd = Server(("127.0.0.1", PORT), Quiet)
    except OSError:
        return None
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def kit_block_same():
    got = set()
    for g in ("knee", "ear", "tooth"):
        s = open(os.path.join(ROOT, "js/clinic/heal/games", g + ".js")).read()
        m = re.search(r"KIT-A:BEGIN.*?KIT-A:END", s, re.S)
        got.add(hashlib.md5(m.group(0).encode()).hexdigest() if m else None)
    return len(got) == 1 and None not in got


class Play:
    def __init__(self, page, game, level, size, seed):
        self.page, self.game, self.level, self.size, self.seed = page, game, level, size, seed
        self.n = 0

    def shot(self, name):
        self.n += 1
        d = os.path.join(SHOTS, self.size)
        os.makedirs(d, exist_ok=True)
        self.page.screenshot(path=os.path.join(d, f"{self.game}-L{self.level}-{self.n}-{name}.png"))

    def js(self, expr):
        return self.page.evaluate(expr)

    def where(self, *args):
        a = ",".join(repr(x) if not isinstance(x, str) else f'"{x}"' for x in args)
        return self.js(f"__heal.run.controller.debug.where({a})")

    def top_is(self, x, y, sel):
        """Nothing in the HTML covers the point we tap."""
        return self.js(f"(() => {{ const e = document.elementFromPoint({x},{y}); return !!(e && e.closest('{sel}')); }})()")

    def tap(self, p, sel=None):
        x, y = p["x"], p["y"]
        if sel and not self.top_is(x, y, sel):
            raise AssertionError(f"{self.game} L{self.level} {self.size}: ({x:.0f},{y:.0f}) is covered, wanted {sel}")
        self.page.mouse.move(x, y)
        self.page.mouse.down()
        self.page.mouse.up()
        self.page.wait_for_timeout(60)

    def dish(self, item):
        # the host's sidebar dish (or our spare): tap it
        p = self.where("dish", item)
        self.tap(p)
        self.page.wait_for_timeout(120)

    def drag(self, pts, steps=4):
        m = self.page.mouse
        m.move(pts[0][0], pts[0][1])
        m.down()
        for x, y in pts[1:]:
            m.move(x, y, steps=steps)
        m.up()
        self.page.wait_for_timeout(80)

    def laps(self, track, n):
        c, rx, ry = track["c"], track["rx"], track["ry"]
        total = 2 * math.pi * n + 0.35
        k = max(12, int(24 * n))
        pts = [(c["x"] + rx * math.cos(total * i / k), c["y"] + ry * math.sin(total * i / k)) for i in range(k + 1)]
        self.drag(pts, steps=2)

    def done(self):
        b = self.page.locator(".cl-go.done, .cl-go").last
        b.click()
        self.page.wait_for_function("__heal.result", timeout=15000)

    # ---------------- the games, played fair ----------------
    def play_knee(self, P):
        side = P["side"]
        for r in P["rows"]:
            w = r.get("want", {})
            if r["kind"] == "kick":
                self.dish("hammer")
                for _ in range(w["n"]):
                    self.tap(self.where("part", "body-knee", side), ".hA-root")
                    self.page.wait_for_timeout(250)
                self.shot("kicked")
            elif r["kind"] == "laps":
                self.dish(r["item"])
                for _ in range(w["n"]):
                    self.laps(self.where("track", w["part"], side), 1)
                self.shot("wrapped")
            elif r["kind"] == "path":
                self.dish("bandage")
                for part in w["path"]:
                    self.laps(self.where("track", part, side), 1)
                self.shot("wrapped")
            elif r["kind"] == "xray":
                self.dish("xray")
                self.tap(self.where("part", "body-leg", side), ".hA-root")
                self.page.wait_for_timeout(200)
                for _ in range(w["n"]):
                    self.tap(self.where("part", "body-leg", side), ".hA-root")
                    self.page.wait_for_timeout(150)
                self.shot("xray")

    def play_ear(self, P):
        self.dish("torch")
        self.tap(self.where("ear", P["side"]), ".hA-root")
        self.page.wait_for_function("__heal.run.controller.debug.view === 'cave'")
        self.page.wait_for_timeout(500)
        self.shot("cave")
        for r in P["rows"]:
            w = r.get("want", {})
            if r["kind"] == "pluck":
                self.dish("tweezers")
                for t in w["order"]:
                    p = self.where("thing", t)
                    a, b = p["from"], p["to"]
                    self.drag([(a["x"], a["y"]), ((a["x"] + b["x"]) / 2, (a["y"] + b["y"]) / 2), (b["x"], b["y"])], steps=6)
                    self.page.wait_for_timeout(700)
                self.shot("plucked")
            elif r["kind"] == "count":
                self.dish(r["item"])
                for i in range(w["n"]):
                    self.tap(self.where("cave", i), ".hA-root")
                    self.page.wait_for_timeout(150)

    def play_tooth(self, P):
        for r in P["rows"]:
            w = r.get("want", {})
            if r["kind"] == "brush":
                self.dish("toothbrush")
                m = self.where("mouth")
                s = self.where("scale")
                L = 1.6 * s  # scale is px per 100 design units
                for d in w["screen"]:
                    dx, dy = {"up": (0, -1), "down": (0, 1), "left": (-1, 0), "right": (1, 0)}[d]
                    self.drag([(m["x"] - dx * L / 2, m["y"] - dy * L / 2), (m["x"] + dx * L / 2, m["y"] + dy * L / 2)], steps=6)
                self.shot("brushed")
            elif r["kind"] == "drill":
                self.dish("drill")
                self.tap(self.where("tooth", w["tooth"]), ".hA-root")
                self.page.wait_for_timeout(700)
                for _ in range(w["n"]):
                    b = self.where("bug")
                    self.tap(b, ".hA-root")
                    self.page.wait_for_timeout(420)
                self.shot("bug")
            elif r["kind"] == "fill":
                self.dish("paste")
                self.tap(self.where("blob", w["colour"]), ".hA-root")
                self.tap(self.where("tooth", w["tooth"]), ".hA-root")
                self.shot("filled")

    def run(self):
        page = self.page
        page.evaluate(
            """([g, L, seed, kind]) => {
              if (window.Onboard) Onboard.run = () => Promise.resolve("skipped");
              document.getElementById("lab-game").value = g;
              document.getElementById("lab-level").value = String(L);
              document.getElementById("lab-seed").value = String(seed);
              document.getElementById("lab-kind").value = kind;
              document.getElementById("lab-side").value = "";
              __heal.mount();
            }""",
            [self.game, self.level, self.seed, KINDS[self.game]],
        )
        page.wait_for_function("__heal.run && __heal.run.controller && __heal.run.controller.debug", timeout=15000)
        page.wait_for_timeout(700)
        P = self.js("JSON.parse(JSON.stringify(__heal.run.controller.debug.plan))")
        self.shot("start")
        getattr(self, "play_" + self.game)(P)
        self.done()
        page.wait_for_timeout(300)
        self.shot("end")
        r = self.js("({right: __heal.result.right, total: __heal.result.total, words: __heal.result.words.length})")
        ticks = self.js("document.querySelectorAll('.cl-row.ticked, .cl-row.done, .cl-row.tick').length")
        return P, r, ticks


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="knee,ear,tooth")
    ap.add_argument("--levels", default="1,2,3")
    ap.add_argument("--sizes", default="phone,ipad,laptop")
    ap.add_argument("--seeds", type=int, default=2, help="rounds per game x level x size")
    a = ap.parse_args()
    ok = kit_block_same()
    print(("ok  " if ok else "FAIL") + " KIT-A block identical in knee.js, ear.js, tooth.js")
    fails = 0 if ok else 1
    httpd = start_server()
    with sync_playwright() as pw:
        exe = "/opt/pw-browsers/chromium"
        br = pw.chromium.launch(executable_path=exe) if os.path.exists(exe) else pw.chromium.launch()
        for size in a.sizes.split(","):
            vp = SIZES[size]
            ctx = br.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
            page = ctx.new_page()
            errors = []
            # the host auto-loads every game id; the other agents' files (and web fonts offline) may be missing
            page.on("console", lambda m: m.type == "error" and "Failed to load resource" not in m.text and errors.append(m.text))
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(f"http://127.0.0.1:{PORT}/lab/clinic-heal-host.html?quiet=1&fast=1")
            page.wait_for_function("window.__heal && Clinic.Heal.has('knee') && Clinic.Heal.has('ear') && Clinic.Heal.has('tooth')", timeout=15000)
            for game in a.only.split(","):
                for L in [int(x) for x in a.levels.split(",")]:
                    for s in range(a.seeds):
                        seed = 11 + 7 * s + L
                        t0 = time.time()
                        try:
                            P, r, ticks = Play(page, game, L, size, seed).run()
                            good = r["right"] == r["total"] and r["total"] == len(P["rows"]) and ticks >= len(P["rows"])
                            msg = f"{r['right']}/{r['total']} rows, {ticks} ticked, ailment {P.get('ailment')}"
                        except Exception as e:  # noqa: BLE001
                            good, msg = False, f"{type(e).__name__}: {str(e)[:300]}"
                        if errors:
                            good, msg = False, msg + " | console: " + " / ".join(errors[:3])
                            errors.clear()
                        fails += 0 if good else 1
                        print(f"{'ok  ' if good else 'FAIL'} {size:6} {game:5} L{L} seed {seed:3}  {msg}  ({time.time() - t0:.1f}s)")
            ctx.close()
        br.close()
    if httpd:
        httpd.shutdown()
    print("PASS" if not fails else f"FAIL: {fails}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
