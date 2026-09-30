#!/usr/bin/env python3
"""The order model (docs/design-language/ui-design-system.md 12; docs/archive/process/VISUAL-QA.md): Cook's sidebar and request
pop-up drawn by the shared order card (js/shared/order-card.js).

  python3 build/shoot_order_model.py                 # laptop only (iterating: VISUAL-QA 0)
  python3 build/shoot_order_model.py --all           # laptop 1366x768 and phone (844x390: the game plays sideways)
  python3 build/shoot_order_model.py --only mishkaki,chai
  python3 build/shoot_order_model.py --dump          # the sidebar's text per state (no pictures)

States (the game's own order generator, kept to the order wanted; build/reports/order-model/{viewport}-{state}.jpg):
  mishkaki   level 4: ba lakri gos + two different mixed skewers (pop-up, sidebar mid-threading)
  maani      level 3: hakri maani + ba bajr ji maani (pop-up, sidebar)
  chai       level 1: a single chai (pop-up; the sidebar at the tray, parts straight under the headline; the pop-up again)
  fold       level 2 Chai tray: one person folded, one open
  pantry, chaat, tadka, samosa   the other stations (--only; not in the default set)
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shoot_sidebar_v3 as V  # noqa: E402
import test_cook as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

OUT = os.path.join(T.ROOT, "build", "reports", "order-model")
VIEWPORTS = {
    "laptop": {"width": 1366, "height": 768, "touch": False},
    # the game plays sideways on a phone (390x844 portrait is the "turn your phone" card; lab/order-card.html shows the card at 390 wide)
    "phone": {"width": 844, "height": 390, "touch": True},
}

# keep the recipe's own generator, but only the order wanted (tries until it makes one)
WANT_JS = {
    "mishkaki": """(() => { const R = Cook.Recipes.mishkaki; const make = R.make; R.make = (who, o) => { for (let n = 0; n < 4000; n++) { const d = make(who, o);
        if ((d.skewers['ph-meat'] || 0) === 2 && (d.skewers['ph-mixed'] || 0) === 2 && !d.skewers['ph-veg'] && d.pattern2) return d; } return make(who, o); }; })()""",
    "maani": """(() => { const R = Cook.Recipes.maani; const make = R.make; R.make = (who, o) => { for (let n = 0; n < 4000; n++) { const d = make(who, o);
        const t = d.maani || {}; if (t['cook-maani'] === 1 && t['cook-bajrmaani'] === 2) return d; } return make(who, o); }; })()""",
}
STATES = {
    # state: (lab station, level, want, moves after the pop-up before the sidebar shot)
    "mishkaki": ("mishkaki-grill", 4, "mishkaki", 6),
    "maani": ("maani-line", 3, "maani", 4),
    "chai": ("chai-tray", 1, None, None),
    "fold": ("chai-tray", 2, None, None),
    # the other stations (checked while iterating; not in the report's matrix)
    "pantry": ("fetch", 2, None, 2),
    "chaat": ("assemble", 2, None, 2),
    "tadka": ("tadka", 2, None, 2),
    "samosa": ("samosa", 2, None, 2),
}
MATRIX = ["mishkaki", "maani", "chai", "fold"]


def shoot(page, vpname, name):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{vpname}-{name}.jpg")
    page.screenshot(path=path, type="jpeg", quality=88)
    print("  ", os.path.relpath(path, T.ROOT))


def side_dump(page, label):
    print(label, V.side_text(page))


def play(P, until, limit=200):
    """Play the station's moves until until(page) holds; True if it did."""
    page = P.page
    t0 = time.time()
    while time.time() - t0 < limit:
        if until(page):
            return True
        e = P.exp()
        if not e or e["kind"] == "wait":
            time.sleep(0.1)
            continue
        if e.get("intro"):
            page.click("#intro .ic-card", force=True)
            P.wait_change(e, 10)
            continue
        if e["kind"] == "click" and ("#lab-list" in e.get("selector", "") or "done-btn" in e.get("selector", "")):
            return until(page)
        P.act(e)
        P.wait_change(e, 20)
    return False


def run(pw, vpname, name, dump=False):
    key, level, want, n = STATES[name]
    browser, page, errors = V.open_page(pw, VIEWPORTS[vpname], 5 if name == "fold" else 3)
    P = T.Player(page, OUT, 3, mistakes=False)
    snap = (lambda s: side_dump(page, f"{name} {s}")) if dump else (lambda s: shoot(page, vpname, f"{name}-{s}"))
    try:
        if want:
            page.evaluate(WANT_JS[want])
        V.lab(page, key, level)
        page.wait_for_selector("#intro:not(.hidden) .ic-card", timeout=15000)
        time.sleep(1.2)
        snap("popup")
        if n:
            V.moves(P, n)
            time.sleep(0.9)
            snap("sidebar")
        elif name == "chai":
            # at the tray the person's rows appear: parts straight under the headline
            play(P, lambda pg: pg.evaluate("document.querySelectorAll('#mission .oc-card .oc-part').length > 0"))
            play(P, lambda pg: pg.evaluate("document.querySelectorAll('#mission .oc-part.done').length > 0"), limit=60)
            time.sleep(0.8)
            snap("sidebar")
            # the order big again (the pop-up at full size, with the tray's rows)
            page.evaluate("() => { Cook.UI.mission.introduce({ pause: 60000 }); }")
            page.wait_for_selector("#intro:not(.hidden) .ic-card", timeout=10000)
            time.sleep(1.0)
            snap("popup-tray")
        elif name == "fold":
            ok = play(P, lambda pg: pg.evaluate("document.querySelectorAll('#mission .oc-card.folded').length === 1 && document.querySelectorAll('#mission .oc-card:not(.done)').length >= 1"))
            if ok:
                time.sleep(0.9)
                snap("sidebar")
            else:
                print("   (no moment with one folded and one open card)")
    finally:
        browser.close()
    if errors:
        print("   page errors:", errors[:3])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--only", default="")
    ap.add_argument("--dump", action="store_true")
    args = ap.parse_args()
    T.start_server()
    names = [s for s in args.only.split(",") if s] or MATRIX
    with sync_playwright() as pw:
        for vpname in list(VIEWPORTS) if args.all else ["laptop"]:
            print(vpname)
            for name in names:
                run(pw, vpname, name, dump=args.dump)


if __name__ == "__main__":
    main()
