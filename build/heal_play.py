"""Shared driver for the clinic v2 heal-game browser tests (test_clinic_heal_a/b/c.py).

Each v2 game's controller exposes debug.next(): the next thing a child who
understood the words would do, in client pixels:
  {do: "tap", x, y}          a tap (checked: nothing in the HTML covers it)
  {do: "drag", pts: [[x,y],..]}
  {do: "hold", x, y, until}  press, keep holding until the JS expression `until` is true, release
  {do: "button"}             the host's big button (Next / Done)
  {do: "wait"}               the game is busy (a line, an animation, the patient reading)
The driver plays through real mouse events until ctx.done() fires, then
checks: right == total, the card ticked every step, every step got its
first-time cue (words), and no console errors. A "slip" play makes one
deliberate mistake where the game offers one (debug.slip()) and must lose
exactly one row.
"""
import http.server
import os
import socketserver
import threading
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZES = {
    "phone": {"width": 915, "height": 412, "touch": True},
    "ipad": {"width": 1024, "height": 768, "touch": True},
    "laptop": {"width": 1366, "height": 768, "touch": False},
}


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def start_server(port):
    os.chdir(ROOT)

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    try:
        httpd = Server(("127.0.0.1", port), Quiet)
    except OSError:
        return None
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def launch(pw):
    exe = "/opt/pw-browsers/chromium"
    return pw.chromium.launch(executable_path=exe) if os.path.exists(exe) else pw.chromium.launch()


class Play:
    def __init__(self, page, game, level, size, seed, shots, kind="girl", slip=False, cues=True):
        self.page, self.game, self.level, self.size, self.seed = page, game, level, size, seed
        self.shots, self.kind, self.slip, self.cues = shots, kind, slip, cues
        self.n = 0

    def shot(self, name):
        if not self.shots:
            return
        self.n += 1
        d = os.path.join(self.shots, self.size)
        os.makedirs(d, exist_ok=True)
        self.page.screenshot(path=os.path.join(d, f"{self.game}-L{self.level}-{self.n}-{name}.png"))

    def js(self, expr):
        return self.page.evaluate(expr)

    def covered(self, x, y):
        return self.js(
            f"(() => {{ const e = document.elementFromPoint({x},{y}); return !e || !(e.closest('.hs-root') || e.closest('.cl-stage')); }})()"
        )

    def act(self, a):
        m = self.page.mouse
        d = a["do"]
        if d == "tap":
            if self.covered(a["x"], a["y"]):
                raise AssertionError(f"({a['x']:.0f},{a['y']:.0f}) is covered or off the play area ({a.get('what', '')})")
            m.move(a["x"], a["y"])
            m.down()
            m.up()
            self.page.wait_for_timeout(a.get("after", 90))
        elif d == "drag":
            pts = a["pts"]
            m.move(pts[0][0], pts[0][1])
            m.down()
            for x, y in pts[1:]:
                m.move(x, y, steps=a.get("steps", 3))
            m.up()
            self.page.wait_for_timeout(120)
        elif d == "hold":
            m.move(a["x"], a["y"])
            m.down()
            t0 = time.time()
            while not self.js(a["until"]) and time.time() - t0 < 12:
                self.page.wait_for_timeout(15)
            m.up()
            self.page.wait_for_timeout(150)
        elif d == "button":
            self.page.locator(".cl-go").last.click()
            self.page.wait_for_timeout(150)
        elif d == "wait":
            self.page.wait_for_timeout(a.get("ms", 150))
        else:
            raise AssertionError(f"unknown action {a}")

    def run(self):
        page = self.page
        page.evaluate(
            """([g, L, seed, kind]) => {
              const out = document.getElementById("lab-out");
              if (out) out.style.display = "none";
              document.getElementById("lab-game").value = g;
              document.getElementById("lab-level").value = String(L);
              document.getElementById("lab-seed").value = String(seed);
              document.getElementById("lab-kind").value = kind;
              document.getElementById("lab-side").value = "";
              __heal.mount();
            }""",
            [self.game, self.level, self.seed, self.kind],
        )
        page.wait_for_function("__heal.run && __heal.run.controller && __heal.run.controller.debug", timeout=15000)
        page.wait_for_timeout(300)
        P = self.js("JSON.parse(JSON.stringify(__heal.run.controller.debug.plan))")
        self.shot("start")
        slipped = False
        t0 = time.time()
        steps = 0
        mid = False
        while not self.js("!!__heal.result"):
            if time.time() - t0 > 90:
                raise AssertionError("timed out playing")
            if self.slip and not slipped and self.js("!!(__heal.run.controller.debug.slip && __heal.run.controller.debug.slip())"):
                slipped = True
                a = self.js("__heal.run.controller.debug.next()")
            else:
                a = self.js("__heal.run.controller.debug.next()")
            self.act(a)
            steps += 1
            if not mid and steps > 6 and a["do"] != "wait":
                mid = True
                self.shot("mid")
        page.wait_for_timeout(200)
        self.shot("end")
        r = self.js("({right: __heal.result.right, total: __heal.result.total, words: (__heal.result.words || []).length})")
        ticks = self.js("document.querySelectorAll('.cl-row.done').length")
        rows = self.js("document.querySelectorAll('.cl-row').length")
        cues = self.js("__heal.run.controller.debug.cues")
        return P, r, ticks, rows, cues, slipped


def run_suite(games, levels, sizes, seeds, port, shots, kinds, label, slip=True):
    """Play every game x level x size; returns the number of failures."""
    from playwright.sync_api import sync_playwright

    fails = 0
    httpd = start_server(port)
    with sync_playwright() as pw:
        br = launch(pw)
        for size in sizes:
            vp = SIZES[size]
            ctx = br.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
            page = ctx.new_page()
            errors = []
            page.on("console", lambda m: m.type == "error" and "Failed to load resource" not in m.text and errors.append(m.text))
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(f"http://127.0.0.1:{port}/lab/clinic-heal-host.html?quiet=1&fast=1")
            page.wait_for_function("window.__heal && " + " && ".join(f"Clinic.Heal.has('{g}')" for g in games), timeout=15000)
            for game in games:
                for L in levels:
                    plays = [(s, False) for s in range(seeds)] + ([(seeds, True)] if slip else [])
                    for s, sl in plays:
                        seed = 11 + 7 * s + L
                        t0 = time.time()
                        try:
                            P, r, ticks, rows, cues, slipped = Play(page, game, L, size, seed, shots, kinds.get(game, "girl"), slip=sl).run()
                            kinds_needed = sorted({st["kind"] for st in P.get("steps", [])})
                            missing = [k for k in kinds_needed if k not in cues]
                            want = r["total"] - (1 if (sl and slipped) else 0)
                            good = r["right"] == want and r["total"] == len(P["rows"]) and ticks >= rows and not missing
                            msg = f"{r['right']}/{r['total']} rows, {ticks}/{rows} ticked" + (" (slip)" if sl and slipped else "")
                            if missing:
                                msg += f", no cue for {missing}"
                        except Exception as e:  # noqa: BLE001
                            good, msg = False, f"{type(e).__name__}: {str(e)[:300]}"
                        if errors:
                            good, msg = False, msg + " | console: " + " / ".join(errors[:3])
                            errors.clear()
                        fails += 0 if good else 1
                        print(f"{'ok  ' if good else 'FAIL'} {label} {size:6} {game:6} L{L} seed {seed:3}  {msg}  ({time.time() - t0:.1f}s)", flush=True)
            ctx.close()
        br.close()
    if httpd:
        httpd.shutdown()
    return fails
