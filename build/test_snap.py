#!/usr/bin/env python3
"""Browser tests for Snap (snap.html), phase 1 greybox.

Same style as build/test_find.py: a local server, headless Chromium, one
page at a time, and the pointer-level run plays through REAL clicks and taps
at screen coordinates read from window.__snap.expectation() (what the oracle
would do next), never calling the game's handlers. Before every tap it checks
nothing covers the point (the tap-cover check: sidebar, tray, camera body and
Ali's card never cover the frame, the shutter, the zoom or a fruit being
aimed at). The phase-0 pure logic has its own Node runner:
node build/leak_snap.mjs.

Usage:
  python3 build/test_snap.py                   # --lab and --viewport (all six sizes)
  python3 build/test_snap.py --lab             # every mini-game x level, played by the oracle bot; a fresh profile offers no ear star
  python3 build/test_snap.py --viewport phone  # the pointer-level run at one size (or all), with screenshots
  python3 build/test_snap.py --perf            # the phone takes 4 prints in the 2-screen orchard; frame times (CPU x4)
  python3 build/test_snap.py --leakbot 20      # the in-page bots, 20 rounds per strategy at level 1, vs the Node numbers
  python3 build/test_snap.py --timing          # a level-1 round at real speed, the oracle's taps: under 2 minutes
  --canvas is accepted (and ignored: Snap draws in HTML, not Phaser).
  COOK_TEST_PORT=8807 (default) sets the port.
Screenshots go to build/screenshots/snap/<viewport>/.
"""
import argparse
import http.server
import json
import os
import socketserver
import subprocess
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("COOK_TEST_PORT", 8807))
SHOTS = os.path.join(ROOT, "build", "screenshots", "snap")

VIEWPORTS = [
    {"name": "laptop", "width": 1366, "height": 768, "touch": False},
    {"name": "phone", "width": 915, "height": 375, "touch": True},
    {"name": "laptop-16x10", "width": 1440, "height": 900, "touch": False},
    {"name": "laptop-1280x800", "width": 1280, "height": 800, "touch": False},
    {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    {"name": "ipad-portrait", "width": 768, "height": 1024, "touch": True},
]

failures = []


def fail(msg):
    failures.append(msg)
    print("  FAIL " + msg)


class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def handle_error(self, request, client_address):
        pass


def start_server():
    os.chdir(ROOT)

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    httpd = ReusableTCPServer(("127.0.0.1", PORT), Quiet)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def launch(p):
    args = ["--autoplay-policy=no-user-gesture-required"]
    try:
        return p.chromium.launch(args=args)
    except Exception:
        return p.chromium.launch(executable_path=os.environ.get("SNAP_CHROMIUM", "/opt/pw-browsers/chromium"), args=args)


def open_page(browser, vp, speed=10, speech="oracle"):
    ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp.get("touch", False))
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "ERR_CERT" not in m.text and "fonts.g" not in m.text else None)
    page.goto(f"http://127.0.0.1:{PORT}/snap.html?speed={speed}&speech={speech}")
    page.wait_for_function("window.__snap && window.Snap && Snap.data && Snap.scene")
    page.evaluate("__snap.reset()")
    return ctx, page, errors


def wait_card(page, n, timeout=120):
    t0 = time.time()
    while time.time() - t0 < timeout:
        cards = page.evaluate("__snap.state().cards")
        if len(cards) >= n:
            return cards[n - 1]
        time.sleep(0.2)
    return None


# ---------------- --lab: every mini-game x level, the oracle bot ----------------
LAB = [("g1", 1), ("g1", 2), ("g1", 3), ("g2", 1), ("g2", 2), ("g2", 3), ("g3", 1), ("g3", 2), ("g4", 1), ("g4", 2)]


def run_lab(browser):
    print("--lab: every mini-game and level, played by the oracle bot (words at stage 3)")
    ctx, page, errors = open_page(browser, VIEWPORTS[0])
    n = 0
    for key, level in LAB:
        page.evaluate(f"__snap.lab('{key}', {{level: {level}, stage: 3, bot: 'oracle', seed: {700 + n}}})")
        n += 1
        c = wait_card(page, n)
        if not c:
            fail(f"{key} level {level}: no result card (stuck)")
            page.evaluate("__snap.reset()")
            n = 0
            continue
        ok = c["stars"]["ear"] and c["earOffered"]
        voice = c["stars"].get("voice")
        extra = f", voice {voice}" if voice is not None else ""
        print(f"  {'ok  ' if ok and voice is not False else 'FAIL'} {key} level {level}: stars {c['stars']}{extra}")
        if not ok:
            fail(f"{key} level {level}: the oracle missed the ear star: {c['reasons']}")
        if key == "g4" and not voice:
            fail(f"{key} level {level}: the oracle (listen stub hears the card) missed the voice star")
    # a fresh profile: every word new, so taught, not tested: no ear star offered
    page.evaluate(f"__snap.lab('g1', {{level: 1, stage: 1, bot: 'freshProfile', seed: 9}})")
    n += 1
    c = wait_card(page, n)
    if c and not c["earOffered"] and not c["stars"]["ear"]:
        print("  ok   a fresh profile (stage 1) is taught, not tested: no ear star offered")
    else:
        fail(f"fresh profile: {c}")
    # the blind bots can't speak: no voice star in G4
    page.evaluate(f"__snap.lab('g4', {{level: 1, stage: 3, bot: 'random', seed: 12, speech: 'null'}})")
    n += 1
    c = wait_card(page, n)
    if c and not c["stars"].get("voice"):
        print("  ok   G4 with no speech (pills only) finishes by tapping and earns no voice star")
    else:
        fail(f"G4 no speech: {c}")
    if errors:
        fail("page errors: " + "; ".join(errors[:5]))
    ctx.close()


# ---------------- the pointer-level run ----------------
COVER_JS = """([x, y, sel]) => {
  const e = document.elementFromPoint(x, y);
  if (!e) return 'nothing';
  if (sel) { const t = document.querySelector(sel); return t && (t === e || t.contains(e)) ? '' : (e.id || e.className || e.tagName); }
  return e.closest('#vf-world') ? '' : (e.id || String(e.className) || e.tagName);
}"""

LAYOUT_JS = """() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return b.width && b.height ? {l: b.left, t: b.top, r: b.right, b: b.bottom} : null; };
  const hit = (a, b) => a && b && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
  const f = r('#vf-frame'), tray = r('#tray'), body = r('#vf-body'), side = r('#side'), stage = r('#stage');
  const out = [];
  if (!f) return ['no frame'];
  if (hit(f, body)) out.push('camera body over the frame');
  if (hit(f, side)) out.push('sidebar over the frame');
  if (stage && (f.l < stage.l - 1 || f.r > stage.r + 1 || f.t < stage.t - 1 || f.b > stage.b + 1)) out.push('frame outside the stage');
  // prints in the tray may sit beside the frame, never on it
  document.querySelectorAll('#tray .print').forEach((p) => { const b = p.getBoundingClientRect(); if (hit(f, {l: b.left, t: b.top, r: b.right, b: b.bottom})) out.push('a print over the frame'); });
  for (const s of ['#vf-shutter', '#vf-zoom-in', '#vf-zoom-out']) {
    const b = r(s); if (!b) { out.push(s + ' missing'); continue; }
    const e = document.elementFromPoint((b.l + b.r) / 2, (b.t + b.b) / 2);
    const t = document.querySelector(s);
    if (!(e === t || t.contains(e))) out.push(s + ' covered by ' + (e && (e.id || e.className)));
  }
  return out;
}"""


def play_pointer(page, vp, key, level, shots_dir, tag, timeout=150, seed=None):
    """The oracle's moves as real taps and clicks; returns (card, stats)."""
    stats = {"taps": 0, "clicks": 0, "aims": 0, "layout": set()}
    n0 = len(page.evaluate("__snap.state().cards"))
    page.evaluate(f"__snap.lab('{key}', {{level: {level}, stage: 3, seed: {seed if seed is not None else 'null'}}})")
    t0 = time.time()
    shot_names = set()
    last = None
    same = 0
    while time.time() - t0 < timeout:
        st = page.evaluate("__snap.state()")
        if len(st["cards"]) > n0:
            break
        e = page.evaluate("__snap.expectation()")
        ph = st["phase"]
        if ph and ph not in shot_names and ph in ("shoot", "handin", "ali") and (ph != "shoot" or st["prints"] > 0):
            shot_names.add(ph)
            page.screenshot(path=os.path.join(shots_dir, f"{tag}-{ph}.png"))
        if ph == "shoot":
            for problem in page.evaluate(LAYOUT_JS):
                stats["layout"].add(problem)
        if not e or e.get("kind") == "wait" or e.get("end"):
            time.sleep(0.1)
            continue
        sig = json.dumps(e, sort_keys=True)
        same = same + 1 if sig == last else 0
        last = sig
        if same > 40:
            fail(f"{vp['name']} {key}: stuck on {sig}")
            return None, stats
        if e["kind"] == "click":
            b = page.evaluate("(s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; }", e["selector"])
            if not b:
                time.sleep(0.1)
                continue
            cover = page.evaluate(COVER_JS, [b[0], b[1], e["selector"]])
            if cover:
                stats["layout"].add(f"{e['selector']} covered by {cover}")
            page.mouse.click(b[0], b[1])
            stats["clicks"] += 1
            time.sleep(0.12)
        elif e["kind"] == "tap":
            cover = page.evaluate(COVER_JS, [e["sx"], e["sy"], None])
            if cover:
                stats["layout"].add(f"orchard tap at {int(e['sx'])},{int(e['sy'])} covered by {cover}")
            page.mouse.click(e["sx"], e["sy"])
            stats["taps"] += 1
            time.sleep(0.35)
        elif e["kind"] == "aim":
            page.evaluate("([x, y, z]) => __snap.aim(x, y, z)", [e["cx"], e["cy"], e["zi"]])
            stats["aims"] += 1
            time.sleep(0.1)
    cards = page.evaluate("__snap.state().cards")
    card = cards[n0] if len(cards) > n0 else None
    stats["secs"] = round(time.time() - t0, 1)
    page.screenshot(path=os.path.join(shots_dir, f"{tag}-result.png"))
    return card, stats


def run_viewports(browser, names):
    print("--viewport: the oracle's moves as real taps, with the tap-cover check")
    for vp in VIEWPORTS:
        if names and vp["name"] not in names:
            continue
        d = os.path.join(SHOTS, vp["name"])
        os.makedirs(d, exist_ok=True)
        ctx, page, errors = open_page(browser, vp, speed=6)
        page.screenshot(path=os.path.join(d, "00-title.png"))
        for key, level, seed in (("g1", 1, 21), ("g2", 1, 22), ("g4", 1, 23)):
            card, stats = play_pointer(page, vp, key, level, d, f"{key}-l{level}", seed=seed)
            problems = sorted(stats["layout"])
            ok = card and card["stars"]["ear"] and not problems
            print(f"  {'ok  ' if ok else 'FAIL'} {vp['name']:16} {key} level {level}: {stats.get('secs')} s, {stats['taps']} taps, {stats['clicks']} clicks, {stats['aims']} rounding aims; stars {card and card['stars']}")
            if problems:
                fail(f"{vp['name']} {key}: " + "; ".join(problems[:6]))
            if not card:
                fail(f"{vp['name']} {key}: no result")
            elif not card["stars"]["ear"]:
                fail(f"{vp['name']} {key}: the oracle's taps missed the ear star: {card['reasons']}")
        if errors:
            fail(f"{vp['name']}: page errors: " + "; ".join(errors[:4]))
        ctx.close()


# ---------------- --timing: a level-1 round at real speed ----------------
def run_timing(browser):
    print("--timing: G1 level 1 at real speed (Nani's lines at their own pace), the oracle's taps")
    ctx, page, errors = open_page(browser, VIEWPORTS[0], speed=1)
    d = os.path.join(SHOTS, "timing")
    os.makedirs(d, exist_ok=True)
    card, stats = play_pointer(page, VIEWPORTS[0], "g1", 1, d, "g1-l1", timeout=240, seed=31)
    rows = 2
    ok = card and stats["secs"] < 120
    print(f"  {'ok  ' if ok else 'FAIL'} {rows} rows in {stats['secs']} s (limit 120 s), stars {card and card['stars']}")
    if not ok:
        fail(f"timing: {stats['secs']} s")
    ctx.close()


# ---------------- --perf: the phone, 4 prints, the 2-screen orchard ----------------
PERF_JS = """() => { window.__ft = []; let last = performance.now(); const f = (t) => { window.__ft.push(t - last); last = t; if (window.__ftOn) requestAnimationFrame(f); }; window.__ftOn = true; requestAnimationFrame(f); }"""


def run_perf(browser):
    print("--perf: phone 915x375, CPU slowed x4, 4 prints in the 2-screen orchard (G1 level 3)")
    vp = VIEWPORTS[1]
    ctx, page, errors = open_page(browser, vp, speed=4)
    cdp = ctx.new_cdp_session(page)
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    page.evaluate("__snap.lab('g1', {level: 3, stage: 3, seed: 41})")
    page.wait_for_function("__snap.state().phase === 'shoot' && __snap.expectation() && __snap.expectation().kind !== 'wait'", timeout=60000)
    page.evaluate(PERF_JS)
    t0 = time.time()
    prints = 0
    while prints < 4 and time.time() - t0 < 90:
        e = page.evaluate("__snap.expectation()")
        st = page.evaluate("__snap.state()")
        prints = st["prints"]
        if not e or e["kind"] == "wait" or st["phase"] != "shoot":
            time.sleep(0.1)
            continue
        if e["kind"] == "click" and e["selector"] == "#vf-show":
            # the rows are shot: spend the spare film on pans across the orchard
            page.mouse.move(vp["width"] * 0.35, vp["height"] * 0.5)
            page.mouse.down()
            page.mouse.move(vp["width"] * 0.1, vp["height"] * 0.45, steps=12)
            page.mouse.up()
            b = page.evaluate("(() => { const r = document.querySelector('#vf-shutter').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()")
            page.mouse.click(b[0], b[1])
            time.sleep(0.4)
            continue
        if e["kind"] == "click":
            b = page.evaluate("(s) => { const r = document.querySelector(s).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }", e["selector"])
            page.mouse.click(b[0], b[1])
        elif e["kind"] == "tap":
            page.mouse.click(e["sx"], e["sy"])
        elif e["kind"] == "aim":
            page.evaluate("([x, y, z]) => __snap.aim(x, y, z)", [e["cx"], e["cy"], e["zi"]])
        time.sleep(0.3)
    ft = page.evaluate("(() => { window.__ftOn = false; return window.__ft; })()")
    ft = ft[2:]
    dropped = sum(1 for x in ft if x > 34)
    worst = max(ft) if ft else 0
    avg = sum(ft) / len(ft) if ft else 0
    print(f"  {'ok  ' if prints >= 4 else 'FAIL'} {prints} prints; {len(ft)} frames, mean {avg:.1f} ms, worst {worst:.0f} ms, {dropped} over 34 ms ({100 * dropped / max(1, len(ft)):.1f}%)")
    if prints < 4:
        fail("perf: fewer than 4 prints")
    page.screenshot(path=os.path.join(SHOTS, "phone-perf.png"))
    ctx.close()
    return {"frames": len(ft), "mean": avg, "worst": worst, "dropped": dropped}


# ---------------- --leakbot: the in-page bots vs the Node numbers ----------------
def run_leakbot(browser, n):
    print(f"--leakbot: the in-page bots, {n} rounds per strategy, G1 and G2 level 1")
    ctx, page, errors = open_page(browser, VIEWPORTS[0], speed=20)
    strategies = page.evaluate("Snap.Bot.STRATEGIES")
    per = len(strategies) * 2 * n
    res = page.evaluate(f"Snap.leakCheck({per}, {{level: 1}})")
    node = subprocess.run(["node", "build/leak_snap.mjs", "--leakbot", "300", "--game", "g1"], cwd=ROOT, capture_output=True, text=True).stdout
    print(f"  browser: {res['n']} rounds; oracle {100 * res['oracleRate']:.1f}%, blind pooled {100 * res['blindRate']:.1f}%")
    for line in node.splitlines():
        if "level 1" in line:
            print("  node:  " + line.strip())
    if res["oracleRate"] < 0.95:
        fail(f"browser oracle {res['oracleRate']}")
    if res["blindRate"] >= 0.05:
        fail(f"browser blind pooled {res['blindRate']}")
    ctx.close()
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lab", action="store_true")
    ap.add_argument("--viewport", nargs="?", const="all")
    ap.add_argument("--perf", action="store_true")
    ap.add_argument("--timing", action="store_true")
    ap.add_argument("--leakbot", type=int, nargs="?", const=10)
    ap.add_argument("--canvas", action="store_true")
    a = ap.parse_args()
    default = not (a.lab or a.viewport or a.perf or a.timing or a.leakbot)
    httpd = start_server()
    with sync_playwright() as p:
        browser = launch(p)
        if a.lab or default:
            run_lab(browser)
        if a.viewport or default:
            run_viewports(browser, None if (a.viewport in (None, "all")) else a.viewport.split(","))
        if a.timing:
            run_timing(browser)
        if a.perf:
            run_perf(browser)
        if a.leakbot:
            run_leakbot(browser, a.leakbot)
        browser.close()
    httpd.shutdown()
    print(f"{len(failures)} FAILED" if failures else "all passed")
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
