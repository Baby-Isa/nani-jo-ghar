#!/usr/bin/env python3
"""End-to-end test for the first launch (docs/first-launch-story.md; first.html).

At phone (915x375), iPad (1024x768) and laptop (1366x768) sizes, in a
fresh browser (a new device):
  1. index.html sends a new player to first.html: make your character
     (every category changed through the picture swatches, the big one on
     the left follows), then the big tick;
  2. arrive at Nani's house (read-along card: English, then Kutchi), the
     arrow; Cook's pantry round (Nani's list is the chai things), played by
     Cook's own test player through real taps; back to the story;
  3. "Can you make me chai?" (a reload here comes back to the same scene);
     Cook's chai round (one cup, Nani's); Nani sips;
  4. the Eid picture story, four panels (a reload in the middle starts the
     panels again); Yes / No: No runs away twice and Nani laughs, Yes works;
  5. home, with firstDone, the character in the save (with the Cook hands
     skin) and on the player badge;
  6. a second player gets their own character (defaults, not the first
     player's), and the "Story help" setting (grown-ups) makes the story
     Kutchi only.

Usage:
  COOK_TEST_PORT=8880 python3 build/test_first_launch.py                 # all three sizes
  COOK_TEST_PORT=8880 python3 build/test_first_launch.py --viewport phone
Screenshots: build/screenshots/first-launch/<viewport>/.
"""
import argparse
import json
import os
import sys
import time

from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import test_cook as TC  # noqa: E402
import test_shell as TS  # noqa: E402

ROOT = TC.ROOT
BASE = f"http://127.0.0.1:{TC.PORT}"
SHOTS = os.path.join(ROOT, "build", "screenshots", "first-launch")
SPEED = 3
PICKS = {"body": "girl", "skin": "s4", "hair": "h3", "eyes": "e4", "top": "t4", "bottom": "b5"}


def on_page(page, name):
    return page.url.split("?")[0].endswith("/" + name)


def story(page):
    return page.evaluate("window.__story ? __story.state() : null")


def wait_scene(R, scene, timeout=20):
    t0 = time.time()
    while time.time() - t0 < timeout:
        try:
            st = story(R.page)
        except Exception:
            st = None
        if st and st["scene"] == scene:
            return st
        R.page.wait_for_timeout(100)
    raise AssertionError(f"expected scene {scene}, got {st and st['scene']} at {R.page.url}")


def next_arrow(R, name=None, timeout=30):
    R.page.wait_for_selector("#st-next.in", timeout=timeout * 1000)
    R.page.wait_for_timeout(350)
    if name:
        R.shot(name)
    R.tap_sel("#st-next", "the arrow")
    R.page.wait_for_timeout(250)


def card_chunks(page):
    return page.evaluate("Array.from(document.querySelectorAll('.st-card:not(.st-reply) .chunk')).map(p => [p.classList.contains('en') ? 'en' : 'k', p.textContent])")


def make_character(R, picks, name):
    page = R.page
    page.wait_for_selector(".cm .cm-sw", timeout=15000)
    page.wait_for_timeout(500)
    R.shot(f"{name}-start")
    before = page.evaluate("document.querySelector('.cm-char').innerHTML")
    for cat, sw in picks.items():
        R.tap_sel(f'.cm-tab[data-cat="{cat}"]', f"the {cat} tab")
        page.wait_for_selector(f'.cm-swatches[data-cat="{cat}"]')
        R.tap_sel(f'.cm-sw[data-sw="{sw}"]', f"swatch {sw}")
        page.wait_for_timeout(120)
        assert page.evaluate("__charmaker.choices()")[cat] == sw
    after = page.evaluate("document.querySelector('.cm-char').innerHTML")
    assert after != before, "the big character follows the choices"
    # everything fits: no swatch or the tick off the screen
    off = page.evaluate(
        "() => Array.from(document.querySelectorAll('.cm-sw, .cm-tab, .cm-done')).filter(e => { const r = e.getBoundingClientRect(); return r.bottom > innerHeight + 1 || r.right > innerWidth + 1 || r.width < 40; }).length"
    )
    assert off == 0, f"{off} swatches/tabs off the screen or too small"
    R.shot(f"{name}-made")
    R.tap_sel("#cm-done", "the tick")


def cook_round(R, kind, vp):
    page = R.page
    R.wait_url("cook.html")
    assert f"first={kind}" in page.url and "then=" in page.url, page.url
    page.wait_for_selector("#njg-play", timeout=15000)
    page.wait_for_timeout(700)
    R.tap_sel("#njg-play", "the play button")
    P = TC.Player(page, R.shots, SPEED, mistakes=False)
    P.n = 100 if kind == "pantry" else 200
    t0 = time.time()
    try:
        P.play(lambda: on_page(page, "first.html"), timeout=400)
    except Exception as e:  # the page navigating mid-evaluate
        try:
            R.wait_url("first.html", 15)
        except AssertionError:
            raise e
    R.wait_url("first.html")
    print(f"  {vp}: Cook's {kind} round in {time.time() - t0:.0f}s")


def run(vp_name):
    vp = TS.VIEWPORTS[vp_name]
    shots = os.path.join(SHOTS, vp_name)
    os.makedirs(shots, exist_ok=True)
    for f in os.listdir(shots):
        os.remove(os.path.join(shots, f))
    errors = []
    with sync_playwright() as pw:
        browser = TS.chromium(pw)
        ctx = browser.new_context(viewport={"width": vp["width"], "height": vp["height"]}, has_touch=vp["touch"])
        ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        ctx.route("**/fonts.gstatic.com/**", lambda r: r.abort())
        page = ctx.new_page()
        page.on("pageerror", lambda e: errors.append(f"{page.url}: {e}"))
        page.on("console", lambda m: errors.append(f"{page.url}: {m.text}") if m.type == "error" else None)
        page.on("dialog", lambda d: d.accept())
        R = TS.Run(page, shots)
        t0 = time.time()

        # 1. a new device: straight to the first launch, the character first
        page.goto(f"{BASE}/index.html?speed={SPEED}")
        R.wait_url("first.html")
        assert "app=1" in page.url
        wait_scene(R, "character")
        assert not R.visible("#njg-home"), "no home button during the first launch"
        make_character(R, PICKS, "character")
        p1 = R.save("Save.currentId()")
        rec = R.save("Character.get()")
        assert rec and rec["choices"] == PICKS, rec
        assert rec["hands"] == "player-girl", rec

        # 2. arrive; the pantry round
        wait_scene(R, "arrive")
        page.wait_for_selector(".st-card.in")
        ch = card_chunks(page)
        assert [c[0] for c in ch] == ["en", "k"], f"English, then Kutchi: {ch}"
        next_arrow(R, "arrive")
        cook_round(R, "pantry", vp_name)
        words = R.save("Object.keys(Save.get('cook').words || {})")
        for w in ("cook-chai", "cook-dudh", "cook-khun"):
            assert w in words, f"Nani's list is the chai things: {words}"
        assert not R.save("Save.flag('firstDone')"), "not done yet"

        # 3. "Can you make me chai?"; a reload comes back to the same scene
        wait_scene(R, "ask-chai")
        page.wait_for_selector("#st-next.in", timeout=30000)
        assert "make-chai" in story(page)["lines"]
        page.goto(f"{BASE}/first.html?app=1&speed={SPEED}")
        wait_scene(R, "ask-chai")
        print(f"  {vp_name}: a reload after the pantry round comes back to 'Can you make me chai?'")
        next_arrow(R, "ask-chai")
        cook_round(R, "chai", vp_name)
        cook = R.save("Save.get('cook')")
        assert (cook.get("taught") or {}).get("chai"), "the chai round was played"
        wait_scene(R, "sip")
        next_arrow(R, "sip")

        # 4. the Eid picture story; a reload mid-way starts the panels again
        wait_scene(R, "eid")
        for i in range(4):
            page.wait_for_selector("#st-next.in", timeout=30000)
            assert story(page)["panel"] == i
            if i == 2 and not getattr(run, "reloaded", False):
                page.reload()
                wait_scene(R, "eid")
                page.wait_for_selector("#st-next.in", timeout=30000)
                assert story(page)["panel"] == 0, "a reload in the story starts its panels again"
                print(f"  {vp_name}: a reload in the picture story starts it again")
                for j in range(2):
                    next_arrow(R)
                    page.wait_for_selector("#st-next.in", timeout=30000)
                run.reloaded = True
            next_arrow(R, f"eid-panel-{i + 1}")
        run.reloaded = False

        # Yes / No
        wait_scene(R, "help")
        page.wait_for_selector(".st-choice.in .st-no", timeout=30000)
        page.wait_for_timeout(400)
        R.shot("yes-no")
        for k in range(2):
            box = page.locator(".st-no").bounding_box()
            page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            page.wait_for_timeout(450)
        st = story(page)
        assert st["dodges"] >= 2, st
        page.wait_for_timeout(300)
        R.shot("no-runs-away")
        page.wait_for_function("document.querySelector('.st-no').classList.contains('gone')")
        assert "laugh" in story(page)["lines"], "Nani laughs"
        assert story(page)["choice"] == "asked", "No never answers"
        R.tap_sel(".st-yes", "Yes")
        page.wait_for_timeout(500)
        R.shot("yes")

        # 5. home
        R.house()
        assert R.save("Save.flag('firstDone')") is True
        page.wait_for_selector("#who .dot.has-char svg", timeout=5000)
        page.wait_for_timeout(400)
        R.shot("home-with-character")
        print(f"  {vp_name}: first launch done in {time.time() - t0:.0f}s")

        # 6. a second player: their own character; Story help: Kutchi only
        R.tap_sel("#who", "who's playing")
        page.wait_for_selector("#picker:not([hidden]) .add-tile")
        R.tap_sel(".add-tile", "add a player")
        page.fill("#picker input[name=name]", "Zayn")
        page.click("#picker button[type=submit]")
        R.wait_url("first.html")
        wait_scene(R, "character")
        page.wait_for_selector(".cm .cm-sw")
        assert page.evaluate("__charmaker.choices()")["body"] == "boy", "a new player starts from the defaults"
        make_character(R, {"body": "boy", "hair": "h5", "top": "t3"}, "second-character")
        p2 = R.save("Save.currentId()")
        assert p2 != p1
        c2 = R.save("Character.get()")["choices"]
        assert c2["hair"] == "h5" and c2["body"] == "boy"
        assert R.save(f"Character.get('{p1}').choices") == PICKS, "the first player's character is untouched"
        wait_scene(R, "arrive")
        # the grown-ups' Story help: Kutchi only
        page.evaluate("Save.setSetting('storyHelp', 'k')")
        page.reload()
        wait_scene(R, "arrive")
        page.wait_for_selector(".st-card.in")
        ch = card_chunks(page)
        assert [c[0] for c in ch] == ["k"], f"Kutchi only: {ch}"
        page.wait_for_selector("#st-next.in", timeout=30000)
        R.shot("second-player-kutchi-only")
        print(f"  {vp_name}: a second player made their own character; Story help 'Kutchi only' works")
        # the setting is in the grown-ups' panel
        page.evaluate(f"Save.select('{p1}')")
        page.goto(f"{BASE}/index.html?from=test")
        R.house()
        page.evaluate("document.querySelector('#grownups') && null")
        box = page.locator("#grownups").bounding_box()
        page.mouse.move(box["x"] + 20, box["y"] + 20)
        page.mouse.down()
        page.wait_for_timeout(1800)
        page.mouse.up()
        page.wait_for_selector("#story-help [data-help='k'][aria-pressed='true']")
        R.tap_sel("#story-help [data-help='en-k']")
        assert R.save("Save.setting('storyHelp')") == "en-k"
        R.shot("grown-ups-story-help")
        data = json.loads(R.save("Save.exportJSON()"))
        assert data["data"][p1]["character"]["choices"] == PICKS, "the character is in the save file"
        ctx.close()
        browser.close()
    bad = [e for e in errors if "fonts" not in e and "ERR_" not in e and "net::" not in e]
    if bad:
        raise AssertionError("console errors:\n  " + "\n  ".join(bad[:8]))
    print(f"  {vp_name}: PASS ({len(os.listdir(shots))} screenshots in {os.path.relpath(shots, ROOT)})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--viewport", choices=list(TS.VIEWPORTS), default=None)
    args = ap.parse_args()
    TC.start_server()
    for vp in [args.viewport] if args.viewport else list(TS.VIEWPORTS):
        print(f"== {vp}")
        run(vp)


if __name__ == "__main__":
    main()
