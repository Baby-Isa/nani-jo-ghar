#!/usr/bin/env python3
"""End-of-station pop-up and collapsing person cards (docs/design/cook-design-system-v1.md 10; docs/VISUAL-QA.md).

  python3 build/shoot_end_popup.py          # laptop only (iterating: VISUAL-QA 0)
  python3 build/shoot_end_popup.py --all    # laptop 1366x768 and phone 390x844

Pictures go to build/reports/end-popup/ as {viewport}-{state}.jpg:
  popup-1-badges   the pop-up's first step (a mixed round)
  popup-2-words    the word review, inside the same card
  popup-3-actions  the last step: the words with Again / All stations at the card's foot (after a speaker tap)
  station-end      a real Chai tray run's pop-up at its last step
  sidebar-fold     the Chai tray sidebar with one person's card collapsed and one still open
"""
import argparse
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shoot_sidebar_v3 as V  # noqa: E402
import test_cook as T  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

OUT = os.path.join(T.ROOT, "build", "reports", "end-popup")
VIEWPORTS = {
    "laptop": {"width": 1366, "height": 768, "touch": False},
    "phone": {"width": 390, "height": 844, "touch": True},
}

POPUP_JS = """() => {
  // a mixed round with the game's own words (data/cook.json): two missed, five right
  const W = Cook.data.words;
  const ids = Object.keys(W);
  const find = (k) => ids.find((id) => W[id].kutchi === k);
  const w = (k, right) => { const id = find(k); return { id, kutchi: W[id].kutchi, english: W[id].english, right }; };
  const words = [w("dudh", false), w("elchi", false), w("khun", true), w("chai", true), w("aadu", true), w("trae", true), w("gos", true)];
  Results.show({ mode: "cook", game: "shoot", level: 1, timeMs: 42000, right: 5, total: 7, hints: 1, words, speak: () => new Promise((r) => setTimeout(r, 1500)),
    actions: [{ id: "again", label: "Again", icon: "again", elId: "lab-again" }, { id: "list", label: "All stations", icon: "grid", elId: "lab-list", primary: true }] });
}"""


def shoot(page, vpname, name):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{vpname}-{name}.jpg")
    page.screenshot(path=path, type="jpeg", quality=88)
    print("  ", os.path.relpath(path, T.ROOT))


def popup(pw, vpname):
    browser, page, errors = V.open_page(pw, VIEWPORTS[vpname], 3)
    try:
        # a stored best, so the stopwatch reads as a plain (not first-ever) time
        page.evaluate("UIStore.set('bests', Results.bestKey('cook', 'shoot', 1), 30000)")
        page.evaluate(POPUP_JS)
        page.wait_for_function("[...document.querySelectorAll('.rs-badge')].every((b) => b.classList.contains('in')) && !document.querySelector('.rs-acc.tier-pending')", timeout=15000)
        time.sleep(1.2)
        shoot(page, vpname, "popup-1-badges")
        page.click(".njg-results .rs-next")
        time.sleep(0.8)
        shoot(page, vpname, "popup-2-words")
        page.click(".njg-results .rs-word.bad")
        time.sleep(0.3)
        shoot(page, vpname, "popup-3-actions")
    finally:
        browser.close()
    if errors:
        print("   page errors:", errors[:3])


def chai(pw, vpname):
    """A two-person Chai tray: the sidebar once the first person's card has folded, then the station's end."""
    vp = dict(VIEWPORTS[vpname])
    if vpname == "phone":
        vp = {"width": 844, "height": 390, "touch": True}  # the game plays sideways on a phone
    browser, page, errors = V.open_page(pw, vp, 5)
    P = T.Player(page, OUT, 3, mistakes=False)
    try:
        V.lab(page, "chai-tray", 2)
        page.wait_for_selector("#intro:not(.hidden) .ic-card", timeout=15000)
        time.sleep(0.8)
        got = False
        t0 = time.time()
        while time.time() - t0 < 200:
            if page.evaluate("document.querySelectorAll('#mission .icard.person.folded').length === 1 && document.querySelectorAll('#mission .icard.person:not(.done)').length >= 1"):
                if not got:
                    time.sleep(0.8)
                    shoot(page, vpname, "sidebar-fold")
                    got = True
            if page.evaluate("(() => { const b = document.querySelector('.njg-results #lab-list'); return !!b && b.offsetParent !== null; })()"):
                time.sleep(0.6)
                shoot(page, vpname, "station-end")
                break
            e = P.exp()
            if not e or e["kind"] == "wait":
                time.sleep(0.1)
                continue
            if e.get("intro"):
                page.click("#intro .ic-card", force=True)
                P.wait_change(e, 10)
                continue
            if e["kind"] == "click" and "#lab-list" in e.get("selector", ""):
                time.sleep(0.1)
                continue
            P.act(e)
            P.wait_change(e, 20)
        if not got:
            print("   (no moment with one folded and one open card)")
    finally:
        browser.close()
    if errors:
        print("   page errors:", errors[:3])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--only", default="popup,chai")
    args = ap.parse_args()
    T.start_server()
    only = args.only.split(",")
    with sync_playwright() as pw:
        for vpname in ["laptop", "phone"] if args.all else ["laptop"]:
            if "popup" in only:
                popup(pw, vpname)
            if "chai" in only:
                chai(pw, vpname)


if __name__ == "__main__":
    main()
