#!/usr/bin/env python3
"""Browser test for the clinic's pipeline (clinic.html; docs/modes/clinic-design.md).

Plays lab entries through REAL pointer events at screen coordinates, read
from window.__clinic.expect() (what the current stage wants next): taps on the
bench, the pulsing parts and the Found it / Next buttons, points on the
patient's body, taps on the belt as the right dish passes, the Done/next
buttons, the face cards, the pills of the speaking moments, and the shared
end-of-round screen. Before every tap it checks that the element under the
point is the one being tapped (nothing covers it). With --mistakes it makes
one deliberate wrong tap per stage so the gentle-correction and no-verdict
paths run. The healing games are played by their own tests (the heal
agents' labs); here the heal stage is ended the way a fair player would
(window.__clinic.finishHeal()) unless --play-cut and the game is cut.

Usage:
  python3 build/test_clinic.py                              # every stage at levels 1-3, a patient per level, the first-ever morning; laptop
  python3 build/test_clinic.py --viewport ipad --mistakes
  python3 build/test_clinic.py --sizes phone,ipad,laptop    # the three sizes
  python3 build/test_clinic.py --only morning --session 3
Port: COOK_TEST_PORT (default 8820). Run one browser test at a time.
Screenshots: build/screenshots/clinic-core/<viewport>/.
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
PORT = int(os.environ.get("COOK_TEST_PORT", os.environ.get("CLINIC_TEST_PORT", 8820)))
VIEWPORTS = {
    "phone": {"width": 915, "height": 412, "touch": True},  # a phone held landscape (Galaxy Z Flip5 class)
    "phone-portrait": {"width": 412, "height": 915, "touch": True},
    "ipad": {"width": 1024, "height": 768, "touch": True},
    "ipad-portrait": {"width": 768, "height": 1024, "touch": True},
    "laptop": {"width": 1366, "height": 768, "touch": False},
}
SHOTS = os.path.join(ROOT, "build", "screenshots", "clinic-core")


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def start_server():
    os.chdir(ROOT)

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    httpd = Server(("127.0.0.1", PORT), Quiet)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def chromium(p):
    for c in ("/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium"):
        if os.path.exists(c) and os.path.isfile(c):
            return p.chromium.launch(executable_path=c)
    return p.chromium.launch()


class Player:
    def __init__(self, page, vp, mistakes, shots, play_cut=False):
        self.page, self.vp, self.mistakes, self.shots, self.play_cut = page, vp, mistakes, shots, play_cut
        self.wrong_done = set()
        self.taps = 0
        self.shot_stages = set()

    def ev(self, js, arg=None):
        return self.page.evaluate(js, arg)

    def tap_xy(self, x, y):
        if self.vp["touch"]:
            self.page.touchscreen.tap(x, y)
        else:
            self.page.mouse.click(x, y)
        self.taps += 1

    def centre(self, sel):
        return self.ev(
            """(sel) => { const els = Array.from(document.querySelectorAll(sel)).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.disabled; });
              if (!els.length) return null; const e = els[0]; const r = e.getBoundingClientRect();
              const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
              const top = document.elementFromPoint(x, y); const ok = !!top && (top === e || e.contains(top));
              return {x, y, ok, w: r.width, h: r.height, onscreen: x > 0 && y > 0 && x < innerWidth && y < innerHeight, cover: top ? (top.className && top.className.baseVal !== undefined ? top.className.baseVal : top.className) : null}; }""",
            sel,
        )

    def tap_sel(self, sel, need_clear=True):
        c = self.centre(sel)
        if not c or not c["onscreen"]:
            return False
        if need_clear and not c["ok"]:
            raise AssertionError(f"{sel} is covered by {c['cover']} at {c['x']},{c['y']}")
        self.tap_xy(c["x"], c["y"])
        return True

    def shot(self, name):
        os.makedirs(self.shots, exist_ok=True)
        self.page.screenshot(path=os.path.join(self.shots, f"{name}.png"))

    def results_screen(self):
        # the shared end-of-round screen: page 1 (badges) -> Next -> page 2 (words) -> Done
        for sel in (".rs-next", ".rs-done"):
            c = self.centre(sel)
            if c:
                self.tap_xy(c["x"], c["y"])
                time.sleep(0.25)
                return True
        return False

    def play(self, label, done_js="() => !!(window.__clinic && window.__clinic.last)", timeout=240):
        t0 = time.time()
        last_stage = None
        while time.time() - t0 < timeout:
            errs = self.ev("() => window.__clinic ? window.__clinic.errors : []")
            if errs:
                raise AssertionError(f"{label}: page errors {errs}")
            if self.ev(done_js):
                # a results screen may still be open
                if self.centre(".rs-next") or self.centre(".rs-done"):
                    self.results_screen()
                    continue
                return time.time() - t0
            if self.centre(".rs-next") or self.centre(".rs-done"):
                self.shot(f"{label}-results")
                self.results_screen()
                continue
            # onboarding overlay: tap the light (the ghost finger's target)
            if self.centre(".ob-root, .njg-ob, .ob-layer"):
                pass
            e = self.ev("() => window.__clinic && window.__clinic.expect ? window.__clinic.expect() : null")
            stage = e and e.get("stage")
            if stage and stage != last_stage:
                last_stage = stage
                time.sleep(0.2)
                if f"{label}-{stage}" not in self.shot_stages:
                    self.shot_stages.add(f"{label}-{stage}")
                    self.shot(f"{label}-{stage}")
            if not e:
                # between stages: the big button on the right, or a speaking panel's pills
                if self.tap_say(None):
                    continue
                c = self.centre(".cl-go.throb, .cl-go")
                if c and c["onscreen"]:
                    self.tap_xy(c["x"], c["y"])
                time.sleep(0.15)
                continue
            k = e.get("kind")
            wrong_key = f"{label}:{stage}"
            if self.mistakes and e.get("wrong") and wrong_key not in self.wrong_done and k in ("tap", "act", "belt"):
                if self.tap_sel(e["wrong"], need_clear=(k != "belt")):
                    self.wrong_done.add(wrong_key)
                    time.sleep(0.9)
                    continue
            if k in ("tap", "act"):
                if not self.tap_sel(e["target"]):
                    time.sleep(0.1)
                else:
                    time.sleep(0.25)
            elif k == "point":
                self.tap_xy(e["x"], e["y"])
                time.sleep(0.3)
            elif k == "belt":
                c = self.centre(e["target"])
                # tap it once it's well inside the track
                if c and c["onscreen"] and c["x"] < self.vp["width"] * 0.85:
                    self.tap_xy(c["x"], c["y"])
                    time.sleep(0.4)
                else:
                    time.sleep(0.05)
            elif k == "say":
                self.tap_say(e.get("choice"))
                time.sleep(0.3)
            elif k == "game":
                if self.play_cut and e.get("game") == "cut":
                    pass  # the reference game's own driver lives in its lab test
                time.sleep(0.4)
                self.shot(f"{label}-heal-{e.get('game')}")
                self.ev("() => window.__clinic.finishHeal()")
                time.sleep(0.4)
            elif k == "button":
                c = self.centre(".cl-go")
                if c:
                    self.tap_xy(c["x"], c["y"])
                time.sleep(0.2)
            else:
                time.sleep(0.1)
        raise AssertionError(f"{label}: timed out (last expect {self.ev('() => window.__clinic.expect()')})")

    def tap_say(self, choice):
        # the shared Say panel (pills), or the clinic's own pills
        sel = None
        if choice:
            for s in (f'.njg-say .pill[data-choice="{choice}"]', f'.cl-pill[data-choice="{choice}"]'):
                if self.centre(s):
                    sel = s
                    break
        else:
            for s in (".njg-say.live .pill", ".njg-say .pill", ".cl-pill"):
                if self.centre(s):
                    sel = s
                    break
        if not sel:
            return False
        return self.tap_sel(sel, need_clear=False)


def run_case(p, vp_name, case, args):
    vp = VIEWPORTS[vp_name]
    b = chromium(p)
    ctx = b.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"], is_mobile=vp["touch"])
    page = ctx.new_page()
    logs = []
    page.on("console", lambda m: logs.append(f"{m.type}: {m.text}") if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: logs.append(f"PAGEERROR: {e}"))
    q = case["q"] + "&quiet=1&fast=1" + ("" if case.get("onboard") else "&onboard=0")
    page.goto(f"http://127.0.0.1:{PORT}/clinic.html?{q}")
    page.wait_for_function("() => window.__clinic && window.__clinic.ready", timeout=30000)
    pl = Player(page, vp, args.mistakes, os.path.join(SHOTS, vp_name), args.play_cut)
    try:
        secs = pl.play(case["name"], case.get("done", "() => !!(window.__clinic && window.__clinic.last)"))
        last = page.evaluate("() => { const l = window.__clinic.last; if (!l) return null; if (l.outs) return {outs: l.outs.map((o) => ({who: o.plan.kind, ail: o.plan.ailment, right: o.right, total: o.total}))}; if (l.rows) return {rows: l.rows.map((r) => [r.id, r.ok, r.tested])}; return {right: l.right, total: l.total}; }")
        bad = [l for l in logs if "PAGEERROR" in l or ("error" in l and "Failed to load resource" not in l)]
        pl.shot(f"{case['name']}-end")
        status = "ok" if not bad else "console errors"
        print(f"  {vp_name:14} {case['name']:28} {status:6} {secs:5.1f}s taps={pl.taps} {json.dumps(last)}")
        if bad:
            for l in bad[:5]:
                print("     ", l)
        return not bad
    except Exception as e:
        pl.shot(f"{case['name']}-FAIL")
        print(f"  {vp_name:14} {case['name']:28} FAIL  {e}")
        for l in logs[-6:]:
            print("     ", l)
        return False
    finally:
        b.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--viewport", default="laptop")
    ap.add_argument("--sizes", default=None, help="comma list, e.g. phone,ipad,laptop")
    ap.add_argument("--mistakes", action="store_true")
    ap.add_argument("--only", default=None, help="substring of a case name")
    ap.add_argument("--session", default=None)
    ap.add_argument("--seed", default="7")
    ap.add_argument("--play-cut", action="store_true")
    args = ap.parse_args()
    sizes = args.sizes.split(",") if args.sizes else [args.viewport]
    s = args.seed
    cases = []
    for st, vs in (("waiting", ["W1", "W2", "W3", "W4"]), ("diagnosis", ["D1", "D1b", "D2", "D3"]), ("pharmacy", [None]), ("sendoff", ["E1", "E2", "E3", "E4"])):
        for v in vs:
            lv = {"W1": 1, "W2": 2, "W3": 2, "W4": 3, "D1": 1, "D1b": 2, "D2": 1, "D3": 2, "E1": 1, "E2": 2, "E3": 2, "E4": 3}.get(v)
            for L in ([lv] if lv else [1, 2, 3]):
                cases.append({"name": f"{st}-{v or 'L' + str(L)}", "q": f"stage={st}&level={L}&seed={s}" + (f"&variant={v}" if v else "")})
    for g in ("cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"):
        cases.append({"name": f"heal-{g}", "q": f"stage=heal&game={g}&level=1&seed={s}"})
    for L in (1, 2, 3):
        cases.append({"name": f"patient-L{L}", "q": f"patient=1&level={L}&seed={s}&results=1"})
    sess = args.session or "1"
    cases.append({"name": f"morning-s{sess}", "q": f"morning=1&session={sess}&seed={s}&nosave=1", "onboard": sess == "1", "done": "() => !!(window.__clinic && window.__clinic.last && window.__clinic.last.outs)"})
    if args.only:
        cases = [c for c in cases if args.only in c["name"]]
    start_server()
    ok = True
    with sync_playwright() as p:
        for vp in sizes:
            print(f"== {vp} ({VIEWPORTS[vp]['width']}x{VIEWPORTS[vp]['height']}){' with mistakes' if args.mistakes else ''}")
            for c in cases:
                ok = run_case(p, vp, c, args) and ok
    print("PASS" if ok else "FAIL")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
