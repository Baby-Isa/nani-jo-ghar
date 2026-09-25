#!/usr/bin/env python3
"""Play tests for Who did it? (who.html, the Case lab), phase 1.

The test_find.py / test_cook.py pattern: it plays through REAL pointer events
at screen coordinates, read from window.__who.expectation() (what the game
wants next), never calling the game's handlers. Before every tap it checks
that the element under the point is the thing meant (the tap-cover check).
The magnifier is dragged with a real mouse drag over every suspect's paws.

Each game and level plays two cases: the first with deliberate mistakes (a
wrong pick or a wrong commit, which must run the recast and cost the ear
star), the second clean (which must earn it when two or more clues were
tested). Tell Ali runs with the speech stub's bot (as if heard by voice: the
voice star), then with pills (never the voice star) and with a parent's tick.
Layout checks on every viewport: every standing suspect fully inside the
scene, the sidebar never over the scene, the magnifier inset never over a
suspect. Screenshots go to build/screenshots/who/<viewport>/.

The UI bot (--bot STRATEGY --rounds N) plays blind through the real UI (it
sees positions and who is standing, never the answer) and prints its ear-star
rate beside the logic bot's (node build/leak_who.mjs).

Usage:
  python3 build/test_who.py --lab                       # laptop, G1-G3 + G5, L1-2
  python3 build/test_who.py --lab --viewport all        # all six sizes
  python3 build/test_who.py --lab --game g3 --level 1
  python3 build/test_who.py --bot random --game g1 --level 1 --rounds 200
  COOK_TEST_PORT=8803 (default here) sets the port.
"""
import argparse
import functools
import http.server
import json
import os
import random
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("COOK_TEST_PORT", 8803))
SHOTS = os.path.join(ROOT, "build", "screenshots", "who")
CHROMIUM = "/opt/pw-browsers/chromium"

VIEWPORTS = [
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
]


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        pass


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def start_server():
    handler = functools.partial(Quiet, directory=ROOT)
    srv = Server(("127.0.0.1", PORT), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


class Fail(Exception):
    pass


def check(cond, msg):
    if not cond:
        raise Fail(msg)


class Player:
    def __init__(self, page, vp, log):
        self.page = page
        self.vp = vp
        self.log = log

    def exp(self):
        return self.page.evaluate("__who.expectation()")

    def wait_ui(self, want=None, timeout=30):
        t0 = time.time()
        while time.time() - t0 < timeout:
            e = self.exp()
            if e.get("ui") and (want is None or e["ui"] in want):
                return e
            time.sleep(0.05)
        raise Fail(f"timed out waiting for {want}; last {self.exp()}")

    def cover_ok(self, x, y, selector_js):
        """The tap-cover check: the element at (x, y) must be the one meant."""
        return self.page.evaluate(f"(() => {{ const el = document.elementFromPoint({x}, {y}); return !!el && ({selector_js}); }})()")

    def tap_suspect(self, i):
        p = self.page.evaluate(f"__who.point({i})")
        ok = self.cover_ok(p["x"], p["y"], f"(el.closest('.sus') && el.closest('.sus').dataset.i === '{i}')")
        check(ok, f"tap-cover: suspect {i} is covered at {p}")
        self.page.mouse.click(p["x"], p["y"])

    def tap(self, selector):
        box = self.page.locator(selector).first.bounding_box()
        check(box, f"{selector} not visible")
        x, y = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
        ok = self.cover_ok(x, y, f"(el.closest({json.dumps(selector)}) !== null)")
        check(ok, f"tap-cover: {selector} is covered")
        self.page.mouse.click(x, y)

    def peek_all(self, n):
        """Drag the magnifier over every suspect's paws with a real mouse drag."""
        lens = self.page.evaluate("__who.lens()")
        self.page.mouse.move(lens["x"], lens["y"])
        self.page.mouse.down()
        for i in range(n):
            h = self.page.evaluate(f"__who.hands({i})")
            self.page.mouse.move(h["x"], h["y"], steps=6)
        self.page.mouse.up()
        peeked = self.page.evaluate("__who.peeked()")
        check(len(peeked) >= 1, f"the magnifier peeked at nobody ({peeked})")
        return peeked

    def layout(self, shot):
        r = self.page.evaluate("__who.rects()")
        st = r["stage"]
        e = self.exp()
        for i, s in enumerate(r["suspects"]):
            if i in e["sat"]:
                continue
            check(s["top"] >= st["top"] - 1 and s["left"] >= st["left"] - 1 and s["right"] <= st["right"] + 1,
                  f"suspect {i} not fully inside the scene: {s} vs {st}")
        side = r["side"]
        if self.vp["width"] > self.vp["height"]:
            check(side["left"] >= st["right"] - 1, "the sidebar overlaps the scene")
        if "inset" in r:
            check(r["inset"]["top"] >= r["occluderY"] - 1, "the magnifier inset is over the line-up")
        if shot:
            os.makedirs(os.path.join(SHOTS, self.vp["name"]), exist_ok=True)
            self.page.screenshot(path=os.path.join(SHOTS, self.vp["name"], f"{shot}.png"))

    def play_case(self, mistakes, speech_mode="bot:auto", shot=None):
        """Play one case to the result card. Returns the stars."""
        e = self.wait_ui(["start"])
        self.tap("#who-start")
        made_mistake = False
        peeked = False
        shot_taken = False
        t_case = time.time()
        while True:
            check(time.time() - t_case < 120, f"the case never ended (last {self.exp()})")
            e = self.wait_ui(["pick", "commit", "accuse", "say", "result"])
            ui = e["ui"]
            if shot and not shot_taken and ui != "result":
                self.layout(shot)
                shot_taken = True
            if ui == "result":
                stars = e["stars"]
                if shot:
                    os.makedirs(os.path.join(SHOTS, self.vp["name"]), exist_ok=True)
                    self.page.screenshot(path=os.path.join(SHOTS, self.vp["name"], f"{shot}-result.png"))
                self.tap("#who-next")
                return stars, made_mistake
            if e.get("examine") and not peeked:
                self.peek_all(e["n"])
                peeked = True
            if ui == "pick":
                if mistakes and not made_mistake:
                    wrong = [i for i in range(e["n"]) if i != e["answer"]]
                    self.tap_suspect(random.choice(wrong))
                    made_mistake = True
                    # the recast runs, then the game asks again
                    e2 = self.wait_ui(["pick"])
                    check(e2["item"] == e["item"], "a wrong pick moved on")
                    continue
                self.tap_suspect(e["answer"])
            elif ui == "commit":
                answer = e["answer"]
                if mistakes and not made_mistake:
                    extra = [i for i in e["standing"] if i not in answer]
                    picks = answer + extra[:1] if extra else answer[:-1]
                    for i in picks:
                        self.tap_suspect(i)
                    self.tap("#who-done")
                    made_mistake = True
                    e2 = self.wait_ui(["commit"])
                    check(e2["row"] == e["row"], "a wrong commit moved on")
                    check(sorted(e2["standing"]) == sorted(e["standing"]), "a wrong commit sat someone down")
                    continue
                for i in answer:
                    self.tap_suspect(i)
                self.tap("#who-done")
                # the rest sit down
                t0 = time.time()
                while time.time() - t0 < 10:
                    e3 = self.exp()
                    if e3.get("row", -1) != e["row"] or e3["action"] != "commit":
                        break
                    time.sleep(0.05)
                check(sorted(self.exp()["standing"]) == sorted(answer), "the right commit didn't leave exactly who fits")
            elif ui == "accuse":
                self.tap_suspect(e["answer"])
            elif ui == "say":
                if speech_mode.startswith("bot:"):
                    time.sleep(0.1)
                    continue
                word = e["answer"][0]
                if mistakes and not made_mistake:
                    wrong = [w for w in e["tell"]["choices"] if w not in e["answer"]]
                    if wrong:
                        word = wrong[0]
                        made_mistake = True
                sel = f".tell-pill[data-word='{word}']"
                self.page.wait_for_selector(sel, timeout=5000)
                self.tap(sel)
                if speech_mode == "pills":
                    self.tap(sel)  # the first tap plays it, the second tells Ali
                self.page.wait_for_function("__who.expectation().ui !== 'say'", timeout=10000)


def open_lab(page, game, level, seed, speech="bot:auto", stage=2, speed=6, extra=""):
    page.goto(f"http://127.0.0.1:{PORT}/who.html?lab=1&closed=1&game={game}&level={level}&seed={seed}&speed={speed}&speech={speech}&stage={stage}{extra}")
    page.wait_for_function("window.__who && __who.ready()", timeout=15000)


def run_lab(pw, vps, games, levels, cases, story=True):
    browser = pw.chromium.launch(executable_path=CHROMIUM if os.path.exists(CHROMIUM) else None)
    failures = 0
    for vp in vps:
        ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        pl = Player(page, vp, print)
        for game in games:
            for level in levels:
                modes = ["bot:auto", "pills", "parent"] if game == "g5" else ["bot:auto"]
                for mode in modes:
                    name = f"{game}-L{level}" + ("" if mode == "bot:auto" else f"-{mode.replace(':', '')}")
                    try:
                        seed = 100 + level * 10 + len(name)
                        open_lab(page, game, level, seed, speech=mode)
                        for k in range(cases):
                            mistakes = k == 0
                            stars, made = pl.play_case(mistakes, mode, shot=name if k == 0 else None)
                            if game == "g5":
                                check(stars["ear"] == "untested", f"{name}: Tell Ali showed an ear star")
                                if mode == "pills":
                                    check(stars["voice"] is False, f"{name}: pills earned the voice star")
                                elif not made:
                                    check(stars["voice"] is True, f"{name}: a clean {mode} case missed the voice star ({stars})")
                            else:
                                if made:
                                    check(stars["ear"] is not True, f"{name}: a mistake still earned the ear star")
                                elif stars["tested"] >= 2:
                                    check(stars["ear"] is True, f"{name}: a clean case missed the ear star ({stars})")
                        check(not errors, f"page errors: {errors[:3]}")
                        print(f"  ok   {vp['name']:16} {name}")
                    except Fail as f:
                        failures += 1
                        print(f"  FAIL {vp['name']:16} {name}: {f}")
                        os.makedirs(os.path.join(SHOTS, vp["name"]), exist_ok=True)
                        page.screenshot(path=os.path.join(SHOTS, vp["name"], f"FAIL-{name}.png"))
                        errors.clear()
        if story:
            try:
                open_lab(page, "g1", 1, 77, extra="&case=a1c3-sweets")
                ids = page.evaluate("__who.expectation().n")
                pool = page.evaluate("Who.Flow.ctx.c.suspects.map(s => s.id).sort().join(',')")
                check(pool == "kasuku,simba,zazu", f"the Arc 1 Ch3 case has the wrong line-up: {pool}")
                stars, _ = pl.play_case(False, shot="story-a1c3")
                check(stars["ear"] is True, f"a clean story case missed the ear star ({stars})")
                print(f"  ok   {vp['name']:16} story a1c3-sweets")
            except Fail as f:
                failures += 1
                print(f"  FAIL {vp['name']:16} story a1c3-sweets: {f}")
        ctx.close()
    browser.close()
    return failures


def run_bot(pw, strategy, game, level, rounds):
    """Blind play through the real UI: positions and who is standing, never the answer."""
    browser = pw.chromium.launch(executable_path=CHROMIUM if os.path.exists(CHROMIUM) else None)
    page = browser.new_page(viewport={"width": 1366, "height": 768})
    open_lab(page, game, level, 5000, speed=20, extra="&mute=1")
    pl = Player(page, VIEWPORTS[0], print)
    rng = random.Random(7)
    wins = 0
    for r in range(rounds):
        pl.wait_ui(["start"])
        pl.tap("#who-start")
        while True:
            e = pl.wait_ui(["pick", "commit", "accuse", "result"])
            ui = e["ui"]
            standing = e["standing"]
            if ui == "result":
                if e["stars"]["ear"] is True:
                    wins += 1
                pl.tap("#who-next")
                break
            if ui in ("pick", "accuse"):
                pl.tap_suspect(rng.choice(standing))
                time.sleep(0.05)
                pl.page.wait_for_function("__who.expectation().ui === null || __who.expectation().ui === 'result'", timeout=10000)
            elif ui == "commit":
                if strategy == "half":
                    k = len(standing) // 2 if rng.random() < 0.5 else (len(standing) + 1) // 2
                    picks = rng.sample(standing, k)
                else:
                    picks = [i for i in standing if rng.random() < 0.5]
                for i in picks:
                    pl.tap_suspect(i)
                pl.tap("#who-done")
                pl.page.wait_for_function("__who.expectation().ui !== 'commit'", timeout=10000)
    browser.close()
    return wins / rounds


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", action="store_true")
    ap.add_argument("--viewport", default="laptop", help="a name, or 'all'")
    ap.add_argument("--game", default="g1,g2,g3,g5")
    ap.add_argument("--level", default="1,2")
    ap.add_argument("--cases", type=int, default=2)
    ap.add_argument("--bot", default=None, help="random | half")
    ap.add_argument("--rounds", type=int, default=200)
    a = ap.parse_args()
    srv = start_server()
    games = a.game.split(",")
    levels = [int(x) for x in a.level.split(",")]
    with sync_playwright() as pw:
        if a.bot:
            for g in games:
                for lv in levels:
                    rate = run_bot(pw, a.bot, g, lv, a.rounds)
                    print(f"UI bot {a.bot:6} {g} L{lv}: ear star {100 * rate:.1f}% over {a.rounds} rounds (compare node build/leak_who.mjs)")
            srv.shutdown()
            return 0
        vps = VIEWPORTS if a.viewport == "all" else [v for v in VIEWPORTS if v["name"] == a.viewport]
        fails = run_lab(pw, vps, games, levels, a.cases)
    srv.shutdown()
    print("RESULT:", "PASS" if not fails else f"FAIL ({fails})")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
