#!/usr/bin/env python3
"""Browser test for the clinic lab (clinic.html), phase 1.

Plays every lab entry through REAL pointer events at screen coordinates,
read from window.__clinic.expectation() (what the game wants next): taps
(the body, the kit, the magnifier, the trolley, the hand-over), drags (the
plaster, the blanket), circles (the bandage, and Cook's stir), counted taps
then the tick (drops, blankets, Cook's count), timing rings (lay and lift),
clicks (the speaking panel's mic, pills, the grown-up's tick). Before every
tap it checks the canvas is the topmost element there (nothing in the HTML
covers the thing being tapped). With --mistakes it makes one deliberate
wrong tap per row kind so every recast path runs.

Usage:
  python3 build/test_clinic.py                       # every entry, level 1, laptop
  python3 build/test_clinic.py --level 2 --viewport ipad
  python3 build/test_clinic.py --all-sizes --only visit:hurt
  python3 build/test_clinic.py --say wrong            # the stub recogniser mishears first
  add --canvas for Phaser's canvas renderer (fast in headless Chromium)
Port: CLINIC_TEST_PORT (default 8806).
"""
import argparse
import http.server
import json
import math
import os
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("CLINIC_TEST_PORT", os.environ.get("COOK_TEST_PORT", 8806)))
VIEWPORTS = [
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
]
SHOTS = os.path.join(ROOT, "build", "screenshots", "clinic")


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
        return None  # already served (a dev server on the same port)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


class Player:
    def __init__(self, page, shots, mistakes, say):
        self.page, self.shots, self.mistakes, self.say = page, shots, mistakes, say
        self.n = 0
        self.made = set()

    def shot(self, name):
        self.n += 1
        self.page.screenshot(path=os.path.join(self.shots, f"{self.n:03d}-{name}.png"))

    def exp(self):
        return self.page.evaluate("__clinic.expectation()")

    def uncovered(self, x, y, what):
        tag = self.page.evaluate("([x,y]) => { const e = document.elementFromPoint(x,y); return e ? (e.tagName + '#' + e.id + '.' + e.className) : 'none'; }", [x, y])
        if not tag.startswith("CANVAS"):
            raise AssertionError(f"{what} at ({x:.0f},{y:.0f}) is covered by {tag}")

    def tap(self, x, y, what="tap"):
        self.uncovered(x, y, what)
        self.page.mouse.click(x, y)

    def click(self, sel):
        self.page.click(sel, timeout=2000)

    def act(self, e):
        p = self.page
        k = e.get("kind")
        key = e.get("key")
        if k == "tap":
            # one deliberate wrong tap per kind of target, so the recast runs
            wr = e.get("swrongs") or []
            tag = f"tap:{'trolley' if key and key.startswith('care') else 'body' if key and key.startswith('body') else key}"
            if self.mistakes and wr and tag not in self.made:
                self.made.add(tag)
                self.tap(wr[0]["x"], wr[0]["y"], "wrong " + tag)
                time.sleep(0.4)
                return
            self.tap(e["sx"], e["sy"], key or "tap")
        elif k == "drag":
            f, t = e["sfrom"], e["sto"]
            self.uncovered(f["x"], f["y"], "drag")
            p.mouse.move(f["x"], f["y"])
            p.mouse.down()
            for i in range(1, 13):
                p.mouse.move(f["x"] + (t["x"] - f["x"]) * i / 12, f["y"] + (t["y"] - f["y"]) * i / 12)
                time.sleep(0.02)
            p.mouse.up()
        elif k == "circle":
            cx, cy, rx, ry, turns = e["sx"], e["sy"], e["srx"], e["sry"], e.get("turns") or 2
            p.mouse.move(cx + rx, cy)
            p.mouse.down()
            steps = 24
            for i in range(1, int(turns * steps) + 4):
                a = 2 * math.pi * i / steps
                p.mouse.move(cx + rx * math.cos(a), cy + ry * math.sin(a))
                time.sleep(0.012)
            p.mouse.up()
            time.sleep(0.2)
            self.click(e.get("doneSel", "#done-btn"))
        elif k == "stir":
            cx, cy, r = e["sx"], e["sy"], e["srx"]
            p.mouse.move(cx + r, cy)
            p.mouse.down()
            a = 0.0
            t0 = time.time()
            while time.time() - t0 < 40:
                a += 0.12
                p.mouse.move(cx + r * math.cos(a), cy + r * math.sin(a))
                time.sleep(0.016)
                cur = self.exp()
                if not cur or cur.get("kind") != "stir" or cur.get("count", 0) >= e["target"]:
                    break
            p.mouse.up()
            time.sleep(1.2)
        elif k == "count":
            have = e.get("count", 0)
            for _ in range(max(0, e["target"] - have)):
                self.tap(e["sx"], e["sy"], "count")
                time.sleep(0.25)
            time.sleep(0.3)
            self.click(e.get("doneSel", "#done-btn"))
        elif k == "timing":
            t0 = time.time()
            while time.time() - t0 < 15:
                g = p.evaluate("__clinic.gauge()")
                if g and g["lo"] + 0.02 <= g["level"] <= g["hi"] - 0.02:
                    break
                time.sleep(0.02)
            self.tap(e["sx"], e["sy"], "timing")
        elif k == "click":
            sel = e["selector"]
            if e.get("tell"):
                # a child whose word isn't understood twice takes the pills once they're up
                self.tries = getattr(self, "tries", {})
                n = self.tries[e["answer"]] = self.tries.get(e["answer"], 0) + 1
                if self.say in ("wrong", "nothing", "low", "mumble") and e.get("pills") and n > 2:
                    sel = f'#choices .choice[data-key="{e["answer"]}"]'
                    self.tries[e["answer"]] = 0
                elif self.say == "pills" and e.get("pills"):
                    sel = f'#choices .choice[data-key="{e["answer"]}"]'
                elif self.say == "pills":
                    # the pills come once the mic has been tried (level 2+): try it (the stub hears nothing)
                    p.evaluate("Clinic.Speech.mode = 'nothing'")
            if e.get("parent"):
                sel = "#cl-parent-yes"
            self.click(sel)
        else:
            raise AssertionError(f"unknown expectation {e}")

    def play(self, key, level, timeout=240):
        p = self.page
        p.evaluate("([k, l, s, pj]) => __clinic.lab(k, l, {say: s === 'pills' ? 'nothing' : s, parent: pj})", [key, level, self.say, self.say == "parent"])
        t0 = time.time()
        shots = 0
        last = None
        while time.time() - t0 < timeout:
            st = p.evaluate("__clinic.last()")
            if st and st["done"] and st["key"] == key:
                self.shot(f"{key.replace(':', '-')}-L{level}-result")
                return st
            e = self.exp()
            if e and e.get("kind") != "click" or (e and e.get("selector") != "#lab-list"):
                if e and shots < 3 and json.dumps(e, sort_keys=True) != last:
                    shots += 1
                    self.shot(f"{key.replace(':', '-')}-L{level}-{shots}")
                last = json.dumps(e, sort_keys=True) if e else None
                if e:
                    try:
                        self.act(e)
                    except AssertionError:
                        raise
                    except Exception as ex:  # a moving target (the expectation changed under us): look again
                        print("   (retry)", str(ex)[:120])
                    time.sleep(0.15)
                    continue
            # no expectation: a line is being said; a tap on the stage skips it
            time.sleep(0.2)
        raise AssertionError(f"{key} level {level}: timed out; last expectation {self.exp()}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", type=int, default=1)
    ap.add_argument("--viewport", default="laptop")
    ap.add_argument("--all-sizes", action="store_true")
    ap.add_argument("--only", action="append")
    ap.add_argument("--skip", action="append", default=["tools:hotspots"])
    ap.add_argument("--mistakes", action="store_true")
    ap.add_argument("--say", default="right", choices=["right", "wrong", "nothing", "low", "mumble", "pills", "parent"])
    ap.add_argument("--speed", type=float, default=4)
    ap.add_argument("--canvas", action="store_true")
    a = ap.parse_args()
    start_server()
    os.makedirs(SHOTS, exist_ok=True)
    vps = VIEWPORTS if a.all_sizes else [v for v in VIEWPORTS if v["name"] == a.viewport]
    fails = []
    with sync_playwright() as pw:
        exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
        args = ["--autoplay-policy=no-user-gesture-required"] + (["--disable-webgl"] if a.canvas else [])
        browser = pw.chromium.launch(executable_path=exe, args=args)
        for vp in vps:
            ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
            page = ctx.new_page()
            page.route("**/fonts.googleapis.com/**", lambda r: r.abort())
            page.route("**/fonts.gstatic.com/**", lambda r: r.abort())
            errors = []
            # the fonts are blocked on purpose (offline): their failed loads are not errors
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "net::ERR_FAILED" not in m.text else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(f"http://127.0.0.1:{PORT}/clinic.html?speed={a.speed}")
            page.wait_for_selector("#panel h1", timeout=20000)
            keys = page.evaluate("__clinic.labs()")
            keys = [k for k in keys if (not a.only or k in a.only) and k not in a.skip]
            d = os.path.join(SHOTS, vp["name"])
            os.makedirs(d, exist_ok=True)
            for f in os.listdir(d):
                os.remove(os.path.join(d, f))
            pl = Player(page, d, a.mistakes, a.say)
            for key in keys:
                t0 = time.time()
                try:
                    st = pl.play(key, a.level)
                    stars = st.get("stars") or {}
                    print(f"  {vp['name']:16} L{a.level} {key:18} ok {time.time() - t0:5.1f}s  stars {json.dumps(stars)}  misses {len(st['misses'])}  voice {[v['path'] for v in st['voice']]}", flush=True)
                except Exception as ex:
                    fails.append(f"{vp['name']} {key}: {ex}")
                    print(f"  {vp['name']:16} L{a.level} {key:18} FAIL {str(ex)[:200]}", flush=True)
                    pl.shot(f"FAIL-{key.replace(':', '-')}")
                    page.goto(f"http://127.0.0.1:{PORT}/clinic.html?speed={a.speed}")
                    page.wait_for_selector("#panel h1", timeout=20000)
                if errors:
                    fails.append(f"{vp['name']} {key}: console errors: {errors[:3]}")
                    print("    console:", errors[:3])
                    errors.clear()
            ctx.close()
        browser.close()
    if fails:
        print("\nFAIL:\n  " + "\n  ".join(fails))
        sys.exit(1)
    print("\nPASS")


if __name__ == "__main__":
    main()
