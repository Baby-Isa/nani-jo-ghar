#!/usr/bin/env python3
"""Browser test for heal agent C's games on the REAL host (lab/clinic-heal-host.html).

Plays eye (H12) and foot (H13), and the maybe-later extras (tummy H10, hic
H15, hair H16) when their files exist, at every level, through real mouse
events at screen coordinates read from the game's controller.expect(). Before
every tap it checks that the thing is the topmost element there (nothing
covers it). A "fair" play must score every row; a "slip" play makes one
deliberate mistake and must score exactly one row less (the review counts
it; nothing is said mid-round). Screenshots go to
build/screenshots/clinic-heal-c/<viewport>/.

Usage:
  python3 build/test_clinic_heal_c.py                  # phone, iPad, iPad portrait, laptop
  python3 build/test_clinic_heal_c.py --only eye --viewport laptop --level 3
Port: COOK_TEST_PORT (default 8823).
"""
import argparse
import http.server
import json
import os
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("COOK_TEST_PORT", 8823))
VIEWPORTS = {
    "phone": {"width": 915, "height": 412, "touch": True},
    "ipad": {"width": 1024, "height": 768, "touch": True},
    "ipad-portrait": {"width": 768, "height": 1024, "touch": True},
    "laptop": {"width": 1366, "height": 768, "touch": False},
}
GAMES = ["eye", "foot", "tummy", "hic", "hair"]
EXTRA_SRC = {g: f"js/clinic/heal/games/{g}.js" for g in ["tummy", "hic", "hair"]}
SHOTS = os.path.join(ROOT, "build", "screenshots", "clinic-heal-c")
KINDS = ["girl", "nana", "boy", "old-woman", "ma", "ali"]


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
        return None
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


class Fail(Exception):
    pass


class Play:
    def __init__(self, page, shots, tag):
        self.page, self.shots, self.tag = page, shots, tag
        self.n = 0
        self.slow = False  # while the first-time overlay runs: a child's pace (it ignores taps for 450 ms between steps)

    def shot(self, name):
        self.n += 1
        self.page.screenshot(path=os.path.join(self.shots, f"{self.tag}-{self.n:02d}-{name}.png"))

    def exp(self):
        return self.page.evaluate("__heal.run && __heal.run.controller.expect ? __heal.run.controller.expect() : null")

    def wait(self, js, timeout=8):
        t0 = time.time()
        while time.time() - t0 < timeout:
            if self.page.evaluate(js):
                return
            time.sleep(0.05)
        raise Fail(f"timed out waiting for {js}")

    def uncovered(self, x, y, sel_js):
        """Is the element at (x, y) inside what we mean to tap? sel_js: a JS predicate on the hit element `e`."""
        ok = self.page.evaluate(
            f"""([x, y]) => {{ const e = document.elementFromPoint(x, y); if (!e) return 'nothing'; return ({sel_js}) ? true : (e.className && e.className.baseVal !== undefined ? e.tagName + '.' + e.className.baseVal : e.tagName + '.' + e.className) + ' ' + (e.closest('[data-heal]') ? e.closest('[data-heal]').dataset.heal : ''); }}""",
            [x, y],
        )
        if ok is not True:
            raise Fail(f"({x:.0f},{y:.0f}) is covered by {ok}")

    def tap(self, r, what, sel_js="true"):
        if not r:
            raise Fail(f"no rect for {what}")
        x, y = r["x"], r["y"]
        vw, vh = self.page.viewport_size["width"], self.page.viewport_size["height"]
        if not (0 <= x < vw and 0 <= y < vh):
            raise Fail(f"{what} is off screen at ({x:.0f},{y:.0f})")
        self.uncovered(x, y, sel_js)
        self.page.mouse.click(x, y)
        time.sleep(0.7 if self.slow else 0.12)

    def dish(self, i, what):
        if i is None or i < 0:
            raise Fail(f"no dish for {what}")
        r = self.page.evaluate(
            "(i) => { const d = document.querySelectorAll('.cl-side-tray .cl-dish')[i]; if (!d) return null; const b = d.getBoundingClientRect(); return {x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, h: b.height}; }", i
        )
        self.tap(r, f"dish {what}", "e.closest('.cl-dish')")

    def heal(self, key):
        return f"e.closest('[data-heal=\"{key}\"]')"

    def done(self):
        r = self.page.evaluate("(() => { const b = document.querySelector('.cl-actions .cl-go'); const r = b.getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; })()")
        self.tap(r, "Done", "e.closest('.cl-go')")

    def result(self, timeout=8):
        self.wait("!!(window.__heal && __heal.result)", timeout)
        return self.page.evaluate("({right: __heal.result.right, total: __heal.result.total, log: __heal.result.log.length, words: __heal.result.words.length})")


def play_eye(p, level, slip):
    e = p.exp()
    R = e["round"]
    p.shot("start")
    n = R["count"] + (1 if slip else 0)
    p.dish(e["dish"]["drops"], "drops")
    for _ in range(n):
        p.tap(p.exp()["eye"][R["side"]], f"eye-{R['side']}", p.heal("eye-" + R["side"]))
        time.sleep(0.2)
    p.shot("drops")
    if R["patch"]:
        p.dish(e["dish"]["patch"], "patch")
        p.tap(p.exp()["eye"][R["patch"]], f"eye-{R['patch']}", p.heal("eye-" + R["patch"]))
    p.dish(e["dish"]["pointer"], "pointer")
    for i, t in enumerate(R["targets"]):
        p.wait(f"__heal.run.controller.expect().callIdx === {i}")
        time.sleep(0.5)
        cell = p.exp()["cells"][i][t]
        p.tap(cell, f"cell {i}-{t}", p.heal(f"cell-{i}-{t}"))
        if i == 1:
            p.shot("chart")
    time.sleep(0.4)
    # the Kasuku squawks (ungraded fun) before Done
    p.tap(p.exp()["kasuku"], "kasuku", p.heal("kasuku"))
    p.done()
    return 1 if slip else 0


def play_foot(p, level, slip):
    e = p.exp()
    R = e["round"]
    p.shot("start")
    p.dish(e["dish"]["paani"], "paani")
    time.sleep(0.35)
    temp = R["temp"] if not slip else ("cold" if R["temp"] == "hot" else "hot")
    p.tap(p.exp()["jug"][temp], f"jug {temp}", p.heal("jug-" + temp))
    if R["salt"]:
        p.dish(e["dish"]["loon"], "loon")
        for _ in range(R["salt"]):
            p.tap(p.exp()["tub"], "tub", p.heal("tub"))
    p.shot("bath")
    p.tap(p.exp()["feet"], "feet", p.heal("feet"))
    time.sleep(0.9)
    for i, c in enumerate(R["calls"]):
        p.wait(f"(e => e.callIdx === {i} && e.callReady)(__heal.run.controller.expect())")
        time.sleep(0.3)
        k = f"{c['side'] or 'left'}-{c['k']}"
        p.tap(p.exp()["toes"][k], f"toe {k}", p.heal("toe-" + k))
    p.shot("toes")
    time.sleep(1.0)
    th = R["thorn"]
    k = f"{th['side']}-{th['k']}"
    p.dish(e["dish"]["tweezers"], "tweezers")
    r = p.exp()["toes"][k]
    p.uncovered(r["x"], r["y"], p.heal("toe-" + k))
    p.page.mouse.move(r["x"], r["y"])
    p.page.mouse.down()
    for s in range(1, 9):
        p.page.mouse.move(r["x"], r["y"] + s * 14)
        time.sleep(0.03)
    p.page.mouse.up()
    time.sleep(0.3)
    if not p.exp()["state"]["plucks"]:
        raise Fail("the pluck did not register")
    p.shot("pluck")
    time.sleep(0.9)
    p.dish(e["dish"]["plaster"], "plaster")
    p.tap(p.exp()["toes"][k], f"toe {k}", p.heal("toe-" + k))
    p.done()
    return 1 if slip else 0


def play_generic(p, level, slip):
    """The extras expose expect().script: a list of {tap|drag|dish|wait} steps for a fair play (slip: the variant)."""
    e = p.exp()
    p.shot("start")
    steps = e.get("slipScript" if slip else "script") or []
    for s in steps:
        if "wait" in s:
            p.wait(s["wait"], 10)
            time.sleep(s.get("pause", 0.2))
        elif "dish" in s:
            p.dish(p.exp()["dish"][s["dish"]], s["dish"])
        elif "tap" in s:
            p.tap(p.page.evaluate(f"__heal.run.controller.where({json.dumps(s['tap'])})"), s["tap"], p.heal(s["tap"]))
        elif "drag" in s:
            r = p.page.evaluate(f"__heal.run.controller.where({json.dumps(s['drag'])})")
            dx, dy = s.get("dx", 0), s.get("dy", 0)
            p.uncovered(r["x"], r["y"], p.heal(s["drag"]))
            p.page.mouse.move(r["x"], r["y"])
            p.page.mouse.down()
            for k in range(1, 11):
                p.page.mouse.move(r["x"] + dx * k / 10, r["y"] + dy * k / 10)
                time.sleep(0.03)
            p.page.mouse.up()
            time.sleep(0.2)
        elif "shot" in s:
            p.shot(s["shot"])
        elif "done" in s:
            p.done()
    return 1 if slip else 0


PLAYERS = {"eye": play_eye, "foot": play_foot}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="one game id")
    ap.add_argument("--viewport", help="one of " + ", ".join(VIEWPORTS))
    ap.add_argument("--level", type=int)
    ap.add_argument("--headed", action="store_true")
    a = ap.parse_args()
    httpd = start_server()
    games = [g for g in GAMES if (not a.only or g == a.only) and os.path.exists(os.path.join(ROOT, "js/clinic/heal/games", g + ".js"))]
    vps = [a.viewport] if a.viewport else list(VIEWPORTS)
    levels = [a.level] if a.level else [1, 2, 3]
    src = "".join(f"&src={v}" for k, v in EXTRA_SRC.items() if os.path.exists(os.path.join(ROOT, v)))
    fails = []
    runs = 0
    with sync_playwright() as pw:
        exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
        browser = pw.chromium.launch(headless=not a.headed, executable_path=exe)
        for vp in vps:
            V = VIEWPORTS[vp]
            shots = os.path.join(SHOTS, vp)
            os.makedirs(shots, exist_ok=True)
            for f in os.listdir(shots):
                if f.endswith(".png") and any(f.startswith(g + "-L") for g in games):
                    os.remove(os.path.join(shots, f))
            for gi, g in enumerate(games):
                for level in levels:
                    for slip in ([False, True] if level == 2 else [False]):
                        runs += 1
                        tag = f"{g}-L{level}{'-slip' if slip else ''}"
                        ctx = browser.new_context(viewport={"width": V["width"], "height": V["height"]}, has_touch=V["touch"])
                        onboard = level == 1 and vp == "laptop" and not slip
                        if not onboard:
                            ctx.add_init_script(
                                "try{localStorage.setItem('njg-shared-ui-fallback-v1', JSON.stringify({onboarded: {"
                                + ",".join(f"'clinic/heal-{x}': true" for x in GAMES)
                                + "}}))}catch(e){}"
                            )
                        page = ctx.new_page()
                        errors = []
                        page.on("pageerror", lambda ex, errors=errors: errors.append(str(ex)))
                        page.on("console", lambda m, errors=errors: m.type == "error" and "Failed to load resource" not in m.text and errors.append(m.text))
                        # a missing file of OURS is an error (the host also probes the other agents' game files, and fonts may be offline)
                        mine = ("games/eye.js", "games/foot.js", "games/tummy.js", "games/hic.js", "games/hair.js", "heal/eye.json", "heal/foot.json", "heal/tummy.json", "heal/hic.json", "heal/hair.json", "assets/")
                        page.on("response", lambda resp, errors=errors: resp.status >= 400 and any(m in resp.url for m in mine) and errors.append(f"{resp.status} {resp.url}"))
                        kind = KINDS[(gi + level) % len(KINDS)]
                        seed = 101 + level * 7 + gi * 13 + (5 if slip else 0)
                        page.goto(f"http://127.0.0.1:{PORT}/lab/clinic-heal-host.html?game={g}&level={level}&kind={kind}&seed={seed}&quiet=1&fast=1{src}")
                        p = Play(page, shots, tag)
                        try:
                            p.wait("!!(window.__heal && __heal.run && __heal.run.controller && __heal.run.controller.expect)", 10)
                            page.evaluate("document.getElementById('lab').classList.add('min'); document.getElementById('lab-out').style.display = 'none'")
                            time.sleep(0.6)
                            if onboard:
                                # the first-time overlay: a picture of it, then play through it at a child's pace
                                time.sleep(0.8)
                                p.shot("onboard")
                                p.slow = True
                            lost = (PLAYERS.get(g) or play_generic)(p, level, slip)
                            r = p.result()
                            time.sleep(0.4)
                            p.shot("end")
                            want = r["total"] - lost
                            status = "ok" if r["right"] == want else f"scored {r['right']}/{r['total']}, wanted {want}"
                            if status != "ok":
                                fails.append(f"{vp} {tag}: {status}")
                            if errors:
                                fails.append(f"{vp} {tag}: errors {errors[:3]}")
                                status += f" + {len(errors)} console error(s)"
                            print(f"{vp:14s} {tag:16s} {r['right']}/{r['total']} words {r['words']:2d}  {status}")
                        except Fail as ex:
                            p.shot("FAIL")
                            fails.append(f"{vp} {tag}: {ex}")
                            print(f"{vp:14s} {tag:16s} FAIL {ex} {errors[:2]}")
                        ctx.close()
        browser.close()
    if httpd:
        httpd.shutdown()
    print(f"\n{runs - len(fails)}/{runs} runs clean" + ("" if not fails else "\n" + "\n".join(fails)))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
