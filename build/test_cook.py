#!/usr/bin/env python3
"""End-to-end test for Cook with Nani (cook.html).

Plays the game through REAL pointer events at screen coordinates: taps,
holds, swipes, drags and circles, read from window.__cook.expectation()
(what the game currently wants). Never calls game handlers directly.

Before every tap it checks that the game canvas is the topmost element at
that point (nothing in the HTML layer covers the thing being tapped), the
playtest-2 rule. It also deliberately makes mistakes (a wrong greeting, a
wrong pantry item, a wrong step) to exercise the warm-failure paths.

Usage:
  python3 build/test_cook.py                 # all viewports, day 1 only
  python3 build/test_cook.py --full          # one viewport, all 5 days + free play
  python3 build/test_cook.py --full --busy   # the same in the busy setting
  python3 build/test_cook.py --viewport laptop --days 2
"""
import argparse
import http.server
import json
import math
import os
import random
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = 8942

VIEWPORTS = [
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
]


class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def start_server():
    os.chdir(ROOT)

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    httpd = ReusableTCPServer(("127.0.0.1", PORT), QuietHandler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


class Player:
    def __init__(self, page, shots, mistakes=True, log=print):
        self.page = page
        self.shots = shots
        self.mistakes = mistakes
        self.log = log
        self.n = 0
        self.made_mistake = set()
        self.actions = 0

    def shot(self, name):
        self.n += 1
        path = os.path.join(self.shots, f"{self.n:03d}-{name}.png")
        self.page.screenshot(path=path)
        return path

    def exp(self):
        return self.page.evaluate("__cook.expectation()")

    def gauge(self):
        return self.page.evaluate("__cook.gauge()")

    def assert_uncovered(self, x, y, what):
        tag = self.page.evaluate(
            "([x,y]) => { const e = document.elementFromPoint(x,y); return e ? (e.tagName + '#' + e.id + '.' + e.className) : 'none'; }",
            [x, y],
        )
        if not tag.startswith("CANVAS"):
            raise AssertionError(f"{what} at ({x:.0f},{y:.0f}) is covered by {tag}")

    def tap(self, x, y, what="tap"):
        self.assert_uncovered(x, y, what)
        self.page.mouse.click(x, y)

    def wait_change(self, prev, timeout=20):
        t0 = time.time()
        while time.time() - t0 < timeout:
            e = self.exp()
            if e != prev:
                return e
            time.sleep(0.08)
        return self.exp()

    def act(self, e):
        k = e["kind"]
        self.actions += 1
        p = self.page
        if k == "click":
            sel = e["selector"]
            # one wrong greeting per run, to see the warm-failure path
            if self.mistakes and e.get("wrong") and "greet" not in self.made_mistake:
                self.made_mistake.add("greet")
                p.click(e["wrong"])
                time.sleep(0.4)
                self.shot("wrong-greeting")
            p.wait_for_selector(sel, state="visible", timeout=10000)
            p.click(sel)
        elif k == "tap":
            if self.mistakes and e.get("swrongs") and e["key"] not in self.made_mistake and random.random() < 0.25:
                self.made_mistake.add(e["key"])
                w = random.choice(e["swrongs"])
                self.tap(w["x"], w["y"], "wrong item")
                time.sleep(0.5)
            self.tap(e["sx"], e["sy"], e.get("key", "item"))
        elif k == "hold":
            self.assert_uncovered(e["sx"], e["sy"], "hold")
            p.mouse.move(e["sx"], e["sy"])
            p.mouse.down()
            t0 = time.time()
            while time.time() - t0 < 12:
                g = self.gauge()
                if g and g["level"] >= (g["lo"] + g["hi"]) / 2:
                    break
                time.sleep(0.02)
            p.mouse.up()
        elif k == "timing":
            t0 = time.time()
            while time.time() - t0 < 15:
                g = self.gauge()
                if g and g["level"] >= (g["lo"] + g["hi"]) / 2:
                    break
                time.sleep(0.02)
            self.tap(e["sx"], e["sy"], "timing")
        elif k == "count":
            target = e["target"]
            have = e.get("count", 0)
            for _ in range(max(0, target - have)):
                self.tap(e["sx"], e["sy"], "sugar")
                time.sleep(0.45)
            time.sleep(0.3)
            self.tap(e["sdoneX"], e["sdoneY"], "glass")
        elif k == "more":
            if e["count"] < e["target"]:
                self.tap(e["sx"], e["sy"], "another dough")
            else:
                p.click("#done-btn")
        elif k == "knead":
            for _ in range(9):
                self.tap(e["sx"], e["sy"], "knead")
                time.sleep(0.12)
                if self.exp() is None:
                    break
        elif k == "roll":
            cx, cy, r = e["sx"], e["sy"], e["sr"]
            for i in range(12):
                g = self.gauge()
                if g and g["level"] >= 0.95:
                    break
                ang = random.random() * math.pi * 2
                p.mouse.move(cx, cy)
                p.mouse.down()
                steps = 8
                for s in range(1, steps + 1):
                    d = r * 0.9 * s / steps
                    p.mouse.move(cx + math.cos(ang) * d, cy + math.sin(ang) * d * 0.6)
                    time.sleep(0.01)
                p.mouse.up()
                time.sleep(0.05)
        elif k == "swipe":
            p.mouse.move(e["sx1"], e["sy1"])
            p.mouse.down()
            for s in range(1, 9):
                p.mouse.move(e["sx1"] + (e["sx2"] - e["sx1"]) * s / 8, e["sy1"] + (e["sy2"] - e["sy1"]) * s / 8)
                time.sleep(0.01)
            p.mouse.up()
            time.sleep(0.25)
        elif k == "stir":
            cx, cy, rx, ry, target = e["sx"], e["sy"], e["srx"], e["sry"], e["target"]
            p.mouse.move(cx + rx, cy)
            p.mouse.down()
            steps = 24
            total = target + 0.25
            for s in range(1, int(steps * total) + 1):
                a = 2 * math.pi * s / steps
                p.mouse.move(cx + rx * math.cos(a), cy + ry * math.sin(a))
                time.sleep(0.012)
            p.mouse.up()
        else:
            raise AssertionError(f"unknown expectation {k}")

    def play(self, until, timeout=900, shoot_every=True):
        t0 = time.time()
        last_kind = None
        last_view = None
        idle = 0
        while not until():
            try:
                view = self.page.evaluate("__cook.state().view")
            except Exception:
                view = None
            if view != last_view:
                last_view = view
                time.sleep(0.9)
                self.shot(f"view-{view}")
            if time.time() - t0 > timeout:
                raise AssertionError("timed out playing")
            e = self.exp()
            if not e:
                time.sleep(0.1)
                idle += 1
                if idle > 600:
                    self.shot("stuck")
                    raise AssertionError("no expectation for 60s")
                continue
            idle = 0
            if e["kind"] == "click" and e["selector"] in ("#sum-shop", "#sum-finale", "#shop-done", "#t-start", "#t-free", "#fin-menu"):
                time.sleep(0.1)
                continue
            if shoot_every and (e["kind"] != last_kind or e["kind"] in ("click",)):
                self.shot(f"{e['kind']}")
            last_kind = e["kind"]
            self.act(e)
            self.wait_change(e, timeout=25)


def run(viewport, days, busy, full, speed, shots_root, mistakes=True):
    name = viewport["name"] + ("-busy" if busy else "")
    shots = os.path.join(shots_root, name)
    os.makedirs(shots, exist_ok=True)
    for f in os.listdir(shots):
        os.remove(os.path.join(shots, f))
    errors = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None, args=["--autoplay-policy=no-user-gesture-required"])
        ctx = browser.new_context(viewport={"width": viewport["width"], "height": viewport["height"]}, has_touch=viewport["touch"])
        page = ctx.new_page()
        page.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        page.route("**/fonts.gstatic.com/**", lambda r: r.abort())
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(f"http://127.0.0.1:{PORT}/cook.html?speed={speed}")
        page.evaluate("localStorage.clear()")
        page.goto(f"http://127.0.0.1:{PORT}/cook.html?speed={speed}")
        page.wait_for_selector("#panel h1", timeout=15000)
        P = Player(page, shots, mistakes=mistakes)
        P.shot("title")
        if busy:
            page.click("[data-mode=busy]")
        for d in range(1, days + 1):
            page.wait_for_selector("#t-start, #t-free", timeout=10000)
            page.click("#t-start" if d <= 5 else "#t-free")
            # play until the day summary appears
            P.play(lambda: page.evaluate("!!document.querySelector('#sum-shop, #sum-finale')"), timeout=1200)
            st = page.evaluate("__cook.state()")
            print(f"  {name}: day {d} done, coins {st['coins']}, orders {[(o['who'], o['stars'], o['score']) for o in st['log']][-4:]}")
            P.shot(f"day{d}-summary")
            if page.query_selector("#sum-finale"):
                page.click("#sum-finale")
                time.sleep(0.5)
                P.shot("finale")
                page.click("#fin-shop")
            else:
                page.click("#sum-shop")
            time.sleep(0.3)
            # buy the cheapest affordable thing, as a player would
            buys = page.query_selector_all("[data-buy]:not([disabled])")
            if buys:
                buys[0].click()
                time.sleep(0.2)
            P.shot(f"day{d}-shop")
            page.click("#shop-done")
            time.sleep(0.3)
        P.shot("end-title")
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        raise AssertionError(f"console errors on {name}: {bad[:5]}")
    return P.n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--full", action="store_true")
    ap.add_argument("--busy", action="store_true")
    ap.add_argument("--viewport")
    ap.add_argument("--days", type=int)
    ap.add_argument("--speed", type=float, default=3)
    ap.add_argument("--shots", default=os.path.join(ROOT, "build", "screenshots", "cook"))
    args = ap.parse_args()
    random.seed(7)
    httpd = start_server()
    vps = VIEWPORTS
    if args.viewport:
        vps = [v for v in VIEWPORTS if v["name"] == args.viewport]
    days = args.days or (6 if args.full else 1)
    if args.full and not args.viewport:
        vps = [VIEWPORTS[1]]
    failed = []
    for vp in vps:
        t0 = time.time()
        try:
            n = run(vp, days, args.busy, args.full, args.speed, args.shots)
            print(f"PASS {vp['name']}: {days} day(s), {n} screenshots, {time.time() - t0:.0f}s")
        except Exception as ex:
            print(f"FAIL {vp['name']}: {ex}")
            failed.append(vp["name"])
    httpd.shutdown()
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
