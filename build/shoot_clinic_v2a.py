#!/usr/bin/env python3
"""Laptop shots of the clinic v2 prototype (part A: the rooms W, D, P, E).

  python3 build/shoot_clinic_v2a.py                 # every state below, laptop 1366x768
  python3 build/shoot_clinic_v2a.py --only W        # names containing W
  python3 build/shoot_clinic_v2a.py --phone         # 915x412 (phone, landscape) as well

States (each draws something different; VISUAL-QA s5):
  W-L1..W-L5          the waiting room at each rung of the language ladder (the call, the ticks)
  W-L1-right          after the right tick locks in (the person walking to the door)
  W-L3-wrong          a wrong tick shaking
  D1-L1, D1-L2        does it hurt here? (L2 = the old D1b: Next after na)
  D1-L1-haa           after the sore part answered haa (Found it lit)
  D2-L1, D2-L3        where does it hurt (L3: the side said)
  D3-L1, D3-L2, D3-L3 the check-up (L1: right tool + one; first-time cue at L1 with help on)
  (D3 is the standing check-up on CB3b; D1 and D2 sit on the bed's edge on CB2b)
  P-L1, P-L2, P-L3    the belt on CB4c, the tray on the counter strip
  P-L3-tray           the tray part-filled
  E-L1, E-L2, E-L3    the send-off on CB5 (face / said / what helps)
  E-L2-bye            the goodbye in the scene
  E-E4                the child asks first (Nani's whisper the first time)
  help-skip           the ? menu with the grown-ups' skip inside
Output: build/reports/clinic-v2-a/<name>.png
"""
import argparse, os, sys, time, threading, http.server, socketserver
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "reports", "clinic-v2-a")
PORT = int(os.environ.get("CLINIC_TEST_PORT", 8836))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def serve():
    os.chdir(ROOT)

    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

    s = Server(("127.0.0.1", PORT), Q)
    threading.Thread(target=s.serve_forever, daemon=True).start()


def chromium(p):
    for c in ("/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/opt/pw-browsers/chromium"):
        if os.path.isfile(c):
            return p.chromium.launch(executable_path=c)
    return p.chromium.launch()


# name -> (query, action) ; action: None = shot after the card lands; a JS/py callable for later states
STATES = [
    ("W-L1", "stage=waiting&level=1", None),
    ("W-L2", "stage=waiting&level=2", None),
    ("W-L3", "stage=waiting&level=3", None),
    ("W-L4", "stage=waiting&level=4", None),
    ("W-L5", "stage=waiting&level=5", None),
    ("W-L1-right", "stage=waiting&level=1", "right"),
    ("W-L3-wrong", "stage=waiting&level=3", "wrong"),
    ("D1-L1", "stage=diagnosis&variant=D1&level=1", None),
    ("D1-L1-haa", "stage=diagnosis&variant=D1&level=1", "right"),
    ("D1-L2", "stage=diagnosis&variant=D1&level=2", None),
    ("D2-L1", "stage=diagnosis&variant=D2&level=1", None),
    ("D2-L3", "stage=diagnosis&variant=D2&level=3", None),
    ("D3-L1", "stage=diagnosis&variant=D3&level=1&onboard=1", "cue"),
    ("D3-L2", "stage=diagnosis&variant=D3&level=2", None),
    ("D3-L3", "stage=diagnosis&variant=D3&level=3", None),
    ("P-L1", "stage=pharmacy&level=1", "belt"),
    ("P-L2", "stage=pharmacy&level=2", "belt"),
    ("P-L3", "stage=pharmacy&level=3", "belt"),
    ("P-L3-tray", "stage=pharmacy&level=3", "tray"),
    ("E-L1", "stage=sendoff&level=1", None),
    ("E-L2", "stage=sendoff&level=2", None),
    ("E-L1-extra", "stage=sendoff&level=1&seed=4", "extra"),
    ("E-L3", "stage=sendoff&level=3&variant=E2", None),
    ("E-L2-bye", "stage=sendoff&level=2", "bye"),
    ("E-E4", "stage=sendoff&level=3&variant=E4&onboard=1", "cue"),
    ("help-skip", "stage=diagnosis&variant=D3&level=1&onboard=1", "help"),
]


def settle(page, kind_wanted=None, timeout=20):
    t0 = time.time()
    while time.time() - t0 < timeout:
        e = page.evaluate("() => window.__clinic && window.__clinic.expect ? window.__clinic.expect() : null")
        if e and e.get("kind") not in (None, "wait") and (not kind_wanted or e.get("kind") in kind_wanted):
            return e
        time.sleep(0.15)
    return page.evaluate("() => window.__clinic.expect()")


def tap(page, sel):
    c = page.evaluate("(s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + r.height/2}; }", sel)
    if c:
        page.mouse.click(c["x"], c["y"])
    return c


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default=None)
    ap.add_argument("--phone", action="store_true")
    ap.add_argument("--seed", default="7")
    a = ap.parse_args()
    serve()
    os.makedirs(OUT, exist_ok=True)
    sizes = [("laptop", 1366, 768)] + ([("phone", 915, 412)] if a.phone else [])
    with sync_playwright() as p:
        b = chromium(p)
        for vp, w, hgt in sizes:
            for name, q, act in STATES:
                if a.only and a.only not in name:
                    continue
                ctx = b.new_context(viewport={"width": w, "height": hgt})
                page = ctx.new_page()
                errs = []
                page.on("pageerror", lambda e: errs.append(str(e)))
                onb = "" if "onboard=1" in q else "&onboard=0"
                fast = "" if act in ("cue", "help") else "&fast=1"
                page.goto(f"http://127.0.0.1:{PORT}/clinic.html?lab=1&{q}&seed={a.seed}&quiet=1{fast}{onb}&results=0&fresh=1")
                page.wait_for_function("() => window.__clinic && window.__clinic.ready", timeout=30000)
                # the lab's own chrome off: the shot is what a child sees
                page.add_style_tag(content=".cl-lab-bar, .cl-lab-out { display: none !important; }")
                e = settle(page)
                if act == "right" and e:
                    if e.get("kind") in ("tap", "act"):
                        tap(page, e["target"])
                    elif e.get("kind") == "point":
                        page.mouse.click(e["x"], e["y"])
                    time.sleep(0.5)
                    e2 = page.evaluate("() => window.__clinic.expect()")
                    if name.startswith("D1") and e2 and e2.get("kind") == "tap":
                        pass
                    time.sleep(0.4)
                elif act == "wrong" and e and e.get("wrong"):
                    tap(page, e["wrong"])
                    time.sleep(0.15)
                elif act == "belt":
                    time.sleep(1.2)
                elif act == "tray":
                    for _ in range(40):
                        e = page.evaluate("() => window.__clinic.expect()")
                        if e and e.get("kind") == "belt":
                            c = page.evaluate("(s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + r.height/2}; }", e["target"])
                            if c and 40 < c["x"] < w * 0.8:
                                page.mouse.click(c["x"], c["y"])
                                time.sleep(0.5)
                                break
                        time.sleep(0.1)
                    time.sleep(0.3)
                elif act == "bye":
                    for _ in range(60):
                        e = page.evaluate("() => window.__clinic.expect()")
                        if e and e.get("kind") == "tap":
                            tap(page, e["target"])
                        elif e and e.get("kind") == "say":
                            break
                        time.sleep(0.15)
                    time.sleep(0.5)
                elif act == "extra":
                    # a not-happy answer at level 1: the right card, then the one more thing appears by the doctor
                    for _ in range(40):
                        e = page.evaluate("() => window.__clinic.expect()")
                        if e and e.get("kind") == "tap" and "cl-extra" in e.get("target", ""):
                            break
                        if e and e.get("kind") == "tap":
                            tap(page, e["target"])
                        time.sleep(0.2)
                    time.sleep(0.4)
                elif act == "cue":
                    for _ in range(40):
                        if page.query_selector(".njg-onboard.on"):
                            break
                        time.sleep(0.25)
                    time.sleep(1.0)
                elif act == "help":
                    for _ in range(40):
                        if page.query_selector(".njg-onboard.on"):
                            break
                        time.sleep(0.25)
                    time.sleep(0.6)
                    tap(page, ".cl-help-btn")
                    time.sleep(0.6)
                path = os.path.join(OUT, f"{vp}-{name}.png")
                page.screenshot(path=path)
                print(f"{vp:7} {name:12} {'ERR ' + '; '.join(errs) if errs else 'ok'}")
                ctx.close()
        b.close()


if __name__ == "__main__":
    main()
