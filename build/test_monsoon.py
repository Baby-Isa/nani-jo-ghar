#!/usr/bin/env python3
"""Browser test for Monsoon rush (monsoon.html, the Rush lab). Build brief tasks 2-3.

Same style as build/test_cook.py and build/test_find.py: it plays through REAL
pointer events at screen coordinates, read from window.__monsoon.expectation()
(what the game wants next), and never calls the game's handlers. Before every
tap it checks that the thing tapped is the pot's own hit area (nothing in the
HTML layer covers the play area). Time is the game's virtual clock
(?clock=virtual): the test moves it on, so a slow headless browser grades
exactly like a phone at 60 fps.

  --play       a test player gets every star in G1, G2 and G3, levels 1-3,
               Drizzle and Busy (G3 through the lab's speech stub: "heard it")
  --paths      every speech path of G3 is reachable: heard, wrong, null
               (the pills), timeout, the parent's tick, the english bot
  --bots N     the browser bots agree with the Node bots: N storms per bot,
               same seeds, compared outcome by outcome with js/monsoon/bots.js
               played headless in the same page
  --viewport NAME   one of the six sizes, or phone375; default: all seven
  --game g1 --level 1 --busy / --drizzle   narrow a run
  --canvas, --virtual-clock   accepted for the harness's shape (Monsoon is plain
               HTML, no Phaser; the virtual clock is always on)

Screenshots go to build/screenshots/monsoon/<viewport>/. Default port 8805
(COOK_TEST_PORT or MONSOON_TEST_PORT to change it).

  python3 build/test_monsoon.py                  # --play on all sizes, --paths, --bots 6
  python3 build/test_monsoon.py --play --viewport laptop
  python3 build/test_monsoon.py --bots 20 --game g1
"""
import argparse
import http.server
import json
import os
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("MONSOON_TEST_PORT", os.environ.get("COOK_TEST_PORT", 8805)))
SHOTS = os.path.join(ROOT, "build", "screenshots", "monsoon")

VIEWPORTS = [
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
    {"name": "phone375", "width": 812, "height": 375, "touch": True},
]


class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        pass


def start_server():
    os.chdir(ROOT)

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    httpd = ReusableTCPServer(("127.0.0.1", PORT), Quiet)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


class Fail(Exception):
    pass


class Tester:
    def __init__(self, page, vp):
        self.page = page
        self.vp = vp
        self.dir = os.path.join(SHOTS, vp["name"])
        os.makedirs(self.dir, exist_ok=True)
        for f in os.listdir(self.dir):
            if f.endswith(".png"):
                os.remove(os.path.join(self.dir, f))
        self.n = 0
        self.errors = []
        page.on("pageerror", lambda e: self.errors.append(f"pageerror: {e}"))
        page.on("console", lambda m: m.type == "error" and "fonts.g" not in m.text and "ERR_CERT" not in m.text and self.errors.append(f"console: {m.text}"))

    def shot(self, name):
        self.n += 1
        p = os.path.join(self.dir, f"{self.n:03d}-{name}.png")
        self.page.screenshot(path=p)
        return p

    def ev(self, js, arg=None):
        return self.page.evaluate(js, arg) if arg is not None else self.page.evaluate(js)

    def state(self):
        return self.ev("__monsoon.state()")

    def now(self):
        return self.ev("__monsoon.state().now || 0")

    def advance_to(self, t, step=0.05):
        """Move the virtual clock to time t, in small steps (events fire in order)."""
        now = self.now()
        if t <= now:
            return now
        n = max(1, int((t - now) / step))
        self.ev(f"__monsoon.step({(t - now) / n}, {n})")
        return self.now()

    def uncovered(self, x, y, sel_ok):
        """The tap-cover check: the topmost element at (x, y) must be the thing we mean."""
        ok = self.ev(
            "([x, y, sel]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest(sel)); }",
            [x, y, sel_ok],
        )
        if not ok:
            what = self.ev("([x, y]) => { const e = document.elementFromPoint(x, y); return e ? e.outerHTML.slice(0, 120) : 'nothing'; }", [x, y])
            self.shot("covered")
            raise Fail(f"tap at ({x:.0f},{y:.0f}) is covered by {what}")

    def tap_pot(self, cand):
        w = self.ev("(c) => __monsoon.where(c)", cand)
        if not w:
            raise Fail(f"pot {cand} not on screen")
        self.uncovered(w["x"], w["y"], f'.pot-hit[data-cand="{cand}"]')
        self.page.mouse.click(w["x"], w["y"])

    def click_sel(self, sel):
        box = self.page.locator(sel).first.bounding_box()
        if not box:
            raise Fail(f"{sel} not visible")
        x, y = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        self.uncovered(x, y, sel)
        self.page.mouse.click(x, y)

    def start(self, game, level, mode, words="known", seed=7, speech="heard", bot=None):
        self.ev("(m) => { Monsoon.Listen.mode = m; }", speech)
        opts = {"game": game, "level": level, "mode": mode, "words": words, "seed": seed, "skipIntro": True, "quiet": 1}
        if bot:
            opts["bot"] = bot
        self.ev("(o) => __monsoon.play(o)", opts)
        self.page.wait_for_function("__monsoon.state().phase !== 'lab'")

    def wait_phase(self, want, limit=400):
        for _ in range(limit):
            st = self.state()
            if st["phase"] == want:
                return st
            self.ev("__monsoon.step(0.1, 5)")
        raise Fail(f"never reached {want}: {self.state()}")

    # ------------------------------------------------ a test player
    def play_storm(self, game, level, mode, seed=7, shots=True):
        """Play as a child who understood every call: act on __monsoon.expectation()."""
        self.start(game, level, mode, seed=seed)
        shot_wave = {1, 3}
        waves_seen = set()
        for _ in range(4000):
            st = self.state()
            if st["phase"] == "result":
                break
            e = self.ev("__monsoon.expectation()")
            if not e:
                self.ev("__monsoon.step(0.05, 4)")
                continue
            if e["wave"] not in waves_seen:
                waves_seen.add(e["wave"])
                if shots and len(waves_seen) in shot_wave:
                    self.advance_to(st["timing"]["keyEnd"] + 0.3)
                    self.shot(f"{game}-l{level}-{mode}-wave{len(waves_seen)}")
            if e["kind"] == "tap":
                self.advance_to(max(self.now(), st["timing"]["keyEnd"] + 0.4))
                self.tap_pot(e["cand"])
            elif e["kind"] == "count":
                self.advance_to(e["lidAfter"] + 0.25)
                self.tap_pot(e["cand"])
            elif e["kind"] == "say":
                self.advance_to(max(self.now(), st["timing"]["t0"] + 0.3))
                self.click_sel("#speak .mic")
                self.ev("__monsoon.step(0.1, 10)")
            self.ev("__monsoon.step(0.02, 2)")
        st = self.wait_phase("result")
        if shots:
            self.shot(f"{game}-l{level}-{mode}-result")
        return st


def run_play(t, games, levels, modes, shots=True):
    fails = []
    for g in games:
        for lv in levels:
            for mode in modes:
                st = t.play_storm(g, lv, mode, seed=11 + lv, shots=shots)
                stars = st["result"]["stars"]
                want = ["voice", "hand"] if g == "g3" else ["ear", "hand"]
                want.append("busy" if mode == "busy" and g != "g3" else "relaxed" if mode == "drizzle" else None)
                missing = [k for k in want if k and not stars.get(k)]
                tally = st["result"]["tally"]
                line = f"  {t.vp['name']:16} {g} L{lv} {mode:8} stars {sorted(k for k, v in stars.items() if v)} heard {tally['heard']}/{tally['tested']} voice {tally['voiceOk']}/{tally['voiceCalls']} saved {tally['saved']}/{tally['targets']}"
                print(line + ("" if not missing else f"  MISSING {missing}"))
                if missing:
                    fails.append(f"{g} L{lv} {mode}: missing {missing}")
    return fails


def run_paths(t):
    """Every G3 speech path is reachable from the lab."""
    fails = []
    for mode, expect in [("heard", "voice"), ("wrong", "wrong pot"), ("null", "pills"), ("timeout", "pills"), ("english", "pills")]:
        for tempo in ["drizzle", "busy"]:
            t.start("g3", 1, tempo, seed=3, speech=mode)
            st = t.state()
            t.advance_to(st["timing"]["t0"] + 0.3)
            t.click_sel("#speak .mic")
            t.ev("__monsoon.step(0.1, 50)")
            pills = t.ev("!document.querySelector('#speak .pills').classList.contains('hidden') && document.querySelectorAll('#speak .pill').length")
            parent = t.ev("!document.querySelector('#speak .parent-ok').classList.contains('hidden')")
            outcome = None
            if expect == "pills":
                if not pills or not parent:
                    if tempo == "drizzle" or t.state()["played"] == 0:
                        fails.append(f"{mode}/{tempo}: no pills or parent tick after a null")
                        continue
                t.shot(f"g3-{mode}-{tempo}-pills")
                # the parent's tick in Drizzle, a pill in Busy
                if tempo == "drizzle":
                    t.click_sel("#speak .parent-ok")
                else:
                    target = t.state()["wave"]["targets"][0]["cand"] if t.state()["wave"] else None
                    if target:
                        t.click_sel(f'#speak .pill[data-w="{target}"] .p-send')
            elif expect == "wrong pot":
                t.shot(f"g3-wrong-{tempo}")
            t.ev("__monsoon.step(0.1, 120)")
            outcome = t.state()["outcomes"][0] if t.state()["outcomes"] else None
            print(f"  g3 speech={mode:8} {tempo:8} first call -> {outcome}")
            if outcome is None:
                fails.append(f"{mode}/{tempo}: the call never finished")
    return fails


def run_bots(t, games, levels, n):
    """Browser bots through real taps == the Node bots, outcome by outcome."""
    names = {"g1": ["random", "wait", "spam", "odd", "near", "menu", "learner"], "g2": ["random", "lidnow", "fixed3", "wait", "spam"], "g3": []}
    fails = []
    for g in games:
        for lv in levels:
            for name in names.get(g, []):
                agree = 0
                stars = 0
                for i in range(n):
                    seed = 900 + i
                    t.ev("__monsoon.preset('known')")
                    t.start(g, lv, "busy", seed=seed)
                    done_waves = set()
                    for _ in range(3000):
                        st = t.state()
                        if st["phase"] == "result":
                            break
                        if st["phase"] == "wave" and st["wave"]["i"] not in done_waves:
                            done_waves.add(st["wave"]["i"])
                            plan = t.ev("([n]) => __monsoon.botPlan(n, 77)", [name])
                            for a in sorted(plan, key=lambda a: a["t"]):
                                t.advance_to(a["t"], step=0.05)
                                if t.now() > a["t"] + 1e-6:
                                    t.advance_to(a["t"])
                                if "pick" in a:
                                    w = t.ev("(c) => __monsoon.where(c)", a["pick"])
                                    t.page.mouse.click(w["x"], w["y"])
                        t.ev("__monsoon.step(0.05, 4)")
                    st = t.wait_phase("result")
                    browser = st["outcomes"]
                    t.ev("__monsoon.preset('known')")
                    node = t.ev("([o, n]) => __monsoon.nodeReplay(o, n, 77)", [{"game": g, "level": lv, "mode": "busy", "seed": seed}, name])
                    if browser == node:
                        agree += 1
                    else:
                        fails.append(f"{g} L{lv} {name} seed {seed}: browser {browser} != node {node}")
                    stars += 1 if st["result"]["stars"].get("ear") else 0
                print(f"  {g} L{lv} bot {name:8} agrees with Node on {agree}/{n} storms; ear stars {stars}/{n}")
    return fails


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--play", action="store_true")
    ap.add_argument("--paths", action="store_true")
    ap.add_argument("--bots", type=int, default=0)
    ap.add_argument("--viewport")
    ap.add_argument("--game")
    ap.add_argument("--level", type=int)
    ap.add_argument("--busy", action="store_true")
    ap.add_argument("--drizzle", action="store_true")
    ap.add_argument("--canvas", action="store_true")
    ap.add_argument("--virtual-clock", action="store_true")
    ap.add_argument("--no-shots", action="store_true")
    a = ap.parse_args()
    everything = not (a.play or a.paths or a.bots)
    games = [a.game] if a.game else ["g1", "g2", "g3"]
    levels = [a.level] if a.level else [1, 2, 3]
    modes = ["busy"] if a.busy else ["drizzle"] if a.drizzle else ["drizzle", "busy"]
    vps = [v for v in VIEWPORTS if not a.viewport or v["name"] == a.viewport]
    httpd = start_server()
    fails = []
    with sync_playwright() as pw:
        exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
        browser = pw.chromium.launch(executable_path=exe)
        for i, vp in enumerate(vps):
            ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
            page = ctx.new_page()
            t = Tester(page, vp)
            page.goto(f"http://127.0.0.1:{PORT}/monsoon.html?clock=virtual")
            page.wait_for_function("window.__monsoon && __monsoon.ready", timeout=20000)
            t.shot("lab")
            print(f"[{vp['name']} {vp['width']}x{vp['height']}]")
            try:
                if a.play or everything:
                    # the full matrix on the first size; one storm per game on the others
                    if i == 0 or a.viewport:
                        fails += run_play(t, games, levels, modes, shots=not a.no_shots)
                    else:
                        fails += run_play(t, games, [3], ["busy"], shots=not a.no_shots)
                if (a.paths or everything) and (i == 0 or a.viewport):
                    fails += run_paths(t)
                if (a.bots or everything) and (i == 0 or a.viewport):
                    fails += run_bots(t, [g for g in games if g != "g3"], levels, a.bots or 3)
            except Fail as e:
                fails.append(f"{vp['name']}: {e}")
            if t.errors:
                fails += [f"{vp['name']}: {e}" for e in t.errors[:5]]
            ctx.close()
        browser.close()
    httpd.shutdown()
    if fails:
        print("\nFAILED:")
        for f in fails:
            print("  " + f)
        sys.exit(1)
    print("\nall passed")


if __name__ == "__main__":
    main()
