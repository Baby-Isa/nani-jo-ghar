#!/usr/bin/env python3
"""Sidebar v3 screenshots (docs/cook-ui-feedback-2026-09-28.md 10; docs/VISUAL-QA.md).

Plays Cook's Station lab with a seeded Math.random (the same order every time),
using build/test_cook.py's Player for the moves, and pictures each state of
the request pop-up, the sidebar, the Done button and the word review.

  python3 build/shoot_sidebar_v2.py                     # laptop only (iterating: VISUAL-QA 0)
  python3 build/shoot_sidebar_v2.py --all               # laptop 1366x768 and phone 390x844 (landscape 844x390 in play)
  python3 build/shoot_sidebar_v2.py --only skewers,chai # some states
  python3 build/shoot_sidebar_v2.py --dump              # print the sidebar's text for each state (no pictures)

Pictures go to build/reports/sidebar-v3/ as {viewport}-{state}.jpg.
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_cook as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

OUT = os.path.join(T.ROOT, "build", "reports", "sidebar-v3")
VIEWPORTS = {
    "laptop": {"width": 1366, "height": 768, "touch": False},
    # the phone plays sideways (cook.html asks to rotate in portrait); the portrait shot is the rotate card and the word review
    "phone": {"width": 844, "height": 390, "touch": True},
    "phone-portrait": {"width": 390, "height": 844, "touch": True},
}

# a seeded Math.random, so each state is the same order every run
SEED_JS = """
(() => {
  const m = /[?&]seed=(\\d+)/.exec(location.search);
  if (!m) return;
  let s = +m[1] >>> 0;
  Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
})();
"""

# state: (station, level, seed, moves before the sidebar shot, extra)
STATES = {
    "pantry": ("fetch", 2, 3, 2, {}),
    "pantry-muted": ("fetch", 2, 3, 1, {"muted": True}),
    "chai": ("chai-tray", 2, 5, 3, {}),
    "skewers": ("mishkaki-grill", 3, None, 3, {"want": "mixed"}),
    "chaat": ("assemble", 2, 4, 2, {}),
    "tadka": ("tadka", 2, 4, 2, {}),
    "maani": ("maani-line", 2, 4, 0, {}),
    "stir": ("stir", 1, 4, 0, {"done": True}),
}


def open_page(pw, vp, seed, muted=False):
    # the web fonts through the environment's proxy when there is one (the pictures should show Baloo 2, as players see it)
    proxy = os.environ.get("HTTPS_PROXY")
    browser = pw.chromium.launch(
        executable_path="/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None,
        args=["--autoplay-policy=no-user-gesture-required"] + (["--ignore-certificate-errors"] if proxy else []),
        proxy={"server": proxy, "bypass": "127.0.0.1"} if proxy else None,
    )
    ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"], device_scale_factor=1)
    ctx.add_init_script(SEED_JS)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    url = f"http://127.0.0.1:{T.PORT}/cook.html?speed=3&seed={seed or 1}"
    page.goto(url)
    page.evaluate("localStorage.clear()")
    page.goto(url)
    page.wait_for_selector("#panel h1", timeout=20000)
    page.evaluate("document.fonts && document.fonts.ready")
    if muted:
        page.evaluate("NaniGuide.setMuted(true)")
    return browser, page, errors


def side_text(page):
    return page.evaluate("""() => {
      const t = (s) => { const e = document.querySelector(s); return e ? e.innerText.replace(/\\n+/g, ' | ') : ''; };
      return { guide: t('#guide'), mission: t('#mission'), intro: t('#intro:not(.hidden)') };
    }""")


def lab(page, key, level):
    page.evaluate(f"() => {{ __cook.lab('{key}', false, {{ level: {level} }}); }}")
    page.wait_for_function("document.querySelector('#overlay').classList.contains('hidden')", timeout=10000)


def moves(P, n, stop=None):
    """n moves after the intro card (the intro itself isn't counted)."""
    done = 0
    t0 = time.time()
    while done < n and time.time() - t0 < 60:
        e = P.exp()
        if not e or e["kind"] == "wait":
            time.sleep(0.1)
            continue
        if stop and stop(e):
            return e
        if e.get("intro"):
            P.page.click("#intro .ic-card", force=True)
            P.wait_change(e, 10)
            continue
        if e["kind"] == "click" and "done-btn" in e.get("selector", ""):
            return e
        P.act(e)
        P.wait_change(e, 20)
        done += 1
    return P.exp()


def shoot(page, name, vpname):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{vpname}-{name}.jpg")
    page.screenshot(path=path, type="jpeg", quality=88)
    print("  ", os.path.relpath(path, T.ROOT))
    return path


def find_seed(pw, vp, key, level, want):
    """A seed whose mishkaki order has a mixed skewer and another kind (two groups)."""
    for seed in range(1, 60):
        browser, page, _ = open_page(pw, vp, seed)
        lab(page, key, level)
        time.sleep(1.2)
        txt = side_text(page)["intro"]
        browser.close()
        if want in txt and txt.count("lakri") >= 2:
            return seed
    return 1


def run_state(pw, vpname, name, dump=False):
    vp = VIEWPORTS[vpname]
    key, level, seed, n, extra = STATES[name]
    if seed is None:
        seed = find_seed(pw, vp, key, level, extra["want"])
    browser, page, errors = open_page(pw, vp, seed, muted=extra.get("muted", False))
    P = T.Player(page, OUT, 3, mistakes=False)
    try:
        lab(page, key, level)
        page.wait_for_selector("#intro:not(.hidden) .ic-card", timeout=15000)
        time.sleep(1.0)
        if dump:
            print(name, "popup", side_text(page))
        else:
            shoot(page, f"{name}-popup", vpname)
        e = moves(P, n)
        if extra.get("done"):
            e = moves(P, 400, stop=lambda x: x["kind"] == "click" and "done-btn" in x.get("selector", ""))
        time.sleep(0.8)
        if dump:
            print(name, "sidebar", side_text(page))
        else:
            shoot(page, f"{name}-sidebar", vpname)
    finally:
        browser.close()
    if errors:
        print("   page errors:", errors[:3])


REVIEW_JS = """() => {
  // a mixed round with the game's own words (data/cook.json): two missed, five right
  const W = Cook.data.words;
  const w = (id, right) => ({ id, kutchi: W[id].kutchi, english: W[id].english, right });
  const ids = Object.keys(W);
  const find = (k) => ids.find((id) => W[id].kutchi === k);
  const words = [w(find("dudh"), false), w(find("elchi"), false), w(find("khun"), true), w(find("chai"), true), w(find("aadu"), true), w(find("trae"), true), w(find("gos"), true)];
  Results.show({ mode: "cook", game: "fetch", level: 1, timeMs: 42000, right: 5, total: 7, hints: 1, words, onDone() {} });
}"""


def run_review(pw, vpname):
    """The end-of-round screen with a mixed round: the badges, then the word review."""
    vp = VIEWPORTS[vpname]
    browser, page, errors = open_page(pw, vp, 3)
    try:
        page.evaluate(REVIEW_JS)
        time.sleep(3.5)
        shoot(page, "results-badges", vpname)
        page.click(".njg-results .rs-next")
        time.sleep(1.2)
        shoot(page, "word-review", vpname)
    finally:
        browser.close()
    if errors:
        print("   page errors:", errors[:3])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--only", default="")
    ap.add_argument("--dump", action="store_true")
    ap.add_argument("--no-review", action="store_true")
    args = ap.parse_args()
    T.start_server()
    names = [s for s in args.only.split(",") if s] or list(STATES)
    vps = ["laptop", "phone", "phone-portrait"] if args.all else ["laptop"]
    with sync_playwright() as pw:
        for vpname in vps:
            print(vpname)
            if vpname != "phone-portrait":
                for name in names:
                    if name == "review":
                        continue
                    run_state(pw, vpname, name, dump=args.dump)
            if not args.dump and not args.no_review and (not args.only or "review" in names):
                run_review(pw, vpname)


if __name__ == "__main__":
    main()
