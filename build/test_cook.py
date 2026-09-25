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

Wave 5: every order first comes up as the intro card in the middle (the
expectation says `intro`); the player pictures it and taps it into the
sidebar. Once a run it opens the "?" (the goal pops out) and ↻ (the order
big again). After the intro card and at each new view it checks the
sidebar never scrolls sideways or pushes a word out, and reports any
vertical scrolling as SIDEBAR lines.

Usage:
  python3 build/test_cook.py --lab                  # every station in the Station lab (laptop)
  python3 build/test_cook.py --lab --viewport flip5-landscape
  python3 build/test_cook.py --days 2               # story days, all viewports
  python3 build/test_cook.py --viewport laptop --days 7   # all six days + free cooking
  python3 build/test_cook.py --lab --level 2        # every station at difficulty level 2
  python3 build/test_cook.py --lab --zoned          # every mechanic inside a smaller zone
  python3 build/test_cook.py --orders               # the recipe slot model (no playing)
  python3 build/test_cook.py --example              # the guide's data-only recipe, played in the lab
  python3 build/test_cook.py --open-kitchen 2        # free cooking: serve 2 customers, then close the kitchen
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
LAB = ["fetch", "passme", "pour", "boil", "count", "knead", "roll", "flip", "chop", "tadka", "stir", "assemble", "fill", "fry", "thread", "grill", "roll-tawa", "mishkaki-grill", "chai-tray", "maani-line"]
# stations that cook a whole order on one screen (several maani, each rolled and cooked) take longer
LONG = {"maani-line": 600}
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
        self.t_exp = time.time()
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

    def check_side(self, where):
        """The sidebar must never scroll sideways or clip a word (Wave 5)."""
        bad = self.page.evaluate(
            """() => {
              const side = document.querySelector('#side');
              const out = [];
              if (side.scrollWidth > side.clientWidth + 1) out.push('sidebar scrolls sideways (' + side.scrollWidth + ' > ' + side.clientWidth + ')');
              const r = side.getBoundingClientRect();
              side.querySelectorAll('.wp-text, .m-name, .lr-en, .nc-face, button').forEach((el) => {
                const b = el.getBoundingClientRect();
                if (b.width && (b.right > r.right + 1 || b.left < r.left - 1)) out.push((el.className || el.tagName) + ' pokes out of the sidebar');
              });
              if (side.scrollHeight > side.clientHeight + 1) out.push('sidebar scrolls (' + side.scrollHeight + ' > ' + side.clientHeight + ')');
              return out.slice(0, 3);
            }"""
        )
        if bad:
            self.side_warnings = getattr(self, "side_warnings", [])
            self.side_warnings.append(f"{where}: {'; '.join(bad)}")

    def intro(self, e):
        """The intro order card: picture it, then tap it into the sidebar (it also goes on its own)."""
        self.intros = getattr(self, "intros", 0) + 1
        time.sleep(0.12)
        if self.intros <= 3:
            self.shot("intro-card")
        time.sleep(0.4)
        if self.page.query_selector("#intro:not(.hidden) .ic-card"):
            try:
                self.page.click("#intro .ic-card", force=True, timeout=2000)
            except Exception:
                pass  # it flew in by itself
        time.sleep(0.6)
        self.check_side("after the intro card")
        if self.intros <= 3:
            self.shot("order-card")

    def try_help(self):
        """Once per run: open the "?" (the goal pops out), picture it, close it;
        then ↻ on the order card once (the order big again)."""
        if getattr(self, "helped", False) or not self.page.query_selector("#btn-help"):
            return
        self.helped = True
        self.page.click("#btn-help", force=True)
        time.sleep(0.3)
        if not self.page.query_selector("#help-pop:not(.hidden)"):
            raise AssertionError("the ? didn't pop the goal out")
        self.shot("help-open")
        self.page.click("#btn-help", force=True)
        time.sleep(0.2)
        if self.page.query_selector("#help-pop:not(.hidden)"):
            raise AssertionError("the ? didn't close the goal again")
        if self.page.query_selector("#mission:not(.hidden):not(.stamped) .m-replay"):
            self.page.click("#mission .m-replay")
            time.sleep(0.3)
            e = self.exp()
            if e and e.get("intro"):
                self.shot("replay-card")
                try:
                    self.page.click("#intro .ic-card", force=True, timeout=2000)
                except Exception:
                    pass  # it flew back by itself
                time.sleep(0.8)

    def act(self, e):
        k = e["kind"]
        p = self.page
        if k == "wait":
            time.sleep(0.05)
            return
        if e.get("intro"):
            self.intro(e)
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
            # "mistake": the station asks for one wrong tap here (the Chai tray's salt in the lab)
            if self.mistakes and e.get("swrongs") and e.get("key") not in self.made and (e.get("mistake") or random.random() < 0.2):
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
                if cur and (cur.get("x"), cur.get("y")) != (e.get("x"), e.get("y")):
                    return  # another ring (a second tawa) is further on: that one first
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
            elif self.mistakes and e.get("extra") and "more-extra" not in self.made and random.random() < 0.5:
                # a deliberate mistake: one more than they asked for (the Maani line)
                self.made.add("more-extra")
                self.tap(e["sx"], e["sy"], "one too many")
            else:
                p.click("#done-btn")
        elif k == "knead":
            for _ in range(10):
                self.tap(e["sx"], e["sy"], "knead")
                time.sleep(0.1)
                if self.exp() != e:
                    break
        elif k == "roll":
            # hold the pin and roll back and forth (letting go for a moment
            # ends the roll where it is: with two circles, at the small one)
            cx, cy, r = e["sx"], e["sy"], e["sr"]
            y = cy + r * 0.7
            p.mouse.move(cx, y)
            p.mouse.down()
            sign = -1
            for _ in range(20):
                g = self.gauge()
                if g and g["level"] >= 0.95:
                    break
                cur = self.exp()
                if not cur or cur.get("kind") != "roll":
                    break  # another zone (a tawa ring) needs a tap first
                # a full stroke grows it ~0.2-0.3 of the circle; shorter strokes near the line
                f = min(1.0, max(0.15, (1.0 - (g["level"] if g else 0)) / 0.3))
                n = max(2, round(8 * f))
                y0 = y
                for s in range(1, n + 1):
                    y = y0 + sign * (r * 1.4 * f) * s / n
                    p.mouse.move(cx, y)
                sign = -sign
            p.mouse.up()
            time.sleep(0.5)
        elif k in ("swipe", "slice"):
            if k == "slice" and self.mistakes and e.get("swrongs") and "slice-wrong" not in self.made:
                # one deliberate wrong slice (a decoy in flight): the warm-failure path
                self.made.add("slice-wrong")
                w = e["swrongs"][0]
                p.mouse.move(w["x"] - 60, w["y"] - 20)
                p.mouse.down()
                for s in range(1, 5):
                    p.mouse.move(w["x"] - 60 + 120 * s / 4, w["y"] - 20 + 40 * s / 4)
                p.mouse.up()
                return
            p.mouse.move(e["sx1"], e["sy1"])
            p.mouse.down()
            steps = 1 if k == "slice" else 10
            for s in range(1, steps + 1):
                p.mouse.move(e["sx1"] + (e["sx2"] - e["sx1"]) * s / steps, e["sy1"] + (e["sy2"] - e["sy1"]) * s / steps)
                if k == "swipe":
                    time.sleep(0.01)
            if k == "slice":
                # the chop aims where a vegetable will be when the cut lands: tell it how long
                # our swipes take (the software renderer makes each mouse event slow)
                lat = time.time() - self.t_exp
                old = getattr(self, "lead", 0.25)
                self.lead = old * 0.6 + lat * 0.4
                if abs(self.lead - old) > 0.05:
                    p.evaluate(f"() => {{ window.__cookSwipeLead = {self.lead:.3f}; }}")
            p.mouse.up()
        elif k == "stir":
            self.stir(e)
        else:
            raise AssertionError(f"unknown expectation {k}")

    # stir speeds in real laps per second (the dial's fixed bands are
    # 0.12 | 0.9 | 2.2: stopped | tortoise | hare | spilling; not scaled by game speed)
    STIR = {"slow": 0.45, "quick": 1.4, None: 0.7, "spill": 3.4}

    def stir(self, e):
        """Drag the ladle round its track, at the speed the expectation asks
        for (it can change mid-stir), and let go at the target count. The
        first stir of a run makes the deliberate mistakes: the wrong speed
        until Nani says it, then a burst way too fast (it spills)."""
        p = self.page
        cx, cy, r, target = e["sx"], e["sy"], e["srx"], e["target"]
        mistake = self.mistakes and "stir" not in self.made
        if mistake:
            self.made.add("stir")
        speed = e.get("speed")
        a = 0.0
        p.mouse.move(cx + r, cy)
        p.mouse.down()
        t0 = time.time()
        anchor_t, anchor_a = t0, 0.0
        cur_want = None
        count = e.get("count", 0)
        log = []
        while count < target and time.time() - t0 < 90:
            now = time.time()
            want = self.STIR[speed]
            wiggle = mistake and now - t0 < 1.2
            if mistake and not wiggle and speed and count < target - 1 and now - t0 < 3.8:
                want = self.STIR["quick" if speed == "slow" else "slow"]
            if wiggle:
                # slosh back and forth way too fast: it spills, but it isn't a lap
                a = 0.9 * math.sin(2 * math.pi * 5 * (now - t0))
                anchor_t, anchor_a, cur_want = now, a, None
            else:
                if want != cur_want:
                    cur_want, anchor_t, anchor_a = want, now, a
                goal = anchor_a + 2 * math.pi * want * (now - anchor_t)
                a += min(goal - a, 1.2)  # never a jump (the game ignores those)
            p.mouse.move(cx + r * math.cos(a), cy + r * math.sin(a))
            cur = self.exp()
            if not cur or cur.get("kind") != "stir":
                break
            if cur.get("count", count) >= 1 > count:
                self.shot("stir-mid")  # the swirl, the dial and the tally while stirring
            count = cur.get("count", count)
            speed = cur.get("speed")
            if DEBUG:
                log.append((round(now - t0, 2), round(want, 2), round(self.page.evaluate("Cook.stirSpeed ? Cook.stirSpeed() : -1"), 2), count))
            time.sleep(0.005)
        p.mouse.up()
        if DEBUG:
            print("    stir:", log[:: max(1, len(log) // 25)], flush=True)
        # the pot finishes after a quiet moment (stir quietMs / speed): wait
        # for the station itself, or a fast renderer stirs again and resets it
        t0 = time.time()
        while time.time() - t0 < 5:
            cur = self.exp()
            if not cur or cur.get("kind") != "stir":
                break
            time.sleep(0.05)

    def play(self, until, timeout=900, close_kitchen_after=None):
        t0 = time.time()
        last_kind = None
        last_view = None
        idle = 0
        closed = False
        while not until():
            if time.time() - t0 > timeout:
                self.shot("timeout")
                raise AssertionError("timed out playing")
            # open kitchen (free cooking): close it ourselves once enough
            # customers have been served, instead of waiting forever
            if close_kitchen_after is not None and not closed:
                try:
                    served = self.page.evaluate("__cook.state().dayCards")
                except Exception:
                    served = 0
                if served >= close_kitchen_after and self.page.query_selector("#close-kitchen:not([disabled])"):
                    self.shot("close-kitchen")
                    self.page.click("#close-kitchen")
                    closed = True
                    time.sleep(0.2)
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
                self.check_side(f"view {view}")
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
            if e["kind"] == "tap" and not getattr(self, "helped", False) and not self.page.evaluate("Cook.save.mode === 'busy'"):
                self.try_help()
                continue
            if e.get("intro"):
                last_kind = "intro"
                self.act(e)
                self.wait_change(e, timeout=10)
                continue
            if not timed and e["kind"] != "wait" and e["kind"] != last_kind:
                self.shot(e["kind"])
            shoot_after = timed and e["kind"] != last_kind
            if e["kind"] == "slice":
                # the chop round is timed and busy: a couple of pictures, not one per slice
                self.slice_shots = getattr(self, "slice_shots", 0) + 1
                shoot_after = shoot_after and self.slice_shots % 6 == 2
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


def report_side(P):
    for w in getattr(P, "side_warnings", [])[:12]:
        print("  SIDEBAR:", w)


def open_kitchen_save(mode="relaxed"):
    """A save with the story finished, so the title screen offers 'Free
    cooking' (the open kitchen) right away, without playing six days first."""
    recipes = ["chai", "maani", "daal", "chaat", "samosa", "mishkaki"]
    return {
        "v": 1,
        "mode": mode,
        "coins": 40,
        "day": 7,
        "best": {"1": 3, "2": 3, "3": 3, "4": 3, "5": 3, "6": 3},
        "owned": [],
        "slots": [],
        "words": {},
        "taught": {r: True for r in recipes},
        "finished": True,
        "freeRounds": 0,
        "rulesSeen": True,
        "playDays": [],
    }


def open_page(pw, vp, speed, busy, seed_save=None):
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
    if seed_save is not None:
        page.evaluate("(save) => localStorage.setItem('njg-cook-v1', JSON.stringify(save))", seed_save)
    else:
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
            P.play(lambda: page.evaluate("!!document.querySelector('#lab-list') && !document.querySelector('#overlay').classList.contains('hidden')"), timeout=LONG.get(key, 300))
            P.shot(f"{key}-result")
            results[key] = page.evaluate("document.querySelector('#panel .cc-why') ? document.querySelector('#panel .cc-why').innerText : ''")
            print(f"  {name}: {key}: {results[key]!r}")
        browser.close()
    report_side(P)
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
  // byLevel values: the order's level picks one (chai's cups, mishkaki's skewers).
  // Level 1 is gentle on the hand but already varied for the ear (the owner's Wave 3 note).
  const seen = { extra: new Set(), skew: new Set(), chopN: new Set() };
  [1, 2, 3].forEach((level) => {
    for (let n = 0; n < 30; n++) {
      if (R.chai) {
        const c = R.chai.make("nana", { level });
        const want = [2, 3, 3][level - 1];
        if (c.cups.length !== want) out.errors.push("byLevel: chai level " + level + " has " + c.cups.length + " cups");
        if (level < 3 && c.cups.some((p) => p.amount)) out.errors.push("byLevel: chai half/full before level 3");
        if (level === 1) c.cups.forEach((p) => seen.extra.add(p.extra || "plain"));
      }
      if (R.mishkaki) {
        const m = R.mishkaki.make("nana", { level });
        const tot = Object.values(m.skewers).reduce((a, b) => a + b, 0);
        const ok = level === 1 ? tot === 2 : level === 2 ? tot >= 2 && tot <= 3 : tot >= 3 && tot <= 4;
        if (!ok || (m.skewers["ph-mixed"] || 0) > [0, 1, 2][level - 1]) out.errors.push("byLevel: mishkaki level " + level + " " + JSON.stringify(m.skewers));
        if (level === 1) seen.skew.add(JSON.stringify(m.skewers));
      }
      if (R.daal && level === 1) {
        const dd = R.daal.make("nana", { level });
        seen.chopN.add([dd.onions, dd.tomatoes, dd.chillies].filter(Boolean).length);
      }
    }
  });
  if (R.chai && seen.extra.size < 3) out.errors.push("level 1 chai: plain, elchi and aadu should all come up: " + [...seen.extra]);
  if (R.mishkaki && seen.skew.size < 2) out.errors.push("level 1 mishkaki: the skewer kinds should vary: " + [...seen.skew]);
  if (R.daal && ![...seen.chopN].some((x) => x >= 2)) out.errors.push("level 1 daal: several vegetables to chop: " + [...seen.chopN]);
  // the Maani line: how many of each kind (sizes from level 3), the kinds said in either order
  let both = 0;
  let bajrFirst = 0;
  for (let lv = 1; lv <= 3; lv++) {
    for (let n = 0; n < 60; n++) {
      const d = R.maani.make("nana", { level: lv });
      const tot = Object.values(d.maani).reduce((a, b) => a + b, 0);
      const [lo, hi] = [[3, 3], [3, 5], [2, 4]][lv - 1];
      if (tot < lo || tot > hi) out.errors.push(`maani level ${lv}: total ${tot}`);
      if (lv === 1 && !(d.maani["cook-maani"] && d.maani["cook-bajrmaani"])) out.errors.push(`maani level 1 asks for both doughs ${JSON.stringify(d.maani)}`);
      if ((lv === 3) !== Object.keys(d.maani).some((k) => k.includes("+"))) out.errors.push(`maani level ${lv}: sizes only at level 3 ${JSON.stringify(d.maani)}`);
      const L = Cook.Order.ladder(d, 0);
      const rows = [].concat(...L.sections.map((s) => [].concat(...s.groups)));
      const said = Cook.Lang.plain(Cook.Order.speech([L]));
      if (lv === 3 && !/big|small/.test(said)) out.errors.push(`maani level 3 says the size: ${said}`);
      const kinds = new Set(rows.map((r) => r.ids[r.ids.length - 1]));
      if (kinds.size > 1) {
        both++;
        if (rows[0].ids.includes("cook-bajrmaani")) bajrFirst++;
      }
    }
  }
  if (both && (bajrFirst === 0 || bajrFirst === both)) out.errors.push(`maani: the two kinds are always said in the same order (${bajrFirst}/${both})`);
  out.maani = Cook.Lang.plain(Cook.Order.speech([Cook.Order.ladder(R.maani.make("nana", { level: 3 }), 0)]));
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
    print("  maani (level 3):", res["maani"])
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
            free = not page.query_selector("#t-start")
            page.click("#t-free" if free else "#t-start")
            # free cooking is the open kitchen (customers keep coming until
            # closed): close it ourselves after a couple of customers so the
            # run doesn't wait forever
            P.play(lambda: page.evaluate("!!document.querySelector('#sum-shop, #sum-finale')"), timeout=1500, close_kitchen_after=2 if free else None)
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
    report_side(P)
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e]
    if bad:
        raise AssertionError(f"console errors: {bad[:5]}")
    return P.n


def run_open_kitchen(vp, speed, busy, shots_root, customers=2):
    """Free cooking's own route: seed a finished save (skip the six story
    days), open the kitchen, let `customers` be served, then close it and
    check the usual summary appears."""
    name = vp["name"] + "-open-kitchen" + ("-busy" if busy else "")
    shots = shots_dir(shots_root, name)
    with sync_playwright() as pw:
        browser, page, errors = open_page(pw, vp, speed, busy, seed_save=open_kitchen_save("busy" if busy else "relaxed"))
        P = Player(page, shots, speed)
        page.wait_for_selector("#t-free", timeout=10000)
        P.shot("title")
        page.click("#t-free")
        page.wait_for_selector("#close-kitchen", timeout=15000)
        P.shot("kitchen-open")
        P.play(lambda: page.evaluate("!!document.querySelector('#sum-shop, #sum-finale')"), timeout=1200, close_kitchen_after=customers)
        st = page.evaluate("__cook.state()")
        served = len(st["cards"])
        if served < customers:
            raise AssertionError(f"open kitchen: only {served} of {customers} customers served before closing")
        if page.query_selector("#close-kitchen"):
            raise AssertionError("open kitchen: 'Close the kitchen' button still in the DOM after closing")
        print(f"  {name}: served {served}, coins {st['coins']}")
        P.shot("summary")
        browser.close()
    report_side(P)
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
    ap.add_argument("--open-kitchen", type=int, default=None, metavar="N", help="free cooking's open kitchen: serve N customers, then close it")
    ap.add_argument("--shots", default=os.path.join(ROOT, "build", "screenshots", "cook"))
    args = ap.parse_args()
    global CANVAS
    CANVAS = args.canvas
    random.seed(7)
    httpd = start_server()
    vps = VIEWPORTS
    if args.viewport:
        vps = [v for v in VIEWPORTS if v["name"] == args.viewport]
    elif args.lab or args.orders or args.example or args.open_kitchen is not None:
        vps = [VIEWPORTS[1]]
    failed = []
    for vp in vps:
        t0 = time.time()
        try:
            if args.orders:
                n = run_orders(vp, args.speed)
            elif args.lab or args.example:
                n = run_lab(vp, args.speed, args.busy, args.shots, args.stations.split(","), not args.unguided, args.level, args.zoned, args.example)
            elif args.open_kitchen is not None:
                n = run_open_kitchen(vp, args.speed, args.busy, args.shots, args.open_kitchen)
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
