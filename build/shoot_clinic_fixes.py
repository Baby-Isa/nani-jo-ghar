#!/usr/bin/env python3
"""VISUAL-QA s5 shots of the clinic fixes pass (feedback 13-13k), laptop and phone landscape.

  python3 build/shoot_clinic_fixes.py                  # every state below, laptop 1366x768 and phone 915x412
  python3 build/shoot_clinic_fixes.py --only W         # names containing W
  python3 build/shoot_clinic_fixes.py --sizes laptop

States (each draws something different; VISUAL-QA s5):
  W-L1..W-L5          the waiting room at each rung (6 at most, no twins; the closed card from L3)
  W-L1-right          the picked person risen off the seat
  W-L4-set            W4: both ticks numbered, the set judged (rise)
  W-L3-wrong          a wrong tick shaking
  D1-L2, D2-L1, D3-L1 the diagnosis (D1: the answer pills; D3: first-time ghost finger)
  P-L1..P-L3          the pharmacy ("[Bring me]", the sequence at L3, the closed card at L3)
  P-L2-tray, P-L2-full   the tray part-filled (no outline on a filled dish) and full (the ✓ Done)
  E-L1, E-L2, E-L3    the send-off (people left; the thought bubble; the help tray from L3)
  E-L2-bye            the goodbye pills (only then)
  H-<game>-L1/L3-start|mid   every heal game at L1 and L3 (foot L3: both feet), in the heal lab
  end-clinic, end-cook       the shared end screen with each mode's actions (then composed side by side)
  btn-clinic, btn-cook       the ✓ Done and → Next buttons in each mode (composed side by side)
Output: build/reports/clinic-v2-fixes/<size>-<name>.png, and sidebyside-end.png / sidebyside-buttons.png
"""
import argparse, os, sys, time, threading, http.server, socketserver
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "build", "reports", "clinic-v2-fixes")
PORT = int(os.environ.get("CLINIC_SHOOT_PORT", 8837))


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
    ("W-L4", "stage=waiting&level=4&variant=W1", None),
    ("W-L5", "stage=waiting&level=5", None),
    ("W-L1-right", "stage=waiting&level=1", "right"),
    ("W-L4-set", "stage=waiting&level=4&variant=W4", "set"),
    ("W-L3-wrong", "stage=waiting&level=3", "wrong"),
    ("D1-L2", "stage=diagnosis&variant=D1&level=2", "right"),
    ("D2-L1", "stage=diagnosis&variant=D2&level=1", None),
    ("D3-L1", "stage=diagnosis&variant=D3&level=1&onboard=1", "cue"),
    ("P-L1", "stage=pharmacy&level=1", "belt"),
    ("P-L2", "stage=pharmacy&level=2", "belt"),
    ("P-L3", "stage=pharmacy&level=3", "belt"),
    ("P-L2-tray", "stage=pharmacy&level=2", "tray"),
    ("P-L2-full", "stage=pharmacy&level=2", "full"),
    ("E-L1", "stage=sendoff&level=1", None),
    ("E-L2", "stage=sendoff&level=2", None),
    ("E-L3", "stage=sendoff&level=3&variant=E2", None),
    ("E-L2-bye", "stage=sendoff&level=2", "bye"),
]
HEAL = ["cut", "knee", "ear", "tooth", "taste", "fever", "boing", "eye", "foot"]


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
    ap.add_argument("--sizes", default="laptop,phone")
    ap.add_argument("--seed", default="7")
    a = ap.parse_args()
    serve()
    os.makedirs(OUT, exist_ok=True)
    SZ = {"laptop": ("laptop", 1366, 768), "phone": ("phone", 915, 412)}
    sizes = [SZ[s] for s in a.sizes.split(",")]
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
                elif act == "full":
                    for _ in range(200):
                        e = page.evaluate("() => window.__clinic.expect()")
                        if e and e.get("kind") == "tap" and "done" in e.get("target", ""):
                            break
                        if e and e.get("kind") == "belt":
                            c = page.evaluate("(s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return {x: r.left + r.width/2, y: r.top + r.height/2}; }", e["target"])
                            if c and 40 < c["x"] < w * 0.8:
                                page.mouse.click(c["x"], c["y"])
                                time.sleep(0.5)
                        time.sleep(0.08)
                    time.sleep(0.4)
                elif act == "set":
                    for _ in range(2):
                        e = page.evaluate("() => window.__clinic.expect()")
                        if e and e.get("kind") == "tap":
                            tap(page, e["target"])
                            time.sleep(0.25)
                    time.sleep(0.9)
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
            if not a.only or "H-" in a.only or a.only in "H-":
                heal_shots(b, vp, w, hgt, a)
            if not a.only or "end" in a.only or "btn" in a.only:
                end_shots(b, vp, w, hgt)
        b.close()
    compose()


def heal_shots(b, vp, w, hgt, a):
    """Every heal game at L1 and L3 in the heal lab (first-time help on: the ghost finger), at the start and mid-way."""
    for game in HEAL:
        for L in (1, 3):
            name = f"H-{game}-L{L}"
            if a.only and a.only not in name:
                continue
            ctx = b.new_context(viewport={"width": w, "height": hgt})
            page = ctx.new_page()
            errs = []
            page.on("pageerror", lambda e: errs.append(str(e)))
            page.goto(f"http://127.0.0.1:{PORT}/lab/clinic-heal-host.html?quiet=1")
            page.wait_for_function(f"window.__heal && Clinic.Heal.has('{game}')", timeout=15000)
            page.evaluate("""([g, L]) => {
              const out = document.getElementById("lab-out"); if (out) out.style.display = "none";
              const bar = document.getElementById("lab"); if (bar) bar.style.display = "none";
              document.getElementById("lab-game").value = g;
              document.getElementById("lab-level").value = String(L);
              document.getElementById("lab-seed").value = "21";
              document.getElementById("lab-side").value = "";
              __heal.mount();
            }""", [game, L])
            page.wait_for_function("__heal.run && __heal.run.controller && __heal.run.controller.debug", timeout=15000)
            time.sleep(1.6)
            page.screenshot(path=os.path.join(OUT, f"{vp}-{name}-start.png"))
            # a few moves in (the help moves on as the child acts)
            import heal_play
            pl = heal_play.Play(page, game, L, vp, 21, None)
            n = 0
            t0 = time.time()
            while n < 7 and time.time() - t0 < 20 and not page.evaluate("!!__heal.result"):
                act = page.evaluate("__heal.run.controller.debug.next()")
                try:
                    pl.act(act)
                except Exception:
                    time.sleep(0.2)
                if act.get("do") != "wait":
                    n += 1
            time.sleep(0.5)
            page.screenshot(path=os.path.join(OUT, f"{vp}-{name}-mid.png"))
            print(f"{vp:7} {name:12} {'ERR ' + '; '.join(errs) if errs else 'ok'}")
            ctx.close()


END_JS = """([actions]) => {
  const words = [{kutchi: "ba", english: "two", right: true}, {kutchi: "pela", english: "first", right: true}, {kutchi: "dabo", english: "left", right: false}];
  const shown = Results.show({mode: "qa", game: "qa", level: 1, timeMs: 52000, right: 4, total: 5, hints: 1, words, sound: false, actions, container: document.body});
  return true;
}"""


def end_shots(b, vp, w, hgt):
    """The shared end screen with each mode's own actions, and the Done / Next buttons in each mode."""
    for mode, url in (("clinic", "clinic.html?lab=1&stage=waiting&level=1&quiet=1&fast=1&onboard=0&results=0"), ("cook", "cook.html?quiet=1")):
        ctx = b.new_context(viewport={"width": w, "height": hgt})
        page = ctx.new_page()
        page.goto(f"http://127.0.0.1:{PORT}/{url}")
        page.wait_for_function("() => !!window.Results", timeout=30000)
        time.sleep(1.2)
        page.add_style_tag(content=".cl-lab-bar, .cl-lab-out { display: none !important; }")
        actions = (page.evaluate("() => NjgButtons.endActions({next: 'Next'})") if mode == "clinic"
                   else [{"id": "again", "label": "Again", "icon": "again", "elId": "lab-again"}, {"id": "list", "label": "All stations", "icon": "grid", "elId": "lab-list", "primary": True}])
        page.evaluate(END_JS, [actions])
        time.sleep(0.6)
        nx = page.query_selector(".njg-results .rs-next")
        if nx:
            nx.click()
            time.sleep(0.6)
        page.screenshot(path=os.path.join(OUT, f"{vp}-end-{mode}.png"))
        page.evaluate("() => { const r = document.querySelector('.njg-results'); if (r) r.remove(); }")
        if mode == "clinic":
            page.evaluate("""() => { const m = document.querySelector('.cl-actions'); m.innerHTML = '';
              const n = NjgButtons.next(m, 'To the bench', () => {}); n.classList.add('cl-go'); NjgButtons.done(m, () => {}); }""")
        else:
            page.evaluate("""() => { const d = document.getElementById('done-btn'); if (d) d.classList.remove('hidden');
              const g = document.getElementById('go-btn'); if (g) { g.classList.remove('hidden'); g.classList.add('ds'); g.querySelector('.go-t').textContent = 'To the grill'; g.style.right = '14%'; } }""")
        time.sleep(0.4)
        page.screenshot(path=os.path.join(OUT, f"{vp}-btn-{mode}.png"))
        print(f"{vp:7} end/btn {mode} ok")
        ctx.close()


def compose():
    try:
        from PIL import Image
    except Exception:
        return
    for vp in ("laptop", "phone"):
        for kind in ("end", "btn"):
            a, c = os.path.join(OUT, f"{vp}-{kind}-clinic.png"), os.path.join(OUT, f"{vp}-{kind}-cook.png")
            if not (os.path.exists(a) and os.path.exists(c)):
                continue
            A, C = Image.open(a), Image.open(c)
            out = Image.new("RGB", (A.width + C.width + 20, max(A.height, C.height)), "white")
            out.paste(A, (0, 0))
            out.paste(C, (A.width + 20, 0))
            out.save(os.path.join(OUT, f"sidebyside-{kind}-{vp}.png"))


if __name__ == "__main__":
    main()
