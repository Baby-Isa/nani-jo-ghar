#!/usr/bin/env python3
"""Browser test for healing-game agent B's games (taste, fever, boing) on the
core's real host (lab/clinic-heal-host.html, js/clinic/heal/host.js).

Plays each game fairly at each level through REAL pointer events at screen
coordinates, read from the game controller's expect() (what it wants next)
and the patient's hotspots: dish taps in the sidebar or the taste rack,
taps on the mouth / the patient / an arm, the fan's rhythm, the count-down
pills of the shared speaking moment, Done. Before every tap it checks that
the element at that point belongs to the thing being tapped (nothing
covers it). A fair game must end with every row right; any console error
fails. With --mistakes it makes one deliberate wrong move per game first
(the review must count it, the game must still finish).

Usage:
  COOK_TEST_PORT=8822 python3 build/test_clinic_heal_b.py            # phone, iPad, laptop; levels 1-3
  python3 build/test_clinic_heal_b.py --only boing --level 2 --viewport ipad
  python3 build/test_clinic_heal_b.py --mistakes
Screenshots: build/screenshots/clinic-heal-b/<viewport>/.
"""
import argparse
import http.server
import os
import socketserver
import sys
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("COOK_TEST_PORT", 8822))
VIEWPORTS = {
    "phone": {"width": 915, "height": 375, "touch": True},
    "ipad": {"width": 1024, "height": 768, "touch": True},
    "laptop": {"width": 1366, "height": 768, "touch": False},
}
GAMES = ["taste", "fever", "boing"]
SHOTS = os.path.join(ROOT, "build", "screenshots", "clinic-heal-b")
CHROME = "/opt/pw-browsers/chromium"


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


HELPERS = """() => {
window.__pt = (part, side) => {
  const r = __heal.run.ctx.stage.getBoundingClientRect();
  const h = __heal.run.ctx.patient.hotspot(part, side || null);
  return [r.left + h.x, r.top + h.y, h.r];
};
window.__center = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const b = el.getBoundingClientRect();
  return [b.left + b.width / 2, b.top + b.height / 2, b.width, b.height];
};
window.__at = (x, y) => {
  const el = document.elementFromPoint(x, y);
  if (!el) return "";
  const path = [];
  for (let n = el; n && n.nodeType === 1; n = n.parentNode) path.push((n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className) + "#" + (n.dataset ? (n.dataset.item || n.dataset.slot || n.dataset.choice || "") : ""));
  return path.join(" < ");
};
}"""


class Player:
    def __init__(self, page, shots, mistakes):
        self.page, self.shots, self.mistakes = page, shots, mistakes
        self.n = 0
        self.mistake_made = False

    def shot(self, name):
        self.n += 1
        self.page.screenshot(path=os.path.join(self.shots, f"{self.n:03d}-{name}.png"))

    def ev(self, js):
        return self.page.evaluate(js)

    def exp(self):
        return self.ev("__heal.run && __heal.run.controller && __heal.run.controller.expect ? __heal.run.controller.expect() : null")

    def tap(self, x, y, want, what):
        at = self.ev(f"__at({x}, {y})")
        if want not in at:
            raise AssertionError(f"{what}: covered at ({x:.0f},{y:.0f}) by {at[:160]!r} (wanted {want!r})")
        self.page.mouse.click(x, y)
        time.sleep(0.05)

    def tap_sel(self, sel, want, what):
        c = self.ev(f"__center({sel!r})")
        if not c:
            raise AssertionError(f"{what}: {sel} not found")
        self.tap(c[0], c[1], want, what)

    def dish(self, i, what):
        self.tap_sel(f".cl-side .cl-dish[data-slot='{i}']", "cl-dish", what)

    def patient(self, part, side=None, layer="layer", dy=0.0):
        x, y, r = self.ev(f"__pt({part!r}, {side!r})" if side else f"__pt({part!r})")
        self.tap(x, y + dy * r, layer, f"tap {part} {side or ''}")

    def done(self):
        self.tap_sel(".cl-actions .cl-go.done", "cl-go", "Done")

    def wait_exp(self, pred, timeout=8.0, what="the game"):
        t0 = time.time()
        while time.time() - t0 < timeout:
            e = self.exp()
            if e is not None and pred(e):
                return e
            time.sleep(0.08)
        raise AssertionError(f"timed out waiting for {what}; expect() = {self.exp()}")

    # ---------------- taste ----------------
    def play_taste(self):
        e = self.wait_exp(lambda e: True, what="taste to start")
        self.shot("taste-start")
        guard = 0
        while guard < 40:
            guard += 1
            e = self.exp()
            if e.get("action") == "done":
                self.wait_exp(lambda e: e.get("finished"), what="taste to finish")
                self.shot("taste-end")
                self.done()
                return
            if self.mistakes and not self.mistake_made and e["kind"] == "taste":
                wrong = self.ev(f"[...document.querySelectorAll('.tst-dish[data-item]')].map(d => d.dataset.item).find(k => k !== {e['item']!r} && ['limu','khun','loon','marcha'].includes(k))")
                self.tap_sel(f".tst-dish[data-item='{wrong}']", "tst-dish", "the wrong dropper")
                self.tap_sel(".tst .hit", "hit", "the mouth")
                self.mistake_made = True
                time.sleep(0.4)
                continue
            if e.get("holding") != e["item"]:
                self.tap_sel(f".tst-dish[data-item='{e['item']}']", "tst-dish", f"dish {e['item']}")
            for _ in range(e.get("count") or 1):
                self.tap_sel(".tst .hit", "hit", "the mouth")
            if e.get("count"):
                if self.n < 3:
                    self.shot("taste-counting")
                self.tap_sel(f".tst-dish[data-item='{e['item']}']", "tst-dish", "put the dropper down")
            time.sleep(0.25)
            if self.n < 2:
                self.shot("taste-face")
        raise AssertionError("taste: too many moves")

    # ---------------- fever ----------------
    def play_fever(self):
        e = self.wait_exp(lambda e: True, what="fever to start")
        self.shot("fever-start")
        guard = 0
        while guard < 60:
            guard += 1
            e = self.exp()
            a = e.get("action")
            if a == "ended":
                return
            if a == "temp":
                if e.get("holding") != "thermometer":
                    self.dish(e["dish"], "the thermometer")
                self.patient("head")
                time.sleep(0.3)
                self.shot("fever-reading")
                continue
            if a == "close":
                held = e["holding"]
                idx = self.ev(f"__heal.run.ctx.tray.findIndex(t => String(t.id).replace(/-(red|blue|green|yellow)$/, '') === {held!r})")
                self.dish(idx, "put it down")
                continue
            if a == "done":
                self.shot("fever-just-right")
                self.done()
                self.wait_exp(lambda e: e.get("action") == "ended", what="fever to end")
                return
            if self.mistakes and not self.mistake_made and not e.get("count") and not e.get("speed"):
                # the opposite direction once: the patient says it again, the review counts it
                wrong = "blanket" if e["dir"] == "cool" else "cloth"
                idx = self.ev(f"__heal.run.ctx.tray.findIndex(t => String(t.id).startsWith({wrong!r}))")
                if e.get("holding") != wrong:
                    self.dish(idx, f"the wrong {wrong}")
                self.patient("chest")
                self.mistake_made = True
                time.sleep(0.3)
                continue
            item = e["item"]
            if item == "off":
                if e.get("holding"):
                    idx = self.ev(f"__heal.run.ctx.tray.findIndex(t => String(t.id).startsWith({e['holding']!r}))")
                    self.dish(idx, "put it down first")
                self.patient("tummy")
                time.sleep(0.2)
                continue
            if e.get("holding") != item:
                self.dish(e["dish"], item)
            n = e.get("count") or (4 if e.get("speed") else 1)
            gap = {"jaldi": 0.18, "aastethi": 0.85}.get(e.get("speed"), 0.12)
            for k in range(n):
                self.patient("head" if item in ("cloth", "fan") else "chest")
                if k < n - 1:
                    time.sleep(gap)
            if item == "fan" or e.get("count"):
                if self.n < 4:
                    self.shot(f"fever-{item}")
                self.dish(e["dish"], "put it down")
            time.sleep(0.2)
            if item == "blanket" and self.n < 5:
                self.shot("fever-blanket")
        raise AssertionError("fever: too many moves")

    # ---------------- boing ----------------
    def play_boing(self):
        e = self.wait_exp(lambda e: True, what="boing to start")
        self.shot("boing-start")
        guard = 0
        while guard < 60:
            guard += 1
            e = self.exp()
            a = e.get("action")
            if a == "ended":
                return
            if e["phase"] == "wipe":
                if e.get("holding") != "cotton":
                    self.dish(e["dish"], "the cotton")
                n = e["count"] + (1 if self.mistakes and not self.mistake_made else 0)
                self.mistake_made = self.mistake_made or self.mistakes
                for _ in range(n):
                    self.patient("arm", e["side"])
                    time.sleep(0.08)
                self.shot("boing-wiped")
                self.dish(e["dish"], "put the cotton down")
                continue
            if a == "say":
                sel = f".njg-say.live .pill[data-choice='{e['choice']}'], .njg-say .pills .pill[data-choice='{e['choice']}'], .bng-pills [data-choice='{e['choice']}']"
                t0 = time.time()
                while time.time() - t0 < 12 and not self.ev(f"!!document.querySelector({sel!r})"):
                    time.sleep(0.1)
                if self.n < 4:
                    self.shot("boing-count")
                live = self.ev("!!document.querySelector('.njg-say.live') || !!document.querySelector('.bng-pills')")
                if not live:
                    time.sleep(0.3)
                self.tap_sel(sel.split(", ")[0] if self.ev("!!document.querySelector('.njg-say.live')") else sel, "pill" if self.ev("!!document.querySelector('.njg-say')") else "bng-pills", f"say {e['label']}")
                self.wait_exp(lambda x, e=e: x.get("action") != "say" or x.get("choice") != e["choice"], what="the next number")
                if self.exp()["phase"] == "after":
                    time.sleep(0.25)
                    self.shot("boing-boing")
                continue
            if a == "apply":
                if e.get("holding") != e["item"]:
                    self.dish(e["dish"], e["item"])
                if e.get("colour"):
                    self.tap_sel(f".bng-choice[data-choice='{e['colour']}']", "bng-choice", "the plaster colour")
                self.patient("arm" if e["item"] == "plaster" else "hand", e["arm"])
                time.sleep(0.2)
                continue
            if a == "done":
                self.shot("boing-end")
                self.done()
                return
        raise AssertionError("boing: too many moves")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", default=GAMES)
    ap.add_argument("--level", type=int, nargs="*", default=[1, 2, 3])
    ap.add_argument("--viewport", nargs="*", default=list(VIEWPORTS))
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--mistakes", action="store_true")
    a = ap.parse_args()
    httpd = start_server()
    fails = []
    with sync_playwright() as pw:
        exe = CHROME if os.path.exists(CHROME) else None
        browser = pw.chromium.launch(executable_path=exe, args=["--autoplay-policy=no-user-gesture-required"])
        for vpn in a.viewport:
            vp = VIEWPORTS[vpn]
            shots = os.path.join(SHOTS, vpn)
            os.makedirs(shots, exist_ok=True)
            for f in os.listdir(shots):
                if f.endswith(".png"):
                    os.remove(os.path.join(shots, f))
            ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"], device_scale_factor=1)
            # the fonts are external (offline here): don't wait on them
            ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
            ctx.route("**/fonts.gstatic.com/**", lambda r: r.abort())
            page = ctx.new_page()
            errors = []
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "net::ERR_FAILED" not in m.text and "ERR_BLOCKED" not in m.text else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(f"http://127.0.0.1:{PORT}/lab/clinic-heal-host.html?quiet=1&fast=1")
            page.wait_for_function("window.__heal && window.Clinic && Clinic.Heal.has('taste') && Clinic.Heal.has('fever') && Clinic.Heal.has('boing')", timeout=20000)
            page.evaluate(HELPERS)
            # onboarding is the shared kit's (tested there); here it would cover the first taps
            page.evaluate("window.Onboard && (Onboard.run = async () => 'skipped'); document.getElementById('lab').classList.add('min'); document.getElementById('lab-out').style.display = 'none'")
            pl = Player(page, shots, a.mistakes)
            for game in a.only:
                for level in a.level:
                    errors.clear()
                    pl.mistake_made = False
                    label = f"{vpn:7} {game:6} L{level}"
                    try:
                        page.evaluate(f"""(() => {{
                          const $ = (id) => document.getElementById(id);
                          $('lab-game').value = {game!r}; $('lab-level').value = '{level}';
                          $('lab-side').value = ''; $('lab-seed').value = '{a.seed + level}';
                          $('lab-kind').value = {'nana' if game == 'fever' else 'girl'!r};
                          window.__heal.mount();
                        }})()""")
                        time.sleep(0.3)
                        getattr(pl, f"play_{game}")()
                        page.wait_for_function("window.__heal.result", timeout=15000)
                        r = page.evaluate("({right: __heal.result.right, total: __heal.result.total, log: __heal.result.log.filter(e => e.type !== 'right').map(e => e.type + ':' + e.rowId).join(' ')})")
                        ok = r["right"] == r["total"] if not a.mistakes else r["right"] < r["total"]
                        status = "ok" if ok and not errors else "FAIL"
                        print(f"  {label}  {r['right']}/{r['total']}  {status}  {r['log'][:90]}", flush=True)
                        if not ok:
                            fails.append(f"{label}: {r['right']}/{r['total']} ({'a fair game must be all right' if not a.mistakes else 'the mistake must count'})")
                        if errors:
                            fails.append(f"{label}: console errors: {errors[:3]}")
                    except Exception as ex:  # noqa: BLE001
                        fails.append(f"{label}: {ex}")
                        print(f"  {label}  FAIL {str(ex)[:220]}", flush=True)
                        pl.shot(f"FAIL-{game}-L{level}")
            ctx.close()
        browser.close()
    if httpd:
        httpd.shutdown()
    print("\n" + ("FAIL\n  " + "\n  ".join(fails) if fails else "PASS"))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
