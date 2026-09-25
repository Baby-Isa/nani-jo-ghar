#!/usr/bin/env python3
"""End-to-end test for Find it (find.html), the first playable slice.

Same style as build/test_cook.py: it plays through REAL pointer events at
screen coordinates, read from window.__find.expectation() (what the game
wants next), and never calls the game's handlers. Before every tap it checks
that the thing tapped is the scene itself (nothing in the HTML layer covers
it). It makes deliberate mistakes: a wrong greeting, a wrong item on the
stall (the recast), a wrong item in the bag, and in one round one too many
(an over-count, graded at Done). On a zoomed phone it pans with a real drag.
It checks that a list never ends by itself (the round waits for Done) and
that every placed item records its relations. Screenshots go to
build/screenshots/find/<viewport>-<run>/.

The leak check (--leak N): the non-speaker bot (js/find/bot.js), which sees
only the screen and knows no Kutchi, plays N rounds of Nani's list + Check
the bag at each word stage (2: words shown as text; 3: dots) and levels 1-3.
It should earn the ear star in under 10% of rounds; the rate is printed.

Usage:
  python3 build/test_find.py                         # laptop and phone (915x375)
  python3 build/test_find.py --viewport laptop
  python3 build/test_find.py --leak 30               # the leak check (laptop)
  FIND_TEST_PORT=8980 (default) sets the port.
"""
import argparse
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
PORT = int(os.environ.get("FIND_TEST_PORT", 8980))

VIEWPORTS = [
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
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
    def __init__(self, page, shots):
        self.page = page
        self.shots = shots
        self.n = 0
        self.made = set()

    def shot(self, name):
        self.n += 1
        path = os.path.join(self.shots, f"{self.n:03d}-{name}.png")
        self.page.screenshot(path=path)
        return path

    def exp(self):
        return self.page.evaluate("__find.expectation()")

    def state(self):
        return self.page.evaluate("__find.state()")

    def uncovered(self, x, y, what):
        tag = self.page.evaluate(
            "([x,y]) => { const e = document.elementFromPoint(x,y); if (!e) return 'none'; return e.closest('#world') ? 'WORLD' : (e.tagName + '#' + e.id + '.' + e.className); }", [x, y]
        )
        if tag != "WORLD":
            raise AssertionError(f"{what} at ({x:.0f},{y:.0f}) is covered by {tag}")

    def tap(self, x, y, what="tap"):
        self.uncovered(x, y, what)
        self.page.mouse.click(x, y)

    def drag(self, x1, y1, x2, y2):
        self.uncovered(x1, y1, "pan")
        p = self.page
        p.mouse.move(x1, y1)
        p.mouse.down()
        for s in range(1, 9):
            p.mouse.move(x1 + (x2 - x1) * s / 8, y1 + (y2 - y1) * s / 8)
            time.sleep(0.01)
        p.mouse.up()

    def wait_change(self, prev, timeout=15):
        t0 = time.time()
        while time.time() - t0 < timeout:
            e = self.exp()
            if e != prev:
                return e
            time.sleep(0.05)
        return self.exp()

    def play(self, mistakes=True, overcount=False, timeout=240):
        """Play one round from its start to the result card."""
        t0 = time.time()
        last_kind = None
        idle = 0
        repeats = 0
        last_key = None
        checked_no_auto_end = False
        while True:
            if time.time() - t0 > timeout:
                self.shot("timeout")
                raise AssertionError("timed out playing")
            e = self.exp()
            if not e or e["kind"] == "wait":
                idle += 1
                if idle > 600:
                    self.shot("stuck")
                    raise AssertionError(f"no expectation for 60s (state {self.state()})")
                time.sleep(0.1)
                continue
            idle = 0
            k = e["kind"]
            key = json.dumps({a: e.get(a) for a in ("kind", "key", "selector", "sx", "sy")}, sort_keys=True)
            repeats = repeats + 1 if key == last_key else 0
            last_key = key
            if repeats > 10:
                self.shot("stuck")
                raise AssertionError(f"stuck repeating {key}")
            if k != last_kind and k != "pan":
                self.shot(k + ("-" + e["key"] if e.get("key") == "bag" else ""))
            last_kind = k
            if k == "click":
                if e.get("end"):
                    return
                sel = e["selector"]
                if sel == "#find-done":
                    st = self.state()
                    # a list never ends by itself: all counts are met, and it still waits for Done
                    if not checked_no_auto_end:
                        time.sleep(0.6)
                        st = self.state()
                        if st["phase"] != "search":
                            raise AssertionError(f"the list ended by itself: {st['phase']}")
                        checked_no_auto_end = True
                    if overcount and "over" not in self.made and e.get("sextra"):
                        self.made.add("over")
                        x = e["sextra"]
                        self.tap(x["x"], x["y"], "one too many")
                        time.sleep(0.5)
                        self.shot("one-too-many")
                    self.shot("all-found")
                if mistakes and e.get("wrong") and "click-wrong" not in self.made and self.page.query_selector(e["wrong"]):
                    self.made.add("click-wrong")
                    self.page.click(e["wrong"])
                    time.sleep(0.5)
                    self.shot("wrong-greeting")
                self.page.wait_for_selector(sel, state="visible", timeout=10000)
                self.page.click(sel)
            elif k == "pan":
                self.drag(e["sx1"], e["sy1"], e["sx2"], e["sy2"])
                time.sleep(0.2)
                if "pan" not in self.made:
                    self.made.add("pan")
                    self.shot("panned")
            elif k == "tap":
                tag = "bag" if e.get("key") == "bag" else "stall"
                if mistakes and e.get("swrongs") and f"wrong-{tag}" not in self.made:
                    self.made.add(f"wrong-{tag}")
                    w = random.choice(e["swrongs"])
                    self.tap(w["x"], w["y"], f"wrong {tag} item")
                    time.sleep(0.35)
                    self.shot(f"wrong-{tag}-recast")
                    time.sleep(0.4)
                    e = self.exp()
                    if not e or e.get("kind") != "tap":
                        continue
                self.tap(e["sx"], e["sy"], e.get("key", "item"))
                if tag == "bag":
                    time.sleep(0.3)
                    self.shot("bag-fixed")
                self.wait_change(e, timeout=4)


def open_page(pw, vp, speed, save=None):
    browser = pw.chromium.launch(
        executable_path="/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None,
        args=["--autoplay-policy=no-user-gesture-required"],
    )
    ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
    page = ctx.new_page()
    page.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    page.route("**/fonts.gstatic.com/**", lambda r: r.abort())
    errors = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(f"http://127.0.0.1:{PORT}/find.html?speed={speed}")
    if save is not None:
        page.evaluate("(s) => localStorage.setItem('njg-cook-v1', JSON.stringify(s))", save)
    else:
        page.evaluate("localStorage.clear()")
    page.goto(f"http://127.0.0.1:{PORT}/find.html?speed={speed}")
    page.wait_for_selector("#panel h1", timeout=15000)
    return browser, page, errors


def shots_dir(root, name):
    d = os.path.join(root, name)
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        os.remove(os.path.join(d, f))
    return d


def bad_errors(errors):
    return [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]


def check_relations(page):
    rel = page.evaluate("__find.relations()")
    if not rel:
        raise AssertionError("no items placed")
    for it in rel:
        if not it["rel"] or not it["spot"]:
            raise AssertionError(f"an item without relations: {it}")
    spots = [it["spot"] for it in rel]
    if len(spots) != len(set(spots)):
        raise AssertionError("two items in one hide spot")
    return rel


def run_play(vp, speed, shots_root):
    """The story round (greeting, list, Done, bag) with deliberate mistakes,
    then lab rounds at levels 2 and 3 (one of them over-counts)."""
    shots = shots_dir(shots_root, vp["name"] + "-play")
    out = []
    with sync_playwright() as pw:
        browser, page, errors = open_page(pw, vp, speed)
        P = Player(page, shots)
        P.shot("title")
        page.click("#t-start")
        page.wait_for_function("__find.state().items > 0", timeout=15000)
        time.sleep(0.4)
        rel = check_relations(page)
        P.play(mistakes=True)
        st = P.state()
        card = st["cards"][-1]
        P.shot("story-result")
        if card["stars"]["ear"]:
            # the deliberate wrong item on the stall costs the ear star only on a tested word; the bag's always counts
            print(f"  note: ear star kept (stage-1 words are taught, not tested): {card['reasons']}")
        out.append(("story", card))
        print(f"  {vp['name']}: story round: stars {card['stars']}, coins {card['coins']}, reasons {card['reasons'][:3]}, items {len(rel)}")
        for level, over in ((2, True), (3, False)):
            P.made = set()
            page.evaluate(f"__find.lab('list', {{level: {level}, stage: 2}})")
            page.wait_for_function("__find.state().items > 0 && !__find.state().panel", timeout=15000)
            time.sleep(0.3)
            check_relations(page)
            P.shot(f"level{level}-start")
            P.play(mistakes=not over, overcount=over)
            card = P.state()["cards"][-1]
            P.shot(f"level{level}-result")
            if over and card["stars"]["ear"]:
                raise AssertionError("one too many should cost the ear star")
            if not over and card["stars"]["ear"]:
                raise AssertionError("a wrong tap on a tested word should cost the ear star")
            print(f"  {vp['name']}: lab level {level}{' (one too many)' if over else ''}: stars {card['stars']}, reasons {card['reasons'][:3]}")
            out.append((f"level{level}", card))
        # a clean round: no mistakes, all three stars possible
        P.made = set()
        page.evaluate("__find.lab('list', {level: 1, stage: 2})")
        page.wait_for_function("__find.state().items > 0 && !__find.state().panel", timeout=15000)
        P.play(mistakes=False)
        card = P.state()["cards"][-1]
        P.shot("clean-result")
        if not card["stars"]["ear"]:
            raise AssertionError(f"a clean round lost the ear star: {card['reasons']}")
        print(f"  {vp['name']}: clean level 1: stars {card['stars']}")
        browser.close()
    bad = bad_errors(errors)
    if bad:
        raise AssertionError(f"console errors: {bad[:5]}")
    return P.n


def run_leak(vp, speed, n, shots_root):
    """The non-speaker bot plays n rounds per (word stage, level)."""
    shots = shots_dir(shots_root, vp["name"] + "-leak")
    results = {}
    with sync_playwright() as pw:
        browser, page, errors = open_page(pw, vp, speed)
        page.evaluate("document.querySelector('#t-lab').click()")
        for stage in (2, 3):
            for level in (1, 2, 3):
                res = page.evaluate(f"__find.leak({n}, {{level: {level}, stage: {stage}}})")
                results[(stage, level)] = res
                page.screenshot(path=os.path.join(shots, f"stage{stage}-level{level}.png"))
                by = ", ".join(f"{k} {v['ear']}/{v['n']}" for k, v in res["by"].items())
                print(f"  stage {stage} level {level}: bot earned the ear star in {res['ear']}/{res['n']} rounds ({res['rate'] * 100:.0f}%) [{by}]", flush=True)
                for r in res["rows"]:
                    if r["ear"]:
                        print(f"      won ({r['strategy']}): asked {r['asked']} picked {r['picks']} bag {r['bag']}")
        browser.close()
    tot = sum(r["n"] for r in results.values())
    ear = sum(r["ear"] for r in results.values())
    print(f"LEAK: the non-speaker bot earned the ear star in {ear}/{tot} rounds ({100 * ear / max(1, tot):.1f}%); it failed it in {100 * (tot - ear) / max(1, tot):.1f}%")
    for stage in (2, 3):
        t = sum(results[(stage, l)]["n"] for l in (1, 2, 3))
        e = sum(results[(stage, l)]["ear"] for l in (1, 2, 3))
        print(f"LEAK: word stage {stage}: {e}/{t} ({100 * e / max(1, t):.1f}%)")
    bad = bad_errors(errors)
    if bad:
        raise AssertionError(f"console errors: {bad[:5]}")
    if ear / max(1, tot) >= 0.5:
        raise AssertionError("the bot earned the ear star in half the rounds or more: the screen gives the answer away")
    return tot


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--viewport")
    ap.add_argument("--speed", type=float, default=3)
    ap.add_argument("--leak", type=int, default=0, metavar="N", help="the non-speaker bot plays N rounds per word stage and level")
    ap.add_argument("--shots", default=os.path.join(ROOT, "build", "screenshots", "find"))
    args = ap.parse_args()
    random.seed(11)
    httpd = start_server()
    if args.viewport:
        vps = [v for v in VIEWPORTS if v["name"] == args.viewport]
    elif args.leak:
        vps = [VIEWPORTS[0]]
    else:
        vps = VIEWPORTS[:2]
    failed = []
    for vp in vps:
        t0 = time.time()
        try:
            if args.leak:
                n = run_leak(vp, max(args.speed, 8), args.leak, args.shots)
                print(f"PASS {vp['name']} leak: {n} bot rounds, {time.time() - t0:.0f}s", flush=True)
            else:
                n = run_play(vp, args.speed, args.shots)
                print(f"PASS {vp['name']}: {n} screenshots, {time.time() - t0:.0f}s", flush=True)
        except Exception as ex:
            print(f"FAIL {vp['name']}: {ex}", flush=True)
            failed.append(vp["name"])
    httpd.shutdown()
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
