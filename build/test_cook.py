#!/usr/bin/env python3
"""End-to-end test for Cook with Nani (cook.html), Phase A.

Plays through REAL pointer events at screen coordinates: taps, holds,
swipes, vertical rolling drags, circles at a given speed, and quick
slices through moving vegetables, read from window.__cook.expectation()
(what the game wants next). It never calls game handlers directly.

Before every tap it checks that the game canvas is the topmost element at
that point (nothing in the HTML layer covers the thing being tapped). It
makes deliberate mistakes now and then (a wrong greeting, a wrong item) to
exercise the warm-failure paths.

Usage:
  python3 build/test_cook.py --lab                  # every station in the Station lab (laptop)
  python3 build/test_cook.py --lab --viewport flip5-landscape
  python3 build/test_cook.py --days 2               # story days, all viewports
  python3 build/test_cook.py --viewport laptop --days 7   # all six days + free cooking
  add --busy for the Busy setting, --speed N to change test speed (default 3)
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
LAB = ["fetch", "passme", "pour", "boil", "count", "knead", "roll", "flip", "chop", "tadka", "stir", "assemble", "fill", "fry", "thread", "grill"]

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
    def __init__(self, page, shots, speed, mistakes=True):
        self.page = page
        self.shots = shots
        self.speed = speed
        self.mistakes = mistakes
        self.n = 0
        self.made = set()
        self.repeats = 0
        self.last_key = None

    def shot(self, name):
        self.n += 1
        path = os.path.join(self.shots, f"{self.n:03d}-{name}.png")
        self.page.screenshot(path=path)
        return path

    def exp(self):
        return self.page.evaluate("__cook.expectation()")

    def gauge(self):
        return self.page.evaluate("__cook.gauge()")

    def uncovered(self, x, y, what):
        tag = self.page.evaluate(
            "([x,y]) => { const e = document.elementFromPoint(x,y); return e ? (e.tagName + '#' + e.id + '.' + e.className) : 'none'; }", [x, y]
        )
        if not tag.startswith("CANVAS"):
            raise AssertionError(f"{what} at ({x:.0f},{y:.0f}) is covered by {tag}")

    def tap(self, x, y, what="tap"):
        self.uncovered(x, y, what)
        self.page.mouse.click(x, y)

    def wait_change(self, prev, timeout=20):
        t0 = time.time()
        while time.time() - t0 < timeout:
            e = self.exp()
            if e != prev:
                return e
            time.sleep(0.06)
        return self.exp()

    def act(self, e):
        k = e["kind"]
        p = self.page
        if k == "wait":
            time.sleep(0.05)
            return
        if k == "click":
            sel = e["selector"]
            if self.mistakes and e.get("wrong") and "click-wrong" not in self.made and p.query_selector(e["wrong"]):
                self.made.add("click-wrong")
                p.click(e["wrong"])
                time.sleep(0.5)
                self.shot("wrong-choice")
            p.wait_for_selector(sel, state="visible", timeout=10000)
            p.click(sel)
        elif k == "tap":
            if self.mistakes and e.get("swrongs") and e.get("key") not in self.made and random.random() < 0.2:
                self.made.add(e.get("key"))
                w = random.choice(e["swrongs"])
                self.tap(w["x"], w["y"], "wrong item")
                time.sleep(0.4)
            self.tap(e["sx"], e["sy"], e.get("key", "item"))
        elif k == "hold":
            self.uncovered(e["sx"], e["sy"], "hold")
            p.mouse.move(e["sx"], e["sy"])
            p.mouse.down()
            t0 = time.time()
            while time.time() - t0 < 15:
                g = self.gauge()
                if g and g["level"] >= (g["lo"] + g["hi"]) / 2:
                    break
                time.sleep(0.015)
            p.mouse.up()
        elif k == "timing":
            t0 = time.time()
            while time.time() - t0 < 30:
                g = self.gauge()
                if g and g["level"] >= (g["lo"] + g["hi"]) / 2:
                    break
                cur = self.exp()
                if cur and cur.get("kind") != "timing":
                    return  # Nani interrupted: answer her first
                time.sleep(0.015)
            self.tap(e["sx"], e["sy"], "timing")
        elif k == "count":
            for _ in range(max(0, e["target"] - e.get("count", 0))):
                self.tap(e["sx"], e["sy"], "count")
                time.sleep(0.35)
            time.sleep(0.3)
            p.click("#done-btn")
        elif k == "more":
            if e["count"] < e["target"]:
                self.tap(e["sx"], e["sy"], "another")
            else:
                p.click("#done-btn")
        elif k == "knead":
            for _ in range(10):
                self.tap(e["sx"], e["sy"], "knead")
                time.sleep(0.1)
                if self.exp() != e:
                    break
        elif k == "roll":
            cx, cy, r = e["sx"], e["sy"], e["sr"]
            for _ in range(20):
                g = self.gauge()
                if g and g["level"] >= 0.95:
                    break
                p.mouse.move(cx, cy + r * 0.7)
                p.mouse.down()
                for s in range(1, 9):
                    p.mouse.move(cx, cy + r * 0.7 - (r * 1.4) * s / 8)
                p.mouse.up()
            time.sleep(0.5)
        elif k in ("swipe", "slice"):
            p.mouse.move(e["sx1"], e["sy1"])
            p.mouse.down()
            steps = 4 if k == "slice" else 10
            for s in range(1, steps + 1):
                p.mouse.move(e["sx1"] + (e["sx2"] - e["sx1"]) * s / steps, e["sy1"] + (e["sy2"] - e["sy1"]) * s / steps)
                if k == "swipe":
                    time.sleep(0.01)
            p.mouse.up()
        elif k == "stir":
            cx, cy, rx, ry, target = e["sx"], e["sy"], e["srx"], e["sry"], e["target"]
            # game laps per game-second: slow 0.25-0.75, quick 1.2-2.6; the
            # game runs at `speed`, so real laps per second = that x speed
            want = {"slow": 0.5, "quick": 1.8}.get(e.get("speed"), 1.0) * self.speed
            steps = 24
            p.mouse.move(cx + rx, cy)
            p.mouse.down()
            t_lap = 1.0 / want
            start = time.time()
            s = 0
            while s < int(steps * (target + 0.3)):
                s += 1
                a = 2 * math.pi * s / steps
                p.mouse.move(cx + rx * math.cos(a), cy + ry * math.sin(a))
                target_t = start + t_lap * s / steps
                delay = target_t - time.time()
                if delay > 0:
                    time.sleep(delay)
            p.mouse.up()
        else:
            raise AssertionError(f"unknown expectation {k}")

    def play(self, until, timeout=900):
        t0 = time.time()
        last_kind = None
        last_view = None
        idle = 0
        while not until():
            if time.time() - t0 > timeout:
                self.shot("timeout")
                raise AssertionError("timed out playing")
            try:
                view = self.page.evaluate("__cook.state().view")
            except Exception:
                view = None
            if view != last_view:
                last_view = view
                time.sleep(0.3)
                ex = self.exp()
                if not ex or ex["kind"] not in ("timing", "hold", "slice"):
                    self.shot(f"view-{view}")
            e = self.exp()
            if not e:
                time.sleep(0.1)
                idle += 1
                if idle > 700:
                    self.shot("stuck")
                    raise AssertionError("no expectation for 70s")
                continue
            idle = 0
            if e["kind"] == "click" and e["selector"] in ("#sum-shop", "#sum-finale", "#shop-done", "#t-start", "#t-free", "#fin-menu", "#lab-list"):
                time.sleep(0.1)
                continue
            timed = e["kind"] in ("timing", "hold", "slice", "stir", "roll")
            if not timed and e["kind"] != "wait" and e["kind"] != last_kind:
                self.shot(e["kind"])
            shoot_after = timed and e["kind"] != last_kind
            last_kind = e["kind"]
            key = json.dumps({k: v for k, v in e.items() if k in ("kind", "key", "x", "y", "selector")}, sort_keys=True)
            self.repeats = self.repeats + 1 if (key == self.last_key and e["kind"] not in ("wait", "slice")) else 0
            self.last_key = key
            if self.repeats > 8:
                self.shot("stuck")
                raise AssertionError(f"stuck repeating {key}")
            self.act(e)
            if shoot_after:
                self.shot(e["kind"] + "-after")
            if e["kind"] not in ("wait", "slice"):
                self.wait_change(e, timeout=25)


def open_page(pw, vp, speed, busy):
    browser = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None, args=["--autoplay-policy=no-user-gesture-required"])
    ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
    page = ctx.new_page()
    page.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    page.route("**/fonts.gstatic.com/**", lambda r: r.abort())
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(f"http://127.0.0.1:{PORT}/cook.html?speed={speed}")
    page.evaluate("localStorage.clear()")
    page.goto(f"http://127.0.0.1:{PORT}/cook.html?speed={speed}")
    page.wait_for_selector("#panel h1", timeout=15000)
    if busy:
        page.click("[data-mode=busy]")
    return browser, page, errors


def shots_dir(root, name):
    d = os.path.join(root, name)
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        os.remove(os.path.join(d, f))
    return d


def run_lab(vp, speed, busy, shots_root, stations, guided):
    name = vp["name"] + "-lab" + ("-busy" if busy else "")
    shots = shots_dir(shots_root, name)
    with sync_playwright() as pw:
        browser, page, errors = open_page(pw, vp, speed, busy)
        P = Player(page, shots, speed)
        results = {}
        for key in stations:
            page.evaluate(f"() => {{ __cook.lab('{key}', {'true' if guided else 'false'}); }}")
            page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)
            time.sleep(0.5)
            P.shot(f"{key}-start")
            P.play(lambda: page.evaluate("!!document.querySelector('#lab-list') && !document.querySelector('#overlay').classList.contains('hidden')"), timeout=300)
            P.shot(f"{key}-result")
            results[key] = page.evaluate("document.querySelector('#panel .cc-why') ? document.querySelector('#panel .cc-why').innerText : ''")
            print(f"  {name}: {key}: {results[key]!r}")
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        raise AssertionError(f"console errors: {bad[:5]}")
    return P.n


def run_days(vp, days, speed, busy, shots_root):
    name = vp["name"] + ("-busy" if busy else "")
    shots = shots_dir(shots_root, name)
    with sync_playwright() as pw:
        browser, page, errors = open_page(pw, vp, speed, busy)
        P = Player(page, shots, speed)
        P.shot("title")
        for d in range(1, days + 1):
            page.wait_for_selector("#t-start, #t-free", timeout=10000)
            page.click("#t-start" if page.query_selector("#t-start") else "#t-free")
            P.play(lambda: page.evaluate("!!document.querySelector('#sum-shop, #sum-finale')"), timeout=1500)
            st = page.evaluate("__cook.state()")
            print(f"  {name}: day {d} done, coins {st['coins']}, cards {[(c['who'], sum(c['stars'].values()), c['reasons'][:1]) for c in st['cards']][-4:]}")
            P.shot(f"day{d}-summary")
            if page.query_selector("#sum-finale"):
                page.click("#sum-finale")
                time.sleep(0.5)
                P.shot("finale")
                page.click("#fin-shop")
            else:
                page.click("#sum-shop")
            time.sleep(0.3)
            buys = page.query_selector_all("[data-buy]:not([disabled])")
            if buys:
                random.choice(buys).click()
                time.sleep(0.2)
            P.shot(f"day{d}-shop")
            page.click("#shop-done")
            time.sleep(0.3)
        P.shot("end-title")
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        raise AssertionError(f"console errors: {bad[:5]}")
    return P.n


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", action="store_true")
    ap.add_argument("--stations", default=",".join(LAB))
    ap.add_argument("--unguided", action="store_true")
    ap.add_argument("--busy", action="store_true")
    ap.add_argument("--viewport")
    ap.add_argument("--days", type=int, default=1)
    ap.add_argument("--speed", type=float, default=3)
    ap.add_argument("--shots", default=os.path.join(ROOT, "build", "screenshots", "cook"))
    args = ap.parse_args()
    random.seed(7)
    httpd = start_server()
    vps = VIEWPORTS
    if args.viewport:
        vps = [v for v in VIEWPORTS if v["name"] == args.viewport]
    elif args.lab:
        vps = [VIEWPORTS[1]]
    failed = []
    for vp in vps:
        t0 = time.time()
        try:
            if args.lab:
                n = run_lab(vp, args.speed, args.busy, args.shots, args.stations.split(","), not args.unguided)
            else:
                n = run_days(vp, args.days, args.speed, args.busy, args.shots)
            print(f"PASS {vp['name']}: {n} screenshots, {time.time() - t0:.0f}s", flush=True)
        except Exception as ex:
            print(f"FAIL {vp['name']}: {ex}", flush=True)
            failed.append(vp["name"])
    httpd.shutdown()
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
