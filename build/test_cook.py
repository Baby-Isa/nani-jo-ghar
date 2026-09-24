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
  python3 build/test_cook.py --lab --level 2        # every station at difficulty level 2
  python3 build/test_cook.py --lab --zoned          # every mechanic inside a smaller zone
  python3 build/test_cook.py --orders               # the recipe slot model (no playing)
  python3 build/test_cook.py --example              # the guide's data-only recipe, played in the lab
  add --busy for the Busy setting, --speed N to change test speed (default 3)
  add --canvas to run Phaser's canvas renderer: headless Chromium draws WebGL in
  software at 6-11 fps here, and every pointer event waits for a frame, so a
  --days 7 run takes ~40 min on WebGL and a fraction of that on canvas (60 fps).
  Tints don't show on canvas; keep WebGL (the default) for the station runs.
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
# COOK_TEST_PORT lets several test runs (or worktrees) go at once
PORT = int(os.environ.get("COOK_TEST_PORT", 8942))
LAB = ["fetch", "passme", "pour", "boil", "count", "knead", "roll", "flip", "chop", "tadka", "stir", "assemble", "fill", "fry", "thread", "grill", "roll-tawa"]
# --zoned: run each mechanic inside this rectangle (world px) instead of the whole screen
# COOK_TEST_DEBUG=1 prints where the player waited a long time for the game
DEBUG = bool(os.environ.get("COOK_TEST_DEBUG"))
ZONE = {"x": 200, "y": 100, "w": 1200, "h": 700}

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
                cur = self.exp()
                if not cur or cur.get("kind") != "roll":
                    break  # another zone (a tawa ring) needs a tap first
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
            # the pot finishes after a quiet moment (stir quietMs / speed); the
            # expectation's live lap count changes at once, so wait for the
            # station itself, or a fast renderer stirs again and resets it
            t0 = time.time()
            while time.time() - t0 < 3:
                cur = self.exp()
                if not cur or cur.get("kind") != "stir":
                    break
                time.sleep(0.05)
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
                t1 = time.time()
                self.wait_change(e, timeout=25)
                if DEBUG and time.time() - t1 > 3:
                    print(f"    slow: {time.time() - t1:.1f}s after {key}", flush=True)


CANVAS = False


def open_page(pw, vp, speed, busy):
    args = ["--autoplay-policy=no-user-gesture-required"] + (["--disable-webgl"] if CANVAS else [])
    browser = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None, args=args)
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


EXAMPLE = "data/examples/chips-mayai.json"


def run_lab(vp, speed, busy, shots_root, stations, guided, level=1, zoned=False, example=False):
    name = vp["name"] + "-lab" + ("-busy" if busy else "") + (f"-level{level}" if level != 1 else "") + ("-zoned" if zoned else "") + ("-example" if example else "")
    opts = json.dumps({"level": level, **({"region": ZONE} if zoned else {})})
    shots = shots_dir(shots_root, name)
    with sync_playwright() as pw:
        browser, page, errors = open_page(pw, vp, speed, busy)
        P = Player(page, shots, speed)
        results = {}
        if example:
            # a recipe that exists only as data (the recipes guide's worked example)
            page.evaluate("""async (url) => {
              const ex = await (await fetch(url)).json();
              Object.assign(Cook.data.words, ex.words);
              Cook.Recipes.add("chips-mayai", ex.recipe);
            }""", EXAMPLE)
            stations = ["recipe:chips-mayai"]
        for key in stations:
            page.evaluate(f"() => {{ __cook.lab('{key}', {'true' if guided else 'false'}, {opts}); }}")
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


ORDERS_JS = r"""
() => {
  const R = Cook.Recipes;
  const out = { errors: [] };
  // a recipe that uses every slot type: per-person cups, a tally, a
  // sequence then an any-order group, and a "no" list
  R.add("test-order", {
    name: "cook-chai", english: "Test order", price: 0, stations: [],
    slots: {
      cups: { type: "people", who: ["nana", "ma", "cousin"], count: 2, tastes: "chai", each: { khun: { int: [1, 3], taste: "khun" }, dudh: { chance: 0.5, taste: "dudh" } } },
      skewers: { type: "tally", kinds: ["ph-meat", "ph-pepper"], total: { int: [2, 3] }, min: { "ph-meat": 1 } },
      base: { type: "items", first: ["ph-chana"], from: ["ph-dahi", "ph-amli"], take: [1, 1], order: "sequence" },
      tops: { type: "items", from: ["ph-sev", "ph-dhana", "veg-02"], take: [2, 2], order: "any" },
      no: { type: "no", else: { chance: 1, from: ["veg-12"] } },
    },
    say: [
      { frame: "order", x: ["cook-chai"] },
      { forEach: "$cups", for: "$it.who", say: [{ frame: "and", x: [{ n: "$it.khun", of: "cook-khun" }] }, { if: "!it.dudh", frame: "no", x: ["cook-dudh"] }] },
      { tally: "$skewers", frame: "and" },
      { list: ["$base", "$tops"] },
      { forEach: "$no", frame: "no", x: ["$it"] },
    ],
    need: [], steps: [], run: [],
  });
  for (let n = 0; n < 200; n++) {
    const d = R["test-order"].make("nana");
    const rows = R["test-order"].ladder(d, 0);
    const lines = R["test-order"].lines(d, 0);
    const err = (m) => out.errors.length < 10 && out.errors.push(m + " " + JSON.stringify({ d, rows: rows.map((r) => [r.kind, r.ids, r.qty, r.dot, r.group, r.for]) }));
    if (d.cups.length !== 2 || d.cups[0].who !== "nana") err("people: the customer first, two people");
    d.cups.forEach((c) => c.khun !== Cook.data.customers[c.who].tastes.chai.khun && err("people: each person's own taste"));
    const tot = Object.values(d.skewers).reduce((a, b) => a + b, 0);
    if (tot < 2 || tot > 3 || d.skewers["ph-meat"] < 1) err("tally: total and min");
    const forRows = rows.filter((r) => r.for);
    if (!["nana", "ma", "cousin"].includes(forRows[0] && forRows[0].for)) err("ladder: per-person rows say who for");
    const seq = rows.filter((r) => r.group === "seq");
    const any = rows.filter((r) => r.kind === "item" && r.group === "any" && ["ph-sev", "ph-dhana", "veg-02"].includes(r.ids[0]) && r.qty === 1);
    if (seq.length !== 2 || seq[0].dot === seq[1].dot) err("ladder: sequence items each get a dot");
    if (any.length !== 2 || any[0].dot !== any[1].dot || any[0].dot <= seq[1].dot) err("ladder: an any-order group shares the next dot");
    if (!rows.some((r) => r.kind === "no" && r.dot === null && r.ids[0] === "veg-12")) err("ladder: no rows have no dot");
    if (rows.some((r) => !r.line || !r.line.segs)) err("ladder: every row has its line");
    if (lines.length < 5) err("lines");
  }
  // every real recipe: ladder rows cover what's said
  Object.keys(Cook.data.recipes).filter((id) => id !== "test-order").forEach((id) => {
    for (let n = 0; n < 50; n++) {
      const d = R[id].make(["nana", "ma", "cousin"][n % 3]);
      const rows = R[id].ladder(d, n % 2);
      if (!rows.length || rows[0].kind !== "dish" || rows[0].dot !== 1) out.errors.push(id + ": first row is the dish, dot 1");
      // the mission card's ladder (js/cook/order.js) is built from those same rows
      const L = Cook.Order.ladder(d, n % 2);
      const cardRows = Cook.Order.rows(L, { all: true });
      if (!L.head || cardRows.length !== rows.length) out.errors.push(id + ": the card ladder has every recipe row " + JSON.stringify([cardRows.length, rows.length]));
      const said = Cook.Lang.plain(Cook.Order.speech([L]));
      const seqs = L.sections.filter((s) => s.seq && !s.when);
      const then = Cook.data.lines[Cook.Lang.frames().seq].k.split("{x}")[0].trim();
      if (seqs.length && !said.includes(then)) out.errors.push(id + ": a sequence is said with " + then + ": " + said);
      if (!seqs.length && said.includes(then)) out.errors.push(id + ": no sequence, no " + then + ": " + said);
    }
  });
  const d = R.chaat.make("nana");
  out.example = R.ladder({ who: "nana", dishes: [d] }).map((r) => [r.dish, r.kind, r.ids.join("+"), r.qty, r.dot, r.group, Cook.Lang.plain(r.line)]);
  out.said = Cook.Lang.plain(Cook.Order.speech([Cook.Order.ladder(d, 0)]));
  delete Cook.data.recipes["test-order"];
  delete R["test-order"];
  return out;
}
"""


def run_orders(vp, speed):
    with sync_playwright() as pw:
        browser, page, errors = open_page(pw, vp, speed, False)
        res = page.evaluate(ORDERS_JS)
        browser.close()
    for row in res["example"]:
        print("  ladder:", row)
    print("  said:", res["said"])
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if res["errors"] or bad:
        raise AssertionError(f"order model: {res['errors'][:3]} console: {bad[:3]}")
    return 0


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
    ap.add_argument("--level", type=int, default=1)
    ap.add_argument("--zoned", action="store_true")
    ap.add_argument("--orders", action="store_true")
    ap.add_argument("--example", action="store_true")
    ap.add_argument("--canvas", action="store_true")
    ap.add_argument("--shots", default=os.path.join(ROOT, "build", "screenshots", "cook"))
    args = ap.parse_args()
    global CANVAS
    CANVAS = args.canvas
    random.seed(7)
    httpd = start_server()
    vps = VIEWPORTS
    if args.viewport:
        vps = [v for v in VIEWPORTS if v["name"] == args.viewport]
    elif args.lab or args.orders or args.example:
        vps = [VIEWPORTS[1]]
    failed = []
    for vp in vps:
        t0 = time.time()
        try:
            if args.orders:
                n = run_orders(vp, args.speed)
            elif args.lab or args.example:
                n = run_lab(vp, args.speed, args.busy, args.shots, args.stations.split(","), not args.unguided, args.level, args.zoned, args.example)
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
