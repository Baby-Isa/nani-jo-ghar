#!/usr/bin/env python3
"""End-to-end test for Dress up (dress.html), the phase 1 greybox lab.

Same style as build/test_find.py: it plays through REAL pointer events at
screen coordinates, read from window.Dress.expect (what a player who
understood would do next), and never calls the game's handlers. Before
every tap it checks that the thing tapped is really what's under the
finger (nothing covers it: the tap-cover check). In one round in three it
makes a deliberate mistake first (a wrong piece of the same kind of thing:
another hanger on the same rail, another button in the tin, another
column of bangles) and checks the ear star is lost and the round still
finishes. It checks that the scene never shows a word (no <text> in the
world except Big Ma's running tally), that a round never ends by itself
(everything right, no Done: it waits), that level 1's stitch tolerance is
at least 28 px, and that nothing throws. Screenshots go to
build/screenshots/dress/<viewport>/ (not committed).

The leak check (--bot N): the on-screen bot (js/dress/bot.js, which sees
only the screen) plays N rounds of each first-set game at level 1 with
the "random" strategy; its ear-star rate must be under 10% and within 2
points of build/leak_dress.mjs's rate for the same game, level and
strategy.

Usage:
  python3 build/test_dress.py                          # laptop and phone, levels 1-3, every game
  python3 build/test_dress.py --viewport all           # the six sizes
  python3 build/test_dress.py --level 2 --games fitting,layout
  python3 build/test_dress.py --bot 200                # the on-screen leak check (laptop)
  DRESS_TEST_PORT=8804 (default) sets the port.
"""
import argparse
import http.server
import json
import math
import os
import random
import socketserver
import subprocess
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("DRESS_TEST_PORT", os.environ.get("COOK_TEST_PORT", 8804)))
SHOTS = os.path.join(ROOT, "build", "screenshots", "dress")
CHROMIUM = os.environ.get("CHROMIUM", "/opt/pw-browsers/chromium")

VIEWPORTS = [
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "flip5-landscape", "width": 915, "height": 375, "touch": True},
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
]
GAMES = ["layout", "fitting", "table", "bangles"]
# things a wrong tap may pick instead of the right one: same data-act, same rail row
WRONG_OF = {"wear": "data-slot", "take": None, "tin": None, "tray": None}


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        pass


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def start_server():
    os.chdir(ROOT)
    srv = Server(("127.0.0.1", PORT), Quiet)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


FAILS = []


def fail(msg):
    FAILS.append(msg)
    print("  FAIL", msg, flush=True)


def centre_of(page, sel):
    """The tap point for sel, and whether what's under it is sel itself (the tap-cover check)."""
    return page.evaluate(
        """(sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const x = r.left + r.width / 2, y = r.top + r.height / 2;
          const hit = document.elementFromPoint(x, y);
          const ok = !!hit && (hit === el || el.contains(hit));
          return {x, y, ok, hit: hit ? (hit.id || hit.className && hit.className.baseVal || hit.className || hit.tagName) : null, w: r.width, h: r.height};
        }""",
        sel,
    )


def tap(page, vp, sel, label):
    c = None
    for _ in range(40):
        c = centre_of(page, sel)
        if c and c["w"] > 1 and c["ok"]:
            break
        time.sleep(0.05)
    if not c:
        fail(f"{label}: nothing to tap at {sel}")
        return False
    if not c["ok"]:
        fail(f"{label}: {sel} is covered by {c['hit']}")
        return False
    if vp["touch"]:
        page.touchscreen.tap(c["x"], c["y"])
    else:
        page.mouse.click(c["x"], c["y"])
    return True


def swipe(page, e):
    page.mouse.move(e["sx"] + e["sr"], e["sy"])
    page.mouse.down()
    for i in range(46):
        a = i / 40 * 2 * math.pi
        page.mouse.move(e["sx"] + e["sr"] * math.cos(a), e["sy"] + e["sr"] * math.sin(a))
    page.mouse.up()


def wrong_for(page, sel):
    """A different thing of the same sort as the expected tap (a deliberate mistake), or None."""
    return page.evaluate(
        """(sel) => {
          const el = document.querySelector(sel);
          if (!el || !el.dataset || !el.dataset.act) return null;
          const act = el.dataset.act;
          if (!["wear", "take", "tin", "tray"].includes(act)) return null;
          let pool = [...document.querySelectorAll(`#scene [data-act="${act}"]`)].filter((x) => x !== el);
          if (act === "wear") pool = pool.filter((x) => x.dataset.slot === el.dataset.slot);
          if (act === "take" && el.dataset.colour && el.classList.contains("col")) pool = pool.filter((x) => x.dataset.colour !== el.dataset.colour);
          pool = pool.filter((x) => x.dataset.colour !== el.dataset.colour || x.dataset.kind !== el.dataset.kind || x.dataset.size !== el.dataset.size);
          if (!pool.length) return null;
          const w = pool[Math.floor(Math.random() * pool.length)];
          return `#scene [data-act="${act}"]` + (w.dataset.id ? `[data-id="${w.dataset.id}"]` : `[data-colour="${w.dataset.colour}"]`);
        }""",
        sel,
    )


def scene_words(page):
    """Any text drawn in the world other than the tally (no labels, ever)."""
    return page.evaluate("[...document.querySelectorAll('#scene text, #fx text')].filter((t) => !t.closest('.tally')).map((t) => t.textContent)")


def play_round(page, vp, game, level, run, mistake, outdir):
    label = f"{vp['name']} {game} L{level} #{run}{' (mistake)' if mistake else ''}"
    seed = random.randint(1, 10**8)
    page.evaluate(f"void Dress.play({{game: '{game}', level: {level}, lab: true, seed: {seed}}})")
    n_before = page.evaluate("Dress.log.length")
    made = False
    waited = False
    step = 0
    t0 = time.time()
    last = None
    while time.time() - t0 < 90:
        time.sleep(0.06)
        e = page.evaluate("Dress.expect")
        if not e or e.get("kind") == "wait":
            continue
        if e.get("end"):
            break
        if e == last and e["kind"] == "swipe":
            continue
        last = e
        step += 1
        if step <= 30:
            page.screenshot(path=os.path.join(outdir, f"{game}-L{level}-{run:02d}-{step:02d}.png"))
        words = scene_words(page)
        if words:
            fail(f"{label}: words drawn in the scene: {words[:4]}")
        if e["kind"] == "swipe":
            swipe(page, e)
            continue
        sel = e["sel"]
        if sel == "#dress-done" and not waited and not made and level == 1:
            # everything's right: the round must not end by itself
            time.sleep(1.2)
            if page.evaluate("Dress.log.length") != n_before:
                fail(f"{label}: the round ended by itself")
            waited = True
        if mistake and not made:
            w = wrong_for(page, sel)
            if w:
                made = tap(page, vp, w, label + " wrong")
                # a thing picked up needs putting down: the first pile, or any part of the kurta
                if made and 'data-act="take"' in w and page.evaluate("document.querySelectorAll('#scene [data-act=pile]').length") > 1:
                    tap(page, vp, '#scene [data-act="pile"] .pile-hit', label + " wrong pile")
                if made and 'data-act="tray"' in w:
                    tap(page, vp, '#scene [data-act="part"]', label + " wrong part")
                # then Done straight away, so the check sees the mistake (from level 2 only Done judges)
                time.sleep(0.3)
                if page.evaluate("!document.querySelector('#dress-done').classList.contains('hidden')"):
                    tap(page, vp, "#dress-done", label + " early Done")
                continue
        if not tap(page, vp, sel, label):
            break
    else:
        fail(f"{label}: timed out")
    page.screenshot(path=os.path.join(outdir, f"{game}-L{level}-{run:02d}-result.png"))
    card = page.evaluate("Dress.log.length ? Dress.log[Dress.log.length - 1] : null")
    if not card or page.evaluate("Dress.log.length") == n_before:
        fail(f"{label}: no result card")
        return None
    if card["level"] != level:
        fail(f"{label}: played level {card['level']}")
    if made and card["stars"]["ear"]:
        fail(f"{label}: a wrong piece kept the ear star")
    if not made and not card["stars"]["ear"]:
        fail(f"{label}: right every time but no ear star ({card['first']})")
    print(f"  {label}: stars {''.join(k[0] if v else '-' for k, v in card['stars'].items())} coins {card['coins']} odds {100 * card['odds']:.2f}%", flush=True)
    return card


def run_lab(pw, vp, levels, games, rounds):
    browser = pw.chromium.launch(executable_path=CHROMIUM)
    ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"], is_mobile=False)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(f"{e}"))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
    page.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    page.route("**/fonts.gstatic.com/**", lambda r: r.abort())
    page.goto(f"http://127.0.0.1:{PORT}/dress.html?speed=20", wait_until="domcontentloaded")
    page.wait_for_function("window.Dress && Dress.ready", timeout=20000)
    k = page.evaluate("Dress.Look.knobs(Dress.data, 'stitch', 1)")
    if k["tolerance"] < 28:
        fail(f"stitch tolerance at level 1 is {k['tolerance']} px (< 28)")
    outdir = os.path.join(SHOTS, vp["name"])
    os.makedirs(outdir, exist_ok=True)
    page.screenshot(path=os.path.join(outdir, "lab.png"))
    print(f"{vp['name']} ({vp['width']}x{vp['height']})", flush=True)
    run = 0
    for game in games:
        for level in levels:
            for i in range(rounds):
                run += 1
                play_round(page, vp, game, level, run, mistake=(run % 3 == 0), outdir=outdir)
    for e in errors:
        fail(f"{vp['name']}: page error: {e}")
    browser.close()


def node_rates(rounds):
    out = os.path.join(ROOT, "build", "screenshots", "dress", "leak.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    subprocess.run(["node", os.path.join(ROOT, "build", "leak_dress.mjs"), "--rounds", str(rounds), "--json", out], check=False, capture_output=True)
    with open(out) as f:
        data = json.load(f)
    return {(r["game"], r["level"], r["strat"]): r["rate"] for r in data["results"]}


def run_bot(pw, n, games, level=1, strategy="random"):
    browser = pw.chromium.launch(executable_path=CHROMIUM)
    page = browser.new_page(viewport={"width": 1366, "height": 768})
    errors = []
    page.on("pageerror", lambda e: errors.append(f"{e}"))
    page.route("**/fonts.googleapis.com/**", lambda r: r.abort())
    page.route("**/fonts.gstatic.com/**", lambda r: r.abort())
    page.goto(f"http://127.0.0.1:{PORT}/dress.html?speed=40", wait_until="domcontentloaded")
    page.wait_for_function("window.Dress && Dress.ready", timeout=20000)
    ref = node_rates(2000)
    print(f"On-screen bot ({strategy}), {n} rounds per game at level {level}, vs the Node bot (2,000 rounds):", flush=True)
    for game in games:
        t0 = time.time()
        res = page.evaluate(f"Dress.leak({n}, {level}, ['{strategy}'], ['{game}'])")
        rate = res[0]["rate"]
        node = ref.get((game, level, strategy))
        gap = abs(rate - node) * 100 if node is not None else None
        print(f"  {game:8s} L{level}: on screen {100 * rate:5.1f}%   Node {100 * node:5.1f}%   gap {gap:.1f} pts   ({time.time() - t0:.0f} s)", flush=True)
        if rate >= 0.10:
            fail(f"bot: {game} L{level} {strategy} earns the ear star in {100 * rate:.1f}% of rounds")
        if gap is not None and gap > 2.0:
            fail(f"bot: {game} L{level} on screen {100 * rate:.1f}% vs Node {100 * node:.1f}% (more than 2 points apart)")
    for e in errors:
        fail(f"bot: page error: {e}")
    browser.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--viewport", default="laptop,flip5-landscape", help="names, comma-separated, or 'all'")
    ap.add_argument("--level", default="1,2,3")
    ap.add_argument("--games", default=",".join(GAMES))
    ap.add_argument("--rounds", type=int, default=1, help="rounds per game per level")
    ap.add_argument("--bot", type=int, default=0, help="the on-screen leak check: rounds per game")
    ap.add_argument("--lab", action="store_true", help="(default) play every game at each level")
    args = ap.parse_args()
    srv = start_server()
    games = args.games.split(",")
    with sync_playwright() as pw:
        if args.bot:
            run_bot(pw, args.bot, games)
        else:
            names = [v["name"] for v in VIEWPORTS] if args.viewport == "all" else args.viewport.split(",")
            levels = [int(x) for x in args.level.split(",")]
            for vp in [v for v in VIEWPORTS if v["name"] in names]:
                run_lab(pw, vp, levels, games, args.rounds)
    srv.shutdown()
    print(f"\n{len(FAILS)} failure(s)" if FAILS else "\nAll passed.")
    sys.exit(1 if FAILS else 0)


if __name__ == "__main__":
    main()
