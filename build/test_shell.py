#!/usr/bin/env python3
"""End-to-end test for the app shell ("one app, one save", phase B).

At phone (915x375), iPad (1024x768) and laptop (1366x768) sizes, in a
fresh browser (a new device):
  1. first launch: index.html goes straight into Cook's pantry round (the
     play button, then day 1's first order, played with Cook's own test
     player through real taps), and lands on the house after it;
  2. house -> the clinic -> home (the corner button) -> Cook (its title,
     with the corner button) -> home;
  3. progress is kept after a reload (the one save: word stages, coins,
     the first-round flag), and the house comes up directly;
  4. a second player (added in "Who's playing?") has a separate save and
     gets their own first round; switching back finds the first player's
     progress untouched;
  5. (laptop) a device with the old per-mode keys: migrated, no first
     round, Cook shows the old coins; Find it from the house; ?labs=1
     shows the coming-soon doors; the grown-ups' hold opens the save panel.

Usage:
  COOK_TEST_PORT=8860 python3 build/test_shell.py                 # all three sizes
  COOK_TEST_PORT=8860 python3 build/test_shell.py --viewport phone
Screenshots: build/screenshots/shell/<viewport>/.
"""
import argparse
import json
import os
import sys
import time

from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_cook as TC  # noqa: E402  (Cook's player: plays a round through real taps)

ROOT = TC.ROOT
PORT = TC.PORT
BASE = f"http://127.0.0.1:{PORT}"
SHOTS = os.path.join(ROOT, "build", "screenshots", "shell")
VIEWPORTS = {
    "phone": {"name": "phone", "width": 915, "height": 375, "touch": True},
    "ipad": {"name": "ipad", "width": 1024, "height": 768, "touch": True},
    "laptop": {"name": "laptop", "width": 1366, "height": 768, "touch": False},
}
SPEED = 3


def chromium(pw):
    exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
    return pw.chromium.launch(executable_path=exe, args=["--autoplay-policy=no-user-gesture-required"])


class Run:
    def __init__(self, page, shots):
        self.page = page
        self.shots = shots
        self.n = 0

    def shot(self, name):
        self.n += 1
        self.page.screenshot(path=os.path.join(self.shots, f"{self.n:02d}-{name}.png"))

    def at(self, path):
        return path in self.page.url

    def wait_url(self, part, timeout=20):
        # (the sync API only sees a navigation while it's pumping events: never time.sleep here)
        try:
            self.page.wait_for_url(lambda u: part in u, timeout=timeout * 1000)
        except Exception:
            raise AssertionError(f"expected {part}, still at {self.page.url}")
        self.page.wait_for_load_state("load")

    def save(self, expr):
        return self.page.evaluate(f"(() => {{ Save.init(); return {expr}; }})()")

    def visible(self, sel):
        return self.page.evaluate("(s) => { const e = document.querySelector(s); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[hidden]'); }", sel)

    def tap_sel(self, sel, what=None):
        """Tap the middle of an element, checking nothing covers it."""
        # (right after a page change the cross-fade covers everything for ~180ms: wait it out)
        for _ in range(20):
            box = self.page.locator(sel).first.bounding_box()
            assert box, f"{what or sel} not on screen"
            x, y = box["x"] + box["width"] / 2, box["y"] + box["height"] / 2
            top = self.page.evaluate("([x,y,s]) => { const e = document.elementFromPoint(x,y); return !!(e && e.closest(s)); }", [x, y, sel])
            if top:
                break
            self.page.wait_for_timeout(150)
        assert top, f"{what or sel} is covered at ({x:.0f},{y:.0f})"
        self.page.mouse.click(x, y)

    def house(self, doors=("cook", "find", "clinic")):
        self.wait_url("index.html")
        self.page.wait_for_selector("a.door", timeout=10000)
        st = self.page.evaluate("__home.state()")
        for d in doors:
            assert d in st["doors"], f"door {d} missing: {st['doors']}"
        # every door fits on the screen without scrolling (no lab doors)
        if "tidy" not in st["doors"]:
            bottom = self.page.evaluate("Math.max(...Array.from(document.querySelectorAll('a.door')).map(a => a.getBoundingClientRect().bottom))")
            h = self.page.viewport_size["height"]
            assert bottom <= h, f"doors run off the bottom ({bottom:.0f} > {h})"
        return st


def play_first_round(R, vp):
    """The first launch: straight from index.html into the pantry round, then home."""
    page = R.page
    page.goto(f"{BASE}/index.html?speed={SPEED}")
    R.wait_url("cook.html")
    assert "first=1" in page.url and "app=1" in page.url, page.url
    page.wait_for_selector("#njg-play", timeout=10000)
    page.wait_for_timeout(1000 * 0.8)
    assert R.visible("#njg-first"), "the play button covers the page on a first launch"
    assert not R.visible("#njg-home"), "no home button before the first round"
    R.shot("first-launch-play")
    assert R.save("Save.players().length") == 1, "a first player was made"
    R.tap_sel("#njg-play", "the play button")
    # Cook's own player drives the round (intro card, the pantry taps, the end-of-round screen)
    P = TC.Player(page, R.shots, SPEED, mistakes=False)
    P.n = 100
    t0 = time.time()
    try:
        P.play(lambda: "index.html" in page.url, timeout=400)
    except Exception as e:  # the page navigating home mid-evaluate
        try:
            R.wait_url("index.html", 10)
        except AssertionError:
            raise e
        print("   (navigated home while the player was looking:", str(e).splitlines()[0][:80], ")")
    R.house()
    print(f"  {vp}: first launch -> pantry round -> house in {time.time() - t0:.0f}s")
    page.wait_for_timeout(1000 * 0.6)
    R.shot("house-after-first-round")
    cook = R.save("Save.get('cook')")
    assert cook.get("orders", 0) >= 1, f"the pantry order is saved: {cook.get('orders')}"
    assert cook.get("words"), "word stages saved"
    assert R.save("Save.flag('firstDone')") is True
    return cook


def run(vp_name):
    vp = VIEWPORTS[vp_name]
    shots = os.path.join(SHOTS, vp_name)
    os.makedirs(shots, exist_ok=True)
    for f in os.listdir(shots):
        os.remove(os.path.join(shots, f))
    errors = []
    with sync_playwright() as pw:
        browser = chromium(pw)
        ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
        ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        ctx.route("**/fonts.gstatic.com/**", lambda r: r.abort())
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(f"{page.url}: {e}"))
        page.on("console", lambda m: errors.append(f"{page.url}: {m.text}") if m.type == "error" else None)
        page.on("dialog", lambda d: d.accept())
        R = Run(page, shots)

        # 1. first launch -> the pantry round -> the house
        cook1 = play_first_round(R, vp_name)
        p1 = R.save("Save.currentId()")

        # 2. house -> clinic -> home -> Cook -> home
        R.tap_sel('a.door[data-door="clinic"]', "the clinic door")
        R.wait_url("clinic.html")
        assert "app=1" in page.url
        page.wait_for_timeout(1000 * 4)
        assert R.visible("#njg-home"), "the clinic has the home button"
        R.shot("clinic")
        R.tap_sel("#njg-home", "the clinic's home button")
        R.house()
        page.wait_for_timeout(400)
        R.shot("house-from-clinic")
        R.tap_sel('a.door[data-door="cook"]', "the Cook door")
        R.wait_url("cook.html")
        page.wait_for_selector("#panel h1", timeout=20000)
        page.wait_for_timeout(1000 * 0.8)
        assert "first=1" not in page.url
        assert R.visible("#njg-home"), "Cook's title has the home button"
        coins = page.evaluate("Cook.save.coins")
        assert coins == cook1["coins"], f"Cook reads the one save: {coins} != {cook1['coins']}"
        R.shot("cook-title")
        R.tap_sel("#njg-home", "Cook's home button")
        R.house()

        # 3. progress kept after a reload
        page.reload()
        R.house()
        assert R.save("Save.get('cook').orders") == cook1["orders"]
        assert R.save("Save.get('cook').words") == cook1["words"], "word stages survive a reload"
        assert R.save("Save.currentId()") == p1
        print(f"  {vp_name}: reload keeps {len(cook1['words'])} word stages, {cook1['coins']} coins")

        # 4. a second player with a separate save
        R.tap_sel("#who", "who's playing")
        page.wait_for_selector("#picker:not([hidden]) .add-tile")
        R.shot("picker")
        R.tap_sel(".add-tile", "add a player")
        page.fill("#picker input[name=name]", "Maryam")
        page.locator("#picker .swatches button").nth(3).click()
        R.shot("picker-add")
        page.click("#picker button[type=submit]")
        R.wait_url("cook.html")
        assert "first=1" in page.url, "a new player gets the first round too"
        p2 = R.save("Save.currentId()")
        assert p2 != p1
        assert R.save("Save.current().name") == "Maryam"
        assert R.save("Save.has('cook')") is False, "Maryam starts with an empty save"
        assert R.save(f"Save.get('cook', '{p1}').coins") == cook1["coins"], "Player 1's save untouched"
        page.goto(f"{BASE}/index.html")
        R.wait_url("cook.html")  # Maryam hasn't had her first round: the house sends her there
        page.goto(f"{BASE}/index.html?from=test")
        R.wait_url("cook.html")
        # switch back to Player 1 from a mode page opened with the old URL (a tester's way)
        page.evaluate(f"Save.select('{p1}'); sessionStorage.clear()")
        page.goto(f"{BASE}/index.html")
        R.house()
        st = page.evaluate("__home.state()")
        assert st["picker"], "two players: who's playing? comes first in a new visit"
        R.shot("picker-two-players")
        page.locator(f'#picker .tile[data-id="{p1}"]').click()
        R.house()
        assert R.save("Save.currentId()") == p1
        assert R.save("Save.get('cook').coins") == cook1["coins"]
        name = page.evaluate("document.querySelector('#who .nm').textContent")
        assert name == "Player 1", name

        # the old URL still works and uses the same save
        page.goto(f"{BASE}/cook.html")
        page.wait_for_selector("#panel h1", timeout=20000)
        assert page.evaluate("Cook.save.coins") == cook1["coins"], "cook.html opened directly reads the same save"
        assert not R.visible("#njg-home"), "no shell button outside the app"

        if vp_name == "laptop":
            # 5a. find from the house
            page.goto(f"{BASE}/index.html")
            R.house()
            R.tap_sel('a.door[data-door="find"]', "the Find it door")
            R.wait_url("find.html")
            page.wait_for_selector("#panel h1", timeout=20000)
            page.wait_for_timeout(1000 * 0.5)
            assert R.visible("#njg-home")
            R.shot("find-title")
            R.tap_sel("#njg-home")
            R.house()
            # 5b. the coming-soon doors
            page.goto(f"{BASE}/index.html?labs=1")
            R.house(doors=("cook", "find", "clinic", "tidy", "who", "dress", "monsoon", "snap"))
            R.shot("house-labs")
            # 5c. grown-ups: a tap does nothing, a hold opens it
            page.click("#grownups")
            page.wait_for_timeout(1000 * 0.3)
            assert not R.visible("#grown .card"), "a short tap doesn't open the grown-ups' panel"
            box = page.locator("#grownups").bounding_box()
            page.mouse.move(box["x"] + 20, box["y"] + 20)
            page.mouse.down()
            page.wait_for_timeout(1000 * 1.8)
            page.mouse.up()
            assert R.visible("#grown .card"), "holding opens it"
            R.shot("grown-ups")
            with page.expect_download() as dl:
                page.click("#export")
            path = dl.value.path()
            data = json.load(open(path))
            assert data["format"] == "nani-jo-ghar-save" and len(data["root"]["players"]) == 2
            print(f"  {vp_name}: exported a save file with {len(data['root']['players'])} players")
            page.click("#grown .close")
        ctx.close()

        if vp_name == "laptop":
            # 5d. a device from before the shell: the old keys migrate, no first round
            ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]})
            ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
            page = ctx.new_page()
            page.on("pageerror", lambda e: errors.append(f"{page.url}: {e}"))
            R = Run(page, shots)
            R.n = 50
            page.goto(f"{BASE}/labs.html")
            old = TC.open_kitchen_save()
            old["coins"] = 123
            page.evaluate("(s) => { localStorage.setItem('njg-cook-v1', JSON.stringify(s)); localStorage.setItem('njg-shared-ui-fallback-v1', JSON.stringify({bests: {'cook:x:1': 9000}})); }", old)
            page.goto(f"{BASE}/index.html")
            R.house()
            assert R.save("Save.get('cook').coins") == 123
            assert R.save("Save.get('ui').bests['cook:x:1']") == 9000
            R.tap_sel('a.door[data-door="cook"]')
            R.wait_url("cook.html")
            page.wait_for_selector("#panel h1", timeout=20000)
            assert page.evaluate("Cook.save.coins") == 123, "the old save shows in Cook"
            R.shot("migrated-cook-title")
            print(f"  {vp_name}: a pre-shell save migrated (123 coins, bests) with no first round")
            ctx.close()
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_FAILED" not in e and "net::" not in e]
    if bad:
        raise AssertionError("console errors:\n  " + "\n  ".join(bad[:8]))
    print(f"  {vp_name}: PASS ({len(os.listdir(shots))} screenshots in {os.path.relpath(shots, ROOT)})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--viewport", choices=list(VIEWPORTS), default=None)
    args = ap.parse_args()
    TC.start_server()
    for vp in [args.viewport] if args.viewport else list(VIEWPORTS):
        print(f"== {vp}")
        run(vp)


if __name__ == "__main__":
    main()
